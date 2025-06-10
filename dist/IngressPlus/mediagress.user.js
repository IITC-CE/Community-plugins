// ==UserScript==
// @author          IngressPlus
// @name            Mediagress
// @category        Misc
// @version         1.0.5
// @namespace       https://ingress.plus
// @downloadURL     https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/IngressPlus/mediagress.user.js
// @updateURL       https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/IngressPlus/mediagress.meta.js
// @homepageURL     https://ingress.plus/media
// @description     Upload and contribute your Media to Mediagress. Requires a C.O.R.E. subscription to access your Inventory.
// @icon            https://ingress.plus/icons/icon_mediagress_32.png
// @icon64          https://ingress.plus/icons/icon_mediagress_64.png
// @preview         https://ingress.plus/images/mediagress_upload.jpg
// @issueTracker    https://github.com/dedo1911/ingress-plus/issues
// @antiFeatures    export
// @id              mediagress@IngressPlus
// @include         https://intel.ingress.com/*
// @match           https://intel.ingress.com/*
// @grant           none
// ==/UserScript==


//
//  Changelog 1.0.5
//    Added time remaining before you can upload again if you try within 5 minutes of a prior upload
//    Added console command to skip 5 minute waiting time
//    Added "Uploading media..." pop up that shows while uploading
//    Added "[Mediagress]" in front of console logs to show from which plugin the log comes from
//    Added better error messages for the user
//    Fixed missing uploadInProgress = false on early return
//    Cleaned up code
//
//  Changelog 1.0.4
//    Added icon and changed description and author
//
//  Changelog 1.0.3
//    Fix minor StandardJS annoyances
//
//  Changelog 1.0.2
//    Display errors to the user, so it can be easily screenshot for bug reports
//
//  Changelog 1.0.1
//    Edited strings to make process of uploading clearer as well as giving a better understanding of errors when they happen
//

// shout out to https://github.com/EisFrei/ and his Live Inventory plugin

function wrapper (pluginInfo) {
  const host = 'https://ingress.plus'
  // Make sure that window.plugin exists. IITC defines it as a no-op function,
  // and other plugins assume the same.
  if (typeof window.plugin !== 'function') window.plugin = function () {}

  window.plugin.Mediagress = function () {}

  // Name of the IITC build for first-party plugins
  pluginInfo.buildName = 'Mediagress'
  // Datetime-derived version of the plugin
  pluginInfo.dateTimeVersion = '202505170000'
  // ID/name of the plugin
  pluginInfo.pluginId = 'mediagress'

  async function getHasActiveSubscription () {
    return new Promise((resolve, reject) => {
      window.postAjax('getHasActiveSubscription', {}, resolve, reject)
    })
  }

  async function getInventory () {
    return new Promise((resolve, reject) => {
      window.postAjax('getInventory', {
        lastQueryTimestamp: 0
      }, resolve, reject)
    })
  }

  function getCountOfMediaOutsideCapsules (rawInventory) {
    return rawInventory.result
      .filter(item => item[2] && item[2].resourceWithLevels && item[2].resourceWithLevels.resourceType === 'MEDIA')
      .length
  }

  function getMediaFromRawInventory (rawInventory) {
    const flatOneLevel = (arrays) => [].concat.apply([], arrays)
    const mediaInCapsules = flatOneLevel(
      rawInventory
        .result
        .map(arr => arr[2])
        .filter(i => i.container && i.container.stackableItems)
        .map(i => i.container.stackableItems)
    )
      .map(i => i.exampleGameEntity && i.exampleGameEntity[2])
      .filter(i => i && i.resourceWithLevels && i.resourceWithLevels.resourceType === 'MEDIA')
    const deduplicatedByLowestAcquisition = Object.values(
      mediaInCapsules
        .filter(i => i.inInventory && i.storyItem.mediaId)
        .reduce((acc, curr) => {
          const mediaId = curr.storyItem.mediaId
          if (acc[mediaId] &&
            +acc[mediaId].inInventory.acquisitionTimestampMs < +curr.inInventory.acquisitionTimestampMs) {
            return acc
          }
          acc[mediaId] = curr
          return acc
        }, {})
    )
    return deduplicatedByLowestAcquisition
  }

function showUploadingOverlay(message = "Uploading media...") { // Message shown during upload
  const existing = document.getElementById('mediagress-uploading-overlay');
  if (existing) return;

  const overlay = document.createElement('div');
  overlay.id = 'mediagress-uploading-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '50%';
  overlay.style.left = '50%';
  overlay.style.transform = 'translate(-50%, -50%)';
  overlay.style.padding = '30px 40px';
  overlay.style.backgroundColor = '#222';
  overlay.style.color = '#fff';
  overlay.style.fontSize = '18px';
  overlay.style.borderRadius = '10px';
  overlay.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
  overlay.style.zIndex = 10000;
  overlay.style.textAlign = 'center';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.alignItems = 'center';

  // PNG spinner
  const spinnerImg = document.createElement('img');
  spinnerImg.src = 'https://ingress.plus/icons/icon_mediagress_64.png'; // Source for spinning icon
  spinnerImg.alt = 'Loading...';
  spinnerImg.style.width = '48px';
  spinnerImg.style.height = '48px';
  spinnerImg.style.marginBottom = '15px';
  spinnerImg.style.animation = 'spin 2s linear infinite';

  const text = document.createElement('div');
  text.textContent = message;

  // Add keyframes for spin animation (if not already present)
  if (!document.getElementById('mediagress-spinner-style')) {
    const style = document.createElement('style');
    style.id = 'mediagress-spinner-style';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  overlay.appendChild(spinnerImg);
  overlay.appendChild(text);
  document.body.appendChild(overlay);
}

function removeUploadingOverlay() {
  const overlay = document.getElementById('mediagress-uploading-overlay');
  if (overlay) {
    overlay.remove();
  }
}

  const settingsKey = 'mediagress'
  const defaultSettings = {
    lastUploadTimestamp: 0,
    uploadedIds: []
  }

  function getSettings () {
    const existingSettings = window.localStorage.getItem(settingsKey)
    if (!existingSettings) {
      return defaultSettings
    }
    try {
      return JSON.parse(existingSettings)
    } catch (e) {
      return defaultSettings
    }
  }

  // partial of settings object
  function saveSettings (settings) {
    const currentSettings = getSettings()
    window.localStorage.setItem(settingsKey, JSON.stringify({
      ...currentSettings,
      ...settings
    }))
  }

  let uploadInProgress = false
  async function uploadMedia () {

    if (uploadInProgress) {
      return
    }

    uploadInProgress = true

    showUploadingOverlay(); // Show the "Uploading media..." alert

    try {
      const { uploadedIds, lastUploadTimestamp } = getSettings()
      const waitTime = 1000 * 60 * 5; // 5 minutes in milliseconds, set to 0 for instant retry
      const now = Date.now();
      const timeSinceLastUpload = now - lastUploadTimestamp ;

      if (!window.IMPATIENT && timeSinceLastUpload < waitTime) {

        const timeRemaining = waitTime - timeSinceLastUpload;
        const minutes = Math.floor(timeRemaining / 60000);
        const seconds = Math.floor((timeRemaining % 60000) / 1000);

        console.log('%c[Mediagress] You can bypass the 5-minute wait to upload media by running \"window.IMPATIENT = true\" in the console. Do so at your own risk!', 'color: green');
        console.log('%c[Mediagress] We don\'t think that Niantic will warn or ban you for it, but you will likely get rate limited. The bypass will reset once you refresh the page.', 'color: green');

        return window.alert(
          `You recently tried to upload media from your inventory. 
          Niantic rate-limits inventory requests if they happen too quickly, so to ensure that you don't hit that limit, please try again in ${minutes} minute(s) and ${seconds} second(s)!`
        )
      }

        if (window.IMPATIENT) {
          console.warn('[Mediagress] Wait-time bypassed via IMPATIENT console command');
          console.warn('[Mediagress] Refresh your browser window to reset bypass');
      }

      if (!(await getHasActiveSubscription()).result) {
        uploadInProgress = false
        return window.alert(`Your inventory is only available on Intel if you have an active C.O.R.E. subscription. Without it, you cannot upload media.\n
          Please subscribe to C.O.R.E. in the Ingress app and then return here!`)
      }

      let rawInventory;
      try {
        rawInventory = await getInventory();
      } catch (inventoryError) {
        console.error('[Mediagress] Failed to fetch inventory: ', inventoryError);
        window.alert(`Failed to fetch your inventory from Intel. This might happen if:\n\n
          - Your session expired\n
          - Intel is temporarily down\n
          - The server doesn't recognize your C.O.R.E. subscription\n
          \nPlease refresh or restart IITC and try again in a moment.`);
        uploadInProgress = false;
        return;
      }

      // Intel returns '{"result":[]}' when rate limited
      if (!rawInventory || !Array.isArray(rawInventory.result) || rawInventory.result.length === 0) {
        console.warn('[Mediagress] Inventory response was empty:', rawInventory);
        window.alert(`We have received an empty inventory from Intel. This sometimes happens if:\n\n
          - You have been rate limited by trying to access your inventory too often \(via other plugins, for example\)\n
          - Your C.O.R.E. subscription recently expired\n
          - Intel is having sync issues\n
          - Ingress is currently experiencing server issues\n
          \nPlease refresh or restart IITC and try again in a few minutes.`);
        uploadInProgress = false;
        return;
      }

      const mediaOutsideCapsulesCount = getCountOfMediaOutsideCapsules(rawInventory)
      // todo use dialog?

      if (mediaOutsideCapsulesCount > 0 &&
        !window.confirm(`You currently have ${mediaOutsideCapsulesCount} Media not stored in Capsules. These won't be uploaded.\n\nPlease move them into Capsules before retrying — or continue if you don\'t want to upload them.`)) {
          uploadInProgress = false
          return
      }

      const media = getMediaFromRawInventory(rawInventory)
      const filteredMedia = media.filter((item) => !uploadedIds.flat().includes(item.storyItem.mediaId))

      if (!filteredMedia.length) {
        console.log('[Mediagress] No new media to upload, skipping')
        window.alert(`No new media has been found in your inventory since your last upload attempt. Make sure that you have loaded new Media into a Capsule and try again in 5 minutes!`)
        saveSettings({
          lastUploadTimestamp: Date.now()
        })
        uploadInProgress = false
        return
      }

      const response = await fetch(`${host}/api/mediagress/v1/upload-media`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ medias: filteredMedia, player: PLAYER })
      })

      if (response.ok) {
        const responseBody = await response.json()
        if (responseBody.previouslyUnknownMediaCount) {
          window.alert(`${filteredMedia.length} media have been uploaded, and ${responseBody.previouslyUnknownMediaCount} were new! Please give us some time to approve and categorize them before they appear on the website.`)
        } else {
          window.alert(`${filteredMedia.length} media have been uploaded. Sadly, none of them were new, but we thank you for your contribution none the less!`)
        }
        saveSettings({
          uploadedIds: [...uploadedIds.flat(), ...filteredMedia.map(item => item.storyItem.mediaId)],
          lastUploadTimestamp: Date.now()
        })
        return
      }

      const err = `${response.status} ${response.statusText}: ${await response.text()}`
      console.error(`[Mediagress] Error making request to Mediagress: ${err}`)
      window.alert(`There has been a problem contacting Mediagress. It is possible that the site is currently down.\nTry again in a few minutes or contact the developers at https://t.me/Ingress_Plus\n\nError: ${err}`)
    } catch (e) {
      window.alert(`There has been an error while trying to upload your media. Try again in a few minutes or contact the developers at https://t.me/Ingerss_Plus\n\nError: ${e}`)
      console.error(`[Mediagress] ${e}`)
    } finally {
      uploadInProgress = false
      removeUploadingOverlay(); // Remove the alert when done
    }
  }

  function setup () {
    $('<a href="#">')
      .text('Upload to Mediagress')
      .click(uploadMedia)
      .appendTo($('#toolbox'))
  }
  setup.info = pluginInfo

  if (window.iitcLoaded) {
    setup()
  } else {
    if (!window.bootPlugins) {
      window.bootPlugins = []
    }
    window.bootPlugins.push(setup)
  }
}

((() => {
  const pluginInfo = {}
  if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
    pluginInfo.script = {
      version: GM_info.script.version,
      name: GM_info.script.name,
      description: GM_info.script.description
    }
  }
  // Greasemonkey. It will be quite hard to debug
  if (typeof unsafeWindow !== 'undefined' || typeof GM_info === 'undefined' || GM_info.scriptHandler != 'Tampermonkey') {
    // inject code into site context
    const script = document.createElement('script')
    script.appendChild(document.createTextNode(`(${wrapper})(${JSON.stringify(pluginInfo)});`));
    (document.body || document.head || document.documentElement).appendChild(script)
  } else {
    // Tampermonkey, run code directly
    wrapper(pluginInfo)
  }
})())
