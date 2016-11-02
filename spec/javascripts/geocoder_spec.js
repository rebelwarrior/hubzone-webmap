//jasmine test suites for the geocoder

var mockSearch = "8 Market Place Baltimore MD";

describe ('Testing the geocoder', function() {
  beforeEach(function(done){
    geocode(mockSearch);
    done();
  });

  it("to not be null", function() {
    console.log(geocoderResp.status);
    expect(geocoderResp.status).not.toBe(null);
  });

});