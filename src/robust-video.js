/*jslint browser: true, vars: true*/
/*global CustomEvent: false*/

(function (root) {
    "use strict";

    var eventFactory = function (type) {
        var event;
        if (typeof CustomEvent === "function") {
            event = new CustomEvent(type, {bubbles: true, cancelable: true});
        } else {
            event = document.createEvent('Event');
            event.initEvent(type, true, true);
        }
        event.robust = true;
        return event;
    };

    root.RobustVideo = function (node, options) {
        if (node.getAttribute('data-robust') === 'yes') {
            return node;
        }
        options = typeof options === 'object' ? options : {};
        var eventPrefix = options.native ? '' : options.prefix || '$';

        var states = {
            paused: true,
            playing: false,
            startTime: 0
        };
        var native = {
            play: node.play,
            pause: node.pause
        };
        var robust = {
            play: function () {
                if (!states.paused) { return; }
                states.paused = false;
                native.play.call(node);
                if (eventPrefix) {
                    node.dispatchEvent(eventFactory(eventPrefix + 'play'));
                }
            },
            pause: function () {
                if (states.paused) { return; }
                states.paused = true;
                native.pause.call(node);
                if (eventPrefix) {
                    node.dispatchEvent(eventFactory(eventPrefix + 'pause'));
                }
            },
        };

        var method = '';
        for (method in native) {
            node[method] = robust[method];
        }

        var controlling = false,
            nonative = false;
        var toggleControlling = function () {
            controlling = true;
            setTimeout(function () { controlling = false; }, 1);
        };
        node.addEventListener('click', toggleControlling, false);
        node.addEventListener('touchend', toggleControlling, false);

        node.addEventListener('play', function (event) {
            states.startTime = node.currentTime;
            if (options.native && !event.robust && states.paused) {
                event.stopImmediatePropagation();
            }
            if (!states.paused) { return; }
            if (controlling) {
                states.paused = false;
                if (eventPrefix) {
                    node.dispatchEvent(eventFactory(eventPrefix + 'play'));
                }
            } else if (states.paused) {
                nonative = !!options.native;
                native.pause.call(node);
                nonative = false;
            }
        }, false);

        node.addEventListener('pause', function (event) {
            states.playing = false;
            if ((options.native && !event.robust && !states.paused) || nonative) {
                event.stopImmediatePropagation();
            }
            if (states.paused) { return; }
            if (controlling) {
                states.paused = true;
                if (eventPrefix) {
                    node.dispatchEvent(eventFactory(eventPrefix + 'pause'));
                }
            }
        }, false);

        node.addEventListener('ended', function (event) {
            if (!node.loop) {
                if (eventPrefix) {
                    node.dispatchEvent(eventFactory(eventPrefix + 'ended'));
                }
            } else {
                if (options.native) {
                    event.stopImmediatePropagation();
                }
                native.play.call(node);
            }
        }, false);

        if (options.native) {
            node.addEventListener('playing', function (event) {
                if (!event.robust) {
                    event.stopImmediatePropagation();
                }
            }, false);
        }

        node.addEventListener('timeupdate', function () {
            if (states.paused) { return; }
            if (states.playing) { return; }
            if (node.currentTime > states.startTime) {
                states.playing = true;
                node.dispatchEvent(eventFactory(eventPrefix + 'playing'));
            }
        }, false);

        node.addEventListener('durationchange', function (event) {
            if (options.native) {
                if (node.duration === 1) { event.stopImmediatePropagation(); }
                if (!isFinite(node.duration)) { event.stopImmediatePropagation(); }
            }
            if (node.duration === 1) { return; }
            if (!isFinite(node.duration)) { return; }
            if (eventPrefix) {
                node.dispatchEvent(eventFactory(eventPrefix + 'durationchange'));
            }
        }, false);

        node.setAttribute('data-robust', 'yes');
        return node;
    };

    root.robustVideo = root.RobustVideo;

}(this));
