import {content, createTextBox, textBox} from '/js/dialog.js';
import {Alert} from '/js/infoWindow.js';

import {game} from '/js/index.js';
import align from "phaser3-rex-plugins/plugins/utils/align";
import timer from "phaser3-rex-plugins/plugins/time/progresses/Timer";


const countBox = 0;

export class WorldScene extends Phaser.Scene {


    constructor() {
        super("WorldScene");
    }
    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
        this.load.plugin('rexlifetimeplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexlifetimeplugin.min.js', true);

        this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');
        this.load.image('icon', 'https://i.ibb.co/nsFwQdp/astro4.png');
    }

    create() {
        // создаем карту
        let map = this.make.tilemap({key: 'map'});

        let tileSetFloor = map.addTilesetImage('tilesFloor', 'tileFloor');
        let floor = map.createLayer('floor', tileSetFloor);

        let tileSetWall = map.addTilesetImage('tilesWalls', 'tileWalls');
        let wall = map.createLayer('wall', tileSetWall);

        let tileSetStuff = map.addTilesetImage('tilesStuff', 'tileStuff');
        let stuff = map.createLayer('stuff', tileSetStuff);

        let access = map.createLayer('access', tileSetStuff);

        wall.setCollisionByExclusion([-1]);
        stuff.setCollisionByExclusion([-1]);
        access.setCollisionByExclusion([-1]);
        floor.setCollisionByProperty({collides: false});

        //добавление персонажа
        this.player = this.physics.add.sprite(190, 60, 'player');
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();
        // ограничиваем камеру размерами карты
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // заставляем камеру следовать за игроком
        this.cameras.main.startFollow(this.player);
        //предотвратить пояление полос в тайлах
        this.cameras.main.roundPixels = true;

        // анимация клавиши 'left' для персонажа
        // мы используем одни и те же спрайты для левой и правой клавиши, просто зеркалим их
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', {start:5, end:8}),
            frameRate: 10,
            repeat: -1
        });
        // анимация клавиши 'right' для персонажа
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', {start:5, end:8}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', {start:5, end:8}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', {start:5, end:8}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'spin',
            frames: this.anims.generateFrameNumbers('player', {start:0, end:4}),
            frameRate: 7,
            repeat: -1
        });
        this.player.anims.play('spin');

        //обработка столкновений со стенами и предметами
        this.physics.add.collider(this.player, wall);
        this.physics.add.collider(this.player, stuff);
        this.physics.add.collider(this.player, access);


        //добавляем нпс робота
        let s_robot;
        s_robot = this.physics.add.sprite(230, 100, 's_robot');
        s_robot.setCollideWorldBounds(true);
        this.anims.create({
            key: 'swish',
            frames: this.anims.generateFrameNumbers('s_robot', {start:0, end:3}),
            frameRate: 10,
            repeat: -1
        });
        s_robot.flipX = false;
        s_robot.anims.play('swish');
        this.physics.add.overlap(this.player, s_robot, this.hit_start, false, this);
        //game.time.events.add(Phaser.Timer.SECOND*5, this.hit_start, this); чо не работаем блин


        //добавление коробочек с деталями
        this.anims.create({
            key: 'box_run',
            frames: this.anims.generateFrameNumbers('box', {start:0, end:3}),
            frameRate: 8,
            repeat: -1
        });
        this.boxKeyboard = this.physics.add.sprite(100, 200, "box");
        this.boxKeyboard.anims.play('box_run');
        this.physics.add.overlap(this.player, this.boxKeyboard, this.collectBoxKeyboard, false, this);

        this.boxMotherboard = this.physics.add.sprite(340, 255, "box");
        this.boxMotherboard.anims.play('box_run');
        this.physics.add.overlap(this.player, this.boxMotherboard, this.collectBoxMotherboard, false, this);

        this.boxProcessor = this.physics.add.sprite(650, 110, "box");
        this.boxProcessor.anims.play('box_run');
        this.physics.add.overlap(this.player, this.boxProcessor, this.collectBoxProcessor, false, this);

        this.boxCPUcooling = this.physics.add.sprite(665, 365, "box");
        this.boxCPUcooling.anims.play('box_run');
        this.physics.add.overlap(this.player, this.boxCPUcooling, this.collectBoxCPUcooling, false, this);

        this.boxRAM = this.physics.add.sprite(280, 500, "box");
        this.boxRAM.anims.play('box_run');
        this.physics.add.overlap(this.player, this.boxRAM, this.collectBoxRAM, false, this);

        this.boxVideocard = this.physics.add.sprite(730, 620, "box");
        this.boxVideocard.anims.play('box_run');
        this.physics.add.overlap(this.player, this.boxVideocard, this.collectBoxVideocard, false, this);

        this.boxHardDisk = this.physics.add.sprite(230, 410, "box");
        this.boxHardDisk.anims.play('box_run');
        this.physics.add.overlap(this.player, this.boxHardDisk, this.collectBoxHardDisk, false, this);

        this.boxDVD = this.physics.add.sprite(860, 300, "box");
        this.boxDVD.anims.play('box_run');
        this.physics.add.overlap(this.player, this.boxDVD, this.collectBoxDVD, false, this);

        this.boxPowerUnit = this.physics.add.sprite(470, 520, "box");
        this.boxPowerUnit.anims.play('box_run');
        this.physics.add.overlap(this.player, this.boxPowerUnit, this.collectBoxPowerUnit, false, this);

        this.boxSoundCard = this.physics.add.sprite(960, 480, "box");
        this.boxSoundCard.anims.play('box_run');
        this.physics.add.overlap(this.player, this.boxSoundCard, this.collectBoxSoundCard, false, this);

        this.boxNetworkCard = this.physics.add.sprite(500, 820, "box");
        this.boxNetworkCard.anims.play('box_run');
        this.physics.add.overlap(this.player, this.boxNetworkCard, this.collectBoxNetworkCard, false, this);

        this.boxPorts = this.physics.add.sprite(45, 750, "box");
        this.boxPorts.anims.play('box_run');
        this.physics.add.overlap(this.player, this.boxPorts, this.collectBoxPorts, false, this);

        this.boxUSB = this.physics.add.sprite(850, 600, "box");
        this.boxUSB.anims.play('box_run');
        this.physics.add.overlap(this.player, this.boxUSB, this.collectBoxUSB, false, this);

        /*
        this.boxGroup = this.physics.add.group();

        let array = [
            {
                x: 50,
                y: 100
            },
            {
                x: 500,
                y: 300
            },
            {
                x: 100,
                y: 233
            },
        ];
        let box;

        for(let i = 0; i< array.length; i++)
        {

            box = this.physics.add.sprite(array[i]['x'], array[i]['y'], "box");
            box.anims.create({
                key: 'stars_run',
                frames: this.anims.generateFrameNumbers('box', {start:0, end:3}),
                frameRate: 8,
                repeat: -1
            });
            box.anims.play('stars_run');
            box.setCollideWorldBounds(true);
            this.boxGroup.add(box);
            this.physics.add.overlap(this.player, box, this.collectBox, false, this);
            this.collectBox = function (){
                array.splice(i);
            }
        }

         */

/*
        this.boxGroup = this.physics.add.group();
        let box;

        for(var i= 0; i < 20; i++)
        {

            var xx = Phaser.Math.Between(game.config.width*.1, game.config.width*.9);
            var yy = Phaser.Math.Between(game.config.height*.1, game.config.height*.9);
            box = this.physics.add.sprite(xx, yy, "box");
            box.anims.create({
                key: 'stars_run',
                frames: this.anims.generateFrameNumbers('box', {start:0, end:3}),
                frameRate: 8,
                repeat: -1
            });
            box.anims.play('stars_run');
            box.setCollideWorldBounds(true);
            this.boxGroup.add(box);

        }

 */
        /*let keys;
        keys = this.physics.add.sprite(230, 200, 'stars');
        keys.setCollideWorldBounds(true);
        keys = this.physics.add.group({
            key: 'stars',
            repeat: 11,
            setXY: { x: 12, y: 50, stepX: 70 },
        });

        this.physics.add.overlap(this.player, this.stars, this.collectKey, false, this);
        */
    }

    hit_start() {
        if (this.isRun) {
            return false;
        }
        var emojiCry = String.fromCodePoint(0x1F62D)
        var emojiCute = String.fromCodePoint(0x1F97A)
        var content_start = 'О моя вселенная! В эту лабораторию наконец-то кто-то зашёл! Я так тебе рад! ' + '\n' + '\n' +
            'Пожалуйста, помоги мне, я разваливаюсь на части в прямом смысле этого слова ' + emojiCry + '\n' + '\n' +
            'Пока я спал, эти ужасные учёные разобрали меня почти полностью, остался только монитор.' +
            'По всей лаборатории разбросаны мои комплектующие. ' +
            'Собери их для меня, пока я совсем не отключился, молю! ' +
            'Я буду тебе безмерно благодарен! ' + emojiCute;
        console.log("bam")
        createTextBox(this, 150, 580, {
            id:'dialog_box',
            wrapWidth: 500,
            fixedWidth: 500,
            fixedHeight: 85,
        })
            .start(content_start, 50)

        this.isRun = true;

    }


    collectBoxKeyboard() {
        this.boxKeyboard.disableBody(true, true);
        var scene = this;
        var emojiSmart = String.fromCodePoint(0x1F9D0)
        var icon = this.add.image('icon');

        Alert(scene, 'Клавиатура',
            'О, это же моя любимая игровая главиатура с подсветкой! ' + '\n' +
            'Я так скучал по ней! Давай кое-что расскажу ' + emojiSmart)
            .then(function () {
                return Alert(scene, 'Клавиатура',
                    'Это устройство ввода данных. С помощью клавиатуры мы печатаем тексты ' + '\n' +
                    'и производим всевозможные действия на компьютере. Может подключаться ' + '\n' +
                    'к компьютеру с помощью проводного и беспроводного интерфейса. ' + '\n' +
                    'Клавиатуры бывают стандартные и геймерские. На последних присутствуют' + '\n' +
                    'дополнительные кнопки и выполнен удобный для игр дизайн. ' + '\n' +
                    'У меня, кстати, для настоящих геймеров. Последняя модель!');
            })
            .then(function () {
                return Alert(scene, 'Клавиатура', 'Получено!');

            })

    }
    collectBoxMotherboard() {
        this.boxMotherboard.disableBody(true, true);
        var scene = this;
        var emojiNerd = String.fromCodePoint(0x1F913)
        var icon = this.add.image('icon');
        Alert(scene, 'Материнская плата',
            'Это печатная плата, на которую устанавливаются все комплектующие: ' + '\n' +
            'процессор, оперативная память, видеокарта, жесткие диски и другие. ' + '\n' +
            'Потому ее и назвали материнская, так как она питает все эти компоненты.' + '\n' +
            'Очень важная штука ' + emojiNerd)
            .then(function () {
                return Alert(scene, 'Материнская плата',
                    'Имей в виду, что с каждым годом производители модернизируют ' + '\n' +
                    'модели плат: изменяется стандарт сокета(разъема) для процессора и слотов ' + '\n' +
                    'для оперативной памяти, добавляются новые модули. И при обновлении ' + '\n' +
                    'компьютера это нужно обязательно учитывать, так как новые ' + '\n' +
                    'комплектующие могут не подойти на устаревшую модель материнской платы. ');
            })
            .then(function () {
                return Alert(scene, 'Материнская плата', 'Получено!');

            })
    }
    collectBoxProcessor() {
        this.boxProcessor.disableBody(true, true);
        var scene = this;
        var emojiDisguised = String.fromCodePoint(0x1F978)
        var icon = this.add.image('icon');
        Alert(scene, 'Процессор',
            'Это сердце компьютера. Он обрабатывает весь входящий поток информации, ' + '\n' +
            'распределяя его между остальными комплектующими. Состоит из текстолита, ' + '\n' +
            'на который крепятся микроконтроллеры и установлен кристалл – в нем и ' + '\n' +
            'происходят все вычисления. Покрывается металлической крышкой.' + '\n' +
            'Кристалл смазывается термопастой для отвода тепла на крышку, которую ' + '\n' +
            'охлаждает радиатор (охлаждающее устройство). В современных процессорах ' + '\n' +
            'устанавливается два кристалла, один из которых отвечает за обработку ' + '\n' +
            'графики (встроенная видеокарта). Чем процессор мощнее, тем больше ' + '\n' +
            'он может проводить операций за одну секунду. ')
            .then(function () {
                return Alert(scene, 'Процессор',
                    'В мире есть два главных производителя CPU, это компании Intel и AMD, ' + '\n' +
                    'у процессоров этих компаний свои отдельные разъемы (сокеты) для подключения ' + '\n' +
                    'к материнской плате, т.е. вы не сможете подключить процессор AMD к материнской ' + '\n' +
                    'плате для процессора Intel. Тут все очень серьезно ' + emojiDisguised);
            })
            .then(function () {
                return Alert(scene, 'Процессор', 'Получено!');

            })

    }
    collectBoxCPUcooling() {
        this.boxCPUcooling.disableBody(true, true);
    }
    collectBoxRAM() {
        this.boxRAM.disableBody(true, true);
    }
    collectBoxVideocard() {
        this.boxVideocard.disableBody(true, true);
    }
    collectBoxHardDisk() {
        this.boxHardDisk.disableBody(true, true);
    }
    collectBoxDVD() {
        this.boxDVD.disableBody(true, true);
    }
    collectBoxPowerUnit() {
        this.boxPowerUnit.disableBody(true, true);
    }
    collectBoxSoundCard() {
        this.boxSoundCard.disableBody(true, true);
    }
    collectBoxNetworkCard() {
        this.boxNetworkCard.disableBody(true, true);
    }
    collectBoxPorts() {
        this.boxPorts.disableBody(true, true);
    }
    collectBoxUSB() {
        this.boxUSB.disableBody(true, true);
    }


    update() {

        this.player.body.setVelocity(0);

        // горизонтальное перемещение
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-80);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(80);
        }

        // вертикальное перемещение
        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-80);
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(80);
        }

        let keyInputs = this.input.keyboard.createCursorKeys();

        let leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        let rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        let upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        let downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        let shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        /*if (Phaser.Input.Keyboard.JustDown(shiftKey)) {
            textBox.setVisible(false);
            return Promise.resolve();
        }

         */

        // В конце обновляем анимацию и устанавливаем приоритет анимации
        // left/right над анимацией up/down
        if (Phaser.Input.Keyboard.JustDown(leftKey)) {
            this.player.anims.play('left', true);
            this.player.flipX = true; //Разворачиваем спрайты персонажа вдоль оси X
        }else if (Phaser.Input.Keyboard.JustUp(leftKey)) {
            this.player.anims.play('spin', true);
        } else if (Phaser.Input.Keyboard.JustDown(rightKey)) {
            this.player.anims.play('right', true);
            this.player.flipX = false; //Отменяем разворот спрайтов персонажа вдоль оси X
        }else if (Phaser.Input.Keyboard.JustUp(rightKey)) {
            this.player.anims.play('spin', true);
        } else if (Phaser.Input.Keyboard.JustDown(upKey)) {
            this.player.anims.play('up', true);
        }else if (Phaser.Input.Keyboard.JustUp(upKey)) {
            this.player.anims.play('spin', true);
        } else if (Phaser.Input.Keyboard.JustDown(downKey)) {
            this.player.anims.play('down', true);
        }else if (Phaser.Input.Keyboard.JustUp(downKey)) {
            this.player.anims.play('spin', true);
        }
    }


}