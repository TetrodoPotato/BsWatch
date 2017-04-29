// ==UserScript==
// @name        BsWatch - File 1
// @icon 		https://bs.to/opengraph.jpg
// @namespace   http://www.greasespot.net/
// @include     https://bs.to
// @include     https://bs.to/
// @include     https://bs.to/home
// @include     https://bs.to/home/
// @version    	1.1
// @description	Redirect for Home
// @author     	Kartoffeleintopf
// @run-at 		document-start
// @require		https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/Scripts/defaultcontroll.js
// @downloadURL https://raw.githubusercontent.com/Kartoffeleintopf/BsWatch/master/BsWatch1.user.js
// ==/UserScript==

//Black page over original
makeBlackPage();

//You know ?!
window.location = 'https://bs.to/serie-alphabet';