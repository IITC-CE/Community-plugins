// ==UserScript==
// @author          robertclemo
// @id              anchor-route-planner@robertclemo
// @name            Anchor Route Planner
// @category        Tweaks
// @version         0.2.0
// @namespace       https://github.com/robertclemo/ingress-plugins
// @description     Mark anchor portals with Draw Tools (markers, or the corners of a polygon), then get the fastest real driving/walking route stitching them together, in the best order.
// @updateURL       https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/robertclemo/anchor-route-planner.meta.js
// @downloadURL     https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/robertclemo/anchor-route-planner.user.js
// @homepageURL     https://github.com/robertclemo/ingress-plugins
// @depends         draw-tools@breunigs
// @issueTracker    https://github.com/robertclemo/ingress-plugins/issues
// @include         https://intel.ingress.com/*
// @match           https://intel.ingress.com/*
// @grant           none
// ==/UserScript==


function wrapper(plugin_info) {
  if (typeof window.plugin !== 'function') window.plugin = function () {};
  if (typeof window.plugin.anchorRoutePlanner !== 'undefined') return;

  var self = {};
  window.plugin.anchorRoutePlanner = self;

  self.routeLayer = null;

  // How close (meters) a drawn point has to be to a loaded portal to "snap" to it.
  var SNAP_METERS = 100;
  // How close (meters) two anchor points have to be to each other to be treated as duplicates
  // (e.g. a shared corner between two shapes).
  var DEDUP_METERS = 15;

  // ---------- geometry helpers ----------

  function metersBetween(a, b) {
    var R = 6371000;
    var dLat = (b.lat - a.lat) * Math.PI / 180;
    var dLng = (b.lng - a.lng) * Math.PI / 180;
    var lat1 = a.lat * Math.PI / 180;
    var lat2 = b.lat * Math.PI / 180;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function flattenLatLngs(ll) {
    var out = [];
    (function walk(arr) {
      if (!arr || !arr.length) return;
      if (typeof arr[0].lat === 'number') {
        arr.forEach(function (p) { out.push({ lat: p.lat, lng: p.lng }); });
      } else {
        arr.forEach(walk);
      }
    })(ll);
    return out;
  }

  // ---------- gather anchor points from Draw Tools ----------

  function collectRawPoints() {
    if (!window.plugin.drawTools || !window.plugin.drawTools.drawnItems) {
      alert('Draw Tools plugin is required. Enable it, then mark your anchor portals (either place a marker on each one, or draw a polygon whose corners sit on the anchors), and run this again.');
      return null;
    }
    var pts = [];
    window.plugin.drawTools.drawnItems.eachLayer(function (layer) {
      if (layer instanceof L.Marker) {
        var ll = layer.getLatLng();
        pts.push({ lat: ll.lat, lng: ll.lng });
      } else if (layer instanceof L.Circle) {
        // circles don't have discrete corners; skip
      } else if (layer.getLatLngs) {
        flattenLatLngs(layer.getLatLngs()).forEach(function (p) { pts.push(p); });
      }
    });
    return pts;
  }

  function dedupe(pts) {
    var out = [];
    pts.forEach(function (p) {
      var dup = out.some(function (q) { return metersBetween(p, q) < DEDUP_METERS; });
      if (!dup) out.push(p);
    });
    return out;
  }

  function snapToPortals(pts) {
    return pts.map(function (p, idx) {
      var best = null, bestD = Infinity;
      for (var guid in window.portals) {
        var portal = window.portals[guid];
        var ll = portal.getLatLng();
        var d = metersBetween(p, { lat: ll.lat, lng: ll.lng });
        if (d < bestD) { bestD = d; best = { guid: guid, lat: ll.lat, lng: ll.lng, title: (portal.options.data && portal.options.data.title) || 'Portal' }; }
      }
      if (best && bestD <= SNAP_METERS) {
        return best;
      }
      return { guid: null, lat: p.lat, lng: p.lng, title: 'Waypoint ' + (idx + 1) + ' (no loaded portal within ' + SNAP_METERS + 'm — zoom in so it loads, then redraw)' };
    });
  }

  function getAnchors() {
    var raw = collectRawPoints();
    if (!raw) return null;
    raw = dedupe(raw);
    if (raw.length < 2) {
      alert('Found ' + raw.length + ' anchor point(s). Mark at least 2 (a polygon’s corners, or individual markers) and try again.');
      return null;
    }
    return snapToPortals(raw);
  }

  // ---------- fallback: straight-line nearest-neighbor + 2-opt (small N, so brute-ish 2-opt is plenty) ----------

  function straightLineOrder(anchors) {
    var n = anchors.length;
    var m = [];
    for (var i = 0; i < n; i++) {
      m.push([]);
      for (var j = 0; j < n; j++) m[i][j] = metersBetween(anchors[i], anchors[j]);
    }
    var visited = new Array(n).fill(false);
    var tour = [0];
    visited[0] = true;
    for (var k = 1; k < n; k++) {
      var last = tour[tour.length - 1], best = -1, bestD = Infinity;
      for (var j = 0; j < n; j++) if (!visited[j] && m[last][j] < bestD) { bestD = m[last][j]; best = j; }
      tour.push(best); visited[best] = true;
    }
    var improved = true;
    while (improved) {
      improved = false;
      for (var a = 0; a < n - 1; a++) {
        for (var b = a + 1; b < n; b++) {
          var p1 = tour[a === 0 ? n - 1 : a - 1], p2 = tour[a], p3 = tour[b], p4 = tour[(b + 1) % n];
          if (p1 === p3 || p2 === p4) continue;
          if (m[p1][p3] + m[p2][p4] + 1e-6 < m[p1][p2] + m[p3][p4]) {
            var seg = tour.slice(a, b + 1).reverse();
            for (var s = 0; s < seg.length; s++) tour[a + s] = seg[s];
            improved = true;
          }
        }
      }
    }
    var totalM = 0;
    for (var t = 0; t < n; t++) totalM += m[tour[t]][tour[(t + 1) % n]];
    return { order: tour.map(function (i) { return anchors[i]; }), meters: totalM, geometry: null, real: false };
  }

  // ---------- OSRM trip service (real road network, roundtrip, optimized order) ----------

  function osrmTrip(anchors, profile, baseUrl) {
    var coordStr = anchors.map(function (p) { return p.lng + ',' + p.lat; }).join(';');
    var url = baseUrl + '/trip/v1/' + profile + '/' + coordStr +
      '?source=first&destination=any&roundtrip=true&geometries=geojson&overview=full';
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('OSRM HTTP ' + r.status);
      return r.json();
    }).then(function (data) {
      if (data.code !== 'Ok' || !data.trips || !data.trips.length) throw new Error('OSRM: ' + (data.code || 'no trip'));
      var trip = data.trips[0];
      var order = data.waypoints
        .map(function (w, idx) { return { idx: idx, wp: w.waypoint_index }; })
        .sort(function (a, b) { return a.wp - b.wp; })
        .map(function (e) { return anchors[e.idx]; });
      return {
        order: order,
        meters: trip.distance,
        seconds: trip.duration,
        geometry: trip.geometry, // GeoJSON LineString, [lng,lat] pairs
        real: true
      };
    });
  }

  function solve(anchors, mode) {
    var profile, baseUrl;
    if (mode === 'walk') { profile = 'foot'; baseUrl = 'https://routing.openstreetmap.de/routed-foot'; }
    else { profile = 'driving'; baseUrl = 'https://router.project-osrm.org'; }

    return osrmTrip(anchors, profile, baseUrl).catch(function (err) {
      console.warn('[Anchor Route Planner] OSRM routing failed, falling back to straight-line estimate:', err);
      var fallback = straightLineOrder(anchors);
      fallback.fallbackReason = err.message || String(err);
      return fallback;
    });
  }

  // ---------- rendering ----------

  function clearRoute() {
    if (self.routeLayer) { window.map.removeLayer(self.routeLayer); self.routeLayer = null; }
  }

  function drawRoute(result) {
    clearRoute();
    self.routeLayer = L.layerGroup();

    if (result.real && result.geometry) {
      var latlngs = result.geometry.coordinates.map(function (c) { return [c[1], c[0]]; });
      L.polyline(latlngs, { color: '#2a8fdd', weight: 4, opacity: 0.85 }).addTo(self.routeLayer);
    } else {
      var straight = result.order.map(function (p) { return [p.lat, p.lng]; });
      straight.push(straight[0]);
      L.polyline(straight, { color: '#ff6600', weight: 3, opacity: 0.85, dashArray: '6,6' }).addTo(self.routeLayer);
    }

    result.order.forEach(function (p, idx) {
      L.marker([p.lat, p.lng], {
        icon: L.divIcon({
          className: 'anchor-route-planner-stop',
          html: '<div style="background:' + (result.real ? '#2a8fdd' : '#ff6600') + ';color:#fff;border-radius:50%;width:24px;height:24px;line-height:24px;text-align:center;font-weight:bold;font-size:13px;border:2px solid #fff;">' + (idx + 1) + '</div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })
      }).addTo(self.routeLayer);
    });
    self.routeLayer.addTo(window.map);
  }

  function buildMapsLink(order, mode) {
    var stops = order.concat([order[0]]);
    var origin = stops[0], destination = stops[stops.length - 1];
    var waypoints = stops.slice(1, -1);
    var url = 'https://www.google.com/maps/dir/?api=1&travelmode=' + (mode === 'walk' ? 'walking' : 'driving') +
      '&origin=' + origin.lat + ',' + origin.lng +
      '&destination=' + destination.lat + ',' + destination.lng;
    if (waypoints.length) url += '&waypoints=' + waypoints.map(function (p) { return p.lat + ',' + p.lng; }).join('|');
    return url;
  }

  function fmtDuration(sec) {
    var m = Math.round(sec / 60);
    if (m < 60) return m + ' min';
    return Math.floor(m / 60) + ' h ' + (m % 60) + ' min';
  }

  function showResultDialog(result, mode) {
    var order = result.order;
    var listHtml = order.map(function (p, idx) {
      return '<li>' + (idx + 1) + '. ' + p.title.replace(/</g, '&lt;') + '</li>';
    }).join('');
    var km = (result.meters / 1000).toFixed(1);
    var statLine = result.real
      ? '<b>' + km + ' km</b> real ' + (mode === 'walk' ? 'walking' : 'driving') + ' route, about <b>' + fmtDuration(result.seconds) + '</b>.'
      : '<b>' + km + ' km</b> straight-line estimate (road routing was unavailable: ' + (result.fallbackReason || 'unknown error') + ').';

    var html = '<div style="max-height:400px;overflow:auto;">' +
      '<p>' + order.length + ' anchor portals, round trip. ' + statLine + '</p>' +
      '<ol style="padding-left:1.2em;">' + listHtml + '</ol>' +
      '<p><a href="' + buildMapsLink(order, mode) + '" target="_blank">Open in Google Maps</a></p>' +
      '</div>';

    dialog({
      title: 'Anchor Route Planner',
      html: html,
      width: 420,
      id: 'anchor-route-planner-dialog',
      buttons: {
        'Clear route from map': function () { clearRoute(); $(this).dialog('close'); },
        Close: function () { $(this).dialog('close'); }
      }
    });
  }

  // ---------- entry points ----------

  function run(mode) {
    var anchors = getAnchors();
    if (!anchors) return;
    if (anchors.length > 12) {
      if (!confirm(anchors.length + ' anchor points found. This is meant for a handful of field/link anchors, not dozens — continue anyway?')) return;
    }
    solve(anchors, mode).then(function (result) {
      drawRoute(result);
      showResultDialog(result, mode);
    });
  }

  self.runDrive = function () { run('drive'); };
  self.runWalk = function () { run('walk'); };
  self.clear = clearRoute;

  var setup = function () {
    $('#toolbox').append('<a onclick="window.plugin.anchorRoutePlanner.runDrive();return false;" title="Fastest driving route between your marked anchor portals">Anchor Route (Drive)</a>');
    $('#toolbox').append('<a onclick="window.plugin.anchorRoutePlanner.runWalk();return false;" title="Fastest walking route between your marked anchor portals">Anchor Route (Walk)</a>');
  };

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
