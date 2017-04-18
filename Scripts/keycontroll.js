var lastFocus = 0;
var keyonly = false;
var favSwitch = false;

//Inline for keyonly check
if (getCookie('keyonly') == undefined) {
	keyonly = false;
	setCookie('keyonly', false, false);
} else {
	keyonly = getCookie('keyonly');
}

function focusNext(value) {
	var lastFoc = document.activeElement.getAttribute('id');
	lastFoc = parseInt(lastFoc);
	if (isNaN(lastFoc)) {
		var elem;
		if (lastFocus != 0) {
			elem = document.getElementById('' + lastFocus);
			lastFoc = lastFocus;
		} else {
			elem = document.getElementById('1');
			lastFocus = 1;
			lastFoc = 1;
		}

		if (elem != null) {
			while (getStyle(elem, "display") == "none") {
				lastFoc += value;
				elem = document.getElementById('' + lastFoc);
				if (elem === null) {
					break;
				}
			}
		}

		if (elem != null) {
			elem.focus();
		}
	} else {
		lastFoc += value;
		var elem = document.getElementById('' + lastFoc);

		if (elem != null) {
			while (getStyle(elem, "display") == "none") {
				lastFoc += value;
				elem = document.getElementById('' + lastFoc);
				if (elem === null) {
					break;
				}
			}
		}

		if (elem != null) {
			document.getElementById('' + lastFoc).focus();
			lastFocus = lastFoc;
		}
	}
	scrollToFocus();
}

function getStyle(el, styleProp) {
	var value,
	defaultView = (el.ownerDocument || document).defaultView;
	// W3C standard way:
	if (defaultView && defaultView.getComputedStyle) {
		// sanitize property name to css notation
		// (hypen separated words eg. font-Size)
		styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
		return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
	} else if (el.currentStyle) { // IE
		// sanitize property name to camelCase
		styleProp = styleProp.replace(/\-(\w)/g, function (str, letter) {
				return letter.toUpperCase();
			});
		value = el.currentStyle[styleProp];
		// convert other units to pixels on IE
		if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
			return (function (value) {
				var oldLeft = el.style.left,
				oldRsLeft = el.runtimeStyle.left;
				el.runtimeStyle.left = el.currentStyle.left;
				el.style.left = value || 0;
				value = el.style.pixelLeft + "px";
				el.style.left = oldLeft;
				el.runtimeStyle.left = oldRsLeft;
				return value;
			})(value);
		}
		return value;
	}
}

function scrollToFocus() {
	window.scroll(0, findPos(document.activeElement) - 90);
}

//Finds y value of given object
function findPos(obj) {
	var curtop = 0;
	if (obj.offsetParent) {
		do {
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
		return [curtop];
	}
}

function favNext(value) {
	var lastFoc = document.activeElement.getAttribute('class');
	lastFoc = parseInt(lastFoc);
	if (isNaN(lastFoc)) {
		var elems = document.getElementsByClassName('1');
		if(elems.length != 0){
			elems[0].focus();
		}
	} else {
		lastFoc += value;
		var elem = document.getElementsByClassName('' + lastFoc);

		if (elem.length != 0) {
			elem[0].focus();
		}
	}
}

$(window).keydown(function (e) {
	var nextButton = document.getElementById('nextButton');
	if (nextButton != null) {
		if (e.keyCode === 27) { //ESC
			e.preventDefault();
			setNextBreak();
		}
	} else if (document.getElementById('search') === document.activeElement) {
		if (e.keyCode === 27 || e.keyCode === 13) { //Esc / Enter
			e.preventDefault();
			focusNext(1);
		}
	} else if (document.activeElement.tagName.toLowerCase() != "input") {
		if (e.keyCode === 75) { //K
			e.preventDefault();
			document.getElementById('search').focus();
		} else if (e.keyCode === 38) { //Arr-up
			e.preventDefault();
			if (favSwitch) {
				favNext(-1);

			} else {
				focusNext(-1);
			}
		} else if (e.keyCode === 40) { //Arr-down
			e.preventDefault();
			if (favSwitch) {
				favNext(1);

			} else {
				focusNext(1);
			}
		} else if (e.keyCode === 13) { //Enter
			e.preventDefault();

			if (document.activeElement.getElementsByTagName('a').length > 0) {
				document.activeElement.getElementsByTagName('a')[0].click();
			} else {
				document.activeElement.click();
				var tds = document.activeElement.getElementsByTagName('td');
				if (tds.length != 0) {
					tds[0].click();
				}
			}

		} else if (e.keyCode === 65) { //A
			e.preventDefault();
			document.getElementById('auto').checked = !document.getElementById('auto').checked;
			var auto = document.getElementById('auto');
			setCookie('autoplay', auto.checked, false);
		} else if (e.keyCode === 72) { //H
			e.preventDefault();
			window.location = 'https://bs.to/serie-alphabet';
		} else if (e.keyCode == 9) { //Tab
			var lastSeriesPerm = getCookie('lastSeriesPerm');
			var lastSeasonPerm = getCookie('lastSeasonPerm');
			var lastEpisodePerm = getCookie('lastEpisodePerm');

			if (lastSeriesPerm != undefined &&
				lastSeasonPerm != undefined &&
				lastEpisodePerm != undefined) {

				setCookie('lastSeries', lastSeriesPerm, false);
				setCookie('lastSeason', lastSeasonPerm, false);
				setCookie('lastEpisode', lastEpisodePerm, false);
				setCookie('autoplay', true, false);

				var loc = 'https://bs.to/serie/' + lastSeriesPerm + '/' +
					lastSeasonPerm;
				window.location = loc;
			}

		} else if (e.keyCode === 8) { //Backspace
			e.preventDefault();
			var lastSeries = getCookie('lastSeries');
			var lastSeason = getCookie('lastSeason');
			if (lastSeries != undefined && lastSeason != undefined) {
				var backFunction = 'https://bs.to/serie/' + lastSeries + '/' + lastSeason;
				setCookie('autoplay', false, false);
				window.location = backFunction;
			}
		} else if (e.keyCode === 77) { //M
			favSwitch = !favSwitch;
			if (favSwitch) {
				var favTab = document.getElementsByClassName('1');
				if (favTab.length != 0) {
					favTab[0].focus();
				}

			} else {
				focusNext(1);
			}
		} else {
			var path = window.location.pathname;
			path = path.split('/');

			var watchedLink = false;
			if (path.length > 4) {
				if (path[4].indexOf('watch') == 0) {
					watchedLink = true;
				} else if (path[4].indexOf('unwatch') == 0) {
					watchedLink = true;
				}
			}

			if (path.length == 3 || path.length == 4 || watchedLink) {
				if (e.keyCode === 37) { //Arr-left
					e.preventDefault();
					openNextSeasonUser(-1);
				} else if (e.keyCode === 39) { //Arr-right
					e.preventDefault();
					openNextSeasonUser(1);
				} else if (e.keyCode === 79) { //O
					e.preventDefault();
					var allWatch = document.getElementById('allWatchTable');
					if (allWatch !== null) {
						allWatch.getElementsByTagName('td')[0].click();
					}
				} else if (e.keyCode === 80) { //P
					e.preventDefault();
					var allWatch = document.getElementById('allWatchTable');
					if (allWatch !== null) {
						allWatch.getElementsByTagName('td')[1].click();
					}
				} else if (e.keyCode === 70) { //F
					addThisFav();
				} else if (e.keyCode === 68) { //D
					var favTab = document.getElementById('favTable');
					if(favTab.contains(document.activeElement)){
						var addButton = document.getElementById('addButton');
						if(addButton !== null){
							if(addButton != document.activeElement){
								var act = document.activeElement;
								act.getElementsByTagName('td')[2].click();
							}
						}
					} else {
						removeThisFav();
					}	
				} else if (e.keyCode === 87) { //W
					e.preventDefault();
					if (isLoggedin) {
						if (document.getElementById('episodeTable').contains(document.activeElement)) {
							document.activeElement.getElementsByTagName('td')[2].click();
						}
					}
				}
			} else if (path.length > 4) {
				if (e.keyCode === 78) { //N
					e.preventDefault();
					window.location = 'https://bs.to/?next';
				}
			}

		}

	}

	if (e.keyCode == 112) {
		keyonly = !keyonly;
		setCookie('keyonly', keyonly, false);

		if (keyonly) {
			makeKeyOnly();
		} else {
			removeKeyOnly();
		}
	}
});
