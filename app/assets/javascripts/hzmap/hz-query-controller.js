console.log('In the hubzone query controller');

//hubzone-query-controller handles logic for fetching and receiving hubzone queries
//for example from a map click or from an address search

function parseMapClick(event){
  console.log('the map got clicked');
  
  hzLocation = new HZLocation({
    clickEvent: event
  });
  hzLocation.queryLocation();
  // hzQuery(mapClick);
};

function HZLocation(options){
  this.lat = 0;
  this.lng = 0;

  this.queryLocation = function (){
    // GET location from geoserver
    console.log('send me to geoserver', this);
  };

  var clickEvent = options.clickEvent;
  if (clickEvent !== null && clickEvent !== undefined){
    this.lat = clickEvent.latLng.lat();
    this.lng = clickEvent.latLng.lng();
  }

  return this;
};


//perform a hubzone db query to determine if a location is in a hubzone
//takes as parameter just a latLng object and returns a hzquery object
function hzQuery(latLng){
  




  return latLng;
};





// function jumpToLocation(geocodeLocation){

//   console.log(geocodeLocation);
//   var location = [geocodeLocation.lng, geocodeLocation.lat].join('%20');
    
//   /* 
//     Differences in the CQL_filter between WFS versions:
//     the CQL_FILTER=INTERSECTS operation only works like below on version 1.0.0, not on 1.1.0 or 2.0.0
//     according to the geoserver docs, there is not expected to a performance difference 
//     between the versions for this type of operation and settings.
//   */
//   var intersectUrl = [
//     geomWFSSettings.urlRoot, 
//     'version=1.0.0', 
//     'request=GetFeature', 
//     'typename=' + geomWFSSettings.db + ':' + geomWFSSettings.table,
//     'viewparams=' + geomWFSSettings.viewparams,
//     'outputFormat=application/json',
//     'srsname=EPSG:'+ geomWFSSettings.srs,
//     'cql_filter=INTERSECTS(geom,%20POINT(' + location + '))'
//   ].join('&');

//   // poll the geoserver api for the hubzone intersect command
//   $.ajax({
//     url: intersectUrl, 
//     success: function(resp) {
//       console.log(resp);    
//       map.setCenter(geocodeLocation);
//       var qualified = true;
//       if (resp.features.length === 0){
//         qualified = false;
//       };
//       showPopUp(feature = geocodeLocation, qualified );
//     } 
//   }).fail(function(resp){
//       console.warn('there was an error performing hubzone query');
//       console.log(resp)
//   });
// };