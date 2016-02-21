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

        this.start = this.cells[0][0];
        this.end = this.cells[this.size - 1][this.size - 1];

        this.generatePath();
    };

    FlowPath.prototype.generatePath = function() {
        var prev = this.start;
        var end = [this.end.x, this.end.y];

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
        if (i == undefined) {
            return [/*{
                type: 'T',
                proba: 15
            }, {
                type: 'cross',
                proba: 5
            }, */{
                type: 'straight',
                proba: 55
            }, {
                type: 'turn',
                proba: 45
            }];
        }
        var cellA = this.path[i - 1];
        var isStart = false;
        if (cellA == null) {
            cellA = {
                x: -1,
                y: 0
            };
            isStart = true;
        }
        var cellB = this.path[i + 1];
        var isEnd = false;
        if (cellB == null) {
            cellB = {
                x: 4,
                y: 3
            };
            isEnd = true;
        }

        if (cellA.x == cellB.x || cellA.y == cellB.y) {
            if (isEnd || isStart) {
                return [{
                    type: 'straight',
                    proba: 100
                }];
            }
            return [/*{
                type: 'T',
                proba: 25
            }, {
                type: 'cross',
                proba: 5
            }, */{
                type: 'straight',
                proba: 70
            }];
        }
        if (isEnd || isStart) {
            return [{
                type: 'turn',
                proba: 100
            }];
        }
        return [/*{
            type: 'T',
            proba: 25
        }, {
            type: 'cross',
            proba: 10
        }, */{
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