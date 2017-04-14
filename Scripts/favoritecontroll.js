var delLink = 'https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/pageImg/delete.png';

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
			addThisFav();
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

function removeThisFav() {
	var slicePath = window.location.pathname;
	slicePath = slicePath.split('/');
	removeFavorite(slicePath[2]);
	updateFavorites();
}
