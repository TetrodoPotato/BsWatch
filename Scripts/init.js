//Global vars
var keyonly = false; //None Mouse

function makeKeyOnly() {
	//Black page over original
	var blackP = document.createElement('div');
	var blackPStyle = 'width:100%; height:100%; position:fixed; top:0; left:0; background:transparent; z-index:500';
	blackP.setAttribute('style', blackPStyle);
	blackP.setAttribute('id', 'keyonly');

	//Text on bottom right
	var textKey = document.createElement('span');
	textKey.innerHTML = 'Keyboard only';
	var keyStyle = 'position:fixed; color:#ee4d2e; bottom:0; right:0; font-size:20px; font-weight:bold;';
	textKey.setAttribute('style', keyStyle);

	blackP.appendChild(textKey);

	var base = document.getElementById('baseCon');
	base.appendChild(blackP);
}

function removeKeyOnly() {
	document.getElementById('keyonly').outerHTML = '';
}

function makeBlackPage() {
	//Black page over original
	var blackP = document.createElement('div');
	var blackPStyle = 'width:100%; height:100%; position:fixed; top:0; left:0; background:#000; z-index:99';
	blackP.setAttribute('style', blackPStyle);
	blackP.setAttribute('id', 'blackP');
	document.documentElement.appendChild(blackP);
	document.documentElement.style.overflow = 'hidden'; // firefox, chrome
}

function removeBlackPage() {
	document.getElementById('blackP').outerHTML = '';
	document.documentElement.style.overflow = 'auto'; // firefox, chrome

	try {
		if (keyonly) {
			makeKeyOnly();
		}
	} catch (e) {}
}

function init() { //Black page over original
	//Messure Time
	var start = new Date();

	makeBlackPage();

	//keyonly check
	if (getCookie('keyonly') == undefined) {
		keyonly = false;
		setCookie('keyonly', false, false);
	} else {
		keyonly = getCookie('keyonly');
	}

	//When document loaded
	$(document).ready(function () {
		//Change head
		document.head.innerHTML = createHead().innerHTML;

		//Body and Menu
		var newBody = document.createElement('body');
		var menu = createMenubar();

		//Container with Tables and stuffff
		var contantContainer = document.createElement('div');
		contantContainer.setAttribute('id', 'contentContainer');

		//Construct Base-Body
		newBody.appendChild(menu);
		newBody.appendChild(contantContainer);

		//Needed
		initPage(contantContainer);

		//Change body
		document.body = newBody;

		//Write fav. Table
		updateFavorites();

		if (typeof afterInit === "function") {
			afterInit();
		}

		//Delete blackP onload ... because the stylesheed needs to be loaded
		$(window).bind("load", function () {
			removeBlackPage();
			if (document.getElementById('plane') !== null) {
				document.documentElement.style.overflow = 'hidden'; // firefox, chrome
			}
			var time = new Date() - start;
			console.log('Executiontime: ' + time);
		});
	});
}
