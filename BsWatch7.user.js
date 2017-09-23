// ==UserScript==
// @name        BsWatch - File 7
// @icon 		https://bs.to/opengraph.jpg
// @namespace   http://www.greasespot.net/
// @include     /^https:\/\/vivo\.sx\/.+$/
// @version    	1.2
// @description	Vivo Direct-Link
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/init.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch7.user.js
// ==/UserScript==

makeBlackPage();

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
        interval = setTimeout(openVideo, 100);
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
        if (timer < 100) {
            interval = setTimeout(openVideo, 100);
        } else {
            window.location = 'https://bs.to/?error';
        }

    }

}
