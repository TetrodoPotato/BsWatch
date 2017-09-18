/**
 * Adds a Series to the favorites.
 * Save thru cookies.
 */
function addFavorite(series) {
    //Get all favorites
    var favsSolo = getFavs();

    if (favsSolo.length > 14) {
        alert('Zu viele Favoriten!');
        return;
    }

    //When it already exist .. piss your pants
    if ($.inArray(series, favsSolo) != -1) {
        return;
    }

    //Add all current favorites to one String
    var newCookie = "";
    for (i = 0; i < favsSolo.length; i++) {
        newCookie += favsSolo[i] + ",";
    }
    //and at least add the new favorite
    newCookie += series;

    //Update the cookie ... hmmm yaa ...
    //to the new favorite string
    setCookie('favorites', newCookie, true);
    //Update favorites table
    updateFavorites();
}

/**
 * Get {String-Array} rawFav with all favorised series.
 * @return Array with all favorised series.
 */
function getFavs() {
    //Get the cookie-string
    var favs = getCookie('favorites');

    //Check if the cookie is not added or empty
    if (favs == null) {
        return [];
    } else if (favs.split(',')[0] == '') {
        //When the cookie is empty remove it completly
        removeCookie('favorites');
        return [];
    }

    var rawFav = favs.split(',');

    //sort
    rawFav.sort(function (a, b) {
        return a.localeCompare(b);
    });

    //Send the favorite array
    return rawFav;
}

/**
 * Removes a series with a {String} name from the favorised
 * and updates the favorites.
 * @param {String} name - name of the series.
 * @param {boolean} inTable - if the series is remoced from {DOM} favTable.
 */
function removeFavorite(name, inTable) {
    //Get all favorites
    var favsSolo = getFavs();

    //Check if the favorite is there
    var nameIndex = $.inArray(name, favsSolo);
    if (nameIndex == -1) {
        return;
    }

    //Remove that thing ...
    favsSolo = removeIndex(favsSolo, nameIndex);

    setCookie('favorites', '', true);

    //Add all other favorites
    for (i = 0; i < favsSolo.length; i++) {
        addFavorite(favsSolo[i]);
    }

    //check if edited in Table
    if (typeof inTable === "undefined") {
        //Edit Table
        $("[favid=" + name + "]").attr('class', 'noFav');
    }

    //Update favorites table
    updateFavorites();
}

/**
 * Removes an index from Array.
 * @param {Array} arr - array.
 * @param {Number} index - index in {Array} arr.
 */
function removeIndex(arr, index) {
    arr.splice(index, 1);
    return arr;
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

            //Index
            td1.innerHTML = (i + 1);
            td1.setAttribute('val', favs[i]);
            //Name
            td2.innerHTML = favs[i].split('-').join(' ');
            td2.setAttribute('val', favs[i]);
            //Remove icon

            //Svg image in button
            td3.appendChild(getCross());
            td3.setAttribute('val', favs[i]);

            //Change location to the favorite series on click
            td1.addEventListener('click', function () {
                var val = this.getAttribute('val');
                window.location = 'https://bs.to/serie/' + val;
            });
            td2.addEventListener('click', function () {
                var val = this.getAttribute('val');
                window.location = 'https://bs.to/serie/' + val;
            });

            //Remove the favorite and update the table on click
            td3.addEventListener('click', function () {
                var val = this.getAttribute('val');
                removeFavorite(val);
                updateFavorites();
            });

            //add elements to row
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);

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

/**
 * Add the current series to the table.
 */
function addThisFav() {
    //Show all elements
    $('#favButton').addClass('favShow');

    window.setTimeout(function () {
        //Get the current url path
        var slicePath = window.location.pathname;
        slicePath = slicePath.split('/');
        //Add the current series to favorites
        addFavorite(slicePath[2]);

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
