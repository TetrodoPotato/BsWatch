// ==UserScript==
// @name        BsWatch - File 8
// @icon 		https://bs.to/opengraph.jpg
// @namespace   http://www.greasespot.net/
// @include     *oloadcdn.net*
// @include     /^https:\/\/delivery\-\-.+$/
// @include		/^https:\/\/bs.to(\/)data(\?[\S]*)?$/
// @version    	2.4
// @description	Media-Player
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @grant		GM_setValue
// @grant		GM_getValue
// @grant 		GM.setValue
// @grant 		GM.getValue
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/iconcontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/cookiecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/init.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch8.user.js
// ==/UserScript==

/**
 * Initialise The Cunstruction Of Mediaplayer
 */
function startInit() {
    makeBlackPage();

    //Replace Of Sessvars
    if (location.hostname === 'bs.to') {
        setGmVariables();
    } else {
        //When document loaded
        $(document).ready(function () {
            //Scroll to top ... reasons
            $(this).scrollTop(0);

            beforeConstruction();

            //Apply New Body and Head
            var bodyContent = constructMediaplayer();
            document.body = bodyContent;
            document.head.innerHTML = makeVidHead().innerHTML;

            afterConstruct();

            //Delete blackP stylesheeds loaded ... because the stylesheed needs to be loaded
            $(window).bind("load", function () {
                removeBlackPage();
                afterLoad();
            });
        });
    }
}
startInit();

/**
 * Do Stuff before reconstruct player
 */
function beforeConstruction() {
    //Stop old Video : Parallel Fix
    var stopFrame = document.getElementsByTagName("video");
    if (stopFrame.lenght != 0) {
        stopFrame[0].pause();
    }
}

/**
 * Return Body of cunstructed
 * @return {DOM} BodyTag
 */
function constructMediaplayer() {
    var showCurrTime = document.createElement('div');
    showCurrTime.setAttribute('id', 'curProc');
    showCurrTime.innerHTML = '00:00';

    var clickPause = document.createElement('div');
    clickPause.setAttribute('id', 'clicklayer');
    clickPause.setAttribute('class', 'hide');

    var videoElement = document.createElement('video');
    videoElement.setAttribute('id', 'vid');
    videoElement.setAttribute('preload', 'auto');
    videoElement.setAttribute('src', window.location.href);
    videoElement.innerHTML = 'Das Video Kann In Deinem Browser Nicht Abgespielt Werden!';

    var infoText = document.createElement('span');
    infoText.setAttribute('id', 'infotext');

    var container = document.createElement('div');
    container.setAttribute('id', 'mediaplayer');
    container.appendChild(showCurrTime);
    container.appendChild(clickPause);
    container.appendChild(setTopText());
    container.appendChild(videoElement);
    container.appendChild(getControllPanel());
    container.appendChild(infoText);

    var bodyElement = document.createElement('body');
    bodyElement.appendChild(container);

    return bodyElement;
}

/**
 * Do Stuff After things Applied buf before Everything loaded;
 */
function afterConstruct() {
    onerror();
    addInterfaceEventhandler();
    addVideoEventhandler();

    //Async need to be startet after everythin added.
    fillTopText();
}

/**
 * Do Stuff after Everything was loaded
 */
function afterLoad() {
    document.getElementsByTagName('video')[0].play();
    showAllEvent();
}

/**
 * Make a Head-Tag for the Mediaplayer
 * @return {DOM} head-tag
 */
function makeVidHead() {
    var head = document.createElement('head');
    var title = document.createElement('title');
    title.innerHTML = 'BsWatch Video';

    head.appendChild(title);

    //Add styleSheet in head
    var styles = "@import url('" + cssVidLink + "');";
    var styleNode = document.createElement('link');
    styleNode.rel = 'stylesheet';
    styleNode.href = 'data:text/css,' + escape(styles);
    head.appendChild(styleNode);

    return head;
}

var timer = 0;
/**
 * Set an errorhandler for the VideoElement
 */
function onerror() {
    document.getElementsByTagName('video')[0].addEventListener('error', failed, true);
    timer++;
}

/**
 * Videoerrorhandler for the Video
 * @param e {Event} - event
 */
function failed(e) {
    window.setTimeout(function () {
        var vidDOM = document.getElementsByTagName("video")[0];
        if (timer > 3) {
            var canErr = getCookie("isError");
            if (canErr == true) {
                setCookie("isError", false);
                window.location = 'https://bs.to/?error';
                return;
            } else {
                setCookie("isError", true);
                location.reload();
                return;
            }

        } else if (vidDOM.paused || vidDOM.ended) {
            vidDOM.setAttribute("autoplay", "");

            document.getElementById("vid").load();
            onerror();
        }
    }, 5000);
}

/**
 * Get the Controllpanel
 * @return {DOM} get the Controllpanel
 */
function getControllPanel() {
    var panel = document.createElement('div');
    panel.setAttribute('id', 'video-controls');
    panel.setAttribute('class', 'hide');

    var table = document.createElement('table');
    var tbody = document.createElement('tbody');

    var bars = document.createElement('tr');
    bars.setAttribute('id', 'bars');

    var td1 = document.createElement('td');
    td1.setAttribute('colspan', '10');

    var canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'buffer');
    canvas.setAttribute('width', '0');
    canvas.setAttribute('height', '5');
    td1.appendChild(canvas);

    var processTime = document.createElement('progress');
    processTime.setAttribute('id', 'progress');
    processTime.setAttribute('value', '0');
    processTime.setAttribute('min', '0');
    processTime.setAttribute('max', '0');
    td1.appendChild(processTime);

    bars.appendChild(td1);
    tbody.appendChild(bars);

    var playcontrols = document.createElement('tr');
    playcontrols.setAttribute('id', 'playcontrols');

    playcontrols.appendChild(getControlPanelItem('playpause', getPlay()));
    playcontrols.appendChild(getControlPanelItem('timeShow', "00:00 / 00:00"));
    playcontrols.appendChild(getControlPanelItem('mute', getSound(3)));

    var volumebar = document.createElement('progress');
    volumebar.setAttribute('tabindex', '-1');
    volumebar.setAttribute('id', 'volume');
    volumebar.setAttribute('value', '50');
    volumebar.setAttribute('min', '0');
    volumebar.setAttribute('max', '100');
    playcontrols.appendChild(getControlPanelItem('volumeCol', volumebar));

    playcontrols.appendChild(getControlPanelItem('', ''));
    playcontrols.appendChild(getControlPanelItem('plus', '+'));
    playcontrols.appendChild(getControlPanelItem('speed', ''));
    playcontrols.appendChild(getControlPanelItem('minus', '-'));
    playcontrols.appendChild(getControlPanelItem('fullscreen', getFullscreen(false)));
    playcontrols.appendChild(getControlPanelItem('close', getClose()));

    tbody.appendChild(playcontrols);
    table.appendChild(tbody);

    panel.appendChild(table);

    return panel;
}

/**
 * Get Simple Td-Tag with Message and Id
 * @param id {String} - id
 * @param message {DOM | String} - innerHTML
 * @return {DOM} TD-tag
 */
function getControlPanelItem(id, message) {
    var td = document.createElement('td');

    if (id !== '') {
        td.setAttribute('id', id);
    }

    if (message.tagName) {
        td.appendChild(message);
    } else if (message !== '') {
        td.innerHTML = message;
    }

    return td
}

/**
 * Get the topbar and Darkpanel-progressbar
 * @return {DOM} get the Topbar
 */
function setTopText() {

    //Div TopPanel
    var returnLayout = document.createElement('div');
    returnLayout.setAttribute('id', 'infoPanel');
    returnLayout.setAttribute('class', 'hide');

    //Title Div
    var topInfo = document.createElement('div');
    topInfo.setAttribute('id', 'topInfo');

    var maxInfo = document.createElement('span');
    maxInfo.setAttribute('id', 'max');
    topInfo.appendChild(maxInfo);

    var seaInfo = document.createElement('span');
    seaInfo.setAttribute('id', 'sea');
    topInfo.appendChild(seaInfo);

    var serInfo = document.createElement('span');
    serInfo.setAttribute('id', 'ser');
    topInfo.appendChild(serInfo);

    var titInfo = document.createElement('span');
    titInfo.setAttribute('id', 'tit');
    topInfo.appendChild(titInfo);

    returnLayout.appendChild(topInfo);

    //Div processpanel
    var darkBarPanel = document.createElement('div');
    darkBarPanel.setAttribute('id', 'topLayer');

    var darkBar = document.createElement('progress');
    darkBar.setAttribute('id', 'darkPlane');
    darkBar.setAttribute('value', '0');
    darkBar.setAttribute('min', '0');
    darkBar.setAttribute('max', '100');
    darkBarPanel.appendChild(darkBar);

    var showPerc = document.createElement('span');
    showPerc.setAttribute('id', 'showPerc');
    showPerc.innerHTML = '0%';
    darkBarPanel.appendChild(showPerc);
    returnLayout.appendChild(darkBarPanel);

    return returnLayout
}

/**
 * Close the Video and get back to the episodes
 */
function closeVideo() {
    setCookie('isError', false, false);
    var nextLink = 'https://bs.to/?next';
    if (typeof window.autoP === 'boolean') {
        nextLink += '?' + window.autoP;
    }

    window.location = nextLink;
}

/**
 * Adds Eventhandler for Interactive Videocontrolls. Async = Faster
 */
async function addInterfaceEventhandler() {
    // Click and Drag without neededto stay at bar
    var handlerDar = function (e) {
        var darElem = document.getElementById('darkPlane');
        var x = e.pageX - offset(darElem).left, // or e.offsetX (less support, though)
        clickedValue = x * darElem.max / darElem.offsetWidth;
        updateDark(clickedValue);
    };
    $('#darkPlane').bind('mousedown', function (e) {
        var x = e.pageX - offset(this).left, // or e.offsetX (less support, though)
        clickedValue = x * this.max / this.offsetWidth;
        updateDark(clickedValue);

        this.focus();

        $('body').bind('mousemove', handlerDar);
        window.isDrag = true;

        $('body').bind('mouseup', function (e) {
            $('body').unbind();
            
            var video = document.getElementById('vid');
            if (!video.paused && !video.ended && !getDefault(window.isHover, false)) {
                activateControll(true);
            }
            window.isDrag = false;
        });
    });

    $('#plus').bind('mousedown', function (e) {
        window.isSpeed = true;
        changeSpeed(1);

        window.isDrag = true;
        
        $('body').bind('mouseup', function (e) {
            $('body').unbind();
            window.isSpeed = false;
            window.speedTick = 0;
            
            var video = document.getElementById('vid');
            if (!video.paused && !video.ended && !getDefault(window.isHover, false)) {
                activateControll(true);
            }
            window.isDrag = false;
        });
    });

    $('#minus').bind('mousedown', function (e) {
        window.isSpeed = true;
        changeSpeed(-1);

        window.isDrag = true;
        
        $('body').bind('mouseup', function (e) {
            $('body').unbind();
            window.isSpeed = false;
            window.speedTick = 0;
            
            var video = document.getElementById('vid');
            if (!video.paused && !video.ended && !getDefault(window.isHover, false)) {
                activateControll(true);
            }
            window.isDrag = false;
        });
    });

    // Click and Drag without neededto stay at bar
    var handlerPro = function (e) {
        var proElem = document.getElementById('progress');
        var x = e.pageX - proElem.offsetLeft, // or e.offsetX (less support, though)
        y = e.pageY - proElem.offsetTop, // or e.offsetY
        clickedValue = x * proElem.max / proElem.offsetWidth;
        updateTime(clickedValue);
        showCur(x, clickedValue);
        document.getElementById('curProc').style.display = "inline";
    };
    $('#bars').bind('mousedown', function (e) {
        var proElem = document.getElementById('progress');
        var x = e.pageX - this.offsetLeft, // or e.offsetX (less support, though)
        y = e.pageY - this.offsetTop, // or e.offsetY
        clickedValue = x * proElem.max / this.offsetWidth;
        updateTime(clickedValue);

        document.getElementById('vid').pause();

        $('body').bind('mousemove', handlerPro);

        window.isDrag = true;
        
        $('body').bind('mouseup', function (e) {
            document.getElementById('vid').play();
            document.getElementById('curProc').style.display = "none";
            $('body').unbind();
            
            var video = document.getElementById('vid');
            if (!video.paused && !video.ended && !getDefault(window.isHover, false)) {
                activateControll(true);
            }
            window.isDrag = false;
        });
    });
    $('#bars').bind("mousemove", function (e) {
        var proElem = document.getElementById('progress');
        var x = e.pageX - this.offsetLeft, // or e.offsetX (less support, though)
        y = e.pageY - this.offsetTop, // or e.offsetY
        clickedValue = x * proElem .max / this.offsetWidth;
        showCur(x, clickedValue);
        document.getElementById('curProc').style.display = "inline";
    });
    $('#bars').bind("mouseleave", function (e) {
        document.getElementById('curProc').style.display = "none";
    });

    // Click and Drag without neededto stay at bar
    var handlerVol = function (e) {
        var volElem = document.getElementById('volume');
        var x = e.pageX - offset(volElem).left, // or e.offsetX (less support, though)
        clickedValue = x * volElem.max / volElem.offsetWidth;
        updateVolume(clickedValue);
    };
    $('#volumeCol').bind('mousedown', function (e) {
        var volumeBar = document.getElementById('volume');
        var x = e.pageX - offset(volumeBar).left, // or e.offsetX (less support, though)
        clickedValue = x * volumeBar.max / volumeBar.offsetWidth;
        updateVolume(clickedValue);

        document.getElementById('volume').focus();

        $('body').bind('mousemove', handlerVol);
        
        window.isDrag = true;

        $('body').bind('mouseup', function (e) {
            $('body').unbind();
            document.getElementById('volume').blur();
            
            var video = document.getElementById('vid');
            if (!video.paused && !video.ended && !getDefault(window.isHover, false)) {
                activateControll(true);
            }
            window.isDrag = false;
        });
    });

    $('#playpause').bind('click', function (e) {
        playpause();
    });
    $('#clicklayer').bind('click', function (e) {
        playpause();
    });
    $('#mute').bind('click', function (e) {
        updateVolume('mute')
    });
    $('#close').bind('click', function (e) {
        closeVideo();
    });
    $('#fullscreen').bind('click', function (e) {
        toggleFullscreen();
    });

    $('#infoPanel').bind('mouseover', function (e) {
        activateControll(false)
        window.isHover = true;
    });
    $('#video-controls').bind('mouseover', function (e) {
        activateControll(false);
        window.isHover = true;
    });

    $('#infoPanel').bind('mouseout', function (e) {
        var video = document.getElementById('vid');
        if (!video.paused && !video.ended && !getDefault(window.isDrag, false)) {
            activateControll(true);
        }
        window.isHover = false;
    });
    $('#video-controls').bind('mouseout', function (e) {
        var video = document.getElementById('vid');
        if (!video.paused && !video.ended && !getDefault(window.isDrag, false)) {
            activateControll(true);
        }
        window.isHover = false;
    });

    var screen_change_events = "webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange";
    $(document).on(screen_change_events, function () {
        if ((window.fullScreen) ||
            (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
            document.getElementById('fullscreen').innerHTML = getFullscreen(true).outerHTML;
        } else {
            document.getElementById('fullscreen').innerHTML = getFullscreen(false).outerHTML;
        }
    });
}

/**
 * GM_setValue with new or old Api
 * @param key {String} - Key
 * @param key {String | Number} - value
 * @return null
 */
async function setGMValue(key, val) {
    if (typeof GM_setValue === "function") {
        GM_setValue(key, val);
    } else {
        let buff = await GM.setValue(key, val);
    }
    return null;
}

/**
 * GM_getValue with new or old Api
 * @param key {String} - Key
 * @param def {String | Number} - default if nothing is found value
 * @return {String | Number} requested Value or defaut.
 */
async function getGMValue(key, def) {
    var returnValue = null;
    if (typeof GM_getValue === "function") {
        returnValue = GM_getValue(key, def);
    } else {
        returnValue = await GM.getValue(key, def);
    }

    return returnValue;
}

/**
 * Set GM-Values for bs/data
 */
async function setGmVariables() {
    var buff = location.search;
    buff = buff.split('?');

    var next = null;

    for (i = 1; i < buff.length; i++) {
        var spl = buff[i].split('=');
        spl[0] = decodeURI(spl[0]);
        spl[1] = decodeURI(spl[1]);

        if (spl[0] == 'next') {
            next = spl[1];
            continue;
        }

        setGMValue(spl[0], spl[1]);
    }
    if (next !== null) {
        window.location = next;
    } else {
        window.history.back();
    }
}

/**
 * Set an infotext for one second displayed
 * @param infoText {String} - Text to Show
 */
function setInfoText(infoText) {
    document.getElementById('infotext').innerHTML = infoText;
    $('#infotext').attr('class', 'showText');
    setTimeout(function () {
        $('#infotext').attr('class', 'hideText');
    }, 1000);
}

/**
 * Set the episode-information async at the topbar.
 */
async function fillTopText() {
    var sessvarmax = await getGMValue('max', '1/1');
    var sessvarsea = await getGMValue('sea', 'Season 1');
    var sessvarser = await getGMValue('ser', 'Series');
    var sessvartit = await getGMValue('tit', 'Episde 1');

    document.getElementById('max').innerHTML = sessvarmax;
    document.getElementById('sea').innerHTML = sessvarsea;
    document.getElementById('ser').innerHTML = sessvarser;
    document.getElementById('tit').innerHTML = sessvartit;
}

/**
 * Updates the darkPlane with a darkshade. Updates number and progressbar.
 * @param val {Numver} - persentage of dimm
 */
function updateDark(val) {
    var elemDark = document.getElementById('clicklayer');
    elemDark.style.opacity = val / 100;

    var darkProcess = document.getElementById('darkPlane');
    darkProcess.value = val;
    document.getElementById('showPerc').innerHTML = val.toFixed(0) + '%';

    setGMValue('lastDark', val);
}

/**
 * Sets all Mediaplayer variables of the Last run.
 */
async function setPlayerStartupValues() {
    var shade = await getGMValue('lastDark', 0);
    updateDark(shade);

    var lastLoc = await getGMValue('lastLocation', '');
    if (lastLoc === window.location.href) {
        var lastTime = await getGMValue('lastTime', 0);
        updateTime(lastTime)
    }
    setGMValue('lastLocation', window.location.href);

    var lastVolume = await getGMValue('lastAudio', 1);
    updateVolume(lastVolume * 100);

    var lastSpeed = await getGMValue('lastSpeed', 1);
    changeSpeed((lastSpeed * 100) - 100);
}

/**
 * Set the video handler.
 */
async function addVideoEventhandler() {
    $('#vid').bind('ended', closeVideo);

    $('#vid').bind('timeupdate', function (e) {
        var vid = document.getElementById('vid');

        var duration = document.getElementById('vid').duration;
        var curTime = document.getElementById('vid').currentTime;

        var playTimeMin = zeroFill(parseInt(('' + (curTime / 60))), 2);
        var playTimeSec = zeroFill(parseInt(('' + (curTime % 60))), 2);

        var durationMin = zeroFill(parseInt(('' + (duration / 60))), 2);
        var durationSec = zeroFill(parseInt(('' + (duration % 60))), 2);

        var inner = durationMin + ":" + durationSec + " / " + playTimeMin + ":" + playTimeSec;
        document.getElementById('timeShow').innerHTML = inner;

        document.getElementById('progress').setAttribute('max', duration);
        document.getElementById('progress').setAttribute('value', curTime);

        setGMValue('lastTime', vid.currentTime);
    });

    $('#vid').bind('volumechange', function () {
        var vid = document.getElementById('vid');
        setGMValue('lastAudio', vid.volume);
    });

    $('#vid').bind('playing', function () {
        document.getElementById('playpause').innerHTML = getPause().outerHTML;
        if (!getDefault(window.isHover, false) && !getDefault(window.isDrag, false)) {
            activateControll(true);
        }
    });

    $('#vid').bind('pause', function () {
        document.getElementById('playpause').innerHTML = getPlay().outerHTML;
        activateControll(false);
    });

    $('#vid').one('play', function () {
        //Cannot be Handled with Events
        updateBuffer();
        setInterval(updateBuffer, 5000);

        //After the Video plays
        $('#vid').bind('ratechange', function () {
            var vid = document.getElementById('vid');

            var innerTopLayer = (vid.playbackRate * 100).toFixed(0) + '%';
            document.getElementById('speed').innerHTML = innerTopLayer;

            setGMValue('lastSpeed', vid.playbackRate);
        });

        setPlayerStartupValues();
    });
}

/**
 * Update the Buffer-Canvas
 */
function updateBuffer() {
    var duration = document.getElementById('vid').duration;

    var vid = document.getElementById('vid');
    var canvas = document.getElementById('buffer');
    canvas.setAttribute('width', duration);
    var ctx = canvas.getContext('2d');

    var b = vid.buffered,
    i = b.length,
    w = canvas.width,
    h = canvas.height,
    vl = vid.duration,
    x1,
    x2;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#888888';
    while (i--) {
        x1 = b.start(i) / vl * w;
        x2 = b.end(i) / vl * w;
        ctx.fillRect(x1, 0, x2 - x1, h);
    }
    ctx.fillStyle = '#fff';

    x1 = vid.currentTime / vl * w;

    ctx.fill();
}

/**
 * Change Current Video Time
 * @param time {Number} - time
 * @param add {boolean} - to add
 */
function updateTime(time, add) {
    var vid = document.getElementById('vid');
    if (add) {
        vid.currentTime = vid.currentTime + time;
    } else {
        vid.currentTime = time;
    }
}

/**
 * Updates the Volume and Volumebar
/ @vol {Number} - volume to add
 */
function updateVolume(vol) {
    var video = document.getElementById('vid');

    if (isNaN(vol)) {
        video.muted = !video.muted;

        if (video.muted == false) {
            if (video.volume == 0) {
                updateVolume(50);
            }
        }
    } else {
        if (vol > 100) {
            vol = 100;
        } else if (vol < 0) {
            vol = 0;
        }

        video.volume = vol / 100;

        if (video.volume == 0) {
            video.muted = true;
        } else {
            video.muted = false;
        }
    }

    if (video.muted) {
        document.getElementById('mute').innerHTML = getSound(0).outerHTML;
    } else if (video.volume == 0) {
        document.getElementById('mute').innerHTML = getSound(0).outerHTML;
    } else if (video.volume < 0.3) {
        document.getElementById('mute').innerHTML = getSound(1).outerHTML;
    } else if (video.volume < 0.6) {
        document.getElementById('mute').innerHTML = getSound(2).outerHTML;
    } else if (video.volume <= 1) {
        document.getElementById('mute').innerHTML = getSound(3).outerHTML;
    }

    document.getElementById('volume').setAttribute('value', video.volume * 100);
}

/**
 * Change the playback speed
 * @param val {Number} - value to add in persent
 * @param isTimeout {boolean}- if the call is from setTimout
 */
function changeSpeed(val, isTimeout) {
    if (isTimeout && !window.isSpeed) {
        return;
    }

    var nextVal = document.getElementById('vid').playbackRate + (val / 100);

    if (nextVal > 4) {
        nextVal = 4;
    } else if (nextVal < 0.5) {
        nextVal = 0.5;
    }

    nextVal = parseFloat(Math.round(nextVal * 100) / 100);

    document.getElementById('vid').playbackRate = nextVal;

    if (typeof window.speedTick === 'undefined') {
        window.speedTick = 0;
    }

    window.speedTick++;

    var nextSpeed = speedTick * 100;
    if (nextSpeed > 900) {
        nextSpeed = 950;
    }

    if (window.isSpeed) {
        setTimeout(changeSpeed, 1000 - nextSpeed, val, true);
    } else {
        window.speedTick = 0;
    }
}

/**
 * Return coordinates relativ from Element
 * @param elem {DOM} - element
 */
function offset(elem) {
    if (!elem)
        elem = this;

    var x = elem.offsetLeft;
    var y = elem.offsetTop;
    while (elem = elem.offsetParent) {
        x += elem.offsetLeft;
        y += elem.offsetTop;
    }

    return {
        left: x,
        top: y
    };
}

/**
 * Update hovered time and position of the selected-time-element
 * @param x {Number} - x-coordinate
 * @param sec {Number} - Seconds to show
 */
function showCur(x, sec) {
    document.getElementById('curProc').style.left = (x - 20) + "px";

    var min = zeroFill(parseInt(('' + (sec / 60))), 2);
    var sec = zeroFill(parseInt(('' + (sec % 60))), 2);

    document.getElementById('curProc').innerHTML = min + ":" + sec;

}

/**
 * Toggled the play-state of the video
 */
function playpause() {
    var video = document.getElementById('vid');
    if (video.paused || video.ended) {
        video.play();
    } else {
        video.pause();
    }

    showAllEvent();
}

/**
 * Fill the start of an number with zeros until width is reached
 * @param number {Number} - original number
 * @param width {Number} - Width after process
 * @return {String} number filled with zeros
 */
function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
}

//Show hide close
var timedelay = 1;
var _delay = setInterval(delayCheck, 500);
window.activated = true;

$('html').on('mousemove', showAllEvent);

/**
 * Interval counts to 3 and set controls invisible
 */
function delayCheck() {
    if (activated) {
        if (timedelay == 6) {
            $('.hide').removeClass('show');
            timedelay = 1;
        }
        timedelay = timedelay + 1;
    }
}

/**
 * Sets the controls invisible machanism
 */
function showAllEvent() {
    $('.hide').addClass('show');
    timedelay = 1;
    clearInterval(_delay);
    _delay = setInterval(delayCheck, 500);
}

/**
 * Turn Invisible machanism on or off
 * @param {boolean} on or off
 */
function activateControll(act) {
    window.activated = act;
}

/**
 * Enter or Exit Fullscreen;
 */
function toggleFullscreen() {
    var fullscreenElement = document.documentElement;

    if ((window.fullScreen) ||
        (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
        exitFullscreen();
    } else {
        enterFullscreen(fullscreenElement);
    }
}

/**
 * Enter Fullscreen from a element
 */
function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
}

/**
 * Exits Fullscrren
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

/**
 * Key Bitches
 */
$(window).keydown(function (e) {
    var player = document.getElementById('vid');
    if (player !== null) {
        if (e.keyCode === 32) { //Space
            e.preventDefault();
            playpause();
        } else if (e.keyCode === 9) { //Tab
            e.preventDefault();
            closeVideo();
        } else if (e.keyCode === 81) { //Q
            e.preventDefault();
            updateVolume('mute')
        } else if (e.keyCode === 37) { //Arr-left
            e.preventDefault();
            updateTime(-5, true);
        } else if (e.keyCode === 39) { //Arr-right
            e.preventDefault();
            updateTime(5, true);
        } else if (e.keyCode === 38) { //Arr-up
            e.preventDefault();
            updateVolume((player.volume * 100) + 10);
        } else if (e.keyCode === 40) { //Arr-down
            e.preventDefault();
            updateVolume((player.volume * 100) - 10);
        } else if (e.keyCode === 107 || e.keyCode === 171) { //+
            e.preventDefault();
            changeSpeed(1);
        } else if (e.keyCode === 109 || e.keyCode === 173) { // -
            e.preventDefault();
            changeSpeed(-1);
        } else if (e.keyCode === 49) {
            e.preventDefault();
            updateDark(0);
        } else if (e.keyCode === 50) {
            e.preventDefault();
            updateDark(10);
        } else if (e.keyCode === 51) {
            e.preventDefault();
            updateDark(20);
        } else if (e.keyCode === 52) {
            e.preventDefault();
            updateDark(30);
        } else if (e.keyCode === 53) {
            e.preventDefault();
            updateDark(40);
        } else if (e.keyCode === 54) {
            e.preventDefault();
            updateDark(50);
        } else if (e.keyCode === 55) {
            e.preventDefault();
            updateDark(60);
        } else if (e.keyCode === 56) {
            e.preventDefault();
            updateDark(70);
        } else if (e.keyCode === 57) {
            e.preventDefault();
            updateDark(80);
        } else if (e.keyCode === 48) {
            e.preventDefault();
            updateDark(90);
        } else if (e.keyCode === 63) {
            e.preventDefault();
            updateDark(100);
        } else if (e.keyCode === 122) { //F11
            e.preventDefault();
            toggleFullscreen();
        } else if (e.keyCode === 65) { //A
            e.preventDefault();

            if (typeof window.autoP === 'undefined') {
                window.autoP = true;
            }

            window.autoP = !window.autoP;

            if (window.autoP) {
                setInfoText('Autoplay On');
            } else {
                setInfoText('Autoplay Off');
            }
        }

        //Every Key
        showAllEvent();
    }
});
