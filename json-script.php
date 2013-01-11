<?php
/**
 * Queries the database and outputs the data to a JSON file
 * This is for easy parsing and mapping
 *
 * @author Jonathon McDonald <jon@onewebcentric.com>
 */

// Enable error reporting
error_reporting( E_ALL );

// Database variabless
$host = 'localhost';
$user = 'harvetd2_wrd1';
$pass = 'SKb9PqX1jy';
$db   = 'harvetd2_markets';

// Instantiate mysqli object
$mysqli = new mysqli( $host, $user, $pass, $db );

// Check for connection errors
if( $mysqli->connect_errno ) 
{
	echo 'Failed to connect to MySQL:  ' . $mysqli->connect_errno . ' :: ' . $mysqli->connect_error;
}

// Begin by fetching all available markets
$query = 'SELECT * FROM Markets';

// Attempt to query the database, if there's an error return it
if( !( $result = $mysqli->query( $query ) ) ) 
{
	echo 'Execution failed:  ' . $mysqli->errno . ' :: ' . $mysqli->error;
}

// Load the rows we retrieve
$rows = array();

// This is the most complex part, we now need to retrieve 
// All the data
while( $r = $result->fetch_assoc( ) ) 
{
	// Retrieve all contacts associated with this market
	$query       = 'SELECT * FROM Contacts WHERE market_id = ' . $r['market_id'];
	$get_contact = $mysqli->query( $query );

	// Loop through all the contacts existing in this table, and look for events
	while( $contact_arr = $get_contact->fetch_assoc( ) )
	{
		// Look for all events associated with this market and contact
		$query = 'SELECT * FROM Events WHERE market_id = ' 
		. $r['market_id'] . ' AND contact_id =' . $contact_arr['contact_id'];
		
		$get_event = $mysqli->query( $query );

		// Loop through all event associated with this contact and event
		while( $event_arr = $get_event->fetch_assoc( ) )
		{
			// Get the event products, should only be one row
			$query       = 'SELECT * FROM Event_Products WHERE event_id = ' . $event_arr['event_id'];
			$get_product = $mysqli->query( $query );

			// Push this into the array aas well...oi vay
			$event_arr['Event Products'] = $get_product->fetch_assoc( );
			$contact_arr['Events'][]     = $event_arr;

		}
		$r['Contact'] = $contact_arr;
	}
	
	array_push( $rows, array( 'Market' => $r ) );
}

// We're through the hard part, now we just need to write the JSON to a file
$file        = "map-data.json";
$file_handle = fopen( $file, 'w' );

// Now we can write the JSON to the file, and close it!
fwrite( $file_handle, json_encode( $rows ) );
?>