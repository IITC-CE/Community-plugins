// ==UserScript==
// @author          elkuku
// @name            KuKuExport
// @id              export@elkuku
// @category        Export
// @version         0.6
// @namespace       https://github.com/IITC-CE/ingress-intel-total-conversion
// @updateURL       https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/elkuku/export.meta.js
// @downloadURL     https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/elkuku/export.user.js
// @description     Export portal and inventory data
// @icon64          data:image/png;base64,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
// @issueTracker    https://github.com/elkuku/iitc-kuku-export/issues
// @depends         helper-handlebars@elkuku
// @antiFeatures    export
// @match           https://intel.ingress.com/*
// ==/UserScript==

function wrapper(SCRIPT_INFO) {
(() => {
    "use strict";
    var __webpack_modules__ = {
        56: (module, __unused_webpack_exports, __webpack_require__) => {
            module.exports = function setAttributesWithoutAttributes(styleElement) {
                var nonce = __webpack_require__.nc;
                nonce && styleElement.setAttribute("nonce", nonce);
            };
        },
        72: module => {
            var stylesInDOM = [];
            function getIndexByIdentifier(identifier) {
                for (var result = -1, i = 0; i < stylesInDOM.length; i++) if (stylesInDOM[i].identifier === identifier) {
                    result = i;
                    break;
                }
                return result;
            }
            function modulesToDom(list, options) {
                for (var idCountMap = {}, identifiers = [], i = 0; i < list.length; i++) {
                    var item = list[i], id = options.base ? item[0] + options.base : item[0], count = idCountMap[id] || 0, identifier = "".concat(id, " ").concat(count);
                    idCountMap[id] = count + 1;
                    var indexByIdentifier = getIndexByIdentifier(identifier), obj = {
                        css: item[1],
                        media: item[2],
                        sourceMap: item[3],
                        supports: item[4],
                        layer: item[5]
                    };
                    if (-1 !== indexByIdentifier) stylesInDOM[indexByIdentifier].references++, stylesInDOM[indexByIdentifier].updater(obj); else {
                        var updater = addElementStyle(obj, options);
                        options.byIndex = i, stylesInDOM.splice(i, 0, {
                            identifier,
                            updater,
                            references: 1
                        });
                    }
                    identifiers.push(identifier);
                }
                return identifiers;
            }
            function addElementStyle(obj, options) {
                var api = options.domAPI(options);
                api.update(obj);
                return function updater(newObj) {
                    if (newObj) {
                        if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) return;
                        api.update(obj = newObj);
                    } else api.remove();
                };
            }
            module.exports = function(list, options) {
                var lastIdentifiers = modulesToDom(list = list || [], options = options || {});
                return function update(newList) {
                    newList = newList || [];
                    for (var i = 0; i < lastIdentifiers.length; i++) {
                        var index = getIndexByIdentifier(lastIdentifiers[i]);
                        stylesInDOM[index].references--;
                    }
                    for (var newLastIdentifiers = modulesToDom(newList, options), _i = 0; _i < lastIdentifiers.length; _i++) {
                        var _index = getIndexByIdentifier(lastIdentifiers[_i]);
                        0 === stylesInDOM[_index].references && (stylesInDOM[_index].updater(), stylesInDOM.splice(_index, 1));
                    }
                    lastIdentifiers = newLastIdentifiers;
                };
            };
        },
        113: module => {
            module.exports = function styleTagTransform(css, styleElement) {
                if (styleElement.styleSheet) styleElement.styleSheet.cssText = css; else {
                    for (;styleElement.firstChild; ) styleElement.removeChild(styleElement.firstChild);
                    styleElement.appendChild(document.createTextNode(css));
                }
            };
        },
        314: module => {
            module.exports = function(cssWithMappingToString) {
                var list = [];
                return list.toString = function toString() {
                    return this.map(function(item) {
                        var content = "", needLayer = void 0 !== item[5];
                        return item[4] && (content += "@supports (".concat(item[4], ") {")), item[2] && (content += "@media ".concat(item[2], " {")), 
                        needLayer && (content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {")), 
                        content += cssWithMappingToString(item), needLayer && (content += "}"), item[2] && (content += "}"), 
                        item[4] && (content += "}"), content;
                    }).join("");
                }, list.i = function i(modules, media, dedupe, supports, layer) {
                    "string" == typeof modules && (modules = [ [ null, modules, void 0 ] ]);
                    var alreadyImportedModules = {};
                    if (dedupe) for (var k = 0; k < this.length; k++) {
                        var id = this[k][0];
                        null != id && (alreadyImportedModules[id] = !0);
                    }
                    for (var _k = 0; _k < modules.length; _k++) {
                        var item = [].concat(modules[_k]);
                        dedupe && alreadyImportedModules[item[0]] || (void 0 !== layer && (void 0 === item[5] || (item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}")), 
                        item[5] = layer), media && (item[2] ? (item[1] = "@media ".concat(item[2], " {").concat(item[1], "}"), 
                        item[2] = media) : item[2] = media), supports && (item[4] ? (item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}"), 
                        item[4] = supports) : item[4] = "".concat(supports)), list.push(item));
                    }
                }, list;
            };
        },
        398: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.r(__webpack_exports__), __webpack_require__.d(__webpack_exports__, {
                default: () => __WEBPACK_DEFAULT_EXPORT__
            });
            var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(72), _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(825), _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__), _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(659), _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = __webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__), _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(56), _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = __webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__), _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(540), _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = __webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__), _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(113), _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = __webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__), _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_styles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(671), options = {};
            options.styleTagTransform = _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default(), 
            options.setAttributes = _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default(), 
            options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head"), 
            options.domAPI = _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default(), 
            options.insertStyleElement = _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default();
            _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_styles_css__WEBPACK_IMPORTED_MODULE_6__.A, options);
            const __WEBPACK_DEFAULT_EXPORT__ = _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_styles_css__WEBPACK_IMPORTED_MODULE_6__.A && _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_styles_css__WEBPACK_IMPORTED_MODULE_6__.A.locals ? _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_styles_css__WEBPACK_IMPORTED_MODULE_6__.A.locals : void 0;
        },
        540: module => {
            module.exports = function insertStyleElement(options) {
                var element = document.createElement("style");
                return options.setAttributes(element, options.attributes), options.insert(element, options.options), 
                element;
            };
        },
        601: module => {
            module.exports = function(i) {
                return i[1];
            };
        },
        659: module => {
            var memo = {};
            module.exports = function insertBySelector(insert, style) {
                var target = function getTarget(target) {
                    if (void 0 === memo[target]) {
                        var styleTarget = document.querySelector(target);
                        if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) try {
                            styleTarget = styleTarget.contentDocument.head;
                        } catch (e) {
                            styleTarget = null;
                        }
                        memo[target] = styleTarget;
                    }
                    return memo[target];
                }(insert);
                if (!target) throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
                target.appendChild(style);
            };
        },
        671: (module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.d(__webpack_exports__, {
                A: () => __WEBPACK_DEFAULT_EXPORT__
            });
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601), _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314), ___CSS_LOADER_EXPORT___ = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            ___CSS_LOADER_EXPORT___.push([ module.id, "textarea#ExportPortalsOutput{font-family:monospace}.hidden{display:none}#KuKuExportContainer .infoButton{background-color:rgba(255,226,53,.64);float:right}", "" ]);
            const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
        },
        825: module => {
            module.exports = function domAPI(options) {
                if ("undefined" == typeof document) return {
                    update: function update() {},
                    remove: function remove() {}
                };
                var styleElement = options.insertStyleElement(options);
                return {
                    update: function update(obj) {
                        !function apply(styleElement, options, obj) {
                            var css = "";
                            obj.supports && (css += "@supports (".concat(obj.supports, ") {")), obj.media && (css += "@media ".concat(obj.media, " {"));
                            var needLayer = void 0 !== obj.layer;
                            needLayer && (css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {")), 
                            css += obj.css, needLayer && (css += "}"), obj.media && (css += "}"), obj.supports && (css += "}");
                            var sourceMap = obj.sourceMap;
                            sourceMap && "undefined" != typeof btoa && (css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */")), 
                            options.styleTagTransform(css, styleElement, options.options);
                        }(styleElement, options, obj);
                    },
                    remove: function remove() {
                        !function removeStyleElement(styleElement) {
                            if (null === styleElement.parentNode) return !1;
                            styleElement.parentNode.removeChild(styleElement);
                        }(styleElement);
                    }
                };
            };
        }
    }, __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        var module = __webpack_module_cache__[moduleId] = {
            id: moduleId,
            exports: {}
        };
        return __webpack_modules__[moduleId](module, module.exports, __webpack_require__), 
        module.exports;
    }
    __webpack_require__.n = module => {
        var getter = module && module.__esModule ? () => module.default : () => module;
        return __webpack_require__.d(getter, {
            a: getter
        }), getter;
    }, __webpack_require__.d = (exports, definition) => {
        for (var key in definition) __webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key) && Object.defineProperty(exports, key, {
            enumerable: !0,
            get: definition[key]
        });
    }, __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop), 
    __webpack_require__.r = exports => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(exports, "__esModule", {
            value: !0
        });
    }, __webpack_require__.nc = void 0;
    class DialogHelper {
        constructor(pluginName) {
            this.pluginName = pluginName;
        }
        getDialog(presets) {
            this.presets = presets;
            const handlebars = this.getHandlebars();
            handlebars.registerHelper("if_eq", function(argument1, argument2, options) {
                return argument1 === argument2 ? options.fn(this) : options.inverse(this);
            });
            const template = handlebars.compile('<div id="{{prefix}}Container">\n\n    <h4><a href="#" onclick="{{main}}.confirmStep(\'Select-Portals\')">1. Select Portals</a></h4>\n    <div id="{{prefix}}-Select-Portals-Container">\n        <label>\n            Selection Mode:\n            <select onchange="{{main}}.switchMode(this.value)">\n                {{#each selectOptions}}\n                    <option value="{{@key}}">{{this}}</option>\n                {{/each}}\n            </select>\n        </label>\n\n        <button onclick="{{main}}.checkSelectAndConfirmStep(\'Select-Fields\')" style="float: right">Confirm</button>\n        <hr>\n    </div>\n\n    <h4>2. Select Fields</h4>\n    <div class="hidden" id="{{prefix}}-Select-Fields-Container">\n        <label>\n            From preset:\n            <select onchange="{{main}}.applyPreset(this.value)">\n                <option value="">Select...</option>\n                {{#each presets}}\n                    <option>{{this}}</option>\n                {{/each}}\n        </select>\n        </label>\n        <table>\n            <tr>\n                <th>Data</th>\n                <th>State</th>\n                <th>Inventory</th>\n            </tr>\n            <tr>\n                <td>\n                    {{#each fieldOptions.data}}\n                        <label>\n                            <input type="checkbox" value="{{@key}}" name="chkFields"\n                                {{#if_eq @key \'guid\'}}\n                                   onclick="return false;" checked="checked"\n                                {{/if_eq}}\n                            />\n                            {{this}}\n                            <br>\n                        </label>\n                    {{/each}}\n                </td>\n                <td>\n                    {{#each fieldOptions.state}}\n                        <label>\n                            <input type="checkbox" value="{{@key}}" name="chkFields" />\n                            {{this}}\n                            <br>\n                        </label>\n                    {{/each}}\n                </td>\n                <td>\n                    {{#each fieldOptions.inventory}}\n                        <label>\n                            <input type="checkbox" value="{{@key}}" name="chkFields" />\n                            {{this}}\n                            <br>\n                        </label>\n                    {{/each}}\n                </td>\n            </tr>\n        </table>\n        <label>Save to preset: <input id="{{prefix}}-Preset-Input"></label>\n        <button onclick="{{main}}.savePreset()">Save</button>\n        <button onclick="{{main}}.confirmStep(\'Select-Format\')" style="float: right">Confirm</button>\n        <hr>\n\n    </div>\n\n    <h4>3. Select Format</h4>\n    <div class="hidden" id="{{prefix}}-Select-Format-Container">\n        <label>\n            Format:\n            <select onchange="{{main}}.switchFormat(this.value)">\n                {{#each formatOptions}}\n                    <option value="{{@key}}">{{this}}</option>\n                {{/each}}\n            </select>\n        </label>\n\n        <button onclick="{{main}}.confirmStep(\'Output\');{{main}}.doExport()" style="float: right">Export</button>\n        <hr>\n\n        <div id="{{prefix}}Status"></div>\n    </div>\n\n    <h4>Result</h4>\n    <div class="hidden" id="{{prefix}}-Output-Container">\n        <label>\n            <button onclick="{{main}}.copyToClipboard(\'{{prefix}}Output\')">Copy</button>\n            <button onclick="{{main}}.saveToFile(\'{{prefix}}Output\')">Save</button>\n            <textarea id="{{prefix}}Output" cols="80" rows="20" style="width: 100%; white-space: nowrap;"></textarea>\n        </label>\n    </div>\n\n    <button class="infoButton" onclick="{{main}}.showInfo()">Info</button>\n\n</div>\n'), data = {
                main: "window.plugin." + this.pluginName,
                prefix: this.pluginName,
                selectOptions: {
                    "": "Select...",
                    view: "View",
                    polygon: "Polygon(s)"
                },
                formatOptions: {
                    json: "JSON",
                    csv: "CSV"
                },
                fieldOptions: {
                    data: {
                        guid: "GUID",
                        title: "Title",
                        lat: "Latitude",
                        lng: "Longitude",
                        image: "Image"
                    },
                    state: {
                        level: "Level",
                        team: "Team",
                        health: "Health",
                        resCount: "Resonator Count",
                        timestamp: "Timestamp"
                    },
                    inventory: {
                        keys: "Keys",
                        keyData: "Key Details"
                    }
                },
                presets: presets.keys()
            };
            return window.dialog({
                id: this.pluginName,
                position: {
                    my: "top",
                    at: "top",
                    of: window
                },
                width: 600,
                title: "Export",
                buttons: [],
                html: template(data)
            });
        }
        findFieldOptions() {
            const options = [], checkboxes = this.findFields();
            if (!checkboxes) return [];
            for (const checkbox of checkboxes) checkbox.checked && options.push(checkbox.value);
            return options;
        }
        confirmStep(step) {
            const containers = [ "Select-Portals", "Select-Fields", "Select-Format", "Output" ];
            for (const container of containers) document.getElementById(`${this.pluginName}-${container}-Container`).classList.add("hidden");
            document.getElementById(`${this.pluginName}-${step}-Container`).classList.remove("hidden");
        }
        showInfo() {
            const template = this.getHandlebars().compile('<hr>\n<h3>{{product.name}} {{product.version}}</h3>\n<hr>\n<ul>\n    <li>\n        Code and Issues:\n        <a href="https://github.com/elkuku/iitc-kuku-export" target="_blank">elkuku/iitc-kuku-export</a>\n    </li>\n    <li>\n        Questions:\n        <a href="https://t.me/nikp3h" target="_blank">Telegram: nikp3h</a>\n    </li>\n    <li>\n        Author:\n        <a href="https://github.com/elkuku" target="_blank">elkuku</a>\n        aka\n        <span class="nickname enl">nikp3h</span>\n    </li>\n</ul>\n\n<hr>\n<label>\n    Delete preset:\n    <select id="{{prefix}}-SelDeletePreset">\n        {{#each presets}}\n            <option>{{this}}</option>\n        {{/each}}\n    </select>\n</label>\n<button class="btnDelete" onclick="{{main}}.deletePreset()">Delete</button>'), data = {
                product: {
                    name: this.pluginName,
                    version: "v0.6"
                },
                presets: this.presets.keys(),
                main: "window.plugin." + this.pluginName,
                prefix: this.pluginName
            };
            return window.dialog({
                id: this.pluginName + "Info",
                position: {
                    my: "top",
                    at: "top",
                    of: window
                },
                width: 600,
                title: "Info",
                html: template(data)
            });
        }
        findFields() {
            const parentElement = document.getElementById(this.pluginName + "Container");
            if (!parentElement) throw console.error("findFieldOptions: parentElement not found"), 
            new Error("findFieldOptions: parentElement not found");
            return parentElement.querySelectorAll('input[type="checkbox"][name="chkFields"]');
        }
        getHandlebars() {
            const handlebars = window.plugin.HelperHandlebars;
            if (!handlebars) throw alert(this.pluginName + " - Please install and activate the Handlebars helper plugin"), 
            new Error("Handlebars helper not found");
            return handlebars;
        }
        applyPreset(name) {
            const checkboxes = this.findFields(), preset = name ? this.presets.get(name) : [ "guid" ];
            if (!preset) throw new Error("preset not found");
            for (const checkbox of checkboxes) checkbox.checked = preset.includes(checkbox.value);
        }
    }
    class IitcHelper {
        findPortalsInView() {
            const portals = [];
            for (const i in window.portals) {
                const portal = window.portals[i];
                portal.options.data.title && portals.push(portal);
            }
            return portals;
        }
        findPortalsInPolygons() {
            if (!window.plugin.drawTools) return alert("DrawTools plugin is required"), [];
            const portals = [], polygons = this.findPolygons();
            if (0 === polygons.length) return alert("No polygon found"), [];
            for (const i in window.portals) {
                const portal = window.portals[i];
                if (portal.options.data.title) for (const polygon of polygons) if (this.isPointInPolygon(portal.getLatLng(), polygon)) {
                    portals.push(portal);
                    break;
                }
            }
            return portals;
        }
        findPolygons() {
            const layerString = localStorage["plugin-draw-tools-layer"], layers = JSON.parse(layerString), polygons = [];
            for (const i in layers) if ("polygon" === layers[i].type) {
                const layer = layers[i].latLngs;
                polygons.push(layer);
            }
            return polygons;
        }
        isPointInPolygon(point, points) {
            const x = point.lat, y = point.lng;
            let isInside = !1, i = 0, j = points.length - 1;
            for (;i < points.length; j = i++) {
                const xi = points[i].lat, yi = points[i].lng, xj = points[j].lat, yj = points[j].lng;
                yi > y != yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi && (isInside = !isInside);
            }
            return isInside;
        }
    }
    const Utility_formatTimeString = milliseconds => {
        milliseconds < 0 && (milliseconds = -milliseconds);
        let seconds = Math.floor(milliseconds / 1e3);
        if (seconds < 60) return `${seconds} seconds`;
        {
            const minutes = Math.floor(seconds / 60);
            return seconds %= 60, minutes > 5 ? `${minutes} minutes` : `${minutes}:${seconds < 10 ? "0" : ""}${seconds} minutes`;
        }
    };
    class InventoryHelper {
        constructor() {
            this.expires = 0;
        }
        async getInventory() {
            if (this.loadInventoryFromLocalStorage()) {
                if (Date.now() > this.expires) {
                    Utility_formatTimeString(this.expires - Date.now());
                    try {
                        return await this.loadInventory();
                    } catch (error) {
                        return console.error(error), this.inventory;
                    }
                }
                return Utility_formatTimeString(this.expires - Date.now()), this.inventory;
            }
            return await this.loadInventory();
        }
        async loadInventory() {
            var _a;
            const inventory = {
                keys: [],
                boosts: [],
                weapons: [],
                mods: [],
                keyCapsules: []
            };
            try {
                const items = await this.fetchInventory();
                for (const item of items) {
                    const object = item[2];
                    let boost, weapon, modulator, key, keyCapsule, type = "", designation = "", level = 0;
                    switch (Object.prototype.hasOwnProperty.call(object, "resource") ? type = object.resource.resourceType : Object.prototype.hasOwnProperty.call(object, "resourceWithLevels") ? (type = object.resourceWithLevels.resourceType, 
                    level = object.resourceWithLevels.level) : Object.prototype.hasOwnProperty.call(object, "modResource") ? type = "modResource" : console.warn("No resource", object), 
                    Object.prototype.hasOwnProperty.call(object, "timedPowerupResource") && (designation = object.timedPowerupResource.designation), 
                    type) {
                      case "modResource":
                        modulator = {
                            type: object.modResource.resourceType,
                            rarity: object.modResource.rarity
                        }, inventory.mods.push(modulator);
                        break;

                      case "ULTRA_STRIKE":
                      case "EMP_BURSTER":
                        weapon = {
                            type,
                            level
                        }, inventory.weapons.push(weapon);
                        break;

                      case "FLIP_CARD":
                        weapon = {
                            type: object.flipCard.flipCardType,
                            level: 0
                        }, inventory.weapons.push(weapon);
                        break;

                      case "PORTAL_LINK_KEY":
                        key = {
                            guid: object.portalCoupler.portalGuid,
                            title: object.portalCoupler.portalTitle
                        }, inventory.keys.push(key);
                        break;

                      case "KEY_CAPSULE":
                        keyCapsule = {
                            differentiator: object.moniker.differentiator,
                            count: object.container.currentCount,
                            keys: this.listKeysInCapsule(object.container.stackableItems)
                        }, inventory.keyCapsules.push(keyCapsule);
                        break;

                      case "PORTAL_POWERUP":
                        boost = {
                            type: designation
                        }, inventory.boosts.push(boost);
                        break;

                      case "CAPSULE":
                      case "KINETIC_CAPSULE":
                      case "POWER_CUBE":
                      case "BOOSTED_POWER_CUBE":
                      case "EMITTER_A":
                      case "PLAYER_POWERUP":
                      case "ENTITLEMENT":
                      case "DRONE":
                        break;

                      default:
                        console.warn(`Unknown type${type}`, object);
                    }
                }
                this.inventory = inventory, this.saveInventoryToLocalStorage();
            } catch (error) {
                const element = document.getElementById("iitc-inventory-content"), message = null !== (_a = error.message) && void 0 !== _a ? _a : error;
                element && (element.innerHTML = `<div style="color:red">Error: ${message}</div>`), 
                console.error(message);
            }
            return inventory;
        }
        getKeysInfo(inventory) {
            var _a, _b, _c;
            const keyInfos = new Map;
            let keyInfo;
            for (const key of inventory.keys) {
                keyInfo = keyInfos.get(key.guid), null != keyInfo || (keyInfo = {
                    total: 0,
                    atHand: 0,
                    capsules: new Map
                }), keyInfo.atHand++, keyInfo.total++;
                for (const capsule of inventory.keyCapsules) if (!(null === (_a = keyInfo.capsules) || void 0 === _a ? void 0 : _a.has(capsule.differentiator))) for (const k of capsule.keys) k.key.guid === key.guid && (keyInfo.capsules.set(capsule.differentiator, k.count), 
                keyInfo.total += k.count);
                keyInfos.set(key.guid, keyInfo);
            }
            for (const capsule of inventory.keyCapsules) for (const k of capsule.keys) keyInfos.has(k.key.guid) ? (keyInfo = keyInfos.get(k.key.guid), 
            !1 === (null === (_b = null == keyInfo ? void 0 : keyInfo.capsules) || void 0 === _b ? void 0 : _b.has(capsule.differentiator)) && (keyInfo.capsules.set(capsule.differentiator, k.count), 
            keyInfo.total += k.count, keyInfos.set(k.key.guid, keyInfo))) : (keyInfo = {
                total: 0,
                capsules: new Map
            }, null === (_c = keyInfo.capsules) || void 0 === _c || _c.set(capsule.differentiator, k.count), 
            keyInfo.total += k.count, keyInfos.set(k.key.guid, keyInfo));
            return keyInfos;
        }
        listKeysInCapsule(items) {
            const keys = [];
            for (const capsuleItem of items) {
                const coupler = capsuleItem.exampleGameEntity[2].portalCoupler, item = {
                    key: {
                        guid: coupler.portalGuid,
                        title: coupler.portalTitle
                    },
                    count: capsuleItem.itemGuids.length
                };
                keys.push(item);
            }
            return keys;
        }
        async fetchInventory() {
            const response = await this.postAjax("getInventory", {
                lastQueryTimestamp: 0
            });
            if (0 === response.result.length) throw new Error("Received an empty response");
            return response.result;
        }
        loadInventoryFromLocalStorage() {
            try {
                const storage = localStorage["plugin-kuku-export"];
                if (!storage || "" == storage) return !1;
                const localData = JSON.parse(storage);
                return localData instanceof Object && ("inventory" in localData && localData.inventory instanceof Object && (this.inventory = localData.inventory), 
                "expires" in localData && "number" == typeof localData.expires && (this.expires = localData.expires), 
                !0);
            } catch (error) {
                console.error("loadInventory error", error);
            }
            return !1;
        }
        saveInventoryToLocalStorage() {
            this.expires = Date.now() + 6e5, localStorage["plugin-kuku-export"] = JSON.stringify({
                inventory: this.inventory,
                expires: this.expires
            });
        }
        postAjax(action, data) {
            return new Promise((resolve, reject) => window.postAjax(action, data, returnValue => resolve(returnValue), (_, status, error) => reject(new Error(`${status}: ${error}`))));
        }
    }
    class ExportHelper {
        constructor() {
            this.iitcHelper = new IitcHelper, this.inventoryHelper = new InventoryHelper;
        }
        async exportPortals(options) {
            const exported = [], portals = this.findPortals(options.selectionMode), exportKeys = options.fieldOptions.includes("keys"), exportKeyData = options.fieldOptions.includes("keyData");
            if (exportKeys || exportKeyData) {
                const inventory = await this.inventoryHelper.getInventory();
                this.keyInfo = this.inventoryHelper.getKeysInfo(inventory);
            }
            for (const portal of portals) {
                const data = portal.options.data, exportObject = {
                    guid: portal.options.guid
                };
                if (options.fieldOptions.includes("title") && (exportObject.title = data.title), 
                options.fieldOptions.includes("image") && (exportObject.image = data.image), options.fieldOptions.includes("lat") && (exportObject.lat = data.latE6 / 1e6), 
                options.fieldOptions.includes("lng") && (exportObject.lng = data.lngE6 / 1e6), options.fieldOptions.includes("level") && (exportObject.level = data.level), 
                options.fieldOptions.includes("team") && (exportObject.team = data.team), options.fieldOptions.includes("health") && (exportObject.health = data.health), 
                options.fieldOptions.includes("resCount") && (exportObject.resCount = data.resCount), 
                options.fieldOptions.includes("timestamp") && (exportObject.timestamp = Date.now()), 
                exportKeys || exportKeyData) {
                    const info = this.keyInfo.get(portal.options.guid);
                    if (info) {
                        const keys = {
                            total: info.total
                        };
                        exportKeyData && (keys.atHand = info.atHand, keys.capsules = info.capsules), exportObject.keyInfo = keys;
                    }
                }
                exported.push(exportObject);
            }
            let exportString = "";
            switch (options.format) {
              case "json":
                exportString = JSON.stringify(exported, this.replacer, 2);
                break;

              case "csv":
                exportString = this.toCsv(exported);
                break;

              default:
                throw new Error(`Unsupported format ${options.format}`);
            }
            return exportString;
        }
        findPortals(method) {
            let portals = [];
            switch (method) {
              case "view":
                portals = this.iitcHelper.findPortalsInView();
                break;

              case "polygon":
                portals = this.iitcHelper.findPortalsInPolygons();
                break;

              default:
                throw new Error(`Unsupported method: ${method}`);
            }
            if (0 === portals.length) throw new Error("No Portals found.");
            return portals;
        }
        replacer(key, value) {
            return value instanceof Map ? Object.fromEntries(value) : value;
        }
        toCsv(rows) {
            if (0 === rows.length) return "";
            const headers = Object.keys(rows[0]), lines = rows.map(row => headers.map(h => {
                var _a;
                return JSON.stringify(null !== (_a = row[h]) && void 0 !== _a ? _a : "");
            }).join(","));
            return [ headers.join(","), ...lines ].join("\n");
        }
    }
    class LocalStorageHelper {
        constructor(key) {
            this.key = key;
        }
        saveMap(key, map) {
            const object = Object.fromEntries(map);
            localStorage.setItem(this.key + "-" + key, JSON.stringify(object));
        }
        loadMap(key) {
            const json = localStorage.getItem(this.key + "-" + key);
            if (!json) return;
            const object = JSON.parse(json), entries = Object.entries(object);
            return new Map(entries);
        }
    }
    const main = new class ExportPortals {
        constructor() {
            this.exportFormat = "json";
        }
        init() {
            var _a;
            __webpack_require__(398), this.dialogHelper = new DialogHelper("KuKuExport"), this.exportHelper = new ExportHelper, 
            this.localStorageHelper = new LocalStorageHelper("KuKuExport"), this.presets = null !== (_a = this.localStorageHelper.loadMap("presets")) && void 0 !== _a ? _a : new Map, 
            this.createButtons();
        }
        createButtons() {
            IITC.toolbox.addButton({
                label: "KExport",
                action: main.showDialog
            });
        }
        showDialog() {
            main.dialog || (main.dialog = main.dialogHelper.getDialog(main.presets), main.dialog.on("dialogclose", () => {
                main.dialog = void 0, main.selectionMode = void 0;
            }));
        }
        switchMode(mode) {
            this.selectionMode = mode;
        }
        switchFormat(format) {
            this.exportFormat = format;
        }
        checkSelectAndConfirmStep(step) {
            void 0 !== this.selectionMode ? this.confirmStep(step) : alert("Please choose a selection mode");
        }
        confirmStep(step) {
            this.dialogHelper.confirmStep(step);
        }
        async doExport() {
            if (!this.selectionMode) return void alert("Please select a selection mode");
            let exportString;
            const exportOptions = {
                selectionMode: this.selectionMode,
                format: this.exportFormat,
                fieldOptions: this.dialogHelper.findFieldOptions()
            };
            try {
                exportString = await this.exportHelper.exportPortals(exportOptions);
            } catch (error) {
                console.error(error), exportString = error.message;
            }
            document.getElementById("KuKuExportOutput").value = exportString;
        }
        showInfo() {
            this.dialogHelper.showInfo();
        }
        copyToClipboard(id) {
            const element = document.getElementById(id);
            element && navigator.clipboard.writeText(element.value).then(() => alert("copied")).catch(error => alert(`copy failed: ${error}`));
        }
        saveToFile(id) {
            const element = document.getElementById(id);
            if (!element) return;
            const blob = new Blob([ element.value ], {
                type: "text/plain"
            }), filename = "output." + this.exportFormat, url = URL.createObjectURL(blob), a = document.createElement("a");
            a.href = url, a.download = filename, a.click(), URL.revokeObjectURL(url);
        }
        savePreset() {
            const name = document.getElementById("KuKuExport-Preset-Input").value;
            name ? (this.presets.set(name, this.dialogHelper.findFieldOptions()), this.localStorageHelper.saveMap("presets", this.presets)) : alert("Please enter a name");
        }
        applyPreset(name) {
            this.dialogHelper.applyPreset(name);
        }
        deletePreset() {
            const select = document.getElementById("KuKuExport-SelDeletePreset");
            this.presets.delete(select.value), this.localStorageHelper.saveMap("presets", this.presets);
        }
    };
    !function Register(plugin, name) {
        const setup = () => {
            window.plugin[name] = plugin, window.plugin[name].init();
        };
        setup.info = SCRIPT_INFO, window.bootPlugins || (window.bootPlugins = []), window.bootPlugins.push(setup), 
        window.iitcLoaded && setup();
    }(main, "KuKuExport");
})();
};
(function () {
  const info = {};
  if (typeof GM_info !== 'undefined' && GM_info && GM_info.script)
    info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
  if (typeof unsafeWindow != 'undefined' || typeof GM_info == 'undefined' || GM_info.scriptHandler != 'Tampermonkey') {
    const script = document.createElement('script');
    script.appendChild(document.createTextNode( '('+ wrapper +')('+JSON.stringify(info)+');'));
    document.head.appendChild(script);} 
  else wrapper(info);
})();