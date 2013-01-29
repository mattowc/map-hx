Harvest Exchange Maps:
======================

1.  Set Up:
-----------

You must include the Google Maps API v3 js files.  

In your HTML, ensure you have a div with the id named "map_canvas".  This can be any size, or anywhere you want.
Add the following to the body tag:

``<body onload="initialize('my-data.json')">``

Note that you can, and should pass a json file.  You can change the json file anytime after initialization by calling ``changeMapJSON(filename)``.  This will not load the points contained, you will need to call generateMarkers.  Refer to the end of this document to see how the JSON must be structured.  

2.  Manipulation: 
----------------- 

To clear the map, and remove all markers from it so you can work with a clean slate simply call:  

```js
clearMapOverlay();
```

You can also generate markers, either by date or distance (if you set both to true, distance takes precendence).  Simply call, using the options shown below:  
```js
generateMarkers({
   byDate: false,
   date1: "",
   date2: "",
   byDistance: false,
   lat: "",
   lng: "",
   distance: 0
});
```
Please note the above method will add markers to the map (regardless of whether or not there are existing markers).  It is a best practice to clear the map first.   

3.  JSON Structure:  
-------------------
The JSON must follow this structure:  
```json
[
   {
      "Market":{
         "market_id":"6",
         "name":"Northway Mall Wednesday Market",
         "street":"3101 Penland Pkwy",
         "city":"Anchorage",
         "state":"AK",
         "zip":"99508",
         "info":"Northway Mall",
         "lat":"61.2167",
         "lng":"-149.82",
         "website":"www.anchoragemarkets.com",
         "Contact":{
            "contact_id":"6",
            "market_id":"6",
            "first":"Bill",
            "last":"Webb",
            "phone":"907-272-5634",
            "email":"info@anchoragemarkets.com",
            "address":"741 East 13th Avenue",
            "city":"Anchorage",
            "Events":[
               {
                  "event_id":"6",
                  "market_id":"6",
                  "contact_id":"6",
                  "rain":"1",
                  "credit":"0",
                  "wic":"0",
                  "wic_cash":"0",
                  "sfmnp":"0",
                  "snap":"0",
                  "start_date":"2012-05-05",
                  "end_date":"2012-09-30",
                  "saturday_open":"10:00:00",
                  "saturday_close":"16:00:00",
                  "sunday_open":"00:00:00",
                  "sunday_close":"00:00:00",
                  "monday_open":"00:00:00",
                  "monday_close":"00:00:00",
                  "tuesday_open":"00:00:00",
                  "tuesday_close":"00:00:00",
                  "wednesday_open":"00:00:00",
                  "wednesday_close":"00:00:00",
                  "thursday_open":"00:00:00",
                  "thursday_close":"00:00:00",
                  "friday_open":"00:00:00",
                  "friday_close":"00:00:00",
                  "Event Products":{
                     "event_id":"6",
                     "baked_goods":"0",
                     "cheese":"0",
                     "crafts":"0",
                     "flowers":"0",
                     "eggs":"0",
                     "seafood":"0",
                     "herbs":"0",
                     "vegetables":"0",
                     "honey":"0",
                     "jams":"0",
                     "maple":"0",
                     "meat":"0",
                     "nursery":"0",
                     "nuts":"0",
                     "plants":"0",
                     "poultry":"0",
                     "prepared":"0",
                     "soap":"0",
                     "trees":"0",
                     "wine":"0"
                  }
               },
               {
                  "event_id":"7",
                  "market_id":"6",
                  "contact_id":"6",
                  "rain":"0",
                  "credit":"0",
                  "wic":"1",
                  "wic_cash":"0",
                  "sfmnp":"1",
                  "snap":"0",
                  "start_date":"2012-06-27",
                  "end_date":"2012-10-03",
                  "saturday_open":"00:00:00",
                  "saturday_close":"00:00:00",
                  "sunday_open":"00:00:00",
                  "sunday_close":"00:00:00",
                  "monday_open":"00:00:00",
                  "monday_close":"00:00:00",
                  "tuesday_open":"00:00:00",
                  "tuesday_close":"00:00:00",
                  "wednesday_open":"09:00:00",
                  "wednesday_close":"16:00:00",
                  "thursday_open":"00:00:00",
                  "thursday_close":"00:00:00",
                  "friday_open":"00:00:00",
                  "friday_close":"00:00:00",
                  "Event Products":{
                     "event_id":"7",
                     "baked_goods":"0",
                     "cheese":"0",
                     "crafts":"0",
                     "flowers":"1",
                     "eggs":"1",
                     "seafood":"0",
                     "herbs":"1",
                     "vegetables":"1",
                     "honey":"1",
                     "jams":"1",
                     "maple":"0",
                     "meat":"1",
                     "nursery":"1",
                     "nuts":"0",
                     "plants":"1",
                     "poultry":"1",
                     "prepared":"0",
                     "soap":"0",
                     "trees":"0",
                     "wine":"0"
                  }
               }
            ]
         }
      }
   }
]
```

4.  To-dos:
-----------

This is a work in progress.  A lot of hard work has gone into what exists so far.  Here are imminent to-dos:

*  Proper namespacing
*  Adherence to google styling guide for javascript
*  Removal of all HTML from hx-maps.js, allow caller to define HTML
*  Methods to aquire array of markets (and their events, contacts) based on the given requirements (i.e. date, distance)

As you can see the goal is to create a robust back end that can be used for a variety of purposes and that has as little external dependencies as possible.  