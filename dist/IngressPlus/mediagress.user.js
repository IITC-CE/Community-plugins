// ==UserScript==
// @author          IngressPlus
// @name            Mediagress
// @category        Misc
// @version         1.0.4
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
// Changelog 1.0.4
//   Added icon and changed description and author
//
// Changelog 1.0.3
//   Fix minor StandardJS annoyances
//
// Changelog 1.0.2
//   Display errors to the user, so it can be easily screenshot for bug reports
//
// Changelog 1.0.1
//   Edited strings to make process of uploading clearer as well as giving a better understanding of errors when they happen
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
  pluginInfo.dateTimeVersion = '202401110000'
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
    try {
      const { uploadedIds, lastUploadTimestamp } = getSettings()
      if (lastUploadTimestamp > Date.now() - 1000 * 60 * 5) {
        return window.alert('You recently tried to upload media from your inventory. Niantic rate-limits inventory requests if they happen too quickly, so to ensure that you don\'t hit that limit, please try again in 5 minutes!')
      }
      if (!(await getHasActiveSubscription()).result) {
        return window.alert('Your inventory is only available on Intel if you have an active C.O.R.E. subscription. Without it, you cannot upload media :c Please subscribe to C.O.R.E. in the Ingress app and then return here!')
      }
      const rawInventory = await getInventory()
      const mediaOutsideCapsulesCount = getCountOfMediaOutsideCapsules(rawInventory)
      // todo use dialog?
      if (mediaOutsideCapsulesCount > 0 &&
        !window.confirm(`You currently have ${mediaOutsideCapsulesCount} Media that are not loaded into a capsule; these won't be uploaded. Do you wish to proceed?`)) {
        return
      }
      const medias = getMediaFromRawInventory(rawInventory)
      const filteredMedia = medias.filter((item) => !uploadedIds.flat().includes(item.storyItem.mediaId))
      if (!filteredMedia.length) {
        console.log('No new media to upload, skipping')
        window.alert('No new media has been found in your inventory since your last upload attempt. Make sure that you have loaded new Media into a Capsule and try again in 5 minutes!')
        saveSettings({
          lastUploadTimestamp: Date.now()
        })
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
      console.error(`Error making request to Mediagress: ${err}`)
      window.alert(`Error :C please contact the developers at https://t.me/Mediagress\n\nError: ${err}`)
    } catch (e) {
      window.alert('Failed to get inventory data from Intel. Try again in a moment')
      console.error(e)
    } finally {
      uploadInProgress = false
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
