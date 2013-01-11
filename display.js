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

	// Get and parse the JSON
	$.getJSON("map-data.json", function(json) {
		// For debugging purposes only
		console.log(json);

		// Loop through each market and extract the appropriate data
		for(var i = 0; i<json.length; i++) {
			// First instantiate the latitude and longitude
			var point = new google.maps.LatLng(
				parseFloat(json[i].Market.lat),
				parseFloat(json[i].Market.lng));

			// Next, using that point, generate a marker
			var marker = new google.maps.Marker({
				map: map,
				position: point
			});

			// TODO:  Get rid of the HTML here, and use a helper function
			var html = "<b>" + json[i].Market.lat + "</b>"
			+ "<br />" 
			+ "<b>" + json[i].Market.lng + "</b>";

			// Bind this to the window
			bindInfoWindow(marker, map, infowindow, html);
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
 * @param {google.maps.html} obj HTML that is used for content
 */
function bindInfoWindow(marker, map, infowindow, html) {
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(html);
		infowindow.open(map, marker);
	});
}