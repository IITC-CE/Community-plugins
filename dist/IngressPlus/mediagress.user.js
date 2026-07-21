// ==UserScript==
// @author          IngressPlus
// @name            Mediagress
// @category        Misc
// @version         1.0.6
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
//  Changelog 1.0.6
//    Fixed upload confirmation showing wrong count for discovered media
//    Upload confirmation now shows total uploaded, first-time uploads, and discoveries separately
//    Improved upload confirmation messaging to be more encouraging
//    Upload overlay now shows current progress step (Getting inventory / Uploading media)
//    Refactored for readability: extracted helper functions and named constants
//    Replaced native confirm dialog for media outside Capsules with an IITC dialog
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
  const WAIT_TIME_MS = 1000 * 60 * 5
  const TELEGRAM_URL = 'https://t.me/Ingress_Plus'
  const UPLOAD_ENDPOINT = `${host}/api/mediagress/v2/upload-media`

  // Make sure that window.plugin exists. IITC defines it as a no-op function,
  // and other plugins assume the same.
  if (typeof window.plugin !== 'function') window.plugin = function () {}

  window.plugin.Mediagress = function () {}

  // Name of the IITC build for first-party plugins
  pluginInfo.buildName = 'Mediagress'
  // Datetime-derived version of the plugin
  pluginInfo.dateTimeVersion = '202605200000'
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
    const mediaInCapsules = rawInventory
      .result
      .map(arr => arr[2])
      .filter(i => i.container && i.container.stackableItems)
      .map(i => i.container.stackableItems)
      .flat()
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

  function showUploadingOverlay (message = 'Uploading media…') {
    const existing = document.getElementById('mediagress-uploading-overlay')
    if (existing) return

    const overlay = document.createElement('div')
    overlay.id = 'mediagress-uploading-overlay'
    overlay.style.position = 'fixed'
    overlay.style.top = '50%'
    overlay.style.left = '50%'
    overlay.style.transform = 'translate(-50%, -50%)'
    overlay.style.padding = '30px 40px'
    overlay.style.backgroundColor = '#222'
    overlay.style.color = '#fff'
    overlay.style.fontSize = '18px'
    overlay.style.borderRadius = '10px'
    overlay.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
    overlay.style.zIndex = 10000
    overlay.style.textAlign = 'center'
    overlay.style.display = 'flex'
    overlay.style.flexDirection = 'column'
    overlay.style.alignItems = 'center'

    const spinnerImg = document.createElement('img')
    spinnerImg.src = 'https://ingress.plus/icons/icon_mediagress_64.png'
    spinnerImg.alt = 'Loading...'
    spinnerImg.style.width = '48px'
    spinnerImg.style.height = '48px'
    spinnerImg.style.marginBottom = '15px'
    spinnerImg.style.animation = 'spin 2s linear infinite'

    const text = document.createElement('div')
    text.id = 'mediagress-overlay-text'
    text.textContent = message

    if (!document.getElementById('mediagress-spinner-style')) {
      const style = document.createElement('style')
      style.id = 'mediagress-spinner-style'
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `
      document.head.appendChild(style)
    }

    overlay.appendChild(spinnerImg)
    overlay.appendChild(text)
    document.body.appendChild(overlay)
  }

  function updateUploadingOverlay (message) {
    const text = document.getElementById('mediagress-overlay-text')
    if (text) text.textContent = message
    else showUploadingOverlay(message)
  }

  function removeUploadingOverlay () {
    const overlay = document.getElementById('mediagress-uploading-overlay')
    if (overlay) overlay.remove()
  }

  const settingsKey = 'mediagress'
  const defaultSettings = {
    lastUploadTimestamp: 0,
    uploadedIds: []
  }

  function getSettings () {
    const existingSettings = window.localStorage.getItem(settingsKey)
    if (!existingSettings) {
      return { ...defaultSettings }
    }
    try {
      return JSON.parse(existingSettings)
    } catch (e) {
      return { ...defaultSettings }
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

  function getRemainingWaitMs (lastUploadTimestamp) {
    return Math.max(0, WAIT_TIME_MS - (Date.now() - lastUploadTimestamp))
  }

  function buildUploadSuccessMessage (uploadedCount, firstTimeCount, discoveredCount, discoveredTitles) {
    const lines = []
    lines.push(`You have uploaded ${uploadedCount} media.`)
    if (firstTimeCount > 0) {
      lines.push(`Of those, you have uploaded ${firstTimeCount} for the first time!`)
    }
    if (discoveredCount > 0) {
      lines.push(`You have discovered ${discoveredCount} new Media (new to Mediagress)!`)
      if (Array.isArray(discoveredTitles) && discoveredTitles.length > 0) {
        lines.push('')
        lines.push('Newly discovered media:')
        discoveredTitles.forEach(title => lines.push(`- ${title}`))
      }
    } else {
      lines.push('Mediagress already knew about all of these - but do keep uploading if you find new media, you might discover new ones next time!')
    }
    lines.push('')
    lines.push('Thank you for your contribution!')
    return lines.join('\n')
  }

  function confirmWithIITC (title, html) {
    return new Promise((resolve) => {
      let answered = false
      $('<div>').html(html).dialog({
        title,
        width: 'auto',
        modal: false,
        open: function () {
          $(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').hide()
        },
        buttons: [
          {
            text: 'Cancel',
            click: function () {
              answered = true
              resolve(false)
              $(this).dialog('close')
            }
          },
          {
            text: 'Upload anyway',
            click: function () {
              answered = true
              resolve(true)
              $(this).dialog('close')
            }
          }
        ],
        close: function () {
          if (!answered) resolve(false)
          $(this).dialog('destroy').remove()
        }
      })
    })
  }

  let uploadInProgress = false
  async function uploadMedia () {

    if (uploadInProgress) {
      return
    }

    uploadInProgress = true

    showUploadingOverlay('Getting inventory…')

    try {
      const { uploadedIds: rawUploadedIds, lastUploadTimestamp } = getSettings()
      const uploadedIds = rawUploadedIds.flat()
      const remainingWaitMs = getRemainingWaitMs(lastUploadTimestamp)

      if (!window.IMPATIENT && remainingWaitMs > 0) {
        const minutes = Math.floor(remainingWaitMs / 60000)
        const seconds = Math.floor((remainingWaitMs % 60000) / 1000)

        console.log('%c[Mediagress] You can bypass the 5-minute wait to upload media by running \"window.IMPATIENT = true\" in the console. Do so at your own risk!', 'color: green')
        console.log('%c[Mediagress] We don\'t think that Niantic will warn or ban you for it, but you will likely get rate limited. The bypass will reset once you refresh the page.', 'color: green')

        return window.alert(
          `You recently tried to upload media from your inventory. Niantic rate-limits inventory requests if they happen too quickly, so to ensure that you don't hit that limit, please try again in ${minutes} minute(s) and ${seconds} second(s)!`
        )
      }

      if (window.IMPATIENT) {
        console.warn('[Mediagress] Wait-time bypassed via IMPATIENT console command')
        console.warn('[Mediagress] Refresh your browser window to reset bypass')
      }

      if (!(await getHasActiveSubscription()).result) {
        return window.alert(`Your inventory is only available on Intel if you have an active C.O.R.E. subscription. Without it, you cannot upload media.\n
          Please subscribe to C.O.R.E. in the Ingress app and then return here!`)
      }

      let rawInventory
      try {
        rawInventory = await getInventory()
      } catch (inventoryError) {
        console.error('[Mediagress] Failed to fetch inventory: ', inventoryError)
        window.alert(`Failed to fetch your inventory from Intel. This might happen if:\n\n
          - Your session expired\n
          - Intel is temporarily down\n
          - The server doesn't recognize your C.O.R.E. subscription\n
          \nPlease refresh or restart IITC and try again in a moment.`)
        return
      }

      // Intel returns '{"result":[]}' when rate limited
      if (!rawInventory || !Array.isArray(rawInventory.result) || rawInventory.result.length === 0) {
        console.warn('[Mediagress] Inventory response was empty:', rawInventory)
        window.alert(`We have received an empty inventory from Intel. This sometimes happens if:\n\n
          - You have been rate limited by trying to access your inventory too often \(including via other plugins, for example\)\n
          - Your C.O.R.E. subscription recently expired\n
          - Intel is having sync issues\n
          - Ingress is currently experiencing server issues\n
          \nPlease refresh or restart IITC and try again in a few minutes.`)
        return
      }

      const mediaOutsideCapsulesCount = getCountOfMediaOutsideCapsules(rawInventory)

      if (mediaOutsideCapsulesCount > 0) {
        removeUploadingOverlay()
        const proceed = await confirmWithIITC(
          'Media outside Capsules',
          `<p>You currently have ${mediaOutsideCapsulesCount} Media not stored in Capsules. These won't be uploaded.</p>
          <p>Please move them into Capsules before retrying - or continue if you don't want to upload them.</p>`
        )
        if (!proceed) return
      }

      const media = getMediaFromRawInventory(rawInventory)
      const filteredMedia = media.filter((item) => !uploadedIds.includes(item.storyItem.mediaId))

      if (!filteredMedia.length) {
        console.log('[Mediagress] No new media to upload, skipping')
        window.alert(`No new media has been found in your inventory since your last upload attempt. Make sure that you have loaded new Media into a Capsule and try again in 5 minutes!`)
        saveSettings({
          lastUploadTimestamp: Date.now()
        })
        return
      }

      updateUploadingOverlay('Uploading media…')
      const response = await fetch(UPLOAD_ENDPOINT, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ medias: filteredMedia, player: PLAYER })
      })

      // Response: {"firstTimeUserUploadCount":0,"newMediaTitles":null,"previouslyUnknownMediaCount":0}

      if (response.ok) {
        const responseBody = await response.json()
        window.alert(buildUploadSuccessMessage(
          filteredMedia.length,
          responseBody.firstTimeUserUploadCount || 0,
          responseBody.previouslyUnknownMediaCount || 0,
          responseBody.newMediaTitles
        ))
        saveSettings({
          uploadedIds: [...uploadedIds, ...filteredMedia.map(item => item.storyItem.mediaId)],
          lastUploadTimestamp: Date.now()
        })
        return
      }

      const err = `${response.status} ${response.statusText}: ${await response.text()}`
      console.error(`[Mediagress] Error making request to Mediagress: ${err}`)
      window.alert(`There has been a problem contacting Mediagress. It is possible that the site is currently down.\nTry again in a few minutes or contact the developers at ${TELEGRAM_URL}\n\nError: ${err}`)
    } catch (e) {
      window.alert(`There has been an error while trying to upload your media. Try again in a few minutes or contact the developers at ${TELEGRAM_URL}\n\nError: ${e}`)
      console.error(`[Mediagress] ${e}`)
    } finally {
      uploadInProgress = false
      removeUploadingOverlay()
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