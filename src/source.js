import './source.scss';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultInteractions, DragRotateAndZoom } from 'ol/interaction';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import { OSM, Vector as VectorSource } from 'ol/source';
import { transform } from 'ol/proj';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import { withinExtentAndZ } from 'ol/tilecoord';

// coordonnées récupérées depuis https://www.latlong.net/convert-address-to-lat-long.html
var nws = transform([1.066530, 49.428470], 'EPSG:4326', 'EPSG:3857');
var copeaux = transform([1.064670, 49.422218], 'EPSG:4326', 'EPSG:3857');
var isd = transform([1.120290, 49.450932], 'EPSG:4326', 'EPSG:3857');


var image = new CircleStyle({
  radius: 5,
  fill: new Fill({
    color: 'red'
  }),
  stroke: new Stroke({ color: 'red', width: 1 })
});

var styles = {
  'Point': new Style({
    image: image
  }),
};


var styleFunction = function (feature) {
  return styles[feature.getGeometry().getType()];
};

var geojsonObject = {
  'type': 'FeatureCollection',
  'crs': {
    'type': 'name',
    'properties': {
      'name': 'EPSG:3857'
    }
  },
  'features': [{
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': nws
    },
    'properties': {
      'name': 'Normandie Web School'
    }
  },
  {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': copeaux
    },
    'properties': {
      'name': 'Les Copeaux Numériques'
    }
  },
  {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': isd
    },
    'properties': {
      'name': 'ISD Flaubert'
    }
  }
  ]
};

var vectorSource = new VectorSource({
  features: (new GeoJSON()).readFeatures(geojsonObject)
});

var vectorLayer = new VectorLayer({
  source: vectorSource,
  style: styleFunction
});

var map = new Map({
  interactions: defaultInteractions().extend([
    new DragRotateAndZoom()
  ]),
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    vectorLayer
  ],
  target: 'carteNWS',
  view: new View({
    center: nws,
    zoom: 12
  })
});
var selected = null;

map.on('pointermove', function (e) {
  if (selected !== null) {
    selected.setStyle(undefined);
    selected = null;
  }


  map.forEachFeatureAtPixel(e.pixel, function (f) {

    let highlightStyle = new Style({
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({
          color: 'green'
        }),
        stroke: new Stroke({ color: 'green', width: 1 })
      }),
      text: new Text({
        text: f.values_.name,
        offsetY: -15,
      backgroundFill: new Fill({
        color: 'white'
      })
      })
    })
    selected = f;
    f.setStyle(highlightStyle);
    return true;
  });
});