// ==UserScript==
// @author         DanielOnDiordna
// @name           Favorite portal details
// @category       Info
// @version        1.0.0.20251025.232300
// @updateURL      https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/DanielOnDiordna/favorite-portal-details.meta.js
// @downloadURL    https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/DanielOnDiordna/favorite-portal-details.user.js
// @description    [danielondiordna-1.0.0.20251025.232300] Quickly show a list of details for your favorite list of portals.
// @id             favorite-portal-details@DanielOnDiordna
// @namespace      https://softspot.nl/ingress/
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    // use own namespace for plugin
    window.plugin.favoriteportaldetails = function() {};
    var self = window.plugin.favoriteportaldetails;
    self.id = 'favoriteportaldetails';
    self.title = 'Favorite portal details';
    self.version = '1.0.0.20251025.232300';
    self.author = 'DanielOnDiordna';
    self.changelog = `
Changelog:

version 1.0.0.20251025.232300
- fixed portal details indicator icon
- renamed the button Change order to Edit list

version 0.1.6.20210724.002500
- prevent double plugin setup on hook iitcLoaded

version 0.1.6.20210421.190200
- minor fix for IITC CE where runHooks iitcLoaded is executed before addHook is defined in this plugin

version 0.1.6.20210328.235400
- fixed portal guid format checker

version 0.1.5.20210123.230400
- updated plugin wrapper and userscript header formatting to match IITC-CE coding
- store portal titles for later use
- fixed width of dialog

version 0.1.4.20190530.122000
- closedialog fix for smartphone

version 0.1.3.20190406.225100
- bug fix: resonators and mods object converted to array for sort purposes
- support for empty mods
- underline resos and mods also if the active player is not the owner
- sort resos by level and then by owner name

version 0.1.2.20190117.143900
- minor code fix: assign needs empty array

version 0.1.1.20181030.221200
- bug fix: localstoragesettings was not defined

version 0.1.1.20180911.233100
- earlier version
`;
    self.namespace = `window.plugin.${self.id}.`;
    self.pluginname = `plugin-${self.id}`;

    self.panename = `plugin-${self.id}`;
    self.localstoragesettings = `${self.panename}-settings`;
    self.dialogobject = null;
    self.onPortalSelectedPending = false;
    self.settings = {
        refreshonstart: true
    };
    self.favoriteslist = [];
    self.favorites = {};
    self.favorite = {
        title: '',
        team: '?',
        level: '?',
        resonators: [],
        mods: [],
        health: '?',
        owner: '?',
        timestamp: 0,
        lat: 0.0,
        lng: 0.0
    };
    self.storagename = self.panename + '-favorites';
    self.requestlist = {};
    self.requestrunning = false;
    self.requestguid = null;
    self.requesttimerid = 0;
    self.ownercolor = 'black';
    self.refreshonload_runonce = true;
    self.shortnames = {
        ''                     :' ',
        'Heat Sink'            :'H',
        'Portal Shield'        :'S',
        'Link Amp'             :'L',
        'Turret'               :'T',
        'Multi-hack'           :'M',
        'Aegis Shield'         :'A',
        'Force Amp'            :'F',
        'SoftBank Ultra Link'  :'U',
        'Ito En Transmuter (+)':'I+',
        'Ito En Transmuter (-)':'I-'
    };
    self.shortrarities = {
        ''         :' ',
        'COMMON'   :'c',
        'RARE'     :'r',
        'VERY_RARE':'v'
    };

    self.restoresettings = function() {
        let data = localStorage.getItem(self.localstoragesettings);
        if (!data) return;
        try {
            let settings = JSON.parse(data);
            if (!isObject(settings)) return;
            Object.keys(self.settings).forEach(key => {
                if (key in settings && typeof self.settings[key] == typeof settings[key]) {
                    self.settings[key] = settings[key];
                }
            });
        } catch(e) {
        }
    };
    self.storesettings = function() {
        try {
            localStorage.setItem(self.localstoragesettings,JSON.stringify(self.settings));
        } catch(e) {
        }
    };

    function isObject(value) {
        // https://dev.to/alesm0101/how-to-check-if-a-value-is-an-object-in-javascript-3pin
        return typeof value === 'object' &&
            value !== null &&
            !Array.isArray(value) &&
            !(value instanceof RegExp) &&
            !(value instanceof Date) &&
            !(value instanceof Set) &&
            !(value instanceof Map);
    }

    self.restorefavorites = function() {
        let data = localStorage.getItem(self.storagename);
        if (!data) return;
        try {
            let favoriteslist = JSON.parse(data); // array of separator names and guid=>portal name (or guid only)
            if (!Array.isArray(favoriteslist)) return;
            self.favoriteslist = []; // array of separator names and guids
            self.favorites = {}; // hash of guid=>{portal details}
            favoriteslist.forEach(favorite => {
                if (typeof favorite === 'string' && favorite.match(/^[0-9a-f]{32}\.[0-9a-f]{2}$/)) { // old file format: in case it's only a guid, convert to new formatting
                    let guid = favorite;
                    favorite = {};
                    favorite[guid] = guid; // use guid as portal name
                }
                if (isObject(favorite)) {
                    let guid = Object.keys(favorite)[0];
                    self.favorites[guid] = Object.assign({}, self.favorite); // copy empty favoritee object without reference
                    self.favorites[guid].title = favorite[guid];
                    self.favoriteslist.push(guid);
                } else if (typeof favorite === 'string') { // separator name
                    self.favoriteslist.push(favorite);
                }
            });
        } catch(e) {
        }
    };
    self.storefavorites = function() {
        let data = []; // array of separator names and guid=>portal name
        self.favoriteslist.forEach(favorite => {
            if (favorite.match(/^[0-9a-f]{32}\.[0-9a-f]{2}$/)) { // guid
                let guid = favorite;
                favorite = {};
                favorite[guid] = self.favorites[guid].title;
                data.push(favorite);
            } else { // separator name
                data.push(favorite);
            }
        });
        try {
            localStorage[self.storagename] = JSON.stringify(data);
        } catch(e) {
        }
    };

    self.requesttimeout = function() {
        self.requestrunning = false;
        self.requestlist = {};
        self.updateselector();
    };

    self.requestnext = function() {
        if (Object.keys(self.requestlist).length === 0) {
            self.requestrunning = false;
            return;
        }
        let nextguid = Object.keys(self.requestlist)[0];
        self.requestguid = nextguid;

        window.setTimeout(function() {
            self.requesttimerid = window.setTimeout(self.requesttimeout,10000); // 10 seconds
            window.portalDetail.request(self.requestguid);
        },1000); // keep a second between request
    };

    self.requestall = function() {
        if (self.requestrunning) return;
        if (Object.keys(window.portals).length === 0) return;

        self.requestrunning = true;
        Object.keys(self.favorites).forEach(guid => {
            self.requestlist[guid] = true;
        });
        self.requestnext();
    };

    self.focusportal = function(guid) {
        if (!isObject(window.portals) || Object.keys(window.portals).length === 0) return; // cancel while no portals loaded yet; prevents an error inside the IITC core
        if (guid === window.selectedPortal && guid in self.favorites) {
            window.map.setView([self.favorites[guid].lat,self.favorites[guid].lng]);
        }
        if (guid in window.portals) {
            window.renderPortalDetails(guid);
        } else {
            self.requestguid = guid;
            window.portalDetail.request(guid);
        }
    };

    self.closedialog = function() {
        if (self.dialogobject) {
            self.dialogobject.dialog('close');
            self.dialogobject = null;
        }
    };

    self.getdatetimestring = function(date1) {
        if (!(date1 instanceof Date)) {
            if (date1) {
                date1 = new Date(date1);
            } else {
                date1 = new Date();
            }
        }
        return [date1.getFullYear(),date1.getMonth()+1,date1.getDate()].join('/') + ' ' + [date1.getHours(),('0' + date1.getMinutes()).slice(-2),('0' + date1.getSeconds()).slice(-2)].join(':');
    };

    self.resonatorshtml = function(resonators,portalowner) {
        let highlightowner = window.PLAYER.nickname;
        let resolist = [];
        resonators = resonators.sort(
            function(a,b) {
                if (a.level < b.level) return 1;
                if (a.level > b.level) return -1;
                let o1 = a.owner.toLowerCase();
                let o2 = b.owner.toLowerCase();
                if (o1 > o2) return 1;
                if (o1 < o2) return -1;
                return 0;
            }); // sort by resonator level and then by owner
        for (let cnt = 0; cnt < 8; cnt++) {
            let lvl = '-';
            if (cnt < resonators.length && isObject(resonators[cnt])) { // {owner, level, energy}
                let resonatorowner = resonators[cnt].owner;
                lvl = resonators[cnt].level;
                if (resonatorowner === highlightowner) {
                    lvl = `<span style="color:${self.ownercolor}">${lvl}</span>`; // highlight reso's of current player
                }
                if (resonatorowner !== portalowner) {
                    lvl = `<u>${lvl}</u>`; // underline reso's of other people then the portal owner
                }
                lvl = `<span title="${resonatorowner}">${lvl}</span>`;
            }
            resolist.push(lvl);
        }
        return resolist.join('');
    };

    self.modshtml = function(mods,portalowner) {
        let highlightowner = window.PLAYER.nickname;
        let modslist = [];
        for (let cnt = 0; cnt < mods.length; cnt++) { // {owner, name, rarity, stats: {…}}
            let mod;
            if (!isObject(mods[cnt])) {
                mod = '';
            } else {
                mod = self.shortnames[mods[cnt].name];
                if (mod === 'H' || mod === 'S' || mod === 'M') mod = self.shortrarities[mods[cnt].rarity] + mod;
                let modowner = mods[cnt].owner;
                if (modowner === highlightowner) {
                    mod = `<span style="color:${self.ownercolor}">${mod}</span>`; // highlight mods of current player
                }
                if (modowner !== portalowner) {
                    mod = `<u>${mod}</u>`; // underline mods of other people then the portal owner
                }
                mod = `<span title="${modowner}">${mod}</span>`;
            }
            modslist.push(mod);
        }
        return modslist.join(' ');
    };

    self.favoriteshtml = function() {
        let highlightowner = window.PLAYER.nickname;
        let table = document.createElement('table');
        table.cellPadding = 0;
        table.cellSpacing = 0;
        let headerrow = table.appendChild(document.createElement('tr'));
        let headers = [
            'T',
            'Title',
            'Health',
            'Lvl',
            'Resonators',
            'Mods',
            'Owner',
            'Checked'
        ];
        headers.forEach(header => {
            let cell = headerrow.appendChild(document.createElement('th'));
            cell.innerText = header;
        });
        let rows = [];
        self.favoriteslist.forEach(favorite => {
            let guid = favorite;
            if (guid in self.favorites && !self.favorites[guid].title && guid in window.portals) {
                // fix title if portal is known
                let portaldata = window.portals[guid].options.data;
                self.favorites[guid].title = (portaldata.title ? portaldata.title : guid);
                self.favorites[guid].team = portaldata.team;
                self.favorites[guid].level = (portaldata.level >= 0 ? (portaldata.team === 'N' ? 0 : portaldata.level) : '');
            }

            let row = table.appendChild(document.createElement('tr'));
            if (guid in self.favorites) {
                row.className = `${self.id}team${self.favorites[guid].team}`;
                headers.forEach(header => {
                    let cell = row.appendChild(document.createElement('td'));
                    cell.noWrap = true;
                    switch(header) {
                        case 'T':
                            cell.innerText = self.favorites[guid].team;
                            break;
                        case 'Title':
                            {
                                let link = cell.appendChild(document.createElement('a'));
                                link.innerText = self.favorites[guid].title ? self.favorites[guid].title : guid;
                                link.addEventListener('click',function(e) {
                                    e.preventDefault();
                                    self.focusportal(guid);
                                },false);
                            }
                            break;
                        case 'Health':
                            cell.innerText = self.favorites[guid].team === 'N' ? '-' : `${self.favorites[guid].health}%`;
                            break;
                        case 'Lvl':
                            cell.className = `${self.id}Lvl${self.favorites[guid].level}`;
                            cell.innerText = `L${self.favorites[guid].level}`;
                            break;
                        case 'Resonators':
                            cell.innerHTML = self.resonatorshtml(self.favorites[guid].resonators,self.favorites[guid].owner);
                            break;
                        case 'Mods':
                            cell.innerHTML = self.modshtml(self.favorites[guid].mods,self.favorites[guid].owner);
                            break;
                        case 'Owner':
                            if (highlightowner === self.favorites[guid].owner) cell.className = `${self.id}owner`;
                            cell.innerText = self.favorites[guid].owner || '';
                            break;
                        case 'Checked':
                            cell.innerText = self.requestlist[guid] ? 'updating...' : (self.favorites[guid].timestamp == 0 ? 'never' : self.getdatetimestring(self.favorites[guid].timestamp));
                            break;
                    }
                });
            } else {
                let cell = row.appendChild(document.createElement('td'));
                cell.className = `${self.id}label`;
                cell.colSpan = headers.length;
                cell.innerText = favorite;
            }
        });

        return table;
    };

    self.orderup = function(cnt) {
        if (cnt === 0) return;
        let cntvalue = self.favoriteslist[cnt];
        self.favoriteslist[cnt] = self.favoriteslist[cnt - 1];
        self.favoriteslist[cnt - 1] = cntvalue;
        self.storefavorites();
        self.updateselector();
    };

    self.orderdown = function(cnt) {
        if (cnt === self.favoriteslist.length - 1) return;
        let cntvalue = self.favoriteslist[cnt];
        self.favoriteslist[cnt] = self.favoriteslist[cnt + 1];
        self.favoriteslist[cnt + 1] = cntvalue;
        self.storefavorites();
        self.updateselector();
    };

    self.removefavorite = function(cnt) {
        let guid = self.favoriteslist[cnt];
        if (guid in self.favorites) delete(self.favorites[guid]);
        self.favoriteslist.splice(cnt,1);
        self.storefavorites();
        self.updateselector();
    };

    self.addtitle = function() {
        let newtitle = prompt('Enter a new separator label:');
        if (!newtitle) return;
        self.favoriteslist.push(newtitle);
        self.storefavorites();
        self.updateselector();
    };

    self.edittitle = function(cnt) {
        let newtitle = prompt('Edit separator label:',self.favoriteslist[cnt]);
        if (!newtitle || newtitle === self.favoriteslist[cnt]) return;
        self.favoriteslist[cnt] = newtitle;
        self.storefavorites();
        self.updateselector();
    };

    self.ordermenuhtml = function() {
        let table = document.createElement('table');
        for (let cnt = 0; cnt < self.favoriteslist.length; cnt++) {
            let row = table.appendChild(document.createElement('tr'));
            let guid = self.favoriteslist[cnt];

            let title = (guid in self.favorites ? (self.favorites[guid].title ? self.favorites[guid].title : guid) : self.favoriteslist[cnt]);
            row.innerHTML = `
<td name="${self.id}remove">X</td>
<td name="${self.id}up"><img border="0" width="10" height="10" src="data:image/gif;base64,R0lGODlhCgAKAIcAAAAAAAICAgcHBwgICAoKCgsLCw0NDQ4ODhUVFSAgIC0tLT4+PklJSVdXV2lpaXx8fIyMjJCQkJ6enrCwsMDAwNDQ0NjY2OTk5Ozs7PT09Pj4+Pz8/P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAMAABwALAAAAAAKAAoAAAhCADkIHEiQYIUIBQcuOJAhIYUDAx4kVAAAQAEMBCcYqCjAwcANCSpWHHBBoAQCIgEMaMBBA4KUFQtYgBAAJoAADAICADs="></td>
<td name="${self.id}down"><img border="0" width="10" height="10" src="data:image/gif;base64,R0lGODlhCgAKAIcAAAAAAAICAgMDAwgICAkJCQsLCxQUFB0dHScnJzQ0NHx8fH5+foCAgKCgoLCwsMDAwPDw8Pj4+Pz8/P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAMAABMALAAAAAAKAAoAAAg9ABsEGECwoIAFEg4AWMiwAIQJDQwwBEBAwYSLCCY6vDjBgUSKFjlOyAhgo8gHBiqK5JjA5MoHDFaKjCAyIAA7"></td>
<td name="${self.id}title" nowrap></td>
`;
            row.querySelector(`td[name=${self.id}remove]`).addEventListener('click',function(e) {
                e.preventDefault();
                if (confirm(`${title}\n\nRemove from favorite list?`)) self.removefavorite(cnt);
            },false);
            row.querySelector(`td[name=${self.id}up]`).addEventListener('click',function(e) {
                e.preventDefault();
                self.orderup(cnt);
            },false);
            row.querySelector(`td[name=${self.id}down]`).addEventListener('click',function(e) {
                e.preventDefault();
                self.orderdown(cnt);
            },false);
            let titlecell = row.querySelector(`td[name=${self.id}title]`);
            titlecell.innerText = title;
            if (guid in self.favorites) {
                titlecell.addEventListener('click',function(e) {
                    e.preventDefault();
                    self.focusportal(guid);
                },false);
            } else {
                titlecell.className = `${self.id}label`;
                titlecell.addEventListener('click',function(e) {
                    e.preventDefault();
                    self.edittitle(cnt);
                },false);
            }
        }
        return table;
    };

    self.aboutmenu = function() {
        let container = document.createElement('div');
        container.id = `${self.id}menu`;
        container.className = `${self.id}menu`;
        container.innerHTML = `
            <div class="${self.id}menubuttons">
            <a name="${self.id}mainmenu">&lt; Main menu</a><br>
            </div>
            Add your favorite portals to a list.<br>
            <br>
            Step 1: Select a portal and show the details pane.<br>
            Step 2: Click on the portal icon in front of the portal title:<br>
            <a class="${self.id}Selector" onclick="return false;" title="Add to your list of favorite portal details"><span></span></a> It will change into your team color when selected.<br>
            <br>
            Step 3: Open the ${self.title} menu.<br>
            <br>
            Now you can easily see all details about this portal: resonators and mods (<span style="color:${self.ownercolor}">${self.ownercolor}</span> are placed by you, <u>underlined</u> are placed by someone else then the portal owner, others are placed by the portal owner).<br>
            <br>
            Step 4: Edit list, remove favorites or add separator labels from the Edit list menu.<br>
            <br>
            Portal details are automatically updated when Intel is reloaded, or refreshed by clicking the "Check all" button, and also updated when a portal is selected.<br>
            Click on a title to focus the portal. Click again to move the map to the selected portal.<br>
            <span style="font-style: italic; font-size: smaller">version ${self.version} by ${self.author}</span>
            </div>
`;

        container.querySelector(`a[name=${self.id}mainmenu]`).addEventListener('click',function(e) {
            e.preventDefault();
            self.menu();
        },false);

        if (window.useAndroidPanes()) {
            self.closedialog(); // close, if any
            $(`#${self.id}menu`).remove();
            $(`<div id="${self.id}menu" class="mobile">`).append(container).appendTo(document.body);
        } else {
            self.dialogobject = window.dialog({
                html: container,
                id: `plugin-${self.id}-dialog`,
                title: `${self.title} About`,
                width: 400
            });
        }
    };

    self.ordermenu = function() {
        let container = document.createElement('div');
        container.id = `${self.id}menu`;
        container.className = `${self.id}menu`;
        container.innerHTML = `
            <div class="${self.id}menubuttons">
            <a name="${self.id}mainmenu">&lt; Main menu</a> <a name="${self.id}addtitle">Add separator label</a>
            </div>
            <div id="${self.id}orderlist"></div>
`;

        container.querySelector(`a[name=${self.id}mainmenu]`).addEventListener('click',function(e) {
            e.preventDefault();
            self.menu();
        },false);
        container.querySelector(`a[name=${self.id}addtitle]`).addEventListener('click',function(e) {
            e.preventDefault();
            self.addtitle();
        },false);

        container.querySelector(`div#${self.id}orderlist`).append(self.ordermenuhtml());

        if (window.useAndroidPanes()) {
            self.closedialog(); // close, if any
            $(`#${self.id}menu`).remove();
            $(`<div id="${self.id}menu" class="mobile">`).append(container).appendTo(document.body);
        } else {
            self.dialogobject = window.dialog({
                html: container,
                id: `plugin-${self.id}-dialog`,
                title: `${self.title} Edit list`
            });
        }
    };

    self.menu = function() {
        let container = document.createElement('div');
        container.id = `${self.id}menu`;
        container.className = `${self.id}menu`;
        container.innerHTML = `
            <div class="${self.id}menubuttons">
            <a name="${self.id}checkall">Check all</a> <a name="${self.id}changeorder">Edit list</a> <a name="${self.id}about">About</a>
            <label><input type="checkbox" name="${self.id}autocheck">Check all on IITC start</label>
            </div>
            <div id="${self.id}list"></div>
`;

        container.querySelector(`a[name=${self.id}checkall]`).addEventListener('click',function(e) {
            e.preventDefault();
            self.requestall();
        },false);
        container.querySelector(`a[name=${self.id}changeorder]`).addEventListener('click',function(e) {
            e.preventDefault();
            self.ordermenu();
        },false);
        container.querySelector(`a[name=${self.id}about]`).addEventListener('click',function(e) {
            e.preventDefault();
            self.aboutmenu();
        },false);

        container.querySelector(`div#${self.id}list`).append(self.favoriteshtml());

        let autocheck = container.querySelector(`input[name=${self.id}autocheck]`);
        autocheck.checked = self.settings.refreshonstart;
        autocheck.addEventListener('click',function(e) {
            self.settings.refreshonstart = this.checked;
            self.storesettings();
        },false);

        if (window.useAndroidPanes()) {
            self.closedialog(); // close, if any
            $(`#${self.id}menu`).remove();
            $(`<div id="${self.id}menu" class="mobile">`).append(container).appendTo(document.body);
        } else {
            self.dialogobject = window.dialog({
                html: container,
                id: `plugin-${self.id}-dialog`,
                dialogClass: `ui-dialog-${self.id}-menu`,
                title: self.title,
                width: 700
            });
        }
    };

    self.toggleselection = function(guid) {
        if (!guid) guid = window.selectedPortal;
        if (!guid) return;
        let portaldata = {};
        if (window.portals[guid]) portaldata = window.portals[window.selectedPortal].options.data;
        if (!self.favorites[guid]) {
            self.favorites[guid] = Object.assign({}, self.favorite); // copy object without reference
            self.favorites[guid].title = portaldata.title;
            self.favorites[guid].team = portaldata.team;
            self.favorites[guid].level = (portaldata.team === 'N'?0:portaldata.level);
            self.favoriteslist.push(guid);

            self.requestlist[guid] = true; // force request portal details
            self.requestnext();
        } else {
            delete(self.favorites[guid]);
            let index = self.favoriteslist.indexOf(guid);
            if (index !== -1) self.favoriteslist.splice(index,1);
        }
        self.storefavorites();
        self.updateselector();
    };

    self.updateselector = function() {
        let guid = window.selectedPortal;
        let selector = document.querySelector(`.${self.id}Selector`);
        if (selector) {
            if (guid && guid in self.favorites) {
                selector.classList.add('favorite');
            } else {
                selector.classList.remove('favorite');
            }
        }
        let list = document.querySelector(`div#${self.id}list`);
        if (list) {
            list.innerHTML = '';
            list.append(self.favoriteshtml());
        }
        let orderlist = document.querySelector(`div#${self.id}orderlist`);
        if (orderlist) {
            orderlist.innerHTML = '';
            orderlist.append(self.ordermenuhtml());
        }
    };

    self.onPortalDetailLoaded = function(data) {
        if (!isObject(data)) return;
        if (!data.details || !data.details.title || !data.guid) {
            // console.log('FAVORITE PORTAL DETAILS onPortalDetailLoaded failed',data);
            return;
        }

        let guid = data.guid;
        if (guid in self.favorites) {
            if (self.favorites[guid].title != data.details.title) {
                self.favorites[guid].title = data.details.title;
                self.storefavorites();
            }
            self.favorites[guid].team = data.details.team;
            self.favorites[guid].level = (data.details.team === 'N'?0:data.details.level);
            self.favorites[guid].resonators = [];
            for (let cnt = 0; cnt < 8; cnt++) {
                if (data.details.resonators[cnt] && data.details.resonators[cnt].owner) {
                    self.favorites[guid].resonators[cnt] = Object.assign({},data.details.resonators[cnt]);
                } else {
                    self.favorites[guid].resonators[cnt] = {owner:'',level:'',energy:''};
                }
            }
            self.favorites[guid].mods = [];
            for (let cnt = 0; cnt < 4; cnt++) {
                if (data.details.mods[cnt]) {
                    self.favorites[guid].mods[cnt] = Object.assign({},data.details.mods[cnt]);
                } else {
                    self.favorites[guid].mods[cnt] = {owner:'',name:'',rarity:''};
                }
            }
            self.favorites[guid].owner = data.details.owner;
            self.favorites[guid].health = data.details.health;
            self.favorites[guid].timestamp = new Date();
            self.favorites[guid].lat = data.details.latE6 / 1E6;
            self.favorites[guid].lng = data.details.lngE6 / 1E6;
        }
        if (guid === self.requestguid) {
            window.clearTimeout(self.requesttimerid);
            self.requesttimerid = 0;
            delete(self.requestlist[self.requestguid]);
            self.updateselector();
            window.setTimeout(self.requestnext,0);
        }
    };

    self.onPortalSelected = function(data) {
        if (!window.selectedPortal) return;

        if (self.onPortalSelectedPending) return;
        self.onPortalSelectedPending = true;

        window.setTimeout(function() {
            let selector = document.querySelector(`.${self.id}Selector`);
            let portaltitle = document.querySelector('#portaldetails > h3.title');
            if (!selector && portaltitle) {
                selector = document.createElement('a');
                selector.title = `Toggle ${self.title}`;
                selector.className = `${self.id}Selector`;
                selector.addEventListener('click',function(e) {
                    e.preventDefault();
                    self.toggleselection();
                },false);
                selector.appendChild(document.createElement('span'));
                portaltitle.prepend(selector);
            }
            if (window.selectedPortal in self.favorites) {
                selector.classList.add('favorite');
            } else {
                selector.classList.remove('favorite');
            }
            self.onPortalSelectedPending = false;
        },0);
    };

    self.onPaneChanged = function(pane) {
        if (pane === self.panename) {
            self.menu();
        } else {
            let menu = document.querySelector(`#${self.id}menu`);
            if (menu) menu.remove();
        }
    };

    self.refreshonload = function() {
        if (!self.refreshonload_runonce) return;
        if (Object.keys(window.portals).length > 0 && self.settings.refreshonstart) {
            self.requestall();
        }
        self.refreshonload_runonce = false;
    };

    self.setup = function() {
        if ('pluginloaded' in self) {
            console.log('IITC plugin already loaded: ' + self.title + ' version ' + self.version);
            return;
        } else {
            self.pluginloaded = true;
        }

        self.restoresettings();
        self.restorefavorites();
        self.storefavorites();

        if (window.useAndroidPanes()) {
            android.addPane(self.panename, self.title, 'ic_action_view_as_list');
            window.addHook("paneChanged",self.onPaneChanged);
        }

        let toolboxmenulink = document.querySelector('#toolbox').appendChild(document.createElement('a'));
        toolboxmenulink.innerText = self.title;
        toolboxmenulink.addEventListener('click',function(e) {
            e.preventDefault();
            if (window.useAndroidPanes()) {
                window.show(self.panename);
            }
            self.menu();
        },false);

        let stylesheet = document.head.appendChild(document.createElement('style'));
        stylesheet.innerHTML = `
.${self.id}Selector span {
    background-image:url(data:image/png;base64,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);
    display:inline-block;
    float:left;
    margin:3px 1px 0 4px;
    width:15px;
    height:15px;
    overflow:hidden;
    background-repeat:no-repeat;
    background-position:left top;
}
.${self.id}Selector span {
    background-position:left top;
}
.${self.id}Selector.favorite span {
    background-position:${window.PLAYER.team == 'RESISTANCE' ? 'right top' : 'left bottom'};
}
.${self.id}menubuttons > a {
    color:#ffce00;
    border:1px solid #ffce00;
    padding:0 3px;
    margin:10px auto;
    background:rgba(8,48,78,.9);
}
#${self.id}menu.mobile {
    background: transparent;
    border: 0 none !important;
    height: 100% !important;
    width: 100% !important;
    left: 0 !important;
    top: 0 !important;
    position: absolute;
    overflow: auto;
}
.ui-dialog-${self.id}-menu {
    max-width: 700px;
}
#${self.id}orderlist td {
    cursor: pointer;
}
div#${self.id}list th {
    padding-left: 5px;
}
.${self.id}label {
    font-weight: bold;
}
.${self.id}owner {
    color: ${self.ownercolor};
}
.${self.id}teamE {
    background-color: #017f01;
}
.${self.id}teamR {
    background-color: #005684;
}
.${self.id}teamN {
    background-color: #3b3b3b;
}
.${self.id}Lvl1 {
    color: black;
}
`;
        window.COLORS_LVL.forEach((color,index) => {
            stylesheet.innerHTML += `
.${self.id}Lvl${index} {
    background-color: ${color};
}`;
        });

        const sidebar = document.querySelector('#sidebar');
        const sidebarobserver = new MutationObserver(function(mutations) {
            self.onPortalSelected();
        });
        const observerconfig = {
            childList: true,
            subtree: true,
        };
        sidebarobserver.observe(sidebar,observerconfig);

        window.addHook('portalDetailLoaded', self.onPortalDetailLoaded);
        window.addHook('mapDataRefreshEnd',function() { window.setTimeout(self.updateselector); }); // use a timeout to make sure the window status is set
        if (self.settings.refreshonstart) {
            window.addHook('mapDataRefreshEnd',self.refreshonload); // runonce
        }
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
