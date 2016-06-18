/* Load all the neccessery gamefile and start the game */


/* Creates a game instance when the window is loaded */
window.onload = function() {
    /* 
     * the game object with parameters of height, width and Phaser.AUTO to render out 
     * the game and to display it in the gameContainer-div
     */
    var game = new Phaser.Game(540, 960, Phaser.AUTO, 'gameContainer');
    /* 
     * Adds the state of our game with two parameters where Boot is the Bootloader (Boot.js)
     * and BunnyDefender.Boot which is the reference to the boot-object 
     */
    game.state.add('Boot', BunnyDefender.Boot);
    /* 
     * Binds the preloader function to our game state. This makes it available for us 
     * to use the preloader inside of our game 
     */
    game.state.add('Preloader', BunnyDefender.Preloader);
    /* Load the Start Menu */
    game.state.add('StartMenu', BunnyDefender.StartMenu);
    /* Load the game objects and logics */
    game.state.add('Game', BunnyDefender.Game);
    /* Starts the game */
    game.state.start('Boot');
}
