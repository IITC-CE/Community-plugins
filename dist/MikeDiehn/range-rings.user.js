// ==UserScript==
// @author          Mike Diehn
// @id              range-rings@MikeDiehn
// @name            Range Rings
// @category        Layer
// @version         1.3.0
// @namespace       https://github.com/mdiehn/iitc-plugin-range-rings
// @updateURL       https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/MikeDiehn/range-rings.meta.js
// @downloadURL     https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/MikeDiehn/range-rings.user.js
// @description     Draw concentric range circles from draggable center points.
// @homepageURL     https://github.com/mdiehn/iitc-plugin-range-rings
// @issueTracker    https://github.com/mdiehn/iitc-plugin-range-rings/issues
// @match           *://intel.ingress.com/*
// @include         https://intel.ingress.com/*
// @include         http://intel.ingress.com/*
// @grant           none
// ==/UserScript==


/*
 * IITC Range Rings plugin
 * Source files are assembled by build.js.
 * Userscript metadata is generated at build time.
 */

function wrapper(plugin_info) {
  // ensure plugin framework is there, even if iitc is not yet loaded
  if (typeof window.plugin !== 'function') window.plugin = function () {};

  // PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
  // (leaving them in place might break the 'About IITC' page or break update checks)
  plugin_info.buildName = 'iitc';
  plugin_info.dateTimeVersion = '20260421.1';
  plugin_info.pluginId = 'range-rings';
  // END PLUGIN AUTHORS NOTE

  'use strict';

  window.plugin.rangeRings = {};
  const rr = window.plugin.rangeRings;
  rr.pluginInfo = plugin_info;

rr.constants = {
  storageKey: 'plugin-range-rings-settings',
  layerName: 'Range Rings',
  panelTitle: 'Range Rings',
  minSpacingMeters: 0,
  maxSpacingMeters: 1000000,
  minCircleCount: 1,
  maxCircleCount: 50,
  minLineWeight: 1,
  maxLineWeight: 10
};

rr.defaults = {
  ringSet: {
    center: null,
    spacingMeters: 5000,
    circleCount: 5,
    color: '#00ffff',
    lineWeight: 1,
    lineStyle: 'solid'
  },
  panelPosition: {
    left: 20,
    top: 20
  },
  panelCollapsed: false,
  panelVisible: true
};

rr.state = {
  layerGroup: null,
  isLayerEnabled: true,
  defaultMarkerIcon: null,

  panel: null,
  panelBody: null,

  ringSets: [],
  activeSetId: null
};

rr.util = {};

rr.util.clampInteger = function (value, minValue, maxValue, fallbackValue) {
  const n = parseInt(value, 10);
  if (!Number.isFinite(n)) return fallbackValue;
  if (n < minValue) return minValue;
  if (n > maxValue) return maxValue;
  return n;
};

rr.util.isValidColor = function (value) {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
};

rr.util.isValidLineStyle = function (value) {
  return ['solid', 'dashed', 'dotted'].indexOf(value) !== -1;
};

rr.util.getDashArray = function (lineStyle) {
  switch (lineStyle) {
    case 'dashed':
      return '10,6';
    case 'dotted':
      return '2,6';
    case 'solid':
    default:
      return null;
  }
};

rr.util.makeSetId = function () {
  return 'set-' + Date.now() + '-' + Math.floor(Math.random() * 1000000);
};

rr.util.getSetDisplayName = function (set, index) {
  return 'Set ' + (index + 1);
};

rr.util.getDistanceMeters = function (latlngA, latlngB) {
  return latlngA.distanceTo(latlngB);
};

rr.model = {};

rr.model.createRingSet = function (overrides) {
  const set = {
    id: rr.util.makeSetId(),
    center: rr.defaults.ringSet.center,
    spacingMeters: rr.defaults.ringSet.spacingMeters,
    circleCount: rr.defaults.ringSet.circleCount,
    color: rr.defaults.ringSet.color,
    lineWeight: rr.defaults.ringSet.lineWeight,
    lineStyle: rr.defaults.ringSet.lineStyle,

    marker: null,
    circles: [],
    resizeHandles: []
  };

  if (overrides && typeof overrides === 'object') {
    if (overrides.id) set.id = overrides.id;

    if (
      overrides.center &&
      typeof overrides.center.lat === 'number' &&
      typeof overrides.center.lng === 'number'
    ) {
      set.center = {
        lat: overrides.center.lat,
        lng: overrides.center.lng
      };
    }

    if (rr.util.isValidColor(overrides.color)) {
      set.color = overrides.color;
    }

    if (rr.util.isValidLineStyle(overrides.lineStyle)) {
      set.lineStyle = overrides.lineStyle;
    }

    set.spacingMeters = rr.util.clampInteger(
      overrides.spacingMeters,
      rr.constants.minSpacingMeters,
      rr.constants.maxSpacingMeters,
      set.spacingMeters
    );

    set.circleCount = rr.util.clampInteger(
      overrides.circleCount,
      rr.constants.minCircleCount,
      rr.constants.maxCircleCount,
      set.circleCount
    );

    set.lineWeight = rr.util.clampInteger(
      overrides.lineWeight,
      rr.constants.minLineWeight,
      rr.constants.maxLineWeight,
      set.lineWeight
    );
  }

  return set;
};

rr.model.getSetIndexById = function (setId) {
  for (let i = 0; i < rr.state.ringSets.length; i += 1) {
    if (rr.state.ringSets[i].id === setId) {
      return i;
    }
  }
  return -1;
};

rr.model.getSetById = function (setId) {
  const index = rr.model.getSetIndexById(setId);
  if (index === -1) return null;
  return rr.state.ringSets[index];
};

rr.model.getActiveSet = function () {
  if (!rr.state.activeSetId) return null;
  return rr.model.getSetById(rr.state.activeSetId);
};

rr.model.ensureActiveSet = function () {
  let activeSet = rr.model.getActiveSet();

  if (activeSet) {
    return activeSet;
  }

  if (rr.state.ringSets.length === 0) {
    const newSet = rr.model.createRingSet();
    rr.state.ringSets.push(newSet);
    rr.state.activeSetId = newSet.id;
    return newSet;
  }

  rr.state.activeSetId = rr.state.ringSets[0].id;
  return rr.state.ringSets[0];
};

rr.model.getSetCenterLatLng = function (set) {
  if (
    set.center &&
    typeof set.center.lat === 'number' &&
    typeof set.center.lng === 'number'
  ) {
    return L.latLng(set.center.lat, set.center.lng);
  }

  const mapCenter = window.map.getCenter();
  set.center = {
    lat: mapCenter.lat,
    lng: mapCenter.lng
  };
  rr.storage.save();
  return mapCenter;
};

rr.model.setCenter = function (set, latlng) {
  const center = L.latLng(latlng.lat, latlng.lng);
  set.center = {
    lat: center.lat,
    lng: center.lng
  };
  rr.storage.save();
  rr.render.updateCirclePositions(set, center);
  rr.ui.syncPanel();
};

rr.model.setActiveSet = function (setId) {
  const newSet = rr.model.getSetById(setId);
  if (!newSet) return;
  if (rr.state.activeSetId === setId) return;

  const oldSet = rr.model.getActiveSet();

  rr.state.activeSetId = setId;

  if (oldSet) {
    rr.render.removeResizeHandles(oldSet);
    rr.render.updateSetStyle(oldSet);
  }

  rr.render.updateSetStyle(newSet);
  rr.render.addResizeHandles(newSet);

  rr.storage.save();
  rr.ui.syncPanel();
};

rr.model.addSet = function () {
  const oldActiveSet = rr.model.getActiveSet() || rr.model.ensureActiveSet();
  const baseCenterLatLng = rr.model.getSetCenterLatLng(oldActiveSet);

  const offsetMeters = Math.max(500, Math.min(oldActiveSet.spacingMeters, 5000));
  const latOffset = offsetMeters / 111320;
  const lngOffset =
    offsetMeters / (111320 * Math.cos(baseCenterLatLng.lat * Math.PI / 180));

  const newSet = rr.model.createRingSet({
    center: {
      lat: baseCenterLatLng.lat - latOffset,
      lng: baseCenterLatLng.lng + lngOffset
    },
    spacingMeters: oldActiveSet.spacingMeters,
    circleCount: oldActiveSet.circleCount,
    color: oldActiveSet.color,
    lineWeight: oldActiveSet.lineWeight,
    lineStyle: oldActiveSet.lineStyle
  });

  rr.state.ringSets.push(newSet);
  rr.state.activeSetId = newSet.id;

  rr.render.removeResizeHandles(oldActiveSet);
  rr.render.updateSetStyle(oldActiveSet);
  rr.render.drawSet(newSet);

  rr.storage.save();
  rr.ui.syncPanel();
};

rr.model.deleteActiveSet = function () {
  if (rr.state.ringSets.length <= 1) return;

  const activeIndex = rr.model.getSetIndexById(rr.state.activeSetId);
  if (activeIndex === -1) return;

  const activeSet = rr.state.ringSets[activeIndex];
  rr.render.clearSet(activeSet);

  rr.state.ringSets.splice(activeIndex, 1);

  const nextIndex = Math.max(0, activeIndex - 1);
  const newActiveSet = rr.state.ringSets[nextIndex];
  rr.state.activeSetId = newActiveSet.id;

  rr.render.updateSetStyle(newActiveSet);
  rr.render.rebuildResizeHandles(newActiveSet);

  rr.storage.save();
  rr.ui.syncPanel();
};

rr.storage = {};

rr.storage.load = function () {
  const raw = localStorage.getItem(rr.constants.storageKey);
  if (!raw) {
    rr.state.ringSets = [rr.model.createRingSet()];
    rr.state.activeSetId = rr.state.ringSets[0].id;
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('invalid saved data');
    }

    const panelPosition = parsed.panelPosition;
    if (
      panelPosition &&
      typeof panelPosition.left === 'number' &&
      typeof panelPosition.top === 'number'
    ) {
      rr.defaults.panelPosition = {
        left: panelPosition.left,
        top: panelPosition.top
      };
    }

    if (typeof parsed.panelCollapsed === 'boolean') {
      rr.defaults.panelCollapsed = parsed.panelCollapsed;
    }
    if (typeof parsed.panelVisible === 'boolean') {
      rr.defaults.panelVisible = parsed.panelVisible;
    }

    if (Array.isArray(parsed.ringSets) && parsed.ringSets.length > 0) {
      rr.state.ringSets = parsed.ringSets.map(function (savedSet) {
        return rr.model.createRingSet(savedSet);
      });

      rr.state.activeSetId = parsed.activeSetId || rr.state.ringSets[0].id;
      rr.model.ensureActiveSet();
      return;
    }

    // backward compatibility (old single-set format)
    const oldStyleSet = rr.model.createRingSet({
      center: parsed.center,
      spacingMeters: parsed.spacingMeters || parsed.radiusMeters,
      circleCount: parsed.circleCount,
      color: parsed.color,
      lineWeight: parsed.lineWeight,
      lineStyle: parsed.lineStyle
    });

    rr.state.ringSets = [oldStyleSet];
    rr.state.activeSetId = oldStyleSet.id;
  } catch (err) {
    console.warn('range-rings: failed to parse settings', err);
    rr.state.ringSets = [rr.model.createRingSet()];
    rr.state.activeSetId = rr.state.ringSets[0].id;
  }
};

rr.storage.save = function () {
  const payload = {
    ringSets: rr.state.ringSets.map(function (set) {
      return {
        id: set.id,
        center: set.center,
        spacingMeters: set.spacingMeters,
        circleCount: set.circleCount,
        color: set.color,
        lineWeight: set.lineWeight,
        lineStyle: set.lineStyle
      };
    }),
    activeSetId: rr.state.activeSetId,
    panelPosition: { left: rr.defaults.panelPosition.left, top: rr.defaults.panelPosition.top },
    panelCollapsed: rr.defaults.panelCollapsed === true,
    panelVisible: rr.defaults.panelVisible !== false
  };

  localStorage.setItem(rr.constants.storageKey, JSON.stringify(payload));
};

rr.render = {};

rr.render.clearSet = function (set) {
  if (set.marker) {
    rr.state.layerGroup.removeLayer(set.marker);
    set.marker.off();
    set.marker = null;
  }

  set.circles.forEach(function (circle) {
    rr.state.layerGroup.removeLayer(circle);
  });
  set.circles = [];

  set.resizeHandles.forEach(function (handle) {
    rr.state.layerGroup.removeLayer(handle);
    handle.off();
  });
  set.resizeHandles = [];
};

rr.render.clearAll = function () {
  rr.state.ringSets.forEach(function (set) {
    rr.render.clearSet(set);
  });
};

rr.render.createMarker = function (set, center) {
  set.marker = L.marker(center, {
    draggable: true,
    autoPan: true,
    keyboard: false,
    title: 'Range Rings center',
    icon: rr.state.defaultMarkerIcon
  });

  set.marker.on('click', function () {
    rr.model.setActiveSet(set.id);
  });

  set.marker.on('drag', function (event) {
    rr.render.updateCirclePositions(set, event.target.getLatLng());
  });

  set.marker.on('dragstart', function () {
    if (rr.state.activeSetId !== set.id) {
      rr.state.activeSetId = set.id;
      rr.storage.save();
      rr.ui.syncPanel();
    }
  });

  set.marker.on('dragend', function (event) {
    if (rr.state.activeSetId !== set.id) {
      rr.state.activeSetId = set.id;
    }
    rr.model.setCenter(set, event.target.getLatLng());
  });

  rr.state.layerGroup.addLayer(set.marker);
};

rr.render.updateCirclePositions = function (set, center) {
  if (set.marker) {
    set.marker.setLatLng(center);
  }
  
  set.circles.forEach(function (circle) {
    circle.setLatLng(center);
  });

  set.resizeHandles.forEach(function (handle) {
    const ringIndex = handle._rangeRingIndex;
    const handleRadiusMeters = set.spacingMeters * ringIndex;
    const lngOffset =
      handleRadiusMeters / (111320 * Math.cos(center.lat * Math.PI / 180));
    const handleLatLng = L.latLng(center.lat, center.lng + lngOffset);

    handle.setLatLng(handleLatLng);
  });
};

rr.render.createResizeHandle = function (set, center, ringIndex) {
  const radiusMeters = set.spacingMeters * ringIndex;
  const lngOffset =
    radiusMeters / (111320 * Math.cos(center.lat * Math.PI / 180));
  const handleLatLng = L.latLng(center.lat, center.lng + lngOffset);

  const handle = L.marker(handleLatLng, {
    draggable: true,
    autoPan: true,
    keyboard: false,
    opacity: 0.8,
    title: 'Resize ring spacing',
    icon: rr.ui.getResizeHandleIcon()
  });

  handle._rangeRingIndex = ringIndex;

  handle.on('click', function () {
    rr.model.setActiveSet(set.id);
  });

  handle.on('dragstart', function () {
    if (rr.state.activeSetId !== set.id) {
      rr.state.activeSetId = set.id;
      rr.storage.save();
      rr.ui.syncPanel();
    }
  });

  handle.on('drag', function (event) {
    const draggedHandle = event.target;
    const index = draggedHandle._rangeRingIndex;
    const draggedLatLng = draggedHandle.getLatLng();
    const centerLatLng = rr.model.getSetCenterLatLng(set);
    const distanceMeters = centerLatLng.distanceTo(draggedLatLng);
    const newSpacing = Math.round(distanceMeters / index);

    set.spacingMeters = rr.util.clampInteger(
      newSpacing,
      rr.constants.minSpacingMeters,
      rr.constants.maxSpacingMeters,
      set.spacingMeters
    );

    set.circles.forEach(function (circle, circleIndex) {
      circle.setRadius(set.spacingMeters * (circleIndex + 1));
    });

    set.resizeHandles.forEach(function (handleMarker) {
      if (handleMarker === draggedHandle) return;

      const handleIndex = handleMarker._rangeRingIndex;
      const handleRadiusMeters = set.spacingMeters * handleIndex;
      const lngOffset =
        handleRadiusMeters /
        (111320 * Math.cos(centerLatLng.lat * Math.PI / 180));
      const handleLatLng = L.latLng(
        centerLatLng.lat,
        centerLatLng.lng + lngOffset
      );

      handleMarker.setLatLng(handleLatLng);
    });

    rr.ui.syncPanel();
  });

  handle.on('dragend', function (event) {
    const draggedHandle = event.target;
    const index = draggedHandle._rangeRingIndex;
    const draggedLatLng = draggedHandle.getLatLng();
    const centerLatLng = rr.model.getSetCenterLatLng(set);
    const distanceMeters = centerLatLng.distanceTo(draggedLatLng);
    const newSpacing = Math.round(distanceMeters / index);

    set.spacingMeters = rr.util.clampInteger(
      newSpacing,
      rr.constants.minSpacingMeters,
      rr.constants.maxSpacingMeters,
      set.spacingMeters
    );

    if (rr.state.activeSetId !== set.id) {
      rr.state.activeSetId = set.id;
    }

    rr.render.applySpacingToSet(set);
    rr.storage.save();
    rr.ui.syncPanel();
  });

  rr.state.layerGroup.addLayer(handle);
  set.resizeHandles.push(handle);
};

rr.render.updateSetStyle = function (set) {
  const dashArray = rr.util.getDashArray(set.lineStyle);
  const isActive = set.id === rr.state.activeSetId;
  const circleWeight = isActive ? set.lineWeight + 1 : set.lineWeight;
  const circleOpacity = isActive ? 1.0 : 0.7;

  set.circles.forEach(function (circle) {
    circle.setStyle({
      color: set.color,
      weight: circleWeight,
      opacity: circleOpacity,
      dashArray: dashArray
    });
  });
};

rr.render.removeResizeHandles = function (set) {
  set.resizeHandles.forEach(function (handle) {
    rr.state.layerGroup.removeLayer(handle);
    handle.off();
  });
  set.resizeHandles = [];
};

rr.render.addResizeHandles = function (set) {
  const center = rr.model.getSetCenterLatLng(set);

  for (let i = 1; i <= set.circleCount; i += 1) {
    rr.render.createResizeHandle(set, center, i);
  }
};

rr.render.drawSet = function (set) {
  const center = rr.model.getSetCenterLatLng(set);
  const dashArray = rr.util.getDashArray(set.lineStyle);
  const isActive = set.id === rr.state.activeSetId;
  const circleWeight = isActive ? set.lineWeight + 1 : set.lineWeight;
  const circleOpacity = isActive ? 1.0 : 0.7;

  rr.render.clearSet(set);
  rr.render.createMarker(set, center);

  for (let i = 1; i <= set.circleCount; i += 1) {
    const circle = L.circle(center, {
      radius: set.spacingMeters * i,
      color: set.color,
      weight: circleWeight,
      opacity: circleOpacity,
      fill: false,
      interactive: true,
      dashArray: dashArray
    });

    circle.on('click', function () {
      rr.model.setActiveSet(set.id);
    });

    rr.state.layerGroup.addLayer(circle);
    set.circles.push(circle);
  }

  if (isActive) {
    for (let i = 1; i <= set.circleCount; i += 1) {
      rr.render.createResizeHandle(set, center, i);
    }
  }
};

rr.render.redrawAll = function () {
  if (!rr.state.layerGroup) return;

  if (!rr.state.isLayerEnabled) {
    rr.render.clearAll();
    return;
  }

  rr.state.ringSets.forEach(function (set) {
    rr.render.drawSet(set);
  });
};

rr.render.updateCircleRadii = function (set) {
  set.circles.forEach(function (circle, circleIndex) {
    circle.setRadius(set.spacingMeters * (circleIndex + 1));
  });
};

rr.render.rebuildResizeHandles = function (set) {
  rr.render.removeResizeHandles(set);

  if (set.id === rr.state.activeSetId) {
    rr.render.addResizeHandles(set);
  }
};

rr.render.createCircle = function (set, center, ringIndex) {
  const isActive = set.id === rr.state.activeSetId;
  const circle = L.circle(center, {
    radius: set.spacingMeters * ringIndex,
    color: set.color,
    weight: isActive ? set.lineWeight + 1 : set.lineWeight,
    opacity: isActive ? 1.0 : 0.7,
    fill: false,
    interactive: true,
    dashArray: rr.util.getDashArray(set.lineStyle)
  });

  circle.on('click', function () {
    rr.model.setActiveSet(set.id);
  });

  rr.state.layerGroup.addLayer(circle);
  set.circles.push(circle);
};

rr.render.removeLastCircle = function (set) {
  const circle = set.circles.pop();
  if (!circle) return;

  rr.state.layerGroup.removeLayer(circle);
  circle.off();
};

rr.render.syncCircleCount = function (set) {
  const center = rr.model.getSetCenterLatLng(set);

  while (set.circles.length < set.circleCount) {
    rr.render.createCircle(set, center, set.circles.length + 1);
  }

  while (set.circles.length > set.circleCount) {
    rr.render.removeLastCircle(set);
  }

  rr.render.updateCircleRadii(set);
  rr.render.updateSetStyle(set);
};

rr.render.applySpacingToSet = function (set) {
  rr.render.updateCircleRadii(set);
  rr.render.rebuildResizeHandles(set);
};

rr.ui = {};

rr.ui.getPanelPosition = function () {
  if (!rr.state.panel) {
    return {
      left: rr.defaults.panelPosition.left,
      top: rr.defaults.panelPosition.top
    };
  }

  return {
    left: parseInt(rr.state.panel.style.left || rr.defaults.panelPosition.left, 10),
    top: parseInt(rr.state.panel.style.top || rr.defaults.panelPosition.top, 10)
  };
};

rr.ui.isPanelCollapsed = function () {
  if (!rr.state.panelBody) {
    return rr.defaults.panelCollapsed;
  }

  return rr.state.panelBody.style.display === 'none';
};

rr.ui.isPanelVisible = function () {
  if (!rr.state.panel) {
    return rr.defaults.panelVisible !== false;
  }
  return rr.state.panel.style.display !== 'none';
};

rr.ui.togglePanelVisible = function () {
  rr.defaults.panelVisible = !rr.defaults.panelVisible;
  rr.storage.save();
  rr.ui.syncPanel();
};

rr.ui.getResizeHandleIcon = function () {
  return L.divIcon({
    className: 'range-rings-resize-handle-icon',
    html: '<div class="range-rings-resize-handle-square"></div>',
    iconSize: [10, 10],
    iconAnchor: [5, 5]
  });
};

rr.ui.injectStyles = function () {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.textContent = `
        .range-rings-panel {
          position: absolute;
          z-index: 5000;
          background: rgba(8, 48, 78, 0.95);
          color: #fff;
          font-size: 12px;
          line-height: 1.4;
          width: 280px;
          box-sizing: border-box;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
          user-select: none;
        }

        .range-rings-show-button {
          position: absolute;
          z-index: 5000;
          top: 0;
          left: 20px;
          width: 28px;
          height: 36px;
          padding: 0;
          border: 1px solid rgba(255,255,255,0.25);
          border-top: none;
          border-radius: 0 0 6px 6px;
          background: rgba(8, 48, 78, 0.95);
          color: #fff;
          font-size: 11px;
          font-weight: bold;
          line-height: 1;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.35);
        }

        .range-rings-show-button:hover {
          background: rgba(20, 70, 110, 0.98);
        }
        .range-rings-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: move;
          padding: 6px 8px;
          font-weight: bold;
          background: rgba(255,255,255,0.08);
        }

        .range-rings-header-buttons {
          display: flex;
          gap: 4px;
        }

        .range-rings-header button {
          width: 22px;
          height: 22px;
          padding: 0;
          border: 1px solid rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.08);
          color: #fff;
          cursor: pointer;
        }

        .range-rings-body {
          padding: 8px;
        }

        .range-rings-body label {
          display: block;
          margin-bottom: 8px;
        }

        .range-rings-body input,
        .range-rings-body select,
        .range-rings-body button {
          width: 100%;
          box-sizing: border-box;
          font-size: 12px;
        }

        .range-rings-set-row {
          display: flex;
          gap: 8px;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .range-rings-set-select-wrap label,
        .range-rings-set-controls-wrap label {
          flex: 1 1 0;
          margin-bottom: 0;
        }

        .range-rings-set-row .range-rings-set-select-wrap,
        .range-rings-set-row .range-rings-set-controls-wrap {
          flex: 1 1 0;
          margin-bottom: 0;
        }

        .range-rings-set-controls-buttons {
          display: flex;
          gap: 8px;
        }

        .range-rings-set-controls-buttons button {
          flex: 1 1 0;
        }

        .range-rings-top-row {
          display: flex;
          gap: 8px;
          align-items: end;
          margin-bottom: 8px;
        }

        .range-rings-top-row > label,
        .range-rings-top-row > .range-rings-count-group {
          flex: 1 1 0;
          margin-bottom: 0;
        }

        .range-rings-count-group label {
          display: block;
          margin-bottom: 0;
        }

        .range-rings-count-label {
          margin-bottom: 2px;
        }

        .range-rings-style-row {
          display: flex;
          gap: 8px;
          align-items: end;
          margin-bottom: 8px;
        }

        .range-rings-style-row label {
          flex: 1 1 0;
          margin-bottom: 0;
        }

        .range-rings-style-row input,
        .range-rings-style-row select {
          width: 100%;
        }

        .range-rings-actions-row {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        .range-rings-actions-row button {
          flex: 1 1 0;
        }

        .range-rings-resize-handle-icon {
          background: transparent;
          border: none;
        }

        .range-rings-resize-handle-square {
          width: 10px;
          height: 10px;
          box-sizing: border-box;
          background: #ffffff;
          border: 1px solid #000000;
        }
      `;
  document.head.appendChild(style);
};

rr.ui.populateSetSelect = function () {
  if (!rr.state.panel) return;

  const select = rr.state.panel.querySelector('.range-rings-set-select');
  if (!select) return;

  select.innerHTML = '';

  rr.state.ringSets.forEach(function (set, index) {
    const option = document.createElement('option');
    option.value = set.id;
    option.textContent = rr.util.getSetDisplayName(set, index);
    if (set.id === rr.state.activeSetId) {
      option.selected = true;
    }
    select.appendChild(option);
  });
};

rr.ui.hideAllPanelUi = function () {
  if (rr.state.panel) {
    rr.state.panel.style.display = 'none';
  }
  if (rr.state.showButton) {
    rr.state.showButton.style.display = 'none';
  }
};

rr.ui.syncPanel = function () {
  if (!rr.state.panel) return;

  const activeSet = rr.model.ensureActiveSet();
  const panel = rr.state.panel;

  if (!rr.state.isLayerEnabled) {
    rr.ui.hideAllPanelUi();
    return;
  }

  rr.ui.populateSetSelect();

  const spacingInput = panel.querySelector('.range-rings-spacing');
  const countInput = panel.querySelector('.range-rings-count');
  const countValue = panel.querySelector('.range-rings-count-value');
  const colorInput = panel.querySelector('.range-rings-color');
  const weightInput = panel.querySelector('.range-rings-weight');
  const styleInput = panel.querySelector('.range-rings-style');
  const collapseButton = panel.querySelector('.range-rings-collapse');
  const deleteButton = panel.querySelector('.range-rings-delete-set');
  const hideButton = panel.querySelector('.range-rings-hide');
  const showButton = rr.state.showButton;

  if (spacingInput) spacingInput.value = String(activeSet.spacingMeters);
  if (countInput) countInput.value = String(activeSet.circleCount);
  if (countValue) countValue.textContent = String(activeSet.circleCount);
  if (colorInput) colorInput.value = activeSet.color;
  if (weightInput) weightInput.value = String(activeSet.lineWeight);
  if (styleInput) styleInput.value = activeSet.lineStyle;
  if (deleteButton) deleteButton.disabled = rr.state.ringSets.length <= 1;

  if (rr.state.panelBody) {
    rr.state.panelBody.style.display = rr.defaults.panelCollapsed ? 'none' : 'block';
  }

  if (collapseButton) {
    collapseButton.textContent = rr.defaults.panelCollapsed ? '+' : '−';
    collapseButton.title = rr.defaults.panelCollapsed ? 'Show panel' : 'Hide panel';
  }

  if (hideButton) {
    hideButton.title = 'Hide panel';
  }
  const panelVisible = rr.defaults.panelVisible !== false;
  panel.style.display = panelVisible ? 'block' : 'none';
  if (showButton) {
    const mapWidth = panel.parentNode ? panel.parentNode.clientWidth : 0;
    const desiredLeft = rr.defaults.panelPosition.left;
    const maxLeft = Math.max(0, mapWidth - 28);
    const clampedLeft = Math.max(0, Math.min(desiredLeft, maxLeft));

    showButton.style.display = panelVisible ? 'none' : 'block';
    showButton.style.left = clampedLeft + 'px';
    showButton.style.top = '0px';
  }

  panel.style.left = rr.defaults.panelPosition.left + 'px';
  panel.style.top = rr.defaults.panelPosition.top + 'px';
};

rr.ui.togglePanelCollapsed = function () {
  rr.defaults.panelCollapsed = !rr.defaults.panelCollapsed;
  rr.storage.save();
  rr.ui.syncPanel();
};

rr.ui.installPanel = function () {
  const mapContainer = window.map.getContainer();
  if (!mapContainer) return;

  if (window.getComputedStyle(mapContainer).position === 'static') {
    mapContainer.style.position = 'relative';
  }

  // Inspired by the restore tab in Zaso's IITC Bookmarks plugin.
  // The panel can tuck away, but a small visible tab remains so the
  // user still has an obvious way to bring it back. Thanks, Zaso!
  const panel = document.createElement('div');
  panel.className = 'range-rings-panel';
  panel.innerHTML = `
        <div class="range-rings-header">
          <span>${rr.constants.panelTitle}</span>
          <div class="range-rings-header-buttons">
            <button type="button" class="range-rings-collapse" title="Hide panel">−</button>
            <button type="button" class="range-rings-hide" title="Hide panel">×</button>
          </div>
        </div>
        <div class="range-rings-body">
          <div class="range-rings-set-row">
            <label class="range-rings-set-select-wrap">
              Ring Set
              <select class="range-rings-set-select"></select>
            </label>
            <div class="range-rings-set-controls-wrap">
              <label>
                Set Controls
                <div class="range-rings-set-controls-buttons">
                  <button type="button" class="range-rings-new-set">New Set</button>
                  <button type="button" class="range-rings-delete-set">Delete</button>
                </div>
              </label>
            </div>
          </div>

          <div class="range-rings-top-row">
            <label>
              Ring Spacing (meters)
              <input class="range-rings-spacing" type="number" min="0" step="500">
            </label>

            <div class="range-rings-count-group">
              <div class="range-rings-count-label">
                No. of Circles: <span class="range-rings-count-value"></span>
              </div>
              <label>
                <input class="range-rings-count" type="range" min="1" max="50" step="1">
              </label>
            </div>
          </div>

          <div class="range-rings-style-row">
            <label>
              Line Color
              <input class="range-rings-color" type="color">
            </label>

            <label>
              Line Width
              <input class="range-rings-weight" type="number" min="1" max="10" step="1">
            </label>

            <label>
              Line Style
              <select class="range-rings-style">
                <option value="solid">solid</option>
                <option value="dashed">dashed</option>
                <option value="dotted">dotted</option>
              </select>
            </label>
          </div>

          <div class="range-rings-actions-row">
            <button class="range-rings-use-center" type="button">Center on Map Center</button>
          </div>
        </div>
      `;

  mapContainer.appendChild(panel);

  const showButton = document.createElement('button');
  showButton.type = 'button';
  showButton.className = 'range-rings-show-button';
  showButton.textContent = 'RR';
  showButton.title = 'Show Range Rings panel';
  showButton.setAttribute('aria-label', 'Show Range Rings panel');
  mapContainer.appendChild(showButton);

  L.DomEvent.disableClickPropagation(panel);
  L.DomEvent.disableScrollPropagation(panel);

  rr.state.panel = panel;
  rr.state.panelBody = panel.querySelector('.range-rings-body');
  rr.state.showButton = showButton;

  const header = panel.querySelector('.range-rings-header');
  const collapseButton = panel.querySelector('.range-rings-collapse');
  const hideButton = panel.querySelector('.range-rings-hide');
  const setSelect = panel.querySelector('.range-rings-set-select');
  const newSetButton = panel.querySelector('.range-rings-new-set');
  const deleteSetButton = panel.querySelector('.range-rings-delete-set');
  const spacingInput = panel.querySelector('.range-rings-spacing');
  const countInput = panel.querySelector('.range-rings-count');
  const colorInput = panel.querySelector('.range-rings-color');
  const weightInput = panel.querySelector('.range-rings-weight');
  const styleInput = panel.querySelector('.range-rings-style');
  const useCenterButton = panel.querySelector('.range-rings-use-center');

  [
    header,
    collapseButton,
    hideButton,
    setSelect,
    newSetButton,
    deleteSetButton,
    spacingInput,
    countInput,
    colorInput,
    weightInput,
    styleInput,
    useCenterButton
  ].forEach(function (el) {
    if (!el) return;
    L.DomEvent.on(el, 'mousedown touchstart pointerdown wheel', function (event) {
      L.DomEvent.stopPropagation(event);
    });
  });

  L.DomEvent.on(showButton, 'mousedown touchstart pointerdown wheel', function (event) {
    L.DomEvent.stopPropagation(event);
  });

  collapseButton.addEventListener('click', function (event) {
    event.stopPropagation();
    rr.ui.togglePanelCollapsed();
  });

  hideButton.addEventListener('click', function (event) {
    event.stopPropagation();
    rr.ui.togglePanelVisible();
  });

  showButton.addEventListener('click', function (event) {
    event.stopPropagation();
    if (rr.defaults.panelVisible === false) {
      rr.defaults.panelVisible = true;
      rr.storage.save();
      rr.ui.syncPanel();
    }
  });

  setSelect.addEventListener('change', function () {
    rr.model.setActiveSet(setSelect.value);
  });

  newSetButton.addEventListener('click', function () {
    rr.model.addSet();
  });

  deleteSetButton.addEventListener('click', function () {
    rr.model.deleteActiveSet();
  });

  spacingInput.addEventListener('input', function () {
    rr.actions.setSpacing(spacingInput.value);
  });

  spacingInput.addEventListener('change', function () {
    rr.actions.setSpacing(spacingInput.value);
  });

  spacingInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      rr.actions.setSpacing(spacingInput.value);
    }
  });

  countInput.addEventListener('input', function () {
    rr.actions.setCircleCount(countInput.value);
  });

  colorInput.addEventListener('input', function () {
    rr.actions.setColor(colorInput.value);
  });

  weightInput.addEventListener('change', function () {
    rr.actions.setLineWeight(weightInput.value);
  });

  weightInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      rr.actions.setLineWeight(weightInput.value);
    }
  });

  styleInput.addEventListener('change', function () {
    rr.actions.setLineStyle(styleInput.value);
  });

  useCenterButton.addEventListener('click', function () {
    rr.actions.centerOnMapCenter();
  });

  rr.interaction.makePanelDraggable(header, panel);
  rr.ui.syncPanel();
};

rr.actions = {};

rr.actions.setSpacing = function (value) {
    const activeSet = rr.model.ensureActiveSet();
    activeSet.spacingMeters = rr.util.clampInteger(
      value,
      rr.constants.minSpacingMeters,
      rr.constants.maxSpacingMeters,
      activeSet.spacingMeters
    );
    rr.storage.save();
    rr.render.applySpacingToSet(activeSet);
    rr.ui.syncPanel();
  };

rr.actions.setCircleCount = function (value) {
  const activeSet = rr.model.ensureActiveSet();
  activeSet.circleCount = rr.util.clampInteger(
    value,
    rr.constants.minCircleCount,
    rr.constants.maxCircleCount,
    activeSet.circleCount
  );
  rr.storage.save();
  rr.render.syncCircleCount(activeSet);
  rr.render.rebuildResizeHandles(activeSet);
  rr.ui.syncPanel();
};

rr.actions.setColor = function (value) {
  const activeSet = rr.model.ensureActiveSet();
  if (!rr.util.isValidColor(value)) return;
  activeSet.color = value;
  rr.storage.save();
  rr.render.updateSetStyle(activeSet);
  rr.ui.syncPanel();
};

rr.actions.setLineWeight = function (value) {
  const activeSet = rr.model.ensureActiveSet();
  activeSet.lineWeight = rr.util.clampInteger(
    value,
    rr.constants.minLineWeight,
    rr.constants.maxLineWeight,
    activeSet.lineWeight
  );
  rr.storage.save();
  rr.render.updateSetStyle(activeSet);
  rr.ui.syncPanel();
};

rr.actions.setLineStyle = function (value) {
  const activeSet = rr.model.ensureActiveSet();
  if (!rr.util.isValidLineStyle(value)) return;
  activeSet.lineStyle = value;
  rr.storage.save();
  rr.render.updateSetStyle(activeSet);
  rr.ui.syncPanel();
};

rr.actions.centerOnMapCenter = function () {
  const activeSet = rr.model.ensureActiveSet();
  rr.model.setCenter(activeSet, window.map.getCenter());
};

rr.interaction = {};

rr.interaction.makePanelDraggable = function (handle, panel) {
  let dragging = false;
  let startMouseX = 0;
  let startMouseY = 0;
  let startLeft = 0;
  let startTop = 0;

  const onMouseMove = function (event) {
    if (!dragging) return;

    const newLeft = startLeft + (event.clientX - startMouseX);
    const newTop = startTop + (event.clientY - startMouseY);

    rr.defaults.panelPosition.left = Math.max(0, newLeft);
    rr.defaults.panelPosition.top = Math.max(0, newTop);

    panel.style.left = rr.defaults.panelPosition.left + 'px';
    panel.style.top = rr.defaults.panelPosition.top + 'px';
  };

  const onMouseUp = function () {
    if (!dragging) return;
    dragging = false;
    rr.storage.save();
    document.removeEventListener('mousemove', onMouseMove, true);
    document.removeEventListener('mouseup', onMouseUp, true);
  };

  handle.addEventListener('mousedown', function (event) {
    if (event.button !== 0) return;
    if (event.target.tagName === 'BUTTON') return;

    dragging = true;
    startMouseX = event.clientX;
    startMouseY = event.clientY;
    startLeft = rr.defaults.panelPosition.left;
    startTop = rr.defaults.panelPosition.top;

    document.addEventListener('mousemove', onMouseMove, true);
    document.addEventListener('mouseup', onMouseUp, true);

    event.preventDefault();
    event.stopPropagation();
  });
};

rr.interaction.onLayerAdd = function () {
  rr.state.isLayerEnabled = true;
  rr.ui.syncPanel();
  rr.render.redrawAll();
};

rr.interaction.onLayerRemove = function () {
  rr.state.isLayerEnabled = false;
  rr.ui.hideAllPanelUi();
  rr.render.clearAll();
};

rr.interaction.setupLayerTracking = function () {
  window.map.on('layeradd', function (event) {
    if (event.layer === rr.state.layerGroup) {
      rr.interaction.onLayerAdd();
    }
  });

  window.map.on('layerremove', function (event) {
    if (event.layer === rr.state.layerGroup) {
      rr.interaction.onLayerRemove();
    }
  });
};

  rr.setup = function () {
    rr.storage.load();
    rr.model.ensureActiveSet();
    rr.ui.injectStyles();
    rr.state.defaultMarkerIcon = new L.Icon.Default();
    rr.state.layerGroup = new L.LayerGroup();
    rr.interaction.setupLayerTracking();
    window.addLayerGroup(rr.constants.layerName, rr.state.layerGroup, true);
    rr.ui.installPanel();
    rr.state.isLayerEnabled = window.map.hasLayer(rr.state.layerGroup);
    if (rr.state.isLayerEnabled) {
      rr.render.redrawAll();
    }
//  window.bootPlugins.push(setup);
  }
  const setup = rr.setup;
  setup.info = plugin_info; // add the script info data to the function as a property

  if (!window.bootPlugins) window.bootPlugins = [];
  window.bootPlugins.push(setup);

  // if IITC has already booted, immediately run the setup function
  if (window.iitcLoaded && typeof setup === 'function') setup();

} // wrapper end

// inject code into site context
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
