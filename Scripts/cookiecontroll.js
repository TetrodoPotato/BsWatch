/**
 * Set a cookie.
 * @param {String} name - cookie name.
 * @param {String} value - cookie value.
 * @param {Boolean} perma - if the cookie doesn't expire after Browser close.
 */
function setCookie(name, value, perma) {
    var expires = '';

    //For permanent cookie
    if (perma) {
        var d = new Date();
        //expires in 9999days
        d.setTime(d.getTime() + (9999 * 24 * 60 * 60 * 1000));
        var expires = ";expires=" + d.toUTCString();
    }
    //For subdomains
    var website_host;
    var website_host_buff = window.location.hostname;

    if (website_host_buff.split('.').length > 2) {
        var buffHost = website_host_buff.split('.');
        website_host = buffHost[buffHost.length - 2] + '.' + buffHost[buffHost.length - 1];
    } else {
        website_host = website_host_buff;
    }

    //Create new cookie
    document.cookie = name + "=" + value + expires + ";path=/;domain=." + website_host;
}

/**
 * Get a cookie.
 * @param {String} cname - name of cookie.
 * @return int/float/boolean/string. Undefined if cookie dont exist.
 */
function getCookie(cname) {
    //Name if the cookie
    var name = cname + "=";
    //The complete cookie string
    var decodedCookie = decodeURIComponent(document.cookie);
    //Cookie array
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        //Current cookie
        var c = ca[i].trim();

        //When the name is part of the string
        if (c.indexOf(name) == 0) {
            //Only the string value after 'cname='
            var returnVal = c.substring(name.length, c.length);

            //Pase values in boolean int and string
            if (returnVal.toLowerCase() == 'true') {
                return true;
            } else if (returnVal.length == 0) {
                return '';
            } else if (returnVal.toLowerCase() == 'false') {
                return false;
            } else if (!isNaN(returnVal) && returnVal.toString().indexOf('.') != -1) {
                return parseFloat(returnVal);
            } else if (!isNaN(returnVal)) {
                return parseInt(returnVal);
            } else {
                return returnVal;
            }
        }
    }
    //Cookie is undefined when not found
    return undefined;
}

/**
 * Remove a cookie.
 * @param {String} name - name of cookie.
 */
function removeCookie(name) {
    //Set the cookie to a expired date
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
