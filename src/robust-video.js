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
            play: function () {
                if (!states.paused) { return; }
                states.paused = false;
                native.play.call(node);
                node.dispatchEvent(eventFactory('$play'));
            },
            pause: function () {
                if (states.paused) { return; }
                states.paused = true;
                native.pause.call(node);
                node.dispatchEvent(eventFactory('$pause'));
            },
        };

        var method = '';
        for (method in native) {
            node[method] = robust[method];
        }

        var controlling = false;
        var toggleControlling = function () {
            controlling = true;
            setTimeout(function () { controlling = false; }, 1);
        };
        node.addEventListener('click', toggleControlling, false);
        node.addEventListener('touchend', toggleControlling, false);

        node.addEventListener('play', function (event) {
            if (controlling) {
                if (!states.paused) { return; }
                node.dispatchEvent(eventFactory('$play'));
                states.paused = false;
            } else if (states.paused) {
                native.pause.call(node);
            }
        }, false);

        node.addEventListener('pause', function () {
            if (controlling) {
                if (states.paused) { return; }
                node.dispatchEvent(eventFactory('$ause'));
                states.paused = true;
            }
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
