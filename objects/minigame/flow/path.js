(function() {
    'use strict';

    function FlowPath(size) {
        this.cells = [];
        this.size = size;

        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (!this.cells[i]) {
                    this.cells[i] = [];
                }
                //border : left, up, right, down
                this.cells[i][j] = new Cell([i == 0, j == 0, i == (size - 1), j == (size - 1)], i, j);
            }
        }

        this.generatePath();
        console.log('finish');
    };

    FlowPath.prototype.generatePath = function() {
        var prev = this.cells[0][0];
        var end = [this.size - 1, this.size - 1];

        this.path = [];
        var nbVisited = 0;
        while (nbVisited < (this.cells.length * this.cells.length)) {
            var next = this.getUnvisitedCell(prev.x, prev.y);

            if (next != null) {
                if (!prev.visited) {
                    nbVisited++;
                }
                prev.visited = true;
                prev.goodPath = true;
                this.path.push(prev);
                prev = next;
                if (prev.x == end[0] && prev.y == end[1]) {
                    prev.visited = true;
                    prev.goodPath = true;
                    this.path.push(prev);
                    break;
                }
            } else {
                if (!prev.visited) {
                    prev.visited = true;
                    nbVisited++;
                }
                prev.goodPath = false;
                prev = this.path.pop();
            }
        }
        if (nbVisited == 16)
            console.log('end path');
        console.log(nbVisited);
    }

    FlowPath.prototype.getUnvisitedCell = function(x, y) {
        var cell = null;

        var coordinates = this.cells[x][y].getNeighborsCoordinates();
        coordinates = shuffle(coordinates);
        for (var i = 0; i < coordinates.length; i++) {
            if (!this.cells[coordinates[i][0]][coordinates[i][1]].visited) {
                cell = this.cells[coordinates[i][0]][coordinates[i][1]];
                break;
            }
        }
        return cell;
    }

    FlowPath.prototype.getPossibleType = function(i) {
        if (!i) {
            return [{
                type: 'T',
                proba: 15
            }, {
                type: 'cross',
                proba: 5
            }, {
                type: 'straight',
                proba: 55
            }, {
                type: 'turn',
                proba: 45
            }];
        }
        var cellA = this.path[i - 1];
        if (cellA == null) {
            cellA = {
                x: -1,
                y: 0
            }
        }
        var cellB = this.path[i + 1];
        if (cellB == null) {
            cellB = {
                x: 4,
                y: 3
            }
        }

        if (cellA.x == cellB.x || cellA.y == cellB.y) {
            return [{
                type: 'T',
                proba: 25
            }, {
                type: 'cross',
                proba: 5
            }, {
                type: 'straight',
                proba: 70
            }];
        }
        return [{
            type: 'T',
            proba: 25
        }, {
            type: 'cross',
            proba: 10
        }, {
            type: 'turn',
            proba: 65
        }];
    }

    window['node'] = window['node'] || {};
    window['node'].FlowPath = FlowPath;

    function Cell(borders, x, y) {
        this.visited = false;
        this.goodPath = false;
        this.next = null;

        this.borders = borders;
        this.x = x;
        this.y = y;
    }

    Cell.prototype.nbNeightbors = function() {
        return this.borders.filter(function(x) {
            return x == 0
        }).length
    }

    Cell.prototype.getNeighborsCoordinates = function() {
        var coordinates = [];
        if (!this.borders[0]) {
            coordinates.push([this.x - 1, this.y]);
        }
        if (!this.borders[1]) {
            coordinates.push([this.x, this.y - 1]);
        }
        if (!this.borders[2]) {
            coordinates.push([this.x + 1, this.y]);
        }
        if (!this.borders[3]) {
            coordinates.push([this.x, this.y + 1]);
        }
        return coordinates;
    }

    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        while (0 !== currentIndex) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }


    window['node'] = window['node'] || {};
    window['node'].FlowPath = FlowPath;
}());