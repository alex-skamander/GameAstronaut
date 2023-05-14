import {content, createTextBox, textBox} from '/js/dialog.js';
import {Alert} from '/js/infoWindow.js';
export var countBox = 0;
export var width;
export var height;

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

        this.createCountBox();

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



    hit_start(event) {
        if (this.isRun) {
            return false;
        }
        var emojiCry = String.fromCodePoint(0x1F62D)
        var emojiCute = String.fromCodePoint(0x1F97A)
        var emojiBox = String.fromCodePoint(0x1F4E6)
        var content_start = 'О моя вселенная! В эту лабораторию наконец-то кто-то зашёл! Я так тебе рад! \n\n' +
            'Пожалуйста, помоги мне, я разваливаюсь на части в прямом смысле этого слова ' + emojiCry + '\n\n' +
            'Пока я спал, эти ужасные учёные разобрали меня почти полностью, остался только монитор.' +
            'По всей лаборатории разбросаны мои комплектующие. Они находятся в коробках, которые уже оприходовали котики ' + emojiBox + '\n\n' +
            'Собери их для меня, пока я совсем не отключился, молю! ' +
            'Я буду тебе безмерно благодарен! ' + emojiCute;
        console.log("bam")
        if (event.key === 'space') {
            window.removeEventListener('keypress', this.hit_start)
        }

        createTextBox(this, 150, 580, {
            id:'dialog_box',
            wrapWidth: 500,
            fixedWidth: 500,
            fixedHeight: 85,
        })
            .start(content_start, 50)
        this.isRun = true;

        window.addEventListener('keypress', this.hit_start)
    }


    createCountBox() {
        var style = { fontSize: '23px', fontFamily:'basis33', fontWeight: 'bolder', fontColor: '#fff' }
        this.scoreText = this.add.text(850, 10, 'Собрано: ' + countBox + '/13', style);

    }


    collectBoxKeyboard() {
        this.boxKeyboard.disableBody(true, true);
        countBox +=1;
        this.scoreText.setText('Собрано: ' + countBox + '/13');
        width = 1000;
        height = 650;
        var emojiSmart = String.fromCodePoint(0x1F9D0);
        var icon = this.add.image('icon');
        var scene = this;
        var name = 'Клавиатура';
        Alert(scene, name,
            'О, это же моя любимая игровая клавиатура с подсветкой! \n' +
            'Я так скучал по ней! Давай кое-что расскажу ' + emojiSmart)
            .then(function () {
                return Alert(scene, name,
                    'Это устройство ввода данных. С помощью клавиатуры мы печатаем тексты \n' +
                    'и производим всевозможные действия на компьютере. Может подключаться \n' +
                    'к компьютеру с помощью проводного и беспроводного интерфейса. \n' +
                    'Клавиатуры бывают стандартные и геймерские. На последних присутствуют\n' +
                    'дополнительные кнопки и выполнен удобный для игр дизайн. \n' +
                    'У меня, кстати, для настоящих геймеров. Последняя модель!');
            })
            .then(function () {
                return Alert(scene, name, 'Получено!');

            })
    }
    collectBoxMotherboard() {
        var scene = this;
        this.boxMotherboard.disableBody(true, true);
        countBox +=1;
        this.scoreText.setText('Собрано: ' + countBox + '/13');
        width = 1000;
        height = 650;
        var emojiNerd = String.fromCodePoint(0x1F913);
        var name = 'Материнская плата';
        Alert(scene, name,
            'Это печатная плата, на которую устанавливаются все комплектующие: \n' +
            'процессор, оперативная память, видеокарта, жесткие диски и другие. \n' +
            'Потому ее и назвали материнская, так как она питает все эти компоненты.\n' +
            'Очень важная штука ' + emojiNerd)
            .then(function () {
                return Alert(scene, name,
                    'Имей в виду, что с каждым годом производители модернизируют \n' +
                    'модели плат: изменяется стандарт сокета(разъема) для процессора и слотов \n' +
                    'для оперативной памяти, добавляются новые модули. И при обновлении \n' +
                    'компьютера это нужно обязательно учитывать, так как новые \n' +
                    'комплектующие могут не подойти на устаревшую модель материнской платы. ');
            })
            .then(function () {
                return Alert(scene, name, 'Получено!');

            })
    }
    collectBoxProcessor() {
        var scene = this;
        this.boxProcessor.disableBody(true, true);
        countBox +=1;
        this.scoreText.setText('Собрано: ' + countBox + '/13');
        width = 1050;
        height = 650;
        var emojiDisguised = String.fromCodePoint(0x1F978)
        var name = 'Процессор';
        var icon = this.add.image('icon');
        Alert(scene, name,
            'Это сердце компьютера. Он обрабатывает весь входящий поток информации, \n' +
            'распределяя его между остальными комплектующими. Состоит из текстолита, \n' +
            'на который крепятся микроконтроллеры и установлен кристалл – в нем и \n' +
            'происходят все вычисления. Покрывается металлической крышкой.\n' +
            'Кристалл смазывается термопастой для отвода тепла на крышку, которую \n' +
            'охлаждает радиатор (охлаждающее устройство). В современных процессорах \n' +
            'устанавливается два кристалла, один из которых отвечает за обработку \n' +
            'графики (встроенная видеокарта). Чем процессор мощнее, тем больше \n' +
            'он может проводить операций за одну секунду. ')
            .then(function () {
                return Alert(scene, name,
                    'В мире есть два главных производителя CPU, это компании Intel и AMD, \n' +
                    'у процессоров этих компаний свои отдельные разъемы (сокеты) для подключения \n' +
                    'к материнской плате, т.е. вы не сможете подключить процессор AMD к материнской \n' +
                    'плате для процессора Intel. Тут все очень серьезно ' + emojiDisguised);
            })
            .then(function () {
                return Alert(scene, name, 'Получено!');

            })

    }
    collectBoxCPUcooling() {
        var scene = this;
        this.boxCPUcooling.disableBody(true, true);
        countBox +=1;
        this.scoreText.setText('Собрано: ' + countBox + '/13');
        width = 1050;
        height = 650;
        var emojiHot = String.fromCodePoint(0x1F912)
        var name = 'Охлаждение для процессора';
        Alert(scene, name,
            'Современные процессоры могут производить огромное количество операций и \n' +
            'вычислений. Чем серьезнее вычисление, тем сильнее он греется. Температура \n' +
            'во время работы при плохом охлаждении может подниматься до 90 градусов и \n' +
            'более, что негативно влияет на кристалл. Потому для процессора нужна \n' +
            'хорошая система охлаждения. \n' +
            'Как здорово, что ты нашел его, мне было так жарко ' + emojiHot)
            .then(function () {
                return Alert(scene, name,
                    'Существует два типа охлаждения:\n' +
                    'Водяное – это когда к радиатору подведены два шланга, по которым циркулирует \n' +
                    'жидкость. Она охлаждается вентилятором, прикрепленным к корпусу.\n' +
                    'Воздушное – это когда на радиатор установлен вентилятор.\n' + '\n' +
                    'У каждого типа охлаждения есть свои плюсы и минусы:\n' +
                    'Водяное лучше охлаждает процессор, но требует обслуживания: нужно следить за \n' +
                    'уровнем жидкости, за состоянием шлангов.\n' +
                    'Воздушное не сильно уступает водяному, но имеет большой плюс в том, что не \n' +
                    'требует обслуживания – достаточно следить, чтобы вентилятор не запылился. \n' +
                    'Минус же заключается в том, что хорошее воздушное охлаждение имеет большие \n' +
                    'размеры и занимает много места в корпусе.');
            })
            .then(function () {
                return Alert(scene, name, 'Получено!');

            })
    }
    collectBoxRAM() {
        var scene = this;
        this.boxRAM.disableBody(true, true);
        countBox +=1;
        this.scoreText.setText('Собрано: ' + countBox + '/13');
        width = 1000;
        height = 1050;
        var emojiGame = String.fromCodePoint(0x1F3AE);
        var name = 'Оперативная память';
        Alert(scene, name,
            'Это память, в которую программы помещают свои данные для быстрой \n' +
            'обработки процессором. Все вычисления в ней проходят в несколько \n' +
            'раз быстрее, чем на жестком диске. После произведенных вычислений \n' +
            'память автоматически очищается для новой обработки данных. \n' +
            'У оперативной памяти свой стандарт – DDR. На сегодняшний день это \n' +
            'DDR4. Объем и производительность рассчитывается количеством гигабайт \n' +
            'и частотой в мегагерцах.')
            .then(function () {
                return Alert(scene, name,
                    'Продается объемами по 4, 8, 16 и 32 ГБ. В современном игровом \n' +
                    'компьютере должно быть не менее 16 ГБ, а лучше 32 ГБ. \n' +
                    'Особенно нехватка объема оперативной памяти заметна в играх, \n' +
                    'когда начинает использоваться жесткий диск в качестве файла \n' +
                    'подкачки. Часто при этом в нее просто невозможно играть. Потому \n' +
                    'если ты геймер или работаешь с тяжелыми графическими программами, \n' +
                    'следует приобрести достаточный объем оперативной памяти ' + emojiGame);
            })
            .then(function () {
                return Alert(scene, name, 'Получено!');

            })
    }
    collectBoxVideocard() {
        var scene = this;
        this.boxVideocard.disableBody(true, true);
        countBox +=1;
        this.scoreText.setText('Собрано: ' + countBox + '/13');
        width = 1050;
        height = 1200;
        var emojiColor = String.fromCodePoint(0x1F3A8);
        var emojiDiagram = String.fromCodePoint(0x1F4CA);
        var name = 'Видеокарта';
        Alert(scene, name,
            'Это графический процессор, который производит вычисления в \n' +
            'графических приложениях и играх. Она может быть встроена в \n' +
            'материнскую плату. Но в этом случае ее производительности \n' +
            'хватит лишь на работу с простыми программами. Для работы с \n' +
            'тяжелой графикой придется прикупить отдельную видеокарту ' + emojiColor)
            .then(function () {
                return Alert(scene, name,
                    'На сегодняшний день существуют два знаменитых производителя \n' +
                    'видеочипов (графических процессоров):\n' +
                    'NVIDIA\n' +
                    'AMD (бывшая ATI) \n' + '\n' +
                    'Видеокарта устанавливается в слот PCI-Express на материнской \n' +
                    'плате. Вычислительную мощность рассчитывают объемом в гигабайтах, \n' +
                    'частотой в мегагерцах и разрядностью шины в битах.\n' +
                    '\n' +
                    'Многие покупатели смотрят на объем. Этим пользуются некоторые \n' +
                    'производители, завышая объем памяти, но при этом занижая частоту, \n' +
                    'которая играет ключевую роль в играх и приложениях. Поэтому при \n' +
                    'покупке нужно учитывать все параметры ' + emojiDiagram);
            })
            .then(function () {
                return Alert(scene, name, 'Получено!');

            })
    }
    collectBoxHardDisk() {
        var scene = this;
        this.boxHardDisk.disableBody(true, true);
        countBox +=1;
        this.scoreText.setText('Собрано: ' + countBox + '/13');
        width = 1000;
        height = 850;
        var emojiPencil = String.fromCodePoint(0x1F4DD);
        var emojiPersevere = String.fromCodePoint(0x1F623);
        var name = 'Жесткий диск';
        var name1 = 'Магнитный жесткий диск HDD';
        var name2 = 'Твердотельный жесткий диск SSD';
        var name3 = 'Жесткий диск М2';
        Alert(scene, name,
            'Это хранилище данных в компьютере. Именно на нем находятся \n' +
            'все документы, фотографии, \n' +
            'На сегодняшний день существуют три вида жестких диска:\n' +
            'HDD (магнитный)\n' +
            'SSD (твердотельный)\n' +
            'М2 \n' +
            'Осторожно, сейчас будет много информации! ' + emojiPencil)
            .then(function () {
                return Alert(scene, name1,
                    'Имеет ширину 3,5 дюйма. Всю информацию пишет на магнитные блины. \n' +
                    'Работает по подключению к интерфейсу IDE и SATA. На сегодняшний \n' +
                    'день устарел: на новых материнских платах интерфейс IDE уже не \n' +
                    'распаивают, потому и жесткие диски IDE вышли из производства. \n' +
                    '\n' +
                    'Основной минус SATA HDD – это скорость чтения/записи данных \n' +
                    '(пишет в скорости примерно 100-120мб/с).\n' +
                    'На заметку: HDD очень чувствителен к вибрациям. Небольшой удар или \n' +
                    'падение может вывести его из строя. Мне еще не успели обновить диск, \n' +
                    'хожу с HDD и очень боюсь удариться. Но я обязательно дождусь ' + emojiPersevere);
            })
            .then(function () {
                return Alert(scene, name2,
                    'Имеет ширину 2,5 дюйма. Зачастую для его установки необходимо купить \n' +
                    'специальное крепление. Работает SSD по принципу флешки: вся информация \n' +
                    'пишется в чипы данных. Скорость чтения/записи увеличивается до 550 Мб/с.\n' +
                    '\n' +
                    'Основной недостаток SSD – ограниченное число записи данных. Потому на \n' +
                    'диск не рекомендуется постоянно что-то писать и удалять, тем более делать \n' +
                    'дефрагментацию (процесс перераспределения фрагментов файлов и логических \n' +
                    'структур файловых систем на дисках).');
            })
            .then(function () {
                return Alert(scene, name3,
                    'Имеет вид планки, схожей с оперативной памятью. Скорость работы в топовых \n' +
                    'моделях достигает 3000 Мб/с. На таких скоростях старый протокол обмена данных \n' +
                    'AHCI уже не справляется, потому инженеры реализовали новый протокол NVMe, \n' +
                    'оптимизированный под М2. Учитывай это при выборе материнской платы и диска – \n' +
                    'должна быть поддержка NVMe. \n' +
                    'М2 устанавливается в специальный слот на материнской плате PCI Express. \n' +
                    'Только не путай с разъемами mini PCI Express, которых может быть несколько, \n' +
                    'и присутствуют они даже на старых моделях. Будь внимателен!\n');
            })
            .then(function () {
                return Alert(scene, name, 'Получено!');

            })

    }
    collectBoxDVD() {
        var scene = this;
        this.boxDVD.disableBody(true, true);
        countBox +=1;
        this.scoreText.setText('Собрано: ' + countBox + '/13');
        width = 1050;
        height = 800;
        var emojiDisk = String.fromCodePoint(0x1F4BF);
        var emojiWink = String.fromCodePoint(0x1F609);
        var name = 'CD/DVD/BD-ROM приводы';
        Alert(scene, name,
            'Это устройства, читающие и записывающие диски. ' + emojiDisk + '\n' +
            'CD-ROM читает CD диски. CD/RW помимо чтения позволяет записывать \n' +
            'информацию. Такие приводы уже устарели и вышли с производства. \n' +
            'В основном они использовались на старых компьютерах. \n' +
            'Емкость стандартного CD диска 650-700 Мб.\n' +
            '\n' +
            'DVD-ROM читает DVD диски, а также позволяет записывать информацию. \n' +
            'На сегодняшний день такие приводы еще актуальные, но потихоньку \n' +
            'уходят с рынка. Емкость стандартного DVD диска 4,5 Гб. Существуют \n' +
            'двухслойные диски, ёмкость которых 8,5 Гб.')
            .then(function () {
                return Alert(scene, name,
                    'BD-ROM (Blu-ray) – это новейший привод, который читает все \n' +
                    'форматы дисков. Позволяет просматривать и записывать информацию \n' +
                    'на объемные Blu-ray диски за счет новой технологии сине-фиолетового \n' +
                    'лазера. Используются такие приводы в основном для записи фильмов в \n' +
                    'ультравысоком качестве.\n' +
                    'Blu-ray диски бывают одно, двух, трех и четырех слойные. Последние \n' +
                    'позволяют записывать данные до 128 Гб. \n' +
                    'Привод мне таки успели заменить, стоит новенький! Странно, конечно, \n' +
                    'что не все детали, но что поделать: в наше время проблемы с поставками \n' +
                    'не редкость, а так хоть что-то. Я весьма оптимистичен, не так ли? ' + emojiWink);
            })
            .then(function () {
                return Alert(scene, name, 'Получено!');

            })
    }
    collectBoxPowerUnit() {
        var scene = this;
        this.boxPowerUnit.disableBody(true, true);
        countBox +=1;
        this.scoreText.setText('Собрано: ' + countBox + '/13');
        width = 1050;
        height = 950;
        var emojiCute = String.fromCodePoint(0x1F97A);
        var name = 'Блок питания';
        Alert(scene, name,
            'Отвечает за питание всех комплектующих. Выпускаются они в \n' +
            'форм-факторе ATX. Бывают двух типов:\n' +
            '\n' +
            'Немодульные – это когда все кабели припаяны.\n' +
            'Модульные – это когда кабели поставляются отдельно и \n' +
            'подключаются к слотам.\n' +
            'Еще бывают серверные блоки питания. Обычно они имеют \n' +
            'специальную форму и большую мощность. \n' )
            .then(function () {
                return Alert(scene, name,
                    'Мощность у БП рассчитывается в ваттах и, как правило, учитывается при \n' +
                    'выборе комплектующих. Например, для офисного компьютера подойдет блок \n' +
                    '400-500 Вт. А вот для игрового или монтажного уже нужен посерьезнее, \n' +
                    'так как производя вычисления комплектующие будут потреблять большое \n' +
                    'количество энергии. Для таких целей подойдут блоки от 700 Вт и выше.\n' +
                    '\n' +
                    'Особое внимание нужно уделить качеству блока питания. На рынке очень \n' +
                    'много некачественных БП, в которых может быть указана мощность 700 Вт, \n' +
                    'но на практике при нагрузке в 350 Вт он запросто может сгореть и \n' +
                    'потянуть за собой комплектующие. \n' +
                    'Совет: Никогда не экономь на блоке питания, так как именно от него \n' +
                    'зависит жизнь компьютера. В данном случае моя! ' + emojiCute);
            })
            .then(function () {
                return Alert(scene, name, 'Получено!');

            })
    }
    collectBoxSoundCard() {
        var scene = this;
        this.boxSoundCard.disableBody(true, true);
        countBox +=1;
        this.scoreText.setText('Собрано: ' + countBox + '/13');
        width = 1050;
        height = 950;
        var name = 'Звуковая карта';
        Alert(scene, name,
            'Одно из дополнительных комплектующих.\n' +
            'Отвечает за воспроизведение звука на \n' +
            'компьютере. Устанавливается в разъемы \n' +
            'PCI и mini PCI-Express.')
            .then(function () {
                return Alert(scene, name,
                    'На всех современных материнских платах она уже встроена \n' +
                    'и отлично подойдет для прослушивания музыки и просмотра \n' +
                    'фильмов. Но если ты профессионально занимаешься монтажом \n' +
                    'аудио, то понадобится отдельная профессиональная звуковая \n' +
                    'карта. Встречаются и портативные USB звуковые карты. ');
            })
            .then(function () {
                return Alert(scene, name, 'Получено!');

            })
    }
    collectBoxNetworkCard() {
        var scene = this;
        this.boxNetworkCard.disableBody(true, true);
        countBox +=1;
        this.scoreText.setText('Собрано: ' + countBox + '/13');
        width = 1050;
        height = 1050;
        var name = 'Сетевая карта';
        Alert(scene, name,
            'Отвечает за передачу данных между компьютерами, которые \n' +
            'объединяет маршрутизатор (используется в корпоративной \n' +
            'сети для разделения на сегменты и распределение доступа).\n' +
            '\n' +
            'Как правило, сетевая карта уже встроена в материнскую \n' +
            'плату и позволяет осуществлять передачу данных на \n' +
            'скорости 1 Гб/с. Но можно установить и дополнительные \n' +
            'карты в разъемы PCI и mini PCI-Express, если твой \n' +
            'компьютер работает в роли сервера или маршрутизатора. ')
            .then(function () {
                return Alert(scene, name,
                    'На сегодняшний день в основном используют \n' +
                    'два типа сетевых карт:\n' +
                    '\n' +
                    '1. Работает с Fast/Ethernet сетью и позволяет \n' +
                    'подключать стандартный патч корд. Скорость \n' +
                    'порта обычно до 1 Гб/с. \n' +
                    '2. Работает с оптическим волокном. Скорость \n' +
                    'оптического соединения от 10 Гб/с. В основном \n' +
                    'устанавливается на серверное оборудование. ');
            })
            .then(function () {
                return Alert(scene, name, 'Получено!');

            })
    }
    collectBoxPorts() {
        var scene = this;
        this.boxPorts.disableBody(true, true);
        countBox +=1;
        this.scoreText.setText('Собрано: ' + countBox + '/13');
        width = 1050;
        height = 1050;
        var name = 'Порты';
        Alert(scene, name,
            'Это разъемы для подключения к ПК дополнительных устройств. \n' +
            'На материнской плате есть следующие порты:\n' +
            '\n' +
            'PS/2 – для подключения мышки/клавиатуры.\n' +
            'VGA и HDMI – для передачи видео. К ним подключают \n' +
            'телевизоры и проекторы.\n' +
            'COM и LPT – на старых материнских платах. Раньше к ним \n' +
            'подключались модемы и принтеры.\n' +
            'USB – универсальные, для подключения любых устройств.')
            .then(function () {
                return Alert(scene, name, 'Получено!');

            })
    }
    collectBoxUSB() {
        var scene = this;
        this.boxUSB.disableBody(true, true);
        countBox +=1;
        this.scoreText.setText('Собрано: ' + countBox + '/13');
        width = 1050;
        height = 950;
        var emojiCamera = String.fromCodePoint(0x1F4F8);
        var name = 'USB накопители';
        Alert(scene, name,
            'Одни из периферийных устройств. К ним относятся флешки и картридеры.\n' +
            '\n' +
            'Флешки – это портативные устройства, на которых хранится информация. \n' +
            'Бывают разных объемов: от 4 Гб и выше. \n' +
            'Картридеры – устройства, которые считывают информацию с SD-карт. \n' +
            'Такие карты используются в телефонах и фотоаппаратах' + emojiCamera)
            .then(function () {
                return Alert(scene, name, 'Получено!');

            })
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