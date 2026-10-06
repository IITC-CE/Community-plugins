// ==UserScript==
// @author          Avataar120
// @id              fanfields3@Avataar120
// @name            Fan Fields 3
// @category        Layer
// @version         6.3.0.20261005
// @description     Fork of Heistergand's Fan Fields 2 (thanks Heistergand for the original work!). Plans the largest tidy set of nested fields, and adds: walking optimization (less backtracking between portals, Destroy stops placed where they add the least walking), automatic best anchor/direction search that reuses your faction's existing links, Blockers handling in the Task List, plan locking, Pick anchor and Exclude portals on the map, a Task List that follows your progress — correctly sequencing outbound plans and rebalancing links when one gets thrown the wrong way — and can Reroute the steps left from where you stand or preview the whole walk with Walk sim, key counts read from a screen recording of your keys in Ingress (Keys plugin) or spent automatically as you throw links (now safe to use across several of your devices at once), and route export to Google Maps / Portal Route or a step-by-step plan report ("Plan details" menu). Enable from the layer chooser.
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
  plugin_info.dateTimeVersion = '2026-10-05-200000';
  plugin_info.pluginId = 'fanfields';

  /* global L, $, dialog, map, portals, links, plugin  -- eslint*/
  /* exported setup, changelog -- eslint */

  var arcname = (window.PLAYER && window.PLAYER.team === 'ENLIGHTENED') ? 'Arc' : '***';
  var changelog = [{
      version: '6.3.0',
      changes: [
        'NEW: Added a "Plan details" entry to the hamburger menu, gathering three ways to review or export the current plan -- "Print route" (the Task List, printable), "Print step by step plan" (one page per portal with the links to throw there, a running total of links/fields, and a map of progress so far, saved as a file you can open or print from your phone), and "Live simulation" (the planned walk previewed on the map, portal by portal). The separate Print and Walk sim buttons previously in the Task List moved here.',
        'IMPROVE: Live simulation (previously "Walk sim") always draws each portal\'s own links as it reaches them now, instead of that being a separate option to turn on.',
        'FIX: The Statistics window\'s "Real activity" used to count every link and field your whole faction threw/formed, not just your own -- it now reads the Faction and All Comm feeds instead of the plan\'s own intel data, so it only counts what you personally did, limited to today (Comm history on Niantic\'s own servers doesn\'t reliably reach further back than that).',
        'FIX: "Less walking" could flip a link\'s direction in a way that, combined with an earlier flip, made the plan impossible to walk in a single pass (a portal needing a key from another portal that itself needed one from the first) — such a flip is no longer made.',
        'FIX: In outbound mode, the Task List could keep showing a portal as "moved by Less walking" even after it had been placed back in its natural position by the GPS-based reordering ahead of the anchor.',
        'FIX: "Less walking" could relocate a portal to a spot that looked cheaper on paper but actually made the real walk longer; it now double-checks the actual cost after relocating and undoes any move that doesn\'t really pay off -- including when that move only looked justified because it was compared to the wrong spot.',
        'IMPROVE: "Less walking" now also considers flipping a mesh link to reach a genuinely cheaper spot elsewhere in the walk, not just reverting a relocation that its own immediate neighbors couldn\'t justify.',
        'IMPROVE: In outbound mode, the walking order ahead of the anchor now also tries starting from "Less walking"\'s own existing order, keeping it when it\'s shorter than reordering from scratch.',
        'FIX: Spent-key tracking is now safe to use across several devices at once (with the separate Simple Cloud Sync plugin): a key is never deducted twice for the same link, and a brand new device waits for its first sync to land before assuming it has no charged links yet.',
      ],
    },{
      version: '6.2.1',
      changes: [
        'FIX: The automatic "Spend keys on throw" no longer re-spends a key for a link you had already thrown before reloading IITC, or loses track of one thrown while IITC was closed — each link now only ever spends a key once, whenever it\'s first seen.',
      ],
    },{
      version: '6.2.0',
      changes: [
        'NEW: The Statistics window now also shows how many links and fields your faction has actually thrown or formed in-game, read straight from the Intel, next to the plan\'s own totals — so you can compare real progress against the plan. A Today / 2 days / 7 days toggle lets you look further back.',
      ],
    },{
      version: '6.1.1',
      changes: [
        'FIX: On mobile, the "Keys video" counts review window was still a bit too tall, with its Apply/Cancel buttons running under the phone\'s navigation bar.',
        'FIX: Reading a "Keys video" recording no longer gets stuck when the phone\'s screen locks and unlocks during the read.',
        'FIX: "Less walking" could send you off to a portal that only belongs with a different part of the walk, and back again, instead of leaving it there and visiting a nearby portal right after the anchor like it should.',
        'FIX: Zooming the map could unlock a Locked plan and recalculate it on the spot, sometimes before all portals around you had finished loading — showing "unknown title" rows in the Task List until they did. Locked now only reacts to an actual change you make to the plan itself.',
      ],
    },{
      version: '6.1.0',
      changes: [
        'IMPROVE: "Keys video" now reads a recording noticeably faster, by reading several frames at once instead of one at a time.',
        'IMPROVE: In the "Keys video" window, the Apply and Cancel buttons moved to the bottom of the window, next to each other, and both now close the window once clicked.',
      ],
    },{
      version: '6.0.0',
      changes: [
        'NEW: Added an "Exclude portals" shortcut on the map (no-entry icon): click it, then click plan portals to leave them out of the plan (or bring them back in), and click it again when done. Excluded portals show a no-entry sign and are remembered when an op is saved, so they come back when that op is reloaded. The hamburger menu moved to the top of the map buttons, and "Pick anchor" is now an entry in that menu instead of its own icon.',
        'NEW: In outbound mode, if a link planned to come INTO the anchor ends up thrown OUT of it instead (the only way possible once you\'re standing at the anchor), the plan now automatically swaps another not-yet-thrown outbound link to inbound to compensate, keeping the total outbound links matched to your SBUL count — kept up to date even while the plan is Locked.',
        'NEW: In outbound mode, the anchor now shows up in the Task List right after the last portal it links to, instead of first, since throwing those links needs keys you only get by visiting those portals first. The walk leading up to the anchor is also ordered to minimize your walking from your current position (GPS, else IITC\'s own location, else the map center).',
        'NEW: "Less walking" now also keeps as many double fields (jet links) intact when choosing the walk order ahead of the anchor in outbound mode, not just the shortest walk, so shifting the anchor no longer risks losing fields the plan could otherwise form.',
        'NEW: Throwing a link now automatically spends one key for its destination portal from the Keys plugin (toggle in Options: "Spend keys on throw").',
        'NEW: Walk sim now also draws each portal\'s own links and completed fields (thin cyan) as the simulation reaches them, with a small running counter of links, fields and distance walked so far; the drawing stays on the map once the simulation finishes, until you tap the screen.',
        'NEW: The Statistics window now also shows the plan\'s total walking distance.',
        'IMPROVE: Destroying a portal that was a Destroy stop now clears its red cross on the map right away, even while the plan is Locked, and its Task List row turns pale yellow and struck through like any other finished portal instead of just disappearing.',
        'IMPROVE: Target portal names in the Task List\'s link details are now clickable like every other portal name: flies to and selects that portal on the map, and links to Google Maps when printed.',
        'IMPROVE: Shifting the anchor and other plan changes are noticeably faster now, since the walk order no longer gets recalculated several times over for the same redraw.',
        'IMPROVE: Plan links are now drawn purple instead of red, so they stand out better from Blockers and other red markers.',
        'FIX: "Less walking" now correctly spots a portal that isn\'t really on the way and reroutes around it, including the very last portal of the walk, which it used to skip entirely — some clear shortcuts were being missed because it compared the wrong distances.',
        'FIX: The Fields column in the Task List could grow so wide, next to a portal with many fields, that other portals\' smaller field counts ended up centered outside the visible area, making them look empty.',
      ],
    },{
      version: '5.2.0',
      changes: [
        'NEW: A saved op now also remembers the plugin options and the anchor it was saved with, and reloading it restores all three together — not just the drawing.',
        'NEW: The plan\'s options and anchor are now kept up to date on their own, the same way the drawing already was, so they survive closing and reopening IITC even without using Manage Ops.',
        'NEW: Shifting the anchor or changing an option now also counts as an unsaved change, so Manage Ops warns before it would be lost.',
        'IMPROVE: Opening Manage Ops now puts the cursor straight into the new op\'s name field, so a name can be typed right away.',
      ],
    },{
      version: '5.1.0',
      changes: [
        'NEW: Manage Ops menu item lets you save your current drawing under a name, and reload, rename, update or delete it later. Loading a saved op replaces everything currently drawn and moves the map to it; a warning appears before any of these actions would discard unsaved changes. A Clear drawing button is also added there to wipe the current drawing.',
      ],
    },{
      version: '5.0.0',
      changes: [
        'NEW: Redesigned menu. A hamburger icon on the map opens a simple menu (Options, Manage order, Stats, Help), and a new Options dialog gathers all the settings (Direction, Fan mode, Available SBUL, Respect Intel, Blockers, Blockers max detour, Portal selection) in one place. Every change there is saved automatically and remembered the next time you open the plugin.',
        'DEL: Removed little-used sidebar controls: Grey out done links, Optim (Link order cycling), Write to DrawTools, Write Arcs, Write Bookmarks, and Show link direction. The sidebar panel itself is now empty — everything moved into the map\'s own menu and the new Options dialog.',
        'FIX: On a freshly drawn area with none of your own links nearby yet, the plan could stay unlocked indefinitely, even once the map had fully finished loading.',
      ],
    },{
      version: '4.0.0',
      changes: [
        'NEW: Sends anonymous usage stats (faction, rough region, time active) to help understand how the plugin is actually used, while keeping agents fully anonymous.',
      ],
    },{
      version: '3.4.1',
      changes: [
        'FIX: Picking an anchor portal inside the selection (Pick anchor, or the automatic search choosing one) could sometimes miss the widest gap between the surrounding portals when it fell across due north, leading to a less efficient starting order for the fan.',
      ],
    },{
      version: '3.4.0',
      changes: [
        'NEW: "Keys video" button in the Task List (Keys plugin only): record your phone screen while scrolling through your keys in Ingress, pick the recording (or screenshots), and the key counts of the plan\'s portals are read from it and written into the Keys plugin once you have checked them. The text is read on your device (the recognition library is downloaded once from a CDN); nothing is sent anywhere.',
        'NEW: In the Task List, the Keys cell turns red when you hold fewer keys for a portal than the plan needs, on the printed Task List too.',
        'NEW: A "Keys video" button (a key with a small camera) on the map, next to the other Fan Fields 3 buttons, opens the same window directly.',
      ],
    },{
      version: '3.3.1',
      changes: [
        'FIX: On mobile, tapping a portal name in the Task List now selects that portal the same way a tap on the map does: tapping its name in the bottom bar opens its own details, instead of those of the last portal opened by hand, or just the menu.',
        'FIX: The plan no longer locks itself while IITC is still loading the map: it waits until all portals and links are loaded and the plan is calculated from them.',
      ],
    },{
      version: '3.3.0',
      changes: [
        'NEW: The Task List opens with the links of the first portal still to do already unfolded.',
        'NEW: When the portal whose links are unfolded in the Task List becomes finished (Action "Nothing"), its links fold away and the next portal still to do unfolds instead.',
        'FIX: A finished portal (Action "Nothing") now stays finished in the Task List and for Reroute, even when its data is briefly missing, its links are hidden at the current zoom or key counts refresh. It only goes back when the plan changes, when the portal is destroyed, flipped or drops under 8 resonators, or when one of its links disappears because the portal at the other end was lost.',
      ],
    },{
      version: '3.2.1',
      changes: [
        'FIX: A finished portal (Action "Nothing") now always shows pale yellow and struck through in the Task List, like every other finished portal, even when it was green (moved earlier by Less walking) or carried the red cross of a blocking link it frees. The printed Task List follows the same rule.',
      ],
    },{
      version: '3.2.0',
      changes: [
        'NEW: Reroute button next to Refresh in the Task List: reorders the steps still to do so that, from your current position (GPS, else IITC\'s own location, else the map center), you walk as little as possible. Steps already done stay at the top, each portal is still captured and its keys gathered before anyone links to it (unless it is already yours with enough keys), and no field is lost. Links and fields stay the same, the map numbers, Destroy stops, Google Maps and Portal Route follow the new order, and it works while the plan is locked too. The new order holds until the plan changes or Reset link orders is used.',
        'FIX: A field closed by a different link than planned, when the walk order was changed (Less walking), is now counted and drawn instead of being left out.',
      ],
    },{
      version: '3.1.3',
      changes: [
        'IMPROVE: The Task List now opens scrolled to the first step still to do, with the step just before it kept in view, instead of always starting at the top.',
      ],
    },{
      version: '3.1.2',
      changes: [
        'IMPROVE: New, more modern plugin icon: a white hand fan on a violet-to-pink tile with a big 3 in its center.',
      ],
    },{
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
  //  - thisplugin.setAnchorByGuid (the "Pick anchor" menu entry): an explicit user choice —
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
  // Pick anchor menu entry and the portalSelected hook in setup()).
  thisplugin.isPickingAnchor = false;

  // "No entry" shortcut: while armed, clicking a plan portal on the map marks it to be left out
  // of the plan (or, clicked again, puts it back in) — see thisplugin.toggleExcludedPortal and
  // the portalSelected hook in setup(). Nothing is recalculated while armed; the plan itself is
  // only rebuilt once the shortcut is clicked again to disarm it (thisplugin.togglePortalExclusionMode).
  thisplugin.isExcludingPortals = false;
  // guid -> true for every portal manually excluded this way. Applied in updateLayer() right
  // after the plan's own candidate portal set is computed, and dropped whenever that candidate
  // set itself actually changes (a new/edited polygon, Bookmarks-only, …) — see the
  // lastPlanSignature check there.
  thisplugin.excludedPortalGuids = {};
  // guid -> the no-entry marker currently shown for it, so a single click can add/remove just
  // that one marker without touching the rest of the plan's own drawing.
  thisplugin.excludedPortalMarkers = {};
  thisplugin.excludedPortalMarkersLayerGroup = null;



  thisplugin.links = [];
  thisplugin.linksLayerGroup = null;
  thisplugin.fieldsLayerGroup = null;
  thisplugin.numbersLayerGroup = null;


  // ghi#23
  thisplugin.orderPathLayerGroup = null;
  thisplugin.showOrderPath = false;
  thisplugin.manualOrderGuids = null;
  thisplugin.lastPlanSignature = null;

  // Task List "Walk sim" button: see thisplugin.startWalkSim below.
  thisplugin.walkSimLayerGroup = null;
  thisplugin._walkSimState = null;
  // The small "Links: N · Fields: N" counter shown while the sim runs — see
  // thisplugin.walkSimShowLinks below (same option gates both).
  thisplugin.walkSimCounterEl = null;

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

  // Task List "Reroute" button: the walk order it computed from the player's position (see
  // thisplugin.rerouteFromPlayerPosition) — steps already done first, then the remaining ones in
  // the order that walks the least. Like displayOrderGuids it's a PURE DISPLAY order, and it takes
  // precedence over it. It only holds for the exact plan it was computed on
  // (routeOrderPlanKey, see getPlanShapeKey): as soon as the plan changes (anchor, options,
  // polygon, link directions, ...) it's dropped for good and the normal walk order comes back.
  // routeOrderInfo keeps what the Task List reports about it: { source, before, after }.
  thisplugin.routeOrderGuids = null;
  thisplugin.routeOrderPlanKey = null;
  thisplugin.routeOrderInfo = null;

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
  // "Reset link orders" (Task List). There is no UI to choose between KEYS and DISTANCE —
  // the mode is fixed to DISTANCE ("Less walking").
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
  // A "Reroute" order (routeOrderGuids) computed on this very plan wins over both.
  // Caches the result below (in particular the RADIATING prefix ordering, which runs a
  // budgeted — up to OUTBOUND_PREFIX_ORDER_BUDGET_MS — local search): getDisplayOrder() is
  // itself called many times per single redraw (Task List, map drawing, Stats, Blockers,
  // Walk sim, ...), and without this cache each of those calls would redo that search from
  // scratch, which is what made shift left/right (and any other anchor change) feel slow in
  // RADIATING mode. Keyed by reference on everything the computation actually depends on:
  // sortedFanpoints, displayOrderGuids and outboundPlayerPosition are always replaced
  // wholesale when they change (never mutated in place — see their assignments throughout
  // this file), so comparing references is enough to know the cached result is still valid.
  thisplugin._displayOrderCache = null;

  thisplugin.getDisplayOrder = function () {
    var sorted = thisplugin.sortedFanpoints || [];

    var routeOrder = thisplugin.getRouteOrder();
    if (routeOrder) return routeOrder;

    var guids = thisplugin.displayOrderGuids;

    var cache = thisplugin._displayOrderCache;
    if (cache && cache.sorted === sorted && cache.guids === guids &&
      cache.playerPosition === thisplugin.outboundPlayerPosition) {
      return cache.result;
    }

    var order = sorted;
    if (guids && guids.length === sorted.length) {
      var byGuid = {};
      sorted.forEach(function (fp) { byGuid[fp.guid] = fp; });

      var reordered = [];
      for (var i = 0; i < guids.length; i++) {
        var fp = byGuid[guids[i]];
        if (!fp) { reordered = null; break; } // stale guid set (plan changed since) — ignore it
        reordered.push(fp);
      }
      if (reordered && reordered[0].guid === thisplugin.startingpointGUID) order = reordered; // anchor must stay first
    }

    var result = thisplugin.moveAnchorAfterItsTargetsIfOutbound(order);
    thisplugin._displayOrderCache = { sorted: sorted, guids: guids, playerPosition: thisplugin.outboundPlayerPosition, result: result };
    return result;
  };

  // Outbound (RADIATING) mode: throwing one of the anchor's own links needs a key to that
  // destination, which only comes from having visited (and resonated) it already. So the anchor
  // has to come right after the last of its own direct outbound targets in the walk — not first,
  // like in inbound (CENTRALIZING) mode, where its keys are farmed before walking out — but also
  // not necessarily last overall: a portal the anchor never links to directly can still come
  // after it. Walk/display order only; sortedFanpoints (build order) is untouched, and an active
  // Route order already models this via its own precedences.
  //
  // None of the portals ahead of the anchor need a particular order relative to each other —
  // each only needs to be captured and keyed sometime before the anchor is reached — so that
  // segment is reordered (never the segment after the anchor, which this doesn't touch) to walk
  // as little as possible, starting from the player's own position and ending at the anchor. See
  // thisplugin.outboundPlayerPosition below for where that position comes from.
  thisplugin.moveAnchorAfterItsTargetsIfOutbound = function (order) {
    if (thisplugin.stardirection !== thisplugin.starDirENUM.RADIATING) return order;
    if (!order || order.length <= 1) return order;

    var anchor = order[0];
    if (anchor.guid !== thisplugin.startingpointGUID) return order; // already not anchor-first

    var targetGuids = {};
    (anchor.outgoing || []).forEach(function (target) { targetGuids[target.guid] = true; });
    if (Object.keys(targetGuids).length === 0) return order; // nothing to link from the anchor

    var rest = order.slice(1);
    var lastTargetIdx = -1;
    rest.forEach(function (fp, idx) { if (targetGuids[fp.guid]) lastTargetIdx = idx; });
    if (lastTargetIdx === -1) return order; // targets not found in this order — leave as is

    var before = rest.slice(0, lastTargetIdx + 1);
    var after = rest.slice(lastTargetIdx + 1);

    thisplugin.ensureOutboundPositionTracking();
    if (thisplugin.outboundPlayerPosition) {
      before = thisplugin.orderPrefixForOutbound(before, anchor, after, thisplugin.outboundPlayerPosition.latlng);
      // Whatever "Less walking" (computeDistanceOrderReordering) decided for this segment is
      // entirely superseded by the reorder just above — every portal in it was just placed by
      // orderPrefixForOutbound's own search, not by that earlier relocation. Dropping them from
      // relocatedForLessWalkingGuids here stops the Task List from flagging (green, "capture
      // early") a portal based on a position it no longer actually has.
      if (Object.keys(thisplugin.relocatedForLessWalkingGuids).length) {
        before.forEach(function (fp) { delete thisplugin.relocatedForLessWalkingGuids[fp.guid]; });
      }
    }
    // No cached position yet: ensureOutboundPositionTracking() above has a fetch under way and
    // redraws once it resolves — leave this segment in its natural order meanwhile.

    return before.concat([anchor]).concat(after);
  };

  // RADIATING (OUTBOUND) mode: the player's position, cached for ordering the walk ahead of the
  // anchor above. Never fetched synchronously from there (geolocation is async) — refreshed
  // periodically here instead while RADIATING is active, and used stale between refreshes rather
  // than blocking the draw. { latlng, source }, same shape thisplugin.getPlayerPosition returns.
  thisplugin.outboundPlayerPosition = null;
  thisplugin.OUTBOUND_POSITION_REFRESH_MS = 60000;
  thisplugin._outboundPositionTimer = null;
  thisplugin._outboundPositionFetchInFlight = false;

  thisplugin.refreshOutboundPlayerPosition = function () {
    if (thisplugin._outboundPositionFetchInFlight) return;
    thisplugin._outboundPositionFetchInFlight = true;
    thisplugin.getPlayerPosition(function (position) {
      thisplugin._outboundPositionFetchInFlight = false;
      thisplugin.outboundPlayerPosition = position;
      if (thisplugin.stardirection === thisplugin.starDirENUM.RADIATING) {
        thisplugin.redrawWalkOrder();
      }
    });
  };

  // Starts (or keeps alive) the periodic refresh above while RADIATING is active, and stops it
  // the moment it isn't — this must never poll GPS for an inbound plan. Called from
  // moveAnchorAfterItsTargetsIfOutbound (so it starts as soon as a RADIATING plan is first drawn)
  // and from toggleStarDirection (so switching away stops it right away, not on the next draw).
  thisplugin.ensureOutboundPositionTracking = function () {
    if (thisplugin.stardirection !== thisplugin.starDirENUM.RADIATING) {
      clearInterval(thisplugin._outboundPositionTimer);
      thisplugin._outboundPositionTimer = null;
      return;
    }
    if (thisplugin._outboundPositionTimer) return;
    thisplugin.refreshOutboundPlayerPosition();
    thisplugin._outboundPositionTimer = setInterval(thisplugin.refreshOutboundPlayerPosition, thisplugin.OUTBOUND_POSITION_REFRESH_MS);
  };

  // Orders prefixFps (the portals ahead of the anchor in RADIATING mode) to walk as little as
  // possible from startLatLng (the player) through all of them and on to anchorFp, while
  // preserving as many fields as the plan can actually form. Jet-linking (one link closing two
  // triangles at once, by reusing two links already thrown elsewhere) only pays off when its
  // three sides are thrown in an order that lets them all actually complete — thrown too late
  // from under a field already closed by the other two sides, a side can become impossible
  // (the "under field" distance limit), silently losing fields that pure distance minimization
  // would never notice. So, same as computeRouteOrder, every candidate ordering of this segment
  // is scored against the FULL walk it would produce (prefix + anchorFp + afterFps, exactly
  // what thisplugin.simulateWalk expects) and judged in this order:
  //  1. precedence violations (a portal linking to another one of this very segment before that
  //     one has been visited — same idea as computeRouteOrder's own precedences, scoped here);
  //  2. links the walk order makes impossible to throw from under a field;
  //  3. fields actually formed;
  //  4. total distance walked.
  // Nearest-neighbour construction (skipping any portal whose prerequisites within this segment
  // aren't placed yet) for a first candidate, then a bounded local-search pass (same moves as
  // computeRouteOrder's: move a short run elsewhere, or reverse a stretch), each judged by the
  // same four criteria. This runs synchronously on every redraw, not from a one-off button
  // click, so it's bounded by a short time budget rather than running to exhaustion.
  thisplugin.OUTBOUND_PREFIX_ORDER_BUDGET_MS = 300;

  thisplugin.orderPrefixForOutbound = function (prefixFps, anchorFp, afterFps, startLatLng) {
    var m = prefixFps.length;
    if (m <= 1) return prefixFps;

    var indexByGuid = {};
    prefixFps.forEach(function (fp, i) { indexByGuid[fp.guid] = i; });

    // Pairs [target index, source index]: the target must be visited before the source, since
    // the source still has to throw it a link. A link already thrown in-game is no longer a
    // constraint; a link to anything outside this segment (the anchor included) isn't either —
    // see the comment above.
    var precedences = [];
    prefixFps.forEach(function (fp, i) {
      (fp.outgoing || []).forEach(function (target) {
        var j = indexByGuid[target.guid];
        if (j === undefined) return;
        if (thisplugin.isLinkInGame(fp.guid, target.guid)) return;
        precedences.push([j, i]);
      });
    });

    var latLngs = prefixFps.map(function (fp) { return map.unproject(fp.point, thisplugin.PROJECT_ZOOM); });
    var anchorLatLng = map.unproject(anchorFp.point, thisplugin.PROJECT_ZOOM);
    var allPoints = latLngs.concat([startLatLng, anchorLatLng]);
    var START = m, END = m + 1;
    var dist = allPoints.map(function (a) { return allPoints.map(function (b) { return a.distanceTo(b); }); });

    function lengthOf(seq) {
      var total = dist[START][seq[0]];
      for (var i = 1; i < seq.length; i++) total += dist[seq[i - 1]][seq[i]];
      total += dist[seq[seq.length - 1]][END];
      return total;
    }
    function violationsOf(seq) {
      var pos = [];
      seq.forEach(function (idx, p) { pos[idx] = p; });
      return precedences.filter(function (pair) { return pos[pair[0]] > pos[pair[1]]; }).length;
    }
    function evaluate(seq) {
      var fullWalk = seq.map(function (idx) { return prefixFps[idx]; }).concat([anchorFp]).concat(afterFps);
      var sim = thisplugin.simulateWalk(fullWalk);
      return {
        seq: seq,
        length: lengthOf(seq),
        violations: violationsOf(seq),
        invalid: Object.keys(sim.invalid).length,
        fields: sim.triangles.length
      };
    }
    function isBetter(a, b) {
      if (a.violations !== b.violations) return a.violations < b.violations;
      if (a.invalid !== b.invalid) return a.invalid < b.invalid;
      if (a.fields !== b.fields) return a.fields > b.fields;
      return a.length < b.length - 1e-6;
    }

    // Nearest-neighbour from the player's position, skipping anything still blocked by a
    // not-yet-placed prerequisite of this segment.
    var seq = [];
    var placed = [];
    var current = START;
    while (seq.length < m) {
      var choice = -1;
      for (var i = 0; i < m; i++) {
        if (placed[i]) continue;
        var blocked = precedences.some(function (pair) { return pair[1] === i && !placed[pair[0]]; });
        if (blocked) continue;
        if (choice === -1 || dist[current][i] < dist[current][choice]) choice = i;
      }
      if (choice === -1) {
        // A cycle among the precedences (shouldn't normally happen) — fall back to any
        // unplaced portal rather than stall forever.
        for (choice = 0; placed[choice]; choice++);
      }
      seq.push(choice);
      placed[choice] = true;
      current = choice;
    }

    var deadline = Date.now() + thisplugin.OUTBOUND_PREFIX_ORDER_BUDGET_MS;
    var best = evaluate(seq);

    // "Less walking" (computeDistanceOrderFlips/computeDistanceOrderReordering) may already have
    // relocated some of these portals into a good order of its own before this ever runs —
    // prefixFps arrives in exactly that order. Tried here as a second starting candidate
    // alongside the nearest-neighbour construction above, rather than only ever starting fresh
    // and silently discarding that earlier work; the local search below then refines whichever
    // of the two starts out ahead. Never makes the result worse: best only changes when this
    // candidate actually evaluates better.
    var identitySeq = [];
    for (var identityIdx = 0; identityIdx < m; identityIdx++) identitySeq.push(identityIdx);
    var identityCandidate = evaluate(identitySeq);
    if (isBetter(identityCandidate, best)) best = identityCandidate;

    var maxPasses = 6;
    for (var pass = 0; pass < maxPasses && Date.now() < deadline; pass++) {
      var improved = false;
      for (var len = 1; len <= 3 && !improved && Date.now() < deadline; len++) {
        for (var a = 0; a + len <= m && !improved && Date.now() < deadline; a++) {
          var run = best.seq.slice(a, a + len);
          var rest = best.seq.slice(0, a).concat(best.seq.slice(a + len));
          for (var j = 0; j <= rest.length && !improved; j++) {
            if (j === a) continue;
            var candidate = evaluate(rest.slice(0, j).concat(run, rest.slice(j)));
            if (isBetter(candidate, best)) {
              best = candidate;
              improved = true;
            }
          }
        }
      }
      for (var x = 0; x < m - 1 && !improved && Date.now() < deadline; x++) {
        for (var y = x + 1; y < m && !improved; y++) {
          var reversed = evaluate(best.seq.slice(0, x).concat(best.seq.slice(x, y + 1).reverse(), best.seq.slice(y + 1)));
          if (isBetter(reversed, best)) {
            best = reversed;
            improved = true;
          }
        }
      }
      if (!improved) break;
    }

    return best.seq.map(function (idx) { return prefixFps[idx]; });
  };

  // Identifies the plan's shape: its portals in build order, each with the portals it throws to.
  // Two plans with the same key have exactly the same links in the same directions.
  thisplugin.getPlanShapeKey = function () {
    return (thisplugin.sortedFanpoints || []).map(function (fp) {
      return fp.guid + '>' + (fp.outgoing || []).map(function (target) { return target.guid; }).join(',');
    }).join('|');
  };

  // The "Reroute" walk order as fanpoints, or null when there is none or the plan it was computed
  // on has changed since (in which case it's dropped for good).
  thisplugin.getRouteOrder = function () {
    var guids = thisplugin.routeOrderGuids;
    if (!guids) return null;

    var sorted = thisplugin.sortedFanpoints || [];
    var byGuid = {};
    sorted.forEach(function (fp) { byGuid[fp.guid] = fp; });
    var order = guids.map(function (guid) { return byGuid[guid]; });

    var stillValid = guids.length === sorted.length &&
      order.every(function (fp) { return !!fp; }) &&
      thisplugin.getPlanShapeKey() === thisplugin.routeOrderPlanKey;
    if (!stillValid) {
      thisplugin.clearRouteOrder();
      return null;
    }
    return order;
  };

  thisplugin.clearRouteOrder = function () {
    thisplugin.routeOrderGuids = null;
    thisplugin.routeOrderPlanKey = null;
    thisplugin.routeOrderInfo = null;
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
    thisplugin.reconciledFanLinkKeys = {};
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
    thisplugin.reconciledFanLinkKeys = {};
    thisplugin.relocatedForLessWalkingGuids = {};
    thisplugin.displayOrderGuids = null;
    thisplugin.requestLinkOrderRecompute();

    thisplugin.updateLayer();
    return true;
  };

  // "Pick anchor" menu entry: toggles whether the next portal click on the map sets that
  // portal as the anchor (see the portalSelected hook in setup()).
  thisplugin.toggleAnchorPicking = function () {
    thisplugin.isPickingAnchor = !thisplugin.isPickingAnchor;
    thisplugin.updateAnchorPickingButton();
  };

  thisplugin.updateAnchorPickingButton = function () {
    $('#plugin_fanfields3_pickanchor_btn')
      .toggleClass('plugin_fanfields3_active', thisplugin.isPickingAnchor);
  };

  // "No entry" shortcut: arms/disarms portal-exclusion picking. Disarming applies whatever was
  // toggled while armed (thisplugin.excludedPortalGuids) to the actual plan — the same
  // unlock-then-recalculate-then-relock cycle used by the other option toggles (toggleclockwise,
  // toggleStarDirection, …) — via thisplugin.delayedUpdateLayer(..., true).
  thisplugin.togglePortalExclusionMode = function () {
    thisplugin.isExcludingPortals = !thisplugin.isExcludingPortals;
    thisplugin.updateExcludePortalButton();

    if (!thisplugin.isExcludingPortals) {
      thisplugin.manualOrderGuids = null;
      thisplugin.manualLinkFlips = {};
      thisplugin.reconciledFanLinkKeys = {};
      thisplugin.relocatedForLessWalkingGuids = {};
      thisplugin.displayOrderGuids = null;
      thisplugin.requestLinkOrderRecompute();
      thisplugin.delayedUpdateLayer(0.2, true);
    }
  };

  thisplugin.updateExcludePortalButton = function () {
    $('#fanfieldExcludePortalButton')
      .toggleClass('plugin_fanfields3_active', thisplugin.isExcludingPortals)
      .attr('title', thisplugin.isExcludingPortals
        ? 'Exclude portals: click plan portals to mark them out (or back in), click here again when done'
        : 'Exclude portals: click, then click plan portals to leave them out of the plan');
  };

  // A single portal click can fire IITC's own 'portalSelected' hook twice in a row (observed on
  // the very first click of a session: once right away, once again once the portal's full data
  // arrives and renderPortalDetails re-runs for the same guid) — without this guard, that second
  // call immediately undid the first click's toggle, making the marker flash and vanish. Genuine
  // separate clicks on the same portal, to toggle it back, are comfortably slower than this.
  thisplugin._lastExcludeToggleAt = {};
  thisplugin.EXCLUDE_TOGGLE_DEBOUNCE_MS = 400;

  // Marks/unmarks a single portal as excluded and updates its no-entry marker right away —
  // called while picking is armed, never recalculates the plan itself (see
  // thisplugin.togglePortalExclusionMode for that).
  thisplugin.toggleExcludedPortal = function (guid) {
    var now = Date.now();
    var last = thisplugin._lastExcludeToggleAt[guid];
    if (last !== undefined && (now - last) < thisplugin.EXCLUDE_TOGGLE_DEBOUNCE_MS) return;
    thisplugin._lastExcludeToggleAt[guid] = now;

    if (thisplugin.excludedPortalGuids[guid]) {
      delete thisplugin.excludedPortalGuids[guid];
      thisplugin.removeExcludedPortalMarker(guid);
    } else {
      thisplugin.excludedPortalGuids[guid] = true;
      thisplugin.addExcludedPortalMarker(guid);
    }
  };

  thisplugin.addExcludedPortalMarker = function (guid) {
    if (!thisplugin.excludedPortalMarkersLayerGroup) return;
    thisplugin.removeExcludedPortalMarker(guid);

    var point = thisplugin.locations && thisplugin.locations[guid];
    if (!point) return;

    var marker = L.marker(map.unproject(point, thisplugin.PROJECT_ZOOM), {
      icon: L.divIcon({
        className: 'plugin_fanfields3_excluded_marker',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        html: '&#9940;'
      }),
      interactive: false
    });
    marker.addTo(thisplugin.excludedPortalMarkersLayerGroup);
    thisplugin.excludedPortalMarkers[guid] = marker;
  };

  thisplugin.removeExcludedPortalMarker = function (guid) {
    var marker = thisplugin.excludedPortalMarkers[guid];
    if (!marker) return;
    if (thisplugin.excludedPortalMarkersLayerGroup) {
      thisplugin.excludedPortalMarkersLayerGroup.removeLayer(marker);
    }
    delete thisplugin.excludedPortalMarkers[guid];
  };

  // Drops every manual exclusion and its marker — called when the plan's own candidate portal
  // set actually changes (see the lastPlanSignature check in updateLayer()), since a stale
  // exclusion would otherwise apply to a portal set it was never meant for.
  thisplugin.clearExcludedPortals = function () {
    Object.keys(thisplugin.excludedPortalMarkers).forEach(thisplugin.removeExcludedPortalMarker);
    thisplugin.excludedPortalGuids = {};
  };

  // Sorted guids of every manually excluded portal — used wherever the exclusion set needs to
  // be compared or persisted (Manage Ops' dirty-check and saved op data), so the same set always
  // serializes identically regardless of the order portals were toggled in.
  thisplugin.excludedGuidsArray = function () {
    return Object.keys(thisplugin.excludedPortalGuids).sort();
  };

  // Replaces the whole exclusion set at once (Manage Ops' loadOp) — drops whatever was excluded
  // before and marks exactly these guids instead.
  thisplugin.setExcludedPortalGuids = function (guids) {
    thisplugin.clearExcludedPortals();
    (guids || []).forEach(function (guid) { thisplugin.excludedPortalGuids[guid] = true; });
    thisplugin.refreshExcludedPortalMarkers();
  };

  // Adds a marker for every excluded portal that doesn't have one yet — called whenever
  // thisplugin.locations is (re)built, since a portal restored from a saved op (or still
  // loading in) may not have had a known location yet the first time it was excluded.
  thisplugin.refreshExcludedPortalMarkers = function () {
    Object.keys(thisplugin.excludedPortalGuids).forEach(function (guid) {
      if (!thisplugin.excludedPortalMarkers[guid]) thisplugin.addExcludedPortalMarker(guid);
    });
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
        'Optional: in the menu\'s <i>Options</i>, set <i>Portal&nbsp;selection</i> to <i>Bookmarks&nbsp;only</i> to restrict the selection to your bookmarked portals. ' +
        'To fine-tune the selection without redrawing the polygon, use the map\'s &#9940; (no-entry) shortcut: click it, then click plan portals to leave them out of the plan (or bring them back in), and click it again when done.</p>' +

        '<p><b>Show the plan</b><br>' +
        'From the layer selector, enable the Fanfields layers (Links / Fields / Numbers). ' +
        'The fanfield is calculated and shown as purple links and red fields on the intel, with link directions indicated by dashed stubs at the origin portal.</p>' +

        '<p><b>Choose the anchor (start portal)</b><br>' +
        'By default, the script searches in the background for a start portal and direction that reuse as many of your faction\'s own existing links between the selected portals as possible, so the plan lines up with real progress; this runs once right after drawing or editing a polygon. ' +
        'With no such link to reuse, it falls back to a portal on the convex hull of the selection. ' +
        'Use the Cycle&nbsp;Start buttons (&#8634;/&#8635;) to step through hull portals yourself, or <i>Pick&nbsp;anchor</i> (menu) to click any portal of the plan directly on the map, hull or not. ' +
        'To force an inside portal the old way, place a Drawtools marker snapped onto it, then cycle until it becomes the anchor. ' +
        'Picking an anchor yourself this way (or cycling) cancels the automatic search for that polygon.</p>' +

        '<p><b>Build mode: inbounding / outbounding</b><br>' +
        'A fanfield can be done <i>inbounding</i> by farming many keys at the anchor and linking <i>to</i> it from all other portals. ' +
        'It can also be done <i>outbounding</i> by star-linking <i>from</i> the anchor until the maximum number of outgoing links is reached. ' +
        'In outbounding mode you can set how many SBUL you plan to use (0–4) to calculate the outgoing link capacity. ' +
        'The Task List then places the anchor right after the last portal it directly links to — not first — since throwing those links needs keys you only get by visiting those portals first; the steps leading up to it are ordered to minimize your walking from your current position (GPS, else IITC\'s own location, else the map center). ' +
        'If a link planned to come into the anchor ends up thrown out of it instead (the only way possible once you\'re standing there), the plan automatically swaps another not-yet-thrown outbound link to inbound to compensate, so the total outbound links stays matched to your SBUL count — even while the plan is Locked.</p>' +

        '<p><b>Order & walking optimization</b><br>' +
        'In Options, switch between <i>Clockwise</i> and <i>Counterclockwise</i> direction to find an easier route or squeeze out extra fields. ' +
        'The walk order is automatically optimized to reduce backtracking ("Less walking"): a portal that isn\'t really on the way gets relocated earlier in the walk (shown green in the Task List, as a reminder to capture it and gather its keys ahead of schedule) rather than forcing its own link into a detour. ' +
        'Flip any single link\'s direction with the &#8646; button next to it in the Task List (keys needed update accordingly); use <i>Reset&nbsp;link&nbsp;orders</i> there to revert every manual flip and the walking optimization back to the algorithm\'s own choice. ' +
        'For full control over the visit order itself, open <i>Manage&nbsp;order</i> (menu) and drag &amp; drop portals (or use the &#9650;/&#9660; buttons on mobile); use <i>Path</i> there to preview a straight-line route along the current sequence.</p>' +

        '<p><b>Avoid blockers</b><br>' +
        'If you need to plan around links you cannot or do not want to destroy, use <i>Respect&nbsp;Intel</i> (menu &rarr; Options). ' +
        'Choose which factions\' links are treated as blockers (NONE / ALL / ENL / RES / ENL &amp; MAC / RES &amp; MAC / MAC). ' +
        'The plan avoids crossing those currently visible intel links — nothing else changes, even when the selected mode includes your own faction.</p>' +

        '<p><b>Blockers</b><br>' +
        'Every visible link that crosses a link of the plan still to be thrown, and whose faction <i>Respect&nbsp;Intel</i> does not avoid, is a blocker. ' +
        'With <i>Blockers</i> on (Options, the default), blockers are drawn as red dotted lines and the Task List gets <i>Destroy</i> rows: portals to neutralize so that the blockers are gone before the link they block is thrown. ' +
        'An enemy portal the plan captures anyway is marked with a cross when its capture frees a link in time. ' +
        '<i>Max&nbsp;detour</i> (Options: 100&nbsp;m, 200&nbsp;m, 500&nbsp;m, 1&nbsp;km or no limit) caps the extra walk of a single Destroy stop; blockers that cannot be freed within it are listed under the Task List. ' +
        'Destroying a Destroy stop\'s portal clears its cross and finishes that row (pale yellow, struck through) right away, even while the plan is Locked. ' +
        'Turning <i>Blockers</i> off only removes these rows. A link of your own faction can only be broken with a Jarvis/ADA flip, or by changing <i>Respect&nbsp;Intel</i>.</p>' +

        '<p><b>Freeze recalculation</b><br>' +
        'The plan locks itself as soon as a new plan is completely calculated (once IITC has finished loading the map, and including the automatic anchor search), so it no longer moves while you pan, zoom or the map data refreshes. ' +
        'Changing something about the plan itself — a menu option, the drawn polygon, a map layer — recalculates it and locks it again. ' +
        'Use <i>🔒&nbsp;Locked</i> to prevent the script from recalculating the plan while you zoom into details or work with large areas. ' +
        'The Task List keeps reflecting portal captures and links thrown in-game while locked — only the plan itself (link/field order) stays frozen. ' +
        'Switch back to <i>🔓&nbsp;Unlocked</i> to let the plan itself refresh again.</p>' +

        '<p><b>Manage ops</b><br>' +
        'Open <i>Manage&nbsp;ops</i> (menu) to save your current drawing — together with its options and anchor — under a name, and reload, rename, update or delete it later. ' +
        'Loading an op replaces everything currently drawn and moves the map to it; you\'ll be warned first if that would discard unsaved changes. ' +
        'A <i>Clear&nbsp;drawing</i> button there wipes the current drawing.</p>' +

        '<p><b>Task list & exports</b><br>' +
        'Open <i>Task List</i> to get a step-by-step plan including per-portal key requirements, outgoing link counts, and (optional) link details. ' +
        'If you use a Keys/LiveInventory plugin, the task list can also show your available key counts, and keys are spent automatically from the Keys plugin as you throw links (toggle in Options: <i>Spend&nbsp;keys&nbsp;on&nbsp;throw</i>). ' +
        'With the Keys plugin, its <i>Keys video</i> button fills in your key counts from a screen recording of your keys in Ingress. ' +
        'The task list includes a navigation link for Google Maps. ' +
        'Its <i>Reroute</i> button reorders the steps still to do, starting from your current position (GPS, else IITC\'s own location, else the map center), so you walk as little as possible — while still capturing each portal, and getting its keys, before anyone links to it, and without losing a field. ' +
        'The links and fields stay the same, it works while the plan is locked too, and the new order holds until the plan itself changes (or <i>Reset&nbsp;link&nbsp;orders</i>).</p>' +

        '<p><b>Plan details (menu)</b><br>' +
        '<i>Print&nbsp;route</i> prints the Task List exactly as it stands (per-portal key requirements, link details and all). ' +
        '<i>Print&nbsp;step&nbsp;by&nbsp;step&nbsp;plan</i> saves a step-by-step report of the current plan — one page per portal with the links to throw there, a running total of links/fields completed, and a map of your progress so far — as a file you can open or print from your phone. ' +
        '<i>Live&nbsp;simulation</i> previews the whole walk on the map, portal by portal, drawing each portal\'s own links and fields as they\'re reached, with a running counter of links, fields and distance walked so far; tap the map to dismiss it.</p>' +

        '<p><b>Statistics</b><br>' +
        'Open <i>Stats</i> (menu) for the plan\'s own totals (keys, links, fields, walking distance) alongside a <i>Your&nbsp;activity&nbsp;today</i> section showing how many links and fields you personally have thrown/formed in-game today, read from the Faction and All Comm feeds — not from the plan — so you can compare your own progress against it. <i>Refresh</i> re-reads Comm; it only covers today, and however far back Comm history and your current map view actually reach. If it cannot be read at all, the reason (e.g. an IITC build without a Comm module) is shown there. ' +
        'Switch its window (<i>Today</i>, <i>2&nbsp;days</i>, <i>7&nbsp;days</i>) to count further back; it refreshes on its own while the window stays open.</p>' +

        '<hr noshade>' +

        '<p>Found a bug? Post your issues at GitHub:<br>' +
        '<a href="https://github.com/Avataar120/fanfields3/issues">https://github.com/Avataar120/fanfields3/issues</a></p>',
      id: 'plugin_fanfields3_alert_help',
      title: 'Fan Fields 3 - Help',
      width: width,
      closeOnEscape: true
    });
  };




  // Total walking distance of the current plan: the walk order's own portal-to-portal distance
  // (thisplugin.getDisplayOrder — relocations and any Reroute order included), plus whatever
  // extra walking the Blockers Destroy stops add (thisplugin.computeBlockerPlan already works
  // this out for the Task List's own summary line).
  thisplugin.computeTotalWalkDistance = function () {
    var order = thisplugin.getDisplayOrder();
    var total = 0;
    for (var i = 1; i < order.length; i++) {
      total += thisplugin.distanceTo(order[i - 1].point, order[i].point);
    }
    total += thisplugin.computeBlockerPlan().extraDistance;
    return total;
  };

  // Real activity (Task List "Stats" window): how many links/fields the PLAYER THEMSELVES
  // (not their whole faction) actually threw/formed in-game today. window.links/window.fields
  // only ever carry a TEAM, never an agent name, so this can't be computed from them (an
  // earlier version of this feature did, and ended up counting every teammate's activity too,
  // not just the player's own) — the only place IITC exposes WHO performed an action is the
  // Comm feed, where a "linked"/"created a Control Field" message's PLAYER markup names the
  // agent. Both the Faction and All channels are read (see thisplugin.refreshMyActivityToday):
  // either one alone can be thin or empty for a given account/session (e.g. a channel the
  // player's own client has never opened a tab for), while a link/field the player throws is
  // reported on both, so reading both is what actually makes this reliable.
  //
  // Scoped to today (local midnight) only, and to whatever map area Comm currently requests
  // data for (IITC's own chat bounding box) — Niantic's own Comm history retention is short
  // (hours, not a guaranteed full day), so a longer window would often come back incomplete or
  // empty anyway; this already accepts that same-day risk rather than pretending to cover more.
  thisplugin.MY_ACTIVITY_CHANNELS = ['faction', 'all'];
  thisplugin.MY_ACTIVITY_MAX_HISTORY_PAGES = 8;
  thisplugin.MY_ACTIVITY_PAGE_TIMEOUT_MS = 6000;

  thisplugin.myActivityToday = { links: 0, fields: 0, totalSeen: 0, ownSeen: 0 };
  thisplugin.myActivityState = 'idle'; // 'idle' | 'loading' | 'done' | 'error'
  thisplugin._myActivityRequestToken = 0;

  thisplugin.getTodayCutoff = function () {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  };

  // IITC fires a differently-named hook for the 'all' channel than the generic
  // "<channel>ChatDataAvailable" pattern every other channel (including 'faction') uses — see
  // IITC-CE's core/code/comm.js.
  thisplugin.getCommHookName = function (channel) {
    return (channel === 'all') ? 'publicChatDataAvailable' : (channel + 'ChatDataAvailable');
  };

  // Tallies, among every Comm message gathered so far this refresh (processed: the same
  // accumulated guid -> [time, auto, html, nick, parsedData] hash IITC's own comm.js hands to
  // its "<channel>ChatDataAvailable" listeners — see thisplugin.getCommHookName), how many were
  // thrown/formed by the player themselves today. Also reports the oldest message's own time,
  // so the caller knows whether paging back further could still reach anything newer than the
  // cutoff. Channel-agnostic: the caller merges per-channel results before/after calling this.
  //
  // Whether to match a given message's author against our own name goes through THREE
  // independent signals, any one of which is accepted: the tuple's own "nick" field (index 3 --
  // what the Comm panel itself uses to highlight "your own" messages), parsedData.player.name
  // (index 4's own internal field), and any PLAYER/SENDER markup entry's own plain text (the
  // name actually printed in the message by parseMsgData, independent of both of the above).
  // Different real IITC builds have been seen to leave one or two of these empty or wrong while
  // the others stay correct, so relying on a single one keeps missing the player's own actions
  // depending on which build is running -- accepting any match is what actually makes this
  // robust across builds instead of chasing one build's quirk at a time.
  thisplugin.getMessageAuthorCandidates = function (entry) {
    var parsed = entry[4];
    var candidates = [entry[3], parsed && parsed.player && parsed.player.name];
    ((parsed && parsed.markup) || []).forEach(function (m) {
      if ((m[0] === 'PLAYER' || m[0] === 'SENDER') && m[1] && m[1].plain) candidates.push(m[1].plain);
    });
    return candidates;
  };

  // Tallies, among every Comm message gathered so far this refresh (processed: the same
  // accumulated guid -> [time, auto, html, nick, parsedData] hash IITC's own comm.js hands to
  // its "<channel>ChatDataAvailable" listeners — see thisplugin.getCommHookName), how many were
  // thrown/formed by the player themselves today. Also reports the oldest message's own time, so
  // the caller knows whether paging back further could still reach anything newer than the
  // cutoff, and how many messages were read in total vs. recognized as the player's own, so the
  // Stats dialog can show that even when both counts land on zero (see buildRealActivityBodyHTML)
  // -- the only way to tell "nothing to count" apart from "the matching itself failed" without
  // opening a console. Channel-agnostic: the caller merges per-channel results before/after
  // calling this.

  // Plain, human-visible text of a rendered Comm message row's own HTML (entry[2] -- see
  // getMessageAuthorCandidates for the processed tuple shape), with every tag (and the
  // attributes on it -- onclick handlers, portal hrefs, …) dropped, leaving only what the
  // chat panel actually displays. Used as a fallback text source below: some IITC builds (and
  // some message types even on builds that usually do) carry the message's own narrative
  // words -- "agent", "linked", "to", … -- baked into the rendering itself rather than as a
  // plain 'TEXT' markup entry, so a message can visibly read "agent X linked A to B" while its
  // own markup array has no 'TEXT' entry at all to find that in. Without this fallback, such a
  // message's activity is silently missed -- recognized as the player's own (the author match
  // doesn't depend on this), but never counted as a link/field.
  thisplugin.stripHtmlToText = function (html) {
    return String(html || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  };

  thisplugin.tallyMyActivity = function (processed) {
    var cutoff = thisplugin.getTodayCutoff();
    var ownName = window.PLAYER && window.PLAYER.nickname;
    var result = { links: 0, fields: 0, oldestSeen: Infinity, totalSeen: 0, ownSeen: 0 };
    if (!ownName) return result;
    var ownNameTrimmed = ownName.trim();

    Object.keys(processed).forEach(function (guid) {
      var entry = processed[guid];
      if (!entry) return;
      result.totalSeen++;

      var candidates = thisplugin.getMessageAuthorCandidates(entry);
      var isOwn = candidates.some(function (name) {
        return name && name.trim() === ownNameTrimmed;
      });
      if (!isOwn) return;
      result.ownSeen++;

      var time = entry[0];
      if (time < result.oldestSeen) result.oldestSeen = time;
      if (time < cutoff) return;

      var parsed = entry[4];
      var markup = parsed && parsed.markup;
      // markup 'TEXT' entries first (cheap, exact), plus the rendered row's own HTML stripped
      // to plain text as a fallback -- see stripHtmlToText for why the fallback is needed.
      var text = (markup || []).map(function (m) { return m[0] === 'TEXT' ? m[1].plain : ''; }).join('') +
        ' ' + thisplugin.stripHtmlToText(entry[2]);

      if (text.indexOf('destroyed') !== -1) return; // destroying something isn't "activity" for this count
      if (text.indexOf('created a Control Field') !== -1) { result.fields++; return; }
      if (text.indexOf('linked') !== -1) result.links++;
    });

    return result;
  };

  // Fetches the Faction AND All Comm feeds (thisplugin.MY_ACTIVITY_CHANNELS), each paging back
  // on its own (IITC.comm.requestChannel's own getOlderMsgs) until either today's local
  // midnight is reached for that channel, the server stops returning anything new, or
  // MY_ACTIVITY_MAX_HISTORY_PAGES is hit -- then merges both channels' messages (by guid, so an
  // action reported on both never double-counts) and updates thisplugin.myActivityToday/State
  // and, if the Stats dialog is open, its activity section.
  // Which of refreshMyActivityToday's prerequisites was missing, in plain English -- shown
  // directly in the Stats dialog (buildRealActivityBodyHTML) instead of only in the console, so
  // a report of "Could not read Comm data" from the field actually says why.
  thisplugin.diagnoseMyActivityUnavailable = function () {
    if (!(window.PLAYER && window.PLAYER.nickname)) return 'your player info (nickname) is not loaded yet.';

    var hasModernComm = !!(window.IITC && window.IITC.comm && typeof window.IITC.comm.requestChannel === 'function');
    var hasLegacyChat = !!(window.chat && typeof window.chat.requestFaction === 'function');
    if (hasModernComm || hasLegacyChat) return null;

    // Neither of the two ways this plugin knows how to ask IITC for Comm data exists on this
    // build -- dumped here (not just logged to the console, which mobile builds often have no
    // way to open) so a report of this error already says exactly what's missing, without
    // needing a follow-up round of guessing.
    return 'this IITC build exposes neither window.IITC.comm.requestChannel nor window.chat.requestFaction (window.IITC: ' +
      (window.IITC ? 'present' : 'missing') + ', window.chat: ' + (window.chat ? 'present' : 'missing') + ').';
  };

  // The function to call to request one page of a channel's Comm messages, preferring the
  // long-standing window.chat.request*() entry points (chat.js) -- present across more IITC
  // build vintages than the newer window.IITC.comm.requestChannel (comm.js) they both end up
  // calling internally -- and falling back to that newer one directly when only it exists.
  thisplugin.getCommRequestFn = function (channel) {
    if (window.chat) {
      if (channel === 'faction' && typeof window.chat.requestFaction === 'function') return window.chat.requestFaction;
      if (channel === 'all' && typeof window.chat.requestPublic === 'function') return window.chat.requestPublic;
    }
    if (window.IITC && window.IITC.comm && typeof window.IITC.comm.requestChannel === 'function') {
      return function (olderMsgs, isRetry) { return window.IITC.comm.requestChannel(channel, olderMsgs, isRetry); };
    }
    return null;
  };

  // IITC's own already-accumulated store for a channel (the exact same object its
  // "<channel>ChatDataAvailable" hook hands listeners as `processed` -- see comm.js
  // _handleChannel/_writeDataToHash), read directly rather than only ever through that hook.
  // This matters because IITC.comm.requestChannel silently returns with NO hook firing at all
  // whenever its own response carries nothing new to add on top of what it already has (see
  // comm.js _handleChannel's own "no new data" shortcut) -- which is the common case, not a
  // rare one: any time something else already caused this channel to be up to date (IITC's own
  // background refresh of a visible chat tab, or an earlier page of this very fetch), our own
  // request comes back empty and the hook stays silent, even though the channel's own store
  // already holds everything we need, including activity from moments ago. Without reading the
  // store directly, such a silent response was wrongly treated the same as "nothing to report",
  // discarding everything the channel already knew.
  //
  // window.chat._public/_faction/_alerts (chat.js) are tried first, not window.IITC.comm's own
  // _channelsData: modern chat.js keeps those three names only as "legacy compatibility"
  // aliases pointing at the very same objects (`chat._public = IITC.comm._channelsData.all`),
  // but an older IITC build that predates the IITC.comm/comm.js split never had
  // window.IITC.comm._channelsData at all -- window.chat._public/_faction/_alerts (or
  // equivalent) was the ONE real store in that era. Trying the chat.js names first means the
  // exact same code path works whether this build still has window.IITC.comm or not, rather
  // than silently reading nothing on an older build. Returns null when neither exists.
  thisplugin.CHAT_LEGACY_CHANNEL_PROP = { all: '_public', faction: '_faction', alerts: '_alerts' };

  thisplugin.getChannelLiveProcessedData = function (channel) {
    var legacyProp = thisplugin.CHAT_LEGACY_CHANNEL_PROP[channel];
    var legacyStore = legacyProp && window.chat && window.chat[legacyProp];
    if (legacyStore && legacyStore.data) return legacyStore.data;

    var channelsData = window.IITC && window.IITC.comm && window.IITC.comm._channelsData;
    return (channelsData && channelsData[channel] && channelsData[channel].data) || null;
  };

  thisplugin.refreshMyActivityToday = function () {
    thisplugin.myActivityState = 'loading';
    $('#plugin_fanfields3_activity_body').html(thisplugin.buildRealActivityBodyHTML());

    var unavailableReason = thisplugin.diagnoseMyActivityUnavailable();
    if (unavailableReason) {
      thisplugin.myActivityState = 'error';
      thisplugin.myActivityErrorReason = unavailableReason;
      $('#plugin_fanfields3_activity_body').html(thisplugin.buildRealActivityBodyHTML());
      return;
    }

    var token = ++thisplugin._myActivityRequestToken;
    var cutoff = thisplugin.getTodayCutoff();
    var combinedProcessed = {};
    var channelsPending = thisplugin.MY_ACTIVITY_CHANNELS.length;

    function finishAllIfDone() {
      if (token !== thisplugin._myActivityRequestToken) return;
      if (channelsPending > 0) return;
      var tally = thisplugin.tallyMyActivity(combinedProcessed);
      thisplugin.myActivityToday = {
        links: tally.links, fields: tally.fields, totalSeen: tally.totalSeen, ownSeen: tally.ownSeen
      };
      thisplugin.myActivityState = 'done';
      $('#plugin_fanfields3_activity_body').html(thisplugin.buildRealActivityBodyHTML());
    }

    thisplugin.MY_ACTIVITY_CHANNELS.forEach(function (channel) {
      var requestFn = thisplugin.getCommRequestFn(channel);
      if (!requestFn) {
        channelsPending--;
        finishAllIfDone();
        return; // neither API available for this channel
      }

      var hookName = thisplugin.getCommHookName(channel);
      var pagesLeft = thisplugin.MY_ACTIVITY_MAX_HISTORY_PAGES;
      var pageTimer = null;
      var lastProcessed = {}; // kept across pages so a later page's timeout doesn't lose earlier ones

      function finishChannel(processed) {
        if (token !== thisplugin._myActivityRequestToken) return; // superseded by a newer refresh
        clearTimeout(pageTimer);
        window.removeHook(hookName, onPage);
        Object.keys(processed).forEach(function (guid) {
          combinedProcessed[guid] = processed[guid];
        });
        channelsPending--;
        finishAllIfDone();
      }

      function requestPage(olderMsgs) {
        if (typeof window.idleReset === 'function') window.idleReset();
        requestFn(olderMsgs);
        // No hook response at all -- a genuine server error, no older data left to send, OR
        // (the common case) this request simply had nothing new to add on top of what
        // IITC already has -- never fires the hook below. Falls back to IITC's own live store
        // (see getChannelLiveProcessedData) rather than just `lastProcessed`, so a silent-
        // because-nothing-new response still reports everything the channel already knows
        // instead of looking like nothing was ever read.
        pageTimer = setTimeout(function () {
          var live = thisplugin.getChannelLiveProcessedData(channel);
          finishChannel(live || lastProcessed);
        }, thisplugin.MY_ACTIVITY_PAGE_TIMEOUT_MS);
      }

      function onPage(data) {
        if (token !== thisplugin._myActivityRequestToken) return;
        clearTimeout(pageTimer);
        lastProcessed = data.processed;
        var tally = thisplugin.tallyMyActivity(data.processed);
        pagesLeft--;
        if (tally.oldestSeen <= cutoff || pagesLeft <= 0) {
          finishChannel(data.processed);
        } else {
          requestPage(true);
        }
      }

      window.addHook(hookName, onPage);
      requestPage(false);
    });
  };

  thisplugin.buildRealActivityBodyHTML = function () {
    if (thisplugin.myActivityState === 'error') {
      return '<p class="plugin_fanfields3_warn">Could not read Comm data' +
        (thisplugin.myActivityErrorReason ? ': ' + thisplugin.myActivityErrorReason : '.') + '</p>';
    }
    if (thisplugin.myActivityState !== 'done') {
      return '<p class="plugin_fanfields3_italic">Loading…</p>';
    }

    return '<table><tr><td>Links thrown:</td><td>' + thisplugin.myActivityToday.links + '</td></tr>' +
      '<tr><td>Fields created:</td><td>' + thisplugin.myActivityToday.fields + '</td></tr></table>';
  };

  thisplugin.buildRealActivityHTML = function () {
    return '<hr noshade><div class="plugin_fanfields3_activity">' +
      '<div class="plugin_fanfields3_activity_title">Your activity today (from Comm)</div>' +
      '<div id="plugin_fanfields3_activity_body">' + thisplugin.buildRealActivityBodyHTML() + '</div>' +
      '<div class="plugin_fanfields3_activity_buttons"><a href="#" id="plugin_fanfields3_activity_refresh">Refresh</a></div>' +
      '</div>';
  };

  // Statistics dialog: build the HTML for the current plan. Used both to open the dialog and
  // to refresh it live (see thisplugin.refreshStatisticsIfOpen) as the background plan changes.
  thisplugin.buildStatisticsHTML = function () {
    var activityHtml = thisplugin.buildRealActivityHTML();

    if (!thisplugin.sortedFanpoints || thisplugin.sortedFanpoints.length <= 3) {
      return '<p>No Fanfield plan calculated yet.<br>Draw a polygon and let Fanfields calculate first.</p>' + activityHtml;
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
      '<tr><td>Total walk distance:</td><td>' + thisplugin.formatDistance(thisplugin.computeTotalWalkDistance()) + '</td><tr>' +
      warn +
      '</table>' +
      activityHtml;
  };

  // Whether the Statistics dialog is currently open and visible.
  thisplugin.isStatisticsDialogOpen = function () {
    return $('#plugin_fanfields3_statistics_inner').is(':visible');
  };

  thisplugin.wireStatisticsHandlers = function () {
    $('#plugin_fanfields3_statistics_inner')
      .off('click.plugin_fanfields3_activity')
      .on('click.plugin_fanfields3_activity', '#plugin_fanfields3_activity_refresh', function (ev) {
        ev.preventDefault();
        thisplugin.refreshMyActivityToday();
      });
  };

  // Rebuild the Statistics dialog's content in place. Used to auto-refresh live as the
  // background plan changes (new links appearing in-game, fan field rotation, etc.), mirroring
  // thisplugin.refreshTaskListDialog for the Task List.
  thisplugin.refreshStatisticsDialog = function () {
    $('#plugin_fanfields3_statistics_inner').html(thisplugin.buildStatisticsHTML());
    thisplugin.wireStatisticsHandlers();
  };

  // Called after every plan recalculation (see updateLayer) so an open Statistics dialog
  // reflects the latest counts without the user having to close and reopen it.
  thisplugin.refreshStatisticsIfOpen = function () {
    if (thisplugin.isStatisticsDialogOpen()) {
      thisplugin.refreshStatisticsDialog();
    }
  };

  thisplugin.showStatistics = function () {
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
    // matches nothing. The phone's own on-screen navigation bar (or the app's persistent
    // bottom toolbar) commonly overlaps the bottom of the visible viewport without being
    // reflected in its reported height at all, so a small offset from the literal bottom edge
    // (as used here before the Real activity section made this dialog taller) ends up hidden
    // underneath it — same reasoning as thisplugin.getMaxDialogHeight(), whose own clearance
    // this reuses for both the position offset and a height cap, so a tall dialog also
    // scrolls its own content instead of growing past the visible area.
    if (isMobile) {
      var $statsDialog = $('#dialog-plugin_fanfields3_alert_statistics');
      var $statsUi = $statsDialog.closest('.ui-dialog');
      $statsUi.css({
        'max-height': thisplugin.getMaxDialogHeight() + 'px',
        'display': 'flex',
        'flex-direction': 'column'
      });
      $statsUi.find('.ui-dialog-content').css({
        'flex': '1 1 auto',
        'overflow-y': 'auto'
      });
      $statsDialog.dialog('option', 'position', { my: 'bottom', at: 'bottom-' + thisplugin.MOBILE_DIALOG_BOTTOM_CLEARANCE_PX, of: window });
    }

    thisplugin.wireStatisticsHandlers();
    thisplugin.refreshMyActivityToday();
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
    // it the same way a map tap does (name in the bottom bar, details ready behind it) and close
    // the list. Desktop keeps the list open and shows the portal details.
    if (L && L.Browser && L.Browser.mobile) {
      if (window.portals[guid]) window.renderPortalDetails(guid);
      else window.urlPortal = guid;
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

  // Task List: the row for a Destroy stop from an earlier run that no longer has any blocker
  // left to free (thisplugin.doneBlockerStopGuids/plan.doneStops) — shown pale yellow and
  // struck through, like any other finished portal, instead of silently disappearing the
  // instant the blocking link it stood for is gone. No checkbox, no "frees" count and no
  // Google Maps stop: there's nothing left to do here.
  thisplugin.buildDoneBlockerStopHTML = function (stop) {
    var latlng = map.unproject(stop.point, thisplugin.PROJECT_ZOOM);
    var lat = Math.round(latlng.lat * 10000000) / 10000000;
    var lng = Math.round(latlng.lng * 10000000) / 10000000;
    var title = window.escapeHtmlSpecialChars(thisplugin.getPortalTitleByGuid(stop.guid));
    var guid = stop.guid || '';

    var text = '<tbody class="plugin_fanfields3_exportText_Portal"><tr class="plugin_fanfields3_portal_done" ' +
      'title="This Destroy stop is no longer needed: the blocking link(s) it was meant to free are already gone.">';
    text += '<td>&#10006;</td>';
    text += '<td>Nothing</td>';
    text += '<td></td>';
    text += '<td>';
    text += '  <a class="plugin_fanfields3_exportText_print" href="https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lng + '" target="_blank">' + title + '</a>';
    text += '  <a class="plugin_fanfields3_exportText_ui" onclick="window.plugin.fanfields.flyToPortal({lat: ' + lat + ', lng: ' + lng + "}, '" + guid + "'); return false;" + '">' + title + '</a>';
    text += '</td>';
    text += '<td></td><td></td><td></td>';
    text += '</tr></tbody>\n';
    return text;
  };

  // Keys still needed at a plan portal: one per incoming link, except those already made in-game
  // (when "Grey out done links" is on) — that key was already spent to make the link.
  thisplugin.getKeysStillNeeded = function (portal) {
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
    var total = (portal.incomingValidCount !== undefined) ? portal.incomingValidCount : (portal.incoming || []).length;
    return total - alreadyLinkedIncomingCount;
  };

  // Keys held for a portal, per the LiveInventory plugin, or else the Keys plugin; 0 without either.
  thisplugin.getAvailableKeys = function (guid) {
    if (window.plugin.LiveInventory) {
      if (window.plugin.LiveInventory.keyGuidCount) {
        return window.plugin.LiveInventory.keyGuidCount[guid] || 0;
      }
      if (window.plugin.LiveInventory.keyCount) {
        return window.plugin.LiveInventory.keyCount.find(obj => obj.portalCoupler.portalGuid === guid)
          ?.count || 0;
      }
      return 0;
    }
    if (window.plugin.keys) return window.plugin.keys.keys[guid] || 0;
    return 0;
  };

  // Finished portals (Action "Nothing"), keyed by guid -> { partners: guids of the plan portals
  // it was seen linked to in-game }. A finished portal stays finished — missing data (portal not
  // loaded, links hidden at this zoom, key counts refreshing) doesn't bring it back — until:
  //  - the plan changes (donePortalsPlanKey, see getPlanShapeKey);
  //  - the portal itself is known to belong to another team (destroyed or flipped), or to have
  //    fewer than 8 resonators;
  //  - one of its in-game links is gone and the portal at its other end is known to belong to
  //    another team.
  thisplugin.donePortalGuids = {};
  thisplugin.donePortalsPlanKey = null;

  thisplugin.syncDonePortals = function () {
    var key = thisplugin.getPlanShapeKey();
    if (key !== thisplugin.donePortalsPlanKey) {
      thisplugin.donePortalGuids = {};
      thisplugin.donePortalsPlanKey = key;
    }
  };

  // Whether the portal's loaded data says it's not ours; false while its data isn't known.
  thisplugin.isPortalKnownLost = function (guid) {
    var ownTeam = thisplugin.getOwnFactionTeam();
    var team = thisplugin.getPortalTeam(window.portals[guid]);
    return ownTeam !== undefined && team !== undefined && team !== ownTeam;
  };

  // Whether the portal's loaded data says it has fewer than 8 resonators; false while unknown.
  thisplugin.isPortalKnownDamaged = function (guid) {
    var marker = window.portals[guid];
    var resCount = marker && marker.options && marker.options.data ? marker.options.data.resCount : undefined;
    return resCount !== undefined && resCount < 8;
  };

  // Whether fp counts as finished: isNothingNow is what the live data says right now. Only a
  // live "Nothing" marks the portal finished; see donePortalGuids for what unmarks it.
  thisplugin.isPortalDone = function (fp, isNothingNow) {
    var entry = thisplugin.donePortalGuids[fp.guid];
    if (entry) {
      var lost = thisplugin.isPortalKnownLost(fp.guid) || thisplugin.isPortalKnownDamaged(fp.guid) ||
        Object.keys(entry.partners).some(function (partnerGuid) {
        return !thisplugin.isLinkInGame(fp.guid, partnerGuid) && thisplugin.isPortalKnownLost(partnerGuid);
      });
      if (lost) {
        delete thisplugin.donePortalGuids[fp.guid];
        entry = null;
      }
    }
    if (!entry && !isNothingNow) return false;

    entry = entry || (thisplugin.donePortalGuids[fp.guid] = { partners: {} });
    (fp.outgoing || []).concat(fp.incoming || []).forEach(function (partner) {
      if (thisplugin.isLinkInGame(fp.guid, partner.guid)) entry.partners[partner.guid] = true;
    });
    return true;
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

    thisplugin.syncDonePortals();

    displayOrder.forEach(function (portal, index) {
      blockerPlan.stops.forEach(function (stop) {
        if (stop.slot === index) text += thisplugin.buildBlockerStopHTML(stop, gmStops);
      });
      blockerPlan.doneStops.forEach(function (stop) {
        if (stop.slot === index) text += thisplugin.buildDoneBlockerStopHTML(stop);
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

      var keysNeeded = thisplugin.getKeysStillNeeded(portal);

      let availableKeys = 0;
      let hasKeysPluginData = !!(window.plugin.keys || window.plugin.LiveInventory);
      let hasEnoughKeys = false;
      let keyColorAttribute = '';
      if (hasKeysPluginData) {
        availableKeys = thisplugin.getAvailableKeys(portal.guid);
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
      if (thisplugin.isPortalDone(portal, action === 'Nothing')) action = 'Nothing';

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
      // flag it so it's captured, with enough of its own keys gathered, ahead of schedule. Not
      // while a "Reroute" order is shown: that order already places every portal early enough.
      let isRelocatedForLessWalking = !thisplugin.routeOrderInfo &&
        !!(thisplugin.relocatedForLessWalkingGuids && thisplugin.relocatedForLessWalkingGuids[portal.guid]);

      // Both classes can apply at once (a portal with nothing left to do that was also
      // relocated): "done" wins in the stylesheet, so a finished portal always shows faded
      // yellow and struck through, like every other finished portal.
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
          let outTitle = window.escapeHtmlSpecialChars(outPortalTitle);
          let outUriTitle = encodeURIComponent(outPortalTitle);
          let outLatlng = map.unproject(outPortal.point, thisplugin.PROJECT_ZOOM);
          let outLat = Math.round(outLatlng.lat * 10000000) / 10000000;
          let outLng = Math.round(outLatlng.lng * 10000000) / 10000000;
          let outGmapsHref = `https://www.google.com/maps/dir/?api=1&destination=${outLat},${outLng}&query_destination_id=(${outUriTitle})`;

          // Portal Name (Target) — same print/UI link pair as the main portal row.
          linkDetailText += '<td>';
          linkDetailText += `  <a class="plugin_fanfields3_exportText_print" href="${outGmapsHref}" target="_blank">${outTitle}</a>`;
          linkDetailText +=
            `  <a class="plugin_fanfields3_exportText_ui" onclick="window.plugin.fanfields.flyToPortal({lat: ${outLat}, lng: ${outLng}}, '${outPortal.guid}'); return false;">${outTitle}</a>`;
          linkDetailText += '</td>';

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

    var routeInfo = thisplugin.routeOrderInfo;
    if (routeInfo) {
      text += '<div class="plugin_fanfields3_route_summary">&#128694; Steps still to do reordered from your position (' +
        routeInfo.source + '): about ' + thisplugin.formatDistance(routeInfo.after) + ' of walking' +
        (routeInfo.after < routeInfo.before - 1
          ? ' instead of ' + thisplugin.formatDistance(routeInfo.before) + '.'
          : ' — the current order was already the shortest found.') +
        '</div>';
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
      '  <button id="plugin_fanfields3_reset_link_flips_btn"' + (flipCount === 0 && !routeInfo ? ' disabled' : '') +
      '    title="Revert all manually flipped links (' + flipCount + ') back to automatic calculation' +
      (routeInfo ? ', and drop the Reroute order' : '') + '">Reset link orders</button>' +
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

  // The Task List toggle for a given guid, and whether its portal row is finished (Action "Nothing").
  thisplugin.findTaskListToggle = function (guid) {
    return $('#plugin_fanfields3_exportText_inner [plugin_fanfields3_exportText_toggle="toggle"][data-guid="' + guid + '"]');
  };

  thisplugin.isTaskListToggleDone = function ($toggle) {
    return $toggle.closest('tr').hasClass('plugin_fanfields3_portal_done');
  };

  // Rebuild the Task List dialog's content in place, preserving the expanded/collapsed
  // per-portal link lists. Used after a flip/reset, and to auto-refresh live as the
  // background plan changes (new links appearing in-game, fan field rotation, etc.).
  // An expanded portal that has just become finished is collapsed, and the next unfinished
  // row below it with link details is expanded instead, so the list follows the walk.
  thisplugin.refreshTaskListDialog = function () {
    var expandedGuids = thisplugin.getTaskListExpandedGuids();
    var doneBefore = {};
    expandedGuids.forEach(function (guid) {
      doneBefore[guid] = thisplugin.isTaskListToggleDone(thisplugin.findTaskListToggle(guid));
    });

    $('#plugin_fanfields3_exportText_inner').html(thisplugin.buildTaskListHTML());
    thisplugin.wireTaskListHandlers();

    var guidsToExpand = [];
    expandedGuids.forEach(function (guid) {
      var $toggle = thisplugin.findTaskListToggle(guid);
      if (doneBefore[guid] || !$toggle.length || !thisplugin.isTaskListToggleDone($toggle)) {
        if (guidsToExpand.indexOf(guid) === -1) guidsToExpand.push(guid);
        return;
      }
      $toggle.closest('tbody').nextAll('tbody.plugin_fanfields3_exportText_Portal').each(function () {
        var $nextToggle = $(this).find('[plugin_fanfields3_exportText_toggle="toggle"]');
        if (!$nextToggle.length || thisplugin.isTaskListToggleDone($nextToggle)) return true;
        var nextGuid = $nextToggle.attr('data-guid');
        if (guidsToExpand.indexOf(nextGuid) === -1) guidsToExpand.push(nextGuid);
        return false;
      });
    });
    thisplugin.restoreTaskListExpandedGuids(guidsToExpand);
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
    thisplugin.expandTaskListFirstPending();
    thisplugin.scrollTaskListToFirstPending();

  };

  // Expand the link details of the first row with something still left to do (any row not
  // marked done, Destroy stops included) that has link details to show.
  thisplugin.expandTaskListFirstPending = function () {
    $('#plugin_fanfields3_exportText_inner tbody.plugin_fanfields3_exportText_Portal').each(function () {
      var $toggle = $(this).find('[plugin_fanfields3_exportText_toggle="toggle"]');
      if (!$toggle.length || thisplugin.isTaskListToggleDone($toggle)) return true;
      thisplugin.restoreTaskListExpandedGuids([$toggle.attr('data-guid')]);
      return false;
    });
  };

  // Scroll the open Task List so its first row with something still left to do (any row not
  // marked done, Destroy stops included) sits at the top of the visible area, with the
  // previous row kept just above it for context. Stays at the top when that's the very first
  // row, or when every row is already done.
  thisplugin.scrollTaskListToFirstPending = function () {
    var $content = $('#dialog-plugin_fanfields3_alert_textExport');
    if (!$content.length) return;

    var $rows = $content.find('.plugin_fanfields3_exportText_Portal > tr');
    var pendingIndex = -1;
    $rows.each(function (i) {
      if (!$(this).hasClass('plugin_fanfields3_portal_done')) {
        pendingIndex = i;
        return false;
      }
    });
    if (pendingIndex <= 0) return;

    var $target = $rows.eq(pendingIndex - 1);
    $content.scrollTop($content.scrollTop() + $target.offset().top - $content.offset().top);
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
      '<button type="button" id="plugin_fanfields3_tasklist_refresh" class="plugin_fanfields3_tasklist_shift_btn" title="Force an IITC map data refresh">Refresh</button>' +
      '<button type="button" id="plugin_fanfields3_tasklist_reroute" class="plugin_fanfields3_tasklist_shift_btn" title="Reorder the steps still to do, starting from your current position, to walk as little as possible">Reroute</button>';
    if (window.plugin.keys) {
      buttonsHtml += '<button type="button" id="plugin_fanfields3_tasklist_keysvideo" class="plugin_fanfields3_tasklist_shift_btn" title="Update the Keys plugin from a screen recording of your keys in Ingress">Keys video</button>';
    }

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
    $buttonpane.find('#plugin_fanfields3_tasklist_reroute')
      .off('click')
      .on('click', function () {
        var $btn = $(this);
        if ($btn.prop('disabled')) return;
        $btn.prop('disabled', true).text('Locating…');
        thisplugin.rerouteFromPlayerPosition(function () {
          $btn.prop('disabled', false).text('Reroute');
        });
      });
    $buttonpane.find('#plugin_fanfields3_tasklist_keysvideo')
      .off('click')
      .on('click', function () {
        thisplugin.openKeysVideoDialog();
      });
  };

  // ---------------------------------------------------------------------
  // Task List "Walk sim" button: closes the Task List and previews the planned walk (portal
  // positions plus any Blockers Destroy stops, in walk order — the same stops "Navigate with
  // Google Maps" sends) as an animated line crawling from stop to stop across the map, pausing
  // briefly at each one. Pure visualization: touches no plan state. Clicking anywhere on the
  // map stops it early.
  // ---------------------------------------------------------------------

  thisplugin.WALK_SIM_SEGMENT_MS = 500; // time to animate between two consecutive stops
  thisplugin.WALK_SIM_DWELL_MS = 150;   // pause at each stop before moving on

  // Whether the sim also draws each portal's own outgoing links (thinner, same cyan) as the
  // walk reaches it — lets the fields visibly form alongside the walk itself. Always on (no
  // longer a user-facing option); an older saved op or default that still carries its own
  // walkSimShowLinks: false is simply ignored (see applyOptionsSnapshot), not applied.
  thisplugin.walkSimShowLinks = true;

  // The ordered stops to animate through: every walk portal, with any Blockers Destroy stop
  // inserted at its slot — mirrors how buildTaskListHTML/getPortalRouteStops build their own
  // stop list, just without the HTML/API-specific parts. A portal stop also carries the
  // latlngs of its own outgoing links, and of any field that closes exactly when this stop's
  // links are thrown (a Destroy stop throws nothing, so it gets neither), for
  // thisplugin.walkSimShowLinks to draw once the sim settles there. Field completion is worked
  // out the same way thisplugin.simulateWalk does (a field closes once all 3 of its sides have
  // been thrown, credited to whichever of the 3 links is thrown last), kept separate since this
  // only needs latlngs to draw, not validity.
  thisplugin.getWalkSimStops = function () {
    var order = thisplugin.getDisplayOrder();
    var blockerPlan = thisplugin.computeBlockerPlan();
    var stops = [];

    var pointToGuid = {};
    order.forEach(function (fp) { pointToGuid[thisplugin.pointKey(fp.point)] = fp.guid; });

    var fieldsByLink = {};
    var seenFieldIds = {};
    order.forEach(function (fp) {
      (fp.outgoing || []).forEach(function (target) {
        var meta = fp.outgoingMeta ? fp.outgoingMeta[target.guid] : null;
        ((meta && meta.creatingFieldsWith) || []).forEach(function (thirdPoint) {
          var thirdGuid = pointToGuid[thisplugin.pointKey(thirdPoint)];
          if (!thirdGuid) return;
          var id = [fp.guid, target.guid, thirdGuid].sort().join('|');
          if (seenFieldIds[id]) return;
          seenFieldIds[id] = true;
          var field = {
            id: id,
            latlngs: [thirdPoint, fp.point, target.point].map(function (p) { return map.unproject(p, thisplugin.PROJECT_ZOOM); }),
            links: [
              thisplugin.getUndirectedLinkKey(fp.guid, target.guid),
              thisplugin.getUndirectedLinkKey(fp.guid, thirdGuid),
              thisplugin.getUndirectedLinkKey(target.guid, thirdGuid)
            ]
          };
          field.links.forEach(function (linkKey) { (fieldsByLink[linkKey] = fieldsByLink[linkKey] || []).push(field); });
        });
      });
    });

    var builtLinks = {};
    var formedFieldIds = {};

    order.forEach(function (fp, index) {
      blockerPlan.stops.forEach(function (stop) {
        if (stop.slot === index) {
          stops.push({
            latlng: map.unproject(stop.point, thisplugin.PROJECT_ZOOM),
            title: thisplugin.getPortalTitleByGuid(stop.guid),
            links: [],
            fields: []
          });
        }
      });

      var links = [];
      var fields = [];
      (fp.outgoing || []).forEach(function (target) {
        links.push(map.unproject(target.point, thisplugin.PROJECT_ZOOM));
        var linkKey = thisplugin.getUndirectedLinkKey(fp.guid, target.guid);
        builtLinks[linkKey] = true;
        (fieldsByLink[linkKey] || []).forEach(function (field) {
          if (formedFieldIds[field.id]) return;
          if (!field.links.every(function (k) { return builtLinks[k]; })) return;
          formedFieldIds[field.id] = true;
          fields.push(field.latlngs);
        });
      });

      stops.push({
        latlng: map.unproject(fp.point, thisplugin.PROJECT_ZOOM),
        title: thisplugin.getPortalTitleByGuid(fp.guid),
        links: links,
        fields: fields
      });
    });
    return stops;
  };

  // Clears the sim's drawing (trail, links, fields) and detaches the map-click handler — safe
  // to call any time, including when nothing is currently drawn. Cancels any in-flight
  // animation first; this is the ONLY way the drawing goes away — the sim reaching its last
  // stop on its own leaves everything on the map (see visitNext below) so the result stays
  // visible until the player taps the map to dismiss it.
  thisplugin.stopWalkSim = function () {
    var state = thisplugin._walkSimState;
    thisplugin._walkSimState = null; // first, so any in-flight animation frame/timeout no-ops
    if (state) {
      if (state.rafId !== null) cancelAnimationFrame(state.rafId);
      if (state.timeoutId !== null) clearTimeout(state.timeoutId);
    }
    map.off('click', thisplugin.stopWalkSim);

    if (thisplugin.walkSimLayerGroup) {
      thisplugin.walkSimLayerGroup.clearLayers();
      if (map.hasLayer(thisplugin.walkSimLayerGroup)) map.removeLayer(thisplugin.walkSimLayerGroup);
    }

    if (thisplugin.walkSimCounterEl) {
      thisplugin.walkSimCounterEl.remove();
      thisplugin.walkSimCounterEl = null;
    }
  };

  // Starts (replacing any run already in progress) an animated preview of the walk: a trail
  // polyline grows stop by stop, with a marker at its leading edge, panning the map to keep
  // each stop in view as it's approached.
  thisplugin.startWalkSim = function () {
    thisplugin.stopWalkSim();

    var stops = thisplugin.getWalkSimStops();
    if (stops.length < 2) return;

    if (!thisplugin.walkSimLayerGroup) thisplugin.walkSimLayerGroup = new L.LayerGroup();
    thisplugin.walkSimLayerGroup.addTo(map);

    // Small running counter of links/fields/distance walked so far — same option as the
    // links/fields drawing itself, updated as each stop settles (see settleHere below).
    var totalLinksSoFar = 0;
    var totalFieldsSoFar = 0;
    var totalDistanceSoFar = 0;
    if (thisplugin.walkSimShowLinks) {
      thisplugin.walkSimCounterEl = $('<div class="plugin_fanfields3_walksim_counter"></div>')
        .text('Links: 0 · Fields: 0 · Distance: ' + thisplugin.formatDistance(0))
        .appendTo(document.body);
    }

    var visited = []; // real stops reached so far; visitNext(0) adds the first one
    var trail = L.polyline(visited, {
      color: '#00e5ff', weight: 4, opacity: 0.9, interactive: false
    }).addTo(thisplugin.walkSimLayerGroup);
    var head = L.circleMarker(stops[0].latlng, {
      radius: 7, color: '#00e5ff', fillColor: '#00e5ff', fillOpacity: 1, weight: 2, interactive: false
    }).addTo(thisplugin.walkSimLayerGroup);

    var state = { rafId: null, timeoutId: null };
    thisplugin._walkSimState = state;
    map.on('click', thisplugin.stopWalkSim);

    function centerIfOffscreen(latlng) {
      if (!map.getBounds().contains(latlng)) map.panTo(latlng, { animate: true });
    }

    function animateSegment(fromLatLng, toLatLng, onDone) {
      var startTs = null;
      function step(now) {
        if (thisplugin._walkSimState !== state) return; // stopped meanwhile
        if (startTs === null) startTs = now;
        var t = Math.min(1, (now - startTs) / thisplugin.WALK_SIM_SEGMENT_MS);
        var current = L.latLng(
          fromLatLng.lat + (toLatLng.lat - fromLatLng.lat) * t,
          fromLatLng.lng + (toLatLng.lng - fromLatLng.lng) * t
        );
        head.setLatLng(current);
        trail.setLatLngs(visited.concat([current]));
        if (t < 1) {
          state.rafId = requestAnimationFrame(step);
        } else {
          onDone();
        }
      }
      state.rafId = requestAnimationFrame(step);
    }

    function visitNext(index) {
      if (thisplugin._walkSimState !== state) return;
      if (index >= stops.length) {
        // Done: stop animating, but leave the trail/links/fields and the map-click handler in
        // place — thisplugin.stopWalkSim() only runs (clearing everything) once the player taps
        // the map, so the finished result stays visible until then.
        thisplugin._walkSimState = null;
        return;
      }

      var stop = stops[index];
      centerIfOffscreen(stop.latlng);

      function settleHere() {
        if (visited.length) totalDistanceSoFar += visited[visited.length - 1].distanceTo(stop.latlng);
        visited.push(stop.latlng);
        trail.setLatLngs(visited);
        head.setLatLng(stop.latlng);
        if (thisplugin.walkSimShowLinks) {
          (stop.links || []).forEach(function (targetLatLng) {
            L.polyline([stop.latlng, targetLatLng], {
              color: '#00e5ff', weight: 1.5, opacity: 0.7, interactive: false
            }).addTo(thisplugin.walkSimLayerGroup);
          });
          (stop.fields || []).forEach(function (fieldLatLngs) {
            L.polygon(fieldLatLngs, {
              color: '#00e5ff', weight: 1, opacity: 0.6, fillColor: '#00e5ff', fillOpacity: 0.15, interactive: false
            }).addTo(thisplugin.walkSimLayerGroup);
          });
          totalLinksSoFar += (stop.links || []).length;
          totalFieldsSoFar += (stop.fields || []).length;
          if (thisplugin.walkSimCounterEl) {
            thisplugin.walkSimCounterEl.text('Links: ' + totalLinksSoFar + ' · Fields: ' + totalFieldsSoFar +
              ' · Distance: ' + thisplugin.formatDistance(totalDistanceSoFar));
          }
        }
        state.timeoutId = setTimeout(function () { visitNext(index + 1); }, thisplugin.WALK_SIM_DWELL_MS);
      }

      if (index === 0) {
        settleHere();
      } else {
        // animateSegment only ever reads `visited` (via .concat, never mutating it) to draw its
        // own live tail point each frame, so it's still exactly the stops reached so far here.
        animateSegment(stops[index - 1].latlng, stop.latlng, function () {
          if (thisplugin._walkSimState !== state) return;
          settleHere();
        });
      }
    }

    visitNext(0);
  };

  // ---------------------------------------------------------------------
  // Task List "Reroute" button: reorders the steps still to do so that, starting from where the
  // player stands, they walk as little as possible. Only the walk/display order changes
  // (thisplugin.routeOrderGuids) — never which links exist, their direction or which fields
  // form. The order must stay playable:
  //  - a portal that still has to be captured, or whose keys are still missing, is visited
  //    before any portal that throws a link at it. A portal that's already ours with enough of
  //    its keys held (per a Keys/LiveInventory plugin) can receive links before its own visit;
  //  - it may not make more links impossible to throw from under a field, nor lose a field,
  //    compared with the current order (see thisplugin.simulateWalk).
  // ---------------------------------------------------------------------

  thisplugin.ROUTE_SEARCH_BUDGET_MS = 1500;
  thisplugin.ROUTE_GEOLOCATION_TIMEOUT_MS = 10000;

  // Calls back with the player's position { latlng, source }: the device's own location first,
  // else the last position known to IITC's user-location plugin, else the center of the map.
  thisplugin.getPlayerPosition = function (callback) {
    var answered = false;
    function answer(position) {
      if (answered) return;
      answered = true;
      callback(position);
    }
    function fallback() {
      var user = window.plugin.userLocation && window.plugin.userLocation.user;
      var ll = user && user.latlng;
      if (ll && (ll.lat || ll.lng)) {
        answer({ latlng: L.latLng(ll.lat, ll.lng), source: 'IITC location' });
      } else {
        answer({ latlng: map.getCenter(), source: 'map center, as your location was not available' });
      }
    }

    if (!navigator.geolocation) {
      fallback();
      return;
    }
    // A permission prompt left unanswered never calls back at all.
    setTimeout(fallback, thisplugin.ROUTE_GEOLOCATION_TIMEOUT_MS + 2000);
    navigator.geolocation.getCurrentPosition(function (pos) {
      answer({ latlng: L.latLng(pos.coords.latitude, pos.coords.longitude), source: 'GPS' });
    }, fallback, {
      enableHighAccuracy: true,
      timeout: thisplugin.ROUTE_GEOLOCATION_TIMEOUT_MS,
      maximumAge: 30000
    });
  };

  // Where each portal of the walk stands, from the live game state:
  //  - pending: something is still left to do there (capture, links to throw, keys to get);
  //  - ready: it can already receive links (ours, with enough of its keys held);
  //  - targets: the portals it still has links to throw at.
  // Links that can't be thrown from under a field are left out, as in the Task List.
  thisplugin.getRouteStepStates = function (walk) {
    var ownTeam = thisplugin.getOwnFactionTeam();
    var hasKeysPlugin = !!(window.plugin.keys || window.plugin.LiveInventory);

    function isThrowable(srcFp, dstGuid) {
      var meta = srcFp.outgoingMeta && srcFp.outgoingMeta[dstGuid];
      return !(meta && meta.invalidUnderField) && !thisplugin.isLinkInGame(srcFp.guid, dstGuid);
    }

    thisplugin.syncDonePortals();

    var states = {};
    walk.forEach(function (fp) {
      var marker = window.portals[fp.guid] || fp.portal;
      var data = marker && marker.options && marker.options.data;
      var owned = ownTeam !== undefined && thisplugin.getPortalTeam(marker) === ownTeam;
      var needsCapture = !owned || !(data && data.resCount >= 8);

      var targets = (fp.outgoing || []).filter(function (target) { return isThrowable(fp, target.guid); });
      var keysNeeded = (fp.incoming || []).filter(function (src) { return isThrowable(src, fp.guid); }).length;
      var enoughKeys = hasKeysPlugin ? thisplugin.getAvailableKeys(fp.guid) >= keysNeeded : keysNeeded === 0;

      states[fp.guid] = {
        pending: needsCapture || targets.length > 0 || !enoughKeys ? !thisplugin.isPortalDone(fp, false) : false,
        ready: owned && enoughKeys,
        targets: targets
      };
    });
    return states;
  };

  // Computes the "Reroute" walk order from startLatLng. Returns null when no step is left to do,
  // else { order: guids (steps done first, in their current order, then the remaining ones),
  // before, after: meters walked through the remaining steps in the current / new order }.
  thisplugin.computeRouteOrder = function (startLatLng) {
    var walk = thisplugin.getDisplayOrder();
    var states = thisplugin.getRouteStepStates(walk);
    var done = walk.filter(function (fp) { return !states[fp.guid].pending; });
    var pending = walk.filter(function (fp) { return states[fp.guid].pending; });
    var m = pending.length;
    if (m === 0) return null;

    var indexByGuid = {};
    pending.forEach(function (fp, i) { indexByGuid[fp.guid] = i; });

    // Pairs [before, after]: a portal not ready yet comes before whoever throws a link at it.
    var precedences = [];
    pending.forEach(function (fp, i) {
      states[fp.guid].targets.forEach(function (target) {
        var ti = indexByGuid[target.guid];
        if (ti !== undefined && !states[target.guid].ready) precedences.push([ti, i]);
      });
    });

    // Walking distances between pending portals, the start being index m.
    var latLngs = pending.map(function (fp) { return map.unproject(fp.point, thisplugin.PROJECT_ZOOM); });
    latLngs.push(startLatLng);
    var dist = latLngs.map(function (a) { return latLngs.map(function (b) { return a.distanceTo(b); }); });

    function lengthOf(seq) {
      var total = dist[m][seq[0]];
      for (var i = 1; i < seq.length; i++) total += dist[seq[i - 1]][seq[i]];
      return total;
    }
    function violationsOf(seq) {
      var pos = [];
      seq.forEach(function (idx, p) { pos[idx] = p; });
      return precedences.filter(function (pair) { return pos[pair[0]] > pos[pair[1]]; }).length;
    }
    function evaluate(seq) {
      var sim = thisplugin.simulateWalk(done.concat(seq.map(function (idx) { return pending[idx]; })));
      return {
        seq: seq,
        length: lengthOf(seq),
        violations: violationsOf(seq),
        invalid: Object.keys(sim.invalid).length,
        fields: sim.triangles.length
      };
    }
    // Playability first (steps in a possible order, links throwable, fields kept), then walking.
    function isBetter(a, b) {
      if (a.violations !== b.violations) return a.violations < b.violations;
      if (a.invalid !== b.invalid) return a.invalid < b.invalid;
      if (a.fields !== b.fields) return a.fields > b.fields;
      return a.length < b.length - 1;
    }

    var deadline = Date.now() + thisplugin.ROUTE_SEARCH_BUDGET_MS;

    // Local search: move a run of 1 to 3 steps elsewhere, or walk a stretch backwards, keeping
    // any change that makes the order better, until none does (or time is up).
    function improve(best) {
      function tryCandidate(seq) {
        if (Date.now() >= deadline) return false;
        var violations = violationsOf(seq);
        if (violations > best.violations) return false;
        if (violations === best.violations && lengthOf(seq) >= best.length - 1) return false;
        var candidate = evaluate(seq);
        if (!isBetter(candidate, best)) return false;
        best = candidate;
        return true;
      }

      var improved = true;
      while (improved && Date.now() < deadline) {
        improved = false;
        for (var len = 1; len <= 3 && !improved; len++) {
          for (var i = 0; i + len <= m && !improved; i++) {
            var run = best.seq.slice(i, i + len);
            var rest = best.seq.slice(0, i).concat(best.seq.slice(i + len));
            for (var j = 0; j <= rest.length && !improved; j++) {
              if (j === i) continue;
              improved = tryCandidate(rest.slice(0, j).concat(run, rest.slice(j)));
            }
          }
        }
        for (var a = 0; a < m - 1 && !improved; a++) {
          for (var b = a + 1; b < m && !improved; b++) {
            improved = tryCandidate(best.seq.slice(0, a)
              .concat(best.seq.slice(a, b + 1).reverse(), best.seq.slice(b + 1)));
          }
        }
      }
      return best;
    }

    // Nearest next step whose prerequisites are already visited (the earliest remaining step of
    // the current order when none is, which only a loop in the prerequisites can cause).
    function nearestNeighbour() {
      var seq = [];
      var placed = [];
      var current = m;
      while (seq.length < m) {
        var choice = -1;
        for (var i = 0; i < m; i++) {
          if (placed[i]) continue;
          var blocked = precedences.some(function (pair) { return pair[1] === i && !placed[pair[0]]; });
          if (!blocked && (choice === -1 || dist[current][i] < dist[current][choice])) choice = i;
        }
        if (choice === -1) {
          for (choice = 0; placed[choice]; choice++);
        }
        seq.push(choice);
        placed[choice] = true;
        current = choice;
      }
      return seq;
    }

    var currentOrder = pending.map(function (fp, i) { return i; });
    var fromCurrent = evaluate(currentOrder);
    var best = improve(fromCurrent);
    var fromNearest = improve(evaluate(nearestNeighbour()));
    if (isBetter(fromNearest, best)) best = fromNearest;

    return {
      order: done.map(function (fp) { return fp.guid; })
        .concat(best.seq.map(function (idx) { return pending[idx].guid; })),
      before: fromCurrent.length,
      after: best.length
    };
  };

  // "Reroute" button: locates the player, reorders the steps still to do from there, and shows
  // the new order everywhere the walk order is used, without recalculating the plan itself — so
  // it works the same whether the plan is Locked or not. Calls onDone once finished.
  thisplugin.rerouteFromPlayerPosition = function (onDone) {
    thisplugin.getPlayerPosition(function (position) {
      thisplugin.clearRouteOrder();
      thisplugin.validateUnderFieldLinks();
      var result = thisplugin.computeRouteOrder(position.latlng);
      if (!result) {
        dialog({
          html: '<p>Every step of the plan is already done: nothing left to reorder.</p>',
          id: 'plugin_fanfields3_alert_reroute',
          title: 'Fan Fields 3 - Reroute'
        });
        thisplugin.redrawWalkOrder();
        onDone();
        return;
      }

      thisplugin.routeOrderGuids = result.order;
      thisplugin.routeOrderPlanKey = thisplugin.getPlanShapeKey();
      thisplugin.routeOrderInfo = { source: position.source, before: result.before, after: result.after };
      thisplugin.redrawWalkOrder();
      thisplugin.scrollTaskListToFirstPending();
      onDone();
    });
  };

  // Builds the Task List fresh (not from an already-open dialog, since this is also reachable
  // directly from the hamburger menu's "Plan details" submenu without the Task List ever being
  // open) and opens it in a new window for printing, with every link detail row expanded.
  thisplugin.exportTaskListToPDF = function () {
    var $dlg = $('<div></div>').html(thisplugin.buildTaskListHTML());

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

          tr td[plugin_fanfields3_notEnoughKeys] {
            color: #C62828 !important;
            font-weight: bold;
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

          tr.plugin_fanfields3_portal_done,
          tr.plugin_fanfields3_portal_done td,
          tr.plugin_fanfields3_portal_done td a,
          tr.plugin_fanfields3_portal_done td span {
            color: #828284 !important;
            text-decoration: line-through !important;
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


  // ---------------------------------------------------------------------
  // Manage Ops: save/load/rename/delete named snapshots of the current DrawTools drawing
  // (polygons, markers, lines, circles), stored in this plugin's own localStorage — never in
  // DrawTools' own storage, which always only holds whatever is currently drawn on the map.
  // Loading an op replaces EVERYTHING currently drawn with that op's own drawing.
  // ---------------------------------------------------------------------

  thisplugin.OPS_STORAGE_KEY = 'plugin-fanfields3-saved-ops';
  thisplugin.OPS_MAX_COUNT = 15;

  // JSON snapshot of the drawing, options, anchor and manual exclusions that matches whatever
  // is currently considered "saved" (the op just loaded, saved or updated, or — see the
  // pluginDrawTools hook in setup() — whatever was already on the map when IITC opened) — null
  // until that baseline exists, in which case anything already on the map counts as unsaved.
  // Shifting the anchor (even just Shift left/right), changing an option, or excluding/
  // including a portal (the "No entry" shortcut) counts as a change here too, not just editing
  // the drawn shapes. Used only to warn before an op load would silently discard such changes;
  // never persisted itself.
  thisplugin.opsBaselineJSON = null;

  // Snapshot of everything isDrawDirty() compares: the drawn shapes, the options, the anchor
  // and the manually excluded portals. `overrides` lets a caller pin a field to a specific
  // value instead of the current live one — needed right after loadOp()/clearCurrentDraw()/the
  // initial restore, where the anchor this op/restore is PINNING (op.anchor.guid, or null) is
  // known immediately, but thisplugin.startingpointGUID itself only catches up once the
  // debounced updateLayer() run that pluginDrawTools hook schedules actually completes.
  thisplugin.buildWorkSnapshotJSON = function (overrides) {
    overrides = overrides || {};
    return JSON.stringify({
      data: overrides.data || thisplugin.serializeCurrentDraw(),
      options: overrides.options || thisplugin.getCurrentOptionsSnapshot(),
      anchor: ('anchor' in overrides) ? overrides.anchor : (thisplugin.startingpointGUID || null),
      excluded: overrides.excluded || thisplugin.excludedGuidsArray()
    });
  };

  thisplugin.getSavedOps = function () {
    try {
      var raw = localStorage.getItem(thisplugin.OPS_STORAGE_KEY);
      var ops = raw ? JSON.parse(raw) : [];
      return Array.isArray(ops) ? ops : [];
    } catch (e) {
      return [];
    }
  };

  thisplugin.setSavedOps = function (ops) {
    localStorage.setItem(thisplugin.OPS_STORAGE_KEY, JSON.stringify(ops));
  };

  thisplugin.generateOpId = function () {
    return 'op_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  };

  // Serializes one DrawTools layer into a plain object — written directly against Leaflet's
  // own layer classes (the same way thisplugin already recognizes a drawn polygon elsewhere,
  // e.g. findFanpoints()'s "instanceof L.GeodesicPolygon" check) rather than through any
  // DrawTools-internal helper. DrawTools' own save/import/serializeLayer functions differ
  // across installed versions (some lack a per-layer serializeLayer entirely, or don't fire
  // the hook this plugin listens on when importing), which is what silently turned an op into
  // an empty save, or a load into nothing being drawn. This has no such version dependency:
  // only drawnItems (a plain Leaflet FeatureGroup) and the Geodesic layer classes/factories are
  // used, both already required unconditionally elsewhere in this file.
  thisplugin.serializeDrawLayer = function (layer) {
    if (layer instanceof L.GeodesicCircle || layer instanceof L.Circle) {
      return { type: 'circle', latLng: layer.getLatLng(), radius: layer.getRadius(), color: layer.options.color };
    }
    if (layer instanceof L.GeodesicPolygon || layer instanceof L.Polygon) {
      return { type: 'polygon', latLngs: layer.getLatLngs(), color: layer.options.color };
    }
    if (layer instanceof L.GeodesicPolyline || layer instanceof L.Polyline) {
      return { type: 'polyline', latLngs: layer.getLatLngs(), color: layer.options.color };
    }
    if (layer instanceof L.Marker) {
      var icon = layer.options.icon;
      var color = (icon && icon.options && icon.options.color) || undefined;
      return { type: 'marker', latLng: layer.getLatLng(), color: color };
    }
    return null;
  };

  // The mirror of serializeDrawLayer: builds a fresh Leaflet layer from a stored item, using
  // the same Geodesic factories DrawTools itself uses to draw. Picks up DrawTools' own default
  // style options (polygonOptions/lineOptions/markerOptions) when available, so a reloaded op
  // looks the same as a freshly drawn shape; falls back to plain defaults otherwise.
  thisplugin.buildDrawLayerFromItem = function (item) {
    var dt = window.plugin.drawTools;
    var extraOpt = {};
    if (item.color) extraOpt.color = item.color;

    switch (item.type) {
      case 'polygon':
        return L.geodesicPolygon(item.latLngs, L.extend({}, (dt && dt.polygonOptions) || {}, extraOpt));
      case 'polyline':
        return L.geodesicPolyline(item.latLngs, L.extend({}, (dt && dt.lineOptions) || {}, extraOpt));
      case 'circle':
        return L.geodesicCircle(item.latLng, item.radius, L.extend({}, (dt && dt.polygonOptions) || {}, extraOpt));
      case 'marker': {
        var markerOpt = L.extend({}, (dt && dt.markerOptions) || {});
        if (item.color && dt && typeof dt.getMarkerIcon === 'function') markerOpt.icon = dt.getMarkerIcon(item.color);
        var marker = new L.Marker(item.latLng, markerOpt);
        if (typeof window.registerMarkerForOMS === 'function') window.registerMarkerForOMS(marker);
        return marker;
      }
      default:
        return null;
    }
  };

  // The current DrawTools drawing, as a plain-object array in the same shape DrawTools itself
  // uses for its own storage/export.
  thisplugin.serializeCurrentDraw = function () {
    var items = [];
    if (window.plugin.drawTools && window.plugin.drawTools.drawnItems) {
      window.plugin.drawTools.drawnItems.eachLayer(function (layer) {
        var item = thisplugin.serializeDrawLayer(layer);
        if (item) items.push(item);
      });
    }
    return items;
  };

  // Whether the current drawing, options or anchor differ from whichever op was last loaded/
  // saved/updated this session (or, with none yet, whether anything at all is currently
  // drawn/configured).
  thisplugin.isDrawDirty = function () {
    return thisplugin.buildWorkSnapshotJSON() !== thisplugin.opsBaselineJSON;
  };

  // Replaces the entire current drawing with the op's own drawing. Builds the new layers
  // itself (buildDrawLayerFromItem) instead of calling DrawTools' own import(), then fires the
  // same 'pluginDrawTools' hook import() would have fired, so this plugin's existing listener
  // recalculates the fan field plan exactly as it would for a hand-drawn polygon. Also updates
  // DrawTools' own localStorage (when its save() is available) so a page reload restores the
  // same drawing, the same way DrawTools' own "Reset" does — best-effort, since this plugin's
  // own op storage is already the source of truth either way.
  thisplugin.loadOp = function (op) {
    var dt = window.plugin.drawTools;
    dt.drawnItems.clearLayers();
    (op.data || []).forEach(function (item) {
      var layer = thisplugin.buildDrawLayerFromItem(item);
      if (layer) dt.drawnItems.addLayer(layer);
    });

    thisplugin.applyOptionsSnapshot(op.options);

    // Restored ahead of the hook below (same reasoning as the anchor restore just below): the
    // recalculation it triggers filters these guids out of the rebuilt plan as soon as it runs
    // (see the excludedPortalGuids block in updateLayer), and their markers are drawn right
    // away wherever thisplugin.locations already knows that portal.
    thisplugin.setExcludedPortalGuids(op.excludedGuids);

    // Restored ahead of the hook below, so the recalculation it triggers pins this anchor the
    // same way setAnchorByGuid does (see the forcedAnchorGUID block in updateLayer) — dropped
    // back to null there if this op's anchor portal isn't part of its own drawing. Always
    // restored as a manual pin (regardless of how it was originally chosen — Pick anchor, or
    // just cycling with Shift left/right) so the automatic anchor/direction search never
    // silently overrides it right after this op loads.
    thisplugin.forcedAnchorGUID = (op.anchor && op.anchor.guid) || null;
    thisplugin.forcedAnchorIsManual = !!(op.anchor && op.anchor.guid);

    if (typeof dt.save === 'function') dt.save();
    window.runHooks('pluginDrawTools', { event: 'import' });

    // The anchor override here is this op's own pin, not thisplugin.startingpointGUID — that
    // only catches up once the debounced updateLayer() run the hook above just scheduled
    // actually completes (see buildWorkSnapshotJSON). Options and exclusions are already live:
    // applied synchronously above.
    thisplugin.opsBaselineJSON = thisplugin.buildWorkSnapshotJSON({
      data: op.data || [],
      anchor: (op.anchor && op.anchor.guid) || null,
      excluded: thisplugin.excludedGuidsArray()
    });

    if (dt.drawnItems.getLayers().length) {
      map.fitBounds(dt.drawnItems.getBounds(), { maxZoom: 15, padding: [20, 20] });
    }
  };

  // Wipes everything currently drawn and resets the baseline to this empty state, so clearing
  // is itself treated as an accepted state: loading an op right after, with nothing redrawn
  // since, won't trigger an "unsaved changes" warning.
  thisplugin.clearCurrentDraw = function () {
    var dt = window.plugin.drawTools;
    dt.drawnItems.clearLayers();
    thisplugin.clearExcludedPortals(); // an empty drawing has no plan, so nothing can stay excluded from it
    if (typeof dt.save === 'function') dt.save();
    window.runHooks('pluginDrawTools', { event: 'import' });
    // anchor: null — an empty drawing has no plan, so none can be pinned; thisplugin.startingpointGUID
    // itself only catches up once the debounced updateLayer() run the hook above just scheduled completes.
    thisplugin.opsBaselineJSON = thisplugin.buildWorkSnapshotJSON({ data: [], anchor: null, excluded: [] });
  };

  // Returns true on success, or a string identifying why it failed ('limit', 'duplicate').
  thisplugin.saveNewOp = function (name) {
    var ops = thisplugin.getSavedOps();
    if (ops.length >= thisplugin.OPS_MAX_COUNT) return 'limit';
    if (ops.some(function (o) { return o.name === name; })) return 'duplicate';

    var data = thisplugin.serializeCurrentDraw();
    var options = thisplugin.getCurrentOptionsSnapshot();
    var anchor = thisplugin.startingpointGUID || null;
    var excluded = thisplugin.excludedGuidsArray();
    ops.push({
      id: thisplugin.generateOpId(),
      name: name,
      data: data,
      options: options,
      anchor: { guid: anchor },
      excludedGuids: excluded,
      savedAt: Date.now()
    });
    thisplugin.setSavedOps(ops);
    thisplugin.opsBaselineJSON = thisplugin.buildWorkSnapshotJSON({ data: data, options: options, anchor: anchor, excluded: excluded });
    return true;
  };

  // Overwrites an existing op's drawing with the current one, without creating a new op or
  // touching its name.
  thisplugin.updateOp = function (opId) {
    var ops = thisplugin.getSavedOps();
    var op = ops.find(function (o) { return o.id === opId; });
    if (!op) return false;

    var data = thisplugin.serializeCurrentDraw();
    var options = thisplugin.getCurrentOptionsSnapshot();
    var anchor = thisplugin.startingpointGUID || null;
    var excluded = thisplugin.excludedGuidsArray();
    op.data = data;
    op.options = options;
    op.anchor = { guid: anchor };
    op.excludedGuids = excluded;
    op.savedAt = Date.now();
    thisplugin.setSavedOps(ops);
    thisplugin.opsBaselineJSON = thisplugin.buildWorkSnapshotJSON({ data: data, options: options, anchor: anchor, excluded: excluded });
    return true;
  };

  // Returns true on success, or 'duplicate' when another op already has that name.
  thisplugin.renameOp = function (opId, newName) {
    var ops = thisplugin.getSavedOps();
    if (ops.some(function (o) { return o.id !== opId && o.name === newName; })) return 'duplicate';

    var op = ops.find(function (o) { return o.id === opId; });
    if (!op) return false;

    op.name = newName;
    thisplugin.setSavedOps(ops);
    return true;
  };

  thisplugin.deleteOp = function (opId) {
    thisplugin.setSavedOps(thisplugin.getSavedOps().filter(function (o) { return o.id !== opId; }));
  };

  // A small Yes/No confirmation dialog — for anything in Manage Ops that can't be undone.
  // IITC's dialog() wrapper deep-merges whatever "buttons" option it's given on top of its own
  // default ({ OK: ... }), rather than replacing it, so passing { Yes, No } straight to dialog()
  // ends up showing OK, Yes AND No. Instead, the dialog is created with its plain default OK
  // button, then jQuery UI's own buttons setter (.dialog('option', 'buttons', ...)) replaces the
  // whole button set outright — that setter assigns directly, with no such merging.
  thisplugin.confirmDialog = function (title, message, onConfirm) {
    var id = 'plugin_fanfields3_ops_confirm';
    var width = Math.min(380, thisplugin.getMaxDialogWidth());
    dialog({
      html: '<p>' + message + '</p>',
      id: id,
      title: title,
      width: width,
      closeOnEscape: true
    });

    $('#dialog-' + id).dialog('option', 'buttons', {
      Yes: function () {
        $(this).dialog('close');
        onConfirm();
      },
      No: function () {
        $(this).dialog('close');
      }
    });
  };

  thisplugin.formatOpSavedAt = function (timestamp) {
    try {
      return new Date(timestamp).toLocaleString();
    } catch (e) {
      return '';
    }
  };

  thisplugin.buildManageOpsHTML = function () {
    var ops = thisplugin.getSavedOps();
    var atLimit = ops.length >= thisplugin.OPS_MAX_COUNT;

    var html = '<div style="text-align:right;">' +
      '<button type="button" id="plugin_fanfields3_ops_clear_btn" title="Clear everything currently drawn">Clear drawing</button>' +
      '</div>';
    html += '<div class="plugin_fanfields3_ops_save_row">';
    html += '<input type="text" id="plugin_fanfields3_ops_newname" maxlength="60" placeholder="New op name"' + (atLimit ? ' disabled' : '') + '>';
    html += '<button type="button" id="plugin_fanfields3_ops_save_btn"' + (atLimit ? ' disabled' : '') + '>Save current draw</button>';
    html += '</div>';
    html += '<div id="plugin_fanfields3_ops_save_error" class="plugin_fanfields3_warn"></div>';
    html += '<div class="plugin_fanfields3_ops_count">' + ops.length + ' / ' + thisplugin.OPS_MAX_COUNT + ' ops saved' +
      (atLimit ? ' &mdash; delete one to save another' : '') + '</div>';

    if (!ops.length) {
      html += '<p class="plugin_fanfields3_italic">No op saved yet.</p>';
    } else {
      html += '<table class="plugin_fanfields3_order_table plugin_fanfields3_ops_table"><thead><tr>';
      html += '<th style="text-align:left;">Name</th><th>Saved</th><th colspan="4"></th>';
      html += '</tr></thead><tbody>';

      ops.slice().sort(function (a, b) { return b.savedAt - a.savedAt; }).forEach(function (op) {
        html += '<tr data-op-id="' + op.id + '">';
        html += '<td class="plugin_fanfields3_ops_name_cell">' +
          '<a href="#" class="plugin_fanfields3_ops_load_link" title="Load this op (replaces the current drawing)">' +
          window.escapeHtmlSpecialChars(op.name) + '</a></td>';
        html += '<td class="plugin_fanfields3_italic">' + thisplugin.formatOpSavedAt(op.savedAt) + '</td>';
        html += '<td><button type="button" class="plugin_fanfields3_ops_btn plugin_fanfields3_ops_open_btn" title="Open (replaces the current drawing)">&#128194;</button></td>';
        html += '<td><button type="button" class="plugin_fanfields3_ops_btn plugin_fanfields3_ops_rename_btn" title="Rename">&#9998;</button></td>';
        html += '<td><button type="button" class="plugin_fanfields3_ops_btn plugin_fanfields3_ops_update_btn" title="Overwrite this op with the current drawing">&#128190;</button></td>';
        html += '<td><button type="button" class="plugin_fanfields3_ops_btn plugin_fanfields3_ops_delete_btn" title="Delete">&#10006;</button></td>';
        html += '</tr>';
      });

      html += '</tbody></table>';
    }

    html += '<div class="plugin_fanfields3_order_hint">Click an op\'s name to load it &mdash; this replaces everything currently drawn.</div>';

    return html;
  };

  thisplugin.refreshManageOpsDialog = function () {
    $('#plugin_fanfields3_ops_dialog_inner').html(thisplugin.buildManageOpsHTML());
    thisplugin.wireManageOpsHandlers();
  };

  thisplugin.wireManageOpsHandlers = function () {
    var $inner = $('#plugin_fanfields3_ops_dialog_inner');

    $inner.find('#plugin_fanfields3_ops_clear_btn').off('click').on('click', function () {
      function doClear() {
        thisplugin.clearCurrentDraw();
        thisplugin.refreshManageOpsDialog();
      }

      if (thisplugin.isDrawDirty()) {
        thisplugin.confirmDialog('Fan Fields 3 - Manage Ops',
          'The current drawing has unsaved changes that will be lost. Clear it anyway?',
          doClear);
      } else {
        doClear();
      }
    });

    function doSave() {
      var $input = $('#plugin_fanfields3_ops_newname');
      var name = ($input.val() || '').trim();
      var $error = $('#plugin_fanfields3_ops_save_error');
      $error.text('');

      if (!name) {
        $error.text('Enter a name for this op.');
        return;
      }

      var result = thisplugin.saveNewOp(name);
      if (result === 'limit') {
        $error.text('Maximum of ' + thisplugin.OPS_MAX_COUNT + ' ops reached — delete one first.');
        return;
      }
      if (result === 'duplicate') {
        $error.text('An op named "' + name + '" already exists — choose another name.');
        return;
      }

      thisplugin.refreshManageOpsDialog();
    }

    $inner.find('#plugin_fanfields3_ops_save_btn').off('click').on('click', doSave);
    $inner.find('#plugin_fanfields3_ops_newname').off('keydown').on('keydown', function (e) {
      if (e.key === 'Enter') doSave();
    });

    // Shared by the name link and the "Open" button: loading an op works the same way from
    // either (warn first if the current drawing has unsaved changes).
    function requestLoadOp(op) {
      function doLoad() {
        thisplugin.loadOp(op);
        $('#dialog-plugin_fanfields3_ops_dialog').dialog('close');
      }

      if (thisplugin.isDrawDirty()) {
        thisplugin.confirmDialog('Fan Fields 3 - Manage Ops',
          'The current drawing has unsaved changes that will be lost. Load "' + window.escapeHtmlSpecialChars(op.name) + '" anyway?',
          doLoad);
      } else {
        doLoad();
      }
    }

    $inner.find('.plugin_fanfields3_ops_load_link').off('click').on('click', function (ev) {
      ev.preventDefault();
      var opId = $(this).closest('tr').attr('data-op-id');
      var op = thisplugin.getSavedOps().find(function (o) { return o.id === opId; });
      if (!op) return;
      requestLoadOp(op);
    });

    $inner.find('.plugin_fanfields3_ops_open_btn').off('click').on('click', function () {
      var opId = $(this).closest('tr').attr('data-op-id');
      var op = thisplugin.getSavedOps().find(function (o) { return o.id === opId; });
      if (!op) return;
      requestLoadOp(op);
    });

    $inner.find('.plugin_fanfields3_ops_rename_btn').off('click').on('click', function () {
      var $row = $(this).closest('tr');
      var opId = $row.attr('data-op-id');
      var op = thisplugin.getSavedOps().find(function (o) { return o.id === opId; });
      if (!op) return;

      var $cell = $row.find('.plugin_fanfields3_ops_name_cell');
      $cell.html(
        '<input type="text" class="plugin_fanfields3_ops_rename_input" maxlength="60" value="' +
        window.escapeHtmlSpecialChars(op.name) + '">' +
        '<button type="button" class="plugin_fanfields3_ops_btn plugin_fanfields3_ops_rename_ok" title="Confirm">&#10003;</button>' +
        '<button type="button" class="plugin_fanfields3_ops_btn plugin_fanfields3_ops_rename_cancel" title="Cancel">&#10006;</button>'
      );
      var $input = $cell.find('.plugin_fanfields3_ops_rename_input');
      $input.trigger('focus').trigger('select');

      function confirmRename() {
        var newName = ($input.val() || '').trim();
        if (!newName) return;
        var result = thisplugin.renameOp(opId, newName);
        if (result === 'duplicate') {
          $input.css('border-color', '#C62828');
          return;
        }
        thisplugin.refreshManageOpsDialog();
      }

      $cell.find('.plugin_fanfields3_ops_rename_ok').on('click', confirmRename);
      $cell.find('.plugin_fanfields3_ops_rename_cancel').on('click', function () {
        thisplugin.refreshManageOpsDialog();
      });
      $input.on('keydown', function (e) {
        if (e.key === 'Enter') confirmRename();
        if (e.key === 'Escape') thisplugin.refreshManageOpsDialog();
      });
    });

    $inner.find('.plugin_fanfields3_ops_update_btn').off('click').on('click', function () {
      var opId = $(this).closest('tr').attr('data-op-id');
      var op = thisplugin.getSavedOps().find(function (o) { return o.id === opId; });
      if (!op) return;

      thisplugin.confirmDialog('Fan Fields 3 - Manage Ops',
        'Overwrite "' + window.escapeHtmlSpecialChars(op.name) + '" with the current drawing? This cannot be undone.',
        function () {
          thisplugin.updateOp(opId);
          thisplugin.refreshManageOpsDialog();
        });
    });

    $inner.find('.plugin_fanfields3_ops_delete_btn').off('click').on('click', function () {
      var opId = $(this).closest('tr').attr('data-op-id');
      var op = thisplugin.getSavedOps().find(function (o) { return o.id === opId; });
      if (!op) return;

      thisplugin.confirmDialog('Fan Fields 3 - Manage Ops',
        'Delete "' + window.escapeHtmlSpecialChars(op.name) + '"? This cannot be undone.',
        function () {
          thisplugin.deleteOp(opId);
          thisplugin.refreshManageOpsDialog();
        });
    });
  };

  thisplugin.showManageOpsDialog = function () {
    if (!window.plugin.drawTools) {
      dialog({
        html: '<p>Fan Fields 3 requires the IITC Drawtools plugin.</p>',
        id: 'plugin_fanfields3_ops_missing_dependency',
        title: 'Fan Fields 3 - Manage Ops'
      });
      return;
    }

    var width = 480;
    thisplugin.MaxDialogWidth = thisplugin.getMaxDialogWidth();
    if (thisplugin.MaxDialogWidth < width) width = thisplugin.MaxDialogWidth;

    dialog({
      html: '<div id="plugin_fanfields3_ops_dialog_inner">' + thisplugin.buildManageOpsHTML() + '</div>',
      id: 'plugin_fanfields3_ops_dialog',
      title: 'Fan Fields 3 - Manage Ops',
      width: width,
      closeOnEscape: true
    });

    thisplugin.wireManageOpsHandlers();

    // Focus the new-op name field right away, so typing a name doesn't need a click first.
    $('#plugin_fanfields3_ops_newname').trigger('focus');
  };


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

  thisplugin.indicateLinkDirection = true;

  // Grey out / strike through links (and, once all of a portal's links exist, the portal
  // name too) that already exist in-game for the player's own faction — in the Task List,
  // and as a faded brownish-red on the map itself (thisplugin.updateLayer()'s own drawing
  // loop) instead of bright red.
  thisplugin.greyOutExistingLinks = true;

  // Blockers: a link, from a faction that Respect Intel does not avoid, crossing a link of the
  // plan that is still to be thrown. The plan itself is left alone; the Task List instead gets
  // extra "Destroy"/"Capture" rows, placed where they cost the least walking, that free those
  // links in time.
  thisplugin.manageBlockers = true;

  // Longest extra walk (meters) one Destroy stop may add to the route; 0 = no limit.
  thisplugin.BLOCKER_DETOUR_LIMITS_M = [100, 200, 500, 1000, 0];
  thisplugin.blockerMaxDetourM = 500;
  thisplugin.getBlockerDetourLabel = function (limit) {
    if (!limit) return 'No limit';
    return (limit >= 1000) ? (limit / 1000) + 'km' : limit + 'm';
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
  // Returns { blockers, stops, doneStops, onRoute, unresolved, extraDistance }:
  //  - blockers: every blocking link { a, b, team, guidA, guidB, deadline, blocked }
  //  - stops: extra Destroy rows in walk order { guid, point, slot, detour,
  //    blockers } — slot = index of the walk portal it goes right before
  //  - doneStops: Destroy stops of an earlier run whose portal has no blocker left to free at
  //    all any more (see thisplugin.doneBlockerStopGuids) — { guid, point, slot }
  //  - onRoute: plan portal guid -> blockers freed by the capture the plan already does there
  //  - unresolved: blockers no stop could free within the maximum detour
  //
  // A Destroy stop's own portal and the blocker(s) it frees are both recomputed from scratch
  // every call, straight from the current intel links — nothing about a stop is remembered
  // from one call to the next, which is what lets a blocker that just got destroyed in-game
  // (most often: a stop's own portal was destroyed, destroying its links with it) drop out of
  // `blockers`/`stops` right away. See thisplugin.doneBlockerStopGuids for how `doneStops`
  // keeps such a resolved stop showing in the Task List (as finished, not gone) regardless.
  thisplugin.doneBlockerStopGuids = {}; // guid -> { point, slot } of a Destroy stop fully resolved
  thisplugin.blockerCandidateGuids = {}; // guid -> { point, slot } of the latest run where it was an active stop
  thisplugin.blockerTrackingPlanKey = null;

  thisplugin.syncBlockerTracking = function () {
    var key = thisplugin.getPlanShapeKey();
    if (key !== thisplugin.blockerTrackingPlanKey) {
      thisplugin.doneBlockerStopGuids = {};
      thisplugin.blockerCandidateGuids = {};
      thisplugin.blockerTrackingPlanKey = key;
    }
  };

  thisplugin.computeBlockerPlan = function () {
    var plan = { blockers: [], stops: [], doneStops: [], onRoute: {}, unresolved: [], extraDistance: 0 };
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
    // No early return when this is empty: the rest of this function already degrades
    // correctly with zero blockers (every loop below simply does nothing), and falling
    // through is what lets the "done stops" tracking further down see that NO candidate is
    // outstanding any more, rather than skipping that bookkeeping entirely.

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

    // "Done" Destroy stops: a stop's portal that no longer appears among `cands` at all has no
    // blocker left to free by it, typically because destroying it in-game also destroyed the
    // blocking link(s) it stood for — remember it as resolved (thisplugin.doneBlockerStopGuids)
    // so the Task List keeps showing it, pale yellow and struck through like any other finished
    // portal, instead of it just vanishing the instant that happens. A guid still present among
    // `cands` still has SOME blocker to free — it just wasn't picked this round (made redundant
    // by a cheaper stop, or by a plan capture) — so it's left alone instead: never truly
    // resolved, nothing shown for it, exactly as before this tracking existed.
    thisplugin.syncBlockerTracking();
    var candGuids = {};
    for (var candKey in cands) {
      if (cands[candKey].guid) candGuids[cands[candKey].guid] = true;
    }
    var activeStopGuids = {};
    plan.stops.forEach(function (stop) {
      if (!stop.guid) return;
      activeStopGuids[stop.guid] = true;
      thisplugin.blockerCandidateGuids[stop.guid] = { point: stop.point, slot: stop.slot };
      delete thisplugin.doneBlockerStopGuids[stop.guid]; // active again: no longer "done"
    });
    for (var knownGuid in thisplugin.blockerCandidateGuids) {
      if (activeStopGuids[knownGuid]) continue;
      if (candGuids[knownGuid]) {
        delete thisplugin.doneBlockerStopGuids[knownGuid]; // a new blocker needs it again, after all
        continue;
      }
      if (!thisplugin.doneBlockerStopGuids[knownGuid]) {
        thisplugin.doneBlockerStopGuids[knownGuid] = thisplugin.blockerCandidateGuids[knownGuid];
      }
    }
    plan.doneStops = Object.keys(thisplugin.doneBlockerStopGuids).map(function (guid) {
      var info = thisplugin.doneBlockerStopGuids[guid];
      return { guid: guid, point: info.point, slot: info.slot };
    });

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

  // Whether IITC is still loading portals and links for the map (between its mapDataRefreshStart
  // and mapDataRefreshEnd hooks). True until its first load is over.
  thisplugin._mapDataLoading = true;

  // Locks the plan once a new plan is complete: IITC done loading the map data, drawn from that
  // data with no recalculation still waiting, link order optimized, and the automatic
  // anchor/direction search either done or not going to happen (a search still scheduled,
  // running, or waiting to retry while links load in means the plan may still change). When IITC
  // finishes loading, the mapDataRefreshEnd hook recalculates the plan, which checks again.
  thisplugin.lockIfPlanComplete = function () {
    if (!thisplugin._lockWhenPlanComplete) return;
    if (thisplugin._mapDataLoading || thisplugin.timer !== undefined) return;
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
    thisplugin.delayedUpdateLayer(0.2, true);
  };


  thisplugin.is_clockwise = true;

  thisplugin.toggleclockwise = function () {
    thisplugin.cancelOrientationSearch();
    thisplugin.is_clockwise = !thisplugin.is_clockwise;

    // Reset the order and link flips – new geometry, new base ordering (ghi#23)
    thisplugin.manualOrderGuids = null;
    thisplugin.manualLinkFlips = {};
    thisplugin.reconciledFanLinkKeys = {};
    thisplugin.relocatedForLessWalkingGuids = {};
    thisplugin.displayOrderGuids = null;
    thisplugin.requestLinkOrderRecompute();

    thisplugin.delayedUpdateLayer(0.2, true);
  };

  thisplugin.starDirENUM = {
    CENTRALIZING: -1,
    RADIATING: 1
  };
  thisplugin.stardirection = thisplugin.starDirENUM.CENTRALIZING;

  thisplugin.toggleStarDirection = function () {
    thisplugin.stardirection *= -1;
    thisplugin.ensureOutboundPositionTracking(); // stops GPS polling right away when leaving RADIATING
    thisplugin.delayedUpdateLayer(0.2, true);
  };



  thisplugin.increaseSBUL = function () {
    if (thisplugin.availableSBUL < 4) {
      thisplugin.availableSBUL++;
      $('#plugin_fanfields3_availablesbul_count')
        .html('' + (thisplugin.availableSBUL) + '');
      thisplugin.delayedUpdateLayer(0.2, true);
      thisplugin.saveOptionsDefault();
    }
  }
  thisplugin.decreaseSBUL = function () {
    if (thisplugin.availableSBUL > 0) {
      thisplugin.availableSBUL--;
      $('#plugin_fanfields3_availablesbul_count')
        .html('' + (thisplugin.availableSBUL) + '');
      thisplugin.delayedUpdateLayer(0.2, true);
      thisplugin.saveOptionsDefault();
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
        '.plugin_fanfields3_sidebar {\n' +
        '  display: flex;\n' +
        '  flex-direction: row;\n' +
        '  flex-wrap: wrap;\n' +
        '  padding: 5px;' +
        '}\n'
      );

    } else {

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
        '.plugin_fanfields3_sidebar {\n' +
        '  display: flex;\n' +
        '  flex-direction: row;\n' +
        '  flex-wrap: wrap;\n' +
        '  padding: 5px;' +
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

    // Popup menu opened from the map's hamburger icon.
    addCSS('\n' +
      '.plugin_fanfields3_mainmenu {\n' +
      '  z-index: 10000;\n' +
      '  min-width: 160px;\n' +
      '  background-color: rgba(8, 60, 78, 0.95);\n' +
      '  border: 1px solid #20A8B1;\n' +
      '  box-shadow: 3px 3px 5px black;\n' +
      '  padding: 4px 0;\n' +
      '  display: flex;\n' +
      '  flex-direction: column;\n' +
      '}\n' +
      '.plugin_fanfields3_mainmenu_item {\n' +
      '  display: block;\n' +
      '  padding: 6px 14px;\n' +
      '  color: #ffce00;\n' +
      '  white-space: nowrap;\n' +
      '  cursor: pointer;\n' +
      '}\n' +
      '.plugin_fanfields3_mainmenu_item:hover {\n' +
      '  background-color: rgba(32, 168, 177, 0.3);\n' +
      '}\n');

    // Options dialog: label + control rows, action buttons bar.
    addCSS('\n' +
      '.plugin_fanfields3_options_row {\n' +
      '  display: flex;\n' +
      '  justify-content: space-between;\n' +
      '  align-items: center;\n' +
      '  margin: 6px 0;\n' +
      '}\n' +
      '.plugin_fanfields3_options_row label {\n' +
      '  margin-right: 10px;\n' +
      '}\n' +
      '.plugin_fanfields3_options_row select {\n' +
      '  flex: 0 0 auto;\n' +
      '}\n' +
      '.plugin_fanfields3_options_row .plugin_fanfields3_availablesbul_label {\n' +
      '  flex: 0 0 auto;\n' +
      '  display: block;\n' +
      '  margin-right: 10px;\n' +
      '}\n' +
      '.plugin_fanfields3_options_subrow {\n' +
      '  padding-left: 16px;\n' +
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

    // "Pick anchor" sidebar button (kept for anything that still toggles it directly): highlighted
    // while armed (next portal click sets the anchor), so it reads as a toggle rather than a
    // one-off action. The map's own "No entry" shortcut (portal exclusion picking) gets the same
    // highlight while armed.
    addCSS('\n' +
      '#plugin_fanfields3_pickanchor_btn.plugin_fanfields3_active,\n' +
      '#fanfieldExcludePortalButton.plugin_fanfields3_active {\n' +
      '  box-shadow: 0 0 0 2px #ffce00 inset;\n' +
      '  color: #ffce00;\n' +
      '}\n'
    );

    // Statistics dialog: the real-activity section (links/fields actually seen in Intel within
    // the player's own Comm activity, and its Refresh link.
    addCSS('\n' +
      '.plugin_fanfields3_activity_title {\n' +
      '  font-weight: bold;\n' +
      '  margin-bottom: 4px;\n' +
      '}\n' +
      '.plugin_fanfields3_activity_buttons {\n' +
      '  margin-top: 6px;\n' +
      '}\n'
    );

    // Marker for a portal manually excluded from the plan (the "No entry" shortcut).
    addCSS('\n' +
      '.plugin_fanfields3_excluded_marker {\n' +
      '  color: #FF4444;\n' +
      '  font-size: 20px;\n' +
      '  line-height: 22px;\n' +
      '  text-align: center;\n' +
      '  text-shadow: 1px 1px #000, 1px -1px #000, -1px 1px #000, -1px -1px #000;\n' +
      '  pointer-events: none;\n' +
      '}\n'
    );

    // Map topleft Keys video control: a key, with a camera partly over its lower right corner.
    addCSS('\n' +
      '.plugin_fanfields3_keysvideo_icon {\n' +
      '  position: relative;\n' +
      '  display: inline-block;\n' +
      '  line-height: 1;\n' +
      '}\n' +
      '.plugin_fanfields3_keysvideo_icon > span {\n' +
      '  position: absolute;\n' +
      '  right: -3px;\n' +
      '  bottom: -3px;\n' +
      '  font-size: 12px;\n' +
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
      // Red, even on a row whose own text is green (relocated) — except on a finished portal (below).
      '#plugin_fanfields3_exportText_inner tr td span.plugin_fanfields3_blocker_tag {\n' +
      '  color: #FF4444 !important;\n' +
      '  text-decoration: none !important;\n' +
      '}\n' +
      // A finished portal (Action "Nothing") always reads as done: pale yellow and struck
      // through, even when it's also relocated (green) or carries a blocker cross (red).
      '#plugin_fanfields3_exportText_inner tr.plugin_fanfields3_portal_done,\n' +
      '#plugin_fanfields3_exportText_inner tr.plugin_fanfields3_portal_done td,\n' +
      '#plugin_fanfields3_exportText_inner tr.plugin_fanfields3_portal_done td a,\n' +
      '#plugin_fanfields3_exportText_inner tr.plugin_fanfields3_portal_done td span {\n' +
      '  color: rgba(255, 206, 0, 0.35) !important;\n' +
      '  text-decoration: line-through !important;\n' +
      '}\n' +
      '.plugin_fanfields3_blocker_summary,\n' +
      '.plugin_fanfields3_route_summary {\n' +
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
            text-align: center;
        }
        /* Fewer keys held than the plan needs: red, even on a green (relocated) row. */
        #plugin_fanfields3_exportText_inner tr td[plugin_fanfields3_notEnoughKeys] {
            color: #FF4444 !important;
            font-weight: bold;
        }

      `);
    };

    // Walk sim: small floating counter of links/fields seen so far while the sim runs.
    addCSS('\n' +
      '.plugin_fanfields3_walksim_counter {\n' +
      '  position: fixed;\n' +
      '  top: 10px;\n' +
      '  right: 10px;\n' +
      '  z-index: 10000;\n' +
      '  background-color: rgba(8, 60, 78, 0.9);\n' +
      '  color: #00e5ff;\n' +
      '  border: 1px solid #00e5ff;\n' +
      '  border-radius: 4px;\n' +
      '  padding: 6px 12px;\n' +
      '  font-size: 13px;\n' +
      '  font-weight: bold;\n' +
      '  pointer-events: none;\n' +
      '}\n'
    );

    // Keys video review table: every cell, checkbox and count field on the same line, numbers
    // centered under their headers.
    addCSS('\n' +
      '.plugin_fanfields3_keysvideo_table {\n' +
      '  border-collapse: collapse;\n' +
      '  width: 100%;\n' +
      '}\n' +
      '.plugin_fanfields3_keysvideo_table th,\n' +
      '.plugin_fanfields3_keysvideo_table td {\n' +
      '  vertical-align: middle;\n' +
      '  padding: 2px 4px;\n' +
      '  line-height: 20px;\n' +
      '  text-align: center !important;\n' +
      '}\n' +
      '.plugin_fanfields3_keysvideo_table th:nth-child(2),\n' +
      '.plugin_fanfields3_keysvideo_table td:nth-child(2) {\n' +
      '  text-align: left !important;\n' +
      '}\n' +
      '.plugin_fanfields3_keysvideo_table input {\n' +
      '  margin: 0;\n' +
      '  vertical-align: middle;\n' +
      '}\n' +
      '.plugin_fanfields3_keysvideo_count {\n' +
      '  box-sizing: border-box;\n' +
      '  width: 4em;\n' +
      '  height: 20px;\n' +
      '  padding: 0 2px;\n' +
      '  line-height: 18px;\n' +
      '  text-align: center;\n' +
      '  border: 1px solid #555;\n' +
      '}\n'
    );

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

    // Manage-Ops-Dialog
    addCSS('\n' +
      '.plugin_fanfields3_ops_save_row {\n' +
      '  display: flex;\n' +
      '  gap: 6px;\n' +
      '}\n' +
      '.plugin_fanfields3_ops_save_row input[type="text"] {\n' +
      '  flex: 1 1 auto;\n' +
      '  min-width: 0;\n' +
      '}\n' +
      '#plugin_fanfields3_ops_save_error {\n' +
      '  min-height: 14px;\n' +
      '  font-size: 11px;\n' +
      '}\n' +
      '.plugin_fanfields3_ops_count {\n' +
      '  margin: 4px 0 8px 0;\n' +
      '  font-size: 11px;\n' +
      '  color: #ccc;\n' +
      '}\n' +
      '.plugin_fanfields3_ops_table th,\n' +
      '.plugin_fanfields3_ops_table td {\n' +
      '  text-align: center;\n' +
      '}\n' +
      '.plugin_fanfields3_ops_name_cell {\n' +
      '  text-align: left !important;\n' +
      '}\n' +
      '.plugin_fanfields3_ops_load_link {\n' +
      '  cursor: pointer;\n' +
      '}\n' +
      '.plugin_fanfields3_ops_btn {\n' +
      '  box-sizing: border-box;\n' +
      '  padding: 0 4px;\n' +
      '  border-width: 1px;\n' +
      '  font-size: 11px;\n' +
      '  line-height: 1.6;\n' +
      '  cursor: pointer;\n' +
      '}\n' +
      '.plugin_fanfields3_ops_rename_input {\n' +
      '  width: 110px;\n' +
      '  margin-right: 2px;\n' +
      '}\n' +
      '#plugin_fanfields3_ops_save_btn[disabled],\n' +
      '#plugin_fanfields3_ops_newname[disabled] {\n' +
      '  opacity: 0.4;\n' +
      '  cursor: default;\n' +
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
                max-width: 40px !important;
                white-space: normal !important;
                word-break: break-all !important;
                overflow-wrap: break-word !important;
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

  // Throwing a link spends a key to its destination portal. A link's own Ingress GUID (the key
  // IITC itself uses in window.links/thisplugin.intelLinks) uniquely and permanently identifies
  // that one throw — destroying and re-throwing between the same two portals later gets a brand
  // new GUID — so the charged-link set below (persisted to localStorage under a "plugin-fanfields3-"
  // key) remembers every own-faction link GUID already charged a key for, across reloads AND
  // across IITC being closed entirely: a link thrown while IITC wasn't even running still gets
  // its key deducted as soon as it's next seen, since its GUID isn't in that persisted set yet.
  // A GUID already in the set is never charged again.
  //
  // Cross-device: this plugin does no syncing of its own — any "plugin-*" localStorage key is
  // exactly what the separate Simple Cloud Sync plugin (window.plugin.simpleCloudSync, see
  // https://github.com/Avataar120/IITC-Synchro) already syncs end-to-end encrypted across an
  // agent's devices, merging per key by most-recent-write. For that merge to actually end up
  // with the union of both devices' charges rather than one overwriting the other, every read
  // and write here goes straight to localStorage — never a value cached in memory across calls
  // — so a set just pulled down from another device is always the starting point for the next
  // write, not something a stale in-memory copy could clobber. See
  // thisplugin.isCrossDeviceSyncPending for the one place this still isn't enough on its own
  // (a brand new device's very first run).
  //
  // Evaluated only once IITC has fully finished loading the map (thisplugin._mapDataLoading):
  // while it's still streaming in link data tile by tile, an own link simply hasn't appeared
  // yet rather than not existing, so waiting avoids treating an incomplete view as if every link
  // not yet loaded in had just been thrown. The very first time this ever runs for this browser
  // (thisplugin.CHARGING_INITIALIZED_KEY not yet set), every own link already in-game is seeded
  // into the charged set without spending anything — only links thrown from that point onward are
  // charged. Only window.plugin.keys is touched — LiveInventory is a read-only reflection of the
  // real inventory and has no such API (same restriction as thisplugin.toggleKeysPluginCount).
  // Options dialog toggle ("Spend keys on throw"): on by default.
  thisplugin.consumeKeysOnLinkThrown = true;

  thisplugin.CHARGED_LINKS_STORAGE_KEY = 'plugin-fanfields3-charged-link-guids';
  thisplugin.CHARGING_INITIALIZED_KEY = 'plugin-fanfields3-charging-initialized';
  // Safety cap so a very long-lived install never grows this localStorage entry without bound;
  // oldest entries are dropped first once exceeded. A dropped entry could in theory be charged
  // again if its link were ever destroyed and re-thrown decades later between the same two
  // portals — an acceptable trade-off against unbounded storage growth.
  thisplugin.CHARGED_LINKS_MAX = 20000;

  // The charged-link set exactly as currently stored, fetched fresh every time (see the
  // cross-device note above) — never memoized, so a value Simple Cloud Sync just wrote into
  // localStorage from another device is always picked up on the very next check.
  thisplugin.getChargedLinkGuids = function () {
    try {
      var raw = localStorage.getItem(thisplugin.CHARGED_LINKS_STORAGE_KEY);
      var stored = raw ? JSON.parse(raw) : [];
      return Array.isArray(stored) ? stored : [];
    } catch (e) {
      return [];
    }
  };

  // Adds guids to the charged-link set, merging into whatever is CURRENTLY in localStorage
  // (read fresh, not a cached copy) rather than overwriting it with an older in-memory version —
  // the only thing that keeps this safe to write from a device that hasn't just pulled in
  // another device's own additions via Simple Cloud Sync.
  thisplugin.markLinkGuidsCharged = function (guids) {
    if (!guids.length) return;
    var current = thisplugin.getChargedLinkGuids();
    var set = new Set(current);
    var added = false;
    guids.forEach(function (guid) {
      if (set.has(guid)) return;
      set.add(guid);
      current.push(guid);
      added = true;
    });
    if (!added) return;
    if (current.length > thisplugin.CHARGED_LINKS_MAX) {
      current.splice(0, current.length - thisplugin.CHARGED_LINKS_MAX);
    }
    try {
      localStorage.setItem(thisplugin.CHARGED_LINKS_STORAGE_KEY, JSON.stringify(current));
    } catch (e) { /* storage full or unavailable: charging still works for this session */ }
  };

  // How long after this plugin loads to still treat Simple Cloud Sync's own first pull as
  // possibly still in flight — see isCrossDeviceSyncPending. Bounded so a Simple Cloud Sync
  // install that's present but never configured (no password entered yet) doesn't block the
  // very first seeding below forever.
  thisplugin.CROSS_DEVICE_SYNC_GRACE_MS = 15000;
  thisplugin._loadedAt = Date.now();

  // Whether the one-time "seed the charged-link set" decision below should still wait: Simple
  // Cloud Sync (window.plugin.simpleCloudSync, a separate plugin — see the note above) may
  // still be pulling down an already-charged set from this same agent's other devices, and
  // seeding from an empty/incomplete local set here would both miss those already-charged
  // links and, once Simple Cloud Sync's own pull lands, look like a local edit that needs
  // pushing — overwriting the real synced data with this device's wrong, premature guess.
  // simpleCloudSync.initialSyncPending is a plain property on its own plugin namespace (same
  // way this file already reads window.plugin.keys.keys directly), cleared for good the moment
  // its first sync of this page load completes.
  thisplugin.isCrossDeviceSyncPending = function () {
    var scs = window.plugin.simpleCloudSync;
    if (!scs || !scs.initialSyncPending) return false;
    return (Date.now() - thisplugin._loadedAt) < thisplugin.CROSS_DEVICE_SYNC_GRACE_MS;
  };

  thisplugin.chargeNewlyThrownLinks = function (ownLinks) {
    if (thisplugin._mapDataLoading) return;

    if (localStorage.getItem(thisplugin.CHARGING_INITIALIZED_KEY) !== '1') {
      if (thisplugin.isCrossDeviceSyncPending()) return; // retried on the next indexOwnLinks() call
      // First time ever on this browser: everything already in-game was thrown before this
      // feature started tracking it, so it's seeded as already-charged rather than charged now.
      thisplugin.markLinkGuidsCharged(ownLinks.map(function (o) { return o.linkGuid; }));
      try {
        localStorage.setItem(thisplugin.CHARGING_INITIALIZED_KEY, '1');
      } catch (e) { /* ignore */ }
      return;
    }

    if (!thisplugin.consumeKeysOnLinkThrown) return;
    if (!window.plugin.keys || typeof window.plugin.keys.addKey !== 'function') return;

    var charged = new Set(thisplugin.getChargedLinkGuids());
    var newlyCharged = [];
    ownLinks.forEach(function (o) {
      if (charged.has(o.linkGuid)) return;
      var current = window.plugin.keys.keys[o.destGuid] || 0;
      if (current > 0) window.plugin.keys.addKey(-1, o.destGuid);
      newlyCharged.push(o.linkGuid);
    });
    thisplugin.markLinkGuidsCharged(newlyCharged);
  };

  thisplugin.indexOwnLinks = function () {
    var keys = {};
    var ownLinks = [];
    var ownTeam = thisplugin.getOwnFactionTeam();
    if (ownTeam !== undefined) {
      for (var linkGuid in thisplugin.intelLinks) {
        var link = thisplugin.intelLinks[linkGuid];
        if (link.team === ownTeam) {
          keys[thisplugin.pointPairKey(link.a, link.b)] = true;
          if (link.guidB) ownLinks.push({ linkGuid: linkGuid, destGuid: link.guidB });
        }
      }
    }
    thisplugin.chargeNewlyThrownLinks(ownLinks);
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

  // Which way a real in-game link between these two guids was actually thrown (own faction
  // only), as { oGuid, dGuid } — or null if there is no such link. Unlike isLinkInGame, which is
  // direction-agnostic, this is what thisplugin.reconcileAnchorFanLinkDirections needs to tell a
  // link thrown as planned from one thrown the other way round.
  thisplugin.getRealLinkDirection = function (guidA, guidB) {
    var ownTeam = thisplugin.getOwnFactionTeam();
    if (ownTeam === undefined) return null;

    for (var guid in thisplugin.intelLinks) {
      var link = thisplugin.intelLinks[guid];
      if (link.team !== ownTeam || !link.guidA || !link.guidB) continue;
      if ((link.guidA === guidA && link.guidB === guidB) || (link.guidA === guidB && link.guidB === guidA)) {
        return { oGuid: link.guidA, dGuid: link.guidB };
      }
    }
    return null;
  };

  // Outbound (RADIATING) mode only: standing at the anchor, you can only throw links FROM it, so
  // a fan link the plan expects INBOUND (still to be thrown at the anchor) that's already live
  // in-game can only have been thrown the other way round — an extra outbound use the SBUL-
  // derived capacity (8 + 8*availableSBUL) didn't budget for. To keep the real + still-planned
  // outbound count at that maximum rather than overshoot it, this flips one not-yet-thrown
  // planned-outbound fan link to inbound instead, exactly once per reversed link (tracked via
  // thisplugin.reconciledFanLinkKeys so later refreshes don't keep picking a new victim for the
  // same already-compensated reversal). Returns true when it changed manualLinkFlips, so the
  // caller knows to rebuild the plan once more before displaying it.
  thisplugin.reconciledFanLinkKeys = thisplugin.reconciledFanLinkKeys || {};
  thisplugin.reconcileAnchorFanLinkDirections = function (sortedFanpoints) {
    if (thisplugin.stardirection !== thisplugin.starDirENUM.RADIATING) return false;
    if (!sortedFanpoints || sortedFanpoints.length < 2) return false;

    var anchor = sortedFanpoints[0];
    if (!anchor || anchor.guid !== thisplugin.startingpointGUID) return false;

    var changed = false;
    (anchor.incoming || []).forEach(function (partner) {
      var key = thisplugin.getUndirectedLinkKey(anchor.guid, partner.guid);
      if (thisplugin.reconciledFanLinkKeys[key]) return;

      var real = thisplugin.getRealLinkDirection(anchor.guid, partner.guid);
      if (!real || real.oGuid !== anchor.guid) return; // not thrown yet, or thrown the planned way

      var victim = (anchor.outgoing || []).filter(function (target) {
        return !thisplugin.isLinkFlipped(anchor.guid, target.guid) &&
          !thisplugin.getRealLinkDirection(anchor.guid, target.guid);
      })[0];
      if (!victim) return; // nothing left to compensate with this cycle

      thisplugin.manualLinkFlips[thisplugin.getUndirectedLinkKey(anchor.guid, victim.guid)] = true;
      thisplugin.reconciledFanLinkKeys[key] = true;
      changed = true;
    });

    return changed;
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
      // Nothing to reuse right now: give up on this attempt and let the plan lock if nothing else
      // is holding it back, rather than waiting on an arbitrary timer. If the map reloads again
      // before the plan actually locks, the mapDataRefreshStart hook in setup() re-arms
      // _orientationSearchPending, so a fresh attempt runs once that reload completes, using
      // whatever new links came in — see the pending check in updateLayer().
      thisplugin._orientationSearchPending = false;
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

      // Pin the pick (auto, not manual) so it sticks across recalculations even when it isn't a
      // hull vertex — see forcedAnchorGUID in updateLayer().
      thisplugin.forcedAnchorGUID = bestGuid;
      thisplugin.forcedAnchorIsManual = false;

      // The anchor changed, so flips and relocations made for the previous one no longer apply.
      thisplugin.manualLinkFlips = {};
      thisplugin.reconciledFanLinkKeys = {};
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

  // Drop all manual link-direction overrides at once (Task List "Reset link orders" button),
  // reverts any portal relocated by the walking optimization back to its natural spot in the
  // walk, drops any "Reroute" order, and restarts the walking optimization cleanly from the
  // base algorithm.
  thisplugin.resetLinkFlips = function () {
    thisplugin.manualLinkFlips = {};
    thisplugin.reconciledFanLinkKeys = {};
    thisplugin.clearRouteOrder();
    thisplugin.relocatedForLessWalkingGuids = {};
    thisplugin.displayOrderGuids = null; // never the user's own Manage Portal Order (manualOrderGuids)
    thisplugin._linkOrderRecomputePending = true;
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

  // ---------------------------------------------------------------------
  // Task List "Keys video" button: reads the player's key counts from a phone screen recording
  // (or screenshots) of Ingress's key inventory list, where each row shows a portal name and its
  // key count, and writes them into the keys plugin. Every frame is OCR'd in the browser by
  // Tesseract.js (loaded from a CDN on first use); only the plan's own portals are looked for,
  // which keeps name matching reliable. Nothing is written before the player checks the result.

  thisplugin.TESSERACT_URL = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
  thisplugin.KEYS_VIDEO_FRAME_STEP = 0.4;   // seconds between two sampled video frames
  thisplugin.KEYS_VIDEO_WIDTH = 1080;       // frames are scaled to this width before OCR
  thisplugin.KEYS_VIDEO_WHITE_MIN = 180;    // a pixel is text when its R, G and B are all above this
  thisplugin.KEYS_VIDEO_MATCH_MIN = 0.78;   // minimum name similarity (0..1) to accept a match
  thisplugin.KEYS_VIDEO_DIFF_GRID = [16, 64]; // [cols, rows] of the frame-change check
  thisplugin.KEYS_VIDEO_DIFF_MIN = 0.05;    // relative change in that grid for a new frame
  // OCR is the slow part (not reading the video itself), and each Tesseract worker is its own
  // thread, so running several in parallel is close to a free speedup on a multi-core device. One
  // core is left for the main thread (video seeking, canvas prep, UI).
  thisplugin.KEYS_VIDEO_WORKERS = Math.max(1, Math.min(4, (navigator.hardwareConcurrency || 2) - 1));

  thisplugin.loadTesseract = function () {
    if (window.Tesseract) return Promise.resolve(window.Tesseract);
    if (!thisplugin._tesseractPromise) {
      thisplugin._tesseractPromise = new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.src = thisplugin.TESSERACT_URL;
        script.onload = function () { resolve(window.Tesseract); };
        script.onerror = function () {
          thisplugin._tesseractPromise = null;
          reject(new Error('Could not load the text recognition library (no network?)'));
        };
        document.head.appendChild(script);
      });
    }
    return thisplugin._tesseractPromise;
  };

  // Lowercase, no accents, only letters/digits separated by single spaces.
  thisplugin.normalizeKeyName = function (s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ').trim();
  };

  thisplugin.levenshtein = function (a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    var prev = new Array(b.length + 1), cur = new Array(b.length + 1);
    for (var j = 0; j <= b.length; j++) prev[j] = j;
    for (var i = 1; i <= a.length; i++) {
      cur[0] = i;
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      var tmp = prev; prev = cur; cur = tmp;
    }
    return prev[b.length];
  };

  // Similarity (0..1) between an OCR'd name and a portal name, both normalized. Ingress cuts long
  // names with an ellipsis, so a truncated OCR name is compared to the same-length start of the name.
  thisplugin.keyNameSimilarity = function (ocrName, portalName, truncated) {
    if (!ocrName || !portalName) return 0;
    var target = portalName;
    if (truncated && ocrName.length >= 6 && ocrName.length < portalName.length) {
      target = portalName.slice(0, ocrName.length);
    }
    return 1 - thisplugin.levenshtein(ocrName, target) / Math.max(ocrName.length, target.length);
  };

  // Ingress Prime's key list: one card per portal, its name on the first line (after the portal
  // level, a red digit), then its address, then "<distance>  <key icon>  x<count>". Long names and
  // addresses are cut with "..". A count glued to the name ("Name x3") is read as well.

  // Key count in one OCR'd line: the last "x<count>" in it, or the whole line when it is only a
  // number. A "1" is often read as l, I, | or ].
  thisplugin.readKeyCount = function (line) {
    var toNumber = function (s) { return parseInt(s.replace(/[lI|\]!]/g, '1'), 10); };
    var re = /(?:^|\s)[x×X]\s?([0-9lI|\]!]{1,3})(?=\s|$)/g, m, last = null;
    while ((m = re.exec(line))) last = m;
    if (last) return { count: toNumber(last[1]), index: last.index };
    m = String(line).trim().match(/^([0-9]{1,3})$/);
    return m ? { count: toNumber(m[1]), index: 0 } : null;
  };

  // Name variants to try for one OCR'd line: the line without any "x<count>" at its end, and the
  // same without a leading portal level digit (1–8), when OCR picked it up.
  thisplugin.parseKeyLine = function (line) {
    var raw = String(line || '').trim();
    var count = thisplugin.readKeyCount(raw);
    if (count && count.index > 0) raw = raw.slice(0, count.index).trim();
    else count = null;
    var truncated = /(\.\.+|…)\s*$/.test(raw);
    var names = [thisplugin.normalizeKeyName(raw)];
    var noLevel = raw.replace(/^[1-8](?=\s|[A-Za-zÀ-ÿ])\s*/, '');
    if (noLevel !== raw) names.push(thisplugin.normalizeKeyName(noLevel));
    return { names: names, count: count ? count.count : null, truncated: truncated };
  };

  // Plan portals to look for: guid, title, normalized title, keys still needed there.
  thisplugin.getKeysVideoCandidates = function () {
    return thisplugin.getDisplayOrder().map(function (portal) {
      var title = thisplugin.getPortalTitleByGuid(portal.guid);
      return {
        guid: portal.guid,
        title: title,
        norm: thisplugin.normalizeKeyName(title),
        needed: thisplugin.getKeysStillNeeded(portal)
      };
    }).filter(function (c) { return c.norm && c.title !== 'unknown title'; });
  };

  // The plan portal an OCR'd line names, or null: close enough to one portal, and clearly closer
  // to it than to any other.
  thisplugin.matchKeyLine = function (parsed, candidates) {
    var best = null, bestScore = 0, second = 0;
    parsed.names.forEach(function (name) {
      if (name.length < 3) return;
      candidates.forEach(function (c) {
        var score = thisplugin.keyNameSimilarity(name, c.norm, parsed.truncated);
        if (c === best) bestScore = Math.max(bestScore, score);
        else if (score > bestScore) { second = bestScore; bestScore = score; best = c; }
        else if (score > second) second = score;
      });
    });
    if (!best || bestScore < thisplugin.KEYS_VIDEO_MATCH_MIN || bestScore - second < 0.05) return null;
    return best;
  };

  // Matches the OCR'd text of one frame against the plan portals. Returns guid -> count seen.
  // The count is taken from the name's own line, else from the next few lines up to the next
  // card's name. A card whose count isn't visible (cut off at the screen edge) gives nothing:
  // another frame of the recording will show it.
  thisplugin.matchKeysInText = function (text, candidates) {
    var lines = String(text || '').split(/\n+/).map(function (l) { return l.trim(); }).filter(Boolean);
    var parsed = lines.map(thisplugin.parseKeyLine);
    var matches = parsed.map(function (p) { return thisplugin.matchKeyLine(p, candidates); });
    var found = {};
    matches.forEach(function (portal, i) {
      if (!portal) return;
      var count = parsed[i].count;
      for (var j = i + 1; count === null && j < lines.length && j <= i + 3 && !matches[j]; j++) {
        var c = thisplugin.readKeyCount(lines[j]);
        if (c) count = c.count;
      }
      if (count === null || count < 1 || count > 999) return;
      found[portal.guid] = count;
    });
    return found;
  };

  // Draws one image/video frame into a canvas prepared for OCR, scaled to KEYS_VIDEO_WIDTH:
  // Ingress writes names and counts in white over darkened photos, so only near-white pixels are
  // kept, as black text on white. This also drops the red level digit, the blue resonator bars
  // and most of the photo. Returns null when the frame looks the same as the previous one read.
  //
  // The frame-change check below reads the already-thresholded full-resolution data (not a
  // cheap downscaled preview): a small blown-up grid loses exactly the kind of thin, short-lived
  // text strokes a fast scroll produces, which silently dropped real frames and tanked the OCR
  // match rate — worth the extra full-resolution pass per sampled frame to not risk that again.
  thisplugin.prepareKeysOcrFrame = function (source, width, height, state) {
    var scale = thisplugin.KEYS_VIDEO_WIDTH / width;
    var w = Math.max(1, Math.round(width * scale)), h = Math.max(1, Math.round(height * scale));
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(source, 0, 0, w, h);
    var img = ctx.getImageData(0, 0, w, h);
    var d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      d[i] = d[i + 1] = d[i + 2] = Math.min(d[i], d[i + 1], d[i + 2]) > thisplugin.KEYS_VIDEO_WHITE_MIN ? 0 : 255;
    }

    var sig = [], gx = thisplugin.KEYS_VIDEO_DIFF_GRID[0], gy = thisplugin.KEYS_VIDEO_DIFF_GRID[1];
    for (var sy = 0; sy < gy; sy++) {
      for (var sx = 0; sx < gx; sx++) {
        var x0 = Math.floor(sx * w / gx), y0 = Math.floor(sy * h / gy);
        var x1 = Math.floor((sx + 1) * w / gx), y1 = Math.floor((sy + 1) * h / gy), dark = 0;
        for (var y = y0; y < y1; y += 2) {
          for (var x = x0; x < x1; x += 2) if (!d[(y * w + x) * 4]) dark++;
        }
        sig.push(dark);
      }
    }
    if (state.lastSig) {
      var diff = 0, total = 1;
      for (var k = 0; k < sig.length; k++) { diff += Math.abs(sig[k] - state.lastSig[k]); total += sig[k]; }
      if (diff / total < thisplugin.KEYS_VIDEO_DIFF_MIN) return null;
    }
    state.lastSig = sig;

    ctx.putImageData(img, 0, 0);
    return canvas;
  };

  thisplugin.loadKeysVideo = function (file) {
    return new Promise(function (resolve, reject) {
      var video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.preload = 'auto';
      video.onloadeddata = function () {
        if (isFinite(video.duration)) { resolve(video); return; }
        // Some recordings (e.g. WebM) don't state their length: seeking far past the end makes
        // the browser work it out.
        video.ondurationchange = function () {
          if (!isFinite(video.duration)) return;
          video.ondurationchange = null;
          video.currentTime = 0;
          resolve(video);
        };
        video.currentTime = 1e101;
      };
      video.onerror = function () { reject(new Error('Could not read the video ' + file.name)); };
      video.src = URL.createObjectURL(file);
    });
  };

  thisplugin.seekKeysVideo = function (video, time) {
    return new Promise(function (resolve) {
      var settled = false;
      var done = function () {
        if (settled) return;
        settled = true;
        video.removeEventListener('seeked', done);
        document.removeEventListener('visibilitychange', onVisible);
        resolve();
      };
      // On mobile, locking the screen suspends the video decoder mid-seek, and the 'seeked'
      // event for that seek never comes — even once the screen is back on. Re-issuing the same
      // seek once the page is visible again gets the decoder going and still fires 'seeked'
      // normally, instead of leaving the read stuck forever.
      var onVisible = function () {
        if (!document.hidden && !settled) video.currentTime = time;
      };
      video.addEventListener('seeked', done);
      document.addEventListener('visibilitychange', onVisible);
      video.currentTime = time;
    });
  };

  thisplugin.loadKeysImage = function (file) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error('Could not read the image ' + file.name)); };
      img.src = URL.createObjectURL(file);
    });
  };

  // Runs OCR jobs with at most `limit` running at once (one Tesseract worker each). wait()
  // resolves once a slot is free, so a caller can throttle how fast it hands out work without
  // buffering unlimited frames ahead of what the pool can process; drain() waits for whatever is
  // still running. Never rejects itself even when a job does — callers catch their own job.
  thisplugin.makeKeysOcrPool = function (limit) {
    var active = new Set();
    var neverReject = function (p) { return p.then(function () {}, function () {}); };
    return {
      wait: async function () {
        while (active.size >= limit) await Promise.race(Array.from(active).map(neverReject));
      },
      run: function (job) {
        var p = job();
        active.add(p);
        var cleanup = function () { active.delete(p); };
        p.then(cleanup, cleanup);
        return p;
      },
      drain: function () { return Promise.allSettled(Array.from(active)); }
    };
  };

  // Tried tuning tessedit_pageseg_mode (SPARSE_TEXT) and switching off the English dictionary
  // here, to save a bit more OCR time on top of running several workers at once — reverted:
  // it badly hurt the match rate in practice (SPARSE_TEXT skips the page-layout analysis that
  // apparently matters for this card layout). Left as a plain, untuned worker, same as before
  // the workers were parallelized.
  thisplugin.createKeysOcrWorker = async function (Tesseract) {
    return Tesseract.createWorker('eng');
  };

  // OCRs every file (videos: one frame every KEYS_VIDEO_FRAME_STEP seconds) and returns
  // guid -> the count read most often for that portal (the highest one on a tie). Several
  // Tesseract workers run at once (KEYS_VIDEO_WORKERS): OCR, not reading the video, is the slow
  // part of this, and each worker is its own thread, so the next frame's seek and threshold keep
  // running on the main thread while earlier frames are still being recognized.
  thisplugin.readKeysFromFiles = async function (files, candidates, onProgress, isCancelled) {
    var Tesseract = await thisplugin.loadTesseract();
    onProgress('Loading text recognition…');
    var workers = await Promise.all(Array.from({ length: thisplugin.KEYS_VIDEO_WORKERS },
      function () { return thisplugin.createKeysOcrWorker(Tesseract); }));
    var pool = thisplugin.makeKeysOcrPool(workers.length);
    var nextWorker = 0;
    var votes = {};
    var framesRead = 0;

    var submit = async function (canvas) {
      await pool.wait();
      if (isCancelled()) return;
      var worker = workers[nextWorker];
      nextWorker = (nextWorker + 1) % workers.length;
      pool.run(async function () {
        var result = await worker.recognize(canvas);
        framesRead++;
        var found = thisplugin.matchKeysInText(result.data.text, candidates);
        Object.keys(found).forEach(function (guid) {
          votes[guid] = votes[guid] || {};
          votes[guid][found[guid]] = (votes[guid][found[guid]] || 0) + 1;
        });
      }).catch(function (e) { if (!isCancelled()) console.error('Fan Fields 3 - Keys video OCR', e); });
    };

    try {
      for (var f = 0; f < files.length && !isCancelled(); f++) {
        var file = files[f];
        var label = files.length > 1 ? ' (file ' + (f + 1) + '/' + files.length + ')' : '';
        var state = {};
        if (/^image\//.test(file.type)) {
          onProgress('Reading image' + label + '…');
          var img = await thisplugin.loadKeysImage(file);
          var icanvas = thisplugin.prepareKeysOcrFrame(img, img.naturalWidth, img.naturalHeight, state);
          if (icanvas) await submit(icanvas);
          URL.revokeObjectURL(img.src);
          continue;
        }
        var video = await thisplugin.loadKeysVideo(file);
        var duration = isFinite(video.duration) ? video.duration : 0;
        for (var t = 0; t <= duration && !isCancelled(); t += thisplugin.KEYS_VIDEO_FRAME_STEP) {
          await thisplugin.seekKeysVideo(video, Math.min(t, Math.max(0, duration - 0.05)));
          onProgress('Reading video' + label + ': ' + Math.min(100, Math.round(100 * t / (duration || 1))) +
            '% — ' + Object.keys(votes).length + '/' + candidates.length + ' plan portals found');
          var canvas = thisplugin.prepareKeysOcrFrame(video, video.videoWidth, video.videoHeight, state);
          if (canvas) await submit(canvas);
        }
        URL.revokeObjectURL(video.src);
      }
      await pool.drain();
    } finally {
      await Promise.all(workers.map(function (w) { return w.terminate(); }));
    }

    var counts = {};
    Object.keys(votes).forEach(function (guid) {
      var bestCount = 0, bestVotes = 0;
      Object.keys(votes[guid]).forEach(function (c) {
        var v = votes[guid][c], n = parseInt(c, 10);
        if (v > bestVotes || (v === bestVotes && n > bestCount)) { bestVotes = v; bestCount = n; }
      });
      counts[guid] = bestCount;
    });
    return { counts: counts, framesRead: framesRead };
  };

  // Dialog: pick the recording, read it, then review the counts before writing them.
  thisplugin.openKeysVideoDialog = function () {
    if (!window.plugin.keys || typeof window.plugin.keys.addKey !== 'function') {
      dialog({
        html: '<p>This needs the <i>Keys</i> plugin, whose counts it updates.</p>',
        id: 'plugin_fanfields3_keysvideo',
        title: 'Fan Fields 3 - Keys video'
      });
      return;
    }
    var candidates = thisplugin.getKeysVideoCandidates();
    if (!candidates.length) {
      dialog({
        html: '<p>No plan portal to look for yet: set up a fanfield first.</p>',
        id: 'plugin_fanfields3_keysvideo',
        title: 'Fan Fields 3 - Keys video'
      });
      return;
    }

    var cancelled = false;
    var html =
      '<p>In Ingress, open your inventory on <i>Portal Keys</i>, record your phone screen while slowly ' +
      'scrolling through the list, then pick the recording here. Screenshots work too.</p>' +
      '<p>Only the ' + candidates.length + ' portals of the current plan are looked for. ' +
      'Everything is read on this device; nothing is sent anywhere.</p>' +
      '<p><input type="file" id="plugin_fanfields3_keysvideo_file" accept="video/*,image/*" multiple></p>' +
      '<p id="plugin_fanfields3_keysvideo_status"></p>' +
      '<div id="plugin_fanfields3_keysvideo_result"></div>';

    dialog({
      html: html,
      id: 'plugin_fanfields3_keysvideo',
      title: 'Fan Fields 3 - Keys video',
      width: Math.min(560, thisplugin.getMaxDialogWidth()),
      closeCallback: function () { cancelled = true; }
    });
    thisplugin.pinKeysVideoDialogToTop();
    // Nothing to apply yet (no recording read) — just a way to close the dialog, same as the
    // default OK button would, but named for what it actually does here. showKeysVideoReview
    // adds the "Apply to Keys plugin" button next to this one once there's something to apply.
    $('#dialog-plugin_fanfields3_keysvideo').dialog('option', 'buttons', {
      Cancel: function () { $(this).dialog('close'); }
    });

    var $status = $('#plugin_fanfields3_keysvideo_status');
    $('#plugin_fanfields3_keysvideo_file').on('change', function () {
      var files = Array.prototype.slice.call(this.files || []);
      if (!files.length) return;
      var $input = $(this).prop('disabled', true);
      $('#plugin_fanfields3_keysvideo_result').empty();
      thisplugin.readKeysFromFiles(files, candidates, function (msg) { $status.text(msg); },
        function () { return cancelled; })
        .then(function (res) {
          if (cancelled) return;
          $status.text(res.framesRead + ' frame(s) read, ' + Object.keys(res.counts).length + '/' +
            candidates.length + ' plan portals found. Check the counts, then Apply.');
          thisplugin.showKeysVideoReview(candidates, res.counts);
        })
        .catch(function (err) {
          console.error('Fan Fields 3 - Keys video', err);
          $status.text('Error: ' + (err && err.message ? err.message : err));
        })
        .then(function () { $input.prop('disabled', false); });
    });
  };

  // Keeps the Keys video dialog at the top of the screen, fully opaque so the map doesn't show
  // through the counts, and capped to the screen height with its content scrolling, so the
  // review table that grows it never pushes it off the bottom. Same flex technique as
  // addTaskListShiftButtons: the cap has to be on the .ui-dialog itself (not just its content),
  // since jQuery UI resizes the content pane to fit its own height option and ignores a
  // max-height set there on its own.
  thisplugin.pinKeysVideoDialogToTop = function () {
    var $content = $('#dialog-plugin_fanfields3_keysvideo');
    if (!$content.length) return;
    var $ui = $content.closest('.ui-dialog');
    // A bit more generous than getMaxDialogHeight()'s own mobile clearance: this dialog's
    // bottom button row stays clear of the phone's nav bar with less margin than that shared
    // default assumes, so it can use more of the screen — kept local to this dialog rather
    // than lowering that margin for every other dialog too.
    var vh = (window.visualViewport && window.visualViewport.height) ? window.visualViewport.height : window.innerHeight;
    var bottomClearance = L.Browser.mobile ? 90 : 20;
    var maxDialogHeight = Math.max(200, Math.floor(vh) - bottomClearance);
    $ui.css({
      'background': 'rgb(8, 48, 78)',
      'opacity': 1,
      'max-height': maxDialogHeight + 'px',
      'display': 'flex',
      'flex-direction': 'column'
    });
    $content.css({
      'flex': '1 1 auto',
      'overflow-y': 'auto'
    });
    $ui.find('.ui-dialog-buttonpane').css('flex', '0 0 auto');
    $content.dialog('option', 'position', { my: 'top', at: 'top+10', of: window });
  };

  thisplugin.showKeysVideoReview = function (candidates, counts) {
    var esc = window.escapeHtmlSpecialChars;
    var rows = candidates.map(function (c) {
      var current = window.plugin.keys.keys[c.guid] || 0;
      var seen = Object.prototype.hasOwnProperty.call(counts, c.guid);
      var value = seen ? counts[c.guid] : current;
      return '<tr data-guid="' + c.guid + '"' + (seen ? '' : ' class="plugin_fanfields3_keysvideo_unseen"') + '>' +
        '<td><input type="checkbox" class="plugin_fanfields3_keysvideo_apply"' +
        (seen && value !== current ? ' checked' : '') + '></td>' +
        '<td>' + esc(c.title) + '</td>' +
        '<td>' + c.needed + '</td>' +
        '<td>' + current + '</td>' +
        '<td><input type="number" min="0" max="999" class="plugin_fanfields3_keysvideo_count" value="' + value + '"' +
        ' data-seen="' + (seen ? '1' : '0') + '"></td>' +
        '</tr>';
    }).join('');

    var html =
      '<table class="plugin_fanfields3_keysvideo_table"><thead><tr>' +
      '<th></th><th>Portal</th><th title="Keys still needed">Need</th>' +
      '<th title="Keys plugin count now">Now</th><th title="Count read in the recording">Read</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table>' +
      '<p><label><input type="checkbox" id="plugin_fanfields3_keysvideo_zero"> ' +
      'Set plan portals not found in the recording to 0 (only if you scrolled through all your keys)</label></p>' +
      (window.plugin.LiveInventory ? '<p><i>LiveInventory is installed: the Task List shows its counts first.</i></p>' : '');

    var $result = $('#plugin_fanfields3_keysvideo_result').html(html);

    // Editing a count ticks that row; the "not found → 0" option ticks/unticks the unseen rows.
    $result.on('input', '.plugin_fanfields3_keysvideo_count', function () {
      $(this).closest('tr').find('.plugin_fanfields3_keysvideo_apply').prop('checked', true);
    });
    $result.on('change', '#plugin_fanfields3_keysvideo_zero', function () {
      var on = $(this).prop('checked');
      $result.find('tr.plugin_fanfields3_keysvideo_unseen').each(function () {
        var guid = $(this).attr('data-guid');
        var current = window.plugin.keys.keys[guid] || 0;
        $(this).find('.plugin_fanfields3_keysvideo_count').val(on ? 0 : current);
        $(this).find('.plugin_fanfields3_keysvideo_apply').prop('checked', on && current !== 0);
      });
    });

    // "Apply to Keys plugin" lives in the dialog's own button pane, next to Cancel, instead of
    // in the scrolling content above — added here (not at dialog creation) since there's
    // nothing to apply before a recording has been read.
    $('#dialog-plugin_fanfields3_keysvideo').dialog('option', 'buttons', {
      Cancel: function () { $(this).dialog('close'); },
      'Apply to Keys plugin': function () {
        $result.find('tbody tr').each(function () {
          if (!$(this).find('.plugin_fanfields3_keysvideo_apply').prop('checked')) return;
          var guid = $(this).attr('data-guid');
          var target = Math.max(0, parseInt($(this).find('.plugin_fanfields3_keysvideo_count').val(), 10) || 0);
          var delta = target - (window.plugin.keys.keys[guid] || 0);
          if (delta !== 0) window.plugin.keys.addKey(delta, guid);
        });
        thisplugin.refreshTaskListIfOpen();
        $(this).dialog('close');
      }
    });
    // After the buttons above, not before: the button pane's height (now Cancel + Apply,
    // possibly wrapping to two lines on a narrow dialog) is what the content area's max-height
    // needs to leave room for.
    thisplugin.pinKeysVideoDialogToTop();
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

  // Walks the plan's portals in the given visit order, each throwing all its outgoing links on
  // arrival, and works out what really happens — without touching any plan state:
  //  - a portal that is under a field already formed when it's reached can't throw a link longer
  //    than maxLinkUnderFieldDistance (Issue #96): such links are invalid, never built;
  //  - each planned field (every triangle listed in the links' creatingFieldsWith) forms as soon
  //    as its third link is built, credited to that link — whichever of its three links it is.
  // Returns { invalid: directed link key -> { srcGuid, dstGuid, distance }, underAtVisit:
  // guid -> bool, triangles: formed fields { a, b, c }, fieldsByDirectedLink: directed link key
  // -> fields it forms }.
  thisplugin.simulateWalk = function (order) {
    var pointToGuid = {};
    order.forEach(function (fp) { pointToGuid[thisplugin.pointKey(fp.point)] = fp.guid; });

    // Planned fields, each listed under its three links (undirected keys).
    var fieldsByLink = {};
    var seenFields = {};
    order.forEach(function (fp) {
      (fp.outgoing || []).forEach(function (target) {
        var meta = fp.outgoingMeta ? fp.outgoingMeta[target.guid] : null;
        ((meta && meta.creatingFieldsWith) || []).forEach(function (thirdPoint) {
          var thirdGuid = pointToGuid[thisplugin.pointKey(thirdPoint)];
          if (!thirdGuid) return;
          var id = [fp.guid, target.guid, thirdGuid].sort().join('|');
          if (seenFields[id]) return;
          var field = seenFields[id] = {
            id: id,
            points: [thirdPoint, fp.point, target.point],
            links: [
              thisplugin.getUndirectedLinkKey(fp.guid, target.guid),
              thisplugin.getUndirectedLinkKey(fp.guid, thirdGuid),
              thisplugin.getUndirectedLinkKey(target.guid, thirdGuid)
            ]
          };
          field.links.forEach(function (linkKey) {
            (fieldsByLink[linkKey] = fieldsByLink[linkKey] || []).push(field);
          });
        });
      });
    });

    var result = { invalid: {}, underAtVisit: {}, triangles: [], fieldsByDirectedLink: {} };
    var builtLinks = {};
    var formedFields = {};

    order.forEach(function (srcFp, visitIndex) {
      var srcUnder = thisplugin.isPointUnderAnyTriangle(srcFp.point, result.triangles);
      result.underAtVisit[srcFp.guid] = srcUnder;

      (srcFp.outgoing || []).forEach(function (dstFp) {
        var dkey = thisplugin.getDirectedLinkKey(srcFp.guid, dstFp.guid);
        var distance = thisplugin.distanceTo(srcFp.point, dstFp.point);
        if (srcUnder && distance > thisplugin.maxLinkUnderFieldDistance) {
          result.invalid[dkey] = { srcGuid: srcFp.guid, dstGuid: dstFp.guid, distance: distance };
          return;
        }

        var linkKey = thisplugin.getUndirectedLinkKey(srcFp.guid, dstFp.guid);
        builtLinks[linkKey] = true;

        var formedHere = 0;
        (fieldsByLink[linkKey] || []).forEach(function (field) {
          if (formedFields[field.id]) return;
          if (!field.links.every(function (k) { return builtLinks[k]; })) return;
          formedFields[field.id] = true;
          // visitIndex: which step of `order` completes this field -- unused by
          // validateUnderFieldLinks (the other caller), only by exportPlanPdf's report.
          result.triangles.push({ a: field.points[0], b: field.points[1], c: field.points[2], visitIndex: visitIndex });
          formedHere++;
        });
        result.fieldsByDirectedLink[dkey] = formedHere;
      });
    });

    return result;
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

    var walk = thisplugin.simulateWalk(sorted);
    var portalUnderFieldAtVisit = walk.underAtVisit;

    thisplugin.invalidUnderFieldLinks = {};
    thisplugin.validTriangles = walk.triangles;
    thisplugin.validLinkCount = 0;
    thisplugin.validTriangleCount = 0;

    sorted.forEach(function (fp) {
      fp.incomingValidCount = 0;
      fp.outgoingValidCount = 0;
      fp.fieldsCreatedValidAtPortal = 0;
    });

    // First pass: record each link's outcome of the simulated walk on the plan's own portals.
    sorted.forEach(function (srcFp, vi) {
      var srcGuid = srcFp.guid;

      (srcFp.outgoing || []).forEach(function (dstFp) {
        var dstGuid = dstFp.guid;
        var dkey = thisplugin.getDirectedLinkKey(srcGuid, dstGuid);
        var meta = (srcFp.outgoingMeta && srcFp.outgoingMeta[dstGuid]) ? srcFp.outgoingMeta[dstGuid] : null;
        var invalid = walk.invalid[dkey];

        if (invalid) {
          // Whether flipping the link direction could avoid the under-field restriction in THIS
          // visit order (ignoring key logistics: thrown from the other end when it's visited).
          // Unknown (null) for now when the other end comes later in the walk — see second pass.
          var dstVisitedBefore = sorted.slice(0, vi).some(function (fp) { return fp.guid === dstGuid; });
          var flippedOk = dstVisitedBefore
            ? !(portalUnderFieldAtVisit[dstGuid] && invalid.distance > thisplugin.maxLinkUnderFieldDistance)
            : null;

          thisplugin.invalidUnderFieldLinks[dkey] = {
            srcGuid: srcGuid,
            dstGuid: dstGuid,
            distance: invalid.distance,
            flippedOk: flippedOk
          };
          if (meta) {
            meta.invalidUnderField = true;
            meta.canFlipUnderField = flippedOk;
            meta.fieldsCreatedValid = 0;
          }
          return;
        }

        thisplugin.validLinkCount++;
        srcFp.outgoingValidCount++;
        dstFp.incomingValidCount++;

        var fieldsCreatedByThisLink = walk.fieldsByDirectedLink[dkey] || 0;
        if (meta) {
          meta.invalidUnderField = false;
          meta.canFlipUnderField = undefined;
          meta.fieldsCreatedValid = fieldsCreatedByThisLink;
        }
        srcFp.fieldsCreatedValidAtPortal += fieldsCreatedByThisLink;
      });
    });

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

  // Whether `edges` (srcGuid throws to dstGuid, same shape buildLinkOrderEdges/
  // simulateDirectedPlan use) could ever be walked in a single pass at all: throwing a link
  // needs the target's key already in hand, so the target must be visited before the source —
  // if that requirement forms a cycle (A needs B's key, B needs C's, C needs A's), no walk order
  // can satisfy every one of them simultaneously, regardless of which order is tried. The base
  // plan the core algorithm builds never has this problem on its own (every mesh link points from
  // the later-built portal to an earlier one, and the anchor's own fan links are the only
  // exception, so a single consistent order always exists) — only an additional directed edge on
  // top of that, such as a candidate mesh-link flip, can introduce one. Used to veto exactly that
  // before it's accepted (see computeDistanceOrderFlips/computeKeysOrderFlips below).
  thisplugin.hasPrecedenceCycle = function (edges) {
    var dependents = {}; // guid -> guids that need ITS key before they can throw (visited after it)
    edges.forEach(function (e) {
      (dependents[e.dstGuid] = dependents[e.dstGuid] || []).push(e.srcGuid);
    });

    var state = {}; // 0/unset: unvisited, 1: on the current path, 2: fully resolved, no cycle through it
    var cycleFound = false;

    function visit(guid) {
      if (cycleFound || state[guid] === 2) return;
      if (state[guid] === 1) { cycleFound = true; return; }
      state[guid] = 1;
      (dependents[guid] || []).forEach(visit);
      if (!cycleFound) state[guid] = 2;
    }

    Object.keys(dependents).forEach(function (guid) {
      if (!cycleFound) visit(guid);
    });
    return cycleFound;
  };

  // "Less walking": a portal whose own OUTGOING count is exactly 2 (its anchor link plus one
  // mesh link) is a candidate. Its mesh link flips to point AT it (mesh partner -> portal)
  // when visiting it between its own walk neighbors (whichever portals come right before and
  // right after it in the walk) costs more than skipping straight from one to the other — i.e.
  // this portal wasn't really "on the way". A portal with outgoing count 1 (only its own anchor
  // link, no mesh link) gets the same "on the way" check further down, without any flip — there's
  // nothing to flip, only where it sits in the walk can change. A portal with outgoing count 3+
  // is left untouched either way: with several mesh links, moving it risks losing a field or
  // making another one of its own links infeasible, which this simple per-portal check can't
  // rule out. The mesh partner's own position plays no part in this test: whether it happens
  // to be the walk's previous stop, a later one, or nowhere nearby, "on the way" is decided
  // purely by the portal's own neighbors, via plain triangle inequality.
  //
  // Never onto a mesh partner that only has its own anchor link (outgoing count 1) AND is
  // genuinely closer to the anchor than to this portal's OTHER neighbor (nextFp): flipping
  // would make that partner depend on this portal being visited first, dragging it away from
  // wherever it actually belongs. A partner nearer the anchor belongs up front regardless, so
  // flipping onto it would only shove it out of the way of the very spot it wants; a partner
  // nearer nextFp's own neighborhood instead belongs there, so the flip is left to go through,
  // freeing it to be relocated near that neighborhood rather than forced up front by this link.
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
    // Candidates whose detour cost was a plain triangle-inequality number (every one except a
    // "last in the walk, nothing to route around" candidate, forced through unconditionally and
    // marked Infinity here so the verification pass below never second-guesses it) — see
    // isMoveWorthwhile for how this is used once the actual insertion point is known.
    var savingsByGuid = {};
    // Which edge (by key) a given guid's mesh link flip touched, so a candidate that turns out
    // not to pay off (see below) can have that flip undone, not just its walk position.
    var flippedEdgeKeyByGuid = {};

    // Mesh links: only the current thrower can qualify (its own 2 outgoing links are the fan
    // link plus exactly this one mesh link) — flip it to point at the thrower only if visiting
    // it between its own walk neighbors isn't worth it (see above).
    current.forEach(function (e) {
      if (e.isFanLink) return;
      if (outgoingCountByGuid[e.srcGuid] !== 2) return;

      // e.srcGuid is never the anchor (a link touching it is always isFanLink, filtered above),
      // so it's never the walk's very first portal and prevFp always exists; nextFp doesn't,
      // for whichever portal ends up last in the walk.
      var prevFp = sorted[indexByGuid[e.srcGuid] - 1];
      var nextFp = sorted[indexByGuid[e.srcGuid] + 1];

      var shouldFlip;
      var detourCost;
      if (nextFp) {
        // Triangle inequality on the portal's own neighbors: visiting it (prevFp -> src ->
        // nextFp) only "costs" something over skipping it (prevFp -> nextFp direct) when it's
        // really a detour. A margin avoids flipping over floating-point noise on three
        // near-collinear portals, where there's nothing to gain either way.
        var viaSrc = dist(prevFp.guid, e.srcGuid) + dist(e.srcGuid, nextFp.guid);
        var direct = dist(prevFp.guid, nextFp.guid);
        detourCost = viaSrc - direct;
        shouldFlip = detourCost > 1e-6;
      } else {
        // Last portal in the walk: there's no "next" to route around, so it's never really "on
        // the way" to anything — let it through to the feasibility check below, same as any
        // other candidate. Worst case, the reordering step's cheapest insertion puts it right
        // back at the end, same as leaving it unflipped would have.
        shouldFlip = true;
        detourCost = Infinity;
      }

      var partnerIsDegreeOne = outgoingCountByGuid[e.dstGuid] === 1;
      var blockedByPartner = shouldFlip && nextFp && partnerIsDegreeOne &&
        dist(thisplugin.startingpointGUID, e.dstGuid) <= dist(e.dstGuid, nextFp.guid);

      if (!shouldFlip || blockedByPartner) return;

      var desiredSrc = e.dstGuid;
      var desiredDst = e.srcGuid;

      var before = thisplugin.simulateDirectedPlan(current);
      var trial = current.map(function (other) {
        return (other.key === e.key) ? $.extend({}, other, { srcGuid: desiredSrc, dstGuid: desiredDst }) : other;
      });
      var after = thisplugin.simulateDirectedPlan(trial);
      if (after.invalidCount > before.invalidCount) return; // required for feasibility, keep as-is
      if (thisplugin.hasPrecedenceCycle(trial)) return; // would make no walk order satisfy every key dependency

      meshFlippedGuids[e.srcGuid] = true;
      savingsByGuid[e.srcGuid] = detourCost;
      flippedEdgeKeyByGuid[e.srcGuid] = e.key;
      e.srcGuid = desiredSrc;
      e.dstGuid = desiredDst;
    });

    // Portals with outgoing count 1 (only their own anchor/fan link, no mesh link at all) have
    // nothing to flip, but the same "on the way" question still applies to where they sit in the
    // walk: skipped here by the loop above (it only ever looks at mesh links), they'd otherwise
    // always stay at their bearing-sorted build position even when that's a detour — e.g. a
    // portal a few meters from the anchor but sorted far from it by angle. Reuses the very same
    // relocation set and reordering step as the flipped portals above; no feasibility check is
    // needed first since their link direction never changes, only when they're visited.
    sorted.forEach(function (fp) {
      if (fp.guid === thisplugin.startingpointGUID) return;
      if (outgoingCountByGuid[fp.guid] !== 1) return;

      var prevFp = sorted[indexByGuid[fp.guid] - 1];
      var nextFp = sorted[indexByGuid[fp.guid] + 1];

      var shouldRelocate;
      var detourCost;
      if (nextFp) {
        var viaSrc = dist(prevFp.guid, fp.guid) + dist(fp.guid, nextFp.guid);
        var direct = dist(prevFp.guid, nextFp.guid);
        detourCost = viaSrc - direct;
        shouldRelocate = detourCost > 1e-6;
      } else {
        shouldRelocate = true;
        detourCost = Infinity;
      }
      if (shouldRelocate) {
        meshFlippedGuids[fp.guid] = true;
        savingsByGuid[fp.guid] = detourCost;
      }
    });

    // Every portal that throws a link AT a given guid, in the final (post-flip) direction —
    // used by computeDistanceOrderReordering so a relocated portal never lands in the walk
    // after something that needs it already captured.
    function buildIncomingSourcesByGuid(edgeList) {
      var map = {};
      edgeList.forEach(function (e) {
        (map[e.dstGuid] = map[e.dstGuid] || []).push(e.srcGuid);
      });
      return map;
    }

    // Relocate each flipped/degree-one portal into the walk/display order, then check whether
    // each one actually paid off THERE — the decisions above only ever compared a candidate
    // against its own two immediate neighbors in the base build order, never against where
    // computeDistanceOrderReordering's cheapest insertion actually ends up placing it, which can
    // land somewhere the detour it avoided is smaller than the one it just created. A candidate
    // that doesn't pay off is reverted (walk position AND, if it had one, its link flip) and the
    // walk is rebuilt once more without it — same reasoning computeDistanceOrderFlips already
    // applies per candidate, just checked again now that the real insertion cost is known instead
    // of assumed.
    function buildReorder(relocateGuids) {
      return thisplugin.computeDistanceOrderReordering(relocateGuids, buildIncomingSourcesByGuid(current));
    }

    function insertionCost(orderGuids, guid) {
      var idx = orderGuids.indexOf(guid);
      var prevGuid = orderGuids[idx - 1];
      var nextGuid = orderGuids[idx + 1];
      if (prevGuid !== undefined && nextGuid !== undefined) {
        return dist(prevGuid, guid) + dist(guid, nextGuid) - dist(prevGuid, nextGuid);
      }
      if (prevGuid !== undefined) return dist(prevGuid, guid);
      if (nextGuid !== undefined) return dist(guid, nextGuid);
      return 0;
    }

    // The cheapest gap for `guid` in `orderGuids` if its own incoming-link precedence didn't
    // bound where it may land at all — together with exactly which of its incoming sources
    // (if any) are positioned early enough to rule that gap out. Mirrors
    // computeDistanceOrderReordering's own gap search, minus the `limit` it applies.
    function cheapestUnconstrainedGap(orderGuids, guid) {
      var withoutGuid = orderGuids.filter(function (g) { return g !== guid; });
      var best = null;
      for (var i = 0; i < withoutGuid.length - 1; i++) {
        var a = withoutGuid[i], b = withoutGuid[i + 1];
        var cost = dist(a, guid) + dist(guid, b) - dist(a, b);
        if (!best || cost < best.cost - 1e-9) best = { afterGuid: a, afterIdx: i, cost: cost };
      }
      if (withoutGuid.length) {
        var endCost = dist(withoutGuid[withoutGuid.length - 1], guid);
        if (!best || endCost < best.cost - 1e-9) {
          best = { afterGuid: withoutGuid[withoutGuid.length - 1], afterIdx: withoutGuid.length - 1, cost: endCost };
        }
      }
      return best;
    }

    var reorderResult = buildReorder(meshFlippedGuids);

    if (reorderResult) {
      var toRevert = [];

      Object.keys(reorderResult.movedGuids).forEach(function (guid) {
        var ownCost = insertionCost(reorderResult.order, guid);
        var paidOff = ownCost <= savingsByGuid[guid] + 1e-6;

        // Besides checking whether the actual landing spot paid off at all, also look for a
        // strictly cheaper gap elsewhere in the walk — the trigger decision above only ever
        // compared a candidate against its own two immediate build-order neighbors, never
        // against every other gap in the walk, so a genuinely better slot can exist even for a
        // candidate that already "paid off" where it landed. Reaching it may only be blocked by
        // one or more of its own incoming links (whoever throws a link at it needs it captured
        // first) — the one thing a flip, not a revert, can actually fix.
        var gap = cheapestUnconstrainedGap(reorderResult.order, guid);
        var gapIsBetter = gap && gap.cost < ownCost - 1e-6;

        if (!paidOff && !gapIsBetter) { toRevert.push(guid); return; }
        if (!gapIsBetter) return; // already as good as it gets here, nothing more to try

        // For a candidate that hasn't paid off yet, chasing this gap is only worth it if it
        // actually beats the ORIGINAL detour cost the candidate was trying to avoid in the
        // first place -- merely being cheaper than its own (already losing) current spot isn't
        // enough, or a flip could be kept even though the candidate still nets worse overall
        // than leaving it at its original build-order position.
        if (!paidOff && gap.cost > savingsByGuid[guid] + 1e-6) { toRevert.push(guid); return; }

        var withoutGuid = reorderResult.order.filter(function (g) { return g !== guid; });
        var blockingSourceGuids = (buildIncomingSourcesByGuid(current)[guid] || []).filter(function (srcGuid) {
          return withoutGuid.indexOf(srcGuid) <= gap.afterIdx;
        });
        if (!blockingSourceGuids.length) {
          if (!paidOff) toRevert.push(guid); // not actually a precedence problem, and didn't pay off either
          return;
        }

        var trial = current;
        var flippable = blockingSourceGuids.every(function (srcGuid) {
          var edge = trial.filter(function (e) { return e.srcGuid === srcGuid && e.dstGuid === guid; })[0];
          if (!edge) return false; // not a direct edge (e.g. same pair flipped already) -- bail, don't guess
          trial = trial.map(function (e) {
            return e === edge ? $.extend({}, e, { srcGuid: guid, dstGuid: srcGuid }) : e;
          });
          return true;
        });
        if (!flippable) { if (!paidOff) toRevert.push(guid); return; }

        var beforeFlip = thisplugin.simulateDirectedPlan(current);
        var afterFlip = thisplugin.simulateDirectedPlan(trial);
        if (afterFlip.invalidCount > beforeFlip.invalidCount || thisplugin.hasPrecedenceCycle(trial)) {
          if (!paidOff) toRevert.push(guid);
          return;
        }

        // Safe and strictly better: adopt the flipped edge(s) so the next reorder can actually
        // reach that cheaper gap, whether or not the candidate's current spot already paid off
        // on its own.
        current = trial;
      });

      if (toRevert.length) {
        toRevert.forEach(function (guid) {
          delete meshFlippedGuids[guid];
          var edgeKey = flippedEdgeKeyByGuid[guid];
          if (!edgeKey) return; // a degree-one relocation, no flip to undo
          var edge = current.filter(function (e) { return e.key === edgeKey; })[0];
          if (edge) { var tmp = edge.srcGuid; edge.srcGuid = edge.dstGuid; edge.dstGuid = tmp; }
        });
      }
      // Either some guids were reverted, or an incoming edge was flipped to free up a cheaper
      // gap for one that wasn't — either way the walk order has to be rebuilt once more to
      // reflect it.
      reorderResult = buildReorder(meshFlippedGuids);
    }

    var flips = thisplugin.flipsFromDirections(current, naturalByKey);

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
        if (thisplugin.hasPrecedenceCycle(trial)) return; // would make no walk order satisfy every key dependency

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
    thisplugin.refreshExcludedPortalMarkers();

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


    var rawFanpointGuids = Object.keys(this.fanpoints);

    if (rawFanpointGuids.length === 0) {
      // No plan -> reset signature and disable the path
      thisplugin.lastPlanSignature = null;
      if (thisplugin.showOrderPath) {
        thisplugin.setOrderPathActive(false);
      }
      return;
    }

    // signature of the RAW candidate portal set (GUID set, order-independent, before the "No
    // entry" shortcut's manual exclusions below are applied) — this is what detects an actual
    // change to the drawn selection (new/edited polygon, Bookmarks-only, …); toggling an
    // exclusion must never count as one itself, or applying it here would immediately look
    // like a "new" portal set and get dropped again by the block right below.
    var currentSignature = rawFanpointGuids.sort()
      .join(',');

    // If the portal set changed: disable the path, drop manual link flips (ghi#23) and any
    // manual portal exclusions (the "No entry" shortcut) — all reference GUIDs that may no
    // longer be part of the plan.
    if (thisplugin.lastPlanSignature !== null &&
      thisplugin.lastPlanSignature !== currentSignature) {

      thisplugin.manualLinkFlips = {};
      thisplugin.reconciledFanLinkKeys = {};
      thisplugin.relocatedForLessWalkingGuids = {};
      thisplugin.displayOrderGuids = null;
      thisplugin.requestLinkOrderRecompute();
      thisplugin.clearExcludedPortals();

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
      thisplugin._lockWhenPlanComplete = true;
    }

    // Store signature for the next run
    thisplugin.lastPlanSignature = currentSignature;

    // Apply manual portal exclusions (the "No entry" shortcut) now that the signature above is
    // settled, so they never themselves look like a changed selection.
    Object.keys(thisplugin.excludedPortalGuids).forEach(function (guid) {
      delete thisplugin.fanpoints[guid];
    });

    if (Object.keys(thisplugin.fanpoints).length === 0) {
      // Every candidate portal of the selection is excluded: nothing left to plan.
      thisplugin.linksLayerGroup.clearLayers();
      thisplugin.fieldsLayerGroup.clearLayers();
      thisplugin.numbersLayerGroup.clearLayers();
      thisplugin.clearAllPortalLabels();
      return;
    }

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
      // But giving the player as much freedom as possible is key.
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

    // Pinned anchor (thisplugin.setAnchorByGuid — Pick anchor menu entry, or the auto-orientation
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

      // rotate localSorted until the point right after the widest angular gap between the
      // portals themselves becomes the new start of the ring. Index 0 is always the anchor
      // (its bearing to itself is exactly 0, the minimum possible value, so it sorts first) —
      // it's excluded from this search, since its phantom 0° bearing would otherwise split the
      // true wraparound gap between the last and first real portal into two smaller ones,
      // making the widest gap go undetected whenever it happens to straddle due north (most
      // noticeable with an anchor picked inside the hull, surrounded on all sides).
      var currentBearing, lastBearing;
      var gap, maxGap, maxGapIndex;
      maxGap = 0;
      maxGapIndex = 1;
      for (i = 1; i < localSorted.length; i++) {
        lastBearing = (i === 1) ?
          localSorted[localSorted.length - 1].bearing :
          localSorted[i - 1].bearing;
        currentBearing = localSorted[i].bearing;
        gap = lastBearing - currentBearing;
        if (gap < 0) gap *= -1;
        if (gap >= 180) gap = 360 - gap;

        if (gap > maxGap) {
          maxGap = gap;
          maxGapIndex = i;
        }
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
            // flipped toggles away from the mode's default direction either way: in CENTRALIZING
            // (default inbound) it tries outbound, and in RADIATING (default outbound) it now
            // forces inbound instead — used by thisplugin.reconcileAnchorFanLinkDirections to
            // compensate for a link actually thrown the other way round.
            wantOutbound = (thisplugin.stardirection === thisplugin.starDirENUM.RADIATING) !== flipped;
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

      function applyBuiltPlan(plan) {
        thisplugin.startingpointGUID = plan.startingpointGUID;
        thisplugin.startingpoint = plan.startingpoint;
        this.sortedFanpoints = plan.sortedFanpoints;
        donelinks = plan.donelinks;
        triangles = plan.triangles;
        n = plan.n;
        centerOutgoings = plan.centerOutgoings;
        centerSbul = plan.centerSbul;
        thisplugin.centerKeys = plan.centerKeys;
      }

      applyBuiltPlan.call(this, buildFanPlan(thisplugin.perimeterpoints[thisplugin.startingpointIndex][0], thisplugin.is_clockwise));
      thisplugin.saveCurrentAnchor();

      // A fan link thrown the opposite way from planned (see reconcileAnchorFanLinkDirections)
      // changes manualLinkFlips, so the plan needs rebuilding once more to reflect it.
      if (thisplugin.reconcileAnchorFanLinkDirections(this.sortedFanpoints)) {
        applyBuiltPlan.call(this, buildFanPlan(thisplugin.perimeterpoints[thisplugin.startingpointIndex][0], thisplugin.is_clockwise));
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
        "\nFields:                " + ((thisplugin.validTriangleCount !== undefined) ? thisplugin.validTriangleCount : triangles.length).toString() +
        "\nBuild AP:              " + (((thisplugin.validLinkCount !== undefined) ? thisplugin.validLinkCount : donelinks.length) * 313 + ((thisplugin.validTriangleCount !== undefined) ? thisplugin.validTriangleCount : triangles.length) * 1250)
        .toString() +
        "\nDestroy AP:            " + ((this.sortedFanpoints.length * 187) + ((thisplugin.validTriangleCount !== undefined) ? thisplugin.validTriangleCount : triangles.length) * 750)
        .toString());
    }


    // Link order optimization: recompute once when something invalidated it (anchor/order/
    // geometry change) — never on every recalculation, so manual tweaks made on top via the
    // Task List ↔ button are left alone otherwise. Checked BEFORE validateUnderFieldLinks()
    // below: this branch always ends in a full updateLayer() re-run (which validates the
    // rebuilt plan itself), so validating the about-to-be-discarded pre-optimization plan here
    // first would just be thrown away — skipping it avoids a wasted getDisplayOrder() pass
    // (and, in RADIATING mode, a second budgeted outbound-prefix-order search) on every anchor
    // change.
    if (thisplugin._linkOrderRecomputePending && thisplugin.linkOrderMode !== thisplugin.linkOrderModeENUM.ALGO) {
      thisplugin._linkOrderRecomputePending = false;

      // Grey-out calls isLinkInGame() per link purely for display — irrelevant, and needlessly
      // expensive, while the optimizer itself computes. Suspend it for the duration of the
      // computation and restore it exactly as it was straight after, before the updateLayer()
      // call below, so the final render/Task List refresh sees the real value.
      // _linkOrderRecomputePending is already false, so that call can't loop back here.
      var greyOutWasOn = thisplugin.greyOutExistingLinks;
      thisplugin.greyOutExistingLinks = false;

      thisplugin.manualLinkFlips = (thisplugin.linkOrderMode === thisplugin.linkOrderModeENUM.KEYS)
        ? thisplugin.computeKeysOrderFlips()
        : thisplugin.computeDistanceOrderFlips();

      thisplugin.greyOutExistingLinks = greyOutWasOn;

      thisplugin.updateLayer();
      return;
    }

    // Issue #96: validate plan against under-field link distance constraints
    thisplugin.validateUnderFieldLinks();

    thisplugin.drawContext = { n: n, triangles: triangles, centerOutgoings: centerOutgoings, centerSbul: centerSbul };
    thisplugin.drawPlan();

    thisplugin.lockIfPlanComplete();
  };

  // Draws the current plan on the map (links, fields, blockers, position numbers following the
  // walk order) and refreshes an open Task List/Statistics dialog, from the plan updateLayer()
  // last calculated (thisplugin.drawContext) — without recalculating it.
  thisplugin.drawPlan = function () {
    var ctx = thisplugin.drawContext;
    if (!ctx) return;
    var n = ctx.n;
    var triangles = ctx.triangles;
    var centerOutgoings = ctx.centerOutgoings;
    var centerSbul = ctx.centerSbul;

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

      // Already thrown in-game for our faction? Fade it to a muted purple on the map,
      // so only links still left to throw stay bright purple — mirrors the Task List's own
      // "Grey out done links" toggle (isLinkInGame), rather than a separate switch.
      var isDone = thisplugin.greyOutExistingLinks && edge.guidA && edge.guidB &&
        thisplugin.isLinkInGame(edge.guidA, edge.guidB);

      var baseStyle = {
        color: isDone ? '#5B3A6B' : '#8E44AD',
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
  };

  // Shows a new walk order (a "Reroute" order) everywhere it's used, keeping the plan itself as
  // it is — which also works while the plan is Locked.
  thisplugin.redrawWalkOrder = function () {
    thisplugin.validateUnderFieldLinks();

    if (window.map.hasLayer(thisplugin.linksLayerGroup) ||
      window.map.hasLayer(thisplugin.fieldsLayerGroup) ||
      window.map.hasLayer(thisplugin.numbersLayerGroup)) {
      thisplugin.linksLayerGroup.clearLayers();
      thisplugin.fieldsLayerGroup.clearLayers();
      thisplugin.numbersLayerGroup.clearLayers();
      thisplugin.drawPlan();
    } else {
      thisplugin.refreshTaskListIfOpen();
      thisplugin.refreshStatisticsIfOpen();
    }
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
    thisplugin.refreshExcludedPortalMarkers();

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
  // captured or destroyed, etc. — see the mapDataRefreshEnd/requestFinished hooks below).
  // Unlike moveend/zoom, which just changes which area the user is looking at, this reflects
  // an actual change to the game state, so the map and Task List should still follow it even
  // while Locked — but only by redrawing the plan already on hand (links/fields/numbers,
  // Blockers Destroy stops and crosses included), via redrawWalkOrder(), never by recomputing
  // it (buildFanPlan/updateLayer, which the lock exists to suppress). This is what makes a
  // Destroy stop's cross disappear as soon as destroying that portal in-game also destroys the
  // blocking link it stood for, without waiting for the plan to unlock.
  thisplugin.onLiveDataChanged = function (wait) {
    if (thisplugin.is_locked) {
      thisplugin.refreshLiveGameData();

      // A fan link thrown the opposite way from planned (see reconcileAnchorFanLinkDirections)
      // changes manualLinkFlips and needs a full rebuild to apply — same bypass the Task List's
      // own manual flip button (toggleLinkFlip) already uses regardless of the lock, since this
      // is the same kind of change: one link's direction, not the plan's structure.
      if (thisplugin.reconcileAnchorFanLinkDirections(thisplugin.sortedFanpoints)) {
        thisplugin.updateLayer();
      } else {
        thisplugin.redrawWalkOrder();
      }
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
  var symbol_menu = '&#9776;';
  var symbol_left = '&#5130;';
  var symbol_right = '&#5125;';
  var symbol_noEntry = '&#9940;';
  // A key with a small camera in its lower right corner (Keys video).
  var symbol_keysVideo = '<span class="plugin_fanfields3_keysvideo_icon">&#128273;<span>&#128247;</span></span>';

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
            '<a id="fanfieldMenuButton" href="javascript: void(0);" class="fanfields-control" title="Fan Fields 3 - Menu">' +
            symbol_menu + '</a>'
          )
          .on("click", "#fanfieldMenuButton", function () {
            thisplugin.showMainMenu(this);
          });

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
            '<a id="fanfieldExcludePortalButton" href="javascript: void(0);" class="fanfields-control" title="Exclude portals: click, then click plan portals to leave them out of the plan">' +
            symbol_noEntry + '</a>'
          )
          .on("click", "#fanfieldExcludePortalButton", function () {
            thisplugin.togglePortalExclusionMode();
          });

        $(container)
          .append(
            '<a id="fanfieldKeysVideoButton" href="javascript: void(0);" class="fanfields-control" title="Keys video: update the Keys plugin from a screen recording of your keys in Ingress">' +
            symbol_keysVideo + '</a>'
          )
          .on("click", "#fanfieldKeysVideoButton", function () {
            thisplugin.openKeysVideoDialog();
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

  // Popup menu opened from the map's hamburger icon (and, for an entry with its own `submenu`,
  // opened again from there): one-shot actions that have no icon of their own in the topleft
  // bar. Shared by thisplugin.showMainMenu and any submenu it opens, so both look and behave
  // the same way.
  thisplugin.buildPopupMenu = function (entries, position) {
    $('#plugin_fanfields3_mainmenu').remove();

    var $menu = $('<div id="plugin_fanfields3_mainmenu" class="plugin_fanfields3_mainmenu"></div>');
    entries.forEach(function (entry) {
      $('<a class="plugin_fanfields3_mainmenu_item"></a>')
        .html(entry.label)
        .on('click', function () {
          $menu.remove();
          if (entry.submenu) {
            thisplugin.buildPopupMenu(entry.submenu, position);
          } else {
            entry.action();
          }
        })
        .appendTo($menu);
    });

    $menu.css({
      position: 'fixed',
      top: position.top,
      left: position.left
    });

    $('body').append($menu);

    // Deferred so the click that opened the menu isn't also the click that closes it.
    setTimeout(function () {
      $(document).one('click', function () {
        $menu.remove();
      });
    }, 0);
    $(document).one('keydown.plugin_fanfields3_mainmenu', function (e) {
      if (e.key === 'Escape') $menu.remove();
    });
  };

  thisplugin.showMainMenu = function (anchorEl) {
    var entries = [
      { label: 'Manage&nbsp;ops', action: thisplugin.showManageOpsDialog },
      { label: 'Manage&nbsp;order', action: thisplugin.showManageOrderDialog },
      { label: 'Plan&nbsp;details', submenu: [
          { label: 'Print&nbsp;route', action: thisplugin.exportTaskListToPDF },
          { label: 'Print&nbsp;step&nbsp;by&nbsp;step&nbsp;plan', action: thisplugin.exportPlanPdf },
          { label: 'Live&nbsp;simulation', action: function () {
              $('#plugin_fanfields3_exportText_inner').closest('.ui-dialog-content').dialog('close');
              thisplugin.startWalkSim();
            }
          }
        ]
      },
      { label: 'Pick&nbsp;anchor', action: thisplugin.toggleAnchorPicking },
      { label: 'Stats', action: thisplugin.showStatistics },
      { label: 'Options', action: thisplugin.showOptionsDialog },
      { label: 'Help', action: thisplugin.help }
    ];

    var rect = anchorEl.getBoundingClientRect();
    thisplugin.buildPopupMenu(entries, { top: rect.bottom, left: rect.left });
  };

  // Step-by-step PDF of the current plan: one page per portal in the walk, showing the links
  // thrown there (with how many fields each completes) and a map of the plan so far (links/
  // fields already done vs. done at this step). Mirrors test/tools/generateWalkReportPdf.py,
  // used to validate "Less walking" during development, but reading live plan state directly
  // instead of a fixture, so it always reflects exactly what's about to be walked.
  // Step-by-step plan report: one printable page per portal in the walk (links thrown there,
  // fields completed, a map of the plan so far). Built as plain HTML/SVG rather than a binary
  // PDF generated in JS: IITC Mobile's WebView can't reliably hand a JS-generated binary blob
  // back out (no real download support, and opening a blob: URL directly can crash the app
  // outright), and its one JS->native bridge for saving files (window.saveFile) only ever
  // writes plain text, not arbitrary bytes.
  //
  // Delivery differs by platform, since testing on IITC Mobile found neither of the two things
  // this could otherwise lean on actually works there: window.print() does nothing (the app
  // never wires a WebView's print output to Android's PrintManager, confirmed by its absence
  // from the app's own source -- the existing "Print Task List" above likely never worked on
  // mobile either, just never noticed), and window.open('', '_blank') plus writing into it
  // produced no visible result either (likely silently blocked). window.saveFile is the one
  // thing IITC Mobile actually implements for getting a file out of the WebView, so mobile gets
  // the report as a plain .html file via that -- open it in a real mobile browser afterward to
  // print it to PDF if wanted. Desktop keeps the print-dialog route, which is a real browser
  // feature there.
  thisplugin.exportPlanPdf = function () {
    var order = thisplugin.getDisplayOrder();
    if (!order || order.length < 2) {
      alert('Fan Fields 3: no plan to export yet -- draw a polygon around some portals first.');
      return;
    }

    var html = thisplugin.buildPlanPdfHtml(order);

    if (window.saveFile) {
      var mode = (thisplugin.stardirection === thisplugin.starDirENUM.RADIATING) ? 'outbound' : 'inbound';
      var anchorTitle = order[0].portal.options.data.title;
      var safeAnchor = anchorTitle.replace(/[\\/:*?"<>|]/g, '_');
      window.saveFile(html, 'Fan Fields 3 - ' + mode + ' plan - ' + safeAnchor + '.html', 'text/html');
      alert('Fan Fields 3: plan report saved as an HTML file. Open it in your phone\'s browser (not IITC) to view it or print it to PDF.');
      return;
    }

    var w = window.open('', '_blank');
    if (!w) return;

    w.document.open();
    w.document.write(html);
    w.document.close();

    w.focus();
    setTimeout(function () { w.print(); }, 250);
  };

  // Escapes text dropped into the HTML built below (portal titles can contain '<', '&', etc.).
  thisplugin.escapeHtml = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };

  thisplugin.buildPlanPdfHtml = function (order) {
    var walk = thisplugin.simulateWalk(order);

    // Every portal's own lat/lng (for the map) and title (for the text panel), keyed the same
    // way simulateWalk keys its own triangle points, so a field's three corners can be matched
    // back to real portals without re-deriving anything simulateWalk already knows.
    var infoByPointKey = {};
    order.forEach(function (fp) {
      var ll = fp.portal.getLatLng();
      infoByPointKey[thisplugin.pointKey(fp.point)] = { guid: fp.guid, title: fp.portal.options.data.title, lat: ll.lat, lng: ll.lng };
    });
    function infoFor(point) { return infoByPointKey[thisplugin.pointKey(point)]; }

    var linkSeq = []; // { srcInfo, dstInfo, stepIndex }
    order.forEach(function (fp, stepIndex) {
      (fp.outgoing || []).forEach(function (target) {
        linkSeq.push({ srcInfo: infoFor(fp.point), dstInfo: infoFor(target.point), stepIndex: stepIndex });
      });
    });

    var mode = (thisplugin.stardirection === thisplugin.starDirENUM.RADIATING) ? 'outbound' : 'inbound';
    var anchorTitle = order[0].portal.options.data.title;

    var steps = order.map(function (fp, i) {
      var prevFp = order[i - 1];
      var distFromPrev = prevFp ? thisplugin.distanceTo(prevFp.point, fp.point) : 0;
      var links = (fp.outgoing || []).map(function (target) {
        var dkey = thisplugin.getDirectedLinkKey(fp.guid, target.guid);
        return { title: target.portal.options.data.title, newFields: walk.fieldsByDirectedLink[dkey] || 0 };
      });
      return { info: infoFor(fp.point), distFromPrev: distFromPrev, links: links };
    });
    var cumulativeDist = 0;
    steps.forEach(function (s) { cumulativeDist += s.distFromPrev; s.cumulativeDist = cumulativeDist; });

    var runningLinks = 0, runningFields = 0;
    var runningLinksAt = [], runningFieldsAt = [];
    steps.forEach(function (s) {
      runningLinks += s.links.length;
      s.links.forEach(function (l) { runningFields += l.newFields; });
      runningLinksAt.push(runningLinks);
      runningFieldsAt.push(runningFields);
    });

    // Map bounds, in lat/lng, with an 8% margin -- same framing as the Python report.
    var allLats = order.map(function (fp) { return infoFor(fp.point).lat; });
    var allLngs = order.map(function (fp) { return infoFor(fp.point).lng; });
    var minLat = Math.min.apply(null, allLats), maxLat = Math.max.apply(null, allLats);
    var minLng = Math.min.apply(null, allLngs), maxLng = Math.max.apply(null, allLngs);
    var latMargin = (maxLat - minLat) * 0.08 || 0.001;
    var lngMargin = (maxLng - minLng) * 0.08 || 0.001;
    minLat -= latMargin; maxLat += latMargin; minLng -= lngMargin; maxLng += lngMargin;

    // SVG viewBox units for the map (arbitrary; scales to whatever size the CSS below gives it).
    var mapSize = 1000;
    var scale = Math.min(mapSize / (maxLng - minLng), mapSize / (maxLat - minLat));
    var drawnW = (maxLng - minLng) * scale, drawnH = (maxLat - minLat) * scale;
    var originX = (mapSize - drawnW) / 2, originY = (mapSize - drawnH) / 2;
    function px(lng) { return originX + (lng - minLng) * scale; }
    function py(lat) { return originY + (maxLat - lat) * scale; }

    var esc = thisplugin.escapeHtml;

    function buildMapSvg(i) {
      var parts = [];
      parts.push('<svg viewBox="0 0 ' + mapSize + ' ' + mapSize + '" class="ff3-map" preserveAspectRatio="xMidYMid meet">');

      order.forEach(function (fp) {
        var inf = infoFor(fp.point);
        parts.push('<circle cx="' + px(inf.lng) + '" cy="' + py(inf.lat) + '" r="3" class="ff3-portal-dot"/>');
      });

      // Fields: completed-before-this-step ones first (light gray), this step's new ones on top
      // (red) -- same two-layer draw order as the links below.
      [false, true].forEach(function (onlyCurrent) {
        walk.triangles.forEach(function (t) {
          if (t.visitIndex > i) return;
          if (onlyCurrent !== (t.visitIndex === i)) return;
          var a = infoFor(t.a), b = infoFor(t.b), c = infoFor(t.c);
          if (!a || !b || !c) return;
          var points = [a, b, c].map(function (p) { return px(p.lng) + ',' + py(p.lat); }).join(' ');
          parts.push('<polygon points="' + points + '" class="' + (onlyCurrent ? 'ff3-field-new' : 'ff3-field-done') + '"/>');
        });
      });

      // Links: same already-done-first, this-step-on-top order.
      [false, true].forEach(function (onlyCurrent) {
        linkSeq.forEach(function (l) {
          if (l.stepIndex > i) return;
          if (onlyCurrent !== (l.stepIndex === i)) return;
          parts.push('<line x1="' + px(l.srcInfo.lng) + '" y1="' + py(l.srcInfo.lat) + '" x2="' + px(l.dstInfo.lng) + '" y2="' + py(l.dstInfo.lat) +
            '" class="' + (onlyCurrent ? 'ff3-link-new' : 'ff3-link-done') + '"/>');
        });
      });

      // Walked path so far, then the current position on top.
      if (i > 0) {
        var pts = order.slice(0, i + 1).map(function (fp) {
          var inf = infoFor(fp.point);
          return px(inf.lng) + ',' + py(inf.lat);
        }).join(' ');
        parts.push('<polyline points="' + pts + '" class="ff3-walked-path"/>');
      }
      var curInfo = infoFor(order[i].point);
      parts.push('<circle cx="' + px(curInfo.lng) + '" cy="' + py(curInfo.lat) + '" r="9" class="ff3-current-pos"/>');

      parts.push('</svg>');
      return parts.join('');
    }

    function buildTextPanel(i) {
      var s = steps[i];
      var lines = [];
      lines.push('<div class="ff3-pdf-step-title">Step ' + (i + 1) + ' / ' + steps.length + '</div>');
      lines.push('<div class="ff3-pdf-portal">Portal: ' + esc(s.info.title) + '</div>');
      if (i > 0) lines.push('<div>From: ' + esc(steps[i - 1].info.title) + '</div>');
      lines.push('<div>Distance walked this step: ' + Math.round(s.distFromPrev) + ' m</div>');
      lines.push('<div>Cumulative distance walked: ' + Math.round(s.cumulativeDist) + ' m</div>');
      if (s.links.length) {
        lines.push('<div class="ff3-pdf-links-label">Links thrown here, in order:</div>');
        lines.push('<ul class="ff3-pdf-links">');
        s.links.forEach(function (l) {
          var fieldTxt = l.newFields === 1 ? '1 field' : (l.newFields + ' fields');
          lines.push('<li>&rarr; ' + esc(l.title) + ' (' + fieldTxt + ')</li>');
        });
        lines.push('</ul>');
      } else {
        lines.push('<div>No links thrown here.</div>');
      }
      lines.push('<div class="ff3-pdf-totals">Running totals: ' + runningLinksAt[i] + ' link(s), ' + runningFieldsAt[i] + ' field(s)</div>');
      return lines.join('\n');
    }

    var legendHtml =
      '<div class="ff3-pdf-legend">' +
      '<div><span class="ff3-swatch-line" style="background:#333"></span>Links already thrown</div>' +
      '<div><span class="ff3-swatch-line" style="background:#e60000"></span>New links (this step)</div>' +
      '<div><span class="ff3-swatch-box" style="background:#d6d6d6"></span>Fields already formed</div>' +
      '<div><span class="ff3-swatch-box" style="background:#ff9999"></span>New fields (this step)</div>' +
      '<div><span class="ff3-swatch-line ff3-swatch-dashed" style="border-color:#1f6feb"></span>Walked path</div>' +
      '</div>';

    var pagesHtml = steps.map(function (_s, i) {
      return (
        '<section class="ff3-pdf-page">' +
        '<h1>Fan Fields 3 — ' + esc(mode) + ' — anchor: ' + esc(anchorTitle) + ' — step ' + (i + 1) + '/' + steps.length + '</h1>' +
        '<div class="ff3-pdf-body">' +
        '<div class="ff3-pdf-map-col">' + buildMapSvg(i) + '</div>' +
        '<div class="ff3-pdf-text-col">' + buildTextPanel(i) + legendHtml + '</div>' +
        '</div>' +
        '</section>'
      );
    }).join('\n');

    var css = '\n' +
      '@page { size: landscape; margin: 10mm; }\n' +
      'body { font-family: Arial, sans-serif; font-size: 10pt; color: #000; margin: 0; }\n' +
      '.ff3-pdf-page { page-break-after: always; padding: 6mm; box-sizing: border-box; }\n' +
      '.ff3-pdf-page:last-child { page-break-after: auto; }\n' +
      'h1 { font-size: 12pt; text-align: center; margin: 0 0 6mm 0; }\n' +
      '.ff3-pdf-body { display: flex; gap: 8mm; }\n' +
      '.ff3-pdf-map-col { flex: 1.3; min-width: 0; }\n' +
      '.ff3-map { width: 100%; height: auto; aspect-ratio: 1 / 1; }\n' +
      '.ff3-portal-dot { fill: #999; }\n' +
      '.ff3-field-done { fill: #d6d6d6; }\n' +
      '.ff3-field-new { fill: #ff9999; }\n' +
      '.ff3-link-done { stroke: #333; stroke-width: 2.5; }\n' +
      '.ff3-link-new { stroke: #e60000; stroke-width: 5; }\n' +
      '.ff3-walked-path { fill: none; stroke: #1f6feb; stroke-width: 2.5; stroke-dasharray: 8 6; opacity: 0.7; }\n' +
      '.ff3-current-pos { fill: #1f6feb; stroke: #fff; stroke-width: 2.5; }\n' +
      '.ff3-pdf-text-col { flex: 1; font-family: "Courier New", monospace; font-size: 9pt; }\n' +
      '.ff3-pdf-step-title { font-size: 11pt; font-weight: bold; margin-bottom: 4mm; }\n' +
      '.ff3-pdf-portal { margin-bottom: 4mm; }\n' +
      '.ff3-pdf-links-label { margin-top: 4mm; }\n' +
      '.ff3-pdf-links { margin: 1mm 0 4mm 0; padding-left: 4mm; list-style: none; }\n' +
      '.ff3-pdf-totals { margin-top: 4mm; font-weight: bold; }\n' +
      '.ff3-pdf-legend { margin-top: 8mm; font-family: Arial, sans-serif; font-size: 8pt; }\n' +
      '.ff3-pdf-legend > div { display: flex; align-items: center; gap: 2mm; margin: 1mm 0; }\n' +
      '.ff3-swatch-line { display: inline-block; width: 6mm; height: 0; border-top: 1mm solid; }\n' +
      '.ff3-swatch-dashed { border-top-style: dashed; }\n' +
      '.ff3-swatch-box { display: inline-block; width: 4mm; height: 3mm; }\n';

    var safeAnchor = anchorTitle.replace(/[\\/:*?"<>|]/g, '_');
    return (
      '<!doctype html>' +
      '<html><head><meta charset="utf-8">' +
      '<title>Fan Fields 3 - ' + esc(mode) + ' plan - ' + esc(safeAnchor) + '</title>' +
      '<style>' + css + '</style>' +
      '</head><body>' + pagesHtml + '</body></html>'
    );
  };

  // Settings persisted across sessions via "Save options as default" in the Options dialog.
  thisplugin.OPTIONS_STORAGE_KEY = 'plugin-fanfields3-saved-defaults';

  thisplugin.getSavedOptionsDefault = function () {
    try {
      var raw = localStorage.getItem(thisplugin.OPTIONS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  };

  // Plain snapshot of the option fields below, shared by "Save options as default" and Manage
  // Ops (each saved op carries its own snapshot, applied back by applyOptionsSnapshot on load).
  thisplugin.getCurrentOptionsSnapshot = function () {
    return {
      isClockwise: thisplugin.is_clockwise,
      stardirection: thisplugin.stardirection,
      availableSBUL: thisplugin.availableSBUL,
      respectIntelLinksMode: thisplugin.respectIntelLinksMode,
      useBookmarksOnly: thisplugin.use_bookmarks_only,
      manageBlockers: thisplugin.manageBlockers,
      blockerMaxDetourM: thisplugin.blockerMaxDetourM,
      consumeKeysOnLinkThrown: thisplugin.consumeKeysOnLinkThrown
    };
  };

  thisplugin.applyOptionsSnapshot = function (saved) {
    if (!saved) return;

    if (typeof saved.isClockwise === 'boolean') thisplugin.is_clockwise = saved.isClockwise;
    if (saved.stardirection === thisplugin.starDirENUM.CENTRALIZING || saved.stardirection === thisplugin.starDirENUM.RADIATING) {
      thisplugin.stardirection = saved.stardirection;
    }
    if (typeof saved.availableSBUL === 'number') thisplugin.availableSBUL = saved.availableSBUL;
    if (typeof saved.respectIntelLinksMode === 'number') thisplugin.respectIntelLinksMode = saved.respectIntelLinksMode;
    if (typeof saved.useBookmarksOnly === 'boolean') thisplugin.use_bookmarks_only = saved.useBookmarksOnly;
    if (typeof saved.manageBlockers === 'boolean') thisplugin.manageBlockers = saved.manageBlockers;
    if (typeof saved.blockerMaxDetourM === 'number') thisplugin.blockerMaxDetourM = saved.blockerMaxDetourM;
    // saved.walkSimShowLinks (an older saved op/default may still carry it) is intentionally
    // never read any more: the sim's own links are always shown now, not a toggle.
    if (typeof saved.consumeKeysOnLinkThrown === 'boolean') thisplugin.consumeKeysOnLinkThrown = saved.consumeKeysOnLinkThrown;
  };

  // The current anchor, persisted continuously (every updateLayer() run — see where
  // startingpointGUID is set) so the currently drawn plan — not just a named Manage Ops
  // entry — keeps its anchor across an IITC reload, the same way DrawTools already keeps the
  // drawing itself and saveOptionsDefault() already keeps the options.
  thisplugin.CURRENT_ANCHOR_STORAGE_KEY = 'plugin-fanfields3-current-anchor';

  thisplugin.saveCurrentAnchor = function () {
    localStorage.setItem(thisplugin.CURRENT_ANCHOR_STORAGE_KEY, JSON.stringify({ guid: thisplugin.startingpointGUID || null }));
  };

  thisplugin.getSavedCurrentAnchor = function () {
    try {
      var raw = localStorage.getItem(thisplugin.CURRENT_ANCHOR_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  };

  thisplugin.applySavedOptionsDefault = function () {
    thisplugin.applyOptionsSnapshot(thisplugin.getSavedOptionsDefault());
  };

  thisplugin.saveOptionsDefault = function () {
    localStorage.setItem(thisplugin.OPTIONS_STORAGE_KEY, JSON.stringify(thisplugin.getCurrentOptionsSnapshot()));
  };

  // Settings dialog: direction/fan mode/SBUL/Respect Intel/portal selection, each applied
  // immediately on change and persisted straight to localStorage, so the dialog has nothing
  // left to confirm or discard — it's just closed via its own title bar once done.
  thisplugin.showOptionsDialog = function () {
    var hasBookmarks = typeof window.plugin.bookmarks !== 'undefined';
    var isRadiating = thisplugin.stardirection === thisplugin.starDirENUM.RADIATING;

    var respectOptions = [
      { value: thisplugin.respectIntelLinksModeENUM.NONE, label: 'None' },
      { value: thisplugin.respectIntelLinksModeENUM.ALL, label: 'All factions' },
      { value: thisplugin.respectIntelLinksModeENUM.ENL, label: 'Enlightened' },
      { value: thisplugin.respectIntelLinksModeENUM.RES, label: 'Resistance' },
      { value: thisplugin.respectIntelLinksModeENUM.MAC, label: 'Machina' },
      { value: thisplugin.respectIntelLinksModeENUM.ENL_AND_MAC, label: 'Enlightened + Machina' },
      { value: thisplugin.respectIntelLinksModeENUM.RES_AND_MAC, label: 'Resistance + Machina' }
    ];

    var html = '<div id="plugin_fanfields3_options_dialog">';

    html += '<div class="plugin_fanfields3_options_row">' +
      '<label for="plugin_fanfields3_opt_direction">Direction</label>' +
      '<select id="plugin_fanfields3_opt_direction">' +
      '<option value="cw"' + (thisplugin.is_clockwise ? ' selected' : '') + '>Clockwise</option>' +
      '<option value="ccw"' + (!thisplugin.is_clockwise ? ' selected' : '') + '>Counterclockwise</option>' +
      '</select></div>';

    html += '<div class="plugin_fanfields3_options_row">' +
      '<label for="plugin_fanfields3_opt_fanmode">Fan mode</label>' +
      '<select id="plugin_fanfields3_opt_fanmode">' +
      '<option value="in"' + (!isRadiating ? ' selected' : '') + '>Inbounding</option>' +
      '<option value="out"' + (isRadiating ? ' selected' : '') + '>Outbounding</option>' +
      '</select></div>';

    html += '<div id="plugin_fanfields3_availablesbul" class="plugin_fanfields3_options_row plugin_fanfields3_options_subrow" style="display:' + (isRadiating ? 'flex' : 'none') + ';">' +
      '<span class="plugin_fanfields3_availablesbul_label">Available&nbsp;SBUL</span>' +
      '<span class="plugin_fanfields3_multibtn" style="flex: 50%">' +
      '<a id="plugin_fanfields3_inscsbulbtn" class="plugin_fanfields3_minibtn" onclick="window.plugin.fanfields.decreaseSBUL();">' + symbol_left + '</a>' +
      '<span id="plugin_fanfields3_availablesbul_count" class="plugin_fanfields3_minibtn">' + thisplugin.availableSBUL + '</span>' +
      '<a id="plugin_fanfields3_decsbulbtn" class="plugin_fanfields3_minibtn" onclick="window.plugin.fanfields.increaseSBUL();">' + symbol_right + '</a>' +
      '</span></div>';

    html += '<div class="plugin_fanfields3_options_row">' +
      '<label for="plugin_fanfields3_opt_respect">Respect Intel</label>' +
      '<select id="plugin_fanfields3_opt_respect">';
    respectOptions.forEach(function (opt) {
      html += '<option value="' + opt.value + '"' + (thisplugin.respectIntelLinksMode === opt.value ? ' selected' : '') + '>' + opt.label + '</option>';
    });
    html += '</select></div>';

    html += '<div class="plugin_fanfields3_options_row">' +
      '<label for="plugin_fanfields3_opt_blockers" title="Add the portals to destroy to the Task List, so that links crossing the plan (from factions Respect Intel does not avoid) are gone before the links they block are thrown">Blockers</label>' +
      '<select id="plugin_fanfields3_opt_blockers">' +
      '<option value="on"' + (thisplugin.manageBlockers ? ' selected' : '') + '>On</option>' +
      '<option value="off"' + (!thisplugin.manageBlockers ? ' selected' : '') + '>Off</option>' +
      '</select></div>';

    html += '<div id="plugin_fanfields3_opt_detour_row" class="plugin_fanfields3_options_row plugin_fanfields3_options_subrow" style="display:' + (thisplugin.manageBlockers ? 'flex' : 'none') + ';">' +
      '<label for="plugin_fanfields3_opt_detour" title="Longest extra walk a single Blockers Destroy stop may add to the route; blockers that cannot be freed within it are listed under the Task List">Blockers&nbsp;max&nbsp;detour</label>' +
      '<select id="plugin_fanfields3_opt_detour">';
    thisplugin.BLOCKER_DETOUR_LIMITS_M.forEach(function (limit) {
      html += '<option value="' + limit + '"' + (thisplugin.blockerMaxDetourM === limit ? ' selected' : '') + '>' +
        thisplugin.getBlockerDetourLabel(limit) + '</option>';
    });
    html += '</select></div>';

    if (hasBookmarks) {
      html += '<div class="plugin_fanfields3_options_row">' +
        '<label for="plugin_fanfields3_opt_portals">Portal selection</label>' +
        '<select id="plugin_fanfields3_opt_portals">' +
        '<option value="all"' + (!thisplugin.use_bookmarks_only ? ' selected' : '') + '>All portals</option>' +
        '<option value="bookmarks"' + (thisplugin.use_bookmarks_only ? ' selected' : '') + '>Bookmarks only</option>' +
        '</select></div>';
    }

    html += '<div class="plugin_fanfields3_options_row">' +
      '<label for="plugin_fanfields3_opt_spendkeys" title="When a link is detected as newly thrown in-game, remove one key for its destination portal from the Keys plugin (never below 0)">Spend&nbsp;keys&nbsp;on&nbsp;throw</label>' +
      '<select id="plugin_fanfields3_opt_spendkeys">' +
      '<option value="on"' + (thisplugin.consumeKeysOnLinkThrown ? ' selected' : '') + '>On</option>' +
      '<option value="off"' + (!thisplugin.consumeKeysOnLinkThrown ? ' selected' : '') + '>Off</option>' +
      '</select></div>';

    html += '</div>';

    var width = 380;
    thisplugin.MaxDialogWidth = thisplugin.getMaxDialogWidth();
    if (thisplugin.MaxDialogWidth < width) width = thisplugin.MaxDialogWidth;

    dialog({
      html: html,
      id: 'plugin_fanfields3_options',
      title: 'Fan Fields 3 - Options',
      width: width,
      closeOnEscape: true
    });

    $('#plugin_fanfields3_opt_direction').on('change', function () {
      var wantClockwise = ($(this).val() === 'cw');
      if (wantClockwise !== thisplugin.is_clockwise) thisplugin.toggleclockwise();
      thisplugin.saveOptionsDefault();
    });

    $('#plugin_fanfields3_opt_fanmode').on('change', function () {
      var wantRadiating = ($(this).val() === 'out');
      var currentlyRadiating = (thisplugin.stardirection === thisplugin.starDirENUM.RADIATING);
      if (wantRadiating !== currentlyRadiating) thisplugin.toggleStarDirection();
      $('#plugin_fanfields3_availablesbul').toggle(wantRadiating);
      thisplugin.saveOptionsDefault();
    });

    $('#plugin_fanfields3_opt_respect').on('change', function () {
      thisplugin.respectIntelLinksMode = parseInt($(this).val(), 10);
      thisplugin.delayedUpdateLayer(0.2, true);
      thisplugin.saveOptionsDefault();
    });

    $('#plugin_fanfields3_opt_blockers').on('change', function () {
      thisplugin.manageBlockers = ($(this).val() === 'on');
      $('#plugin_fanfields3_opt_detour_row').toggle(thisplugin.manageBlockers);
      thisplugin.refreshTaskListIfOpen();
      thisplugin.updateLayer();
      thisplugin.saveOptionsDefault();
    });

    $('#plugin_fanfields3_opt_detour').on('change', function () {
      thisplugin.blockerMaxDetourM = parseInt($(this).val(), 10);
      thisplugin.refreshTaskListIfOpen();
      thisplugin.updateLayer();
      thisplugin.saveOptionsDefault();
    });

    $('#plugin_fanfields3_opt_portals').on('change', function () {
      var wantBookmarksOnly = ($(this).val() === 'bookmarks');
      if (wantBookmarksOnly !== thisplugin.use_bookmarks_only) thisplugin.useBookmarksOnly();
      thisplugin.saveOptionsDefault();
    });

    $('#plugin_fanfields3_opt_spendkeys').on('change', function () {
      thisplugin.consumeKeysOnLinkThrown = ($(this).val() === 'on');
      thisplugin.saveOptionsDefault();
    });
  };

  thisplugin.getMaxDialogWidth = function () {
    const vw = (window.visualViewport && window.visualViewport.width) ? window.visualViewport.width : window.innerWidth;
    return Math.max(260, Math.floor(vw) - 12); // leave some space
  };

  // On mobile, the phone's own on-screen navigation bar (or the app's persistent bottom
  // toolbar) commonly overlaps the bottom of the visible viewport without being reflected in
  // its reported height at all — an edge-to-edge WebView reports the full screen height, then
  // the OS/app draws its own controls on top of it. Shared by getMaxDialogHeight() (caps how
  // tall a dialog may grow) and anything that also positions a dialog relative to the literal
  // bottom edge (e.g. showStatistics on mobile), so neither a dialog's content nor its own
  // bottom edge ends up hidden underneath it.
  thisplugin.MOBILE_DIALOG_BOTTOM_CLEARANCE_PX = 150;

  thisplugin.getMaxDialogHeight = function () {
    const vh = (window.visualViewport && window.visualViewport.height) ? window.visualViewport.height : window.innerHeight;

    // Desktop browsers don't have the nav-bar overlap problem above, so keep their margin minimal.
    var bottomClearance = (L.Browser.mobile) ? thisplugin.MOBILE_DIALOG_BOTTOM_CLEARANCE_PX : 20;
    return Math.max(200, Math.floor(vh) - bottomClearance);
  };

  // ---- Usage stats -------------------------------------------------------------------------
  //
  // Anonymous usage ping, sent to a small server this plugin's author runs: a one-way hash of
  // the agent's nickname (never the nickname itself — see computeStatsAgentHash below), the
  // faction, and how many seconds the plugin was active. The server derives a coarse region
  // from the request's IP itself (never sent by this code) and never sees anything else. Used
  // only to gauge how the plugin is actually used (which faction, which region, how much) —
  // there is no per-feature tracking of what you click or plan.
  //
  // In the field, IITC is often only open for a few seconds at a time (check the next step,
  // close it again), so there's no accumulating active time client-side on a timer: a ping this
  // short could easily end before any timer fires. Instead each ping just reports "I'm here
  // now"; the server turns consecutive pings from the same agent into a duration itself (see
  // STATS_PING_INTERVAL_MS below and SESSION_GAP_MS server-side) — a gap short enough to be the
  // same look at the map counts as active time, a long gap (plugin actually closed) doesn't.
  const STATS_ENDPOINT = 'https://fanfields.avataar120.com/collect';
  const STATS_PROTOCOL_VERSION = 1;
  // While visible, re-ping often enough that consecutive pings always fall well under the
  // server's same-session cutoff — this is what lets a long, continuously open session still
  // accumulate active time, instead of only the instant open/close pings below.
  const STATS_PING_INTERVAL_MS = 60 * 1000;
  // Public, fixed HMAC key: this plugin is open source, so it can never be a real secret. Its
  // only purpose is to stop the stored hash from matching a generic, precomputed SHA-256(nickname)
  // rainbow table — it does not and cannot stop someone with the plugin's source from testing
  // one specific candidate nickname against a known hash themselves. That limit is inherent to
  // any scheme where the hashing method has to be public; there's no way around it short of the
  // server seeing the raw nickname, which is exactly what this avoids.
  const STATS_HMAC_SALT = 'fanfields3-stats-v1';

  thisplugin._statsAgentHash = null;
  thisplugin._statsPingTimer = null;

  function computeStatsAgentHash(nickname) {
    const enc = new TextEncoder();
    return window.crypto.subtle.importKey(
      'raw', enc.encode(STATS_HMAC_SALT), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    ).then(function (key) {
      return window.crypto.subtle.sign('HMAC', key, enc.encode(nickname.toLowerCase()));
    }).then(function (sig) {
      return Array.prototype.map.call(new Uint8Array(sig), function (b) {
        return b.toString(16).padStart(2, '0');
      }).join('');
    });
  }

  // A single "I'm here now" ping — no duration, no timestamp even (the server uses its own
  // clock, both to avoid clock-skew issues and because sendBeacon can't guarantee *when* it
  // actually goes out). Best-effort only: any failure here must never surface to the player or
  // affect the plugin itself.
  thisplugin._statsPing = function () {
    if (!thisplugin._statsAgentHash) return;
    try {
      const payload = JSON.stringify({
        v: STATS_PROTOCOL_VERSION,
        agent: thisplugin._statsAgentHash,
        faction: (window.PLAYER && window.PLAYER.team === 'ENLIGHTENED') ? 'ENL' : 'RES'
      });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(STATS_ENDPOINT, new Blob([payload], { type: 'text/plain' }));
      } else {
        fetch(STATS_ENDPOINT, { method: 'POST', body: payload, keepalive: true }).catch(function () {});
      }
    } catch (e) { /* stats are best-effort, never break the plugin over this */ }
  };

  thisplugin.initUsageStats = function () {
    if (!window.crypto || !window.crypto.subtle || !window.PLAYER || !window.PLAYER.nickname) return;

    computeStatsAgentHash(window.PLAYER.nickname).then(function (hash) {
      thisplugin._statsAgentHash = hash;
      thisplugin._statsPing();
      if (document.visibilityState === 'visible') thisplugin._statsStartPinging();
    }).catch(function () { /* Web Crypto unavailable or failed: no stats this session */ });

    document.addEventListener('visibilitychange', function () {
      thisplugin._statsPing();
      if (document.visibilityState === 'visible') {
        thisplugin._statsStartPinging();
      } else {
        thisplugin._statsStopPinging();
      }
    });
    // Belt and suspenders alongside visibilitychange above: on some mobile WebViews, closing or
    // backgrounding the app doesn't reliably fire visibilitychange first.
    window.addEventListener('pagehide', function () { thisplugin._statsPing(); });
  };

  thisplugin._statsStartPinging = function () {
    if (thisplugin._statsPingTimer) return;
    thisplugin._statsPingTimer = setInterval(thisplugin._statsPing, STATS_PING_INTERVAL_MS);
  };
  thisplugin._statsStopPinging = function () {
    clearInterval(thisplugin._statsPingTimer);
    thisplugin._statsPingTimer = null;
  };

  thisplugin.setup = function () {
    thisplugin.setupCSS();
    thisplugin.linksLayerGroup = new L.LayerGroup();
    thisplugin.fieldsLayerGroup = new L.LayerGroup();
    thisplugin.numbersLayerGroup = new L.LayerGroup();
    //thisplugin.MaxDialogWidth = $(window).width() - 2;
    thisplugin.MaxDialogWidth = thisplugin.getMaxDialogWidth();

    thisplugin.orderPathLayerGroup = new L.LayerGroup();

    // Always on the map (not a togglable Fanfields layer): markers for manually excluded
    // portals need to stay visible even while picking is armed and the plan itself hasn't been
    // recalculated yet (see thisplugin.toggleExcludedPortal).
    thisplugin.excludedPortalMarkersLayerGroup = new L.LayerGroup().addTo(map);


    //Extend LatLng here to ensure it was created before
    thisplugin.initLatLng();

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

    thisplugin.applySavedOptionsDefault();

    // Restores the anchor of whatever is currently drawn (persisted on every plan
    // recalculation — see thisplugin.saveCurrentAnchor), the same way DrawTools already
    // restores the drawing itself and applySavedOptionsDefault() just restored the options.
    // Applied as a manual pin (see loadOp for the same pattern) so the auto-orientation search
    // that runs right after this drawing is first recalculated doesn't silently override it;
    // dropped by updateLayer() on its own if this portal isn't part of the restored drawing.
    var savedAnchor = thisplugin.getSavedCurrentAnchor();
    if (savedAnchor && savedAnchor.guid) {
      thisplugin.forcedAnchorGUID = savedAnchor.guid;
      thisplugin.forcedAnchorIsManual = true;
    }

    thisplugin.updateLockButton();

    //         window.pluginCreateHook('pluginBkmrksEdit');

    //         window.addHook('pluginBkmrksEdit', function (e) {
    //             if (thisplugin.use_bookmarks_only && e.target === 'portal') {
    //                 thisplugin.delayedUpdateLayer(0.5);
    //             }
    //         });

    window.pluginCreateHook('pluginDrawTools');

    window.addHook('pluginDrawTools', function (e) {
      // The very first time this fires is DrawTools finishing its own restore of whatever was
      // already drawn when IITC opened — not a real edit — so that drawing (plus the options
      // and anchor already restored above) counts as the accepted baseline right away.
      // Without this, opsBaselineJSON would stay null until the player next interacted with
      // Manage Ops, and Manage Ops would wrongly warn about "unsaved changes" for a session
      // that in fact hasn't changed since it was last saved. The anchor override is
      // thisplugin.forcedAnchorGUID (the just-restored pin), not thisplugin.startingpointGUID —
      // that only catches up once the debounced updateLayer() run below actually completes.
      if (!thisplugin._hasSeededOpsBaseline) {
        thisplugin._hasSeededOpsBaseline = true;
        thisplugin.opsBaselineJSON = thisplugin.buildWorkSnapshotJSON({ anchor: thisplugin.forcedAnchorGUID || null });
      }
      thisplugin.delayedUpdateLayer(0.5, true);
    });
    window.addHook('mapDataRefreshStart', function () {
      thisplugin._mapDataLoading = true;

      // The plan hasn't locked yet: this reload may bring in links that change the best anchor,
      // or give the orientation search something to reuse for the first time — make sure a fresh
      // attempt runs once it completes, instead of locking on what was tried before the reload.
      if (thisplugin._lockWhenPlanComplete) {
        thisplugin._orientationSearchPending = true;
      }
    });
    window.addHook('mapDataRefreshEnd', function () {
      thisplugin._mapDataLoading = false;
      thisplugin.onLiveDataChanged(0.5);
    });
    window.addHook('requestFinished', function () {
      setTimeout(function () {
        thisplugin.onLiveDataChanged(3.0);
      }, 1);
    });

    // "No entry" shortcut: while armed, the next portal clicked/selected on the map toggles
    // whether it's excluded from the plan — never disarms itself, so several portals can be
    // marked in a row; see thisplugin.togglePortalExclusionMode for what happens on disarm.
    // Takes priority over "Pick anchor" below (the two picking modes are never meant to run
    // at once; arming one never disarms the other explicitly, but only one tool's portal click
    // handling makes sense to apply to any given click).
    window.addHook('portalSelected', function (data) {
      if (thisplugin.isExcludingPortals) {
        var excludeGuid = data && data.selectedPortalGuid;
        if (excludeGuid && (excludeGuid in thisplugin.fanpoints || thisplugin.excludedPortalGuids[excludeGuid])) {
          thisplugin.toggleExcludedPortal(excludeGuid);
        }
        return;
      }

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
      // Walk sim pans the map itself as it goes (see centerIfOffscreen in startWalkSim): a
      // full plan recalculation right then would stall the main thread mid-animation, making
      // the dot appear to jump over several stops at once. The sim touches no plan state, so
      // there's nothing here worth recalculating for anyway.
      if (thisplugin._walkSimState) return;
      thisplugin.delayedUpdateLayer(0.5);
    });
    // Recalculates (and, if Locked, unlocks for it — see delayedUpdateLayer's userRequested
    // branch) only when one of THIS plugin's own layers (Links/Fields/Numbers) is toggled —
    // updateLayer() itself early-returns while none of them are visible, so switching one on
    // needs a fresh run. Checking e.layer against them specifically matters because Leaflet
    // fires this same event for every overlay on the map, including ones IITC shows/hides on
    // its own as the zoom crosses their configured range: without the check, simply zooming
    // past some unrelated layer's threshold silently unlocked and recalculated the plan,
    // rebuilding it from whatever portals IITC happened to have loaded at that instant (often
    // showing "unknown title" rows until the rest streamed in).
    window.map.on('overlayadd overlayremove', function (e) {
      if (e.layer !== thisplugin.linksLayerGroup && e.layer !== thisplugin.fieldsLayerGroup &&
        e.layer !== thisplugin.numbersLayerGroup) {
        return;
      }
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

    // Keep an open Task List or Statistics dialog current between plan recalculations —
    // available key counts (LiveInventory/Keys plugin) and in-game link/portal completion can
    // change on their own timeline, not just when this plugin recomputes the plan (the
    // Statistics dialog's own "Your activity today" section refreshes separately, on its own
    // Refresh link — see thisplugin.refreshMyActivityToday — since it needs a Comm request,
    // not just a repaint from data already on hand). Refreshes live game
    // data (thisplugin.locations/intelLinks) itself first, rather than only repainting from
    // whatever a mapDataRefreshEnd/requestFinished hook last put there: on some platforms
    // (observed on IITC Mobile) IITC's own map updates without those hooks ever firing for
    // this plugin, which would otherwise leave the Task List showing a stale, already-thrown
    // link as still outstanding indefinitely.
    setInterval(function () {
      var taskListOpen = thisplugin.isTaskListDialogOpen();
      var statisticsOpen = thisplugin.isStatisticsDialogOpen();
      if (!taskListOpen && !statisticsOpen) return;

      thisplugin.refreshLiveGameData();
      if (taskListOpen) thisplugin.refreshTaskListDialog();
      if (statisticsOpen) thisplugin.refreshStatisticsDialog();
    }, 10000);

    window.addLayerGroup('Fanfields links', thisplugin.linksLayerGroup, false);
    window.addLayerGroup('Fanfields fields', thisplugin.fieldsLayerGroup, false);
    window.addLayerGroup('Fanfields numbers', thisplugin.numbersLayerGroup, false);

    thisplugin.initUsageStats();

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
