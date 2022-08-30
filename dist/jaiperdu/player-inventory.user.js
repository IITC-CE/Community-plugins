// 
// ==UserScript==
// @author         jaiperdu
// @name           Player Inventory
// @category       Info
// @version        0.3.6
// @description    View inventory and highlight portals with keys at any zoom. Can be used with the official plugins Keys and Keys on map to show the number of keys on the map.
// @id             player-inventory@jaiperdu
// @namespace      https://github.com/IITC-CE/ingress-intel-total-conversion
// @updateURL      https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/jaiperdu/player-inventory.meta.js
// @downloadURL    https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/jaiperdu/player-inventory.user.js
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {

// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

var css_248z = ".inventory-box .container {\n\twidth: max-content;\n}\n\n.inventory-box .ui-accordion-header {\n\tcolor: #ffce00;\n  background: rgba(0, 0, 0, 0.7);\n}\n\n.inventory-box .ui-accordion-header, .inventory-box .ui-accordion-content {\n\tborder: 1px solid rgba(255,255,255,.2);\n\tmargin-top: -1px;\n\tdisplay: block;\n  line-height: 1.4rem;\n}\n\n.inventory-box .ui-accordion-header:before {\n\tfont-size: 18px;\n\tmargin-right: 2px;\n\tcontent: \"⊞\";\n}\n\n.inventory-box .ui-accordion-header-active:before {\n\tcontent: \"⊟\";\n}\n\n.inventory-box table {\n\twidth: 100%;\n}\n\n.inventory-box table tr {\n  background: rgba(0, 0, 0, 0.6);\n}\n\n.inventory-box table tr:nth-child(2n + 1) {\n  background: rgba(0, 0, 0, 0.3);\n}\n\n.inventory-box tr td:first-child {\n  text-align: right;\n}\n\n.inventory-box .sum tr td:first-child {\n  text-align: left;\n  white-space: nowrap;\n  width: max-content;\n}\n\n.inventory-box tr td:nth-child(2) {\n  text-align: center;\n}\n\n.inventory-box tr td:last-child {\n  text-align: left;\n}\n\n.inventory-box tr td:last-child span:not(:last-child)::after {\n  content: ', ';\n}\n\n.inventory-box .all tr td:first-child,\n.inventory-box .keys tr td:first-child,\n.inventory-box .medias tr td:first-child,\n.inventory-box .capsule tr td:first-child {\n  width: 2em;\n}\n\n.inventory-box td {\n\tpadding-left: .3rem;\n\tpadding-right: .3rem;\n}\n\n.inventory-box .sum tr td span {\n    white-space: nowrap;\n}\n\n#dialog-inventory.inventory-box {\n  padding-right: 16px;\n}\n\n.inventory-box.mobile {\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n\toverflow: auto;\n\tpadding: 0;\n}\n.inventory-box.mobile .container {\n\twidth: unset;\n}\n\n.inventory-box.mobile button {\n\twidth: 100%;\n}\n\n.inventory-box .edit-name-icon {\n  margin-top: -18px;\n  position: absolute;\n  right: 20px;\n}\n\n.inventory-box .edit-name-input {\n  display: none;\n  width: 100%;\n}\n\n/* popup */\n.inventory-keys {\n  width: max-content;\n}\n\n#dialog-inventory-opt .container {\n  display: grid;\n  grid-template-columns: auto auto;\n  grid-gap: .5em\n}\n\n#dialog-inventory-opt button {\n  grid-column: 1/3;\n  padding: .3rem 1em;\n}\n\n#dialog-inventory-opt input {\n  margin-left: auto;\n  margin-top: auto;\n  margin-bottom: auto;\n}\n\n#dialog-inventory-names textarea.container {\n  width: 100%;\n  height: 100%;\n}\n\n#randdetails .inventory-details {\n  vertical-align: top;\n}\n";

const playerInventory = {};
window.plugin.playerInventory = playerInventory;

// stock intel
const itemTypes = {
  PORTAL_LINK_KEY: 'Portal Key',
  EMITTER_A: 'Resonator',
  EMP_BURSTER: 'Xmp Burster',
  ULTRA_STRIKE: 'Ultra Strike',
  FLIP_CARD: 'Alignment Virus',
  'FLIP_CARD:ADA': 'ADA Refactor',
  'FLIP_CARD:JARVIS': 'JARVIS Virus',
  POWER_CUBE: 'Power Cube',
  BOOSTED_POWER_CUBE: 'Hypercube',
  BOOSTED_POWER_CUBE_K: 'Hypercube',
  RES_SHIELD: 'Portal Shield',
  EXTRA_SHIELD: 'Aegis Shield',
  TURRET: 'Turret',
  FORCE_AMP: 'Force Amp',
  LINK_AMPLIFIER: 'Link Amp',
  ULTRA_LINK_AMP: 'Ultra Link',
  HEATSINK: 'Heat Sink',
  MULTIHACK: 'Multi-hack',
  TRANSMUTER_ATTACK: 'Ito En Transmuter (-)',
  TRANSMUTER_DEFENSE: 'Ito En Transmuter (+)',
  MEDIA: 'Media',
  CAPSULE: 'Capsule',
  INTEREST_CAPSULE: 'Quantum Capsule',
  KEY_CAPSULE: 'Key Capsule',
  KINETIC_CAPSULE: 'Kinetic Capsule',
  DRONE: 'Drone',
  MYSTERIOUS_ITEM_PLACEHOLDER: 'Mysterious item',
  PLAYER_POWERUP: 'Player Powerup',
  'PLAYER_POWERUP:APEX': 'Apex Mod',
  PORTAL_POWERUP: 'Portal Powerup',
  'PORTAL_POWERUP:FRACK': 'Portal Fracker',
  'PORTAL_POWERUP:NEMESIS': 'Beacon - Nemesis',
  'PORTAL_POWERUP:TOASTY': 'Beacon - Toast!',
  'PORTAL_POWERUP:EXO5': 'Beacon - EXO5',
  'PORTAL_POWERUP:MAGNUSRE': 'Beacon - Reawakens',
  'PORTAL_POWERUP:VIANOIR': 'Beacon - Via Noir',
  'PORTAL_POWERUP:VIALUX': 'Beacon - Via Lux',
  'PORTAL_POWERUP:INITIO': 'Beacon - Initio',
  'PORTAL_POWERUP:AEGISNOVA': 'Beacon - Aegis Nova',
  'PORTAL_POWERUP:OBSIDIAN': 'Beacon - Obsidian',
  'PORTAL_POWERUP:NIA': 'Beacon - Niantic',
  'PORTAL_POWERUP:ENL': 'Beacon - ENL',
  'PORTAL_POWERUP:RES': 'Beacon - RES',
  'PORTAL_POWERUP:MEET': 'Beacon - Meetup',
  'PORTAL_POWERUP:LOOK': 'Beacon - Target',
  'PORTAL_POWERUP:BB_BATTLE': 'Battle Beacon',
  'PORTAL_POWERUP:FW_ENL': 'Enlightened Fireworks',
  'PORTAL_POWERUP:FW_RES': 'Resistance Fireworks',
  'PORTAL_POWERUP:BN_BLM': 'Beacon - Black Lives Matter',
};

// missing strings from stock intel
itemTypes['PORTAL_POWERUP:BB_BATTLE_RARE'] = 'Rare Battle Beacon';

const dontCount = ['DRONE'];

function defaultTypeString(s) {
  if (!(s in itemTypes)) itemTypes[s] = s;
}

const levelItemTypes = ['EMITTER_A', 'EMP_BURSTER', 'POWER_CUBE', 'ULTRA_STRIKE', 'MEDIA'];

const rarity = ['VERY_COMMON', 'COMMON', 'LESS_COMMON', 'RARE', 'VERY_RARE', 'EXTREMELY_RARE'];

class Inventory {
  constructor(name) {
    this.name = name;
    this.keys = new Map(); // guid => {counts: caps => count}
    this.medias = new Map();
    this.clear();
  }

  clearItem(type) {
    defaultTypeString(type);
    this.items[type] = {
      type: type,
      name: itemTypes[type],
      leveled: levelItemTypes.includes(type),
      counts: {},
      total: 0,
    };
  }

  clear() {
    this.keys.clear();
    this.medias.clear();
    this.capsules = {};
    this.items = {};
    for (const type in itemTypes) {
      this.clearItem(type);
    }
    this.count = 0;
    this.keyLockersCount = 0;
  }

  getItem(type) {
    if (!(type in this.items)) this.clearItem(type);
    return this.items[type];
  }

  addCapsule(capsule) {
    const data = {
      name: capsule.name,
      size: capsule.size,
      type: capsule.type,
      keys: {},
      medias: {},
      items: {},
    };
    this.capsules[capsule.name] = data;

    if (capsule.type === 'KEY_CAPSULE') this.keyLockersCount += capsule.size;

    this.addItem(capsule);
    for (const item of capsule.content) {
      this.addItem(item);
      if (item.type === 'PORTAL_LINK_KEY') data.keys[item.guid] = item;
      else if (item.type === 'MEDIA') data.medias[item.mediaId] = item;
      else {
        if (!data.items[item.type]) data.items[item.type] = { repr: item, leveled: levelItemTypes.includes(item.type), count: {}, type: item.type };
        data.items[item.type].count[item.rarity || item.level] = item.count;
      }
    }
  }

  addItem(item) {
    const cat = this.getItem(item.type);
    const lr = cat.leveled ? item.level : item.rarity;
    if (!cat.counts[lr]) cat.counts[lr] = {};
    const count = cat.counts[lr];
    if (!item.capsule) item.capsule = this.name;
    if (!item.count) item.count = 1;
    count[item.capsule] = (count[item.capsule] || 0) + item.count;
    count.total = (count.total || 0) + item.count;
    cat.total += item.count;

    if (!dontCount.includes(item.type)) this.count += item.count;

    if (item.type === 'PORTAL_LINK_KEY') {
      this.addKey(item);
    } else if (item.type === 'MEDIA') {
      this.addMedia(item);
    }
  }

  countType(type, levelRarity) {
    const cat = this.getItem(type);
    if (levelRarity !== undefined) {
      return cat.counts[levelRarity] ? cat.counts[levelRarity].total : 0;
    }
    return cat.total;
  }

  addMedia(media) {
    if (!this.medias.has(media.mediaId))
      this.medias.set(media.mediaId, {
        mediaId: media.mediaId,
        name: media.name,
        url: media.url,
        count: new Map(),
        total: 0,
      });
    const current = this.medias.get(media.mediaId);
    const entry = current.count.get(media.capsule) || 0;
    current.count.set(media.capsule, entry + (media.count || 1));
    current.total += media.count || 1;
  }

  countKey(guid) {
    if (!this.keys.has(guid)) return 0;
    return this.keys.get(guid).total;
  }

  addKey(key) {
    if (!this.keys.has(key.guid))
      this.keys.set(key.guid, {
        guid: key.guid,
        title: key.title,
        latLng: key.latLng,
        address: key.address,
        count: new Map(),
        total: 0,
      });
    const current = this.keys.get(key.guid);
    const entry = current.count.get(key.capsule) || 0;
    current.count.set(key.capsule, entry + (key.count || 1));
    current.total += key.count || 1;
  }

  onHand() {
    const data = {
      name: this.name,
      size: 0,
      keys: {},
      medias: {},
      items: {},
    };

    for (const key of this.keys.values()) {
      const count = key.count.get(this.name);
      if (count) {
        data.keys[key.guid] = {
          guid: key.guid,
          title: key.title,
          latLng: key.latLng,
          address: key.address,
          count: key.count.get(this.name),
        };
        data.size += count;
      }
    }

    for (const type in itemTypes) {
      if (type === 'PORTAL_LINK_KEY') continue;
      const item = this.getItem(type);
      for (const k in item.counts) {
        const count = item.counts[k][this.name];
        if (count) {
          if (!data.items[type])
            data.items[type] = {
              type: type,
              leveled: levelItemTypes.includes(type),
              count: {},
            };
          data.items[type].count[k] = count;
          data.size += count;
        }
      }
    }
    return data;
  }
}

function parsePortalLocation(location) {
  return location.split(',').map((a) => (Number.parseInt(a, 16) & -1) * 1e-6);
}

/*
{
  "modResource": {
    "displayName": "SoftBank Ultra Link",
    "stats": {
      "LINK_RANGE_MULTIPLIER": "5000",
      "LINK_DEFENSE_BOOST": "1500",
      "OUTGOING_LINKS_BONUS": "8",
      "REMOVAL_STICKINESS": "150000",
      ...

      "BURNOUT_INSULATION": "4",
      "HACK_SPEED": "200000",
      "ATTACK_FREQUENCY": "1500",
      "HIT_BONUS": "200000",
      "REMOVAL_STICKINESS": "200000",
      "XM_SPIN": "-1"
    },
    "rarity": "VERY_RARE",
    "resourceType": "ULTRA_LINK_AMP"
  }
}
*/
function parseMod(mod) {
  return {
    type: mod.modResource.resourceType,
    name: mod.modResource.displayName,
    rarity: mod.modResource.rarity,
  };
}

/*
{
  "resourceWithLevels": {
    "resourceType": "MEDIA",
    "level": 1
  },
  "imageByUrl": {
    "imageUrl": "http://lh3.googleusercontent.com/l62x6RqXSc0JZESahVtmbUOdLFDPAwVUaxx9kfOkAu98HA7bnU0mOftOV10qzgd_tO7dA_chiZHmG8YxfN0F"
  },
  "inInventory": {
    "playerId": "redacted",
    "acquisitionTimestampMs": "redacted"
  },
  "displayName": {
    "displayName": "Media"
  },
  "storyItem": {
    "primaryUrl": "https://youtu.be/4MyMpzkcYmk",
    "shortDescription": "UmbraDefeat",
    "mediaId": "4176",
    "hasBeenViewed": false,
    "releaseDate": "1571122800000"
  }
*/
function parseMedia(data, media) {
  data.mediaId = media.storyItem.mediaId;
  data.name = media.storyItem.shortDescription;
  data.url = media.storyItem.primaryUrl;
  return data;
}

/*
  {
    "resourceWithLevels": {
      "resourceType": "EMITTER_A",
      "level": 7
    }
  }
*/
function parseLevelItem(obj) {
  const data = {
    type: obj.resourceWithLevels.resourceType,
    level: obj.resourceWithLevels.level,
  };
  if (obj.storyItem) return parseMedia(data, obj);
  return data;
}

/*
{
  "resource": {
    "resourceType": "PORTAL_LINK_KEY",
    "resourceRarity": "VERY_COMMON"
  },
  "portalCoupler": {
    "portalGuid": "...",
    "portalLocation": "int32 hex,int32 hex",
    "portalImageUrl": "...",
    "portalTitle": "...",
    "portalAddress": "..."
  },
  "inInventory": {
    "playerId": "...",
    "acquisitionTimestampMs": "..."
  }
}
*/
function parsePortalKey(data, key) {
  data.guid = key.portalCoupler.portalGuid;
  data.title = key.portalCoupler.portalTitle;
  data.latLng = parsePortalLocation(key.portalCoupler.portalLocation);
  data.address = key.portalCoupler.portalAddress;
  return data;
}

/*
{
  "resource": {
    "resourceType": "FLIP_CARD",
    "resourceRarity": "VERY_RARE"
  },
  "flipCard": {
    "flipCardType": "JARVIS"
  }
}
*/
function parseFlipCard(data, flipcard) {
  data.type += ':' + flipcard.flipCard.flipCardType;
  return data;
}

/*
{
  "resource": {
    "resourceType": "PLAYER_POWERUP",
    "resourceRarity": "VERY_RARE"
  },
  "inInventory": {
    "playerId": "...",
    "acquisitionTimestampMs": "..."
  },
  "playerPowerupResource": {
    "playerPowerupEnum": "APEX"
  }
}
*/
function parsePlayerPowerUp(data, powerup) {
  data.type += ':' + powerup.playerPowerupResource.playerPowerupEnum;
  return data;
}

/*
{
  "resource": {
    "resourceType": "PORTAL_POWERUP",
    "resourceRarity": "VERY_RARE"
  },
  "timedPowerupResource": {
    "multiplier": 0,
    "designation": "NIA",
    "multiplierE6": 1000000
  }
}
*/
function parsePortalPowerUp(data, powerup) {
  data.type += ':' + powerup.timedPowerupResource.designation;
  return data;
}
/*
{
  "resource": {
    "resourceType": "INTEREST_CAPSULE",
    "resourceRarity": "VERY_RARE"
  },
  "moniker": {
    "differentiator": "12345678"
  },
  "container": {
    "currentCapacity": 100,
    "currentCount": 0,
    "stackableItems": [
      {
        "itemGuids": [...],
        "exampleGameEntity": ["...", 0, {
          <ITEMDATA>,
          "displayName": {
            "displayName": "Portal Shield",
            "displayDescription": "Mod which shields Portal from attacks."
          }
        }]
      },
    ]
  }
}
*/
function parseContainer(data, container) {
  data.name = container.moniker.differentiator;
  data.size = container.container.currentCount;
  data.content = [];
  for (const stackableItem of container.container.stackableItems) {
    const item = parseItem(stackableItem.exampleGameEntity);
    if (item) {
      item.count = stackableItem.itemGuids.length;
      item.capsule = data.name;
      data.content.push(item);
    }
  }
  return data;
}

function parseResource(obj) {
  const data = {
    type: obj.resource.resourceType,
    rarity: obj.resource.resourceRarity,
  };
  if (obj.flipCard) return parseFlipCard(data, obj);
  if (obj.container) return parseContainer(data, obj);
  if (obj.portalCoupler) return parsePortalKey(data, obj);
  if (obj.timedPowerupResource) return parsePortalPowerUp(data, obj);
  if (obj.playerPowerupResource) return parsePlayerPowerUp(data, obj);
  return data;
}
/*
[
  guid, timestamp?, item object
]
*/
function parseItem(item) {
  const obj = item[2];
  if (obj.resource) return parseResource(obj);
  if (obj.resourceWithLevels) return parseLevelItem(obj);
  if (obj.modResource) return parseMod(obj);
  // xxx: other types
}

function parseInventory(name, data) {
  const inventory = new Inventory(name);
  for (const entry of data) {
    const item = parseItem(entry);
    if (item) {
      if (item.type.includes('CAPSULE')) inventory.addCapsule(item);
      else inventory.addItem(item);
    }
  }
  return inventory;
}

const STORE_KEY = 'plugin-player-inventory';
const SETTINGS_KEY = 'plugin-player-inventory-settings';

function openIndexedDB() {
  const rq = window.indexedDB.open('player-inventory', 1);
  rq.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore('inventory', { autoIncrement: true });
  };
  return rq;
}

/**
 *
 * @returns {Promise<{ date: string, raw: any }} Returns last saved inventory raw data
 */
function loadLastInventory() {
  return new Promise(loadFromIndexedDB);
}

function loadFromIndexedDB(resolve, reject) {
  if (!window.indexedDB) return loadFromLocalStorage(resolve, reject);
  const rq = openIndexedDB();
  rq.onerror = function () {
    loadFromLocalStorage(resolve, reject);
  };
  rq.onsuccess = function (event) {
    const db = event.target.result;
    const tx = db.transaction(['inventory'], 'readonly');
    const store = tx.objectStore('inventory');
    const rq = store.getAll();
    rq.onsuccess = function (event) {
      const r = event.target.result;
      if (r.length > 0) {
        const data = r[r.length - 1];
        resolve(data);
      } else {
        loadFromLocalStorage(resolve, reject);
      }
    };
    rq.onerror = function () {
      loadFromLocalStorage(resolve, reject);
    };
    db.close();
  };
}

function loadFromLocalStorage(resolve, reject) {
  const store = localStorage[STORE_KEY];
  if (store) {
    try {
      const data = JSON.parse(store);
      resolve(data);
    } catch (e) {
      console.log(e);
    }
  }
  reject('no inventory found');
}

function saveInventory(data) {
  return storeToIndexedDB(data);
}

function storeToIndexedDB(data) {
  if (!window.indexedDB) return storeToLocalStorage(data);
  const rq = openIndexedDB();
  rq.onerror = function () {
    storeToLocalStorage(data);
  };
  rq.onsuccess = function (event) {
    const db = event.target.result;
    const tx = db.transaction(['inventory'], 'readwrite');
    const store = tx.objectStore('inventory');
    store.clear().onsuccess = function () {
      store.add({
        raw: data,
        date: Date.now(),
      });
    };
    tx.oncomplete = function () {
      delete localStorage[STORE_KEY];
    };
    tx.onerror = function () {
      storeToLocalStorage(data);
    };
    db.close();
  };
}

function storeToLocalStorage(data) {
  const store = {
    raw: data,
    date: Date.now(),
  };
  localStorage[STORE_KEY] = JSON.stringify(store);
}

function loadSettings() {
  const settings = localStorage[SETTINGS_KEY];
  if (settings) {
    try {
      const data = JSON.parse(settings);
      return data;
    } catch (e) {
      console.log(e);
    }
  }
  return {};
}

function storeSettings(settings) {
  localStorage[SETTINGS_KEY] = JSON.stringify(settings);
}

function postAjax(action, data) {
  return new Promise(function (resolve, reject) {
    return window.postAjax(
      action,
      data,
      (ret) => resolve(ret),
      (_, textStatus, errorThrown) => reject(textStatus + ': ' + errorThrown)
    );
  });
}

function getSubscriptionStatus() {
  return postAjax('getHasActiveSubscription');
}

/**
 * @returns {{ result: any[] }}
 */
function getInventory() {
  return postAjax('getInventory', { lastQueryTimestamp: 0 });
}

function requestInventory() {
  return getSubscriptionStatus()
    .then((data) => {
      if (data.result) return getInventory();
      return Promise.reject('no core');
    })
    .then((data) => data.result);
}

function injectKeys(data) {
  if (!playerInventory.isHighlighActive) return;

  const bounds = window.map.getBounds();
  const entities = [];
  for (const [guid, key] of playerInventory.inventory.keys) {
    if (bounds.contains(key.latLng)) {
      // keep known team
      const team = window.portals[guid] ? window.portals[guid].options.ent[2][1] : 'N';
      const ent = [guid, 0, ['p', team, Math.round(key.latLng[0] * 1e6), Math.round(key.latLng[1] * 1e6)]];
      entities.push(ent);
    }
  }
  data.callback(entities);
}

function portalKeyHighlight(data) {
  const guid = data.portal.options.guid;
  if (playerInventory.inventory.keys.has(guid)) {
    // place holder
    if (data.portal.options.team !== window.TEAM_NONE && data.portal.options.level === 0) {
      data.portal.setStyle({
        color: 'red',
        weight: 2 * Math.sqrt(window.portalMarkerScale()),
        dashArray: '',
      });
    } else if (window.map.getZoom() < 15 && data.portal.options.team === window.TEAM_NONE && !window.portalDetail.isFresh(guid))
      // injected without intel data
      data.portal.setStyle({ color: 'red', fillColor: 'gray' });
    else data.portal.setStyle({ color: 'red' });
  }
}

function createPopup(guid) {
  const portal = window.portals[guid];
  const latLng = portal.getLatLng();
  // create popup only if the portal is in view
  if (window.map.getBounds().contains(latLng)) {
    const count = playerInventory.inventory.keys.get(guid).count;
    const text = Array.from(count)
      .map(([name, count]) => `<strong>${name}</strong>: ${count}`)
      .join('<br/>');

    L.popup()
      .setLatLng(latLng)
      .setContent('<div class="inventory-keys">' + text + '</div>')
      .openOn(window.map);
  }
}

function Fragment(attrs) {
  const fragment = document.createDocumentFragment();
  recursiveAppend(fragment, attrs.children);
  return fragment;
}

function recursiveAppend(element, children) {
  // cast to string to display "undefined" or "null"
  if (children === undefined || children === null) return;
  if (Array.isArray(children)) {
    for (const child of children) recursiveAppend(element, child);
  } else {
    element.append(children);
  }
}

function jsx(tagName, attrs) {
  if (typeof tagName === 'function') return tagName(attrs);
  const children = attrs.children;
  delete attrs.children;
  const rawHtml = attrs.rawHtml;
  delete attrs.rawHtml;
  const elem = document.createElement(tagName);
  // dataset
  if (attrs.dataset) {
    for (const key in attrs.dataset) elem.dataset[key] = attrs.dataset[key];
    delete attrs.dataset;
  }
  // events
  for (const key in attrs) {
    if (key.startsWith('on')) {
      elem.addEventListener(key.slice(2), attrs[key]);
      delete attrs[key];
    }
  }
  Object.assign(elem, attrs);
  if (rawHtml) {
    elem.innerHTML = rawHtml;
    return elem;
  }
  recursiveAppend(elem, children);
  return elem;
}

const jsxs = jsx;

const rarityShort = rarity.map(v => v.split('_').map(a => a[0]).join(''));
const rarityToInt = {};

for (const i in rarity) rarityToInt[rarity[i]] = i; // again...


function getPortalLink(key) {
  const latLng = [key.latLng[0].toFixed(6), key.latLng[1].toFixed(6)];
  return jsx("a", {
    title: key.address,
    href: window.makePermalink(latLng),
    onclick: function (event) {
      event.preventDefault();
      window.renderPortalDetails(key.guid);
      window.selectPortalByLatLng(latLng);
    },
    ondblclick: function (event) {
      event.preventDefault();
      window.renderPortalDetails(key.guid);
      window.zoomToAndShowPortal(key.guid, latLng);
    },
    children: key.title
  });
}

function localeCompare(a, b) {
  if (typeof a !== 'string') a = '';
  if (typeof b !== 'string') b = '';
  return a.localeCompare(b);
} // eslint-disable-next-line no-unused-vars


function ItemRow(props) {
  const {
    item,
    lvl,
    count
  } = props;
  const lr = item.leveled ? 'L' + lvl : rarityShort[rarityToInt[lvl]];
  const className = (item.leveled ? 'level_' : 'rarity_') + lr;
  const name = itemTypes[item.type];
  return jsxs("tr", {
    className: className,
    children: [jsx("td", {
      children: count
    }), jsx("td", {
      children: lr
    }), jsx("td", {
      children: name
    })]
  });
}

function createAllTable(inventory) {
  const table = jsx("table", {});

  for (const type in inventory.items) {
    const total = inventory.countType(type);
    if (total === 0) continue;
    const item = inventory.items[type];

    for (const i in item.counts) {
      const num = inventory.countType(type, i);

      if (num > 0) {
        table.append(jsx(ItemRow, {
          item: item,
          count: num,
          lvl: i
        }));
      }
    }
  }

  return table;
}

function keysSum(inventory) {
  const total = inventory.items['PORTAL_LINK_KEY'].total;
  const inventoryCount = inventory.items['PORTAL_LINK_KEY'].counts['VERY_COMMON'][inventory.name] || 0;
  const otherCount = total - inventoryCount - inventory.keyLockersCount;
  return jsxs(Fragment, {
    children: [jsxs("span", {
      children: [inventory.name, ": ", inventoryCount]
    }), jsxs("span", {
      children: ["Key Lockers: ", inventory.keyLockersCount]
    }), jsxs("span", {
      children: ["Other: ", otherCount]
    })]
  });
}

function itemSum(item) {
  return Object.keys(item.counts).map(k => {
    const lr = item.leveled ? 'L' + k : rarityShort[rarityToInt[k]];
    return jsxs("span", {
      className: (item.leveled ? 'level_' : 'rarity_') + lr,
      children: [item.counts[k].total, " ", lr]
    });
  });
}

function createAllSumTable(inventory) {
  const table = jsx("table", {});

  for (const type in inventory.items) {
    const total = inventory.countType(type);
    if (total === 0) continue;
    const item = inventory.items[type];
    table.append(jsxs("tr", {
      children: [jsx("td", {
        children: item.name
      }), jsx("td", {
        children: total
      }), type === 'PORTAL_LINK_KEY' ? jsx("td", {
        className: "level_L1",
        children: keysSum(inventory)
      }) : jsx("td", {
        children: itemSum(item)
      })]
    }));
  }

  return table;
} // eslint-disable-next-line no-unused-vars


function KeyMediaRow(props) {
  const {
    item,
    children
  } = props;
  const details = Array.from(item.count).map(([name, count]) => `${name}: ${count}`).join(', ');
  return jsxs("tr", {
    children: [jsx("td", {
      children: jsx("a", {
        title: details,
        children: item.total
      })
    }), jsx("td", {
      children: children
    })]
  });
}

function createKeysTable(inventory) {
  const keys = [...inventory.keys.values()].sort((a, b) => localeCompare(a.title, b.title));
  return jsx("table", {
    children: keys.map(key => jsx(KeyMediaRow, {
      item: key,
      children: getPortalLink(key)
    }))
  });
}

function createMediaTable(inventory) {
  const medias = [...inventory.medias.values()].sort((a, b) => localeCompare(a.name, b.name));
  return jsx("table", {
    children: medias.map(media => jsx(KeyMediaRow, {
      item: media,
      children: jsx("a", {
        href: media.url,
        children: media.name
      })
    }))
  });
}

function createCapsuleTable(inventory, capsule) {
  const table = jsx("table", {});

  const keys = Object.values(capsule.keys).sort((a, b) => localeCompare(a.title, b.title));

  for (const item of keys) {
    table.append(jsxs("tr", {
      children: [jsx("td", {
        children: item.count
      }), capsule.type !== 'KEY_CAPSULE' ? jsx("td", {}) : null, jsx("td", {
        children: getPortalLink(item)
      })]
    }));
  }

  const medias = Object.values(capsule.medias).sort((a, b) => localeCompare(a.name, b.name));

  for (const item of medias) {
    table.append(jsxs("tr", {
      className: "level_L1",
      children: [jsx("td", {
        children: item.count
      }), jsx("td", {
        children: "M"
      }), jsx("td", {
        children: jsx("a", {
          href: item.url,
          children: item.name
        })
      })]
    }));
  }

  for (const type in itemTypes) {
    const item = capsule.items[type];
    if (!item) continue;

    for (const i in item.count) {
      table.append(jsx(ItemRow, {
        count: item.count[i],
        item: item,
        lvl: i
      }));
    }
  }

  return table;
}

function buildInventoryHTML(inventory) {
  const inventoryCount = inventory.count - inventory.keyLockersCount;
  const keyInInventory = inventory.keys.size > 0 ? inventory.items['PORTAL_LINK_KEY'].counts['VERY_COMMON'][inventory.name] || 0 : 0;

  const container = jsxs("div", {
    className: "container",
    children: [jsx("b", {
      children: `Summary I:${inventoryCount - keyInInventory} K:${keyInInventory} T:${inventoryCount}/2500 KL:${inventory.keyLockersCount}`
    }), jsx("div", {
      className: "sum",
      children: createAllSumTable(inventory)
    }), jsx("b", {
      children: "Details"
    }), jsx("div", {
      className: "all",
      children: createAllTable(inventory)
    })]
  });

  if (inventory.keys.size > 0) {
    container.append(jsxs(Fragment, {
      children: [jsx("b", {
        children: "Keys"
      }), jsx("div", {
        className: "medias",
        children: createKeysTable(inventory)
      })]
    }));
  }

  if (inventory.medias.size > 0) {
    container.append(jsxs(Fragment, {
      children: [jsx("b", {
        children: "Medias"
      }), jsx("div", {
        className: "all",
        children: createMediaTable(inventory)
      })]
    }));
  }

  const onHand = inventory.onHand();
  container.append(jsxs(Fragment, {
    children: [jsxs("b", {
      children: ["On Hand (", onHand.size, ")"]
    }), jsx("div", {
      className: "capsule",
      children: createCapsuleTable(inventory, onHand)
    })]
  }));
  const mapping = playerInventory.settings.capsuleNameMap;
  const capsulesName = Object.keys(inventory.capsules).sort((a, b) => {
    if (mapping[a] && !mapping[b]) return -1;
    if (!mapping[a] && mapping[b]) return 1;
    a = mapping[a] || a;
    b = mapping[b] || b;
    return localeCompare(a, b);
  });
  const keyLockers = capsulesName.filter(name => inventory.capsules[name].type === 'KEY_CAPSULE');
  const quantums = capsulesName.filter(name => inventory.capsules[name].type === 'INTEREST_CAPSULE');
  const commonCapsules = capsulesName.filter(name => inventory.capsules[name].type === 'CAPSULE');

  for (const names of [keyLockers, quantums, commonCapsules]) {
    for (const name of names) {
      const capsule = inventory.capsules[name];

      if (capsule.size > 0) {
        const displayName = mapping[name] ? `${mapping[name]} [${name}]` : name;
        const typeName = itemTypes[capsule.type];
        const size = capsule.size;

        const head = jsx("b", {
          children: `${typeName}: ${displayName} (${size})`
        });

        container.append(jsxs(Fragment, {
          children: [head, jsxs("div", {
            className: "capsule",
            children: [jsxs("div", {
              children: [jsx("a", {
                className: "edit-name-icon",
                title: "Change capsule name",
                onclick: ev => {
                  const input = ev.target.nextElementSibling;
                  input.style.display = input.style.display === 'unset' ? null : 'unset';
                },
                children: "\u270F\uFE0F"
              }), jsx("input", {
                className: "edit-name-input",
                value: mapping[name] || '',
                placeholder: "Enter capsule name",
                oninput: ev => {
                  mapping[name] = ev.target.value;
                  storeSettings(playerInventory.settings);
                  const displayName = mapping[name] ? `${mapping[name]} [${name}]` : name;
                  head.textContent = `${typeName}: ${displayName} (${size})`;
                }
              })]
            }), createCapsuleTable(inventory, capsule)]
          })]
        }));
      }
    }
  }

  $(container).accordion({
    header: 'b',
    heightStyle: 'fill',
    collapsible: true
  });
  return container;
}

function fillPane(inventory) {
  const oldContainer = playerInventory.pane.querySelector('.container');
  if (oldContainer) playerInventory.pane.removeChild(oldContainer);
  playerInventory.pane.appendChild(buildInventoryHTML(inventory));
}

function getTitle() {
  let title = 'Inventory';

  if (playerInventory.lastRefresh) {
    title = title + ' (' + new Date(playerInventory.lastRefresh).toLocaleTimeString() + ')';
  }

  return title;
}

function displayInventory(inventory) {
  const container = buildInventoryHTML(inventory);
  playerInventory.dialog = window.dialog({
    title: getTitle(),
    id: 'inventory',
    html: container,
    width: 'auto',
    height: '500',
    classes: {
      'ui-dialog-content': 'inventory-box'
    },
    buttons: {
      Refresh: () => refreshInventory(),
      Options: displayOpt
    }
  });
  refreshIfOld();
}

function handleInventory(data) {
  if (data.length > 0) {
    playerInventory.inventory = parseInventory('⌂', data);
    playerInventory.lastRefresh = Date.now();
    saveInventory(data);
    window.runHooks('pluginInventoryRefresh', {
      inventory: playerInventory.inventory
    });
    autoRefresh();
  } else {
    return Promise.reject('empty');
  }
}

function refreshInventory(auto) {
  clearTimeout(playerInventory.autoRefreshTimer);
  requestInventory().then(handleInventory).catch(e => {
    if (e === 'no core') {
      alert('You need to subscribe to C.O.R.E. to get your inventory from Intel Map.');
    } else {
      if (!auto) {
        if (e === 'empty') {
          alert('Inventory empty, probably hitting rate limit, try again later');
        } else {
          alert('Inventory: Last refresh failed. ' + e);
        }

        autoRefresh();
      }
    }
  });
}

function refreshIfOld() {
  const delay = playerInventory.lastRefresh + playerInventory.settings.autoRefreshDelay * 60 * 1000 - Date.now();
  if (delay <= 0) return refreshInventory(true);
}

function autoRefresh() {
  if (!playerInventory.settings.autoRefreshActive) return;
  playerInventory.autoRefreshTimer = setTimeout(() => refreshInventory(true), playerInventory.settings.autoRefreshDelay * 60 * 1000);
}

function stopAutoRefresh() {
  clearTimeout(playerInventory.autoRefreshTimer);
}

function exportToKeys() {
  if (!window.plugin.keys) return;
  [window.plugin.keys.KEY, window.plugin.keys.UPDATE_QUEUE].forEach(mapping => {
    const data = {};

    for (const [guid, key] of playerInventory.inventory.keys) {
      data[guid] = key.total;
    }

    window.plugin.keys[mapping.field] = data;
    window.plugin.keys.storeLocal(mapping);
  });
  window.runHooks('pluginKeysRefreshAll');
  window.plugin.keys.delaySync();
}

function exportToClipboard() {
  const data = [];

  for (const key of playerInventory.inventory.keys.values()) {
    for (const [capsule, num] of key.count) {
      data.push([key.title, key.latLng[0].toFixed(6), key.latLng[1].toFixed(6), capsule, num].join('\t'));
    }
  }

  const shared = data.join('\n');

  const content = jsx("textarea", {
    onclick: () => {
      content.select();
    },
    children: shared
  });

  if (typeof android !== 'undefined' && android && android.shareString) android.shareString(shared);else {
    window.dialog({
      title: 'Keys',
      html: content,
      width: 'auto',
      height: 'auto'
    });
  }
}

function displayNameMapping() {
  const capsules = playerInventory.inventory.capsules;
  const mapping = playerInventory.settings.capsuleNameMap;
  const capsulesName = Object.keys(capsules).sort();
  const text = [];

  for (const name of capsulesName) {
    if (mapping[name]) text.push(`${name}: ${mapping[name]}`);
  }

  const container = jsx("textarea", {
    className: "container",
    placeholder: "AAAAAAAA: Name of AAAAAAAA\\nBBBBBBBB: Name of BBBBBBBB\\n...",
    value: text.join('\n')
  });

  window.dialog({
    title: 'Inventory Capsule Names',
    id: 'inventory-names',
    html: container,
    buttons: [{
      text: 'Set',
      click: () => {
        const lines = container.value.trim().split('\n');

        for (const line of lines) {
          const m = line.trim().match(/^([0-9A-F]{8})\s*:\s*(.*)$/);

          if (m) {
            mapping[m[1]] = m[2];
          }
        }

        storeSettings(playerInventory.settings);
      }
    }, {
      text: 'Close',
      click: function () {
        $(this).dialog('close');
      }
    }]
  });
}

function displayOpt() {
  const container = jsxs("div", {
    className: "container",
    children: [jsx("label", {
      htmlFor: "plugin-player-inventory-popup-enable",
      children: "Keys popup"
    }), jsx("input", {
      type: "checkbox",
      checked: playerInventory.settings.popupEnable,
      id: "plugin-player-inventory-popup-enable",
      onchange: ev => {
        playerInventory.settings.popupEnable = ev.target.checked === 'true' || (ev.target.checked === 'false' ? false : ev.target.checked);
        storeSettings(playerInventory.settings);
      }
    }), jsx("label", {
      htmlFor: "plugin-player-inventory-autorefresh-enable",
      children: "Auto-refresh"
    }), jsx("input", {
      type: "checkbox",
      checked: playerInventory.settings.autoRefreshActive,
      id: "plugin-player-inventory-autorefresh-enable",
      onchange: ev => {
        playerInventory.settings.autoRefreshActive = ev.target.checked === 'true' || (ev.target.checked === 'false' ? false : ev.target.checked);

        if (playerInventory.settings.autoRefreshActive) {
          autoRefresh();
        } else {
          stopAutoRefresh();
        }

        storeSettings(playerInventory.settings);
      }
    }), jsx("label", {
      children: "Refresh delay (min)"
    }), jsx("input", {
      type: "number",
      checked: playerInventory.settings.autoRefreshDelay,
      onchange: ev => {
        playerInventory.settings.autoRefreshDelay = +ev.target.value > 0 ? +ev.target.value : 1;
        ev.target.value = playerInventory.settings.autoRefreshDelay;
        storeSettings(playerInventory.settings);
      }
    }), jsx("button", {
      onclick: displayNameMapping,
      children: "Set Capsule names"
    }), window.plugin.keys && jsxs(Fragment, {
      children: [jsx("label", {
        htmlFor: "plugin-player-inventory-autosync-enable",
        children: "Auto-sync with Keys"
      }), jsx("input", {
        type: "checkbox",
        checked: playerInventory.settings.autoSyncKeys,
        id: "plugin-player-inventory-autosync-enable",
        onchange: ev => {
          playerInventory.settings.autoSyncKeys = ev.target.checked === 'true' || (ev.target.checked === 'false' ? false : ev.target.checked);
          storeSettings(playerInventory.settings);
        }
      }), jsx("button", {
        onclick: exportToKeys,
        children: "Export to keys plugin"
      })]
    }), jsx("button", {
      onclick: exportToClipboard,
      children: "Export keys to clipboard"
    }), jsx("label", {
      htmlFor: "plugin-player-inventory-keys-sidebar-enable",
      children: "Keys in sidebar"
    }), jsx("input", {
      type: "checkbox",
      checked: playerInventory.settings.keysSidebarEnable,
      id: "plugin-player-inventory-keys-sidebar-enable",
      onchange: ev => {
        playerInventory.settings.keysSidebarEnable = ev.target.checked === 'true' || (ev.target.checked === 'false' ? false : ev.target.checked);
        storeSettings(playerInventory.settings);
      }
    }), jsx("label", {
      htmlFor: "plugin-player-inventory-lvlcolor-enable",
      children: "Level/rarity colors"
    }), jsx("input", {
      type: "checkbox",
      checked: playerInventory.settings.lvlColorEnable,
      id: "plugin-player-inventory-keys-lvlcolor-enable",
      onchange: ev => {
        playerInventory.settings.lvlColorEnable = ev.target.checked === 'true' || (ev.target.checked === 'false' ? false : ev.target.checked);
        setupCSS();
        storeSettings(playerInventory.settings);
      }
    })]
  });

  window.dialog({
    title: 'Inventory Opt',
    id: 'inventory-opt',
    html: container,
    width: 'auto',
    height: 'auto'
  });
}

function setupCSS() {
  let colorStyle = '';

  if (playerInventory.settings.lvlColorEnable) {
    window.COLORS_LVL.forEach((c, i) => {
      colorStyle += `.level_L${i}{ color: ${c} }`;
    });
    rarity.forEach((r, i) => {
      if (window.COLORS_MOD[r]) colorStyle += `.rarity_${rarityShort[i]} { color: ${window.COLORS_MOD[r]}}`;
    });
  }

  const style = document.head.querySelector('#player-inventory-css') || jsx("style", {
    id: "player-inventory-css"
  });

  style.textContent = css_248z + colorStyle;
  document.head.append(style);
}

function setupDisplay() {
  playerInventory.dialog = null;

  if (window.useAndroidPanes()) {
    android.addPane('playerInventory', 'Inventory', 'ic_action_view_as_list');
    window.addHook('paneChanged', function (pane) {
      if (pane === 'playerInventory') {
        refreshIfOld();
        playerInventory.pane.style.display = '';
      } else if (playerInventory.pane) {
        playerInventory.pane.style.display = 'none';
      }
    });
    playerInventory.pane = jsx("div", {
      className: "inventory-box mobile",
      id: "pane-inventory",
      children: jsx("button", {
        onclick: () => refreshInventory(),
        children: "Refresh"
      })
    });
    playerInventory.pane.style.display = 'none';
    document.body.append(playerInventory.pane);
    document.getElementById('toolbox').append(jsx("a", {
      title: "Inventory options",
      onclick: displayOpt,
      children: "Inventory Opt"
    }));
  } else {
    document.getElementById('toolbox').append(jsx("a", {
      title: "Show inventory",
      onclick: () => displayInventory(playerInventory.inventory),
      children: "Inventory"
    }));
  }
} // iitc setup


function setup () {
  // Dummy inventory
  playerInventory.inventory = new Inventory();
  playerInventory.isHighlighActive = false;
  playerInventory.lastRefresh = Date.now();
  playerInventory.autoRefreshTimer = null;
  playerInventory.settings = {
    autoRefreshActive: false,
    popupEnable: true,
    autoRefreshDelay: 30,
    autoSyncKeys: false,
    keysSidebarEnable: false,
    capsuleNameMap: {},
    lvlColorEnable: true
  };
  $.extend(playerInventory.settings, loadSettings());
  setupCSS();
  setupDisplay();
  playerInventory.requestInventory = requestInventory;
  playerInventory.highlighter = {
    highlight: portalKeyHighlight,
    setSelected: function (selected) {
      playerInventory.isHighlighActive = selected;
    }
  };
  window.addPortalHighlighter('Inventory keys', playerInventory.highlighter);
  window.addHook('pluginInventoryRefresh', data => {
    if (playerInventory.settings.autoSyncKeys) {
      exportToKeys();
    }

    if (playerInventory.dialog) {
      playerInventory.dialog.html(buildInventoryHTML(data.inventory));
      playerInventory.dialog.dialog('option', 'title', getTitle());
    }

    if (playerInventory.pane) {
      fillPane(data.inventory);
      const button = playerInventory.pane.querySelector('button');
      if (button) button.textContent = 'Refresh (' + new Date(playerInventory.lastRefresh).toLocaleTimeString() + ')';
    }
  });
  window.addHook('mapDataEntityInject', injectKeys);
  window.addHook('portalSelected', data => {
    // {selectedPortalGuid: guid, unselectedPortalGuid: oldPortalGuid}
    if (!playerInventory.settings.popupEnable) return;

    if (data.selectedPortalGuid && data.selectedPortalGuid !== data.unselectedPortalGuid) {
      const total = playerInventory.inventory.countKey(data.selectedPortalGuid);

      if (total > 0) {
        createPopup(data.selectedPortalGuid);
      }
    }
  });
  window.addHook('portalDetailsUpdated', data => {
    // {guid: guid, portal: portal, portalDetails: details, portalData: data}
    if (!playerInventory.settings.keysSidebarEnable) return;
    const total = playerInventory.inventory.countKey(data.guid);

    if (total > 0) {
      const key = playerInventory.inventory.keys.get(data.guid);
      const mapping = playerInventory.settings.capsuleNameMap;
      const capsules = Array.from(key.count.keys()).map(name => jsx("div", {
        title: mapping[name] ? `${mapping[name]} [${name}]` : name,
        children: mapping[name] ? `${mapping[name]}` : name
      }));
      document.getElementById('randdetails').append(jsxs("tr", {
        className: "inventory-details",
        children: [jsx("td", {
          children: total
        }), jsx("td", {
          children: "Keys"
        }), jsx("td", {
          children: "Capsules"
        }), jsx("td", {
          children: capsules
        })]
      }));
    }
  });
  loadLastInventory().then(data => {
    playerInventory.inventory = parseInventory('⌂', data.raw);
    playerInventory.lastRefresh = data.date;
    autoRefresh();
    window.runHooks('pluginInventoryRefresh', {
      inventory: playerInventory.inventory
    });
  });
}

if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();

setup.info = plugin_info; //add the script info data to the function as a property
}

// inject code into site context
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };

var script = document.createElement('script');
// if on last IITC mobile, will be replaced by wrapper(info)
var mobile = `script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);`;
// detect if mobile
if (mobile.startsWith('script')) {
  script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
  script.appendChild(document.createTextNode('//# sourceURL=iitc:///plugins/player-inventory.js'));
  (document.body || document.head || document.documentElement).appendChild(script);
} else {
  // mobile string
  wrapper(info);
}
