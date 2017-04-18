var isLoggedin = false;

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

		//Always log in with 'Angemeldet bleiben'
		var isLogg = loginForm.getElementsByTagName('label')[0];
		isLogg = isLogg.getElementsByTagName('input');

		if (isLogg.length != 0) {
			isLogg[0].checked = true;
		}

		rightCon.appendChild(loginForm);

	} else {
		//Is logged in
		isLoggedin = true;

		//Get the bs.to username welcome
		var textDiv = loggedSection.getElementsByTagName('div')[0];
		textDiv.setAttribute('id', 'welcome');
		rightCon.appendChild(textDiv);

	}

	//Create the favorite menu
	var favButton = document.createElement('div');
	favButton.setAttribute('id', 'favButton');
	favButton.setAttribute('tabindex', -1);
	favButton.addEventListener('mouseenter', function () {
		this.focus();
	});
	favButton.addEventListener('mouseleave', function () {
		this.blur();
	});

	favButton.appendChild(getStar());

	//Add a Favorite table
	var favCon = document.createElement('div');
	favCon.setAttribute('id', 'favCon');

	favButton.appendChild(favCon);

	rightCon.appendChild(favButton);

	//Set the left menubar part

	//Create the backbutton that links to this site ... so no function
	var backButton = document.createElement('button');
	var linkTo = 'window.location = \'https://bs.to/serie-alphabet\'';
	backButton.setAttribute('onclick', linkTo);

	backButton.appendChild(getHome());

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
	//Set the Checkbox to the current autoplay state
	autoplayCheckbox.checked = getCookie('autoplay');

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

		//Check existance for other tables
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

		//All tablerows in one array
		var allContent = [];
		for (i = 0; i < tbodys.length; i++) {

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

	//add events to search and autoplay
	autoplayCheckbox.addEventListener('change', function () {
		var auto = document.getElementById('auto');
		setCookie('autoplay', auto.checked, false);
	});

	//Make a start last episode banner
	var nextDiv = document.createElement('div');
	nextDiv.setAttribute('id', 'nextDiv');

	//Button for Continue
	var nextButton1 = document.createElement('div');
	nextButton1.innerHTML = 'Weiter schauen';

	//Just for style
	var nextButton2 = document.createElement('div');
	nextButton2.appendChild(getArrow());

	//Append content
	nextDiv.appendChild(nextButton1);
	nextDiv.appendChild(nextButton2);

	//Open next episode on click
	nextDiv.addEventListener('click', function () {
		var lastSeriesPerm = getCookie('lastSeriesPerm');
		var lastSeasonPerm = getCookie('lastSeasonPerm');
		var lastEpisodePerm = getCookie('lastEpisodePerm');

		if (lastSeriesPerm != undefined &&
			lastSeasonPerm != undefined &&
			lastEpisodePerm != undefined) {

			setCookie('lastSeries', lastSeriesPerm, false);
			setCookie('lastSeason', lastSeasonPerm, false);
			setCookie('lastEpisode', lastEpisodePerm, false);
			setCookie('autoplay', true, false);

			var loc = 'https://bs.to/serie/' + lastSeriesPerm + '/' +
				lastSeasonPerm;
			window.location = loc;
		}
	});

	baseCon.appendChild(nextDiv);

	//Return menü
	return baseCon;
}

function createHead() {
	//Construct the head
	var headNode = document.createElement('head');
	var titleNode = document.getElementsByTagName('title')[0];
	var baseNode = document.getElementsByTagName('base')[0];
	var charsetNode = document.getElementsByTagName('meta')[0];
	var favNode = document.getElementsByTagName('link')[0];

	//Add styleSheet
	var styles = "@import url('" + cssLink + "');";
	var styleNode = document.createElement('link');
	styleNode.rel = 'stylesheet';
	styleNode.href = 'data:text/css,' + escape(styles);

	headNode.appendChild(charsetNode);
	headNode.appendChild(baseNode);
	headNode.appendChild(favNode);
	headNode.appendChild(titleNode);
	headNode.appendChild(styleNode);

	return headNode;
}
