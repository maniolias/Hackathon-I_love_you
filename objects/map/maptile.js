(function() {
    'use strict';

    var ns = window["node"] || {};

    var animationsEnabled = true;

    var MapTile = function(game, x, y, type, nb, end) {
        Phaser.Sprite.call(this, game, x, y, type);

        this.inputEnabled = true;
        this.events.onInputDown.add(this.rotate, this);
        this.anchor.set(0.5);
        this.scale.set(1 / (nb / 2));
        this.isEnd = end;
    };

    MapTile.prototype = Object.create(Phaser.Sprite.prototype);
    MapTile.prototype.constructor = MapTile;

    window['node'] = window['node'] || {};
    window['node'].MapTile = MapTile;

}());