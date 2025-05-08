class Start1 extends Phaser.Scene {
    constructor() {
        super("s1");
        //WORKERS:x = -1000
        //nets and bananas: x = -2000
        this.my = {text: {}};
    }
    preload() {
        this.load.setPath("./assets/");
        //Font
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
        
        this.load.image("background_tiles", "kenny-tiny-town-tilemap-packed.png");    // tile sheet   
        this.load.tilemapTiledJSON("map", "backgroundmap.json");                   // Load JSON of tilemap

    }
    create() {
        let my = this.my;
        
        //TITLE AND CONTROLS
        document.getElementById('gameTitle').innerHTML = '<h2>Zoo Escape</h2>'
        document.getElementById('description').innerHTML = '<h3>A: left // D: right // Space: fire</h3>'
        this.dir ="";
        lives = 3;
        score = 0;
        
        my.text.wt = this.add.bitmapText(250, 120, "rocketSquare", "Welcome to").setOrigin(.5, 0); 
        my.text.ze = this.add.bitmapText(250, 180, "rocketSquare", "Zoo Escape!").setOrigin(.5, 0);
        my.text.ptp = this.add.bitmapText(250, 520, "rocketSquare", "Press P to play").setOrigin(.5, 0);
        //my.text.wt.setAlign("center");
        console.log("Level1");
        this.pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        this.zeroKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO);
    }
    update() {
        //if reset, go back to scene 1
        if (Phaser.Input.Keyboard.JustDown(this.pKey)) {
            this.scene.start("lvl1");
        }
        if (Phaser.Input.Keyboard.JustDown(this.zeroKey)) {
            this.scene.start("end");
        }
    }
}