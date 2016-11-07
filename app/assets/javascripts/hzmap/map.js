//create the map on load, when idle, jump to updateMap to get features
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.5, lng: -97.5},
    zoom: 9,
    styles: googleMapsStyleConfig,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT
    }
  });

  // adds listener that triggers whenever the map is idle to update with new features.
  google.maps.event.addListener(map, 'idle', updateMap);

  //returns the map as a promise
  return map;
};

function getBbox(mapScope) {
  //get the bounding box of the current map and parse as a string
  var mapBounds = mapScope.getBounds();
  var NELat = mapBounds.getNorthEast().lat();
  var NELng = mapBounds.getNorthEast().lng();
  var SWLat = mapBounds.getSouthWest().lat();
  var SWLng = mapBounds.getSouthWest().lng();
  return [SWLng, SWLat, NELng, NELat].join(',');
};

var getUrl = function(bbox) {
  return [
    geomWFSSettings.urlRoot,
    'version=1.0.0',
    'request=GetFeature',
    'typename=' + geomWFSSettings.db + ':' + geomWFSSettings.table,
    'outputFormat=application/json',
    'srsname=EPSG:'+ geomWFSSettings.srs,
    'bbox=' + bbox + ',EPSG:4326'
  ].join('&');
};

var defaultMapStyle = function(feature) {
  var color = '#205493';
  return {
    fillColor: color,
    opacity: 0.75,
    strokeWeight: 1
  }
};



//function to update the map based on new bounds, get new features from
//geoserver,remove from map any features not in view, add to map
//any new features in view.
function updateMap(){
  mapScope = this;

  //get the bbox from the mapScope
  var bbox = getBbox(mapScope);

  //build the fetch url from settings
  var url = getUrl(bbox);

  //make sure mapGeoJson has correct map scope
  mapGeoJson.mapScope = mapScope;

  //ajax request to geoserver for features,
  $.ajax(url, {
    success: function(resp){
      // on successful fetch of new features in the bbox, compare old with new and update the map
      if (resp.totalFeatures === null || resp.totalFeatures === undefined){
        console.error('Error Fetching from GeoServer', this.url, resp);
      } else if (resp.totalFeatures > 0){
        mapGeoJson.diffData(resp);
        if (mapGeoJson.featuresToAdd.totalFeatures > 0) {
          mapScope.data.addGeoJson(mapGeoJson.featuresToAdd);
        }
        if (mapGeoJson.featuresToRemove.length > 0){
          mapScope.data.forEach(function(feature){
            if (mapGeoJson.featuresToRemove.includes(feature.f[geomUniqID])){
              mapScope.data.remove(feature);
            }
          });
        }
      } else {
        console.warn('No features returned by Geoserver', this.url);
      }
    },
    error: function(err){
      console.error('Error Fetching from GeoServer:',
                    err.status,
                    err.responseText
      );
    }
  });

  //perform some stlying of features based on some rules, in case arbitrary levels based on size.
  mapScope.data.setStyle(defaultMapStyle);
  return mapScope;
};