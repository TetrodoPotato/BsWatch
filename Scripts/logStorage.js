function addLog(seriesName, seasonName, episodNameGer, episodNameOri, genresName, hosterName, dateName) {
	var addString = seriesName + "|" + seasonName + "|" + episodNameGer + "|" + episodNameOri + "|" + genresName + "|" + hosterName + "|" + dataName;

	var logData = getRawLog();
	logData.push(addString);

	logData = clearLog(logData);

	localStorage.setItem('log', JSON.stringify(logData));
}

function getRawLog() {
	var log = localStorage.getItem('log');
	if (!log) {
		log = [];
		localStorage.setItem('log', JSON.stringify(log));
	} else {
		log = JSON.parse(log);
	}
	return log;
}

function getLog() {
	var logData = getRawLog();

	var logObj = [];
	for (i = 0; i < logData.length; i++) {
		var buf = logData[i].split('|');

		bufObj = {
			series: buf[0],
			season: buf[1],
			epiGer: buf[2],
			epiOri: buf[3],
			genre: buf[4],
			hoster: buf[5],
			date: buf[6]
		}

		logObj[logObj.length] = bufObj;
	}

	return logObj;
}

function clearLog(logData) {
	//Get DateName
	var d = new Date();
	var day = d.getDate();
	var month = d.getMonth() + 1;
	var year = d.getFullYear();

	day = day < 10 ? '0' + day : day;
	month = month < 10 ? '0' + month : month;

	dateNum = parseInt("" + year + month + day);

	//20170806
	var bufArr = [];
	for (i = 0; i < logData.length; i++) {
		var logDate = logData.split('|')[6];
		var buf = logDate.split(' ').split(',');
		buf = parseInt(buf[2] + buf[1] + buf[0]);

		if ((dateNum - buf) < 100) {
			bufArr[bufArr.length] = logData[i];
		}
	}

	return bufArr;
}
