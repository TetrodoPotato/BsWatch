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

/**
 * Focus the first element with {id} 1 on first and adds the {Number} value
 * to the id. If the Style is display {String} "none" the next id with {Number} value + value
 * is focused.
 */
function focusNext(value) {
    //Get current elements number
    var lastFoc = document.activeElement.getAttribute('id');
    lastFoc = parseInt(lastFoc);

    //When its not a number
    if (isNaN(lastFoc)) {
        var elem;
        //Check if there is a last focus. None = 0
        if (lastFocus != 0) {
            //Get last Focus
            elem = document.getElementById('' + lastFocus);
            while (elem === null && lastFocus > 0) {
                elem = document.getElementById('' + --lastFocus);
            }

            if (elem === null) {
                elem = document.getElementById('1');
                if (elem === null) {
                    return;
                }
                return;
            }

            lastFoc = lastFocus;
        } else {
            //Get first element
            elem = document.getElementById('1');
            lastFocus = 1;
            lastFoc = 1;
        }

        //Get next focus until display != none
        if (elem != null) {
            while (getStyle(elem, "display") == "none") {
                lastFoc += value;
                elem = document.getElementById('' + lastFoc);
                if (elem === null) {
                    break;
                }
            }
        }

        //Focus object
        if (elem != null) {
            elem.focus();
        }
    } else {
        //Lastfocus next element
        lastFoc += value;
        var elem = document.getElementById('' + lastFoc);

        //Get next focus until display != none
        if (elem != null) {
            while (getStyle(elem, "display") == "none") {
                lastFoc += value;
                elem = document.getElementById('' + lastFoc);
                if (elem === null) {
                    break;
                }
            }
        }

        //Focus next element
        if (elem != null) {
            document.getElementById('' + lastFoc).focus();
            lastFocus = lastFoc;
        }
    }
    //Scroll to focused element
    scrollToFocus();
}

/**
 * Get the computed {String} styleProp from {DOM} el.
 * @param {DOM} el - element to check.
 * @param {String} styleProp - Style to check.
 * @return {String} styleProp.
 */
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

/**
 * Scrolls to the element with focus.
 */
function scrollToFocus() {
    window.scroll(0, findPos(document.activeElement) - 180);
}

/**
 * Finds y value of given object.
 */
function findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return [curtop];
    }
}

/**
 * Focus the first element with {class} 1 on first and adds the {Number} value
 * to the id.
 */
function favNext(value) {
    //Get last focused element
    var lastFoc = document.activeElement.getAttribute('class');
    lastFoc = parseInt(lastFoc);

    //Check if it is a number
    if (isNaN(lastFoc)) {
        //Focus first element
        var elems = document.getElementsByClassName('1');
        if (elems.length != 0) {
            elems[0].focus();
        }
    } else {
        //Class from next element
        lastFoc += value;

        //Get next element
        var elem = document.getElementsByClassName('' + lastFoc);

        //Focus next element
        if (elem.length != 0) {
            elem[0].focus();
        }
    }
}

/**
 * Click On Focused Tablerow
 */
function enterClick() {
    //When the focused element has a link click it
    if (document.activeElement.getElementsByTagName('a').length > 0) {
        document.activeElement.getElementsByTagName('a')[0].click();
    } else {
        //Click the row and first element ... never trust a dead body
        document.activeElement.click();
        var tds = document.activeElement.getElementsByTagName('td');
        if (tds.length != 0) {
            //Second shot
            tds[0].click();
        }
    }
}

/**
 * Start Next Episode From Everywhere
 */
function tabClick() {
    //Permanent cookies .. hm 2.7 years
    var lastSeriesPerm = getCookie('lastSeriesPerm');
    var lastSeasonPerm = getCookie('lastSeasonPerm');
    var lastEpisodePerm = getCookie('lastEpisodePerm');

    if (lastSeriesPerm != undefined &&
        lastSeasonPerm != undefined &&
        lastEpisodePerm != undefined) {

        //Set default cookies for autoplay
        setCookie('lastSeries', lastSeriesPerm, false);
        setCookie('lastSeason', lastSeasonPerm, false);
        setCookie('lastEpisode', lastEpisodePerm, false);
        setCookie('autoplay', true, false);

        //Launch outside butthole
        var loc = 'https://bs.to/serie/' + lastSeriesPerm + '/' +
            lastSeasonPerm;
        window.location = loc;
    }
}

/**
 * Defavorise [This | Focused] Series
 */
function defavClick() {
    var favTab = document.getElementById('favTable');
    if (favTab.contains(document.activeElement)) {
        var addButton = document.getElementById('addButton');
        if (addButton !== null) {
            if (addButton != document.activeElement) {
                var act = document.activeElement;
                act.getElementsByTagName('td')[3].click();
            }
        } else {
            var act = document.activeElement;
            act.getElementsByTagName('td')[3].click();
        }
    } else {
        removeThisFav();
    }
}

/**
 * Click On Remove Button On LogSegment
 */
function removeLogSegment() {
    var focElem = document.activeElement;
    var tds = focElem.getElementsByTagName('td');
    if (tds.length == 9) {
        tds[8].click();
    }
}

/**
 * Change Log Destination
 */
function nextLog(val) {
    var path = window.location.search;

    var opt = ['', '?info', '?data'];
    for (let i = 0; i < opt.length; i++) {
        if (opt[i] === path) {
            i += val;
            if (i >= opt.length) {
                i = 0;
            } else if (i < 0) {
                i = opt.length - 1;
            }

            window.location = "https://bs.to/log" + opt[i];
            return;
        }
    }

}

/**
 * Make key things happen.
 */
$(document).ready(function () {
    //Fuck Key controll
    $(window).keydown(function (e) {
        if (e.shiftKey || e.ctrlKey) {
            return;
        }

        var nextButton = document.getElementById('nextButton');
        if (nextButton != null) { // On Next Episode Window
            if (e.keyCode === 27) { //ESC | Close Next Window
                e.preventDefault();
                setNextBreak();
            }
        } else if (document.getElementById('search') === document.activeElement) { //On Search Focus
            if (e.keyCode === 27 || e.keyCode === 13 || e.keyCode === 40 || e.keyCode === 38) { //Esc / Enter / Down / Up | End Search Focus
                e.preventDefault();
                document.activeElement.blur();
                focusNext(1);
            }
        } else if (document.activeElement.tagName.toLowerCase() != "input") { //Not On Search Or Login
            if (e.keyCode === 75) { //K | Focus On Search
                e.preventDefault();
                document.getElementById('search').focus();
            } else if (e.keyCode === 38) { //Arr-up | Table Row Focus Up
                e.preventDefault();
                if (favSwitch) {
                    favNext(-1);
                } else {
                    focusNext(-1);
                }
            } else if (e.keyCode == 112) { //F1 | Toggle Keyonly State
                e.preventDefault();
                keyonly = !keyonly;
                setCookie('keyonly', keyonly, false);

                if (keyonly) {
                    makeKeyOnly();
                } else {
                    removeKeyOnly();
                }
            } else if (e.keyCode === 40) { //Arr-down | Table Row Focus Down
                e.preventDefault();
                if (favSwitch) {
                    favNext(1);
                } else {
                    focusNext(1);
                }
            } else if (e.keyCode === 13) { //Enter | Click
                e.preventDefault();
                enterClick();
            } else if (e.keyCode === 65) { //A | Toggle Autoplay
                e.preventDefault();
                document.getElementById('auto').checked = !document.getElementById('auto').checked;
                var auto = document.getElementById('auto');
                setCookie('autoplay', auto.checked, false);
            } else if (e.keyCode === 72) { //H | Back To Home
                e.preventDefault();
                window.location = 'https://bs.to/?back';
            } else if (e.keyCode == 9) { //Tab | Play Next Episode
                e.preventDefault();
                tabClick();
            } else if (e.keyCode === 8) { //Backspace | Back To Last Series
                e.preventDefault();
                var lastSeries = getCookie('lastSeries');
                var lastSeason = getCookie('lastSeason');
                if (lastSeries != undefined && lastSeason != undefined) {
                    //Open last Series
                    var backFunction = 'https://bs.to/serie/' + lastSeries + '/' + lastSeason;
                    setCookie('autoplay', false, false);
                    window.location = backFunction;
                }
            } else if (e.keyCode === 77) { //M | Toggle To Favorite Menu
                e.preventDefault();
                favSwitch = !favSwitch;
                if (favSwitch) {
                    favNext(1);
                } else {
                    focusNext(1);
                }
            } else {
                var path = window.location.pathname;
                path = path.split('/');

                //Check for /watch:1 or /unwatch:1
                var watchedLink = false;
                if (path.length > 4) {
                    if (path[4].indexOf('watch') != -1 || path[4].indexOf('unwatch') != -1) {
                        watchedLink = true;
                    }
                }

                //On EpisodeTable
                if (path.length == 3 || path.length == 4 || watchedLink) { //bs.to/series/seriesName/season/episodename ?+ /watch:number
                    if (e.keyCode === 37) { //Arr-left | Previous-Season
                        e.preventDefault();
                        openNextSeasonUser(-1);
                    } else if (e.keyCode === 39) { //Arr-right | Next-Season
                        e.preventDefault();
                        openNextSeasonUser(1);
                    } else if (e.keyCode === 79) { //O | Mark All As Watched
                        e.preventDefault();
                        var allWatch = document.getElementById('allWatchTable');
                        if (allWatch !== null) {
                            allWatch.getElementsByTagName('td')[0].click();
                        }
                    } else if (e.keyCode === 80) { //P | Mark All As Unwatched
                        e.preventDefault();
                        var allWatch = document.getElementById('allWatchTable');
                        if (allWatch !== null) {
                            allWatch.getElementsByTagName('td')[1].click();
                        }
                    } else if (e.keyCode === 70) { //F | Favorise Current Series
                        e.preventDefault();
                        addThisFav();
                    } else if (e.keyCode === 68) { //D | Defavorise [Current / Focused in FavTable ] Series
                        e.preventDefault();
                        defavClick();
                    } else if (e.keyCode === 87) { //W | Toggle Watchstate Of Focused Episode
                        e.preventDefault();
                        if (isLoggedin) {
                            if (document.getElementById('episodeTable').contains(document.activeElement)) {
                                document.activeElement.getElementsByTagName('td')[3].click();
                            }
                        }
                    }
                } else if (path.length > 4) { //On HosterTable
                    if (e.keyCode === 78) { //N | Open Next Episode
                        e.preventDefault();
                        window.location = 'https://bs.to/?next';
                    }
                } else if (path.length == 2) { // SeriesTable

                    if (path[1] === 'log') {
                        if (e.keyCode === 82) { //R | Remove Focused Logsement
                            e.preventDefault();
                            removeLogSegment();
                            focusNext(-1);
                        } else if (e.keyCode === 37) { //Arr-left | Previous-Season
                            e.preventDefault();
                            nextLog(-1)
                        } else if (e.keyCode === 39) { //Arr-right | Next-Season
                            e.preventDefault();
                            nextLog(1)
                        }
                    } else if (path[1] === 'serie-genre') {
                        if (e.keyCode === 70) { //F | Favorise Focused Series
                            e.preventDefault();
                            var act = document.activeElement;
                            var actFav = act.getElementsByTagName('td')[3];
                            if (actFav !== null) {
                                actFav.click();
                            }
                        }
                    }

                }

            }

        }

    });
});
