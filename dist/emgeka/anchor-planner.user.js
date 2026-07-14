// ==UserScript==
// @author          emgeka
// @id              anchor-planner@emgeka
// @name            Anchor Planner
// @category        Layer
// @version         0.1.41
// @namespace       https://example.local/iitc
// @description     Anchor Planner: scans Draw Tools plans, resolves portal names, lists plan portals and key counts.
// @updateURL       https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/emgeka/anchor-planner.meta.js
// @downloadURL     https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/emgeka/anchor-planner.user.js
// @homepageURL     https://github.com/emgeka/iitc-anchor-planner
// @supportURL      https://github.com/emgeka/iitc-anchor-planner/issues
// @issueTracker    https://github.com/emgeka/iitc-anchor-planner/issues
// @depends         draw-tools@breunigs
// @recommends      bookmarks@ZasoGD
// @antiFeatures    scraper|export
// @include         https://intel.ingress.com/*
// @include         http://intel.ingress.com/*
// @match           https://intel.ingress.com/*
// @match           http://intel.ingress.com/*
// @grant           none
// ==/UserScript==


function wrapper(plugin_info) {
  'use strict';

  if (typeof window.plugin !== 'function') window.plugin = function () {};

  plugin_info.buildName = 'local';
  plugin_info.dateTimeVersion = '20260714143016';
  plugin_info.pluginId = 'anchor-planner';

  window.plugin.anchorPlanner = function () {};
  var ap = window.plugin.anchorPlanner;

  ap.VERSION = '0.1.41';
  ap.STORAGE_KEY = 'plugin-anchor-planner-v1';
  ap.DEFAULT_TOLERANCE_M = 25;
  ap.MIN_ANCHOR_LINKS = 3;
  ap.PANE_NAME = 'anchorPlannerPane';

  ap.state = {
    tolerance: ap.DEFAULT_TOLERANCE_M,
    minAnchorLinks: ap.MIN_ANCHOR_LINKS,
    anchors: {},
    lastScan: null,
    panelCollapsed: false,
    showDebug: false,
    listFilter: 'all',
    endpointAssignments: {}
  };

  ap.runtime = {
    layerGroup: null,
    panel: null,
    enabled: true,
    stats: {},
    links: [],
    existingLinkIds: {},
    existingLinks: [],
    unresolvedEndpoints: [],
    selectedBlocker: null,
    userLocation: null,
    userLocationHooksBound: false,
    nextTargetKey: null,
    overlayCount: 0,
    htmlOverlay: null
  };

  ap.escapeHtml = function (value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  ap.isGuidLike = function (value) {
    if (!value) return false;
    var s = String(value).trim();
    // IITC portal GUIDs are long technical identifiers. Do not ever show them as portal names.
    return /^[0-9a-f]{24,}(?:\.[0-9a-f]+)?$/i.test(s) || /^[0-9a-f]{32,}$/i.test(s);
  };

  ap.cleanTitle = function (value) {
    if (typeof value !== 'string') return '';
    var s = value.trim();
    if (!s || ap.isGuidLike(s)) return '';
    return s;
  };


  ap.extractTitleFromObject = function (obj, depth, seen) {
    if (!obj || depth > 4) return '';
    seen = seen || [];
    for (var si = 0; si < seen.length; si++) if (seen[si] === obj) return '';
    if (typeof obj !== 'object') return '';
    seen.push(obj);

    var directKeys = ['title', 'name', 'portalTitle'];
    for (var i = 0; i < directKeys.length; i++) {
      try {
        var direct = ap.cleanTitle(obj[directKeys[i]]);
        if (direct) return direct;
      } catch (e) {}
    }

    var preferredContainers = ['data', 'options', '_details', 'details', 'portal', 'result', 'summary'];
    for (var c = 0; c < preferredContainers.length; c++) {
      try {
        var fromContainer = ap.extractTitleFromObject(obj[preferredContainers[c]], depth + 1, seen);
        if (fromContainer) return fromContainer;
      } catch (e) {}
    }

    if (Array.isArray(obj)) {
      for (var a = 0; a < obj.length; a++) {
        var fromArray = ap.extractTitleFromObject(obj[a], depth + 1, seen);
        if (fromArray) return fromArray;
      }
    }

    return '';
  };

  ap.load = function () {
    try {
      var raw = localStorage.getItem(ap.STORAGE_KEY);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        ap.state = Object.assign(ap.state, parsed);
        ap.state.anchors = ap.state.anchors || {};
        ap.state.endpointAssignments = ap.state.endpointAssignments || {};
        ap.state.tolerance = parseInt(ap.state.tolerance, 10) || ap.DEFAULT_TOLERANCE_M;
        ap.state.minAnchorLinks = parseInt(ap.state.minAnchorLinks, 10) || ap.MIN_ANCHOR_LINKS;
      }
    } catch (e) {
      console.warn('[Anchor Planner] Could not load state', e);
    }
  };

  ap.save = function () {
    try { localStorage.setItem(ap.STORAGE_KEY, JSON.stringify(ap.state)); }
    catch (e) { console.warn('[Anchor Planner] Could not save state', e); }
  };

  ap.toLatLng = function (obj) {
    if (!obj) return null;
    if (obj instanceof L.LatLng) return obj;
    if (typeof obj.lat === 'number' && typeof obj.lng === 'number') return L.latLng(obj.lat, obj.lng);
    if (typeof obj.lat === 'function' && typeof obj.lng === 'function') return L.latLng(obj.lat(), obj.lng());
    return null;
  };

  ap.flattenLatLngs = function (latlngs, out) {
    out = out || [];
    if (!latlngs) return out;
    if (Array.isArray(latlngs)) {
      for (var i = 0; i < latlngs.length; i++) ap.flattenLatLngs(latlngs[i], out);
    } else {
      var ll = ap.toLatLng(latlngs);
      if (ll) out.push(ll);
    }
    return out;
  };

  ap.latLngKey = function (latlng) {
    return Number(latlng.lat).toFixed(6) + ',' + Number(latlng.lng).toFixed(6);
  };

  ap.getPortalTitleFromMarker = function (guid, marker) {
    var candidates = [];
    var data = marker && marker.options && marker.options.data ? marker.options.data : null;

    // Wichtig: zuerst die Daten des tatsächlich zugeordneten window.portals-Markers nutzen.
    if (data) candidates.push(data.title, data.name, data.portalTitle);
    if (marker && marker.options) candidates.push(marker.options.title, marker.options.name, marker.options.portalTitle);
    if (marker && marker._details) candidates.push(marker._details.title, marker._details.name);

    if (marker && typeof marker.getDetails === 'function') {
      try {
        var details = marker.getDetails();
        if (details) candidates.push(details.title, details.name, ap.extractTitleFromObject(details, 0));
      } catch (e) {}
    }

    try {
      if (typeof window.getPortalSummaryData === 'function') {
        var summary = window.getPortalSummaryData(guid);
        if (summary) candidates.push(summary.title, summary.name, ap.extractTitleFromObject(summary, 0));
      }
    } catch (e) {}

    try {
      if (typeof window.getPortalDataByGuid === 'function') {
        var byGuid = window.getPortalDataByGuid(guid);
        if (byGuid) candidates.push(byGuid.title, byGuid.name, ap.extractTitleFromObject(byGuid, 0));
      }
    } catch (e) {}

    // Als letzter Versuch tiefere, aber begrenzte Suche in Marker-Optionen. Keine GUIDs als Namen anzeigen.
    if (marker && marker.options) candidates.push(ap.extractTitleFromObject(marker.options, 0));

    for (var i = 0; i < candidates.length; i++) {
      var title = ap.cleanTitle(candidates[i]);
      if (title) return title;
    }

    return 'Name nicht geladen';
  };

  ap.getPortalAddressFromMarker = function (guid, marker) {
    var data = marker && marker.options && marker.options.data ? marker.options.data : {};
    var candidates = [
      data.address,
      data.formattedAddress,
      data.streetAddress,
      data.addr,
      data.portalAddress,
      data.location && data.location.address
    ];
    try {
      if (typeof window.getPortalSummaryData === 'function') {
        var summary = window.getPortalSummaryData(guid);
        if (summary) candidates.push(summary.address, summary.formattedAddress, summary.streetAddress);
      }
    } catch (e) {}
    for (var i = 0; i < candidates.length; i++) {
      if (typeof candidates[i] === 'string' && candidates[i].trim() && !ap.isGuidLike(candidates[i])) return candidates[i].trim();
    }
    return '';
  };

  ap.getLoadedPortals = function () {
    var result = [];
    if (!window.portals) return result;
    for (var guid in window.portals) {
      if (!Object.prototype.hasOwnProperty.call(window.portals, guid)) continue;
      var marker = window.portals[guid];
      if (!marker || typeof marker.getLatLng !== 'function') continue;
      var ll = marker.getLatLng();
      if (!ll) continue;
      result.push({
        guid: guid,
        marker: marker,
        latlng: ll,
        title: ap.getPortalTitleFromMarker(guid, marker),
        address: ap.getPortalAddressFromMarker(guid, marker)
      });
    }
    return result;
  };


  ap.parseLatLngValue = function (value) {
    if (!value) return null;
    try {
      if (value instanceof L.LatLng) return value;
    } catch (e0) {}
    if (typeof value === 'string') {
      var m = value.trim().match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
      if (m) return L.latLng(parseFloat(m[1]), parseFloat(m[2]));
      return null;
    }
    if (Array.isArray(value) && value.length >= 2) {
      var a = parseFloat(value[0]);
      var b = parseFloat(value[1]);
      if (isFinite(a) && isFinite(b)) return L.latLng(a, b);
    }
    if (typeof value === 'object') {
      var lat = value.lat, lng = value.lng;
      if (lng == null) lng = value.lon;
      if (lat == null && value.latitude != null) lat = value.latitude;
      if (lng == null && value.longitude != null) lng = value.longitude;
      lat = parseFloat(lat); lng = parseFloat(lng);
      if (isFinite(lat) && isFinite(lng)) return L.latLng(lat, lng);
      if (typeof value.latE6 === 'number' && typeof value.lngE6 === 'number') return L.latLng(value.latE6 / 1e6, value.lngE6 / 1e6);
    }
    return null;
  };

  ap.extractGuidFromObject = function (obj, fallbackKey) {
    var candidates = [];
    try {
      candidates.push(obj && obj.guid, obj && obj.portalGuid, obj && obj.portalId, obj && obj.portalGUID, fallbackKey);
      if (obj && obj.options) candidates.push(obj.options.guid, obj.options.portalGuid, obj.options.portalId);
      if (obj && obj.data) candidates.push(obj.data.guid, obj.data.portalGuid, obj.data.portalId);
    } catch (e) {}
    for (var i = 0; i < candidates.length; i++) {
      var s = candidates[i] == null ? '' : String(candidates[i]).trim();
      if (s && ap.isGuidLike(s)) return s;
    }
    return '';
  };

  ap.extractBookmarkLabelFromObject = function (obj) {
    var candidates = [];
    try {
      candidates.push(obj && obj.label, obj && obj.title, obj && obj.name, obj && obj.portalTitle, obj && obj.portalName);
      if (obj && obj.options) candidates.push(obj.options.label, obj.options.title, obj.options.name, obj.options.portalTitle, obj.options.portalName);
      if (obj && obj.data) candidates.push(obj.data.label, obj.data.title, obj.data.name, obj.data.portalTitle, obj.data.portalName);
      candidates.push(ap.extractTitleFromObject(obj, 0));
    } catch (e) {}
    for (var i = 0; i < candidates.length; i++) {
      var t = ap.cleanTitle(candidates[i]);
      if (t) return t;
    }
    return '';
  };

  ap.extractLatLngFromBookmarkObject = function (obj) {
    if (!obj || typeof obj !== 'object') return null;
    var keys = ['latlng', 'latLng', 'll', 'location', 'coordinates', 'coord', 'point'];
    for (var i = 0; i < keys.length; i++) {
      var ll = ap.parseLatLngValue(obj[keys[i]]);
      if (ll) return ll;
    }
    return ap.parseLatLngValue(obj);
  };

  ap.collectPortalBookmarks = function (loadedPortals) {
    var result = [];
    var seenObjs = [];
    var seenKeys = {};
    var loadedByGuid = {};
    var sourceStats = [];
    (loadedPortals || []).forEach(function (p) { loadedByGuid[p.guid] = p; });

    function hasSeen(obj) {
      for (var i = 0; i < seenObjs.length; i++) if (seenObjs[i] === obj) return true;
      return false;
    }

    function add(obj, fallbackKey, path, sourceName) {
      var ll = ap.extractLatLngFromBookmarkObject(obj);
      if (!ll) return false;
      var guid = ap.extractGuidFromObject(obj, fallbackKey);
      var label = ap.extractBookmarkLabelFromObject(obj);
      var loaded = guid ? loadedByGuid[guid] : null;
      if (!label && loaded) label = loaded.title;
      if (!guid && !label) return false;
      var key = guid || (ap.latLngKey(ll) + '|' + label);
      if (seenKeys[key]) return false;
      seenKeys[key] = true;
      result.push({
        guid: guid || ('bookmark:' + ap.latLngKey(ll) + ':' + result.length),
        marker: loaded ? loaded.marker : null,
        latlng: ll,
        title: label || 'Bookmark ohne Namen',
        address: loaded ? loaded.address : '',
        source: 'Bookmark',
        bookmarkPath: path || '',
        bookmarkSource: sourceName || '',
        originalGuid: guid || ''
      });
      return true;
    }

    function tryParseJsonString(str) {
      if (typeof str !== 'string') return null;
      var t = str.trim();
      if (!t || (t[0] !== '{' && t[0] !== '[')) return null;
      try { return JSON.parse(t); } catch (e) { return null; }
    }

    function visit(obj, depth, path, keyName, sourceName) {
      if (obj == null || depth > 12) return 0;
      if (typeof obj === 'string') {
        var parsed = tryParseJsonString(obj);
        if (parsed) return visit(parsed, depth + 1, path + ' <json>', keyName, sourceName);
        return 0;
      }
      if (typeof obj !== 'object' || hasSeen(obj)) return 0;
      seenObjs.push(obj);
      var added = 0;
      try { if (add(obj, keyName, path, sourceName)) added++; } catch (e) {}
      if (Array.isArray(obj)) {
        for (var a = 0; a < obj.length; a++) added += visit(obj[a], depth + 1, path + '[' + a + ']', String(a), sourceName);
        return added;
      }
      for (var k in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
        var val = obj[k];
        if (val == null) continue;
        if (k === 'map' || k === 'layerGroup' || k === 'starLayerGroup') continue;
        if (typeof val === 'function') continue;
        if (typeof val !== 'object' && typeof val !== 'string') continue;
        added += visit(val, depth + 1, path ? path + '.' + k : k, k, sourceName);
      }
      return added;
    }

    function addRoot(name, obj) {
      var before = result.length;
      try { visit(obj, 0, name, '', name); } catch (e) {}
      var count = result.length - before;
      sourceStats.push({ name: name, count: count, present: !!obj });
    }

    // 1) Runtime plugin object, if the Bookmarks plugin is loaded.
    var bm = window.plugin && window.plugin.bookmarks;
    addRoot('window.plugin.bookmarks', bm);
    if (bm && bm.bkmrksObj) addRoot('window.plugin.bookmarks.bkmrksObj', bm.bkmrksObj);
    if (bm && bm.bkmrksObj && bm.bkmrksObj.portals) addRoot('window.plugin.bookmarks.bkmrksObj.portals', bm.bkmrksObj.portals);

    // 2) Known localStorage keys used by the IITC Bookmarks plugin and older variants.
    var knownKeys = [
      'plugin-bookmarks',
      'plugin-bookmarks-portals-data',
      'plugin-bookmarks-maps-data',
      'plugin-bookmarks-data',
      'plugin-bookmarks-backup'
    ];
    for (var i = 0; i < knownKeys.length; i++) {
      try {
        var raw = localStorage.getItem(knownKeys[i]);
        if (raw) addRoot('localStorage.' + knownKeys[i], raw);
      } catch (e1) {}
    }

    // 3) Conservative generic fallback: inspect other localStorage keys containing "bookmark".
    // This is read-only and only parses JSON-looking values.
    try {
      for (var li = 0; li < localStorage.length; li++) {
        var key = localStorage.key(li);
        if (!key || !/bookm/i.test(key)) continue;
        if (knownKeys.indexOf(key) !== -1) continue;
        var value = localStorage.getItem(key);
        if (!value) continue;
        var parsed = tryParseJsonString(value);
        if (parsed) addRoot('localStorage.' + key, parsed);
      }
    } catch (e2) {}

    ap.runtime.bookmarkSources = sourceStats;
    return result;
  };

  ap.mergePortalSources = function (loadedPortals, bookmarks) {
    var out = [];
    var byGuid = {};
    (loadedPortals || []).forEach(function (p) { byGuid[p.guid] = p; });
    (bookmarks || []).forEach(function (b) {
      var loaded = b.originalGuid ? byGuid[b.originalGuid] : byGuid[b.guid];
      if (loaded) {
        out.push(Object.assign({}, loaded, {
          title: b.title || loaded.title,
          latlng: b.latlng || loaded.latlng,
          address: loaded.address || b.address || '',
          source: 'Bookmark+IITC',
          bookmarkPath: b.bookmarkPath || ''
        }));
      } else {
        out.push(b);
      }
    });
    (loadedPortals || []).forEach(function (p) {
      // Include loaded portals that are not already present as bookmarks.
      var found = false;
      for (var i = 0; i < out.length; i++) if (out[i].guid === p.guid) { found = true; break; }
      if (!found) out.push(Object.assign({}, p, { source: 'IITC' }));
    });
    return out;
  };

  ap.findNearestPortalInfo = function (latlng, portals) {
    var best = null;
    var bestDist = Infinity;
    for (var i = 0; i < portals.length; i++) {
      var dist = latlng.distanceTo(portals[i].latlng);
      if (dist < bestDist) {
        bestDist = dist;
        best = portals[i];
      }
    }
    if (!best) return null;
    return Object.assign({}, best, { distance: bestDist, withinTolerance: bestDist <= ap.state.tolerance });
  };

  ap.portalCandidatesForEndpoint = function (latlng, portals, limit) {
    var list = [];
    if (!latlng || !portals) return list;
    for (var i = 0; i < portals.length; i++) {
      try {
        var dist = latlng.distanceTo(portals[i].latlng);
        list.push(Object.assign({}, portals[i], { distance: dist }));
      } catch (e) {}
    }
    list.sort(function (a, b) { return a.distance - b.distance; });
    return list.slice(0, limit || 12).map(function (p) {
      return {
        guid: p.guid,
        title: p.title || 'Name nicht geladen',
        lat: p.latlng ? p.latlng.lat : null,
        lng: p.latlng ? p.latlng.lng : null,
        address: p.address || '',
        source: p.source || '',
        distance: isFinite(p.distance) ? Math.round(p.distance) : null
      };
    });
  };

  ap.findNearestPortal = function (latlng, portals) {
    var best = ap.findNearestPortalInfo(latlng, portals);
    if (best && best.withinTolerance) return best;
    return null;
  };

  ap.getPortalInfoByGuid = function (guid, portals) {
    if (!guid || !portals) return null;
    for (var i = 0; i < portals.length; i++) if (portals[i].guid === guid) return portals[i];
    return null;
  };

  ap.portalInfoFromAssignment = function (key, portals) {
    var assignment = ap.state.endpointAssignments && ap.state.endpointAssignments[key];
    if (!assignment) return null;
    var loaded = ap.getPortalInfoByGuid(assignment.guid, portals);
    if (loaded) return Object.assign({}, loaded, { distance: null, withinTolerance: true, manualAssigned: true });
    if (typeof assignment.lat === 'number' && typeof assignment.lng === 'number') {
      return {
        guid: assignment.guid || ('assigned:' + key),
        marker: null,
        latlng: L.latLng(assignment.lat, assignment.lng),
        title: assignment.title || 'Manuell zugeordnet',
        address: assignment.address || '',
        distance: null,
        withinTolerance: true,
        manualAssigned: true
      };
    }
    return null;
  };

  ap.collectDrawToolLayers = function () {
    var root = window.plugin && window.plugin.drawTools;
    var layers = [];
    var seen = [];

    function hasSeen(obj) {
      for (var i = 0; i < seen.length; i++) if (seen[i] === obj) return true;
      return false;
    }

    function visit(obj, depth) {
      if (!obj || depth > 8 || hasSeen(obj)) return;
      seen.push(obj);

      if (typeof obj.getLatLngs === 'function') {
        layers.push(obj);
        return;
      }

      if (typeof obj.eachLayer === 'function') {
        try { obj.eachLayer(function (layer) { visit(layer, depth + 1); }); } catch (e) {}
      }

      if (obj._layers && typeof obj._layers === 'object') {
        for (var id in obj._layers) if (Object.prototype.hasOwnProperty.call(obj._layers, id)) visit(obj._layers[id], depth + 1);
      }

      // Nur begrenzt in Draw-Tools-Objekten suchen, um keine fremden IITC-Strukturen zu durchlaufen.
      if (depth < 2 && obj === root) {
        for (var key in obj) {
          if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
          if (key === 'data' || key === 'settings' || key === 'tools') continue;
          var val = obj[key];
          if (val && typeof val === 'object') visit(val, depth + 1);
        }
      }
    }

    visit(root, 0);
    return layers;
  };


  ap.collectDrawToolPointLayers = function () {
    var root = window.plugin && window.plugin.drawTools;
    var points = [];
    var seen = [];

    function hasSeen(obj) {
      for (var i = 0; i < seen.length; i++) if (seen[i] === obj) return true;
      return false;
    }

    function visit(obj, depth) {
      if (!obj || depth > 8 || hasSeen(obj)) return;
      seen.push(obj);

      if (typeof obj.getLatLng === 'function' && typeof obj.getLatLngs !== 'function') {
        try {
          var ll = obj.getLatLng();
          if (ll) points.push({
            layer: obj,
            latlng: ll,
            title: ap.extractDrawToolObjectTitle(obj),
            type: ap.getLayerTypeName(obj),
            optionKeys: ap.objectKeys(obj.options, 20)
          });
        } catch (e) {}
      }

      if (typeof obj.eachLayer === 'function') {
        try { obj.eachLayer(function (layer) { visit(layer, depth + 1); }); } catch (e) {}
      }

      if (obj._layers && typeof obj._layers === 'object') {
        for (var id in obj._layers) if (Object.prototype.hasOwnProperty.call(obj._layers, id)) visit(obj._layers[id], depth + 1);
      }

      if (depth < 2 && obj === root) {
        for (var key in obj) {
          if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
          if (key === 'data' || key === 'settings' || key === 'tools') continue;
          var val = obj[key];
          if (val && typeof val === 'object') visit(val, depth + 1);
        }
      }
    }

    visit(root, 0);
    return points;
  };

  ap.getLayerTypeName = function (obj) {
    if (!obj) return '';
    try {
      if (obj.constructor && obj.constructor.name) return obj.constructor.name;
    } catch (e) {}
    if (typeof L !== 'undefined') {
      try { if (L.Polygon && obj instanceof L.Polygon) return 'L.Polygon'; } catch (e1) {}
      try { if (L.Polyline && obj instanceof L.Polyline) return 'L.Polyline'; } catch (e2) {}
      try { if (L.Marker && obj instanceof L.Marker) return 'L.Marker'; } catch (e3) {}
    }
    return typeof obj;
  };

  ap.objectKeys = function (obj, limit) {
    var out = [];
    if (!obj || typeof obj !== 'object') return out;
    for (var k in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
      out.push(k);
      if (out.length >= (limit || 20)) break;
    }
    return out;
  };

  ap.extractDrawToolObjectTitle = function (obj) {
    var candidates = [];
    if (!obj) return '';
    try {
      candidates.push(obj.title, obj.name, obj.label, obj.portalTitle, obj.portalName, obj.guid);
      if (obj.options) candidates.push(obj.options.title, obj.options.name, obj.options.label, obj.options.portalTitle, obj.options.portalName, ap.extractTitleFromObject(obj.options, 0));
      if (obj.feature && obj.feature.properties) candidates.push(obj.feature.properties.title, obj.feature.properties.name, obj.feature.properties.label, ap.extractTitleFromObject(obj.feature.properties, 0));
      candidates.push(ap.extractTitleFromObject(obj, 0));
    } catch (e) {}
    for (var i = 0; i < candidates.length; i++) {
      var v = candidates[i];
      if (typeof v === 'string' && v.trim()) return v.trim();
    }
    return '';
  };

  ap.drawToolPointCandidatesForEndpoint = function (latlng, points, limit) {
    var list = [];
    if (!latlng || !points) return list;
    for (var i = 0; i < points.length; i++) {
      try {
        var dist = latlng.distanceTo(points[i].latlng);
        list.push({
          title: points[i].title || '(ohne Name)',
          type: points[i].type || '',
          lat: points[i].latlng.lat,
          lng: points[i].latlng.lng,
          distance: Math.round(dist),
          optionKeys: points[i].optionKeys || []
        });
      } catch (e) {}
    }
    list.sort(function (a, b) { return a.distance - b.distance; });
    return list.slice(0, limit || 5);
  };

  ap.layerDebugInfo = function (layer) {
    return {
      type: ap.getLayerTypeName(layer),
      title: ap.extractDrawToolObjectTitle(layer),
      optionKeys: ap.objectKeys(layer && layer.options, 25),
      ownKeys: ap.objectKeys(layer, 25)
    };
  };

  ap.extractSegments = function (layer) {
    var latlngs;
    try { latlngs = layer.getLatLngs(); } catch (e) { return []; }
    var points = ap.flattenLatLngs(latlngs, []);
    if (points.length < 2) return [];

    var segments = [];
    for (var i = 0; i < points.length - 1; i++) {
      if (points[i].distanceTo(points[i + 1]) > 0.01) segments.push([points[i], points[i + 1]]);
    }

    var isPolygon = (typeof L !== 'undefined' && L.Polygon && layer instanceof L.Polygon) ||
      (layer.options && layer.options.fill === true && points.length > 2);
    if (isPolygon && points[0].distanceTo(points[points.length - 1]) > 0.01) segments.push([points[points.length - 1], points[0]]);

    return segments;
  };


  ap.normalizedLinkId = function (a, b) {
    if (!a || !b) return '';
    return [String(a), String(b)].sort().join('|');
  };

  ap.extractLinkEndpointGuids = function (link, fallbackGuid) {
    var data = link && link.options && link.options.data ? link.options.data : {};
    var candidates = [];

    function addPair(a, b, source) {
      if (a && b) candidates.push({ a: String(a), b: String(b), source: source });
    }

    addPair(data.oGuid, data.dGuid, 'data.oGuid/dGuid');
    addPair(data.originGuid, data.destinationGuid, 'data.originGuid/destinationGuid');
    addPair(data.fromGuid, data.toGuid, 'data.fromGuid/toGuid');
    addPair(data.aGuid, data.bGuid, 'data.aGuid/bGuid');
    addPair(data.portalA, data.portalB, 'data.portalA/portalB');
    addPair(data.o, data.d, 'data.o/d');

    if (Array.isArray(data)) {
      // Some IITC structures expose entity arrays. Keep this deliberately conservative.
      var flat = JSON.stringify(data);
      var guids = flat.match(/[0-9a-f]{32}\.\d+/ig) || flat.match(/[0-9a-f]{32,}/ig) || [];
      if (guids.length >= 2) addPair(guids[0], guids[1], 'array-scan');
    }

    if (!candidates.length && fallbackGuid) {
      var text = '';
      try { text = JSON.stringify(data); } catch (e) { text = ''; }
      var matches = text.match(/[0-9a-f]{32}\.\d+/ig) || text.match(/[0-9a-f]{32,}/ig) || [];
      if (matches.length >= 2) addPair(matches[0], matches[1], 'data-json-scan');
    }

    return candidates.length ? candidates[0] : null;
  };

  ap.getLinkLatLngPair = function (link) {
    if (!link) return null;
    try {
      if (typeof link.getLatLngs === 'function') {
        var flat = ap.flattenLatLngs(link.getLatLngs(), []);
        if (flat.length >= 2) return { a: flat[0], b: flat[flat.length - 1], source: 'getLatLngs' };
      }
    } catch (e) {}
    var data = link.options && link.options.data ? link.options.data : {};
    function e6(lat, lng) {
      if (lat == null || lng == null) return null;
      var la = Number(lat), lo = Number(lng);
      if (!isFinite(la) || !isFinite(lo)) return null;
      if (Math.abs(la) > 90) la /= 1e6;
      if (Math.abs(lo) > 180) lo /= 1e6;
      return L.latLng(la, lo);
    }
    var a = e6(data.oLatE6 || data.originLatE6 || data.fromLatE6, data.oLngE6 || data.originLngE6 || data.fromLngE6);
    var b = e6(data.dLatE6 || data.destinationLatE6 || data.toLatE6, data.dLngE6 || data.destinationLngE6 || data.toLngE6);
    return a && b ? { a: a, b: b, source: 'data-e6' } : null;
  };

  ap.collectExistingLinkIds = function (portals) {
    var map = {};
    var list = [];
    var count = 0;
    var unresolved = 0;
    var portalInfo = {};
    (portals || []).forEach(function (portal) {
      if (!portal || !portal.guid) return;
      portalInfo[portal.guid] = {
        title: ap.cleanTitle(portal.title),
        latlng: portal.latlng || null
      };
    });
    if (!window.links) return { map: map, list: list, count: 0, unresolved: 0 };

    Object.keys(window.links).forEach(function (guid) {
      var link = window.links[guid];
      var pair = ap.extractLinkEndpointGuids(link, guid);
      var coords = ap.getLinkLatLngPair(link);
      if (!pair || !pair.a || !pair.b) { unresolved++; return; }
      var id = ap.normalizedLinkId(pair.a, pair.b);
      if (!id) { unresolved++; return; }
      var portalA = portalInfo[pair.a] || {};
      var portalB = portalInfo[pair.b] || {};
      var info = {
        guid: guid,
        a: pair.a,
        b: pair.b,
        source: pair.source,
        titleA: portalA.title || '',
        titleB: portalB.title || '',
        latlngA: coords && coords.a || portalA.latlng || null,
        latlngB: coords && coords.b || portalB.latlng || null
      };
      if (!map[id]) count++;
      map[id] = info;
      list.push(info);
    });

    return { map: map, list: list, count: count, unresolved: unresolved };
  };

  ap.orientation = function (a, b, c) {
    return (Number(b.lng) - Number(a.lng)) * (Number(c.lat) - Number(a.lat)) -
      (Number(b.lat) - Number(a.lat)) * (Number(c.lng) - Number(a.lng));
  };

  ap.properSegmentsIntersect = function (a, b, c, d) {
    if (!a || !b || !c || !d) return false;
    var o1 = ap.orientation(a, b, c);
    var o2 = ap.orientation(a, b, d);
    var o3 = ap.orientation(c, d, a);
    var o4 = ap.orientation(c, d, b);
    var eps = 1e-12;
    // Nur echte Kreuzungen im Inneren zählen. Berührungen/kollineare Fälle werden nicht als Blocker markiert.
    if (Math.abs(o1) <= eps || Math.abs(o2) <= eps || Math.abs(o3) <= eps || Math.abs(o4) <= eps) return false;
    return ((o1 > 0) !== (o2 > 0)) && ((o3 > 0) !== (o4 > 0));
  };

  ap.segmentIntersectionPoint = function (a, b, c, d) {
    if (!a || !b || !c || !d) return null;
    var x1 = Number(a.lng), y1 = Number(a.lat);
    var x2 = Number(b.lng), y2 = Number(b.lat);
    var x3 = Number(c.lng), y3 = Number(c.lat);
    var x4 = Number(d.lng), y4 = Number(d.lat);
    if (![x1, y1, x2, y2, x3, y3, x4, y4].every(isFinite)) return null;
    var denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denominator) <= 1e-15) return null;
    var determinantA = x1 * y2 - y1 * x2;
    var determinantB = x3 * y4 - y3 * x4;
    var lng = (determinantA * (x3 - x4) - (x1 - x2) * determinantB) / denominator;
    var lat = (determinantA * (y3 - y4) - (y1 - y2) * determinantB) / denominator;
    if (!isFinite(lat) || !isFinite(lng)) return null;
    return L.latLng(lat, lng);
  };

  ap.findBlockersForPlannedLink = function (planned, existingLinks) {
    if (!planned || planned.existing || !planned.latlngA || !planned.latlngB) return [];
    var blockers = [];
    (existingLinks || []).forEach(function (real) {
      if (!real || !real.latlngA || !real.latlngB) return;
      // Links mit gemeinsamem Portal dürfen sich am Portal treffen und sind keine Crosslinks.
      if (real.a === planned.a || real.a === planned.b || real.b === planned.a || real.b === planned.b) return;
      if (ap.properSegmentsIntersect(planned.latlngA, planned.latlngB, real.latlngA, real.latlngB)) {
        blockers.push({
          guid: real.guid,
          a: real.a,
          b: real.b,
          titleA: real.titleA || '',
          titleB: real.titleB || '',
          latlngA: real.latlngA || null,
          latlngB: real.latlngB || null
        });
      }
    });
    return blockers;
  };

  ap.portalDisplayLabel = function (guid, fallbackTitle, latlng) {
    var title = '';
    var stat = ap.runtime.stats && ap.runtime.stats[guid];
    if (stat) title = ap.cleanTitle(stat.title);
    if (!title && window.portals && window.portals[guid]) title = ap.getPortalTitleFromMarker(guid, window.portals[guid]);
    if (!title) title = ap.cleanTitle(fallbackTitle);
    if (title && title !== 'Name nicht geladen') return title;
    if (latlng && isFinite(Number(latlng.lat)) && isFinite(Number(latlng.lng))) {
      return 'Portalname nicht geladen (' + Number(latlng.lat).toFixed(6) + ', ' + Number(latlng.lng).toFixed(6) + ')';
    }
    return 'Portalname nicht geladen';
  };

  ap.ensureAnchorState = function (guid) {
    if (!ap.state.anchors[guid]) {
      ap.state.anchors[guid] = { ownedKeys: 0, done: false, manual: false, note: '', routeOrder: null };
    }
    var s = ap.state.anchors[guid];
    s.ownedKeys = parseInt(s.ownedKeys || 0, 10) || 0;
    if (s.routeOrder != null) {
      s.routeOrder = parseInt(s.routeOrder, 10);
      if (!isFinite(s.routeOrder)) s.routeOrder = null;
    }
    return s;
  };

  ap.normalizeRouteOrder = function () {
    var current = Object.keys(ap.runtime.stats || {});
    current.sort(function (a, b) {
      var sa = ap.ensureAnchorState(a);
      var sb = ap.ensureAnchorState(b);
      var oa = sa.routeOrder == null ? Number.MAX_SAFE_INTEGER : sa.routeOrder;
      var ob = sb.routeOrder == null ? Number.MAX_SAFE_INTEGER : sb.routeOrder;
      if (oa !== ob) return oa - ob;
      var ta = (ap.runtime.stats[a] && ap.runtime.stats[a].title) || '';
      var tb = (ap.runtime.stats[b] && ap.runtime.stats[b].title) || '';
      return String(ta).localeCompare(String(tb));
    });
    current.forEach(function (guid, index) { ap.ensureAnchorState(guid).routeOrder = index; });
  };

  ap.rememberUserLocation = function (latlng, accuracy, source) {
    if (!latlng) return null;
    var lat = Number(latlng.lat);
    var lng = Number(latlng.lng);
    if (!isFinite(lat) || !isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
    // Das User-Location-Plugin startet seinen Marker bei 0/0, bevor ein echter Standort vorliegt.
    if (lat === 0 && lng === 0) return null;
    ap.runtime.userLocation = {
      latlng: L.latLng(lat, lng),
      accuracy: accuracy != null && isFinite(Number(accuracy)) ? Number(accuracy) : null,
      source: source || 'IITC',
      at: Date.now()
    };
    return ap.runtime.userLocation;
  };

  ap.onIitcUserLocation = function (event) {
    var data = event && event.data ? event.data : event;
    if (data && data.latlng && ap.rememberUserLocation(data.latlng, data.accuracy, 'IITC User Location')) {
      ap.refreshLocationDependentUi();
    }
  };

  ap.getCurrentUserLocation = function () {
    try {
      var userLocationPlugin = window.plugin && window.plugin.userLocation;
      if (userLocationPlugin && typeof userLocationPlugin.getUser === 'function') {
        var user = userLocationPlugin.getUser();
        if (user && user.latlng) {
          var remembered = ap.rememberUserLocation(user.latlng, user.accuracy, 'IITC User Location');
          if (remembered) return remembered;
        }
      }
    } catch (e) {}
    ap.runtime.userLocation = null;
    return null;
  };

  ap.setupUserLocationIntegration = function () {
    if (ap.runtime.userLocationHooksBound) return;
    ap.runtime.userLocationHooksBound = true;
    var userLocationPlugin = window.plugin && window.plugin.userLocation;
    if (userLocationPlugin && typeof userLocationPlugin.getUser === 'function' && typeof window.addHook === 'function') {
      try { window.addHook('pluginUserLocation', ap.onIitcUserLocation); } catch (e) {}
    }
    ap.getCurrentUserLocation();
    ap.refreshLocationDependentUi();
  };

  ap.sortRouteFromUserLocation = function () {
    var location = ap.getCurrentUserLocation();
    if (!location || !location.latlng) {
      if (typeof window.alert === 'function') window.alert('Noch kein IITC-Standort verfügbar. Bitte zuerst die IITC-Standortfunktion aktivieren.');
      return false;
    }

    var currentOrder = ap.sortedStats(false);
    var open = currentOrder.filter(function (stat) { return !ap.ensureAnchorState(stat.guid).done; });
    var done = currentOrder.filter(function (stat) { return ap.ensureAnchorState(stat.guid).done; });
    if (!open.length) {
      if (typeof window.alert === 'function') window.alert('Keine offenen Planportale vorhanden.');
      return false;
    }

    var ordered = [];
    var remaining = open.slice();
    var currentPoint = location.latlng;
    while (remaining.length) {
      var bestIndex = 0;
      var bestDistance = Infinity;
      for (var i = 0; i < remaining.length; i++) {
        var candidate = remaining[i];
        var candidatePoint = L.latLng(Number(candidate.lat), Number(candidate.lng));
        var distance = currentPoint.distanceTo(candidatePoint);
        if (distance < bestDistance || (distance === bestDistance && String(candidate.title || '').localeCompare(String(remaining[bestIndex].title || '')) < 0)) {
          bestDistance = distance;
          bestIndex = i;
        }
      }
      var next = remaining.splice(bestIndex, 1)[0];
      ordered.push(next);
      currentPoint = L.latLng(Number(next.lat), Number(next.lng));
    }

    ordered.concat(done).forEach(function (stat, index) {
      ap.ensureAnchorState(stat.guid).routeOrder = index;
    });
    ap.save();
    ap.renderOverlays();
    ap.renderPanel();
    return true;
  };

  ap.movePortal = function (guid, delta) {
    ap.normalizeRouteOrder();
    var list = ap.sortedStats(false).map(function (stat) { return stat.guid; });
    var index = list.indexOf(guid);
    if (index < 0) return;
    var target = index + delta;
    if (target < 0 || target >= list.length) return;
    var other = list[target];
    var a = ap.ensureAnchorState(guid);
    var b = ap.ensureAnchorState(other);
    var tmp = a.routeOrder;
    a.routeOrder = b.routeOrder;
    b.routeOrder = tmp;
    ap.save();
    ap.renderOverlays();
    ap.renderPanel();
  };

  ap.getNextPortal = function () {
    var open = ap.sortedStats(false).filter(function (stat) {
      return !ap.ensureAnchorState(stat.guid).done;
    });
    if (!open.length) return null;

    var location = ap.getCurrentUserLocation();
    if (!location || !location.latlng) return open[0];
    var nearest = open[0];
    var nearestDistance = Infinity;
    for (var i = 0; i < open.length; i++) {
      try {
        var point = L.latLng(Number(open[i].lat), Number(open[i].lng));
        var distance = location.latlng.distanceTo(point);
        if (isFinite(distance) && distance < nearestDistance) {
          nearest = open[i];
          nearestDistance = distance;
        }
      } catch (e) {}
    }
    return nearest;
  };

  ap.updateNextTarget = function () {
    var nextPortal = ap.getNextPortal();
    var usesLocation = !!ap.getCurrentUserLocation();
    var key = (usesLocation ? 'location:' : 'route:') + (nextPortal ? nextPortal.guid : 'complete');
    var changed = key !== ap.runtime.nextTargetKey;
    ap.runtime.nextTargetKey = key;
    if (!changed) return;

    var el = document.getElementById('ap-next-target');
    if (el) {
      if (nextPortal) {
        var nav = ap.navigationLinks(nextPortal);
        el.className = 'ap-next-target';
        el.innerHTML = '<span><b>' + (usesLocation ? 'Nächstes Portal ab Standort:' : 'Nächstes Portal:') + '</b> ' + ap.escapeHtml(nextPortal.title) + '</span><a target="_blank" rel="noopener" href="' + ap.escapeHtml(nav.waze) + '">Waze</a>';
      } else {
        el.className = 'ap-next-target ap-next-complete';
        el.innerHTML = 'Alle Planportale erledigt.';
      }
    }
    if (ap.runtime.enabled) ap.renderOverlays();
  };

  ap.refreshLocationDependentUi = function () {
    ap.updateNextTarget();
  };

  ap.scan = function () {
    ap.runtime.selectedBlocker = null;
    if (!(window.plugin && window.plugin.drawTools)) {
      ap.setMessage('Draw Tools nicht gefunden. Bitte Draw Tools aktivieren.');
      return;
    }

    var loadedPortals = ap.getLoadedPortals();
    var bookmarks = ap.collectPortalBookmarks(loadedPortals);
    var portals = ap.mergePortalSources(loadedPortals, bookmarks);
    var layers = ap.collectDrawToolLayers();
    var drawPoints = ap.collectDrawToolPointLayers();
    var stats = {};
    var links = [];
    var unresolved = [];
    var seenLinks = {};
    var rawSegments = 0;
    var duplicateLinks = 0;
    var samePortalSegments = 0;
    var bookmarkMatchedEndpoints = 0;
    var existingInfo = ap.collectExistingLinkIds(portals);
    var existingLinkIds = existingInfo.map;
    var existingLinks = existingInfo.list || [];
    var existingPlannedLinks = 0;
    var blockedPlannedLinks = 0;

    for (var i = 0; i < layers.length; i++) {
      var segments = ap.extractSegments(layers[i]);
      var layerDbg = ap.layerDebugInfo(layers[i]);
      for (var s = 0; s < segments.length; s++) {
        rawSegments++;
        var aKey = ap.latLngKey(segments[s][0]);
        var bKey = ap.latLngKey(segments[s][1]);
        var aInfo = ap.findNearestPortalInfo(segments[s][0], portals);
        var bInfo = ap.findNearestPortalInfo(segments[s][1], portals);
        // v0.1.23: keine eigene Endpunkt-Zuordnungslogik mehr.
        // Draw-Tools-/Bookmark-Daten sollen diagnostiziert werden; Koordinatennähe bleibt nur Fallback.
        var a = (aInfo && aInfo.withinTolerance ? aInfo : null);
        var b = (bInfo && bInfo.withinTolerance ? bInfo : null);

        if (!a) unresolved.push({
          key: aKey,
          lat: segments[s][0].lat,
          lng: segments[s][0].lng,
          segment: rawSegments,
          end: 'A',
          nearestGuid: aInfo && aInfo.guid || '',
          nearestTitle: aInfo && aInfo.title || '',
          nearestLat: aInfo && aInfo.latlng ? aInfo.latlng.lat : null,
          nearestLng: aInfo && aInfo.latlng ? aInfo.latlng.lng : null,
          nearestAddress: aInfo && aInfo.address || '',
          nearestDistance: aInfo && isFinite(aInfo.distance) ? Math.round(aInfo.distance) : null,
          candidates: ap.portalCandidatesForEndpoint(segments[s][0], portals, 12),
          drawPointCandidates: ap.drawToolPointCandidatesForEndpoint(segments[s][0], drawPoints, 5),
          layerDebug: layerDbg
        });
        if (!b) unresolved.push({
          key: bKey,
          lat: segments[s][1].lat,
          lng: segments[s][1].lng,
          segment: rawSegments,
          end: 'B',
          nearestGuid: bInfo && bInfo.guid || '',
          nearestTitle: bInfo && bInfo.title || '',
          nearestLat: bInfo && bInfo.latlng ? bInfo.latlng.lat : null,
          nearestLng: bInfo && bInfo.latlng ? bInfo.latlng.lng : null,
          nearestAddress: bInfo && bInfo.address || '',
          nearestDistance: bInfo && isFinite(bInfo.distance) ? Math.round(bInfo.distance) : null,
          candidates: ap.portalCandidatesForEndpoint(segments[s][1], portals, 12),
          drawPointCandidates: ap.drawToolPointCandidatesForEndpoint(segments[s][1], drawPoints, 5),
          layerDebug: layerDbg
        });
        if (!a || !b) continue;
        if (a.source && String(a.source).indexOf('Bookmark') !== -1) bookmarkMatchedEndpoints++;
        if (b.source && String(b.source).indexOf('Bookmark') !== -1) bookmarkMatchedEndpoints++;
        if (a.guid === b.guid) { samePortalSegments++; continue; }

        var linkId = ap.normalizedLinkId(a.guid, b.guid);
        if (seenLinks[linkId]) { duplicateLinks++; continue; }
        seenLinks[linkId] = true;
        var existing = !!existingLinkIds[linkId];
        if (existing) existingPlannedLinks++;
        var plannedLink = {
          id: linkId,
          a: a.guid,
          b: b.guid,
          titleA: ap.cleanTitle(a.title),
          titleB: ap.cleanTitle(b.title),
          existing: existing,
          existingGuid: existing ? existingLinkIds[linkId].guid : '',
          latlngA: L.latLng(a.latlng.lat, a.latlng.lng),
          latlngB: L.latLng(b.latlng.lat, b.latlng.lng),
          blockers: []
        };
        plannedLink.blockers = ap.findBlockersForPlannedLink(plannedLink, existingLinks);
        plannedLink.blocked = plannedLink.blockers.length > 0;
        if (plannedLink.blocked) blockedPlannedLinks++;
        links.push(plannedLink);

        [a, b].forEach(function (p) {
          if (!stats[p.guid]) {
            stats[p.guid] = {
              guid: p.guid,
              title: p.title || 'Name nicht geladen',
              address: p.address || '',
              lat: p.latlng.lat,
              lng: p.latlng.lng,
              linkCount: 0,
              existingLinks: 0,
              blockedLinks: 0,
              openLinks: 0,
              requiredKeys: 0,
              candidate: false,
              matchedDistance: p.distance,
              source: p.source || 'IITC'
            };
          }
          stats[p.guid].linkCount++;
          if (existing) stats[p.guid].existingLinks++;
          else {
            if (plannedLink.blocked) stats[p.guid].blockedLinks++;
            stats[p.guid].openLinks++;
            stats[p.guid].requiredKeys++;
          }
          ap.ensureAnchorState(p.guid);
        });
      }
    }

    Object.keys(stats).forEach(function (guid) {
      var local = ap.ensureAnchorState(guid);
      // v0.1.28: Der Schlüsselbedarf wird ausdrücklich aus den noch nicht
      // bestätigten Links berechnet. Bereits vorhandene geplante Links zählen
      // weiterhin bei den geplanten Links, reduzieren aber den Key-Bedarf an
      // beiden beteiligten Planportalen.
      stats[guid].openLinks = Math.max(0, (stats[guid].linkCount || 0) - (stats[guid].existingLinks || 0));
      stats[guid].requiredKeys = stats[guid].openLinks;
      stats[guid].candidate = true;
    });

    ap.runtime.stats = stats;
    ap.runtime.links = links;
    ap.runtime.existingLinkIds = existingLinkIds;
    ap.runtime.existingLinks = existingLinks;
    ap.runtime.unresolvedEndpoints = unresolved;
    ap.normalizeRouteOrder();
    ap.state.lastScan = {
      at: new Date().toISOString(),
      drawLayers: layers.length,
      plannedLinks: links.length,
      existingPlannedLinks: existingPlannedLinks,
      unconfirmedLinks: links.length - existingPlannedLinks,
      openUnblockedLinks: Math.max(0, links.length - existingPlannedLinks - blockedPlannedLinks),
      blockedPlannedLinks: blockedPlannedLinks,
      loadedExistingLinks: existingInfo.count,
      unresolvedExistingLinks: existingInfo.unresolved,
      resolvedPortals: Object.keys(stats).length,
      unresolvedEndpoints: unresolved.length,
      rawSegments: rawSegments,
      drawPointMarkers: drawPoints.length,
      bookmarks: bookmarks.length,
      bookmarkSources: ap.runtime.bookmarkSources || [],
      portalSources: portals.length,
      bookmarkMatchedEndpoints: bookmarkMatchedEndpoints,
      duplicateLinks: duplicateLinks,
      samePortalSegments: samePortalSegments,
      unresolvedSample: unresolved.slice(0, 6)
    };
    ap.save();
    ap.renderOverlays();
    ap.renderPanel();

    // If the scan only found placeholder names, use the same proven logic as the "Namen laden" button automatically.
    // This is intentionally delayed so the scan UI renders first and does not block the map.
    if (Object.keys(stats).some(function (guid) { return stats[guid] && stats[guid].title === 'Name nicht geladen'; })) {
      setTimeout(function () { ap.refreshMissingNames(true); }, 250);
    }
  };

  ap.getStatus = function (guid, stat) {
    var local = ap.ensureAnchorState(guid);
    if (local.done) return { key: 'done', label: 'abgearbeitet', symbol: '✓', cls: 'ap-done' };
    if ((stat.blockedLinks || 0) > 0) return { key: 'blocked', label: 'blockiert', symbol: '×', cls: 'ap-blocked' };
    if ((stat.requiredKeys || 0) === 0 && (stat.linkCount || 0) > 0) return { key: 'existing', label: 'keine Keys nötig', symbol: '↔', cls: 'ap-existing' };
    if (local.ownedKeys >= stat.requiredKeys && stat.requiredKeys > 0) return { key: 'ready', label: 'bereit', symbol: '▲', cls: 'ap-ready' };
    if (local.ownedKeys > 0) return { key: 'partial', label: 'teilweise', symbol: '◐', cls: 'ap-partial' };
    return { key: 'missing', label: 'Keys fehlen', symbol: '◆', cls: 'ap-missing' };
  };

  ap.matchesListFilter = function (stat) {
    var filter = ap.state.listFilter || 'all';
    var local = ap.ensureAnchorState(stat.guid);
    if (filter === 'all') return true;
    if (filter === 'open') return !local.done;
    if (filter === 'done') return !!local.done;
    if (filter === 'blocked') return !local.done && (stat.blockedLinks || 0) > 0;
    if (filter === 'keys') return !local.done && (stat.requiredKeys || 0) > (local.ownedKeys || 0);
    return true;
  };

  ap.filterCounts = function (stats) {
    var counts = { all: stats.length, open: 0, blocked: 0, keys: 0, done: 0 };
    stats.forEach(function (stat) {
      var local = ap.ensureAnchorState(stat.guid);
      if (local.done) counts.done++;
      else counts.open++;
      if (!local.done && (stat.blockedLinks || 0) > 0) counts.blocked++;
      if (!local.done && (stat.requiredKeys || 0) > (local.ownedKeys || 0)) counts.keys++;
    });
    return counts;
  };

  ap.sortedStats = function (doneLast) {
    if (doneLast == null) doneLast = true;
    var arr = Object.keys(ap.runtime.stats).map(function (guid) { return ap.runtime.stats[guid]; });
    arr.sort(function (a, b) {
      var la = ap.ensureAnchorState(a.guid);
      var lb = ap.ensureAnchorState(b.guid);
      if (doneLast && la.done !== lb.done) return la.done ? 1 : -1;
      var oa = la.routeOrder == null ? Number.MAX_SAFE_INTEGER : la.routeOrder;
      var ob = lb.routeOrder == null ? Number.MAX_SAFE_INTEGER : lb.routeOrder;
      if (oa !== ob) return oa - ob;
      if (b.linkCount !== a.linkCount) return b.linkCount - a.linkCount;
      return String(a.title || '').localeCompare(String(b.title || ''));
    });
    return arr;
  };

  ap.navigationLinks = function (stat) {
    var ll = stat.lat + ',' + stat.lng;
    var q = encodeURIComponent(ll);
    var title = stat.title && stat.title !== 'Name nicht geladen' ? stat.title : 'Portal';
    var labelRaw = stat.address ? title + ' - ' + stat.address : title;
    var label = encodeURIComponent(labelRaw);
    var intel = 'https://intel.ingress.com/intel?ll=' + encodeURIComponent(ll) + '&z=17&pll=' + encodeURIComponent(ll);
    return {
      waze: 'https://waze.com/ul?ll=' + encodeURIComponent(ll) + '&navigate=yes',
      intel: intel,
      google: 'https://www.google.com/maps/search/?api=1&query=' + q,
      apple: 'https://maps.apple.com/?q=' + label + '&ll=' + encodeURIComponent(ll),
      geo: 'geo:' + ll + '?q=' + q + '(' + label + ')',
      shareText: title + '\n' + (stat.address ? stat.address + '\n' : '') + ll + '\nWaze: https://waze.com/ul?ll=' + encodeURIComponent(ll) + '&navigate=yes'
    };
  };

  ap.statusColor = function (status) {
    if (!status) return '#ffffff';
    if (status.key === 'done') return '#eeeeee';
    if (status.key === 'blocked') return '#ff3b30';
    if (status.key === 'existing') return '#bdbdbd';
    if (status.key === 'ready') return '#ff6ad5';
    if (status.key === 'partial') return '#f5d76e';
    return '#ff9f43';
  };

  ap.ensureOverlayPane = function () {
    // In IITC Mobile custom panes can be unreliable. Use Leaflet's default overlay pane.
    return null;
  };

  ap.ensureOverlayLayerVisible = function () {
    if (!window.map || !ap.runtime.layerGroup || !ap.runtime.enabled) return;
    try {
      if (typeof window.map.hasLayer === 'function' && !window.map.hasLayer(ap.runtime.layerGroup)) {
        ap.runtime.layerGroup.addTo(window.map);
      }
    } catch (e) {}
  };

  ap.ensureHtmlOverlay = function () {
    if (ap.runtime.htmlOverlay && ap.runtime.htmlOverlay.parentNode) return ap.runtime.htmlOverlay;
    if (!window.map || !window.map.getContainer) return null;
    var mapContainer = window.map.getContainer();
    var overlay = document.createElement('div');
    overlay.id = 'ap-map-html-overlay';
    overlay.className = 'ap-map-html-overlay';
    overlay.style.position = 'absolute';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '2500';
    overlay.style.overflow = 'visible';
    mapContainer.appendChild(overlay);
    ap.runtime.htmlOverlay = overlay;
    return overlay;
  };

  ap.clearHtmlOverlay = function () {
    var overlay = ap.runtime.htmlOverlay;
    if (overlay) overlay.innerHTML = '';
  };

  ap.statusText = function (status) {
    if (!status) return '!';
    if (status.key === 'done') return 'OK';
    if (status.key === 'blocked') return 'X';
    if (status.key === 'existing') return '0K';
    if (status.key === 'ready') return 'A';
    if (status.key === 'partial') return '½';
    return 'KEY';
  };

  ap.addHtmlStatusMarker = function (stat, status, title, isNext) {
    var overlay = ap.ensureHtmlOverlay();
    if (!overlay || !window.map || !window.map.latLngToContainerPoint) return;
    var point = window.map.latLngToContainerPoint(L.latLng(stat.lat, stat.lng));
    var color = ap.statusColor(status);
    var badge = document.createElement('div');
    badge.className = 'ap-map-badge ap-map-badge-' + (status && status.key ? status.key : 'missing') + (isNext ? ' ap-map-badge-next' : '');
    badge.style.left = Math.round(point.x) + 'px';
    badge.style.top = Math.round(point.y) + 'px';
    badge.style.borderColor = color;
    badge.style.boxShadow = '0 0 0 2px rgba(0,0,0,.95), 0 0 8px rgba(0,0,0,.95)';
    badge.title = String(title || '').replace(/<br\s*\/?>/gi, ' · ').replace(/<[^>]+>/g, '');
    badge.textContent = ap.statusText(status);
    overlay.appendChild(badge);
    ap.runtime.overlayCount++;
  };

  ap.renderOverlays = function () {
    if (!ap.runtime.layerGroup) return;
    ap.runtime.layerGroup.clearLayers();
    ap.clearHtmlOverlay();
    ap.runtime.overlayCount = 0;
    if (!ap.runtime.enabled) return;
    ap.ensureOverlayLayerVisible();
    (ap.runtime.links || []).forEach(function (link) {
      if (!link || !link.blocked || !link.latlngA || !link.latlngB) return;
      try {
        var path = L.polyline([link.latlngA, link.latlngB], {
          color: '#ff3b30', weight: 4, opacity: 0.9, dashArray: '7,6', interactive: false
        });
        path.addTo(ap.runtime.layerGroup);
      } catch (e) {}
    });
    var selected = ap.runtime.selectedBlocker;
    if (selected && selected.plannedLink && selected.blocker) {
      var planned = selected.plannedLink;
      var blocker = selected.blocker;
      var crossing = selected.intersection || ap.segmentIntersectionPoint(planned.latlngA, planned.latlngB, blocker.latlngA, blocker.latlngB);
      try {
        L.polyline([planned.latlngA, planned.latlngB], {
          color: '#ff2d95', weight: 7, opacity: 1, dashArray: '10,6', interactive: false
        }).addTo(ap.runtime.layerGroup);
        L.polyline([blocker.latlngA, blocker.latlngB], {
          color: '#00e5ff', weight: 7, opacity: 1, interactive: false
        }).addTo(ap.runtime.layerGroup);
        if (crossing) {
          L.circleMarker(crossing, {
            radius: 7, color: '#111', weight: 3, fillColor: '#ffe600', fillOpacity: 1, interactive: false
          }).addTo(ap.runtime.layerGroup);
        }
      } catch (e2) {}
    }
    var nextPortal = ap.getNextPortal();
    Object.keys(ap.runtime.stats).forEach(function (guid) {
      var stat = ap.runtime.stats[guid];
      var local = ap.ensureAnchorState(guid);
      // Alle erkannten Planportale sichtbar markieren.

      var status = ap.getStatus(guid, stat);
      var title = ap.escapeHtml(stat.title) + '<br>' + ap.escapeHtml(status.label) + ' · Keys benötigt ' + ap.escapeHtml(local.ownedKeys) + '/' + ap.escapeHtml(stat.requiredKeys);
      ap.addHtmlStatusMarker(stat, status, title, !!(nextPortal && nextPortal.guid === guid));
    });
  };

  ap.focusBlocker = function (plannedLink, blocker) {
    if (!plannedLink || !blocker || !window.map) return;
    var crossing = ap.segmentIntersectionPoint(plannedLink.latlngA, plannedLink.latlngB, blocker.latlngA, blocker.latlngB);
    if (!crossing) {
      ap.setMessage('Kreuzungspunkt konnte nicht bestimmt werden.');
      return;
    }
    ap.runtime.selectedBlocker = { plannedLink: plannedLink, blocker: blocker, intersection: crossing };
    ap.renderOverlays();
    try {
      var currentZoom = typeof window.map.getZoom === 'function' ? Number(window.map.getZoom()) : 15;
      var targetZoom = Math.max(isFinite(currentZoom) ? currentZoom : 15, 15);
      if (typeof window.map.getMaxZoom === 'function') {
        var maxZoom = Number(window.map.getMaxZoom());
        if (isFinite(maxZoom)) targetZoom = Math.min(targetZoom, maxZoom);
      }
      window.map.setView(crossing, targetZoom, { animate: !ap.isMobile() });
    } catch (e) {
      try { window.map.panTo(crossing); } catch (e2) {}
    }
  };

  ap.setMessage = function (msg) {
    var el = document.getElementById('ap-message');
    if (el) el.textContent = msg;
  };

  ap.isMobile = function () {
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '') || (window.isSmartphone && window.isSmartphone());
  };

  ap.showPortalActions = function (guid) {
    var stat = ap.runtime.stats[guid];
    if (!stat) return;
    var nav = ap.navigationLinks(stat);
    var html = '';
    html += '<div><b>' + ap.escapeHtml(stat.title) + '</b></div>';
    if (stat.address) html += '<div class="ap-address">' + ap.escapeHtml(stat.address) + '</div>';
    html += '<div class="ap-action-label">Teilen</div>';
    html += '<div class="ap-share-grid ap-share-grid-single">';
    html += '<button class="ap-copy-share">Text kopieren</button>';
    html += '</div>';
    html += '<div class="ap-action-label">Lokalisieren</div>';
    html += '<div class="ap-share-grid">';
    html += '<a class="ap-share-main" target="_blank" rel="noopener" href="' + ap.escapeHtml(nav.waze) + '">Waze</a>';
    html += '<a target="_blank" rel="noopener" href="' + ap.escapeHtml(nav.google) + '">Google Maps</a>';
    html += '<a target="_blank" rel="noopener" href="' + ap.escapeHtml(nav.apple) + '">Apple Maps</a>';
    html += '<a href="' + ap.escapeHtml(nav.geo) + '">geo:</a>';
    html += '</div>';
    html += '<textarea readonly style="width:100%;height:90px;margin-top:8px;font-family:monospace;font-size:12px;">' + ap.escapeHtml(nav.shareText) + '</textarea>';

    if (typeof window.dialog === 'function') {
      window.dialog({ title: 'Portal teilen / lokalisieren', html: html, width: 420 });
      setTimeout(function () {
        var btn = document.querySelector('.ui-dialog .ap-copy-share');
        if (btn) btn.onclick = function () {
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(nav.shareText);
          else window.prompt('Portal teilen:', nav.shareText);
        };
      }, 0);
    } else {
      window.prompt('Portal teilen:', nav.shareText);
    }
  };


  ap.requestPortalDetails = function (guid, callback) {
    var done = false;
    function finish(data) {
      if (done) return;
      done = true;
      callback && callback(data || null);
    }

    try {
      if (window.portalDetail && typeof window.portalDetail.request === 'function') {
        var ret = window.portalDetail.request(guid, finish);
        if (ret && typeof ret.then === 'function') ret.then(finish).catch(function () { finish(null); });
        setTimeout(function () { finish(null); }, 3500);
        return;
      }
    } catch (e) {}

    try {
      if (typeof window.requestPortalDetail === 'function') {
        var ret2 = window.requestPortalDetail(guid, finish);
        if (ret2 && typeof ret2.then === 'function') ret2.then(finish).catch(function () { finish(null); });
        setTimeout(function () { finish(null); }, 3500);
        return;
      }
    } catch (e2) {}

    finish(null);
  };

  ap.refreshMissingNames = function (auto) {
    var missing = Object.keys(ap.runtime.stats).filter(function (guid) {
      return ap.runtime.stats[guid] && ap.runtime.stats[guid].title === 'Name nicht geladen';
    });
    if (!missing.length) {
      ap.setMessage('Keine fehlenden Portalnamen im aktuellen Scan.');
      return;
    }

    var idx = 0;
    ap.setMessage((auto ? 'Lade Portalnamen automatisch nach: 0/' : 'Lade Portalnamen nach: 0/') + missing.length + ' …');

    function next() {
      if (idx >= missing.length) {
        ap.setMessage((auto ? 'Portalnamen automatisch nachgeladen.' : 'Portalnamen nachgeladen.') + ' Falls noch Namen fehlen, sind die Details nicht verfügbar.');
        ap.renderOverlays();
        ap.renderPanel();
        return;
      }
      var guid = missing[idx++];
      ap.requestPortalDetails(guid, function (data) {
        var marker = window.portals && window.portals[guid];
        var title = ap.getPortalTitleFromMarker(guid, marker);
        if (title === 'Name nicht geladen') title = ap.extractTitleFromObject(data, 0) || title;
        if (ap.runtime.stats[guid] && title && title !== 'Name nicht geladen') ap.runtime.stats[guid].title = title;
        ap.setMessage((auto ? 'Lade Portalnamen automatisch nach: ' : 'Lade Portalnamen nach: ') + idx + '/' + missing.length + ' …');
        setTimeout(next, 900);
      });
    }

    next();
  };

  ap.blockerEndpointExport = function (guid, fallbackTitle, latlng) {
    var lat = latlng && isFinite(Number(latlng.lat)) ? Number(latlng.lat) : null;
    var lng = latlng && isFinite(Number(latlng.lng)) ? Number(latlng.lng) : null;
    return {
      guid: guid || '',
      label: ap.portalDisplayLabel(guid, fallbackTitle, latlng),
      lat: lat,
      lng: lng
    };
  };

  ap.buildBlockerExport = function () {
    return (ap.runtime.links || []).filter(function (link) {
      return link && !link.existing && link.blocked && link.blockers && link.blockers.length;
    }).map(function (link) {
      return {
        plannedLink: {
          a: ap.blockerEndpointExport(link.a, link.titleA, link.latlngA),
          b: ap.blockerEndpointExport(link.b, link.titleB, link.latlngB)
        },
        blockingLinks: link.blockers.map(function (blocker) {
          return {
            a: ap.blockerEndpointExport(blocker.a, blocker.titleA, blocker.latlngA),
            b: ap.blockerEndpointExport(blocker.b, blocker.titleB, blocker.latlngB)
          };
        })
      };
    });
  };

  ap.exportData = function () {
    var stats = ap.sortedStats();
    return {
      plugin: 'IITC Anchor Planner',
      version: ap.VERSION,
      exportedAt: new Date().toISOString(),
      scan: ap.state.lastScan,
      blockedPlanLinks: ap.buildBlockerExport(),
      anchors: stats.map(function (stat) {
        var local = ap.ensureAnchorState(stat.guid);
        var nav = ap.navigationLinks(stat);
        return {
          guid: stat.guid,
          title: stat.title,
          address: stat.address || '',
          lat: stat.lat,
          lng: stat.lng,
          linkCount: stat.linkCount,
          existingLinks: stat.existingLinks || 0,
          blockedLinks: stat.blockedLinks || 0,
          openLinks: stat.openLinks || stat.requiredKeys || 0,
          requiredKeys: stat.requiredKeys,
          ownedKeys: local.ownedKeys || 0,
          done: !!local.done,
          note: local.note || '',
          navigation: {
            preferred: 'waze',
            waze: nav.waze,
            intel: nav.intel,
            google: nav.google,
            apple: nav.apple,
            geo: nav.geo,
            shareText: nav.shareText
          }
        };
      })
    };
  };

  ap.buildPlanText = function () {
    var stats = ap.sortedStats();
    var last = ap.state.lastScan || {};
    var lines = [];
    var doneCount = 0;
    var totalRequired = 0;
    var totalOwned = 0;
    var blockedPlanLinks = ap.buildBlockerExport();

    stats.forEach(function (stat) {
      var local = ap.ensureAnchorState(stat.guid);
      if (local.done) doneCount++;
      totalRequired += stat.requiredKeys || 0;
      totalOwned += local.ownedKeys || 0;
    });

    lines.push('Anchor Planner');
    lines.push('Plan: ' + (last.plannedLinks || 0) + ' Links, ' + stats.length + ' Planportale');
    lines.push('Vorhandene Links: ' + (last.existingPlannedLinks || 0) + ' · nicht bestätigt: ' + (last.unconfirmedLinks || 0));
    lines.push('Portale erledigt: ' + doneCount + '/' + stats.length);
    lines.push('Keys: vorhanden ' + totalOwned + ' / benötigt ' + totalRequired);
    lines.push('');

    if (blockedPlanLinks.length) {
      lines.push('Blocker:');
      blockedPlanLinks.forEach(function (entry) {
        lines.push('Planlink: ' + entry.plannedLink.a.label + ' ↔ ' + entry.plannedLink.b.label);
        entry.blockingLinks.forEach(function (blocker) {
          lines.push('  - ' + blocker.a.label + ' ↔ ' + blocker.b.label);
        });
        lines.push('');
      });
      lines.push('Hinweis: Geprüft wurden nur die aktuell in IITC geladenen vorhandenen Links.');
      lines.push('');
    }

    stats.forEach(function (stat, index) {
      var local = ap.ensureAnchorState(stat.guid);
      var nav = ap.navigationLinks(stat);
      lines.push((index + 1) + '. ' + (stat.title || 'Name nicht geladen') + (local.done ? ' [erledigt]' : ''));
      if (stat.address) lines.push('   Adresse: ' + stat.address);
      lines.push('   Links: ' + stat.linkCount + ' · vorhanden: ' + (stat.existingLinks || 0) + ' · offen: ' + (stat.openLinks || stat.requiredKeys || 0) + ' · davon blockiert: ' + (stat.blockedLinks || 0));
      lines.push('   Keys: ' + (local.ownedKeys || 0) + '/' + (stat.requiredKeys || 0));
      lines.push('   Waze: ' + nav.waze);
      if (local.note) lines.push('   Notiz: ' + local.note);
      lines.push('');
    });

    return lines.join('\n').replace(/\n+$/, '');
  };

  ap.copyText = function (text, fallbackTitle) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        ap.setMessage('In die Zwischenablage kopiert.');
      }).catch(function () {
        window.prompt(fallbackTitle || 'Kopieren:', text);
      });
    } else {
      window.prompt(fallbackTitle || 'Kopieren:', text);
    }
  };

  ap.downloadText = function (filename, text, mime) {
    try {
      var blob = new Blob([text], { type: mime || 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    } catch (e) {
      window.prompt('Export kopieren:', text);
    }
  };

  ap.showExport = function () {
    var planText = ap.buildPlanText();
    var jsonText = JSON.stringify(ap.exportData(), null, 2);
    var html = '';
    html += '<div class="ap-export-tabs">';
    html += '<button class="ap-export-tab ap-export-tab-active" data-target="text">Planübersicht</button>';
    html += '<button class="ap-export-tab" data-target="json">JSON</button>';
    html += '</div>';
    html += '<div class="ap-export-pane" data-pane="text">';
    html += '<textarea class="ap-export-text" readonly>' + ap.escapeHtml(planText) + '</textarea>';
    html += '<div class="ap-export-actions"><button class="ap-copy-plan">Plan kopieren</button><button class="ap-download-plan">Als TXT speichern</button>';
    if (navigator.share) html += '<button class="ap-share-plan">Teilen</button>';
    html += '</div></div>';
    html += '<div class="ap-export-pane" data-pane="json" style="display:none">';
    html += '<textarea class="ap-export-json" readonly>' + ap.escapeHtml(jsonText) + '</textarea>';
    html += '<div class="ap-export-actions"><button class="ap-copy-json">JSON kopieren</button><button class="ap-download-json">Als JSON speichern</button></div>';
    html += '</div>';

    if (typeof window.dialog === 'function') {
      window.dialog({ title: 'Anchor Planner – Export / Teilen', html: html, width: 720 });
      setTimeout(function () {
        var root = document.querySelector('.ui-dialog');
        if (!root) return;
        Array.prototype.forEach.call(root.querySelectorAll('.ap-export-tab'), function (button) {
          button.onclick = function () {
            var target = this.getAttribute('data-target');
            Array.prototype.forEach.call(root.querySelectorAll('.ap-export-tab'), function (b) { b.classList.remove('ap-export-tab-active'); });
            this.classList.add('ap-export-tab-active');
            Array.prototype.forEach.call(root.querySelectorAll('.ap-export-pane'), function (pane) {
              pane.style.display = pane.getAttribute('data-pane') === target ? '' : 'none';
            });
          };
        });
        var copyPlan = root.querySelector('.ap-copy-plan');
        if (copyPlan) copyPlan.onclick = function () { ap.copyText(planText, 'Planübersicht kopieren:'); };
        var downloadPlan = root.querySelector('.ap-download-plan');
        if (downloadPlan) downloadPlan.onclick = function () { ap.downloadText('anchor-planner-plan.txt', planText, 'text/plain;charset=utf-8'); };
        var sharePlan = root.querySelector('.ap-share-plan');
        if (sharePlan) sharePlan.onclick = function () {
          navigator.share({ title: 'Anchor Planner', text: planText }).catch(function () {});
        };
        var copyJson = root.querySelector('.ap-copy-json');
        if (copyJson) copyJson.onclick = function () { ap.copyText(jsonText, 'JSON kopieren:'); };
        var downloadJson = root.querySelector('.ap-download-json');
        if (downloadJson) downloadJson.onclick = function () { ap.downloadText('anchor-planner-plan.json', jsonText, 'application/json;charset=utf-8'); };
      }, 0);
    } else {
      window.prompt('Anchor Planner – Planübersicht', planText);
    }
  };

  ap.clearData = function () {
    if (!confirm('Anchor-Planner-Daten löschen? Draw-Tools-Zeichnungen bleiben unverändert.')) return;
    ap.state.anchors = {};
    ap.state.lastScan = null;
    ap.runtime.stats = {};
    ap.runtime.links = [];
    ap.runtime.existingLinkIds = {};
    ap.runtime.existingLinks = [];
    ap.runtime.unresolvedEndpoints = [];
    ap.runtime.selectedBlocker = null;
    ap.save();
    ap.renderOverlays();
    ap.renderPanel();
  };


  ap.assignEndpointToPortal = function (key, guid, title, lat, lng, address) {
    if (!key || !guid) return;
    ap.state.endpointAssignments = ap.state.endpointAssignments || {};
    ap.state.endpointAssignments[key] = {
      guid: guid,
      title: title || 'Manuell zugeordnet',
      lat: typeof lat === 'number' ? lat : parseFloat(lat),
      lng: typeof lng === 'number' ? lng : parseFloat(lng),
      address: address || '',
      assignedAt: new Date().toISOString()
    };
    ap.save();
    ap.scan();
  };

  ap.clearEndpointAssignments = function () {
    if (!confirm('Alle manuellen Endpunkt-Zuordnungen löschen?')) return;
    ap.state.endpointAssignments = {};
    ap.save();
    ap.scan();
  };

  ap.renderPanel = function () {
    var panel = ap.runtime.panel;
    if (!panel) return;
    panel.style.display = ap.runtime.enabled ? '' : 'none';
    if (!ap.runtime.enabled) return;

    var stats = ap.sortedStats();
    var filterCounts = ap.filterCounts(stats);
    var visibleStats = stats.filter(ap.matchesListFilter);
    var planPortalCount = stats.length;
    var completedPortalCount = stats.reduce(function (count, stat) {
      var local = ap.ensureAnchorState(stat.guid);
      return count + (local.done ? 1 : 0);
    }, 0);
    var last = ap.state.lastScan;
    var blockedLinks = (ap.runtime.links || []).filter(function (link) {
      return link && !link.existing && link.blocked && link.blockers && link.blockers.length;
    });

    var html = '';
    html += '<div class="ap-head"><b>Anchor Planner</b><span>v' + ap.VERSION + '</span><button id="ap-collapse">' + (ap.state.panelCollapsed ? '▴' : '▾') + '</button></div>';
    if (ap.state.panelCollapsed) {
      html += '<div class="ap-mini">' + planPortalCount + ' Planportale</div>';
      panel.innerHTML = html;
      document.getElementById('ap-collapse').onclick = function () { ap.state.panelCollapsed = false; ap.save(); ap.renderPanel(); };
      return;
    }

    html += '<div class="ap-actions"><button id="ap-scan">Draw Tools scannen</button><button id="ap-loadnames">Namen laden</button><button id="ap-export">Export / Teilen</button><button id="ap-sort-location" title="Luftlinien-Näherungsroute ab dem zuletzt von IITC gemeldeten Standort">Ab Standort sortieren</button><button id="ap-clear">Daten löschen</button></div>';
    html += '<div class="ap-settings">Toleranz <input id="ap-tolerance" type="number" min="1" max="100" value="' + ap.escapeHtml(ap.state.tolerance) + '"> m</div>';
    html += '<div class="ap-filters" aria-label="Portalliste filtern">';
    [
      ['all', 'Alle', filterCounts.all],
      ['open', 'Offen', filterCounts.open],
      ['blocked', 'Blockiert', filterCounts.blocked],
      ['keys', 'Keys fehlen', filterCounts.keys],
      ['done', 'Erledigt', filterCounts.done]
    ].forEach(function (item) {
      html += '<button class="ap-filter' + ((ap.state.listFilter || 'all') === item[0] ? ' ap-filter-active' : '') + '" data-filter="' + item[0] + '">' + item[1] + ' <span>' + item[2] + '</span></button>';
    });
    html += '</div>';
    html += '<div id="ap-message" class="ap-message">';
    if (last) {
      html += 'Letzter Scan: ' + ap.escapeHtml(last.plannedLinks) + ' Links, ' + ap.escapeHtml(last.resolvedPortals) + ' Planportale, ' + ap.escapeHtml(last.unresolvedEndpoints) + ' offene Endpunkte.';
      if (last.plannedLinks != null) html += '<div class="ap-source">Vorhandene Links: ' + ap.escapeHtml(last.existingPlannedLinks || 0) + ' · offen: ' + ap.escapeHtml(last.unconfirmedLinks || 0) + ' · davon blockiert: ' + ap.escapeHtml(last.blockedPlannedLinks || 0) + '</div>';
      if (last.bookmarkMatchedEndpoints) html += '<div class="ap-source">Quelle: Bookmarks</div>';
      if (last.unresolvedSample && last.unresolvedSample.length) {
        html += '<div class="ap-unresolved"><b>Offene Endpunkte:</b>';
        html += '<div class="ap-hint">Wenn Draw Tools/Auto Draw hier keine verwertbaren Portaldaten liefert: auf den betreffenden Bereich zoomen, warten bis IITC die Portale geladen hat, dann erneut scannen bzw. Namen laden.</div>';
        last.unresolvedSample.forEach(function (u) {
          html += '<div class="ap-unresolved-item">Segment ' + ap.escapeHtml(u.segment) + u.end + ': ' + ap.escapeHtml(Number(u.lat).toFixed(6)) + ',' + ap.escapeHtml(Number(u.lng).toFixed(6));
          if (u.nearestTitle) html += ' · nächstes IITC-Portal: ' + ap.escapeHtml(u.nearestTitle) + ' (' + ap.escapeHtml(u.nearestDistance) + ' m)';
          else html += ' · kein geladenes IITC-Portal gefunden';
          if (u.layerDebug) {
            html += '<div>Draw-Tools-Objekt: ' + ap.escapeHtml(u.layerDebug.type || '-') +
              (u.layerDebug.title ? ' · Titel: ' + ap.escapeHtml(u.layerDebug.title) : '') +
              (u.layerDebug.optionKeys && u.layerDebug.optionKeys.length ? ' · optionKeys: ' + ap.escapeHtml(u.layerDebug.optionKeys.join(', ')) : '') + '</div>';
          }
          if (u.drawPointCandidates && u.drawPointCandidates.length) {
            html += '<div>Nächste Draw-Tools-Punkte:';
            u.drawPointCandidates.forEach(function (d) {
              html += '<br>• ' + ap.escapeHtml(d.title) + ' · ' + ap.escapeHtml(d.type) + ' · ' + ap.escapeHtml(d.distance) + ' m' +
                (d.optionKeys && d.optionKeys.length ? ' · keys: ' + ap.escapeHtml(d.optionKeys.slice(0, 8).join(', ')) : '');
            });
            html += '</div>';
          }
          if (u.candidates && u.candidates.length) {
            html += '<div>Nächste IITC-Portale:';
            u.candidates.slice(0, 5).forEach(function (c) {
              html += '<br>• ' + ap.escapeHtml(c.title) + ' (' + ap.escapeHtml(c.distance) + ' m)' + (c.source ? ' · ' + ap.escapeHtml(c.source) : '');
            });
            html += '</div>';
          }
          html += '</div>';
        });
        html += '</div>';
      }
      html += '<div class="ap-progress">Planfortschritt: ' + ap.escapeHtml(last.existingPlannedLinks || 0) + ' / ' + ap.escapeHtml(last.plannedLinks || 0) + ' Links vorhanden · ' + ap.escapeHtml(last.blockedPlannedLinks || 0) + ' blockiert · ' + ap.escapeHtml(completedPortalCount) + ' / ' + ap.escapeHtml(planPortalCount) + ' Portale erledigt</div>';
    } else html += 'Draw Tools/Auto Draw Plan erzeugen und dann scannen. Portal-Bookmarks werden bevorzugt ausgewertet; fehlende Namen werden anschließend automatisch nachgeladen.';
    html += '</div>';

    if (blockedLinks.length) {
      html += '<details class="ap-blocker-details"><summary>Blocker-Details (' + ap.escapeHtml(blockedLinks.length) + ')</summary>';
      blockedLinks.forEach(function (link, linkIndex) {
        var plannedA = ap.portalDisplayLabel(link.a, link.titleA, link.latlngA);
        var plannedB = ap.portalDisplayLabel(link.b, link.titleB, link.latlngB);
        html += '<div class="ap-blocker-item"><div><b>Planlink:</b> ' + ap.escapeHtml(plannedA) + ' ↔ ' + ap.escapeHtml(plannedB) + '</div>';
        link.blockers.forEach(function (blocker, blockerIndex) {
          var blockerA = ap.portalDisplayLabel(blocker.a, blocker.titleA, blocker.latlngA);
          var blockerB = ap.portalDisplayLabel(blocker.b, blocker.titleB, blocker.latlngB);
          html += '<div class="ap-blocker-existing"><span>Blockiert durch: ' + ap.escapeHtml(blockerA) + ' ↔ ' + ap.escapeHtml(blockerB) + '</span><button type="button" class="ap-show-blocker" data-link-index="' + linkIndex + '" data-blocker-index="' + blockerIndex + '">zeigen</button></div>';
        });
        html += '</div>';
      });
      html += '<div class="ap-blocker-hint">Geprüft wurden nur die aktuell in IITC geladenen vorhandenen Links.</div></details>';
    }

    var nextPortal = ap.getNextPortal();
    var nextUsesLocation = !!ap.getCurrentUserLocation();
    ap.runtime.nextTargetKey = (nextUsesLocation ? 'location:' : 'route:') + (nextPortal ? nextPortal.guid : 'complete');
    if (nextPortal) {
      var nextNav = ap.navigationLinks(nextPortal);
      html += '<div id="ap-next-target" class="ap-next-target"><span><b>' + (nextUsesLocation ? 'Nächstes Portal ab Standort:' : 'Nächstes Portal:') + '</b> ' + ap.escapeHtml(nextPortal.title) + '</span><a target="_blank" rel="noopener" href="' + ap.escapeHtml(nextNav.waze) + '">Waze</a></div>';
    } else if (stats.length) {
      html += '<div id="ap-next-target" class="ap-next-target ap-next-complete">Alle Planportale erledigt.</div>';
    }

    html += '<div class="ap-list">';
    visibleStats.forEach(function (stat) {
      var local = ap.ensureAnchorState(stat.guid);
      var status = ap.getStatus(stat.guid, stat);
      var nav = ap.navigationLinks(stat);
      html += '<div class="ap-row ap-planportal" data-guid="' + ap.escapeHtml(stat.guid) + '">';
      html += '<div class="ap-row-title"><span class="ap-route-number">' + ap.escapeHtml((local.routeOrder == null ? 0 : local.routeOrder) + 1) + '.</span> <span class="ap-status ' + status.cls + '">' + status.symbol + '</span> <b>' + ap.escapeHtml(stat.title) + '</b></div>';
      if (stat.address) html += '<div class="ap-address">' + ap.escapeHtml(stat.address) + '</div>';
      html += '<div class="ap-meta">' + (stat.source ? ap.escapeHtml(stat.source) + ' · ' : '') + 'Links: ' + ap.escapeHtml(stat.linkCount) + ' · vorhanden: ' + ap.escapeHtml(stat.existingLinks || 0) + ' · offen: ' + ap.escapeHtml(stat.openLinks || stat.requiredKeys || 0) + ' · davon blockiert: ' + ap.escapeHtml(stat.blockedLinks || 0) + ' · Keys benötigt <input class="ap-owned" type="number" min="0" value="' + ap.escapeHtml(local.ownedKeys || 0) + '"> / ' + ap.escapeHtml(stat.requiredKeys) + ' · ' + ap.escapeHtml(status.label) + '</div>';
      html += '<div class="ap-controls"><button class="ap-move-up" title="In der Reihenfolge nach oben">↑</button><button class="ap-move-down" title="In der Reihenfolge nach unten">↓</button> <label><input class="ap-done-check" type="checkbox" ' + (local.done ? 'checked' : '') + '> erledigt</label> <button class="ap-share">Aktionen</button></div>';
      html += '<input class="ap-note" type="hidden" value="' + ap.escapeHtml(local.note || '') + '">';
      html += '</div>';
    });
    html += '</div>';
    if (visibleStats.length) html += '<div class="ap-list-end">Ende der Liste · ' + ap.escapeHtml(visibleStats.length) + (visibleStats.length === stats.length ? ' Portale' : ' von ' + stats.length + ' Portalen') + '</div>';
    else if (stats.length) html += '<div class="ap-list-empty">Keine Planportale für diesen Filter.</div>';

    panel.innerHTML = html;

    document.getElementById('ap-collapse').onclick = function () { ap.state.panelCollapsed = true; ap.save(); ap.renderPanel(); };
    document.getElementById('ap-scan').onclick = ap.scan;
    document.getElementById('ap-loadnames').onclick = ap.refreshMissingNames;
    document.getElementById('ap-export').onclick = ap.showExport;
    document.getElementById('ap-sort-location').onclick = ap.sortRouteFromUserLocation;
    document.getElementById('ap-clear').onclick = ap.clearData;
    document.getElementById('ap-tolerance').onchange = function () { ap.state.tolerance = parseInt(this.value, 10) || ap.DEFAULT_TOLERANCE_M; ap.save(); };
    Array.prototype.forEach.call(panel.querySelectorAll('.ap-filter'), function (button) {
      button.onclick = function () {
        ap.state.listFilter = this.getAttribute('data-filter') || 'all';
        ap.save();
        ap.renderPanel();
      };
    });
    Array.prototype.forEach.call(panel.querySelectorAll('.ap-show-blocker'), function (button) {
      button.onclick = function () {
        var linkIndex = parseInt(this.getAttribute('data-link-index'), 10);
        var blockerIndex = parseInt(this.getAttribute('data-blocker-index'), 10);
        var link = blockedLinks[linkIndex];
        var blocker = link && link.blockers ? link.blockers[blockerIndex] : null;
        if (link && blocker) ap.focusBlocker(link, blocker);
      };
    });
    Array.prototype.forEach.call(panel.querySelectorAll('.ap-row'), function (row) {
      var guid = row.getAttribute('data-guid');
      var local = ap.ensureAnchorState(guid);
      row.querySelector('.ap-owned').onchange = function () { local.ownedKeys = parseInt(this.value, 10) || 0; ap.save(); ap.renderOverlays(); ap.renderPanel(); };
      row.querySelector('.ap-done-check').onchange = function () {
        local.done = !!this.checked;
        ap.save();
        ap.renderOverlays();
        ap.renderPanel();
      };
      row.querySelector('.ap-note').onchange = function () { local.note = this.value; ap.save(); };
      row.querySelector('.ap-move-up').onclick = function () { ap.movePortal(guid, -1); };
      row.querySelector('.ap-move-down').onclick = function () { ap.movePortal(guid, 1); };
      row.querySelector('.ap-share').onclick = function () { ap.showPortalActions(guid); };
    });

    // v0.1.23: keine eigene Endpunkt-Zuordnung per UI; Draw-Tools-Rohdaten werden nur diagnostiziert.
  };

  ap.injectCss = function () {
    $('<style>').prop('type', 'text/css').html('\
#iitc-anchor-planner{position:absolute;right:10px;bottom:28px;z-index:3000;width:360px;max-height:70vh;overflow:auto;background:rgba(8,12,18,.94);color:#eee;border:1px solid #777;border-radius:6px;font:12px/1.35 Arial,sans-serif;box-shadow:0 2px 12px rgba(0,0,0,.6);-webkit-overflow-scrolling:touch}\
#iitc-anchor-planner .ap-head{display:flex;align-items:center;gap:6px;padding:6px 8px;background:#222;border-bottom:1px solid #555}#iitc-anchor-planner .ap-head b{flex:1;color:#fff}#iitc-anchor-planner .ap-head span{color:#aaa}\
#iitc-anchor-planner button{margin:2px;padding:3px 6px;background:#333;color:#eee;border:1px solid #777;border-radius:3px}#iitc-anchor-planner button:hover{background:#444}\
#iitc-anchor-planner input{background:#111;color:#fff;border:1px solid #666;border-radius:2px}#iitc-anchor-planner .ap-settings input,#iitc-anchor-planner .ap-owned{width:42px}\
#iitc-anchor-planner .ap-filters{display:flex;flex-wrap:wrap;gap:4px;padding:5px 8px;border-bottom:1px solid #333}#iitc-anchor-planner .ap-filter{margin:0;padding:4px 7px}#iitc-anchor-planner .ap-filter span{color:#aaa;font-size:10px}#iitc-anchor-planner .ap-filter-active{background:#666;color:#fff;border-color:#bbb}#iitc-anchor-planner .ap-filter-active span{color:#fff}.ap-list-empty,.ap-list-end{padding:7px 8px;color:#aaa;text-align:center}\
#iitc-anchor-planner .ap-actions,.ap-settings,.ap-message,.ap-mini{padding:5px 8px;border-bottom:1px solid #333}.ap-message{color:#ccc}.ap-source{margin-top:2px;color:#9fd0ff}.ap-progress{margin-top:4px;color:#ddd;font-size:11px;line-height:1.3}.ap-unresolved-item{margin-top:4px;border-top:1px solid #554;padding-top:3px}.ap-mini{color:#ddd}.ap-unresolved{margin-top:4px;color:#f5d76e;font-size:11px;line-height:1.3}\
#iitc-anchor-planner .ap-blocker-details{padding:5px 8px;border-bottom:1px solid #443;color:#ddd}#iitc-anchor-planner .ap-blocker-details summary{cursor:pointer;color:#ff8b80;font-weight:bold}#iitc-anchor-planner .ap-blocker-item{margin-top:5px;padding-top:5px;border-top:1px solid #443;overflow-wrap:anywhere}#iitc-anchor-planner .ap-blocker-existing{display:flex;align-items:flex-start;gap:4px;margin-top:3px;color:#ffb0a8}#iitc-anchor-planner .ap-blocker-existing span{flex:1}#iitc-anchor-planner .ap-show-blocker{flex:none;margin:0;padding:2px 6px}#iitc-anchor-planner .ap-blocker-hint{margin-top:5px;color:#aaa;font-size:11px}\
#iitc-anchor-planner .ap-list{overflow:visible;padding-bottom:16px}\
#iitc-anchor-planner .ap-row{padding:6px 8px;border-bottom:1px solid #333;background:rgba(255,255,255,.02)}#iitc-anchor-planner .ap-row.ap-candidate{background:rgba(255,255,255,.055)}\
#iitc-anchor-planner .ap-row-title{font-size:13px}.ap-address{color:#bbb;margin:2px 0}.ap-meta{margin:4px 0;color:#ddd}.ap-controls{margin:3px 0}.ap-controls a{color:#f0d16b;text-decoration:none;margin-right:5px}.ap-note{width:98%;box-sizing:border-box;margin-top:3px}\
.ap-blocked{color:#ff3b30}.ap-status{display:inline-block;min-width:18px;text-align:center;font-weight:bold}.ap-badge-icon{background:transparent!important;border:none!important}.ap-svg-badge-icon{display:block!important;visibility:visible!important;opacity:1!important;background:transparent!important;border:0!important}.ap-badge{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:15px;border:2px solid #eee;background:rgba(0,0,0,.75);box-shadow:0 0 4px #000;color:#fff}\
.ap-missing{color:#ff9f43}.ap-partial{color:#f5d76e}.ap-ready{color:#ff6ad5}.ap-existing{color:#bdbdbd}.ap-done{color:#eee}.ap-badge.ap-missing{border-color:#ff9f43}.ap-badge.ap-partial{border-color:#f5d76e}.ap-badge.ap-ready{border-color:#ff6ad5}.ap-badge.ap-existing{border-color:#bdbdbd}.ap-badge.ap-done{border-color:#eee}.ap-next-target{display:flex;align-items:center;gap:8px;padding:6px 8px;border-bottom:1px solid #444;background:#1c2530;color:#fff}.ap-next-target span{flex:1}.ap-next-target a{padding:4px 7px;background:#333;color:#f0d16b;border:1px solid #777;border-radius:3px;text-decoration:none}.ap-next-complete{color:#ddd}.ap-route-number{display:inline-block;min-width:22px;color:#aaa}.ap-map-badge-next{box-shadow:0 0 0 3px #fff,0 0 0 6px rgba(0,0,0,.95),0 0 12px rgba(255,255,255,.9)!important}.ap-move-up,.ap-move-down{min-width:28px}\
.ap-action-label{margin-top:10px;font-weight:bold;color:#ddd}.ap-share-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px}.ap-share-grid-single{grid-template-columns:1fr}.ap-share-grid a,.ap-share-grid button{display:block;padding:6px;background:#222;color:#f0d16b;border:1px solid #666;border-radius:4px;text-align:center;text-decoration:none}.ap-share-grid .ap-share-main{color:#fff;font-weight:bold;border-color:#aaa}\
.ap-export-tabs{display:flex;gap:6px;margin-bottom:8px}.ap-export-tab{padding:6px 10px!important}.ap-export-tab-active{background:#555!important;color:#fff!important}.ap-export-text,.ap-export-json{width:100%;height:320px;box-sizing:border-box;font-family:monospace;font-size:12px;background:#111;color:#eee;border:1px solid #666}.ap-export-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.ap-export-actions button{padding:6px 10px;background:#222;color:#f0d16b;border:1px solid #666;border-radius:4px}\
.ap-map-html-overlay{position:absolute!important;left:0!important;top:0!important;right:0!important;bottom:0!important;z-index:2500!important;pointer-events:none!important;overflow:visible!important}.ap-map-badge{position:absolute!important;transform:translate(-50%,-50%)!important;min-width:24px!important;height:24px!important;padding:0 3px!important;border-radius:13px!important;border:3px solid #ff9f43!important;background:rgba(0,0,0,.88)!important;color:#fff!important;font:bold 10px/24px Arial,sans-serif!important;text-align:center!important;white-space:nowrap!important;box-sizing:border-box!important;text-shadow:0 1px 2px #000!important;z-index:2501!important}.ap-map-badge-done{font-size:9px!important}.ap-map-badge-ready{font-size:14px!important}.ap-map-badge-partial{font-size:13px!important}\
@media(max-width:600px){#iitc-anchor-planner{right:5px;left:5px;bottom:76px;width:auto;max-height:calc(100vh - 170px);font-size:12px}#iitc-anchor-planner .ap-list{padding-bottom:20px}}\
').appendTo('head');
  };

  ap.setupLayer = function () {
    ap.runtime.layerGroup = new L.LayerGroup();
    if (typeof window.addLayerGroup === 'function') window.addLayerGroup('Anchor Planner', ap.runtime.layerGroup, true);
    if (window.map && typeof window.map.hasLayer === 'function' && !window.map.hasLayer(ap.runtime.layerGroup)) {
      try { ap.runtime.layerGroup.addTo(window.map); } catch (e) {}
    } else if (window.map && typeof window.map.hasLayer !== 'function') {
      try { ap.runtime.layerGroup.addTo(window.map); } catch (e) {}
    }

    if (window.map && typeof window.map.on === 'function') {
      window.map.on('overlayadd', function (e) {
        if (e && e.layer === ap.runtime.layerGroup) {
          ap.runtime.enabled = true;
          ap.renderPanel();
          ap.renderOverlays();
        }
      });
      window.map.on('overlayremove', function (e) {
        if (e && e.layer === ap.runtime.layerGroup) {
          ap.runtime.enabled = false;
          if (ap.runtime.layerGroup) ap.runtime.layerGroup.clearLayers();
          ap.clearHtmlOverlay();
          ap.runtime.overlayCount = 0;
          ap.renderPanel();
        }
      });
      window.map.on('zoomend moveend resize', function () { if (ap.runtime.enabled) ap.renderOverlays(); });
    }
  };

  ap.setupPanel = function () {
    ap.runtime.panel = $('<div id="iitc-anchor-planner"></div>').appendTo('body')[0];
    ap.renderPanel();
  };

  var setup = function () {
    ap.load();
    ap.injectCss();
    ap.setupLayer();
    ap.setupPanel();
    setTimeout(ap.setupUserLocationIntegration, 0);
    console.log('[Anchor Planner] loaded v' + ap.VERSION);
  };

  setup.info = plugin_info;

  if (!window.bootPlugins) window.bootPlugins = [];
  window.bootPlugins.push(setup);
  if (window.iitcLoaded && typeof setup === 'function') setup();
}

var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
  info.script = {
    version: GM_info.script.version,
    name: GM_info.script.name,
    description: GM_info.script.description
  };
}
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement).appendChild(script);
