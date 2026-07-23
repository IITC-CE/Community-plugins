// ==UserScript==
// @author          emgeka
// @id              anchor-planner@emgeka
// @name            Anchor Planner
// @category        Layer
// @version         0.1.46
// @namespace       https://example.local/iitc
// @description     Anchor Planner: scans Draw Tools plans, resolves portal names, lists plan portals and key counts.
// @updateURL       https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/emgeka/anchor-planner.meta.js
// @downloadURL     https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/emgeka/anchor-planner.user.js
// @homepageURL     https://github.com/emgeka/iitc-anchor-planner
// @supportURL      https://github.com/emgeka/iitc-anchor-planner/issues
// @issueTracker    https://github.com/emgeka/iitc-anchor-planner/issues
// @depends         draw-tools@breunigs
// @recommends      bookmarks@ZasoGD
// @antiFeatures    scraper|export
// @include         https://intel.ingress.com/*
// @include         http://intel.ingress.com/*
// @match           https://intel.ingress.com/*
// @match           http://intel.ingress.com/*
// @grant           none
// ==/UserScript==


function wrapper(plugin_info) {
  'use strict';

  if (typeof window.plugin !== 'function') window.plugin = function () {};

  plugin_info.buildName = 'local';
  plugin_info.dateTimeVersion = '20260716144721';
  plugin_info.pluginId = 'anchor-planner';

  window.plugin.anchorPlanner = function () {};
  var ap = window.plugin.anchorPlanner;

  ap.VERSION = '0.1.46';
  ap.STORAGE_KEY = 'plugin-anchor-planner-v1';
  ap.DEFAULT_TOLERANCE_M = 25;
  ap.MIN_ANCHOR_LINKS = 3;
  ap.PANE_NAME = 'anchorPlannerPane';
  ap.FALLBACK_LANGUAGE = 'en';
  ap.MISSING_TITLE = '';

  // AP_LOCALES_START
  ap.LOCALES = {
    "de": {
      "language.label": "Sprache",
      "language.auto": "Automatisch",
      "language.name": "Deutsch",
      "portal.nameMissing": "Name nicht geladen",
      "portal.nameMissingCoordinates": "Portalname nicht geladen ({lat}, {lng})",
      "portal.nameMissingPlain": "Portalname nicht geladen",
      "portal.generic": "Portal",
      "portal.manuallyAssigned": "Manuell zugeordnet",
      "route.noLocation": "Noch kein IITC-Standort verfügbar. Bitte zuerst die IITC-Standortfunktion aktivieren.",
      "route.noOpenPlanPortals": "Keine offenen Planportale vorhanden.",
      "route.planPortal": "Planportal",
      "route.blockerPortal": "Blocker-Portal",
      "route.next": "Nächstes {type}:",
      "route.nextFromLocation": "Nächstes {type} ab Standort:",
      "route.complete": "Alle Routenziele erledigt.",
      "route.distanceTitle": "Luftlinienentfernung vom IITC-Standort",
      "route.remainingTitle": "Geschätzte verbleibende Luftlinienroute",
      "route.remaining": "Rest ca. {distance}",
      "route.target.one": "{count} Ziel",
      "route.target.other": "{count} Ziele",
      "route.aerial": "Luftlinie",
      "scan.drawToolsMissing": "Draw Tools nicht gefunden. Bitte Draw Tools aktivieren.",
      "status.done": "abgearbeitet",
      "status.blocked": "blockiert",
      "status.existing": "keine Keys nötig",
      "status.ready": "bereit",
      "status.partial": "teilweise",
      "status.keysMissing": "Keys fehlen",
      "readiness.readyLoaded": "Bereit (geladener Stand)",
      "readiness.rescan": "Neu scannen",
      "readiness.sessionMissing": "Sitzungsdaten fehlen",
      "readiness.openEndpoint.one": "{count} offener Endpunkt",
      "readiness.openEndpoint.other": "{count} offene Endpunkte",
      "readiness.blockedPlanLink.one": "{count} Planlink blockiert",
      "readiness.blockedPlanLink.other": "{count} Planlinks blockiert",
      "readiness.missingKey.one": "{count} Key fehlt",
      "readiness.missingKey.other": "{count} Keys fehlen",
      "readiness.missingName.one": "{count} Name fehlt",
      "readiness.missingName.other": "{count} Namen fehlen",
      "readiness.unusableLink.one": "{count} Link nicht auswertbar",
      "readiness.unusableLink.other": "{count} Links nicht auswertbar",
      "readiness.noPlan": "kein Planlink erkannt",
      "readiness.notReady": "Nicht bereit",
      "readiness.check": "Prüfen",
      "readiness.title": "Einsatzcheck:",
      "readiness.unconfirmed.one": "{count} Planlink nicht bestätigt",
      "readiness.unconfirmed.other": "{count} Planlinks nicht bestätigt",
      "readiness.keyPortal.one": "Keys fehlen an {count} Portal",
      "readiness.keyPortal.other": "Keys fehlen an {count} Portalen",
      "readiness.loadedLink.one": "{count} vorhandener Link geladen",
      "readiness.loadedLink.other": "{count} vorhandene Links geladen",
      "readiness.unusableLoaded": "{count} davon nicht auswertbar",
      "message.intersectionUnknown": "Kreuzungspunkt konnte nicht bestimmt werden.",
      "message.namesNoneMissing": "Keine fehlenden Portalnamen im aktuellen Scan.",
      "message.namesLoadingAuto": "Lade Portalnamen automatisch nach: {current}/{total} …",
      "message.namesLoading": "Lade Portalnamen nach: {current}/{total} …",
      "message.namesLoadedAuto": "Portalnamen automatisch nachgeladen.",
      "message.namesLoaded": "Portalnamen nachgeladen.",
      "message.namesUnavailable": "Falls noch Namen fehlen, sind die Details nicht verfügbar.",
      "message.copied": "In die Zwischenablage kopiert.",
      "share.section": "Teilen",
      "share.copyText": "Text kopieren",
      "share.locate": "Lokalisieren",
      "share.dialogTitle": "Portal teilen / lokalisieren",
      "share.prompt": "Portal teilen:",
      "export.planOverview": "Planübersicht",
      "export.copyPlan": "Plan kopieren",
      "export.saveTxt": "Als TXT speichern",
      "export.share": "Teilen",
      "export.copyJson": "JSON kopieren",
      "export.saveJson": "Als JSON speichern",
      "export.dialogTitle": "Anchor Planner – Export / Teilen",
      "export.copyPrompt": "Kopieren:",
      "export.exportPrompt": "Export kopieren:",
      "export.copyPlanPrompt": "Planübersicht kopieren:",
      "export.copyJsonPrompt": "JSON kopieren:",
      "export.planPrompt": "Anchor Planner – Planübersicht",
      "confirm.clearData": "Anchor-Planner-Daten löschen? Draw-Tools-Zeichnungen bleiben unverändert.",
      "confirm.clearAssignments": "Alle manuellen Endpunkt-Zuordnungen löschen?",
      "panel.planPortal.one": "{count} Planportal",
      "panel.planPortal.other": "{count} Planportale",
      "action.scan": "Scannen",
      "action.more": "Mehr",
      "action.loadNames": "Namen laden",
      "action.exportShare": "Export / Teilen",
      "action.sortLocation": "Ab Standort sortieren",
      "action.sortLocationTitle": "Luftlinien-Näherungsroute ab dem zuletzt von IITC gemeldeten Standort",
      "action.clearData": "Daten löschen",
      "settings.tolerance": "Toleranz",
      "settings.standard": "Standard",
      "filter.aria": "Portalliste filtern",
      "filter.all": "Alle",
      "filter.open": "Offen",
      "filter.blocked": "Blockiert",
      "filter.keysMissing": "Keys fehlen",
      "filter.done": "Erledigt",
      "scan.summaryLink.one": "{count} Link",
      "scan.summaryLink.other": "{count} Links",
      "scan.summaryPortal.one": "{count} Planportal",
      "scan.summaryPortal.other": "{count} Planportale",
      "scan.summaryEndpoint.one": "{count} offener Endpunkt",
      "scan.summaryEndpoint.other": "{count} offene Endpunkte",
      "diagnostics.openEndpoints": "Offene Endpunkte:",
      "diagnostics.help": "Wenn Draw Tools/Auto Draw hier keine verwertbaren Portaldaten liefert: auf den betreffenden Bereich zoomen, warten bis IITC die Portale geladen hat, dann erneut scannen bzw. Namen laden.",
      "diagnostics.segment": "Segment {segment}{end}:",
      "diagnostics.nearestPortal": "nächstes IITC-Portal: {title} ({distance} m)",
      "diagnostics.noPortal": "kein geladenes IITC-Portal gefunden",
      "diagnostics.drawObject": "Draw-Tools-Objekt:",
      "diagnostics.title": "Titel:",
      "diagnostics.drawPoints": "Nächste Draw-Tools-Punkte:",
      "diagnostics.iitcPortals": "Nächste IITC-Portale:",
      "panel.initialHelp": "Draw Tools/Auto Draw Plan erzeugen und dann scannen. Portal-Bookmarks werden bevorzugt ausgewertet; fehlende Namen werden anschließend automatisch nachgeladen.",
      "blocker.title": "Blocker",
      "blocker.blockLink.one": "{count} Blocklink",
      "blocker.blockLink.other": "{count} Blocklinks",
      "blocker.endPortal.one": "{count} Endportal",
      "blocker.endPortal.other": "{count} Endportale",
      "blocker.selected": "{count} vorgemerkt",
      "blocker.endpointOf.one": "Endpunkt von {count} Blocklink",
      "blocker.endpointOf.other": "Endpunkt von {count} Blocklinks",
      "blocker.openPlanPortal": "bereits offenes Planportal",
      "blocker.donePlanPortal": "Planportal erledigt",
      "blocker.mapLegend": "Karte: Plan pink · Blocker türkis · Kreuzung gelb",
      "row.keys": "Keys {owned}/{required}",
      "row.links": "Links: {count}",
      "row.existing": "vorhanden: {count}",
      "row.open": "offen: {count}",
      "row.blocked": "davon blockiert: {count}",
      "row.keysNeeded": "Keys benötigt",
      "row.moveUp": "In der Reihenfolge nach oben",
      "row.moveDown": "In der Reihenfolge nach unten",
      "row.done": "erledigt",
      "row.actions": "Aktionen",
      "row.emptyFilter": "Keine Planportale für diesen Filter.",
      "overlay.keysNeeded": "Keys benötigt {owned}/{required}",
      "text.plan": "Plan: {links}, {portals}",
      "text.planLinkCount.one": "{count} Link",
      "text.planLinkCount.other": "{count} Links",
      "text.planPortalCount.one": "{count} Planportal",
      "text.planPortalCount.other": "{count} Planportale",
      "text.existing": "Vorhandene Links: {existing} · nicht bestätigt: {unconfirmed}",
      "text.done": "Portale erledigt: {done}/{total}",
      "text.keys": "Keys: vorhanden {owned} / benötigt {required}",
      "text.blockers": "Blocker:",
      "text.planLink": "Planlink:",
      "text.loadedLinksHint": "Hinweis: Geprüft wurden nur die aktuell in IITC geladenen vorhandenen Links.",
      "text.doneSuffix": "erledigt",
      "text.address": "Adresse:",
      "text.links": "Links: {total} · vorhanden: {existing} · offen: {open} · davon blockiert: {blocked}",
      "text.keysPortal": "Keys: {owned}/{required}",
      "text.note": "Notiz:"
    },
    "en": {
      "language.label": "Language",
      "language.auto": "Automatic",
      "language.name": "English",
      "portal.nameMissing": "Name not loaded",
      "portal.nameMissingCoordinates": "Portal name not loaded ({lat}, {lng})",
      "portal.nameMissingPlain": "Portal name not loaded",
      "portal.generic": "Portal",
      "portal.manuallyAssigned": "Manually assigned",
      "route.noLocation": "No IITC location is available yet. Please enable IITC User Location first.",
      "route.noOpenPlanPortals": "No open plan portals available.",
      "route.planPortal": "plan portal",
      "route.blockerPortal": "blocker portal",
      "route.next": "Next {type}:",
      "route.nextFromLocation": "Next {type} from location:",
      "route.complete": "All route targets completed.",
      "route.distanceTitle": "Straight-line distance from the IITC location",
      "route.remainingTitle": "Estimated remaining straight-line route",
      "route.remaining": "Remaining approx. {distance}",
      "route.target.one": "{count} target",
      "route.target.other": "{count} targets",
      "route.aerial": "straight line",
      "scan.drawToolsMissing": "Draw Tools not found. Please enable Draw Tools.",
      "status.done": "completed",
      "status.blocked": "blocked",
      "status.existing": "no keys needed",
      "status.ready": "ready",
      "status.partial": "partial",
      "status.keysMissing": "keys missing",
      "readiness.readyLoaded": "Ready (loaded data)",
      "readiness.rescan": "Scan again",
      "readiness.sessionMissing": "Session data missing",
      "readiness.openEndpoint.one": "{count} open endpoint",
      "readiness.openEndpoint.other": "{count} open endpoints",
      "readiness.blockedPlanLink.one": "{count} plan link blocked",
      "readiness.blockedPlanLink.other": "{count} plan links blocked",
      "readiness.missingKey.one": "{count} key missing",
      "readiness.missingKey.other": "{count} keys missing",
      "readiness.missingName.one": "{count} name missing",
      "readiness.missingName.other": "{count} names missing",
      "readiness.unusableLink.one": "{count} link cannot be evaluated",
      "readiness.unusableLink.other": "{count} links cannot be evaluated",
      "readiness.noPlan": "no plan link detected",
      "readiness.notReady": "Not ready",
      "readiness.check": "Check",
      "readiness.title": "Readiness:",
      "readiness.unconfirmed.one": "{count} plan link unconfirmed",
      "readiness.unconfirmed.other": "{count} plan links unconfirmed",
      "readiness.keyPortal.one": "Keys missing at {count} portal",
      "readiness.keyPortal.other": "Keys missing at {count} portals",
      "readiness.loadedLink.one": "{count} existing link loaded",
      "readiness.loadedLink.other": "{count} existing links loaded",
      "readiness.unusableLoaded": "{count} of them cannot be evaluated",
      "message.intersectionUnknown": "The intersection point could not be determined.",
      "message.namesNoneMissing": "No portal names are missing from the current scan.",
      "message.namesLoadingAuto": "Loading portal names automatically: {current}/{total} …",
      "message.namesLoading": "Loading portal names: {current}/{total} …",
      "message.namesLoadedAuto": "Portal names loaded automatically.",
      "message.namesLoaded": "Portal names loaded.",
      "message.namesUnavailable": "If names are still missing, their details are unavailable.",
      "message.copied": "Copied to the clipboard.",
      "share.section": "Share",
      "share.copyText": "Copy text",
      "share.locate": "Locate",
      "share.dialogTitle": "Share / locate portal",
      "share.prompt": "Share portal:",
      "export.planOverview": "Plan overview",
      "export.copyPlan": "Copy plan",
      "export.saveTxt": "Save as TXT",
      "export.share": "Share",
      "export.copyJson": "Copy JSON",
      "export.saveJson": "Save as JSON",
      "export.dialogTitle": "Anchor Planner – Export / Share",
      "export.copyPrompt": "Copy:",
      "export.exportPrompt": "Copy export:",
      "export.copyPlanPrompt": "Copy plan overview:",
      "export.copyJsonPrompt": "Copy JSON:",
      "export.planPrompt": "Anchor Planner – Plan overview",
      "confirm.clearData": "Delete Anchor Planner data? Draw Tools drawings will remain unchanged.",
      "confirm.clearAssignments": "Delete all manual endpoint assignments?",
      "panel.planPortal.one": "{count} plan portal",
      "panel.planPortal.other": "{count} plan portals",
      "action.scan": "Scan",
      "action.more": "More",
      "action.loadNames": "Load names",
      "action.exportShare": "Export / Share",
      "action.sortLocation": "Sort from location",
      "action.sortLocationTitle": "Straight-line approximate route from the last location reported by IITC",
      "action.clearData": "Delete data",
      "settings.tolerance": "Tolerance",
      "settings.standard": "Default",
      "filter.aria": "Filter portal list",
      "filter.all": "All",
      "filter.open": "Open",
      "filter.blocked": "Blocked",
      "filter.keysMissing": "Keys missing",
      "filter.done": "Completed",
      "scan.summaryLink.one": "{count} link",
      "scan.summaryLink.other": "{count} links",
      "scan.summaryPortal.one": "{count} plan portal",
      "scan.summaryPortal.other": "{count} plan portals",
      "scan.summaryEndpoint.one": "{count} open endpoint",
      "scan.summaryEndpoint.other": "{count} open endpoints",
      "diagnostics.openEndpoints": "Open endpoints:",
      "diagnostics.help": "If Draw Tools/Auto Draw does not provide usable portal data here, zoom to the affected area, wait for IITC to load the portals, then scan again or load names.",
      "diagnostics.segment": "Segment {segment}{end}:",
      "diagnostics.nearestPortal": "nearest IITC portal: {title} ({distance} m)",
      "diagnostics.noPortal": "no loaded IITC portal found",
      "diagnostics.drawObject": "Draw Tools object:",
      "diagnostics.title": "Title:",
      "diagnostics.drawPoints": "Nearest Draw Tools points:",
      "diagnostics.iitcPortals": "Nearest IITC portals:",
      "panel.initialHelp": "Create a Draw Tools/Auto Draw plan and then scan. Portal bookmarks are preferred; missing names are loaded automatically afterwards.",
      "blocker.title": "Blockers",
      "blocker.blockLink.one": "{count} blocking link",
      "blocker.blockLink.other": "{count} blocking links",
      "blocker.endPortal.one": "{count} endpoint portal",
      "blocker.endPortal.other": "{count} endpoint portals",
      "blocker.selected": "{count} selected",
      "blocker.endpointOf.one": "Endpoint of {count} blocking link",
      "blocker.endpointOf.other": "Endpoint of {count} blocking links",
      "blocker.openPlanPortal": "already an open plan portal",
      "blocker.donePlanPortal": "plan portal completed",
      "blocker.mapLegend": "Map: plan pink · blockers cyan · intersections yellow",
      "row.keys": "Keys {owned}/{required}",
      "row.links": "Links: {count}",
      "row.existing": "existing: {count}",
      "row.open": "open: {count}",
      "row.blocked": "blocked: {count}",
      "row.keysNeeded": "Keys needed",
      "row.moveUp": "Move up in the order",
      "row.moveDown": "Move down in the order",
      "row.done": "completed",
      "row.actions": "Actions",
      "row.emptyFilter": "No plan portals match this filter.",
      "overlay.keysNeeded": "Keys needed {owned}/{required}",
      "text.plan": "Plan: {links}, {portals}",
      "text.planLinkCount.one": "{count} link",
      "text.planLinkCount.other": "{count} links",
      "text.planPortalCount.one": "{count} plan portal",
      "text.planPortalCount.other": "{count} plan portals",
      "text.existing": "Existing links: {existing} · unconfirmed: {unconfirmed}",
      "text.done": "Portals completed: {done}/{total}",
      "text.keys": "Keys: owned {owned} / needed {required}",
      "text.blockers": "Blockers:",
      "text.planLink": "Plan link:",
      "text.loadedLinksHint": "Note: Only existing links currently loaded in IITC were checked.",
      "text.doneSuffix": "completed",
      "text.address": "Address:",
      "text.links": "Links: {total} · existing: {existing} · open: {open} · blocked: {blocked}",
      "text.keysPortal": "Keys: {owned}/{required}",
      "text.note": "Note:"
    },
    "es": {
      "language.label": "Idioma",
      "language.auto": "Automático",
      "language.name": "Español",
      "portal.nameMissing": "Nombre no cargado",
      "portal.nameMissingCoordinates": "Nombre no cargado ({lat}, {lng})",
      "portal.nameMissingPlain": "Nombre no cargado",
      "portal.generic": "Portal",
      "portal.manuallyAssigned": "Asignado manualmente",
      "route.noLocation": "Aún no hay ubicación IITC. Activa Ubicación de usuario de IITC.",
      "route.noOpenPlanPortals": "No hay portales de plan abiertos.",
      "route.planPortal": "portal del plan",
      "route.blockerPortal": "portal bloqueador",
      "route.next": "Siguiente {type}:",
      "route.nextFromLocation": "Siguiente {type} desde aquí:",
      "route.complete": "Todos los destinos completados.",
      "route.distanceTitle": "Distancia en línea recta desde la ubicación IITC",
      "route.remainingTitle": "Ruta restante estimada en línea recta",
      "route.remaining": "Quedan aprox. {distance}",
      "route.target.one": "{count} destino",
      "route.target.other": "{count} destinos",
      "route.aerial": "línea recta",
      "scan.drawToolsMissing": "No se encontró Draw Tools. Actívalo.",
      "status.done": "completado",
      "status.blocked": "bloqueado",
      "status.existing": "sin llaves",
      "status.ready": "listo",
      "status.partial": "parcial",
      "status.keysMissing": "faltan llaves",
      "readiness.readyLoaded": "Listo (datos cargados)",
      "readiness.rescan": "Volver a escanear",
      "readiness.sessionMissing": "Faltan datos de sesión",
      "readiness.openEndpoint.one": "{count} extremo abierto",
      "readiness.openEndpoint.other": "{count} extremos abiertos",
      "readiness.blockedPlanLink.one": "{count} enlace bloqueado",
      "readiness.blockedPlanLink.other": "{count} enlaces bloqueados",
      "readiness.missingKey.one": "falta {count} llave",
      "readiness.missingKey.other": "faltan {count} llaves",
      "readiness.missingName.one": "falta {count} nombre",
      "readiness.missingName.other": "faltan {count} nombres",
      "readiness.unusableLink.one": "{count} enlace no evaluable",
      "readiness.unusableLink.other": "{count} enlaces no evaluables",
      "readiness.noPlan": "no se detectó ningún enlace de plan",
      "readiness.notReady": "No listo",
      "readiness.check": "Revisar",
      "readiness.title": "Comprobación:",
      "readiness.unconfirmed.one": "{count} enlace sin confirmar",
      "readiness.unconfirmed.other": "{count} enlaces sin confirmar",
      "readiness.keyPortal.one": "Faltan llaves en {count} portal",
      "readiness.keyPortal.other": "Faltan llaves en {count} portales",
      "readiness.loadedLink.one": "{count} enlace existente cargado",
      "readiness.loadedLink.other": "{count} enlaces existentes cargados",
      "readiness.unusableLoaded": "{count} no evaluables",
      "message.intersectionUnknown": "No se pudo determinar la intersección.",
      "message.namesNoneMissing": "No faltan nombres en el escaneo actual.",
      "message.namesLoadingAuto": "Cargando nombres: {current}/{total}…",
      "message.namesLoading": "Cargando nombres: {current}/{total}…",
      "message.namesLoadedAuto": "Nombres cargados automáticamente.",
      "message.namesLoaded": "Nombres cargados.",
      "message.namesUnavailable": "Si aún faltan nombres, sus detalles no están disponibles.",
      "message.copied": "Copiado al portapapeles.",
      "share.section": "Compartir",
      "share.copyText": "Copiar texto",
      "share.locate": "Localizar",
      "share.dialogTitle": "Compartir / localizar portal",
      "share.prompt": "Compartir portal:",
      "export.planOverview": "Resumen del plan",
      "export.copyPlan": "Copiar plan",
      "export.saveTxt": "Guardar TXT",
      "export.share": "Compartir",
      "export.copyJson": "Copiar JSON",
      "export.saveJson": "Guardar JSON",
      "export.dialogTitle": "Anchor Planner – Exportar / compartir",
      "export.copyPrompt": "Copiar:",
      "export.exportPrompt": "Copiar exportación:",
      "export.copyPlanPrompt": "Copiar resumen del plan:",
      "export.copyJsonPrompt": "Copiar JSON:",
      "export.planPrompt": "Anchor Planner – Resumen del plan",
      "confirm.clearData": "¿Borrar los datos de Anchor Planner? Los dibujos de Draw Tools se conservarán.",
      "confirm.clearAssignments": "¿Borrar todas las asignaciones manuales de extremos?",
      "panel.planPortal.one": "{count} portal del plan",
      "panel.planPortal.other": "{count} portales del plan",
      "action.scan": "Escanear",
      "action.more": "Más",
      "action.loadNames": "Cargar nombres",
      "action.exportShare": "Exportar / compartir",
      "action.sortLocation": "Ordenar desde aquí",
      "action.sortLocationTitle": "Ruta aproximada en línea recta desde la última ubicación IITC",
      "action.clearData": "Borrar datos",
      "settings.tolerance": "Tolerancia",
      "settings.standard": "Predet.",
      "filter.aria": "Filtrar lista de portales",
      "filter.all": "Todos",
      "filter.open": "Abiertos",
      "filter.blocked": "Bloqueados",
      "filter.keysMissing": "Faltan llaves",
      "filter.done": "Hechos",
      "scan.summaryLink.one": "{count} enlace",
      "scan.summaryLink.other": "{count} enlaces",
      "scan.summaryPortal.one": "{count} portal del plan",
      "scan.summaryPortal.other": "{count} portales del plan",
      "scan.summaryEndpoint.one": "{count} extremo abierto",
      "scan.summaryEndpoint.other": "{count} extremos abiertos",
      "diagnostics.openEndpoints": "Extremos abiertos:",
      "diagnostics.help": "Si Draw Tools/Auto Draw no aporta datos útiles, amplía la zona, espera a que IITC cargue los portales y vuelve a escanear o carga los nombres.",
      "diagnostics.segment": "Segmento {segment}{end}:",
      "diagnostics.nearestPortal": "portal IITC más cercano: {title} ({distance} m)",
      "diagnostics.noPortal": "no se encontró ningún portal IITC cargado",
      "diagnostics.drawObject": "Objeto de Draw Tools:",
      "diagnostics.title": "Título:",
      "diagnostics.drawPoints": "Puntos de Draw Tools más cercanos:",
      "diagnostics.iitcPortals": "Portales IITC más cercanos:",
      "panel.initialHelp": "Crea un plan con Draw Tools/Auto Draw y escanéalo. Se prefieren los marcadores; los nombres que falten se cargan después.",
      "blocker.title": "Bloqueadores",
      "blocker.blockLink.one": "{count} enlace bloqueador",
      "blocker.blockLink.other": "{count} enlaces bloqueadores",
      "blocker.endPortal.one": "{count} portal extremo",
      "blocker.endPortal.other": "{count} portales extremos",
      "blocker.selected": "{count} elegidos",
      "blocker.endpointOf.one": "Extremo de {count} enlace bloqueador",
      "blocker.endpointOf.other": "Extremo de {count} enlaces bloqueadores",
      "blocker.openPlanPortal": "ya es un portal abierto del plan",
      "blocker.donePlanPortal": "portal del plan completado",
      "blocker.mapLegend": "Mapa: plan rosa · bloqueadores cian · cruces amarillos",
      "row.keys": "Llaves {owned}/{required}",
      "row.links": "Enlaces: {count}",
      "row.existing": "existentes: {count}",
      "row.open": "abiertos: {count}",
      "row.blocked": "bloqueados: {count}",
      "row.keysNeeded": "Llaves necesarias",
      "row.moveUp": "Subir en el orden",
      "row.moveDown": "Bajar en el orden",
      "row.done": "hecho",
      "row.actions": "Acciones",
      "row.emptyFilter": "No hay portales para este filtro.",
      "overlay.keysNeeded": "Llaves {owned}/{required}",
      "text.plan": "Plan: {links}, {portals}",
      "text.planLinkCount.one": "{count} enlace",
      "text.planLinkCount.other": "{count} enlaces",
      "text.planPortalCount.one": "{count} portal del plan",
      "text.planPortalCount.other": "{count} portales del plan",
      "text.existing": "Enlaces existentes: {existing} · sin confirmar: {unconfirmed}",
      "text.done": "Portales completados: {done}/{total}",
      "text.keys": "Llaves: disponibles {owned} / necesarias {required}",
      "text.blockers": "Bloqueadores:",
      "text.planLink": "Enlace del plan:",
      "text.loadedLinksHint": "Nota: solo se comprobaron los enlaces existentes cargados actualmente en IITC.",
      "text.doneSuffix": "hecho",
      "text.address": "Dirección:",
      "text.links": "Enlaces: {total} · existentes: {existing} · abiertos: {open} · bloqueados: {blocked}",
      "text.keysPortal": "Llaves: {owned}/{required}",
      "text.note": "Nota:"
    },
    "fr": {
      "language.label": "Langue",
      "language.auto": "Automatique",
      "language.name": "Français",
      "portal.nameMissing": "Nom non chargé",
      "portal.nameMissingCoordinates": "Nom non chargé ({lat}, {lng})",
      "portal.nameMissingPlain": "Nom non chargé",
      "portal.generic": "Portail",
      "portal.manuallyAssigned": "Assigné manuellement",
      "route.noLocation": "Aucune position IITC disponible. Activez IITC User Location.",
      "route.noOpenPlanPortals": "Aucun portail de plan ouvert.",
      "route.planPortal": "portail du plan",
      "route.blockerPortal": "portail bloqueur",
      "route.next": "Prochain {type} :",
      "route.nextFromLocation": "Prochain {type} depuis ici :",
      "route.complete": "Tous les objectifs sont terminés.",
      "route.distanceTitle": "Distance à vol d’oiseau depuis la position IITC",
      "route.remainingTitle": "Trajet restant estimé à vol d’oiseau",
      "route.remaining": "Reste env. {distance}",
      "route.target.one": "{count} objectif",
      "route.target.other": "{count} objectifs",
      "route.aerial": "à vol d’oiseau",
      "scan.drawToolsMissing": "Draw Tools introuvable. Activez-le.",
      "status.done": "terminé",
      "status.blocked": "bloqué",
      "status.existing": "aucune clé requise",
      "status.ready": "prêt",
      "status.partial": "partiel",
      "status.keysMissing": "clés manquantes",
      "readiness.readyLoaded": "Prêt (données chargées)",
      "readiness.rescan": "Réanalyser",
      "readiness.sessionMissing": "Données de session absentes",
      "readiness.openEndpoint.one": "{count} extrémité ouverte",
      "readiness.openEndpoint.other": "{count} extrémités ouvertes",
      "readiness.blockedPlanLink.one": "{count} lien du plan bloqué",
      "readiness.blockedPlanLink.other": "{count} liens du plan bloqués",
      "readiness.missingKey.one": "{count} clé manque",
      "readiness.missingKey.other": "{count} clés manquent",
      "readiness.missingName.one": "{count} nom manque",
      "readiness.missingName.other": "{count} noms manquent",
      "readiness.unusableLink.one": "{count} lien non analysable",
      "readiness.unusableLink.other": "{count} liens non analysables",
      "readiness.noPlan": "aucun lien de plan détecté",
      "readiness.notReady": "Pas prêt",
      "readiness.check": "Vérifier",
      "readiness.title": "Vérification :",
      "readiness.unconfirmed.one": "{count} lien du plan non confirmé",
      "readiness.unconfirmed.other": "{count} liens du plan non confirmés",
      "readiness.keyPortal.one": "Clés manquantes sur {count} portail",
      "readiness.keyPortal.other": "Clés manquantes sur {count} portails",
      "readiness.loadedLink.one": "{count} lien existant chargé",
      "readiness.loadedLink.other": "{count} liens existants chargés",
      "readiness.unusableLoaded": "{count} non analysables",
      "message.intersectionUnknown": "Impossible de déterminer l’intersection.",
      "message.namesNoneMissing": "Aucun nom ne manque dans l’analyse actuelle.",
      "message.namesLoadingAuto": "Chargement des noms : {current}/{total}…",
      "message.namesLoading": "Chargement des noms : {current}/{total}…",
      "message.namesLoadedAuto": "Noms chargés automatiquement.",
      "message.namesLoaded": "Noms chargés.",
      "message.namesUnavailable": "Si des noms manquent encore, leurs détails sont indisponibles.",
      "message.copied": "Copié dans le presse-papiers.",
      "share.section": "Partager",
      "share.copyText": "Copier le texte",
      "share.locate": "Localiser",
      "share.dialogTitle": "Partager / localiser le portail",
      "share.prompt": "Partager le portail :",
      "export.planOverview": "Aperçu du plan",
      "export.copyPlan": "Copier le plan",
      "export.saveTxt": "Enregistrer TXT",
      "export.share": "Partager",
      "export.copyJson": "Copier JSON",
      "export.saveJson": "Enregistrer JSON",
      "export.dialogTitle": "Anchor Planner – Exporter / partager",
      "export.copyPrompt": "Copier :",
      "export.exportPrompt": "Copier l’export :",
      "export.copyPlanPrompt": "Copier l’aperçu du plan :",
      "export.copyJsonPrompt": "Copier JSON :",
      "export.planPrompt": "Anchor Planner – Aperçu du plan",
      "confirm.clearData": "Supprimer les données d’Anchor Planner ? Les dessins Draw Tools seront conservés.",
      "confirm.clearAssignments": "Supprimer toutes les affectations manuelles d’extrémités ?",
      "panel.planPortal.one": "{count} portail du plan",
      "panel.planPortal.other": "{count} portails du plan",
      "action.scan": "Analyser",
      "action.more": "Plus",
      "action.loadNames": "Charger les noms",
      "action.exportShare": "Exporter / partager",
      "action.sortLocation": "Trier depuis ici",
      "action.sortLocationTitle": "Trajet approximatif à vol d’oiseau depuis la dernière position IITC",
      "action.clearData": "Effacer les données",
      "settings.tolerance": "Tolérance",
      "settings.standard": "Défaut",
      "filter.aria": "Filtrer la liste des portails",
      "filter.all": "Tous",
      "filter.open": "Ouverts",
      "filter.blocked": "Bloqués",
      "filter.keysMissing": "Clés manquantes",
      "filter.done": "Terminés",
      "scan.summaryLink.one": "{count} lien",
      "scan.summaryLink.other": "{count} liens",
      "scan.summaryPortal.one": "{count} portail du plan",
      "scan.summaryPortal.other": "{count} portails du plan",
      "scan.summaryEndpoint.one": "{count} extrémité ouverte",
      "scan.summaryEndpoint.other": "{count} extrémités ouvertes",
      "diagnostics.openEndpoints": "Extrémités ouvertes :",
      "diagnostics.help": "Si Draw Tools/Auto Draw ne fournit rien d’exploitable, zoomez sur la zone, attendez le chargement IITC, puis relancez l’analyse ou chargez les noms.",
      "diagnostics.segment": "Segment {segment}{end} :",
      "diagnostics.nearestPortal": "portail IITC le plus proche : {title} ({distance} m)",
      "diagnostics.noPortal": "aucun portail IITC chargé trouvé",
      "diagnostics.drawObject": "Objet Draw Tools :",
      "diagnostics.title": "Titre :",
      "diagnostics.drawPoints": "Points Draw Tools les plus proches :",
      "diagnostics.iitcPortals": "Portails IITC les plus proches :",
      "panel.initialHelp": "Créez un plan Draw Tools/Auto Draw puis analysez-le. Les favoris sont prioritaires ; les noms manquants sont chargés ensuite.",
      "blocker.title": "Bloqueurs",
      "blocker.blockLink.one": "{count} lien bloqueur",
      "blocker.blockLink.other": "{count} liens bloqueurs",
      "blocker.endPortal.one": "{count} portail d’extrémité",
      "blocker.endPortal.other": "{count} portails d’extrémité",
      "blocker.selected": "{count} retenus",
      "blocker.endpointOf.one": "Extrémité de {count} lien bloqueur",
      "blocker.endpointOf.other": "Extrémité de {count} liens bloqueurs",
      "blocker.openPlanPortal": "déjà un portail ouvert du plan",
      "blocker.donePlanPortal": "portail du plan terminé",
      "blocker.mapLegend": "Carte : plan rose · bloqueurs cyan · croisements jaunes",
      "row.keys": "Clés {owned}/{required}",
      "row.links": "Liens : {count}",
      "row.existing": "existants : {count}",
      "row.open": "ouverts : {count}",
      "row.blocked": "bloqués : {count}",
      "row.keysNeeded": "Clés requises",
      "row.moveUp": "Monter dans l’ordre",
      "row.moveDown": "Descendre dans l’ordre",
      "row.done": "terminé",
      "row.actions": "Actions",
      "row.emptyFilter": "Aucun portail pour ce filtre.",
      "overlay.keysNeeded": "Clés requises {owned}/{required}",
      "text.plan": "Plan : {links}, {portals}",
      "text.planLinkCount.one": "{count} lien",
      "text.planLinkCount.other": "{count} liens",
      "text.planPortalCount.one": "{count} portail du plan",
      "text.planPortalCount.other": "{count} portails du plan",
      "text.existing": "Liens existants : {existing} · non confirmés : {unconfirmed}",
      "text.done": "Portails terminés : {done}/{total}",
      "text.keys": "Clés : disponibles {owned} / requises {required}",
      "text.blockers": "Bloqueurs :",
      "text.planLink": "Lien du plan :",
      "text.loadedLinksHint": "Note : seuls les liens existants actuellement chargés dans IITC ont été vérifiés.",
      "text.doneSuffix": "terminé",
      "text.address": "Adresse :",
      "text.links": "Liens : {total} · existants : {existing} · ouverts : {open} · bloqués : {blocked}",
      "text.keysPortal": "Clés : {owned}/{required}",
      "text.note": "Note :"
    },
    "it": {
      "language.label": "Lingua",
      "language.auto": "Automatica",
      "language.name": "Italiano",
      "portal.nameMissing": "Nome non caricato",
      "portal.nameMissingCoordinates": "Nome non caricato ({lat}, {lng})",
      "portal.nameMissingPlain": "Nome non caricato",
      "portal.generic": "Portale",
      "portal.manuallyAssigned": "Assegnato manualmente",
      "route.noLocation": "Posizione IITC non disponibile. Attiva IITC User Location.",
      "route.noOpenPlanPortals": "Nessun portale del piano aperto.",
      "route.planPortal": "portale del piano",
      "route.blockerPortal": "portale blocker",
      "route.next": "Prossimo {type}:",
      "route.nextFromLocation": "Prossimo {type} da qui:",
      "route.complete": "Tutti gli obiettivi completati.",
      "route.distanceTitle": "Distanza in linea d’aria dalla posizione IITC",
      "route.remainingTitle": "Percorso residuo stimato in linea d’aria",
      "route.remaining": "Restano circa {distance}",
      "route.target.one": "{count} obiettivo",
      "route.target.other": "{count} obiettivi",
      "route.aerial": "linea d’aria",
      "scan.drawToolsMissing": "Draw Tools non trovato. Attivalo.",
      "status.done": "completato",
      "status.blocked": "bloccato",
      "status.existing": "nessuna chiave",
      "status.ready": "pronto",
      "status.partial": "parziale",
      "status.keysMissing": "chiavi mancanti",
      "readiness.readyLoaded": "Pronto (dati caricati)",
      "readiness.rescan": "Ripeti scansione",
      "readiness.sessionMissing": "Dati sessione mancanti",
      "readiness.openEndpoint.one": "{count} estremo aperto",
      "readiness.openEndpoint.other": "{count} estremi aperti",
      "readiness.blockedPlanLink.one": "{count} link del piano bloccato",
      "readiness.blockedPlanLink.other": "{count} link del piano bloccati",
      "readiness.missingKey.one": "manca {count} chiave",
      "readiness.missingKey.other": "mancano {count} chiavi",
      "readiness.missingName.one": "manca {count} nome",
      "readiness.missingName.other": "mancano {count} nomi",
      "readiness.unusableLink.one": "{count} link non valutabile",
      "readiness.unusableLink.other": "{count} link non valutabili",
      "readiness.noPlan": "nessun link del piano rilevato",
      "readiness.notReady": "Non pronto",
      "readiness.check": "Controlla",
      "readiness.title": "Verifica:",
      "readiness.unconfirmed.one": "{count} link del piano non confermato",
      "readiness.unconfirmed.other": "{count} link del piano non confermati",
      "readiness.keyPortal.one": "Chiavi mancanti in {count} portale",
      "readiness.keyPortal.other": "Chiavi mancanti in {count} portali",
      "readiness.loadedLink.one": "{count} link esistente caricato",
      "readiness.loadedLink.other": "{count} link esistenti caricati",
      "readiness.unusableLoaded": "{count} non valutabili",
      "message.intersectionUnknown": "Impossibile determinare l’incrocio.",
      "message.namesNoneMissing": "Nessun nome mancante nella scansione attuale.",
      "message.namesLoadingAuto": "Caricamento nomi: {current}/{total}…",
      "message.namesLoading": "Caricamento nomi: {current}/{total}…",
      "message.namesLoadedAuto": "Nomi caricati automaticamente.",
      "message.namesLoaded": "Nomi caricati.",
      "message.namesUnavailable": "Se mancano ancora nomi, i dettagli non sono disponibili.",
      "message.copied": "Copiato negli appunti.",
      "share.section": "Condividi",
      "share.copyText": "Copia testo",
      "share.locate": "Localizza",
      "share.dialogTitle": "Condividi / localizza portale",
      "share.prompt": "Condividi portale:",
      "export.planOverview": "Riepilogo piano",
      "export.copyPlan": "Copia piano",
      "export.saveTxt": "Salva TXT",
      "export.share": "Condividi",
      "export.copyJson": "Copia JSON",
      "export.saveJson": "Salva JSON",
      "export.dialogTitle": "Anchor Planner – Esporta / condividi",
      "export.copyPrompt": "Copia:",
      "export.exportPrompt": "Copia esportazione:",
      "export.copyPlanPrompt": "Copia riepilogo piano:",
      "export.copyJsonPrompt": "Copia JSON:",
      "export.planPrompt": "Anchor Planner – Riepilogo piano",
      "confirm.clearData": "Eliminare i dati di Anchor Planner? I disegni Draw Tools resteranno invariati.",
      "confirm.clearAssignments": "Eliminare tutte le assegnazioni manuali degli estremi?",
      "panel.planPortal.one": "{count} portale del piano",
      "panel.planPortal.other": "{count} portali del piano",
      "action.scan": "Scansiona",
      "action.more": "Altro",
      "action.loadNames": "Carica nomi",
      "action.exportShare": "Esporta / condividi",
      "action.sortLocation": "Ordina da qui",
      "action.sortLocationTitle": "Percorso approssimativo in linea d’aria dall’ultima posizione IITC",
      "action.clearData": "Elimina dati",
      "settings.tolerance": "Tolleranza",
      "settings.standard": "Predef.",
      "filter.aria": "Filtra elenco portali",
      "filter.all": "Tutti",
      "filter.open": "Aperti",
      "filter.blocked": "Bloccati",
      "filter.keysMissing": "Chiavi mancanti",
      "filter.done": "Completati",
      "scan.summaryLink.one": "{count} link",
      "scan.summaryLink.other": "{count} link",
      "scan.summaryPortal.one": "{count} portale del piano",
      "scan.summaryPortal.other": "{count} portali del piano",
      "scan.summaryEndpoint.one": "{count} estremo aperto",
      "scan.summaryEndpoint.other": "{count} estremi aperti",
      "diagnostics.openEndpoints": "Estremi aperti:",
      "diagnostics.help": "Se Draw Tools/Auto Draw non fornisce dati utili, ingrandisci l’area, attendi il caricamento IITC, poi ripeti la scansione o carica i nomi.",
      "diagnostics.segment": "Segmento {segment}{end}:",
      "diagnostics.nearestPortal": "portale IITC più vicino: {title} ({distance} m)",
      "diagnostics.noPortal": "nessun portale IITC caricato trovato",
      "diagnostics.drawObject": "Oggetto Draw Tools:",
      "diagnostics.title": "Titolo:",
      "diagnostics.drawPoints": "Punti Draw Tools più vicini:",
      "diagnostics.iitcPortals": "Portali IITC più vicini:",
      "panel.initialHelp": "Crea un piano Draw Tools/Auto Draw e scansionalo. I preferiti hanno priorità; i nomi mancanti vengono caricati dopo.",
      "blocker.title": "Blocker",
      "blocker.blockLink.one": "{count} link blocker",
      "blocker.blockLink.other": "{count} link blocker",
      "blocker.endPortal.one": "{count} portale estremo",
      "blocker.endPortal.other": "{count} portali estremi",
      "blocker.selected": "{count} selezionati",
      "blocker.endpointOf.one": "Estremo di {count} link blocker",
      "blocker.endpointOf.other": "Estremo di {count} link blocker",
      "blocker.openPlanPortal": "già portale aperto del piano",
      "blocker.donePlanPortal": "portale del piano completato",
      "blocker.mapLegend": "Mappa: piano rosa · blocker ciano · incroci gialli",
      "row.keys": "Chiavi {owned}/{required}",
      "row.links": "Link: {count}",
      "row.existing": "esistenti: {count}",
      "row.open": "aperti: {count}",
      "row.blocked": "bloccati: {count}",
      "row.keysNeeded": "Chiavi richieste",
      "row.moveUp": "Sposta in alto",
      "row.moveDown": "Sposta in basso",
      "row.done": "completato",
      "row.actions": "Azioni",
      "row.emptyFilter": "Nessun portale per questo filtro.",
      "overlay.keysNeeded": "Chiavi {owned}/{required}",
      "text.plan": "Piano: {links}, {portals}",
      "text.planLinkCount.one": "{count} link",
      "text.planLinkCount.other": "{count} link",
      "text.planPortalCount.one": "{count} portale del piano",
      "text.planPortalCount.other": "{count} portali del piano",
      "text.existing": "Link esistenti: {existing} · non confermati: {unconfirmed}",
      "text.done": "Portali completati: {done}/{total}",
      "text.keys": "Chiavi: disponibili {owned} / richieste {required}",
      "text.blockers": "Blocker:",
      "text.planLink": "Link del piano:",
      "text.loadedLinksHint": "Nota: sono stati controllati solo i link esistenti attualmente caricati in IITC.",
      "text.doneSuffix": "completato",
      "text.address": "Indirizzo:",
      "text.links": "Link: {total} · esistenti: {existing} · aperti: {open} · bloccati: {blocked}",
      "text.keysPortal": "Chiavi: {owned}/{required}",
      "text.note": "Nota:"
    },
    "ja": {
      "language.label": "言語",
      "language.auto": "自動",
      "language.name": "日本語",
      "portal.nameMissing": "名前未読込",
      "portal.nameMissingCoordinates": "名前未読込 ({lat}, {lng})",
      "portal.nameMissingPlain": "名前未読込",
      "portal.generic": "ポータル",
      "portal.manuallyAssigned": "手動割当",
      "route.noLocation": "IITCの現在地がありません。User Locationを有効にしてください。",
      "route.noOpenPlanPortals": "未完了の計画ポータルはありません。",
      "route.planPortal": "計画ポータル",
      "route.blockerPortal": "ブロッカーポータル",
      "route.next": "次の{type}:",
      "route.nextFromLocation": "現在地から次の{type}:",
      "route.complete": "全ルート目標を完了しました。",
      "route.distanceTitle": "IITC現在地からの直線距離",
      "route.remainingTitle": "残りの推定直線ルート",
      "route.remaining": "残り約 {distance}",
      "route.target.one": "{count}件",
      "route.target.other": "{count}件",
      "route.aerial": "直線",
      "scan.drawToolsMissing": "Draw Toolsが見つかりません。有効にしてください。",
      "status.done": "完了",
      "status.blocked": "ブロック中",
      "status.existing": "キー不要",
      "status.ready": "準備完了",
      "status.partial": "一部あり",
      "status.keysMissing": "キー不足",
      "readiness.readyLoaded": "準備完了（読込済みデータ）",
      "readiness.rescan": "再スキャン",
      "readiness.sessionMissing": "セッションデータなし",
      "readiness.openEndpoint.one": "未解決端点 {count}件",
      "readiness.openEndpoint.other": "未解決端点 {count}件",
      "readiness.blockedPlanLink.one": "ブロック中の計画リンク {count}本",
      "readiness.blockedPlanLink.other": "ブロック中の計画リンク {count}本",
      "readiness.missingKey.one": "不足キー {count}本",
      "readiness.missingKey.other": "不足キー {count}本",
      "readiness.missingName.one": "名前なし {count}件",
      "readiness.missingName.other": "名前なし {count}件",
      "readiness.unusableLink.one": "判定不能リンク {count}本",
      "readiness.unusableLink.other": "判定不能リンク {count}本",
      "readiness.noPlan": "計画リンク未検出",
      "readiness.notReady": "未準備",
      "readiness.check": "要確認",
      "readiness.title": "準備状況:",
      "readiness.unconfirmed.one": "未確認の計画リンク {count}本",
      "readiness.unconfirmed.other": "未確認の計画リンク {count}本",
      "readiness.keyPortal.one": "キー不足ポータル {count}件",
      "readiness.keyPortal.other": "キー不足ポータル {count}件",
      "readiness.loadedLink.one": "読込済み既存リンク {count}本",
      "readiness.loadedLink.other": "読込済み既存リンク {count}本",
      "readiness.unusableLoaded": "うち判定不能 {count}本",
      "message.intersectionUnknown": "交点を特定できませんでした。",
      "message.namesNoneMissing": "現在のスキャンに名前不足はありません。",
      "message.namesLoadingAuto": "名前を読込中: {current}/{total}…",
      "message.namesLoading": "名前を読込中: {current}/{total}…",
      "message.namesLoadedAuto": "名前を自動読込しました。",
      "message.namesLoaded": "名前を読込しました。",
      "message.namesUnavailable": "まだ名前がない場合、詳細は取得できません。",
      "message.copied": "クリップボードにコピーしました。",
      "share.section": "共有",
      "share.copyText": "テキストをコピー",
      "share.locate": "場所を開く",
      "share.dialogTitle": "ポータルを共有 / 開く",
      "share.prompt": "ポータルを共有:",
      "export.planOverview": "計画概要",
      "export.copyPlan": "計画をコピー",
      "export.saveTxt": "TXT保存",
      "export.share": "共有",
      "export.copyJson": "JSONコピー",
      "export.saveJson": "JSON保存",
      "export.dialogTitle": "Anchor Planner – 出力 / 共有",
      "export.copyPrompt": "コピー:",
      "export.exportPrompt": "出力をコピー:",
      "export.copyPlanPrompt": "計画概要をコピー:",
      "export.copyJsonPrompt": "JSONをコピー:",
      "export.planPrompt": "Anchor Planner – 計画概要",
      "confirm.clearData": "Anchor Plannerのデータを削除しますか？Draw Toolsの図形は残ります。",
      "confirm.clearAssignments": "端点の手動割当をすべて削除しますか？",
      "panel.planPortal.one": "計画ポータル {count}件",
      "panel.planPortal.other": "計画ポータル {count}件",
      "action.scan": "スキャン",
      "action.more": "その他",
      "action.loadNames": "名前を読込",
      "action.exportShare": "出力 / 共有",
      "action.sortLocation": "現在地順",
      "action.sortLocationTitle": "IITCの最終現在地から直線距離で近似したルート",
      "action.clearData": "データ削除",
      "settings.tolerance": "許容距離",
      "settings.standard": "標準",
      "filter.aria": "ポータル一覧を絞り込む",
      "filter.all": "すべて",
      "filter.open": "未完了",
      "filter.blocked": "ブロック",
      "filter.keysMissing": "キー不足",
      "filter.done": "完了",
      "scan.summaryLink.one": "リンク {count}本",
      "scan.summaryLink.other": "リンク {count}本",
      "scan.summaryPortal.one": "計画ポータル {count}件",
      "scan.summaryPortal.other": "計画ポータル {count}件",
      "scan.summaryEndpoint.one": "未解決端点 {count}件",
      "scan.summaryEndpoint.other": "未解決端点 {count}件",
      "diagnostics.openEndpoints": "未解決端点:",
      "diagnostics.help": "Draw Tools/Auto Drawのデータが不足する場合は、対象を拡大してIITCの読込を待ち、再スキャンまたは名前読込を実行してください。",
      "diagnostics.segment": "線分 {segment}{end}:",
      "diagnostics.nearestPortal": "最寄りのIITCポータル: {title} ({distance} m)",
      "diagnostics.noPortal": "読込済みIITCポータルなし",
      "diagnostics.drawObject": "Draw Toolsオブジェクト:",
      "diagnostics.title": "名前:",
      "diagnostics.drawPoints": "最寄りのDraw Toolsポイント:",
      "diagnostics.iitcPortals": "最寄りのIITCポータル:",
      "panel.initialHelp": "Draw Tools/Auto Drawで計画を作り、スキャンしてください。ブックマークを優先し、不足名は後で自動読込します。",
      "blocker.title": "ブロッカー",
      "blocker.blockLink.one": "ブロックリンク {count}本",
      "blocker.blockLink.other": "ブロックリンク {count}本",
      "blocker.endPortal.one": "端点ポータル {count}件",
      "blocker.endPortal.other": "端点ポータル {count}件",
      "blocker.selected": "選択 {count}件",
      "blocker.endpointOf.one": "ブロックリンク {count}本の端点",
      "blocker.endpointOf.other": "ブロックリンク {count}本の端点",
      "blocker.openPlanPortal": "未完了の計画ポータル",
      "blocker.donePlanPortal": "完了済み計画ポータル",
      "blocker.mapLegend": "地図: 計画=桃 · ブロッカー=水色 · 交点=黄",
      "row.keys": "キー {owned}/{required}",
      "row.links": "リンク: {count}",
      "row.existing": "既存: {count}",
      "row.open": "未確認: {count}",
      "row.blocked": "ブロック: {count}",
      "row.keysNeeded": "必要キー",
      "row.moveUp": "順番を上へ",
      "row.moveDown": "順番を下へ",
      "row.done": "完了",
      "row.actions": "操作",
      "row.emptyFilter": "該当する計画ポータルはありません。",
      "overlay.keysNeeded": "必要キー {owned}/{required}",
      "text.plan": "計画: {links}、{portals}",
      "text.planLinkCount.one": "リンク {count}本",
      "text.planLinkCount.other": "リンク {count}本",
      "text.planPortalCount.one": "計画ポータル {count}件",
      "text.planPortalCount.other": "計画ポータル {count}件",
      "text.existing": "既存リンク: {existing} · 未確認: {unconfirmed}",
      "text.done": "完了ポータル: {done}/{total}",
      "text.keys": "キー: 所持 {owned} / 必要 {required}",
      "text.blockers": "ブロッカー:",
      "text.planLink": "計画リンク:",
      "text.loadedLinksHint": "注: IITCに現在読み込まれている既存リンクのみ確認しました。",
      "text.doneSuffix": "完了",
      "text.address": "住所:",
      "text.links": "リンク: {total} · 既存: {existing} · 未確認: {open} · ブロック: {blocked}",
      "text.keysPortal": "キー: {owned}/{required}",
      "text.note": "メモ:"
    },
    "pl": {
      "language.label": "Język",
      "language.auto": "Automatycznie",
      "language.name": "Polski",
      "portal.nameMissing": "Nazwa niezaładowana",
      "portal.nameMissingCoordinates": "Nazwa niezaładowana ({lat}, {lng})",
      "portal.nameMissingPlain": "Nazwa niezaładowana",
      "portal.generic": "Portal",
      "portal.manuallyAssigned": "Przypisano ręcznie",
      "route.noLocation": "Brak pozycji IITC. Włącz IITC User Location.",
      "route.noOpenPlanPortals": "Brak otwartych portali planu.",
      "route.planPortal": "portal planu",
      "route.blockerPortal": "portal blokera",
      "route.next": "Następny {type}:",
      "route.nextFromLocation": "Następny {type} stąd:",
      "route.complete": "Wszystkie cele ukończone.",
      "route.distanceTitle": "Odległość w linii prostej od pozycji IITC",
      "route.remainingTitle": "Szacowana pozostała trasa w linii prostej",
      "route.remaining": "Pozostało ok. {distance}",
      "route.target.one": "{count} cel",
      "route.target.other": "{count} cele",
      "route.aerial": "w linii prostej",
      "scan.drawToolsMissing": "Nie znaleziono Draw Tools. Włącz wtyczkę.",
      "status.done": "ukończono",
      "status.blocked": "zablokowany",
      "status.existing": "bez kluczy",
      "status.ready": "gotowy",
      "status.partial": "częściowo",
      "status.keysMissing": "brak kluczy",
      "readiness.readyLoaded": "Gotowe (wczytane dane)",
      "readiness.rescan": "Skanuj ponownie",
      "readiness.sessionMissing": "Brak danych sesji",
      "readiness.openEndpoint.one": "{count} otwarty koniec",
      "readiness.openEndpoint.other": "{count} otwarte końce",
      "readiness.blockedPlanLink.one": "{count} link planu zablokowany",
      "readiness.blockedPlanLink.other": "{count} linki planu zablokowane",
      "readiness.missingKey.one": "brakuje {count} klucza",
      "readiness.missingKey.other": "brakuje {count} kluczy",
      "readiness.missingName.one": "brakuje {count} nazwy",
      "readiness.missingName.other": "brakuje {count} nazw",
      "readiness.unusableLink.one": "{count} link bez oceny",
      "readiness.unusableLink.other": "{count} linki bez oceny",
      "readiness.noPlan": "nie wykryto linku planu",
      "readiness.notReady": "Niegotowe",
      "readiness.check": "Sprawdź",
      "readiness.title": "Gotowość:",
      "readiness.unconfirmed.one": "{count} link planu niepotwierdzony",
      "readiness.unconfirmed.other": "{count} linki planu niepotwierdzone",
      "readiness.keyPortal.one": "Brak kluczy w {count} portalu",
      "readiness.keyPortal.other": "Brak kluczy w {count} portalach",
      "readiness.loadedLink.one": "Wczytano {count} istniejący link",
      "readiness.loadedLink.other": "Wczytano {count} istniejące linki",
      "readiness.unusableLoaded": "{count} bez oceny",
      "message.intersectionUnknown": "Nie udało się wyznaczyć przecięcia.",
      "message.namesNoneMissing": "W bieżącym skanie nie brakuje nazw.",
      "message.namesLoadingAuto": "Wczytywanie nazw: {current}/{total}…",
      "message.namesLoading": "Wczytywanie nazw: {current}/{total}…",
      "message.namesLoadedAuto": "Nazwy wczytano automatycznie.",
      "message.namesLoaded": "Nazwy wczytane.",
      "message.namesUnavailable": "Jeśli nadal brakuje nazw, ich szczegóły są niedostępne.",
      "message.copied": "Skopiowano do schowka.",
      "share.section": "Udostępnij",
      "share.copyText": "Kopiuj tekst",
      "share.locate": "Lokalizuj",
      "share.dialogTitle": "Udostępnij / lokalizuj portal",
      "share.prompt": "Udostępnij portal:",
      "export.planOverview": "Podsumowanie planu",
      "export.copyPlan": "Kopiuj plan",
      "export.saveTxt": "Zapisz TXT",
      "export.share": "Udostępnij",
      "export.copyJson": "Kopiuj JSON",
      "export.saveJson": "Zapisz JSON",
      "export.dialogTitle": "Anchor Planner – Eksport / udostępnianie",
      "export.copyPrompt": "Kopiuj:",
      "export.exportPrompt": "Kopiuj eksport:",
      "export.copyPlanPrompt": "Kopiuj podsumowanie planu:",
      "export.copyJsonPrompt": "Kopiuj JSON:",
      "export.planPrompt": "Anchor Planner – Podsumowanie planu",
      "confirm.clearData": "Usunąć dane Anchor Planner? Rysunki Draw Tools pozostaną bez zmian.",
      "confirm.clearAssignments": "Usunąć wszystkie ręczne przypisania końców?",
      "panel.planPortal.one": "{count} portal planu",
      "panel.planPortal.other": "{count} portale planu",
      "action.scan": "Skanuj",
      "action.more": "Więcej",
      "action.loadNames": "Wczytaj nazwy",
      "action.exportShare": "Eksport / wyślij",
      "action.sortLocation": "Sortuj stąd",
      "action.sortLocationTitle": "Przybliżona trasa w linii prostej od ostatniej pozycji IITC",
      "action.clearData": "Usuń dane",
      "settings.tolerance": "Tolerancja",
      "settings.standard": "Domyślna",
      "filter.aria": "Filtruj listę portali",
      "filter.all": "Wszystkie",
      "filter.open": "Otwarte",
      "filter.blocked": "Zablokowane",
      "filter.keysMissing": "Brak kluczy",
      "filter.done": "Ukończone",
      "scan.summaryLink.one": "{count} link",
      "scan.summaryLink.other": "{count} linki",
      "scan.summaryPortal.one": "{count} portal planu",
      "scan.summaryPortal.other": "{count} portale planu",
      "scan.summaryEndpoint.one": "{count} otwarty koniec",
      "scan.summaryEndpoint.other": "{count} otwarte końce",
      "diagnostics.openEndpoints": "Otwarte końce:",
      "diagnostics.help": "Jeśli Draw Tools/Auto Draw nie dostarcza danych, przybliż obszar, poczekaj na portale IITC, a potem skanuj ponownie lub wczytaj nazwy.",
      "diagnostics.segment": "Odcinek {segment}{end}:",
      "diagnostics.nearestPortal": "najbliższy portal IITC: {title} ({distance} m)",
      "diagnostics.noPortal": "nie znaleziono wczytanego portalu IITC",
      "diagnostics.drawObject": "Obiekt Draw Tools:",
      "diagnostics.title": "Tytuł:",
      "diagnostics.drawPoints": "Najbliższe punkty Draw Tools:",
      "diagnostics.iitcPortals": "Najbliższe portale IITC:",
      "panel.initialHelp": "Utwórz plan w Draw Tools/Auto Draw i zeskanuj go. Zakładki mają pierwszeństwo; brakujące nazwy zostaną wczytane później.",
      "blocker.title": "Blokery",
      "blocker.blockLink.one": "{count} link blokujący",
      "blocker.blockLink.other": "{count} linki blokujące",
      "blocker.endPortal.one": "{count} portal końcowy",
      "blocker.endPortal.other": "{count} portale końcowe",
      "blocker.selected": "wybrano {count}",
      "blocker.endpointOf.one": "Koniec {count} linku blokującego",
      "blocker.endpointOf.other": "Koniec {count} linków blokujących",
      "blocker.openPlanPortal": "już otwarty portal planu",
      "blocker.donePlanPortal": "ukończony portal planu",
      "blocker.mapLegend": "Mapa: plan różowy · blokery turkusowe · przecięcia żółte",
      "row.keys": "Klucze {owned}/{required}",
      "row.links": "Linki: {count}",
      "row.existing": "istniejące: {count}",
      "row.open": "otwarte: {count}",
      "row.blocked": "zablokowane: {count}",
      "row.keysNeeded": "Potrzebne klucze",
      "row.moveUp": "Przesuń wyżej",
      "row.moveDown": "Przesuń niżej",
      "row.done": "ukończono",
      "row.actions": "Akcje",
      "row.emptyFilter": "Brak portali dla tego filtra.",
      "overlay.keysNeeded": "Klucze {owned}/{required}",
      "text.plan": "Plan: {links}, {portals}",
      "text.planLinkCount.one": "{count} link",
      "text.planLinkCount.other": "{count} linki",
      "text.planPortalCount.one": "{count} portal planu",
      "text.planPortalCount.other": "{count} portale planu",
      "text.existing": "Istniejące linki: {existing} · niepotwierdzone: {unconfirmed}",
      "text.done": "Ukończone portale: {done}/{total}",
      "text.keys": "Klucze: posiadane {owned} / potrzebne {required}",
      "text.blockers": "Blokery:",
      "text.planLink": "Link planu:",
      "text.loadedLinksHint": "Uwaga: sprawdzono tylko istniejące linki obecnie wczytane w IITC.",
      "text.doneSuffix": "ukończono",
      "text.address": "Adres:",
      "text.links": "Linki: {total} · istniejące: {existing} · otwarte: {open} · zablokowane: {blocked}",
      "text.keysPortal": "Klucze: {owned}/{required}",
      "text.note": "Notatka:"
    },
    "pt-BR": {
      "language.label": "Idioma",
      "language.auto": "Automático",
      "language.name": "Português (Brasil)",
      "portal.nameMissing": "Nome não carregado",
      "portal.nameMissingCoordinates": "Nome não carregado ({lat}, {lng})",
      "portal.nameMissingPlain": "Nome não carregado",
      "portal.generic": "Portal",
      "portal.manuallyAssigned": "Atribuído manualmente",
      "route.noLocation": "Localização IITC indisponível. Ative o IITC User Location.",
      "route.noOpenPlanPortals": "Não há portais de plano abertos.",
      "route.planPortal": "portal do plano",
      "route.blockerPortal": "portal bloqueador",
      "route.next": "Próximo {type}:",
      "route.nextFromLocation": "Próximo {type} daqui:",
      "route.complete": "Todos os destinos concluídos.",
      "route.distanceTitle": "Distância em linha reta da localização IITC",
      "route.remainingTitle": "Rota restante estimada em linha reta",
      "route.remaining": "Restam aprox. {distance}",
      "route.target.one": "{count} destino",
      "route.target.other": "{count} destinos",
      "route.aerial": "linha reta",
      "scan.drawToolsMissing": "Draw Tools não encontrado. Ative-o.",
      "status.done": "concluído",
      "status.blocked": "bloqueado",
      "status.existing": "sem chaves",
      "status.ready": "pronto",
      "status.partial": "parcial",
      "status.keysMissing": "faltam chaves",
      "readiness.readyLoaded": "Pronto (dados carregados)",
      "readiness.rescan": "Escanear novamente",
      "readiness.sessionMissing": "Dados da sessão ausentes",
      "readiness.openEndpoint.one": "{count} ponta aberta",
      "readiness.openEndpoint.other": "{count} pontas abertas",
      "readiness.blockedPlanLink.one": "{count} link do plano bloqueado",
      "readiness.blockedPlanLink.other": "{count} links do plano bloqueados",
      "readiness.missingKey.one": "falta {count} chave",
      "readiness.missingKey.other": "faltam {count} chaves",
      "readiness.missingName.one": "falta {count} nome",
      "readiness.missingName.other": "faltam {count} nomes",
      "readiness.unusableLink.one": "{count} link não avaliável",
      "readiness.unusableLink.other": "{count} links não avaliáveis",
      "readiness.noPlan": "nenhum link de plano detectado",
      "readiness.notReady": "Não pronto",
      "readiness.check": "Verificar",
      "readiness.title": "Verificação:",
      "readiness.unconfirmed.one": "{count} link do plano não confirmado",
      "readiness.unconfirmed.other": "{count} links do plano não confirmados",
      "readiness.keyPortal.one": "Faltam chaves em {count} portal",
      "readiness.keyPortal.other": "Faltam chaves em {count} portais",
      "readiness.loadedLink.one": "{count} link existente carregado",
      "readiness.loadedLink.other": "{count} links existentes carregados",
      "readiness.unusableLoaded": "{count} não avaliáveis",
      "message.intersectionUnknown": "Não foi possível determinar o cruzamento.",
      "message.namesNoneMissing": "Nenhum nome ausente no escaneamento atual.",
      "message.namesLoadingAuto": "Carregando nomes: {current}/{total}…",
      "message.namesLoading": "Carregando nomes: {current}/{total}…",
      "message.namesLoadedAuto": "Nomes carregados automaticamente.",
      "message.namesLoaded": "Nomes carregados.",
      "message.namesUnavailable": "Se ainda faltarem nomes, os detalhes estão indisponíveis.",
      "message.copied": "Copiado para a área de transferência.",
      "share.section": "Compartilhar",
      "share.copyText": "Copiar texto",
      "share.locate": "Localizar",
      "share.dialogTitle": "Compartilhar / localizar portal",
      "share.prompt": "Compartilhar portal:",
      "export.planOverview": "Resumo do plano",
      "export.copyPlan": "Copiar plano",
      "export.saveTxt": "Salvar TXT",
      "export.share": "Compartilhar",
      "export.copyJson": "Copiar JSON",
      "export.saveJson": "Salvar JSON",
      "export.dialogTitle": "Anchor Planner – Exportar / compartilhar",
      "export.copyPrompt": "Copiar:",
      "export.exportPrompt": "Copiar exportação:",
      "export.copyPlanPrompt": "Copiar resumo do plano:",
      "export.copyJsonPrompt": "Copiar JSON:",
      "export.planPrompt": "Anchor Planner – Resumo do plano",
      "confirm.clearData": "Excluir dados do Anchor Planner? Os desenhos do Draw Tools serão mantidos.",
      "confirm.clearAssignments": "Excluir todas as atribuições manuais de pontas?",
      "panel.planPortal.one": "{count} portal do plano",
      "panel.planPortal.other": "{count} portais do plano",
      "action.scan": "Escanear",
      "action.more": "Mais",
      "action.loadNames": "Carregar nomes",
      "action.exportShare": "Exportar / enviar",
      "action.sortLocation": "Ordenar daqui",
      "action.sortLocationTitle": "Rota aproximada em linha reta da última localização IITC",
      "action.clearData": "Excluir dados",
      "settings.tolerance": "Tolerância",
      "settings.standard": "Padrão",
      "filter.aria": "Filtrar lista de portais",
      "filter.all": "Todos",
      "filter.open": "Abertos",
      "filter.blocked": "Bloqueados",
      "filter.keysMissing": "Faltam chaves",
      "filter.done": "Concluídos",
      "scan.summaryLink.one": "{count} link",
      "scan.summaryLink.other": "{count} links",
      "scan.summaryPortal.one": "{count} portal do plano",
      "scan.summaryPortal.other": "{count} portais do plano",
      "scan.summaryEndpoint.one": "{count} ponta aberta",
      "scan.summaryEndpoint.other": "{count} pontas abertas",
      "diagnostics.openEndpoints": "Pontas abertas:",
      "diagnostics.help": "Se Draw Tools/Auto Draw não fornecer dados úteis, amplie a área, aguarde o IITC carregar os portais e escaneie novamente ou carregue os nomes.",
      "diagnostics.segment": "Segmento {segment}{end}:",
      "diagnostics.nearestPortal": "portal IITC mais próximo: {title} ({distance} m)",
      "diagnostics.noPortal": "nenhum portal IITC carregado encontrado",
      "diagnostics.drawObject": "Objeto do Draw Tools:",
      "diagnostics.title": "Título:",
      "diagnostics.drawPoints": "Pontos do Draw Tools mais próximos:",
      "diagnostics.iitcPortals": "Portais IITC mais próximos:",
      "panel.initialHelp": "Crie um plano no Draw Tools/Auto Draw e escaneie. Favoritos têm prioridade; nomes ausentes são carregados depois.",
      "blocker.title": "Bloqueadores",
      "blocker.blockLink.one": "{count} link bloqueador",
      "blocker.blockLink.other": "{count} links bloqueadores",
      "blocker.endPortal.one": "{count} portal de ponta",
      "blocker.endPortal.other": "{count} portais de ponta",
      "blocker.selected": "{count} selecionados",
      "blocker.endpointOf.one": "Ponta de {count} link bloqueador",
      "blocker.endpointOf.other": "Ponta de {count} links bloqueadores",
      "blocker.openPlanPortal": "já é portal aberto do plano",
      "blocker.donePlanPortal": "portal do plano concluído",
      "blocker.mapLegend": "Mapa: plano rosa · bloqueadores ciano · cruzamentos amarelos",
      "row.keys": "Chaves {owned}/{required}",
      "row.links": "Links: {count}",
      "row.existing": "existentes: {count}",
      "row.open": "abertos: {count}",
      "row.blocked": "bloqueados: {count}",
      "row.keysNeeded": "Chaves necessárias",
      "row.moveUp": "Mover para cima",
      "row.moveDown": "Mover para baixo",
      "row.done": "concluído",
      "row.actions": "Ações",
      "row.emptyFilter": "Nenhum portal para este filtro.",
      "overlay.keysNeeded": "Chaves {owned}/{required}",
      "text.plan": "Plano: {links}, {portals}",
      "text.planLinkCount.one": "{count} link",
      "text.planLinkCount.other": "{count} links",
      "text.planPortalCount.one": "{count} portal do plano",
      "text.planPortalCount.other": "{count} portais do plano",
      "text.existing": "Links existentes: {existing} · não confirmados: {unconfirmed}",
      "text.done": "Portais concluídos: {done}/{total}",
      "text.keys": "Chaves: disponíveis {owned} / necessárias {required}",
      "text.blockers": "Bloqueadores:",
      "text.planLink": "Link do plano:",
      "text.loadedLinksHint": "Nota: só foram verificados os links existentes atualmente carregados no IITC.",
      "text.doneSuffix": "concluído",
      "text.address": "Endereço:",
      "text.links": "Links: {total} · existentes: {existing} · abertos: {open} · bloqueados: {blocked}",
      "text.keysPortal": "Chaves: {owned}/{required}",
      "text.note": "Nota:"
    },
    "ru": {
      "language.label": "Язык",
      "language.auto": "Авто",
      "language.name": "Русский",
      "portal.nameMissing": "Название не загружено",
      "portal.nameMissingCoordinates": "Название не загружено ({lat}, {lng})",
      "portal.nameMissingPlain": "Название не загружено",
      "portal.generic": "Портал",
      "portal.manuallyAssigned": "Назначено вручную",
      "route.noLocation": "Нет позиции IITC. Включите IITC User Location.",
      "route.noOpenPlanPortals": "Нет открытых порталов плана.",
      "route.planPortal": "портал плана",
      "route.blockerPortal": "портал блокера",
      "route.next": "Следующий {type}:",
      "route.nextFromLocation": "Следующий {type} отсюда:",
      "route.complete": "Все цели выполнены.",
      "route.distanceTitle": "Расстояние по прямой от позиции IITC",
      "route.remainingTitle": "Оценка оставшегося пути по прямой",
      "route.remaining": "Осталось ≈ {distance}",
      "route.target.one": "{count} цель",
      "route.target.other": "{count} целей",
      "route.aerial": "по прямой",
      "scan.drawToolsMissing": "Draw Tools не найден. Включите плагин.",
      "status.done": "выполнено",
      "status.blocked": "заблокировано",
      "status.existing": "ключи не нужны",
      "status.ready": "готово",
      "status.partial": "частично",
      "status.keysMissing": "нет ключей",
      "readiness.readyLoaded": "Готово (загруженные данные)",
      "readiness.rescan": "Сканировать снова",
      "readiness.sessionMissing": "Нет данных сеанса",
      "readiness.openEndpoint.one": "{count} открытый конец",
      "readiness.openEndpoint.other": "{count} открытых концов",
      "readiness.blockedPlanLink.one": "{count} линк плана заблокирован",
      "readiness.blockedPlanLink.other": "{count} линков плана заблокировано",
      "readiness.missingKey.one": "не хватает {count} ключа",
      "readiness.missingKey.other": "не хватает {count} ключей",
      "readiness.missingName.one": "не хватает {count} названия",
      "readiness.missingName.other": "не хватает {count} названий",
      "readiness.unusableLink.one": "{count} линк нельзя проверить",
      "readiness.unusableLink.other": "{count} линков нельзя проверить",
      "readiness.noPlan": "линки плана не найдены",
      "readiness.notReady": "Не готово",
      "readiness.check": "Проверить",
      "readiness.title": "Готовность:",
      "readiness.unconfirmed.one": "{count} линк плана не подтверждён",
      "readiness.unconfirmed.other": "{count} линков плана не подтверждено",
      "readiness.keyPortal.one": "Нет ключей на {count} портале",
      "readiness.keyPortal.other": "Нет ключей на {count} порталах",
      "readiness.loadedLink.one": "Загружен {count} существующий линк",
      "readiness.loadedLink.other": "Загружено {count} существующих линков",
      "readiness.unusableLoaded": "{count} нельзя проверить",
      "message.intersectionUnknown": "Не удалось определить пересечение.",
      "message.namesNoneMissing": "В текущем скане все названия загружены.",
      "message.namesLoadingAuto": "Загрузка названий: {current}/{total}…",
      "message.namesLoading": "Загрузка названий: {current}/{total}…",
      "message.namesLoadedAuto": "Названия загружены автоматически.",
      "message.namesLoaded": "Названия загружены.",
      "message.namesUnavailable": "Если названий всё ещё нет, данные недоступны.",
      "message.copied": "Скопировано в буфер обмена.",
      "share.section": "Поделиться",
      "share.copyText": "Копировать текст",
      "share.locate": "Найти",
      "share.dialogTitle": "Поделиться / найти портал",
      "share.prompt": "Поделиться порталом:",
      "export.planOverview": "Обзор плана",
      "export.copyPlan": "Копировать план",
      "export.saveTxt": "Сохранить TXT",
      "export.share": "Поделиться",
      "export.copyJson": "Копировать JSON",
      "export.saveJson": "Сохранить JSON",
      "export.dialogTitle": "Anchor Planner — Экспорт / отправка",
      "export.copyPrompt": "Копировать:",
      "export.exportPrompt": "Копировать экспорт:",
      "export.copyPlanPrompt": "Копировать обзор плана:",
      "export.copyJsonPrompt": "Копировать JSON:",
      "export.planPrompt": "Anchor Planner — Обзор плана",
      "confirm.clearData": "Удалить данные Anchor Planner? Рисунки Draw Tools сохранятся.",
      "confirm.clearAssignments": "Удалить все ручные назначения концов?",
      "panel.planPortal.one": "{count} портал плана",
      "panel.planPortal.other": "{count} порталов плана",
      "action.scan": "Сканировать",
      "action.more": "Ещё",
      "action.loadNames": "Загрузить имена",
      "action.exportShare": "Экспорт / отправка",
      "action.sortLocation": "Сортировать отсюда",
      "action.sortLocationTitle": "Приблизительный маршрут по прямой от последней позиции IITC",
      "action.clearData": "Удалить данные",
      "settings.tolerance": "Допуск",
      "settings.standard": "Стандарт",
      "filter.aria": "Фильтр списка порталов",
      "filter.all": "Все",
      "filter.open": "Открытые",
      "filter.blocked": "Блокеры",
      "filter.keysMissing": "Нет ключей",
      "filter.done": "Готово",
      "scan.summaryLink.one": "{count} линк",
      "scan.summaryLink.other": "{count} линков",
      "scan.summaryPortal.one": "{count} портал плана",
      "scan.summaryPortal.other": "{count} порталов плана",
      "scan.summaryEndpoint.one": "{count} открытый конец",
      "scan.summaryEndpoint.other": "{count} открытых концов",
      "diagnostics.openEndpoints": "Открытые концы:",
      "diagnostics.help": "Если Draw Tools/Auto Draw не даёт данных, приблизьте область, дождитесь порталов IITC и повторите сканирование или загрузите названия.",
      "diagnostics.segment": "Сегмент {segment}{end}:",
      "diagnostics.nearestPortal": "ближайший портал IITC: {title} ({distance} м)",
      "diagnostics.noPortal": "загруженный портал IITC не найден",
      "diagnostics.drawObject": "Объект Draw Tools:",
      "diagnostics.title": "Название:",
      "diagnostics.drawPoints": "Ближайшие точки Draw Tools:",
      "diagnostics.iitcPortals": "Ближайшие порталы IITC:",
      "panel.initialHelp": "Создайте план в Draw Tools/Auto Draw и сканируйте. Закладки имеют приоритет; недостающие названия загрузятся позже.",
      "blocker.title": "Блокеры",
      "blocker.blockLink.one": "{count} блокирующий линк",
      "blocker.blockLink.other": "{count} блокирующих линков",
      "blocker.endPortal.one": "{count} конечный портал",
      "blocker.endPortal.other": "{count} конечных порталов",
      "blocker.selected": "выбрано: {count}",
      "blocker.endpointOf.one": "Конец {count} блокирующего линка",
      "blocker.endpointOf.other": "Конец {count} блокирующих линков",
      "blocker.openPlanPortal": "уже открытый портал плана",
      "blocker.donePlanPortal": "портал плана выполнен",
      "blocker.mapLegend": "Карта: план розовый · блокеры голубые · пересечения жёлтые",
      "row.keys": "Ключи {owned}/{required}",
      "row.links": "Линки: {count}",
      "row.existing": "есть: {count}",
      "row.open": "открыто: {count}",
      "row.blocked": "блокеры: {count}",
      "row.keysNeeded": "Нужно ключей",
      "row.moveUp": "Переместить выше",
      "row.moveDown": "Переместить ниже",
      "row.done": "готово",
      "row.actions": "Действия",
      "row.emptyFilter": "Нет порталов для этого фильтра.",
      "overlay.keysNeeded": "Ключи {owned}/{required}",
      "text.plan": "План: {links}, {portals}",
      "text.planLinkCount.one": "{count} линк",
      "text.planLinkCount.other": "{count} линков",
      "text.planPortalCount.one": "{count} портал плана",
      "text.planPortalCount.other": "{count} порталов плана",
      "text.existing": "Существующие линки: {existing} · не подтверждено: {unconfirmed}",
      "text.done": "Порталы выполнены: {done}/{total}",
      "text.keys": "Ключи: есть {owned} / нужно {required}",
      "text.blockers": "Блокеры:",
      "text.planLink": "Линк плана:",
      "text.loadedLinksHint": "Примечание: проверены только существующие линки, сейчас загруженные в IITC.",
      "text.doneSuffix": "готово",
      "text.address": "Адрес:",
      "text.links": "Линки: {total} · есть: {existing} · открыто: {open} · блокеры: {blocked}",
      "text.keysPortal": "Ключи: {owned}/{required}",
      "text.note": "Заметка:"
    },
    "zh-CN": {
      "language.label": "语言",
      "language.auto": "自动",
      "language.name": "简体中文",
      "portal.nameMissing": "名称未加载",
      "portal.nameMissingCoordinates": "名称未加载 ({lat}, {lng})",
      "portal.nameMissingPlain": "名称未加载",
      "portal.generic": "Portal",
      "portal.manuallyAssigned": "手动指定",
      "route.noLocation": "暂无 IITC 位置，请启用 User Location。",
      "route.noOpenPlanPortals": "没有未完成的计划 Portal。",
      "route.planPortal": "计划 Portal",
      "route.blockerPortal": "阻挡 Portal",
      "route.next": "下一个{type}：",
      "route.nextFromLocation": "当前位置下一个{type}：",
      "route.complete": "所有路线目标已完成。",
      "route.distanceTitle": "距 IITC 位置的直线距离",
      "route.remainingTitle": "预计剩余直线路线",
      "route.remaining": "剩余约 {distance}",
      "route.target.one": "{count} 个目标",
      "route.target.other": "{count} 个目标",
      "route.aerial": "直线",
      "scan.drawToolsMissing": "未找到 Draw Tools，请启用。",
      "status.done": "已完成",
      "status.blocked": "受阻",
      "status.existing": "无需钥匙",
      "status.ready": "就绪",
      "status.partial": "部分就绪",
      "status.keysMissing": "缺少钥匙",
      "readiness.readyLoaded": "就绪（已加载数据）",
      "readiness.rescan": "重新扫描",
      "readiness.sessionMissing": "缺少会话数据",
      "readiness.openEndpoint.one": "{count} 个未解析端点",
      "readiness.openEndpoint.other": "{count} 个未解析端点",
      "readiness.blockedPlanLink.one": "{count} 条计划 Link 受阻",
      "readiness.blockedPlanLink.other": "{count} 条计划 Link 受阻",
      "readiness.missingKey.one": "缺 {count} 把钥匙",
      "readiness.missingKey.other": "缺 {count} 把钥匙",
      "readiness.missingName.one": "缺 {count} 个名称",
      "readiness.missingName.other": "缺 {count} 个名称",
      "readiness.unusableLink.one": "{count} 条 Link 无法判断",
      "readiness.unusableLink.other": "{count} 条 Link 无法判断",
      "readiness.noPlan": "未检测到计划 Link",
      "readiness.notReady": "未就绪",
      "readiness.check": "需检查",
      "readiness.title": "行动检查：",
      "readiness.unconfirmed.one": "{count} 条计划 Link 未确认",
      "readiness.unconfirmed.other": "{count} 条计划 Link 未确认",
      "readiness.keyPortal.one": "{count} 个 Portal 缺钥匙",
      "readiness.keyPortal.other": "{count} 个 Portal 缺钥匙",
      "readiness.loadedLink.one": "已加载 {count} 条现有 Link",
      "readiness.loadedLink.other": "已加载 {count} 条现有 Link",
      "readiness.unusableLoaded": "其中 {count} 条无法判断",
      "message.intersectionUnknown": "无法确定交点。",
      "message.namesNoneMissing": "当前扫描没有缺失名称。",
      "message.namesLoadingAuto": "正在加载名称：{current}/{total}…",
      "message.namesLoading": "正在加载名称：{current}/{total}…",
      "message.namesLoadedAuto": "名称已自动加载。",
      "message.namesLoaded": "名称已加载。",
      "message.namesUnavailable": "若仍缺名称，则详情不可用。",
      "message.copied": "已复制到剪贴板。",
      "share.section": "分享",
      "share.copyText": "复制文本",
      "share.locate": "定位",
      "share.dialogTitle": "分享 / 定位 Portal",
      "share.prompt": "分享 Portal：",
      "export.planOverview": "计划概览",
      "export.copyPlan": "复制计划",
      "export.saveTxt": "保存 TXT",
      "export.share": "分享",
      "export.copyJson": "复制 JSON",
      "export.saveJson": "保存 JSON",
      "export.dialogTitle": "Anchor Planner – 导出 / 分享",
      "export.copyPrompt": "复制：",
      "export.exportPrompt": "复制导出内容：",
      "export.copyPlanPrompt": "复制计划概览：",
      "export.copyJsonPrompt": "复制 JSON：",
      "export.planPrompt": "Anchor Planner – 计划概览",
      "confirm.clearData": "删除 Anchor Planner 数据？Draw Tools 绘图会保留。",
      "confirm.clearAssignments": "删除所有手动端点指定？",
      "panel.planPortal.one": "{count} 个计划 Portal",
      "panel.planPortal.other": "{count} 个计划 Portal",
      "action.scan": "扫描",
      "action.more": "更多",
      "action.loadNames": "加载名称",
      "action.exportShare": "导出 / 分享",
      "action.sortLocation": "按当前位置排序",
      "action.sortLocationTitle": "从 IITC 最后位置开始的近似直线路线",
      "action.clearData": "删除数据",
      "settings.tolerance": "容差",
      "settings.standard": "默认",
      "filter.aria": "筛选 Portal 列表",
      "filter.all": "全部",
      "filter.open": "未完成",
      "filter.blocked": "受阻",
      "filter.keysMissing": "缺钥匙",
      "filter.done": "已完成",
      "scan.summaryLink.one": "{count} 条 Link",
      "scan.summaryLink.other": "{count} 条 Link",
      "scan.summaryPortal.one": "{count} 个计划 Portal",
      "scan.summaryPortal.other": "{count} 个计划 Portal",
      "scan.summaryEndpoint.one": "{count} 个未解析端点",
      "scan.summaryEndpoint.other": "{count} 个未解析端点",
      "diagnostics.openEndpoints": "未解析端点：",
      "diagnostics.help": "若 Draw Tools/Auto Draw 无有效数据，请放大相关区域，等待 IITC 加载 Portal，再重新扫描或加载名称。",
      "diagnostics.segment": "线段 {segment}{end}：",
      "diagnostics.nearestPortal": "最近的 IITC Portal：{title}（{distance} m）",
      "diagnostics.noPortal": "未找到已加载的 IITC Portal",
      "diagnostics.drawObject": "Draw Tools 对象：",
      "diagnostics.title": "标题：",
      "diagnostics.drawPoints": "最近的 Draw Tools 点：",
      "diagnostics.iitcPortals": "最近的 IITC Portal：",
      "panel.initialHelp": "用 Draw Tools/Auto Draw 创建计划后扫描。优先使用书签，缺失名称随后自动加载。",
      "blocker.title": "阻挡",
      "blocker.blockLink.one": "{count} 条阻挡 Link",
      "blocker.blockLink.other": "{count} 条阻挡 Link",
      "blocker.endPortal.one": "{count} 个端点 Portal",
      "blocker.endPortal.other": "{count} 个端点 Portal",
      "blocker.selected": "已选 {count} 个",
      "blocker.endpointOf.one": "{count} 条阻挡 Link 的端点",
      "blocker.endpointOf.other": "{count} 条阻挡 Link 的端点",
      "blocker.openPlanPortal": "已是未完成计划 Portal",
      "blocker.donePlanPortal": "已完成计划 Portal",
      "blocker.mapLegend": "地图：计划粉色 · 阻挡青色 · 交点黄色",
      "row.keys": "钥匙 {owned}/{required}",
      "row.links": "Link：{count}",
      "row.existing": "已有：{count}",
      "row.open": "未确认：{count}",
      "row.blocked": "受阻：{count}",
      "row.keysNeeded": "所需钥匙",
      "row.moveUp": "上移",
      "row.moveDown": "下移",
      "row.done": "完成",
      "row.actions": "操作",
      "row.emptyFilter": "此筛选条件下无计划 Portal。",
      "overlay.keysNeeded": "所需钥匙 {owned}/{required}",
      "text.plan": "计划：{links}，{portals}",
      "text.planLinkCount.one": "{count} 条 Link",
      "text.planLinkCount.other": "{count} 条 Link",
      "text.planPortalCount.one": "{count} 个计划 Portal",
      "text.planPortalCount.other": "{count} 个计划 Portal",
      "text.existing": "现有 Link：{existing} · 未确认：{unconfirmed}",
      "text.done": "已完成 Portal：{done}/{total}",
      "text.keys": "钥匙：已有 {owned} / 需要 {required}",
      "text.blockers": "阻挡：",
      "text.planLink": "计划 Link：",
      "text.loadedLinksHint": "注意：仅检查了 IITC 当前已加载的现有 Link。",
      "text.doneSuffix": "已完成",
      "text.address": "地址：",
      "text.links": "Link：{total} · 已有：{existing} · 未确认：{open} · 受阻：{blocked}",
      "text.keysPortal": "钥匙：{owned}/{required}",
      "text.note": "备注："
    }
  };
  // AP_LOCALES_END

  ap.state = {
    tolerance: ap.DEFAULT_TOLERANCE_M,
    minAnchorLinks: ap.MIN_ANCHOR_LINKS,
    anchors: {},
    lastScan: null,
    panelCollapsed: false,
    showDebug: false,
    listFilter: 'all',
    endpointAssignments: {},
    blockerRoutePortals: {},
    language: 'auto'
  };

  ap.runtime = {
    layerGroup: null,
    panel: null,
    enabled: true,
    stats: {},
    links: [],
    existingLinkIds: {},
    existingLinks: [],
    unresolvedEndpoints: [],
    selectedBlocker: null,
    userLocation: null,
    userLocationHooksBound: false,
    nextTargetKey: null,
    overlayCount: 0,
    htmlOverlay: null,
    mapDataPanelRefreshTimer: null
  };

  ap.escapeHtml = function (value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  ap.detectLanguage = function () {
    var candidates = [];
    try {
      if (navigator.languages && navigator.languages.length) candidates = candidates.concat(navigator.languages);
      if (navigator.language) candidates.push(navigator.language);
    } catch (e) {}
    try {
      if (document && document.documentElement && document.documentElement.lang) candidates.push(document.documentElement.lang);
    } catch (e2) {}
    for (var i = 0; i < candidates.length; i++) {
      var available = ap.findAvailableLanguage(candidates[i]);
      if (available) return available;
    }
    return ap.FALLBACK_LANGUAGE;
  };

  ap.findAvailableLanguage = function (language) {
    var normalized = String(language || '').trim().replace(/_/g, '-').toLowerCase();
    if (!normalized) return '';
    var available = Object.keys(ap.LOCALES);
    for (var i = 0; i < available.length; i++) {
      if (available[i].toLowerCase() === normalized) return available[i];
    }
    var base = normalized.split('-')[0];
    for (var j = 0; j < available.length; j++) {
      if (available[j].toLowerCase() === base) return available[j];
    }
    return '';
  };

  ap.languageName = function (language) {
    var table = ap.LOCALES[language] || {};
    return table['language.name'] || language;
  };

  ap.languageOptionsHtml = function () {
    var html = '<option value="auto"' + (ap.state.language === 'auto' ? ' selected' : '') + '>' + ap.escapeHtml(ap.t('language.auto')) + '</option>';
    Object.keys(ap.LOCALES).sort().forEach(function (language) {
      html += '<option value="' + ap.escapeHtml(language) + '"' + (ap.state.language === language ? ' selected' : '') + '>' + ap.escapeHtml(ap.languageName(language)) + '</option>';
    });
    return html;
  };

  ap.getLanguage = function () {
    var selected = ap.state && ap.state.language;
    if (selected && selected !== 'auto') {
      var available = ap.findAvailableLanguage(selected);
      if (available) return available;
    }
    return ap.detectLanguage();
  };

  ap.t = function (key, values) {
    var language = ap.getLanguage();
    var table = ap.LOCALES[language] || {};
    var fallback = ap.LOCALES[ap.FALLBACK_LANGUAGE] || {};
    var text = Object.prototype.hasOwnProperty.call(table, key) ? table[key] : fallback[key];
    if (text == null) {
      console.warn('[Anchor Planner] Missing translation:', key, language);
      text = key;
    }
    values = values || {};
    return String(text).replace(/\{([A-Za-z0-9_]+)\}/g, function (match, name) {
      return Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match;
    });
  };

  ap.tp = function (baseKey, count, values) {
    var data = Object.assign({}, values || {}, { count: count });
    return ap.t(baseKey + (Number(count) === 1 ? '.one' : '.other'), data);
  };

  ap.isMissingPortalTitle = function (title) {
    var clean = ap.cleanTitle(title);
    if (!clean || clean === ap.MISSING_TITLE) return true;
    return Object.keys(ap.LOCALES).some(function (language) {
      return clean === ap.LOCALES[language]['portal.nameMissing'];
    });
  };

  ap.displayPortalTitle = function (title) {
    return ap.isMissingPortalTitle(title) ? ap.t('portal.nameMissing') : title;
  };

  ap.isGuidLike = function (value) {
    if (!value) return false;
    var s = String(value).trim();
    // IITC portal GUIDs are long technical identifiers. Do not ever show them as portal names.
    return /^[0-9a-f]{24,}(?:\.[0-9a-f]+)?$/i.test(s) || /^[0-9a-f]{32,}$/i.test(s);
  };

  ap.cleanTitle = function (value) {
    if (typeof value !== 'string') return '';
    var s = value.trim();
    if (!s || ap.isGuidLike(s)) return '';
    return s;
  };


  ap.extractTitleFromObject = function (obj, depth, seen) {
    if (!obj || depth > 4) return '';
    seen = seen || [];
    for (var si = 0; si < seen.length; si++) if (seen[si] === obj) return '';
    if (typeof obj !== 'object') return '';
    seen.push(obj);

    var directKeys = ['title', 'name', 'portalTitle'];
    for (var i = 0; i < directKeys.length; i++) {
      try {
        var direct = ap.cleanTitle(obj[directKeys[i]]);
        if (direct) return direct;
      } catch (e) {}
    }

    var preferredContainers = ['data', 'options', '_details', 'details', 'portal', 'result', 'summary'];
    for (var c = 0; c < preferredContainers.length; c++) {
      try {
        var fromContainer = ap.extractTitleFromObject(obj[preferredContainers[c]], depth + 1, seen);
        if (fromContainer) return fromContainer;
      } catch (e) {}
    }

    if (Array.isArray(obj)) {
      for (var a = 0; a < obj.length; a++) {
        var fromArray = ap.extractTitleFromObject(obj[a], depth + 1, seen);
        if (fromArray) return fromArray;
      }
    }

    return '';
  };

  ap.load = function () {
    try {
      var raw = localStorage.getItem(ap.STORAGE_KEY);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        ap.state = Object.assign(ap.state, parsed);
        ap.state.anchors = ap.state.anchors || {};
        ap.state.endpointAssignments = ap.state.endpointAssignments || {};
        ap.state.blockerRoutePortals = ap.state.blockerRoutePortals || {};
        if (ap.state.language !== 'auto') {
          ap.state.language = ap.findAvailableLanguage(ap.state.language) || 'auto';
        }
        ap.state.tolerance = parseInt(ap.state.tolerance, 10) || ap.DEFAULT_TOLERANCE_M;
        ap.state.minAnchorLinks = parseInt(ap.state.minAnchorLinks, 10) || ap.MIN_ANCHOR_LINKS;
      }
    } catch (e) {
      console.warn('[Anchor Planner] Could not load state', e);
    }
  };

  ap.save = function () {
    try { localStorage.setItem(ap.STORAGE_KEY, JSON.stringify(ap.state)); }
    catch (e) { console.warn('[Anchor Planner] Could not save state', e); }
  };

  ap.toLatLng = function (obj) {
    if (!obj) return null;
    if (obj instanceof L.LatLng) return obj;
    if (typeof obj.lat === 'number' && typeof obj.lng === 'number') return L.latLng(obj.lat, obj.lng);
    if (typeof obj.lat === 'function' && typeof obj.lng === 'function') return L.latLng(obj.lat(), obj.lng());
    return null;
  };

  ap.flattenLatLngs = function (latlngs, out) {
    out = out || [];
    if (!latlngs) return out;
    if (Array.isArray(latlngs)) {
      for (var i = 0; i < latlngs.length; i++) ap.flattenLatLngs(latlngs[i], out);
    } else {
      var ll = ap.toLatLng(latlngs);
      if (ll) out.push(ll);
    }
    return out;
  };

  ap.latLngKey = function (latlng) {
    return Number(latlng.lat).toFixed(6) + ',' + Number(latlng.lng).toFixed(6);
  };

  ap.getPortalTitleFromMarker = function (guid, marker) {
    var candidates = [];
    var data = marker && marker.options && marker.options.data ? marker.options.data : null;

    // Wichtig: zuerst die Daten des tatsächlich zugeordneten window.portals-Markers nutzen.
    if (data) candidates.push(data.title, data.name, data.portalTitle);
    if (marker && marker.options) candidates.push(marker.options.title, marker.options.name, marker.options.portalTitle);
    if (marker && marker._details) candidates.push(marker._details.title, marker._details.name);

    if (marker && typeof marker.getDetails === 'function') {
      try {
        var details = marker.getDetails();
        if (details) candidates.push(details.title, details.name, ap.extractTitleFromObject(details, 0));
      } catch (e) {}
    }

    try {
      if (typeof window.getPortalSummaryData === 'function') {
        var summary = window.getPortalSummaryData(guid);
        if (summary) candidates.push(summary.title, summary.name, ap.extractTitleFromObject(summary, 0));
      }
    } catch (e) {}

    try {
      if (typeof window.getPortalDataByGuid === 'function') {
        var byGuid = window.getPortalDataByGuid(guid);
        if (byGuid) candidates.push(byGuid.title, byGuid.name, ap.extractTitleFromObject(byGuid, 0));
      }
    } catch (e) {}

    // Als letzter Versuch tiefere, aber begrenzte Suche in Marker-Optionen. Keine GUIDs als Namen anzeigen.
    if (marker && marker.options) candidates.push(ap.extractTitleFromObject(marker.options, 0));

    for (var i = 0; i < candidates.length; i++) {
      var title = ap.cleanTitle(candidates[i]);
      if (title) return title;
    }

    return ap.MISSING_TITLE;
  };

  ap.getPortalAddressFromMarker = function (guid, marker) {
    var data = marker && marker.options && marker.options.data ? marker.options.data : {};
    var candidates = [
      data.address,
      data.formattedAddress,
      data.streetAddress,
      data.addr,
      data.portalAddress,
      data.location && data.location.address
    ];
    try {
      if (typeof window.getPortalSummaryData === 'function') {
        var summary = window.getPortalSummaryData(guid);
        if (summary) candidates.push(summary.address, summary.formattedAddress, summary.streetAddress);
      }
    } catch (e) {}
    for (var i = 0; i < candidates.length; i++) {
      if (typeof candidates[i] === 'string' && candidates[i].trim() && !ap.isGuidLike(candidates[i])) return candidates[i].trim();
    }
    return '';
  };

  ap.getLoadedPortals = function () {
    var result = [];
    if (!window.portals) return result;
    for (var guid in window.portals) {
      if (!Object.prototype.hasOwnProperty.call(window.portals, guid)) continue;
      var marker = window.portals[guid];
      if (!marker || typeof marker.getLatLng !== 'function') continue;
      var ll = marker.getLatLng();
      if (!ll) continue;
      result.push({
        guid: guid,
        marker: marker,
        latlng: ll,
        title: ap.getPortalTitleFromMarker(guid, marker),
        address: ap.getPortalAddressFromMarker(guid, marker)
      });
    }
    return result;
  };


  ap.parseLatLngValue = function (value) {
    if (!value) return null;
    try {
      if (value instanceof L.LatLng) return value;
    } catch (e0) {}
    if (typeof value === 'string') {
      var m = value.trim().match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
      if (m) return L.latLng(parseFloat(m[1]), parseFloat(m[2]));
      return null;
    }
    if (Array.isArray(value) && value.length >= 2) {
      var a = parseFloat(value[0]);
      var b = parseFloat(value[1]);
      if (isFinite(a) && isFinite(b)) return L.latLng(a, b);
    }
    if (typeof value === 'object') {
      var lat = value.lat, lng = value.lng;
      if (lng == null) lng = value.lon;
      if (lat == null && value.latitude != null) lat = value.latitude;
      if (lng == null && value.longitude != null) lng = value.longitude;
      lat = parseFloat(lat); lng = parseFloat(lng);
      if (isFinite(lat) && isFinite(lng)) return L.latLng(lat, lng);
      if (typeof value.latE6 === 'number' && typeof value.lngE6 === 'number') return L.latLng(value.latE6 / 1e6, value.lngE6 / 1e6);
    }
    return null;
  };

  ap.extractGuidFromObject = function (obj, fallbackKey) {
    var candidates = [];
    try {
      candidates.push(obj && obj.guid, obj && obj.portalGuid, obj && obj.portalId, obj && obj.portalGUID, fallbackKey);
      if (obj && obj.options) candidates.push(obj.options.guid, obj.options.portalGuid, obj.options.portalId);
      if (obj && obj.data) candidates.push(obj.data.guid, obj.data.portalGuid, obj.data.portalId);
    } catch (e) {}
    for (var i = 0; i < candidates.length; i++) {
      var s = candidates[i] == null ? '' : String(candidates[i]).trim();
      if (s && ap.isGuidLike(s)) return s;
    }
    return '';
  };

  ap.extractBookmarkLabelFromObject = function (obj) {
    var candidates = [];
    try {
      candidates.push(obj && obj.label, obj && obj.title, obj && obj.name, obj && obj.portalTitle, obj && obj.portalName);
      if (obj && obj.options) candidates.push(obj.options.label, obj.options.title, obj.options.name, obj.options.portalTitle, obj.options.portalName);
      if (obj && obj.data) candidates.push(obj.data.label, obj.data.title, obj.data.name, obj.data.portalTitle, obj.data.portalName);
      candidates.push(ap.extractTitleFromObject(obj, 0));
    } catch (e) {}
    for (var i = 0; i < candidates.length; i++) {
      var t = ap.cleanTitle(candidates[i]);
      if (t) return t;
    }
    return '';
  };

  ap.extractLatLngFromBookmarkObject = function (obj) {
    if (!obj || typeof obj !== 'object') return null;
    var keys = ['latlng', 'latLng', 'll', 'location', 'coordinates', 'coord', 'point'];
    for (var i = 0; i < keys.length; i++) {
      var ll = ap.parseLatLngValue(obj[keys[i]]);
      if (ll) return ll;
    }
    return ap.parseLatLngValue(obj);
  };

  ap.collectPortalBookmarks = function (loadedPortals) {
    var result = [];
    var seenObjs = [];
    var seenKeys = {};
    var loadedByGuid = {};
    var sourceStats = [];
    (loadedPortals || []).forEach(function (p) { loadedByGuid[p.guid] = p; });

    function hasSeen(obj) {
      for (var i = 0; i < seenObjs.length; i++) if (seenObjs[i] === obj) return true;
      return false;
    }

    function add(obj, fallbackKey, path, sourceName) {
      var ll = ap.extractLatLngFromBookmarkObject(obj);
      if (!ll) return false;
      var guid = ap.extractGuidFromObject(obj, fallbackKey);
      var label = ap.extractBookmarkLabelFromObject(obj);
      var loaded = guid ? loadedByGuid[guid] : null;
      if (!label && loaded) label = loaded.title;
      if (!guid && !label) return false;
      var key = guid || (ap.latLngKey(ll) + '|' + label);
      if (seenKeys[key]) return false;
      seenKeys[key] = true;
      result.push({
        guid: guid || ('bookmark:' + ap.latLngKey(ll) + ':' + result.length),
        marker: loaded ? loaded.marker : null,
        latlng: ll,
        title: label || ap.MISSING_TITLE,
        address: loaded ? loaded.address : '',
        source: 'Bookmark',
        bookmarkPath: path || '',
        bookmarkSource: sourceName || '',
        originalGuid: guid || ''
      });
      return true;
    }

    function tryParseJsonString(str) {
      if (typeof str !== 'string') return null;
      var t = str.trim();
      if (!t || (t[0] !== '{' && t[0] !== '[')) return null;
      try { return JSON.parse(t); } catch (e) { return null; }
    }

    function visit(obj, depth, path, keyName, sourceName) {
      if (obj == null || depth > 12) return 0;
      if (typeof obj === 'string') {
        var parsed = tryParseJsonString(obj);
        if (parsed) return visit(parsed, depth + 1, path + ' <json>', keyName, sourceName);
        return 0;
      }
      if (typeof obj !== 'object' || hasSeen(obj)) return 0;
      seenObjs.push(obj);
      var added = 0;
      try { if (add(obj, keyName, path, sourceName)) added++; } catch (e) {}
      if (Array.isArray(obj)) {
        for (var a = 0; a < obj.length; a++) added += visit(obj[a], depth + 1, path + '[' + a + ']', String(a), sourceName);
        return added;
      }
      for (var k in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
        var val = obj[k];
        if (val == null) continue;
        if (k === 'map' || k === 'layerGroup' || k === 'starLayerGroup') continue;
        if (typeof val === 'function') continue;
        if (typeof val !== 'object' && typeof val !== 'string') continue;
        added += visit(val, depth + 1, path ? path + '.' + k : k, k, sourceName);
      }
      return added;
    }

    function addRoot(name, obj) {
      var before = result.length;
      try { visit(obj, 0, name, '', name); } catch (e) {}
      var count = result.length - before;
      sourceStats.push({ name: name, count: count, present: !!obj });
    }

    // 1) Runtime plugin object, if the Bookmarks plugin is loaded.
    var bm = window.plugin && window.plugin.bookmarks;
    addRoot('window.plugin.bookmarks', bm);
    if (bm && bm.bkmrksObj) addRoot('window.plugin.bookmarks.bkmrksObj', bm.bkmrksObj);
    if (bm && bm.bkmrksObj && bm.bkmrksObj.portals) addRoot('window.plugin.bookmarks.bkmrksObj.portals', bm.bkmrksObj.portals);

    // 2) Known localStorage keys used by the IITC Bookmarks plugin and older variants.
    var knownKeys = [
      'plugin-bookmarks',
      'plugin-bookmarks-portals-data',
      'plugin-bookmarks-maps-data',
      'plugin-bookmarks-data',
      'plugin-bookmarks-backup'
    ];
    for (var i = 0; i < knownKeys.length; i++) {
      try {
        var raw = localStorage.getItem(knownKeys[i]);
        if (raw) addRoot('localStorage.' + knownKeys[i], raw);
      } catch (e1) {}
    }

    // 3) Conservative generic fallback: inspect other localStorage keys containing "bookmark".
    // This is read-only and only parses JSON-looking values.
    try {
      for (var li = 0; li < localStorage.length; li++) {
        var key = localStorage.key(li);
        if (!key || !/bookm/i.test(key)) continue;
        if (knownKeys.indexOf(key) !== -1) continue;
        var value = localStorage.getItem(key);
        if (!value) continue;
        var parsed = tryParseJsonString(value);
        if (parsed) addRoot('localStorage.' + key, parsed);
      }
    } catch (e2) {}

    ap.runtime.bookmarkSources = sourceStats;
    return result;
  };

  ap.mergePortalSources = function (loadedPortals, bookmarks) {
    var out = [];
    var byGuid = {};
    (loadedPortals || []).forEach(function (p) { byGuid[p.guid] = p; });
    (bookmarks || []).forEach(function (b) {
      var loaded = b.originalGuid ? byGuid[b.originalGuid] : byGuid[b.guid];
      if (loaded) {
        out.push(Object.assign({}, loaded, {
          title: b.title || loaded.title,
          latlng: b.latlng || loaded.latlng,
          address: loaded.address || b.address || '',
          source: 'Bookmark+IITC',
          bookmarkPath: b.bookmarkPath || ''
        }));
      } else {
        out.push(b);
      }
    });
    (loadedPortals || []).forEach(function (p) {
      // Include loaded portals that are not already present as bookmarks.
      var found = false;
      for (var i = 0; i < out.length; i++) if (out[i].guid === p.guid) { found = true; break; }
      if (!found) out.push(Object.assign({}, p, { source: 'IITC' }));
    });
    return out;
  };

  ap.findNearestPortalInfo = function (latlng, portals) {
    var best = null;
    var bestDist = Infinity;
    for (var i = 0; i < portals.length; i++) {
      var dist = latlng.distanceTo(portals[i].latlng);
      if (dist < bestDist) {
        bestDist = dist;
        best = portals[i];
      }
    }
    if (!best) return null;
    return Object.assign({}, best, { distance: bestDist, withinTolerance: bestDist <= ap.state.tolerance });
  };

  ap.portalCandidatesForEndpoint = function (latlng, portals, limit) {
    var list = [];
    if (!latlng || !portals) return list;
    for (var i = 0; i < portals.length; i++) {
      try {
        var dist = latlng.distanceTo(portals[i].latlng);
        list.push(Object.assign({}, portals[i], { distance: dist }));
      } catch (e) {}
    }
    list.sort(function (a, b) { return a.distance - b.distance; });
    return list.slice(0, limit || 12).map(function (p) {
      return {
        guid: p.guid,
        title: p.title || ap.MISSING_TITLE,
        lat: p.latlng ? p.latlng.lat : null,
        lng: p.latlng ? p.latlng.lng : null,
        address: p.address || '',
        source: p.source || '',
        distance: isFinite(p.distance) ? Math.round(p.distance) : null
      };
    });
  };

  ap.findNearestPortal = function (latlng, portals) {
    var best = ap.findNearestPortalInfo(latlng, portals);
    if (best && best.withinTolerance) return best;
    return null;
  };

  ap.getPortalInfoByGuid = function (guid, portals) {
    if (!guid || !portals) return null;
    for (var i = 0; i < portals.length; i++) if (portals[i].guid === guid) return portals[i];
    return null;
  };

  ap.portalInfoFromAssignment = function (key, portals) {
    var assignment = ap.state.endpointAssignments && ap.state.endpointAssignments[key];
    if (!assignment) return null;
    var loaded = ap.getPortalInfoByGuid(assignment.guid, portals);
    if (loaded) return Object.assign({}, loaded, { distance: null, withinTolerance: true, manualAssigned: true });
    if (typeof assignment.lat === 'number' && typeof assignment.lng === 'number') {
      return {
        guid: assignment.guid || ('assigned:' + key),
        marker: null,
        latlng: L.latLng(assignment.lat, assignment.lng),
        title: assignment.title || ap.t('portal.manuallyAssigned'),
        address: assignment.address || '',
        distance: null,
        withinTolerance: true,
        manualAssigned: true
      };
    }
    return null;
  };

  ap.collectDrawToolLayers = function () {
    var root = window.plugin && window.plugin.drawTools;
    var layers = [];
    var seen = [];

    function hasSeen(obj) {
      for (var i = 0; i < seen.length; i++) if (seen[i] === obj) return true;
      return false;
    }

    function visit(obj, depth) {
      if (!obj || depth > 8 || hasSeen(obj)) return;
      seen.push(obj);

      if (typeof obj.getLatLngs === 'function') {
        layers.push(obj);
        return;
      }

      if (typeof obj.eachLayer === 'function') {
        try { obj.eachLayer(function (layer) { visit(layer, depth + 1); }); } catch (e) {}
      }

      if (obj._layers && typeof obj._layers === 'object') {
        for (var id in obj._layers) if (Object.prototype.hasOwnProperty.call(obj._layers, id)) visit(obj._layers[id], depth + 1);
      }

      // Nur begrenzt in Draw-Tools-Objekten suchen, um keine fremden IITC-Strukturen zu durchlaufen.
      if (depth < 2 && obj === root) {
        for (var key in obj) {
          if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
          if (key === 'data' || key === 'settings' || key === 'tools') continue;
          var val = obj[key];
          if (val && typeof val === 'object') visit(val, depth + 1);
        }
      }
    }

    visit(root, 0);
    return layers;
  };


  ap.collectDrawToolPointLayers = function () {
    var root = window.plugin && window.plugin.drawTools;
    var points = [];
    var seen = [];

    function hasSeen(obj) {
      for (var i = 0; i < seen.length; i++) if (seen[i] === obj) return true;
      return false;
    }

    function visit(obj, depth) {
      if (!obj || depth > 8 || hasSeen(obj)) return;
      seen.push(obj);

      if (typeof obj.getLatLng === 'function' && typeof obj.getLatLngs !== 'function') {
        try {
          var ll = obj.getLatLng();
          if (ll) points.push({
            layer: obj,
            latlng: ll,
            title: ap.extractDrawToolObjectTitle(obj),
            type: ap.getLayerTypeName(obj),
            optionKeys: ap.objectKeys(obj.options, 20)
          });
        } catch (e) {}
      }

      if (typeof obj.eachLayer === 'function') {
        try { obj.eachLayer(function (layer) { visit(layer, depth + 1); }); } catch (e) {}
      }

      if (obj._layers && typeof obj._layers === 'object') {
        for (var id in obj._layers) if (Object.prototype.hasOwnProperty.call(obj._layers, id)) visit(obj._layers[id], depth + 1);
      }

      if (depth < 2 && obj === root) {
        for (var key in obj) {
          if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
          if (key === 'data' || key === 'settings' || key === 'tools') continue;
          var val = obj[key];
          if (val && typeof val === 'object') visit(val, depth + 1);
        }
      }
    }

    visit(root, 0);
    return points;
  };

  ap.getLayerTypeName = function (obj) {
    if (!obj) return '';
    try {
      if (obj.constructor && obj.constructor.name) return obj.constructor.name;
    } catch (e) {}
    if (typeof L !== 'undefined') {
      try { if (L.Polygon && obj instanceof L.Polygon) return 'L.Polygon'; } catch (e1) {}
      try { if (L.Polyline && obj instanceof L.Polyline) return 'L.Polyline'; } catch (e2) {}
      try { if (L.Marker && obj instanceof L.Marker) return 'L.Marker'; } catch (e3) {}
    }
    return typeof obj;
  };

  ap.objectKeys = function (obj, limit) {
    var out = [];
    if (!obj || typeof obj !== 'object') return out;
    for (var k in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, k)) continue;
      out.push(k);
      if (out.length >= (limit || 20)) break;
    }
    return out;
  };

  ap.extractDrawToolObjectTitle = function (obj) {
    var candidates = [];
    if (!obj) return '';
    try {
      candidates.push(obj.title, obj.name, obj.label, obj.portalTitle, obj.portalName, obj.guid);
      if (obj.options) candidates.push(obj.options.title, obj.options.name, obj.options.label, obj.options.portalTitle, obj.options.portalName, ap.extractTitleFromObject(obj.options, 0));
      if (obj.feature && obj.feature.properties) candidates.push(obj.feature.properties.title, obj.feature.properties.name, obj.feature.properties.label, ap.extractTitleFromObject(obj.feature.properties, 0));
      candidates.push(ap.extractTitleFromObject(obj, 0));
    } catch (e) {}
    for (var i = 0; i < candidates.length; i++) {
      var v = candidates[i];
      if (typeof v === 'string' && v.trim()) return v.trim();
    }
    return '';
  };

  ap.drawToolPointCandidatesForEndpoint = function (latlng, points, limit) {
    var list = [];
    if (!latlng || !points) return list;
    for (var i = 0; i < points.length; i++) {
      try {
        var dist = latlng.distanceTo(points[i].latlng);
        list.push({
          title: points[i].title || '(ohne Name)',
          type: points[i].type || '',
          lat: points[i].latlng.lat,
          lng: points[i].latlng.lng,
          distance: Math.round(dist),
          optionKeys: points[i].optionKeys || []
        });
      } catch (e) {}
    }
    list.sort(function (a, b) { return a.distance - b.distance; });
    return list.slice(0, limit || 5);
  };

  ap.layerDebugInfo = function (layer) {
    return {
      type: ap.getLayerTypeName(layer),
      title: ap.extractDrawToolObjectTitle(layer),
      optionKeys: ap.objectKeys(layer && layer.options, 25),
      ownKeys: ap.objectKeys(layer, 25)
    };
  };

  ap.extractSegments = function (layer) {
    var latlngs;
    try { latlngs = layer.getLatLngs(); } catch (e) { return []; }
    var points = ap.flattenLatLngs(latlngs, []);
    if (points.length < 2) return [];

    var segments = [];
    for (var i = 0; i < points.length - 1; i++) {
      if (points[i].distanceTo(points[i + 1]) > 0.01) segments.push([points[i], points[i + 1]]);
    }

    var isPolygon = (typeof L !== 'undefined' && L.Polygon && layer instanceof L.Polygon) ||
      (layer.options && layer.options.fill === true && points.length > 2);
    if (isPolygon && points[0].distanceTo(points[points.length - 1]) > 0.01) segments.push([points[points.length - 1], points[0]]);

    return segments;
  };


  ap.normalizedLinkId = function (a, b) {
    if (!a || !b) return '';
    return [String(a), String(b)].sort().join('|');
  };

  ap.extractLinkEndpointGuids = function (link, fallbackGuid) {
    var data = link && link.options && link.options.data ? link.options.data : {};
    var candidates = [];

    function addPair(a, b, source) {
      if (a && b) candidates.push({ a: String(a), b: String(b), source: source });
    }

    addPair(data.oGuid, data.dGuid, 'data.oGuid/dGuid');
    addPair(data.originGuid, data.destinationGuid, 'data.originGuid/destinationGuid');
    addPair(data.fromGuid, data.toGuid, 'data.fromGuid/toGuid');
    addPair(data.aGuid, data.bGuid, 'data.aGuid/bGuid');
    addPair(data.portalA, data.portalB, 'data.portalA/portalB');
    addPair(data.o, data.d, 'data.o/d');

    if (Array.isArray(data)) {
      // Some IITC structures expose entity arrays. Keep this deliberately conservative.
      var flat = JSON.stringify(data);
      var guids = flat.match(/[0-9a-f]{32}\.\d+/ig) || flat.match(/[0-9a-f]{32,}/ig) || [];
      if (guids.length >= 2) addPair(guids[0], guids[1], 'array-scan');
    }

    if (!candidates.length && fallbackGuid) {
      var text = '';
      try { text = JSON.stringify(data); } catch (e) { text = ''; }
      var matches = text.match(/[0-9a-f]{32}\.\d+/ig) || text.match(/[0-9a-f]{32,}/ig) || [];
      if (matches.length >= 2) addPair(matches[0], matches[1], 'data-json-scan');
    }

    return candidates.length ? candidates[0] : null;
  };

  ap.getLinkLatLngPair = function (link) {
    if (!link) return null;
    try {
      if (typeof link.getLatLngs === 'function') {
        var flat = ap.flattenLatLngs(link.getLatLngs(), []);
        if (flat.length >= 2) return { a: flat[0], b: flat[flat.length - 1], source: 'getLatLngs' };
      }
    } catch (e) {}
    var data = link.options && link.options.data ? link.options.data : {};
    function e6(lat, lng) {
      if (lat == null || lng == null) return null;
      var la = Number(lat), lo = Number(lng);
      if (!isFinite(la) || !isFinite(lo)) return null;
      if (Math.abs(la) > 90) la /= 1e6;
      if (Math.abs(lo) > 180) lo /= 1e6;
      return L.latLng(la, lo);
    }
    var a = e6(data.oLatE6 || data.originLatE6 || data.fromLatE6, data.oLngE6 || data.originLngE6 || data.fromLngE6);
    var b = e6(data.dLatE6 || data.destinationLatE6 || data.toLatE6, data.dLngE6 || data.destinationLngE6 || data.toLngE6);
    return a && b ? { a: a, b: b, source: 'data-e6' } : null;
  };

  ap.collectExistingLinkIds = function (portals) {
    var map = {};
    var list = [];
    var count = 0;
    var unresolved = 0;
    var portalInfo = {};
    (portals || []).forEach(function (portal) {
      if (!portal || !portal.guid) return;
      portalInfo[portal.guid] = {
        title: ap.cleanTitle(portal.title),
        latlng: portal.latlng || null
      };
    });
    if (!window.links) return { map: map, list: list, count: 0, unresolved: 0 };

    Object.keys(window.links).forEach(function (guid) {
      var link = window.links[guid];
      var pair = ap.extractLinkEndpointGuids(link, guid);
      var coords = ap.getLinkLatLngPair(link);
      if (!pair || !pair.a || !pair.b) { unresolved++; return; }
      var id = ap.normalizedLinkId(pair.a, pair.b);
      if (!id) { unresolved++; return; }
      var portalA = portalInfo[pair.a] || {};
      var portalB = portalInfo[pair.b] || {};
      var info = {
        guid: guid,
        a: pair.a,
        b: pair.b,
        source: pair.source,
        titleA: portalA.title || '',
        titleB: portalB.title || '',
        latlngA: coords && coords.a || portalA.latlng || null,
        latlngB: coords && coords.b || portalB.latlng || null
      };
      if (!map[id]) count++;
      map[id] = info;
      list.push(info);
    });

    return { map: map, list: list, count: count, unresolved: unresolved };
  };

  ap.orientation = function (a, b, c) {
    return (Number(b.lng) - Number(a.lng)) * (Number(c.lat) - Number(a.lat)) -
      (Number(b.lat) - Number(a.lat)) * (Number(c.lng) - Number(a.lng));
  };

  ap.properSegmentsIntersect = function (a, b, c, d) {
    if (!a || !b || !c || !d) return false;
    var o1 = ap.orientation(a, b, c);
    var o2 = ap.orientation(a, b, d);
    var o3 = ap.orientation(c, d, a);
    var o4 = ap.orientation(c, d, b);
    var eps = 1e-12;
    // Nur echte Kreuzungen im Inneren zählen. Berührungen/kollineare Fälle werden nicht als Blocker markiert.
    if (Math.abs(o1) <= eps || Math.abs(o2) <= eps || Math.abs(o3) <= eps || Math.abs(o4) <= eps) return false;
    return ((o1 > 0) !== (o2 > 0)) && ((o3 > 0) !== (o4 > 0));
  };

  ap.segmentIntersectionPoint = function (a, b, c, d) {
    if (!a || !b || !c || !d) return null;
    var x1 = Number(a.lng), y1 = Number(a.lat);
    var x2 = Number(b.lng), y2 = Number(b.lat);
    var x3 = Number(c.lng), y3 = Number(c.lat);
    var x4 = Number(d.lng), y4 = Number(d.lat);
    if (![x1, y1, x2, y2, x3, y3, x4, y4].every(isFinite)) return null;
    var denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denominator) <= 1e-15) return null;
    var determinantA = x1 * y2 - y1 * x2;
    var determinantB = x3 * y4 - y3 * x4;
    var lng = (determinantA * (x3 - x4) - (x1 - x2) * determinantB) / denominator;
    var lat = (determinantA * (y3 - y4) - (y1 - y2) * determinantB) / denominator;
    if (!isFinite(lat) || !isFinite(lng)) return null;
    return L.latLng(lat, lng);
  };

  ap.findBlockersForPlannedLink = function (planned, existingLinks) {
    if (!planned || planned.existing || !planned.latlngA || !planned.latlngB) return [];
    var blockers = [];
    (existingLinks || []).forEach(function (real) {
      if (!real || !real.latlngA || !real.latlngB) return;
      // Links mit gemeinsamem Portal dürfen sich am Portal treffen und sind keine Crosslinks.
      if (real.a === planned.a || real.a === planned.b || real.b === planned.a || real.b === planned.b) return;
      if (ap.properSegmentsIntersect(planned.latlngA, planned.latlngB, real.latlngA, real.latlngB)) {
        blockers.push({
          guid: real.guid,
          a: real.a,
          b: real.b,
          titleA: real.titleA || '',
          titleB: real.titleB || '',
          latlngA: real.latlngA || null,
          latlngB: real.latlngB || null
        });
      }
    });
    return blockers;
  };

  ap.portalDisplayLabel = function (guid, fallbackTitle, latlng) {
    var title = '';
    var stat = ap.runtime.stats && ap.runtime.stats[guid];
    if (stat) title = ap.cleanTitle(stat.title);
    if (!title && window.portals && window.portals[guid]) title = ap.getPortalTitleFromMarker(guid, window.portals[guid]);
    if (!title) title = ap.cleanTitle(fallbackTitle);
    if (!ap.isMissingPortalTitle(title)) return title;
    if (latlng && isFinite(Number(latlng.lat)) && isFinite(Number(latlng.lng))) {
      return ap.t('portal.nameMissingCoordinates', {
        lat: Number(latlng.lat).toFixed(6),
        lng: Number(latlng.lng).toFixed(6)
      });
    }
    return ap.t('portal.nameMissingPlain');
  };

  ap.ensureAnchorState = function (guid) {
    if (!ap.state.anchors[guid]) {
      ap.state.anchors[guid] = { ownedKeys: 0, done: false, manual: false, note: '', routeOrder: null };
    }
    var s = ap.state.anchors[guid];
    s.ownedKeys = parseInt(s.ownedKeys || 0, 10) || 0;
    if (s.routeOrder != null) {
      s.routeOrder = parseInt(s.routeOrder, 10);
      if (!isFinite(s.routeOrder)) s.routeOrder = null;
    }
    return s;
  };

  ap.normalizeRouteOrder = function () {
    var current = Object.keys(ap.runtime.stats || {});
    current.sort(function (a, b) {
      var sa = ap.ensureAnchorState(a);
      var sb = ap.ensureAnchorState(b);
      var oa = sa.routeOrder == null ? Number.MAX_SAFE_INTEGER : sa.routeOrder;
      var ob = sb.routeOrder == null ? Number.MAX_SAFE_INTEGER : sb.routeOrder;
      if (oa !== ob) return oa - ob;
      var ta = (ap.runtime.stats[a] && ap.runtime.stats[a].title) || '';
      var tb = (ap.runtime.stats[b] && ap.runtime.stats[b].title) || '';
      return String(ta).localeCompare(String(tb));
    });
    current.forEach(function (guid, index) { ap.ensureAnchorState(guid).routeOrder = index; });
  };

  ap.rememberUserLocation = function (latlng, accuracy, source) {
    if (!latlng) return null;
    var lat = Number(latlng.lat);
    var lng = Number(latlng.lng);
    if (!isFinite(lat) || !isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
    // Das User-Location-Plugin startet seinen Marker bei 0/0, bevor ein echter Standort vorliegt.
    if (lat === 0 && lng === 0) return null;
    ap.runtime.userLocation = {
      latlng: L.latLng(lat, lng),
      accuracy: accuracy != null && isFinite(Number(accuracy)) ? Number(accuracy) : null,
      source: source || 'IITC',
      at: Date.now()
    };
    return ap.runtime.userLocation;
  };

  ap.onIitcUserLocation = function (event) {
    var data = event && event.data ? event.data : event;
    if (data && data.latlng && ap.rememberUserLocation(data.latlng, data.accuracy, 'IITC User Location')) {
      ap.refreshLocationDependentUi();
    }
  };

  ap.getCurrentUserLocation = function () {
    try {
      var userLocationPlugin = window.plugin && window.plugin.userLocation;
      if (userLocationPlugin && typeof userLocationPlugin.getUser === 'function') {
        var user = userLocationPlugin.getUser();
        if (user && user.latlng) {
          var remembered = ap.rememberUserLocation(user.latlng, user.accuracy, 'IITC User Location');
          if (remembered) return remembered;
        }
      }
    } catch (e) {}
    ap.runtime.userLocation = null;
    return null;
  };

  ap.setupUserLocationIntegration = function () {
    if (ap.runtime.userLocationHooksBound) return;
    ap.runtime.userLocationHooksBound = true;
    var userLocationPlugin = window.plugin && window.plugin.userLocation;
    if (userLocationPlugin && typeof userLocationPlugin.getUser === 'function' && typeof window.addHook === 'function') {
      try { window.addHook('pluginUserLocation', ap.onIitcUserLocation); } catch (e) {}
    }
    ap.getCurrentUserLocation();
    ap.refreshLocationDependentUi();
  };

  ap.sortRouteFromUserLocation = function () {
    var location = ap.getCurrentUserLocation();
    if (!location || !location.latlng) {
      if (typeof window.alert === 'function') window.alert(ap.t('route.noLocation'));
      return false;
    }

    var currentOrder = ap.sortedStats(false);
    var open = currentOrder.filter(function (stat) { return !ap.ensureAnchorState(stat.guid).done; });
    var done = currentOrder.filter(function (stat) { return ap.ensureAnchorState(stat.guid).done; });
    if (!open.length) {
      if (typeof window.alert === 'function') window.alert(ap.t('route.noOpenPlanPortals'));
      return false;
    }

    var ordered = [];
    var remaining = open.slice();
    var currentPoint = location.latlng;
    while (remaining.length) {
      var bestIndex = 0;
      var bestDistance = Infinity;
      for (var i = 0; i < remaining.length; i++) {
        var candidate = remaining[i];
        var candidatePoint = L.latLng(Number(candidate.lat), Number(candidate.lng));
        var distance = currentPoint.distanceTo(candidatePoint);
        if (distance < bestDistance || (distance === bestDistance && String(candidate.title || '').localeCompare(String(remaining[bestIndex].title || '')) < 0)) {
          bestDistance = distance;
          bestIndex = i;
        }
      }
      var next = remaining.splice(bestIndex, 1)[0];
      ordered.push(next);
      currentPoint = L.latLng(Number(next.lat), Number(next.lng));
    }

    ordered.concat(done).forEach(function (stat, index) {
      ap.ensureAnchorState(stat.guid).routeOrder = index;
    });
    ap.save();
    ap.renderOverlays();
    ap.renderPanel();
    return true;
  };

  ap.movePortal = function (guid, delta) {
    ap.normalizeRouteOrder();
    var list = ap.sortedStats(false).map(function (stat) { return stat.guid; });
    var index = list.indexOf(guid);
    if (index < 0) return;
    var target = index + delta;
    if (target < 0 || target >= list.length) return;
    var other = list[target];
    var a = ap.ensureAnchorState(guid);
    var b = ap.ensureAnchorState(other);
    var tmp = a.routeOrder;
    a.routeOrder = b.routeOrder;
    b.routeOrder = tmp;
    ap.save();
    ap.renderOverlays();
    ap.renderPanel();
  };

  ap.getNextPortal = function (location) {
    var open = ap.sortedStats(false).filter(function (stat) {
      return !ap.ensureAnchorState(stat.guid).done;
    });
    if (!open.length) return null;

    if (!arguments.length) location = ap.getCurrentUserLocation();
    if (!location || !location.latlng) return open[0];
    var nearest = open[0];
    var nearestDistance = Infinity;
    for (var i = 0; i < open.length; i++) {
      try {
        var point = L.latLng(Number(open[i].lat), Number(open[i].lng));
        var distance = location.latlng.distanceTo(point);
        if (isFinite(distance) && distance < nearestDistance) {
          nearest = open[i];
          nearestDistance = distance;
        }
      } catch (e) {}
    }
    return nearest;
  };

  ap.distanceToPortal = function (location, portal) {
    if (!location || !location.latlng || !portal) return null;
    try {
      var point = L.latLng(Number(portal.lat), Number(portal.lng));
      var distance = location.latlng.distanceTo(point);
      return isFinite(distance) && distance >= 0 ? distance : null;
    } catch (e) {
      return null;
    }
  };

  ap.formatDistance = function (distance) {
    if (distance == null || !isFinite(Number(distance)) || Number(distance) < 0) return '';
    distance = Number(distance);
    if (distance < 1000) return (Math.round(distance / 10) * 10) + ' m';
    return (distance / 1000).toFixed(1).replace('.', ',') + ' km';
  };

  ap.getBlockerWorklist = function (location) {
    var candidates = {};
    var selections = ap.state.blockerRoutePortals || {};

    function addEndpoint(guid, fallbackTitle, latlng, blockerId) {
      if (!guid || !latlng || !isFinite(Number(latlng.lat)) || !isFinite(Number(latlng.lng))) return;
      if (!candidates[guid]) {
        candidates[guid] = {
          guid: guid,
          title: ap.portalDisplayLabel(guid, fallbackTitle, latlng),
          lat: Number(latlng.lat),
          lng: Number(latlng.lng),
          blockerIds: {},
          isPlanPortal: !!(ap.runtime.stats && ap.runtime.stats[guid]),
          isOpenPlanPortal: !!(ap.runtime.stats && ap.runtime.stats[guid] && !ap.ensureAnchorState(guid).done),
          selected: false,
          distance: null
        };
      }
      candidates[guid].blockerIds[blockerId] = true;
    }

    (ap.runtime.links || []).forEach(function (plannedLink) {
      if (!plannedLink || plannedLink.existing || !plannedLink.blocked) return;
      (plannedLink.blockers || []).forEach(function (blocker, blockerIndex) {
        var blockerId = blocker.guid || ap.normalizedLinkId(blocker.a, blocker.b) || (plannedLink.id + ':' + blockerIndex);
        addEndpoint(blocker.a, blocker.titleA, blocker.latlngA, blockerId);
        addEndpoint(blocker.b, blocker.titleB, blocker.latlngB, blockerId);
      });
    });

    var list = Object.keys(candidates).map(function (guid) {
      var candidate = candidates[guid];
      candidate.blockerCount = Object.keys(candidate.blockerIds).length;
      candidate.selected = !candidate.isOpenPlanPortal && Object.prototype.hasOwnProperty.call(selections, guid) && !!selections[guid];
      candidate.distance = ap.distanceToPortal(location, candidate);
      return candidate;
    });

    list.sort(function (a, b) {
      if (b.blockerCount !== a.blockerCount) return b.blockerCount - a.blockerCount;
      if (a.isPlanPortal !== b.isPlanPortal) return a.isPlanPortal ? -1 : 1;
      var ad = a.distance == null ? Infinity : a.distance;
      var bd = b.distance == null ? Infinity : b.distance;
      if (ad !== bd) return ad - bd;
      return String(a.title || '').localeCompare(String(b.title || ''));
    });
    return list;
  };

  ap.getRouteTasks = function (location) {
    var tasks = [];
    var included = {};
    ap.sortedStats(false).forEach(function (stat) {
      if (ap.ensureAnchorState(stat.guid).done || included[stat.guid]) return;
      var task = Object.assign({}, stat, { routeTargetType: 'plan' });
      tasks.push(task);
      included[stat.guid] = true;
    });
    ap.getBlockerWorklist(location).forEach(function (candidate) {
      if (!candidate.selected || included[candidate.guid]) return;
      candidate.routeTargetType = 'blocker';
      tasks.push(candidate);
      included[candidate.guid] = true;
    });
    return tasks;
  };

  ap.getNextRouteTarget = function (location) {
    var tasks = ap.getRouteTasks(location);
    if (!tasks.length) return null;
    if (!location || !location.latlng) return tasks[0];
    var nearest = tasks[0];
    var nearestDistance = Infinity;
    tasks.forEach(function (candidate) {
      var distance = ap.distanceToPortal(location, candidate);
      if (distance != null && distance < nearestDistance) {
        nearest = candidate;
        nearestDistance = distance;
      }
    });
    return nearest;
  };

  ap.getRouteEstimate = function (location) {
    if (!location || !location.latlng) return null;
    var remaining = ap.getRouteTasks(location).slice();
    if (!remaining.length) return null;
    var targetCount = remaining.length;
    var currentPoint = location.latlng;
    var distance = 0;
    while (remaining.length) {
      var bestIndex = 0;
      var bestDistance = Infinity;
      for (var i = 0; i < remaining.length; i++) {
        try {
          var point = L.latLng(Number(remaining[i].lat), Number(remaining[i].lng));
          var candidateDistance = currentPoint.distanceTo(point);
          if (candidateDistance < bestDistance) {
            bestDistance = candidateDistance;
            bestIndex = i;
          }
        } catch (e) {}
      }
      if (!isFinite(bestDistance)) break;
      var next = remaining.splice(bestIndex, 1)[0];
      distance += bestDistance;
      currentPoint = L.latLng(Number(next.lat), Number(next.lng));
    }
    return { distance: distance, targetCount: targetCount };
  };

  ap.routeTargetLabel = function (target, usesLocation) {
    var type = ap.t(target && target.routeTargetType === 'blocker' ? 'route.blockerPortal' : 'route.planPortal');
    return ap.t(usesLocation ? 'route.nextFromLocation' : 'route.next', { type: type });
  };

  ap.routeTargetHtml = function (target, location, estimate) {
    if (!target) return ap.t('route.complete');
    var distanceLabel = location ? ap.formatDistance(ap.distanceToPortal(location, target)) : '';
    var estimateLabel = estimate ? ap.formatDistance(estimate.distance) : '';
    var nav = ap.navigationLinks(target);
    return '<span><b>' + ap.escapeHtml(ap.routeTargetLabel(target, !!location)) + '</b> ' + ap.escapeHtml(ap.displayPortalTitle(target.title)) + (distanceLabel ? ' <span class="ap-next-distance" title="' + ap.escapeHtml(ap.t('route.distanceTitle')) + '">· ' + ap.escapeHtml(distanceLabel) + '</span>' : '') + (estimateLabel ? ' <span class="ap-route-remaining" title="' + ap.escapeHtml(ap.t('route.remainingTitle')) + '">· ' + ap.escapeHtml(ap.t('route.remaining', { distance: estimateLabel })) + ' · ' + ap.escapeHtml(ap.tp('route.target', estimate.targetCount)) + '</span>' : '') + '</span><a target="_blank" rel="noopener" href="' + ap.escapeHtml(nav.waze) + '">Waze</a>';
  };

  ap.updateBlockerWorklistDistances = function (location) {
    var panel = ap.runtime.panel;
    if (!panel) return;
    Array.prototype.forEach.call(panel.querySelectorAll('.ap-blocker-work-row'), function (row) {
      var distanceEl = row.querySelector('.ap-blocker-work-distance');
      if (!distanceEl) return;
      var portal = { lat: Number(row.getAttribute('data-lat')), lng: Number(row.getAttribute('data-lng')) };
      var label = ap.formatDistance(ap.distanceToPortal(location, portal));
      distanceEl.textContent = label ? ' · ' + label + ' ' + ap.t('route.aerial') : '';
    });
  };

  ap.updateNextTarget = function (location) {
    if (!arguments.length) location = ap.getCurrentUserLocation();
    var nextPortal = ap.getNextRouteTarget(location);
    var usesLocation = !!location;
    var distanceLabel = usesLocation && nextPortal ? ap.formatDistance(ap.distanceToPortal(location, nextPortal)) : '';
    var estimate = usesLocation ? ap.getRouteEstimate(location) : null;
    var estimateLabel = estimate ? ap.formatDistance(estimate.distance) + ':' + estimate.targetCount : '';
    var key = (usesLocation ? 'location:' : 'route:') + (nextPortal ? nextPortal.guid + ':' + nextPortal.routeTargetType : 'complete') + ':' + distanceLabel + ':' + estimateLabel;
    var changed = key !== ap.runtime.nextTargetKey;
    ap.runtime.nextTargetKey = key;
    if (!changed) return;

    var el = document.getElementById('ap-next-target');
    if (el) {
      if (nextPortal) {
        el.className = 'ap-next-target';
        el.innerHTML = ap.routeTargetHtml(nextPortal, location, estimate);
      } else {
        el.className = 'ap-next-target ap-next-complete';
        el.innerHTML = ap.escapeHtml(ap.t('route.complete'));
      }
    }
    if (ap.runtime.enabled) ap.renderOverlays();
  };

  ap.refreshLocationDependentUi = function () {
    var location = ap.getCurrentUserLocation();
    ap.updateNextTarget(location);
    ap.updateBlockerWorklistDistances(location);
  };

  ap.scan = function () {
    ap.runtime.selectedBlocker = null;
    if (!(window.plugin && window.plugin.drawTools)) {
      ap.setMessage(ap.t('scan.drawToolsMissing'));
      return;
    }

    var loadedPortals = ap.getLoadedPortals();
    var bookmarks = ap.collectPortalBookmarks(loadedPortals);
    var portals = ap.mergePortalSources(loadedPortals, bookmarks);
    var layers = ap.collectDrawToolLayers();
    var drawPoints = ap.collectDrawToolPointLayers();
    var stats = {};
    var links = [];
    var unresolved = [];
    var seenLinks = {};
    var rawSegments = 0;
    var duplicateLinks = 0;
    var samePortalSegments = 0;
    var bookmarkMatchedEndpoints = 0;
    var existingInfo = ap.collectExistingLinkIds(portals);
    var existingLinkIds = existingInfo.map;
    var existingLinks = existingInfo.list || [];
    var existingPlannedLinks = 0;
    var blockedPlannedLinks = 0;

    for (var i = 0; i < layers.length; i++) {
      var segments = ap.extractSegments(layers[i]);
      var layerDbg = ap.layerDebugInfo(layers[i]);
      for (var s = 0; s < segments.length; s++) {
        rawSegments++;
        var aKey = ap.latLngKey(segments[s][0]);
        var bKey = ap.latLngKey(segments[s][1]);
        var aInfo = ap.findNearestPortalInfo(segments[s][0], portals);
        var bInfo = ap.findNearestPortalInfo(segments[s][1], portals);
        // v0.1.23: keine eigene Endpunkt-Zuordnungslogik mehr.
        // Draw-Tools-/Bookmark-Daten sollen diagnostiziert werden; Koordinatennähe bleibt nur Fallback.
        var a = (aInfo && aInfo.withinTolerance ? aInfo : null);
        var b = (bInfo && bInfo.withinTolerance ? bInfo : null);

        if (!a) unresolved.push({
          key: aKey,
          lat: segments[s][0].lat,
          lng: segments[s][0].lng,
          segment: rawSegments,
          end: 'A',
          nearestGuid: aInfo && aInfo.guid || '',
          nearestTitle: aInfo && aInfo.title || '',
          nearestLat: aInfo && aInfo.latlng ? aInfo.latlng.lat : null,
          nearestLng: aInfo && aInfo.latlng ? aInfo.latlng.lng : null,
          nearestAddress: aInfo && aInfo.address || '',
          nearestDistance: aInfo && isFinite(aInfo.distance) ? Math.round(aInfo.distance) : null,
          candidates: ap.portalCandidatesForEndpoint(segments[s][0], portals, 12),
          drawPointCandidates: ap.drawToolPointCandidatesForEndpoint(segments[s][0], drawPoints, 5),
          layerDebug: layerDbg
        });
        if (!b) unresolved.push({
          key: bKey,
          lat: segments[s][1].lat,
          lng: segments[s][1].lng,
          segment: rawSegments,
          end: 'B',
          nearestGuid: bInfo && bInfo.guid || '',
          nearestTitle: bInfo && bInfo.title || '',
          nearestLat: bInfo && bInfo.latlng ? bInfo.latlng.lat : null,
          nearestLng: bInfo && bInfo.latlng ? bInfo.latlng.lng : null,
          nearestAddress: bInfo && bInfo.address || '',
          nearestDistance: bInfo && isFinite(bInfo.distance) ? Math.round(bInfo.distance) : null,
          candidates: ap.portalCandidatesForEndpoint(segments[s][1], portals, 12),
          drawPointCandidates: ap.drawToolPointCandidatesForEndpoint(segments[s][1], drawPoints, 5),
          layerDebug: layerDbg
        });
        if (!a || !b) continue;
        if (a.source && String(a.source).indexOf('Bookmark') !== -1) bookmarkMatchedEndpoints++;
        if (b.source && String(b.source).indexOf('Bookmark') !== -1) bookmarkMatchedEndpoints++;
        if (a.guid === b.guid) { samePortalSegments++; continue; }

        var linkId = ap.normalizedLinkId(a.guid, b.guid);
        if (seenLinks[linkId]) { duplicateLinks++; continue; }
        seenLinks[linkId] = true;
        var existing = !!existingLinkIds[linkId];
        if (existing) existingPlannedLinks++;
        var plannedLink = {
          id: linkId,
          a: a.guid,
          b: b.guid,
          titleA: ap.cleanTitle(a.title),
          titleB: ap.cleanTitle(b.title),
          existing: existing,
          existingGuid: existing ? existingLinkIds[linkId].guid : '',
          latlngA: L.latLng(a.latlng.lat, a.latlng.lng),
          latlngB: L.latLng(b.latlng.lat, b.latlng.lng),
          blockers: []
        };
        plannedLink.blockers = ap.findBlockersForPlannedLink(plannedLink, existingLinks);
        plannedLink.blocked = plannedLink.blockers.length > 0;
        if (plannedLink.blocked) blockedPlannedLinks++;
        links.push(plannedLink);

        [a, b].forEach(function (p) {
          if (!stats[p.guid]) {
            stats[p.guid] = {
              guid: p.guid,
              title: p.title || ap.MISSING_TITLE,
              address: p.address || '',
              lat: p.latlng.lat,
              lng: p.latlng.lng,
              linkCount: 0,
              existingLinks: 0,
              blockedLinks: 0,
              openLinks: 0,
              requiredKeys: 0,
              candidate: false,
              matchedDistance: p.distance,
              source: p.source || 'IITC'
            };
          }
          stats[p.guid].linkCount++;
          if (existing) stats[p.guid].existingLinks++;
          else {
            if (plannedLink.blocked) stats[p.guid].blockedLinks++;
            stats[p.guid].openLinks++;
            stats[p.guid].requiredKeys++;
          }
          ap.ensureAnchorState(p.guid);
        });
      }
    }

    Object.keys(stats).forEach(function (guid) {
      var local = ap.ensureAnchorState(guid);
      // v0.1.28: Der Schlüsselbedarf wird ausdrücklich aus den noch nicht
      // bestätigten Links berechnet. Bereits vorhandene geplante Links zählen
      // weiterhin bei den geplanten Links, reduzieren aber den Key-Bedarf an
      // beiden beteiligten Planportalen.
      stats[guid].openLinks = Math.max(0, (stats[guid].linkCount || 0) - (stats[guid].existingLinks || 0));
      stats[guid].requiredKeys = stats[guid].openLinks;
      stats[guid].candidate = true;
    });

    ap.runtime.stats = stats;
    ap.runtime.links = links;
    ap.runtime.existingLinkIds = existingLinkIds;
    ap.runtime.existingLinks = existingLinks;
    ap.runtime.unresolvedEndpoints = unresolved;
    ap.normalizeRouteOrder();
    ap.state.lastScan = {
      at: new Date().toISOString(),
      drawLayers: layers.length,
      plannedLinks: links.length,
      existingPlannedLinks: existingPlannedLinks,
      unconfirmedLinks: links.length - existingPlannedLinks,
      openUnblockedLinks: Math.max(0, links.length - existingPlannedLinks - blockedPlannedLinks),
      blockedPlannedLinks: blockedPlannedLinks,
      loadedExistingLinks: existingInfo.count,
      unresolvedExistingLinks: existingInfo.unresolved,
      resolvedPortals: Object.keys(stats).length,
      unresolvedEndpoints: unresolved.length,
      rawSegments: rawSegments,
      drawPointMarkers: drawPoints.length,
      bookmarks: bookmarks.length,
      bookmarkSources: ap.runtime.bookmarkSources || [],
      portalSources: portals.length,
      bookmarkMatchedEndpoints: bookmarkMatchedEndpoints,
      duplicateLinks: duplicateLinks,
      samePortalSegments: samePortalSegments,
      unresolvedSample: unresolved.slice(0, 6)
    };
    ap.save();
    ap.renderOverlays();
    ap.renderPanel();

    // If the scan only found placeholder names, use the same proven logic as the "Namen laden" button automatically.
    // This is intentionally delayed so the scan UI renders first and does not block the map.
    if (Object.keys(stats).some(function (guid) { return stats[guid] && ap.isMissingPortalTitle(stats[guid].title); })) {
      setTimeout(function () { ap.refreshMissingNames(true); }, 250);
    }
  };

  ap.getStatus = function (guid, stat) {
    var local = ap.ensureAnchorState(guid);
    if (local.done) return { key: 'done', label: ap.t('status.done'), symbol: '✓', cls: 'ap-done' };
    if ((stat.blockedLinks || 0) > 0) return { key: 'blocked', label: ap.t('status.blocked'), symbol: '×', cls: 'ap-blocked' };
    if ((stat.requiredKeys || 0) === 0 && (stat.linkCount || 0) > 0) return { key: 'existing', label: ap.t('status.existing'), symbol: '↔', cls: 'ap-existing' };
    if (local.ownedKeys >= stat.requiredKeys && stat.requiredKeys > 0) return { key: 'ready', label: ap.t('status.ready'), symbol: '▲', cls: 'ap-ready' };
    if (local.ownedKeys > 0) return { key: 'partial', label: ap.t('status.partial'), symbol: '◐', cls: 'ap-partial' };
    return { key: 'missing', label: ap.t('status.keysMissing'), symbol: '◆', cls: 'ap-missing' };
  };

  ap.matchesListFilter = function (stat) {
    var filter = ap.state.listFilter || 'all';
    var local = ap.ensureAnchorState(stat.guid);
    if (filter === 'all') return true;
    if (filter === 'open') return !local.done;
    if (filter === 'done') return !!local.done;
    if (filter === 'blocked') return !local.done && (stat.blockedLinks || 0) > 0;
    if (filter === 'keys') return !local.done && (stat.requiredKeys || 0) > (local.ownedKeys || 0);
    return true;
  };

  ap.filterCounts = function (stats) {
    var counts = { all: stats.length, open: 0, blocked: 0, keys: 0, done: 0 };
    stats.forEach(function (stat) {
      var local = ap.ensureAnchorState(stat.guid);
      if (local.done) counts.done++;
      else counts.open++;
      if (!local.done && (stat.blockedLinks || 0) > 0) counts.blocked++;
      if (!local.done && (stat.requiredKeys || 0) > (local.ownedKeys || 0)) counts.keys++;
    });
    return counts;
  };

  ap.getReadiness = function (stats) {
    var last = ap.state.lastScan;
    if (!last) return null;

    var result = {
      key: 'ready',
      label: ap.t('readiness.readyLoaded'),
      summary: [],
      missingKeyPortals: 0,
      missingKeys: 0,
      missingNames: 0,
      unconfirmedLinks: Number(last.unconfirmedLinks) || 0,
      loadedExistingLinks: Number(last.loadedExistingLinks) || 0,
      unresolvedExistingLinks: Number(last.unresolvedExistingLinks) || 0
    };

    (stats || []).forEach(function (stat) {
      var local = ap.ensureAnchorState(stat.guid);
      if (!local.done) {
        var keyDeficit = Math.max(0, (Number(stat.requiredKeys) || 0) - (Number(local.ownedKeys) || 0));
        if (keyDeficit) {
          result.missingKeyPortals++;
          result.missingKeys += keyDeficit;
        }
      }
      if (ap.isMissingPortalTitle(stat.title)) result.missingNames++;
    });

    var unresolvedEndpoints = Number(last.unresolvedEndpoints) || 0;
    var blockedPlannedLinks = Number(last.blockedPlannedLinks) || 0;
    var needsScan = !(stats || []).length && ((Number(last.resolvedPortals) || 0) > 0 || (Number(last.plannedLinks) || 0) > 0);
    var noPlan = !needsScan && !(Number(last.plannedLinks) || 0) && !unresolvedEndpoints;

    if (needsScan) {
      result.key = 'check';
      result.label = ap.t('readiness.rescan');
      result.summary.push(ap.t('readiness.sessionMissing'));
    } else {
      if (unresolvedEndpoints) result.summary.push(ap.tp('readiness.openEndpoint', unresolvedEndpoints));
      if (blockedPlannedLinks) result.summary.push(ap.tp('readiness.blockedPlanLink', blockedPlannedLinks));
      if (result.missingKeys) result.summary.push(ap.tp('readiness.missingKey', result.missingKeys));
      if (result.missingNames) result.summary.push(ap.tp('readiness.missingName', result.missingNames));
      if (result.unresolvedExistingLinks) result.summary.push(ap.tp('readiness.unusableLink', result.unresolvedExistingLinks));
      if (noPlan) result.summary.push(ap.t('readiness.noPlan'));

      if (unresolvedEndpoints || blockedPlannedLinks || result.missingKeys) {
        result.key = 'blocked';
        result.label = ap.t('readiness.notReady');
      } else if (result.missingNames || result.unresolvedExistingLinks || noPlan) {
        result.key = 'check';
        result.label = ap.t('readiness.check');
      }
    }

    return result;
  };

  ap.sortedStats = function (doneLast) {
    if (doneLast == null) doneLast = true;
    var arr = Object.keys(ap.runtime.stats).map(function (guid) { return ap.runtime.stats[guid]; });
    arr.sort(function (a, b) {
      var la = ap.ensureAnchorState(a.guid);
      var lb = ap.ensureAnchorState(b.guid);
      if (doneLast && la.done !== lb.done) return la.done ? 1 : -1;
      var oa = la.routeOrder == null ? Number.MAX_SAFE_INTEGER : la.routeOrder;
      var ob = lb.routeOrder == null ? Number.MAX_SAFE_INTEGER : lb.routeOrder;
      if (oa !== ob) return oa - ob;
      if (b.linkCount !== a.linkCount) return b.linkCount - a.linkCount;
      return String(a.title || '').localeCompare(String(b.title || ''));
    });
    return arr;
  };

  ap.navigationLinks = function (stat) {
    var ll = stat.lat + ',' + stat.lng;
    var q = encodeURIComponent(ll);
    var title = ap.isMissingPortalTitle(stat.title) ? ap.t('portal.generic') : stat.title;
    var labelRaw = stat.address ? title + ' - ' + stat.address : title;
    var label = encodeURIComponent(labelRaw);
    var intel = 'https://intel.ingress.com/intel?ll=' + encodeURIComponent(ll) + '&z=17&pll=' + encodeURIComponent(ll);
    return {
      waze: 'https://waze.com/ul?ll=' + encodeURIComponent(ll) + '&navigate=yes',
      intel: intel,
      google: 'https://www.google.com/maps/search/?api=1&query=' + q,
      apple: 'https://maps.apple.com/?q=' + label + '&ll=' + encodeURIComponent(ll),
      geo: 'geo:' + ll + '?q=' + q + '(' + label + ')',
      shareText: title + '\n' + (stat.address ? stat.address + '\n' : '') + ll + '\nWaze: https://waze.com/ul?ll=' + encodeURIComponent(ll) + '&navigate=yes'
    };
  };

  ap.statusColor = function (status) {
    if (!status) return '#ffffff';
    if (status.key === 'done') return '#eeeeee';
    if (status.key === 'blocked') return '#ff3b30';
    if (status.key === 'existing') return '#bdbdbd';
    if (status.key === 'ready') return '#ff6ad5';
    if (status.key === 'partial') return '#f5d76e';
    return '#ff9f43';
  };

  ap.ensureOverlayPane = function () {
    // In IITC Mobile custom panes can be unreliable. Use Leaflet's default overlay pane.
    return null;
  };

  ap.ensureOverlayLayerVisible = function () {
    if (!window.map || !ap.runtime.layerGroup || !ap.runtime.enabled) return;
    try {
      if (typeof window.map.hasLayer === 'function' && !window.map.hasLayer(ap.runtime.layerGroup)) {
        ap.runtime.layerGroup.addTo(window.map);
      }
    } catch (e) {}
  };

  ap.ensureHtmlOverlay = function () {
    if (ap.runtime.htmlOverlay && ap.runtime.htmlOverlay.parentNode) return ap.runtime.htmlOverlay;
    if (!window.map || !window.map.getContainer) return null;
    var mapContainer = window.map.getContainer();
    var overlay = document.createElement('div');
    overlay.id = 'ap-map-html-overlay';
    overlay.className = 'ap-map-html-overlay';
    overlay.style.position = 'absolute';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '2500';
    overlay.style.overflow = 'visible';
    mapContainer.appendChild(overlay);
    ap.runtime.htmlOverlay = overlay;
    return overlay;
  };

  ap.clearHtmlOverlay = function () {
    var overlay = ap.runtime.htmlOverlay;
    if (overlay) overlay.innerHTML = '';
  };

  ap.statusText = function (status) {
    if (!status) return '!';
    if (status.key === 'done') return 'OK';
    if (status.key === 'blocked') return 'X';
    if (status.key === 'existing') return '0K';
    if (status.key === 'ready') return 'A';
    if (status.key === 'partial') return '½';
    return 'KEY';
  };

  ap.addHtmlStatusMarker = function (stat, status, title, isNext) {
    var overlay = ap.ensureHtmlOverlay();
    if (!overlay || !window.map || !window.map.latLngToContainerPoint) return;
    var point = window.map.latLngToContainerPoint(L.latLng(stat.lat, stat.lng));
    var color = ap.statusColor(status);
    var badge = document.createElement('div');
    badge.className = 'ap-map-badge ap-map-badge-' + (status && status.key ? status.key : 'missing') + (isNext ? ' ap-map-badge-next' : '');
    badge.style.left = Math.round(point.x) + 'px';
    badge.style.top = Math.round(point.y) + 'px';
    badge.style.borderColor = color;
    badge.style.boxShadow = '0 0 0 2px rgba(0,0,0,.95), 0 0 8px rgba(0,0,0,.95)';
    badge.title = String(title || '').replace(/<br\s*\/?>/gi, ' · ').replace(/<[^>]+>/g, '');
    badge.textContent = ap.statusText(status);
    overlay.appendChild(badge);
    ap.runtime.overlayCount++;
  };

  ap.withOverlayPane = function (options) {
    try {
      if (window.map && typeof window.map.getPane === 'function' && window.map.getPane(ap.PANE_NAME)) {
        options.pane = ap.PANE_NAME;
      }
    } catch (e) {}
    return options;
  };

  ap.renderOverlays = function () {
    if (!ap.runtime.layerGroup) return;
    ap.runtime.layerGroup.clearLayers();
    ap.clearHtmlOverlay();
    ap.runtime.overlayCount = 0;
    if (!ap.runtime.enabled) return;
    ap.ensureOverlayLayerVisible();
    var renderedBlockers = {};
    (ap.runtime.links || []).forEach(function (link) {
      if (!link || !link.blocked || !link.latlngA || !link.latlngB) return;
      try {
        var path = L.polyline([link.latlngA, link.latlngB], {
          color: '#ff2d95', weight: 5, opacity: 0.9, dashArray: '8,6', interactive: false
        });
        path.options = ap.withOverlayPane(path.options);
        path.addTo(ap.runtime.layerGroup);
      } catch (e) {}
      (link.blockers || []).forEach(function (blocker, blockerIndex) {
        if (!blocker || !blocker.latlngA || !blocker.latlngB) return;
        var blockerId = blocker.guid || ap.normalizedLinkId(blocker.a, blocker.b) || (link.id + ':' + blockerIndex);
        if (!renderedBlockers[blockerId]) {
          renderedBlockers[blockerId] = true;
          try {
            var blockerPath = L.polyline([blocker.latlngA, blocker.latlngB], {
              color: '#00e5ff', weight: 5, opacity: 0.95, interactive: false
            });
            blockerPath.options = ap.withOverlayPane(blockerPath.options);
            blockerPath.addTo(ap.runtime.layerGroup);
          } catch (e2) {}
        }
        var crossing = ap.segmentIntersectionPoint(link.latlngA, link.latlngB, blocker.latlngA, blocker.latlngB);
        if (crossing) {
          try {
            var crossingMarker = L.circleMarker(crossing, {
              radius: 5, color: '#111', weight: 2, fillColor: '#ffe600', fillOpacity: 1, interactive: false
            });
            crossingMarker.options = ap.withOverlayPane(crossingMarker.options);
            crossingMarker.addTo(ap.runtime.layerGroup);
          } catch (e3) {}
        }
      });
    });
    var selected = ap.runtime.selectedBlocker;
    if (selected && selected.plannedLink && selected.blocker) {
      var planned = selected.plannedLink;
      var blocker = selected.blocker;
      var crossing = selected.intersection || ap.segmentIntersectionPoint(planned.latlngA, planned.latlngB, blocker.latlngA, blocker.latlngB);
      try {
        var selectedPlannedPath = L.polyline([planned.latlngA, planned.latlngB], {
          color: '#ff2d95', weight: 7, opacity: 1, dashArray: '10,6', interactive: false
        });
        selectedPlannedPath.options = ap.withOverlayPane(selectedPlannedPath.options);
        selectedPlannedPath.addTo(ap.runtime.layerGroup);
        var selectedBlockerPath = L.polyline([blocker.latlngA, blocker.latlngB], {
          color: '#00e5ff', weight: 7, opacity: 1, interactive: false
        });
        selectedBlockerPath.options = ap.withOverlayPane(selectedBlockerPath.options);
        selectedBlockerPath.addTo(ap.runtime.layerGroup);
        if (crossing) {
          var selectedCrossingMarker = L.circleMarker(crossing, {
            radius: 7, color: '#111', weight: 3, fillColor: '#ffe600', fillOpacity: 1, interactive: false
          });
          selectedCrossingMarker.options = ap.withOverlayPane(selectedCrossingMarker.options);
          selectedCrossingMarker.addTo(ap.runtime.layerGroup);
        }
      } catch (e4) {}
    }
    var overlayLocation = ap.getCurrentUserLocation();
    var nextPortal = ap.getNextRouteTarget(overlayLocation);
    Object.keys(ap.runtime.stats).forEach(function (guid) {
      var stat = ap.runtime.stats[guid];
      var local = ap.ensureAnchorState(guid);
      // Alle erkannten Planportale sichtbar markieren.

      var status = ap.getStatus(guid, stat);
      var title = ap.escapeHtml(ap.displayPortalTitle(stat.title)) + '<br>' + ap.escapeHtml(status.label) + ' · ' + ap.escapeHtml(ap.t('overlay.keysNeeded', { owned: local.ownedKeys, required: stat.requiredKeys }));
      ap.addHtmlStatusMarker(stat, status, title, !!(nextPortal && nextPortal.guid === guid));
    });
    ap.getBlockerWorklist(overlayLocation).forEach(function (candidate) {
      if (!candidate.selected || (ap.runtime.stats && ap.runtime.stats[candidate.guid])) return;
      try {
        var isNext = !!(nextPortal && nextPortal.guid === candidate.guid);
        var routeMarker = L.circleMarker(L.latLng(candidate.lat, candidate.lng), {
          radius: isNext ? 11 : 8,
          color: isNext ? '#ffffff' : '#f5d76e',
          weight: isNext ? 4 : 3,
          fillColor: '#111111',
          fillOpacity: 0.35,
          opacity: 1,
          interactive: false
        });
        routeMarker.options = ap.withOverlayPane(routeMarker.options);
        routeMarker.addTo(ap.runtime.layerGroup);
      } catch (e5) {}
    });
  };

  ap.focusBlocker = function (plannedLink, blocker) {
    if (!plannedLink || !blocker || !window.map) return;
    var crossing = ap.segmentIntersectionPoint(plannedLink.latlngA, plannedLink.latlngB, blocker.latlngA, blocker.latlngB);
    if (!crossing) {
      ap.setMessage(ap.t('message.intersectionUnknown'));
      return;
    }
    ap.runtime.selectedBlocker = { plannedLink: plannedLink, blocker: blocker, intersection: crossing };
    ap.renderOverlays();
    try {
      var currentZoom = typeof window.map.getZoom === 'function' ? Number(window.map.getZoom()) : 15;
      var targetZoom = Math.max(isFinite(currentZoom) ? currentZoom : 15, 15);
      if (typeof window.map.getMaxZoom === 'function') {
        var maxZoom = Number(window.map.getMaxZoom());
        if (isFinite(maxZoom)) targetZoom = Math.min(targetZoom, maxZoom);
      }
      window.map.setView(crossing, targetZoom, { animate: !ap.isMobile() });
    } catch (e) {
      try { window.map.panTo(crossing); } catch (e2) {}
    }
  };

  ap.setMessage = function (msg) {
    var el = document.getElementById('ap-message');
    if (el) {
      el.textContent = msg;
      var panel = ap.runtime.panel;
      if (panel) panel.classList.add('ap-show-more');
      var moreButton = document.getElementById('ap-more');
      if (moreButton) moreButton.setAttribute('aria-expanded', 'true');
    }
  };

  ap.isMobile = function () {
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '') || (window.isSmartphone && window.isSmartphone());
  };

  ap.showPortalActions = function (guid) {
    var stat = ap.runtime.stats[guid];
    if (!stat) return;
    var nav = ap.navigationLinks(stat);
    var html = '';
    html += '<div><b>' + ap.escapeHtml(ap.displayPortalTitle(stat.title)) + '</b></div>';
    if (stat.address) html += '<div class="ap-address">' + ap.escapeHtml(stat.address) + '</div>';
    html += '<div class="ap-action-label">' + ap.escapeHtml(ap.t('share.section')) + '</div>';
    html += '<div class="ap-share-grid ap-share-grid-single">';
    html += '<button class="ap-copy-share">' + ap.escapeHtml(ap.t('share.copyText')) + '</button>';
    html += '</div>';
    html += '<div class="ap-action-label">' + ap.escapeHtml(ap.t('share.locate')) + '</div>';
    html += '<div class="ap-share-grid">';
    html += '<a class="ap-share-main" target="_blank" rel="noopener" href="' + ap.escapeHtml(nav.waze) + '">Waze</a>';
    html += '<a target="_blank" rel="noopener" href="' + ap.escapeHtml(nav.google) + '">Google Maps</a>';
    html += '<a target="_blank" rel="noopener" href="' + ap.escapeHtml(nav.apple) + '">Apple Maps</a>';
    html += '<a href="' + ap.escapeHtml(nav.geo) + '">geo:</a>';
    html += '</div>';
    html += '<textarea readonly style="width:100%;height:90px;margin-top:8px;font-family:monospace;font-size:12px;">' + ap.escapeHtml(nav.shareText) + '</textarea>';

    if (typeof window.dialog === 'function') {
      window.dialog({ title: ap.t('share.dialogTitle'), html: html, width: 420 });
      setTimeout(function () {
        var btn = document.querySelector('.ui-dialog .ap-copy-share');
        if (btn) btn.onclick = function () {
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(nav.shareText);
          else window.prompt(ap.t('share.prompt'), nav.shareText);
        };
      }, 0);
    } else {
      window.prompt(ap.t('share.prompt'), nav.shareText);
    }
  };


  ap.requestPortalDetails = function (guid, callback) {
    var done = false;
    function finish(data) {
      if (done) return;
      done = true;
      callback && callback(data || null);
    }

    try {
      if (window.portalDetail && typeof window.portalDetail.request === 'function') {
        var ret = window.portalDetail.request(guid, finish);
        if (ret && typeof ret.then === 'function') ret.then(finish).catch(function () { finish(null); });
        setTimeout(function () { finish(null); }, 3500);
        return;
      }
    } catch (e) {}

    try {
      if (typeof window.requestPortalDetail === 'function') {
        var ret2 = window.requestPortalDetail(guid, finish);
        if (ret2 && typeof ret2.then === 'function') ret2.then(finish).catch(function () { finish(null); });
        setTimeout(function () { finish(null); }, 3500);
        return;
      }
    } catch (e2) {}

    finish(null);
  };

  ap.refreshMissingNames = function (auto) {
    var missing = Object.keys(ap.runtime.stats).filter(function (guid) {
      return ap.runtime.stats[guid] && ap.isMissingPortalTitle(ap.runtime.stats[guid].title);
    });
    if (!missing.length) {
      ap.setMessage(ap.t('message.namesNoneMissing'));
      return;
    }

    var idx = 0;
    ap.setMessage(ap.t(auto ? 'message.namesLoadingAuto' : 'message.namesLoading', { current: 0, total: missing.length }));

    function next() {
      if (idx >= missing.length) {
        ap.setMessage(ap.t(auto ? 'message.namesLoadedAuto' : 'message.namesLoaded') + ' ' + ap.t('message.namesUnavailable'));
        ap.renderOverlays();
        ap.renderPanel();
        return;
      }
      var guid = missing[idx++];
      ap.requestPortalDetails(guid, function (data) {
        var marker = window.portals && window.portals[guid];
        var title = ap.getPortalTitleFromMarker(guid, marker);
        if (ap.isMissingPortalTitle(title)) title = ap.extractTitleFromObject(data, 0) || title;
        if (ap.runtime.stats[guid] && title && !ap.isMissingPortalTitle(title)) ap.runtime.stats[guid].title = title;
        ap.setMessage(ap.t(auto ? 'message.namesLoadingAuto' : 'message.namesLoading', { current: idx, total: missing.length }));
        setTimeout(next, 900);
      });
    }

    next();
  };

  ap.blockerEndpointExport = function (guid, fallbackTitle, latlng) {
    var lat = latlng && isFinite(Number(latlng.lat)) ? Number(latlng.lat) : null;
    var lng = latlng && isFinite(Number(latlng.lng)) ? Number(latlng.lng) : null;
    return {
      guid: guid || '',
      label: ap.portalDisplayLabel(guid, fallbackTitle, latlng),
      lat: lat,
      lng: lng
    };
  };

  ap.buildBlockerExport = function () {
    return (ap.runtime.links || []).filter(function (link) {
      return link && !link.existing && link.blocked && link.blockers && link.blockers.length;
    }).map(function (link) {
      return {
        plannedLink: {
          a: ap.blockerEndpointExport(link.a, link.titleA, link.latlngA),
          b: ap.blockerEndpointExport(link.b, link.titleB, link.latlngB)
        },
        blockingLinks: link.blockers.map(function (blocker) {
          return {
            a: ap.blockerEndpointExport(blocker.a, blocker.titleA, blocker.latlngA),
            b: ap.blockerEndpointExport(blocker.b, blocker.titleB, blocker.latlngB)
          };
        })
      };
    });
  };

  ap.exportData = function () {
    var stats = ap.sortedStats();
    return {
      plugin: 'IITC Anchor Planner',
      version: ap.VERSION,
      exportedAt: new Date().toISOString(),
      scan: ap.state.lastScan,
      blockedPlanLinks: ap.buildBlockerExport(),
      anchors: stats.map(function (stat) {
        var local = ap.ensureAnchorState(stat.guid);
        var nav = ap.navigationLinks(stat);
        return {
          guid: stat.guid,
          title: stat.title,
          address: stat.address || '',
          lat: stat.lat,
          lng: stat.lng,
          linkCount: stat.linkCount,
          existingLinks: stat.existingLinks || 0,
          blockedLinks: stat.blockedLinks || 0,
          openLinks: stat.openLinks || stat.requiredKeys || 0,
          requiredKeys: stat.requiredKeys,
          ownedKeys: local.ownedKeys || 0,
          done: !!local.done,
          note: local.note || '',
          navigation: {
            preferred: 'waze',
            waze: nav.waze,
            intel: nav.intel,
            google: nav.google,
            apple: nav.apple,
            geo: nav.geo,
            shareText: nav.shareText
          }
        };
      })
    };
  };

  ap.buildPlanText = function () {
    var stats = ap.sortedStats();
    var last = ap.state.lastScan || {};
    var lines = [];
    var doneCount = 0;
    var totalRequired = 0;
    var totalOwned = 0;
    var blockedPlanLinks = ap.buildBlockerExport();

    stats.forEach(function (stat) {
      var local = ap.ensureAnchorState(stat.guid);
      if (local.done) doneCount++;
      totalRequired += stat.requiredKeys || 0;
      totalOwned += local.ownedKeys || 0;
    });

    lines.push('Anchor Planner');
    lines.push(ap.t('text.plan', {
      links: ap.tp('text.planLinkCount', last.plannedLinks || 0),
      portals: ap.tp('text.planPortalCount', stats.length)
    }));
    lines.push(ap.t('text.existing', { existing: last.existingPlannedLinks || 0, unconfirmed: last.unconfirmedLinks || 0 }));
    lines.push(ap.t('text.done', { done: doneCount, total: stats.length }));
    lines.push(ap.t('text.keys', { owned: totalOwned, required: totalRequired }));
    lines.push('');

    if (blockedPlanLinks.length) {
      lines.push(ap.t('text.blockers'));
      blockedPlanLinks.forEach(function (entry) {
        lines.push(ap.t('text.planLink') + ' ' + entry.plannedLink.a.label + ' ↔ ' + entry.plannedLink.b.label);
        entry.blockingLinks.forEach(function (blocker) {
          lines.push('  - ' + blocker.a.label + ' ↔ ' + blocker.b.label);
        });
        lines.push('');
      });
      lines.push(ap.t('text.loadedLinksHint'));
      lines.push('');
    }

    stats.forEach(function (stat, index) {
      var local = ap.ensureAnchorState(stat.guid);
      var nav = ap.navigationLinks(stat);
      lines.push((index + 1) + '. ' + ap.displayPortalTitle(stat.title) + (local.done ? ' [' + ap.t('text.doneSuffix') + ']' : ''));
      if (stat.address) lines.push('   ' + ap.t('text.address') + ' ' + stat.address);
      lines.push('   ' + ap.t('text.links', { total: stat.linkCount, existing: stat.existingLinks || 0, open: stat.openLinks || stat.requiredKeys || 0, blocked: stat.blockedLinks || 0 }));
      lines.push('   ' + ap.t('text.keysPortal', { owned: local.ownedKeys || 0, required: stat.requiredKeys || 0 }));
      lines.push('   Waze: ' + nav.waze);
      if (local.note) lines.push('   ' + ap.t('text.note') + ' ' + local.note);
      lines.push('');
    });

    return lines.join('\n').replace(/\n+$/, '');
  };

  ap.copyText = function (text, fallbackTitle) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        ap.setMessage(ap.t('message.copied'));
      }).catch(function () {
        window.prompt(fallbackTitle || ap.t('export.copyPrompt'), text);
      });
    } else {
      window.prompt(fallbackTitle || ap.t('export.copyPrompt'), text);
    }
  };

  ap.downloadText = function (filename, text, mime) {
    try {
      var blob = new Blob([text], { type: mime || 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    } catch (e) {
      window.prompt(ap.t('export.exportPrompt'), text);
    }
  };

  ap.showExport = function () {
    var planText = ap.buildPlanText();
    var jsonText = JSON.stringify(ap.exportData(), null, 2);
    var html = '';
    html += '<div class="ap-export-tabs">';
    html += '<button class="ap-export-tab ap-export-tab-active" data-target="text">' + ap.escapeHtml(ap.t('export.planOverview')) + '</button>';
    html += '<button class="ap-export-tab" data-target="json">JSON</button>';
    html += '</div>';
    html += '<div class="ap-export-pane" data-pane="text">';
    html += '<textarea class="ap-export-text" readonly>' + ap.escapeHtml(planText) + '</textarea>';
    html += '<div class="ap-export-actions"><button class="ap-copy-plan">' + ap.escapeHtml(ap.t('export.copyPlan')) + '</button><button class="ap-download-plan">' + ap.escapeHtml(ap.t('export.saveTxt')) + '</button>';
    if (navigator.share) html += '<button class="ap-share-plan">' + ap.escapeHtml(ap.t('export.share')) + '</button>';
    html += '</div></div>';
    html += '<div class="ap-export-pane" data-pane="json" style="display:none">';
    html += '<textarea class="ap-export-json" readonly>' + ap.escapeHtml(jsonText) + '</textarea>';
    html += '<div class="ap-export-actions"><button class="ap-copy-json">' + ap.escapeHtml(ap.t('export.copyJson')) + '</button><button class="ap-download-json">' + ap.escapeHtml(ap.t('export.saveJson')) + '</button></div>';
    html += '</div>';

    if (typeof window.dialog === 'function') {
      window.dialog({ title: ap.t('export.dialogTitle'), html: html, width: 720 });
      setTimeout(function () {
        var root = document.querySelector('.ui-dialog');
        if (!root) return;
        Array.prototype.forEach.call(root.querySelectorAll('.ap-export-tab'), function (button) {
          button.onclick = function () {
            var target = this.getAttribute('data-target');
            Array.prototype.forEach.call(root.querySelectorAll('.ap-export-tab'), function (b) { b.classList.remove('ap-export-tab-active'); });
            this.classList.add('ap-export-tab-active');
            Array.prototype.forEach.call(root.querySelectorAll('.ap-export-pane'), function (pane) {
              pane.style.display = pane.getAttribute('data-pane') === target ? '' : 'none';
            });
          };
        });
        var copyPlan = root.querySelector('.ap-copy-plan');
        if (copyPlan) copyPlan.onclick = function () { ap.copyText(planText, ap.t('export.copyPlanPrompt')); };
        var downloadPlan = root.querySelector('.ap-download-plan');
        if (downloadPlan) downloadPlan.onclick = function () { ap.downloadText('anchor-planner-plan.txt', planText, 'text/plain;charset=utf-8'); };
        var sharePlan = root.querySelector('.ap-share-plan');
        if (sharePlan) sharePlan.onclick = function () {
          navigator.share({ title: 'Anchor Planner', text: planText }).catch(function () {});
        };
        var copyJson = root.querySelector('.ap-copy-json');
        if (copyJson) copyJson.onclick = function () { ap.copyText(jsonText, ap.t('export.copyJsonPrompt')); };
        var downloadJson = root.querySelector('.ap-download-json');
        if (downloadJson) downloadJson.onclick = function () { ap.downloadText('anchor-planner-plan.json', jsonText, 'application/json;charset=utf-8'); };
      }, 0);
    } else {
      window.prompt(ap.t('export.planPrompt'), planText);
    }
  };

  ap.clearData = function () {
    if (!confirm(ap.t('confirm.clearData'))) return;
    ap.state.anchors = {};
    ap.state.blockerRoutePortals = {};
    ap.state.lastScan = null;
    ap.runtime.stats = {};
    ap.runtime.links = [];
    ap.runtime.existingLinkIds = {};
    ap.runtime.existingLinks = [];
    ap.runtime.unresolvedEndpoints = [];
    ap.runtime.selectedBlocker = null;
    ap.save();
    ap.renderOverlays();
    ap.renderPanel();
  };


  ap.assignEndpointToPortal = function (key, guid, title, lat, lng, address) {
    if (!key || !guid) return;
    ap.state.endpointAssignments = ap.state.endpointAssignments || {};
    ap.state.endpointAssignments[key] = {
      guid: guid,
      title: title || ap.t('portal.manuallyAssigned'),
      lat: typeof lat === 'number' ? lat : parseFloat(lat),
      lng: typeof lng === 'number' ? lng : parseFloat(lng),
      address: address || '',
      assignedAt: new Date().toISOString()
    };
    ap.save();
    ap.scan();
  };

  ap.clearEndpointAssignments = function () {
    if (!confirm(ap.t('confirm.clearAssignments'))) return;
    ap.state.endpointAssignments = {};
    ap.save();
    ap.scan();
  };

  ap.renderPanel = function () {
    var panel = ap.runtime.panel;
    if (!panel) return;
    var readinessOpen = !!panel.querySelector('.ap-readiness[open]');
    var blockerSectionOpen = !!panel.querySelector('.ap-blocker-section[open], .ap-blocker-worklist[open], .ap-blocker-details[open]');
    var moreOpen = panel.classList.contains('ap-show-more');
    var expandedPortals = {};
    Array.prototype.forEach.call(panel.querySelectorAll('.ap-row[open]'), function (row) {
      expandedPortals[row.getAttribute('data-guid')] = true;
    });
    panel.style.display = ap.runtime.enabled ? '' : 'none';
    if (!ap.runtime.enabled) return;

    var stats = ap.sortedStats();
    var filterCounts = ap.filterCounts(stats);
    var visibleStats = stats.filter(ap.matchesListFilter);
    var planPortalCount = stats.length;
    var last = ap.state.lastScan;
    var readiness = ap.getReadiness(stats);
    var blockedLinks = (ap.runtime.links || []).filter(function (link) {
      return link && !link.existing && link.blocked && link.blockers && link.blockers.length;
    });
    var blockingLinkIds = {};
    blockedLinks.forEach(function (link, linkIndex) {
      (link.blockers || []).forEach(function (blocker, blockerIndex) {
        var blockerId = blocker.guid || ap.normalizedLinkId(blocker.a, blocker.b) || (linkIndex + ':' + blockerIndex);
        blockingLinkIds[blockerId] = true;
      });
    });
    var blockingLinkCount = Object.keys(blockingLinkIds).length;
    var blockerWorkLocation = ap.getCurrentUserLocation();
    var blockerWorklist = ap.getBlockerWorklist(blockerWorkLocation);
    var nextLocation = blockerWorkLocation;
    var nextPortal = ap.getNextRouteTarget(nextLocation);
    var nextUsesLocation = !!nextLocation;
    var nextDistanceLabel = nextUsesLocation && nextPortal ? ap.formatDistance(ap.distanceToPortal(nextLocation, nextPortal)) : '';
    var routeEstimate = nextUsesLocation ? ap.getRouteEstimate(nextLocation) : null;
    var routeEstimateLabel = routeEstimate ? ap.formatDistance(routeEstimate.distance) + ':' + routeEstimate.targetCount : '';
    ap.runtime.nextTargetKey = (nextUsesLocation ? 'location:' : 'route:') + (nextPortal ? nextPortal.guid + ':' + nextPortal.routeTargetType : 'complete') + ':' + nextDistanceLabel + ':' + routeEstimateLabel;

    var html = '';
    html += '<div class="ap-head"><b>Anchor Planner</b><span>v' + ap.VERSION + '</span><button id="ap-collapse">' + (ap.state.panelCollapsed ? '▴' : '▾') + '</button></div>';
    if (ap.state.panelCollapsed) {
      html += '<div class="ap-mini">' + ap.escapeHtml(ap.tp('panel.planPortal', planPortalCount)) + '</div>';
      panel.innerHTML = html;
      document.getElementById('ap-collapse').onclick = function () { ap.state.panelCollapsed = false; ap.save(); ap.renderPanel(); };
      return;
    }

    html += '<div class="ap-primary-actions"><button id="ap-scan">' + ap.escapeHtml(ap.t('action.scan')) + '</button><button id="ap-more" aria-expanded="' + (moreOpen ? 'true' : 'false') + '">' + ap.escapeHtml(ap.t('action.more')) + '</button></div>';
    html += '<div class="ap-actions ap-secondary"><button id="ap-loadnames">' + ap.escapeHtml(ap.t('action.loadNames')) + '</button><button id="ap-export">' + ap.escapeHtml(ap.t('action.exportShare')) + '</button><button id="ap-sort-location" title="' + ap.escapeHtml(ap.t('action.sortLocationTitle')) + '">' + ap.escapeHtml(ap.t('action.sortLocation')) + '</button><button id="ap-clear">' + ap.escapeHtml(ap.t('action.clearData')) + '</button></div>';
    html += '<div class="ap-settings ap-secondary"><label>' + ap.escapeHtml(ap.t('settings.tolerance')) + ' <input id="ap-tolerance" type="number" min="1" max="100" value="' + ap.escapeHtml(ap.state.tolerance) + '"> m' + (Number(ap.state.tolerance) === ap.DEFAULT_TOLERANCE_M ? ' · ' + ap.escapeHtml(ap.t('settings.standard')) : '') + '</label><label>' + ap.escapeHtml(ap.t('language.label')) + ' <select id="ap-language">' + ap.languageOptionsHtml() + '</select></label></div>';
    if (readiness) {
      html += '<details class="ap-readiness ap-readiness-' + ap.escapeHtml(readiness.key) + '"' + (readinessOpen ? ' open' : '') + '><summary><b>' + ap.escapeHtml(ap.t('readiness.title')) + '</b> ' + ap.escapeHtml(readiness.label);
      if (readiness.summary.length) html += ' · ' + ap.escapeHtml(readiness.summary.join(' · '));
      html += '</summary><div class="ap-readiness-detail"><div>';
      html += ap.escapeHtml(ap.tp('readiness.unconfirmed', readiness.unconfirmedLinks));
      if (readiness.missingKeyPortals) html += ' · ' + ap.escapeHtml(ap.tp('readiness.keyPortal', readiness.missingKeyPortals));
      html += ' · ' + ap.escapeHtml(ap.tp('readiness.loadedLink', readiness.loadedExistingLinks));
      if (readiness.unresolvedExistingLinks) html += ' · ' + ap.escapeHtml(ap.t('readiness.unusableLoaded', { count: readiness.unresolvedExistingLinks }));
      html += '</div></div></details>';
    }
    if (nextPortal) {
      html += '<div id="ap-next-target" class="ap-next-target">' + ap.routeTargetHtml(nextPortal, nextLocation, routeEstimate) + '</div>';
    } else if (stats.length) {
      html += '<div id="ap-next-target" class="ap-next-target ap-next-complete">' + ap.escapeHtml(ap.t('route.complete')) + '</div>';
    }
    html += '<div class="ap-filters" aria-label="' + ap.escapeHtml(ap.t('filter.aria')) + '">';
    [
      ['all', ap.t('filter.all'), filterCounts.all],
      ['open', ap.t('filter.open'), filterCounts.open],
      ['blocked', ap.t('filter.blocked'), filterCounts.blocked],
      ['keys', ap.t('filter.keysMissing'), filterCounts.keys],
      ['done', ap.t('filter.done'), filterCounts.done]
    ].forEach(function (item) {
      html += '<button class="ap-filter' + ((ap.state.listFilter || 'all') === item[0] ? ' ap-filter-active' : '') + '" data-filter="' + item[0] + '">' + item[1] + ' <span>' + item[2] + '</span></button>';
    });
    html += '</div>';
    html += '<div id="ap-message" class="ap-message ap-secondary">';
    if (last) {
      var scanLinks = Number(last.plannedLinks) || 0;
      var scanPortals = Number(last.resolvedPortals) || 0;
      var scanOpenEndpoints = Number(last.unresolvedEndpoints) || 0;
      html += 'Scan: ' + ap.escapeHtml(ap.tp('scan.summaryLink', scanLinks)) + ' · ' + ap.escapeHtml(ap.tp('scan.summaryPortal', scanPortals));
      if (scanOpenEndpoints) html += ' · ' + ap.escapeHtml(ap.tp('scan.summaryEndpoint', scanOpenEndpoints));
      if (last.unresolvedSample && last.unresolvedSample.length) {
        html += '<div class="ap-unresolved"><b>' + ap.escapeHtml(ap.t('diagnostics.openEndpoints')) + '</b>';
        html += '<div class="ap-hint">' + ap.escapeHtml(ap.t('diagnostics.help')) + '</div>';
        last.unresolvedSample.forEach(function (u) {
          html += '<div class="ap-unresolved-item">' + ap.escapeHtml(ap.t('diagnostics.segment', { segment: u.segment, end: u.end })) + ' ' + ap.escapeHtml(Number(u.lat).toFixed(6)) + ',' + ap.escapeHtml(Number(u.lng).toFixed(6));
          if (u.nearestTitle) html += ' · ' + ap.escapeHtml(ap.t('diagnostics.nearestPortal', { title: ap.displayPortalTitle(u.nearestTitle), distance: u.nearestDistance }));
          else html += ' · ' + ap.escapeHtml(ap.t('diagnostics.noPortal'));
          if (u.layerDebug) {
            html += '<div>' + ap.escapeHtml(ap.t('diagnostics.drawObject')) + ' ' + ap.escapeHtml(u.layerDebug.type || '-') +
              (u.layerDebug.title ? ' · ' + ap.escapeHtml(ap.t('diagnostics.title')) + ' ' + ap.escapeHtml(u.layerDebug.title) : '') +
              (u.layerDebug.optionKeys && u.layerDebug.optionKeys.length ? ' · optionKeys: ' + ap.escapeHtml(u.layerDebug.optionKeys.join(', ')) : '') + '</div>';
          }
          if (u.drawPointCandidates && u.drawPointCandidates.length) {
            html += '<div>' + ap.escapeHtml(ap.t('diagnostics.drawPoints'));
            u.drawPointCandidates.forEach(function (d) {
              html += '<br>• ' + ap.escapeHtml(ap.displayPortalTitle(d.title)) + ' · ' + ap.escapeHtml(d.type) + ' · ' + ap.escapeHtml(d.distance) + ' m' +
                (d.optionKeys && d.optionKeys.length ? ' · keys: ' + ap.escapeHtml(d.optionKeys.slice(0, 8).join(', ')) : '');
            });
            html += '</div>';
          }
          if (u.candidates && u.candidates.length) {
            html += '<div>' + ap.escapeHtml(ap.t('diagnostics.iitcPortals'));
            u.candidates.slice(0, 5).forEach(function (c) {
              html += '<br>• ' + ap.escapeHtml(ap.displayPortalTitle(c.title)) + ' (' + ap.escapeHtml(c.distance) + ' m)' + (c.source ? ' · ' + ap.escapeHtml(c.source) : '');
            });
            html += '</div>';
          }
          html += '</div>';
        });
        html += '</div>';
      }
    } else html += ap.escapeHtml(ap.t('panel.initialHelp'));
    html += '</div>';

    if (blockerWorklist.length || blockedLinks.length) {
      var selectedBlockerPortals = blockerWorklist.filter(function (candidate) { return candidate.selected; }).length;
      html += '<details class="ap-blocker-section"' + (blockerSectionOpen ? ' open' : '') + '><summary>' + ap.escapeHtml(ap.t('blocker.title')) + ' (' + ap.escapeHtml(ap.tp('blocker.blockLink', blockingLinkCount)) + (blockerWorklist.length ? ' · ' + ap.escapeHtml(ap.tp('blocker.endPortal', blockerWorklist.length)) : '') + (selectedBlockerPortals ? ' · ' + ap.escapeHtml(ap.t('blocker.selected', { count: selectedBlockerPortals })) : '') + ')</summary>';
      if (blockerWorklist.length) {
        blockerWorklist.forEach(function (candidate) {
          var blockerNav = ap.navigationLinks(candidate);
          var blockerDistance = ap.formatDistance(candidate.distance);
          html += '<div class="ap-blocker-work-row" data-guid="' + ap.escapeHtml(candidate.guid) + '" data-lat="' + ap.escapeHtml(candidate.lat) + '" data-lng="' + ap.escapeHtml(candidate.lng) + '">';
          html += '<div class="ap-blocker-work-main">';
          if (candidate.isOpenPlanPortal) html += '<span class="ap-blocker-work-plan">✓</span> <b>' + ap.escapeHtml(candidate.title) + '</b>';
          else html += '<label class="ap-blocker-work-select"><input type="checkbox" class="ap-blocker-route-check" data-guid="' + ap.escapeHtml(candidate.guid) + '"' + (candidate.selected ? ' checked' : '') + '> <b>' + ap.escapeHtml(candidate.title) + '</b></label>';
          html += '</div>';
          html += '<div class="ap-blocker-work-meta">' + ap.escapeHtml(ap.tp('blocker.endpointOf', candidate.blockerCount)) + (candidate.isOpenPlanPortal ? ' · ' + ap.escapeHtml(ap.t('blocker.openPlanPortal')) : (candidate.isPlanPortal ? ' · ' + ap.escapeHtml(ap.t('blocker.donePlanPortal')) : '')) + '<span class="ap-blocker-work-distance">' + (blockerDistance ? ' · ' + ap.escapeHtml(blockerDistance) + ' ' + ap.escapeHtml(ap.t('route.aerial')) : '') + '</span></div>';
          html += '<a class="ap-blocker-work-nav" target="_blank" rel="noopener" href="' + ap.escapeHtml(blockerNav.waze) + '">Waze</a></div>';
        });
      }
      html += '<div class="ap-blocker-hint">' + ap.escapeHtml(ap.t('blocker.mapLegend')) + '</div>';
      html += '</details>';
    }

    html += '<div class="ap-list">';
    visibleStats.forEach(function (stat) {
      var local = ap.ensureAnchorState(stat.guid);
      var status = ap.getStatus(stat.guid, stat);
      var nav = ap.navigationLinks(stat);
      html += '<details class="ap-row ap-planportal" data-guid="' + ap.escapeHtml(stat.guid) + '"' + (expandedPortals[stat.guid] ? ' open' : '') + '>';
      html += '<summary class="ap-row-title"><span class="ap-route-number">' + ap.escapeHtml((local.routeOrder == null ? 0 : local.routeOrder) + 1) + '.</span> <span class="ap-status ' + status.cls + '">' + status.symbol + '</span> <b>' + ap.escapeHtml(ap.displayPortalTitle(stat.title)) + '</b><span class="ap-row-keys">' + ap.escapeHtml(ap.t('row.keys', { owned: local.ownedKeys || 0, required: stat.requiredKeys })) + '</span></summary>';
      if (stat.address) html += '<div class="ap-address">' + ap.escapeHtml(stat.address) + '</div>';
      html += '<div class="ap-meta">' + (stat.source ? ap.escapeHtml(stat.source) + ' · ' : '') + ap.escapeHtml(ap.t('row.links', { count: stat.linkCount })) + ' · ' + ap.escapeHtml(ap.t('row.existing', { count: stat.existingLinks || 0 })) + ' · ' + ap.escapeHtml(ap.t('row.open', { count: stat.openLinks || stat.requiredKeys || 0 })) + ' · ' + ap.escapeHtml(ap.t('row.blocked', { count: stat.blockedLinks || 0 })) + ' · ' + ap.escapeHtml(ap.t('row.keysNeeded')) + ' <input class="ap-owned" type="number" min="0" value="' + ap.escapeHtml(local.ownedKeys || 0) + '"> / ' + ap.escapeHtml(stat.requiredKeys) + ' · ' + ap.escapeHtml(status.label) + '</div>';
      html += '<div class="ap-controls"><button class="ap-move-up" title="' + ap.escapeHtml(ap.t('row.moveUp')) + '">↑</button><button class="ap-move-down" title="' + ap.escapeHtml(ap.t('row.moveDown')) + '">↓</button> <label><input class="ap-done-check" type="checkbox" ' + (local.done ? 'checked' : '') + '> ' + ap.escapeHtml(ap.t('row.done')) + '</label> <button class="ap-share">' + ap.escapeHtml(ap.t('row.actions')) + '</button></div>';
      html += '<input class="ap-note" type="hidden" value="' + ap.escapeHtml(local.note || '') + '">';
      html += '</details>';
    });
    html += '</div>';
    if (!visibleStats.length && stats.length) html += '<div class="ap-list-empty">' + ap.escapeHtml(ap.t('row.emptyFilter')) + '</div>';

    panel.innerHTML = html;
    panel.classList.toggle('ap-show-more', moreOpen);

    document.getElementById('ap-collapse').onclick = function () { ap.state.panelCollapsed = true; ap.save(); ap.renderPanel(); };
    document.getElementById('ap-scan').onclick = ap.scan;
    document.getElementById('ap-more').onclick = function () {
      var show = !panel.classList.contains('ap-show-more');
      panel.classList.toggle('ap-show-more', show);
      this.setAttribute('aria-expanded', show ? 'true' : 'false');
    };
    document.getElementById('ap-loadnames').onclick = ap.refreshMissingNames;
    document.getElementById('ap-export').onclick = ap.showExport;
    document.getElementById('ap-sort-location').onclick = ap.sortRouteFromUserLocation;
    document.getElementById('ap-clear').onclick = ap.clearData;
    document.getElementById('ap-tolerance').onchange = function () { ap.state.tolerance = parseInt(this.value, 10) || ap.DEFAULT_TOLERANCE_M; ap.save(); };
    document.getElementById('ap-language').onchange = function () {
      ap.state.language = this.value === 'auto' ? 'auto' : (ap.findAvailableLanguage(this.value) || 'auto');
      ap.runtime.nextTargetKey = null;
      ap.save();
      ap.renderOverlays();
      ap.renderPanel();
    };
    Array.prototype.forEach.call(panel.querySelectorAll('.ap-filter'), function (button) {
      button.onclick = function () {
        ap.state.listFilter = this.getAttribute('data-filter') || 'all';
        ap.save();
        ap.renderPanel();
      };
    });
    Array.prototype.forEach.call(panel.querySelectorAll('.ap-blocker-route-check'), function (checkbox) {
      checkbox.onchange = function () {
        var guid = this.getAttribute('data-guid');
        ap.state.blockerRoutePortals = ap.state.blockerRoutePortals || {};
        if (this.checked) ap.state.blockerRoutePortals[guid] = true;
        else delete ap.state.blockerRoutePortals[guid];
        ap.save();
        ap.renderOverlays();
        ap.renderPanel();
      };
    });
    Array.prototype.forEach.call(panel.querySelectorAll('.ap-row'), function (row) {
      var guid = row.getAttribute('data-guid');
      var local = ap.ensureAnchorState(guid);
      row.querySelector('.ap-owned').onchange = function () { local.ownedKeys = parseInt(this.value, 10) || 0; ap.save(); ap.renderOverlays(); ap.renderPanel(); };
      row.querySelector('.ap-done-check').onchange = function () {
        local.done = !!this.checked;
        if (!local.done && ap.state.blockerRoutePortals) delete ap.state.blockerRoutePortals[guid];
        ap.save();
        ap.renderOverlays();
        ap.renderPanel();
      };
      row.querySelector('.ap-note').onchange = function () { local.note = this.value; ap.save(); };
      row.querySelector('.ap-move-up').onclick = function () { ap.movePortal(guid, -1); };
      row.querySelector('.ap-move-down').onclick = function () { ap.movePortal(guid, 1); };
      row.querySelector('.ap-share').onclick = function () { ap.showPortalActions(guid); };
    });

    // v0.1.23: keine eigene Endpunkt-Zuordnung per UI; Draw-Tools-Rohdaten werden nur diagnostiziert.
  };

  ap.injectCss = function () {
    $('<style>').prop('type', 'text/css').html('\
#iitc-anchor-planner{position:absolute;right:10px;bottom:28px;z-index:3000;width:360px;max-height:70vh;overflow:auto;background:rgba(8,12,18,.94);color:#eee;border:1px solid #777;border-radius:6px;font:12px/1.35 Arial,sans-serif;box-shadow:0 2px 12px rgba(0,0,0,.6);-webkit-overflow-scrolling:touch}\
#iitc-anchor-planner .ap-head{display:flex;align-items:center;gap:6px;padding:6px 8px;background:#222;border-bottom:1px solid #555}#iitc-anchor-planner .ap-head b{flex:1;color:#fff}#iitc-anchor-planner .ap-head span{color:#aaa}\
#iitc-anchor-planner button{margin:2px;padding:3px 6px;background:#333;color:#eee;border:1px solid #777;border-radius:3px}#iitc-anchor-planner button:hover{background:#444}\
#iitc-anchor-planner input,#iitc-anchor-planner select{background:#111;color:#fff;border:1px solid #666;border-radius:2px}#iitc-anchor-planner .ap-settings{display:flex;flex-wrap:wrap;gap:4px 10px}#iitc-anchor-planner .ap-settings label{white-space:nowrap}#iitc-anchor-planner .ap-settings input,#iitc-anchor-planner .ap-owned{width:42px}\
#iitc-anchor-planner .ap-primary-actions{display:flex;gap:4px;padding:4px 8px;border-bottom:1px solid #333}#iitc-anchor-planner .ap-primary-actions button{flex:1;margin:0;padding:5px 7px}#iitc-anchor-planner .ap-secondary{display:none}#iitc-anchor-planner.ap-show-more .ap-secondary{display:block}#iitc-anchor-planner.ap-show-more .ap-actions,#iitc-anchor-planner.ap-show-more .ap-settings{display:flex;flex-wrap:wrap}\
#iitc-anchor-planner .ap-filters{display:flex;flex-wrap:wrap;gap:4px;padding:5px 8px;border-bottom:1px solid #333}#iitc-anchor-planner .ap-filter{margin:0;padding:4px 7px}#iitc-anchor-planner .ap-filter span{color:#aaa;font-size:10px}#iitc-anchor-planner .ap-filter-active{background:#666;color:#fff;border-color:#bbb}#iitc-anchor-planner .ap-filter-active span{color:#fff}.ap-list-empty{padding:7px 8px;color:#aaa;text-align:center}\
#iitc-anchor-planner .ap-readiness{padding:5px 8px;border-bottom:1px solid #333}#iitc-anchor-planner .ap-readiness summary{cursor:pointer;overflow-wrap:anywhere}#iitc-anchor-planner .ap-readiness-ready summary{color:#8ee68e}#iitc-anchor-planner .ap-readiness-check summary{color:#f5d76e}#iitc-anchor-planner .ap-readiness-blocked summary{color:#ff8b80}#iitc-anchor-planner .ap-readiness-detail{margin-top:5px;color:#ddd;font-size:11px;line-height:1.35}\
#iitc-anchor-planner .ap-actions,.ap-settings,.ap-message,.ap-mini{padding:5px 8px;border-bottom:1px solid #333}.ap-message{color:#ccc}.ap-unresolved-item{margin-top:4px;border-top:1px solid #554;padding-top:3px}.ap-mini{color:#ddd}.ap-unresolved{margin-top:4px;color:#f5d76e;font-size:11px;line-height:1.3}\
#iitc-anchor-planner .ap-blocker-section{padding:5px 8px;border-bottom:1px solid #443;color:#ddd}#iitc-anchor-planner .ap-blocker-section>summary{cursor:pointer;color:#f5d76e;font-weight:bold}#iitc-anchor-planner .ap-blocker-hint{margin-top:5px;color:#aaa;font-size:11px}\
#iitc-anchor-planner .ap-blocker-work-row{position:relative;margin-top:4px;padding:5px 50px 5px 0;border-top:1px solid #443;overflow-wrap:anywhere}#iitc-anchor-planner .ap-blocker-work-main{color:#fff}#iitc-anchor-planner .ap-blocker-work-main input{vertical-align:middle}#iitc-anchor-planner .ap-blocker-work-select{display:inline-block;cursor:pointer;padding:2px 0}#iitc-anchor-planner .ap-blocker-work-plan{color:#8ee68e;font-weight:bold}#iitc-anchor-planner .ap-blocker-work-meta{margin-top:2px;color:#ccc;font-size:11px}#iitc-anchor-planner .ap-blocker-work-distance{color:#9fd0ff}#iitc-anchor-planner .ap-blocker-work-nav{position:absolute;right:0;top:5px;padding:3px 6px;background:#333;color:#f0d16b;border:1px solid #777;border-radius:3px;text-decoration:none}\
#iitc-anchor-planner .ap-list{overflow:visible}\
#iitc-anchor-planner .ap-row{padding:5px 8px;border-bottom:1px solid #333;background:rgba(255,255,255,.02)}#iitc-anchor-planner .ap-row.ap-candidate{background:rgba(255,255,255,.055)}\
#iitc-anchor-planner .ap-row-title{display:flex;align-items:center;gap:3px;cursor:pointer;font-size:13px}.ap-row-title b{flex:1;min-width:0;overflow-wrap:anywhere}.ap-row-keys{flex:none;color:#9fd0ff;font-size:11px;white-space:nowrap}.ap-address{color:#bbb;margin:4px 0 2px}.ap-meta{margin:4px 0;color:#ddd}.ap-controls{margin:3px 0}.ap-controls a{color:#f0d16b;text-decoration:none;margin-right:5px}.ap-note{width:98%;box-sizing:border-box;margin-top:3px}\
.ap-blocked{color:#ff3b30}.ap-status{display:inline-block;min-width:18px;text-align:center;font-weight:bold}.ap-badge-icon{background:transparent!important;border:none!important}.ap-svg-badge-icon{display:block!important;visibility:visible!important;opacity:1!important;background:transparent!important;border:0!important}.ap-badge{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:15px;border:2px solid #eee;background:rgba(0,0,0,.75);box-shadow:0 0 4px #000;color:#fff}\
.ap-missing{color:#ff9f43}.ap-partial{color:#f5d76e}.ap-ready{color:#ff6ad5}.ap-existing{color:#bdbdbd}.ap-done{color:#eee}.ap-badge.ap-missing{border-color:#ff9f43}.ap-badge.ap-partial{border-color:#f5d76e}.ap-badge.ap-ready{border-color:#ff6ad5}.ap-badge.ap-existing{border-color:#bdbdbd}.ap-badge.ap-done{border-color:#eee}.ap-next-target{display:flex;align-items:center;gap:8px;padding:6px 8px;border-bottom:1px solid #444;background:#1c2530;color:#fff}.ap-next-target span{flex:1}.ap-next-target .ap-next-distance,.ap-next-target .ap-route-remaining{color:#9fd0ff}.ap-next-target .ap-route-remaining{font-size:11px}.ap-next-target a{padding:4px 7px;background:#333;color:#f0d16b;border:1px solid #777;border-radius:3px;text-decoration:none}.ap-next-complete{color:#ddd}.ap-route-number{display:inline-block;min-width:22px;color:#aaa}.ap-map-badge-next{box-shadow:0 0 0 3px #fff,0 0 0 6px rgba(0,0,0,.95),0 0 12px rgba(255,255,255,.9)!important}.ap-move-up,.ap-move-down{min-width:28px}\
.ap-action-label{margin-top:10px;font-weight:bold;color:#ddd}.ap-share-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px}.ap-share-grid-single{grid-template-columns:1fr}.ap-share-grid a,.ap-share-grid button{display:block;padding:6px;background:#222;color:#f0d16b;border:1px solid #666;border-radius:4px;text-align:center;text-decoration:none}.ap-share-grid .ap-share-main{color:#fff;font-weight:bold;border-color:#aaa}\
.ap-export-tabs{display:flex;gap:6px;margin-bottom:8px}.ap-export-tab{padding:6px 10px!important}.ap-export-tab-active{background:#555!important;color:#fff!important}.ap-export-text,.ap-export-json{width:100%;height:320px;box-sizing:border-box;font-family:monospace;font-size:12px;background:#111;color:#eee;border:1px solid #666}.ap-export-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.ap-export-actions button{padding:6px 10px;background:#222;color:#f0d16b;border:1px solid #666;border-radius:4px}\
.ap-map-html-overlay{position:absolute!important;left:0!important;top:0!important;right:0!important;bottom:0!important;z-index:2500!important;pointer-events:none!important;overflow:visible!important}.ap-map-badge{position:absolute!important;transform:translate(-50%,-50%)!important;min-width:24px!important;height:24px!important;padding:0 3px!important;border-radius:13px!important;border:3px solid #ff9f43!important;background:rgba(0,0,0,.88)!important;color:#fff!important;font:bold 10px/24px Arial,sans-serif!important;text-align:center!important;white-space:nowrap!important;box-sizing:border-box!important;text-shadow:0 1px 2px #000!important;z-index:2501!important}.ap-map-badge-done{font-size:9px!important}.ap-map-badge-ready{font-size:14px!important}.ap-map-badge-partial{font-size:13px!important}\
@media(max-width:600px){#iitc-anchor-planner{right:5px;left:5px;bottom:76px;width:auto;max-height:calc(100vh - 170px);font-size:12px}}\
').appendTo('head');
  };

  ap.scheduleMapDataPanelRefresh = function (delay) {
    if (ap.runtime.mapDataPanelRefreshTimer) clearTimeout(ap.runtime.mapDataPanelRefreshTimer);
    ap.runtime.mapDataPanelRefreshTimer = setTimeout(function () {
      ap.runtime.mapDataPanelRefreshTimer = null;
      if (ap.runtime.enabled && ap.runtime.panel && (ap.runtime.links || []).length) ap.renderPanel();
    }, delay == null ? 150 : delay);
  };

  ap.setupLayer = function () {
    if (window.map && typeof window.map.createPane === 'function' && typeof window.map.getPane === 'function') {
      try {
        var pane = window.map.getPane(ap.PANE_NAME) || window.map.createPane(ap.PANE_NAME);
        if (pane && pane.style) {
          pane.style.zIndex = '550';
          pane.style.pointerEvents = 'none';
        }
      } catch (e) {}
    }
    ap.runtime.layerGroup = new L.LayerGroup();
    if (typeof window.addLayerGroup === 'function') window.addLayerGroup('Anchor Planner', ap.runtime.layerGroup, true);
    if (window.map && typeof window.map.hasLayer === 'function' && !window.map.hasLayer(ap.runtime.layerGroup)) {
      try { ap.runtime.layerGroup.addTo(window.map); } catch (e) {}
    } else if (window.map && typeof window.map.hasLayer !== 'function') {
      try { ap.runtime.layerGroup.addTo(window.map); } catch (e) {}
    }

    if (window.map && typeof window.map.on === 'function') {
      window.map.on('overlayadd', function (e) {
        if (e && e.layer === ap.runtime.layerGroup) {
          ap.runtime.enabled = true;
          ap.renderPanel();
          ap.renderOverlays();
        }
      });
      window.map.on('overlayremove', function (e) {
        if (e && e.layer === ap.runtime.layerGroup) {
          ap.runtime.enabled = false;
          if (ap.runtime.layerGroup) ap.runtime.layerGroup.clearLayers();
          ap.clearHtmlOverlay();
          ap.runtime.overlayCount = 0;
          ap.renderPanel();
        }
      });
      window.map.on('zoomend moveend resize', function () {
        if (!ap.runtime.enabled) return;
        ap.renderOverlays();
        // Fallback for IITC variants that do not expose mapDataRefreshEnd reliably.
        ap.scheduleMapDataPanelRefresh(1200);
      });
    }
    if (typeof window.addHook === 'function') {
      try { window.addHook('mapDataRefreshEnd', function () { ap.scheduleMapDataPanelRefresh(100); }); } catch (e) {}
    }
  };

  ap.setupPanel = function () {
    ap.runtime.panel = $('<div id="iitc-anchor-planner"></div>').appendTo('body')[0];
    ap.renderPanel();
  };

  var setup = function () {
    ap.load();
    ap.injectCss();
    ap.setupLayer();
    ap.setupPanel();
    setTimeout(ap.setupUserLocationIntegration, 0);
    console.log('[Anchor Planner] loaded v' + ap.VERSION);
  };

  setup.info = plugin_info;

  if (!window.bootPlugins) window.bootPlugins = [];
  window.bootPlugins.push(setup);
  if (window.iitcLoaded && typeof setup === 'function') setup();
}

var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
  info.script = {
    version: GM_info.script.version,
    name: GM_info.script.name,
    description: GM_info.script.description
  };
}
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement).appendChild(script);
