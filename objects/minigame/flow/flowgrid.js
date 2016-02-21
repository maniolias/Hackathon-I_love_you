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

        this.cells = [];

        var start = this.game.add.sprite(offset_intern * -1 + offset_intern / 2 + offset_global_x, offset_intern / 2 + offset_global_y, 'start');
        start.anchor.set(0.5);
        start.scale.set(1 / (nb / 2));

        var end = this.game.add.sprite(offset_intern * this.nb + offset_intern / 2 + offset_global_x, offset_intern * (this.nb - 1) + offset_intern / 2 + offset_global_y, 'end');
        end.anchor.set(0.5);
        end.scale.set(1 / (nb / 2));

        this.path = new ns.FlowPath(nb);

        for (var i = 0; i < this.path.path.length; i++) {
            var xpos = this.path.path[i].x;
            var ypos = this.path.path[i].y;

            var type = this.getTypes(i);

            var c1 = new ns.Cell(this.game, offset_intern * xpos + offset_intern / 2 + offset_global_x, offset_intern * ypos + offset_intern / 2 + offset_global_y, type.type, this.nb);
            if (!this.cells[xpos]) {
                this.cells[xpos] = [];
            }
            this.game.add.existing(c1);
            if (i == 0 || i == this.path.path.length - 1) {
                c1.inputEnabled = false;
                if (i == this.path.path.length - 1 && type.type == 'turn') {
                    c1.rotate(2);
                }
            } else {
                //c1.rotateRandom();
            }
            this.cells[xpos][ypos] = c1;
        }

        for (var i = 0; i < this.nb; i++) {
            for (var j = 0; j < this.nb; j++) {
                if (!this.cells[i][j]) {
                    var type = this.getTypes();
                    var c1 = new ns.Cell(this.game, offset_intern * i + offset_intern / 2 + offset_global_x, offset_intern * j + offset_intern / 2 + offset_global_y, type.type, this.nb);
                    if (!this.cells[i])
                        this.cells[i] = [];
                    this.cells[i][j] = c1;
                    this.game.add.existing(c1);
                }
            }
        }

        this.flow = this.game.add.sprite(offset_global_x, offset_intern / 2 + offset_global_y, 'flow');
        this.flow.anchor.setTo(0, 0.5);
        this.flow.scale.set(1 / (nb / 2));

        this.flowDirection = 'right';

        this.texture = game.add.renderTexture(this.game.width, this.game.height, 'flowtrail');
        this.game.add.sprite(0, 0, this.texture);

        game.time.events.add(Phaser.Timer.SECOND * 5, this.run, this);
        this.endOfPrepare = false;

        this.cellCoords = [0, 0];
        this.activeCell = this.cells[this.cellCoords[0]][this.cellCoords[1]];
        this.activeWaypoint = this.activeCell.getNextWaypoint(offset_global_x, offset_intern / 2 + offset_global_y);

        this.debugPath = game.add.graphics(0, 0)
        this.debugPath.lineStyle(1, 0xff0000)
        this.debugPath.moveTo(this.activeWaypoint.x, this.activeWaypoint.y);
    };

    FlowGrid.prototype = Object.create(Phaser.Group.prototype);
    FlowGrid.prototype.constructor = FlowGrid;

    FlowGrid.prototype.getTypes = function(idx) {
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

    FlowGrid.prototype.run = function() {
        this.endOfPrepare = true;
        this.tween = this.game.add.tween(this.flow).to(this.activeWaypoint, 1000, Phaser.Easing.Linear.None, true);
        this.tween = this.tween.onComplete.add(this.continu, this);
    }

    FlowGrid.prototype.continu = function() {
        this.activeWaypoint = this.activeCell.getNextWaypoint(this.flow.x, this.flow.y);
        if (this.activeWaypoint == null) {
            switch (this.flowDirection) {
                case 'down':
                    this.cellCoords[1] += 1;
                    break;
                case 'up':
                    this.cellCoords[1] -= 1;
                    break;
                case 'left':
                    this.cellCoords[0] -= 1;
                    break;
                case 'right':
                    this.cellCoords[0] += 1;
                    break;
            }
            this.activeCell = this.cells[this.cellCoords[0]][this.cellCoords[1]];
            this.activeWaypoint = this.activeCell.getNextWaypoint(this.flow.x, this.flow.y);
            if (this.activeWaypoint != null) {
                this.checkDirAndRun();
            } else {
                this.activeCell.getNextWaypoint(this.flow.x, this.flow.y);
            }
        } else {
            this.checkDirAndRun();
        }
    }

    FlowGrid.prototype.checkDirAndRun = function() {
        if (this.activeWaypoint.y > this.flow.y && this.flowDirection != 'down') {
            this.flow.angle += 90;
            this.flowDirection = 'down';
        }
        if (this.activeWaypoint.y < this.flow.y && this.flowDirection != 'up') {
            this.flow.angle -= 90;
            this.flowDirection = 'up';
        }
        if (this.activeWaypoint.x > this.flow.x && this.flowDirection != 'right') {
            this.flow.angle += 90;
            this.flowDirection = 'right';
        }
        if (this.activeWaypoint.x < this.flow.x && this.flowDirection != 'left') {
            this.flow.angle -= 90;
            this.flowDirection = 'left';
        }
        this.run();
    }

    FlowGrid.prototype.update = function() {
        if (this.endOfPrepare) {
            this.texture.renderXY(this.flow, this.flow.x, this.flow.y);
            this.debugPath.lineTo(this.flow.x, this.flow.y)
        }
    }

    window['node'] = window['node'] || {};
    window['node'].FlowGrid = FlowGrid;

}());