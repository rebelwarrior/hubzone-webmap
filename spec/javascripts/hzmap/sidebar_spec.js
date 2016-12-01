//= require hzmap

describe ('Testing sidebar operations', function() {

  beforeEach(function(done) {
    setTimeout(function() {
      done();
    }, 1);
  });

  it ("should create a sidebar", function(){
    expect(sidebar).toBeDefined();
  });
  it ("should be hidden initially", function() {
    expect(sidebar.currentClass).toEqual('hidden');
  });
  it ("should open", function() {
    sidebar.open();
    expect(sidebar.currentClass).toEqual('on');
  });
  it ("should close", function() {
    sidebar.close();
    expect(sidebar.currentClass).toEqual('hidden');
  });
});
