// ==UserScript==
// @author          McBen, Vashiru, j00rtje, DanielOnDiordna 
// @name            Ultimate Mission Maker - Extended
// @id              ummex@McBen
// @category        Mission
// @version         1.1.1
// @namespace       https://github.com/IITC-CE/ingress-intel-total-conversion
// @updateURL       https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/McBen/ummex.meta.js
// @downloadURL     https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/McBen/ummex.user.js
// @description     Easily create mission banners (fan update of Ultimate Mission Maker)
// @icon64          data:image/png;base64,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
// @homepageURL     https://github.com/IITCPlugins/umm_ext
// @issueTracker    https://github.com/IITCPlugins/umm_ext/issues
// @preview         data:image/jpeg;base64,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
// @recommends      draw-tools@breunigs
// @match           https://intel.ingress.com/*
// @match           https://missions.ingress.com/*
// ==/UserScript==

/**
 * # v1.1.1
 * 
 * - fix: "edit" button was covering banner length in main dialog
 * - dependencies update
 * 
 * # v1.1
 * 
 * - new "Mission Generator" dialog  
 *   This new dialog provides several tools to modify current mission:
 *   1. "Reset"  
 *      Discard all current changes.
 *   2. Add portals  
 *      Adds nearby portals to the current mission.
 *      You can:
 *      - Limit selection using a DrawTools polygon
 *      - Exclude individual portals with DrawTool Markers
 *      - Restrict selection to portals within path hack range
 *   3. Sort portals  
 *      Attempts to arrange portals for the shortest possible path.
 *      (Note: This is a complex optimization problem—results may vary.
 *      The “keep end portal” option may occasionally fail.)
 *   4. Change start  
 *      Set the selected Portal as new mission start.
 *      If no portal is selected, the start point will cycle through all mission portals.
 * 
 *   All changes are temporary until "applied" or be "dismissed".  
 *   Note: Distance calculations are based on straight-line (“as-the-crow-flies”) distances; real-world paths are not considered.
 * 
 * - Use static layers  
 *   UMM is now fully hidden when inactive. Background processing is also disabled while inactive.
 * - Added Multi-Reverse  
 *   Using the reverse action in the main dialog, you can now reverse an entire banner or selected parts of it—not just a single mission.
 * - Drag: allow swapping mission portals
 * - Fixed merge in main dialog
 * - Fixed “Should merge?” prompt in split option (main dialog)
 * - Mission-Select dialog moved to the left
 * 
 * # v1.0.2
 * 
 * - fix IITC-Button load
 *   in iitc-button load order is differnet and custom "if UUM is loaded then disable it" failed
 * - fix variable if both plugins are active
 * 
 * # v1.0.1
 * 
 * - fix mission number (index started by 0 instead of 1)
 * 
 * # v1.0
 * 
 * This is a complete rewrite of the Ultimate Mission Maker from a developer perspective.
 * The entire codebase has been redesigned while maintaining the familiar user experience of the original UMM.
 * Below are the visible improvements and changes you'll notice.
 * 
 * ## What's Changed:
 * 
 * - UMM is now hidden by default. You need to hit the "UMM" button in the Portal details window to make it appear.
 * 
 * - **Select Mission Dialog** (open it through the toolbar or the main dialog)
 *   - Selecting a mission is no longer required; simply open another mission
 *   - Navigation buttons (+/-) allow you to cycle through missions
 *   - Added split, clear, merge, and reverse commands for mission manipulation
 *   - New mission information display: portal count and distances
 * 
 * - **Banner Settins** (start window)
 *   - changed Title placeholders to $T $M $N
 * - **Option Dialog** (main window)
 *   - Banner information now displays as a compact table
 *   - Removed warning for mission counts that are not multiples of 6
 *   - Added warning when missions lack sufficient waypoints
 * 
 * - **Drag & Drop** in the mission editor path
 *   - Move existing markers to adjust waypoints
 *   - Add new waypoints by positioning intermediate markers at new locations
 *   - Remove waypoints by double-clicking a marker
 *   - Merge missions by dragging start and end markers together
 * 
 * - **Mission Numbers**
 *   - Potential split points are previewed while creating missions
 * 
 * - **Waypoint edit**
 *   - current mission is preselected
 *   - passphrases: add random default questions.
 *     when question & answer is empty a simple question will be set.
 * 
 * - **Miscellaneous**
 *   - Custom confirmation dialogs clarify actions and improve readability
 *   - Switch between any missions, even those without portals
 *   - Option to split missions when starting on a portal that's already assigned to another mission
 *   - on mobile dialogs are not at the top instead of centered
 *   - flash buttonbar on activation to draw attention
 * 
 * ---
 * 
 * # History:
 * 
 * ## v1.0.beta.2 - 15.02.26
 * 
 * - fixed update-URL in script header
 * 
 * ## v1.0.beta - 15.02.26
 * 
 * - first public release
 * - automated build process on GitHub
 * - fixed layer checkboxes in Option-Dialog
 * - add "clear" mission to selection dialog
 * - always color selected mission even when not in Edit-Mode
 * - move "no" to left in custom confirm dialog
 * - remove doubled "v" in version numbers
 * - fix toggeling edit mode on mission detail window "save" button
 * - close dialog on mission detail window "save"
 * - fix linebreaks in changelog dialog
 * - select mission: directly select mission on combo-box change
 * - fix question text in portal details
 * - on mobile dialogs are not at the top instead of centered
 * 
 */
function wrapper_iitc(SCRIPT_INFO) {
(() => {
    "use strict";
    var __webpack_modules__ = {
        707(module, __webpack_exports__, __webpack_require__) {
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601), _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314), ___CSS_LOADER_EXPORT___ = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            ___CSS_LOADER_EXPORT___.push([ module.id, "#umm-mission-picker-info{border:1px solid #ff0;border-radius:2px;margin:1em 4px 4px}.umm-mission-btn{margin-bottom:2px;margin-right:1em;margin-top:2px}.umm-mission-btn.w-full{width:90%}.umm-notification{background-color:#383838;border-radius:2px;-webkit-box-shadow:0 0 24px -1px #383838;-moz-box-shadow:0 0 24px -1px #383838;box-shadow:0 0 24px -1px #383838;color:#f0f0f0;font-family:Calibri,sans-serif;font-size:20px;height:auto;left:50%;margin-left:-100px;padding:10px;position:absolute;text-align:center;top:20px;width:300px;z-index:10000}.umm-options-list{overflow:hidden}.umm-options-list .banner_info{border:1px solid grey;border-radius:2px;margin-top:0;min-height:7.1em;padding:4px;position:relative}.umm-options-list .banner_info .title{font:700;font-size:large}.umm-options-list .banner_info .description{font-size:small;margin-bottom:.5em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.umm-options-list .banner_info .stat{font-weight:700;margin-left:.4em}.umm-options-list .banner_info #umm_opt_error{padding-top:.5em}.umm-options-list .banner_info #umm_opt_error .error{color:#ffa0a0;font-weight:700}.umm-options-list .banner_info .editButtom{bottom:0;position:absolute;right:0}.umm-options-list a{background:rgba(8,48,78,.9);border:1px solid #ffce00;color:#ffce00;display:block;margin:10px auto;padding:3px 0;text-align:center;width:80%}#dialog-umm-edit-mission-set-details{background-color:rgba(8,48,78,.9)}.umm-edit-mission-set-details p{display:block;margin:5px 0 8px}.umm-edit-mission-set-details label{display:block;margin-bottom:5px}.umm-edit-mission-set-details input,.umm-edit-mission-set-details textarea{margin-bottom:15px;width:100%}.umm-edit-mission-set-details textarea{background-color:#062844;color:#ffce00;font-family:inherit;resize:vertical;width:calc(100% - 6px)}.umm-edit-mission-set-details span.umm-error{color:#fff;display:block;display:none;margin-bottom:5px}.umm-edit-mission-set-details span.umm-error b{color:red}.umm-dialog-button{margin-left:5px}.umm-mission-marker .start{fill:#16d4b2;stroke:#005243;stroke-miterlimit:10}.umm-mission-marker .active{fill:#6832da;stroke:#16043f;stroke-miterlimit:10}.umm-mission-number{color:#000;font-family:monospace;font-size:14px;font-weight:700;left:0;position:absolute;text-align:center;top:6px;width:34px}#umm-waypoint-editor{border-bottom:1px solid #20a8b1;border-top:1px solid #20a8b1;box-sizing:border-box;color:#ffce00;display:flex;flex-direction:column;margin-bottom:10px;margin-top:10px;padding:8px 5px;width:100%}.umm-waypoint-editor-title{font-weight:700;margin-bottom:6px}.umm-waypoint-select-container{display:flex;flex-direction:row;width:100%}.umm-waypoint-select-container>select{background-color:#062844;border:none;color:#ffce00;height:24px}#umm-mission-select{width:60px}#umm-action-select{margin-left:4px;width:100%}#umm-passphrase-container{display:none;flex-direction:column;margin-top:5px}#umm-passphrase-container>span{margin-bottom:3px}#umm-passphrase-container>input,#umm-passphrase-container>textarea{background-color:#062844;border:none;color:#ffce00;font-family:Arial;margin-bottom:5px;min-height:24px;padding:3px;resize:vertical}.umm-confirm.no_title .ui-dialog-titlebar{display:none}.umm-confirm .header{font-size:1.4em;line-height:1.4em;margin:10px;overflow:hidden;text-align:center;text-overflow:ellipsis}.umm-confirm .details{color:#ccc;text-align:center}.um-helpTooltip{cursor:help;font-size:small;margin-left:5px}", "" ]);
            const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
            __webpack_require__.d(__webpack_exports__, [ "A", 0, __WEBPACK_DEFAULT_EXPORT__ ]);
        },
        314(module) {
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
        601(module) {
            module.exports = function(i) {
                return i[1];
            };
        },
        340(module, __webpack_exports__, __webpack_require__) {
            __webpack_require__.r(__webpack_exports__), __webpack_require__.d(__webpack_exports__, {
                default: () => src_styles
            });
            var injectStylesIntoStyleTag_namespaceObject = __webpack_require__.cjs(function(module, exports) {
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
            }), injectStylesIntoStyleTag_default = __webpack_require__.n(injectStylesIntoStyleTag_namespaceObject), styleDomAPI_namespaceObject = __webpack_require__.cjs(function(module, exports) {
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
            }), styleDomAPI_default = __webpack_require__.n(styleDomAPI_namespaceObject), insertBySelector_namespaceObject = __webpack_require__.cjs(function(module, exports) {
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
            }), insertBySelector_default = __webpack_require__.n(insertBySelector_namespaceObject), setAttributesWithoutAttributes_namespaceObject = __webpack_require__.cjs(function(module, exports) {
                module.exports = function setAttributesWithoutAttributes(styleElement) {
                    var nonce = __webpack_require__.nc;
                    nonce && styleElement.setAttribute("nonce", nonce);
                };
            }), setAttributesWithoutAttributes_default = __webpack_require__.n(setAttributesWithoutAttributes_namespaceObject), insertStyleElement_namespaceObject = __webpack_require__.cjs(function(module, exports) {
                module.exports = function insertStyleElement(options) {
                    var element = document.createElement("style");
                    return options.setAttributes(element, options.attributes), options.insert(element, options.options), 
                    element;
                };
            }), insertStyleElement_default = __webpack_require__.n(insertStyleElement_namespaceObject), styleTagTransform_namespaceObject = __webpack_require__.cjs(function(module, exports) {
                module.exports = function styleTagTransform(css, styleElement) {
                    if (styleElement.styleSheet) styleElement.styleSheet.cssText = css; else {
                        for (;styleElement.firstChild; ) styleElement.removeChild(styleElement.firstChild);
                        styleElement.appendChild(document.createTextNode(css));
                    }
                };
            }), styleTagTransform_default = __webpack_require__.n(styleTagTransform_namespaceObject), styles = __webpack_require__(707), options = {};
            options.styleTagTransform = styleTagTransform_default(), options.setAttributes = setAttributesWithoutAttributes_default(), 
            options.insert = insertBySelector_default().bind(null, "head"), options.domAPI = styleDomAPI_default(), 
            options.insertStyleElement = insertStyleElement_default();
            injectStylesIntoStyleTag_default()(styles.A, options);
            const src_styles = styles.A && styles.A.locals ? styles.A.locals : void 0;
        }
    };
    const __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        const cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        const module = __webpack_module_cache__[moduleId] = {
            id: moduleId,
            exports: {}
        };
        return __webpack_modules__[moduleId](module, module.exports, __webpack_require__), 
        module.exports;
    }
    __webpack_require__.n = module => {
        const getter = module && module.__esModule ? () => module.default : () => module;
        return __webpack_require__.d(getter, {
            a: getter
        }), getter;
    }, __webpack_require__.d = (exports, definition) => {
        if (Array.isArray(definition)) for (var i = 0; i < definition.length; ) {
            var key = definition[i++], binding = definition[i++];
            __webpack_require__.o(exports, key) ? 0 === binding && i++ : 0 === binding ? Object.defineProperty(exports, key, {
                enumerable: !0,
                value: definition[i++]
            }) : Object.defineProperty(exports, key, {
                enumerable: !0,
                get: binding
            });
        } else for (var key in definition) __webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key) && Object.defineProperty(exports, key, {
            enumerable: !0,
            get: definition[key]
        });
    }, __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop), 
    __webpack_require__.r = exports => {
        Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(exports, "__esModule", {
            value: !0
        });
    }, __webpack_require__.cjs = body => {
        const mod = {
            exports: {}
        };
        return body.call(mod.exports, mod, mod.exports), mod.exports;
    }, __webpack_require__.nc = void 0;
    __webpack_require__.d({}, {
        i: () => main
    });
    const debounce = (fct, timeout = 10) => {
        let timer;
        return (...data) => {
            clearTimeout(timer), timer = window.setTimeout(() => {
                fct.apply(void 0, data);
            }, timeout);
        };
    }, confirmDialog = options => new Promise((resolve, _) => {
        const message = $("<div>");
        message.append($("<div>", {
            class: "header"
        }).append(options.message)), options.details && message.append($("<hr>"), $("<div>", {
            class: "details"
        }).append(options.details));
        const buttons = [ {
            text: "No",
            click: () => {
                newDialog.dialog("close"), resolve(!1);
            }
        }, {
            text: "Yes",
            click: () => {
                newDialog.dialog("close"), resolve(!0);
            }
        } ], newDialog = window.dialog({
            html: message,
            title: options.title,
            dialogClass: "umm-confirm " + (options.title ? "" : " no_title"),
            resizable: !1,
            modal: !0,
            closeOnEscape: !1,
            buttons
        });
        newDialog.parent().find("button:eq(1)").css({
            float: "left"
        }), newDialog.closest(".ui-dialog").trigger("focus"), newDialog.closest(".ui-dialog").on("keydown", event => "Enter" === event.key ? (event.preventDefault(), 
        event.stopPropagation(), newDialog.parent().find("button:eq(2)").trigger("click"), 
        !1) : "Escape" !== event.key || (event.preventDefault(), event.stopPropagation(), 
        newDialog.parent().find("button:eq(1)").trigger("click"), !1)), newDialog.dialog("moveToTop");
    }), bannerNotification = (state, message) => notification(`${state.getBannerName()}\n${message}`), notification = (notificationText, presistend = !1) => {
        $(".umm-notification").remove(), notificationText = notificationText.replace(/\n/g, "<br/>");
        const notification = $("<div>", {
            class: "umm-notification",
            html: notificationText
        });
        $("body").append(notification), presistend || window.setTimeout(() => {
            $(".umm-notification").fadeOut(400, () => notification.remove());
        }, 3e3);
    };
    let icon;
    class DragMarker {
        editDragLine;
        mission;
        marker;
        layer;
        startLocation;
        constructor(layer, location, portalId, mission, isDummy = !1) {
            this.mission = mission, this.layer = layer, this.startLocation = location, this.marker = new L.Marker(location, {
                icon: (icon || (icon = L.Browser.touch ? new L.DivIcon({
                    iconSize: new L.Point(20, 20),
                    className: "leaflet-div-icon leaflet-editing-icon leaflet-touch-icon"
                }) : new L.DivIcon({
                    iconSize: new L.Point(8, 8),
                    className: "leaflet-div-icon leaflet-editing-icon"
                })), icon),
                draggable: !0,
                zIndexOffset: 7e3,
                opacity: isDummy ? .4 : 1,
                portal: portalId,
                isMidPoint: isDummy
            }), layer.addLayer(this.marker), this.marker.on("drag", event => {
                this.onMarkerDrag(event);
            }).on("dragstart", event => {
                this.onMarkerDragStart(event);
            }).on("dragend", event => {
                this.onMarkerDragEnd(event);
            }).on("dblclick", event => {
                this.onMarkerDblClick(event);
            });
        }
        destroy() {
            this.layer.removeLayer(this.marker);
        }
        onMarkerDragStart(event) {
            const marker = event.target, options = event.target.options, isMidPoint = options.isMidPoint;
            this.editDragLine && this.layer.removeLayer(this.editDragLine);
            const portal = options.portal, portal_pre = portal > 0 ? this.mission.portals.get(portal - 1) : void 0, portal_post = this.mission.portals.get(portal + (isMidPoint ? 0 : 1));
            let lls = [ portal_pre && new L.LatLng(portal_pre.location.latitude, portal_pre.location.longitude), marker.getLatLng(), portal_post && new L.LatLng(portal_post.location.latitude, portal_post.location.longitude) ];
            portal_pre || portal_post ? portal_pre ? portal_post || (lls = [ lls[1], lls[0] ]) : lls.splice(0, 1) : lls = [ marker.getLatLng(), marker.getLatLng() ], 
            this.editDragLine = new L.Polyline(lls, {
                color: "#ff9a00",
                weight: 3,
                dashArray: "5,5",
                pointerEvents: "none"
            }), this.layer.addLayer(this.editDragLine);
        }
        onMarkerDrag(event) {
            if (!this.editDragLine) return;
            const marker = event.target, snappedPortal = this.getSnapPortal(marker.getLatLng()), newTarget = snappedPortal ? snappedPortal.getLatLng() : marker.getLatLng(), latlngs = this.editDragLine.getLatLngs();
            latlngs[3 === latlngs.length ? 1 : 0] = newTarget, this.editDragLine.setLatLngs(latlngs);
        }
        async onMarkerDragEnd(event) {
            this.editDragLine && (this.layer.removeLayer(this.editDragLine), this.editDragLine = void 0);
            const marker = event.target, options = event.target.options, snappedPortal = this.getSnapPortal(marker.getLatLng());
            if (!snappedPortal) return void this.marker.setLatLng(this.startLocation);
            const oldPortalIndex = this.mission.portals.indexOf(snappedPortal.options.guid), portalToAdd = this.mission.portals.create(snappedPortal.options.guid);
            if (options.isMidPoint) -1 !== oldPortalIndex && (this.mission.portals.remove(oldPortalIndex), 
            options.portal > oldPortalIndex && options.portal--), this.mission.portals.insert(options.portal, portalToAdd); else if (-1 === oldPortalIndex) await this.movePortal(options.portal, portalToAdd); else {
                const a = this.mission.portals.get(options.portal), b = this.mission.portals.get(oldPortalIndex);
                this.mission.portals.set(oldPortalIndex, a), this.mission.portals.set(options.portal, b);
            }
            main.state.save();
        }
        async movePortal(portalID, target) {
            if (0 === portalID) {
                const missions = main.state.missions, preMission = missions.previous(this.mission);
                if (preMission?.portals.isEnd(target)) {
                    if (await confirmDialog({
                        message: "Merge mission ?"
                    })) return missions.merge(preMission, this.mission), void main.state.setCurrent(preMission.id);
                } else if (1 === this.mission.portals.length && preMission?.portals.includes(target.guid) && await confirmDialog({
                    message: "Split mission ?"
                })) {
                    const index = preMission.portals.indexOf(target.guid);
                    return this.mission.portals.clear(), void missions.split(preMission, index, this.mission);
                }
            }
            if (portalID === this.mission.portals.length - 1) {
                const missions = main.state.missions, postMission = missions.next(this.mission);
                if (postMission?.portals.isStart(target) && await confirmDialog({
                    message: "Merge mission ?"
                })) return void missions.merge(this.mission, postMission);
            }
            this.mission.portals.set(portalID, target);
        }
        getSnapPortal(unsnappedLatLng) {
            const containerPoint = window.map.latLngToContainerPoint(unsnappedLatLng);
            let best_portal, best_distance = 1 / 0;
            for (const guid in window.portals) {
                const portal = window.portals[guid], ll = portal.getLatLng(), pp = window.map.latLngToContainerPoint(ll), options = portal.options, size = options.weight + 5 * options.radius, distance = pp.distanceTo(containerPoint);
                distance > size || distance < best_distance && (best_distance = distance, best_portal = portal);
            }
            return best_portal;
        }
        onMarkerDblClick(event) {
            const options = event.target.options, portal = options.portal;
            options.isMidPoint || (this.mission.portals.remove(portal), main.state.save(), notification(`${this.mission.title}\nRemoved #${portal + 1} from mission`));
        }
    }
    class RenderBase {
        layer;
        constructor() {
            this.layer = new window.L.FeatureGroup, this.toggle(!1);
        }
        isVisible() {
            return window.map.hasLayer(this.layer);
        }
        isLayer(layer) {
            return layer === this.layer;
        }
        toggle(show) {
            show ? window.map.addLayer(this.layer) : window.map.removeLayer(this.layer);
        }
    }
    class RenderPath extends RenderBase {
        dragMarkers;
        constructor() {
            super(), this.dragMarkers = [], main.state.onMissionChange.do(this.redraw), main.state.onMissionPortal.do(this.redraw), 
            main.state.onSelectedMissionChange.do(this.redraw);
        }
        redrawNow=() => {
            this.layer.clearLayers(), this.dragMarkers.forEach(m => m.destroy()), this.dragMarkers = [];
            const editMode = main.missionModeActive;
            main.state.missions.forEach(mission => {
                main.state.isCurrent(mission.id) && editMode ? this.drawEditMission(mission) : this.drawMission(mission);
            });
        };
        redraw=debounce(this.redrawNow);
        drawMission(mission) {
            const geodesicPolyline = new L.GeodesicPolyline(mission.getLocations(), {
                color: main.state.isCurrent(mission.id) ? "#ff9a00" : "crimson",
                weight: 5,
                smoothFactor: 1,
                interactive: !1
            });
            this.layer.addLayer(geodesicPolyline);
        }
        drawEditMission(mission) {
            const coordinatesList = mission.getLocations();
            coordinatesList.forEach((ll, index) => this.createDragMarker(ll, index, mission)), 
            coordinatesList.forEach((ll, index) => {
                if (index > 0) {
                    const half = this.getCenter(coordinatesList[index - 1], ll);
                    this.createDragMarker(half, index, mission, !0);
                }
            });
            const geodesicPolyline = new L.GeodesicPolyline(coordinatesList, {
                color: "#ff9a00",
                weight: 5,
                smoothFactor: 1
            });
            this.layer.addLayer(geodesicPolyline);
        }
        createDragMarker(location, portalId, mission, dummy = !1) {
            this.dragMarkers.push(new DragMarker(this.layer, location, portalId, mission, dummy));
        }
        getCenter(l1, l2) {
            const p1 = window.map.project(l1), p2 = window.map.project(l2);
            return window.map.unproject(p1.add(p2).divideBy(2));
        }
    }
    class RenderNumbers extends RenderBase {
        constructor() {
            super(), main.state.onMissionChange.do(this.redraw), main.state.onMissionPortal.do(this.redraw), 
            main.state.onSelectedMissionChange.do(this.redraw);
        }
        redrawNow=() => {
            this.layer.clearLayers();
            const state = main.state;
            this.getMissionStarts(state).forEach(start => {
                const id = start.missionIndex, icon = this.generateMarker(state.isCurrent(id) ? "active" : "start", id + 1), marker = L.marker(start.location, {
                    icon: L.divIcon({
                        className: "umm-mission-icon",
                        iconSize: [ 34, 50 ],
                        iconAnchor: [ 17, 50 ],
                        html: icon
                    }),
                    opacity: start.auto ? .4 : 1,
                    interactive: !1
                });
                this.layer.addLayer(marker);
            });
        };
        redraw=debounce(this.redrawNow);
        getMissionStarts(state) {
            const missions = [];
            let mid = 0;
            for (;mid < state.missions.count(); ) {
                const mission = state.missions.get(mid);
                if (mission?.hasPortals()) {
                    const start = mission.portals.getLatLngOf(0);
                    missions.push({
                        missionIndex: mid,
                        location: start,
                        auto: !1
                    });
                }
                let count = 1;
                for (;mid + count < state.missions.count(); count++) {
                    const nextMission = state.missions.get(mid + count);
                    if (nextMission?.hasPortals()) break;
                }
                if (count > 1) {
                    const allLocations = [];
                    for (let i = 0; i < count - 1; i++) {
                        const fillMission = state.missions.get(mid + i);
                        fillMission?.hasPortals() && allLocations.push(...fillMission.getLocations());
                    }
                    const portalsPerMission = Math.max(allLocations.length / count, 6);
                    for (let fillIndex = 1; fillIndex < count; fillIndex++) {
                        const locationIndex = Math.floor(portalsPerMission * fillIndex);
                        locationIndex < allLocations.length - 1 && missions.push({
                            missionIndex: mid + fillIndex,
                            location: allLocations[locationIndex],
                            auto: !0
                        });
                    }
                }
                mid += count;
            }
            return missions;
        }
        generateMarker(kclass, index) {
            return `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 49" class="umm-mission-marker"><defs><style>.cls-2{fill:#fff;}</style></defs><path class="${kclass}" d="M33,18c0,8.84-12,31-16,31S1,26.84,1,18,8.16,1,17,1,33,9.16,33,18Z" transform="translate(-0.5 -0.5)"/><circle class="cls-2" cx="16.5" cy="16.5" r="13"/><foreignObject x="0" y="0" width="34px" height="34px"><span class="umm-mission-number">${index}</span></foreignObject></svg>`;
        }
    }
    class Portals {
        state;
        data;
        constructor(state, data) {
            this.state = state, this.data = data;
        }
        cloneWithoutEvents() {
            return new Portals(void 0, [ ...this.data ]);
        }
        get length() {
            return this.data.length;
        }
        get(index) {
            return this.data.at(index);
        }
        getRange(start, end) {
            return this.data.slice(start, end);
        }
        set(index, portal) {
            this.data[index] = portal, this.state?.onMissionPortal.trigger();
        }
        add(...portal) {
            portal.some(p => this.includes(p.guid)), this.data.push(...portal), this.state?.onMissionPortal.trigger();
        }
        insert(index, ...portal) {
            portal.some(p => this.includes(p.guid)), this.data.splice(index, 0, ...portal), 
            this.state?.onMissionPortal.trigger();
        }
        remove(index, count = 1) {
            this.data.splice(index, count), this.state?.onMissionPortal.trigger();
        }
        clear() {
            this.data.length = 0, this.state?.onMissionPortal.trigger();
        }
        toLatLng() {
            return this.data.map(portal => new L.LatLng(portal.location.latitude, portal.location.longitude));
        }
        getLatLngOf(index) {
            const portal = this.get(index);
            if (portal) return new L.LatLng(portal.location.latitude, portal.location.longitude);
        }
        includes(guid) {
            return this.data.some(x => x.guid === guid);
        }
        find(guid) {
            return this.data.find(x => x.guid === guid);
        }
        indexOf(guid) {
            return this.data.findIndex(x => x.guid === guid);
        }
        isStart(portal) {
            return this.data[0]?.guid === portal.guid;
        }
        isEnd(portal) {
            return this.data.at(-1)?.guid === portal.guid;
        }
        reverse() {
            this.data.reverse(), this.state?.onMissionPortal.trigger();
        }
        create(guid) {
            const iitcPortal = window.portals[guid], options = iitcPortal.options.data, ll = iitcPortal.getLatLng();
            return {
                guid,
                title: options.title || "[undefined]",
                imageUrl: options.image,
                description: "",
                location: {
                    latitude: ll.lat,
                    longitude: ll.lng
                },
                isOrnamented: !1,
                isStartPoint: !1,
                type: "PORTAL",
                objective: {
                    type: "HACK_PORTAL",
                    passphrase_params: {
                        question: "",
                        _single_passphrase: ""
                    }
                }
            };
        }
        getDistance() {
            return this.toLatLng().reduce((sum, ll, index, lls) => index > 0 ? sum + ll.distanceTo(lls[index - 1]) : 0, 0);
        }
    }
    const setPassphrase = (portal, question, answer) => {
        portal.objective.passphrase_params.question = question, portal.objective.passphrase_params._single_passphrase = answer;
    };
    class Mission {
        missionID;
        data;
        portal_data;
        constructor(state, id, data) {
            this.missionID = id, this.data = data, this.portal_data = new Portals(state, data.portals);
        }
        get title() {
            return this.data.missionTitle;
        }
        get portals() {
            return this.portal_data;
        }
        get id() {
            return this.missionID;
        }
        get description() {
            return this.data.missionDescription;
        }
        hasPortals() {
            return this.portal_data.length > 0;
        }
        getLocations() {
            return this.portal_data.toLatLng();
        }
        show() {
            if (this.hasPortals()) {
                const bounds = new L.LatLngBounds(this.getLocations()).pad(.2);
                window.map.fitBounds(bounds, {
                    maxZoom: 18
                });
            }
        }
        focusLastPortal() {
            const last_ll = this.portal_data.getLatLngOf(-1), last = this.portal_data.get(-1);
            return !(!last || !last_ll) && (window.map.setView(last_ll), window.renderPortalDetails(last.guid), 
            !0);
        }
        getDistance() {
            return this.portals.getDistance();
        }
        clear() {
            this.portal_data.clear();
        }
        reverse() {
            this.portal_data.reverse();
        }
    }
    class Missions {
        static generateMissionTitle(format, info) {
            return format.replace(/\$(\d*)?(\w)/g, (_, flags, token) => {
                let value = token;
                switch (token.toLowerCase()) {
                  case "t":
                    value = info.title ?? value;
                    break;

                  case "m":
                    value = info.total?.toString() ?? value;
                    break;

                  case "n":
                    value = ((info.misison || 0) + 1).toString() ?? value;
                }
                let leadingZero = !1;
                flags?.startsWith("0") && (leadingZero = !0, flags = flags.slice(1));
                let length = parseInt(flags);
                return Number.isNaN(length) && (length = 1, leadingZero && (length = info.total?.toString().length ?? 1)), 
                value.length < length && (value = value.padStart(length, leadingZero ? "0" : " ")), 
                value;
            });
        }
        state;
        data;
        constructor(state, data) {
            this.state = state, this.data = data;
        }
        get(missionId) {
            const mis = this.data[missionId];
            return mis && new Mission(this.state, missionId, mis);
        }
        count() {
            return this.data.length;
        }
        forEach(callback) {
            this.data.forEach((missionData, index) => {
                const mission = new Mission(this.state, index, missionData);
                callback(mission);
            });
        }
        filter(callback) {
            const result = [];
            return this.forEach(mission => {
                callback(mission) && result.push(mission);
            }), result;
        }
        previous(mission) {
            let preMission, preMissionID = mission.id - 1;
            for (;!(preMission = this.get(preMissionID))?.hasPortals() && preMissionID > 0; ) preMissionID--;
            return preMission;
        }
        next(mission) {
            return this.get(mission.id + 1);
        }
        distanceToStart(id) {
            const mission = this.get(id);
            if (!mission) return;
            const previous = this.previous(mission), first = previous?.portals.getLatLngOf(-1), last = mission.portals.getLatLngOf(0);
            return first && last ? first.distanceTo(last) : void 0;
        }
        getTotalDistance() {
            const waypoints = [];
            return this.forEach(m => waypoints.push(...m.getLocations())), waypoints.reduce((sum, ll, index, lls) => index > 0 ? sum + ll.distanceTo(lls[index - 1]) : 0, 0);
        }
        getWaypointCount() {
            return this.data.reduce((count, mis) => count + mis.portals.length, 0);
        }
        validate() {
            const errors = {}, notEnoughWaypoint = this.filter(m => m.portals.length < 6).map(m => m.id);
            return notEnoughWaypoint.length > 0 && (errors["not enough waypoints"] = notEnoughWaypoint), 
            errors;
        }
        zoom() {
            const location = this.data.flatMap(m => new Portals(this.state, m.portals).toLatLng());
            if (location.length > 0) {
                const bounds = new L.LatLngBounds(location).pad(.1);
                window.map.fitBounds(bounds, {
                    maxZoom: 18
                });
            }
        }
        merge(destination, missionB) {
            destination.portals.add(...missionB.portals.getRange()), missionB.portals.clear();
        }
        mergeAll() {
            const portals = [];
            this.data.forEach(m => {
                portals.push(...m.portals), m.portals.length = 0;
            }), this.data[0].portals = portals;
        }
        split(source, at, destination) {
            const toMove = source.portals.getRange(at);
            destination.portals.insert(0, ...toMove), source.portals.remove(at, toMove.length);
        }
        splitIntoMultiple(source, count, restAtLast = !1) {
            const allPortals = this.getAllPortalsOf(source.id, count);
            let portalsPerMission = allPortals.length / count;
            restAtLast && (portalsPerMission = Math.floor(portalsPerMission));
            for (let i = 0; i < count; i++) {
                const start = Math.floor(portalsPerMission * i);
                let end = Math.floor(portalsPerMission * (i + 1));
                i === count - 1 && (end = allPortals.length);
                const mission = this.get(source.id + i);
                mission?.portals.clear(), mission?.portals.add(...allPortals.slice(start, end));
            }
        }
        getAllPortalsOf(from, count) {
            const allPortals = [];
            for (let i = 0; i < count; i++) {
                const mission = this.get(from + i);
                mission && allPortals.push(...mission.portals.getRange());
            }
            return allPortals;
        }
        getMissionsOfPortal(guid) {
            return this.filter(mis => mis.portals.includes(guid)).map(m => m.id);
        }
        reverse(from, to) {
            if (to) {
                (from = Math.min(Math.max(from, 0), this.count() - 1)) > (to = Math.min(Math.max(to, 0), this.count() - 1)) && ([from, to] = [ to, from ]);
                const portal_copy = this.data.map(mission => mission.portals.splice(0));
                for (let i = from; i <= to; i++) this.data[i].portals = portal_copy[to - (i - from)].reverse();
            } else this.get(from)?.reverse();
        }
    }
    const undefinedOrEmptyString = value => null == value || "" == value;
    class Trigger {
        handler=[];
        do(fct) {
            this.handler.includes(fct) || this.handler.push(fct);
        }
        dont(fct) {
            const index = this.handler.indexOf(fct);
            -1 === index ? console.error("handler was not registerd", fct) : this.handler.splice(index, 1);
        }
        trigger() {
            this.handler.some(fct => !1 === fct());
        }
        clear() {
            this.handler = [];
        }
    }
    class State {
        theState;
        constructor() {
            this.load();
        }
        onSelectedMissionChange=new Trigger;
        onMissionChange=new Trigger;
        onMissionPortal=new Trigger;
        load() {
            this.reset();
            const data = localStorage.getItem("ultimate-mission-maker");
            data && this.import(data);
        }
        save() {
            this.setPlannedLength(this.theState.plannedBannerLength), localStorage.setItem("ultimate-mission-maker", this.asString());
        }
        import(jsonString) {
            const anyState = JSON.parse(jsonString);
            this.theState = (ummState => {
                if (ummState.fileFormatVersion > 3) throw new Error("UMM: You've attempted to load data that's newer than what's supported by this version of UMM. Please update the plugin and try again. Data has not been loaded.");
                if (void 0 === ummState.fileFormatVersion || "" === ummState.fileFormatVersion) {
                    if (undefinedOrEmptyString(ummState.missionSetName) && (undefinedOrEmptyString(ummState.missionName) ? ummState.missionSetName = "" : (ummState.missionSetName = ummState.missionName, 
                    delete ummState.missionName)), undefinedOrEmptyString(ummState.missionSetDescription) && (undefinedOrEmptyString(ummState.missionDescription) ? ummState.missionSetDescription = "" : (ummState.missionSetDescription = ummState.missionDescription, 
                    delete ummState.missionDescription)), undefinedOrEmptyString(ummState.titleFormat) && (ummState.titleFormat = "T NN-M"), 
                    void 0 === ummState.numberOfMissions ? ummState.plannedBannerLength = Object.keys(ummState.missions).length : (ummState.plannedBannerLength = ummState.numberOfMissions, 
                    delete ummState.numberOfMissions), !Object.keys(ummState.missions[0]).includes("portals")) if (ummState.missions[0][0].guid) {
                        const newMissions = [];
                        for (const mission in ummState.missions) {
                            const plannedLength = ummState.plannedBannerLength > 0 ? ummState.plannedBannerLength : ummState.missions.length, missionTitle = Missions.generateMissionTitle(ummState.titleFormat, {
                                misison: parseInt(mission) + 1,
                                title: ummState.missionSetName,
                                total: plannedLength
                            });
                            newMissions.push({
                                missionTitle,
                                missionDescription: ummState.missionSetDescription,
                                portals: ummState.missions[mission]
                            });
                        }
                        ummState.missions = newMissions;
                    } else ummState.missions = [ {
                        missionTitle: "",
                        missionDescription: "",
                        portals: []
                    } ];
                    ummState.fileFormatVersion = 1;
                }
                if (1 === ummState.fileFormatVersion) {
                    for (const mission in ummState.missions) for (const portal in ummState.missions[mission].portals) ummState.missions[mission].portals[portal].objective = {
                        type: "HACK_PORTAL",
                        passphrase_params: {
                            question: "",
                            _single_passphrase: ""
                        }
                    };
                    ummState.fileFormatVersion = 2;
                }
                if (2 === ummState.fileFormatVersion) for (const mission in ummState.missions) for (const portal in ummState.missions[mission].portals) "HACK" === ummState.missions[mission].portals[portal].objective.type && (ummState.missions[mission].portals[portal].objective.type = "HACK_PORTAL");
                return 2 === ummState.fileFormatVersion && (ummState.missionSetName ??= "", ummState.missionSetDescription ??= "", 
                ummState.currentMission ??= 0, ummState.plannedBannerLength ??= 1, ummState.titleFormat ??= "T NN-M"), 
                ummState.fileFormatVersion < 3 && (ummState.titleFormat = (ummState.titleFormat ?? "").replace("T", "$T").replace(/N+/, match => match.length > 1 ? "$0N" : "$N").replace(/(M+)/g, "$M"), 
                ummState.fileFormatVersion = 3), ummState;
            })(anyState), this.setPlannedLength(this.getPlannedLength() || 1), this.onMissionChange.trigger(), 
            this.onMissionPortal.trigger(), this.onSelectedMissionChange.trigger();
        }
        asString() {
            return JSON.stringify(this.theState);
        }
        reset() {
            this.theState = {
                missionSetName: "",
                missionSetDescription: "",
                currentMission: 0,
                plannedBannerLength: 1,
                titleFormat: "$T $N / $M",
                fileFormatVersion: 3,
                missions: [ {
                    missionTitle: "",
                    missionDescription: "",
                    portals: []
                } ],
                layers: []
            }, this.onMissionChange.trigger();
        }
        isEmpty() {
            return "" === this.theState.missionSetName && "" === this.theState.missionSetDescription && this.theState.missions.every(m => 0 === m.portals.length);
        }
        isValid() {
            return "" !== this.theState.missionSetName && "" !== this.theState.missionSetDescription && this.theState.plannedBannerLength > 0;
        }
        get missions() {
            return new Missions(this, this.theState.missions);
        }
        getBannerName() {
            return this.theState.missionSetName;
        }
        setBannerName(name) {
            this.theState.missionSetName = name, this.theState.missions.forEach((mission, id) => mission.missionTitle = this.generateMissionTitle(id)), 
            this.onMissionChange.trigger();
        }
        getBannerDesc() {
            return this.theState.missionSetDescription;
        }
        setBannerDesc(desc) {
            this.theState.missionSetDescription = desc, this.theState.missions.forEach(mission => mission.missionDescription = this.theState.missionSetDescription), 
            this.onMissionChange.trigger();
        }
        getTitleFormat() {
            return this.theState.titleFormat;
        }
        setTitleFormat(name) {
            this.theState.titleFormat = name, this.theState.missions.forEach((mission, id) => mission.missionTitle = this.generateMissionTitle(id)), 
            this.onMissionChange.trigger();
        }
        getPlannedLength() {
            return this.theState.plannedBannerLength;
        }
        setPlannedLength(count) {
            if (count = Math.max(count, 1), this.theState.plannedBannerLength = count, this.theState.missions.length > count) this.theState.missions = this.theState.missions.slice(0, count); else for (let id = this.theState.missions.length; id < count; id++) this.theState.missions.push({
                missionTitle: this.generateMissionTitle(id),
                missionDescription: this.theState.missionSetDescription,
                portals: []
            });
            this.onMissionChange.trigger();
        }
        generateMissionTitle(missNumber) {
            return Missions.generateMissionTitle(this.theState.titleFormat, {
                misison: missNumber,
                total: this.getPlannedLength(),
                title: this.theState.missionSetName
            });
        }
        getEditMission() {
            return this.missions.get(this.theState.currentMission);
        }
        setCurrent(missionId) {
            missionId >= 0 && this.getPlannedLength(), this.theState.currentMission = missionId, 
            this.onSelectedMissionChange.trigger();
        }
        getCurrent() {
            return this.theState.currentMission;
        }
        isCurrent(missionId) {
            return this.theState.currentMission === missionId;
        }
        checkPortal(event) {
            let updated = !1;
            this.theState.missions.forEach(mission => {
                const portal = mission.portals.find(x => x.guid === event.guid);
                portal && (portal.imageUrl === event.portalData.image && portal.title === event.portalData.title || (portal.imageUrl = event.portalData.image, 
                portal.title = event.portalData.title, updated = !0));
            }), updated && this.save();
        }
        checkAllPortals() {
            let updated = !1;
            this.theState.missions.forEach(mission => {
                mission.portals.forEach(portal => {
                    const iitcPortal = window.portals[portal.guid]?.options.data;
                    iitcPortal && (portal.imageUrl === iitcPortal.image && portal.title === iitcPortal.title || (portal.imageUrl = iitcPortal.image, 
                    portal.title = iitcPortal.title, updated = !0));
                });
            }), updated && this.save();
        }
        storeLayerState(layers) {
            this.theState.layers = layers.map(l => l.isVisible()), this.save();
        }
        restoreLayerState(layers) {
            this.theState.layers.forEach((vis, index) => layers[index].toggle(vis ?? !0));
        }
    }
    const Button_button = (label, click, classes) => $("<button>", {
        text: label,
        click,
        class: "umm-mission-btn " + (classes ?? "")
    }), dialogButton = (label, callback) => ({
        text: label,
        click: callback,
        class: "umm-dialog-button"
    }), dialogButtonClose = label => dialogButton(label ?? "Close", event => {
        $(event.currentTarget).parents(".ui-dialog").children(".ui-dialog-content").dialog("close");
    }), loadFile = async (state, inputFile) => {
        const text = await inputFile.text();
        try {
            state.import(text);
        } catch (error) {
            return notification(`Loadgin error: \n${error}`), !1;
        }
        return state.save(), notification(`Banner data loaded:\n${state.getBannerName()}`), 
        !0;
    }, title = "Ultimate Mission Maker EX", MissionNumberQuestions = [ "What number is this mission ?", "Which mission number is this ?", "What is the mission number ?", "Which number does this mission have ?", "What is this mission’s number ?", "Which mission index is this ?", "What is the index of this mission ?", "Which position does this mission have ?", "What is the position of this mission ?", "Which mission slot is this ?", "What number does this mission have in the banner ?", "Which banner number is this mission ?", "What is this mission’s banner position ?", "Which mission number is shown in the banner ?", "What number identifies this mission in the series ?", "Which number does this mission have in the sequence ?", "What is the mission’s number in the series ?", "Which mission position is this in the banner ?", "What number is assigned to this banner mission ?", "Which number marks this mission in the banner ?", "What mission number are you playing right now ?", "Which mission number are you currently on ?", "What number are you on in this banner ?", "Which mission number are you completing now ?", "What is the current mission number ?", "Which number is this step of the banner ?", "What number is this step in the mission series ?", "Which mission step number is this ?", "What is the step number of this mission ?", "Which number corresponds to this mission step ?", "Identify the mission number of this mission.", "Select the mission number for this mission.", "Determine this mission’s number.", "State the number of this mission.", "Indicate the index of this mission.", "Specify the position number of this mission.", "What ordinal number does this mission have ?", "Which ordinal position is this mission ?", "What numeric identifier does this mission have ?", "Which numeric index applies to this mission ?", "What is the mission number you are answering ?", "Which number corresponds to this exact mission ?", "What number is displayed for this mission ?", "Which mission number is written here ?", "What is the official number of this mission ?", "Which mission number was assigned here ?", "What number labels this mission ?", "Which number tags this mission ?", "What is the mission’s assigned number ?", "Which number marks this mission ?", "What is this mission’s index number ?", "Which index number is this mission ?", "What is the banner index of this mission ?", "Which banner index applies here ?", "What position number does this mission have ?", "Which position number is this mission ?", "What is the mission’s position number ?", "Which slot number is this mission ?", "What is this mission’s slot number ?", "Which slot position is this mission ?", "What number identifies this mission in the banner ?", "Which number identifies this mission in the banner ?", "What is the number assigned to this mission ?", "Which number is assigned to this mission ?", "What is this mission’s series number ?", "Which series number is this mission ?", "What is the banner series number of this mission ?", "Which banner series number is this mission ?", "What number corresponds to this banner entry ?", "Which number corresponds to this banner entry ?" ], NoobQuestions = [ {
        q: "What is the capital of France?",
        a: "Paris"
    }, {
        q: "What is the capital of Germany?",
        a: "Berlin"
    }, {
        q: "What is the capital of Italy?",
        a: "Rome"
    }, {
        q: "What is the capital of Spain?",
        a: "Madrid"
    }, {
        q: "What is the capital of the United Kingdom?",
        a: "London"
    }, {
        q: "What is the capital of Japan?",
        a: "Tokyo"
    }, {
        q: "What is the capital of China?",
        a: "Beijing"
    }, {
        q: "What is the capital of Australia?",
        a: "Canberra"
    }, {
        q: "What is the capital of Canada?",
        a: "Ottawa"
    }, {
        q: "What is the capital of Austria?",
        a: "Vienna"
    }, {
        q: "How many days are in a week?",
        a: "7"
    }, {
        q: "How many months are in a year?",
        a: "12"
    }, {
        q: "How many hours are in a day?",
        a: "24"
    }, {
        q: "How many minutes are in an hour?",
        a: "60"
    }, {
        q: "How many seconds are in a minute?",
        a: "60"
    }, {
        q: "How many continents are there?",
        a: "7"
    }, {
        q: "How many letters are in the English alphabet?",
        a: "26"
    }, {
        q: "What is 1 + 1?",
        a: "2"
    }, {
        q: "What is 2 + 2?",
        a: "4"
    }, {
        q: "What is 3 + 3?",
        a: "6"
    }, {
        q: "What is 4 + 4?",
        a: "8"
    }, {
        q: "What is 5 + 5?",
        a: "10"
    }, {
        q: "What is 10 - 5?",
        a: "5"
    }, {
        q: "What is 7 - 2?",
        a: "5"
    }, {
        q: "What is 6 + 1?",
        a: "7"
    }, {
        q: "What is 9 - 3?",
        a: "6"
    }, {
        q: "What animal says meow?",
        a: "Cat"
    }, {
        q: "What animal says woof?",
        a: "Dog"
    }, {
        q: "What animal says moo?",
        a: "Cow"
    }, {
        q: "What color is grass?",
        a: "Green"
    }, {
        q: "What color is snow?",
        a: "White"
    }, {
        q: "What color is coal?",
        a: "Black"
    }, {
        q: "What color is the sun?",
        a: "Yellow"
    }, {
        q: "Is the Earth round?",
        a: "Yes"
    }, {
        q: "Is fire hot?",
        a: "Yes"
    }, {
        q: "Is ice cold?",
        a: "Yes"
    }, {
        q: "Is the sky usually blue?",
        a: "Yes"
    }, {
        q: "Is water wet?",
        a: "Yes"
    }, {
        q: "Is the sun a star?",
        a: "Yes"
    }, {
        q: "Is the moon a satellite of Earth?",
        a: "Yes"
    }, {
        q: "What is the name of the blue faction in Ingress?",
        a: "Resistance"
    }, {
        q: "What is the name of the green faction in Ingress?",
        a: "Enlightened"
    }, {
        q: "What is Ingress energy called?",
        a: "XM"
    }, {
        q: "What is a basic item deployed on portals?",
        a: "Resonator"
    }, {
        q: "How many sides does a triangle have?",
        a: "3"
    }, {
        q: "How many sides does a square have?",
        a: "4"
    }, {
        q: "How many sides does a pentagon have?",
        a: "5"
    }, {
        q: "How many wheels does a car usually have?",
        a: "4"
    }, {
        q: "How many legs does a spider have?",
        a: "8"
    }, {
        q: "How many fingers does a human have?",
        a: "10"
    }, {
        q: "What planet do we live on?",
        a: "Earth"
    }, {
        q: "What star is at the center of our solar system?",
        a: "Sun"
    }, {
        q: "What is frozen water called?",
        a: "Ice"
    }, {
        q: "What is water vapor called?",
        a: "Steam"
    }, {
        q: "What is the opposite of hot?",
        a: "Cold"
    }, {
        q: "What is the opposite of big?",
        a: "Small"
    }, {
        q: "What is the opposite of day?",
        a: "Night"
    }, {
        q: "What comes after Monday?",
        a: "Tuesday"
    }, {
        q: "What comes after Tuesday?",
        a: "Wednesday"
    }, {
        q: "What comes after Wednesday?",
        a: "Thursday"
    }, {
        q: "What comes after Thursday?",
        a: "Friday"
    }, {
        q: "What comes after Friday?",
        a: "Saturday"
    }, {
        q: "What comes after Saturday?",
        a: "Sunday"
    }, {
        q: "Is 0 an even number?",
        a: "Yes"
    }, {
        q: "Is 2 an even number?",
        a: "Yes"
    }, {
        q: "Is 3 an odd number?",
        a: "Yes"
    }, {
        q: "Is 10 greater than 5?",
        a: "Yes"
    }, {
        q: "Is 1 less than 2?",
        a: "Yes"
    }, {
        q: "What is the first month of the year?",
        a: "January"
    }, {
        q: "What is the last month of the year?",
        a: "December"
    }, {
        q: "How many seasons are there?",
        a: "4"
    }, {
        q: "What season comes after spring?",
        a: "Summer"
    }, {
        q: "What season comes after summer?",
        a: "Autumn"
    }, {
        q: "What season comes after autumn?",
        a: "Winter"
    }, {
        q: "What color is the Resistance faction?",
        a: "Blue"
    }, {
        q: "What color is the Enlightened faction?",
        a: "Green"
    }, {
        q: "What does GPS stand for?",
        a: "Global Positioning System"
    }, {
        q: "What is the shape of the Earth?",
        a: "Round"
    }, {
        q: "What is the natural satellite of Earth called?",
        a: "Moon"
    }, {
        q: "What is the largest planet in the solar system?",
        a: "Jupiter"
    }, {
        q: "What is the closest star to Earth?",
        a: "Sun"
    }, {
        q: "What do you call frozen precipitation?",
        a: "Snow"
    }, {
        q: "What do you call liquid precipitation?",
        a: "Rain"
    }, {
        q: "What is the name of the blue faction?",
        m: "Resistance,Enlightened,Neutral,Shapers"
    }, {
        q: "What is the name of the green faction?",
        m: "Enlightened,Resistance,Neutral,Niantic"
    }, {
        q: "What is the energy in Ingress called?",
        m: "XM,AP,MU,HP"
    }, {
        q: "What is the basic portal item called?",
        m: "Resonator,Shield,Key,Mod"
    }, {
        q: "What item links two portals?",
        m: "Link,Field,Shield,Key"
    }, {
        q: "What item creates a field?",
        m: "Control Field,Link,Resonator,XMP"
    }, {
        q: "What device do you use to play Ingress?",
        m: "Scanner,Portal,Beacon,Drone"
    }, {
        q: "What is the maximum portal level?",
        m: "8,16,10,5"
    }, {
        q: "How many resonators can a portal have?",
        m: "8,4,6,10"
    }, {
        q: "What is the color of the Resistance?",
        m: "Blue,Green,Red,Yellow"
    }, {
        q: "What is the color of the Enlightened?",
        m: "Green,Blue,Red,Yellow"
    }, {
        q: "What is a neutral portal called?",
        m: "Neutral,Empty,Gray,Wild"
    }, {
        q: "What item removes enemy resonators?",
        m: "XMP Burster,Shield,Key,Resonator"
    }, {
        q: "What item removes links and fields?",
        m: "Ultra Strike,XMP Burster,Shield,Key"
    }, {
        q: "What item increases link range?",
        m: "Link Amp,Shield,Key,Resonator"
    }, {
        q: "What item increases portal defense?",
        m: "Shield,Link Amp,Key,Resonator"
    }, {
        q: "What do you deploy to increase portal level?",
        m: "Resonator,Shield,Key,Link"
    }, {
        q: "What do you use to recharge portals?",
        m: "Power Cube,Resonator,Shield,Link Amp"
    }, {
        q: "What is the maximum agent level?",
        m: "16,8,10,20"
    }, {
        q: "What does AP stand for?",
        m: "Action Points,Agent Power,Access Points,Action Portals"
    }, {
        q: "What does MU stand for?",
        m: "Mind Units,Map Units,Mission Units,Memory Units"
    }, {
        q: "What is the official Ingress map called?",
        m: "Intel,Scanner,Portal Map,XM Map"
    }, {
        q: "What is a portal key used for?",
        m: "Linking,Hacking,Recharging,Shielding"
    }, {
        q: "What is the Enlightened flip item?",
        m: "ADA Refactor,Jarvis Virus,XMP,Link Amp"
    }, {
        q: "What is the Resistance flip item?",
        m: "Jarvis Virus,ADA Refactor,XMP,Shield"
    }, {
        q: "What is a group of missions called?",
        m: "Banner,Cluster,Series,Pack"
    }, {
        q: "What do you call fields inside fields?",
        m: "Nested Fields,Double Links,Overlays,Stacked Links"
    }, {
        q: "What is the term for destroying a portal?",
        m: "Neutralizing,Capturing,Hacking,Linking"
    }, {
        q: "What is the term for capturing a portal?",
        m: "Capturing,Neutralizing,Linking,Fielding"
    }, {
        q: "What is the term for repeated hacking?",
        m: "Glyph Hacking,Power Hacking,Fast Hacking,Multi Hacking"
    }, {
        q: "What is the maximum resonator level?",
        m: "8,16,10,5"
    }, {
        q: "What is the lowest resonator level?",
        m: "1,0,2,3"
    }, {
        q: "What is the default neutral color?",
        m: "Gray,Blue,Green,Red"
    }, {
        q: "What is the color of Resistance fields?",
        m: "Blue,Green,Yellow,Red"
    }, {
        q: "What is the color of Enlightened fields?",
        m: "Green,Blue,Yellow,Red"
    }, {
        q: "What is a portal farm called?",
        m: "Farm,Cluster,Base,Hub"
    }, {
        q: "What is a dense portal area called?",
        m: "Cluster,Farm,Hub,Base"
    }, {
        q: "What item boosts hack output?",
        m: "Heat Sink,Multi-hack,Shield,Link Amp"
    }, {
        q: "What item boosts hack rarity?",
        m: "Multi-hack,Heat Sink,Shield,Resonator"
    }, {
        q: "What is a long-distance link called?",
        m: "Long Link,Ultra Link,Far Link,Wide Link"
    }, {
        q: "What is a portal with all resonators called?",
        m: "Full Portal,Complete Portal,Max Portal,Prime Portal"
    }, {
        q: "What is an empty portal called?",
        m: "Neutral Portal,Zero Portal,Empty Portal,Blank Portal"
    } ], about = () => {
        let html = '<div class="umm-options-list">';
        html += "In short: Create missions in IITC, export as a json file:<br>", html += '<a href="https://intel.ingress.com/" target="_blank"' + (/^intel\.ingress\.com$/i.test(window.location.host) ? ' style="color: #bbb; pointer-events: none; cursor: default;"' : "") + ">https://intel.ingress.com/</a>", 
        html += "Then open the mission creator and load the json file.<br>", html += "Start creating missions and import the UMM data for every mission:<br>", 
        html += '<a href="https://missions.ingress.com/" target="_blank"' + (/^missions\.ingress\.com$/i.test(window.location.host) ? ' style="color: #bbb; pointer-events: none; cursor: default;"' : "") + ">https://missions.ingress.com/</a>", 
        html += "Documentation for this plugin can be found at:<br>", html += '<a href="https://umm.8bitnoise.rocks/" target="_blank">https://umm.8bitnoise.rocks/</a>', 
        html += "Questions, feature requests and tips:<br>", html += '<a href="https://t.me/joinchat/j9T9eLfa3VJlZWE0" target="_blank">Telegram: [XF] Ultimate Mission Maker</a>', 
        html += "</div>";
        const buttons = [ dialogButton("< Main Menu", showUmmOptions), dialogButton("Changelog", () => dialog({
            title: "Changelog",
            html: miniMarkdown('# v1.1.1\n\n- fix: "edit" button was covering banner length in main dialog\n- dependencies update\n\n# v1.1\n\n- new "Mission Generator" dialog  \n  This new dialog provides several tools to modify current mission:\n  1. "Reset"  \n     Discard all current changes.\n  2. Add portals  \n     Adds nearby portals to the current mission.\n     You can:\n     - Limit selection using a DrawTools polygon\n     - Exclude individual portals with DrawTool Markers\n     - Restrict selection to portals within path hack range\n  3. Sort portals  \n     Attempts to arrange portals for the shortest possible path.\n     (Note: This is a complex optimization problem—results may vary.\n     The “keep end portal” option may occasionally fail.)\n  4. Change start  \n     Set the selected Portal as new mission start.\n     If no portal is selected, the start point will cycle through all mission portals.\n\n  All changes are temporary until "applied" or be "dismissed".  \n  Note: Distance calculations are based on straight-line (“as-the-crow-flies”) distances; real-world paths are not considered.\n\n- Use static layers  \n  UMM is now fully hidden when inactive. Background processing is also disabled while inactive.\n- Added Multi-Reverse  \n  Using the reverse action in the main dialog, you can now reverse an entire banner or selected parts of it—not just a single mission.\n- Drag: allow swapping mission portals\n- Fixed merge in main dialog\n- Fixed “Should merge?” prompt in split option (main dialog)\n- Mission-Select dialog moved to the left\n\n# v1.0.2\n\n- fix IITC-Button load\n  in iitc-button load order is differnet and custom "if UUM is loaded then disable it" failed\n- fix variable if both plugins are active\n\n# v1.0.1\n\n- fix mission number (index started by 0 instead of 1)\n\n# v1.0\n\nThis is a complete rewrite of the Ultimate Mission Maker from a developer perspective.\nThe entire codebase has been redesigned while maintaining the familiar user experience of the original UMM.\nBelow are the visible improvements and changes you\'ll notice.\n\n## What\'s Changed:\n\n- UMM is now hidden by default. You need to hit the "UMM" button in the Portal details window to make it appear.\n\n- **Select Mission Dialog** (open it through the toolbar or the main dialog)\n  - Selecting a mission is no longer required; simply open another mission\n  - Navigation buttons (+/-) allow you to cycle through missions\n  - Added split, clear, merge, and reverse commands for mission manipulation\n  - New mission information display: portal count and distances\n\n- **Banner Settins** (start window)\n  - changed Title placeholders to $T $M $N\n- **Option Dialog** (main window)\n  - Banner information now displays as a compact table\n  - Removed warning for mission counts that are not multiples of 6\n  - Added warning when missions lack sufficient waypoints\n\n- **Drag & Drop** in the mission editor path\n  - Move existing markers to adjust waypoints\n  - Add new waypoints by positioning intermediate markers at new locations\n  - Remove waypoints by double-clicking a marker\n  - Merge missions by dragging start and end markers together\n\n- **Mission Numbers**\n  - Potential split points are previewed while creating missions\n\n- **Waypoint edit**\n  - current mission is preselected\n  - passphrases: add random default questions.\n    when question & answer is empty a simple question will be set.\n\n- **Miscellaneous**\n  - Custom confirmation dialogs clarify actions and improve readability\n  - Switch between any missions, even those without portals\n  - Option to split missions when starting on a portal that\'s already assigned to another mission\n  - on mobile dialogs are not at the top instead of centered\n  - flash buttonbar on activation to draw attention\n\n---\n\n# History:\n\n## v1.0.beta.2 - 15.02.26\n\n- fixed update-URL in script header\n\n## v1.0.beta - 15.02.26\n\n- first public release\n- automated build process on GitHub\n- fixed layer checkboxes in Option-Dialog\n- add "clear" mission to selection dialog\n- always color selected mission even when not in Edit-Mode\n- move "no" to left in custom confirm dialog\n- remove doubled "v" in version numbers\n- fix toggeling edit mode on mission detail window "save" button\n- close dialog on mission detail window "save"\n- fix linebreaks in changelog dialog\n- select mission: directly select mission on combo-box change\n- fix question text in portal details\n- on mobile dialogs are not at the top instead of centered\n'),
            width: 500
        })), dialogButtonClose() ];
        window.dialog({
            html,
            title: `${title} v1.1.1 - About`,
            id: "umm-options",
            width: 350,
            buttons
        });
    }, miniMarkdown = incoming => incoming.replace(/^---/gm, "<hr>").replace(/^##\s(.*)\n*/gm, "<h3>$1</h3>").replace(/^#\s(.*)\n*/gm, "<h2>$1</h2>").replace(/\*\*(.*)\*\*/gm, "<b>$1</b>").replace(/\n/gm, "<br/>").replace(/(<\/h.>)<br>/gm, "$1").replace(/<br>(<h.>)/gm, "$1"), isMobile = () => "undefined" != typeof android && !!android, hasDrawTools = () => !!window.plugin.drawTools, getDTPolygons = () => {
        const DT = window.plugin.drawTools;
        return DT ? Object.values(DT.drawnItems._layers).filter(layer => layer instanceof L.GeodesicPolygon).map(polygon => polygon.getLatLngs()) : [];
    }, getDTMarkerLocations = () => {
        const DT = window.plugin.drawTools;
        return DT ? Object.values(DT.drawnItems._layers).filter(layer => layer instanceof L.Marker).map(marker => marker.getLatLng()) : [];
    }, isInPolygon = (polygon, point) => {
        if (polygon.some(p => point.equals(p))) return !0;
        let c = !1;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) polygon[i].lat > point.lat != polygon[j].lat > point.lat && point.lng < polygon[i].lng + (polygon[j].lng - polygon[i].lng) * (point.lat - polygon[i].lat) / (polygon[j].lat - polygon[i].lat) && (c = !c);
        return c;
    }, closedPoint = (a, b, x) => {
        const dx = b.lat - a.lat, dy = b.lng - a.lng, d = dx * dx + dy * dy;
        if (0 === d) return a;
        let r = (dx * x.lat + dy * x.lng - (dx * a.lat + dy * a.lng)) / d;
        return r < 0 && (r = 0), r > 1 && (r = 1), L.latLng(a.lat + r * dx, a.lng + r * dy);
    }, distance2 = (a, b) => {
        const dx = b.lat - a.lat, dy = b.lng - a.lng;
        return dx * dx + dy * dy;
    };
    class Ant {
        route=[];
        notVisited=[];
        length=1 / 0;
        init(portals, useStart) {
            this.notVisited = [ ...portals ], this.length = 0, this.pickStart(useStart);
        }
        clone() {
            const newAnt = new Ant;
            return newAnt.route = [ ...this.route ], newAnt.length = this.length, newAnt.notVisited = [ ...this.notVisited ], 
            newAnt;
        }
        pickStart(index) {
            this.route = this.notVisited.splice(index, 1);
        }
        walk() {
            const start = this.route.at(-1);
            let current = start;
            for (;this.notVisited.length > 0; ) {
                const nextIndex = this.getNextNode(current, this.notVisited), next = this.notVisited.splice(nextIndex, 1)[0];
                this.route.push(next), this.addNode(current, next), current = next;
            }
            this.length += this.getDistance(current, start);
        }
        addNode(current, next) {
            this.length += this.getDistance(current, next);
        }
        getNextNode(current, portals) {
            portals.length, portals.some(p => p.guid === current.guid);
            const sum = portals.reduce((sum, p) => sum + this.getEdgeProbability(current, p), 0);
            let rand = Math.random() * sum, index = -1;
            do {
                index++, rand -= this.getEdgeProbability(current, portals[index]);
            } while (rand > 0);
            return index;
        }
        getEdgeProbability(p1, p2) {
            const edge = p1.edges.get(p2.guid);
            return Math.pow(edge.tau, 1) * Math.pow(edge.n, 5);
        }
        getDistance(p1, p2) {
            return p1.edges.get(p2.guid).distance;
        }
        optimize() {
            for (let i = 2; i < this.route.length; i++) {
                const p1 = this.route[i - 2], p2 = this.route[i - 1], p3 = this.route[i], p4 = this.route[(i + 1) % this.route.length], d1 = this.getDistance(p1, p2) + this.getDistance(p3, p4), d2 = this.getDistance(p1, p3) + this.getDistance(p2, p4);
                d1 > d2 && (this.route[i - 1] = p3, this.route[i] = p2, this.length += d2 - d1);
            }
        }
    }
    class PortalNode {
        edges;
        lambdaFactor=0;
        portal;
        forcedNext;
        constructor(portal, portals, TAU_0) {
            this.portal = portal, this.edges = new Map, portals.forEach(p2 => {
                if (portal.guid !== p2.guid) {
                    const distance = this.distanceTo(p2);
                    this.edges.set(p2.guid, {
                        distance,
                        n: 1 / distance,
                        tau: TAU_0
                    });
                }
            });
        }
        get guid() {
            return this.portal.guid;
        }
        distanceTo(other) {
            const a = L.latLng(this.portal.location.latitude, this.portal.location.longitude), b = L.latLng(other.location.latitude, other.location.longitude);
            return a.distanceTo(b);
        }
    }
    class TSP {
        nodes=[];
        route=[];
        length=1 / 0;
        best;
        useGlobalBest=10;
        generation=0;
        antType;
        constructor(type) {
            this.antType = type;
        }
        init(portals) {
            this.nodes = portals.map(p => new PortalNode(p, portals, 1)), this.length = 1 / 0, 
            this.useGlobalBest = 10, this.generation = 0;
        }
        setStartEnd(start, end) {
            const startNode = this.nodes.find(n => n.guid === start), endNode = this.nodes.find(n => n.guid === end);
            if (!startNode || !endNode) throw new Error("Start or end portal not found");
            this.nodes.forEach(portal => {
                if (portal.guid !== startNode.guid) {
                    const edge = portal.edges.get(startNode.guid);
                    edge.n = 1e-16, edge.distance = 1 / 0;
                }
            }), endNode.edges.get(startNode.guid).n = 1e16, endNode.edges.get(startNode.guid).distance = 0, 
            startNode.edges.get(endNode.guid).n = 1e-16;
        }
        solve(generations, maxTime) {
            this.length = 1 / 0;
            const startTime = Date.now();
            for (;generations > 0 && (this.step(), !(Date.now() - startTime > maxTime)); generations--) ;
        }
        step() {
            this.generation++;
            const ants = this.createAntPath(), bestAnt = ants.reduce((best, ant) => best.length < ant.length ? best : ant, ants[0]);
            bestAnt.optimize(), bestAnt.length < this.length && (this.route = [ ...bestAnt.route ], 
            this.length = bestAnt.length, this.best = bestAnt.clone()), this.updatePheromons(bestAnt);
        }
        createAntPath() {
            if (this.nodes.length < 160) {
                const countOfAnts = this.nodes.length;
                return Array.from({
                    length: countOfAnts
                }).map((_, index) => {
                    const ant = new this.antType;
                    return ant.init(this.nodes, index), ant.walk(), ant;
                });
            }
            return this.sample(this.nodes.length, 160).map(index => {
                const ant = new this.antType;
                return ant.init(this.nodes, index), ant.walk(), ant;
            });
        }
        sample(max, count) {
            const numbers = Array.from({
                length: max
            }).map((_, index) => index);
            if (count > max) return numbers;
            const results = [];
            let length = numbers.length;
            for (;count > 0; count--) {
                const index = Math.floor(Math.random() * length);
                results.push(numbers[index]), length--, numbers[index] = numbers[length];
            }
            return results;
        }
        updatePheromons(bestAnt) {
            this.nodes.forEach(n => {
                n.edges.forEach(edge => edge.tau = .8 * edge.tau);
            }), this.useGlobalBest-- < 0 ? (this.useGlobalBest = 10, this.addPheromons(this.route, this.length)) : this.addPheromons(bestAnt.route, bestAnt.length);
            const tau_max = 1 / ((1 - .8) * this.length), avg = this.nodes.length / 2, p = Math.pow(.05, 1 / this.nodes.length), tau_min = Math.min(tau_max, tau_max * (1 - p) / ((avg - 1) * p));
            this.nodes.forEach(n => {
                n.edges.forEach(edge => {
                    edge.tau < tau_min && (edge.tau = tau_min), edge.tau > tau_max && (edge.tau = tau_max);
                });
            });
        }
        addPheromons(route, length) {
            const delta = 1 / length;
            for (let i = 0; i < route.length; i++) {
                const current = route[i], next = route[(i + 1) % route.length], currentEdge = current.edges.get(next.guid), nextEdge = next.edges.get(current.portal.guid);
                currentEdge.tau = currentEdge.tau * delta, nextEdge.tau = currentEdge.tau * delta;
            }
        }
        routeChangeStart(id) {
            const index = this.route.findIndex(p => p.guid === id);
            this.route = [ ...this.route.slice(index), ...this.route.slice(0, index) ];
        }
        routeReverse() {
            this.route.reverse(), this.route = [ ...this.route.slice(-1), ...this.route.slice(0, -1) ];
        }
        getLambdaFactor(lambda) {
            let sum = 0;
            return this.nodes.forEach(p => {
                const taus = [ ...p.edges.values() ].map(n => n.tau), rmin = Math.min(...taus), rmax = Math.max(...taus), l = rmin + lambda * (rmax - rmin);
                p.lambdaFactor = taus.reduce((count, r) => r > l ? count + 1 : count, 0), sum += p.lambdaFactor;
            }), sum / this.nodes.length;
        }
    }
    const Checkbox_checkbox = (id, label, checked) => $("<div>", {
        class: "form-control"
    }).append($("<label>", {
        class: "cursor-pointer label"
    }).append($("<input>", {
        type: "checkbox",
        id,
        checked,
        class: "checkbox"
    }), $("<span>", {
        class: "label-text",
        text: label
    })));
    let currentMission, currentPortals, Generator_dialog, Generator_layer;
    const showMissionGenerator = () => {
        initCurrentPortals();
        const html = $("<div>", {
            class: "umm-generator"
        }).append($("<p>").append("Portals: ", $("<b>", {
            id: "count"
        }), $("<br>"), "Length: ", $("<b>", {
            id: "length"
        })), Button_button("Reset", resetPortals, "w-full"), Button_button("Add Portal", addPortal, "w-full"), Checkbox_checkbox("AP_hackrange", "Only in Hackrange", !1), Checkbox_checkbox("AP_inpoly", "Only in Drawtool polygon", !0).toggle(hasDrawTools()), Checkbox_checkbox("AP_skipportals", "Skip Drawtool markers", !0).toggle(hasDrawTools()), Checkbox_checkbox("AP_sort", "Sort after add", !1), Button_button("Sort Portals", sortPortals, "w-full"), Checkbox_checkbox("SP_startend", "Keep End Portal", hasNextMissionPortals()), Checkbox_checkbox("SP_moresorttime", "Take more time to sort", !1), Button_button("Change start", changeStartPortal, "w-full")), position = isMobile() ? {
            my: "center top",
            at: "center top"
        } : {
            my: "left bottom",
            at: "left+64px center"
        };
        Generator_dialog = window.dialog({
            html,
            title: `${title} v1.1.1`,
            id: "umm-options_generator",
            width: 350,
            position,
            closeCallback: () => destroy(),
            buttons: [ dialogButton("Apply", () => {
                applyPortals(), Generator_dialog.dialog("close");
            }), dialogButtonClose("Dismiss") ]
        }), updatePreview(!1);
    }, initCurrentPortals = () => {
        if (currentMission = main.state.getEditMission(), !currentMission) return notification("No active mission"), 
        void (currentPortals = new Portals(void 0, []));
        currentPortals = currentMission.portals.cloneWithoutEvents();
    }, hasNextMissionPortals = () => {
        const nextMission = main.state.missions.get(currentMission.id + 1);
        return (nextMission?.portals.length ?? 0) > 0;
    }, resetPortals = () => {
        initCurrentPortals(), Generator_layer && Generator_layer.clearLayers(), updatePreview(!1);
    }, applyPortals = () => {
        currentMission && (currentMission.portals.clear(), currentMission.portals.add(...currentPortals.getRange()), 
        currentMission.show(), resetPortals());
    }, addPortal = () => {
        if (0 === currentPortals.length) return void notification("Need at least one start portal");
        const possiblePortals = ((useDrawTool = !1, skipMarkers) => {
            let allPortals = Object.values(window.portals);
            if (useDrawTool) {
                const polygons = getDTPolygons();
                polygons.length > 0 && (allPortals = allPortals.filter(p => polygons.some(polygon => isInPolygon(polygon, p.getLatLng()))));
            }
            if (skipMarkers) {
                const skipLocations = getDTMarkerLocations();
                skipLocations.length > 0 && (allPortals = allPortals.filter(p => skipLocations.every(loc => !loc.equals(p.getLatLng()))));
            }
            return allPortals;
        })($("#AP_inpoly", Generator_dialog).is(":checked"), $("#AP_skipportals", Generator_dialog).is(":checked")), distances = portalDistances(possiblePortals, currentPortals);
        if (0 === distances.length) return void notification("No more portals available");
        const closePortal = distances.reduce((previous, current) => previous.distance < current.distance ? previous : current, distances[0]);
        $("#AP_hackrange", Generator_dialog).is(":checked") && closePortal.distance > HACK_RANGE ? notification("No more portals in Hack range") : (currentPortals.insert(closePortal.index + 1, currentPortals.create(closePortal.guid)), 
        updatePreview(), $("#AP_sort", Generator_dialog).is(":checked") && sortPortals());
    }, portalDistances = (incomginPortals, portals) => {
        const latLngs = portals.toLatLng();
        if (latLngs.length, 0 === latLngs.length) return [];
        return incomginPortals.filter(p => !portals.includes(p.options.guid)).map(portal => {
            const position = portal.getLatLng(), closestPoint = ((path, location) => {
                if (0 === path.length) return {
                    distance: 1 / 0,
                    index: -1
                };
                if (1 === path.length) return {
                    distance: location.distanceTo(path[0]),
                    index: 0
                };
                let index = 0, bestPoint = path[0], minDistance = 1 / 0;
                for (let i = 0; i < path.length - 1; i++) {
                    const closestPoint = closedPoint(path[i], path[i + 1], location), distance = distance2(location, closestPoint);
                    distance < minDistance && (minDistance = distance, index = i, bestPoint = closestPoint);
                }
                return {
                    distance: location.distanceTo(bestPoint),
                    index
                };
            })(latLngs, position);
            return {
                guid: portal.options.guid,
                distance: closestPoint.distance,
                index: closestPoint.index
            };
        });
    }, sortPortals = () => {
        if (0 === currentPortals.length) return;
        const keep_end = $("#SP_startend", Generator_dialog).is(":checked"), moreTime = $("#SP_moresorttime", Generator_dialog).is(":checked"), start = currentPortals.get(0).guid, end = currentPortals.get(currentPortals.length - 1).guid, solver = new TSP(Ant);
        solver.init(currentPortals.getRange()), keep_end && solver.setStartEnd(start, end), 
        solver.solve(100, moreTime ? 1e3 : 500), solver.routeChangeStart(start), solver.route[0].guid, 
        solver.route.at(-1).guid, currentPortals.clear();
        const newportals = solver.route.map(p => p.portal);
        currentPortals.add(...newportals), updatePreview();
    }, changeStartPortal = () => {
        let newStart = currentPortals.indexOf(selectedPortal);
        for (-1 === newStart && (newStart = 1); newStart > 0; ) {
            const portal = currentPortals.get(0);
            currentPortals.remove(0), currentPortals.add(portal), newStart--;
        }
        updatePreview();
    }, updatePreview = (withPath = !0) => {
        if ($("#count", Generator_dialog).text(currentPortals.length), $("#length", Generator_dialog).text(formatDistance(currentPortals.getDistance())), 
        withPath) {
            Generator_layer ??= L.layerGroup().addTo(window.map), Generator_layer.clearLayers();
            const latLngs = currentPortals.toLatLng(), polyline = L.geodesicPolyline(latLngs, {
                color: "#c52e23",
                weight: 5,
                opacity: .8,
                dashArray: "8,8",
                interactive: !1
            });
            Generator_layer.addLayer(polyline), latLngs.forEach((latLng, index) => {
                const options = {
                    color: "#c52e23",
                    radius: 0 === index ? 10 : 5,
                    weight: 5,
                    interactive: !1
                }, portal = L.circleMarker(latLng, options);
                Generator_layer.addLayer(portal);
            });
        }
    }, destroy = () => {
        Generator_layer && (window.map.removeLayer(Generator_layer), Generator_layer.clearLayers(), 
        Generator_layer = void 0);
    }, editActiveMission = () => {
        const html = $("<div>", {
            class: "umm-mission-picker-btn"
        }).append("Select a mission number:<br>", Button_button("<", onPreviousMission).css({
            "margin-right": 0
        }), $("<select>", {
            id: "umm-mission-picker",
            class: "umm-mission-picker",
            change: onMissionSelect
        }), Button_button(">", onNextMission), $("<div>").append(Button_button("Edit", onStartEdit), Button_button("Zoom to mission", onZoomToMission).css({
            "margin-left": "1em"
        })), $("<div>", {
            id: "umm-mission-picker-info"
        }), Button_button("Split", onMissionSplit), Button_button("Clear", onMissionClear), Button_button("Reverse", onMissionReverse), $("<br>"), Button_button("Merge with previous", onMergePrevious), Button_button("Merge next into this", onMergePost)), position = isMobile() ? {
            my: "center top",
            at: "center top"
        } : {
            my: "left bottom",
            at: "left+64px center"
        };
        window.dialog({
            html,
            title: `${title} v1.1.1`,
            id: "umm-options",
            width: 350,
            position,
            buttons: [ dialogButton("< Main Menu", showUmmOptions), dialogButtonClose() ],
            closeCallback: SelectMission_destroy
        }), main.state.onSelectedMissionChange.do(updateSelection), main.state.onMissionPortal.do(updateMissionInfo), 
        updateMissionList(), updateMissionInfo();
    }, SelectMission_destroy = () => {
        main.state.onSelectedMissionChange.dont(updateSelection);
    }, getSelectedMission = () => {
        const missionNumber = parseInt($("#umm-mission-picker").val());
        return main.state.missions.get(missionNumber);
    }, updateMissionList = () => {
        const select = $("#umm-mission-picker").empty(), state = main.state;
        state.missions.forEach(mission => {
            select.append($("<option>", {
                value: mission.id,
                selected: state.isCurrent(mission.id),
                text: `${mission.id + 1} - waypoints ${mission.portals.length}`
            }));
        });
    }, updateSelection = () => {
        const current = main.state.getCurrent();
        $("#umm-mission-picker").val(current), updateMissionInfo();
    }, updateMissionInfo = () => {
        const info = $("#umm-mission-picker-info");
        info.empty();
        const mission = getSelectedMission();
        if (!mission) return;
        const missionLength = window.formatDistance(mission.getDistance()), distanceToStart = main.state.missions.distanceToStart(mission.id), distanceToNext = main.state.missions.distanceToStart(mission.id + 1), table = `\n    Wapoints:\t${mission.portals.length}\n\n    Length:\t${missionLength}\n\n    to Start:\t${(distanceToStart && window.formatDistance(distanceToStart)) ?? "---"}\n\n    to Next:\t${(distanceToNext && window.formatDistance(distanceToNext)) ?? "---"}\n`;
        info.html(window.convertTextToTableMagic(table));
    }, refreshMissionUI = () => {
        updateMissionInfo(), updateMissionList();
    }, onPreviousMission = () => {
        const mission = main.state.getCurrent();
        mission > 0 && setCurrentMission(mission - 1);
    }, onNextMission = () => {
        const mission = main.state.getCurrent();
        mission < main.state.getPlannedLength() - 1 && setCurrentMission(mission + 1);
    }, onMissionSelect = () => {
        const mission = getSelectedMission();
        mission && !main.state.isCurrent(mission.id) ? setCurrentMission(mission.id) : notification("Active mission not changed.");
    }, onStartEdit = () => {
        main.missionModeActive || toggleMissionMode(), renderPortalDetails(null), startEdit(), 
        $("#dialog-umm-options").dialog("close");
    }, onZoomToMission = () => {
        const mission = getSelectedMission();
        mission ? mission.show() : notification("Can't zoom in on this mission. No portals.");
    }, onMissionSplit = async () => {
        const missions = main.state.missions, mission = getSelectedMission();
        if (!mission) return;
        let next = missions.next(mission);
        for (;0 === next?.portals.length; ) next = missions.next(next);
        const endMissionId = next?.id ?? main.state.getPlannedLength();
        let count = parseInt(prompt("Split inhow many missions should be divided among?", (endMissionId - mission.id).toString()) ?? "0");
        if (count < 2) return;
        count = Math.min(count, main.state.getPlannedLength() - mission.id);
        let mustMerge = !1;
        for (let i = 1; i < count; i++) {
            const current = missions.get(mission.id + i);
            current?.portals.length > 0 && (mustMerge = !0);
        }
        mustMerge && !await confirmDialog({
            message: "Merge missione before split?",
            details: "Mission(s) already contain portals. These will be merged into one"
        }) || (missions.splitIntoMultiple(mission, count), main.state.save(), refreshMissionUI());
    }, onMergePrevious = () => {
        const missions = main.state.missions, mission = getSelectedMission();
        if (!mission) return;
        let previous = missions.previous(mission);
        if (!previous) {
            if (0 === mission.id) return;
            previous = missions.get(0);
        }
        main.state.missions.merge(previous, mission), main.state.save(), refreshMissionUI();
    }, onMergePost = () => {
        const missions = main.state.missions, mission = getSelectedMission();
        if (!mission) return;
        let next = missions.next(mission);
        for (;0 === next?.portals.length; ) next = missions.next(next);
        next && (main.state.missions.merge(mission, next), main.state.save(), refreshMissionUI());
    }, onMissionReverse = () => {
        const mission = getSelectedMission();
        mission && (mission.reverse(), main.state.save(), refreshMissionUI());
    }, onMissionClear = async () => {
        const mission = getSelectedMission();
        mission && await confirmDialog({
            message: "This will remove all portals"
        }) && (mission.clear(), main.state.save(), refreshMissionUI());
    }, lable = lable => $("<td>", {
        text: lable
    }), stat = id => $("<td>").append($("<span>", {
        class: "stat",
        id
    })), showUmmOptions = () => {
        const state = main.state, html = $("<div>", {
            class: "umm-options-list"
        }).append($("<p>", {
            class: "banner_info"
        }).append($("<div>", {
            class: "title",
            id: "umm_opt_bannername"
        }), $("<div>", {
            class: "description",
            id: "umm_opt_bannerdesc"
        }), "<table><tr>", lable("Title format"), stat("umm_opt_bannerformat").append($("<span>", {
            text: "(?)",
            class: "um-helpTooltip",
            title: "Title format allows:\n$N = Mission number\n$M = Planned banner length\n$T = Banner title"
        })), $("<td>").css({
            width: "2em"
        }), lable("Missions"), stat("umm_opt_bannerlength"), "</tr><tr>", lable("Waypoints"), stat("umm_opt_waypoints"), $("<td>"), lable("Length"), stat("umm_opt_bannerdistance"), "</tr></table>", $("<div>", {
            id: "umm_opt_error"
        }), Button_button("Edit", () => editMissionSetDetails(), "editButtom")), $("<p>").append(Button_button("Change active mission #", editActiveMission, "w-full"), Button_button("Zoom to view all missions", () => state.missions.zoom(), "w-full")), $("<hr>"), Button_button("Generate mission", showMissionGenerator, "w-full"), Button_button("Split mission", splitMissionOptions, "w-full"), Button_button("Merge missions", mergeMissions, "w-full"), Button_button("Reverse missions", reverseMission, "w-full"), Button_button("Clear ALL missions data", confirmClear, "w-full"), $("<hr>"), $("<b>", {
            text: "Import/Export"
        }), $("<br>"), Button_button("Export banner data to file", () => (state => {
            const data = state.asString(), filename = state.getBannerName().replace(/[\W_]+/g, " ") + "-mission-data.json";
            if ("function" == typeof window.saveFile) window.saveFile(data, filename, "application/json"); else if ("undefined" != typeof android && android?.saveFile) android.saveFile(filename, "application/json", data); else if (!window.isSmartphone()) {
                const a = document.createElement("a");
                a.href = "data:text/json;charset=utf-8," + encodeURIComponent(data), a.download = filename, 
                a.click();
            }
        })(main.state), "w-full"), $("<div>").css({
            width: 800,
            margin: "auto"
        }).append("<b>Import banner data from file:</b><br>", $("<input>", {
            type: "file",
            change: confirmLoad
        })));
        let position;
        "undefined" != typeof android && android && (position = {
            my: "center top",
            at: "center top"
        }), window.dialog({
            html,
            title: `${title} v1.1.1`,
            id: "umm-options",
            width: 350,
            position,
            buttons: [ dialogButton("About this plugin", about), dialogButtonClose() ],
            closeCallback: () => Options_destroy()
        }), main.state.onMissionChange.do(updateDialog), updateDialog();
    }, Options_destroy = () => {
        main.state.onMissionChange.dont(updateDialog);
    }, updateDialog = () => {
        const state = main.state;
        $("#umm_opt_bannername").text(state.getBannerName() ?? "N/A"), $("#umm_opt_bannerdesc").text(state.getBannerDesc() ?? "N/A"), 
        $("#umm_opt_bannerformat").text(state.getTitleFormat() ?? "N/A"), $("#umm_opt_bannerlength").text(state.getPlannedLength().toString()), 
        $("#umm_opt_waypoints").text(state.missions.getWaypointCount().toString()), $("#umm_opt_bannerdistance").text(window.formatDistance(state.missions.getTotalDistance())), 
        $("#umm_opt_error").empty().append(validateMissions(state));
    }, validateMissions = state => {
        const invalidMissions = state.missions.validate(), result = [];
        for (const error in invalidMissions) {
            const numbers = invalidMissions[error].map(n => n + 1).join(", ");
            result.push(`<span class="error">${error}:</span></br>Mission: ${numbers}`);
        }
        return result.join("<br>");
    }, confirmClear = async () => {
        await confirmDialog({
            message: "Clear all Mission data?",
            details: "Removes mission settings and waypoints. This action cannot be undone."
        }) && clearMissionData();
    }, confirmLoad = async event => {
        (main.state.isEmpty() || await confirmDialog({
            message: "Overwrite current data?",
            details: "All current missions will be replaced by the imported data."
        })) && (await (async (event, state) => {
            const files = event.target.files;
            return 1 !== files?.length ? (alert("No file selected! Please select a mission file in JSON format and try again."), 
            $("#umm-import-file").val(""), !1) : "application/json" != files[0].type ? ($("#umm-import-file").val(""), 
            alert(files[0].name + " has not been recognized as JSON file. Make sure you've loaded the right file."), 
            !1) : loadFile(state, files[0]);
        })(event, main.state), main.state.checkAllPortals(), main.state.missions.zoom());
    }, editMissionSetDetails = (toggleMissionModeAfterSave = !1) => {
        const state = main.state;
        let html = '<div class="umm-edit-mission-set-details">';
        html += "<b>Banner details</b>", html += "<p>Please enter the details for your banner. All fields are required.</p><br>", 
        html += `<label for="umm-mission-set-name"><b>Banner name</b> (max. 50 characters)</label>\n      <span class="umm-error" id="umm-mission-set-name-error"><b>Error: </b>Please enter a valid banner name</span>\n      <input id="umm-mission-set-name" name="umm-mission-set-name" type="text" placeholder="Enter name for the banner" maxlength="50" value="${state.getBannerName()}">`, 
        html += `<label for="umm-mission-set-description"><b>Banner description</b> (max. 200 characters)</label>\n      <span class="umm-error" id="umm-mission-set-description-error"><b>Error: </b>Please enter a valid banner description</span>\n      <textarea id="umm-mission-set-description" name="umm-mission-set-description" placeholder="Enter description for the banner" maxlength="200" rows="5">${state.getBannerDesc()}</textarea>`, 
        html += `<label for="umm-banner-length"><b>Planned banner length</b>, min. ${Math.max(state.missions.count(), 1)} mission(s)</label>\n      <span class="umm-error" id="umm-mission-planned-banner-length-error"><b>Error: </b>Please enter a valid banner length</span>\n      <input id="umm-banner-length" name="umm-banner-length" type="number" placeholder="Enter length of banner set" min="1" value="${Math.max(state.getPlannedLength(), 1)}">`, 
        html += `<label for="umm-title-format"><b>Title format</b></label>\n      <span class="umm-error" id="umm-mission-title-format-error"><b>Error: </b>Please enter a valid title-format</span>\n      <table>\n      <tr><td>$T = Mission title</td><td>additional flags:</td></tr>\n      <tr><td>$N = Current Missione number</td><td>$0n = with leading zeros</td></tr>\n      <tr><td>$M = Banner length</td><td>$3n = minimum length</td></tr>\n      </table>\n      <br><br>Examples: "$T $N / $M" or "$0n.$m $t"  or "$T $03N-$03M" </p>\n      <input id="umm-title-format" name="umm-title-format" type="text" placeholder="Enter a title format" value="${state.getTitleFormat() ?? "$T $N / $M"}" style="margin-bottom: 5px;">\n      <b>Preview: </b><span id="umm-mission-title-preview"></span>`, 
        html += "</div>", window.dialog({
            html,
            title: "Edit banner details - UMM v1.1.1",
            id: "umm-options",
            width: 400,
            buttons: [ dialogButton("< Main Menu", showUmmOptions), dialogButton("Save", () => successfulSave(toggleMissionModeAfterSave)), dialogButtonClose() ]
        }), updateMissionTitlePreview(), $("#umm-mission-set-name, #umm-mission-set-description, #umm-banner-length, #umm-title-format").on("input", updateMissionTitlePreview);
    }, getFormValues = () => ({
        name: $("#umm-mission-set-name").val(),
        description: $("#umm-mission-set-description").val(),
        length: $("#umm-banner-length").val(),
        format: $("#umm-title-format").val()
    }), successfulSave = toggleMissionModeAfterSave => {
        const values = getFormValues();
        saveMissionSetDetails(values.name, values.description, values.length, values.format) && (bannerNotification(main.state, "Mission details saved"), 
        toggleMissionModeAfterSave && toggleMissionMode(), $("#dialog-umm-options").dialog("close"));
    }, updateMissionTitlePreview = () => {
        const values = getFormValues(), plannedLength = parseInt(values.length);
        if (values.name.length > 0 && values.format.length > 0 && !isNaN(plannedLength)) {
            const missionTitle = Missions.generateMissionTitle(values.format, {
                misison: 1,
                title: values.name,
                total: plannedLength
            });
            $("#umm-mission-title-preview").text(missionTitle);
        } else $("#umm-mission-title-preview").text("Fill in all required fields");
    }, setFieldError = (elementId, hasError) => {
        $(elementId).css("display", hasError ? "block" : "none");
    }, saveMissionSetDetails = (missionSetName, missionSetDescription, plannedBannerLength, titleFormat) => {
        let isValid = !0;
        const hasName = missionSetName && missionSetName.length > 0;
        hasName && main.state.setBannerName(missionSetName), setFieldError("#umm-mission-set-name-error", !hasName), 
        isValid = isValid && !!hasName;
        const hasDescription = missionSetDescription && missionSetDescription.length > 0;
        hasDescription && main.state.setBannerDesc(missionSetDescription), setFieldError("#umm-mission-set-description-error", !hasDescription), 
        isValid = isValid && !!hasDescription;
        const plannedLength = parseInt(plannedBannerLength ?? ""), hasValidLength = plannedLength && !isNaN(plannedLength);
        hasValidLength && main.state.setPlannedLength(plannedLength), setFieldError("#umm-mission-planned-banner-length-error", !hasValidLength), 
        isValid = isValid && !!hasValidLength;
        const hasFormat = titleFormat && titleFormat.length > 0;
        return hasFormat && main.state.setTitleFormat(titleFormat), setFieldError("#umm-mission-title-format-error", !hasFormat), 
        isValid = isValid && !!hasFormat, isValid && main.state.save(), isValid;
    };
    let lastPortal;
    const clearMissionData = () => {
        main.state.reset(), main.state.save(), main.missionModeActive && toggleMissionMode();
    }, removeLastPortal = () => {
        if (!main.missionModeActive) return void notification("Only valid in edit mode");
        const mission = main.state.getEditMission();
        mission && mission.portals.length > 0 ? (lastPortal = void 0, mission.portals.remove(mission.portals.length - 1), 
        main.state.save(), mission.focusLastPortal() || (renderPortalDetails(null), notification(`${main.state.getBannerName()}\nNo portals left in mission.\nSelect start portal`))) : mission && mission.id > 0 ? (setCurrentMission(mission.id - 1), 
        main.state.save(), main.state.getEditMission()?.focusLastPortal(), notification(`${main.state.getBannerName()}\nLast mission removed\nSwitched to previous mission ${mission.id + 2}\n`)) : notification(`${main.state.getBannerName()}\nCan't undo\nAlready on last mission\n`);
    }, toggleMissionMode = () => {
        if (main.missionModeActive) main.missionModeActive = !1, $("#umm-toggle-bookmarks").css("background-color", ""); else {
            if (!main.state.isValid()) return editMissionSetDetails(!0), void notification("Mission mode inactive\nPlease enter mission data\nAnd try again.");
            main.missionModeActive = !0, startEdit(), $("#umm-toggle-bookmarks").css("background-color", "crimson");
        }
        main.renderPath.redraw();
    }, startEdit = () => {
        const editMission = main.state.getEditMission(), missionNumber = main.state.getCurrent() + 1;
        editMission?.hasPortals() ? (editMission.show(), lastPortal = editMission.portals.get(-1).guid, 
        window.renderPortalDetails(lastPortal), bannerNotification(main.state, `Mission mode active.\nResuming mission #${missionNumber}\nSelect next portal`)) : (lastPortal = void 0, 
        bannerNotification(main.state, `Mission mode active.\nSelect start portal for mission #${missionNumber}`));
    }, splitMissionOptions = () => {
        const buttons = [ dialogButton("< Main Menu", showUmmOptions), dialogButton("Remainder at end", () => splitMissionStart(!0)), dialogButton("Balanced", () => splitMissionStart(!1)) ];
        window.dialog({
            html: "<b>How do you want to split your mission?</b><br><br>\n      <b>Remainder at the end:</b> All missions will contain the same amount of portals, any portals left over after splitting are added to the last mission.<br><br>\n      <b>Balanced:</b> Split the banner into missions of the same length, if any portals are left over after splitting, earlier missions will get 1 portal extra to balance it out.\n      ",
            title: `${title} - Split mission options`,
            id: "umm-options",
            width: 350,
            buttons
        });
    }, splitMissionStart = remainderAtEnd => {
        const portalsCount = main.state.missions.get(0)?.portals.length ?? 0, preset = Math.min(main.state.getPlannedLength(), portalsCount), numMissionString = prompt(`In how many missions do you want to split your banner (1-${portalsCount})?\r\rRecommended number is a multiple of 6.`, preset.toString());
        if (null === numMissionString) return;
        const numMissions = parseInt(numMissionString);
        numMissions > portalsCount ? alert(`Can't split into more missions than there are portals in your current path. Please try again with a number between 1 and ${portalsCount}`) : numMissions < 1 || !Number.isInteger(numMissions) ? alert(`Invalid input. Please try again with a number between 1 and ${portalsCount}`) : splitMission(numMissions, remainderAtEnd);
    }, splitMission = async (numMissions, remainderAtEnd) => {
        const mission = main.state.missions.get(0);
        if (!mission) return;
        let hasPortals = !1;
        for (let i = 1; i < numMissions; i++) hasPortals ||= !0 === main.state.missions.get(i)?.hasPortals();
        if (hasPortals && !await confirmDialog({
            message: "Merge mission before split?",
            details: "Mission(s) already contain portals. These will be merged into one"
        })) return;
        const numPortals = mission?.portals.length, numRestPortals = numPortals % numMissions, message = `Your path of ${numPortals} will be divided into ${numMissions} missions of ${Math.floor(numPortals / numMissions)} portals each.`;
        let details = "";
        numRestPortals > 0 && (details += remainderAtEnd ? ` The remaining ${numRestPortals} portal(s) will be added to the last mission.` : ` The remaining ${numRestPortals} portal(s) will be equaly divided between the first missions.`), 
        details += "\r\n\r\nThis process can be reversed using the merge missions feature. Do you want to continue?", 
        await confirmDialog({
            message,
            details
        }) && (main.state.missions.splitIntoMultiple(mission, numMissions, remainderAtEnd), 
        main.state.save());
    }, mergeMissions = async () => {
        await confirmDialog({
            message: "Merge mission?",
            details: "Are you sure you want to merge all your missions into 1?\r\n\r\nThis can't be undone."
        }) && (main.state.missions.mergeAll(), main.state.setCurrent(0), main.state.save());
    }, reverseMission = () => {
        const state = main.state, text = `Which missions do you want to reverse (1-${state.getPlannedLength()})?\n\n<small>Use "1-5" to reverse a missions from 1 to5\nUse "2" to reverse missions only 2\nUse "1,3,5-7" to reverse missions 1, 3 and 5 to 7</small>`, missionToReverse = prompt(text, `1-${state.getPlannedLength()}`);
        if (null === missionToReverse) return;
        const regex = new RegExp(/(?<range>(?<from>\d+)\s*[-]\s*(?<to>\d+))|(?<single>\d+)/gm);
        [ ...missionToReverse.matchAll(regex) ].forEach(match => {
            if (match.groups?.single) {
                const missionId = parseInt(match.groups.single) - 1;
                state.missions.reverse(missionId);
            } else if (match.groups?.range) {
                const from = parseInt(match.groups.from) - 1, to = parseInt(match.groups.to) - 1;
                state.missions.reverse(from, to);
            }
        }), state.save();
    }, setCurrentMission = missionId => {
        main.state.setCurrent(missionId), main.state.save();
    }, toolBarButton = (id, image, tooltip, click) => $("<a>", {
        id,
        class: "umm-control",
        title: window.isSmartphone() ? "" : tooltip
    }).on("click dblclick", event => {
        event.stopPropagation(), click && click();
    }).append($("<img>", {
        src: image
    }).css({
        width: 16,
        height: 16,
        "margin-top": "7px"
    })), onMissionNumberChanged = () => {
        const state = main.state;
        $("#umm-edit-active-mission").text(state.getCurrent() + 1), $("#umm-edit-active-mission").css("background-color", "white"), 
        $("#umm-next-mission img").css("opacity", "100%"), $("#umm-previous-mission img").css("opacity", "100%");
        const current = state.getCurrent();
        current >= state.getPlannedLength() - 1 && ($("#umm-next-mission").children("img").css("opacity", "30%"), 
        $("#umm-edit-active-mission").css("background-color", "orange")), 0 === current && $("#umm-previous-mission").children("img").css("opacity", "30%"), 
        onMissionPortalsChanged();
    }, onMissionPortalsChanged = () => {
        const count = main.state.getEditMission()?.portals.length ?? 0;
        count < 1e3 ? $("#umm-number-of-portals").text(`P${count}`) : $("#umm-number-of-portals").text(`${count}`);
    }, nextMission = () => {
        const state = main.state;
        if (state.getCurrent() >= state.getPlannedLength() - 1) return;
        setCurrentMission(state.getCurrent() + 1);
        const mission = state.getEditMission();
        mission.hasPortals() ? showMission(mission) : main.missionModeActive && bannerNotification(state, `Start of mission #${state.getCurrent() + 1}\nSelect start portal.`);
    }, previousMission = () => {
        const state = main.state;
        if (state.getCurrent() <= 0) return;
        setCurrentMission(state.getCurrent() - 1);
        const mission = state.getEditMission();
        showMission(mission);
    }, showMission = mission => {
        mission.hasPortals() && (mission.show(), onMissionPortalsChanged(), main.missionModeActive ? bannerNotification(main.state, `Mission mode active.\nCurrent mission #${main.state.getCurrent() + 1}\nSelect next portal`) : bannerNotification(main.state, `Current active mission set to #${main.state.getCurrent() + 1}`));
    }, sample = data => data[Math.floor(Math.random() * data.length)], missionNumberQuestion = missionId => ({
        question: sample(MissionNumberQuestions),
        answer: (missionId + 1).toString()
    }), standardQuestion = () => {
        const quest = sample(NoobQuestions);
        if (quest.m) {
            const rawChoices = quest.m.split(",");
            if (0 === rawChoices.length) return {
                question: quest.q,
                answer: ""
            };
            const answer = rawChoices.splice(0, 1), shuffled = (data => {
                const a = [ ...data ];
                for (let i = a.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [a[i], a[j]] = [ a[j], a[i] ];
                }
                return a;
            })(rawChoices), correctIndex = Math.floor(4 * Math.random());
            shuffled.splice(correctIndex, 0, ...answer).slice(0, 4);
            const lines = shuffled.map((c, i) => `${String.fromCodePoint(65 + i)}) ${c}`).join(" "), correctLetter = correctIndex >= 0 ? String.fromCodePoint(65 + correctIndex) : "";
            return {
                question: `${quest.q}\n${lines}`,
                answer: correctLetter
            };
        }
        return {
            question: quest.q,
            answer: quest.a
        };
    }, ActionLabels = new Map([ [ "HACK_PORTAL", "Hack portal" ], [ "INSTALL_MOD", "Install mod" ], [ "CAPTURE_PORTAL", "Capture portal" ], [ "CREATE_LINK", "Create link" ], [ "CREATE_FIELD", "Create field" ], [ "PASSPHRASE", "Enter passphrase" ] ]), addWaypointEditorToPortal = () => {
        const missions = main.state.missions.getMissionsOfPortal(window.selectedPortal ?? "");
        if (0 === missions.length) return;
        appendEditor(missions);
        const current = main.state.getCurrent(), preSelect = missions.includes(current) ? current : missions[0];
        $("#umm-mission-select").val(preSelect), onMisisonSelect();
    }, appendEditor = missions => {
        const misisonSelect = $("<select>", {
            id: "umm-mission-select"
        }), actionSelect = $("<select>", {
            id: "umm-action-select"
        }), container = $("<div>", {
            id: "umm-waypoint-editor"
        }).append($("<span>", {
            text: "UMM Waypoint Editor",
            class: "umm-waypoint-editor-title"
        }), $("<div>", {
            class: "umm-waypoint-select-container"
        }).append(misisonSelect, actionSelect), $("<div>", {
            id: "umm-passphrase-container"
        }).css("display", "flex").append($("<span>", {
            text: "Question"
        }), $("<textarea>", {
            id: "umm-passphrase-question",
            type: "text",
            row: 1
        }).css({
            "overflow-y": "hidden"
        }).on("blur", () => savePassPhrase()).on("focus", event => onFocus(event)), $("<span>", {
            text: "Passphrase"
        }), $("<input>", {
            type: "text",
            id: "umm-passphrase-passphrase"
        }).on("blur", () => savePassPhrase()).on("focus", event => onFocus(event))));
        addMissionOptions(misisonSelect, missions), addActionOptions(actionSelect), misisonSelect.on("change", onMisisonSelect), 
        actionSelect.on("change", onActionSelect), $("#portaldetails #randdetails").before(container);
    }, addMissionOptions = (missionSelect, validMissionIds) => {
        const missionOption = $("<option>", {
            value: "#",
            text: "Select mission"
        });
        missionSelect.append(missionOption), validMissionIds.forEach(id => {
            const missionOption = $("<option>", {
                value: id,
                text: id + 1
            });
            missionSelect.append(missionOption);
        });
    }, addActionOptions = actionSelect => {
        ActionLabels.forEach((label, action) => {
            const option = $("<option>", {
                value: action,
                text: label
            });
            actionSelect.append(option);
        });
    }, onMisisonSelect = () => {
        const portal = currentPortal();
        if (portal) {
            const action = portal.objective.type, {question, answer} = (portal => ({
                question: portal.objective.passphrase_params.question ?? "",
                answer: portal.objective.passphrase_params._single_passphrase ?? ""
            }))(portal);
            $("#umm-action-select").val(action), $("#umm-passphrase-question").val(question), 
            $("#umm-passphrase-passphrase").val(answer), $("#umm-passphrase-container").toggle("PASSPHRASE" === action), 
            onActionSelect();
        } else $("#umm-action-select").prop("disabled", !0), $("#umm-passphrase-container").hide();
    }, onActionSelect = () => {
        const action = $("#umm-action-select").val(), portal = currentPortal();
        portal && ($("#umm-passphrase-container").toggle("PASSPHRASE" === action), "PASSPHRASE" === action && pregenerateQuestion(portal), 
        portal.objective.type = action, main.state.save());
    }, onFocus = event => {
        const element = $(event.target);
        element.attr("selectAll") && (element.attr("selectAll", null), element.trigger("select"));
    }, pregenerateQuestion = portal => {
        if (!(portal => "" === portal.objective.passphrase_params.question && "" === portal.objective.passphrase_params._single_passphrase)(portal)) return;
        const missionId = parseInt($("#umm-mission-select").val()), mission = main.state.missions.get(missionId);
        if (!mission) return;
        const {question, answer} = ((missionId, isStart) => isStart ? missionNumberQuestion(missionId) : standardQuestion())(missionId, mission.portals.isStart(portal));
        $("#umm-passphrase-question").val(question).attr("selectAll", "true"), $("#umm-passphrase-passphrase").val(answer).attr("selectAll", "true"), 
        setPassphrase(portal, question, answer);
    }, currentPortal = () => {
        const missionId = parseInt($("#umm-mission-select").val()), portals = main.state.missions.get(missionId)?.portals;
        return portals?.find(window.selectedPortal);
    }, savePassPhrase = () => {
        const portal = currentPortal();
        portal && (setPassphrase(portal, $("#umm-passphrase-question").val(), $("#umm-passphrase-passphrase").val()), 
        main.state.save());
    };
    const main = new class UMM_Ext {
        state;
        renderPath;
        renderNumbers;
        missionModeActive=!1;
        constructor() {
            const index = window.bootPlugins?.findIndex(x => "IITC Plugin: Ultimate Mission Maker" === x.info?.script?.name);
            index && -1 !== index && window.bootPlugins.splice(index, 1);
        }
        init() {
            __webpack_require__(340), this.state = new State, (() => {
                const UMMToolbar = L.Control.extend({
                    options: {
                        position: "topleft"
                    },
                    onAdd: () => $("<div>", {
                        class: "leaflet-umm leaflet-bar"
                    }).append(toolBarButton("umm-toggle-bookmarks", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAATLSURBVGhD7ZoHqH5jHMdfe++9CcnKLnsWsjLKLiHZo5AthQjJlvwzSkqyIjObEJGysorsvSPz8znv+9NzT+c97xnvvZy63/p0z/Pc5z7n+Z5znvV7bm9a/0M9Du/AITCrGWPS/HAWfAXPwV4wM4xLC8JF8C3Y9t7fCe9DW0Nh4BtI6xYf2OEwJzTVHHAifA1R7zXwb+KN5LqJoSIDD8OWcBC8NsiTz+EMWBiqyrd5IHwAUc8ng58TjFhwP6hrqMjAI7AZpJoJdoanIMr9BJfBClCmHeBliL97CbaGIwfpCUZCZYZmg9AwA5vDKG0Cd8Kf4N/9DrfAupBqPXgIov53wbb5UFSpkdAwQ4dC3sCjUMVAXqvBDPgVoq4HYQ/QWBj9Eo6H2SFVJSOhIkOBBraAtloKLoTvIa3/FzgfHKGKVMtIKAy9AtGJxy0/15PhdbgeloEyjTRio2Wy5BNevH/ZSiONvAB23MnQyuAk5j2PMAMtArfCdbC0GRU10shtcFX/ciw6APbsX2Zv4nl4C3Y1A20E0Q4nO+XEt2z/cqga9ZE6mgdm6V/2TgPrd+Qp+1w14zJm3izV650H/t2NWapYlY3sCHfBqCcTWg4eA4fNn8GRyGHzbdgF6mh7+AGcNOcyo0CVjVwK/s6FZRU9DVFf4NqqqRaC5fuXhapsZAFwBr44S5XLdVPUleIENw7Zb51TUjXuI864J4CjTCrHe/vFHxD1BbdDW7k0+g6sb2MzBmpsxInKss9kqf4NngTzrgCHz6hP7CtbwTi0N3j/lbJUX42NbAg3wFFZqr+vcP31BXgjV8mngEbvhW1hMtXYSJHSFfFUaMXBTzVWI1MpJ1bb6nyjOmvkaLCtTguqs0YcLW+GtbNUh43k1Wkja0Cs2Tpr5BiwrftnqQ4buRxs68FZqsNGjLIYXXQxqaY7+38pO7m7zIhpqc4ZMZ71IdjONGjRCSNzg9tfY14GJFxJvwhT9kacfdsuJN1iexxhu/4CRys7ej7oXduIDVsfVoeYjHzdbrIMQhtYU6eDdRloWMIM5NK+TgzL4EN6ZBDsA3nVMmJ89k2Ick+Aw58mIm8DUPvCe+AnMJ8Z6A6wzANZarSMIUe9KW7a8qplxIZHmeBKMCjgXt7PoEyHgU/4VYhP7hJwD57uHo28+3C2g/z95GzIq7IRb2zIP8oEHto0lXV60GM995uBfHux33ePbywrvZ8HOotBXrXeyMcQZQLPLNrI+JdzQoR67HengvsMQ6qmPY9xyX4uRH/Lq5YRK3TkiHKeZWwKVWXZUVH1pppgJF7p3ZA/MQptA9eCT2wtMypoJzAYbt2/wU2wJoxLu0EMQvbZLOphWNIMn3yZoSpKDchnECdS1n8ftAkRGdeKEJQYIloHMjnOO5K0MZQ38BEcC4aMloQLII4TxLJ1zt5XAQeC+MwdAAzHFh7UNjGUN+DgcBwUnaU7cZ4E6QAy6ux9Ubga/Dwt/yN4hhlR+1JVMTTMwLDIeSpXBW6OInIpDslnQixDDMF6Fm/D/b3TgIaGjWClKjJ0D6QGPgWPDqoYyMvPyk77LER93stoZvwzgPc0kL4qtFbeUFsDRfIfDHxI0QfE0GsatB6bNHQOVP2EmsgNlAdEu2epaXVSvd4/r54FA9f01AsAAAAASUVORK5CYII=", "UMM: Toggle Mission Mode", toggleMissionMode), toolBarButton("umm-next-mission", "data:image/png;base64,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", "UMM: Next Mission", nextMission), toolBarButton("umm-edit-active-mission", void 0, "UMM: Select mission number", editActiveMission), toolBarButton("umm-previous-mission", "data:image/png;base64,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", "UMM: Previous Mission", previousMission), toolBarButton("umm-number-of-portals", void 0, "UMM: Number of portals in current mission"), toolBarButton("umm-undo", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOiSURBVHhe7Zo9SFtRFMeTvHwbjSHRIA52aJBICw1oSSCglQ66CIWOLoUOLh0cOnRLJwcHu3Xp0EJLV3HxIwSe1iGKGKFCAnaok9RUjUbQ6NP0HjiC1PeZvCTvxvsDufcc0eT837nnnnsTE4PBYDAYjHuLGceaEI/HnxQKhemrq6shQRCs6L4Dx3GF7u7uSCqV+o2uumHBUXf6+/vj+Xz+R6lUei4XPGA2m60OhwOt+lKTDIDgi8Xi/PX1tQddklit1tNgMDjK8/wquuqK7gLQFDygqwC0BQ/oJgCNwQO6CEBr8EDVAtAcPFCVALQHD1QsQDMED1QkQLMED2gWoJmCBzQJoCX4WkHaZpPdbi+Qcdtms/EdHR3fFhcXc/hrzagWwAjBi2GxWECQWZ/P93ZlZeUXulWjSoCBpwPRk+OTpNGCvw05UZ57vd43a2trn9ClCg5HWQL+wPfLy8uHaBqScrlsPTs7GyNL4vjg4CCNbkVUHYdh3dECydKZaDT6Gk1FVAkA6wsqOpqG5/DwcGZ4eFhVxqoSgGxj6c5g5ygtIpDl4CHLYBpNWTTl9uDQYHz/z/68IAiqiiEsHajSekJSHAJESxp43d7e3vDc3JzsFql5cWsRgbyJ09bW1tGNjQ3dGqFEIuFJpVIjR0dHU6VSSTbNyWu/39zcTKApSkXVrdEiAOFw2EP+d+bi4kJSBIfTwW//3H6GpigV5ecyv7yqtiZA7wANFDRS6NKFbDZ72tbW9g5NccqmRziTpOIFagQRIpHIAk5FIRkawKkkVW/wjV4OoVBItiLu7OzIxlh1iTZCJlSDLnsUzSLotknTKoJuAgA0iqCrAABtIuguAFCJCOTw8gBddaUmAgAgQldXV8zldi3Y7fZzjuPg0kL0x2azCW63G/+yvlTdBzSSiYkJOBcU0bwDiJvL5WrbBzSSTCYzglNRyBL8i1NJqBVgfHw8QGrHFJqiwM0xTiVRdSdoJCDtSWqP7e7uKt5TulyuL3t7ezyaohiuBsRisZfkyX6Eg8zNxcf/oxrgQqSnpye0tLQke1VuOAH6+vry5MkqnuKUaGlpmd3a2nqBpiSGqwF6BA+nTqfTOYmmLFTvAmLAPSR8QJJOp1V95a6pBIDgSYGcXF9f/4wuRZpGAEj79vb2V9ls9gO6VGE4AUhbrNi83AaqPRQ8n8/3WMuTv4G6bRDaW+jwoMkhYi37/f6vyWRS86fCDAaDwWAwGAwG4z5jMv0D9jMAtZVsLdkAAAAASUVORK5CYII=", "UMM: Remove Last", removeLastPortal), toolBarButton("umm-opt", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAB3RJTUUH5QgWEyMyp0FY2wAAAAlwSFlzAAALEwAACxMBAJqcGAAAAARnQU1BAACxjwv8YQUAAAKoSURBVHja7Zo/SFxBEMb3GQvFIpoY6yjcgdgmRVKYwlJBSaugYKmNNsYEDAmIYmMEa4OgpYWo2AkKVlqr3IFa+zcWEpvk+Y1vrzm5Y+e4ZVZvfjDsO7hl5/vuvd3ZfWeMoiiKoiiKolQkEefLqVQqymQycTqdfoGPs4hexCthDVeIZcQIcvuH3KJsNht7MSCOY4MBXuNyEdEpLDyfDUQ/TLiMIndZ3DuAfvnVAMXnWEd04w7479qhijnAbMDiiS6bozNcA/qkFZY7R64B9dLqHGjwacCJtDoHjn0aMIm4k1ZYhL82Rz8GYIlZQDMjrbIIM8jxN6cDuw4gUAuMoPmCaJJWbDlDTEH8rwdRHusAugtyJjSieW/CqAT3kNeFzcugDnDuXM0djQYg7ICbwuIf5aUoPFhzAEHzAJGbC0Ih9whwnn+2AfniMWgdmhph7XfI57ZUE9iTIInHQK24HEe0I14KG3CDfHZMsgwecifDUs4DOnC5EoDwR0YgPsOELZ91QJtJ9txvpdUW4BTRiUfgwLUDdy8wH7B4Y3Ob53TgGvBRWmG5c+Qa8OzgGrArnXC5c+QaMGySiSZUTmyOfgzAEkOz66BJlpzQ+EO5US3A6cQqhKjIoHUW7QeTnAd8MvL1AP0Y2yYphI68FkLPsRSu+M2QUumUNAcQoT4ChPftsB3wDZp3JoxD0X3kdZ5vhAulHouPohkzYR2LT8OEhxej3rbD9jzgBy4npBUX4CdM+O7zPICqQNpuSq/9haBXY0OYA5zfDnH3Al8DFk/UIr5xOnANaJZW6ECLTwOupdU5cOXTgCVpdeXOkWsAvRVel1ZYhDXEqDcDsMTQv6/6AzWBxA/YHP0YQH9CxAD0jHUj5hCX0qptDpRLD+VGOUonpCiKoiiKoihPgHtXV96aolVzHAAAAABJRU5ErkJggg==", "UMM: Opt", showUmmOptions))[0]
                });
                window.map.addControl(new UMMToolbar), main.state.onSelectedMissionChange.do(onMissionNumberChanged), 
                main.state.onMissionPortal.do(onMissionPortalsChanged), onMissionNumberChanged(), 
                onMissionPortalsChanged();
            })(), $("#toolbox").append($("<a>", {
                text: "UMM",
                title: "Ultimate Mission Maker",
                click: () => this.toggleUMM()
            })), $(".leaflet-umm.leaflet-bar").hide(), this.renderPath = new RenderPath, this.renderNumbers = new RenderNumbers, 
            this.missionModeActive = !1, this.activateUMM(), showMissionGenerator();
        }
        toggleUMM() {
            $(".leaflet-umm.leaflet-bar").toggle(), $(".leaflet-umm.leaflet-bar").is(":visible") ? this.activateUMM() : this.deactivateUMM();
        }
        activateUMM() {
            $(".leaflet-umm").fadeIn().fadeOut().fadeIn().fadeOut().fadeIn().fadeOut().fadeIn(), 
            this.state.isEmpty() ? editMissionSetDetails() : this.state.missions.zoom(), this.renderPath.toggle(!0), 
            this.renderNumbers.toggle(!0), this.missionModeActive = !1, this.renderPath.redraw(), 
            this.renderNumbers.redraw(), window.addHook("portalSelected", this.onPortalSelected), 
            window.addHook("portalDetailsUpdated", this.onPortalDetailsUpdated), window.addHook("mapDataRefreshEnd", this.onMapDataRefreshEnd), 
            addWaypointEditorToPortal();
        }
        deactivateUMM() {
            this.missionModeActive = !1, this.renderPath.toggle(!1), this.renderNumbers.toggle(!1), 
            window.removeHook("portalSelected", this.onPortalSelected), window.removeHook("portalDetailsUpdated", this.onPortalDetailsUpdated), 
            window.removeHook("mapDataRefreshEnd", this.onMapDataRefreshEnd), $("#umm-waypoint-editor").remove();
        }
        onPortalSelected=event => {
            (async data => {
                if (lastPortal === data.selectedPortalGuid) return;
                if (lastPortal = data.selectedPortalGuid, !data.selectedPortalGuid) return;
                const state = main.state;
                if (!main.missionModeActive) return;
                const mission = state.getEditMission();
                if (!mission) return;
                const portalToAdd = mission.portals.create(data.selectedPortalGuid);
                if (mission.portals.includes(portalToAdd.guid)) mission.portals.isEnd(portalToAdd) && bannerNotification(state, `Portal already in mission #${main.state.getCurrent() + 1}`); else {
                    const preMission = state.missions.previous(mission);
                    if (0 === mission.portals.length && preMission && preMission.portals.includes(portalToAdd.guid) && !preMission.portals.isStart(portalToAdd) && !preMission.portals.isEnd(portalToAdd) && await confirmDialog({
                        message: "Split mission?",
                        details: "Your start portal overlaps another mission's portal. Reuse it or split the previous mission?"
                    })) {
                        const index = preMission.portals.indexOf(portalToAdd.guid);
                        return mission.portals.clear(), state.missions.split(preMission, index, mission), 
                        void state.save();
                    }
                    mission.portals.add(portalToAdd), state.save(), notification(`${main.state.getBannerName()}\nAdded to mission #${main.state.getCurrent() + 1}`);
                }
            })(event);
        };
        onPortalDetailsUpdated=event => {
            this.state.checkPortal(event), addWaypointEditorToPortal();
        };
        onMapDataRefreshEnd=() => this.state.checkAllPortals();
    };
    !function Register(plugin, name) {
        const setup = () => {
            window.plugin[name] = plugin, window.plugin[name].init();
        };
        setup.info = SCRIPT_INFO, window.bootPlugins || (window.bootPlugins = []), window.bootPlugins.push(setup), 
        window.iitcLoaded && setup();
    }(main, "UMM_Ext");
})();
};

/**
 * # v1.1.1
 * 
 * - fix: "edit" button was covering banner length in main dialog
 * - dependencies update
 * 
 * # v1.1
 * 
 * - new "Mission Generator" dialog  
 *   This new dialog provides several tools to modify current mission:
 *   1. "Reset"  
 *      Discard all current changes.
 *   2. Add portals  
 *      Adds nearby portals to the current mission.
 *      You can:
 *      - Limit selection using a DrawTools polygon
 *      - Exclude individual portals with DrawTool Markers
 *      - Restrict selection to portals within path hack range
 *   3. Sort portals  
 *      Attempts to arrange portals for the shortest possible path.
 *      (Note: This is a complex optimization problem—results may vary.
 *      The “keep end portal” option may occasionally fail.)
 *   4. Change start  
 *      Set the selected Portal as new mission start.
 *      If no portal is selected, the start point will cycle through all mission portals.
 * 
 *   All changes are temporary until "applied" or be "dismissed".  
 *   Note: Distance calculations are based on straight-line (“as-the-crow-flies”) distances; real-world paths are not considered.
 * 
 * - Use static layers  
 *   UMM is now fully hidden when inactive. Background processing is also disabled while inactive.
 * - Added Multi-Reverse  
 *   Using the reverse action in the main dialog, you can now reverse an entire banner or selected parts of it—not just a single mission.
 * - Drag: allow swapping mission portals
 * - Fixed merge in main dialog
 * - Fixed “Should merge?” prompt in split option (main dialog)
 * - Mission-Select dialog moved to the left
 * 
 * # v1.0.2
 * 
 * - fix IITC-Button load
 *   in iitc-button load order is differnet and custom "if UUM is loaded then disable it" failed
 * - fix variable if both plugins are active
 * 
 * # v1.0.1
 * 
 * - fix mission number (index started by 0 instead of 1)
 * 
 * # v1.0
 * 
 * This is a complete rewrite of the Ultimate Mission Maker from a developer perspective.
 * The entire codebase has been redesigned while maintaining the familiar user experience of the original UMM.
 * Below are the visible improvements and changes you'll notice.
 * 
 * ## What's Changed:
 * 
 * - UMM is now hidden by default. You need to hit the "UMM" button in the Portal details window to make it appear.
 * 
 * - **Select Mission Dialog** (open it through the toolbar or the main dialog)
 *   - Selecting a mission is no longer required; simply open another mission
 *   - Navigation buttons (+/-) allow you to cycle through missions
 *   - Added split, clear, merge, and reverse commands for mission manipulation
 *   - New mission information display: portal count and distances
 * 
 * - **Banner Settins** (start window)
 *   - changed Title placeholders to $T $M $N
 * - **Option Dialog** (main window)
 *   - Banner information now displays as a compact table
 *   - Removed warning for mission counts that are not multiples of 6
 *   - Added warning when missions lack sufficient waypoints
 * 
 * - **Drag & Drop** in the mission editor path
 *   - Move existing markers to adjust waypoints
 *   - Add new waypoints by positioning intermediate markers at new locations
 *   - Remove waypoints by double-clicking a marker
 *   - Merge missions by dragging start and end markers together
 * 
 * - **Mission Numbers**
 *   - Potential split points are previewed while creating missions
 * 
 * - **Waypoint edit**
 *   - current mission is preselected
 *   - passphrases: add random default questions.
 *     when question & answer is empty a simple question will be set.
 * 
 * - **Miscellaneous**
 *   - Custom confirmation dialogs clarify actions and improve readability
 *   - Switch between any missions, even those without portals
 *   - Option to split missions when starting on a portal that's already assigned to another mission
 *   - on mobile dialogs are not at the top instead of centered
 *   - flash buttonbar on activation to draw attention
 * 
 * ---
 * 
 * # History:
 * 
 * ## v1.0.beta.2 - 15.02.26
 * 
 * - fixed update-URL in script header
 * 
 * ## v1.0.beta - 15.02.26
 * 
 * - first public release
 * - automated build process on GitHub
 * - fixed layer checkboxes in Option-Dialog
 * - add "clear" mission to selection dialog
 * - always color selected mission even when not in Edit-Mode
 * - move "no" to left in custom confirm dialog
 * - remove doubled "v" in version numbers
 * - fix toggeling edit mode on mission detail window "save" button
 * - close dialog on mission detail window "save"
 * - fix linebreaks in changelog dialog
 * - select mission: directly select mission on combo-box change
 * - fix question text in portal details
 * - on mobile dialogs are not at the top instead of centered
 * 
 */
function wrapper_editor(SCRIPT_INFO) {
(() => {
    "use strict";
    var __webpack_modules__ = {
        879(module, __webpack_exports__, __webpack_require__) {
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601), _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314), _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__), _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(417), _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__), ___CSS_LOADER_URL_IMPORT_0___ = new URL(__webpack_require__(977), __webpack_require__.b), ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()), ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
            ___CSS_LOADER_EXPORT___.push([ module.id, `#umm-badge{background-color:crimson;margin:15px 0 0 10px;padding:0 5px}#umm-badge,#umm-mission-editor-bar{color:#fff;float:left;height:26px;line-height:28px;vertical-align:middle}#umm-mission-editor-bar{align-items:center;background-color:#08304e;display:flex;flex-wrap:nowrap;margin-top:15px;padding-left:5px}#umm-mission-title{display:inline-block;max-width:200px;min-width:4em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#umm-mission-picker-wrapper{display:inline-block;margin-left:10px}.umm-upload-label{background-image:url(${___CSS_LOADER_URL_REPLACEMENT_0___});background-size:cover;box-sizing:border-box;cursor:pointer;display:inline-block;height:16px;margin:0 0 0 5px;padding:3px 0 7px;width:16px}#umm-import-file{border:none;border-radius:0;height:.1px;opacity:0;overflow:hidden;position:absolute;width:.1px;z-index:-1}.umm-mission-picker{margin-left:15px}.umm-mission-picker,.umm-mission-picker-btn{background-color:#08304e;height:26px;padding:0 10px}.umm-mission-picker-btn{margin-left:3px}.umm-notification{background-color:#383838;border-radius:2px;-webkit-box-shadow:0 0 24px -1px #383838;-moz-box-shadow:0 0 24px -1px #383838;box-shadow:0 0 24px -1px #383838;color:#f0f0f0;font-family:Calibri,sans-serif;font-size:20px;height:20px;height:auto;left:50%;margin-left:-100px;padding:10px;position:fixed;text-align:center;top:55px;width:300px;z-index:10000}.umm-options-list a{background:rgba(8,48,78,.9);border:1px solid #ffce00;color:#ffce00;display:block;margin:10px auto;padding:3px 0;text-align:center;width:80%}`, "" ]);
            const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
            __webpack_require__.d(__webpack_exports__, [ "A", 0, __WEBPACK_DEFAULT_EXPORT__ ]);
        },
        314(module) {
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
        417(module) {
            module.exports = function(url, options) {
                return options || (options = {}), url ? (url = String(url.__esModule ? url.default : url), 
                /^['"].*['"]$/.test(url) && (url = url.slice(1, -1)), options.hash && (url += options.hash), 
                /["'() \t\n]|(%20)/.test(url) || options.needQuotes ? '"'.concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), '"') : url) : url;
            };
        },
        601(module) {
            module.exports = function(i) {
                return i[1];
            };
        },
        344(module, __webpack_exports__, __webpack_require__) {
            __webpack_require__.r(__webpack_exports__), __webpack_require__.d(__webpack_exports__, {
                default: () => src_MissionEditor_styles
            });
            var injectStylesIntoStyleTag_namespaceObject = __webpack_require__.cjs(function(module, exports) {
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
            }), injectStylesIntoStyleTag_default = __webpack_require__.n(injectStylesIntoStyleTag_namespaceObject), styleDomAPI_namespaceObject = __webpack_require__.cjs(function(module, exports) {
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
            }), styleDomAPI_default = __webpack_require__.n(styleDomAPI_namespaceObject), insertBySelector_namespaceObject = __webpack_require__.cjs(function(module, exports) {
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
            }), insertBySelector_default = __webpack_require__.n(insertBySelector_namespaceObject), setAttributesWithoutAttributes_namespaceObject = __webpack_require__.cjs(function(module, exports) {
                module.exports = function setAttributesWithoutAttributes(styleElement) {
                    var nonce = __webpack_require__.nc;
                    nonce && styleElement.setAttribute("nonce", nonce);
                };
            }), setAttributesWithoutAttributes_default = __webpack_require__.n(setAttributesWithoutAttributes_namespaceObject), insertStyleElement_namespaceObject = __webpack_require__.cjs(function(module, exports) {
                module.exports = function insertStyleElement(options) {
                    var element = document.createElement("style");
                    return options.setAttributes(element, options.attributes), options.insert(element, options.options), 
                    element;
                };
            }), insertStyleElement_default = __webpack_require__.n(insertStyleElement_namespaceObject), styleTagTransform_namespaceObject = __webpack_require__.cjs(function(module, exports) {
                module.exports = function styleTagTransform(css, styleElement) {
                    if (styleElement.styleSheet) styleElement.styleSheet.cssText = css; else {
                        for (;styleElement.firstChild; ) styleElement.removeChild(styleElement.firstChild);
                        styleElement.appendChild(document.createTextNode(css));
                    }
                };
            }), styleTagTransform_default = __webpack_require__.n(styleTagTransform_namespaceObject), styles = __webpack_require__(879), options = {};
            options.styleTagTransform = styleTagTransform_default(), options.setAttributes = setAttributesWithoutAttributes_default(), 
            options.insert = insertBySelector_default().bind(null, "head"), options.domAPI = styleDomAPI_default(), 
            options.insertStyleElement = insertStyleElement_default();
            injectStylesIntoStyleTag_default()(styles.A, options);
            const src_MissionEditor_styles = styles.A && styles.A.locals ? styles.A.locals : void 0;
        },
        977(module) {
            module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE4LTA5LTE3VDAyOjU3OjM3KzAyOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOC0wOS0xN1QwMjo1ODoyMCswMjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wOS0xN1QwMjo1ODoyMCswMjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0NWYwMDRiMS05NzRjLWRlNDctYTEzMi02NWZlYzIyOWM1NWYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDVmMDA0YjEtOTc0Yy1kZTQ3LWExMzItNjVmZWMyMjljNTVmIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NDVmMDA0YjEtOTc0Yy1kZTQ3LWExMzItNjVmZWMyMjljNTVmIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo0NWYwMDRiMS05NzRjLWRlNDctYTEzMi02NWZlYzIyOWM1NWYiIHN0RXZ0OndoZW49IjIwMTgtMDktMTdUMDI6NTc6MzcrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE4IChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5w/iV0AAACPklEQVRoge2ZsWvVQACHv1yVoiIiggWhkygu0giC4KSzrg4ujp27uTnq6KDgoOjoKPgvCA5OeQ8LWqHa6lAdWnWprdWfw7009/Kitbl4eRf84JG7eyT8PnJ3uVwSSXQB03aApvgvMm4YYB9wB1gDtIvfInAxfORqEkm3gbma538GUmCpoTy1SSStAFMe13gGXAB+NpKoJomamX9vAHcbuM5O/AC+Vv3RlEhI3gPXgcduY4wiYO/MeeBF3hDr9DsBXHEb9uxwgrAz0zhyyK1UiQh4BNwDXgLfAoTypmqMzAL3B+VJ4CiwN2iqv2MT+LBd0zBPJSFpUtJDSRsabz5JuiZpROSyrMit4JHqsyXpXLlrHQFWgWVgOmxP8eKmO/0uYSWmiEsCYN0V6Q2OaQtBfOm7ItngmIbP4U3WBZE1YLkLIj0o1lpfgHfAAeBES4HqMiSSYZcmp7ELspgYEYH4uhV0RGQLmIdCJNZnyCtgA6zId6zVBHaMxESWFwxWYhM4CexvKVBd+nnBUFjNtBLFjywvGIrxcaaVKH5U3pG0jSQerAAf80rMIplbMdhdkmPYd/OY6LuV/DkS9UCHQiTGgd5zK7lIGj6HF+vAgtsQq8g8dp21jQEOAsdbiVOfXrnBYNdXsW1mV4rEOND75QZDfOMDSlMvxCnyFrvHMIQBToXP4sVItwIrshg4iC/PqxoTSZeAJ4znN5Ayb4CzVHzZTQab8TPAVeBw2Fy74jXwgD98ng4b5x8R24Pwt3RG5BfpNRC+G94MKgAAAABJRU5ErkJggg==";
        }
    };
    const __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        const cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        const module = __webpack_module_cache__[moduleId] = {
            id: moduleId,
            exports: {}
        };
        return __webpack_modules__[moduleId](module, module.exports, __webpack_require__), 
        module.exports;
    }
    __webpack_require__.m = __webpack_modules__, __webpack_require__.n = module => {
        const getter = module && module.__esModule ? () => module.default : () => module;
        return __webpack_require__.d(getter, {
            a: getter
        }), getter;
    }, __webpack_require__.d = (exports, definition) => {
        if (Array.isArray(definition)) for (var i = 0; i < definition.length; ) {
            var key = definition[i++], binding = definition[i++];
            __webpack_require__.o(exports, key) ? 0 === binding && i++ : 0 === binding ? Object.defineProperty(exports, key, {
                enumerable: !0,
                value: definition[i++]
            }) : Object.defineProperty(exports, key, {
                enumerable: !0,
                get: binding
            });
        } else for (var key in definition) __webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key) && Object.defineProperty(exports, key, {
            enumerable: !0,
            get: definition[key]
        });
    }, __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop), 
    __webpack_require__.r = exports => {
        Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(exports, "__esModule", {
            value: !0
        });
    }, __webpack_require__.cjs = body => {
        const mod = {
            exports: {}
        };
        return body.call(mod.exports, mod, mod.exports), mod.exports;
    }, __webpack_require__.b = "undefined" != typeof document && document.baseURI || self.location.href, 
    __webpack_require__.nc = void 0;
    const notification = (notificationText, presistend = !1) => {
        $(".umm-notification").remove(), notificationText = notificationText.replace(/\n/g, "<br/>");
        const notification = $("<div>", {
            class: "umm-notification",
            html: notificationText
        });
        $("body").append(notification), presistend || window.setTimeout(() => {
            $(".umm-notification").fadeOut(400, () => notification.remove());
        }, 3e3);
    }, loadFile = async (state, inputFile) => {
        const text = await inputFile.text();
        try {
            state.import(text);
        } catch (error) {
            return notification(`Loadgin error: \n${error}`), !1;
        }
        return state.save(), notification(`Banner data loaded:\n${state.getBannerName()}`), 
        !0;
    };
    class Portals {
        state;
        data;
        constructor(state, data) {
            this.state = state, this.data = data;
        }
        cloneWithoutEvents() {
            return new Portals(void 0, [ ...this.data ]);
        }
        get length() {
            return this.data.length;
        }
        get(index) {
            return this.data.at(index);
        }
        getRange(start, end) {
            return this.data.slice(start, end);
        }
        set(index, portal) {
            this.data[index] = portal, this.state?.onMissionPortal.trigger();
        }
        add(...portal) {
            portal.some(p => this.includes(p.guid)), this.data.push(...portal), this.state?.onMissionPortal.trigger();
        }
        insert(index, ...portal) {
            portal.some(p => this.includes(p.guid)), this.data.splice(index, 0, ...portal), 
            this.state?.onMissionPortal.trigger();
        }
        remove(index, count = 1) {
            this.data.splice(index, count), this.state?.onMissionPortal.trigger();
        }
        clear() {
            this.data.length = 0, this.state?.onMissionPortal.trigger();
        }
        toLatLng() {
            return this.data.map(portal => new L.LatLng(portal.location.latitude, portal.location.longitude));
        }
        getLatLngOf(index) {
            const portal = this.get(index);
            if (portal) return new L.LatLng(portal.location.latitude, portal.location.longitude);
        }
        includes(guid) {
            return this.data.some(x => x.guid === guid);
        }
        find(guid) {
            return this.data.find(x => x.guid === guid);
        }
        indexOf(guid) {
            return this.data.findIndex(x => x.guid === guid);
        }
        isStart(portal) {
            return this.data[0]?.guid === portal.guid;
        }
        isEnd(portal) {
            return this.data.at(-1)?.guid === portal.guid;
        }
        reverse() {
            this.data.reverse(), this.state?.onMissionPortal.trigger();
        }
        create(guid) {
            const iitcPortal = window.portals[guid], options = iitcPortal.options.data, ll = iitcPortal.getLatLng();
            return {
                guid,
                title: options.title || "[undefined]",
                imageUrl: options.image,
                description: "",
                location: {
                    latitude: ll.lat,
                    longitude: ll.lng
                },
                isOrnamented: !1,
                isStartPoint: !1,
                type: "PORTAL",
                objective: {
                    type: "HACK_PORTAL",
                    passphrase_params: {
                        question: "",
                        _single_passphrase: ""
                    }
                }
            };
        }
        getDistance() {
            return this.toLatLng().reduce((sum, ll, index, lls) => index > 0 ? sum + ll.distanceTo(lls[index - 1]) : 0, 0);
        }
    }
    class Mission {
        missionID;
        data;
        portal_data;
        constructor(state, id, data) {
            this.missionID = id, this.data = data, this.portal_data = new Portals(state, data.portals);
        }
        get title() {
            return this.data.missionTitle;
        }
        get portals() {
            return this.portal_data;
        }
        get id() {
            return this.missionID;
        }
        get description() {
            return this.data.missionDescription;
        }
        hasPortals() {
            return this.portal_data.length > 0;
        }
        getLocations() {
            return this.portal_data.toLatLng();
        }
        show() {
            if (this.hasPortals()) {
                const bounds = new L.LatLngBounds(this.getLocations()).pad(.2);
                window.map.fitBounds(bounds, {
                    maxZoom: 18
                });
            }
        }
        focusLastPortal() {
            const last_ll = this.portal_data.getLatLngOf(-1), last = this.portal_data.get(-1);
            return !(!last || !last_ll) && (window.map.setView(last_ll), window.renderPortalDetails(last.guid), 
            !0);
        }
        getDistance() {
            return this.portals.getDistance();
        }
        clear() {
            this.portal_data.clear();
        }
        reverse() {
            this.portal_data.reverse();
        }
    }
    class Missions {
        static generateMissionTitle(format, info) {
            return format.replace(/\$(\d*)?(\w)/g, (_, flags, token) => {
                let value = token;
                switch (token.toLowerCase()) {
                  case "t":
                    value = info.title ?? value;
                    break;

                  case "m":
                    value = info.total?.toString() ?? value;
                    break;

                  case "n":
                    value = ((info.misison || 0) + 1).toString() ?? value;
                }
                let leadingZero = !1;
                flags?.startsWith("0") && (leadingZero = !0, flags = flags.slice(1));
                let length = parseInt(flags);
                return Number.isNaN(length) && (length = 1, leadingZero && (length = info.total?.toString().length ?? 1)), 
                value.length < length && (value = value.padStart(length, leadingZero ? "0" : " ")), 
                value;
            });
        }
        state;
        data;
        constructor(state, data) {
            this.state = state, this.data = data;
        }
        get(missionId) {
            const mis = this.data[missionId];
            return mis && new Mission(this.state, missionId, mis);
        }
        count() {
            return this.data.length;
        }
        forEach(callback) {
            this.data.forEach((missionData, index) => {
                const mission = new Mission(this.state, index, missionData);
                callback(mission);
            });
        }
        filter(callback) {
            const result = [];
            return this.forEach(mission => {
                callback(mission) && result.push(mission);
            }), result;
        }
        previous(mission) {
            let preMission, preMissionID = mission.id - 1;
            for (;!(preMission = this.get(preMissionID))?.hasPortals() && preMissionID > 0; ) preMissionID--;
            return preMission;
        }
        next(mission) {
            return this.get(mission.id + 1);
        }
        distanceToStart(id) {
            const mission = this.get(id);
            if (!mission) return;
            const previous = this.previous(mission), first = previous?.portals.getLatLngOf(-1), last = mission.portals.getLatLngOf(0);
            return first && last ? first.distanceTo(last) : void 0;
        }
        getTotalDistance() {
            const waypoints = [];
            return this.forEach(m => waypoints.push(...m.getLocations())), waypoints.reduce((sum, ll, index, lls) => index > 0 ? sum + ll.distanceTo(lls[index - 1]) : 0, 0);
        }
        getWaypointCount() {
            return this.data.reduce((count, mis) => count + mis.portals.length, 0);
        }
        validate() {
            const errors = {}, notEnoughWaypoint = this.filter(m => m.portals.length < 6).map(m => m.id);
            return notEnoughWaypoint.length > 0 && (errors["not enough waypoints"] = notEnoughWaypoint), 
            errors;
        }
        zoom() {
            const location = this.data.flatMap(m => new Portals(this.state, m.portals).toLatLng());
            if (location.length > 0) {
                const bounds = new L.LatLngBounds(location).pad(.1);
                window.map.fitBounds(bounds, {
                    maxZoom: 18
                });
            }
        }
        merge(destination, missionB) {
            destination.portals.add(...missionB.portals.getRange()), missionB.portals.clear();
        }
        mergeAll() {
            const portals = [];
            this.data.forEach(m => {
                portals.push(...m.portals), m.portals.length = 0;
            }), this.data[0].portals = portals;
        }
        split(source, at, destination) {
            const toMove = source.portals.getRange(at);
            destination.portals.insert(0, ...toMove), source.portals.remove(at, toMove.length);
        }
        splitIntoMultiple(source, count, restAtLast = !1) {
            const allPortals = this.getAllPortalsOf(source.id, count);
            let portalsPerMission = allPortals.length / count;
            restAtLast && (portalsPerMission = Math.floor(portalsPerMission));
            for (let i = 0; i < count; i++) {
                const start = Math.floor(portalsPerMission * i);
                let end = Math.floor(portalsPerMission * (i + 1));
                i === count - 1 && (end = allPortals.length);
                const mission = this.get(source.id + i);
                mission?.portals.clear(), mission?.portals.add(...allPortals.slice(start, end));
            }
        }
        getAllPortalsOf(from, count) {
            const allPortals = [];
            for (let i = 0; i < count; i++) {
                const mission = this.get(from + i);
                mission && allPortals.push(...mission.portals.getRange());
            }
            return allPortals;
        }
        getMissionsOfPortal(guid) {
            return this.filter(mis => mis.portals.includes(guid)).map(m => m.id);
        }
        reverse(from, to) {
            if (to) {
                (from = Math.min(Math.max(from, 0), this.count() - 1)) > (to = Math.min(Math.max(to, 0), this.count() - 1)) && ([from, to] = [ to, from ]);
                const portal_copy = this.data.map(mission => mission.portals.splice(0));
                for (let i = from; i <= to; i++) this.data[i].portals = portal_copy[to - (i - from)].reverse();
            } else this.get(from)?.reverse();
        }
    }
    const undefinedOrEmptyString = value => null == value || "" == value;
    class Trigger {
        handler=[];
        do(fct) {
            this.handler.includes(fct) || this.handler.push(fct);
        }
        dont(fct) {
            const index = this.handler.indexOf(fct);
            -1 === index ? console.error("handler was not registerd", fct) : this.handler.splice(index, 1);
        }
        trigger() {
            this.handler.some(fct => !1 === fct());
        }
        clear() {
            this.handler = [];
        }
    }
    class State {
        theState;
        constructor() {
            this.load();
        }
        onSelectedMissionChange=new Trigger;
        onMissionChange=new Trigger;
        onMissionPortal=new Trigger;
        load() {
            this.reset();
            const data = localStorage.getItem("ultimate-mission-maker");
            data && this.import(data);
        }
        save() {
            this.setPlannedLength(this.theState.plannedBannerLength), localStorage.setItem("ultimate-mission-maker", this.asString());
        }
        import(jsonString) {
            const anyState = JSON.parse(jsonString);
            this.theState = (ummState => {
                if (ummState.fileFormatVersion > 3) throw new Error("UMM: You've attempted to load data that's newer than what's supported by this version of UMM. Please update the plugin and try again. Data has not been loaded.");
                if (void 0 === ummState.fileFormatVersion || "" === ummState.fileFormatVersion) {
                    if (undefinedOrEmptyString(ummState.missionSetName) && (undefinedOrEmptyString(ummState.missionName) ? ummState.missionSetName = "" : (ummState.missionSetName = ummState.missionName, 
                    delete ummState.missionName)), undefinedOrEmptyString(ummState.missionSetDescription) && (undefinedOrEmptyString(ummState.missionDescription) ? ummState.missionSetDescription = "" : (ummState.missionSetDescription = ummState.missionDescription, 
                    delete ummState.missionDescription)), undefinedOrEmptyString(ummState.titleFormat) && (ummState.titleFormat = "T NN-M"), 
                    void 0 === ummState.numberOfMissions ? ummState.plannedBannerLength = Object.keys(ummState.missions).length : (ummState.plannedBannerLength = ummState.numberOfMissions, 
                    delete ummState.numberOfMissions), !Object.keys(ummState.missions[0]).includes("portals")) if (ummState.missions[0][0].guid) {
                        const newMissions = [];
                        for (const mission in ummState.missions) {
                            const plannedLength = ummState.plannedBannerLength > 0 ? ummState.plannedBannerLength : ummState.missions.length, missionTitle = Missions.generateMissionTitle(ummState.titleFormat, {
                                misison: parseInt(mission) + 1,
                                title: ummState.missionSetName,
                                total: plannedLength
                            });
                            newMissions.push({
                                missionTitle,
                                missionDescription: ummState.missionSetDescription,
                                portals: ummState.missions[mission]
                            });
                        }
                        ummState.missions = newMissions;
                    } else ummState.missions = [ {
                        missionTitle: "",
                        missionDescription: "",
                        portals: []
                    } ];
                    ummState.fileFormatVersion = 1;
                }
                if (1 === ummState.fileFormatVersion) {
                    for (const mission in ummState.missions) for (const portal in ummState.missions[mission].portals) ummState.missions[mission].portals[portal].objective = {
                        type: "HACK_PORTAL",
                        passphrase_params: {
                            question: "",
                            _single_passphrase: ""
                        }
                    };
                    ummState.fileFormatVersion = 2;
                }
                if (2 === ummState.fileFormatVersion) for (const mission in ummState.missions) for (const portal in ummState.missions[mission].portals) "HACK" === ummState.missions[mission].portals[portal].objective.type && (ummState.missions[mission].portals[portal].objective.type = "HACK_PORTAL");
                return 2 === ummState.fileFormatVersion && (ummState.missionSetName ??= "", ummState.missionSetDescription ??= "", 
                ummState.currentMission ??= 0, ummState.plannedBannerLength ??= 1, ummState.titleFormat ??= "T NN-M"), 
                ummState.fileFormatVersion < 3 && (ummState.titleFormat = (ummState.titleFormat ?? "").replace("T", "$T").replace(/N+/, match => match.length > 1 ? "$0N" : "$N").replace(/(M+)/g, "$M"), 
                ummState.fileFormatVersion = 3), ummState;
            })(anyState), this.setPlannedLength(this.getPlannedLength() || 1), this.onMissionChange.trigger(), 
            this.onMissionPortal.trigger(), this.onSelectedMissionChange.trigger();
        }
        asString() {
            return JSON.stringify(this.theState);
        }
        reset() {
            this.theState = {
                missionSetName: "",
                missionSetDescription: "",
                currentMission: 0,
                plannedBannerLength: 1,
                titleFormat: "$T $N / $M",
                fileFormatVersion: 3,
                missions: [ {
                    missionTitle: "",
                    missionDescription: "",
                    portals: []
                } ],
                layers: []
            }, this.onMissionChange.trigger();
        }
        isEmpty() {
            return "" === this.theState.missionSetName && "" === this.theState.missionSetDescription && this.theState.missions.every(m => 0 === m.portals.length);
        }
        isValid() {
            return "" !== this.theState.missionSetName && "" !== this.theState.missionSetDescription && this.theState.plannedBannerLength > 0;
        }
        get missions() {
            return new Missions(this, this.theState.missions);
        }
        getBannerName() {
            return this.theState.missionSetName;
        }
        setBannerName(name) {
            this.theState.missionSetName = name, this.theState.missions.forEach((mission, id) => mission.missionTitle = this.generateMissionTitle(id)), 
            this.onMissionChange.trigger();
        }
        getBannerDesc() {
            return this.theState.missionSetDescription;
        }
        setBannerDesc(desc) {
            this.theState.missionSetDescription = desc, this.theState.missions.forEach(mission => mission.missionDescription = this.theState.missionSetDescription), 
            this.onMissionChange.trigger();
        }
        getTitleFormat() {
            return this.theState.titleFormat;
        }
        setTitleFormat(name) {
            this.theState.titleFormat = name, this.theState.missions.forEach((mission, id) => mission.missionTitle = this.generateMissionTitle(id)), 
            this.onMissionChange.trigger();
        }
        getPlannedLength() {
            return this.theState.plannedBannerLength;
        }
        setPlannedLength(count) {
            if (count = Math.max(count, 1), this.theState.plannedBannerLength = count, this.theState.missions.length > count) this.theState.missions = this.theState.missions.slice(0, count); else for (let id = this.theState.missions.length; id < count; id++) this.theState.missions.push({
                missionTitle: this.generateMissionTitle(id),
                missionDescription: this.theState.missionSetDescription,
                portals: []
            });
            this.onMissionChange.trigger();
        }
        generateMissionTitle(missNumber) {
            return Missions.generateMissionTitle(this.theState.titleFormat, {
                misison: missNumber,
                total: this.getPlannedLength(),
                title: this.theState.missionSetName
            });
        }
        getEditMission() {
            return this.missions.get(this.theState.currentMission);
        }
        setCurrent(missionId) {
            missionId >= 0 && this.getPlannedLength(), this.theState.currentMission = missionId, 
            this.onSelectedMissionChange.trigger();
        }
        getCurrent() {
            return this.theState.currentMission;
        }
        isCurrent(missionId) {
            return this.theState.currentMission === missionId;
        }
        checkPortal(event) {
            let updated = !1;
            this.theState.missions.forEach(mission => {
                const portal = mission.portals.find(x => x.guid === event.guid);
                portal && (portal.imageUrl === event.portalData.image && portal.title === event.portalData.title || (portal.imageUrl = event.portalData.image, 
                portal.title = event.portalData.title, updated = !0));
            }), updated && this.save();
        }
        checkAllPortals() {
            let updated = !1;
            this.theState.missions.forEach(mission => {
                mission.portals.forEach(portal => {
                    const iitcPortal = window.portals[portal.guid]?.options.data;
                    iitcPortal && (portal.imageUrl === iitcPortal.image && portal.title === iitcPortal.title || (portal.imageUrl = iitcPortal.image, 
                    portal.title = iitcPortal.title, updated = !0));
                });
            }), updated && this.save();
        }
        storeLayerState(layers) {
            this.theState.layers = layers.map(l => l.isVisible()), this.save();
        }
        restoreLayerState(layers) {
            this.theState.layers.forEach((vis, index) => layers[index].toggle(vis ?? !0));
        }
    }
    const main = new class UMM_Editor {
        state;
        init() {
            __webpack_require__(344), $(".navbar-header").append($("<div>", {
                id: "umm-badge",
                text: "UMM:"
            }), $("<div>", {
                id: "umm-mission-editor-bar"
            }).append($("<div>", {
                id: "umm-mission-title",
                click: () => $("#umm-import-file").trigger("click")
            }), $("<div>", {
                style: "margin-top: 0.3em;"
            }).append($("<input>", {
                id: "umm-import-file",
                type: "file"
            }), $("<label>", {
                for: "umm-import-file",
                class: "umm-upload-label"
            })), $("<div>", {
                id: "umm-mission-picker-wrapper"
            }).append($("<select>", {
                id: "umm-mission-picker",
                class: "umm-mission-picker"
            }), $("<button>", {
                id: "umm-mission-picker-btn",
                class: "umm-mission-picker-btn",
                text: "Import",
                click: () => this.importMission()
            })))), this.state = new State, this.setActiveBannerTitle(), this.bindFileImport(), 
            this.generateMissionSelect();
        }
        setActiveBannerTitle() {
            "" === this.state.getBannerName() ? $("#umm-mission-title").text("Please load a mission file...") : $("#umm-mission-title").text(this.state.getBannerName());
        }
        bindFileImport() {
            $("#umm-import-file")[0].addEventListener("change", async event => {
                ("" === this.state.getBannerName() || confirm("Are you sure you want to load this file? Doing so will overwrite any previously imported UMM data. Your existing missions will not be affected.")) && ($("#umm-mission-title").text("Loading banner... "), 
                await (async (event, state) => {
                    const files = event.target.files;
                    return 1 !== files?.length ? (alert("No file selected! Please select a mission file in JSON format and try again."), 
                    $("#umm-import-file").val(""), !1) : "application/json" != files[0].type ? ($("#umm-import-file").val(""), 
                    alert(files[0].name + " has not been recognized as JSON file. Make sure you've loaded the right file."), 
                    !1) : loadFile(state, files[0]);
                })(event, this.state), this.setActiveBannerTitle(), this.generateMissionSelect());
            });
        }
        generateMissionSelect() {
            const selectedMission = this.state.getCurrent(), container = $("#umm-mission-picker");
            container.empty(), this.state.missions.forEach(mission => {
                container.append($("<option>", {
                    value: mission.id,
                    text: `${mission.id + 1}: ${mission.title}`
                }));
            }), $("#umm-mission-picker").val(selectedMission), this.state.missions.count() > 0 && $("#umm-mission-picker-btn").prop("disabled", !1);
        }
        importMission() {
            const selectedMission = parseInt($("#umm-mission-picker").val());
            main.state.setCurrent(selectedMission), main.state.save();
            const mission = main.state.getEditMission(), angularScope = this.getAngularAppScope();
            if (!mission || "" === mission.title || "" === mission.description && 0 === mission.portals.length) return void notification("There is no mission data loaded");
            if (!$(".loading").hasClass("ng-hide")) return void notification("Please wait for the spinner in the top right to finish loading before importing a (new) mission");
            if (!angularScope.mission) return void notification("You can not import a mission on the preview page\nStart with Create New Mission");
            if ($(".title.title-4").length > 0 && !$(".title.title-4").hasClass("ng-hide") || $(".pagination li:nth-child(4)").hasClass("active")) return void notification("You can not import a mission on this page\nGo back to a previous page");
            if (angularScope.mission.definition.waypoints.length > 0 && !confirm("Your current mission already contains portals/waypoints. Are you sure you want to overwrite these?")) return;
            this.resetWaypoints(angularScope), angularScope.mission.definition.name = mission.title, 
            angularScope.mission.definition.description = mission.description;
            const mock = angularScope.setSelectedWaypoint;
            angularScope.setSelectedWaypoint = () => 0;
            let missingImagesCount = 0;
            mission.portals.getRange().forEach(portal => {
                const {mePortal, hasError} = this.createPortal(portal);
                hasError && missingImagesCount++, angularScope.addWaypoint(mePortal);
            }), angularScope.setSelectedWaypoint = mock, angularScope.mission.definition.waypoints.forEach((aportal, index) => {
                const portal = mission.portals.get(index);
                aportal.objective.type = portal.objective.type, aportal.objective.passphrase_params.question = portal.objective.passphrase_params.question, 
                aportal.objective.passphrase_params._single_passphrase = portal.objective.passphrase_params._single_passphrase;
            }), angularScope.$apply();
            const angularApp = this.getAngularApp();
            angularApp.injector().get("$timeout")(() => {
                if (missingImagesCount > 0) {
                    notification("Missing data detected\nRefreshing data to correct the issue. Standby...", !0);
                    const triggerRefresh = () => {
                        setTimeout(validateRefresh, 200);
                    }, validateRefresh = () => {
                        const angularHttp = angularApp.injector().get("$http");
                        let isMissionSaving = !1;
                        for (const request of angularHttp.pendingRequests) "/api/author/saveMission" === request.url && (isMissionSaving = !0);
                        if (angularScope.pendingSave || isMissionSaving) triggerRefresh(); else {
                            notification("Refreshing mission...", !0);
                            const scope = this.getAngularAppScope();
                            this.reloadMAT(scope.mission.mission_id);
                        }
                    };
                    setTimeout(triggerRefresh, 200);
                } else notification("UMM Mission import succesful:\n" + angularScope.mission.definition.name);
            });
        }
        getAngularApp() {
            const container = document.getElementsByClassName("container")[0];
            return angular.element(container);
        }
        getAngularAppScope() {
            return this.getAngularApp().scope();
        }
        resetWaypoints(scope) {
            scope.mission.definition.waypoints = [], scope.waypointMarkers = [], scope.$apply();
        }
        createPortal(portal) {
            let hasError = !1, imageUrl = portal.imageUrl;
            return imageUrl || (hasError = !0, imageUrl = "https://lh3.googleusercontent.com/s0kCRS7KE-i0gQhbH_gx-qxvC2kHBJ9TDITirnpzSJnEDV-QVDio5OFl8bJ8OC8EhPGGFOFje5HeO9M6RDklZ971e8aSPeLs"), 
            imageUrl.startsWith("http:") && (imageUrl = imageUrl.replace("http:", "https:")), 
            {
                mePortal: {
                    $$hashKey: null,
                    guid: portal.guid,
                    description: portal.description,
                    location: {
                        latitude: portal.location.latitude,
                        longitude: portal.location.longitude
                    },
                    imageUrl,
                    isOrnamented: !1,
                    isStartPoint: !1,
                    title: portal.title,
                    type: "PORTAL"
                },
                hasError
            };
        }
        reloadMAT(missionId) {
            const angularApp = this.getAngularApp(), angularHttp = angularApp.injector().get("$http"), angularApi = angularApp.injector().get("Api"), angularTimeout = angularApp.injector().get("$timeout"), wireUtility = angularApp.injector().get("WireUtil"), styles = angularApp.injector().get("Styles");
            angularHttp.post(angularApi.GET_MISSION, {
                mission_id: missionId
            }).success(data => {
                data = wireUtility.convertMissionWireToLocal(data.mission, data.pois);
                const angularscope = this.getAngularAppScope();
                angularscope.mission = data, angularTimeout(() => {
                    angularscope.waypointMarkers = (waypoints => {
                        const d = [];
                        return angular.forEach(waypoints, (a, b) => {
                            const c = ((b, d) => {
                                if (b._poi) {
                                    const c = (d + 1).toString();
                                    return {
                                        id: Math.floor(1e10 * Math.random()),
                                        location: b._poi.location,
                                        icon: angularscope.isWaypointSelected(b) ? styles.SELECTED_WAYPOINT_ICON : styles.WAYPOINT_ICON,
                                        onClicked: function() {
                                            angularscope.$apply(() => {
                                                angularscope.setSelectedWaypoint(b, !0);
                                            });
                                        },
                                        options: {
                                            labelAnchor: styles.WAYPOINT_LABEL_ANCHOR,
                                            labelClass: "waypoint-label",
                                            labelContent: c,
                                            zIndex: styles.WAYPOINT_MARKER_Z_INDEX
                                        },
                                        latitude: b._poi.location.latitude,
                                        longitude: b._poi.location.longitude
                                    };
                                }
                            })(a, b);
                            d.push(c);
                        }), d;
                    })(angularscope.mission.definition.waypoints), angularscope.$apply(), notification("UMM Mission import succesful:\n" + angularscope.mission.definition.name);
                });
            }).catch(() => {
                window.alert("Failed to refresh mission, refreshing full page to fix this."), window.location.href = window.location.href;
            });
        }
    };
    main.init();
})();
};


(function () {
  const info = {};
  if (typeof GM_info !== 'undefined' && GM_info && GM_info.script)
    info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
  if (typeof unsafeWindow != 'undefined' || typeof GM_info == 'undefined' || GM_info.scriptHandler != 'Tampermonkey') {

    let pluginContentUMMExt;
    if (window.location.host.match(/^intel.ingress.com$/i)) 
      pluginContentUMMExt = wrapper_iitc;
    else 
      pluginContentUMMExt = wrapper_editor;
    
    const script = document.createElement('script');
    const code = '(' + pluginContentUMMExt + ')(' + JSON.stringify(info) + ');'
    script.appendChild(document.createTextNode(code));
    document.head.appendChild(script);
  } 
})();
