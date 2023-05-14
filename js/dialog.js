
const COLOR_TITLE = 0x5195e8;
const COLOR_PRIMARY = 0x7AAEEC;
const COLOR_LIGHT = 0xffffff;
const span = document.getElementsByClassName("close")[0];
/*const cry = function () {
    const myString = "Сука заебало";
    const myElement = document.createElement("p");
    myElement.style.fontWeight = "bold";
    myElement.textContent = myString;
    return ${myElement.textContent};
}
 */



const GetValue = Phaser.Utils.Objects.GetValue;
export var createTextBox = function (scene, x, y, config) {
    var wrapWidth = GetValue(config, 'wrapWidth', 0);
    var fixedWidth = GetValue(config, 'fixedWidth', 0);
    var fixedHeight = GetValue(config, 'fixedHeight', 0);
    var textBox = scene.rexUI.add.textBox({
        x: x,
        y: y,

        background: CreateSpeechBubbleShape(scene)
            .setFillStyle(COLOR_PRIMARY, 1)
            .setStrokeStyle(3, COLOR_LIGHT, 1),


        icon: scene.add.image(0, 0, 'icon').setVisible(true),
        draggable: true, //можно блок перетаскивать, обалдеть

        // text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
        text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),

        action: scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false),


        space: {
            left: 20, right: 10, top: 10, bottom: 25,
            icon: 20,
            text: 20,
        }

    })
        .setOrigin(0, 1)
        .layout();



    scene.rexUI.add.sizer({
        x: 300, y: 450,
        width: 190,
        height: 39,
        orientation: 'y',
        space: { left: 20, right: 10, top: 10, bottom: 10, item: 10 },
    })
        .addBackground(
            scene.rexUI.add.roundRectangle({
                color: COLOR_TITLE,
                radius: 15,

            })
                .setStrokeStyle(2, COLOR_LIGHT, 1),
        )
        .add(
            scene.rexUI.add.simpleLabel()
                .resetDisplayContent({
                    text: 'Печальный робот',
                    fontSize: '10px',
                    fontFamily:'basis33',
                    fontWeight: 'bolder',
                }),

            { expand: true }
        )

        .layout()



    textBox
        .setInteractive()
        .on('pointerdown', function () {
            var icon = this.getElement('action').setVisible(false);
            this.resetChildVisibleState(icon);
            if (this.isTyping) {
                this.stop(true);
            } else {
                this.typeNextPage();
            }
        }, textBox)
        .on('pageend', function () {
            if (this.isLastPage) {
                return;
            }

            var icon = this.getElement('action').setVisible(true);
            this.resetChildVisibleState(icon);
            icon.y -= 100;
            var tween = scene.tweens.add({
                targets: icon,
                y: '+=100', // '+=100'
                ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 500,
                repeat: 0, // -1: infinity
                yoyo: false
            });
        }, textBox)

    return textBox;
}


var getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.rexUI.add.BBCodeText(0, 0, '', {
        fixedWidth: fixedWidth,
        fixedHeight: fixedHeight,

        fontSize: '25px',
        fontFamily:'basis33',
        wrap: {
            mode: 'word',
            width: wrapWidth
        },
        maxLines: 3

    })

}

var CreateSpeechBubbleShape = function (scene, fillColor, strokeColor) {
    return scene.rexUI.add.customShapes({
        create: { lines: 1 },
        update: function () {
            var radius = 20;
            var indent = 15;

            var left = 0, right = this.width,
                top = 0, bottom = this.height, boxBottom = bottom - indent;
            this.getShapes()[0]
                .lineStyle(this.lineWidth, this.strokeColor, this.strokeAlpha)
                .fillStyle(this.fillColor, this.fillAlpha)
                // top line, right arc
                .startAt(left + radius, top).lineTo(right - radius, top).arc(right - radius, top + radius, radius, 270, 360)
                // right line, bottom arc
                .lineTo(right, boxBottom - radius).arc(right - radius, boxBottom - radius, radius, 0, 90)
                // bottom indent
                .lineTo(left + 60, boxBottom).lineTo(left + 50, bottom).lineTo(left + 40, boxBottom)
                // bottom line, left arc
                .lineTo(left + radius, boxBottom).arc(left + radius, boxBottom - radius, radius, 90, 180)
                // left line, top arc
                .lineTo(left, top + radius).arc(left + radius, top + radius, radius, 180, 270)
                .close();

        }

    })


}
var createButton = function (scene, text) {
    return scene.rexUI.add.label({
        width: 60,
        height: 60,
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
        text: scene.add.text( text, {
            fontSize: 18
        }),
        align: 'center',
        space: {
            left: 10,
            right: 10,
        }
    });
}









