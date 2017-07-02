// ==UserScript==
// @name        BsWatch - File 10
// @icon 		https://bs.to/opengraph.jpg
// @namespace   http://www.greasespot.net/
// @include     https://bs.to/log
// @version    	1
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

	//Construct body
	bodyObject.appendChild(menuobject);

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
				makeTable(logs);
			}
		};

		// Close the db when the transaction is done
		tx.oncomplete = function () {
			db.close();
		};
	}
}

function makeTable(logs) {
	var table = document.createElement('table');
	table.setAttribute('id','episodeTable');

	for (i = 0; i < logs.length; i++) {
		var tr = document.createElement('tr');
		
		var td = document.createElement('td');
		td.innerHTML = logs[i].id;
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
		td8.appendChild(getCross());
		tr.appendChild(td8);
		
		table.appendChild(tr);
	}
	
	document.body.appendChild(table);
}


















