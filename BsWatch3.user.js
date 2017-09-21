// ==UserScript==
// @name        BsWatch - File 3
// @icon 		https://bs.to/opengraph.jpg
// @namespace   http://www.greasespot.net/
// @include     /^https:\/\/bs\.to\/serie\/[^\/]+(\/(\d+(\/((unwatch:|watch:)(\d+|all)(\/)?)?)?)?)?$/
// @version    	1.3
// @description	Episode List
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/cookiecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/favoritecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/iconcontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/keycontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/init.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch3.user.js
// ==/UserScript==

//Init page
init();

function initPage(cp) {
    makeThePage(cp);
}

function makeTitle() {
    //Get The Title
    var title = document.getElementById('sp_left');
    title = title.getElementsByTagName('h2')[0];

    return title;
}

function makeSeasonTable() {
    //Construct a season table
    var seriesTable = document.createElement('table');
    seriesTable.setAttribute('id', 'seasonTable');
    var seriesTableTbody = document.createElement('tbody');
    var seriesTableRow = document.createElement('tr');

    var info = getSeasonInformation();

    for (i = 0; i < info.length; i++) {
        seriesTableRow.appendChild(createSeasonNode(info[i].index, info[i].linkTo, info[i].onSeason));
    }
    //Just do it.
    seriesTableTbody.appendChild(seriesTableRow);
    seriesTable.appendChild(seriesTableTbody)

    return seriesTable;
}

function getSeasonInformation() {
    //Get the Seasons
    var seasonContainer = document.getElementById('seasons');
    seasonContainer = seasonContainer.getElementsByTagName('li');

    var info = [];
    for (i = 0; i < seasonContainer.length; i++) {
        var index = seasonContainer[i].getElementsByTagName('a')[0].innerHTML;
        var linkTo = seasonContainer[i].getElementsByTagName('a')[0].getAttribute('href');
        var onSeason = 0;
        if (seasonContainer[i].getAttribute('class') != null) {
            if (seasonContainer[i].getAttribute('class').indexOf('active') !== -1) {
                onSeason = 1;
            } else if (seasonContainer[i].getAttribute('class').indexOf('watched') !== -1) {
                onSeason = 2;
            }
        }

        var infoBlock = {
            index: index,
            linkTo: linkTo,
            onSeason: onSeason
        };

        info[info.length] = infoBlock;
    }
    return info;
}

function makeEpisodeTable() {
    var info = getEpisodeInfo();

    //create the episode table
    var table = document.createElement('table');
    table.setAttribute('id', 'episodeTable');
    var tbody = document.createElement('tbody');

    for (i = 0; i < info.length; i++) {
        //Create node and append it to the body
        var contentNode = createNode((i + 1), info[i].nameDE, info[i].nameOr, info[i].linkTo, info[i].watched, info[i].linkWatched);
        tbody.appendChild(contentNode);
    }

    table.appendChild(tbody);

    return table;
}

function getEpisodeInfo() {
    //Variables with all episode information
    var episodeNodes = document.getElementsByClassName('episodes')[0];
    episodeNodes = episodeNodes.getElementsByTagName('tr');

    var info = [];

    for (i = 0; i < episodeNodes.length; i++) {
        //createNode(index, nameDE, nameOr, linkTo, watched, linkWatched)
        var nameDE = episodeNodes[i].getElementsByTagName('strong');
        if (nameDE.length != 0) {
            nameDE = nameDE[0].innerHTML;
        } else {
            nameDE = "- ";
        }

        //Get the Original name
        var nameOr = episodeNodes[i].getElementsByTagName('i');
        if (nameOr.length != 0) {
            nameOr = nameOr[0].innerHTML;
        } else {
            nameOr = "";
        }

        //Get the direction
        var linkTo = episodeNodes[i].getElementsByTagName('a')[0];
        linkTo = linkTo.getAttribute('href');

        //Check if it is watched
        var watched = false;
        if (episodeNodes[i].getAttribute('class') == 'watched') {
            watched = true;
        }

        //When logged in this is the link to unwatch or watch this episode
        var linkWatched = "";
        if (isLoggedin) {
            linkWatched = episodeNodes[i].getElementsByClassName('icon')[0];
            linkWatched = linkWatched.getAttribute('href');
        }

        var infoBlock = {
            nameDE: nameDE,
            nameOr: nameOr,
            linkTo: linkTo,
            watched: watched,
            linkWatched: linkWatched
        };

        info[info.length] = infoBlock;
    }

    return info;
}

function makeWatchAllTable() {
    //Get the current seasonnumber
    var theUrl = window.location.pathname;
    var seasonNumber = 1;

    if (theUrl.includes('/unwatch')) {
        theUrl = theUrl.split('/unwatch')[0];
    } else if (theUrl.includes('/watch')) {
        theUrl = theUrl.split('/watch')[0];
    }

    if (theUrl.split('/').length != 3) {
        seasonNumber = parseInt(theUrl.split('/')[3]);

    } else {
        theUrl = theUrl + '/' + 1;
    }

    //Make a watch/unwatch all Table
    var watchUnwatchTable = document.createElement('table');
    watchUnwatchTable.setAttribute('id', 'allWatchTable');
    var watchUnwatchTbody = document.createElement('tbody');
    var watchUnwatchtr = document.createElement('tr');

    //nice and now .. hmm .. use the hand
    var firstFunc = 'window.location = \'https://bs.to' + theUrl + '/' + 'watch:all' + '\'';
    var firstTd = document.createElement('td');
    firstTd.innerHTML = "Mark all as Watched";
    firstTd.setAttribute('onclick', firstFunc);

    //nice and now .. hmm .. use the second hand
    var secondFunc = 'window.location = \'https://bs.to' + theUrl + '/' + 'unwatch:all' + '\'';
    var secondTd = document.createElement('td');
    secondTd.innerHTML = "Mark all as Unwatched";
    secondTd.setAttribute('onclick', secondFunc);

    watchUnwatchtr.appendChild(firstTd);
    watchUnwatchtr.appendChild(secondTd);

    watchUnwatchTbody.appendChild(watchUnwatchtr);
    watchUnwatchTable.appendChild(watchUnwatchTbody);

    return watchUnwatchTable
}

function makeThePage(cp) {
    //Make the new page

    //Fill the body
    cp.appendChild(makeTitle());
    cp.appendChild(makeSeasonTable());
    cp.appendChild(makeEpisodeTable());

    if (isLoggedin) {
        cp.appendChild(makeWatchAllTable());
    }

}

function afterInit() {
    //Play the next episode instant on season change
    if (getCookie('lastEpisode') == 'next0x000001') {
        playNextEpisode();
    }

    //Check if there was a last episode
    if (typeof getCookie('lastEpisode') == 'string') {
        //Check if this is the same series
        //Name of this series
        var thisSeries = window.location.pathname.split('/')[2];
        if (getCookie('lastSeries') == thisSeries) {
            //Check if autoplay is on
            if (getCookie('autoplay') == true) {
                if (getCookie('lastEpisode') != 'next0x000001') {
                    nextWindow(5);
                }
            } else {
                setCookie('autoplay', false, false);

                removeCookie('lastSeries');
                removeCookie('lastSeason');
                removeCookie('lastEpisode');
            }
        } else {
            //Reset everything
            setCookie('autoplay', false, false);

            removeCookie('lastSeries');
            removeCookie('lastSeason');
            removeCookie('lastEpisode');
        }
    }

    //Focus object when mouse hover
    $("#seasonTable").on("mouseover", "td", function () {
        var searchElem = document.getElementById('search');

        if (searchElem !== document.activeElement) {
            this.focus();
        }
    });
}

function createNode(index, nameDE, nameOr, linkTo, watched, linkWatched) {
    //Make a table row that links to the Series
    var tableRow = document.createElement('tr');

    //The link to the Series
    linkTo = 'https://bs.to/' + linkTo;
    //On click change dir
    var clickFunc = 'window.location = \'' + linkTo + '\'';

    tableRow.setAttribute('tabindex', -1);
    tableRow.setAttribute('id', index);
    if (watched) {
        tableRow.setAttribute('class', 'watched');
    }

    //Node with the index in it
    var indexNode = document.createElement('td');
    indexNode.setAttribute('onclick', clickFunc);
    indexNode.innerHTML = index;

    //Node with the name in it
    var nameNode = document.createElement('td');
    nameNode.setAttribute('onclick', clickFunc);
    nameNode.innerHTML = '<strong>' + nameDE + '</strong><i>' + nameOr + '</i>';

    //Construct the row
    tableRow.appendChild(indexNode);
    tableRow.appendChild(nameNode);

    if (isLoggedin) {
        var watchUnwatch = document.createElement('td');
        watchUnwatch.setAttribute('class', 'watchUnwatch');

        //The link to the Episode watchmark
        linkToWatch = 'https://bs.to/' + linkWatched;
        //On click change dir
        var clickFuncWatch = 'window.location = \'' + linkToWatch + '\'';
        watchUnwatch.setAttribute('onclick', clickFuncWatch);

        var watchIcon;
        if (watched) {
            watchIcon = getWatchIcon();
        } else {
            watchIcon = getUnwatchIcon();
        }

        watchUnwatch.appendChild(watchIcon);

        tableRow.appendChild(watchUnwatch);
    }

    //Focus object when mouse hover
    tableRow.addEventListener("mouseover", function () {
        var searchElem = document.getElementById('search');

        if (searchElem !== document.activeElement) {
            this.focus();
        }
    });

    return tableRow;
}

function createSeasonNode(index, linkTo, onSeason) {
    var tdNode = document.createElement('td');
    tdNode.innerHTML = index;

    //The link to the Series
    linkTo = 'https://bs.to/' + linkTo;

    //On click change dir
    var clickFunc = 'window.location = \'' + linkTo + '\'';
    tdNode.setAttribute('onclick', clickFunc);
    tdNode.setAttribute('tabindex', -1);

    if (onSeason == 1) {
        tdNode.setAttribute('class', 'onSeason');
    } else if (onSeason == 2) {
        tdNode.setAttribute('class', 'watched');
    }

    //Focus object when mouse hover
    tdNode.addEventListener("mouseover", function () {
        var searchElem = document.getElementById('search');

        if (searchElem !== document.activeElement) {
            this.focus();
        }
    });

    return tdNode;
}

function onError() {
    //Reload page
    if (playNextEpisode() == false) {
        window.location = window.location.href;
    }
}

function playNextEpisode() {

    //Dom array with elements that contains a episode link
    var domArr = document.getElementById('episodeTable');

    if (domArr == null) {
        setTimeout(onError, 10000);
        return false;
    }

    domArr = domArr.getElementsByTagName('tr');

    //Dom array with the first td-tag-href in the domArr index
    var linkArr = [];
    for (i = 0; i < domArr.length; i++) {
        var tdTag = domArr[i].getElementsByTagName('td')[0];
        var linkFunction = tdTag.getAttribute('onclick');
        linkFunction = linkFunction.replace('window.location = \'https://bs.to/', '');
        linkFunction = linkFunction.replace('\'', '');
        linkArr[linkArr.length] = linkFunction;
    }

    if (getCookie('lastEpisode') == 'next0x000001') {
        window.location = 'https://bs.to/' + linkArr[0];
    }

    //Find next episode
    for (i = 0; i < linkArr.length; i++) {
        var linkEpisode = linkArr[i].split('/')[3];
        //Find the last watched Episode
        if (linkEpisode == getCookie('lastEpisode')) {
            //The next index of the episode "i + 1"
            if ((i + 1) < linkArr.length) {
                window.location = 'https://bs.to/' + linkArr[i + 1];
                return true;
            } else {
                //When the next episode is not in this season
                setCookie('lastEpisode', 'next0x000001', false);
                if (!openNextSeasonUser(1)) {
                    setCookie('autoplay', false, false);

                    removeCookie('lastSeries');
                    removeCookie('lastSeason');
                    removeCookie('lastEpisode');
                    return true;
                }
                return false;
            }
        }
    }

}

function openNextSeasonUser(seasonAmount) {
    //You know
    var allSeasons = document.getElementById('seasonTable');
    allSeasons = allSeasons.getElementsByTagName('td');

    var hasNext = false;

    //Search current season
    for (i = 0; i < allSeasons.length; i++) {
        if (allSeasons[i].getAttribute('class') == 'onSeason') {

            //Check if there is the next/previous season
            if ((i + seasonAmount) < allSeasons.length) {
                if ((i + seasonAmount) > -1) {
                    //Simply click it and boom ..
                    //the fucking next Season
                    allSeasons[i + seasonAmount].click();
                    hasNext = true;
                }
            }
        }
    }

    return hasNext;
}

function nextEpisodeText() {
    var lastSeasonNumb = getCookie('lastSeason');
    var lastEpisodeNumb = getCookie('lastEpisode').split('-')[0];

    var seriesListArr = document.getElementById('episodeTable').getElementsByTagName('tr');

    if (seriesListArr.length <= lastEpisodeNumb) {
        //Check next Season
        var curSeason = document.getElementsByClassName('onSeason')[0];

        if (!hasNextSeason()) {
            return true;
        }

        //Doesn't show when no more seasons
        if (curSeason == 'Specials') {
            return 'Staffel 1';
        } else {
            var nextNumber = parseInt(curSeason.innerHTML);
            nextNumber++;

            return 'Staffel ' + nextNumber;
        }
    } else {
        //Check next Episode
        var nextEpiNum = parseInt(lastEpisodeNumb) + 1;
        var thisSeasonString = (lastSeasonNumb == 0) ? "Specials" : "Staffel " + lastSeasonNumb;

        return nextEpiNum + '/' + seriesListArr.length + ' - ' + thisSeasonString;
    }

}

function hasNextSeason() {
    //You know
    var allSeasons = document.getElementById('seasonTable');
    allSeasons = allSeasons.getElementsByTagName('td');

    var hasNext = false;

    //Search current season
    for (i = 0; i < allSeasons.length; i++) {
        if (allSeasons[i].getAttribute('class') == 'onSeason') {

            //Check if there is the next/previous season
            if ((i + 1) < allSeasons.length) {
                if ((i + 1) > -1) {
                    //the fucking next Season
                    hasNext = true;
                }
            }
        }
    }

    return hasNext;
}

//Massive shit for autoplay interrupt
var nextTime = 0;
var nextBreak = false;
var nextText;

function nextWindow(time) {
    nextTime = time;
    nextBreak = false;

    //The styles that get loaded before the actual styles get loaded
    var styleTag = document.createElement('style');
    styleTag.innerHTML = '* {margin:0;padding:0;font-family: Arial, Helvetica, sans-serif;font-size:16px;}' +
        '#plane { z-index:999; position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8);}' +
        '#nextBody {overflow:hidden; border-radius:5px; position:absolute; z-index:1000; height:120px; width:200px; background:#161616; left:0; right:0; top:0; bottom:0; margin:auto;}' +
        '#texts{width:100%; margin:13px auto; color:#FFF; text-align:center; font-size:18px; font-weight:bold;}' +
        '#texts span{font-size:10px; font-style: italic;}' +
        '#nextButton {border:none; color:#ee4d2e; font-weight:bold; background-color:#161616; height:50px; width:100%;}' +
        '#nextButton:hover{background-color:#202020;} #nextButton:active{background-color:#000;}';

    //The window levels
    var plane = document.createElement('div');
    var bodys = document.createElement('div');
    var texts = document.createElement('div');
    var butto = document.createElement('button');

    plane.setAttribute('id', 'plane');
    bodys.setAttribute('id', 'nextBody');
    texts.setAttribute('id', 'texts');

    nextText = nextEpisodeText();

    if (nextText == true) {
        return false;
    }

    texts.innerHTML = 'Nächste Folge in ' + time + 's <br><span>' + nextText + '</span>';

    //Button on click interrupt autoplay
    butto.setAttribute("id", "nextButton");
    butto.innerHTML = "Cancel";
    butto.addEventListener("click", function () {
        setNextBreak();
    });

    //Construct plane
    plane.appendChild(bodys);
    plane.appendChild(styleTag);
    bodys.appendChild(texts);
    bodys.appendChild(butto);
    document.documentElement.appendChild(plane);

    //Start Timer ugly but work work
    for (i = 1; i < time + 1; i++) {
        setTimeout(checkTimeNextWindow, 1000 * i)
    }
}

function setNextBreak() {
    nextBreak = true;

    //Close window
    closeNextBreak();

    document.getElementById('auto').checked = false;

    //Autoplay = false;
    setCookie('autoplay', false, false);

    //Remove last watched episode
    removeCookie('lastSeries');
    removeCookie('lastSeason');
    removeCookie('lastEpisode');
}

function checkTimeNextWindow() {
    //Timer
    nextTime--;

    //Update Text time
    var texts = document.getElementById('texts');
    if (texts !== null) {
        texts.innerHTML = 'Nächste Folge in ' + nextTime + 's <br><span>' + nextText + '</span>';
    }

    //If the time is over and the window was not interrupted
    if (nextTime <= 0 && !nextBreak) {
        if (!playNextEpisode()) {
            closeNextBreak();
        }
    }
}

function closeNextBreak() {
    //Remove window
    $('#plane').remove();
    document.documentElement.style.overflow = 'auto'; // firefox, chrome fuck ie
}
