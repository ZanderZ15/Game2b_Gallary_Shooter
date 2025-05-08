class lvl3 extends Phaser.Scene {
    constructor() {
        super("lvl3");
        this.my = {sprite: {
            xcord:250,
            ycord:600
        }}; 
        
        this.bananaCd = 3;
        this.bananaCdCntr = 0;
        this.movement_queue = 0;
        //SPEEDS
        this.monkeySpeed = 9.36;
        this.bananaSpeed = 20;
        this.netSpeed = 15;
        this.worker_velocity = 10;
    }
    preload() {
        this.load.setPath("./assets/");
        this.load.image("worker2", "enraged_worker.png");
        this.load.image("fell2", "enraged_worker_fell.png");
    }
    create() {
        let my = this.my;
        
        //Animations
        
        //TIMERS
        ////Movement Timer
        this.move_timer = this.time.addEvent({
            delay: 1000, //ms
            callback: this.timerEvent,
            callbackScope: this,
            loop: true,
        });
        ////NetTimer
        this.net_timer = this.time.addEvent({
            delay: 1500,
            callback: this.timerEvent,
            callbackScope: this,
            loop: true
        })

        //MONKEY (PLAYER)
        my.sprite.monkey = this.add.sprite(my.sprite.xcord, my.sprite.ycord, "s_monkey");
        my.sprite.monkey.angle = 0;
        my.sprite.monkey.setScale(.1);
        
        //LIVES
        my.sprite.lives = this.add.group({
            defaultKey: "r_monkey",
            maxSize: 4,
            current: lives,
            }
        );
        my.sprite.lives.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.lives.defaultKey,
            repeat: my.sprite.lives.maxSize-1,
        });
        let c = 0;
        for (let life of my.sprite.lives.getChildren()){
            if (c < lives-1) {
                life.setScale(.1);
                life.angle = 0;
                life.visible = true;
                life.x = (500-16)-32*c;
                life.y = 670;
                c++;
            }
        }

        //BANANA (BULLETS)
        my.sprite.bananaGroup = this.add.group({
            defaultKey: "banana",
            maxSize: 2
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
        //NET (ENEMY BULLETS)
        my.sprite.netGroup = this.add.group({
            defaultKey: "net",
            maxSize: 20
        });

        my.sprite.netGroup.createMultiple({
            active: false,
            key: my.sprite.netGroup.defaultKey,
            repeat: my.sprite.netGroup.maxSize-1,
        });
        for (let net of my.sprite.netGroup.getChildren()){
            net.x = -100,
            net.setScale(2);
            net.angle = 45;
        }

        //WORKERS (ENEMIES)
        my.sprite.reg_workers = this.add.group({
            defaultKey: "worker1",
            maxSize: 45
        });
        my.sprite.reg_workers.createMultiple({
            active: false,
            moving: false,
            last: "down",
            ox: 0,
            oy: 0,
            key: my.sprite.reg_workers.defaultKey,
            repeat: my.sprite.reg_workers.maxSize-1,
            visible: false,
            
        });
        let i = 0;
        for (let worker of my.sprite.reg_workers.getChildren()){
            worker.setScale(2.5);
            worker.angle = 0;
            worker.name = "reg";
            if (i < 18) {
                if (i % 2 == 0) {
                    //if (Math.floor(Math.random() * 10) > 3) {
                    worker.active = true;
                    worker.x = 50 * (((i) % 9) + 1);
                    worker.y = 50 * (Math.floor((i) / 9) + 1);
                    worker.ox = worker.x;
                    worker.oy = worker.y;
                    worker.visible = true;
                } else {
                    worker.x = -200;
                } 
            } else {
                worker.active = true;
                worker.x = 50 * (((i) % 9) + 1);
                worker.y = 50 * (Math.floor((i) / 9) + 1);
                worker.ox = worker.x;
                worker.oy = worker.y;
                worker.visible = true;
            
            }
            i++;
        }
        //ENRAGED WORKERS (ENEMIES)
        my.sprite.en_workers = this.add.group({
            defaultKey: "worker2",
            maxSize: 18
        });
        my.sprite.en_workers.createMultiple({
            active: false,
            moving: false,
            last: "down",
            ox: 0,
            oy: 0,
            key: my.sprite.en_workers.defaultKey,
            repeat: my.sprite.en_workers.maxSize-1,
            visible: false,
            
        });
        i = 0;
        for (let worker of my.sprite.en_workers.getChildren()){
            worker.setScale(2.5);
            worker.angle = 0;
            worker.name = "en";
            if (i % 2 == 1) {
            //if (Math.floor(Math.random() * 10) > 3) {
                worker.active = true;
                worker.x = 50 * (((i) % 9) + 1);
                worker.y = 50 * (Math.floor((i) / 9) + 1);
                worker.ox = worker.x;
                worker.oy = worker.y;
                worker.visible = true;
            } else {
                worker.x = -200;
            } 
            i++;
        }


        //KEYS
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.nineKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE);
        this.zeroKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO);


        //TITLE AND CONTROLS
        document.getElementById('gameTitle').innerHTML = '<h2>Zoo Escape</h2>'
        document.getElementById('description').innerHTML = '<h3>A: left // D: right // Space: fire</h3>'
        this.dir ="";
    }

    update() {
        
        let my = this.my;
        this.bananaCdCntr--;
        

        //MOVEMENT TIME
        ////REG
        if (1 - (this.move_timer.getProgress()) < .025) {
            let i = 0;
            for (let worker of my.sprite.reg_workers.getChildren()){
                
                if (i < 3) {
                    if (worker.active) {
                        if (!worker.moving) {
                            
                            i++;
                            worker.y += this.worker_velocity;
                            worker.moving = true;
                            //Scrapped: Walking animation
                            worker.last = "down";
                        }                     
                    }
                }
            }
        }
        ////ENREAGED
        if (1 - (this.move_timer.getProgress()) < .025) {
            let i = 0;
            for (let worker of my.sprite.en_workers.getChildren()){
                if (i < 3) {
                    if (worker.active) {
                        if (!worker.moving) {
                            
                            i++;
                            worker.y += 2*this.worker_velocity;
                            worker.moving = true;
                            //Scrapped: Walking animation
                            worker.last = "down";
                        }                     
                    }
                }
            }
        }
        //MOVE PLS
        for (let worker of my.sprite.reg_workers.getChildren()) {
            if (worker.moving) {
                this.movement(worker);
            }
        }
        for (let enraged of my.sprite.en_workers.getChildren()) {
            if (enraged.moving) {
                this.movement(enraged);
            }
        }

        //NET TIMER
        if (1 - (this.net_timer.getProgress()) < .0175) {
            let i = 0;
            for (let worker of my.sprite.reg_workers.getChildren()){
                if (i < 10) {
                    if (worker.active) {
                        if (!worker.moving) {
                            
                            if (i % 2 == 0) {
                                let net = my.sprite.netGroup.getFirstDead();
                                if (net != null) {
                                    net.active = true;
                                    net.visible = true;
                                    net.x = worker.x;
                                    net.y = worker.y;
                                }
                            }
                            i++;
                        }                     
                    }
                }
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

        if (Phaser.Input.Keyboard.JustDown(this.nineKey)) {
            this.scene.start("lvl3");
        }
        if (Phaser.Input.Keyboard.JustDown(this.zeroKey)) {
            this.scene.start("end");
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
                    this.falling = this.add.sprite(worker.x, worker.y, "worker1").setScale(2.5).play("worked");
                    // clear out bullet -- put y offscreen, will get reaped next update
                    banana.x = -600;
                    worker.visible = false;
                    worker.active = false;
                    worker.moving = false;

                    worker.x = -600;
                    worker.y = -600;
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
            for (let worker of my.sprite.en_workers.getChildren()) {
                    if (this.collides(worker, banana)) {
                        // start animation
                        this.falling = this.add.sprite(worker.x, worker.y, "worker1").setScale(2.5).play("en_worked");
                        // clear out bullet -- put y offscreen, will get reaped next update
                        banana.y = -1000;
                        worker.visible = false;
                        worker.active = false;
                        worker.moving = false;
    
                        worker.x = -600;
                        worker.y = -600;
                    }
                }
        }
        //COLLISION BETWEEN MONKEY AND WORKERS
        for (let worker of my.sprite.reg_workers.getChildren()) {
            if (this.collides(worker, my.sprite.monkey)) {
                this.takeDamage();
                
                
                
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
        ////collision ENRAGED
        for (let worker of my.sprite.en_workers.getChildren()) {
            if (this.collides(worker, my.sprite.monkey)) {
                this.takeDamage();
            }
        }
        //Collision btw monkey and net
        for (let net of my.sprite.netGroup.getChildren()) {
            if (this.collides(net, my.sprite.monkey)) {
                this.takeDamage();
            }
        }
        //MAKE BANANAS GO UP
        my.sprite.bananaGroup.incY(-this.bananaSpeed);
        //Make nets go down
        my.sprite.netGroup.incY(this.netSpeed);

        //IF ALL WORKERS GONE GO TO NEXT SCENE
        if (this.inactive(my.sprite.reg_workers) && this.inactive(my.sprite.en_workers)) {
            this.scene.start("s3");
        }
        
    }

    //COLLIDES FUNCTION
    collides(a, b) {
        if (Math.abs(a.x - b.x) > ((a.displayWidth + b.displayWidth)/4)) return false;
        if (Math.abs(a.y - b.y) > ((a.displayHeight + b.displayHeight)/3.5)) return false;
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
        let m;
        if (sprite.name == "reg") {
            m = 1;
        } else if (sprite.name == "en") {
            m = 1.5;
        }
        if (sprite.y > 750) { //Base case
            sprite.x = sprite.ox;
            sprite.y = sprite.oy;
            sprite.moving = false;
            return;
        } else if (sprite.last != "down") {
            sprite.y += this.worker_velocity * m;
            sprite.last = "down";
        } else {
            let dir = Math.floor(Math.random() * 3)
            
            if (dir == 0) {//left
                
                sprite.x -= this.worker_velocity * m;
                sprite.last = "left";
                if (sprite.x <= 16) {
                    sprite.x += 2*this.worker_velocity * m;
                }
            } else if (dir ==  1) {//down
                
                sprite.y += this.worker_velocity * m;
                sprite.last = "down";
            } else if (dir == 2) {//right
                
                sprite.x += this.worker_velocity * m;
                sprite.last = "right";
                if (sprite.x >= 484) {
                    sprite.x -= 2*this.worker_velocity * m;
                }
            }
        }
    }
    takeDamage() {
        let my = this.my;
        //RESET NETS
        for (let net of my.sprite.netGroup.getChildren()) {
            net.x = -600;
        }
        // start damaged animation
        lives -= 1;
        if (lives == 0) {
            this.scene.start("end");
        }
        my.sprite.monkey.visible = false;
        this.blink = this.add.sprite(my.sprite.monkey.x, my.sprite.monkey.y, "blank").setScale(0.1).play("blink");
        my.sprite.monkey.visible = true;
        // remove life sprite from bot right
        let j = 0;
        for (let life of my.sprite.lives.getChildren()) {
            if (life.visible) {
                if (lives-2 >= j) {
                    j++;
                } else {
                    life.visible = false;
                }
            }
        }
        // show monkey on end of animation
        this.blink.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.my.sprite.monkey.visible = true;
        }, this);
        
        // stop timer
        this.move_timer.remove();
        this.net_timer.remove();

        // reset moving workers
        for (let moving of my.sprite.reg_workers.getChildren()) {
            if (moving.moving) {
                moving.x = moving.ox;
                moving.y = moving.oy;
                moving.moving = false;
            }
        }
        for (let moving of my.sprite.en_workers.getChildren()) {
            if (moving.moving) {
                moving.x = moving.ox;
                moving.y = moving.oy;
                moving.moving = false;
            }
        }

        // restart timer
        this.move_timer = this.time.addEvent({
            delay: 1000, //ms
            callback: this.timerEvent,
            callbackScope: this,
            //args: [],
            loop: true,
        });
        this.net_timer = this.time.addEvent({
            delay: 1500,
            callback: this.timerEvent,
            callbackScope: this,
            loop: true
        })

        
        
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
