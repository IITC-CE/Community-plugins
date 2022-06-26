// ==UserScript==
// @author         jaiperdu
// @name           Dialog List
// @category       Misc
// @version        0.1.0
// @description    List open dialogs in the sidebar
// @id             dialogs@jaiperdu
// @namespace      https://github.com/IITC-CE/ingress-intel-total-conversion
// @updateURL      https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/jaiperdu/dialogs.meta.js
// @downloadURL    https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/jaiperdu/dialogs.user.js
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'lejeu';
plugin_info.dateTimeVersion = '2022-06-25-095314';
plugin_info.pluginId = 'dialogs';
//END PLUGIN AUTHORS NOTE

function itemOnClick(ev) {
  var id = ev.target.closest('tr').dataset.id;
  var dialog = $(window.DIALOGS[id]);
  dialog.dialog('moveToTop');
}

function itemOnClose(ev) {
  var id = ev.target.closest('tr').dataset.id;
  var dialog = $(window.DIALOGS[id]);
  dialog.dialog('close');
}

function dialogListItem(id) {
  var dialog = $(window.DIALOGS[id]);
  var option = dialog.dialog('option');
  var text = option.title;
  var tr = document.createElement('tr');
  tr.dataset.id = id;
  var title = document.createElement('td');
  tr.appendChild(title);
  title.textContent = text;
  if (!dialog.is(':hidden'))
    title.classList.add('ui-dialog-title-inactive');
  title.addEventListener('click', itemOnClick);
  var closeButton = document.createElement('td');
  tr.appendChild(closeButton);
  closeButton.textContent = "X";
  closeButton.addEventListener('click', itemOnClose);

  return tr;
}

function updateList() {
  var list = document.getElementById('dialog-list');
  list.textContent = '';
  Object.keys(window.DIALOGS).forEach((id) => {
    list.appendChild(dialogListItem(id));
  });
}

var dialogMonitor = {
  set: function(obj, prop, valeur) {
    obj[prop] = valeur;
    updateList();
    return true;
  },
  deleteProperty: function (obj, prop) {
    delete obj[prop];
    updateList();
    return true;
  }
};

function setup() {
  window.DIALOGS = new Proxy(window.DIALOGS, dialogMonitor);

  $('<style>').prop('type', 'text/css').html(`
#dialog-list {
  padding: 3px;
}
#dialog-list tr:nth-last-child(n+2) td {
  border-bottom: 1px white dotted;
}
#dialog-list tr td:first-child {
  width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#dialog-list tr td:first-child:hover {
  color: #03fe03; /*bookmark hover*/
}
#dialog-list tr td:last-child {
  color: red;
  font-weight: bold;
}`).appendTo('head');

  var sidebar = document.getElementById('sidebar');
  var dialogList = document.createElement('div');
  sidebar.appendChild(dialogList);
  dialogList.id = "dialog-list";
}
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

