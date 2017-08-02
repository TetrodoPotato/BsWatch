// ==UserScript==
// @name        BsWatch - File 9
// @icon 		https://bs.to/opengraph.jpg
// @namespace   http://www.greasespot.net/
// @include     https://bs.to/log
// @include     https://bs.to/log?data
// @include     https://bs.to/log?info
// @version    	1.9
// @description	Log Page
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/cookiecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/favoritecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/menucontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/defaultcontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/logStorage.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/init.js
// @require		http://rubaxa.github.io/Sortable/Sortable.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch9.user.js
// ==/UserScript==

//Init page
init();

function initPage(cp) {
	makeLog(getLog(), cp);
}

function makeTable(logs) {

	var headLine = "<tr>" +
		"	<th>Nr</th>" +
		"	<th>Serie</th>" +
		"	<th>Stf.</th>" +
		"	<th>Epi. Deu.</th>" +
		"	<th>Epi. Org.</th>" +
		"	<th>Genres</th>" +
		"	<th>Hoster</th>" +
		"	<th>Datum</th>" +
		"	<th>Del.</th>" +
		"</tr>";

	var table = document.createElement('table');
	table.setAttribute('id', 'logTable');

	table.innerHTML = headLine;

	for (i = 0; i < logs.length; i++) {
		var tr = document.createElement('tr');

		var td = document.createElement('td');
		td.innerHTML = i + 1;
		tr.appendChild(td);

		var td1 = document.createElement('td');
		td1.innerHTML = logs[i].seriesName;
		tr.appendChild(td1);

		var td2 = document.createElement('td');
		td2.innerHTML = logs[i].seasonName;
		tr.appendChild(td2);

		var td3 = document.createElement('td');
		td3.innerHTML = logs[i].episodeNameGer;
		tr.appendChild(td3);

		var td4 = document.createElement('td');
		td4.innerHTML = logs[i].episodeNameOri;
		tr.appendChild(td4);

		var td5 = document.createElement('td');
		td5.innerHTML = logs[i].genresName;
		tr.appendChild(td5);

		var td6 = document.createElement('td');
		td6.innerHTML = logs[i].hosterName;
		tr.appendChild(td6);

		var td7 = document.createElement('td');
		td7.innerHTML = logs[i].dataName;
		tr.appendChild(td7);

		var td8 = document.createElement('td');
		td8.setAttribute('id', logs[i].id);
		td8.appendChild(getCross());
		td8.addEventListener('click', function (e) {
			var target = this.getAttribute('id');

			deleteLog(parseInt(target));
		}, false);
		tr.appendChild(td8);

		table.appendChild(tr);
	}

	return table;
}

function deleteLog(id) {
	console.log(id);

	removeLog(id);

	refreshContent();

}

function refreshContent() {
	var cp = document.getElementById('contentContainer');
	cp.innerHTML = "";
	makeLog(getLog(), cp);
}

function makeLog(logs, cp) {
	var urlPath = window.location.href;
	urlPath = urlPath.split('?');
	if (urlPath.length != 1) {
		if (urlPath[1] == 'info') {
			cp.appendChild(makeInfo(logs, cp));
		} else if (urlPath[1] == 'data') {
			makeConf(cp);
		}
	} else {
		cp.appendChild(makeTable(logs));
	}

	cp.appendChild(createButtons());
}

function createButtons() {
	var tab = document.createElement('table');
	tab.setAttribute('id', 'logButton');

	var tr = document.createElement('tr');

	var log = document.createElement('td');
	var logClick = 'window.location = \'' + "https://bs.to/log" + '\'';
	log.setAttribute('onclick', logClick);
	log.innerHTML = 'Log';

	var info = document.createElement('td');
	var infoClick = 'window.location = \'' + "https://bs.to/log?info" + '\'';
	info.setAttribute('onclick', infoClick);
	info.innerHTML = 'Info';

	var data = document.createElement('td');
	var dataClick = 'window.location = \'' + "https://bs.to/log?data" + '\'';
	data.setAttribute('onclick', dataClick);
	data.innerHTML = 'Data';

	tr.appendChild(log);
	tr.appendChild(info);
	tr.appendChild(data);

	tab.appendChild(tr);

	return tab;
}

function makeInfo(logs) {
	var cont = document.createElement('table');
	cont.setAttribute('id', 'info');

	cont.innerHTML += '<tr><td>Geschaute Folgen:</td><td>' + logs.length + '</td>';

	//Most watched Genre
	var genres = [];
	for (i = 0; i < logs.length; i++) {
		var gen = logs[i].genresName;
		gen = gen.split(' ');
		for (x = 0; x < gen.length; x++) {
			if (gen[x].length !== 0 || gen[x]) {
				genres[genres.length] = gen[x];
			}
		}
	}

	if (genres.length !== 0) {
		cont.innerHTML += '<tr><td>Meist geschautes Genre:</td><td>' + mode(genres) + '</td>';
	} else {
		cont.innerHTML += '<tr><td>Meist geschautes Genre:</td><td>none</td>';
	}

	//Most watched on -
	var date = [];
	for (i = 0; i < logs.length; i++) {
		var dat = logs[i].dataName;
		dat = dat.split(' ')[0];
		date[date.length] = dat;
	}

	if (date.length !== 0) {
		cont.innerHTML += '<tr><td>Am meisten geschaut am:</td><td>' + mode(date) + '</td>';
	} else {
		cont.innerHTML += '<tr><td>Am meisten geschaut am:</td><td>none</td>';
	}

	//Most watched Series

	var date = [];
	for (i = 0; i < logs.length; i++) {
		date[date.length] = logs[i].seriesName;
	}

	if (date.length !== 0) {
		cont.innerHTML += '<tr><td>Am meisten geschaute Serie:</td><td>' + mode(date) + '</td>';
	} else {
		cont.innerHTML += '<tr><td>Am meisten geschaute Serie:</td><td>none</td>';
	}

	return cont;
}

function mode(array) {
	if (array.length == 0)
		return null;
	var modeMap = {};
	var maxEl = array[0],
	maxCount = 1;
	for (var i = 0; i < array.length; i++) {
		var el = array[i];
		if (modeMap[el] == null)
			modeMap[el] = 1;
		else
			modeMap[el]++;
		if (modeMap[el] > maxCount) {
			maxEl = el;
			maxCount = modeMap[el];
		}
	}
	return maxEl;
}

function makeConf(cp) {
	//Hoster Sort
	var hosterSort = getCookie('cookieSort');
	if (hosterSort != undefined) {
		hosterSort = hosterSort.split('|');
	} else {
		hosterSort = ["Vivo", "OpenLoadHD", "OpenLoad"];
	}

	var contPane = document.createElement('div');
	contPane.setAttribute('id', 'contpane');

	var titleSet = document.createElement('h1');
	titleSet.innerHTML = 'Hoster Priorität';
	contPane.appendChild(titleSet);

	var listSet = document.createElement('ul');
	listSet.setAttribute('id', 'hosterSort');

	for (i = 0; i < hosterSort.length; i++) {
		var li = document.createElement('li');
		li.innerHTML = hosterSort[i]

			listSet.appendChild(li);
	}
	contPane.appendChild(listSet);

	cp.appendChild(contPane);

	var applyButton = document.createElement('button');
	applyButton.innerHTML = "Anwenden";
	applyButton.addEventListener('click', function () {
		var prios = document.getElementById('hosterSort').getElementsByTagName('li');
		var cook = "";
		for (i = 0; i < prios.length; i++) {
			if (i < prios.length - 1) {
				cook += prios[i].innerHTML + '|';
			} else {
				cook += prios[i].innerHTML;
			}

		}

		setCookie('cookieSort', cook, true);
	});

	cp.appendChild(applyButton);
}

function afterInit() {
	var urlPath = window.location.href;
	urlPath = urlPath.split('?');
	if (urlPath.length != 1) {
		if (urlPath[1] == 'data') {
			var el = document.getElementById('hosterSort');
			var sortable = Sortable.create(el);
		}
	}
}
