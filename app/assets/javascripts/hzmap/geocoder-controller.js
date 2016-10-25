console.log("In the geocoder controller");

var map = {};
var infoWindow = {};
var apiKey = 'AIzaSyCpZgPsZxJzCFXoLpduWMeDRssxFKr6kR0';
var currentFeatures = [];
var geocodeQuery = '';

var geomWFSSettings = {
  db: 'hubzone-test',
  table: 'largeIndianLands',
  srs: '4326',
  viewparams: [
    'area_thresh:5000'
  ].join(';')
};

// callback from index.html to execute the geocode command
function geocode(ev){
  geocodeQuery = $('#queryInput').val() || ' ';
  console.log(geocodeQuery);

  $.ajax({
    url: 'https://maps.googleapis.com/maps/api/geocode/json?',
    data: {
      address: geocodeQuery,
      key: apiKey,
      country: ['US', 'UM'] 
    },
    success: parseGeocodeResult,
  }).fail(geocodingError);
};

//if the geocoder comes back with any error state
function geocodingError(resp){
  console.warn('geocoding error');
  console.log(resp.responseText);
};

//parse the geocoder result and pass the first one to the jumpToLocation
function parseGeocodeResult(resp){

  // lookup table of messages to send to XXXX for all geocoder responses except for 'OK' - which is a valid geocoder respose
  var geocoderRespMessages = {
    'ERROR': 'There was a problem contacting the geocoder servers.',
    'INVALID_REQUEST': 'Invalid geocoder request.',
    'OVER_QUERY_LIMIT': 'The webpage has gone over the requests limit in too short a period of time.',
    'REQUEST_DENIED': 'The webpage is not allowed to use the geocoder.',
    'UNKNOWN_ERROR': 'A geocoding request could not be processed due to a server error. The request may succeed if you try again.',
    'ZERO_RESULTS': 'No result was found for :' + geocodeQuery
  };

  console.log('geocoder response: ' + resp.status);
  $('#geocodingResults').html('');
  if (resp.status === 'OK'){ 
    resp.results.forEach(function(result) {
      $('#geocodingResults').append(
        '<p class="geocoder-result-element"'+
        'data-coord=' + JSON.stringify(result.geometry.location) + '>' + result.formatted_address + '</p>');
    });
    $('.geocoder-result-element').on('click', parseLocationFromElement);
    jumpToLocation(resp.results[0].geometry.location);

  } else {
    $('#geocodingResults').append(
      geocoderRespMessages[resp.status]
    );  
  }
};

// move map and display geocoding results if the ajax is successful
// does not have special handling for no results, except it just doesn't
// do anything
function jumpToLocation(geocodeLocation){

  // poll the geoserver api for the hubzone intersect command
  console.log(geocodeLocation);
  var location = [geocodeLocation.lng, geocodeLocation.lat].join('%20');
    
    /* 
      DEV COMMENT:
      need to look into differences in the CQL_filter between WFS versions.
      the CQL_FILTER=INTERSECTS operation only works on version 1.0.0, not on 1.1.0 or 2.0.0
      according to the geoserver docs, there is not expected to a performance difference 
      between the versions for this type of operation and settings.
    */
    var intersectUrl = [
      'http://localhost:8080/geoserver/hubzone-test/ows?service=WFS', 
      'version=1.0.0', 
      'request=GetFeature', 
      'typename=' + geomWFSSettings.db + ':' + geomWFSSettings.table,
      'viewparams=' + geomWFSSettings.viewparams,
      'outputFormat=application/json',
      'srsname=EPSG:'+ geomWFSSettings.srs,
      'cql_filter=INTERSECTS(geom,%20POINT(' + location + '))'
    ].join('&');

  $.ajax({
    url: intersectUrl, 
    success: function(resp) {
      console.log(resp);    
      map.setCenter(geocodeLocation);
      var qualified = true;
      if (resp.features.length === 0){
        qualified = false;
      };
      showPopUp(feature = geocodeLocation, qualified );
    } 
  }).fail(function(resp){
      console.warn('there was an error performing hubzone query');
      console.log(resp)
  });
};
