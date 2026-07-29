// ==UserScript==
// @author          McBen
// @name            Refresh
// @id              refresh@McBen
// @category        Tweaks
// @version         1.1.7
// @namespace       https://github.com/IITC-CE/ingress-intel-total-conversion
// @updateURL       https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/McBen/refresh.meta.js
// @downloadURL     https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/McBen/refresh.user.js
// @description     Refresh map without page reload
// @icon64          data:image/png;base64,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
// @homepageURL     https://github.com/IITCPlugins/Refresh
// @issueTracker    https://github.com/IITCPlugins/Refresh/issues
// @match           https://intel.ingress.com/*
// ==/UserScript==


/**
 * v1.1.7
 * - refresh artifacts
 * - refresh current portal
 * 
 * v1.1.6
 * - docs, github and dependencies updates
 * 
 * v1.1
 * - refresh Chat
 * - refresh Portal-Details
 * - Fix icon in minimap
 * 
 * v1.0
 * - init
 */
function wrapper(SCRIPT_INFO) {
(() => {
    "use strict";
    var __webpack_modules__ = {
        671: (module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.d(__webpack_exports__, {
                A: () => __WEBPACK_DEFAULT_EXPORT__
            });
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601), _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314), ___CSS_LOADER_EXPORT___ = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            ___CSS_LOADER_EXPORT___.push([ module.id, "#refreshMapButton img{vertical-align:middle}#refreshMapButton.running img{animation-duration:2s;animation-iteration-count:infinite;animation-name:refreshButton-running;animation-timing-function:linear}@keyframes refreshButton-running{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}", "" ]);
            const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
        },
        314: module => {
            module.exports = function(cssWithMappingToString) {
                var list = [];
                return list.toString = function toString() {
                    return this.map((function(item) {
                        var content = "", needLayer = void 0 !== item[5];
                        return item[4] && (content += "@supports (".concat(item[4], ") {")), item[2] && (content += "@media ".concat(item[2], " {")), 
                        needLayer && (content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {")), 
                        content += cssWithMappingToString(item), needLayer && (content += "}"), item[2] && (content += "}"), 
                        item[4] && (content += "}"), content;
                    })).join("");
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
        601: module => {
            module.exports = function(i) {
                return i[1];
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
        540: module => {
            module.exports = function insertStyleElement(options) {
                var element = document.createElement("style");
                return options.setAttributes(element, options.attributes), options.insert(element, options.options), 
                element;
            };
        },
        56: (module, __unused_webpack_exports, __webpack_require__) => {
            module.exports = function setAttributesWithoutAttributes(styleElement) {
                var nonce = __webpack_require__.nc;
                nonce && styleElement.setAttribute("nonce", nonce);
            };
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
        },
        113: module => {
            module.exports = function styleTagTransform(css, styleElement) {
                if (styleElement.styleSheet) styleElement.styleSheet.cssText = css; else {
                    for (;styleElement.firstChild; ) styleElement.removeChild(styleElement.firstChild);
                    styleElement.appendChild(document.createTextNode(css));
                }
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
    !function Register(plugin, name) {
        const setup = () => {
            window.plugin[name] = plugin, window.plugin[name].init();
        };
        setup.info = SCRIPT_INFO, window.bootPlugins || (window.bootPlugins = []), window.bootPlugins.push(setup), 
        window.iitcLoaded && setup();
    }(new class Refresh {
        constructor() {
            this.CACHE_TIME = 10;
        }
        init() {
            __webpack_require__(398), this.createButton(), window.addHook("mapDataRefreshStart", (() => this.refreshStart())), 
            window.addHook("mapDataRefreshEnd", (() => this.refreshEnd()));
        }
        createButton() {
            const toolbarGroup = $("<div>", {
                class: "leaflet-bar leaflet-control"
            }).append($("<a>", {
                id: "refreshMapButton",
                class: "leaflet-bar-part",
                click: () => this.refresh()
            }).append($("<img>", {
                src: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' viewBox='0 0 341.333 341.333'%3e%3cpath d='M341.227 149.333V0l-50.133 50.133C260.267 19.2 217.707 0 170.56 0 76.267 0 .107 76.373.107 170.667s76.16 170.667 170.453 170.667c79.467 0 146.027-54.4 164.907-128h-44.373c-17.6 49.707-64.747 85.333-120.533 85.333-70.72 0-128-57.28-128-128s57.28-128 128-128c35.307 0 66.987 14.72 90.133 37.867l-68.8 68.8h149.333z'/%3e%3c/svg%3e",
                width: 16,
                height: 16
            })));
            $(".leaflet-top.leaflet-left", window.map.getContainer()).first().prepend(toolbarGroup);
        }
        refresh() {
            $("#refreshMapButton").hasClass("running") || (window.idleReset(), this.clearCache(), 
            window.mapDataRequest.clearTimeout(), window.mapDataRequest.refresh(), window.chat.request(), 
            this.updateArtifacts(), window.portalDetail.setup ? window.portalDetail.setup() : window.portalDetail.clearCache && window.portalDetail.clearCache(), 
            null !== window.selectedPortal && window.portalDetail.request(window.selectedPortal));
        }
        updateArtifacts() {
            const arti = window.artifact;
            window.postAjax("getArtifactPortals", {}, arti.processData, arti.handleError);
        }
        refreshStart() {
            $("#refreshMapButton").addClass("running");
        }
        refreshEnd() {
            $("#refreshMapButton").removeClass("running"), $("#refreshMapButton img").fadeOut(0).fadeIn(1e3 * this.CACHE_TIME);
        }
        clearCache() {
            const oldTime = window.mapDataRequest.cache.REQUEST_CACHE_MAX_AGE;
            window.mapDataRequest.cache.REQUEST_CACHE_MAX_AGE = this.CACHE_TIME, window.mapDataRequest.cache.runExpire(), 
            window.mapDataRequest.cache.REQUEST_CACHE_MAX_AGE = oldTime;
        }
    }, "Refresh");
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