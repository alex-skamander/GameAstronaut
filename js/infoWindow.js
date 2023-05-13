import GetValue from "phaser3-rex-plugins/plugins/utils/object/GetValue";
import config from './index.js';

const COLOR_TITLE = 0x5688C2;
const COLOR_LIGHT = 0xffffff;
const COLOR_TEXT = 0x769FCD;
var CreateAlertDialog = function (scene, x, y, config) {
    var wrapWidth = GetValue(config, 'wrapWidth', 0);
    var fixedWidth = GetValue(config, 'fixedWidth', 0);
    var fixedHeight = GetValue(config, 'fixedHeight', 0);

    var dialog = scene.rexUI.add.dialog({

        background: scene.rexUI.add.roundRectangle(0, 0, 10, 10, 20, COLOR_TEXT)
            .setStrokeStyle(3, COLOR_LIGHT, 1),

        title: scene.rexUI.add.label({
            background: scene.rexUI.add.roundRectangle(0, 0, 10, 40, 20, COLOR_TITLE),
            text: scene.add.text(0, 0, '', {
                fontSize: '28px',
                content: 'center',
                fontFamily:'basis33',

            }),


            space: {
                left: 15,
                right: 15,
                top: 10,
                bottom: 10
            }
        }),



        content: scene.add.text(0, 0, '', {
            fontSize: '25px',
            textAlign: 'center',
            fontFamily:'basis33',

        }),

        actions: [
            scene.rexUI.add.label({
                background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, COLOR_TITLE),

                text: scene.add.text(0, 0, 'OK', {
                    fontSize: '25px',
                    actions: 'center',
                    fontFamily:'basis33',
                }),


                space: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,

                }
            })
        ],

        space: {
            title: 25,
            content: 25,
            action: 15,

            left: 20,
            right: 20,
            top: 20,
            bottom: 20,

        },

        align: {
            actions: 'center', // 'center'|'left'|'right'

        },

        expand: {
            content: false,  // Content is a pure text object
        }
    })
        .on('button.over', function (button, groupName, index, pointer, event) {
            button.getElement('background').setStrokeStyle(1, 0xffffff);
        })
        .on('button.out', function (button, groupName, index, pointer, event) {
            button.getElement('background').setStrokeStyle();
        });

    return dialog;
}

var SetAlertDialog = function (dialog, title, content) {
    if (title === undefined) {
        title = '';
    }
    if (content === undefined) {
        content = '';
    }
    dialog.getElement('title').text = title;
    dialog.getElement('content').text = content;
    return dialog;
}

var AlertDialog;
export var Alert = function (scene, title, content, x, y) {
    var width = 1000;
    var height = 650;
    x = width/2;
    y = height/2;
    if (!AlertDialog) {
        AlertDialog = CreateAlertDialog(scene)
    }
    SetAlertDialog(AlertDialog, title, content);
    AlertDialog
        .setPosition(x, y)
        .setVisible(true)
        .layout();


    return AlertDialog
        .moveFromPromise(1000, undefined, '-=400', 'Cubic')
        .then(function () {
            return scene.rexUI.waitEvent(AlertDialog, 'button.click');
        })
        .then(function () {
            return AlertDialog.moveToPromise(1000, undefined, '-=400', 'Back');
        })
        .then(function () {
            AlertDialog.setVisible(false);
            return Promise.resolve();
        })
}