// ==UserScript==
// @name		BsWatch - File 2
// @icon 		https://bs.to/opengraph.jpg
// @namespace   http://www.greasespot.net/
// @include     /^https:\/\/bs\.to\/serie-genre[^\/]*$/
// @version    	1.9
// @description	Series List
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/cookiecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/favoritecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/menucontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/defaultcontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/keycontroll.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch2.user.js
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
	//Create base
	var headObject = createHead();
	var bodyObject = document.createElement('body');

	//Create menubar
	var menuobject = createMenubar();

	//Table
	var genretable = makeTable();

	//Fill the body
	bodyObject.appendChild(menuobject);
	bodyObject.appendChild(genretable);

	//Add content
	document.head.innerHTML = headObject.innerHTML;
	document.body = bodyObject;
}

function makeTable() {
	var rowObj = makeRowObj();

	//create the series table
	var table = document.createElement('table');
	table.setAttribute('id', 'seriesTable');
	var tbody = document.createElement('tbody');

	tbody.appendChild(createHeadRow());
	
	//Create the content of the table
	for (t = 0; t < rowObj.length; t++) {
		var node = createRow((t + 1), rowObj[t]);
		tbody.appendChild(node);
	}
	table.appendChild(tbody);

	return table;
}

function makeRowObj() {
	var genresContainer = document.getElementsByClassName('genre');
	var tableRows = [];

	for (i = 0; i < genresContainer.length; i++) {
		var genresEntry = genresContainer[i].getElementsByTagName('a');
		var genreName = genresContainer[i].getElementsByTagName('strong')[0].innerHTML;
		for (x = 0; x < genresEntry.length; x++) {
			var title = genresEntry[x].innerHTML;
			var linkTo = genresEntry[x].getAttribute('href');

			var rowObj = {
				title: title,
				linkTo: linkTo,
				genreName: genreName
			};

			tableRows[tableRows.length] = rowObj;
		}
	}

	//Sorting
	var endPref = window.location.href.split('?');
	if (endPref.length != 1) {
		if (endPref[1] == 'title') {
			tableRows.sort(function (a, b) {
				return a.title.localeCompare(b.title);
			});
		} else if (endPref[1] == 'genre') {
			tableRows.sort(function (a, b) {
				return a.genreName.localeCompare(b.genreName);
			});
		}
	} else {
		tableRows.sort(function (a, b) {
			return a.title.localeCompare(b.title);
		});
	}

	return tableRows;
}

function createHeadRow(){
	var row = document.createElement('tr');
	
	var numNode = document.createElement('th');
	numNode.innerHTML = 'Nr';
	
	var serNode = document.createElement('th');
	serNode.innerHTML = 'Series';
	serNode.setAttribute('onclick',"window.location = 'https://bs.to/serie-genre?title'");
	
	var genNode = document.createElement('th');
	genNode.innerHTML = 'Genre';
	genNode.setAttribute('onclick',"window.location = 'https://bs.to/serie-genre?genre'");
	
	var favNode = document.createElement('th');
	favNode.innerHTML = 'Fav';
	
	row.appendChild(numNode);
	row.appendChild(serNode);
	row.appendChild(genNode);
	row.appendChild(favNode);
	
	return row;
}

//For performance
var favoritesSeries = getFavs();

function createRow(index, rowObj) {
	var tableRow = document.createElement('tr');

	//The link to the Series
	var seriesLinkTo = 'https://bs.to/' + rowObj.linkTo;

	//On click change dir
	var clickFunc = 'window.location = \'' + seriesLinkTo + '\'';
	tableRow.setAttribute("tabindex", -1);
	tableRow.setAttribute("id", index);

	//Node with the index in it
	var indexNode = document.createElement('td');
	indexNode.setAttribute('onclick', clickFunc);
	indexNode.innerHTML = index;

	//Node with the name in it
	var nameNode = document.createElement('td');
	nameNode.setAttribute('onclick', clickFunc);
	nameNode.innerHTML = rowObj.title;

	var genreNode = document.createElement('td');
	genreNode.setAttribute('onclick', clickFunc);
	genreNode.innerHTML = rowObj.genreName;

	//Favorite Node set/rem-favorite
	var favNode = document.createElement('td');
	var toFav = rowObj.linkTo.split('/')[1];
	favNode.setAttribute('favId', toFav);
	favNode.appendChild(getFavStar());

	var isFav = false;
	for (i = 0; i < favoritesSeries.length; i++) {
		if (favoritesSeries[i] == toFav) {
			favNode.setAttribute('class', 'isFav');
			isFav = true;
			break;
		}
	}

	if (!isFav) {
		favNode.setAttribute('class', 'noFav');
	}

	favNode.addEventListener("click", favClick);

	//Construct the row
	tableRow.appendChild(indexNode);
	tableRow.appendChild(nameNode);
	tableRow.appendChild(genreNode);
	tableRow.appendChild(favNode);

	//Focus object when mouse hover
	tableRow.addEventListener("mouseover", mouseOverRow);

	return tableRow;
}

var mouseOverRow = function () {
	var searchElem = document.getElementById('search');

	//Prevent focus when search-textarea has it
	if (searchElem !== document.activeElement) {
		this.focus();
	}
};

//On favorise click
var favClick = function (e) {
	var target = this;
	var favName = target.getAttribute('favId');
	if (target.getAttribute('class') == 'isFav') {
		removeFavorite(favName);
		target.setAttribute('class', 'noFav');
	} else {
		addFavorite(favName);
		target.setAttribute('class', 'isFav');
	}
};
