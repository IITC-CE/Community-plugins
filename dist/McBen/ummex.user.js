// ==UserScript==
// @author          McBen, Vashiru, j00rtje, DanielOnDiordna 
// @name            Ultimate Mission Maker - Extended
// @id              ummex@McBen
// @category        Mission
// @version         1.2
// @namespace       https://github.com/IITC-CE/ingress-intel-total-conversion
// @updateURL       https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/McBen/ummex.meta.js
// @downloadURL     https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/McBen/ummex.user.js
// @description     Easily create mission banners (fan update of Ultimate Mission Maker)
// @icon64          data:image/png;base64,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
// @homepageURL     https://github.com/IITCPlugins/umm_ext
// @issueTracker    https://github.com/IITCPlugins/umm_ext/issues
// @recommends      draw-tools@breunigs
// @match           https://intel.ingress.com/*
// @match           https://missions.ingress.com/*
// ==/UserScript==

/**
 * # v1.2
 * 
 * - new Picture dialog - setup Banner images directly in UMM.
 * - added "Sequential" flag
 * - with IMATTC support
 * - reduce map movements
 * 
 * with all this addition you can now import a mission in minimal Steps:
 * 
 * 1.  load banner json
 * 2.  select mission
 * 3.  click "import"
 * 4.  submit mission
 *     (repeat 2-4 for all missions)
 * 
 * # v1.1.2
 * 
 * - fix: dialogs auto open on load - forgotten debug code
 *   (nah, the truth: the build script should have removed it, but it failed)
 * 
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
/*! For license information please see iitc.user.js.LICENSE.txt */
(() => {
    var __webpack_modules__ = {
        707(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601), _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314), ___CSS_LOADER_EXPORT___ = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            ___CSS_LOADER_EXPORT___.push([ module.id, "#umm-mission-picker-info{border:1px solid #ff0;border-radius:2px;display:flex;margin:1em 4px 4px}#umm-mission-picker-info .umm-tile{margin-left:auto;max-height:7em}.umm-mission-btn{margin-bottom:2px;margin-right:1em;margin-top:2px}.umm-mission-btn.w-full{width:90%}.umm-notification{background-color:#383838;border-radius:2px;-webkit-box-shadow:0 0 24px -1px #383838;-moz-box-shadow:0 0 24px -1px #383838;box-shadow:0 0 24px -1px #383838;color:#f0f0f0;font-family:Calibri,sans-serif;font-size:20px;height:auto;left:50%;margin-left:-100px;padding:10px;position:absolute;text-align:center;top:20px;width:300px;z-index:10000}.umm-options-list{overflow:hidden}.umm-options-list .banner_info{border:1px solid grey;border-radius:2px;margin-top:0;min-height:7.1em;padding:4px;position:relative}.umm-options-list .banner_info .title{font:700;font-size:large}.umm-options-list .banner_info .description{font-size:small;margin-bottom:.5em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.umm-options-list .banner_info .stat{font-weight:700;margin-left:.4em}.umm-options-list .banner_info #umm_opt_error{padding-top:.5em}.umm-options-list .banner_info #umm_opt_error .error{color:#ffa0a0;font-weight:700}.umm-options-list .banner_info .editButton{bottom:0;position:absolute;right:0}.umm-options-list .banner_info .imageButton{bottom:0;position:absolute;right:3em}.umm-options-list a{background:rgba(8,48,78,.9);border:1px solid #ffce00;color:#ffce00;display:block;margin:10px auto;padding:3px 0;text-align:center;width:80%}#dialog-umm-edit-mission-set-details{background-color:rgba(8,48,78,.9)}.umm-edit-mission-set-details p{display:block;margin:5px 0 8px}.umm-edit-mission-set-details label{display:block;margin-bottom:5px}.umm-edit-mission-set-details input[type=number],.umm-edit-mission-set-details input[type=text],.umm-edit-mission-set-details textarea{margin-bottom:15px;width:100%}.umm-edit-mission-set-details textarea{background-color:#062844;color:#ffce00;font-family:inherit;resize:vertical;width:calc(100% - 6px)}.umm-edit-mission-set-details span.umm-error{color:#fff;display:block;display:none;margin-bottom:5px}.umm-edit-mission-set-details span.umm-error b{color:red}.umm-dialog-button{margin-left:5px}.umm-mission-marker .start{fill:#16d4b2;stroke:#005243;stroke-miterlimit:10}.umm-mission-marker .active{fill:#6832da;stroke:#16043f;stroke-miterlimit:10}.umm-mission-number{color:#000;font-family:monospace;font-size:14px;font-weight:700;left:0;position:absolute;text-align:center;top:6px;width:34px}#umm-waypoint-editor{border-bottom:1px solid #20a8b1;border-top:1px solid #20a8b1;box-sizing:border-box;color:#ffce00;display:flex;flex-direction:column;margin-bottom:10px;margin-top:10px;padding:8px 5px;width:100%}.umm-waypoint-editor-title{font-weight:700;margin-bottom:6px}.umm-waypoint-select-container{display:flex;flex-direction:row;width:100%}.umm-waypoint-select-container>select{background-color:#062844;border:none;color:#ffce00;height:24px}#umm-mission-select{width:60px}#umm-action-select{margin-left:4px;width:100%}#umm-passphrase-container{display:none;flex-direction:column;margin-top:5px}#umm-passphrase-container>span{margin-bottom:3px}#umm-passphrase-container>input,#umm-passphrase-container>textarea{background-color:#062844;border:none;color:#ffce00;font-family:Arial;margin-bottom:5px;min-height:24px;padding:3px;resize:vertical}.umm-confirm.no_title .ui-dialog-titlebar{display:none}.umm-confirm .header{font-size:1.4em;line-height:1.4em;margin:10px;overflow:hidden;text-align:center;text-overflow:ellipsis}.umm-confirm .details{color:#ccc;text-align:center}.um-helpTooltip{cursor:help;font-size:small;margin-left:5px}.dialog-umm_image_edit{max-width:unset}#dialog-umm_image_edit .container{box-sizing:border-box;display:flex;flex-direction:column;height:100%}#dialog-umm_image_edit .imageContainer{display:grid;flex:1 1 auto;gap:0;grid-auto-rows:auto;grid-template-columns:repeat(6,minmax(0,1fr));line-height:0;min-height:100px;overflow:auto;width:100%}#dialog-umm_image_edit .umm_group_container{display:flex;flex:0 0 auto;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:8px}#dialog-umm_image_edit .umm_group{border:1px solid #ccc;border-radius:4px;display:flex;flex-direction:column;padding:4px 16px 16px}.umm-tile{aspect-ratio:1/1;box-sizing:border-box;position:relative;user-select:none}.umm-tile.selected{border:2px solid #ff0;border-radius:5px}.umm-tile.border{border-bottom:1px solid gray;border-right:1px solid gray}.umm-tile .image{background-color:#000;height:100%;width:100%}.umm-tile .overlay{height:100%;left:0;position:absolute;top:0;width:100%}", "" ]);
            const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
            __webpack_require__.d(__webpack_exports__, [ "A", 0, __WEBPACK_DEFAULT_EXPORT__ ]);
        },
        314(module) {
            "use strict";
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
            "use strict";
            module.exports = function(i) {
                return i[1];
            };
        },
        790(module, __unused_webpack_exports, __webpack_require__) {
            module.exports = function e(t, n, r) {
                function s(o, u) {
                    if (!n[o]) {
                        if (!t[o]) {
                            if (i) return i(o, !0);
                            var f = new Error("Cannot find module '" + o + "'");
                            throw f.code = "MODULE_NOT_FOUND", f;
                        }
                        var l = n[o] = {
                            exports: {}
                        };
                        t[o][0].call(l.exports, function(e) {
                            var n = t[o][1][e];
                            return s(n || e);
                        }, l, l.exports, e, t, n, r);
                    }
                    return n[o].exports;
                }
                for (var i = void 0, o = 0; o < r.length; o++) s(r[o]);
                return s;
            }({
                1: [ function(_dereq_, module, exports) {
                    (function(global) {
                        "use strict";
                        var scheduleDrain, draining, Mutation = global.MutationObserver || global.WebKitMutationObserver;
                        if (Mutation) {
                            var called = 0, observer = new Mutation(nextTick), element = global.document.createTextNode("");
                            observer.observe(element, {
                                characterData: !0
                            }), scheduleDrain = function() {
                                element.data = called = ++called % 2;
                            };
                        } else if (global.setImmediate || void 0 === global.MessageChannel) scheduleDrain = "document" in global && "onreadystatechange" in global.document.createElement("script") ? function() {
                            var scriptEl = global.document.createElement("script");
                            scriptEl.onreadystatechange = function() {
                                nextTick(), scriptEl.onreadystatechange = null, scriptEl.parentNode.removeChild(scriptEl), 
                                scriptEl = null;
                            }, global.document.documentElement.appendChild(scriptEl);
                        } : function() {
                            setTimeout(nextTick, 0);
                        }; else {
                            var channel = new global.MessageChannel;
                            channel.port1.onmessage = nextTick, scheduleDrain = function() {
                                channel.port2.postMessage(0);
                            };
                        }
                        var queue = [];
                        function nextTick() {
                            var i, oldQueue;
                            draining = !0;
                            for (var len = queue.length; len; ) {
                                for (oldQueue = queue, queue = [], i = -1; ++i < len; ) oldQueue[i]();
                                len = queue.length;
                            }
                            draining = !1;
                        }
                        function immediate(task) {
                            1 !== queue.push(task) || draining || scheduleDrain();
                        }
                        module.exports = immediate;
                    }).call(this, void 0 !== __webpack_require__.g ? __webpack_require__.g : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
                }, {} ],
                2: [ function(_dereq_, module, exports) {
                    "use strict";
                    var immediate = _dereq_(1);
                    function INTERNAL() {}
                    var handlers = {}, REJECTED = [ "REJECTED" ], FULFILLED = [ "FULFILLED" ], PENDING = [ "PENDING" ];
                    function Promise(resolver) {
                        if ("function" != typeof resolver) throw new TypeError("resolver must be a function");
                        this.state = PENDING, this.queue = [], this.outcome = void 0, resolver !== INTERNAL && safelyResolveThenable(this, resolver);
                    }
                    function QueueItem(promise, onFulfilled, onRejected) {
                        this.promise = promise, "function" == typeof onFulfilled && (this.onFulfilled = onFulfilled, 
                        this.callFulfilled = this.otherCallFulfilled), "function" == typeof onRejected && (this.onRejected = onRejected, 
                        this.callRejected = this.otherCallRejected);
                    }
                    function unwrap(promise, func, value) {
                        immediate(function() {
                            var returnValue;
                            try {
                                returnValue = func(value);
                            } catch (e) {
                                return handlers.reject(promise, e);
                            }
                            returnValue === promise ? handlers.reject(promise, new TypeError("Cannot resolve promise with itself")) : handlers.resolve(promise, returnValue);
                        });
                    }
                    function getThen(obj) {
                        var then = obj && obj.then;
                        if (obj && ("object" == typeof obj || "function" == typeof obj) && "function" == typeof then) return function appyThen() {
                            then.apply(obj, arguments);
                        };
                    }
                    function safelyResolveThenable(self, thenable) {
                        var called = !1;
                        function onError(value) {
                            called || (called = !0, handlers.reject(self, value));
                        }
                        function onSuccess(value) {
                            called || (called = !0, handlers.resolve(self, value));
                        }
                        function tryToUnwrap() {
                            thenable(onSuccess, onError);
                        }
                        var result = tryCatch(tryToUnwrap);
                        "error" === result.status && onError(result.value);
                    }
                    function tryCatch(func, value) {
                        var out = {};
                        try {
                            out.value = func(value), out.status = "success";
                        } catch (e) {
                            out.status = "error", out.value = e;
                        }
                        return out;
                    }
                    function resolve(value) {
                        return value instanceof this ? value : handlers.resolve(new this(INTERNAL), value);
                    }
                    function reject(reason) {
                        var promise = new this(INTERNAL);
                        return handlers.reject(promise, reason);
                    }
                    function all(iterable) {
                        var self = this;
                        if ("[object Array]" !== Object.prototype.toString.call(iterable)) return this.reject(new TypeError("must be an array"));
                        var len = iterable.length, called = !1;
                        if (!len) return this.resolve([]);
                        for (var values = new Array(len), resolved = 0, i = -1, promise = new this(INTERNAL); ++i < len; ) allResolver(iterable[i], i);
                        return promise;
                        function allResolver(value, i) {
                            function resolveFromAll(outValue) {
                                values[i] = outValue, ++resolved !== len || called || (called = !0, handlers.resolve(promise, values));
                            }
                            self.resolve(value).then(resolveFromAll, function(error) {
                                called || (called = !0, handlers.reject(promise, error));
                            });
                        }
                    }
                    function race(iterable) {
                        var self = this;
                        if ("[object Array]" !== Object.prototype.toString.call(iterable)) return this.reject(new TypeError("must be an array"));
                        var len = iterable.length, called = !1;
                        if (!len) return this.resolve([]);
                        for (var i = -1, promise = new this(INTERNAL); ++i < len; ) resolver(iterable[i]);
                        return promise;
                        function resolver(value) {
                            self.resolve(value).then(function(response) {
                                called || (called = !0, handlers.resolve(promise, response));
                            }, function(error) {
                                called || (called = !0, handlers.reject(promise, error));
                            });
                        }
                    }
                    module.exports = Promise, Promise.prototype.catch = function(onRejected) {
                        return this.then(null, onRejected);
                    }, Promise.prototype.then = function(onFulfilled, onRejected) {
                        if ("function" != typeof onFulfilled && this.state === FULFILLED || "function" != typeof onRejected && this.state === REJECTED) return this;
                        var promise = new this.constructor(INTERNAL);
                        return this.state !== PENDING ? unwrap(promise, this.state === FULFILLED ? onFulfilled : onRejected, this.outcome) : this.queue.push(new QueueItem(promise, onFulfilled, onRejected)), 
                        promise;
                    }, QueueItem.prototype.callFulfilled = function(value) {
                        handlers.resolve(this.promise, value);
                    }, QueueItem.prototype.otherCallFulfilled = function(value) {
                        unwrap(this.promise, this.onFulfilled, value);
                    }, QueueItem.prototype.callRejected = function(value) {
                        handlers.reject(this.promise, value);
                    }, QueueItem.prototype.otherCallRejected = function(value) {
                        unwrap(this.promise, this.onRejected, value);
                    }, handlers.resolve = function(self, value) {
                        var result = tryCatch(getThen, value);
                        if ("error" === result.status) return handlers.reject(self, result.value);
                        var thenable = result.value;
                        if (thenable) safelyResolveThenable(self, thenable); else {
                            self.state = FULFILLED, self.outcome = value;
                            for (var i = -1, len = self.queue.length; ++i < len; ) self.queue[i].callFulfilled(value);
                        }
                        return self;
                    }, handlers.reject = function(self, error) {
                        self.state = REJECTED, self.outcome = error;
                        for (var i = -1, len = self.queue.length; ++i < len; ) self.queue[i].callRejected(error);
                        return self;
                    }, Promise.resolve = resolve, Promise.reject = reject, Promise.all = all, Promise.race = race;
                }, {
                    1: 1
                } ],
                3: [ function(_dereq_, module, exports) {
                    (function(global) {
                        "use strict";
                        "function" != typeof global.Promise && (global.Promise = _dereq_(2));
                    }).call(this, void 0 !== __webpack_require__.g ? __webpack_require__.g : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
                }, {
                    2: 2
                } ],
                4: [ function(_dereq_, module, exports) {
                    "use strict";
                    var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                        return typeof obj;
                    } : function(obj) {
                        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                    };
                    function _classCallCheck(instance, Constructor) {
                        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
                    }
                    function getIDB() {
                        try {
                            if ("undefined" != typeof indexedDB) return indexedDB;
                            if ("undefined" != typeof webkitIndexedDB) return webkitIndexedDB;
                            if ("undefined" != typeof mozIndexedDB) return mozIndexedDB;
                            if ("undefined" != typeof OIndexedDB) return OIndexedDB;
                            if ("undefined" != typeof msIndexedDB) return msIndexedDB;
                        } catch (e) {
                            return;
                        }
                    }
                    var idb = getIDB();
                    function isIndexedDBValid() {
                        try {
                            if (!idb || !idb.open) return !1;
                            var isSafari = "undefined" != typeof openDatabase && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform), hasFetch = "function" == typeof fetch && -1 !== fetch.toString().indexOf("[native code");
                            return (!isSafari || hasFetch) && "undefined" != typeof indexedDB && "undefined" != typeof IDBKeyRange;
                        } catch (e) {
                            return !1;
                        }
                    }
                    function createBlob(parts, properties) {
                        parts = parts || [], properties = properties || {};
                        try {
                            return new Blob(parts, properties);
                        } catch (e) {
                            if ("TypeError" !== e.name) throw e;
                            for (var builder = new ("undefined" != typeof BlobBuilder ? BlobBuilder : "undefined" != typeof MSBlobBuilder ? MSBlobBuilder : "undefined" != typeof MozBlobBuilder ? MozBlobBuilder : WebKitBlobBuilder), i = 0; i < parts.length; i += 1) builder.append(parts[i]);
                            return builder.getBlob(properties.type);
                        }
                    }
                    "undefined" == typeof Promise && _dereq_(3);
                    var Promise$1 = Promise;
                    function executeCallback(promise, callback) {
                        callback && promise.then(function(result) {
                            callback(null, result);
                        }, function(error) {
                            callback(error);
                        });
                    }
                    function executeTwoCallbacks(promise, callback, errorCallback) {
                        "function" == typeof callback && promise.then(callback), "function" == typeof errorCallback && promise.catch(errorCallback);
                    }
                    function normalizeKey(key) {
                        return "string" != typeof key && (console.warn(key + " used as a key, but it is not a string."), 
                        key = String(key)), key;
                    }
                    function getCallback() {
                        if (arguments.length && "function" == typeof arguments[arguments.length - 1]) return arguments[arguments.length - 1];
                    }
                    var DETECT_BLOB_SUPPORT_STORE = "local-forage-detect-blob-support", supportsBlobs = void 0, dbContexts = {}, toString = Object.prototype.toString, READ_ONLY = "readonly", READ_WRITE = "readwrite";
                    function _binStringToArrayBuffer(bin) {
                        for (var length = bin.length, buf = new ArrayBuffer(length), arr = new Uint8Array(buf), i = 0; i < length; i++) arr[i] = bin.charCodeAt(i);
                        return buf;
                    }
                    function _checkBlobSupportWithoutCaching(idb) {
                        return new Promise$1(function(resolve) {
                            var txn = idb.transaction(DETECT_BLOB_SUPPORT_STORE, READ_WRITE), blob = createBlob([ "" ]);
                            txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, "key"), txn.onabort = function(e) {
                                e.preventDefault(), e.stopPropagation(), resolve(!1);
                            }, txn.oncomplete = function() {
                                var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/), matchedEdge = navigator.userAgent.match(/Edge\//);
                                resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
                            };
                        }).catch(function() {
                            return !1;
                        });
                    }
                    function _checkBlobSupport(idb) {
                        return "boolean" == typeof supportsBlobs ? Promise$1.resolve(supportsBlobs) : _checkBlobSupportWithoutCaching(idb).then(function(value) {
                            return supportsBlobs = value;
                        });
                    }
                    function _deferReadiness(dbInfo) {
                        var dbContext = dbContexts[dbInfo.name], deferredOperation = {};
                        deferredOperation.promise = new Promise$1(function(resolve, reject) {
                            deferredOperation.resolve = resolve, deferredOperation.reject = reject;
                        }), dbContext.deferredOperations.push(deferredOperation), dbContext.dbReady ? dbContext.dbReady = dbContext.dbReady.then(function() {
                            return deferredOperation.promise;
                        }) : dbContext.dbReady = deferredOperation.promise;
                    }
                    function _advanceReadiness(dbInfo) {
                        var deferredOperation = dbContexts[dbInfo.name].deferredOperations.pop();
                        if (deferredOperation) return deferredOperation.resolve(), deferredOperation.promise;
                    }
                    function _rejectReadiness(dbInfo, err) {
                        var deferredOperation = dbContexts[dbInfo.name].deferredOperations.pop();
                        if (deferredOperation) return deferredOperation.reject(err), deferredOperation.promise;
                    }
                    function _getConnection(dbInfo, upgradeNeeded) {
                        return new Promise$1(function(resolve, reject) {
                            if (dbContexts[dbInfo.name] = dbContexts[dbInfo.name] || createDbContext(), dbInfo.db) {
                                if (!upgradeNeeded) return resolve(dbInfo.db);
                                _deferReadiness(dbInfo), dbInfo.db.close();
                            }
                            var dbArgs = [ dbInfo.name ];
                            upgradeNeeded && dbArgs.push(dbInfo.version);
                            var openreq = idb.open.apply(idb, dbArgs);
                            upgradeNeeded && (openreq.onupgradeneeded = function(e) {
                                var db = openreq.result;
                                try {
                                    db.createObjectStore(dbInfo.storeName), e.oldVersion <= 1 && db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
                                } catch (ex) {
                                    if ("ConstraintError" !== ex.name) throw ex;
                                    console.warn('The database "' + dbInfo.name + '" has been upgraded from version ' + e.oldVersion + " to version " + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
                                }
                            }), openreq.onerror = function(e) {
                                e.preventDefault(), reject(openreq.error);
                            }, openreq.onsuccess = function() {
                                var db = openreq.result;
                                db.onversionchange = function(e) {
                                    e.target.close();
                                }, resolve(db), _advanceReadiness(dbInfo);
                            };
                        });
                    }
                    function _getOriginalConnection(dbInfo) {
                        return _getConnection(dbInfo, !1);
                    }
                    function _getUpgradedConnection(dbInfo) {
                        return _getConnection(dbInfo, !0);
                    }
                    function _isUpgradeNeeded(dbInfo, defaultVersion) {
                        if (!dbInfo.db) return !0;
                        var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName), isDowngrade = dbInfo.version < dbInfo.db.version, isUpgrade = dbInfo.version > dbInfo.db.version;
                        if (isDowngrade && (dbInfo.version !== defaultVersion && console.warn('The database "' + dbInfo.name + "\" can't be downgraded from version " + dbInfo.db.version + " to version " + dbInfo.version + "."), 
                        dbInfo.version = dbInfo.db.version), isUpgrade || isNewStore) {
                            if (isNewStore) {
                                var incVersion = dbInfo.db.version + 1;
                                incVersion > dbInfo.version && (dbInfo.version = incVersion);
                            }
                            return !0;
                        }
                        return !1;
                    }
                    function _encodeBlob(blob) {
                        return new Promise$1(function(resolve, reject) {
                            var reader = new FileReader;
                            reader.onerror = reject, reader.onloadend = function(e) {
                                var base64 = btoa(e.target.result || "");
                                resolve({
                                    __local_forage_encoded_blob: !0,
                                    data: base64,
                                    type: blob.type
                                });
                            }, reader.readAsBinaryString(blob);
                        });
                    }
                    function _decodeBlob(encodedBlob) {
                        return createBlob([ _binStringToArrayBuffer(atob(encodedBlob.data)) ], {
                            type: encodedBlob.type
                        });
                    }
                    function _isEncodedBlob(value) {
                        return value && value.__local_forage_encoded_blob;
                    }
                    function _fullyReady(callback) {
                        var self = this, promise = self._initReady().then(function() {
                            var dbContext = dbContexts[self._dbInfo.name];
                            if (dbContext && dbContext.dbReady) return dbContext.dbReady;
                        });
                        return executeTwoCallbacks(promise, callback, callback), promise;
                    }
                    function _tryReconnect(dbInfo) {
                        _deferReadiness(dbInfo);
                        for (var dbContext = dbContexts[dbInfo.name], forages = dbContext.forages, i = 0; i < forages.length; i++) {
                            var forage = forages[i];
                            forage._dbInfo.db && (forage._dbInfo.db.close(), forage._dbInfo.db = null);
                        }
                        return dbInfo.db = null, _getOriginalConnection(dbInfo).then(function(db) {
                            return dbInfo.db = db, _isUpgradeNeeded(dbInfo) ? _getUpgradedConnection(dbInfo) : db;
                        }).then(function(db) {
                            dbInfo.db = dbContext.db = db;
                            for (var i = 0; i < forages.length; i++) forages[i]._dbInfo.db = db;
                        }).catch(function(err) {
                            throw _rejectReadiness(dbInfo, err), err;
                        });
                    }
                    function createTransaction(dbInfo, mode, callback, retries) {
                        void 0 === retries && (retries = 1);
                        try {
                            var tx = dbInfo.db.transaction(dbInfo.storeName, mode);
                            callback(null, tx);
                        } catch (err) {
                            if (retries > 0 && (!dbInfo.db || "InvalidStateError" === err.name || "NotFoundError" === err.name)) return Promise$1.resolve().then(function() {
                                if (!dbInfo.db || "NotFoundError" === err.name && !dbInfo.db.objectStoreNames.contains(dbInfo.storeName) && dbInfo.version <= dbInfo.db.version) return dbInfo.db && (dbInfo.version = dbInfo.db.version + 1), 
                                _getUpgradedConnection(dbInfo);
                            }).then(function() {
                                return _tryReconnect(dbInfo).then(function() {
                                    createTransaction(dbInfo, mode, callback, retries - 1);
                                });
                            }).catch(callback);
                            callback(err);
                        }
                    }
                    function createDbContext() {
                        return {
                            forages: [],
                            db: null,
                            dbReady: null,
                            deferredOperations: []
                        };
                    }
                    function _initStorage(options) {
                        var self = this, dbInfo = {
                            db: null
                        };
                        if (options) for (var i in options) dbInfo[i] = options[i];
                        var dbContext = dbContexts[dbInfo.name];
                        dbContext || (dbContext = createDbContext(), dbContexts[dbInfo.name] = dbContext), 
                        dbContext.forages.push(self), self._initReady || (self._initReady = self.ready, 
                        self.ready = _fullyReady);
                        var initPromises = [];
                        function ignoreErrors() {
                            return Promise$1.resolve();
                        }
                        for (var j = 0; j < dbContext.forages.length; j++) {
                            var forage = dbContext.forages[j];
                            forage !== self && initPromises.push(forage._initReady().catch(ignoreErrors));
                        }
                        var forages = dbContext.forages.slice(0);
                        return Promise$1.all(initPromises).then(function() {
                            return dbInfo.db = dbContext.db, _getOriginalConnection(dbInfo);
                        }).then(function(db) {
                            return dbInfo.db = db, _isUpgradeNeeded(dbInfo, self._defaultConfig.version) ? _getUpgradedConnection(dbInfo) : db;
                        }).then(function(db) {
                            dbInfo.db = dbContext.db = db, self._dbInfo = dbInfo;
                            for (var k = 0; k < forages.length; k++) {
                                var forage = forages[k];
                                forage !== self && (forage._dbInfo.db = dbInfo.db, forage._dbInfo.version = dbInfo.version);
                            }
                        });
                    }
                    function getItem(key, callback) {
                        var self = this;
                        key = normalizeKey(key);
                        var promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                createTransaction(self._dbInfo, READ_ONLY, function(err, transaction) {
                                    if (err) return reject(err);
                                    try {
                                        var req = transaction.objectStore(self._dbInfo.storeName).get(key);
                                        req.onsuccess = function() {
                                            var value = req.result;
                                            void 0 === value && (value = null), _isEncodedBlob(value) && (value = _decodeBlob(value)), 
                                            resolve(value);
                                        }, req.onerror = function() {
                                            reject(req.error);
                                        };
                                    } catch (e) {
                                        reject(e);
                                    }
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function iterate(iterator, callback) {
                        var self = this, promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                createTransaction(self._dbInfo, READ_ONLY, function(err, transaction) {
                                    if (err) return reject(err);
                                    try {
                                        var req = transaction.objectStore(self._dbInfo.storeName).openCursor(), iterationNumber = 1;
                                        req.onsuccess = function() {
                                            var cursor = req.result;
                                            if (cursor) {
                                                var value = cursor.value;
                                                _isEncodedBlob(value) && (value = _decodeBlob(value));
                                                var result = iterator(value, cursor.key, iterationNumber++);
                                                void 0 !== result ? resolve(result) : cursor.continue();
                                            } else resolve();
                                        }, req.onerror = function() {
                                            reject(req.error);
                                        };
                                    } catch (e) {
                                        reject(e);
                                    }
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function setItem(key, value, callback) {
                        var self = this;
                        key = normalizeKey(key);
                        var promise = new Promise$1(function(resolve, reject) {
                            var dbInfo;
                            self.ready().then(function() {
                                return dbInfo = self._dbInfo, "[object Blob]" === toString.call(value) ? _checkBlobSupport(dbInfo.db).then(function(blobSupport) {
                                    return blobSupport ? value : _encodeBlob(value);
                                }) : value;
                            }).then(function(value) {
                                createTransaction(self._dbInfo, READ_WRITE, function(err, transaction) {
                                    if (err) return reject(err);
                                    try {
                                        var store = transaction.objectStore(self._dbInfo.storeName);
                                        null === value && (value = void 0);
                                        var req = store.put(value, key);
                                        transaction.oncomplete = function() {
                                            void 0 === value && (value = null), resolve(value);
                                        }, transaction.onabort = transaction.onerror = function() {
                                            var err = req.error ? req.error : req.transaction.error;
                                            reject(err);
                                        };
                                    } catch (e) {
                                        reject(e);
                                    }
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function removeItem(key, callback) {
                        var self = this;
                        key = normalizeKey(key);
                        var promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                createTransaction(self._dbInfo, READ_WRITE, function(err, transaction) {
                                    if (err) return reject(err);
                                    try {
                                        var req = transaction.objectStore(self._dbInfo.storeName).delete(key);
                                        transaction.oncomplete = function() {
                                            resolve();
                                        }, transaction.onerror = function() {
                                            reject(req.error);
                                        }, transaction.onabort = function() {
                                            var err = req.error ? req.error : req.transaction.error;
                                            reject(err);
                                        };
                                    } catch (e) {
                                        reject(e);
                                    }
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function clear(callback) {
                        var self = this, promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                createTransaction(self._dbInfo, READ_WRITE, function(err, transaction) {
                                    if (err) return reject(err);
                                    try {
                                        var req = transaction.objectStore(self._dbInfo.storeName).clear();
                                        transaction.oncomplete = function() {
                                            resolve();
                                        }, transaction.onabort = transaction.onerror = function() {
                                            var err = req.error ? req.error : req.transaction.error;
                                            reject(err);
                                        };
                                    } catch (e) {
                                        reject(e);
                                    }
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function length(callback) {
                        var self = this, promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                createTransaction(self._dbInfo, READ_ONLY, function(err, transaction) {
                                    if (err) return reject(err);
                                    try {
                                        var req = transaction.objectStore(self._dbInfo.storeName).count();
                                        req.onsuccess = function() {
                                            resolve(req.result);
                                        }, req.onerror = function() {
                                            reject(req.error);
                                        };
                                    } catch (e) {
                                        reject(e);
                                    }
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function key(n, callback) {
                        var self = this, promise = new Promise$1(function(resolve, reject) {
                            n < 0 ? resolve(null) : self.ready().then(function() {
                                createTransaction(self._dbInfo, READ_ONLY, function(err, transaction) {
                                    if (err) return reject(err);
                                    try {
                                        var store = transaction.objectStore(self._dbInfo.storeName), advanced = !1, req = store.openKeyCursor();
                                        req.onsuccess = function() {
                                            var cursor = req.result;
                                            cursor ? 0 === n || advanced ? resolve(cursor.key) : (advanced = !0, cursor.advance(n)) : resolve(null);
                                        }, req.onerror = function() {
                                            reject(req.error);
                                        };
                                    } catch (e) {
                                        reject(e);
                                    }
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function keys(callback) {
                        var self = this, promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                createTransaction(self._dbInfo, READ_ONLY, function(err, transaction) {
                                    if (err) return reject(err);
                                    try {
                                        var req = transaction.objectStore(self._dbInfo.storeName).openKeyCursor(), keys = [];
                                        req.onsuccess = function() {
                                            var cursor = req.result;
                                            cursor ? (keys.push(cursor.key), cursor.continue()) : resolve(keys);
                                        }, req.onerror = function() {
                                            reject(req.error);
                                        };
                                    } catch (e) {
                                        reject(e);
                                    }
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function dropInstance(options, callback) {
                        callback = getCallback.apply(this, arguments);
                        var currentConfig = this.config();
                        (options = "function" != typeof options && options || {}).name || (options.name = options.name || currentConfig.name, 
                        options.storeName = options.storeName || currentConfig.storeName);
                        var promise, self = this;
                        if (options.name) {
                            var dbPromise = options.name === currentConfig.name && self._dbInfo.db ? Promise$1.resolve(self._dbInfo.db) : _getOriginalConnection(options).then(function(db) {
                                var dbContext = dbContexts[options.name], forages = dbContext.forages;
                                dbContext.db = db;
                                for (var i = 0; i < forages.length; i++) forages[i]._dbInfo.db = db;
                                return db;
                            });
                            promise = options.storeName ? dbPromise.then(function(db) {
                                if (db.objectStoreNames.contains(options.storeName)) {
                                    var newVersion = db.version + 1;
                                    _deferReadiness(options);
                                    var dbContext = dbContexts[options.name], forages = dbContext.forages;
                                    db.close();
                                    for (var i = 0; i < forages.length; i++) {
                                        var forage = forages[i];
                                        forage._dbInfo.db = null, forage._dbInfo.version = newVersion;
                                    }
                                    var dropObjectPromise = new Promise$1(function(resolve, reject) {
                                        var req = idb.open(options.name, newVersion);
                                        req.onerror = function(err) {
                                            req.result.close(), reject(err);
                                        }, req.onupgradeneeded = function() {
                                            req.result.deleteObjectStore(options.storeName);
                                        }, req.onsuccess = function() {
                                            var db = req.result;
                                            db.close(), resolve(db);
                                        };
                                    });
                                    return dropObjectPromise.then(function(db) {
                                        dbContext.db = db;
                                        for (var j = 0; j < forages.length; j++) {
                                            var _forage2 = forages[j];
                                            _forage2._dbInfo.db = db, _advanceReadiness(_forage2._dbInfo);
                                        }
                                    }).catch(function(err) {
                                        throw (_rejectReadiness(options, err) || Promise$1.resolve()).catch(function() {}), 
                                        err;
                                    });
                                }
                            }) : dbPromise.then(function(db) {
                                _deferReadiness(options);
                                var dbContext = dbContexts[options.name], forages = dbContext.forages;
                                db.close();
                                for (var i = 0; i < forages.length; i++) forages[i]._dbInfo.db = null;
                                var dropDBPromise = new Promise$1(function(resolve, reject) {
                                    var req = idb.deleteDatabase(options.name);
                                    req.onerror = function() {
                                        var db = req.result;
                                        db && db.close(), reject(req.error);
                                    }, req.onblocked = function() {
                                        console.warn('dropInstance blocked for database "' + options.name + '" until all open connections are closed');
                                    }, req.onsuccess = function() {
                                        var db = req.result;
                                        db && db.close(), resolve(db);
                                    };
                                });
                                return dropDBPromise.then(function(db) {
                                    dbContext.db = db;
                                    for (var i = 0; i < forages.length; i++) _advanceReadiness(forages[i]._dbInfo);
                                }).catch(function(err) {
                                    throw (_rejectReadiness(options, err) || Promise$1.resolve()).catch(function() {}), 
                                    err;
                                });
                            });
                        } else promise = Promise$1.reject("Invalid arguments");
                        return executeCallback(promise, callback), promise;
                    }
                    var asyncStorage = {
                        _driver: "asyncStorage",
                        _initStorage,
                        _support: isIndexedDBValid(),
                        iterate,
                        getItem,
                        setItem,
                        removeItem,
                        clear,
                        length,
                        key,
                        keys,
                        dropInstance
                    };
                    function isWebSQLValid() {
                        return "function" == typeof openDatabase;
                    }
                    var BASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", BLOB_TYPE_PREFIX = "~~local_forage_type~", BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/, SERIALIZED_MARKER = "__lfsc__:", SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length, TYPE_ARRAYBUFFER = "arbf", TYPE_BLOB = "blob", TYPE_INT8ARRAY = "si08", TYPE_UINT8ARRAY = "ui08", TYPE_UINT8CLAMPEDARRAY = "uic8", TYPE_INT16ARRAY = "si16", TYPE_INT32ARRAY = "si32", TYPE_UINT16ARRAY = "ur16", TYPE_UINT32ARRAY = "ui32", TYPE_FLOAT32ARRAY = "fl32", TYPE_FLOAT64ARRAY = "fl64", TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length, toString$1 = Object.prototype.toString;
                    function stringToBuffer(serializedString) {
                        var i, encoded1, encoded2, encoded3, encoded4, bufferLength = .75 * serializedString.length, len = serializedString.length, p = 0;
                        "=" === serializedString[serializedString.length - 1] && (bufferLength--, "=" === serializedString[serializedString.length - 2] && bufferLength--);
                        var buffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(buffer);
                        for (i = 0; i < len; i += 4) encoded1 = BASE_CHARS.indexOf(serializedString[i]), 
                        encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]), encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]), 
                        encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]), bytes[p++] = encoded1 << 2 | encoded2 >> 4, 
                        bytes[p++] = (15 & encoded2) << 4 | encoded3 >> 2, bytes[p++] = (3 & encoded3) << 6 | 63 & encoded4;
                        return buffer;
                    }
                    function bufferToString(buffer) {
                        var i, bytes = new Uint8Array(buffer), base64String = "";
                        for (i = 0; i < bytes.length; i += 3) base64String += BASE_CHARS[bytes[i] >> 2], 
                        base64String += BASE_CHARS[(3 & bytes[i]) << 4 | bytes[i + 1] >> 4], base64String += BASE_CHARS[(15 & bytes[i + 1]) << 2 | bytes[i + 2] >> 6], 
                        base64String += BASE_CHARS[63 & bytes[i + 2]];
                        return bytes.length % 3 == 2 ? base64String = base64String.substring(0, base64String.length - 1) + "=" : bytes.length % 3 == 1 && (base64String = base64String.substring(0, base64String.length - 2) + "=="), 
                        base64String;
                    }
                    function serialize(value, callback) {
                        var valueType = "";
                        if (value && (valueType = toString$1.call(value)), value && ("[object ArrayBuffer]" === valueType || value.buffer && "[object ArrayBuffer]" === toString$1.call(value.buffer))) {
                            var buffer, marker = SERIALIZED_MARKER;
                            value instanceof ArrayBuffer ? (buffer = value, marker += TYPE_ARRAYBUFFER) : (buffer = value.buffer, 
                            "[object Int8Array]" === valueType ? marker += TYPE_INT8ARRAY : "[object Uint8Array]" === valueType ? marker += TYPE_UINT8ARRAY : "[object Uint8ClampedArray]" === valueType ? marker += TYPE_UINT8CLAMPEDARRAY : "[object Int16Array]" === valueType ? marker += TYPE_INT16ARRAY : "[object Uint16Array]" === valueType ? marker += TYPE_UINT16ARRAY : "[object Int32Array]" === valueType ? marker += TYPE_INT32ARRAY : "[object Uint32Array]" === valueType ? marker += TYPE_UINT32ARRAY : "[object Float32Array]" === valueType ? marker += TYPE_FLOAT32ARRAY : "[object Float64Array]" === valueType ? marker += TYPE_FLOAT64ARRAY : callback(new Error("Failed to get type for BinaryArray"))), 
                            callback(marker + bufferToString(buffer));
                        } else if ("[object Blob]" === valueType) {
                            var fileReader = new FileReader;
                            fileReader.onload = function() {
                                var str = BLOB_TYPE_PREFIX + value.type + "~" + bufferToString(this.result);
                                callback(SERIALIZED_MARKER + TYPE_BLOB + str);
                            }, fileReader.readAsArrayBuffer(value);
                        } else try {
                            callback(JSON.stringify(value));
                        } catch (e) {
                            console.error("Couldn't convert value into a JSON string: ", value), callback(null, e);
                        }
                    }
                    function deserialize(value) {
                        if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) return JSON.parse(value);
                        var blobType, serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH), type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);
                        if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
                            var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
                            blobType = matcher[1], serializedString = serializedString.substring(matcher[0].length);
                        }
                        var buffer = stringToBuffer(serializedString);
                        switch (type) {
                          case TYPE_ARRAYBUFFER:
                            return buffer;

                          case TYPE_BLOB:
                            return createBlob([ buffer ], {
                                type: blobType
                            });

                          case TYPE_INT8ARRAY:
                            return new Int8Array(buffer);

                          case TYPE_UINT8ARRAY:
                            return new Uint8Array(buffer);

                          case TYPE_UINT8CLAMPEDARRAY:
                            return new Uint8ClampedArray(buffer);

                          case TYPE_INT16ARRAY:
                            return new Int16Array(buffer);

                          case TYPE_UINT16ARRAY:
                            return new Uint16Array(buffer);

                          case TYPE_INT32ARRAY:
                            return new Int32Array(buffer);

                          case TYPE_UINT32ARRAY:
                            return new Uint32Array(buffer);

                          case TYPE_FLOAT32ARRAY:
                            return new Float32Array(buffer);

                          case TYPE_FLOAT64ARRAY:
                            return new Float64Array(buffer);

                          default:
                            throw new Error("Unkown type: " + type);
                        }
                    }
                    var localforageSerializer = {
                        serialize,
                        deserialize,
                        stringToBuffer,
                        bufferToString
                    };
                    function createDbTable(t, dbInfo, callback, errorCallback) {
                        t.executeSql("CREATE TABLE IF NOT EXISTS " + dbInfo.storeName + " (id INTEGER PRIMARY KEY, key unique, value)", [], callback, errorCallback);
                    }
                    function _initStorage$1(options) {
                        var self = this, dbInfo = {
                            db: null
                        };
                        if (options) for (var i in options) dbInfo[i] = "string" != typeof options[i] ? options[i].toString() : options[i];
                        var dbInfoPromise = new Promise$1(function(resolve, reject) {
                            try {
                                dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
                            } catch (e) {
                                return reject(e);
                            }
                            dbInfo.db.transaction(function(t) {
                                createDbTable(t, dbInfo, function() {
                                    self._dbInfo = dbInfo, resolve();
                                }, function(t, error) {
                                    reject(error);
                                });
                            }, reject);
                        });
                        return dbInfo.serializer = localforageSerializer, dbInfoPromise;
                    }
                    function tryExecuteSql(t, dbInfo, sqlStatement, args, callback, errorCallback) {
                        t.executeSql(sqlStatement, args, callback, function(t, error) {
                            error.code === error.SYNTAX_ERR ? t.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", [ dbInfo.storeName ], function(t, results) {
                                results.rows.length ? errorCallback(t, error) : createDbTable(t, dbInfo, function() {
                                    t.executeSql(sqlStatement, args, callback, errorCallback);
                                }, errorCallback);
                            }, errorCallback) : errorCallback(t, error);
                        }, errorCallback);
                    }
                    function getItem$1(key, callback) {
                        var self = this;
                        key = normalizeKey(key);
                        var promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                var dbInfo = self._dbInfo;
                                dbInfo.db.transaction(function(t) {
                                    tryExecuteSql(t, dbInfo, "SELECT * FROM " + dbInfo.storeName + " WHERE key = ? LIMIT 1", [ key ], function(t, results) {
                                        var result = results.rows.length ? results.rows.item(0).value : null;
                                        result && (result = dbInfo.serializer.deserialize(result)), resolve(result);
                                    }, function(t, error) {
                                        reject(error);
                                    });
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function iterate$1(iterator, callback) {
                        var self = this, promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                var dbInfo = self._dbInfo;
                                dbInfo.db.transaction(function(t) {
                                    tryExecuteSql(t, dbInfo, "SELECT * FROM " + dbInfo.storeName, [], function(t, results) {
                                        for (var rows = results.rows, length = rows.length, i = 0; i < length; i++) {
                                            var item = rows.item(i), result = item.value;
                                            if (result && (result = dbInfo.serializer.deserialize(result)), void 0 !== (result = iterator(result, item.key, i + 1))) return void resolve(result);
                                        }
                                        resolve();
                                    }, function(t, error) {
                                        reject(error);
                                    });
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function _setItem(key, value, callback, retriesLeft) {
                        var self = this;
                        key = normalizeKey(key);
                        var promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                void 0 === value && (value = null);
                                var originalValue = value, dbInfo = self._dbInfo;
                                dbInfo.serializer.serialize(value, function(value, error) {
                                    error ? reject(error) : dbInfo.db.transaction(function(t) {
                                        tryExecuteSql(t, dbInfo, "INSERT OR REPLACE INTO " + dbInfo.storeName + " (key, value) VALUES (?, ?)", [ key, value ], function() {
                                            resolve(originalValue);
                                        }, function(t, error) {
                                            reject(error);
                                        });
                                    }, function(sqlError) {
                                        if (sqlError.code === sqlError.QUOTA_ERR) {
                                            if (retriesLeft > 0) return void resolve(_setItem.apply(self, [ key, originalValue, callback, retriesLeft - 1 ]));
                                            reject(sqlError);
                                        }
                                    });
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function setItem$1(key, value, callback) {
                        return _setItem.apply(this, [ key, value, callback, 1 ]);
                    }
                    function removeItem$1(key, callback) {
                        var self = this;
                        key = normalizeKey(key);
                        var promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                var dbInfo = self._dbInfo;
                                dbInfo.db.transaction(function(t) {
                                    tryExecuteSql(t, dbInfo, "DELETE FROM " + dbInfo.storeName + " WHERE key = ?", [ key ], function() {
                                        resolve();
                                    }, function(t, error) {
                                        reject(error);
                                    });
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function clear$1(callback) {
                        var self = this, promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                var dbInfo = self._dbInfo;
                                dbInfo.db.transaction(function(t) {
                                    tryExecuteSql(t, dbInfo, "DELETE FROM " + dbInfo.storeName, [], function() {
                                        resolve();
                                    }, function(t, error) {
                                        reject(error);
                                    });
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function length$1(callback) {
                        var self = this, promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                var dbInfo = self._dbInfo;
                                dbInfo.db.transaction(function(t) {
                                    tryExecuteSql(t, dbInfo, "SELECT COUNT(key) as c FROM " + dbInfo.storeName, [], function(t, results) {
                                        var result = results.rows.item(0).c;
                                        resolve(result);
                                    }, function(t, error) {
                                        reject(error);
                                    });
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function key$1(n, callback) {
                        var self = this, promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                var dbInfo = self._dbInfo;
                                dbInfo.db.transaction(function(t) {
                                    tryExecuteSql(t, dbInfo, "SELECT key FROM " + dbInfo.storeName + " WHERE id = ? LIMIT 1", [ n + 1 ], function(t, results) {
                                        var result = results.rows.length ? results.rows.item(0).key : null;
                                        resolve(result);
                                    }, function(t, error) {
                                        reject(error);
                                    });
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function keys$1(callback) {
                        var self = this, promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                var dbInfo = self._dbInfo;
                                dbInfo.db.transaction(function(t) {
                                    tryExecuteSql(t, dbInfo, "SELECT key FROM " + dbInfo.storeName, [], function(t, results) {
                                        for (var keys = [], i = 0; i < results.rows.length; i++) keys.push(results.rows.item(i).key);
                                        resolve(keys);
                                    }, function(t, error) {
                                        reject(error);
                                    });
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function getAllStoreNames(db) {
                        return new Promise$1(function(resolve, reject) {
                            db.transaction(function(t) {
                                t.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function(t, results) {
                                    for (var storeNames = [], i = 0; i < results.rows.length; i++) storeNames.push(results.rows.item(i).name);
                                    resolve({
                                        db,
                                        storeNames
                                    });
                                }, function(t, error) {
                                    reject(error);
                                });
                            }, function(sqlError) {
                                reject(sqlError);
                            });
                        });
                    }
                    function dropInstance$1(options, callback) {
                        callback = getCallback.apply(this, arguments);
                        var currentConfig = this.config();
                        (options = "function" != typeof options && options || {}).name || (options.name = options.name || currentConfig.name, 
                        options.storeName = options.storeName || currentConfig.storeName);
                        var promise, self = this;
                        return executeCallback(promise = options.name ? new Promise$1(function(resolve) {
                            var db;
                            db = options.name === currentConfig.name ? self._dbInfo.db : openDatabase(options.name, "", "", 0), 
                            options.storeName ? resolve({
                                db,
                                storeNames: [ options.storeName ]
                            }) : resolve(getAllStoreNames(db));
                        }).then(function(operationInfo) {
                            return new Promise$1(function(resolve, reject) {
                                operationInfo.db.transaction(function(t) {
                                    function dropTable(storeName) {
                                        return new Promise$1(function(resolve, reject) {
                                            t.executeSql("DROP TABLE IF EXISTS " + storeName, [], function() {
                                                resolve();
                                            }, function(t, error) {
                                                reject(error);
                                            });
                                        });
                                    }
                                    for (var operations = [], i = 0, len = operationInfo.storeNames.length; i < len; i++) operations.push(dropTable(operationInfo.storeNames[i]));
                                    Promise$1.all(operations).then(function() {
                                        resolve();
                                    }).catch(function(e) {
                                        reject(e);
                                    });
                                }, function(sqlError) {
                                    reject(sqlError);
                                });
                            });
                        }) : Promise$1.reject("Invalid arguments"), callback), promise;
                    }
                    var webSQLStorage = {
                        _driver: "webSQLStorage",
                        _initStorage: _initStorage$1,
                        _support: isWebSQLValid(),
                        iterate: iterate$1,
                        getItem: getItem$1,
                        setItem: setItem$1,
                        removeItem: removeItem$1,
                        clear: clear$1,
                        length: length$1,
                        key: key$1,
                        keys: keys$1,
                        dropInstance: dropInstance$1
                    };
                    function isLocalStorageValid() {
                        try {
                            return "undefined" != typeof localStorage && "setItem" in localStorage && !!localStorage.setItem;
                        } catch (e) {
                            return !1;
                        }
                    }
                    function _getKeyPrefix(options, defaultConfig) {
                        var keyPrefix = options.name + "/";
                        return options.storeName !== defaultConfig.storeName && (keyPrefix += options.storeName + "/"), 
                        keyPrefix;
                    }
                    function checkIfLocalStorageThrows() {
                        var localStorageTestKey = "_localforage_support_test";
                        try {
                            return localStorage.setItem(localStorageTestKey, !0), localStorage.removeItem(localStorageTestKey), 
                            !1;
                        } catch (e) {
                            return !0;
                        }
                    }
                    function _isLocalStorageUsable() {
                        return !checkIfLocalStorageThrows() || localStorage.length > 0;
                    }
                    function _initStorage$2(options) {
                        var self = this, dbInfo = {};
                        if (options) for (var i in options) dbInfo[i] = options[i];
                        return dbInfo.keyPrefix = _getKeyPrefix(options, self._defaultConfig), _isLocalStorageUsable() ? (self._dbInfo = dbInfo, 
                        dbInfo.serializer = localforageSerializer, Promise$1.resolve()) : Promise$1.reject();
                    }
                    function clear$2(callback) {
                        var self = this, promise = self.ready().then(function() {
                            for (var keyPrefix = self._dbInfo.keyPrefix, i = localStorage.length - 1; i >= 0; i--) {
                                var key = localStorage.key(i);
                                0 === key.indexOf(keyPrefix) && localStorage.removeItem(key);
                            }
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function getItem$2(key, callback) {
                        var self = this;
                        key = normalizeKey(key);
                        var promise = self.ready().then(function() {
                            var dbInfo = self._dbInfo, result = localStorage.getItem(dbInfo.keyPrefix + key);
                            return result && (result = dbInfo.serializer.deserialize(result)), result;
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function iterate$2(iterator, callback) {
                        var self = this, promise = self.ready().then(function() {
                            for (var dbInfo = self._dbInfo, keyPrefix = dbInfo.keyPrefix, keyPrefixLength = keyPrefix.length, length = localStorage.length, iterationNumber = 1, i = 0; i < length; i++) {
                                var key = localStorage.key(i);
                                if (0 === key.indexOf(keyPrefix)) {
                                    var value = localStorage.getItem(key);
                                    if (value && (value = dbInfo.serializer.deserialize(value)), void 0 !== (value = iterator(value, key.substring(keyPrefixLength), iterationNumber++))) return value;
                                }
                            }
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function key$2(n, callback) {
                        var self = this, promise = self.ready().then(function() {
                            var result, dbInfo = self._dbInfo;
                            try {
                                result = localStorage.key(n);
                            } catch (error) {
                                result = null;
                            }
                            return result && (result = result.substring(dbInfo.keyPrefix.length)), result;
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function keys$2(callback) {
                        var self = this, promise = self.ready().then(function() {
                            for (var dbInfo = self._dbInfo, length = localStorage.length, keys = [], i = 0; i < length; i++) {
                                var itemKey = localStorage.key(i);
                                0 === itemKey.indexOf(dbInfo.keyPrefix) && keys.push(itemKey.substring(dbInfo.keyPrefix.length));
                            }
                            return keys;
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function length$2(callback) {
                        var promise = this.keys().then(function(keys) {
                            return keys.length;
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function removeItem$2(key, callback) {
                        var self = this;
                        key = normalizeKey(key);
                        var promise = self.ready().then(function() {
                            var dbInfo = self._dbInfo;
                            localStorage.removeItem(dbInfo.keyPrefix + key);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function setItem$2(key, value, callback) {
                        var self = this;
                        key = normalizeKey(key);
                        var promise = self.ready().then(function() {
                            void 0 === value && (value = null);
                            var originalValue = value;
                            return new Promise$1(function(resolve, reject) {
                                var dbInfo = self._dbInfo;
                                dbInfo.serializer.serialize(value, function(value, error) {
                                    if (error) reject(error); else try {
                                        localStorage.setItem(dbInfo.keyPrefix + key, value), resolve(originalValue);
                                    } catch (e) {
                                        "QuotaExceededError" !== e.name && "NS_ERROR_DOM_QUOTA_REACHED" !== e.name || reject(e), 
                                        reject(e);
                                    }
                                });
                            });
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function dropInstance$2(options, callback) {
                        if (callback = getCallback.apply(this, arguments), !(options = "function" != typeof options && options || {}).name) {
                            var currentConfig = this.config();
                            options.name = options.name || currentConfig.name, options.storeName = options.storeName || currentConfig.storeName;
                        }
                        var promise, self = this;
                        return promise = options.name ? new Promise$1(function(resolve) {
                            options.storeName ? resolve(_getKeyPrefix(options, self._defaultConfig)) : resolve(options.name + "/");
                        }).then(function(keyPrefix) {
                            for (var i = localStorage.length - 1; i >= 0; i--) {
                                var key = localStorage.key(i);
                                0 === key.indexOf(keyPrefix) && localStorage.removeItem(key);
                            }
                        }) : Promise$1.reject("Invalid arguments"), executeCallback(promise, callback), 
                        promise;
                    }
                    var localStorageWrapper = {
                        _driver: "localStorageWrapper",
                        _initStorage: _initStorage$2,
                        _support: isLocalStorageValid(),
                        iterate: iterate$2,
                        getItem: getItem$2,
                        setItem: setItem$2,
                        removeItem: removeItem$2,
                        clear: clear$2,
                        length: length$2,
                        key: key$2,
                        keys: keys$2,
                        dropInstance: dropInstance$2
                    }, sameValue = function sameValue(x, y) {
                        return x === y || "number" == typeof x && "number" == typeof y && isNaN(x) && isNaN(y);
                    }, includes = function includes(array, searchElement) {
                        for (var len = array.length, i = 0; i < len; ) {
                            if (sameValue(array[i], searchElement)) return !0;
                            i++;
                        }
                        return !1;
                    }, isArray = Array.isArray || function(arg) {
                        return "[object Array]" === Object.prototype.toString.call(arg);
                    }, DefinedDrivers = {}, DriverSupport = {}, DefaultDrivers = {
                        INDEXEDDB: asyncStorage,
                        WEBSQL: webSQLStorage,
                        LOCALSTORAGE: localStorageWrapper
                    }, DefaultDriverOrder = [ DefaultDrivers.INDEXEDDB._driver, DefaultDrivers.WEBSQL._driver, DefaultDrivers.LOCALSTORAGE._driver ], OptionalDriverMethods = [ "dropInstance" ], LibraryMethods = [ "clear", "getItem", "iterate", "key", "keys", "length", "removeItem", "setItem" ].concat(OptionalDriverMethods), DefaultConfig = {
                        description: "",
                        driver: DefaultDriverOrder.slice(),
                        name: "localforage",
                        size: 4980736,
                        storeName: "keyvaluepairs",
                        version: 1
                    };
                    function callWhenReady(localForageInstance, libraryMethod) {
                        localForageInstance[libraryMethod] = function() {
                            var _args = arguments;
                            return localForageInstance.ready().then(function() {
                                return localForageInstance[libraryMethod].apply(localForageInstance, _args);
                            });
                        };
                    }
                    function extend() {
                        for (var i = 1; i < arguments.length; i++) {
                            var arg = arguments[i];
                            if (arg) for (var _key in arg) arg.hasOwnProperty(_key) && (isArray(arg[_key]) ? arguments[0][_key] = arg[_key].slice() : arguments[0][_key] = arg[_key]);
                        }
                        return arguments[0];
                    }
                    var LocalForage = function() {
                        function LocalForage(options) {
                            for (var driverTypeKey in _classCallCheck(this, LocalForage), DefaultDrivers) if (DefaultDrivers.hasOwnProperty(driverTypeKey)) {
                                var driver = DefaultDrivers[driverTypeKey], driverName = driver._driver;
                                this[driverTypeKey] = driverName, DefinedDrivers[driverName] || this.defineDriver(driver);
                            }
                            this._defaultConfig = extend({}, DefaultConfig), this._config = extend({}, this._defaultConfig, options), 
                            this._driverSet = null, this._initDriver = null, this._ready = !1, this._dbInfo = null, 
                            this._wrapLibraryMethodsWithReady(), this.setDriver(this._config.driver).catch(function() {});
                        }
                        return LocalForage.prototype.config = function config(options) {
                            if ("object" === (void 0 === options ? "undefined" : _typeof(options))) {
                                if (this._ready) return new Error("Can't call config() after localforage has been used.");
                                for (var i in options) {
                                    if ("storeName" === i && (options[i] = options[i].replace(/\W/g, "_")), "version" === i && "number" != typeof options[i]) return new Error("Database version must be a number.");
                                    this._config[i] = options[i];
                                }
                                return !("driver" in options) || !options.driver || this.setDriver(this._config.driver);
                            }
                            return "string" == typeof options ? this._config[options] : this._config;
                        }, LocalForage.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
                            var promise = new Promise$1(function(resolve, reject) {
                                try {
                                    var driverName = driverObject._driver, complianceError = new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver");
                                    if (!driverObject._driver) return void reject(complianceError);
                                    for (var driverMethods = LibraryMethods.concat("_initStorage"), i = 0, len = driverMethods.length; i < len; i++) {
                                        var driverMethodName = driverMethods[i];
                                        if ((!includes(OptionalDriverMethods, driverMethodName) || driverObject[driverMethodName]) && "function" != typeof driverObject[driverMethodName]) return void reject(complianceError);
                                    }
                                    var configureMissingMethods = function configureMissingMethods() {
                                        for (var methodNotImplementedFactory = function methodNotImplementedFactory(methodName) {
                                            return function() {
                                                var error = new Error("Method " + methodName + " is not implemented by the current driver"), promise = Promise$1.reject(error);
                                                return executeCallback(promise, arguments[arguments.length - 1]), promise;
                                            };
                                        }, _i = 0, _len = OptionalDriverMethods.length; _i < _len; _i++) {
                                            var optionalDriverMethod = OptionalDriverMethods[_i];
                                            driverObject[optionalDriverMethod] || (driverObject[optionalDriverMethod] = methodNotImplementedFactory(optionalDriverMethod));
                                        }
                                    };
                                    configureMissingMethods();
                                    var setDriverSupport = function setDriverSupport(support) {
                                        DefinedDrivers[driverName], DefinedDrivers[driverName] = driverObject, DriverSupport[driverName] = support, 
                                        resolve();
                                    };
                                    "_support" in driverObject ? driverObject._support && "function" == typeof driverObject._support ? driverObject._support().then(setDriverSupport, reject) : setDriverSupport(!!driverObject._support) : setDriverSupport(!0);
                                } catch (e) {
                                    reject(e);
                                }
                            });
                            return executeTwoCallbacks(promise, callback, errorCallback), promise;
                        }, LocalForage.prototype.driver = function driver() {
                            return this._driver || null;
                        }, LocalForage.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
                            var getDriverPromise = DefinedDrivers[driverName] ? Promise$1.resolve(DefinedDrivers[driverName]) : Promise$1.reject(new Error("Driver not found."));
                            return executeTwoCallbacks(getDriverPromise, callback, errorCallback), getDriverPromise;
                        }, LocalForage.prototype.getSerializer = function getSerializer(callback) {
                            var serializerPromise = Promise$1.resolve(localforageSerializer);
                            return executeTwoCallbacks(serializerPromise, callback), serializerPromise;
                        }, LocalForage.prototype.ready = function ready(callback) {
                            var self = this, promise = self._driverSet.then(function() {
                                return null === self._ready && (self._ready = self._initDriver()), self._ready;
                            });
                            return executeTwoCallbacks(promise, callback, callback), promise;
                        }, LocalForage.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
                            var self = this;
                            isArray(drivers) || (drivers = [ drivers ]);
                            var supportedDrivers = this._getSupportedDrivers(drivers);
                            function setDriverToConfig() {
                                self._config.driver = self.driver();
                            }
                            function extendSelfWithDriver(driver) {
                                return self._extend(driver), setDriverToConfig(), self._ready = self._initStorage(self._config), 
                                self._ready;
                            }
                            function initDriver(supportedDrivers) {
                                return function() {
                                    var currentDriverIndex = 0;
                                    function driverPromiseLoop() {
                                        for (;currentDriverIndex < supportedDrivers.length; ) {
                                            var driverName = supportedDrivers[currentDriverIndex];
                                            return currentDriverIndex++, self._dbInfo = null, self._ready = null, self.getDriver(driverName).then(extendSelfWithDriver).catch(driverPromiseLoop);
                                        }
                                        setDriverToConfig();
                                        var error = new Error("No available storage method found.");
                                        return self._driverSet = Promise$1.reject(error), self._driverSet;
                                    }
                                    return driverPromiseLoop();
                                };
                            }
                            var oldDriverSetDone = null !== this._driverSet ? this._driverSet.catch(function() {
                                return Promise$1.resolve();
                            }) : Promise$1.resolve();
                            return this._driverSet = oldDriverSetDone.then(function() {
                                var driverName = supportedDrivers[0];
                                return self._dbInfo = null, self._ready = null, self.getDriver(driverName).then(function(driver) {
                                    self._driver = driver._driver, setDriverToConfig(), self._wrapLibraryMethodsWithReady(), 
                                    self._initDriver = initDriver(supportedDrivers);
                                });
                            }).catch(function() {
                                setDriverToConfig();
                                var error = new Error("No available storage method found.");
                                return self._driverSet = Promise$1.reject(error), self._driverSet;
                            }), executeTwoCallbacks(this._driverSet, callback, errorCallback), this._driverSet;
                        }, LocalForage.prototype.supports = function supports(driverName) {
                            return !!DriverSupport[driverName];
                        }, LocalForage.prototype._extend = function _extend(libraryMethodsAndProperties) {
                            extend(this, libraryMethodsAndProperties);
                        }, LocalForage.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
                            for (var supportedDrivers = [], i = 0, len = drivers.length; i < len; i++) {
                                var driverName = drivers[i];
                                this.supports(driverName) && supportedDrivers.push(driverName);
                            }
                            return supportedDrivers;
                        }, LocalForage.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
                            for (var i = 0, len = LibraryMethods.length; i < len; i++) callWhenReady(this, LibraryMethods[i]);
                        }, LocalForage.prototype.createInstance = function createInstance(options) {
                            return new LocalForage(options);
                        }, LocalForage;
                    }(), localforage_js = new LocalForage;
                    module.exports = localforage_js;
                }, {
                    3: 3
                } ]
            }, {}, [ 4 ])(4);
        },
        340(module, __webpack_exports__, __webpack_require__) {
            "use strict";
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
    }, __webpack_require__.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
            return this || new Function("return this")();
        } catch (e) {
            if ("object" == typeof window) return window;
        }
    }(), __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop), 
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
    let __webpack_exports__ = {};
    (() => {
        "use strict";
        __webpack_require__.d(__webpack_exports__, {
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
            overlappingPath(other) {
                let maxlen = 0;
                for (let p = 0; p < this.data.length; p++) {
                    const portal = this.data[p], inOther = other.data.findIndex(op => op.guid === portal.guid);
                    if (-1 !== inOther) {
                        let len = 1;
                        for (;inOther + len < other.data.length && p + len < this.data.length && this.data[p + len].guid === other.data[inOther + len].guid; ) len++;
                        for (maxlen = Math.max(maxlen, len), len = 1; inOther - len >= 0 && p - len >= 0 && this.data[p - len].guid === other.data[inOther - len].guid; ) len++;
                        maxlen = Math.max(maxlen, len);
                    }
                }
                return maxlen;
            }
        }
        const setPassphrase = (portal, question, answer) => {
            portal.objective.passphrase_params.question = question, portal.objective.passphrase_params._single_passphrase = answer;
        };
        class Bimage {
            canvas;
            constructor(canvas) {
                if (this.canvas = canvas, !canvas.getContext("2d")) throw new Error("Unable to get 2D rendering context");
            }
            static empty() {
                const canvas = Bimage.createDummyCanvas();
                return new Bimage(canvas);
            }
            static createDummyCanvas() {
                const canvas = document.createElement("canvas");
                canvas.width = 100, canvas.height = 100;
                const context = canvas.getContext("2d");
                if (!context) throw new Error("Unable to get 2D rendering context for placeholder canvas");
                context.fillStyle = "#efefef", context.fillRect(0, 0, canvas.width, canvas.height);
                context.fillStyle = "#e0e0e0";
                for (let y = 0; y < canvas.height; y += 16) for (let x = y / 16 % 2 ? 0 : 16; x < canvas.width; x += 32) context.fillRect(x, y, 16, 16);
                return context.strokeStyle = "#c0c0c0", context.lineWidth = 2, context.beginPath(), 
                context.moveTo(0, 0), context.lineTo(canvas.width, canvas.height), context.moveTo(canvas.width, 0), 
                context.lineTo(0, canvas.height), context.stroke(), context.fillStyle = "#666", 
                context.font = "16px sans-serif", context.textAlign = "center", context.textBaseline = "middle", 
                context.fillText("No image", canvas.width / 2, canvas.height / 2), canvas;
            }
            static async fromString(dataString) {
                const image = await this.loadImage(dataString);
                return this.fromImageElement(image);
            }
            static async fromFile(file) {
                const bitmap = await createImageBitmap(file);
                return this.fromImageBitmap(bitmap);
            }
            static async loadImage(source) {
                return new Promise((resolve, reject) => {
                    const image = new Image;
                    image.onload = () => resolve(image), image.onerror = () => reject(new Error("Failed to load image from string")), 
                    image.src = source;
                });
            }
            static fromImageElement(image) {
                const canvas = document.createElement("canvas");
                canvas.width = image.naturalWidth || image.width, canvas.height = image.naturalHeight || image.height;
                const context = canvas.getContext("2d");
                if (!context) throw new Error("Unable to get 2D rendering context");
                return context.drawImage(image, 0, 0), new Bimage(canvas);
            }
            static fromImageBitmap(bitmap) {
                const canvas = document.createElement("canvas");
                canvas.width = bitmap.width, canvas.height = bitmap.height;
                const context = canvas.getContext("2d");
                if (!context) throw new Error("Unable to get 2D rendering context");
                return context.drawImage(bitmap, 0, 0), bitmap.close(), new Bimage(canvas);
            }
            get width() {
                return this.canvas.width;
            }
            get height() {
                return this.canvas.height;
            }
            toString(type = "image/png", quality) {
                return this.canvas.toDataURL(type, quality);
            }
            async toBlob(type = "image/png", quality) {
                return new Promise((resolve, reject) => {
                    this.canvas.toBlob(blob => {
                        blob ? resolve(blob) : reject(new Error("Failed to convert canvas to Blob"));
                    }, type, quality);
                });
            }
            async toFile(filename = "image.png", type = "image/png", quality) {
                const blob = await this.toBlob(type, quality);
                return new File([ blob ], filename, {
                    type
                });
            }
            crop(x, y, width, height) {
                let needbackground = !1, sx = x, sy = y, sw = width, sh = height, dx = 0, dy = 0, dw = width, dh = height;
                sx < 0 && (dx = -sx, sx = 0, needbackground = !0), sy < 0 && (dy = -sy, sy = 0, 
                needbackground = !0), sx + sw > this.width && (sw = this.width - sx, dw = sw, needbackground = !0), 
                sy + sh > this.height && (sh = this.height - sy, dh = sh, needbackground = !0);
                const canvas = document.createElement("canvas");
                canvas.width = width, canvas.height = height;
                const context = canvas.getContext("2d");
                if (!context) throw new Error("Unable to get 2D rendering context for crop");
                if (needbackground) {
                    context.save(), context.filter = "blur(20px)";
                    const bx = Math.max(0, Math.min(x, this.width - width)), by = Math.max(0, Math.min(y, this.height - height));
                    context.drawImage(this.canvas, bx, by, width, height, 0, 0, width, height), context.restore();
                }
                return context.drawImage(this.canvas, sx, sy, sw, sh, dx, dy, dw, dh), new Bimage(canvas);
            }
            render(element) {
                if (element instanceof HTMLImageElement) return element.src = this.toString(), element.width = this.width, 
                void (element.height = this.height);
                if (element instanceof HTMLCanvasElement) {
                    element.width = this.width, element.height = this.height;
                    const context = element.getContext("2d");
                    if (!context) throw new Error("Unable to get 2D rendering context for target canvas");
                    return void context.clearRect(0, 0, this.width, this.height);
                }
                throw new Error("Unsupported render target: expected HTMLImageElement or HTMLCanvasElement");
            }
        }
        const createFilename = (state, addition) => state.getBannerName().replace(/[\W_]+/g, " ") + addition, loadFile = async (state, inputFile) => {
            const text = await inputFile.text();
            try {
                await state.import(text);
            } catch (error) {
                return notification(`Loadgin error: \n${error}`), !1;
            }
            return await state.save(), notification(`Banner data loaded:\n${state.getBannerName()}`), 
            !0;
        };
        class Mission {
            missionID;
            data;
            portal_data;
            state;
            constructor(state, id, data) {
                this.missionID = id, this.data = data, this.state = state, this.portal_data = new Portals(state, data.portals);
            }
            isEmpty() {
                return "" === this.title || "" === this.description || 0 === this.portals.length;
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
            hasImage() {
                return this.data.image >= 0 && void 0 !== this.state.getImage(this.data.image);
            }
            getImage() {
                const origin = this.state.getImage(this.data.image);
                if (!origin) return Bimage.empty();
                const r = this.data.rect;
                return r ? origin.crop(r.x, r.y, r.width, r.height) : origin;
            }
            setImage(id, rect) {
                this.data.image = id, this.data.rect = rect;
            }
            getImageFilename() {
                const num = window.zeroPad(this.id + 1, String(this.state.getPlannedLength()).length);
                return createFilename(this.state, `_${num}.png`);
            }
            get imageRect() {
                return this.data.rect;
            }
            set imageRect(rect) {
                this.data.rect = Object.assign({}, rect);
            }
            get imageID() {
                return this.data.image;
            }
            get category() {
                return this.state.category;
            }
            hasPortals() {
                return this.portal_data.length > 0;
            }
            getLocations() {
                return this.portal_data.toLatLng();
            }
            getSequential() {
                return this.state.getSequential();
            }
            show(forceZoom = !1) {
                if (this.hasPortals()) {
                    const bounds = new L.LatLngBounds(this.getLocations()).pad(.2);
                    if (bounds.isValid()) {
                        const minBounds = bounds.pad(-.3);
                        !forceZoom && window.map.getBounds().intersects(minBounds) || window.map.fitBounds(bounds, {
                            maxZoom: 18
                        });
                    }
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
            getAll() {
                return this.data.map((missionData, index) => new Mission(this.state, index, missionData));
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
            map(callback) {
                return this.data.map((missionData, index) => {
                    const mission = new Mission(this.state, index, missionData);
                    return callback(mission);
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
                    if (bounds.isValid()) {
                        const minBounds = bounds.pad(-.2);
                        window.map.getBounds().intersects(minBounds) || window.map.fitBounds(bounds, {
                            maxZoom: 18
                        });
                    }
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
        const undefinedOrEmptyString = value => null == value || "" == value, migrateUmmVersion = ummState => {
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
            ummState.fileFormatVersion = 3), ummState.sequential ??= !0, ummState.hiddenLocation ??= !1, 
            ummState;
        };
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
        var localforage = __webpack_require__(790), localforage_default = __webpack_require__.n(localforage);
        class State {
            theState;
            images=[];
            images_changed=!1;
            onSelectedMissionChange=new Trigger;
            onMissionChange=new Trigger;
            onMissionPortal=new Trigger;
            constructor() {
                localforage_default().config({
                    name: "UUM",
                    version: 1
                }), this.load();
            }
            async load() {
                this.reset();
                const data = localStorage.getItem("ultimate-mission-maker");
                if (!data) return;
                const anyState = JSON.parse(data);
                this.theState = migrateUmmVersion(anyState), this.setPlannedLength(this.getPlannedLength() || 1), 
                await this.loadImages(), this.triggerUpdate();
            }
            async loadImages() {
                this.images = [];
                let imageData, index = 0;
                for (;imageData = await localforage_default().getItem("image" + index++); ) {
                    const image = await Bimage.fromString(imageData);
                    this.images.push(image);
                }
                this.images_changed = !1;
            }
            async save() {
                this.setPlannedLength(this.theState.plannedBannerLength), localStorage.setItem("ultimate-mission-maker", JSON.stringify(this.theState)), 
                await this.saveImages();
            }
            async saveImages() {
                if (!this.images_changed) return;
                (await localforage_default().keys()).filter(k => k.match(/^image\d+$/)).forEach(i => localforage_default().removeItem(i));
                for (const index in this.images) {
                    const data = this.images[index].toString();
                    await localforage_default().setItem(`image${index}`, data);
                }
                this.images_changed = !1;
            }
            async import(jsonString) {
                const anyState = JSON.parse(jsonString);
                this.theState = migrateUmmVersion(anyState), this.setPlannedLength(this.getPlannedLength() || 1), 
                await this.importImages(anyState.images), this.triggerUpdate();
            }
            async importImages(imageData) {
                if (this.images = [], this.images_changed = !0, !imageData || 0 === imageData.length) return;
                const unresolvedPromises = imageData.map(async imgData => Bimage.fromString(imgData));
                this.images = await Promise.all(unresolvedPromises);
            }
            export() {
                const exportState = Object.assign({}, this.theState);
                return exportState.images = this.images.map(img => img.toString()), JSON.stringify(exportState);
            }
            triggerUpdate() {
                this.onMissionChange.trigger(), this.onMissionPortal.trigger(), this.onSelectedMissionChange.trigger();
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
                        portals: [],
                        image: -1
                    } ],
                    sequential: !0,
                    hiddenLocation: !1,
                    layers: [],
                    category: void 0
                }, this.images = [], this.images_changed = !0, this.onMissionChange.trigger();
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
                    portals: [],
                    image: -1
                });
                this.removeUnusedImages(), this.onMissionChange.trigger();
            }
            setSequential(sequential, hiddenLocation) {
                this.theState.sequential = sequential, this.theState.hiddenLocation = hiddenLocation;
            }
            getSequential() {
                return {
                    sequential: this.theState.sequential,
                    hiddenLocation: this.theState.hiddenLocation
                };
            }
            set category(name) {
                name === this.theState.category && (name = void 0), this.theState.category = name;
            }
            get category() {
                return this.theState.category ? this.theState.category : this.getBannerName();
            }
            isCustomCategory() {
                return void 0 !== this.theState.category;
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
            async storeLayerState(layers) {
                this.theState.layers = layers.map(l => l.isVisible()), await this.save();
            }
            restoreLayerState(layers) {
                this.theState.layers.forEach((vis, index) => layers[index].toggle(vis ?? !0));
            }
            getImage(id) {
                return this.images[id];
            }
            clearImages() {
                this.images = [], this.images_changed = !0;
            }
            addImage(image) {
                const asStr = image.toString(), index = this.images.findIndex(i => i.toString() === asStr);
                if (-1 !== index) return index;
                const newIndex = this.images.push(image) - 1;
                return this.images_changed = !0, newIndex;
            }
            removeUnusedImages() {
                const usedImages = new Set(this.missions.map(m => m.imageID));
                for (let i = this.images.length - 1; i >= 0; i--) usedImages.has(i) || (this.images.splice(i, 1), 
                this.images_changed = !0, this.missions.forEach(m => {
                    m.imageID >= i && m.setImage(m.imageID - 1, m.imageRect);
                }));
                return this.images_changed;
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
        }), title = "Ultimate Mission Maker EX", MissionNumberQuestions = [ "What number is this mission ?", "Which mission number is this ?", "What is the mission number ?", "Which number does this mission have ?", "What is this mission’s number ?", "Which mission index is this ?", "What is the index of this mission ?", "Which position does this mission have ?", "What is the position of this mission ?", "Which mission slot is this ?", "What number does this mission have in the banner ?", "Which banner number is this mission ?", "What is this mission’s banner position ?", "Which mission number is shown in the banner ?", "What number identifies this mission in the series ?", "Which number does this mission have in the sequence ?", "What is the mission’s number in the series ?", "Which mission position is this in the banner ?", "What number is assigned to this banner mission ?", "Which number marks this mission in the banner ?", "What mission number are you playing right now ?", "Which mission number are you currently on ?", "What number are you on in this banner ?", "Which mission number are you completing now ?", "What is the current mission number ?", "Which number is this step of the banner ?", "What number is this step in the mission series ?", "Which mission step number is this ?", "What is the step number of this mission ?", "Which number corresponds to this mission step ?", "Identify the mission number of this mission.", "Select the mission number for this mission.", "Determine this mission’s number.", "State the number of this mission.", "Indicate the index of this mission.", "Specify the position number of this mission.", "What ordinal number does this mission have ?", "Which ordinal position is this mission ?", "What numeric identifier does this mission have ?", "Which numeric index applies to this mission ?", "What is the mission number you are answering ?", "Which number corresponds to this exact mission ?", "What number is displayed for this mission ?", "Which mission number is written here ?", "What is the official number of this mission ?", "Which mission number was assigned here ?", "What number labels this mission ?", "Which number tags this mission ?", "What is the mission’s assigned number ?", "Which number marks this mission ?", "What is this mission’s index number ?", "Which index number is this mission ?", "What is the banner index of this mission ?", "Which banner index applies here ?", "What position number does this mission have ?", "Which position number is this mission ?", "What is the mission’s position number ?", "Which slot number is this mission ?", "What is this mission’s slot number ?", "Which slot position is this mission ?", "What number identifies this mission in the banner ?", "Which number identifies this mission in the banner ?", "What is the number assigned to this mission ?", "Which number is assigned to this mission ?", "What is this mission’s series number ?", "Which series number is this mission ?", "What is the banner series number of this mission ?", "Which banner series number is this mission ?", "What number corresponds to this banner entry ?", "Which number corresponds to this banner entry ?" ], NoobQuestions = [ {
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
                html: miniMarkdown('# v1.2\n\n- new Picture dialog - setup Banner images directly in UMM.\n- added "Sequential" flag\n- with IMATTC support\n- reduce map movements\n\nwith all this addition you can now import a mission in minimal Steps:\n\n1.  load banner json\n2.  select mission\n3.  click "import"\n4.  submit mission\n    (repeat 2-4 for all missions)\n\n# v1.1.2\n\n- fix: dialogs auto open on load - forgotten debug code\n  (nah, the truth: the build script should have removed it, but it failed)\n\n# v1.1.1\n\n- fix: "edit" button was covering banner length in main dialog\n- dependencies update\n\n# v1.1\n\n- new "Mission Generator" dialog  \n  This new dialog provides several tools to modify current mission:\n  1. "Reset"  \n     Discard all current changes.\n  2. Add portals  \n     Adds nearby portals to the current mission.\n     You can:\n     - Limit selection using a DrawTools polygon\n     - Exclude individual portals with DrawTool Markers\n     - Restrict selection to portals within path hack range\n  3. Sort portals  \n     Attempts to arrange portals for the shortest possible path.\n     (Note: This is a complex optimization problem—results may vary.\n     The “keep end portal” option may occasionally fail.)\n  4. Change start  \n     Set the selected Portal as new mission start.\n     If no portal is selected, the start point will cycle through all mission portals.\n\n  All changes are temporary until "applied" or be "dismissed".  \n  Note: Distance calculations are based on straight-line (“as-the-crow-flies”) distances; real-world paths are not considered.\n\n- Use static layers  \n  UMM is now fully hidden when inactive. Background processing is also disabled while inactive.\n- Added Multi-Reverse  \n  Using the reverse action in the main dialog, you can now reverse an entire banner or selected parts of it—not just a single mission.\n- Drag: allow swapping mission portals\n- Fixed merge in main dialog\n- Fixed “Should merge?” prompt in split option (main dialog)\n- Mission-Select dialog moved to the left\n\n# v1.0.2\n\n- fix IITC-Button load\n  in iitc-button load order is differnet and custom "if UUM is loaded then disable it" failed\n- fix variable if both plugins are active\n\n# v1.0.1\n\n- fix mission number (index started by 0 instead of 1)\n\n# v1.0\n\nThis is a complete rewrite of the Ultimate Mission Maker from a developer perspective.\nThe entire codebase has been redesigned while maintaining the familiar user experience of the original UMM.\nBelow are the visible improvements and changes you\'ll notice.\n\n## What\'s Changed:\n\n- UMM is now hidden by default. You need to hit the "UMM" button in the Portal details window to make it appear.\n\n- **Select Mission Dialog** (open it through the toolbar or the main dialog)\n  - Selecting a mission is no longer required; simply open another mission\n  - Navigation buttons (+/-) allow you to cycle through missions\n  - Added split, clear, merge, and reverse commands for mission manipulation\n  - New mission information display: portal count and distances\n\n- **Banner Settins** (start window)\n  - changed Title placeholders to $T $M $N\n- **Option Dialog** (main window)\n  - Banner information now displays as a compact table\n  - Removed warning for mission counts that are not multiples of 6\n  - Added warning when missions lack sufficient waypoints\n\n- **Drag & Drop** in the mission editor path\n  - Move existing markers to adjust waypoints\n  - Add new waypoints by positioning intermediate markers at new locations\n  - Remove waypoints by double-clicking a marker\n  - Merge missions by dragging start and end markers together\n\n- **Mission Numbers**\n  - Potential split points are previewed while creating missions\n\n- **Waypoint edit**\n  - current mission is preselected\n  - passphrases: add random default questions.\n    when question & answer is empty a simple question will be set.\n\n- **Miscellaneous**\n  - Custom confirmation dialogs clarify actions and improve readability\n  - Switch between any missions, even those without portals\n  - Option to split missions when starting on a portal that\'s already assigned to another mission\n  - on mobile dialogs are not at the top instead of centered\n  - flash buttonbar on activation to draw attention\n\n---\n\n# History:\n\n## v1.0.beta.2 - 15.02.26\n\n- fixed update-URL in script header\n\n## v1.0.beta - 15.02.26\n\n- first public release\n- automated build process on GitHub\n- fixed layer checkboxes in Option-Dialog\n- add "clear" mission to selection dialog\n- always color selected mission even when not in Edit-Mode\n- move "no" to left in custom confirm dialog\n- remove doubled "v" in version numbers\n- fix toggeling edit mode on mission detail window "save" button\n- close dialog on mission detail window "save"\n- fix linebreaks in changelog dialog\n- select mission: directly select mission on combo-box change\n- fix question text in portal details\n- on mobile dialogs are not at the top instead of centered\n'),
                width: 500
            })), dialogButtonClose() ];
            window.dialog({
                html,
                title: `${title} v1.2 - About`,
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
                title: `${title} v1.2`,
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
        };
        class MissionImage {
            mission;
            tile;
            constructor(mission) {
                this.mission = mission;
            }
            createImage() {
                return this.tile = $("<div>", {
                    class: "umm-tile"
                }).append($("<img>", {
                    class: "image"
                }), $("<img>", {
                    class: "overlay",
                    src: "data:image/png;base64,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"
                })), this.update(), this.tile;
            }
            getImageElement() {
                return $(".image", this.tile);
            }
            hasImage() {
                return this.mission.hasImage();
            }
            update() {
                const picture = this.mission.getImage(), image = $(".image", this.tile).get(0);
                picture.render(image);
            }
            showMask(status = !0) {
                $(".overlay", this.tile).toggle(status);
            }
            showBorder(status = !0) {
                $(this.tile).toggleClass("border", status);
            }
            move(dx, dy) {
                const rect = this.mission.imageRect;
                rect && (rect.x += dx, rect.y += dy, this.update());
            }
            zoom(z) {
                const rect = this.mission.imageRect;
                if (!rect) return;
                const newwidth = rect.width * z, newheight = rect.height * z;
                rect.x = rect.x + (rect.width - newwidth) / 2, rect.y = rect.y + (rect.height - newheight) / 2, 
                rect.width = newwidth, rect.height = newheight, this.update();
            }
            zoomAroundCenter(cx, cy, s) {
                const rect = this.mission.imageRect;
                rect && (rect.width = rect.width * s, rect.height = rect.height * s, rect.x = cx + (rect.x - cx) * s, 
                rect.y = cy + (rect.y - cy) * s, this.update());
            }
        }
        class EditMode {
            images;
            lastClicked;
            disableSelection;
            constructor(images) {
                this.images = images, this.lastClicked = -1, this.disableSelection = !1, this.images.forEach(i => i.tile.on("click", this.onClick));
            }
            destroy() {
                this.images.forEach(i => {
                    i.tile.off("click", this.onClick), i.tile.removeClass("selected");
                });
            }
            imageReloaded() {}
            onClick=event => {
                if (this.disableSelection) return;
                const image = this.getImage(event.target);
                if (!image) return;
                const index = this.getImageIndex(image);
                if (-1 !== index) {
                    if (event.shiftKey && -1 !== this.lastClicked) {
                        const start = Math.min(index, this.lastClicked), end = Math.max(index, this.lastClicked), toggle = this.images[this.lastClicked].tile.hasClass("selected");
                        for (let i = start; i <= end; i++) this.images[i].tile.toggleClass("selected", toggle);
                    } else this.images[index].tile.toggleClass("selected");
                    this.lastClicked = index;
                }
            };
            getSelectedImages() {
                return this.images.filter(i => i.tile.hasClass("selected"));
            }
            getSelected() {
                return this.getSelectedImages().map(i => i.mission).reverse();
            }
            toggleSelectionMode(status) {
                this.disableSelection = !status, this.disableSelection && this.images.forEach(i => i.tile.removeClass("selected"));
            }
            getImage(element) {
                return this.images.find(i => i.tile.is(element) || i.tile.is(element.parentElement));
            }
            getImageIndex(image) {
                return this.images.indexOf(image);
            }
        }
        class EditModeNone extends EditMode {}
        class EM_MouseEdit extends EditMode {
            rect_backup=[];
            dragging_image=void 0;
            dragStartX=0;
            dragStartY=0;
            move(_image, _dx, _dy) {}
            zoom(_image, _delta, _cx, _cy) {}
            constructor(images) {
                super(images), images.forEach(i => {
                    i.tile.on("dblclick", this.onDoubleClick), i.tile.on("mousedown", this.onMouseDown), 
                    i.tile.on("wheel", this.onWheel);
                }), this.imageReloaded();
            }
            destroy() {
                this.images.forEach(i => {
                    i.tile.off("dblclick", this.onDoubleClick), i.tile.off("mousedown", this.onMouseDown), 
                    i.tile.off("wheel", this.onWheel);
                }), super.destroy();
            }
            imageReloaded() {
                this.rect_backup = this.images.map(i => Object.assign({}, i.mission.imageRect));
            }
            onDoubleClick=event => {
                const tile = this.getImage(event?.target);
                if (!tile?.hasImage()) return;
                const index = this.getImageIndex(tile);
                tile.mission.imageRect = this.rect_backup[index], tile.update();
            };
            onMouseDown=event => {
                this.dragStartX = event.clientX, this.dragStartY = event.clientY, event.preventDefault(), 
                this.dragging_image = this.getImage(event?.target), this.dragging_image?.hasImage() && ($(window).on("mousemove", this.onMouseMove), 
                $(window).on("mouseup", this.onMouseUp));
            };
            onMouseMove=event => {
                if (!this.dragging_image) return;
                const scale = (this.dragging_image.mission.imageRect?.width ?? 500) / 500, dx = scale * (event.clientX - this.dragStartX), dy = scale * (event.clientY - this.dragStartY);
                this.dragStartX = event.clientX, this.dragStartY = event.clientY, this.move(this.dragging_image, -dx, -dy);
            };
            onMouseUp=_event => {
                this.dragging_image = void 0, $(window).off("mousemove", this.onMouseMove), $(window).off("mouseup", this.onMouseUp);
            };
            onWheel=event => {
                event.preventDefault();
                let delta = event.originalEvent.wheelDelta;
                const tile = this.getImage(event.target);
                if (!tile?.hasImage()) return;
                const imgrect = tile.mission.imageRect, c1x = imgrect.x + imgrect.width / 2, c1y = imgrect.y + imgrect.height / 2;
                event.shiftKey && (delta /= 10);
                const zoom = 1 + delta / 1e3;
                this.zoom(tile, zoom, c1x, c1y);
            };
        }
        class EM_MassEdit extends EM_MouseEdit {
            getImages(eventTrigger) {
                const selection = this.getSelectedImages();
                if (selection.length > 0) return selection;
                const id = eventTrigger.mission.imageID;
                return this.images.filter(pic => pic.mission.imageID === id);
            }
            move(image, dx, dy) {
                this.getImages(image).forEach(i => i.move(dx, dy));
            }
            zoom(image, delta, cx, cy) {
                this.getImages(image).forEach(i => i.zoomAroundCenter(cx, cy, delta));
            }
        }
        let draggingImage;
        class EM_DragEdit extends EditMode {
            constructor(images) {
                super(images), this.images.forEach(i => {
                    i.tile.on("dragstart", this.onDragStart), i.tile.on("dragover", this.onDragOver), 
                    i.tile.on("drop", this.onDrop);
                });
            }
            destroy() {
                draggingImage = void 0, this.images.forEach(i => {
                    i.tile.off("dragstart", this.onDragStart), i.tile.off("dragover", this.onDragOver), 
                    i.tile.off("drop", this.onDrop), i.tile.removeClass("selected");
                }), super.destroy();
            }
            onDragStart=event => {
                draggingImage = this.getImage(event.target), draggingImage && event.originalEvent?.dataTransfer?.setDragImage(draggingImage.getImageElement()[0], event.target.width / 2, event.target.height / 2);
            };
            onDragOver=event => {
                event.preventDefault();
            };
            onDrop=event => {
                const target = this.getImage(event.target);
                if (target && draggingImage) {
                    const source = target.mission, destination = draggingImage.mission, id = source.imageID, rect = Object.assign({}, source.imageRect);
                    source.setImage(destination.imageID, destination.imageRect), destination.setImage(id, rect), 
                    target.update(), draggingImage.update(), draggingImage = void 0;
                }
            };
        }
        class EM_Single extends EM_MouseEdit {
            move(image, dx, dy) {
                image.move(dx, dy);
            }
            zoom(image, delta, cx, cy) {
                image.zoomAroundCenter(cx, cy, delta);
            }
        }
        class Crc32 {
            constructor() {
                this.crc = -1;
            }
            append(data) {
                for (var crc = 0 | this.crc, table = this.table, offset = 0, len = 0 | data.length; offset < len; offset++) crc = crc >>> 8 ^ table[255 & (crc ^ data[offset])];
                this.crc = crc;
            }
            get() {
                return ~this.crc;
            }
        }
        Crc32.prototype.table = (() => {
            var i, j, t, table = [];
            for (i = 0; i < 256; i++) {
                for (t = i, j = 0; j < 8; j++) t = 1 & t ? t >>> 1 ^ 3988292384 : t >>> 1;
                table[i] = t;
            }
            return table;
        })();
        const getDataHelper = byteLength => {
            var uint8 = new Uint8Array(byteLength);
            return {
                array: uint8,
                view: new DataView(uint8.buffer)
            };
        };
        function createWriter(underlyingSource) {
            const files = Object.create(null), filenames = [], encoder = new TextEncoder;
            let ctrl, activeZipObject, closed, offset = 0, activeZipIndex = 0;
            function next() {
                activeZipIndex++, activeZipObject = files[filenames[activeZipIndex]], activeZipObject ? processNextChunk() : closed && closeZip();
            }
            var zipWriter = {
                enqueue(fileLike) {
                    if (closed) throw new TypeError("Cannot enqueue a chunk into a readable stream that is closed or has been requested to be closed");
                    let name = fileLike.name.trim();
                    const date = new Date(void 0 === fileLike.lastModified ? Date.now() : fileLike.lastModified);
                    if (fileLike.directory && !name.endsWith("/") && (name += "/"), files[name]) throw new Error("File already exists.");
                    const nameBuf = encoder.encode(name);
                    filenames.push(name);
                    const zipObject = files[name] = {
                        level: 0,
                        ctrl,
                        directory: !!fileLike.directory,
                        nameBuf,
                        comment: encoder.encode(fileLike.comment || ""),
                        compressedLength: 0,
                        uncompressedLength: 0,
                        writeHeader() {
                            var header = getDataHelper(26), data = getDataHelper(30 + nameBuf.length);
                            zipObject.offset = offset, zipObject.header = header, 0 === zipObject.level || zipObject.directory || header.view.setUint16(4, 2048), 
                            header.view.setUint32(0, 335546376), header.view.setUint16(6, (date.getHours() << 6 | date.getMinutes()) << 5 | date.getSeconds() / 2, !0), 
                            header.view.setUint16(8, (date.getFullYear() - 1980 << 4 | date.getMonth() + 1) << 5 | date.getDate(), !0), 
                            header.view.setUint16(22, nameBuf.length, !0), data.view.setUint32(0, 1347093252), 
                            data.array.set(header.array, 4), data.array.set(nameBuf, 30), offset += data.array.length, 
                            ctrl.enqueue(data.array);
                        },
                        writeFooter() {
                            var footer = getDataHelper(16);
                            footer.view.setUint32(0, 1347094280), zipObject.crc && (zipObject.header.view.setUint32(10, zipObject.crc.get(), !0), 
                            zipObject.header.view.setUint32(14, zipObject.compressedLength, !0), zipObject.header.view.setUint32(18, zipObject.uncompressedLength, !0), 
                            footer.view.setUint32(4, zipObject.crc.get(), !0), footer.view.setUint32(8, zipObject.compressedLength, !0), 
                            footer.view.setUint32(12, zipObject.uncompressedLength, !0)), ctrl.enqueue(footer.array), 
                            offset += zipObject.compressedLength + 16, next();
                        },
                        fileLike
                    };
                    activeZipObject || (activeZipObject = zipObject, processNextChunk());
                },
                close() {
                    if (closed) throw new TypeError("Cannot close a readable stream that has already been requested to be closed");
                    activeZipObject || closeZip(), closed = !0;
                }
            };
            function closeZip() {
                var indexFilename, file, length = 0, index = 0;
                for (indexFilename = 0; indexFilename < filenames.length; indexFilename++) length += 46 + (file = files[filenames[indexFilename]]).nameBuf.length + file.comment.length;
                const data = getDataHelper(length + 22);
                for (indexFilename = 0; indexFilename < filenames.length; indexFilename++) file = files[filenames[indexFilename]], 
                data.view.setUint32(index, 1347092738), data.view.setUint16(index + 4, 5120), data.array.set(file.header.array, index + 6), 
                data.view.setUint16(index + 32, file.comment.length, !0), file.directory && data.view.setUint8(index + 38, 16), 
                data.view.setUint32(index + 42, file.offset, !0), data.array.set(file.nameBuf, index + 46), 
                data.array.set(file.comment, index + 46 + file.nameBuf.length), index += 46 + file.nameBuf.length + file.comment.length;
                data.view.setUint32(index, 1347093766), data.view.setUint16(index + 8, filenames.length, !0), 
                data.view.setUint16(index + 10, filenames.length, !0), data.view.setUint32(index + 12, length, !0), 
                data.view.setUint32(index + 16, offset, !0), ctrl.enqueue(data.array), ctrl.close();
            }
            function processNextChunk() {
                var zipObj;
                if (activeZipObject) return activeZipObject.directory ? activeZipObject.writeFooter(activeZipObject.writeHeader()) : activeZipObject.reader ? (zipObj = activeZipObject).reader.read().then(chunk => {
                    if (chunk.done) return zipObj.writeFooter();
                    const outputData = chunk.value;
                    zipObj.crc.append(outputData), zipObj.uncompressedLength += outputData.length, zipObj.compressedLength += outputData.length, 
                    zipObj.ctrl.enqueue(outputData);
                }) : void (activeZipObject.fileLike.stream ? (activeZipObject.crc = new Crc32, activeZipObject.reader = activeZipObject.fileLike.stream().getReader(), 
                activeZipObject.writeHeader()) : next());
            }
            return new ReadableStream({
                start: c => {
                    ctrl = c, underlyingSource.start && Promise.resolve(underlyingSource.start(zipWriter));
                },
                pull: () => processNextChunk() || underlyingSource.pull && Promise.resolve(underlyingSource.pull(zipWriter))
            });
        }
        window.ZIP = createWriter;
        const tiles = [];
        let currentEditMode = new EditModeNone([]);
        const setEditMode = newMode => {
            switch (currentEditMode.destroy(), newMode) {
              case 2:
                currentEditMode = new EM_Single(tiles);
                break;

              case 1:
                currentEditMode = new EM_MassEdit(tiles);
                break;

              case 3:
                currentEditMode = new EM_DragEdit(tiles);
                break;

              default:
                currentEditMode = new EditModeNone([]);
            }
        }, onDialogClose = () => {
            setEditMode(0), main.state.save();
        }, loadImage = async event => {
            const files = event.target.files;
            if (!files || 0 === files.length) return;
            const state = main.state;
            let selected = currentEditMode.getSelected();
            0 === selected.length && (selected = state.missions.getAll()), selected.length;
            const chunks = selected.length / files.length;
            for (let index = 0; index < files.length; index++) {
                const missions = selected.slice(index * chunks, (index + 1) * chunks);
                await loadImageFile(state, missions, files[index]);
            }
            state.removeUnusedImages(), ImageEditor_updatePreview(), currentEditMode.imageReloaded();
        }, loadImageFile = async (state, missions, inputFile) => {
            const image = await Bimage.fromFile(inputFile), count = missions.length, rows = Math.ceil(count / 6), columnCount = Math.min(count, 6), imgSize = Math.min(image.width / columnCount, image.height / rows), offsetX = (image.width - imgSize * columnCount) / 2, offsetY = (image.height - imgSize * rows) / 2, imageIndex = state.addImage(image);
            missions.forEach((mission, index) => {
                const id = count - index - 1, x = id % 6, y = Math.floor(id / 6);
                mission.setImage(imageIndex, {
                    x: offsetX + x * imgSize,
                    y: offsetY + y * imgSize,
                    width: imgSize,
                    height: imgSize
                });
            });
        }, ImageEditor_updatePreview = () => {
            tiles.forEach(t => t.update());
        }, downloadImages = async () => {
            let missions = currentEditMode.getSelected();
            0 === missions.length && (missions = main.state.missions.getAll());
            const files = [];
            for (let i = 0; i < missions.length; i++) {
                const mission = missions[i], file = await mission.getImage().toFile(mission.getImageFilename(), "image/png");
                files.push(file);
            }
            if ($("#dialog-umm_image_edit #saveAsZip").is(":checked")) {
                const readableStream = createWriter({
                    start(ctrl) {
                        files.forEach(file => ctrl.enqueue(file)), ctrl.close();
                    }
                }), filename = createFilename(main.state, "_badges.zip");
                await new Response(readableStream).blob().then(blob => {
                    saveAs(blob, filename, "application/zip");
                });
            } else files.forEach(file => saveAs(file, file.name, "image/png"));
        }, onMaskChanged = status => {
            tiles.forEach(t => t.showMask(status));
        }, onBorderChanged = status => {
            tiles.forEach(t => t.showBorder(status));
        }, onSelectionMode = status => {
            currentEditMode.toggleSelectionMode(status);
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
                title: `${title} v1.2`,
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
            if (info.html(window.convertTextToTableMagic(table)), mission.hasImage()) {
                const element = new MissionImage(mission).createImage();
                info.append(element);
            }
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
            mission ? mission.show(!0) : notification("Can't zoom in on this mission. No portals.");
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
            }), Button_button("Edit", () => editMissionSetDetails(), "editButton"), Button_button("Pics", () => (() => {
                main.state.missions.forEach(mission => {
                    tiles[mission.id] = new MissionImage(mission);
                }), tiles.reverse();
                const html = $("<div>", {
                    class: "container"
                }).append($("<div>", {
                    class: "imageContainer"
                }).append([ ...tiles.map(t => t.createImage()) ]), $("<div>", {
                    class: "umm_group_container"
                }).append($("<fieldset>", {
                    class: "umm_group"
                }).append($("<legend>", {
                    text: "Edit mode"
                }), Checkbox_checkbox("temp2", "select mission", !0).on("change", event => onSelectionMode($(event.target).is(":checked"))), $("<div>").append($("<input>", {
                    type: "radio",
                    id: "EM_noEdit",
                    name: "editmode",
                    click: () => setEditMode(0)
                }), $("<label>", {
                    for: "EM_noEdit",
                    text: "no edit"
                })), $("<div>").append($("<input>", {
                    type: "radio",
                    id: "EM_massedit",
                    name: "editmode",
                    click: () => setEditMode(1)
                }).prop("checked", !0), $("<label>", {
                    for: "EM_massedit",
                    text: "one image"
                })), $("<div>").append($("<input>", {
                    type: "radio",
                    id: "EM_singleedit",
                    name: "editmode",
                    click: () => setEditMode(2)
                }), $("<label>", {
                    for: "EM_singleedit",
                    text: "seperated images"
                })), $("<div>").append($("<input>", {
                    type: "radio",
                    id: "EM_swapedit",
                    name: "editmode",
                    click: () => setEditMode(3)
                }), $("<label>", {
                    for: "EM_swapedit",
                    text: "swap images"
                }))), $("<fieldset>", {
                    class: "umm_group"
                }).append($("<legend>", {
                    text: "View options"
                }), Checkbox_checkbox("temp2", "show mask", !0).on("change", event => onMaskChanged($(event.target).is(":checked"))), Checkbox_checkbox("temp2", "show border", !1).on("change", event => onBorderChanged($(event.target).is(":checked")))), $("<fieldset>", {
                    class: "umm_group"
                }).append($("<legend>", {
                    text: "Import / Export"
                }), $("<input>", {
                    type: "file",
                    multiple: !0,
                    accept: "image/png, image/jpeg",
                    change: loadImage
                }).css({
                    "max-width": "20em"
                }), $("<hr>").css({
                    width: "80%"
                }), $("<div>").css({
                    display: "flex"
                }).append($("<button>", {
                    id: "download-image",
                    type: "button",
                    text: "Download Images",
                    click: downloadImages
                }), Checkbox_checkbox("saveAsZip", "as ZIP", !0).css({
                    "margin-left": "auto",
                    width: "6em"
                })))));
                window.dialog({
                    title: "UUM-Image Edit",
                    id: "umm_image_edit",
                    width: 600,
                    html,
                    closeCallback: onDialogClose,
                    classes: {
                        "ui-dialog": "dialog-umm_image_edit"
                    }
                }), ImageEditor_updatePreview(), setEditMode(1);
            })(), "imageButton")), $("<p>").append(Button_button("Change active mission #", editActiveMission, "w-full"), Button_button("Zoom to view all missions", () => state.missions.zoom(), "w-full")), $("<hr>"), Button_button("Generate mission", showMissionGenerator, "w-full"), Button_button("Split mission", splitMissionOptions, "w-full"), Button_button("Merge missions", mergeMissions, "w-full"), Button_button("Reverse missions", reverseMission, "w-full"), Button_button("Clear ALL missions data", confirmClear, "w-full"), $("<hr>"), $("<b>", {
                text: "Import/Export"
            }), $("<br>"), Button_button("Export banner data to file", () => (state => {
                const data = state.export(), filename = createFilename(state, "-mission-data.json");
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
                change: confirmLoad,
                accept: "application/JSON"
            })));
            let position;
            "undefined" != typeof android && android && (position = {
                my: "center top",
                at: "center top"
            }), window.dialog({
                html,
                title: `${title} v1.2`,
                id: "umm-options",
                width: 350,
                position,
                buttons: [ dialogButton("About this plugin", about), dialogButtonClose() ],
                closeCallback: () => MainDialog_destroy()
            }), main.state.onMissionChange.do(updateDialog), updateDialog();
        }, MainDialog_destroy = () => {
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
        };
        let currentDialog;
        const editMissionSetDetails = (toggleMissionModeAfterSave = !1) => {
            const state = main.state;
            let html = '<div class="umm-edit-mission-set-details">';
            html += "<b>Banner details</b>", html += "<p>Please enter the details for your banner. All fields are required.</p><br>", 
            html += createLabel("umm-mission-set-name", "Banner name", "(max. 50 characters)", "Please enter a valid banner name"), 
            html += '<input id="umm-mission-set-name" name="umm-mission-set-name" type="text" placeholder="Enter name for the banner" maxlength="50">', 
            html += createLabel("umm-mission-set-description", "Banner description", "(max. 200 characters)", "Please enter a valid banner description"), 
            html += '<textarea id="umm-mission-set-description" name="umm-mission-set-description" placeholder="Enter description for the banner" maxlength="200" rows="5"></textarea>', 
            html += createLabel("umm-mission-planned-banner-length", "Planned banner length", `, min. ${Math.max(state.missions.count(), 1)} mission(s)`, "Please enter a valid banner length"), 
            html += '<input id="umm-mission-planned-banner-length" name="umm-mission-planned-banner-length" type="number" placeholder="Enter length of banner set" min="1">', 
            html += createLabel("umm-mission-category", "IMATTC Category", "(if installed, blank for none)", ""), 
            html += '<input id="umm-mission-category" name="umm-mission-category" type="text">', 
            html += '<label><input id="umm-mission-sequential" name="umm-mission-sequential" type="checkbox" checked />\n        <b>Sequential Missions</b>(Sequential or Anyorder)</label>', 
            html += '<label><input id="umm-mission-hide-waypoint" name="umm-mission-hide-waypoint" type="checkbox" style="margin-left:2em;"/>\n        <b>Hide waypoint location</b>(only for Sequential missions)</label>', 
            html += "<details>", html += "<summary><b>Title format</b><span class='umm-error' id='umm-mission-title-format-error'><b>Error: </b>Please enter a valid title-format</span></summary>", 
            html += '<table>\n      <tr><td>$T = Mission title</td><td>additional flags:</td></tr>\n      <tr><td>$N = Current Missione number</td><td>$0n = with leading zeros</td></tr>\n      <tr><td>$M = Banner length</td><td>$3n = minimum length</td></tr>\n      </table>\n      <br><br>Examples: "$T $N / $M" or "$0n.$m $t"  or "$T $03N-$03M" </p> \n      </details>\n      <input id="umm-mission-title-format" name="umm-mission-title-format" type="text" placeholder="Enter a title format" style="margin-bottom: 5px;">\n      <b>Preview: </b><span id="umm-mission-title-preview"></span>', 
            html += "</div>", currentDialog = window.dialog({
                html,
                title: "Edit banner details - UMM v1.2",
                id: "umm-options",
                width: 400,
                buttons: [ dialogButton("< Main Menu", showUmmOptions), dialogButton("Save", () => successfulSave(toggleMissionModeAfterSave)), dialogButtonClose() ]
            }), updateFormValues({
                name: state.getBannerName(),
                description: state.getBannerDesc(),
                length: Math.max(state.getPlannedLength(), 1),
                format: state.getTitleFormat() ?? "$T $N / $M",
                sequential: state.getSequential().sequential,
                hiddenLocation: state.getSequential().hiddenLocation,
                category: state.isCustomCategory() ? state.category : void 0
            }), updateCalcualtedValues(), $("#umm-mission-set-name, #umm-mission-set-description, #umm-banner-length, #umm-title-format").on("input", updateCalcualtedValues), 
            $("#umm-mission-category").on("input", () => $("#umm-mission-category").prop("unset", !1));
        }, createLabel = (forID, title, description, error) => `<label for="${forID}"><b>${title}</b>${description}</label>\n      <span class="umm-error" id="${forID}-error"><b>Error: </b>${error}</span>`, successfulSave = async toggleMissionModeAfterSave => {
            const values = getFormValues();
            await saveMissionSetDetails(values) && (bannerNotification(main.state, "Mission details saved"), 
            toggleMissionModeAfterSave && toggleMissionMode(), $("#dialog-umm-options").dialog("close"));
        }, updateCalcualtedValues = () => {
            const values = getFormValues(), plannedLength = values.length;
            if (values.name.length > 0 && values.format.length > 0 && !isNaN(plannedLength)) {
                const missionTitle = Missions.generateMissionTitle(values.format, {
                    misison: 1,
                    title: values.name,
                    total: plannedLength
                });
                $("#umm-mission-title-preview").text(missionTitle);
            } else $("#umm-mission-title-preview").text("Fill in all required fields");
            $("#umm-mission-category", currentDialog).prop("unset") && $("#umm-mission-category").val(values.name);
        }, saveMissionSetDetails = async data => {
            const isValid = validateForm(data);
            return isValid && (main.state.setBannerName(data.name), main.state.setBannerDesc(data.description), 
            main.state.setPlannedLength(data.length), main.state.setTitleFormat(data.format), 
            main.state.setSequential(data.sequential, data.hiddenLocation), main.state.category = data.category, 
            await main.state.save()), isValid;
        }, validateForm = data => {
            let isValid = !0;
            return isValid = validate("umm-mission-set-name", void 0 !== data.name && data.name.length > 0 && data.name.length <= 50) && isValid, 
            isValid = validate("umm-mission-set-description", void 0 !== data.description && data.description.length > 0 && data.description.length <= 200) && isValid, 
            isValid = validate("umm-mission-planned-banner-length", data.length > 0 && !isNaN(data.length)) && isValid, 
            isValid = validate("umm-mission-title-format", void 0 !== data.format && data.format.length > 0) && isValid, 
            isValid;
        }, validate = (elementId, isValid) => ($(`#${elementId}-error`, currentDialog).toggle(!isValid), 
        isValid), getFormValues = () => ({
            name: $("#umm-mission-set-name", currentDialog).val(),
            description: $("#umm-mission-set-description", currentDialog).val(),
            length: parseInt($("#umm-mission-planned-banner-length", currentDialog).val() ?? ""),
            format: $("#umm-mission-title-format", currentDialog).val(),
            sequential: $("#umm-mission-sequential", currentDialog).is(":checked"),
            hiddenLocation: $("#umm-mission-hide-waypoint", currentDialog).is(":checked"),
            category: $("#umm-mission-category", currentDialog).prop("unset") ? $("#umm-mission-category", currentDialog).val() : void 0
        }), updateFormValues = data => {
            $("#umm-mission-set-name", currentDialog).val(data.name), $("#umm-mission-set-description", currentDialog).val(data.description), 
            $("#umm-mission-planned-banner-length", currentDialog).val(data.length), $("#umm-mission-title-format", currentDialog).val(data.format), 
            $("#umm-mission-sequential", currentDialog).prop(":checked", data.sequential), $("#umm-mission-hide-waypoint", currentDialog).prop(":checked", data.hiddenLocation), 
            $("#umm-mission-category", currentDialog).val(data.category ?? ""), $("#umm-mission-category", currentDialog).prop("unset", !data.category);
        };
        let lastPortal;
        const clearMissionData = () => {
            main.state.reset(), main.state.clearImages(), main.state.save(), main.missionModeActive && toggleMissionMode();
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
            firstToobarShow=!0;
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
                this.missionModeActive = !1;
            }
            toggleUMM() {
                $(".leaflet-umm.leaflet-bar").toggle(), $(".leaflet-umm.leaflet-bar").is(":visible") ? this.activateUMM() : this.deactivateUMM();
            }
            activateUMM() {
                this.firstToobarShow ? (this.firstToobarShow = !1, $(".leaflet-umm").fadeIn().fadeOut().fadeIn().fadeOut().fadeIn().fadeOut().fadeIn()) : $(".leaflet-umm").fadeIn(), 
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
})();
};

/**
 * # v1.2
 * 
 * - new Picture dialog - setup Banner images directly in UMM.
 * - added "Sequential" flag
 * - with IMATTC support
 * - reduce map movements
 * 
 * with all this addition you can now import a mission in minimal Steps:
 * 
 * 1.  load banner json
 * 2.  select mission
 * 3.  click "import"
 * 4.  submit mission
 *     (repeat 2-4 for all missions)
 * 
 * # v1.1.2
 * 
 * - fix: dialogs auto open on load - forgotten debug code
 *   (nah, the truth: the build script should have removed it, but it failed)
 * 
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
/*! For license information please see editor.user.js.LICENSE.txt */
(() => {
    var __webpack_modules__ = {
        879(module, __webpack_exports__, __webpack_require__) {
            "use strict";
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601), _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314), _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__), _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(417), _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__), ___CSS_LOADER_URL_IMPORT_0___ = new URL(__webpack_require__(977), __webpack_require__.b), ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()), ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
            ___CSS_LOADER_EXPORT___.push([ module.id, `#userscript-progress-overlay{align-items:center;background:rgba(0,0,0,.55);display:flex;inset:0;justify-content:center;position:fixed;z-index:2200}#userscript-progress-overlay .progress-dialog{align-items:center;background:#040915;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,.3);box-shadow:0 0 40px 80px #040915;display:flex;flex-direction:column;font-family:Arial,sans-serif;font-size:16px;gap:16px;padding:24px 32px}#userscript-progress-overlay #progress-anim{border-radius:8px;display:flex;margin:auto;padding:24px 32px}#userscript-progress-overlay #progress-cancel{margin-left:auto;scale:.6}#umm-badge{background-color:crimson;margin:15px 0 0 10px;padding:0 5px}#umm-badge,#umm-mission-editor-bar{color:#fff;float:left;height:26px;line-height:28px;vertical-align:middle}#umm-mission-editor-bar{align-items:center;background-color:#08304e;display:flex;flex-wrap:nowrap;margin-top:15px;padding-left:5px}#umm-mission-title{display:inline-block;max-width:200px;min-width:4em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#umm-mission-picker-wrapper{display:inline-block;margin-left:10px}.umm-upload-label{background-image:url(${___CSS_LOADER_URL_REPLACEMENT_0___});background-size:cover;box-sizing:border-box;cursor:pointer;display:inline-block;height:16px;margin:0 0 0 5px;padding:3px 0 7px;width:16px}#umm-import-file{border:none;border-radius:0;height:.1px;opacity:0;overflow:hidden;position:absolute;width:.1px;z-index:-1}.umm-mission-picker{margin-left:15px}.umm-mission-picker,.umm-mission-picker-btn{background-color:#08304e;height:26px;padding:0 10px}.umm-mission-picker-btn{margin-left:3px}.umm-notification{background-color:#383838;border-radius:2px;-webkit-box-shadow:0 0 24px -1px #383838;-moz-box-shadow:0 0 24px -1px #383838;box-shadow:0 0 24px -1px #383838;color:#f0f0f0;font-family:Calibri,sans-serif;font-size:20px;height:20px;height:auto;left:50%;margin-left:-100px;padding:10px;position:fixed;text-align:center;top:55px;width:300px;z-index:10000}.umm-options-list a{background:rgba(8,48,78,.9);border:1px solid #ffce00;color:#ffce00;display:block;margin:10px auto;padding:3px 0;text-align:center;width:80%}`, "" ]);
            const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
            __webpack_require__.d(__webpack_exports__, [ "A", 0, __WEBPACK_DEFAULT_EXPORT__ ]);
        },
        314(module) {
            "use strict";
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
            "use strict";
            module.exports = function(url, options) {
                return options || (options = {}), url ? (url = String(url.__esModule ? url.default : url), 
                /^['"].*['"]$/.test(url) && (url = url.slice(1, -1)), options.hash && (url += options.hash), 
                /["'() \t\n]|(%20)/.test(url) || options.needQuotes ? '"'.concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), '"') : url) : url;
            };
        },
        601(module) {
            "use strict";
            module.exports = function(i) {
                return i[1];
            };
        },
        790(module, __unused_webpack_exports, __webpack_require__) {
            module.exports = function e(t, n, r) {
                function s(o, u) {
                    if (!n[o]) {
                        if (!t[o]) {
                            if (i) return i(o, !0);
                            var f = new Error("Cannot find module '" + o + "'");
                            throw f.code = "MODULE_NOT_FOUND", f;
                        }
                        var l = n[o] = {
                            exports: {}
                        };
                        t[o][0].call(l.exports, function(e) {
                            var n = t[o][1][e];
                            return s(n || e);
                        }, l, l.exports, e, t, n, r);
                    }
                    return n[o].exports;
                }
                for (var i = void 0, o = 0; o < r.length; o++) s(r[o]);
                return s;
            }({
                1: [ function(_dereq_, module, exports) {
                    (function(global) {
                        "use strict";
                        var scheduleDrain, draining, Mutation = global.MutationObserver || global.WebKitMutationObserver;
                        if (Mutation) {
                            var called = 0, observer = new Mutation(nextTick), element = global.document.createTextNode("");
                            observer.observe(element, {
                                characterData: !0
                            }), scheduleDrain = function() {
                                element.data = called = ++called % 2;
                            };
                        } else if (global.setImmediate || void 0 === global.MessageChannel) scheduleDrain = "document" in global && "onreadystatechange" in global.document.createElement("script") ? function() {
                            var scriptEl = global.document.createElement("script");
                            scriptEl.onreadystatechange = function() {
                                nextTick(), scriptEl.onreadystatechange = null, scriptEl.parentNode.removeChild(scriptEl), 
                                scriptEl = null;
                            }, global.document.documentElement.appendChild(scriptEl);
                        } : function() {
                            setTimeout(nextTick, 0);
                        }; else {
                            var channel = new global.MessageChannel;
                            channel.port1.onmessage = nextTick, scheduleDrain = function() {
                                channel.port2.postMessage(0);
                            };
                        }
                        var queue = [];
                        function nextTick() {
                            var i, oldQueue;
                            draining = !0;
                            for (var len = queue.length; len; ) {
                                for (oldQueue = queue, queue = [], i = -1; ++i < len; ) oldQueue[i]();
                                len = queue.length;
                            }
                            draining = !1;
                        }
                        function immediate(task) {
                            1 !== queue.push(task) || draining || scheduleDrain();
                        }
                        module.exports = immediate;
                    }).call(this, void 0 !== __webpack_require__.g ? __webpack_require__.g : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
                }, {} ],
                2: [ function(_dereq_, module, exports) {
                    "use strict";
                    var immediate = _dereq_(1);
                    function INTERNAL() {}
                    var handlers = {}, REJECTED = [ "REJECTED" ], FULFILLED = [ "FULFILLED" ], PENDING = [ "PENDING" ];
                    function Promise(resolver) {
                        if ("function" != typeof resolver) throw new TypeError("resolver must be a function");
                        this.state = PENDING, this.queue = [], this.outcome = void 0, resolver !== INTERNAL && safelyResolveThenable(this, resolver);
                    }
                    function QueueItem(promise, onFulfilled, onRejected) {
                        this.promise = promise, "function" == typeof onFulfilled && (this.onFulfilled = onFulfilled, 
                        this.callFulfilled = this.otherCallFulfilled), "function" == typeof onRejected && (this.onRejected = onRejected, 
                        this.callRejected = this.otherCallRejected);
                    }
                    function unwrap(promise, func, value) {
                        immediate(function() {
                            var returnValue;
                            try {
                                returnValue = func(value);
                            } catch (e) {
                                return handlers.reject(promise, e);
                            }
                            returnValue === promise ? handlers.reject(promise, new TypeError("Cannot resolve promise with itself")) : handlers.resolve(promise, returnValue);
                        });
                    }
                    function getThen(obj) {
                        var then = obj && obj.then;
                        if (obj && ("object" == typeof obj || "function" == typeof obj) && "function" == typeof then) return function appyThen() {
                            then.apply(obj, arguments);
                        };
                    }
                    function safelyResolveThenable(self, thenable) {
                        var called = !1;
                        function onError(value) {
                            called || (called = !0, handlers.reject(self, value));
                        }
                        function onSuccess(value) {
                            called || (called = !0, handlers.resolve(self, value));
                        }
                        function tryToUnwrap() {
                            thenable(onSuccess, onError);
                        }
                        var result = tryCatch(tryToUnwrap);
                        "error" === result.status && onError(result.value);
                    }
                    function tryCatch(func, value) {
                        var out = {};
                        try {
                            out.value = func(value), out.status = "success";
                        } catch (e) {
                            out.status = "error", out.value = e;
                        }
                        return out;
                    }
                    function resolve(value) {
                        return value instanceof this ? value : handlers.resolve(new this(INTERNAL), value);
                    }
                    function reject(reason) {
                        var promise = new this(INTERNAL);
                        return handlers.reject(promise, reason);
                    }
                    function all(iterable) {
                        var self = this;
                        if ("[object Array]" !== Object.prototype.toString.call(iterable)) return this.reject(new TypeError("must be an array"));
                        var len = iterable.length, called = !1;
                        if (!len) return this.resolve([]);
                        for (var values = new Array(len), resolved = 0, i = -1, promise = new this(INTERNAL); ++i < len; ) allResolver(iterable[i], i);
                        return promise;
                        function allResolver(value, i) {
                            function resolveFromAll(outValue) {
                                values[i] = outValue, ++resolved !== len || called || (called = !0, handlers.resolve(promise, values));
                            }
                            self.resolve(value).then(resolveFromAll, function(error) {
                                called || (called = !0, handlers.reject(promise, error));
                            });
                        }
                    }
                    function race(iterable) {
                        var self = this;
                        if ("[object Array]" !== Object.prototype.toString.call(iterable)) return this.reject(new TypeError("must be an array"));
                        var len = iterable.length, called = !1;
                        if (!len) return this.resolve([]);
                        for (var i = -1, promise = new this(INTERNAL); ++i < len; ) resolver(iterable[i]);
                        return promise;
                        function resolver(value) {
                            self.resolve(value).then(function(response) {
                                called || (called = !0, handlers.resolve(promise, response));
                            }, function(error) {
                                called || (called = !0, handlers.reject(promise, error));
                            });
                        }
                    }
                    module.exports = Promise, Promise.prototype.catch = function(onRejected) {
                        return this.then(null, onRejected);
                    }, Promise.prototype.then = function(onFulfilled, onRejected) {
                        if ("function" != typeof onFulfilled && this.state === FULFILLED || "function" != typeof onRejected && this.state === REJECTED) return this;
                        var promise = new this.constructor(INTERNAL);
                        return this.state !== PENDING ? unwrap(promise, this.state === FULFILLED ? onFulfilled : onRejected, this.outcome) : this.queue.push(new QueueItem(promise, onFulfilled, onRejected)), 
                        promise;
                    }, QueueItem.prototype.callFulfilled = function(value) {
                        handlers.resolve(this.promise, value);
                    }, QueueItem.prototype.otherCallFulfilled = function(value) {
                        unwrap(this.promise, this.onFulfilled, value);
                    }, QueueItem.prototype.callRejected = function(value) {
                        handlers.reject(this.promise, value);
                    }, QueueItem.prototype.otherCallRejected = function(value) {
                        unwrap(this.promise, this.onRejected, value);
                    }, handlers.resolve = function(self, value) {
                        var result = tryCatch(getThen, value);
                        if ("error" === result.status) return handlers.reject(self, result.value);
                        var thenable = result.value;
                        if (thenable) safelyResolveThenable(self, thenable); else {
                            self.state = FULFILLED, self.outcome = value;
                            for (var i = -1, len = self.queue.length; ++i < len; ) self.queue[i].callFulfilled(value);
                        }
                        return self;
                    }, handlers.reject = function(self, error) {
                        self.state = REJECTED, self.outcome = error;
                        for (var i = -1, len = self.queue.length; ++i < len; ) self.queue[i].callRejected(error);
                        return self;
                    }, Promise.resolve = resolve, Promise.reject = reject, Promise.all = all, Promise.race = race;
                }, {
                    1: 1
                } ],
                3: [ function(_dereq_, module, exports) {
                    (function(global) {
                        "use strict";
                        "function" != typeof global.Promise && (global.Promise = _dereq_(2));
                    }).call(this, void 0 !== __webpack_require__.g ? __webpack_require__.g : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
                }, {
                    2: 2
                } ],
                4: [ function(_dereq_, module, exports) {
                    "use strict";
                    var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                        return typeof obj;
                    } : function(obj) {
                        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                    };
                    function _classCallCheck(instance, Constructor) {
                        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
                    }
                    function getIDB() {
                        try {
                            if ("undefined" != typeof indexedDB) return indexedDB;
                            if ("undefined" != typeof webkitIndexedDB) return webkitIndexedDB;
                            if ("undefined" != typeof mozIndexedDB) return mozIndexedDB;
                            if ("undefined" != typeof OIndexedDB) return OIndexedDB;
                            if ("undefined" != typeof msIndexedDB) return msIndexedDB;
                        } catch (e) {
                            return;
                        }
                    }
                    var idb = getIDB();
                    function isIndexedDBValid() {
                        try {
                            if (!idb || !idb.open) return !1;
                            var isSafari = "undefined" != typeof openDatabase && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform), hasFetch = "function" == typeof fetch && -1 !== fetch.toString().indexOf("[native code");
                            return (!isSafari || hasFetch) && "undefined" != typeof indexedDB && "undefined" != typeof IDBKeyRange;
                        } catch (e) {
                            return !1;
                        }
                    }
                    function createBlob(parts, properties) {
                        parts = parts || [], properties = properties || {};
                        try {
                            return new Blob(parts, properties);
                        } catch (e) {
                            if ("TypeError" !== e.name) throw e;
                            for (var builder = new ("undefined" != typeof BlobBuilder ? BlobBuilder : "undefined" != typeof MSBlobBuilder ? MSBlobBuilder : "undefined" != typeof MozBlobBuilder ? MozBlobBuilder : WebKitBlobBuilder), i = 0; i < parts.length; i += 1) builder.append(parts[i]);
                            return builder.getBlob(properties.type);
                        }
                    }
                    "undefined" == typeof Promise && _dereq_(3);
                    var Promise$1 = Promise;
                    function executeCallback(promise, callback) {
                        callback && promise.then(function(result) {
                            callback(null, result);
                        }, function(error) {
                            callback(error);
                        });
                    }
                    function executeTwoCallbacks(promise, callback, errorCallback) {
                        "function" == typeof callback && promise.then(callback), "function" == typeof errorCallback && promise.catch(errorCallback);
                    }
                    function normalizeKey(key) {
                        return "string" != typeof key && (console.warn(key + " used as a key, but it is not a string."), 
                        key = String(key)), key;
                    }
                    function getCallback() {
                        if (arguments.length && "function" == typeof arguments[arguments.length - 1]) return arguments[arguments.length - 1];
                    }
                    var DETECT_BLOB_SUPPORT_STORE = "local-forage-detect-blob-support", supportsBlobs = void 0, dbContexts = {}, toString = Object.prototype.toString, READ_ONLY = "readonly", READ_WRITE = "readwrite";
                    function _binStringToArrayBuffer(bin) {
                        for (var length = bin.length, buf = new ArrayBuffer(length), arr = new Uint8Array(buf), i = 0; i < length; i++) arr[i] = bin.charCodeAt(i);
                        return buf;
                    }
                    function _checkBlobSupportWithoutCaching(idb) {
                        return new Promise$1(function(resolve) {
                            var txn = idb.transaction(DETECT_BLOB_SUPPORT_STORE, READ_WRITE), blob = createBlob([ "" ]);
                            txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, "key"), txn.onabort = function(e) {
                                e.preventDefault(), e.stopPropagation(), resolve(!1);
                            }, txn.oncomplete = function() {
                                var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/), matchedEdge = navigator.userAgent.match(/Edge\//);
                                resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
                            };
                        }).catch(function() {
                            return !1;
                        });
                    }
                    function _checkBlobSupport(idb) {
                        return "boolean" == typeof supportsBlobs ? Promise$1.resolve(supportsBlobs) : _checkBlobSupportWithoutCaching(idb).then(function(value) {
                            return supportsBlobs = value;
                        });
                    }
                    function _deferReadiness(dbInfo) {
                        var dbContext = dbContexts[dbInfo.name], deferredOperation = {};
                        deferredOperation.promise = new Promise$1(function(resolve, reject) {
                            deferredOperation.resolve = resolve, deferredOperation.reject = reject;
                        }), dbContext.deferredOperations.push(deferredOperation), dbContext.dbReady ? dbContext.dbReady = dbContext.dbReady.then(function() {
                            return deferredOperation.promise;
                        }) : dbContext.dbReady = deferredOperation.promise;
                    }
                    function _advanceReadiness(dbInfo) {
                        var deferredOperation = dbContexts[dbInfo.name].deferredOperations.pop();
                        if (deferredOperation) return deferredOperation.resolve(), deferredOperation.promise;
                    }
                    function _rejectReadiness(dbInfo, err) {
                        var deferredOperation = dbContexts[dbInfo.name].deferredOperations.pop();
                        if (deferredOperation) return deferredOperation.reject(err), deferredOperation.promise;
                    }
                    function _getConnection(dbInfo, upgradeNeeded) {
                        return new Promise$1(function(resolve, reject) {
                            if (dbContexts[dbInfo.name] = dbContexts[dbInfo.name] || createDbContext(), dbInfo.db) {
                                if (!upgradeNeeded) return resolve(dbInfo.db);
                                _deferReadiness(dbInfo), dbInfo.db.close();
                            }
                            var dbArgs = [ dbInfo.name ];
                            upgradeNeeded && dbArgs.push(dbInfo.version);
                            var openreq = idb.open.apply(idb, dbArgs);
                            upgradeNeeded && (openreq.onupgradeneeded = function(e) {
                                var db = openreq.result;
                                try {
                                    db.createObjectStore(dbInfo.storeName), e.oldVersion <= 1 && db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
                                } catch (ex) {
                                    if ("ConstraintError" !== ex.name) throw ex;
                                    console.warn('The database "' + dbInfo.name + '" has been upgraded from version ' + e.oldVersion + " to version " + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
                                }
                            }), openreq.onerror = function(e) {
                                e.preventDefault(), reject(openreq.error);
                            }, openreq.onsuccess = function() {
                                var db = openreq.result;
                                db.onversionchange = function(e) {
                                    e.target.close();
                                }, resolve(db), _advanceReadiness(dbInfo);
                            };
                        });
                    }
                    function _getOriginalConnection(dbInfo) {
                        return _getConnection(dbInfo, !1);
                    }
                    function _getUpgradedConnection(dbInfo) {
                        return _getConnection(dbInfo, !0);
                    }
                    function _isUpgradeNeeded(dbInfo, defaultVersion) {
                        if (!dbInfo.db) return !0;
                        var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName), isDowngrade = dbInfo.version < dbInfo.db.version, isUpgrade = dbInfo.version > dbInfo.db.version;
                        if (isDowngrade && (dbInfo.version !== defaultVersion && console.warn('The database "' + dbInfo.name + "\" can't be downgraded from version " + dbInfo.db.version + " to version " + dbInfo.version + "."), 
                        dbInfo.version = dbInfo.db.version), isUpgrade || isNewStore) {
                            if (isNewStore) {
                                var incVersion = dbInfo.db.version + 1;
                                incVersion > dbInfo.version && (dbInfo.version = incVersion);
                            }
                            return !0;
                        }
                        return !1;
                    }
                    function _encodeBlob(blob) {
                        return new Promise$1(function(resolve, reject) {
                            var reader = new FileReader;
                            reader.onerror = reject, reader.onloadend = function(e) {
                                var base64 = btoa(e.target.result || "");
                                resolve({
                                    __local_forage_encoded_blob: !0,
                                    data: base64,
                                    type: blob.type
                                });
                            }, reader.readAsBinaryString(blob);
                        });
                    }
                    function _decodeBlob(encodedBlob) {
                        return createBlob([ _binStringToArrayBuffer(atob(encodedBlob.data)) ], {
                            type: encodedBlob.type
                        });
                    }
                    function _isEncodedBlob(value) {
                        return value && value.__local_forage_encoded_blob;
                    }
                    function _fullyReady(callback) {
                        var self = this, promise = self._initReady().then(function() {
                            var dbContext = dbContexts[self._dbInfo.name];
                            if (dbContext && dbContext.dbReady) return dbContext.dbReady;
                        });
                        return executeTwoCallbacks(promise, callback, callback), promise;
                    }
                    function _tryReconnect(dbInfo) {
                        _deferReadiness(dbInfo);
                        for (var dbContext = dbContexts[dbInfo.name], forages = dbContext.forages, i = 0; i < forages.length; i++) {
                            var forage = forages[i];
                            forage._dbInfo.db && (forage._dbInfo.db.close(), forage._dbInfo.db = null);
                        }
                        return dbInfo.db = null, _getOriginalConnection(dbInfo).then(function(db) {
                            return dbInfo.db = db, _isUpgradeNeeded(dbInfo) ? _getUpgradedConnection(dbInfo) : db;
                        }).then(function(db) {
                            dbInfo.db = dbContext.db = db;
                            for (var i = 0; i < forages.length; i++) forages[i]._dbInfo.db = db;
                        }).catch(function(err) {
                            throw _rejectReadiness(dbInfo, err), err;
                        });
                    }
                    function createTransaction(dbInfo, mode, callback, retries) {
                        void 0 === retries && (retries = 1);
                        try {
                            var tx = dbInfo.db.transaction(dbInfo.storeName, mode);
                            callback(null, tx);
                        } catch (err) {
                            if (retries > 0 && (!dbInfo.db || "InvalidStateError" === err.name || "NotFoundError" === err.name)) return Promise$1.resolve().then(function() {
                                if (!dbInfo.db || "NotFoundError" === err.name && !dbInfo.db.objectStoreNames.contains(dbInfo.storeName) && dbInfo.version <= dbInfo.db.version) return dbInfo.db && (dbInfo.version = dbInfo.db.version + 1), 
                                _getUpgradedConnection(dbInfo);
                            }).then(function() {
                                return _tryReconnect(dbInfo).then(function() {
                                    createTransaction(dbInfo, mode, callback, retries - 1);
                                });
                            }).catch(callback);
                            callback(err);
                        }
                    }
                    function createDbContext() {
                        return {
                            forages: [],
                            db: null,
                            dbReady: null,
                            deferredOperations: []
                        };
                    }
                    function _initStorage(options) {
                        var self = this, dbInfo = {
                            db: null
                        };
                        if (options) for (var i in options) dbInfo[i] = options[i];
                        var dbContext = dbContexts[dbInfo.name];
                        dbContext || (dbContext = createDbContext(), dbContexts[dbInfo.name] = dbContext), 
                        dbContext.forages.push(self), self._initReady || (self._initReady = self.ready, 
                        self.ready = _fullyReady);
                        var initPromises = [];
                        function ignoreErrors() {
                            return Promise$1.resolve();
                        }
                        for (var j = 0; j < dbContext.forages.length; j++) {
                            var forage = dbContext.forages[j];
                            forage !== self && initPromises.push(forage._initReady().catch(ignoreErrors));
                        }
                        var forages = dbContext.forages.slice(0);
                        return Promise$1.all(initPromises).then(function() {
                            return dbInfo.db = dbContext.db, _getOriginalConnection(dbInfo);
                        }).then(function(db) {
                            return dbInfo.db = db, _isUpgradeNeeded(dbInfo, self._defaultConfig.version) ? _getUpgradedConnection(dbInfo) : db;
                        }).then(function(db) {
                            dbInfo.db = dbContext.db = db, self._dbInfo = dbInfo;
                            for (var k = 0; k < forages.length; k++) {
                                var forage = forages[k];
                                forage !== self && (forage._dbInfo.db = dbInfo.db, forage._dbInfo.version = dbInfo.version);
                            }
                        });
                    }
                    function getItem(key, callback) {
                        var self = this;
                        key = normalizeKey(key);
                        var promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                createTransaction(self._dbInfo, READ_ONLY, function(err, transaction) {
                                    if (err) return reject(err);
                                    try {
                                        var req = transaction.objectStore(self._dbInfo.storeName).get(key);
                                        req.onsuccess = function() {
                                            var value = req.result;
                                            void 0 === value && (value = null), _isEncodedBlob(value) && (value = _decodeBlob(value)), 
                                            resolve(value);
                                        }, req.onerror = function() {
                                            reject(req.error);
                                        };
                                    } catch (e) {
                                        reject(e);
                                    }
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function iterate(iterator, callback) {
                        var self = this, promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                createTransaction(self._dbInfo, READ_ONLY, function(err, transaction) {
                                    if (err) return reject(err);
                                    try {
                                        var req = transaction.objectStore(self._dbInfo.storeName).openCursor(), iterationNumber = 1;
                                        req.onsuccess = function() {
                                            var cursor = req.result;
                                            if (cursor) {
                                                var value = cursor.value;
                                                _isEncodedBlob(value) && (value = _decodeBlob(value));
                                                var result = iterator(value, cursor.key, iterationNumber++);
                                                void 0 !== result ? resolve(result) : cursor.continue();
                                            } else resolve();
                                        }, req.onerror = function() {
                                            reject(req.error);
                                        };
                                    } catch (e) {
                                        reject(e);
                                    }
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function setItem(key, value, callback) {
                        var self = this;
                        key = normalizeKey(key);
                        var promise = new Promise$1(function(resolve, reject) {
                            var dbInfo;
                            self.ready().then(function() {
                                return dbInfo = self._dbInfo, "[object Blob]" === toString.call(value) ? _checkBlobSupport(dbInfo.db).then(function(blobSupport) {
                                    return blobSupport ? value : _encodeBlob(value);
                                }) : value;
                            }).then(function(value) {
                                createTransaction(self._dbInfo, READ_WRITE, function(err, transaction) {
                                    if (err) return reject(err);
                                    try {
                                        var store = transaction.objectStore(self._dbInfo.storeName);
                                        null === value && (value = void 0);
                                        var req = store.put(value, key);
                                        transaction.oncomplete = function() {
                                            void 0 === value && (value = null), resolve(value);
                                        }, transaction.onabort = transaction.onerror = function() {
                                            var err = req.error ? req.error : req.transaction.error;
                                            reject(err);
                                        };
                                    } catch (e) {
                                        reject(e);
                                    }
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function removeItem(key, callback) {
                        var self = this;
                        key = normalizeKey(key);
                        var promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                createTransaction(self._dbInfo, READ_WRITE, function(err, transaction) {
                                    if (err) return reject(err);
                                    try {
                                        var req = transaction.objectStore(self._dbInfo.storeName).delete(key);
                                        transaction.oncomplete = function() {
                                            resolve();
                                        }, transaction.onerror = function() {
                                            reject(req.error);
                                        }, transaction.onabort = function() {
                                            var err = req.error ? req.error : req.transaction.error;
                                            reject(err);
                                        };
                                    } catch (e) {
                                        reject(e);
                                    }
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function clear(callback) {
                        var self = this, promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                createTransaction(self._dbInfo, READ_WRITE, function(err, transaction) {
                                    if (err) return reject(err);
                                    try {
                                        var req = transaction.objectStore(self._dbInfo.storeName).clear();
                                        transaction.oncomplete = function() {
                                            resolve();
                                        }, transaction.onabort = transaction.onerror = function() {
                                            var err = req.error ? req.error : req.transaction.error;
                                            reject(err);
                                        };
                                    } catch (e) {
                                        reject(e);
                                    }
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function length(callback) {
                        var self = this, promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                createTransaction(self._dbInfo, READ_ONLY, function(err, transaction) {
                                    if (err) return reject(err);
                                    try {
                                        var req = transaction.objectStore(self._dbInfo.storeName).count();
                                        req.onsuccess = function() {
                                            resolve(req.result);
                                        }, req.onerror = function() {
                                            reject(req.error);
                                        };
                                    } catch (e) {
                                        reject(e);
                                    }
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function key(n, callback) {
                        var self = this, promise = new Promise$1(function(resolve, reject) {
                            n < 0 ? resolve(null) : self.ready().then(function() {
                                createTransaction(self._dbInfo, READ_ONLY, function(err, transaction) {
                                    if (err) return reject(err);
                                    try {
                                        var store = transaction.objectStore(self._dbInfo.storeName), advanced = !1, req = store.openKeyCursor();
                                        req.onsuccess = function() {
                                            var cursor = req.result;
                                            cursor ? 0 === n || advanced ? resolve(cursor.key) : (advanced = !0, cursor.advance(n)) : resolve(null);
                                        }, req.onerror = function() {
                                            reject(req.error);
                                        };
                                    } catch (e) {
                                        reject(e);
                                    }
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function keys(callback) {
                        var self = this, promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                createTransaction(self._dbInfo, READ_ONLY, function(err, transaction) {
                                    if (err) return reject(err);
                                    try {
                                        var req = transaction.objectStore(self._dbInfo.storeName).openKeyCursor(), keys = [];
                                        req.onsuccess = function() {
                                            var cursor = req.result;
                                            cursor ? (keys.push(cursor.key), cursor.continue()) : resolve(keys);
                                        }, req.onerror = function() {
                                            reject(req.error);
                                        };
                                    } catch (e) {
                                        reject(e);
                                    }
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function dropInstance(options, callback) {
                        callback = getCallback.apply(this, arguments);
                        var currentConfig = this.config();
                        (options = "function" != typeof options && options || {}).name || (options.name = options.name || currentConfig.name, 
                        options.storeName = options.storeName || currentConfig.storeName);
                        var promise, self = this;
                        if (options.name) {
                            var dbPromise = options.name === currentConfig.name && self._dbInfo.db ? Promise$1.resolve(self._dbInfo.db) : _getOriginalConnection(options).then(function(db) {
                                var dbContext = dbContexts[options.name], forages = dbContext.forages;
                                dbContext.db = db;
                                for (var i = 0; i < forages.length; i++) forages[i]._dbInfo.db = db;
                                return db;
                            });
                            promise = options.storeName ? dbPromise.then(function(db) {
                                if (db.objectStoreNames.contains(options.storeName)) {
                                    var newVersion = db.version + 1;
                                    _deferReadiness(options);
                                    var dbContext = dbContexts[options.name], forages = dbContext.forages;
                                    db.close();
                                    for (var i = 0; i < forages.length; i++) {
                                        var forage = forages[i];
                                        forage._dbInfo.db = null, forage._dbInfo.version = newVersion;
                                    }
                                    var dropObjectPromise = new Promise$1(function(resolve, reject) {
                                        var req = idb.open(options.name, newVersion);
                                        req.onerror = function(err) {
                                            req.result.close(), reject(err);
                                        }, req.onupgradeneeded = function() {
                                            req.result.deleteObjectStore(options.storeName);
                                        }, req.onsuccess = function() {
                                            var db = req.result;
                                            db.close(), resolve(db);
                                        };
                                    });
                                    return dropObjectPromise.then(function(db) {
                                        dbContext.db = db;
                                        for (var j = 0; j < forages.length; j++) {
                                            var _forage2 = forages[j];
                                            _forage2._dbInfo.db = db, _advanceReadiness(_forage2._dbInfo);
                                        }
                                    }).catch(function(err) {
                                        throw (_rejectReadiness(options, err) || Promise$1.resolve()).catch(function() {}), 
                                        err;
                                    });
                                }
                            }) : dbPromise.then(function(db) {
                                _deferReadiness(options);
                                var dbContext = dbContexts[options.name], forages = dbContext.forages;
                                db.close();
                                for (var i = 0; i < forages.length; i++) forages[i]._dbInfo.db = null;
                                var dropDBPromise = new Promise$1(function(resolve, reject) {
                                    var req = idb.deleteDatabase(options.name);
                                    req.onerror = function() {
                                        var db = req.result;
                                        db && db.close(), reject(req.error);
                                    }, req.onblocked = function() {
                                        console.warn('dropInstance blocked for database "' + options.name + '" until all open connections are closed');
                                    }, req.onsuccess = function() {
                                        var db = req.result;
                                        db && db.close(), resolve(db);
                                    };
                                });
                                return dropDBPromise.then(function(db) {
                                    dbContext.db = db;
                                    for (var i = 0; i < forages.length; i++) _advanceReadiness(forages[i]._dbInfo);
                                }).catch(function(err) {
                                    throw (_rejectReadiness(options, err) || Promise$1.resolve()).catch(function() {}), 
                                    err;
                                });
                            });
                        } else promise = Promise$1.reject("Invalid arguments");
                        return executeCallback(promise, callback), promise;
                    }
                    var asyncStorage = {
                        _driver: "asyncStorage",
                        _initStorage,
                        _support: isIndexedDBValid(),
                        iterate,
                        getItem,
                        setItem,
                        removeItem,
                        clear,
                        length,
                        key,
                        keys,
                        dropInstance
                    };
                    function isWebSQLValid() {
                        return "function" == typeof openDatabase;
                    }
                    var BASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", BLOB_TYPE_PREFIX = "~~local_forage_type~", BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/, SERIALIZED_MARKER = "__lfsc__:", SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length, TYPE_ARRAYBUFFER = "arbf", TYPE_BLOB = "blob", TYPE_INT8ARRAY = "si08", TYPE_UINT8ARRAY = "ui08", TYPE_UINT8CLAMPEDARRAY = "uic8", TYPE_INT16ARRAY = "si16", TYPE_INT32ARRAY = "si32", TYPE_UINT16ARRAY = "ur16", TYPE_UINT32ARRAY = "ui32", TYPE_FLOAT32ARRAY = "fl32", TYPE_FLOAT64ARRAY = "fl64", TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length, toString$1 = Object.prototype.toString;
                    function stringToBuffer(serializedString) {
                        var i, encoded1, encoded2, encoded3, encoded4, bufferLength = .75 * serializedString.length, len = serializedString.length, p = 0;
                        "=" === serializedString[serializedString.length - 1] && (bufferLength--, "=" === serializedString[serializedString.length - 2] && bufferLength--);
                        var buffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(buffer);
                        for (i = 0; i < len; i += 4) encoded1 = BASE_CHARS.indexOf(serializedString[i]), 
                        encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]), encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]), 
                        encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]), bytes[p++] = encoded1 << 2 | encoded2 >> 4, 
                        bytes[p++] = (15 & encoded2) << 4 | encoded3 >> 2, bytes[p++] = (3 & encoded3) << 6 | 63 & encoded4;
                        return buffer;
                    }
                    function bufferToString(buffer) {
                        var i, bytes = new Uint8Array(buffer), base64String = "";
                        for (i = 0; i < bytes.length; i += 3) base64String += BASE_CHARS[bytes[i] >> 2], 
                        base64String += BASE_CHARS[(3 & bytes[i]) << 4 | bytes[i + 1] >> 4], base64String += BASE_CHARS[(15 & bytes[i + 1]) << 2 | bytes[i + 2] >> 6], 
                        base64String += BASE_CHARS[63 & bytes[i + 2]];
                        return bytes.length % 3 == 2 ? base64String = base64String.substring(0, base64String.length - 1) + "=" : bytes.length % 3 == 1 && (base64String = base64String.substring(0, base64String.length - 2) + "=="), 
                        base64String;
                    }
                    function serialize(value, callback) {
                        var valueType = "";
                        if (value && (valueType = toString$1.call(value)), value && ("[object ArrayBuffer]" === valueType || value.buffer && "[object ArrayBuffer]" === toString$1.call(value.buffer))) {
                            var buffer, marker = SERIALIZED_MARKER;
                            value instanceof ArrayBuffer ? (buffer = value, marker += TYPE_ARRAYBUFFER) : (buffer = value.buffer, 
                            "[object Int8Array]" === valueType ? marker += TYPE_INT8ARRAY : "[object Uint8Array]" === valueType ? marker += TYPE_UINT8ARRAY : "[object Uint8ClampedArray]" === valueType ? marker += TYPE_UINT8CLAMPEDARRAY : "[object Int16Array]" === valueType ? marker += TYPE_INT16ARRAY : "[object Uint16Array]" === valueType ? marker += TYPE_UINT16ARRAY : "[object Int32Array]" === valueType ? marker += TYPE_INT32ARRAY : "[object Uint32Array]" === valueType ? marker += TYPE_UINT32ARRAY : "[object Float32Array]" === valueType ? marker += TYPE_FLOAT32ARRAY : "[object Float64Array]" === valueType ? marker += TYPE_FLOAT64ARRAY : callback(new Error("Failed to get type for BinaryArray"))), 
                            callback(marker + bufferToString(buffer));
                        } else if ("[object Blob]" === valueType) {
                            var fileReader = new FileReader;
                            fileReader.onload = function() {
                                var str = BLOB_TYPE_PREFIX + value.type + "~" + bufferToString(this.result);
                                callback(SERIALIZED_MARKER + TYPE_BLOB + str);
                            }, fileReader.readAsArrayBuffer(value);
                        } else try {
                            callback(JSON.stringify(value));
                        } catch (e) {
                            console.error("Couldn't convert value into a JSON string: ", value), callback(null, e);
                        }
                    }
                    function deserialize(value) {
                        if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) return JSON.parse(value);
                        var blobType, serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH), type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);
                        if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
                            var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
                            blobType = matcher[1], serializedString = serializedString.substring(matcher[0].length);
                        }
                        var buffer = stringToBuffer(serializedString);
                        switch (type) {
                          case TYPE_ARRAYBUFFER:
                            return buffer;

                          case TYPE_BLOB:
                            return createBlob([ buffer ], {
                                type: blobType
                            });

                          case TYPE_INT8ARRAY:
                            return new Int8Array(buffer);

                          case TYPE_UINT8ARRAY:
                            return new Uint8Array(buffer);

                          case TYPE_UINT8CLAMPEDARRAY:
                            return new Uint8ClampedArray(buffer);

                          case TYPE_INT16ARRAY:
                            return new Int16Array(buffer);

                          case TYPE_UINT16ARRAY:
                            return new Uint16Array(buffer);

                          case TYPE_INT32ARRAY:
                            return new Int32Array(buffer);

                          case TYPE_UINT32ARRAY:
                            return new Uint32Array(buffer);

                          case TYPE_FLOAT32ARRAY:
                            return new Float32Array(buffer);

                          case TYPE_FLOAT64ARRAY:
                            return new Float64Array(buffer);

                          default:
                            throw new Error("Unkown type: " + type);
                        }
                    }
                    var localforageSerializer = {
                        serialize,
                        deserialize,
                        stringToBuffer,
                        bufferToString
                    };
                    function createDbTable(t, dbInfo, callback, errorCallback) {
                        t.executeSql("CREATE TABLE IF NOT EXISTS " + dbInfo.storeName + " (id INTEGER PRIMARY KEY, key unique, value)", [], callback, errorCallback);
                    }
                    function _initStorage$1(options) {
                        var self = this, dbInfo = {
                            db: null
                        };
                        if (options) for (var i in options) dbInfo[i] = "string" != typeof options[i] ? options[i].toString() : options[i];
                        var dbInfoPromise = new Promise$1(function(resolve, reject) {
                            try {
                                dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
                            } catch (e) {
                                return reject(e);
                            }
                            dbInfo.db.transaction(function(t) {
                                createDbTable(t, dbInfo, function() {
                                    self._dbInfo = dbInfo, resolve();
                                }, function(t, error) {
                                    reject(error);
                                });
                            }, reject);
                        });
                        return dbInfo.serializer = localforageSerializer, dbInfoPromise;
                    }
                    function tryExecuteSql(t, dbInfo, sqlStatement, args, callback, errorCallback) {
                        t.executeSql(sqlStatement, args, callback, function(t, error) {
                            error.code === error.SYNTAX_ERR ? t.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name = ?", [ dbInfo.storeName ], function(t, results) {
                                results.rows.length ? errorCallback(t, error) : createDbTable(t, dbInfo, function() {
                                    t.executeSql(sqlStatement, args, callback, errorCallback);
                                }, errorCallback);
                            }, errorCallback) : errorCallback(t, error);
                        }, errorCallback);
                    }
                    function getItem$1(key, callback) {
                        var self = this;
                        key = normalizeKey(key);
                        var promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                var dbInfo = self._dbInfo;
                                dbInfo.db.transaction(function(t) {
                                    tryExecuteSql(t, dbInfo, "SELECT * FROM " + dbInfo.storeName + " WHERE key = ? LIMIT 1", [ key ], function(t, results) {
                                        var result = results.rows.length ? results.rows.item(0).value : null;
                                        result && (result = dbInfo.serializer.deserialize(result)), resolve(result);
                                    }, function(t, error) {
                                        reject(error);
                                    });
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function iterate$1(iterator, callback) {
                        var self = this, promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                var dbInfo = self._dbInfo;
                                dbInfo.db.transaction(function(t) {
                                    tryExecuteSql(t, dbInfo, "SELECT * FROM " + dbInfo.storeName, [], function(t, results) {
                                        for (var rows = results.rows, length = rows.length, i = 0; i < length; i++) {
                                            var item = rows.item(i), result = item.value;
                                            if (result && (result = dbInfo.serializer.deserialize(result)), void 0 !== (result = iterator(result, item.key, i + 1))) return void resolve(result);
                                        }
                                        resolve();
                                    }, function(t, error) {
                                        reject(error);
                                    });
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function _setItem(key, value, callback, retriesLeft) {
                        var self = this;
                        key = normalizeKey(key);
                        var promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                void 0 === value && (value = null);
                                var originalValue = value, dbInfo = self._dbInfo;
                                dbInfo.serializer.serialize(value, function(value, error) {
                                    error ? reject(error) : dbInfo.db.transaction(function(t) {
                                        tryExecuteSql(t, dbInfo, "INSERT OR REPLACE INTO " + dbInfo.storeName + " (key, value) VALUES (?, ?)", [ key, value ], function() {
                                            resolve(originalValue);
                                        }, function(t, error) {
                                            reject(error);
                                        });
                                    }, function(sqlError) {
                                        if (sqlError.code === sqlError.QUOTA_ERR) {
                                            if (retriesLeft > 0) return void resolve(_setItem.apply(self, [ key, originalValue, callback, retriesLeft - 1 ]));
                                            reject(sqlError);
                                        }
                                    });
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function setItem$1(key, value, callback) {
                        return _setItem.apply(this, [ key, value, callback, 1 ]);
                    }
                    function removeItem$1(key, callback) {
                        var self = this;
                        key = normalizeKey(key);
                        var promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                var dbInfo = self._dbInfo;
                                dbInfo.db.transaction(function(t) {
                                    tryExecuteSql(t, dbInfo, "DELETE FROM " + dbInfo.storeName + " WHERE key = ?", [ key ], function() {
                                        resolve();
                                    }, function(t, error) {
                                        reject(error);
                                    });
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function clear$1(callback) {
                        var self = this, promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                var dbInfo = self._dbInfo;
                                dbInfo.db.transaction(function(t) {
                                    tryExecuteSql(t, dbInfo, "DELETE FROM " + dbInfo.storeName, [], function() {
                                        resolve();
                                    }, function(t, error) {
                                        reject(error);
                                    });
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function length$1(callback) {
                        var self = this, promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                var dbInfo = self._dbInfo;
                                dbInfo.db.transaction(function(t) {
                                    tryExecuteSql(t, dbInfo, "SELECT COUNT(key) as c FROM " + dbInfo.storeName, [], function(t, results) {
                                        var result = results.rows.item(0).c;
                                        resolve(result);
                                    }, function(t, error) {
                                        reject(error);
                                    });
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function key$1(n, callback) {
                        var self = this, promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                var dbInfo = self._dbInfo;
                                dbInfo.db.transaction(function(t) {
                                    tryExecuteSql(t, dbInfo, "SELECT key FROM " + dbInfo.storeName + " WHERE id = ? LIMIT 1", [ n + 1 ], function(t, results) {
                                        var result = results.rows.length ? results.rows.item(0).key : null;
                                        resolve(result);
                                    }, function(t, error) {
                                        reject(error);
                                    });
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function keys$1(callback) {
                        var self = this, promise = new Promise$1(function(resolve, reject) {
                            self.ready().then(function() {
                                var dbInfo = self._dbInfo;
                                dbInfo.db.transaction(function(t) {
                                    tryExecuteSql(t, dbInfo, "SELECT key FROM " + dbInfo.storeName, [], function(t, results) {
                                        for (var keys = [], i = 0; i < results.rows.length; i++) keys.push(results.rows.item(i).key);
                                        resolve(keys);
                                    }, function(t, error) {
                                        reject(error);
                                    });
                                });
                            }).catch(reject);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function getAllStoreNames(db) {
                        return new Promise$1(function(resolve, reject) {
                            db.transaction(function(t) {
                                t.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function(t, results) {
                                    for (var storeNames = [], i = 0; i < results.rows.length; i++) storeNames.push(results.rows.item(i).name);
                                    resolve({
                                        db,
                                        storeNames
                                    });
                                }, function(t, error) {
                                    reject(error);
                                });
                            }, function(sqlError) {
                                reject(sqlError);
                            });
                        });
                    }
                    function dropInstance$1(options, callback) {
                        callback = getCallback.apply(this, arguments);
                        var currentConfig = this.config();
                        (options = "function" != typeof options && options || {}).name || (options.name = options.name || currentConfig.name, 
                        options.storeName = options.storeName || currentConfig.storeName);
                        var promise, self = this;
                        return executeCallback(promise = options.name ? new Promise$1(function(resolve) {
                            var db;
                            db = options.name === currentConfig.name ? self._dbInfo.db : openDatabase(options.name, "", "", 0), 
                            options.storeName ? resolve({
                                db,
                                storeNames: [ options.storeName ]
                            }) : resolve(getAllStoreNames(db));
                        }).then(function(operationInfo) {
                            return new Promise$1(function(resolve, reject) {
                                operationInfo.db.transaction(function(t) {
                                    function dropTable(storeName) {
                                        return new Promise$1(function(resolve, reject) {
                                            t.executeSql("DROP TABLE IF EXISTS " + storeName, [], function() {
                                                resolve();
                                            }, function(t, error) {
                                                reject(error);
                                            });
                                        });
                                    }
                                    for (var operations = [], i = 0, len = operationInfo.storeNames.length; i < len; i++) operations.push(dropTable(operationInfo.storeNames[i]));
                                    Promise$1.all(operations).then(function() {
                                        resolve();
                                    }).catch(function(e) {
                                        reject(e);
                                    });
                                }, function(sqlError) {
                                    reject(sqlError);
                                });
                            });
                        }) : Promise$1.reject("Invalid arguments"), callback), promise;
                    }
                    var webSQLStorage = {
                        _driver: "webSQLStorage",
                        _initStorage: _initStorage$1,
                        _support: isWebSQLValid(),
                        iterate: iterate$1,
                        getItem: getItem$1,
                        setItem: setItem$1,
                        removeItem: removeItem$1,
                        clear: clear$1,
                        length: length$1,
                        key: key$1,
                        keys: keys$1,
                        dropInstance: dropInstance$1
                    };
                    function isLocalStorageValid() {
                        try {
                            return "undefined" != typeof localStorage && "setItem" in localStorage && !!localStorage.setItem;
                        } catch (e) {
                            return !1;
                        }
                    }
                    function _getKeyPrefix(options, defaultConfig) {
                        var keyPrefix = options.name + "/";
                        return options.storeName !== defaultConfig.storeName && (keyPrefix += options.storeName + "/"), 
                        keyPrefix;
                    }
                    function checkIfLocalStorageThrows() {
                        var localStorageTestKey = "_localforage_support_test";
                        try {
                            return localStorage.setItem(localStorageTestKey, !0), localStorage.removeItem(localStorageTestKey), 
                            !1;
                        } catch (e) {
                            return !0;
                        }
                    }
                    function _isLocalStorageUsable() {
                        return !checkIfLocalStorageThrows() || localStorage.length > 0;
                    }
                    function _initStorage$2(options) {
                        var self = this, dbInfo = {};
                        if (options) for (var i in options) dbInfo[i] = options[i];
                        return dbInfo.keyPrefix = _getKeyPrefix(options, self._defaultConfig), _isLocalStorageUsable() ? (self._dbInfo = dbInfo, 
                        dbInfo.serializer = localforageSerializer, Promise$1.resolve()) : Promise$1.reject();
                    }
                    function clear$2(callback) {
                        var self = this, promise = self.ready().then(function() {
                            for (var keyPrefix = self._dbInfo.keyPrefix, i = localStorage.length - 1; i >= 0; i--) {
                                var key = localStorage.key(i);
                                0 === key.indexOf(keyPrefix) && localStorage.removeItem(key);
                            }
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function getItem$2(key, callback) {
                        var self = this;
                        key = normalizeKey(key);
                        var promise = self.ready().then(function() {
                            var dbInfo = self._dbInfo, result = localStorage.getItem(dbInfo.keyPrefix + key);
                            return result && (result = dbInfo.serializer.deserialize(result)), result;
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function iterate$2(iterator, callback) {
                        var self = this, promise = self.ready().then(function() {
                            for (var dbInfo = self._dbInfo, keyPrefix = dbInfo.keyPrefix, keyPrefixLength = keyPrefix.length, length = localStorage.length, iterationNumber = 1, i = 0; i < length; i++) {
                                var key = localStorage.key(i);
                                if (0 === key.indexOf(keyPrefix)) {
                                    var value = localStorage.getItem(key);
                                    if (value && (value = dbInfo.serializer.deserialize(value)), void 0 !== (value = iterator(value, key.substring(keyPrefixLength), iterationNumber++))) return value;
                                }
                            }
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function key$2(n, callback) {
                        var self = this, promise = self.ready().then(function() {
                            var result, dbInfo = self._dbInfo;
                            try {
                                result = localStorage.key(n);
                            } catch (error) {
                                result = null;
                            }
                            return result && (result = result.substring(dbInfo.keyPrefix.length)), result;
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function keys$2(callback) {
                        var self = this, promise = self.ready().then(function() {
                            for (var dbInfo = self._dbInfo, length = localStorage.length, keys = [], i = 0; i < length; i++) {
                                var itemKey = localStorage.key(i);
                                0 === itemKey.indexOf(dbInfo.keyPrefix) && keys.push(itemKey.substring(dbInfo.keyPrefix.length));
                            }
                            return keys;
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function length$2(callback) {
                        var promise = this.keys().then(function(keys) {
                            return keys.length;
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function removeItem$2(key, callback) {
                        var self = this;
                        key = normalizeKey(key);
                        var promise = self.ready().then(function() {
                            var dbInfo = self._dbInfo;
                            localStorage.removeItem(dbInfo.keyPrefix + key);
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function setItem$2(key, value, callback) {
                        var self = this;
                        key = normalizeKey(key);
                        var promise = self.ready().then(function() {
                            void 0 === value && (value = null);
                            var originalValue = value;
                            return new Promise$1(function(resolve, reject) {
                                var dbInfo = self._dbInfo;
                                dbInfo.serializer.serialize(value, function(value, error) {
                                    if (error) reject(error); else try {
                                        localStorage.setItem(dbInfo.keyPrefix + key, value), resolve(originalValue);
                                    } catch (e) {
                                        "QuotaExceededError" !== e.name && "NS_ERROR_DOM_QUOTA_REACHED" !== e.name || reject(e), 
                                        reject(e);
                                    }
                                });
                            });
                        });
                        return executeCallback(promise, callback), promise;
                    }
                    function dropInstance$2(options, callback) {
                        if (callback = getCallback.apply(this, arguments), !(options = "function" != typeof options && options || {}).name) {
                            var currentConfig = this.config();
                            options.name = options.name || currentConfig.name, options.storeName = options.storeName || currentConfig.storeName;
                        }
                        var promise, self = this;
                        return promise = options.name ? new Promise$1(function(resolve) {
                            options.storeName ? resolve(_getKeyPrefix(options, self._defaultConfig)) : resolve(options.name + "/");
                        }).then(function(keyPrefix) {
                            for (var i = localStorage.length - 1; i >= 0; i--) {
                                var key = localStorage.key(i);
                                0 === key.indexOf(keyPrefix) && localStorage.removeItem(key);
                            }
                        }) : Promise$1.reject("Invalid arguments"), executeCallback(promise, callback), 
                        promise;
                    }
                    var localStorageWrapper = {
                        _driver: "localStorageWrapper",
                        _initStorage: _initStorage$2,
                        _support: isLocalStorageValid(),
                        iterate: iterate$2,
                        getItem: getItem$2,
                        setItem: setItem$2,
                        removeItem: removeItem$2,
                        clear: clear$2,
                        length: length$2,
                        key: key$2,
                        keys: keys$2,
                        dropInstance: dropInstance$2
                    }, sameValue = function sameValue(x, y) {
                        return x === y || "number" == typeof x && "number" == typeof y && isNaN(x) && isNaN(y);
                    }, includes = function includes(array, searchElement) {
                        for (var len = array.length, i = 0; i < len; ) {
                            if (sameValue(array[i], searchElement)) return !0;
                            i++;
                        }
                        return !1;
                    }, isArray = Array.isArray || function(arg) {
                        return "[object Array]" === Object.prototype.toString.call(arg);
                    }, DefinedDrivers = {}, DriverSupport = {}, DefaultDrivers = {
                        INDEXEDDB: asyncStorage,
                        WEBSQL: webSQLStorage,
                        LOCALSTORAGE: localStorageWrapper
                    }, DefaultDriverOrder = [ DefaultDrivers.INDEXEDDB._driver, DefaultDrivers.WEBSQL._driver, DefaultDrivers.LOCALSTORAGE._driver ], OptionalDriverMethods = [ "dropInstance" ], LibraryMethods = [ "clear", "getItem", "iterate", "key", "keys", "length", "removeItem", "setItem" ].concat(OptionalDriverMethods), DefaultConfig = {
                        description: "",
                        driver: DefaultDriverOrder.slice(),
                        name: "localforage",
                        size: 4980736,
                        storeName: "keyvaluepairs",
                        version: 1
                    };
                    function callWhenReady(localForageInstance, libraryMethod) {
                        localForageInstance[libraryMethod] = function() {
                            var _args = arguments;
                            return localForageInstance.ready().then(function() {
                                return localForageInstance[libraryMethod].apply(localForageInstance, _args);
                            });
                        };
                    }
                    function extend() {
                        for (var i = 1; i < arguments.length; i++) {
                            var arg = arguments[i];
                            if (arg) for (var _key in arg) arg.hasOwnProperty(_key) && (isArray(arg[_key]) ? arguments[0][_key] = arg[_key].slice() : arguments[0][_key] = arg[_key]);
                        }
                        return arguments[0];
                    }
                    var LocalForage = function() {
                        function LocalForage(options) {
                            for (var driverTypeKey in _classCallCheck(this, LocalForage), DefaultDrivers) if (DefaultDrivers.hasOwnProperty(driverTypeKey)) {
                                var driver = DefaultDrivers[driverTypeKey], driverName = driver._driver;
                                this[driverTypeKey] = driverName, DefinedDrivers[driverName] || this.defineDriver(driver);
                            }
                            this._defaultConfig = extend({}, DefaultConfig), this._config = extend({}, this._defaultConfig, options), 
                            this._driverSet = null, this._initDriver = null, this._ready = !1, this._dbInfo = null, 
                            this._wrapLibraryMethodsWithReady(), this.setDriver(this._config.driver).catch(function() {});
                        }
                        return LocalForage.prototype.config = function config(options) {
                            if ("object" === (void 0 === options ? "undefined" : _typeof(options))) {
                                if (this._ready) return new Error("Can't call config() after localforage has been used.");
                                for (var i in options) {
                                    if ("storeName" === i && (options[i] = options[i].replace(/\W/g, "_")), "version" === i && "number" != typeof options[i]) return new Error("Database version must be a number.");
                                    this._config[i] = options[i];
                                }
                                return !("driver" in options) || !options.driver || this.setDriver(this._config.driver);
                            }
                            return "string" == typeof options ? this._config[options] : this._config;
                        }, LocalForage.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
                            var promise = new Promise$1(function(resolve, reject) {
                                try {
                                    var driverName = driverObject._driver, complianceError = new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver");
                                    if (!driverObject._driver) return void reject(complianceError);
                                    for (var driverMethods = LibraryMethods.concat("_initStorage"), i = 0, len = driverMethods.length; i < len; i++) {
                                        var driverMethodName = driverMethods[i];
                                        if ((!includes(OptionalDriverMethods, driverMethodName) || driverObject[driverMethodName]) && "function" != typeof driverObject[driverMethodName]) return void reject(complianceError);
                                    }
                                    var configureMissingMethods = function configureMissingMethods() {
                                        for (var methodNotImplementedFactory = function methodNotImplementedFactory(methodName) {
                                            return function() {
                                                var error = new Error("Method " + methodName + " is not implemented by the current driver"), promise = Promise$1.reject(error);
                                                return executeCallback(promise, arguments[arguments.length - 1]), promise;
                                            };
                                        }, _i = 0, _len = OptionalDriverMethods.length; _i < _len; _i++) {
                                            var optionalDriverMethod = OptionalDriverMethods[_i];
                                            driverObject[optionalDriverMethod] || (driverObject[optionalDriverMethod] = methodNotImplementedFactory(optionalDriverMethod));
                                        }
                                    };
                                    configureMissingMethods();
                                    var setDriverSupport = function setDriverSupport(support) {
                                        DefinedDrivers[driverName], DefinedDrivers[driverName] = driverObject, DriverSupport[driverName] = support, 
                                        resolve();
                                    };
                                    "_support" in driverObject ? driverObject._support && "function" == typeof driverObject._support ? driverObject._support().then(setDriverSupport, reject) : setDriverSupport(!!driverObject._support) : setDriverSupport(!0);
                                } catch (e) {
                                    reject(e);
                                }
                            });
                            return executeTwoCallbacks(promise, callback, errorCallback), promise;
                        }, LocalForage.prototype.driver = function driver() {
                            return this._driver || null;
                        }, LocalForage.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
                            var getDriverPromise = DefinedDrivers[driverName] ? Promise$1.resolve(DefinedDrivers[driverName]) : Promise$1.reject(new Error("Driver not found."));
                            return executeTwoCallbacks(getDriverPromise, callback, errorCallback), getDriverPromise;
                        }, LocalForage.prototype.getSerializer = function getSerializer(callback) {
                            var serializerPromise = Promise$1.resolve(localforageSerializer);
                            return executeTwoCallbacks(serializerPromise, callback), serializerPromise;
                        }, LocalForage.prototype.ready = function ready(callback) {
                            var self = this, promise = self._driverSet.then(function() {
                                return null === self._ready && (self._ready = self._initDriver()), self._ready;
                            });
                            return executeTwoCallbacks(promise, callback, callback), promise;
                        }, LocalForage.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
                            var self = this;
                            isArray(drivers) || (drivers = [ drivers ]);
                            var supportedDrivers = this._getSupportedDrivers(drivers);
                            function setDriverToConfig() {
                                self._config.driver = self.driver();
                            }
                            function extendSelfWithDriver(driver) {
                                return self._extend(driver), setDriverToConfig(), self._ready = self._initStorage(self._config), 
                                self._ready;
                            }
                            function initDriver(supportedDrivers) {
                                return function() {
                                    var currentDriverIndex = 0;
                                    function driverPromiseLoop() {
                                        for (;currentDriverIndex < supportedDrivers.length; ) {
                                            var driverName = supportedDrivers[currentDriverIndex];
                                            return currentDriverIndex++, self._dbInfo = null, self._ready = null, self.getDriver(driverName).then(extendSelfWithDriver).catch(driverPromiseLoop);
                                        }
                                        setDriverToConfig();
                                        var error = new Error("No available storage method found.");
                                        return self._driverSet = Promise$1.reject(error), self._driverSet;
                                    }
                                    return driverPromiseLoop();
                                };
                            }
                            var oldDriverSetDone = null !== this._driverSet ? this._driverSet.catch(function() {
                                return Promise$1.resolve();
                            }) : Promise$1.resolve();
                            return this._driverSet = oldDriverSetDone.then(function() {
                                var driverName = supportedDrivers[0];
                                return self._dbInfo = null, self._ready = null, self.getDriver(driverName).then(function(driver) {
                                    self._driver = driver._driver, setDriverToConfig(), self._wrapLibraryMethodsWithReady(), 
                                    self._initDriver = initDriver(supportedDrivers);
                                });
                            }).catch(function() {
                                setDriverToConfig();
                                var error = new Error("No available storage method found.");
                                return self._driverSet = Promise$1.reject(error), self._driverSet;
                            }), executeTwoCallbacks(this._driverSet, callback, errorCallback), this._driverSet;
                        }, LocalForage.prototype.supports = function supports(driverName) {
                            return !!DriverSupport[driverName];
                        }, LocalForage.prototype._extend = function _extend(libraryMethodsAndProperties) {
                            extend(this, libraryMethodsAndProperties);
                        }, LocalForage.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
                            for (var supportedDrivers = [], i = 0, len = drivers.length; i < len; i++) {
                                var driverName = drivers[i];
                                this.supports(driverName) && supportedDrivers.push(driverName);
                            }
                            return supportedDrivers;
                        }, LocalForage.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
                            for (var i = 0, len = LibraryMethods.length; i < len; i++) callWhenReady(this, LibraryMethods[i]);
                        }, LocalForage.prototype.createInstance = function createInstance(options) {
                            return new LocalForage(options);
                        }, LocalForage;
                    }(), localforage_js = new LocalForage;
                    module.exports = localforage_js;
                }, {
                    3: 3
                } ]
            }, {}, [ 4 ])(4);
        },
        344(module, __webpack_exports__, __webpack_require__) {
            "use strict";
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
            "use strict";
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
    }, __webpack_require__.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
            return this || new Function("return this")();
        } catch (e) {
            if ("object" == typeof window) return window;
        }
    }(), __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop), 
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
    __webpack_require__.nc = void 0, (() => {
        "use strict";
        const notification = (notificationText, presistend = !1) => {
            $(".umm-notification").remove(), notificationText = notificationText.replace(/\n/g, "<br/>");
            const notification = $("<div>", {
                class: "umm-notification",
                html: notificationText
            });
            $("body").append(notification), presistend || window.setTimeout(() => {
                $(".umm-notification").fadeOut(400, () => notification.remove());
            }, 3e3);
        }, createFilename = (state, addition) => state.getBannerName().replace(/[\W_]+/g, " ") + addition, loadFile = async (state, inputFile) => {
            const text = await inputFile.text();
            try {
                await state.import(text);
            } catch (error) {
                return notification(`Loadgin error: \n${error}`), !1;
            }
            return await state.save(), notification(`Banner data loaded:\n${state.getBannerName()}`), 
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
            overlappingPath(other) {
                let maxlen = 0;
                for (let p = 0; p < this.data.length; p++) {
                    const portal = this.data[p], inOther = other.data.findIndex(op => op.guid === portal.guid);
                    if (-1 !== inOther) {
                        let len = 1;
                        for (;inOther + len < other.data.length && p + len < this.data.length && this.data[p + len].guid === other.data[inOther + len].guid; ) len++;
                        for (maxlen = Math.max(maxlen, len), len = 1; inOther - len >= 0 && p - len >= 0 && this.data[p - len].guid === other.data[inOther - len].guid; ) len++;
                        maxlen = Math.max(maxlen, len);
                    }
                }
                return maxlen;
            }
        }
        class Bimage {
            canvas;
            constructor(canvas) {
                if (this.canvas = canvas, !canvas.getContext("2d")) throw new Error("Unable to get 2D rendering context");
            }
            static empty() {
                const canvas = Bimage.createDummyCanvas();
                return new Bimage(canvas);
            }
            static createDummyCanvas() {
                const canvas = document.createElement("canvas");
                canvas.width = 100, canvas.height = 100;
                const context = canvas.getContext("2d");
                if (!context) throw new Error("Unable to get 2D rendering context for placeholder canvas");
                context.fillStyle = "#efefef", context.fillRect(0, 0, canvas.width, canvas.height);
                context.fillStyle = "#e0e0e0";
                for (let y = 0; y < canvas.height; y += 16) for (let x = y / 16 % 2 ? 0 : 16; x < canvas.width; x += 32) context.fillRect(x, y, 16, 16);
                return context.strokeStyle = "#c0c0c0", context.lineWidth = 2, context.beginPath(), 
                context.moveTo(0, 0), context.lineTo(canvas.width, canvas.height), context.moveTo(canvas.width, 0), 
                context.lineTo(0, canvas.height), context.stroke(), context.fillStyle = "#666", 
                context.font = "16px sans-serif", context.textAlign = "center", context.textBaseline = "middle", 
                context.fillText("No image", canvas.width / 2, canvas.height / 2), canvas;
            }
            static async fromString(dataString) {
                const image = await this.loadImage(dataString);
                return this.fromImageElement(image);
            }
            static async fromFile(file) {
                const bitmap = await createImageBitmap(file);
                return this.fromImageBitmap(bitmap);
            }
            static async loadImage(source) {
                return new Promise((resolve, reject) => {
                    const image = new Image;
                    image.onload = () => resolve(image), image.onerror = () => reject(new Error("Failed to load image from string")), 
                    image.src = source;
                });
            }
            static fromImageElement(image) {
                const canvas = document.createElement("canvas");
                canvas.width = image.naturalWidth || image.width, canvas.height = image.naturalHeight || image.height;
                const context = canvas.getContext("2d");
                if (!context) throw new Error("Unable to get 2D rendering context");
                return context.drawImage(image, 0, 0), new Bimage(canvas);
            }
            static fromImageBitmap(bitmap) {
                const canvas = document.createElement("canvas");
                canvas.width = bitmap.width, canvas.height = bitmap.height;
                const context = canvas.getContext("2d");
                if (!context) throw new Error("Unable to get 2D rendering context");
                return context.drawImage(bitmap, 0, 0), bitmap.close(), new Bimage(canvas);
            }
            get width() {
                return this.canvas.width;
            }
            get height() {
                return this.canvas.height;
            }
            toString(type = "image/png", quality) {
                return this.canvas.toDataURL(type, quality);
            }
            async toBlob(type = "image/png", quality) {
                return new Promise((resolve, reject) => {
                    this.canvas.toBlob(blob => {
                        blob ? resolve(blob) : reject(new Error("Failed to convert canvas to Blob"));
                    }, type, quality);
                });
            }
            async toFile(filename = "image.png", type = "image/png", quality) {
                const blob = await this.toBlob(type, quality);
                return new File([ blob ], filename, {
                    type
                });
            }
            crop(x, y, width, height) {
                let needbackground = !1, sx = x, sy = y, sw = width, sh = height, dx = 0, dy = 0, dw = width, dh = height;
                sx < 0 && (dx = -sx, sx = 0, needbackground = !0), sy < 0 && (dy = -sy, sy = 0, 
                needbackground = !0), sx + sw > this.width && (sw = this.width - sx, dw = sw, needbackground = !0), 
                sy + sh > this.height && (sh = this.height - sy, dh = sh, needbackground = !0);
                const canvas = document.createElement("canvas");
                canvas.width = width, canvas.height = height;
                const context = canvas.getContext("2d");
                if (!context) throw new Error("Unable to get 2D rendering context for crop");
                if (needbackground) {
                    context.save(), context.filter = "blur(20px)";
                    const bx = Math.max(0, Math.min(x, this.width - width)), by = Math.max(0, Math.min(y, this.height - height));
                    context.drawImage(this.canvas, bx, by, width, height, 0, 0, width, height), context.restore();
                }
                return context.drawImage(this.canvas, sx, sy, sw, sh, dx, dy, dw, dh), new Bimage(canvas);
            }
            render(element) {
                if (element instanceof HTMLImageElement) return element.src = this.toString(), element.width = this.width, 
                void (element.height = this.height);
                if (element instanceof HTMLCanvasElement) {
                    element.width = this.width, element.height = this.height;
                    const context = element.getContext("2d");
                    if (!context) throw new Error("Unable to get 2D rendering context for target canvas");
                    return void context.clearRect(0, 0, this.width, this.height);
                }
                throw new Error("Unsupported render target: expected HTMLImageElement or HTMLCanvasElement");
            }
        }
        class Mission {
            missionID;
            data;
            portal_data;
            state;
            constructor(state, id, data) {
                this.missionID = id, this.data = data, this.state = state, this.portal_data = new Portals(state, data.portals);
            }
            isEmpty() {
                return "" === this.title || "" === this.description || 0 === this.portals.length;
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
            hasImage() {
                return this.data.image >= 0 && void 0 !== this.state.getImage(this.data.image);
            }
            getImage() {
                const origin = this.state.getImage(this.data.image);
                if (!origin) return Bimage.empty();
                const r = this.data.rect;
                return r ? origin.crop(r.x, r.y, r.width, r.height) : origin;
            }
            setImage(id, rect) {
                this.data.image = id, this.data.rect = rect;
            }
            getImageFilename() {
                const num = window.zeroPad(this.id + 1, String(this.state.getPlannedLength()).length);
                return createFilename(this.state, `_${num}.png`);
            }
            get imageRect() {
                return this.data.rect;
            }
            set imageRect(rect) {
                this.data.rect = Object.assign({}, rect);
            }
            get imageID() {
                return this.data.image;
            }
            get category() {
                return this.state.category;
            }
            hasPortals() {
                return this.portal_data.length > 0;
            }
            getLocations() {
                return this.portal_data.toLatLng();
            }
            getSequential() {
                return this.state.getSequential();
            }
            show(forceZoom = !1) {
                if (this.hasPortals()) {
                    const bounds = new L.LatLngBounds(this.getLocations()).pad(.2);
                    if (bounds.isValid()) {
                        const minBounds = bounds.pad(-.3);
                        !forceZoom && window.map.getBounds().intersects(minBounds) || window.map.fitBounds(bounds, {
                            maxZoom: 18
                        });
                    }
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
            getAll() {
                return this.data.map((missionData, index) => new Mission(this.state, index, missionData));
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
            map(callback) {
                return this.data.map((missionData, index) => {
                    const mission = new Mission(this.state, index, missionData);
                    return callback(mission);
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
                    if (bounds.isValid()) {
                        const minBounds = bounds.pad(-.2);
                        window.map.getBounds().intersects(minBounds) || window.map.fitBounds(bounds, {
                            maxZoom: 18
                        });
                    }
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
        const undefinedOrEmptyString = value => null == value || "" == value, migrateUmmVersion = ummState => {
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
            ummState.fileFormatVersion = 3), ummState.sequential ??= !0, ummState.hiddenLocation ??= !1, 
            ummState;
        };
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
        var localforage = __webpack_require__(790), localforage_default = __webpack_require__.n(localforage);
        class State {
            theState;
            images=[];
            images_changed=!1;
            onSelectedMissionChange=new Trigger;
            onMissionChange=new Trigger;
            onMissionPortal=new Trigger;
            constructor() {
                localforage_default().config({
                    name: "UUM",
                    version: 1
                }), this.load();
            }
            async load() {
                this.reset();
                const data = localStorage.getItem("ultimate-mission-maker");
                if (!data) return;
                const anyState = JSON.parse(data);
                this.theState = migrateUmmVersion(anyState), this.setPlannedLength(this.getPlannedLength() || 1), 
                await this.loadImages(), this.triggerUpdate();
            }
            async loadImages() {
                this.images = [];
                let imageData, index = 0;
                for (;imageData = await localforage_default().getItem("image" + index++); ) {
                    const image = await Bimage.fromString(imageData);
                    this.images.push(image);
                }
                this.images_changed = !1;
            }
            async save() {
                this.setPlannedLength(this.theState.plannedBannerLength), localStorage.setItem("ultimate-mission-maker", JSON.stringify(this.theState)), 
                await this.saveImages();
            }
            async saveImages() {
                if (!this.images_changed) return;
                (await localforage_default().keys()).filter(k => k.match(/^image\d+$/)).forEach(i => localforage_default().removeItem(i));
                for (const index in this.images) {
                    const data = this.images[index].toString();
                    await localforage_default().setItem(`image${index}`, data);
                }
                this.images_changed = !1;
            }
            async import(jsonString) {
                const anyState = JSON.parse(jsonString);
                this.theState = migrateUmmVersion(anyState), this.setPlannedLength(this.getPlannedLength() || 1), 
                await this.importImages(anyState.images), this.triggerUpdate();
            }
            async importImages(imageData) {
                if (this.images = [], this.images_changed = !0, !imageData || 0 === imageData.length) return;
                const unresolvedPromises = imageData.map(async imgData => Bimage.fromString(imgData));
                this.images = await Promise.all(unresolvedPromises);
            }
            export() {
                const exportState = Object.assign({}, this.theState);
                return exportState.images = this.images.map(img => img.toString()), JSON.stringify(exportState);
            }
            triggerUpdate() {
                this.onMissionChange.trigger(), this.onMissionPortal.trigger(), this.onSelectedMissionChange.trigger();
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
                        portals: [],
                        image: -1
                    } ],
                    sequential: !0,
                    hiddenLocation: !1,
                    layers: [],
                    category: void 0
                }, this.images = [], this.images_changed = !0, this.onMissionChange.trigger();
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
                    portals: [],
                    image: -1
                });
                this.removeUnusedImages(), this.onMissionChange.trigger();
            }
            setSequential(sequential, hiddenLocation) {
                this.theState.sequential = sequential, this.theState.hiddenLocation = hiddenLocation;
            }
            getSequential() {
                return {
                    sequential: this.theState.sequential,
                    hiddenLocation: this.theState.hiddenLocation
                };
            }
            set category(name) {
                name === this.theState.category && (name = void 0), this.theState.category = name;
            }
            get category() {
                return this.theState.category ? this.theState.category : this.getBannerName();
            }
            isCustomCategory() {
                return void 0 !== this.theState.category;
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
            async storeLayerState(layers) {
                this.theState.layers = layers.map(l => l.isVisible()), await this.save();
            }
            restoreLayerState(layers) {
                this.theState.layers.forEach((vis, index) => layers[index].toggle(vis ?? !0));
            }
            getImage(id) {
                return this.images[id];
            }
            clearImages() {
                this.images = [], this.images_changed = !0;
            }
            addImage(image) {
                const asStr = image.toString(), index = this.images.findIndex(i => i.toString() === asStr);
                if (-1 !== index) return index;
                const newIndex = this.images.push(image) - 1;
                return this.images_changed = !0, newIndex;
            }
            removeUnusedImages() {
                const usedImages = new Set(this.missions.map(m => m.imageID));
                for (let i = this.images.length - 1; i >= 0; i--) usedImages.has(i) || (this.images.splice(i, 1), 
                this.images_changed = !0, this.missions.forEach(m => {
                    m.imageID >= i && m.setImage(m.imageID - 1, m.imageRect);
                }));
                return this.images_changed;
            }
        }
        const updateProgress = (message = "Please wait…") => {
            if (0 === $("#userscript-progress-overlay").length) throw new Error("progress termiated");
            $(".progress-message").text(message);
        }, hideProgress = () => {
            anim_context = void 0, $("#userscript-progress-overlay").remove();
        };
        let startTime, anim_context, points = [];
        const startAnim = () => {
            const canvas = document.getElementById("progress-anim");
            anim_context = canvas?.getContext("2d"), startTime = void 0, points = [], createPoint(), 
            createPoint(), requestAnimationFrame(animate);
        }, createPoint = () => {
            let point, distance;
            do {
                point = {
                    x: 5 + 240 * Math.random(),
                    y: 5 + 240 * Math.random(),
                    vx: .05 * (2 * Math.random() - 1),
                    vy: .05 * (2 * Math.random() - 1)
                }, distance = points.reduce((md, v) => {
                    const a = point.x - v.x, b = point.y - v.y, d = a * a + b * b;
                    return Math.min(md, d);
                }, 4e4);
            } while (distance < 1e3 * Math.random());
            points.push(point);
        }, drawCircle = p => {
            anim_context.beginPath(), anim_context.arc(p.x, p.y, 5, 0, 2 * Math.PI, !1), anim_context.fillStyle = "#97badc", 
            anim_context.fill();
        }, drawLine = (p1, p2) => {
            anim_context.save(), anim_context.beginPath(), anim_context.shadowColor = "red", 
            anim_context.shadowBlur = 25, anim_context.moveTo(p1.x, p1.y), anim_context.lineTo(p2.x, p2.y), 
            anim_context.lineWidth = 5, anim_context.strokeStyle = "rgba(200, 20, 20, 0.1)", 
            anim_context.stroke(), anim_context.restore(), anim_context.beginPath(), anim_context.moveTo(p1.x, p1.y), 
            anim_context.lineTo(p2.x, p2.y), anim_context.strokeStyle = "#8ab2d8", anim_context.stroke();
        }, movement = () => {
            points.forEach(p => {
                (p.x + p.vx - 5 < 0 || p.x + p.vx + 5 > 250) && (p.vx = -p.vx), (p.y + p.vy - 5 < 0 || p.y + p.vy + 5 > 250) && (p.vy = -p.vy), 
                p.x += p.vx, p.y += p.vy;
            });
        }, animate = time => {
            anim_context && (anim_context.clearRect(0, 0, 250, 250), (timestamp => {
                startTime ??= timestamp;
                let elapsed = 5e-4 * (timestamp - startTime);
                if (elapsed > 11) return points = [], startTime = timestamp, createPoint(), void createPoint();
                elapsed > 10 && (elapsed = 10), elapsed >= points.length - 1 && createPoint(), movement();
                const rest = Math.min(elapsed - Math.floor(elapsed), 1);
                for (let i = 0; i < points.length - 2; i++) drawLine(points[i], points[i + 1]);
                const source = points.at(-2), destination = points.at(-1), t = rest * rest * (3 - 2 * rest), x = source.x + (destination.x - source.x) * t, y = source.y + (destination.y - source.y) * t;
                drawLine(source, {
                    x,
                    y,
                    vx: 0,
                    vy: 0
                });
                for (let i = 0; i < points.length - 1; i++) drawCircle(points[i]);
            })(time), requestAnimationFrame(animate));
        };
        let oldFormat = !1;
        const loadCategoryContent = () => {
            oldFormat = !0;
            let data = localStorage.getItem("allCategories");
            if (!data) {
                oldFormat = !1;
                const key = `allCategories_${$(".navbar-login a").first().text().trim()}`;
                data = localStorage.getItem(key);
            }
            return data ? JSON.parse(data) : [];
        }, storeCategoryContent = categories => {
            if (oldFormat) localStorage.setItem("allCategories", JSON.stringify(categories)); else {
                const key = `allCategories_${$(".navbar-login a").first().text().trim()}`;
                localStorage.setItem(key, JSON.stringify(categories));
            }
        }, waitForControl = (parent, selector, timeoutMs = 1e5) => {
            const existing = document.querySelector(selector);
            return existing ? Promise.resolve(existing) : new Promise((resolve, reject) => {
                const observer = new MutationObserver(() => {
                    const element = document.querySelector(selector);
                    element && (observer.disconnect(), clearTimeout(timeout), resolve(element));
                });
                observer.observe(parent ?? document.body, {
                    childList: !0,
                    subtree: !0
                });
                const timeout = setTimeout(() => {
                    observer.disconnect(), reject(new Error(`Timed out waiting for ${selector}`));
                }, timeoutMs);
            });
        }, findCategory = (store, name) => store.findIndex(c => c.name === name), createCategory = (store, categoryName) => {
            const newCategory = {
                id: store.length,
                name: categoryName,
                missions: [],
                collapse: !1,
                sortCriteria: "initial"
            };
            return store.push(newCategory), storeCategoryContent(store), newCategory.id;
        };
        let angularApp;
        const getAngularApp = () => {
            if (!angularApp) {
                const container = document.body;
                angularApp = angular.element(container);
            }
            return angularApp;
        }, getEditorScope = () => {
            return element = $("div.editor"), element ??= document.body, angular.element(element).scope();
            var element;
        }, doImport = async mission => {
            try {
                ((message = "Please wait…") => {
                    if ($("#userscript-progress-overlay").length > 0) throw new Error("progress already visible");
                    const overlay = $("<div>", {
                        id: "userscript-progress-overlay"
                    }).append($("<div>", {
                        class: "progress-dialog"
                    }).append('<canvas id="progress-anim" width="250" height="250"></canvas>', $("<div>", {
                        class: "progress-message"
                    }), $("<button>", {
                        id: "progress-cancel",
                        text: "cancel",
                        click: () => hideProgress()
                    })));
                    $("body").append(overlay), startAnim(), $(".progress-message").text(message);
                })("Create mission"), void 0 === getEditorScope() && await createNewMission();
                const editor = getEditorScope();
                if (!checkEditorState(editor)) return;
                editor.$apply(() => {
                    const {sequential, hiddenLocation} = mission.getSequential();
                    editor.mission.definition._sequential = sequential, editor.mission.definition._hidden = editor.mission.definition._sequential && hiddenLocation, 
                    editor.mission.definition.name = mission.title, editor.mission.definition.description = mission.description;
                }), updateProgress("set portals");
                const missingImages = importMissionPorals(editor, mission);
                if (mission.hasImage()) {
                    if (void 0 === editor.mission.mission_guid && (updateProgress("get mission id"), 
                    await editor.save(), void 0 === editor.mission.mission_guid)) throw new Error("still no id");
                    updateProgress("upload image"), await uploadLogo(mission);
                }
                const nextPage = mission.hasImage() ? editor.EditorScreenViews.PREVIEW : editor.EditorScreenViews.NAME;
                if (updateProgress("save"), await editor.save(nextPage), editor.savingFailed) throw new Error("Mission save failed");
                if (missingImages > 0) {
                    updateProgress("Refreshing"), notification("Refreshing mission...\n(Missing data detected)", !0);
                    const scope = getEditorScope();
                    await loadMission(scope.mission.mission_id);
                }
                if ((() => {
                    if (localStorage.getItem("allCategories")) return !0;
                    const key = `allCategories_${$(".navbar-login a").first().text().trim()}`;
                    return void 0 !== localStorage.getItem(key);
                })()) {
                    updateProgress("create category"), editor.setView(editor.EditorScreenViews.PREVIEW);
                    const category = mission.category;
                    if (category && "" !== category) {
                        const catID = (name => {
                            const store = loadCategoryContent(), cat = findCategory(store, name);
                            if (-1 !== cat) return cat;
                            const index = createCategory(store, name);
                            return storeCategoryContent(store), index;
                        })(category);
                        -1 !== catID && (category => {
                            const editor = getEditorScope(), id = editor.mission.mission_guid, store = loadCategoryContent();
                            store.forEach((cat, index) => {
                                index !== category && -1 !== cat.missions.indexOf(id) && cat.missions.splice(index, 1);
                            }), store[category].missions.includes(id) || store[category].missions.push(id), 
                            storeCategoryContent(store), waitForControl($(".preview-buttons").get(0), ".category-dropdown").then(element => {
                                editor.selectedCategoryID = category, $(element).val(category), store[category].missions.pop(), 
                                storeCategoryContent(store);
                            });
                        })(catID);
                    }
                }
            } finally {
                hideProgress();
            }
        }, importMissionPorals = (editorScope, mission) => {
            resetWaypoints(editorScope);
            let missingImagesCount = 0;
            const originalSetSelectedWaypoint = editorScope.setSelectedWaypoint;
            try {
                editorScope.setSelectedWaypoint = () => 0;
                for (const portal of mission.portals.getRange()) {
                    const {mePortal, hasError} = createPortal(portal);
                    hasError && missingImagesCount++, editorScope.addWaypoint(mePortal);
                }
            } finally {
                editorScope.setSelectedWaypoint = originalSetSelectedWaypoint;
            }
            return editorScope.mission.definition.waypoints.forEach((aportal, index) => {
                const portal = mission.portals.get(index);
                aportal.objective.type = portal.objective.type, aportal.objective.passphrase_params.question = portal.objective.passphrase_params.question, 
                aportal.objective.passphrase_params._single_passphrase = portal.objective.passphrase_params._single_passphrase;
            }), editorScope.$apply(), missingImagesCount;
        }, checkEditorState = editorScope => $(".loading").hasClass("ng-hide") ? editorScope.mission ? !(editorScope.mission.definition.waypoints.length > 0 && !confirm("Your current mission already contains portals/waypoints. Are you sure you want to overwrite these?")) : (notification("You can not import a mission on this page\nStart with Create New Mission"), 
        !1) : (notification("Please wait for the spinner in the top right to finish loading before importing a (new) mission"), 
        !1), resetWaypoints = scope => {
            scope.mission.definition.waypoints = [], scope.waypointMarkers = [], scope.$apply();
        }, createPortal = portal => {
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
        }, loadMission = async missionId => {
            const angularApp = getAngularApp(), $http = angularApp.injector().get("$http"), Api = angularApp.injector().get("Api"), $timeout = angularApp.injector().get("$timeout"), wireUtility = angularApp.injector().get("WireUtil"), Styles = angularApp.injector().get("Styles");
            try {
                const response = await $http.post(Api.GET_MISSION, {
                    mission_id: missionId
                }), data = wireUtility.convertMissionWireToLocal(response.data.mission, response.data.pois), editScope = getEditorScope();
                editScope.mission = data, await new Promise(resolve => {
                    $timeout(resolve, 0);
                });
                const pois = editScope.mission.definition.waypoints.filter(p => p._poi?.location);
                editScope.waypointMarkers = pois.map((portal, index) => {
                    const label = (index + 1).toString();
                    return {
                        id: Math.floor(1e10 * Math.random()),
                        location: portal._poi.location,
                        icon: editScope.isWaypointSelected(portal) ? Styles.SELECTED_WAYPOINT_ICON : Styles.WAYPOINT_ICON,
                        onClicked: () => editScope.setSelectedWaypoint(portal, !0),
                        options: {
                            labelAnchor: Styles.WAYPOINT_LABEL_ANCHOR,
                            labelClass: "waypoint-label",
                            labelContent: label,
                            zIndex: Styles.WAYPOINT_MARKER_Z_INDEX
                        },
                        latitude: portal._poi.location.latitude,
                        longitude: portal._poi.location.longitude
                    };
                });
            } catch (error) {
                console.error("Failed to refresh mission", error), window.alert("Failed to refresh mission, refreshing full page to fix this."), 
                window.location.href = window.location.href;
            }
        }, createNewMission = async () => {
            const angularApp = getAngularApp(), $location = angularApp.injector().get("$location"), appScope = angularApp.scope();
            return new Promise(resolve => {
                const unwatch = appScope.$on("$routeChangeSuccess", () => {
                    unwatch(), resolve();
                });
                appScope.$evalAsync(() => {
                    $location.path("/edit");
                });
            });
        }, uploadLogo = async mission => {
            const image = mission.getImage(), file = await image.toFile("banner.png", "image/png"), editorScope = getEditorScope(), $upload = getAngularApp().injector().get("$upload"), resultData = (await $upload.upload({
                url: "/logo_upload/",
                file,
                data: {
                    missionGuid: editorScope.mission.mission_guid
                }
            })).data;
            await new Promise(resolve => {
                editorScope.$evalAsync(() => {
                    editorScope.mission.definition.logo_url = resultData.logo_url, editorScope.mission.definition.badge_url = resultData.badge_url, 
                    resolve();
                });
            });
        };
        const main = new class UMM_Editor {
            state;
            init() {
                __webpack_require__(344), null === document.querySelector(".landing-page") && ($(".navbar-header").append($("<div>", {
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
                    type: "file",
                    accept: "application/JSON"
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
                this.generateMissionSelect());
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
                const mission = main.state.getEditMission();
                mission && !mission.isEmpty() ? doImport(mission) : notification("Mission has no text or portals");
            }
        };
        window.UMM = main, main.init();
    })();
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
