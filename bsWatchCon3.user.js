﻿// ==UserScript==
// @name        BsWatch hoster to video redirect
// @namespace   http://www.greasespot.net/
// @include     /^https:\/\/bs\.to\/serie\/[^\/]+\/\d+\/[^\/]+\/.+$/
// @version    	1
// @description	Redirect for bs Hoster to the hosterwebsite.
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// ==/UserScript==

//Some Global variables
var cssLink = 'https://dl.dropbox.com/s/rf3rzlzsa3lg3to/bsStyle.css';
var homeLink = 'https://dl.dropbox.com/s/8zk6qsh3aox4j3o/home.png';
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

var homeLink = 'https://dl.dropbox.com/s/8zk6qsh3aox4j3o/home.png';
var confLink = 'https://dl.dropbox.com/s/lsnn2gwkk5wztfo/conf.png';
var delLink = 'https://dl.dropbox.com/s/v0fxk2h4abzwtpw/delete.png';

var isLoggedin = false;

function setCookie(name, value, perma) {
	var expires = '';

	if (perma) {
		var d = new Date();
		d.setTime(d.getTime() + (9999 * 24 * 60 * 60 * 1000));
		var expires = ";expires=" + d.toUTCString();
	}
	document.cookie = name + "=" + value + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			var returnVal = c.substring(name.length, c.length);

			if (returnVal.toLowerCase() == 'true') {
				return true;
			} else if (returnVal.toLowerCase() == 'false') {
				return false;
			} else if ((/^\d+$/).test(returnVal)) {
				return parseInt(returnVal);
			} else {
				return returnVal;
			}
		}
	}
	return undefined;
}

function removeCookie(name) {
	document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function addFavorite(series) {
	var favs = getCookie('favorites');

	if (favs == undefined) {
		var favsSolo = [];
	} else {
		var favsSolo = favs.split(',');
	}

	if ($.inArray(series, favsSolo) != -1) {
		return;
	}

	var newCookie = "";
	for (i = 0; i < favsSolo.length; i++) {
		newCookie += favsSolo[i] + ",";
	}
	newCookie += series;

	setCookie('favorites', newCookie, true);

}

function getFavs() {
	var favs = getCookie('favorites');
	if (favs == undefined) {
		return [];
	} else if (favs.split(',')[0] == '') {
		removeCookie('favorites');
		return [];
	}

	return favs.split(',');
}

function removeFavorite(name) {
	var favs = getCookie('favorites');

	var favsSolo = favs.split(',');

	if ($.inArray(name, favsSolo) == -1) {
		return;
	}

	var nameIndex = $.inArray(name, favsSolo);

	favsSolo = removeIndex(favsSolo, nameIndex);

	var newCookie = "";
	for (i = 0; i < favsSolo.length; i++) {
		if (i < favsSolo.length - 1) {
			newCookie += favsSolo[i] + ',';
		} else {
			newCookie += favsSolo[i];
		}
	}

	setCookie('favorites', newCookie, true);
}

function removeIndex(arr, index) {
	arr.splice(index, 1);
	return arr;
}

function createMenubar() {
	//Base containers
	var baseCon = document.createElement('div');
	var menuCon = document.createElement('div');
	var leftCon = document.createElement('div');
	var rightCon = document.createElement('div');

	//Set ids
	baseCon.setAttribute('id', 'baseCon');
	menuCon.setAttribute('id', 'menuCon');
	leftCon.setAttribute('id', 'leftCon');
	rightCon.setAttribute('id', 'rightCon');

	//check if user is loged in
	var loggedSection = document.getElementById('navigation');
	if (loggedSection == null) {
		//Is not logged in

		//Get the bs.to login form
		var loginForm = document.getElementById('login');
		
		var logClick = loginForm.getElementsByTagName('input')[3];
		logClick.addEventListener('click',function(){
			document.forms[0].submit();
		});
		
		rightCon.appendChild(loginForm);

	} else {
		//Is logged in
		isLoggedin = true;

		//Get the bs.to username welcome
		var textDiv = loggedSection.getElementsByTagName('div')[0];
		textDiv.setAttribute('id', 'welcome');
		rightCon.appendChild(textDiv);
	}

	var favButton = document.createElement('div');
	favButton.setAttribute('id', 'favButton');
	var confImage = document.createElement('img');
	confImage.setAttribute('src', confLink);
	confImage.setAttribute('width', '50');
	confImage.setAttribute('height', '50');

	favButton.appendChild(confImage);

	//Add a Favorite table
	var favCon = document.createElement('div');
	favCon.setAttribute('id', 'favCon');

	favButton.appendChild(favCon);

	rightCon.appendChild(favButton);

	//Set the left menubar part

	//Create the backbutton that links to this site ... so no function
	var backButton = document.createElement('button');
	var linkTo = 'window.location = \'https://bs.to/serie-alphabet\'';
	backButton.setAttribute('onclick', linkTo);

	//The button image
	var buttonImage = document.createElement('img');
	buttonImage.setAttribute('src', homeLink);
	buttonImage.setAttribute('width', '50');
	buttonImage.setAttribute('height', '50');

	backButton.appendChild(buttonImage);

	//Create the search input
	var searchInput = document.createElement('input');
	searchInput.setAttribute('placeholder', 'Suche');
	searchInput.setAttribute('type', 'search');
	searchInput.setAttribute('id', 'search');

	//Create the checkbox and checkbox label
	var autoplayCheckbox = document.createElement('input');
	autoplayCheckbox.setAttribute('type', 'checkbox');
	autoplayCheckbox.setAttribute('class', 'vis-hidden');
	autoplayCheckbox.setAttribute('id', 'auto');

	var autoplayLabel = document.createElement('label');
	autoplayLabel.setAttribute('id', "autolabel");
	autoplayLabel.setAttribute('for', 'auto');
	autoplayLabel.innerHTML = 'Autoplay';

	//Create the left container
	leftCon.appendChild(backButton);
	leftCon.appendChild(searchInput);
	leftCon.appendChild(autoplayCheckbox);
	leftCon.appendChild(autoplayLabel);

	//Create the menu container
	menuCon.appendChild(leftCon);
	menuCon.appendChild(rightCon);
	baseCon.appendChild(menuCon);

	//Add events

	searchInput.addEventListener("input", function () {
		//Search

		//get the searchterm
		var searchTerm = document.getElementById('search').value.toLowerCase();

		var tbodys = document.getElementsByTagName('tbody');

		var allContent = [];

		for (i = 0; i < tbodys.length; i++) {

			var seasonTable = document.getElementById('seasonTable');
			var functionTable = document.getElementById('functionTable');
			var favTable = document.getElementById('favTable');

			if (seasonTable === null) {
				seasonTable = document.createElement('div');
			}
			if (functionTable === null) {
				functionTable = document.createElement('div');
			}
			if (favTable === null) {
				favTable = document.createElement('div');
			}

			if (!seasonTable.contains(tbodys[i])) {
				if (!functionTable.contains(tbodys[i])) {
					if (!favTable.contains(tbodys[i])) {
						var buff = Array.prototype.slice.call(tbodys[i].getElementsByTagName('tr'));
						allContent = allContent.concat(buff);
					}
				}
			}

		}

		for (i = 0; i < allContent.length; i++) {
			var innerString = allContent[i].innerHTML.toLowerCase();
			//Ugly but works .. replaceAll
			var regexPart = new RegExp('\<[^\>]*\>');
			innerString = innerString.split(regexPart).join('');

			//Check if the inner contains the searchterm
			if (!innerString.includes(searchTerm)) {
				//Magic
				allContent[i].style.display = 'none';
			} else {
				//No magic
				allContent[i].style.display = '';
			}
		}
		lastFocus = 0;
	});

	autoplayLabel.addEventListener('click', function () {
		document.getElementById('auto').checked = !document.getElementById('auto').checked;

		var auto = document.getElementById('auto');
		setCookie('autoplay', auto.checked, false);

		if (!getCookie('autoplay')) {
			setCookie('autoplay', false, false);

			removeCookie('lastSeries');
			removeCookie('lastSeason');
			removeCookie('lastEpisode');
		}

	});

	return baseCon;
}

function updateFavorites() {
	var favTable = document.createElement('table');
	favTable.setAttribute('id', 'favTable');
	var favTbody = document.createElement('tbody');

	var favs = getFavs();
	for (i = 0; i < favs.length; i++) {
		var tr = document.createElement('tr');
		var td1 = document.createElement('td');
		var td2 = document.createElement('td');
		var td3 = document.createElement('td');

		td1.innerHTML = (i + 1);
		td1.setAttribute('val', favs[i]);
		td2.innerHTML = favs[i];
		td2.setAttribute('val', favs[i]);
		td3.innerHTML = '<img src="' + delLink + '" height="30" width="30">';
		td3.setAttribute('val', favs[i]);

		td1.addEventListener('click', function () {
			var val = this.getAttribute('val');
			window.location = 'https://bs.to/serie/' + val;
		});
		td2.addEventListener('click', function () {
			var val = this.getAttribute('val');
			window.location = 'https://bs.to/serie/' + val;
		});
		td3.addEventListener('click', function () {
			var val = this.getAttribute('val');
			removeFavorite(val);
			updateFavorites();
		});

		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);

		favTbody.appendChild(tr);
	}

	var path = window.location.pathname;
	if (path.split('/').length > 2) {
		var addButton = document.createElement('tr');
		addButton.setAttribute('id', 'addButton');

		var addButtonTd = document.createElement('td');
		addButtonTd.setAttribute('colspan', '3');
		addButtonTd.innerHTML = 'Series Favoritieren';
		addButton.appendChild(addButtonTd);

		addButton.addEventListener('click', function () {
			addThisFav();
		});

		favTbody.appendChild(addButton);
	}

	favTable.appendChild(favTbody);
	document.getElementById('favCon').innerHTML = '';
	document.getElementById('favCon').appendChild(favTable);
}

function addThisFav() {
	var slicePath = window.location.pathname;
	slicePath = slicePath.split('/');
	addFavorite(slicePath[2]);
	updateFavorites();
}

function removeThisFav() {
	var slicePath = window.location.pathname;
	slicePath = slicePath.split('/');
	removeFavorite(slicePath[2]);
	updateFavorites();
}

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
