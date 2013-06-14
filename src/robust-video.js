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
        return event;
    };

    var index = 0;

    root.RobustVideo = function (node) {
        if (node.getAttribute('data-robust') === 'yes') {
            return node;
        }
        var states = {
            paused: true,
            pausedTime: 0
        };
        var native = {
            play: node.play,
            pause: node.pause
        };
        var robust = {
            paused: true,
            postpaused: false,
            play: function () {
                if (!robust.paused) { return; }
                robust.paused = false;
                robust.postpaused = false;
                native.play.call(node);
            },
            pause: function () {
                if (robust.paused) { return; }
                robust.paused = true;
                robust.postpaused = true;
                native.pause.call(node);
            },
        };

        var method = '';
        for (method in native) {
            node[method] = robust[method];
        }

        node.addEventListener('play', function (event) {
            if (robust.postpaused) {
                native.pause.call(node);
            }
            if (!states.paused) {
                return;
            }
            states.paused = false;
            node.dispatchEvent(eventFactory('$play'));
        }, false);

        node.addEventListener('pause', function () {
            if (states.paused) {
                return;
            }
            states.paused = true;
            node.dispatchEvent(eventFactory('$pause'));
        }, false);

        node.addEventListener('ended', function () {
            if (!node.loop) {
                node.dispatchEvent(eventFactory('$ended'));
            } else {
                native.play.call(node);
            }
        }, false);

        node.index = ++index;
        node.setAttribute('data-robust', 'yes');
        return node;
    };

    root.robustVideo = root.RobustVideo;

}(this));
