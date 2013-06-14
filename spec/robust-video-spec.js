/*jslint browser: true, vars: true*/
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

    });

    describe("Play, Pause and Ended", function () {
        var node = new ChaosVideo({loading: true, twiceplay: true});
        var playcount = 0,
            pausecount = 0;
        robustVideo(node);
        node.addEventListener('$play', function () { playcount++; }, false);
        node.addEventListener('$pause', function () { pausecount++; }, false);
        node.play();  //play  1
        node.play();
        node.play();
        node.pause(); //pause 1
        node.pause();
        node.play();  //play  2
        node.pause(); //pause 2
        node.pause();
        node.play();  //play  3
        node.pause(); //pause 3
        waits(200);
        it("Robust $play", function () {
            runs(function () {
                expect(playcount).toBe(3);
            });
        });

        it("Robust $pause", function () {
            runs(function () {
                expect(pausecount).toBe(3);
            });
        });

        it("Robust $ended", function () {
            runs(function () {
                var count = 0;
                node.addEventListener('$ended', function () {
                    count++;
                }, false);
                node.play();
                waits(2000);
                runs(function () {
                    expect(count).toBe(1);
                });
            });
        });
    });

    describe("Loop", function () {
        var node = new ChaosVideo({noloop: true});
        var pausecount = 0,
            endedcount = 0;
        robustVideo(node);
        node.addEventListener('$pause', function () { pausecount++; }, false);
        node.addEventListener('$ended', function () { endedcount++; }, false);
        node.loop = true;
        node.play();
        waits(2000);
        it("Manuel Loop", function () {
            runs(function () {
                expect(node.paused).toBe(false);
            });
        });
        it("Manuel Loop and no $pause event", function () {
            runs(function () {
                expect(pausecount).toBe(0);
            });
        });
        it("Manuel Loop and no $ended event", function () {
            runs(function () {
                expect(endedcount).toBe(0);
                node.pause();
            });
        });
        runs(function () {
            node.loop = false;
            node.play();
        });
        waits(2000);
        it("Toggle loop to false works", function () {
            runs(function () {
                expect(endedcount).toBe(1);
                node.pause();
            });
        });
    });

}(this));
