// ==UserScript==
// @author          Avataar120
// @id              fanfields3@Avataar120
// @name            Fan Fields 3
// @category        Layer
// @version         3.1.1.20260925
// @description     Fork of Heistergand's Fan Fields 2 (thanks Heistergand for the original work!). Plans the largest tidy set of nested fields, and adds: walking optimization (less backtracking between portals, Destroy stops placed where they add the least walking), automatic best anchor/direction search that reuses your faction's existing links, Blockers handling in the Task List, plan locking, Pick anchor on the map, and route export to Google Maps / Portal Route. Enable from the layer chooser.
// @downloadURL     https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/Avataar120/fanfields3.user.js
// @updateURL       https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/Avataar120/fanfields3.meta.js
// @icon            https://raw.githubusercontent.com/Avataar120/fanfields3/master/fanfields3-32.png
// @icon64          https://raw.githubusercontent.com/Avataar120/fanfields3/master/fanfields3-64.png
// @supportURL      https://github.com/Avataar120/fanfields3/issues
// @namespace       https://github.com/Avataar120/fanfields3
// @issueTracker    https://github.com/Avataar120/fanfields3/issues
// @homepageURL     https://github.com/Avataar120/fanfields3/
// @depends         draw-tools@breunigs
// @recommends      bookmarks@ZasoGD|draw-tools-plus@zaso|liveInventory@DanielOnDiordna|keys@xelio
// @match           https://intel.ingress.com/*
// @include         https://intel.ingress.com/*
// @grant           none
// ==/UserScript==


function wrapper(plugin_info) {
  // ensure plugin framework is there, even if iitc is not yet loaded
  if (typeof window.plugin !== 'function') window.plugin = function () {};
  plugin_info.buildName = 'main';
  plugin_info.dateTimeVersion = '2026-09-25-131600';
  plugin_info.pluginId = 'fanfields';

  /* global L, $, dialog, map, portals, links, plugin  -- eslint*/
  /* exported setup, changelog -- eslint */

  var arcname = (window.PLAYER && window.PLAYER.team === 'ENLIGHTENED') ? 'Arc' : '***';
  var changelog = [{
      version: '3.1.1',
      changes: [
        'IMPROVE: The plugin description in the IITC plugin list now thanks Heistergand, the author of the original Fan Fields 2 this plugin is a fork of, and lists the main features added since: walking optimization, automatic best anchor search, Blockers handling, plan locking, Pick anchor and route export.',
      ],
    },{
      version: '3.1.0',
      changes: [
        'NEW: Blockers option (on by default): links that cross your plan and that Respect Intel does not avoid are drawn as red dotted lines, and the Task List gets Destroy stops telling you which portals to neutralize so those links are gone before the links they block are thrown. Each stop is placed where it adds the least walking, and one portal that frees several links is preferred over several separate ones when it costs less walking.',
        'NEW: A portal the plan captures anyway is marked with a red cross and "(frees N)" when capturing it frees a blocking link in time.',
        'NEW: Max detour option (100 m, 200 m, 500 m by default, 1 km or no limit) limits the extra walking one Destroy stop may add. Links that cannot be freed within it are listed under the Task List.',
        'NEW: Destroy stops also appear in the Google Maps route, the Portal Route import and the printed Task List.',
        'NEW: The plan now locks itself as soon as a new plan is completely calculated, so it stops moving while you pan, zoom or the map data refreshes. Changing a menu option, the drawn polygon or a map layer recalculates it and locks it again; clicking Lock/Unlock yourself keeps your choice until the next new plan.',
        'FIX: Menu options such as Clockwise, Respect Intel, SBUL or Optim now recalculate the plan even while it is locked, instead of changing the button without changing the plan.',
      ],
    },{
      version: '3.0.0',
      changes: [
        'NEW: The plugin is now Fan Fields 3, with its own GitHub repository (fanfields3) and new download/update address. Scripts installed from the old address no longer update: reinstall from https://github.com/Avataar120/fanfields3/raw/master/iitc_plugin_fanfields3.user.js.',
        'IMPROVE: The automatic anchor/direction search now tries first the portals already touched by the most links thrown in-game for your faction, and stops as soon as every existing link is reused (or after 8 seconds on very large selections).',
        'IMPROVE: When several anchors reuse as many existing links, the search now prefers the one giving more fields, then fewer keys on the busiest portal.',
        'IMPROVE: The search now runs in the background once the portals have finished loading, so drawing a polygon no longer freezes the map: the plan shows right away and the anchor may update about a second later. Choosing an anchor, a direction or a manual order yourself cancels it.',
        'IMPROVE: The search is skipped when none of your faction\'s links exist between the selected portals (it is retried for one minute, in case they are still loading).',
        'IMPROVE: Checking whether a link already exists in-game is now instant, which speeds up the Task List, the faded links on the map and the anchor search.',
        'FIX: The Clockwise/Counterclockwise button now shows the right direction after the automatic search changes it.',
      ],
    },{
      version: '2.8.16',
      changes: [
        'NEW: Task List now shows grid lines between portals and between columns, and centers all its text, for an easier read.',
        'NEW: Added a Lock/Unlock padlock icon to the map\'s own topleft shortcuts (green open, red closed), next to the Task List/Shift/Pick anchor buttons, so the plan can be frozen without opening the sidebar menu.',
      ],
    },{
      version: '2.8.15',
      changes: [
        'FIX: The Statistics window no longer stays frozen on stale numbers — it now updates live every time the plan recalculates, same as the Task List already did.',
      ],
    },{
      version: '2.8.14',
      changes: [
        'NEW: Added a "Pick anchor" button (in the sidebar and next to the map\'s own Shift left/right buttons) to make any portal the anchor just by clicking it on the map — including one in the middle of the selection, not only the outer edge portals reachable with Shift left/right.',
        'IMPROVE: The automatic anchor/direction search that runs right after drawing or editing a polygon now considers every portal inside it, not only the outer edge ones, when picking whichever reuses the most links already thrown in-game for your faction.',
      ],
    },{
      version: '2.8.13',
      changes: [
        'NEW: On mobile, tapping a portal name in the Task List now centers the map on that portal, highlights it and closes the list. Desktop is unchanged: the map is centered, the portal details open and the list stays open.',
        'NEW: Task List\'s Fields cell now fades and strikes through, like the Links cell, once no outgoing link is left to throw from that portal.',
        'FIX: Task List\'s Action column no longer stays on "Keys" for a portal once the keys you hold (Keys or LiveInventory plugin) cover what it needs — it now shows "Nothing".',
        'FIX: On mobile, "Navigate with Google Maps" now only sends the next 20 stops still to do instead of the whole route, since a longer route could crash the Google Maps app.',
      ],
    },{
      version: '2.8.12',
      changes: [
        'NEW: Task List\'s Keys column now includes a quick-set button next to the count (Keys plugin only): mark a portal as having enough keys with one tap, or reset that portal back to 0 once marked.',
      ],
    },{
      version: '2.8.11',
      changes: [
        'FIX: Respect Intel now only blocks crossing the selected factions\' links, even when your own faction is included — it no longer changes anything else about how already-existing links are handled or displayed.',
        'FIX: Task List\'s Links column now shows how many outgoing links are still left to throw from a portal, instead of its total outgoing link count.',
        'NEW: Already-thrown links now show as a faded brownish-red on the map itself, not just in the Task List — only links still left to throw stay bright red. Toggle via the same "Grey out done links" button.',
        'FIX: Task List link details no longer look bold for a still-to-throw link — lighter, slightly smaller text than before.',
        'NEW: Respect Intel now defaults to your own faction (ENL or RES) instead of NONE.',
        'FIX: Task List\'s Refresh/shift/OK buttons were unreachable on mobile once the list had enough portals to grow taller than the screen — the list now caps its height to the visible screen and scrolls its own content instead.',
        'NEW: After a new (or edited) polygon replaces the previous one, the plan now automatically searches for whichever starting portal and direction reuses the most links already thrown in-game for your faction, instead of keeping an arbitrary orientation. Skipped while Locked or when a manual portal order is active.',
        'FIX: Task List\'s "Navigate with Google Maps" route no longer includes a portal with nothing left to do there.',
      ],
    },{
      version: '2.8.10',
      changes: [
        'NEW: Added a Task List button to the map\'s top-left corner, next to the anchor rotation buttons, so the list can be opened directly from there.',
        'NEW: Added the anchor rotation buttons to the Task List window itself, next to the OK button, so the start portal can be changed without closing the list.',
        'NEW: Added a Refresh button next to those anchor rotation buttons in the Task List, to force an IITC map data refresh without closing the list.',
        'FIX: An open Task List no longer stays stuck showing an already-thrown link as still outstanding — its own 10-second refresh now also re-reads the current in-game data itself, instead of relying only on IITC data events that don\'t always reach the plugin (seen on mobile).',
      ],
    },{
      version: '2.8.9',
      changes: [
        'NEW: Task List\'s Action column now shows Capture, Link, Keys or Nothing for each portal, based on what actually still needs doing there (not owned or under 8 resonators, outgoing links left, incoming links or keys still needed, or fully done).',
        'NEW: The Links and Keys columns now fade and strike through on their own once that count is settled, even before the whole portal is done.',
        'NEW: A small camera icon marks Volatile Scout Controlled portals next to their name in the Task List.',
        'FIX: Portal ownership was never correctly detected, so the Task List never recognized a portal as already captured.',
        'FIX: Tooltips no longer pop up on tap on mobile in the Task List.',
      ],
    },{
      version: '2.8.8',
      changes: [
        'NEW: Coming back to IITC after it was in the background (app switch, screen lock) now triggers a data refresh right away, instead of waiting for IITC\'s own refresh timer or needing to pan/zoom the map manually.',
        'NEW: An open Task List now also refreshes itself every 10 seconds on its own, so available key counts and in-game link/portal completion stay current even between plan recalculations.',
      ],
    },{
      version: '2.8.7',
      changes: [
        'FIX: Clicking a portal in the Task List threw an error on desktop (window.map.flyTo is not a function).',
      ],
    },{
      version: '2.8.6',
      changes: [
        'NEW: "Link order" menu button lets you choose how links are oriented, without changing the fanfield plan itself: keep the algorithm\'s own choice, optimize for fewer keys on any single portal, or optimize for less backtracking while walking the plan.',
      ],
    },{
      version: '2.8.5',
      changes: [
        'NEW: Task List strikes through a link line already made in-game for your faction (grey), and once all of a portal\'s links exist, fades and strikes through that whole portal line too (yellow). Toggle via the "Grey out done links" button.',
        'NEW: Task List no longer counts a key toward a portal\'s "Keys needed" once the link it was meant for already exists in-game.',
        'NEW: Task List now refreshes itself live as the background plan changes (new links appearing in-game, fan field rotation, anchor changes, ...) — no need to close and reopen it.',
      ],
    },{
      version: '2.8.4',
      changes: [
        'NEW: add button to flip a link.',
      ],
    },{
      version: '2.8.3',
      changes: [
        'FIX: formatDistance is not defined on desktop IITC-CE builds.',
      ],
    },{    
      version: '2.8.2',
      changes: [
        'FIX: Respect Intel integrates already existing own-faction links into planned fields.',
      ],
    },{
      version: '2.8.1',
      changes: [
        'NEW: Add support for 3rd party plugin "Portal Route".',
      ],
    },{
      version: '2.8.0',
      changes: [
        'NEW: Add user warning when trying to link impossible lengths from underneath a field.',
        'IMPROVE print design',
        'FIX: adjust label position to avoid overlapping with portal names',
        'FIX: minor code cleanup.',
      ],
    },{
      version: '2.7.8',
      changes: [
        'NEW: Respect Intel now supports filtering which factions\' links are treated as blockers (Issue #104).',
      ],
    },
    {
      version: '2.7.7',
      changes: [
        'IMPROVE portal sequence editor usage for mobile',
        'UPDATE help dialog content',
        'IMPROVE task list design',
      ],
    },
    {
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
  
  // Compat: window.formatDistance has been moved to IITC.utils.formatDistance
  // in the recent builds of IITC-CE (desktop). We handle both cases :
  thisplugin.formatDistance = function (distance) {
      if (window.IITC && window.IITC.utils && typeof window.IITC.utils.formatDistance === 'function') {
          return window.IITC.utils.formatDistance(distance);
      }
      if (typeof window.formatDistance === 'function') {
          return window.formatDistance(distance);
      }
      // Fallback minimal si aucune des deux n'existe
      return distance < 1000
          ? Math.round(distance) + ' m'
          : (distance / 1000).toFixed(2) + ' km';
  };

  // const values
  // zoom level used for projecting points between latLng and pixel coordinates. may affect precision of triangulation
  thisplugin.PROJECT_ZOOM = 16;

  // Debug: when true, updateLayer() logs the plan's portals (with coordinates) and the drawn
  // polygon(s) to the console on every recalculation. Toggle from the console:
  // window.plugin.fanfields.debugLogPlan = false;
  thisplugin.debugLogPlan = true;

  // Most stops (origin included) handed to Google Maps on mobile: a longer route can make the
  // Google Maps app misbehave or crash when opened from the "Navigate with Google Maps" link.
  thisplugin.GOOGLE_MAPS_MAX_STOPS_MOBILE = 20;

  thisplugin.LABEL_WIDTH = 100;
  thisplugin.LABEL_HEIGHT = 49;
  thisplugin.LABEL_PADDING_TOP = 27;

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

  // Pinned anchor (guid), applied by updateLayer() on every recalculation: extends
  // thisplugin.perimeterpoints with it if needed and re-derives thisplugin.startingpointIndex
  // from it, so an anchor OFF the hull sticks around across recalculations exactly like a hull
  // one. null means "no pin" — the algorithm's own hull-based choice (or the marker, if any)
  // applies as usual. Set two ways:
  //  - thisplugin.setAnchorByGuid (the "Pick anchor" button): an explicit user choice —
  //    thisplugin.forcedAnchorIsManual is set alongside it, so the auto-orientation search
  //    below never silently overrides it on a later polygon edit.
  //  - the auto-orientation search itself, for its own best pick when that pick isn't a hull
  //    portal — forcedAnchorIsManual stays false, so a genuinely new polygon can freely
  //    re-search and replace it.
  // Cleared by cycling (previousStartingPoint/nextStartingPoint), since stepping away from a
  // pinned anchor means the user no longer wants it pinned, manual or not.
  thisplugin.forcedAnchorGUID = null;
  thisplugin.forcedAnchorIsManual = false;

  // Whether the next portal click on the map should set that portal as the anchor (see the
  // Pick anchor sidebar button and the portalSelected hook in setup()).
  thisplugin.isPickingAnchor = false;



  thisplugin.links = [];
  thisplugin.linksLayerGroup = null;
  thisplugin.fieldsLayerGroup = null;
  thisplugin.numbersLayerGroup = null;


  // ghi#23
  thisplugin.orderPathLayerGroup = null;
  thisplugin.showOrderPath = false;
  thisplugin.manualOrderGuids = null;
  thisplugin.lastPlanSignature = null;

  // Manual per-link direction overrides (Task List "flip" button, and the "Fewer keys"
  // optimizer below).
  // Keyed by undirected link key (getUndirectedLinkKey) -> true.
  // Applies to mesh links between fan points as well as a portal's own anchor (fan/star) link.
  thisplugin.manualLinkFlips = {};

  // "Less walking" (DISTANCE mode): portals it relocated earlier in the walk, right next to
  // whichever portal already in the walk is closest to them (see computeDistanceOrderFlips).
  // Keyed by guid -> true. Used only to highlight them in the Task List (green), as a reminder
  // that this portal must already be captured, with enough of its own keys gathered, by the
  // time the walk reaches that earlier spot — it's no longer visited in its "natural" position.
  thisplugin.relocatedForLessWalkingGuids = {};

  // "Less walking" (DISTANCE mode): the walk/display order it relocated portals into (see
  // computeDistanceOrderReordering). This is a PURE DISPLAY order — never fed back into the
  // core algorithm, which always builds its links/fields from thisplugin.sortedFanpoints
  // (and thisplugin.manualOrderGuids, the Manage Portal Order feature's own, unrelated,
  // BUILD-order override). The core algorithm only considers, for each portal, the portals
  // that precede it in sortedFanpoints as possible link partners — reordering that array would
  // silently change which links/fields exist, which is exactly what this feature must never
  // do. thisplugin.getDisplayOrder() resolves this (or falls back to sortedFanpoints) for
  // everything that only cares about the walking sequence: the Task List, the on-map position
  // numbers, the "Path" preview, Google Maps navigation, Portal Route stops, and bookmarks
  // order. null when no portal is currently relocated.
  thisplugin.displayOrderGuids = null;

  // Link order optimization (menu button "Link order"). This never touches the algorithm
  // itself (which links exist, which fields form) — it only pre-fills / edits
  // thisplugin.manualLinkFlips, the very same map the Task List's per-link ↔ button edits by
  // hand, so the result is always just a starting point the user can keep tweaking manually.
  // ALGO: pure algorithm, no automatic overrides.
  // KEYS: greedy rebalancing of mesh link direction to lower the maximum keys needed at any
  //       single portal.
  // DISTANCE: when a portal's own OUTGOING count (as the base algorithm computed it — not its
  //           total degree) is exactly 2 — its anchor link plus one mesh link — its mesh link
  //           flips (mesh partner -> portal) if that partner is just as close, or closer, to
  //           whatever comes right after this portal in the walk: i.e. this portal wasn't
  //           really "on the way". Rather than also flipping its anchor link, the portal is
  //           instead relocated in the WALK/DISPLAY order only (thisplugin.displayOrderGuids —
  //           see above), to wherever in the whole walk adds the least extra distance
  //           (cheapest insertion), while never landing after a portal that throws a link at
  //           it — see computeDistanceOrderReordering for the details.
  // ALGO ("Algorithm", no automatic override) still exists internally as the target of a full
  // "Reset link orders" (Task List), but the menu button no longer cycles through it — it
  // toggles only between KEYS and DISTANCE, which default to DISTANCE ("Less walking").
  thisplugin.linkOrderModeENUM = { ALGO: 0, KEYS: 1, DISTANCE: 2 };
  thisplugin.linkOrderMode = thisplugin.linkOrderModeENUM.DISTANCE;
  // Set whenever something invalidates the active optimization (anchor/order/geometry change)
  // so the next updateLayer() run recomputes it. Never set for a single manual flip via the
  // Task List ↔ button — that's meant to stick until the user re-optimizes on purpose.
  // Starts true so the default DISTANCE mode computes as soon as the very first plan exists.
  thisplugin._linkOrderRecomputePending = true;

  // Set whenever the portal set itself just changed (a new/edited polygon replaced the
  // previous one — see the lastPlanSignature check in updateLayer()), so the next
  // updateLayer() run schedules a search for whichever anchor/direction reuses the most links
  // already thrown in-game for our own faction, instead of keeping whatever anchor/direction
  // happened to be selected before. Never set for anything else (order changes, zoom, link
  // flips, ...) — this search tries every portal in the polygon(s) as anchor (hull or not) in
  // both directions, so it's deliberately reserved for an actual new polygon rather than every
  // recalculation.
  thisplugin._orientationSearchPending = false;

  // While no own-faction link joins two portals of the plan, the search has nothing to reuse and
  // is skipped, then retried on the next recalculations — only until this timestamp (set when the
  // portal set changes), so it covers links still loading in, not links thrown later while playing.
  thisplugin.ORIENTATION_SEARCH_RETRY_MS = 60000;
  thisplugin._orientationSearchRetryUntil = 0;

  // Longest the search may keep trying candidates (it tries the most promising ones first, and
  // stops early once a candidate reuses every existing link).
  thisplugin.ORIENTATION_SEARCH_BUDGET_MS = 8000;

  // How long the portal set must stay unchanged before the search starts, and how long it works
  // at a stretch before handing control back to the browser.
  thisplugin.ORIENTATION_SEARCH_START_DELAY_MS = 1000;
  thisplugin.ORIENTATION_SEARCH_SLICE_MS = 30;

  // Identifies the scheduled/running search: bumped by cancelOrientationSearch(), which makes any
  // older search stop at its next slice and discard its result.
  thisplugin._orientationSearchToken = 0;
  thisplugin._orientationSearchTimer = null;

  // The walk/display order: thisplugin.sortedFanpoints reordered per thisplugin.displayOrderGuids
  // (the "Less walking" relocation — see above), or thisplugin.sortedFanpoints itself unchanged
  // if there's no active relocation, or if displayOrderGuids no longer matches the current plan
  // (stale guid set, wrong length, or a non-anchor first entry). Use this — never
  // thisplugin.sortedFanpoints directly — for anything that only cares about the sequence a
  // player actually walks: Task List rows/positions, on-map position numbers, the "Path"
  // preview, Google Maps navigation, Portal Route stops, bookmark order. The core algorithm
  // itself, and anything about which links/fields exist, must keep using thisplugin.sortedFanpoints.
  thisplugin.getDisplayOrder = function () {
    var sorted = thisplugin.sortedFanpoints || [];
    var guids = thisplugin.displayOrderGuids;
    if (!guids || guids.length !== sorted.length) return sorted;

    var byGuid = {};
    sorted.forEach(function (fp) { byGuid[fp.guid] = fp; });

    var reordered = [];
    for (var i = 0; i < guids.length; i++) {
      var fp = byGuid[guids[i]];
      if (!fp) return sorted; // stale guid set (plan changed since) — ignore it
      reordered.push(fp);
    }
    if (reordered[0].guid !== thisplugin.startingpointGUID) return sorted; // anchor must stay first

    return reordered;
  };

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

        console.log('Fanfields3: removed BOOKMARKS portal (' + bkmrkData.id_bookmark + ' situated in ' + bkmrkData.id_folder + ' folder)');
      }
    });


    let type = "folder";
    let label = 'Fanfields3';
    // Add new folder in the localStorage
    let folder_ID = window.plugin.bookmarks.generateID();
    window.plugin.bookmarks.bkmrksObj.portals[folder_ID] = {
      'label': label,
      'state': 1,
      'bkmrk': {}
    };

    window.plugin.bookmarks.saveStorage();
    window.plugin.bookmarks.refreshBkmrks();
    window.runHooks('pluginBkmrksEdit', {
      'target': type,
      'action': 'add',
      'id': folder_ID
    });
    console.log('Fanfields3: added BOOKMARKS ' + type + ' ' + folder_ID);

    thisplugin.addPortalBookmark = function (guid, latlng, label, folder_ID) {
      var bookmark_ID = window.plugin.bookmarks.generateID();

      // Add bookmark in the localStorage
      window.plugin.bookmarks.bkmrksObj.portals[folder_ID].bkmrk[bookmark_ID] = {
        'guid': guid,
        'latlng': latlng,
        'label': label
      };

      window.plugin.bookmarks.saveStorage();
      window.plugin.bookmarks.refreshBkmrks();
      window.runHooks('pluginBkmrksEdit', {
        'target': 'portal',
        'action': 'add',
        'id': bookmark_ID,
        'guid': guid
      });
      console.log('Fanfields3: added BOOKMARKS portal ' + bookmark_ID);
    }

    // loop again: ordered(!) to add them as bookmarks — the walk order, relocations included
    thisplugin.getDisplayOrder().forEach(function (point, index) {
      if (point.guid) {
        var p = window.portals[point.guid];
        var ll = p.getLatLng();

        //plugin.bookmarks.addPortalBookmark(point.guid, ll.lat+','+ll.lng, p.options.data.title);
        thisplugin.addPortalBookmark(point.guid, ll.lat + ',' + ll.lng, p.options.data.title, folder_ID)
      }
    });
  };

  thisplugin.updateStartingPoint = function (i) {
    // Stepping through the hull by hand means giving up whichever anchor was pinned —
    // manually or by the auto-orientation search — otherwise the pin would just fight the
    // cycle buttons on the very next recalculation.
    thisplugin.cancelOrientationSearch();
    thisplugin.forcedAnchorGUID = null;
    thisplugin.forcedAnchorIsManual = false;

    thisplugin.startingpointIndex = i;
    thisplugin.startingpointGUID = thisplugin.perimeterpoints[thisplugin.startingpointIndex][0];
    thisplugin.startingpoint = this.fanpoints[thisplugin.startingpointGUID];

    // Reset manual order and link flips because the start/anchor changed (ghi#23)
    thisplugin.manualOrderGuids = null;
    thisplugin.manualLinkFlips = {};
    thisplugin.relocatedForLessWalkingGuids = {};
    thisplugin.displayOrderGuids = null;
    thisplugin.requestLinkOrderRecompute();

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

  // Manually force any portal currently in the plan to become the anchor — hull or not.
  // Unlike a DrawTools marker, this doesn't require a pixel-exact snap: it directly pins
  // thisplugin.forcedAnchorGUID, which updateLayer() applies on every recalculation (see the
  // "forcedAnchorGUID" block there). Returns false without doing anything if the portal isn't
  // part of the current plan (outside the drawn polygon(s), or excluded by Bookmarks-only).
  thisplugin.setAnchorByGuid = function (guid) {
    if (!guid || !thisplugin.fanpoints || !(guid in thisplugin.fanpoints)) return false;

    thisplugin.cancelOrientationSearch();
    thisplugin.forcedAnchorGUID = guid;
    thisplugin.forcedAnchorIsManual = true;

    // Reset manual order and link flips because the start/anchor changed (ghi#23), same as
    // cycling via updateStartingPoint.
    thisplugin.manualOrderGuids = null;
    thisplugin.manualLinkFlips = {};
    thisplugin.relocatedForLessWalkingGuids = {};
    thisplugin.displayOrderGuids = null;
    thisplugin.requestLinkOrderRecompute();

    thisplugin.updateLayer();
    return true;
  };

  // "Pick anchor" sidebar button: toggles whether the next portal click on the map sets that
  // portal as the anchor (see the portalSelected hook in setup()).
  thisplugin.toggleAnchorPicking = function () {
    thisplugin.isPickingAnchor = !thisplugin.isPickingAnchor;
    thisplugin.updateAnchorPickingButton();
  };

  thisplugin.updateAnchorPickingButton = function () {
    $('#plugin_fanfields3_pickanchor_btn, #fanfieldPickAnchorButton')
      .toggleClass('plugin_fanfields3_active', thisplugin.isPickingAnchor);
  };

  thisplugin.helpDialogWidth = 650;

  thisplugin.help = function () {
    let width = thisplugin.helpDialogWidth;
    thisplugin.MaxDialogWidth = thisplugin.getMaxDialogWidth();
    if (thisplugin.MaxDialogWidth < thisplugin.helpDialogWidth) {
      width = thisplugin.MaxDialogWidth;
    }
    dialog({
      html: '<p><b>Select portals</b><br>' +
        'Using Drawtools, draw one or more polygons around the portals you want to work with. ' +
        'Polygons can overlap each other or be completely separated. All portals within the polygons ' +
        'count toward your planned fanfield. ' +
        'Optional: toggle <i>🔖&nbsp;Bookmarks only</i> to restrict the selection to your bookmarked portals.</p>' +

        '<p><b>Show the plan</b><br>' +
        'From the layer selector, enable the Fanfields layers (Links / Fields / Numbers). ' +
        'The fanfield is calculated and shown as red links/fields on the intel. ' +
        'Link directions can be indicated with dashed stubs at the origin portal — toggle <i>Show&nbsp;link&nbsp;dir</i> as needed.</p>' +

        '<p><b>Choose the anchor (start portal)</b><br>' +
        'By default, the script selects an anchor portal from the convex hull of all selected portals. ' +
        'Use the Cycle&nbsp;Start buttons to step through hull portals (previous/next). ' +
        'To force an inside portal as anchor (totally legitimate), place a Drawtools marker snapped onto that portal, ' +
        'then cycle until it becomes the anchor.</p>' +

        '<p><b>Build mode: inbounding / outbounding</b><br>' +
        'A fanfield can be done <i>inbounding</i> by farming many keys at the anchor and linking <i>to</i> it from all other portals. ' +
        'It can also be done <i>outbounding</i> by star-linking <i>from</i> the anchor until the maximum number of outgoing links is reached. ' +
        'In outbounding mode you can set how many SBUL you plan to use (0–4) to calculate the outgoing link capacity.</p>' +

        '<p><b>Avoid blockers</b><br>' +
        'If you need to plan around links you cannot or do not want to destroy, use <i>Respect&nbsp;Intel</i>. ' +
        'Choose which factions\' links are treated as blockers (NONE / ALL / ENL / RES / ENL &amp; MAC / RES &amp; MAC / MAC). ' +
        'The plan avoids crossing those currently visible intel links — nothing else changes, even when the selected mode includes your own faction.</p>' +

        '<p><b>Blockers</b><br>' +
        'Every visible link that crosses a link of the plan still to be thrown, and whose faction <i>Respect&nbsp;Intel</i> does not avoid, is a blocker (with Respect&nbsp;Intel on NONE, that is every crossing link; your own faction\'s links count too when it is not selected). ' +
        'With <i>Blockers</i> on (the default), blockers are drawn as red dotted lines and the Task List gets <i>Destroy</i> rows: portals to neutralize so that the blockers are gone before the link they block is thrown. ' +
        'A portal that frees several links at once is preferred over several separate portals whenever it costs less walking, and each row is slotted into the walk where it adds the least detour, never later than the first link it unblocks. ' +
        'An enemy portal the plan captures anyway is marked with a cross when its capture frees a link in time; when the walk reaches it too late, it gets a <i>Destroy</i> row earlier on, and is captured later on the walk as usual. ' +
        '<i>Max&nbsp;detour</i> (100&nbsp;m, 200&nbsp;m, 500&nbsp;m, 1&nbsp;km or no limit) caps the extra walk of a single Destroy stop; blockers that cannot be freed within it are listed under the Task List. ' +
        'Turning <i>Blockers</i> off only removes these rows. A link of your own faction can only be broken with a Jarvis/ADA flip, or by changing <i>Respect&nbsp;Intel</i>.</p>' +

        '<p><b>Order & route planning</b><br>' +
        'Switch between <i>Clockwise</i> and <i>Counterclockwise</i> order to find an easier route or squeeze out extra fields. ' +
        'For fine control, open <i>Manage Portal Order</i> and drag &amp; drop portals to customise your visit order. ' +
        'Use <i>Path</i> to preview a straight-line route along the current portal sequence.</p>' +

        '<p><b>Optim (link order)</b><br>' +
        'The <i>Optim</i> button reorients some links (never the algorithm itself — which links exist, which fields form, stays the same): each click cycles between its two modes, shown in the button label. ' +
        '<i>Fewer&nbsp;keys</i> tries to lower the highest key count on any single portal. ' +
        '<i>Less&nbsp;walking</i> flips a 2-link portal\'s mesh link when it isn\'t really on the way to the next stop, and relocates that portal earlier in the visit order, right where it best fits between two portals already walked back-to-back — such relocated portals are highlighted green in the Task List as a reminder to capture them (and gather enough of their own keys) early. ' +
        'Switching mode always restarts the calculation clean, from the untouched algorithm — either mode is only a starting point, and you can still flip individual links, or reorder portals, afterwards as usual. ' +
        'To drop every automatic and manual override at once and go back to the plain algorithm, use the Task List\'s <i>Reset&nbsp;link&nbsp;orders</i> button.</p>' +

        '<p><b>Freeze recalculation</b><br>' +
        'The plan locks itself as soon as a new plan is completely calculated (including the automatic anchor search), so it no longer moves while you pan, zoom or the map data refreshes. ' +
        'Changing something about the plan itself — a menu option, the drawn polygon, a map layer — recalculates it and locks it again. ' +
        'Use <i>🔒&nbsp;Locked</i> to prevent the script from recalculating the plan while you zoom into details or work with large areas. ' +
        'The Task List keeps reflecting portal captures and links thrown in-game while locked — only the plan itself (link/field order) stays frozen. ' +
        'Switch back to <i>🔓&nbsp;Unlocked</i> to let the plan itself refresh again.</p>' +

        '<p><b>Task list & exports</b><br>' +
        'Open <i>Task List</i> to get a step-by-step plan including per-portal key requirements, outgoing link counts, and (optional) link details. ' +
        'If you use a Keys/LiveInventory plugin, the task list can also show your available key counts. ' +
        'The task list includes a navigation link for Google Maps and a print-friendly view. ' +
        'You can also export the plan to Drawtools/Bookmarks to share or continue working with it.</p>' +

        '<hr noshade>' +

        '<p>Found a bug? Post your issues at GitHub:<br>' +
        '<a href="https://github.com/Avataar120/fanfields3/issues">https://github.com/Avataar120/fanfields3/issues</a></p>',
      id: 'plugin_fanfields3_alert_help',
      title: 'Fan Fields 3 - Help',
      width: width,
      closeOnEscape: true
    });
  };




  // Statistics dialog: build the HTML for the current plan. Used both to open the dialog and
  // to refresh it live (see thisplugin.refreshStatisticsIfOpen) as the background plan changes.
  thisplugin.buildStatisticsHTML = function () {
    if (!thisplugin.sortedFanpoints || thisplugin.sortedFanpoints.length <= 3) {
      return '<p>No Fanfield plan calculated yet.<br>Draw a polygon and let Fanfields calculate first.</p>';
    }

    var totalLinks = thisplugin.donelinks.length;
    var validLinks = (thisplugin.validLinkCount !== undefined) ? thisplugin.validLinkCount : totalLinks;
    var totalFields = thisplugin.triangles.length;
    var validFields = (thisplugin.validTriangleCount !== undefined) ? thisplugin.validTriangleCount : totalFields;

    var linksText = (validLinks !== totalLinks) ? (validLinks + ' / ' + totalLinks) : validLinks.toString();
    var fieldsText = (validFields !== totalFields) ? (validFields + ' / ' + totalFields) : validFields.toString();

    var warn = '';
    if (validLinks !== totalLinks || validFields !== totalFields) {
      warn = '<tr><td colspan="2"><span class="plugin_fanfields3_warn">⚠ Under-field invalid links excluded from counts</span></td></tr>';
    }

    return '<table><tr><td>FanPortals:</td><td>' + (thisplugin.n - 1) + '</td><tr>' +
      '<tr><td>CenterKeys:</td><td>' + thisplugin.centerKeys + '</td><tr>' +
      '<tr><td>Total links / keys:</td><td>' + linksText + '</td><tr>' +
      '<tr><td>Fields:</td><td>' + fieldsText + '</td><tr>' +
      '<tr><td>Build AP (links and fields):</td><td>' + (validLinks * 313 + validFields * 1250).toString() + '</td><tr>' +
      warn +
      '</table>';
  };

  // Whether the Statistics dialog is currently open and visible.
  thisplugin.isStatisticsDialogOpen = function () {
    return $('#plugin_fanfields3_statistics_inner').is(':visible');
  };

  // Rebuild the Statistics dialog's content in place. Used to auto-refresh live as the
  // background plan changes (new links appearing in-game, fan field rotation, etc.), mirroring
  // thisplugin.refreshTaskListDialog for the Task List.
  thisplugin.refreshStatisticsDialog = function () {
    $('#plugin_fanfields3_statistics_inner').html(thisplugin.buildStatisticsHTML());
  };

  // Called after every plan recalculation (see updateLayer) so an open Statistics dialog
  // reflects the latest counts without the user having to close and reopen it.
  thisplugin.refreshStatisticsIfOpen = function () {
    if (thisplugin.isStatisticsDialogOpen()) {
      thisplugin.refreshStatisticsDialog();
    }
  };

  thisplugin.showStatistics = function () {
    if (!thisplugin.sortedFanpoints || thisplugin.sortedFanpoints.length <= 3) return;

    var width = 400;
    thisplugin.MaxDialogWidth = thisplugin.getMaxDialogWidth();
    if (thisplugin.MaxDialogWidth < width) {
      width = thisplugin.MaxDialogWidth;
    }

    var isMobile = L && L.Browser && L.Browser.mobile;

    // Mobile: the Stats button lives in IITC's own sidebar/info pane, which covers the whole
    // screen there — switch back to the map pane first so the dialog opened below shows over
    // the map, not over the (now pointless) sidebar.
    if (isMobile && typeof window.show === 'function') {
      window.show('map');
    }

    // draggable is already IITC's own default for a non-modal window.dialog() (see
    // core/code/dialog.js) — not something this plugin needs to (or can usefully) turn on.
    dialog({
      html: '<div id="plugin_fanfields3_statistics_inner">' + thisplugin.buildStatisticsHTML() + '</div>',
      id: 'plugin_fanfields3_alert_statistics',
      title: 'Fan Fields 3 - Statistics',
      width: width,
      closeOnEscape: true
    });

    // Mobile: pin to the bottom of the screen instead of jQuery UI's default vertical
    // centering, so the dialog doesn't sit over the middle of the map where the portals are.
    // IITC's window.dialog() prefixes the id we pass with "dialog-" for the actual jQuery UI
    // element (see addTaskListShiftButtons) — '#plugin_fanfields3_alert_statistics' alone
    // matches nothing.
    if (isMobile) {
      $('#dialog-plugin_fanfields3_alert_statistics')
        .dialog('option', 'position', { my: 'bottom', at: 'bottom-15', of: window });
    }
  }

  thisplugin.exportDrawtools = function () {
    var alatlng, blatlng, layer;
    $.each(thisplugin.sortedFanpoints, function (index, portal) {
      $.each(portal.outgoing, function (targetIndex, targetPortal) {

        var meta = (portal.outgoingMeta && portal.outgoingMeta[targetPortal.guid]) ? portal.outgoingMeta[targetPortal.guid] : null;
        if (meta && meta.invalidUnderField) return;

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

        var meta = (portal.outgoingMeta && portal.outgoingMeta[targetPortal.guid]) ? portal.outgoingMeta[targetPortal.guid] : null;
        if (meta && meta.invalidUnderField) return;
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

    // Compat: window.map.flyTo is not available on all IITC builds (desktop). Fall back to
    // a plain setView, which every build supports.
    if (typeof window.map.flyTo === 'function') {
      window.map.flyTo(latlng, map.getZoom());
    } else {
      window.map.setView(latlng, map.getZoom());
    }

    // Mobile: the Task List covers most of the screen, so center the map on the portal, select
    // it (highlight ring on the map, without opening the details pane) and close the list.
    // Desktop keeps the list open and shows the portal details.
    if (L && L.Browser && L.Browser.mobile) {
      if (window.portals[guid]) {
        if (typeof window.selectPortal === 'function') window.selectPortal(guid);
        else window.renderPortalDetails(guid);
      } else {
        window.urlPortal = guid;
      }
      $('#plugin_fanfields3_exportText_inner')
        .closest('.ui-dialog-content')
        .dialog('close');
      return;
    }

    if (window.portals[guid]) window.renderPortalDetails(guid);
    else window.urlPortal = guid;
  }


  thisplugin.isCompatiblePortalRoutePlugin = function () {
    var routePlugin = window.plugin && window.plugin.portalRoute;
    if (!routePlugin) return false;
    if (typeof routePlugin.replaceStops === 'function') return true;
    return (typeof routePlugin.clearStops === 'function' && typeof routePlugin.addStop === 'function');
  };

  thisplugin.getPortalRoutePlugin = function () {
    return thisplugin.isCompatiblePortalRoutePlugin()
      ? window.plugin.portalRoute
      : null;
  };

  thisplugin.getPortalRouteStops = function () {
    var blockerPlan = thisplugin.computeBlockerPlan();
    var stops = [];

    function addStop(guid, point) {
      var latlng = map.unproject(point, thisplugin.PROJECT_ZOOM);
      stops.push({
        guid: guid || null,
        title: thisplugin.getPortalTitleByGuid(guid),
        lat: latlng.lat,
        lng: latlng.lng
      });
    }

    thisplugin.getDisplayOrder().forEach(function (portal, index) {
      blockerPlan.stops.forEach(function (stop) {
        if (stop.slot === index) addStop(stop.guid, stop.point);
      });
      addStop(portal.guid, portal.point);
    });
    return stops;
  };

  thisplugin.routeWithPortalRoute = function () {
    var routePlugin = thisplugin.getPortalRoutePlugin();

    if (!routePlugin) {
      var anyRoutePlugin = thisplugin.getAnyPortalRoutePlugin();
      dialog({
        html: anyRoutePlugin
          ? '<p>Portal Route is loaded, but does not expose a compatible route import function.</p>'
          : '<p>Portal Route is not loaded.</p>',
        id: anyRoutePlugin ? 'plugin_fanfields3_alert_portal_route_incompatible' : 'plugin_fanfields3_alert_portal_route_missing',
        title: 'Fan Fields 3 - Portal Route',
        width: anyRoutePlugin ? 400 : 350,
        closeOnEscape: true
      });
      return;
    }

    var stops = thisplugin.getPortalRouteStops();
    if (!stops.length) return;

    if (typeof routePlugin.replaceStops === 'function') {
      routePlugin.replaceStops(stops, { openPanel: true, clearRoute: true });
      return;
    }

    if (typeof routePlugin.clearStops === 'function' && typeof routePlugin.addStop === 'function') {
      routePlugin.clearStops();
      stops.forEach(function (stop) {
        routePlugin.addStop(stop);
      });

      if (routePlugin.state) routePlugin.state.panelOpen = true;
      if (typeof routePlugin.savePanelOpen === 'function') routePlugin.savePanelOpen();
      if (typeof routePlugin.renderPanel === 'function') routePlugin.renderPanel();
      if (typeof routePlugin.showMessage === 'function') {
        routePlugin.showMessage('Imported ' + stops.length + ' Fan Fields stops.');
      }
      return;
    }

    dialog({
      html: '<p>Portal Route is loaded, but does not expose a compatible route import function.</p>',
      id: 'plugin_fanfields3_alert_portal_route_incompatible',
      title: 'Fan Fields 3 - Portal Route',
      width: 400,
      closeOnEscape: true
    });
  };

  thisplugin.getPortalTitleByGuid = function (guid) {
    var marker = guid ? window.portals[guid] : undefined;
    return (marker && marker.options && marker.options.data && marker.options.data.title) || 'unknown title';
  };

  // "Portal A - Portal B (RES)" for a blocking link.
  thisplugin.describeBlockerLink = function (blocker) {
    var teamLabel = '';
    if (blocker.team === window.TEAM_ENL) teamLabel = 'ENL';
    else if (blocker.team === window.TEAM_RES) teamLabel = 'RES';
    else if (blocker.team === window.TEAM_MAC) teamLabel = 'MAC';

    return window.escapeHtmlSpecialChars(thisplugin.getPortalTitleByGuid(blocker.guidA)) + ' &harr; ' +
      window.escapeHtmlSpecialChars(thisplugin.getPortalTitleByGuid(blocker.guidB)) +
      (teamLabel ? ' (' + teamLabel + ')' : '');
  };

  // Task List: the row (and its expandable list of freed links) for one extra Destroy
  // stop of the blocker plan. Also adds the stop to the Google Maps route.
  thisplugin.buildBlockerStopHTML = function (stop, gmStops) {
    var latlng = map.unproject(stop.point, thisplugin.PROJECT_ZOOM);
    var lat = Math.round(latlng.lat * 10000000) / 10000000;
    var lng = Math.round(latlng.lng * 10000000) / 10000000;
    var rawTitle = thisplugin.getPortalTitleByGuid(stop.guid);
    var title = window.escapeHtmlSpecialChars(rawTitle);
    var guid = stop.guid || '';
    var toggleId = 'plugin_fanfields3_exportText_blk_' + String(stop.guid || stop.key).replace(/[^\w-]/g, '_');
    var action = 'Destroy';
    var ownTeam = thisplugin.getOwnFactionTeam();
    var needsJarvis = stop.blockers.some(function (blocker) { return blocker.team === ownTeam; });

    gmStops.push(lat + ',' + lng);

    var rowTitle = 'Free ' + stop.blockers.length + ' blocking link(s) before the links they block are thrown here. Adds about ' +
      thisplugin.formatDistance(stop.detour) + ' of walking.' +
      (needsJarvis ? ' Includes a link of your own faction: it needs a Jarvis/ADA flip.' : '');

    var text = '<tbody class="plugin_fanfields3_exportText_Portal"><tr class="plugin_fanfields3_blocker_row" title="' + rowTitle + '">';
    text += '<td>&#10006;</td>';
    text += '<td>';
    text += '  <label class="plugin_fanfields3_exportText_Label" for="' + toggleId + '">' + action + '</label>';
    text += '  <input type="checkbox" id="' + toggleId + '" data-guid="blk_' + (stop.guid || stop.key) + '" plugin_fanfields3_exportText_toggle="toggle">';
    text += '</td>';
    text += '<td></td>';
    text += '<td>';
    text += '  <a class="plugin_fanfields3_exportText_print" href="https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lng + '" target="_blank">' + title + '</a>';
    text += '  <a class="plugin_fanfields3_exportText_ui" onclick="window.plugin.fanfields.flyToPortal({lat: ' + lat + ', lng: ' + lng + "}, '" + guid + "'); return false;" + '">' + title + '</a>';
    text += '<br><span class="plugin_fanfields3_italic">(frees ' + stop.blockers.length + ')</span>';
    text += '</td>';
    text += '<td></td><td></td><td></td>';
    text += '</tr></tbody>\n';

    text += '<tbody class="plugin_fanfields3_exportText_LinkDetails plugin_fanfields3_italic" hidden>';
    stop.blockers.forEach(function (blocker) {
      text += '<tr><td></td><td>Frees</td><td></td><td>' + thisplugin.describeBlockerLink(blocker) +
        (blocker.team === ownTeam ? ' &ndash; own faction, needs a Jarvis' : '') +
        '</td><td></td><td>blocks ' + blocker.blocked.length + '</td><td></td></tr>\n';
    });
    text += '</tbody>\n';
    return text;
  };

  // Task List: build the HTML for the current plan. Used both to open the dialog and to
  // refresh it live (see thisplugin.refreshTaskListIfOpen) as the background plan changes.
  thisplugin.buildTaskListHTML = function () {
    var text = '<table><thead><tr>';
    let fieldSymbol = '&#9650;';

    text += '<th style="text-align:right">Pos.</th>';
    text += '<th style="text-align:right">Action</th>';
    text += '<th style="width:20px;"></th>';
    text += '<th style="text-align:left">Portal Name</th>';
    if (window.plugin.keys || window.plugin.LiveInventory) {
      text += '<th title="own/need" style="min-width:80px;">'
        + '<span class="plugin_fanfields3_exportText_print">Keys (owned/needed)</span>'
        + '<span class="plugin_fanfields3_exportText_ui">Keys</span>'
        + '</th>';
    } else {
      text += '<th>Keys</th>';
    }
    text += '<th title="still to throw">Links</th>';
    text += '<th>Fields</th>';

    text += '</tr></thead><tbody>';

    // Stops (lat,lng) for the Google Maps route, in walk order; the URL itself is built once
    // the whole list is known, since on mobile it may have to be cut short.
    var gmStops = [];

    // The walk order (relocations from "Less walking" included) — never sortedFanpoints
    // directly, which is the algorithm's own BUILD order and must stay untouched by display.
    var displayOrder = thisplugin.getDisplayOrder();

    // Blockers: extra Destroy rows slotted into the walk (see computeBlockerPlan).
    var blockerPlan = thisplugin.computeBlockerPlan();

    displayOrder.forEach(function (portal, index) {
      blockerPlan.stops.forEach(function (stop) {
        if (stop.slot === index) text += thisplugin.buildBlockerStopHTML(stop, gmStops);
      });

      var p, lat, lng;
      var latlng = map.unproject(portal.point, thisplugin.PROJECT_ZOOM);
      lat = Math.round(latlng.lat * 10000000) / 10000000
      lng = Math.round(latlng.lng * 10000000) / 10000000
      p = portal.portal;
      // window.portals[portal.guid];

      let rawTitle = 'unknown title';
      if (p !== undefined && p.options && p.options.data && p.options.data.title) {
        rawTitle = p.options.data.title;
      }

      let title = window.escapeHtmlSpecialChars(rawTitle);
      let uriTitle = encodeURIComponent(rawTitle);

      // Volatile Scout Controlled portal (ornament 'sc5_p'): scanning it awards 3 scout
      // control points instead of 1 — worth flagging next to the name as a reminder to scan it.
      let ornaments = (p !== undefined && p.options && p.options.data && p.options.data.ornaments) ? p.options.data.ornaments : [];
      let isVolatileScoutPortal = ornaments.indexOf('sc5_p') !== -1;

      // Is this portal already ours? If not (neutral, enemy faction, or Machina), it has
      // to be captured before anything else here matters. A portal not yet loaded from
      // the server (p undefined, or no team data) is treated the same as "not ours". Even
      // when it's already ours, fewer than 8 resonators means it's not fully secured yet,
      // so it still needs (re)capturing.
      var ownTeam = thisplugin.getOwnFactionTeam();
      var portalTeam = thisplugin.getPortalTeam(p);
      var portalResCount = (p !== undefined && p.options && p.options.data) ? p.options.data.resCount : undefined;
      var portalOwnedByUs = ownTeam !== undefined && portalTeam === ownTeam;
      var portalFullyResonated = portalResCount !== undefined && portalResCount >= 8;
      var needsCapture = !portalOwnedByUs || !portalFullyResonated;

      // Outgoing links still to throw from here (already-made in-game links don't count,
      // when "Grey out done links" is on). Drives both the Action and the Links cell fade.
      var alreadyDoneOutgoingCount = 0;
      if (thisplugin.greyOutExistingLinks && portal.outgoing.length > 0) {
        portal.outgoing.forEach(function (outPortal) {
          var outMeta = portal.outgoingMeta && portal.outgoingMeta[outPortal.guid];
          var isInvalid = outMeta && outMeta.invalidUnderField;
          if (!isInvalid && thisplugin.isLinkInGame(portal.guid, outPortal.guid)) {
            alreadyDoneOutgoingCount++;
          }
        });
      }
      var totalOutgoingCount = (portal.outgoingValidCount !== undefined) ? portal.outgoingValidCount : portal.outgoing.length;
      var remainingOutgoingCount = totalOutgoingCount - alreadyDoneOutgoingCount;

      // Incoming links that already exist in-game don't need a key anymore: that key was
      // already spent to make the link. Subtract them from the portal's remaining key count.
      var alreadyLinkedIncomingCount = 0;
      if (thisplugin.greyOutExistingLinks && portal.incoming && portal.incoming.length > 0) {
        portal.incoming.forEach(function (srcPortal) {
          var srcMeta = srcPortal.outgoingMeta && srcPortal.outgoingMeta[portal.guid];
          var isInvalid = srcMeta && srcMeta.invalidUnderField;
          if (!isInvalid && thisplugin.isLinkInGame(srcPortal.guid, portal.guid)) {
            alreadyLinkedIncomingCount++;
          }
        });
      }

      var keysNeeded = ((portal.incomingValidCount !== undefined) ? portal.incomingValidCount : portal.incoming.length) - alreadyLinkedIncomingCount;

      let availableKeys = 0;
      let hasKeysPluginData = !!(window.plugin.keys || window.plugin.LiveInventory);
      let hasEnoughKeys = false;
      let keyColorAttribute = '';
      if (hasKeysPluginData) {

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

        hasEnoughKeys = availableKeys >= keysNeeded;
        keyColorAttribute = hasEnoughKeys ? 'plugin_fanfields3_enoughKeys' : 'plugin_fanfields3_notEnoughKeys';
      };

      // Keys plugin quick-set button: only for the actual "keys" plugin (its count can be
      // written to), never for LiveInventory (a read-only reflection of the real inventory).
      // Green check = click to mark "enough keys" (raises the keys plugin count to at least
      // keysNeeded). Red cross = already marked enough; click to reset that portal back to 0.
      // Its own state always reflects the keys plugin's own count for this portal, even when
      // LiveInventory is also installed and takes priority for the Keys column's own number.
      var keysSetButtonHtml = '';
      if (window.plugin.keys && keysNeeded > 0) {
        var ownKeysPluginCount = window.plugin.keys.keys[portal.guid] || 0;
        var hasEnoughKeysPluginOwn = ownKeysPluginCount >= keysNeeded;
        keysSetButtonHtml = ' <button type="button" class="plugin_fanfields3_keys_setbtn' +
          (hasEnoughKeysPluginOwn ? ' plugin_fanfields3_keys_full' : '') + '" data-guid="' + portal.guid + '"' +
          ' data-needed="' + keysNeeded + '"' +
          ' title="' + (hasEnoughKeysPluginOwn
            ? 'Reset keys plugin count to 0 for this portal'
            : 'Mark as enough keys (sets keys plugin count to at least ' + keysNeeded + ' for this portal)') +
          '">&#128273;</button>';
      }

      // Action for this portal: the next thing standing in the way of finishing it here,
      // checked in priority order. "Nothing" means it's fully wrapped up.
      // With a keys plugin, the keys already held settle it; without one, any key still
      // needed counts as outstanding since there's no way to know what's in the inventory.
      var needsKeys = hasKeysPluginData ? !hasEnoughKeys : keysNeeded > 0;
      var action = needsCapture ? 'Capture' : (remainingOutgoingCount > 0 ? 'Link' : (needsKeys ? 'Keys' : 'Nothing'));

      // Google Maps route: skip a portal with nothing left to do here — no point stopping
      // there again, and it only lengthens the route for everyone else on it.
      if (action !== 'Nothing') {
        gmStops.push(`${lat},${lng}`);
      }

      // A cell whose own number is already settled fades and strikes through on its own,
      // independently of what the portal's overall Action says.
      var linksCellDone = remainingOutgoingCount === 0;
      var keysCellDone = keysNeeded === 0 || (hasKeysPluginData && hasEnoughKeys);

      // "Less walking" relocated this portal earlier in the walk (see computeDistanceOrderFlips):
      // flag it so it's captured, with enough of its own keys gathered, ahead of schedule.
      let isRelocatedForLessWalking = !!(thisplugin.relocatedForLessWalkingGuids && thisplugin.relocatedForLessWalkingGuids[portal.guid]);

      // Both classes can apply at once (a portal with nothing left to do that was also
      // relocated): "relocated" is declared after "done" in the stylesheet, so its green color
      // wins over "done"'s faded yellow, while "done"'s strikethrough still applies.
      var portalRowClasses = [];
      if (action === 'Nothing') portalRowClasses.push('plugin_fanfields3_portal_done');
      if (isRelocatedForLessWalking) portalRowClasses.push('plugin_fanfields3_portal_relocated');
      var portalRowClass = portalRowClasses.join(' ');

      // Row start
      text += '<tbody class="plugin_fanfields3_exportText_Portal"><tr' + (portalRowClass ? ' class="' + portalRowClass + '"' : '') +
        (isRelocatedForLessWalking ? ' title="Relocated here by \'Less walking\': capture this portal and gather enough of its own keys by this point in the walk."' : '') +
        '>';
      // List Item Index (Pos.)
      text += '<td>' + (index) + '</td>';

      // Action

      text += '<td>';
      var onRouteBlockers = blockerPlan.onRoute[portal.guid];
      var onRouteTag = onRouteBlockers
        ? ' <span class="plugin_fanfields3_blocker_tag" title="Capturing this portal also frees ' + onRouteBlockers.length +
          ' blocking link(s) in time for the links planned later.">&#10006;</span>'
        : '';
      text += '  <label class="plugin_fanfields3_exportText_Label" for="plugin_fanfields3_exportText_' + portal.guid + '">' + action + onRouteTag + '</label>';
      text += '  <input type="checkbox" id="plugin_fanfields3_exportText_' + portal.guid + '" data-guid="' + portal.guid + '" plugin_fanfields3_exportText_toggle="toggle">';
      text += '</td>';

      // Spacer column (aligns with the flip-button column on link detail rows)
      text += '<td></td>';

      // Portal Name

      text += '<td>';
      const gmapsHref = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&query_destination_id=(${uriTitle})`;

      if (isVolatileScoutPortal) {
        text += '<span class="plugin_fanfields3_volatile_icon" title="Volatile Scout Controlled portal: scanning it awards 3 scout control points instead of 1">&#128247;</span> ';
      }

      // Two links are rendered:
      // - UI link: uses onclick to interact with IITC (flyToPortal)
      // - Print link: real href for PDF / printing
      // Visibility is controlled via CSS (@media print or print window styles)
      text += `  <a class="plugin_fanfields3_exportText_print" href="${gmapsHref}" target="_blank">${title}</a>`;
      text +=
        `  <a class="plugin_fanfields3_exportText_ui" onclick="window.plugin.fanfields.flyToPortal({lat: ${lat}, lng: ${lng}}, '${portal.guid}'); return false;">${title}</a>`;

      if (onRouteBlockers) {
        text += '<br><span class="plugin_fanfields3_italic plugin_fanfields3_blocker_tag">(frees ' + onRouteBlockers.length + ')</span>';
      }

      text += '</td>';

      // Keys
      text += '<td' + (keyColorAttribute ? ' ' + keyColorAttribute : '') +
        (keysCellDone ? ' class="plugin_fanfields3_cell_done"' : '') +
        (keysSetButtonHtml ? ' style="white-space:nowrap;"' : '') + '>' +
        (hasKeysPluginData ? availableKeys + '/' : '') + keysNeeded + keysSetButtonHtml + '</td>';
      // Links: how many outgoing links are still left to throw from here, not the portal's
      // total outgoing count — mirrors the Keys column, which already shows keys still needed
      // rather than the total incoming count.
      var linksTitle = (remainingOutgoingCount !== totalOutgoingCount)
        ? ' title="' + remainingOutgoingCount + ' still to throw, out of ' + totalOutgoingCount + ' total"'
        : '';
      text += '<td' + linksTitle + (linksCellDone ? ' class="plugin_fanfields3_cell_done"' : '') + '>' + remainingOutgoingCount + '</td>';

      let fieldsCreatedAtThisPortal = 0
      if (portal.outgoing.length > 0) {
        portal.outgoing.forEach(function (outPortal, outIndex) {
          let meta = portal.outgoingMeta?.[outPortal.guid];
          fieldsCreatedAtThisPortal += (meta && meta.fieldsCreatedValid !== undefined) ? meta.fieldsCreatedValid : (meta && meta.creatingFieldsWith ? meta.creatingFieldsWith.length : 0);
        });
      }
      // Fields: created by this portal's outgoing links, so once none are left to throw the
      // fields are settled too — fade and strike them through like the Links cell.
      text += '<td class="plugin_fanfields3_fieldsCell' + (linksCellDone ? ' plugin_fanfields3_cell_done' : '') +
        '" title="Fields created at this portal: ' +
        fieldsCreatedAtThisPortal + '">' + fieldSymbol.repeat(fieldsCreatedAtThisPortal) + '</td>';

      // Row End
      text += '</tr>';
      text += '</tbody>\n';
      if (portal.outgoing.length > 0) {
        // DetailBlock Start
        text += '<tbody class="plugin_fanfields3_exportText_LinkDetails plugin_fanfields3_italic" hidden>';
        portal.outgoing.forEach(function (outPortal, outIndex) {
          let distance = thisplugin.distanceTo(portal.point, outPortal.point);

          let meta = portal.outgoingMeta?.[outPortal.guid];

          // Link already exists in-game (own faction)? Fade & strike through the whole line.
          let linkDone = thisplugin.greyOutExistingLinks && thisplugin.isLinkInGame(portal.guid, outPortal.guid);

          // Row start
          let linkDetailText = '<tr' + (linkDone ? ' class="plugin_fanfields3_link_done"' : '') + '>';

          // List Item Index (Pos.) — the target's WALK position, not its build-order index.
          linkDetailText += '<td>' + (index) + '.' + displayOrder.indexOf(outPortal) + '</td>';

          // Action
          linkDetailText += '<td>';
          linkDetailText += 'Link to ' + displayOrder.indexOf(outPortal);
          if (meta && meta.invalidUnderField) {
            linkDetailText += ' <span class="plugin_fanfields3_warn" title="Cannot throw from under an existing field (limit ' + thisplugin.maxLinkUnderFieldDistance + 'm).">⚠</span>';
            if (meta.canFlipUnderField) {
              linkDetailText += ' <span class="plugin_fanfields3_warn" title="Workaround: may work if thrown from the opposite portal (requires keys).">↔</span>';
            }
          }
          linkDetailText += '</td>';

          // ghi#23 (link flip): swap this link's direction, in its own compact column. Excluded only
          // for a link already done in-game (nothing left to flip) — anchor (fan/star) links are flippable too.
          linkDetailText += '<td>';
          if (!linkDone) {
            var isFlipped = thisplugin.isLinkFlipped(portal.guid, outPortal.guid);
            linkDetailText += '<button class="plugin_fanfields3_link_flip_btn' + (isFlipped ? ' plugin_fanfields3_link_flipped' : '') +
              '" data-guid-a="' + portal.guid + '" data-guid-b="' + outPortal.guid + '" title="' +
              (isFlipped ? 'Manually flipped – click to restore automatic direction' : 'Reverse link direction (updates keys needed)') +
              '">&#8646;</button>';
          }
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
          linkDetailText += '<td>' + thisplugin.formatDistance(distance) + '</td>';
          // Fields
          let fieldsCreatedByThisLink = (meta && meta.fieldsCreatedValid !== undefined) ? meta.fieldsCreatedValid : (meta && meta.creatingFieldsWith ? meta.creatingFieldsWith.length : 0);

          linkDetailText += '<td class="plugin_fanfields3_fieldsCell" title="Fields created by this link: ' +
            fieldsCreatedByThisLink + '">' + fieldSymbol.repeat(fieldsCreatedByThisLink) + '</td>';

          // Row End
          linkDetailText += '</tr>\n';
          text += linkDetailText;
        });
        text += '</tbody>\n';
      } // end if portal.outgoing.length > 0
    });
    text += '</tbody></table>';
    if (window.plugin.keys || window.plugin.LiveInventory) {
      text += '<br><div plugin_fanfields3_enoughKeys>Adjust available keys using your keys plugin.</div>';
    };

    if (blockerPlan.stops.length || blockerPlan.unresolved.length) {
      text += '<div class="plugin_fanfields3_blocker_summary">';
      if (blockerPlan.stops.length) {
        text += '&#10006; ' + blockerPlan.blockers.length + ' blocking link(s), ' + blockerPlan.stops.length +
          ' extra stop(s), about +' + thisplugin.formatDistance(blockerPlan.extraDistance) + ' of walking.';
      }
      if (blockerPlan.unresolved.length) {
        text += '<div class="plugin_fanfields3_warn">&#9888; ' + blockerPlan.unresolved.length +
          ' blocking link(s) left alone (every way to free them needs more than the maximum detour): ' +
          blockerPlan.unresolved.map(function (blocker) { return thisplugin.describeBlockerLink(blocker); }).join('; ') + '</div>';
      }
      text += '</div>';
    }
    text += '<hr noshade>';

    // On mobile, only the next stops still to do are sent (see GOOGLE_MAPS_MAX_STOPS_MOBILE);
    // as portals get done they drop out of gmStops, so reopening the link moves the route on.
    var gmStopsTotal = gmStops.length;
    var gmStopsUsed = (L && L.Browser && L.Browser.mobile) ? gmStops.slice(0, thisplugin.GOOGLE_MAPS_MAX_STOPS_MOBILE) : gmStops;
    var gmnav = 'http://maps.google.com/maps/dir/' + gmStopsUsed.map(function (s) { return s + '/'; }).join('') + '&nav=1';
    var gmnavLabel = 'Navigate with Google Maps' +
      (gmStopsUsed.length < gmStopsTotal ? ' (next ' + gmStopsUsed.length + ' of ' + gmStopsTotal + ' stops)' : '');

    let flipCount = Object.keys(thisplugin.manualLinkFlips || {}).length;
    text += '<div style="margin-top:10px; text-align:right;">' +
      '  <button id="plugin_fanfields3_reset_link_flips_btn"' + (flipCount === 0 ? ' disabled' : '') +
      '    title="Revert all manually flipped links (' + flipCount + ') back to automatic calculation">Reset link orders</button> ' +
      '  <button id="plugin_fanfields3_export_pdf_btn">Print</button>' +
      '</div>';

    text += '<div style="margin-top:10px;">';
    if (thisplugin.isCompatiblePortalRoutePlugin()) {
      text += '<a id="plugin_fanfields3_portal_route_link" href="#">Route with Portal Route</a><br>';
    }
    
    text += '<a target="_blank" href="' + gmnav + '">' + gmnavLabel + '</a>';
    text += '</div>';

    return text;
  }; // end buildTaskListHTML

  // ghi#23 (link flip): remember which portals' link-detail lists are expanded, so a
  // refresh (flip/reset, or a live background update) doesn't visually collapse the
  // dialog back to its default state.
  thisplugin.getTaskListExpandedGuids = function () {
    var guids = [];
    $('#plugin_fanfields3_exportText_inner [plugin_fanfields3_exportText_toggle="toggle"]:checked')
      .each(function () {
        var guid = $(this).attr('data-guid');
        if (guid) guids.push(guid);
      });
    return guids;
  };

  thisplugin.restoreTaskListExpandedGuids = function (guids) {
    var $inner = $('#plugin_fanfields3_exportText_inner');
    guids.forEach(function (guid) {
      var $toggle = $inner.find('[plugin_fanfields3_exportText_toggle="toggle"][data-guid="' + guid + '"]');
      if (!$toggle.length) return;
      $toggle.prop('checked', true);
      $toggle.parents()
        .next('.plugin_fanfields3_exportText_LinkDetails')
        .show();
      $toggle.prev('.plugin_fanfields3_exportText_Label')
        .attr('aria-expanded', true);
    });
  };

  // Rebuild the Task List dialog's content in place, preserving the expanded/collapsed
  // per-portal link lists. Used after a flip/reset, and to auto-refresh live as the
  // background plan changes (new links appearing in-game, fan field rotation, etc.).
  thisplugin.refreshTaskListDialog = function () {
    var expandedGuids = thisplugin.getTaskListExpandedGuids();
    $('#plugin_fanfields3_exportText_inner').html(thisplugin.buildTaskListHTML());
    thisplugin.wireTaskListHandlers();
    thisplugin.restoreTaskListExpandedGuids(expandedGuids);
  };

  // Whether the Task List dialog is currently open and visible.
  thisplugin.isTaskListDialogOpen = function () {
    return $('#plugin_fanfields3_exportText_inner').is(':visible');
  };

  // Called after every plan recalculation (see updateLayer) so an open Task List reflects
  // background changes — new links appearing in-game, fan field rotation, etc. — without
  // the user having to close and reopen it.
  thisplugin.refreshTaskListIfOpen = function () {
    if (thisplugin.isTaskListDialogOpen()) {
      thisplugin.refreshTaskListDialog();
    }
  };

  thisplugin.wireTaskListHandlers = function () {
    var $inner = $('#plugin_fanfields3_exportText_inner');

    // On mobile, tapping any text carrying a title attribute (warning icons, the camera
    // icon, buttons, ...) pops up a native tooltip instead of just registering the tap —
    // strip them there so touch stays a plain tap. Desktop keeps its hover tooltips.
    if (L && L.Browser && L.Browser.mobile) {
      $inner.find('[title]').removeAttr('title');
    }

    $inner.find('[plugin_fanfields3_exportText_toggle="toggle"]')
      .each(function () {
        const $toggle = $(this);
        const $label = $toggle.prev('.plugin_fanfields3_exportText_Label');
        const $details = $toggle.parents()
          .next('.plugin_fanfields3_exportText_LinkDetails');

        if ($details.length) {
          $label.addClass('has-children');
        } else {
          $toggle.remove(); // Remove the checkbox if there are no child elements
          $label.css('cursor', 'default'); // Reset the cursor back to default
        }
      });
    $inner.find('[plugin_fanfields3_exportText_toggle="toggle"]')
      .change(function () {
        const isChecked = $(this)
          .is(':checked');
        $(this)
          .parents()
          .next('.plugin_fanfields3_exportText_LinkDetails')
          .toggle();
        $(this)
          .prev('.plugin_fanfields3_exportText_Label')
          .attr('aria-expanded', isChecked);
      });

    // ghi#23 (link flip): reverse a link's direction, recompute the plan, and refresh this dialog in place.
    $inner
      .off('click.plugin_fanfields3_link_flip')
      .on('click.plugin_fanfields3_link_flip', '.plugin_fanfields3_link_flip_btn', function (ev) {
        ev.preventDefault();
        var guidA = $(this).attr('data-guid-a');
        var guidB = $(this).attr('data-guid-b');
        thisplugin.toggleLinkFlip(guidA, guidB);
        thisplugin.refreshTaskListDialog();
      });

    $('#plugin_fanfields3_reset_link_flips_btn')
      .off('click')
      .on('click', function () {
        thisplugin.resetLinkFlips();
        thisplugin.refreshTaskListDialog();
      });

    // Keys plugin quick-set button: mark "enough keys" (raises the keys plugin count to at
    // least what this portal needs) or, once marked, reset it back to 0.
    $inner
      .off('click.plugin_fanfields3_keys_set')
      .on('click.plugin_fanfields3_keys_set', '.plugin_fanfields3_keys_setbtn', function (ev) {
        ev.preventDefault();
        var guid = $(this).attr('data-guid');
        var needed = parseInt($(this).attr('data-needed'), 10) || 0;
        thisplugin.toggleKeysPluginCount(guid, needed);
        thisplugin.refreshTaskListDialog();
      });

    $('#plugin_fanfields3_export_pdf_btn')
      .off('click')
      .on('click', function () {
        thisplugin.exportTaskListToPDF();
      });

    if (thisplugin.isCompatiblePortalRoutePlugin()) {
      $('#plugin_fanfields3_portal_route_link')
        .off('click')
        .on('click', function (ev) {
          ev.preventDefault();
          thisplugin.routeWithPortalRoute();
        });
    }
  };

  // Show as list
  thisplugin.exportText = function () {
    thisplugin.exportDialogWidth = 500;

    var width = thisplugin.exportDialogWidth;
    thisplugin.MaxDialogWidth = thisplugin.getMaxDialogWidth();
    if (thisplugin.MaxDialogWidth < thisplugin.exportDialogWidth) {
      width = thisplugin.MaxDialogWidth;
    }

    dialog({
      html: '<div id="plugin_fanfields3_exportText_inner">' + thisplugin.buildTaskListHTML() + '</div>',
      id: 'plugin_fanfields3_alert_textExport',
      title: 'Fan Fields 3 - Task List',
      width: width,
      closeOnEscape: true
    });

    // Pinned to the top of the screen rather than jQuery UI's default vertical centering: as
    // the dialog's height gets capped (see getMaxDialogHeight), centering would just push it
    // further down instead of shrinking it upward, defeating the point of the cap on a short
    // mobile screen. IITC's window.dialog() prefixes the id we pass with "dialog-" for the
    // actual jQuery UI element (see addTaskListShiftButtons below, which already accounts for
    // this) — '#plugin_fanfields3_alert_textExport' alone matches nothing.
    $('#dialog-plugin_fanfields3_alert_textExport')
      .dialog('option', 'position', { my: 'top', at: 'top+10', of: window });

    thisplugin.wireTaskListHandlers();
    thisplugin.addTaskListShiftButtons();

  };

  // Task List dialog: add the same anchor shift (rotation) controls as the map's own
  // topleft control, plus a Refresh button to force an IITC map data refresh, to the left
  // of the dialog's OK button, so these don't require leaving the Task List open. Only
  // needs wiring once per dialog open — unlike the table itself, the button pane isn't
  // touched by refreshTaskListDialog().
  thisplugin.addTaskListShiftButtons = function () {
    var id = 'plugin_fanfields3_alert_textExport';

    var $dlg = $('#dialog-' + id + ' .ui-dialog-content');
    if (!$dlg.length) $dlg = $('#dialog-' + id);
    if (!$dlg.length) $dlg = $('#' + id);
    if (!$dlg.length) return;

    var $ui = $dlg.closest('.ui-dialog');
    var $buttonpane = ($ui.length ? $ui : $dlg).find('.ui-dialog-buttonpane');
    if (!$buttonpane.length) return;

    // On a tall Task List (many portals), the dialog can grow taller than the visible
    // viewport, pushing this very button row (and the OK button) below the visible screen —
    // unreachable, since jQuery UI's dialog has no built-in max height. Cap the dialog to the
    // viewport and let only its content area scroll, so the title bar and this button row
    // always stay in view. Reapplied every time this is called (each dialog open), since the
    // viewport can differ between opens (e.g. after rotating the screen).
    if ($ui.length) {
      $ui.css({
        'max-height': thisplugin.getMaxDialogHeight() + 'px',
        'display': 'flex',
        'flex-direction': 'column'
      });
      $ui.find('.ui-dialog-content')
        .css({
          'flex': '1 1 auto',
          'overflow-y': 'auto'
        });
      $buttonpane.css('flex', '0 0 auto');
    }

    // Already added (e.g. dialog reused rather than recreated)?
    if ($buttonpane.find('#plugin_fanfields3_tasklist_shift_left').length) return;

    var buttonsHtml =
      '<button type="button" id="plugin_fanfields3_tasklist_shift_left" class="plugin_fanfields3_tasklist_shift_btn" title="FanFields shift left">' +
      symbol_counterclockwise + '</button>' +
      '<button type="button" id="plugin_fanfields3_tasklist_shift_right" class="plugin_fanfields3_tasklist_shift_btn" title="FanFields shift right">' +
      symbol_clockwise + '</button>' +
      '<button type="button" id="plugin_fanfields3_tasklist_refresh" class="plugin_fanfields3_tasklist_shift_btn" title="Force an IITC map data refresh">Refresh</button>';

    var $buttonset = $buttonpane.find('.ui-dialog-buttonset');
    if ($buttonset.length) {
      $buttonset.prepend(buttonsHtml);
    } else {
      $buttonpane.prepend(buttonsHtml);
    }

    $buttonpane.find('#plugin_fanfields3_tasklist_shift_left')
      .off('click')
      .on('click', function () {
        thisplugin.previousStartingPoint();
      });
    $buttonpane.find('#plugin_fanfields3_tasklist_shift_right')
      .off('click')
      .on('click', function () {
        thisplugin.nextStartingPoint();
      });
    $buttonpane.find('#plugin_fanfields3_tasklist_refresh')
      .off('click')
      .on('click', function () {
        thisplugin.forceMapDataRefresh();
      });
  };

  thisplugin.exportTaskListToPDF = function () {
    const id = 'plugin_fanfields3_alert_textExport';

    // Resolve the actual dialog content element.
    // IITC/jQuery-UI may wrap the original element inside a dialog container.

    let $dlg = $('#dialog-' + id + ' .ui-dialog-content');
    if (!$dlg.length) $dlg = $('#dialog-' + id);
    if (!$dlg.length) $dlg = $('#' + id);
    if (!$dlg.length) return;


    // Ensure all link detail rows are expanded before exporting

    $dlg.find('[plugin_fanfields3_exportText_toggle="toggle"]')
      .each(function () {
        const $toggle = $(this);
        const $label = $toggle.prev('.plugin_fanfields3_exportText_Label');
        const $details = $toggle.parents()
          .next('.plugin_fanfields3_exportText_LinkDetails');
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

          .plugin_fanfields3_exportText_ui { display: none !important; }
          .plugin_fanfields3_exportText_print { display: inline !important; color: #000; text-decoration: none; }

          tbody.plugin_fanfields3_exportText_Portal td { font-weight: bold !important; }
          tbody.plugin_fanfields3_exportText_LinkDetails td { font-weight: normal !important; }

          button, input[type="checkbox"] { display: none !important; }
          .plugin_fanfields3_exportText_Label::before { display: none !important; }

          .plugin_fanfields3_exportText_LinkDetails { display: table-row-group !important; }

          /* Keys alignment */
          td[plugin_fanfields3_enoughKeys],

          td[plugin_fanfields3_notEnoughKeys] {
            text-align: center !important;
          }

          td[plugin_fanfields3_enoughKeys],
          div[plugin_fanfields3_enoughKeys] {
            color: #828284;
          }

          tr.plugin_fanfields3_portal_done,
          tr.plugin_fanfields3_portal_done td,
          tr.plugin_fanfields3_portal_done a,
          tr.plugin_fanfields3_portal_done span,
          tr.plugin_fanfields3_link_done,
          tr.plugin_fanfields3_link_done td,
          tr.plugin_fanfields3_link_done a,
          tr.plugin_fanfields3_link_done span,
          td.plugin_fanfields3_cell_done {
            color: #828284 !important;
            text-decoration: line-through !important;
          }

          tr.plugin_fanfields3_portal_relocated,
          tr.plugin_fanfields3_portal_relocated td,
          tr.plugin_fanfields3_portal_relocated a,
          tr.plugin_fanfields3_portal_relocated span {
            color: #2E7D32 !important;
          }

          tr.plugin_fanfields3_blocker_row,
          tr.plugin_fanfields3_blocker_row td,
          tr.plugin_fanfields3_blocker_row a,
          tr.plugin_fanfields3_blocker_row span {
            color: #C62828 !important;
          }

          tr td span.plugin_fanfields3_blocker_tag {
            color: #C62828 !important;
            text-decoration: none !important;
          }
        `;


    w.document.open();
    w.document.write(`
            <!doctype html>
            <html>
              <head>
                <meta charset="utf-8">
                <title>Fan Fields 3 – Tasks</title>
                <style>${css}</style>
              </head>
              <body>
                <h1>Fan Fields 3 – Tasks</h1>
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
    let manageOrderDialogTitle = 'Fan Fields 3 - Manage Portal Order';
    var isMobile = L && L.Browser && L.Browser.mobile;

    if (!that.sortedFanpoints || that.sortedFanpoints.length === 0) {
      var widthEmpty = 350;
      thisplugin.MaxDialogWidth = thisplugin.getMaxDialogWidth();
      if (that.MaxDialogWidth < widthEmpty) widthEmpty = that.MaxDialogWidth;
      dialog({
        html: '<p>No Fanfield plan calculated yet.<br>Draw a polygon and let Fanfields calculate first.</p>',
        id: 'plugin_fanfields3_order_dialog_empty',
        title: manageOrderDialogTitle,
        width: widthEmpty,
        closeOnEscape: true
      });
      return;
    }

    function buildTableHTML() {
      var html = '';
      html += '<table id="plugin_fanfields3_order_table" class="plugin_fanfields3_order_table">';
      html += '<thead><tr>';
      // html += '<th class="plugin_fanfields3_order_gripcol" style="width:22px;"></th>';
      html += '<th class="plugin_fanfields3_order_move_col" style="width:36px;"></th>';
      html += '<th style="width:30px;">#</th>';
      html += '<th>Portal</th>';
      html += '<th style="width:60px;">Keys</th>';
      html += '<th style="width:60px;">Links out</th>';
      html += '</tr></thead><tbody>';

      that.sortedFanpoints.forEach(function (fp, idx) {
        var p = fp.portal;
        var title = (p && p.options && p.options.data && p.options.data.title) ? p.options.data.title : 'unknown title';

        var keys = (fp.incomingValidCount !== undefined) ? fp.incomingValidCount : (fp.incoming ? fp.incoming.length : 0);
        var out = (fp.outgoingValidCount !== undefined) ? fp.outgoingValidCount : (fp.outgoing ? fp.outgoing.length : 0);

        var isAnchor = (fp.guid === that.startingpointGUID);
        var trClass = isAnchor ? 'plugin_fanfields3_order_anchor' : 'plugin_fanfields3_order_row';

        // Grip/Move column: handle for normal rows, arrows for mobile, anchor icon for the pinned row.
        var moveCell = '';

        if (isAnchor) {
          moveCell =
            '<td class="plugin_fanfields3_order_gripcol"><span class="plugin_fanfields3_order_anchor_icon" title="Anchor row">&#9875;</span></td>';
        } else {
          if (isMobile) {
            moveCell = '<td class="plugin_fanfields3_order_move_col">' +
              '<button class="plugin_fanfields3_order_move plugin_fanfields3_order_move_up" title="Move up">&#9650;</button>' +
              '<button class="plugin_fanfields3_order_move plugin_fanfields3_order_move_down" title="Move down">&#9660;</button>' +
              '</td>';
          } else {
            moveCell =
              '<td class="plugin_fanfields3_order_gripcol"><span class="plugin_fanfields3_order_handle" title="Drag to reorder">&#9776;</span></td>';
          }
        }


        html += '<tr class="' + trClass + '" data-guid="' + fp.guid + '">';
        html += moveCell;
        html += '<td class="plugin_fanfields3_order_idx">' + idx + '</td>';
        html += '<td>' + title + (isAnchor ? ' <span class="plugin_fanfields3_italic">(anchor)</span>' : '') + '</td>';
        html += '<td style="text-align:right;">' + keys + '</td>';
        html += '<td style="text-align:right;">' + out + '</td>';
        html += '</tr>';
      });

      html += '</tbody></table>';
      html += '<div class="plugin_fanfields3_order_hint">';
      if (isMobile) {
        html += 'Use ▲/▼ to change visit order. First row (anchor) is fixed.<br>';
      } else {
        html += 'Drag &amp; drop rows to change visit order. First row (anchor) is fixed.<br>';
      }
      html += 'Click <b>Apply</b> to use this order for the fanfield calculation.';
      html += '</div>';
      html += '<div style="margin-top:5px;text-align:right;">';
      html += '  <button id="plugin_fanfields3_order_path">Path</button> ';
      html += '  <button id="plugin_fanfields3_order_reset" >Reset</button> ';
      html += '  <button id="plugin_fanfields3_order_apply" >Apply</button>';
      html += '</div>';
      return html;
    }

    var width = 450;
    thisplugin.MaxDialogWidth = thisplugin.getMaxDialogWidth();
    if (that.MaxDialogWidth < width) width = that.MaxDialogWidth;

    dialog({
      html: '<div id="plugin_fanfields3_order_dialog_inner">' + buildTableHTML() + '</div>',
      id: 'plugin_fanfields3_order_dialog',
      title: manageOrderDialogTitle,
      width: width,
      closeOnEscape: true
    });

    function initDragAndButtons() {
      var $tbody = $('#plugin_fanfields3_order_table tbody');

      function renumberRows() {
        // Update the "#" column to match the current DOM order.
        $tbody.find('tr')
          .each(function (i) {
            $(this)
              .find('td.plugin_fanfields3_order_idx')
              .text(i);
          });
        updateMoveButtons();
      }

      function pinAnchorRow() {
        // Keep anchor row at top (and prevent it from being displaced).
        var $anchor = $tbody.find('tr.plugin_fanfields3_order_anchor');
        if ($anchor.length && $tbody.children()
          .first()[0] !== $anchor[0]) {
          $tbody.prepend($anchor);
        }
      }

      function updateMoveButtons() {
        if (!isMobile) return;
        var $rows = $tbody.find('tr.plugin_fanfields3_order_row');
        $rows.find('.plugin_fanfields3_order_move')
          .prop('disabled', false);
        $rows.first()
          .find('.plugin_fanfields3_order_move_up')
          .prop('disabled', true);
        $rows.last()
          .find('.plugin_fanfields3_order_move_down')
          .prop('disabled', true);
      }

      function moveRow($row, direction) {
        if (!$row.length || !$row.hasClass('plugin_fanfields3_order_row')) return;
        var $anchor = $tbody.find('> tr.plugin_fanfields3_order_anchor');
        if (direction === 'up') {
          var $prev = $row.prev('tr');
          if ($prev.length === 0 || $prev.is($anchor)) return;
          $row.insertBefore($prev);
        } else {
          var $next = $row.next('tr');
          if ($next.length === 0) return;
          $row.insertAfter($next);
        }
        pinAnchorRow();
        renumberRows();
      }

      // Destroy old sortable if the dialog is rebuilt.
      if ($tbody.data('ui-sortable')) $tbody.sortable('destroy');

      pinAnchorRow();
      renumberRows();

      $tbody.sortable({
        // Only non-anchor rows are draggable.
        items: '> tr.plugin_fanfields3_order_row',
        handle: '.plugin_fanfields3_order_handle',
        axis: 'y',
        helper: 'clone',
        forcePlaceholderSize: true,
        placeholder: 'plugin_fanfields3_order_sort_placeholder',

        start: function (e, ui) {

          if (that.showOrderPath) {
            that.setOrderPathActive(false);
            $('#plugin_fanfields3_order_path')
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
            .addClass('plugin_fanfields3_order_sort_placeholder')
            .html('<td colspan="' + colCount + '">&nbsp;</td>');

          // Prevent placeholder from going above the anchor row.
          var $anchor = $tbody.find('> tr.plugin_fanfields3_order_anchor');
          if ($anchor.length && ui.placeholder.index() === 0) {
            ui.placeholder.insertAfter($anchor);
          }
        },

        change: function (e, ui) {
          // Prevent dropping above the anchor row.
          var $anchor = $tbody.find('> tr.plugin_fanfields3_order_anchor');
          if ($anchor.length && ui.placeholder.index() === 0) {
            ui.placeholder.insertAfter($anchor);
          }
        },

        update: function () {
          pinAnchorRow();
          renumberRows();
        }
      });

      if (isMobile) {
        $tbody
          .off('click.plugin_fanfields3_order_move')
          .on('click.plugin_fanfields3_order_move', '.plugin_fanfields3_order_move', function () {
            var $row = $(this)
              .closest('tr');
            if ($(this)
              .hasClass('plugin_fanfields3_order_move_up')) {
              moveRow($row, 'up');
            } else {
              moveRow($row, 'down');
            }
          });
      }

      // Rebind Reset and Apply buttons
      $('#plugin_fanfields3_order_reset')
        .off('click')
        .on('click', function () {
          that.manualOrderGuids = null;
          that.requestLinkOrderRecompute();
          that.updateLayer();


          $('#plugin_fanfields3_order_dialog_inner')
            .html(buildTableHTML());
          initDragAndButtons();

          if (that.showOrderPath) {
            that.updateOrderPath();
          }
        });

      $('#plugin_fanfields3_order_apply')
        .off('click')
        .on('click', function () {
          var guids = [];
          $('#plugin_fanfields3_order_table tbody tr')
            .each(function () {
              guids.push($(this)
                .data('guid'));
            });

          // The first entry must remain the anchor.
          if (guids[0] !== that.startingpointGUID) {
            that.manualOrderGuids = null;
          } else {
            that.manualOrderGuids = guids;
            that.showUnderFieldWarningOnce = true;
          }

          that.requestLinkOrderRecompute();
          that.delayedUpdateLayer(0.2, true);
          $('#plugin_fanfields3_order_dialog')
            .dialog('close');
        });

      $('#plugin_fanfields3_order_path')
        .off('click')
        .on('click', function () {
          var newState = !that.showOrderPath;
          that.setOrderPathActive(newState);
          $(this)
            .text(newState ? 'Hide path' : 'Path');
        });

      $('#plugin_fanfields3_order_path')
        .text(that.showOrderPath ? 'Hide path' : 'Path');
    }

    initDragAndButtons();
  };


  // ghi#23 end (3)

  thisplugin.respectIntelLinksModeENUM = {
    NONE: 0,
    ALL: 1,
    ENL: 2,
    RES: 3,
    ENL_AND_MAC: 4,
    RES_AND_MAC: 5,
    MAC: 6
  };

  // Issue #104: Filter which visible intel links should block the plan.
  // NONE: ignore all intel links
  // ALL: treat all visible links as blockers (RES+ENL+MAC)
  // ENL/RES/MAC: only that faction blocks
  // ENL_AND_MAC / RES_AND_MAC: block those teams
  // Placeholder default, overwritten in setup() once window.PLAYER is reliably available:
  // the real default is the player's own faction (ENL or RES), not NONE.
  thisplugin.respectIntelLinksMode = thisplugin.respectIntelLinksModeENUM.NONE;

  thisplugin.isRespectingIntel = function () {
    return thisplugin.respectIntelLinksMode !== thisplugin.respectIntelLinksModeENUM.NONE;
  };

  thisplugin.getRespectIntelTeams = function () {
    switch (thisplugin.respectIntelLinksMode) {
      case thisplugin.respectIntelLinksModeENUM.ALL:
        return [window.TEAM_RES, window.TEAM_ENL, window.TEAM_MAC];

      case thisplugin.respectIntelLinksModeENUM.ENL:
        return [window.TEAM_ENL];

      case thisplugin.respectIntelLinksModeENUM.RES:
        return [window.TEAM_RES];

      case thisplugin.respectIntelLinksModeENUM.MAC:
        return [window.TEAM_MAC];

      case thisplugin.respectIntelLinksModeENUM.ENL_AND_MAC:
        return [window.TEAM_ENL, window.TEAM_MAC];

      case thisplugin.respectIntelLinksModeENUM.RES_AND_MAC:
        return [window.TEAM_RES, window.TEAM_MAC];

      case thisplugin.respectIntelLinksModeENUM.NONE:
      default:
        return [];
    }
  };

  thisplugin.getOwnFactionTeam = function () {
    if (!window.PLAYER) return undefined;

    if (window.PLAYER.team === 'ENLIGHTENED' || window.PLAYER.team === window.TEAM_ENL) {
      return window.TEAM_ENL;
    }

    if (window.PLAYER.team === 'RESISTANCE' || window.PLAYER.team === window.TEAM_RES) {
      return window.TEAM_RES;
    }

    return undefined;
  };

  // A portal marker's own team (p.options.data.team) is the raw string IITC got from the
  // server ('RESISTANCE'/'E'/...), NOT the numeric TEAM_NONE/TEAM_RES/TEAM_ENL/TEAM_MAC
  // constant used everywhere else (including getOwnFactionTeam() above and link.team) —
  // comparing it directly against those constants always fails. This resolves it the same
  // way IITC itself does internally (IITC.utils.getTeamId, aliased as window.teamStringToId
  // for plugins), with a manual fallback for older/other builds lacking both.
  thisplugin.getPortalTeam = function (p) {
    if (p === undefined || !p.options || !p.options.data || p.options.data.team === undefined) return undefined;

    var teamRaw = p.options.data.team;
    if (typeof teamRaw === 'number') return teamRaw;

    if (typeof window.teamStringToId === 'function') return window.teamStringToId(teamRaw);
    if (window.IITC && window.IITC.utils && typeof window.IITC.utils.getTeamId === 'function') {
      return window.IITC.utils.getTeamId(teamRaw);
    }

    if (window.TEAM_CODENAMES) {
      var codenameIdx = window.TEAM_CODENAMES.indexOf(teamRaw);
      if (codenameIdx !== -1) return codenameIdx;
    }
    if (window.TEAM_CODES) {
      var codeIdx = window.TEAM_CODES.indexOf(teamRaw);
      if (codeIdx !== -1) return codeIdx;
    }

    return window.TEAM_NONE;
  };

  thisplugin.getRespectIntelLabel = function () {
    switch (thisplugin.respectIntelLinksMode) {
      case thisplugin.respectIntelLinksModeENUM.ALL:
        return 'ALL';

      case thisplugin.respectIntelLinksModeENUM.ENL:
        return 'ENL';

      case thisplugin.respectIntelLinksModeENUM.RES:
        return 'RES';

      case thisplugin.respectIntelLinksModeENUM.MAC:
        return 'MAC';

      case thisplugin.respectIntelLinksModeENUM.ENL_AND_MAC:
        return 'E&amp;M';

      case thisplugin.respectIntelLinksModeENUM.RES_AND_MAC:
        return 'R&amp;M';

      case thisplugin.respectIntelLinksModeENUM.NONE:
      default:
        return 'NONE';
    }
  };

  thisplugin.updateRespectIntelButton = function () {
    $('#plugin_fanfields3_respectbtn')
      .html('Respect&nbsp;Intel:&nbsp;' + thisplugin.getRespectIntelLabel());
  };

  // Backwards-compatible name: now cycles through the available modes.
  thisplugin.toggleRespectCurrentLinks = function () {
    thisplugin.respectIntelLinksMode++;
    if (thisplugin.respectIntelLinksMode > thisplugin.respectIntelLinksModeENUM.MAC) {
      thisplugin.respectIntelLinksMode = thisplugin.respectIntelLinksModeENUM.NONE;
    }

    thisplugin.updateRespectIntelButton();
    thisplugin.delayedUpdateLayer(0.2, true);
  };
  thisplugin.indicateLinkDirection = true;
  thisplugin.toggleLinkDirIndicator = function () {
    thisplugin.indicateLinkDirection = !thisplugin.indicateLinkDirection;
    if (thisplugin.indicateLinkDirection) {
      $('#plugin_fanfields3_direction_indicator_btn')
        .html('Show&nbsp;link&nbsp;dir:&nbsp;ON');
    } else {
      $('#plugin_fanfields3_direction_indicator_btn')
        .html('Show&nbsp;link&nbsp;dir:&nbsp;OFF');
    }
    thisplugin.delayedUpdateLayer(0.2, true);
  };

  // Grey out / strike through links (and, once all of a portal's links exist, the portal
  // name too) that already exist in-game for the player's own faction — in the Task List,
  // and as a faded brownish-red on the map itself (thisplugin.updateLayer()'s own drawing
  // loop) instead of bright red. Requested as a toggleable plugin option.
  thisplugin.greyOutExistingLinks = true;
  thisplugin.toggleGreyOutExistingLinks = function () {
    thisplugin.greyOutExistingLinks = !thisplugin.greyOutExistingLinks;
    thisplugin.updateGreyOutExistingLinksButton();
    thisplugin.refreshTaskListIfOpen();
    thisplugin.updateLayer();
  };
  thisplugin.updateGreyOutExistingLinksButton = function () {
    $('#plugin_fanfields3_greyout_existing_btn')
      .html('Grey&nbsp;out&nbsp;done&nbsp;links:&nbsp;' + (thisplugin.greyOutExistingLinks ? 'ON' : 'OFF'));
  };

  // Blockers: a link, from a faction that Respect Intel does not avoid, crossing a link of the
  // plan that is still to be thrown. The plan itself is left alone; the Task List instead gets
  // extra "Destroy"/"Capture" rows, placed where they cost the least walking, that free those
  // links in time.
  thisplugin.manageBlockers = true;
  thisplugin.toggleManageBlockers = function () {
    thisplugin.manageBlockers = !thisplugin.manageBlockers;
    thisplugin.updateManageBlockersButton();
    thisplugin.refreshTaskListIfOpen();
    thisplugin.updateLayer();
  };
  thisplugin.updateManageBlockersButton = function () {
    $('#plugin_fanfields3_blockers_btn')
      .html('Blockers:&nbsp;' + (thisplugin.manageBlockers ? 'ON' : 'OFF'));
  };

  // Longest extra walk (meters) one Destroy stop may add to the route; 0 = no limit.
  thisplugin.BLOCKER_DETOUR_LIMITS_M = [100, 200, 500, 1000, 0];
  thisplugin.blockerMaxDetourM = 500;
  thisplugin.getBlockerDetourLabel = function () {
    var limit = thisplugin.blockerMaxDetourM;
    if (!limit) return 'No&nbsp;limit';
    return (limit >= 1000) ? (limit / 1000) + 'km' : limit + 'm';
  };
  thisplugin.updateBlockerDetourButton = function () {
    $('#plugin_fanfields3_blocker_detour_btn')
      .html('Max&nbsp;detour:&nbsp;' + thisplugin.getBlockerDetourLabel());
  };
  thisplugin.cycleBlockerMaxDetour = function () {
    var limits = thisplugin.BLOCKER_DETOUR_LIMITS_M;
    var next = (limits.indexOf(thisplugin.blockerMaxDetourM) + 1) % limits.length;
    thisplugin.blockerMaxDetourM = limits[next];
    thisplugin.updateBlockerDetourButton();
    thisplugin.refreshTaskListIfOpen();
    thisplugin.updateLayer();
  };

  // The portal guid at one end of an IITC link ('oGuid' = origin, 'dGuid' = destination), or
  // undefined when IITC did not give it.
  thisplugin.getLinkEndpointGuid = function (link, field) {
    var data = link && link.options && link.options.data;
    return (data && data[field]) || undefined;
  };

  // Works out the blockers of the current plan and how to get rid of them.
  //
  // A blocker must be gone before the first link it blocks is thrown, i.e. before the walk
  // reaches that link's origin portal (its "deadline", a position in the walk). A link falls as
  // soon as either of its two portals is neutralized, so each blocker has two candidate portals:
  //  - an enemy portal that the plan captures anyway, if the walk reaches it before the deadline,
  //    frees its links for nothing;
  //  - any other candidate is inserted into the walk as an extra stop, at the spot that adds the
  //    least walking, no later than the deadline of the blockers it frees. A plan portal reached
  //    only after the deadline gets such an early stop too (and is captured later on the walk).
  // Stops are chosen greedily by extra walking per blocker freed (one stop freeing several links
  // beats several stops on the same walking), then stops that became redundant are dropped.
  // The walk itself is never reordered.
  //
  // Returns { blockers, stops, onRoute, unresolved, extraDistance }:
  //  - blockers: every blocking link { a, b, team, guidA, guidB, deadline, blocked }
  //  - stops: extra Destroy rows in walk order { guid, point, slot, detour,
  //    blockers } — slot = index of the walk portal it goes right before
  //  - onRoute: plan portal guid -> blockers freed by the capture the plan already does there
  //  - unresolved: blockers no stop could free within the maximum detour
  thisplugin.computeBlockerPlan = function () {
    var plan = { blockers: [], stops: [], onRoute: {}, unresolved: [], extraDistance: 0 };
    if (!thisplugin.manageBlockers) return plan;

    var walk = thisplugin.getDisplayOrder();
    if (!walk || walk.length < 2) return plan;

    var respectedTeams = thisplugin.getRespectIntelTeams();
    var ownTeam = thisplugin.getOwnFactionTeam();
    var maxDetour = thisplugin.blockerMaxDetourM;
    var pointKey = thisplugin.pointKey;

    // Links of the plan still to throw, each with its origin's position in the walk.
    var planned = [];
    walk.forEach(function (fp, k) {
      (fp.outgoing || []).forEach(function (target) {
        if (thisplugin.isLinkInGame(fp.guid, target.guid)) return;
        planned.push({
          a: fp.point,
          b: target.point,
          originIdx: k,
          minX: Math.min(fp.point.x, target.point.x),
          maxX: Math.max(fp.point.x, target.point.x),
          minY: Math.min(fp.point.y, target.point.y),
          maxY: Math.max(fp.point.y, target.point.y)
        });
      });
    });
    if (!planned.length) return plan;

    var guidByPointKey = {};
    for (var locGuid in thisplugin.locations) guidByPointKey[pointKey(thisplugin.locations[locGuid])] = locGuid;

    var blockers = [];
    for (var linkGuid in thisplugin.intelLinks) {
      var intel = thisplugin.intelLinks[linkGuid];
      if (respectedTeams.indexOf(intel.team) !== -1) continue;

      var minX = Math.min(intel.a.x, intel.b.x), maxX = Math.max(intel.a.x, intel.b.x);
      var minY = Math.min(intel.a.y, intel.b.y), maxY = Math.max(intel.a.y, intel.b.y);
      var deadline = Infinity;
      var blocked = [];
      for (var pi = 0; pi < planned.length; pi++) {
        var pl = planned[pi];
        if (pl.maxX < minX || pl.minX > maxX || pl.maxY < minY || pl.minY > maxY) continue;
        if (thisplugin.intersects(pl, intel)) {
          blocked.push(pl);
          if (pl.originIdx < deadline) deadline = pl.originIdx;
        }
      }
      if (!blocked.length) continue;

      blockers.push({
        a: intel.a,
        b: intel.b,
        team: intel.team,
        guidA: intel.guidA || guidByPointKey[pointKey(intel.a)],
        guidB: intel.guidB || guidByPointKey[pointKey(intel.b)],
        deadline: deadline,
        blocked: blocked
      });
    }
    plan.blockers = blockers;
    if (!blockers.length) return plan;

    // Candidate portals: both ends of every blocker.
    var walkIdxByKey = {};
    walk.forEach(function (fp, k) { walkIdxByKey[pointKey(fp.point)] = k; });

    var cands = {};
    blockers.forEach(function (blocker, bi) {
      [[blocker.a, blocker.guidA], [blocker.b, blocker.guidB]].forEach(function (end) {
        var key = pointKey(end[0]);
        var cand = cands[key];
        if (!cand) {
          var guid = end[1] || guidByPointKey[key];
          var marker = guid ? window.portals[guid] : undefined;
          var team = thisplugin.getPortalTeam(marker);
          var walkIdx = walkIdxByKey[key];
          cand = cands[key] = {
            key: key,
            point: end[0],
            guid: guid,
            walkIdx: walkIdx,
            // A plan portal that isn't ours is captured on the walk anyway, which frees its links.
            capturedOnWalk: walkIdx !== undefined && (ownTeam === undefined || team !== ownTeam),
            blockerIdx: []
          };
        }
        cand.blockerIdx.push(bi);
      });
    });

    // Meters between two projected points, with the lat/lng of each point cached.
    var latLngCache = {};
    function dist(p, q) {
      var kp = pointKey(p), kq = pointKey(q);
      var lp = latLngCache[kp] || (latLngCache[kp] = map.unproject(p, thisplugin.PROJECT_ZOOM));
      var lq = latLngCache[kq] || (latLngCache[kq] = map.unproject(q, thisplugin.PROJECT_ZOOM));
      return lp.distanceTo(lq);
    }

    var uncovered = {};
    for (var ui = 0; ui < blockers.length; ui++) uncovered[ui] = true;

    // The plan's own captures come first: an enemy plan portal reached before the deadline.
    for (var ck in cands) {
      var free = cands[ck];
      if (!free.capturedOnWalk) continue;
      free.blockerIdx.forEach(function (bi) {
        if (!uncovered[bi] || free.walkIdx >= blockers[bi].deadline) return;
        delete uncovered[bi];
        var onRouteKey = free.guid || free.key;
        (plan.onRoute[onRouteKey] = plan.onRoute[onRouteKey] || []).push(blockers[bi]);
      });
    }

    // The walk with the extra stops so far; items are { point, orig } (a walk portal, orig =
    // its index) or { point, stop }.
    var route = walk.map(function (fp, k) { return { point: fp.point, orig: k }; });

    // Cheapest place to insert the candidate with at most `bound` walk portals before it.
    function bestInsertion(cand, bound) {
      var best = null;
      var walkBefore = 0;
      for (var j = 0; j <= route.length; j++) {
        if (walkBefore > bound) break;
        var prev = j > 0 ? route[j - 1].point : null;
        var next = j < route.length ? route[j].point : null;
        var cost;
        if (prev && next) cost = dist(prev, cand.point) + dist(cand.point, next) - dist(prev, next);
        else if (next) cost = dist(cand.point, next);
        else cost = prev ? dist(prev, cand.point) : 0;
        if (!best || cost < best.cost - 1e-6) best = { index: j, cost: cost, slot: walkBefore };
        if (j < route.length && route[j].orig !== undefined) walkBefore++;
      }
      return best;
    }

    var stops = [];
    while (Object.keys(uncovered).length) {
      var pick = null;
      for (var key in cands) {
        var cand = cands[key];
        var mine = cand.blockerIdx.filter(function (bi) { return uncovered[bi]; });
        if (!mine.length) continue;

        var bounds = {};
        mine.forEach(function (bi) { bounds[blockers[bi].deadline] = true; });
        Object.keys(bounds).forEach(function (bound) {
          var ins = bestInsertion(cand, Number(bound));
          if (!ins || (maxDetour && ins.cost > maxDetour)) return;

          var frees = mine.filter(function (bi) { return blockers[bi].deadline >= ins.slot; });
          var ratio = ins.cost / frees.length;
          if (!pick || ratio < pick.ratio - 1e-6 ||
            (Math.abs(ratio - pick.ratio) <= 1e-6 && (frees.length > pick.frees.length ||
              (frees.length === pick.frees.length && ins.cost < pick.ins.cost)))) {
            pick = { cand: cand, ins: ins, frees: frees, ratio: ratio };
          }
        });
      }
      if (!pick) break;

      var stop = { cand: pick.cand, point: pick.cand.point, slot: pick.ins.slot, blockerIdx: pick.frees.slice() };
      route.splice(pick.ins.index, 0, { point: stop.point, stop: stop });
      stops.push(stop);
      pick.frees.forEach(function (bi) { delete uncovered[bi]; });
    }

    // Drop stops another stop (or a plan capture) makes redundant.
    function covers(other, bi) {
      return other.cand.blockerIdx.indexOf(bi) !== -1 && blockers[bi].deadline >= other.slot;
    }
    function isFreedElsewhere(stop, bi) {
      return stops.some(function (other) { return other !== stop && covers(other, bi); });
    }
    for (var si = stops.length - 1; si >= 0; si--) {
      var candidateStop = stops[si];
      var needed = candidateStop.blockerIdx.some(function (bi) { return !isFreedElsewhere(candidateStop, bi); });
      if (needed) continue;
      stops.splice(si, 1);
      route = route.filter(function (item) { return item.stop !== candidateStop; });
    }

    // Final stops in walk order, with the extra walking each really adds.
    var slotsWalked = 0;
    route.forEach(function (item, j) {
      if (item.orig !== undefined) { slotsWalked++; return; }
      var stop = item.stop;
      var prev = j > 0 ? route[j - 1].point : null;
      var next = j < route.length - 1 ? route[j + 1].point : null;
      var detour;
      if (prev && next) detour = dist(prev, stop.point) + dist(stop.point, next) - dist(prev, next);
      else if (next) detour = dist(stop.point, next);
      else detour = prev ? dist(prev, stop.point) : 0;

      var cand = stop.cand;
      // Every blocker of this portal still in the way when the walk gets here falls with it.
      var stopBlockers = cand.blockerIdx
        .filter(function (bi) { return blockers[bi].deadline >= slotsWalked; })
        .map(function (bi) { return blockers[bi]; });

      plan.stops.push({
        guid: cand.guid,
        key: cand.key,
        point: cand.point,
        slot: slotsWalked,
        detour: detour,
        blockers: stopBlockers
      });
    });

    blockers.forEach(function (blocker, bi) {
      if (uncovered[bi]) plan.unresolved.push(blocker);
    });

    function routeLength(items) {
      var total = 0;
      for (var j = 1; j < items.length; j++) total += dist(items[j - 1].point, items[j].point);
      return total;
    }
    plan.extraDistance = routeLength(route) - routeLength(route.filter(function (item) { return item.orig !== undefined; }));

    return plan;
  };

  thisplugin.is_locked = false;

  // Set when a plan is being (re)calculated from scratch, so the plan locks itself as soon as
  // that calculation is complete (see lockIfPlanComplete). Cleared by clicking Lock/Unlock: the
  // agent's own choice then stands until the next new plan.
  thisplugin._lockWhenPlanComplete = false;

  thisplugin.lock = function () {
    thisplugin.is_locked = !thisplugin.is_locked;
    thisplugin._lockWhenPlanComplete = false;
    thisplugin.updateLockButton();
  };

  // Locks the plan once a new plan is complete: drawn, link order optimized, and the automatic
  // anchor/direction search either done or not going to happen (a search still scheduled,
  // running, or waiting to retry while links load in means the plan may still change).
  thisplugin.lockIfPlanComplete = function () {
    if (!thisplugin._lockWhenPlanComplete) return;
    if (thisplugin._orientationSearchPending || thisplugin._orientationSearchTimer !== null) return;

    thisplugin._lockWhenPlanComplete = false;
    thisplugin.is_locked = true;
    thisplugin.updateLockButton();
  };

  // Keeps the sidebar Lock/Unlock button and the map's own topleft padlock control (see
  // addFfButtons) in sync with thisplugin.is_locked — whichever of the two was just clicked.
  thisplugin.updateLockButton = function () {
    if (thisplugin.is_locked) {
      $('#plugin_fanfields3_lockbtn')
        .html('&#128274;&nbsp;Locked'); // &#128274;
    } else {
      $('#plugin_fanfields3_lockbtn')
        .html('&#128275;&nbsp;Unlocked'); // &#128275;
    }

    $('#fanfieldLockButton')
      .html(thisplugin.is_locked ? lockIconClosed : lockIconOpen)
      .toggleClass('plugin_fanfields3_lock_locked', thisplugin.is_locked)
      .attr('title', thisplugin.is_locked
        ? 'Locked: click to let the plan recalculate again'
        : 'Unlocked: click to freeze the plan and stop it recalculating');
  };

  thisplugin.use_bookmarks_only = false;
  thisplugin.useBookmarksOnly = function () {
    thisplugin.use_bookmarks_only = !thisplugin.use_bookmarks_only;
    if (thisplugin.use_bookmarks_only) {
      $('#plugin_fanfields3_bookarks_only_btn')
        .html(
          '&#128278;&nbsp;Bookmarks only'
        );
    } else {
      $('#plugin_fanfields3_bookarks_only_btn')
        .html(
          '&#128278;&nbsp;All Portals'
        );
    }
    thisplugin.delayedUpdateLayer(0.2, true);
  };


  thisplugin.is_clockwise = true;
  thisplugin.updateClockwiseButton = function () {
    var clockwiseSymbol = "",
      clockwiseWord = "";
    if (thisplugin.is_clockwise) {
      clockwiseSymbol = "&#8635;"
      clockwiseWord = "Clockwise";
    } else {
      clockwiseSymbol = "&#8634;"
      clockwiseWord = "Counterclockwise";
    }

    $('#plugin_fanfields3_clckwsbtn')
      .html(clockwiseWord + '&nbsp;' + clockwiseSymbol + '');
  };

  thisplugin.toggleclockwise = function () {
    thisplugin.cancelOrientationSearch();
    thisplugin.is_clockwise = !thisplugin.is_clockwise;

    // Reset the order and link flips – new geometry, new base ordering (ghi#23)
    thisplugin.manualOrderGuids = null;
    thisplugin.manualLinkFlips = {};
    thisplugin.relocatedForLessWalkingGuids = {};
    thisplugin.displayOrderGuids = null;
    thisplugin.requestLinkOrderRecompute();

    thisplugin.updateClockwiseButton();
    thisplugin.delayedUpdateLayer(0.2, true);
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
      $('#plugin_fanfields3_availablesbul')
        .hide();
    } else {
      $('#plugin_fanfields3_availablesbul')
        .show();
    }


    $('#plugin_fanfields3_stardirbtn')
      .html(html);
    thisplugin.delayedUpdateLayer(0.2, true);
  };



  thisplugin.increaseSBUL = function () {
    if (thisplugin.availableSBUL < 4) {
      thisplugin.availableSBUL++;
      $('#plugin_fanfields3_availablesbul_count')
        .html('' + (thisplugin.availableSBUL) + '');
      thisplugin.delayedUpdateLayer(0.2, true);
    }
  }
  thisplugin.decreaseSBUL = function () {
    if (thisplugin.availableSBUL > 0) {
      thisplugin.availableSBUL--;
      $('#plugin_fanfields3_availablesbul_count')
        .html('' + (thisplugin.availableSBUL) + '');
      thisplugin.delayedUpdateLayer(0.2, true);
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
        '.plugin_fanfields3_btn {\n' +
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
        '.plugin_fanfields3_minibtn {\n' +
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
        '.plugin_fanfields3_multibtn {\n' +
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
        '.plugin_fanfields3_toolbox {\n' +
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
        '.plugin_fanfields3_sidebar {\n' +
        '  display: flex;\n' +
        '  flex-direction: row;\n' +
        '  flex-wrap: wrap;\n' +
        '  padding: 5px;' +
        '}\n'
      );

      addCSS('\n' +
        '.plugin_fanfields3_titlebar {\n' +
        '  background-color: rgba(8, 60, 78, 0.9);\n' +
        '  margin-right: 7px;\n' +
        '  text-align: center;\n' +
        '}\n'
      );

    } else {

      addCSS('\n' +
        '.plugin_fanfields3_btn {\n' +
        '   margin-left:0;\n' +
        '   margin-right:0;\n' +
        '   flex: 0 0 50%;\n' +
        '   overflow: hidden;\n' +
        '   text-overflow: ellipsis;\n' +
        '}'
      );

      addCSS('\n' +
        '.plugin_fanfields3_minibtn {\n' +
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
        '.plugin_fanfields3_multibtn {\n' +
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
        '.plugin_fanfields3_toolbox {\n' +
        '   margin: 5px;\n' +
        '   padding: 3px;\n' +
        '   border: 1px solid #ffce00;\n' +
        '   box-shadow: 3px 3px 5px black;\n' +
        '   color: #ffce00;' +
        '}\n'
      );

      addCSS('\n' +
        '.plugin_fanfields3_sidebar {\n' +
        '  display: flex;\n' +
        '  flex-direction: row;\n' +
        '  flex-wrap: wrap;\n' +
        '  padding: 5px;' +
        '}\n'
      );
      addCSS('\n' +
        '.plugin_fanfields3_titlebar {\n' +
        '  background-color: rgba(8, 60, 78, 0.9);\n' +
        '  margin-bottom: 7px;\n' +
        '  text-align: center;\n' +
        '}\n'
      );


      addCSS('\n' +
        '.plugin_fanfields3_toolbox > span {\n' +
        '   float: left;\n' +
        '}\n'
      );


    };

    // plugin_fanfields3_availablesbul_label
    addCSS('\n' +
      '.plugin_fanfields3_availablesbul_label {\n' +
      '  flex: 0 0 50%;\n' +
      '  display: flex;\n' +
      '  justify-content: center;\n' +
      '}\n');

    addCSS('\n' +
      '.plugin_fanfields3_italic {\n' +
      '  font-style: italic;\n' +
      '}\n');

    addCSS('\n' +
      '.plugin_fanfields3_warn {\n' +
      '  color: #ffce00;\n' +
      '}\n');

    // Task List: camera icon flagging a Volatile Scout Controlled portal (worth 3 scout
    // control points to scan instead of 1).
    addCSS('\n' +
      '.plugin_fanfields3_volatile_icon {\n' +
      '  font-size: 12px;\n' +
      '  vertical-align: middle;\n' +
      '}\n');

    // Task List: link detail rows use a slightly softened (not pure white) text color and
    // never bold — a still-to-throw link reads at normal weight, only a touch dimmer and
    // smaller than the portal row above it, with the italic already applied to this whole
    // block setting it apart further. An already-thrown link is greyed and struck through
    // separately (plugin_fanfields3_link_done).
    addCSS('\n' +
      '.plugin_fanfields3_exportText_LinkDetails tr td {\n' +
      '  font-weight: normal !important;\n' +
      '  color: #CCCCCC;\n' +
      '  font-size: 12px;\n' +
      '}\n');

    // Task List: separator lines between portal rows and between columns, so the table reads
    // as a grid instead of loose text. A portal row is separated from the next portal (or from
    // its own expanded link details) by this border; the link detail rows get their own,
    // darker separator below.
    addCSS('\n' +
      '#plugin_fanfields3_exportText_inner table {\n' +
      '  border-collapse: collapse;\n' +
      '  border: 1px solid #ffffff;\n' +
      '}\n' +
      '#plugin_fanfields3_exportText_inner th,\n' +
      '#plugin_fanfields3_exportText_inner td {\n' +
      '  border-right: 1px solid #ffffff;\n' +
      '  text-align: center !important;\n' +
      '}\n' +
      '#plugin_fanfields3_exportText_inner th:last-child,\n' +
      '#plugin_fanfields3_exportText_inner td:last-child {\n' +
      '  border-right: none;\n' +
      '}\n' +
      // The 3rd column is a spacer on portal rows (reserved so the layout lines up with the
      // flip-direction button that sits there on a link detail row) — with borders now drawn
      // around every cell it would otherwise show up as its own empty boxed-off column, so it
      // shares a border with the Action column instead of standing apart.
      '#plugin_fanfields3_exportText_inner th:nth-child(2),\n' +
      '#plugin_fanfields3_exportText_inner td:nth-child(2) {\n' +
      '  border-right: none;\n' +
      '}\n' +
      '#plugin_fanfields3_exportText_inner thead th {\n' +
      '  border-bottom: 1px solid #ffffff;\n' +
      '}\n' +
      '#plugin_fanfields3_exportText_inner tbody.plugin_fanfields3_exportText_Portal > tr > td {\n' +
      '  border-top: 1px solid #ffffff;\n' +
      '}\n'
    );

    // Task List: once a portal is unfolded, its link detail rows get their own separator —
    // darker than the portal-to-portal one above, since it only marks sub-items of the same
    // portal rather than a new portal starting.
    addCSS('\n' +
      '#plugin_fanfields3_exportText_inner .plugin_fanfields3_exportText_LinkDetails > tr > td {\n' +
      '  border-top: 1px solid #555;\n' +
      '}\n'
    );

    addCSS('\n' +
      '[plugin_fanfields3_exportText_toggle="toggle"] {\n' +
      '  display: none; ' +
      '}\n');

    addCSS('\n' +
      '.plugin_fanfields3_exportText_Label {\n' +
      '    cursor: pointer;\n' +
      '    display: inline-block;\n' +
      '    padding-left: 12px;\n' +
      '    padding-right: 3px;\n' +
      '    position: relative;\n' +
      '}\n' +
      '.plugin_fanfields3_exportText_Label.has-children::before {\n' +
      '    content: "\\25B9";\n /* (▹) */\n' +
      '    position: absolute;\n' +
      '    left: 0;\n' +
      '}\n' +
      '.plugin_fanfields3_exportText_Label.has-children[aria-expanded="true"]::before {\n' +
      '    content: "\\25BF";\n /* (▿) */\n' +
      '}\n'
    );

    // Task List: per-link "flip direction" button (ghi#23)
    addCSS('\n' +
      '.plugin_fanfields3_link_flip_btn {\n' +
      '  box-sizing: border-box;\n' +
      '  padding: 0 2px;\n' +
      '  border-width: 1px;\n' +
      '  font-size: 10px;\n' +
      '  line-height: 1;\n' +
      '  vertical-align: middle;\n' +
      '  cursor: pointer;\n' +
      '}\n' +
      '.plugin_fanfields3_link_flipped {\n' +
      '  color: #ffce00;\n' +
      '  border-color: #ffce00;\n' +
      '}\n' +
      '#plugin_fanfields3_reset_link_flips_btn[disabled] {\n' +
      '  opacity: 0.4;\n' +
      '  cursor: default;\n' +
      '}\n'
    );

    // Task List: "keys" plugin quick-set button. A green check above the key means "not
    // enough keys yet — click to mark this portal as having enough"; a red cross means
    // "already marked — click to reset the keys plugin's count for this portal back to 0".
    // Sits inline right after the keys count, so it's kept small and non-wrapping, with
    // every box-model property forced (!important) to override the site's own generic
    // button styling (border/background/padding), which otherwise renders it as a full-size
    // button and pushes it onto its own line.
    addCSS('\n' +
      '.plugin_fanfields3_keys_setbtn {\n' +
      '  position: relative;\n' +
      '  display: inline-block !important;\n' +
      '  box-sizing: content-box !important;\n' +
      '  width: 12px !important;\n' +
      '  height: 12px !important;\n' +
      '  min-width: 0 !important;\n' +
      '  line-height: 12px !important;\n' +
      '  padding: 0 !important;\n' +
      '  margin: 0 0 0 4px !important;\n' +
      '  border: none !important;\n' +
      '  border-radius: 0 !important;\n' +
      '  background: transparent !important;\n' +
      '  box-shadow: none !important;\n' +
      '  overflow: visible !important;\n' +
      '  font-size: 10px !important;\n' +
      '  vertical-align: middle;\n' +
      '  cursor: pointer;\n' +
      '}\n' +
      '.plugin_fanfields3_keys_setbtn::after {\n' +
      '  content: "\\2713";\n' +
      '  position: absolute;\n' +
      '  top: -2px;\n' +
      '  right: -9px;\n' +
      '  font-size: 15px;\n' +
      '  font-weight: bold;\n' +
      '  line-height: 1;\n' +
      '  color: #4CAF50;\n' +
      '  text-shadow: -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000;\n' +
      '}\n' +
      '.plugin_fanfields3_keys_setbtn.plugin_fanfields3_keys_full::after {\n' +
      '  content: "\\2715";\n' +
      '  color: #ff4444;\n' +
      '}\n'
    );

    // Task List dialog: anchor shift (rotation) buttons, added to the left of the dialog's
    // own OK button so the plan's start portal can be cycled without leaving the list.
    addCSS('\n' +
      '.plugin_fanfields3_tasklist_shift_btn {\n' +
      '  float: left;\n' +
      '  cursor: pointer;\n' +
      '}\n' +
      '.plugin_fanfields3_tasklist_shift_btn:last-of-type {\n' +
      '  margin-right: 10px;\n' +
      '}\n'
    );

    // "Pick anchor" buttons (sidebar and the map's own topleft control): highlighted while
    // armed (next portal click sets the anchor), so it reads as a toggle rather than a
    // one-off action.
    addCSS('\n' +
      '#plugin_fanfields3_pickanchor_btn.plugin_fanfields3_active,\n' +
      '#fanfieldPickAnchorButton.plugin_fanfields3_active {\n' +
      '  box-shadow: 0 0 0 2px #ffce00 inset;\n' +
      '  color: #ffce00;\n' +
      '}\n'
    );

    // Map topleft Lock/Unlock control: green open padlock while the plan still recalculates
    // freely, red closed padlock once it's frozen (thisplugin.is_locked) — the SVG icon uses
    // fill="currentColor", so its color follows this element's own color.
    addCSS('\n' +
      '#fanfieldLockButton {\n' +
      '  color: #4CAF50;\n' +
      '}\n' +
      '#fanfieldLockButton.plugin_fanfields3_lock_locked {\n' +
      '  color: #ff4444;\n' +
      '}\n' +
      '.plugin_fanfields3_lock_svg {\n' +
      '  vertical-align: middle;\n' +
      '}\n'
    );

    // Task List: once a portal's Action is "Nothing" (owned, no outgoing links left, no
    // keys still needed), the whole portal line fades from bright to pale yellow and is
    // struck through, end to end.
    addCSS('\n' +
      'tr.plugin_fanfields3_portal_done,\n' +
      'tr.plugin_fanfields3_portal_done td,\n' +
      'tr.plugin_fanfields3_portal_done a,\n' +
      'tr.plugin_fanfields3_portal_done span {\n' +
      '  color: rgba(255, 206, 0, 0.35) !important;\n' +
      '  text-decoration: line-through !important;\n' +
      '}\n'
    );

    // Task List: the Links or Keys cell fades and strikes through on its own — independently
    // of the row's overall Action — once that cell's own count is settled (no outgoing links
    // left, or no incoming links left / enough keys already held).
    addCSS('\n' +
      'td.plugin_fanfields3_cell_done {\n' +
      '  color: rgba(255, 206, 0, 0.35) !important;\n' +
      '  text-decoration: line-through !important;\n' +
      '}\n'
    );

    // Task List: a portal relocated earlier in the walk by "Less walking" is highlighted
    // green, as a reminder to capture it (and gather enough of its own keys) ahead of schedule.
    addCSS('\n' +
      'tr.plugin_fanfields3_portal_relocated,\n' +
      'tr.plugin_fanfields3_portal_relocated td,\n' +
      'tr.plugin_fanfields3_portal_relocated a,\n' +
      'tr.plugin_fanfields3_portal_relocated span {\n' +
      '  color: #4CAF50 !important;\n' +
      '}\n'
    );

    // Task List: a link line that already exists in-game turns grey and gets struck
    // through, end to end. A still-to-throw link keeps the normal text color (see the
    // exportText_LinkDetails rule above).
    addCSS('\n' +
      'tr.plugin_fanfields3_link_done,\n' +
      'tr.plugin_fanfields3_link_done td,\n' +
      'tr.plugin_fanfields3_link_done a,\n' +
      'tr.plugin_fanfields3_link_done span {\n' +
      '  color: #828284 !important;\n' +
      '  text-decoration: line-through !important;\n' +
      '}\n'
    );


    // Task List: the Destroy rows added for blockers, and the cross marking a plan
    // portal whose own capture already frees a blocker; on the map, the cross on each portal
    // to destroy.
    addCSS('\n' +
      'tr.plugin_fanfields3_blocker_row,\n' +
      'tr.plugin_fanfields3_blocker_row td,\n' +
      'tr.plugin_fanfields3_blocker_row a,\n' +
      'tr.plugin_fanfields3_blocker_row span {\n' +
      '  color: #FF6B6B !important;\n' +
      '}\n' +
      // Always red, even on a row whose own text is green (relocated) or faded (done).
      '#plugin_fanfields3_exportText_inner tr td span.plugin_fanfields3_blocker_tag {\n' +
      '  color: #FF4444 !important;\n' +
      '  text-decoration: none !important;\n' +
      '}\n' +
      '.plugin_fanfields3_blocker_summary {\n' +
      '  margin-top: 8px;\n' +
      '  text-align: left;\n' +
      '}\n' +
      '.plugin_fanfields3_blocker_marker {\n' +
      '  color: #FF0000;\n' +
      '  font-size: 18px;\n' +
      '  font-weight: bold;\n' +
      '  line-height: 18px;\n' +
      '  text-align: center;\n' +
      '  text-shadow: 1px 1px #000, 1px -1px #000, -1px 1px #000, -1px -1px #000;\n' +
      '  pointer-events: none;\n' +
      '}\n'
    );

    addCSS('\n' +
      '.plugin_fanfields3_label {\n' +
      '   color: #FFFFBB;\n' +
      '   font-size: 11px;\n' +
      '   line-height: 13px;\n' +
      '   text-align: left;\n' +
      '   vertical-align: bottom;\n' +
      '   padding: 2px;\n' +
      '   padding-top: ' + thisplugin.LABEL_PADDING_TOP + 'px;\n' +
      '   overflow: hidden;\n' +
      '   text-shadow: 1px 1px #000, 1px -1px #000, -1px 1px #000, -1px -1px #000, 0 0 5px #000;\n' +
      '   pointer-events: none;\n' +
      '   width: ' + thisplugin.LABEL_WIDTH + 'px;\n' +
      '   height: ' + thisplugin.LABEL_HEIGHT + 'px;\n' +
      '   border-left-color:red; border-left-style: dotted; border-left-width: thin;\n' +
      '}\n'
    );


    if (window.plugin.keys || window.plugin.LiveInventory) {
      addCSS(`
        td[plugin_fanfields3_enoughKeys], div[plugin_fanfields3_enoughKeys] {
           color: #828284;
           text-align: center;
        }
        td[plugin_fanfields3_notEnoughKeys] {
            /* color: #FFBBBB; */
            text-align: center;
        }

      `);
    };



    // Manage-Order-Dialog (ghi#23)
    addCSS('\n' +
      '.plugin_fanfields3_order_table {\n' +
      '  width: 100%;\n' +
      '  border-collapse: collapse;\n' +
      '  font-size: 11px;\n' +
      '}\n' +
      '.plugin_fanfields3_order_move_col {\n' +
      '  width: 36px;\n' +
      '  text-align: center;\n' +
      '  white-space: nowrap;\n' +
      '}\n' +
      '.plugin_fanfields3_order_move {\n' +
      '  min-width: 18px;\n' +
      '  padding: 0 2px;\n' +
      '  margin: 0 1px;\n' +
      '}\n' +
      '.plugin_fanfields3_order_table th,\n' +
      '.plugin_fanfields3_order_table td {\n' +
      '  border: 1px solid #555;\n' +
      '  padding: 2px 4px;\n' +
      '}\n' +
      '.plugin_fanfields3_order_table tbody tr.plugin_fanfields3_order_row:hover {\n' +
      '  background-color: rgba(255, 206, 0, 0.08);\n' +
      '}\n' +
      '.plugin_fanfields3_order_anchor {\n' +
      '  font-weight: bold;\n' +
      '  background-color: rgba(8, 60, 78, 0.6);\n' +
      '}\n' +
      '.plugin_fanfields3_order_handle {\n' +
      '  font-family: monospace;\n' +
      '  padding-right: 4px;\n' +
      '}\n' +
      '.plugin_fanfields3_order_hint {\n' +
      '  margin-top: 5px;\n' +
      '  font-size: 10px;\n' +
      '  color: #ccc;\n' +
      '}\n'
    );

    addCSS('\n' +
      '#plugin_fanfields3_order_dialog button[disabled] {\n' +
      '  opacity: 0.3;\n' +
      '  cursor: default;\n' +
      '  color: #ccc;\n' +
      '}\n' +
      '#plugin_fanfields3_order_dialog button:not([disabled]) {\n' +
      '  cursor: pointer;\n' +
      '}\n'
    );


    addCSS(` /* Fanfields3 order table: sortable grip column */
            #plugin_fanfields3_order_table .plugin_fanfields3_order_gripcol {
              width: 22px;
              text-align: center;
              white-space: nowrap;
              user-select: none;
            }

            #plugin_fanfields3_order_table .plugin_fanfields3_order_handle {
              cursor: grab;
              display: inline-block;
              padding: 0 4px;
            }

            #plugin_fanfields3_order_table .plugin_fanfields3_order_anchor_icon {
              cursor: default;
              display: inline-block;
              padding: 0 4px;
            }

            #plugin_fanfields3_order_table tr.plugin_fanfields3_order_sort_placeholder td {
              height: 22px;
            }

        `);

    addCSS(`
              .plugin_fanfields3_fieldsCell {
                text-align: left;
                font-size: 12px;
                letter-spacing: 1px;
                user-select: none;
                ${L.Browser.mobile ? `
                max-width: 40px !important;
                white-space: normal !important;
                word-break: break-all !important;
                overflow-wrap: break-word !important;
                ` : ''}
              }
            `);


    addCSS(`
          /* Standard: UI zeigt onclick-Link, Print-Link versteckt */
          .plugin_fanfields3_exportText_ui { display: inline; }
          .plugin_fanfields3_exportText_print { display: none; }

          @media print {
            /* Beim Drucken: Print-Link zeigen, UI-Link verstecken */
            .plugin_fanfields3_exportText_ui { display: none !important; }
            .plugin_fanfields3_exportText_print { display: inline !important; }

            /* Portal-Zeilen (die “zugeklappten” Hauptzeilen) fett */
            tbody.plugin_fanfields3_exportText_Portal td {
              font-weight: bold !important;
            }

            /* Detailzeilen (Links) ausdrücklich nicht fett */
            tbody.plugin_fanfields3_exportText_LinkDetails td {
              font-weight: normal !important;
            }
          }
        `);


    // Inject/update a single style tag
    var style = document.getElementById('plugin_fanfields3_css');
    if (!style) {
      style = document.createElement('style');
      style.id = 'plugin_fanfields3_css';
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



  // Undirected key for the link between two projected points.
  thisplugin.pointPairKey = function (pointA, pointB) {
    var keyA = pointA.x + ',' + pointA.y;
    var keyB = pointB.x + ',' + pointB.y;
    return (keyA < keyB) ? (keyA + '|' + keyB) : (keyB + '|' + keyA);
  };

  // Set of pointPairKey()s of the player's own faction's in-game links, rebuilt by
  // indexOwnLinks() whenever thisplugin.intelLinks is (re)built.
  thisplugin.ownLinkKeys = {};

  thisplugin.indexOwnLinks = function () {
    var keys = {};
    var ownTeam = thisplugin.getOwnFactionTeam();
    if (ownTeam !== undefined) {
      for (var guid in thisplugin.intelLinks) {
        var link = thisplugin.intelLinks[guid];
        if (link.team === ownTeam) keys[thisplugin.pointPairKey(link.a, link.b)] = true;
      }
    }
    thisplugin.ownLinkKeys = keys;
  };

  // Task List: does a real in-game link already exist between these two portals?
  // Only links belonging to the player's own faction count (Res links must not
  // grey out an Enl plan, and vice versa).
  thisplugin.isLinkInGame = function (guidA, guidB) {
    var pointA = thisplugin.locations && thisplugin.locations[guidA];
    var pointB = thisplugin.locations && thisplugin.locations[guidB];
    if (!pointA || !pointB) return false;

    return !!thisplugin.ownLinkKeys[thisplugin.pointPairKey(pointA, pointB)];
  };

  // The player's own faction's in-game links joining two of these fanpoints (guid -> projected
  // point): how many there are in total, and how many touch each portal (byGuid). No such link
  // means no anchor/direction can reuse an existing one.
  thisplugin.getOwnLinkDegrees = function (fanpoints) {
    var result = { total: 0, byGuid: {} };
    var ownTeam = thisplugin.getOwnFactionTeam();
    if (ownTeam === undefined) return result;

    var guidByPointKey = {};
    for (var guid in fanpoints) guidByPointKey[thisplugin.pointKey(fanpoints[guid])] = guid;

    for (var linkGuid in thisplugin.intelLinks) {
      var link = thisplugin.intelLinks[linkGuid];
      if (link.team !== ownTeam) continue;

      var guidA = guidByPointKey[thisplugin.pointKey(link.a)];
      var guidB = guidByPointKey[thisplugin.pointKey(link.b)];
      if (!guidA || !guidB || guidA === guidB) continue;

      result.total++;
      result.byGuid[guidA] = (result.byGuid[guidA] || 0) + 1;
      result.byGuid[guidB] = (result.byGuid[guidB] || 0) + 1;
    }
    return result;
  };

  // Whether the automatic anchor/direction search may run and apply its result: not while the
  // plan is Locked, nor with a manual portal order (that already fixes anchor/order by hand), nor
  // with a MANUALLY pinned anchor (an automatic pick from an earlier search doesn't count).
  thisplugin.isOrientationSearchAllowed = function () {
    return !thisplugin.is_locked && !thisplugin.manualOrderGuids &&
      !(thisplugin.forcedAnchorGUID && thisplugin.forcedAnchorIsManual);
  };

  // Drops any scheduled or running search (a newer one supersedes it, or the user just chose an
  // anchor/direction by hand, which the search must not override).
  thisplugin.cancelOrientationSearch = function () {
    thisplugin._orientationSearchToken++;
    clearTimeout(thisplugin._orientationSearchTimer);
    thisplugin._orientationSearchTimer = null;
  };

  // Schedules the search to start once the portal set has stopped changing — every new call
  // replaces the previous one, so a polygon whose portals are still streaming in is only searched
  // once. `ctx` is what the search needs from the updateLayer() run that scheduled it:
  // { signature, fanpoints, buildFanPlan, baseGuid, baseClockwise } — the current portal set, its
  // plan builder, and the anchor/direction the plan is currently built for.
  thisplugin.scheduleOrientationSearch = function (ctx) {
    thisplugin.cancelOrientationSearch();
    var token = thisplugin._orientationSearchToken;
    thisplugin._orientationSearchTimer = setTimeout(function () {
      thisplugin._orientationSearchTimer = null;
      thisplugin.runOrientationSearch(ctx, token);
    }, thisplugin.ORIENTATION_SEARCH_START_DELAY_MS);
  };

  // Tries anchor/direction candidates for `ctx` (see scheduleOrientationSearch) in short slices,
  // so the interface stays responsive, and applies the best one at the end with a normal
  // recalculation — unless anything relevant changed meanwhile (see isStale below).
  thisplugin.runOrientationSearch = function (ctx, token) {
    function isStale() {
      return token !== thisplugin._orientationSearchToken ||
        thisplugin.lastPlanSignature !== ctx.signature ||
        !thisplugin.isOrientationSearchAllowed();
    }
    if (isStale()) {
      thisplugin.lockIfPlanComplete();
      return;
    }

    var ownLinks = thisplugin.getOwnLinkDegrees(ctx.fanpoints);
    if (ownLinks.total === 0) {
      // Nothing to reuse: keep the current orientation, and look again on the next recalculation
      // if the links may still be loading in.
      thisplugin._orientationSearchPending = Date.now() < thisplugin._orientationSearchRetryUntil;
      thisplugin.lockIfPlanComplete();
      return;
    }

    // What makes a candidate orientation better, in priority order: more links of the plan
    // already thrown in-game, then more fields, then fewer keys on the busiest portal.
    function scoreOrientation(guid, cw) {
      var candidate = ctx.buildFanPlan(guid, cw);
      var reused = 0;
      candidate.donelinks.forEach(function (link) {
        if (link.guidA && link.guidB && thisplugin.isLinkInGame(link.guidA, link.guidB)) reused++;
      });
      var maxKeys = 0;
      candidate.sortedFanpoints.forEach(function (fp) {
        if (fp.incoming.length > maxKeys) maxKeys = fp.incoming.length;
      });
      return { reused: reused, fields: candidate.triangles.length, maxKeys: maxKeys };
    }

    function isBetterScore(score, than) {
      if (score.reused !== than.reused) return score.reused > than.reused;
      if (score.fields !== than.fields) return score.fields > than.fields;
      return score.maxKeys < than.maxKeys;
    }

    var bestGuid = ctx.baseGuid;
    var bestClockwise = ctx.baseClockwise;
    var bestScore = scoreOrientation(bestGuid, bestClockwise);

    // Portals already touched by the most existing links first: they're the likeliest anchors.
    // Stop as soon as every existing link is reused, or the time budget is spent.
    var candidateGuids = Object.keys(ctx.fanpoints).sort(function (guidA, guidB) {
      return (ownLinks.byGuid[guidB] || 0) - (ownLinks.byGuid[guidA] || 0);
    });
    var deadline = Date.now() + thisplugin.ORIENTATION_SEARCH_BUDGET_MS;
    var nextCandidate = 0;

    function tryCandidate(candidateGuid) {
      [true, false].forEach(function (cw) {
        if (candidateGuid === bestGuid && cw === bestClockwise) return;
        var score = scoreOrientation(candidateGuid, cw);
        if (isBetterScore(score, bestScore)) {
          bestScore = score;
          bestGuid = candidateGuid;
          bestClockwise = cw;
        }
      });
    }

    function isDone() {
      return nextCandidate >= candidateGuids.length || bestScore.reused >= ownLinks.total || Date.now() >= deadline;
    }

    function finish() {
      if (isStale()) return;
      if (bestGuid === ctx.baseGuid && bestClockwise === ctx.baseClockwise) return;

      thisplugin.is_clockwise = bestClockwise;
      thisplugin.updateClockwiseButton();

      // Pin the pick (auto, not manual) so it sticks across recalculations even when it isn't a
      // hull vertex — see forcedAnchorGUID in updateLayer().
      thisplugin.forcedAnchorGUID = bestGuid;
      thisplugin.forcedAnchorIsManual = false;

      // The anchor changed, so flips and relocations made for the previous one no longer apply.
      thisplugin.manualLinkFlips = {};
      thisplugin.relocatedForLessWalkingGuids = {};
      thisplugin.displayOrderGuids = null;
      thisplugin.requestLinkOrderRecompute();

      thisplugin.updateLayer();
    }

    function step() {
      thisplugin._orientationSearchTimer = null;
      if (isStale()) {
        thisplugin.lockIfPlanComplete();
        return;
      }

      var sliceEnd = Date.now() + thisplugin.ORIENTATION_SEARCH_SLICE_MS;
      while (!isDone() && Date.now() < sliceEnd) {
        tryCandidate(candidateGuids[nextCandidate++]);
      }

      if (isDone()) {
        finish();
        thisplugin.lockIfPlanComplete();
      } else {
        thisplugin._orientationSearchTimer = setTimeout(step, 0);
      }
    }

    step();
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
        className: 'plugin_fanfields3_label',
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


  // Issue #96: Max distance (in meters) for creating a link from a portal that is underneath an already-existing field.
  // Historically this was 500m; Niantic increased this temporarily to 2000m (matryoshka links). Keep configurable.
  thisplugin.maxLinkUnderFieldDistance = 2000;

  thisplugin.invalidUnderFieldLinks = {};
  thisplugin.validTriangles = null;
  thisplugin.validLinkCount = 0;
  thisplugin.validTriangleCount = 0;

  thisplugin.pointKey = function (p) {
    return p.x + ',' + p.y;
  };

  thisplugin.getDirectedLinkKey = function (guidA, guidB) {
    return guidA + '>' + guidB;
  };

  thisplugin.getUndirectedLinkKey = function (guidA, guidB) {
    return (guidA < guidB) ? (guidA + '|' + guidB) : (guidB + '|' + guidA);
  };

  // ghi#23 (link flip)
  // Whether this (undirected) link pair currently has a manual direction override.
  thisplugin.isLinkFlipped = function (guidA, guidB) {
    return !!thisplugin.manualLinkFlips[thisplugin.getUndirectedLinkKey(guidA, guidB)];
  };

  // Toggle the manual direction override for a link (Task List "flip" button). Works for both
  // mesh links and a portal's own anchor (fan/star) link — for the latter, updateLayer() applies
  // the override subject to the same SBUL outgoing-capacity check as radiating mode.
  thisplugin.toggleLinkFlip = function (guidA, guidB) {
    if (!guidA || !guidB) return;

    var key = thisplugin.getUndirectedLinkKey(guidA, guidB);
    if (thisplugin.manualLinkFlips[key]) {
      delete thisplugin.manualLinkFlips[key];
    } else {
      thisplugin.manualLinkFlips[key] = true;
    }

    thisplugin.updateLayer();
  };

  // Drop all manual link-direction overrides at once (Task List "Reset link orders" button).
  // Also drops back to the plain algorithm mode, since a leftover "Fewer keys"/"Less walking"
  // label next to zero overrides would be misleading, and reverts any portal relocated by
  // "Less walking" back to its natural spot in the walk.
  thisplugin.resetLinkFlips = function () {
    thisplugin.manualLinkFlips = {};
    thisplugin.relocatedForLessWalkingGuids = {};
    thisplugin.displayOrderGuids = null; // never the user's own Manage Portal Order (manualOrderGuids)
    thisplugin.linkOrderMode = thisplugin.linkOrderModeENUM.ALGO;
    thisplugin.updateLinkOrderModeButton();
    thisplugin.updateLayer();
  };

  // Task List "keys" quick-set button: write straight into the keys plugin's own count for
  // this portal via its public addKey(delta, guid) API (a delta, not a setter — so the
  // delta is computed from the portal's current count each time). Below what's needed,
  // raise it to exactly what's needed; already at or above it, drop it back to 0. Only for
  // window.plugin.keys — LiveInventory is a read-only reflection of the real inventory and
  // has no such API.
  thisplugin.toggleKeysPluginCount = function (guid, keysNeeded) {
    if (!guid || !window.plugin.keys || typeof window.plugin.keys.addKey !== 'function') return;

    var current = window.plugin.keys.keys[guid] || 0;
    var delta = (current >= keysNeeded) ? -current : (keysNeeded - current);
    if (delta !== 0) window.plugin.keys.addKey(delta, guid);
  };

  // Marks the active link order optimization (if any) as needing to be recomputed at the next
  // updateLayer() run. Called wherever the plan's structural basis changes (anchor, visit
  // order, geometry) — never for a single manual flip via the Task List ↔ button, which is
  // meant to stick as-is until the user re-optimizes on purpose.
  thisplugin.requestLinkOrderRecompute = function () {
    if (thisplugin.linkOrderMode !== thisplugin.linkOrderModeENUM.ALGO) {
      thisplugin._linkOrderRecomputePending = true;
    }
  };

  thisplugin.getLinkOrderModeLabel = function () {
    switch (thisplugin.linkOrderMode) {
      case thisplugin.linkOrderModeENUM.KEYS:
        return 'Fewer keys';
      case thisplugin.linkOrderModeENUM.DISTANCE:
        return 'Less walking';
      case thisplugin.linkOrderModeENUM.ALGO:
      default:
        return 'Algorithm';
    }
  };

  thisplugin.updateLinkOrderModeButton = function () {
    $('#plugin_fanfields3_linkorder_btn')
      .html('Optim:&nbsp;' + thisplugin.getLinkOrderModeLabel());
  };

  // Cycles the link order optimization mode (menu button) between KEYS ("Fewer keys") and
  // DISTANCE ("Less walking") — ALGO ("Algorithm", no override) is no longer a cycle stop,
  // since "Reset link orders" in the Task List already covers "go back to the base algorithm"
  // and having it in the rotation was mostly confusing. If somehow not already DISTANCE or
  // KEYS (e.g. right after a Task List reset), the next click lands on DISTANCE, the default.
  // Never changes which links exist or which fields form — only how mesh links are oriented.
  //
  // Switching mode always starts a clean calculation from the base algorithm, rather than
  // re-optimizing on top of whatever the previous mode left behind: manualLinkFlips still
  // holding the old mode's flips would feed straight back into the core algorithm's own build
  // pass (it consults isLinkFlipped() while constructing the plan, not only afterwards), so a
  // leftover flip can steer that pass into a different plan than the clean one this mode should
  // be optimizing from. Dropping the flips, "Less walking" relocations and walk/display order
  // first guarantees the new mode always computes from the same untouched baseline.
  thisplugin.cycleLinkOrderMode = function () {
    thisplugin.linkOrderMode = (thisplugin.linkOrderMode === thisplugin.linkOrderModeENUM.DISTANCE)
      ? thisplugin.linkOrderModeENUM.KEYS
      : thisplugin.linkOrderModeENUM.DISTANCE;

    thisplugin.manualLinkFlips = {};
    thisplugin.relocatedForLessWalkingGuids = {};
    thisplugin.displayOrderGuids = null;
    thisplugin._linkOrderRecomputePending = true;

    thisplugin.updateLinkOrderModeButton();
    thisplugin.delayedUpdateLayer(0.2, true);
  };

  // Strict point-in-triangle test in projection space:
  // returns true only if the point is inside, NOT on the border (vertices/edges are NOT "under a field").
  thisplugin.pointInTriangleStrict = function (p, a, b, c) {
    var eps = 1e-9;

    function sign(p1, p2, p3) {
      return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    }

    var d1 = sign(p, a, b);
    var d2 = sign(p, b, c);
    var d3 = sign(p, c, a);

    // On an edge => not "under"
    if (Math.abs(d1) < eps || Math.abs(d2) < eps || Math.abs(d3) < eps) return false;

    var hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    var hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0);

    return !(hasNeg && hasPos);
  };

  thisplugin.isPointUnderAnyTriangle = function (p, triangles) {
    if (!triangles || triangles.length === 0) return false;
    for (var i = 0; i < triangles.length; i++) {
      var t = triangles[i];
      if (thisplugin.pointInTriangleStrict(p, t.a, t.b, t.c)) return true;
    }
    return false;
  };

  // Validate the current plan against the "link from underneath a field" distance rule (Issue #96).
  // Marks impossible links, computes a "valid" triangle list (fields that can actually be created),
  // and provides per-portal counts that ignore invalid links.
  thisplugin.validateUnderFieldLinks = function () {
    // Walk order (relocations included) — "under field" validity depends on when a portal is
    // actually visited, which is the walk/display order, not the algorithm's own build order.
    var sorted = thisplugin.getDisplayOrder();
    if (sorted.length < 3) {
      thisplugin.invalidUnderFieldLinks = {};
      thisplugin.validTriangles = null;
      thisplugin.validLinkCount = 0;
      thisplugin.validTriangleCount = 0;
      return;
    }

    // Reset per-run state
    thisplugin.invalidUnderFieldLinks = {};
    thisplugin.validTriangles = [];
    thisplugin.validLinkCount = 0;
    thisplugin.validTriangleCount = 0;

    var pointToGuid = {};
    for (var i = 0; i < sorted.length; i++) {
      pointToGuid[thisplugin.pointKey(sorted[i].point)] = sorted[i].guid;
    }

    // Track successful links (undirected) so we can decide which triangles can actually be formed.
    var builtLinks = {};

    // Track whether a portal is under a field at the moment we arrive there.
    var portalUnderFieldAtVisit = {};

    // Per-link (directed) valid field creation count.
    var validFieldsByDirectedLink = {};

    // Init per-portal "valid" stats
    for (var pi = 0; pi < sorted.length; pi++) {
      sorted[pi].incomingValidCount = 0;
      sorted[pi].outgoingValidCount = 0;
      sorted[pi].fieldsCreatedValidAtPortal = 0;
    }

    function addInvalid(srcGuid, dstGuid, distance, flippedOk) {
      var dkey = thisplugin.getDirectedLinkKey(srcGuid, dstGuid);
      thisplugin.invalidUnderFieldLinks[dkey] = {
        srcGuid: srcGuid,
        dstGuid: dstGuid,
        distance: distance,
        flippedOk: flippedOk
      };
    }

    // First pass: walk portals in visit order, validate each outgoing link against fields built so far.
    // We only add triangles for links that are valid AND whose prerequisite links exist.
    for (var vi = 0; vi < sorted.length; vi++) {
      var srcFp = sorted[vi];
      var srcGuid = srcFp.guid;

      portalUnderFieldAtVisit[srcGuid] = thisplugin.isPointUnderAnyTriangle(srcFp.point, thisplugin.validTriangles);

      if (!srcFp.outgoing || srcFp.outgoing.length === 0) continue;

      for (var oi = 0; oi < srcFp.outgoing.length; oi++) {
        var dstFp = srcFp.outgoing[oi];
        var dstGuid = dstFp.guid;

        var distance = thisplugin.distanceTo(srcFp.point, dstFp.point);
        var srcUnder = portalUnderFieldAtVisit[srcGuid];
        var invalid = srcUnder && distance > thisplugin.maxLinkUnderFieldDistance;

        var meta = (srcFp.outgoingMeta && srcFp.outgoingMeta[dstGuid]) ? srcFp.outgoingMeta[dstGuid] : null;

        // Precompute whether flipping the link direction could avoid the under-field restriction in THIS visit order.
        // This ignores key logistics and assumes you can throw from the other end when you visit it.
        var dstUnderAtVisit = portalUnderFieldAtVisit[dstGuid];
        if (dstUnderAtVisit === undefined) {
          // Destination might be later in the route. We'll fill it in when we reach it.
          // For now, treat it as "unknown" => compute later in a second pass.
          dstUnderAtVisit = null;
        }
        var flippedOk = (dstUnderAtVisit === null) ? null : (!(dstUnderAtVisit && distance > thisplugin.maxLinkUnderFieldDistance));

        if (invalid) {
          addInvalid(srcGuid, dstGuid, distance, flippedOk);
          if (meta) {
            meta.invalidUnderField = true;
            meta.canFlipUnderField = flippedOk;
            meta.fieldsCreatedValid = 0;
          }
          continue;
        }

        // Link is valid in this direction.
        thisplugin.validLinkCount++;
        srcFp.outgoingValidCount++;
        dstFp.incomingValidCount++;

        builtLinks[thisplugin.getUndirectedLinkKey(srcGuid, dstGuid)] = true;

        // Determine how many fields this link can REALLY create (only if prerequisites exist).
        var fieldsCreatedByThisLink = 0;

        if (meta && meta.creatingFieldsWith && meta.creatingFieldsWith.length) {
          for (var ti = 0; ti < meta.creatingFieldsWith.length; ti++) {
            var thirdPoint = meta.creatingFieldsWith[ti];
            var thirdGuid = pointToGuid[thisplugin.pointKey(thirdPoint)];
            if (!thirdGuid) continue;

            var e1 = thisplugin.getUndirectedLinkKey(srcGuid, thirdGuid);
            var e2 = thisplugin.getUndirectedLinkKey(dstGuid, thirdGuid);

            if (!builtLinks[e1] || !builtLinks[e2]) {
              // If any prerequisite link is invalid/missing, the field won't exist.
              continue;
            }

            // Field exists.
            thisplugin.validTriangles.push({
              a: thirdPoint,
              b: srcFp.point,
              c: dstFp.point
            });
            fieldsCreatedByThisLink++;
          }
        }

        validFieldsByDirectedLink[thisplugin.getDirectedLinkKey(srcGuid, dstGuid)] = fieldsCreatedByThisLink;
        if (meta) meta.fieldsCreatedValid = fieldsCreatedByThisLink;

        srcFp.fieldsCreatedValidAtPortal += fieldsCreatedByThisLink;
      }
    }

    // Second pass: fill "flip ok" for destinations that were visited later.
    // Now that portalUnderFieldAtVisit is complete, update any null values.
    for (var k in thisplugin.invalidUnderFieldLinks) {
      if (!Object.prototype.hasOwnProperty.call(thisplugin.invalidUnderFieldLinks, k)) continue;
      var rec = thisplugin.invalidUnderFieldLinks[k];
      if (rec.flippedOk !== null) continue;

      var dstUnder = !!portalUnderFieldAtVisit[rec.dstGuid];
      rec.flippedOk = !(dstUnder && rec.distance > thisplugin.maxLinkUnderFieldDistance);

      var src = sorted.find(function (fp) { return fp.guid === rec.srcGuid; });
      if (src && src.outgoingMeta && src.outgoingMeta[rec.dstGuid]) {
        src.outgoingMeta[rec.dstGuid].canFlipUnderField = rec.flippedOk;
      }
    }

    thisplugin.validTriangleCount = thisplugin.validTriangles.length;

    // If this validation was triggered by a manual order apply, show a one-time warning dialog.
    if (thisplugin.showUnderFieldWarningOnce) {
      thisplugin.showUnderFieldWarningOnce = false;

      var invalidCount = Object.keys(thisplugin.invalidUnderFieldLinks).length;
      if (invalidCount > 0) {
        var width = 420;
        thisplugin.MaxDialogWidth = thisplugin.getMaxDialogWidth();
        if (thisplugin.MaxDialogWidth < width) width = thisplugin.MaxDialogWidth;

        dialog({
          html:
            '<p><b>Warning:</b> ' + invalidCount + ' link(s) cannot be created from under existing fields in this visit order.</p>' +
            '<p>Limit: ' + thisplugin.maxLinkUnderFieldDistance + 'm. Impossible links are shown dotted and are excluded from counts/fields.</p>' +
            '<p>Some may work if thrown from the opposite portal (workaround shown in task list), but Fanfields3 does not flip directions automatically.</p>',
          id: 'plugin_fanfields3_alert_underfield',
          title: 'Fan Fields 3 - Under-field Links',
          width: width,
          closeOnEscape: true
        });
      }
    }
  };

  // ---------------------------------------------------------------------
  // Link order optimization (menu button "Link order: Algorithm / Fewer
  // keys / Less walking"). This never changes which links exist or which
  // fields form — thisplugin.updateLayer()'s main algorithm decides that,
  // exactly as before. It only decides, for mesh links between two fan
  // points (never the anchor's own fan/star links), which end throws to
  // the other, by writing into thisplugin.manualLinkFlips — the very same
  // map the Task List's per-link ↔ button edits by hand.
  // ---------------------------------------------------------------------

  // Collects the flip-invariant "shape" of the current plan: for every accepted link (fan and
  // mesh), its two endpoints, distance and field-creation prerequisites, using whatever
  // direction thisplugin.updateLayer() just settled on for this run (manual flips included).
  thisplugin.buildLinkOrderEdges = function () {
    var edges = [];
    (thisplugin.sortedFanpoints || []).forEach(function (fp) {
      fp.outgoing.forEach(function (target) {
        var meta = fp.outgoingMeta ? fp.outgoingMeta[target.guid] : null;
        edges.push({
          key: thisplugin.getUndirectedLinkKey(fp.guid, target.guid),
          isFanLink: (fp.guid === thisplugin.startingpointGUID || target.guid === thisplugin.startingpointGUID),
          srcGuid: fp.guid,
          dstGuid: target.guid,
          distance: thisplugin.distanceTo(fp.point, target.point),
          creatingFieldsWith: (meta && meta.creatingFieldsWith) ? meta.creatingFieldsWith : []
        });
      });
    });
    return edges;
  };

  // For every mesh edge, the direction it would have WITHOUT any manual flip — i.e. reversed
  // from its current direction if it's currently in manualLinkFlips, unchanged otherwise.
  thisplugin.getNaturalMeshDirections = function (edges) {
    var natural = {};
    edges.forEach(function (e) {
      if (e.isFanLink) return;
      natural[e.key] = thisplugin.manualLinkFlips[e.key]
        ? { srcGuid: e.dstGuid, dstGuid: e.srcGuid }
        : { srcGuid: e.srcGuid, dstGuid: e.dstGuid };
    });
    return natural;
  };

  // Converts a final set of mesh edge directions back into a manualLinkFlips-shaped map:
  // flipped (true) wherever the final direction differs from the natural one.
  thisplugin.flipsFromDirections = function (edges, naturalByKey) {
    var flips = {};
    edges.forEach(function (e) {
      if (e.isFanLink) return;
      var natural = naturalByKey[e.key];
      if (natural && e.srcGuid !== natural.srcGuid) flips[e.key] = true;
    });
    return flips;
  };

  // Pure re-simulation of the "under field" walk (mirrors the core logic of
  // thisplugin.validateUnderFieldLinks, kept separate so exploring flip candidates never
  // touches the live per-portal state that function maintains). `edges` carry a resolved
  // direction (srcGuid/dstGuid already reflect the candidate being evaluated). Returns
  // per-portal incoming ("keys needed") counts and how many links would become impossible
  // to throw from underneath an existing field.
  thisplugin.simulateDirectedPlan = function (edges) {
    var sorted = thisplugin.sortedFanpoints || [];
    var outgoingByGuid = {};
    var incomingCount = {};
    var pointByGuid = {};
    var pointToGuid = {};

    sorted.forEach(function (fp) {
      outgoingByGuid[fp.guid] = [];
      incomingCount[fp.guid] = 0;
      pointByGuid[fp.guid] = fp.point;
      pointToGuid[thisplugin.pointKey(fp.point)] = fp.guid;
    });

    edges.forEach(function (e) {
      if (outgoingByGuid[e.srcGuid]) outgoingByGuid[e.srcGuid].push(e);
    });

    var builtLinks = {};

    var validTriangles = [];
    var invalidCount = 0;

    for (var vi = 0; vi < sorted.length; vi++) {
      var srcGuid = sorted[vi].guid;
      var srcUnder = thisplugin.isPointUnderAnyTriangle(sorted[vi].point, validTriangles);

      var outs = outgoingByGuid[srcGuid] || [];
      for (var oi = 0; oi < outs.length; oi++) {
        var e = outs[oi];
        var dstGuid = e.dstGuid;

        if (srcUnder && e.distance > thisplugin.maxLinkUnderFieldDistance) {
          invalidCount++;
          continue;
        }

        incomingCount[dstGuid] = (incomingCount[dstGuid] || 0) + 1;
        builtLinks[thisplugin.getUndirectedLinkKey(srcGuid, dstGuid)] = true;

        (e.creatingFieldsWith || []).forEach(function (thirdPoint) {
          var thirdGuid = pointToGuid[thisplugin.pointKey(thirdPoint)];
          if (!thirdGuid) return;
          var e1 = thisplugin.getUndirectedLinkKey(srcGuid, thirdGuid);
          var e2 = thisplugin.getUndirectedLinkKey(dstGuid, thirdGuid);
          if (builtLinks[e1] && builtLinks[e2]) {
            validTriangles.push({ a: thirdPoint, b: pointByGuid[srcGuid], c: pointByGuid[dstGuid] });
          }
        });
      }
    }

    return { incomingCount: incomingCount, invalidCount: invalidCount };
  };

  // "Less walking": a portal whose own OUTGOING count is exactly 2 (its anchor link plus one
  // mesh link) is a candidate. Its mesh link flips to point AT it (mesh partner -> portal)
  // when that partner is just as close, or closer, to whatever comes right after this portal
  // in the walk — i.e. this portal wasn't really "on the way", so the partner can throw
  // straight to the next stop instead. A portal with outgoing count 1 or 3+ is left untouched.
  //
  // Once flipped, the portal is relocated in the WALK/DISPLAY order only
  // (thisplugin.displayOrderGuids — see computeDistanceOrderReordering), never in
  // thisplugin.sortedFanpoints: the core algorithm builds links/fields from that array, so
  // reordering it would change the plan itself, not just how it's walked. Its anchor link then
  // throws normally, and relocated portals are recorded in
  // thisplugin.relocatedForLessWalkingGuids so the Task List can flag them (green): since
  // they're no longer visited in their "natural" position, they must already be captured —
  // with enough of their own keys gathered — by the time the walk reaches that earlier spot.
  thisplugin.computeDistanceOrderFlips = function () {
    var edges = thisplugin.buildLinkOrderEdges();
    var naturalByKey = thisplugin.getNaturalMeshDirections(edges);

    var sorted = thisplugin.sortedFanpoints || [];

    // Each portal's own outgoing count, exactly as the base algorithm computed it for this
    // run (before this optimizer touches anything), plus its walk position and point.
    var outgoingCountByGuid = {};
    var indexByGuid = {};
    var pointByGuid = {};
    sorted.forEach(function (fp, idx) {
      outgoingCountByGuid[fp.guid] = fp.outgoing.length;
      indexByGuid[fp.guid] = idx;
      pointByGuid[fp.guid] = fp.point;
    });

    function dist(guidA, guidB) {
      return thisplugin.distanceTo(pointByGuid[guidA], pointByGuid[guidB]);
    }

    var current = edges.map(function (e) { return $.extend({}, e); });

    // Portals whose mesh link actually flips below — these are the ones relocated further down.
    var meshFlippedGuids = {};

    // Mesh links: only the current thrower can qualify (its own 2 outgoing links are the fan
    // link plus exactly this one mesh link) — flip it to point at the thrower only if the
    // distance test says it isn't really on the way to the next stop.
    current.forEach(function (e) {
      if (e.isFanLink) return;
      if (outgoingCountByGuid[e.srcGuid] !== 2) return;

      var nextFp = sorted[indexByGuid[e.srcGuid] + 1];
      if (!nextFp) return; // last portal in the walk, nothing to compare against

      var d1 = dist(e.dstGuid, e.srcGuid);
      var d2 = dist(e.dstGuid, nextFp.guid);
      if (!(d2 < d1)) return; // this portal is genuinely on the way, leave it throwing

      var desiredSrc = e.dstGuid;
      var desiredDst = e.srcGuid;

      var before = thisplugin.simulateDirectedPlan(current);
      var trial = current.map(function (other) {
        return (other.key === e.key) ? $.extend({}, other, { srcGuid: desiredSrc, dstGuid: desiredDst }) : other;
      });
      var after = thisplugin.simulateDirectedPlan(trial);
      if (after.invalidCount > before.invalidCount) return; // required for feasibility, keep as-is

      meshFlippedGuids[e.srcGuid] = true;
      e.srcGuid = desiredSrc;
      e.dstGuid = desiredDst;
    });

    var flips = thisplugin.flipsFromDirections(current, naturalByKey);

    // Every portal that throws a link AT a given guid, in the final (post-flip) direction —
    // used by computeDistanceOrderReordering so a relocated portal never lands in the walk
    // after something that needs it already captured.
    var incomingSourcesByGuid = {};
    current.forEach(function (e) {
      (incomingSourcesByGuid[e.dstGuid] = incomingSourcesByGuid[e.dstGuid] || []).push(e.srcGuid);
    });

    // Relocate each flipped portal into the walk/display order.
    var reorderResult = thisplugin.computeDistanceOrderReordering(meshFlippedGuids, incomingSourcesByGuid);
    if (reorderResult) {
      thisplugin.displayOrderGuids = reorderResult.order;
      thisplugin.relocatedForLessWalkingGuids = reorderResult.movedGuids;
    } else {
      thisplugin.displayOrderGuids = null;
      thisplugin.relocatedForLessWalkingGuids = {};
    }

    return flips;
  };

  // For each guid in relocateGuids, inserts it wherever in the current walk minimizes the
  // extra distance added ("cheapest insertion", a classic TSP heuristic) — anywhere in the
  // walk, not just next to the mesh partner that made it a candidate. The only restriction: it
  // must land strictly before every portal in incomingSourcesByGuid[guid] (whoever throws a
  // link at it), since it needs to already be captured, with enough of its own keys farmed, by
  // then. Relocated portals are processed one at a time, in thisplugin.sortedFanpoints order,
  // each insertion updating the walk before the next portal is placed, so two portals that
  // belong together can end up next to each other. This is purely a DISPLAY/WALK reorder: the
  // returned order is only ever meant for thisplugin.displayOrderGuids, never applied to
  // thisplugin.sortedFanpoints or thisplugin.manualOrderGuids — the core algorithm decides
  // which links/fields exist from sortedFanpoints alone.
  // Returns null if nothing moved, or { order: <full guid order, anchor first>, movedGuids:
  // <guid -> true, only for portals actually relocated> }.
  thisplugin.computeDistanceOrderReordering = function (relocateGuids, incomingSourcesByGuid) {
    var sorted = thisplugin.sortedFanpoints || [];
    if (!sorted.length) return null;

    var pointByGuid = {};
    sorted.forEach(function (fp) { pointByGuid[fp.guid] = fp.point; });

    function dist(guidA, guidB) {
      return thisplugin.distanceTo(pointByGuid[guidA], pointByGuid[guidB]);
    }

    // Everyone NOT being relocated, kept in their original relative order — the starting
    // walk that relocated portals get inserted into, one at a time.
    var order = sorted
      .filter(function (fp) { return !relocateGuids[fp.guid]; })
      .map(function (fp) { return fp.guid; });

    var movedGuids = {};

    sorted.forEach(function (fp) {
      if (!relocateGuids[fp.guid]) return;

      // How far into the walk this portal is allowed to land: strictly before the earliest
      // of its known sources (skip a source not yet placed — can't bound against a position
      // that doesn't exist yet). No known source at all means no bound: `limit` stays at
      // order.length, so appending at the very end is fair game too.
      var limit = order.length;
      (incomingSourcesByGuid[fp.guid] || []).forEach(function (srcGuid) {
        var srcIdx = order.indexOf(srcGuid);
        if (srcIdx !== -1 && srcIdx < limit) limit = srcIdx;
      });

      // Try every gap in the walk so far (between order[i] and order[i+1]) that keeps this
      // portal before `limit`, plus appending after the last stop when nothing bounds it — and
      // keep whichever adds the least distance.
      var bestIdx = -1;
      var bestCost = Infinity;

      var maxGapStart = Math.min(order.length - 2, limit - 1);
      for (var i = 0; i <= maxGapStart; i++) {
        var a = order[i], b = order[i + 1];
        var cost = dist(a, fp.guid) + dist(fp.guid, b) - dist(a, b);
        if (cost < bestCost) { bestCost = cost; bestIdx = i; }
      }

      if (limit >= order.length) {
        var lastCost = dist(order[order.length - 1], fp.guid);
        if (lastCost < bestCost) { bestCost = lastCost; bestIdx = order.length - 1; }
      } else if (bestIdx === -1 && limit >= 1) {
        // Earliest source sits right after the anchor — the only spot before it.
        bestIdx = 0;
      }

      if (bestIdx === -1) return; // no valid spot at all, skip

      order.splice(bestIdx + 1, 0, fp.guid);
      movedGuids[fp.guid] = true;
    });

    var moved = Object.keys(movedGuids).length > 0;
    return moved ? { order: order, movedGuids: movedGuids } : null;
  };

  // "Fewer keys": greedily re-orients mesh links (any of them, not just 2-link portals) to
  // lower the highest number of keys any single portal needs, never accepting a change that
  // would make a link impossible to throw from underneath an existing field. This is a
  // heuristic (repeated local improvement), not a proven-optimal balance.
  thisplugin.computeKeysOrderFlips = function () {
    var edges = thisplugin.buildLinkOrderEdges();
    var naturalByKey = thisplugin.getNaturalMeshDirections(edges);

    var current = edges.map(function (e) { return $.extend({}, e); });
    var meshEdges = current.filter(function (e) { return !e.isFanLink; });

    var maxIterations = Math.min(500, Math.max(50, meshEdges.length * 10));
    var stuckGuids = {};

    for (var iter = 0; iter < maxIterations; iter++) {
      var state = thisplugin.simulateDirectedPlan(current);

      // Pick the not-yet-stuck portal with the highest key count.
      var targetGuid = null, targetCount = 0;
      Object.keys(state.incomingCount).forEach(function (guid) {
        if (stuckGuids[guid]) return;
        if (state.incomingCount[guid] > targetCount) {
          targetCount = state.incomingCount[guid];
          targetGuid = guid;
        }
      });
      if (targetGuid === null) break; // nothing left worth balancing

      // Candidate flips: mesh links currently pointing INTO targetGuid.
      var candidates = meshEdges.filter(function (e) { return e.dstGuid === targetGuid; });
      if (candidates.length === 0) {
        stuckGuids[targetGuid] = true;
        continue;
      }

      var bestEdge = null, bestMax = targetCount, bestOtherCount = Infinity;
      candidates.forEach(function (e) {
        var trial = current.map(function (other) {
          return (other.key === e.key) ? $.extend({}, other, { srcGuid: e.dstGuid, dstGuid: e.srcGuid }) : other;
        });
        var trialState = thisplugin.simulateDirectedPlan(trial);
        if (trialState.invalidCount > state.invalidCount) return; // never trade feasibility away

        var trialMax = 0;
        Object.keys(trialState.incomingCount).forEach(function (guid) {
          if (trialState.incomingCount[guid] > trialMax) trialMax = trialState.incomingCount[guid];
        });
        var otherCount = trialState.incomingCount[e.srcGuid] || 0;

        if (trialMax < bestMax || (trialMax === bestMax && otherCount < bestOtherCount)) {
          bestMax = trialMax;
          bestOtherCount = otherCount;
          bestEdge = e;
        }
      });

      if (bestEdge === null) {
        stuckGuids[targetGuid] = true;
        continue;
      }

      var newSrc = bestEdge.dstGuid, newDst = bestEdge.srcGuid;
      bestEdge.srcGuid = newSrc;
      bestEdge.dstGuid = newDst;
    }

    return thisplugin.flipsFromDirections(current, naturalByKey);
  };





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

    var sorted = that.getDisplayOrder();
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

  // Debug: dump the current plan's portals (with coordinates) and the drawn polygon(s) that
  // selected them. Called from updateLayer() once thisplugin.fanpoints/perimeterpoints/dtLayers
  // are up to date. Toggle with: window.plugin.fanfields.debugLogPlan = true/false;
  thisplugin.logPlanDebugInfo = function () {
    var hullGuids = {};
    (thisplugin.perimeterpoints || []).forEach(function (entry) {
      hullGuids[entry[0]] = true;
    });

    var portalRows = Object.keys(thisplugin.fanpoints || {})
      .map(function (guid) {
        var portal = window.portals[guid];
        var ll = portal ? portal.getLatLng() : null;
        var p = thisplugin.fanpoints[guid];
        return {
          guid: guid,
          title: (portal && portal.options && portal.options.data && portal.options.data.title) ? portal.options.data.title : 'unknown title',
          lat: ll ? ll.lat : undefined,
          lng: ll ? ll.lng : undefined,
          x: p ? p.x : undefined,
          y: p ? p.y : undefined,
          onHull: !!hullGuids[guid],
        };
      });

    var polygons = (thisplugin.dtLayers || [])
      .filter(function (layer) {
        return layer instanceof L.GeodesicPolygon;
      })
      .map(function (layer) {
        return layer.getLatLngs()
          .map(function (ll) {
            return { lat: ll.lat, lng: ll.lng };
          });
      });

    console.log('FanFields3 debug: ' + portalRows.length + ' portal(s) in plan, ' + polygons.length + ' polygon(s)');
    console.table(portalRows);
    polygons.forEach(function (vertices, i) {
      console.log('Polygon #' + i + ' (' + vertices.length + ' vertices):');
      console.table(vertices);
    });
  };

  thisplugin.updateLayer = function () {
    var donelinks = [];
    var triangles = [];
    var n = 0;
    var centerOutgoings = 0;
    var centerSbul = 0;
    var i;
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
      var keysNeeded = (a.incomingValidCount !== undefined) ? a.incomingValidCount : a.incoming.length;
      var totalFields = (thisplugin.validTriangleCount !== undefined) ? thisplugin.validTriangleCount : triangles.length;
      if (thisplugin.stardirection === thisplugin.starDirENUM.CENTRALIZING) {
        labelText = "START PORTAL<BR>Keys: " + keysNeeded + "<br>Total Fields: " + totalFields.toString();
      } else {
        labelText = "START PORTAL<BR>Keys: " + keysNeeded + ", SBUL: " + (centerSbul) + "<br>out: " + centerOutgoings + "<br>Total Fields: " +
          totalFields.toString();
      }
      thisplugin.addLabel(thisplugin.startingpointGUID, alatlng, labelText);
    }

    function drawNumber(a, number) {
      if (n < 2) return;
      var alatlng = map.unproject(a.point, thisplugin.PROJECT_ZOOM);
      var labelText = "";
      labelText = number + "<br>Keys: " + ((a.incomingValidCount !== undefined) ? a.incomingValidCount : a.incoming.length) + "<br>out: " + ((a.outgoingValidCount !== undefined) ? a.outgoingValidCount : a.outgoing.length);
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
        b: {},
        team: link.options.team,
        guidA: thisplugin.getLinkEndpointGuid(link, 'oGuid'),
        guidB: thisplugin.getLinkEndpointGuid(link, 'dGuid')
      };
      var a = lls[0],
        b = lls[1];

      line.a = map.project(a, thisplugin.PROJECT_ZOOM);
      line.b = map.project(b, thisplugin.PROJECT_ZOOM);
      thisplugin.intelLinks[guid] = line;
    });
    thisplugin.indexOwnLinks();

    // Cache intel links as a flat array once (used repeatedly in candidate loop)
    var maplinksAll = null;
    // var emptyMaplinks = [];
    if (thisplugin.isRespectingIntel()) {
      var allowedTeams = thisplugin.getRespectIntelTeams();
      maplinksAll = Object.values(thisplugin.intelLinks)
        .filter(function (l) {
          return allowedTeams.indexOf(l.team) !== -1;
        });
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

    // If the portal set changed: disable the path and drop manual link flips (ghi#23),
    // since they reference GUID pairs that may no longer be part of the plan.
    if (thisplugin.lastPlanSignature !== null &&
      thisplugin.lastPlanSignature !== currentSignature) {

      thisplugin.manualLinkFlips = {};
      thisplugin.relocatedForLessWalkingGuids = {};
      thisplugin.displayOrderGuids = null;
      thisplugin.requestLinkOrderRecompute();

      if (thisplugin.showOrderPath) {
        thisplugin.setOrderPathActive(false);
      }
    }

    // A brand new portal set — including the very first one right after IITC/this plugin
    // loads, when a polygon restored from DrawTools typically shows before all of its portals
    // have actually finished loading in, so this keeps firing again as more of them stream in
    // and the signature keeps changing on each subsequent run — should search for the best
    // matching anchor/direction below, not just later, already-established plans.
    if (thisplugin.lastPlanSignature !== currentSignature) {
      thisplugin._orientationSearchPending = true;
      thisplugin._orientationSearchRetryUntil = Date.now() + thisplugin.ORIENTATION_SEARCH_RETRY_MS;
      thisplugin._lockWhenPlanComplete = true;
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
          if (perimeter[i][0] === GUID) {
            //already in
            done = true;
            break;
          }
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

    // Points thisplugin.startingpointIndex at `guid` within thisplugin.perimeterpoints,
    // extending that list first if it isn't already there (same trick as the DrawTools marker
    // above), so the forcedAnchorGUID block right below can make an arbitrary fanpoint (not just
    // a hull vertex) the actual, sticky anchor.
    function pinStartingpointToGuid(guid) {
      thisplugin.perimeterpoints = extendperimeter(thisplugin.perimeterpoints, guid, thisplugin.fanpoints[guid]);
      for (var pi = 0; pi < thisplugin.perimeterpoints.length; pi++) {
        if (thisplugin.perimeterpoints[pi][0] === guid) {
          thisplugin.startingpointIndex = pi;
          return;
        }
      }
    }

    // Pinned anchor (thisplugin.setAnchorByGuid — Pick anchor button, or the auto-orientation
    // search below picking an off-hull portal): pin thisplugin.startingpointIndex to it every
    // run, since buildFanPlan() only ever reads the anchor via thisplugin.perimeterpoints[...].
    // Cleared if the portal dropped out of the plan (polygon edited, Bookmarks-only toggled, …).
    if (thisplugin.forcedAnchorGUID !== null) {
      if (thisplugin.forcedAnchorGUID in thisplugin.fanpoints) {
        pinStartingpointToGuid(thisplugin.forcedAnchorGUID);
      } else {
        thisplugin.forcedAnchorGUID = null;
        thisplugin.forcedAnchorIsManual = false;
      }
    }

    // Debug: dump the portals considered for the plan (guid, title, lat/lng, projected x/y,
    // whether they're on the convex hull) and the drawn polygon(s) used to select them.
    // Toggle from the console with: window.plugin.fanfields.debugLogPlan = false;
    if (thisplugin.debugLogPlan) {
      thisplugin.logPlanDebugInfo();
    }

    // Use currently selected index in outer hull as starting point
    if (thisplugin.startingpointIndex >= thisplugin.perimeterpoints.length) {
      thisplugin.startingpointIndex = 0;
    }

    console.log("startingpointIndex = " + thisplugin.startingpointIndex);

    // This run's own set of fanpoints, which buildFanPlan() below keeps using even if it's called
    // after a later run has replaced thisplugin.fanpoints (see thisplugin.runOrientationSearch).
    var planFanpoints = thisplugin.fanpoints;

    // Builds a candidate plan for a given anchor (guid, any fanpoint — not just a hull vertex)
    // and direction, entirely in local state — never touching thisplugin.startingpointIndex/
    // is_clockwise/sortedFanpoints/links/triangles/centerKeys, etc. It's a side-effect-free
    // building block: called once for the selected anchor/direction, and repeatedly — for
    // different candidates — by the auto-orientation search (thisplugin.runOrientationSearch)
    // before committing to one.
    function buildFanPlan(candidateStartingpointGUID, clockwise) {
      var localN = 0;
      var localCenterOutgoings = 0;
      var localCenterSbul = 0;
      var localCenterKeys = 0;
      var localFanlinks = [];
      var localDonelinks = [];
      var localTriangles = [];
      var localSorted = [];

      var candidateStartingpoint = planFanpoints[candidateStartingpointGUID];

      var guid, a, b, fp, i;

      for (guid in planFanpoints) {
        localN++;
        if (planFanpoints[guid].equals(candidateStartingpoint)) {
          continue;
        } else {
          a = planFanpoints[guid];
          b = candidateStartingpoint;

          localFanlinks.push({
            a: a,
            b: b,
            bearing: undefined,
            isJetLink: undefined,
            isFanLink: undefined,
            distance: thisplugin.distanceTo(a, b)
          });
        }
      }

      for (guid in planFanpoints) {
        fp = planFanpoints[guid];
        localSorted.push({
          point: fp,
          portal: portals[guid],
          bearing: thisplugin.getBearing(candidateStartingpoint, fp),
          guid: guid,
          incoming: [],
          outgoing: [],
          outgoingMeta: {},
          is_startpoint: planFanpoints[guid].equals(candidateStartingpoint)
        });
      }
      localSorted.sort(function (a, b) {
        return a.bearing - b.bearing;
      });

      // rotate localSorted until the bearing to the anchor has the longest gap to the previous
      // one. if no gap bigger 90° is present, start with the longest link.
      var currentBearing, lastBearing;
      var gap, lastGap, maxGap, maxGapIndex, maxGapBearing;
      for (i in localSorted) {
        if (lastBearing === undefined) {
          lastBearing = localSorted[localSorted.length - 1].bearing;
          gap = 0;
          lastGap = 0;
          maxGap = 0;
          maxGapIndex = 0;
          maxGapBearing = 0;
        }
        currentBearing = localSorted[i].bearing;
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

      localSorted = localSorted.concat(localSorted.splice(1, maxGapIndex - 1));
      if (!clockwise) {
        // reverse all but the first element
        localSorted = localSorted.concat(localSorted.splice(1, localSorted.length - 1)
          .reverse());
      }

      // ghi#23: Manage Portal Order's manual order, applied on top of whichever anchor/
      // direction produced this base order — orthogonal to the search below.
      if (thisplugin.manualOrderGuids &&
        thisplugin.manualOrderGuids.length === localSorted.length) {

        let byGuid = {};
        localSorted.forEach(function (fp) {
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
          newOrder.length === localSorted.length &&
          newOrder[0].guid === candidateStartingpointGUID) {
          localSorted = newOrder;
        }
      }

      var pa, pb;
      var outbound, possibleline, bearing, distance, flipped, maxLinks, wantOutbound, swapped, intersection;

      for (pa = 0; pa < localSorted.length; pa++) {
        // Kandidaten pb < pa einsammeln und nach Distanz zum neuen Portal (pa) + Distanz zum Anker sortieren.
        // Anchor (pb === 0) bekommt metric = Infinity und kommt damit immer zuerst.
        var newPoint = localSorted[pa].point;
        var anchorPoint = localSorted[0].point;

        var candidates = [];
        for (pb = 0; pb < pa; pb++) {
          var candPoint = localSorted[pb].point;
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

        var paFp = localSorted[pa];
        var paPoint = paFp.point;

        for (var ci = 0; ci < candidates.length; ci++) {
          pb = candidates[ci].pbIndex;
          outbound = 0;

          a = paPoint;
          b = localSorted[pb].point;
          bearing = thisplugin.getBearing(a, b);
          distance = thisplugin.distanceTo(a, b);

          // ghi#23 (link flip): manual direction override, for a mesh link or a portal's own anchor
          // link (pb === 0) alike — the anchor case is handled below via the same SBUL capacity
          // check as radiating mode.
          flipped = thisplugin.isLinkFlipped(localSorted[pa].guid, localSorted[pb].guid);

          if (pb === 0) {
            maxLinks = 8 + thisplugin.availableSBUL * 8;
            wantOutbound = (thisplugin.stardirection === thisplugin.starDirENUM.RADIATING) || flipped;
            if (wantOutbound && localCenterOutgoings < maxLinks) {
              outbound = 1;
            } else {
              localCenterKeys++;
            }

            if (outbound === 1) {
              a = localSorted[pb].point;
              b = localSorted[pa].point;
              localCenterOutgoings++;
            }
          } else if (flipped) {
            a = localSorted[pb].point;
            b = paPoint;
          }

          // The actual direction was swapped either by anchor-link capacity (outbound) or by a
          // mesh-link flip — never by `flipped` alone for pb === 0, since capacity may have
          // refused the swap above and fallen back to the default direction.
          swapped = (pb === 0) ? (outbound === 1) : flipped;

          possibleline = {
            a: a,
            b: b,
            guidA: swapped ? localSorted[pb].guid : localSorted[pa].guid,
            guidB: swapped ? localSorted[pa].guid : localSorted[pb].guid,
            bearing: bearing,
            isJetLink: false,
            isFanLink: (pb === 0),
            creatingFieldsWith: [],
            distance: distance
          };
          intersection = 0;

          // "Respect Intel" stuff: block crossing a currently visible link from a respected
          // faction. A candidate that exactly coincides with such a link (rather than crossing
          // it) is left alone here — intersects() treats shared endpoints as "not crossing" — so
          // it's handled like any other candidate: counted, drawn, and left to the separate
          // "Grey out done links" Task List option to grey out.
          if (thisplugin.isRespectingIntel()) {
            for (i in maplinksAll) {
              if (thisplugin.intersects(possibleline, maplinksAll[i])) {
                intersection++;
                if (possibleline.isFanLink && outbound === 1) localCenterOutgoings--;
                break;
              }
            }
          }
          if (intersection === 0) {
            for (i in localDonelinks) {
              if (thisplugin.intersects(possibleline, localDonelinks[i])) {
                intersection++;
                if (possibleline.isFanLink && outbound === 1) localCenterOutgoings--;
                break;
              }
            }
          }
          if (intersection === 0) {
            for (i in localFanlinks) {
              if (thisplugin.intersects(possibleline, localFanlinks[i])) {
                intersection++;
                if (possibleline.isFanLink && outbound === 1) localCenterOutgoings--;
                break;
              }
            }
          }

          if (localCenterOutgoings > 8 && localCenterOutgoings < maxLinks) {
            // count sbul
            localCenterSbul = Math.ceil((localCenterOutgoings - 8) / 8);
          }

          if (intersection === 0) {
            // Check if Link is a jetlink and add second field
            var thirds = thisplugin.getThirds2(localDonelinks, [], possibleline.a, possibleline.b);

            if (thirds.length === 2) {
              possibleline.isJetLink = true;
            }

            possibleline.creatingFieldsWith = thirds;

            for (var t in thirds) {
              localTriangles.push({
                a: thirds[t],
                b: possibleline.a,
                c: possibleline.b
              });
            }

            localDonelinks.splice(localDonelinks.length - (localSorted.length - pa), 0, possibleline);
            if (swapped) {
              // pb is the source (anchor throwing out via capacity/flip, or a flipped mesh link).
              localSorted[pb].outgoing.push(localSorted[pa]);
              localSorted[pa].incoming.push(localSorted[pb]);

              // Store per-link metadata (field creation) on the source portal.
              // This avoids recomputing geometry during task list export.
              localSorted[pb].outgoingMeta[localSorted[pa].guid] = {
                creatingFieldsWith: possibleline.creatingFieldsWith
              };
            } else {
              localSorted[pa].outgoing.push(localSorted[pb]);
              localSorted[pb].incoming.push(localSorted[pa]);

              localSorted[pa].outgoingMeta[localSorted[pb].guid] = {
                creatingFieldsWith: possibleline.creatingFieldsWith
              };
            }
          }
        }
      }

      return {
        startingpointGUID: candidateStartingpointGUID,
        startingpoint: candidateStartingpoint,
        sortedFanpoints: localSorted,
        donelinks: localDonelinks,
        triangles: localTriangles,
        n: localN,
        centerOutgoings: localCenterOutgoings,
        centerSbul: localCenterSbul,
        centerKeys: localCenterKeys
      };
    }

    if (thisplugin.perimeterpoints.length !== 0) {
      // Right after a brand new polygon just replaced the previous portal set (never on every
      // recalculation), and only while the search is allowed (see
      // thisplugin.isOrientationSearchAllowed), look for whichever anchor and direction reuses
      // the most links already thrown in-game for our own faction, so the freshly (re)calculated
      // plan lines up with real progress. It runs in the background once the portal set has
      // stopped changing (thisplugin.scheduleOrientationSearch); this run keeps building the plan
      // for the anchor and direction currently selected.
      if (thisplugin._orientationSearchPending) {
        thisplugin._orientationSearchPending = false;

        if (thisplugin.isOrientationSearchAllowed()) {
          thisplugin.scheduleOrientationSearch({
            signature: currentSignature,
            fanpoints: thisplugin.fanpoints,
            buildFanPlan: buildFanPlan,
            baseGuid: thisplugin.perimeterpoints[thisplugin.startingpointIndex][0],
            baseClockwise: thisplugin.is_clockwise
          });
        }
      }

      var builtPlan = buildFanPlan(thisplugin.perimeterpoints[thisplugin.startingpointIndex][0], thisplugin.is_clockwise);
      thisplugin.startingpointGUID = builtPlan.startingpointGUID;
      thisplugin.startingpoint = builtPlan.startingpoint;
      this.sortedFanpoints = builtPlan.sortedFanpoints;
      donelinks = builtPlan.donelinks;
      triangles = builtPlan.triangles;
      n = builtPlan.n;
      centerOutgoings = builtPlan.centerOutgoings;
      centerSbul = builtPlan.centerSbul;
      thisplugin.centerKeys = builtPlan.centerKeys;
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
        "\nFields:                " + ((thisplugin.validTriangleCount !== undefined) ? thisplugin.validTriangleCount : triangles.length).toString() +
        "\nBuild AP:              " + (((thisplugin.validLinkCount !== undefined) ? thisplugin.validLinkCount : donelinks.length) * 313 + ((thisplugin.validTriangleCount !== undefined) ? thisplugin.validTriangleCount : triangles.length) * 1250)
        .toString() +
        "\nDestroy AP:            " + ((this.sortedFanpoints.length * 187) + ((thisplugin.validTriangleCount !== undefined) ? thisplugin.validTriangleCount : triangles.length) * 750)
        .toString());
    }


    // Issue #96: validate plan against under-field link distance constraints
    thisplugin.validateUnderFieldLinks();

    // Link order optimization (menu button): recompute once when something invalidated it
    // (anchor/order/geometry change) — never on every recalculation, so manual tweaks made
    // on top via the Task List ↔ button are left alone otherwise.
    if (thisplugin._linkOrderRecomputePending && thisplugin.linkOrderMode !== thisplugin.linkOrderModeENUM.ALGO) {
      thisplugin._linkOrderRecomputePending = false;

      // The Task List's "Grey out done links" option calls isLinkInGame() per link purely for
      // display — irrelevant, and needlessly expensive, while the optimizer itself computes.
      // Suspend it for the duration of the computation and restore it exactly as it was
      // straight after — never via toggleGreyOutExistingLinks() (redundant here), and before
      // the updateLayer() call below, so the final render/Task List refresh sees the real
      // value. _linkOrderRecomputePending is already false, so that call can't loop back here.
      var greyOutWasOn = thisplugin.greyOutExistingLinks;
      thisplugin.greyOutExistingLinks = false;

      thisplugin.manualLinkFlips = (thisplugin.linkOrderMode === thisplugin.linkOrderModeENUM.KEYS)
        ? thisplugin.computeKeysOrderFlips()
        : thisplugin.computeDistanceOrderFlips();

      thisplugin.greyOutExistingLinks = greyOutWasOn;

      thisplugin.updateLayer();
      return;
    }

    // remove any not wanted
    thisplugin.clearAllPortalLabels();

    // and add those we do
    var startLabelDrawn = false;
    // On-map position numbers follow the walk order (relocations included), matching the
    // Task List — never the algorithm's own build order.
    $.each(thisplugin.getDisplayOrder(), function (idx, fp) {
      if (thisplugin.startingpoint !== undefined && fp.point.equals(thisplugin.startingpoint)) {
        drawStartLabel(fp);
        startLabelDrawn = true;
      } else {
        drawNumber(fp, idx);
      }

    });

    $.each(thisplugin.links, function (idx, edge) {
      var dirDashArray = null;
      if (thisplugin.indicateLinkDirection) {
        dirDashArray = [10, 5, 5, 5, 5, 5, 5, 5, "100000"];
      }

      var linkKey = null;
      if (edge.guidA && edge.guidB) {
        linkKey = thisplugin.getDirectedLinkKey(edge.guidA, edge.guidB);
      }
      var isInvalid = (linkKey && thisplugin.invalidUnderFieldLinks && thisplugin.invalidUnderFieldLinks[linkKey]);

      // Already thrown in-game for our faction? Fade it to a muted brownish-red on the map,
      // so only links still left to throw stay bright red — mirrors the Task List's own
      // "Grey out done links" toggle (isLinkInGame), rather than a separate switch.
      var isDone = thisplugin.greyOutExistingLinks && edge.guidA && edge.guidB &&
        thisplugin.isLinkInGame(edge.guidA, edge.guidB);

      var baseStyle = {
        color: isDone ? '#8B3A3A' : '#FF0000',
        opacity: isDone ? 0.5 : 1,
        weight: 1.5,
        clickable: false,
        interactive: false,
        smoothFactor: 10
      };

      if (isInvalid) {
        // Base: fine dotted line (keep color)
        drawLink(edge.a, edge.b, $.extend({}, baseStyle, {
          dashArray: [10,5,5,5,5,5,50,30,5,3,5,3,5,10,15,5,15,5,15,10,5,3,5,3,5,30],
          lineCap: 'round'
        }));


        /*
        // Overlay: direction indicator (if enabled)
        if (dirDashArray) {
          drawLink(edge.a, edge.b, $.extend({}, baseStyle, {
            dashArray: dirDashArray
          }));
        }
        */
      } else {
        drawLink(edge.a, edge.b, $.extend({}, baseStyle, {
          dashArray: dirDashArray
        }));
      }
    });


    // Blockers: the links to break as red dotted lines, and a cross on each portal to
    // destroy for them.
    var blockerPlan = thisplugin.computeBlockerPlan();
    blockerPlan.blockers.forEach(function (blocker) {
      drawLink(blocker.a, blocker.b, {
        color: '#FF0000',
        opacity: 1,
        weight: 2.5,
        dashArray: [2, 7],
        lineCap: 'round',
        clickable: false,
        interactive: false,
        smoothFactor: 10
      });
    });

    var blockerMarkerPoints = blockerPlan.stops.map(function (stop) { return stop.point; });
    var planPortalByGuid = {};
    thisplugin.getDisplayOrder().forEach(function (fp) { planPortalByGuid[fp.guid] = fp; });
    Object.keys(blockerPlan.onRoute).forEach(function (guidOrKey) {
      if (planPortalByGuid[guidOrKey]) blockerMarkerPoints.push(planPortalByGuid[guidOrKey].point);
    });
    blockerMarkerPoints.forEach(function (point) {
      L.marker(map.unproject(point, thisplugin.PROJECT_ZOOM), {
        icon: L.divIcon({
          className: 'plugin_fanfields3_blocker_marker',
          iconSize: [18, 18],
          iconAnchor: [9, 9],
          html: '&#10006;'
        }),
        interactive: false
      }).addTo(thisplugin.linksLayerGroup);
    });

    var trianglesToDraw = (thisplugin.validTriangles) ? thisplugin.validTriangles : triangles;

    $.each(trianglesToDraw, function (idx, triangle) {
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

    // Keep an open Task List and Statistics dialog in sync with the background plan (new
    // links appearing in-game, fan field rotation, etc.) without requiring them to be reopened.
    thisplugin.refreshTaskListIfOpen();
    thisplugin.refreshStatisticsIfOpen();

    thisplugin.lockIfPlanComplete();
  };


  // as calculating portal marker visibility can take some time when there's lots of portals shown, we'll do it on
  // a short timer. this way it doesn't get repeated so much
  //
  // The lock only holds back passive recalculations (map moves, IITC data refreshes). When
  // `userRequested` is true — the agent changed something about the plan itself (a menu option,
  // the drawn polygon, a layer switch) — a locked plan is recalculated anyway, then locks again
  // once that calculation is complete.
  thisplugin._recalculationRequestedByUser = false;
  thisplugin.delayedUpdateLayer = function (wait, userRequested) {
    if (userRequested) thisplugin._recalculationRequestedByUser = true;

    if (thisplugin.timer === undefined) {
      thisplugin.timer = setTimeout(function () {


        thisplugin.timer = undefined;

        var byUser = thisplugin._recalculationRequestedByUser;
        thisplugin._recalculationRequestedByUser = false;
        if (byUser && thisplugin.is_locked) {
          thisplugin.is_locked = false;
          thisplugin._lockWhenPlanComplete = true;
          thisplugin.updateLockButton();
        }

        if (!thisplugin.is_locked) {
          thisplugin.updateLayer();
        }
      }, wait * 350);
    }

  };

  // Rebuild thisplugin.locations (portal guid -> projected point) and thisplugin.intelLinks
  // (currently existing in-game links) straight from IITC's live portal/link data. This is
  // the cheap subset of what updateLayer() does — it doesn't touch the plan itself (link/field
  // order, drawn layers), just the live game state the Task List reads to grey out/strike
  // through captured portals and already-thrown links. Safe to run even while Locked, unlike
  // the full plan recompute Locked exists to suppress — see thisplugin.onLiveDataChanged.
  thisplugin.refreshLiveGameData = function () {
    thisplugin.locations = [];
    $.each(window.portals, function (guid, portal) {
      thisplugin.locations[guid] = map.project(portal.getLatLng(), thisplugin.PROJECT_ZOOM);
    });

    thisplugin.intelLinks = {};
    $.each(window.links, function (guid, link) {
      var lls = link.getLatLngs();
      thisplugin.intelLinks[guid] = {
        a: map.project(lls[0], thisplugin.PROJECT_ZOOM),
        b: map.project(lls[1], thisplugin.PROJECT_ZOOM),
        team: link.options.team,
        guidA: thisplugin.getLinkEndpointGuid(link, 'oGuid'),
        guidB: thisplugin.getLinkEndpointGuid(link, 'dGuid')
      };
    });
    thisplugin.indexOwnLinks();
  };

  // Called when IITC's own portal/link data changes (new links thrown in-game, portals
  // captured, etc. — see the mapDataRefreshEnd/requestFinished hooks below). Unlike
  // moveend/zoom, which just changes which area the user is looking at, this reflects an
  // actual change to the game state, so it should still reach the Task List even while
  // Locked — but only as the lightweight live-data refresh above, not the full plan recompute.
  thisplugin.onLiveDataChanged = function (wait) {
    if (thisplugin.is_locked) {
      thisplugin.refreshLiveGameData();
      thisplugin.refreshTaskListIfOpen();
    } else {
      thisplugin.delayedUpdateLayer(wait);
    }
  };

  // IITC's own portal/link data refresh (the countdown shown in the status bar) runs on a
  // JS timer, which mobile browsers/PWAs throttle or fully suspend while the app is in the
  // background (screen locked, app switched away from) — so the plan and Task List can go
  // stale until something nudges IITC into refreshing. Panning/zooming doesn't actually do
  // that by itself (moveend only fetches newly-visible tiles; it's zooming's tile-grid change
  // that happens to force new ones) — IITC's real refresh is time-based and additionally
  // skipped while it considers the user idle. So this calls IITC's own refresh entry points
  // directly: window.idleReset() (otherwise the idle check would just skip the request) and
  // window.mapDataRequest.start() (the actual server refetch), clearing its request cache
  // first so it can't just resolve from what's already cached. Called as soon as the page is
  // visible/focused again — see the visibilitychange/focus listeners in setup(). The
  // resulting data refresh, once IITC completes it, reaches this plugin via the existing
  // 'mapDataRefreshEnd'/'requestFinished' hooks below, which recompute the plan and refresh
  // an open Task List as usual.
  thisplugin.forceMapDataRefresh = function () {
    if (!window.map) return;

    // visibilitychange and focus commonly fire together on mobile browsers; collapse anything
    // within 1s of the previous call into a single actual refresh.
    var now = Date.now();
    if (thisplugin._lastForceRefreshAt && (now - thisplugin._lastForceRefreshAt) < 1000) return;
    thisplugin._lastForceRefreshAt = now;

    window.map.invalidateSize();

    if (typeof window.idleReset === 'function') window.idleReset();

    if (window.mapDataRequest) {
      if (window.mapDataRequest.cache && window.mapDataRequest.cache._cache) {
        window.mapDataRequest.cache._cache = {};
      }
      if (typeof window.mapDataRequest.start === 'function') {
        window.mapDataRequest.start();
      }
    }
  };

  var symbol_clockwise = '&#8635;';
  var symbol_counterclockwise = '&#8634;';
  var symbol_clipboard = '&#128203;';
  var symbol_target = '&#127919;';

  // Padlock icons for the Lock/Unlock control (map topleft button and, via CSS color, the
  // sidebar Lock/Unlock button's icon too): plain SVG rather than the 🔒/🔓 emoji, since an
  // emoji's color is fixed by the OS/browser font and can't be recolored to green/red.
  var lockIconOpen = '<svg class="plugin_fanfields3_lock_svg" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M18,8H17V6A5,5 0 0,0 12,1C10.06,1 8.4,2.13 7.6,3.75L9.32,4.44C9.75,3.6 10.79,3 12,3A3,3 0 0,1 15,6V8H6A2,2 0 0,0 4,10V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V10A2,2 0 0,0 18,8M12,17A2,2 0 0,1 10,15A2,2 0 0,1 12,13A2,2 0 0,1 14,15A2,2 0 0,1 12,17Z"/></svg>';
  var lockIconClosed = '<svg class="plugin_fanfields3_lock_svg" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/></svg>';

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
            '<a id="fanfieldTaskListButton" href="javascript: void(0);" class="fanfields-control" title="Fan Fields 3 - Task List">' +
            symbol_clipboard + '</a>'
          )
          .on("click", "#fanfieldTaskListButton", function () {
            thisplugin.exportText();
          });

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

        $(container)
          .append(
            '<a id="fanfieldPickAnchorButton" href="javascript: void(0);" class="fanfields-control" title="Pick anchor: click a portal on the map to make it the anchor, even one inside the hull">' +
            symbol_target + '</a>'
          )
          .on("click", "#fanfieldPickAnchorButton", function () {
            thisplugin.toggleAnchorPicking();
          });

        $(container)
          .append(
            '<a id="fanfieldLockButton" href="javascript: void(0);" class="fanfields-control" title="Unlocked: click to freeze the plan and stop it recalculating">' +
            lockIconOpen + '</a>'
          )
          .on("click", "#fanfieldLockButton", function () {
            thisplugin.lock();
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

  thisplugin.getMaxDialogHeight = function () {
    const vh = (window.visualViewport && window.visualViewport.height) ? window.visualViewport.height : window.innerHeight;

    // On mobile, the phone's own on-screen navigation bar (or the app's persistent bottom
    // toolbar) commonly overlaps the bottom of the visible viewport without being reflected
    // in vh/innerHeight at all — an edge-to-edge WebView reports the full screen height, then
    // the OS/app draws its own controls on top of it. Leave generous extra clearance there so
    // a dialog's own bottom button row doesn't end up hidden underneath it. Desktop browsers
    // don't have this problem, so keep their margin minimal.
    var bottomClearance = (L.Browser.mobile) ? 150 : 20;
    return Math.max(200, Math.floor(vh) - bottomClearance);
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
        '<a class="plugin_fanfields3_btn" onclick="window.plugin.fanfields.saveBookmarks();" title="Create New Portal Potential Future">Write&nbsp;Bookmarks</a> ';

      // Only Use Bookmarked Portals
      buttonBookmarksOnly =
        '<a class="plugin_fanfields3_btn" id="plugin_fanfields3_bookarks_only_btn" onclick="window.plugin.fanfields.useBookmarksOnly();" title="Help Enlightened Strong Victory">&#128278;&nbsp;All Portals</a> ';
    }
    // Show as list
    var buttonPortalList = '<a class="plugin_fanfields3_btn" onclick="window.plugin.fanfields.exportText();" title="OpenAll Link Create Star">' +
      symbol_clipboard + '&nbsp;Task&nbsp;List</a> ';

    // Manage order
    var buttonManageOrder =
      '<a class="plugin_fanfields3_btn" id="plugin_fanfields3_manageorderbtn" onclick="window.plugin.fanfields.showManageOrderDialog();" title="Use Restraint Follow Easy Path">Manage&nbsp;order</a> ';



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
      '<a class="plugin_fanfields3_btn" id="plugin_fanfields3_clckwsbtn" onclick="window.plugin.fanfields.toggleclockwise();" title="Begin Journey Breathe XM ">Clockwise&nbsp;' +
      symbol_clockwise + '</a> ';
    var buttonLock =
      '<a class="plugin_fanfields3_btn" id="plugin_fanfields3_lockbtn" onclick="window.plugin.fanfields.lock();" title="Avoid XM Message Lie">&#128275;&nbsp;Unlocked</a> ';

    var buttonStarDirection =
      '<a class="plugin_fanfields3_btn" id="plugin_fanfields3_stardirbtn" onclick="window.plugin.fanfields.toggleStarDirection();" title="Change Perspective Technology">Inbounding</a> ';
    // Available SBUL
    var buttonSBUL =
      '<span id="plugin_fanfields3_availablesbul" class="plugin_fanfields3_multibtn" style="display: none;">' +
      '    <span class="plugin_fanfields3_availablesbul_label">Available&nbsp;SBUL:</span>' +
      '    <span class="plugin_fanfields3_multibtn" style="flex: 50%">' +
      '        <a id="plugin_fanfields3_inscsbulbtn" class="plugin_fanfields3_minibtn" onclick="window.plugin.fanfields.decreaseSBUL();" >' + symbol_dec +
      '</a>' +
      '        <span id="plugin_fanfields3_availablesbul_count" class="plugin_fanfields3_minibtn">' + (thisplugin.availableSBUL) + '</span>' +
      '        <a id="plugin_fanfields3_decsbulbtn" class="plugin_fanfields3_minibtn" onclick="window.plugin.fanfields.increaseSBUL();">' + symbol_inc +
      '</a>' +
      '    </span>' +
      '</span>';

    // Respect Intel
    var buttonRespect =
      '<a class="plugin_fanfields3_btn" id="plugin_fanfields3_respectbtn" onclick="window.plugin.fanfields.toggleRespectCurrentLinks();" title="Question Conflict Data">Respect&nbsp;Intel:&nbsp;NONE</a> ';

    // Blockers: destroy/capture rows in the Task List for links that block the plan
    var buttonBlockers =
      '<a class="plugin_fanfields3_btn" id="plugin_fanfields3_blockers_btn" onclick="window.plugin.fanfields.toggleManageBlockers();" title="Add the portals to destroy to the Task List so that links crossing the plan (from factions Respect Intel does not avoid) are gone before the links they block are thrown">Blockers:&nbsp;ON</a> ';
    var buttonBlockerDetour =
      '<a class="plugin_fanfields3_btn" id="plugin_fanfields3_blocker_detour_btn" onclick="window.plugin.fanfields.cycleBlockerMaxDetour();" title="Longest extra walk one Destroy stop may add to the route">Max&nbsp;detour:&nbsp;500m</a> ';

    // Show link dir
    var buttonLinkDirectionIndicator =
      '<a class="plugin_fanfields3_btn" id="plugin_fanfields3_direction_indicator_btn" onclick="window.plugin.fanfields.toggleLinkDirIndicator();" title="Technology Intelligence See All">Show&nbsp;link&nbsp;dir:&nbsp;ON</a> ';

    // Grey out / strike through links (and finished portals) that already exist in-game,
    // in the Task List and as a faded color on the map itself
    var buttonGreyOutExistingLinks =
      '<a class="plugin_fanfields3_btn" id="plugin_fanfields3_greyout_existing_btn" onclick="window.plugin.fanfields.toggleGreyOutExistingLinks();" title="Grey out and strike through Task List links (and portals), and fade already-thrown links on the map, for links that already exist in-game for your faction">Grey&nbsp;out&nbsp;done&nbsp;links:&nbsp;ON</a> ';

    // Link order optimization: leaves the algorithm itself untouched and only reorients mesh
    // links, either for fewer keys on any single portal or for less backtracking while walking.
    var buttonLinkOrder =
      '<a class="plugin_fanfields3_btn" id="plugin_fanfields3_linkorder_btn" onclick="window.plugin.fanfields.cycleLinkOrderMode();" title="Reorient mesh links (not the algorithm itself): fewer keys on any one portal, or less backtracking while walking">Optim:&nbsp;Less&nbsp;walking</a> ';

    // Shift anchor
    var buttonShiftAnchor =
      '<a class="plugin_fanfields3_btn" onclick="window.plugin.fanfields.previousStartingPoint();" title="Less Chaos More Stability">Shift&nbsp;left&nbsp;' +
      symbol_counterclockwise + '</a>' + // clockwise &#8635;
      '<a class="plugin_fanfields3_btn" onclick="window.plugin.fanfields.nextStartingPoint();" title="Restraint Path Gain Harmony">Shift&nbsp;right&nbsp;' +
      symbol_clockwise + '</a>';

    // Pick anchor: click this, then click any portal on the map (even inside the hull) to
    // make it the anchor. Toggle-styled — stays highlighted while armed, until a portal is
    // clicked or the button is pressed again.
    var buttonPickAnchor =
      '<a class="plugin_fanfields3_btn" id="plugin_fanfields3_pickanchor_btn" onclick="window.plugin.fanfields.toggleAnchorPicking();" title="Click a portal on the map to make it the anchor, even one inside the hull">' +
      symbol_target + '&nbsp;Pick&nbsp;anchor</a> ';

    var buttonStats =
      '<a class="plugin_fanfields3_btn" id="plugin_fanfields3_statsbtn" onclick="window.plugin.fanfields.showStatistics();" title="See Truth Now">Stats</a> ';

    // Write Drawtools
    var buttonDrawTools =
      '<a class="plugin_fanfields3_btn" id="plugin_fanfields3_exportDTbtn" onclick="window.plugin.fanfields.exportDrawtools();" title="Help Shapers Create Future">Write&nbsp;DrawTools</a> ';

    // Write Arcs
    var buttonArcs = ''
    if (typeof window.plugin.arcs !== 'undefined' && window.PLAYER.team === 'ENLIGHTENED') {
      buttonArcs =
        '<a class="plugin_fanfields3_btn" id="plugin_fanfields3_exportArcsBtn" onclick="window.plugin.fanfields.exportArcs();" title="Field Together Improve Human Mind">Write&nbsp;Arcs</a> ';
    };

    var buttonHelp = '<a class="plugin_fanfields3_btn" id="plugin_fanfields3_helpbtn" onclick="window.plugin.fanfields.help();" title="Help" >Help</a> ';

    var fanfields_buttons = '<span class="plugin_fanfields3_multibtn plugin_fanfields3_titlebar">Fan Fields 3</span>';

    fanfields_buttons +=
      buttonShiftAnchor +
      buttonPickAnchor +
      buttonClockwise +
      buttonStarDirection +
      buttonSBUL +
      buttonLock +
      buttonRespect +
      buttonBlockers +
      buttonBlockerDetour +
      buttonBookmarksOnly +
      buttonLinkDirectionIndicator +
      buttonGreyOutExistingLinks +
      buttonLinkOrder +
      buttonPortalList +
      buttonManageOrder +
      buttonDrawTools +
      buttonBookmarks +
      buttonArcs +
      buttonStats +
      buttonHelp;

    $('#sidebar')
      .append('<div id="fanfields3" class="plugin_fanfields3_sidebar"></div>');

    thisplugin.addFfButtons();

    if (!window.plugin.drawTools) {
      var width = 400;
      thisplugin.MaxDialogWidth = thisplugin.getMaxDialogWidth();
      if (thisplugin.MaxDialogWidth < width) {
        width = thisplugin.MaxDialogWidth;
      }

      dialog({
        html: '<b>Fan Fields 3</b><p>Fan Fields 3 requires the IITC Drawtools plugin</p><a href="https://iitc.app/download_desktop#draw-tools-by-breunigs">Download here</a>',
        id: 'plugin_fanfields3_alert_dependencies',
        title: 'Fan Fields 3 - Missing dependency',
        width: width
      });

      $('#fanfields3')
        .empty();
      $('#fanfields3')
        .append("<i>Fan Fields requires IITC drawtools plugin.</i>");

      return;
    }



    $('#fanfields3')
      .append(fanfields_buttons);

    // Default Respect Intel to the player's own faction (ENL/RES) rather than NONE, so a
    // fresh session starts out avoiding crossing (and re-throwing) the agent's own
    // already-built links without having to click the button first. Done here in setup()
    // rather than at the top-level default above, since window.PLAYER isn't reliably set
    // yet when this script's own top-level code first runs (see thisplugin.getOwnFactionTeam).
    var ownTeamForDefault = thisplugin.getOwnFactionTeam();
    if (ownTeamForDefault === window.TEAM_ENL) {
      thisplugin.respectIntelLinksMode = thisplugin.respectIntelLinksModeENUM.ENL;
    } else if (ownTeamForDefault === window.TEAM_RES) {
      thisplugin.respectIntelLinksMode = thisplugin.respectIntelLinksModeENUM.RES;
    }

    thisplugin.updateRespectIntelButton();
    thisplugin.updateManageBlockersButton();
    thisplugin.updateBlockerDetourButton();
    thisplugin.updateGreyOutExistingLinksButton();
    thisplugin.updateLinkOrderModeButton();
    thisplugin.updateLockButton();

    //         window.pluginCreateHook('pluginBkmrksEdit');

    //         window.addHook('pluginBkmrksEdit', function (e) {
    //             if (thisplugin.use_bookmarks_only && e.target === 'portal') {
    //                 thisplugin.delayedUpdateLayer(0.5);
    //             }
    //         });

    window.pluginCreateHook('pluginDrawTools');

    window.addHook('pluginDrawTools', function (e) {
      thisplugin.delayedUpdateLayer(0.5, true);
    });
    window.addHook('mapDataRefreshEnd', function () {
      thisplugin.onLiveDataChanged(0.5);
    });
    window.addHook('requestFinished', function () {
      setTimeout(function () {
        thisplugin.onLiveDataChanged(3.0);
      }, 1);
    });

    // "Pick anchor" (sidebar button): the next portal clicked/selected on the map becomes
    // the anchor, hull or not. Disarms itself after one pick (or a failed one), same as most
    // single-shot picking tools. A portal outside the current plan (outside the drawn
    // polygon(s), or excluded by Bookmarks-only) can't be set — warn instead of failing silently.
    window.addHook('portalSelected', function (data) {
      if (!thisplugin.isPickingAnchor) return;

      thisplugin.isPickingAnchor = false;
      thisplugin.updateAnchorPickingButton();

      var guid = data && data.selectedPortalGuid;
      if (!guid) return;

      if (!thisplugin.setAnchorByGuid(guid)) {
        var width = 380;
        thisplugin.MaxDialogWidth = thisplugin.getMaxDialogWidth();
        if (thisplugin.MaxDialogWidth < width) width = thisplugin.MaxDialogWidth;

        dialog({
          html: '<p>This portal is not part of the current Fan Fields plan — it\'s outside the drawn polygon(s), or excluded by Bookmarks-only.</p>',
          id: 'plugin_fanfields3_alert_anchor_outside',
          title: 'Fan Fields 3 - Pick anchor',
          width: width,
          closeOnEscape: true
        });
      }
    });

    window.map.on('moveend', function () {
      thisplugin.delayedUpdateLayer(0.5);
    });
    window.map.on('overlayadd overlayremove', function () {
      setTimeout(function () {
        thisplugin.delayedUpdateLayer(1.0, true);
      }, 1);
    });
    window.map.on('zoomend', function () {
      if (thisplugin.showOrderPath) {
        thisplugin.updateOrderPath();
      }
    });

    // Force a real IITC data refresh as soon as the page is visible/focused again, so coming
    // back from the background (app switch, screen lock) doesn't require manually panning or
    // zooming first. visibilitychange is the standard signal for this; focus is also bound
    // since some mobile browsers/PWAs fire that instead of (or without) visibilitychange.
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        thisplugin.forceMapDataRefresh();
      }
    });
    window.addEventListener('focus', function () {
      thisplugin.forceMapDataRefresh();
    });

    // Keep an open Task List current between plan recalculations — available key counts
    // (LiveInventory/Keys plugin) and in-game link/portal completion can change on their own
    // timeline, not just when this plugin recomputes the plan. Refreshes live game data
    // (thisplugin.locations/intelLinks) itself first, rather than only repainting from
    // whatever a mapDataRefreshEnd/requestFinished hook last put there: on some platforms
    // (observed on IITC Mobile) IITC's own map updates without those hooks ever firing for
    // this plugin, which would otherwise leave the Task List showing a stale, already-thrown
    // link as still outstanding indefinitely.
    setInterval(function () {
      if (thisplugin.isTaskListDialogOpen()) {
        thisplugin.refreshLiveGameData();
        thisplugin.refreshTaskListDialog();
      }
    }, 10000);

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
script.id = 'iitc_plugin_fanfields3';
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
  info.script = {
    version: GM_info.script.version,
    name: GM_info.script.name,
    description: GM_info.script.description
  }
};
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement)
.appendChild(script);




// EOF
