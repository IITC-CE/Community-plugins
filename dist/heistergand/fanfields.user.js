// ==UserScript==
// @author          Heistergand
// @id              fanfields@heistergand
// @name            Fan Fields 2
// @category        Layer
// @version         2.7.6.20260114
// @description     Calculate how to link the portals to create the largest tidy set of nested fields. Enable from the layer chooser.
// @downloadURL     https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/heistergand/fanfields.user.js
// @updateURL       https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/heistergand/fanfields.meta.js
// @icon            https://raw.githubusercontent.com/Heistergand/fanfields2/master/fanfields2-32.png
// @icon64          https://raw.githubusercontent.com/Heistergand/fanfields2/master/fanfields2-64.png
// @supportURL      https://github.com/Heistergand/fanfields2/issues
// @namespace       https://github.com/Heistergand/fanfields2
// @issueTracker    https://github.com/Heistergand/fanfields2/issues
// @homepageURL     https://github.com/Heistergand/fanfields2/
// @depends         draw-tools@breunigs
// @recommends      bookmarks@ZasoGD|draw-tools-plus@zaso|liveInventory@DanielOnDiordna|keys@xelio
// @preview         https://raw.githubusercontent.com/Heistergand/fanfields2/master/FanFields2.png
// @match           https://intel.ingress.com/*
// @include         https://intel.ingress.com/*
// @grant           none
// ==/UserScript==


function wrapper(plugin_info) {
  // ensure plugin framework is there, even if iitc is not yet loaded
  if (typeof window.plugin !== 'function') window.plugin = function () {};
  plugin_info.buildName = 'main';
  plugin_info.dateTimeVersion = '2026-01-14-031142';
  plugin_info.pluginId = 'fanfields';

  /* global L, $, dialog, map, portals, links, plugin, formatDistance  -- eslint*/
  /* exported setup, changelog -- eslint */

  let arcname = window.PLAYER.team === 'ENLIGHTENED' ? 'Arc' : '***';
  var changelog = [{
      version: '2.7.6',
      changes: [
        'FIX: Some minor code cleanup',
        'FIX: Minor cosmetics',
      ],
    },
    {
      version: '2.7.5',
      changes: [
        'NEW: Print your task list.',
        'NEW: Show fields in task list.',
        'FIX: Click on portal in task list now flies to the portal.',
        'FIX: Uniform dialog titles',
      ],
    },
    {
      version: '2.7.4',
      changes: [
        'FIX: Respect Intel not working anymore.',
        'FIX: Dialog width on mobile too small.',
      ],
    },
    {
      version: '2.7.3',
      changes: [
        'FIX: Tooltip must be a glyph sequence.',
        'FIX: Double-Click on leaflet buttons isn\'t zooming the map anymore.',
      ],
    },
    {
      version: '2.7.2',
      changes: [
        'FIX: Code cleanup and refactoring.',
      ],
    },
    {
      version: '2.7.1',
      changes: [
        'FIX: The linking algorithm from version 2.6.6 was not perfect.',
      ],
    },
    {
      version: '2.7.0',
      changes: [
        'NEW: Added portal sequence editor to customise the visit order.',
        'NEW: Added straight-line route preview along the portal sequence.',
      ],
    },
    {
      version: '2.6.6',
      changes: [
        'NEW: New linking algorythm.',
      ],
    },
    {
      version: '2.6.5',
      changes: [
        'FIX: Fixed last fix.',
      ],
    },
    {
      version: '2.6.4',
      changes: [
        'FIX: Fixed compatibility with Inventory Overview plugin.',
      ],
    },
    {
      version: '2.6.3',
      changes: [
        'FIX: Fixed some minor issues like spelling mistakes.',
      ],
    },
    {
      version: '2.6.2',
      changes: [
        'NEW: Task list now contains a single navigation link for each portal.',
      ],
    },
    {
      version: '2.6.1',
      changes: [
        'FIX: Counts of outgoing links and sbul are now correct when respecting intel and using outbounding mode.',
      ],
    },
    {
      version: '2.6.0',
      changes: [
        'NEW: Add control buttons for better ux on mobile.',
      ],
    },
    {
      version: '2.5.6',
      changes: [
        'NEW: Implementing link details in show-as-list dialog.',
      ],
    },
    {
      version: '2.5.5',
      changes: [
        'FIX: Plugin did not work on IITC-Mobile.',
      ],
    },
    {
      version: '2.5.4',
      changes: [
        'NEW: Option to only use bookmarked portals within the Fanfields (Toggle-Button)',
      ],
    },
    {
      version: '2.5.3',
      changes: [
        'NEW: Saving to Bookmarks now creates a folder in the Bookmarks list.',
      ],
    },
    {
      version: '2.5.2',
      changes: [
        'FIX: Prefer LiveInventory Plugin over Keys Plugin (hotfix)',
      ],
    },
    {
      version: '2.5.1',
      changes: [
        'FIX: Prefer LiveInventory Plugin over Keys Plugin',
      ],
    },
    {
      version: '2.5.0',
      changes: [
        'NEW: Integrate key counts from LiveInventory plugin.',
      ],
    },
    {
      version: '2.4.1',
      changes: [
        'FIX: "Show as List" without having the Keys Plugin did not show any Keys.',
      ],
    },
    {
      version: '2.4.0',
      changes: [
        'NEW: Integrate functionality with Key Plugin.',
        'NEW: Replace fieldset box design with a separated sidebar box.',
      ],
    },
    {
      version: '2.3.2',
      changes: [
        'NEW: Introducing code for upcoming multiple fanfields by Drawtools Colors',
        'FIX: some code refactorings',
        'FIX: SBUL defaults to 2 now, assuming most fields are done solo.',
        'FIX: If a marker is not actually snapped onto a portal it does not act as fan point anymore.',
        'FIX: When adding a marker, it\'s now selected as start portal.',
      ],
    },
    {
      version: '2.3.1',
      changes: [
        'FIX: Portals were difficult to select underneath the fanfileds plan.',
      ],
    },
    {
      version: '2.3.0',
      changes: [
        'NEW: Added ' + arcname + ' support.',
      ],
    },
    {
      version: '2.2.9',
      changes: [
        'FIX: Link direction indicator did not work anymore.',
        'NEW: Link direction indicator is now optional.',
        'NEW: New plugin icon showing a hand fan.',
      ],
    },
    {
      version: '2.2.8',
      changes: [
        'FIX: minor changes',
      ],
    },
    {
      version: '2.2.7',
      changes: [
        'FIX: Menu Buttons in Mobile version are now actually buttons.',
      ],
    },
    {
      version: '2.2.6',
      changes: [
        'NEW: Google Maps Portal Routing',
      ],
    },
    {
      version: '2.2.5',
      changes: [
        'NEW: Set how many SBUL you plan to use.',
        'FIX: Anchor shift button design changed',
      ],
    },
    {
      version: '2.2.4',
      changes: [
        'FIX: Width of dialog boxes did extend screen size',
        'FIX: Fixed what should have been fixed in 2.2.4',
      ],
    },
    {
      version: '2.2.3',
      changes: [
        'FIX: Made Bookmark Plugin optional',
        'NEW: Anchor shifting ("Cycle Start") is now bidirectional.',
        'FIX: Some minor fixes and code formatting.',
      ],
    },
    {
      version: '2.2.2',
      changes: [
        'NEW: Added favicon.ico to script header.',
      ],
    },
    {
      version: '2.2.1',
      changes: [
        'FIX: Merged from Jormund fork (2.1.7): Fixed L.LatLng extension',
      ],
    },

    {
      version: '2.2.0',
      changes: [
        'FIX: Reintroducing the marker function which was removed in 2.1.7 so that a Drawtools Marker can be used to force a portal inside (or outside) the hull to be the anchor.',
      ],
    },
    {
      version: '2.1.10',
      changes: [
        'FIX: minor fixes',
      ],
    },
    {
      version: '2.1.9',
      changes: [
        'FIX: Fixed blank in header for compatibility with IITC-CE Button.',
        'FIX: Fix for missing constants in leaflet verion 1.6.0.',
      ],
    },
    {
      version: '2.1.8',
      changes: [
        'NEW: Added starting portal advance button to select among the list of perimeter portals.',
      ],
    },
    {
      version: '2.1.7',
      changes: [
        'DEL: Removed marker and random selection of starting point portal.',
        'NEW: Replaced with use of first outer hull portal. This ensures maximum fields will be generated.',
      ],
    },
    {
      version: '2.1.5',
      changes: [
        'FIX: Minor syntax issue affecting potentially more strict runtimes',
      ],
    },
    {
      version: '2.1.4',
      changes: [
        'FIX: Make the clockwise button change its label to "Counterclockwise" when toggled',
      ],
    },
    {
      version: '2.1.3',
      changes: [
        'FIX: added id tags to menu button elements, ...just because.',
      ],
    },
    {
      version: '2.1.2',
      changes: [
        'FIX: Minor issues',
      ],
    },
    {
      version: '2.1.1',
      changes: [
        'FIX: changed List export format to display as a table',
      ],
    },
    {
      version: '2.1.0',
      changes: [
        'NEW: Added save to DrawTools functionality',
        'NEW: Added fanfield statistics',
        'FIX: Changed some menu texts',
        'VER: Increased Minor Version due to DrawTools Milestone',
      ],
    },
    {
      version: '2.0.9',
      changes: [
        'NEW: Added the number of outgoing links to the simple list export',
      ],
    },
    {
      version: '2.0.8',
      changes: [
        'NEW: Toggle the direction of the star-links (Inbound/Outbound) and calculate number of SBUL',
        'FIX: Despite crosslinks, respecting the current intel did not handle done links',
      ],
    },
    {
      version: '2.0.7',
      changes: [
        'FIX: Sorting of the portals was not accurate for far distance anchors when the angle was too equal.',
        'NEW: Added option to respect current intel and not crossing lines.',
      ],
    },
    {
      version: '2.0.6',
      changes: [
        'FIX: Plan messed up on multiple polygons.',
      ],
    },
    {
      version: '2.0.5',
      changes: [
        'FIX: fan links abandoned when Marker was outside the polygon',
        'BUG: Issue found where plan messes up when using more than one polygon (fixed in 2.0.6)',
      ],
    },
    {
      version: '2.0.4',
      changes: [
        'NEW: Added Lock/Unlock button to freeze the plan and prevent recalculation on any events.',
        'NEW: Added a simple text export (in a dialog box)',
        'FIX: Several changes to the algorithm',
        'BUG: Issue found where links are closing fields on top of portals that are successors in the list once you got around the startportal',
      ],
    },
    {
      version: '2.0.3',
      changes: [
        'FIX: Counterclockwise did not work properly',
        'NEW: Save as Bookmarks',
      ],
    },
    {
      version: '2.0.2',
      changes: [
        'NEW: Added Menu',
        'NEW: Added counterclockwise option',
        'FIX: Minor Bugfixes',
      ],
    },
    {
      version: '2.0.1',
      changes: [
        'NEW: Count keys to farm',
        'NEW: Count total fields',
        'NEW: Added labels to portals',
        'FIX: Links were drawn in random order',
        'FIX: Only fields to the center portal were drawn',
      ],
    },
  ];
  // PLUGIN START ////////////////////////////////////////////////////////

  // use own namespace for plugin
  /* jshint shadow:true */
  window.plugin.fanfields = function () {};
  var thisplugin = window.plugin.fanfields;

  // const values
  // zoom level used for projecting points between latLng and pixel coordinates. may affect precision of triangulation
  thisplugin.PROJECT_ZOOM = 16;

  thisplugin.LABEL_WIDTH = 100;
  thisplugin.LABEL_HEIGHT = 49;

  // constants no longer present in leaflet 1.6.0
  thisplugin.DEG_TO_RAD = Math.PI / 180;
  thisplugin.RAD_TO_DEG = 180 / Math.PI;


  thisplugin.labelLayers = {};

  thisplugin.startingpoint = undefined;
  thisplugin.availableSBUL = 2;

  thisplugin.locations = [];
  thisplugin.fanpoints = [];
  thisplugin.sortedFanpoints = [];
  thisplugin.perimeterpoints = [];
  thisplugin.startingpointIndex = 0;



  thisplugin.links = [];
  thisplugin.linksLayerGroup = null;
  thisplugin.fieldsLayerGroup = null;
  thisplugin.numbersLayerGroup = null;


  // ghi#23
  thisplugin.orderPathLayerGroup = null;
  thisplugin.showOrderPath = false;
  thisplugin.manualOrderGuids = null;
  thisplugin.lastPlanSignature = null;

  thisplugin.saveBookmarks = function () {

    // loop thru portals and UN-Select them for bkmrks
    var bkmrkData, list;
    thisplugin.sortedFanpoints.forEach(function (point, index) {

      bkmrkData = window.plugin.bookmarks.findByGuid(point.guid);
      if (bkmrkData) {

        list = window.plugin.bookmarks.bkmrksObj.portals;

        delete list[bkmrkData.id_folder].bkmrk[bkmrkData.id_bookmark];

        $('.bkmrk#' + bkmrkData.id_bookmark + '')
          .remove();

        window.plugin.bookmarks.saveStorage();
        window.plugin.bookmarks.updateStarPortal();


        window.runHooks('pluginBkmrksEdit', {
          "target": "portal",
          "action": "remove",
          "folder": bkmrkData.id_folder,
          "id": bkmrkData.id_bookmark,
          "guid": point.guid
        });

        console.log('Fanfields2: removed BOOKMARKS portal (' + bkmrkData.id_bookmark + ' situated in ' + bkmrkData.id_folder + ' folder)');
      }
    });


    let type = "folder";
    let label = 'Fanfields2';
    // Add new folder in the localStorage
    let folder_ID = window.plugin.bookmarks.generateID();
    window.plugin.bookmarks.bkmrksObj.portals[folder_ID] = {
      "label": label,
      "state": 1,
      "bkmrk": {}
    };

    window.plugin.bookmarks.saveStorage();
    window.plugin.bookmarks.refreshBkmrks();
    window.runHooks('pluginBkmrksEdit', {
      "target": type,
      "action": "add",
      "id": folder_ID
    });
    console.log('Fanfields2: added BOOKMARKS ' + type + ' ' + folder_ID);

    thisplugin.addPortalBookmark = function (guid, latlng, label, folder_ID) {
      var bookmark_ID = window.plugin.bookmarks.generateID();

      // Add bookmark in the localStorage
      window.plugin.bookmarks.bkmrksObj.portals[folder_ID].bkmrk[bookmark_ID] = {
        "guid": guid,
        "latlng": latlng,
        "label": label
      };

      window.plugin.bookmarks.saveStorage();
      window.plugin.bookmarks.refreshBkmrks();
      window.runHooks('pluginBkmrksEdit', {
        "target": "portal",
        "action": "add",
        "id": bookmark_ID,
        "guid": guid
      });
      console.log('Fanfields2: added BOOKMARKS portal ' + bookmark_ID);
    }

    // loop again: ordered(!) to add them as bookmarks
    thisplugin.sortedFanpoints.forEach(function (point, index) {
      if (point.guid) {
        var p = window.portals[point.guid];
        var ll = p.getLatLng();

        //plugin.bookmarks.addPortalBookmark(point.guid, ll.lat+','+ll.lng, p.options.data.title);
        thisplugin.addPortalBookmark(point.guid, ll.lat + ',' + ll.lng, p.options.data.title, folder_ID)
      }
    });
  };

  thisplugin.updateStartingPoint = function (i) {
    thisplugin.startingpointIndex = i;
    thisplugin.startingpointGUID = thisplugin.perimeterpoints[thisplugin.startingpointIndex][0];
    thisplugin.startingpoint = this.fanpoints[thisplugin.startingpointGUID];

    // Reset manual order because the start/anchor changed (ghi#23)
    thisplugin.manualOrderGuids = null;

    thisplugin.updateLayer();
  }

  // cycle to next starting point on the convex hull list of portals
  thisplugin.nextStartingPoint = function () {
    // *** startingpoint handling is duplicated in updateLayer().

    var i = thisplugin.startingpointIndex + 1;
    if (i >= thisplugin.perimeterpoints.length) {
      i = 0;
    }
    thisplugin.updateStartingPoint(i);
  };

  thisplugin.previousStartingPoint = function () {
    var i = thisplugin.startingpointIndex - 1;
    if (i < 0) {
      i = thisplugin.perimeterpoints.length - 1;
    }
    thisplugin.updateStartingPoint(i);
  };

  thisplugin.helpDialogWidth = 650;

  thisplugin.help = function () {
    var width = thisplugin.helpDialogWidth;
    thisplugin.MaxDialogWidth = thisplugin.getMaxDialogWidth();
    if (thisplugin.MaxDialogWidth < thisplugin.helpDialogWidth) {
      width = thisplugin.MaxDialogWidth;
    }
    dialog({
      html: '<p>Using Drawtools, draw one or more polygons around the portals you want to work with. ' +
        'The Polygons can overlap each other or be completely separated. All portals within the polygons ' +
        'count to your planned fanfield.</p>' +

        '<p>From the layer selector, enable the 3 Fanfields layer for links, fields and numbers. ' +
        'The fanfield will be calculated and shown in red links on the intel. Link directions are indicated ' +
        'by dashed links at the portal to link from.</p>' +

        '<p>The script selects an anchor portal from the hull of all selected portals. Use the Cycle&nbsp;Start ' +
        'Button to select another hull portal as anchor.</p>' +

        '<p>If you want to use portal as anchor, which is inside the hull, (which is totally legitimate), ' +
        'place a marker on a portal to enforce it to be a possible anchor. Again, use the Cycle&nbsp;Start ' +
        'Button until the Start Portal is where you want it to be.</p>' +

        '<p>A Fanfield can be done <i>inbounding</i> by farming many keys at a portal and then link to it by all ' +
        'the other portals. It can also be done <i>outbounding</i> by star-linking from the start portal until the maximum ' +
        'number of outgoing links is reached. You can toggle that for planning accordingly.</p>' +

        '<p>You might need to plan your field around links you cannot or do not want to destroy. This is where the ' +
        '<i>Respect Intel</i> button comes into play. Toggle this to plan your fanfield avoiding crosslinks.</p>' +

        '<p>Use the <i>Lock</i> function to prevent the script from recalculating anything. This is useful ' +
        'if you have a large area and want to zoom into details.</p>  ' +

        '<p>Try to switch your plan to counterclockwise direction. Your route might be easier or harder ' +
        'if you change directions. Also try different anchors to get one more field out of some portal ' +
        'constellations.</p> ' +

        '<p>Copy your fanfield portals to bookmarks or drawtools to extend your possibilities to work ' +
        'with the information.</p>' +

        '<hr noshade>' +

        '<p>Found a bug? Post your issues at GitHub:<br><a href="https://github.com/Heistergand/fanfields2/issues">https://github.com/Heistergand/fanfields2/issues</a></p>' +
        '',
      id: 'plugin_fanfields2_alert_help',
      title: 'Fan Fields 2 - Help',
      width: width,
      closeOnEscape: true
    });


  };

  thisplugin.showStatistics = function () {
    var text = "";
    if (this.sortedFanpoints.length > 3) {
      text = "<table><tr><td>FanPortals:</td><td>" + (thisplugin.n - 1) + "</td><tr>" +
        "<tr><td>CenterKeys:</td><td>" + thisplugin.centerKeys + "</td><tr>" +
        "<tr><td>Total links / keys:</td><td>" + thisplugin.donelinks.length.toString() + "</td><tr>" +
        "<tr><td>Fields:</td><td>" + thisplugin.triangles.length.toString() + "</td><tr>" +
        "<tr><td>Build AP (links and fields):</td><td>" + (thisplugin.donelinks.length * 313 + thisplugin.triangles.length * 1250)
        .toString() + "</td><tr>" +
        //"<tr><td>Destroy AP (links and fields):</td><td>" + (thisplugin.sortedFanpoints.length*187 + thisplugin.triangles.length*750).toString() + "</td><tr>" +
        "</table>";

      var width = 400;
      thisplugin.MaxDialogWidth = thisplugin.getMaxDialogWidth();
      if (thisplugin.MaxDialogWidth < width) {
        width = thisplugin.MaxDialogWidth;
      }

      dialog({
        html: text,
        id: 'plugin_fanfields2_alert_statistics',
        title: 'Fan Fields 2 - Statistics',
        width: width,
        closeOnEscape: true
      });
    }


  }

  thisplugin.exportDrawtools = function () {
    var alatlng, blatlng, layer;
    $.each(thisplugin.sortedFanpoints, function (index, portal) {
      $.each(portal.outgoing, function (targetIndex, targetPortal) {

        alatlng = map.unproject(portal.point, thisplugin.PROJECT_ZOOM);
        blatlng = map.unproject(targetPortal.point, thisplugin.PROJECT_ZOOM);
        layer = L.geodesicPolyline([alatlng, blatlng], window.plugin.drawTools.lineOptions);
        window.plugin.drawTools.drawnItems.addLayer(layer);
        window.plugin.drawTools.save();
      });
    });
  }

  thisplugin.exportArcs = function () {
    if (window.PLAYER.team === 'RESISTANCE') {
      // sorry
      return;
    };
    var alatlng, blatlng, layer;
    $.each(thisplugin.sortedFanpoints, function (index, portal) {
      $.each(portal.outgoing, function (targetIndex, targetPortal) {
        window.selectedPortal = portal.guid;
        window.plugin.arcs.draw();
        window.selectedPortal = targetPortal.guid;
        window.plugin.arcs.draw();
      });
    });
    window.plugin.arcs.list();
  }

  thisplugin.exportTasks = function () {
    //todo...
  }

  thisplugin.flyToPortal = function (latlng, guid) {

    window.map.flyTo(latlng, map.getZoom());
    if (window.portals[guid]) window.renderPortalDetails(guid);
    else window.urlPortal = guid;
  }

  // Show as list
  thisplugin.exportText = function () {
    var text = "<table><thead><tr>";

    text += "<th style='text-align:right'>Pos.</th>";
    text += "<th style='text-align:right'>Action</th>";
    text += "<th style='text-align:left'>Portal Name</th>";
    text += "<th>Keys</th>";
    text += "<th>Links</th>";
    text += "<th>Fields</th>";


    text += "</tr></thead><tbody>";

    var gmnav = 'http://maps.google.com/maps/dir/';

    thisplugin.sortedFanpoints.forEach(function (portal, index) {
      var p, lat, lng;
      var latlng = map.unproject(portal.point, thisplugin.PROJECT_ZOOM);
      lat = Math.round(latlng.lat * 10000000) / 10000000
      lng = Math.round(latlng.lng * 10000000) / 10000000
      gmnav += `${lat},${lng}/`;
      p = portal.portal;
      // window.portals[portal.guid];

      let rawTitle = "unknown title";
      if (p !== undefined && p.options && p.options.data && p.options.data.title) {
        rawTitle = p.options.data.title;
      }

      let title = window.escapeHtmlSpecialChars(rawTitle);
      let uriTitle = encodeURIComponent(rawTitle);

      let availableKeysText = '';
      let availableKeys = 0;
      if (window.plugin.keys || window.plugin.LiveInventory) {

        if (window.plugin.LiveInventory) {
          if (window.plugin.LiveInventory.keyGuidCount) {
            availableKeys = window.plugin.LiveInventory.keyGuidCount[portal.guid] || 0;
          } else if (window.plugin.LiveInventory.keyCount) {
            availableKeys = window.plugin.LiveInventory.keyCount.find(obj => obj.portalCoupler.portalGuid === portal.guid)
              ?.count || 0;
          }
        } else {
          availableKeys = window.plugin.keys.keys[portal.guid] || 0;
        }
        // Beware of bugs in the above code; I have only proved it correct, not tried it! (Donald Knuth)

        let keyColorAttribute = '';
        if (availableKeys >= portal.incoming.length) {
          keyColorAttribute = 'plugin_fanfields2_enoughKeys';
        } else {
          keyColorAttribute = 'plugin_fanfields2_notEnoughKeys';
        };

        availableKeysText = keyColorAttribute + '>' + availableKeys + '/';
      } else {
        availableKeysText = '>';
      };
      // Row start
      text += '<tbody class="plugin_fanfields2_exportText_Portal"><tr>';
      // List Item Index (Pos.)
      text += '<td>' + (index) + '</td>';

      // Action

      text += '<td>';
      text += '  <label class="plugin_fanfields2_exportText_Label" for="plugin_fanfields2_exportText_' + portal.guid + '">Capture</label>';
      text += '  <input type="checkbox" id="plugin_fanfields2_exportText_' + portal.guid + '" plugin_fanfields2_exportText_toggle="toggle">';
      text += '</td>';




      // Portal Name

      text += '<td>';
      const gmapsHref = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&query_destination_id=(${uriTitle})`;

      // Two links are rendered:
      // - UI link: uses onclick to interact with IITC (flyToPortal)
      // - Print link: real href for PDF / printing
      // Visibility is controlled via CSS (@media print or print window styles)
      text += `  <a class="plugin_fanfields2_exportText_print" href="${gmapsHref}" target="_blank">${title}</a>`;
      text +=
        `  <a class="plugin_fanfields2_exportText_ui" onclick="window.plugin.fanfields.flyToPortal({lat: ${lat}, lng: ${lng}}, '${portal.guid}'); return false;">${title}</a>`;


      text += '</td>';

      // Keys
      text += '<td ' + availableKeysText + portal.incoming.length + '</td>';
      // Links
      text += '<td>' + portal.outgoing.length + '</td>';

      // Fields (here: empty cell)
      text += '<td class="plugin_fanfields2_fieldsCell"></td>';

      // other
      //text+='<td>';
      //text+='';
      //text+='</td>';

      // Row End
      text += '</tr>';
      text += '</tbody>\n';
      if (portal.outgoing.length > 0) {
        // DetailBlock Start
        text += '<tbody class="plugin_fanfields2_exportText_LinkDetails plugin_fanfields2_italic" hidden>';
        portal.outgoing.forEach(function (outPortal, outIndex) {
          let distance = thisplugin.distanceTo(portal.point, outPortal.point);

          // Row start
          let linkDetailText = '<tr>';

          // List Item Index (Pos.)
          linkDetailText += '<td>' + (index) + '.' + thisplugin.sortedFanpoints.indexOf(outPortal) + '</td>';

          // Action
          linkDetailText += '<td>';
          linkDetailText += 'Link to ' + thisplugin.sortedFanpoints.indexOf(outPortal);
          linkDetailText += '</td>';

          let outPortalTitle = 'unknown title';
          if (outPortal.portal !== undefined) {
            outPortalTitle = outPortal.portal.options.data.title;
          }
          // Portal Name (Target)
          linkDetailText += '<td>' + outPortalTitle + '</td>';

          // Keys (here: empty cell)
          linkDetailText += '<td></td>';

          // Link (Distance)
          linkDetailText += '<td>' + formatDistance(distance) + '</td>';
          // Fields
          let meta = portal.outgoingMeta?.[outPortal.guid];
          let fieldsCreated = meta?.creatingFieldsWith?.length ?? 0;
          let triangles = fieldsCreated === 2 ? '&#9650;&#9650;' : fieldsCreated === 1 ? '&#9650;' : '';

          linkDetailText += '<td class="plugin_fanfields2_fieldsCell" title="Fields created: ' + fieldsCreated + '">' + triangles + '</td>';

          // Row End
          linkDetailText += '</tr>\n';
          text += linkDetailText;
        });
        text += '</tbody>\n';
      } // end if portal.outgoing.length > 0
    });
    text += '</tbody></table>';
    if (window.plugin.keys || window.plugin.LiveInventory) {
      text += '<br><div plugin_fanfields2_enoughKeys>Adjust available keys using your keys plugin.</div>';
    };
    text += '<hr noshade>';
    gmnav += '&nav=1';

    text += '<div style="margin-top:10px; text-align:right;">' +
      '  <button id="plugin_fanfields2_export_pdf_btn">Print</button>' +
      '</div>';


    text += '<a target="_blank" href="' + gmnav + '">Navigate with Google Maps</a>';



    thisplugin.exportDialogWidth = 500;

    var width = thisplugin.exportDialogWidth;
    thisplugin.MaxDialogWidth = thisplugin.getMaxDialogWidth();
    if (thisplugin.MaxDialogWidth < thisplugin.exportDialogWidth) {
      width = thisplugin.MaxDialogWidth;
    }

    const toggleFunction = function () {
      $('[plugin_fanfields2_exportText_toggle="toggle"]')
        .each(function () {
          const $toggle = $(this);
          const $label = $toggle.prev('.plugin_fanfields2_exportText_Label');
          const $details = $toggle.parents()
            .next('.plugin_fanfields2_exportText_LinkDetails');

          if ($details.length) {
            $label.addClass('has-children');
          } else {
            $toggle.remove(); // Remove the checkbox if there are no child elements
            $label.css('cursor', 'default'); // Reset the cursor back to default
          }
        });
      $('[plugin_fanfields2_exportText_toggle="toggle"]')
        .change(function () {
          const isChecked = $(this)
            .is(':checked');
          $(this)
            .parents()
            .next('.plugin_fanfields2_exportText_LinkDetails')
            .toggle();
          $(this)
            .prev('.plugin_fanfields2_exportText_Label')
            .attr('aria-expanded', isChecked);
        });
    };

    dialog({
      html: text,
      id: 'plugin_fanfields2_alert_textExport',
      title: 'Fan Fields 2 - Task List',
      width: width,
      closeOnEscape: true
    });
    toggleFunction();

    $('#plugin_fanfields2_export_pdf_btn')
      .off('click')
      .on('click', function () {
        thisplugin.exportTaskListToPDF();
      });


  };


  thisplugin.exportTaskListToPDF = function () {
    const id = 'plugin_fanfields2_alert_textExport';

    // Resolve the actual dialog content element.
    // IITC/jQuery-UI may wrap the original element inside a dialog container.

    let $dlg = $('#dialog-' + id + ' .ui-dialog-content');
    if (!$dlg.length) $dlg = $('#dialog-' + id);
    if (!$dlg.length) $dlg = $('#' + id);
    if (!$dlg.length) return;


    // Ensure all link detail rows are expanded before exporting

    $dlg.find('[plugin_fanfields2_exportText_toggle="toggle"]')
      .each(function () {
        const $toggle = $(this);
        const $label = $toggle.prev('.plugin_fanfields2_exportText_Label');
        const $details = $toggle.parents()
          .next('.plugin_fanfields2_exportText_LinkDetails');
        if ($details.length) {
          $toggle.prop('checked', true);
          $details.show();
          $label.attr('aria-expanded', true);
        }
      });

    const htmlInner = $dlg.html();

    // open new window for printing
    const w = window.open('', '_blank');
    if (!w) return;

    const css = `
          @page { margin: 12mm; }
          body { font-family: Arial, sans-serif; font-size: 10pt; color: #000; }
          h1 { font-size: 14pt; margin: 0 0 10px 0; }

          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #666; padding: 4px 6px; vertical-align: top; }
          thead th { background: #eee; }

          .plugin_fanfields2_exportText_ui { display: none !important; }
          .plugin_fanfields2_exportText_print { display: inline !important; color: #000; text-decoration: none; }

          tbody.plugin_fanfields2_exportText_Portal td { font-weight: bold !important; }
          tbody.plugin_fanfields2_exportText_LinkDetails td { font-weight: normal !important; }

          button, input[type="checkbox"] { display: none !important; }
          .plugin_fanfields2_exportText_Label::before { display: none !important; }

          .plugin_fanfields2_exportText_LinkDetails { display: table-row-group !important; }
        `;


    w.document.open();
    w.document.write(`
            <!doctype html>
            <html>
              <head>
                <meta charset="utf-8">
                <title>Fan Fields 2 – Tasks</title>
                <style>${css}</style>
              </head>
              <body>
                <h1>Fan Fields 2 – Tasks</h1>
                ${htmlInner}
              </body>
            </html>
          `);
    w.document.close();

    w.focus();
    setTimeout(() => w.print(), 250);
  };


  // ghi#23 start (3)
  // Manage-Order-Dialog
  thisplugin.showManageOrderDialog = function () {
    var that = thisplugin;
    let manageOrderDialogTitle = 'Fan Fields 2 - Manage Portal Order';

    if (!that.sortedFanpoints || that.sortedFanpoints.length === 0) {
      var widthEmpty = 350;
      thisplugin.MaxDialogWidth = thisplugin.getMaxDialogWidth();
      if (that.MaxDialogWidth < widthEmpty) widthEmpty = that.MaxDialogWidth;
      dialog({
        html: '<p>No Fanfield plan calculated yet.<br>Draw a polygon and let Fanfields calculate first.</p>',
        id: 'plugin_fanfields2_order_dialog_empty',
        title: manageOrderDialogTitle,
        width: widthEmpty,
        closeOnEscape: true
      });
      return;
    }

    function buildTableHTML() {
      var html = '';
      html += '<table id="plugin_fanfields2_order_table" class="plugin_fanfields2_order_table">';
      html += '<thead><tr>';
      html += '<th class="plugin_fanfields2_order_gripcol" style="width:22px;"></th>';
      html += '<th style="width:30px;">#</th>';
      html += '<th>Portal</th>';
      html += '<th style="width:60px;">Keys</th>';
      html += '<th style="width:60px;">Links out</th>';
      html += '</tr></thead><tbody>';

      that.sortedFanpoints.forEach(function (fp, idx) {
        var p = fp.portal;
        var title = (p && p.options && p.options.data && p.options.data.title) ? p.options.data.title : 'unknown title';

        var keys = fp.incoming ? fp.incoming.length : 0;
        var out = fp.outgoing ? fp.outgoing.length : 0;

        var isAnchor = (fp.guid === that.startingpointGUID);
        var trClass = isAnchor ? 'plugin_fanfields2_order_anchor' : 'plugin_fanfields2_order_row';

        // Grip column: handle for normal rows, anchor icon for the pinned row.
        var gripCell = isAnchor ?
          '<td class="plugin_fanfields2_order_gripcol"><span class="plugin_fanfields2_order_anchor_icon" title="Anchor row">&#9875;</span></td>' :
          '<td class="plugin_fanfields2_order_gripcol"><span class="plugin_fanfields2_order_handle" title="Drag to reorder">&#9776;</span></td>';

        html += '<tr class="' + trClass + '" data-guid="' + fp.guid + '">';
        html += gripCell;
        html += '<td class="plugin_fanfields2_order_idx">' + idx + '</td>';
        html += '<td>' + title + (isAnchor ? ' <span class="plugin_fanfields2_italic">(anchor)</span>' : '') + '</td>';
        html += '<td style="text-align:right;">' + keys + '</td>';
        html += '<td style="text-align:right;">' + out + '</td>';
        html += '</tr>';
      });

      html += '</tbody></table>';
      html += '<div class="plugin_fanfields2_order_hint">';
      html += 'Drag &amp; drop rows to change visit order. First row (anchor) is fixed.<br>';
      html += 'Click <b>Apply</b> to use this order for the fanfield calculation.';
      html += '</div>';
      html += '<div style="margin-top:5px;text-align:right;">';
      html += '  <button id="plugin_fanfields2_order_path">Path</button> ';
      html += '  <button id="plugin_fanfields2_order_reset" >Reset</button> ';
      html += '  <button id="plugin_fanfields2_order_apply" >Apply</button>';
      html += '</div>';
      return html;
    }

    var width = 450;
    thisplugin.MaxDialogWidth = thisplugin.getMaxDialogWidth();
    if (that.MaxDialogWidth < width) width = that.MaxDialogWidth;

    dialog({
      html: '<div id="plugin_fanfields2_order_dialog_inner">' + buildTableHTML() + '</div>',
      id: 'plugin_fanfields2_order_dialog',
      title: manageOrderDialogTitle,
      width: width,
      closeOnEscape: true
    });

    function initDragAndButtons() {
      var $tbody = $('#plugin_fanfields2_order_table tbody');

      function renumberRows() {
        // Update the "#" column to match the current DOM order.
        $tbody.find('tr')
          .each(function (i) {
            $(this)
              .find('td.plugin_fanfields2_order_idx')
              .text(i);
          });
      }

      function pinAnchorRow() {
        // Keep anchor row at top (and prevent it from being displaced).
        var $anchor = $tbody.find('tr.plugin_fanfields2_order_anchor');
        if ($anchor.length && $tbody.children()
          .first()[0] !== $anchor[0]) {
          $tbody.prepend($anchor);
        }
      }

      // Destroy old sortable if the dialog is rebuilt.
      if ($tbody.data('ui-sortable')) $tbody.sortable('destroy');

      pinAnchorRow();
      renumberRows();

      $tbody.sortable({
        // Only non-anchor rows are draggable.
        items: '> tr.plugin_fanfields2_order_row',
        handle: '.plugin_fanfields2_order_handle',
        axis: 'y',
        helper: 'clone',
        forcePlaceholderSize: true,
        placeholder: 'plugin_fanfields2_order_sort_placeholder',

        start: function (e, ui) {

          if (that.showOrderPath) {
            that.setOrderPathActive(false);
            $('#plugin_fanfields2_order_path')
              .text('Path');
          }

          // Keep column widths stable while dragging.
          ui.helper.children()
            .each(function (i) {
              $(this)
                .width(ui.item.children()
                  .eq(i)
                  .width());
            });

          // Make placeholder span the full row width.
          var colCount = ui.item.children('td,th')
            .length;
          ui.placeholder
            .addClass('plugin_fanfields2_order_sort_placeholder')
            .html('<td colspan="' + colCount + '">&nbsp;</td>');

          // Prevent placeholder from going above the anchor row.
          var $anchor = $tbody.find('> tr.plugin_fanfields2_order_anchor');
          if ($anchor.length && ui.placeholder.index() === 0) {
            ui.placeholder.insertAfter($anchor);
          }
        },

        change: function (e, ui) {
          // Prevent dropping above the anchor row.
          var $anchor = $tbody.find('> tr.plugin_fanfields2_order_anchor');
          if ($anchor.length && ui.placeholder.index() === 0) {
            ui.placeholder.insertAfter($anchor);
          }
        },

        update: function () {
          pinAnchorRow();
          renumberRows();
        }
      });

      // Rebind Reset and Apply buttons
      $('#plugin_fanfields2_order_reset')
        .off('click')
        .on('click', function () {
          that.manualOrderGuids = null;
          that.updateLayer();


          $('#plugin_fanfields2_order_dialog_inner')
            .html(buildTableHTML());
          initDragAndButtons();

          if (that.showOrderPath) {
            that.updateOrderPath();
          }
        });

      $('#plugin_fanfields2_order_apply')
        .off('click')
        .on('click', function () {
          var guids = [];
          $('#plugin_fanfields2_order_table tbody tr')
            .each(function () {
              guids.push($(this)
                .data('guid'));
            });

          // The first entry must remain the anchor.
          if (guids[0] !== that.startingpointGUID) {
            that.manualOrderGuids = null;
          } else {
            that.manualOrderGuids = guids;
          }

          that.delayedUpdateLayer(0.2);
          $('#plugin_fanfields2_order_dialog')
            .dialog('close');
        });

      $('#plugin_fanfields2_order_path')
        .off('click')
        .on('click', function () {
          var newState = !that.showOrderPath;
          that.setOrderPathActive(newState);
          $(this)
            .text(newState ? 'Hide path' : 'Path');
        });

      $('#plugin_fanfields2_order_path')
        .text(that.showOrderPath ? 'Hide path' : 'Path');
    }

    initDragAndButtons();
  };


  // ghi#23 end (3)


  thisplugin.respectCurrentLinks = false;
  thisplugin.toggleRespectCurrentLinks = function () {
    thisplugin.respectCurrentLinks = !thisplugin.respectCurrentLinks;
    if (thisplugin.respectCurrentLinks) {
      $('#plugin_fanfields2_respectbtn')
        .html('Respect&nbsp;Intel:&nbsp;ON');
    } else {
      $('#plugin_fanfields2_respectbtn')
        .html('Respect&nbsp;Intel:&nbsp;OFF');
    }
    thisplugin.delayedUpdateLayer(0.2);
  };

  thisplugin.indicateLinkDirection = true;
  thisplugin.toggleLinkDirIndicator = function () {
    thisplugin.indicateLinkDirection = !thisplugin.indicateLinkDirection;
    if (thisplugin.indicateLinkDirection) {
      $('#plugin_fanfields2_direction_indicator_btn')
        .html('Show&nbsp;link&nbsp;dir:&nbsp;ON');
    } else {
      $('#plugin_fanfields2_direction_indicator_btn')
        .html('Show&nbsp;link&nbsp;dir:&nbsp;OFF');
    }
    thisplugin.delayedUpdateLayer(0.2);
  };

  thisplugin.is_locked = false;
  thisplugin.lock = function () {
    thisplugin.is_locked = !thisplugin.is_locked;
    if (thisplugin.is_locked) {
      $('#plugin_fanfields2_lockbtn')
        .html('&#128274;&nbsp;Locked'); // &#128274;
    } else {
      $('#plugin_fanfields2_lockbtn')
        .html('&#128275;&nbsp;Unlocked'); // &#128275;
    }
  };

  thisplugin.use_bookmarks_only = false;
  thisplugin.useBookmarksOnly = function () {
    thisplugin.use_bookmarks_only = !thisplugin.use_bookmarks_only;
    if (thisplugin.use_bookmarks_only) {
      $('#plugin_fanfields2_bookarks_only_btn')
        .html(
          '&#128278;&nbsp;Bookmarks only'
        );
    } else {
      $('#plugin_fanfields2_bookarks_only_btn')
        .html(
          '&#128278;&nbsp;All Portals'
        );
    }
    thisplugin.delayedUpdateLayer(0.2);
  };


  thisplugin.is_clockwise = true;
  thisplugin.toggleclockwise = function () {
    thisplugin.is_clockwise = !thisplugin.is_clockwise;
    var clockwiseSymbol = "",
      clockwiseWord = "";
    if (thisplugin.is_clockwise) {
      clockwiseSymbol = "&#8635;"
      clockwiseWord = "Clockwise";
    } else {
      clockwiseSymbol = "&#8634;"
      clockwiseWord = "Counterclockwise";
    }

    // Reset the order – new geometry, new base ordering (ghi#23)
    thisplugin.manualOrderGuids = null;

    $('#plugin_fanfields2_clckwsbtn')
      .html(clockwiseWord + '&nbsp;' + clockwiseSymbol + '');
    thisplugin.delayedUpdateLayer(0.2);
  };

  thisplugin.starDirENUM = {
    CENTRALIZING: -1,
    RADIATING: 1
  };
  thisplugin.stardirection = thisplugin.starDirENUM.CENTRALIZING;

  thisplugin.toggleStarDirection = function () {
    thisplugin.stardirection *= -1;
    var html = "Outbounding";

    if (thisplugin.stardirection === thisplugin.starDirENUM.CENTRALIZING) {
      html = "Inbounding";
      $('#plugin_fanfields2_availablesbul')
        .hide();
    } else {
      $('#plugin_fanfields2_availablesbul')
        .show();
    }


    $('#plugin_fanfields2_stardirbtn')
      .html(html);
    thisplugin.delayedUpdateLayer(0.2);
  };



  thisplugin.increaseSBUL = function () {
    if (thisplugin.availableSBUL < 4) {
      thisplugin.availableSBUL++;
      $('#plugin_fanfields2_availablesbul_count')
        .html('' + (thisplugin.availableSBUL) + '');
      thisplugin.delayedUpdateLayer(0.2);
    }
  }
  thisplugin.decreaseSBUL = function () {
    if (thisplugin.availableSBUL > 0) {
      thisplugin.availableSBUL--;
      $('#plugin_fanfields2_availablesbul_count')
        .html('' + (thisplugin.availableSBUL) + '');
      thisplugin.delayedUpdateLayer(0.2);
    }
  }


  thisplugin.setupCSS = function () {

    // Collect CSS in one place and inject/update a single <style> tag
    var cssParts = [];

    function addCSS(s) {
      cssParts.push(s);
    }


    if (L.Browser.mobile) {
      // alert('this is mobile')
      addCSS('\n' +
        '.plugin_fanfields2_btn {\n' +
        '   margin: 2px;\n' +
        '   padding: 5px;\n' +
        '   border: 2px outset #20A8B1;\n' +
        '   flex: auto;\n' +
        '   display: flex;\n' +
        '   justify-content: center;\n' +
        '   align-items: center;\n' +
        '}\n'
      );
      addCSS('\n' +
        '.plugin_fanfields2_minibtn {\n' +
        '   margin: 2px;\n' +
        '   padding: 5px 20px;\n' +
        '   border: 2px outset #20A8B1;\n' +
        '   flex: auto;\n' +
        '   display: flex;\n' +
        '   justify-content: center;\n' +
        '   align-items: center;\n' +
        '}\n'
      );

      addCSS('\n' +
        '.plugin_fanfields2_multibtn {\n' +
        '   margin-left: 5px;\n' +
        '   padding: 0px; \n' +
        '   border: none;\n' +
        '   display: flex;\n' +
        '   justify-content: center;\n' +
        '   align-items: center;\n' +
        '   flex-direction: row;\n' +
        '}\n'
      );


      addCSS('\n' +
        '.plugin_fanfields2_toolbox {\n' +
        '   margin: 7px 1px;\n' +
        '   padding: 15px 5px;\n' +
        '   border: 1px solid #ffce00;\n' +
        '   box-shadow: 3px 3px 5px black;\n' +
        '   color: #ffce00;\n' +
        '   display: flex;\n' +
        '   flex-direction: column;\n' +
        '   flex-basis: 50%;\n' +
        '}\n'
      );


      addCSS('\n' +
        '.plugin_fanfields2_sidebar {\n' +
        '  display: flex;\n' +
        '  flex-direction: row;\n' +
        '  flex-wrap: wrap;\n' +
        '  padding: 5px;' +
        '}\n'
      );

      addCSS('\n' +
        '.plugin_fanfields2_titlebar {\n' +
        '  background-color: rgba(8, 60, 78, 0.9);\n' +
        '  margin-right: 7px;\n' +
        '  text-align: center;\n' +
        '}\n'
      );

    } else {

      addCSS('\n' +
        '.plugin_fanfields2_btn {\n' +
        '   margin-left:0;\n' +
        '   margin-right:0;\n' +
        '   flex: 0 0 50%;\n' +
        '   overflow: hidden;\n' +
        '   text-overflow: ellipsis;\n' +
        '}'
      );

      addCSS('\n' +
        '.plugin_fanfields2_minibtn {\n' +
        '   margin-left:0;\n' +
        '   margin-right:0;\n' +
        '   overflow: hidden;\n' +
        '   text-overflow: ellipsis;\n' +
        '   display: flex;\n' +
        '   justify-content: center;\n' +
        '   align-items: center;\n' +
        '}\n'
      );


      addCSS('\n' +
        '.plugin_fanfields2_multibtn {\n' +
        '   margin-left:0;\n' +
        '   margin-right:0;\n' +
        '   flex: 0 0 100%;\n' +
        '   align-items: center;\n' +
        '   display: flex;\n' +
        '   flex-direction: row;\n' +
        '   justify-content: space-evenly;\n' +
        '   overflow: hidden;\n' +
        '   text-overflow: ellipsis;\n' +
        '}\n'
      );


      addCSS('\n' +
        '.plugin_fanfields2_toolbox {\n' +
        '   margin: 5px;\n' +
        '   padding: 3px;\n' +
        '   border: 1px solid #ffce00;\n' +
        '   box-shadow: 3px 3px 5px black;\n' +
        '   color: #ffce00;' +
        '}\n'
      );

      addCSS('\n' +
        '.plugin_fanfields2_sidebar {\n' +
        '  display: flex;\n' +
        '  flex-direction: row;\n' +
        '  flex-wrap: wrap;\n' +
        '  padding: 5px;' +
        '}\n'
      );
      addCSS('\n' +
        '.plugin_fanfields2_titlebar {\n' +
        '  background-color: rgba(8, 60, 78, 0.9);\n' +
        '  margin-bottom: 7px;\n' +
        '  text-align: center;\n' +
        '}\n'
      );


      addCSS('\n' +
        '.plugin_fanfields2_toolbox > span {\n' +
        '   float: left;\n' +
        '}\n'
      );


    };

    // plugin_fanfields2_availablesbul_label
    addCSS('\n' +
      '.plugin_fanfields2_availablesbul_label {\n' +
      '  flex: 0 0 50%;\n' +
      '  display: flex;\n' +
      '  justify-content: center;\n' +
      '}\n');

    addCSS('\n' +
      '.plugin_fanfields2_italic {\n' +
      '  font-style: italic;\n' +
      '}\n');

    //plugin_fanfields2_exportText_LinkDetails
    addCSS('\n' +
      '.plugin_fanfields2_exportText_LinkDetails tr td {\n' +
      '  color: #828284;\n' +
      '}\n');

    addCSS('\n' +
      '[plugin_fanfields2_exportText_toggle="toggle"] {\n' +
      '  display: none; ' +
      '}\n');

    addCSS('\n' +
      '.plugin_fanfields2_exportText_Label {\n' +
      '    cursor: pointer;\n' +
      '    display: inline-block;\n' +
      '    padding-left: 12px;\n' +
      '    padding-right: 3px;\n' +
      '    position: relative;\n' +
      '}\n' +
      '.plugin_fanfields2_exportText_Label.has-children::before {\n' +
      '    content: "\\25B9";\n /* (▹) */\n' +
      '    position: absolute;\n' +
      '    left: 0;\n' +
      '}\n' +
      '.plugin_fanfields2_exportText_Label.has-children[aria-expanded="true"]::before {\n' +
      '    content: "\\25BF";\n /* (▿) */\n' +
      '}\n'
    );


    addCSS('\n' +
      '.plugin_fanfields {\n' +
      '   color: #FFFFBB;\n' +
      '   font-size: 11px;\n' +
      '   line-height: 13px;\n' +
      '   text-align: left;\n' +
      '   vertical-align: bottom;\n' +
      '   padding: 2px;\n' +
      '   padding-top: 15px;\n' +
      '   overflow: hidden;\n' +
      '   text-shadow: 1px 1px #000, 1px -1px #000, -1px 1px #000, -1px -1px #000, 0 0 5px #000;\n' +
      '   pointer-events: none;\n' +
      '   width: ' + thisplugin.LABEL_WIDTH + 'px;\n' +
      '   height: ' + thisplugin.LABEL_HEIGHT + 'px;\n' +
      '   border-left-color:red; border-left-style: dotted; border-left-width: thin;\n' +
      '}\n'
    );


    if (window.plugin.keys || window.plugin.LiveInventory) {
      addCSS('\n' +
        'td[plugin_fanfields2_enoughKeys], div[plugin_fanfields2_enoughKeys] {\n' +
        '   color: #828284;\n' +
        '}\n' +
        'td[plugin_fanfields2_notEnoughKeys] {\n' +
        '    /* color: #FFBBBB; */ \n' +
        '}\n' +
        ''
      );
    };



    // Manage-Order-Dialog (ghi#23)
    addCSS('\n' +
      '.plugin_fanfields2_order_table {\n' +
      '  width: 100%;\n' +
      '  border-collapse: collapse;\n' +
      '  font-size: 11px;\n' +
      '}\n' +
      '.plugin_fanfields2_order_table th,\n' +
      '.plugin_fanfields2_order_table td {\n' +
      '  border: 1px solid #555;\n' +
      '  padding: 2px 4px;\n' +
      '}\n' +
      '.plugin_fanfields2_order_table tbody tr.plugin_fanfields2_order_row:hover {\n' +
      '  background-color: rgba(255, 206, 0, 0.08);\n' +
      '}\n' +
      '.plugin_fanfields2_order_anchor {\n' +
      '  font-weight: bold;\n' +
      '  background-color: rgba(8, 60, 78, 0.6);\n' +
      '}\n' +
      '.plugin_fanfields2_order_handle {\n' +
      '  font-family: monospace;\n' +
      '  padding-right: 4px;\n' +
      '}\n' +
      '.plugin_fanfields2_order_hint {\n' +
      '  margin-top: 5px;\n' +
      '  font-size: 10px;\n' +
      '  color: #ccc;\n' +
      '}\n'
    );

    addCSS('\n' +
      '#plugin_fanfields2_order_dialog button[disabled] {\n' +
      '  opacity: 0.3;\n' +
      '  cursor: default;\n' +
      '  color: #ccc;\n' +
      '}\n' +
      '#plugin_fanfields2_order_dialog button:not([disabled]) {\n' +
      '  cursor: pointer;\n' +
      '}\n'
    );


    addCSS(` /* Fanfields2 order table: sortable grip column */
            #plugin_fanfields2_order_table .plugin_fanfields2_order_gripcol {
              width: 22px;
              text-align: center;
              white-space: nowrap;
              user-select: none;
            }

            #plugin_fanfields2_order_table .plugin_fanfields2_order_handle {
              cursor: grab;
              display: inline-block;
              padding: 0 4px;
            }

            #plugin_fanfields2_order_table .plugin_fanfields2_order_anchor_icon {
              cursor: default;
              display: inline-block;
              padding: 0 4px;
            }

            #plugin_fanfields2_order_table tr.plugin_fanfields2_order_sort_placeholder td {
              height: 22px;
            }

        `);

    addCSS(`
              .plugin_fanfields2_fieldsCell {
                text-align: center;
                font-size: 12px;
                letter-spacing: 1px;
                user-select: none;
              }
            `);


    addCSS(`
          /* Standard: UI zeigt onclick-Link, Print-Link versteckt */
          .plugin_fanfields2_exportText_ui { display: inline; }
          .plugin_fanfields2_exportText_print { display: none; }

          @media print {
            /* Beim Drucken: Print-Link zeigen, UI-Link verstecken */
            .plugin_fanfields2_exportText_ui { display: none !important; }
            .plugin_fanfields2_exportText_print { display: inline !important; }

            /* Portal-Zeilen (die “zugeklappten” Hauptzeilen) fett */
            tbody.plugin_fanfields2_exportText_Portal td {
              font-weight: bold !important;
            }

            /* Detailzeilen (Links) ausdrücklich nicht fett */
            tbody.plugin_fanfields2_exportText_LinkDetails td {
              font-weight: normal !important;
            }
          }
        `);


    // Inject/update a single style tag
    var style = document.getElementById('plugin_fanfields2_css');
    if (!style) {
      style = document.createElement('style');
      style.id = 'plugin_fanfields2_css';
      style.type = 'text/css';
      (document.head || document.documentElement)
      .appendChild(style);
    }
    style.textContent = cssParts.join('\n');


  };

  // find common third points
  thisplugin.getThirds2 = function (listA, listB, a, b) {
    var neighA = {};
    var neighB = {};
    var result = [];

    function key(p) {
      return p.x + ',' + p.y;
    }

    function considerLink(l) {
      // Skip the tested link itself (undirected)
      if ((l.a.equals(a) && l.b.equals(b)) || (l.a.equals(b) && l.b.equals(a))) {
        return;
      }

      // Collect neighbors of a
      if (l.a.equals(a)) neighA[key(l.b)] = l.b;
      else if (l.b.equals(a)) neighA[key(l.a)] = l.a;

      // Collect neighbors of b
      if (l.a.equals(b)) neighB[key(l.b)] = l.b;
      else if (l.b.equals(b)) neighB[key(l.a)] = l.a;
    }

    // Scan both lists
    for (var i = 0; i < listA.length; i++) considerLink(listA[i]);
    for (var j = 0; j < listB.length; j++) considerLink(listB[j]);

    // Intersection of neighbor sets
    for (var k in neighA) {
      if (Object.prototype.hasOwnProperty.call(neighA, k) && neighB[k]) {
        result.push(neighA[k]);
      }
    }
    return result;
  };



  thisplugin.linkExists = function (list, link) {
    var i, result = false;
    for (i in list) {
      //if ((list[i].a === link.a && list[i].b === link.b) || (list[i].a === link.b && list[i].b === link.a))
      if (thisplugin.linksEqual(list[i], link)) {
        result = true;
        break;
      }
    }
    return result;
  };



  thisplugin.linksEqual = function (link1, link2) {
    var Aa, Ab, Ba, Bb;
    Aa = link1.a.equals(link2.a);
    Ab = link1.a.equals(link2.b);
    Ba = link1.b.equals(link2.a);
    Bb = link1.b.equals(link2.b);
    if ((Aa || Ab) && (Ba || Bb)) {
      return true;
    }
  };


  thisplugin.intersects = function (link1, link2) {
    /* Todo:
        Change vars to meet original links
        dGuid,dLatE6,dLngE6,oGuid,oLatE6,oLngE6
        */
    var x1, y1, x2, y2, x3, y3, x4, y4;
    x1 = link1.a.x;
    y1 = link1.a.y;
    x2 = link1.b.x;
    y2 = link1.b.y;
    x3 = link2.a.x;
    y3 = link2.a.y;
    x4 = link2.b.x;
    y4 = link2.b.y;

    var Aa, Ab, Ba, Bb;
    Aa = link1.a.equals(link2.a);
    Ab = link1.a.equals(link2.b);
    Ba = link1.b.equals(link2.a);
    Bb = link1.b.equals(link2.b);


    if (Aa || Ab || Ba || Bb) {
      // intersection is at start, that's ok.
      return false;
    }

    function sameSign(n1, n2) {
      if (n1 * n2 > 0) {
        return true;
      } else {
        return false;
      }
    }

    var a1, a2, b1, b2, c1, c2;
    var r1, r2, r3, r4;
    var denom, offset, num;

    // Compute a1, b1, c1, where link joining points 1 and 2
    // is "a1 x + b1 y + c1 = 0".
    a1 = y2 - y1;
    b1 = x1 - x2;
    c1 = (x2 * y1) - (x1 * y2);

    // Compute r3 and r4.
    r3 = ((a1 * x3) + (b1 * y3) + c1);
    r4 = ((a1 * x4) + (b1 * y4) + c1);

    // Check signs of r3 and r4. If both point 3 and point 4 lie on
    // same side of link 1, the link segments do not intersect.
    if ((r3 !== 0) && (r4 !== 0) && (sameSign(r3, r4))) {
      return 0; //return that they do not intersect
    }

    // Compute a2, b2, c2
    a2 = y4 - y3;
    b2 = x3 - x4;
    c2 = (x4 * y3) - (x3 * y4);

    // Compute r1 and r2
    r1 = (a2 * x1) + (b2 * y1) + c2;
    r2 = (a2 * x2) + (b2 * y2) + c2;

    // Check signs of r1 and r2. If both point 1 and point 2 lie
    // on same side of second link segment, the link segments do
    // not intersect.
    if ((r1 !== 0) && (r2 !== 0) && (sameSign(r1, r2))) {
      return 0; //return that they do not intersect
    }

    //link segments intersect: compute intersection point.
    denom = (a1 * b2) - (a2 * b1);

    if (denom === 0) {
      return 1; //collinear
    }
    // links_intersect
    return 1; //links intersect, return true
  };

  thisplugin.removeLabel = function (guid) {
    var previousLayer = thisplugin.labelLayers[guid];
    if (previousLayer) {
      thisplugin.numbersLayerGroup.removeLayer(previousLayer);
      delete thisplugin.labelLayers[guid];
    }
  };

  thisplugin.addLabel = function (guid, latLng, labelText) {
    if (!window.map.hasLayer(thisplugin.numbersLayerGroup)) return;
    var previousLayer = thisplugin.labelLayers[guid];

    if (previousLayer) {
      //Number of Portal may have changed, so we delete the old value.
      thisplugin.numbersLayerGroup.removeLayer(previousLayer);
      delete thisplugin.labelLayers[guid];
    }

    var label = L.marker(latLng, {
      icon: L.divIcon({
        className: 'plugin_fanfields',
        iconAnchor: [0, 0],
        iconSize: [thisplugin.LABEL_WIDTH, thisplugin.LABEL_HEIGHT],
        html: labelText
      }),
      guid: guid,
      interactive: false
    });
    thisplugin.labelLayers[guid] = label;

    label.addTo(thisplugin.numbersLayerGroup);

  };

  thisplugin.clearAllPortalLabels = function () {
    for (var guid in thisplugin.labelLayers) {
      thisplugin.removeLabel(guid);
    }
  };

  thisplugin.initLatLng = function () {
    // https://github.com/gregallensworth/Leaflet/
    /*
     * extend Leaflet's LatLng class
     * giving it the ability to calculate the bearing to another LatLng
     * Usage example:
     *     here = map.getCenter();   / some latlng
     *     there = L.latlng([37.7833,-122.4167]);
     *     var whichway = here.bearingWordTo(there);
     *     var howfar = (here.distanceTo(there) / 1609.34).toFixed(2);
     *     alert("San Francisco is " + howfar + " miles, to the " + whichway );
     *
     * Greg Allensworth   <greg.allensworth@gmail.com>
     * No license, use as you will, kudos welcome but not required, etc.
     */

    L.LatLng.prototype.bearingToE6 = function (other) {
      var d2r = thisplugin.DEG_TO_RAD;
      var r2d = thisplugin.RAD_TO_DEG;
      var lat1 = this.lat * d2r;
      var lat2 = other.lat * d2r;
      var dLon = (other.lng - this.lng) * d2r;
      var y = Math.sin(dLon) * Math.cos(lat2);
      var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
      var brng = Math.atan2(y, x);
      brng = parseInt(brng * r2d * 1E6);
      brng = ((brng + 360 * 1E6) % (360 * 1E6) / 1E6);
      return brng;
    };

    L.LatLng.prototype.bearingWord = function (bearing) {
      var bearingword = '';
      if (bearing >= 22 && bearing <= 67) bearingword = 'NE';
      else if (bearing >= 67 && bearing <= 112) bearingword = 'E';
      else if (bearing >= 112 && bearing <= 157) bearingword = 'SE';
      else if (bearing >= 157 && bearing <= 202) bearingword = 'S';
      else if (bearing >= 202 && bearing <= 247) bearingword = 'SW';
      else if (bearing >= 247 && bearing <= 292) bearingword = 'W';
      else if (bearing >= 292 && bearing <= 337) bearingword = 'NW';
      else if (bearing >= 337 || bearing <= 22) bearingword = 'N';
      return bearingword;
    };

    L.LatLng.prototype.bearingWordTo = function (other) {
      var bearing = this.bearingToE6(other);
      return this.bearingWord(bearing);
    };
  }

  thisplugin.getBearing = function (a, b) {
    var starting_ll, other_ll;
    starting_ll = map.unproject(a, thisplugin.PROJECT_ZOOM);
    other_ll = map.unproject(b, thisplugin.PROJECT_ZOOM);
    return starting_ll.bearingToE6(other_ll);
  };

  thisplugin.distanceTo = function (a, b) {
    var starting_ll, other_ll;
    starting_ll = map.unproject(a, thisplugin.PROJECT_ZOOM);
    other_ll = map.unproject(b, thisplugin.PROJECT_ZOOM);
    return starting_ll.distanceTo(other_ll);
  }




  // Compute the arrowhead in projection space (pixels)
  thisplugin.buildArrowHeadPoints = function (pointA, pointB) {
    // Simple small arrowhead in pixels
    var tip = pointB;
    var dx = pointB.x - pointA.x;
    var dy = pointB.y - pointA.y;
    var len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return [pointB];

    // Normalized direction vector
    var ux = dx / len;
    var uy = dy / len;

    // Arrow size (pixels)
    var arrowLength = 25;
    var arrowWidth = 14;

    // Base of the arrowhead slightly before the target point
    var baseX = tip.x - ux * arrowLength;
    var baseY = tip.y - uy * arrowLength;

    // Perpendicular vector
    var px = -uy;
    var py = ux;

    var leftX = baseX + px * (arrowWidth / 2);
    var leftY = baseY + py * (arrowWidth / 2);
    var rightX = baseX - px * (arrowWidth / 2);
    var rightY = baseY - py * (arrowWidth / 2);

    return [
      new L.Point(leftX, leftY),
      tip,
      new L.Point(rightX, rightY)
    ];
  };

  thisplugin.updateOrderPath = function () {
    var that = thisplugin;
    var lg = that.orderPathLayerGroup;
    if (!lg) return;

    lg.clearLayers();

    var sorted = that.sortedFanpoints || [];
    if (sorted.length < 2) return;

    // Draw the route as a polyline
    var latlngs = sorted.map(function (fp) {
      return map.unproject(fp.point, that.PROJECT_ZOOM);
    });

    L.polyline(latlngs, {
        color: '#ffff00',
        weight: 3,
        opacity: 0.9,
        dashArray: '6,8',
        interactive: false
      })
      .addTo(lg);

    // Arrowhead: compute in layer-pixel coordinates of the CURRENT zoom level
    var n = latlngs.length;
    var latA = latlngs[n - 2];
    var latB = latlngs[n - 1];

    // -> LayerPoints (screen coordinates)
    var pA = map.latLngToLayerPoint(latA);
    var pB = map.latLngToLayerPoint(latB);

    var arrowPtsLayer = that.buildArrowHeadPoints(pA, pB);

    // Convert back to LatLng
    var arrowLatLngs = arrowPtsLayer.map(function (p) {
      return map.layerPointToLatLng(p);
    });

    L.polygon(arrowLatLngs, {
        color: '#ffff00',
        weight: 1,
        fillColor: '#ffff00',
        fillOpacity: 0.9,
        interactive: false
      })
      .addTo(lg);
  };


  thisplugin.setOrderPathActive = function (active) {
    var that = thisplugin;
    that.showOrderPath = !!active;

    if (!that.orderPathLayerGroup) {
      that.orderPathLayerGroup = new L.LayerGroup();
    }

    if (that.showOrderPath) {
      if (!map.hasLayer(that.orderPathLayerGroup)) {
        that.orderPathLayerGroup.addTo(map);
      }
      that.updateOrderPath();
    } else {
      if (that.orderPathLayerGroup) {
        that.orderPathLayerGroup.clearLayers();
        if (map.hasLayer(that.orderPathLayerGroup)) {
          map.removeLayer(that.orderPathLayerGroup);
        }
      }
    }
  };


  // find points in polygon
  thisplugin.filterPolygon = function (points, polygon) {
    var result = [];
    var guid, i, j, ax, ay, bx, by, la, lb, cos, alpha, det;


    for (guid in points) {
      if (thisplugin.use_bookmarks_only && !window.plugin.bookmarks.findByGuid(guid)) {
        continue;
      }
      var asum = 0;
      for (i = 0, j = polygon.length - 1; i < polygon.length; j = i, ++i) {
        ax = polygon[i].x - points[guid].x;
        ay = polygon[i].y - points[guid].y;
        bx = polygon[j].x - points[guid].x;
        by = polygon[j].y - points[guid].y;
        la = Math.sqrt(ax * ax + ay * ay);
        lb = Math.sqrt(bx * bx + by * by);
        if (Math.abs(la) < 0.1 || Math.abs(lb) < 0.1) { // the point is a vertex of the polygon
          break;
        }
        cos = (ax * bx + ay * by) / la / lb;
        if (cos < -1) {
          cos = -1;
        } else if (cos > 1) {
          cos = 1;
        }
        alpha = Math.acos(cos);
        det = ax * by - ay * bx;
        if (Math.abs(det) < 0.1 && Math.abs(alpha - Math.PI) < 0.1) {
          // the point is on a rib of the polygon
          break;
        }
        if (det >= 0) {
          asum += alpha;
        } else {
          asum -= alpha;
        }
      }
      if (i === polygon.length && Math.round(asum / Math.PI / 2) % 2 === 0) {
        continue;
      }

      result[guid] = points[guid];
    }
    return result;
  };


  thisplugin.n = 0;
  thisplugin.triangles = [];
  thisplugin.donelinks = [];

  thisplugin.updateLayer = function () {
    var a, b, c;
    var fanlinks = [],
      donelinks = [],
      maplinks = [];
    var triangles = [];
    var n = 0;
    // var directiontest;
    var centerOutgoings = 0;
    var centerSbul = 0;
    var pa, i, pb, k, ll, p;
    var guid;
    var polygon, intersection;
    // var starting_ll , fanpoint_ll ;
    var fp_index, fp, bearing, sublinkCount;
    thisplugin.startingpoint = undefined;
    thisplugin.startingpointGUID = "";
    thisplugin.startingMarker = undefined;
    thisplugin.startingMarkerGUID = undefined;
    thisplugin.centerKeys = 0;



    thisplugin.locations = [];
    thisplugin.fanpoints = [];



    thisplugin.links = [];
    if (!window.map.hasLayer(thisplugin.linksLayerGroup) &&
      !window.map.hasLayer(thisplugin.fieldsLayerGroup) &&
      !window.map.hasLayer(thisplugin.numbersLayerGroup)) {
      return;
    }


    thisplugin.linksLayerGroup.clearLayers();
    thisplugin.fieldsLayerGroup.clearLayers();
    thisplugin.numbersLayerGroup.clearLayers();

    /*
    var ctrl = [$('.leaflet-control-layers-selector + span:contains("Fanfields links")').parent(),
                $('.leaflet-control-layers-selector + span:contains("Fanfields fields")').parent(),
                $('.leaflet-control-layers-selector + span:contains("Fanfields numbers")').parent()];
    */


    // using marker as starting point, if option enabled

    // TODO: possible loop start for layers by color?

    for (i in plugin.drawTools.drawnItems._layers) {
      var layer = plugin.drawTools.drawnItems._layers[i];
      if (layer instanceof L.Marker) {

        console.log("Marker found")
        // Todo: make this an array by color
        thisplugin.startingMarker = map.project(layer.getLatLng(), thisplugin.PROJECT_ZOOM);
        console.log("Marker set to " + thisplugin.startingMarker)
      }
    }

    function drawStartLabel(a) {
      if (n < 2) return;
      var alatlng = map.unproject(a.point, thisplugin.PROJECT_ZOOM);
      var labelText = "";
      if (thisplugin.stardirection === thisplugin.starDirENUM.CENTRALIZING) {
        labelText = "START PORTAL<BR>Keys: " + a.incoming.length + "<br>Total Fields: " + triangles.length.toString();
      } else {
        labelText = "START PORTAL<BR>Keys: " + a.incoming.length + ", SBUL: " + (centerSbul) + "<br>out: " + centerOutgoings + "<br>Total Fields: " +
          triangles.length.toString();
      }
      thisplugin.addLabel(thisplugin.startingpointGUID, alatlng, labelText);
    }

    function drawNumber(a, number) {
      if (n < 2) return;
      var alatlng = map.unproject(a.point, thisplugin.PROJECT_ZOOM);
      var labelText = "";
      labelText = number + "<br>Keys: " + a.incoming.length + "<br>out: " + a.outgoing.length;
      thisplugin.addLabel(a.guid, alatlng, labelText);
    }

    function drawLink(a, b, style) {
      var alatlng = map.unproject(a, thisplugin.PROJECT_ZOOM);
      var blatlng = map.unproject(b, thisplugin.PROJECT_ZOOM);

      var poly = L.polyline([alatlng, blatlng], style);
      poly.addTo(thisplugin.linksLayerGroup);


    }

    function drawField(a, b, c, style) {
      var alatlng = map.unproject(a, thisplugin.PROJECT_ZOOM);
      var blatlng = map.unproject(b, thisplugin.PROJECT_ZOOM);
      var clatlng = map.unproject(c, thisplugin.PROJECT_ZOOM);

      var poly = L.polygon([alatlng, blatlng, clatlng], style);
      poly.addTo(thisplugin.fieldsLayerGroup);

    }

    // Get portal locations
    $.each(window.portals, function (guid, portal) {
      var ll = portal.getLatLng();
      var p = map.project(ll, thisplugin.PROJECT_ZOOM);
      if (thisplugin.startingMarker !== undefined) {
        if (p.equals(thisplugin.startingMarker)) {
          thisplugin.startingMarkerGUID = guid;
          console.log("Marker GUID = " + thisplugin.startingMarkerGUID)
        }
      }
      thisplugin.locations[guid] = p;
    });

    thisplugin.intelLinks = {};
    $.each(window.links, function (guid, link) {
      //console.log('================================================================================');
      var lls = link.getLatLngs();
      var line = {
        a: {},
        b: {}
      };
      var a = lls[0],
        b = lls[1];

      line.a = map.project(a, thisplugin.PROJECT_ZOOM);
      line.b = map.project(b, thisplugin.PROJECT_ZOOM);
      thisplugin.intelLinks[guid] = line;
    });

    // Cache intel links as a flat array once (used repeatedly in candidate loop)
    var maplinksAll = null;
    // var emptyMaplinks = [];
    if (thisplugin.respectCurrentLinks) {
      maplinksAll = Object.values(thisplugin.intelLinks);
    }

    // filter layers into array that only contains GeodesicPolygon
    function findFanpoints(dtLayers, locations, filter) {
      var polygon, dtLayer, result = [];
      var i, filtered;
      var fanLayer;
      var ll, k, p;
      for (dtLayer in dtLayers) {
        fanLayer = dtLayers[dtLayer];
        if (!(fanLayer instanceof L.GeodesicPolygon)) {
          continue;
        }
        ll = fanLayer.getLatLngs();

        polygon = [];
        for (k = 0; k < ll.length; ++k) {
          p = map.project(ll[k], thisplugin.PROJECT_ZOOM);
          polygon.push(p);
        }
        filtered = filter(locations, polygon);
        // todo:
        // add fanLayer._leaflet_id as information to the fanpoint
        for (i in filtered) {
          p = filtered[i];
          // p.dtLayerColor = fanLayer.options.color;
          result[i] = p;
        }
      }
      return result;
    }

    this.sortedFanpoints = [];

    thisplugin.dtLayers = plugin.drawTools.drawnItems.getLayers();

    thisplugin.fanpoints = findFanpoints(thisplugin.dtLayers,
      this.locations,
      this.filterPolygon);


    var fanpointGuids = Object.keys(this.fanpoints);
    var npoints = fanpointGuids.length;

    if (npoints === 0) {
      // No plan -> reset signature and disable the path
      thisplugin.lastPlanSignature = null;
      if (thisplugin.showOrderPath) {
        thisplugin.setOrderPathActive(false);
      }
      return;
    }

    // signature of the current portal set (GUID set, order-independent)
    var currentSignature = fanpointGuids.sort()
      .join(',');

    // If the portal set changed: disable the path
    if (thisplugin.lastPlanSignature !== null &&
      thisplugin.lastPlanSignature !== currentSignature &&
      thisplugin.showOrderPath) {

      thisplugin.setOrderPathActive(false);
    }

    // Store signature for the next run
    thisplugin.lastPlanSignature = currentSignature;



    // Find convex hull from fanpoints list of points
    // Returns array : [guid, [x,y],.....]
    function convexHull(points) {

      // nested function
      function cross(a, b, o) {
        //return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
        return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
      }

      // convert to array
      //var pa = Object.entries(points).map(p => Point [p[0], [p[1].x, p[1].y]]);
      var pa = Object.entries(points)
        .map(p => [p[0], p[1]]);


      // sort by x then y if x the same
      pa.sort(function (a, b) {
        //return a[1][0] === b[1][0] ? a[1][1] - b[1][1] : a[1][0] - b[1][0];
        return a[1].x === b[1].x ? a[1].y - b[1].y : a[1].x - b[1].x;
      });

      var lower = [];
      var i;
      for (i = 0; i < pa.length; i++) {
        while (lower.length >= 2 && cross(lower[lower.length - 2][1], lower[lower.length - 1][1], pa[i][1]) <= 0) {
          lower.pop();
        }
        lower.push(pa[i]);
      }

      var upper = [];
      for (i = pa.length - 1; i >= 0; i--) {
        while (upper.length >= 2 && cross(upper[upper.length - 2][1], upper[upper.length - 1][1], pa[i][1]) <= 0) {
          upper.pop();
        }
        upper.push(pa[i]);
      }

      upper.pop();
      lower.pop();
      return lower.concat(upper);
    };

    // Add Marker Point to list of Fanpoints
    // Todo: get color magic to the startingMarker
    if (thisplugin.startingMarker !== undefined) {

      if (thisplugin.startingMarkerGUID in window.portals) {
        this.fanpoints[thisplugin.startingMarkerGUID] = thisplugin.startingMarker;
      }
    }

    function extendperimeter(perimeter, GUID, point) {
      var i;
      var done = false;
      if (GUID !== undefined) {

        for (i = 0; i < perimeter.length; i++) {
          if (perimeter[i] === GUID) {
            //already in
            done = true;
            break;
          }
          if (done) break;
        }
        if (!done) {
          // add the marker to the perimeter
          perimeter.unshift([GUID, [point.x, point.y]]);
        }
      }
      return perimeter;
    }

    thisplugin.perimeterpoints = convexHull(this.fanpoints);


    if (thisplugin.startingMarker !== undefined) {
      // extend perimeter by Marker.
      // You might ask: "why? It's inside the hull?" - Well, yes.
      // But givegiving the player as much freedom as possible is key.
      // Maybe it's a home portal or they already have tons of keys for it.
      // therefore you can force a starting point portal by adding a marker.
      thisplugin.perimeterpoints = extendperimeter(thisplugin.perimeterpoints, thisplugin.startingMarkerGUID, thisplugin.startingMarker)
    }

    //console.log("fanpoints: ========================================================");
    //console.log(this.fanpoints);

    // Use currently selected index in outer hull as starting point
    if (thisplugin.startingpointIndex >= thisplugin.perimeterpoints.length) {
      thisplugin.startingpointIndex = 0;
    }

    console.log("startingpointIndex = " + thisplugin.startingpointIndex);

    if (thisplugin.perimeterpoints.length !== 0) {
      thisplugin.startingpointGUID = thisplugin.perimeterpoints[thisplugin.startingpointIndex][0];
      thisplugin.startingpoint = this.fanpoints[thisplugin.startingpointGUID];
      //console.log("Starting point : " + thisplugin.startingpointGUID);
      //console.log("=> " + thisplugin.startingpoint);

      for (guid in this.fanpoints) {
        n++;
        if (this.fanpoints[guid].equals(thisplugin.startingpoint)) {

          continue;
        } else {

          a = this.fanpoints[guid];
          b = thisplugin.startingpoint;

          fanlinks.push({
            a: a,
            b: b,
            bearing: undefined,
            isJetLink: undefined,
            isFanLink: undefined,
            distance: thisplugin.distanceTo(a, b)
          });




        }
      }

      for (guid in this.fanpoints) {
        fp = this.fanpoints[guid];
        this.sortedFanpoints.push({
          point: fp,
          portal: portals[guid],
          bearing: this.getBearing(thisplugin.startingpoint, fp),
          guid: guid,
          incoming: [],
          outgoing: [],
          outgoingMeta: {},
          is_startpoint: this.fanpoints[guid].equals(thisplugin.startingpoint)
        });

      }
      this.sortedFanpoints.sort(function (a, b) {
        return a.bearing - b.bearing;
      });
    }
    /*
        // Apply manual order, if present
        if (thisplugin.manualOrderGuids &&
            thisplugin.manualOrderGuids.length === this.sortedFanpoints.length) {

            let byGuid = {};
            this.sortedFanpoints.forEach(function(fp) {
                byGuid[fp.guid] = fp;
            });

            let newOrder = [];
            let allPresent = true;

            thisplugin.manualOrderGuids.forEach(function(guid) {
                if (byGuid[guid]) {
                    newOrder.push(byGuid[guid]);
                } else {
                    allPresent = false;
                }
            });

            // Only apply if everything is consistent
            if (allPresent &&
                newOrder.length === this.sortedFanpoints.length &&
                newOrder[0].guid === thisplugin.startingpointGUID) {
                this.sortedFanpoints = newOrder;
            }

        }
        */

    //console.log("rotating...");
    // rotate the this.sortedFanpoints array until the bearing to the startingpoint has the longest gap to the previous one.
    // if no gap bigger 90° is present, start with the longest link.
    var currentBearing, lastBearing;
    var gaps = [];
    var gap, lastGap, maxGap, maxGapIndex, maxGapBearing;
    for (i in this.sortedFanpoints) {
      if (lastBearing === undefined) {
        lastBearing = this.sortedFanpoints[this.sortedFanpoints.length - 1].bearing;
        gap = 0;
        lastGap = 0;
        maxGap = 0;
        maxGapIndex = 0;
        maxGapBearing = 0;
      }
      currentBearing = this.sortedFanpoints[i].bearing;
      gap = lastBearing - currentBearing;
      if (gap < 0) gap *= -1;
      if (gap >= 180) gap = 360 - gap;

      if (gap > maxGap) {
        maxGap = gap;
        maxGapIndex = i;
        maxGapBearing = currentBearing;
      }
      lastBearing = currentBearing;
      lastGap = gap;
    }

    this.sortedFanpoints = this.sortedFanpoints.concat(this.sortedFanpoints.splice(1, maxGapIndex - 1));
    if (!thisplugin.is_clockwise) {
      // reverse all but the first element
      this.sortedFanpoints = this.sortedFanpoints.concat(this.sortedFanpoints.splice(1, this.sortedFanpoints.length - 1)
        .reverse());
      //lines.sort(function(a, b){return b.bearing - a.bearing;});
    }

    // ghi#23
    // ======= APPLY MANUAL ORDER (if present) =======
    if (thisplugin.manualOrderGuids &&
      thisplugin.manualOrderGuids.length === this.sortedFanpoints.length) {

      let byGuid = {};
      this.sortedFanpoints.forEach(function (fp) {
        byGuid[fp.guid] = fp;
      });

      let newOrder = [];
      let allPresent = true;

      thisplugin.manualOrderGuids.forEach(function (guid) {
        if (byGuid[guid]) {
          newOrder.push(byGuid[guid]);
        } else {
          allPresent = false;
        }
      });

      // Only if all GUIDs match and the anchor stays at position 0 do we accept the order
      if (allPresent &&
        newOrder.length === this.sortedFanpoints.length &&
        newOrder[0].guid === thisplugin.startingpointGUID) {
        this.sortedFanpoints = newOrder;
      }
    }
    // ======= END MANUAL ORDER =======

    donelinks = [];
    var outbound = 0;
    var possibleline;

    for (pa = 0; pa < this.sortedFanpoints.length; pa++) {
      bearing = this.sortedFanpoints[pa].bearing;
      //console.log("FANPOINTS: " + pa + " to 0 bearing: "+ bearing + " " + this.bearingWord(bearing));
      sublinkCount = 0;

      // Kandidaten pb < pa einsammeln und nach Distanz zum neuen Portal (pa) + Distanz zum Anker sortieren.
      // Anchor (pb === 0) bekommt metric = Infinity und kommt damit immer zuerst.
      var newPoint = this.sortedFanpoints[pa].point;
      var anchorPoint = this.sortedFanpoints[0].point;

      var candidates = [];
      for (pb = 0; pb < pa; pb++) {
        var candPoint = this.sortedFanpoints[pb].point;

        var d = thisplugin.distanceTo(newPoint, candPoint);
        d += thisplugin.distanceTo(anchorPoint, candPoint);
        var metric;
        if (pb === 0) {
          metric = Infinity;
        } else {
          metric = thisplugin.distanceTo(newPoint, candPoint);
          metric += thisplugin.distanceTo(anchorPoint, candPoint);
        }
        candidates.push({
          pbIndex: pb,
          isAnchor: (pb === 0),
          metric: metric
        });
      }

      candidates.sort(function (u, v) {
        return v.metric - u.metric;
      });

      var paFp = this.sortedFanpoints[pa];
      var paPoint = paFp.point;


      for (var ci = 0; ci < candidates.length; ci++) {
        pb = candidates[ci].pbIndex;
        outbound = 0;

        a = paPoint;
        b = this.sortedFanpoints[pb].point;
        bearing = this.getBearing(a, b);
        const distance = thisplugin.distanceTo(a, b);

        if (pb === 0) {
          var maxLinks = 8 + thisplugin.availableSBUL * 8;
          if (thisplugin.stardirection === thisplugin.starDirENUM.RADIATING && centerOutgoings < maxLinks) {
            outbound = 1;
          } else {
            thisplugin.centerKeys++;
          }

          if (outbound === 1) {
            a = this.sortedFanpoints[pb].point;
            b = this.sortedFanpoints[pa].point;
            // console.log("outbound");
            centerOutgoings++;
          }
        }

        possibleline = {
          a: a,
          b: b,
          bearing: bearing,
          isJetLink: false,
          isFanLink: (pb === 0),
          creatingFieldsWith: [],
          counts: true,
          distance: distance
        };
        intersection = 0;
        maplinks = maplinksAll;

        // "Respect Intel" stuff
        if (thisplugin.respectCurrentLinks) {
          for (i in maplinks) {
            if (this.intersects(possibleline, maplinks[i])) {
              intersection++;
              if (possibleline.isFanLink && outbound === 1) centerOutgoings--;
              break;
            }
          }
          if (intersection === 0 && this.linkExists(maplinks, possibleline)) {
            possibleline.counts = false;
            if (possibleline.isFanLink && outbound === 1) centerOutgoings--;
          }
        }
        if (intersection === 0) {
          for (i in donelinks) {
            if (this.intersects(possibleline, donelinks[i])) {
              intersection++;
              if (possibleline.isFanLink && outbound === 1) centerOutgoings--;
              break;
            }
          }
        }
        if (intersection === 0) {
          for (i in fanlinks) {
            if (this.intersects(possibleline, fanlinks[i])) {
              intersection++;
              if (possibleline.isFanLink && outbound === 1) centerOutgoings--;
              break;
            }
          }
        }

        if (centerOutgoings > 8 && centerOutgoings < maxLinks) {
          // count sbul
          centerSbul = Math.ceil((centerOutgoings - 8) / 8);
        }

        if (intersection === 0) {
          //console.log("FANPOINTS: " + pa + " - "+pb+" bearing: " + bearing + "° " + this.bearingWord(bearing));
          // Check if Link is a jetlink and add second field
          var thirds = [];
          if (thisplugin.respectCurrentLinks) {
            if (possibleline.counts) {
              // thirds = this.getThirds(donelinks.concat(maplinks), possibleline.a, possibleline.b);
              thirds = thisplugin.getThirds2(donelinks, maplinks, possibleline.a, possibleline.b);
            }
          } else {
            // thirds = this.getThirds(donelinks, possibleline.a, possibleline.b);
            thirds = thisplugin.getThirds2(donelinks, [], possibleline.a, possibleline.b);
          }

          if (thirds.length === 2) {
            possibleline.isJetLink = true;
          }

          possibleline.creatingFieldsWith = thirds;

          let field = {}
          for (var t in thirds) {
            field = {
              a: thirds[t],
              b: possibleline.a,
              c: possibleline.b
            }
            triangles.push(field);
          }

          if (possibleline.counts) {
            donelinks.splice(donelinks.length - (this.sortedFanpoints.length - pa), 0, possibleline);
            if (pb === 0 && thisplugin.stardirection === thisplugin.starDirENUM.RADIATING && outbound === 1) {
              this.sortedFanpoints[pb].outgoing.push(this.sortedFanpoints[pa]);
              this.sortedFanpoints[pa].incoming.push(this.sortedFanpoints[pb]);

              // Store per-link metadata (field creation) on the source portal.
              // This avoids recomputing geometry during task list export.
              this.sortedFanpoints[pb].outgoingMeta[this.sortedFanpoints[pa].guid] = {
                creatingFieldsWith: possibleline.creatingFieldsWith
              };

            } else {
              this.sortedFanpoints[pa].outgoing.push(this.sortedFanpoints[pb]);
              this.sortedFanpoints[pb].incoming.push(this.sortedFanpoints[pa]);

              this.sortedFanpoints[pa].outgoingMeta[this.sortedFanpoints[pb].guid] = {
                creatingFieldsWith: possibleline.creatingFieldsWith
              };
            }



          }

        }
      }
    }

    $.each(donelinks, function (i, link) {
      thisplugin.links[i] = link;
    });

    if (this.sortedFanpoints.length > 3) {
      thisplugin.triangles = triangles;
      thisplugin.donelinks = donelinks;
      thisplugin.n = n;
      console.log("=== Fan Fields === " +
        "\nFanPortals: " + (n - 1) +
        "\nCenterKeys:" + thisplugin.centerKeys +
        "\nTotal links / keys:    " + donelinks.length.toString() +
        "\nFields:                " + triangles.length.toString() +
        "\nBuild AP:              " + (donelinks.length * 313 + triangles.length * 1250)
        .toString() +
        "\nDestroy AP:            " + (this.sortedFanpoints.length * 187 + triangles.length * 750)
        .toString());
    }


    // remove any not wanted
    thisplugin.clearAllPortalLabels();

    // and add those we do
    var startLabelDrawn = false;
    $.each(this.sortedFanpoints, function (idx, fp) {
      if (thisplugin.startingpoint !== undefined && fp.point.equals(thisplugin.startingpoint)) {
        drawStartLabel(fp);
        startLabelDrawn = true;
      } else {
        drawNumber(fp, idx);
      }

    });

    $.each(thisplugin.links, function (idx, edge) {
      if (thisplugin.indicateLinkDirection) {
        thisplugin.linkDashArray = [10, 5, 5, 5, 5, 5, 5, 5, "100000"];
      } else {
        thisplugin.linkDashArray = null;
      }
      drawLink(edge.a, edge.b, {
        color: '#FF0000',
        opacity: 1,
        weight: 1.5,
        clickable: false,
        interactive: false,
        smoothFactor: 10,
        dashArray: thisplugin.linkDashArray,
      });
    });


    $.each(triangles, function (idx, triangle) {
      drawField(triangle.a, triangle.b, triangle.c, {
        stroke: false,
        fill: true,
        fillColor: '#FF0000',
        fillOpacity: 0.1,
        clickable: false,
        interactive: false,
      });
    });

    if (thisplugin.showOrderPath) {
      thisplugin.updateOrderPath();
    } else if (thisplugin.orderPathLayerGroup) {
      thisplugin.orderPathLayerGroup.clearLayers();
    }
  };


  // as calculating portal marker visibility can take some time when there's lots of portals shown, we'll do it on
  // a short timer. this way it doesn't get repeated so much
  thisplugin.delayedUpdateLayer = function (wait) {
    if (thisplugin.timer === undefined) {
      thisplugin.timer = setTimeout(function () {


        thisplugin.timer = undefined;
        if (!thisplugin.is_locked) {
          thisplugin.updateLayer();
        }
      }, wait * 350);

    }

  };

  var symbol_clockwise = '&#8635;';
  var symbol_counterclockwise = '&#8634;';
  var symbol_clipboard = '&#128203;';

  thisplugin.addFfButtons = function () {
    thisplugin.ffButtons = L.Control.extend({
      options: {
        position: "topleft",
      },
      onAdd: function (map) {
        var container = L.DomUtil.create("div", "leaflet-fanfields leaflet-bar");

        // Prevent clicks/double-clicks on this control from reaching the map (no dblclick zoom)
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);

        // hard-stop double click
        L.DomEvent.on(container, 'dblclick', L.DomEvent.stop);


        $(container)
          .append(
            '<a id="fanfieldShiftLeftButton" href="javascript: void(0);" class="fanfields-control" title="FanFields shift left">' +
            symbol_counterclockwise + '</a>'
          )
          .on("click", "#fanfieldShiftLeftButton", function () {
            thisplugin.previousStartingPoint();
          });

        $(container)
          .append(
            '<a id="fanfieldShiftRightButton" href="javascript: void(0);" class="fanfields-control" title="FanFields shift right">' + symbol_clockwise +
            '</a>'
          )
          .on("click", "#fanfieldShiftRightButton", function () {
            thisplugin.nextStartingPoint();
          });

        return container;
      },
    });
    map.addControl(new thisplugin.ffButtons());
  };

  thisplugin.getMaxDialogWidth = function () {
    const vw = (window.visualViewport && window.visualViewport.width) ? window.visualViewport.width : window.innerWidth;
    return Math.max(260, Math.floor(vw) - 12); // leave some space
  };

  thisplugin.setup = function () {
    thisplugin.setupCSS();
    thisplugin.linksLayerGroup = new L.LayerGroup();
    thisplugin.fieldsLayerGroup = new L.LayerGroup();
    thisplugin.numbersLayerGroup = new L.LayerGroup();
    //thisplugin.MaxDialogWidth = $(window).width() - 2;
    thisplugin.MaxDialogWidth = thisplugin.getMaxDialogWidth();

    thisplugin.orderPathLayerGroup = new L.LayerGroup();


    //Extend LatLng here to ensure it was created before
    thisplugin.initLatLng();

    var buttonBookmarks = '';
    var buttonBookmarksOnly = '';
    if (typeof window.plugin.bookmarks !== 'undefined') {
      // Write Bookmarks
      buttonBookmarks =
        '<a class="plugin_fanfields2_btn" onclick="window.plugin.fanfields.saveBookmarks();" title="Create New Portal Potential Future">Write&nbsp;Bookmarks</a> ';

      // Only Use Bookmarked Portals
      buttonBookmarksOnly =
        '<a class="plugin_fanfields2_btn" id="plugin_fanfields2_bookarks_only_btn" onclick="window.plugin.fanfields.useBookmarksOnly();" title="Help Enlightened Strong Victory">&#128278;&nbsp;All Portals</a> ';
    }
    // Show as list
    var buttonPortalList = '<a class="plugin_fanfields2_btn" onclick="window.plugin.fanfields.exportText();" title="OpenAll Link Create Star">' +
      symbol_clipboard + '&nbsp;Task&nbsp;List</a> ';

    // Manage order
    var buttonManageOrder =
      '<a class="plugin_fanfields2_btn" id="plugin_fanfields2_manageorderbtn" onclick="window.plugin.fanfields.showManageOrderDialog();" title="Use Restraint Follow Easy Path">Manage&nbsp;order</a> ';



    // clockwise &#8635; ↻
    // counterclockwise &#8634; ↺
    // &#5123; ᐃ
    // &#5121; ᐁ
    // &#5130; ᐊ
    // &#5125; ᐅ

    // var symbol_up = '&#5123;';
    // var symbol_down = '&#5121;';
    var symbol_left = '&#5130;';
    var symbol_right = '&#5125;';

    var symbol_inc = symbol_right;
    var symbol_dec = symbol_left;

    var buttonClockwise =
      '<a class="plugin_fanfields2_btn" id="plugin_fanfields2_clckwsbtn" onclick="window.plugin.fanfields.toggleclockwise();" title="Begin Journey Breathe XM ">Clockwise&nbsp;' +
      symbol_clockwise + '</a> ';
    var buttonLock =
      '<a class="plugin_fanfields2_btn" id="plugin_fanfields2_lockbtn" onclick="window.plugin.fanfields.lock();" title="Avoid XM Message Lie">&#128275;&nbsp;Unlocked</a> ';

    var buttonStarDirection =
      '<a class="plugin_fanfields2_btn" id="plugin_fanfields2_stardirbtn" onclick="window.plugin.fanfields.toggleStarDirection();" title="Change Perspective Technology">Inbounding</a> ';
    // Available SBUL
    var buttonSBUL =
      '<span id="plugin_fanfields2_availablesbul" class="plugin_fanfields2_multibtn" style="display: none;">' +
      '    <span class="plugin_fanfields2_availablesbul_label">Available&nbsp;SBUL:</span>' +
      '    <span class="plugin_fanfields2_multibtn" style="flex: 50%">' +
      '        <a id="plugin_fanfields2_inscsbulbtn" class="plugin_fanfields2_minibtn" onclick="window.plugin.fanfields.decreaseSBUL();" >' + symbol_dec +
      '</a>' +
      '        <span id="plugin_fanfields2_availablesbul_count" class="plugin_fanfields2_minibtn">' + (thisplugin.availableSBUL) + '</span>' +
      '        <a id="plugin_fanfields2_decsbulbtn" class="plugin_fanfields2_minibtn" onclick="window.plugin.fanfields.increaseSBUL();">' + symbol_inc +
      '</a>' +
      '    </span>' +
      '</span>';

    // Respect Intel
    var buttonRespect =
      '<a class="plugin_fanfields2_btn" id="plugin_fanfields2_respectbtn" onclick="window.plugin.fanfields.toggleRespectCurrentLinks();" title="Question Conflict Data">Respect&nbsp;Intel:&nbsp;OFF</a> ';

    // Show link dir
    var buttonLinkDirectionIndicator =
      '<a class="plugin_fanfields2_btn" id="plugin_fanfields2_direction_indicator_btn" onclick="window.plugin.fanfields.toggleLinkDirIndicator();" title="Technology Intelligence See All">Show&nbsp;link&nbsp;dir:&nbsp;ON</a> ';

    // Shift anchor
    var buttonShiftAnchor =
      '<a class="plugin_fanfields2_btn" onclick="window.plugin.fanfields.previousStartingPoint();" title="Less Chaos More Stability">Shift&nbsp;left&nbsp;' +
      symbol_counterclockwise + '</a>' + // clockwise &#8635;
      '<a class="plugin_fanfields2_btn" onclick="window.plugin.fanfields.nextStartingPoint();" title="Restraint Path Gain Harmony">Shift&nbsp;right&nbsp;' +
      symbol_clockwise + '</a>';

    var buttonStats =
      '<a class="plugin_fanfields2_btn" id="plugin_fanfields2_statsbtn" onclick="window.plugin.fanfields.showStatistics();" title="See Truth Now">Stats</a> ';

    // Write Drawtools
    var buttonDrawTools =
      '<a class="plugin_fanfields2_btn" id="plugin_fanfields2_exportDTbtn" onclick="window.plugin.fanfields.exportDrawtools();" title="Help Shapers Create Future">Write&nbsp;DrawTools</a> ';

    // Write Arcs
    var buttonArcs = ''
    if (typeof window.plugin.arcs !== 'undefined' && window.PLAYER.team === 'ENLIGHTENED') {
      buttonArcs =
        '<a class="plugin_fanfields2_btn" id="plugin_fanfields2_exportArcsBtn" onclick="window.plugin.fanfields.exportArcs();" title="Field Together Improve Human Mind">Write&nbsp;Arcs</a> ';
    };

    var buttonHelp = '<a class="plugin_fanfields2_btn" id="plugin_fanfields2_helpbtn" onclick="window.plugin.fanfields.help();" title="Help" >Help</a> ';

    var fanfields_buttons = '<span class="plugin_fanfields2_multibtn plugin_fanfields2_titlebar">Fan Fields 2</span>';

    fanfields_buttons +=
      buttonShiftAnchor +
      buttonClockwise +
      buttonStarDirection +
      buttonSBUL +
      buttonLock +
      buttonRespect +
      buttonBookmarksOnly +
      buttonLinkDirectionIndicator +
      buttonPortalList +
      buttonManageOrder +
      buttonDrawTools +
      buttonBookmarks +
      buttonArcs +
      buttonStats +
      buttonHelp;

    $('#sidebar')
      .append('<div id="fanfields2" class="plugin_fanfields2_sidebar"></div>');

    thisplugin.addFfButtons();

    if (!window.plugin.drawTools) {
      var width = 400;
      thisplugin.MaxDialogWidth = thisplugin.getMaxDialogWidth();
      if (thisplugin.MaxDialogWidth < width) {
        width = thisplugin.MaxDialogWidth;
      }

      dialog({
        html: '<b>Fan Fields 2</b><p>Fan Fields 2 requires the IITC Drawtools plugin</p><a href="https://iitc.app/download_desktop#draw-tools-by-breunigs">Download here</a>',
        id: 'plugin_fanfields2_alert_dependencies',
        title: 'Fan Fields 2 - Missing dependency',
        width: width
      });

      $('#fanfields2')
        .empty();
      $('#fanfields2')
        .append("<i>Fan Fields requires IITC drawtools plugin.</i>");

      return;
    }



    $('#fanfields2')
      .append(fanfields_buttons);

    //         window.pluginCreateHook('pluginBkmrksEdit');

    //         window.addHook('pluginBkmrksEdit', function (e) {
    //             if (thisplugin.use_bookmarks_only && e.target === 'portal') {
    //                 thisplugin.delayedUpdateLayer(0.5);
    //             }
    //         });

    window.pluginCreateHook('pluginDrawTools');

    window.addHook('pluginDrawTools', function (e) {
      thisplugin.delayedUpdateLayer(0.5);
    });
    window.addHook('mapDataRefreshEnd', function () {
      thisplugin.delayedUpdateLayer(0.5);
    });
    window.addHook('requestFinished', function () {
      setTimeout(function () {
        thisplugin.delayedUpdateLayer(3.0);
      }, 1);
    });

    window.map.on('moveend', function () {
      thisplugin.delayedUpdateLayer(0.5);
    });
    window.map.on('overlayadd overlayremove', function () {
      setTimeout(function () {
        thisplugin.delayedUpdateLayer(1.0);
      }, 1);
    });
    window.map.on('zoomend', function () {
      if (thisplugin.showOrderPath) {
        thisplugin.updateOrderPath();
      }
    });

    window.addLayerGroup('Fanfields links', thisplugin.linksLayerGroup, false);
    window.addLayerGroup('Fanfields fields', thisplugin.fieldsLayerGroup, false);
    window.addLayerGroup('Fanfields numbers', thisplugin.numbersLayerGroup, false);

    //window.map.on('zoomend', thisplugin.clearAllPortalLabels );
  };


  var setup = thisplugin.setup;

  // PLUGIN END //////////////////////////////////////////////////////////


  setup.info = plugin_info; //add the script info data to the function as a property
  if (typeof changelog !== 'undefined') setup.info.changelog = changelog;
  if (!window.bootPlugins) window.bootPlugins = [];
  window.bootPlugins.push(setup);
  // if IITC has already booted, immediately run the 'setup' function
  if (window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
script.id = 'iitc_plugin_fanfields2';
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = {
  version: GM_info.script.version,
  name: GM_info.script.name,
  description: GM_info.script.description
};
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement)
.appendChild(script);




// EOF
