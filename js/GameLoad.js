/* Load all the neccessery gamefile and start the game */


/* When the window is loaded run this function which creates a game instance */
window.onload = function() {
    /* Here is our Game object which takes the attributes 
     * ("width",  
     *  "height", 
     *  "Phaser.AUTO", how to render the game. Which is way to make Phaser deside and know the best delivery mechanism for the game itself,
     *  "gameContainer", is a reference where we will render out our game) 
     */
    var game = new Phaser.Game(540, 960, Phaser.AUTO, 'gameContainer');
    /* Adds the state of our game with two parameters:
     * Boot - which is the Bootloader (Boot.js)
     * BunnyDefender.Boot - the reference to the boot-object 
     */
    game.state.add('Boot', BunnyDefender.Boot);
    /* This will bind the preloader function to our game state. This is now going 
     * to be available for us to use the preloader inside of our game 
     */
    game.state.add('Preloader', BunnyDefender.Preloader);
    /* Load the Start Menu */
    game.state.add('StartMenu', BunnyDefender.StartMenu);
    /* Load the game objects and logics */
    game.state.add('Game', BunnyDefender.Game);
    /* Starts the game */
    game.state.start('Boot');
}
