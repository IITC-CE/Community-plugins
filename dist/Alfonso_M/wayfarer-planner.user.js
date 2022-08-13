// ==UserScript==
// @id             wayfarer-planner@Alfonso_M
// @name           Alfonso_M
// @category       Layer
// @version        1.162
// @namespace      https://gitlab.com/AlfonsoML/wayfarer/
// @downloadURL    https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/Alfonso_M/wayfarer-planner.user.js
// @homepageURL    https://gitlab.com/AlfonsoML/wayfarer/
// @description    Place markers on the map for your candidates in Wayfarer.
// @match          https://intel.ingress.com/*
// @grant          none
// @updateURL      https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/Alfonso_M/wayfarer-planner.meta.js
// ==/UserScript==

/* forked from https://github.com/Wintervorst/iitc/raw/master/plugins/totalrecon/ */

/* eslint-env es6 */
/* eslint no-var: "error" */
/* globals L, map */
/* globals GM_info, $, dialog */

;function wrapper(plugin_info) { // eslint-disable-line no-extra-semi
	'use strict';

	// PLUGIN START ///////////////////////////////////////////////////////

	let editmarker = null;
	let isPlacingMarkers = false;

	let markercollection = [];
	let plottedmarkers = {};
	let plottedtitles = {};
	let plottedsubmitrange = {};
	let plottedinteractrange = {};

	// Define the layers created by the plugin, one for each marker status
	const mapLayers = {
		potential: {
			color: 'grey',
			title: 'Potentials',
			optionTitle: 'Potential'
		},
		held: {
			color: 'yellow',
			title: 'On hold',
			optionTitle: 'On hold'
		},
		submitted: {
			color: 'orange',
			title: 'Submitted',
			optionTitle: 'Submitted'
		},
		NIANTIC_REVIEW: {
			color: 'pink',
			title: 'Niantic Review',
			optionTitle: 'Niantic Review'
		},
		live: {
			color: 'green',
			title: 'Accepted',
			optionTitle: 'Live'
		},
		rejected: {
			color: 'red',
			title: 'Rejected',
			optionTitle: 'Rejected'
		},
		appealed: {
			color: 'black',
			title: 'Appealed',
			optionTitle: 'Appealed'
		},
		potentialedit: {
			color: 'cornflowerblue',
			title: 'Potential edit',
			optionTitle: 'Edit location. Potential'
		},
		sentedit: {
			color: 'purple',
			title: 'Sent edit',
			optionTitle: 'Edit location. Sent'
		}
	};

	const defaultSettings = {
		showTitles: true,
		showRadius: false,
		showInteractionRadius: false,
		scriptURL: ''
	};
	let settings = defaultSettings;

	function saveSettings() {
		localStorage['wayfarer_planner_settings'] = JSON.stringify(settings);
	}

	function loadSettings() {
		const tmp = localStorage['wayfarer_planner_settings'];
		if (!tmp) {
			upgradeSettings();
			return;
		}

		try	{
			settings = JSON.parse(tmp);
		} catch (e) { // eslint-disable-line no-empty
		}
	}

	// importing from totalrecon_settings will be removed after a little while
	function upgradeSettings() {
		const tmp = localStorage['totalrecon_settings'];
		if (!tmp)
			return;

		try	{
			settings = JSON.parse(tmp);
		} catch (e) { // eslint-disable-line no-empty
		}
		saveSettings();
		localStorage.removeItem('totalrecon_settings');
	}

	function getStoredData() {
		const url = settings.scriptURL;
		if (!url) {
			markercollection = [];
			drawMarkers();
			return;
		}

		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'text',
			success: function (data, status, header) {
				try {
					markercollection = JSON.parse(data);
				} catch (e) {
					console.log('Wayfarer Planner. Exception parsing response: ', e); // eslint-disable-line no-console
					alert('Wayfarer Planner. Exception parsing response.');
					return;
				}
				drawMarkers();
			},
			error: function (x, y, z) {
				console.log('Wayfarer Planner. Error message: ', x, y, z); // eslint-disable-line no-console
				alert('Wayfarer Planner. Failed to retrieve data from the scriptURL.\r\nVerify that you\'re using the right URL and that you don\'t use any extension that blocks access to google.');
			}
		});
	}

	function drawMarker(candidate) {
		if (candidate != undefined && candidate.lat != '' && candidate.lng != '') {
			addMarkerToLayer(candidate);
			addTitleToLayer(candidate);
			addCircleToLayer(candidate);
		}
	}

	function addCircleToLayer(candidate) {
		if (settings.showRadius) {
			const latlng = L.latLng(candidate.lat, candidate.lng);

			// Specify the no submit circle options
			const circleOptions = {color: 'black', opacity: 1, fillColor: 'grey', fillOpacity: 0.40, weight: 1, clickable: false, interactive: false};
			const range = 20; // Hardcoded to 20m, the universal too close for new submit range of a portal

			// Create the circle object with specified options
			const circle = new L.Circle(latlng, range, circleOptions);
			// Add the new circle
			const existingMarker = plottedmarkers[candidate.id];
			existingMarker.layer.addLayer(circle);

			plottedsubmitrange[candidate.id] = circle;
		}
		if (settings.showInteractionRadius) {
			const latlng = L.latLng(candidate.lat, candidate.lng);

			// Specify the interaction circle options
			const circleOptions = {color: 'grey', opacity: 1, fillOpacity: 0, weight: 1, clickable: false, interactive: false};
			const range = 80;

			// Create the circle object with specified options
			const circle = new L.Circle(latlng, range, circleOptions);
			// Add the new circle
			const existingMarker = plottedmarkers[candidate.id];
			existingMarker.layer.addLayer(circle);

			plottedinteractrange[candidate.id] = circle;
		}
	}

	function removeExistingCircle(guid) {
		const existingCircle = plottedsubmitrange[guid];
		if (existingCircle !== undefined) {
			const existingMarker = plottedmarkers[guid];
			existingMarker.layer.removeLayer(existingCircle);
			delete plottedsubmitrange[guid];
		}
		const existingInteractCircle = plottedinteractrange[guid];
		if (existingInteractCircle !== undefined) {
			const existingMarker = plottedmarkers[guid];
			existingMarker.layer.removeLayer(existingInteractCircle);
			delete plottedinteractrange[guid];
		}
	}

	function addTitleToLayer(candidate) {
		if (settings.showTitles) {
			const title = candidate.title;
			if (title != '') {
				const portalLatLng = L.latLng(candidate.lat, candidate.lng);
				const titleMarker = L.marker(portalLatLng, {
					icon: L.divIcon({
						className: 'wayfarer-planner-name',
						iconAnchor: [100,5],
						iconSize: [200,10],
						html: title
					}),
					data: candidate
				});
				const existingMarker = plottedmarkers[candidate.id];
				existingMarker.layer.addLayer(titleMarker);

				plottedtitles[candidate.id] = titleMarker;
			}
		}
	}

	function removeExistingTitle(guid) {
		const existingTitle = plottedtitles[guid];
		if (existingTitle !== undefined) {
			const existingMarker = plottedmarkers[guid];
			existingMarker.layer.removeLayer(existingTitle);
			delete plottedtitles[guid];
		}
	}

	function removeExistingMarker(guid) {
		const existingMarker = plottedmarkers[guid];
		if (existingMarker !== undefined) {
			existingMarker.layer.removeLayer(existingMarker.marker);
			removeExistingTitle(guid);
			removeExistingCircle(guid);
		}
	}

	function addMarkerToLayer(candidate) {
		removeExistingMarker(candidate.id);

		const portalLatLng = L.latLng(candidate.lat, candidate.lng);

		const layerData = mapLayers[candidate.status];
		const markerColor = layerData.color;
		const markerLayer = layerData.layer;

		const marker = createGenericMarker(portalLatLng, markerColor, {
			title: candidate.title,
			id: candidate.id,
			data: candidate,
			draggable: true
		});

		marker.on('dragend', function (e) {
			const data = e.target.options.data;
			const latlng = marker.getLatLng();
			data.lat = latlng.lat;
			data.lng = latlng.lng;

			drawInputPopop(latlng, data);
		});

		marker.on('dragstart', function (e) {
			const guid = e.target.options.data.id;
			removeExistingTitle(guid);
			removeExistingCircle(guid);
		});

		markerLayer.addLayer(marker);
		plottedmarkers[candidate.id] = {'marker': marker, 'layer': markerLayer};
	}

	function clearAllLayers() {
		Object.values(mapLayers).forEach(data => data.layer.clearLayers());

		/* clear marker storage */
		plottedmarkers = {};
		plottedtitles = {};
		plottedsubmitrange = {};
		plottedinteractrange = {};
	}

	function drawMarkers() {
		clearAllLayers();
		markercollection.forEach(drawMarker);
	}

	function onMapClick(e) {
		if (isPlacingMarkers) {
			if (editmarker != null) {
				map.removeLayer(editmarker);
			}

			const marker = createGenericMarker(e.latlng, 'pink', {
				title: 'Place your mark!'
			});

			editmarker = marker;
			marker.addTo(map);

			drawInputPopop(e.latlng);
		}
	}

	function drawInputPopop(latlng, markerData) {
		const formpopup = L.popup();

		let title = '';
		let description = '';
		let id = '';
		let submitteddate = '';
		let lat = '';
		let lng = '';
		let status = 'potential';
		let imageUrl = '';

		if (markerData !== undefined) {
			id = markerData.id;
			title = markerData.title;
			description = markerData.description;
			submitteddate = markerData.submitteddate;
			status = markerData.status;
			imageUrl = markerData.candidateimageurl;
			lat = parseFloat(markerData.lat).toFixed(6);
			lng = parseFloat(markerData.lng).toFixed(6);
		} else {
			lat = latlng.lat.toFixed(6);
			lng = latlng.lng.toFixed(6);
		}

		formpopup.setLatLng(latlng);

		const options = Object.keys(mapLayers)
			.map(id => '<option value="' + id + '"' + (id == status ? ' selected="selected"' : '') + '>' + mapLayers[id].optionTitle + '</option>')
			.join('');

		let formContent = `<div class="wayfarer-planner-popup"><form id="submit-to-wayfarer">
			<label>Status
			<select name="status">${options}</select>
			</label>
			<label>Title
			<input name="title" type="text" autocomplete="off" placeholder="Title (required)" required value="${title}">
			</label>
			<label>Description
			<input name="description" type="text" autocomplete="off" placeholder="Description" value="${description}">
			</label>
			<div class='wayfarer-expander' title='Click to expand additional fields'>»</div>
			<div class='wayfarer-extraData'>
			<label>Submitted date
			<input name="submitteddate" type="text" autocomplete="off" placeholder="dd-mm-jjjj" value="${submitteddate}">
			</label>
			<label>Image
			<input name="candidateimageurl" type="text" autocomplete="off" placeholder="http://?.googleusercontent.com/***" value="${imageUrl}">
			</label>
			</div>
			<input name="id" type="hidden" value="${id}">
			<input name="lat" type="hidden" value="${lat}">
			<input name="lng" type="hidden" value="${lng}">
			<input name="nickname" type="hidden" value="${window.PLAYER.nickname}">
			<button type="submit" id='wayfarer-submit'>Send</button>
			</form>`;

		if (id !== '') {
			formContent += '<a style="padding:4px; display: inline-block;" id="deletePortalCandidate">Delete 🗑️</a>';
		}

		if (imageUrl !== '' && imageUrl !== undefined) {
			formContent += ' <a href="' + imageUrl + '" style="padding:4px; float:right;" target="_blank">Image</a>';
		}
		const align = id !== '' ? 'float: right' : 'box-sizing: border-box; text-align: right; display: inline-block; width: 100%';
		formContent += ` <a href="https://www.google.com/maps?layer=c&cbll=${lat},${lng}" style="padding:4px; ${align};" target="_blank">Street View</a>`;

		formpopup.setContent(formContent + '</div>');
		formpopup.openOn(map);

		const deleteLink = formpopup._contentNode.querySelector('#deletePortalCandidate');
		if (deleteLink != null) {
			deleteLink.addEventListener('click', e => confirmDeleteCandidate(e, id));
		}
		const expander = formpopup._contentNode.querySelector('.wayfarer-expander');
		expander.addEventListener('click', function () {
			expander.parentNode.classList.toggle('wayfarer__expanded');
		});

	}

	function confirmDeleteCandidate(e, id) {
		e.preventDefault();

		if (!confirm('Do you want to remove this candidate?'))
			return;

		const formData = new FormData();
		formData.append('status', 'delete');
		formData.append('id', id);

		$.ajax({
			url: settings.scriptURL,
			type: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			success: function (data, status, header) {
				removeExistingMarker(id);
				map.closePopup();
			},
			error: function (x, y, z) {
				console.log('Wayfarer Planner. Error message: ', x, y, z); // eslint-disable-line no-console
				alert('Wayfarer Planner. Failed to send data to the scriptURL');
			}
		});
	}

	function markerClicked(event) {
		// bind data to edit form
		if (editmarker != null) {
			map.removeLayer(editmarker);
			editmarker = null;
		}
		drawInputPopop(event.layer.getLatLng(), event.layer.options.data);
	}

	function getGenericMarkerSvg(color) {
		const markerTemplate = `<?xml version="1.0" encoding="UTF-8"?>
			<svg xmlns="http://www.w3.org/2000/svg" baseProfile="full" viewBox="0 0 25 41">
				<path d="M19.4,3.1c-3.3-3.3-6.1-3.3-6.9-3.1c-0.6,0-3.7,0-6.9,3.1c-4,4-1.3,9.4-1.3,9.4s5.6,14.6,6.3,16.3c0.6,1.2,1.3,1.5,1.7,1.5c0,0,0,0,0.2,0h0.2c0.4,0,1.2-0.4,1.7-1.5c0.8-1.7,6.3-16.3,6.3-16.3S23.5,7.2,19.4,3.1z M13.1,12.4c-2.3,0.4-4.4-1.5-4-4c0.2-1.3,1.3-2.5,2.9-2.9c2.3-0.4,4.4,1.5,4,4C15.6,11,14.4,12.2,13.1,12.4z" fill="%COLOR%" stroke="#fff"/>
				<path d="M12.5,34.1c1.9,0,3.5,1.5,3.5,3.5c0,1.9-1.5,3.5-3.5,3.5S9,39.5,9,37.5c0-1.2,0.6-2.2,1.5-2.9 C11.1,34.3,11.8,34.1,12.5,34.1z" fill="%COLOR%" stroke="#fff"/>
			</svg>`;

		return markerTemplate.replace(/%COLOR%/g, color);
	}

	function getGenericMarkerIcon(color, className) {
		return L.divIcon({
			iconSize: new L.Point(25, 41),
			iconAnchor: new L.Point(12, 41),
			html: getGenericMarkerSvg(color),
			className: className || 'leaflet-iitc-divicon-generic-marker'
		});
	}

	function createGenericMarker(ll, color, options) {
		options = options || {};

		const markerOpt = $.extend({
			icon: getGenericMarkerIcon(color || '#a24ac3')
		}, options);

		return L.marker(ll, markerOpt);
	}

	function showDialog() {
		if (window.isSmartphone())
			window.show('map');

		const html =
			`<p><label for="txtScriptUrl">Url for the script</label><br><input type="url" id="txtScriptUrl" spellcheck="false" placeholder="https://script.google.com/macros/***/exec"></p>
			 <p><a class='wayfarer-refresh'>Update candidate data</a></p>
			 <p><input type="checkbox" id="chkShowTitles"><label for="chkShowTitles">Show titles</label></p>
			 <p><input type="checkbox" id="chkShowRadius"><label for="chkShowRadius">Show submit radius</label></p>
			 <p><input type="checkbox" id="chkShowInteractRadius"><label for="chkShowInteractRadius">Show interaction radius</label></p>
			 <p><input type="checkbox" id="chkPlaceMarkers"><label for="chkPlaceMarkers">Click on the map to add markers</label></p>
			`;

		const container = dialog({
			width: 'auto',
			html: html,
			title: 'Wayfarer Planner',
			buttons: {
				OK: function () {
					const newUrl = txtInput.value;
					if (!txtInput.reportValidity())
						return;

					if (newUrl != '') {
						if (!newUrl.startsWith('https://script.google.com/macros/')) {
							alert('The URL of the script seems to be wrong, please paste the URL provided after "creating the webapp".');
							return;
						}

						if (newUrl.includes('echo') || !newUrl.endsWith('exec')) {
							alert('You must use the short URL provided by "creating the webapp", not the long one after executing the script.');
							return;
						}
						if (newUrl.includes(' ')) {
							alert('Warning, the URL contains at least one space. Check that you\'ve copied it properly.');
							return;
						}
					}

					if (newUrl != settings.scriptURL) {
						settings.scriptURL = newUrl;
						saveSettings();
						getStoredData();
					}

					container.dialog('close');
				}
			}
		});

		const div = container[0];
		const txtInput = div.querySelector('#txtScriptUrl');
		txtInput.value = settings.scriptURL;

		const linkRefresh = div.querySelector('.wayfarer-refresh');
		linkRefresh.addEventListener('click', () => {
			settings.scriptURL = txtInput.value;
			saveSettings();
			getStoredData();
		});

		const chkShowTitles = div.querySelector('#chkShowTitles');
		chkShowTitles.checked = settings.showTitles;

		chkShowTitles.addEventListener('change', e => {
			settings.showTitles = chkShowTitles.checked;
			saveSettings();
			drawMarkers();
		});

		const chkShowRadius = div.querySelector('#chkShowRadius');
		chkShowRadius.checked = settings.showRadius;
		chkShowRadius.addEventListener('change', e => {
			settings.showRadius = chkShowRadius.checked;
			saveSettings();
			drawMarkers();
		});
		const chkShowInteractRadius = div.querySelector('#chkShowInteractRadius');
		chkShowInteractRadius.checked = settings.showInteractionRadius;
		chkShowInteractRadius.addEventListener('change', e => {
			settings.showInteractionRadius = chkShowInteractRadius.checked;
			saveSettings();
			drawMarkers();
		});

		const chkPlaceMarkers = div.querySelector('#chkPlaceMarkers');
		chkPlaceMarkers.checked = isPlacingMarkers;
		chkPlaceMarkers.addEventListener('change', e => {
			isPlacingMarkers = chkPlaceMarkers.checked;
			if (!isPlacingMarkers && editmarker != null) {
				map.closePopup();
				map.removeLayer(editmarker);
				editmarker = null;
			}
			//settings.isPlacingMarkers = chkPlaceMarkers.checked;
			//saveSettings();
		});

		if (!settings.scriptURL) {
			chkPlaceMarkers.disabled = true;
			chkPlaceMarkers.parentNode.classList.add('wayfarer-planner__disabled');
			linkRefresh.classList.add('wayfarer-planner__disabled');
		}
		txtInput.addEventListener('input', e => {
			chkPlaceMarkers.disabled = !txtInput.value;
			chkPlaceMarkers.parentNode.classList.toggle('wayfarer-planner__disabled', !txtInput.value);
			linkRefresh.classList.toggle('wayfarer-planner__disabled', !txtInput.value);
		});
	}

	// Initialize the plugin
	const setup = function () {
		loadSettings();

		$('<style>')
			.prop('type', 'text/css')
			.html(`
			.wayfarer-planner-popup {
				width:200px;
			}
			.wayfarer-planner-popup a {
				color: #ffce00;
			}
			.wayfarer-planner-name {
				font-size: 12px;
				font-weight: bold;
				color: gold;
				opacity: 0.7;
				text-align: center;
				text-shadow: -1px -1px #000, 1px -1px #000, -1px 1px #000, 1px 1px #000, 0 0 2px #000;
				pointer-events: none;
			}
			#txtScriptUrl {
				width: 100%;
			}
			.wayfarer-planner__disabled {
				opacity: 0.8;
				pointer-events: none;
			}

			#submit-to-wayfarer {
				position: relative;
			}
			#submit-to-wayfarer input,
			#submit-to-wayfarer select {
				width: 100%;
			}
			#submit-to-wayfarer input {
				color: #CCC;
			}
			#submit-to-wayfarer label {
				margin-top: 5px;
				display: block;
				color: #fff;
			}
			#wayfarer-submit {
				height: 30px;
				margin-top: 10px;
				width: 100%;
			}

			.wayfarer-expander {
				cursor: pointer;
				transform: rotate(90deg) translate(-1px, 1px);
				transition: transform .2s ease-out 0s;
				position: absolute;
				right: 0;
			}

			.wayfarer-extraData {
				max-height: 0;
				overflow: hidden;
				margin-top: 1em;
			}

			.wayfarer__expanded .wayfarer-expander {
				transform: rotate(270deg) translate(1px, -3px);
			}

			.wayfarer__expanded .wayfarer-extraData {
				max-height: none;
				margin-top: 0em;
			}

			`)
			.appendTo('head');

		$('body').on('submit','#submit-to-wayfarer', function (e) {
			e.preventDefault();
			map.closePopup();
			$.ajax({
				url: settings.scriptURL,
				type: 'POST',
				data: new FormData(e.currentTarget),
				processData: false,
				contentType: false,
				success: function (data, status, header) {
					drawMarker(data);
					if (editmarker != null) {
						map.removeLayer(editmarker);
						editmarker = null;
					}
				},
				error: function (x, y, z) {
					console.log('Wayfarer Planner. Error message: ', x, y, z); // eslint-disable-line no-console
					alert('Wayfarer Planner. Failed to send data to the scriptURL.\r\nVerify that you\'re using the right URL and that you don\'t use any extension that blocks access to google.');
				}
			});
		});

		map.on('click', onMapClick);

		Object.values(mapLayers).forEach(data => {
			const layer = new L.featureGroup();
			data.layer = layer;
			window.addLayerGroup('Wayfarer - ' + data.title, layer, true);
			layer.on('click', markerClicked);
		});

		const toolbox = document.getElementById('toolbox');

		const toolboxLink = document.createElement('a');
		toolboxLink.textContent = 'Wayfarer';
		toolboxLink.title = 'Settings for Wayfarer Planner';
		toolboxLink.addEventListener('click', showDialog);
		toolbox.appendChild(toolboxLink);

		if (settings.scriptURL) {
			getStoredData();
		} else {
			showDialog();
		}
	};

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
// wrapper end

(function () {
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