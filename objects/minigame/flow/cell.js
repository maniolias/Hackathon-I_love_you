(function() {
    'use strict';

    var ns = window["node"] || {};

    var animationsEnabled = true;

    var Cell = function(game, x, y, type, nb, end) {
        Phaser.Sprite.call(this, game, x, y, type);

        this.inputEnabled = true;
        this.events.onInputDown.add(this.rotate, this);
        this.anchor.set(0.5);
        this.scale.set(1 / (nb / 2));
        this.isEnd = end;

        switch (type) {
            case 'T':
                this.structure = [
                    [0, 1, 0],
                    [1, 1, 0],
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
            var l = this.structure.length - 1;
            var tmp = [];
            for (var i in this.structure) {
                var row = this.structure[i];
                for (var j in row) {
                    if (!tmp[j]) {
                        tmp[j] = [];
                    }
                    tmp[j][l - i] = this.structure[i][j];
                }
            }
            this.structure = tmp;
        }
    }

    Cell.prototype.rotateRandom = function() {
        var r = this.game.rnd.integerInRange(0, 3);
        while (r--) {
            this.rotate();
        }
    }

    Cell.prototype.getNextWaypoint = function(fromx, fromy) {
        var tilex = Math.floor((fromx + this.width / 2 - this.x) / (this.width / 3));
        tilex = tilex >= 3 ? 2 : tilex;
        var tiley = Math.floor((fromy + this.height / 2 - this.y) / (this.height / 3));
        tiley = tiley >= 3 ? 2 : tiley;
        if (this.structure[tiley] && this.structure[tiley][tilex] && this.structure[tiley][tilex] == 1) {
            this.structure[tiley][tilex] = 0;
            if (this.structure[tiley - 1] && this.structure[tiley - 1][tilex] == 1) {
                return this.getWaypointFromCoord(tilex, tiley - 1);
            }
            if (this.structure[tiley + 1] && this.structure[tiley + 1][tilex] == 1) {
                return this.getWaypointFromCoord(tilex, tiley + 1);
            }
            if (this.structure[tiley] && this.structure[tiley][tilex - 1] == 1) {
                return this.getWaypointFromCoord(tilex - 1, tiley);
            }
            if (this.structure[tiley] && this.structure[tiley][tilex + 1] == 1) {
                return this.getWaypointFromCoord(tilex + 1, tiley);
            }
        }
        return null;
    }

    Cell.prototype.getWaypointFromCoord = function(x, y) {
        return {
            x: x * this.width / 2 - this.width / 2 + this.x,
            y: y * this.height / 2 - this.height / 2 + this.y,
        }
    }

    window['node'] = window['node'] || {};
    window['node'].Cell = Cell;

}());