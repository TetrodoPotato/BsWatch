// ==UserScript==
// @name        BsWatch - File 5
// @icon 		https://bs.to/opengraph.jpg
// @namespace   http://www.greasespot.net/
// @include     /^https:\/\/bs\.to\/serie\/[^\/]+\/\d+\/[^\/]+\/.+$/
// @version    	2.7
// @description	Open Hoster
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/cookiecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/favoritecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/iconcontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/keycontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/logStorage.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/init.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch5.user.js
// ==/UserScript==

//Init page
init();

function initPage(cp) {

    if (getCookie('updateSeason') != false) {
        updateFavoritesSeason()
    }

    //Check log
    if (getCookie('enableLog') != false) {
        var get = log(cp);
    } else {
        logReady(cp);
    }

}

function logReady(cp) {
    //Check hostername
    var urlPath = window.location.pathname;

    var nextDirElement = document.getElementsByClassName('hoster-player')[0];
    var nextDirPath = nextDirElement.getAttribute('href');

    //When supportet hoster
    if (urlPath.split('/')[5] == 'Vivo' ||
        urlPath.split('/')[5] == 'OpenLoad' ||
        urlPath.split('/')[5] == 'OpenLoadHD') {

        //Crossdomain variables
        var setNextLink = setCrossDomainVariables(nextDirPath);

        //Open the hoster
        window.location = setNextLink;
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
        makePage(hoster, nextDirPath, cp);
    }
}

function setCrossDomainVariables(nextPath) {
    var as = document.getElementById('episodes');
    as = as.getElementsByTagName('a');

    var maxVal = '/' + as[as.length - 1].innerHTML;
    var curVal = window.location.pathname; // /serie/und-dann-noch-Paula/1/1-Fick-dich-Fremder-Mann/Vivo
    var curSes = "Season " + curVal.split('/')[3];
    curVal = curVal.split('/')[4].split('-')[0];
    maxVal = curVal + maxVal;

    var curSer = document.getElementById('sp_left').getElementsByTagName('h2')[0];
    curSer = curSer.innerHTML.split('<small>')[0].trim();

    var tit = document.getElementById('titleGerman');
    tit = tit.innerHTML.split('<small')[0].trim();

    if (tit == '' || tit == ' ' || tit == '  ') {
        tit = document.getElementById('titleEnglish').innerHTML.trim();
    }

    var redirLink = "https://bs.to/data?next=" + encodeURI(nextPath);

    redirLink += "?max=" + encodeURI(maxVal);
    redirLink += "?sea=" + encodeURI(curSes);
    redirLink += "?ser=" + encodeURI(curSer);
    redirLink += "?tit=" + encodeURI(tit);

    return redirLink;
}

function log(cp) {
    //[seriesName|seasonName|episodeName|genre1,genre2,...|hosterName|date]
    //Remove [],|
    var seriesName;
    var seasonName;
    var episodNameGer;
    var episodNameOri;
    var genresName;
    var hosterName;
    var dataName;

    //Get SeriesName
    var seriesDom = document.getElementById('sp_left').getElementsByTagName('h2')[0];
    seriesName = seriesDom.innerHTML.split('<small>')[0].trim();

    //Get SeasonName
    var urlName = window.location.pathname;
    seasonName = urlName.split('/')[3].trim();

    //Get EpisodeName
    var episodeDom = document.getElementById('titleGerman');
    var episodeEnglischDom = document.getElementById('titleEnglish');

    episodNameOri = episodeEnglischDom.innerHTML.trim();
    episodNameGer = episodeDom.innerHTML.split('<small')[0].trim();

    //Get Genres
    var genresArray = document.getElementsByClassName('infos')[0].getElementsByTagName('div');
    genresArray = genresArray[0].getElementsByTagName('p')[0].getElementsByTagName('span');

    genresName = "";
    for (i = 0; i < genresArray.length; i++) {
        genresName += genresArray[i].innerHTML.trim() + " ";
    }

    //Get Hostername
    hosterName = urlName.split('/')[5];

    //Get DateName
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var hour = d.getHours();
    var min = d.getMinutes();
    var sec = d.getSeconds();

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    hour = hour < 10 ? '0' + hour : hour;
    min = min < 10 ? '0' + min : min;
    sec = sec < 10 ? '0' + sec : sec;

    dataName = day + "," + month + "," + year + " " + hour + ":" + min + ":" + sec;

    var output = "[" + seriesName + " " + seasonName + " " + episodNameGer + "|" + episodNameOri;
    output += "(" + genresName + ")" + hosterName + " " + dataName + "]";
    console.log(output);

    addLog(seriesName, seasonName, episodNameGer, episodNameOri, genresName, hosterName, dataName);

    logReady(cp);
}

function getTitle() {
    //Get The Title
    var titleH = document.getElementById('sp_left');
    titleH = titleH.getElementsByTagName('h2')[0];

    //Get The Episode Title
    var titleE = document.getElementById('titleGerman');
    titleH.appendChild(titleE);

    return titleH;
}

function getFunctionButtons() {
    //Table for back and next
    var functionTable = document.createElement('table');
    functionTable.setAttribute('id', 'functionTable');
    var functionTbody = document.createElement('tbody');
    var functionTr = document.createElement('tr');

    var backButton = document.createElement('td');
    backButton.innerHTML = 'Zurück';
    backButton.setAttribute('id', 'backButton');
    backButton.addEventListener("click", function () {
        var lastSeries = getCookie('lastSeries');
        var lastSeason = getCookie('lastSeason');

        var backFunction = 'https://bs.to/serie/' + lastSeries + '/' + lastSeason;
        setCookie('autoplay', false, false);
        window.location = backFunction;

    });

    var nextButton = document.createElement('td');
    nextButton.innerHTML = 'Nexte Episode';

    var nextFunction = 'window.location = \'https://bs.to/?next\'';
    nextButton.setAttribute('onclick', nextFunction);

    functionTr.appendChild(backButton);
    functionTr.appendChild(nextButton);

    functionTbody.appendChild(functionTr);
    functionTable.appendChild(functionTbody);

    return functionTable;
}

function getHosterTable(hoster, bsout) {
    var hosterTable = document.createElement('table');
    hosterTable.setAttribute('id', 'hosterTable');
    var hosterTbody = document.createElement('tbody');

    //Construct Hostertable rows
    for (i = 0; i < hoster.length + 1; i++) {
        if (!(i < hoster.length)) {
            //Open hoster row
            var tr = document.createElement('tr');
            tr.setAttribute('class', 'playHosterTr');
            tr.setAttribute('id', (i + 1));
            tr.setAttribute('tabindex', -1);
            var playHosterTd = document.createElement('td');
            playHosterTd.setAttribute('id', 'playHosterTd');
            //Link open in new Tab
            playHosterTd.innerHTML = '<a target="_blank" href="' + bsout + '">Open Selected Hoster</a>';
            tr.appendChild(playHosterTd);
        } else {
            var tr = document.createElement('tr');
            var td = document.createElement('td');

            //Open hoster on click
            var clickFunc = 'https://bs.to/serie/' + getCookie('lastSeries');
             + '/' +
            getCookie('lastSeason');
             + '/' + getCookie('lastEpisode');
             + '/' + hoster[i];
            clickFunc = 'window.location = \'' + clickFunc + '\'';

            //Click
            tr.setAttribute('onclick', clickFunc);
            tr.setAttribute('id', (i + 1));
            tr.setAttribute('tabindex', -1);
            td.innerHTML = hoster[i];

            tr.appendChild(td);
        }
        //Focus on mouseover if its not search
        tr.addEventListener('mouseover', function () {
            var searchElem = document.getElementById('search');

            if (searchElem !== document.activeElement) {
                this.focus();
            }
        });
        hosterTbody.appendChild(tr);
    }

    hosterTable.appendChild(hosterTbody);

    return hosterTable;
}

function makePage(hoster, bsout, cp) {
    cp.appendChild(getTitle());
    cp.appendChild(getHosterTable(hoster, bsout));
    cp.appendChild(getFunctionButtons());
}

function updateFavoritesSeason() {
    var tit = document.getElementById('sp_left');
    tit = tit.getElementsByTagName('h2')[0];
    tit = tit.innerHTML.split(tit.getElementsByTagName('small')[0].outerHTML)[0].trim();

    var found = false;
    var rawFav = getRawFav();
    for (let i = 0; i < rawFav.length; i++) {
        var buffer = rawFav[i].split('|');
        if (buffer[0] === tit) {
            console.log(buffer[0]);
            console.log(tit);
            found = true;
            break;
        }
    }

    if (found) {
        //Get the current url path
        var slicePath = window.location.pathname;

        var tit = document.getElementById('sp_left');
        tit = tit.getElementsByTagName('h2')[0];
        tit = tit.innerHTML.split(tit.getElementsByTagName('small')[0].outerHTML)[0];

        //Add the current series to favorites
        addFavorite(slicePath, tit, true);
    }

}
