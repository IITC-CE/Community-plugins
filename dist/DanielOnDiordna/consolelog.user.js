// ==UserScript==
// @author         DanielOnDiordna
// @name           Console log
// @category       Misc
// @version        1.0.0.20261117.250700
// @updateURL      https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/DanielOnDiordna/consolelog.meta.js
// @downloadURL    https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/DanielOnDiordna/consolelog.user.js
// @description    [danielondiordna-1.0.0.20261117.250700] Display the Console log in a window, captures console.log, console.warn and console.error. Execute Javascript commands with the eval field. Objects are displayed with JSON.stringify formatting with circular structure removal
// @id             consolelog@DanielOnDiordna
// @namespace      https://softspot.nl/ingress/
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if (typeof window.plugin !== 'function') window.plugin = () => {};

    // use own namespace for plugin
    const self = window.plugin.consolelog = () => {};
    self.id = 'consolelog';
    self.pluginname = 'Console log';
    self.changelog = `
Changelog:

version 1.0.0.20261117.250700
- complete plugin renewal
- better eval error handling
- resize text areas to fit contents
- removed jquery as much as possible
- replaced textarea elements by div elements

version 0.0.1.20210321.121900
- first release
- updated plugin wrapper and userscript header formatting to match IITC-CE coding
- capture console.log and console.warn

version 0.0.1.20210421.190200
- minor fix for IITC CE where runHooks iitcLoaded is executed before addHook is defined in this plugin

version 0.0.1.20210724.002500
- prevent double plugin setup on hook iitcLoaded
`;

    self.logging = {
        eval: [],
        console: []
    };

    self.utils = {};
    self.utils.currenttime = (date = new Date()) => {
        return date.toLocaleTimeString('nl-CA');
    };
    self.utils.stringifyObject = (obj, replacer, space) => {
        // Convert circular structure to JSON
        const cache = [];
        return JSON.stringify(obj, (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) return; // circular reference found, discard key
                cache.push(value); // store value in our collection
            }
            return typeof replacer == 'function' ? replacer(key, value) : value;
        }, space);
    };

    self.updatemenu = (container = document.querySelector(`#dialog-${self.id}`)) => {
        if (!container) return;
        container.querySelector(`div[name=${self.id}console]`).innerText = self.logging.console.join("\n");
        container.querySelector(`div[name=${self.id}evalresult]`).innerText = self.logging.eval.join("\n");
    };

    self.utils.footer = () => {
        return `<span style="font-style: italic; font-size: smaller">${self.pluginname} version ${plugin_info.script.version} by ${plugin_info.author}</span>`;
    };

    self.menu = () => {
        let container = document.createElement('div');
        container.style.display = 'grid';
        container.style.minWidth = '400px';
        container.innerHTML = `
<div style="display: grid; grid-template-columns: auto fit-content(0) fit-content(0);">
  <input type="text" name="${self.id}evalinput" placeholder="eval input">
  <button name="${self.id}evalbutton">Eval</button>
  <button name="${self.id}evalclearbutton">Clear</button>
</div>
<div name="${self.id}evalresult" placeholder="eval results" readonly></div>
<div style="display: grid; grid-template-columns: auto fit-content(0);">
  <div style="font-weight: bold">Console:</div>
  <button name="${self.id}clearbutton">Clear</button>
</div>
<div name="${self.id}console" placeholder="console log results" readonly></div>
${self.utils.footer()}`;

        const evaltext = () => {
            try {
                const evaltext = container.querySelector(`input[name=${self.id}evalinput]`).value;
                const evalresult = eval(evaltext);
                self.logging.eval.push(`${evaltext} = ${self.utils.stringifyObject(evalresult)};`);
            } catch({ name, message }) {
                self.logging.eval.push(`${name}: ${message};`);
            }
            self.updatemenu(container);
        };
        container.querySelector(`button[name=${self.id}evalbutton]`).addEventListener('click',e => {
            evaltext();
        });
        container.querySelector(`button[name=${self.id}evalclearbutton]`).addEventListener('click',e => {
            self.logging.eval = [];
            self.updatemenu(container);
        });
        container.querySelector(`input[name=${self.id}evalinput]`).addEventListener('keypress',e => {
            if (e.which == 13) {
                evaltext();
            }
        });
        container.querySelector(`button[name=${self.id}clearbutton]`).addEventListener('click',e => {
            self.logging.console = [];
            self.updatemenu(container);
        });
        self.updatemenu(container);

        const position = { my: "center", at: "top" };
        const dialog = window.dialog({
            html: container,
            id: self.id,
            title: self.pluginname,
            width: 'auto',
            position: position
        }).dialog('option', 'buttons', {
            'Changelog': () => { alert(self.changelog); },
            'Close': () => { $(dialog).dialog('close'); },
        });
    };

    self.setup = {};
    self.setup.main = function() {
        if ('pluginloaded' in self) {
            console.log(`IITC plugin already loaded: ${self.pluginname} version ${plugin_info.script.version}`);
            return;
        }
        self.pluginloaded = true;

        if (window.IITC?.toolbox) { // modern IITC:
            window.IITC.toolbox.addButton({
                label: self.pluginname,
                action: self.menu
            });
        } else { // legacy IITC:
            const toolboxlink = document.querySelector('#toolbox').appendChild(document.createElement('a'));
            toolboxlink.textContent = self.pluginname;
            toolboxlink.addEventListener('click', function(e) {
                e.preventDefault();
                self.menu();
            }, false);
        }

        const stylesheet = document.head.appendChild(document.createElement('style'));
        stylesheet.innerHTML = `
#dialog-${self.id} div[placeholder] {
    min-height: 100px;
    background-color: white;
    color: black;
    max-width: calc(100vw - 50px);
}
#dialog-${self.id} div[placeholder]:empty:before {
    content: attr(placeholder);
    color: #757575;
}
`;

        console.log(`IITC plugin loaded: ${self.pluginname} version ${plugin_info.script.version}`);
    };

    self.setup.consolehijack = (f) => {
        if (!(f in console)) return;
        const originalfunction = console[f];
        console[f] = (...args) => {
            self.logging.console.push(self.utils.currenttime() + " " + (f == 'log' ? '' : `${f.toUpperCase()}: `) + args.map(arg => typeof arg == 'object' ? self.utils.stringifyObject(arg) : arg).join(','));
            self.updatemenu();
            originalfunction.apply(console,args);
        };
    };

    self.setup.boot = () => {
        //if (typeof ulog == "function") ulog = function () { return console; };

        self.setup.consolehijack('log');
        self.setup.consolehijack('warn');
        self.setup.consolehijack('error');

        (window.iitcLoaded ? self.setup.main() : window.addHook('iitcLoaded',self.setup.main));
    };

    // Added to support About IITC details and changelog:
    const iitcsetup = self.setup.boot;

    // set priority to boot, to make sure the add-on will run before player-activity-tracker setup:
    iitcsetup.priority = 'boot'; // addLayerGroup and window.map.on give ERRORS

    iitcsetup.info = plugin_info;
    iitcsetup.info.changelog = [{version:`This is a <a href="https://softspot.nl/ingress/" target="_blank">softspot.nl</a> plugin by <a href="https://telegram.me/${plugin_info.author}" target="_blank">${plugin_info.author}</a>`,changes:[]},...self.changelog.replace(/^.*?version /s,'').split(/\nversion /).map(v=>{v=v.split(/\n/).map(li=>li.replace(/^- /,'')).filter(li=>li != ""); return {version:v.shift(),changes:v}})];
    if (!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(iitcsetup);
    if (window.iitcLoaded && typeof iitcsetup === 'function') iitcsetup();
} // wrapper end

// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
    info.script = {
        version: GM_info.script.version.replace(/\.\d{8}\.\d{6}$/,''),
        name: GM_info.script.name,
        description: GM_info.script.description
    };
    info.buildName = 'softspot.nl';
    info.dateTimeVersion = GM_info.script.version.replace(/^.*(\d{4})(\d{2})(\d{2})\.(\d{6})/,'$1-$2-$3-$4');
    info.pluginId = GM_info.script.id?.replace(/^iitc-plugin-/,'').replace(/@.*$/,'') || GM_info.script.header.replace(/^.*@id\s+iitc-plugin-/s,'').replace(/@.*$/s,'');
    info.changelog = [];
    info.author = GM_info.script.author;
}
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);
