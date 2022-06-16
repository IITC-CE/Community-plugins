// ==UserScript==
// @author         DanielOnDiordna
// @name           Portals list add-on
// @category       Addon
// @version        0.0.7.20210724.002500
// @updateURL      https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/DanielOnDiordna/portals-list-addon.meta.js
// @downloadURL    https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/DanielOnDiordna/portals-list-addon.user.js
// @description    [danielondiordna-0.0.7.20210724.002500] Add-on to only display portals for visible/enabled layers, a fix for Unclaimed/Placeholder Portals, added level filters and load portal details.
// @id             portals-list-addon@DanielOnDiordna
// @namespace      https://softspot.nl/ingress/
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    // use own namespace for plugin
    window.plugin.portalslistAddon = function() {};
    var self = window.plugin.portalslistAddon;
    self.id = 'portalslistAddon';
    self.title = 'Portals list add-on';
    self.version = '0.0.7.20210724.002500';
    self.author = 'DanielOnDiordna';
    self.changelog = `
Changelog:

version 0.0.1.20191114.115600
- first release

version 0.0.2.2020109.001300
- added a fix for portals with an undefined title, level and health

version 0.0.3.2020125.003100
- added loading of more portal details columns like shields, resonators, mods, owner

version 0.0.4.20200308.232600
- replaced a lot of code to speed up the table updates
- added a stop loading button
- limit loading details to new details only

version 0.0.5.20210204.231200
- changed title from 'show list of portals add-on' to 'Portals list add-on' to match IITC-CE plugin name
- disabled skipping ghost portals in main plugin
- fixed sort functions to support ghost portals
- portal table displayed with fixed title and made scrollable
- updated plugin wrapper and userscript header formatting to match IITC-CE coding

version 0.0.5.20210421.190200
- minor fix for IITC CE where runHooks iitcLoaded is executed before addHook is defined in this plugin

version 0.0.6.20210621.234600
- added level filter checkboxes
- changed filtering for visible layers

version 0.0.7.20210711.210800
- fixed row number for loaded portal details
- fixed problem that would filter away all neutral portals
- neutral portals now show no shields, resonators, mods and owne
- details for neutral portals are not loaded anymore

version 0.0.7.20210724.002500
- prevent double plugin setup on hook iitcLoaded
`;
    self.namespace = 'window.plugin.' + self.id + '.';
    self.pluginname = 'plugin-' + self.id;

    self.unclaimedlayername = 'Unclaimed/Placeholder'; // Value will be retreived from window.setupMap
    self.enllayername = 'Enlightened';
    self.reslayername = 'Resistance';
    self.levellayername = 'Level '; // Value will be retreived from window.setupMap
    self.portallayername = ' Portals'; // Value will be retreived from window.setupMap

    self.portaldetails = {};
    self.requestlist = {};
    self.requestid = undefined;

    self.ownercolor = 'black';
    self.shortmodnames =
        {
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
    self.shortrarities =
        {
            'COMMON'    : 'c',
            'RARE'      : 'r',
            'VERY_RARE' : 'v'
        };
    self.filterlevel = [];
    self.countlevel = [];

    self.gettotalshielding = function(guid,htmlformatting) {
        if (!self.portaldetails[guid]) return (htmlformatting?(window.portals[guid] && window.portals[guid].options.team != TEAM_NONE ? 'unknown' : ''):-1);
        var details = self.portaldetails[guid];
        var linkInfo = window.getPortalLinks(guid);
        var linkCount = linkInfo.in.length + linkInfo.out.length;
        var mitigationDetails = window.getPortalMitigationDetails(details,linkCount);
        var totalshielding = mitigationDetails.shields + mitigationDetails.links;
        return totalshielding;
    };

    self.getresonatorstring = function(guid,htmlformatting,highlightowner) {
        if (!self.portaldetails[guid]) return (self.requestlist[guid]?'(loading)':(window.portals[guid] && window.portals[guid].options.team != TEAM_NONE ? '(unknown)' : '--------') );

        if (!highlightowner) highlightowner = window.PLAYER.nickname;
        var resonators = self.portaldetails[guid].resonators;
        var portalowner = self.getportalowner(guid);

        resonators = resonators.sort(function(b,a) {return (a.level + a.owner > b.level + b.owner) ? 1 : ((b.level + b.owner > a.level + a.owner) ? -1 : 0);}); // sort by resonator level resonator[owner,level]

        var resolist = [];
        for (let cnt=0; cnt<8; cnt++) {
            var resonator = '-';
            if (cnt < resonators.length && resonators[cnt]) {
                //var nrg = parseInt(resonators[cnt].energy);
                resonator = parseInt(resonators[cnt].level); // level
                let resonatorowner = resonators[cnt].owner;
                if (htmlformatting) {
                    if (resonatorowner === highlightowner) {
                        resonator = '<span style="color:' + self.ownercolor + '">' + resonator + '</span>'; // highlight reso's of current player
                    } else if (resonatorowner !== portalowner) {
                        resonator = '<u>' + resonator + '</u>'; // underline reso's of other people then the portal owner
                    }
                    resonator = '<span title="' + resonatorowner + (self.requestlist[guid]?' (updating)':'') + '">' + resonator + '</span>';
                }
            }
            resolist.push(resonator);
        }
        return resolist.join('');
    };

    self.getmodstring = function(guid,htmlformatting,highlightowner) {
        if (!self.portaldetails[guid]) return (self.requestlist[guid]?'(loading)':(window.portals[guid] && window.portals[guid].options.team != TEAM_NONE ? '(unknown)' : ''));

        if (!highlightowner) highlightowner = window.PLAYER.nickname;
        var mods = self.portaldetails[guid].mods;
        if (mods.length === 0) return '(empty)';
        var portalowner = self.getportalowner(guid);

        var modslist = [];
        for (let cnt=0; cnt<4; cnt++) {
            let mod = '';
            if (cnt < mods.length && mods[cnt]) {
                mod = self.shortmodnames[mods[cnt].name];
                let modowner = mods[cnt].owner; // owner
                if (mod === 'H' || mod === 'S' || mod === 'M') mod = self.shortrarities[mods[cnt].rarity] + mod;
                if (htmlformatting) {
                    if (modowner === highlightowner) {
                        mod = '<span style="color:' + self.ownercolor + '">' + mod + '</span>'; // highlight mods of current player
                    } else if (modowner !== portalowner) {
                        mod = '<u>' + mod + '</u>'; // underline mods of other people then the portal owner
                    }
                    mod = '<span title="' + modowner + (self.requestlist[guid]?' (updating)':'') + ' - ' + mods[cnt].name + '">' + mod + '</span>';
                }
            }
            modslist.push(mod);
        }
        return modslist.join(' ');
    };

    self.getportalowner = function(guid,htmlformatting,highlightowner) {
        if (!self.portaldetails[guid]) return (self.requestlist[guid]?'(loading)':(window.portals[guid] && window.portals[guid].options.team != TEAM_NONE ? '(unknown)' : '-'));

        var owner = self.portaldetails[guid].owner;
        if (!htmlformatting) return owner;

        if (!highlightowner) highlightowner = window.PLAYER.nickname;

        owner = '<span' + (owner === highlightowner?' style="color:' + self.ownercolor + '"':'') + (self.requestlist[guid]?' title="(updating)"':'') + '>' + owner + '</span>';
        if (self.requestlist[guid]) owner = '<i>' + owner + '</i>';
        return owner;
    };

    self.loaddetails = function() {
        var visiblebounds = map.getBounds();
        self.requestlist = {};

        // create guid list of visible portal rows
        for (let cnt = 2; cnt < $('#portalslist TR').length; cnt++) {
            let guid = $('#portalslist TR:eq(' + cnt + ')').attr('guid');
            if (guid && !self.portaldetails[guid] && (!(guid in window.portals) || window.portals[guid] && window.portals[guid].options.team != TEAM_NONE)) {
                self.requestlist[guid] = window.portals[guid];
            }
        }

        // update portal list
        for (let cnt = 0; cnt < window.plugin.portalslist.listPortals.length; cnt++) {
            let guid = window.plugin.portalslist.listPortals[cnt].portal.options.guid;
            if (self.requestlist[guid]) {
                window.plugin.portalslist.listPortals[cnt] = self.getPortalObj(guid);
            }
        }

        // update list:
        $('#portalslist').empty().append(window.plugin.portalslist.portalTable(window.plugin.portalslist.sortBy, window.plugin.portalslist.sortOrder, window.plugin.portalslist.filter));

        //console.log('loaddetails',self.requestlist);
        self.requestid = undefined;
        self.loadnext();
    };

    self.stoploaddetails = function() {
        // update portal list
        for (let cnt = 0; cnt < window.plugin.portalslist.listPortals.length; cnt++) {
            let guid = window.plugin.portalslist.listPortals[cnt].portal.options.guid;
            if (self.requestlist[guid]) {
                delete(self.requestlist[guid]);
                window.plugin.portalslist.listPortals[cnt] = self.getPortalObj(guid);
            }
        }
        self.requestlist = {};

        $('#portalslist').empty().append(window.plugin.portalslist.portalTable(window.plugin.portalslist.sortBy, window.plugin.portalslist.sortOrder, window.plugin.portalslist.filter));
    };

    self.loadnext = function() {
        if (self.requestid) return; // busy

        if (Object.keys(self.requestlist).length == 0) {
            self.loaddetailsarea.textContent = '';
            self.loadbutton.style.display = 'inline';
            self.stopbuttonarea.style.display = 'none';
            return;
        }
        self.loaddetailsarea.textContent = ' (' + Object.keys(self.requestlist).length + ')';

        self.requestid = Object.keys(self.requestlist)[0];
        window.portalDetail.request(self.requestid);
    };

    self.storedetails = function(data) {
        if (!(data instanceof Object)) return;

        //console.log('storedetails',data.details);
        self.portaldetails[data.guid] = data.details; // plain storage of all details
        delete(self.requestlist[data.guid]); // delete before executing getPortalObj

        // update table row
        let guid = data.guid;

        // find row with this guid
        let rowcnt = -1;
        let rownum = -1;
        for (let cnt = 2; cnt < $('#portalslist TR').length; cnt++) {
            if (guid == $('#portalslist TR:eq(' + cnt + ')').attr('guid')) {
                rowcnt = cnt - 2; // fix row number
                rownum = cnt;
                break;
            }
        }

        let objcnt = -1;
        if (rowcnt >= 0) {
            // find list item with this guid
            for (let cnt = 0; cnt < window.plugin.portalslist.listPortals.length; cnt++) {
                if (guid == window.plugin.portalslist.listPortals[cnt].portal.options.guid) {
                    // update list item
                    window.plugin.portalslist.listPortals[cnt] = self.getPortalObj(guid);
                    objcnt = cnt;
                    break;
                }
            }
        }

        if (objcnt >= 0) {
            // update this row
            let row = window.plugin.portalslist.listPortals[objcnt].row;
            //console.log(guid,found,i,rowcnt,row);
            row.cells[0].textContent = rowcnt; // fix row number
            $('#portalslist TR:eq(' + rownum + ')').replaceWith(row);
        }

        if (data.guid == self.requestid) {
            self.requestid = undefined;
            self.loadnext();
        }
    };

    self.initialize = function() {
        let neutraldisplayed = window.isLayerGroupDisplayed(self.unclaimedlayername);
        let enldisplayed = window.isLayerGroupDisplayed(self.enllayername);
        let resdisplayed = window.isLayerGroupDisplayed(self.reslayername);
        if (neutraldisplayed && resdisplayed && enldisplayed) {
            window.plugin.portalslist.filter = 0;
        } else if (neutraldisplayed && !resdisplayed && !enldisplayed) {
            window.plugin.portalslist.filter = 1;
        } else if (!neutraldisplayed && resdisplayed && enldisplayed) {
            window.plugin.portalslist.filter = -1;
        } else if (!neutraldisplayed && resdisplayed && !enldisplayed) {
            window.plugin.portalslist.filter = 2;
        } else if (neutraldisplayed && !resdisplayed && enldisplayed) {
            window.plugin.portalslist.filter = -2;
        } else if (!neutraldisplayed && !resdisplayed && enldisplayed) {
            window.plugin.portalslist.filter = 3;
        } else if (neutraldisplayed && resdisplayed && !enldisplayed) {
            window.plugin.portalslist.filter = -3;
        }

        self.filterlevel = [];
        self.countlevel = [];
        self.filterlevel[0] = neutraldisplayed;
        for (let level = 1; level <= 8; level++) {
            self.filterlevel[level] = window.isLayerGroupDisplayed(self.levellayername + level + self.portallayername);
            self.countlevel[level] = '';
        }
    };

    self.setup = function() {
        if ('pluginloaded' in self) {
            console.log('IITC plugin already loaded: ' + self.title + ' version ' + self.version);
            return;
        } else {
            self.pluginloaded = true;
        }

        if (!window.plugin.portalslist) {
            console.log('IITC plugin ERROR: ' + self.title + ' version ' + self.version + ' - requires plugin portalslist');
            return;
        }

        let unclaimedlayernamematches = window.setupMap.toString().match(/i === 0 \? \'([^']+)\'[^']+\'([^']+)\'[^']+\'([^']+)\'/); // find the exact name for the unclaimed portals layer, and level layer
        // expect: var t = (i === 0 ? 'Unclaimed/Placeholder' : 'Level ' + i) + ' Portals';
        if (unclaimedlayernamematches) {
            self.unclaimedlayername = unclaimedlayernamematches[1] + unclaimedlayernamematches[3];
            self.levellayername = unclaimedlayernamematches[2];
            self.portallayername = unclaimedlayernamematches[3];
        }
        if (window.TEAM_NAMES) self.enllayername = window.TEAM_NAMES[window.TEAM_ENL];
        if (window.TEAM_NAMES) self.reslayername = window.TEAM_NAMES[window.TEAM_RES];

        let getPortalsString = window.plugin.portalslist.getPortals.toString();
        // disable skipping ghost portals
        getPortalsString = getPortalsString.replace('if (!portal.options.data.title)','if (false && !portal.options.data.title)');
        // add portal guid as an attribute, to be used for replacing data in the table
        getPortalsString = getPortalsString.replace('obj.row = row;','row.setAttribute("guid", portal.options.guid);\n    obj.row = row;');
        getPortalsString = getPortalsString.replace(/(.*switch)/,'    ' + self.namespace + 'countlevel[portal.options.level]++;\n$1');
        eval('window.plugin.portalslist.getPortals = ' + getPortalsString + ';');

        let getPortalLinkString = window.plugin.portalslist.getPortalLink.toString();
        // fix undefined titles and make the title smaller
        getPortalLinkString = getPortalLinkString.replace('link.textContent = portal.options.data.title;','link.textContent = (portal.options.data.title ? portal.options.data.title : "[undefined]");\n  if (link.textContent.length > 30) {\n    link.title = link.textContent;\n    link.textContent = link.textContent.substring(0,27) + \'...\';\n  }\n');
        // show leading spaces in a title
        getPortalLinkString = getPortalLinkString.replace('("a");','("a");\n  link.style.whiteSpace = "pre";');
        eval('window.plugin.portalslist.getPortalLink = ' + getPortalLinkString + ';');

        // Fix columns value and format functions to support ghost portals:
        for (let cnt = 0; cnt < window.plugin.portalslist.fields.length; cnt++) {
            if (window.plugin.portalslist.fields[cnt].title == "Portal Name") {
                window.plugin.portalslist.fields[cnt].value = function(portal) { return (portal.options.data.title && portal.options.data.title != "" ? portal.options.data.title : "[undefined]"); };
            } else if (window.plugin.portalslist.fields[cnt].title == "Level") {
                window.plugin.portalslist.fields[cnt].value = function(portal) { return (portal.options.data.level ? portal.options.data.level : -1); };
                let formatString = window.plugin.portalslist.fields[cnt].format.toString().replace('{','{\n     value = (value == -1?"?":value);');
                eval('window.plugin.portalslist.fields[' + cnt + '].format = ' + formatString + ';');
            } else if (window.plugin.portalslist.fields[cnt].title == "Health") {
                window.plugin.portalslist.fields[cnt].value = function(portal) { return (portal.options.data.health ? portal.options.data.health : -1); };
                let formatString = window.plugin.portalslist.fields[cnt].format.toString().replace('{','{\n     value = (value == -1?"?":value);');
                eval('window.plugin.portalslist.fields[' + cnt + '].format = ' + formatString + ';');
            } else if (window.plugin.portalslist.fields[cnt].title == "AP") {
                window.plugin.portalslist.fields[cnt].sortValue = function(value, portal) { return (Number.isNaN(value.enemyAp) ? -1 : value.enemyAp); }
                let formatString = window.plugin.portalslist.fields[cnt].format.toString().replace('{','{\n      for (let i in value) {\n        value[i] = (Number.isNaN(value[i])?"?":value[i]);\n      };');
                eval('window.plugin.portalslist.fields[' + cnt + '].format = ' + formatString + ';');
            }
        }

        // make dialog wider to fit extra columns and extra buttons
        let displayPLString = window.plugin.portalslist.displayPL.toString();
        displayPLString = displayPLString.replace(/(.+getPortals.+)/,'  ' + self.namespace + 'initialize();\n\n$1');
        displayPLString = displayPLString.replace(/(Nothing to show!)/,'$1 <a onclick="if (window.useAndroidPanes()) { \$(\\\'#portalslist\\\').remove(); } window.plugin.portalslist.displayPL()">Refresh</a>');
        displayPLString = displayPLString.replace('width: 700','width: 900'); /*,\n' +
                                                  '   buttons: [\n' +
                                                  '    {\n' +
                                                  '      text: "Load details",\n' +
                                                  '      click: function() {\n' +
                                                  '        ' + self.namespace + 'loaddetails();\n' +
                                                  '      }\n' +
                                                  '    },\n' +
                                                  '    {\n' +
                                                  '      text: "Stop loading",\n' +
                                                  '      click: function() {\n' +
                                                  '        ' + self.namespace + 'stoploaddetails();\n' +
                                                  '      }\n' +
                                                  '    },\n' +
                                                  '    {\n' +
                                                  '      text: "OK",\n' +
                                                  '      click: function() {\n' +
                                                  '        $( this ).dialog( "close" );\n' +
                                                  '      }\n' +
                                                  '    }\n' +
                                                  '  ]');
                                                  */
        // console.log(displayPLString);
        eval('window.plugin.portalslist.displayPL = ' + displayPLString + ';');
        // modification max-width: 1000px
        $('<style>').prop('type', 'text/css').html('.ui-dialog-portalslist { max-width: 1000px }').appendTo('head');

        self.appendLoadButton = function(cell) {
            cell.style.cursor = 'unset';
            cell.style.textAlign = 'unset';
            cell.style.whiteSpace = 'nowrap';

            self.loadbutton = cell.appendChild(document.createElement('a'));
            self.loadbutton.textContent = 'Load details';
            self.loadbutton.style.display = (Object.keys(self.requestlist).length <= 0 ? 'inline' : 'none');

            self.stopbuttonarea = cell.appendChild(document.createElement('div'));
            self.stopbuttonarea.style.display = (Object.keys(self.requestlist).length > 0 ? 'inline' : 'none');
            let stopbutton = self.stopbuttonarea.appendChild(document.createElement('a'));
            stopbutton.textContent = 'Stop';
            self.loaddetailsarea = self.stopbuttonarea.appendChild(document.createElement('span'));
            self.loaddetailsarea.textContent = '';

            self.loadbutton.addEventListener('click', function(e) {
                e.preventDefault();
                self.loaddetails();
                self.loadbutton.style.display = 'hidden';
                self.stopbuttonarea.style.display = 'inline';
            },false);

            stopbutton.addEventListener('click', function(e) {
                e.preventDefault();
                self.stoploaddetails();
                self.stopbuttonarea.style.display = 'hidden';
                self.loadbutton.style.display = 'inline';
            },false);
        };

        self.appendLevelRow = function(row) {
            if(!window.useAndroidPanes()) row.insertCell(-1);
            for (let level = 1; level <= 8; level++) {
                let cell = row.insertCell(-1);
                cell.style.textAlign = 'unset';
                let buttonarea = cell.appendChild(document.createElement('label'));
                buttonarea.style.display = 'block';
                buttonarea.style.cursor = 'pointer';
                buttonarea.style.userSelect = 'none';
                let button = buttonarea.appendChild(document.createElement('input'));
                button.type = 'checkbox';
                buttonarea.appendChild(document.createTextNode('L' + level + (self.countlevel[level] > 0 ? ' x' + self.countlevel[level] : '')));
                if (self.countlevel[level] <= 0) {
                    button.checked = false;
                    button.disabled = true;
                    buttonarea.disabled = true;
                } else {
                    button.checked = self.filterlevel[level];
                    button.addEventListener('change', function(e) {
                        e.preventDefault();
                        self.filterlevel[level] = button.checked;
                        $('#portalslist').empty().append(window.plugin.portalslist.portalTable(window.plugin.portalslist.sortBy, window.plugin.portalslist.sortOrder, window.plugin.portalslist.filter));
                    },false);
                }
            }
        };

        let portalTableString = window.plugin.portalslist.portalTable.toString();
        // do not display portals in the list, when the layer is disabled:
        self.filterLevels = function(portals) {
            return portals.filter(function(obj) {
                return self.filterlevel[obj.portal.options.level];
            });
        };

        portalTableString = portalTableString.replace(/(var table)/,'portals = ' + self.namespace + 'filterLevels(portals);\n  $1');
        portalTableString = portalTableString.replace(/(.*\$\('\#portalslist'\).+)/,'if (i == 0) {\n       for (let level = 0; level <= 8; level++) {\n         ' + self.namespace + 'filterlevel[level] = true;\n         }\n       };\n      $1');

        portalTableString = portalTableString.replace(/(var container.*)/,"$1\n    let hiddenautofocusinput = document.createElement('input');\n    hiddenautofocusinput.type = 'hidden';\n    hiddenautofocusinput.autofocus = 'autofocus';    container.append(hiddenautofocusinput);\n");
        portalTableString = portalTableString.replace("table.className = 'portals';","table.className = 'portals';\n  table.setAttribute('style', 'display: block; overflow-y: auto; max-height: 588px;');");
        portalTableString = portalTableString.replace(/(cell = row.appendChild\(document.createElement\('th'\)\);)/gs,"let th = document.createElement('th');\n  th.setAttribute('style','position: sticky; top: 0px;');\n  cell = row.appendChild(th);\n  //$1");
//        portalTableString = portalTableString.replace(/(\}\);)(\s+table =)/s,"$1\n  cell = row.insertCell(-1);\n  cell.innerHTML = '" + '<a href="#" onclick="' + self.namespace + 'loaddetails(); return false;" style="display: inline;">Load details</a><a href="#" onclick="' + self.namespace + 'stoploaddetails(); return false;" style="display: none;">Stop loading</a>' + "';$2");
        portalTableString = portalTableString.replace(/(\}\);)(\s+table =)/s,"$1\n  cell = row.insertCell(-1);\n  " + self.namespace + "appendLoadButton(cell);\n  row = table.insertRow(-1);\n  " + self.namespace + "appendLevelRow(row);$2");

        eval('window.plugin.portalslist.portalTable = ' + portalTableString + ';');

        /*
        if (window.useAndroidPanes()) {
            let portalTableString = window.plugin.portalslist.portalTable.toString();
            portalTableString = portalTableString.replace('return container','container.append(\'<a href="#" onclick="' + self.namespace + 'loaddetails(); return false;" class="portalslistbutton">Load details</a>\',\'<a href="#" onclick="' + self.namespace + 'stoploaddetails(); return false;" class="portalslistbutton">Stop loading</a>\');\n\n  return container');
            eval('window.plugin.portalslist.portalTable = ' + portalTableString + ';');
        }
        */

        // create a new getPortalObj function, using the getPortals function details, to enable updating the portals list table rows:
        let getPortalObjString = window.plugin.portalslist.getPortals.toString();
        getPortalObjString = getPortalObjString.replace('()','(guid)').replace(/\{.*?var obj/s,'{\n    var portal = window.portals[guid];\n    var obj').replace(/window\.plugin\.portalslist\.listPortals.*/s,'return obj;\n}');
        eval(self.namespace + 'getPortalObj = ' + getPortalObjString + ';');

        // add extra columns
        window.plugin.portalslist.fields.push({
            title: "shields",
            value: function(portal) { return portal.options.guid; },
            sortValue: function(value, portal) { return self.gettotalshielding(portal.options.guid); },
            format: function(cell, portal, guid) {
                $(cell)
                    .addClass("alignR")
                    .append($('<span>')
                            .html(self.gettotalshielding(guid,true))
                            .attr({
                    "class": "value",
                    "style": "font-family: courier",
                }));
            },
        });
        window.plugin.portalslist.fields.push({
            title: "resonators",
            value: function(portal) { return portal.options.guid; },
            sortValue: function(value, portal) { return self.getresonatorstring(portal.options.guid,false); },
            format: function(cell, portal, guid) {
                $(cell)
                    .append($('<span>')
                            .html(self.getresonatorstring(guid,true))
                            .attr({
                    "class": "value",
                    "style": "font-family: courier",
                }));
            },
        });
        window.plugin.portalslist.fields.push({
            title: "mods",
            value: function(portal) { return portal.options.guid; },
            sortValue: function(value, portal) { return self.getmodstring(portal.options.guid,false).toLowerCase(); },
            format: function(cell, portal, guid) {
                $(cell)
                    .append($('<span>')
                            .html(self.getmodstring(guid,true))
                            .attr({
                    "class": "value",
                }));
            },
        });
        window.plugin.portalslist.fields.push({
            title: "owner",
            value: function(portal) { return portal.options.guid; },
            sortValue: function(value, portal) { return self.getportalowner(portal.options.guid).toLowerCase(); },
            format: function(cell, portal, guid) {
                $(cell)
                    .append($('<span>')
                            .html(self.getportalowner(guid,true))
                            .attr({
                    "class": "value",
                }));
            },
        });

        window.addHook('portalDetailLoaded', function(data) { self.storedetails(data); });

        $('head').append(
            '<style>' +
            '.portalslistbutton { padding: 5px; margin-top: 3px; margin-bottom: 3px; margin-left: 5px; margin-right: 5px; border: 2px outset #20A8B1; white-space: nowrap; display: inline-block;}'+
            '</style>');

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

