class End extends Phaser.Scene {
    constructor() {
        super("end");
        this.my = {text: {}};
    }
    preload() {

    }
    create() {
        let my = this.my;
        //show text "Game over"
        //listener for game reset
        console.log("You died core");
        console.log("P to reset");
        this.pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        my.text.a = this.add.bitmapText(250, 690/4, "rocketSquare", "Game Over").setOrigin(.5, 0); 
        my.text.b = this.add.bitmapText(250, 345, "rocketSquare", "your final score is:").setOrigin(.5, 0);
        my.text.c = this.add.bitmapText(250, 430, "rocketSquare", score).setOrigin(.5, 0);
        my.text.d = this.add.bitmapText(250, 520, "rocketSquare", "press p to continue").setOrigin(.5, 0);
    }
    update() {
        //if reset, go back to scene 1
        if (Phaser.Input.Keyboard.JustDown(this.pKey)) {
            this.scene.start("s1");
        }
    }
}