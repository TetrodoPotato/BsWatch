function addLock(seriesName, seasonName, episodNameGer, episodNameOri, genresName, hosterName, dataName) {
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

		// Add some data
		store.put({
			seriesName: seriesName,
			seasonName: seasonName,
			episodeNameGer: episodNameGer,
			episodeNameOri: episodNameOri,
			genresName: genresName,
			hosterName: hosterName,
			dataName: dataName
		});

		// Close the db when the transaction is done
		tx.oncomplete = function () {
			db.close();
			logReady();
		};
	}
}

function getLog() {
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

	var arrLogs;

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
				arrLogs = logs;
			}
		};

		// Close the db when the transaction is done
		tx.oncomplete = function () {
			db.close();
		};
	}
	while (arrLogs === null) {}

	return arrLogs();
}
