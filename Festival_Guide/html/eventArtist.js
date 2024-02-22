/**
 * @file Retrieves and displays information about the event of the artist.
 * @author Michal Zbranek
 */
var sPageURL = window.location.search.substring(1);
var sURLVariables = sPageURL.split('&');
var artistId, artistName;
var sfm = false;
var table = "";
for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == 'id'){
        artistId = sParameterName[1];
    }
    if (sParameterName[0] == 'name'){
        artistName = sParameterName[1];
    }
    if (sParameterName[0] == 'sfm'){
        sfm = true;
    }
}
if ((localStorage.getItem("a" + artistId) == null)||(sfm == true)) {
    searchArtist(artistId);
}else{
    for (var i = 0; i < localStorage.length; i++) {
        if ( localStorage.key(i).substring(0,1).localeCompare('e') == 0) {
            for (var x=0; x < localStorage.getItem(localStorage.key(i)).split('+')[13]; x++) {
              if (localStorage.getItem(localStorage.key(i)).split('+')[14+x].localeCompare(localStorage.getItem("a" + artistId)) == 0) {
                drawTable(localStorage.key(i).substring(1));
                table += "<hr width='100%' size='5' color='#00586A'>";
              }
            }
        }
        document.getElementById("events").innerHTML = table;
    }
    table += "<a class='url' href='wikipedia.html?artist=" + artistName + "'><b>Wikipedia info</b></a>";
    table += "<br><a class='url' href='eventArtist.html?id=" + artistId + "&name=" + artistName + "&sfm=true'><b>Search for more</b></a>";
    document.getElementById("events").innerHTML = table;
}

/**
 * Show event information of artist.
 * @param {string} number - id of the event.
 */
function drawTable(number) {
  var venueVariables = localStorage.getItem("e" + number).split('+');
  for (var i = 0; i < venueVariables.length; i++) {
      switch (i) {
        case 0: table += "<li class='events'>Date: " + venueVariables[i] + "</li>";
          break;
        case 1: table += "<br><li class='events' style='height:15px; font-size:15px'><b>Name: " + venueVariables[i] + "</b></li>";
          break;
        case 2: table += "<br><li class='events'>Address: " + venueVariables[i] + "</li>";
          break;
        case 3: table += "<li class='events'>, City: " + venueVariables[i] + "</li>";
          break;
        case 4: table += "<li class='events'>, State: " + venueVariables[i] + "</li>";
          break;
        case 5: table += "<li class='events'>, StateCode: " + venueVariables[i] + "</li>";
          break;
        case 6: table += "<li class='events'>, Country: " + venueVariables[i] + "</li>";
          break;
        case 7: table += "<li class='events'>, CountryCode: " + venueVariables[i] + "</li>";
          break;
        case 8: table += "<li class='events'>, ZipCode: " + venueVariables[i] + "</li>";
          break;
        case 9: { if (venueVariables[i] != "0") {
                    table += "<li class='events'>, Latitude: " + venueVariables[i] + "</li>";}
                }
          break;
        case 10: { if (venueVariables[i] != "0") {
                    table += "<li class='events'>, Longitude: " + venueVariables[i] + "</li>";}
                }
          break;
        case 11: { if (venueVariables[i] != "Not found"){
                       table += "<br><a class='url' href='" + venueVariables[i] + "'><li class='events'>Url: " + venueVariables[i] + "</li></a>";
                   } else { table += "<br><li class='events'>Url: " + venueVariables[i] + "</li>"; }
                 }
          break;
        case 12: { if (venueVariables[i] != "Not found"){
                      table += "<br><a class='url' href='" + venueVariables[i] + "'<br><li class='events'>Show on map</li></a>";}
                 }
          break;
        default:
      }
  }
  for (var x=0; x<venueVariables[13]; x++) {
    for(var i=0;i<localStorage.length;i++){
      if ( localStorage.key(i).substring(0,1).localeCompare('a') == 0) {
        if (localStorage.getItem(localStorage.key(i)).localeCompare(venueVariables[14+x]) == 0){
            var id = localStorage.key(i).substring(1);
        }
      }
    }
    table += "<br><a class='url' href='eventArtist.html?id=" + id + "&name=" + venueVariables[14+x] + "'><li class='events' style='height:15px; font-size:15px'><b>Artist: " + venueVariables[14+x] + "</b></li></a>";
  }
  var ticketUrl = venueVariables[parseInt(venueVariables[13])+14];
  if (ticketUrl != "Not found"){
    table += "<br><a class='url' href='" + ticketUrl + "'><li class='events'>Buy tickets: " + ticketUrl + "</li></a>";
  } else { table += "<br><li class='events'>Buy tickets: " + ticketUrl + "</li>"; }
}

/**
 * Request data from API.
 * @param {string} artistId - id of the artist.
 */
function searchArtist(artistId) {
    var url = "http://api.jambase.com/events?artistId=" + artistId + "&page=0&api_key=cncesqtwe3w8gpstey3abca4";
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
    var eventId, Name, Address, City, State, StateCode, Country, CountryCode,
    ZipCode, Latitude, Longitude, Url, Map, Artist1, Artist2, Artist3, venueId,
    artist1Id, artist2Id, artist3Id, tickerUrl, Date;
    var total = xmlDoc.getElementsByTagName("TotalResults")[0].childNodes[0].nodeValue;
    if ( total == 0){
        table = "<li>Zero results were found.</li>";
        document.getElementById("events").innerHTML = table;
        return;
    }
    localStorage.setItem("a" + artistId, artistName);
    for (var i = 0; i < xmlDoc.getElementsByTagName("TotalResults")[0].childNodes[0].nodeValue; i++) {

      try {
          Date = xmlDoc.getElementsByTagName("Events")[i].childNodes[1].childNodes[0].nodeValue;
          eventId = xmlDoc.getElementsByTagName("Events")[i].childNodes[0].childNodes[0].nodeValue;
          venueId = xmlDoc.getElementsByTagName("Venue")[i].childNodes[0].childNodes[0].nodeValue;
      } catch (err) {}
      try {
          Name = xmlDoc.getElementsByTagName("Venue")[i].childNodes[1].childNodes[0].nodeValue;
      } catch (err) {Name = "Not found";}
      try {
          Address = xmlDoc.getElementsByTagName("Venue")[i].childNodes[2].childNodes[0].nodeValue;
      } catch (err) {Address = "Not found";}
      try {
          City = xmlDoc.getElementsByTagName("Venue")[i].childNodes[3].childNodes[0].nodeValue;
      } catch (err) {City = "Not found";}
      try {
          State = xmlDoc.getElementsByTagName("Venue")[i].childNodes[4].childNodes[0].nodeValue;
      } catch (err) {State = "Not found";}
      try {
          StateCode = xmlDoc.getElementsByTagName("Venue")[i].childNodes[5].childNodes[0].nodeValue;
      } catch (err) {StateCode = "Not found";}
      try {
          Country = xmlDoc.getElementsByTagName("Venue")[i].childNodes[6].childNodes[0].nodeValue;
      } catch (err) {Country = "Not found";}
      try {
          CountryCode = xmlDoc.getElementsByTagName("Venue")[i].childNodes[7].childNodes[0].nodeValue;
      } catch (err) {CountryCode = "Not found";}
      try {
          ZipCode = xmlDoc.getElementsByTagName("Venue")[i].childNodes[8].childNodes[0].nodeValue;
      } catch (err) {ZipCode = "Not found";}
      try {
          Latitude = xmlDoc.getElementsByTagName("Venue")[i].childNodes[10].childNodes[0].nodeValue;
      } catch (err) {Latitude = "Not found";}
      try {
          Longitude = xmlDoc.getElementsByTagName("Venue")[i].childNodes[11].childNodes[0].nodeValue;
      } catch (err) {Longitude = "Not found";}
      try {
          Url = xmlDoc.getElementsByTagName("Venue")[i].childNodes[9].childNodes[0].nodeValue;
      } catch (err) {Url = "Not found";}
      if (Latitude != "0"){
          Map = "map.html?latitude=" + Latitude + "&longitude=" + Longitude;
      } else {Map = "Not found";}
      try {
          ticketUrl = xmlDoc.getElementsByTagName("TicketUrl")[i].childNodes[0].nodeValue;
      } catch (err) {ticketUrl = "Not found"}

      var Artists = "";

      for(var x = 0; x < xmlDoc.getElementsByTagName("Artists")[i].childNodes.length; x++){
        Artists += xmlDoc.getElementsByTagName("Artists")[i].childNodes[x].childNodes[1].childNodes[0].nodeValue;
        Artists += "+";
        localStorage.setItem("a" + xmlDoc.getElementsByTagName("Artists")[i].childNodes[x].childNodes[0].childNodes[0].nodeValue,
        xmlDoc.getElementsByTagName("Artists")[i].childNodes[x].childNodes[1].childNodes[0].nodeValue);
      }

      var artistsCount = xmlDoc.getElementsByTagName("Artists")[i].childNodes.length;
      localStorage.setItem("e" + eventId, Date + "+" + Name + "+" + Address + "+" + City + "+" + State + "+" + StateCode + "+" +
      Country + "+" + CountryCode + "+" + ZipCode + "+" + Latitude + "+" + Longitude + "+" + Url + "+" + Map + "+" +
      artistsCount + "+" + Artists + ticketUrl);
      localStorage.setItem("v" + venueId, Name + "+" + Address + "+" + City + "+" + State + "+" + StateCode + "+" +
      Country + "+" + CountryCode + "+" + ZipCode + "+" + Latitude + "+" + Longitude + "+" + Url + "+" + Map);

      table += "<li class='events'>Date: " + Date + "</li>";
      table += "<br><li class='events' style='height:15px; font-size:15px'><b>Name: " + Name + "</b></li>";
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

      try {table += "<br><a class='url' href='" + xmlDoc.getElementsByTagName("Venue")[i].childNodes[9].childNodes[0].nodeValue + "'><li class='events'>Url: " + xmlDoc.getElementsByTagName("Venue")[i].childNodes[9].childNodes[0].nodeValue + "</li></a>";
      }
      catch(err) {table += "<br><li class='events'>Url: Not found</li>";}

      if(Latitude != "0"){
          var url2 = "map.html?latitude=" + Latitude + "&longitude=" + Longitude;
          table += "<br><a class='url' href='"+url2+"'<br><li class='events'>Show on map</li></a>";
      }

      for(var x = 0; x < xmlDoc.getElementsByTagName("Artists")[i].childNodes.length; x++){
        try {
            table += "<br><a class='url' href='eventArtist.html?id=" + xmlDoc.getElementsByTagName("Artists")[i].childNodes[x].childNodes[0].childNodes[0].nodeValue + "&name=" + xmlDoc.getElementsByTagName("Artists")[i].childNodes[x].childNodes[1].childNodes[0].nodeValue + "'><li class='events' style='height:15px; font-size:15px'><b>Artist: " + xmlDoc.getElementsByTagName("Artists")[i].childNodes[x].childNodes[1].childNodes[0].nodeValue + "</b></li></a>";
        }
        catch(err) {table += "<br><li class='events' style='height:15px; font-size:15px'><b>Artist: Not found</b></li>";}
      }

      try {table += "<br><a class='url' href='" + xmlDoc.getElementsByTagName("TicketUrl")[i].childNodes[0].nodeValue + "'><li class='events'>Buy tickets: " + xmlDoc.getElementsByTagName("TicketUrl")[i].childNodes[0].nodeValue + "</li></a>";
      }
      catch(err) {table += "<br><li class='events'>Buy tickets: Not found</li>";}

      table += "<hr width='100%' size='5' color='#00586A'>"
    }
    table += "<a class='url' href='wikipedia.html?artist=" + artistName + "'><b>Wikipedia info</b></a>";
    document.getElementById("events").innerHTML = table;
}
