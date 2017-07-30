// ==UserScript==
// @name        BsWatch - File 1
// @icon 		https://bs.to/opengraph.jpg
// @namespace   http://www.greasespot.net/
// @include     /^https:\/\/bs.to(\/)?(((home|\?next|\?error|\?back))(\/)?)?$/
// @version    	2.0
// @description	Error and Next - Redirect
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/cookiecontroll.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/defaultcontroll.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch1.user.js
// ==/UserScript==

//Black page over original
makeBlackPage();

//Get the current lastplayed episode
var series = getCookie('lastSeries');
var season = getCookie('lastSeason');
var episode = getCookie('lastEpisode');

//Check error on cookies and fuck you
if (/^https:\/\/bs.to(\/home)?\/?$/.test(window.location.href)) {
	//You know ?!
	window.location = 'https://bs.to/serie-genre';
} else if (window.location.href == 'https://bs.to/?back') {
	setCookie('seriesScroll', 0);
	window.location = 'https://bs.to/serie-genre';
} else if (series == undefined ||
	season == undefined ||
	episode == undefined) {

	alert('Enable cookies!!!');
	window.location = 'https://bs.to/';
} else if (window.location.href == 'https://bs.to/?error') {
	//if the error code isn't set.. set it.
	if (getCookie('errorCode') == undefined) {
		setCookie('errorCode', 0, false);
	}
	//Update the current errorcode to the next hoster
	setCookie('errorCode', getCookie('errorCode') + 1, false);

	//And try it again
	var next = 'https://bs.to/serie/' + series + '/' + season + '/' + episode;
	window.location = next;
} else if (window.location.href == 'https://bs.to/?next') {
	//Errorcode reset
	setCookie('errorCode', 0, false);

	//Open the last season for next episode
	window.location = 'https://bs.to/serie/' + series + '/' + season;

}
