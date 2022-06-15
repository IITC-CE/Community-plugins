// ==UserScript==
// @author         jaiperdu
// @name           Player Inventory
// @category       Info
// @version        0.3.3
// @description    View inventory and highlight portals with keys at any zoom. Can be used with the official plugins Keys and Keys on map to show the number of keys on the map.
// @id             player-inventory@jaiperdu
// @namespace      https://github.com/IITC-CE/ingress-intel-total-conversion
// @updateURL      https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/player-inventory@jaiperdu/player-inventory.meta.js
// @downloadURL    https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/player-inventory@jaiperdu/player-inventory.user.js
// @match          https://intel.ingress.com/*
// @grant          none
// ==/UserScript==


function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'lejeu';
plugin_info.dateTimeVersion = '2022-05-21-110742';
plugin_info.pluginId = 'player-inventory';
//END PLUGIN AUTHORS NOTE

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

const dontCount = [
  "DRONE",
];

function defaultTypeString(s) {
  if (!(s in itemTypes)) itemTypes[s] = s;
}

const levelItemTypes = [
  "EMITTER_A",
  "EMP_BURSTER",
  "POWER_CUBE",
  "ULTRA_STRIKE",
  "MEDIA",
];

const rarity = [
  "VERY_COMMON",
  "COMMON",
  "LESS_COMMON",
  "RARE",
  "VERY_RARE",
  "EXTREMELY_RARE",
];

const rarityShort = rarity.map((v) => v.split('_').map((a) => a[0]).join(''));

const rarityToInt = {}
for (const i in rarity)
  rarityToInt[rarity[i]] = i;

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
    }
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
    if (!(type in this.items))
      this.clearItem(type);
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
    }
    this.capsules[capsule.name] = data;

    if (capsule.type === "KEY_CAPSULE")
      this.keyLockersCount += capsule.size;

    this.addItem(capsule);
    for (const item of capsule.content) {
      this.addItem(item);
      if (item.type === "PORTAL_LINK_KEY")
        data.keys[item.guid] = item;
      else if (item.type === "MEDIA")
        data.medias[item.mediaId] = item;
      else {
        if (!data.items[item.type]) data.items[item.type] = {repr: item, leveled: levelItemTypes.includes(item.type), count:{}};
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

    if (!dontCount.includes(item.type))
      this.count += item.count;

    if (item.type === "PORTAL_LINK_KEY") {
      this.addKey(item);
    } else if (item.type === "MEDIA") {
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
    current.total += (media.count || 1);
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
    current.total += (key.count || 1);
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
      if (type === "PORTAL_LINK_KEY") continue;
      const item = this.getItem(type);
      for (const k in item.counts) {
        const count = item.counts[k][this.name];
        if (count) {
          if (!data.items[type])
            data.items[type] = {
              leveled: levelItemTypes.includes(type),
              count:{}
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
  return location.split(',').map(a => (Number.parseInt(a,16)&(-1))*1e-6);
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
  }
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

// {
//   "resourceWithLevels": {
//     "resourceType": "EMITTER_A",
//     "level": 7
//   }
// }
function parseLevelItem(obj) {
  const data = {
    type: obj.resourceWithLevels.resourceType,
    level: obj.resourceWithLevels.level,
  };
  if (obj.storyItem)
    return parseMedia(data, obj);
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
  if (obj.flipCard)
    return parseFlipCard(data, obj);
  if (obj.container)
    return parseContainer(data, obj);
  if (obj.portalCoupler)
    return parsePortalKey(data, obj);
  if (obj.timedPowerupResource)
    return parsePortalPowerUp(data, obj);
  if (obj.playerPowerupResource)
    return parsePlayerPowerUp(data, obj);
  return data;
}
/*
[
  guid, timestamp?, item object
]
*/
function parseItem(item) {
  const [id, ts, obj] = item;
  if (obj.resource)
    return parseResource(obj);
  if (obj.resourceWithLevels)
    return parseLevelItem(obj);
  if (obj.modResource)
    return parseMod(obj);
  // xxx: other types
}

function parseInventory(name, data) {
  const inventory = new Inventory(name);
  for (const entry of data) {
    const item = parseItem(entry);
    if (item) {
      if (item.type.includes("CAPSULE"))
        inventory.addCapsule(item);
      else
        inventory.addItem(item);
    }
  }
  return inventory;
}

const plugin = {};
window.plugin.playerInventory = plugin;

// again...
function getPortalLink(key) {
  const latLng = [key.latLng[0].toFixed(6), key.latLng[1].toFixed(6)];
  const a = L.DomUtil.create('a');
  a.textContent = key.title;
  a.title = key.address;
  a.href = window.makePermalink(latLng);
  L.DomEvent.on(a, 'click', function(event) {
    L.DomEvent.preventDefault(event);
    window.renderPortalDetails(key.guid);
    window.selectPortalByLatLng(latLng);
  })
  L.DomEvent.on(a, 'dblclick', function(event) {
    L.DomEvent.preventDefault(event);
    window.renderPortalDetails(key.guid);
    window.zoomToAndShowPortal(key.guid, latLng);
  });
  return a;
}

function localeCompare(a,b) {
  if (typeof a !== "string") a = '';
  if (typeof b !== "string") b = '';
  return a.localeCompare(b)
}

const STORE_KEY = "plugin-player-inventory";
const SETTINGS_KEY = "plugin-player-inventory-settings";

function openIndexedDB() {
  const rq = window.indexedDB.open("player-inventory", 1);
  rq.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("inventory", { autoIncrement: true });
  };
  return rq;
}

function loadFromIndexedDB() {
  if (!window.indexedDB) return loadFromLocalStorage();
  const rq = openIndexedDB();
  rq.onerror = function () {
    loadFromLocalStorage();
  };
  rq.onsuccess = function (event) {
    const db = event.target.result;
    const tx = db.transaction(["inventory"], "readonly");
    const store = tx.objectStore("inventory");
    store.getAll().onsuccess = function (event) {
      const r = event.target.result;
      if (r.length > 0) {
        const data = r[r.length-1];
        plugin.inventory = parseInventory("⌂", data.raw);
        plugin.lastRefresh = data.date;
        autoRefresh();
        window.runHooks("pluginInventoryRefresh", {inventory: plugin.inventory});
      } else {
        loadFromLocalStorage();
      }
    }
    db.close();
  };
}

function storeToIndexedDB(data) {
  if (!window.indexedDB) return storeToLocalStorage(data);
  const rq = openIndexedDB();
  rq.onerror = function () {
    storeToLocalStorage(data);
  };
  rq.onsuccess = function (event) {
    const db = event.target.result;
    const tx = db.transaction(["inventory"], "readwrite");
    const store = tx.objectStore("inventory");
    store.clear().onsuccess = function () {
      store.add({
        raw: data,
        date: Date.now(),
      });
    };
    tx.oncomplete = function () {
      delete localStorage[STORE_KEY];
    }
    tx.onerror = function () {
      storeToLocalStorage(data);
    }
    db.close();
  };
}

function loadFromLocalStorage() {
  const store = localStorage[STORE_KEY];
  if (store) {
    try {
      const data = JSON.parse(store);
      plugin.inventory = parseInventory("⌂", data.raw);
      plugin.lastRefresh = data.date;
      autoRefresh();
      window.runHooks("pluginInventoryRefresh", {inventory: plugin.inventory});
    } catch (e) {console.log(e);}
  }
}

function storeToLocalStorage(data) {
  const store = {
    raw: data,
    date: Date.now(),
  }
  localStorage[STORE_KEY] = JSON.stringify(store);
}

function loadSettings() {
  const settings = localStorage[SETTINGS_KEY];
  if (settings) {
    try {
      const data = JSON.parse(settings);
      $.extend(plugin.settings, data);
    } catch (e) {console.log(e);}
  }
}

function storeSettings() {
  localStorage[SETTINGS_KEY] = JSON.stringify(plugin.settings);
}

function handleInventory(data) {
  if (data.result.length > 0) {
    plugin.inventory = parseInventory("⌂", data.result);
    plugin.lastRefresh = Date.now();
    storeToIndexedDB(data.result);
    window.runHooks("pluginInventoryRefresh", {inventory: plugin.inventory});
  } else {
    alert("Inventory empty, probably hitting rate limit, try again later");
  }
  autoRefresh();
}

function handleError() {
  autoRefresh();
}

function getInventory() {
  window.postAjax('getInventory', {lastQueryTimestamp:0}, handleInventory, handleError);
}

function handleSubscription(data) {
  plugin.hasActiveSubscription = data.result;
  if (data.result) getInventory();
  else {
    alert("You need to subscribe to C.O.R.E. to get your inventory from Intel Map.");
  }
}

function getSubscriptionStatus() {
  window.postAjax('getHasActiveSubscription', {}, handleSubscription, handleError);
}

function injectKeys(data) {
  if (!plugin.isHighlighActive)
    return;

  const bounds = window.map.getBounds();
  const entities = [];
  for (const [guid, key] of plugin.inventory.keys) {
    if (bounds.contains(key.latLng)) {
      // keep known team
      const team = window.portals[guid] ? window.portals[guid].options.ent[2][1] : 'N';
      const ent = [
        guid,
        0,
        ['p', team, Math.round(key.latLng[0]*1e6), Math.round(key.latLng[1]*1e6)]
      ];
      entities.push(ent);
    }
  }
  data.callback(entities);
}

function portalKeyHighlight(data) {
  const guid = data.portal.options.guid;
  if (plugin.inventory.keys.has(guid)) {
    // place holder
    if (data.portal.options.team != window.TEAM_NONE && data.portal.options.level === 0) {
      data.portal.setStyle({
        color: 'red',
        weight: 2*Math.sqrt(window.portalMarkerScale()),
        dashArray: '',
      });
    }
    else if (window.map.getZoom() < 15 && data.portal.options.team == window.TEAM_NONE && !window.portalDetail.isFresh(guid))
      // injected without intel data
      data.portal.setStyle({color: 'red', fillColor: 'gray'});
    else data.portal.setStyle({color: 'red'});
  }
}

function createPopup(guid) {
  const portal = window.portals[guid];
  const latLng = portal.getLatLng();
  // create popup only if the portal is in view
  if (window.map.getBounds().contains(latLng)) {
    const count = plugin.inventory.keys.get(guid).count;
    const text = Array.from(count).map(([name, count]) => `<strong>${name}</strong>: ${count}`).join('<br/>');

    L.popup()
      .setLatLng(latLng)
      .setContent('<div class="inventory-keys">' + text + '</div>')
      .openOn(window.map);
  }
}

function createAllTable(inventory) {
  const table = L.DomUtil.create("table");
  for (const type in inventory.items) {
    const total = inventory.countType(type);
    if (total == 0)
      continue;
    const item = inventory.items[type];
    for (const i in item.counts) {
      const num = inventory.countType(type, i);
      if (num > 0) {
        const lr = item.leveled ? "L" + i : rarityShort[rarityToInt[i]];
        const row = L.DomUtil.create('tr', (item.leveled ? "level_" : "rarity_") + lr, table);
        row.innerHTML = `<td>${num}</td><td>${lr}</td><td>${item.name}</td>`;
      }
    }
  }
  return table;
}

function createAllSumTable(inventory) {
  const table = L.DomUtil.create("table");
  for (const type in inventory.items) {
    const total = inventory.countType(type);
    if (total == 0)
      continue;
    const item = inventory.items[type];

    const row = L.DomUtil.create('tr', null, table);

    const nums = [];

    if (type === "PORTAL_LINK_KEY") {
      const inventoryCount = item.counts["VERY_COMMON"][inventory.name] || 0;
      const otherCount = total - inventoryCount - inventory.keyLockersCount;
      nums.push(`<span class="level_L1">${inventory.name}: ${inventoryCount}</span>`);
      nums.push(`<span class="level_L1">Key Lockers: ${inventory.keyLockersCount}</span>`);
      nums.push(`<span class="level_L1">Other: ${otherCount}</span>`);
    } else {
      for (const k in item.counts) {
        const num = inventory.countType(type, k);
        if (num > 0) {
          const lr = item.leveled ? "L" + k : rarityShort[rarityToInt[k]];
          const className = (item.leveled ? "level_" : "rarity_") + lr;
          nums.push(`<span class="${className}">${num} ${lr}</span>`);
        }
      }
    }

    row.innerHTML = `<td>${item.name}</td><td>${total}</td><td>${nums.join(', ')}</td>`;
  }
  return table;
}

function createKeysTable(inventory) {
  const table = L.DomUtil.create("table");
  const keys = [...inventory.keys.values()].sort((a,b) => localeCompare(a.title, b.title));
  for (const key of keys) {
    const a = getPortalLink(key);
    const total = inventory.countKey(key.guid);
    const counts = Array.from(key.count).map(([name, count]) => `${name}: ${count}`).join(', ');

    const row = L.DomUtil.create('tr', null, table);
    L.DomUtil.create('td', null, row).innerHTML = `<a title="${counts}">${total}</a>`;
    L.DomUtil.create('td', null, row).appendChild(a);
    // L.DomUtil.create('td', null, row).textContent = counts;
  }
  return table;
}

function createMediaTable(inventory) {
  const table = L.DomUtil.create("table");
  const medias = [...inventory.medias.values()].sort((a,b) => localeCompare(a.name, b.name));
  for (const media of medias) {
    const counts = Array.from(media.count).map(([name, count]) => `${name}: ${count}`).join(', ');

    L.DomUtil.create('tr', 'level_L1', table).innerHTML =
        `<td><a title="${counts}">${media.total}</a></td>`
      + `<td><a href="${media.url}">${media.name}</a>`;
  }
  return table;
}

function createCapsuleTable(inventory, capsule) {
  const table = L.DomUtil.create("table");
  const keys = Object.values(capsule.keys).sort((a,b) => localeCompare(a.title, b.title));
  for (const item of keys) {
    const a = getPortalLink(item);
    const total = item.count;

    const row = L.DomUtil.create('tr', null, table);
    L.DomUtil.create('td', null, row).textContent = total;
    if (capsule.type !== "KEY_CAPSULE") L.DomUtil.create('td', null, row);
    L.DomUtil.create('td', null, row).appendChild(a);
  }
  const medias = Object.values(capsule.medias).sort((a,b) => localeCompare(a.name, b.name));
  for (const item of medias) {
    L.DomUtil.create('tr', 'level_L1', table).innerHTML = `<td>${item.count}</td><td>M</td><td><a href="${item.url}">${item.name}</a>`;
  }
  for (const type in itemTypes) {
    const item = capsule.items[type];
    if (!item) continue;
    const name = itemTypes[type];
    for (const k in item.count) {
      const lr = item.leveled ? "L" + k : rarityShort[rarityToInt[k]];
      const row = L.DomUtil.create('tr', (item.leveled ? "level_" : "rarity_") + lr, table);
      row.innerHTML = `<td>${item.count[k]}</td><td>${lr}</td><td>${name}</td>`;
    }
  }
  return table;
}

function buildInventoryHTML(inventory) {
  const container = L.DomUtil.create("div", "container");

  const sumHeader = L.DomUtil.create("b", null, container);
  {
    const inventoryCount = inventory.count - inventory.keyLockersCount;
    const keyInInventory = (inventory.keys.size > 0) ? inventory.items["PORTAL_LINK_KEY"].counts["VERY_COMMON"][inventory.name] || 0 : 0;
    sumHeader.textContent = `Summary I:${inventoryCount - keyInInventory} K:${keyInInventory} T:${inventoryCount}/2500 KL:${inventory.keyLockersCount}`;
  }
  const sum = L.DomUtil.create("div", "sum", container);
  sum.appendChild(createAllSumTable(inventory));

  const allHeader = L.DomUtil.create("b", null, container);
  allHeader.textContent = "Details";
  const all = L.DomUtil.create("div", "all", container);
  all.appendChild(createAllTable(inventory));

  const keysHeader = L.DomUtil.create("b", null, container);
  keysHeader.textContent = "Keys";
  const keys = L.DomUtil.create("div", "keys", container);
  keys.appendChild(createKeysTable(inventory));

  if (inventory.medias.size > 0) {
    const mediasHeader = L.DomUtil.create("b", null, container);
    mediasHeader.textContent = "Medias";
    const medias = L.DomUtil.create("div", "medias", container);
    medias.appendChild(createMediaTable(inventory));
  }

  const onHand = inventory.onHand();
  L.DomUtil.create("b", null, container).textContent = `On Hand (${onHand.size})`;
  L.DomUtil.create("div", "capsule", container).appendChild(createCapsuleTable(inventory, onHand));

  const mapping = plugin.settings.capsuleNameMap;
  const capsulesName = Object.keys(inventory.capsules).sort((a, b) => {
    if (mapping[a] && !mapping[b]) return -1;
    if (!mapping[a] && mapping[b]) return 1;
    a = mapping[a] || a;
    b = mapping[b] || b;
    return localeCompare(a, b);
  });
  const keyLockers = capsulesName.filter((name) => inventory.capsules[name].type === "KEY_CAPSULE");
  const quantums = capsulesName.filter((name) => inventory.capsules[name].type === "INTEREST_CAPSULE");
  const commonCapsules = capsulesName.filter((name) => inventory.capsules[name].type === "CAPSULE");
  for (const names of [keyLockers, quantums, commonCapsules]) {
    for (const name of names) {
      const capsule = inventory.capsules[name];
      if (capsule.size > 0) {
        const displayName = mapping[name] ?`${mapping[name]} [${name}]` : name;
        const typeName = itemTypes[capsule.type];
        const size = capsule.size;

        const head = L.DomUtil.create("b", null, container);
        head.textContent = `${typeName}: ${displayName} (${size})`;

        const div = L.DomUtil.create("div", "capsule", container);

        const editDiv = L.DomUtil.create("div", "", div);
        const editIcon = L.DomUtil.create("a", "edit-name-icon", editDiv);
        editIcon.textContent = "✏️";
        editIcon.title = "Change capsule name";

        const editInput = L.DomUtil.create("input", "edit-name-input", editDiv);
        if (mapping[name]) editInput.value = mapping[name];
        editInput.placeholder = "Enter capsule name";
        L.DomEvent.on(editIcon, 'click', () => {
          editInput.style.display = editInput.style.display === "unset" ? null : "unset";
        });
        L.DomEvent.on(editInput, 'input', () => {
          mapping[name] = editInput.value;
          storeSettings();
          const displayName = mapping[name] ?`${mapping[name]} [${name}]` : name;
          head.textContent = `${typeName}: ${displayName} (${size})`;
        });

        div.appendChild(createCapsuleTable(inventory, capsule));
      }
    }
  }

  $(container).accordion({
      header: 'b',
      heightStyle: 'fill',
      collapsible: true,
  });

  return container;
}

function fillPane(inventory) {
  const oldContainer = plugin.pane.querySelector('.container');
  if (oldContainer) plugin.pane.removeChild(oldContainer);
  plugin.pane.appendChild(buildInventoryHTML(inventory));
}

function getTitle() {
  let title = "Inventory";
  if (plugin.lastRefresh) {
    title =
      title + " (" + new Date(plugin.lastRefresh).toLocaleTimeString() + ")";
  }
  return title;
}

function displayInventory(inventory) {
  const container = buildInventoryHTML(inventory);

  plugin.dialog = window.dialog({
    title: getTitle(),
    id: 'inventory',
    html: container,
    width: 'auto',
    height: '500',
    classes: {
      'ui-dialog-content': 'inventory-box',
    },
    buttons: {
      "Refresh": refreshInventory,
      "Options": displayOpt,
    }
  });

  refreshIfOld();
}

function refreshInventory() {
  clearTimeout(plugin.autoRefreshTimer);
  getSubscriptionStatus();
}

function refreshIfOld() {
  const delay = plugin.lastRefresh + plugin.settings.autoRefreshDelay * 60 * 1000 - Date.now();
  if (delay <= 0) return refreshInventory();
}

function autoRefresh() {
  if (!plugin.settings.autoRefreshActive) return;
  plugin.autoRefreshTimer = setTimeout(refreshInventory, plugin.settings.autoRefreshDelay * 60 * 1000);
}

function stopAutoRefresh() {
  clearTimeout(plugin.autoRefreshTimer);
}

function exportToKeys() {
  if (!window.plugin.keys) return;
  [window.plugin.keys.KEY, window.plugin.keys.UPDATE_QUEUE].forEach((mapping) => {
    const data = {};
    for (const [guid, key] of plugin.inventory.keys) {
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
  for (const [guid, key] of plugin.inventory.keys) {
    for (const [capsule, num] of key.count) {
      data.push([key.title, key.latLng[0].toFixed(6), key.latLng[1].toFixed(6), capsule, num].join('\t'));
    }
  }
  const shared = data.join('\n');

  if(typeof android !== 'undefined' && android && android.shareString)
    android.shareString(shared);
  else {
    const content = L.DomUtil.create('textarea', "container");
    content.textContent = shared;
    L.DomEvent.on(content, 'click', () => {
      content.select();
    });
    window.dialog({
      title: 'Keys',
      html: content,
      width: 'auto',
      height: 'auto',
    });
  }
}

function displayNameMapping() {
  const container = L.DomUtil.create("textarea", "container");
  container.placeholder = "AAAAAAAA: Name of AAAAAAAA\nBBBBBBBB: Name of BBBBBBBB\n...";

  const capsules = plugin.inventory.capsules;
  const mapping = plugin.settings.capsuleNameMap;
  const capsulesName = Object.keys(capsules).sort();
  const text = [];
  for (const name of capsulesName) {
    if (mapping[name])
      text.push(`${name}: ${mapping[name]}`);
  }
  container.value = text.join("\n");

  window.dialog({
    title: 'Inventory Capsule Names',
    id: 'inventory-names',
    html: container,
    buttons: [
      {
        text: "Set",
        click: () => {
          const lines = container.value.trim().split('\n');
          for (const line of lines) {
            const m = line.trim().match(/^([0-9A-F]{8})\s*:\s*(.*)$/);
            if (m) {
              mapping[m[1]] = m[2];
            }
          }
          storeSettings();
        },
      },
      {
        text: "Close",
        click: function () {
          $(this).dialog('close');
        }
      }
    ],
  });
}

function displayOpt() {
  const container = L.DomUtil.create("div", "container");

  const popupLabel = L.DomUtil.create('label', null, container);
  popupLabel.textContent = "Keys popups";
  popupLabel.htmlFor = "plugin-player-inventory-popup-enable"
  const popupCheck = L.DomUtil.create('input', null, container);
  popupCheck.type = 'checkbox';
  popupCheck.checked = plugin.settings.popupEnable;
  popupCheck.id = 'plugin-player-inventory-popup-enable';
  L.DomEvent.on(popupCheck, "change", () => {
    plugin.settings.popupEnable = popupCheck.checked === 'true' || (popupCheck.checked === 'false' ? false : popupCheck.checked);
    storeSettings();
  });

  const refreshLabel = L.DomUtil.create('label', null, container);
  refreshLabel.textContent = "Auto-refresh";
  refreshLabel.htmlFor = "plugin-player-inventory-autorefresh-enable"
  const refreshCheck = L.DomUtil.create('input', null, container);
  refreshCheck.type = 'checkbox';
  refreshCheck.checked = plugin.settings.autoRefreshActive;
  refreshCheck.id = 'plugin-player-inventory-autorefresh-enable';
  L.DomEvent.on(refreshCheck, "change", () => {
    plugin.settings.autoRefreshActive = refreshCheck.checked === 'true' || (refreshCheck.checked === 'false' ? false : refreshCheck.checked);
    if (plugin.settings.autoRefreshActive) {
      autoRefresh();
    } else {
      stopAutoRefresh();
    }
    storeSettings();
  });

  const refreshDelayLabel = L.DomUtil.create('label', null, container);
  refreshDelayLabel.textContent = "Refresh delay (min)";
  const refreshDelay = L.DomUtil.create('input', null, container);
  refreshDelay.type = 'number';
  refreshDelay.value = plugin.settings.autoRefreshDelay;
  L.DomEvent.on(refreshDelay, "change", () => {
    plugin.settings.autoRefreshDelay = +refreshDelay.value > 0 ? +refreshDelay.value : 1;
    refreshDelay.value = plugin.settings.autoRefreshDelay;
    storeSettings();
  });

  {
    const button = L.DomUtil.create("button", null, container);
    button.textContent = "Set Capsule names";
    L.DomEvent.on(button, 'click', displayNameMapping);
  }

  // sync keys with the keys plugin
  if (window.plugin.keys) {
    const syncLabel = L.DomUtil.create('label', null, container);
    syncLabel.textContent = "Auto-sync with Keys";
    syncLabel.htmlFor = "plugin-player-inventory-autosync-enable"
    const syncCheck = L.DomUtil.create('input', null, container);
    syncCheck.type = 'checkbox';
    syncCheck.checked = plugin.settings.autoSyncKeys;
    syncCheck.id = 'plugin-player-inventory-autosync-enable';
    L.DomEvent.on(syncCheck, "change", () => {
      plugin.settings.autoSyncKeys = syncCheck.checked === 'true' || (syncCheck.checked === 'false' ? false : syncCheck.checked);
      storeSettings();
    });
    const button = L.DomUtil.create("button", null, container);
    button.textContent = "Export to keys plugin";
    L.DomEvent.on(button, 'click', exportToKeys);
  }

  {
    const button = L.DomUtil.create("button", null, container);
    button.textContent = "Export keys to clipboard";
    L.DomEvent.on(button, 'click', exportToClipboard);
  }

  {
    const keysSidebarLabel = L.DomUtil.create('label', null, container);
    keysSidebarLabel.textContent = "Keys in sidebar";
    keysSidebarLabel.htmlFor = "plugin-player-inventory-keys-sidebar-enable"
    const keysSidebarCheck = L.DomUtil.create('input', null, container);
    keysSidebarCheck.type = 'checkbox';
    keysSidebarCheck.checked = plugin.settings.keysSidebarEnable;
    keysSidebarCheck.id = 'plugin-player-inventory-keys-sidebar-enable';
    L.DomEvent.on(keysSidebarCheck, "change", () => {
      plugin.settings.keysSidebarEnable = keysSidebarCheck.checked === 'true' || (keysSidebarCheck.checked === 'false' ? false : keysSidebarCheck.checked);
      storeSettings();
    });
  }

  window.dialog({
    title: 'Inventory Opt',
    id: 'inventory-opt',
    html: container,
    width: 'auto',
    height: 'auto',
  });
}

function setupCSS() {
  document.head.append(h('style', {}, '\
.inventory-box .container {\
	width: max-content;\
}\
\
.inventory-box .ui-accordion-header {\
	color: #ffce00;\
  background: rgba(0, 0, 0, 0.7);\
}\
\
.inventory-box .ui-accordion-header, .inventory-box .ui-accordion-content {\
	border: 1px solid rgba(255,255,255,.2);\
	margin-top: -1px;\
	display: block;\
  line-height: 1.4rem;\
}\
\
.inventory-box .ui-accordion-header:before {\
	font-size: 18px;\
	margin-right: 2px;\
	content: "⊞";\
}\
\
.inventory-box .ui-accordion-header-active:before {\
	content: "⊟";\
}\
\
.inventory-box table {\
	width: 100%;\
}\
\
.inventory-box table tr {\
  background: rgba(0, 0, 0, 0.6);\
}\
\
.inventory-box table tr:nth-child(2n + 1) {\
  background: rgba(0, 0, 0, 0.3);\
}\
\
.inventory-box tr td:first-child {\
  text-align: right;\
}\
\
.inventory-box .sum tr td:first-child {\
  text-align: left;\
  white-space: nowrap;\
  width: max-content;\
}\
\
.inventory-box tr td:nth-child(2) {\
  text-align: center;\
}\
\
.inventory-box tr td:last-child {\
  text-align: left;\
}\
\
.inventory-box .all tr td:first-child,\
.inventory-box .keys tr td:first-child,\
.inventory-box .medias tr td:first-child,\
.inventory-box .capsule tr td:first-child {\
  width: 2em;\
}\
\
.inventory-box td {\
	padding-left: .3rem;\
	padding-right: .3rem;\
}\
\
.inventory-box .sum tr td span {\
    white-space: nowrap;\
}\
\
#dialog-inventory.inventory-box {\
  padding-right: 16px;\
}\
\
.inventory-box.mobile {\
	position: absolute;\
	top: 0;\
	left: 0;\
	width: 100%;\
	height: 100%;\
	overflow: auto;\
	padding: 0;\
}\
.inventory-box.mobile .container {\
	width: unset;\
}\
\
.inventory-box.mobile button {\
	width: 100%;\
}\
\
.inventory-box .edit-name-icon {\
  margin-top: -18px;\
  position: absolute;\
  right: 20px;\
}\
\
.inventory-box .edit-name-input {\
  display: none;\
  width: 100%;\
}\
\
/* popup */\
.inventory-keys {\
  width: max-content;\
}\
\
#dialog-inventory-opt .container {\
  display: grid;\
  grid-template-columns: auto auto;\
  grid-gap: .5em\
}\
\
#dialog-inventory-opt button {\
  grid-column: 1/3;\
  padding: .3rem 1em;\
}\
\
#dialog-inventory-opt input {\
  margin-left: auto;\
  margin-top: auto;\
  margin-bottom: auto;\
}\
\
#dialog-inventory-names textarea.container {\
  width: 100%;\
  height: 100%;\
}\
\
#randdetails .inventory-details {\
  vertical-align: top;\
}\
'));
  let colorStyle = "";
  window.COLORS_LVL.forEach((c,i) => {
    colorStyle += `.level_L${i}{ color: ${c} }`;
  });
  rarity.forEach((r,i) => {
    if (window.COLORS_MOD[r])
      colorStyle += `.rarity_${rarityShort[i]} { color: ${window.COLORS_MOD[r]}}`;
  });
  document.head.append(h('style', {}, colorStyle));
}

function setupDisplay() {
  plugin.dialog = null;

  if (window.useAndroidPanes()) {
    android.addPane('playerInventory', 'Inventory', 'ic_action_view_as_list');
    window.addHook('paneChanged', function (pane) {
      if (pane === 'playerInventory') {
        refreshIfOld();
        plugin.pane.style.display = "";
      } else if (plugin.pane) {
        plugin.pane.style.display = "none";
      }
    });
    plugin.pane = L.DomUtil.create('div', 'inventory-box mobile', document.body);
    plugin.pane.id = 'pane-inventory';
    plugin.pane.style.display = "none";

    const refreshButton = L.DomUtil.create('button', null, plugin.pane);
    refreshButton.textContent = 'Refresh';
    L.DomEvent.on(refreshButton, 'click', refreshInventory);

    document.getElementById("toolbox").append(
      h(
        "a",
        { title: "Inventory options", onclick: displayOpt },
        "Inventory Opt"
      )
    );
  } else {
    document.getElementById("toolbox").append(
      h(
        "a",
        {
          title: "Show inventory",
          onclick: () => displayInventory(plugin.inventory),
        },
        "Inventory"
      )
    );
  }
}

/** createElement alias h */
function h(tagName, attrs = {}, ...children) {
  if (tagName === "fragment") return children;
  attrs = attrs || {};
  const rawHtml = attrs.rawHtml;
  delete attrs.rawHtml;
  const elem = document.createElement(tagName);
  // dataset
  if (attrs.dataset) {
    for (const key in attrs.dataset) elem.dataset[key] = attrs.dataset[key];
    delete attrs.dataset;
  }
  Object.assign(elem, attrs);
  if (rawHtml) {
    elem.innerHTML = rawHtml;
    return elem;
  }
  for (const child of children) {
    if (Array.isArray(child)) elem.append(...child);
    else elem.append(child);
  }
  return elem;
}


// iitc setup
function setup() {
  // Dummy inventory
  plugin.inventory = new Inventory();

  plugin.hasActiveSubscription = false;
  plugin.isHighlighActive = false;

  plugin.lastRefresh = Date.now();
  plugin.autoRefreshTimer = null;

  plugin.settings = {
    autoRefreshActive: false,
    popupEnable: true,
    autoRefreshDelay: 30,
    autoSyncKeys: false,
    keysSidebarEnable: false,
    capsuleNameMap: {},
  }

  loadSettings();

  setupCSS();
  setupDisplay();

  plugin.getSubscriptionStatus = getSubscriptionStatus;

  plugin.highlighter = {
    highlight: portalKeyHighlight,
    setSelected: function (selected) {
      plugin.isHighlighActive = selected;
    },
  }
  window.addPortalHighlighter('Inventory keys', plugin.highlighter);

  window.addHook('pluginInventoryRefresh', (data) => {
    if (plugin.settings.autoSyncKeys) {
      exportToKeys();
    }
    if (plugin.dialog) {
      plugin.dialog.html(buildInventoryHTML(data.inventory));
      plugin.dialog.dialog("option", "title", getTitle());
    }
    if (plugin.pane) {
      fillPane(data.inventory);
      const button = plugin.pane.querySelector("button");
      if (button)
        button.textContent =
          "Refresh (" + new Date(plugin.lastRefresh).toLocaleTimeString() + ")";
    }
  })

  window.addHook('mapDataEntityInject', injectKeys);
  window.addHook('portalSelected', (data) => {
    //{selectedPortalGuid: guid, unselectedPortalGuid: oldPortalGuid}
    if (!plugin.settings.popupEnable) return;
    if (data.selectedPortalGuid && data.selectedPortalGuid !== data.unselectedPortalGuid) {
      const total = plugin.inventory.countKey(data.selectedPortalGuid);
      if (total > 0) {
        createPopup(data.selectedPortalGuid);
      }
    }
  });
  window.addHook("portalDetailsUpdated", (data) => {
    //{guid: guid, portal: portal, portalDetails: details, portalData: data}
    if (!plugin.settings.keysSidebarEnable) return;
    const total = plugin.inventory.countKey(data.guid);
    if (total > 0) {
      const key = plugin.inventory.keys.get(data.guid);
      const mapping = plugin.settings.capsuleNameMap;
      const capsules = Array.from(key.count.keys()).map((name) =>
        h(
          "div",
          { title: mapping[name] ? `${mapping[name]} [${name}]` : name },
          mapping[name] ? `${mapping[name]}` : name
        )
      );

      document.getElementById("randdetails").append(
        h(
          "tr",
          { className: "inventory-details"},
          h("td", {}, `${total}`),
          h("th", {}, "Keys"),
          h("th", {}, "Capsules"),
          h("td", {}, capsules)
        )
      );
    }
  });

  loadFromIndexedDB();
}

setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);

