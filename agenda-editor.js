/**
 * @name Agenda Editor
 * @description Edit the JSON file with the data of the Computer Club Medical Systems (CCMS) meetings.
 * @author Ton van Lankveld (ton.van.lankveld@philips.com)
 * @version 0.0.1 (2016-05-15)
 *
 * Used library: jQuery 1.11.3 (http://jquery.com/)
 *               jQuery plugin: jquery.json 2.5.1 (https://github.com/krinkle/jquery-json)
 *
 * Documentation: JsDoc 3 Toolkit (http://usejsdoc.org/)
 */

/**
* @function
* @name blinkServerIndicator
* @description Let the server indictor blink one time.
* @param {string} status - Server status: 'ok' | 'fault'
* @returns None
*/
function blinkServerIndicator(status) {
    "use strict";
    if ((status === 'ok') || (status === 'fault')) {
        var trans = $('#ServerIndicator').addClass(status);
        setTimeout(function() {
        trans.removeClass(status);
    }, 1000);
    }
    return;
}

/**
* @function
* @name whiteFilterStr
* @description Filter a string and allow only characters in the white list string
* @param {string} inputStr - String to be sanatized
* @param {string} whiteListStr - Allowed characters
* @return {string} cleanStr - Sanatized string. If fault then empty
*/
function whiteFilterStr(inputStr, whiteListStr) {
    "use strict";
    var cleanStr = "";
    var inputStrLength = 0;
    var character = "";
    
    if ((typeof inputStr !== "string") || (typeof whiteListStr !== "string")) {
        return cleanStr;
    }
    inputStrLength = inputStr.length;
    // Filter the input string with the whitelist
    var i = 0;
    while (i < inputStrLength) {
        character = inputStr.charAt(i);
        if (whiteListStr.indexOf(character) !== -1) {
            cleanStr += character;
        }
        i += 1;
    }
    return cleanStr;
}

/**
* @function
* @name filterValidateIso8601
* @description Filter and validate a string with local date-time data in ISO8601 format
* @requires whiteFilterStr()
* @param {string} inputStr - ISO8601 data-time data
* @return {string} iso8601Str - Correct ISO8601 string. If fault then empty
*/
function filterValidateIso8601(inputStr) {
    "use strict";
    var iso8601Str = "";
    var WHITELIST = "0123456789-:T";
    var ISO8601PATTERN = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;  // Format: yyyy-mm-ddThh:mm:ss
    if (typeof inputStr !== "string") {
        return iso8601Str;
    }
    iso8601Str = whiteFilterStr(inputStr, WHITELIST);
    var result = iso8601Str.match(ISO8601PATTERN);
    if (result === null) {
        iso8601Str = "";
    }
    return iso8601Str;
}

/**
* @function
* @name filterValidateMeetingObject
* @description Filter and validate the strings of one meeting
* @requires filterValidateIso8601()
* @param {array} meetingObj - The meeting parameters with input strings of: start, end, onderwerp, subject, groep, group, location, contact and email
* @return {array} cleanObj - The clean strings
*/
function filterValidateMeetingObject(meetingObj) {
    "use strict";
    var cleanObj = {
        start: "",
        end: "",
        onderwerp: "",
        subject: "",
        groep: "",
        group: "",
        location: "",
        contact: "",
        email: ""
    };
    var REPATTERN = /<(?:.|\n)*?>/gm; // Regular Expresion pattern for HTML/XML tags
    
    if (meetingObj.hasOwnProperty('start')) {
        var startClean = filterValidateIso8601(meetingObj.start);
        if (startClean !== "") {
            cleanObj.start = startClean;
        }
    }
    if (meetingObj.hasOwnProperty('end')) {
        var endClean = filterValidateIso8601(meetingObj.end);
        if (endClean !== "") {
            cleanObj.end = endClean;
        }
    }
    if (meetingObj.hasOwnProperty('onderwerp')) {
        var onderwerpClean = meetingObj.onderwerp.replace(REPATTERN, '');  // Must find regex pattern wich allow for <a> and <br>
        if (onderwerpClean !== "") {
            cleanObj.onderwerp = onderwerpClean;
        }
    }
    if (meetingObj.hasOwnProperty('subject')) {
        var subjectClean = meetingObj.subject.replace(REPATTERN, '');  // Must find regex pattern wich allow for <a> and <br>
        if (subjectClean !== "") {
            cleanObj.subject = subjectClean;
        }
    }
    if (meetingObj.hasOwnProperty('groep')) {
        var groepClean = meetingObj.groep.replace(REPATTERN, '');
        if (groepClean !== "") {
            cleanObj.groep = groepClean;
        }
    }
    if (meetingObj.hasOwnProperty('group')) {
        var groupClean = meetingObj.group.replace(REPATTERN, '');
        if (groupClean !== "") {
            cleanObj.group = groupClean;
        }
    }
    if (meetingObj.hasOwnProperty('location')) {
        var locationClean = meetingObj.location.replace(REPATTERN, '');
        if (locationClean !== "") {
            cleanObj.location = locationClean;
        }
    }
    if (meetingObj.hasOwnProperty('contact')) {
        var contactClean = meetingObj.contact.replace(REPATTERN, '');
        if (contactClean !== "") {
            cleanObj.contact = contactClean;
        }
    }
    if (meetingObj.hasOwnProperty('email')) {
        var emailStr = meetingObj.email;
        var result = emailStr.match(/^[A-Z0-9+_.-]+@[A-Z0-9.-]+$/i); // Check for valid e-mail address
        if (result !== null) {
            cleanObj.email = emailStr;
        }
    }
    return cleanObj;
}

/**
* @function
* @name iso8601toStringNl
* @description Convert ISO8601 string to a readable Dutch date, like; Ma 21 dec 2015
* @param {string} iso8601Str - Date in ISO8601 format; yyyy-mm-ddThh:mm:ss
* @returns {string} outStr
*/
function iso8601toStringNl(iso8601Str) {
    "use strict";
    var MONTHS = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
    var DAYOFTHEWEEK = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
    var outStr = "";
    
    var yearInt = parseInt(iso8601Str.substring(0,4));
    var monthInt = parseInt(iso8601Str.substring(5,7));
    var dayInt = parseInt(iso8601Str.substring(8,10));
    var d = new Date(yearInt, (monthInt-1), dayInt);
    var dayOfTheWeekInt = d.getDay();
    outStr = DAYOFTHEWEEK[dayOfTheWeekInt] + " " + dayInt + " " + MONTHS[(monthInt-1)] + " " + yearInt;
    return outStr;
}

/**
* @function
* @name buildHTMLagendaTable
* @description Build the HTML agenda table, with or without the Edit and Delete buttons
* @param {array} agendaArray - Matrix with the data of the meetings
* @param {boolean} allowButtons - Place Edit and Delete buttons in table
* @returns {string} HTMLout
*/
function buildHTMLagendaTable(agendaArray, allowButtons) {
    "use strict";
    var HTMLout = "";
    var HTMLtableBegin = "<table>\n<caption>Data van de komende bijeenkomsten</caption>\n<thead>\n<tr><th></th><th scope=\"col\">Datum</th><th scope=\"col\">Tijd</th><th scope=\"col\">Onderwerp</th><th scope=\"col\">Groep</th><th scope=\"col\">Locatie</th><th scope=\"col\">Contactpersoon</th><th></th></tr>\n</thead>\n<tbody>";
    var HTMLtbody = "";
    var HTMLtableEnd = "</tbody>\n</table>";
    var HTMLrowOdd = "";
    var HTMLrowEven = "";
    var oTRoTDRS2 = "<tr><td rowspan=\'2\'>";
    var cTDoTDRS2 = "</td><td rowspan=\'2\'>";
    var bttnEdit = "";
    var bttnDel = "";
    var meetingIso8601Str = "";
    var meetingDateStr = "";
    var SaST = ""; // Start and Stop Time of meeting

    var NoR = agendaArray.length; // Number of Rows
    if ((allowButtons !== true) && (allowButtons !== false)) {
        allowButtons = false;
    }
    var i = 0; // Row number
    while (i < NoR) {
        HTMLrowOdd = "";
        HTMLrowEven = "";
        if (allowButtons) {
            bttnEdit = "<button type=\'button\' class=\'edit\'>Wijzig</button>";
            bttnDel = "<button type=\'button\' class=\'del'>Verwijder</button>";
        }
        meetingIso8601Str = (agendaArray[i].start).substring(0,10);
        meetingDateStr = iso8601toStringNl(meetingIso8601Str);
        SaST = (agendaArray[i].start).substring(11,16) + " - " + (agendaArray[i].end).substring(11,16) + " uur";
        HTMLrowOdd = oTRoTDRS2 + bttnEdit + cTDoTDRS2 + meetingDateStr + cTDoTDRS2 + SaST + "</td><td>" + agendaArray[i].onderwerp + "</td><td>" + agendaArray[i].groep + cTDoTDRS2 + agendaArray[i].location + "</td><td>" + agendaArray[i].contact + cTDoTDRS2 + bttnDel + "</td></tr>\n";
        HTMLrowEven = "<tr><td>" + agendaArray[i].subject + "</td><td>" + agendaArray[i].group + "</td><td>" + agendaArray[i].email + "</td></tr>\n";
        HTMLtbody = HTMLtbody + HTMLrowOdd + HTMLrowEven;
        i += 1;
    }
    HTMLout = HTMLtableBegin + HTMLtbody + HTMLtableEnd;
    return HTMLout;
}

/**
* @function
* @name deleteMeeting
* @description Delete one row of the agenda
* @param {array} agendaArray - Matrix with the data of the meetings
* @param {int} rowNumber - Number of row to be deleted
* @returns {array} agendaArray or EMPTYARRAY
*/
function deleteMeeting(agendaArray, rowNumber) {
    "use strict";
    var EMPTYARRAY = [];

    var NoR = agendaArray.length;  // Number of Rows
    if (NoR < (rowNumber - 1)) {
        return agendaArray;
    }
    if (NoR < 1) {
        return EMPTYARRAY;
    }
    agendaArray.splice(rowNumber, 1);
    return agendaArray;
}

/**
* @function
* @name sortAgenda
* @description Sort the meetings on date-time, of the 'start'key
* @param {array} agendaArr - Agenda array to be sorted
* @return {array} agendaArr - Sorted agenda array
*/
function sortAgenda(agendaArr) {
    "use strict";
    if (agendaArr.length < 2) {
        return agendaArr;
    }
    agendaArr.sort(function(a, b) {
        var dateA = new Date(a.start);
        var dateB = new Date(b.start);
        return dateA - dateB; //sort by date ascending
    });
    return agendaArr;
}

/**
* @function
* @name addMeetingMode
* @description Add one row to the agenda, rebuild agenda table
* @requires buildHTMLagendaTable()
* @param {array} agendaArr - Matrix with the data of the meetings
* @return {array} newArray - agendaArray or empty array
*/
function addMeetingMode(agendaArr) {
    "use strict";
    var newArray = [];
	var htmlStr = "";
    
    if (event.which !== 13) { // 13 = Enter key
        return
    }
    alert( "Add row mode active" );
    // newArray = addMeeting(agendaArray);
    htmlStr = buildHTMLagendaTable(newArray, false);
    return = newArray;
}

/**
* @function
* @name sortAgendaMode
* @description Sort the agenda, rebuild agenda table
* @requires sortAgenda()
* @requires buildHTMLagendaTable()
* @param {array} agendaArr - Matrix with the data of the meetings
* @return {array} newArray - agendaArr or empty array
*/
function sortAgendaMode(agendaArr) {
    "use strict";
    var newArray = [];
    var htmlStr = "";
    
    if (event.which !== 13) { // 13 = Enter key
        return
    }
    newArray = sortAgenda(agendaArr);
    htmlStr = buildHTMLagendaTable(newArray, true);
    $("#meetings table").replaceWith(HTMLstr);
    return = newArray;
}

/**
* @function
* @name editMeetingMode
* @description Edit one row of the agenda, rebuild agenda table
* @requires buildHTMLagendaTable()
* @param {array} agendaArr - Matrix with the data of the meetings
* @return {array} newArray - agendaArr or empty array
*/
function editMeetingMode(agendaArr) {
    "use strict";
    var editRowNumber = 1;  // 2nd row
    var newArray = [];
	var htmlStr = "";
    
    if (event.which !== 13) { // 13 = Enter key
        return
    }
    alert( "Edit row mode active" );
    // newArray = editMeeting(agendaArr, delRowNumber);
    htmlStr = buildHTMLagendaTable(newArray, false);
    return = newArray;
}

/**
* @function
* @name delMeetingMode
* @description Delete one row of the agenda, rebuild agenda table
* @requires deleteMeeting()
* @requires buildHTMLagendaTable()
* @param {array} agendaArr - Matrix with the data of the meetings
* @return {array} newArray - agendaArr or empty array
*/
function delMeetingMode(agendaArr) {
    "use strict";
    var delRowNumber = 1;  // 2nd row
    var newArray = [];
    var htmlStr = "";
    
    if (event.which !== 13) { // 13 = Enter key
        return
    }
    alert( "Delete row mode active" );
    newArray = deleteMeeting(agendaArr, delRowNumber);
    htmlStr = buildHTMLagendaTable(newArray, true);
    return = newArray;
}


/**
* @name Main loop
* @requires jQuery
*/
        var agendaArray1 = [
    {
        "start":"2016-12-21T10:30:00",
        "end":"2016-12-21T12:00:00",
        "onderwerp":"Energiemonitor V2 en vervolg project",
        "subject":"Energy monitor V2 and next project",
        "groep":"Microcontrollers",
        "group":"Micro Controllers",
        "location":"QCC2",
        "contact":"Kees Pompe",
        "email":"ucontrollers@ccms-best.nl"
      },
      {
        "start":"2016-12-21T12:00:00",
        "end":"2016-12-21T13:00:00",
        "onderwerp":"Verkoop en Uitleen",
        "subject":"Sales and Lending",
        "groep":"QCC",
        "group":"QCC",
        "location":"QCC",
        "contact":"",
        "email":"info@ccms-best.nl"
      },
      {
        "start":"2016-12-21T13:00:00",
        "end":"2016-12-21T13:30:00",
        "onderwerp":"",
        "subject":"",
        "groep":"Pensionados",
        "group":"Pensionados",
        "location":"QCC2",
        "contact":"Henry Boudewijns",
        "email":"pensionados@ccms-best.nl"
    }
    ];
    var agendaArray2 = [
    {
        "start":"2016-12-21T10:30:00",
        "end":"2016-12-21T12:00:00",
        "onderwerp":"Energiemonitor V2 en vervolg project",
        "subject":"Energy monitor V2 and next project",
        "groep":"Microcontrollers",
        "group":"Micro Controllers",
        "location":"QCC2",
        "contact":"Kees Pompe",
        "email":"ucontrollers@ccms-best.nl"
      },
      {
        "start":"2016-12-21T13:00:00",
        "end":"2016-12-21T13:30:00",
        "onderwerp":"",
        "subject":"",
        "groep":"Pensionados",
        "group":"Pensionados",
        "location":"QCC2",
        "contact":"Henry Boudewijns",
        "email":"pensionados@ccms-best.nl"
      },
      {
        "start":"2016-12-21T12:00:00",
        "end":"2016-12-21T13:00:00",
        "onderwerp":"Verkoop en Uitleen",
        "subject":"Sales and Lending",
        "groep":"QCC",
        "group":"QCC",
        "location":"QCC",
        "contact":"",
        "email":"info@ccms-best.nl"
      }
    ];
    var HTMLstr = "";
  
    $("section.error").hide();
    
    HTMLstr = buildHTMLagendaTable(agendaArray2, true);
    $("#meetings").prepend(HTMLstr);
    // Button events
    $("table button.del").on("click keypress", agendaArray2, delMeetingMode);
    $("table button.edit").on("click keypress", agendaArray2, editMeetingMode);
    $("button#add").on("click keypress", agendaArray2, addMeetingMode);
    $("button#sort").on("click keypress", agendaArray2, sortAgendaMode);
