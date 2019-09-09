'use strict';

var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    focused = false,
    clicked = false;
var shadow = document.createElement('canvas'),
    sctx = shadow.getContext('2d');

var items = [];
var fadeOutItems = [];
var mouse = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    px: 0,
    py: 0
};
var options = {
    scatter: 1,
    gravity: 1,
    consistency: 0,
    pollock: false,
    burst: true,
    shade: false

};
canvas.width = shadow.width = window.innerWidth;
canvas.height = shadow.height = window.innerHeight;
sctx.fillStyle = ctx.fillStyle = '#aa0707'; // rgba(250,0,0,0.1)'

function drawloop() {

    if (focused) {
        requestAnimationFrame(drawloop);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawsplat(items);
}

function splat(x, y, tone, arr) {

    for (var i = 0; i < 30; i++) {
        var s = Math.random() * Math.PI;
        var dirx = (Math.random() < .5 ? 3 : -3) * (Math.random() * 3) * options.scatter;
        var diry = (Math.random() < .5 ? 3 : -3) * (Math.random() * 3) * options.scatter;
        var newCircle = {
            x: x,
            y: y,
            dx: dirx + mouse.dx,
            dy: diry + mouse.dy,
            size: s,
            tone: tone,
            fadeOut: false
        };
        arr.push(newCircle);
    }
}

function fadeOut() {}

function drawFadeOutLopp() {
    if (focused) {
        requestAnimationFrame(drawFadeOutLopp);
    }
    sctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFadeOut(fadeOutItems);
}

function drawFadeOut(arr) {
    var i = arr.length;
    while (i--) {
        var t = arr[i];
        var x = t.x,
            y = t.y,
            s = t.size;
        circle(x, y, s, t.tone, sctx);

        if (t.fadeOut) {
            t.tone.a *= 0.99;
        }

        if (arr[i].tone.a < 0.01) {
            arr.splice(i, 1);
        }
    }
}

function drawsplat(arr) {

    var i = arr.length;
    while (i--) {
        var t = arr[i];
        var x = t.x,
            y = t.y,
            s = t.size;
        circle(x, y, s, t.tone, ctx);

        t.dy -= options.gravity;
        t.x -= t.dx;
        t.y -= t.dy;
        t.size -= 0.05;

        if (arr[i].size < 0.3 || Math.random() < options.consistency) {
            circle(x, y, s, t.tone, sctx);
            fadeOutItems.push(t);
            setInterval(function (t) {
                t.fadeOut = true;
            }.bind(this, t), 3000);
            arr.splice(i, 1);
        }
    }

    ctx.drawImage(shadow, 0, 0);
    //sctx.drawImage(shadow, 0, 0.5)
}

function fadeOut() {
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setTimeout(fadeOut, 100);
}

function circle(x, y, s, tone, c) {

    c.beginPath();
    c.arc(x, y, Math.abs(s) * 5, 0, 2 * Math.PI, false);
    c.fillStyle = rgba(tone);
    c.fill();
    c.closePath();
}

function rgba(opt) {
    return 'rgba(' + opt.r + ',' + opt.g + ',' + opt.b + ',' + opt.a + ')';
}

function randomBetween(start, end) {
    return Math.floor(Math.random() * (end || 1)) + (start || 0);
}
var loopInterval;
function start() {
    if (!focused) {

        focused = true;
        drawloop();
        drawFadeOutLopp();
        loopInterval = setInterval(function () {
            var x = randomBetween(0, canvas.width);
            var y = randomBetween(0, canvas.height);
        var redtone = { r: 130 + (Math.random() * 105 | 0), g: 0, b: 0, a: 0.7 };
        //var redtone = "rgba(190,12,54,1)";

        sctx.fillStyle = ctx.fillStyle = rgba(redtone);
        options.scatter = randomBetween(40, 80) / 100;
        options.gravity = randomBetween(0, 10) / 100;
        options.consistency = randomBetween(1, 2) / 100;
        splat(x, y, redtone, items);
    }, 6000);
    }    
}

function stop() {
    focused = false;
    clearInterval(loopInterval);
}

function getHiddenProp() {
    var prefixes = ['webkit', 'moz', 'ms', 'o'];

    // if 'hidden' is natively supported just return it
    if ('hidden' in document) return 'hidden';

    // otherwise loop over all the known prefixes until we find one
    for (var i = 0; i < prefixes.length; i++) {
        if (prefixes[i] + 'Hidden' in document) return prefixes[i] + 'Hidden';
    }

    // otherwise it's not supported
    return null;
}

window.addEventListener("load", function vidDemo() {
    sessionStorage.initialPlay = false;

    var visProp = getHiddenProp();

    var evtName = visProp.replace(/[H|h]idden/, '') + 'visibilitychange';
    document.addEventListener(evtName, showHide);

    function showHide() {
        if (document[visProp]) {
            stop();
        } else {
            start();
        }
    }
});

start();