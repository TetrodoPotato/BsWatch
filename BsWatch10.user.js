// ==UserScript==
// @name        BsWatch - File 10
// @icon 		https://bs.to/opengraph.jpg
// @namespace   http://www.greasespot.net/
// @include     https://bs.to/log
// @include     https://bs.to/log?data
// @include     https://bs.to/log?info
// @version    	1.1
// @description	Log Page
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/cookiecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/favoritecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/menucontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/defaultcontroll.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch10.user.js
// ==/UserScript==

//Black page over original
makeBlackPage();

//When document loaded
$(document).ready(function () {
	//Make a hoster page
	makePage();
	updateFavorites();

	//Delete blackP... because the stylesheed needs to be loaded
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

	//Content
	var content = document.createElement('div');
	content.setAttribute('id', 'content');

	//Construct body
	bodyObject.appendChild(menuobject);
	bodyObject.appendChild(content);

	//Add content
	document.head.innerHTML = headObject.innerHTML;
	document.body = bodyObject;

	makeDB();
}

function makeDB() {
	//Save in indexedDB
	var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

	var open = indexedDB.open("Log", 1);

	// Create the schema
	open.onupgradeneeded = function () {
		var db = open.result;
		var store = db.createObjectStore("logData", {
				keyPath: "id",
				autoIncrement: true
			});
		store.createIndex("seriesName", "seriesName", {
			unique: false
		});
		store.createIndex("seasonName", "seasonName", {
			unique: false
		});
		store.createIndex("episodeNameGer", "episodNameGer", {
			unique: false
		});
		store.createIndex("episodeNameOri", "episodNameOri", {
			unique: false
		});
		store.createIndex("genresName", "genresName", {
			unique: false
		});
		store.createIndex("hosterName", "hosterName", {
			unique: false
		});
		store.createIndex("dataName", "dataName", {
			unique: false
		});

		console.log("new");
	};

	open.onsuccess = function () {
		// Start a new transaction
		var db = open.result;
		var tx = db.transaction("logData", "readwrite");
		var store = tx.objectStore("logData");

		var logs = [];

		store.openCursor().onsuccess = function (event) {
			var cursor = event.target.result;
			if (cursor) {
				logs.push(cursor.value);
				cursor.continue();
			} else {
				makeLog(logs);
			}
		};

		// Close the db when the transaction is done
		tx.oncomplete = function () {
			db.close();
		};
	}
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

			//var targetId = target.getAttribute('id');
			console.log(target);
			deleteLog(parseInt(target));
		}, false);
		tr.appendChild(td8);

		table.appendChild(tr);
	}

	document.getElementById('content').appendChild(table);
}

function deleteLog(id) {
	console.log(id);
	var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

	var open = indexedDB.open("Log", 1);

	open.onsuccess = function () {
		// Start a new transaction
		var db = open.result;
		var tx = db.transaction("logData", "readwrite");
		var store = tx.objectStore("logData");

		var request = store.delete (parseInt(id));
		request.onsuccess = function (event) {
			// It's gone! ...
		};

		// Close the db when the transaction is done
		tx.oncomplete = function () {
			db.close();
			refreshContent();
		};
	}
}

function refreshContent() {
	document.getElementById('content').innerHTML = "";
	makeDB();
}

function makeLog(logs) {
	var urlPath = window.location.href;
	urlPath = urlPath.split('?');
	if (urlPath.length != 1) {
		if (urlPath[1] == 'info') {
			makeInfo(logs);
		}
	} else {
		makeTable(logs);
	}
	
	createButtons();
}

function createButtons(){
	var tab = document.createElement('table');
	tab.setAttribute('id','logButton');
	
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
	
	document.getElementById('content').appendChild(tab);
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
		for (x=0;x<gen.length;x++) {
			if (gen[x].length !== 0 || gen[x]) {
				genres[genres.length] = gen[x];
			}
		}
	}

	if(genres.length !== 0){
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

	if(date.length !== 0){
		cont.innerHTML += '<tr><td>Am meisten geschaut am:</td><td>' + mode(date) + '</td>';
	} else {
		cont.innerHTML += '<tr><td>Am meisten geschaut am:</td><td>none</td>';
	}
	
	//Most watched Series
	
	var date = [];
	for (i = 0; i < logs.length; i++) {
		date[date.length] = logs[i].seriesName;
	}

	if(date.length !== 0){
		cont.innerHTML += '<tr><td>Am meisten geschaute Serie:</td><td>' + mode(date) + '</td>';
	} else {
		cont.innerHTML += '<tr><td>Am meisten geschaute Serie:</td><td>none</td>';
	}
	
	document.getElementById('content').appendChild(cont);
}

function mode(array)
{
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}





















