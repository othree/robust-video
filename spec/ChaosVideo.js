/*jslint browser: true, vars: true*/
(function (root) {
    "use strict";

    var nativeEvent = function (type, arg1, arg2) {
        var event = document.createEvent('HTMLEvents');
        event.initEvent(type, arg1, arg2);
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

    root.ChaosVideo = function () {
        var div = document.createElement('div');

        div.play = asyncNativeEvent('play');
        div.pause = asyncNativeEvent('pause');

        return div;
    };

}(this));
