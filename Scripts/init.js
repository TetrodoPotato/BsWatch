if (getCookie('debug')) {
    var cssLink = 'https://dl.dropbox.com/s/xpud8exmlapizrz/bsStyle.css';
    var cssVidLink = 'https://dl.dropbox.com/s/z2evfmixktpfb9n/playerStyle.css';
} else {
    var cssLink = 'https://kartoffeleintopf.github.io/BsWatch/StyleSheeds/bsStyle.css';
    var cssVidLink = 'https://kartoffeleintopf.github.io/BsWatch/StyleSheeds/playerStyle.css';
}

//Global vars
var keyonly = false; //None Mouse
var isLoggedin = false;

/**
 * Enables debugmode
 * @param {boolean} - On or Off
 */
function debugmode(on) {
    if (on) {
        setCookie('debug', true);
    } else {
        setCookie('debug', false);
    }
}

/**
 * Provides a Menu-topbar with home, back, search, autoplay, and favorite-elements.
 * Inits the login and logout.
 * @return initialised menubar
 */
function createMenubar() {
    //Base containers
    var baseCon = document.createElement('div');
    var menuCon = document.createElement('div');
    var leftCon = document.createElement('div');
    var rightCon = document.createElement('div');

    //Set ids
    baseCon.setAttribute('id', 'baseCon');
    menuCon.setAttribute('id', 'menuCon');
    leftCon.setAttribute('id', 'leftCon');
    rightCon.setAttribute('id', 'rightCon');

    //check if user is loged in
    var loggedSection = document.getElementById('navigation');
    if (loggedSection == null) {
        //Is not logged in

        //Get the bs.to login form
        var loginForm = document.getElementById('login');

        //Always log in with 'Angemeldet bleiben'
        var isLogg = loginForm.getElementsByTagName('label')[0];
        isLogg = isLogg.getElementsByTagName('input');

        if (isLogg.length != 0) {
            isLogg[0].checked = true;
        }

        rightCon.appendChild(loginForm);

    } else {
        //Is logged in
        isLoggedin = true;

        //Get the bs.to username welcome
        var textDiv = loggedSection.getElementsByTagName('div')[0];
        textDiv.setAttribute('id', 'welcome');

        var nameText = textDiv.getElementsByTagName('strong')[0];
        nameText.innerHTML = '<a href="https://bs.to/logout">' + nameText.innerHTML + '</a>';

        rightCon.appendChild(textDiv);

    }

    //Create the favorite menu
    var favButton = document.createElement('div');
    favButton.setAttribute('id', 'favButton');
    favButton.setAttribute('tabindex', -1);
    favButton.addEventListener('mouseenter', function () {
        this.focus();
    });
    favButton.addEventListener('mouseleave', function () {
        this.blur();
    });

    favButton.appendChild(getStar());

    //Add a Favorite table
    var favCon = document.createElement('div');
    favCon.setAttribute('id', 'favCon');

    favButton.appendChild(favCon);

    rightCon.appendChild(favButton);

    //Set the left menubar part

    //Create the backbutton that links to this site ... so no function
    var backButton = document.createElement('button');
    var linkTo = 'window.location = \'https://bs.to/?back\'';
    backButton.setAttribute('onclick', linkTo);

    backButton.appendChild(getHome());

    //Create the search input
    var searchInput = document.createElement('input');
    searchInput.setAttribute('placeholder', 'Suche');
    searchInput.setAttribute('type', 'search');
    searchInput.setAttribute('id', 'search');

    //Create the checkbox and checkbox label
    var autoplayCheckbox = document.createElement('input');
    autoplayCheckbox.setAttribute('type', 'checkbox');
    autoplayCheckbox.setAttribute('class', 'vis-hidden');
    autoplayCheckbox.setAttribute('id', 'auto');
    //Set the Checkbox to the current autoplay state
    autoplayCheckbox.checked = getCookie('autoplay');

    var autoplayLabel = document.createElement('label');
    autoplayLabel.setAttribute('id', "autolabel");
    autoplayLabel.setAttribute('for', 'auto');
    autoplayLabel.innerHTML = 'Autoplay';

    //Create the left container
    leftCon.appendChild(backButton);
    leftCon.appendChild(searchInput);
    leftCon.appendChild(autoplayCheckbox);
    leftCon.appendChild(autoplayLabel);

    //Create the menu container
    menuCon.appendChild(leftCon);
    menuCon.appendChild(rightCon);
    baseCon.appendChild(menuCon);

    //Add events

    searchInput.addEventListener("input", searchEv);

    //add events to search and autoplay
    autoplayCheckbox.addEventListener('change', function () {
        var auto = document.getElementById('auto');
        setCookie('autoplay', auto.checked, false);
    });

    //Make a start last episode banner
    var nextDiv = document.createElement('div');
    nextDiv.setAttribute('id', 'nextDiv');

    //Button for Continue
    var nextButton1 = document.createElement('div');
    nextButton1.innerHTML = 'Weiter schauen';

    //Just for style
    var nextButton2 = document.createElement('div');
    nextButton2.appendChild(getArrow());

    //Append content
    nextDiv.appendChild(nextButton1);
    nextDiv.appendChild(nextButton2);

    //Open next episode on click
    nextDiv.addEventListener('click', function () {
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
    });

    baseCon.appendChild(nextDiv);

    //Return menü
    return baseCon;
}

/**
 * Controlls the searchbar and checks the {DOM} contentContainer for tables with {DOM} child {id} 1.
 * Set display {String} "none" to {DOM} children without {String} searchterm.
 * For {String} term {String} ">log" {function} searchEv links to {Path} '/log'
 */
var searchEv = function () {
    //Search

    //get the searchterm
    var searchTerm = document.getElementById('search').value.toLowerCase();

    if (searchTerm == '>log') {
        window.location = "https://bs.to/log";
    } else if (searchTerm == '>conf') {
        window.location = "https://bs.to/log?data";
    }

    var container = document.getElementById('contentContainer');
    var tables = container.getElementsByTagName('table');

    var startRow = document.getElementById('1');

    var searchTable = null;
    for (i = 0; i < tables.length; i++) {
        if (isDescendant(tables[i], startRow)) {
            searchTable = tables[i];
            break;
        }
    }

    if (searchTable === null) {
        return false;
    }

    var allContent = searchTable.getElementsByTagName('tr');

    var startIndex = 0;
    if (document.getElementById('headRow') !== null) {
        startIndex++;
    }

    for (i = startIndex; i < allContent.length; i++) {
        var innerString = allContent[i].textContent.toLowerCase();

        //Check if the inner contains the searchterm
        if (!innerString.includes(searchTerm)) {
            //Magic
            allContent[i].style.display = 'none';
        } else {
            //No magic
            allContent[i].style.display = '';
        }
    }
    lastFocus = 0;
};

/**
 * Checks if {DOM} child has {DOM} parent.
 * @return {boolean} if {DOM} child has {DOM} parent.
 */
function isDescendant(parent, child) {
    if (child !== null) {
        var node = child.parentNode;
        while (node != null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
    return false;
}

/**
 * Provides an {DOM} headNode with css link and title.
 * @return {DOM} Head element for the Bs pages.
 */
function createHead() {
    //Construct the head
    var headNode = document.createElement('head');
    var titleNode = document.getElementsByTagName('title')[0];
    var baseNode = document.getElementsByTagName('base')[0];
    var charsetNode = document.getElementsByTagName('meta')[0];
    var favNode = document.getElementsByTagName('link')[0];

    //Add styleSheet
    var styles = "@import url('" + cssLink + "');";
    var styleNode = document.createElement('link');
    styleNode.rel = 'stylesheet';
    styleNode.href = 'data:text/css,' + escape(styles);

    headNode.appendChild(charsetNode);
    headNode.appendChild(baseNode);
    headNode.appendChild(favNode);
    headNode.appendChild(titleNode);
    headNode.appendChild(styleNode);

    return headNode;
}

/**
 * Adds a unclickable container with a unselectable Text over the page.
 */
function makeKeyOnly() {
    //Black page over original
    var kOnly = document.createElement('div');
    var blackPStyle = 'width:100%; height:100%; position:fixed; top:0; left:0; background:transparent; z-index:500';
    kOnly.setAttribute('style', blackPStyle);
    kOnly.setAttribute('id', 'keyonly');

    //Text on bottom right
    var textKey = document.createElement('span');
    textKey.innerHTML = 'Keyboard only';
    var keyStyle = 'position:fixed; color:#ee4d2e; bottom:0; right:0; font-size:20px; font-weight:bold;';
    textKey.setAttribute('style', keyStyle);

    kOnly.appendChild(textKey);

    var base = document.getElementById('baseCon');
    base.appendChild(kOnly);
}

/**
 * Removes the keyonly container
 */
function removeKeyOnly() {
    document.getElementById('keyonly').outerHTML = '';
}

/**
 * Makes the {DOM} blackP at the top.
 */
function makeBlackPage() {
    //Black page over original
    var blackP = document.createElement('div');
    var blackPStyle = 'width:100%; height:100%; position:fixed; top:0; left:0; background:#000; z-index:99';
    blackP.setAttribute('style', blackPStyle);
    blackP.setAttribute('id', 'blackP');
    document.documentElement.appendChild(blackP);
    document.documentElement.style.overflow = 'hidden'; // firefox, chrome
}

/**
 * Removes the {DOM} blackP and adds the {DOM} keyonly container.
 */
function removeBlackPage() {
    document.getElementById('blackP').outerHTML = '';
    document.documentElement.style.overflow = 'auto'; // firefox, chrome

    try {
        if (keyonly) {
            makeKeyOnly();
        }
    } catch (e) {}
}

/**
 * If variable is Undefined the Deafult value get returned
 * @param variable - Variable
 * @param defaultValue - Got returned if Variable is Undefined
 * @return not undefined
 */
function getDefault(variable, defaultValue) {
    if (typeof variable === 'undefined' || variable === null) {
        return defaultValue
    } else {
        return variable;
    }
}

/**
 * Inits a basepage with Menu and content-container.
 * Adds the {DOM} blackP over the rebuilding page and remove it after everything
 * is done.
 * Needs external function {function} initPage(contentcontainer):void for things
 * that can be done before rebuild the page.
 * Optional external function {afterInit} afterinit():void for things
 * that needed to be done after the page rebuild.
 * Messures the Time to initialise and rebuild the page.
 */
function init() { //Black page over original
    //Messure Time
    var start = new Date();

    makeBlackPage();

    //keyonly check
    if (getCookie('keyonly') == undefined) {
        keyonly = false;
        setCookie('keyonly', false, false);
    } else {
        keyonly = getCookie('keyonly');
    }

    //When document loaded
    $(document).ready(function () {
        //Change head
        var headElement = document.head;
        headElement.setAttribute('class', 'mainElement');
        headElement.innerHTML = createHead().innerHTML;

        //Body and Menu
        var newBody = document.createElement('body');
        var menu = createMenubar();

        //Container with Tables and stuffff
        var contantContainer = document.createElement('div');
        contantContainer.setAttribute('id', 'contentContainer');

        //Construct Base-Body
        newBody.appendChild(menu);
        newBody.appendChild(contantContainer);

        //Needed
        initPage(contantContainer);

        //Change body
        newBody.setAttribute('class', 'mainElement');
        document.body = newBody;

        //Write fav. Table
        updateFavorites();

        if (typeof afterInit === "function") {
            afterInit();
        }

        if (getCookie('debug')) {
            var time = new Date() - start;
            console.log('Executiontime: ' + time);
        }

        //New Time Messure
        start = new Date();

        //Delete blackP onload ... because the stylesheed needs to be loaded
        $(window).bind("load", function () {
            removeBlackPage();
            if (document.getElementById('plane') !== null) {
                document.documentElement.style.overflow = 'hidden'; // firefox, chrome
            }
            if (getCookie('debug')) {
                var loadTime = new Date() - start;
                console.log('Loadingtime: ' + loadTime);
            }
        });
    });
}
