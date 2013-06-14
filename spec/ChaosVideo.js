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
            }, 1);
        };
    };
    var availableOptions = ['twiceplay', 'noloop', 'unstoppable', 'loading', 'immeplaying'];

    root.ChaosVideo = function (options) {
        options = typeof options === 'object' ? options : {};

        var option = '',
            key = '';
        for (option in availableOptions) {
            key = availableOptions[option];
            options[key] = options[key] !== undefined ? options[key] : false;
        }

        var node = document.createElement('node');
        node.paused = true;
        node.currentTime = 0;
        node.loop = false;
        if (options.noloop) {
            node.loop = undefined;
        }

        var playingTimer = 0;
        var playing = function () {
            if (node.currentTime > 5 && !node.loop) {
                asyncNativeEvent('ended').call(node);
                node.pause();
            } else {
                if (node.currentTime > 5) {
                    node.currentTime = 0;
                }
                asyncNativeEvent('timeupdate', function () {
                    this.currentTime += 0.3;
                }).call(node);
                playingTimer = setTimeout(playing, 50);
            }
        };
        var startPlay = function () {
            playingTimer = setTimeout(playing, 5);
        };

        node.play = function () {
            asyncNativeEvent('play').call(this);
            if ((options.loading && options.immeplaying) || !options.loading) {
                asyncNativeEvent('playing').call(this);
            }
            //Some old browser will trigger play event while canplay
            if (options.loading) {
                var that = this;
                setTimeout(function () {
                    if (options.unstoppable || !node.paused) {
                        if (options.loading && !options.immeplaying) {
                            asyncNativeEvent('playing').call(that);
                        }
                        asyncNativeEvent('play').call(that);
                        startPlay();
                    }
                }, 100);
            } else {
                startPlay();
            }
        };
        node.pause = function () {
            clearTimeout(playingTimer);
            asyncNativeEvent('pause').call(this);
        };

        node.addEventListener('play', function () {
            node.paused = false;
        }, false);

        node.addEventListener('pause', function () {
            node.paused = true;
        }, false);

        return node;
    };

}(this));
