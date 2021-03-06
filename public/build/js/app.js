(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  key: 'mapzen-zaNqJQt'
}

},{}],2:[function(require,module,exports){
const config = require('../../config/api');
//var L = require('leaflet');
//require('leaflet-geocoder-mapzen');

var apiKey = config.key;

var map = L.map('map').setView([45.522759, -122.676412], 13);

var Stamen_Terrain = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  ext: 'png'
}).addTo(map);

var geocoder = L.control.geocoder(apiKey);
geocoder.addTo(map);


geocoder.on('select', function(e){
  var latLng = e.latlng;

  console.log(latLng);

  var url = "https://matrix.mapzen.com/isochrone?json=";
  var latitude = 44.527105;
  var longitude = -121.209596;

  var json = {
    locations: [{"lat":latLng.lat, "lon":latLng.lng}],
    costing: "auto",
    contours: [{"time":4, "color":"f44242"}],
    polygons: true,
    denoise: 0.2,
    generalize: 10
  };

  url = url + JSON.stringify(json) + '&api_key='+ apiKey;

  var response = $.ajax({
    url: url,
    method: "GET",
    dataType: "json",
    success: function(response){
      var isochrones = L.geoJSON(response, {
        style: function(feature){
          return { opacity: feature.properties.opacity * 4,
                   color:  feature.properties.color
                 }
        }
      }).addTo(map);
         document.getElementById('export').onclick = function(e){

           var data = isochrones.toGeoJSON();
           var toExport = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

           document.getElementById('export').setAttribute('href', 'data:'+ toExport);
           document.getElementById('export').setAttribute('download', 'isochrones.geojson');
      }
    },
    error: function(err){
      console.log(err);
      alert("fail");
    }
  });
});

},{"../../config/api":1}]},{},[2]);
