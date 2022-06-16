// ==UserScript==
// @id             portals_gallery_script@nerotu
// @name           Portals Gallery
// @description    Creates the gallery of portals that can be used to solve the First Saturday passcode.
// @author         Kofirs2634 aka Nerotu
// @category       Info
// @version        1.0
// @include        https://intel.ingress.com/
// @include        http://intel.ingress.com/
// @match          https://intel.ingress.com/
// @match          http://intel.ingress.com/
// @grant          none
// @downloadURL    https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/nerotu/portals_gallery_script.user.js
// @updateURL      https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/nerotu/portals_gallery_script.meta.js
// ==/UserScript==


function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

// PLUGIN START ////////////////////////////////////////////////////////
// use own namespace for plugin
window.plugin.portalsGallery = () => {};
window.plugin.portalsGallery.storage = [];
window.plugin.portalsGallery.sortmode = 't';

/**
 * Collects the data of rendered portals
 * @public
 */
window.plugin.portalsGallery.collect = () => {
    var self = window.plugin.portalsGallery;
    self.storage = [];
    for (var i in window.portals) {
        var path = portals[i].options.data;
        if (path.title && path.image) self.storage.push({ n: path.title, p: { lt: path.latE6 / 1e6, ln: path.lngE6 / 1e6 }, u: path.image })
    }
}

/**
 * Opens the gallery dialog box
 * @public
 */
window.plugin.portalsGallery.open = () => {
    var self = window.plugin.portalsGallery;
    self.collect();
    dialog({
        html: '<div id="gallery-cnt"></div>',
        title: 'Portals Gallery',
        width: 'auto'
    });
    $('#gallery-cnt')
        .append($('<div>', { class: 'controls' })
            .append($('<label>', { text: 'Search query: ' }).append($('<input>', { type: 'search', id: 'gallery-search' })))
            .append($('<label>', { text: 'Sort by: ' }).append($('<select>', { id: 'gallery-sort' })
                .append($('<option>', { value: 't', text: 'title' }))
                .append($('<option>', { value: 'd', text: 'distance' }))
            ))
            .append($('<label>', { class: 'sort-distance', text: 'Distance relative ' }).append($('<input>', { id: 'sort-coords', type: 'search', placeholder: 'latitiude,longitude' })))
        )
        .append($('<div>', { class: 'results' }))
        .append($('<div>', { id: 'gallery' }));

    makeTable(self.storage);

    $('#gallery-search').bind('input paste', () => self.doSearch(self.storage));
    $('#sort-coords').bind('input paste', () => makeTable(self.storage))
    $('#gallery-sort').bind('change', e => {
        self.sortmode = $(e.target).val();
        makeTable(self.storage)
    })
}

/**
 * Searches the matching to the query titles in the list of rendered portals
 * @public
 * @param {object[]} array An array of rendered portals - `window.plugin.portalsGallery.storage`
 */
window.plugin.portalsGallery.doSearch = (array) => {
    var query = $('#gallery-search').val(),
        result;
    if (!query) result = array;
    else result = array.filter(e => e.n.match(new RegExp(query, 'i')))
    makeTable(result)
}

/**
 * Generates a table of portals' photos, names, and coordinates
 * @private
 * @param {object[]} array An array of rendered portals - `window.plugin.portalsGallery.storage`
 */
function makeTable(array) {
    var self = window.plugin.portalsGallery;
    $('#gallery').empty();

    if (self.sortmode == 't') array = byTitle(array)
    else if (self.sortmode == 'd') array = byDistance(array)

    var rows = Math.ceil(array.length / 3);
    if (array.length) $('.results').text(`The gallery shows ${array.length} portals`)
    else $('.results').text('There\'re no portals in the gallery')
    for (var i = 0; i < rows; i++) {
        $('#gallery').append($('<div>', { class: 'gallery-row', id: `gallery-row-${i}` }))
        for (var j = 0; j < 3; j++) {
            var p = array[i * 3 + j];
            if (!p) return;
            $(`#gallery-row-${i}`).append($('<div>')
                .append($('<img>', { src: p.u, width: 200, class: 'gallery-img' }))
                .append($('<span>', { class: 'gallery-coords', text: getCoords(p) }))
                .append($('<a>', { class: 'gallery-link', href: `https://intel.ingress.com/intel?ll=${getCoords(p)}&z=17&pll=${getCoords(p)}`, text: p.n }))
            )
        }
    }
}

/**
 * Calculates the distance between two points as if the Earth would be flat.
 * Not very accurate, but small. Yes, I'm lazy
 * @private
 * @param {...[number, number]} points Takes any number of arrays with points' coordinates (`p` object in `window.plugin.portalsGallery.storage`) but uses only two first
 * @returns A distance between two points
 */
function distance(...points) {
    return Math.sqrt((points[0][0] - points[1][0]) ** 2 + (points[0][1] - points[1][1]) ** 2);
}

/**
 * Gets an array containing a latitude and a longitude of a portal
 * @param {object} portal An object of portal - one item of `window.plugin.portalsGallery.storage`
 * @returns {number[]} An array with latitude as first element and logitude as second
 */
function getCoords(portal) {
    return [portal.p.lt, portal.p.ln]
}

/**
 * Sorts the list of rendered portals by its names in alphabetic order
 * @private
 * @param {object[]} array An array of rendered portals - `window.plugin.portalsGallery.storage`
 * @returns {object[]} A sorted array of portals
 */
function byTitle(array) {
    return array.sort((a, b) => a.n.charCodeAt() - b.n.charCodeAt())
}

/**
 * Sorts the list of rendered portals by its distance to the specified point in descending order
 * @private
 * @param {object[]} array An array of rendered portals - `window.plugin.portalsGallery.storage`
 * @returns {object[]} A sorted array of portals
 */
function byDistance(array) {
    var result = [], raw = [],
        base = $('#sort-coords').val().split(',');
    if (!base[0] || !base[1]) base = [0, 0];
    array.forEach((e, n) => {
        raw.push([n, distance(base, getCoords(e))])
    })
    raw.sort((a, b) => a[1] - b[1]).forEach(e => {
        result.push(array[e[0]])
    })
    return result
}

/**
 * Appends the styles of the plugin to the `<head>` tag
 * @private
 */
function appendStyles() {
    $('head').append($('<style>', {
        id: 'portals-gallery-css', text: '.gallery-row {' +
            'display: flex;' +
            'justify-content: space-evenly;' +
            'align-items: baseline;' +
            'margin-bottom: 25px;' +
            '} .gallery-row > div {' +
            'max-width: 250px;' +
            'display: flex;' +
            'flex-direction: column;' +
            'align-items: center;' +
            '} .gallery-img {' +
            'display: block;' +
            'margin-bottom: 5px;' +
            '} .gallery-link {' +
            'display: block;' +
            'text-align: center;' +
            '} .sort-distance { display: block }'
    }))
}

/**
 * Creates the button opening the gallery modal in the IITC's toolbox
 * @private
 */
function appendButton() {
    var self = window.plugin.portalsGallery;
    $('#toolbox').append($('<a>', { title: 'Open the gallery', text: 'Gallery' }).click(self.open))
}

var setup = function() {
    if (!Object.keys(window.portals).length) {
        var waitPortals = setInterval(() => {
            if (Object.keys(window.portals).length) {
                appendButton();
                appendStyles();
                clearInterval(waitPortals)
            }
        }, 1000)
    }
}

// PLUGIN END //////////////////////////////////////////////////////////
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

// EOF
