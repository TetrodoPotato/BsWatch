/**
 * Add a Log-segment to the log. Uses Local Storage.
 */
function addLog(seriesName, seasonName, episodNameGer, episodNameOri, genresName, hosterName, dateName) {

    var first = dateName.split(' ')[0].split(',');
    var secon = dateName.split(' ')[1].split(':');

    var index = first[2] + first[1] + first[0] + secon[0] + secon[1] + secon[2];

    var addString = seriesName + "|" + seasonName + "|" + episodNameGer + "|" + episodNameOri + "|" + genresName + "|" + hosterName + "|" + dateName + "|" + index;

    var logData = getRawLog();

    logData.push(addString);
    logData = clearLog(logData);

    localStorage.setItem('log', JSON.stringify(logData));
}

/**
 * Get the Raw Log Array.
 * @return {String-Array} the logs.
 */
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

/**
 * Get the log-sement Object.
 * @return {Object} log-segment.
 */
function getLog() {
    var logData = getRawLog();

    var logObj = [];
    for (i = 0; i < logData.length; i++) {
        var buf = logData[i].split('|');

        bufObj = {
            seriesName: buf[0],
            seasonName: buf[1],
            episodeNameGer: buf[2],
            episodeNameOri: buf[3],
            genresName: buf[4],
            hosterName: buf[5],
            dataName: buf[6],
            id: buf[7]
        }

        logObj[logObj.length] = bufObj;
    }

    return logObj;
}

/**
 * Removes an log-segment with given index.
 */
function removeLog(index) {
    var raw = getRawLog();
    var newRaw = [];
    for (i = 0; i < raw.length; i++) {
        if (raw[i].split('|')[7] != index) {
            newRaw[newRaw.length] = raw[i];
        }
    }

    localStorage.setItem('log', JSON.stringify(newRaw));
}

/**
 * Removes log-segments older than one month.
 */
function clearLog(logData) {
    //Get DateName
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    dateNum = parseInt("" + year + month + day);
    dateNum *= 1000000;

    //20170806
    var bufArr = [];
    for (i = 0; i < logData.length; i++) {
        var logDate = parseInt(logData[i].split('|')[7]);

        if ((dateNum - logDate) < 100 * 1000000) {
            bufArr[bufArr.length] = logData[i];
        }
    }

    return bufArr;
}
