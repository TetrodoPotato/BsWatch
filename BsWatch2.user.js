// ==UserScript==
// @name		BsWatch - File 2
// @icon 		https://bs.to/opengraph.jpg
// @namespace   http://www.greasespot.net/
// @include     /^https:\/\/bs\.to\/serie-genre[^\/]*$/
// @version    	2.3
// @description	Series List
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/cookiecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/favoritecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/iconcontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/keycontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/init.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch2.user.js
// ==/UserScript==

//Init page
init();

function initPage(cp) {
    //Reset last connection
    setCookie('autoplay', false, false);
    removeCookie('lastSeries');
    removeCookie('lastSeason');
    removeCookie('lastEpisode');

    cp.appendChild(makeTable());
}

function makeTable() {
    var rowObj = searchSeriesNames();

    //create the series table
    var table = document.createElement('table');
    table.setAttribute('id', 'seriesTable');
    var tbody = document.createElement('tbody');

    tbody.appendChild(createHeadRow());

    var favStar = getFavStar();

    //Create the content of the table
    for (t = 0; t < rowObj.length; t++) {
        var node = createRow((t + 1), rowObj[t], favStar.cloneNode(true));
        tbody.appendChild(node);
    }
    table.appendChild(tbody);

    return table;
}

function searchSeriesNames() {
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

function createHeadRow() {
    var row = document.createElement('tr');
    row.setAttribute('id', 'headRow');

    var numNode = document.createElement('th');
    numNode.innerHTML = 'Nr';

    var serNode = document.createElement('th');
    serNode.innerHTML = 'Series';
    serNode.setAttribute('onclick', "window.location = 'https://bs.to/serie-genre?title'");

    var genNode = document.createElement('th');
    genNode.innerHTML = 'Genre';
    genNode.setAttribute('onclick', "window.location = 'https://bs.to/serie-genre?genre'");

    var favNode = document.createElement('th');
    favNode.innerHTML = 'Fav';

    row.appendChild(numNode);
    row.appendChild(serNode);
    row.appendChild(genNode);
    row.appendChild(favNode);

    return row;
}

/**
 * Returns only the favorite-ids in an array
 * @return {String-Array} favorite-ids
 */
function getOldFavs() {
    var newFav = getFavs();
    var oldFav = [];
    for (let i = 0; i < newFav.length; i++) {
        oldFav[oldFav.length] = newFav[i].id;
    }
    return oldFav;
}

//For performance
var favoritesSeries = getOldFavs();

function createRow(index, rowObj, favStar) {
    var tableRow = document.createElement('tr');

    //The link to the Series
    var seriesLinkTo = 'https://bs.to/' + rowObj.linkTo;

    //On click change dir
    var clickFunc = 'window.location = \'' + seriesLinkTo + '\'';
    tableRow.setAttribute("tabindex", -1);
    tableRow.setAttribute("id", index);
    tableRow.setAttribute("class", seriesLinkTo);

    //Node with the index in it
    var indexNode = document.createElement('td');
    indexNode.innerHTML = index;

    //Node with the name in it
    var nameNode = document.createElement('td');
    nameNode.innerHTML = rowObj.title;

    var genreNode = document.createElement('td');
    genreNode.innerHTML = rowObj.genreName;

    //Favorite Node set/rem-favorite
    var favNode = document.createElement('td');
    var toFav = rowObj.linkTo.split('/')[1];
    favNode.setAttribute("favid", toFav);
    favNode.appendChild(favStar);

    if (favoritesSeries.indexOf(toFav) > -1) {
        favNode.setAttribute('class', 'isFav');
    } else {
        favNode.setAttribute('class', 'noFav');
    }

    //Construct the row
    tableRow.appendChild(indexNode);
    tableRow.appendChild(nameNode);
    tableRow.appendChild(genreNode);
    tableRow.appendChild(favNode);

    return tableRow;
}

//init row-events
function afterInit() {
    $("#seriesTable tr").click(function () {
        var className = $(this).attr('class');
        if (className !== undefined) {
            window.location = className;
        }
    });

    $("#seriesTable tr").mouseover(function () {
        var searchElem = document.getElementById('search');

        //Prevent focus when search-textarea has it
        if (searchElem !== document.activeElement) {
            $(this).focus();
        }
    });

    $("#seriesTable tr td:last-child").click(function (e) {
        e.stopPropagation();

        var targetDom = e.target;
        var targetParent = targetDom.parentElement;
        while (targetParent.nodeName != 'TR') {
            targetParent = targetParent.parentElement;
        }

        var pathName = targetParent.getAttribute('class');
        pathName = pathName.split('https://bs.to')[1];

        var seriesName = targetParent.getElementsByTagName('td')[1].innerHTML;

        if ($(this).attr('class') == 'isFav') {
            pathName = pathName.split('/')[2];
            console.log(pathName);
            removeFavorite(pathName, true)
            $(this).attr('class', 'noFav');
        } else {
            addFavorite(pathName, seriesName)
            $(this).attr('class', 'isFav');
        }
    });

    var lastSearch = getDefault(getCookie('seriesSearch'), '');
    if (lastSearch != "" && lastSearch.indexOf('>') == -1) {
        document.getElementById('search').value = getCookie('seriesSearch');
        searchEv();
    }

    setInterval(function () {
        setCookie('seriesSearch', document.getElementById('search').value, false);
    }, 1000)

    if (getDefault(getCookie('focusSearch'), false)) {
        document.getElementById('search').focus()
    }
}
