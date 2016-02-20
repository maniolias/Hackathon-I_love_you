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

        var start = this.game.add.sprite(offset_intern * -1 + offset_intern / 2 + offset_global_x, offset_intern / 2 + offset_global_y, 'start');
        start.anchor.set(0.5);
        start.scale.set(1/(nb/2));

        var end = this.game.add.sprite(offset_intern * this.nb + offset_intern / 2 + offset_global_x,offset_intern * (this.nb-1) + offset_intern / 2 + offset_global_y, 'end');
        end.anchor.set(0.5);
        end.scale.set(1/(nb/2));

        this.path = new ns.FlowPath(nb);

        for (var i = 0; i < this.path.path.length; i++) {
            var xpos = this.path.path[i].x;
            var ypos = this.path.path[i].y;

            var type = this.getTypes(i);

            var c1 = new ns.Cell(this.game, offset_intern * xpos + offset_intern / 2 + offset_global_x, offset_intern * ypos + offset_intern / 2 + offset_global_y, type.type, this.nb);
            if (!cells[xpos]) {
                cells[xpos] = [];
            }
            this.game.add.existing(c1);
            if(i == 0 || i == this.path.path.length-1){
                c1.inputEnabled = false;
                if(i == this.path.path.length-1 && type.type == 'turn'){
                    c1.rotate(2);
                }
            }
            else {
                c1.rotateRandom();
            }
            cells[xpos][ypos] = c1;
        }

        for (var i = 0; i < this.nb; i++) {
            for (var j = 0; j < this.nb; j++) {
                if (!cells[i][j]) {
                    var type = this.getTypes();
                    var c1 = new ns.Cell(this.game, offset_intern * i + offset_intern / 2 + offset_global_x, offset_intern * j + offset_intern / 2 + offset_global_y, type.type, this.nb);
                    if (!cells[i])
                        cells[i] = [];
                    cells[i][j] = c1;
                    this.game.add.existing(c1);
                }
            }
        }
    };

    FlowGrid.prototype = Object.create(Phaser.Group.prototype);
    FlowGrid.prototype.constructor = FlowGrid;

    FlowGrid.prototype.getTypes = function(idx){
        var types = this.path.getPossibleType(idx);
        var r = this.game.rnd.integerInRange(0, types.length - 1);

        var ar = [];
        var k, sum = 0;

        for (k = 0; k < types.length - 1; k++) {
            sum += (types[k].proba / 100.0);
            ar[k] = sum;
        }

        var r = Math.random();

        for (k = 0; k < ar.length && r >= ar[k]; k++);

        return types[k];
    }

    window['node'] = window['node'] || {};
    window['node'].FlowGrid = FlowGrid;

}());