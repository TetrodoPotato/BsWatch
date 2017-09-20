// ==UserScript==
// @name        BsWatch - File 8
// @icon 		https://bs.to/opengraph.jpg
// @namespace   http://www.greasespot.net/
// @include     *oloadcdn.net*
// @include     /^https:\/\/delivery\-\-.+$/
// @version    	1.9
// @description	Media-Player
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/iconcontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/cookiecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/sessvars.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/init.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch8.user.js
// ==/UserScript==

makeBlackPage();

//When document loaded
$(document).ready(function () {
	//Scroll to top ... reasons
	$(this).scrollTop(0);

	//Clear body
	document.body.innerHTML = '';
	document.head.innerHTML = makeVidHead().innerHTML;
	constructPlayer(window.location.href);

	onerror();

	//Delete blackP stylesheeds loaded ... because the stylesheed needs to be loaded
	$(window).bind("load", function () {
		removeBlackPage();
		intervalCheck();
		checkInterval = setInterval(intervalCheck, 1000);
		var video = document.getElementById('vid').play();
	});

});

var checkInterval;
var isChecked = false;
function intervalCheck() {
	var vid = document.getElementById('vid');

	if (!isChecked) {
		if (!isNaN(vid.duration)) {
			var isError = getCookie('isError');
			if (isError) {
				var lastTime = getCookie('lastTime');
				var lastVid = getCookie('lastVid');
				var thisVid = window.location.href;

				if (lastVid != null && lastTime != null) {
					if (lastVid == thisVid) {
						vid.currentTime = lastTime;
					}
				}
			}

			var lastVolume = getCookie('lastVolume');
			if (lastVolume != null) {
				vid.volume = lastVolume;
			}

			var lastDark = getCookie('lastDark');
			if (lastDark != null) {
				updateDark(lastDark * 100);
			}

			var lastSpeed = getCookie('lastSpeed');
			if (lastSpeed != null) {
				vid.playbackRate = lastSpeed;
			}

			setCookie('isError', true, false);
			setCookie('lastVid', window.location.href, false);
			isChecked = true;
			showAllEvent();
		}
	} else {
		setCookie('lastTime', vid.currentTime, false);
		setCookie('lastVolume', vid.volume, true);
		setCookie('lastSpeed', vid.playbackRate, true);
		var darkOpa = document.getElementById('clicklayer');

		if (!isNaN(darkOpa.style.opacity)) {
			var nextDarkVal = (parseFloat(darkOpa.style.opacity)).toFixed(2);
			setCookie('lastDark', nextDarkVal, true);
		}

	}

}

var control = '<div id="video-controls" class="hide" data-state="hidden">' +
	'	<table>' +
	'		<tbody>' +
	'			<tr id="bars">' +
	'				<td colspan="9">' +
	'					<canvas id="buffer" width="0" height="5"></canvas>' +
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
	'				<td id="plus">+</td>' +
	'				<td id="speed"></td>' +
	'				<td id="minus">-</td>' +
	'				<td id="close"></td>' +
	'			</tr>' +
	'		</tbody>' +
	'	</table>' +
	'</div>';

var checkTime;

var isSpeed = false;
var speedTick = 1;

var plusTick = function (e) {
	if (isSpeed) {
		var nextVal = document.getElementById('vid').playbackRate + 0.01;
		if (nextVal > 4) {
			nextVal = 4;
		}

		nextVal = parseFloat(Math.round(nextVal * 100) / 100);

		document.getElementById('vid').playbackRate = nextVal;

		var nextSpeed = speedTick * 100;
		if (nextSpeed > 900) {
			nextSpeed = 950;
		}

		speedTick++;

		setTimeout(plusTick, 1000 - nextSpeed);
	}
};

var minusTick = function (e) {
	if (isSpeed) {
		var nextVal = document.getElementById('vid').playbackRate - 0.01;
		if (nextVal < 0.5) {
			nextVal = 0.5;

		}

		nextVal = parseFloat(Math.round(nextVal * 100) / 100);

		document.getElementById('vid').playbackRate = nextVal;

		var nextSpeed = speedTick * 100;
		if (nextSpeed > 900) {
			nextSpeed = 950;
		}

		speedTick++;

		setTimeout(minusTick, 1000 - nextSpeed);
	}
};

function setTopText() {
	var sessvarmax = typeof sessvars.max !== "undefined" ? sessvars.max : "1/1";
	var sessvarsea = typeof sessvars.sea !== "undefined" ? sessvars.sea : "Season 1";
	var sessvarser = typeof sessvars.ser !== "undefined" ? sessvars.ser : "Series";
	var sessvartit = typeof sessvars.tit !== "undefined" ? sessvars.tit : "Episde 1";

	var maxInfo = '<span id="max">' + sessvarmax + '</span>';
	var seaInfo = '<span id="sea">' + sessvarsea + '</span>';
	var serInfo = '<span id="ser">' + sessvarser + '</span>';
	var titInfo = '<span id="tit">' + sessvartit + '</span>';

	var topL = '<div id="topinfo">' + maxInfo + serInfo + seaInfo + titInfo + '</div>'

		var topLayer = '<div id="topLayer"><progress id="darkPlane" value="0" min="0" max="100"></progress>' +
		'<span id="showPerc">0%</span></div>';

	var retLay = '<div id="infoPanel" class="hide">' + topL + topLayer + '</div>';

	return retLay;
}

function constructPlayer(mediaFile) {
	var container = document.createElement('div');
	container.setAttribute('id', 'mediaplayer');

	var showCurrTime = '<div id="curProc">00:00</div>';

	var topLayer = setTopText();
	var clickPause = '<div id="clicklayer" class="hide"></div>';

	var addit = '<video id="vid" preload="auto" src="' + mediaFile + '">Scheise Gelaufen</video>';

	var infoText = '<span id="infotext"><span>';

	container.innerHTML = showCurrTime + clickPause + topLayer + addit + control + infoText;

	document.body.innerHTML = '';
	document.body.appendChild(container);

	document.getElementById('vid').addEventListener('ended', myHandler, false);
	function myHandler(e) {
		closeVideo();
	}

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

		$('body').bind('mouseup', function (e) {
			$('body').unbind();
		});
	});

	$('#plus').bind('mousedown', function (e) {
		isSpeed = true;
		plusTick();

		$('body').bind('mouseup', function (e) {
			$('body').unbind();
			isSpeed = false;
			speedTick = 1;
		});
	});

	$('#minus').bind('mousedown', function (e) {
		isSpeed = true;
		minusTick();

		$('body').bind('mouseup', function (e) {
			$('body').unbind();
			isSpeed = false;
			speedTick = 1;
		});
	});

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
	document.getElementById('close').innerHTML = getClose().outerHTML;
	document.getElementById('mute').innerHTML = getSound(3).outerHTML;

	checkTime = setInterval(updateProcessbar, 100);

	document.getElementById('vid').defaultPlaybackRate = 1.0;
	document.getElementById('vid').playbackRate = 1.0;

	$('#infoPanel').bind('mouseover', function (e) {
		activateControll(false)
	});
	$('#video-controls').bind('mouseover', function (e) {
		activateControll(false)
	});

	$('#infoPanel').bind('mouseout', function (e) {
		activateControll(true);
	});
	$('#video-controls').bind('mouseout', function (e) {
		activateControll(true);
	});
}

var timer = 0;
function onerror() {
	document.getElementsByTagName('video')[0].addEventListener('error', failed, true);
	timer++;
}

function failed(e) {
	// video playback failed - show a message saying why
	switch (e.target.error.code) {
	case e.target.error.MEDIA_ERR_ABORTED:
		console.log('You aborted the video playback.');
		break;
	case e.target.error.MEDIA_ERR_NETWORK:
		console.log('A network error caused the video download to fail part-way.');
		break;
	case e.target.error.MEDIA_ERR_DECODE:
		console.log('The video playback was aborted due to a corruption problem or because the video used features your browser did not support.');
		break;
	case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
		console.log('The video could not be loaded, either because the server or network failed or because the format is not supported.');
		break;
	default:
		console.log('An unknown error occurred.');
		break;
	}

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

function setInfoText(infoText) {
	document.getElementById('infotext').innerHTML = infoText;
	$('#infotext').attr('class', 'showText');
	setTimeout(function () {
		$('#infotext').attr('class', 'hideText');
	}, 1000);

}

function updateDark(val) {
	var elemDark = document.getElementById('clicklayer');
	elemDark.style.opacity = val / 100;

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

}

function playpause() {
	var video = document.getElementById('vid');
	if (video.paused || video.ended) {
		video.play();
	} else {
		video.pause();
	}

	showAllEvent();
}

var curPlay = null;
var curTime = null;
function updateProcessbar() {
	var duration = document.getElementById('vid').duration;
	if (!isNaN(duration)) {
		var curTime = document.getElementById('vid').currentTime;
		document.getElementById('progress').setAttribute('max', duration);
		document.getElementById('progress').setAttribute('value', curTime);

		//////////////////

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

		/////////////////


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

	if (lastVol != video.volume) {

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
		lastVol = video.volume;
	}

	var innerTopLayer = (document.getElementById('vid').playbackRate * 100).toFixed(0) + '%';
	document.getElementById('speed').innerHTML = innerTopLayer;

	var darkProcess = document.getElementById('darkPlane');
	var darkOpa = document.getElementById('clicklayer');

	if (!isNaN(darkOpa.style.opacity)) {
		if (isFloat(parseFloat(darkOpa.style.opacity))) {
			darkProcess.value = parseFloat(darkOpa.style.opacity) * 100;
			document.getElementById('showPerc').innerHTML = (parseFloat(darkOpa.style.opacity) * 100).toFixed(0) + '%';
		}
	}
}

function isFloat(n) {
	return Number(n) === n;
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
	setCookie('isError', false, false);
	var nextLink = 'https://bs.to/?next'
		if (autoP !== null) {
			nextLink += '?' + autoP;
		}

		window.location = nextLink;
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

//Unknown AutoplayState
var autoP = null;
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
		} else if (e.keyCode === 107 || e.keyCode === 171) { //+
			e.preventDefault();
			var nextVal = document.getElementById('vid').playbackRate + 0.01;
			if (nextVal > 4) {
				nextVal = 4;
			}

			nextVal = parseFloat(Math.round(nextVal * 100) / 100);

			document.getElementById('vid').playbackRate = nextVal;

		} else if (e.keyCode === 109 || e.keyCode === 173) { // -
			e.preventDefault();

			var nextVal = document.getElementById('vid').playbackRate - 0.01;
			if (nextVal < 0.5) {
				nextVal = 0.5;

			}

			nextVal = parseFloat(Math.round(nextVal * 100) / 100);

			document.getElementById('vid').playbackRate = nextVal;
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
		} else if (e.keyCode === 65) { //A
			e.preventDefault();

			if (autoP === null) {
				autoP = true;
			}

			autoP = !autoP;

			if (autoP) {
				setInfoText('Autoplay On');
			} else {
				setInfoText('Autoplay Off');
			}
		}

		showAllEvent();

	}
});
