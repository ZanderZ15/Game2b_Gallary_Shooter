class Gallary extends Phaser.Scene {
    constructor() {
        super("gallary");
        this.my = {sprite: {
            xcord:250,
            ycord:600
        }}; 
        this.bananaCd = 3;
        this.bananaCdCntr = 0;
        this.total_enemies = 30;
        this.lives = 3;
        this.worker_velocity = 10;
    }
    preload() {
        this.load.setPath("./assets/");
        
        this.load.image("s_monkey", "Animal Assets/PNG/Square/monkey.png");
        this.load.image("r_monkey", "Animal Assets/PNG/Round/monkey.png");
        this.load.image("banana", "peeled_banana.png");
        this.load.image("worker1", "reg_worker.png");
        //"C:\Users\zande\OneDrive\Desktop\CMPM 120\Game2b_Gallary_Shooter\assets\Traffic\PNG\Characters"
        //Animation
        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");
        
        
    }
    create() {
        let my = this.my;
        
        //TIMER

        this.move_timer = this.time.addEvent({
            delay: 500, //ms
            callback: this.timerEvent,
            callbackScope: this,
            //args: [],
            loop: true,
        });

        
        

        //MONKEY (PLAYER)
        my.sprite.monkey = this.add.sprite(my.sprite.xcord, my.sprite.ycord, "s_monkey");
        my.sprite.monkey.angle = 0;
        my.sprite.monkey.setScale(.1);
        
        //LIVES
        my.sprite.lives = this.add.group({
            defaultKey: "r_monkey",
            maxSize: 4,
            current: 3
            }
        );
        my.sprite.lives.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.lives.defaultKey,
            repeat: my.sprite.lives.maxSize-1,
        });
        for (let life of my.sprite.lives.getChildren()){
            life.setScale(.1);
            life.angle = 0;
        }

        //BANANA (BULLETS)
        my.sprite.bananaGroup = this.add.group({
            defaultKey: "banana",
            maxSize: 3
            }
        );
        my.sprite.bananaGroup.createMultiple({
            active: false,
            key: my.sprite.bananaGroup.defaultKey,
            repeat: my.sprite.bananaGroup.maxSize-1,
        });
        for (let banana of my.sprite.bananaGroup.getChildren()){
            banana.x = -100,
            banana.setScale(.075);
            banana.angle = 180;
        }

        //WORKERS (ENEMIES)
        my.sprite.reg_workers = this.add.group({
            defaultKey: "worker1",
            maxSize: 27
        });
        my.sprite.reg_workers.createMultiple({
            active: false,
            moving: false,
            last: "down",
            key: my.sprite.reg_workers.defaultKey,
            repeat: my.sprite.reg_workers.maxSize-1,
            visible: false
        });
        let i = 0;
        for (let worker of my.sprite.reg_workers.getChildren()){
            worker.setScale(2.5);
            worker.angle = 0;
            if (Math.floor(Math.random() * 10) > 3) {
                worker.active = true;
                worker.x = 50 * (((i) % 9) + 1);
                worker.y = 50 * (Math.floor((i) / 9) + 1);
                worker.visible = true;
            } else {
                worker.x = -200;
            } 
            i++;
        }
        //ANIMATION
        this.anims.create({
            key: "puff",
            frames: [
                { key: "whitePuff00" },
                { key: "whitePuff01" },
                { key: "whitePuff02" },
                { key: "whitePuff03" },
            ],
            x: -100,
            frameRate: 20,
            repeat: 5,
            hideOnComplete: true
        });


        //KEYS
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        //SPEEDS
        this.monkeySpeed = 9.36;
        this.bananaSpeed = 20;

        //TITLE AND CONTROLS
        document.getElementById('gameTitle').innerHTML = '<h2>Zoo Escape</h2>'
        document.getElementById('description').innerHTML = '<h3>A: left // D: right // Space: fire</h3>'
        this.dir ="";
    }
    /*//////////////////FOR COLLISION: 
    if thing in row, check against player
    if thing in column check against player emit?
    Check player against enemies, enemy emit, and powerups
    check player emit against enemies in y range?

    
    */
    update() {
        
        let my = this.my;
        this.bananaCdCntr--;
        

        //MOVEMENT TIME //RESUME HERE//////////////////////////////////
        //console.log(1 - (this.move_timer.getProgress()));
        if (1 - (this.move_timer.getProgress()) < .1) {
            
            //pick number
            //if i = number move worker,
            //else i++
            


            let i = 0;
            for (let worker of my.sprite.reg_workers.getChildren()){
                if (i < 3) {
                    
                    if (worker.active) {
                        //console.log(worker.active);
                        if (!worker.moving) {
                            console.log("selecting worker?");
                            i++;
                            worker.y += this.worker_velocity;
                            worker.moving = true;
                            //Start animation?
                            worker.last = "down";
                        }                     
                    }
                }
            }
        

            console.log("Start moving boi");
            
        }
        //MOVE PLS
        for (let worker of my.sprite.reg_workers.getChildren()) {
            if (worker.moving == true) {
                this.movement(worker);
            }
        }
        //KEY LISTENERS
        if (this.aKey.isDown) {
            if (my.sprite.monkey.x > 0+32) {
                my.sprite.monkey.x -= this.monkeySpeed;
            }
        }
        if (this.dKey.isDown) {
            if (my.sprite.monkey.x < 500-32) {
                my.sprite.monkey.x += this.monkeySpeed;
            }
        }
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            
            if (this.bananaCdCntr < 0) {
                let banana = my.sprite.bananaGroup.getFirstDead();
                if (banana != null) {
                    banana.active = true;
                    banana.visible = true;
                    banana.x = my.sprite.monkey.x;
                    banana.y = my.sprite.monkey.y;
                    this.bananaCdCntr = this.bananaCd;
                }
            }
            
        }

        //BANANAS THAT ARE OFFSCREEN
        for (let banana of my.sprite.bananaGroup.getChildren()) {
            if (banana.y < -(banana.displayHeight/2)) {
                banana.active = false;
                banana.visible = false;
            }
        }

        //COLLISION BETWEEN BANANA AND WORKER
        for (let banana of my.sprite.bananaGroup.getChildren()) {
            for (let worker of my.sprite.reg_workers.getChildren()) {
                if (this.collides(worker, banana)) {
                    // start animation
                    this.puff = this.add.sprite(worker.x, worker.y, "whitePuff03").setScale(0.25).play("puff");
                    // clear out bullet -- put y offscreen, will get reaped next update
                    banana.x = -600;
                    worker.visible = false;
                    worker.active = false;
                    worker.x = -600;
                    /*// Update score
                    this.myScore += my.sprite.hippo.scorePoints;
                    this.updateScore();
                    // Play sound
                    this.sound.play("dadada", {
                        volume: 1   // Can adjust volume using this, goes from 0 to 1
                    });
                    
                    // Have new hippo appear after end of animation
                    this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        this.my.sprite.hippo.visible = true;
                        this.my.sprite.hippo.x = Math.random()*config.width;
                    }, this);
                    */

                }
            }
        }
        //COLLISION BETWEEN MONKEY AND WORKER
        for (let worker of my.sprite.reg_workers.getChildren()) {
            if (this.collides(worker, my.sprite.monkey)) {
                // start animation
                this.puff = this.add.sprite(worker.x, worker.y, "whitePuff03").setScale(0.25).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                //banana.x = -600;
                my.sprite.monkey.visible = false;
                
                //worker.x = -600;
                /*// Update score
                this.myScore += my.sprite.hippo.scorePoints;
                this.updateScore();
                // Play sound
                this.sound.play("dadada", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                
                // Have new hippo appear after end of animation
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.hippo.visible = true;
                    this.my.sprite.hippo.x = Math.random()*config.width;
                }, this);
                */

            
            }
        }
        
        //MAKE BANANAS GO UP
        my.sprite.bananaGroup.incY(-this.bananaSpeed);

        //IF ALL WORKERS GONE RESTART SCENE
        if (this.inactive(my.sprite.reg_workers)) {
            this.scene.start("gallary");
        }
        
    }

    //COLLIDES FUNCTION
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    //INACTIVE FUNCTION
    inactive(group) {
        let n = 0;
        for (let member of group.getChildren()) {
            if (member.active == false) {
                n++;
            }
        }
        if (n == group.maxSize) {
            return true;
        } else {
            return false;
        }
    }
    //MOVEMENT FUNCTION
    movement(sprite) {
        if (sprite.active == false || sprite.y > 750) { //Base case
            sprite.y = 0;
            sprite.moving = false;
            return;
        } else if (sprite.last != "down") {
            sprite.y += this.worker_velocity;
            sprite.last = "down";
        } else {
            let dir = Math.floor(Math.random() * 3)
            
            if (dir == 0) {//left
                
                sprite.x -= this.worker_velocity;
                sprite.last = "left";
            } else if (dir ==  1) {//down
                
                sprite.y += this.worker_velocity;
                sprite.last = "down";
            } else if (dir == 2) {//right
                
                sprite.x += this.worker_velocity;
                sprite.last = "right";
            }
        }
    }
}
