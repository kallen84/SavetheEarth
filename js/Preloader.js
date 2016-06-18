/* 
 * preload the game contents. preload means to load in advance. Load before 
*/


/* Declare things we need when preloading and pass the game object as a parameter */
BunnyDefender.Preloader = function(game) {
    this.preloadBar = null;
    this.titleText = null;
    /* 
     * this.ready determine whether everything's preloaded and ready to run or not.
     * set the ready to equal to false, because we haven't loaded anything up yet, our game 
     * is not ready. 
    */
    this.ready = false;
};

/* 
 * Preloader.prototype-object specs out all of our different phaser functions for our 
 * preloader. 
*/
BunnyDefender.Preloader.prototype = {
     /* Preload function contains references to the preloadBar object that we created */
	preload: function () {
        /* 
         * adding preloadBar as a sprite. it allows to use a specific Sprite as a preload,
         * and it crops it in certain ways. We also reference preloader bar which is 
         * centered in the middle of the screen.  
        */
		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
		this.preloadBar.anchor.setTo(0.5, 0.5);
        /* setPreloadSprite is going to assign this Sprite that we've created to our actual preloader mechanism */
		this.load.setPreloadSprite(this.preloadBar);
		this.titleText = this.add.image(this.world.centerX, this.world.centerY-220, 'titleimage');
		/* 0.5 and 0.5. sets the transform point with an anchor point to the center of the object */
        this.titleText.anchor.setTo(0.5, 0.5);
        /* Load the title-background */
        this.load.image('titlescreen', 'images/startpageBG.png');
        /* Load the font */
        this.load.bitmapFont('eightbitwonder', 'fonts/eightbitwonder.png', 'fonts/eightbitwonder.fnt');
        /* Load the hill, sky-background */
        this.load.image('hill', 'images/earth.png');
        this.load.image('sky', 'images/starsky.jpg');
        /* Load our spritesheets-images (bunnies) and our XML-file */
        this.load.atlasXML('bunny', 'images/spritesheets/bunny.png', 'images/spritesheets/bunny.xml');
        /* Load our spritesheets-images (spacerocks) and our XML-file */
        this.load.atlasXML('spacerock', 'images/spritesheets/SpaceRock.png', 'images/spritesheets/SpaceRock.xml');
        /* pre-load the image that will be used for our particles(explosion). */
        this.load.image('explosion', 'images/explosion.png');
        /* Load the ghost of our bunnies */
        this.load.image('ghost', 'images/ghost.png');
        /* Load allt the sound and music effect for the game */
        this.load.audio('explosion_audio', 'audio/explosion.mp3');
        this.load.audio('hurt_audio', 'audio/hurt.mp3');
        this.load.audio('select_audio', 'audio/select.mp3');
        this.load.audio('game_audio', 'audio/bgm.mp3');
	},
    /* 
     * Create-function fires off once everything's happened in the preload function. 
    */
	create: function () {
        /* We set cropEnabled to false, this force show the whole thing */
		this.preloadBar.cropEnabled = false;
	},
    /* Update-function will constantly run after the create function has occurred. 
     * When everything's ready, this will run. When we set this ready = true, we know that 
     * our game is ready to run.
    */
	update: function () {
        /* 
         * if-statement checks to make sure that the sound is not only loaded up but is 
         * also fully decoded before we run our start menu
         */
        if(this.cache.isSoundDecoded('game_audio') && this.ready == false) {
            this.ready = true;
            /*  Start our menu when everything's loaded. */
            this.state.start('StartMenu');
        }
	}
};
