//var cssLink = 'https://rawgit.com/Kartoffeleintopf/BsWatch/master/StyleSheeds/bsStyle.css';
var cssLink = 'https://dl.dropbox.com/s/rf3rzlzsa3lg3to/bsStyle.css';

//var cssVidLink = 'https://cdn.rawgit.com/Kartoffeleintopf/BsWatch/master/StyleSheeds/playerStyle.css';
var cssVidLink = 'https://dl.dropbox.com/s/wove4f8v3jgb4na/playerStyle.css';

function getPlay() {
	var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('height', '35');
	svg.setAttribute('width', '35');

	var pol1 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	pol1.setAttribute('points', '8,5 8,30 28,18');
	svg.appendChild(pol1);

	return svg;
}

function getSound(val) {
	var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('height', '35');
	svg.setAttribute('width', '35');

	var pol1 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	pol1.setAttribute('points', '1,12 1,21 8,21 17,29 17,5 9,12');
	svg.appendChild(pol1);

	if (val == 0) {
		var pol2 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
		pol2.setAttribute('points', '19,12 30,24 32,23 21,10');
		svg.appendChild(pol2);

		var pol3 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
		pol3.setAttribute('points', '22,24 32,12 30,10 20,23');
		svg.appendChild(pol3);
	}

	if (val >= 1) {
		var pol2 = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
		pol2.setAttribute('points', '21,12 23,14 23,17 23,20 21,22');
		pol2.setAttribute('style', 'fill:none; stroke-width:3;');
		svg.appendChild(pol2);
	}

	if (val >= 2) {
		var pol3 = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
		pol3.setAttribute('points', '24,26 27,22 28,17 27,12 24,8');
		pol3.setAttribute('style', 'fill:none; stroke-width:3;');
		svg.appendChild(pol3);
	}

	if (val >= 3) {
		var pol4 = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
		pol4.setAttribute('points', '28,5 31,9 33,17 31,25 28,30');
		pol4.setAttribute('style', 'fill:none; stroke-width:3;');
		svg.appendChild(pol4);
	}

	return svg;
}

function getClose() {
	var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('height', '35');
	svg.setAttribute('width', '35');

	var pol1 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	pol1.setAttribute('points', '9,6 6,9 26,29 29,26');
	svg.appendChild(pol1);

	var pol2 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	pol2.setAttribute('points', '6,26 9,29 29,9 26,6');
	svg.appendChild(pol2);

	return svg;
}

function getPause() {
	var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('height', '35');
	svg.setAttribute('width', '35');

	var pol1 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	pol1.setAttribute('points', '10,5 15,5 15,30 10,30');
	svg.appendChild(pol1);

	var pol2 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	pol2.setAttribute('points', '20,5 25,5 25,30 20,30');
	svg.appendChild(pol2);

	return svg;
}

function getStar() {
	var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('height', '50');
	svg.setAttribute('width', '50');

	var pol1 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	pol1.setAttribute('points', '24,10 16,39 30,27 25,10');
	svg.appendChild(pol1);

	var pol2 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	pol2.setAttribute('points', '10,21 24,32 25,32 39,21');
	svg.appendChild(pol2);

	var pol3 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	pol3.setAttribute('points', '33,39 30,27 19,27');
	svg.appendChild(pol3);

	return svg;
}

function getHome() {
	var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('height', '50');
	svg.setAttribute('width', '50');

	var pol1 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	pol1.setAttribute('points', '13,38 20,38 20,26 13,26');
	svg.appendChild(pol1);

	var pol2 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	pol2.setAttribute('points', '29,38 36,38 36,26 29,26');
	svg.appendChild(pol2);

	var pol3 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	pol3.setAttribute('points', '13,28 36,28 36,25 13,25');
	svg.appendChild(pol3);

	var pol4 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	pol4.setAttribute('points', '40,25 25,11 24,11 9,25');
	svg.appendChild(pol4);

	return svg;
}

function getCross() {
	var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('height', '30');
	svg.setAttribute('width', '30');

	var pol1 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	pol1.setAttribute('points', '5,0 0,5 25,30 30,25');
	svg.appendChild(pol1);

	var pol2 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	pol2.setAttribute('points', '0,25 5,30 30,5 25,0');
	svg.appendChild(pol2);

	return svg;
}

function getArrow() {
	var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('height', '50');
	svg.setAttribute('width', '30');

	var pol1 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	pol1.setAttribute('points', '5,15 25,25 5,35');
	svg.appendChild(pol1);

	return svg;
}

function getUnwatchIcon() {
	var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('height', '30');
	svg.setAttribute('width', '30');

	var pol1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	pol1.setAttribute('cx', '15');
	pol1.setAttribute('cy', '15');
	pol1.setAttribute('r', '12');
	pol1.setAttribute('style', 'stroke-width:3; fill:none;');
	svg.appendChild(pol1);

	return svg;
}

function getWatchIcon() {
	var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('height', '30');
	svg.setAttribute('width', '30');

	var pol1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	pol1.setAttribute('cx', '15');
	pol1.setAttribute('cy', '15');
	pol1.setAttribute('r', '12');
	pol1.setAttribute('style', 'stroke-width:3; fill:none;');
	svg.appendChild(pol1);

	var pol2 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	pol2.setAttribute('points', '1,26 4,29 29,4 26,1');
	svg.appendChild(pol2);

	var pol3 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	pol3.setAttribute('points', '4,1 1,4 26,29 29,26');
	svg.appendChild(pol3);

	return svg;
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
