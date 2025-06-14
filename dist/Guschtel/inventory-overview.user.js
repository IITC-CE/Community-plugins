// ==UserScript==
// @author         Guschtel
// @id             inventory-overview@Guschtel
// @name           Ingress Inventory Overview (based on Ingress Live Inventory from Freamstern)
// @category       Utilities
// @version        0.0.12
// @downloadURL    https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/Guschtel/inventory-overview.user.js
// @updateURL      https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/Guschtel/inventory-overview.meta.js
// @description    View inventory and shows portals you have keys from
// @match          *://intel.ingress.com/*
// @match          *://*.ingress.com/mission/*
// @grant          none
// ==/UserScript==



function wrapper(plugin_info) {

    // Make sure that window.plugin exists. IITC defines it as a no-op function,
    // and other plugins assume the same.
    if (typeof window.plugin !== "function") window.plugin = function () {
    };
    const KEY_SETTINGS = "plugin-live-inventory";

    window.plugin.LiveInventory = function () {
    };

    const thisPlugin = window.plugin.LiveInventory;
    // Name of the IITC build for first-party plugins
    plugin_info.buildName = "LiveInventory";

    // Datetime-derived version of the plugin
    plugin_info.dateTimeVersion = "20250331202900";

    // ID/name of the plugin
    plugin_info.pluginId = "liveInventory";


    function loadScript(url) {
        let myScript = document.createElement("script");
        myScript.setAttribute("src", url);
        document.body.appendChild(myScript);
    }

    let chartJsUrl = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js";
    loadScript(chartJsUrl);

    const translations = {
        BOOSTED_POWER_CUBE: 'Hypercube',
        CAPSULE: 'Capsule',
        DRONE: 'Drone',
        EMITTER_A: 'Resonator',
        EMP_BURSTER: 'XMP',
        EXTRA_SHIELD: 'Aegis Shield',
        FLIP_CARD: 'Virus',
        FORCE_AMP: 'Force Amp',
        HEATSINK: 'HS',
        INTEREST_CAPSULE: 'Quantum Capsule',
        KEY_CAPSULE: 'Key Capsule',
        KINETIC_CAPSULE: 'Kinetic Capsule',
        LINK_AMPLIFIER: 'LA',
        MEDIA: 'Media',
        MULTIHACK: 'Multi-Hack',
        PLAYER_POWERUP: 'Apex',
        PORTAL_LINK_KEY: 'Key',
        PORTAL_POWERUP: 'Fracker',
        POWER_CUBE: 'PC',
        RES_SHIELD: 'Shield',
        TRANSMUTER_ATTACK: 'ITO -',
        TRANSMUTER_DEFENSE: 'ITO +',
        TURRET: 'Turret',
        ULTRA_LINK_AMP: 'Ultra-Link',
        ULTRA_STRIKE: 'US',

    };

    function isMobile() {
        return (typeof android !== "undefined" && !!android);
    }

    function isiOS() {
        return (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
    }

    function isFirefox() {
        return (/Firefox/i.test(navigator.userAgent));
    }

    function copyToClipboardFallbackExecCommand(text) {
        // Optionaler Fallback mit document.execCommand
        try {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";  // Vermeidet Scrollen
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            if (successful) {
                console.log('Fallback: Text copied successfully');
            }
        } catch (fallbackErr) {
            console.error('Fallback failed:', fallbackErr);
        }

    }

    function writeTextToClipboard(text) {
        if (isiOS() || isFirefox()) {
            try {
                navigator.clipboard.writeText(text);
            } catch (err) {
                copyToClipboardFallbackExecCommand(text);
            }
            return;
        }
        navigator.permissions.query({name: "clipboard-write"}).then((result) => {
            if (result.state === "granted" || result.state === "prompt") {
                navigator.clipboard.writeText(text);
                console.log('Text copied to clipboard');
            }
        });
    }

    function checkSubscription(callback) {
        var versionStr = niantic_params.CURRENT_VERSION;
        var post_data = JSON.stringify({
            v: versionStr
        });

        var result = $.ajax({
            url: '/r/getHasActiveSubscription',
            type: 'POST',
            data: post_data,
            context: {},
            dataType: 'json',
            success: [(data) => callback(null, data)],
            error: [(data) => callback(data)],
            contentType: 'application/json; charset=utf-8',
            beforeSend: function (req) {
                req.setRequestHeader('accept', '*/*');
                req.setRequestHeader('X-CSRFToken', readCookie('csrftoken'));
            }
        });
        return result;
    }


    function addItemToCount(item, countMap, incBy) {
        if (item[2] && item[2].resource && item[2].timedPowerupResource) {
            const key = `${item[2].resource.resourceType} ${item[2].timedPowerupResource.designation}`;
            if (!countMap[key]) {
                countMap[key] = item[2].resource;
                countMap[key].count = 0;
                countMap[key].type = `Powerup ${translations[item[2].timedPowerupResource.designation] || item[2].timedPowerupResource.designation}`;
            }
            countMap[key].count += incBy;
        } else if (item[2] && item[2].resource && item[2].flipCard) {
            const key = `${item[2].resource.resourceType} ${item[2].flipCard.flipCardType}`;
            if (!countMap[key]) {
                countMap[key] = item[2].resource;
                countMap[key].count = 0;
                countMap[key].type = `${translations[item[2].resource.resourceType]} ${item[2].flipCard.flipCardType}`;
            }
            countMap[key].flipCardType = item[2].flipCard.flipCardType;
            countMap[key].count += incBy;
        } else if (item[2] && item[2].resource) {
            const key = `${item[2].resource.resourceType} ${item[2].resource.resourceRarity}`;
            if (!countMap[key]) {
                countMap[key] = item[2].resource;
                countMap[key].count = 0;
                countMap[key].type = `${translations[item[2].resource.resourceType]}`;
            }
            countMap[key].count += incBy;
        } else if (item[2] && item[2].resourceWithLevels) {
            const key = `${item[2].resourceWithLevels.resourceType} ${item[2].resourceWithLevels.level}`;
            if (!countMap[key]) {
                countMap[key] = item[2].resourceWithLevels;
                countMap[key].count = 0;
                countMap[key].resourceRarity = 'COMMON';
                countMap[key].type = `${translations[item[2].resourceWithLevels.resourceType]} ${item[2].resourceWithLevels.level}`;
            }
            countMap[key].count += incBy;
        } else if (item[2] && item[2].modResource) {
            const key = `${item[2].modResource.resourceType} ${item[2].modResource.rarity}`;
            if (!countMap[key]) {
                countMap[key] = item[2].modResource;
                countMap[key].count = 0;
                countMap[key].type = `${translations[item[2].modResource.resourceType]}`;
                countMap[key].resourceRarity = countMap[key].rarity;
            }
            countMap[key].count += incBy;
        } else {
            console.log(item);
        }
    }

    function svgToIcon(str, s) {
        const url = ("data:image/svg+xml," + encodeURIComponent(str)).replace(/#/g, '%23');
        return new L.Icon({
            iconUrl: url,
            iconSize: [s, s],
            iconAnchor: [s / 2, s / 2],
            className: 'no-pointer-events', //allows users to click on portal under the unique marker
        })
    }

    function createIcons() {
        thisPlugin.keyIcon = svgToIcon(`<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-key" width="44" height="44" viewBox="0 0 24 24" stroke-width="2" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
 <circle cx="8" cy="15" r="4" />
 <line x1="10.85" y1="12.15" x2="19" y2="4" />
 <line x1="18" y1="5" x2="20" y2="7" />
 <line x1="15" y1="8" x2="17" y2="10" />
 </svg>`, 15);
    }

    function prepareItemCounts(data) {
        if (!data || !data.result) {
            return [];
        }
        const countMap = {};
        data.result.forEach((item) => {
            addItemToCount(item, countMap, 1);
            if (item[2].container) {
                item[2].container.stackableItems.forEach((item) => {
                    addItemToCount(item.exampleGameEntity, countMap, item.itemGuids.length);
                });
            }
        });
        const countList = Object.values(countMap);
        countList.sort((a, b) => {
            if (a.type === b.type) {
                return 0;
            }
            return a.type > b.type ? 1 : -1;
        });
        return countList;
    }

    function HexToSignedFloat(num) {
        let int = parseInt(num, 16);
        if ((int & 0x80000000) === -0x80000000) {
            int = -1 * (int ^ 0xffffffff) + 1;
        }
        return int / 10e5;
    }

    function addKeyToCount(item, countMap, incBy, moniker) {
        if (item[2] && item[2].resource && item[2].resource.resourceType && item[2].resource.resourceType === 'PORTAL_LINK_KEY') {
            const key = `${item[2].portalCoupler.portalGuid}`;
            if (!countMap[key]) {
                countMap[key] = item[2];
                countMap[key].count = 0;
                countMap[key].capsules = [];
            }

            if (moniker && countMap[key].capsules.indexOf(moniker) === -1) {
                countMap[key].capsules.push(moniker);
            }

            countMap[key].count += incBy;
        }
    }

    function prepareKeyCounts(data) {
        if (!data || !data.result) {
            return [];
        }
        const countMap = {};
        data.result.forEach((item) => {
            addKeyToCount(item, countMap, 1);
            if (item[2].container) {
                item[2].container.stackableItems.forEach((item2) => {
                    addKeyToCount(item2.exampleGameEntity, countMap, item2.itemGuids.length, item[2].moniker.differentiator);
                });
            }
        });
        const countList = Object.values(countMap);
        countList.sort((a, b) => {
            if (a.portalCoupler.portalTitle === b.portalCoupler.portalTitle) {
                return 0;
            }
            return a.portalCoupler.portalTitle.toLowerCase() > b.portalCoupler.portalTitle.toLowerCase() ? 1 : -1;
        });
        return countList;
    }

    function getKeyTableBody(orderBy, direction) {
        const sortFunctions = {
            name: (a, b) => {
                if (a.portalCoupler.portalTitle === b.portalCoupler.portalTitle) {
                    return 0;
                }
                return (a.portalCoupler.portalTitle.toLowerCase() > b.portalCoupler.portalTitle.toLowerCase() ? 1 : -1) * (direction ? 1 : -1);
            },
            count: (a, b) => (a.count - b.count) * (direction ? 1 : -1),
            distance: (a, b) => (a._distance - b._distance) * (direction ? 1 : -1),
            capsule: (a, b) => {
                const sA = a.capsules.join(', ').toLowerCase();
                const sB = b.capsules.join(', ').toLowerCase();
                if (sA === sb) {
                    return 0;
                }
                return (sA > sB ? 1 : -1) * (direction ? 1 : -1);
            }
        }

        thisPlugin.keyCount.sort(sortFunctions[orderBy]);
        return thisPlugin.keyCount.map((el) => {
            return `<tr>
 <td><a href="//intel.ingress.com/?pll=${el._latlng.lat},${el._latlng.lng}" onclick="zoomToAndShowPortal('${el.portalCoupler.portalGuid}',[${el._latlng.lat},${el._latlng.lng}]); return false;">${el.portalCoupler.portalTitle}</a></td>
 <td>${el.count}</td>
 <td>${el._formattedDistance}</td>
 <td>${el.capsules.join(', ')}</td>
 </tr>`;
        }).join('');
    }


    function getHistoryTableBody(orderBy, direction) {
        const sortFunctions = {
            date: (a, b) => {
                if (a.date === b.date) {
                    return 0;
                }
                return (a.date.toLowerCase() > b.date.toLowerCase() ? 1 : -1) * (direction ? 1 : -1);
            }
        };

        let history;
        if (localStorage[KEY_SETTINGS]) {
            const data = JSON.parse(localStorage[KEY_SETTINGS]);
            history = data.history;
        }
        if (!history) {
            history = [];
        } else {
            history.sort(sortFunctions[orderBy]);
        }
        return history.map((el, index) => {
            return `<tr>
 <td>${el.date}</td>
 <td>
 	<a onclick="window.plugin.LiveInventory.deleteHistoryItem('${el.date}')">Delete</a>` +
                ((index !== 0) ? ` / <a onclick="window.plugin.LiveInventory.showHistoryDiff('${el.date}')">Diff</a>` : '') +
                `</td>
 </tr>`;
        }).join('');
    }

    function updateTableBody(key, orderBy, direction) {
        switch (key) {
            case 'key':
                $('#live-inventory-key-table tbody').empty().append($(getKeyTableBody(orderBy, direction)));
                break;
            case 'item':
                $('#live-inventory-item-table tbody').empty().append($(getItemTableBody(orderBy, direction)));
                break;
            case 'history':
                $('#live-inventory-history-table tbody').empty().append($(getHistoryTableBody(orderBy, direction)));
                break;
        }

    }

    window.plugin.LiveInventory.deleteHistoryItem = function (date) {
        const history = JSON.parse(localStorage[KEY_SETTINGS]).history;
        patchLocalStorage({
            history: history.filter(e => e.date !== date),
        });
        updateHistoryTable();
    }

    window.plugin.LiveInventory.showHistoryDiff = function (date) {
        const data = JSON.parse(localStorage[KEY_SETTINGS]);
        if (!data || !data.history) {
            window.alert('No date given for diff.');
            return;
        }
        const history = data.history;
        const index = history.findIndex((a) => a.date === date)
        if (index === -1) {
            window.alert('No history found for this date');
            return;
        }
        const prev = history[index - 1];
        if (!prev) {
            window.alert('No previous history found for this date');
            return;
        }
        const current = history[index];

        const prevMap = prev.entries.reduce((acc, item) => {
            acc[item.type] = item;
            return acc;
        }, {});

        const currentMap = current.entries.reduce((acc, item) => {
            acc[item.type] = item;
            return acc;
        }, {});

        const types = [...new Set([...Object.keys(prevMap), ...Object.keys(currentMap)])];

        const diff = types.map((type) => {
            const prevValue = prevMap[type]?.count || 0;
            const currentValue = currentMap[type]?.count || 0;
            return {
                type: type,
                rarity: currentMap[type]?.rarity || prevMap[type]?.rarity,
                diffCount: currentValue - prevValue,
                prevCount: prevValue,
                currentCount: currentValue
            }
        }).filter(item => item.diffCount !== 0);

        const diffCsv = "Type;Rarity;Diff;Previous Count;Current Count\n" + diff.map((item) => {
                return `${item.type};${item.rarity};${item.diffCount};${item.prevCount};${item.currentCount}`
            }
        ).join("\n")

        dialog({
            html: `<div id="live-inventory-diff">
		<div class="tab">
			<button class="tablinks active">Diff</button>
		</div>
		<div id="tab-diff" class="tabcontent tab-init-open"><table id="live-inventory-item-table">
            <thead>
                <tr>
                    <th class="" data-orderby="type">Type</th>
                    <th class="" data-orderby="rarity">Rarity</th>
                    <th class="" data-orderby="diff">Diff</th>
                    <th class="" data-orderby="currentCount">Current Count</th>
                    <th class="" data-orderby="prevCount">Previous Count</th>
                </tr>
            </thead>
        <tbody>
        ${getDiffTableBody('type', 1, diff)}
        </tbody>
        </table></div></div>`,
            title: 'Live Inventory Diff between ' + date + ' and ' + prev.date,
            id: 'live-inventory-diff',
            width: 'auto'
        }).dialog('option', 'buttons', {
            'Copy to clipboard': function () {
                writeTextToClipboard(diffCsv);
            },
            'OK': function () {
                $(this).dialog('close');
            },
        });
    }

    function getDiffTableBody(orderBy, direction, diff) {
        if (!diff) {
            return "";
        }
        const sortFunctions = {
            type: (a, b) => {
                if (a.type === b.type) {
                    return 0;
                }
                return (a.type.toLowerCase() > b.type.toLowerCase() ? 1 : -1) * (direction ? 1 : -1);
            },
            rarity: (a, b) => {
                if (a.rarity === b.rarity) {
                    return 0;
                }
                return (a.rarity.toLowerCase() > b.rarity.toLowerCase() ? 1 : -1) * (direction ? 1 : -1);
            },
            diffCount: (a, b) => (a.diffCount - b.diffCount) * (direction ? 1 : -1),
            prevCount: (a, b) => (a.prevCount - b.prevCount) * (direction ? 1 : -1),
            currentCount: (a, b) => (a.currentCount - b.currentCount) * (direction ? 1 : -1),
        };


        diff.sort(sortFunctions[orderBy]);
        return diff.map((el) => {
            return `<tr>
 <td>${el.type}</td>
 <td>${el.rarity || ''}</td>
 <td>${el.diffCount}</td>
 <td>${el.prevCount}</td>
 <td>${el.currentCount}</td>
 </tr>`;
        }).join('');
    }

    function getItemTableBody(orderBy, direction) {
        const sortFunctions = {
            type: (a, b) => {
                if (a.type === b.type) {
                    return 0;
                }
                return (a.type.toLowerCase() > b.type.toLowerCase() ? 1 : -1) * (direction ? 1 : -1);
            },
            rarity: (a, b) => {
                if (a.resourceRarity === b.resourceRarity) {
                    return 0;
                }
                return (a.resourceRarity.toLowerCase() > b.resourceRarity.toLowerCase() ? 1 : -1) * (direction ? 1 : -1);
            },
            count: (a, b) => (a.count - b.count) * (direction ? 1 : -1),
        };


        thisPlugin.itemCount.sort(sortFunctions[orderBy]);
        return thisPlugin.itemCount.map((el) => {
            return `<tr>
 <td>${el.type}</td>
 <td>${el.resourceRarity || ''}</td>
 <td>${el.count}</td>
 </tr>`;
        }).join('');
    }

    function updateItemTableBody(orderBy, direction) {
        $('#live-inventory-item-table tbody').empty().append($(getItemTableBody(orderBy, direction)))
    }

    function onCopyItems() {
        exportItems();
        writeLocalStorageItemHistory();
        updateHistoryTable()
    }

    function updateHistoryTable() {
        updateTableBody('history', 'date', 1);
    }

    function writeLocalStorageItemHistory() {
        const entries = thisPlugin.itemCount.map((i) => {
            return {
                type: i.type,
                rarity: i.resourceRarity,
                count: i.count
            };
        });
        if (entries.length === 0) {
            console.log('No items to write to history');
            return;
        }
        const entry = {
            date: new Date().toISOString(),
            entries: entries
        }
        const localstorage = JSON.parse(localStorage[KEY_SETTINGS]);
        const history = localstorage.history || [];
        history.push(entry);
        patchLocalStorage({history: history})
    }

    function exportItems() {
        const str = ['Type\tRarity\tCount', ...thisPlugin.itemCount.map((i) => [i.type, i.resourceRarity, i.count].join('\t'))].join('\n');
        writeTextToClipboard(str);
    }

    function exportKeys() {
        const str = ['Name\tLink\tGUID\tKeys', ...thisPlugin.keyCount.map((el) => [el.portalCoupler.portalTitle, `https://intel.ingress.com/?pll=${el._latlng.lat},${el._latlng.lng}`, el.portalCoupler.portalGuid, el.count].join('\t'))].join('\n');
        writeTextToClipboard(str);
    }

    function getItemImage(resourceRarity, type) {
        const prefix = "data:image/png;base64,"
        var key = ((resourceRarity !== undefined) ? resourceRarity + '_' : '') + ((type !== undefined) ? type.replace(' ', '_').toUpperCase() : '');

        var modImages = {
            "VERY_RARE_AEGIS_SHIELD": "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",
            "VERY_RARE_AXA_SHIELD": "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",
            "VERY_RARE_APEX": "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",
            "CAPSULE": "",
            "DRONE": "",
            "RARE_FORCE_AMP": "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",
            "VERY_RARE_HS": "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",
            "COMMON_HS": "UklGRgwMAABXRUJQVlA4WAoAAAAQAAAAPwAAPwAAQUxQSHMEAAABkHbbliHJC3rFsW3btm3btm3btm3btlHTq8dWu7uccT90RGRUdkRMAClMM+xOEYq75hwj77txPE1csZdf+lEDwFYmVJV0YBt7AFI0OxgCvnukWU3xo76o1dkUmbIOueOCZEgLGVORcQVipRj+GQCetbQrSFV9QZAG+Y9lReknfMa7LvFMxc75wI1ckVFXmsMuBt0Pc3EStLqvAYhZO/0TxOxuXYucbTGDyqMpiSxFdsaAyxikwwbLdY2GUm2RLfPs7xrUxrSVqvAZiiM3PNWgelt8mcy3YPyPhUnStgFA9PFlkUbyDydZ60J/yN56CW2L/Aa6mEKKkg2oYiei5IeME1KH1Ga/a5glFkVJFjCDPM1OShM0PudBQJ9scfJcnUhpyb0xUKn5Rc42xX7zDiVUUvIVlIYueSg6kXQFuN9Lkcr8T6B2fdW/gldlKv/nsEmkMtNpKNWuld4CrnamUIJj4N5OpyLpHoD9itIVMS912X+8t/movZMT0YhUdvcgcnOR0R4dH1pYzWvBd3dIeQfcT60z5Etj0pXl0pWGdkq4ism9K0zFvvN8+zKN1HhwO74+aa6LMqciIkp7Rg4bzIvAdS5JnD8YslpHfcJq/6SCWxb+wvGNtZuXQfp7AUXmSud9Ev5ThdLuAFebbO8YIhU51EJE9oJJ9KSZ9guSEbOTl73FeHi1JQyy7tFWIqJOP65VlMt0gkEyqFX8zp/B17699ULWuyQBEVHtb4isLFczFGL/qYKplkSD7w96wyB9IwcRUfHnwNNUcilPikImJSt8XgPf+/wrg7zz8czS8TJdBrCGpAvucwscjaxNgyCMeBAChf9PXmeAv4NMgq5BEB9PPTYEwpBXf6H+Z0GJfDuckHQc8kD4734UAngpgSBB13eQZNf7P4fwy2MvhBpTMI341fc4Iena0O8l+MwR7IMwbPVXfQ+zC25D9ueEaf/A966a7YYwfMFBj67ftSl2k4G5e0eL2OXuOzwQuppkCxaEzz8N3d4Rplj5Hbid+ITAs63jXUh+7rLdywuZfxr69yciIoq/HdhPDSI4/ycN/wbJxx1PQLj6KBS+GJnPTNTDBWd7su+I9abX0ihI3u5+mQnYJ68KsC/rqpV0AK8yE1X6D/+pUlsYJI+3ewQDRnxkwDoTkWXp99kpaTHEzlV9P8CovnZERKlzWYnyBwuiFvT6CsN+zBGLP4ZxwkeNioBhvVPMMllfx/rad1kMjHs6KUkP8wOOZvN8MO6/qiSf6jaelqQlQPAzoyww66AGYwoSFXx8oVgHvzFeZCOl5nSJqdAfQ7i6kfrkDwxxKFEATJuUsGgm960kBbKfkgv1539hEtpECmiFCAX/q5M579g3muBm2sCkfa3PO85MRJRl4B1vrMjGFFjLPn07EhM/ZfcrMcAOe4BovK4HOUgySdPTn+tQoOs6dXyvSvKJc9sClvWDjAZnPzJ8/PMSUdOGD4tvPJoj0hbZKU628gmOp6S4mXrQnlcRDHiSn+KsNUPt6Td+NKGAAwBWUDggcgcAAHAeAJ0BKkAAQAAAwBIlsAJ0yhIVvsnmRVb/E7o8Xq3T/jfUBtmPMB5vnoY/03qAf1XqJefi9jX+4/9awpPon46fsr6w+GTzV7Xep6zj/gPy25K+AF6k/wv5Y+dXttwAflH9L/3XGr3pv6T/ruNvoAfl71T/5b/l/5X8nPa/+bf4f/te4H/KP57/tP7t2p/2Z9l39XDsWrk6h+AqDrxcxlR5N7h/VbN5SzLq8lNBlG0MBk1jkHO0UG8bz4XHDmEkbZEy10h9aZ1ByX+qYWIFwNUnfPisBmLXjzkxM9khPOmR2nmHIlz+sy2SQw6UCPKs/M2/v5c4yA2VFZ3QAADUr/YOtV8/oSXKyfEHZDRfO6ug9yRsJ5NP2JAn1TJebC3d68OAeP9xCzBwFI3yfx1P1xfpOxODx9lX7I7D+OE9uVca9zJuI7nzyrx8XwVGezdNF6tLBLzaKL52ZsrTqJ0glSGgP7z8YPN5F04MoL1rWSLv4sf89Zn2ZIxPCdt3GNaKGLc7/PfI5e0m4jVDiiN/JCAMwSOYs9geoucM3CzYoRYoESJ/RL0J0WZGCKxQsKQPDWQ2A2Ba9yXJsR2s0Sm/8t/k1cjLrmlcvYjnx6lUSMJBTWEaP/OtpnxnQV4QP+eFzrNbX3cpDhHDPmOS7XACh+AGd4zVBm7HPYp8AubCDFc8er/hyFYLQm8iyo5JrLgk7BjuAV89HKnOZkSXCSsUu/d+hEYb0/jmn6h0mP4gpO141DpgRjYf9wgShvfFTWHmR+J/5qYr2tPHWn+P/JBvegFXZO56WbZwy9fGNO9GyQ+Paovozpa+rxOy2jXSVzgwn5HKDYEbGTTLSzEmA07bQlOm6HHFGrG3JN18DlCJ1vk5chvucq1pJIBNBxkMxPJ/FVRa1m06KM1sAPcX+ylnOH88gDOg3NNYgj64fxnHgcbqiIgvVw2dZnXDegN+J0abTjU7sGr6KXVW+/kVOmXs5XJ4kFc7hUcgZmmPQMQJuDQpxCZg7jNXc99A2zwzDdBzLHc4pO3l2sljAvs7J9HNvWQ2TTOM2x89vhaSpxLC9VIzv+oHXvUhlQ8Mq/t1nwWYr95hr1oj4LB7SYTU59Aek6WW8XAoxF63899yefEViND/xItohfZ/Ff6tw0q/z8emnSWwQfZsj+rkmdA7LDiQdizq0IKy6AZVV2A7PJrqpcDQ8c47Aq0Ts+QtTr1wp0GlVjJbozkv2KpP67MBhH5caNFuDxsP/9ck/r9GmH/mGHXe3e+fwbi20n61gO8XnDAY5sKve5HNAb1/453B8qpMniOkK5U/jjsZ6S6HCGSU6y7efJsnUUX+gpQrT5cfORH8qXlAWerCwMvJXUKSIckSzaf1a4qT5CEK2pZFlsOdHpo5lpjF3fc9/SnvfgQ7wjNC4ODNIg9lAT+5k+/Z39AO0wKsQh+SAjfzoxaQcoJP1OX7wTqS59Y2ufamDpeKn2x2wKwDiw04TC6rm3noMl1zLcJFq6An9WKrXjJEXVL+9n4aDypOlBn9W1BXmxh71XAqWX8JRvpKdq0P4kai+N3Nmb8E1G2fjDRHB23neBLjkM0Zb9HHRIPOBKTHjSCsjrxytQAC1MvqfhOCCa4LI4cVX19Dqeb997EdKakTzyCJtV+DrhWP7A32K+1w8hDvUzffb+z4hOdj0kb8eeEUu/yeh/UyfbI6OMBUObG9tWyNCQezEZQzSkZyM9eNv/G/TO+5lzoSFRVWQ9++al4pdD5VMRga5xrIkV92+j/6qjaWuZVVHy5j+I+qE5btBzWIiAUM1p2afK5DZ5UVX1qT/jKYSw1K8ZMvgul+r5SN09V06Xs8emt0AsNQJjNfXZ7G0gMm9ngDzJMck/13SFv4FQUzm3m6Qvzo7mRPaY2238v+r/rxY8Sl2TK3JPZ3UK8GbmlwjYkNE9glwxwNGwwKZAPHQRizTtKBSPgwV0p7kGxHFvyMeRpC0dlUV1+WFYIVWgEuG4vZoei+t1exzA0cDTJlYgn2t83QlS45n66bJIvXoixVIBJjhcoHcxkXoA9foEHo7EGp7SsDgDuVfcBgWJ9S6LlxKRYC8grwhXJ9VuZoH0OB+vVlCw+LwIhIcCj4L17UMsO+HU13kK96XAyihHMEwyXsmv/V46yNdAHdfo3miYwOQrWE/0hQvdg1iK+lzfvJaYzxEtTROU+laGcfnJZ8DOE6Mpvf82ZzpLEboJDfvePxr/15RDQu8+Vkt3+urfvPp1m82eHwt6lg/tVEge7SydzQjsHFDZfXSJxHsufMz1ZbvWUYFDp+Eh6VlhY1kmA3DBZ0Mc8CE3tbiT5jYGWf8QIxY2RAQezsf2sIy+ZSTE/x03k61h1cVEd/APaN5lkmFaKGlVTrKRrFrOz+GHOAaQhRm5sd1d1P8w7/Ahya2YoBUTqskWi538x9jaF3H6ymJ5ls6ALdoLy6UIqRLE/piLj1iR5+uEZMymJtmuq9Br++89SqRhzlWE+TKSIUY18n1UaW7CCl7Qbf9FmajerRRnh5Xj5+cgQztKtvfyyvBMAAAAA=",
            "RARE_HS": "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",
            "VERY_RARE_HYPERCUBE": "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",
            "VERY_RARE_ITO_+": "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",
            "VERY_RARE_ITO_-": "UklGRh4KAABXRUJQVlA4WAoAAAAQAAAAPwAAOwAAQUxQSCsEAAABkLZt2+HGU3qCtkltN+3atm3btm3btm3btu3dbCe13UYzz4fMvPM0jYgJALvVVJz3Of7O8o6lPJRQAB2LDr0YwyMi5hqe7hpd38vOHDqdibIiq5C33UGOptmSEc1KBmoURIOzUHZKYzbHeiczUMiL+3F39/SO3gS1OCS87MLgUPtQKjKa7jZRywl7ipTZ7aTq7k9BmSmrw9hc9iDtDU+JXyhf+NBVyzLcTJRQUSKVADHnUDGG7UhrnauWuE6CeMVdag3RbR+QnGSlMY+RGkOT1ACkqyfQ4M8SEiNJhCVKBo8nRLjTQaydmeKePzAqOlzPoUlvLdYgVxavXxIB7M49vwgU+NhfpEKSDEG/oLASZEdsz6LgZ4joOCZBv6Ckxkmr1WpdA3W6cB8JcOz8gQANVWwCvjNYfy9v0f/4o4e2T39ynOFRSQmA8HVfUng5eFQDANqHElb9gfnH9BZkvxoiBSrfSgM2P4kxMeX1AwCnm2KWPy/+mVH+xXApW4VbsXaLLv/OEsTwYzgA7BLjLUgqXGQDAIVS7V9rzOH3SVZExFVKgC1oyRKQPkGWtubg/nUj/APL9ljzINqUNCwIxnE3OaQ39BRTaAJL1yys04UHeFRf8dnw+fqWCR2rFGs6++uVkm3uJSB9dDsAgKKdpuy88yMhM4rjuO+P7t3/aUREtERvbNP0A0bHWZE+viPYbhKQ2pwnYL6mDVaIbMcCKaRda6EG0ZkFIe3+zOquIDm8ICzWAmvN2Hwyr5t2QC+IZP+PNRgy42+MDgFWZdPf+WHm8tKqgNvQhxk2yWfPDCxSvYwW2NskIjWfnoPnIqZ/CnXZkJFtsUHExLVFQG57I5Xl+5Ns3A5O9QrvtSCr8Heqv4ygbwx8yteYmEgu8vWD+4+eJaTziPsAdJdQrvVlL2cmxV6x7J/HRlT2L1FMp9O5aSptMwiIiHccK7xEwtxL9R0YoMLoUaNGjRreMEgNkqELIgUUfei0CWlTtpd1lpIfNu0bj5JPNEuIEGOPeRKFTfvGI+OfgF48FWY3Jwme+I1HZi6kdjYZ7lLK8x7xxYoyDTodR6cvIsdr4DMzys6orn1Gxw+X4XncgoS5DeAwHd5yYVIvtSJJQ5idDxn1mbqnIynfC5rF0OFClkp/kHgUKKufzaPK7sngdwPpAFwGfhVIhPUOUo5rBbJFYBuxIYXitj9IapblIPl2EVA3um2W9bcKSIf9x3wD8Bz7T0ZGd2D0fEPHj5MCRel9WSJ8XhL34f4kBxbtQ7o7PgwATu1vPz23ddqgJhV0PholsDrdJEtpBjJdXRyAdhfZSpUc+o1U78LAXicQZXYGu+1qptnraD9eh9IpfpQCO3auu0XPs5m+rasK9q0sPO2dSUJION8rUAn279vrShoiZr+cXd4JCqhL8yvpV7v4KMCOAQBWUDggzAUAANAaAJ0BKkAAPAAAwBIlsAJ05QVE9+P2D8d/Yiq3+A/Df4q8s0ZKvv6hvzzvWvMt+yf7O+7r6Hv8J6gH9E/2/WEegB5cP7b/CH+4XpS3gn9z8NfIL7BQKPzPFLtNY0b/P2xrH5592dx8y/xH/l9wn+af0v/i/2bhXP2AQbW6TFPVR186cs5UtGfD9qRku1QhuZdmaeosYZSJibzEGZIEL7xhLynA/kNC23wKd9oWZn7uKYtNyEtFtNS4vZMibuTggViN5kXj40J7d2i57ReToUKloNX0Xsnx/JHIPauL6AAA/v+ncV+BqgksWXJYe+86lSSOOiDzp8wzO1fS7fp2B+lDVLlrjEI0rhf/hY3tKFMk1TU73NNaJRdi/7+/4Tsa16dIybpvHSS79fWnUhn4bEmE5c1m/if7S58CS/jiJIevaTafxflKf/VMOXyY4IDcPzb9BkhhyE7Hw3QjTMfdJZq3YteKC9Hbzuv5i3hLf6zNf17k5ANGOvOD9LoltqWIxqS+h3AFNEDZykylJ6Wi1MzUUKvTu2/XLwknG4afFDHtCQj934ojyNgG9CRhsVimePqAtTiPhHzzVRcy1Jcgh3at4dJKrMlMquhENYhIulcO1DLRJNTuP8obWHpf/mRrkod4wTUcswJXE2fI81NhbTIzNMrOvx8qXjmx/3mYjuI68Bz20e21UX9BU93u+ra8E3Qb7my6YMaavB7qV/qDOTglZcuzs///4tN1D/Mn+IIuaex0XdQ/8WzqIEcb5eI+gl9W7ylaskmsfKxXNPagzblGDIWcwX07SZJS21BzBz/rDfmTB/WlDsxMfPrcOzmGNbvc/7v+bgNRU4TYMbrOrxfTHv1QJh50AXpSOp5nEBaHs6xUmPrn4xBTg9OYLzUBMUUtMK4d2YuiwYHgc/GKLk/kbf/0rYn965TSKThD/1sr05WN5w6ndQNODka7CI5swcv6Yf2hkCm335vvL/IxoOKUd3fKW0Ic+KTBxIUCUeBpjoN314717JWW+jl/4t6rVZh/OoztyaPQLFNjUb5vU+Lui8NQC4Xf9FkkyN+VDOzPRhlHYWtpxF5VmBGLqv2lKIudAPBgZBK0/NECyBsgqSLsCODbyTtrok6SVsorMg4PQoNy42PAGIg1LF4P3ogcAgw8InDXsapD8vTJkmSZ19Cwxm+wI0sCyzta4pFZv186wbCnjmhlv6yXw61Gi0KmXw/uJcvgwe9MHCRNTwgT2WZvi/zveMKlqYK01z9hP1x2EvyU+xkGEuRKP+uhN30T2LQC1lWzx6+VdISM6fcbVnQ4qRD4sY9WUWjgEOey+e8GgjXzxZEyckuh01q26JF/4M+2F/JNRQPJRhkdZnQ6XEfHgx8HAZ/CycbT6SAxbTh7/QNkcI597Xd9AD6lCy5Iqt18t/U/A4kJ2HJ9EPRjO5OSI7by9R3K9X3YeXS58kqRNdLGWjwq8PV2XIPjY5+m/MQcfaQDzd5IocgmusY+NfktXwmR+jWOgXgpXyZLzbkXgGHMko98lh7U1p+iC7iBVX/r/5stYT/1gxpoiWsHfur0vr3egl1aXSNeMyS/UfCnpihzRcHGkCOuMb+6Kl3eR5gB/PY9snpNCi9Ub486nAJ/7qpNcsa2DPCObEDReU91B3tbqDk73e21S2zuK5hz6BGFsLyJgpzUKApgBj//y8P+QBP8oElcd+MBhVom8FT86zlLXlBAHnP+8gBl3dD1eH8wZdtb2/px06EA4IJi9UloY5mR78eIdjCszExJQ9uXxFTKbSG+/0EWcksAw+ms728cBdoqpFA8q6kXVmZRuWMb+VH/tWmqM1/46fJO66mq6rfmQ/IIPTn9C1nzpJ9Jqgp5vfahFXEP5IOGjn6wcbX7xgiC2XM6z/TFoWFoDPHB5/eBgll6Wj6buJHv97k+ZVjNkew73Il6YUtbwt4rizCmjNYXX0sS1/XjXGPWHuhXn4gwKEFFoMH8FQAA",
            "KEY": "",
            "KEY_CAPSULE": "",
            "KINETIC_CAPSULE": "",
            "RARE_LA": "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",
            "VERY_RARE_LA": "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",
            "VERY_RARE_MULTI-HACK": "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",
            "RARE_MULTI-HACK": "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",
            "COMMON_MULTI-HACK": "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",
            "COMMON_PC_1": "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",
            "COMMON_PC_2": "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",
            "COMMON_PC_3": "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",
            "COMMON_PC_4": "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",
            "COMMON_PC_5": "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",
            "COMMON_PC_6": "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",
            "COMMON_PC_7": "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",
            "COMMON_PC_8": "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",
            "POWERUP_BN_BLM": "",
            "POWERUP_ENL": "",
            "POWERUP_FRACK": "",
            "POWERUP_FW_ENL": "",
            "POWERUP_FW_RES": "",
            "POWERUP_MEET": "",
            "POWERUP_NIA": "",
            "POWERUP_RES": "",
            "POWERUP_TOASTY": "",
            "QUANTUM_CAPSULE": "",
            "RESONATOR_1": "",
            "RESONATOR_2": "",
            "RESONATOR_3": "",
            "RESONATOR_4": "",
            "RESONATOR_5": "",
            "RESONATOR_6": "",
            "RESONATOR_7": "",
            "RESONATOR_8": "",
            "VERY_RARE_SHIELD": "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",
            "COMMON_SHIELD": "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",
            "RARE_SHIELD": "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",
            "RARE_TURRET": "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",
            "VERY_RARE_ULTRA-LINK": "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",
            "COMMON_US_1": "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",
            "COMMON_US_2": "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",
            "COMMON_US_3": "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",
            "COMMON_US_4": "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",
            "COMMON_US_5": "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",
            "COMMON_US_6": "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",
            "COMMON_US_7": "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",
            "COMMON_US_8": "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",
            "VERY_RARE_VIRUS_ADA": "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",
            "VERY_RARE_VIRUS_JARVIS": "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",
            "COMMON_XMP_1": "UklGRlIHAABXRUJQVlA4WAoAAAAQAAAAPwAALQAAQUxQSLsCAAABkLZt29nIE7rrdm3btm3btm3vR9u2bXNsrG2bg6OZbe4PySRvk4iYAAi2rbqcFqZOHx3sMVfB90EeWNwO89RKeDpj7darJ0cXsZqkUwpVfS83NElnikXU+O/G2BJ2wzX7rIX0vd3RMpOxCkdRd2LolBJW46TdQ6FX0qm4LP6zTJXEBHhURo7K4rf6n+kfKXRQFj+NpuDzTpV6/yhdymsGeQxU8z4lfSOFFe3nAIYJelZYzXWJZEAGQZWjdluAuXq8f97eu7F7cWurGpaTTGghpnIcFwDYqCEldtvCUe1qFMrutkLjUJLcYRNRMY4cDWCtBjmgkR366/0j+baUAMtWUuoIYIYG8sfaYvryPSPJaQJy3Sf/1gYwWhP5eGQmPa5Liois+lokkW8LC6B0pbldG5YrkjvqW0QyNosI8ufayi5Ng2SS3OfQkz6I5GWXGPLb8V65LanV+qP4VElP5e8ktwDAGBGkdG9BVZda7scK3mqXVtsYkpwPIO9lMSS/n+ydywLAeU6FSTvSanGcUAwF8p6lH6X7y2q5geVq/NtES5FXJJObIu9Z+vnHmf7ZBslq3G7T0Os/ya/lcp+l/6U7p72pvCurYT1JPqt5mgafm1qWGMWT6zR6XI5UWiUoZNlwUl+1ynE067l0ijKxNO2ftopFNPEJAJkizJMQ8QVAvT9+8D3csfFEwK2IV2/e/klKkvS9KdMIwDwK94ZPzm+B3ePJkL9AoZqNGnYaPWrSmo0b99wMCLgV8fLNm3eheQCkuyUq4Vz3LBBrdXs8ngz5CxQomMcGoMYPIfLn3c3TwpiZN1Og79mS8g4YNMcRnz4pfnpBKwx7PoV6Ey72z2GBgc97dXzf1yYtjJ07Vsv/xytqO2D0Su/l3z6VhBsj8lth/HJhp+of8lJ+s71VOpizQC5kXPxuaQU7TAoAVlA4IHAEAABQFQCdASpAAC4AAMASJZADDMcDXPZA8zG2f2jFv6u/qP20/mA/XL1qvRX/qt8U9ADpN/3LwgD+Adpn9s/EbrnPHXsllC/ymci/weSX/KP97xgdtVx7Ebnql/z//e8tH5N/kPYE/l39K/43Aq/rgdmtxLWux11CPgwR19vJQ2ae9yT1mfA2v6MV9pv8FSUW3oufNgGs1TdW0lmCs6Arnc5fgdDc7OzL6AbPh9wM3C0It/1fgAD+/5OFzQkb+5H/W8yqCo+FrSdw7e/6kRyz/4/PJrglyjHv/DCcvxqy5gDJy7Q57Gd2/GP8nZRYJP+iuq1mdRYAKwrxBePdphsF8mZP/44ey/7rZvDGzp9hMdI9S/qZlOTcEylCxm+WYQvi/+OuJzVsOp2L27Bn9oXFP5wf/FjvY0VDRH0oynqvNC1Z7ryc8K+f/KJejLIrwjnPa2sTw6H98p+54155Efk71w/e26OYS/WkinJOTSzeT7Kn+vDC3On66253jTonyI9vdk09JWW1A0265P2EbdytEvijO02Tqo1sYxssSf4eLU87ibGa1/tvaYRPZLfxa4wOLVBvM+EJE3LqsQ2xpZgzUhsiFqV//9EvyyL9gGM2nrHXtYskM1m9DomcvI8ba0KsaWJh5+JkqYO6DC7GmHZhku7WdiyNmNzqDCGn0n4cLKGWVN1bgtqk8OYC6PKsQzGNtX/2tk2l6+1v/TGza4weCJpufz0haRYVNWYXdY/eKH29BOZ223+lVmitW/eb5mn1f0/68QYX/8OwjH4s2AWNTkV3BScC1yzsKfw64pkM8hcZu9/R3j5N39Nl/JJ/g14gIG4+fDP/Xsxw4K1OQH/D1fuv8LX82OPcG0VbARhlNWJM5lnedoNbyOVpG7bJ1FjoRugw9b4BLW6Oa6nWMntcoJDGdgYv9oin6aW8qIg9AsHIo5fYHsLpQzqUfqRS984K8GDf4xRQRf1T9bPBfdKu9seIdjVkTIqpJQD+f5xz/0lA+8eP5+wv0vf/GLwkO7n2FD9f+fbRx8OWg4JhetZh3wxqBJz7QITJvhqOMrCg6H3wm4GD+B/fq54mRWrxEYExPO0/4ulnHI4A/Oqt4Ag5LQObbIJfhFNBH+mnzQk9Q4jd35Lchn7sYr86Fb2HTN8CRKP3aF5DFMngWIToZTJm1w2TW6uTI+RP6wzghFe0CJblrARxZqQLyeKM/ysdgrBB6V4M6/vZflKRjaq0oaMv5nsDzh11ks91JqnXsAvlG+TAFw+oWYIwPBdQijc/0Qp6YJSnejJv+bw7tof4H/ousf7pRWRa28E3jzakDLk5WH5o0bHd2PPrMPiWD46fzqY3gtJAtF7FN917OjUvNe9KhnkJlcfZeBpUOIypJLgf96Qf4/4edcn7IsyyYxYrRf7uRBbAlBaDTiTG3lk1SQZKQ1joSvV65S99ybS3sYfuMjkXSB8IbdAclx7IzcpsCW2MBqfzBiX9a3q+uSYvZLWmTmKVs1B+zZcBAP6gjdjxhAAAAA==",
            "COMMON_XMP_2": "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",
            "COMMON_XMP_3": "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",
            "COMMON_XMP_4": "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",
            "COMMON_XMP_5": "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",
            "COMMON_XMP_6": "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",
            "COMMON_XMP_7": "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",
            "COMMON_XMP_8": "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"
        };

        return prefix + modImages[key];
    }

    // all ["EXTRA_SHIELD", "PLAYER_POWERUP", "CAPSULE", "DRONE", "FORCE_AMP", "HEATSINK", "HEATSINK", "HEATSINK", "BOOSTED_POWER_CUBE", "TRANSMUTER_DEFENSE", "TRANSMUTER_ATTACK", "PORTAL_LINK_KEY", "KEY_CAPSULE", "KINETIC_CAPSULE", "LINK_AMPLIFIER", "LINK_AMPLIFIER", "MULTIHACK", "MULTIHACK", "MULTIHACK", "POWER_CUBE", "POWER_CUBE", "PORTAL_POWERUP", "PORTAL_POWERUP", "PORTAL_POWERUP", "PORTAL_POWERUP", "PORTAL_POWERUP", "PORTAL_POWERUP", "PORTAL_POWERUP", "PORTAL_POWERUP", "PORTAL_POWERUP", "INTEREST_CAPSULE", "EMITTER_A", "EMITTER_A", "EMITTER_A", "EMITTER_A", "EMITTER_A", "RES_SHIELD", "RES_SHIELD", "RES_SHIELD", "TURRET", "ULTRA_LINK_AMP", "ULTRA_STRIKE", "ULTRA_STRIKE", "ULTRA_STRIKE", "FLIP_CARD", "FLIP_CARD", "EMP_BURSTER", "EMP_BURSTER", "EMP_BURSTER"]
    function isWeapon(resourceType, resourceRarity) {
        var mods = ["ULTRA_STRIKE", "FLIP_CARD", "EMP_BURSTER"];
        return mods.includes(resourceType);
    }

    function isPC(resourceType, resourceRarity) {
        var mods = ["POWER_CUBE", "BOOSTED_POWER_CUBE"];
        return mods.includes(resourceType);
    }

    function isMod(resourceType, resourceRarity) {
        var mods = ["EXTRA_SHIELD", "PLAYER_POWERUP", "FORCE_AMP", "HEATSINK", "HEATSINK", "TRANSMUTER_DEFENSE", "TRANSMUTER_ATTACK", "LINK_AMPLIFIER", "MULTIHACK", "RES_SHIELD", "TURRET", "ULTRA_LINK_AMP"];
        return mods.includes(resourceType);
    }

    function getInventoryPowercubeItems() {
        var result = "";
        var i;
        for (i = 0; i < thisPlugin.itemCount.length; i++) {
            var item = thisPlugin.itemCount[i];
            var resourceType = item.resourceType;
            var resourceRarity = item.resourceRarity;
            var type = item.type;
            var count = item.count;
            if (isPC(resourceType, resourceRarity)) {
                var level = (item.level !== undefined) ? 'L' + item.level + ': ' : '';
                var image = getItemImage(resourceRarity, type);
                result += `<div class="item">
                        <img src="${image}" width="64" title="${count} ${resourceRarity} ${type} ${level}" />
                        <span class="image-text-centered" title="${count} ${resourceRarity} ${type} ${level}">${level}${count}</span>
                    </div>`;
            }
        }
        return result;
    }

    function getInventoryModItems() {
        var result = "";
        var i;
        for (i = 0; i < thisPlugin.itemCount.length; i++) {
            var item = thisPlugin.itemCount[i];
            var resourceType = item.resourceType;
            var resourceRarity = item.resourceRarity;
            var type = item.type;
            var count = item.count;
            if (isMod(resourceType, resourceRarity)) {
                var image = getItemImage(resourceRarity, type);
                result += `<div class="item">
                        <img src="${image}" width="64" title="${count} ${resourceRarity} ${type}" />
                        <span class="image-text-centered" title="${count} ${resourceRarity} ${type}">${count}</span>
                    </div>`;
            }
        }
        return result;
    }

    function getInventoryWeaponItems() {
        var result = "";
        var i;
        for (i = 0; i < thisPlugin.itemCount.length; i++) {
            var item = thisPlugin.itemCount[i];
            var resourceType = item.resourceType;
            var resourceRarity = item.resourceRarity;
            var type = item.type;
            var count = item.count;
            if (isWeapon(resourceType, resourceRarity)) {
                var level = (item.level !== undefined) ? 'L' + item.level + ': ' : '';
                var image = getItemImage(resourceRarity, type);
                result += `<div class="item">
                        <img src="${image}" width="64" title="${count} ${resourceRarity} ${type} ${level}" />
                        <span class="image-text-centered" title="${count} ${resourceRarity} ${type} ${level}">${level}${count}</span>
                    </div>`;
            }
        }
        return result;
    }

    function displayInventory() {
        dialog({
            html: `
<div id="live-inventory">
    <!-- Tab links -->
    <div class="tab">
    <button class="tablinks active" onclick="openTab(event, 'tab-overview'); initInventoryChart();">Overview</button>
    <button class="tablinks" onclick="openTab(event, 'tab-weapons')">Weapons & PCs</button>
    <button class="tablinks" onclick="openTab(event, 'tab-mods')">Mods</button>
    <button class="tablinks" onclick="openTab(event, 'tab-complete')">Item overview</button>
    <button class="tablinks" onclick="openTab(event, 'tab-keys')">Keys</button>
    <button class="tablinks" onclick="openTab(event, 'tab-history')">History</button>
    </div>

    <!-- Tab content -->
    <div id="tab-overview" class="tabcontent tab-init-open">
        <h3>Overview</h3>
        <div id="inventoryChartContainer">
            <canvas id="inventoryChart" width="300" height="300"></canvas>
        </div>
    </div>

    <div id="tab-weapons" class="tabcontent">
        <h3>Weapons</h3>
        <div class="itemcontainer clearfix">
            ${getInventoryWeaponItems()}
        </div>
        <h3>Powercubes</h3>
        <div class="itemcontainer clearfix">
            ${getInventoryPowercubeItems()}
        </div>
    </div>

    <div id="tab-mods" class="tabcontent">
        <h3>Mods</h3>
        <div class="itemcontainer clearfix">
            ${getInventoryModItems()}
        </div>
    </div>

    <div id="tab-complete" class="tabcontent">
        <table id="live-inventory-item-table">
            <thead>
                <tr>
                    <th class="" data-orderby="type">Type</th>
                    <th class="" data-orderby="rarity">Rarity</th>
                    <th class="" data-orderby="count">Count</th>
                </tr>
            </thead>
        <tbody>
        ${getItemTableBody('type', 1)}
        </tbody>
        </table>
    </div>
    <div id="tab-keys" class="tabcontent">
        <table id="live-inventory-key-table">
        <thead>
            <tr>
                <th class="" data-orderby="name">Portal</th>
                <th class="" data-orderby="count">Count</th>
                <th class="" data-orderby="distance">Distance</th>
                <th class="" data-orderby="capsule">Capsules</th>
            </tr>
        </thead>
        <tbody>
        ${getKeyTableBody('name', 1)}
        </tbody>
        </table>
    </div>
    <div id="tab-history" class="tabcontent">
    	<p>&#x1F6C8; Click on "Copy Items" to create a history entry for the current inventory.</p>
    	<p>Make sure, that your inventory data was correctly updated before. You might need to reload IITC to refetch your inventory.</p>
        <table id="live-inventory-history-table">
        <thead>
            <tr>
                <th class="" data-orderby="date">Date</th>
                <th class="">Actions</th>
            </tr>
        </thead>
        <tbody>
        ${getHistoryTableBody('date', 1)}
        </tbody>
        </table>
    </div>
</div>`,
            title: 'Live Inventory',
            id: 'live-inventory',
            width: 'auto'
        }).dialog('option', 'buttons', {
            'Copy Items': onCopyItems,
            'Copy Keys': exportKeys,
            'OK': function () {
                $(this).dialog('close');
            },
        });

        initInventoryChart();

        const tabs = ['key', 'item', 'history'];
        for (var i = 0; i < tabs.length; i++) {
            const tab = tabs[i];
            const selector = '#live-inventory-' + tab + '-table th';
            $(selector).click(function () {
                const orderBy = this.getAttribute('data-orderby');
                this.orderDirection = !this.orderDirection;
                updateTableBody(tab, orderBy, this.orderDirection);
            });
        }
    };

    function preparePortalKeyMap() {
        const keyMap = {};
        thisPlugin.keyCount.forEach((k) => {
            keyMap[k.portalCoupler.portalGuid] = k;
        });
        return keyMap;
    }

    function formatDistance(dist) {
        if (dist >= 10000) {
            dist = Math.round(dist / 1000) + 'km';
        } else if (dist >= 1000) {
            dist = Math.round(dist / 100) / 10 + 'km';
        } else {
            dist = Math.round(dist) + 'm';
        }

        return dist;
    }

    function updateDistances() {
        const center = window.map.getCenter();
        thisPlugin.keyCount.forEach((k) => {
            if (!k._latlng) {
                k._latlng = L.latLng.apply(L, k.portalCoupler.portalLocation.split(',').map(e => {
                    return HexToSignedFloat(e);
                }));
            }
            k._distance = k._latlng.distanceTo(center);
            k._formattedDistance = formatDistance(k._distance);
        });
    }

    function prepareData(data) {
        thisPlugin.itemCount = prepareItemCounts(data);
        thisPlugin.keyCount = prepareKeyCounts(data);
        thisPlugin.keyMap = preparePortalKeyMap();
        updateDistances();
    }

    function initLocalStorage() {
        if (!localStorage[KEY_SETTINGS]) {
            localStorage[KEY_SETTINGS] = JSON.stringify({
                expires: undefined,
                data: {},
                history: [],
            });
        }
    }

    function patchLocalStorage(data) {
        const localData = JSON.parse(localStorage[KEY_SETTINGS]);
        const patched = {
            ...localData,
            ...data,
        };
        localStorage[KEY_SETTINGS] = JSON.stringify(patched);
    }

    function loadInventory() {
        try {
            if (localStorage[KEY_SETTINGS]) {
                const localData = JSON.parse(localStorage[KEY_SETTINGS]);
                if (localData && localData.expires > Date.now()) {
                    prepareData(localData.data);
                    return;
                }
            }
            prepareData(null);
        } catch (e) {
            console.error("Error loading inventory: ", e);
        }

        checkSubscription((err, data) => {
            if (data && data.result === true) {
                window.postAjax('getInventory', {
                    "lastQueryTimestamp": 0
                }, (data, textStatus, jqXHR) => {
                    patchLocalStorage({
                        data: data,
                        expires: Date.now() + 5 * 60 * 1000 // request data only once per five minutes, or we might hit a rate limit
                    });
                    prepareData(data);
                }, (data, textStatus, jqXHR) => {
                    console.error(data);
                });
            }
        });
    };

    function portalDetailsUpdated(p) {
        if (!thisPlugin.keyMap) {
            return;
        }
        const countData = thisPlugin.keyMap[p.guid];
        if (countData) {
            $(`<tr><td>${countData.count}</td><th>Keys</th><th></th><td></td></tr>`)
                .appendTo($('#randdetails tbody'));
        }
    }

    function addKeyToLayer(data) {
        const tileParams = window.getCurrentZoomTileParameters ? window.getCurrentZoomTileParameters() : window.getMapZoomTileParameters();
        if (tileParams.level !== 0) {
            return;
        }

        if (thisPlugin.keyMap && thisPlugin.keyMap[data.portal.options.guid] && !data.portal._keyMarker) {
            data.portal._keyMarker = L.marker(data.portal._latlng, {
                icon: thisPlugin.keyIcon,
                /*icon: new L.DivIcon({
                    html:thisPlugin.keyMap[data.portal.options.guid].count,
                    className: 'plugin-live-inventory-count'
                }),*/
                interactive: false,
                keyboard: false,
            }).addTo(thisPlugin.layerGroup);
        }
    }

    function removeKeyFromLayer(data) {
        if (data.portal._keyMarker) {
            thisPlugin.layerGroup.removeLayer(data.portal._keyMarker);
            delete data.portal._keyMarker;
        }
    }

    function checkShowAllIcons(data) {
        const tileParams = window.getCurrentZoomTileParameters ? window.getCurrentZoomTileParameters() : window.getMapZoomTileParameters();
        if (tileParams.level !== 0) {
            thisPlugin.layerGroup.clearLayers();
            for (let id in window.portals) {
                delete window.portals[id]._keyMarker;
            }
        } else {
            for (let id in window.portals) {
                addKeyToLayer({
                    portal: window.portals[id]
                });
            }
        }
    }

    function setup() {
        initLocalStorage();
        loadInventory();
        $('<a href="#">')
            .text('Inventory')
            .click(displayInventory)
            .appendTo($('#toolbox'));

        $("<style>")
            .prop("type", "text/css")
            .html(`.plugin-live-inventory-count {
 font-size: 10px;
 color: #FFFFBB;
 font-family: monospace;
 text-align: center;
 text-shadow: 0 0 1px black, 0 0 1em black, 0 0 0.2em black;
 pointer-events: none;
 -webkit-text-size-adjust:none;
 }
 #live-inventory-diff th, #live-inventory th {
 background-color: rgb(27, 65, 94);
 cursor: pointer;
 }
 `)
            .appendTo("head");


        $("<style>")
            .prop("type", "text/css")
            .html(`
/* workaround */
div#dialog-live-inventory {
    overflow-x: hidden !important;
}

.clearfix:after {
  content: ".";
  display: block;
  clear: both;
  visibility: hidden;
  height: 0;
  line-height: 0;
}

.item {
    float: left;
    position: relative;
    /* margin-right: 4px; */
    width: 128px;
    height: 64px;
    margin-bottom: 12px;
    border-bottom: 1px solid #ffce00;
    padding-bottom: 12px;
}

.image-text-centered {
    color: white;
    left: 88px;
    position: absolute;
    /* text-align: center; */
    top: 24px;
    width: 100%;
    /* font-weight: bold; */
    /* font-size: 2.1em; */
    /* -webkit-text-stroke: 2px black; */
}
 			
/* Style the tab */
.tab {
  overflow: hidden;
  border: 1px solid #ffce00;
  background-color: rgba(8, 60, 78, 0.9);
  color: #ffce00;
}

/* Style the buttons that are used to open the tab content */
.tab button {
  background-color: inherit;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 8px 8px;
  transition: 0.3s;
}

/* Change background color of buttons on hover */
.tab button:hover {
  background-color: #ffce00;
  color: rgba(8, 60, 78, 0.9);
}

/* Create an active/current tablink class */
.tab button.active {
  background-color: #ffce00;
  color: rgba(8, 60, 78, 0.9);
}

/* Style the tab content */
.tabcontent {
  display: none;
  padding: 8px 8px;
  border: 1px solid #ffce00;
  border-top: none;
}
.tab-init-open {
    display: block !important;
}
`).appendTo("head");

        $("<script>")
            .prop("type", "text/javascript")
            .html(`
function openTab(evt, tabName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    tabcontent[i].className = tabcontent[i].className.replace(" tab-init-open", "");
  } 
  
  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  
  

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  
  if (evt != null || evt == undefined) {
    evt.currentTarget.className += " active";
  }
}
`).appendTo("head");

        $("<script>")
            .prop("type", "text/javascript")
            .html(`
function initInventoryChart() {
    var inventoryChartContainer = document.getElementById('inventoryChartContainer');
    var canvas = '<canvas id="inventoryChart" width="600" height="600"></canvas>';
    
    if (inventoryChartContainer != null) {
        inventoryChartContainer.innerHTML = '';
        inventoryChartContainer.innerHTML = canvas;
    }
    
    const translations = {
 		BOOSTED_POWER_CUBE: 'Hypercube',
 		CAPSULE: 'Capsule',
 		DRONE: 'Drone',
 		EMITTER_A: 'Resonator',
 		EMP_BURSTER: 'XMP',
 		EXTRA_SHIELD: 'Aegis Shield',
 		FLIP_CARD: 'Virus',
 		FORCE_AMP: 'Force Amp',
 		HEATSINK: 'HS',
 		INTEREST_CAPSULE: 'Quantum Capsule',
 		KEY_CAPSULE: 'Key Capsule',
 		KINETIC_CAPSULE: 'Kinetic Capsule',
 		LINK_AMPLIFIER: 'LA',
 		MEDIA: 'Media',
 		MULTIHACK: 'Multi-Hack',
 		PLAYER_POWERUP: 'Apex',
 		PORTAL_LINK_KEY: 'Key',
 		PORTAL_POWERUP: 'Fracker',
 		POWER_CUBE: 'PC',
 		RES_SHIELD: 'Shield',
 		TRANSMUTER_ATTACK: 'ITO -',
 		TRANSMUTER_DEFENSE: 'ITO +',
 		TURRET: 'Turret',
 		ULTRA_LINK_AMP: 'Ultra-Link',
 		ULTRA_STRIKE: 'US',
 
 	};
    
    var theChart;
    
    var ctx = document.getElementById('inventoryChart');
    var counts = window.plugin.LiveInventory.itemCount.reduce((p, c) => {
        var name = c.resourceType;
        var value = c.count;
        if (!p.hasOwnProperty(name)) {
            p[name] = 0;
        }
        p[name] = p[name] + value;
        return p;
        }, {});
    
    data = {
        labels: Object.keys(counts).map(x => translations[x]),
        datasets: [{
            label: '# of type',
            data: Object.values(counts),
            backgroundColor: [
                '#FFFFFF',
                '#F0A3FF',
                '#0075DC',
                '#993F00',
                '#4C005C',
                '#191919',
                '#005C31',
                '#2BCE48',
                '#FFCC99',
                '#808080',
                '#94FFB5',
                '#8F7C00',
                '#9DCC00',
                '#C20088',
                '#003380',
                '#FFA405',
                '#FFA8BB',
                '#426600',
                '#FF0010',
                '#5EF1F2',
                '#00998F',
                '#E0FF66',
                '#740AFF',
                '#990000',
                '#FFFF80',
                '#FFFF00',
                '#FF5005'
            ],
            borderColor: [
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF',
                '#FFFFFF'
            ],
            borderWidth: 1
        }]
    };
    options = {
        legend: {
            labels: {
                fontColor: 'white'
            },
            onHover: (evt, legendItem) => {
                const index = theChart.data.labels.indexOf(legendItem.text);
                
                var i;
                for (i=0; i<theChart.getDatasetMeta(0).data.length; i++) {
                    const segment = theChart.getDatasetMeta(0).data[i];
                    segment._model.backgroundColor = 'gray';
                }
                
                const activeSegment = theChart.getDatasetMeta(0).data[index];
                activeSegment._model.backgroundColor = 'red';
                activeSegment._model.fontColor = 'white';
                activeSegment._model.borderWidth = activeSegment._options.hoverBorderWidth;
                theChart.tooltip._active = [activeSegment];
                theChart.tooltip.update();
                theChart.draw();
            },
            onLeave: (evt, legendItem) => {
                const index = theChart.data.labels.indexOf(legendItem.text);
                
                var i;
                for (i=0; i<theChart.getDatasetMeta(0).data.length; i++) {
                    const segment = theChart.getDatasetMeta(0).data[i];
                    segment._model.backgroundColor = segment._options.backgroundColor;
                }
                
                const activeSegment = theChart.getDatasetMeta(0).data[index];
                activeSegment._model.backgroundColor = activeSegment._options.backgroundColor;
                activeSegment._model.fontColor = activeSegment._options.fontColor;
                activeSegment._model.borderWidth = activeSegment._options.borderWidth; 
                theChart.tooltip._active = [];
                theChart.tooltip.update();
                theChart.draw();
            }
        },
        plugins: {
            datalabels: {
                    formatter: (value, ctx) => {
                        let sum = 0;
                        let dataArr = ctx.chart.data.datasets[0].data;
                        let label = ctx.chart.data.labels[ctx.dataIndex];
                        dataArr.map(data => {
                            sum += data;
                        });
                        let percentage = (value*100 / sum).toFixed(0);
                        if (percentage > 2) {
                            return label + ": " + percentage + "%";
                        } else {
                            return "";
                        }
                    },
                    color: '#fff',
            }
        }
    };
    theChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}
`).appendTo("head");

        window.addHook('portalDetailsUpdated', portalDetailsUpdated);
        window.addHook('portalAdded', addKeyToLayer);
        window.addHook('portalRemoved', removeKeyFromLayer);
        window.map.on('zoom', checkShowAllIcons);
        window.map.on('moveend', updateDistances);

        let chartJsUrlLabelPlugin = "https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@0.4.0/dist/chartjs-plugin-datalabels.min.js";
        loadScript(chartJsUrlLabelPlugin);
    }

    function delaySetup() {
        thisPlugin.layerGroup = new L.LayerGroup();
        window.addLayerGroup('Portal keys', thisPlugin.layerGroup, false);
        createIcons();

        setTimeout(setup, 1000); // delay setup and thus requesting data, or we might encounter a server error
    }

    delaySetup.info = plugin_info; //add the script info data to the function as a property

    if (window.iitcLoaded) {
        delaySetup();
    } else {
        if (!window.bootPlugins) {
            window.bootPlugins = [];
        }
        window.bootPlugins.push(delaySetup);
    }
}


(function () {
    const plugin_info = {};
    if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
        plugin_info.script = {
            version: GM_info.script.version,
            name: GM_info.script.name,
            description: GM_info.script.description
        };
    }
    // Greasemonkey. It will be quite hard to debug
    if (typeof unsafeWindow != 'undefined' || typeof GM_info == 'undefined' || GM_info.scriptHandler != 'Tampermonkey') {
        // inject code into site context
        const script = document.createElement('script');
        script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(plugin_info) + ');'));
        (document.body || document.head || document.documentElement).appendChild(script);
    } else {
        // Tampermonkey, run code directly
        wrapper(plugin_info);
    }
})();
 
