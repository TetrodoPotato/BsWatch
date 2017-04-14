// ==UserScript==
// @name        BsWatch autoplay next episode
// @namespace   http://www.greasespot.net/
// @include     /^https:\/\/bs\.to\/serie\/[^\/]+\/\d+$/
// @include     /^https:\/\/bs\.to\/serie\/[^\/]+\/\d+\/unwatch\:\d+$/
// @include     /^https:\/\/bs\.to\/serie\/[^\/]+\/\d+\/watch\:\d+$/
// @include     /^https:\/\/bs\.to\/serie\/[^\/]+\/\d+\/unwatch\:all$/
// @include     /^https:\/\/bs\.to\/serie\/[^\/]+\/\d+\/watch\:all$/
// @include     /^https:\/\/bs\.to\/serie\/[^\/]+$/
// @version    	1
// @description	Redirect checks for next play and starts next episode.
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// ==/UserScript==

//Some Global variables
var cssLink = 'https://dl.dropbox.com/s/rf3rzlzsa3lg3to/bsStyle.css';
var homeLink = 'https://dl.dropbox.com/s/8zk6qsh3aox4j3o/home.png';
var watchedIcon = 'https://dl.dropbox.com/s/a083do4wtgb9qp5/unwatch.png';
var unwatchedIcon = 'https://dl.dropbox.com/s/gjasisglzfc6m3a/watch.png';
var lastFocus = 1;

//Black page over original
var blackP = document.createElement('div');
var blackPStyle = 'width:100%; height:100%; position:fixed; top:0; left:0; background:#000; z-index:99';
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

//Name of this series
var thisSeries = window.location.pathname.split('/')[2];

//When document loaded
$(document).ready(function () {
	//Scroll to top ... reasons
	$(this).scrollTop(0);

	//Check if there was a last episode
	if (typeof getCookie('lastEpisode') == 'string') {
		//Check if this is the same series
		if (getCookie('lastSeries') == thisSeries) {
			//Check if autoplay is on
			if (getCookie('autoplay') == true) {
				if (getCookie('lastEpisode') != 'next0x000001') {
					nextWindow(5);
				}
			} else {
				setCookie('autoplay', false, false);

				removeCookie('lastSeries');
				removeCookie('lastSeason');
				removeCookie('lastEpisode');
			}
		} else {
			//Reset everything
			setCookie('autoplay', false, false);

			removeCookie('lastSeries');
			removeCookie('lastSeason');
			removeCookie('lastEpisode');
		}
	}

	makeThePage();
	updateFavorites();
	

});

function makeThePage() {
	//Make the new page

	//Create base
	var headObject = createHead();
	var bodyObject = document.createElement('body');

	//Create menubar
	var menuobject = createMenubar();

	//Get The Title
	var titleH = document.getElementById('sp_left');
	titleH = titleH.getElementsByTagName('h2')[0];

	//Get the Seasons
	var seasonContainer = document.getElementById('seasons');
	seasonContainer = seasonContainer.getElementsByTagName('li');

	//Construct a season table
	var seriesTable = document.createElement('table');
	seriesTable.setAttribute('id', 'seasonTable');
	var seriesTableTbody = document.createElement('tbody');
	var seriesTableRow = document.createElement('tr');

	for (i = 0; i < seasonContainer.length; i++) {
		var index = seasonContainer[i].getElementsByTagName('a')[0].innerHTML;
		var linkTo = seasonContainer[i].getElementsByTagName('a')[0].getAttribute('href');
		var onSeason = 0;
		if (seasonContainer[i].getAttribute('class') != null) {
			if (seasonContainer[i].getAttribute('class').indexOf('active') !== -1) {
				onSeason = 1;
			} else if (seasonContainer[i].getAttribute('class').indexOf('watched') !== -1) {
				onSeason = 2;
			}
		}

		seriesTableRow.appendChild(createSeasonNode(index, linkTo, onSeason));
	}
	//Just do it.
	seriesTableTbody.appendChild(seriesTableRow);
	seriesTable.appendChild(seriesTableTbody);

	//Variables with all episode information
	var episodeNodes = document.getElementsByClassName('episodes')[0];
	episodeNodes = episodeNodes.getElementsByTagName('tr');

	//create the episode table
	var table = document.createElement('table');
	table.setAttribute('id', 'episodeTable');
	var tbody = document.createElement('tbody');

	for (i = 0; i < episodeNodes.length; i++) {
		//createNode(index, nameDE, nameOr, linkTo, watched, linkWatched)
		var nameDE = episodeNodes[i].getElementsByTagName('strong');
		if (nameDE.length != 0) {
			nameDE = nameDE[0].innerHTML;
		} else {
			nameDE = "";
		}

		var nameOr = episodeNodes[i].getElementsByTagName('i');
		if (nameOr.length != 0) {
			nameOr = nameOr[0].innerHTML;
		} else {
			nameOr = "";
		}

		var linkTo = episodeNodes[i].getElementsByTagName('a')[0];
		linkTo = linkTo.getAttribute('href');

		var watched = false;
		if (episodeNodes[i].getAttribute('class') == 'watched') {
			watched = true;
		}

		var linkWatched = "";
		if (isLoggedin) {
			linkWatched = episodeNodes[i].getElementsByClassName('icon')[0];
			linkWatched = linkWatched.getAttribute('href');
		}

		var contentNode = createNode((i + 1), nameDE, nameOr, linkTo, watched, linkWatched);
		tbody.appendChild(contentNode);
	}

	table.appendChild(tbody);

	//Fill the body

	bodyObject.appendChild(menuobject);
	bodyObject.appendChild(titleH);
	bodyObject.appendChild(seriesTable);
	bodyObject.appendChild(table);

	if (isLoggedin) {
		//Get the current seasonnumber
		var theUrl = window.location.pathname;
		var seasonNumber = 1;

		if (theUrl.includes('/unwatch')) {
			theUrl = theUrl.split('/unwatch')[0];
		} else if (theUrl.includes('/watch')) {
			theUrl = theUrl.split('/watch')[0];
		}

		if (theUrl.split('/').length != 3) {
			seasonNumber = parseInt(theUrl.split('/')[3]);

		} else {
			theUrl = theUrl + '/' + 1;
		}

		//Make a watch/unwatch all Table
		var watchUnwatchTable = document.createElement('table');
		watchUnwatchTable.setAttribute('id', 'allWatchTable');
		var watchUnwatchTbody = document.createElement('tbody');
		var watchUnwatchtr = document.createElement('tr');

		//nice and now .. hmm .. use the hand
		var firstFunc = 'window.location = \'https://bs.to' + theUrl + '/' + 'watch:all' + '\'';
		var firstTd = document.createElement('td');
		firstTd.innerHTML = "Mark all as Watched";
		firstTd.setAttribute('onclick', firstFunc);

		//nice and now .. hmm .. use the second hand
		var secondFunc = 'window.location = \'https://bs.to' + theUrl + '/' + 'unwatch:all' + '\'';
		var secondTd = document.createElement('td');
		secondTd.innerHTML = "Mark all as Unwatched";
		secondTd.setAttribute('onclick', secondFunc);

		watchUnwatchtr.appendChild(firstTd);
		watchUnwatchtr.appendChild(secondTd);

		watchUnwatchTbody.appendChild(watchUnwatchtr);
		watchUnwatchTable.appendChild(watchUnwatchTbody);

		bodyObject.appendChild(watchUnwatchTable);
	}

	//Add content
	document.head.innerHTML = headObject.innerHTML;
	document.body = bodyObject;

	//Play the next episode as fast as possible
	//on season change
	if (getCookie('lastEpisode') == 'next0x000001') {
		playNextEpisode();
	}

	//Focus object when mouse hover
	$("#episodeTable").on("mouseover", "tr", function () {
		var searchElem = document.getElementById('search');

		if (searchElem !== document.activeElement) {
			this.focus();
		}
	});

	document.getElementById('episodeTable').getElementsByTagName('tr')[0].focus();

	//Focus object when mouse hover
	$("#seasonTable").on("mouseover", "td", function () {
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

	//Always log in with 'Angemeldet bleiben'
	var isLogg = document.getElementsByName('login[remember]');
	if (isLogg.length != 0) {
		isLogg[0].checked = true;
	}

	//Set the Checkbox to the current autoplay state
	document.getElementById('auto').checked = getCookie('autoplay');

	//Activate scrollbars when no autoplay
	var autoTimer = document.getElementById('plane');
	if (autoTimer == null) {
		document.documentElement.style.overflow = 'auto'; // firefox, chrome
	}

	//Delete blackP stylesheeds loaded ... because the stylesheed needs to be loaded
	$(window).bind("load", function () {
		$('#blackP').remove();
	});

}

function createNode(index, nameDE, nameOr, linkTo, watched, linkWatched) {
	//Make a table row that links to the Series
	var tableRow = document.createElement('tr');

	//The link to the Series
	linkTo = 'https://bs.to/' + linkTo;
	//On click change dir
	var clickFunc = 'window.location = \'' + linkTo + '\'';

	tableRow.setAttribute('tabindex', -1);
	tableRow.setAttribute('id', index);
	if (watched) {
		tableRow.setAttribute('class', 'watched');
	}

	//Node with the index in it
	var indexNode = document.createElement('td');
	indexNode.setAttribute('onclick', clickFunc);
	indexNode.innerHTML = index;

	//Node with the name in it
	var nameNode = document.createElement('td');
	nameNode.setAttribute('onclick', clickFunc);
	nameNode.innerHTML = '<strong>' + nameDE + '</strong><i>' + nameOr + '</i>';

	//Construct the row
	tableRow.appendChild(indexNode);
	tableRow.appendChild(nameNode);

	if (isLoggedin) {
		var watchUnwatch = document.createElement('td');
		watchUnwatch.setAttribute('class', 'watchUnwatch');

		//The link to the Episode watchmark
		linkToWatch = 'https://bs.to/' + linkWatched;
		//On click change dir
		var clickFuncWatch = 'window.location = \'' + linkToWatch + '\'';
		watchUnwatch.setAttribute('onclick', clickFuncWatch);

		var watchIcon = document.createElement('img');
		if (watched) {
			watchIcon.setAttribute('src', watchedIcon);
		} else {
			watchIcon.setAttribute('src', unwatchedIcon);
		}
		watchIcon.setAttribute('width', '30');
		watchIcon.setAttribute('height', '30');

		watchUnwatch.appendChild(watchIcon);

		tableRow.appendChild(watchUnwatch);
	}

	return tableRow;

}

function createSeasonNode(index, linkTo, onSeason) {
	var tdNode = document.createElement('td');
	tdNode.innerHTML = index;

	//The link to the Series
	linkTo = 'https://bs.to/' + linkTo;

	//On click change dir
	var clickFunc = 'window.location = \'' + linkTo + '\'';
	tdNode.setAttribute('onclick', clickFunc);
	tdNode.setAttribute('tabindex', -1);

	if (onSeason == 1) {
		tdNode.setAttribute('class', 'onSeason');
	} else if (onSeason == 2) {
		tdNode.setAttribute('class', 'watched');
	}

	return tdNode;
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

function onError() {
	if (playNextEpisode() == false) {
		window.location = window.location.href;
	}
}

function playNextEpisode() {

	//Dom array with elements that contains a episode link
	var domArr = document.getElementById('episodeTable');

	if (domArr == null) {
		setTimeout(onError, 10000);
		return false;
	}

	domArr = domArr.getElementsByTagName('tr');

	//Dom array with the first td-tag-href in the domArr index
	var linkArr = [];
	for (i = 0; i < domArr.length; i++) {
		var tdTag = domArr[i].getElementsByTagName('td')[0];
		var linkFunction = tdTag.getAttribute('onclick');
		linkFunction = linkFunction.replace('window.location = \'https://bs.to/', '');
		linkFunction = linkFunction.replace('\'', '');
		linkArr[linkArr.length] = linkFunction;
	}

	//If the Series before was finished
	if (getCookie('lastEpisode') == 'next0x000001') {
		window.location = 'https://bs.to/' + linkArr[0];
	}

	//Find next episode
	for (i = 0; i < linkArr.length; i++) {
		var linkEpisode = linkArr[i].split('/')[3];
		//Find the last watched Episode
		if (linkEpisode == getCookie('lastEpisode')) {
			//The next index of the episode "i + 1"
			if ((i + 1) < linkArr.length) {
				window.location = 'https://bs.to/' + linkArr[i + 1];
			} else {
				//When the next episode is not in this season
				setCookie('lastEpisode', 'next0x000001', false);
				if (!openNextSeasonUser(1)) {
					setCookie('autoplay', false, false);

					removeCookie('lastSeries');
					removeCookie('lastSeason');
					removeCookie('lastEpisode');
				}
			}
		}
	}

}

function openNextSeasonUser(seasonAmount) {
	//You know
	var allSeasons = document.getElementById('seasonTable');
	allSeasons = allSeasons.getElementsByTagName('td');

	var hasNext = false;

	//Search current season
	for (i = 0; i < allSeasons.length; i++) {
		if (allSeasons[i].getAttribute('class') == 'onSeason') {

			//Check if there is the next/previous season
			if ((i + seasonAmount) < allSeasons.length) {
				if ((i + seasonAmount) > -1) {
					//Simply click it and boom ..
					//the fucking next Season
					allSeasons[i + seasonAmount].click();
					hasNext = true;
				}
			}
		}
	}

	return hasNext;
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
			var elems = document.getElementById('episodeTable').getElementsByTagName('tr');

			if (elems[elems.length - 1] === document.activeElement) {
				openNextSeasonUser(1);
			}

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
			var elems = document.getElementById('episodeTable').getElementsByTagName('tr');

			if (elems[0] === document.activeElement) {
				openNextSeasonUser(-1);
			}

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
	window.scroll(0, findPos(document.activeElement) - 120);
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

	var nextButton = document.getElementById('nextButton');
	if (nextButton != null) {
		if (e.keyCode === 27) { //ESC
			e.preventDefault();
			setNextBreak();
		}
	} else if (document.getElementById('search') === document.activeElement) {
		if (e.keyCode === 27 || e.keyCode === 13) { //Esc /Enter
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
			if (document.getElementById('episodeTable').contains(document.activeElement)) {
				document.activeElement.getElementsByTagName('td')[0].click();
			}
		} else if (e.keyCode === 8 || e.keyCode == 78) { //return /H
			e.preventDefault();
			window.location = 'https://bs.to/serie-alphabet';
		} else if (e.keyCode === 37) { //Arr-left
			e.preventDefault();
			openNextSeasonUser(-1);
		} else if (e.keyCode === 39) { //Arr-right
			e.preventDefault();
			openNextSeasonUser(1);
		} else if (e.keyCode === 65) { //A
			e.preventDefault();
			document.getElementById('auto').checked = !document.getElementById('auto').checked;

			var auto = document.getElementById('auto');
			setCookie('autoplay', auto.checked, false);

			if (!getCookie('autoplay')) {
				setCookie('autoplay', false, false);

				removeCookie('lastSeries');
				removeCookie('lastSeason');
				removeCookie('lastEpisode');
			}

		} else if (e.keyCode === 79) { //O
			e.preventDefault();
			var allWatch = document.getElementById('allWatchTable');
			if (allWatch !== null) {
				allWatch.getElementsByTagName('td')[0].click();
			}
		} else if (e.keyCode === 80) { //P
			e.preventDefault();
			var allWatch = document.getElementById('allWatchTable');
			if (allWatch !== null) {
				allWatch.getElementsByTagName('td')[1].click();
			}
		} else if (e.keyCode === 70) { //F
			addThisFav();
		} else if (e.keyCode === 68) { //D
			removeThisFav();
		} else if (e.keyCode === 87) { //W
			e.preventDefault();
			if (isLoggedin) {
				if (document.getElementById('episodeTable').contains(document.activeElement)) {
					document.activeElement.getElementsByTagName('td')[2].click();
				}
			}

		}

	}
});

//Massive shit for autoplay interrupt
var nextTime = 0;
var nextBreak = false;

function nextWindow(time) {
	nextTime = time;
	nextBreak = false;

	var styleTag = document.createElement('style');
	styleTag.innerHTML = '* {margin:0;padding:0;font-family: Arial, Helvetica, sans-serif;font-size:16px;}' +
		'#plane { z-index:999; position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8);}' +
		'#nextBody {overflow:hidden; border-radius:5px; position:absolute; z-index:1000; height:120px; width:200px; background:#161616; left:0; right:0; top:0; bottom:0; margin:auto;}' +
		'#texts{width:100%; margin:24px auto; color:#FFF; text-align:center; font-size:18px; font-weight:bold;}' +
		'#nextButton {border:none; color:#ee4d2e; font-weight:bold; background-color:#161616; height:50px; width:100%;}' +
		'#nextButton:hover{background-color:#202020;} #nextButton:active{background-color:#000;}'

		var plane = document.createElement('div');
	var bodys = document.createElement('div');
	var texts = document.createElement('div');
	var butto = document.createElement('button');
	plane.setAttribute('id', 'plane');

	bodys.setAttribute('id', 'nextBody');

	texts.setAttribute('id', 'texts');

	texts.innerHTML = 'Nexte Folge in ' + time + 's';

	butto.setAttribute("id", "nextButton");

	butto.innerHTML = "Cancel";

	plane.appendChild(bodys);
	plane.appendChild(styleTag);
	bodys.appendChild(texts);
	bodys.appendChild(butto);
	document.documentElement.appendChild(plane);

	$("#nextButton").on("click", function () {
		setNextBreak();
	});

	for (i = 1; i < time + 2; i++) {
		setTimeout(checkTimeNextWindow, 1000 * i)
	}
}

function setNextBreak() {
	nextBreak = true;
	closeNextBreak();

	document.getElementById('auto').checked = false;

	setCookie('autoplay', false, false);

	removeCookie('lastSeries');
	removeCookie('lastSeason');
	removeCookie('lastEpisode');
}

function checkTimeNextWindow() {
	nextTime--;

	var texts = document.getElementById('texts');
	if (texts !== null) {
		texts.innerHTML = "Nexte Folge in " + nextTime + "s";
	}

	if (nextTime < 0 && !nextBreak) {
		closeNextBreak();
		playNextEpisode();
	}
}

function closeNextBreak() {
	$('#plane').remove();
	document.documentElement.style.overflow = 'auto'; // firefox, chrome fuck ie
}
