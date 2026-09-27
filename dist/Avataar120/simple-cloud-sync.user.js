// ==UserScript==
// @author          Avataar120
// @id              simple-cloud-sync@Avataar120
// @name            Simple Cloud Sync
// @category        Misc
// @version         1.2.0.20260927
// @description     Syncs the localStorage data of your IITC plugins (bookmarks, draw tools, settings…) across all your devices. Each agent has a private, password-protected space on the sync server, keyed by the logged-in agent name. Per-key merge, most recent change wins; the server is only contacted when something changed.
// @downloadURL     https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/Avataar120/simple-cloud-sync.user.js
// @updateURL       https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/Avataar120/simple-cloud-sync.meta.js
// @icon            https://raw.githubusercontent.com/Avataar120/IITC-Synchro/main/simplecloudsync-32.png
// @icon64          https://raw.githubusercontent.com/Avataar120/IITC-Synchro/main/simplecloudsync-64.png
// @supportURL      https://github.com/Avataar120/IITC-Synchro/issues
// @namespace       https://github.com/Avataar120/IITC-Synchro
// @issueTracker    https://github.com/Avataar120/IITC-Synchro/issues
// @homepageURL     https://github.com/Avataar120/IITC-Synchro/
// @antiFeatures    export
// @match           https://intel.ingress.com/*
// @include         https://intel.ingress.com/*
// @grant           none
// ==/UserScript==


function wrapper(plugin_info) {
  if (typeof window.plugin !== 'function') window.plugin = function () {};
  plugin_info.buildName = 'main';
  plugin_info.dateTimeVersion = '2026-09-27-154452';
  plugin_info.pluginId = 'simpleCloudSync';

  const changelog = [{
    version: '1.2.0',
    changes: [
      'NEW: Every text of the plugin is in English, and the toolbox link is now called "Cloud Sync".',
    ],
  }, {
    version: '1.1.1',
    changes: [
      'FIX: The sync server is protected against account takeover, password guessing and storage abuse.',
      'FIX: New agents need a password of at least 8 characters, and the password window says so.',
      'FIX: Too many failed attempts and data too large for the server are reported clearly.',
    ],
  }, {
    version: '1.1.0',
    changes: [
      'NEW: The plugin has its own logo: a phone and a computer screen linked by two-way arrows.',
    ],
  }, {
    version: '1.0.1',
    changes: [
      'FIX: Leftover entries from older sync versions are removed from each device and no longer synced.',
    ],
  }, {
    version: '1.0.0',
    changes: [
      'NEW: Own sync server instead of JSONBin.io: no more request quota.',
      'NEW: Multi-agent: each agent has a private space, keyed by the logged-in agent name and protected by a password chosen on first sync.',
      'NEW: Far fewer requests: local changes are detected without any network call, only changed keys are sent, and other devices are checked at most every 10 minutes while the tab is visible.',
      'NEW: Pending changes are sent when the page is hidden or closed.',
    ],
  }];

  window.plugin.simpleCloudSync = function () {};
  const self = window.plugin.simpleCloudSync;

  // ==================== CONFIGURATION ====================
  // Sync server URL, without trailing slash
  self.ENDPOINT = 'https://iitcsimplesync.avataar120.com';
  // Local change check (no network call when nothing changed)
  self.LOCAL_CHECK_MS = 30 * 1000;
  // Fetch changes made on other devices, only while the tab is visible
  self.REMOTE_PULL_MS = 10 * 60 * 1000;
  self.KEY_PREFIX = 'plugin-';
  // Set to true to show the status box on the map (mobile troubleshooting)
  self.DEBUG = false;
  // =======================================================================

  // Metadata: for each key, the last synced value and its timestamp.
  // Used to detect keys changed locally since the last sync,
  // without patching localStorage.setItem (unreliable in some environments).
  self.META_KEY = 'plugin-simpleCloudSync-meta';
  // Last server revision seen (outside KEY_PREFIX: never synced)
  self.STATE_KEY = 'simpleCloudSync-state';
  // Agent password on this server, stored on this device only (never synced)
  self.PASSWORD_KEY = 'simpleCloudSync-password';
  // Keys left by older versions of the sync: never synced, removed at startup
  self.OBSOLETE_KEYS = ['plugin-simpleCloudSync-ts', 'plugin-simpleCloudSync-tsmap', 'plugin-sync-data-uuid'];

  self.showStatus = function (msg) {
    console.log('[SimpleCloudSync] ' + msg);
    if (!self.DEBUG) return;
    try {
      let el = document.getElementById('simpleCloudSyncStatus');
      if (!el) {
        el = document.createElement('div');
        el.id = 'simpleCloudSyncStatus';
        el.style.cssText = [
          'position:fixed', 'bottom:6px', 'left:6px', 'z-index:99999',
          'background:rgba(0,0,0,0.85)', 'color:#ffce00', 'font-size:11px',
          'font-family:sans-serif', 'padding:4px 8px', 'border-radius:4px',
          'max-width:85vw', 'white-space:pre-wrap', 'pointer-events:none'
        ].join(';');
        (document.body || document.documentElement).appendChild(el);
      }
      const time = new Date().toLocaleTimeString();
      el.textContent = '[Sync ' + time + '] ' + msg;
    } catch (e) { /* ignore */ }
  };

  self.getMeta = function () {
    try { return JSON.parse(localStorage.getItem(self.META_KEY) || '{}'); } catch (e) { return {}; }
  };

  self.setMeta = function (meta) {
    localStorage.setItem(self.META_KEY, JSON.stringify(meta));
  };

  // Logged-in agent name: each agent has its own space on the server
  self.getUser = function () {
    return (window.PLAYER && window.PLAYER.nickname) || null;
  };

  self.getState = function () {
    try { return JSON.parse(localStorage.getItem(self.STATE_KEY) || '{}'); } catch (e) { return {}; }
  };

  // Keys to send: those changed since the last sync (fresh ts),
  // and, on first contact with this server, all the others (original ts).
  self.buildChangedEntries = function (meta, firstSync) {
    const entries = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || k.indexOf(self.KEY_PREFIX) !== 0 || k === self.META_KEY) continue;
      if (self.OBSOLETE_KEYS.indexOf(k) !== -1) continue;
      const value = localStorage.getItem(k);
      const prev = meta[k];
      if (!prev || prev.value !== value) {
        entries[k] = { value: value, ts: Date.now() };
      } else if (firstSync) {
        entries[k] = { value: value, ts: prev.ts || 0 };
      }
    }
    return entries;
  };

  self.getPassword = function () {
    return localStorage.getItem(self.PASSWORD_KEY) || '';
  };

  // The first device that syncs an agent chooses its password;
  // the agent's other devices must enter the same one.
  self.askPassword = function (error) {
    if (self.passwordDialogOpen) return;
    self.passwordDialogOpen = true;
    const html = $('<div>')
      .append($('<p>').text(
        'Sync password for agent ' + self.getUser() + '. ' +
        'On first use you choose it here; on your other devices, enter the same one.'
      ))
      .append(error ? $('<p style="color:#f66">').text(error) : '')
      .append('<input type="password" id="simpleCloudSyncPassword" style="width:95%" autocomplete="current-password">');
    window.dialog({
      html: html,
      title: 'Simple Cloud Sync',
      id: 'simpleCloudSyncPassword-dialog',
      buttons: {
        'OK': function () {
          const pw = $('#simpleCloudSyncPassword').val();
          if (!pw) return;
          localStorage.setItem(self.PASSWORD_KEY, pw);
          $(this).dialog('close');
          self.syncNow();
        }
      },
      closeCallback: function () { self.passwordDialogOpen = false; }
    });
  };

  self.lastSync = 0;

  self.syncNow = function (manual) {
    const user = self.getUser();
    if (!user) return self.showStatus('Unknown agent, cannot sync.');
    const password = self.getPassword();
    if (!password) {
      // Asked once per page load, then when the toolbox link is clicked
      if (manual || !self.passwordAsked) self.askPassword();
      self.passwordAsked = true;
      return;
    }
    if (self.busy) return;
    self.busy = true;
    self.lastSync = Date.now();
    self.showStatus('Syncing...');

    const meta = self.getMeta();
    const state = self.getState();
    const firstSync = state.endpoint !== self.ENDPOINT || state.user !== user;
    const sent = self.buildChangedEntries(meta, firstSync);

    fetch(self.ENDPOINT + '/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + password
      },
      body: JSON.stringify({ user: user, since: firstSync ? 0 : (state.rev || 0), entries: sent })
    })
      .then(function (r) {
        if (r.ok) return r.json();
        return r.json().catch(function () { return {}; }).then(function (err) {
          if (r.status === 401) {
            localStorage.removeItem(self.PASSWORD_KEY);
            self.askPassword('Wrong password for this agent.');
          } else if (r.status === 400 && err.error === 'weak password') {
            localStorage.removeItem(self.PASSWORD_KEY);
            self.askPassword('For a new agent, the password must be at least ' + err.min + ' characters long.');
          } else if (r.status === 429) {
            throw new Error('too many attempts, try again later');
          } else if (r.status === 413) {
            throw new Error('data too large for the server');
          }
          throw new Error('HTTP ' + r.status);
        });
      })
      .then(function (res) {
        Object.keys(sent).forEach(function (k) { meta[k] = sent[k]; });

        // The server returns the keys changed elsewhere, and the winning version
        // of sent keys that lost the merge.
        let appliedCount = 0;
        Object.keys(res.entries).forEach(function (k) {
          if (self.OBSOLETE_KEYS.indexOf(k) !== -1) return;
          const e = res.entries[k];
          if (localStorage.getItem(k) !== e.value) {
            localStorage.setItem(k, e.value);
            appliedCount++;
          }
          meta[k] = { value: e.value, ts: e.ts };
        });

        self.setMeta(meta);
        localStorage.setItem(self.STATE_KEY, JSON.stringify({ endpoint: self.ENDPOINT, user: user, rev: res.rev }));

        self.showStatus(
          'OK: ' + Object.keys(sent).length + ' key(s) sent, ' +
          appliedCount + ' received from the cloud.'
        );
        if (appliedCount > 0) {
          self.showStatus('Reload the page to apply everything.');
        }
      })
      .catch(function (err) {
        self.showStatus('Sync ERROR: ' + err.message);
      })
      .then(function () { self.busy = false; });
  };

  self.hasLocalChanges = function () {
    return Object.keys(self.buildChangedEntries(self.getMeta(), false)).length > 0;
  };

  // Called periodically: contacts the server only when there is something to
  // send, or when the last exchange is older than REMOTE_PULL_MS (tab visible).
  self.tick = function () {
    if (self.hasLocalChanges()) return self.syncNow();
    if (!document.hidden && Date.now() - self.lastSync >= self.REMOTE_PULL_MS) self.syncNow();
  };

  // Page hidden or closed: send pending changes without waiting for a reply
  // (text/plain => no CORS preflight).
  self.flushOnExit = function () {
    const user = self.getUser();
    const password = self.getPassword();
    const sent = self.buildChangedEntries(self.getMeta(), false);
    if (!user || !password || !Object.keys(sent).length || !navigator.sendBeacon) return;
    navigator.sendBeacon(self.ENDPOINT + '/sync', JSON.stringify({
      password: password, user: user, since: 0, entries: sent
    }));
  };

  self.removeObsoleteKeys = function () {
    const meta = self.getMeta();
    self.OBSOLETE_KEYS.forEach(function (k) {
      localStorage.removeItem(k);
      delete meta[k];
    });
    self.setMeta(meta);
  };

  const setup = function () {
    self.showStatus('Plugin loaded, starting...');
    self.removeObsoleteKeys();
    self.syncNow();
    setInterval(self.tick, self.LOCAL_CHECK_MS);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) self.flushOnExit();
      else if (Date.now() - self.lastSync >= 2 * 60 * 1000) self.syncNow();
    });
    window.addEventListener('pagehide', self.flushOnExit);

    try {
      $('#toolbox').append(
        '<a onclick="window.plugin.simpleCloudSync.syncNow(true); return false;" title="Sync with the cloud now">Cloud Sync</a>'
      );
    } catch (e) {
      self.showStatus('Could not add the toolbox link.');
    }
  };

  setup.info = plugin_info;
  setup.info.changelog = changelog;
  if (!window.bootPlugins) window.bootPlugins = [];
  window.bootPlugins.push(setup);
  if (window.iitcLoaded && typeof setup === 'function') setup();
}

// Direct execution (no <script> injection: not needed, and blocked on some mobile browsers)
var plugin_info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
  plugin_info.script = {
    version: GM_info.script.version,
    name: GM_info.script.name,
    description: GM_info.script.description
  };
}
wrapper(plugin_info);