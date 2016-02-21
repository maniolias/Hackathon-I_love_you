(function() {
    'use strict';

    var ns = window["node"] || {};


    function FlowGrid(game, size, nb) {
        Phaser.Group.call(this, game);

        this.nb = nb;

        var graphics = game.add.graphics(0, 0);

        var x = 0;
        var y = 0;

        var offset_global_x = (this.game.width - size) / 2;
        var offset_global_y = (this.game.height - size) / 2;
        var offset_intern = 0;
        var c1 = {};

        this.cells = [];

        this.path = new ns.FlowPath(nb);
        for (var i = 0; i < this.path.path.length; i++) {
            var xpos = this.path.path[i].x;
            var ypos = this.path.path[i].y;

            var type = this.getTypes(i);

            c1 = new ns.Cell(this.game, 0, 0, type.type, this.nb, i == (this.path.path.length - 1));
            offset_intern = c1.width;
            c1.x = offset_intern * xpos + offset_global_x;
            c1.y = offset_intern * ypos + offset_global_y;
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
                c1.rotateRandom();
            }
            this.cells[xpos][ypos] = c1;
        }

        for (var i = 0; i < this.nb; i++) {
            for (var j = 0; j < this.nb; j++) {
                if (!this.cells[i][j]) {
                    var type = this.getTypes();
                    var c1 = new ns.Cell(this.game, 0, 0, type.type, this.nb);
                    offset_intern = c1.width;
                    c1.x = offset_intern * i + offset_global_x;
                    c1.y = offset_intern * j + offset_global_y;
                    if (!this.cells[i])
                        this.cells[i] = [];
                    this.cells[i][j] = c1;
                    c1.rotateRandom();
                    this.game.add.existing(c1);
                }
            }
        }
        var start = this.game.add.sprite(offset_global_x - offset_intern, offset_global_y, 'start');
        start.anchor.set(0.5);
        start.scale.set(1 / (nb / 2));

        var end = this.game.add.sprite(offset_intern * this.nb + offset_global_x, offset_intern * (this.nb - 1) + offset_global_y, 'end');
        end.anchor.set(0.5);
        end.scale.set(1 / (nb / 2));

        this.flow = this.game.add.sprite(offset_global_x - c1.offsetX, offset_global_y, 'flow');
        this.flow.anchor.setTo(0.5, 0.5);
        this.flow.scale.set(1 / (nb / 2));

        this.flowDirection = 'right';

        this.texture = game.add.renderTexture(this.game.width, this.game.height, 'flowtrail');
        this.game.add.sprite(0, 0, this.texture);

        game.time.events.add(Phaser.Timer.SECOND * 5, this.run, this);
        this.endOfPrepare = false;

        this.cellCoords = [0, 0];
        this.activeCell = this.cells[this.cellCoords[0]][this.cellCoords[1]];
        this.activeWaypoint = this.activeCell.getNextWaypoint(this.flow.x, this.flow.y);

        // set a fill and line style
        graphics.beginFill(0x000000);
        graphics.lineStyle(10, 0x000000, 1);
        graphics.moveTo(offset_global_x - start.width - c1.offsetX , offset_global_y - c1.offsetY );
        graphics.lineTo(offset_global_x + (this.nb) * c1.width - c1.offsetX , offset_global_y - c1.offsetY );
        graphics.lineTo(offset_global_x + (this.nb) * c1.width - c1.offsetX , offset_global_y + (this.nb - 1) * c1.height - c1.offsetY );
        graphics.lineTo(offset_global_x + (this.nb + 1) * c1.width - c1.offsetX , offset_global_y + (this.nb - 1) * c1.height - c1.offsetY );
        graphics.lineTo(offset_global_x + (this.nb + 1) * c1.width - c1.offsetX , offset_global_y + (this.nb) * c1.height - c1.offsetY );
        graphics.lineTo(offset_global_x - c1.offsetX , offset_global_y + (this.nb) * c1.height - c1.offsetY );
        graphics.lineTo(offset_global_x - c1.offsetX , offset_global_y - c1.offsetY  + c1.height);
        graphics.lineTo(offset_global_x - start.width - c1.offsetX , offset_global_y - c1.offsetY  + c1.height);
        graphics.lineTo(offset_global_x - start.width - c1.offsetX , offset_global_y - c1.offsetY );
        graphics.endFill();
    }

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
        this.tween = this.game.add.tween(this.flow).to(this.activeWaypoint, 250, Phaser.Easing.Linear.None, true);
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
            if (this.cells[this.cellCoords[0]] && this.cells[this.cellCoords[0]][this.cellCoords[1]]) {
                this.activeCell = this.cells[this.cellCoords[0]][this.cellCoords[1]];
                this.activeCell.inputEnabled = false;
                this.activeWaypoint = this.activeCell.getNextWaypoint(this.flow.x, this.flow.y);
                if (this.activeWaypoint != null) {
                    this.checkDirAndRun();
                } else {
                    if (this.activeCell.isEnd) {
                        alert('you win');
                    } else {
                        alert('you loose');
                    }
                }
            } else {
                if (this.activeCell.isEnd) {
                    alert('you win');
                } else {
                    alert('you loose');
                }
            }
        } else {
            this.checkDirAndRun();
        }
    }

    FlowGrid.prototype.checkDirAndRun = function() {
        if (this.activeWaypoint.y > this.flow.y && this.flowDirection != 'down') {
            //this.flow.angle += 90;
            this.flowDirection = 'down';
        }
        if (this.activeWaypoint.y < this.flow.y && this.flowDirection != 'up') {
            //this.flow.angle -= 90;
            this.flowDirection = 'up';
        }
        if (this.activeWaypoint.x > this.flow.x && this.flowDirection != 'right') {
            //this.flow.angle += 90;
            this.flowDirection = 'right';
        }
        if (this.activeWaypoint.x < this.flow.x && this.flowDirection != 'left') {
            //this.flow.angle -= 90;
            this.flowDirection = 'left';
        }
        this.run();
    }

    FlowGrid.prototype.update = function() {
        if (this.endOfPrepare) {
            this.texture.renderXY(this.flow, this.flow.x, this.flow.y);
        }
    }

    window['node'] = window['node'] || {};
    window['node'].FlowGrid = FlowGrid;

}());