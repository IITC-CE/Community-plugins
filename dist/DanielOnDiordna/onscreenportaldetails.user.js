// ==UserScript==
// @author         DanielOnDiordna
// @name           Onscreen Portal Details
// @category       Info
// @version        1.0.0.20251106.130200
// @updateURL      https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/DanielOnDiordna/onscreenportaldetails.meta.js
// @downloadURL    https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/DanielOnDiordna/onscreenportaldetails.user.js
// @description    [danielondiordna-1.0.0.20251106.130200] Show portal info about resonators and mods for the selected portal directly on the map.
// @id             onscreenportaldetails@DanielOnDiordna
// @namespace      https://softspot.nl/ingress/
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    // use own namespace for plugin
    window.plugin.onscreenportaldetails = function() {};
    var self = window.plugin.onscreenportaldetails;
    self.id = 'onscreenportaldetails';
    self.title = 'Onscreen Portal Details';
    self.version = '1.0.0.20251106.130200';
    self.author = 'DanielOnDiordna';
    self.changelog = `
Changelog:

version 1.0.0.20251106.130200
- first major version
- added a menu with custom settings
- added color settings
- added position settings
- placed all styles in a stylesheet
- replaced flat html by DOM created objects
- replaced all combined strings by literals

version 0.0.3.20210724.002500
- prevent double plugin setup on hook iitcLoaded

version 0.0.3.20210421.190200
- minor fix for IITC CE where runHooks iitcLoaded is executed before addHook is defined in this plugin

version 0.0.3.20210204.103400
- renamed plugin to from 'Selected Portal Info' to 'Onscreen Portal Details'
- added click through option: pointer-events:none;
- sort resonators by level and owner name
- updated plugin wrapper and userscript header formatting to match IITC-CE coding

version 0.0.2.20190530.124000
- default color set to red
- added horizontal offset
- changed mods from 1 to 2 characters
- fixed portal details display for selected portal only

version 0.0.1.20190523.214500
- first release
`;

    self.settings = {
        backgroundcolor: '#ffffff',
        backgroundopacity: 0.5,
        defaultcolor: '#ff0000',
        currentplayercolor: '#000000',
        ownercolor: '#ff0000',
        fontsize: 11, // px
        horizontalposition: 1, // %
        verticalposition: 14 // %
    };

    self.shortmodnames =
        {
            'Heat Sink'            :'HS',
            'Portal Shield'        :'SH',
            'Link Amp'             :'LA',
            'Turret'               :'TU',
            'Multi-hack'           :'MH',
            'Aegis Shield'         :'AE',
            'Force Amp'            :'FA',
            'SoftBank Ultra Link'  :'UL',
            'Ito En Transmuter (+)':'I+',
            'Ito En Transmuter (-)':'I-'
        };
    self.shortrarities =
        {
            'COMMON'    : 'c',
            'RARE'      : 'r',
            'VERY_RARE' : 'vr'
        };
    self.fontfamilies = [
        '', // default
        'Arial',
        'Verdana',
        'Helvetica',
        'Tahoma',
        'Trebuchet MS',
        'Times New Roman',
        'Georgia',
        'Garamond',
        'Brush Script MT',
        'Monospace',
        'Courier New',
        'Lucida Console',
        'Monaco',
        'Cursive Brush Script MT',
        'Lucida Handwriting',
        'Fantasy Copperplate',
        'Papyrus'
    ];

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

    function hexToRGBA(hex,alpha) {
        hex = !hex ? '' : hex.replace(/[^0-9A-F]/gi, ''); // remove invalid characters
        if (hex.length < 3) return 'rgba(0, 0, 0, 1)'; // fail, return black
        if (hex.length < 5) hex = hex.split('').map(s => s + s).join(''); // 3, 4 characters double-up
        let rgba = hex.match(/.{1,2}/g).map(s => parseInt(s, 16)); // parse pairs of two
        if (typeof alpha == 'string' && !isNaN(parseFloat(alpha))) alpha = parseFloat(alpha);
        rgba[3] = parseFloat(typeof alpha == 'number' && alpha >= 0 && alpha <= 1 ? alpha : rgba.length > 3 ? rgba[3] / 255 : '1').toFixed(2); // alpha code between 0 & 1 / default 1
        return 'rgba(' + rgba.join(', ') + ')';
    }

    self.getContainer = function() {
        let container = document.querySelector(`div#${self.id}`);
        if (!container) {
            // create a text area
            container = document.createElement('div');
            container.id = self.id;
            container.classList.add('hide');

            // place it above the mobile status-bar or above the chatcontrols
            //let target = document.querySelector((window.isSmartphone()?'#updatestatus':'#chatcontrols'));
            //if (target) target.prepend(container);
            document.body.append(container);
        }
        return container;
    };
    self.hideContainer = function() {
        let container = self.getContainer();
        container.classList.add('hide');
        container.innerHTML = '';
    };
    self.showContainer = function() {
        let container = self.getContainer();
        container.classList.remove('hide');
    };

    self.onPortalSelected = function() {
        if (!window.overlayStatus[self.title] || !window.selectedPortal || !(window.selectedPortal in window.portals)) {
            self.hideContainer();
            return;
        }
        self.showPortalSelected();
    };

    self.showPortalSelected = function(data) {
        if (!window.overlayStatus[self.title] || !window.selectedPortal || data && data?.guid !== window.selectedPortal) {
            self.hideContainer();
            return;
        }

        if (!data || !data.details) {
            data = {
                details: window.portalDetail.get(window.selectedPortal) // get cached details
            };
        }
        if (!data.details || !data.details.resonators) {
            self.hideContainer();
            return;
        }

        let portalowner = data.details.owner || 'unclaimed';
        let currentplayer = window.PLAYER.nickname;
        let level = data.details.owner ? data.details.level : 0;

        data.details.resonators.sort((a, b) => {
            if (a.level === b.level && a.owner === b.owner && a.energy === b.energy) return 0; // do not sort
            if (a.level === b.level && a.owner === b.owner) a.energy < b.energy ? 1 : -1; // sort high to low
            if (a.level === b.level) return a.owner.toLowerCase() > b.owner.toLowerCase() ? 1 : -1; // sort alphabetically
            return a.level < b.level ? 1 : -1; // sort high to low
        });

        let container = self.getContainer();
        container.innerHTML = '';

        let ownerarea = container.appendChild(document.createElement('div'));
        ownerarea.className = 'ownerarea';
        let portallevelarea = ownerarea.appendChild(document.createElement('div'));
        portallevelarea.innerText = `P${level}`;
        let portalownerarea = ownerarea.appendChild(document.createElement('div'));
        if (portalowner === currentplayer) portalownerarea.classList.add('currentplayer');
        portalownerarea.classList.add('portalowner');
        portalownerarea.innerText = portalowner;

        let resonatorarea = container.appendChild(document.createElement('div'));
        resonatorarea.className = 'resonatorarea';
        for (let cnt = 0; cnt < 8; cnt++) {
            if (data.details.resonators[cnt] && data.details.resonators[cnt].owner) {
                let owner = data.details.resonators[cnt].owner;
                let level = data.details.resonators[cnt].level;

                let levelarea = resonatorarea.appendChild(document.createElement('div'));
                levelarea.innerText = `R${level}`;

                let ownerarea = resonatorarea.appendChild(document.createElement('div'));
                if (owner === currentplayer) ownerarea.classList.add('currentplayer');
                if (owner === portalowner) ownerarea.classList.add('portalowner');
                ownerarea.innerText = owner;
            }
        }

        let modarea = container.appendChild(document.createElement('div'));
        modarea.className = 'modarea';
        for (let cnt = 0; cnt < 4; cnt++) {
            if (data.details.mods[cnt] && data.details.mods[cnt].owner) {
                let shortname = self.shortmodnames[data.details.mods[cnt].name];
                let rarity = (shortname.match(/^(HS|SH|MH)$/) ? self.shortrarities[data.details.mods[cnt].rarity] : '');
                let owner = data.details.mods[cnt].owner;

                let rarityarea = modarea.appendChild(document.createElement('div'));
                rarityarea.innerHTML = `${rarity}${shortname}`;

                let ownerarea = modarea.appendChild(document.createElement('div'));
                if (owner === currentplayer) ownerarea.classList.add('currentplayer');
                if (owner === portalowner) ownerarea.classList.add('portalowner');
                ownerarea.innerText = owner;
            }
        }

        self.showContainer();
    };

    self.updateStylesheet = function() {
        let stylesheet = document.querySelector(`style#${self.id}`);
        if (!stylesheet) {
            stylesheet = document.head.appendChild(document.createElement('style'));
            stylesheet.id = self.id;

            stylesheet.innerHTML = `
div#${self.id} {
    position: absolute;
    z-index: 2999; /* behind chat */
    pointer-events: none;
    float: left;
    padding: 3px;
    border-radius: 5px;
    display: grid;
    grid-row-gap: 4px;
}
div#${self.id}.hide {
    display: none !important;
}
div#${self.id} .portalowner {
    text-decoration: underline;
}
div#${self.id}>div {
    display: grid;
    grid-template-columns: fit-content(0) auto;
    grid-column-gap: 6px;
}
div#dialog-${self.pluginname}-dialog .hide {
    display: none;
}
div#dialog-${self.pluginname}-dialog button.colorpicker {
    width: 26px;
    height: 26px;
    cursor: pointer;
}
`;
//  text-shadow: 2px 2px 5px black;
        }

        let customstylesheet = document.querySelector(`style#${self.id}-custom`);
        if (!customstylesheet) {
            customstylesheet = document.head.appendChild(document.createElement('style'));
            customstylesheet.id = `${self.id}-custom`;
        }

        customstylesheet.innerHTML = `
div#${self.id} {
    bottom: ${self.settings.verticalposition}%;
    left: ${self.settings.horizontalposition}%;
}
div#${self.id}, div#dialog-${self.pluginname}-dialog button[name=backgroundcolor].colorpicker {
    background-color: ${hexToRGBA(self.settings.backgroundcolor,self.settings.backgroundopacity)};
}
div#dialog-${self.pluginname}-dialog input[type=range][name=backgroundopacity] {
    accent-color: ${self.settings.backgroundcolor};
}
div#${self.id} {
    color: ${self.settings.defaultcolor};
    font-size: ${self.settings.fontsize}px;
    ${self.settings.font ? `font-family: ${self.settings.font};` : ''}
}
div#dialog-${self.pluginname}-dialog input[type=range][name=fontsize] {
    accent-color: ${self.settings.defaultcolor};
}
div#dialog-${self.pluginname}-dialog button[name=defaultcolor].colorpicker {
    background-color: ${self.settings.defaultcolor};
}
div#${self.id} .currentplayer {
    color: ${self.settings.currentplayercolor};
}
div#dialog-${self.pluginname}-dialog button[name=currentplayercolor].colorpicker {
    background-color: ${self.settings.currentplayercolor};
}
div#${self.id} .portalowner {
    color: ${self.settings.ownercolor};
}
div#dialog-${self.pluginname}-dialog button[name=ownercolor].colorpicker {
    background-color: ${self.settings.ownercolor};
}
`;
    };

    self.menu = function() {
        let container = document.createElement('div');
        container.innerHTML = `
<p>Toggle the layer to show onscreen portal details for the selected portal.</p>

<p>If you are the resonator owner, your name will be displayed in your color.<br>
If the resonator owner is the same as the portal owner, the name will be underlined.</p>

<p>Settings:</p>

Horizontal position:<br>
<input type="range" name="horizontalposition" min="0" max="100" step="1"><br>
Vertical position:<br>
<input type="range" name="verticalposition" min="0" max="100" step="1"><br>
Background color/transparancy:<br>
<input type="color" color="backgroundcolor" range="backgroundopacity"><br>
Font:<br>
<select name="font"></select><br>
Text size:<br>
<input type="range" name="fontsize" min="8" max="25" step="1"><br>
<input type="color" color="defaultcolor"> Text color<br>
<input type="color" color="currentplayercolor"> Your color<br>
<input type="color" color="ownercolor"> Portal owner color</p>

<span style="font-style: italic; font-size: smaller">version ${self.version} by ${self.author}</span>
`;
        container.querySelectorAll('input[type=color]').forEach(colorpicker => {
            colorpicker.classList.add('hide');
            let colorname = colorpicker.getAttribute('color');
            let rangename = colorpicker.getAttribute('range');

            let button;
            if (colorname in self.settings) {
                button = document.createElement('button');
                button.className = 'colorpicker';
                button.name = colorname;
                button.addEventListener('click',function(e) {
                    colorpicker.value = self.settings[colorname];
                    colorpicker.click();
                },false);
                colorpicker.addEventListener('input',function(e) {
                    self.settings[colorname] = this.value;
                    self.storesettings();
                    self.updateStylesheet();
                },false);
                colorpicker.after(button);
            }

            if (rangename in self.settings) {
                let range = document.createElement('input');
                range.type = 'range';
                range.name = rangename;
                range.setAttribute('min',0);
                range.setAttribute('max',1);
                range.setAttribute('step',0.1);
                range.value = self.settings[rangename];
                range.addEventListener('change',function(e) {
                    self.settings[rangename] = this.value;
                    self.storesettings();
                    self.updateStylesheet();
                },false);
                button.after(range);
            }
        });
        let fontselect = container.querySelector('select[name=font]');
        self.fontfamilies.forEach(fontfamily => {
            let option = fontselect.appendChild(document.createElement('option'));
            option.value = fontfamily;
            option.text = fontfamily || 'default';
            option.selected = fontfamily == self.settings.font;
            option.style.fontFamily = fontfamily;
        });
        fontselect.addEventListener('change',function(e) {
            self.settings.font = this.value;
            self.storesettings();
            self.updateStylesheet();
        });
        let fontsizerange = container.querySelector('input[name=fontsize]');
        fontsizerange.value = self.settings.fontsize;
        fontsizerange.addEventListener('change',function(e) {
            self.settings.fontsize = this.value;
            self.storesettings();
            self.updateStylesheet();
        },false);
        let horizontalpositionrange = container.querySelector('input[name=horizontalposition]');
        horizontalpositionrange.value = self.settings.horizontalposition;
        horizontalpositionrange.addEventListener('change',function(e) {
            self.settings.horizontalposition = this.value;
            self.storesettings();
            self.updateStylesheet();
        },false);
        let verticalpositionrange = container.querySelector('input[name=verticalposition]');
        verticalpositionrange.value = self.settings.verticalposition;
        verticalpositionrange.addEventListener('change',function(e) {
            self.settings.verticalposition = this.value;
            self.storesettings();
            self.updateStylesheet();
        },false);

        container.querySelectorAll('input[type=range]').forEach(range => {
            let valuetext = document.createElement('span');
            valuetext.innerText = range.value;
            range.after(valuetext);
            range.addEventListener('change',function(e) {
                valuetext.innerText = this.value;
            },false);
        });

        if (window.useAndroidPanes()) window.show('map');
        let menudialog = window.dialog({
            html: container,
            id: self.pluginname + '-dialog',
            title: self.title
        }).dialog('option', 'buttons', {
            'Changelog': function() { alert(self.changelog); },
            'Close': function() { menudialog.dialog('close'); }
        });
    };

    self.setup = function() {
        if ('pluginloaded' in self) {
            console.log('IITC plugin already loaded: ' + self.title + ' version ' + self.version);
            return;
        } else {
            self.pluginloaded = true;
        }

        self.restoresettings();

        // delete old plugin data:
        localStorage.removeItem('selectedportalinfo-settings');
        localStorage.removeItem('plugin-onscreenportaldetails-settings');

        let portaldetailslayer = new window.L.LayerGroup();
        window.addLayerGroup(self.title, portaldetailslayer, true);

        window.map.on('layeradd', obj => {
            if (obj.layer === portaldetailslayer) {
                self.onPortalSelected();
            }
        });
        window.map.on('layerremove', obj => {
            if (obj.layer === portaldetailslayer) {
                self.hideContainer();
            }
        });

        let toolboxmenulink = document.querySelector('#toolbox').appendChild(document.createElement('a'));
        toolboxmenulink.innerText = self.title;
        toolboxmenulink.addEventListener('click',function(e) {
            self.menu();
        },false);

        self.updateStylesheet();

        window.addHook('portalSelected',self.onPortalSelected);
        window.addHook('portalDetailLoaded',self.showPortalSelected);

        console.log('IITC plugin loaded: ' + self.title + ' version ' + self.version);
    };

    let setup = function() {
        (window.iitcLoaded?self.setup():window.addHook('iitcLoaded',self.setup));
    };

    // Added to support About IITC details and changelog:
    plugin_info.script.version = plugin_info.script.version.replace(/\.\d{8}\.\d{6}$/,'');
    plugin_info.buildName = 'softspot.nl';
    plugin_info.dateTimeVersion = self.version.replace(/^.*(\d{4})(\d{2})(\d{2})\.(\d{6})/,'$1-$2-$3-$4');
    plugin_info.pluginId = self.id;
    let changelog = [{version:'This is a <a href="https://softspot.nl/ingress/" target="_blank">softspot.nl</a> plugin by ' + self.author,changes:[]},...self.changelog.replace(/^.*?version /s,'').split(/\nversion /).map((v)=>{v=v.split(/\n/).map((l)=>{return l.replace(/^- /,'')}).filter((l)=>{return l != "";}); return {version:v.shift(),changes:v}})];

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
