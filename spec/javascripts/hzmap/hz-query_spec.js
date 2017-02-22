//= require hzmap/hz-query
/* jshint unused: false */
/* jshint undef: false */

describe ('Testing hz-query functions', function() {
  beforeEach(function(){
    google = HZSpecHelper.google;
    HZApp.SidebarUtils.sidebar = HZSpecHelper.mockPage.build();
    HZApp.map = new google.maps.Map();
    $('#sidebar').css('display', 'initial');
    HZApp.Markers.hzQueryMarker = new HZApp.Constructors.HubzoneMapMarker({icon: null});  
  });

  afterEach(function(){
    HZApp.map = {};
    HZSpecHelper.mockPage.destroy();
    HZApp.SidebarUtils.sidebar = {};
  });

  //pass over the different search responses
  HZSpecHelper.searchResponses.map(function(response){
    describe ('should handle a ' + response.mockResponseType, function(){

      it ('should correctly parse the response object', function(){
        spyOn(HZApp.HZQuery, 'handleBadResponses');
        spyOn(HZApp.HZQuery, 'parseResponseGeometry');
        spyOn(HZApp.HZQuery, 'updateMap');

        HZApp.HZQuery.parseResponse(response);
        expect(HZApp.HZQuery.handleBadResponses.calls.count()).toEqual(1);
        expect(HZApp.HZQuery.parseResponseGeometry.calls.count()).toEqual(1);
        expect(HZApp.HZQuery.updateMap.calls.count()).toEqual(1);
        expect(HZApp.HZQuery.response).toEqual(response);
      });

      var sidebarVisibilty = (response.mockResponseType === 'good response');

      it ('the report button/card should be ' + (sidebarVisibilty ? ' visible' : ' not visible'), function(){
        HZApp.HZQuery.handleBadResponses(response.status);

        expect(HZApp.HZQuery.query.latlng).toEqual(null);
        expect(HZApp.HZQuery.query.q).toEqual(null);
        expect($('.sidebar-card.map-report').is(':visible')).toBe(sidebarVisibilty);
      });

      it ('should update the map', function(){
        spyOn(HZApp.SidebarUtils.sidebar, 'open');
        spyOn(HZApp.Markers.hzQueryMarker, 'updateMarkers');

        HZApp.HZQuery.updateMap();

        expect(HZApp.SidebarUtils.sidebar.open.calls.count()).toEqual(1);
        expect(HZApp.Markers.hzQueryMarker.updateMarkers.calls.count()).toEqual(1);
      });

      if (response.mockResponseType === 'good response'){
        if (response.place_id){
          it ('should correctly parse the response geometry from an address search', function(){
            spyOn(HZApp.MapUtils, 'jumpToLocation');
            HZApp.HZQuery.parseResponseGeometry(response);
            expect(HZApp.HZQuery.response.geocodeLocation).toEqual(response.geometry.location);
            expect(HZApp.HZQuery.query.q).toEqual(response.formatted_address);
            expect(HZApp.HZQuery.query.latlng).toBe(null);
            expect(HZApp.MapUtils.jumpToLocation.calls.count()).toEqual(1);
          });
        } else {
          it ('should correctly parse the response geometry from a map click', function(){
            spyOn(HZApp.MapUtils, 'jumpToLocation');
            HZApp.HZQuery.parseResponseGeometry(response);
            expect(HZApp.HZQuery.response.geocodeLocation).toEqual(response.geometry.location);
            expect(HZApp.HZQuery.query.q).toBe(null);
            expect(HZApp.HZQuery.query.latlng).toEqual([response.geocodeLocation.lat, response.geocodeLocation.lng ].join(','));
            expect(HZApp.MapUtils.jumpToLocation.calls.count()).toEqual(1);
          });
        }
      } else {
        it ('should correctly parse the response geometry when a ' + response.mockResponseType, function(){
          HZApp.HZQuery.parseResponseGeometry(response);
          expect(HZApp.HZQuery.response.geocodeLocation).toBe(null);
        });
      }


    });
  });  

});