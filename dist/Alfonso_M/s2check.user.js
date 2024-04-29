// ==UserScript==
// @author         Alfonso_M
// @name           Pogo Tools
// @id             s2check@Alfonso_M
// @category       Layer
// @namespace      https://github.com/AlfonsoML-s/pogo-s2/
// @downloadURL    https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/Alfonso_M/s2check.user.js
// @updateURL      https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/Alfonso_M/s2check.meta.js
// @homepageURL    https://alfonsoml-s.github.io/pogo-s2/
// @version        0.102
// @description    Pokemon Go tools over IITC.
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==


/* eslint-env es6 */
/* eslint no-var: "error" */
/* globals L, map */
/* globals GM_info, $, dialog */
/* globals renderPortalDetails, findPortalGuidByPositionE6, chat */


;(function () { // eslint-disable-line no-extra-semi

	/** S2 Geometry functions

	 S2 extracted from Regions Plugin
	 https:static.iitc.me/build/release/plugins/regions.user.js

	 the regional scoreboard is based on a level 6 S2 Cell
	 - https:docs.google.com/presentation/d/1Hl4KapfAENAOf4gv-pSngKwvS_jwNVHRPZTTDzXXn6Q/view?pli=1#slide=id.i22
	 at the time of writing there's no actual API for the intel map to retrieve scoreboard data,
	 but it's still useful to plot the score cells on the intel map


	 the S2 geometry is based on projecting the earth sphere onto a cube, with some scaling of face coordinates to
	 keep things close to approximate equal area for adjacent cells
	 to convert a lat,lng into a cell id:
	 - convert lat,lng to x,y,z
	 - convert x,y,z into face,u,v
	 - u,v scaled to s,t with quadratic formula
	 - s,t converted to integer i,j offsets
	 - i,j converted to a position along a Hubbert space-filling curve
	 - combine face,position to get the cell id

	 NOTE: compared to the google S2 geometry library, we vary from their code in the following ways
	 - cell IDs: they combine face and the hilbert curve position into a single 64 bit number. this gives efficient space
							 and speed. javascript doesn't have appropriate data types, and speed is not cricical, so we use
							 as [face,[bitpair,bitpair,...]] instead
	 - i,j: they always use 30 bits, adjusting as needed. we use 0 to (1<<level)-1 instead
					(so GetSizeIJ for a cell is always 1)
	*/

	function wrapper(plugin_info) {
		'use strict';

		const d2r = Math.PI / 180.0;
		const r2d = 180.0 / Math.PI;

		const S2 = {};

		function LatLngToXYZ(latLng) {
			const phi = latLng.lat * d2r;
			const theta = latLng.lng * d2r;
			const cosphi = Math.cos(phi);

			return [Math.cos(theta) * cosphi, Math.sin(theta) * cosphi, Math.sin(phi)];
		}

		function XYZToLatLng(xyz) {
			const lat = Math.atan2(xyz[2], Math.sqrt(xyz[0] * xyz[0] + xyz[1] * xyz[1]));
			const lng = Math.atan2(xyz[1], xyz[0]);

			return {lat: lat * r2d, lng: lng * r2d};
		}

		function largestAbsComponent(xyz) {
			const temp = [Math.abs(xyz[0]), Math.abs(xyz[1]), Math.abs(xyz[2])];

			if (temp[0] > temp[1]) {
				if (temp[0] > temp[2]) {
					return 0;
				}
				return 2;
			}

			if (temp[1] > temp[2]) {
				return 1;
			}

			return 2;
		}

		function faceXYZToUV(face,xyz) {
			let u, v;

			switch (face) {
				case 0: u =	xyz[1] / xyz[0]; v =	xyz[2] / xyz[0]; break;
				case 1: u = -xyz[0] / xyz[1]; v =	xyz[2] / xyz[1]; break;
				case 2: u = -xyz[0] / xyz[2]; v = -xyz[1] / xyz[2]; break;
				case 3: u =	xyz[2] / xyz[0]; v =	xyz[1] / xyz[0]; break;
				case 4: u =	xyz[2] / xyz[1]; v = -xyz[0] / xyz[1]; break;
				case 5: u = -xyz[1] / xyz[2]; v = -xyz[0] / xyz[2]; break;
				default: throw {error: 'Invalid face'};
			}

			return [u,v];
		}

		function XYZToFaceUV(xyz) {
			let face = largestAbsComponent(xyz);

			if (xyz[face] < 0) {
				face += 3;
			}

			const uv = faceXYZToUV(face, xyz);

			return [face, uv];
		}

		function FaceUVToXYZ(face, uv) {
			const u = uv[0];
			const v = uv[1];

			switch (face) {
				case 0: return [1, u, v];
				case 1: return [-u, 1, v];
				case 2: return [-u,-v, 1];
				case 3: return [-1,-v,-u];
				case 4: return [v,-1,-u];
				case 5: return [v, u,-1];
				default: throw {error: 'Invalid face'};
			}
		}

		function STToUV(st) {
			const singleSTtoUV = function (st) {
				if (st >= 0.5) {
					return (1 / 3.0) * (4 * st * st - 1);
				}
				return (1 / 3.0) * (1 - (4 * (1 - st) * (1 - st)));

			};

			return [singleSTtoUV(st[0]), singleSTtoUV(st[1])];
		}

		function UVToST(uv) {
			const singleUVtoST = function (uv) {
				if (uv >= 0) {
					return 0.5 * Math.sqrt (1 + 3 * uv);
				}
				return 1 - 0.5 * Math.sqrt (1 - 3 * uv);

			};

			return [singleUVtoST(uv[0]), singleUVtoST(uv[1])];
		}

		function STToIJ(st,order) {
			const maxSize = 1 << order;

			const singleSTtoIJ = function (st) {
				const ij = Math.floor(st * maxSize);
				return Math.max(0, Math.min(maxSize - 1, ij));
			};

			return [singleSTtoIJ(st[0]), singleSTtoIJ(st[1])];
		}

		function IJToST(ij,order,offsets) {
			const maxSize = 1 << order;

			return [
				(ij[0] + offsets[0]) / maxSize,
				(ij[1] + offsets[1]) / maxSize
			];
		}

		// S2Cell class
		S2.S2Cell = function () {};

		//static method to construct
		S2.S2Cell.FromLatLng = function (latLng, level) {
			const xyz = LatLngToXYZ(latLng);
			const faceuv = XYZToFaceUV(xyz);
			const st = UVToST(faceuv[1]);
			const ij = STToIJ(st,level);

			return S2.S2Cell.FromFaceIJ(faceuv[0], ij, level);
		};

		S2.S2Cell.FromFaceIJ = function (face, ij, level) {
			const cell = new S2.S2Cell();
			cell.face = face;
			cell.ij = ij;
			cell.level = level;

			return cell;
		};

		S2.S2Cell.prototype.toString = function () {
			return 'F' + this.face + 'ij[' + this.ij[0] + ',' + this.ij[1] + ']@' + this.level;
		};

		S2.S2Cell.prototype.getLatLng = function () {
			const st = IJToST(this.ij, this.level, [0.5, 0.5]);
			const uv = STToUV(st);
			const xyz = FaceUVToXYZ(this.face, uv);

			return XYZToLatLng(xyz);
		};

		S2.S2Cell.prototype.getCornerLatLngs = function () {
			const offsets = [
				[0.0, 0.0],
				[0.0, 1.0],
				[1.0, 1.0],
				[1.0, 0.0]
			];

			return offsets.map(offset => {
				const st = IJToST(this.ij, this.level, offset);
				const uv = STToUV(st);
				const xyz = FaceUVToXYZ(this.face, uv);

				return XYZToLatLng(xyz);
			});
		};

		S2.S2Cell.prototype.getNeighbors = function (deltas) {

			const fromFaceIJWrap = function (face,ij,level) {
				const maxSize = 1 << level;
				if (ij[0] >= 0 && ij[1] >= 0 && ij[0] < maxSize && ij[1] < maxSize) {
					// no wrapping out of bounds
					return S2.S2Cell.FromFaceIJ(face,ij,level);
				}

				// the new i,j are out of range.
				// with the assumption that they're only a little past the borders we can just take the points as
				// just beyond the cube face, project to XYZ, then re-create FaceUV from the XYZ vector
				let st = IJToST(ij,level,[0.5, 0.5]);
				let uv = STToUV(st);
				let xyz = FaceUVToXYZ(face, uv);
				const faceuv = XYZToFaceUV(xyz);
				face = faceuv[0];
				uv = faceuv[1];
				st = UVToST(uv);
				ij = STToIJ(st,level);
				return S2.S2Cell.FromFaceIJ(face, ij, level);
			};

			const face = this.face;
			const i = this.ij[0];
			const j = this.ij[1];
			const level = this.level;

			if (!deltas) {
				deltas = [
					{a: -1, b: 0},
					{a: 0, b: -1},
					{a: 1, b: 0},
					{a: 0, b: 1}
				];
			}
			return deltas.map(function (values) {
				return fromFaceIJWrap(face, [i + values.a, j + values.b], level);
			});
		};

		/** Our code
		* For safety, S2 must be initialized before our code
		*/

		// based on https://github.com/iatkin/leaflet-svgicon
		function initSvgIcon() {
			L.DivIcon.SVGIcon = L.DivIcon.extend({
				options: {
					'className': 'svg-icon',
					'iconAnchor': null, //defaults to [iconSize.x/2, iconSize.y] (point tip)
					'iconSize': L.point(48, 48)
				},
				initialize: function (options) {
					options = L.Util.setOptions(this, options);

					//iconSize needs to be converted to a Point object if it is not passed as one
					options.iconSize = L.point(options.iconSize);

					if (!options.iconAnchor) {
						options.iconAnchor = L.point(Number(options.iconSize.x) / 2, Number(options.iconSize.y));
					} else {
						options.iconAnchor = L.point(options.iconAnchor);
					}
				},

				// https://github.com/tonekk/Leaflet-Extended-Div-Icon/blob/master/extended.divicon.js#L13
				createIcon: function (oldIcon) {
					let div = L.DivIcon.prototype.createIcon.call(this, oldIcon);

					if (this.options.id) {
						div.id = this.options.id;
					}

					if (this.options.style) {
						for (let key in this.options.style) {
							div.style[key] = this.options.style[key];
						}
					}
					return div;
				}
			});

			L.divIcon.svgIcon = function (options) {
				return new L.DivIcon.SVGIcon(options);
			};

			L.Marker.SVGMarker = L.Marker.extend({
				options: {
					'iconFactory': L.divIcon.svgIcon,
					'iconOptions': {}
				},
				initialize: function (latlng, options) {
					options = L.Util.setOptions(this, options);
					options.icon = options.iconFactory(options.iconOptions);
					this._latlng = latlng;
				},
				onAdd: function (map) {
					L.Marker.prototype.onAdd.call(this, map);
				}
			});

			L.marker.svgMarker = function (latlng, options) {
				return new L.Marker.SVGMarker(latlng, options);
			};
		}

		/**
		 * Saves a file to disk with the provided text
		 * @param {string} text - The text to save
		 * @param {string} filename - Proposed filename
		 */
		function saveToFile(text, filename) {
			if (typeof text != 'string') {
				text = JSON.stringify(text);
			}

			if (typeof window.saveFile != 'undefined') {
				window.saveFile(text, filename, 'application/json');
				return;
			}

			alert('You are using an old version of IITC.\r\nIn the future this plugin will no longer be compatible with it.\r\nPlease, upgrade ASAP to IITC-CE https://iitc.modos189.ru/');


			if (typeof window.android !== 'undefined' && window.android.saveFile) {
				window.android.saveFile(filename, 'application/json', text);
				return;
			}

			if (isIITCm()) {
				promptForCopy(text);
				return;
			}

			const element = document.createElement('a');

			// http://stackoverflow.com/questions/13405129/javascript-create-and-save-file
			const file = new Blob([text], {type: 'text/plain'});
			const objectURL = URL.createObjectURL(file);
			element.setAttribute('href', objectURL);

			element.setAttribute('download', filename);

			element.style.display = 'none';
			document.body.appendChild(element);

			element.click();

			setTimeout(function () {
				document.body.removeChild(element);
				URL.revokeObjectURL(objectURL);
			}, 0);
		}

		/**
		 * Prompts the user to select a file and then reads its contents and calls the callback function with those contents
		 * @param {Function} callback - Function that will be called when the file is read.
		 * Callback signature: function( {string} contents ) {}
		 */
		function readFromFile(callback) {

			if (typeof L.FileListLoader != 'undefined') {
				L.FileListLoader.loadFiles({accept: 'application/json'})
					.on('load',function (e) {
						callback(e.reader.result);
					});
				return;
			}

			alert('You are using an old version of IITC.\r\nIn the future this plugin will no longer be compatible with it.\r\nPlease, upgrade ASAP to IITC-CE https://iitc.modos189.ru/');


			// special hook from iitcm
			if (typeof window.requestFile != 'undefined') {
				window.requestFile(function (filename, content) {
					callback(content);
				});
				return;
			}

			if (isIITCm()) {
				promptForPaste(callback);
				return;
			}

			const input = document.createElement('input');
			input.type = 'file';
			document.body.appendChild(input);

			input.addEventListener('change', function () {
				const reader = new FileReader();
				reader.onload = function () {
					callback(reader.result);
				};
				reader.readAsText(input.files[0]);
				document.body.removeChild(input);
			}, false);

			input.click();
		}

		function promptForPaste(callback) {
			const div = document.createElement('div');

			const textarea = document.createElement('textarea');
			textarea.style.width = '100%';
			textarea.style.minHeight = '8em';
			div.appendChild(textarea);
			const width = Math.min(screen.availWidth, 360);

			const container = dialog({
				id: 'promptForPaste',
				html: div,
				width: width + 'px',
				title: 'Paste here the data',
				buttons: {
					OK: function () {
						container.dialog('close');
						callback(textarea.value);
					}
				}
			});
		}

		function promptForCopy(text) {
			const div = document.createElement('div');

			const textarea = document.createElement('textarea');
			textarea.style.width = '100%';
			textarea.style.minHeight = '8em';
			textarea.value = text;
			div.appendChild(textarea);
			const width = Math.min(screen.availWidth, 360);

			const container = dialog({
				id: 'promptForCopy',
				html: div,
				width: width + 'px',
				title: 'Copy this data',
				buttons: {
					OK: function () {
						container.dialog('close');
					}
				}
			});
		}

		const TIMERS = {};
		function createThrottledTimer(name, callback, ms) {
			if (TIMERS[name])
				clearTimeout(TIMERS[name]);

			// throttle if there are several calls to the functions
			TIMERS[name] = setTimeout(function () {
				delete TIMERS[name];
				if (typeof window.requestIdleCallback == 'undefined')
					callback();
				else
					// and even now, wait for iddle
					requestIdleCallback(function () {
						callback();
					}, {timeout: 2000});

			}, ms || 100);
		}

		/**
		 * Try to identify if the browser is IITCm due to special bugs like file picker not working
		 */
		function isIITCm() {
			const ua = navigator.userAgent;
			if (!ua.match(/Android.*Mobile/))
				return false;

			if (ua.match(/; wb\)/))
				return true;

			return ua.match(/ Version\//);
		}

		function is_iOS() {
			const ua = navigator.userAgent;
			return ua.includes('iPhone') || ua.includes('iPad');
		}

		let pokestops = {};
		let gyms = {};
		// Portals that aren't marked as PoGo items
		let notpogo = {};

		let allPortals = {};
		let newPortals = {};
		let checkNewPortalsTimer;
		let relayoutTimer; // timer for relayout when portal is added

		// Portals that the user hasn't classified as Pokestops (2 or more in the same Lvl17 cell)
		let skippedPortals = {};
		let newPokestops = {};
		let notClassifiedPokestops = [];

		// Portals that we know, but that have been moved from our stored location.
		let movedPortals = [];
		// Pogo items that are no longer available.
		let missingPortals = {};

		// Cells currently detected with extra gyms
		let cellsExtraGyms = {};
		// Cells that the user has marked to ignore extra gyms
		let ignoredCellsExtraGyms = {};
		// Cells with missing Gyms
		let ignoredCellsMissingGyms = {};

		// Leaflet layers
		let regionLayer; // parent layer
		let stopLayerGroup; // pokestops
		let gymLayerGroup; // gyms
		let nearbyLayerGroup; // circles to mark the too near limit
		let gridLayerGroup; // s2 grid
		let cellLayerGroup; // cell shading and borders
		let gymCenterLayerGroup; // gym centers

		let countLayer; // layer with count of portals in each cell

		// Group of items added to the layer
		let stopLayers = {};
		let gymLayers = {};
		let nearbyCircles = {};

		// grouping of the portals in the second level of the grid
		let cellsPortals = {};

		const highlighterTitle = 'PoGo Tools';
		const gymCellLevel = 14; // the cell level which is considered when counting POIs to determine # of gyms
		const poiCellLevel = 17; // the cell level where there can only be 1 POI translated to pogo

		const defaultSettings = {
			highlightGymCandidateCells: true,
			highlightGymCenter: false,
			thisIsPogo: false,
			analyzeForMissingData: true,
			centerMapOnClick: true,
			grids: [
				{
					level: gymCellLevel,
					width: 5,
					color: '#004D40',
					opacity: 0.5
				},
				{
					level: poiCellLevel,
					width: 2,
					color: '#388E3C',
					opacity: 0.5
				}
			],
			colors: {
				cellsExtraGyms: {
					color: '#ff0000',
					opacity: 0.5
				},
				cellsMissingGyms: {
					color: '#ffa500',
					opacity: 0.5
				},
				cell17Filled: {
					color: '#000000',
					opacity: 0.6
				},
				cell14Filled: {
					color: '#000000',
					opacity: 0.5
				},
				nearbyCircleBorder: {
					color: '#000000',
					opacity: 0.6
				},
				nearbyCircleFill: {
					color: '#000000',
					opacity: 0.4
				},
				missingStops1: {
					color: '#BF360C',
					opacity: 1
				},
				missingStops2: {
					color: '#E64A19',
					opacity: 1
				},
				missingStops3: {
					color: '#FF5722',
					opacity: 1
				}
			},
			saveDataType: 'Gyms',
			saveDataFormat: 'CSV'
		};

		let settings = defaultSettings;

		function saveSettings() {
			createThrottledTimer('saveSettings', function () {
				localStorage[KEY_SETTINGS] = JSON.stringify(settings);
			});
		}

		function loadSettings() {
			const tmp = localStorage[KEY_SETTINGS];
			if (!tmp) {
				loadOldSettings();
				return;
			}
			try	{
				settings = JSON.parse(tmp);
			} catch (e) { // eslint-disable-line no-empty
			}

			setThisIsPogo();
		}

		/**
		* Migrate from old key to new one in order to avoid conflict with other plugin that reused this code.
		*/
		function loadOldSettings() {
			const tmp = localStorage['s2check_settings'];
			if (!tmp)
				return;
			try	{
				settings = JSON.parse(tmp);
			} catch (e) { // eslint-disable-line no-empty
			}
			if (typeof settings.analyzeForMissingData == 'undefined') {
				settings.analyzeForMissingData = true;
			}
			if (typeof settings.promptForMissingData != 'undefined') {
				delete settings.promptForMissingData;
			}
			if (!settings.colors) {
				resetColors();
			}
			if (typeof settings.saveDataType == 'undefined') {
				settings.saveDataType = 'Gyms';
			}
			if (typeof settings.saveDataFormat == 'undefined') {
				settings.saveDataFormat = 'CSV';
			}
			if (typeof settings.centerMapOnClick == 'undefined') {
				settings.centerMapOnClick = true;
			}

			setThisIsPogo();

			// migrate key
			localStorage.removeItem('s2check_settings');
			saveStorage();
		}

		function resetColors() {
			settings.grids[0].color = defaultSettings.grids[0].color;
			settings.grids[0].opacity = defaultSettings.grids[0].opacity;
			settings.grids[1].color = defaultSettings.grids[1].color;
			settings.grids[1].opacity = defaultSettings.grids[1].opacity;
			settings.colors = defaultSettings.colors;
		}

		let originalHighlightPortal;
		let originalChatRequestPublic;
		let originalChatRequestFaction;
		let originalChatRequestAlerts;
		let originalRANGE_INDICATOR_COLOR;
		let originalHACK_RANGE;

		function markPortalsAsNeutral(data) {
			const hidePortalOwnershipStyles = window.getMarkerStyleOptions({team: window.TEAM_NONE, level: 0});
			data.portal.setStyle(hidePortalOwnershipStyles);
		}

		function setThisIsPogo() {
			document.body.classList[settings.thisIsPogo ? 'add' : 'remove']('thisIsPogo');
			// It seems that iOS has some bug in the following code, but I can't debug it.
			if (is_iOS())
				return;

			try {
				if (settings.thisIsPogo) {
					removeIngressLayers();
					if (chat && chat.requestPublic) {
						originalChatRequestPublic = chat && chat.requestPublic;
						chat.requestPublic = function () {}; // no requests for chat
					}
					if (chat && chat.requestFaction) {
						originalChatRequestFaction = chat && chat.requestFaction;
						chat.requestFaction = function () {}; // no requests for chat
					}
					if (chat && chat.requestAlerts) {
						originalChatRequestAlerts = chat && chat.requestAlerts;
						chat.requestAlerts = function () {}; // no requests for chat
					}

					// Hide the link range indicator around the selected portal
					originalRANGE_INDICATOR_COLOR = window.RANGE_INDICATOR_COLOR;
					window.RANGE_INDICATOR_COLOR = 'transparent';

					// Use 80 m. interaction radius
					originalHACK_RANGE = window.HACK_RANGE;
					window.HACK_RANGE = 80;

					if (window._current_highlighter == window._no_highlighter) {
						window.changePortalHighlights(highlighterTitle);
					}

				} else {
					restoreIngressLayers();
					if (originalChatRequestPublic) {
						chat.requestPublic = originalChatRequestPublic;
						originalChatRequestPublic = null;
					}
					if (originalChatRequestFaction) {
						chat.requestFaction = originalChatRequestFaction;
						originalChatRequestFaction = null;
					}
					if (originalChatRequestAlerts) {
						chat.requestAlerts = originalChatRequestAlerts;
						originalChatRequestAlerts = null;
					}

					if (originalRANGE_INDICATOR_COLOR != null)
						window.RANGE_INDICATOR_COLOR = originalRANGE_INDICATOR_COLOR;

					if (originalHACK_RANGE != null)
						window.HACK_RANGE = originalHACK_RANGE;

					if (window._current_highlighter == highlighterTitle) {
						window.changePortalHighlights(window._no_highlighter);
					}

					if (originalHighlightPortal != null) {
						window.highlightPortal = originalHighlightPortal;
						originalHighlightPortal = null;
						window.resetHighlightedPortals();
					}
				}
			} catch (e) {
				alert('Error initializing ThisIsPogo');
				console.log(e); // eslint-disable-line no-console
			}
		}

		function sortByName(a, b) {
			if (!a.name)
				return -1;

			return a.name.localeCompare(b.name);
		}

		function isCellOnScreen(mapBounds, cell) {
			const corners = cell.getCornerLatLngs();
			const cellBounds = L.latLngBounds([corners[0],corners[1]]).extend(corners[2]).extend(corners[3]);
			return cellBounds.intersects(mapBounds);
		}

		// return only the cells that are visible by the map bounds to ignore far away data that might not be complete
		function filterWithinScreen(cells) {
			const bounds = map.getBounds();
			const filtered = {};
			Object.keys(cells).forEach(cellId => {
				const cellData = cells[cellId];
				const cell = cellData.cell;

				if (isCellInsideScreen(bounds, cell)) {
					filtered[cellId] = cellData;
				}
			});
			return filtered;
		}

		function isCellInsideScreen(mapBounds, cell) {
			const corners = cell.getCornerLatLngs();
			const cellBounds = L.latLngBounds([corners[0],corners[1]]).extend(corners[2]).extend(corners[3]);
			return mapBounds.contains(cellBounds);
		}

		/**
		* Filter a group of items (gyms/stops) excluding those out of the screen
		*/
		function filterItemsByMapBounds(items) {
			const bounds = map.getBounds();
			const filtered = {};
			Object.keys(items).forEach(id => {
				const item = items[id];

				if (isPointOnScreen(bounds, item)) {
					filtered[id] = item;
				}
			});
			return filtered;
		}

		function isPointOnScreen(mapBounds, point) {
			if (point._latlng)
				return mapBounds.contains(point._latlng);

			return mapBounds.contains(L.latLng(point));
		}

		function groupByCell(level) {
			const cells = {};
			classifyGroup(cells, gyms, level, (cell, item) => cell.gyms.push(item));
			classifyGroup(cells, pokestops, level, (cell, item) => cell.stops.push(item));
			classifyGroup(cells, newPortals, level, (cell, item) => cell.notClassified.push(item));
			classifyGroup(cells, notpogo, level, (cell, item) => {/* */});

			return cells;
		}

		function classifyGroup(cells, items, level, callback) {
			Object.keys(items).forEach(id => {
				const item = items[id];
				if (!item.cells) {
					item.cells = {};
				}
				let cell;
				// Compute the cell only once for each level
				if (!item.cells[level]) {
					cell = S2.S2Cell.FromLatLng(item, level);
					item.cells[level] = cell.toString();
				}
				const cellId = item.cells[level];

				// Add it to the array of gyms of that cell
				if (!cells[cellId]) {
					if (!cell) {
						cell = S2.S2Cell.FromLatLng(item, level);
					}
					cells[cellId] = {
						cell: cell,
						gyms: [],
						stops: [],
						notClassified: [],
						portals: {}
					};
				}
				callback(cells[cellId], item);
			});
		}

		/**
		 * Returns the items that belong to the specified cell
		 */
		function findCellItems(cellId, level, items) {
			return Object.values(items).filter(item => item.cells[level] == cellId);
		}

		/**
			Tries to add the portal photo when exporting from Ingress.com/intel
		*/
		function findPhotos(items) {
			if (!window.portals) {
				return items;
			}
			Object.keys(items).forEach(id => {
				const item = items[id];
				if (item.image)
					return;

				const portal = window.portals[id];
				if (portal && portal.options && portal.options.data) {
					item.image = portal.options.data.image;
				}
			});
			return items;
		}

		function configureGridLevelSelect(select, i) {
			select.value = settings.grids[i].level;
			select.addEventListener('change', e => {
				settings.grids[i].level = parseInt(select.value, 10);
				if (i == 1)
					resetGrouping();

				saveSettings();
				updateMapGrid();
			});
		}

		function resetGrouping() {
			cellsPortals = {};
			const level = settings.grids[1].level;
			if (level < 4)
				return;

			classifyGroup(cellsPortals, allPortals, level, (cell, item) => cell.portals[item.guid] = true);
		}

		function groupPortal(item) {
			const level = settings.grids[1].level;
			if (level < 4)
				return;

			let cells = cellsPortals;
			let cell;

			// Compute the cell only once for each level
			if (!item.cells[level]) {
				cell = S2.S2Cell.FromLatLng(item, level);
				item.cells[level] = cell.toString();
			}
			const cellId = item.cells[level];

			// Add it to the array of gyms of that cell
			if (!cells[cellId]) {
				if (!cell) {
					cell = S2.S2Cell.FromLatLng(item, level);
				}
				cells[cellId] = {
					cell: cell,
					portals: {}
				};
			}
			cells[cellId].portals[item.guid] = true;
		}

		function showS2Dialog() {
			const selectRow = `
				<p>{{level}} level of grid to display: <select>
				<option value=0>None</option>
				<option value=6>6</option>
				<option value=7>7</option>
				<option value=8>8</option>
				<option value=9>9</option>
				<option value=10>10</option>
				<option value=11>11</option>
				<option value=12>12</option>
				<option value=13>13</option>
				<option value=14>14</option>
				<option value=15>15</option>
				<option value=16>16</option>
				<option value=17>17</option>
				<option value=18>18</option>
				<option value=19>19</option>
				<option value=20>20</option>
				</select></p>`;

			const html =
				selectRow.replace('{{level}}', '1st') +
				selectRow.replace('{{level}}', '2nd') +
				`<p><input type="checkbox" id="chkHighlightCandidates" /><label for="chkHighlightCandidates">Highlight Cells that might get a Gym</label></p>
				 <p><input type="checkbox" id="chkHighlightCenters" /><label for="chkHighlightCenters">Put an X in the center of Cells with a Gym<br />(for determining EX-eligibility)</label></p>
				 <p><input type="checkbox" id="chkThisIsPogo" /><label for="chkThisIsPogo" title='Hide Ingress panes, info and whatever that clutters the map and it is useless for Pokemon Go'>This is PoGo!</label></p>
				 <p><input type="checkbox" id="chkanalyzeForMissingData" /><label for="chkanalyzeForMissingData" title="Analyze the portal data to show the pane that suggests new Pokestops and Gyms">Analyze portal data</label></p>
				 <p><input type="checkbox" id="chkcenterMapOnClick" /><label for="chkcenterMapOnClick" title="Center map on portal when clicked in a dialog box.">Center map on click.</label></p>
				 <p><a id='PogoEditColors'>Colors</a></p>
				`;

			const container = dialog({
				id: 's2Settings',
				width: 'auto',
				html: html,
				title: 'S2 & Pokemon Settings'
			});

			const div = container[0];

			const selects = div.querySelectorAll('select');
			for (let i = 0; i < 2; i++) {
				configureGridLevelSelect(selects[i], i);
			}

			const chkHighlight = div.querySelector('#chkHighlightCandidates');
			chkHighlight.checked = settings.highlightGymCandidateCells;

			chkHighlight.addEventListener('change', e => {
				settings.highlightGymCandidateCells = chkHighlight.checked;
				saveSettings();
				updateMapGrid();
			});

			const chkHighlightCenters = div.querySelector('#chkHighlightCenters');
			chkHighlightCenters.checked = settings.highlightGymCenter;
			chkHighlightCenters.addEventListener('change', e => {
				settings.highlightGymCenter = chkHighlightCenters.checked;
				saveSettings();
				updateMapGrid();
			});

			const chkThisIsPogo = div.querySelector('#chkThisIsPogo');
			chkThisIsPogo.checked = !!settings.thisIsPogo;
			chkThisIsPogo.addEventListener('change', e => {
				settings.thisIsPogo = chkThisIsPogo.checked;
				saveSettings();
	
				// update status
				storeIngressLayerDefaultStatus();

				setThisIsPogo();
			});

			const chkanalyzeForMissingData = div.querySelector('#chkanalyzeForMissingData');
			chkanalyzeForMissingData.checked = !!settings.analyzeForMissingData;
			chkanalyzeForMissingData.addEventListener('change', e => {
				settings.analyzeForMissingData = chkanalyzeForMissingData.checked;
				saveSettings();
				if (newPortals.length > 0) {
					checkNewPortals();
				}
			});

			const chkcenterMapOnClick = div.querySelector('#chkcenterMapOnClick');
			chkcenterMapOnClick.checked = settings.centerMapOnClick;
			chkcenterMapOnClick.addEventListener('change', e => {
				settings.centerMapOnClick = chkcenterMapOnClick.checked;
				saveSettings();
			});

			const PogoEditColors = div.querySelector('#PogoEditColors');
			PogoEditColors.addEventListener('click', function (e) {
				editColors();
				e.preventDefault();
				return false;
			});
		}

		function editColors() {
			const selectRow = `<p class='pogo-colors'>{{title}}<br>
				Color: <input type='color' id='{{id}}Color'> Opacity: <select id='{{id}}Opacity'>
				<option value=0>0</option>
				<option value=0.1>0.1</option>
				<option value=0.2>0.2</option>
				<option value=0.3>0.3</option>
				<option value=0.4>0.4</option>
				<option value=0.5>0.5</option>
				<option value=0.6>0.6</option>
				<option value=0.7>0.7</option>
				<option value=0.8>0.8</option>
				<option value=0.9>0.9</option>
				<option value=1>1</option>
				</select>{{width}}</p>`;

			const html =
				selectRow.replace('{{title}}', '1st Grid').replace('{{width}}', ` Width: <input type='number' min='1' max='8' id='{{id}}Width' size='2'> `).replace(/{{id}}/g, 'grid0') +
				selectRow.replace('{{title}}', '2nd Grid').replace('{{width}}', ` Width: <input type='number' min='1' max='8' id='{{id}}Width' size='2'> `).replace(/{{id}}/g, 'grid1') +
				selectRow.replace('{{title}}', 'Cells with extra gyms').replace(/{{id}}/g, 'cellsExtraGyms').replace('{{width}}', '') +
				selectRow.replace('{{title}}', 'Cells with missing gyms').replace(/{{id}}/g, 'cellsMissingGyms').replace('{{width}}', '') +
				selectRow.replace('{{title}}', `Cell ${poiCellLevel} with a gym or stop`).replace(/{{id}}/g, 'cell17Filled').replace('{{width}}', '') +
				selectRow.replace('{{title}}', `Cell ${gymCellLevel} with 3 gyms`).replace(/{{id}}/g, 'cell14Filled').replace('{{width}}', '') +
				selectRow.replace('{{title}}', '20m submit radius border').replace(/{{id}}/g, 'nearbyCircleBorder').replace('{{width}}', '') +
				selectRow.replace('{{title}}', '20m submit radius fill').replace(/{{id}}/g, 'nearbyCircleFill').replace('{{width}}', '') +
				selectRow.replace('{{title}}', '1 more stop to get a gym').replace(/{{id}}/g, 'missingStops1').replace('{{width}}', '') +
				selectRow.replace('{{title}}', '2 more stops to get a gym').replace(/{{id}}/g, 'missingStops2').replace('{{width}}', '') +
				selectRow.replace('{{title}}', '3 more stops to get a gym').replace(/{{id}}/g, 'missingStops3').replace('{{width}}', '') +
				'<a id="resetColorsLink">Reset all colors</a>'
				;

			const container = dialog({
				id: 's2Colors',
				width: 'auto',
				html: html,
				title: 'PoGo Grid Colors'
			});

			const div = container[0];

			const updatedSetting = function (id) {
				saveSettings();
				if (id == 'nearbyCircleBorder' || id == 'nearbyCircleFill') {
					redrawNearbyCircles();
				} else {
					updateMapGrid();
				}
			};

			const configureItems = function (key, item, id) {
				if (!id)
					id = item;

				const entry = settings[key][item];
				const select = div.querySelector('#' + id + 'Opacity');
				select.value = entry.opacity;
				select.addEventListener('change', function (event) {
					settings[key][item].opacity = select.value;
					updatedSetting(id);
				});

				const input = div.querySelector('#' + id + 'Color');
				input.value = entry.color;
				input.addEventListener('change', function (event) {
					settings[key][item].color = input.value;
					updatedSetting(id);
				});

				if (entry.width != null) {
					const widthInput = div.querySelector('#' + id + 'Width');
					widthInput.value = entry.width;
					widthInput.addEventListener('change', function (event) {
						settings[key][item].width = widthInput.value;
						updatedSetting(id);
					});
				}
			};

			configureItems('grids', 0, 'grid0');
			configureItems('grids', 1, 'grid1');
			configureItems('colors', 'cellsExtraGyms');
			configureItems('colors', 'cellsMissingGyms');
			configureItems('colors', 'cell17Filled');
			configureItems('colors', 'cell14Filled');
			configureItems('colors', 'nearbyCircleBorder');
			configureItems('colors', 'nearbyCircleFill');
			configureItems('colors', 'missingStops1');
			configureItems('colors', 'missingStops2');
			configureItems('colors', 'missingStops3');

			const resetColorsLink = div.querySelector('#resetColorsLink');
			resetColorsLink.addEventListener('click', function () {
				container.dialog('close');
				resetColors();
				updatedSetting('nearbyCircleBorder');
				updatedSetting();
				editColors();
			});
		}

		/**
		 * Refresh the S2 grid over the map
		 */
		function updateMapGrid() {
			// preconditions
			if (!map.hasLayer(regionLayer)) {
				return;
			}
			const zoom = map.getZoom();

			// first draw nearby circles at the bottom
			if (zoom > 16) {
				if (!regionLayer.hasLayer(nearbyLayerGroup)) {
					regionLayer.addLayer(nearbyLayerGroup);
				}
				nearbyLayerGroup.bringToBack();
			} else if (regionLayer.hasLayer(nearbyLayerGroup)) {
				regionLayer.removeLayer(nearbyLayerGroup);
			}

			// shade level 14 and level 17 cells
			let cellsCloseToThreshold;
			if (settings.highlightGymCandidateCells && zoom > 14) {
				cellsCloseToThreshold = updateCandidateCells(zoom);
				if (!regionLayer.hasLayer(cellLayerGroup)) {
					regionLayer.addLayer(cellLayerGroup);
				}
				cellLayerGroup.bringToBack();
			} else if (regionLayer.hasLayer(cellLayerGroup)) {
				regionLayer.removeLayer(cellLayerGroup);
			}

			// then draw the cell grid
			if (zoom > 4) {
				drawCellGrid(zoom);

				// update cell grid with cells close to a threshold for a gym
				if (cellsCloseToThreshold) {
					// draw missing cells in reverse order
					for (let missingStops = 3; missingStops >= 1; missingStops--) {
						const color = settings.colors['missingStops' + missingStops].color;
						const opacity = settings.colors['missingStops' + missingStops].opacity;
						cellsCloseToThreshold[missingStops].forEach(cell => gridLayerGroup.addLayer(drawCell(cell, color, 3, opacity)));
					}
				}

				if (!regionLayer.hasLayer(gridLayerGroup)) {
					regionLayer.addLayer(gridLayerGroup);
				}
			} else if (regionLayer.hasLayer(gridLayerGroup)) {
				regionLayer.removeLayer(gridLayerGroup);
			}

			// update gym centers
			if (settings.highlightGymCenter && zoom > 16) {
				updateGymCenters();
				if (!regionLayer.hasLayer(gymCenterLayerGroup)) {
					regionLayer.addLayer(gymCenterLayerGroup);
				}
			} else if (regionLayer.hasLayer(gymCenterLayerGroup)) {
				regionLayer.removeLayer(gymCenterLayerGroup);
			}
		}

		function getLatLngPoint(data) {
			const result = {
				lat: typeof data.lat == 'function' ? data.lat() : data.lat,
				lng: typeof data.lng == 'function' ? data.lng() : data.lng
			};

			return result;
		}

		/**
		 * Highlight cells that are missing a few stops to get another gym. Also fills level 17 cells with a stop/gym.
		 * based on data from https://www.reddit.com/r/TheSilphRoad/comments/7ppb3z/gyms_pok%C3%A9stops_and_s2_cells_followup_research/
		 * Cut offs: 2, 6, 20
		 */
		function updateCandidateCells(zoom) {
			cellLayerGroup.clearLayers();

			// All cells with items
			const allCells = groupByCell(gymCellLevel);

			const bounds = map.getBounds();
			const seenCells = {};
			const cellsCloseToThreshold = {
				1: [],
				2: [],
				3: []
			};

			const drawCellAndNeighbors = function (cell) {
				const cellStr = cell.toString();

				if (!seenCells[cellStr]) {
					// cell not visited - flag it as visited now
					seenCells[cellStr] = true;

					if (isCellOnScreen(bounds, cell)) {
						// on screen - draw it
						const cellData = allCells[cellStr];
						if (cellData) {
							// check for errors
							const missingGyms = computeMissingGyms(cellData);
							if (missingGyms > 0 && !ignoredCellsMissingGyms[cellStr]) {
								cellLayerGroup.addLayer(fillCell(cell, settings.colors.cellsMissingGyms.color, settings.colors.cellsMissingGyms.opacity));
							} else if (missingGyms < 0 && !ignoredCellsExtraGyms[cellStr]) {
								cellLayerGroup.addLayer(fillCell(cell, settings.colors.cellsExtraGyms.color, settings.colors.cellsExtraGyms.opacity));
								if (!cellsExtraGyms[cellStr]) {
									cellsExtraGyms[cellStr] = true;
									updateCounter('extraGyms', Object.keys(cellsExtraGyms));
								}
							}

							// shade filled level 17 cells
							if (zoom > 15) {
								const subCells = {};

								const coverLevel17Cell = function (point) {
									const cell = S2.S2Cell.FromLatLng(point, poiCellLevel);
									const cellId = cell.toString();
									if (subCells[cellId])
										return;
									subCells[cellId] = true;
									cellLayerGroup.addLayer(fillCell(cell, settings.colors.cell17Filled.color, settings.colors.cell17Filled.opacity));
								};

								cellData.gyms.forEach(coverLevel17Cell);
								cellData.stops.forEach(coverLevel17Cell);
							}

							// number of stops to next gym
							const missingStops = computeMissingStops(cellData);
							switch (missingStops) {
								case 0:
									if (missingGyms <= 0) {
										cellLayerGroup.addLayer(fillCell(cell, settings.colors.cell14Filled.color, settings.colors.cell14Filled.opacity));
									}
									break;
								case 1:
								case 2:
								case 3:
									cellsCloseToThreshold[missingStops].push(cell);
									break;
								default:
									break;
							}
							cellLayerGroup.addLayer(writeInCell(cell, missingStops));
						}

						// and recurse to our neighbors
						const neighbors = cell.getNeighbors();
						for (let i = 0; i < neighbors.length; i++) {
							drawCellAndNeighbors(neighbors[i]);
						}
					}
				}
			};

			const cell = S2.S2Cell.FromLatLng(getLatLngPoint(map.getCenter()), gymCellLevel);
			drawCellAndNeighbors(cell);

			return cellsCloseToThreshold;
		}

		function drawCellGrid(zoom) {
			// clear, to redraw
			gridLayerGroup.clearLayers();
			countLayer.clearLayers();

			const bounds = map.getBounds();
			const seenCells = {};
			const drawCellAndNeighbors = function (cell, color, width, opacity) {
				const cellStr = cell.toString();

				if (!seenCells[cellStr]) {
					// cell not visited - flag it as visited now
					seenCells[cellStr] = true;

					if (isCellOnScreen(bounds, cell)) {
						// on screen - draw it
						gridLayerGroup.addLayer(drawCell(cell, color, width, opacity));

						// show number of PoI in the cell
						const cellGroup = cellsPortals[cellStr];
						if (cellGroup)
							countLayer.addLayer(writeInCell(cell, Object.keys(cellGroup.portals).length));

						// and recurse to our neighbors
						const neighbors = cell.getNeighbors();
						for (let i = 0; i < neighbors.length; i++) {
							drawCellAndNeighbors(neighbors[i], color, width, opacity);
						}
					}
				}
			};

			for (let i = settings.grids.length - 1; i >= 0; --i) {
				const grid = settings.grids[i];
				const gridLevel = grid.level;
				if (gridLevel >= 6 && gridLevel < (zoom + 2)) {
					const cell = S2.S2Cell.FromLatLng(getLatLngPoint(map.getCenter()), gridLevel);
					drawCellAndNeighbors(cell, grid.color, grid.width, grid.opacity);
				}
			}
		}

		/**
		 * Draw a cross to the center of level 20 cells that have a Gym to check better EX locations
		 */
		function updateGymCenters() {
			// clear
			gymCenterLayerGroup.clearLayers();

			const visibleGyms = filterItemsByMapBounds(gyms);
			const level = 20;

			Object.keys(visibleGyms).forEach(id => {
				const gym = gyms[id];
				const cell = S2.S2Cell.FromLatLng(gym, level);
				const corners = cell.getCornerLatLngs();
				// center point
				const center = cell.getLatLng();

				const style = {fill: false, color: 'red', opacity: 0.8, weight: 1, clickable: false, interactive: false};
				const line1 = L.polyline([corners[0], corners[2]], style);
				gymCenterLayerGroup.addLayer(line1);

				const line2 = L.polyline([corners[1], corners[3]], style);
				gymCenterLayerGroup.addLayer(line2);

				const circle = L.circle(center, 1, style);
				gymCenterLayerGroup.addLayer(circle);
			});
		}

		// Computes how many new stops must be added to the L14 Cell to get a new Gym
		function computeMissingStops(cellData) {
			const gyms = cellData.gyms.length;
			// exclude from the count those pokestops that have been marked as missing photos
			const validStops = cellData.stops.filter(p => typeof p.photos == 'undefined' || p.photos > 0);
			const sum = gyms + validStops.length;
			if (sum < 2 && gyms == 0)
				return 2 - sum;

			if (sum < 6 && gyms < 2)
				return 6 - sum;

			if (sum < 20 && gyms < 3)
				return 20 - sum;

			// No options to more gyms ATM.
			return 0;
		}

		// Checks if the L14 cell has enough Gyms and Stops and one of the stops should be marked as a Gym
		// If the result is negative then it has extra gyms
		function computeMissingGyms(cellData) {
			const totalGyms = cellData.gyms.length;
			// exclude from the count those pokestops that have been marked as missing photos
			const validStops = cellData.stops.filter(p => typeof p.photos == 'undefined' || p.photos > 0);
			const sum = totalGyms + validStops.length;
			if (sum < 2)
				return 0 - totalGyms;

			if (sum < 6)
				return 1 - totalGyms;

			if (sum < 20)
				return 2 - totalGyms;

			return 3 - totalGyms;
		}

		function drawCell(cell, color, weight, opacity) {
			// corner points
			const corners = cell.getCornerLatLngs();

			// the level 6 cells have noticible errors with non-geodesic lines - and the larger level 4 cells are worse
			// NOTE: we only draw two of the edges. as we draw all cells on screen, the other two edges will either be drawn
			// from the other cell, or be off screen so we don't care
			const region = L.geodesicPolyline([corners[0], corners[1], corners[2], corners[3], corners[0]], {fill: false, color: color, opacity: opacity, weight: weight, clickable: false, interactive: false});

			return region;
		}

		function fillCell(cell, color, opacity) {
			// corner points
			const corners = cell.getCornerLatLngs();

			const region = L.polygon(corners, {color: color, fillOpacity: opacity, weight: 0, clickable: false, interactive: false});

			return region;
		}

		/**
		*	Writes a text in the center of a cell
		*/
		function writeInCell(cell, text) {
			// center point
			let center = cell.getLatLng();

			let marker = L.marker(center, {
				icon: L.divIcon({
					className: 'pogo-text',
					iconAnchor: [25, 5],
					iconSize: [50, 10],
					html: text
				})
			});
			// fixme, maybe add some click handler
			marker.on('click', function () {
				displayCellSummary(cell);
			});
			return marker;
		}

		/**
		Show a summary with the pokestops and gyms of a L14 Cell
		*/
		function displayCellSummary(cell) {
			const cellStr = cell.toString();

			const allCells = groupByCell(gymCellLevel);
			const cellData = allCells[cellStr];
			if (!cellData)
				return;

			function updateScore(portal, wrapper) {
				const photos = typeof portal.photos == 'undefined' ? 1 : portal.photos;
				const votes = photos == 0 || typeof portal.votes == 'undefined' ? 0 : portal.votes;
				const score = photos + votes;
				wrapper.querySelector('.Pogo_Score').textContent = score;
			}

			function dumpGroup(data, title, useHeader) {
				const div = document.createElement('div');
				const header = document.createElement('h3');
				if (useHeader) {
					header.className = 'header';
					header.innerHTML = '<span>' + title + ' (' + data.length + ')</span><span>Photos</span><span>Votes</span><span>Score</span>';
				} else {
					header.textContent = title + ' (' + data.length + ')';
				}
				div.appendChild(header);

				data.sort(sortByName).forEach(portal => {
					const wrapper = document.createElement('div');
					wrapper.setAttribute('data-guid', portal.guid);
					wrapper.className = 'PortalSummary';
					const img = getPortalImage(portal);
					let scoreData = '';

					if (title == 'Pokestops' || title == 'Portals') {
						const photos = typeof portal.photos == 'undefined' ? 1 : portal.photos;
						const votes = typeof portal.votes == 'undefined' ? 0 : portal.votes;
						scoreData = '<span><input type="number" min=0 value=' + photos + ' title="Total number of photos of this portal" class="Pogo_Photos"></span>' +
						'<span><input type="number" min=0 value=' + votes + ' title="Total sum of votes in the portal" class="Pogo_Votes"></span>' +
						'<span class="Pogo_Score" title="Gym score: The pokestops with highest score will become the next gym">' + (photos + votes) + '</span>';
					}
					wrapper.innerHTML = '<span class="PogoName">' + img + '</span>' +
						'<span>' + getPortalName(portal) + '</span>' +
						scoreData
					;

					if (scoreData != '') {
						wrapper.querySelector('.Pogo_Photos').addEventListener('input', function () {
							const update = portal.photos !== this.valueAsNumber && (portal.photos === 0 || this.valueAsNumber === 0);
							portal.photos = this.valueAsNumber;
							updateScore(portal, wrapper);
							saveStorage();
							if (update) {
								refreshPokestopMissingPhotoStatus(portal);
								updateMapGrid();
							}
						});
						wrapper.querySelector('.Pogo_Votes').addEventListener('input', function () {
							portal.votes = this.valueAsNumber;
							updateScore(portal, wrapper);
							saveStorage();
						});
					}

					div.appendChild(wrapper);
				});
				return div;
			}

			const div = document.createElement('div');
			div.appendChild(dumpGroup(cellData.gyms, 'Gyms'));
			div.appendChild(dumpGroup(cellData.stops, 'Pokestops', true));
			//div.appendChild(dumpGroup(cellData.notClassified, 'Other portals')); They don't matter, they have been removed from Pokemon
			//div.appendChild(dumpGroup(cellData.portals, 'Portals', true)); FIXME: portals from Ingress that are hidden in Pokemon
			div.className = 'PogoListing';
			const width = Math.min(screen.availWidth, 420);
			const container = dialog({
				id: 'PokemonList',
				html: div,
				width: width + 'px',
				title: 'List of Pokestops and Gyms'
			});

			configureHoverMarker(container);
		}

		// ***************************
		// IITC code
		// ***************************

		// ensure plugin framework is there, even if iitc is not yet loaded
		if (typeof window.plugin !== 'function') {
			window.plugin = function () {};
		}

		// PLUGIN START

		// use own namespace for plugin
		window.plugin.pogo = function () {};

		const thisPlugin = window.plugin.pogo;
		const KEY_STORAGE = 'plugin-pogo';
		const KEY_SETTINGS = 'plugin-pogo-settings';

		// Update the localStorage
		function saveStorage() {
			createThrottledTimer('saveStorage', function () {
				localStorage[KEY_STORAGE] = JSON.stringify({
					gyms: cleanUpExtraData(gyms),
					pokestops: cleanUpExtraData(pokestops),
					notpogo: cleanUpExtraData(notpogo),
					ignoredCellsExtraGyms: ignoredCellsExtraGyms,
					ignoredCellsMissingGyms: ignoredCellsMissingGyms
				});
			});
		}

		/**
		 * Create a new object where the extra properties of each pokestop/gym have been removed. Store only the minimum.
		 */
		function cleanUpExtraData(group) {
			let newGroup = {};
			Object.keys(group).forEach(id => {
				const data = group[id];
				const newData = {
					guid: data.guid,
					lat: data.lat,
					lng: data.lng,
					name: data.name
				};

				if (data.isEx)
					newData.isEx = data.isEx;

				if (data.medal)
					newData.medal = data.medal;

				if (typeof data.photos != 'undefined')
					newData.photos = data.photos;

				if (data.votes)
					newData.votes = data.votes;

				newGroup[id] = newData;
			});
			return newGroup;
		}

		// Load the localStorage
		thisPlugin.loadStorage = function () {
			const tmp = JSON.parse(localStorage[KEY_STORAGE] || '{}');
			gyms = tmp.gyms || {};
			pokestops = tmp.pokestops || {};
			notpogo = tmp.notpogo || {};
			ignoredCellsExtraGyms = tmp.ignoredCellsExtraGyms || {};
			ignoredCellsMissingGyms = tmp.ignoredCellsMissingGyms || {};
		};

		thisPlugin.createEmptyStorage = function () {
			gyms = {};
			pokestops = {};
			notpogo = {};
			ignoredCellsExtraGyms = {};
			ignoredCellsMissingGyms = {};
			saveStorage();

			allPortals = {};
			newPortals = {};

			movedPortals = [];
			missingPortals = {};
		};

		/*************************************************************************/

		thisPlugin.findByGuid = function (guid) {
			if (gyms[guid]) {
				return {'type': 'gyms', 'store': gyms};
			}
			if (pokestops[guid]) {
				return {'type': 'pokestops', 'store': pokestops};
			}
			if (notpogo[guid]) {
				return {'type': 'notpogo', 'store': notpogo};
			}
			return null;
		};

		// Append a 'star' flag in sidebar.
		thisPlugin.onPortalSelectedPending = false;
		thisPlugin.onPortalSelected = function () {
			$('.pogoStop').remove();
			$('.pogoGym').remove();
			$('.notPogo').remove();
			const portalDetails = document.getElementById('portaldetails');
			portalDetails.classList.remove('isGym');

			if (window.selectedPortal == null) {
				return;
			}

			if (!thisPlugin.onPortalSelectedPending) {
				thisPlugin.onPortalSelectedPending = true;

				setTimeout(function () { // the sidebar is constructed after firing the hook
					thisPlugin.onPortalSelectedPending = false;

					$('.pogoStop').remove();
					$('.pogoGym').remove();
					$('.notPogo').remove();

					// Show PoGo icons in the mobile status-bar
					if (thisPlugin.isSmart) {
						document.querySelector('.PogoStatus').innerHTML = thisPlugin.htmlStar;
						$('.PogoStatus > a').attr('title', '');
					}

					$(portalDetails).append('<div class="PogoButtons">Pokemon Go: ' + thisPlugin.htmlStar + '</div>' +
						`<div id="PogoGymInfo">
						<label for='PogoGymMedal'>Medal:</label> <select id='PogoGymMedal'>
								<option value='None'>None</option>
								<option value='Bronze'>Bronze</option>
								<option value='Silver'>Silver</option>
								<option value='Gold'>Gold</option>
								</select><br>
						<label>Is this an EX gym? <input type='checkbox' id='PogoGymEx'> Yes</label><br>
					</div>`);

					document.getElementById('PogoGymMedal').addEventListener('change', ev => {
						const guid = window.selectedPortal;
						const icon = document.getElementById('gym' + guid.replace('.', ''));
						// remove styling of gym marker
						if (icon) {
							icon.classList.remove(gyms[guid].medal + 'Medal');
						}
						gyms[guid].medal = ev.target.value;
						saveStorage();
						// update gym marker
						if (icon) {
							icon.classList.add(gyms[guid].medal + 'Medal');
						}
					});

					document.getElementById('PogoGymEx').addEventListener('change', ev => {
						const guid = window.selectedPortal;
						const icon = document.getElementById('gym' + guid.replace('.', ''));
						gyms[guid].isEx = ev.target.checked;
						saveStorage();
						// update gym marker
						if (icon) {
							icon.classList[gyms[guid].isEx ? 'add' : 'remove']('exGym');
						}
					});

					thisPlugin.updateStarPortal();
				}, 0);
			}
		};

		// Update the status of the star (when a portal is selected from the map/pogo-list)
		thisPlugin.updateStarPortal = function () {
			$('.pogoStop').removeClass('favorite');
			$('.pogoGym').removeClass('favorite');
			$('.notPogo').removeClass('favorite');
			document.getElementById('portaldetails').classList.remove('isGym');

			const guid = window.selectedPortal;
			// If current portal is into pogo: select pogo portal from portals list and select the star
			const pogoData = thisPlugin.findByGuid(guid);
			if (pogoData) {
				if (pogoData.type === 'pokestops') {
					$('.pogoStop').addClass('favorite');
				}
				if (pogoData.type === 'gyms') {
					$('.pogoGym').addClass('favorite');
					document.getElementById('portaldetails').classList.add('isGym');
					const gym = gyms[guid];
					if (gym.medal) {
						document.getElementById('PogoGymMedal').value = gym.medal;
					}
					document.getElementById('PogoGymEx').checked = gym.isEx;

				}
				if (pogoData.type === 'notpogo') {
					$('.notPogo').addClass('favorite');
				}
			}
		};

		function removePogoObject(type, guid) {
			if (type === 'pokestops') {
				delete pokestops[guid];
				const starInLayer = stopLayers[guid];
				stopLayerGroup.removeLayer(starInLayer);
				delete stopLayers[guid];
			}
			if (type === 'gyms') {
				delete gyms[guid];
				const gymInLayer = gymLayers[guid];
				gymLayerGroup.removeLayer(gymInLayer);
				delete gymLayers[guid];
			}
			if (type === 'notpogo') {
				delete notpogo[guid];
			}
		}

		// Switch the status of the star
		thisPlugin.switchStarPortal = function (type) {
			const guid = window.selectedPortal;

			// It has been manually classified, remove from the detection
			if (newPortals[guid])
				delete newPortals[guid];

			// If portal is saved in pogo: Remove this pogo
			const pogoData = thisPlugin.findByGuid(guid);
			if (pogoData) {
				const existingType = pogoData.type;
				removePogoObject(existingType, guid);

				saveStorage();
				thisPlugin.updateStarPortal();

				// Get portal name and coordinates
				const p = window.portals[guid];
				const ll = p.getLatLng();
				if (existingType !== type) {
					thisPlugin.addPortalpogo(guid, ll.lat, ll.lng, p.options.data.title, type);
				}
				// we've changed one item from pogo, if the cell was marked as ignored, reset it.
				if ((type == 'gyms' || existingType == 'gyms') && updateExtraGymsCells(ll.lat, ll.lng))
					saveStorage();
			} else {
				// If portal isn't saved in pogo: Add this pogo

				// Get portal name and coordinates
				const portal = window.portals[guid];
				const latlng = portal.getLatLng();
				thisPlugin.addPortalpogo(guid, latlng.lat, latlng.lng, portal.options.data.title, type);
			}

			if (settings.highlightGymCandidateCells) {
				updateMapGrid();
			}
		};

		// Add portal
		thisPlugin.addPortalpogo = function (guid, lat, lng, name, type) {
			// Add pogo in the localStorage
			const obj = {'guid': guid, 'lat': lat, 'lng': lng, 'name': name};

			// prevent that it would trigger the missing portal detection if it's in our data
			if (window.portals[guid]) {
				obj.exists = true;
			}

			if (type == 'gyms') {
				updateExtraGymsCells(lat, lng);
				gyms[guid] = obj;
			}
			if (type == 'pokestops') {
				pokestops[guid] = obj;
			}
			if (type == 'notpogo') {
				notpogo[guid] = obj;
			}

			saveStorage();
			thisPlugin.updateStarPortal();

			thisPlugin.addStar(guid, lat, lng, name, type);
		};

		/**
		 * An item has been changed in a cell, check if the cell should no longer be ignored
		 */
		function updateExtraGymsCells(lat, lng) {
			if (Object.keys(ignoredCellsExtraGyms).length == 0 && Object.keys(ignoredCellsMissingGyms).length == 0)
				return false;

			const cell = S2.S2Cell.FromLatLng(new L.LatLng(lat, lng), gymCellLevel);
			const cellId = cell.toString();
			if (ignoredCellsExtraGyms[cellId]) {
				delete ignoredCellsExtraGyms[cellId];
				return true;
			}
			if (ignoredCellsMissingGyms[cellId]) {
				delete ignoredCellsMissingGyms[cellId];
				return true;
			}
			return false;
		}

		/*
			OPTIONS
		*/
		// Manual import, export and reset data
		thisPlugin.pogoActionsDialog = function () {
			const content = `<div id="pogoSetbox">
				<a id="save-dialog" title="Select the data to save from the info on screen">Save...</a>
				<a onclick="window.plugin.pogo.optReset();return false;" title="Deletes all Pokemon Go markers">Reset PoGo portals</a>
				<a onclick="window.plugin.pogo.optImport();return false;" title="Import a JSON file with all the PoGo data">Import Gyms & Pokestops</a>
				<a onclick="window.plugin.pogo.optExport();return false;" title="Exports a JSON file with all the PoGo data">Export Gyms & Pokestops</a>
				</div>`;

			const container = dialog({
				html: content,
				title: 'S2 & Pokemon Actions'
			});

			const div = container[0];
			div.querySelector('#save-dialog').addEventListener('click', e => saveDialog());
		};

		function saveDialog() {
			const content = `<div>
				<p>Select the data to save from the info on screen</p>
				<fieldset><legend>Which data?</legend>
				<input type='radio' name='PogoSaveDataType' value='Gyms' id='PogoSaveDataTypeGyms'><label for='PogoSaveDataTypeGyms'>Gyms</label><br>
				<input type='radio' name='PogoSaveDataType' value='PokeStopsGyms' id='PogoSaveDataTypePokeStopsGyms'><label for='PogoSaveDataTypePokeStopsGyms'>Pokestops + Gyms</label>
				</fieldset>
				<fieldset><legend>Format</legend>
				<input type='radio' name='PogoSaveDataFormat' value='CSV' id='PogoSaveDataFormatCSV'><label for='PogoSaveDataFormatCSV'>CSV</label><br>
				<input type='radio' name='PogoSaveDataFormat' value='JSON' id='PogoSaveDataFormatJSON'><label for='PogoSaveDataFormatJSON'>JSON</label>
				</fieldset>
				</div>`;

			const container = dialog({
				html: content,
				title: 'Save visible data',
				buttons: {
					'Save': function () {
						const SaveDataType = document.querySelector('input[name="PogoSaveDataType"]:checked').value;
						const SaveDataFormat = document.querySelector('input[name="PogoSaveDataFormat"]:checked').value;

						settings.saveDataType = SaveDataType;
						settings.saveDataFormat = SaveDataFormat;
						saveSettings();

						container.dialog('close');

						let filename = (SaveDataType == 'Gyms' ? 'gyms_' : 'gyms+stops_') + new Date().toISOString().substr(0, 19).replace(/[\D]/g, '_');
						if (SaveDataFormat == 'CSV') {
							filename += '.csv';
							const allData = SaveDataType == 'Gyms' ? gyms : Object.assign({}, gyms, pokestops);
							const data = filterItemsByMapBounds(allData);
							const keys = Object.keys(data);
							const contents = keys.map(id => {
								const gym = data[id];
								return (gym.name ? gym.name.replace(/,/g, ' ') + ',' : '') + gym.lat + ',' + gym.lng;
							});

							saveToFile(contents.join('\n'), filename);
						} else {
							filename += '.json';
							const data = {
								gyms: findPhotos(cleanUpExtraData(filterItemsByMapBounds(gyms)))
							};
							if (SaveDataType != 'Gyms')
								data.pokestops = findPhotos(cleanUpExtraData(filterItemsByMapBounds(pokestops)));

							saveToFile(JSON.stringify(data), filename);
						}
					}
				}

			});

			// Remove ok button
			const outer = container.parent();
			outer.find('.ui-dialog-buttonset button:first').remove();

			const div = container[0];
			div.querySelector('#PogoSaveDataType' + settings.saveDataType).checked = true;
			div.querySelector('#PogoSaveDataFormat' + settings.saveDataFormat).checked = true;
		}

		thisPlugin.optAlert = function (message) {
			$('.ui-dialog .ui-dialog-buttonset').prepend('<p class="pogo-alert" style="float:left;margin-top:4px;">' + message + '</p>');
			$('.pogo-alert').delay(2500).fadeOut();
		};

		thisPlugin.optExport = function () {
			saveToFile(localStorage[KEY_STORAGE], 'IITC-pogo.json');
		};

		thisPlugin.optImport = function () {
			readFromFile(function (content) {
				try {
					const list = JSON.parse(content); // try to parse JSON first
					let importExStatus = true;
					let importGymMedal = true;
					Object.keys(list).forEach(type => {
						for (let idpogo in list[type]) {
							const item = list[type][idpogo];
							const lat = item.lat;
							const lng = item.lng;
							const name = item.name;
							let guid = item.guid;
							if (!guid) {
								guid = findPortalGuidByPositionE6(lat * 1E6, lng * 1E6);
								if (!guid) {
									console.log('portal guid not found', name, lat, lng); // eslint-disable-line no-console
									guid = idpogo;
								}
							}

							if (typeof lat !== 'undefined' && typeof lng !== 'undefined' && name && !thisPlugin.findByGuid(guid)) {
								thisPlugin.addPortalpogo(guid, lat, lng, name, type);
								if (type == 'gyms') {
									if (importExStatus && item.isEx) {
										gyms[guid].isEx = true;
									}
									// don't overwrite existing medals
									if (importGymMedal && !gyms[guid].medal) {
										gyms[guid].medal = item.medal;
									}
								}
							}
						}
					});

					thisPlugin.updateStarPortal();
					thisPlugin.resetAllMarkers();
					thisPlugin.optAlert('Successful.');
				} catch (e) {
					console.warn('pogo: failed to import data: ' + e); // eslint-disable-line no-console
					thisPlugin.optAlert('<span style="color: #f88">Import failed</span>');
				}
			});
		};

		thisPlugin.optReset = function () {
			if (confirm('All pogo will be deleted. Are you sure?', '')) {
				delete localStorage[KEY_STORAGE];
				thisPlugin.createEmptyStorage();
				thisPlugin.updateStarPortal();
				thisPlugin.resetAllMarkers();
				if (settings.highlightGymCandidateCells) {
					updateMapGrid();
				}
				thisPlugin.optAlert('Successful.');
			}
		};

		/* POKEMON GO PORTALS LAYER */
		thisPlugin.addAllMarkers = function () {
			function iterateStore(store, type) {
				for (let idpogo in store) {
					const item = store[idpogo];
					const lat = item.lat;
					const lng = item.lng;
					const guid = item.guid;
					const name = item.name;
					if (guid != null)
						thisPlugin.addStar(guid, lat, lng, name, type);
				}
			}

			iterateStore(gyms, 'gyms');
			iterateStore(pokestops, 'pokestops');
		};

		thisPlugin.resetAllMarkers = function () {
			for (let guid in stopLayers) {
				const starInLayer = stopLayers[guid];
				stopLayerGroup.removeLayer(starInLayer);
				delete stopLayers[guid];
			}
			for (let gymGuid in gymLayers) {
				const gymInLayer = gymLayers[gymGuid];
				gymLayerGroup.removeLayer(gymInLayer);
				delete gymLayers[gymGuid];
			}
			thisPlugin.addAllMarkers();
		};

		/**
		* Update the disk color and title if the portal has no photo or switches to have at least one
		*/
		function refreshPokestopMissingPhotoStatus(portal) {
			const hasPhoto = typeof portal.photos == 'undefined' || portal.photos > 0;
			const guid = portal.guid;
			const icon = document.getElementById('pokestop' + guid.replace('.', ''));
			if (icon) {
				icon.classList.toggle('missingPhoto', !hasPhoto);
				icon.title = portal.name + (!hasPhoto ? '\r\n<br>Missing Photo, add one to make it count for Gym creation.' : '');
			}
		}

		thisPlugin.addStar = function (guid, lat, lng, name, type) {
			let star;
			if (type === 'pokestops') {
				const pokestop = pokestops[guid];
				const hasPhoto = typeof pokestop.photos == 'undefined' || pokestop.photos > 0;

				star = new L.Marker.SVGMarker([lat, lng], {
					title: name + (!hasPhoto ? '\r\n<br>Missing Photo, add one to make it count for Gym creation.' : ''),
					iconOptions: {
						className: 'pokestop' + (!hasPhoto ? ' missingPhoto' : ''),
						html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 821.52 1461.152">
							<path class="pokestop-circle" d="M410.76 0C203.04.14 30.93 152.53 0 351.61l211.27.39c26.99-84.43 106.09-145.55 199.49-145.6 93.25.11 172.24 61.13 199.33 145.41l211.2.19C790.58 152.8 618.51.26 410.76 0zm0 280c-75.11 0-136 60.89-136 136s60.89 136 136 136 136-60.89 136-136-60.89-136-136-136zM.23 480c30.71 199.2 202.78 351.74 410.53 352 207.72-.14 379.83-152.53 410.76-351.61L610.25 480c-26.99 84.43-106.09 145.55-199.49 145.6-93.25-.11-172.24-61.13-199.33-145.41z"/>
							<path class="pokestop-pole" d="M380.387 818.725h65.085v465.159h-65.085z" stroke-width="4.402"/>
							<ellipse class="pokestop-base" cx="415.185" cy="1345.949" rx="305.686" ry="115.202" stroke-width="6"/>
							</svg>`,
						iconSize: L.point(24, 32),
						iconAnchor: [12, 30],
						id: 'pokestop' + guid.replace('.', '')
					}
				});

			}
			if (type === 'gyms') {
				// icon from https://github.com/FortAwesome/Font-Awesome/issues/9685#issuecomment-239238656
				const gym = gyms[guid];
				const medal = gym.medal || 'None';
				const className = medal + 'Medal' + (gym.isEx ? ' exGym' : '');
				star = new L.Marker.SVGMarker([lat, lng], {
					title: name,
					iconOptions: {
						className: className,
						html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 375 410"><g transform="translate(-62 -45)">
				<path class="gym-main-outline" d="M436.23 45.87C368.38 181.94 300.54 318.02 232.7 454.09c-12.48-46.6-24.97-93.19-37.45-139.78l-1.67-6.2s-7.37-.21-12.03-.72c-57.77-3.97-109.7-50.53-117.27-107.86-11.31-57.8 25.24-118.19 79.1-139.79 57.74-24.6 130.02 2.07 160 56.72 39.96-20.87 80.14-42.63 120.19-63.84z" />
				<g class='gym-inner'><path class="ball-outline-top" d="M286.17 115.42l-59.41 31.59a48.157 48.157 0 0 0-35.7-15.96c-26.61 0-48.17 21.57-48.17 48.17.02 3.91.51 7.81 1.47 11.6l-59.45 31.62c-5.61-13.72-8.51-28.4-8.53-43.22 0-63.34 51.34-114.68 114.68-114.68 38.2.06 73.86 19.13 95.11 50.88z"/>
				<path d="M404.7 78.26L297.06 135.6l-59.42 31.6a48.252 48.252 0 0 1 1.58 12.02c0 26.6-21.56 48.16-48.16 48.16a48.138 48.138 0 0 1-36-16.27l-59.35 31.56c21.21 31.94 57 51.17 95.35 51.23 4.26-.02 8.52-.28 12.76-.77l32.78 122.31z" class="ball-outline-bottom"/>
				<path class="ball-outline-center" d="M191.06 144.82c19 0 34.4 15.4 34.4 34.4s-15.4 34.4-34.4 34.4c-19.01 0-34.41-15.4-34.41-34.4s15.4-34.4 34.41-34.4z"/>
				</g></g></svg>`,
						iconSize: L.point(36, 36),
						id: 'gym' + guid.replace('.', '')
					}
				});
			}

			if (!star)
				return;

			window.registerMarkerForOMS(star);
			star.on('spiderfiedclick', function () {
				// don't try to render fake portals
				if (guid.indexOf('.') > -1) {
					renderPortalDetails(guid);
				}
			});

			if (type === 'pokestops') {
				stopLayers[guid] = star;
				star.addTo(stopLayerGroup);
			}
			if (type === 'gyms') {
				gymLayers[guid] = star;
				star.addTo(gymLayerGroup);
			}
		};

		thisPlugin.setupCSS = function () {
			$('<style>').prop('type', 'text/css').html(`
		#sidebar #portaldetails h3.title{
			width:auto;
		}
		.pogoStop span,
		.pogoGym span {
			display:inline-block;
			float:left;
			margin:3px 1px 0 4px;
			width:16px;
			height:15px;
			overflow:hidden;
			background-repeat:no-repeat;
		}
		.pogoStop span, .pogoStop.favorite:focus span,
		.pogoGym span, .pogoGym.favorite:focus span {
			background-position:left top;
		}
		.pogoStop:focus span, .pogoStop.favorite span,
		.pogoGym:focus span, .pogoGym.favorite span {
			background-position:right top;
		}

		/**********************************************
			DIALOG BOX
		**********************************************/

		/*---- Options panel -----*/
		#pogoSetbox a{
			display:block;
			color:#ffce00;
			border:1px solid #ffce00;
			padding:3px 0;
			margin:10px auto;
			width:80%;
			text-align:center;
			background:rgba(8,48,78,.9);
		}
		#pogoSetbox a.disabled,
		#pogoSetbox a.disabled:hover{
			color:#666;
			border-color:#666;
			text-decoration:none;
		}

		#pogoSetbox{
			text-align:center;
		}
		.pogoStop span {
			background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAPCAMAAACyXj0lAAACZFBMVEUAAAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAABAQECAAAAAAAGAQEAAAAPDw8AAAAMAgIAAAALAQEBAQETAwMAAAAGBQUMAgISEhIAAAAWFhYBAQEWAwMAAAACAgIDAwMFBQUGBgYJCQkPDw8REREVGBgWFhYXFxchISEiIiIkICAoKCgpICAtLCwtLi4uBQUuKysuLy8vEBAvMjEyMDAzMzM0NDQ4ODg5OTk6Ojo+Pj5AQUFBS0tCSEhDQ0NISEhJSUlMTExSUlJUVFRWVlZXV1dYCwtZCwtaWlpcXFxeXl5gYGBhBgZiYmJjY2NlDAxmDAxnZ2doaGhra2tsbGxtbW1wcHBwfHtxcXFycnJ0dHR1dXV2dnZ4CQl5eXl9fX2CgoKEhISFhYWGhoaIiIiIiomJh4qKioqLi4uMjIyNjY2PiZCQkJCUlJSXBASaERGanJycBAScnJytFRWuDg6urq6wFBS2wcG3t7e4FRW5t7q6Cwu6urq7Dg6+vr7CwsLDwMTEDg7FxcXHxsfIyMjJFxfKDw/MDg7MzMzPz8/P0NDQ0NDRDw/RFxfS09XX19faGBja2trbExPc3NzlGhrl5eXo6Ojs7u7u7u7vGxvwGhrw8PDyGhry8vLz8/P0Ghr3Gxv39/f4+Pj8/Pz8/v79/f3+////HBz/HR3/Hh7///9j6e8DAAAAPnRSTlMAAAIKDBIWGBshJTI0O0tQY2VocnN1fImVnZ6lqKmrrLCxs7u8vb3G0tbW1tra39/i4uXl7Ozv7+/v8fH6+jTKPt8AAAGeSURBVHgBYwACZiFlAxMdWT4Qm5ERImBoqgsUgAAeDfe8hsbaZEd5VpACkED6rK27Nk4IAAoAAbdZVldXd3dXV5OXOgtIAbfFlFMnT5w4eXJ3IVCAgVkzGywNJJo9JIAKmLWnnwJJA9XszZBgYBD0AEp1F2fWd3W3VtpwMTIKZgDlT8yZtPnUiYPrbLkYVEuBuj3t7OxyurpbPEUYGdWWnTp5MjeuwnfqqRMHCkQYjIoqK9Psqu2jHapqyiKlGRmN5y1f3h+7vn1G8Iq1i+qkGczsgMDewS7JDgSUGBnN/fyD3Np67BaG+IUGeisx6M0/fbrELjXK0e7QsfkukoyM+jtOn17ts2R2d8zR4zsmSjIoRJ8+fdoVqLn59LYFdgKMjApzgQKTw+KjN50+vDNPgIHf7jQQLO0EEqvyzdgYGfkTQAJ7tgCJfSst2RiYVJxPQ8E0O2FgODCp9MEEticKA0OSQ9NhP5jbYCcFDmoOrY4jYIENSVLguGCXs3NKKY2wsxIDRxZIILx38ZqZ5dZAAQjgFVdUlhHlhMQmmgAAN4GpuWb98MUAAAAASUVORK5CYII=);
		}
		.pogoGym span {
			background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAPCAMAAACyXj0lAAAC7lBMVEUAAAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEAAAAAAAAAAAAAAAAAAAABAQEAAAABAQEBAQEAAAAAAAAAAAAAAAAAAAADAwMAAAAAAAABAQIAAAAAAAAAAAAAAAAAAAACAgIAAAAAAAABAAAAAAAAAAAAAAAAAAACAgIAAAAHBwcAAAACAgIAAAAbBgYBAQEBAQEZBgcAAAAAAAAAAAABAQEXFxcCAgICAgIHBAUBAQEGBgdyFRcRERFsFRYCAgIDAwMFBQUODg4EBAQFBQUREREFBQUGBgYTExMRCQoEBAQGBAVcIiYaGhoaGhsFBQUUFBRaJSgGBgYdFBgDAwMEBAQNDQ0ODg4fHyAjIyNYWFheLTEHBgcHBwgJCQkLCwsNDQ0PDw8RERESEhIUFBQVFRYWFhYXFxcYGBgZGRkZGRoaGhocHBwdHR0eHh4eHx8fHx8iIiIlJSUmJiYnJycpKSkqKiotLS0uLi4uLi8wMDAyMjIzMzM0NDQ2NjY4ODg6Ojo7Ozs7Oz09PT4+Pj4/Pz9DKS9DQ0NJSUpLS0xMTE1NTU1PT09QUFBRUVFSUlNXV1dZWVlbW1tcXFxeXl5eXl9jY2NkZGRmZmZoaGlsbG1wcHBycnJ1dXV7e3t/f3+AgYGBgYGFhYWIh4mPj4+THyGTk5SVlZWYmJqbm5ygoKCnp6irq6uvr6+wr7KwsLGxsbO1tbW3tri4t7m5ubu9HyDGxcjGxsfJJyjOzs7PHR7QIyTQ0NDR0dHSICHS0tLU1NTY2NjZ2dndIiPd3d3e3t7fIyTi4uLj4+PnICHn5+jq6urs6+zs7Ozu7u7w8PDw8PHx8fHx8fLy8fLy8vLzHR329vb29vf39/j4+Pj5+fn6Hh76Hx/7+/v7+/z8Hx/8/Pz8/P39Hh79/f3///+f+BszAAAAcXRSTlMAAAECAwQFBwoPFhskJSYqKy4yMzU4OTw/Q0hRW1xjZGVmb294e3+Fi4+QkZibnaWmqq+2t7m+x8nKzM3Oz9HR19fd3d/h4eLk5ebm5+rq7O7v8PDy8vP09fX19/f3+Pn5+fr6/Pz8/f3+/v7+/v7+/k5HHiYAAAGUSURBVHgBY2BkFHMMizAVYmRk5NLSVAJSUg5uwYHOlmIMjFzq+soMbHrZ3WsWNyfJ8Gh7pOTxMjJKW6fd/v79S6IFn4FXciUvg3HNoqXNk5Y3ZcXXLSrVBRooW3Dvw/lTr75nZM7Yvd6dgcF37YqGxTOrayZsubkgkpOBkd3v7MddLX2zL7cef3srSoWBIWh1z6yL2zo2XH9wpRLIZeSKu3Bj4uGj03tOv/+60IaBgSG0cWrnypldO5+8nubPDLSBI6GwpGje5KoDn3/uCxAEKvBctH9Oe+/GOy83lykyABUw+aw7sbV/yt4XPx83aTEAgXzxwSeX7t78ca3DDiTPyKBQsePd/YfPP71f5crGAAJGOduP3X3/aHW6AEQBg1ru3DM/fn47kioHFACpMHSy3/PsULc5SB6sQtI2Ov/pm2UeDEAREGLRsPK+uilaAqoApEku/NzJWHGQAASLurd1m4CYcBUuS+abQW0E8xXLQ4RBTLgS1foYfpgCEClSqwFiIYBIqzZEACrMrceKqoBbhxmqAAABho1+nW2udAAAAABJRU5ErkJggg==);
		}

		.PogoButtons {
			color: #fff;
			padding: 3px;
		}

		.PogoButtons span {
			float: none;
		}

		.notPogo span {
			color: #FFF;
			background: #000;
			border-radius: 50%;
			font-size: 10px;
			letter-spacing: -0.15em;
			display: inline-block;
			padding: 2px;
			opacity: 0.6;
			margin: 3px 1px 0 2px;
			height: 15px;
			width: 16px;
			box-sizing: border-box;
			line-height: 1;
		}

		.notPogo span:after {
			display: inline-block;
			content: "N/A";
			position: absolute;
		}

		.notPogo:focus span, .notPogo.favorite span {
			opacity: 1;
		}

		.pogo-text {
			text-align: center;
			font-weight: bold;
			border: none !important;
			background: none !important;
			font-size: 130%;
			color: #000;
			text-shadow: 1px 1px #FFF, 2px 2px 6px #fff, -1px -1px #fff, -2px -2px 6px #fff;
		}

		@media (min-width: 1000px) {
			.pogo-text {
				font-size: 1.2vw;
			}
		}

		@media (min-width: 3000px) {
			.pogo-text {
				margin-left: -0.5vw !important;
				margin-top: -0.7vw !important;
			}
		}

		#PogoGymInfo {
			color: #fff;
			display: none;
			padding: 3px;
		}

		.isGym #PogoGymInfo {
			display: block;
		}

		.thisIsPogo .layer_off_warning,
		.thisIsPogo .mods,
		.thisIsPogo #randdetails,
		.thisIsPogo #resodetails,
		.thisIsPogo #historydetails,
		.thisIsPogo #level {
			display: none;
		}

		.thisIsPogo #playerstat,
		.thisIsPogo #gamestat,
		.thisIsPogo #redeem,
		.thisIsPogo #chat,
		.thisIsPogo #artifactLink,
		.thisIsPogo #scoresLink,
		.thisIsPogo #chatinput,
		.thisIsPogo #chatcontrols {
			display: none;
		}

		.thisIsPogo #mobileinfo .portallevel,
		.thisIsPogo #mobileinfo .resonator {
			display: none;
		}

		.thisIsPogo #portal_highlight_select {
			display: none;
		}

		.thisIsPogo #sidebar #portaldetails h3.title {
			color: #fff;
		}

		.gym-main-outline {
			fill: #FFF;
			stroke: #000;
			stroke-width: 5;
		}

		.gym-inner path {
			fill: #fff;
			stroke: #000;
			stroke-width: 2;
		}

		.GoldMedal .gym-main-outline,
		.GoldMedal .ball-outline-center {
			fill: #FEED55;
		}
		.SilverMedal .gym-main-outline,
		.SilverMedal .ball-outline-center {
			fill: #CEDFE6;
		}
		.BronzeMedal .gym-main-outline,
		.BronzeMedal .ball-outline-center {
			fill: #F0B688;
		}

		.GoldMedal .gym-inner path {
			stroke: #EDC13C;
			stroke-width: 20;
		}
		.SilverMedal .gym-inner path {
			stroke: #A4C1C7;
			stroke-width: 20;
		}
		.BronzeMedal .gym-inner path {
			stroke: #DD9D71;
			stroke-width: 10;
		}

		.gym-inner .ball-outline-top {
			fill: #f71208;
		}

		.exGym {
			position: relative;
		}

		.exGym:after {
			content: "EX";
			font-weight: bold;
			text-shadow: 1px 1px 3px #BED1D5, -1px -1px 3px #BED1D5;
			color: #09131D;
			font-size: 130%;
			position: absolute;
			top: 0;
			right: 0;
		}

		.pokestop {
			opacity: 0.75;
		}

		.pokestop path,
		.pokestop ellipse {
			fill: #2370DA;
		}

		path.pokestop-circle {
			fill: #23FEF8;
			stroke-width: 30px;
			stroke: #2370DA;
		}

		.missingPhoto path.pokestop-circle {
			stroke-width: 20px;
			fill: white;
			opacity: 0.5;
		}

		.smallpokestops .pokestop {
			opacity: 0.85;
			pointer-events: none;
		}

		.smallpokestops path.pokestop-pole,
		.smallpokestops ellipse.pokestop-base {
			display: none;
		}

		.smallpokestops .pokestop svg {
			transform: translateY(20px) scale(0.8);
		}

		.PogoClassification div {
			display: grid;
			grid-template-columns: 200px 60px 60px 60px;
			text-align: center;
			align-items: center;
			height: 140px;
			overflow: hidden;
			margin-bottom: 10px;
		}

		.PogoClassification div:nth-child(odd) {
			background: rgba(7, 42, 69, 0.9);
		}

		.PogoClassification img {
			max-width: 200px;
			max-height: 140px;
			display: block;
			margin: 0 auto;
		}

		#dialog-missingPortals .PogoClassification div {
			height: 50px;
		}

		img.photo,
		.ingressLocation,
		.pogoLocation {
			cursor: zoom-in;
		}

		.PoGo-PortalAnimation {
			width: 30px;
			height: 30px;
			background-color: rgba(255, 255, 255, 0.5);
			border-radius: 50%;
			box-shadow: 0px 0px 4px white;
			animation-duration: 1s;
			animation-name: shrink;
		}

		@keyframes shrink {
			from {
				width: 30px;
				height: 30px;
				top: 0px;
				left: 0px;
			}

			to {
				width: 10px;
				height: 10px;
				top: 10px;
				left: 10px;
			}
		}

		.PoGo-PortalAnimationHover {
			background-color: rgb(255, 102, 0, 0.8);
			border-radius: 50%;
			animation-duration: 1s;
			animation-name: shrinkHover;
			animation-iteration-count: infinite;
		}

		@keyframes shrinkHover {
			from {
				width: 40px;
				height: 40px;
				top: 0px;
				left: 0px;
			}

			to {
				width: 20px;
				height: 20px;
				top: 10px;
				left: 10px;
			}
		}

		#sidebarPogo {
			color: #eee;
			padding: 2px 5px;
		}

		#sidebarPogo span {
			margin-right: 5px;
		}

		.refreshingData,
		.refreshingPortalCount {
			opacity: 0.5;
			pointer-events: none;
		}

		#sidebarPogo.mobile {
			width: 100%;
			background: rebeccapurple;
			display: flex;
		}

		#sidebarPogo.mobile > div {
			margin-right: 1em;
		}

		.pogo-colors input[type=color] {
			border: 0;
			padding: 0;
		}

		.PogoListing .header {
			align-items: center;
			display: grid;
			grid-column-gap: 5px;
			grid-template-columns: 1fr 40px 40px 40px;
			text-align: center;
		}

		.PogoListing .header > span + span {
			font-size: 90%;
			font-weight: normal;
		}

		.PogoListing .PortalSummary {
			align-items: center;
			display: grid;
			grid-column-gap: 5px;
			grid-template-columns: 100px 1fr 40px 40px 40px;
			height: 70px;
			margin-bottom: 10px;
			overflow: hidden;
			text-align: center;
		}

		.PogoListing div div:nth-child(odd) {
			background: rgba(7, 42, 69, 0.9);
		}

		.PogoListing img {
			max-width: 100px;
			max-height: 70px;
			display: block;
			margin: 0 auto;
		}

		.Pogo_Photos,
		.Pogo_Votes {
			width: 100%;
			text-align: right;
		}

		`).appendTo('head');
		};

		// A portal has been received.
		function onPortalAdded(data) {
			const guid = data.portal.options.guid;

			data.portal.on('add', function () {
				addNearbyCircle(guid);
				window.clearTimeout(relayoutTimer);
				relayoutTimer = window.setTimeout(relayerBackgroundGroups, 100);
			});

			data.portal.on('remove', function () {
				removeNearbyCircle(guid);
			});

			// analyze each portal only once, but sometimes the first time there's no additional data of the portal
			if (allPortals[guid] && allPortals[guid].name)
				return;

			const portal = {
				guid: guid,
				name: data.portal.options.data.title,
				lat: data.portal._latlng.lat,
				lng: data.portal._latlng.lng,
				image: data.portal.options.data.image,
				cells: {}
			};

			allPortals[guid] = portal;
			groupPortal(portal);

			// If it's already classified in Pokemon, get out
			const pogoData = thisPlugin.findByGuid(guid);
			if (pogoData) {
				const pogoItem = pogoData.store[guid];
				if (!pogoItem.exists) {
					// Mark that it still exists in Ingress
					pogoItem.exists = true;

					if (missingPortals[guid]) {
						delete missingPortals[guid];
						updateMissingPortalsCount();
					}

					// Check if it has been moved
					if (pogoItem.lat != portal.lat || pogoItem.lng != portal.lng) {
						movedPortals.push({
							pogo: pogoItem,
							ingress: portal
						});
						updateCounter('moved', movedPortals);
					}
				}
				if (portal.name && pogoItem.name !== portal.name) {
					pogoData.store[guid].name = portal.name;
				}
				return;
			}

			if (skippedPortals[guid] || newPokestops[guid])
				return;

			newPortals[guid] = portal;

			refreshNewPortalsCounter();
		}

		/**
		 * Draw a 20m circle around a portal
		 */
		function addNearbyCircle(guid) {
			const portal = window.portals[guid];
			if (!portal)
				return;

			const circleSettings = {
				color: settings.colors.nearbyCircleBorder.color,
				opacity: settings.colors.nearbyCircleBorder.opacity,
				fillColor: settings.colors.nearbyCircleFill.color,
				fillOpacity: settings.colors.nearbyCircleFill.opacity,
				weight: 1,
				clickable: false,
				interactive: false
			};

			const center = portal._latlng;
			const circle = L.circle(center, 20, circleSettings);
			nearbyLayerGroup.addLayer(circle);
			nearbyCircles[guid] = circle;
		}

		/**
		 * Removes the 20m circle if a portal is purged
		 */
		function removeNearbyCircle(guid) {
			const circle = nearbyCircles[guid];
			if (circle != null) {
				nearbyLayerGroup.removeLayer(circle);
				delete nearbyCircles[guid];
			}
		}

		function redrawNearbyCircles() {
			const keys = Object.keys(nearbyCircles);
			keys.forEach(guid => {
				removeNearbyCircle(guid);
				addNearbyCircle(guid);
			});
			relayerBackgroundGroups();
		}

		/**
		 * Re-orders the layerGroups within regionLayer so that foreground objects don't get hidden/obscured by background layers.
		 */
		function relayerBackgroundGroups() {
			if (!map.hasLayer(regionLayer)) {
				return;
			}
			if (regionLayer.hasLayer(nearbyLayerGroup)) {
				nearbyLayerGroup.bringToBack();
			}
			if (regionLayer.hasLayer(cellLayerGroup)) {
				cellLayerGroup.bringToBack();
			}
			if (regionLayer.hasLayer(gymCenterLayerGroup)) {
				gymCenterLayerGroup.bringToFront();
			}
		}

		function refreshNewPortalsCounter() {
			if (!settings.analyzeForMissingData)
				return;

			// workaround for https://bugs.chromium.org/p/chromium/issues/detail?id=961199
			try {
				if (checkNewPortalsTimer) {
					clearTimeout(checkNewPortalsTimer);
				} else {
					document.getElementById('sidebarPogo').classList.add('refreshingPortalCount');
				}
			} catch (e) {
				// nothing
			}

			// workaround for https://bugs.chromium.org/p/chromium/issues/detail?id=961199
			try {
				checkNewPortalsTimer = setTimeout(checkNewPortals, 1000);
			} catch (e) {
				checkNewPortals();
			}
		}

		/**
		 * A potential new portal has been received
		 */
		function checkNewPortals() {
			checkNewPortalsTimer = null;

			// reuse to update grid counters
			drawCellGrid(map.getZoom());

			// don't try to classify if we don't have all the portal data
			if (map.getZoom() < 15)
				return;

			document.getElementById('sidebarPogo').classList.remove('refreshingPortalCount');

			newPokestops = {};
			notClassifiedPokestops = [];

			const allCells = groupByCell(poiCellLevel);

			// Check only the items inside the screen,
			// the server might provide info about remote portals if they are part of a link
			// and we don't know anything else about nearby portals of that one.
			// In this case (vs drawing) we want to filter only cells fully within the screen
			const cells = filterWithinScreen(allCells);

			// try to guess new pokestops if they are the only items in a cell
			Object.keys(cells).forEach(id => {
				const data = allCells[id];
				checkIsPortalMissing(data.gyms, data);
				checkIsPortalMissing(data.stops, data);
				//checkIsPortalMissing(data.notpogo);

				if (data.notClassified.length == 0)
					return;
				const notClassified = data.notClassified;

				if (data.gyms.length > 0 || data.stops.length > 0) {
					// Already has a pogo item, ignore the rest
					notClassified.forEach(portal => {
						skippedPortals[portal.guid] = true;
						delete newPortals[portal.guid];
					});
					return;
				}
				// only one, let's guess it's a pokestop by default
				if (notClassified.length == 1) {
					const portal = notClassified[0];
					const obj = {'guid': portal.guid, 'lat': portal.lat, 'lng': portal.lng, 'name': portal.name};

					newPokestops[portal.guid] = obj;
					//delete newPortals[portal.guid];
					return;
				}

				// too many items to guess
				notClassifiedPokestops.push(data.notClassified);
			});

			updateCounter('pokestops', Object.values(newPokestops));
			updateCounter('classification', notClassifiedPokestops);
			updateMissingPortalsCount();

			// Now gyms
			checkNewGyms();
		}

		/**
		 * Filter the missing portals detection to show only those on screen and reduce false positives
		 */
		function updateMissingPortalsCount() {
			const keys = Object.keys(missingPortals);
			if (keys.length == 0)
				updateCounter('missing', []);

			const bounds = map.getBounds();
			const filtered = [];
			keys.forEach(guid => {
				const pogoData = thisPlugin.findByGuid(guid);
				const item = pogoData.store[guid];
				if (isPointOnScreen(bounds, item)) {
					filtered.push(item);
				}
			});
			updateCounter('missing', filtered);
		}

		/**
		 * Given an array of pogo items checks if they have been removed from Ingress
		 */
		function checkIsPortalMissing(array, cellData) {
			array.forEach(item => {
				if (item.exists || item.newGuid)
					return;
				const guid = item.guid;

				if (findCorrectGuid(item, cellData.notClassified)) {
					return;
				}
				if (!missingPortals[guid]) {
					missingPortals[guid] = true;
				}
			});
		}

		/**
		 * Check if there's another real portal in the same cell (we're checking a pogo that doesn't exist in Ingress)
		 */
		function findCorrectGuid(pogoItem, array) {
			const portal = array.find(x => x.name == pogoItem.name && x.guid != pogoItem.guid);
			if (portal != null) {
				pogoItem.newGuid = portal.guid;
				movedPortals.push({
					pogo: pogoItem,
					ingress: portal
				});
				updateCounter('moved', movedPortals);

				delete missingPortals[pogoItem.guid];

				return true;
			}
			return false;
		}

		function checkNewGyms() {
			const cellsWithMissingGyms = [];

			const allCells = groupByCell(gymCellLevel);

			// Check only the items inside the screen,
			// the server might provide info about remote portals if they are part of a link
			// and we don't know anything else about nearby portals of that one.
			// In this case (vs drawing) we want to filter only cells fully within the screen
			const cells = filterWithinScreen(allCells);

			// Find the cells where new Gyms can be identified
			Object.keys(cells).forEach(id => {
				const data = allCells[id];
				// Only cells with all the portals already analyzed
				if (data.notClassified.length > 0)
					return;
				if (ignoredCellsMissingGyms[data.cell.toString()])
					return;
				const missingGyms = computeMissingGyms(data);
				if (missingGyms > 0) {
					cellsWithMissingGyms.push(data);
				}
			});

			if (cellsWithMissingGyms.length > 0) {
				const filtered = filterWithinScreen(cellsWithMissingGyms);
				updateCounter('gyms', Object.values(filtered));
			} else {
				updateCounter('gyms', []);
			}
		}

		/**
		 * Display new pokestops so they can be added
		 */
		function promptForNewPokestops(data) {
			if (data.length == 0)
				return;
			let pending = data.length;

			const div = document.createElement('div');
			div.className = 'PogoClassification';
			data.sort(sortByName).forEach(portal => {
				const wrapper = document.createElement('div');
				wrapper.setAttribute('data-guid', portal.guid);
				const img = getPortalImage(portal);
				wrapper.innerHTML = '<span class="PogoName">' + getPortalName(portal) +
					img + '</span>' +
					'<a data-type="pokestops">' + 'STOP' + '</a>' +
					'<a data-type="gyms">' + 'GYM' + '</a>' +
					'<a data-type="notpogo">' + 'N/A' + '</a>';
				div.appendChild(wrapper);
			});
			const width = Math.min(screen.availWidth, 420);

			const container = dialog({
				id: 'classifyPokestop',
				html: div,
				width: width + 'px',
				title: 'Are all of these Pokestops or Gyms?',
				buttons: {
					// Button to allow skip this cell
					'Skip': function () {
						container.dialog('close');
						data.forEach(portal => {
							delete newPokestops[portal.guid];
							skippedPortals[portal.guid] = true;
						});
						updateCounter('pokestops', Object.values(newPokestops));
					},
					'Mark all as Pokestops': function () {
						container.dialog('close');
						data.forEach(portal => {
							if (!newPokestops[portal.guid])
								return;

							delete newPokestops[portal.guid];
							thisPlugin.addPortalpogo(portal.guid, portal.lat, portal.lng, portal.name, 'pokestops');
						});
						if (settings.highlightGymCandidateCells) {
							updateMapGrid();
						}
						updateCounter('pokestops', Object.values(newPokestops));
					}
				}
			});
			// Remove ok button
			const outer = container.parent();
			outer.find('.ui-dialog-buttonset button:first').remove();

			// mark the selected one as pokestop or gym
			container.on('click', 'a', function (e) {
				const type = this.getAttribute('data-type');
				const row = this.parentNode;
				const guid = row.getAttribute('data-guid');
				const portal = allPortals[guid];
				delete newPokestops[portal.guid];
				thisPlugin.addPortalpogo(guid, portal.lat, portal.lng, portal.name, type);
				if (settings.highlightGymCandidateCells) {
					updateMapGrid();
				}
				$(row).fadeOut(200);
				pending--;
				if (pending == 0) {
					container.dialog('close');
				}
				updateCounter('pokestops', Object.values(newPokestops));
			});

			configureHoverMarker(container);
		}

		/**
		 * In a level 17 cell there's more than one portal, ask which one is Pokestop or Gym
		 */
		function promptToClassifyPokestops() {
			updateCounter('classification', notClassifiedPokestops);
			if (notClassifiedPokestops.length == 0)
				return;

			const group = notClassifiedPokestops.shift();
			const div = document.createElement('div');
			div.className = 'PogoClassification';
			group.sort(sortByName).forEach(portal => {
				const wrapper = document.createElement('div');
				wrapper.setAttribute('data-guid', portal.guid);
				const img = getPortalImage(portal);
				wrapper.innerHTML = '<span class="PogoName">' + getPortalName(portal) +
					img + '</span>' +
					'<a data-type="pokestops">' + 'STOP' + '</a>' +
					'<a data-type="gyms">' + 'GYM' + '</a>';
				div.appendChild(wrapper);
			});
			const width = Math.min(screen.availWidth, 360);
			const container = dialog({
				id: 'classifyPokestop',
				html: div,
				width: width + 'px',
				title: 'Which one is in Pokemon Go?',
				buttons: {
					// Button to allow skip this cell
					Skip: function () {
						container.dialog('close');
						group.forEach(portal => {
							delete newPortals[portal.guid];
							skippedPortals[portal.guid] = true;
						});
						// continue
						promptToClassifyPokestops();
					}
				}
			});
			// Remove ok button
			const outer = container.parent();
			outer.find('.ui-dialog-buttonset button:first').remove();

			// mark the selected one as pokestop or gym
			container.on('click', 'a', function (e) {
				const type = this.getAttribute('data-type');
				const guid = this.parentNode.getAttribute('data-guid');
				const portal = getPortalSummaryFromGuid(guid);
				thisPlugin.addPortalpogo(guid, portal.lat, portal.lng, portal.name, type);
				if (settings.highlightGymCandidateCells) {
					updateMapGrid();
				}

				group.forEach(tmpPortal => {
					delete newPortals[tmpPortal.guid];
				});

				container.dialog('close');
				// continue
				promptToClassifyPokestops();
			});

			configureHoverMarker(container);
		}

		/**
		 * List of portals that have been moved
		 */
		function promptToMovePokestops() {
			if (movedPortals.length == 0)
				return;

			const div = document.createElement('div');
			div.className = 'PogoClassification';
			movedPortals.sort(sortByName).forEach(pair => {
				const portal = pair.ingress;
				const pogoItem = pair.pogo;
				const wrapper = document.createElement('div');
				wrapper.setAttribute('data-guid', portal.guid);
				wrapper.dataPortal = portal;
				wrapper.dataPogoGuid = pogoItem.guid;
				const img = getPortalImage(portal);
				wrapper.innerHTML = '<span class="PogoName">' + getPortalName(portal) +
					img + '</span>' +
					'<span><span class="ingressLocation">' + 'Ingress location' + '</span></span>' +
					'<span><span class="pogoLocation" data-lat="' + pogoItem.lat + '" data-lng="' + pogoItem.lng + '">' + 'Pogo location' + '</span><br>' +
					'<a>' + 'Update' + '</a></span>';
				div.appendChild(wrapper);
			});
			const width = Math.min(screen.availWidth, 360);
			const container = dialog({
				id: 'movedPortals',
				html: div,
				width: width + 'px',
				title: 'These portals have been moved in Ingress',
				buttons: {
					// Button to move all the portals at once
					'Update all': function () {
						container.dialog('close');
						movedPortals.forEach(pair => {
							const portal = pair.ingress;
							const pogoItem = pair.pogo;
							movePogo(portal, pogoItem.guid);
						});
						movedPortals.length = 0;
						updateCounter('moved', movedPortals);

						saveStorage();
						if (settings.highlightGymCandidateCells) {
							updateMapGrid();
						}

					}
				}
			});

			// Update location
			container.on('click', 'a', function (e) {
				const row = this.parentNode.parentNode;
				const portal = row.dataPortal;
				movePogo(portal, row.dataPogoGuid);

				saveStorage();
				if (settings.highlightGymCandidateCells) {
					updateMapGrid();
				}

				$(row).fadeOut(200);

				// remove it from the list of portals
				const idx = movedPortals.findIndex(pair => pair.ingress.guid == pair.ingress.guid);
				movedPortals.splice(idx, 1);
				updateCounter('moved', movedPortals);

				if (movedPortals.length == 0)
					container.dialog('close');
			});

			configureHoverMarker(container);
			configureHoverMarkerAlt(container);
		}

		/**
		 * Update location of a pogo item
		 */
		function movePogo(portal, pogoGuid) {
			const guid = portal.guid;
			const pogoData = thisPlugin.findByGuid(pogoGuid);

			const existingType = pogoData.type;
			let gym = null;
			if (existingType == 'gyms') {
				gym = pogoData.store[guid];
			}

			// remove marker
			removePogoObject(existingType, guid);

			// Draw new marker
			thisPlugin.addPortalpogo(guid, portal.lat, portal.lng, portal.name || pogoData.name, existingType);

			// copy gym status
			if (gym != null) {
				pogoData.store[guid].isEx = gym.isEx;
				pogoData.store[guid].medal = gym.medal;

				saveStorage();

				const icon = document.getElementById('gym' + guid.replace('.', ''));
				// update gym marker
				if (icon) {
					icon.classList.add(gym.medal + 'Medal');
					icon.classList[gym.isEx ? 'add' : 'remove']('exGym');
				}

			}
		}

		/**
		 * Pogo items that aren't in Ingress
		 */
		function promptToRemovePokestops(missing) {
			const div = document.createElement('div');
			div.className = 'PogoClassification';
			missing.sort(sortByName).forEach(portal => {
				const wrapper = document.createElement('div');
				wrapper.setAttribute('data-guid', portal.guid);
				const name = portal.name || 'Unknown';
				wrapper.innerHTML = '<span class="PogoName"><span class="pogoLocation" data-lat="' + portal.lat + '" data-lng="' + portal.lng + '">' + name + '</span></span>' +
					'<span><a>' + 'Remove' + '</a></span>';
				div.appendChild(wrapper);
			});
			const width = Math.min(screen.availWidth, 360);
			const container = dialog({
				id: 'missingPortals',
				html: div,
				width: width + 'px',
				title: 'These portals are missing in Ingress',
				buttons: {
				}
			});

			// Update location
			container.on('click', 'a', function (e) {
				const row = this.parentNode.parentNode;
				const guid = row.getAttribute('data-guid');
				const pogoData = thisPlugin.findByGuid(guid);
				const existingType = pogoData.type;

				// remove marker
				removePogoObject(existingType, guid);
				saveStorage();

				if (settings.highlightGymCandidateCells) {
					updateMapGrid();
				}

				$(row).fadeOut(200);

				delete missingPortals[guid];
				updateMissingPortalsCount();

				if (Object.keys(missingPortals).length == 0) {
					container.dialog('close');
				}
			});

			configureHoverMarkerAlt(container);
		}

		function configureHoverMarker(container) {
			container.on('click', 'img.photo, .ingressLocation', centerPortal);

			let hoverMarker;
			container.find('img.photo, .ingressLocation').hover(
				function hIn() {
					const row = this.parentNode.parentNode;
					const guid = row.getAttribute('data-guid');
					const portal = row.dataPortal || window.portals[guid];
					if (!portal)
						return;
					const center = portal._latlng || new L.LatLng(portal.lat, portal.lng);
					hoverMarker = L.marker(center, {
						icon: L.divIcon({
							className: 'PoGo-PortalAnimationHover',
							iconSize: [40, 40],
							iconAnchor: [20, 20],
							html: ''
						}),
						interactive: false
					});
					map.addLayer(hoverMarker);
				}, function hOut() {
					if (hoverMarker)
						map.removeLayer(hoverMarker);
				});
		}

		function configureHoverMarkerAlt(container) {
			container.on('click', '.pogoLocation', centerPortalAlt);

			let hoverMarker;
			container.find('.pogoLocation').hover(
				function hIn() {
					const lat = this.getAttribute('data-lat');
					const lng = this.getAttribute('data-lng');
					const center = new L.LatLng(lat, lng);
					hoverMarker = L.marker(center, {
						icon: L.divIcon({
							className: 'PoGo-PortalAnimationHover',
							iconSize: [40, 40],
							iconAnchor: [20, 20],
							html: ''
						}),
						interactive: false
					});
					map.addLayer(hoverMarker);
				}, function hOut() {
					if (hoverMarker)
						map.removeLayer(hoverMarker);
				});
		}

		/**
		 * Center the map on the clicked portal to help tracking it (the user will have to manually move the dialog)
		 */
		function centerPortal(e) {
			const row = this.parentNode.parentNode;
			const guid = row.getAttribute('data-guid');
			const portal = row.dataPortal || window.portals[guid];
			if (!portal)
				return;
			const center = portal._latlng || new L.LatLng(portal.lat, portal.lng);
			if (settings.centerMapOnClick)
				map.panTo(center);
			drawClickAnimation(center);
			// Open in sidebar
			if (!window.isSmartphone())
				renderPortalDetails(guid);
		}

		function centerPortalAlt(e) {
			const lat = this.getAttribute('data-lat');
			const lng = this.getAttribute('data-lng');
			const center = new L.LatLng(lat, lng);
			map.panTo(center);
			drawClickAnimation(center);
		}

		function drawClickAnimation(center) {
			const marker = L.marker(center, {
				icon: L.divIcon({
					className: 'PoGo-PortalAnimation',
					iconSize: [30, 30],
					iconAnchor: [15, 15],
					html: ''
				}),
				interactive: false
			});
			map.addLayer(marker);

			setTimeout(function () {
				map.removeLayer(marker);
			}, 2000);
		}

		function getPortalSummaryFromGuid(guid) {
			const newPortal = newPortals[guid];
			if (newPortal)
				return newPortal;

			const portal = window.portals[guid];
			if (!portal)
				return {};

			return {
				guid: guid,
				name: portal.options.data.title,
				lat: portal._latlng.lat,
				lng: portal._latlng.lng,
				image: portal.options.data.image,
				cells: {}
			};
		}

		function getPortalImage(pokestop) {
			if (pokestop.image)
				return '<img src="' + pokestop.image.replace('http:', 'https:') + '" class="photo">';

			const portal = window.portals[pokestop.guid];
			if (!portal)
				return '';

			if (portal && portal.options && portal.options.data && portal.options.data.image) {
				pokestop.image = portal.options.data.image;
				return '<img src="' + pokestop.image.replace('http:', 'https:') + '" class="photo">';
			}
			return '';
		}

		function getPortalName(pokestop) {
			if (pokestop.name)
				return pokestop.name;

			const portal = window.portals[pokestop.guid];
			if (!portal)
				return '';

			if (portal && portal.options && portal.options.data && portal.options.data.title) {
				pokestop.name = portal.options.data.title;
				return pokestop.name;
			}
			return '';
		}

		/**
		 * In a level 14 cell there's some missing Gyms, prompt which ones
		 */
		function promptToClassifyGyms(groups) {
			// don't try to classify if we don't have all the portal data
			if (map.getZoom() < 15)
				return;

			if (!groups || groups.length == 0)
				return;

			const cellData = groups.shift();
			updateCounter('gyms', groups);

			let missingGyms = computeMissingGyms(cellData);

			const div = document.createElement('div');
			div.className = 'PogoClassification';
			cellData.stops.sort(sortByName).forEach(portal => {
				if (skippedPortals[portal.guid])
					return;

				const wrapper = document.createElement('div');
				wrapper.setAttribute('data-guid', portal.guid);
				wrapper.innerHTML =
					'<span class="PogoName">' + getPortalName(portal) +
					getPortalImage(portal) + '</span>' +
					'<a data-type="gyms">' + 'GYM' + '</a>';
				div.appendChild(wrapper);
			});
			// No pokestops to prompt as it has been skipped
			if (!div.firstChild) {
				// continue
				promptToClassifyGyms(groups);
				return;
			}

			const width = Math.min(screen.availWidth, 360);
			const container = dialog({
				id: 'classifyPokestop',
				html: div,
				width: width + 'px',
				title: missingGyms == 1 ? 'Which one is a Gym?' : 'Which ' + missingGyms + ' are Gyms?',
				buttons: {
					// Button to allow skip this cell
					Skip: function () {
						container.dialog('close');
						cellData.stops.forEach(portal => {
							skippedPortals[portal.guid] = true;
						});
						// continue
						promptToClassifyGyms(groups);
					},
					// Button to allow skip this cell
					'There is no Gym': function () {
						ignoredCellsMissingGyms[cellData.cell.toString()] = true;

						if (settings.highlightGymCandidateCells) {
							updateMapGrid();
						}
						container.dialog('close');

						saveStorage();

						updateCounter('gyms', groups);
						// continue
						promptToClassifyGyms(groups);
					}
				}
			});
			// Remove ok button
			const outer = container.parent();
			outer.find('.ui-dialog-buttonset button:first').remove();

			// mark the selected one as pokestop or gym
			container.on('click', 'a', function (e) {
				const type = this.getAttribute('data-type');
				const row = this.parentNode;
				const guid = row.getAttribute('data-guid');
				const portal = pokestops[guid];

				removePogoObject('pokestops', guid);

				thisPlugin.addPortalpogo(guid, portal.lat, portal.lng, portal.name, type);
				if (settings.highlightGymCandidateCells) {
					updateMapGrid();
				}
				missingGyms--;
				if (missingGyms == 0) {
					container.dialog('close');
					// continue
					promptToClassifyGyms(groups);
				} else {
					$(row).fadeOut(200);
					document.querySelector('.ui-dialog-title-active').textContent = missingGyms == 1 ? 'Which one is a Gym?' : 'Which ' + missingGyms + ' are Gyms?';
				}
			});

			configureHoverMarker(container);
		}

		/**
		 * In a level 14 cell there are too many Gyms
		 */
		function promptToVerifyGyms(cellIds) {
			if (!cellIds)
				cellIds = Object.keys(cellsExtraGyms);

			if (cellIds.length == 0)
				return;

			const cellId = cellIds[0];
			const group = findCellItems(cellId, gymCellLevel, gyms);

			const div = document.createElement('div');
			div.className = 'PogoClassification';
			group.sort(sortByName).forEach(portal => {
				const wrapper = document.createElement('div');
				wrapper.setAttribute('data-guid', portal.guid);
				const img = getPortalImage(portal);
				wrapper.innerHTML = '<span class="PogoName">' + getPortalName(portal) +
					img + '</span>' +
					'<a data-type="pokestops">' + 'STOP' + '</a>';
				div.appendChild(wrapper);
			});
			const width = Math.min(screen.availWidth, 360);
			const container = dialog({
				id: 'classifyPokestop',
				html: div,
				width: width + 'px',
				title: 'This cell has too many Gyms.',
				buttons: {
					// Button to allow skip this cell
					'All are OK': function () {
						ignoredCellsExtraGyms[cellId] = true;

						if (settings.highlightGymCandidateCells) {
							updateMapGrid();
						}
						container.dialog('close');
						delete cellsExtraGyms[cellId];

						saveStorage();

						updateCounter('extraGyms', Object.keys(cellsExtraGyms));
						// continue
						promptToVerifyGyms();
					}
				}
			});
			// Remove ok button
			const outer = container.parent();
			outer.find('.ui-dialog-buttonset button:first').remove();

			// mark the selected one as pokestop or gym
			container.on('click', 'a', function (e) {
				const type = this.getAttribute('data-type');
				const guid = this.parentNode.getAttribute('data-guid');
				const portal = gyms[guid];
				thisPlugin.addPortalpogo(guid, portal.lat, portal.lng, portal.name, type);
				if (settings.highlightGymCandidateCells) {
					updateMapGrid();
				}

				container.dialog('close');
				delete cellsExtraGyms[cellId];
				updateCounter('extraGyms', Object.keys(cellsExtraGyms));
				// continue
				promptToVerifyGyms();
			});

			configureHoverMarker(container);
		}


		function removeLayer(name) {
			const layers = window.layerChooser._layers;
			const layersIds = Object.keys(layers);

			let layerId = null;
			let leafletLayer;
			let isBase;
			let arrayIdx;
			layersIds.forEach(id => {
				const layer = layers[id];
				if (layer.name == name) {
					leafletLayer = layer.layer;
					layerId = leafletLayer._leaflet_id;
					isBase = !layer.overlay;
					arrayIdx = id;
				}
			});

			// The Beacons and Frackers are not there in Firefox, why????
			if (!leafletLayer) {
				return;
			}

			const enabled = map._layers[layerId] != null || layerDefaultStatus[name];
			if (enabled) {
				// Don't remove base layer if it's used
				if (isBase)
					return;

				map.removeLayer(leafletLayer);
			}
			if (typeof leafletLayer.off != 'undefined')
				leafletLayer.off();

			// new Leaflet
			if (Array.isArray(layers)) {
				// remove from array
				layers.splice(parseInt(arrayIdx, 10), 1);
			} else {
				// classic IITC, leaflet 0.7.7
				// delete from object
				delete layers[layerId];
			}
			removedLayers[name] = {
				layer: leafletLayer,
				enabled: enabled,
				isBase: isBase
			};
			window.layerChooser._update();
			if (window.updateDisplayedLayerGroup)
				window.updateDisplayedLayerGroup(name, enabled);
		}
		const removedLayers = {};
		let portalsLayerGroup;
		let layerDefaultStatus;

		const IngressLayers = [
			'Fields',
			'Links',
			'DEBUG Data Tiles',
			'Artifacts',
			//'Ornaments',
			'Beacons',
			'Frackers',

			'Unclaimed/Placeholder Portals',
			'Level 1 Portals',
			'Level 2 Portals',
			'Level 3 Portals',
			'Level 4 Portals',
			'Level 5 Portals',
			'Level 6 Portals',
			'Level 7 Portals',
			'Level 8 Portals'
		];

		function storeIngressLayerDefaultStatus() {
			layerDefaultStatus = {};

			const layers = window.layerChooser._layers;
			IngressLayers.forEach(name => {
				const layerData = layers.find(l => l.name == name);
				if (!layerData)
					return;

				const id = layerData.layer._leaflet_id;
				layerDefaultStatus[name] = window.map._layers[id] != null;
			});
			localStorage[KEY_SETTINGS + 'layers'] = JSON.stringify(layerDefaultStatus);
		}

		function removeIngressLayers() {
			// By default now IITC stores the visibility status automatically, so we must keep track on our own which Ingress layers are visible 
			// to restore them upon disabling This is Pogo if it was enabled on start.
			if (!layerDefaultStatus) {
				const tmp = localStorage[KEY_SETTINGS + 'layers'];
				if (tmp) {
					try	{
						layerDefaultStatus = JSON.parse(tmp);
					} catch (e) { // eslint-disable-line no-empty
					}
				}
				if (!layerDefaultStatus) {
					storeIngressLayerDefaultStatus();
				}
			}
			removeLayer('CartoDB Dark Matter');
			removeLayer('CartoDB Positron');
			removeLayer('Google Default Ingress Map');

			IngressLayers.forEach(removeLayer);

			//removeLayer('Resistance');
			//removeLayer('Enlightened');
			mergePortalLayers();
		}

		/**
		 * Put all the layers for Ingress portals under a single one
		 */
		function mergePortalLayers() {
			portalsLayerGroup = new L.LayerGroup();
			window.addLayerGroup('Ingress Portals', portalsLayerGroup, true);
			portalsLayerGroup.addLayer(removedLayers['Unclaimed/Placeholder Portals'].layer);
			for (let i = 1; i <= 8; i++) {
				portalsLayerGroup.addLayer(removedLayers['Level ' + i + ' Portals'].layer);
			}
			//portalsLayerGroup.addLayer(removedLayers['Resistance'].layer);
			//portalsLayerGroup.addLayer(removedLayers['Enlightened'].layer);
		}

		/**
		 * Remove the single layer for all the portals
		 */
		function revertPortalLayers() {
			if (!portalsLayerGroup) {
				return;
			}
			const name = 'Ingress Portals';
			const layerId = portalsLayerGroup._leaflet_id;
			const enabled = map._layers[layerId] != null;

			const layers = window.layerChooser._layers;
			if (Array.isArray(layers)) {
				// remove from array
				const idx = layers.findIndex(o => o.layer._leaflet_id == layerId);
				layers.splice(idx, 1);
			} else {
				// classic IITC, leaflet 0.7.7
				// delete from object
				delete layers[layerId];
			}
			window.layerChooser._update();
			if (window.updateDisplayedLayerGroup)
				window.updateDisplayedLayerGroup(name, enabled);

			if (typeof portalsLayerGroup.off != 'undefined')
				portalsLayerGroup.off();
			if (enabled) {
				map.removeLayer(portalsLayerGroup);
			}
			portalsLayerGroup = null;
		}

		function restoreIngressLayers() {
			revertPortalLayers();

			Object.keys(removedLayers).forEach(name => {
				const info = removedLayers[name];
				if (info.isBase)
					window.layerChooser.addBaseLayer(info.layer, name);
				else {
					if (window.layerChooser.addOverlay) {
						window.layerChooser.addOverlay(info.layer, name, {enabled: info.enabled, 'default': info.enabled});
						window.layerChooser.showLayer(info.layer, info.enabled);
					} else {
						window.addLayerGroup(name, info.layer, info.enabled);
					}
				}
			});
		}

		function zoomListener() {
			const zoom = map.getZoom();
			document.body.classList.toggle('smallpokestops', zoom < 16);
		}

		const setup = function () {
			thisPlugin.isSmart = window.isSmartphone();

			initSvgIcon();
			window.addPortalHighlighter(highlighterTitle, markPortalsAsNeutral);

			loadSettings();

			// Load data from localStorage
			thisPlugin.loadStorage();

			thisPlugin.htmlStar = `<a class="pogoStop" accesskey="p" onclick="window.plugin.pogo.switchStarPortal('pokestops');return false;" title="Mark this portal as a pokestop [p]"><span></span></a>
				<a class="pogoGym" accesskey="g" onclick="window.plugin.pogo.switchStarPortal('gyms');return false;" title="Mark this portal as a PokeGym [g]"><span></span></a>
				<a class="notPogo" onclick="window.plugin.pogo.switchStarPortal('notpogo');return false;" title="Mark this portal as a removed/Not Available in Pokemon Go"><span></span></a>
				`;

			thisPlugin.setupCSS();

			const sidebarPogo = document.createElement('div');
			sidebarPogo.id = 'sidebarPogo';
			sidebarPogo.style.display = 'none';
			if (thisPlugin.isSmart) {
				const status = document.getElementById('updatestatus');
				sidebarPogo.classList.add('mobile');
				status.insertBefore(sidebarPogo, status.firstElementChild);

				const dStatus = document.createElement('div');
				dStatus.className = 'PogoStatus';
				status.insertBefore(dStatus, status.firstElementChild);
			} else {
				document.getElementById('sidebar').appendChild(sidebarPogo);
			}

			sidebarPogo.appendChild(createCounter('New pokestops', 'pokestops', promptForNewPokestops));
			sidebarPogo.appendChild(createCounter('Review required', 'classification', promptToClassifyPokestops));
			sidebarPogo.appendChild(createCounter('Moved portals', 'moved', promptToMovePokestops));
			sidebarPogo.appendChild(createCounter('Missing portals', 'missing', promptToRemovePokestops));
			sidebarPogo.appendChild(createCounter('New Gyms', 'gyms', promptToClassifyGyms));
			sidebarPogo.appendChild(createCounter('Cells with extra Gyms', 'extraGyms', promptToVerifyGyms));

			window.addHook('portalSelected', thisPlugin.onPortalSelected);

			window.addHook('portalAdded', onPortalAdded);
			window.addHook('mapDataRefreshStart', function () {
				sidebarPogo.classList.add('refreshingData');
			});
			window.addHook('mapDataRefreshEnd', function () {
				sidebarPogo.classList.remove('refreshingData');
				refreshNewPortalsCounter();
			});
			map.on('moveend', function () {
				refreshNewPortalsCounter();
			});
			sidebarPogo.classList.add('refreshingData');

			// Layer - pokemon go portals
			stopLayerGroup = L.layerGroup();
			window.addLayerGroup('PokeStops', stopLayerGroup, true);
			gymLayerGroup = L.layerGroup();
			window.addLayerGroup('Gyms', gymLayerGroup, true);
			regionLayer = L.layerGroup();
			window.addLayerGroup('S2 Grid', regionLayer, true);

			// this layer will group all the nearby circles that are added or removed from it when the portals are added or removed
			nearbyLayerGroup = L.featureGroup();
			// this layer will group all the shaded cells and cell borders
			cellLayerGroup = L.featureGroup();
			// this layer will contain the s2 grid
			gridLayerGroup = L.layerGroup();
			// this layer will contain the gym centers for checking ex eligibility
			gymCenterLayerGroup = L.featureGroup();

			countLayer = L.layerGroup();
			window.addLayerGroup('PoI in cell counter', countLayer, false);

			thisPlugin.addAllMarkers();

			const toolbox = document.getElementById('toolbox');

			const buttonPoGo = document.createElement('a');
			buttonPoGo.textContent = 'PoGo Actions';
			buttonPoGo.title = 'Actions on Pokemon Go data';
			buttonPoGo.addEventListener('click', thisPlugin.pogoActionsDialog);
			toolbox.appendChild(buttonPoGo);

			const buttonGrid = document.createElement('a');
			buttonGrid.textContent = 'PoGo Settings';
			buttonGrid.title = 'Settings for S2 & PokemonGo';
			buttonGrid.addEventListener('click', e => {
				if (thisPlugin.isSmart)
					window.show('map');
				showS2Dialog();
			});
			toolbox.appendChild(buttonGrid);

			map.on('zoomend', zoomListener);
			zoomListener();
			map.on('moveend', updateMapGrid);
			updateMapGrid();
			map.on('overlayadd', function (event) {
				if (event && event.name === 'S2 Grid') {
					updateMapGrid();
				}
			});

			// add ids to the links that we want to be able to hide
			const links = document.querySelectorAll('#toolbox > a');
			links.forEach(a => {
				const text = a.textContent;
				if (text == 'Region scores') {
					a.id = 'scoresLink';
				}
				if (text == 'Artifacts') {
					a.id = 'artifactLink';
				}
			});

		};

		function createCounter(title, type, callback) {
			const div = document.createElement('div');
			div.style.display = 'none';
			const sTitle = document.createElement('span');
			sTitle.textContent = title;
			const counter = document.createElement('a');
			counter.id = 'PogoCounter-' + type;
			counter.addEventListener('click', function (e) {
				callback(counter.PogoData);
				return false;
			});
			div.appendChild(sTitle);
			div.appendChild(counter);
			return div;
		}

		function updateCounter(type, data) {
			const counter = document.querySelector('#PogoCounter-' + type);
			counter.PogoData = data;
			counter.textContent = data.length;
			counter.parentNode.style.display = data.length > 0 ? '' : 'none';

			// Adjust visibility of the pane to avoid the small gap due to padding
			const pane = counter.parentNode.parentNode;
			if (data.length > 0) {
				pane.style.display = '';
				return;
			}
			let node = pane.firstElementChild;
			while (node) {
				const rowData = node.lastElementChild.PogoData;
				if (rowData && rowData.length > 0) {
					pane.style.display = '';
					return;
				}
				node = node.nextElementSibling;
			}
			pane.style.display = 'none';
		}

		// PLUGIN END //////////////////////////////////////////////////////////

		setup.info = plugin_info; //add the script info data to the function as a property
		// if IITC has already booted, immediately run the 'setup' function
		if (window.iitcLoaded) {
			setup();
		} else {
			if (!window.bootPlugins) {
				window.bootPlugins = [];
			}
			window.bootPlugins.push(setup);
		}
	}

	const plugin_info = {};
	if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
		plugin_info.script = {
			version: GM_info.script.version,
			name: GM_info.script.name,
			description: GM_info.script.description
		};
	}

	// Greasemonkey. It will be quite hard to debug
	if (typeof unsafeWindow != 'undefined' || typeof GM_info == 'undefined' || GM_info.scriptHandler != 'Tampermonkey') {
		// inject code into site context
		const script = document.createElement('script');
		script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(plugin_info) + ');'));
		(document.body || document.head || document.documentElement).appendChild(script);
	} else {
		// Tampermonkey, run code directly
		wrapper(plugin_info);
	}
})();
