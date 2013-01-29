/**
 * Used to generate a google map showing all the points and
 *     relevant info in Alaska.
 * 
 * @author Jonathon McDonald <jon@onewebcentric.com>
 * @date 01/11/2013
 */
var map;
var service;
var infowindow;
var markersArray = [];

/**
 * When the body DOM is loaded, we can insert the google map, and start
 *     plotting points.  
 */
function initialize() {
	
	// Prepare building the map by setting the options
	var mapOptions = {
		center: new google.maps.LatLng(64.8443, -147.72),
		zoom: 4,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	// Initialize the map & info window
	map = new google.maps.Map(document.getElementById("map_canvas"), 
		mapOptions);
	infowindow = new google.maps.InfoWindow;

	generateMarkers(false);
}

function generateMarkers(byDate, date1, date2) {
	var show;

	if(byDate == null || (byDate != false && byDate != true )) {
		show = true;
		byDate = false;
	}

	// Get and parse the JSON
	$.getJSON("map-data.json", function(json) {
		// For debugging purposes only
		console.log(json);

		// Loop through each market and extract the appropriate data
		for(var i = 0; i<json.length; i++) {

			if(byDate) {
				show = false;
				var events = json[i].Market.Contact.Events;

				for(var b = 0; b<events.length; b++) {
					var startDate = events[b].start_date;

					if(isDateInBetween(new Date(date1), new Date(date2), new Date(startDate))) {
						show = true;
					}
				}
			}
			

			// Bind this to the window
			if(show) {
				// First instantiate the latitude and longitude
				var point = new google.maps.LatLng(
					parseFloat(json[i].Market.lat),
					parseFloat(json[i].Market.lng));

				// Next, using that point, generate a marker
				var marker = new google.maps.Marker({
					map: map,
					position: point
				});

				markersArray.push(marker);
				bindInfoWindow(marker, map, infowindow, json[i]);
			}
		}	
	});
}

/** 
 * Helper function that binds an info window with a particular marker,
 *     so that the user can easily click on a marker for relevant info
 *
 * @param {google.maps.Marker} obj Instance of the marker we are binding to
 * @param {google.maps.Map} obj The map object we are using
 * @param {google.maps.InfoWindow} obj The info window object provided by Google
 * @param {html} obj HTML that is used for content
 */
function bindInfoWindow(marker, map, infowindow, json) {
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(generateHTML(json));
		infowindow.open(map, marker);
		insertHTML(json);
	});
}

/**
 * Generates a variable containing HTML that is useful for the end user
 * 
 * @param {JSON Object} obj This JSON must be formatted a certain way
 * @return {html} obj HTML object containing data useful for infowindow
 */
function generateHTML(json) {
	var html;

	// First display some basic market info
	html = "<h2>" + json.Market.name + "</h2>";
	html += "<em>" + json.Market.street + ", " + json.Market.city + "</em><br />";
	html += "<em>" + json.Market.state + ", " + json.Market.zip + "</em><br />";

	// Next display the contact info
	html += json.Market.Contact.first + " " + json.Market.Contact.last + "<br />";
	html += (json.Market.Contact.email) ? json.Market.Contact.email + "<br />": "";

	return html;
}

/**
 * This function will display events for a given market.  
 *     For example, this will display the event times, dates, and what products are offered.
 *
 * @param {JSON Object} obj This JSON must be formatted a certain way
 */
function insertHTML(json) {
	var html, i;
	html = "<h1>" + json.Market.name + "</h1>";
	// First display each event occuring, just simply the dates...
	for(i = 0; i<json.Market.Contact.Events.length; i++) {
		// TODO:  Poor javascript
		var date = Date.parse(json.Market.Contact.Events[i].start_date);
		var date2 = Date.parse(json.Market.Contact.Events[i].end_date);
		var start = date.toString('dddd, MMMM d, yyyy');
		var end = date2.toString('dddd, MMMM d, yyyy');
		html += "<div class='hours'>";
		// Get the start date
		html += "<h3>";
		html += start;
		html += " - ";
		html += end;
		html += "</h3>";
		html += "<br />";

		// Show times...this is verbose
		// TODO:  Find a way to trim this down
		times = json.Market.Contact.Events[i];

		// TODO:  Poor javascript
		html += "<p>";
		html += "<b>Hours</b><br />";
		html += (times.monday_open != "00:00:00") ? "Monday:  " + times.monday_open.slice(0, 5) + " - " + times.monday_close.slice(0, 5) + "<br />" : "";
		html += (times.tuesday_open != "00:00:00") ? "Tuesday:  " + times.tuesday_open.slice(0, 5) + " - " + times.tuesday_close.slice(0, 5) + "<br />" : "";
		html += (times.wednesday_open != "00:00:00") ? "Wednesday:  " + times.wednesday_open.slice(0, 5) + " - " + times.wednesday_close.slice(0, 5) + "<br />" : "";
		html += (times.thursday_open != "00:00:00") ? "Thursday:  " + times.thursday_open.slice(0, 5) + " - " + times.thursday_close.slice(0, 5) + "<br />" : "";
		html += (times.friday_open != "00:00:00") ? "Friday:  " + times.friday_open.slice(0, 5) + " - " + times.friday_close.slice(0, 5) + "<br />" : "";
		html += (times.saturday_open != "00:00:00") ? "Saturday:  " + times.saturday_open.slice(0, 5) + " - " + times.saturday_close.slice(0, 5) + "<br />" : "";
		html += (times.sunday_open != "00:00:00") ? "Sunday:  " + times.sunday_open.slice(0, 5) + " - " + times.sunday_close.slice(0, 5) + "<br />" : "";
		html += "</p>";
		html += "</div>";
	}
	$('#events').html(html);
}

/**
 * Simply checks to see if a date is later than the current date. 
 *
 * @param {Date Object} A date to compare to today
 * @return {bool} True if date passed is later than, or equal to, today's date.  False if in the past.  
 */
function isDateLaterThanToday(date) {
	var curr = new Date();
  
	if(curr <= date) {
		return true; 
	}
	return false;
}

/**
 * Simply checks to see if a date is later than the current date. 
 *
 * @param {Date Object} A date to compare to today
 * @return {bool} True if date passed is later than, or equal to, today's date.  False if in the past.  
 */
function isDateInBetween(fromDate, toDate, eventDate) {
	var curr = new Date();
  
	if(eventDate >= fromDate && eventDate <= toDate) {
		return true; 
	}
	return false;
}


/**
 * Clears all markers currently on the map, and then resets
 * the markers array.
 */
function clearMapOverlay() {
	console.log(markersArray.length);

	if( markersArray == null || markersArray.length < 1 )
		return;

	for(var i = 0; i < markersArray.length; i++) {
		markersArray[i].setMap(null);
	}

	markersArray = [];
}

/**
 * Event listeners/handlers
 */
$('#clear-map').click(function() { 
	clearMapOverlay();
});

$('#from-date').datepicker();

$('#to-date').datepicker();

$('#change-map').click(function() {
	clearMapOverlay();
	var fromDate = $('#from-date').val();
	var toDate = $('#to-date').val();
	generateMarkers(fromDate, toDate);
})