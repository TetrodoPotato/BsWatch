// ==UserScript==
// @name        BsWatch hoster redirect
// @namespace   http://www.greasespot.net/
// @include     /^https:\/\/bs\.to\/serie\/[^\/]+\/\d+\/[^\/\:]+$/
// @version    	1
// @description	Redirect for bs Episode to the bs hoster.
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/cookiecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/favoritecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/menucontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/defaultcontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/keycontroll.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/bsWatchCon2.user.js
// ==/UserScript==

//Black page over original page
makeBlackPage();

//When document loaded
$(document).ready(function () {
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

	var errorCode = getCookie('errorCode');
	if (errorCode == undefined) {
		setCookie('errorCode', 0, false);
		errorCode = 0;
	} else {
		var urlSrc = window.location.pathname;
		var sameEpisode = urlSrc.split('/')[4];
		if (sameEpisode != getCookie('lastEpisode')) {
			setCookie('errorCode', 0, false);
			errorCode = 0;
		}
	}
	
	//Set cookies for next episode
	setGlobalVars();
	//Check if hoster-var contains a supportet hoster
	if ($.inArray("Vivo", hoster) != -1 && errorCode < 1) {
		window.location = window.location.href + '/Vivo';
	} else if ($.inArray("OpenLoadHD", hoster) != -1 && errorCode < 2) {
		window.location = window.location.href + '/OpenLoadHD';
	} else if ($.inArray("OpenLoad", hoster) != -1 && errorCode < 3) {
		window.location = window.location.href + '/OpenLoad';
	} else {
		//Activate everything and go hang yourself

		//Make a hoster page
		makePage(hoster);
		updateFavorites();
		

		//Delete blackP stylesheeds loaded ... because the stylesheed needs to be loaded
		$(window).bind("load", function () {
			removeBlackPage();

		});
	}
});

function makePage(hoster) {
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

	for (i = 0; i < hoster.length; i++) {
		var tr = document.createElement('tr');
		var td = document.createElement('td');

		var clickFunc = window.location.href + '/' + hoster[i];
		clickFunc = 'window.location = \'' + clickFunc + '\'';

		tr.setAttribute('onclick', clickFunc);
		tr.setAttribute('id', (i + 1));
		tr.setAttribute('tabindex', -1);
		td.innerHTML = hoster[i];

		tr.appendChild(td);
		hosterTbody.appendChild(tr);

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

	$("#backButton").on("click", function () {
		var backFunction = 'https://bs.to/serie/' + lastSeries + '/' + lastSeason;
		setCookie('autoplay', false, false);
		window.location = backFunction;

	});
}

//Set global variables for the browser tab
function setGlobalVars() {
	var urlSrc = window.location.pathname;

	setCookie('lastSeries', urlSrc.split('/')[2], false);
	setCookie('lastSeason', urlSrc.split('/')[3], false);
	setCookie('lastEpisode', urlSrc.split('/')[4], false);
	
	setCookie('lastSeriesPerm', urlSrc.split('/')[2], true);
	setCookie('lastSeasonPerm', urlSrc.split('/')[3], true);
	setCookie('lastEpisodePerm', urlSrc.split('/')[4], true);
}