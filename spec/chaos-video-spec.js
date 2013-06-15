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
                expect(played).toBe(true);
                expect(node.paused).toBe(false);
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
                expect(played).toBe(2);
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
                expect(ended).toBe(0);
                expect(node.paused).toBe(false);
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
                expect(ended).toBe(1);
                expect(node.paused).toBe(true);
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
                expect(count).toBe(0);
            });
            waits(200);
            runs(function () {
                expect(count).toBe(1);
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
                expect(count).toBe(1);
            });
            waits(200);
            runs(function () {
                node.pause();
            });
        });

        it("Controller", function () {
            var playcount = 0,
                pausecount = 0,
                endedcount = 0;
            var node = new ChaosVideo({});
            runs(function () {
                node.addEventListener('play', function () { playcount++; }, false);
                node.addEventListener('pause', function () { pausecount++; }, false);
                node.addEventListener('ended', function () { endedcount++; }, false);
                node.controllerplay();
                node.controllerpause();
            });
            // All event were triggered by timeout, so require a little delay.
            waits(10);
            runs(function () {
                expect(playcount).toBe(1);
                expect(pausecount).toBe(1);
                node.controllerplay();
            });
            waits(2000);
            runs(function () {
                expect(endedcount).toBe(1);
            });
        });
    });

}());
