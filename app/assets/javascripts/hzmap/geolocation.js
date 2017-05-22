/* exported GeoLocation */
HZApp.GeoLocation = (function() {
  // GeoLocation button listener
  $(function() {
    $('.geolocation-arrow ').click(HZApp.GeoLocation.catchGeoLocationButtonClick);
    $('.geolocation-error-button').click(HZApp.GeoLocation.hideGeolocationError);
  });

  return {
    catchGeoLocationButtonClick: function(){
      HZApp.GeoLocation.getUserLocation(window.navigator.geolocation);
    },
    getUserLocation: function(navLocation){
      //grab users location and set map around it
      $('#geolocation i').css("display", "none");
      $('.geolocation-loading').css("display", "block");
      if (navLocation) {
          navLocation.getCurrentPosition(this.moveMapToUserLocation, this.geolocationError);
          return navLocation;
      } else {
        //browser doesn't support Geolocation
        $('#geolocation i').css("display", "block");
        $('.geolocation-loading').css("display", "none");
        // window.console.warn('browser does not support geolocation');
        return null;
      }
    },
    geolocationError: function() {
      $('#geolocation i').css("display", "block");
      $('.geolocation-loading').css("display", "none");
      HZApp.GeoLocation.showGeolocationError();
    },
    showGeolocationError: function(){
      $('.notification-popup.geolocation').show();
    },
    hideGeolocationError: function(){
      $('.notification-popup.geolocation').hide();
    },
    moveMapToUserLocation: function(position){
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      //set map to that location
      HZApp.map.setCenter(pos);
      HZApp.map.setZoom(15);
      HZApp.Markers.hzUserLocation.updateMarkers(pos);
      $('#geolocation i').css("display", "block");
      $('.geolocation-loading').css("display", "none");
    }
  };
})();
