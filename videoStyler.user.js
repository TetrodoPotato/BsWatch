// ==UserScript==
// @name        BsWatch mp4 video styler
// @namespace   http://www.greasespot.net/
// @include     *oloadcdn.net*
// @include     /^https:\/\/delivery\-\-.+$/
// @version    	1
// @description	Style the basic video player
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/defaultcontroll.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/videoStyler.user.js
// ==/UserScript==

//Global vars
var muteLink0 = 'https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/playerImg/unmute0.png';
var muteLink1 = 'https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/playerImg/unmute1.png';
var muteLink2 = 'https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/playerImg/unmute2.png';
var muteLink3 = 'https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/playerImg/unmute3.png';

//Black page over original
var blackP = document.createElement('div');
var blackPStyle = 'width:100%; height:100%; position:fixed; top:0; left:0; background:#000; z-index:99';
blackP.setAttribute('style', blackPStyle);
blackP.setAttribute('id', 'blackP');

//Attach blackPage
document.documentElement.appendChild(blackP);

//disable scrollbars .. for ... reasons
document.documentElement.style.overflow = 'hidden'; // firefox, chrome

//When document loaded
$(document).ready(function () {
	//Scroll to top ... reasons
	$(this).scrollTop(0);

	//Preload
	preload(muteLink0, muteLink1, muteLink2, muteLink3);

	//Clear body
	document.body.innerHTML = '';
	document.head.innerHTML = makeVidHead().innerHTML;
	constructPlayer(window.location.href);

	//Delete blackP stylesheeds loaded ... because the stylesheed needs to be loaded
	$(window).bind("load", function () {
		$('#blackP').remove();
		document.getElementById('vid').play();
	});

});

//Picture preloader
var images = [];
function preload() {
	for (var i = 0; i < arguments.length; i++) {
		images[i] = new Image();
		images[i].src = preload.arguments[i];
	}
}

var control = '<div id="video-controls" class="hide" data-state="hidden">' +
	'	<table>' +
	'		<tbody>' +
	'			<tr id="bars">' +
	'				<td colspan="6">' +
	'					<progress id="buffer" value="0" min="0" max="0"></progress>' +
	'					<progress id="progress" value="0" min="0" max="0"></progress>' +
	'				</td>' +
	'			</tr>' +
	'			<tr id="playcontrols">' +
	'				<td id="playpause"></td>' +
	'				<td id="timeShow">00:00 / 00:00</td>' +
	'				<td id="mute"></td>' +
	'				<td>' +
	'					<progress tabindex="-1" id="volume" value="50" min="0" max="100"></progress>' +
	'				</td>' +
	'				<td></td>' +
	'				<td id="close"></td>' +
	'			</tr>' +
	'		</tbody>' +
	'	</table>' +
	'</div>';

var checkTime;

function constructPlayer(mediaFile) {
	var container = document.createElement('div');
	container.setAttribute('id', 'mediaplayer');

	var showCurrTime = '<div id="curProc">00:00</div>';

	var topLayer = '<div id="topLayer" class="hide">1.0</div>';
	var clickPause = '<div id="clicklayer" class="hide"></div>'

		var addit = '<video id="vid" src="' + mediaFile + '">Scheise Gelaufen</video>';
	container.innerHTML = showCurrTime + clickPause + topLayer + addit + control;

	document.body.innerHTML = '';
	document.body.appendChild(container);

	document.getElementById('vid').addEventListener('ended', myHandler, false);
	function myHandler(e) {
		closeVideo();
	}

	var handlerPro = function (e) {
		var proElem = document.getElementById('progress');
		var x = e.pageX - proElem.offsetLeft, // or e.offsetX (less support, though)
		y = e.pageY - proElem.offsetTop, // or e.offsetY
		clickedValue = x * proElem.max / proElem.offsetWidth;
		updateTime(clickedValue);
		showCur(x, clickedValue);
		document.getElementById('curProc').style.display = "inline";
	};

	$('#progress').bind('mousedown', function (e) {
		var x = e.pageX - this.offsetLeft, // or e.offsetX (less support, though)
		y = e.pageY - this.offsetTop, // or e.offsetY
		clickedValue = x * this.max / this.offsetWidth;
		updateTime(clickedValue);

		document.getElementById('vid').pause();

		$('body').bind('mousemove', handlerPro);

		$('body').bind('mouseup', function (e) {
			document.getElementById('vid').play();
			document.getElementById('curProc').style.display = "none";
			$('body').unbind();
		});
	});

	$('#progress').bind("mousemove", function (e) {
		var x = e.pageX - this.offsetLeft, // or e.offsetX (less support, though)
		y = e.pageY - this.offsetTop, // or e.offsetY
		clickedValue = x * this.max / this.offsetWidth;
		showCur(x, clickedValue);
		document.getElementById('curProc').style.display = "inline";
	});

	$('#progress').bind("mouseleave", function (e) {
		document.getElementById('curProc').style.display = "none";
	});

	var handlerVol = function (e) {
		var volElem = document.getElementById('volume');
		var x = e.pageX - offset(volElem).left, // or e.offsetX (less support, though)
		clickedValue = x * volElem.max / volElem.offsetWidth;
		updateVolume(clickedValue);
	};

	$('#volume').bind('mousedown', function (e) {
		var x = e.pageX - offset(this).left, // or e.offsetX (less support, though)
		clickedValue = x * this.max / this.offsetWidth;
		updateVolume(clickedValue);

		this.focus();

		$('body').bind('mousemove', handlerVol);

		$('body').bind('mouseup', function (e) {
			$('body').unbind();
			document.getElementById('volume').blur();
		});
	});

	$('#playpause').bind('click', function (e) {
		playpause();
	});
	$('#clicklayer').bind('click', function (e) {
		playpause();
	});
	$('#mute').bind('click', function (e) {
		muteVid();
	});
	$('#close').bind('click', function (e) {
		closeVideo();
	});

	document.getElementById('playpause').innerHTML = getPlay().outerHTML;
	document.getElementById('close').innerHTML = getClose.outerHTML;
	document.getElementById('mute').innerHTML = '<img src="' + muteLink3 + '" width="35" height="35" alt="mute" />';

	checkTime = setInterval(updateProcessbar, 100);

	document.getElementById('vid').defaultPlaybackRate = 1.0;
	document.getElementById('vid').playbackRate = 1.0;
}

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

var lastscroll = 0;

function reloadScrollBars() {
	document.documentElement.style.overflow = 'auto'; // firefox, chrome
	document.body.scroll = "yes"; // ie only
	window.scrollTo(0, lastscroll);
}

function unloadScrollBars() {
	lastscroll = document.getElementsByTagName('body')[0].scrollTop;
	window.scrollTo(0, 0);
	document.documentElement.style.overflow = 'hidden'; // firefox, chrome
	document.body.scroll = "no"; // ie only
}

function showCur(x, sec) {
	document.getElementById('curProc').style.left = (x - 20) + "px";

	var min = zeroFill(parseInt(('' + (sec / 60))), 2);
	var sec = zeroFill(parseInt(('' + (sec % 60))), 2);

	document.getElementById('curProc').innerHTML = min + ":" + sec;

}

function muteVid() {
	var video = document.getElementById('vid');

	video.muted = !video.muted;

	if (video.muted == false) {
		if (video.volume == 0) {
			updateVolume(50);
		}
	}

	if (video.muted) {
		document.getElementById('mute').innerHTML = '<img src="' + muteLink0 + '" width="35" height="35" alt="mute" />';
	} else if (video.volume == 0) {
		document.getElementById('mute').innerHTML = '<img src="' + muteLink0 + '" width="35" height="35" alt="mute" />';
	} else if (video.volume < 0.3) {
		document.getElementById('mute').innerHTML = '<img src="' + muteLink1 + '" width="35" height="35" alt="mute" />';
	} else if (video.volume < 0.6) {
		document.getElementById('mute').innerHTML = '<img src="' + muteLink2 + '" width="35" height="35" alt="mute" />';
	} else if (video.volume <= 1) {
		document.getElementById('mute').innerHTML = '<img src="' + muteLink3 + '" width="35" height="35" alt="mute" />';
	}

}

function updateVolume(vol) {
	var video = document.getElementById('vid');

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

	if (video.muted) {
		document.getElementById('mute').innerHTML = '<img src="' + muteLink0 + '" width="35" height="35" alt="mute" />';
	} else if (video.volume == 0) {
		document.getElementById('mute').innerHTML = '<img src="' + muteLink0 + '" width="35" height="35" alt="mute" />';
	} else if (video.volume < 0.3) {
		document.getElementById('mute').innerHTML = '<img src="' + muteLink1 + '" width="35" height="35" alt="mute" />';
	} else if (video.volume < 0.6) {
		document.getElementById('mute').innerHTML = '<img src="' + muteLink2 + '" width="35" height="35" alt="mute" />';
	} else if (video.volume <= 1) {
		document.getElementById('mute').innerHTML = '<img src="' + muteLink3 + '" width="35" height="35" alt="mute" />';
	}

}

function playpause() {
	var video = document.getElementById('vid');
	if (video.paused || video.ended) {
		video.play();
	} else {
		video.pause();
	}
}

var curPlay = null;
var curTime = null;
function updateProcessbar() {
	var duration = document.getElementById('vid').duration;
	if (!isNaN(duration)) {
		var curTime = document.getElementById('vid').currentTime;
		document.getElementById('progress').setAttribute('max', duration);
		document.getElementById('progress').setAttribute('value', curTime);

		//Set the buffer progressbar
		document.getElementById('buffer').setAttribute('max', duration);

		var range = 0;
		var bf = document.getElementById('vid').buffered;

		var buffered = 0;
		for (i = 0; i < bf.length; i++) {
			if (bf.start(i) <= curTime && curTime <= bf.end(i)) {
				buffered = bf.end(i);

				break;
			}
		}

		document.getElementById('buffer').setAttribute('value', buffered);
	} else {
		duration = 0;
	}

	var video = document.getElementById('vid');
	var volume = video.volume * 100;
	document.getElementById('volume').setAttribute('value', volume);
	if (video.paused != curPlay) {
		if (video.paused || video.ended) {
			
			document.getElementById('playpause').innerHTML = getPlay().outerHTML;
			curPlay = video.paused;
			activateControll(false);
		} else {
			document.getElementById('playpause').innerHTML = getPause().outerHTML;
			curPlay = video.paused;
			activateControll(true);
		}
	}

	var playTime = video.currentTime;
	var playTimeMin = zeroFill(parseInt(('' + (playTime / 60))), 2);
	var playTimeSec = zeroFill(parseInt(('' + (playTime % 60))), 2);

	var durationMin = zeroFill(parseInt(('' + (duration / 60))), 2);
	var durationSec = zeroFill(parseInt(('' + (duration % 60))), 2);

	var inner = durationMin + ":" + durationSec + " / " + playTimeMin + ":" + playTimeSec;

	if (curTime != inner) {
		curTime = inner;
		document.getElementById('timeShow').innerHTML = inner;
	}

	//l = f
	//c = t

	if (lastVol != video.volume) {

		if (video.muted) {
			document.getElementById('mute').innerHTML = '<img src="' + muteLink0 + '" width="35" height="35" alt="mute" />';
		} else if (video.volume == 0) {
			document.getElementById('mute').innerHTML = '<img src="' + muteLink0 + '" width="35" height="35" alt="mute" />';
		} else if (video.volume < 0.3) {
			document.getElementById('mute').innerHTML = '<img src="' + muteLink1 + '" width="35" height="35" alt="mute" />';
		} else if (video.volume < 0.6) {
			document.getElementById('mute').innerHTML = '<img src="' + muteLink2 + '" width="35" height="35" alt="mute" />';
		} else if (video.volume <= 1) {
			document.getElementById('mute').innerHTML = '<img src="' + muteLink3 + '" width="35" height="35" alt="mute" />';
		}
		lastVol = video.volume;
	}

	var innerTopLayer = (document.getElementById('vid').playbackRate * 100).toFixed(0) + '%';
	document.getElementById('topLayer').innerHTML = innerTopLayer;

}

var lastVol = 0;

function zeroFill(number, width) {
	width -= number.toString().length;
	if (width > 0) {
		return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
	}
	return number + ""; // always return a string
}

function updateTime(time) {
	document.getElementById('vid').currentTime = time;
}

function closeVideo() {
	window.location = 'https://bs.to/?next';
}

//Show hide close
var timedelay = 1;
var _delay = setInterval(delayCheck, 500);
var activated = true;

$('html').on('mousemove', showAllEvent);

function delayCheck() {
	if (activated) {
		if (timedelay == 6) {
			$('.hide').removeClass('show');
			timedelay = 1;
		}
		timedelay = timedelay + 1;
	}
}

function activateControll(act) {
	activated = act;
}

function showAllEvent() {
	$('.hide').addClass('show');
	timedelay = 1;
	clearInterval(_delay);
	_delay = setInterval(delayCheck, 500);
}

$(window).keydown(function (e) {
	var player = document.getElementById('vid');
	if (player !== null) {
		if (e.keyCode === 32) { //Space
			e.preventDefault();
			playpause();
		} else if (e.keyCode === 27) { //esc
			e.preventDefault();
			closeVideo();
		} else if (e.keyCode === 81) { //Q
			e.preventDefault();
			muteVid();
		} else if (e.keyCode === 37) { //Arr-left
			e.preventDefault();
			player.currentTime = player.currentTime - 10;
		} else if (e.keyCode === 39) { //Arr-right
			e.preventDefault();
			player.currentTime = player.currentTime + 10;
		} else if (e.keyCode === 38) { //Arr-up
			e.preventDefault();
			updateVolume((player.volume * 100) + 10);
		} else if (e.keyCode === 40) { //Arr-down
			e.preventDefault();
			updateVolume((player.volume * 100) - 10);
		} else if (e.keyCode === 107) { //+
			e.preventDefault();
			var nextVal = document.getElementById('vid').playbackRate + 0.01;
			if (nextVal > 4) {
				nextVal = 4;
			}

			nextVal = parseFloat(Math.round(nextVal * 100) / 100);

			document.getElementById('vid').playbackRate = nextVal;

		} else if (e.keyCode === 109) { // -
			e.preventDefault();

			var nextVal = document.getElementById('vid').playbackRate - 0.01;
			if (nextVal < 0.5) {
				nextVal = 0.5;

			}

			nextVal = parseFloat(Math.round(nextVal * 100) / 100);

			document.getElementById('vid').playbackRate = nextVal;
		}

		showAllEvent();

	}
});
