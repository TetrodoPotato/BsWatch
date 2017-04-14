// ==UserScript==
// @name        BsWatch next episode redirect
// @namespace   http://www.greasespot.net/
// @include     https://bs.to/?next
// @include     https://bs.to/?error
// @version    	2
// @description	Redirect to next episode or the last season.
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/cookiecontroll.js
// ==/UserScript==

var series = getCookie('lastSeries');
var season = getCookie('lastSeason');
var episode = getCookie('lastEpisode');

if (window.location.href == 'https://bs.to/?error') {
	if (getCookie('errorCode') == undefined) {
		setCookie('errorCode',0,false);
	}
	setCookie('errorCode',getCookie('errorCode')+1,false);
	var next = 'https://bs.to/serie/' + series + '/' + season + '/' + episode;
	window.location = next;
} else {
	//Error reset
	setCookie('errorCode',0,false);
	window.location = 'https://bs.to/serie/' + series + '/' + season;

}
