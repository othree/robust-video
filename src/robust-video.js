
(function (root) {
    "use strict";

    root.RobustVideo = function (node) {
        if (node.getAttribute('data-robust') === 'yes') {
            return node;
        }

        node.setAttribute('data-robust', 'yes');
        return node;
    };

    root.robustVideo = root.RobustVideo;

}(this));
