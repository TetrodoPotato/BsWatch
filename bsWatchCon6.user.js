// ==UserScript==
// @name		BsWatch style for series-alphabet
// @namespace   http://www.greasespot.net/
// @include     https://bs.to/serie-alphabet
// @version    	1
// @description	Attatch new styles to series-alphabet
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/cookiecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/favoritecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/menucontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/defaultcontroll.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/bsWatchCon6.user.js
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

//Scroll to top
window.scroll(0, 0);

//disable scrollbars .. for ... reasons
document.documentElement.style.overflow = 'hidden'; // firefox, chrome

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

//Cookie controll


