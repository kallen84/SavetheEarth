/* 
 * Bootloader (Boot.js) represents the state of our game. It performs additional phaser 
 * configuration options and preparing our pre-loader assets. 
*/

/* Create an empty object */
var BunnyDefender = {};
/* 
 * Boot-object defines our boot state on BunnyDefender and sets it equal to a function 
 * and pass in our game object we created from index.html
*/
BunnyDefender.Boot = function(game) {};

BunnyDefender.Boot.prototype = {
    /* 
     * preload-function making sure of all of our assets is loaded and ready before 
     * launching any additional game states. 
    */
    preload: function() {
        /* loads our preload-image */
        this.load.image('preloaderBar', 'images/loader_bar.png');
        /* loads our second image, the titletext for the game */
        this.load.image('titleimage', 'images/TitleImage.png');
    },
    /* create-function sets up different properties to our game and sets up only once 
     * so you don't have to deal with it again (this) is going to refer to the 
     * game object that's been passed in. 
    */
    create: function() {
    /* 
     * input.Maxpointers is set to 1 that means we are only ever going to have 
     * one pointer in the game
    */
    this.input.maxPointers = 1;
        /* Pauses the game so that we don't collide with any enemies */
		this.stage.disableVisibilityChange = false;
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.minWidth = 270;
		this.scale.minHeight = 480;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
        /* true = force portrait mode when we're playing our game. */ 
		this.stage.forcePortrait = true;
        /* we set true which will force screen resize no matter what */
		this.scale.setScreenSize(true);
        /* sets up one pointer to the game */
		this.input.addPointer();
		this.stage.backgroundColor = '#171642';
        /* Launches the Preloader function from Preloader.js */ 
        this.state.start('Preloader');
    }
}
