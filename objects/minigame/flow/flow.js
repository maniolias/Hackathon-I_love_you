(function() {
    'use strict';

    var ns = window["node"] || {};

    function Flow(size) { }

    Flow.prototype = {
        init: function(size){
            this.size = size;
        },

        preload: function() {
            this.game.stage.scaleMode = Phaser.ScaleManager.RESIZE;
            this.game.scale.pageAlignVertically = true;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.setShowAll();

            var self = this;
            window.addEventListener('resize', function() {
                self.game.stage.scaleMode = Phaser.ScaleManager.RESIZE;
                self.game.scale.pageAlignVertically = true;
                self.game.scale.pageAlignHorizontally = true;
                self.game.scale.setShowAll();
                self.game.scale.refresh();
            });
            this.game.scale.refresh();
        },

        create: function() {
            this.game.stage.backgroundColor = '#124184';
            var grid = new ns.FlowGrid(this.game, 640, this.size);
            this.game.add.existing(grid);
        },

        update: function() {

        }
    };

    window['node'] = window['node'] || {};
    window['node'].Flow = Flow;

}());