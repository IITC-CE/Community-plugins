// ==UserScript==
// @author         DanielOnDiordna
// @name           Filter Comms for MU
// @category       Tweak
// @version        0.0.3.20211024.003700
// @updateURL      https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/DanielOnDiordna/filter-comms.meta.js
// @downloadURL    https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/DanielOnDiordna/filter-comms.user.js
// @description    [danielondiordna-0.0.3.20211024.003700] Filter the 'all' comms pane to show only created Control Fields and their MUs
// @id             filter-comms@DanielOnDiordna
// @namespace      https://softspot.nl/ingress/
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    // use own namespace for plugin
    window.plugin.filtercomms = function() {};
    var self = window.plugin.filtercomms;
    self.id = 'filtercomms';
    self.title = 'Filter Comms for MU';
    self.version = '0.0.3.20211024.003700';
    self.author = 'DanielOnDiordna';
    self.changelog = `
Changelog:

version 0.0.1.20201112.164400
- First version

version 0.0.2.20210126.231800
- updated plugin wrapper and userscript header formatting to match IITC-CE coding
- auto show toggle filter menu on mobile when 'all' pane is displayed

version 0.0.2.20210421.190200
- minor fix for IITC CE where runHooks iitcLoaded is executed before addHook is defined in this plugin

version 0.0.2.20210724.002500
- prevent double plugin setup on hook iitcLoaded

version 0.0.3.20211024.003700
- minor change to work side by side with Logs Diary plugin by ZasoItems
`;
    self.namespace = 'window.plugin.' + self.id + '.';
    self.pluginname = 'plugin-' + self.id;

    self.settings = {};
    self.settings.filtercreatedcontrolfields = false;

    self.updatechat = function() {
        let tab = window.chat.getActive();
        switch(tab) {
            case 'faction':
                window.chat.renderFaction(false);
                break;
            case 'all':
                window.chat.renderPublic(false);
                break;
            case 'alerts':
                window.chat.renderAlerts(false);
                break;
            case 'public':
                window.chat.renderPublicChat(false);
                break;
        }
    };

    self.onPaneChanged = function(pane) {
        if (pane === 'all')
            self.menu();
    };

    self.menu = function() {
        let html = '<div class="' + self.id + 'menu">' +
            '<input type="checkbox" id="' + self.id + 'filtercreatedcontrolfields" name="' + self.id + 'filtercreatedcontrolfields" onclick="' + self.namespace + 'settings.filtercreatedcontrolfields = this.checked; ' + self.namespace + 'updatechat();"' + (self.settings.filtercreatedcontrolfields?' checked':'') + '></input><label for="' + self.id + 'filtercreatedcontrolfields">Filter for created Control Fields</label><br />' +
            '<span style="font-style: italic; font-size: smaller">version ' + self.version + ' by ' + self.author + '</span>' +
            '</div>';

        window.dialog({
            html: html,
            id: 'plugin-' + self.id + '-menu',
            dialogClass: 'ui-dialog-' + self.id + 'menu',
            title: self.title
        });
    };

    self.setup = function() {
        if ('pluginloaded' in self) {
            console.log('IITC plugin already loaded: ' + self.title + ' version ' + self.version);
            return;
        } else {
            self.pluginloaded = true;
        }

        // rewrite existing function from IITC core to add a filter for created Control Fields:
        // window.plugin.logsDiary replaces the renderData function and formatting differs where the change was made! so this replacement needs to be delayed and changed what to replace
        setTimeout(function() {
            let renderData_override = window.chat.renderData.toString();
            renderData_override = renderData_override.replace(/(var nextTime)/,'if (' + self.namespace + 'settings.filtercreatedcontrolfields && !(/created a Control Field/.test(msg[2]))) return;\n    $1');
            eval('window.chat.renderData = ' + renderData_override);
        },0);

        if (window.useAndroidPanes()) {
            window.addHook("paneChanged", self.onPaneChanged);
        }

        if (window.useAndroidPanes()) {
            //add options menu
            $('#toolbox').append('<a onclick="' + self.namespace + 'menu(); return false;" href="#">' + self.title + '</a>');
        } else {
            $("#chatcontrols a:contains('all')").after('<input type="checkbox" title="Filter for created Control Fields" id="filtercreatedcontrolfields">');
            $("#filtercreatedcontrolfields").click(function() {
                self.settings.filtercreatedcontrolfields = this.checked;
                self.updatechat();
            });
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

