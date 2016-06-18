/* Game.js contains all the game states such as objects and logics */

BunnyDefender.Game = function(game) {
    /* Declaring global varibles */
    /* totalBunnies counts to determine how many bunnies should be generated onto our stage. */
    this.totalBunnies;
    /* 
     * bunnyGroup uses phaser's grouping mechanism to control the bunnies and allow to 
     * perform collisions to the entire group instead of dealing with each one individually. 
    */
    this.bunnyGroup;
    this.totalSpacerocks;
    this.spacerockgroup;
    /* burst is our emitter which is emits different particles based on that explosion image */
    this.burst;
    this.gameover;
    /* countdown-text */
    this.countdown;
    /* bit map text over message */
    this.overmessage;
    /* the counter where we'll increment the seconds */
    this.secondsElapsed;
    /* keep time of the seconds elapsed from when the game starts */
    this.timer;
    /* Sound-effects */
    this.music;
    this.ouch;
    this.boom;
    this.ding;
};

BunnyDefender.Game.prototype = {
    /* create-function only run once */
    create: function() {
        /* set the gameover to false before anything else happens in the game. */
        this.gameover = false;
        this.secondsElapsed = 0;
        /* 
         * timer for ending the game. We loop the timer by setting it to false to tell the 
         * timer not to remove itself from the game after it's over 
        */
        this.timer = this.time.create(false);
        /* tell the timer to loop every single second */
        this.timer.loop(1000, this.updateSeconds, this);
        /* the total bunnies of 20 */
        this.totalBunnies = 20;
        /* the total space-rocks of 13 */
        this.totalSpacerocks = 13;
        /* add the game music soundtrack */
        this.music = this.add.audio('game_audio');
        /* Start the background music*/
        this.music.play('', 0, 1, true);
        /* adding the sound-effects */
        this.ouch = this.add.audio('hurt_audio');
        this.boom = this.add.audio('explosion_audio');
        this.ding = this.add.audio('select_audio');
        /* buildWorld-function modularize what's going on in our game state */
        this.buildWorld();
    },
    /* updates the seconds  */
    updateSeconds: function() {
        /* here we increment our seconds elapsed(passed)  */
        this.secondsElapsed++;
    },
    /* build-function adds images */ 
    buildWorld: function() {
        this.add.image(0, 0, 'sky');
        this.add.image(0, 800, 'hill');
        this.buildBunnies();
        this.buildSpaceRocks();
        this.buildEmitter();
        /* countdown-text-function which tells how many bunnies left */
        this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Bunnies Left ' + this.totalBunnies, 20);
        /* starts the timer after everything's been created */
        this.timer.start();
    },
    /* buildBunnies-function generates all of the bunny assets we need for the game */
    buildBunnies: function() {
        /* creates a new group called bunnygroup */
        this.bunnygroup = this.add.group();
        /* 
         * enables the body on the group which allows the bunny group to interact with 
         * other objects that we create or other entities
        */
        this.bunnygroup.enableBody = true;
        /* Loop out individual bunnies and add them to the group */
        for(var i=0; i<this.totalBunnies; i++) {
            /* here we create a new entity and bind it within our bunny group */
            var b = this.bunnygroup.create(this.rnd.integerInRange(-10, this.world.width-50), this.rnd.integerInRange(this.world.height-180, this.world.height-60), 'bunny', 'Bunny0000');
            /* sets the anchor to the center of the bunny. So 0.5. And 0.5 for both the x and the y */ 
            b.anchor.setTo(0.5, 0.5);
            /* disable the physics engine to take control of these bunnies */  
            b.body.moves = false;
            /* 
             * sets different animations:
             * Rest = what'll happen when the bunny is just sitting there
             * Walk = walk animation. this will occur when the bunny hopping across the screen
            */
            b.animations.add('Rest', this.game.math.numberArray(1,58));
            b.animations.add('Walk', this.game.math.numberArray(68,107));
            b.animations.play('Rest', 24, true);
            /* this will make the bunnies start moving */
            this.assignBunnyMovement(b);
        }
    },
    /* Movement-animation */
    assignBunnyMovement: function(b) {
        /* bposition variable position bunnies based on a random number */
        bposition = Math.floor(this.rnd.realInRange(50, this.world.width-50));
        /* Make the bunnies move like there acting of their own will */
        bdelay = this.rnd.integerInRange(2000, 6000);
        /* 
         * logics for the bunnies movment which determine which direction the
         * bunny should actually face when it starts moving  
        */
        if(bposition < b.x){
            /* In the scale.x we set 1 or negative 1 which will flip the rabbit from one direction to the other. */
            b.scale.x = 1;
        /* 
         * if the bunny is on the left side of the stage and wants to move to the right 
         * of the stage, it faces the opposite direction. 
        */
        } else {
            b.scale.x = -1;
        }
        /* set our tween (t) which makes the actual movement for each bunnies */
        t = this.add.tween(b).to({x:bposition}, 3500, Phaser.Easing.Quadratic.InOut, true, bdelay);
        /* Event-listeners
         * (onStart) when the tween starts the startBunny-function activates
         * (onComplete) when the tween ends the stopBunny-function activates
        */    
        t.onStart.add(this.startBunny, this);
        t.onComplete.add(this.stopBunny, this);

    }, 
    
    startBunny: function(b) {
        /* Stops our play-animation */
        b.animations.stop('Rest');
        /* Starts the play-animation */
        b.animations.play('Walk', 24, true);
    },
    
    stopBunny: function(b) {
        /* stops on our walk-animation */
        b.animations.stop('Walk');
        /* play on our rest-animation */
        b.animations.play('Rest', 24, true);
        /* 
         * activate the assignBunnyMovement-function with its position, its delay, its 
         * direction it's facing, and create a new tween starting the process all over 
         * again for each individual bunny. 
        */
        this.assignBunnyMovement(b);
    },
    
    buildSpaceRocks: function() {
        this.spacerockgroup = this.add.group();
        /* loops out the total amount of 13 spacerocks */
        for(var i=0; i<this.totalSpacerocks; i++) {
            /* space rock instance */
            var r = this.spacerockgroup.create(this.rnd.integerInRange(0, this.world.width), this.rnd.realInRange(-1500, 0), 'spacerock', 'SpaceRock0000');
            /* creates a randomized scaling effect so you'll have some that are small, and some that are larger rocks */
            var scale = this.rnd.realInRange(0.3, 1.0);
            r.scale.x = scale;
            r.scale.y = scale;
            /* enables the physics for our rocks (gravity) */
            this.physics.enable(r, Phaser.Physics.ARCADE);
            /* enables the body for our spacerocks */
            r.enableBody = true;
            /* sets the velocity y upon the body which determines how fast that these 
             * rocks will fall from top to bottom which we also randomize. so they 
             * don't all fall down at once.
            */
            r.body.velocity.y = this.rnd.integerInRange(200, 400);
            /* adding falling-animation */
            r.animations.add('Fall');
            /* Start the spacerocks to fall with 24 frames per second and have it loop continuously. */
            r.animations.play('Fall', 24, true);
            /* 
             * when spacerocks left the bounds of the world it fires off an event and it will be aware 
             * that it has left the world. 
            */
            r.checkWorldBounds = true;
            /* bind an event to checkWorldBounds */
            r.events.onOutOfBounds.add(this.resetRock, this);
        }
    },
    
    /* resets the rock and call for the respawnRock-function to respawn the rock when gone and out from the screen */
    resetRock: function(r) {
        if(r.y > this.world.height) {
            /* here we activate the respawn-function */
            this.respawnRock(r);   
        }
    },
    
    respawnRock: function(r) {
        /* set this.gameover equal to false to respawn the rocks */
        if(this.gameover == false){
            /* reset()-function resets the x, y-axis for the entitys */
            r.reset(this.rnd.integerInRange(0, this.world.width), this.rnd.realInRange(-1500, 0));
            /* resets the velocity of the game world */
            r.body.velocity.y = this.rnd.integerInRange(200, 400);
        }
    },
    /* allowing the player to cause defensive explosions(particles) through click or touch input. */
    buildEmitter:function() {
        /* we position the emitter on zero, zero */
        this.burst = this.add.emitter(0, 0, 80);
        /* sets a minimum and maximum particles(explosion) scale which creates a burst effect */
        this.burst.minParticleScale = 0.3;
        this.burst.maxParticleScale = 1.2;
        /* sets a minimum and maximum particles(explosion) speed which create a burst effect */
        this.burst.minParticleSpeed.setTo(-30, 30);
        this.burst.maxParticleSpeed.setTo(30, -30);
        /* activates the makeParticles-function. we pass a reference of the picture for the explosion */
        this.burst.makeParticles('explosion');
        /* actives the fireBurst_function which holds the click-event */
        this.input.onDown.add(this.fireBurst, this);
    },
    
    fireBurst: function(pointer) {
        /* If this.gameover is equal to false, then it's permissible to fire a new burst. */
        if(this.gameover == false){
            /* here we play the boom-sound each time we actually fire off our emitter. */
            this.boom.play();
            /* sets the volume for the boom-sound */
            this.boom.volume = 0.1;
            this.burst.emitX = pointer.x;
            this.burst.emitY = pointer.y;
            /* starts the particles running */ 
            this.burst.start(true, 2000, null, 20);
        }
    },
    /* respawn any of the rocks that touched by the particles */
    burstCollision: function(r, b) {
        this.respawnRock(r);  
    },
    /* Bunny collison */
    bunnyCollision: function(r, b) {
        /* here we check whether that particular Bunny instance still exists or not. 
         * if B.exists, and that way we know for sure that the bunny still exists */
        if(b.exists){
            /* plays the sound-effect (ouch) when a bunny is hit */
            this.ouch.play();
            this.ouch.volume = 0.1;
            /* respawn the rocks and pass in the rock space instance which will respawn the rock to the top of the world */
            this.respawnRock(r);
            /* activate the makeGhost()-function of the bunny if it killes */
            this.makeGhost(b);
            /* the kill()-function kills the sprite */
            b.kill();
            /* decrement bunnies by one. for exemple if we have 10 decrement 1 from that we'll have 9 left*/
            this.totalBunnies--;
            /* activates the checkBunniesLeft()-function */
            this.checkBunniesLeft();
        }
    },
    /* if we don't have any bunnies left game over */
    checkBunniesLeft: function() {
        if(this.totalBunnies <= 0){
            this.gameover = true;
            /* stops the music when the game is over */
            this.music.stop();
            /* Sets the text to 'Bunnies Left 0' when all the bunnies is killed */
            this.countdown.setText('Bunnies Left 0');
            /* Game over messaging. Displays the game over-text */
            this.overmessage = this.add.bitmapText(this.world.centerX-200, this.world.centerY-200, 'eightbitwonder', 'YOU SURVIVED FOR\n\n' + this.secondsElapsed + ' SECONDS\n\n\n\n' + 'TRY AGAIN', 30);
            this.overmessage.align = "center";
            /* allow user to click on that bitmapText and then we can respond to it. */
            this.overmessage.inputEnabled = true;
            /* we use this to make a response after a user clicks  */
            this.overmessage.events.onInputDown.addOnce(this.quitGame, this);
        /*  
         * if a game isn't over, if total bunnies is not less than or equal to one then we 
         * want to spit out the actual count of our bunnies
        */    
        } else {
            this.countdown.setText('Bunnies Left ' + this.totalBunnies);
        }
    },
    /* load up a different state and here we sending these are all the way back to the start menu. */
    quitGame:function(pointer) {
        /* play the ding-sound when a user starts the game over again */
        this.ding.play();
        /* sets the volume for the ding-sound */
        this.ding.volume = 0.2;
        this.state.start('StartMenu');
    },

    /* 
     * this function will run when a bunny gets hit by the explosion and also the 
     * emitter particle that hit it 
    */
    friendlyFire: function(b, e){
        /* checks if a bunny exists if so... */
        if(b.exists){
            /* plays the sound-effect (ouch) when a bunny is hit */
            this.ouch.play();
            this.ouch.volume = 0.1;
            /* activate the makeGhost()-function of the bunny if it kills */
            this.makeGhost(b);
            /* if the bunny exists kill it */
            b.kill();
            /* decrement minus one. remove one bunnny */
            this.totalBunnies--;
            /* checks how many bunnies is left */
            this.checkBunniesLeft();
        }
    },
    /* 
     * Makes a bunny transform to a ghost when killed here we need to know 
     * the x and y position of our bunny as well as its scale x.  
     * 
     */
    makeGhost: function(b) {
        bunnyghost = this.add.sprite(b.x-20, b.y-180, 'ghost');
        /* sets the anchor to center */
        bunnyghost.anchor.setTo(0.5, 0.5);
        /* set the scale to whatever the scale x of the bunny instance is */
        bunnyghost.scale.x = b.scale.x;
        /* sets the physics to the bunnyghosts. this makes bunny ghost respond to gravity. */
        this.physics.enable(bunnyghost, Phaser.Physics.ARCADE);
        /* set enable body to true, which makes each of these bunny ghost have a body that responds to that physics engine. */
        bunnyghost.enableBody = true;
        /* check world bounds and set that to true. This notifies when the bunny has left the screen. */
        bunnyghost.checkWorldBounds = true;
        /* 
         * makes the gravity in our world for this particular entity is negative 800, which will 
         * cause the entity to go rushing to the top of the screen. 
        */
        bunnyghost.body.velocity.y = -800;
    },
    
    /* collision detection */
    update: function() {

        /* 
         * the spacerockgroup and burst objects is needs to test for collisions and burstCollision determine 
         * a function that's going to be called when a collision is detected.
         */
        this.physics.arcade.overlap(this.spacerockgroup, this.burst, this.burstCollision, null, this);
        /* targets the bunnies instead of the burst */
        this.physics.arcade.overlap(this.spacerockgroup, this.bunnygroup, this.bunnyCollision, null, this);
        /* check friendly fire of our bunnies. when a collision is detected friendlyFire()-function is activated */
        this.physics.arcade.overlap(this.bunnygroup, this.burst, this.friendlyFire, null, this);
    }
    
    
};
