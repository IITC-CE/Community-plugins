// ==UserScript==
// @author          Tarsi210
// @id              herringbone-planner@Tarsi210
// @name            Herringbone Planner
// @category        Layer
// @version         0.4.4
// @description     Finds and draws an optimal visible-portal spine for herringbone multilayer planning, with CSV export.
// @downloadURL     https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/Tarsi210/herringbone-planner.user.js
// @updateURL       https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/Tarsi210/herringbone-planner.meta.js
// @homepageURL     https://github.com/Tarsi210/iitc-herringbone-planner
// @issueTracker    https://github.com/Tarsi210/iitc-herringbone-planner/issues
// @include         http://intel.ingress.com/*
// @include         https://intel.ingress.com/*
// @include         http://intel-x.ingress.com/*
// @include         https://intel-x.ingress.com/*
// @include         http://www.ingress.com/intel*
// @include         https://www.ingress.com/intel*
// @match           http://intel.ingress.com/*
// @match           https://intel.ingress.com/*
// @match           http://intel-x.ingress.com/*
// @match           https://intel-x.ingress.com/*
// @match           http://www.ingress.com/intel*
// @match           https://www.ingress.com/intel*
// @grant           unsafeWindow
// ==/UserScript==


function wrapper(plugin_info, w) {
  'use strict';

  w = w || window;
  var $ = w.$;
  var doc = w.document || document;

  var plugin = {};
  var ns = 'herringboneSpinePlanner';
  if (!w.plugin) w.plugin = {};
  w.plugin[ns] = plugin;

  var STORAGE_KEY = 'plugin-herringbone-spine-planner-settings';
  var DEFAULT_SETTINGS = {
    maxDeviationMeters: 35,
    maxSegmentAngleDegrees: 25,
    minPortals: 4,
    maxSpinePortals: 0,
    maxVisiblePortals: 180,
    maxExecutionSeconds: 30,
    autoRefresh: true,
    showCorridor: true,
    showRejectedPortals: true,
    showAnchorLinks: true,
    anchorA: null,
    anchorB: null
  };

  plugin.settings = loadSettings();
  plugin.lastResult = null;
  plugin.layerGroup = null;
  plugin.refreshTimer = null;
  plugin.computeTimer = null;
  plugin.refreshSerial = 0;
  plugin.control = null;

  function setup() {
    try {
      plugin.isSetup = true;
      w.console.log('[Herringbone Planner] setup starting');
      if (!$) throw new Error('jQuery is not available in IITC page context yet.');
      injectCss();

      plugin.layerGroup = new w.L.LayerGroup();
      plugin.layerGroup.addTo(w.map);
      if (w.layerChooser && w.layerChooser.addOverlay) {
        w.layerChooser.addOverlay(plugin.layerGroup, 'Herringbone Planner');
      }

      addControls();
      addToolboxLink();
      bindMapEvents();
      addPortalDetailsButtons();
      plugin.refresh();
      w.console.log('[Herringbone Planner] setup complete');
    } catch (err) {
      w.console.error('[Herringbone Planner] setup failed', err);
      w.setTimeout(function () {
        w.alert('Herringbone Planner failed during setup. Open the browser console for details: ' + err.message);
      }, 100);
    }
  }

  plugin.refresh = function () {
    if (!w.map || !w.portals) return;

    var serial = ++plugin.refreshSerial;
    var portals = getVisiblePortals();
    if (portals.length > plugin.settings.maxVisiblePortals) {
      plugin.lastResult = null;
      drawResult(null);
      updateStatus(null, portals.length, true);
      return;
    }

    if (plugin.computeTimer) w.clearTimeout(plugin.computeTimer);
    updateProcessingStatus(portals.length);
    setDialogStatus('Processing herringbone plan...');

    plugin.computeTimer = w.setTimeout(function () {
      plugin.computeTimer = null;
      if (serial !== plugin.refreshSerial) return;

      var startedAt = Date.now();
      var deadlineMs = startedAt + plugin.settings.maxExecutionSeconds * 1000;
      var search = findBestSpine(portals, plugin.settings, deadlineMs);
      var result = search.result;

      if (result) {
        result.timedOut = search.timedOut;
        result.elapsedMs = Date.now() - startedAt;
      }

      rememberKeyCount(result);
      plugin.lastResult = result;

      drawResult(result);
      updateStatus(result, portals.length, false, search.timedOut);
      setDialogStatus(formatResultSummary(result, search.timedOut));
      updateDialogAnchorLabels();
    }, 25);
  };

  plugin.scheduleRefresh = function () {
    if (!plugin.settings.autoRefresh) return;

    if (plugin.refreshTimer) w.clearTimeout(plugin.refreshTimer);
    plugin.refreshTimer = w.setTimeout(function () {
      plugin.refreshTimer = null;
      plugin.refresh();
    }, 350);
  };

  plugin.openDialog = function () {
    var html = [
      '<div class="hbsp-dialog">',
      '<label>Max deviation from center line, meters',
      '<input id="hbsp-max-deviation" type="number" min="1" step="1" value="' + escapeHtml(plugin.settings.maxDeviationMeters) + '"></label>',
      '<label>Max segment angle to center line, degrees',
      '<input id="hbsp-max-angle" type="number" min="1" max="89" step="1" value="' + escapeHtml(plugin.settings.maxSegmentAngleDegrees) + '"></label>',
      '<label>Minimum portals',
      '<input id="hbsp-min-portals" type="number" min="2" step="1" value="' + escapeHtml(plugin.settings.minPortals) + '"></label>',
      '<label>Max portals in spine; 0 means no limit',
      '<input id="hbsp-max-spine-portals" type="number" min="0" step="1" value="' + escapeHtml(plugin.settings.maxSpinePortals) + '"></label>',
      '<label>Max visible portals to process',
      '<input id="hbsp-max-visible" type="number" min="10" step="10" value="' + escapeHtml(plugin.settings.maxVisiblePortals) + '"></label>',
      '<label>Max processing time, seconds',
      '<input id="hbsp-max-execution" type="number" min="1" max="120" step="1" value="' + escapeHtml(plugin.settings.maxExecutionSeconds) + '"></label>',
      '<label class="hbsp-check"><input id="hbsp-auto-refresh" type="checkbox"' + (plugin.settings.autoRefresh ? ' checked' : '') + '> Auto recompute after map moves</label>',
      '<label class="hbsp-check"><input id="hbsp-show-corridor" type="checkbox"' + (plugin.settings.showCorridor ? ' checked' : '') + '> Show candidate corridor</label>',
      '<div class="hbsp-help">Corridor is the allowed max-deviation band around the selected start/end center line.</div>',
      '<label class="hbsp-check"><input id="hbsp-show-rejected" type="checkbox"' + (plugin.settings.showRejectedPortals ? ' checked' : '') + '> Highlight rejected portals</label>',
      '<label class="hbsp-check"><input id="hbsp-show-anchor-links" type="checkbox"' + (plugin.settings.showAnchorLinks ? ' checked' : '') + '> Show anchor links</label>',
      '<div class="hbsp-anchors">',
      '<div id="hbsp-anchor-a-label">Anchor A: ' + escapeHtml(formatAnchorLabel(plugin.settings.anchorA, 'A')) + '</div>',
      '<div id="hbsp-anchor-b-label">Anchor B: ' + escapeHtml(formatAnchorLabel(plugin.settings.anchorB, 'B')) + '</div>',
      '</div>',
      '<div class="hbsp-actions">',
      '<button id="hbsp-set-anchor-a">Set Selected as A</button>',
      '<button id="hbsp-set-anchor-b">Set Selected as B</button>',
      '<button id="hbsp-clear-anchors">Clear Anchors</button>',
      '</div>',
      '<div id="hbsp-dialog-status">' + formatResultSummary(plugin.lastResult) + '</div>',
      '<div class="hbsp-actions">',
      '<button id="hbsp-save-refresh">Save & Refresh</button>',
      '<button id="hbsp-export-csv">Export CSV</button>',
      '</div>',
      '</div>'
    ].join('');

    w.dialog({
      html: html,
      title: 'Herringbone Planner',
      id: 'herringbone-spine-planner-dialog',
      width: 380
    });

    $('#hbsp-save-refresh').on('click', function () {
      plugin.settings.maxDeviationMeters = clampNumber($('#hbsp-max-deviation').val(), 1, 10000, DEFAULT_SETTINGS.maxDeviationMeters);
      plugin.settings.maxSegmentAngleDegrees = clampNumber($('#hbsp-max-angle').val(), 1, 89, DEFAULT_SETTINGS.maxSegmentAngleDegrees);
      plugin.settings.minPortals = clampNumber($('#hbsp-min-portals').val(), 2, 10000, DEFAULT_SETTINGS.minPortals);
      plugin.settings.maxSpinePortals = clampNumber($('#hbsp-max-spine-portals').val(), 0, 10000, DEFAULT_SETTINGS.maxSpinePortals);
      plugin.settings.maxVisiblePortals = clampNumber($('#hbsp-max-visible').val(), 10, 1000, DEFAULT_SETTINGS.maxVisiblePortals);
      plugin.settings.maxExecutionSeconds = clampNumber($('#hbsp-max-execution').val(), 1, 120, DEFAULT_SETTINGS.maxExecutionSeconds);
      plugin.settings.autoRefresh = $('#hbsp-auto-refresh').prop('checked');
      plugin.settings.showCorridor = $('#hbsp-show-corridor').prop('checked');
      plugin.settings.showRejectedPortals = $('#hbsp-show-rejected').prop('checked');
      plugin.settings.showAnchorLinks = $('#hbsp-show-anchor-links').prop('checked');
      saveSettings();
      plugin.refresh();
      setDialogStatus('Processing herringbone plan...');
    });

    $('#hbsp-export-csv').on('click', function () {
      plugin.exportCsv();
    });

    $('#hbsp-set-anchor-a').on('click', function () {
      setAnchorFromSelected('A');
      plugin.openDialog();
    });

    $('#hbsp-set-anchor-b').on('click', function () {
      setAnchorFromSelected('B');
      plugin.openDialog();
    });

    $('#hbsp-clear-anchors').on('click', function () {
      plugin.settings.anchorA = null;
      plugin.settings.anchorB = null;
      saveSettings();
      plugin.refresh();
      plugin.openDialog();
    });
  };

  plugin.exportCsv = function () {
    if (!plugin.lastResult || !plugin.lastResult.sequence || !plugin.lastResult.sequence.length) {
      w.alert('No herringbone plan found to export.');
      return;
    }

    var lines = [];
    lines.push([
      'row_type',
      'throw_order',
      'name',
      'lat',
      'lng',
      'keys_required',
      'portal_link',
      'notes',
      'distance_from_previous_m'
    ].join(','));

    var result = plugin.lastResult;
    var sequence = getOperationalSpineOrder(result);

    if (result.anchors) {
      var spineCount = result.sequence.length;
      lines.push(formatCsvRow([
        'anchor_a',
        '',
        result.anchors.a.name,
        result.anchors.a.lat.toFixed(7),
        result.anchors.a.lng.toFixed(7),
        spineCount + 1,
        portalLink(result.anchors.a),
        'Needs one key for each spine portal, plus one extra because Anchor B throws the baseline link to Anchor A.',
        ''
      ]));
      lines.push(formatCsvRow([
        'anchor_b',
        '',
        result.anchors.b.name,
        result.anchors.b.lat.toFixed(7),
        result.anchors.b.lng.toFixed(7),
        spineCount,
        portalLink(result.anchors.b),
        'Needs one key for each spine portal.',
        ''
      ]));
      lines.push(formatCsvRow([
        'baseline',
        1,
        result.anchors.b.name + ' -> ' + result.anchors.a.name,
        '',
        '',
        '',
        '',
        '',
        'Throw from Anchor B to Anchor A first.',
        ''
      ]));
    }

    sequence.forEach(function (portal, idx) {
      lines.push([
        csvCell('spine'),
        result.anchors ? idx + 2 : idx + 1,
        csvCell(portal.name),
        portal.lat.toFixed(7),
        portal.lng.toFixed(7),
        '',
        csvCell(portalLink(portal)),
        csvCell(result.anchors ? 'From this portal, link to Anchor A and Anchor B.' : 'Spine portal.'),
        idx === 0 ? '' : distanceFromPreviousInOrder(sequence, idx).toFixed(1)
      ].join(','));
    });

    var csv = lines.join('\n');
    var filename = makeCsvFilename(result);
    downloadText(filename, csv, 'text/csv');
  };

  function getOperationalSpineOrder(result) {
    var sequence = result.sequence.slice();
    if (!result.anchors || sequence.length < 2) return sequence;

    var anchorMidpoint = {
      latLng: w.L.latLng(
        (result.anchors.a.lat + result.anchors.b.lat) / 2,
        (result.anchors.a.lng + result.anchors.b.lng) / 2
      )
    };
    var firstDistance = distanceMeters(anchorMidpoint, sequence[0]);
    var lastDistance = distanceMeters(anchorMidpoint, sequence[sequence.length - 1]);

    if (lastDistance < firstDistance) sequence.reverse();
    return sequence;
  }

  function distanceFromPreviousInOrder(sequence, idx) {
    if (idx <= 0) return 0;
    return distanceMeters(sequence[idx - 1], sequence[idx]);
  }

  function totalWalkDistance(result) {
    if (!result || !result.sequence || result.sequence.length < 2) return 0;
    var sequence = getOperationalSpineOrder(result);
    var total = 0;
    for (var i = 1; i < sequence.length; i++) {
      total += distanceFromPreviousInOrder(sequence, i);
    }
    return total;
  }

  function formatCsvRow(values) {
    return values.map(csvCell).join(',');
  }

  function portalLink(portal) {
    return 'https://intel.ingress.com/intel?pll=' + portal.lat.toFixed(6) + ',' + portal.lng.toFixed(6);
  }

  function makeCsvFilename(result) {
    var timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    if (result.anchors) {
      return 'Herringbone-' + sanitizeFilenamePart(result.anchors.a.name) + '-' + sanitizeFilenamePart(result.anchors.b.name) + '-' + timestamp + '.csv';
    }

    return 'Herringbone-' + timestamp + '.csv';
  }

  function sanitizeFilenamePart(value) {
    var text = String(value || 'Anchor').replace(/[^a-z0-9]+/gi, '');
    return text || 'Anchor';
  }

  function bindMapEvents() {
    w.map.on('moveend zoomend overlayadd overlayremove', plugin.scheduleRefresh);
    w.addHook('mapDataRefreshEnd', plugin.scheduleRefresh);
    w.addHook('mapDataEntityInject', plugin.scheduleRefresh);
    w.addHook('portalSelected', addPortalDetailsButtons);
    w.addHook('portalDetailsUpdated', addPortalDetailsButtons);
  }

  function addToolboxLink() {
    if (!$('#toolbox').length) return;
    $('<a>')
      .text('Herringbone Planner')
      .attr('title', 'Open Herringbone Planner')
      .on('click', plugin.openDialog)
      .appendTo('#toolbox');
  }

  function addPortalDetailsButtons() {
    w.setTimeout(function () {
      var details = $('#portaldetails');
      if (!details.length || details.find('#hbsp-portal-buttons').length) return;

      var box = $('<div id="hbsp-portal-buttons" class="hbsp-portal-buttons">');
      $('<button>')
        .text('Set HP Anchor A')
        .on('click', function () { setAnchorFromSelected('A'); })
        .appendTo(box);
      $('<button>')
        .text('Set HP Anchor B')
        .on('click', function () { setAnchorFromSelected('B'); })
        .appendTo(box);
      $('<button>')
        .text('Clear HP Anchors')
        .on('click', function () {
          plugin.settings.anchorA = null;
          plugin.settings.anchorB = null;
          saveSettings();
          plugin.refresh();
        })
        .appendTo(box);

      details.append(box);
    }, 50);
  }

  function setAnchorFromSelected(label) {
    var portal = getSelectedPortal();
    if (!portal) {
      w.alert('Select a portal first, then set Anchor ' + label + '.');
      return;
    }

    if (label === 'A') plugin.settings.anchorA = serializeAnchor(portal);
    if (label === 'B') plugin.settings.anchorB = serializeAnchor(portal);
    saveSettings();
    plugin.refresh();
  }

  function getSelectedPortal() {
    var guid = w.selectedPortal;
    if (!guid && w.IITC && w.IITC.statusbar && w.IITC.statusbar.portal) {
      guid = w.IITC.statusbar.portal.guid;
    }
    if (!guid || !w.portals || !w.portals[guid]) return null;

    var marker = w.portals[guid];
    var latLng = marker.getLatLng();
    var data = marker.options && marker.options.data ? marker.options.data : {};
    return {
      guid: guid,
      name: data.title || data.name || guid,
      lat: latLng.lat,
      lng: latLng.lng,
      latLng: latLng,
      marker: marker
    };
  }

  function serializeAnchor(portal) {
    return {
      guid: portal.guid,
      name: portal.name,
      lat: portal.lat,
      lng: portal.lng
    };
  }

  function getAnchorPair() {
    if (!plugin.settings.anchorA || !plugin.settings.anchorB) return null;
    if (plugin.settings.anchorA.guid === plugin.settings.anchorB.guid) return null;

    return {
      a: anchorToPortal(plugin.settings.anchorA),
      b: anchorToPortal(plugin.settings.anchorB)
    };
  }

  function anchorToPortal(anchor) {
    return {
      guid: anchor.guid,
      name: anchor.name,
      lat: anchor.lat,
      lng: anchor.lng,
      latLng: w.L.latLng(anchor.lat, anchor.lng)
    };
  }

  function addControls() {
    var HbspControl = w.L.Control.extend({
      options: { position: 'topleft' },
      onAdd: function () {
        var container = w.L.DomUtil.create('div', 'leaflet-bar hbsp-control');
        var button = w.L.DomUtil.create('a', '', container);
        button.href = '#';
        button.title = 'Herringbone Planner';
        button.textContent = 'HP';
        w.L.DomEvent.disableClickPropagation(container);
        w.L.DomEvent.on(button, 'click', function (event) {
          w.L.DomEvent.stop(event);
          plugin.openDialog();
        });
        return container;
      }
    });

    plugin.control = new HbspControl();
    w.map.addControl(plugin.control);
  }

  function getVisiblePortals() {
    var bounds = w.map.getBounds();
    var portals = [];

    $.each(w.portals, function (guid, marker) {
      if (!marker || !marker.getLatLng) return;

      var latLng = marker.getLatLng();
      if (!bounds.contains(latLng)) return;

      var data = marker.options && marker.options.data ? marker.options.data : {};
      portals.push({
        guid: guid,
        name: data.title || data.name || guid,
        lat: latLng.lat,
        lng: latLng.lng,
        latLng: latLng,
        marker: marker
      });
    });

    return portals;
  }

  function findBestSpine(portals, settings, deadlineMs) {
    if (!portals || portals.length < settings.minPortals) {
      return { result: null, timedOut: false };
    }

    var best = null;
    var maxDeviation = settings.maxDeviationMeters;
    var maxAngle = settings.maxSegmentAngleDegrees;
    var maxSpinePortals = settings.maxSpinePortals > 0 ? settings.maxSpinePortals : Infinity;
    var anchors = getAnchorPair();

    for (var i = 0; i < portals.length; i++) {
      for (var j = 0; j < portals.length; j++) {
        if (Date.now() >= deadlineMs) {
          return { result: best, timedOut: true };
        }

        if (i === j) continue;

        var start = portals[i];
        var end = portals[j];
        var basis = makeLocalBasis(start, end);
        if (!basis || basis.lengthMeters < 1) continue;

        var candidates = projectCandidates(portals, basis, maxDeviation, anchors);
        if (candidates.length < settings.minPortals) continue;

        var sequenceSearch = longestValidSequence(candidates, basis, start.guid, end.guid, maxAngle, maxSpinePortals, anchors, deadlineMs);
        if (sequenceSearch.timedOut) {
          return { result: best, timedOut: true };
        }

        var sequence = sequenceSearch.sequence;
        if (!sequence || sequence.length < settings.minPortals) continue;

        var result = buildResult(sequence, basis, start, end);
        result.visiblePortals = portals;
        result.anchors = anchors;
        if (!best || compareResults(result, best) > 0) best = result;
      }
    }

    return { result: best, timedOut: false };
  }

  function makeLocalBasis(start, end) {
    var originLatRad = degToRad(start.lat);
    var metersPerDegLat = 111320;
    var metersPerDegLng = 111320 * Math.cos(originLatRad);
    var dx = (end.lng - start.lng) * metersPerDegLng;
    var dy = (end.lat - start.lat) * metersPerDegLat;
    var length = Math.sqrt(dx * dx + dy * dy);

    if (!isFinite(length) || length <= 0) return null;

    return {
      start: start,
      end: end,
      originLat: start.lat,
      originLng: start.lng,
      metersPerDegLat: metersPerDegLat,
      metersPerDegLng: metersPerDegLng,
      unitX: dx / length,
      unitY: dy / length,
      lengthMeters: length
    };
  }

  function projectCandidates(portals, basis, maxDeviation, anchors) {
    var result = [];
    var eps = 0.01;

    portals.forEach(function (portal) {
      var projected = projectPortal(portal, basis);

      if (projected.alongTrack < -eps || projected.alongTrack > basis.lengthMeters + eps) return;
      if (Math.abs(projected.crossTrack) > maxDeviation) return;
      if (anchors && !formsUsableTriangle(anchors.a, anchors.b, projected)) return;

      result.push(projected);
    });

    result.sort(function (a, b) {
      if (a.alongTrack !== b.alongTrack) return a.alongTrack - b.alongTrack;
      return Math.abs(a.crossTrack) - Math.abs(b.crossTrack);
    });

    return result;
  }

  function projectPortal(portal, basis) {
    var point = toLocalMeters(portal, basis);
    var along = point.x * basis.unitX + point.y * basis.unitY;
    var cross = point.x * (-basis.unitY) + point.y * basis.unitX;

    return Object.assign({}, portal, {
      x: point.x,
      y: point.y,
      alongTrack: along,
      crossTrack: cross
    });
  }

  function longestValidSequence(candidates, basis, startGuid, endGuid, maxAngle, maxSpinePortals, anchors, deadlineMs) {
    var startIndex = -1;
    var endIndex = -1;

    for (var i = 0; i < candidates.length; i++) {
      if (candidates[i].guid === startGuid) startIndex = i;
      if (candidates[i].guid === endGuid) endIndex = i;
    }

    if (startIndex < 0 || endIndex < 0 || startIndex >= endIndex) return { sequence: null, timedOut: false };

    var n = candidates.length;
    var dp = new Array(n);
    var prev = new Array(n);
    var metrics = new Array(n);
    var paths = new Array(n);

    for (var d = 0; d < n; d++) {
      dp[d] = -Infinity;
      prev[d] = -1;
      metrics[d] = null;
      paths[d] = null;
    }
    dp[startIndex] = 1;
    metrics[startIndex] = {
      totalPathDistance: 0,
      totalAbsDeviation: Math.abs(candidates[startIndex].crossTrack),
      maxGap: 0,
      totalAngle: 0
    };
    paths[startIndex] = [startIndex];

    for (var to = startIndex + 1; to <= endIndex; to++) {
      for (var from = startIndex; from < to; from++) {
        if (Date.now() >= deadlineMs) return { sequence: null, timedOut: true };

        if (dp[from] < 0) continue;
        if (!isSegmentValid(candidates[from], candidates[to], basis, maxAngle)) continue;

        var candidateCount = dp[from] + 1;
        if (candidateCount > maxSpinePortals) continue;
        if (anchors && !canAppendWithoutAnchorCrossing(candidates[to], paths[from], candidates, anchors)) continue;
        var candidateMetrics = extendMetrics(metrics[from], candidates[from], candidates[to], basis);
        if (candidateCount > dp[to] || (candidateCount === dp[to] && compareMetrics(candidateMetrics, metrics[to]) > 0)) {
          dp[to] = candidateCount;
          prev[to] = from;
          metrics[to] = candidateMetrics;
          paths[to] = paths[from].concat([to]);
        }
      }
    }

    if (dp[endIndex] < 0) return { sequence: null, timedOut: false };

    var sequence = [];
    var cursor = endIndex;
    while (cursor >= 0) {
      sequence.push(candidates[cursor]);
      if (cursor === startIndex) break;
      cursor = prev[cursor];
    }

    if (sequence[sequence.length - 1].guid !== startGuid) return { sequence: null, timedOut: false };
    sequence.reverse();
    return { sequence: sequence, timedOut: false };
  }

  function extendMetrics(base, from, to, basis) {
    var dist = distanceMeters(from, to);
    var angle = segmentAngleDegrees(from, to, basis);
    return {
      totalPathDistance: base.totalPathDistance + dist,
      totalAbsDeviation: base.totalAbsDeviation + Math.abs(to.crossTrack),
      maxGap: Math.max(base.maxGap, dist),
      totalAngle: base.totalAngle + angle
    };
  }

  function compareMetrics(a, b) {
    if (!b) return 1;
    if (a.totalPathDistance !== b.totalPathDistance) return b.totalPathDistance - a.totalPathDistance;
    if (a.totalAbsDeviation !== b.totalAbsDeviation) return b.totalAbsDeviation - a.totalAbsDeviation;
    if (a.maxGap !== b.maxGap) return b.maxGap - a.maxGap;
    return b.totalAngle - a.totalAngle;
  }

  function isSegmentValid(a, b, basis, maxAngle) {
    if (b.alongTrack <= a.alongTrack) return false;

    var dx = b.x - a.x;
    var dy = b.y - a.y;
    var length = Math.sqrt(dx * dx + dy * dy);
    if (!isFinite(length) || length <= 0) return false;

    var forward = dx * basis.unitX + dy * basis.unitY;
    if (forward <= 0) return false;

    var cos = Math.max(-1, Math.min(1, forward / length));
    var angle = radToDeg(Math.acos(cos));
    return angle <= maxAngle;
  }

  function formsUsableTriangle(anchorA, anchorB, portal) {
    if (portal.guid === anchorA.guid || portal.guid === anchorB.guid) return false;
    var area2 = signedArea2(anchorA, anchorB, portal);
    return Math.abs(area2) > 1e-10;
  }

  function canAppendWithoutAnchorCrossing(portal, pathIndexes, candidates, anchors) {
    if (!formsUsableTriangle(anchors.a, anchors.b, portal)) return false;

    for (var i = 0; i < pathIndexes.length; i++) {
      var prior = candidates[pathIndexes[i]];
      if (prior.guid === portal.guid) continue;

      if (segmentsCrossStrict(anchors.a, portal, anchors.b, prior)) return false;
      if (segmentsCrossStrict(anchors.b, portal, anchors.a, prior)) return false;
    }

    return true;
  }

  function segmentsCrossStrict(a, b, c, d) {
    if (sharesEndpoint(a, b, c, d)) return false;

    var o1 = orientation(a, b, c);
    var o2 = orientation(a, b, d);
    var o3 = orientation(c, d, a);
    var o4 = orientation(c, d, b);
    var eps = 1e-12;

    if (Math.abs(o1) < eps || Math.abs(o2) < eps || Math.abs(o3) < eps || Math.abs(o4) < eps) {
      return false;
    }

    return (o1 > 0) !== (o2 > 0) && (o3 > 0) !== (o4 > 0);
  }

  function sharesEndpoint(a, b, c, d) {
    return samePoint(a, c) || samePoint(a, d) || samePoint(b, c) || samePoint(b, d);
  }

  function samePoint(a, b) {
    if (a.guid && b.guid && a.guid === b.guid) return true;
    return Math.abs(a.lat - b.lat) < 1e-10 && Math.abs(a.lng - b.lng) < 1e-10;
  }

  function orientation(a, b, c) {
    return (b.lng - a.lng) * (c.lat - a.lat) - (b.lat - a.lat) * (c.lng - a.lng);
  }

  function signedArea2(a, b, c) {
    return orientation(a, b, c);
  }

  function buildResult(sequence, basis, start, end) {
    var totalPathDistance = 0;
    var totalAbsDeviation = 0;
    var totalAngle = 0;
    var maxGap = 0;

    sequence.forEach(function (portal, idx) {
      totalAbsDeviation += Math.abs(portal.crossTrack);
      portal.distanceFromPrevious = 0;
      portal.segmentAngle = 0;

      if (idx > 0) {
        var prev = sequence[idx - 1];
        var dist = distanceMeters(prev, portal);
        var angle = segmentAngleDegrees(prev, portal, basis);
        portal.distanceFromPrevious = dist;
        portal.segmentAngle = angle;
        totalPathDistance += dist;
        totalAngle += angle;
        maxGap = Math.max(maxGap, dist);
      }
    });

    return {
      sequence: sequence,
      start: start,
      end: end,
      basis: basis,
      portalCount: sequence.length,
      totalPathDistance: totalPathDistance,
      totalAbsDeviation: totalAbsDeviation,
      totalAngle: totalAngle,
      maxGap: maxGap
    };
  }

  function compareResults(a, b) {
    if (a.portalCount !== b.portalCount) return a.portalCount - b.portalCount;
    if (a.totalPathDistance !== b.totalPathDistance) return b.totalPathDistance - a.totalPathDistance;
    if (a.totalAbsDeviation !== b.totalAbsDeviation) return b.totalAbsDeviation - a.totalAbsDeviation;
    if (a.maxGap !== b.maxGap) return b.maxGap - a.maxGap;
    return b.totalAngle - a.totalAngle;
  }

  function drawResult(result) {
    plugin.layerGroup.clearLayers();
    if (!result) return;

    var spineLatLngs = result.sequence.map(function (portal) {
      return portal.latLng;
    });

    if (plugin.settings.showCorridor) {
      drawCorridor(result);
    }

    if (plugin.settings.showRejectedPortals) {
      drawRejectedPortals(result);
    }

    if (result.anchors) {
      drawAnchors(result);
    }

    w.L.polyline([result.start.latLng, result.end.latLng], {
      color: '#f7d154',
      weight: 2,
      opacity: 0.8,
      dashArray: '8,8',
      interactive: false
    }).addTo(plugin.layerGroup);

    w.L.polyline(spineLatLngs, {
      color: '#ff4f7b',
      weight: 5,
      opacity: 0.95,
      interactive: false
    }).addTo(plugin.layerGroup);

    result.sequence.forEach(function (portal, idx) {
      w.L.circleMarker(portal.latLng, {
        radius: idx === 0 || idx === result.sequence.length - 1 ? 7 : 5,
        color: '#ffffff',
        weight: 2,
        fillColor: idx === 0 ? '#2bd96b' : (idx === result.sequence.length - 1 ? '#45a3ff' : '#ff4f7b'),
        fillOpacity: 0.95,
        interactive: false,
        bubblingMouseEvents: false
      }).addTo(plugin.layerGroup);
    });
  }

  function drawAnchors(result) {
    var anchors = result.anchors;

    w.L.polyline([anchors.a.latLng, anchors.b.latLng], {
      color: '#ffffff',
      weight: 3,
      opacity: 0.9,
      dashArray: '4,8',
      interactive: false
    }).addTo(plugin.layerGroup);

    drawAnchorMarker(anchors.a, 'A', '#2bd96b');
    drawAnchorMarker(anchors.b, 'B', '#45a3ff');

    if (!plugin.settings.showAnchorLinks) return;

    result.sequence.forEach(function (portal) {
      w.L.polyline([anchors.a.latLng, portal.latLng], {
        color: '#2bd96b',
        weight: 1.5,
        opacity: 0.45,
        interactive: false
      }).addTo(plugin.layerGroup);
      w.L.polyline([anchors.b.latLng, portal.latLng], {
        color: '#45a3ff',
        weight: 1.5,
        opacity: 0.45,
        interactive: false
      }).addTo(plugin.layerGroup);
    });
  }

  function drawAnchorMarker(anchor, label, color) {
    w.L.circleMarker(anchor.latLng, {
      radius: 9,
      color: '#ffffff',
      weight: 2,
      fillColor: color,
      fillOpacity: 0.95,
      interactive: false,
      bubblingMouseEvents: false
    }).addTo(plugin.layerGroup);
  }

  function drawRejectedPortals(result) {
    var rejected = classifyRejectedPortals(result);

    rejected.forEach(function (item) {
      var style = rejectedStyle(item.reason);
      w.L.circleMarker(item.portal.latLng, {
        radius: 4,
        color: style.color,
        weight: 2,
        fillColor: style.color,
        fillOpacity: 0.55,
        opacity: 0.95,
        interactive: false,
        bubblingMouseEvents: false
      }).addTo(plugin.layerGroup);
    });
  }

  function classifyRejectedPortals(result) {
    var selected = {};
    var rejected = [];
    var basis = result.basis;
    var sequence = result.sequence;
    var maxDeviation = plugin.settings.maxDeviationMeters;
    var maxAngle = plugin.settings.maxSegmentAngleDegrees;
    var maxSpinePortals = plugin.settings.maxSpinePortals;

    sequence.forEach(function (portal) {
      selected[portal.guid] = true;
    });

    (result.visiblePortals || []).forEach(function (portal) {
      if (selected[portal.guid]) return;

      var projected = projectPortal(portal, basis);
      var reason;
      var detail;

      if (projected.alongTrack < 0 || projected.alongTrack > basis.lengthMeters) {
        reason = 'span';
        detail = 'Outside the start/end span for the selected center line.';
      } else if (Math.abs(projected.crossTrack) > maxDeviation) {
        reason = 'distance';
        detail = Math.abs(projected.crossTrack).toFixed(1) + ' m from center line; max is ' + maxDeviation + ' m.';
      } else if (result.anchors && !formsUsableTriangle(result.anchors.a, result.anchors.b, projected)) {
        reason = 'triangle';
        detail = 'It cannot form a usable triangle with the two anchors.';
      } else if (result.anchors && !canInsertPortalWithAnchors(projected, sequence, basis, maxAngle, result.anchors)) {
        reason = 'crossing';
        detail = 'Adding it would cross planned herringbone links from the anchors.';
      } else if (maxSpinePortals > 0 && sequence.length >= maxSpinePortals && canInsertPortal(projected, sequence, basis, maxAngle)) {
        reason = 'max';
        detail = 'It fits the rules, but the max spine portal limit is already reached.';
      } else if (!canInsertPortal(projected, sequence, basis, maxAngle)) {
        reason = 'angle';
        detail = 'Adding it would force at least one segment past ' + maxAngle + ' degrees or break ordering.';
      } else {
        reason = 'tie';
        detail = 'It fits locally, but was not in the best ranked subsequence.';
      }

      rejected.push({
        portal: portal,
        reason: reason,
        detail: detail
      });
    });

    return rejected;
  }

  function rejectedStyle(reason) {
    var styles = {
      distance: { color: '#ff9f1c', label: 'distance' },
      angle: { color: '#a855f7', label: 'angle/order' },
      span: { color: '#94a3b8', label: 'outside span' },
      crossing: { color: '#111827', label: 'anchor crossing' },
      triangle: { color: '#facc15', label: 'triangle' },
      max: { color: '#22d3ee', label: 'max portals' },
      tie: { color: '#f43f5e', label: 'tie-break' }
    };
    return styles[reason] || styles.tie;
  }

  function canInsertPortal(portal, sequence, basis, maxAngle) {
    for (var i = 0; i < sequence.length - 1; i++) {
      var before = sequence[i];
      var after = sequence[i + 1];
      if (portal.alongTrack <= before.alongTrack || portal.alongTrack >= after.alongTrack) continue;
      if (isSegmentValid(before, portal, basis, maxAngle) && isSegmentValid(portal, after, basis, maxAngle)) return true;
    }

    return false;
  }

  function canInsertPortalWithAnchors(portal, sequence, basis, maxAngle, anchors) {
    for (var i = 0; i < sequence.length - 1; i++) {
      var before = sequence[i];
      var after = sequence[i + 1];
      if (portal.alongTrack <= before.alongTrack || portal.alongTrack >= after.alongTrack) continue;
      if (!isSegmentValid(before, portal, basis, maxAngle) || !isSegmentValid(portal, after, basis, maxAngle)) continue;

      var path = sequence.slice(0, i + 1).concat(sequence.slice(i + 1));
      if (canAppendWithoutAnchorCrossing(portal, path.map(function (_, idx) { return idx; }), path, anchors)) return true;
    }

    return false;
  }

  function drawCorridor(result) {
    var basis = result.basis;
    var offset = plugin.settings.maxDeviationMeters;
    var leftStart = localToLatLng(-basis.unitY * offset, basis.unitX * offset, basis);
    var leftEnd = localToLatLng(basis.unitX * basis.lengthMeters - basis.unitY * offset, basis.unitY * basis.lengthMeters + basis.unitX * offset, basis);
    var rightEnd = localToLatLng(basis.unitX * basis.lengthMeters + basis.unitY * offset, basis.unitY * basis.lengthMeters - basis.unitX * offset, basis);
    var rightStart = localToLatLng(basis.unitY * offset, -basis.unitX * offset, basis);

    var corridor = w.L.polygon([leftStart, leftEnd, rightEnd, rightStart], {
      color: '#20d5ff',
      weight: 2,
      opacity: 0.85,
      dashArray: '6,6',
      fillColor: '#20d5ff',
      fillOpacity: 0.16,
      interactive: false
    }).addTo(plugin.layerGroup);

    if (corridor.bringToBack) corridor.bringToBack();
  }

  function updateProcessingStatus(visiblePortalCount) {
    $('#hbsp-status').text('Herringbone Planner: processing ' + visiblePortalCount + ' visible portals...');
  }

  function updateStatus(result, visiblePortalCount, tooManyPortals, timedOut) {
    var text;
    if (tooManyPortals) {
      text = visiblePortalCount + ' visible portals exceeds limit of ' + plugin.settings.maxVisiblePortals + '; zoom in or raise the limit';
    } else if (timedOut && result) {
      text = 'Timed out after ' + plugin.settings.maxExecutionSeconds + 's; showing best found: ' + result.portalCount + ' portal plan, ' + Math.round(result.totalPathDistance) + ' m route';
    } else if (timedOut) {
      text = 'Timed out after ' + plugin.settings.maxExecutionSeconds + 's with no valid plan found';
    } else {
      text = result
        ? result.portalCount + ' portal plan, ' + Math.round(result.totalPathDistance) + ' m route from ' + visiblePortalCount + ' visible portals'
        : 'No valid spine found from ' + visiblePortalCount + ' visible portals';
    }
    $('#hbsp-status').text(text);
  }

  function setDialogStatus(text) {
    $('#hbsp-dialog-status').text(text);
  }

  function updateDialogAnchorLabels() {
    $('#hbsp-anchor-a-label').text('Anchor A: ' + formatAnchorLabel(plugin.settings.anchorA, 'A'));
    $('#hbsp-anchor-b-label').text('Anchor B: ' + formatAnchorLabel(plugin.settings.anchorB, 'B'));
  }

  function formatResultSummary(result, timedOut) {
    if (!result && timedOut) return 'Timed out after ' + plugin.settings.maxExecutionSeconds + ' seconds with no valid spine found.';
    if (!result) return 'No valid spine found yet.';

    var prefix = timedOut || result.timedOut ? 'Timed out; showing best found: ' : '';
    var elapsed = result.elapsedMs ? ', ' + (result.elapsedMs / 1000).toFixed(1) + ' s processing' : '';
    return prefix + result.portalCount + ' portals. Total walked distance: ' + formatDistance(totalWalkDistance(result)) + '. ' + Math.round(result.totalAbsDeviation) + ' m total deviation' + elapsed + '.';
  }

  function formatDistance(meters) {
    if (meters >= 1000) return (meters / 1000).toFixed(2) + ' km';
    return Math.round(meters) + ' m';
  }

  function formatAnchorLabel(anchor, label) {
    if (!anchor) return 'not set';
    var keyCount = getAnchorKeyCount(label);
    return anchor.name + ', ' + keyCount + ' ' + pluralize(keyCount, 'key', 'keys');
  }

  function getAnchorKeyCount(label) {
    var spineCount = 0;
    if (plugin.lastResult && plugin.lastResult.sequence) spineCount = plugin.lastResult.sequence.length;
    else if (plugin.processingResult && plugin.processingResult.sequence) spineCount = plugin.processingResult.sequence.length;
    else if (plugin.previousKeyCount) spineCount = plugin.previousKeyCount;

    if (label === 'A' && plugin.settings.anchorA && plugin.settings.anchorB) return spineCount + 1;
    return spineCount;
  }

  function rememberKeyCount(result) {
    if (!result || !result.sequence) return;
    plugin.previousKeyCount = result.sequence.length;
  }

  function pluralize(count, singular, plural) {
    return count === 1 ? singular : plural;
  }

  function injectCss() {
    $('<style>')
      .prop('type', 'text/css')
      .html([
        '.hbsp-control a{font-weight:700;font-size:13px;line-height:26px;text-align:center;color:#222;}',
        '#hbsp-status{padding:3px 7px;color:#fff;background:rgba(0,0,0,.65);font-size:11px;max-width:260px;}',
        '.hbsp-control,.hbsp-control a,#hbsp-status{pointer-events:auto;}',
        '.hbsp-dialog label{display:block;margin:0 0 10px;}',
        '.hbsp-dialog input[type=number]{display:block;box-sizing:border-box;width:100%;margin-top:4px;}',
        '.hbsp-dialog .hbsp-check{display:flex;gap:7px;align-items:center;}',
        '.hbsp-dialog .hbsp-check input{margin:0;}',
        '.hbsp-dialog .hbsp-help{margin:-6px 0 10px;color:#aaa;font-size:11px;line-height:1.35;}',
        '.hbsp-actions{display:flex;gap:8px;margin-top:12px;}',
        '#hbsp-dialog-status{margin-top:8px;font-size:12px;}'
      ].join(''))
      .appendTo(doc.head);

    var status = w.L.control({ position: 'bottomleft' });
    status.onAdd = function () {
      var div = w.L.DomUtil.create('div', '');
      div.id = 'hbsp-status';
      div.textContent = 'Herringbone Planner: waiting for portals';
      return div;
    };
    status.addTo(w.map);
  }

  function toLocalMeters(portal, basis) {
    return {
      x: (portal.lng - basis.originLng) * basis.metersPerDegLng,
      y: (portal.lat - basis.originLat) * basis.metersPerDegLat
    };
  }

  function localToLatLng(x, y, basis) {
    return w.L.latLng(
      basis.originLat + y / basis.metersPerDegLat,
      basis.originLng + x / basis.metersPerDegLng
    );
  }

  function distanceMeters(a, b) {
    if (w.map && w.map.distance) return w.map.distance(a.latLng, b.latLng);
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function segmentAngleDegrees(a, b, basis) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    var length = Math.sqrt(dx * dx + dy * dy);
    if (!isFinite(length) || length <= 0) return 0;
    var forward = dx * basis.unitX + dy * basis.unitY;
    var cos = Math.max(-1, Math.min(1, forward / length));
    return radToDeg(Math.acos(cos));
  }

  function loadSettings() {
    try {
      return Object.assign({}, DEFAULT_SETTINGS, JSON.parse(w.localStorage[STORAGE_KEY] || '{}'));
    } catch (e) {
      return Object.assign({}, DEFAULT_SETTINGS);
    }
  }

  function saveSettings() {
    w.localStorage[STORAGE_KEY] = JSON.stringify(plugin.settings);
  }

  function clampNumber(value, min, max, fallback) {
    var num = Number(value);
    if (!isFinite(num)) return fallback;
    return Math.max(min, Math.min(max, num));
  }

  function csvCell(value) {
    var text = value == null ? '' : String(value);
    return '"' + text.replace(/"/g, '""') + '"';
  }

  function downloadText(filename, text, mimeType) {
    var blob = new w.Blob([text], { type: mimeType + ';charset=utf-8' });
    var url = w.URL.createObjectURL(blob);
    var a = doc.createElement('a');
    a.href = url;
    a.download = filename;
    doc.body.appendChild(a);
    a.click();
    doc.body.removeChild(a);
    w.setTimeout(function () {
      w.URL.revokeObjectURL(url);
    }, 1000);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[ch];
    });
  }

  function degToRad(deg) {
    return deg * Math.PI / 180;
  }

  function radToDeg(rad) {
    return rad * 180 / Math.PI;
  }

  setup.info = plugin_info;
  if (!w.bootPlugins) w.bootPlugins = [];
  w.bootPlugins.push(setup);
  if (w.iitcLoaded && typeof setup === 'function') setup();
}

var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
  info.script = {
    version: GM_info.script.version,
    name: GM_info.script.name,
    description: GM_info.script.description
  };
}
wrapper(info, typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);
