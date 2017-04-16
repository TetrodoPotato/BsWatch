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
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/keycontroll.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/bsWatchCon6.user.js
// ==/UserScript==

//Black page over original
makeBlackPage();

//When document loaded
$(document).ready(function () {
	//Scroll to top
	window.scroll(0, 0);

	//Reset last connection
	setCookie('autoplay', false, false);
	removeCookie('lastSeries');
	removeCookie('lastSeason');
	removeCookie('lastEpisode');

	makePage();
	updateFavorites();

	//Delete blackP ... because the stylesheed needs to be loaded
	$(window).bind("load", function () {
		removeBlackPage();
	});
});

function makePage() {
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

	//Add content
	document.head.innerHTML = headObject.innerHTML;
	document.body = bodyObject;
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

	//Focus object when mouse hover
	tableRow.addEventListener("mouseover", function () {
		var searchElem = document.getElementById('search');

		//Prevent focus when search-textarea has it
		if (searchElem !== document.activeElement) {
			this.focus();
		}
	});

	return tableRow;
}
