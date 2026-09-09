// ==UserScript==
// @author          Falenone, Codex
// @name            GlobeView
// @category        Map
// @version         1.0
// @description     A Cesium-based 3D globe view for IITC with portals, links, fields, visual effects, and configurable performance options.
// @id              globe-view@Falenone
// @namespace       https://github.com/IITC-CE/ingress-intel-total-conversion
// @homepageURL     https://github.com/Falenone/IITC-Globeview
// @issueTracker    https://github.com/Falenone/IITC-Globeview/issues
// @updateURL       https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/Falenone/globe-view.meta.js
// @downloadURL     https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/Falenone/globe-view.user.js
// @icon            https://raw.githubusercontent.com/Falenone/IITC-Globeview/b3f346f0b708a24e6a905325523dc4ef9dcbf093/assets/globeicon.svg
// @match           https://intel.ingress.com/*
// @match           https://intel-x.ingress.com/*
// @grant           none
// ==/UserScript==


function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'local';
plugin_info.dateTimeVersion = 'None';
plugin_info.pluginId = 'globe-view';
//END PLUGIN AUTHORS NOTE

/* global Cesium, IITC, L -- eslint */
/* exported setup --eslint */


var globeView = {};
window.plugin.globeView = globeView;

globeView.CESIUM_VERSION = '1.144';
globeView.PROJECT_URL = 'https://github.com/';
globeView.CESIUM_URL = 'https://cesium.com/';
globeView.CESIUM_FAVICON_DATA_URI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+CiAgICA8Y2lyY2xlIGN4PSIyNTYiIGN5PSIyNTYiIHI9IjI1NiIgZmlsbD0iI2ZmZiIvPgogICAgPHBhdGggZD0iTTI1NiAzMkMxMzIuMjg4IDMyIDMyIDEzMi4yODYgMzIgMjU2YTIyNCAyMjQgMCAwIDAgNy40MSA1Ni41NjRjLjEyNy4xMTQuMjYuMjM3LjM3OS4zMzYgNC4xMjggMy40MSA4Ljk0IDUuMTYgMTMuOCA1LjE2IDcuNDMgMCAxNC41OTUtNC4wOTQgMjAuMi0xMS41bDcwLjYwMS05My4zMDFjMTEuNjgyLTE1LjQzOCAyOC4zLTI0LjI5OSA0NS41LTI0LjI5OXMzMy43NCA4Ljg5NSA0NS41IDI0LjI5OWMxMC40MjggMTMuNjU5IDQ1LjA3MyA1OS42NjUgNjcuNzk5IDg5LjcwMS45MzIgMS4yMzIgMS45NDcgMi40IDIuOTIgMy42IDYuMTYgNy41OTQgMTIuNyAxMS41IDIwIDExLjUgNy41OTEgMCAxMy41MDUtMy42NTYgMjAtMTEuNS45OTMtMS4yIDIuMDM4LTIuMzYgMi45OC0zLjYgMjIuOTIyLTMwLjE1OSA1Ny4zNTUtNzUuOTM1IDY3LjgwMS04OS43MDEgMTEuNzAzLTE1LjQyMiAyOC4zLTI0LjI5OSA0NS41LTI0LjI5OSAyLjQzNyAwIDQuODc4LjMgNy4yODcuNjJDNDQwLjYwOCA5NS45NTIgMzU0LjAzNCAzMi4xMDcgMjU2IDMyem03NS4wNSA5NS4wNWEyMy41MjUgMjMuNTI1IDAgMCAxIDIzLjUyNiAyMy41MjcgMjMuNTI1IDIzLjUyNSAwIDAgMS0yMy41MjYgMjMuNTI2IDIzLjUyNSAyMy41MjUgMCAwIDEtMjMuNTI1LTIzLjUyNiAyMy41MjUgMjMuNTI1IDAgMCAxIDIzLjUyNS0yMy41Mjd6IiBmaWxsPSIjNmRhYmU0Ii8+CiAgICA8cGF0aCBkPSJNNDc4LjAxMSAyMjguMzk4Yy00LjY2Ni00LjM5OS0xMC4wOS02LjUzOC0xNi4xNTgtNi41MzgtOS4xMTQgMC0xNS4wMjcgNC43OS0yMC45NTMgMTEuNjRsLTcwLjQgOTMuM2MtMTEuNjk4IDE1LjUwMi0yOC4yIDI0LjI5OS00NS40IDI0LjI5OWgtLjI2OGMtMTcuMiAwLTMzLjc2Mi04Ljg3Ny00NS4zOTktMjQuM2wtNzAuNC05My4zYy01LjU5Ni03LjQxNi0xMi43LTExLjUtMjAuMS0xMS41LTcuMzYgMC0xNC41NTMgNC4xNDYtMjAuMTAxIDExLjVsLTcwLjM5OSA5My4zYy0xMS41NiAxNS4zMi0yNy44ODUgMjQuMzI5LTQ0Ljk3NiAyNC4zQzkwLjMgNDI5LjY3MyAxNjkuMjE2IDQ3OS44OTUgMjU2IDQ3OS45OTljMTIzLjcxMSAwIDIyNC0xMDAuMjg4IDIyNC0yMjRhMjI0LjAwNyAyMjQuMDA3IDAgMCAwLTEuOTg5LTI3LjYwMXoiIGZpbGw9IiM3MDljNDkiLz4KPC9zdmc+Cg==';
globeView.CESIUM_BASE_URL = 'https://cesium.com/downloads/cesiumjs/releases/' + globeView.CESIUM_VERSION + '/Build/Cesium/';
globeView.CESIUM_SCRIPT_URL = globeView.CESIUM_BASE_URL + 'Cesium.js';
globeView.FALLBACK_TILE_URL = 'https://tile.openstreetmap.org/';
globeView.active = false;
globeView.viewer = null;
globeView.container = null;
globeView.linkEntities = {};
globeView.linkBaseCollection = null;
globeView.linkBaseMaterials = {};
globeView.fieldEntities = {};
globeView.areaSelectionEntity = null;
globeView.areaSelectionActive = false;
globeView.areaSelectionPoints = [];
globeView.excludedFieldGuids = {};
globeView.pinnedPortalGuids = {};
globeView.portalCompositionCache = null;
globeView.compositionDataRevision = 0;
globeView.selectedFieldGuid = null;
globeView.linkEndpointPrimitives = null;
globeView.syncTimer = null;
globeView.linkGeometryTimer = null;
globeView.lastLinkGeometryHeight = null;
globeView.lastPortalDetailMode = null;
globeView.fieldSyncTimer = null;
globeView.mapSyncTimer = null;
globeView.commPortalFollowTimer = null;
globeView.cesiumPromise = null;
globeView.activationToken = 0;
globeView.INITIAL_CAMERA_HEIGHT = 9000000;
globeView.initialMapZoom = null;
globeView.ARC_HEIGHT_RATIO = 0.015;
globeView.MIN_ARC_HEIGHT = 5;
globeView.MAX_ARC_HEIGHT = 75000;
globeView.OVERVIEW_ARC_CAMERA_HEIGHT = 1500000;
globeView.OVERVIEW_ARC_LIFT_RATIO = 0.012;
globeView.SCREENSHOT_MSAA_SAMPLES = 4;
globeView.NEBULA_MIN_CAMERA_HEIGHT = 8500000;
globeView.CLOSE_SPACE_BACKGROUND_HEIGHT = 300000;
globeView.MIN_TILE_BRIGHTNESS = 0.25;
globeView.MAX_TILE_BRIGHTNESS = 0.6;
globeView.PORTAL_BILLBOARD_LIMIT = 400;
globeView.PORTAL_DETAIL_CAMERA_HEIGHT = 2000000;
globeView.FIELD_HEIGHT = 15000;
globeView.LINK_SURFACE_HEIGHT = globeView.FIELD_HEIGHT + 1000;
globeView.LINK_HEIGHT_LOD_END = 6000000;
globeView.GLOBE_RESONANCE_TRAVEL_MS = 10000;
  globeView.GLOBE_RESONANCE_CYCLE_MS = 30000;
globeView.GLOBE_RESONANCE_MIN_CAMERA_HEIGHT = 250000;
// A full-degree ring keeps the sweep round even when the globe fills the viewport.
globeView.GLOBE_RESONANCE_SEGMENTS = 360;
globeView.debugFocusEntity = null;
globeView.debugViewEntity = null;
globeView.debugCoverageEntity = null;
globeView.debugTileEntities = [];
globeView.MAX_DEBUG_TILES = 200;
globeView.portalPrimitives = null;
globeView.polarAuroraCollection = null;
globeView.portalBeaconCollection = null;
globeView.portalBeaconMaterials = {};
globeView.globeGridCollection = null;
globeView.cloudVeilLayer = null;
globeView.globeResonanceEntities = [];
globeView.globeResonanceStartedAt = 0;
globeView.resonanceEntities = [];
globeView.entryGlowTimer = null;
globeView.portalRenderMode = null;
globeView.portalSyncTimer = null;
globeView.portalHeightTimer = null;
globeView.portalPositionHeight = null;
globeView.portalCount = 0;
globeView.fieldCount = 0;
globeView.portalIconCache = {};
globeView.nebulaStage = null;
globeView.lastSunUpdateTime = 0;
globeView.SUN_CSS_UPDATE_INTERVAL = 16;
globeView.solarScreenPosition = null;
globeView.solarEyePosition = null;
globeView.globeRimScreenPosition = null;
globeView.hoverCursorTimer = null;
globeView.hoverCursorPosition = null;
globeView.cameraMoving = false;
globeView.autoStartTimer = null;
globeView.autoStartPending = false;
globeView.fps = 0;
globeView.fpsFrameCount = 0;
globeView.fpsSampleTime = 0;
globeView.normalMsaaSamples = null;
globeView.activeMsaaSamples = 1;
globeView.selectedPortalEntity = null;
globeView.lastAutoRotateTime = 0;
globeView.lastScreenshotPresentationTime = 0;
globeView.SETTINGS_KEY = 'plugin-globeview-settings';
globeView.CAMERA_STATE_KEY = 'plugin-globeview-last-camera';
globeView.restoreSavedView = false;
globeView.VOLATILE_FIELD_FILTER_MODES = ['area', 'selectedPortal', 'pinnedPortals', 'selectedField', 'nested', 'parents', 'family'];
globeView.DEFAULT_SETTINGS = {
  arcHeight: 1,
  autoStartGlobe: false,
  atmosphere: true,
  atmosphericEntryGlow: true,
  autoRotate: false,
  autoRotateSpeed: 0.03,
  bloom: false,
  bloomIntensity: 1,
  cinematicFlyIn: false,
  debugCoverage: false,
  debugFocus: false,
  debugPanel: false,
  debugTiles: false,
  debugView: false,
  fog: false,
  fieldOpacity: 1,
  fieldMotion: true,
  fieldDepthHaze: false,
  fieldCaustics: false,
  fieldShimmerIntensity: 0.45,
  fieldAreaRule: 'vertices',
  fieldFilterMode: 'all',
  fieldStyle: 'glass',
  factionResonance: true,
  fxaa: true,
  globeGrid: true,
  globeResonanceSweep: true,
  globeUi: true,
  linkOpacity: 0.9,
  linkEndpointColor: '#ffffff',
  linkEndpoints: false,
  linkFlow: false,
  linkFlowEnlColor: '#71ff71',
  linkFlowResColor: '#00aaff',
  linkFlowMachinaColor: '#ff1744',
  linkFlowOpacity: 1,
  linkFlowPulse: 'long',
  linkStyle: 'arc',
  linkWidth: 1,
  manualTime: 12,
  nightShading: true,
  portals: 'auto',
  portalSize: 12,
  showLinks: true,
  showFields: true,
  showEnlightenedFields: true,
  showResistanceFields: true,
  screenshotMode: false,
  screenshotGlow: true,
  screenshotPresentation: 'off',
  screenshotOrbitSpeed: 0.012,
  cloudVeil: true,
  spaceBackdrop: true,
  spaceMotion: true,
  maxPortals: 3000,
  nebula: true,
  advancedNebula: true,
  nebulaDust: 0.5,
  nebulaDensity: 1,
  nebulaMotion: true,
  nebulaPalette: 'cosmic',
  performanceProfile: 'balanced',
  portalLod: true,
  portalOutline: '#05080b',
  portalOutlineWidth: 1,
  portalBeacons: true,
  portalBeaconIntensity: 0.55,
  portalBeaconMode: 'selected',
  polarAurora: true,
  polarAuroraIntensity: 0.45,
  polarAuroraMotion: true,
  polarAuroraPalette: 'arctic',
  shootingStars: true,
  shootingStarDensity: 0.35,
  selectedPulse: true,
  showPortalOutline: true,
  starDensity: 1.25,
  starFlicker: true,
  starFlickerSpeed: 0.0175,
  starSize: 3,
  sun: true,
  sunGlow: 1,
  solarRimFlare: true,
  timeMode: 'live',
  flyToSelected: false,
  tileBrightness: 0.5,
  tileContrast: 1,
  tileSaturation: 1,
};

globeView.loadSettings = function () {
  var stored = {};
  var resetVolatileFilter = false;
  try {
    stored = JSON.parse(localStorage[globeView.SETTINGS_KEY] || '{}');
  } catch (error) {
    console.warn('Globe view: unable to read settings', error);
  }
  var isFirstInstall = Object.keys(stored).length === 0;
  if (stored.performanceProfile === 'battery') stored.performanceProfile = 'low';
  // Render scale is now always Device; discard the retired stored control.
  delete stored.renderScale;
  delete stored.cloudVeilMotion;
  delete stored.linkAtmosphericFade;
  delete stored.atmosphericScattering;
  globeView.settings = Object.assign({}, globeView.DEFAULT_SETTINGS, stored);
  if (isFirstInstall) globeView.settings = Object.assign(globeView.settings, globeView.getPerformanceProfile('balanced'));
  // New visual accents inherit the active named profile on upgrade, while a
  // Custom profile keeps the feature defaults until the user chooses them.
  var storedProfile = globeView.getPerformanceProfile(globeView.settings.performanceProfile);
  ['atmosphericEntryGlow', 'globeGrid', 'globeResonanceSweep', 'cloudVeil', 'factionResonance'].forEach(function (name) {
    if (!Object.prototype.hasOwnProperty.call(stored, name) && storedProfile && Object.prototype.hasOwnProperty.call(storedProfile, name)) {
      globeView.settings[name] = storedProfile[name];
    }
  });
  // Preserve explicit choices, but soften the old bright flow defaults on upgrade.
  if (Number(stored.linkFlowOpacity) === 0.35) globeView.settings.linkFlowOpacity = globeView.DEFAULT_SETTINGS.linkFlowOpacity;
  if (['short', 'medium', 'long'].indexOf(globeView.settings.linkFlowPulse) === -1) globeView.settings.linkFlowPulse = globeView.DEFAULT_SETTINGS.linkFlowPulse;
  if (globeView.settings.linkStyle === 'tactical') globeView.settings.linkStyle = 'flatter';
  if (['arc', 'flatter', 'flat'].indexOf(globeView.settings.linkStyle) === -1) globeView.settings.linkStyle = globeView.DEFAULT_SETTINGS.linkStyle;
  globeView.settings.tileBrightness = Math.min(
    globeView.MAX_TILE_BRIGHTNESS,
    Math.max(globeView.MIN_TILE_BRIGHTNESS, Number(globeView.settings.tileBrightness) || globeView.DEFAULT_SETTINGS.tileBrightness)
  );
  globeView.settings.bloomIntensity = Math.max(
    0.25,
    Math.min(2, Number(globeView.settings.bloomIntensity) || globeView.DEFAULT_SETTINGS.bloomIntensity)
  );
  var auroraIntensity = Number(globeView.settings.polarAuroraIntensity);
  globeView.settings.polarAuroraIntensity = Math.max(
    0,
    Math.min(1, Number.isFinite(auroraIntensity) ? auroraIntensity : globeView.DEFAULT_SETTINGS.polarAuroraIntensity)
  );
  if (['arctic', 'violet', 'ice'].indexOf(globeView.settings.polarAuroraPalette) === -1) {
    globeView.settings.polarAuroraPalette = globeView.DEFAULT_SETTINGS.polarAuroraPalette;
  }
  delete globeView.settings.twilightBand;
  delete globeView.settings.twilightIntensity;
  delete globeView.settings.fieldBoundaryTracer;
  delete globeView.settings.fieldTracerIntensity;
  if (globeView.settings.fieldStyle === 'aurora') globeView.settings.fieldStyle = 'shimmer';
  if (['glass', 'shimmer', 'prism', 'canopy'].indexOf(globeView.settings.fieldStyle) === -1) {
    globeView.settings.fieldStyle = globeView.DEFAULT_SETTINGS.fieldStyle;
  }
  var shimmerIntensity = Number(globeView.settings.fieldShimmerIntensity);
  globeView.settings.fieldShimmerIntensity = Math.max(0, Math.min(1, Number.isFinite(shimmerIntensity) ? shimmerIntensity : globeView.DEFAULT_SETTINGS.fieldShimmerIntensity));
  var nebulaDust = Number(globeView.settings.nebulaDust);
  globeView.settings.nebulaDust = Math.max(0, Math.min(1, Number.isFinite(nebulaDust) ? nebulaDust : globeView.DEFAULT_SETTINGS.nebulaDust));
  var shootingDensity = Number(globeView.settings.shootingStarDensity);
  globeView.settings.shootingStarDensity = Math.max(0, Math.min(1, Number.isFinite(shootingDensity) ? shootingDensity : globeView.DEFAULT_SETTINGS.shootingStarDensity));
  if (['off', 'orbit', 'flyIn'].indexOf(globeView.settings.screenshotPresentation) === -1) {
    globeView.settings.screenshotPresentation = globeView.DEFAULT_SETTINGS.screenshotPresentation;
  }
  var orbitSpeed = Number(globeView.settings.screenshotOrbitSpeed);
  globeView.settings.screenshotOrbitSpeed = Math.max(0.002, Math.min(0.06, Number.isFinite(orbitSpeed) ? orbitSpeed : globeView.DEFAULT_SETTINGS.screenshotOrbitSpeed));
  var beaconIntensity = Number(globeView.settings.portalBeaconIntensity);
  globeView.settings.portalBeaconIntensity = Math.max(0, Math.min(1, Number.isFinite(beaconIntensity) ? beaconIntensity : globeView.DEFAULT_SETTINGS.portalBeaconIntensity));
  if (['selected', 'highLevel'].indexOf(globeView.settings.portalBeaconMode) === -1) {
    globeView.settings.portalBeaconMode = globeView.DEFAULT_SETTINGS.portalBeaconMode;
  }
  if (['live', 'manual'].indexOf(globeView.settings.timeMode) === -1) globeView.settings.timeMode = 'live';
  if (globeView.VOLATILE_FIELD_FILTER_MODES.indexOf(globeView.settings.fieldFilterMode) !== -1) {
    globeView.settings.fieldFilterMode = 'all';
    resetVolatileFilter = true;
  }
  if (resetVolatileFilter) globeView.saveSettings();
};

globeView.saveSettings = function () {
  try {
    localStorage[globeView.SETTINGS_KEY] = JSON.stringify(globeView.settings);
  } catch (error) {
    console.warn('Globe view: unable to save settings', error);
  }
};

globeView.getPerformanceProfile = function (name) {
  var energyFlowDefaults = {
    linkFlowEnlColor: '#71ff71',
    linkFlowResColor: '#00aaff',
    linkFlowMachinaColor: '#ff1744',
    linkFlowOpacity: 1,
    linkFlowPulse: 'long',
  };
  var profiles = {
    low: Object.assign({
      atmosphere: false,
      atmosphericEntryGlow: false,
      bloom: false,
      fxaa: false,
      fog: false,
      globeGrid: false,
      nightShading: false,
      sun: false,
      solarRimFlare: false,
      spaceBackdrop: false,
      spaceMotion: false,
      nebula: false,
      cloudVeil: false,
      advancedNebula: false,
      nebulaDust: 0,
      nebulaMotion: false,
      starFlicker: false,
      polarAurora: false,
      polarAuroraMotion: false,
      fieldDepthHaze: false,
      fieldCaustics: false,
      screenshotMode: false,
      screenshotGlow: false,
      screenshotPresentation: 'off',
      fieldFilterMode: 'all',
      fieldAreaRule: 'vertices',
      cinematicFlyIn: false,
      linkStyle: 'flat',
      linkEndpoints: false,
      linkFlow: false,
      fieldOpacity: 1,
      fieldStyle: 'glass',
      fieldMotion: false,
      factionResonance: false,
      globeResonanceSweep: false,
      portalBeacons: false,
      selectedPulse: false,
      showPortalOutline: false,
      portalLod: false,
      shootingStars: false,
      shootingStarDensity: 0,
    }, energyFlowDefaults),
    balanced: Object.assign({
      atmosphere: true,
      atmosphericEntryGlow: true,
      bloom: false,
      bloomIntensity: 1,
      fog: false,
      globeGrid: false,
      fxaa: true,
      nightShading: true,
      sun: true,
      sunGlow: 1,
      solarRimFlare: false,
      spaceBackdrop: true,
      spaceMotion: false,
      nebula: false,
      cloudVeil: false,
      advancedNebula: false,
      nebulaDust: 0,
      nebulaDensity: 1,
      nebulaMotion: false,
      nebulaPalette: 'cosmic',
      polarAurora: false,
      polarAuroraIntensity: 0.45,
      polarAuroraMotion: false,
      polarAuroraPalette: 'arctic',
      starFlicker: false,
      starFlickerSpeed: 0.0175,
      starDensity: 1.25,
      starSize: 3,
      tileBrightness: 0.6,
      tileContrast: 1,
      tileSaturation: 1,
      showLinks: true,
      linkStyle: 'flatter',
      arcHeight: 1,
      linkWidth: 1,
      linkOpacity: 1,
      linkEndpoints: false,
      linkEndpointColor: '#ffffff',
      showFields: true,
      showEnlightenedFields: true,
      showResistanceFields: true,
      fieldOpacity: 1,
      fieldStyle: 'glass',
      fieldMotion: false,
      fieldDepthHaze: false,
      fieldCaustics: false,
      factionResonance: false,
      globeResonanceSweep: false,
      fieldShimmerIntensity: 0.45,
      screenshotMode: false,
      screenshotGlow: false,
      screenshotPresentation: 'off',
      cinematicFlyIn: false,
      screenshotOrbitSpeed: 0.012,
      fieldFilterMode: 'all',
      fieldAreaRule: 'vertices',
      portals: 'auto',
      portalSize: 12,
      maxPortals: 3000,
      portalLod: false,
      selectedPulse: false,
      showPortalOutline: false,
      portalOutline: '#05080b',
      portalOutlineWidth: 1,
      portalBeacons: false,
      portalBeaconIntensity: 0.55,
      portalBeaconMode: 'selected',
      shootingStars: false,
      shootingStarDensity: 0,
    }, energyFlowDefaults),
    quality: Object.assign({
      atmosphere: true,
      atmosphericEntryGlow: true,
      bloom: true,
      bloomIntensity: 0.75,
      fog: true,
      globeGrid: true,
      fxaa: true,
      nightShading: true,
      sun: true,
      sunGlow: 1,
      solarRimFlare: true,
      spaceBackdrop: true,
      spaceMotion: true,
      nebula: true,
      cloudVeil: true,
      advancedNebula: true,
      nebulaDust: 0.5,
      nebulaDensity: 1,
      nebulaMotion: true,
      nebulaPalette: 'cosmic',
      polarAurora: true,
      polarAuroraIntensity: 0.45,
      polarAuroraMotion: true,
      polarAuroraPalette: 'arctic',
      starFlicker: true,
      starFlickerSpeed: 0.0175,
      starDensity: 1.25,
      starSize: 4.5,
      tileBrightness: 0.6,
      tileContrast: 1,
      tileSaturation: 1,
      showLinks: true,
      linkStyle: 'flatter',
      arcHeight: 1,
      linkWidth: 1,
      linkOpacity: 1,
      linkEndpoints: false,
      linkEndpointColor: '#ffffff',
      linkFlow: true,
      showFields: true,
      showEnlightenedFields: true,
      showResistanceFields: true,
      fieldOpacity: 1,
      fieldStyle: 'glass',
      fieldMotion: false,
      fieldDepthHaze: false,
      fieldCaustics: false,
      factionResonance: true,
      globeResonanceSweep: true,
      fieldShimmerIntensity: 0.45,
      screenshotMode: false,
      screenshotGlow: false,
      screenshotPresentation: 'off',
      cinematicFlyIn: false,
      screenshotOrbitSpeed: 0.012,
      fieldFilterMode: 'all',
      fieldAreaRule: 'vertices',
      portals: 'auto',
      portalSize: 12,
      maxPortals: 3000,
      portalLod: false,
      selectedPulse: false,
      showPortalOutline: false,
      portalOutline: '#05080b',
      portalOutlineWidth: 1,
      portalBeacons: true,
      portalBeaconIntensity: 0.55,
      portalBeaconMode: 'selected',
      shootingStars: true,
      shootingStarDensity: 0.35,
      timeMode: 'live',
      manualTime: 12,
      autoRotate: false,
      autoRotateSpeed: 0.03,
      flyToSelected: false,
    }, energyFlowDefaults),
  };
  return profiles[name];
};

globeView.isPerformanceProfileSetting = function (name) {
  return ['low', 'balanced', 'quality'].some(function (profileName) {
    return Object.prototype.hasOwnProperty.call(globeView.getPerformanceProfile(profileName), name);
  });
};

globeView.applyPerformanceProfileToForm = function (form) {
  var profile = globeView.getPerformanceProfile(form.elements.performanceProfile.value);
  if (!profile) return;
  Object.keys(profile).forEach(function (name) {
    var input = form.elements[name];
    if (!input) return;
    if (input.type === 'checkbox') input.checked = profile[name];
    else input.value = profile[name];
  });
};

globeView.getNebulaPalette = function () {
  var palettes = {
    cosmic: [[0.025, 0.29, 0.43], [0.34, 0.045, 0.38]],
    emerald: [[0.02, 0.38, 0.26], [0.04, 0.16, 0.42]],
    sunset: [[0.48, 0.16, 0.08], [0.36, 0.04, 0.28]],
  };
  var palette = palettes[globeView.settings.nebulaPalette] || palettes.cosmic;
  return {
    a: new Cesium.Cartesian3(palette[0][0], palette[0][1], palette[0][2]),
    b: new Cesium.Cartesian3(palette[1][0], palette[1][1], palette[1][2]),
  };
};

globeView.getPolarAuroraColors = function () {
  var palettes = {
    arctic: ['#40ffad', '#29d9ff', '#8affcf'],
    violet: ['#62f4ff', '#ae72ff', '#60ffa5'],
    ice: ['#d8ffff', '#62d9ff', '#8eacff'],
  };
  return (palettes[globeView.settings.polarAuroraPalette] || palettes.arctic).map(function (value) {
    return Cesium.Color.fromCssColorString(value).withAlpha(globeView.settings.polarAuroraIntensity);
  });
};

globeView.polarAuroraPositions = function (hemisphere, ribbon) {
  var positions = [];
  for (var degree = 0; degree <= 360; degree += 4) {
    var phase = Cesium.Math.toRadians(degree);
    var latitude = hemisphere * (
      69 + ribbon * 3.2 + Math.sin(phase * 3 + ribbon * 1.7) * 2.5 + Math.sin(phase * 7 + ribbon) * 0.75
    );
    var longitude = degree - 180;
    var height = 70000 + ribbon * 18000 + (Math.sin(phase * 5 + ribbon * 0.8) + 1) * 12000;
    positions.push(Cesium.Cartesian3.fromDegrees(longitude, latitude, height));
  }
  return positions;
};

globeView.polarAuroraMaterial = function (color, ribbon) {
  return new Cesium.Material({
    fabric: {
      uniforms: { color: color, motion: globeView.settings.polarAuroraMotion ? 1 : 0, ribbon: ribbon },
      source: [
        'czm_material czm_getMaterial(czm_materialInput materialInput) {',
        '  czm_material material = czm_getDefaultMaterial(materialInput);',
        '  float edge = 1.0 - abs(materialInput.st.t * 2.0 - 1.0);',
        '  float curtain = pow(max(0.0, edge), 0.72);',
        // Three complete cycles around a closed ribbon keep the moving pattern
        // in phase where its first and last positions meet at the date line.
        '  float ripple = 0.68 + 0.32 * sin(materialInput.st.s * 18.8495559 + ribbon * 2.1 + czm_frameNumber * 0.006 * motion);',
        '  material.diffuse = color.rgb * (0.58 + ripple * 0.42);',
        '  material.alpha = color.a * curtain * ripple;',
        '  return material;',
        '}',
      ].join('\n'),
    },
    translucent: function () { return true; },
  });
};

globeView.clearPolarAurora = function () {
  if (globeView.polarAuroraCollection && globeView.viewer) {
    globeView.viewer.scene.primitives.remove(globeView.polarAuroraCollection);
  }
  globeView.polarAuroraCollection = null;
};

globeView.updatePolarAurora = function () {
  globeView.clearPolarAurora();
  if (!globeView.active || !globeView.viewer || !globeView.settings.screenshotMode || !globeView.settings.polarAurora) return;
  var collection = globeView.viewer.scene.primitives.add(new Cesium.PolylineCollection());
  var colors = globeView.getPolarAuroraColors();
  [-1, 1].forEach(function (hemisphere) {
    colors.forEach(function (color, ribbon) {
      collection.add({
        material: globeView.polarAuroraMaterial(color, ribbon),
        positions: globeView.polarAuroraPositions(hemisphere, ribbon),
        width: 24 - ribbon * 3,
      });
    });
  });
  globeView.polarAuroraCollection = collection;
};

globeView.clearGlobeGrid = function () {
  if (globeView.globeGridCollection && globeView.viewer) {
    globeView.viewer.scene.primitives.remove(globeView.globeGridCollection);
  }
  globeView.globeGridCollection = null;
};

globeView.gridLinePositions = function (latitude, longitude, isMeridian) {
  var positions = [];
  var start = isMeridian ? -89 : -180;
  var end = isMeridian ? 89 : 180;
  for (var degree = start; degree <= end; degree += 1) {
    positions.push(Cesium.Cartesian3.fromDegrees(isMeridian ? longitude : degree, isMeridian ? degree : latitude, 700));
  }
  return positions;
};

globeView.updateGlobeGridVisibility = function () {
  if (!globeView.globeGridCollection || !globeView.viewer) return;
  if (globeView.globeGridCollection.show !== globeView.settings.globeGrid) {
    globeView.globeGridCollection.show = globeView.settings.globeGrid;
  }
};

globeView.updateGlobeGrid = function () {
  globeView.clearGlobeGrid();
  if (!globeView.active || !globeView.viewer || !globeView.settings.globeGrid) return;
  var collection = globeView.viewer.scene.primitives.add(new Cesium.PolylineCollection());
  var material = Cesium.Material.fromType('Color');
  material.uniforms.color = new Cesium.Color(0.34, 0.72, 1.0, 0.22);
  for (var latitude = -75; latitude <= 75; latitude += 15) {
    collection.add({ material: material, positions: globeView.gridLinePositions(latitude, 0, false), width: latitude === 0 ? 1.5 : 1 });
  }
  for (var longitude = -165; longitude < 180; longitude += 15) {
    collection.add({ material: material, positions: globeView.gridLinePositions(0, longitude, true), width: longitude === 0 ? 1.5 : 1 });
  }
  globeView.globeGridCollection = collection;
  globeView.updateGlobeGridVisibility();
};

globeView.clearGlobeResonance = function () {
  if (globeView.viewer) {
    globeView.globeResonanceEntities.forEach(function (entity) { globeView.viewer.entities.remove(entity); });
  }
  globeView.globeResonanceEntities = [];
  globeView.globeResonanceStartedAt = 0;
};

globeView.getGlobeResonanceProgress = function () {
  if (!globeView.globeResonanceStartedAt) return null;
  var elapsed = (performance.now() - globeView.globeResonanceStartedAt) % globeView.GLOBE_RESONANCE_CYCLE_MS;
  if (elapsed > globeView.GLOBE_RESONANCE_TRAVEL_MS) return null;
  return elapsed / globeView.GLOBE_RESONANCE_TRAVEL_MS;
};

globeView.globeResonancePositions = function (progress, startLongitude, endLongitude) {
  var height = globeView.getFieldHeight() + Math.max(20, Math.min(2000, globeView.viewer.camera.positionCartographic.height * 0.0005));
  var latitude = 84 - progress * 168;
  var segments = Math.max(8, Math.round(globeView.GLOBE_RESONANCE_SEGMENTS * Math.abs(endLongitude - startLongitude) / 360));
  var positions = [];
  for (var index = 0; index <= segments; index++) {
    positions.push(Cesium.Cartesian3.fromDegrees(startLongitude + index * (endLongitude - startLongitude) / segments, latitude, height));
  }
  return positions;
};

globeView.updateGlobeResonance = function () {
  globeView.clearGlobeResonance();
  if (!globeView.active || !globeView.viewer || !globeView.settings.globeResonanceSweep) return;
  globeView.globeResonanceStartedAt = performance.now();
  var color = Cesium.Color.fromCssColorString('#71ff71');
  var progress = function () { return globeView.getGlobeResonanceProgress(); };
  var active = function () {
    return globeView.viewer.camera.positionCartographic.height >= globeView.GLOBE_RESONANCE_MIN_CAMERA_HEIGHT && progress() !== null;
  };
  var addSegment = function (startLongitude, endLongitude) {
    return globeView.viewer.entities.add({
      polyline: {
        positions: new Cesium.CallbackProperty(function () {
          var value = progress();
          return value === null ? [] : globeView.globeResonancePositions(value, startLongitude, endLongitude);
        }, false),
        show: new Cesium.CallbackProperty(active, false),
        width: new Cesium.CallbackProperty(function () {
          var value = progress();
          return value === null ? 1 : 4 + Math.sin(Math.PI * value) * 1.5;
        }, false),
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.16,
          // Cesium disables tapering at 1.0. The sweep is rendered as two
          // date-line-safe halves, so tapering either half makes its shared
          // join look thin and broken.
          taperPower: 1,
          color: new Cesium.CallbackProperty(function () {
            var value = progress();
            var alpha = value === null ? 0 : Math.sin(Math.PI * value) * 0.34;
            return color.withAlpha(alpha);
          }, false),
        }),
      },
    });
  };
  globeView.globeResonanceEntities = [addSegment(-180, 0), addSegment(0, 180)];
};

globeView.applyTimeSettings = function () {
  if (!globeView.viewer) return;
  var clock = globeView.viewer.clock;
  if (globeView.settings.timeMode === 'manual') {
    var date = Cesium.JulianDate.toDate(Cesium.JulianDate.now());
    date.setUTCHours(Math.floor(globeView.settings.manualTime), Math.round((globeView.settings.manualTime % 1) * 60), 0, 0);
    clock.currentTime = Cesium.JulianDate.fromDate(date);
    clock.shouldAnimate = false;
    return;
  }
  clock.currentTime = Cesium.JulianDate.now();
  clock.multiplier = 1;
  clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
  clock.shouldAnimate = true;
};

globeView.resetNorth = function () {
  if (!globeView.viewer) return;
  globeView.viewer.camera.setView({
    orientation: {
      heading: 0,
      pitch: -Cesium.Math.PI_OVER_TWO,
      roll: 0,
    },
  });
};

globeView.updateAutoRotate = function () {
  if (!globeView.viewer || !globeView.settings.autoRotate) {
    globeView.lastAutoRotateTime = 0;
    return;
  }
  var now = performance.now();
  if (globeView.lastAutoRotateTime) {
    var seconds = Math.min(0.1, (now - globeView.lastAutoRotateTime) / 1000);
    globeView.viewer.camera.rotate(Cesium.Cartesian3.UNIT_Z, globeView.settings.autoRotateSpeed * seconds);
  }
  globeView.lastAutoRotateTime = now;
};

globeView.updateScreenshotPresentation = function () {
  if (!globeView.viewer || !globeView.settings.screenshotMode || globeView.settings.screenshotPresentation !== 'orbit') {
    globeView.lastScreenshotPresentationTime = 0;
    return;
  }
  var now = performance.now();
  if (globeView.lastScreenshotPresentationTime) {
    var seconds = Math.min(0.1, (now - globeView.lastScreenshotPresentationTime) / 1000);
    globeView.viewer.camera.rotate(Cesium.Cartesian3.UNIT_Z, globeView.settings.screenshotOrbitSpeed * seconds);
  }
  globeView.lastScreenshotPresentationTime = now;
};

globeView.startCinematicFlyIn = function () {
  globeView.lastScreenshotPresentationTime = 0;
  var screenshotFlyIn = globeView.settings.screenshotMode && globeView.settings.screenshotPresentation === 'flyIn';
  if (!globeView.viewer || (!globeView.settings.cinematicFlyIn && !screenshotFlyIn)) return;
  var focus = globeView.getGlobeFocus();
  var height = globeView.viewer.camera.positionCartographic.height;
  if (!focus || !Number.isFinite(height)) return;
  var targetHeight = Math.max(1000, height);
  globeView.viewer.camera.setView({
    destination: Cesium.Cartesian3.fromRadians(focus.longitude, focus.latitude, targetHeight * 1.35),
    orientation: { heading: 0, pitch: -Cesium.Math.PI_OVER_TWO, roll: 0 },
  });
  globeView.viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromRadians(focus.longitude, focus.latitude, targetHeight),
    duration: 2.2,
    easingFunction: Cesium.EasingFunction.QUADRATIC_OUT,
    orientation: { heading: 0, pitch: -Cesium.Math.PI_OVER_TWO, roll: 0 },
  });
};

globeView.NEBULA_FRAGMENT_SHADER = [
  'uniform sampler2D colorTexture;',
  'uniform sampler2D depthTexture;',
  'uniform float nebulaDensity;',
  'uniform float advancedNebula;',
  'uniform float nebulaDust;',
  'uniform float nebulaMotion;',
  'uniform vec3 nebulaColorA;',
  'uniform vec3 nebulaColorB;',
  'uniform float starDensity;',
  'uniform float starFlickerSpeed;',
  'uniform float starFlickerEnabled;',
  'uniform float starSize;',
  'uniform float animationTime;',
  'uniform float sunEnabled;',
  'uniform float sunGlow;',
  'uniform float solarRimFlare;',
  'uniform vec2 globeRimCenter;',
  'uniform float globeRimRadius;',
  'uniform vec2 sunScreenCenter;',
  'uniform float sunScreenVisible;',
  'uniform float shootingStars;',
  'uniform float shootingStarDensity;',
  'uniform float nebulaEnabled;',
  'uniform float cssBackdrop;',
  'in vec2 v_textureCoordinates;',
  'float hash(vec2 point) {',
  '  return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);',
  '}',
  'float noise(vec2 point) {',
  '  vec2 cell = floor(point);',
  '  vec2 local = fract(point);',
  '  local = local * local * (3.0 - 2.0 * local);',
  '  return mix(mix(hash(cell), hash(cell + vec2(1.0, 0.0)), local.x), mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), local.x), local.y);',
  '}',
  'float cloud(vec2 point) {',
  '  return noise(point) * 0.55 + noise(point * 2.03 + 14.7) * 0.30 + noise(point * 4.11 - 8.2) * 0.15;',
  '}',
  'vec3 applySolarRim(vec3 color, vec2 uv) {',
  '  if (solarRimFlare < 0.5 || sunEnabled < 0.5) return color;',
  '  if (globeRimRadius <= 0.0) return color;',
  '  if (sunScreenVisible < 0.5) return color;',
  '  vec2 sunUv = sunScreenCenter;',
  '  vec2 fromGlobe = uv - globeRimCenter;',
  '  fromGlobe.x *= czm_viewport.z / czm_viewport.w;',
  '  float rimDistance = length(fromGlobe);',
  '  float band = 5.0 / czm_viewport.w;',
  '  float rim = 1.0 - smoothstep(0.0, band, abs(rimDistance - globeRimRadius));',
  '  if (rim <= 0.0) return color;',
  '  vec2 outward = fromGlobe / max(rimDistance, 0.00001);',
  '  vec2 toSun = sunUv - uv;',
  '  toSun.x *= czm_viewport.z / czm_viewport.w;',
  '  float facing = smoothstep(0.18, 0.92, dot(normalize(outward), normalize(toSun)));',
  '  float flare = facing * rim;',
  '  return color + vec3(1.0, 0.48, 0.12) * flare * 0.85;',
  '}',
  'vec3 applyShootingStar(vec3 color, vec2 point) {',
  '  if (shootingStars < 0.5) return color;',
  '  float cycle = floor(animationTime * 0.075);',
  '  float progress = fract(animationTime * 0.075);',
  '  float seed = hash(vec2(cycle, 17.3));',
  '  float eventVisible = step(1.0 - shootingStarDensity, seed);',
  '  vec2 origin = vec2(hash(vec2(cycle, 4.1)) * 1.5 - 0.75, hash(vec2(cycle, 8.6)) * 1.1 - 0.55);',
  '  vec2 direction = normalize(vec2(0.88, -0.34 + hash(vec2(cycle, 12.9)) * 0.20));',
  '  vec2 head = origin + direction * (progress * 2.6 - 1.3);',
  '  vec2 relative = point - head;',
  '  float along = dot(relative, direction);',
  '  float across = abs(relative.x * direction.y - relative.y * direction.x);',
  '  float tail = smoothstep(-0.25, -0.015, along) * (1.0 - smoothstep(-0.015, 0.018, along));',
  '  float width = 1.0 - smoothstep(0.0015, 0.0065, across);',
  '  return color + vec3(0.70, 0.87, 1.0) * eventVisible * tail * width * 1.8;',
  '}',
  'vec3 applySun(vec3 color, vec2 uv) {',
  '  if (sunEnabled < 0.5 || sunScreenVisible < 0.5) return color;',
  '  vec2 sunUv = sunScreenCenter;',
  '  vec2 delta = uv - sunUv;',
  '  delta.x *= czm_viewport.z / czm_viewport.w;',
  '  float glow = max(0.35, sunGlow);',
  '  float maximumHaloRadius = 0.118 * glow;',
  '  if (abs(delta.x) >= maximumHaloRadius || abs(delta.y) >= maximumHaloRadius) return color;',
  '  float distance = length(delta);',
  '  float core = 1.0 - smoothstep(0.004, 0.014, distance);',
  '  float corona = 1.0 - smoothstep(0.012, 0.052 * glow, distance);',
  '  float halo = 1.0 - smoothstep(0.040, 0.118 * glow, distance);',
  '  float angle = atan(delta.y, delta.x);',
  '  float rays = pow(max(0.0, cos(angle * 6.0 + animationTime * 0.8)), 13.0) * halo;',
  '  return color + vec3(1.0, 0.985, 0.91) * (core * 4.5 + corona * 0.85 + halo * 0.18 + rays * 0.20);',
  '}',
  'void main() {',
  '  vec4 sceneColor = texture(colorTexture, v_textureCoordinates);',
  '  float depth = czm_readDepth(depthTexture, v_textureCoordinates);',
  '  if (depth < 0.999999) {',
  '    out_FragColor = sceneColor;',
  '    return;',
  '  }',
  '  if (nebulaEnabled < 0.5) {',
  // Cesium bloom composites an opaque black background. When the lightweight
  // CSS backdrop is active, restore transparency only behind depth-tested map
  // content so that the CSS layer can remain visible beneath the canvas.
  '    out_FragColor = vec4(sceneColor.rgb, cssBackdrop > 0.5 ? 0.0 : sceneColor.a);',
  '    return;',
  '  }',
  '  if (max(sceneColor.r, max(sceneColor.g, sceneColor.b)) > 0.12) {',
  '    out_FragColor = sceneColor;',
  '    return;',
  '  }',
  '  float time = animationTime * 0.055 * nebulaMotion;',
  '  vec2 point = v_textureCoordinates - 0.5;',
  '  point.x *= czm_viewport.z / czm_viewport.w;',
  '  float blueCloud = smoothstep(0.45, 0.78, cloud(point * 2.25 + vec2(time, -time * 0.5)));',
  '  float violetCloud = smoothstep(0.54, 0.83, cloud(point * 1.68 + vec2(-time * 0.6, time * 0.35) + 7.0));',
  '  vec3 color = vec3(0.010, 0.018, 0.065);',
  '  color = mix(color, nebulaColorA, blueCloud * 0.62 * nebulaDensity);',
  '  color = mix(color, nebulaColorB, violetCloud * 0.55 * nebulaDensity);',
  '  if (advancedNebula > 0.5 && nebulaDust > 0.001) {',
  '    float dustLane = smoothstep(0.48, 0.82, cloud(point * 5.2 + vec2(-time * 0.35, time * 0.18) + 21.0));',
  '    float filament = smoothstep(0.66, 0.91, cloud(point * 7.6 + vec2(time * 0.55, -time * 0.25) - 11.0));',
  '    color = mix(color, color * 0.32, dustLane * nebulaDust);',
  '    color += mix(nebulaColorA, nebulaColorB, 0.5) * filament * nebulaDust * 0.18;',
  '  }',
  '  vec2 starGrid = point * 150.0 * starDensity + vec2(time * 7.0, -time * 4.0);',
  '  vec2 cell = floor(starGrid);',
  '  vec2 local = fract(starGrid) - 0.5;',
  '  float starSeed = hash(cell);',
  '  if (starSeed >= 0.991) {',
  '    float star = 1.0 - smoothstep(0.018 * starSize, 0.055 * starSize, length(local));',
  '    if (star > 0.0) {',
  '      float twinkle = 1.0;',
  '      if (starFlickerEnabled > 0.5) twinkle = 0.65 + 0.35 * sin(animationTime * starFlickerSpeed * 100.0 + starSeed * 18.0);',
  '      color += vec3(0.55, 0.75, 1.0) * star * twinkle;',
  '    }',
  '  }',
  '  color = applySolarRim(color, v_textureCoordinates);',
  '  color = applyShootingStar(color, point);',
  '  out_FragColor = vec4(applySun(color, v_textureCoordinates), 1.0);',
  '}',
].join('\n');

globeView.getLinkFlowPreset = function () {
  var presets = {
    short: { density: 3, pulseLength: 0.09, speed: 0.16 },
    medium: { density: 3, pulseLength: 0.16, speed: 0.16 },
    long: { density: 3, pulseLength: 0.24, speed: 0.16 },
  };
  return presets[globeView.settings.linkFlowPulse] || presets.medium;
};

globeView.ensureLinkBaseCollection = function () {
  if (globeView.linkBaseCollection || !globeView.viewer) return globeView.linkBaseCollection;
  globeView.linkBaseCollection = globeView.viewer.scene.primitives.add(new Cesium.PolylineCollection());
  return globeView.linkBaseCollection;
};

globeView.getLinkTeam = function (link) {
  var team = link && link.options && link.options.team;
  var name = String(team || '').toUpperCase();
  if ((typeof window.TEAM_ENL !== 'undefined' && team === window.TEAM_ENL) || name.indexOf('ENL') !== -1) return 'enl';
  if ((typeof window.TEAM_MACHINA !== 'undefined' && team === window.TEAM_MACHINA) ||
      (typeof window.TEAM_MAC !== 'undefined' && team === window.TEAM_MAC) || name.indexOf('MACH') !== -1 || name.indexOf('MAC') !== -1) return 'machina';
  return 'res';
};

globeView.getLinkFlowColor = function (link) {
  var setting = {
    enl: 'linkFlowEnlColor',
    res: 'linkFlowResColor',
    machina: 'linkFlowMachinaColor',
  }[globeView.getLinkTeam(link)];
  return Cesium.Color.fromCssColorString(globeView.settings[setting])
    .withAlpha(Math.max(0, Math.min(1, globeView.settings.linkFlowOpacity)));
};

globeView.getLinkBaseMaterial = function (color, flowColor) {
  var preset = globeView.getLinkFlowPreset();
  var edgeFeather = globeView.settings.screenshotMode ? 1 : 0;
  var key = (globeView.settings.linkFlow ? 'flow:' + flowColor.toCssColorString() + ':' + preset.pulseLength + ':' : 'color:') + color.toCssColorString() + ':edge:' + edgeFeather;
  if (globeView.linkBaseMaterials[key]) return globeView.linkBaseMaterials[key];
  if (globeView.settings.linkFlow) {
    var flowSource = [
      'czm_material czm_getMaterial(czm_materialInput materialInput) {',
      '  czm_material material = czm_getDefaultMaterial(materialInput);',
      '  float phase = fract(materialInput.s * density - czm_frameNumber * (speed / 60.0));',
      '  float center = 0.22;',
      '  float halfLength = pulseLength * 0.5;',
      '  float tail = smoothstep(center - halfLength, center - halfLength + pulseLength * 0.24, phase);',
      '  float head = 1.0 - smoothstep(center + halfLength - pulseLength * 0.20, center + halfLength, phase);',
      '  float pulse = tail * head;',
      '  float core = 1.0 - smoothstep(0.0, halfLength * 0.72, abs(phase - center));',
      '  vec3 energy = min(vec3(1.0), flowColor.rgb * (0.82 + core * 0.42));',
      '  material.diffuse = mix(baseColor.rgb, energy, pulse * flowColor.a);',
    ];
    if (edgeFeather) {
      flowSource.push(
        '  float edgeDistance = 1.0 - abs(materialInput.st.t * 2.0 - 1.0);',
        '  material.alpha = baseColor.a * smoothstep(0.0, 0.16, edgeDistance);'
      );
    } else {
      flowSource.push('  material.alpha = baseColor.a;');
    }
    flowSource.push('  return material;', '}');
    globeView.linkBaseMaterials[key] = new Cesium.Material({
      fabric: {
        uniforms: { baseColor: color, flowColor: flowColor, density: preset.density, pulseLength: preset.pulseLength, speed: preset.speed },
        source: flowSource.join('\n'),
      },
      translucent: function () { return color.alpha < 1 || edgeFeather > 0; },
    });
    return globeView.linkBaseMaterials[key];
  }
  var material;
  if (edgeFeather) {
    material = new Cesium.Material({
      fabric: {
        uniforms: { baseColor: color },
        source: [
          'czm_material czm_getMaterial(czm_materialInput materialInput) {',
          '  czm_material material = czm_getDefaultMaterial(materialInput);',
          '  float edgeDistance = 1.0 - abs(materialInput.st.t * 2.0 - 1.0);',
          '  material.diffuse = baseColor.rgb;',
          '  material.alpha = baseColor.a * smoothstep(0.0, 0.16, edgeDistance);',
          '  return material;',
          '}',
        ].join('\n'),
      },
      translucent: function () { return true; },
    });
  } else {
    material = Cesium.Material.fromType('Color');
    material.uniforms.color = color;
  }
  globeView.linkBaseMaterials[key] = material;
  return globeView.linkBaseMaterials[key];
};

globeView.updateAnimationTime = function () {
  var now = performance.now() * 0.001;
  if (globeView.nebulaStage && globeView.nebulaStage.enabled) globeView.nebulaStage.uniforms.animationTime = now;
};

globeView.addStyles = function () {
  $('<style>')
    .html(
      '#iitc-globe-view {' +
        'position: absolute; inset: 0; z-index: 1000; overflow: hidden; background: #05080b;' +
      '}' +
      '#iitc-globe-view::before {' +
        'content: ""; position: absolute; z-index: 0; inset: -16%; pointer-events: none;' +
        'background: radial-gradient(circle at 15% 24%, rgba(43, 54, 183, .62) 0, transparent 25%),' +
          'radial-gradient(ellipse at 78% 72%, rgba(189, 45, 143, .46) 0, transparent 30%),' +
          'radial-gradient(circle at 65% 17%, rgba(25, 186, 181, .30) 0, transparent 22%),' +
          'radial-gradient(circle at 8% 74%, rgba(239, 151, 58, .24) 0, transparent 20%),' +
          'radial-gradient(circle at 11% 18%, rgba(255,255,255,.8) 0 1px, transparent 2px),' +
          'radial-gradient(circle at 28% 61%, rgba(255,255,255,.7) 0 1px, transparent 2px),' +
          'radial-gradient(circle at 56% 36%, rgba(255,255,255,.65) 0 1px, transparent 2px),' +
          'radial-gradient(circle at 83% 43%, rgba(255,255,255,.75) 0 1px, transparent 2px),' +
          'linear-gradient(135deg, #080c27 0%, #120f31 43%, #090e21 100%);' +
        'animation: globe-view-space-drift 52s ease-in-out infinite alternate; will-change: transform;' +
      '}' +
      '#iitc-globe-view.globe-space-off::before { display: none; }' +
      '#iitc-globe-view.globe-space-still::before { animation: none; }' +
      '#iitc-globe-rimflare, #iitc-globe-sun, #iitc-globe-entryglow {' +
        'position: absolute; z-index: 0; left: 0; top: 0; width: 210px; height: 210px; border-radius: 50%; pointer-events: none; opacity: 0;' +
        'transform: translate3d(-200%, -200%, 0); will-change: transform, opacity;' +
      '}' +
      '#iitc-globe-entryglow {' +
        'z-index: 2; mix-blend-mode: screen; background: radial-gradient(circle, transparent 66%, rgba(38, 132, 255, 0) 72%, rgba(45, 154, 255, .10) 80%, rgba(83, 198, 255, .30) 90%, rgba(146, 225, 255, .10) 97%, transparent 100%);' +
      '}' +
      '#iitc-globe-rimflare {' +
        'width: 180px; height: 180px; filter: blur(1px);' +
        'background: radial-gradient(ellipse at 38% 50%, rgba(255,255,238,.96) 0 3%, rgba(255,210,108,.72) 11%, rgba(255,128,42,.25) 30%, transparent 66%);' +
      '}' +
      '#iitc-globe-sun {' +
        'background: radial-gradient(circle, rgba(255,255,255,1) 0 5%, rgba(255,254,238,1) 8%, rgba(255,230,162,.92) 15%, rgba(255,184,82,.55) 28%, rgba(255,136,42,.14) 48%, transparent 70%);' +
      '}' +
      '#iitc-globe-view.globe-close-space { background: #000; }' +
      '#iitc-globe-view.globe-close-space::before { display: none; }' +
      '#iitc-globe-view.globe-close-space #iitc-globe-rimflare, #iitc-globe-view.globe-close-space #iitc-globe-sun { opacity: 0 !important; }' +
      '#iitc-globe-view.globe-screenshot-mode #iitc-globe-actions, #iitc-globe-view.globe-screenshot-mode #iitc-globe-status, #iitc-globe-view.globe-screenshot-mode #iitc-globe-debug { display: none !important; }' +
      '@keyframes globe-view-space-drift {' +
        '0% { transform: translate3d(-2%, -1%, 0) scale(1.03); }' +
        '100% { transform: translate3d(2%, 1%, 0) scale(1.08); }' +
      '}' +
      '#iitc-globe-view .cesium-viewer {' +
        'position: relative; z-index: 1; width: 100%; height: 100%; overflow: hidden;' +
      '}' +
      '#iitc-globe-view .cesium-viewer-cesiumWidgetContainer, #iitc-globe-view .cesium-viewer-cesiumWidget, #iitc-globe-view .cesium-widget {' +
        'width: 100%; height: 100%;' +
      '}' +
      '#iitc-globe-view .cesium-widget canvas {' +
        'display: block; width: 100%; height: 100%;' +
      '}' +
      '#iitc-globe-actions {' +
        'position: absolute; z-index: 3; top: 10px; left: 10px; display: flex; gap: 6px;' +
      '}' +
      '#iitc-globe-actions button {' +
        'padding: 6px 10px;' +
        'border: 1px solid #6d7882; border-radius: 2px; background: rgba(7, 12, 17, .9);' +
        'color: #d9e5ed; font: 12px/1.2 sans-serif; cursor: pointer;' +
      '}' +
      '#iitc-globe-status {' +
        'position: absolute; z-index: 3; top: 48px; left: 10px; max-width: 280px;' +
        'padding: 5px 8px; color: #d9e5ed; background: rgba(7, 12, 17, .78);' +
        'font: 12px/1.35 sans-serif; pointer-events: none;' +
      '}' +
      '#iitc-globe-view.globe-ui-hidden #iitc-globe-actions, #iitc-globe-view.globe-ui-hidden #iitc-globe-status { display: none; }' +
      '#iitc-globe-debug {' +
        'position: absolute; z-index: 3; top: 110px; left: 10px; margin: 0; max-width: 360px;' +
        'padding: 6px 8px; color: #d9e5ed; background: rgba(7, 12, 17, .78);' +
        'font: 11px/1.35 monospace; white-space: pre-wrap; pointer-events: none;' +
      '}' +
      '#iitc-globe-view .cesium-viewer-bottom { bottom: 3px; right: 5px; }' +
      '#iitc-globe-view .cesium-credit-text, #iitc-globe-view .cesium-credit-logoContainer {' +
        'color: #d9e5ed;' +
      '}' +
      '#globe-view-settings { width: min(760px, calc(100vw - 34px)); max-width: 100%; box-sizing: border-box; }' +
      '#globe-view-settings-tabs { margin: 0; padding: 0; border: 0; background: transparent; }' +
      '#globe-view-settings-tabs .ui-tabs-nav { display: flex; flex-wrap: wrap; gap: 4px; margin: 0 0 10px; padding: 0; border: 0; border-bottom: 1px solid rgba(255,255,255,.22); background: transparent; }' +
      '#globe-view-settings-tabs .ui-tabs-nav li { margin: 0 0 -1px; border: 1px solid rgba(255,255,255,.18); border-radius: 4px 4px 0 0; background: rgba(0,0,0,.22); list-style: none; }' +
      '#globe-view-settings-tabs .ui-tabs-nav li.ui-tabs-active { border-color: rgba(255,255,255,.28); border-bottom-color: #091923; background: #091923; }' +
      '#globe-view-settings-tabs .ui-tabs-nav a { display: block; padding: .34em .7em; color: #cbd9df; text-decoration: none; }' +
      '#globe-view-settings-tabs .ui-tabs-nav li.ui-tabs-active a { color: #fff; font-weight: bold; }' +
      '#globe-view-settings-tabs .ui-tabs-panel { padding: 0; }' +
      '#globe-view-settings .settings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 10px; }' +
      '#globe-view-settings fieldset { min-width: 0; margin: 0; padding: 8px 10px; border: 1px solid #456; box-sizing: border-box; }' +
      '#globe-view-settings legend { padding: 0 4px; color: #d9e5ed; }' +
      '#globe-view-settings label { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin: 7px 0; min-height: 20px; }' +
      '#globe-view-settings label:has(input[type="checkbox"]) { justify-content: flex-start; }' +
      '#globe-view-settings input[type="number"], #globe-view-settings input[type="color"], #globe-view-settings select { float: none; width: 110px; max-width: 48%; box-sizing: border-box; }' +
      '#globe-view-settings input[type="color"] { padding: 1px; }' +
      '#globe-view-settings .actions { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 10px; }' +
      '#globe-view-settings .actions button { flex: 0 1 auto; padding: 5px 8px; }' +
      '#globe-view-settings .actions button.filter-active { border-color: #ff5a5a; background: rgba(150, 20, 24, .72); color: #fff; }' +
      '#globe-view-settings button[name="clearComposition"] { font-weight: 700; }' +
      '#globe-view-settings .dialog-actions { justify-content: space-between; border-top: 1px solid rgba(255,255,255,.16); padding-top: 10px; }' +
      '#globe-view-settings .hint { color: #9ab; font-size: 11px; line-height: 1.35; margin: 5px 0 0; }' +
      '#globe-view-settings .globe-credits { color: #9ab; font-size: 12px; line-height: 1.65; }' +
      '#globe-view-settings .globe-credits a { color: #8ddcff; text-decoration: none; }' +
      '#globe-view-settings .globe-credits a:hover { color: #fff; text-decoration: underline; }' +
      '#globe-view-settings .globe-credits img { width: 14px; height: 14px; margin-right: 5px; vertical-align: -2px; }' +
      '@media (max-width: 520px) {' +
        '#globe-view-settings { width: calc(100vw - 22px); }' +
        '#globe-view-settings .settings-grid { grid-template-columns: 1fr; }' +
        '#globe-view-settings-tabs .ui-tabs-nav a { padding: .32em .52em; font-size: 11px; }' +
      '}'
    )
    .appendTo('head');
};

globeView.setButtonLabel = function () {
  IITC.toolbox.updateButton('globeview-toggle', { label: globeView.active ? 'Map' : 'Globe' });
};

globeView.setStatus = function (message) {
  if (!globeView.container) return;
  globeView.container.querySelector('#iitc-globe-status').textContent = message;
};

globeView.updateStatus = function () {
  var links = globeView.settings.showLinks ? Object.keys(globeView.linkEntities).length + ' loaded links' : 'links hidden';
  var fields = globeView.settings.showFields ? globeView.fieldCount + ' fields' : 'fields hidden';
  var portals = globeView.portalCount + ' portals' + (globeView.portalRenderMode ? ' (' + (globeView.portalRenderMode === 'billboards' ? 'badges' : 'dots') + ')' : '');
  globeView.setStatus(links + ' · ' + fields + ' · ' + portals + ' · drag to rotate · scroll to zoom');
};

globeView.setSettingFromInput = function (form, name, type) {
  var input = form.elements[name];
  if (type === 'boolean') return input.checked;
  if (type === 'number') return Number(input.value);
  return input.value;
};

globeView.SETTINGS_FORM_TYPES = {
  performanceProfile: 'string', tileBrightness: 'number', tileContrast: 'number', tileSaturation: 'number', fxaa: 'boolean', fog: 'boolean', bloom: 'boolean', bloomIntensity: 'number', cinematicFlyIn: 'boolean',
  atmosphere: 'boolean', atmosphericEntryGlow: 'boolean', nightShading: 'boolean', autoStartGlobe: 'boolean', timeMode: 'string', manualTime: 'number', sun: 'boolean', sunGlow: 'number', solarRimFlare: 'boolean', spaceBackdrop: 'boolean', nebula: 'boolean', nebulaPalette: 'string',
  nebulaDensity: 'number', advancedNebula: 'boolean', nebulaDust: 'number', nebulaMotion: 'boolean', spaceMotion: 'boolean', starFlicker: 'boolean', starFlickerSpeed: 'number', starSize: 'number', starDensity: 'number', globeGrid: 'boolean', globeResonanceSweep: 'boolean', cloudVeil: 'boolean', showLinks: 'boolean', showFields: 'boolean',
  fieldOpacity: 'number', fieldStyle: 'string', fieldMotion: 'boolean', fieldDepthHaze: 'boolean', fieldCaustics: 'boolean', fieldShimmerIntensity: 'number', fieldFilterMode: 'string', fieldAreaRule: 'string', screenshotMode: 'boolean', screenshotGlow: 'boolean', screenshotPresentation: 'string', screenshotOrbitSpeed: 'number', shootingStars: 'boolean', shootingStarDensity: 'number', polarAurora: 'boolean', polarAuroraIntensity: 'number', polarAuroraMotion: 'boolean', polarAuroraPalette: 'string',
  showEnlightenedFields: 'boolean', showResistanceFields: 'boolean', arcHeight: 'number', linkWidth: 'number', linkOpacity: 'number', linkStyle: 'string',
  linkEndpointColor: 'string', linkEndpoints: 'boolean', linkFlow: 'boolean', linkFlowEnlColor: 'string', linkFlowResColor: 'string', linkFlowMachinaColor: 'string', linkFlowOpacity: 'number', linkFlowPulse: 'string', portals: 'string', portalSize: 'number', maxPortals: 'number', portalLod: 'boolean', selectedPulse: 'boolean', portalBeacons: 'boolean', portalBeaconIntensity: 'number', portalBeaconMode: 'string',
  showPortalOutline: 'boolean', portalOutline: 'string', portalOutlineWidth: 'number', factionResonance: 'boolean', autoRotate: 'boolean', autoRotateSpeed: 'number', flyToSelected: 'boolean',
  globeUi: 'boolean', debugPanel: 'boolean', debugFocus: 'boolean', debugView: 'boolean', debugCoverage: 'boolean', debugTiles: 'boolean',
};

globeView.syncSettingsFromForm = function (form) {
  var previous = Object.assign({}, globeView.settings);
  Object.keys(globeView.SETTINGS_FORM_TYPES).forEach(function (name) {
    var input = form.elements[name];
    if (!input) return;
    globeView.settings[name] = globeView.setSettingFromInput(form, name, globeView.SETTINGS_FORM_TYPES[name]);
  });
  globeView.saveSettings();
  var changed = Object.keys(globeView.SETTINGS_FORM_TYPES).filter(function (name) {
    return previous[name] !== globeView.settings[name];
  });
  globeView.applySettings(changed, previous);
  globeView.updateCompositionControls(form);
};

globeView.populateSettingsForm = function (form) {
  var settings = globeView.settings;
  Object.keys(globeView.SETTINGS_FORM_TYPES).forEach(function (name) {
    var input = form.elements[name];
    if (!input) return;
    if (globeView.SETTINGS_FORM_TYPES[name] === 'boolean') input.checked = !!settings[name];
    else input.value = settings[name];
  });
  globeView.updateCompositionControls(form);
};

globeView.restoreDefaultSettings = function (form) {
  globeView.settings = Object.assign({}, globeView.DEFAULT_SETTINGS, globeView.getPerformanceProfile('balanced'));
  globeView.excludedFieldGuids = {};
  globeView.pinnedPortalGuids = {};
  globeView.selectedFieldGuid = null;
  globeView.clearAreaSelection();
  globeView.populateSettingsForm(form);
  globeView.saveSettings();
  globeView.applySettings();
};

globeView.showSettings = function () {
  var settings = globeView.settings;
  var form = document.createElement('form');
  form.id = 'globe-view-settings';
  form.innerHTML =
    '<div id="globe-view-settings-tabs" class="globe-settings-tabs">' +
    '<ul><li><a href="#globe-settings-graphics">Graphics</a></li><li><a href="#globe-settings-mapdata">Links &amp; fields</a></li><li><a href="#globe-settings-picture">Picture mode</a></li><li><a href="#globe-settings-portals">Portals</a></li><li><a href="#globe-settings-camera">Camera</a></li><li><a href="#globe-settings-debug">Debug</a></li></ul>' +
    '<div id="globe-settings-graphics"><div class="settings-grid">' +
    '<fieldset><legend>Display</legend>' +
    '<label>Profile <select name="performanceProfile"><option value="custom">Custom</option><option value="low">Low</option><option value="balanced">Balanced</option><option value="quality">Quality</option></select></label>' +
    '<label>Brightness <input name="tileBrightness" type="number" min="0.25" max="0.6" step="0.05" value="' + settings.tileBrightness + '"></label>' +
    '<label>Contrast <input name="tileContrast" type="number" min="0.2" max="2" step="0.1" value="' + settings.tileContrast + '"></label>' +
    '<label>Saturation <input name="tileSaturation" type="number" min="0" max="2" step="0.1" value="' + settings.tileSaturation + '"></label>' +
    '<label><input name="fxaa" type="checkbox"> Smooth link edges (FXAA)</label>' +
    '<label><input name="fog" type="checkbox"> Fog</label>' +
    '<label><input name="bloom" type="checkbox"> Glow</label>' +
    '<label>Glow intensity <input name="bloomIntensity" type="number" min="0.25" max="2" step="0.05" value="' + settings.bloomIntensity + '"></label></fieldset>' +
    '<fieldset><legend>Globe</legend>' +
    '<label><input name="atmosphere" type="checkbox"> Atmospheric rim</label>' +
    '<label><input name="atmosphericEntryGlow" type="checkbox"> Atmospheric entry glow</label>' +
    '<label><input name="nightShading" type="checkbox"> Day and night shading</label>' +
    '<label><input name="autoStartGlobe" type="checkbox"> Open Globe automatically after refresh</label>' +
    '<label>Lighting time <select name="timeMode"><option value="live">Live</option><option value="manual">Manual UTC</option></select></label>' +
    '<label>Manual UTC hour <input name="manualTime" type="number" min="0" max="23.75" step="0.25" value="' + settings.manualTime + '"></label>' +
    '<label><input name="sun" type="checkbox"> Sun disc</label>' +
    '<label>Sun halo <input name="sunGlow" type="number" min="0" max="3" step="0.1" value="' + settings.sunGlow + '"></label>' +
    '<label><input name="solarRimFlare" type="checkbox"> Solar rim flare (GPU)</label>' +
    '<label><input name="spaceBackdrop" type="checkbox"> Space background</label>' +
    '<label><input name="spaceMotion" type="checkbox"> Drift space background</label>' +
    '<label><input name="nebula" type="checkbox"> Nebula and drifting stars (GPU)</label></fieldset>' +
    '<fieldset><legend>Globe accents</legend>' +
    '<label><input name="globeGrid" type="checkbox"> Coordinate grid</label>' +
    '<label><input name="globeResonanceSweep" type="checkbox"> North-to-south resonance sweep</label>' +
    '<label><input name="cloudVeil" type="checkbox"> Cloud veil</label>' +
    '</fieldset>' +
    '<fieldset><legend>Nebula</legend>' +
    '<label>Palette <select name="nebulaPalette"><option value="cosmic">Cosmic</option><option value="emerald">Emerald</option><option value="sunset">Sunset</option></select></label>' +
    '<label>Nebula density <input name="nebulaDensity" type="number" min="0" max="2" step="0.1" value="' + settings.nebulaDensity + '"></label>' +
    '<label><input name="advancedNebula" type="checkbox"> Deep dust lanes (GPU)</label>' +
    '<label>Dust-lane intensity <input name="nebulaDust" type="number" min="0" max="1" step="0.05" value="' + settings.nebulaDust + '"></label>' +
    '<label><input name="nebulaMotion" type="checkbox"> Drift nebula and stars</label>' +
    '<label><input name="starFlicker" type="checkbox"> Star flicker</label>' +
    '<label>Star flicker speed <input name="starFlickerSpeed" type="number" min="0" max="0.08" step="0.0025" value="' + settings.starFlickerSpeed + '"></label>' +
    '<label>Star size <input name="starSize" type="number" min="0.5" max="5" step="0.1" value="' + settings.starSize + '"></label>' +
    '<label>Star density <input name="starDensity" type="number" min="0.25" max="2" step="0.05" value="' + settings.starDensity + '"></label>' +
    '<div class="hint">Slow flicker and larger stars keep the background readable at globe scale.</div></fieldset></div></div>' +
    '<div id="globe-settings-mapdata"><div class="settings-grid"><fieldset><legend>Links</legend>' +
    '<label><input name="showLinks" type="checkbox"> Show links</label>' +
    '<label>Shape <select name="linkStyle"><option value="arc">Arc</option><option value="flatter">Flatter</option><option value="flat">Flat</option></select></label>' +
    '<label><input name="linkEndpoints" type="checkbox"> Link endpoint highlights</label>' +
    '<label>Endpoint color <input name="linkEndpointColor" type="color" value="' + settings.linkEndpointColor + '"></label>' +
    '<label><input name="linkFlow" type="checkbox"> Directional energy flow (GPU)</label>' +
    '<label>Enlightened flow <input name="linkFlowEnlColor" type="color" value="' + settings.linkFlowEnlColor + '"></label>' +
    '<label>Resistance flow <input name="linkFlowResColor" type="color" value="' + settings.linkFlowResColor + '"></label>' +
    '<label>Machina flow <input name="linkFlowMachinaColor" type="color" value="' + settings.linkFlowMachinaColor + '"></label>' +
    '<label>Pulse <select name="linkFlowPulse"><option value="short">Short</option><option value="medium">Medium</option><option value="long">Long</option></select></label>' +
    '<label>Flow opacity <input name="linkFlowOpacity" type="number" min="0" max="1" step="0.05" value="' + settings.linkFlowOpacity + '"></label>' +
    '<label>Arc height <input name="arcHeight" type="number" min="0" max="3" step="0.1" value="' + settings.arcHeight + '"></label>' +
    '<label>Width <input name="linkWidth" type="number" min="0.5" max="4" step="0.1" value="' + settings.linkWidth + '"></label>' +
    '<label>Opacity <input name="linkOpacity" type="number" min="0.1" max="1" step="0.1" value="' + settings.linkOpacity + '"></label></fieldset>' +
    '<fieldset><legend>Fields</legend>' +
    '<label><input name="showFields" type="checkbox"> Show fields</label>' +
    '<label>Fill opacity <input name="fieldOpacity" type="number" min="0" max="1" step="0.05" value="' + settings.fieldOpacity + '"></label>' +
    '<label>Style <select name="fieldStyle"><option value="glass">Glass</option><option value="shimmer">Shimmer glass</option><option value="prism">Raised prism</option><option value="canopy">Energy canopy (GPU)</option></select></label>' +
    '<label>Shimmer strength <input name="fieldShimmerIntensity" type="number" min="0" max="1" step="0.05" value="' + settings.fieldShimmerIntensity + '"></label>' +
    '</fieldset></div></div>' +
    '<div id="globe-settings-picture"><fieldset><legend>Screenshot composition</legend>' +
    '<label><input name="screenshotMode" type="checkbox"> Screenshot mode (hide globe UI, high quality)</label>' +
    '<label><input name="screenshotGlow" type="checkbox"> Glow in Screenshot mode</label>' +
    '<label>Camera presentation <select name="screenshotPresentation"><option value="off">Off</option><option value="orbit">Slow orbit</option><option value="flyIn">Cinematic fly-in</option></select></label>' +
    '<label>Orbit speed <input name="screenshotOrbitSpeed" type="number" min="0.002" max="0.06" step="0.002" value="' + settings.screenshotOrbitSpeed + '"></label></fieldset>' +
    '<fieldset><legend>Screenshot graphics</legend>' +
    '<label><input name="fieldMotion" type="checkbox"> Animate field shimmer</label>' +
    '<label><input name="fieldDepthHaze" type="checkbox"> Field depth haze</label>' +
    '<label><input name="fieldCaustics" type="checkbox"> Animated field caustics (GPU)</label>' +
    '<label><input name="shootingStars" type="checkbox"> Shooting stars</label>' +
    '<label>Shooting-star density <input name="shootingStarDensity" type="number" min="0" max="1" step="0.05" value="' + settings.shootingStarDensity + '"></label>' +
    '<label><input name="polarAurora" type="checkbox"> Polar aurora</label>' +
    '<label>Aurora intensity <input name="polarAuroraIntensity" type="number" min="0" max="1" step="0.05" value="' + settings.polarAuroraIntensity + '"></label>' +
    '<label>Aurora palette <select name="polarAuroraPalette"><option value="arctic">Arctic green</option><option value="violet">Cyan violet</option><option value="ice">Ice blue</option></select></label>' +
    '<label><input name="polarAuroraMotion" type="checkbox"> Drift polar aurora</label></fieldset>' +
    '<fieldset><legend>Field composition</legend>' +
    '<label>Field filter <select name="fieldFilterMode"><option value="all">All loaded fields</option><option value="area">Selected area</option><option value="selectedPortal">Current portal source</option><option value="pinnedPortals">Pinned portal sources</option><option value="selectedField">Selected field only</option><option value="nested">Selected field + nested fields</option><option value="parents">Selected field + parent fields</option><option value="family">Selected field family</option></select></label>' +
    '<label>Area rule <select name="fieldAreaRule"><option value="vertices">All vertices inside</option><option value="centre">Field centre inside</option><option value="intersects">Intersecting area</option></select></label>' +
    '<label><input name="showEnlightenedFields" type="checkbox"> Enlightened fields</label>' +
    '<label><input name="showResistanceFields" type="checkbox"> Resistance fields</label>' +
    '<div class="actions"><button type="button" name="selectArea">Mark area points</button><button type="button" name="useArea">Use marked area</button><button type="button" name="clearArea">Clear area</button><button type="button" name="useSelectedPortal">Use selected portal</button><button type="button" name="pinSelectedPortal">Pin selected portal</button><button type="button" name="excludeSelectedField">Exclude selected field</button><button type="button" name="clearComposition">Clear filters</button><button type="button" name="captureScreenshot">Capture PNG</button></div>' +
    '<div class="hint">Click a field to select it. Mark three or more globe points, then use the marked area. Composition filters apply only while Screenshot mode is enabled.</div></fieldset></div>' +
    '<div id="globe-settings-portals"><fieldset><legend>Portals</legend>' +
    '<label>Renderer <select name="portals"><option value="auto">Auto</option><option value="billboards">Billboards</option><option value="points">Batched dots</option><option value="off">Off</option></select></label>' +
    '<label><input name="portalLod" type="checkbox"> Detail badges when zoomed in</label>' +
    '<label><input name="selectedPulse" type="checkbox"> Highlight selected portal</label>' +
    '<label><input name="factionResonance" type="checkbox"> Faction resonance rings</label>' +
    '<label><input name="portalBeacons" type="checkbox"> Portal beacons</label>' +
    '<label>Beacon targets <select name="portalBeaconMode"><option value="selected">Selected portal</option><option value="highLevel">Selected + high-level portals</option></select></label>' +
    '<label>Beacon intensity <input name="portalBeaconIntensity" type="number" min="0" max="1" step="0.05" value="' + settings.portalBeaconIntensity + '"></label>' +
    '<label><input name="showPortalOutline" type="checkbox"> Portal outline</label>' +
    '<label>Outline color <input name="portalOutline" type="color" value="' + settings.portalOutline + '"></label>' +
    '<label>Outline width <input name="portalOutlineWidth" type="number" min="0" max="4" step="0.5" value="' + settings.portalOutlineWidth + '"></label>' +
    '<label>Portal size <input name="portalSize" type="number" min="4" max="32" step="1" value="' + settings.portalSize + '"></label>' +
    '<label>Maximum portals <input name="maxPortals" type="number" min="100" max="10000" step="100" value="' + settings.maxPortals + '"></label></fieldset></div>' +
    '<div id="globe-settings-camera"><fieldset><legend>Camera</legend>' +
    '<label><input name="autoRotate" type="checkbox"> Slow auto-rotate</label>' +
    '<label>Rotate speed <input name="autoRotateSpeed" type="number" min="0.005" max="0.12" step="0.005" value="' + settings.autoRotateSpeed + '"></label>' +
    '<label><input name="cinematicFlyIn" type="checkbox"> Cinematic fly-in when Globe opens</label>' +
    '<label><input name="flyToSelected" type="checkbox"> Fly to clicked portal</label></fieldset></div>' +
    '<div id="globe-settings-debug"><div class="settings-grid"><fieldset><legend>Debug</legend>' +
    '<label><input name="globeUi" type="checkbox"> Globe controls</label>' +
    '<label><input name="debugPanel" type="checkbox"> Diagnostics panel</label>' +
    '<label><input name="debugFocus" type="checkbox"> Focus marker</label>' +
    '<label><input name="debugView" type="checkbox"> Leaflet viewport</label>' +
    '<label><input name="debugCoverage" type="checkbox"> IITC tile coverage</label>' +
    '<label><input name="debugTiles" type="checkbox"> Individual debug tiles</label></fieldset>' +
    '<fieldset><legend>Credits</legend><div class="globe-credits">' +
    '<div>Authors: Falenone &amp; OpenAI Codex</div>' +
    '<div><a href="' + globeView.PROJECT_URL + '" target="_blank" rel="noopener noreferrer">GitHub</a></div>' +
    '<div><a href="' + globeView.CESIUM_URL + '" target="_blank" rel="noopener noreferrer"><img src="' + globeView.CESIUM_FAVICON_DATA_URI + '" alt="">Powered by Cesium</a></div>' +
    '</div></fieldset></div></div>' +
    '</div><div class="actions dialog-actions"><button type="button" name="restoreDefaults">Restore defaults</button><span><button type="button" name="resetCamera">Reset globe to map</button><button type="button" name="resetNorth">North up</button></span></div>';

  globeView.populateSettingsForm(form);
  form.addEventListener('change', function (event) {
    var input = event.target;
    if (!input || !globeView.SETTINGS_FORM_TYPES[input.name]) return;
    if (input.name === 'performanceProfile') globeView.applyPerformanceProfileToForm(form);
    else if (globeView.isPerformanceProfileSetting(input.name)) form.elements.performanceProfile.value = 'custom';
    globeView.syncSettingsFromForm(form);
  });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    globeView.syncSettingsFromForm(form);
  });
  form.elements.resetCamera.addEventListener('click', globeView.positionCameraFromMap);
  form.elements.resetNorth.addEventListener('click', globeView.resetNorth);
  form.elements.restoreDefaults.addEventListener('click', function () { globeView.restoreDefaultSettings(form); });
  form.elements.selectArea.addEventListener('click', globeView.startAreaSelection);
  form.elements.useArea.addEventListener('click', function () {
    globeView.useAreaSelection();
    form.elements.fieldFilterMode.value = globeView.settings.fieldFilterMode;
  });
  form.elements.clearArea.addEventListener('click', function () {
    globeView.clearAreaSelection();
    form.elements.fieldFilterMode.value = globeView.settings.fieldFilterMode;
  });
  form.elements.useSelectedPortal.addEventListener('click', function () {
    globeView.useSelectedPortalFilter();
    form.elements.fieldFilterMode.value = globeView.settings.fieldFilterMode;
  });
  form.elements.pinSelectedPortal.addEventListener('click', function () {
    globeView.pinSelectedPortal();
    form.elements.fieldFilterMode.value = globeView.settings.fieldFilterMode;
  });
  form.elements.excludeSelectedField.addEventListener('click', globeView.excludeSelectedField);
  form.elements.clearComposition.addEventListener('click', function () {
    globeView.clearCompositionFilters();
    form.elements.fieldFilterMode.value = globeView.settings.fieldFilterMode;
    form.elements.showEnlightenedFields.checked = globeView.settings.showEnlightenedFields;
    form.elements.showResistanceFields.checked = globeView.settings.showResistanceFields;
  });
  form.elements.captureScreenshot.addEventListener('click', globeView.captureScreenshot);

  var dialog = window.dialog({
    id: 'globe-view-settings-dialog',
    title: 'Globe settings',
    html: form,
    width: Math.min(760, Math.max(320, (window.innerWidth || 800) - 24)),
    maxHeight: Math.max(280, (window.innerHeight || 600) - 24),
    dialogClass: 'globe-view-settings-dialog',
  });
  if (window.$ && $.fn && $.fn.tabs) $('#globe-view-settings-tabs').tabs();
  if (dialog && dialog.dialog) dialog.dialog('option', 'position', { my: 'center', at: 'center', of: window });
};

globeView.loadCesium = function () {
  if (window.Cesium) return Promise.resolve(window.Cesium);
  if (globeView.cesiumPromise) return globeView.cesiumPromise;

  globeView.cesiumPromise = new Promise(function (resolve, reject) {
    window.CESIUM_BASE_URL = globeView.CESIUM_BASE_URL;

    var script = document.createElement('script');
    script.id = 'iitc-globe-cesium';
    script.src = globeView.CESIUM_SCRIPT_URL;
    script.async = true;
    script.onload = function () {
      if (window.Cesium) resolve(window.Cesium);
      else {
        globeView.cesiumPromise = null;
        reject(new Error('Cesium loaded without exposing its API.'));
      }
    };
    script.onerror = function () {
      globeView.cesiumPromise = null;
      reject(new Error('Could not load the Cesium renderer.'));
    };
    document.head.appendChild(script);
  });

  return globeView.cesiumPromise;
};

globeView.createContainer = function () {
  var container = document.createElement('div');
  container.id = 'iitc-globe-view';
  container.innerHTML = '<div id="iitc-globe-rimflare"></div><div id="iitc-globe-sun"></div><div id="iitc-globe-entryglow"></div><div id="iitc-globe-actions"><button id="iitc-globe-close" type="button">Return to map</button><button id="iitc-globe-north" type="button">North up</button></div><div id="iitc-globe-status">Loading 3D globe…</div><pre id="iitc-globe-debug">Waiting for the globe renderer…</pre>';
  container.querySelector('#iitc-globe-close').addEventListener('click', globeView.deactivate);
  container.querySelector('#iitc-globe-north').addEventListener('click', globeView.resetNorth);
  document.getElementById('map').appendChild(container);
  globeView.container = container;
};

globeView.getGlobeFocus = function () {
  if (!globeView.viewer) return null;
  var viewer = globeView.viewer;
  var canvasCenter = new Cesium.Cartesian2(viewer.canvas.clientWidth / 2, viewer.canvas.clientHeight / 2);
  var globePosition = viewer.camera.pickEllipsoid(canvasCenter, viewer.scene.globe.ellipsoid);
  if (!globePosition) return null;

  return Cesium.Cartographic.fromCartesian(globePosition);
};

globeView.formatPoint = function (lat, lng) {
  return lat.toFixed(4) + ', ' + lng.toFixed(4);
};

globeView.formatBounds = function (bounds) {
  if (!bounds) return 'not available';
  return 'N ' + bounds.getNorth().toFixed(4) + ' E ' + bounds.getEast().toFixed(4) + '\nS ' + bounds.getSouth().toFixed(4) + ' W ' + bounds.getWest().toFixed(4);
};

globeView.getPickedPortalGuid = function (picked) {
  var id = picked && picked.id;
  if (id && id.globePortalGuid) return id.globePortalGuid;
  return id && id.id && id.id.globePortalGuid;
};

globeView.getPickedFieldGuid = function (picked) {
  var id = picked && picked.id;
  if (id && id.globeFieldGuid) return id.globeFieldGuid;
  return id && id.id && id.id.globeFieldGuid;
};

globeView.rectangleFromBounds = function (bounds) {
  if (!bounds) return null;
  var west = bounds.getWest();
  var east = bounds.getEast();

  // Leaflet can return unwrapped longitudes (for example -220°) after a
  // pan across the date line. Cesium requires both values within ±180° and
  // supports east < west to represent the resulting date-line crossing.
  if (east - west >= 359.999) {
    west = -180;
    east = 180;
  } else {
    west = ((west + 180) % 360 + 360) % 360 - 180;
    east = ((east + 180) % 360 + 360) % 360 - 180;
  }

  return Cesium.Rectangle.fromDegrees(west, Math.max(-90, bounds.getSouth()), east, Math.min(90, bounds.getNorth()));
};

globeView.setDebugRectangle = function (entity, bounds, color, fillOpacity, height) {
  var rectangle = globeView.rectangleFromBounds(bounds);
  if (!rectangle) return null;

  if (!entity) {
    return globeView.viewer.entities.add({
      rectangle: {
        coordinates: rectangle,
        height: height,
        material: color.withAlpha(fillOpacity),
        outline: true,
        outlineColor: color,
      },
    });
  }

  entity.rectangle.coordinates = rectangle;
  return entity;
};

globeView.clearDebugTiles = function () {
  globeView.debugTileEntities.forEach(function (entity) {
    globeView.viewer.entities.remove(entity);
  });
  globeView.debugTileEntities = [];
};

globeView.removeDebugEntity = function (name) {
  if (globeView[name] && globeView.viewer) globeView.viewer.entities.remove(globeView[name]);
  globeView[name] = null;
};

globeView.updateDebugGeometry = function () {
  if (!globeView.active || !globeView.viewer) return;

  var focus = globeView.getGlobeFocus();
  if (globeView.settings.debugFocus && focus) {
    var focusPosition = Cesium.Cartesian3.fromRadians(focus.longitude, focus.latitude, 15000);
    if (!globeView.debugFocusEntity) {
      globeView.debugFocusEntity = globeView.viewer.entities.add({
        position: focusPosition,
        point: {
          color: Cesium.Color.YELLOW,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          pixelSize: 12,
        },
        label: {
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          fillColor: Cesium.Color.YELLOW,
          font: '12px sans-serif',
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 3,
          pixelOffset: new Cesium.Cartesian2(10, -8),
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          text: 'IITC focus',
        },
      });
    } else {
      globeView.debugFocusEntity.position = focusPosition;
    }
  } else {
    globeView.removeDebugEntity('debugFocusEntity');
  }

  var request = window.mapDataRequest;
  if (globeView.settings.debugView) {
    globeView.debugViewEntity = globeView.setDebugRectangle(globeView.debugViewEntity, window.map.getBounds(), Cesium.Color.CYAN, 0.035, 500);
  } else {
    globeView.removeDebugEntity('debugViewEntity');
  }
  if (globeView.settings.debugCoverage) {
    globeView.debugCoverageEntity = globeView.setDebugRectangle(
      globeView.debugCoverageEntity,
      request && request.fetchedDataParams && request.fetchedDataParams.bounds,
      Cesium.Color.YELLOW,
      0.08,
      1000
    );
  } else {
    globeView.removeDebugEntity('debugCoverageEntity');
  }

  globeView.clearDebugTiles();
  if (!globeView.settings.debugTiles) return;
  var tileRectangles = request && request.debugTiles && request.debugTiles.debugTileToRectangle;
  if (!tileRectangles) return;

  Object.keys(tileRectangles)
    .slice(0, globeView.MAX_DEBUG_TILES)
    .forEach(function (tileId) {
      var tile = tileRectangles[tileId];
      if (!tile || !tile.getBounds) return;
      var color = Cesium.Color.fromCssColorString(tile.options.color || '#ff00ff');
      var entity = globeView.setDebugRectangle(null, tile.getBounds(), color, 0.12, 1500);
      if (entity) globeView.debugTileEntities.push(entity);
    });
};

globeView.updateDebug = function () {
  if (!globeView.container) return;
  var debug = globeView.container.querySelector('#iitc-globe-debug');
  if (!debug) return;
  debug.style.display = globeView.settings.debugPanel ? '' : 'none';
  if (!globeView.settings.debugPanel) return;

  var map = window.map;
  var request = window.mapDataRequest;
  var mapZoom = map.getZoom();
  var dataZoom = window.getDataZoomForMapZoom(mapZoom);
  var tileParams = window.getMapZoomTileParameters(dataZoom);
  var focus = globeView.getGlobeFocus();
  var status = request && request.getStatus();
  var fetched = request && request.fetchedDataParams;
  var lines = [
    'GLOBE FOCUS  ' + (focus ? globeView.formatPoint(Cesium.Math.toDegrees(focus.latitude), Cesium.Math.toDegrees(focus.longitude)) : 'space'),
    'IITC CENTER  ' + globeView.formatPoint(map.getCenter().lat, map.getCenter().lng) + '  z' + mapZoom + ' → data z' + dataZoom,
    'DETAIL       ' + (tileParams.hasPortals ? 'portals' : 'links ≥ ' + Math.round(tileParams.minLinkLength / 1000) + ' km'),
    'BASE MAP     ' + (globeView.imagerySourceName || 'loading'),
    'VIEW BOUNDS  ' + globeView.formatBounds(map.getBounds()),
    'TILE BOUNDS  ' + globeView.formatBounds(fetched && fetched.bounds),
    'CACHE        ' + Object.keys(window.portals).length + ' portals · ' + Object.keys(window.links).length + ' links',
    'REQUEST      ' + (status ? status.short : 'not started'),
    'AA           ' + globeView.activeMsaaSamples + '× MSAA · ' + (globeView.settings.fxaa || globeView.settings.screenshotMode ? 'FXAA' : 'no FXAA'),
    'RENDER       ' + (globeView.fps ? Math.round(globeView.fps) + ' FPS' : 'sampling FPS'),
  ];
  if (globeView.settings.linkFlow) {
    lines.push(
      'FLOW         all ' + Object.keys(globeView.linkEntities).length + ' paths · ' +
      'faction colours @ ' + globeView.settings.linkFlowOpacity + ' · ' +
      globeView.settings.linkFlowPulse +
      ' · GPU clock · integrated'
    );
  }

  debug.textContent = lines.join('\n');
};

globeView.sampleFps = function () {
  if (!globeView.active || !globeView.settings.debugPanel) return;
  var now = Date.now();
  if (!globeView.fpsSampleTime) globeView.fpsSampleTime = now;
  globeView.fpsFrameCount += 1;
  var elapsed = now - globeView.fpsSampleTime;
  if (elapsed < 750) return;
  globeView.fps = globeView.fpsFrameCount * 1000 / elapsed;
  globeView.fpsFrameCount = 0;
  globeView.fpsSampleTime = now;
  globeView.updateDebug();
};

globeView.loadSavedCameraState = function () {
  try {
    var state = JSON.parse(localStorage[globeView.CAMERA_STATE_KEY] || 'null');
    if (!state || !Number.isFinite(state.lat) || !Number.isFinite(state.lng) || !Number.isFinite(state.height)) return null;
    return state;
  } catch (error) {
    return null;
  }
};

globeView.saveCameraState = function () {
  if (!globeView.active || !globeView.viewer) return;
  var focus = globeView.getGlobeFocus();
  var height = globeView.viewer.camera.positionCartographic.height;
  if (!focus || !Number.isFinite(height)) return;
  try {
    localStorage[globeView.CAMERA_STATE_KEY] = JSON.stringify({
      lat: Cesium.Math.toDegrees(focus.latitude),
      lng: Cesium.Math.toDegrees(focus.longitude),
      height: height,
    });
  } catch (error) {
    console.warn('Globe view: unable to save camera state', error);
  }
};

globeView.positionCameraFromMap = function () {
  if (!globeView.viewer || !window.map) return;
  var saved = globeView.restoreSavedView ? globeView.loadSavedCameraState() : null;
  if (saved) {
    globeView.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(saved.lng, saved.lat, Math.max(1000, saved.height)),
    });
    return;
  }
  var center = window.map.getCenter();
  var zoomDifference = window.map.getZoom() - globeView.initialMapZoom;
  var height = globeView.INITIAL_CAMERA_HEIGHT / Math.pow(2, zoomDifference);
  // Keep the restored camera safely above the globe while preserving IITC's
  // close portal-detail zoom levels.
  height = Math.max(1000, Math.min(globeView.INITIAL_CAMERA_HEIGHT * 4, height));
  globeView.viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(center.lng, center.lat, height),
  });
};

// Comm portal links recenter Leaflet directly. Follow that completed map move
// so the active globe travels to the same location instead of merely loading
// data for somewhere off camera.
globeView.followIitcMapMove = function () {
  if (!globeView.active || !globeView.viewer || !window.map) return;
  var center = window.map.getCenter();
  var focus = globeView.getGlobeFocus();
  var height = globeView.viewer.camera.positionCartographic.height;
  if (!center || !focus || !Number.isFinite(height)) return;
  var focusLatLng = L.latLng(Cesium.Math.toDegrees(focus.latitude), Cesium.Math.toDegrees(focus.longitude));
  var distance = focusLatLng.distanceTo(center);
  // Ignore the reciprocal move made when a globe drag synchronizes Leaflet.
  if (distance < 75) return;
  globeView.viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(center.lng, center.lat, Math.max(1000, height)),
    duration: Math.max(0.55, Math.min(1.5, 0.55 + distance / 15000000)),
    orientation: {
      heading: globeView.viewer.camera.heading,
      pitch: globeView.viewer.camera.pitch,
      roll: globeView.viewer.camera.roll,
    },
  });
};

globeView.scheduleCommPortalFollow = function (event) {
  if (!globeView.active || !event.target || !event.target.closest || !event.target.closest('#chat a')) return;
  clearTimeout(globeView.commPortalFollowTimer);
  // Let IITC's COMMs click handler finish its Leaflet setView first.
  globeView.commPortalFollowTimer = setTimeout(function () {
    globeView.commPortalFollowTimer = null;
    globeView.followIitcMapMove();
  }, 120);
};

globeView.startAreaSelection = function () {
  if (!globeView.viewer) return;
  globeView.areaSelectionActive = true;
  globeView.areaSelectionPoints = [];
  if (globeView.areaSelectionEntity) globeView.viewer.entities.remove(globeView.areaSelectionEntity);
  globeView.areaSelectionEntity = null;
  globeView.setStatus('Area selection: click three or more points on the globe, then choose Use marked area.');
  globeView.updateCompositionControls();
};

globeView.updateCompositionControls = function (form) {
  form = form || document.getElementById('globe-view-settings');
  if (!form) return;
  var screenshot = globeView.settings.screenshotMode;
  var mode = globeView.settings.fieldFilterMode;
  var hasArea = globeView.areaSelectionPoints.length >= 3;
  var hasPins = Object.keys(globeView.pinnedPortalGuids).length > 0;
  var hasExclusions = Object.keys(globeView.excludedFieldGuids).length > 0;
  var hasFieldFilter = mode !== 'all' || !globeView.settings.showEnlightenedFields || !globeView.settings.showResistanceFields || hasExclusions;
  var setActive = function (name, active) {
    var button = form.elements[name];
    if (button) button.classList.toggle('filter-active', !!active);
  };
  setActive('selectArea', globeView.areaSelectionActive);
  setActive('useArea', screenshot && mode === 'area' && hasArea);
  setActive('clearArea', globeView.areaSelectionPoints.length > 0);
  setActive('useSelectedPortal', screenshot && mode === 'selectedPortal');
  setActive('pinSelectedPortal', screenshot && mode === 'pinnedPortals' && hasPins);
  setActive('excludeSelectedField', screenshot && hasExclusions);
  setActive('clearComposition', screenshot && hasFieldFilter);
};

globeView.invalidatePortalComposition = function () {
  globeView.portalCompositionCache = null;
  globeView.compositionDataRevision += 1;
};

globeView.refreshComposition = function (refreshMapObjects) {
  if (!globeView.active || !globeView.viewer) return;
  globeView.invalidatePortalComposition();
  if (refreshMapObjects) {
    globeView.synchronizeLinks();
    globeView.synchronizePortals();
  }
  globeView.synchronizeFields();
  globeView.updateCompositionControls();
};

globeView.drawAreaSelection = function () {
  if (!globeView.viewer || globeView.areaSelectionPoints.length < 1) return;
  if (globeView.areaSelectionEntity) globeView.viewer.entities.remove(globeView.areaSelectionEntity);
  var positions = globeView.areaSelectionPoints.map(function (point) {
    return Cesium.Cartesian3.fromDegrees(point.lng, point.lat, globeView.FIELD_HEIGHT + 400);
  });
  var outline = positions.slice();
  if (positions.length >= 3) outline.push(positions[0]);
  globeView.areaSelectionEntity = globeView.viewer.entities.add({
    position: positions[0],
    point: {
      color: Cesium.Color.ORANGE,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 1,
      pixelSize: 10,
    },
    polygon: positions.length >= 3 ? {
      hierarchy: new Cesium.PolygonHierarchy(positions),
      material: Cesium.Color.ORANGE.withAlpha(0.06),
      outline: true,
      outlineColor: Cesium.Color.ORANGE,
    } : undefined,
    polyline: positions.length >= 2 ? {
      arcType: Cesium.ArcType.GEODESIC,
      material: Cesium.Color.ORANGE,
      positions: outline,
      width: 3,
    } : undefined,
  });
};

globeView.addAreaSelectionPoint = function (position) {
  if (!globeView.viewer) return;
  var surface = globeView.viewer.camera.pickEllipsoid(position, globeView.viewer.scene.globe.ellipsoid);
  if (!surface) return;
  var cartographic = Cesium.Cartographic.fromCartesian(surface);
  globeView.areaSelectionPoints.push(L.latLng(Cesium.Math.toDegrees(cartographic.latitude), Cesium.Math.toDegrees(cartographic.longitude)));
  globeView.drawAreaSelection();
  globeView.updateCompositionControls();
  globeView.setStatus(globeView.areaSelectionPoints.length + ' area points marked. Add at least 3, then choose Use marked area.');
};

globeView.useAreaSelection = function () {
  if (globeView.areaSelectionPoints.length < 3) {
    globeView.setStatus('Mark at least three area points first.');
    return;
  }
  globeView.areaSelectionActive = false;
  globeView.settings.fieldFilterMode = 'area';
  if (globeView.areaSelectionEntity && globeView.viewer) globeView.viewer.entities.remove(globeView.areaSelectionEntity);
  globeView.areaSelectionEntity = null;
  globeView.saveSettings();
  globeView.refreshComposition(true);
  globeView.setStatus('Area filter applied.');
};

globeView.clearAreaSelection = function () {
  var wasAreaFilter = globeView.settings.fieldFilterMode === 'area';
  globeView.areaSelectionActive = false;
  globeView.areaSelectionPoints = [];
  if (wasAreaFilter) globeView.settings.fieldFilterMode = 'all';
  if (globeView.areaSelectionEntity && globeView.viewer) globeView.viewer.entities.remove(globeView.areaSelectionEntity);
  globeView.areaSelectionEntity = null;
  globeView.saveSettings();
  globeView.refreshComposition(wasAreaFilter);
};

globeView.useSelectedPortalFilter = function () {
  if (!window.selectedPortal || !window.portals[window.selectedPortal]) return;
  globeView.settings.fieldFilterMode = 'selectedPortal';
  globeView.saveSettings();
  globeView.refreshComposition(true);
};

globeView.pinSelectedPortal = function () {
  if (!window.selectedPortal || !window.portals[window.selectedPortal]) return;
  globeView.pinnedPortalGuids[window.selectedPortal] = true;
  globeView.settings.fieldFilterMode = 'pinnedPortals';
  globeView.saveSettings();
  globeView.refreshComposition(true);
};

globeView.excludeSelectedField = function () {
  if (!globeView.selectedFieldGuid) return;
  globeView.excludedFieldGuids[globeView.selectedFieldGuid] = true;
  globeView.saveSettings();
  globeView.refreshComposition(false);
};

globeView.clearCompositionFilters = function () {
  globeView.excludedFieldGuids = {};
  globeView.pinnedPortalGuids = {};
  globeView.selectedFieldGuid = null;
  globeView.settings.fieldFilterMode = 'all';
  globeView.settings.showFields = true;
  globeView.settings.showEnlightenedFields = true;
  globeView.settings.showResistanceFields = true;
  globeView.areaSelectionActive = false;
  globeView.areaSelectionPoints = [];
  if (globeView.areaSelectionEntity && globeView.viewer) globeView.viewer.entities.remove(globeView.areaSelectionEntity);
  globeView.areaSelectionEntity = null;
  globeView.saveSettings();
  globeView.refreshComposition(true);
};

globeView.captureScreenshot = function () {
  if (!globeView.viewer) return;
  try {
    globeView.viewer.render();
    var link = document.createElement('a');
    link.download = 'iitc-globe-' + new Date().toISOString().replace(/[:.]/g, '-') + '.png';
    link.href = globeView.viewer.canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.warn('Globe view: screenshot capture failed', error);
    window.dialog({ title: 'Screenshot unavailable', html: 'The browser could not export the globe canvas. Use the browser screenshot tool while Screenshot mode is enabled.' });
  }
};

globeView.createNebulaStage = function () {
  globeView.nebulaStage = globeView.viewer.scene.postProcessStages.add(
    new Cesium.PostProcessStage({
      fragmentShader: globeView.NEBULA_FRAGMENT_SHADER,
      name: 'globe-view-nebula',
      uniforms: {
        nebulaColorA: new Cesium.Cartesian3(0.025, 0.29, 0.43),
        nebulaColorB: new Cesium.Cartesian3(0.34, 0.045, 0.38),
        nebulaDensity: 1,
        advancedNebula: 1,
        nebulaDust: 0.5,
        nebulaMotion: 1,
        starDensity: 1.25,
        starFlickerSpeed: 0.0175,
        starFlickerEnabled: 1,
        starSize: 3,
        animationTime: 0,
        sunEnabled: 1,
        sunGlow: 1,
        solarRimFlare: 1,
        globeRimCenter: new Cesium.Cartesian2(0.5, 0.5),
        globeRimRadius: 0,
        sunScreenCenter: new Cesium.Cartesian2(0.5, 0.5),
        sunScreenVisible: 0,
        shootingStars: 0,
        shootingStarDensity: 0.35,
        nebulaEnabled: 1,
        cssBackdrop: 0,
      },
    })
  );
};

globeView.isGlowEnabled = function () {
  return globeView.settings.bloom || (globeView.settings.screenshotMode && globeView.settings.screenshotGlow);
};

globeView.isGpuNebulaActive = function () {
  return !!(globeView.nebulaStage && globeView.nebulaStage.enabled && globeView.nebulaStage.uniforms.nebulaEnabled > 0.5);
};

globeView.updateNebulaStage = function () {
  if (!globeView.nebulaStage || !globeView.viewer) return;
  var height = globeView.viewer.camera.positionCartographic.height;
  var closeSpace = Number.isFinite(height) && height < globeView.CLOSE_SPACE_BACKGROUND_HEIGHT;
  var nebulaEnabled = globeView.settings.nebula && Number.isFinite(height) && height >= globeView.NEBULA_MIN_CAMERA_HEIGHT;
  var cssBackdropRepair = globeView.settings.spaceBackdrop && !nebulaEnabled && !closeSpace && globeView.isGlowEnabled();
  if (globeView.container) {
    if (globeView.container.classList.contains('globe-close-space') !== closeSpace) {
      globeView.container.classList.toggle('globe-close-space', closeSpace);
    }
  }
  globeView.updateCloudVeilVisibility();
  globeView.nebulaStage.uniforms.nebulaEnabled = nebulaEnabled ? 1 : 0;
  globeView.nebulaStage.uniforms.cssBackdrop = cssBackdropRepair ? 1 : 0;
  if (globeView.nebulaStage.enabled !== (nebulaEnabled || cssBackdropRepair)) {
    globeView.nebulaStage.enabled = nebulaEnabled || cssBackdropRepair;
  }
  globeView.updateSolarRimGeometry();
};

globeView.updateSolarRimGeometry = function () {
  if (!globeView.nebulaStage || !globeView.viewer) return;
  var uniforms = globeView.nebulaStage.uniforms;
  if (!globeView.settings.sun || !globeView.isGpuNebulaActive()) {
    uniforms.globeRimRadius = 0;
    uniforms.sunScreenVisible = 0;
    return;
  }
  var scene = globeView.viewer.scene;
  var canvas = scene.canvas;
  var width = canvas.clientWidth || canvas.width || 1;
  var height = canvas.clientHeight || canvas.height || 1;
  var uniformState = scene.context && scene.context.uniformState;
  var sunPosition = uniformState && uniformState.sunPositionWC;
  if (!sunPosition) {
    uniforms.globeRimRadius = 0;
    uniforms.sunScreenVisible = 0;
    return;
  }
  if (!globeView.solarScreenPosition) globeView.solarScreenPosition = new Cesium.Cartesian2();
  if (!globeView.solarEyePosition) globeView.solarEyePosition = new Cesium.Cartesian3();
  var sunEyePosition = Cesium.Matrix4.multiplyByPoint(globeView.viewer.camera.viewMatrix, sunPosition, globeView.solarEyePosition);
  var sunScreenPosition = Cesium.SceneTransforms.worldToWindowCoordinates(scene, sunPosition, globeView.solarScreenPosition);
  if (!sunScreenPosition || sunEyePosition.z >= 0) {
    uniforms.globeRimRadius = 0;
    uniforms.sunScreenVisible = 0;
    return;
  }
  var sunScreenCenter = uniforms.sunScreenCenter;
  sunScreenCenter.x = sunScreenPosition.x / width;
  sunScreenCenter.y = 1 - sunScreenPosition.y / height;
  uniforms.sunScreenVisible = 1;
  if (!globeView.settings.solarRimFlare) {
    uniforms.globeRimRadius = 0;
    return;
  }
  if (!globeView.globeRimScreenPosition) globeView.globeRimScreenPosition = new Cesium.Cartesian2();
  var center = Cesium.SceneTransforms.worldToWindowCoordinates(scene, Cesium.Cartesian3.ZERO, globeView.globeRimScreenPosition);
  var cameraDistance = Cesium.Cartesian3.magnitude(globeView.viewer.camera.positionWC);
  var radius = Cesium.Ellipsoid.WGS84.maximumRadius;
  var frustum = globeView.viewer.camera.frustum;
  var fov = frustum.fovy || Cesium.Math.toRadians(60);
  if (!center || !Number.isFinite(cameraDistance) || cameraDistance <= radius) {
    uniforms.globeRimRadius = 0;
    return;
  }
  var angularRadius = Math.asin(Math.min(0.999999, radius / cameraDistance));
  var focalLength = height / (2 * Math.tan(fov / 2));
  var rimCenter = uniforms.globeRimCenter;
  if (!rimCenter) rimCenter = uniforms.globeRimCenter = new Cesium.Cartesian2();
  rimCenter.x = center.x / width;
  rimCenter.y = 1 - center.y / height;
  uniforms.globeRimRadius = focalLength * Math.tan(angularRadius) / height;
};

globeView.updateAtmosphericEntryGlow = function () {
  if (!globeView.viewer || !globeView.container) return;
  var glow = globeView.container.querySelector('#iitc-globe-entryglow');
  if (!glow || !globeView.settings.atmosphericEntryGlow) {
    if (glow) glow.style.opacity = '0';
    return;
  }
  var camera = globeView.viewer.camera;
  var height = camera.positionCartographic.height;
  var width = globeView.viewer.canvas.clientWidth || 1;
  var viewportHeight = globeView.viewer.canvas.clientHeight || 1;
  var earthRadius = Cesium.Ellipsoid.WGS84.maximumRadius;
  var distance = Cesium.Cartesian3.magnitude(camera.positionWC);
  var fov = camera.frustum.fovy || Cesium.Math.toRadians(60);
  if (!Number.isFinite(height) || height > 12000000 || !Number.isFinite(distance) || distance <= earthRadius) {
    glow.style.opacity = '0';
    return;
  }
  var radius = Math.tan(Math.asin(earthRadius / distance)) / Math.tan(fov / 2) * viewportHeight / 2;
  if (!Number.isFinite(radius) || radius < 1) {
    glow.style.opacity = '0';
    return;
  }
  var size = Math.max(160, Math.min(Math.max(width, viewportHeight) * 4, radius * 2));
  var entry = Math.max(0, Math.min(1, (11000000 - height) / 9000000));
  entry = entry * entry * (3 - 2 * entry);
  glow.style.width = size + 'px';
  glow.style.height = size + 'px';
  glow.style.opacity = String(0.22 + entry * 0.42);
  glow.style.transform = 'translate3d(' + (width / 2 - size / 2) + 'px, ' + (viewportHeight / 2 - size / 2) + 'px, 0)';
};

globeView.scheduleAtmosphericEntryGlow = function () {
  if (globeView.entryGlowTimer) return;
  globeView.entryGlowTimer = setTimeout(function () {
    globeView.entryGlowTimer = null;
    globeView.updateAtmosphericEntryGlow();
  }, 40);
};

// When the GPU nebula stage is off, retain a small CSS fallback behind the
// canvas so a sun at the limb still gets a soft flare without another pass.
globeView.updateCssSolarRimFlare = function () {
  if (!globeView.viewer || !globeView.container) return;
  var flare = globeView.container.querySelector('#iitc-globe-rimflare');
  if (!flare || !globeView.settings.sun || !globeView.settings.solarRimFlare || globeView.isGpuNebulaActive()) {
    if (flare) flare.style.opacity = '0';
    return;
  }
  var scene = globeView.viewer.scene;
  var uniformState = scene.context && scene.context.uniformState;
  var sunPosition = uniformState && uniformState.sunPositionWC;
  var sunScreen = sunPosition && Cesium.SceneTransforms.worldToWindowCoordinates(scene, sunPosition);
  var width = globeView.viewer.canvas.clientWidth || 1;
  var height = globeView.viewer.canvas.clientHeight || 1;
  var cameraDistance = Cesium.Cartesian3.magnitude(globeView.viewer.camera.positionWC);
  var earthRadius = Cesium.Ellipsoid.WGS84.maximumRadius;
  var fov = globeView.viewer.camera.frustum.fovy || Cesium.Math.toRadians(60);
  if (!sunScreen || !Number.isFinite(cameraDistance) || cameraDistance <= earthRadius) {
    flare.style.opacity = '0';
    return;
  }
  var radius = Math.tan(Math.asin(earthRadius / cameraDistance)) / Math.tan(fov / 2) * height / 2;
  var centerX = width / 2;
  var centerY = height / 2;
  var dx = sunScreen.x - centerX;
  var dy = sunScreen.y - centerY;
  var distance = Math.sqrt(dx * dx + dy * dy);
  if (!Number.isFinite(radius) || distance < 1 || Math.abs(distance - radius) > radius * 0.5) {
    flare.style.opacity = '0';
    return;
  }
  var scale = Math.max(0.55, Math.min(1.25, globeView.settings.sunGlow || 1));
  var horizonStrength = Math.max(0, 1 - Math.abs(distance - radius) / (radius * 0.5));
  var x = centerX + dx / distance * radius - 90;
  var y = centerY + dy / distance * radius - 90;
  flare.style.opacity = String(horizonStrength * 0.82);
  flare.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale(' + scale + ')';
};

globeView.updateSun = function () {
  if (!globeView.nebulaStage || !globeView.viewer) return;
  globeView.updateCssSolarRimFlare();
  var cssSun = globeView.container && globeView.container.querySelector('#iitc-globe-sun');
  if (!globeView.settings.sun || globeView.isGpuNebulaActive()) {
    if (cssSun) cssSun.style.opacity = '0';
    return;
  }
  var scene = globeView.viewer.scene;
  var uniformState = scene.context && scene.context.uniformState;
  var position = uniformState && uniformState.sunPositionWC;
  var screenPosition = position && Cesium.SceneTransforms.worldToWindowCoordinates(scene, position);
  var width = globeView.viewer.canvas.clientWidth || 1;
  var height = globeView.viewer.canvas.clientHeight || 1;
  var visible = screenPosition && screenPosition.x >= -width * 0.15 && screenPosition.x <= width * 1.15 && screenPosition.y >= -height * 0.15 && screenPosition.y <= height * 1.15;
  if (!cssSun) return;
  var closeSpace = globeView.container.classList.contains('globe-close-space');
  cssSun.style.opacity = visible && !closeSpace ? String(Math.min(1, 0.55 + globeView.settings.sunGlow * 0.15)) : '0';
  var translateX = visible ? screenPosition.x - 105 : -500;
  var translateY = visible ? screenPosition.y - 105 : -500;
  cssSun.style.transform = 'translate3d(' + translateX + 'px, ' + translateY + 'px, 0) scale(' + Math.max(0.45, globeView.settings.sunGlow || 1) + ')';
};

globeView.scheduleSunUpdate = function () {
  if (!globeView.settings.sun || !globeView.nebulaStage || globeView.isGpuNebulaActive()) return;
  var now = performance.now();
  if (now - globeView.lastSunUpdateTime < globeView.SUN_CSS_UPDATE_INTERVAL) return;
  globeView.lastSunUpdateTime = now;
  globeView.updateSun();
};

globeView.handleCameraMoveStart = function () {
  globeView.cameraMoving = true;
  clearTimeout(globeView.hoverCursorTimer);
  globeView.hoverCursorTimer = null;
  // Never rebuild a large batch halfway through a new camera gesture; the
  // debounced move-end path will rebuild from the final position instead.
  clearTimeout(globeView.linkGeometryTimer);
  globeView.linkGeometryTimer = null;
  if (globeView.viewer && !globeView.areaSelectionActive) globeView.viewer.canvas.style.cursor = 'grabbing';
};

globeView.handleCameraMoveEnd = function () {
  globeView.cameraMoving = false;
  if (!globeView.viewer) return;
  globeView.viewer.canvas.style.cursor = globeView.areaSelectionActive ? 'crosshair' : 'grab';
};

globeView.scheduleHoverCursor = function (movement) {
  if (!globeView.viewer || !movement || !movement.endPosition) return;
  if (globeView.areaSelectionActive) {
    globeView.viewer.canvas.style.cursor = 'crosshair';
    return;
  }
  if (globeView.cameraMoving) {
    globeView.viewer.canvas.style.cursor = 'grabbing';
    return;
  }
  if (!globeView.hoverCursorPosition) globeView.hoverCursorPosition = new Cesium.Cartesian2();
  globeView.hoverCursorPosition.x = movement.endPosition.x;
  globeView.hoverCursorPosition.y = movement.endPosition.y;
  if (globeView.hoverCursorTimer) return;
  globeView.hoverCursorTimer = setTimeout(function () {
    globeView.hoverCursorTimer = null;
    if (!globeView.active || !globeView.viewer || globeView.areaSelectionActive || globeView.cameraMoving) return;
    var picked = globeView.viewer.scene.pick(globeView.hoverCursorPosition);
    globeView.viewer.canvas.style.cursor = globeView.getPickedPortalGuid(picked) ? 'pointer' : 'grab';
  }, 70);
};

globeView.getActiveIITCBaseLayer = function () {
  if (!window.map || !window.layerChooser || !Array.isArray(window.layerChooser._layers)) return null;
  return window.layerChooser._layers.find(function (entry) {
    return !entry.overlay && window.map.hasLayer(entry.layer);
  }) || null;
};

globeView.createIITCImageryProvider = function () {
  var baseLayer = globeView.getActiveIITCBaseLayer();
  var layer = baseLayer && baseLayer.layer;
  // A regular Leaflet TileLayer exposes its template URL. Google Mutant,
  // vector, and other script-driven layers do not, so they use the safe
  // fallback rather than attempting to copy their internal implementation.
  if (layer && typeof layer._url === 'string' && typeof layer.getTileUrl === 'function') {
    var options = layer.options || {};
    var url = layer._url;
    Object.keys(options).forEach(function (name) {
      if (name === 'subdomains' || name === 'tms') return;
      var value = options[name];
      if (typeof value !== 'string' && typeof value !== 'number') return;
      url = url.split('{' + name + '}').join(String(value));
    });
    if (options.tms) url = url.split('{y}').join('{reverseY}');
    var unsupportedToken = (url.match(/\{[^}]+\}/g) || []).some(function (token) {
      return ['{s}', '{x}', '{y}', '{z}', '{reverseY}'].indexOf(token) === -1;
    });
    if (unsupportedToken) {
      globeView.imagerySourceName = 'OpenStreetMap fallback';
      return new Cesium.OpenStreetMapImageryProvider({ url: globeView.FALLBACK_TILE_URL });
    }
    globeView.imagerySourceName = baseLayer.name || 'IITC base map';
    return new Cesium.UrlTemplateImageryProvider({
      url: url,
      subdomains: options.subdomains,
      minimumLevel: Math.max(0, Number(options.minZoom) || 0),
      maximumLevel: Number(options.maxNativeZoom || options.maxZoom) || undefined,
      credit: options.attribution ? new Cesium.Credit(options.attribution) : undefined,
    });
  }
  globeView.imagerySourceName = 'OpenStreetMap fallback';
  return new Cesium.OpenStreetMapImageryProvider({ url: globeView.FALLBACK_TILE_URL });
};

globeView.createCloudVeilLayer = function () {
  if (!globeView.viewer || globeView.cloudVeilLayer) return;
  var width = 1024;
  var height = 512;
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  var context = canvas.getContext('2d');
  var seed = 0x6d2b79f5;
  var random = function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    var value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  context.filter = 'blur(18px)';
  for (var index = 0; index < 180; index += 1) {
    var x = random() * width;
    var y = height * (0.12 + random() * 0.76);
    var radiusX = 32 + random() * 135;
    var radiusY = 9 + random() * 36;
    var gradient = context.createRadialGradient(x, y, 0, x, y, radiusX);
    gradient.addColorStop(0, 'rgba(225, 241, 255, ' + (0.100 + random() * 0.150).toFixed(3) + ')');
    gradient.addColorStop(0.48, 'rgba(190, 220, 246, 0.070)');
    gradient.addColorStop(1, 'rgba(170, 205, 235, 0)');
    context.fillStyle = gradient;
    [-width, 0, width].forEach(function (offset) {
      context.save();
      context.translate(offset, 0);
      context.scale(1, radiusY / radiusX);
      context.beginPath();
      context.arc(x, y * radiusX / radiusY, radiusX, 0, Math.PI * 2);
      context.fill();
      context.restore();
    });
  }
  context.filter = 'none';
  var provider = new Cesium.SingleTileImageryProvider({
    url: canvas.toDataURL('image/png'),
    rectangle: Cesium.Rectangle.MAX_VALUE,
  });
  globeView.cloudVeilLayer = globeView.viewer.imageryLayers.addImageryProvider(provider);
  globeView.cloudVeilLayer.alpha = 1;
  globeView.cloudVeilLayer.show = false;
};

globeView.updateCloudVeilVisibility = function () {
  if (!globeView.cloudVeilLayer || !globeView.viewer) return;
  var height = globeView.viewer.camera.positionCartographic.height;
  var visible = globeView.settings.cloudVeil && Number.isFinite(height) && height >= 45000;
  if (globeView.cloudVeilLayer.show !== visible) globeView.cloudVeilLayer.show = visible;
};

globeView.createViewer = function () {
  var imageryProvider = globeView.createIITCImageryProvider();
  var imageryLayer = new Cesium.ImageryLayer(imageryProvider);
  imageryLayer.brightness = 1;
  imageryLayer.contrast = 1;
  imageryLayer.gamma = 1;
  imageryLayer.saturation = 1;
  globeView.imageryLayer = imageryLayer;

  globeView.viewer = new Cesium.Viewer(globeView.container, {
    animation: false,
    baseLayer: imageryLayer,
    baseLayerPicker: false,
    contextOptions: {
      webgl: {
        alpha: true,
        antialias: true,
      },
    },
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    navigationHelpButton: false,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    useBrowserRecommendedResolution: false,
  });

  globeView.viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT;
  globeView.normalMsaaSamples = globeView.viewer.scene.msaaSamples;
  globeView.activeMsaaSamples = globeView.normalMsaaSamples || 1;
  globeView.viewer.scene.skyBox.show = false;
  globeView.viewer.scene.skyAtmosphere.show = false;
  if (globeView.viewer.scene.sun) globeView.viewer.scene.sun.show = false;
  globeView.viewer.scene.globe.depthTestAgainstTerrain = true;
  globeView.viewer.scene.screenSpaceCameraController.enableCollisionDetection = true;
  globeView.createCloudVeilLayer();
  globeView.createNebulaStage();
  globeView.fps = 0;
  globeView.fpsFrameCount = 0;
  globeView.fpsSampleTime = 0;
  globeView.viewer.clock.onTick.addEventListener(globeView.updateAutoRotate);
  globeView.viewer.clock.onTick.addEventListener(globeView.updateScreenshotPresentation);
  globeView.viewer.clock.onTick.addEventListener(globeView.updateAnimationTime);
  globeView.viewer.clock.onTick.addEventListener(globeView.scheduleSunUpdate);
  // camera.changed is deliberately throttled by Cesium.  The rim is a
  // screen-space mask, so update it just before every render while active.
  globeView.viewer.scene.preRender.addEventListener(globeView.updateSolarRimGeometry);
  globeView.viewer.scene.postRender.addEventListener(globeView.sampleFps);
  globeView.viewer.canvas.style.cursor = 'grab';
  globeView.viewer.screenSpaceEventHandler.setInputAction(function (movement) {
    if (globeView.areaSelectionActive) {
      globeView.addAreaSelectionPoint(movement.position);
      return;
    }
    var picked = globeView.viewer.scene.pick(movement.position);
    var guid = globeView.getPickedPortalGuid(picked);
    if (guid) {
      globeView.openPortal(guid);
      return;
    }
    var fieldGuid = globeView.getPickedFieldGuid(picked);
    if (fieldGuid) {
      globeView.selectedFieldGuid = fieldGuid;
      globeView.setStatus('Selected field. Choose a field filter in Screenshot composition.');
      globeView.scheduleFieldSynchronize();
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  globeView.viewer.screenSpaceEventHandler.setInputAction(function (movement) {
    globeView.scheduleHoverCursor(movement);
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  globeView.viewer.camera.moveEnd.addEventListener(globeView.updateNebulaStage);
  globeView.viewer.camera.moveEnd.addEventListener(globeView.handleCameraMoveEnd);
  globeView.viewer.camera.moveEnd.addEventListener(globeView.updateSun);
  globeView.viewer.camera.moveEnd.addEventListener(globeView.updateAtmosphericEntryGlow);
  globeView.viewer.camera.moveEnd.addEventListener(globeView.updateGlobeGridVisibility);
  globeView.viewer.camera.moveEnd.addEventListener(globeView.scheduleMapSynchronize);
  globeView.viewer.camera.moveEnd.addEventListener(function () {
    globeView.scheduleLinkGeometryRefresh(false);
  });
  globeView.viewer.camera.moveEnd.addEventListener(globeView.saveCameraState);
  globeView.viewer.camera.changed.addEventListener(globeView.updateNebulaStage);
  globeView.viewer.camera.moveStart.addEventListener(globeView.handleCameraMoveStart);
  globeView.viewer.camera.changed.addEventListener(globeView.scheduleSunUpdate);
  globeView.viewer.camera.changed.addEventListener(globeView.scheduleAtmosphericEntryGlow);
  globeView.viewer.camera.changed.addEventListener(globeView.updateGlobeGridVisibility);
  globeView.positionCameraFromMap();
  globeView.applySettings();
  globeView.updateDebug();
  globeView.updateDebugGeometry();
};

globeView.getScreenshotMsaaSamples = function () {
  var scene = globeView.viewer && globeView.viewer.scene;
  if (!scene || !scene.msaaSupported) return globeView.normalMsaaSamples || 1;
  // Cesium exposes whether MSAA is available but not its maximum sample count.
  // Read the underlying WebGL limit so an 8× request safely becomes 4× (or 2×)
  // on hardware with a smaller multisample render-target limit.
  var gl = scene.context && scene.context._gl;
  var maximum = gl && typeof gl.getParameter === 'function' && gl.MAX_SAMPLES
    ? Number(gl.getParameter(gl.MAX_SAMPLES))
    : globeView.SCREENSHOT_MSAA_SAMPLES;
  var samples = globeView.SCREENSHOT_MSAA_SAMPLES;
  while (samples > maximum && samples > 1) samples /= 2;
  return samples;
};

globeView.applySettings = function (changed, previous) {
  var changedSet = {};
  (changed || []).forEach(function (name) { changedSet[name] = true; });
  var hasChanged = function (names) {
    return !changed || names.some(function (name) { return changedSet[name]; });
  };
  previous = previous || globeView.settings;
  var areaFilterActive = function (settings) {
    return settings.screenshotMode && settings.fieldFilterMode === 'area' && globeView.areaSelectionPoints.length >= 3;
  };
  var mapCompositionActive = function (settings) {
    return settings.screenshotMode && ['area', 'selectedPortal', 'pinnedPortals'].indexOf(settings.fieldFilterMode) !== -1;
  };
  var fieldCompositionActive = function (settings) {
    return settings.screenshotMode && (settings.fieldFilterMode !== 'all' || !settings.showEnlightenedFields || !settings.showResistanceFields || Object.keys(globeView.excludedFieldGuids).length > 0);
  };
  var screenshotFieldEffectsActive = function (settings) {
    return settings.screenshotMode && ((settings.fieldStyle === 'shimmer' && settings.fieldMotion) || settings.fieldCaustics || settings.fieldDepthHaze);
  };
  var mapCompositionChanged = mapCompositionActive(previous) !== mapCompositionActive(globeView.settings) ||
    (hasChanged(['fieldFilterMode']) && (mapCompositionActive(previous) || mapCompositionActive(globeView.settings)));
  var fieldCompositionChanged =
    (hasChanged(['fieldFilterMode']) && (globeView.settings.screenshotMode || previous.screenshotMode)) ||
    (hasChanged(['fieldAreaRule']) && (areaFilterActive(previous) || areaFilterActive(globeView.settings))) ||
    (hasChanged(['showEnlightenedFields', 'showResistanceFields']) && (globeView.settings.screenshotMode || previous.screenshotMode));
  var screenshotFieldStateChanged = hasChanged(['screenshotMode']) && (fieldCompositionActive(previous) || fieldCompositionActive(globeView.settings) || screenshotFieldEffectsActive(previous) || screenshotFieldEffectsActive(globeView.settings));
  var refreshPolarAurora = hasChanged(['screenshotMode', 'polarAurora', 'polarAuroraIntensity', 'polarAuroraMotion', 'polarAuroraPalette']);
  var refreshGlobeGrid = hasChanged(['globeGrid']);
  var refreshGlobeResonance = hasChanged(['globeResonanceSweep']);
  var refreshEntryGlow = hasChanged(['atmosphericEntryGlow']);
  var refreshSelectedPortalEffects = hasChanged(['selectedPulse', 'factionResonance']);
  var rebuildLinks = hasChanged(['showLinks', 'arcHeight', 'linkWidth', 'linkOpacity', 'linkStyle', 'linkFlow', 'linkFlowEnlColor', 'linkFlowResColor', 'linkFlowMachinaColor', 'linkFlowOpacity', 'linkFlowPulse', 'screenshotMode']) || mapCompositionChanged;
  var rebuildFields = hasChanged(['showFields', 'fieldOpacity', 'fieldStyle', 'fieldMotion', 'fieldDepthHaze', 'fieldCaustics', 'fieldShimmerIntensity']) || fieldCompositionChanged || screenshotFieldStateChanged;
  var rebuildPortals = hasChanged(['portals', 'portalSize', 'maxPortals', 'portalLod', 'showPortalOutline', 'portalOutline', 'portalOutlineWidth', 'portalBeacons', 'portalBeaconIntensity', 'portalBeaconMode']) || mapCompositionChanged;
  var refreshEndpoints = rebuildLinks || hasChanged(['linkEndpoints', 'linkEndpointColor', 'linkOpacity', 'portalSize']);
  var refreshDebug = hasChanged(['debugPanel', 'debugFocus', 'debugView', 'debugCoverage', 'debugTiles']);
  if (globeView.container) {
    globeView.container.querySelector('#iitc-globe-debug').style.display = globeView.settings.debugPanel ? '' : 'none';
    globeView.container.classList.toggle('globe-space-off', !globeView.settings.spaceBackdrop);
    globeView.container.classList.toggle('globe-space-still', !globeView.settings.spaceMotion);
    globeView.container.classList.toggle('globe-screenshot-mode', globeView.settings.screenshotMode);
    globeView.container.classList.toggle('globe-ui-hidden', !globeView.settings.globeUi);
  }
  if (!globeView.viewer) return;

  globeView.imageryLayer.brightness = Math.min(
    globeView.MAX_TILE_BRIGHTNESS,
    Math.max(globeView.MIN_TILE_BRIGHTNESS, globeView.settings.tileBrightness)
  );
  globeView.imageryLayer.contrast = globeView.settings.tileContrast;
  globeView.imageryLayer.saturation = globeView.settings.tileSaturation;
  globeView.imageryLayer.show = true;
  // Keep normal and screenshot rendering on the display's native density,
  // capped at 2× for sensible high-DPI GPU cost.
  globeView.viewer.resolutionScale = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
  globeView.viewer.scene.fog.enabled = globeView.settings.fog;
  globeView.viewer.scene.globe.enableLighting = globeView.settings.nightShading;
  globeView.viewer.scene.globe.showGroundAtmosphere = globeView.settings.atmosphere;
  if (globeView.viewer.scene.msaaSupported) {
    globeView.activeMsaaSamples = globeView.settings.screenshotMode
      ? globeView.getScreenshotMsaaSamples()
      : (globeView.normalMsaaSamples || 1);
    globeView.viewer.scene.msaaSamples = globeView.activeMsaaSamples;
  } else {
    globeView.activeMsaaSamples = 1;
  }
  if (globeView.nebulaStage) {
    var palette = globeView.getNebulaPalette();
    globeView.nebulaStage.uniforms.nebulaColorA = palette.a;
    globeView.nebulaStage.uniforms.nebulaColorB = palette.b;
    globeView.nebulaStage.uniforms.nebulaDensity = globeView.settings.nebulaDensity;
    globeView.nebulaStage.uniforms.advancedNebula = globeView.settings.advancedNebula ? 1 : 0;
    globeView.nebulaStage.uniforms.nebulaDust = globeView.settings.nebulaDust;
    globeView.nebulaStage.uniforms.nebulaMotion = globeView.settings.nebulaMotion ? 1 : 0;
    globeView.nebulaStage.uniforms.starDensity = globeView.settings.starDensity;
    globeView.nebulaStage.uniforms.starFlickerSpeed = globeView.settings.starFlickerSpeed;
    globeView.nebulaStage.uniforms.starFlickerEnabled = globeView.settings.starFlicker ? 1 : 0;
    globeView.nebulaStage.uniforms.starSize = globeView.settings.starSize;
    globeView.nebulaStage.uniforms.sunEnabled = globeView.settings.sun ? 1 : 0;
    globeView.nebulaStage.uniforms.sunGlow = globeView.settings.sunGlow;
    globeView.nebulaStage.uniforms.solarRimFlare = globeView.settings.solarRimFlare ? 1 : 0;
    globeView.nebulaStage.uniforms.shootingStars = globeView.settings.screenshotMode && globeView.settings.shootingStars ? 1 : 0;
    globeView.nebulaStage.uniforms.shootingStarDensity = globeView.settings.shootingStarDensity;
    globeView.nebulaStage.uniforms.nebulaEnabled = globeView.settings.nebula ? 1 : 0;
    globeView.updateNebulaStage();
    globeView.updateSun();
  }
  globeView.applyTimeSettings();
  if (refreshGlobeGrid) globeView.updateGlobeGrid();
  if (refreshGlobeResonance) globeView.updateGlobeResonance();
  if (refreshEntryGlow) globeView.updateAtmosphericEntryGlow();
  if (!changed || hasChanged(['screenshotMode', 'screenshotPresentation'])) globeView.startCinematicFlyIn();
  var bloom = globeView.viewer.scene.postProcessStages.bloom;
  bloom.enabled = globeView.settings.bloom || (globeView.settings.screenshotMode && globeView.settings.screenshotGlow);
  // Cesium's default bloom brightness is -0.3. Keep intensity 1 neutral and
  // expose a restrained range so stronger bloom does not blow out map tiles.
  bloom.uniforms.brightness = -0.3 + (Math.max(0.25, Math.min(2, globeView.settings.bloomIntensity)) - 1) * 0.5;
  globeView.viewer.scene.postProcessStages.fxaa.enabled = globeView.settings.fxaa || globeView.settings.screenshotMode;
  if (refreshPolarAurora) globeView.updatePolarAurora();
  if (rebuildLinks) {
    globeView.rebuildLinks();
    globeView.lastLinkGeometryHeight = globeView.viewer.camera.positionCartographic.height;
  } else if (refreshEndpoints) {
    globeView.synchronizeLinkEndpoints();
  }
  if (rebuildFields) globeView.rebuildFields();
  if (rebuildPortals) globeView.synchronizePortals();
  else if (refreshSelectedPortalEffects) globeView.updateSelectedPortal();
  if (refreshDebug) {
    globeView.updateDebug();
    globeView.updateDebugGeometry();
  }
  globeView.updateStatus();
};

globeView.mapZoomForCameraHeight = function (height) {
  var zoomChange = Math.round(Math.log2(globeView.INITIAL_CAMERA_HEIGHT / height));
  var map = window.map;
  return Math.max(map.getMinZoom(), Math.min(map.getMaxZoom(), globeView.initialMapZoom + zoomChange));
};

globeView.synchronizeMapFromCamera = function () {
  globeView.mapSyncTimer = null;
  if (!globeView.active || !globeView.viewer) return;

  var cartographic = globeView.getGlobeFocus();
  if (!cartographic) return;

  var center = L.latLng(Cesium.Math.toDegrees(cartographic.latitude), Cesium.Math.toDegrees(cartographic.longitude));
  var zoom = globeView.mapZoomForCameraHeight(globeView.viewer.camera.positionCartographic.height);
  var map = window.map;
  var zoomChanged = map.getZoom() !== zoom;

  if (map.getCenter().distanceTo(center) >= 25 || zoomChanged) {
    map.setView(center, zoom, { animate: false });
  }
  // Leaflet's data-detail state follows its zoom. Rebuild after an actual
  // zoom change so the geometry sees the new all-links/portals mode instead
  // of retaining an arc made immediately before the map synchronizes.
  globeView.scheduleLinkGeometryRefresh(zoomChanged);
  globeView.updateDebug();
  globeView.updateDebugGeometry();
};

globeView.scheduleMapSynchronize = function () {
  globeView.updateDebug();
  globeView.updateDebugGeometry();
  globeView.schedulePortalHeightRefresh();
  clearTimeout(globeView.mapSyncTimer);
  clearTimeout(globeView.commPortalFollowTimer);
  globeView.mapSyncTimer = setTimeout(globeView.synchronizeMapFromCamera, 150);
};

globeView.overviewArcLift = function () {
  if (!globeView.viewer || globeView.settings.linkStyle !== 'arc' || globeView.isPortalDetail()) return 0;
  var height = globeView.viewer.camera.positionCartographic.height;
  return Math.max(0, height - globeView.OVERVIEW_ARC_CAMERA_HEIGHT) * globeView.OVERVIEW_ARC_LIFT_RATIO * globeView.settings.arcHeight;
};

globeView.getLinkSurfaceHeight = function () {
  if (!globeView.viewer) return globeView.LINK_SURFACE_HEIGHT;
  var cameraHeight = globeView.viewer.camera.positionCartographic.height;
  var portalHeight = globeView.getPortalHeight();
  if (cameraHeight <= globeView.PORTAL_DETAIL_CAMERA_HEIGHT) return portalHeight;
  var amount = Math.max(0, Math.min(1, (cameraHeight - globeView.PORTAL_DETAIL_CAMERA_HEIGHT) / (globeView.LINK_HEIGHT_LOD_END - globeView.PORTAL_DETAIL_CAMERA_HEIGHT)));
  // Smooth the transition so links do not visibly pop between city and
  // overview scales.
  amount = amount * amount * (3 - 2 * amount);
  return portalHeight + (globeView.LINK_SURFACE_HEIGHT - portalHeight) * amount;
};

globeView.getFieldHeight = function () {
  if (!globeView.viewer) return globeView.FIELD_HEIGHT;
  var cameraHeight = globeView.viewer.camera.positionCartographic.height;
  var portalHeight = globeView.getPortalHeight();
  if (cameraHeight <= globeView.PORTAL_DETAIL_CAMERA_HEIGHT) return portalHeight;
  var amount = Math.max(0, Math.min(1, (cameraHeight - globeView.PORTAL_DETAIL_CAMERA_HEIGHT) / (globeView.LINK_HEIGHT_LOD_END - globeView.PORTAL_DETAIL_CAMERA_HEIGHT)));
  amount = amount * amount * (3 - 2 * amount);
  return portalHeight + (globeView.FIELD_HEIGHT - portalHeight) * amount;
};

globeView.isPortalDetail = function () {
  if (!window.map || !window.getDataZoomForMapZoom || !window.getMapZoomTileParameters) return false;
  var dataZoom = window.getDataZoomForMapZoom(window.map.getZoom());
  return !!window.getMapZoomTileParameters(dataZoom).hasPortals;
};

globeView.scheduleLinkGeometryRefresh = function (force) {
  if (!globeView.active || !globeView.viewer) return;
  var height = globeView.viewer.camera.positionCartographic.height;
  var previousHeight = globeView.lastLinkGeometryHeight;
  var portalDetail = globeView.isPortalDetail();
  var detailModeChanged = globeView.lastPortalDetailMode !== null && globeView.lastPortalDetailMode !== portalDetail;
  globeView.lastPortalDetailMode = portalDetail;
  var closeScale = height <= globeView.LINK_HEIGHT_LOD_END || (previousHeight && previousHeight <= globeView.LINK_HEIGHT_LOD_END);
  var minimumChange = closeScale ? Math.max(5000, height * 0.06) : 250000;
  if (!force && !detailModeChanged && previousHeight && Math.abs(height - previousHeight) < minimumChange) return;
  clearTimeout(globeView.linkGeometryTimer);
  globeView.linkGeometryTimer = setTimeout(function () {
    if (!globeView.active || !globeView.viewer) return;
    globeView.rebuildLinks();
    if (force || detailModeChanged || closeScale) globeView.rebuildFields();
    globeView.lastLinkGeometryHeight = globeView.viewer.camera.positionCartographic.height;
  }, portalDetail ? 90 : (closeScale ? 180 : 800));
};

globeView.getDirectedLinkEndpoints = function (link) {
  var data = link && link.options && link.options.data;
  if (data && [data.oLatE6, data.oLngE6, data.dLatE6, data.dLngE6].every(function (value) { return Number.isFinite(Number(value)); })) {
    return [
      { lat: Number(data.oLatE6) / 1e6, lng: Number(data.oLngE6) / 1e6 },
      { lat: Number(data.dLatE6) / 1e6, lng: Number(data.dLngE6) / 1e6 },
    ];
  }
  var endpoints = link && link.getLatLngs && link.getLatLngs();
  return endpoints && endpoints.length >= 2 ? [endpoints[0], endpoints[endpoints.length - 1]] : null;
};

globeView.getLinkSegmentCount = function (distance, flat, flatter, surfaceHeight) {
  if (flat) {
    // A straight Cartesian segment dips inside the globe. At close detail we
    // split just enough to keep that chord below the link's surface clearance;
    // at overview height a short or medium link needs only its two endpoints.
    var clearance = Math.max(15, surfaceHeight * 0.75);
    var maxFlatSegmentLength = Math.sqrt(8 * Cesium.Ellipsoid.WGS84.maximumRadius * clearance);
    return Math.max(1, Math.min(16, Math.ceil(distance / maxFlatSegmentLength)));
  }
  if (flatter) return Math.max(3, Math.min(32, Math.ceil(distance / 350000)));
  return Math.max(4, Math.min(48, Math.ceil(distance / 250000)));
};

globeView.linkPositions = function (link) {
  var endpoints = globeView.getDirectedLinkEndpoints(link);
  if (!endpoints) return null;

  var origin = endpoints[0];
  var destination = endpoints[endpoints.length - 1];
  var start = Cesium.Cartographic.fromDegrees(origin.lng, origin.lat);
  var end = Cesium.Cartographic.fromDegrees(destination.lng, destination.lat);
  var geodesic = new Cesium.EllipsoidGeodesic(start, end);
  var distance = geodesic.surfaceDistance;
  if (!Number.isFinite(distance) || distance === 0) return null;

  // Flat hugs the geodesic surface, Flatter has a restrained rise, and Arc
  // retains the dramatic overview curve. All share portal-height endpoints.
  var flat = globeView.settings.linkStyle === 'flat' || globeView.isPortalDetail();
  var flatter = globeView.settings.linkStyle === 'flatter';
  var surfaceHeight = globeView.getLinkSurfaceHeight();
  var steps = globeView.getLinkSegmentCount(distance, flat, flatter, surfaceHeight);
  var arcStyleMultiplier = flat ? 0 : (flatter ? 0.08 : 1);
  var arcHeight = Math.min(
    globeView.MAX_ARC_HEIGHT,
    Math.max(flat ? 0 : (flatter ? 0 : globeView.MIN_ARC_HEIGHT), distance * globeView.ARC_HEIGHT_RATIO * globeView.settings.arcHeight * arcStyleMultiplier)
  );
  arcHeight = Math.min(globeView.MAX_ARC_HEIGHT, Math.max(arcHeight, globeView.overviewArcLift()));
  var positions = [];

  for (var index = 0; index <= steps; index++) {
    var fraction = index / steps;
    var point = geodesic.interpolateUsingFraction(fraction);
    point.height = surfaceHeight + arcHeight * Math.sin(Math.PI * fraction);
    positions.push(Cesium.Cartesian3.fromRadians(point.longitude, point.latitude, point.height));
  }
  return positions;
};

globeView.clearPortals = function () {
  if (globeView.portalPrimitives && globeView.viewer) {
    globeView.viewer.scene.primitives.remove(globeView.portalPrimitives);
  }
  globeView.clearSelectedPortal();
  globeView.clearPortalBeacons();
  globeView.portalPrimitives = null;
  globeView.portalRenderMode = null;
  globeView.portalPositionHeight = null;
  globeView.portalCount = 0;
};

globeView.portalColor = function (portal) {
  return Cesium.Color.fromCssColorString(window.COLORS[portal.options.team] || '#ffffff');
};

globeView.clearPortalBeacons = function () {
  if (globeView.portalBeaconCollection && globeView.viewer) {
    globeView.viewer.scene.primitives.remove(globeView.portalBeaconCollection);
  }
  globeView.portalBeaconCollection = null;
  globeView.portalBeaconMaterials = {};
};

globeView.getPortalBeaconMaterial = function (color) {
  var key = color.toCssColorString();
  if (globeView.portalBeaconMaterials[key]) return globeView.portalBeaconMaterials[key];
  globeView.portalBeaconMaterials[key] = new Cesium.Material({
    fabric: {
      uniforms: { color: color },
      source: [
        'czm_material czm_getMaterial(czm_materialInput materialInput) {',
        '  czm_material material = czm_getDefaultMaterial(materialInput);',
        '  float edge = pow(max(0.0, 1.0 - abs(materialInput.st.t * 2.0 - 1.0)), 0.8);',
        '  float pulse = 0.65 + 0.35 * sin(czm_frameNumber * 0.010 + materialInput.st.s * 7.0);',
        '  material.diffuse = color.rgb * (0.65 + pulse * 0.35);',
        '  material.alpha = color.a * edge * pulse;',
        '  return material;',
        '}',
      ].join('\n'),
    },
    translucent: function () { return true; },
  });
  return globeView.portalBeaconMaterials[key];
};

globeView.getPortalBeaconGuids = function () {
  var guids = window.selectedPortal && window.portals[window.selectedPortal] ? [window.selectedPortal] : [];
  if (globeView.settings.portalBeaconMode !== 'highLevel') return guids;
  Object.keys(window.portals)
    .filter(function (guid) { return Number(window.portals[guid].options.level) >= 7 && guids.indexOf(guid) === -1; })
    .sort(function (first, second) { return Number(window.portals[second].options.level) - Number(window.portals[first].options.level); })
    .slice(0, 60)
    .forEach(function (guid) { guids.push(guid); });
  return guids;
};

globeView.updatePortalBeacons = function () {
  globeView.clearPortalBeacons();
  if (!globeView.active || !globeView.viewer || !globeView.settings.portalBeacons || globeView.settings.portals === 'off') return;
  var guids = globeView.getPortalBeaconGuids();
  if (!guids.length) return;
  var collection = globeView.viewer.scene.primitives.add(new Cesium.PolylineCollection());
  var baseHeight = globeView.getPortalHeight();
  var beaconHeight = Math.max(2500, Math.min(140000, globeView.viewer.camera.positionCartographic.height * 0.016));
  guids.forEach(function (guid) {
    var portal = window.portals[guid];
    var point = portal.getLatLng();
    var color = globeView.portalColor(portal).withAlpha(globeView.settings.portalBeaconIntensity);
    collection.add({
      material: globeView.getPortalBeaconMaterial(color),
      positions: [
        Cesium.Cartesian3.fromDegrees(point.lng, point.lat, baseHeight),
        Cesium.Cartesian3.fromDegrees(point.lng, point.lat, baseHeight + beaconHeight),
      ],
      width: 12,
    });
  });
  globeView.portalBeaconCollection = collection;
};

globeView.portalOutlineColor = function () {
  return Cesium.Color.fromCssColorString(globeView.settings.portalOutline);
};

globeView.getPortalHeight = function () {
  var viewer = globeView.viewer;
  var frustum = viewer.camera.frustum;
  var canvasHeight = Math.max(1, viewer.canvas.clientHeight);
  var fov = frustum.fovy || Cesium.Math.toRadians(60);
  var metresPerPixel = (2 * viewer.camera.positionCartographic.height * Math.tan(fov / 2)) / canvasHeight;

  // Point primitives are centered on their world position. Lift their centre
  // by its screen-space radius so depth testing cannot slice through it, while
  // retaining the few-metre clearance needed for a tight tilted close-up.
  var clearance = metresPerPixel * (globeView.settings.portalSize / 2 + 2);
  if (globeView.isPortalDetail()) return Math.min(12, Math.max(1, clearance));
  return Math.max(25, clearance);
};

globeView.refreshPortalHeight = function () {
  globeView.portalHeightTimer = null;
  if (!globeView.active || !globeView.viewer || !globeView.portalPrimitives) return;
  var height = globeView.getPortalHeight();
  var previousHeight = globeView.portalPositionHeight;
  if (previousHeight !== null && Math.abs(height - previousHeight) < Math.max(10, previousHeight * 0.08)) return;
  for (var index = 0; index < globeView.portalPrimitives.length; index++) {
    var primitive = globeView.portalPrimitives.get(index);
    var guid = primitive && primitive.id && primitive.id.globePortalGuid;
    var portal = guid && window.portals[guid];
    if (!portal) continue;
    var latlng = portal.getLatLng();
    primitive.position = Cesium.Cartesian3.fromDegrees(latlng.lng, latlng.lat, height);
  }
  globeView.portalPositionHeight = height;
  if (window.selectedPortal) globeView.updateSelectedPortal();
  if (globeView.settings.portalBeacons) globeView.updatePortalBeacons();
};

globeView.schedulePortalHeightRefresh = function () {
  if (!globeView.active) return;
  clearTimeout(globeView.portalHeightTimer);
  globeView.portalHeightTimer = setTimeout(globeView.refreshPortalHeight, 140);
};

globeView.getPortalRenderMode = function (portalGuids) {
  var mode = globeView.settings.portals;
  if (mode !== 'auto') return mode;
  var closeEnough = globeView.viewer.camera.positionCartographic.height <= globeView.PORTAL_DETAIL_CAMERA_HEIGHT;
  return globeView.settings.portalLod && closeEnough && portalGuids.length <= globeView.PORTAL_BILLBOARD_LIMIT ? 'billboards' : 'points';
};

globeView.portalIcon = function (portal) {
  var level = portal.options.level || 0;
  var color = globeView.portalColor(portal).toCssColorString();
  var key = color + ':' + level + ':' + globeView.settings.showPortalOutline + ':' + globeView.settings.portalOutline + ':' + globeView.settings.portalOutlineWidth;
  if (globeView.portalIconCache[key]) return globeView.portalIconCache[key];

  var canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  var context = canvas.getContext('2d');
  context.beginPath();
  context.arc(32, 32, 26, 0, 2 * Math.PI);
  context.fillStyle = 'rgba(4, 10, 14, .9)';
  context.fill();
  if (globeView.settings.showPortalOutline && globeView.settings.portalOutlineWidth > 0) {
    context.lineWidth = globeView.settings.portalOutlineWidth * 4;
    context.strokeStyle = globeView.settings.portalOutline;
    context.stroke();
  }
  context.font = 'bold 25px sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = color;
  context.fillText(level, 32, 34);
  globeView.portalIconCache[key] = canvas;
  return canvas;
};

globeView.openPortal = function (guid) {
  if (!guid || !window.portals[guid]) return;
  window.selectPortal(guid, 'globe-view');
  window.renderPortalDetails(guid);
  globeView.updateSelectedPortal();
  globeView.updatePortalBeacons();
  if (globeView.settings.flyToSelected) globeView.flyToPortal(guid);
};

globeView.flyToPortal = function (guid) {
  var portal = window.portals[guid];
  if (!portal || !globeView.viewer) return;
  var latlng = portal.getLatLng();
  var height = Math.max(5000, Math.min(2000000, globeView.viewer.camera.positionCartographic.height * 0.28));
  globeView.viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(latlng.lng, latlng.lat, height),
    duration: 1.2,
    orientation: { heading: 0, pitch: -Cesium.Math.PI_OVER_TWO, roll: 0 },
  });
};

globeView.clearSelectedPortal = function () {
  if (globeView.selectedPortalEntity && globeView.viewer) globeView.viewer.entities.remove(globeView.selectedPortalEntity);
  globeView.selectedPortalEntity = null;
};

globeView.clearFactionResonance = function () {
  if (globeView.viewer) {
    globeView.resonanceEntities.forEach(function (entity) { globeView.viewer.entities.remove(entity); });
  }
  globeView.resonanceEntities = [];
};

globeView.updateFactionResonance = function () {
  globeView.clearFactionResonance();
  if (!globeView.active || !globeView.viewer || !globeView.settings.factionResonance || !window.selectedPortal || !window.portals[window.selectedPortal]) return;
  var portal = window.portals[window.selectedPortal];
  var latlng = portal.getLatLng();
  var color = globeView.portalColor(portal);
  var position = Cesium.Cartesian3.fromDegrees(latlng.lng, latlng.lat, globeView.getPortalHeight() + 20);
  [0, 0.5].forEach(function (offset) {
    var progress = function () {
      return (performance.now() * 0.00016 + offset) % 1;
    };
    var radius = new Cesium.CallbackProperty(function () {
      var maximum = Math.max(9000, Math.min(180000, globeView.viewer.camera.positionCartographic.height * 0.04));
      return 1800 + progress() * maximum;
    }, false);
    var outlineColor = new Cesium.CallbackProperty(function () {
      var p = progress();
      return color.withAlpha((1 - p) * 0.36);
    }, false);
    globeView.resonanceEntities.push(globeView.viewer.entities.add({
      position: position,
      ellipse: {
        semiMajorAxis: radius,
        semiMinorAxis: radius,
        height: globeView.getPortalHeight() + 20,
        fill: false,
        outline: true,
        outlineColor: outlineColor,
      },
    }));
  });
};

globeView.updateSelectedPortal = function () {
  globeView.clearSelectedPortal();
  if (globeView.settings.selectedPulse && window.selectedPortal && window.portals[window.selectedPortal]) {
    var guid = window.selectedPortal;
    var portal = window.portals[guid];
    var latlng = portal.getLatLng();
    var color = globeView.portalColor(portal);
    globeView.selectedPortalEntity = globeView.viewer.entities.add({
      id: { globePortalGuid: guid },
      position: Cesium.Cartesian3.fromDegrees(latlng.lng, latlng.lat, globeView.getPortalHeight()),
      point: {
        color: color.withAlpha(0.2),
        outlineColor: color.withAlpha(0.95),
        outlineWidth: 2,
        pixelSize: new Cesium.CallbackProperty(function () {
          return globeView.settings.portalSize + 9 + Math.sin(performance.now() * 0.006) * 2;
        }, false),
      },
    });
  }
  globeView.updateFactionResonance();
};

globeView.synchronizePortals = function () {
  globeView.portalSyncTimer = null;
  if (!globeView.active || !globeView.viewer) return;

  globeView.clearPortals();
  if (globeView.settings.portals === 'off') return;

  var composition = globeView.getPortalComposition();
  var portalGuids = Object.keys(window.portals)
    .filter(function (guid) {
      return globeView.portalMatchesFilter(window.portals[guid], guid, composition);
    })
    .slice(0, globeView.settings.maxPortals);
  var mode = globeView.getPortalRenderMode(portalGuids);
  globeView.portalRenderMode = mode;

  if (mode === 'billboards') {
    globeView.portalPrimitives = globeView.viewer.scene.primitives.add(new Cesium.BillboardCollection());
  } else {
    globeView.portalPrimitives = globeView.viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
  }
  var portalHeight = globeView.getPortalHeight();
  globeView.portalPositionHeight = portalHeight;
  var outlineColor = globeView.portalOutlineColor();

  portalGuids.forEach(function (guid) {
    var portal = window.portals[guid];
    var latlng = portal.getLatLng();
    var position = Cesium.Cartesian3.fromDegrees(latlng.lng, latlng.lat, portalHeight);
    var color = globeView.portalColor(portal);
    var id = { globePortalGuid: guid };

    if (mode === 'billboards') {
      globeView.portalPrimitives.add({
        height: globeView.settings.portalSize * 2,
        id: id,
        image: globeView.portalIcon(portal),
        position: position,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        width: globeView.settings.portalSize * 2,
      });
    } else {
      globeView.portalPrimitives.add({
        color: color,
        id: id,
        outlineColor: outlineColor,
        outlineWidth: globeView.settings.showPortalOutline ? globeView.settings.portalOutlineWidth : 0,
        pixelSize: globeView.settings.portalSize,
        position: position,
      });
    }
  });

  globeView.portalCount = portalGuids.length;
  globeView.updateSelectedPortal();
  globeView.updatePortalBeacons();
  globeView.updateStatus();
};

globeView.schedulePortalSynchronize = function () {
  if (!globeView.active) return;
  clearTimeout(globeView.portalSyncTimer);
  globeView.portalSyncTimer = setTimeout(globeView.synchronizePortals, 750);
};

globeView.addLink = function (guid, link) {
  var positions;
  try {
    positions = globeView.linkPositions(link);
  } catch (error) {
    console.warn('Globe view: unable to render link ' + guid, error);
    return;
  }
  if (!positions) return;

  var color = Cesium.Color.fromCssColorString(link.options.color || '#ffffff').withAlpha(globeView.settings.linkOpacity);
  var flowColor = globeView.settings.linkFlow ? globeView.getLinkFlowColor(link) : null;
  var width = Math.max(1, (link.options.weight || 2) * globeView.settings.linkWidth);
  var base = globeView.ensureLinkBaseCollection().add({
    material: globeView.getLinkBaseMaterial(color, flowColor),
    positions: positions,
    width: width,
  });
  globeView.linkEntities[guid] = {
    base: base,
    timestamp: link.options.timestamp,
  };
};

globeView.removeLinkEntityRecord = function (record) {
  if (!record || !globeView.viewer) return;
  if (record.base && globeView.linkBaseCollection) globeView.linkBaseCollection.remove(record.base);
};

globeView.clearLinks = function () {
  // The links share one PolylineCollection. removeAll is both sufficient and
  // substantially cheaper than removing every member before clearing it.
  if (globeView.linkBaseCollection) globeView.linkBaseCollection.removeAll();
  globeView.linkEntities = {};
  globeView.linkBaseMaterials = {};
  globeView.clearLinkEndpoints();
};

globeView.fieldLatLngs = function (field) {
  var latLngs = field.getLatLngs();
  while (Array.isArray(latLngs) && Array.isArray(latLngs[0])) latLngs = latLngs[0];
  if (!Array.isArray(latLngs) || latLngs.length < 3) return null;
  return latLngs.filter(function (point) {
    return point && Number.isFinite(point.lat) && Number.isFinite(point.lng);
  });
};

globeView.fieldPositions = function (field) {
  var latLngs = globeView.fieldLatLngs(field);
  if (!latLngs || latLngs.length < 3) return null;

  var positions = latLngs
    .map(function (point) {
      return Cesium.Cartesian3.fromDegrees(point.lng, point.lat);
    });
  return positions.length >= 3 ? positions : null;
};

globeView.FIELD_SHIMMER_MATERIAL_TYPE = 'GlobeViewFieldShimmer';
globeView.fieldShimmerMaterialRegistered = false;

globeView.ensureFieldShimmerMaterial = function () {
  if (globeView.fieldShimmerMaterialRegistered) return;
  Cesium.Material._materialCache.addMaterial(globeView.FIELD_SHIMMER_MATERIAL_TYPE, {
    fabric: {
      type: globeView.FIELD_SHIMMER_MATERIAL_TYPE,
      uniforms: {
        color: Cesium.Color.WHITE,
        shimmerColor: Cesium.Color.WHITE,
        opacity: 0.2,
        intensity: 0.45,
        motion: 0,
        caustics: 0,
        depthHaze: 0,
        hazeColor: Cesium.Color.WHITE,
      },
      source: [
        'float globeFieldHash(vec2 point) {',
        '  point = fract(point * vec2(123.34, 345.45));',
        '  point += dot(point, point + 34.345);',
        '  return fract(point.x * point.y);',
        '}',
        'float globeFieldNoise(vec2 point) {',
        '  vec2 cell = floor(point);',
        '  vec2 local = fract(point);',
        '  local = local * local * (3.0 - 2.0 * local);',
        '  float lower = mix(globeFieldHash(cell), globeFieldHash(cell + vec2(1.0, 0.0)), local.x);',
        '  float upper = mix(globeFieldHash(cell + vec2(0.0, 1.0)), globeFieldHash(cell + vec2(1.0, 1.0)), local.x);',
        '  return mix(lower, upper, local.y);',
        '}',
        'float globeFieldSmoke(vec2 point) {',
        '  return globeFieldNoise(point) * 0.58 +',
        '    globeFieldNoise(point * 2.03 + vec2(19.2, -7.1)) * 0.28 +',
        '    globeFieldNoise(point * 4.07 + vec2(-11.4, 13.8)) * 0.14;',
        '}',
        'czm_material czm_getMaterial(czm_materialInput materialInput) {',
        '  czm_material material = czm_getDefaultMaterial(materialInput);',
        '  vec2 st = materialInput.st;',
        '  float phase = czm_frameNumber * 0.0024 * motion;',
        '  float shimmer = 0.0;',
        '  if (intensity > 0.0) {',
        '    vec2 smokeUv = st * vec2(4.2, 3.4);',
        '    smokeUv += vec2(phase * 0.40, -phase * 0.24);',
        '    smokeUv += vec2(sin(st.y * 5.0 + phase) * 0.24, sin(st.x * 4.0 - phase) * 0.18);',
        '    shimmer = smoothstep(0.42, 0.72, globeFieldSmoke(smokeUv));',
        '  }',
        '  float causticShade = 0.0;',
        '  float causticHighlight = 0.0;',
        '  if (caustics > 0.5) {',
        '    vec2 causticUv = st * vec2(2.15, 1.75) + vec2(phase * 0.12, -phase * 0.09);',
        '    causticUv += vec2(sin(st.y * 3.0 + phase * 0.5), sin(st.x * 2.5 - phase * 0.4)) * 0.07;',
        '    float causticSmoke = globeFieldSmoke(causticUv);',
        '    causticShade = smoothstep(0.32, 0.67, causticSmoke);',
        '    causticHighlight = smoothstep(0.62, 0.80, causticSmoke);',
        '  }',
        '  float haze = 0.0;',
        '  if (depthHaze > 0.5) haze = smoothstep(650000.0, 7000000.0, length(materialInput.positionToEyeEC));',
        '  material.diffuse = mix(color.rgb, shimmerColor.rgb, shimmer * intensity * 0.82);',
        '  material.diffuse *= 1.0 - causticShade * 0.18;',
        '  material.diffuse = mix(material.diffuse, shimmerColor.rgb * 0.58, causticHighlight * 0.12);',
        '  material.diffuse = mix(material.diffuse, hazeColor.rgb, haze * 0.42);',
        '  material.alpha = opacity * (0.82 + shimmer * 0.18 - causticShade * 0.10 + causticHighlight * 0.03) * (1.0 - haze * 0.48);',
        '  return material;',
        '}',
      ].join('\n'),
    },
    translucent: function () { return true; },
  });
  globeView.fieldShimmerMaterialRegistered = true;
};

globeView.FieldShimmerMaterialProperty = function (color, shimmerColor, opacity, intensity, motion, caustics, depthHaze, hazeColor) {
  globeView.ensureFieldShimmerMaterial();
  this.color = color;
  this.shimmerColor = shimmerColor;
  this.opacity = opacity;
  this.intensity = intensity;
  this.motion = motion;
  this.caustics = caustics;
  this.depthHaze = depthHaze;
  this.hazeColor = hazeColor;
  this._definitionChanged = new Cesium.Event();
};

Object.defineProperties(globeView.FieldShimmerMaterialProperty.prototype, {
  isConstant: {
    get: function () { return true; },
  },
  definitionChanged: {
    get: function () { return this._definitionChanged; },
  },
});

globeView.FieldShimmerMaterialProperty.prototype.getType = function () {
  return globeView.FIELD_SHIMMER_MATERIAL_TYPE;
};

globeView.FieldShimmerMaterialProperty.prototype.getValue = function (time, result) {
  result = result || {};
  result.color = this.color;
  result.shimmerColor = this.shimmerColor;
  result.opacity = this.opacity;
  result.intensity = this.intensity;
  result.motion = this.motion ? 1 : 0;
  result.caustics = this.caustics ? 1 : 0;
  result.depthHaze = this.depthHaze ? 1 : 0;
  result.hazeColor = this.hazeColor;
  return result;
};

globeView.FieldShimmerMaterialProperty.prototype.equals = function (other) {
  return this === other || (other instanceof globeView.FieldShimmerMaterialProperty &&
    Cesium.Color.equals(this.color, other.color) &&
    Cesium.Color.equals(this.shimmerColor, other.shimmerColor) &&
    this.opacity === other.opacity && this.intensity === other.intensity && this.motion === other.motion && this.caustics === other.caustics &&
    this.depthHaze === other.depthHaze && Cesium.Color.equals(this.hazeColor, other.hazeColor));
};

globeView.FIELD_CANOPY_MATERIAL_TYPE = 'GlobeViewFieldCanopy';
globeView.fieldCanopyMaterialRegistered = false;

globeView.ensureFieldCanopyMaterial = function () {
  if (globeView.fieldCanopyMaterialRegistered) return;
  Cesium.Material._materialCache.addMaterial(globeView.FIELD_CANOPY_MATERIAL_TYPE, {
    fabric: {
      type: globeView.FIELD_CANOPY_MATERIAL_TYPE,
      uniforms: {
        color: Cesium.Color.WHITE,
        rimColor: Cesium.Color.WHITE,
        opacity: 0.34,
      },
      source: [
        'czm_material czm_getMaterial(czm_materialInput materialInput) {',
        '  czm_material material = czm_getDefaultMaterial(materialInput);',
        '  vec2 st = materialInput.st;',
        '  float edgeDistance = min(st.x, min(st.y, 1.0 - st.x - st.y));',
        '  float rim = 1.0 - smoothstep(0.012, 0.085, edgeDistance);',
        '  float phase = czm_frameNumber * 0.00125;',
        '  float wave = 0.5 + 0.5 * sin((st.x * 1.65 + st.y * 1.15 - phase) * 12.566);',
        '  wave = smoothstep(0.58, 0.96, wave);',
        '  float energy = min(1.0, rim * 0.44 + wave * 0.08);',
        '  material.diffuse = mix(color.rgb, rimColor.rgb, energy);',
        '  material.emission = rimColor.rgb * (rim * 0.19 + wave * 0.0275);',
        '  material.alpha = opacity * (0.62 + rim * 0.17 + wave * 0.02);',
        '  return material;',
        '}',
      ].join('\n'),
    },
    translucent: function () { return true; },
  });
  globeView.fieldCanopyMaterialRegistered = true;
};

globeView.getFieldCanopySegments = function () {
  var count = Object.keys(window.fields || {}).length;
  if (globeView.settings.screenshotMode) return 10;
  if (count > 400) return 4;
  if (count > 150) return 5;
  return 7;
};

globeView.getFieldCanopyLift = function (positions) {
  var span = Math.max(
    Cesium.Cartesian3.distance(positions[0], positions[1]),
    Cesium.Cartesian3.distance(positions[1], positions[2]),
    Cesium.Cartesian3.distance(positions[2], positions[0])
  );
  var lift = Math.max(100, Math.min(60000, span * 0.12));
  if (globeView.isPortalDetail()) {
    lift = Math.min(lift, Math.max(120, globeView.viewer.camera.positionCartographic.height * 0.08));
  }
  return lift;
};

globeView.createFieldCanopyPrimitive = function (guid, positions, fieldHeight, color, opacity) {
  globeView.ensureFieldCanopyMaterial();
  var ellipsoid = Cesium.Ellipsoid.WGS84;
  var segments = globeView.getFieldCanopySegments();
  var lift = globeView.getFieldCanopyLift(positions);
  var indicesByRow = [];
  var positionValues = [];
  var normalValues = [];
  var stValues = [];
  var indices = [];

  for (var row = 0; row <= segments; row += 1) {
    indicesByRow[row] = [];
    for (var column = 0; column <= segments - row; column += 1) {
      var b = row / segments;
      var c = column / segments;
      var a = 1 - b - c;
      var blended = new Cesium.Cartesian3(
        positions[0].x * a + positions[1].x * b + positions[2].x * c,
        positions[0].y * a + positions[1].y * b + positions[2].y * c,
        positions[0].z * a + positions[1].z * b + positions[2].z * c
      );
      var surface = ellipsoid.scaleToGeodeticSurface(blended, new Cesium.Cartesian3());
      if (!surface) continue;
      var normal = ellipsoid.geodeticSurfaceNormal(surface, new Cesium.Cartesian3());
      var edgeLift = 4 * Math.max(a * b, b * c, c * a);
      var crownLift = 27 * a * b * c;
      var height = fieldHeight + lift * (edgeLift * 0.38 + crownLift * 0.85);
      var raised = Cesium.Cartesian3.add(surface, Cesium.Cartesian3.multiplyByScalar(normal, height, new Cesium.Cartesian3()), new Cesium.Cartesian3());
      var index = positionValues.length / 3;
      indicesByRow[row][column] = index;
      positionValues.push(raised.x, raised.y, raised.z);
      normalValues.push(normal.x, normal.y, normal.z);
      stValues.push(b, c);
    }
  }

  for (var i = 0; i < segments; i += 1) {
    for (var j = 0; j < segments - i; j += 1) {
      var first = indicesByRow[i][j];
      var second = indicesByRow[i + 1][j];
      var third = indicesByRow[i][j + 1];
      indices.push(first, second, third);
      if (j < segments - i - 1) indices.push(second, indicesByRow[i + 1][j + 1], third);
    }
  }

  var geometry = new Cesium.Geometry({
    attributes: {
      position: new Cesium.GeometryAttribute({ componentDatatype: Cesium.ComponentDatatype.DOUBLE, componentsPerAttribute: 3, values: new Float64Array(positionValues) }),
      normal: new Cesium.GeometryAttribute({ componentDatatype: Cesium.ComponentDatatype.FLOAT, componentsPerAttribute: 3, values: new Float32Array(normalValues) }),
      st: new Cesium.GeometryAttribute({ componentDatatype: Cesium.ComponentDatatype.FLOAT, componentsPerAttribute: 2, values: new Float32Array(stValues) }),
    },
    indices: new Uint16Array(indices),
    primitiveType: Cesium.PrimitiveType.TRIANGLES,
    boundingSphere: Cesium.BoundingSphere.fromVertices(positionValues),
  });
  var rimColor = Cesium.Color.lerp(color, new Cesium.Color(0.72, 0.94, 1.0, 1), 0.58, new Cesium.Color());
  var material = Cesium.Material.fromType(globeView.FIELD_CANOPY_MATERIAL_TYPE, {
    color: color,
    rimColor: rimColor,
    opacity: Math.min(0.36, 0.2 + opacity * 0.16),
  });
  var primitive = new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({ geometry: geometry, id: { globeFieldGuid: guid } }),
    appearance: new Cesium.MaterialAppearance({
      material: material,
      translucent: true,
      closed: false,
      flat: true,
      faceForward: true,
      materialSupport: Cesium.MaterialAppearance.MaterialSupport.TEXTURED,
    }),
    asynchronous: false,
  });
  globeView.viewer.scene.primitives.add(primitive);
  return primitive;
};

globeView.FIELD_DEPTH_HAZE_MATERIAL_TYPE = 'GlobeViewFieldDepthHaze';
globeView.fieldDepthHazeMaterialRegistered = false;

globeView.ensureFieldDepthHazeMaterial = function () {
  if (globeView.fieldDepthHazeMaterialRegistered) return;
  Cesium.Material._materialCache.addMaterial(globeView.FIELD_DEPTH_HAZE_MATERIAL_TYPE, {
    fabric: {
      type: globeView.FIELD_DEPTH_HAZE_MATERIAL_TYPE,
      uniforms: { color: Cesium.Color.WHITE, hazeColor: Cesium.Color.WHITE, opacity: 0.2 },
      source: [
        'czm_material czm_getMaterial(czm_materialInput materialInput) {',
        '  czm_material material = czm_getDefaultMaterial(materialInput);',
        '  float haze = smoothstep(650000.0, 7000000.0, length(materialInput.positionToEyeEC));',
        '  material.diffuse = mix(color.rgb, hazeColor.rgb, haze * 0.42);',
        '  material.alpha = opacity * (1.0 - haze * 0.48);',
        '  return material;',
        '}',
      ].join('\n'),
    },
    translucent: function () { return true; },
  });
  globeView.fieldDepthHazeMaterialRegistered = true;
};

globeView.FieldDepthHazeMaterialProperty = function (color, hazeColor, opacity) {
  globeView.ensureFieldDepthHazeMaterial();
  this.color = color;
  this.hazeColor = hazeColor;
  this.opacity = opacity;
  this._definitionChanged = new Cesium.Event();
};

Object.defineProperties(globeView.FieldDepthHazeMaterialProperty.prototype, {
  isConstant: { get: function () { return true; } },
  definitionChanged: { get: function () { return this._definitionChanged; } },
});

globeView.FieldDepthHazeMaterialProperty.prototype.getType = function () {
  return globeView.FIELD_DEPTH_HAZE_MATERIAL_TYPE;
};

globeView.FieldDepthHazeMaterialProperty.prototype.getValue = function (time, result) {
  result = result || {};
  result.color = this.color;
  result.hazeColor = this.hazeColor;
  result.opacity = this.opacity;
  return result;
};

globeView.FieldDepthHazeMaterialProperty.prototype.equals = function (other) {
  return this === other || (other instanceof globeView.FieldDepthHazeMaterialProperty &&
    Cesium.Color.equals(this.color, other.color) && Cesium.Color.equals(this.hazeColor, other.hazeColor) && this.opacity === other.opacity);
};

globeView.fieldTeamFilterName = function (field) {
  var team = field.options.team;
  if ((typeof window.TEAM_ENL !== 'undefined' && team === window.TEAM_ENL) || String(team).toUpperCase().indexOf('ENL') !== -1) return 'showEnlightenedFields';
  return 'showResistanceFields';
};

globeView.unwrapLongitude = function (longitude, reference) {
  return reference + ((((longitude - reference) + 540) % 360) - 180);
};

globeView.pointInPolygon = function (point, vertices) {
  if (!vertices || vertices.length < 3) return false;
  var x = globeView.unwrapLongitude(point.lng, point.lng);
  var inside = false;
  for (var i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    var xi = globeView.unwrapLongitude(vertices[i].lng, point.lng);
    var xj = globeView.unwrapLongitude(vertices[j].lng, point.lng);
    var crosses = (vertices[i].lat > point.lat) !== (vertices[j].lat > point.lat);
    if (crosses && x < ((xj - xi) * (point.lat - vertices[i].lat)) / (vertices[j].lat - vertices[i].lat) + xi) inside = !inside;
  }
  return inside;
};

globeView.pointInField = function (point, field) {
  return globeView.pointInPolygon(point, globeView.fieldLatLngs(field));
};

globeView.fieldCentroid = function (field) {
  var vertices = globeView.fieldLatLngs(field);
  if (!vertices) return null;
  var reference = vertices[0].lng;
  var totalLat = 0;
  var totalLng = 0;
  vertices.forEach(function (point) {
    totalLat += point.lat;
    totalLng += globeView.unwrapLongitude(point.lng, reference);
  });
  return { lat: totalLat / vertices.length, lng: totalLng / vertices.length };
};

globeView.pointInArea = function (point) {
  return globeView.pointInPolygon(point, globeView.areaSelectionPoints);
};

globeView.fieldMatchesArea = function (field) {
  if (globeView.areaSelectionPoints.length < 3) return true;
  var vertices = globeView.fieldLatLngs(field);
  if (!vertices) return false;
  if (globeView.settings.fieldAreaRule === 'vertices') return vertices.every(globeView.pointInArea);
  if (globeView.settings.fieldAreaRule === 'centre') return globeView.pointInArea(globeView.fieldCentroid(field));
  if (vertices.some(globeView.pointInArea)) return true;
  if (globeView.areaSelectionPoints.some(function (corner) {
    return globeView.pointInField(corner, field);
  })) return true;
  return globeView.polygonsHaveIntersectingEdges(vertices, globeView.areaSelectionPoints);
};

globeView.segmentsIntersect = function (firstStart, firstEnd, secondStart, secondEnd, reference) {
  var point = function (value) {
    return { x: globeView.unwrapLongitude(value.lng, reference), y: value.lat };
  };
  var a = point(firstStart);
  var b = point(firstEnd);
  var c = point(secondStart);
  var d = point(secondEnd);
  var cross = function (origin, first, second) {
    return (first.x - origin.x) * (second.y - origin.y) - (first.y - origin.y) * (second.x - origin.x);
  };
  var onSegment = function (origin, end, candidate) {
    return candidate.x >= Math.min(origin.x, end.x) - 1e-10 && candidate.x <= Math.max(origin.x, end.x) + 1e-10 &&
      candidate.y >= Math.min(origin.y, end.y) - 1e-10 && candidate.y <= Math.max(origin.y, end.y) + 1e-10;
  };
  var firstCrossStart = cross(a, b, c);
  var firstCrossEnd = cross(a, b, d);
  var secondCrossStart = cross(c, d, a);
  var secondCrossEnd = cross(c, d, b);
  if (((firstCrossStart > 0 && firstCrossEnd < 0) || (firstCrossStart < 0 && firstCrossEnd > 0)) &&
      ((secondCrossStart > 0 && secondCrossEnd < 0) || (secondCrossStart < 0 && secondCrossEnd > 0))) return true;
  return (Math.abs(firstCrossStart) < 1e-10 && onSegment(a, b, c)) ||
    (Math.abs(firstCrossEnd) < 1e-10 && onSegment(a, b, d)) ||
    (Math.abs(secondCrossStart) < 1e-10 && onSegment(c, d, a)) ||
    (Math.abs(secondCrossEnd) < 1e-10 && onSegment(c, d, b));
};

globeView.polygonsHaveIntersectingEdges = function (first, second) {
  var reference = first[0].lng;
  for (var firstIndex = 0; firstIndex < first.length; firstIndex += 1) {
    var firstNext = (firstIndex + 1) % first.length;
    for (var secondIndex = 0; secondIndex < second.length; secondIndex += 1) {
      var secondNext = (secondIndex + 1) % second.length;
      if (globeView.segmentsIntersect(first[firstIndex], first[firstNext], second[secondIndex], second[secondNext], reference)) return true;
    }
  }
  return false;
};

globeView.fieldTouchesPortal = function (field, guid) {
  var portal = window.portals[guid];
  var vertices = globeView.fieldLatLngs(field);
  if (!portal || !vertices) return false;
  var portalLatLng = portal.getLatLng();
  return vertices.some(function (point) {
    return L.latLng(point.lat, point.lng).distanceTo(portalLatLng) < 20;
  });
};

globeView.portalCoordinateKey = function (point) {
  return Math.round(Number(point.lat) * 1e6) + ':' + Math.round(Number(point.lng) * 1e6);
};

globeView.getPortalComposition = function () {
  if (!globeView.settings.screenshotMode) return null;
  var mode = globeView.settings.fieldFilterMode;
  if (mode !== 'selectedPortal' && mode !== 'pinnedPortals') return null;
  var anchors = mode === 'selectedPortal'
    ? (window.selectedPortal && window.portals[window.selectedPortal] ? [window.selectedPortal] : [])
    : Object.keys(globeView.pinnedPortalGuids).filter(function (guid) { return !!window.portals[guid]; });
  var signature = mode + ':' + anchors.slice().sort().join(',') + ':' + globeView.compositionDataRevision;
  if (globeView.portalCompositionCache && globeView.portalCompositionCache.signature === signature) {
    return globeView.portalCompositionCache;
  }
  var anchorCoordinates = {};
  var portalsByCoordinate = {};
  Object.keys(window.portals).forEach(function (guid) {
    var key = globeView.portalCoordinateKey(window.portals[guid].getLatLng());
    portalsByCoordinate[key] = guid;
    if (anchors.indexOf(guid) !== -1) anchorCoordinates[key] = true;
  });
  var composition = { signature: signature, links: {}, portals: {} };
  anchors.forEach(function (guid) { composition.portals[guid] = true; });
  Object.keys(window.links).forEach(function (guid) {
    var endpoints = globeView.getDirectedLinkEndpoints(window.links[guid]);
    if (!endpoints) return;
    var firstKey = globeView.portalCoordinateKey(endpoints[0]);
    var lastKey = globeView.portalCoordinateKey(endpoints[endpoints.length - 1]);
    if (!anchorCoordinates[firstKey] && !anchorCoordinates[lastKey]) return;
    composition.links[guid] = true;
    if (portalsByCoordinate[firstKey]) composition.portals[portalsByCoordinate[firstKey]] = true;
    if (portalsByCoordinate[lastKey]) composition.portals[portalsByCoordinate[lastKey]] = true;
  });
  globeView.portalCompositionCache = composition;
  return composition;
};

globeView.fieldMatchesFilter = function (guid, field) {
  if (!globeView.settings.screenshotMode) return true;
  if (globeView.excludedFieldGuids[guid]) return false;
  if (!globeView.settings[globeView.fieldTeamFilterName(field)]) return false;
  var mode = globeView.settings.fieldFilterMode;
  if (mode === 'all') return true;
  if (mode === 'area') return globeView.fieldMatchesArea(field);
  if (mode === 'selectedPortal') return !!window.selectedPortal && globeView.fieldTouchesPortal(field, window.selectedPortal);
  if (mode === 'pinnedPortals') return Object.keys(globeView.pinnedPortalGuids).some(function (portalGuid) {
    return globeView.fieldTouchesPortal(field, portalGuid);
  });
  var selected = globeView.selectedFieldGuid && window.fields[globeView.selectedFieldGuid];
  if (!selected) return false;
  if (mode === 'selectedField') return guid === globeView.selectedFieldGuid;
  var candidateContainsSelected = globeView.fieldLatLngs(selected).every(function (point) {
    return globeView.pointInField(point, field);
  });
  var selectedContainsCandidate = globeView.fieldLatLngs(field).every(function (point) {
    return globeView.pointInField(point, selected);
  });
  if (mode === 'nested') return guid === globeView.selectedFieldGuid || selectedContainsCandidate;
  if (mode === 'parents') return guid === globeView.selectedFieldGuid || candidateContainsSelected;
  return guid === globeView.selectedFieldGuid || selectedContainsCandidate || candidateContainsSelected;
};

globeView.portalMatchesFilter = function (portal, guid, composition) {
  if (!globeView.settings.screenshotMode) return true;
  if (globeView.settings.fieldFilterMode === 'area') {
    return globeView.areaSelectionPoints.length < 3 || globeView.pointInArea(portal.getLatLng());
  }
  if (typeof composition === 'undefined') composition = globeView.getPortalComposition();
  return !composition || !!composition.portals[guid || (portal.options && portal.options.guid)];
};

globeView.linkMatchesFilter = function (link, guid, composition) {
  if (!globeView.settings.screenshotMode) return true;
  if (globeView.settings.fieldFilterMode === 'area') {
    if (globeView.areaSelectionPoints.length < 3) return true;
    var endpoints = link.getLatLngs();
    return !endpoints || endpoints.length < 2 || endpoints.every(globeView.pointInArea);
  }
  if (typeof composition === 'undefined') composition = globeView.getPortalComposition();
  return !composition || !!composition.links[guid || (link.options && link.options.guid)];
};

globeView.clearFields = function () {
  if (!globeView.viewer) return;
  Object.keys(globeView.fieldEntities).forEach(function (guid) {
    globeView.removeFieldEntityRecord(globeView.fieldEntities[guid]);
  });
  globeView.fieldEntities = {};
  globeView.fieldCount = 0;
};

globeView.rebuildFields = function () {
  if (!globeView.active || !globeView.viewer) return;
  globeView.clearFields();
  globeView.synchronizeFields();
};

globeView.addField = function (guid, field) {
  var positions;
  try {
    positions = globeView.fieldPositions(field);
  } catch (error) {
    console.warn('Globe view: unable to render field ' + guid, error);
    return;
  }
  if (!positions) return;

  var color = Cesium.Color.fromCssColorString(window.COLORS[field.options.team] || '#ffffff');
  var style = globeView.settings.fieldStyle;
  var opacity = Math.max(0, Math.min(1, globeView.settings.fieldOpacity));
  var surfaceField = globeView.viewer.camera.positionCartographic.height <= globeView.PORTAL_DETAIL_CAMERA_HEIGHT;
  var fieldHeight = globeView.getFieldHeight();
  var glassTint = Cesium.Color.lerp(color, new Cesium.Color(0.72, 0.92, 1.0, 1), 0.08, new Cesium.Color());
  var hazeColor = new Cesium.Color(0.66, 0.82, 1.0, 1);
  var depthHaze = globeView.settings.screenshotMode && globeView.settings.fieldDepthHaze;
  var caustics = globeView.settings.screenshotMode && globeView.settings.fieldCaustics;
  if (style === 'canopy') {
    var canopy = globeView.createFieldCanopyPrimitive(guid, positions, fieldHeight, color, opacity);
    globeView.fieldEntities[guid] = {
      primitives: [canopy],
      timestamp: field.options.timestamp,
    };
    return;
  }
  var material = glassTint.withAlpha(Math.min(0.18, opacity * 0.3));
  if (style === 'shimmer') {
    material = new globeView.FieldShimmerMaterialProperty(
      color,
      glassTint,
      Math.min(0.24, opacity * 0.36),
      globeView.settings.fieldShimmerIntensity,
      globeView.settings.screenshotMode && (globeView.settings.fieldMotion || caustics),
      caustics,
      depthHaze,
      hazeColor
    );
  } else if (style === 'prism' && !surfaceField) {
    fieldHeight += 55000;
    material = color.withAlpha(Math.min(0.18, opacity * 0.28));
  }
  if (caustics && style !== 'shimmer') {
    material = new globeView.FieldShimmerMaterialProperty(
      material.withAlpha(1),
      hazeColor,
      material.alpha,
      0,
      true,
      true,
      depthHaze,
      hazeColor
    );
  } else if (depthHaze && style !== 'shimmer') {
    material = new globeView.FieldDepthHazeMaterialProperty(material.withAlpha(1), hazeColor, material.alpha);
  }
  var polygon = {
    hierarchy: new Cesium.PolygonHierarchy(positions),
    arcType: Cesium.ArcType.GEODESIC,
    height: fieldHeight,
    material: material,
    outline: false,
  };
  if (style === 'prism' && !surfaceField) polygon.extrudedHeight = globeView.FIELD_HEIGHT;
  var fieldEntity = globeView.viewer.entities.add({ polygon: polygon });
  fieldEntity.globeFieldGuid = guid;
  globeView.fieldEntities[guid] = {
    entities: [fieldEntity],
    timestamp: field.options.timestamp,
  };
};

globeView.removeFieldEntityRecord = function (record) {
  if (!record || !globeView.viewer) return;
  (record.entities || []).forEach(function (entity) {
    globeView.viewer.entities.remove(entity);
  });
  (record.primitives || []).forEach(function (primitive) {
    globeView.viewer.scene.primitives.remove(primitive);
  });
};

globeView.synchronizeFields = function () {
  globeView.fieldSyncTimer = null;
  if (!globeView.active || !globeView.viewer) return;

  var fields = window.fields || {};
  if (!globeView.settings.showFields) {
    globeView.clearFields();
    return;
  }

  var visible = {};
  Object.keys(fields).forEach(function (guid) {
    var field = fields[guid];
    if (!globeView.fieldMatchesFilter(guid, field)) return;
    visible[guid] = true;
    var existing = globeView.fieldEntities[guid];
    if (existing && existing.timestamp === field.options.timestamp) return;
    if (existing) globeView.removeFieldEntityRecord(existing);
    globeView.addField(guid, field);
  });

  Object.keys(globeView.fieldEntities).forEach(function (guid) {
    if (visible[guid]) return;
    globeView.removeFieldEntityRecord(globeView.fieldEntities[guid]);
    delete globeView.fieldEntities[guid];
  });
  globeView.fieldCount = Object.keys(globeView.fieldEntities).length;
};

globeView.scheduleFieldSynchronize = function () {
  if (!globeView.active) return;
  clearTimeout(globeView.fieldSyncTimer);
  globeView.fieldSyncTimer = setTimeout(globeView.synchronizeFields, 750);
};

globeView.clearLinkEndpoints = function () {
  if (globeView.linkEndpointPrimitives && globeView.viewer) {
    globeView.viewer.scene.primitives.remove(globeView.linkEndpointPrimitives);
  }
  globeView.linkEndpointPrimitives = null;
};

globeView.synchronizeLinkEndpoints = function () {
  globeView.clearLinkEndpoints();
  if (!globeView.settings.linkEndpoints) return;
  var collection = new Cesium.PointPrimitiveCollection();
  globeView.linkEndpointPrimitives = globeView.viewer.scene.primitives.add(collection);
  var height = Math.max(globeView.getPortalHeight(), globeView.getLinkSurfaceHeight());
  var composition = globeView.getPortalComposition();
  Object.keys(window.links).forEach(function (guid) {
    var link = window.links[guid];
    if (!globeView.linkMatchesFilter(link, guid, composition)) return;
    var endpoints = globeView.getDirectedLinkEndpoints(link);
    if (!endpoints) return;
    var color = Cesium.Color.fromCssColorString(globeView.settings.linkEndpointColor || '#ffffff').withAlpha(globeView.settings.linkOpacity);
    [endpoints[0], endpoints[endpoints.length - 1]].forEach(function (point) {
      collection.add({
        color: color,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
        pixelSize: Math.max(3, globeView.settings.portalSize * 0.45),
        position: Cesium.Cartesian3.fromDegrees(point.lng, point.lat, height),
      });
    });
  });
};

globeView.rebuildLinks = function () {
  if (!globeView.active || !globeView.viewer) return;
  globeView.clearLinks();
  globeView.synchronizeLinks();
};

globeView.synchronizeLinks = function () {
  globeView.syncTimer = null;
  if (!globeView.active || !globeView.viewer) return;

  if (!globeView.settings.showLinks) {
    globeView.clearLinks();
    globeView.updateStatus();
    return;
  }

  var visible = {};
  var visibleLinks = [];
  var composition = globeView.getPortalComposition();
  Object.keys(window.links).forEach(function (guid) {
    var link = window.links[guid];
    if (!globeView.linkMatchesFilter(link, guid, composition)) return;
    visible[guid] = true;
    visibleLinks.push({ guid: guid, link: link });
  });
  visibleLinks.forEach(function (item) {
    var guid = item.guid;
    var link = item.link;
    var existing = globeView.linkEntities[guid];
    if (existing && existing.timestamp === link.options.timestamp) return;
    if (existing) globeView.removeLinkEntityRecord(existing);
    globeView.addLink(guid, link);
  });

  Object.keys(globeView.linkEntities).forEach(function (guid) {
    if (visible[guid]) return;
    globeView.removeLinkEntityRecord(globeView.linkEntities[guid]);
    delete globeView.linkEntities[guid];
  });

  globeView.updateStatus();
  globeView.synchronizeLinkEndpoints();
  globeView.updateDebug();
};

globeView.scheduleSynchronize = function () {
  if (!globeView.active) return;
  clearTimeout(globeView.syncTimer);
  globeView.syncTimer = setTimeout(globeView.synchronizeLinks, 750);
};

globeView.scheduleAutoStart = function (delay) {
  if (!globeView.settings.autoStartGlobe || globeView.active) return;
  clearTimeout(globeView.autoStartTimer);
  globeView.autoStartPending = true;
  globeView.autoStartTimer = setTimeout(function () {
    globeView.autoStartTimer = null;
    globeView.autoStartPending = false;
    if (!globeView.active && globeView.settings.autoStartGlobe) globeView.activate(true);
  }, delay);
};

globeView.activate = function (restoreSavedView) {
  if (globeView.active) return;
  var activationToken = ++globeView.activationToken;
  clearTimeout(globeView.autoStartTimer);
  globeView.autoStartTimer = null;
  globeView.autoStartPending = false;
  globeView.restoreSavedView = !!restoreSavedView;
  globeView.active = true;
  // Keep IITC's restored location and zoom. The minimum zoom remains a stable
  // conversion baseline between Leaflet and Cesium camera height.
  globeView.initialMapZoom = window.map.getMinZoom();
  globeView.setButtonLabel();
  globeView.createContainer();

  globeView.loadCesium()
    .then(function () {
      if (!globeView.active || activationToken !== globeView.activationToken) return;
      globeView.createViewer();
      globeView.synchronizeLinks();
      globeView.synchronizeFields();
    })
    .catch(function (error) {
      if (activationToken !== globeView.activationToken) return;
      console.error('Globe view:', error);
      globeView.deactivate();
      window.dialog({
        title: 'Globe view unavailable',
        html: 'The 3D renderer could not be loaded. Check your network connection or browser WebGL support and try again.',
      });
    });
};

globeView.deactivate = function () {
  globeView.activationToken += 1;
  globeView.saveCameraState();
  globeView.active = false;
  globeView.areaSelectionActive = false;
  globeView.areaSelectionPoints = [];
  globeView.excludedFieldGuids = {};
  globeView.pinnedPortalGuids = {};
  globeView.selectedFieldGuid = null;
  globeView.invalidatePortalComposition();
  if (globeView.VOLATILE_FIELD_FILTER_MODES.indexOf(globeView.settings.fieldFilterMode) !== -1) {
    globeView.settings.fieldFilterMode = 'all';
    globeView.saveSettings();
  }
  clearTimeout(globeView.autoStartTimer);
  globeView.autoStartTimer = null;
  globeView.autoStartPending = false;
  clearTimeout(globeView.syncTimer);
  clearTimeout(globeView.linkGeometryTimer);
  clearTimeout(globeView.fieldSyncTimer);
  clearTimeout(globeView.mapSyncTimer);
  clearTimeout(globeView.portalSyncTimer);
  clearTimeout(globeView.portalHeightTimer);
  clearTimeout(globeView.hoverCursorTimer);
  clearTimeout(globeView.entryGlowTimer);
  globeView.syncTimer = null;
  globeView.linkGeometryTimer = null;
  globeView.lastLinkGeometryHeight = null;
  globeView.lastPortalDetailMode = null;
  globeView.fieldSyncTimer = null;
  globeView.mapSyncTimer = null;
  globeView.commPortalFollowTimer = null;
  globeView.portalSyncTimer = null;
  globeView.portalHeightTimer = null;
  globeView.portalPositionHeight = null;
  globeView.hoverCursorTimer = null;
  globeView.hoverCursorPosition = null;
  globeView.cameraMoving = false;
  globeView.entryGlowTimer = null;
  globeView.initialMapZoom = null;
  globeView.restoreSavedView = false;
  if (globeView.viewer) {
    if (globeView.areaSelectionEntity) globeView.viewer.entities.remove(globeView.areaSelectionEntity);
    globeView.clearLinks();
    globeView.clearFields();
    globeView.clearPortals();
    globeView.clearPolarAurora();
    globeView.clearGlobeGrid();
    globeView.clearGlobeResonance();
    globeView.clearFactionResonance();
  }
  globeView.debugFocusEntity = null;
  globeView.debugViewEntity = null;
  globeView.debugCoverageEntity = null;
  globeView.debugTileEntities = [];
  globeView.areaSelectionEntity = null;

  if (globeView.viewer) {
    globeView.viewer.destroy();
    globeView.viewer = null;
  }
  globeView.linkBaseCollection = null;
  globeView.nebulaStage = null;
  globeView.imageryLayer = null;
  globeView.cloudVeilLayer = null;
  if (globeView.container) {
    globeView.container.remove();
    globeView.container = null;
  }
  globeView.setButtonLabel();
};

globeView.toggle = function () {
  if (globeView.active) globeView.deactivate();
  else globeView.activate();
};

function setup() {
  globeView.loadSettings();
  globeView.addStyles();
  IITC.toolbox.addButton({
    id: 'globeview-toggle',
    label: 'Globe',
    title: 'Show currently loaded links on a 3D globe',
    action: globeView.toggle,
  });
  IITC.toolbox.addButton({
    id: 'globeview-settings',
    label: 'Globe settings',
    title: 'Configure Globe view rendering',
    action: globeView.showSettings,
  });

  document.addEventListener('click', globeView.scheduleCommPortalFollow, false);

  window.addHook('linkAdded', function () {
    globeView.invalidatePortalComposition();
    globeView.scheduleSynchronize();
  });
  window.addHook('linkRemoved', function () {
    globeView.invalidatePortalComposition();
    globeView.scheduleSynchronize();
  });
  window.addHook('fieldAdded', globeView.scheduleFieldSynchronize);
  window.addHook('fieldRemoved', globeView.scheduleFieldSynchronize);
  window.addHook('portalAdded', function () {
    globeView.invalidatePortalComposition();
    globeView.schedulePortalSynchronize();
  });
  window.addHook('portalRemoved', function () {
    globeView.invalidatePortalComposition();
    globeView.schedulePortalSynchronize();
  });
  window.addHook('portalSelected', function () {
    globeView.invalidatePortalComposition();
    if (!globeView.active || !globeView.viewer) return;
    // Selection normally changes only the small selected-portal accents. A
    // full rebuild of every loaded link, portal and field on each click is
    // unnecessary; Screenshot mode's selected-portal composition is the one
    // case where the visible data set itself changes.
    globeView.updateSelectedPortal();
    globeView.updatePortalBeacons();
    if (globeView.settings.screenshotMode && globeView.settings.fieldFilterMode === 'selectedPortal') {
      globeView.scheduleSynchronize();
      globeView.schedulePortalSynchronize();
      globeView.scheduleFieldSynchronize();
    }
  });
  window.addHook('mapDataRefreshStart', function () {
    globeView.updateDebug();
    globeView.updateDebugGeometry();
  });
  window.addHook('mapDataRefreshEnd', function () {
    globeView.invalidatePortalComposition();
    globeView.scheduleSynchronize();
  });
  window.addHook('mapDataRefreshEnd', globeView.scheduleFieldSynchronize);
  window.addHook('mapDataRefreshEnd', globeView.schedulePortalSynchronize);
  window.addHook('mapDataRefreshEnd', function () {
    globeView.updateDebug();
    globeView.updateDebugGeometry();
    if (globeView.autoStartPending) globeView.scheduleAutoStart(350);
  });
  if (globeView.settings.autoStartGlobe) {
    // Avoid competing with Intel's first request, tiles, and plugin startup.
    // The first completed map refresh normally starts the globe sooner; this is a safe fallback.
    globeView.scheduleAutoStart(4000);
  }
}

setup.info = plugin_info; //add the script info data to the function as a property
if (typeof changelog !== 'undefined') setup.info.changelog = changelog;
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

