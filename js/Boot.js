/* Bootloader (Boot.js) represents the state of our game. It performs additional phaser 
 * configuration options and preparing our pre-loader assets. 
*/

/* We create an empty object */
var BunnyDefender = {};
/* Create a boot-object
 * It defines our boot state on BunnyDefender and sets it equal to a function 
 * and pass in our game object we created from index.html
 * 
 * The boot-object has to match the actual state itself. So the 
 * (BunnyDefender.Boot) must match the Boot.js. Boot = Boot
*/
BunnyDefender.Boot = function(game) {};
/* Prototype contains two functions:
 * preload - making sure of all of our assets is loaded and ready before launching 
 *           any additional game states.
 * create - is the creation event. this sets up different properties to our game and 
 *          sets up only once so you don't have to deal with it again
 *          (this) is going to refer to the actual game object that's been passed in. 
*/
BunnyDefender.Boot.prototype = {
    preload: function() {
        /* load our first image. the image which you can se for a half a second when reloaing the page */
        this.load.image('preloaderBar', 'images/loader_bar.png');
        /* load our second image, the titletext for the game */
        this.load.image('titleimage', 'images/TitleImage.png');
    },
    
    create: function() {
    /* input.Maxpointers is set to 1 that means we are only ever going to have 
     * one pointer that doesn't matter if that's a cursor. Or a finger on a mobile 
     * device will only have one pointer activated at a time. 
    */
    this.input.maxPointers = 1;
    /* Pause the game for us so that we don't collide with any enemies or anything like that. */
		this.stage.disableVisibilityChange = false;
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.minWidth = 270;
		this.scale.minHeight = 480;
    /* pageAlignHorizontally and pageAlignVertically centers our game. 
     * setting both to true will absolutely center our game within the browser view port. 
    */
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
    /* true - force portrait mode when we're playing our game. */ 
		this.stage.forcePortrait = true;
    /* true will force screen resize no matter what */
		this.scale.setScreenSize(true);
    /* sets up one pointer to the game */
		this.input.addPointer();
    /* sets up the background color */
		this.stage.backgroundColor = '#171642';
    // Launches the Preloader function from Preloader.js  
        this.state.start('Preloader');
    }
}
