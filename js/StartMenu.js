/* Load the StartMenu page */


/* The startmenu constructor for the game */
BunnyDefender.StartMenu = function(game) {
    /* The background */
    this.startBG;
    /* The Prompt */
    this.startPrompt;
    /* The ding sound-effect when a user clicks on the screen */
    this.ding;
}
/* Core Phaser Function */
BunnyDefender.StartMenu.prototype = {
	create: function () {
        /* reference the select audio-sound */
        this.ding = this.add.audio('select_audio');
        /* titlescreen for our game */  
		startBG = this.add.image(0, 0, 'titlescreen');
        /* inputEnabled = true allow it to accept mouse clicks and touches. */
		startBG.inputEnabled = true;
        /* onInputDown binds and event handler to our background */
		startBG.events.onInputDown.addOnce(this.startGame, this);
	    /* 
         * Position and display our eightbitwonder bitmap text object on world's center x 
         * and center y on the screen. 24 is the size we want to render
        */
		startPrompt = this.add.bitmapText(this.world.centerX-155, this.world.centerY+130, 'eightbitwonder', 'Touch to Start!', 24);
	},
    /* When startPrompt function activates this function will run and start the game */
	startGame: function (pointer) {
        /* activates and play that ding sound */
        this.ding.play();
        /* sets the volume for the ding-sound */
        this.ding.volume = 0.2;
		this.state.start('Game');
	}
};
