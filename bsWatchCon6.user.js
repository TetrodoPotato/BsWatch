// ==UserScript==
// @name        BsWatch style for series-alphabet
// @namespace   http://www.greasespot.net/
// @include     https://bs.to/serie-alphabet
// @version    	1
// @description	Attatch new styles to series-alphabet
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// ==/UserScript==

//Some Global variables
var cssLink = 'https://dl.dropbox.com/s/rf3rzlzsa3lg3to/bsStyle.css';
var homeLink = 'https://dl.dropbox.com/s/8zk6qsh3aox4j3o/home.png';
var confLink = 'https://dl.dropbox.com/s/lsnn2gwkk5wztfo/conf.png';
var delLink = 'https://dl.dropbox.com/s/v0fxk2h4abzwtpw/delete.png';
var isLoggedin = false;
var lastFocus = 1;

//Black page over original
var blackP = document.createElement('div');
var blackPStyle = 'width:100%; height:100%; position:fixed; top:0; left:0; background:#000; z-index:999';
blackP.setAttribute('style', blackPStyle);
blackP.setAttribute('id', 'blackP');

//Attach blackPage
document.documentElement.appendChild(blackP);

//Scroll to top
window.scroll(0, 0);

//disable scrollbars .. for ... reasons
document.documentElement.style.overflow = 'hidden'; // firefox, chrome

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
		logClick.addEventListener('click', function () {
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

//Reset last connection
setCookie('autoplay', false, false);
removeCookie('lastSeries');
removeCookie('lastSeason');
removeCookie('lastEpisode');

//When document loaded
$(document).ready(function () {

	//container with all series names
	var seriesContainer = document.getElementById('seriesContainer');

	//Create base
	var headObject = createHead();
	var bodyObject = document.createElement('body');

	//Create menubar
	var menuobject = createMenubar();

	//All series a-tags
	var seriesNames = seriesContainer.getElementsByTagName('a');

	//create the series table
	var table = document.createElement('table');
	table.setAttribute('id', 'seriesTable');
	var tbody = document.createElement('tbody');

	//Create the content of the table
	for (i = 0; i < seriesNames.length; i++) {
		var nameDE = seriesNames[i].innerHTML;
		var linkTo = seriesNames[i].getAttribute('href');

		var node = createNode((i + 1), nameDE, linkTo);
		tbody.appendChild(node);
	}
	table.appendChild(tbody);

	//Fill the body
	bodyObject.appendChild(menuobject);
	bodyObject.appendChild(table);

	//delete the original page and fill again

	document.documentElement.innerHTML = "";

	//Black page over original
	var blackP = document.createElement('div');
	var blackPStyle = 'width:100%; height:100%; position:fixed; top:0; left:0; background:#000; z-index:999';
	blackP.setAttribute('style', blackPStyle);
	blackP.setAttribute('id', 'blackP');

	//Attach blackPage
	document.documentElement.appendChild(blackP);

	//Add content
	document.head.innerHTML = headObject.innerHTML;
	document.body = bodyObject;

	//Activate scrollbars
	document.documentElement.style.overflow = 'auto'; // firefox, chrome

	//Focus object when mouse hover
	$("#seriesTable").on("mouseover", "tr", function () {
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

	document.getElementById('seriesTable').getElementsByTagName('tr')[0].focus();

	//add events to search and autoplay
	$('#auto').on('change', function () {
		var auto = document.getElementById('auto');
		setCookie('autoplay', auto.checked, false);
		console.log('niho');
	});

	//Always log in with 'Angemeldet bleiben'
	var isLogg = document.getElementsByName('login[remember]');
	if (isLogg.length != 0) {
		isLogg[0].checked = true;
	}

	//Set the Checkbox to the current autoplay state
	document.getElementById('auto').checked = getCookie('autoplay');
	updateFavorites();

	//Delete blackP stylesheeds loaded ... because the stylesheed needs to be loaded
	$(window).bind("load", function () {
		$('#blackP').remove();
	});
});

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

function createNode(index, nameDE, linkTo) {
	//Make a table row that links to the Series
	var tableRow = document.createElement('tr');

	//The link to the Series
	linkTo = 'https://bs.to/' + linkTo;

	//On click change dir
	var clickFunc = 'window.location = \'' + linkTo + '\'';
	tableRow.setAttribute('onclick', clickFunc);
	tableRow.setAttribute("tabindex", -1);
	tableRow.setAttribute("id", index);

	//Node with the index in it
	var indexNode = document.createElement('td');
	indexNode.innerHTML = index;

	//Node with the name in it
	var nameNode = document.createElement('td');
	nameNode.innerHTML = nameDE;

	//Construct the row
	tableRow.appendChild(indexNode);
	tableRow.appendChild(nameNode);

	return tableRow;

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
			var elems = document.getElementById('seriesTable').getElementsByTagName('tr');
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
			var elems = document.getElementById('seriesTable').getElementsByTagName('tr');
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
			if (document.getElementById('seriesTable').contains(document.activeElement)) {
				document.activeElement.click();
			}
		} else if (e.keyCode === 37) { //Arr-left
			e.preventDefault();
			focusPrevious(10);
		} else if (e.keyCode === 39) { //Arr-right
			e.preventDefault();
			focusNext(10);
		} else if (e.keyCode === 65) { //A
			e.preventDefault();
			document.getElementById('auto').checked = !document.getElementById('auto').checked;

			var auto = document.getElementById('auto');
			setCookie('autoplay', auto.checked, false);
		} else if (e.keyCode === 72) { //H
			e.preventDefault();
			window.location = 'https://bs.to/serie-alphabet';
		}

	}
});
