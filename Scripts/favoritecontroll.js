
//name ..
function addFavorite(series) {
	//Get all favorites
	var favsSolo = getFavs();

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
}

function getFavs() {
	//Get the cookie-string
	var favs = getCookie('favorites');

	//Check if the cookie is not added or empty
	if (favs == undefined) {
		return [];
	} else if (favs.split(',')[0] == '') {
		//When the cookie is empty remove it completly
		removeCookie('favorites');
		return [];
	}

	//Send the favorite array
	return favs.split(',');
}

function removeFavorite(name) {
	//Get all favorites
	var favsSolo = getFavs();

	//Check if the favorite is there
	var nameIndex = $.inArray(name, favsSolo);
	if (nameIndex == -1) {
		return;
	}

	//Remove that thing ...
	favsSolo = removeIndex(favsSolo, nameIndex);

	//Add all other favorites
	for (i = 0; i < favsSolo.length; i++) {
		addFavorite(favsSolo[i]);
	}
}

//Simply
function removeIndex(arr, index) {
	arr.splice(index, 1);
	return arr;
}

//Fill the favorites table new
function updateFavorites() {
	//Create the new empty favoritetable
	var favTable = document.createElement('table');
	favTable.setAttribute('id', 'favTable');
	var favTbody = document.createElement('tbody');

	//Get all favorites and create the rows
	var favs = getFavs();
	for (i = 0; i < favs.length; i++) {
		//create rows and elements
		var tr = document.createElement('tr');
		var td1 = document.createElement('td');
		var td2 = document.createElement('td');
		var td3 = document.createElement('td');

		//Index
		td1.innerHTML = (i + 1);
		td1.setAttribute('val', favs[i]);
		//Name
		td2.innerHTML = favs[i];
		td2.setAttribute('val', favs[i]);
		//Remove icon

		//Svg image in button
		td3.innerHTML = '<svg height="30" width="30">' +
			'<polygon points="5,0 0,5 25,30 30,25"></polygon>' +
			'<polygon points="0,25 5,30 30,5 25,0"></polygon>' +
			'</svg>'
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
		addButton.setAttribute('id', 'addButton');

		//Fill the add button with elements
		var addButtonTd = document.createElement('td');
		addButtonTd.setAttribute('colspan', '3');
		addButtonTd.innerHTML = 'Serie Favoritieren';
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

function addThisFav() {
	//Get the current url path
	var slicePath = window.location.pathname;
	slicePath = slicePath.split('/');
	//Add the current series to favorites
	addFavorite(slicePath[2]);
	//Update favorites table
	updateFavorites();
}

function removeThisFav() {
	//Get the current url path
	var slicePath = window.location.pathname;
	slicePath = slicePath.split('/');
	//Remove the current series to favorites
	removeFavorite(slicePath[2]);
	//Update favorites table
	updateFavorites();
}
