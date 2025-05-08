class Start3 extends Phaser.Scene {
    constructor() {
        super("s3");
        this.my = {text: {}};
    }
    preload() {

    }
    create() {
        let my = this.my
        //show text "Game over"
        //listener for game reset
        console.log("Lvl3");
        this.pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.zeroKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO);
        my.text.wt = this.add.bitmapText(250, 690/4, "rocketSquare", "Your score is:").setOrigin(.5, 0); 
        my.text.ze = this.add.bitmapText(250, 345, "rocketSquare", score).setOrigin(.5, 0);
        my.text.ptp = this.add.bitmapText(250, 520, "rocketSquare", "Press P to continue").setOrigin(.5, 0);

    }
    update() {
        //if reset, go back to scene 1
        if (Phaser.Input.Keyboard.JustDown(this.pKey)) {
            this.scene.start("lvl3");
        }
        if (Phaser.Input.Keyboard.JustDown(this.zeroKey)) {
            this.scene.start("end");
        }
    }   
}