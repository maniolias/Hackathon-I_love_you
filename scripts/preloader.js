(function() {
    'use strict';

    var ns = window["node"] || {};

    function Preloader() {
        this.asset = null;
        this.ready = false;
    }

    Preloader.prototype = {

        preload: function() {
            this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
            this.game.stage.scaleMode = Phaser.ScaleManager.RESIZE;
            this.game.scale.pageAlignVertically = true;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.setShowAll();
            this.game.scale.refresh();

            this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
            this.load.setPreloadSprite(this.asset);

            this.game.load.image('straight', 'assets/minigame/flow/straight.png');
            this.game.load.image('turn', 'assets/minigame/flow/turn.png');
            this.game.load.image('cross', 'assets/minigame/flow/cross.png');
            this.game.load.image('T', 'assets/minigame/flow/T.png');

            this.game.load.image('start', 'assets/minigame/flow/start.png');
            this.game.load.image('end', 'assets/minigame/flow/end.png');
            this.game.load.image('flow', 'assets/minigame/flow/flow.png');

            this.game.load.image('tiles', 'assets/map/chip1.png');
            this.game.load.image('tiles', 'assets/map/chip2.png');
            this.game.load.image('tiles', 'assets/map/cpu1.png');
            this.game.load.image('tiles', 'assets/map/cpu2.png');
            this.game.load.image('tiles', 'assets/map/cpu3.png');
        },

        create: function() {

        },

        update: function() {
            var size = this.game.width > this.game.height ? this.game.height : this.game.width; 
            if (!!this.ready) {
                this.game.state.start('map', true, false, size);
            }
        },

        onLoadComplete: function() {
            this.ready = true;
        }
    };

    window['node'] = window['node'] || {};
    window['node'].Preloader = Preloader;

}());