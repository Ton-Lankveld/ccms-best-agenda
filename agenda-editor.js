/**
 * @name Agenda Editor
 * @description Edit the JSON file with the data of the Computer Club Medical Systems (CCMS) meetings.
 * @author Ton van Lankveld (ton.van.lankveld@philips.com)
 * @version 0.0.1 (2016-03-05)
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
    "use strict"
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
* @name buildHTMLagendaTable
* @description Build the HTML agenda table
* @param {array} agendaArray - Matrix with the data of the meetings
* @returns {string} HTMLout
*/
function buildHTMLagendaTable(agendaArray) {
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
    var i = 0; // Row number
    while (i < NoR) {
        HTMLrowOdd = "";
        HTMLrowEven = "";
        bttnEdit = "<button id=\'edit" + (i+1) +  "\' type=\'button\'>Wijzig</button>";
        bttnDel = "<button id=\'del" + (i+1) +  "\' type=\'button\'>Verwijder</button>";
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
* @returns {string} agendaArray or EMPTYARRAY
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
 * @name Main loop
 * @requires jQuery
 */
    "use strict";
    var JSONFILEPATH = "data/ccms-agenda.json";
    var agendaArrayNotSave = [];
    var agendaArrayLoadError = [{start:"",end:"",onderwerp:"De agenda wordt niet van de server opgehaald. Wacht een maar minuten en laad de Editor pagina dan opnieuw.<br>Als het probleem aanhoudt, neem dan contact op met Ton.",subject:"",groep:"",group:"",location:"",contact:"Ton van Lankveld",email:"websites@ccms-best.nl"}];
    var agendaArrayChecked = [];
    var meetingArray = [];
    var HTMLstr = "";
  
    $("section.error").hide();
    agendaArrayNotSave = loadJSONfromServer(JSONFILEPATH);
    if (!agendaArrayNotSave) {
        agendaArrayChecked = agendaArrayLoadError;
    } else {
        // Sanatize and validate uploaded agenda data
        for (var i in agendaArrayNotSave) {
            meetingArray = agendaArrayNotSave[i];
            agendaArrayChecked[i] = filterValidateMeetingArray(meetingArray);
        }
    }
    HTMLstr = buildHTMLagendaTable(agendaArrayChecked);
    $("#meetings").prepend(HTMLstr);
 
