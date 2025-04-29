class Movement extends Phaser.Scene {
    constructor() {
        super("moving1d");
        this.my = {sprite: {
            xcord:500,
            ycord:500
        }}; 
    }
    preload() {
        this.load.setPath("./assets/");
        
        this.load.image("bow", "bow.png");
        this.load.image("arrow", "arrow.png");
        
    }
    create() {
        let my = this.my;
        
        my.sprite.bow = this.add.sprite(my.sprite.xcord, my.sprite.ycord, "bow");
        my.sprite.bow.angle = -90;

        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    update() {
        let my = this.my;
        
        if (this.aKey.isDown) {
            if (my.sprite.bow.x > 0+32) {
                my.sprite.bow.x -= 9.36;
            }
        }
        if (this.dKey.isDown) {
            if (my.sprite.bow.x < 1000-32) {
                my.sprite.bow.x += 9.36;
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            my.sprite.arrow = this.add.sprite(my.sprite.bow.x, my.sprite.bow.y, "arrow");
            my.sprite.arrow.angle = -45;
            //let arrow = new Arrow({scene:this, x:my.sprite.bow.x, y:500})
        }
        if (my.sprite.arrow) {
            my.sprite.arrow.y -= 20;
            //console.log(my.sprite.arrow.y);
        }
        
    }

}
/*class Arrow extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, "arrow");
        config.scene.add.existing(this);
        this.angle = -45;
    }
}*/
