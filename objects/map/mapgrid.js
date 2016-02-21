(function() {
    'use strict';

    var ns = window["node"] || {};


    function MapGrid(game, size, nb) {
        Phaser.Group.call(this, game);

        this.nb = nb;

        var x = 0;
        var y = 0;

        var offset_intern = size / this.nb;
        var offset_global_x = (this.game.width - size) / 2;
        var offset_global_y = (this.game.height - size) / 2;

        this.cells = [];
    }

    MapGrid.prototype = Object.create(Phaser.Group.prototype);
    MapGrid.prototype.constructor = MapGrid;

    window['node'] = window['node'] || {};
    window['node'].MapGrid = MapGrid;

}());