/**
 * @file Searches for artists.
 * @author Michal Zbranek
 */
var sPageURL = window.location.search.substring(1);
var sURLVariables = sPageURL.split('&');
for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == 'artist'){
        searchArtist(sParameterName[1]);
    }
}

/**
 * Request data from API.
 * @param {string} artistName - Name of the artist.
 */
    function searchArtist(artistName){
        var url = "http://api.jambase.com/artists?name=" + artistName + "&page=0&api_key=cncesqtwe3w8gpstey3abca4";
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
            document.getElementById("artists").innerHTML = table;
            return;
        }
        for (var i = 0; i < xmlDoc.getElementsByTagName("TotalResults")[0].childNodes[0].nodeValue; i++) {
            var url2 = "eventArtist.html?id=" + xmlDoc.getElementsByTagName("Id")[i].childNodes[0].nodeValue + "&name=" + xmlDoc.getElementsByTagName("Name")[i].childNodes[0].nodeValue;
            table += "<tr><td><a href='"+url2+"'>" + xmlDoc.getElementsByTagName("Name")[i].childNodes[0].nodeValue + "</a></td></tr>";
        }
        document.getElementById("artists").innerHTML = table;
    }
