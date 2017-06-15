// working with the Navigo router
HZApp.Router = (function(){
  return {
    router: {},
    startRouter: function(){
      HZApp.Router.router = new Navigo(null);
      HZApp.Router.router.on({
        '/': HZApp.Router.handleRouter,
      });

      HZApp.Router.router.notFound(HZApp.Router.nullHandler);

      HZApp.Router.router.resolve();
    },

    nullHandler: function(params, query){
      console_log('nullHandler')
    },

    handleRouter: function(params, query){
      console.log('Router: ');
      if (params !== ""){
        var latlng_q = HZApp.Router.parseQueryByName(params, 'latlng');
        var search_q = HZApp.Router.parseQueryByName(params, 'search');
        if (latlng_q){
          console.log('latlng query: ', latlng_q);
        } else if (search_q) {
          HZApp.Router.submitSearch(search_q.search);
        } else {
          console.log('no valid search parameters detected!');
        }
      }
    },

    // submit the hubzone form search
    submitSearch: function(search){
      var input_field = document.getElementById('search-field-small');
      input_field.value = search;
      document.getElementById('hubzone-search-form').submit();
    },

    // return a new object for a single query parameter
    // TODO: check Navigo, I think it might have built in methods for this.
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

