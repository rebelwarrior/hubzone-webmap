// This is a manifest file that'll be compiled into hzmap.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require_tree ./hzmap

//defining global variables for hubzone map controllers
"use strict";
var map = {}; //the map object
var infoWindow = {}; //infowindow object
var apiKey = 'AIzaSyCpZgPsZxJzCFXoLpduWMeDRssxFKr6kR0'; //google maps api key
var currentFeatures = []; // geojson featureCollection of features currently loaded into map
var geocodeQuery = ''; // string of geocodequery from input text

//geoserver WFS URL parameters
//viewparams may not always be used, and is available in case a view
// is defined in geoserver
var geomWFSSettings = {
  urlRoot: 'http://localhost:8080/geoserver/hubzone-test/ows?service=WFS',
  db: 'hubzone-test',
  table: 'il_geom_lowres', //'indian_lands'  'indianlands_2014_doug' 'il_geom_lowres'
  srs: '4326',
  viewparams: [
    'area_thresh:0',
    'scale:1'
  ].join(';') 
};



//declare DOM element listeners
$('#geocodeButton').on('click', geocode);
