// ==UserScript==
// @author         DanielOnDiordna
// @name           Maps Route Planner
// @category       Navigate
// @version        2.1.1.20230307.232000
// @updateURL      https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/DanielOnDiordna/maps-route-planner.meta.js
// @downloadURL    https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/DanielOnDiordna/maps-route-planner.user.js
// @description    [danielondiordna-2.1.1.20230307.232000] Plan a route with multiple portals (max 9 waypoints) and open Google Maps to start your navigation.
// @id             maps-route-planner@DanielOnDiordna
// @namespace      https://softspot.nl/ingress/
// @homepageURL    https://softspot.nl/ingress/plugins/documentation/iitc-plugin-maps-route-planner.user.js.html
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    // use own namespace for plugin
    window.plugin.mapsrouteplanner = function() {};
    var self = window.plugin.mapsrouteplanner;
    self.id = 'mapsrouteplanner';
    self.title = 'Maps Route Planner';
    self.version = '2.1.1.20230307.232000';
    self.author = 'DanielOnDiordna';
    self.changelog = `
Changelog:

version 2.1.1.20230307.232000
- fixed storing origin setting

version 2.1.0.20230108.201200
- maps button will now setup a route to a single portal when no route is planned

version 2.0.1.20220516.085200
- modified file export format from application/json to text/plain
- modified file import accept to text/*,application/json
- added some space between menu buttons

version 2.0.0.20220515.230000
- moved the waypoints editor to a separate menu
- added icons to the About text
- added notification titles to the controls button to select a portal, add or remove a waypoint
- added total waypoints indicator in the controls
- added row animation when moving waypoints up or down
- total incidator opens the waypoint editor menu
- changed the main menu layout to make things easier to use
- edit waypoints menu opens at to the top of the screen so when minimized it is easier to see the map
- added an option to show or hide characters on the waypoints
- added transfer menu, with waypoints copy/paste buttons and waypoints file import/export buttons
- added travelmode options

version 1.1.1.20220409.003100
- fixed clear all waypoints to actually store empty waypoints

version 1.1.0.20220409.000700
- added clickable waypoint names to select the portals
- added an edit checkbox to toggle up/down and delete buttons
- added move up/down buttons to order the waypoints list
- added more about information
- added a zoom all button
- changed the route color to light blue

version 1.0.0.20220407.231800
- first release
- controls buttons
- dialog menu
- create maps link
- copy link to clipboard
`;
    self.namespace = 'window.plugin.' + self.id + '.';
    self.pluginname = 'plugin-' + self.id;
    self.localstoragesettings = self.pluginname + '-settings';
    self.localstoragewaypoints = self.pluginname + '-wayppoints';

    self.maxwaypoints = 9;
    self.waypoints = {};
    self.waypointsroutelayer = undefined;

    self.settings = {};
    self.settings.origin = 'mylocation';
    self.settings.routebackgroundcolor = '#1866d2';
    self.settings.routeforegroundcolor = '#afcbfa';
    self.settings.showchars = true;
    self.settings.travelmode = '';

    let iconplus = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAWlBMVEUAAABAQEA8QEM8QEM9QEM8QEM8QEQ+QEM9QEM8QEM7QEM9QEI8QEM4QEA6QEA6QEI9QEI8QEI8QEQ8QEI7QEQ7QEI9QEQ7QEI7QEM6QEU8QEI8QEM8QEI8QEQtKiW6AAAAHnRSTlMAEG+v3//PX1Dv34+/IDBg339/73Bwj9+wMM+QgIDjtixxAAAApklEQVR4AZ3PBZLEQAwEwbZnysyM/3/moRaOIQMVYv1bEDoPkYv1VpJisjepHIqwlKq6gVZXHf0gM/ZMMjV9pauqJ9Erz2s9vPaQBtYw6z6hglHPHPHbxMiiZxHV20RJdosxFnyf8JRvR61stnx8m6ht+UjxNuHtzKC3FkuE2F9KSFddrSmxzE46yoQph65OyOJKKsMCdt2pG0yf6K3abeBdGOi/HgG26wa33olV8gAAAABJRU5ErkJggg==";
    let iconmin = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAASFBMVEUAAABAQEA8QEM8QEM9QEM8QEM+QEM6QEI8QEM7QEM9QEI8QEM4QEA6QEA9QEI9QEQ8QEI7QEQ7QEI7QEI4QEg7QEM6QEU8QEMGGXchAAAAGHRSTlMAEG+v3/9fYO/fj78gMN+P73Bw3yCwMJBqLeWcAAAAuklEQVR4AZ1RBxKEIBBDJHSw6/9feuqa61MNPdk6qNtodGsA09of3nkQ4UuKQNJZqeIq0H3y/aCIsX8rDn15W5UellcD2tMHvqHDdOxzmrmphFGEFlZeYZ4NkrgsjHRmyBXBYMrnFUEE4NhEEf7N8JgNEGYyDJUvfqqXsiIw+SjJp5yrJHdMPsorp8xNGXbY9Kyb0Jh4c/Drm189HQ5s8C8f7bHxKgqCLUcOnUCecBVE//eH19fqRt3FDujJB6LV1n2XAAAAAElFTkSuQmCC";
    let iconlogo = "data:image/png;base64,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";
    let iconmenu = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAB3RJTUUH5QgWEyMyp0FY2wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAARnQU1BAACxjwv8YQUAAAKoSURBVHja7Zo/SFxBEMb3GQvFIpoY6yjcgdgmRVKYwlJBSaugYKmNNsYEDAmIYmMEa4OgpYWo2AkKVlqr3IFa+zcWEpvk+Y1vrzm5Y+e4ZVZvfjDsO7hl5/vuvd3ZfWeMoiiKoiiKolQkEefLqVQqymQycTqdfoGPs4hexCthDVeIZcQIcvuH3KJsNht7MSCOY4MBXuNyEdEpLDyfDUQ/TLiMIndZ3DuAfvnVAMXnWEd04w7479qhijnAbMDiiS6bozNcA/qkFZY7R64B9dLqHGjwacCJtDoHjn0aMIm4k1ZYhL82Rz8GYIlZQDMjrbIIM8jxN6cDuw4gUAuMoPmCaJJWbDlDTEH8rwdRHusAugtyJjSieW/CqAT3kNeFzcugDnDuXM0djQYg7ICbwuIf5aUoPFhzAEHzAJGbC0Ih9whwnn+2AfniMWgdmhph7XfI57ZUE9iTIInHQK24HEe0I14KG3CDfHZMsgwecifDUs4DOnC5EoDwR0YgPsOELZ91QJtJ9txvpdUW4BTRiUfgwLUDdy8wH7B4Y3Ob53TgGvBRWmG5c+Qa8OzgGrArnXC5c+QaMGySiSZUTmyOfgzAEkOz66BJlpzQ+EO5US3A6cQqhKjIoHUW7QeTnAd8MvL1AP0Y2yYphI68FkLPsRSu+M2QUumUNAcQoT4ChPftsB3wDZp3JoxD0X3kdZ5vhAulHouPohkzYR2LT8OEhxej3rbD9jzgBy4npBUX4CdM+O7zPICqQNpuSq/9haBXY0OYA5zfDnH3Al8DFk/UIr5xOnANaJZW6ECLTwOupdU5cOXTgCVpdeXOkWsAvRVel1ZYhDXEqDcDsMTQv6/6AzWBxA/YHP0YQH9CxAD0jHUj5hCX0qptDpRLD+VGOUonpCiKoiiKoihPgHtXV96aolVzHAAAAABJRU5ErkJggg==";

    self.restoresettings = function() {
        // read stored data in a very safe way:
        function isObject(element) {
            return (typeof element == 'object' && element instanceof Object && !(element instanceof Array));
        }

        function parseSettings(source,target) {
            if (!isObject(source) || !isObject(target)) return;

            for (const key in target) {
                if (key in source) {
                    if (isObject(target[key])) {
                        parseSettings(source[key],target[key]);
                    } else if (typeof source[key] == typeof target[key]) { // only accept settings from default settings template of same type
                        target[key] = source[key];
                    }
                }
            }
        }

        try {
            if (typeof localStorage.getItem(self.localstoragesettings) != 'string' || localStorage.getItem(self.localstoragesettings) == '') {
                setTimeout(function() { self.about(); },1000);
                return;
            }
            let storedsettings = JSON.parse(localStorage.getItem(self.localstoragesettings));
            parseSettings(storedsettings,self.settings);
            if (!isObject(storedsettings) || !('showchars' in storedsettings)) setTimeout(function() { self.about(); },1000); // show about if a new item is added
        } catch(e) {
            return false;
        }
    };
    self.storesettings = function() {
        try {
            return localStorage.setItem(self.localstoragesettings, JSON.stringify(self.settings));
        } catch(error) {
            alert(error.toString());
        }
    };

    self.restoreWaypoints = function() {
        // read stored data in a very safe way:
        try {
            if (self.localstoragewaypoints in localStorage) {
                let data = localStorage.getItem(self.localstoragewaypoints);
                self.import(data);
            }
        } catch(error) {
            alert(error.toString());
        }
    };
    self.storeWaypoints = function() {
        try {
            return localStorage.setItem(self.localstoragewaypoints, JSON.stringify(self.waypoints));
        } catch(error) {
            alert(error.toString());
        }
    };

    self.import = function(data) {
        if (!data) return;
        try {
            let waypoints = JSON.parse(data);
            if (typeof waypoints == 'object' && !(waypoints instanceof Array)) {
                self.waypoints = {};
                for (const guid in waypoints) {
                    if (waypoints[guid]?.latlng?.lat && waypoints[guid]?.latlng?.lng && waypoints[guid]?.name) {
                        self.waypoints[guid] = {
                            latlng: {
                                lat: waypoints[guid].latlng.lat,
                                lng: waypoints[guid].latlng.lng
                            },
                            name: waypoints[guid].name
                        }
                    }
                }
            }
        } catch(error) {
            alert(error.toString());
        }
    }

    self.drawRoute = function() {
        // remove existing route:
		self.waypointsroutelayer.eachLayer(function(layer) {
			self.waypointsroutelayer.removeLayer(layer);
		}, this);

        // backgroundpath:
        let backgroundcolor = self.settings.routebackgroundcolor;
        let latlngs = [];

        for (let guid in self.waypoints) {
            let waypoint = self.waypoints[guid];
            let ll = [waypoint.latlng.lat, waypoint.latlng.lng];
            latlngs.push(ll);

            let backgroundmarker = window.L.circleMarker(ll, {
                radius: (latlngs.length == 1 ? 12.0 : 9.0), // make the first one larger
                weight: 1,
                opacity: 1,
                color: backgroundcolor,
                fillColor: backgroundcolor,
                fillOpacity: 1.0,
                dashArray: null,
                background: true,
                interactive: false
            });
            self.waypointsroutelayer.addLayer(backgroundmarker);
        }

        let backgroundline = window.L.geodesicPolyline(latlngs, {
            color: backgroundcolor,
            opacity: 1,
            weight: 10,
            background: true,
            interactive: false,
            dashArray: undefined
        });
        self.waypointsroutelayer.addLayer(backgroundline);

        // foregroundpath:
        let foregroundcolor = self.settings.routeforegroundcolor;
        latlngs = [];
        for (let guid in self.waypoints) {
            let waypoint = self.waypoints[guid];
            let ll = [waypoint.latlng.lat, waypoint.latlng.lng];
            latlngs.push(ll);

			let foregroundmarker = window.L.circleMarker(ll, {
					radius: (latlngs.length == 1 ? 10.0 : 7.0), // make the first one larger
					weight: 1,
					opacity: 1,
					color: foregroundcolor,
					fill: true,
					fillColor: foregroundcolor,
					fillOpacity: 1.0,
					dashArray: null,
					background: false,
					interactive: false
				});
			self.waypointsroutelayer.addLayer(foregroundmarker);
		}

		let foregroundline = window.L.geodesicPolyline(latlngs, {
			color: foregroundcolor,
			opacity: 1,
			weight: 5,
			background: false,
			interactive: false,
			dashArray: undefined
		});
		self.waypointsroutelayer.addLayer(foregroundline);

        if (self.settings.showchars) {
            let charcnt = 'A'.charCodeAt(0);
            for (let guid in self.waypoints) {
                let waypoint = self.waypoints[guid];
                let ll = [waypoint.latlng.lat, waypoint.latlng.lng];

                let icon = new window.L.DivIcon({
                    html: String.fromCharCode(charcnt),
                    className: self.id + '-waypoint-numbers',
                    iconSize: [22,22]
                });
                charcnt++;
                window.L.marker(ll, {
                    icon: icon,
                    interactive: false,
                    keyboard: false,
                    width: '35px'
                }).addTo(self.waypointsroutelayer);
            }
        }
    };

    self.getMapsLink = function() {
        let link = "https://www.google.com/maps/dir/?api=1"; // maps.google.com did not work on android
        let latlngwaypoints = [];
        for (let guid in self.waypoints) {
            let latlng = self.waypoints[guid].latlng;
            latlngwaypoints.push(latlng.lat + "," + latlng.lng);
        }
        if (!latlngwaypoints.length && window.selectedPortal) {
            let latlng = window.portals[window.selectedPortal].getLatLng();
            latlngwaypoints.push(latlng.lat + "," + latlng.lng);
        }
        if (latlngwaypoints.length > 0) {
            link += '&destination=' + latlngwaypoints.pop(); // only=first=last
        }
        if (latlngwaypoints.length > 0 && self.settings.origin == 'firstportal') {
            link += '&origin=' + latlngwaypoints.shift();
        }
        if (self.settings.travelmode) {
            link += '&travelmode=' + self.settings.travelmode;
        }
        if (latlngwaypoints.length > 0) {
            link += '&waypoints=' + latlngwaypoints.join('|').replaceAll(',','%2C').replaceAll('|','%7C');
        }
        return link;
    };

    self.updateMenu = function() {
        let link = self.getMapsLink();
        $("a[name=" + self.id + "-link]").prop('href',link);

        let portalnames = [];
        let editwaypoints = [];
        let charcnt = 'A'.charCodeAt(0);
        let cnt = 0;
        for (let guid in self.waypoints) {
            portalnames.push('<div class="' + self.id + '-waypoints-row" guid="' + guid + '"><span class="' + self.id + '-waypoints-row-char">' + String.fromCharCode(charcnt) + '</span><a href="#" name="' + self.id + '-portal-link" guid="' + guid + '" class="' + self.id + '-waypoints-row-link">' + self.waypoints[guid].name + '</a></div>');
            editwaypoints.push('<div class="' + self.id + '-waypoints-row" guid="' + guid + '"><input type="button" value="↑" name="' + self.id + '-up-button"' + (cnt == 0?' disabled':'') + '> <input type="button" value="↓" name="' + self.id + '-down-button"' + (cnt + 1 == Object.keys(self.waypoints).length?' disabled':'') + '><span class="' + self.id + '-waypoints-row-char">' + String.fromCharCode(charcnt) + '</span><a href="#" name="' + self.id + '-portal-link" guid="' + guid + '" class="' + self.id + '-waypoints-row-link">' + self.waypoints[guid].name + '</a> <input type="button" value="X" name="' + self.id + '-delete-button"></div>');
            charcnt++;
            cnt++;
        }
        if (!cnt) {
            portalnames.push('<div>There are no waypoints defined.<br>\nSelect a portal and mark as a waypoint from the controls toolbar.</div>');
            editwaypoints = portalnames;
        }

        $("div[name=" + self.id + "-waypoints-div]").html(portalnames.join('\n'));
        $("div[name=" + self.id + "-waypoints-edit-div]").html(editwaypoints.join('\n'));
        $("input[name=" + self.id + "-delete-button]").on('click',function(evt) {
            let guid = this.parentElement.getAttribute('guid');
            if (!confirm('Are you sure you want to delete this waypoint?\n' + self.waypoints[guid].name)) return;
            delete(self.waypoints[guid]);
            self.storeWaypoints();
            self.updateMenu();
            self.updateControls();
            self.drawRoute();
        });

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        let animating = false;
        async function swaptopbottom(topelement,bottomelement,delay) {
            animating = true;
            // animate movement
            let elementWidth = topelement.clientWidth - 1;
            let rowHeight = topelement.clientHeight;
            let animationLength = delay;
            topelement.setAttribute('style', `width:${elementWidth}px; transform: translate(0px, ${rowHeight}px); transition: transform ${animationLength}ms`);
            bottomelement.setAttribute('style', `width:${elementWidth}px; transform: translate(0px, -${rowHeight}px); transition: transform ${animationLength}ms`);

            await sleep(delay);
            animating = false;
        };

        $("input[name=" + self.id + "-up-button]").on('click',async function(evt) {
            if (animating) return;

            // move selected guid up:
            let selectedguid = this.parentElement.getAttribute('guid');
            if (!(selectedguid in self.waypoints)) return; // something went wrong!
            let waypointkeys = Object.keys(self.waypoints);
            let guidindex = waypointkeys.indexOf(selectedguid);
            if (guidindex-1 < 0) return; // already the top guid
            let targetguid = waypointkeys[guidindex-1]; // needed for the animation
            waypointkeys[guidindex-1] = waypointkeys.splice(guidindex, 1, waypointkeys[guidindex-1])[0];
            let source = {...self.waypoints};
            self.waypoints = {};
            for (let guid of waypointkeys) {
                self.waypoints[guid] = source[guid];
            }
            self.storeWaypoints();
            self.updateControls();
            self.drawRoute();

            // animate rows:
            let thisrow = document.querySelector(`a[name=${self.id}-portal-link][guid="${selectedguid}"]`);
            let previousrow = document.querySelector(`a[name=${self.id}-portal-link][guid="${targetguid}"]`);
            await swaptopbottom(previousrow,thisrow,600);

            self.updateMenu();
        });
        $("input[name=" + self.id + "-down-button]").on('click',async function(evt) {
            if (animating) return;

            // move selected guid down:
            let selectedguid = this.parentElement.getAttribute('guid');
            if (!(selectedguid in self.waypoints)) return; // something went wrong!
            let waypointkeys = Object.keys(self.waypoints);
            let guidindex = waypointkeys.indexOf(selectedguid);
            if (guidindex+1 >= waypointkeys.length) return; // already the bottom guid
            let targetguid = waypointkeys[guidindex+1]; // needed for the animation
            waypointkeys[guidindex+1] = waypointkeys.splice(guidindex, 1, waypointkeys[guidindex+1])[0];
            let source = {...self.waypoints};
            self.waypoints = {};
            for (let guid of waypointkeys) {
                self.waypoints[guid] = source[guid];
            }
            self.storeWaypoints();
            self.updateControls();
            self.drawRoute();

            // animate rows:
            let thisrow = document.querySelector(`a[name=${self.id}-portal-link][guid="${selectedguid}"]`);
            let nextrow = document.querySelector(`a[name=${self.id}-portal-link][guid="${targetguid}"]`);
            await swaptopbottom(thisrow,nextrow,600);

            self.updateMenu();
        });
        $("a[name=" + self.id + "-portal-link]").on('click',function(evt) {
            evt.preventDefault();
            let guid = this.getAttribute('guid');
            let position = new window.L.LatLng(self.waypoints[guid].latlng.lat,self.waypoints[guid].latlng.lng);
            if (window.portals[guid]) {
                if (!window.map.getBounds().contains(position)) window.map.setView(position);
                window.renderPortalDetails(guid);
            } else {
                window.selectPortalByLatLng(position);
            }
            return false;
        });
    };

    self.about = function() {
        let container = document.createElement('div');
        container.innerHTML = `
        <input type="hidden" autofocus>
        <p>Thank you for using the ${self.title} plugin.<br>
        With this plugin you can plan a route with multiple portals and open Google Maps to start your navigation.</p>
        <p>Start by selecting your first destination portal. Click the <img src="${iconplus}" width="16" height="16" style="background-color: white;"> on the control buttons toolbar. A route marker will be drawn.<br>
        Select your next destination portal and click the <img src="${iconplus}" width="16" height="16" style="background-color: white;"> button again. A route will be drawn.<br>
        Click the <img src="${iconmin}" width="16" height="16" style="background-color: white;"> button to remove a selected waypoint.<br>
        Continue with more portals, up to ${self.maxwaypoints} portals.<br>
        Click on the <img src="${iconlogo}" width="16" height="16" style="background-color: white;"> Maps marker to open the route in Maps</p>
        <p>From the <img src="${iconmenu}" width="16" height="16" style="background-color: white;"> menu you can edit the waypoints list. You can move waypoints up or down, or delete a single waypoint. You can also clear all waypoints.</p>
        <p>You can also share the Maps URL to share or store for later use.</p>
        <p>Share this plugin with this link: <a href="https://softspot.nl/ingress/#iitc-plugin-maps-route-planner.user.js" target="_blank">Softspot IITC plugins</a> to get the latest version.</p>
        <div style="margin-top: 14px; font-style: italic; font-size: smaller;">${self.title} version ${self.version} by ${self.author}</div>
        `;
        window.dialog({
            html: container,
            id: self.pluginname + '-dialog',
            dialogClass: 'ui-dialog-' + self.pluginname,
            title: self.title + ' - About',
            width: 'auto'
        }).dialog('option', 'buttons', {
            '< Main menu': function() { self.menu(); },
            'Changelog': function() { alert(self.changelog); },
            'Close': function() { $(this).dialog('close'); }
        });
    };

    self.timestamp = function() {
        function leadingzero(value) {
            return ('0' + value).slice(-2);
        }
        let d = new Date();
        return d.getFullYear() + leadingzero(d.getDate()) + leadingzero(d.getMonth()) + '_' + leadingzero(d.getHours()) + leadingzero(d.getMinutes());
    };

    self.transfermenu = function() {
        let container = document.createElement('div');
        container.className = self.id + '-transfer-menu';
        container.innerHTML = `
        <input type="hidden" autofocus>
        <input type="button" name="${self.id}-share-button" value="Share Maps URL"><br>
        <input type="button" name="${self.id}-copy-button" value="Export waypoints (copy)"><br>
        <input type="button" name="${self.id}-paste-button" value="Import waypoints (paste)"><br>
        <input type="button" name="${self.id}-export-button" value="Save waypoints to file"><br>
        <input type="button" name="${self.id}-import-button" value="Import waypoints from file"><br>
        <input type="button" name="${self.id}-zoom-button" value="Zoom to waypoints"><br>
        <input type="button" name="${self.id}-edit-button" value="Edit waypoints"><br>
        <input type="button" name="${self.id}-clear-button" value="Clear all waypoints">
        <div style="margin-top: 14px; font-style: italic; font-size: smaller;">${self.title} version ${self.version} by ${self.author}</div>
        `;
        window.dialog({
            html: container,
            id: self.pluginname + '-dialog',
            dialogClass: 'ui-dialog-' + self.pluginname,
            title: self.title + ' - Transfer',
            width: 'auto'
        }).dialog('option', 'buttons', {
            '< Main menu': function() { self.menu(); },
            'Close': function() { $(this).dialog('close'); }
        });

        $("input[name=" + self.id + "-share-button]").on('click', function (evt) {
            let link = self.getMapsLink();
            if (typeof android !== 'undefined' && android?.shareString) {
                return android.shareString(link);
            } else if (navigator?.clipboard?.writeText) {
                navigator.clipboard.writeText(link).then(() => {
                    alert('Maps URL copied to clipboard');
                }).catch(() => {
                    alert("I'm sorry, link copy failed (does not work on mobile)");
                });
            } else {
                alert("I'm sorry, link copy not available");
            }
        });
        $("input[name=" + self.id + "-copy-button]").on('click', function (evt) {
            let data = JSON.stringify(self.waypoints);
            if (typeof android !== 'undefined' && android?.shareString) {
                return android.shareString(data);
            } else if (navigator?.clipboard?.writeText) {
                navigator.clipboard.writeText(data).then(() => {
                    alert('Waypoints data copied to clipboard');
                }).catch(() => {
                    alert("I'm sorry, copy failed (does not work on mobile)");
                });
            } else {
                alert("I'm sorry, copy not available");
            }
        });
        $("input[name=" + self.id + "-paste-button]").on('click', function (evt) {
            let data = prompt("Paste waypoints data:");
            if (!data) return;
            self.import(data);
            self.storeWaypoints();
            self.updateControls();
            self.drawRoute();
        });
        $("input[name=" + self.id + "-export-button]").on('click', function (evt) {
            let filename = "IITC-" + self.id + '_waypointsdata_' + self.timestamp() + ".json";
            var data = JSON.stringify(self.waypoints);
            if (typeof window.saveFile == 'function') { // iitc-ce method
                window.saveFile(data, filename, "text/plain"); // "application/json"
            } else if (!window.isSmartphone()) { // pc method
                let a = document.createElement('a');
                a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(data); // text/json
                a.download = filename;
                a.click();
            } else if (typeof android !== 'undefined' && android && android.saveFile) { // iitc-me method
                android.saveFile(filename, "text/plain", data); // application/json
            } else {
                alert("I'm sorry, save not available");
            }
        });
        $("input[name=" + self.id + "-import-button]").on('click', function (evt) {
            window.L.FileListLoader.loadFiles({accept:'application/json,text/plain'}) // application/json
                .on('load',function (e) {
                try {
                    self.import(e.reader.result);
                    self.storeWaypoints();
                    self.updateControls();
                    self.drawRoute();
                } catch(e) {
                    alert("I'm sorry, file import failed");
                }
            });
        });
        $("input[name=" + self.id + "-zoom-button]").on('click', function (evt) {
            if (!Object.keys(self.waypoints).length) return;
            window.map.fitBounds(self.waypointsroutelayer.getBounds());
        });
        $("input[name=" + self.id + "-edit-button]").on('click', function (evt) {
            self.waypointsmenu();
        });
        $("input[name=" + self.id + "-clear-button]").on('click', function (evt) {
            if (Object.keys(self.waypoints).length == 0) return;
            if (!confirm('Are you sure you want to clear all (' + Object.keys(self.waypoints).length + ') waypoints?')) return;
            self.waypoints = {};
            self.storeWaypoints();
            self.updateControls();
            self.drawRoute();
        });
    };

    self.waypointsmenu = function() {
        let container = document.createElement('div');
        container.innerHTML = `
        <input type="hidden" autofocus>
        Change order or delete waypoints:<br>
        <div name="${self.id}-waypoints-edit-div"></div>
        <input type="button" name="${self.id}-reverse-button" value="Reverse route">
        <input type="button" name="${self.id}-zoom-button" value="Zoom to waypoints"><br>
        <input type="button" name="${self.id}-clear-button" value="Clear all waypoints">
        <div style="margin-top: 14px; font-style: italic; font-size: smaller;">${self.title} version ${self.version} by ${self.author}</div>
        `;

        let position = { my: "center", at: "top" };
        window.dialog({
            html: container,
            id: self.pluginname + '-dialog',
            dialogClass: 'ui-dialog-' + self.pluginname,
            title: self.title + ' - Edit waypoints',
            width: 'auto',
            position: position
        }).dialog('option', 'buttons', {
            '< Main menu': function() { self.menu(); },
            'Close': function() { $(this).dialog('close'); }
        });
        $("input[name=" + self.id + "-reverse-button]").on('click', function (evt) {
            if (Object.keys(self.waypoints).length == 0) return;

            let waypointkeys = Object.keys(self.waypoints);
            waypointkeys = waypointkeys.reverse();
            let source = {...self.waypoints};
            self.waypoints = {};
            for (let guid of waypointkeys) {
                self.waypoints[guid] = source[guid];
            }

            self.storeWaypoints();
            self.updateMenu();
            self.updateControls();
            self.drawRoute();
        });
        $("input[name=" + self.id + "-zoom-button]").on('click', function (evt) {
            if (!Object.keys(self.waypoints).length) return;
            window.map.fitBounds(self.waypointsroutelayer.getBounds());
        });
        $("input[name=" + self.id + "-clear-button]").on('click', function (evt) {
            if (Object.keys(self.waypoints).length == 0) return;
            if (!confirm('Are you sure you want to clear all (' + Object.keys(self.waypoints).length + ') waypoints?')) return;
            self.waypoints = {};
            self.storeWaypoints();
            self.updateMenu();
            self.updateControls();
            self.drawRoute();
        });

        self.updateMenu();
        self.drawRoute(); // brings route to top
    }

    self.menu = function() {
        let container = document.createElement('div');
        container.className = self.id + '-main-menu';
        container.innerHTML = `
        <input type="hidden" autofocus>
        Mark portals as waypoints to prepare a route (use max ${self.maxwaypoints} waypoints).<br>
        Waypoints:
        <div name="${self.id}-waypoints-div"></div>
        <input type="button" name="${self.id}-zoom-button" value="Zoom to waypoints"><br>
        <input type="button" name="${self.id}-link-button" style="background-image: url(${iconlogo}); background-size: 16px; background-repeat: no-repeat; cursor: pointer; padding-left: 16px; vertical-align: middle;" value="Open waypoints route in Maps"><br>
        <input type="button" name="${self.id}-share-button" value="Share Maps URL"><br>
        Travelmode: <select name="${self.id}-travelmode-select"></select><br>
        <label><input type="radio" name="${self.id}-origin-radio" value="mylocation">Use your location as origin (default)</label><br>
        <label><input type="radio" name="${self.id}-origin-radio" value="firstportal">Use first portal as origin (maps preview modus)</label><br>
        <label><input type="checkbox" name="${self.id}-showchars-checkbox">Show alphabetical characters on waypoints</label><br>
        <div style="margin-top: 14px; font-style: italic; font-size: smaller;">${self.title} version ${self.version} by ${self.author}</div>
        `;

        window.dialog({
            html: container,
            id: self.pluginname + '-dialog',
            dialogClass: 'ui-dialog-' + self.pluginname,
            title: self.title,
            width: 'auto'
        }).dialog('option', 'buttons', {
            'Transfer' : function() { self.transfermenu(); },
            'Edit waypoints' : function() { self.waypointsmenu(); },
            'About': function() { self.about(); },
            'Close': function() { $(this).dialog('close'); }
        });

        let travelmodeselect = container.querySelector("select[name=" + self.id + "-travelmode-select]");
        for (const travelmode of ['','driving','walking','bicycling','transit']) {
            let option = travelmodeselect.appendChild(document.createElement('option'));
            option.value = travelmode;
            option.text = (!travelmode?'use relevant mode':travelmode);
            option.selected = (option.value == self.settings.travelmode);
        }
        travelmodeselect.addEventListener('change', function(e) {
            e.preventDefault();
            self.settings.travelmode = this.value;
            self.storesettings();
        },false);

        container.querySelector("input[name=" + self.id + "-origin-radio][value='" + self.settings.origin + "']").checked = true;
        $("input[name=" + self.id + "-origin-radio]").on('click', function (evt) {
            self.settings.origin = this.value;
            self.storesettings();
            self.updateMenu();
        });
        $("input[name=" + self.id + "-zoom-button]").on('click', function (evt) {
            if (!Object.keys(self.waypoints).length) return;
            window.map.fitBounds(self.waypointsroutelayer.getBounds());
        });
        $("input[name=" + self.id + "-share-button]").on('click', function (evt) {
            let link = self.getMapsLink();
            if (typeof android !== 'undefined' && android?.shareString) {
                return android.shareString(link);
            } else if (navigator?.clipboard?.writeText) {
                navigator.clipboard.writeText(link).then(() => {
                    alert('Maps URL copied to clipboard');
                }).catch(() => {
                    alert("I'm sorry, link copy failed (does not work on mobile)");
                });
            } else {
                alert("I'm sorry, link copy not available");
            }
        });
        $("input[name=" + self.id + "-link-button]").on('click', function (evt) {
            let link = self.getMapsLink();
            window.open(link,'_blank');
        });
        container.querySelector("input[name=" + self.id + "-showchars-checkbox]").checked = self.settings.showchars;
        $("input[name=" + self.id + "-showchars-checkbox]").on('click', function (evt) {
            self.settings.showchars = this.checked;
            self.storesettings();
            self.drawRoute();
        });

        self.updateMenu();
    };

    self.updateControls = function() {
        if (!window.selectedPortal) {
            if (Object.keys(self.waypoints).length >= self.maxwaypoints) {
                $('.' + self.id + '-togglewaypoint').prop('title','Maximum waypoints');
                $('.' + self.id + '-togglewaypoint').css('background-color','red');
            } else {
                $('.' + self.id + '-togglewaypoint').prop('title','Select a portal first!');
                $('.' + self.id + '-togglewaypoint').css('background-color','#aaaaaa');
            }
            $('.' + self.id + '-togglewaypoint > img').prop('src',iconplus);
        } else if (window.selectedPortal in self.waypoints) {
            $('.' + self.id + '-togglewaypoint').prop('title','Remove waypoint');
            $('.' + self.id + '-togglewaypoint').css('background-color',self.settings.routeforegroundcolor);
            $('.' + self.id + '-togglewaypoint > img').prop('src',iconmin);
        } else if (Object.keys(self.waypoints).length >= self.maxwaypoints) {
            $('.' + self.id + '-togglewaypoint').prop('title','Maximum waypoints');
            $('.' + self.id + '-togglewaypoint').css('background-color','red');
            $('.' + self.id + '-togglewaypoint > img').prop('src',iconplus);
        } else {
            $('.' + self.id + '-togglewaypoint').prop('title','Add waypoint');
            $('.' + self.id + '-togglewaypoint').css('background-color','white');
            $('.' + self.id + '-togglewaypoint > img').prop('src',iconplus);
        }

        if (!window.selectedPortal || !(window.selectedPortal in self.waypoints)) {
            // $('.' + self.id + '-togglewaypoint').text("+");
        } else if (window.selectedPortal in self.waypoints) {
            // $('.' + self.id + '-togglewaypoint').text("-");
        }

        $('.' + self.id + '-total').text(Object.keys(self.waypoints).length);
    }

    self.setup = function() {
        self.restoresettings();
        self.storesettings();

        let stylesheet = document.body.appendChild(document.createElement('style'));
        stylesheet.innerHTML = `
        #dialog-plugin-${self.id}-dialog label {
            user-select: none;
            cursor: pointer;
        }
        .${self.id}-transfer-menu {
            text-align: center;
        }
        .${self.id}-transfer-menu input[type=button] {
            min-width: 200px;
            margin-top: 5px;
            margin-bottom: 5px;
        }
        .${self.id}-main-menu input[type=button] {
            margin-top: 5px;
            margin-bottom: 5px;
        }
        .${self.id}-waypoint-numbers {
            font-size: 16px;
            color: #000000;
            font-family: monospace;
            font-weight: bold;
            text-align: center;
            pointer-events: none;
            -webkit-text-size-adjust:none;
            white-space: nowrap;
        }
        .${self.id}-waypoints-row {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
        }
        .${self.id}-waypoints-row-char {
            margin: 0 5px;
            width: 13px;
            text-align: center;
        }
        .${self.id}-waypoints-row-link {
            width: 250px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        `;

        let toolboxlink = document.getElementById('toolbox').appendChild(document.createElement('a'));
        toolboxlink.textContent = self.title;
        toolboxlink.addEventListener('click', function(e) {
            e.preventDefault();
            self.menu();
        }, false);

        self.waypointsroutelayer = new window.L.FeatureGroup();
        window.addLayerGroup(self.title, self.waypointsroutelayer,true);

        self.restoreWaypoints();
        self.drawRoute();

        function addClickFunctionToObject(obj,fn) {
            function detectMultipleClicks(obj) {
                // prevent double execution for single click event (happens on iOS devices with touch events)
                let clickdelay = 200; // ms
                let timestamp = window.event?.timeStamp || new Date().getTime();
                let elapsed = obj._lastclick && (timestamp - obj._lastclick);
                if (elapsed < clickdelay) return true;
                obj._lastclick = timestamp;
                return false;
            }
            window.L.DomEvent
                .on(obj, 'click', window.L.DomEvent.stopPropagation)
                .on(obj, 'click', window.L.DomEvent.preventDefault)
                .on(obj, 'click', function() { if (!detectMultipleClicks(obj)) fn(); })
                .on(obj, 'dblclick', window.L.DomEvent.stopPropagation);
        }
        let controlButtons = window.L.Control.extend({
            options: {
                position: 'topleft'
            },
            onAdd: function (map) {
                let container = document.createElement('div');
                container.className = self.id + '-controlbuttons leaflet-bar';
                if (!window.map.hasLayer(self.waypointsroutelayer)) container.style.display = 'none';

                let logoiconbutton = container.appendChild(document.createElement('a'));
                logoiconbutton.className = self.id + "-logo";
                let logoiconbuttonicon = logoiconbutton.appendChild(document.createElement('img'));
                // logo icon
                logoiconbuttonicon.src = iconlogo;
                logoiconbuttonicon.width = 16;
                logoiconbuttonicon.height = 16;
                logoiconbuttonicon.style.marginTop = (window.isSmartphone() ? '7px' : '5px');
                addClickFunctionToObject(logoiconbutton,function() {
                    window.open(self.getMapsLink());
                });

                let togglebutton = container.appendChild(document.createElement('a'));
                togglebutton.className = self.id + "-togglewaypoint";
                let togglebuttonicon = togglebutton.appendChild(document.createElement('img'));
                // + icon
                togglebuttonicon.src = iconplus;
                togglebuttonicon.width = 16;
                togglebuttonicon.height = 16;
                togglebuttonicon.style.marginTop = (window.isSmartphone() ? '7px' : '5px');
                addClickFunctionToObject(togglebutton,function() {
                    if (!window.selectedPortal || !(window.selectedPortal in window.portals)) return;
                    if (!(window.selectedPortal in self.waypoints)) {
                        if (Object.keys(self.waypoints).length >= self.maxwaypoints) {
                            alert('Maximum of ' + self.maxwaypoints + ' waypoints reached. You can not add this portal as a waypoint.');
                            return;
                        }
                        let waypointportal = window.portals[window.selectedPortal];
                        self.waypoints[window.selectedPortal] = {
                            latlng: {
                                lat: waypointportal.getLatLng().lat,
                                lng: waypointportal.getLatLng().lng
                            },
                            name: waypointportal.options.data.title || 'waypoint'
                        };
                    } else {
                        delete(self.waypoints[window.selectedPortal]);
                    }
                    self.storeWaypoints();
                    self.updateMenu();
                    self.updateControls();
                    self.drawRoute();
                });

                let totalbutton = container.appendChild(document.createElement('a'));
                totalbutton.className = self.id + "-total";
                totalbutton.innerText = Object.keys(self.waypoints).length;
                addClickFunctionToObject(totalbutton,function() {
                    self.waypointsmenu();
                });

                let menubutton = container.appendChild(document.createElement('a'));
                menubutton.className = self.id + "-menu";
                let menubuttonicon = menubutton.appendChild(document.createElement('img'));
                menubuttonicon.src = iconmenu;
                menubuttonicon.width = 16;
                menubuttonicon.height = 16;
                menubuttonicon.style.marginTop = (window.isSmartphone() ? '7px' : '5px');
                addClickFunctionToObject(menubutton,function() {
                    self.menu();
                });

                return container;
            }
        });
        window.map.addControl(new controlButtons());
        self.updateControls();

        window.addHook('portalSelected', self.updateControls);
        window.addHook('portalDetailLoaded', function(data) {
            if (data.success && data.guid in self.waypoints && self.waypoints[data.guid].name != data.details.title) {
                self.waypoints[data.guid].name = data.details.title;
                self.storeWaypoints();
                self.updateMenu();
            }
        });

        window.map.on('layeradd', function(obj) { // show button
            if (obj.layer === self.waypointsroutelayer) {
                $('.' + self.id + '-controlbuttons').show();
            }
        });
        window.map.on('layerremove', function(obj) { // hide button
            if (obj.layer === self.waypointsroutelayer) {
                $('.' + self.id + '-controlbuttons').hide();
            }
        });

        console.log('IITC plugin loaded: ' + self.title + ' version ' + self.version);
    };

    var setup = function() {
        (window.iitcLoaded?self.setup():window.addHook('iitcLoaded',self.setup));
    };

    setup.info = plugin_info; //add the script info data to the function as a property
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
