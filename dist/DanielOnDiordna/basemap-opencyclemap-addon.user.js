// ==UserScript==
// @author         DanielOnDiordna
// @name           OpenCycleMap.org map tiles add-on
// @category       Addon
// @version        0.0.4.20210724.002500
// @updateURL      https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/DanielOnDiordna/basemap-opencyclemap-addon.meta.js
// @downloadURL    https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/DanielOnDiordna/basemap-opencyclemap-addon.user.js
// @description    [danielondiordna-0.0.4.20210724.002500] Add-on to set an API KEY for the Thunderforest map tiles (OpenCycleMap). If OpenCycleMap plugin is missing, the code for the map layer is installed anyway
// @id             basemap-opencyclemap-addon@DanielOnDiordna
// @namespace      https://softspot.nl/ingress/
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    // use own namespace for plugin
    window.plugin.basemapOpenCycleMapAddon = function() {};
    var self = window.plugin.basemapOpenCycleMapAddon;
    self.id = 'basemapOpenCycleMapAddon';
    self.title = 'OpenCycleMap Addon';
    self.version = '0.0.4.20210724.002500';
    self.author = 'DanielOnDiordna';
    self.changelog = `
Changelog:

version 0.0.1.20191023.001600
- first release

version 0.0.2.20210117.190200
- added source code from https://static.iitc.me/build/release/plugins/basemap-opencyclemap.user.js
- added API key check and popups
- updated plugin wrapper and userscript header formatting to match IITC-CE coding

version 0.0.3.20210121.224000
- version number fix

version 0.0.4.20210124.184400
- modify every link from http: to https:

version 0.0.4.20210421.190200
- minor fix for IITC CE where runHooks iitcLoaded is executed before addHook is defined in this plugin

version 0.0.4.20210724.002500
- prevent double plugin setup on hook iitcLoaded
`;
    self.namespace = 'window.plugin.' + self.id + '.';
    self.pluginname = 'plugin-' + self.id;

    self.baseLayersUrls = {};
    self.settings = {};
    self.settings.apikey = "";

    self.storeSettings = function() {
        localStorage[self.pluginname + '-settings'] = JSON.stringify(self.settings);
    };

    self.restoreSettings = function() {
        if (localStorage[self.pluginname + '-settings']) {
            var settings = JSON.parse(localStorage[self.pluginname + '-settings']);
            if (typeof settings === 'object' && settings instanceof Object) {
                if (typeof settings.apikey === 'string') self.settings.apikey = settings.apikey;
            }
        }
    };

    self.enterApiKey = function() {
        var newapikey = prompt("Enter API key:",self.settings.apikey);
        if (newapikey != null) {
            self.settings.apikey = newapikey;
            self.storeSettings();
            self.updateApiKey();
            alert('The Thunderforest (OpenCycleMap) map tiles are now available, if the API key was valid.');
        }
    };

    self.menu = function() {
        var html = '<div class="' + self.id + 'Dialog">The OpenCycleMap (Thunderforest) map tiles require a personal API key.<br />' +
            'Disable the OpenCycleMap plugin if you do not have an API key.<br />' +
            '<a href="https://manage.thunderforest.com/" target="_blank">Sign up and get your free API key</a>' +
            '<a href="#" onclick="' + self.namespace + 'enterApiKey(); return false;">Enter/view API key</a>\n' +
            '<span style="font-style: italic; font-size: smaller">version ' + self.version + ' by ' + self.author + '</span>' +
            '</div>';

        self.dialogobject = window.dialog({
            html: html,
            id: self.pluginname + '-dialog',
            dialogClass: 'ui-dialog-' + self.title,
            title: self.title
        });
    };

    self.updateApiKey = function() {
        // place api key in urls
        for (var layerId in self.baseLayersUrls) {
            layerChooser._layers[layerId].layer.setUrl(self.baseLayersUrls[layerId] + (self.settings.apikey ? '?apikey=' + self.settings.apikey : ''),false)
        }
    };

    self.setup = function() {
        if ('pluginloaded' in self) {
            console.log('IITC plugin already loaded: ' + self.title + ' version ' + self.version);
            return;
        } else {
            self.pluginloaded = true;
        }

        if (!window.plugin.mapTileOpenCycleMap) {
            // if this plugin is missing, add the code for the map layer anyway:

            // source: https://static.iitc.me/build/release/plugins/basemap-opencyclemap.user.js
            // @name           IITC plugin: OpenCycleMap.org map tiles
            // @category       Map Tiles
            // @version        0.2.0.20170108.21732
            // @updateURL      https://softspot.nl/ingress/plugins/iitc-plugin-basemap-opencyclemap-addon.meta.js
// @downloadURL    https://softspot.nl/ingress/plugins/iitc-plugin-basemap-opencyclemap-addon.user.js
// @description    [iitc-2017-01-08-021732] Add the OpenCycleMap.org map tiles as an optional layer.

            window.plugin.mapTileOpenCycleMap = {
                addLayer: function() {
                    //the Thunderforest (OpenCycleMap) tiles are free to use - http://www.thunderforest.com/terms/ (edit: not free anymore, key required, this plugin will help setting up the key)

                    var ocmOpt = {
                        attribution: 'Tiles © OpenCycleMap, Map data © OpenStreetMap',
                        maxNativeZoom: 18,
                        maxZoom: 21,
                    };

                    var layers = {
                        'cycle': 'OpenCycleMap',
                        'transport': 'Transport',
                        'transport-dark': 'Transport Dark',
                        'outdoors': 'Outdoors',
                        'landscape': 'Landscape',
                    };

                    for(var i in layers) {
                        var layer = new L.TileLayer('http://{s}.tile.thunderforest.com/' + i + '/{z}/{x}/{y}.png', ocmOpt);
                        layerChooser.addBaseLayer(layer, 'Thunderforest ' + layers[i]);
                    }
                },
            };

            window.plugin.mapTileOpenCycleMap.addLayer();

            console.log('IITC plugin loaded: mapTileOpenCycleMap version 0.2.0.20170108.21732');
        }

        self.restoreSettings();

        // create list of Thunderforest baseLayers urls
        var baseLayers = layerChooser.getLayers().baseLayers;
        for (var layer in baseLayers) {
            if (baseLayers[layer].name.indexOf("Thunderforest") >= 0) {
                self.baseLayersUrls[baseLayers[layer].layerId] = layerChooser._layers[baseLayers[layer].layerId].layer._url.replace(/^http:/,'https:');
            }
        }

        self.updateApiKey();

        $('#toolbox').append('<a onclick="' + self.namespace + 'menu(); return false;" href="#">' + self.title + '</a>');

        $('head').append(
            '<style>' +
            '.' + self.id + 'Dialog > a { display:block; color:#ffce00; border:1px solid #ffce00; padding:3px 0; margin:10px auto; width:80%; text-align:center; background:rgba(8,48,78,.9); }' +
            '</style>');

        if (self.settings.apikey == '') self.menu();

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
