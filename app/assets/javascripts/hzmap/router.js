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
      console.log('Router: ');
      var latlng_q = HZApp.Router.parseQueryByName(query, 'latlng');
      var search_q = HZApp.Router.parseQueryByName(query, 'search');
      if (latlng_q){
        console.log('latlng query: ', latlng_q);
      } else if (search_q) {
        var input_field = document.getElementById('search-field-small');
        input_field.value = search_q.search;
      } else {
        console.log('no valid search parameters detected!');
      }
    },
    // return a new object for a single query parameter
    parseQueryByName: function(query, name){
      var query_split = query.split('?');
      for (var i = query_split.length - 1; i >= 0; i--) {
        var sub_split = query_split[i].split('=');
        if (sub_split[0] === name){
          var query_obj = {};
          query_obj[sub_split[0]] = decodeURI(sub_split[1]);
          return query_obj;
        }
      }
    },
  }
})();

