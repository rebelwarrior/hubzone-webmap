console.log("In the geocoder controller");

// callback to catch click on geocoder button to execute the geocode command
function geocode(geocodeQuery){
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

  if (resp.status === 'OK'){ 
    geocoderResp.status = resp.status;
    geocoderResp.results = resp.results;
  } else {
    geocoderResp.status = resp.status;
    geocoderResp.results = null;
  }

  return geocoderResp;
};