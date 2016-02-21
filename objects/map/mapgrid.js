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

        for (var i = 0; i < this.nb; i++) {
        	this.cells[i] = [];
            for (var j = 0; j < this.nb; j++) {
                if (!this.cells[i][j]) {
                    var c1 = new ns.MapTile(this.game, offset_intern * i + offset_intern / 2 + offset_global_x, offset_intern * j + offset_intern / 2 + offset_global_y, 'chip1', this.nb);
                    this.cells[i][j] = c1;
                    this.game.add.existing(c1);
                }
            }
        }
    }

    MapGrid.prototype = Object.create(Phaser.Group.prototype);
    MapGrid.prototype.constructor = MapGrid;

    window['node'] = window['node'] || {};
    window['node'].MapGrid = MapGrid;

}());