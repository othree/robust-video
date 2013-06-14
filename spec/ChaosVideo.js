/*jslint browser: true, vars: true*/
(function (root) {
    "use strict";

    var nativeEvent = function (type) {
        var event = document.createEvent('HTMLEvents');
        event.initEvent(type, true, true);
        return event;
    };

    var asyncNativeEvent = function (type, handler) {
        return function () {
            var node = this;
            setTimeout(function () {
                if (typeof handler === 'function') {
                    handler.call(node);
                }
                node.dispatchEvent(nativeEvent(type));
            }, 10);
        };
    };
    var availableOptions = ['twiceplay', 'loop'];

    root.ChaosVideo = function (options) {
        options = typeof options === 'object' ? options : {};

        var option = '';
        for (option in availableOptions) {
            options[option] = options[option] !== undefined ? options[option] : false;
        }

        var div = document.createElement('div');
        div.paused = true;
        div.currentTime = 0;

        var playingTimer = 0;
        var playing = function () {
            if (div.currentTime > 5) {
                asyncNativeEvent('ended').call(div);
            } else {
                asyncNativeEvent('timeupdate', function () {
                    this.currentTime += 0.1;
                }).call(div);
                playingTimer = setTimeout(playing, 50);
            }
        };
        var startPlay = function () {
            playingTimer = setTimeout(playing, 5);
        };

        div.play = function () {
            div.paused = false;
            asyncNativeEvent('play').call(this);
            //Some old browser will trigger play event while canplay
            if (options.twiceplay) {
                setTimeout(function () {
                    asyncNativeEvent('play').call(this);
                    console.log('trigger play twice');
                    startPlay();
                }, 100);
            } else {
                startPlay();
            }
        };
        div.pause = function () {
            div.paused = true;
            clearTimeout(playingTimer);
            asyncNativeEvent('pause').call(this);
        };

        return div;
    };

}(this));
