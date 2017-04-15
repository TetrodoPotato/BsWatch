// ==UserScript==
// @name        BsWatch hoster to video redirect
// @namespace   http://www.greasespot.net/
// @include     /^https:\/\/bs\.to\/serie\/[^\/]+\/\d+\/[^\/]+\/.+$/
// @version    	1
// @description	Redirect for bs Hoster to the hosterwebsite.
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/cookiecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/favoritecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/menucontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/defaultcontroll.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/bsWatchCon3.user.js
// ==/UserScript==

//Some Global variables
var lastFocus = 1;

//Black page over original
var blackP = document.createElement('div');
var blackPStyle = 'width:100%; height:100%; position:fixed; top:0; left:0; background:#000; z-index:999';
blackP.setAttribute('style', blackPStyle);
blackP.setAttribute('id', 'blackP');

//Attach blackPage
document.documentElement.appendChild(blackP);

//disable scrollbars .. for ... reasons
document.documentElement.style.overflow = 'hidden'; // firefox, chrome

//When document loaded
$(document).ready(function () {
	//Check hostername
	var urlPath = window.location.pathname;

	var nextDirElement = document.getElementsByClassName('hoster-player')[0];
	var nextDirPath = nextDirElement.getAttribute('href');

	//When supportet hoster
	if (urlPath.split('/')[5] == 'Vivo' ||
		urlPath.split('/')[5] == 'OpenLoad' ||
		urlPath.split('/')[5] == 'OpenLoadHD') {

		//Open the hoster
		window.location = nextDirPath;
	} else {
		//Fuck everything and make the leaf.

		//Get all available hoster
		var hosterTabs = document.getElementsByClassName('hoster-tabs');
		var hoster = [];
		for (i = 0; i < hosterTabs.length; i++) {
			var hosterLinks = hosterTabs[i].getElementsByTagName('a');

			//Get the raw hostername
			for (a = 0; a < hosterLinks.length; a++) {
				var crypHoster = hosterLinks[a].getAttribute('href');
				var encrypHoster = crypHoster.split("/")[4];

				//Write hoster in next hoster-array position
				hoster[hoster.length] = encrypHoster;
			}
		}

		//Make a hoster page
		makePage(hoster, nextDirPath);
		updateFavorites();
		

		//Delete blackP stylesheeds loaded ... because the stylesheed needs to be loaded
		$(window).bind("load", function () {
			$('#blackP').remove();

			//Activate scrollbars
			document.documentElement.style.overflow = 'auto'; // firefox, chrome

		});
	}

});

function openInNewTab(url) {
	var win = window.open(url, '_blank');
}

function makePage(hoster, bsout) {
	var lastSeries = getCookie('lastSeries');
	var lastSeason = getCookie('lastSeason');

	var nextFunction = 'window.location = \'https://bs.to/?next\'';

	//Create base
	var headObject = createHead();
	var bodyObject = document.createElement('body');

	//Get The Title
	var titleH = document.getElementById('sp_left');
	titleH = titleH.getElementsByTagName('h2')[0];

	//Get The Episode Title
	var titleE = document.getElementById('titleGerman');

	titleH.appendChild(titleE);

	//Create menubar
	var menuobject = createMenubar();

	var hosterTable = document.createElement('table');
	hosterTable.setAttribute('id', 'hosterTable');
	var hosterTbody = document.createElement('tbody');

	for (i = 0; i < hoster.length + 1; i++) {
		if (!(i < hoster.length)) {
			var playHosterTr = document.createElement('tr');
			playHosterTr.setAttribute('class', 'playHosterTr');
			playHosterTr.setAttribute('id', (i + 1));
			playHosterTr.setAttribute('tabindex', -1);
			var playHosterTd = document.createElement('td');
			playHosterTd.setAttribute('id', 'playHosterTd');
			playHosterTd.innerHTML = '<a target="_blank" href="' + bsout + '">Open Selected Hoster</a>';
			playHosterTr.appendChild(playHosterTd);
			hosterTbody.appendChild(playHosterTr);
		} else {
			var tr = document.createElement('tr');
			var td = document.createElement('td');

			var clickFunc = 'https://bs.to/serie/' + getCookie('lastSeries');
			 + '/' +
			getCookie('lastSeason');
			 + '/' + getCookie('lastEpisode');
			 + '/' + hoster[i];
			clickFunc = 'window.location = \'' + clickFunc + '\'';

			tr.setAttribute('onclick', clickFunc);
			tr.setAttribute('id', (i + 1));
			tr.setAttribute('tabindex', -1);
			td.innerHTML = hoster[i];

			tr.appendChild(td);
			hosterTbody.appendChild(tr);
		}

	}

	hosterTable.appendChild(hosterTbody);

	var functionTable = document.createElement('table');
	functionTable.setAttribute('id', 'functionTable');
	var functionTbody = document.createElement('tbody');
	var functionTr = document.createElement('tr');

	var backButton = document.createElement('td');
	var nextButton = document.createElement('td');

	backButton.innerHTML = 'Zurück';
	backButton.setAttribute('id', 'backButton');
	nextButton.innerHTML = 'Nexte Episode';
	nextButton.setAttribute('onclick', nextFunction);

	functionTr.appendChild(backButton);
	functionTr.appendChild(nextButton);

	functionTbody.appendChild(functionTr);
	functionTable.appendChild(functionTbody);

	bodyObject.appendChild(menuobject);
	bodyObject.appendChild(titleH);
	bodyObject.appendChild(hosterTable);
	bodyObject.appendChild(functionTable);

	//Add content
	document.head.innerHTML = headObject.innerHTML;
	document.body = bodyObject;

	$("#hosterTable").on("mouseover", "tr", function () {
		var searchElem = document.getElementById('search');

		if (searchElem !== document.activeElement) {
			this.focus();
		}
	});

	$("body").click(function (event) {
		var searchElem = document.getElementById('search');

		if (searchElem !== document.activeElement) {
			event.preventDefault();
			this.focus();
		}
	});

	//add events to search and autoplay
	$('#auto').on('change', function () {
		var auto = document.getElementById('auto');
		setCookie('autoplay', auto.checked, false);

		if (!getCookie('autoplay')) {
			setCookie('autoplay', false, false);

			removeCookie('lastSeries');
			removeCookie('lastSeason');
			removeCookie('lastEpisode');
		}
	});

	$("#backButton").on("click", function () {
		var backFunction = 'https://bs.to/serie/' + lastSeries + '/' + lastSeason;
		setCookie('autoplay', false, false);
		window.location = backFunction;

	});

	document.getElementById('hosterTable').getElementsByTagName('tr')[0].focus();

	//Always log in with 'Angemeldet bleiben'
	var isLogg = document.getElementsByName('login[remember]');
	if (isLogg.length != 0) {
		isLogg[0].checked = true;
	}

	//Set the Checkbox to the current autoplay state
	document.getElementById('auto').checked = getCookie('autoplay');
}

function createHead() {
	//Construct the head
	var headNode = document.createElement('head');
	var titleNode = document.getElementsByTagName('title')[0];
	var baseNode = document.getElementsByTagName('base')[0];
	var charsetNode = document.getElementsByTagName('meta')[0];
	var favNode = document.getElementsByTagName('link')[0];

	//Add styleSheet
	var styles = "@import url('" + cssLink + "');";
	var styleNode = document.createElement('link');
	styleNode.rel = 'stylesheet';
	styleNode.href = 'data:text/css,' + escape(styles);

	headNode.appendChild(charsetNode);
	headNode.appendChild(baseNode);
	headNode.appendChild(favNode);
	headNode.appendChild(titleNode);
	headNode.appendChild(styleNode);

	return headNode;
}

//Some shit for keyboard controll
/////////////////////////////////

function focusNext(value) {
	var lastFoc = document.activeElement.getAttribute('id');
	lastFoc = parseInt(lastFoc);
	if (isNaN(lastFoc)) {
		var elem;
		if (lastFocus != 0) {
			elem = document.getElementById('' + lastFocus);
			lastFoc = lastFocus;
		} else {
			elem = document.getElementById('1');
			lastFocus = 1;
			lastFoc = 1;
		}

		if (elem != null) {
			while (getStyle(elem, "display") == "none") {
				lastFoc++;
				elem = document.getElementById('' + lastFoc);
				if (elem === null) {
					break;
				}
			}
		}

		if (elem != null) {
			elem.focus();
		}
	} else {
		lastFoc += value;
		var elem = document.getElementById('' + lastFoc);

		if (elem != null) {
			while (getStyle(elem, "display") == "none") {
				lastFoc++;
				elem = document.getElementById('' + lastFoc);
				if (elem === null) {
					break;
				}
			}
		}

		if (elem != null) {
			document.getElementById('' + lastFoc).focus();
			lastFocus = lastFoc;
		} else {
			var elems = document.getElementById('hosterTable').getElementsByTagName('tr');
			elems[elems.length - 1].focus();
			lastFocus = elems.length;
		}
	}
	scrollToFocus();
}

function focusPrevious(value) {
	var lastFoc = document.activeElement.getAttribute('id');
	lastFoc = parseInt(lastFoc);
	if (isNaN(lastFoc)) {
		var elem;
		if (lastFocus != 0) {
			elem = document.getElementById('' + lastFocus);
			lastFoc = lastFocus;
		} else {
			elem = document.getElementById('1');
			lastFocus = 1;
			lastFoc = 1;
		}

		if (elem != null) {
			while (getStyle(elem, "display") == "none") {
				lastFoc++;
				elem = document.getElementById('' + lastFoc);
				if (elem === null) {
					break;
				}
			}
		}

		if (elem != null) {
			elem.focus();
		}
	} else {
		lastFoc -= value;
		var elem = document.getElementById('' + lastFoc);

		if (elem != null) {
			while (getStyle(elem, "display") == "none") {
				lastFoc--;
				elem = document.getElementById('' + lastFoc);
				if (elem === null) {
					break;
				}
			}
		}

		if (elem !== null) {
			document.getElementById('' + lastFoc).focus();
			lastFocus = lastFoc;
		} else {
			var elems = document.getElementById('hosterTable').getElementsByTagName('tr');
			elems[0].focus();
			lastFocus = 0;
		}
	}
	scrollToFocus();
}

function getStyle(el, styleProp) {
	var value,
	defaultView = (el.ownerDocument || document).defaultView;
	// W3C standard way:
	if (defaultView && defaultView.getComputedStyle) {
		// sanitize property name to css notation
		// (hypen separated words eg. font-Size)
		styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
		return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
	} else if (el.currentStyle) { // IE
		// sanitize property name to camelCase
		styleProp = styleProp.replace(/\-(\w)/g, function (str, letter) {
				return letter.toUpperCase();
			});
		value = el.currentStyle[styleProp];
		// convert other units to pixels on IE
		if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
			return (function (value) {
				var oldLeft = el.style.left,
				oldRsLeft = el.runtimeStyle.left;
				el.runtimeStyle.left = el.currentStyle.left;
				el.style.left = value || 0;
				value = el.style.pixelLeft + "px";
				el.style.left = oldLeft;
				el.runtimeStyle.left = oldRsLeft;
				return value;
			})(value);
		}
		return value;
	}
}

function scrollToFocus() {
	window.scroll(0, findPos(document.activeElement) - 90);
}

//Finds y value of given object
function findPos(obj) {
	var curtop = 0;
	if (obj.offsetParent) {
		do {
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
		return [curtop];
	}
}

$(window).keydown(function (e) {

	if (document.getElementById('search') === document.activeElement) {
		if (e.keyCode === 27 || e.keyCode === 13) { //Esc / Enter
			e.preventDefault();
			focusNext(1);
		}
	} else if (document.activeElement.tagName.toLowerCase() != "input") {
		if (e.keyCode === 75) { //K
			e.preventDefault();
			document.getElementById('search').focus();
		} else if (e.keyCode === 38) { //Arr-up
			e.preventDefault();
			focusPrevious(1);
		} else if (e.keyCode === 40) { //Arr-down
			e.preventDefault();
			focusNext(1);
		} else if (e.keyCode === 13) { //Enter
			e.preventDefault();
			if (document.getElementById('hosterTable').contains(document.activeElement)) {
				if (document.activeElement.getElementsByTagName('a').length > 0) {
					document.activeElement.getElementsByTagName('a')[0].click();
				} else {
					document.activeElement.click();
				}

			}
		} else if (e.keyCode === 65) { //A
			e.preventDefault();
			document.getElementById('auto').checked = !document.getElementById('auto').checked;

			var auto = document.getElementById('auto');
			setCookie('autoplay', auto.checked, false);

		} else if (e.keyCode === 8) { //Return
			e.preventDefault();
			var lastSeries = getCookie('lastSeries');
			var lastSeason = getCookie('lastSeason');
			var backFunction = 'https://bs.to/serie/' + lastSeries + '/' + lastSeason;
			setCookie('autoplay', false, false);
			window.location = backFunction;
		} else if (e.keyCode === 78) { //N
			e.preventDefault();
			window.location = 'https://bs.to/?next';
		} else if (e.keyCode === 72) { //H
			e.preventDefault();
			window.location = 'https://bs.to/serie-alphabet';
		}
	}
});
