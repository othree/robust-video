/*jslint browser: true, vars: true*/
/*global describe: false, it: false, expect: false, runs: false, waits: false, waitsFor: false*/
/*global RobustVideo: false, robustVideo: false*/
/*global ChaosVideo: false*/
(function (root) {
    "use strict";

    describe("Chaos Video", function () {
        it("Play", function () {
            var played = false;
            var node = new ChaosVideo();
            runs(function () {
                node.addEventListener('play', function () { played = true; }, false);
                node.play();
            });
            waits(100);
            runs(function () {
                expect(played && !node.paused).toBe(true);
                node.pause();
            });
        });

        it("Twice Play Event", function () {
            var played = 0;
            var node = new ChaosVideo({loading: true, twiceplay: true});
            runs(function () {
                node.addEventListener('play', function () { played++; }, false);
                node.play();
            });
            waits(200);
            runs(function () {
                expect(played === 2).toBe(true);
                node.pause();
            });
        });

        it("Loop Support", function () {
            var ended = 0;
            var node = new ChaosVideo({noloop: false});
            node.loop = true;
            runs(function () {
                node.addEventListener('ended', function () { ended++; }, false);
                node.play();
            });
            waits(2000);
            runs(function () {
                expect(ended === 0 && !node.paused).toBe(true);
                node.pause();
            });
        });

        it("Noloop Support", function () {
            var ended = 0;
            var node = new ChaosVideo({noloop: true});
            runs(function () {
                node.addEventListener('ended', function () { ended++; }, false);
                node.play();
            });
            waits(2000);
            runs(function () {
                expect(ended === 1 && node.paused).toBe(true);
                node.pause();
            });
        });

        it("Unstoppable Video", function () {
            var ended = 0;
            var node = new ChaosVideo({loading: true, unstoppable: true});
            runs(function () {
                node.play();
                node.pause();
            });
            waits(200);
            runs(function () {
                expect(node.paused).toBe(false);
                node.pause();
            });
        });

        it("Correct Playing Event", function () {
            var count = 0;
            var node = new ChaosVideo({loading: true});
            runs(function () {
                node.addEventListener('playing', function () { count++; }, false);
                node.play();
                expect(count === 0).toBe(true);
            });
            waits(200);
            runs(function () {
                expect(count === 1).toBe(true);
                node.pause();
            });
        });

        it("Immediate Playing Event", function () {
            var count = 0;
            var node = new ChaosVideo({loading: true, immeplaying: true});
            runs(function () {
                node.addEventListener('playing', function () { count++; }, false);
                node.play();
            });
            // All event were triggered by timeout, so require a little delay.
            waits(10);
            runs(function () {
                expect(count === 1).toBe(true);
            });
            waits(200);
            runs(function () {
                node.pause();
            });
        });
    });

}());
