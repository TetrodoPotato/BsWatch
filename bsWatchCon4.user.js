// ==UserScript==
// @name        BsWatch next episode redirect
// @namespace   http://www.greasespot.net/
// @include     https://bs.to/?next
// @include     https://bs.to/?error
// @version    	1
// @description	Redirect to next episode or the last season.
// @author     	Kartoffeleintopf
// @run-at 		document-start
// ==/UserScript==

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
