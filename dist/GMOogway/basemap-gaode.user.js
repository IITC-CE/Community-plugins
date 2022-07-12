// ==UserScript==
// @id             basemap-gaode@GMOogway
// @name           Map layers from GAODE by GMOogway
// @category       Map Tiles
// @version        0.3.0.20190108
// @author         GMOogway
// @description    [local-2019-01-08] Add autonavi.com (China) map layers by GMOogway
// @downloadURL    https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/GMOogway/basemap-gaode.user.js
// @updateURL      https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/GMOogway/basemap-gaode.meta.js
// @namespace      https://github.com/GMOogway/iitc-plugins
// @include        https://intel.ingress.com/*
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==



function wrapper(plugin_info) {
  // ensure plugin framework is there, even if iitc is not yet loaded
  if (typeof window.plugin !== 'function') window.plugin = function() {};

  //PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
  //(leaving them in place might break the 'About IITC' page or break update checks)
  plugin_info.buildName = 'local';
  plugin_info.dateTimeVersion = '20190108';
  plugin_info.pluginId = 'basemap-gaode';
  //END PLUGIN AUTHORS NOTE

// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.mapTileGaode = function() {};

// Before understanding how this plugin works, you should know 3 points:
//
//   Point1.
//     The coordinate system of Ingress is WGS-84.
//     However, the tiles of Google maps (except satellite map) and some other maps
//     in China have offsets (base on GCJ-02 coordinate system) by China policy.
//     That means, if you request map tiles by giving GCJ-02 position, you
//     will get the correct map.
//
//   Point2.
//     Currently there are no easy algorithm to transform from GCJ-02 to WGS-84,
//     but we can easily transform data from WGS-84 to GCJ-02.
//
//   Point3.
//     When using, for example, Google maps in IITC, the layer structure looks like this:
//      --------------------------
//     |    Other Leaflet layers  |  (Including portals, links, fields, and so on)
//      --------------------------
//     | L.GridLayer.GoogleMutant |  (Only for controling)
//      --------------------------
//     |      Google Map layer    |  (Generated by Google Map APIs, for rendering maps)
//      --------------------------
//
//     When users are interacting with L.GridLayer.GoogleMutant (for example, dragging, zooming),
//     L.GridLayer.GoogleMutant will perform the same action on the Google Map layer using Google
//     Map APIs.
//
// So, here is the internal of the plugin:
//
// The plugin overwrites behaviours of L.GridLayer.GoogleMutant. When users are dragging the map,
// L.GridLayer.GoogleMutant will pass offseted positions to Google Map APIs (WGS-84 to GCJ-02).
// So Google Map APIs will render a correct map.
//
// The offset between Google maps and Ingress objects can also be fixed by applying
// WGS-84 to GCJ-02 transformation on Ingress objects. However we cannot simply know
// the requesting bounds of Ingress objects because we cannot transform GCJ-02 to
// WGS-84. As a result, the Ingress objects on maps would be incomplete.
//
// The algorithm of transforming WGS-84 to GCJ-02 comes from:
// https://on4wp7.codeplex.com/SourceControl/changeset/view/21483#353936
// There is no official algorithm because it is classified information.
//
// Here we use the PRCoords implementation of this algorithm, which contains
// a more careful yet still rough "China area" check in "insane_is_in_china.js".
// Comments and code style have been adapted, mainly to remove profanity.
// https://github.com/Artoria2e5/PRCoords
//
// Correction is made for maps that have the parameter
//   needFixChinaOffset: true
// in options. For an example of work, see Leaflet.GoogleMutant.js

function chinaMapOffsetObfs() {
 this.earthR = 6378137.0;
}

chinaMapOffsetObfs.prototype.isInChina = function() { // insane_is_in_china
  // This set of points roughly illustrates the scope of Google's
  // distortion. It has nothing to do with national borders etc.
  // Points around Hong Kong/Shenzhen are mapped with a little more precision,
  // in hope that it will make agents work a bit more smoothly there.
  //
  // Edits around these points are welcome.
  var POINTS = [
    // start hkmo
    114.433722, 22.064310,
    114.009458, 22.182105,
    113.599275, 22.121763,
    113.583463, 22.176002,
    113.530900, 22.175318,
    113.529542, 22.210608,
    113.613377, 22.227435,
    113.938514, 22.483714,
    114.043449, 22.500274,
    114.138506, 22.550640,
    114.222984, 22.550960,
    114.366803, 22.524255,
    // end hkmo
    115.254019, 20.235733,
    121.456316, 26.504442,
    123.417261, 30.355685,
    124.289197, 39.761103,
    126.880509, 41.774504,
    127.887261, 41.370015,
    128.214602, 41.965359,
    129.698745, 42.452788,
    130.766139, 42.668534,
    131.282487, 45.037051,
    133.142361, 44.842986,
    134.882453, 48.370596,
    132.235531, 47.785403,
    130.980075, 47.804860,
    130.659026, 48.968383,
    127.860252, 50.043973,
    125.284310, 53.667091,
    120.619316, 53.100485,
    119.403751, 50.105903,
    117.070862, 49.690388,
    115.586019, 47.995542,
    118.599613, 47.927785,
    118.260771, 46.707335,
    113.534759, 44.735134,
    112.093739, 45.001999,
    111.431259, 43.489381,
    105.206324, 41.809510,
    96.485703, 42.778692,
    94.167961, 44.991668,
    91.130430, 45.192938,
    90.694601, 47.754437,
    87.356293, 49.232005,
    85.375791, 48.263928,
    85.876055, 47.109272,
    82.935423, 47.285727,
    81.929808, 45.506317,
    79.919457, 45.108122,
    79.841455, 42.178752,
    73.334917, 40.076332,
    73.241805, 39.062331,
    79.031902, 34.206413,
    78.738395, 31.578004,
    80.715812, 30.453822,
    81.821692, 30.585965,
    85.501663, 28.208463,
    92.096061, 27.754241,
    94.699781, 29.357171,
    96.079442, 29.429559,
    98.910308, 27.140660,
    97.404057, 24.494701,
    99.400021, 23.168966,
    100.697449, 21.475914,
    102.976870, 22.616482,
    105.476997, 23.244292,
    108.565621, 20.907735,
    107.730505, 18.193406,
    110.669856, 17.754550,
  ];
  var lats = POINTS.filter(function (_, idx) { return idx % 2 === 1; });
  var lngs = POINTS.filter(function (_, idx) { return idx % 2 === 0; });
  POINTS = null; // not needed anyway...

  /// *** pnpoly *** ///
  // Wm. Franklin's 8-line point-in-polygon C program
  // Copyright (c) 1970-2003, Wm. Randolph Franklin
  // Copyright (c) 2017, Mingye Wang (js translation)
  //
  // Permission is hereby granted, free of charge, to any person obtaining
  // a copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to
  // permit persons to whom the Software is furnished to do so, subject to
  // the following conditions:
  //
  //   1. Redistributions of source code must retain the above copyright
  //      notice, this list of conditions and the following disclaimers.
  //   2. Redistributions in binary form must reproduce the above
  //      copyright notice in the documentation and/or other materials
  //      provided with the distribution.
  //   3. The name of W. Randolph Franklin may not be used to endorse or
  //      promote products derived from this Software without specific
  //      prior written permission.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  // EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  // NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  // LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  // OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
  // WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  var pnpoly = function (xs, ys, x, y) {
    if (!(xs.length === ys.length)) { throw new Error('pnpoly: assert(xs.length === ys.length)'); }
    var inside = 0;
    for (var i = 0, j = xs.length - 1; i < xs.length; j = i++) {
      inside ^= ys[i] > y !== ys[j] > y &&
                x < (xs[j] - xs[i]) * (y - ys[i]) / (ys[j] - ys[i]) + xs[i];
    }
    return !!inside;
  };
  /// ^^^ pnpoly ^^^ ///

  var isInChina = function (coords) {
    // Yank out South China Sea as it's not distorted.
    return coords.lat >= 17.754 && coords.lat <= 55.8271 &&
           coords.lng >= 72.004 && coords.lng <= 137.8347 &&
           pnpoly(lats, lngs, coords.lat, coords.lng);
  };

  return isInChina;
};

chinaMapOffsetObfs.prototype.transform = function(x, y) {
	var xy = x * y;
	var absX = Math.sqrt(Math.abs(x));
	var xPi = x * Math.PI;
	var yPi = y * Math.PI;
	var d = 20.0*Math.sin(6.0*xPi) + 20.0*Math.sin(2.0*xPi);

	var lat = d;
	var lng = d;

	lat += 20.0*Math.sin(yPi) + 40.0*Math.sin(yPi/3.0);
	lng += 20.0*Math.sin(xPi) + 40.0*Math.sin(xPi/3.0);

	lat += 160.0*Math.sin(yPi/12.0) + 320*Math.sin(yPi/30.0);
	lng += 150.0*Math.sin(xPi/12.0) + 300.0*Math.sin(xPi/30.0);

	lat *= 2.0 / 3.0;
	lng *= 2.0 / 3.0;

	lat += -100.0 + 2.0*x + 3.0*y + 0.2*y*y + 0.1*xy + 0.2*absX;
	lng += 300.0 + x + 2.0*y + 0.1*x*x + 0.1*xy + 0.1*absX;

	return {lat: lat, lng: lng}
};

chinaMapOffsetObfs.prototype.delta = function(lat, lng) {
	var ee = 0.00669342162296594323;
	var d = this.transform(lng-105.0, lat-35.0);
	var radLat = lat / 180.0 * Math.PI;
	var magic = Math.sin(radLat);
	magic = 1 - ee*magic*magic;
	var sqrtMagic = Math.sqrt(magic);
	d.lat = (d.lat * 180.0) / ((this.earthR * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
	d.lng = (d.lng * 180.0) / (this.earthR / sqrtMagic * Math.cos(radLat) * Math.PI);
	return d;
};

chinaMapOffsetObfs.prototype.wgs2gcj = function(wgsLat, wgsLng) {
	if (!this.isInChina(wgsLat, wgsLng)) {
		return {lat: wgsLat, lng: wgsLng};
	}
	var d = this.delta(wgsLat, wgsLng);
	return {lat: wgsLat + d.lat, lng: wgsLng + d.lng};
};

chinaMapOffsetObfs.prototype.gcj2wgs = function(gcjLat, gcjLng) {
	if (!this.isInChina(gcjLat, gcjLng)) {
		return {lat: gcjLat, lng: gcjLng};
	}
	var d = this.delta(gcjLat, gcjLng);
	return {lat: gcjLat - d.lat, lng: gcjLng - d.lng};
};

chinaMapOffsetObfs.prototype.gcj2wgs_exact = function(gcjLat, gcjLng) {
	// newCoord = oldCoord = gcjCoord
	var newLat = gcjLat, newLng = gcjLng;
	var oldLat = newLat, oldLng = newLng;
	var threshold = 1e-6; // ~0.55 m equator & latitude

	for (var i = 0; i < 30; i++) {
		// oldCoord = newCoord
		oldLat = newLat;
		oldLng = newLng;
		// newCoord = gcjCoord - wgs_to_gcj_delta(newCoord)
		var tmp = this.wgs2gcj(newLat, newLng);
		// approx difference using gcj-space difference
		newLat -= gcjLat - tmp.lat;
		newLng -= gcjLng - tmp.lng;
		// diffchk
		if (Math.max(Math.abs(oldLat - newLat), Math.abs(oldLng - newLng)) < threshold) {
			break;
		}
	}
	return {lat: newLat, lng: newLng};
};

chinaMapOffsetObfs.prototype.distance = function(latA, lngA, latB, lngB) {
	var pi180 = Math.PI / 180;
	var arcLatA = latA * pi180;
 	var arcLatB = latB * pi180;
	var x = Math.cos(arcLatA) * Math.cos(arcLatB) * Math.cos((lngA-lngB)*pi180);
	var y = Math.sin(arcLatA) * Math.sin(arcLatB);
	var s = x + y;
	if (s > 1) {
		s = 1;
	}
	if (s < -1) {
		s = -1;
	}
	var alpha = Math.acos(s);
	var distance = alpha * earthR;
	return distance;
};

chinaMapOffsetObfs.prototype.gcj2bd = function(gcjLat, gcjLng) {
	if (!this.isInChina(gcjLat, gcjLng)) {
		return {lat: gcjLat, lng: gcjLng};
	}

	var x = gcjLng, y = gcjLat;
	var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * Math.PI);
	var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * Math.PI);
	var bdLng = z * Math.cos(theta) + 0.0065;
	var bdLat = z * Math.sin(theta) + 0.006;
	return {lat: bdLat, lng: bdLng};
};

chinaMapOffsetObfs.prototype.bd2gcj = function(bdLat, bdLng) {
	if (!this.isInChina(bdLat, bdLng)) {
		return {lat: bdLat, lng: bdLng};
	}

	var x = bdLng - 0.0065, y = bdLat - 0.006;
	var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * Math.PI);
	var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * Math.PI);
	var gcjLng = z * Math.cos(theta);
	var gcjLat = z * Math.sin(theta);
	return {lat: gcjLat, lng: gcjLng};
};

chinaMapOffsetObfs.prototype.wgs2bd = function(wgsLat, wgsLng) {
	var gcj = this.wgs2gcj(wgsLat, wgsLng);
	return this.gcj2bd(gcj.lat, gcj.lng);
};

chinaMapOffsetObfs.prototype.bd2wgs = function(bdLat, bdLng) {
	var gcj = this.bd2gcj(bdLat, bdLng);
	return this.gcj2wgs(gcj.lat, gcj.lng);
}

///////// begin overwrited L.GridLayer /////////
L.GridLayer.prototype._getTiledPixelBounds = (function () {
  return function (center) {
  /// modified here ///
    center = window.plugin.mapTileGaode.getLatLng(center, this.options);
    /////////////////////
    var map = this._map,
      mapZoom = map._animatingZoom ? Math.max(map._animateToZoom, map.getZoom()) : map.getZoom(),
      scale = map.getZoomScale(mapZoom, this._tileZoom),
      pixelCenter = map.project(center, this._tileZoom).floor(),
      halfSize = map.getSize().divideBy(scale * 2);

    return new L.Bounds(pixelCenter.subtract(halfSize), pixelCenter.add(halfSize));
  };
})(L.GridLayer.prototype._getTiledPixelBounds);

L.GridLayer.prototype._setZoomTransform = (function (original) {
  return function (level, center, zoom) {
    center = window.plugin.mapTileGaode.getLatLng(center, this.options);
    original.apply(this, [level, center, zoom]);
  };
})(L.GridLayer.prototype._setZoomTransform);

///////// end overwrited L.GridLayer /////////

window.plugin.mapTileGaode.Obfs = new chinaMapOffsetObfs();

window.plugin.mapTileGaode.getLatLng = function (pos, options) {
  // No offsets in satellite and hybrid maps
  if (options.chinaMapOffsetObfs == 'gcj02' || options.chinaMapOffsetObfs == 'bd09') {
    return window.plugin.mapTileGaode.process(pos, options);
  }
  return pos;
};

window.plugin.mapTileGaode.process = function (wgs, options) {
    //console.log(options.mapOffsetObfs);
    if (window.plugin.mapTileGaode.Obfs.isInChina(wgs)) {
        if (options.chinaMapOffsetObfs == 'gcj02') {
            return window.plugin.mapTileGaode.Obfs.wgs2gcj(wgs.lat, wgs.lng);
        } else if (options.mapOffsetObfs == 'bd09'){
            return window.plugin.mapTileGaode.Obfs.wgs2bd(wgs.lat, wgs.lng);
        } else {
            return wgs;
        }
    } else {
        return wgs;
    }
};

window.plugin.mapTileGaode.addLayer = function() {

  var maptypes = {
    '高德路网': ['GD-Normal', [1,2,3,4], 3, 19, 'https://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=7', 'map tiles by gaode.com, plugin written by GMOogway.', 'gcj02'],
    '高德影像': ['GD-Satellite', [1,2,3,4], 3, 18, 'https://wprd0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=1&style=6', 'map tiles by gaode.com, plugin written by GMOogway.', 'gcj02'],
  };

  for (var mapname in maptypes) {
    var mapinfo = maptypes[mapname];

    var maptype = mapinfo[0];
    var mapSubDomains = mapinfo[1]
    var mapMinZoom = mapinfo[2];
    var mapMaxZoom = mapinfo[3];
    var mapTileUrl = mapinfo[4];
    var mapAttribution = mapinfo[5];
    var mapOffsetObfs = mapinfo[6];

    var mapLayer = new L.TileLayer(mapTileUrl, {
      attribution: mapAttribution,
      subdomains: mapSubDomains,
      layer: mapname,
      type: maptype,
      minZoom: mapMinZoom,
      maxNativeZoom: mapMaxZoom,
      maxZoom: 20,
      chinaMapOffsetObfs: mapOffsetObfs
    });

    layerChooser.addBaseLayer(mapLayer, mapname);
  }

};

window.plugin.mapTileGaode.drawbutton = function() {

}

var setup = function() {

  window.plugin.mapTileGaode.addLayer();

  window.plugin.mapTileGaode.drawbutton();

  localStorage['iitc-base-map'] = '高德路网';

}

// PLUGIN END //////////////////////////////////////////////////////////


  setup.info = plugin_info; //add the script info data to the function as a property
  if(!window.bootPlugins) window.bootPlugins = [];
  window.bootPlugins.push(setup);
  // if IITC has already booted, immediately run the 'setup' function
  if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);