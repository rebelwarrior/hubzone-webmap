console.log("In the map controller");

//callback for when they click on a table result, takes event and access the data property
function parseLocationFromElement(ev){
  jumpToLocation($(ev.currentTarget).data('coord'));
};

//callback for building a popup on map data click
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

  // $('#sidebarControl').remove();

  // // Create a div to hold the control.
  // var controlDiv = document.createElement('div');
  // controlDiv.id = 'sidebarControl';
  // controlDiv.style.height = '100%';
  // controlDiv.style.width = '15%';

  // // Set CSS for the control border
  // var controlUI = document.createElement('div');
  // controlUI.style.backgroundColor = '#fff';
  // controlUI.style.border = '1px solid #333';
  // controlUI.style.cursor = 'pointer';
  // controlUI.style.marginBottom = '22px';
  // controlUI.style.textAlign = 'center';
  // controlUI.style.height = '100%';
  // controlUI.style.width = '100%';
  // controlUI.title = 'Click to recenter the map';
  // controlDiv.appendChild(controlUI);

  // // Set CSS for the control interior
  // var controlText = document.createElement('div');
  // controlText.style.color = 'rgb(25,25,25)';
  // controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  // controlText.style.fontSize = '16px';
  // controlText.style.lineHeight = '38px';
  // controlText.style.paddingLeft = '5px';
  // controlText.style.paddingRight = '5px';
  // // controlText.style.height = '100%';
  // // controlText.style.width = '100%';
  // controlText.innerHTML = status;
  // controlUI.appendChild(controlText);

  // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv)

};

//create the map on load and handle styling, build in event listeners
function initMap() {


  //DOM listeners
  $('#geocodeButton').on('click', geocode);

  $.getJSON('./config/gray_style.json').then(function(resp) {
    var googleMapsStyleConfig = resp;

    // Styles a map in night mode.
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 35.5, lng: -97.5},
      zoom: 9,
      styles: googleMapsStyleConfig,
      zoomControl: true, 
      zoomControlOptions: {
        position: google.maps.ControlPosition.TOP_LEFT
      }

    });

    //add listeners to map and features for special callbacks
    map.data.addListener('click', function(ev){
      if (ev.feature.getProperty('objectid') !== null && ev.feature.getProperty('objectid') !== undefined ){
        showPopUp(position = ev.latLng, qualified = true);
      }
    });

    //adds a listener for clicks on the basemap
    map.addListener('click', function(ev){ 

    });

    //adds listener for map idle, to fetch based on new bounds and refetch map, then redraw as needed
    map.addListener('idle', function(){
      console.log('i\'m idle, redrawing map');
      var mapBounds = map.getBounds();

      var NELat = mapBounds.getNorthEast().lat();
      var NELng = mapBounds.getNorthEast().lng();
      var SWLat = mapBounds.getSouthWest().lat();
      var SWLng = mapBounds.getSouthWest().lng();
      var bbox = [SWLng, SWLat, NELng, NELat].join(',');

      // var url = 'http://localhost:8080/geoserver/hubzone-test/ows?service=WFS&' + 
      //   'version=2.0.0&' + 
      //   'request=GetFeature&' + 
      //   'typename=' + geomWFSSettings.db + ':' + geomWFSSettings.table+ '&' +
      //   'outputFormat=application/json&' +
      //   'srsname=EPSG:'+ geomWFSSettings.srs +'&' +
      //   'bbox=' + bbox + ',EPSG:4326';

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
          if (resp.totalFeatures > 0){
            //create a new array of booleans if each new object is in the existing display 
            var newFeaturesIDs = [];
            var newFeatures = resp.features.map(function(feature){
              var featureID = feature.properties['objectid']
              newFeaturesIDs.push(featureID)
              return currentFeatures.includes(featureID);
            });
            //if any are not included, redraw.
            if (newFeatures.some(function(x){return x === false;})){
              currentFeatures = newFeaturesIDs;
              map.data.forEach(function(feature){map.data.remove(feature);});
              map.data.addGeoJson(resp);
            } else {
              console.log('new fetch, matches current, do nothing');
            }
          } else {
            console.log('no features returned');
          }
        }
      });

      // color based on area levels
      var colorArr = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33'];
      var levels = [0, 4500, 9000, 13500, 18000, 22500];

      //perform some stlying of features based on some rules, in this case arbitrary levels based on size. 
      map.data.setStyle(function(feature) {
        // var area = parseInt(feature.getProperty('land_area'));
        // var levelIndex = levels.filter((level) => level < area).length;

        // var color = colorArr[levelIndex];
        var color = '#205493';
        return {
          fillColor: color,
          opacity: 0.75,
          strokeWeight: 1
        }
      });

    });

    infoWindow = new google.maps.InfoWindow;

    // google.maps.event.addListener(infoWindow, 'closeclick', function(){
    //   $('#sidebarControl').remove();
    // });

    return map;
  });
};
