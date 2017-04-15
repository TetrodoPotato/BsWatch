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
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/keycontroll.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/bsWatchCon3.user.js
// ==/UserScript==

//Some Global variables
var lastFocus = 1;

//Black page over original
makeBlackPage();

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
			removeBlackPage();
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