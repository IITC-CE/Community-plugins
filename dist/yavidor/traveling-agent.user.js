// ==UserScript==
// @author          yavidor
// @name            Traveling Agent
// @category        Misc
// @version         0.0.2
// @description     Calculates the best route between the player's location and a series of portals
// @depends         bookmarks@ZasoGD|draw-tools-plus@zaso
// @updateURL       https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/yavidor/traveling-agent.meta.js
// @downloadURL     https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/yavidor/traveling-agent.user.js
// @id              traveling-agent@yavidor
// @namespace       https://github.com/IITC-CE/ingress-intel-total-conversion
// @homepageURL     https://github.com/yavidor/traveling-agent-plugin
// @issueTracker    https://github.com/yavidor/traveling-agent-plugin/issues
// @match           https://intel.ingress.com/*
// @match           https://intel-x.ingress.com/*
// @grant           none
// ==/UserScript==


function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'traveling-agent';
plugin_info.dateTimeVersion = 'None';
plugin_info.pluginId = 'traveling-agent';
//END PLUGIN AUTHORS NOTE

/* exported setup, changelog --eslint */

/* global IITC, L -- eslint */

/**
 * @typedef {Object} Portal
 * @property {L.LatLng} coordinates
 * @property {string} name
 */

var changelog = [
  {
    version: '0.0.1',
    changes: ['Calculates route using Nearest-Neighbor algorithm', 'Gives order of portals through console (Needs changing!)'],
  },
  {
    version: '0.0.2',
    changes: ['Calculates route through google maps API', "Set player's location", 'Draw route', 'Return sorted list of portals'],
  },
];

// use own namespace for plugin
window.plugin.travelingAgent = {};
window.plugin.travelingAgent.pluginName = 'travelingAgent';
window.plugin.travelingAgent.playerLocationKey = 'traveling-agent-player-location';
window.plugin.travelingAgent.RouteStepsKey = 'traveling-agent-route-steps';

window.plugin.travelingAgent.createLayer = function () {
  window.plugin.travelingAgent.routeLayer = new L.LayerGroup();
  window.layerChooser.addOverlay(window.plugin.travelingAgent.routeLayer, 'Portal Routes');

  window.map.on('layerremove', function (obj) {
    if (obj.layer === window.plugin.travelingAgent.routeLayer) {
      window.plugin.travelingAgent.routeLayer.clearLayers();
    }
  });
};

window.plugin.travelingAgent.setLocation = function () {
  if (window.plugin.travelingAgent.locationMarker) {
    window.plugin.travelingAgent.routeLayer.removeLayer(window.plugin.travelingAgent.locationMarker);
    window.plugin.travelingAgent.locationMarker = null;
  }

  window.plugin.travelingAgent.playerLocation = window.map.getCenter();

  window.plugin.travelingAgent.locationMarker = L.marker(window.plugin.travelingAgent.playerLocation, {
    icon: L.divIcon.coloredSvg('#4FA3AB'),
    draggable: true,
    title: 'Drag to change current location',
  });
  localStorage[window.plugin.travelingAgent.playerLocationKey] = JSON.stringify({
    lat: window.plugin.travelingAgent.playerLocation.lat,
    lng: window.plugin.travelingAgent.playerLocation.lng,
  });

  window.plugin.travelingAgent.locationMarker.on('drag', function () {
    window.plugin.travelingAgent.playerLocation = L.latLng(window.plugin.travelingAgent.locationMarker.getLatLng());
    localStorage[window.plugin.travelingAgent.playerLocationKey] = JSON.stringify({
      lat: window.plugin.travelingAgent.playerLocation.lat,
      lng: window.plugin.travelingAgent.playerLocation.lng,
    });
  });
  window.plugin.travelingAgent.routeLayer.addLayer(window.plugin.travelingAgent.locationMarker);
  window.plugin.travelingAgent.draw();
};

/**
 * @param {string} id The ID of the bookmark
 */
function getBookmarkById(id) {
  return JSON.parse(localStorage[window.plugin.bookmarks.KEY_STORAGE]).portals[id];
}

function drawLayer(steps) {
  window.plugin.travelingAgent.routeLayer.clearLayers();
  window.plugin.travelingAgent.routePolyline = L.geodesicPolyline(steps, {
    name: 'routePolyline',
    ...window.plugin.drawTools.lineOptions,
    color: '#FF0000',
  });
  window.plugin.travelingAgent.routeLayer.addLayer(window.plugin.travelingAgent.routePolyline);
  window.plugin.travelingAgent.routeLayer.addLayer(window.plugin.travelingAgent.locationMarker);
}

/**
 * @param {Portal[]} nodes
 */
async function getBestRoute(nodes) {
  const service = new window.google.maps.DirectionsService();
  const origin = new window.google.maps.LatLng({
    lat: nodes[0].coordinates.lat,
    lng: nodes[0].coordinates.lng,
  });
  const request = {
    origin: origin,
    destination: origin,
    waypoints: nodes.slice(1).map((x) => {
      return {
        location: new window.google.maps.LatLng({
          lat: x.coordinates.lat,
          lng: x.coordinates.lng,
        }),
        stopover: true,
      };
    }),
    optimizeWaypoints: true,
    travelMode: window.google.maps.TravelMode.DRIVING,
    unitSystem: window.google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false,
  };
  const results = await service.route(request);
  const routeLayer = results.routes[0].overview_path.map((x) => L.latLng(x.lat(), x.lng()));
  if (window.plugin.travelingAgent.routePolyline !== undefined && window.plugin.travelingAgent.routePolyline !== null) {
    window.plugin.travelingAgent.routeLayer.removeLayer(window.plugin.travelingAgent.routePolyline);
  }
  drawLayer(routeLayer);
  localStorage[window.plugin.travelingAgent.RouteStepsKey] = JSON.stringify(routeLayer);
  /**
   * @type {Portal[]}
   */
  const path = [nodes[0]];
  results.routes[0].waypoint_order.forEach((wayPointIndex) => path.push(nodes[wayPointIndex + 1]));
  alert(path.map((step, index) => `${index + 1}: ${step.name}`).join('\n'));
}

window.plugin.travelingAgent.draw = function () {
  if (window.plugin.travelingAgent.playerLocation === null) {
    alert('Player location not set');
    window.plugin.travelingAgent.setLocation();
    return;
  }
  $('#bookmarkInDrawer a.bookmarkLabel.selected').each(async function (_, element) {
    const bookmarkContent = getBookmarkById($(element).data('id')).bkmrk;
    /**
     * @type {Portal[]}
     */
    const portals = [
      {
        name: 'Player Location',
        coordinates: window.plugin.travelingAgent.playerLocation,
      },
    ];
    for (const { label, latlng } of Object.values(bookmarkContent)) {
      const parsedLatLng = latlng.split(',');
      portals.push({ name: label, coordinates: L.latLng(parsedLatLng) });
    }
    await getBestRoute(portals);
  });
};

window.plugin.travelingAgent.dialogLoadList = function () {
  var portalsList = JSON.parse(localStorage[window.plugin.bookmarks.KEY_STORAGE]);
  var element = '';
  var elementTemp = '';
  var elemGenericFolder = '';

  // For each folder
  var list = portalsList.portals;
  for (var idFolders in list) {
    var folders = list[idFolders];

    var folderLabel = `<a class="bookmarkLabel" data-id="${idFolders}" onclick="$(this).toggleClass('selected');$('.bookmarkLabel').not(this).removeClass('selected')">${folders['label']}</a>`;

    elementTemp = `<div class="bookmarkFolder" id="${idFolders}">${folderLabel}</div>`;

    if (idFolders !== window.plugin.bookmarks.KEY_OTHER_BKMRK) {
      element += elementTemp;
    } else {
      elemGenericFolder += elementTemp;
    }
  }
  element += elemGenericFolder;
  return `<div id="bookmarkInDrawer">${element}</div>`;
};

window.plugin.travelingAgent.openDialog = function () {
  window.dialog({
    html: window.plugin.travelingAgent.dialogLoadList,
    dialogClass: 'ui-dialog-autodrawer',
    id: 'TSP_dialog',
    title: 'There and Back Again',
    buttons: {
      DRAW: function () {
        window.plugin.travelingAgent.draw();
      },
      'SET LOCATION & DRAW': function () {
        window.plugin.travelingAgent.setLocation();
      },
    },
  });
};

window.plugin.travelingAgent.setupCSS = function () {
  $('<style>').prop('type', 'text/css').html('\
#bookmarkInDrawer,\
#bookmarkInDrawer p,\
#bookmarkInDrawer a\
{\
	display:block;\
	padding: 2px;\
	margin:0;\
}\
\
#bookmarkInDrawer .bookmarkFolder{\
	margin-bottom:4px;\
	border:1px solid #20a8b1;\
}\
#bookmarkInDrawer .bookmarkFolder div{\
	border-top:1px solid #20a8b1;\
	padding:2px 0;\
	background:rgba(0,0,0,0.3);\
}\
#bookmarkInDrawer .bookmarkLabel{\
	background:#069;\
	color:#fff;\
}\
\
#bookmarkInDrawer .selected {\
    background: #008AD2; /* A slightly lighter blue */\
    font-weight: bold;\
\
}\
').appendTo('head');
};

function setup() {
  if (window.plugin.bookmarks === undefined) {
    alert(`'${window.plugin.travelingAgent.pluginName}' requires 'bookmarks'`);
    return;
  }

  if (window.plugin.drawTools === undefined) {
    alert(`'${window.plugin.travelingAgent.pluginName}' requires 'drawTools'`);
    return;
  }
  window.plugin.travelingAgent.createLayer();
  try {
    window.plugin.travelingAgent.playerLocation = L.latLng(JSON.parse(localStorage[window.plugin.travelingAgent.playerLocationKey]));
    window.plugin.travelingAgent.locationMarker = L.marker(window.plugin.travelingAgent.playerLocation, {
      icon: L.divIcon.coloredSvg('#4FA3AB'),
      draggable: true,
      title: 'Drag to change current location',
    });
    window.plugin.travelingAgent.routeLayer.addLayer(window.plugin.travelingAgent.locationMarker);
    window.plugin.travelingAgent.locationMarker.on('drag', function () {
      window.plugin.travelingAgent.playerLocation = L.latLng(window.plugin.travelingAgent.locationMarker.getLatLng());
      localStorage[window.plugin.travelingAgent.playerLocationKey] = JSON.stringify({
        lat: window.plugin.travelingAgent.playerLocation.lat,
        lng: window.plugin.travelingAgent.playerLocation.lng,
      });
    });
    drawLayer(JSON.parse(localStorage[window.plugin.travelingAgent.RouteStepsKey] || '{}'));
  } catch (e) {
    console.error(e);
    window.plugin.travelingAgent.playerLocation = null;
  }
  window.plugin.travelingAgent.setupCSS();
  IITC.toolbox.addButton({
    label: 'Draw Route',
    action: window.plugin.travelingAgent.openDialog,
    title: 'Draw the (approximate) best route between every portal in a bookmark',
  });
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

