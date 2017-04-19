// ==UserScript==
// @name        BsWatch - File 4
// @icon 		https://bs.to/opengraph.jpg
// @namespace   http://www.greasespot.net/
// @include     https://bs.to/?next
// @include     https://bs.to/?error
// @version    	1
// @description	Error and Next
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/cookiecontroll.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch4.user.js
// ==/UserScript==

//Get the current lastplayed episode
var series = getCookie('lastSeries'),
season = getCookie('lastSeason'),
episode = getCookie('lastEpisode');

//Check error on cookies and fuck you
if (series == undefined ||
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
} else {
	//Errorcode reset
	setCookie('errorCode', 0, false);

	//Open the last season for next episode
	window.location = 'https://bs.to/serie/' + series + '/' + season;

}
