// Namespace 
var hxmaps = {};

// Properties
var hxmaps.map;          // Represents the Map object from google.maps
var hxmaps.infowindow;   // Represents the InfoWindow object from google.maps
var hxmaps.markersArray; // Holds an array of all currently active markers
var hxmaps.jsonFile;     // This is used to store the the name of the json file

/**
 * Initializes a map that other methods in the hxmaps namespace
 * will use to populate with markers.  
 *
 * @param jsonFile A filename that contains JSON for farmers markets
 */
hxmaps.init = function(jsonFile) {
	// First initialize the jsonFile...if there is none, just load the map
	if(jsonFile != null)
		hxmaps.jsonFile = jsonFile;

	// Prepare building the map by setting the options
	var mapOptions = {
		center: new google.maps.LatLng(64.8443, -147.72),
		zoom: 4,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	// Initialize the map & info window
	hxmaps.map = new google.maps.Map(document.getElementById("map_canvas"), 
		mapOptions);
	hxmaps.infowindow = new google.maps.InfoWindow;
};

/**
 * Parses the passed JSON, and plots markers on the map
 * (which must be initialized). 
 * <p>
 * You can use some of the other methods to trim the json
 * by say date, or distance and then pass the result to 
 * here.  It is also probably a good idea to call 
 * hxmaps.clearMapOverlay to ensure the 
 *
 * @param json The given subset of json we will use
 */
hxmaps.generateMarkers = function(json) {
	// If the json is null, then we can't plot any points
	if(json == null)
		return;

	// Loop through each market and extract the appropriate data
	for(var i = 0; i<json.length; i++) {

		// First instantiate the latitude and longitude
		var point = new google.maps.LatLng(
			parseFloat(json[i].Market.lat),
			parseFloat(json[i].Market.lng));

		// Next, using that point, generate a marker
		var marker = new google.maps.Marker({
			map: hxmaps.map,
			position: point
		});

		// Push the marker to the array so we can manage it,
		// and load it to the map
		hxmaps.markersArray.push(marker);
		hxmaps.bindInfoWindow(marker, hxmaps.map, hxmaps.infowindow, json[i]);
	}
};

hxmaps.bindInfoWindow = function(marker, map, infowindow, json) {
	google.maps.event.addListener(marker, 'click', function() {
		hxmaps.infowindow.setContent(generateHTML(json));
		hxmaps.infowindow.open(map, marker);
		hxmaps.insertHTML(json);
	});
};

hxmaps.insertHTML = function() {

};


/**
 * Parse a JSON file and returns the actual JSON object
 * for use.  
 *
 * @return {obj} JSON Object from the given file
 */
hxmaps.getJsonObj = function() {

	// Check for null first
	if(hxmaps.jsonFile == null)
		return null;

	// Get and parse the JSON, using the jQuery function
	$.getJSON(hxmaps.jsonFile, function(json) {
		return json;
	}
};

/**
 * This trims a JSON object based on the given dates
 *
 * @return {obj} JSON Object with values that exist within the given dates
 */
hxmaps.trimJsonByDate = function(options) {

	// Check for null first
	if(options.json == null)
		return null;

	var json = options.json;
	var returnJson = [];

	for(var i = 0; i<json.length; i++) {

		var events = json[i].Market.Contact.Events;
		var add = false;

		for(var b = 0; b<events.length; b++) {

			if(options.fromDate != null && new Date(events[b].end_date) < options.fromDate) {
				continue;
			}

			if(options.toDate != null && new Date(events[b].start_date) > options.toDate) {
				continue;
			}

			add = true;
		}

		if(add) 
			returnJson.push(json[i]);
	}

	return returnJson;
};

/**
 * This trims a JSON object based on the given distance from a given
 * point.  
 *
 * @return {obj} JSON Objedt with values that exist within the given radius
 */
hxmaps.trimJsonByDistance = function(options) {

};