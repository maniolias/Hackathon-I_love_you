(function() {
    'use strict';

    var ns = window["node"] || {};


    function MapGrid(game) {
       
    };

    MapGrid.prototype = Object.create(Phaser.Group.prototype);
    MapGrid.prototype.constructor = MapGrid;

    window['node'] = window['node'] || {};
    window['node'].MapGrid = MapGrid;

}());