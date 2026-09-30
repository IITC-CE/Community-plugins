// ==UserScript==
// @author          Avataar120
// @id              simple-cloud-sync@Avataar120
// @name            Simple Cloud Sync
// @category        Misc
// @version         2.2.0.20260929
// @description     Syncs the localStorage data of your IITC plugins (bookmarks, draw tools, settings…) across all your devices. Each agent has a private, password-protected, end-to-end encrypted space on the sync server, keyed by the logged-in agent name. Per-key merge, most recent change wins; the server is only contacted when something changed.
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
  plugin_info.dateTimeVersion = '2026-09-29-090000';
  plugin_info.pluginId = 'simpleCloudSync';

  const changelog = [{
    version: '2.2.0',
    changes: [
      'NEW: Drawn items and key counts synced from another device now show up instantly, without any page reload.',
    ],
  }, {
    version: '2.1.3',
    changes: [
      'FIX: No more need to reload twice to see data synced from another device -- the page now reloads itself once when needed, right after opening it.',
    ],
  }, {
    version: '2.1.2',
    changes: [
      'FIX: Local changes now reach the server almost immediately instead of within 30 seconds.',
      'FIX: Coming back to the tab always checks for changes made elsewhere, not just every 2 minutes.',
    ],
  }, {
    version: '2.1.1',
    changes: [
      'FIX: Changes made on another device now show up within 2 minutes instead of up to 10.',
    ],
  }, {
    version: '2.1.0',
    changes: [
      'NEW: After an admin resets your sync password, you must now choose a permanent one as soon as you reconnect with the temporary one.',
    ],
  }, {
    version: '2.0.0',
    changes: [
      'NEW: End-to-end encryption. Your synced data is now unreadable to the sync server and its administrator; only your password, entered on your own devices, can unlock it.',
      'NEW: Data from before this version is automatically re-encrypted the next time each of your devices syncs.',
    ],
  }, {
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
  // Local change check (a local-only scan; no network call when nothing
  // changed) -- kept short so a local edit reaches the server with no
  // perceptible delay.
  self.LOCAL_CHECK_MS = 2 * 1000;
  // Fetch changes made on other devices, only while the tab is visible
  self.REMOTE_PULL_MS = 2 * 60 * 1000;
  self.KEY_PREFIX = 'plugin-';
  // Set to true to show the status box on the map (mobile troubleshooting)
  self.DEBUG = false;
  // =======================================================================

  // Metadata: for each key, the last synced value (always in clear) and its
  // timestamp. Used to detect keys changed locally since the last sync,
  // without patching localStorage.setItem (unreliable in some environments).
  self.META_KEY = 'plugin-simpleCloudSync-meta';
  // Last server revision seen, and the wrapped data key last fetched from the
  // server (outside KEY_PREFIX: never synced).
  self.STATE_KEY = 'simpleCloudSync-state';
  // Agent password on this server, stored on this device only (never synced,
  // never sent as-is: only values derived from it ever go over the network).
  self.PASSWORD_KEY = 'simpleCloudSync-password';
  // Keys left by older versions of the sync: never synced, removed at startup
  self.OBSOLETE_KEYS = ['plugin-simpleCloudSync-ts', 'plugin-simpleCloudSync-tsmap', 'plugin-sync-data-uuid'];

  // Sync protocol version: the server rejects anything older, so a plugin
  // update is required after the server enforces end-to-end encryption.
  self.PROTOCOL_VERSION = 2;
  // Prefix marking a synced value as encrypted (see ENCRYPTION below); a value
  // without it is a leftover in clear from before this version.
  self.ENC_PREFIX = 'e1:';
  self.MIN_PASSWORD_LENGTH = 8;
  // PBKDF2 rounds used to turn the password into key material: kept high on
  // purpose (only run once per password entry, cached afterwards).
  self.PBKDF2_ITERATIONS = 600000;

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

  // Logged-in agent name: each agent has its own space on the server.
  // Lower-cased here, once, so it is byte-for-byte identical to what the
  // server uses (it always lower-cases the agent name it receives) -- the
  // name also salts the password derivation below, so any mismatch there
  // would silently derive the wrong key and never authenticate.
  self.getUser = function () {
    const nickname = window.PLAYER && window.PLAYER.nickname;
    return nickname ? nickname.toLowerCase() : null;
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
    const errorEl = $('<p style="color:#f66">').text(error || '').toggle(!!error);
    const html = $('<div>')
      .append($('<p>').text(
        'Sync password for agent ' + self.getUser() + '. On first use you choose it here ' +
        '(at least ' + self.MIN_PASSWORD_LENGTH + ' characters); on your other devices, enter the same one.'
      ))
      .append(errorEl)
      .append('<input type="password" id="simpleCloudSyncPassword" style="width:95%" autocomplete="current-password">');
    window.dialog({
      html: html,
      title: 'Simple Cloud Sync',
      id: 'simpleCloudSyncPassword-dialog',
      buttons: {
        'OK': function () {
          const pw = $('#simpleCloudSyncPassword').val();
          if (!pw) return;
          if (pw.length < self.MIN_PASSWORD_LENGTH) {
            errorEl.text('The password must be at least ' + self.MIN_PASSWORD_LENGTH + ' characters long.').show();
            return;
          }
          localStorage.setItem(self.PASSWORD_KEY, pw);
          self.keyState = null;
          $(this).dialog('close');
          self.syncNow();
        }
      },
      closeCallback: function () { self.passwordDialogOpen = false; }
    });
  };

  // ==================== ENCRYPTION ====================
  // Everything below runs only in the plugin: the server and its administrator
  // never see the password, the agent's data key or any decrypted value, only
  // opaque, fixed-size strings. See the plugin's changelog for the overview.
  //
  // - authKey: derived from the password, sent to the server instead of it to
  //   authenticate. The server hashes it exactly as it used to hash the raw
  //   password; nothing changes server-side.
  // - wrapKey: derived from the password, never leaves this function's scope.
  //   Only used to wrap/unwrap the agent's data key.
  // - dataKey: a random AES-256-GCM key, generated once per agent, that
  //   actually encrypts the synced values. Stored on the server only wrapped
  //   (encrypted) by wrapKey, under the name "wrappedKey", so that changing
  //   the password later only requires re-wrapping this small blob, not
  //   re-encrypting every value.

  const textEncoder = new TextEncoder();
  const textDecoder = new TextDecoder();

  self.b64Encode = function (bytes) {
    let bin = '';
    bytes.forEach(function (b) { bin += String.fromCharCode(b); });
    return btoa(bin);
  };

  self.b64Decode = function (str) {
    const bin = atob(str);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  };

  // From the human password: a master secret (slow, PBKDF2), then two
  // independent secrets derived from it (fast, HKDF): the auth token sent to
  // the server, and the AES-GCM key that wraps/unwraps the data key.
  self.deriveKeys = function (user, password) {
    return crypto.subtle.importKey('raw', textEncoder.encode(password), 'PBKDF2', false, ['deriveBits'])
      .then(function (passKey) {
        return crypto.subtle.deriveBits(
          { name: 'PBKDF2', salt: textEncoder.encode(user), iterations: self.PBKDF2_ITERATIONS, hash: 'SHA-256' },
          passKey, 256
        );
      })
      .then(function (masterBits) {
        return crypto.subtle.importKey('raw', masterBits, 'HKDF', false, ['deriveBits', 'deriveKey']);
      })
      .then(function (masterKey) {
        return Promise.all([
          crypto.subtle.deriveBits(
            { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: textEncoder.encode('scs-auth-v1') },
            masterKey, 256
          ),
          crypto.subtle.deriveKey(
            { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: textEncoder.encode('scs-wrap-v1') },
            masterKey, { name: 'AES-GCM', length: 256 }, false, ['wrapKey', 'unwrapKey']
          )
        ]);
      })
      .then(function (results) {
        const authBytes = new Uint8Array(results[0]);
        let authKey = '';
        authBytes.forEach(function (b) { authKey += b.toString(16).padStart(2, '0'); });
        return { authKey: authKey, wrapKey: results[1] };
      });
  };

  self.generateDataKey = function () {
    return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  };

  self.wrapDataKey = function (dataKey, wrapKey) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    return crypto.subtle.wrapKey('raw', dataKey, wrapKey, { name: 'AES-GCM', iv: iv }).then(function (wrapped) {
      const out = new Uint8Array(iv.length + wrapped.byteLength);
      out.set(iv, 0);
      out.set(new Uint8Array(wrapped), iv.length);
      return self.b64Encode(out);
    });
  };

  self.unwrapDataKey = function (wrappedB64, wrapKey) {
    const raw = self.b64Decode(wrappedB64);
    const iv = raw.slice(0, 12);
    const wrapped = raw.slice(12);
    return crypto.subtle.unwrapKey(
      'raw', wrapped, wrapKey, { name: 'AES-GCM', iv: iv }, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
    );
  };

  self.encryptValue = function (dataKey, plaintext) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    return crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, dataKey, textEncoder.encode(plaintext)).then(function (ct) {
      const out = new Uint8Array(iv.length + ct.byteLength);
      out.set(iv, 0);
      out.set(new Uint8Array(ct), iv.length);
      return self.ENC_PREFIX + self.b64Encode(out);
    });
  };

  // A value without the encrypted prefix is a leftover in clear from before
  // this version: used as-is (it gets re-encrypted on the next push).
  self.decryptValue = function (dataKey, stored) {
    if (typeof stored !== 'string' || stored.indexOf(self.ENC_PREFIX) !== 0) return Promise.resolve(stored);
    const raw = self.b64Decode(stored.slice(self.ENC_PREFIX.length));
    const iv = raw.slice(0, 12);
    const ct = raw.slice(12);
    return crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, dataKey, ct).then(function (pt) {
      return textDecoder.decode(pt);
    });
  };

  // ---- Data key lifecycle ----

  // { user, password, authKey, wrapKey, dataKey, wrappedKeyToSend, migrate }
  // Cached for the lifetime of the page: derived again only if the agent or
  // the password changes.
  self.keyState = null;

  self.cacheKeys = function (user, password, derived, dataKey, wrappedKeyToSend) {
    const keys = {
      user: user, password: password, authKey: derived.authKey, wrapKey: derived.wrapKey,
      dataKey: dataKey, wrappedKeyToSend: wrappedKeyToSend, migrate: !!wrappedKeyToSend
    };
    self.keyState = keys;
    return keys;
  };

  // Ensures a usable data key for (user, password): unwraps the one cached
  // locally from the last sync when possible (the common case, no extra
  // request); otherwise asks the server once for its current wrapped key
  // (new device, or password changed since the local cache was written).
  self.resolveKeys = function (user, password) {
    if (self.keyState && self.keyState.user === user && self.keyState.password === password) {
      return Promise.resolve(self.keyState);
    }
    return self.deriveKeys(user, password).then(function (derived) {
      const state = self.getState();
      const cached = (state.user === user && state.endpoint === self.ENDPOINT) ? state.wrappedKey : null;
      if (!cached) return self.probeAndResolve(user, password, derived);
      return self.unwrapDataKey(cached, derived.wrapKey).then(function (dataKey) {
        return self.cacheKeys(user, password, derived, dataKey, null);
      }, function () {
        // The cached wrapped key no longer unwraps with this password
        // (admin reset): fall back to asking the server directly.
        return self.probeAndResolve(user, password, derived);
      });
    });
  };

  // A request with no entries, just to learn the server's current wrapped
  // key (or find out the agent doesn't exist yet). Generates and offers a new
  // data key when none exists yet (new agent, or first sync after a reset).
  self.probeAndResolve = function (user, password, derived) {
    return fetch(self.ENDPOINT + '/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + derived.authKey },
      body: JSON.stringify({ v: self.PROTOCOL_VERSION, user: user, since: Number.MAX_SAFE_INTEGER, entries: {} })
    }).then(function (r) {
      // Agent not created yet: nothing to unwrap, we'll create it with our own key.
      if (r.status === 400) return { wrappedKey: null };
      return self.parseSyncResponse(r);
    }).then(function (res) {
      if (!res.wrappedKey) {
        return self.generateDataKey().then(function (dataKey) {
          return self.wrapDataKey(dataKey, derived.wrapKey).then(function (wrappedKeyToSend) {
            return self.cacheKeys(user, password, derived, dataKey, wrappedKeyToSend);
          });
        });
      }
      return self.unwrapDataKey(res.wrappedKey, derived.wrapKey).then(function (dataKey) {
        return self.cacheKeys(user, password, derived, dataKey, null);
      });
    });
  };

  self.parseSyncResponse = function (r) {
    if (r.ok) return r.json();
    return r.json().catch(function () { return {}; }).then(function (err) {
      if (r.status === 401) {
        localStorage.removeItem(self.PASSWORD_KEY);
        self.keyState = null;
        self.askPassword('Wrong password for this agent.');
      } else if (r.status === 426) {
        throw new Error('this device\'s plugin is out of date, please update it');
      } else if (r.status === 429) {
        throw new Error('too many attempts, try again later');
      } else if (r.status === 413) {
        throw new Error('data too large for the server');
      }
      throw new Error('HTTP ' + r.status);
    });
  };

  self.lastSync = 0;
  // Cleared after this page's first sync result is applied (see applySyncResult).
  self.initialSyncPending = true;

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

    self.resolveKeys(user, password)
      .then(function (keys) { return self.doSync(user, keys); })
      .catch(function (err) {
        self.showStatus('Sync ERROR: ' + err.message);
      })
      .then(function () { self.busy = false; });
  };

  // Builds the entries to send (encrypting them), posts them and applies the
  // server's response. `keys.migrate` means we just generated a data key that
  // still has to be adopted by the server: on that push, every current value
  // is resent (not only the locally changed ones) so nothing is left in clear
  // or under an abandoned key.
  self.doSync = function (user, keys, depth) {
    depth = depth || 0;
    const meta = self.getMeta();
    const state = self.getState();
    const firstSync = state.endpoint !== self.ENDPOINT || state.user !== user;
    // depth > 0: replaying after losing the data-key race (see below), always
    // as a full push, whether or not this device otherwise looks first-sync.
    const forceAll = firstSync || keys.migrate || depth > 0;
    const plainEntries = self.buildChangedEntries(meta, forceAll);

    // On a migration push, or when replaying after losing the data-key race
    // below, a resent value must beat whatever the server already has for
    // that key (an old unencrypted value, or one just written by the device
    // that won the race) even at an equal timestamp -- done by nudging ts
    // forward, without the server ever having to know a value is encrypted.
    if (keys.migrate || depth > 0) {
      Object.keys(plainEntries).forEach(function (k) {
        const minTs = ((meta[k] && meta[k].ts) || 0) + 1;
        if (plainEntries[k].ts < minTs) plainEntries[k].ts = Math.max(Date.now(), minTs);
      });
    }

    const keysToSend = Object.keys(plainEntries);
    return Promise.all(keysToSend.map(function (k) { return self.encryptValue(keys.dataKey, plainEntries[k].value); }))
      .then(function (encryptedValues) {
        const sentEntries = {};
        keysToSend.forEach(function (k, i) { sentEntries[k] = { value: encryptedValues[i], ts: plainEntries[k].ts }; });

        const body = { v: self.PROTOCOL_VERSION, user: user, since: forceAll ? 0 : (state.rev || 0), entries: sentEntries };
        if (keys.wrappedKeyToSend) body.wrappedKey = keys.wrappedKeyToSend;

        return fetch(self.ENDPOINT + '/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + keys.authKey },
          body: JSON.stringify(body)
        }).then(self.parseSyncResponse).then(function (res) {
          if (keys.wrappedKeyToSend && res.wrappedKey !== keys.wrappedKeyToSend) {
            // Another device set the data key first: what we just sent is
            // encrypted under a key we're abandoning, replay with the real one.
            if (depth >= 2) throw new Error('key conflict, try again');
            self.keyState = null;
            return self.resolveKeys(user, keys.password).then(function (freshKeys) {
              return self.doSync(user, freshKeys, depth + 1);
            });
          }
          return self.applySyncResult(keys, user, meta, plainEntries, res);
        });
      });
  };

  // Plugins that expose a public API to reload their own data from
  // localStorage: called right after new data is applied, instead of asking
  // for a full page reload. Each entry's `refresh` runs once, at most, per
  // sync, only if one of its keys actually changed. Add more entries here as
  // needed; an unmatched key still falls back to "reload the page".
  self.PLUGIN_REFRESH = [
    {
      // Draw Tools: reloads window.plugin.drawTools.KEY_STORAGE and redraws.
      match: function (k) { return k === 'plugin-draw-tools-layer'; },
      refresh: function () {
        if (window.plugin.drawTools) window.plugin.drawTools.clearAndDraw();
      }
    },
    {
      // Keys: reloads the key counts and tells the portal list/sidebar to
      // redraw them (the same sequence the plugin's own sync code runs for
      // a full update from another device).
      match: function (k) { return k.indexOf('plugin-keys-data') === 0; },
      refresh: function () {
        if (!window.plugin.keys) return;
        window.plugin.keys.loadKeys();
        window.plugin.keys.updateDisplayCount();
        window.runHooks('pluginKeysRefreshAll');
      }
    }
  ];

  // Best-effort: a missing plugin, an API that changed, or any other error
  // here must never break the sync itself -- worst case, the affected keys
  // just fall back to needing a manual reload.
  self.refreshChangedPlugins = function (changedKeys) {
    self.PLUGIN_REFRESH.forEach(function (entry) {
      if (!changedKeys.some(entry.match)) return;
      try {
        entry.refresh();
      } catch (e) {
        console.warn('[SimpleCloudSync] could not refresh a plugin in place: ' + e.message);
      }
    });
  };

  self.applySyncResult = function (keys, user, meta, sentPlain, res) {
    // Other IITC plugins read localStorage synchronously at their own boot,
    // before this plugin's network round trip can possibly have finished --
    // so on the page's very first sync, fresh data written here still shows
    // stale until the page reloads (self-triggered below). Only ever done
    // for this first sync: reloading mid-session would interrupt whatever
    // the agent is doing (an open dialog, an unsaved drawing...).
    const isInitialSync = self.initialSyncPending;
    self.initialSyncPending = false;

    // The data key (new or just-confirmed) is now adopted by the server:
    // later syncs this session go back to sending only what actually changed.
    keys.migrate = false;
    keys.wrappedKeyToSend = null;

    Object.keys(sentPlain).forEach(function (k) { meta[k] = sentPlain[k]; });

    // The server returns the keys changed elsewhere, and the winning version
    // of sent keys that lost the merge.
    const decryptKeys = Object.keys(res.entries);
    return Promise.all(decryptKeys.map(function (k) { return self.decryptValue(keys.dataKey, res.entries[k].value); }))
      .then(function (decryptedValues) {
        const appliedKeys = [];
        decryptKeys.forEach(function (k, i) {
          if (self.OBSOLETE_KEYS.indexOf(k) !== -1) return;
          const value = decryptedValues[i];
          if (localStorage.getItem(k) !== value) {
            localStorage.setItem(k, value);
            appliedKeys.push(k);
          }
          meta[k] = { value: value, ts: res.entries[k].ts };
        });

        self.setMeta(meta);
        localStorage.setItem(self.STATE_KEY, JSON.stringify({
          endpoint: self.ENDPOINT, user: user, rev: res.rev, wrappedKey: res.wrappedKey || null
        }));

        self.showStatus(
          'OK: ' + Object.keys(sentPlain).length + ' key(s) sent, ' +
          appliedKeys.length + ' received from the cloud.'
        );
        if (appliedKeys.length > 0) {
          if (isInitialSync) {
            self.showStatus('New data received, reloading the page...');
            location.reload();
            return;
          }
          self.refreshChangedPlugins(appliedKeys);
          const stillNeedsReload = appliedKeys.some(function (k) {
            return !self.PLUGIN_REFRESH.some(function (entry) { return entry.match(k); });
          });
          self.showStatus(stillNeedsReload ? 'Reload the page to apply everything.' : 'Applied automatically.');
        }

        // Set after an admin reset: the agent is in with the temporary
        // password, but must now pick a permanent one -- there is no
        // separate "change password" menu, this is the only way to set one.
        if (res.mustChangePassword) self.forceNewPassword(user, keys);
      });
  };

  // Mandatory after an admin reset (server sent mustChangePassword: true).
  // Re-shown on every sync until a new password is actually submitted.
  self.forceNewPassword = function (user, keys) {
    if (self.newPasswordDialogOpen) return;
    self.newPasswordDialogOpen = true;
    const errorEl = $('<p style="color:#f66">').text('');
    const html = $('<div>')
      .append($('<p>').text(
        'Your sync password for agent ' + user + ' was reset by an admin. ' +
        'Choose a new, permanent password now (at least ' + self.MIN_PASSWORD_LENGTH + ' characters).'
      ))
      .append(errorEl)
      .append('<input type="password" id="simpleCloudSyncNewPassword" style="width:95%" autocomplete="new-password">');
    window.dialog({
      html: html,
      title: 'Simple Cloud Sync - set a new password',
      id: 'simpleCloudSyncNewPassword-dialog',
      buttons: {
        'OK': function () {
          const pw = $('#simpleCloudSyncNewPassword').val();
          if (!pw || pw.length < self.MIN_PASSWORD_LENGTH) {
            errorEl.text('The password must be at least ' + self.MIN_PASSWORD_LENGTH + ' characters long.').show();
            return;
          }
          const dialogEl = this;
          self.submitNewPassword(user, keys, pw).then(function () {
            $(dialogEl).dialog('close');
          }, function (err) {
            errorEl.text('Error: ' + err.message).show();
          });
        }
      },
      closeCallback: function () { self.newPasswordDialogOpen = false; }
    });
  };

  // Re-wraps the (already unwrapped) data key with a key derived from the new
  // password, and asks the server to adopt both the new auth and the new
  // wrapped key together, still authenticated with the current (temporary)
  // one. No data is re-encrypted: the data key itself does not change.
  self.submitNewPassword = function (user, keys, newPassword) {
    return self.deriveKeys(user, newPassword).then(function (newDerived) {
      return self.wrapDataKey(keys.dataKey, newDerived.wrapKey).then(function (newWrappedKey) {
        const body = {
          v: self.PROTOCOL_VERSION, user: user, since: 0, entries: {},
          newAuth: { authKey: newDerived.authKey, wrappedKey: newWrappedKey }
        };
        return fetch(self.ENDPOINT + '/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + keys.authKey },
          body: JSON.stringify(body)
        }).then(self.parseSyncResponse).then(function (res) {
          localStorage.setItem(self.PASSWORD_KEY, newPassword);
          keys.password = newPassword;
          keys.authKey = newDerived.authKey;
          keys.wrapKey = newDerived.wrapKey;
          localStorage.setItem(self.STATE_KEY, JSON.stringify({
            endpoint: self.ENDPOINT, user: user, rev: res.rev, wrappedKey: res.wrappedKey || newWrappedKey
          }));
          self.showStatus('New sync password set.');
        });
      });
    });
  };

  self.hasLocalChanges = function () {
    return Object.keys(self.buildChangedEntries(self.getMeta(), false)).length > 0;
  };

  // Called periodically: contacts the server only when there is something to
  // send, or when the last exchange is older than REMOTE_PULL_MS (tab visible).
  self.tick = function () {
    self.prepareBeacon();
    if (self.hasLocalChanges()) return self.syncNow();
    if (!document.hidden && Date.now() - self.lastSync >= self.REMOTE_PULL_MS) self.syncNow();
  };

  // Encryption is asynchronous, but sendBeacon (used when the page is hidden
  // or closed) must fire synchronously. So the encrypted body is prepared
  // ahead of time, from tick() and opportunistically when the tab is hidden,
  // and flushOnExit only ever sends this cache. A change made in the last
  // second before closing can therefore be missed; it is picked up at the
  // next page load instead.
  self.pendingBeacon = null;

  self.prepareBeacon = function () {
    const user = self.getUser();
    const password = self.getPassword();
    if (!user || !password) { self.pendingBeacon = null; return Promise.resolve(); }
    const plainEntries = self.buildChangedEntries(self.getMeta(), false);
    if (!Object.keys(plainEntries).length) { self.pendingBeacon = null; return Promise.resolve(); }
    return self.resolveKeys(user, password).then(function (keys) {
      const keysToSend = Object.keys(plainEntries);
      return Promise.all(keysToSend.map(function (k) { return self.encryptValue(keys.dataKey, plainEntries[k].value); }))
        .then(function (encryptedValues) {
          const sentEntries = {};
          keysToSend.forEach(function (k, i) { sentEntries[k] = { value: encryptedValues[i], ts: plainEntries[k].ts }; });
          const body = { v: self.PROTOCOL_VERSION, password: keys.authKey, user: user, since: 0, entries: sentEntries };
          if (keys.wrappedKeyToSend) body.wrappedKey = keys.wrappedKeyToSend;
          self.pendingBeacon = JSON.stringify(body);
        });
    }).catch(function () { /* kept as null, retried on the next tick */ });
  };

  self.flushOnExit = function () {
    if (!self.pendingBeacon || !navigator.sendBeacon) return;
    navigator.sendBeacon(self.ENDPOINT + '/sync', self.pendingBeacon);
    self.pendingBeacon = null;
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
      if (document.hidden) {
        // Kicks off a fresh prepare too, in case the tab survives (still
        // backgrounded) long enough for it to finish before the actual close.
        self.prepareBeacon();
        self.flushOnExit();
      } else {
        // Always pull on regaining focus, not just every REMOTE_PULL_MS:
        // coming back to the tab is exactly when stale data is most visible.
        self.syncNow();
      }
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
