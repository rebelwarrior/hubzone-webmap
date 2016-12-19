//= require hzmap
//= require ../helpers/sinon-1.17.6

describe ('Testing Google Analytics integration', function() {
  beforeEach(function(done) {
    window = window || {};
    window.ga = window.ga || function(a,b,c,d){};
    spyOn(window, 'ga');

    $('#sidebar').remove();
    $('body').append('<div id="sidebar" class="hidden"></div>');
    sidebar = $('#sidebar').sidebar();
    done();
  });

  it('should send an event when a user toggles the sidebar', function() {
    // open the sidebar...
    triggerSidebar();
    expect(sidebar.currentClass).toEqual('on');
    expect(window.ga.calls.count()).toEqual(1);
    // ... and close the sidebar.
    triggerSidebar();
    expect(sidebar.currentClass).toEqual('hidden');
    expect(window.ga.calls.count()).toEqual(2);
  });

  it('should send an event when a qualification is toggled', function() {
    var testDiv = document.createElement('div');
    $('#sidebar').append(testDiv)
    var accordion = '<li>' +
      '<button id="test_button" class="usa-accordion-button" aria-expanded="false" aria-controls="indian_lands">' +
        'Indian Lands' +
      '</button>' +
      '<div id="indian_lands" class="usa-accordion-content" aria-hidden="true">' +
        '<p>' +
        '</p><table class="usa-table-borderless hubzone-qualification-details">' +
        '<tbody>' +
          '<tr>' +
            '<th scope="row">Expires</th>' +
            '<td></td>' +
          '</tr>' +
          '</tbody>' +
        '</table' +
        '<p></p>' +
      '</div>' +
    '</li>';
    $(testDiv).append(accordion);
    updateAccordions();
    $('button.usa-accordion-button').trigger('click');

    expect(window.ga.calls.count()).toEqual(1);
  });

});
