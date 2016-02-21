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
            this.game.stage.backgroundColor = '#2C600C';
            var size = this.game.width > this.game.height ? this.game.height : this.game.width;
            var grid = new ns.FlowGrid(this.game, size * 0.75, this.size);
            this.game.add.existing(grid);
        },

        update: function() {

        }
    };

    window['node'] = window['node'] || {};
    window['node'].Flow = Flow;

}());