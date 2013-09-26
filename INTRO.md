HTML5 Video Issues
==================

HTML5 video have differences on different implementation.


Loop not support on some platform
---------------------------------

Most mobile browser don't support loop attribute.
But you can call `play()` on `ended` event.

    ended > paused         
    |       |             
    +-------+-------+--------------------->
            |       |
            paused  ended


`play`, `pause` event is possible to trigger twice on some browsers
------------------------------------------------------------------

You could call `play()` many times even if the video is playing.
But `play` event should only trigger once.
Some borwser will trgger `play` event everytime you call `play()`

Use custom `$play`, `$pause` event instead or stopImmediatePropagation().

`play` event will trigger again when buffer ready
-------------------------------------------------

SPEC:

    play()
    |
    loadstart           canplay,playstart
    |                   |
    +-------------------+----------------->
    |                   |
    play                playing 

REAL WORLD:

    play()
    |
    loadstart           canplay,playstart
    |                   |
    +-------------------+----------------->
    |                   |
    play                play


Use custom `$play` event instead or stopImmediatePropagation().


Won't stop play when buffer ready even if pause() were called
----------------------------------------------------------------

EXPECT

    play()     pause()
    |          | 
    loadstart  |          canplay
    |          |          |
    +----------+----------+----------------->
    |          |          
    play       pause           

REAL WORLD

    play()     pause()
    |          |
    loadstart  videopause  canplay,playstart
    |          |           |
    +----------+-----------+----------------->
    |          |           |
    play       pause       play     

Memorize play state. If video is paused, call stop() when `play`


'playing' event not always trigger when video start plays
---------------------------------------------------------

Chrome only trigger first time starts. Firefox works fine.

Use `timeupdate` to create custom `$playing` event.


Video duration is incorrect at first
------------------------------------

Should be NaN by default, but:
* Android 2 Internet is 1
* Chrome will become 100 in a very short time

RobustVideo
-----------

Try to wrap video and fix the issue described.
Please see README to use it.


One More Issue
--------------

iPhone, iPod iOS6: video won't be able to play if you close player before it start plays first time.

    play()     Touch Close
    |          |
    loadstart  |           canplay
    |          |           |
    +----------+-----------+----------------->
    |       
    play   

Create a new video to replace the old one.
This fix not in RobustVideo.

This issue might caused by HTTP/1.0 response.
Video served by HTTP/1.0 will not be cached on any browser.
Because only HTTP/1.1 have partial download.
CloudFront serve HTTP/1.0 for a long time...

Resources
---------

* [HTML5 Video Events and API](http://www.w3.org/2010/05/video/mediaevents.html)
* [The State Of HTML5 Video](http://www.longtailvideo.com/html5/)
