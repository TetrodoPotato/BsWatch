//var cssLink = 'https://rawgit.com/Kartoffeleintopf/BsWatch/master/StyleSheeds/bsStyle.css';
var cssLink = 'https://dl.dropbox.com/s/rf3rzlzsa3lg3to/bsStyle.css';
var cssVidLink = 'https://cdn.rawgit.com/Kartoffeleintopf/BsWatch/master/StyleSheeds/playerStyle.css';

function getStar(){
	var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('height','50');
	svg.setAttribute('width','50');
	
	var pol1 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	pol1.setAttribute('points','24,10 16,39 30,27 25,10');
	svg.appendChild(pol1);
	
	var pol2 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	pol2.setAttribute('points','10,21 24,32 25,32 39,21');
	svg.appendChild(pol2);
	
	var pol3 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
	pol3.setAttribute('points','33,39 30,27 19,27');
	svg.appendChild(pol3);
	
	return svg;
}