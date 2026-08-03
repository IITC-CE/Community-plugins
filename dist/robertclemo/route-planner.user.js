// ==UserScript==
// @author          robertclemo
// @id              route-planner@robertclemo
// @name            Ops Route Planner
// @category        Tweaks
// @version         0.1.1
// @namespace       https://github.com/robertclemo/route-planner-iitc
// @description     Draw a shape with Draw Tools, then compute an optimized round-trip driving route through every portal inside it.
// @updateURL       https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/robertclemo/route-planner.meta.js
// @downloadURL     https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/robertclemo/route-planner.user.js
// @homepageURL     https://github.com/robertclemo/route-planner-iitc
// @depends         draw-tools@breunigs
// @issueTracker    https://github.com/robertclemo/route-planner-iitc/issues
// @include         https://intel.ingress.com/*
// @match           https://intel.ingress.com/*
// @grant           none
// ==/UserScript==


function wrapper(plugin_info) {
  if (typeof window.plugin !== 'function') window.plugin = function () {};

  // ensure plugin framework is there
  if (typeof window.plugin.routePlanner !== 'undefined') return;

  var self = {};
  window.plugin.routePlanner = self;

  self.routeLayer = null;   // L.LayerGroup holding the polyline + numbered markers
  self.lastRoute = null;    // array of portal objects in visiting order

  // ---------- geometry helpers ----------

  // haversine distance in km
  function dist(a, b) {
    var R = 6371;
    var dLat = (b.lat - a.lat) * Math.PI / 180;
    var dLng = (b.lng - a.lng) * Math.PI / 180;
    var lat1 = a.lat * Math.PI / 180;
    var lat2 = b.lat * Math.PI / 180;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  // ray-casting point-in-polygon; pts is array of {lat,lng}
  function pointInPolygon(pt, pts) {
    var inside = false;
    for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      var xi = pts[i].lng, yi = pts[i].lat;
      var xj = pts[j].lng, yj = pts[j].lat;
      var intersect = ((yi > pt.lat) !== (yj > pt.lat)) &&
          (pt.lng < (xj - xi) * (pt.lat - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function flattenLatLngs(ll) {
    // Leaflet polygons can return nested arrays (rings / multi-polygons)
    var out = [];
    (function walk(arr) {
      if (!arr.length) return;
      if (typeof arr[0].lat === 'number') {
        arr.forEach(function (p) { out.push({ lat: p.lat, lng: p.lng }); });
      } else {
        arr.forEach(walk);
      }
    })(ll);
    return out;
  }

  // ---------- portal selection from Draw Tools shapes ----------

  function getSelectedPortals() {
    if (!window.plugin.drawTools || !window.plugin.drawTools.drawnItems) {
      alert('Draw Tools plugin is required. Enable it, draw a polygon or circle around the op area, then run this again.');
      return null;
    }

    var shapes = [];
    window.plugin.drawTools.drawnItems.eachLayer(function (layer) {
      if (layer instanceof L.Circle) {
        shapes.push({ type: 'circle', center: layer.getLatLng(), radius: layer.getRadius() });
      } else if (layer.getLatLngs) {
        shapes.push({ type: 'polygon', points: flattenLatLngs(layer.getLatLngs()) });
      }
    });

    if (shapes.length === 0) {
      alert('No drawn shapes found. Use Draw Tools to draw a polygon or circle around the portals you want to route, then run this again.');
      return null;
    }

    var selected = [];
    var seen = {};
    for (var guid in window.portals) {
      var p = window.portals[guid];
      var ll = p.getLatLng();
      var pt = { lat: ll.lat, lng: ll.lng };
      var hit = shapes.some(function (s) {
        if (s.type === 'circle') {
          return dist(pt, { lat: s.center.lat, lng: s.center.lng }) * 1000 <= s.radius;
        }
        return pointInPolygon(pt, s.points);
      });
      if (hit && !seen[guid]) {
        seen[guid] = true;
        var title = (p.options && p.options.data && p.options.data.title) || 'Unknown portal';
        selected.push({ guid: guid, lat: ll.lat, lng: ll.lng, title: title });
      }
    }
    return selected;
  }

  // ---------- TSP heuristic: nearest neighbor + 2-opt, round trip ----------

  function buildDistanceMatrix(pts) {
    var n = pts.length;
    var m = [];
    for (var i = 0; i < n; i++) {
      m.push([]);
      for (var j = 0; j < n; j++) {
        m[i][j] = (i === j) ? 0 : dist(pts[i], pts[j]);
      }
    }
    return m;
  }

  function nearestNeighborTour(m) {
    var n = m.length;
    var visited = new Array(n).fill(false);
    var tour = [0];
    visited[0] = true;
    for (var k = 1; k < n; k++) {
      var last = tour[tour.length - 1];
      var best = -1, bestD = Infinity;
      for (var j = 0; j < n; j++) {
        if (!visited[j] && m[last][j] < bestD) { bestD = m[last][j]; best = j; }
      }
      tour.push(best);
      visited[best] = true;
    }
    return tour;
  }

  function tourLength(tour, m) {
    var total = 0;
    for (var i = 0; i < tour.length; i++) {
      total += m[tour[i]][tour[(i + 1) % tour.length]];
    }
    return total;
  }

  function twoOpt(tour, m, timeBudgetMs) {
    var n = tour.length;
    var improved = true;
    var start = Date.now();
    while (improved) {
      improved = false;
      for (var i = 0; i < n - 1; i++) {
        for (var k = i + 1; k < n; k++) {
          if (Date.now() - start > timeBudgetMs) return tour;
          var a = tour[i === 0 ? n - 1 : i - 1], b = tour[i];
          var c = tour[k], d = tour[(k + 1) % n];
          if (a === c || b === d) continue;
          var before = m[a][b] + m[c][d];
          var after = m[a][c] + m[b][d];
          if (after + 1e-9 < before) {
            var seg = tour.slice(i, k + 1).reverse();
            for (var s = 0; s < seg.length; s++) tour[i + s] = seg[s];
            improved = true;
          }
        }
      }
    }
    return tour;
  }

  function solveRoute(pts) {
    var m = buildDistanceMatrix(pts);
    var tour = nearestNeighborTour(m);
    tour = twoOpt(tour, m, 4000); // 4s budget, fine for 50-150 portals
    return { order: tour.map(function (i) { return pts[i]; }), km: tourLength(tour, m) };
  }

  // ---------- rendering ----------

  function clearRoute() {
    if (self.routeLayer) {
      window.map.removeLayer(self.routeLayer);
      self.routeLayer = null;
    }
  }

  function drawRoute(order) {
    clearRoute();
    self.routeLayer = L.layerGroup();
    var latlngs = order.map(function (p) { return [p.lat, p.lng]; });
    latlngs.push(latlngs[0]); // close the loop
    L.polyline(latlngs, { color: '#ff6600', weight: 3, opacity: 0.85, dashArray: '6,6' })
      .addTo(self.routeLayer);
    order.forEach(function (p, idx) {
      L.marker([p.lat, p.lng], {
        icon: L.divIcon({
          className: 'route-planner-stop',
          html: '<div style="background:#ff6600;color:#fff;border-radius:50%;width:22px;height:22px;line-height:22px;text-align:center;font-weight:bold;font-size:12px;border:2px solid #fff;">' + (idx + 1) + '</div>',
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        })
      }).addTo(self.routeLayer);
    });
    self.routeLayer.addTo(window.map);
  }

  // chunk into Google Maps directions links (waypoint limit ~23 per link)
  function buildMapsLinks(order) {
    var stops = order.concat([order[0]]); // round trip
    var CHUNK = 23; // intermediate waypoints per link, safely under Google's 25 cap
    var links = [];
    var i = 0;
    while (i < stops.length - 1) {
      var seg = stops.slice(i, Math.min(i + CHUNK + 1, stops.length));
      if (seg.length < 2) break;
      var origin = seg[0], destination = seg[seg.length - 1];
      var waypoints = seg.slice(1, -1);
      var url = 'https://www.google.com/maps/dir/?api=1&travelmode=driving' +
        '&origin=' + origin.lat + ',' + origin.lng +
        '&destination=' + destination.lat + ',' + destination.lng;
      if (waypoints.length) {
        url += '&waypoints=' + waypoints.map(function (p) { return p.lat + ',' + p.lng; }).join('|');
      }
      links.push(url);
      i += CHUNK;
    }
    return links;
  }

  function showResultDialog(result) {
    var order = result.order;
    var listHtml = order.map(function (p, idx) {
      return '<li>' + (idx + 1) + '. ' + p.title.replace(/</g, '&lt;') + '</li>';
    }).join('');
    var links = buildMapsLinks(order);
    var linksHtml = links.map(function (u, idx) {
      return '<div><a href="' + u + '" target="_blank">Open leg ' + (idx + 1) + ' in Google Maps' +
        (links.length > 1 ? ' (' + (idx === 0 ? 'start' : 'continued') + ')' : '') + '</a></div>';
    }).join('');

    var html = '<div style="max-height:400px;overflow:auto;">' +
      '<p><b>' + order.length + ' portals</b> &mdash; approx round-trip driving order distance: <b>' +
      result.km.toFixed(1) + ' km</b> (straight-line estimate, not actual road distance).</p>' +
      '<ol style="padding-left:1.2em;">' + listHtml + '</ol>' +
      '<p>' + linksHtml + '</p>' +
      (links.length > 1 ? '<p style="font-size:11px;color:#888;">Google Maps limits waypoints per link, so the route is split into ' + links.length + ' legs. Open each in order.</p>' : '') +
      '</div>';

    dialog({
      title: 'Ops Route Planner',
      html: html,
      width: 420,
      id: 'route-planner-dialog',
      buttons: {
        'Clear route from map': function () { clearRoute(); $(this).dialog('close'); },
        Close: function () { $(this).dialog('close'); }
      }
    });
  }

  // ---------- entry point ----------

  function runPlanner() {
    var portals = getSelectedPortals();
    if (!portals) return;
    if (portals.length < 2) {
      alert('Found ' + portals.length + ' portal(s) inside the drawn shape(s). Need at least 2 to plan a route. Make sure the portals are loaded on screen (zoom in) before drawing the shape.');
      return;
    }
    if (portals.length > 300) {
      if (!confirm(portals.length + ' portals selected. That may take a while to solve and clutter the map. Continue?')) return;
    }
    var result = solveRoute(portals);
    self.lastRoute = result;
    drawRoute(result.order);
    showResultDialog(result);
  }

  // ---------- setup ----------

  var setup = function () {
    $('#toolbox').append('<a onclick="window.plugin.routePlanner.run();return false;" title="Plan a driving route through portals inside a Draw Tools shape">Route Planner</a>');
  };

  self.run = runPlanner;
  self.clear = clearRoute;

  setup.info = plugin_info;
  if (!window.bootPlugins) window.bootPlugins = [];
  window.bootPlugins.push(setup);
  if (window.iitcLoaded) setup();
}

var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
  info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
}
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement).appendChild(script);
