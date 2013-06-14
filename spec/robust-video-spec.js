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
                node.addEventListener('play', function () { played = true; }, false);
                node.play();
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
                node.addEventListener('pause', function () { paused = true; }, false);
                node.play();
                node.pause();
            });
            waits(100);
            runs(function () {
                expect(paused).toBe(true);
            });
        });

        it("Ended event should trigger", function () {
            var ended = false;
            runs(function () {
                var node = new ChaosVideo();
                node.addEventListener('ended', function () { ended = true; }, false);
                node.play();
            });
            waits(2000);
            runs(function () {
                expect(ended).toBe(true);
            });
        });

    });

    describe("Play and Pause", function () {
        it("Robust $Play", function () {
            var playing = 0;
            runs(function () {
                var node = new ChaosVideo({twiceplay: true});
                robustVideo(node);
                node.addEventListener('$play', function () { playing++; }, false);
                node.play();
                node.play();
                node.play();
            });
            waits(100);
            runs(function () {
                expect(playing).toBe(1);
            });
        });

        it("Robust $Pause", function () {
            var paused = 0;
            runs(function () {
                var node = new ChaosVideo({twiceplay: true});
                robustVideo(node);
                node.addEventListener('$pause', function () { paused++; }, false);
                node.play();
                node.pause();
                node.pause();
            });
            waits(100);
            runs(function () {
                expect(paused).toBe(1);
            });
        });
    });

}(this));
