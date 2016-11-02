console.log('In the hubzone query controller');

//hubzone-query-controller handles logic for fetching and receiving hubzone queries
//for example from a map click or from an address search

function queryMapClick(event){
  console.log('the map got clicked');
  mapClick = {
    lat: event.latLng.lat(),
    lng: event.latLng.lng()
  };
  console.log(mapClick);
  return mapClick;
};

function triggerMapClick(){
  google.maps.event.trigger(map, 'click', {
  });
};