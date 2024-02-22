/**
 * @file Displays information about the venue.
 * @author Michal Zbranek
 */
var sPageURL = window.location.search.substring(1);
var sURLVariables = sPageURL.split('&');
var Venue;
var table = "";
for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == 'id'){
        Venue = sParameterName[1];
    }
}

if (localStorage.getItem("v" + Venue) == null) {
    searchArtist(Venue);
    console.log("null");
}else{
    var venueVariables = localStorage.getItem("v" + Venue).split('+');
    for (var i = 0; i < venueVariables.length; i++) {
        switch (i) {
          case 0: table += "<li class='events' style='height:15px; font-size:15px'><b>Name: " + venueVariables[i] + "</b></li>";
            break;
          case 1: table += "<br><li class='events'>Address: " + venueVariables[i] + "</li>";
            break;
          case 2: table += "<li class='events'>, City: " + venueVariables[i] + "</li>";
            break;
          case 3: table += "<li class='events'>, State: " + venueVariables[i] + "</li>";
            break;
          case 4: table += "<li class='events'>, StateCode: " + venueVariables[i] + "</li>";
            break;
          case 5: table += "<li class='events'>, Country: " + venueVariables[i] + "</li>";
            break;
          case 6: table += "<li class='events'>, CountryCode: " + venueVariables[i] + "</li>";
            break;
          case 7: table += "<li class='events'>, ZipCode: " + venueVariables[i] + "</li>";
            break;
          case 8: { if (venueVariables[i] != "0") {
                      table += "<li class='events'>, Latitude: " + venueVariables[i] + "</li>";}
                  }
            break;
          case 9: { if (venueVariables[i] != "0") {
                      table += "<li class='events'>, Longitude: " + venueVariables[i] + "</li>";}
                  }
            break;
          case 10: { if (venueVariables[i] != "Not found"){
                         table += "<br><a class='url' href='" + venueVariables[i] + "'><li class='events'>Url: " + venueVariables[i] + "</li></a>";
                     } else { table += "<br><li class='events'>Url: " + venueVariables[i] + "</li>"; }
                   }
            break;
          case 11: { if (venueVariables[i] != "Not found"){
                        table += "<br><a class='url' href='" + venueVariables[i] + "'<br><li class='events'>Show on map</li></a>";}
                   }
            break;
          default:

        }
    }
    document.getElementById("venue").innerHTML = table;
    console.log("not null");
}

/**
 * Request data from API.
 * @param {string} Id - ID of the event.
 */
function searchArtist(Id){
    var url = "http://api.jambase.com/venues?id=" + Id + "&page=0&api_key=cncesqtwe3w8gpstey3abca4";
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
    var xmlDoc = xml.responseXML;
    var Name, Address, City, State, StateCode, Country, CountryCode, ZipCode, Latitude, Longitude, Url, Map;

    try {
        Name = xmlDoc.getElementsByTagName("Name")[0].childNodes[0].nodeValue;
    } catch (err) {Name = "Not found";}
    try {
        Address = xmlDoc.getElementsByTagName("Address")[0].childNodes[0].nodeValue;
    } catch (err) {Address = "Not found";}
    try {
        City = xmlDoc.getElementsByTagName("City")[0].childNodes[0].nodeValue;
    } catch (err) {City = "Not found";}
    try {
        State = xmlDoc.getElementsByTagName("State")[0].childNodes[0].nodeValue;
    } catch (err) {State = "Not found";}
    try {
        StateCode = xmlDoc.getElementsByTagName("StateCode")[0].childNodes[0].nodeValue;
    } catch (err) {StateCode = "Not found";}
    try {
        Country = xmlDoc.getElementsByTagName("Country")[0].childNodes[0].nodeValue;
    } catch (err) {Country = "Not found";}
    try {
        CountryCode = xmlDoc.getElementsByTagName("CountryCode")[0].childNodes[0].nodeValue;
    } catch (err) {CountryCode = "Not found";}
    try {
        ZipCode = xmlDoc.getElementsByTagName("ZipCode")[0].childNodes[0].nodeValue;
    } catch (err) {ZipCode = "Not found";}
    try {
        Latitude = xmlDoc.getElementsByTagName("Latitude")[0].childNodes[0].nodeValue;
    } catch (err) {Latitude = "Not found";}
    try {
        Longitude = xmlDoc.getElementsByTagName("Longitude")[0].childNodes[0].nodeValue;
    } catch (err) {Longitude = "Not found";}
    try {
        Url = xmlDoc.getElementsByTagName("Url")[0].childNodes[0].nodeValue;
    } catch (err) {Url = "Not found";}
    if (Latitude != "0"){
        Map = "map.html?latitude=" + Latitude + "&longitude=" + Longitude;
    } else {Map = "Not found";}

    localStorage.setItem("v" + Venue, Name + "+" + Address + "+" + City + "+" + State + "+" + StateCode + "+" +
    Country + "+" + CountryCode + "+" + ZipCode + "+" + Latitude + "+" + Longitude + "+" + Url + "+" + Map);

    table += "<li class='events' style='height:15px; font-size:15px'><b>Name: " + Name + "</b></li>";
    table += "<br><li class='events'>Address: " + Address + "</li>";
    table += "<li class='events'>, City: " + City + "</li>";
    table += "<li class='events'>, State: " + State + "</li>";
    table += "<li class='events'>, StateCode: " + StateCode + "</li>";
    table += "<li class='events'>, Country: " + Country + "</li>";
    table += "<li class='events'>, CountryCode: " + CountryCode + "</li>";
    table += "<li class='events'>, ZipCode: " + ZipCode + "</li>";

    if (Latitude!="0") {
        table += "<li class='events'>, Latitude: " + Latitude + "</li>";
        table += "<li class='events'>, Longitude: " + Longitude + "</li>";
    }

    try {table += "<br><a class='url' href='" + xmlDoc.getElementsByTagName("Url")[0].childNodes[0].nodeValue + "'><li class='events'>Url: " + xmlDoc.getElementsByTagName("Url")[0].childNodes[0].nodeValue + "</li></a>";
    }
    catch(err) {table += "<br><li class='events'>Url: Not found</li>";}

    if(Latitude != "0"){
        var url2 = "map.html?latitude=" + Latitude + "&longitude=" + Longitude;
        table += "<br><a class='url' href='"+url2+"'<br><li class='events'>Show on map</li></a>";
    }
    document.getElementById("venue").innerHTML = table;
}
