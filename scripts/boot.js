(function() {
    'use strict';

    var ns = window["node"] || {};

    function Boot() {}

    Boot.prototype = {

        preload: function() {
            this.load.image('preloader', 'assets/miscellaneous/preloader.gif');
        },

        create: function() {
            this.game.input.maxPointers = 1;

            if (this.game.device.desktop) {
                this.game.scale.pageAlignHorizontally = true;
            }
            else {
                this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.game.scale.minWidth = 480;
                this.game.scale.minHeight = 260;
                this.game.scale.maxWidth = 1920;
                this.game.scale.maxHeight = 1080;
                this.game.scale.forceOrientation(true);
                this.game.scale.pageAlignHorizontally = true;
                this.game.scale.setScreenSize(true);
                var self = this;
                window.addEventListener('resize', function() {
                    self.game.scale.refresh();
                });
                this.game.scale.refresh();
            }
            this.game.state.start('preloader');
        }
    };

    window['node'] = window['node'] || {};
    window['node'].Boot = Boot;

}());