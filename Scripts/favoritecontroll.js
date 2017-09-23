/**
 * Add a Fav-segment to the Fav. Uses Local Storage.
 */
function addFavorite(path, seriesName, dontUpdate) {
    
    var season = 1;
    var series = seriesName.trim();
    var seriesPath = 'SeriesPath';
    
    var pathPart = path.trim().split('/');
    var id = pathPart[2];
     
    if(pathPart.length == 3){
        seriesPath = "https://bs.to" + path + "/" + season;
    } else {
        season = parseInt(pathPart[3]);
        seriesPath = "https://bs.to/" + pathPart[1] + "/" + pathPart[2] + "/" + season;
    }

    var addString = series + "|" + season + "|" + seriesPath + "|" + id;

    var favData = getRawFav();

    var found = false;
    for(let i=0;i<favData.length;i++){
        var buffer = favData[i].split('|');
        if(buffer[0] === series){
            favData[i] = addString;
            found = true;
            break;
        }
    }
    
    if(!found){
        favData.push(addString);
        favData.sort();
    }
    
    localStorage.setItem('fav', JSON.stringify(favData));
    
    if (typeof dontUpdate === "undefined") {
        updateFavorites();
    }
    
}

/**
 * Get the Fav Log Array.
 * @return {String-Array} the Favorites.
 */
function getRawFav() {
    var fav = localStorage.getItem('fav');
    if (!fav) {
        fav = [];
        localStorage.setItem('fav', JSON.stringify(fav));
    } else {
        fav = JSON.parse(fav);
    }
    return fav;
}

/**
 * Get the Fav-sement Object.
 * @return {Object} Fav-segment.
 */
function getFavs() {
    var favData = getRawFav();

    var favObj = [];
    for (i = 0; i < favData.length; i++) {
        var buf = favData[i].split('|');

        bufObj = {
            series: buf[0],
            season: buf[1],
            seriesPath: buf[2],
            id: buf[3]
        }

        favObj[favObj.length] = bufObj;
    }

    return favObj;
}

/**
 * Removes an log-segment with given index.
 */
function removeFavorite(id,inTable) {
    var raw = getRawFav();
    var newRaw = [];
    for (i = 0; i < raw.length; i++) {
        if (raw[i].split('|')[3] != id) {
            newRaw[newRaw.length] = raw[i];
        }
    }

    localStorage.setItem('fav', JSON.stringify(newRaw));
    
    console.log(id);
    
    //check if edited in Table
    if (typeof inTable === "undefined") {
        //Edit Table
        $("[favid=" + id + "]").attr('class', 'noFav');
    }

    //Update favorites table
    updateFavorites();
}

/**
 * Add the current series to the table.
 */
function addThisFav() {
    //Show all elements
    $('#favButton').addClass('favShow');

    window.setTimeout(function () {
        //Get the current url path
        var slicePath = window.location.pathname;
        
        var tit = document.getElementById('contentContainer');
        tit = tit.getElementsByTagName('h2')[0];
        tit = tit.innerHTML.split(tit.getElementsByTagName('small')[0].outerHTML)[0];
        
        //Add the current series to favorites
        addFavorite(slicePath, tit)
        
        window.setTimeout(function () {
            //Hide table
            $('#favButton').removeClass('favShow');
        }, 500);

    }, 500);
}

/**
 * Removes the current series from the table.
 */
function removeThisFav() {
    //Show all Elements
    $('#favButton').addClass('favShow');

    //Wait
    window.setTimeout(function () {
        //Get the current url path
        var slicePath = window.location.pathname;
        slicePath = slicePath.split('/');
        //Remove the current series to favorites
        removeFavorite(slicePath[2]);

        window.setTimeout(function () {
            //Hide table
            $('#favButton').removeClass('favShow');
        }, 500);

    }, 500);
}

/**
 * Reloads the {DOM} favTable with current favorites.
 */
function updateFavorites() {
    //Create the new empty favoritetable
    var favTable = document.createElement('table');
    favTable.setAttribute('id', 'favTable');
    var favTbody = document.createElement('tbody');

    //Get all favorites and create the rows
    var favs = getFavs();
    var i = 0
        for (; i < favs.length; i++) {
            //create rows and elements
            var tr = document.createElement('tr');
            tr.setAttribute('tabindex', -1);
            tr.addEventListener('mouseover', function () {
                this.focus();
            });
            tr.addEventListener('focus', function () {
                $('#favButton').addClass('favShow');
            });
            tr.addEventListener('blur', function () {
                $('#favButton').removeClass('favShow');
            });
            tr.setAttribute('class', i + 1);

            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            var td4 = document.createElement('td');
            
            //Index
            td1.innerHTML = (i + 1);
            td1.setAttribute('val', favs[i].seriesPath);
            
            //Name
            td2.innerHTML = favs[i].series;
            td2.setAttribute('val', favs[i].seriesPath);

            //Season
            td3.innerHTML = favs[i].season;
            td3.setAttribute('val', favs[i].seriesPath);
            
            //Svg image in button
            td4.appendChild(getCross());
            td4.setAttribute('val', favs[i].id);

            var clickFav = function () {
                var val = this.getAttribute('val');
                window.location = val;
            }
            
            //Change location to the favorite series on click
            td1.addEventListener('click', clickFav);
            td2.addEventListener('click', clickFav);
            td3.addEventListener('click', clickFav);

            //Remove the favorite and update the table on click
            td4.addEventListener('click', function () {
                var val = this.getAttribute('val');
                removeFavorite(val);
                updateFavorites();
            });

            //add elements to row
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);

            //add row to the table
            favTbody.appendChild(tr);
        }

        //get the current url path
        var path = window.location.pathname;

    //check if the user is on a series
    if (path.split('/').length > 2) {
        //create the add button
        var addButton = document.createElement('tr');
        addButton.setAttribute('class', i + 1);
        addButton.setAttribute('id', 'addButton');
        addButton.setAttribute('tabindex', -1);
        addButton.addEventListener('mouseover', function () {
            this.focus();
        });
        addButton.addEventListener('focus', function () {
            $('#favButton').addClass('favShow');
        });
        addButton.addEventListener('blur', function () {
            $('#favButton').removeClass('favShow');
        });

        //Fill the add button with elements
        var addButtonTd = document.createElement('td');
        addButtonTd.setAttribute('colspan', '3');
        addButtonTd.innerHTML = 'Serie Hinzufügen';
        addButton.appendChild(addButtonTd);

        //add this series to favorites on click
        addButton.addEventListener('click', function () {
            addThisFav();
        });

        //Add button to the table
        favTbody.appendChild(addButton);
    }

    favTable.appendChild(favTbody);
    //Clear current table
    document.getElementById('favCon').innerHTML = '';
    //Update the new content
    document.getElementById('favCon').appendChild(favTable);
}