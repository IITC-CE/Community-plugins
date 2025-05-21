// ==UserScript==
// @author         BlancLapin
// @id             advanced_player_tracker@BlancLapin
// @name           Advanced Tracker Player
// @category       Misc
// @version        0.0.4
// @namespace      https://tempuri.org/iitc/advanced-player-tracker
// @description    Advanced version of Player Tracker
// @updateURL      https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/BlancLapin/advanced_player_tracker.meta.js
// @downloadURL    https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/BlancLapin/advanced_player_tracker.user.js
// @depends        player-activity-tracker@breunigs
// @include        http://www.ingress.com/intel*
// @include        https://www.ingress.com/intel*
// @include        http://intel.ingress.com/*
// @include        https:/intel.ingress.com/*
// @match          http://intel.ingress.com/*
// @match          https://intel.ingress.com/*
// @match          http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
    if (typeof window.plugin !== 'function') window.plugin = function () {};
    window.plugin.advancedPlayerTracker = function () {};

    window.plugin.advancedPlayerTracker.refreshInterval = 600000; // 10 minutes
    window.plugin.advancedPlayerTracker.LSPlayerListKey = 'IITCWatchPlayerList';
    window.plugin.advancedPlayerTracker.LSPlayerDataKey = 'IITCWatchPlayerData';

    window.plugin.advancedPlayerTracker.playerList = [];
    window.plugin.advancedPlayerTracker.visiblePlayers = [];
    window.plugin.advancedPlayerTracker.playerData = [];

    plugin_info.buildName = 'AdvancedPlayerTracker';
    plugin_info.dateTimeVersion = '20250521152000';
    plugin_info.pluginId = 'AdvancedPlayerTracker';

    window.plugin.advancedPlayerTracker.setupHook = function () {
        const playerListLocalStorage = localStorage.getItem(window.plugin.advancedPlayerTracker.LSPlayerListKey);
        if (playerListLocalStorage) {
            window.plugin.advancedPlayerTracker.playerList = JSON.parse(playerListLocalStorage)['WatchedPlayers'];
        }

        const playerDataLocalStorage = localStorage.getItem(window.plugin.advancedPlayerTracker.LSPlayerDataKey);
        if (playerDataLocalStorage) {
            window.plugin.advancedPlayerTracker.playerData = JSON.parse(playerDataLocalStorage);
        }

        window.setInterval(window.plugin.advancedPlayerTracker.refreshMap, window.plugin.advancedPlayerTracker.refreshInterval);
        window.plugin.advancedPlayerTracker.refreshMap();
    }

    window.plugin.advancedPlayerTracker.refreshMap = function () {
        console.log("Triggering map refresh");
        window.mapDataRequest.start();
    }

    window.plugin.advancedPlayerTracker.updatePlayerList = function (updatedPlayerList) {
        window.plugin.advancedPlayerTracker.playerList = updatedPlayerList.split('\n');
        localStorage.setItem(window.plugin.advancedPlayerTracker.LSPlayerListKey, JSON.stringify({
            WatchedPlayers: window.plugin.advancedPlayerTracker.playerList
        }));
    }

    window.plugin.advancedPlayerTracker.mapRefreshEnded = function () {
        console.log("Map refresh ended, checking for watched players...");

        window.plugin.advancedPlayerTracker.visiblePlayers = [];

        $.each(window.plugin.playerTracker.stored, function (agentName, playerData) {
            if (!playerData || !playerData.events || playerData.events.length === 0) return;

            console.log("Found agent:", agentName);
            window.plugin.advancedPlayerTracker.visiblePlayers.push(playerData);

            if (!window.plugin.advancedPlayerTracker.playerList.includes(agentName)) {
                console.log(agentName, "is not in watch list.");
                return;
            }

            $.each(playerData.events, function (i, event) {
                const alreadyLogged = window.plugin.advancedPlayerTracker.playerData.some(
                    e => e.Player === agentName && e.timestamp === event.time
                );

                if (!alreadyLogged) {
                    console.log("Logging:", agentName, event);
                    window.plugin.advancedPlayerTracker.playerData.push({
                        Player: agentName,
                        Team: playerData.team,
                        Lat: event.latlngs[0][0],
                        Long: event.latlngs[0][1],
                        PortalHit: event.name,
                        timestamp: event.time
                    });
                } else {
                    console.log("Skipping duplicate event for", agentName, "at", event.time);
                }
            });
        });

        localStorage.setItem(
            window.plugin.advancedPlayerTracker.LSPlayerDataKey,
            JSON.stringify(window.plugin.advancedPlayerTracker.playerData)
        );
    }

    window.plugin.advancedPlayerTracker.exportData = function () {
        const data = window.plugin.advancedPlayerTracker.playerData;
        console.log("Exporting", data.length, "rows");

        if (!data || data.length === 0) {
            alert("No player data available to export.");
            return;
        }

        let csvData = 'Player,Team,Latitude,Longitude,Portal Hit,Timestamp\n';
        $.each(data, function (key, value) {
            csvData += [
                value.Player,
                value.Team,
                value.Lat,
                value.Long,
                value.PortalHit,
                new Date(value.timestamp).toISOString().replace('T', ' ').split('.')[0]
            ].join(',') + '\n';
        });

        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = 'AdvancedPlayerTracker_Export.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    window.plugin.advancedPlayerTracker.showDialog = function () {
        const data = `
        <i>Watch List:</i><br>
        <form name='playerlist' action='#' method='post' target='_blank'>
            <div class="row">
                <div id='playerListArea' class="column" style="float:left;width:100%;box-sizing: border-box;padding-right: 5px;">
                    <textarea 
                        id='listPlayers'
                        rows='15'
                        placeholder='List of players you want to watch. One per line.'
                        style="width: 100%; white-space: nowrap;">${window.plugin.advancedPlayerTracker.playerList.join("\n")}</textarea>
                </div>
            </div>
        <button type="submit" form="maxfield" value="Save" onclick='window.plugin.advancedPlayerTracker.updatePlayerList(document.getElementById("listPlayers").value)'>Save Watch List</button>
        <button type="submit" form="maxfield" value="Export Data" onclick='window.plugin.advancedPlayerTracker.exportData()'>Export Tracking Data</button>
        <button type="button" onclick='window.plugin.advancedPlayerTracker.refreshMap()'>Refresh Now</button>
        </form>
        `;

        window.dialog({
            title: "Tracked Player List",
            html: data
        }).parent();
    }

    window.plugin.advancedPlayerTracker.setup = function () {
        if (window.plugin.playerTracker === undefined) {
            console.log("This plugin requires player tracker");
            return;
        }

        $('#toolbox').append(' <a onclick="window.plugin.advancedPlayerTracker.showDialog()">Advanced Player Tracker</a>');
        window.plugin.advancedPlayerTracker.setupHook();
        addHook('mapDataRefreshEnd', window.plugin.advancedPlayerTracker.mapRefreshEnded);
    };

    const setup = window.plugin.advancedPlayerTracker.setup;
    setup.info = plugin_info;

    if (!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    if (window.iitcLoaded && typeof setup === 'function') setup();
}

const script = document.createElement('script');
const info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
    info.script = {
        version: GM_info.script.version,
        name: GM_info.script.name,
        description: GM_info.script.description
    };
}
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ')'));
(document.body || document.head || document.documentElement).appendChild(script);