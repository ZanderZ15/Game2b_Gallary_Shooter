class Start3 extends Phaser.Scene {
    constructor() {
        super("s3");
    }
    preload() {

    }
    create() {
        //show text "Game over"
        //listener for game reset
        console.log("Lvl3");
        this.pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.zeroKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO);

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