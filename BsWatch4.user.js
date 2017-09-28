// ==UserScript==
// @name        BsWatch - File 4
// @icon 		https://bs.to/opengraph.jpg
// @namespace   http://www.greasespot.net/
// @include     /^https:\/\/bs\.to\/serie\/[^\/]+\/\d+\/[^\/\:]+$/
// @version    	1.5
// @description	Select Hoster
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/cookiecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/favoritecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/iconcontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/keycontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/init.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch4.user.js
// ==/UserScript==

//Init page
init();

function initPage(cp) {
    //Hoster Sort
    var hosterSort = getDefault(getCookie('cookieSort'), "Vivo|OpenLoadHD|OpenLoad").split('|');

    var hoster = getHoster();

    var errorCode = getErrorCode();

    //Set cookies for next episode
    setGlobalVars();

    for (i = 0; i < hosterSort.length; i++) {
        if ($.inArray(hosterSort[i], hoster) != -1 && errorCode - 1 < i) {
            window.location = window.location.href + '/' + hosterSort[i];
            return;
        }
    }

    //Make a hoster page
    makePage(hoster, cp);
}

function getHoster() {
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

    return hoster;
}

function getErrorCode() {
    //Set the errorcode if it wasn't
    var errorCode = getCookie('errorCode');
    if (typeof errorCode === 'undefined') {
        setCookie('errorCode', 0, false);
        errorCode = 0;
    } else {
        var urlSrc = window.location.pathname;
        var sameEpisode = urlSrc.split('/')[4];
        if (sameEpisode != getCookie('lastEpisode')) {
            //Reset errorcode if it isn't the same episode
            setCookie('errorCode', 0, false);
            errorCode = 0;
        }
    }

    return errorCode;
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

function getHosterTable(hoster) {
    var hosterTable = document.createElement('table');
    hosterTable.setAttribute('id', 'hosterTable');
    var hosterTbody = document.createElement('tbody');

    //Create table rows
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

        //On hover set tr focus
        tr.addEventListener("mouseover", function () {
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

function makePage(hoster, cp) {
    cp.appendChild(getTitle());
    cp.appendChild(getHosterTable(hoster));
    cp.appendChild(getFunctionButtons());
}

//Set global variables for the browser tab
function setGlobalVars() {
    var urlSrc = window.location.pathname;

    setCookie('lastSeries', urlSrc.split('/')[2], false);
    setCookie('lastSeason', urlSrc.split('/')[3], false);
    setCookie('lastEpisode', urlSrc.split('/')[4], false);

    //Perma cookies for 'Weiter schauen' button
    setCookie('lastSeriesPerm', urlSrc.split('/')[2], true);
    setCookie('lastSeasonPerm', urlSrc.split('/')[3], true);
    setCookie('lastEpisodePerm', urlSrc.split('/')[4], true);
}
