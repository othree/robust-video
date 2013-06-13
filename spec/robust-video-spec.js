/*jslint browser: true*/
/*global describe: false, it: false, expect: false, runs: false, waits: false, waitsFor: false*/
/*global RobustVideo: false, robustVideo: false*/
/*global ChaosVideo: false*/
(function (root) {
    "use strict";

    describe("Init", function () {
        it("Set data-robust to avoid double binding", function () {
            var node = document.createElement('video');
            robustVideo(node);
            expect(node.getAttribute('data-robust')).toBe('yes');
        });

        it("Play event should trigger", function () {
            var played = false;
            runs(function () {
                var node = new ChaosVideo();
                node.play();
                node.addEventListener('play', function () { played = true; }, false);
            });
            waits(100);
            runs(function () {
                expect(played).toBe(true);
            });
        });

        it("Pause event should trigger", function () {
            var paused = false;
            runs(function () {
                var node = new ChaosVideo();
                node.pause();
                node.addEventListener('pause', function () { paused = true; }, false);
            });
            waits(100);
            runs(function () {
                expect(paused).toBe(true);
            });
        });
    });

}(this));
