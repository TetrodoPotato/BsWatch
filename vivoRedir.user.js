// ==UserScript==
// @name        BsWatch get vivo mp4
// @namespace   http://www.greasespot.net/
// @include     /^https:\/\/vivo\.sx\/.+$/
// @version    	1
// @description	Get the redirect to the vivo mp4 file.
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/vivoRedir.user.js
// ==/UserScript==

//Black page over original
var blackP = document.createElement('div');
var blackPStyle = 'width:100%; height:100%; position:fixed; top:0; left:0; background:#000; z-index:999';
blackP.setAttribute('style', blackPStyle);
blackP.setAttribute('id', 'blackP');

//Attach blackPage
document.documentElement.appendChild(blackP);

//disable scrollbars .. for ... reasons
document.documentElement.style.overflow = 'hidden'; // firefox, chrome

//When document loaded
$(document).ready(function () {
	//Start the redirect process
	setTimeout(startRedirect, 1000);
});



//Click on the Video so the mp4 link appears
function startRedirect() {
	var elem = document.getElementsByClassName('needsclick');
	if (elem.length != 0) {
		elem[0].click();
		interval =  setTimeout(openVideo, 100);
	} else {
		window.location = 'https://bs.to/?error';
	}

}

var interval;
var timer = 0;

//Get the mp4 link
function openVideo() {
	timer++;
	var elem = document.getElementsByTagName('video');
	if (elem.length != 0) {
		var vidLink = elem[0].getAttribute("src");
		window.location = vidLink;
	} else {
		if(timer < 100){
			interval =  setTimeout(openVideo, 100);
		} else {
			window.location = 'https://bs.to/?error';
		}
		
	}

}
