/**
 * @file Searches for the venues.
 * @author Michal Zbranek
 */
var sPageURL = window.location.search.substring(1);
var sURLVariables = sPageURL.split('&');
for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == 'venue'){
        searchVenue(sParameterName[1]);
    }
}

/**
 * Request data from API.
 * @param {string} venueName - Name of the venue.
 */
    function searchVenue(venueName){
        var url = "http://api.jambase.com/venues?name=" + venueName + "&page=0&api_key=cncesqtwe3w8gpstey3abca4";
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200){
                parseXML(xmlHttp);
            }
        };
        xmlHttp.open("GET", url, true);
        xmlHttp.send();
    }

    /**
     * Parse the XML file and store its content.
     * @param {string} xml - xml response from API.
     */
    function parseXML(xml) {
        var table = "";
        var xmlDoc = xml.responseXML;
        var total = xmlDoc.getElementsByTagName("TotalResults")[0].childNodes[0].nodeValue;
        if ( total == 0){
            table = "<li>Zero results were found.</li>";
            document.getElementById("venues").innerHTML = table;
            return;
        }
        for (var i = 0; i < xmlDoc.getElementsByTagName("TotalResults")[0].childNodes[0].nodeValue; i++) {
          try {
            var url2 = "venueDetail.html?id=" + xmlDoc.getElementsByTagName("Id")[i].childNodes[0].nodeValue;
            table += "<tr><td><a href='"+url2+"'>" + xmlDoc.getElementsByTagName("Name")[i].childNodes[0].nodeValue + "</a></td></tr>";
          } catch (err) {}
        }
        document.getElementById("venues").innerHTML = table;
    }
