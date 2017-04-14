var homeLink = 'https://dl.dropbox.com/s/8zk6qsh3aox4j3o/home.png';
var confLink = 'https://dl.dropbox.com/s/lsnn2gwkk5wztfo/conf.png'
	var delLink = 'https://dl.dropbox.com/s/v0fxk2h4abzwtpw/delete.png';

var isLoggedin = false;

function setCookie(name, value, perma) {
	var expires = '';

	if (perma) {
		var d = new Date();
		d.setTime(d.getTime() + (9999 * 24 * 60 * 60 * 1000));
		var expires = ";expires=" + d.toUTCString();
	}
	document.cookie = name + "=" + value + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			var returnVal = c.substring(name.length, c.length);

			if (returnVal.toLowerCase() == 'true') {
				return true;
			} else if (returnVal.toLowerCase() == 'false') {
				return false;
			} else if ((/^\d+$/).test(returnVal)) {
				return parseInt(returnVal);
			} else {
				return returnVal;
			}
		}
	}
	return undefined;
}

function removeCookie(name) {
	document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function addFavorite(series) {
	var favs = getCookie('favorites');

	if (favs == undefined) {
		var favsSolo = [];
	} else {
		var favsSolo = favs.split(',');
	}

	if ($.inArray(series, favsSolo) != -1) {
		return;
	}

	var newCookie = "";
	for (i = 0; i < favsSolo.length; i++) {
		newCookie += favsSolo[i] + ",";
	}
	newCookie += series;

	setCookie('favorites', newCookie, true);

}

function getFavs() {
	var favs = getCookie('favorites');
	if (favs == undefined) {
		return [];
	} else if (favs.split(',')[0] == '') {
		removeCookie('favorites');
		return [];
	}

	return favs.split(',');
}

function removeFavorite(name) {
	var favs = getCookie('favorites');

	var favsSolo = favs.split(',');

	if ($.inArray(name, favsSolo) == -1) {
		return;
	}

	var nameIndex = $.inArray(name, favsSolo);

	favsSolo = removeIndex(favsSolo, nameIndex);

	var newCookie = "";
	for (i = 0; i < favsSolo.length; i++) {
		if (i < favsSolo.length - 1) {
			newCookie += favsSolo[i] + ',';
		} else {
			newCookie += favsSolo[i];
		}
	}

	setCookie('favorites', newCookie, true);
}

function removeIndex(arr, index) {
	arr.splice(index, 1);
	return arr;
}

function createMenubar() {
	//Base containers
	var baseCon = document.createElement('div');
	var menuCon = document.createElement('div');
	var leftCon = document.createElement('div');
	var rightCon = document.createElement('div');

	//Set ids
	baseCon.setAttribute('id', 'baseCon');
	menuCon.setAttribute('id', 'menuCon');
	leftCon.setAttribute('id', 'leftCon');
	rightCon.setAttribute('id', 'rightCon');

	//check if user is loged in
	var loggedSection = document.getElementById('navigation');
	if (loggedSection == null) {
		//Is not logged in

		//Get the bs.to login form
		var loginForm = document.getElementById('login');
		rightCon.appendChild(loginForm);

	} else {
		//Is logged in
		isLoggedin = true;

		//Get the bs.to username welcome
		var textDiv = loggedSection.getElementsByTagName('div')[0];
		textDiv.setAttribute('id', 'welcome');
		rightCon.appendChild(textDiv);

		var favButton = document.createElement('div');
		favButton.setAttribute('id', 'favButton');
		var confImage = document.createElement('img');
		confImage.setAttribute('src', confLink);
		confImage.setAttribute('width', '50');
		confImage.setAttribute('height', '50');

		favButton.appendChild(confImage);

		//Add a Favorite table
		var favCon = document.createElement('div');
		favCon.setAttribute('id', 'favCon');

		favButton.appendChild(favCon);

		rightCon.appendChild(favButton);
	}

	//Set the left menubar part

	//Create the backbutton that links to this site ... so no function
	var backButton = document.createElement('button');
	var linkTo = 'window.location = \'https://bs.to/serie-alphabet\'';
	backButton.setAttribute('onclick', linkTo);

	//The button image
	var buttonImage = document.createElement('img');
	buttonImage.setAttribute('src', homeLink);
	buttonImage.setAttribute('width', '50');
	buttonImage.setAttribute('height', '50');

	backButton.appendChild(buttonImage);

	//Create the search input
	var searchInput = document.createElement('input');
	searchInput.setAttribute('placeholder', 'Suche');
	searchInput.setAttribute('type', 'search');
	searchInput.setAttribute('id', 'search');

	//Create the checkbox and checkbox label
	var autoplayCheckbox = document.createElement('input');
	autoplayCheckbox.setAttribute('type', 'checkbox');
	autoplayCheckbox.setAttribute('class', 'vis-hidden');
	autoplayCheckbox.setAttribute('id', 'auto');

	var autoplayLabel = document.createElement('label');
	autoplayLabel.setAttribute('id', "autolabel");
	autoplayLabel.setAttribute('for', 'auto');
	autoplayLabel.innerHTML = 'Autoplay';

	//Create the left container
	leftCon.appendChild(backButton);
	leftCon.appendChild(searchInput);
	leftCon.appendChild(autoplayCheckbox);
	leftCon.appendChild(autoplayLabel);

	//Create the menu container
	menuCon.appendChild(leftCon);
	menuCon.appendChild(rightCon);
	baseCon.appendChild(menuCon);

	//Add events

	searchInput.addEventListener("input", function () {
		//Search

		//get the searchterm
		var searchTerm = document.getElementById('search').value.toLowerCase();

		var tbodys = document.getElementsByTagName('tbody');

		var allContent = [];

		for (i = 0; i < tbodys.length; i++) {

			var seasonTable = document.getElementById('seasonTable');
			var functionTable = document.getElementById('functionTable');
			var favTable = document.getElementById('favTable');

			if (seasonTable === null) {
				seasonTable = document.createElement('div');
			}
			if (functionTable === null) {
				functionTable = document.createElement('div');
			}
			if (favTable === null) {
				favTable = document.createElement('div');
			}

			if (!seasonTable.contains(tbodys[i])) {
				if (!functionTable.contains(tbodys[i])) {
					if (!favTable.contains(tbodys[i])) {
						var buff = Array.prototype.slice.call(tbodys[i].getElementsByTagName('tr'));
						allContent = allContent.concat(buff);
					}
				}
			}

		}

		for (i = 0; i < allContent.length; i++) {
			var innerString = allContent[i].innerHTML.toLowerCase();
			//Ugly but works .. replaceAll
			var regexPart = new RegExp('\<[^\>]*\>');
			innerString = innerString.split(regexPart).join('');

			//Check if the inner contains the searchterm
			if (!innerString.includes(searchTerm)) {
				//Magic
				allContent[i].style.display = 'none';
			} else {
				//No magic
				allContent[i].style.display = '';
			}
		}
		lastFocus = 0;
	});

	autoplayLabel.addEventListener('click', function () {
		document.getElementById('auto').checked = !document.getElementById('auto').checked;

		var auto = document.getElementById('auto');
		setCookie('autoplay', auto.checked, false);

		if (!getCookie('autoplay')) {
			setCookie('autoplay', false, false);

			removeCookie('lastSeries');
			removeCookie('lastSeason');
			removeCookie('lastEpisode');
		}

	});

	return baseCon;
}

function updateFavorites() {
	var favTable = document.createElement('table');
	favTable.setAttribute('id', 'favTable');
	var favTbody = document.createElement('tbody');

	var favs = getFavs();
	for (i = 0; i < favs.length; i++) {
		var tr = document.createElement('tr');
		var td1 = document.createElement('td');
		var td2 = document.createElement('td');
		var td3 = document.createElement('td');

		td1.innerHTML = (i + 1);
		td1.setAttribute('val', favs[i]);
		td2.innerHTML = favs[i];
		td2.setAttribute('val', favs[i]);
		td3.innerHTML = '<img src="' + delLink + '" height="30" width="30">';
		td3.setAttribute('val', favs[i]);

		td1.addEventListener('click', function () {
			var val = this.getAttribute('val');
			window.location = 'https://bs.to/serie/' + val;
		});
		td2.addEventListener('click', function () {
			var val = this.getAttribute('val');
			window.location = 'https://bs.to/serie/' + val;
		});
		td3.addEventListener('click', function () {
			var val = this.getAttribute('val');
			removeFavorite(val);
			updateFavorites();
		});

		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);

		favTbody.appendChild(tr);
	}

	var path = window.location.pathname;
	if (path.split('/').length > 2) {
		var addButton = document.createElement('tr');
		addButton.setAttribute('id', 'addButton');

		var addButtonTd = document.createElement('td');
		addButtonTd.setAttribute('colspan', '3');
		addButtonTd.innerHTML = 'Series Favoritieren';
		addButton.appendChild(addButtonTd);

		addButton.addEventListener('click', function () {
			addThisFav
		});

		favTbody.appendChild(addButton);
	}

	favTable.appendChild(favTbody);
	document.getElementById('favCon').innerHTML = '';
	document.getElementById('favCon').appendChild(favTable);
}

function addThisFav() {
	var slicePath = window.location.pathname;
	slicePath = slicePath.split('/');
	addFavorite(slicePath[2]);
	updateFavorites();
}

function removeThisFav(){
	var slicePath = window.location.pathname;
	slicePath = slicePath.split('/');
	removeFavorite(slicePath[2]);
	updateFavorites();
}