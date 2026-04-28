// ==UserScript==
// @author          MikeDiehn
// @id              portal-route@MikeDiehn
// @name            Portal Route
// @category        Navigate
// @version         0.3.0-dev
// @namespace       https://github.com/mdiehn/iitc-plugin-portal-route
// @updateURL       https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/MikeDiehn/portal-route.meta.js
// @downloadURL     https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/MikeDiehn/portal-route.user.js
// @description     Route planning through selected portals with segment drive times, stop-time accounting, and Google Maps export.
// @homepageURL     https://github.com/mdiehn/iitc-plugin-portal-route
// @issueTracker    https://github.com/mdiehn/iitc-plugin-portal-route/issues
// @include         https://intel.ingress.com/*
// @include         http://intel.ingress.com/*
// @match           https://intel.ingress.com/*
// @match           http://intel.ingress.com/*
// @grant           none
// ==/UserScript==


function wrapper(plugin_info) {
  if (typeof window.plugin !== 'function') window.plugin = function() {};
  window.plugin.portalRoute = window.plugin.portalRoute || {};

  var pr = window.plugin.portalRoute;

  pr.CSS = `
.portal-route-mini-control {
  margin-top: 10px;
}

.portal-route-mini-control a {
  text-align: center;
  font-size: 12px;
  font-weight: bold;
}

.portal-route-dialog-content {
  width: 100%;
  max-width: 100%;
  overflow-x: visible;
  font-size: 11px;
  line-height: 1.25;
}

.portal-route-dialog-content button,
.portal-route-dialog-content input {
  font-size: 11px;
}

.portal-route-mini-control .portal-route-mini-remove {
  color: #c00000;
}

.portal-route-dialog-content * {
  box-sizing: border-box;
}

.portal-route-body p {
  margin: 0 0 6px;
}

.portal-route-summary {
  margin-top: 4px;
}

.portal-route-setting {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 8px 0 8px;
}

.portal-route-setting input {
  width: 4.5em;
}

.portal-route-checkbox-setting {
  align-items: center;
}

.portal-route-checkbox-setting input {
  width: auto;
}

.portal-route-empty {
  margin: 8px 0 10px;
}

.portal-route-waypoints-list {
  display: block;
  width: 100%;
  max-width: 100%;
  margin: 6px 0 8px;
  overflow: visible;
}

.portal-route-waypoint-row {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) max-content 42px 22px 22px 22px;
  gap: 2px;
  align-items: center;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: visible;
}

.portal-route-waypoint-row + .portal-route-waypoint-row {
  margin-top: 2px;
}

.portal-route-selected-stop {
  background: rgba(255, 216, 0, 0.10);
  border-radius: 4px;
}

.portal-route-waypoint-num,
.portal-route-waypoint-name-cell,
.portal-route-leg-cell,
.portal-route-wait-cell,
.portal-route-row-action {
  min-width: 0;
  border: 0 !important;
  outline: 0 !important;
  background: transparent !important;
}

.portal-route-waypoint-num {
  width: 20px;
  text-align: center;
}

.portal-route-waypoint-name-cell {
  overflow: hidden;
}

.portal-route-leg-cell {
  min-width: max-content;
  padding-right: 14px;
  text-align: right;
  white-space: nowrap;
  overflow: visible;
}

.portal-route-wait-cell {
  width: 42px;
  text-align: center;
}

.portal-route-row-action {
  width: 22px;
  text-align: center;
  overflow: visible;
}

.portal-route-waypoint-name {
  display: block;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
  outline: 0 !important;
  box-shadow: none !important;
  background: transparent !important;
  color: inherit !important;
  text-align: left;
  font-weight: bold;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
}


.portal-route-waypoint-name-input {
  height: 18px;
  line-height: 18px;
}

.portal-route-waypoint-name:hover,
.portal-route-waypoint-name:focus,
.portal-route-waypoint-name:active {
  border: 0 !important;
  outline: 0 !important;
  box-shadow: none !important;
  background: transparent !important;
  color: inherit !important;
}

.portal-route-wait-input {
  width: 42px;
  padding: 1px 2px;
}

.portal-route-row-button {
  width: 22px !important;
  min-width: 22px !important;
  max-width: 22px !important;
  height: 20px;
  min-height: 20px;
  padding: 0 !important;
  border: 0 !important;
  background: transparent !important;
  color: inherit !important;
  text-align: center;
  line-height: 20px;
  font-size: 14px !important;
  font-weight: bold !important;
}

.portal-route-row-button:disabled {
  opacity: 0.35;
}

.portal-route-remove-stop-button {
  color: #ff8080 !important;
}

.portal-route-stop-num,
.portal-route-stop-label span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  min-width: 16px;
  height: 16px;
  min-height: 16px;
  padding: 0;
  border-radius: 50%;
  background: #ffd800;
  color: #111;
  font-weight: bold;
  font-size: 10px;
  line-height: 16px;
}

button.portal-route-stop-num,
button.portal-route-waypoint-badge {
  width: 16px !important;
  min-width: 16px !important;
  height: 16px !important;
  min-height: 16px !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 50% !important;
  background: #ffd800 !important;
  color: #111 !important;
  cursor: pointer;
  line-height: 16px !important;
}

.portal-route-leg {
  display: block;
  width: max-content;
  overflow: visible;
  text-overflow: clip;
  color: inherit;
  opacity: 1;
  font: inherit;
  font-weight: bold;
}

.portal-route-leg-stale,
.portal-route-leg-empty {
  opacity: 0.45;
}

.portal-route-stale {
  margin-top: 4px;
  opacity: 0.85;
  font-size: 10px;
  font-style: italic;
}


.portal-route-active-action {
  font-weight: bold;
  outline: 1px solid rgba(255, 216, 0, 0.65) !important;
}

.portal-route-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 8px;
}

.portal-route-footer-actions {
  justify-content: flex-end;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  margin-top: 10px;
  padding-top: 7px;
}

.portal-route-bottom-summary {
  margin-top: 8px;
  opacity: 0.9;
}

.portal-route-version {
  margin-top: 6px;
  opacity: 0.7;
  font-size: 10px;
  text-align: right;
}

.portal-route-totals {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-top: 8px;
}

.portal-route-totals div {
  padding: 5px;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.portal-route-totals span,
.portal-route-totals strong {
  display: block;
}

.portal-route-message {
  display: none;
  margin-top: 8px;
  padding: 7px;
  border: 1px solid #ffd800;
  background: rgba(0, 0, 0, 0.22);
}

.portal-route-message-visible {
  display: block;
}

.portal-route-busy {
  opacity: 0.82;
}

.portal-route-stop-tooltip,
.portal-route-stop-tooltip * {
  pointer-events: none;
}

.portal-route-stop-label {
  border: 0;
  background: transparent;
}

.portal-route-stop-label span {
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.65);
}

.portal-route-stop-label-selected span {
  outline: 2px solid #fff;
  outline-offset: 1px;
}

.portal-route-map-point-marker {
  border: 0;
  background: transparent;
}

.portal-route-map-point-marker span {
  display: block;
  width: 18px;
  height: 18px;
  box-sizing: border-box;
  border: 2px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  background: rgba(80, 170, 255, 0.85);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
  cursor: pointer;
}

.portal-route-map-point-marker-selected span {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.portal-route-segment-time-label {
  border: 0;
  background: transparent;
  pointer-events: none;
}

.portal-route-segment-time-label span {
  display: inline-block;
  padding: 2px 5px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.72);
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  line-height: 1.2;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.65);
}

.portal-route-stop-tooltip {
  font-size: 11px;
}

.portal-route-portal-action {
  margin-top: 8px;
}


.ui-dialog.portal-route-dialog {
  max-width: calc(100vw - 20px) !important;
}

.ui-dialog.portal-route-dialog .ui-dialog-content {
  box-sizing: border-box !important;
  overflow-x: visible !important;
}

.portal-route-waypoints-list,
.portal-route-waypoint-row,
.portal-route-waypoint-row > div,
.portal-route-waypoint-name-cell,
.portal-route-waypoint-name-cell * {
  border-color: transparent !important;
}

.portal-route-waypoint-name,
button.portal-route-waypoint-name,
.ui-dialog .portal-route-waypoint-name,
.ui-dialog button.portal-route-waypoint-name {
  border: none !important;
  border-width: 0 !important;
  outline: none !important;
  box-shadow: none !important;
  background: transparent !important;
  background-image: none !important;
}

input.portal-route-waypoint-name-input,
.ui-dialog input.portal-route-waypoint-name-input {
  height: 20px;
  line-height: 18px;
  padding: 1px 4px !important;
  border: 1px solid rgba(255, 216, 0, 0.35) !important;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08) !important;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25) !important;
  cursor: text;
}

input.portal-route-waypoint-name-input:hover,
input.portal-route-waypoint-name-input:focus,
.ui-dialog input.portal-route-waypoint-name-input:hover,
.ui-dialog input.portal-route-waypoint-name-input:focus {
  border-color: rgba(255, 216, 0, 0.70) !important;
  background: rgba(255, 255, 255, 0.12) !important;
  outline: none !important;
}

@media (max-width: 640px) {
  .ui-dialog.portal-route-dialog {
    position: fixed !important;
    left: 8px !important;
    right: 8px !important;
    top: 50% !important;
    bottom: auto !important;
    width: auto !important;
    max-width: calc(100vw - 16px) !important;
    max-height: calc(100dvh - 24px) !important;
    transform: translateY(-50%) !important;
  }

  .ui-dialog.portal-route-dialog .ui-dialog-content {
    width: auto !important;
    max-height: calc(100dvh - 90px) !important;
    overflow-y: auto !important;
    overflow-x: visible !important;
    padding-left: 8px !important;
    padding-right: 8px !important;
    padding-bottom: 8px !important;
  }

  .portal-route-waypoint-row {
    grid-template-columns: 18px minmax(0, 1fr) max-content 38px 20px 20px 20px;
    gap: 1px;
  }

  .portal-route-waypoint-num {
    width: 18px;
  }

  .portal-route-leg-cell {
    padding-right: 9px;
  }

  .portal-route-wait-cell {
    width: 38px;
  }

  .portal-route-wait-input {
    width: 38px;
  }

  .portal-route-row-action {
    width: 20px;
  }

  .portal-route-row-button {
    width: 20px !important;
    min-width: 20px !important;
    max-width: 20px !important;
  }

}
`;

  pr.ID = 'portal-route';
  pr.NAME = 'Portal Route';
  pr.VERSION = '0.3.0-dev';
  pr.SHOW_VERSION_IN_PANEL = true;

  pr.DOM_IDS = {
    css: 'iitc-plugin-portal-route-css',
    dialog: 'iitc-plugin-portal-route-dialog',
    dialogContent: 'iitc-plugin-portal-route-dialog-content',
    miniControl: 'iitc-plugin-portal-route-mini-control',
    toolboxLink: 'iitc-plugin-portal-route-toolbox-link'
  };

  pr.STORAGE_KEYS = {
    stops: 'iitc-portal-route-stops',
    settings: 'iitc-portal-route-settings',
    panelOpen: 'iitc-portal-route-panel-open',
    panelPosition: 'iitc-portal-route-panel-position',
    route: 'iitc-portal-route-route',
    routeDirty: 'iitc-portal-route-route-dirty'
  };

  pr.DEFAULT_SETTINGS = {
    defaultStopMinutes: 5,
    includeReturnToStart: false,
    showSegmentTimesOnMap: false
  };

  pr.state = {
    stops: [],
    route: null,
    routeDirty: false,
    settings: Object.assign({}, pr.DEFAULT_SETTINGS),
    layers: {
      labels: null,
      routeLine: null,
      segmentLabels: null
    },
    panelOpen: false,
    panelView: 'main',
    addPointMode: false,
    selectedMapPointIndex: null,
    miniControl: null
  };

  pr.getEffectiveStopMinutes = function(stop) {
    if (stop && typeof stop.stopMinutes === 'number' && !Number.isNaN(stop.stopMinutes)) {
      return stop.stopMinutes;
    }
    return pr.state.settings.defaultStopMinutes;
  };

  pr.loadState = function() {
    try {
      var rawSettings = localStorage.getItem(pr.STORAGE_KEYS.settings);
      if (rawSettings) {
        pr.state.settings = Object.assign({}, pr.DEFAULT_SETTINGS, JSON.parse(rawSettings));
      }

      var rawStops = localStorage.getItem(pr.STORAGE_KEYS.stops);
      if (rawStops) {
        var stops = JSON.parse(rawStops);
        if (Array.isArray(stops)) {
          pr.state.stops = stops.map(function(stop) {
            if (!stop) return stop;
            return Object.assign({}, stop, {
              type: stop.type || (stop.guid ? 'portal' : 'map')
            });
          });
        }
      }

      var rawPanelOpen = localStorage.getItem(pr.STORAGE_KEYS.panelOpen);
      if (rawPanelOpen !== null) pr.state.panelOpen = rawPanelOpen === 'true';

      var rawRoute = localStorage.getItem(pr.STORAGE_KEYS.route);
      if (rawRoute) {
        var route = JSON.parse(rawRoute);
        if (route && Array.isArray(route.legs)) pr.state.route = route;
      }

      var rawRouteDirty = localStorage.getItem(pr.STORAGE_KEYS.routeDirty);
      if (rawRouteDirty !== null) pr.state.routeDirty = rawRouteDirty === 'true';
    } catch (e) {
      console.warn('Portal Route: failed to load saved state', e);
    }
  };

  pr.saveSettings = function() {
    localStorage.setItem(pr.STORAGE_KEYS.settings, JSON.stringify(pr.state.settings));
  };

  pr.saveStops = function() {
    localStorage.setItem(pr.STORAGE_KEYS.stops, JSON.stringify(pr.state.stops));
  };

  pr.savePanelOpen = function() {
    localStorage.setItem(pr.STORAGE_KEYS.panelOpen, String(pr.state.panelOpen));
  };


  pr.saveRoute = function() {
    if (pr.state.route) {
      localStorage.setItem(pr.STORAGE_KEYS.route, JSON.stringify(pr.state.route));
    } else {
      localStorage.removeItem(pr.STORAGE_KEYS.route);
    }
    localStorage.setItem(pr.STORAGE_KEYS.routeDirty, String(!!pr.state.routeDirty));
  };

  pr.clearSavedRoute = function() {
    localStorage.removeItem(pr.STORAGE_KEYS.route);
    localStorage.removeItem(pr.STORAGE_KEYS.routeDirty);
  };

  pr.formatDuration = function(seconds) {
    seconds = Math.max(0, Math.round(seconds || 0));
    var minutes = Math.round(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var mins = minutes % 60;

    if (hours > 0 && mins > 0) return hours + ' hr ' + mins + ' min';
    if (hours > 0) return hours + ' hr';
    return minutes + ' min';
  };

  pr.formatDistance = function(meters) {
    meters = Math.max(0, Number(meters || 0));
    var miles = meters / 1609.344;
    if (miles >= 10) return miles.toFixed(0) + ' mi';
    return miles.toFixed(1) + ' mi';
  };

  pr.portalToStop = function(guid) {
    var portal = guid && window.portals && window.portals[guid];
    if (!portal || !portal.getLatLng) return null;

    var latlng = portal.getLatLng();
    var data = portal.options && portal.options.data ? portal.options.data : {};

    return {
      guid: guid,
      title: data.title || data.name || guid,
      lat: latlng.lat,
      lng: latlng.lng
    };
  };

  pr.clearIitcPortalSelection = function() {
    var cleared = false;

    if (typeof window.renderPortalDetails === 'function') {
      try {
        window.renderPortalDetails(null);
        cleared = true;
      } catch (e) {
        console.warn('Portal Route: unable to clear IITC portal details via renderPortalDetails', e);
      }
    }

    if (!cleared && typeof window.selectPortal === 'function') {
      try {
        window.selectPortal(null, 'portal-route-map-point');
        cleared = true;
      } catch (e2) {
        console.warn('Portal Route: unable to clear IITC portal selection via selectPortal', e2);
      }
    }

    if (!cleared) {
      window.selectedPortal = null;
    }

    var details = document.getElementById('portaldetails');
    if (details) details.innerHTML = '';

    if (typeof window.setPortalIndicators === 'function') {
      try {
        window.setPortalIndicators(null);
      } catch (e3) {
        console.warn('Portal Route: unable to clear IITC portal indicators', e3);
      }
    }
  };

  pr.addSelectedPortal = function() {
    var guid = window.selectedPortal;
    var stop = pr.portalToStop(guid);
    if (!stop) {
      pr.showMessage('No selected portal found.');
      return;
    }
    pr.addStop(stop);
  };

  pr.injectPortalDetailsAction = function() {
    var container = document.querySelector('#portaldetails .linkdetails') || document.querySelector('#portaldetails');
    if (!container || container.querySelector('.portal-route-add-link')) return;

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'portal-route-add-link';
    link.textContent = 'Add to Portal Route';
    link.addEventListener('click', function(ev) {
      ev.preventDefault();
      pr.addSelectedPortal();
    });

    var wrapper = document.createElement('div');
    wrapper.className = 'portal-route-portal-action';
    wrapper.appendChild(link);
    container.appendChild(wrapper);
  };

  pr.markRouteStale = function(options) {
    options = options || {};
    var hadRouteState = !!pr.state.route || !!pr.state.routeDirty;
    pr.state.routeDirty = hadRouteState;

    if (options.clearRoute) {
      pr.state.route = null;
      pr.clearRouteLine();
    } else if (pr.state.route && pr.state.route.legs) {
      pr.state.route.totals = pr.calculateTotals(pr.state.route.legs);
    }

    pr.saveRoute();
  };

  pr.markRouteCurrent = function() {
    pr.state.routeDirty = false;
    pr.saveRoute();
  };

  pr.addStop = function(stop) {
    if (!stop || typeof stop.lat !== 'number' || typeof stop.lng !== 'number') return;

    var stopType = stop.type || (stop.guid ? 'portal' : 'map');
    var title = stop.title || (stopType === 'map' ? 'Map point' : 'Unnamed portal');

    if (stop.guid && pr.state.stops.some(function(existing) { return existing.guid === stop.guid; })) {
      pr.showMessage('Already in route: ' + title);
      return;
    }

    pr.state.stops.push({
      guid: stop.guid || null,
      type: stopType,
      title: title,
      lat: stop.lat,
      lng: stop.lng,
      stopMinutes: typeof stop.stopMinutes === 'number' ? stop.stopMinutes : null
    });

    if (stopType === 'map') {
      pr.state.selectedMapPointIndex = pr.state.stops.length - 1;
      if (pr.clearIitcPortalSelection) pr.clearIitcPortalSelection();
    }

    pr.markRouteStale({ clearRoute: true });
    pr.saveStops();
    pr.redrawLabels();
    pr.renderPanel();
    pr.renderMiniControl();
  };

  pr.nextMapPointTitle = function() {
    var count = pr.state.stops.filter(function(stop) {
      return stop && stop.type === 'map';
    }).length + 1;
    return 'Map point ' + count;
  };

  pr.addMapPointAtLatLng = function(latlng) {
    if (!latlng || typeof latlng.lat !== 'number' || typeof latlng.lng !== 'number') return;

    pr.addStop({
      type: 'map',
      title: pr.nextMapPointTitle(),
      lat: latlng.lat,
      lng: latlng.lng
    });
  };

  pr.setAddPointMode = function(enabled) {
    pr.state.addPointMode = !!enabled;
    pr.renderPanel();
    pr.renderMiniControl();
    pr.showMessage(pr.state.addPointMode ? 'Tap the map to add a point.' : 'Add point canceled.');
  };

  pr.removeStop = function(index) {
    if (index < 0 || index >= pr.state.stops.length) return;

    if (pr.state.selectedMapPointIndex === index) {
      pr.state.selectedMapPointIndex = null;
    } else if (pr.state.selectedMapPointIndex > index) {
      pr.state.selectedMapPointIndex -= 1;
    }

    pr.state.stops.splice(index, 1);
    pr.markRouteStale({ clearRoute: true });
    pr.saveStops();
    pr.redrawLabels();
    pr.renderPanel();
    pr.renderMiniControl();
  };

  pr.clearStops = function() {
    pr.state.stops = [];
    pr.state.route = null;
    pr.state.routeDirty = false;
    pr.state.selectedMapPointIndex = null;
    pr.saveStops();
    pr.saveRoute();
    pr.clearRouteLine();
    pr.redrawLabels();
    pr.renderPanel();
    pr.renderMiniControl();
  };

  pr.moveStop = function(fromIndex, toIndex) {
    if (fromIndex < 0 || fromIndex >= pr.state.stops.length) return;
    if (toIndex < 0 || toIndex >= pr.state.stops.length) return;
    if (fromIndex === toIndex) return;

    var selectedIndex = pr.state.selectedMapPointIndex;
    var item = pr.state.stops.splice(fromIndex, 1)[0];
    pr.state.stops.splice(toIndex, 0, item);

    if (selectedIndex === fromIndex) {
      pr.state.selectedMapPointIndex = toIndex;
    } else if (selectedIndex !== null && selectedIndex !== undefined) {
      if (fromIndex < selectedIndex && selectedIndex <= toIndex) {
        pr.state.selectedMapPointIndex -= 1;
      } else if (toIndex <= selectedIndex && selectedIndex < fromIndex) {
        pr.state.selectedMapPointIndex += 1;
      }
    }

    pr.markRouteStale({ clearRoute: true });
    pr.saveStops();
    pr.redrawLabels();
    pr.renderPanel();
    pr.renderMiniControl();
  };


  pr.setStopTitle = function(index, title) {
    if (index < 0 || index >= pr.state.stops.length) return;

    var stop = pr.state.stops[index];
    if (!stop || stop.type !== 'map') return;

    var cleanTitle = String(title == null ? '' : title).trim();
    if (!cleanTitle) cleanTitle = pr.nextMapPointTitle();

    stop.title = cleanTitle;
    pr.saveStops();
    pr.redrawLabels();
    pr.redrawSegmentTimeLabels();
    pr.renderPanel();
  };


  pr.setStopMinutes = function(index, minutes) {
    if (index < 0 || index >= pr.state.stops.length) return;
    if (typeof minutes !== 'number' || !isFinite(minutes) || minutes < 0) return;

    pr.state.stops[index].stopMinutes = Math.round(minutes);
    pr.markRouteStale();
    pr.saveStops();
    pr.renderPanel();
  };

  pr.parseDurationMinutes = function(text) {
    var match = String(text == null ? '' : text).trim().toLowerCase().match(/^(\d+(?:\.\d+)?)\s*([mhd]?)$/);
    if (!match) return null;

    var value = Number(match[1]);
    var unit = match[2] || 'm';

    if (!isFinite(value) || value < 0) return null;

    if (unit === 'm') return Math.round(value);
    if (unit === 'h') return Math.round(value * 60);
    if (unit === 'd') return Math.round(value * 24 * 60);

    return null;
  };

  pr.formatDurationInput = function(minutes) {
    minutes = Math.max(0, Math.round(Number(minutes || 0)));

    if (minutes && minutes % 1440 === 0) return (minutes / 1440) + 'd';
    if (minutes && minutes % 60 === 0) return (minutes / 60) + 'h';
    return minutes + 'm';
  };

  pr.selectStopPortal = function(index, center) {
    var stop = pr.state.stops[index];
    if (!stop) return;

    if (!stop.guid) {
      pr.state.selectedMapPointIndex = index;
      if (pr.clearIitcPortalSelection) pr.clearIitcPortalSelection();
      if (center && window.map) {
        window.map.setView([stop.lat, stop.lng], window.map.getZoom());
      }
      pr.redrawLabels();
      pr.renderPanel();
      pr.renderMiniControl();
      return;
    }

    pr.state.selectedMapPointIndex = null;

    var portal = window.portals && window.portals[stop.guid];
    if (center && portal && portal.getLatLng && window.map) {
      window.map.setView(portal.getLatLng(), window.map.getZoom());
    }

    if (typeof window.renderPortalDetails === 'function') {
      window.renderPortalDetails(stop.guid);
    } else {
      window.selectedPortal = stop.guid;
    }

    pr.redrawLabels();
    pr.renderPanel();
    pr.renderMiniControl();
  };


  pr.calculateTotals = function(legs) {
    var driveSeconds = 0;
    var distanceMeters = 0;

    legs.forEach(function(leg) {
      driveSeconds += leg.durationSeconds || 0;
      distanceMeters += leg.distanceMeters || 0;
    });

    var stopSeconds = pr.state.stops.reduce(function(sum, stop) {
      return sum + pr.getEffectiveStopMinutes(stop) * 60;
    }, 0);

    return {
      driveSeconds: driveSeconds,
      stopSeconds: stopSeconds,
      tripSeconds: driveSeconds + stopSeconds,
      distanceMeters: distanceMeters
    };
  };

  pr.getGoogleLatLng = function(stop) {
    return new google.maps.LatLng(stop.lat, stop.lng);
  };

  pr.calculateRoute = function() {
    if (pr.state.stops.length < 2) {
      pr.showMessage('Add at least two portals to calculate a route.');
      return;
    }

    if (!window.google || !google.maps || !google.maps.DirectionsService) {
      pr.showMessage('Google Maps DirectionsService is not available in this IITC session.');
      return;
    }

    var stops = pr.state.stops;
    var origin = stops[0];
    var destination = stops[stops.length - 1];
    var waypoints = stops.slice(1, -1).map(function(stop) {
      return { location: pr.getGoogleLatLng(stop), stopover: true };
    });

    var service = new google.maps.DirectionsService();
    var request = {
      origin: pr.getGoogleLatLng(origin),
      destination: pr.getGoogleLatLng(destination),
      waypoints: waypoints,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.DRIVING
    };

    pr.setBusy(true);
    service.route(request, function(result, status) {
      pr.setBusy(false);

      if (status !== google.maps.DirectionsStatus.OK) {
        pr.showMessage('Route calculation failed: ' + status);
        return;
      }

      var route = result.routes && result.routes[0];
      if (!route) {
        pr.showMessage('Route calculation returned no route.');
        return;
      }

      var legs = route.legs.map(function(leg, index) {
        var fromStop = stops[index];
        var toStop = stops[index + 1];
        var legPath = [];

        if (leg.steps) {
          leg.steps.forEach(function(step) {
            if (step.path) {
              step.path.forEach(function(point) {
                legPath.push({ lat: point.lat(), lng: point.lng() });
              });
            }
          });
        }

        return {
          fromIndex: index,
          toIndex: index + 1,
          fromLabel: fromStop ? fromStop.title : 'Stop ' + (index + 1),
          toLabel: toStop ? toStop.title : 'Stop ' + (index + 2),
          distanceMeters: leg.distance ? leg.distance.value : 0,
          durationSeconds: leg.duration ? leg.duration.value : 0,
          distanceText: leg.distance ? leg.distance.text : '',
          durationText: leg.duration ? leg.duration.text : '',
          path: legPath
        };
      });

      var path = [];
      if (route.overview_path) {
        path = route.overview_path.map(function(point) {
          return L.latLng(point.lat(), point.lng());
        });
      }

      pr.state.route = {
        legs: legs,
        totals: pr.calculateTotals(legs),
        path: path.map(function(point) {
          return { lat: point.lat, lng: point.lng };
        })
      };
      pr.markRouteCurrent();

      pr.drawRoutePath(path);
      pr.renderPanel();
    });
  };

  pr.routeOverlayTarget = function() {
    if (pr.layerGroup) return pr.layerGroup;
    return window.map;
  };

  pr.ensureLayers = function() {
    var target = pr.routeOverlayTarget();

    if (!pr.state.layers.labels) {
      pr.state.layers.labels = L.layerGroup().addTo(target);
    }

    if (!pr.state.layers.segmentLabels) {
      pr.state.layers.segmentLabels = L.layerGroup().addTo(target);
    }
  };

  pr.clearLabels = function() {
    if (pr.state.layers.labels) {
      pr.state.layers.labels.clearLayers();
    }
  };

  pr.clearSegmentTimeLabels = function() {
    if (pr.state.layers.segmentLabels) {
      pr.state.layers.segmentLabels.clearLayers();
    }
  };

  pr.clearRouteLine = function() {
    if (pr.state.layers.routeLine) {
      var owner = pr.routeOverlayTarget();
      if (owner && owner.hasLayer && owner.hasLayer(pr.state.layers.routeLine)) {
        owner.removeLayer(pr.state.layers.routeLine);
      } else if (window.map && window.map.hasLayer && window.map.hasLayer(pr.state.layers.routeLine)) {
        window.map.removeLayer(pr.state.layers.routeLine);
      }
      pr.state.layers.routeLine = null;
    }

    pr.clearSegmentTimeLabels();
  };

  pr.redrawLabels = function() {
    if (!window.map || !window.L) return;
    pr.ensureLayers();
    pr.clearLabels();

    pr.state.stops.forEach(function(stop, index) {
      var isSelected = pr.selectedStopIndex && pr.selectedStopIndex() === index;
      var selectedClass = isSelected ? ' portal-route-stop-label-selected' : '';
      var isMapPoint = stop.type === 'map';
      var title = (index + 1) + '. ' + stop.title;

      var selectStop = function(e) {
        if (e.originalEvent && e.originalEvent.stopPropagation) e.originalEvent.stopPropagation();
        if (e.originalEvent && e.originalEvent.preventDefault) e.originalEvent.preventDefault();
        pr.selectStopPortal(index, false);
      };

      if (isMapPoint) {
        var pointIcon = L.divIcon({
          className: 'portal-route-map-point-marker' + (isSelected ? ' portal-route-map-point-marker-selected' : ''),
          html: '<span></span>',
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        });

        var pointMarker = L.marker([stop.lat, stop.lng], {
          icon: pointIcon,
          interactive: true,
          keyboard: false,
          bubblingMouseEvents: false,
          title: title
        });

        pointMarker.on('click', selectStop);
        pointMarker.addTo(pr.state.layers.labels);
      }

      var icon = L.divIcon({
        className: 'portal-route-stop-label' + (isMapPoint ? ' portal-route-map-point-label' : '') + selectedClass,
        html: '<span>' + (index + 1) + '</span>',
        iconSize: [18, 18],
        iconAnchor: [0, 24]
      });

      var marker = L.marker([stop.lat, stop.lng], {
        icon: icon,
        interactive: true,
        keyboard: false,
        bubblingMouseEvents: false,
        title: title
      });

      marker.on('click', selectStop);

      marker.bindTooltip(title, {
        direction: 'right',
        offset: [16, -10],
        opacity: 0.9,
        interactive: false,
        className: 'portal-route-stop-tooltip'
      });

      marker.addTo(pr.state.layers.labels);
    });
  };

  pr.toLatLng = function(point) {
    if (!point) return null;
    if (point.lat && typeof point.lat === 'function' && point.lng && typeof point.lng === 'function') {
      return L.latLng(point.lat(), point.lng());
    }
    if (typeof point.lat === 'number' && typeof point.lng === 'number') {
      return L.latLng(point.lat, point.lng);
    }
    return null;
  };

  pr.getPathMidpoint = function(path) {
    if (!path || path.length === 0) return null;

    var points = path.map(pr.toLatLng).filter(Boolean);
    if (points.length === 0) return null;
    if (points.length === 1) return points[0];

    var total = 0;
    for (var i = 1; i < points.length; i++) {
      total += points[i - 1].distanceTo(points[i]);
    }

    if (!total) return points[Math.floor(points.length / 2)];

    var halfway = total / 2;
    var walked = 0;

    for (var j = 1; j < points.length; j++) {
      var from = points[j - 1];
      var to = points[j];
      var segment = from.distanceTo(to);

      if (walked + segment >= halfway) {
        var ratio = segment ? (halfway - walked) / segment : 0;
        return L.latLng(
          from.lat + (to.lat - from.lat) * ratio,
          from.lng + (to.lng - from.lng) * ratio
        );
      }

      walked += segment;
    }

    return points[Math.floor(points.length / 2)];
  };

  pr.getLegLabelLatLng = function(leg) {
    var midpoint = pr.getPathMidpoint(leg && leg.path);
    if (midpoint) return midpoint;

    var fromStop = pr.state.stops[leg.fromIndex];
    var toStop = pr.state.stops[leg.toIndex];
    if (!fromStop || !toStop) return null;

    return L.latLng(
      (fromStop.lat + toStop.lat) / 2,
      (fromStop.lng + toStop.lng) / 2
    );
  };

  pr.redrawSegmentTimeLabels = function() {
    if (!window.map || !window.L) return;
    pr.ensureLayers();
    pr.clearSegmentTimeLabels();

    if (!pr.state.settings.showSegmentTimesOnMap) return;
    if (!pr.state.route || !Array.isArray(pr.state.route.legs)) return;

    pr.state.route.legs.forEach(function(leg) {
      var latLng = pr.getLegLabelLatLng(leg);
      if (!latLng) return;

      var text = leg.durationText || pr.formatDuration(leg.durationSeconds);
      var icon = L.divIcon({
        className: 'portal-route-segment-time-label',
        html: '<span>' + pr.escapeHtml(text) + '</span>',
        iconSize: null,
        iconAnchor: [16, 8]
      });

      L.marker(latLng, {
        icon: icon,
        interactive: false,
        keyboard: false,
        bubblingMouseEvents: false
      }).addTo(pr.state.layers.segmentLabels);
    });
  };

  pr.drawRoutePath = function(path, options) {
    options = options || {};
    pr.clearRouteLine();
    if (!path || path.length < 2) return;

    pr.state.layers.routeLine = L.polyline(path, {
      color: '#ff7f00',
      weight: 5,
      opacity: 0.8,
      interactive: false,
      bubblingMouseEvents: false
    }).addTo(pr.routeOverlayTarget());

    pr.redrawSegmentTimeLabels();

    if (options.fitBounds === false) return;

    try {
      window.map.fitBounds(pr.state.layers.routeLine.getBounds(), { padding: [30, 30] });
    } catch (e) {
      console.warn('Portal Route: unable to fit route bounds', e);
    }
  };

  pr.redrawRouteLine = function() {
    if (!window.map || !window.L) return;
    if (!pr.state.route || !Array.isArray(pr.state.route.path)) return;

    var path = pr.state.route.path.map(function(point) {
      return L.latLng(point.lat, point.lng);
    });

    pr.drawRoutePath(path, { fitBounds: false });
  };

  pr.escapeHtml = function(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  pr.renderEmptyHelp = function() {
    return '<p class="portal-route-empty">There are no waypoints defined.<br>Select a portal and use Add Portal, or use Add Point to add a map point.</p>';
  };

  pr.renderRouteSegment = function(leg) {
    if (!leg) {
      return '<span class="portal-route-leg portal-route-leg-empty">---- / ----</span>';
    }

    var duration = leg.durationText || pr.formatDuration(leg.durationSeconds);
    var distance = leg.distanceText || pr.formatDistance(leg.distanceMeters);
    var staleClass = pr.state.routeDirty ? ' portal-route-leg-stale' : '';

    return '<span class="portal-route-leg' + staleClass + '">' +
      pr.escapeHtml(duration) +
      ' / ' +
      pr.escapeHtml(distance) +
      '</span>';
  };

  pr.renderStopsList = function(legsByToIndex) {
    var stops = pr.state.stops;
    if (stops.length === 0) return pr.renderEmptyHelp();

    var html = '';
    html += '<div class="portal-route-waypoints-list">';

    stops.forEach(function(stop, index) {
      var waitValue = pr.formatDurationInput(pr.getEffectiveStopMinutes(stop));
      var selectedClass = pr.selectedStopIndex && pr.selectedStopIndex() === index ? ' portal-route-selected-stop' : '';

      html += '<div class="portal-route-waypoint-row' + selectedClass + '" data-index="' + index + '">';
      html += '<div class="portal-route-waypoint-num"><button type="button" class="portal-route-stop-num portal-route-waypoint-badge" title="Select and center stop" data-action="select-stop-center" data-index="' + index + '">' + (index + 1) + '</button></div>';
      if (stop.type === 'map') {
        html += '<div class="portal-route-waypoint-name-cell"><input type="text" class="portal-route-waypoint-name portal-route-waypoint-name-input" title="Edit map point name" data-field="stop-title" data-index="' + index + '" value="' + pr.escapeHtml(stop.title) + '"></div>';
      } else {
        html += '<div class="portal-route-waypoint-name-cell"><button type="button" class="portal-route-waypoint-name" title="Select stop" data-action="select-stop" data-index="' + index + '">' + pr.escapeHtml(stop.title) + '</button></div>';
      }
      html += '<div class="portal-route-leg-cell">' + (index < stops.length - 1 ? pr.renderRouteSegment(legsByToIndex[index + 1]) : '') + '</div>';
      html += '<div class="portal-route-wait-cell"><input class="portal-route-wait-input" type="text" inputmode="decimal" value="' + pr.escapeHtml(waitValue) + '" title="Examples: 15m, 1.5h, 2d" data-field="stop-minutes" data-index="' + index + '"></div>';
      html += '<div class="portal-route-row-action"><button type="button" class="portal-route-row-button" title="Move up" data-action="move-stop-up" data-index="' + index + '" ' + (index === 0 ? 'disabled' : '') + '>&uarr;</button></div>';
      html += '<div class="portal-route-row-action"><button type="button" class="portal-route-row-button" title="Move down" data-action="move-stop-down" data-index="' + index + '" ' + (index === stops.length - 1 ? 'disabled' : '') + '>&darr;</button></div>';
      html += '<div class="portal-route-row-action"><button type="button" class="portal-route-row-button portal-route-remove-stop-button" title="Remove waypoint" data-action="remove-stop" data-index="' + index + '">X</button></div>';
      html += '</div>';
    });

    html += '</div>';
    return html;
  };

  pr.renderTotals = function(route) {
    if (!route || !route.totals) return '';

    var html = '';
    html += '<div class="portal-route-totals">';
    html += '<div><span>Driving</span><strong>' + pr.formatDuration(route.totals.driveSeconds) + '</strong></div>';
    html += '<div><span>Stops</span><strong>' + pr.formatDuration(route.totals.stopSeconds) + '</strong></div>';
    html += '<div><span>Trip</span><strong>' + pr.formatDuration(route.totals.tripSeconds) + '</strong></div>';
    html += '<div><span>Distance</span><strong>' + pr.formatDistance(route.totals.distanceMeters) + '</strong></div>';
    html += '</div>';
    return html;
  };

  pr.renderMainPanel = function(legsByToIndex) {
    var stops = pr.state.stops;
    var html = '';

    html += '<div class="portal-route-body">';
    html += pr.renderStopsList(legsByToIndex);

    html += '<label class="portal-route-setting">Default stop time <input type="text" inputmode="decimal" value="' + pr.escapeHtml(pr.formatDurationInput(pr.state.settings.defaultStopMinutes)) + '" title="Examples: 15m, 1.5h, 2d" data-field="default-stop-minutes"> per portal</label>';

    html += '<label class="portal-route-setting portal-route-checkbox-setting"><input type="checkbox" data-field="show-segment-times-on-map" ' + (pr.state.settings.showSegmentTimesOnMap ? 'checked ' : '') + '> Show segment times on map</label>';

    var plotLabel = pr.state.routeDirty ? 'Replot' : 'Plot';

    html += '<div class="portal-route-actions">';
    html += '<button type="button" data-action="add-selected-stop">Add Portal</button>';
    html += '<button type="button" data-action="add-map-point"' + (pr.state.addPointMode ? ' class="portal-route-active-action"' : '') + '>Add Point</button>';
    html += '<button type="button" data-action="calculate-route">' + plotLabel + '</button>';
    html += '<button type="button" data-action="open-google-maps">Open Maps</button>';
    html += '<button type="button" data-action="export-route-json">Export</button>';
    html += '<button type="button" data-action="import-route-json">Import</button>';
    html += '<button type="button" data-action="print-route">Print</button>';
    html += '<button type="button" data-action="clear-route">Clear</button>';
    html += '<button type="button" data-action="close-panel">Close</button>';
    html += '</div>';

    html += '<div class="portal-route-bottom-summary"><b>Waypoints:</b> ' + stops.length + '</div>';
    if (pr.state.routeDirty) {
      html += '<div class="portal-route-stale">Route needs replot.</div>';
    }
    html += pr.renderTotals(pr.state.route);
    if (pr.SHOW_VERSION_IN_PANEL) {
      html += '<div class="portal-route-version">Portal Route ' + pr.escapeHtml(pr.VERSION) + '</div>';
    }

    html += '<div class="portal-route-message" id="portal-route-message"></div>';
    html += '</div>';
    return html;
  };

  pr.renderEditPanel = function(legsByToIndex) {
    return pr.renderMainPanel(legsByToIndex);
  };


  pr.getDialogWidth = function() {
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 520;

    if (viewportWidth <= 640) {
      return Math.max(320, viewportWidth);
    }

    return Math.min(560, Math.max(460, viewportWidth - 40));
  };

  pr.isDialogOpen = function(content) {
    if (!content || !window.jQuery) return false;

    try {
      var dialogContent = window.jQuery(content).closest('.ui-dialog-content');
      return dialogContent.length > 0 && dialogContent.dialog('isOpen');
    } catch (e) {
      return false;
    }
  };

  pr.renderPanel = function() {
    if (pr.isLayerEnabled && !pr.isLayerEnabled()) {
      pr.closeDialog();
      return;
    }

    pr.renderMiniControl();

    if (!pr.state.panelOpen) {
      pr.closeDialog();
      return;
    }

    var route = pr.state.route;
    var legsByToIndex = {};
    if (route && route.legs) {
      route.legs.forEach(function(leg) { legsByToIndex[leg.toIndex] = leg; });
    }

    var contentHtml = pr.renderMainPanel(legsByToIndex);
    var existingContent = document.getElementById(pr.DOM_IDS.dialogContent);

    if (pr.isDialogOpen(existingContent)) {
      existingContent.innerHTML = contentHtml;
      return;
    }

    var html = '<div id="' + pr.DOM_IDS.dialogContent + '" class="portal-route-dialog-content">' + contentHtml + '</div>';

    if (typeof window.dialog === 'function') {
      window.dialog({
        id: pr.DOM_IDS.dialog,
        title: 'Portal Route',
        html: html,
        dialogClass: 'portal-route-dialog',
        width: pr.getDialogWidth()
      });

      var newContent = document.getElementById(pr.DOM_IDS.dialogContent);
      if (newContent && window.jQuery) {
        try {
          window.jQuery(newContent)
            .closest('.ui-dialog-content')
            .off('dialogclose.portalRoute')
            .on('dialogclose.portalRoute', function() {
              pr.state.panelOpen = false;
              pr.savePanelOpen();
            });
        } catch (e) {
          console.warn('Portal Route: failed to attach dialog close handler', e);
        }
      }
    } else {
      console.log('Portal Route: IITC dialog API is unavailable.');
    }
  };

  pr.GOOGLE_MAPS_TOTAL_POINT_LIMIT = 11;
  pr.GOOGLE_MAPS_INTERMEDIATE_STOP_LIMIT = 9;
  pr.ROUTE_EXPORT_FORMAT = 'portal-route.v1';

  pr.googleMapsUrl = function() {
    var stops = pr.state.stops;
    if (stops.length < 2) return null;

    var origin = stops[0];
    var destination = stops[stops.length - 1];
    var waypoints = stops.slice(1, -1);

    var params = new URLSearchParams();
    params.set('api', '1');
    params.set('travelmode', 'driving');
    params.set('origin', origin.lat + ',' + origin.lng);
    params.set('destination', destination.lat + ',' + destination.lng);

    if (waypoints.length > 0) {
      params.set('waypoints', waypoints.map(function(stop) {
        return stop.lat + ',' + stop.lng;
      }).join('|'));
    }

    return 'https://www.google.com/maps/dir/?' + params.toString();
  };

  pr.googleMapsOmittedStops = function() {
    var stops = pr.state.stops || [];
    if (stops.length <= pr.GOOGLE_MAPS_TOTAL_POINT_LIMIT) return [];

    // Google Maps appears to honor origin, destination, and the first 9
    // intermediate stops. The stops after that, before the final destination,
    // are the ones most likely to be omitted.
    return stops.slice(
      pr.GOOGLE_MAPS_INTERMEDIATE_STOP_LIMIT + 1,
      stops.length - 1
    );
  };

  pr.googleMapsExportWarning = function() {
    var omitted = pr.googleMapsOmittedStops();
    if (omitted.length === 0) return null;

    var lines = [
      'Google Maps appears to support only 11 total route points:',
      'start, final destination, and 9 intermediate stops.',
      '',
      'This route has ' + pr.state.stops.length + ' points. These stops may be omitted by Google Maps:'
    ];

    omitted.forEach(function(stop, index) {
      var stopNumber = pr.GOOGLE_MAPS_INTERMEDIATE_STOP_LIMIT + 2 + index;
      lines.push(stopNumber + '. ' + stop.title);
    });

    lines.push('');
    lines.push('Open Google Maps anyway?');

    return lines.join('\n');
  };

  pr.openGoogleMaps = function() {
    var url = pr.googleMapsUrl();
    if (!url) {
      pr.showMessage('Add at least two portals first.');
      return;
    }

    var warning = pr.googleMapsExportWarning();
    if (warning && !window.confirm(warning)) {
      pr.showMessage('Google Maps export canceled.');
      return;
    }

    window.open(url, '_blank', 'noopener');
  };

  pr.routeExportData = function() {
    return {
      format: pr.ROUTE_EXPORT_FORMAT,
      plugin: pr.ID,
      pluginName: pr.NAME,
      pluginVersion: pr.VERSION,
      exportedAt: new Date().toISOString(),
      settings: Object.assign({}, pr.state.settings),
      stops: pr.state.stops.map(function(stop) {
        return {
          guid: stop.guid || null,
          type: stop.type || (stop.guid ? 'portal' : 'map'),
          title: stop.title || ((stop.type || (stop.guid ? 'portal' : 'map')) === 'map' ? 'Map point' : 'Unnamed portal'),
          lat: Number(stop.lat),
          lng: Number(stop.lng),
          stopMinutes: typeof stop.stopMinutes === 'number' ? stop.stopMinutes : null
        };
      }),
      route: pr.state.route || null,
      routeDirty: !!pr.state.routeDirty
    };
  };

  pr.routeExportFilename = function() {
    var stamp = new Date().toISOString().replace(/[:.]/g, '-');
    return 'portal-route-' + stamp + '.json';
  };

  pr.downloadTextFile = function(filename, text, mimeType) {
    var blob = new Blob([text], { type: mimeType || 'text/plain' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
  };

  pr.exportRouteJson = function() {
    if (!pr.state.stops.length) {
      pr.showMessage('No route to export.');
      return;
    }

    var json = JSON.stringify(pr.routeExportData(), null, 2);
    pr.downloadTextFile(pr.routeExportFilename(), json, 'application/json');
    pr.showMessage('Route JSON exported.');
  };

  pr.normalizeImportedStop = function(stop) {
    if (!stop || typeof stop !== 'object') return null;

    var lat = Number(stop.lat);
    var lng = Number(stop.lng);
    if (!isFinite(lat) || !isFinite(lng)) return null;

    var stopMinutes = null;
    if (stop.stopMinutes !== null && stop.stopMinutes !== undefined && stop.stopMinutes !== '') {
      stopMinutes = Number(stop.stopMinutes);
      if (!isFinite(stopMinutes) || stopMinutes < 0) stopMinutes = null;
      if (stopMinutes !== null) stopMinutes = Math.round(stopMinutes);
    }

    var type = stop.type || (stop.guid ? 'portal' : 'map');

    return {
      guid: stop.guid || null,
      type: type,
      title: stop.title || (type === 'map' ? 'Map point' : 'Unnamed portal'),
      lat: lat,
      lng: lng,
      stopMinutes: stopMinutes
    };
  };

  pr.importRouteData = function(data) {
    if (!data || typeof data !== 'object') throw new Error('Import data is not an object.');
    if (!Array.isArray(data.stops)) throw new Error('Import data does not contain a stops array.');

    var stops = data.stops.map(pr.normalizeImportedStop).filter(Boolean);
    if (stops.length !== data.stops.length) throw new Error('One or more stops are missing valid coordinates.');

    pr.state.stops = stops;
    pr.state.settings = Object.assign({}, pr.DEFAULT_SETTINGS, data.settings || {});
    pr.state.route = data.route && Array.isArray(data.route.legs) ? data.route : null;
    pr.state.routeDirty = !!pr.state.route || !!data.routeDirty;

    pr.saveSettings();
    pr.saveStops();
    pr.saveRoute();
    pr.redrawLabels();
    pr.redrawRouteLine();
    pr.redrawSegmentTimeLabels();
    pr.renderPanel();
    pr.showMessage('Route imported. Replot before using route totals.');
  };

  pr.importRouteJsonText = function(text) {
    var data = JSON.parse(text);
    pr.importRouteData(data);
  };

  pr.importRouteJson = function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.style.display = 'none';

    input.addEventListener('change', function() {
      var file = input.files && input.files[0];
      if (!file) {
        if (input.parentNode) input.parentNode.removeChild(input);
        return;
      }

      var reader = new FileReader();
      reader.onload = function() {
        try {
          pr.importRouteJsonText(String(reader.result || ''));
        } catch (e) {
          console.warn('Portal Route: route import failed', e);
          pr.showMessage('Route import failed: ' + e.message);
        }
        if (input.parentNode) input.parentNode.removeChild(input);
      };
      reader.onerror = function() {
        pr.showMessage('Route import failed while reading file.');
        if (input.parentNode) input.parentNode.removeChild(input);
      };
      reader.readAsText(file);
    });

    document.body.appendChild(input);
    input.click();
  };

  pr.printableLegText = function(leg) {
    if (!leg) return '---- / ----';

    var duration = leg.durationText || pr.formatDuration(leg.durationSeconds);
    var distance = leg.distanceText || pr.formatDistance(leg.distanceMeters);
    return duration + ' / ' + distance;
  };

  pr.printRoute = function() {
    if (!pr.state.stops.length) {
      pr.showMessage('No route to print.');
      return;
    }

    var route = pr.state.route;
    var legsByFromIndex = {};
    if (route && Array.isArray(route.legs)) {
      route.legs.forEach(function(leg) { legsByFromIndex[leg.fromIndex] = leg; });
    }

    var totals = route && route.totals ? route.totals : null;
    var generatedAt = new Date().toLocaleString();
    var rows = pr.state.stops.map(function(stop, index) {
      var wait = pr.formatDurationInput(pr.getEffectiveStopMinutes(stop));
      var legText = index < pr.state.stops.length - 1 ? pr.printableLegText(legsByFromIndex[index]) : '';

      return '<tr>' +
        '<td class="num">' + (index + 1) + '</td>' +
        '<td><div class="title">' + pr.escapeHtml(stop.title) + '</div><div class="coords">' + pr.escapeHtml(stop.lat + ', ' + stop.lng) + '</div></td>' +
        '<td>' + pr.escapeHtml(wait) + '</td>' +
        '<td>' + pr.escapeHtml(legText) + '</td>' +
        '</tr>';
    }).join('');

    var totalsHtml = totals ? '<div class="totals">' +
      '<span><b>Drive:</b> ' + pr.escapeHtml(pr.formatDuration(totals.driveSeconds)) + '</span>' +
      '<span><b>Stops:</b> ' + pr.escapeHtml(pr.formatDuration(totals.stopSeconds)) + '</span>' +
      '<span><b>Trip:</b> ' + pr.escapeHtml(pr.formatDuration(totals.tripSeconds)) + '</span>' +
      '<span><b>Distance:</b> ' + pr.escapeHtml(pr.formatDistance(totals.distanceMeters)) + '</span>' +
      '</div>' : '<div class="warning">Route has not been plotted.</div>';

    var staleHtml = pr.state.routeDirty ? '<div class="warning">Route data is stale. Replot before relying on route totals or leg data.</div>' : '';

    var html = '<!doctype html><html><head><meta charset="utf-8">' +
      '<title>Portal Route</title>' +
      '<style>' +
      'body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:24px;color:#111;}' +
      'h1{font-size:22px;margin:0 0 4px 0;}' +
      '.meta{font-size:12px;color:#555;margin-bottom:16px;}' +
      '.totals{display:flex;flex-wrap:wrap;gap:12px;margin:12px 0 16px 0;padding:8px;border:1px solid #ccc;}' +
      '.warning{margin:12px 0;padding:8px;border:1px solid #c90;background:#fff8d0;}' +
      'table{width:100%;border-collapse:collapse;font-size:13px;}' +
      'th,td{border-bottom:1px solid #ddd;padding:6px;text-align:left;vertical-align:top;}' +
      'th{font-size:12px;color:#333;background:#f3f3f3;}' +
      '.num{width:32px;text-align:right;color:#555;}' +
      '.title{font-weight:600;}' +
      '.coords{font-size:11px;color:#666;margin-top:2px;}' +
      '@media print{body{margin:12mm}.no-print{display:none}}' +
      '</style></head><body>' +
      '<h1>Portal Route</h1>' +
      '<div class="meta">Generated ' + pr.escapeHtml(generatedAt) + '</div>' +
      staleHtml + totalsHtml +
      '<table><thead><tr><th>#</th><th>Portal</th><th>Wait</th><th>Next leg</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<p class="no-print"><button onclick="window.print()">Print</button></p>' +
      '</body></html>';

    var printWindow = window.open('', '_blank');
    if (!printWindow) {
      pr.showMessage('Popup blocked while opening printable route.');
      return;
    }

    try {
      printWindow.document.open('text/html', 'replace');
      printWindow.document.write(html);
      printWindow.document.close();
      if (printWindow.focus) printWindow.focus();
    } catch (e) {
      console.warn('Portal Route: failed to render printable route', e);
      pr.showMessage('Unable to render printable route.');
    }
  };

  pr.setBusy = function(isBusy) {
    var panel = document.getElementById(pr.DOM_IDS.dialogContent);
    if (panel) panel.classList.toggle('portal-route-busy', !!isBusy);
  };

  pr.showMessage = function(message) {
    var node = document.getElementById('portal-route-message');
    if (node) {
      node.textContent = message;
      node.classList.add('portal-route-message-visible');
      window.setTimeout(function() {
        node.classList.remove('portal-route-message-visible');
      }, 5000);
    } else {
      console.log('Portal Route:', message);
    }
  };

  pr.selectedMapPointIndex = function() {
    var index = pr.state.selectedMapPointIndex;
    var stop = typeof index === 'number' ? pr.state.stops[index] : null;

    if (stop && stop.type === 'map') return index;

    pr.state.selectedMapPointIndex = null;
    return -1;
  };

  pr.clearSelectedMapPoint = function() {
    if (pr.state.selectedMapPointIndex === null || pr.state.selectedMapPointIndex === undefined) return;
    pr.state.selectedMapPointIndex = null;
    pr.redrawLabels();
    pr.renderPanel();
    pr.renderMiniControl();
  };

  pr.selectedStopIndex = function() {
    var mapPointIndex = pr.selectedMapPointIndex();
    if (mapPointIndex >= 0) return mapPointIndex;

    var guid = window.selectedPortal;
    if (!guid) return -1;

    for (var i = 0; i < pr.state.stops.length; i++) {
      if (pr.state.stops[i].guid === guid) return i;
    }
    return -1;
  };

  pr.removeSelectedStop = function() {
    var index = pr.selectedStopIndex();
    if (index < 0) {
      pr.showMessage('Selected portal or map point is not in the route.');
      return;
    }
    pr.removeStop(index);
  };

  pr.removeSelectedPortal = pr.removeSelectedStop;

  pr.toggleSelectedPortalStop = function() {
    if (pr.selectedStopIndex() >= 0) {
      pr.removeSelectedStop();
    } else {
      pr.addSelectedPortal();
    }
  };

  pr.closeDialog = function() {
    var content = document.getElementById(pr.DOM_IDS.dialogContent);
    if (content && window.jQuery) {
      try {
        window.jQuery(content).closest('.ui-dialog-content').dialog('close');
        return;
      } catch (e) {
        // Fall through to hiding the content if the IITC dialog wrapper is unavailable.
      }
    }
    if (content) content.style.display = 'none';
  };

  pr.handleAction = function(action, target) {
    if (pr.isLayerEnabled && !pr.isLayerEnabled()) {
      pr.syncLayerUi();
      return;
    }

    if (action === 'open-main') {
      pr.state.panelView = 'main';
      pr.state.panelOpen = true;
      pr.savePanelOpen();
      pr.renderPanel();
    } else if (action === 'open-edit') {
      pr.state.panelView = 'main';
      pr.state.panelOpen = true;
      pr.savePanelOpen();
      pr.renderPanel();
    } else if (action === 'close-panel') {
      pr.state.panelOpen = false;
      pr.savePanelOpen();
      pr.closeDialog();
    } else if (action === 'toggle-selected-stop') {
      pr.toggleSelectedPortalStop();
    } else if (action === 'add-selected-stop') {
      pr.addSelectedPortal();
    } else if (action === 'add-map-point') {
      pr.setAddPointMode(!pr.state.addPointMode);
    } else if (action === 'move-stop-up') {
      pr.moveStop(Number(target.getAttribute('data-index')), Number(target.getAttribute('data-index')) - 1);
    } else if (action === 'move-stop-down') {
      pr.moveStop(Number(target.getAttribute('data-index')), Number(target.getAttribute('data-index')) + 1);
    } else if (action === 'remove-stop') {
      pr.removeStop(Number(target.getAttribute('data-index')));
    } else if (action === 'select-stop') {
      pr.selectStopPortal(Number(target.getAttribute('data-index')), false);
    } else if (action === 'select-stop-center') {
      pr.selectStopPortal(Number(target.getAttribute('data-index')), true);
    } else if (action === 'calculate-route') {
      pr.calculateRoute();
    } else if (action === 'open-google-maps') {
      pr.openGoogleMaps();
    } else if (action === 'export-route-json') {
      pr.exportRouteJson();
    } else if (action === 'import-route-json') {
      pr.importRouteJson();
    } else if (action === 'print-route') {
      pr.printRoute();
    } else if (action === 'clear-route') {
      pr.clearStops();
    }
  };

  pr.isLayerEnabled = function() {
    if (!window.map || !pr.layerGroup) return true;
    return window.map.hasLayer(pr.layerGroup);
  };

  pr.createMiniControl = function() {
    if (!window.L || !window.map) return;
    if (pr.state.miniControl || document.getElementById(pr.DOM_IDS.miniControl)) return;

    var PortalRouteControl = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: function() {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control portal-route-mini-control iitc-plugin-portal-route-control');
        container.id = pr.DOM_IDS.miniControl;
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);
        container.addEventListener('click', function(ev) {
          var button = ev.target.closest('[data-action]');
          if (!button) return;
          ev.preventDefault();
          pr.handleAction(button.getAttribute('data-action'), button);
        });
        return container;
      }
    });

    pr.state.miniControl = new PortalRouteControl();
    window.map.addControl(pr.state.miniControl);
    pr.setMiniControlVisible(pr.isLayerEnabled());
  };

  pr.setMiniControlVisible = function(isVisible) {
    var container = document.getElementById(pr.DOM_IDS.miniControl);
    if (container) container.style.display = isVisible ? '' : 'none';
  };

  pr.removeMiniControl = function() {
    if (pr.state.miniControl && window.map) {
      try {
        window.map.removeControl(pr.state.miniControl);
      } catch (e) {
        console.warn('Portal Route: unable to remove mini control', e);
      }
    }

    pr.state.miniControl = null;

    var container = document.getElementById(pr.DOM_IDS.miniControl);
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  };

  pr.renderMiniControl = function() {
    var container = document.getElementById(pr.DOM_IDS.miniControl);
    if (!container) return;

    if (!pr.isLayerEnabled()) {
      pr.setMiniControlVisible(false);
      return;
    }

    pr.setMiniControlVisible(true);

    var selectedIndex = pr.selectedStopIndex();
    var selectedInRoute = selectedIndex >= 0;
    var addRemoveClass = selectedInRoute ? ' portal-route-mini-remove' : '';
    var addRemoveText = selectedInRoute ? '-' : '+';
    var addRemoveTitle = selectedInRoute ? 'Remove selected waypoint from route' : 'Add selected portal to route';
    var plotTitle = pr.state.routeDirty ? 'Replot route on map' : 'Plot route on map';

    container.innerHTML = '' +
      '<a href="#" title="Open route in Google Maps" data-action="open-google-maps">M</a>' +
      '<a href="#" title="' + plotTitle + '" data-action="calculate-route">P</a>' +
      '<a href="#" class="portal-route-mini-add' + addRemoveClass + '" title="' + addRemoveTitle + '" data-action="toggle-selected-stop">' + addRemoveText + '</a>' +
      '<a href="#" title="Open Portal Route menu" data-action="open-main">' + pr.state.stops.length + '</a>' +
      '<a href="#" title="Portal Route menu" data-action="open-main">=</a>';
  };

  pr.setupDialogEventHandlers = function() {
    if (pr.dialogEventsRegistered) return;
    pr.dialogEventsRegistered = true;

    document.addEventListener('click', function(ev) {
      var panel = ev.target.closest('#' + pr.DOM_IDS.dialogContent);
      if (!panel) return;

      var target = ev.target.closest('[data-action]');
      var action = target && target.getAttribute('data-action');
      if (!action) return;

      ev.preventDefault();
      pr.handleAction(action, target);
    });

    document.addEventListener('dragstart', function(ev) {
      var panel = ev.target.closest('#' + pr.DOM_IDS.dialogContent);
      if (!panel) return;

      var item = ev.target.closest('.portal-route-stop');
      if (!item) return;

      pr.state.dragStopIndex = Number(item.getAttribute('data-index'));
      ev.dataTransfer.effectAllowed = 'move';
      item.classList.add('portal-route-dragging');
    });

    document.addEventListener('dragend', function(ev) {
      var item = ev.target.closest('.portal-route-stop');
      if (item) item.classList.remove('portal-route-dragging');
      pr.state.dragStopIndex = null;
    });

    document.addEventListener('dragover', function(ev) {
      var panel = ev.target.closest('#' + pr.DOM_IDS.dialogContent);
      if (!panel) return;

      var item = ev.target.closest('.portal-route-stop');
      if (!item) return;

      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'move';
    });

    document.addEventListener('drop', function(ev) {
      var panel = ev.target.closest('#' + pr.DOM_IDS.dialogContent);
      if (!panel) return;

      var item = ev.target.closest('.portal-route-stop');
      if (!item) return;

      ev.preventDefault();

      var fromIndex = pr.state.dragStopIndex;
      var toIndex = Number(item.getAttribute('data-index'));
      pr.state.dragStopIndex = null;

      pr.moveStop(fromIndex, toIndex);
    });

    document.addEventListener('change', function(ev) {
      var panel = ev.target.closest('#' + pr.DOM_IDS.dialogContent);
      if (!panel) return;

      var target = ev.target;
      if (target && target.getAttribute('data-field') === 'show-segment-times-on-map') {
        pr.state.settings.showSegmentTimesOnMap = !!target.checked;
        pr.saveSettings();
        pr.redrawSegmentTimeLabels();
        return;
      }

      if (target && target.getAttribute('data-field') === 'default-stop-minutes') {
        var value = pr.parseDurationMinutes(target.value);
        if (value === null) {
          pr.showMessage('Invalid duration. Use values like 15m, 1.5h, or 2d.');
          target.value = pr.formatDurationInput(pr.state.settings.defaultStopMinutes);
          return;
        }

        pr.state.settings.defaultStopMinutes = value;
        pr.saveSettings();
        pr.markRouteStale();
        pr.renderPanel();
      } else if (target && target.getAttribute('data-field') === 'stop-minutes') {
        var stopIndex = Number(target.getAttribute('data-index'));
        var stopValue = pr.parseDurationMinutes(target.value);
        if (stopValue === null) {
          pr.showMessage('Invalid duration. Use values like 15m, 1.5h, or 2d.');
          target.value = pr.formatDurationInput(pr.getEffectiveStopMinutes(pr.state.stops[stopIndex]));
          return;
        }

        pr.setStopMinutes(stopIndex, stopValue);
      } else if (target && target.getAttribute('data-field') === 'stop-title') {
        pr.setStopTitle(Number(target.getAttribute('data-index')), target.value);
      }
    });
  };

  pr.addToolboxLink = function() {
    if (!document.getElementById('toolbox')) return;
    if (document.getElementById(pr.DOM_IDS.toolboxLink)) return;

    var link = document.createElement('a');
    link.id = pr.DOM_IDS.toolboxLink;
    link.href = '#';
    link.textContent = 'Portal Route';
    link.addEventListener('click', function(ev) {
      ev.preventDefault();
      if (!pr.isLayerEnabled()) return;
      pr.state.panelView = 'main';
      pr.state.panelOpen = true;
      pr.savePanelOpen();
      pr.renderPanel();
    });

    var toolbox = document.getElementById('toolbox');
    toolbox.appendChild(link);
  };

  pr.removeToolboxLink = function() {
    var link = document.getElementById(pr.DOM_IDS.toolboxLink);
    if (link && link.parentNode) {
      link.parentNode.removeChild(link);
    }
  };

  pr.injectCss = function() {
    if (document.getElementById(pr.DOM_IDS.css)) return;
    var style = document.createElement('style');
    style.id = pr.DOM_IDS.css;
    style.textContent = pr.CSS;
    document.head.appendChild(style);
  };


  pr.setupLayerControl = function() {
    if (pr.layerGroup) return;

    pr.layerGroup = L.FeatureGroup ? new L.FeatureGroup() : L.layerGroup();

    if (typeof window.addLayerGroup === 'function') {
      window.addLayerGroup('Portal Route', pr.layerGroup, true);
    } else if (window.layerChooser && typeof window.layerChooser.addOverlay === 'function') {
      window.layerChooser.addOverlay(pr.layerGroup, 'Portal Route');
      pr.layerGroup.addTo(window.map);
    }
  };

  pr.syncLayerUi = function() {
    if (pr.isLayerEnabled()) {
      pr.addToolboxLink();
      pr.createMiniControl();
      pr.setMiniControlVisible(true);
      pr.renderMiniControl();
      return;
    }

    pr.state.panelOpen = false;
    pr.savePanelOpen();
    pr.closeDialog();
    pr.setMiniControlVisible(false);
    pr.removeToolboxLink();
  };

  pr.enable = function() {
    pr.addToolboxLink();
    pr.createMiniControl();
    pr.setMiniControlVisible(true);
    pr.renderMiniControl();
    pr.redrawLabels();
  };

  pr.disable = function() {
    pr.state.panelOpen = false;
    pr.savePanelOpen();
    pr.closeDialog();
    pr.setMiniControlVisible(false);
    pr.removeToolboxLink();
  };

  pr.setupLayerEvents = function() {
    if (pr.layerEventsRegistered) return;
    if (!window.map || !pr.layerGroup) return;

    window.map.on('layeradd', function(e) {
      if (e.layer !== pr.layerGroup) return;
      pr.enable();
    });

    window.map.on('layerremove', function(e) {
      if (e.layer !== pr.layerGroup) return;
      pr.disable();
    });

    pr.layerEventsRegistered = true;
  };

  pr.setupMapPointEvents = function() {
    if (pr.mapPointEventsRegistered) return;
    if (!window.map) return;

    window.map.on('click', function(e) {
      if (!pr.state.addPointMode) return;
      if (pr.isLayerEnabled && !pr.isLayerEnabled()) return;

      pr.state.addPointMode = false;
      pr.addMapPointAtLatLng(e.latlng);
      pr.showMessage('Map point added.');
    });

    pr.mapPointEventsRegistered = true;
  };

  pr.setup = function() {
    try {
      if (plugin_info && plugin_info.script && plugin_info.script.version) {
        pr.VERSION = plugin_info.script.version;
      }

      pr.injectCss();
      pr.loadState();
      pr.setupLayerControl();
      pr.setupLayerEvents();
      pr.createMiniControl();
      pr.setupDialogEventHandlers();
      pr.setupMapPointEvents();
      pr.addToolboxLink();
      pr.syncLayerUi();
      pr.renderPanel();
      pr.renderMiniControl();
      pr.redrawLabels();
      pr.redrawRouteLine();

      if (typeof window.addHook === 'function' && !pr.portalHookRegistered) {
        window.addHook('portalDetailsUpdated', function() {
          pr.clearSelectedMapPoint();
          pr.injectPortalDetailsAction();
          pr.renderMiniControl();
        });
        pr.portalHookRegistered = true;
      }

      console.log('Portal Route setup complete');
    } catch (e) {
      console.error('Portal Route setup failed:', e);
    }
  };


  var setup = pr.setup;

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
