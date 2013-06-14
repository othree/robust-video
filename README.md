robust-video
============

HTML5 video have different behaviors in different browsers. Including major desktop browsers and mobile browsers.
This library is trying to make all platform supports video have very common behavior. And follow standards as much as possible.

Issues Try to Solve
-------------------

* Loop not support
* 'play' event will trigger twice when buffer ready.
* Won't stop play when buffer ready even if pause() were called.
* 'play', 'pause' event is able to trigger twice on some browsers.
* 'playing' event not always trigger when video start plays.
* Video duration is incorrect at first.

License
-------

Copyright (C) 2013 Wei-Ko Kao

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
