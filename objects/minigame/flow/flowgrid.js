(function() {
    'use strict';

    var ns = window["node"] || {};


    function FlowGrid(game, size, nb) {
        Phaser.Group.call(this, game);

        this.nb = nb;

        var x = 0;
        var y = 0;

        var offset_intern = size / this.nb;
        var offset_global_x = (this.game.width - size) / 2;
        var offset_global_y = (this.game.height - size) / 2;

        var cells = [];

        var path = new ns.FlowPath(nb);

        for (var i = 0; i < path.path.length; i++) {
            var xpos = path.path[i].x;
            var ypos = path.path[i].y;

            var types = path.getPossibleType(i);
            var r = game.rnd.integerInRange(0, types.length);

            var c1 = new ns.Cell(this.game, offset_intern * xpos + offset_intern / 2 + offset_global_x, offset_intern * ypos + offset_intern / 2 + offset_global_y, types[r], this.nb);
            console.log(offset_intern * xpos + offset_intern / 2 + offset_global_x, offset_intern * ypos + offset_intern / 2 + offset_global_y)
            if (!cells[xpos])
                cells[xpos] = [];
            cells[xpos][ypos] = c1;
            this.game.add.existing(c1);
        }
        console.log('created')

        /*for (var i = 0; i < this.nb; i++) {
            for (var j = 0; j < this.nb; j++) {
                var c1 = new ns.Cell(this.game, offset_intern * i + offset_intern / 2 + offset_global_x, offset_intern * j + offset_intern / 2 + offset_global_y, 'T', this.nb);
                if (!cells[i])
                    cells[i] = [];
                cells[i][j] = c1;
                this.game.add.existing(c1);
            }
        }*/
    };

    FlowGrid.prototype = Object.create(Phaser.Group.prototype);
    FlowGrid.prototype.constructor = FlowGrid;

    window['node'] = window['node'] || {};
    window['node'].FlowGrid = FlowGrid;

}());