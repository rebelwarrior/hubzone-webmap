// working with the Navigo router
HZApp.Router = (function(){
  return {
    router: {},
    startRouter: function(){
      HZApp.Router.router = new Navigo(null);
      HZApp.Router.router.on({
        '*': HZApp.Router.handleRouter
      });

      HZApp.Router.router.resolve();
    },
    handleRouter: function(params, query){
      console.log('Router: ', params, query);
    },
  }
})();
