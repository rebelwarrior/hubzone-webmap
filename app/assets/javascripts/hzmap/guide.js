/* exported Guide */
HZApp.Guide = (function() {
  // Help guide modal listeners
  $(function() {
    $('.usa-button.close').click(HZApp.Guide.catchModalCloseButton)
  });

  return {
    catchModalCloseButton: function(){
      console.log('woah');
      $('.usa-modal-dialog').hide();
    }
  };
})();
