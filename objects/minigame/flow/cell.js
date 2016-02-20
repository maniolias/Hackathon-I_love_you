(function() {
    'use strict';

    var ns = window["node"] || {};

    var animationsEnabled = true;

    var Cell = function(game, x, y, type, nb) {
        Phaser.Sprite.call(this, game, x, y, type);

        this.inputEnabled = true;
        this.events.onInputDown.add(this.rotate, this);
        this.anchor.set(0.5);
        this.scale.set(1 / (nb / 2));

        switch (type) {
            case 'T':
                this.structure = [
                    [0, 0, 0],
                    [1, 1, 1],
                    [0, 1, 0]
                ];
                break;
            case 'cross':
                this.structure = [
                    [0, 1, 0],
                    [1, 1, 1],
                    [0, 1, 0]
                ];
                break;
            case 'turn':
                this.structure = [
                    [0, 0, 0],
                    [1, 1, 0],
                    [0, 1, 0]
                ];
                break;
            case 'straight':
                this.structure = [
                    [0, 0, 0],
                    [1, 1, 1],
                    [0, 0, 0]
                ];
                break;
        }
    };

    Cell.prototype = Object.create(Phaser.Sprite.prototype);
    Cell.prototype.constructor = Cell;

    Cell.prototype.rotate = function(nb) {
        if (typeof nb != 'number') {
            nb = 1;
        }
        while (nb--) {
            this.angle += 90;
            var self = this;
            this.structure = this.structure[0].map(function(col, i) {
                return self.structure.map(function(row) {
                    return row[i]
                })
            });
        }
    }

    Cell.prototype.rotateRandom = function() {
        var r = this.game.rnd.integerInRange(0, 3);
        while (r--) {
            this.rotate();
        }
    }

    window['node'] = window['node'] || {};
    window['node'].Cell = Cell;

}());