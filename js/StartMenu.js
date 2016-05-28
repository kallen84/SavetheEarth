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
	/*  create-function is built into Phaser. */
	create: function () {
        /* here we just need to reference the select audio-sound which is (ding) */
        this.ding = this.add.audio('select_audio');
    /* We set startBG which was declared up here in our constructor, to this.addimage.
     * And we're going to set it to x and y of zero. So the top left hand corner and we'll 
     * pass in title screen. Title screen is something that has already been preloaded through
     * our preloader. 
    */    
		startBG = this.add.image(0, 0, 'titlescreen');
    /* inputEnabled = true sets input enabled upon our start background. This is going to 
     * allow it to accept mouse clicks and touches. 
    */
		startBG.inputEnabled = true;
    /* onInputDown binds and event handler to our background. When it notices an input down,
     * it's going to invoke this.startgame, which is the function I've declared down here. 
     * And it'll pass in this, which is the game object. 
    */
		startBG.events.onInputDown.addOnce(this.startGame, this);
	  /* Here we position our text based again on the world's center x and center y. And we're 
     * using the eightbitwonder bitmap text object that we already created in our pre-loader. 
     * "touch to start" is what's going to displays on th screen. Use whatever text you want
     * and it will print that out through the bitmap text. 
     * The last property we put in, is the actual size that we want to render this at and 
     * this going to be 24.
     * When this function activates and when is clicked on it will active the 
     * startGame function which will "start the game"
    */
		startPrompt = this.add.bitmapText(this.world.centerX-155, this.world.centerY+130, 'eightbitwonder', 'Touch to Start!', 24);
	},
  /* When startPrompt function actives the startGamefunction we built and declared ourselfes
   * will finally start the game 
  */
	startGame: function (pointer) {
        /* this will activate and play that ding sound for us */
        this.ding.play();
        /* sets the volume for the ding-sound */
        this.ding.volume = 0.2;
		this.state.start('Game');
	}
};
