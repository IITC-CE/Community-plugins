// ==UserScript==
// @author          McBen
// @name            PlusCodes
// @id              pluscode@McBen
// @category        Info
// @version         1.0.1
// @namespace       https://github.com/IITC-CE/ingress-intel-total-conversion
// @updateURL       https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/McBen/pluscode.meta.js
// @downloadURL     https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/McBen/pluscode.user.js
// @description     support PlusCodes in Search
// @icon64          data:image/png;base64,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
// @homepageURL     https://github.com/IITCPlugins/pluscode
// @issueTracker    https://github.com/IITCPlugins/pluscode/issues
// @match           https://intel.ingress.com/*
// ==/UserScript==


/**
 * v1.0
 * 
 * * first release
 * 
 * 
 */
function wrapper(SCRIPT_INFO) {
(() => {
    "use strict";
    __webpack_require__.cjs = body => {
        const mod = {
            exports: {}
        };
        return body.call(mod.exports, mod, mod.exports), mod.exports;
    };
    var open_location_code_namespaceObject = __webpack_require__.cjs(function(module, exports) {
        class CodeArea {
            constructor(latitudeLo, longitudeLo, latitudeHi, longitudeHi, codeLength) {
                this.latitudeLo = latitudeLo, this.longitudeLo = longitudeLo, this.latitudeHi = latitudeHi, 
                this.longitudeHi = longitudeHi, this.codeLength = codeLength, this.latitudeCenter = Math.min(latitudeLo + (latitudeHi - latitudeLo) / 2, 90), 
                this.longitudeCenter = Math.min(longitudeLo + (longitudeHi - longitudeLo) / 2, 180);
            }
            getLatitudeHeight() {
                return this.latitudeHi - this.latitudeLo;
            }
            getLongitudeWidth() {
                return this.longitudeHi - this.longitudeLo;
            }
        }
        class OpenLocationCode {
            constructor(code) {
                this.code = code;
            }
            getCode() {
                return this.code;
            }
            isPadded() {
                return this.code.indexOf(OpenLocationCode.PADDING_CHARACTER_) >= 0;
            }
            static isValid(code) {
                if (!code) return !1;
                if (-1 === code.indexOf(OpenLocationCode.SEPARATOR_)) return !1;
                if (code.indexOf(OpenLocationCode.SEPARATOR_) !== code.lastIndexOf(OpenLocationCode.SEPARATOR_)) return !1;
                if (1 === code.length) return !1;
                if (code.indexOf(OpenLocationCode.SEPARATOR_) > OpenLocationCode.SEPARATOR_POSITION_ || code.indexOf(OpenLocationCode.SEPARATOR_) % 2 == 1) return !1;
                if (code.indexOf(OpenLocationCode.PADDING_CHARACTER_) > -1) {
                    if (code.indexOf(OpenLocationCode.SEPARATOR_) < OpenLocationCode.SEPARATOR_POSITION_) return !1;
                    if (0 === code.indexOf(OpenLocationCode.PADDING_CHARACTER_)) return !1;
                    const padMatch = code.match(new RegExp("(" + OpenLocationCode.PADDING_CHARACTER_ + "+)", "g"));
                    if (padMatch.length > 1 || padMatch[0].length % 2 == 1 || padMatch[0].length > OpenLocationCode.SEPARATOR_POSITION_ - 2) return !1;
                    if (code.charAt(code.length - 1) !== OpenLocationCode.SEPARATOR_) return !1;
                }
                if (code.length - code.indexOf(OpenLocationCode.SEPARATOR_) - 1 == 1) return !1;
                const strippedCode = code.replace(new RegExp("\\" + OpenLocationCode.SEPARATOR_ + "+"), "").replace(new RegExp(OpenLocationCode.PADDING_CHARACTER_ + "+"), "");
                for (let i = 0, len = strippedCode.length; i < len; i++) {
                    const character = strippedCode.charAt(i).toUpperCase();
                    if (character !== OpenLocationCode.SEPARATOR_ && -1 === OpenLocationCode.CODE_ALPHABET_.indexOf(character)) return !1;
                }
                return !0;
            }
            static isPadded(code) {
                return new OpenLocationCode(code).isPadded();
            }
            static isShort(code) {
                return !!OpenLocationCode.isValid(code) && (code.indexOf(OpenLocationCode.SEPARATOR_) >= 0 && code.indexOf(OpenLocationCode.SEPARATOR_) < OpenLocationCode.SEPARATOR_POSITION_);
            }
            static isFull(code) {
                if (!OpenLocationCode.isValid(code)) return !1;
                if (OpenLocationCode.isShort(code)) return !1;
                if (OpenLocationCode.CODE_ALPHABET_.indexOf(code.charAt(0).toUpperCase()) * OpenLocationCode.ENCODING_BASE_ >= 2 * OpenLocationCode.LATITUDE_MAX_) return !1;
                if (code.length > 1) {
                    if (OpenLocationCode.CODE_ALPHABET_.indexOf(code.charAt(1).toUpperCase()) * OpenLocationCode.ENCODING_BASE_ >= 2 * OpenLocationCode.LONGITUDE_MAX_) return !1;
                }
                return !0;
            }
            contains(latitude, longitude) {
                const codeArea = OpenLocationCode.decode(this.getCode());
                return codeArea.latitudeLo <= latitude && latitude < codeArea.latitudeHi && codeArea.longitudeLo <= longitude && longitude < codeArea.longitudeHi;
            }
            static encode(latitude, longitude, codeLength = OpenLocationCode.CODE_PRECISION_NORMAL) {
                if (codeLength < 2 || codeLength < OpenLocationCode.PAIR_CODE_LENGTH_ && codeLength % 2 == 1) throw new Error("IllegalArgumentException: Invalid Open Location Code length");
                const editedCodeLength = Math.min(OpenLocationCode.MAX_DIGIT_COUNT_, codeLength);
                let editedLatitude = OpenLocationCode.clipLatitude(latitude);
                const editedLongitude = OpenLocationCode.normalizeLongitude(longitude);
                90 === editedLatitude && (editedLatitude -= OpenLocationCode.computeLatitudePrecision(editedCodeLength));
                let code = "", latVal = Math.floor(Math.round((editedLatitude + OpenLocationCode.LATITUDE_MAX_) * OpenLocationCode.FINAL_LAT_PRECISION_ * 1e6) / 1e6), lngVal = Math.floor(Math.round((editedLongitude + OpenLocationCode.LONGITUDE_MAX_) * OpenLocationCode.FINAL_LNG_PRECISION_ * 1e6) / 1e6);
                if (editedCodeLength > OpenLocationCode.PAIR_CODE_LENGTH_) for (let i = 0; i < OpenLocationCode.MAX_DIGIT_COUNT_ - OpenLocationCode.PAIR_CODE_LENGTH_; i++) {
                    const latDigit = latVal % OpenLocationCode.GRID_ROWS_, lngDigit = lngVal % OpenLocationCode.GRID_COLUMNS_, ndx = latDigit * OpenLocationCode.GRID_COLUMNS_ + lngDigit;
                    code = OpenLocationCode.CODE_ALPHABET_.charAt(ndx) + code, latVal = Math.floor(latVal / OpenLocationCode.GRID_ROWS_), 
                    lngVal = Math.floor(lngVal / OpenLocationCode.GRID_COLUMNS_);
                } else latVal = Math.floor(latVal / Math.pow(OpenLocationCode.GRID_ROWS_, OpenLocationCode.GRID_CODE_LENGTH_)), 
                lngVal = Math.floor(lngVal / Math.pow(OpenLocationCode.GRID_COLUMNS_, OpenLocationCode.GRID_CODE_LENGTH_));
                for (let i = 0; i < OpenLocationCode.PAIR_CODE_LENGTH_ / 2; i++) code = OpenLocationCode.CODE_ALPHABET_.charAt(lngVal % OpenLocationCode.ENCODING_BASE_) + code, 
                code = OpenLocationCode.CODE_ALPHABET_.charAt(latVal % OpenLocationCode.ENCODING_BASE_) + code, 
                latVal = Math.floor(latVal / OpenLocationCode.ENCODING_BASE_), lngVal = Math.floor(lngVal / OpenLocationCode.ENCODING_BASE_);
                return code = code.substring(0, OpenLocationCode.SEPARATOR_POSITION_) + OpenLocationCode.SEPARATOR_ + code.substring(OpenLocationCode.SEPARATOR_POSITION_), 
                editedCodeLength >= OpenLocationCode.SEPARATOR_POSITION_ ? code.substring(0, editedCodeLength + 1) : code.substring(0, editedCodeLength) + Array(OpenLocationCode.SEPARATOR_POSITION_ - editedCodeLength + 1).join(OpenLocationCode.PADDING_CHARACTER_) + OpenLocationCode.SEPARATOR_;
            }
            static decode(code) {
                if (!OpenLocationCode.isFull(code)) throw new Error("IllegalArgumentException: Passed Open Location Code is not a valid full code: " + code);
                const editedCode = code.replace(OpenLocationCode.SEPARATOR_, "").replace(new RegExp(OpenLocationCode.PADDING_CHARACTER_ + OpenLocationCode.SEPARATOR_), "").toUpperCase();
                let normalLat = -OpenLocationCode.LATITUDE_MAX_ * OpenLocationCode.PAIR_PRECISION_, normalLng = -OpenLocationCode.LONGITUDE_MAX_ * OpenLocationCode.PAIR_PRECISION_, gridLat = 0, gridLng = 0, digits = Math.min(editedCode.length, OpenLocationCode.PAIR_CODE_LENGTH_), pv = OpenLocationCode.PAIR_FIRST_PLACE_VALUE_;
                for (let position = 0; position < digits; position += 2) normalLat += OpenLocationCode.CODE_ALPHABET_.indexOf(editedCode.charAt(position)) * pv, 
                normalLng += OpenLocationCode.CODE_ALPHABET_.indexOf(editedCode.charAt(position + 1)) * pv, 
                position < digits - 2 && (pv /= OpenLocationCode.ENCODING_BASE_);
                let latPrecision = pv / OpenLocationCode.PAIR_PRECISION_, lngPrecision = pv / OpenLocationCode.PAIR_PRECISION_;
                if (editedCode.length > OpenLocationCode.PAIR_CODE_LENGTH_) {
                    let rowpv = OpenLocationCode.GRID_LAT_FIRST_PLACE_VALUE_, colpv = OpenLocationCode.GRID_LNG_FIRST_PLACE_VALUE_;
                    digits = Math.min(editedCode.length, OpenLocationCode.MAX_DIGIT_COUNT_);
                    for (let i = OpenLocationCode.PAIR_CODE_LENGTH_; i < digits; i++) {
                        const digitVal = OpenLocationCode.CODE_ALPHABET_.indexOf(editedCode.charAt(i));
                        gridLat += Math.floor(digitVal / OpenLocationCode.GRID_COLUMNS_) * rowpv, gridLng += digitVal % OpenLocationCode.GRID_COLUMNS_ * colpv, 
                        i < digits - 1 && (rowpv /= OpenLocationCode.GRID_ROWS_, colpv /= OpenLocationCode.GRID_COLUMNS_);
                    }
                    latPrecision = rowpv / OpenLocationCode.FINAL_LAT_PRECISION_, lngPrecision = colpv / OpenLocationCode.FINAL_LNG_PRECISION_;
                }
                const lat = normalLat / OpenLocationCode.PAIR_PRECISION_ + gridLat / OpenLocationCode.FINAL_LAT_PRECISION_, lng = normalLng / OpenLocationCode.PAIR_PRECISION_ + gridLng / OpenLocationCode.FINAL_LNG_PRECISION_;
                return new CodeArea(Math.round(1e14 * lat) / 1e14, Math.round(1e14 * lng) / 1e14, Math.round(1e14 * (lat + latPrecision)) / 1e14, Math.round(1e14 * (lng + lngPrecision)) / 1e14, Math.min(editedCode.length, OpenLocationCode.MAX_DIGIT_COUNT_));
            }
            static recoverNearest(shortCode, latitude, longitude) {
                if (!OpenLocationCode.isShort(shortCode)) {
                    if (OpenLocationCode.isFull(shortCode)) return shortCode;
                    throw new Error("ValueError: Passed short code is not valid: " + shortCode);
                }
                const referenceLatitude = OpenLocationCode.clipLatitude(latitude), referenceLongitude = OpenLocationCode.normalizeLongitude(longitude), shortCodeUpper = shortCode.toUpperCase(), paddingLength = OpenLocationCode.SEPARATOR_POSITION_ - shortCodeUpper.indexOf(OpenLocationCode.SEPARATOR_), resolution = Math.pow(20, 2 - paddingLength / 2), halfResolution = resolution / 2, codeArea = OpenLocationCode.decode(OpenLocationCode.encode(referenceLatitude, referenceLongitude).substr(0, paddingLength) + shortCodeUpper);
                return referenceLatitude + halfResolution < codeArea.latitudeCenter && codeArea.latitudeCenter - resolution >= -OpenLocationCode.LATITUDE_MAX_ ? codeArea.latitudeCenter -= resolution : referenceLatitude - halfResolution > codeArea.latitudeCenter && codeArea.latitudeCenter + resolution <= OpenLocationCode.LATITUDE_MAX_ && (codeArea.latitudeCenter += resolution), 
                referenceLongitude + halfResolution < codeArea.longitudeCenter ? codeArea.longitudeCenter -= resolution : referenceLongitude - halfResolution > codeArea.longitudeCenter && (codeArea.longitudeCenter += resolution), 
                OpenLocationCode.encode(codeArea.latitudeCenter, codeArea.longitudeCenter, codeArea.codeLength);
            }
            static shorten(code, latitude, longitude) {
                if (!OpenLocationCode.isFull(code)) throw new Error("ValueError: Passed code is not valid and full: " + code);
                if (-1 !== code.indexOf(OpenLocationCode.PADDING_CHARACTER_)) throw new Error("ValueError: Cannot shorten padded codes: " + code);
                const codeUpper = code.toUpperCase(), codeArea = OpenLocationCode.decode(codeUpper);
                if (codeArea.codeLength < OpenLocationCode.MIN_TRIMMABLE_CODE_LEN_) throw new Error("ValueError: Code length must be at least " + OpenLocationCode.MIN_TRIMMABLE_CODE_LEN_);
                const latitudeClipped = OpenLocationCode.clipLatitude(latitude), longitudeClipped = OpenLocationCode.normalizeLongitude(longitude), range = Math.max(Math.abs(codeArea.latitudeCenter - latitudeClipped), Math.abs(codeArea.longitudeCenter - longitudeClipped));
                for (let i = OpenLocationCode.PAIR_RESOLUTIONS_.length - 2; i >= 1; i--) if (range < .3 * OpenLocationCode.PAIR_RESOLUTIONS_[i]) return codeUpper.substring(2 * (i + 1));
                return codeUpper;
            }
            static clipLatitude(latitude) {
                return Math.min(90, Math.max(-90, latitude));
            }
            static computeLatitudePrecision(codeLength) {
                return codeLength <= 10 ? Math.pow(20, Math.floor(codeLength / -2 + 2)) : Math.pow(20, -3) / Math.pow(OpenLocationCode.GRID_ROWS_, codeLength - 10);
            }
            static normalizeLongitude(longitude) {
                let longitudeOutput = longitude;
                for (;longitudeOutput < -180; ) longitudeOutput += 360;
                for (;longitudeOutput >= 180; ) longitudeOutput -= 360;
                return longitudeOutput;
            }
        }
        exports.Ay = OpenLocationCode, OpenLocationCode.CODE_PRECISION_NORMAL = 10, OpenLocationCode.CODE_PRECISION_EXTRA = 11, 
        OpenLocationCode.MAX_DIGIT_COUNT_ = 15, OpenLocationCode.SEPARATOR_ = "+", OpenLocationCode.SEPARATOR_POSITION_ = 8, 
        OpenLocationCode.PADDING_CHARACTER_ = "0", OpenLocationCode.CODE_ALPHABET_ = "23456789CFGHJMPQRVWX", 
        OpenLocationCode.ENCODING_BASE_ = OpenLocationCode.CODE_ALPHABET_.length, OpenLocationCode.LATITUDE_MAX_ = 90, 
        OpenLocationCode.LONGITUDE_MAX_ = 180, OpenLocationCode.PAIR_CODE_LENGTH_ = 10, 
        OpenLocationCode.PAIR_RESOLUTIONS_ = [ 20, 1, .05, .0025, 125e-6 ], OpenLocationCode.PAIR_FIRST_PLACE_VALUE_ = Math.pow(OpenLocationCode.ENCODING_BASE_, OpenLocationCode.PAIR_CODE_LENGTH_ / 2 - 1), 
        OpenLocationCode.PAIR_PRECISION_ = Math.pow(OpenLocationCode.ENCODING_BASE_, 3), 
        OpenLocationCode.GRID_CODE_LENGTH_ = OpenLocationCode.MAX_DIGIT_COUNT_ - OpenLocationCode.PAIR_CODE_LENGTH_, 
        OpenLocationCode.GRID_COLUMNS_ = 4, OpenLocationCode.GRID_ROWS_ = 5, OpenLocationCode.GRID_LAT_FIRST_PLACE_VALUE_ = Math.pow(OpenLocationCode.GRID_ROWS_, OpenLocationCode.GRID_CODE_LENGTH_ - 1), 
        OpenLocationCode.GRID_LNG_FIRST_PLACE_VALUE_ = Math.pow(OpenLocationCode.GRID_COLUMNS_, OpenLocationCode.GRID_CODE_LENGTH_ - 1), 
        OpenLocationCode.FINAL_LAT_PRECISION_ = OpenLocationCode.PAIR_PRECISION_ * Math.pow(OpenLocationCode.GRID_ROWS_, OpenLocationCode.MAX_DIGIT_COUNT_ - OpenLocationCode.PAIR_CODE_LENGTH_), 
        OpenLocationCode.FINAL_LNG_PRECISION_ = OpenLocationCode.PAIR_PRECISION_ * Math.pow(OpenLocationCode.GRID_COLUMNS_, OpenLocationCode.MAX_DIGIT_COUNT_ - OpenLocationCode.PAIR_CODE_LENGTH_), 
        OpenLocationCode.MIN_TRIMMABLE_CODE_LEN_ = 6;
    });
    const URI = "https://plus.codes/";
    !function Register(plugin, name) {
        const setup = () => {
            window.plugin[name] = plugin, window.plugin[name].init();
        };
        setup.info = SCRIPT_INFO, window.bootPlugins || (window.bootPlugins = []), window.bootPlugins.push(setup), 
        window.iitcLoaded && setup();
    }(new class PlusCodes {
        init() {
            window.addHook("search", this.onSearch);
        }
        async onSearch(search) {
            const term = search.term.replace(URI, "");
            if (open_location_code_namespaceObject.Ay.isFull(term)) {
                const result = open_location_code_namespaceObject.Ay.decode(term);
                search.addResult({
                    title: `PlusCode: ${term}`,
                    description: `Lat: ${result.latitudeCenter.toFixed(6)}, Lng: ${result.longitudeCenter.toFixed(6)}`,
                    position: {
                        lat: result.latitudeCenter,
                        lng: result.longitudeCenter
                    }
                });
            } else if (search.confirmed) {
                const term = search.term.replace(URI, ""), code = term.substring(0, term.indexOf(" ")), city = term.substring(term.indexOf(" ") + 1);
                if (open_location_code_namespaceObject.Ay.isShort(code)) {
                    const url = new URL("https://nominatim.openstreetmap.org/search?format=json");
                    url.searchParams.set("q", city);
                    const response = await fetch(url);
                    if (!response.ok) return void console.error("Failed to fetch city coordinates for " + city, response.statusText);
                    const cities = await response.json(), cityLocation = cities[0];
                    if (!cityLocation) return void console.error("Failed to fetch cityLocation for " + city, cities);
                    const fullcode = open_location_code_namespaceObject.Ay.recoverNearest(code, parseFloat(cityLocation.lat), parseFloat(cityLocation.lon)), result = open_location_code_namespaceObject.Ay.decode(fullcode);
                    search.addResult({
                        title: `PlusCode: ${term}`,
                        description: `Lat: ${result.latitudeCenter.toFixed(6)}, Lng: ${result.longitudeCenter.toFixed(6)}`,
                        position: {
                            lat: result.latitudeCenter,
                            lng: result.longitudeCenter
                        }
                    });
                }
            }
        }
    }, "PlusCodes");
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