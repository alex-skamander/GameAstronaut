import {print} from './WorldScene.js';
const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
var style = {
    width: 300,
    space: { left: 20, right: 20, top: 20, bottom: 20, title: 20, content: 30, action: 15, },

    background: {
        color: COLOR_PRIMARY,
        strokeColor: COLOR_LIGHT,
        radius: 20,
    },

    title: {
        space: { left: 5, right: 5, top: 5, bottom: 5 },
        text: {
            fontSize: 24
        },
        background: {
            color: COLOR_DARK
        }
    },

    content: {
        space: { left: 5, right: 5, top: 5, bottom: 5 },
        text: {
            fontSize: 20
        },
    },

    buttonMode: 1,
    button: {
        space: { left: 10, right: 10, top: 10, bottom: 10 },
        background: {
            color: COLOR_DARK,
            strokeColor: COLOR_LIGHT,
            radius: 10,

            'hover.strokeColor': 0xffffff,
        }
    },

    align: {
        actions: 'right'
    },
}
this.rexUI.add.confirmDialog(style)
    .setPosition(400, 300)
    .setDraggable('title')
    .resetDisplayContent({
        title: 'Title',
        content: "Hello.",
        buttonA: 'Ok'
    })
    .layout()
    .modalPromise()
    .then(function (data) {
        print.text = `\
index: ${data.index}
text : ${data.text}
`
    })