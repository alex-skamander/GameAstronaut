import {WorldScene} from "./WorldScene.js";
export class BootScene extends Phaser.Scene {
    constructor() {
        super("BootScene");
    }

    preload() {
        // здесь происходит загрузка ресурсов
        // тайлы для карты
        this.load.image('tileFloor', '/map/tilesFloor.png');
        this.load.image('tileWalls', '/map/tilesWalls.png');
        this.load.image('tileStuff', '/map/tilesStuff.png');
        // карта в json формате
        this.load.tilemapTiledJSON('map', '/map/Map.json');

        // персонаж, которым управляет игрок
        this.load.spritesheet('player', '/player/player.png', {frameWidth: 32, frameHeight: 33});
        //нпс робот, дает квесты
        this.load.spritesheet('s_robot', '/robot/robot.png', {frameWidth: 42, frameHeight: 42});
        this.load.spritesheet('box', '/access/cat.png', {frameWidth: 28, frameHeight: 28});

    }

    create() {
        //Запускаем сцену мира
        this.scene.start('WorldScene');
    }



    update() {
    }
}