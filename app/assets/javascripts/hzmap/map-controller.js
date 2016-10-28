console.log("In the map controller");

//callback for building a popup on map data click
// can also be called from other operations as well
// takes a google maps position object and a boolean to declare qualified or not 
function showPopUp(position, qualified){
  console.log('map clicked');

  //clear the old pop-up
  if (infoWindow.getContent !== undefined){
    infoWindow.setContent('');
    infoWindow.close();
  }
  
  var popUpTemplate = '';
  var status = qualified ? 'Qualified' : 'Not Qualified';
  popUpTemplate += '<h4>' + status + '</h4>'
  infoWindow.setContent(popUpTemplate);
  infoWindow.setPosition(position);
  infoWindow.open(map);

  // working with custom map control elements

  $('#sidebarControl').remove();

  // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv)

  // callback to close the sidebar when the infowindow pop up is clicked
  google.maps.event.addListener(infoWindow, 'closeclick', function(){
    $('#sidebarControl').remove();
  });
};

//function to update the map based on new bounds
function updateMap(){
  console.log('i\'m idle, redrawing map');
  
  

  var mapBounds = map.getBounds();
  //maybe add a zoom specific padding to the bbox, to get a few more outside, like double
  var NELat = mapBounds.getNorthEast().lat();
  var NELng = mapBounds.getNorthEast().lng();
  var SWLat = mapBounds.getSouthWest().lat();
  var SWLng = mapBounds.getSouthWest().lng();
  var bbox = [SWLng, SWLat, NELng, NELat].join(',');

  var url = [
    geomWFSSettings.urlRoot, 
    'version=1.0.0', 
    'request=GetFeature', 
    'typename=' + geomWFSSettings.db + ':' + geomWFSSettings.table,
    'viewparams=' + geomWFSSettings.viewparams,
    'outputFormat=application/json',
    'srsname=EPSG:'+ geomWFSSettings.srs,
    'bbox=' + bbox + ',EPSG:4326'
  ].join('&');

  $.ajax(url, {
    success: function(resp){
      // on successful fetch of new features in the bbox, compare old with new and update the map
      if (resp.totalFeatures > 0){
        //if the currentFeatures is empty, just add it all
        if (currentFeaturesIDs.length === 0){
          // console.log('no other features, adding all');
          map.data.addGeoJson(resp);
          for (var i = resp.features.length - 1; i >= 0; i--) {
            currentFeaturesIDs.push(resp.features[i].properties[geomUniqID]);
          }
        } else {       
          var newFeaturesIDs = [];
          var newFeatures = resp.features.map(function(feature){
            var featureID = feature.properties[geomUniqID]
            newFeaturesIDs.push(featureID)
            return feature;
          });

          var updatedFeaturesIDs = [];

          for (var i = newFeaturesIDs.length - 1; i >= 0; i--) {
            if (!currentFeaturesIDs.includes(newFeaturesIDs[i])){
              // console.log('adding a new feature');
              map.data.addGeoJson(newFeatures[i])
              updatedFeaturesIDs.push(newFeaturesIDs[i]);
            } 
          }

          map.data.forEach(function(feature){
            var featureID = feature.f[geomUniqID];
            if (!newFeaturesIDs.includes(featureID)){
              // console.log('removing a feature');
              map.data.remove(feature);
            } else {
              updatedFeaturesIDs.push(featureID);
            }
          });

          currentFeaturesIDs = updatedFeaturesIDs;
        }
      } else {
        // console.log('no features returned');
      }
    }
  });

  // color based on area levels
  var colorArr = ['#e1f3f8','#9bdaf1','#00a6d2','#046b99'];
  var levels = [0, 9000, 13500, 18000];

  //perform some stlying of features based on some rules, in case arbitrary levels based on size. 
  map.data.setStyle(function(feature) {
    var area = parseInt(feature.getProperty('land_area'));
    var levelIndex = levels.filter((level) => level < area).length;

    var color = colorArr[levelIndex];
    // var color = '#205493';
    return {
      fillColor: color,
      opacity: 0.75,
      strokeWeight: 1
    }
  });

};

//create the map on load and handle styling, build in event listeners
function initMap() {

  $.getJSON('./config/gray_style.json').then(function(resp) {
    var googleMapsStyleConfig = resp;

    // Styles a map
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 35.5, lng: -97.5},
      zoom: 9,
      styles: googleMapsStyleConfig,
      zoomControl: true, 
      zoomControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
      }
    });

    // Map Listeners
    //add listeners to map and features for special callbacks
    map.data.addListener('click', function(ev){
      if (ev.feature.getProperty(geomUniqID) !== null && ev.feature.getProperty(geomUniqID) !== undefined ){
        showPopUp(position = ev.latLng, qualified = true);
      }
    });

    //adds a listener for clicks on the basemap
    map.addListener('click', function(ev){ 
      showPopUp(position = ev.latLng, qualified = false);
    });

    //adds listener for map idle, to fetch based on new bounds and refetch map, then redraw as needed
    //this loses scope occasionally in chrome, and always in firefox and safari.  
    //wonder if maybe it is a scope or an aysync thing (map not created yet)
    map.addListener('idle', updateMap, map);

    infoWindow = new google.maps.InfoWindow;

    return map;
  });
};
