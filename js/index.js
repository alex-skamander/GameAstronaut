import {BootScene} from "./BootScene.js";
import {WorldScene} from "./WorldScene.js";


export var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 1000,
    height: 650,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
        }
    },
    scene: [BootScene, WorldScene]
};

export var game = new Phaser.Game(config);
