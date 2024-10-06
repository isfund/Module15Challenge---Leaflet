var map = L.map('map').setView([37.7749, -122.4194], 5);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


var earthquakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

fetch(earthquakeUrl)
  .then(response => response.json())
  .then(data => {
      function styleInfo(feature) {
      return {
        radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        color: "#000000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
    }

    
    function getRadius(magnitude) {
      return magnitude * 4;
    }

    
    function getColor(magnitude) {
      if (magnitude > 5) {
        return "#ea2c2c";
      } else if (magnitude > 4) {
        return "#ea822c";
      } else if (magnitude > 3) {
        return "#ee9c00";
      } else if (magnitude > 2) {
        return "#eecc00";
      } else if (magnitude > 1) {
        return "#d4ee00";
      } else {
        return "#98ee00";
      }
    }

    
    L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: styleInfo,
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
    }).addTo(map);
  });


var legend = L.control({ position: 'bottomright' });

legend.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'info legend'),
      depthLevels = [-10, 10, 30, 50, 70, 90],
      colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
      ];

  
  for (var i = 0; i < depthLevels.length; i++) {
    div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      depthLevels[i] + (depthLevels[i + 1] ? "&ndash;" + depthLevels[i + 1] + "<br>" : "+");
  }

  return div;
};

legend.addTo(map);