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
            if (typeof handler === 'function') {
                handler.call(node);
            }
            node.dispatchEvent(nativeEvent(type));
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

        var node = document.createElement('div');
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
                    this.currentTime += 0.2;
                }).call(node);
                playingTimer = setTimeout(playing, 50);
            }
        };

        node.play = function () {
            node.paused = false;
            asyncNativeEvent('play').call(this);
            if ((options.loading && options.immeplaying) || !options.loading) {
                asyncNativeEvent('playing').call(this);
            }
            //Some old browser will trigger play event while canplay
            if (options.loading) {
                var that = this;
                setTimeout(function () {
                    if (options.unstoppable) {
                        node.paused = false;
                    }
                    if (options.unstoppable || !node.paused) {
                        playing();
                        if (options.twiceplay || options.unstoppable) {
                            asyncNativeEvent('play').call(that);
                        }
                        if (!options.immeplaying) {
                            asyncNativeEvent('playing').call(that);
                        }
                    }
                }, 100);
            } else {
                playing();
            }
        };
        node.pause = function () {
            node.paused = true;
            clearTimeout(playingTimer);
            playingTimer = 0;
            asyncNativeEvent('pause').call(this);
        };

        node.controllerplay = function () {
            asyncNativeEvent('click').call(this);
            node.play();
        };
        node.controllerpause = function () {
            asyncNativeEvent('click').call(this);
            node.pause();
        };
        node.controllertapplay = function () {
            asyncNativeEvent('touchend').call(this);
            node.play();
        };
        node.controllertappause = function () {
            asyncNativeEvent('touchend').call(this);
            node.pause();
        };

        return node;
    };

}(this));
