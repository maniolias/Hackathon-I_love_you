window.onload = function() {
  'use strict';

  var game = {},
      ns = window['node'];

  game = new Phaser.Game(1280, 800, Phaser.CANVAS, 'flow');
  game.state.add('boot', ns.Boot);
  game.state.add('preloader', ns.Preloader);
  game.state.add('flow', ns.Flow);

  ns.Game = game;
  ns.Game.state.start('boot');
};