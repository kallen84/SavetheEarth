/* Game.js contains all the game states such as objects and logics */

BunnyDefender.Game = function(game) {
    /* Declaring global varibles */

    /* totalBunnies counts to determine how many bunnies should be generated onto our stage. */
    this.totalBunnies;
    /* bunnyGroup is going to use phaser's grouping mechanism in order to control the bunnies 
     * and allow us to perform collisions and things like that upon the entire group, 
     * instead of dealing with each one individually. 
    */
    this.bunnyGroup;
    this.totalSpacerocks;
    this.spacerockgroup;
    /* burst is our emitter which is going to emit(send) different particles based on that explosion 
     * image we just created. 
    */
    this.burst;
    this.gameover;
    /* countdown-text */
    this.countdown;
    /* this is our our bit map text over message */
    this.overmessage;
    /* this is the counter where we'll increment the seconds. */
    this.secondsElapsed;
    /* Phaser has a timer functionality and this is going to keep time of the seconds elapsed(passed) 
     * from when the game starts. */
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
        /* set the gameover to false before anything else happens in our game. */
        this.gameover = false;
        this.secondsElapsed = 0;
        /* our timer for ending the game. here we want to loop the timer and set it to false to tell the timer that we 
         * do not want it to remove itself from the game after it's over. If we set this to true then the timer 
         * would only run once. */
        this.timer = this.time.create(false);
        /* Here we tell how often we want the timer to loop. We want this to happen every single second. 
         * So, we'll pass in 1,000 milliseconds, and every time a second passes, we want to activate the 
         * UpdateSeconds-function. So this updates seconds and then finally we pass in a reference to the timer itself. */
        this.timer.loop(1000, this.updateSeconds, this);
        /* the total bunnies of 20 */
        this.totalBunnies = 20;
        /* the total space-rocks of 13 */
        this.totalSpacerocks = 13;
        /* add the game music soundtrack */
        this.music = this.add.audio('game_audio');
        /* here we'll start playing at once since it's all pre-loaded and decoded. 
         * ''   = the marker of the song. here we can specify a specific marker in our audio
         * 0    = we'll tell it to start at a specific position.   
         * 0.3  = initialize a volume
         * true = looping the music
        */
        this.music.play('', 0, 1, true);
        /* the sound effects down below is just added and we don't start to play them from here */
        this.ouch = this.add.audio('hurt_audio');
        this.boom = this.add.audio('explosion_audio');
        this.ding = this.add.audio('select_audio');
        /* buildWorld-function is going to help us modularize what going on in our game state */
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
        /* countdown-text-function. Here we displays it 10px from left, 10px from top
         * we use the font "eightbitwonder" and prints out a text of how many bunnies left
         * and concatenate the 'Bunnies Left' with the total amount of Bunnies left (totalBunnies = 20)
         *  20 = The size of the text with the unit of 20
        */
        this.countdown = this.add.bitmapText(10, 10, 'eightbitwonder', 'Bunnies Left ' + this.totalBunnies, 20);
        /* starts the timer after everything's been created */
        this.timer.start();
    },
    /* buildBunnies-function generates all of the bunny assets we need for the game */
    buildBunnies: function() {
        /* This bunnygroup will create a new group for us called bunnygroup. */
        this.bunnygroup = this.add.group();
        /* enables(aktiverar) the body on the group. This allows the bunny group to interact with 
         * other objects that we might create, other entities. It works with the phaser physics 
         * engine in order to form collisions and other things like that 
        */
        this.bunnygroup.enableBody = true;
        /* Loop out individual bunnies and add them to the group */
        for(var i=0; i<this.totalBunnies; i++) {
            /* var b create a new entity and bind it within our bunny group. 
             *
             * FIRST we pass (integerInRange-width) in the create() which creates a is a random number
             * it allows us to use two specific numbers and it will spit back a number somewhere 
             * between those two. So here we're going from negative 10, to the world with minus 50.
             * This will get some number that's between one side of the stage and the 
             * other side of the stage
             *
             * SECOND we also pass the height of game world. 'bunny' makes us create a new bunny
             * 'Bunny0000' tells us where inside of the texture atlas we want to actually start 
             * bringing that out. If we look inside the atlas itself, in 
             * Images > Sprite Sheets > Bunny XML, we can see that that is the first named 
             * subtexture within our texture atlas. 
             * Exemple in bunny.XML:
             * <SubTexture name="Bunny0000" x="0" y="0" width="64" height="69" pivotX="0.6" pivotY="1.65" frameX="0" frameY="-1" frameWidth="64" frameHeight="70"/>
            */
            var b = this.bunnygroup.create(this.rnd.integerInRange(-10, this.world.width-50), this.rnd.integerInRange(this.world.height-180, this.world.height-60), 'bunny', 'Bunny0000');
            /* sets the anchor to the center of the bunny. So 0.5. And 0.5 for both the x and the y */ 
            b.anchor.setTo(0.5, 0.5);
            /* disable the physics engine to take control of these bunnies.
             * so setting that to false allows us to control in manually. */  
            b.body.moves = false;
            /* set a number of different animations:
             * Rest - is what'll happen when the bunny is just sitting there
             * Walk - is a walk animation, and this will occur when the bunny 
             *        is actually hopping across the screen.
             * Both of the Rest and Walk animation needs a specific array of numbers
             * and these correspond to frames within our texture atlas. 
             * So from frames one to frames 58, that's our rest state.
             * Rest - for each of the bunnies we play it's rest state at 24 frames 
                      per second
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
        /* bposition variable is based on a random number. The position itself is not the position 
         * that the bunny is presently in, but it's the position that the bunny wants to go to.
         * realInRange(50) represents the 50px from the left and the (.width-50) 50px from the right 
        */
        bposition = Math.floor(this.rnd.realInRange(50, this.world.width-50));
        /* Make the bunnies move like there acting of their own will because this is going to make 
         * it so that the bunnies all start moving at a different time. between 2000 - 6000 miliseconds 
        */
        bdelay = this.rnd.integerInRange(2000, 6000);
        /* In the if-statement we have some logics for the bunnies movment which determine which direction the
         * bunny should actually face when it starts moving. 
         * If the bunny is on the right side of the stage and he wants to move to the left side of the stage (if-statement),
         * he should face that particular way.
         */
        if(bposition < b.x){
            /* In the scale.x we set 1 or negative 1 which will flip the rabbit from one direction to the other. */
            b.scale.x = 1;
        /* In the else-statement, if the bunny is on the left side of the stage and wants to move to the right 
         * of the stage, then he should face the opposite direction. */
        }else{
            b.scale.x = -1;
        }
        /* Here we set our tween (t) which makes the actual movement for each bunnies.
         * when we add tween we also passes the (b) variable which is our bunny variable from line 86
         *
         * in this variable we also have a to()-function which we use to tell what we want to move a 
         * particular attribute to.
         * x:bposition is how we move the bunny in x-axis where we have from line 115 with bposition
         * 3500 tells how long we want this tween to last, in this case 3,5 seconds
         * Phaser.Easing tells us the flow movement of our bunnies which is going to start off slow, 
         * speed up, and then end up slow as well.
         * true = we autostart the tween
         * bdelay = radomize a delay
        */
        t = this.add.tween(b).to({x:bposition}, 3500, Phaser.Easing.Quadratic.InOut, true, bdelay);
        /* Event-listeners
         * (onStart) when the tween starts the startBunny-function activates
         * (onComplete) when the tween ends the stopBunny-function activates
        */    
        t.onStart.add(this.startBunny, this);
        t.onComplete.add(this.stopBunny, this);

    }, // assignBunnyMovement()
    
    startBunny: function(b) {
        /* Stops our play-animation */
        b.animations.stop('Rest');
        /* Starts the play-animation
         * 24 = frames per seconds
         * true = autoloop. sets autoloop to true. when its ends it will continue to loop until we tell it to stop.
        */
        b.animations.play('Walk', 24, true);
    },
    
    stopBunny: function(b) {
        /* stops on our walk-animation */
        b.animations.stop('Walk');
        /* play on our rest-animation */
        b.animations.play('Rest', 24, true);
        /* this is going to activate the assignBunnyMovement-function with its position, its delay, 
         * its actual direction it's facing, and create a new tween starting the process all over again 
         * for each individual bunny. 
        */
        this.assignBunnyMovement(b);
    },
    
    buildSpaceRocks: function() {
        this.spacerockgroup = this.add.group();
        /* loops out the total amount of 13 spacerocks as we declared up above on 
         * line 36 this.totalSpacerocks = 13; 
        */
        for(var i=0; i<this.totalSpacerocks; i++) {
            /* this is the space rock instance
             * r is equal to this space rock group dot create, we set a random integer in range 
             * from zero to the width of the world, so across the entire stage from one side to the other. 
             * for y-axis we set again a random number between zero, which is the top of the stage, and negative 1,500. 
             * This is going to position the space rocks far above the stage. We'll identify it as space rock, 
             * and we're going to use the entire animation, the entire sprite sheet, every single frame 
             * so (SpaceRock0000) which we references to as our spritesheet and we're we load in our XML
             * 
            */
            var r = this.spacerockgroup.create(this.rnd.integerInRange(0, this.world.width), this.rnd.realInRange(-1500, 0), 'spacerock', 'SpaceRock0000');
            /* creates a randomized scaling effect so you'll have some that are small, and some that are larger rocks */
            var scale = this.rnd.realInRange(0.3, 1.0);
            r.scale.x = scale;
            r.scale.y = scale;
            /* enables the physics for our rocks (gravity)
             * enables()-function will enable this upon each individual rock and the type of physics engine we're using 
             *  */
            this.physics.enable(r, Phaser.Physics.ARCADE);
            /* enables the body for our spacerocks */
            r.enableBody = true;
            /* we'll set the velocity y upon the body.
             * it will determine how fast that these rocks will fall from top to bottom which we also randomize.
             * so they don't all fall down at once.
              */
            r.body.velocity.y = this.rnd.integerInRange(200, 400);
            /* this animation only have one which is the falling-animation */
            r.animations.add('Fall');
            /* Then we'll say play, fall, we'll set that to 24 frames per second and have it loop continuously. */
            r.animations.play('Fall', 24, true);
            /* when spacerocks left the bounds of the world, it'll be able to fire off an event, it'll be aware that 
             * it has left the world. 
            */
            r.checkWorldBounds = true;
            /* bind an event to checkWorldBounds 
             * we pass the function resetRock in add()-function. this is going to reference the object 
             * itself(the spacerock)
            */
            r.events.onOutOfBounds.add(this.resetRock, this);
        }
    },
    
    /* resets the rock and call for the respawnRock-function to respawn the rock when gone and out from the screen 
     * here we passing in that individual space rock instance (r) on line 193, 
     * that has just left the world bounds.
     * in the if-statement we check if the Y position of that particular entity is greater than the world height.
     * this reset rock would even trigger before they fell into the actual visible area of our game. 
     * If we're checking to see whether the Y position is below the world height, then we know the space rocks 
     * have actually transversed the entire game world before we go and remove them.
    */
    resetRock: function(r) {
        if(r.y > this.world.height) {
            /* here we activate the respawn-function */
            this.respawnRock(r);   
        }
    },
    
    respawnRock: function(r) {
        /* Here we say if this.gameover is equal to false. Then we want to be able to actually respawn the rocks. 
         * If game over is true, we don't want this to ever execute. We'll do the same thing for fire burst. 
         * If this.gameover is equal to false, then it's permissible to fire a new burst. 
         * we need always to set a gameover-function to false because if we don't its only going to loop
         * everything over and over
         */
        if(this.gameover == false){
            /* reset()-function resets the x, y-axis for the entitys */
            r.reset(this.rnd.integerInRange(0, this.world.width), this.rnd.realInRange(-1500, 0));
            /* resets the velocity of the game world */
            r.body.velocity.y = this.rnd.integerInRange(200, 400);
        }
    },
    /* allowing the player to cause defensive explosions(particles) through click or touch input. */
    buildEmitter:function() {
        /* we position the emitter on zero, zero
         * 80 = the amount of particles(explosion) that the emitter can hold at any specific time. 
         * OBS! if you change this to a higher number exemple 300. You as a player can now have 300
         * explosions displaying on the screen
        */
        this.burst = this.add.emitter(0, 0, 80);
        /* sets a minimum and maximum particles(explosion) scale 
         * What this will do is create a nice little burst effect for us. */

        this.burst.minParticleScale = 0.3;
        this.burst.maxParticleScale = 1.2;
        /* sets a minimum and maximum particles(explosion) speed
         * What this will do is create a nice little burst effect for us.  */
        this.burst.minParticleSpeed.setTo(-30, 30);
        this.burst.maxParticleSpeed.setTo(30, -30);
        /* activates the makeParticles-function. we pass a reference of the picture for the explosion */
        this.burst.makeParticles('explosion');
        /* want this action to happen on click or touch.
         * here we active the fireBurst_function which holds the click-event
         * this-word after this.fireBurst refers to our actual input */
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
            /* starts the particles running 
             * true = determine whether or not the bursts acts as an explosion or not
             * 2000 = lifespan of each particle set to 2 seconds
             * null = is the frequency with which our emitter emits particles. the only thing we can 
             *        really do here is pass in null. Because the frequency is basically pointless.
             * 20 = the quantatiy of our clicks
            */ 
            this.burst.start(true, 2000, null, 20);
        }
    },
    /* respawn any of the rocks that touched by the particles.
     * we passes a instance for spacerock (r) and instance for the bunny (b) */
    burstCollision: function(r, b) {
        this.respawnRock(r);  
    },
    /* Bunny collison */
    bunnyCollision: function(r, b) {
        /* here we check whether that particular Bunny instance still exists or not. 
         * we'll say if B.exists, and that way we know for sure that the bunny still exists.*/
        if(b.exists){
            /* plays the sound-effect (ouch) when a bunny is hit */
            this.ouch.play();

            this.ouch.volume = 0.1;
            /* respawn the rocks and pass in the rock space instance which we declared above
             * this will respawn the rock to the top of the world */
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
    /* if we have any bunnies left. if we don't have any bunnies left game over */
    checkBunniesLeft: function() {
        if(this.totalBunnies <= 0){
            this.gameover = true;
            /* stops the music when the game is over */
            this.music.stop();
            /* Sets the text to 'Bunnies Left 0' when all the bunnies is killed */
            this.countdown.setText('Bunnies Left 0');
            /* Game over messaging. Displays the game over-text 
             * this.world.centerX-180, this.world.centerY-40 = center the Game Over text
             * \n\n' = 2 linebreak
             * this.secondsElapsed = prints out the amout of seconds you survived
             * 42 = units of our font-text. (font-size)
            */
            this.overmessage = this.add.bitmapText(this.world.centerX-200, this.world.centerY-200, 'eightbitwonder', 'YOU SURVIVED FOR\n\n' + this.secondsElapsed + ' SECONDS\n\n\n\n' + 'TRY AGAIN', 30);
            this.overmessage.align = "center";
            /* this will allow user to actually click on that bitmapText and then we can respond to it. */
            this.overmessage.inputEnabled = true;
            /* we use this to make a response after a user clicks  */
            this.overmessage.events.onInputDown.addOnce(this.quitGame, this);
        /* In the else-statement, if a game isn't over, if total bunnies is not less than or equal to one 
         * then we want to spit out the actual count of our bunnies. We then say this.countdown.setText, 
         * and here we'll just say Bunnies Left, and then append the actual bunny count, totalBunnies.
        
        */    
        }else {
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

    /* this function will run when a bunny gets hit by the explosion and also 
     * the emitter particle that hit it.  */
    friendlyFire: function(b, e){
        /* here we check if a bunny exists if so... */
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
    /* Makes a bunny transform to a ghost when killed 
     * here we need to know the x and y position of our bunny as well as its scale x.  
     * 
     */
    makeGhost: function(b) {
        bunnyghost = this.add.sprite(b.x-20, b.y-180, 'ghost');
        /* sets the anchor to center */
        bunnyghost.anchor.setTo(0.5, 0.5);
        /* set the scale to whatever the scale x of the bunny instance is.
         * in this bunny animation we sort of change the scale x, depending upon which way the bunny is facing. */
        bunnyghost.scale.x = b.scale.x;
        /* sets the physics to the bunnyghosts. this makes bunny ghost respond to gravity. */
        this.physics.enable(bunnyghost, Phaser.Physics.ARCADE);
        /* We'll set enable body to true, which makes each of these bunny ghost have a body that 
         * responds to that physics engine. */
        bunnyghost.enableBody = true;
        /* Here we check world bounds and set that to true. That way we can be notified when the bunny has 
         * left the screen. */
        bunnyghost.checkWorldBounds = true;
        /* this will make the gravity in our world for this particular entity is negative 800, which will cause 
         * the entity to go rushing to the top of the screen. */
        bunnyghost.body.velocity.y = -800;
    },
    
    /* collision detection */
    update: function() {
        /* The first two are the two objects or groups that we need to test for collisions against. So the 
         * first will be this.spacerockgroup, and the second is going to be our emitter so this.burst. 
         * burstCollision = determine a function that's going to be called whenever a collision is detected.
         * null = This is for our process callback which we're not using in this case.
         * (this) = allow us to access the two particular entities that have collided with one another 
         *          inside of our burst collision function.
         */
        this.physics.arcade.overlap(this.spacerockgroup, this.burst, this.burstCollision, null, this);
        /* Here we target the bunnies instead of the burst
         * instead of burst we reference to bunnygroup and adds a function (bunnyCollision) 
        */
        this.physics.arcade.overlap(this.spacerockgroup, this.bunnygroup, this.bunnyCollision, null, this);
        /* here we check friendly fire of our bunnies. when a collision is detected we active the 
         * friendlyFire()-function */
        this.physics.arcade.overlap(this.bunnygroup, this.burst, this.friendlyFire, null, this);
    }
    
    
};
