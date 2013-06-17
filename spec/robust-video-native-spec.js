/*jslint browser: true, vars: true*/
/*global describe: false, it: false, expect: false, runs: false, waits: false, waitsFor: false*/
/*global RobustVideo: false, robustVideo: false*/
/*global ChaosVideo: false*/
(function (root) {
    "use strict";

    describe("Native: Play, Pause and Ended", function () {
        var node = new ChaosVideo({loading: true, twiceplay: true});
        var playcount = 0,
            pausecount = 0;
        robustVideo(node, {native: true});
        node.addEventListener('play', function () { playcount++; }, false);
        node.addEventListener('pause', function () { pausecount++; }, false);
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
        it("Robust play", function () {
            runs(function () {
                expect(playcount).toBe(3);
            });
        });

        it("Robust pause", function () {
            runs(function () {
                expect(pausecount).toBe(3);
            });
        });

        it("Robust ended", function () {
            var count = 0;
            runs(function () {
                node.addEventListener('ended', function () { count++; }, false);
                node.currentTime = 0;
                node.play();
            });
            waits(2000);
            runs(function () {
                expect(count).toBe(1);
            });
        });
    });

    describe("Native: Controller Play, Pause", function () {
        var node = new ChaosVideo({loading: true, twiceplay: true});
        var playcount = 0,
            pausecount = 0;
        robustVideo(node, {native: true});
        node.addEventListener('play', function () { playcount++; }, false);
        node.addEventListener('pause', function () { pausecount++; }, false);
        node.controllerplay();  //play  1
        node.controllerplay();
        node.controllerplay();
        node.controllerpause(); //pause 1
        node.controllerpause();
        node.controllerplay();  //play  2
        node.controllerpause(); //pause 2
        node.controllerpause();
        node.controllerplay();  //play  3
        node.controllerpause(); //pause 3
        waits(200);
        it("Robust play from controller", function () {
            runs(function () {
                expect(playcount).toBe(3);
            });
        });

        it("Robust pause from controller", function () {
            runs(function () {
                expect(pausecount).toBe(3);
            });
        });
    });

    describe("Native: Unstoppable Video", function () {
        var node = new ChaosVideo({loading: true, unstoppable: true});
        var pausecount = 0;
        robustVideo(node, {native: true});
        node.addEventListener('pause', function () { pausecount++; }, false);
        runs(function () {
            node.play();
        });
        waits(10);
        runs(function () {
            node.pause();
        });
        waits(200);
        it("Hold unstoppable video", function () {
            runs(function () {
                expect(node.paused).toBe(true);
            });
        });

        it("No too many pause event", function () {
            runs(function () {
                expect(pausecount).toBe(1);
            });
        });
    });

    describe("Native: Loop", function () {
        var node = new ChaosVideo({noloop: true});
        var pausecount = 0,
            endedcount = 0;
        robustVideo(node, {native: true});
        node.addEventListener('pause', function () { pausecount++; }, false);
        node.addEventListener('ended', function () { endedcount++; }, false);
        node.loop = true;
        node.play();
        waits(2000);
        it("Manuel Loop", function () {
            runs(function () {
                expect(node.paused).toBe(false);
            });
        });
        it("Manuel Loop and no pause event", function () {
            runs(function () {
                expect(pausecount).toBe(0);
            });
        });
        it("Manuel Loop and no ended event", function () {
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

    describe("Native: Playing", function () {
        var node = new ChaosVideo({loading: true});
        var count = 0;
        robustVideo(node, {native: true});
        node.addEventListener('playing', function () { count++; }, false);
        it("No Immediate Playing", function () {
            runs(function () {
                node.play();
                expect(count).toBe(0);
            });
        });
        waits(200);
        it("Trigger playing", function () {
            runs(function () {
                expect(count).toBe(1);
                node.pause();
            });
        });
        it("No Immediate Playing at 2nd time", function () {
            runs(function () {
                node.play();
                expect(count).toBe(1);
            });
        });
        waits(200);
        it("Trigger playing at 2nd time", function () {
            runs(function () {
                expect(count).toBe(2);
                node.pause();
            });
        });
    });

    describe("Native: Robust durationchange case 1", function () {
        var node = new ChaosVideo({loading: true, duration1: true});
        var count = 0;
        var is1 = 0;
        robustVideo(node, {native: true});
        node.addEventListener('durationchange', function () {
            count++;
            if (node.duration === 1) {
                is1 = 1;
            }
        }, false);
        runs(function () {
            node.play();
        });
        waits(100);
        it("Trigger durationchange one time", function () {
            runs(function () {
                expect(count).toBe(1);
            });
        });
        it("duration never be 1", function () {
            runs(function () {
                expect(is1).toBe(0);
            });
        });
    });
    describe("Robust durationchange case infinity", function () {
        var node = new ChaosVideo({loading: 1, durationinfinity: true});
        var count = 0;
        var isInfinity = 0;
        robustVideo(node, {native: true});
        node.addEventListener('durationchange', function () {
            count++;
            if (!isFinite(node.duration)) {
                isInfinity = 1;
            }
        }, false);
        runs(function () {
            node.play();
        });
        waits(100);
        it("Trigger durationchange one time", function () {
            runs(function () {
                expect(count).toBe(1);
            });
        });
        it("duration never be Infinity", function () {
            runs(function () {
                expect(isInfinity).toBe(0);
            });
        });
    });

}(this));
