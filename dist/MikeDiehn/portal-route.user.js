// ==UserScript==
// @author          MikeDiehn
// @id              portal-route@MikeDiehn
// @name            Portal Route
// @category        Navigate
// @version         1.6.0
// @namespace       https://github.com/mdiehn/iitc-plugin-portal-route
// @updateURL       https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/MikeDiehn/portal-route.meta.js
// @downloadURL     https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/MikeDiehn/portal-route.user.js
// @description     Route planning through selected portals with segment drive times, stop-time accounting, and map export.
// @homepageURL     https://github.com/mdiehn/iitc-plugin-portal-route
// @issueTracker    https://github.com/mdiehn/iitc-plugin-portal-route/issues
// @include         https://intel.ingress.com/*
// @include         http://intel.ingress.com/*
// @match           https://intel.ingress.com/*
// @match           http://intel.ingress.com/*
// @grant           none
// ==/UserScript==


function wrapper(plugin_info) {
  if (typeof window.plugin !== 'function') window.plugin = function() {};
  window.plugin.portalRoute = window.plugin.portalRoute || {};

  var pr = window.plugin.portalRoute;

  pr.CSS = `
.portal-route-mini-control {
  margin-top: 10px;
}

.portal-route-mini-control a {
  text-align: center;
  font-size: 12px;
  font-weight: bold;
}

.portal-route-dialog-content {
  width: 100%;
  max-width: 100%;
  overflow-x: visible;
  font-size: 11px;
  line-height: 1.25;
}

.portal-route-dialog-content button,
.portal-route-dialog-content input {
  font-size: 11px;
}

.portal-route-mini-control .portal-route-mini-remove {
  color: #c00000;
}

.portal-route-mini-control .portal-route-mini-active {
  text-decoration: underline;
}

.portal-route-mini-control .portal-route-mini-add-active {
  border-color: rgba(128, 216, 255, 0.95) !important;
  background: rgba(128, 216, 255, 0.22) !important;
  box-shadow: inset 0 0 0 1px rgba(128, 216, 255, 0.35), 0 0 8px rgba(128, 216, 255, 0.35) !important;
}

.leaflet-container.portal-route-add-point-mode,
.leaflet-container.portal-route-add-point-mode *,
.leaflet-container.portal-route-home-pick-mode,
.leaflet-container.portal-route-home-pick-mode * {
  cursor: crosshair !important;
}

.portal-route-dialog-content * {
  box-sizing: border-box;
}

.portal-route-body p {
  margin: 0 0 6px;
}

.portal-route-summary {
  margin-top: 4px;
}

.portal-route-list-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 8px 0 6px;
}

.portal-route-setting {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0;
}

.portal-route-setting input {
  width: 4.5em;
}

.portal-route-setting select {
  max-width: 100%;
}

.portal-route-default-stop-setting {
  flex: 1 1 auto;
}

.portal-route-travel-controls {
  flex-wrap: nowrap;
  align-items: center;
  gap: 6px;
}

.portal-route-travel-controls .portal-route-setting {
  flex: 0 1 auto;
  white-space: nowrap;
}

.portal-route-travel-controls .portal-route-setting input {
  width: 3.4em;
}

.portal-route-travel-controls .portal-route-setting select {
  width: 5.8em;
}

.portal-route-home-coordinate-setting input {
  width: 9em;
}


.portal-route-line-style-options {
  align-items: center;
}

.portal-route-line-style-options .portal-route-setting {
  flex: 0 1 auto;
  white-space: nowrap;
}

.portal-route-line-style-options select {
  width: 6.4em;
}


.portal-route-long-setting-row {
  align-items: stretch;
}

.portal-route-long-setting {
  display: flex;
  flex: 1 1 100%;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
}

.portal-route-long-setting input {
  width: 100%;
  min-width: 18em;
}

.portal-route-clear-list-button {
  flex: 0 0 auto;
}

.portal-route-settings-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 12px;
  margin-top: 8px;
  padding-bottom: 10px;
}

.portal-route-checkbox-setting {
  align-items: center;
}

.portal-route-checkbox-setting input {
  width: auto;
}

.portal-route-empty {
  margin: 8px 0 10px;
}

.portal-route-waypoints-list {
  display: block;
  width: 100%;
  max-width: 100%;
  margin: 6px 0 8px;
  overflow: visible;
}

.portal-route-waypoint-row {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr) max-content 42px max-content;
  gap: 2px;
  align-items: center;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: visible;
}

.portal-route-waypoint-row + .portal-route-waypoint-row {
  margin-top: 2px;
}

.portal-route-selected-stop {
  background: rgba(255, 216, 0, 0.10);
  border-radius: 4px;
}

.portal-route-waypoint-row-draggable {
  cursor: grab;
}

.portal-route-waypoint-row-draggable .portal-route-wait-cell,
.portal-route-waypoint-row-draggable .portal-route-wait-cell * {
  cursor: auto;
}

.portal-route-waypoint-row-draggable.portal-route-dragging {
  opacity: 0.55;
}

.portal-route-stop.portal-route-drop-target {
  background: rgba(255, 216, 0, 0.16);
  border-radius: 4px;
}

.portal-route-stop.portal-route-drop-target .portal-route-waypoint-name-cell {
  box-shadow: inset 0 1px 0 rgba(255, 216, 0, 0.75);
}

.portal-route-stop.portal-route-drop-target.portal-route-drop-after .portal-route-waypoint-name-cell {
  box-shadow: inset 0 -1px 0 rgba(255, 216, 0, 0.75);
}

.portal-route-waypoint-num,
.portal-route-waypoint-name-cell,
.portal-route-leg-cell,
.portal-route-wait-cell,
.portal-route-row-actions {
  min-width: 0;
  border: 0 !important;
  outline: 0 !important;
  background: transparent !important;
}

.portal-route-waypoint-num {
  min-width: 20px;
  text-align: center;
}

.portal-route-waypoint-name-cell {
  overflow: hidden;
}

.portal-route-leg-cell {
  min-width: max-content;
  padding-right: 14px;
  text-align: right;
  white-space: nowrap;
  overflow: visible;
}

.portal-route-wait-cell {
  width: 42px;
  text-align: center;
}

.portal-route-waypoint-name {
  display: block;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
  outline: 0 !important;
  box-shadow: none !important;
  background: transparent !important;
  color: inherit !important;
  text-align: left;
  font-weight: bold;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
}


.portal-route-waypoint-name:hover,
.portal-route-waypoint-name:focus,
.portal-route-waypoint-name:active {
  border: 0 !important;
  outline: 0 !important;
  box-shadow: none !important;
  background: transparent !important;
  color: inherit !important;
}

.portal-route-wait-input {
  width: 42px;
  padding: 1px 2px;
}

.portal-route-row-actions {
  display: flex;
  flex-wrap: nowrap;
  gap: 2px;
  justify-content: flex-end;
  white-space: nowrap;
}

.portal-route-row-actions button {
  padding: 1px 3px !important;
  border: 1px solid rgba(255, 216, 0, 0.35) !important;
  border-radius: 3px !important;
  background: rgba(255, 255, 255, 0.12) !important;
  color: inherit !important;
  font: inherit;
  font-size: 10px;
  line-height: 1.15;
  cursor: pointer;
}

.portal-route-row-actions button:disabled {
  border-color: rgba(255, 255, 255, 0.14) !important;
  color: rgba(255, 255, 255, 0.35) !important;
  cursor: default;
}

.portal-route-row-action-short {
  display: none;
}

.portal-route-add-point-hint,
.portal-route-stale-hint {
  margin: 4px 0 0;
  padding: 3px 6px;
  border-radius: 5px;
  font-size: 11px;
  line-height: 1.25;
  text-align: center;
}

.portal-route-add-point-hint {
  border: 1px solid rgba(255, 216, 0, 0.38);
  background: rgba(255, 216, 0, 0.12);
  color: #ffd800;
}

.portal-route-stale-hint {
  border: 1px solid rgba(128, 216, 255, 0.34);
  background: rgba(128, 216, 255, 0.12);
  color: #80d8ff;
}

.portal-route-replot-needed,
.portal-route-context-stale {
  border-color: rgba(255, 216, 0, 0.72) !important;
  box-shadow: 0 0 7px rgba(255, 216, 0, 0.28) !important;
}

.portal-route-compact-stats-flag {
  color: #80d8ff;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.portal-route-stop-num,
.portal-route-stop-label span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  min-width: 16px;
  height: 16px;
  min-height: 16px;
  padding: 0;
  border-radius: 50%;
  background: #ffd800;
  color: #111;
  font-weight: bold;
  font-size: 10px;
  line-height: 16px;
}

button.portal-route-stop-num,
button.portal-route-waypoint-badge {
  width: 16px !important;
  min-width: 16px !important;
  height: 16px !important;
  min-height: 16px !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 50% !important;
  background: #ffd800 !important;
  color: #111 !important;
  cursor: pointer;
  line-height: 16px !important;
}

.portal-route-stop-label-wide span,
button.portal-route-waypoint-badge-wide {
  width: auto !important;
  min-width: 23px !important;
  padding: 0 3px !important;
  border-radius: 8px !important;
}

.portal-route-loop-row {
  opacity: 0.85;
}

.portal-route-loop-badge,
.portal-route-loop-label span {
  background: #80d8ff !important;
  color: #111 !important;
}

.portal-route-leg {
  display: block;
  width: max-content;
  overflow: visible;
  text-overflow: clip;
  color: inherit;
  opacity: 1;
  font: inherit;
  font-weight: bold;
}

.portal-route-leg-stale,
.portal-route-leg-empty {
  opacity: 0.45;
}

.portal-route-stale {
  margin-top: 4px;
  opacity: 0.85;
  font-size: 10px;
  font-style: italic;
}


.portal-route-active-action {
  font-weight: bold;
  outline: none !important;
}

.portal-route-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 8px;
}

.portal-route-control-groups {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
  margin-top: 7px;
}

.portal-route-control-group {
  min-width: 0;
  padding: 5px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(0, 0, 0, 0.12);
}

.portal-route-control-group-wide {
  grid-column: 1 / -1;
}

.portal-route-control-group-title {
  margin-bottom: 4px;
  font-weight: bold;
  opacity: 0.9;
}

.portal-route-control-group-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.portal-route-clear-list-button,
.portal-route-library-actions button,
.portal-route-control-group-buttons button {
  display: inline-block;
  padding: 3px 7px !important;
  border: 1px solid rgba(255, 216, 0, 0.45) !important;
  border-radius: 3px !important;
  background: rgba(255, 255, 255, 0.18) !important;
  color: inherit !important;
  font: inherit;
  line-height: 1.25;
  text-align: center;
  text-decoration: none;
  outline: none !important;
  box-shadow: none !important;
  cursor: pointer;
}

.portal-route-clear-list-button:hover,
.portal-route-clear-list-button:focus,
.portal-route-clear-list-button:active,
.portal-route-control-group-buttons button:hover,
.portal-route-control-group-buttons button:focus,
.portal-route-control-group-buttons button:active,
.portal-route-library-actions button:hover,
.portal-route-library-actions button:focus,
.portal-route-library-actions button:active {
  border-color: rgba(255, 216, 0, 0.75) !important;
  background: rgba(255, 255, 255, 0.24) !important;
  color: inherit !important;
  text-decoration: none;
  outline: none !important;
  box-shadow: none !important;
}

.portal-route-library-actions button:disabled,
.portal-route-control-group-buttons button:disabled {
  border-color: rgba(255, 255, 255, 0.18) !important;
  background: rgba(255, 255, 255, 0.08) !important;
  color: rgba(255, 255, 255, 0.45) !important;
  cursor: default;
}

.portal-route-control-group-buttons button.portal-route-active-action {
  border-color: rgba(255, 216, 0, 0.85) !important;
  background: rgba(255, 216, 0, 0.22) !important;
}

.portal-route-control-group-buttons button.portal-route-smart-button,
.portal-route-smart-button {
  border-color: rgba(128, 216, 255, 0.75) !important;
  color: #ffd800 !important;
  box-shadow: inset 0 0 0 1px rgba(128, 216, 255, 0.25) !important;
}

.portal-route-control-group-buttons button.portal-route-smart-button:hover,
.portal-route-control-group-buttons button.portal-route-smart-button:focus,
.portal-route-control-group-buttons button.portal-route-smart-button:active,
.portal-route-smart-button:hover,
.portal-route-smart-button:focus,
.portal-route-smart-button:active {
  border-color: rgba(128, 216, 255, 0.95) !important;
  color: #ffd800 !important;
}

.portal-route-control-group-buttons button.portal-route-add-point-active,
.portal-route-portal-action-links button.portal-route-add-point-active {
  border-color: rgba(128, 216, 255, 0.95) !important;
  background: rgba(128, 216, 255, 0.22) !important;
  box-shadow: inset 0 0 0 1px rgba(128, 216, 255, 0.35), 0 0 8px rgba(128, 216, 255, 0.35) !important;
}

.portal-route-mini-control a.portal-route-smart-button {
  outline: 1px solid rgba(128, 216, 255, 0.75);
  outline-offset: -2px;
}

.portal-route-maps-stages .portal-route-control-group-buttons {
  display: block;
}

.portal-route-stage-item + .portal-route-stage-item {
  margin-top: 6px;
}

.portal-route-stage-item {
  display: flex;
  align-items: center;
  gap: 7px;
}

.portal-route-stage-link,
.portal-route-stage-link:link,
.portal-route-stage-link:visited,
.portal-route-stage-link:focus {
  flex: 0 0 auto;
  display: inline-block;
  padding: 3px 7px;
  border: 1px solid rgba(255, 216, 0, 0.45);
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.18);
  color: inherit;
  font: inherit;
  text-decoration: none;
  outline: none;
}

.portal-route-stage-summary {
  min-width: 0;
  opacity: 0.78;
  font-size: 10px;
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.portal-route-stage-link:hover,
.portal-route-stage-link:active {
  border-color: rgba(255, 216, 0, 0.75);
  background: rgba(255, 255, 255, 0.24);
  color: inherit;
  text-decoration: none;
  outline: none;
}

.portal-route-footer-actions {
  justify-content: flex-end;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  margin-top: 10px;
  padding-top: 7px;
}

.portal-route-points-actions {
  justify-content: space-between;
}


.portal-route-settings-dialog-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: calc(100vh - 120px);
  min-height: 0;
  overflow: hidden !important;
}

.portal-route-settings-body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
}

.portal-route-settings-scroll-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: visible;
  padding-right: 3px;
}

.portal-route-settings-footer {
  flex: 0 0 auto;
}

.portal-route-points-dialog-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: calc(100vh - 120px);
  min-height: 0;
  overflow: hidden !important;
}

.portal-route-points-list-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: visible;
  padding-right: 3px;
}

.portal-route-points-panel-actions {
  flex: 0 0 auto;
  gap: 4px;
  justify-content: space-between;
  margin-top: 7px;
}

.portal-route-button-divider {
  align-self: stretch;
  width: 1px;
  min-height: 20px;
  margin: 0 2px;
  background: rgba(255, 255, 255, 0.28);
}

.portal-route-library-source {
  margin-bottom: 6px;
  color: #ffce00;
  font-size: 11px;
  text-align: center;
}

.portal-route-library-storage {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 6px;
  color: #ccc;
  font-size: 11px;
}

.portal-route-library-storage label {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
}

.portal-route-library-storage select {
  max-width: 130px;
  font-size: 11px;
}

.portal-route-library-toolbar {
  justify-content: center;
  margin-bottom: 7px;
}

.portal-route-library-dialog-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: calc(100vh - 120px);
  min-height: 0;
  overflow: hidden !important;
}

.portal-route-library-scroll-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: visible;
  padding-right: 3px;
}

.portal-route-library-footer {
  flex: 0 0 auto;
}

.portal-route-library-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.portal-route-library-row {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: 6px;
  align-items: center;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 4px;
}

.portal-route-library-row-selected {
  background: rgba(255, 216, 0, 0.10);
}

.portal-route-library-select {
  display: flex;
  align-items: center;
  margin: 0;
}

.portal-route-library-select input {
  margin: 0;
}

.portal-route-library-info {
  min-width: 0;
}

.portal-route-library-info span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.portal-route-library-name-input {
  display: block;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 1px 3px !important;
  border: 1px solid transparent !important;
  border-radius: 3px;
  background: transparent !important;
  color: inherit !important;
  font: inherit;
  font-weight: bold;
}

.portal-route-library-name-input:hover,
.portal-route-library-name-input:focus {
  border-color: rgba(255, 216, 0, 0.45) !important;
  background: rgba(255, 255, 255, 0.08) !important;
  outline: none !important;
}

.portal-route-library-info span {
  color: #ccc;
  font-size: 11px;
}

.portal-route-library-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}

.portal-route-library-menu-button {
  margin-left: auto !important;
}

.portal-route-library-tip {
  margin-top: 6px;
  font-size: 11px;
  color: #ccc;
  text-align: center;
}

.portal-route-library-tip-active {
  color: #ffd800;
}

.portal-route-bottom-summary {
  margin-top: 8px;
  opacity: 0.9;
}

.portal-route-version {
  align-self: flex-end;
  margin-left: auto;
  opacity: 0.7;
  font-size: 10px;
  text-align: right;
  white-space: nowrap;
}

.portal-route-totals {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-top: 8px;
}

.portal-route-points-summary {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.portal-route-totals div {
  padding: 5px;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.portal-route-totals span,
.portal-route-totals strong {
  display: block;
}

.portal-route-message {
  display: none;
  margin-top: 8px;
  padding: 7px;
  border: 1px solid #ffd800;
  background: rgba(0, 0, 0, 0.22);
}

.portal-route-message-visible {
  display: block;
}

.portal-route-busy {
  opacity: 0.82;
}

.portal-route-stop-tooltip,
.portal-route-stop-tooltip * {
  pointer-events: none;
}

.portal-route-stop-label {
  border: 0;
  background: transparent;
}

.portal-route-stop-label span {
  position: relative;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.65);
}

.portal-route-stop-label-selected span {
  outline: 2px solid #fff;
  outline-offset: 1px;
}

.portal-route-stop-label-start span {
  box-shadow:
    0 0 0 2px rgba(45, 190, 95, 0.95),
    0 1px 3px rgba(0, 0, 0, 0.65);
}

.portal-route-stop-label-end span {
  box-shadow:
    0 0 0 2px rgba(245, 80, 80, 0.95),
    0 1px 3px rgba(0, 0, 0, 0.65);
}

.portal-route-stop-label-loop-endpoint span {
  box-shadow:
    0 0 0 2px rgba(128, 216, 255, 0.95),
    0 1px 3px rgba(0, 0, 0, 0.65);
}

.portal-route-stop-label-start span::after,
.portal-route-stop-label-end span::after,
.portal-route-stop-label-loop-endpoint span::after {
  position: absolute;
  right: -7px;
  bottom: -6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 10px;
  border: 1px solid #111;
  border-radius: 2px;
  color: #111;
  font-size: 7px;
  font-weight: bold;
  line-height: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
}

.portal-route-stop-label-start span::after {
  content: "S";
  background: #74e28e;
}

.portal-route-stop-label-end span::after {
  content: "E";
  background: #ff8a8a;
}

.portal-route-stop-label-loop-endpoint span::after {
  background: #80d8ff;
}

.portal-route-stop-label-draggable span {
  cursor: grab;
}

.portal-route-stop-label-dragging span {
  background: #ffd800;
  cursor: grabbing;
  transform: scale(1.12);
}

.portal-route-map-point-marker {
  border: 0;
  background: transparent;
}

.portal-route-map-point-marker span {
  display: block;
  width: 16px;
  height: 16px;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  background: rgba(80, 170, 255, 0.72);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
  cursor: grab;
}

.portal-route-home-point-marker span {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: rgba(116, 226, 142, 0.88);
  text-align: center;
  line-height: 18px;
}

.portal-route-home-point-marker span::before {
  content: "⌂";
  color: #111;
  font-size: 15px;
  font-weight: bold;
}

.portal-route-home-point-label span {
  border-color: #74e28e;
}

.portal-route-map-point-marker-selected span {
  outline: 1px solid #fff;
  outline-offset: 2px;
}

.portal-route-map-point-marker-dragging span {
  background: rgba(255, 216, 0, 0.88);
  cursor: grabbing;
  transform: scale(1.15);
}

.portal-route-segment-time-label {
  border: 0;
  background: transparent;
  pointer-events: none;
}

.portal-route-segment-time-label span {
  display: inline-block;
  padding: 2px 5px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.72);
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  line-height: 1.2;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.65);
}

.portal-route-stop-tooltip {
  font-size: 11px;
}

.portal-route-portal-action {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 4px;
  padding: 5px 5px 5px;
  border-top: 1px solid rgba(32, 168, 204, 0.65);
}

.portal-route-portal-action-title {
  flex: 0 0 100%;
  margin-bottom: 7px;
  background-color: rgba(8, 60, 78, 0.9);
  text-align: center;
  font-weight: bold;
}

.portal-route-portal-action-links {
  display: flex;
  flex-wrap: wrap;
  flex: 0 0 100%;
  justify-content: center;
  overflow: hidden;
  text-overflow: ellipsis;
}

.portal-route-portal-action-links a,
.portal-route-portal-action-links button {
  flex: 0 0 auto;
  display: inline-block;
  margin: 0 4px 2px;
  padding: 1px 4px;
  border: 1px solid transparent;
  border-radius: 3px;
  background: transparent;
  line-height: 1.2;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
}

.portal-route-portal-action-links a.portal-route-smart-button,
.portal-route-portal-action-links button.portal-route-smart-button {
  border-color: rgba(128, 216, 255, 0.75) !important;
  color: #ffd800 !important;
  outline: 0;
}

.portal-route-portal-action-links button {
  cursor: pointer;
}

.portal-route-portal-action-links button.portal-route-add-delete-button,
.portal-route-control-group-buttons button.portal-route-add-delete-button {
  border-color: rgba(128, 216, 255, 0.75) !important;
  color: #ffd800 !important;
  box-shadow: inset 0 0 0 1px rgba(128, 216, 255, 0.25) !important;
}

.portal-route-portal-action-links button.portal-route-add-delete-button:hover,
.portal-route-portal-action-links button.portal-route-add-delete-button:focus,
.portal-route-portal-action-links button.portal-route-add-delete-button:active,
.portal-route-control-group-buttons button.portal-route-add-delete-button:hover,
.portal-route-control-group-buttons button.portal-route-add-delete-button:focus,
.portal-route-control-group-buttons button.portal-route-add-delete-button:active,
.portal-route-add-delete-button.portal-route-remove-action:hover,
.portal-route-add-delete-button.portal-route-remove-action:focus,
.portal-route-add-delete-button.portal-route-remove-action:active {
  border-color: rgba(128, 216, 255, 0.95) !important;
  color: #ffd800 !important;
}

.portal-route-add-delete-button.portal-route-remove-action {
  border-color: rgba(128, 216, 255, 0.75) !important;
  color: #ffd800 !important;
}

.portal-route-compact-stats {
  flex: 0 0 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px 10px;
  margin-top: 6px;
  padding: 4px 6px;
  border: 1px solid rgba(128, 216, 255, 0.32);
  border-radius: 6px;
  background: rgba(0, 32, 48, 0.28);
  font-size: 11px;
  line-height: 1.25;
  opacity: 0.96;
}

.portal-route-compact-stats-stale {
  border-color: rgba(255, 216, 0, 0.34);
  background: rgba(48, 40, 0, 0.24);
  opacity: 0.82;
}

.portal-route-compact-stats span {
  white-space: nowrap;
}

.portal-route-context-menu {
  position: fixed;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 150px;
  padding: 5px;
  border: 1px solid rgba(32, 168, 204, 0.8);
  background: rgba(8, 45, 62, 0.96);
  color: #ffd800;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.55);
}

.portal-route-context-menu button {
  display: block;
  width: 100%;
  padding: 4px 6px !important;
  border: 0 !important;
  background: transparent !important;
  color: inherit !important;
  font: inherit;
  text-align: left;
}

.portal-route-context-menu button:hover,
.portal-route-context-menu button:focus {
  background: rgba(255, 255, 255, 0.12) !important;
  outline: none !important;
}

.portal-route-context-menu button:disabled {
  color: rgba(255, 255, 255, 0.42) !important;
}

.portal-route-context-divider {
  height: 1px;
  margin: 3px 0;
  background: rgba(32, 168, 204, 0.5);
}


.ui-dialog.portal-route-dialog {
  max-width: calc(100vw - 20px) !important;
}

.ui-dialog.portal-route-dialog .ui-dialog-content {
  box-sizing: border-box !important;
  overflow-x: visible !important;
}

.ui-dialog.portal-route-settings-dialog .ui-dialog-content,
.ui-dialog.portal-route-points-dialog .ui-dialog-content,
.ui-dialog.portal-route-library-dialog .ui-dialog-content {
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
}

.ui-dialog.portal-route-settings-dialog .ui-dialog-content > .portal-route-settings-dialog-content,
.ui-dialog.portal-route-points-dialog .ui-dialog-content > .portal-route-points-dialog-content,
.ui-dialog.portal-route-library-dialog .ui-dialog-content > .portal-route-library-dialog-content {
  flex: 1 1 auto;
  min-height: 0;
}


.ui-dialog.portal-route-anchored-dialog {
  max-width: calc(100vw - 20px) !important;
}

.ui-dialog.portal-route-bookmark-picker-dialog .ui-dialog-content,
.ui-dialog.portal-route-bulk-select-dialog .ui-dialog-content {
  overflow-x: hidden !important;
  overflow-y: visible !important;
}

.portal-route-dialog-content:focus,
.portal-route-dialog-content:focus-visible,
.ui-dialog.portal-route-dialog .ui-dialog-content:focus,
.ui-dialog.portal-route-dialog .ui-dialog-content:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

.portal-route-waypoints-list,
.portal-route-waypoint-row,
.portal-route-waypoint-row > div,
.portal-route-waypoint-name-cell,
.portal-route-waypoint-name-cell * {
  border-color: transparent !important;
}

.portal-route-waypoint-name,
button.portal-route-waypoint-name,
.ui-dialog .portal-route-waypoint-name,
.ui-dialog button.portal-route-waypoint-name {
  border: none !important;
  border-width: 0 !important;
  outline: none !important;
  box-shadow: none !important;
  background: transparent !important;
  background-image: none !important;
}

@media (max-width: 640px) {
  .ui-dialog.portal-route-dialog {
    position: fixed !important;
    left: 8px !important;
    right: 8px !important;
    top: 50% !important;
    bottom: auto !important;
    width: auto !important;
    max-width: calc(100vw - 16px) !important;
    max-height: calc(100dvh - 24px) !important;
    transform: translateY(-50%) !important;
  }

  .ui-dialog.portal-route-dialog .ui-dialog-content {
    width: auto !important;
    max-height: calc(100dvh - 90px) !important;
    overflow-y: auto !important;
    overflow-x: visible !important;
    padding-left: 8px !important;
    padding-right: 8px !important;
    padding-bottom: 8px !important;
  }

  .ui-dialog.portal-route-settings-dialog .ui-dialog-content,
  .ui-dialog.portal-route-points-dialog .ui-dialog-content,
  .ui-dialog.portal-route-library-dialog .ui-dialog-content {
    overflow: hidden !important;
  }

  .portal-route-settings-dialog-content,
  .portal-route-points-dialog-content,
  .portal-route-library-dialog-content {
    max-height: calc(100dvh - 90px);
  }

  .portal-route-waypoint-row {
    grid-template-columns: 18px minmax(0, 1fr) 38px max-content;
    grid-template-areas:
      "num name wait actions"
      ". leg leg actions";
    gap: 1px 3px;
  }

  .portal-route-waypoint-num {
    grid-area: num;
  }

  .portal-route-waypoint-name-cell {
    grid-area: name;
  }

  .portal-route-leg-cell {
    grid-area: leg;
  }

  .portal-route-wait-cell {
    grid-area: wait;
  }

  .portal-route-row-actions {
    grid-area: actions;
  }

  .portal-route-waypoint-num {
    width: 18px;
  }

  .portal-route-leg-cell {
    padding-right: 9px;
  }

  .portal-route-wait-cell {
    width: 38px;
  }

  .portal-route-wait-input {
    width: 38px;
  }

  .portal-route-row-actions {
    align-self: stretch;
    align-items: center;
  }

  .portal-route-row-actions button {
    min-width: 20px;
    padding: 2px 3px !important;
    font-size: 11px;
    line-height: 1;
  }

  .portal-route-row-action-full {
    display: none;
  }

  .portal-route-row-action-short {
    display: inline;
  }

  .portal-route-control-groups {
    grid-template-columns: 1fr;
  }

  .portal-route-list-options {
    align-items: flex-start;
  }

  .portal-route-travel-controls {
    overflow-x: auto;
    padding-bottom: 2px;
  }

}

.leaflet-container.portal-route-bulk-select-mode,
.leaflet-container.portal-route-bulk-select-mode * {
  cursor: crosshair !important;
}

.portal-route-bulk-select-control {
  width: 160px;
  padding: 6px;
  background: rgba(8, 24, 32, 0.94);
  color: #fff;
  border: 1px solid rgba(255, 216, 0, 0.55) !important;
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.45);
  font-size: 11px;
  line-height: 1.25;
}

.portal-route-bulk-select-control-title {
  font-weight: bold;
  margin-bottom: 3px;
}

.portal-route-bulk-select-control-help {
  margin-bottom: 6px;
}

.portal-route-bulk-select-control-buttons,
.portal-route-bulk-select-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.portal-route-bulk-select-control button,
.portal-route-bulk-select-preview button {
  padding: 2px 6px;
  font: inherit;
}

.portal-route-bulk-select-preview p {
  margin: 0 0 7px;
}

.portal-route-bulk-endpoints {
  display: grid;
  gap: 6px;
  margin: 0 0 8px;
}

.portal-route-bulk-endpoints label {
  display: grid;
  gap: 2px;
  font-size: 11px;
}

.portal-route-bulk-endpoints select {
  width: 100%;
  max-width: 100%;
}


.portal-route-bookmark-picker p {
  margin: 0 0 7px;
}

.portal-route-bookmark-picker label {
  display: grid;
  gap: 2px;
  margin-bottom: 8px;
  font-size: 11px;
}

.portal-route-bookmark-picker select {
  width: 100%;
  max-width: 100%;
}

.portal-route-bookmark-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.portal-route-bookmark-actions button {
  padding: 2px 6px;
  font: inherit;
}

@media (max-width: 640px) {
  .ui-dialog.portal-route-anchored-dialog {
    left: 8px !important;
    right: auto !important;
    top: 8px !important;
    bottom: auto !important;
    width: calc(100vw - 16px) !important;
    max-width: calc(100vw - 16px) !important;
    max-height: calc(100dvh - 24px) !important;
    transform: none !important;
  }

  .ui-dialog.portal-route-anchored-dialog .ui-dialog-content {
    max-height: calc(100dvh - 90px) !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
  }
}
`;

  pr.ID = 'portal-route';
  pr.NAME = 'Portal Route';
  pr.VERSION = '1.6.0';
  pr.SHOW_VERSION_IN_PANEL = true;

  pr.DOM_IDS = {
    css: 'iitc-plugin-portal-route-css',
    dialog: 'iitc-plugin-portal-route-dialog',
    dialogContent: 'iitc-plugin-portal-route-dialog-content',
    pointsDialog: 'iitc-plugin-portal-route-points-dialog',
    pointsDialogContent: 'iitc-plugin-portal-route-points-dialog-content',
    routeLibrary: 'iitc-plugin-portal-route-library-dialog',
    routeLibraryContent: 'iitc-plugin-portal-route-library-dialog-content',
    bulkSelectDialog: 'iitc-plugin-portal-route-bulk-select-dialog',
    bulkSelectDialogContent: 'iitc-plugin-portal-route-bulk-select-dialog-content',
    miniControl: 'iitc-plugin-portal-route-mini-control',
    toolboxLink: 'iitc-plugin-portal-route-toolbox-link'
  };

  pr.normalizeRouteLineColor = function(color) {
    color = String(color == null ? '' : color).trim();
    if (/^#[0-9a-fA-F]{6}$/.test(color)) return color.toLowerCase();
    return pr.DEFAULT_SETTINGS.routeLineColor;
  };

  pr.normalizeRouteLineWeight = function(weight) {
    weight = Number(weight);
    if (weight === 3 || weight === 5 || weight === 7 || weight === 9) return weight;
    return pr.DEFAULT_SETTINGS.routeLineWeight;
  };

  pr.ROUTE_LINE_STYLES = {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted'
  };

  pr.normalizeRouteLineStyle = function(style) {
    style = String(style == null ? '' : style).trim();
    if (style === pr.ROUTE_LINE_STYLES.solid || style === pr.ROUTE_LINE_STYLES.dashed || style === pr.ROUTE_LINE_STYLES.dotted) return style;
    return pr.DEFAULT_SETTINGS.routeLineStyle;
  };

  pr.getRouteLineDashArray = function(style, weight) {
    style = pr.normalizeRouteLineStyle(style);
    weight = pr.normalizeRouteLineWeight(weight);
    if (style === pr.ROUTE_LINE_STYLES.dashed) return String(weight * 3) + ' ' + String(weight * 2);
    if (style === pr.ROUTE_LINE_STYLES.dotted) return '1 ' + String(weight * 2);
    return '';
  };

  pr.STORAGE_KEYS = {
    stops: 'iitc-portal-route-stops',
    settings: 'iitc-portal-route-settings',
    panelOpen: 'iitc-portal-route-panel-open',
    panelPosition: 'iitc-portal-route-panel-position',
    panelSize: 'iitc-portal-route-panel-size',
    panelSizeUserSet: 'iitc-portal-route-panel-size-user-set',
    route: 'iitc-portal-route-route',
    routeDirty: 'iitc-portal-route-route-dirty',
    routeLibrary: 'iitc-portal-route-library',
    routeLibraryDriveCache: 'iitc-portal-route-drive-library-cache',
    routeLibraryDriveFolderId: 'iitc-portal-route-drive-folder-id',
    routeLibraryDriveFolderName: 'iitc-portal-route-drive-folder-name',
    routeLibraryDriveFileId: 'iitc-portal-route-drive-file-id'
  };

  pr.TRAVEL_MODES = {
    drive: 'drive',
    bike: 'bike',
    walk: 'walk'
  };

  pr.ROUTING_PROVIDERS = {
    google: 'google',
    ors: 'ors'
  };

  pr.DEFAULT_SETTINGS = {
    defaultStopMinutes: 5,
    includeReturnToStart: false,
    startOnCurrentLocation: false,
    routingProvider: pr.ROUTING_PROVIDERS.google,
    defaultTravelMode: pr.TRAVEL_MODES.drive,
    driveSpeedMph: 30,
    bikeSpeedMph: 10,
    walkSpeedMph: 3,
    orsApiKey: '',
    orsBaseUrl: 'https://api.openrouteservice.org',
    routeLineColor: '#ff7f00',
    routeLineWeight: 5,
    routeLineStyle: 'solid',
    homeTitle: 'Home',
    homeLat: '',
    homeLng: '',
    googleDriveOAuthClientId: '',
    showSegmentTimesOnMap: false,
    showMiniControl: true,
    showPortalDetailsControls: true
  };

  pr.normalizeSettings = function(settings) {
    var normalized = Object.assign({}, pr.DEFAULT_SETTINGS);
    if (!settings || typeof settings !== 'object') return normalized;

    Object.keys(pr.DEFAULT_SETTINGS).forEach(function(key) {
      var defaultValue = pr.DEFAULT_SETTINGS[key];
      var value = settings[key];

      if (typeof defaultValue === 'boolean') {
        if (typeof value === 'boolean') normalized[key] = value;
        return;
      }

      if (typeof defaultValue === 'number') {
        value = Number(value);
        if (!isFinite(value) || value < 0) return;
        if (key === 'routeLineWeight') {
          normalized[key] = pr.normalizeRouteLineWeight ? pr.normalizeRouteLineWeight(value) : Math.round(value);
          return;
        }
        if (/SpeedMph$/.test(key)) {
          if (value > 0) normalized[key] = value;
          return;
        }
        normalized[key] = Math.round(value);
        return;
      }

      if (typeof defaultValue === 'string') {
        if (typeof value !== 'string') return;
        value = value.trim();
        if (key === 'defaultTravelMode') {
          if (value === pr.TRAVEL_MODES.drive || value === pr.TRAVEL_MODES.bike || value === pr.TRAVEL_MODES.walk) {
            normalized[key] = value;
          }
          return;
        }
        if (key === 'routingProvider') {
          if (value === pr.ROUTING_PROVIDERS.google || value === pr.ROUTING_PROVIDERS.ors) {
            normalized[key] = value;
          }
          return;
        }
        if (key === 'orsBaseUrl') {
          normalized[key] = value.replace(/\/+$/, '') || pr.DEFAULT_SETTINGS.orsBaseUrl;
          return;
        }
        if (key === 'routeLineColor') {
          normalized[key] = pr.normalizeRouteLineColor ? pr.normalizeRouteLineColor(value) : value;
          return;
        }
        if (key === 'routeLineStyle') {
          normalized[key] = pr.normalizeRouteLineStyle ? pr.normalizeRouteLineStyle(value) : value;
          return;
        }
        if (key === 'homeTitle') {
          normalized[key] = value || pr.DEFAULT_SETTINGS.homeTitle;
          return;
        }
        if (key === 'homeLat' || key === 'homeLng') {
          normalized[key] = value;
          return;
        }
        normalized[key] = value;
      }
    });

    return normalized;
  };

  pr.state = {
    stops: [],
    route: null,
    routeDirty: false,
    settings: pr.normalizeSettings(),
    layers: {
      labels: null,
      routeLine: null,
      segmentLabels: null
    },
    panelOpen: false,
    panelPosition: null,
    panelSize: null,
    pointsPanelOpen: false,
    addPointMode: false,
    homePickMode: false,
    selectedMapPointIndex: null,
    activeRouteId: null,
    routeLibraryBackendId: 'local',
    selectedLibraryRouteIds: [],
    miniControl: null,
    undoStack: [],
    redoStack: [],
    restoringRouteEdit: false
  };

  pr.getEffectiveStopMinutes = function(stop) {
    if (stop && typeof stop.stopMinutes === 'number' && !Number.isNaN(stop.stopMinutes)) {
      return stop.stopMinutes;
    }
    return pr.state.settings.defaultStopMinutes;
  };

  pr.loadState = function() {
    try {
      var rawSettings = localStorage.getItem(pr.STORAGE_KEYS.settings);
      if (rawSettings) {
        pr.state.settings = pr.normalizeSettings(JSON.parse(rawSettings));
      }

      var rawStops = localStorage.getItem(pr.STORAGE_KEYS.stops);
      if (rawStops) {
        var stops = JSON.parse(rawStops);
        if (Array.isArray(stops)) {
          pr.state.stops = stops.map(function(stop) {
            if (!stop) return stop;
            return Object.assign({}, stop, {
              type: stop.type || (stop.guid ? 'portal' : 'map'),
              home: (stop.type || (stop.guid ? 'portal' : 'map')) === 'map' && !!stop.home
            });
          });
        }
      }

      var rawPanelOpen = localStorage.getItem(pr.STORAGE_KEYS.panelOpen);
      if (rawPanelOpen !== null) pr.state.panelOpen = rawPanelOpen === 'true';

      var rawPanelPosition = localStorage.getItem(pr.STORAGE_KEYS.panelPosition);
      if (rawPanelPosition) {
        var panelPosition = JSON.parse(rawPanelPosition);
        if (panelPosition &&
            typeof panelPosition.left === 'number' &&
            typeof panelPosition.top === 'number' &&
            (panelPosition.left !== 0 || panelPosition.top !== 0)) {
          pr.state.panelPosition = panelPosition;
        }
      }

      var rawPanelSize = localStorage.getItem(pr.STORAGE_KEYS.panelSize);
      if (rawPanelSize && localStorage.getItem(pr.STORAGE_KEYS.panelSizeUserSet) === 'true') {
        var panelSize = JSON.parse(rawPanelSize);
        if (panelSize &&
            typeof panelSize.width === 'number' &&
            typeof panelSize.height === 'number') {
          pr.state.panelSize = panelSize;
        }
      }

      var rawRoute = localStorage.getItem(pr.STORAGE_KEYS.route);
      if (rawRoute) {
        var route = JSON.parse(rawRoute);
        if (route && Array.isArray(route.legs)) {
          pr.state.route = route;
          if (pr.refreshRouteTravelEstimates) pr.refreshRouteTravelEstimates(pr.state.route);
        }
      }

      var rawRouteDirty = localStorage.getItem(pr.STORAGE_KEYS.routeDirty);
      if (rawRouteDirty !== null) pr.state.routeDirty = rawRouteDirty === 'true';
    } catch (e) {
      console.warn('Portal Route: failed to load saved state', e);
    }
  };

  pr.saveSettings = function() {
    localStorage.setItem(pr.STORAGE_KEYS.settings, JSON.stringify(pr.state.settings));
  };

  pr.saveStops = function() {
    localStorage.setItem(pr.STORAGE_KEYS.stops, JSON.stringify(pr.state.stops));
  };

  pr.savePanelOpen = function() {
    localStorage.setItem(pr.STORAGE_KEYS.panelOpen, String(pr.state.panelOpen));
  };

  pr.savePanelPosition = function() {
    if (pr.state.panelPosition) {
      localStorage.setItem(pr.STORAGE_KEYS.panelPosition, JSON.stringify(pr.state.panelPosition));
    } else {
      localStorage.removeItem(pr.STORAGE_KEYS.panelPosition);
    }
  };

  pr.savePanelSize = function() {
    if (pr.state.panelSize) {
      localStorage.setItem(pr.STORAGE_KEYS.panelSize, JSON.stringify(pr.state.panelSize));
      localStorage.setItem(pr.STORAGE_KEYS.panelSizeUserSet, 'true');
    } else {
      localStorage.removeItem(pr.STORAGE_KEYS.panelSize);
      localStorage.removeItem(pr.STORAGE_KEYS.panelSizeUserSet);
    }
  };

  pr.saveRoute = function() {
    if (pr.state.route) {
      localStorage.setItem(pr.STORAGE_KEYS.route, JSON.stringify(pr.state.route));
    } else {
      localStorage.removeItem(pr.STORAGE_KEYS.route);
    }
    localStorage.setItem(pr.STORAGE_KEYS.routeDirty, String(!!pr.state.routeDirty));
  };

  pr.clearSavedRoute = function() {
    localStorage.removeItem(pr.STORAGE_KEYS.route);
    localStorage.removeItem(pr.STORAGE_KEYS.routeDirty);
  };

  pr.UNDO_LIMIT = 40;

  pr.cloneForUndo = function(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  };

  pr.routeUndoSettings = function(settings) {
    settings = settings || pr.state.settings || {};
    return {
      defaultStopMinutes: settings.defaultStopMinutes,
      includeReturnToStart: !!settings.includeReturnToStart,
      startOnCurrentLocation: !!settings.startOnCurrentLocation,
      routingProvider: settings.routingProvider || pr.ROUTING_PROVIDERS.google,
      defaultTravelMode: settings.defaultTravelMode || pr.TRAVEL_MODES.drive,
      driveSpeedMph: settings.driveSpeedMph,
      bikeSpeedMph: settings.bikeSpeedMph,
      walkSpeedMph: settings.walkSpeedMph
    };
  };

  pr.currentRouteEditSnapshot = function(label) {
    return {
      label: label || 'route edit',
      stops: pr.cloneForUndo(pr.state.stops || []),
      settings: pr.routeUndoSettings(),
      route: pr.cloneForUndo(pr.state.route || null),
      routeDirty: !!pr.state.routeDirty,
      selectedMapPointIndex: typeof pr.state.selectedMapPointIndex === 'number' ? pr.state.selectedMapPointIndex : null,
      selectedPortal: window.selectedPortal || null,
      activeRouteId: pr.state.activeRouteId || null
    };
  };

  pr.routeEditSnapshotKey = function(snapshot) {
    return JSON.stringify({
      stops: snapshot.stops,
      settings: snapshot.settings,
      route: snapshot.route,
      routeDirty: snapshot.routeDirty,
      selectedMapPointIndex: snapshot.selectedMapPointIndex,
      selectedPortal: snapshot.selectedPortal,
      activeRouteId: snapshot.activeRouteId
    });
  };

  pr.ensureUndoStacks = function() {
    if (!Array.isArray(pr.state.undoStack)) pr.state.undoStack = [];
    if (!Array.isArray(pr.state.redoStack)) pr.state.redoStack = [];
  };

  pr.pushUndoSnapshot = function(label) {
    if (pr.state.restoringRouteEdit) return;
    pr.ensureUndoStacks();

    var snapshot = pr.currentRouteEditSnapshot(label);
    var key = pr.routeEditSnapshotKey(snapshot);
    var last = pr.state.undoStack.length ? pr.state.undoStack[pr.state.undoStack.length - 1] : null;
    if (last && last.key === key) return;

    snapshot.key = key;
    pr.state.undoStack.push(snapshot);
    while (pr.state.undoStack.length > pr.UNDO_LIMIT) pr.state.undoStack.shift();
    pr.state.redoStack = [];
  };

  pr.canUndoRouteEdit = function() {
    pr.ensureUndoStacks();
    return pr.state.undoStack.length > 0;
  };

  pr.canRedoRouteEdit = function() {
    pr.ensureUndoStacks();
    return pr.state.redoStack.length > 0;
  };

  pr.restoreRouteEditSnapshot = function(snapshot) {
    if (!snapshot) return false;

    pr.state.restoringRouteEdit = true;
    try {
      pr.state.stops = pr.cloneForUndo(snapshot.stops || []);
      pr.state.settings = Object.assign({}, pr.state.settings, pr.routeUndoSettings(snapshot.settings));
      pr.state.route = pr.cloneForUndo(snapshot.route || null);
      pr.state.routeDirty = !!snapshot.routeDirty;
      pr.state.selectedMapPointIndex = typeof snapshot.selectedMapPointIndex === 'number' ? snapshot.selectedMapPointIndex : null;
      pr.state.activeRouteId = snapshot.activeRouteId || null;
      window.selectedPortal = snapshot.selectedPortal || null;

      pr.saveSettings();
      pr.saveStops();
      pr.saveRoute();

      pr.clearRouteLine();
      if (pr.state.route) pr.redrawRouteLine();
      pr.redrawLabels();
      pr.redrawSegmentTimeLabels();
      pr.renderPanel();
      if (pr.state.pointsPanelOpen && pr.renderPointsPanel) pr.renderPointsPanel();
      pr.renderMiniControl();
      if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
      if (pr.state.routeDirty && pr.getRouteStops().length >= 2) pr.queueAutoReplot();
    } finally {
      pr.state.restoringRouteEdit = false;
    }

    return true;
  };

  pr.undoRouteEdit = function() {
    pr.ensureUndoStacks();
    if (!pr.state.undoStack.length) {
      pr.showMessage('Nothing to undo.');
      return false;
    }

    var current = pr.currentRouteEditSnapshot('redo point');
    current.key = pr.routeEditSnapshotKey(current);
    pr.state.redoStack.push(current);

    var snapshot = pr.state.undoStack.pop();
    if (!pr.restoreRouteEditSnapshot(snapshot)) return false;
    pr.showMessage('Undid ' + (snapshot.label || 'route edit') + '.');
    return true;
  };

  pr.redoRouteEdit = function() {
    pr.ensureUndoStacks();
    if (!pr.state.redoStack.length) {
      pr.showMessage('Nothing to redo.');
      return false;
    }

    var current = pr.currentRouteEditSnapshot('undo point');
    current.key = pr.routeEditSnapshotKey(current);
    pr.state.undoStack.push(current);

    var snapshot = pr.state.redoStack.pop();
    if (!pr.restoreRouteEditSnapshot(snapshot)) return false;
    pr.showMessage('Redid route edit.');
    return true;
  };

  pr.formatDuration = function(seconds) {
    seconds = Math.max(0, Math.round(seconds || 0));
    var minutes = Math.round(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var mins = minutes % 60;

    if (hours > 0 && mins > 0) return hours + ' hr ' + mins + ' min';
    if (hours > 0) return hours + ' hr';
    return minutes + ' min';
  };

  pr.formatDistance = function(meters) {
    meters = Math.max(0, Number(meters || 0));
    var miles = meters / 1609.344;
    if (miles >= 10) return miles.toFixed(0) + ' mi';
    return miles.toFixed(1) + ' mi';
  };

  pr.formatDistanceKm = function(meters) {
    meters = Math.max(0, Number(meters || 0));
    var km = meters / 1000;
    if (km >= 10) return km.toFixed(0) + ' km';
    return km.toFixed(1) + ' km';
  };

  pr.formatSpeedInput = function(mph) {
    mph = Number(mph || 0);
    if (!isFinite(mph) || mph <= 0) return '';
    return String(Math.round(mph * 10) / 10).replace(/\.0$/, '');
  };

  pr.escapeHtml = pr.escapeHtml || function(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  pr.routeAttrHtml = function(attrs) {
    if (!attrs) return '';

    var html = '';
    Object.keys(attrs).forEach(function(name) {
      var value = attrs[name];
      if (value === false || value === null || value === undefined) return;
      if (value === true) {
        html += ' ' + name;
      } else {
        html += ' ' + name + '="' + pr.escapeHtml(value) + '"';
      }
    });
    return html;
  };

  pr.ROUTE_CONTROL_CLASSES = pr.ROUTE_CONTROL_CLASSES || {
    smartButton: 'portal-route-smart-button',
    addDeleteButton: 'portal-route-add-delete-button',
    removeAction: 'portal-route-remove-action',
    addPointActive: 'portal-route-add-point-active',
    replotButton: 'portal-route-replot-button',
    replotNeeded: 'portal-route-replot-needed',
    contextStale: 'portal-route-context-stale'
  };

  pr.routeButtonClassName = function(options) {
    options = options || {};

    var classes = [];
    if (options.smart) classes.push(pr.ROUTE_CONTROL_CLASSES.smartButton);
    if (options.addDelete) classes.push(pr.ROUTE_CONTROL_CLASSES.addDeleteButton);
    if (options.remove) classes.push(pr.ROUTE_CONTROL_CLASSES.removeAction);
    if (options.active) classes.push(pr.ROUTE_CONTROL_CLASSES.addPointActive);
    if (options.extraClass) classes.push(options.extraClass);

    return classes.join(' ');
  };

  pr.routeButtonHtml = function(options) {
    options = options || {};

    var attrs = options.attrs || {};
    attrs.type = attrs.type || 'button';
    if (options.action) attrs['data-action'] = options.action;
    if (options.index !== undefined && options.index !== null) attrs['data-index'] = options.index;
    if (options.ariaLabel) attrs['aria-label'] = options.ariaLabel;
    if (options.disabled) attrs.disabled = true;

    var className = pr.routeButtonClassName(options);
    if (className) attrs.class = className;

    return '<button' + pr.routeAttrHtml(attrs) + '>' + pr.escapeHtml(options.label || '') + '</button>';
  };

  pr.createRouteButtonElement = function(options) {
    options = options || {};

    var button = document.createElement('button');
    button.type = 'button';
    button.textContent = options.label || '';
    if (options.action) button.setAttribute('data-action', options.action);
    if (options.index !== undefined && options.index !== null) button.setAttribute('data-index', options.index);
    if (options.ariaLabel) button.setAttribute('aria-label', options.ariaLabel);
    if (options.disabled) button.disabled = true;

    var className = pr.routeButtonClassName(options);
    if (className) button.className = className;

    if (options.attrs) {
      Object.keys(options.attrs).forEach(function(name) {
        var value = options.attrs[name];
        if (value === false || value === null || value === undefined) return;
        button.setAttribute(name, value === true ? '' : value);
      });
    }

    return button;
  };

  pr.createRouteActionLink = function(options) {
    options = options || {};

    var link = document.createElement('a');
    link.href = '#';
    link.textContent = options.label || '';
    if (options.action) link.setAttribute('data-action', options.action);
    if (options.ariaLabel) link.setAttribute('aria-label', options.ariaLabel);

    var className = pr.routeButtonClassName(options);
    if (className) link.className = className;

    if (options.attrs) {
      Object.keys(options.attrs).forEach(function(name) {
        var value = options.attrs[name];
        if (value === false || value === null || value === undefined) return;
        link.setAttribute(name, value === true ? '' : value);
      });
    }

    return link;
  };

  pr.appendRouteButton = function(parent, options) {
    var button = pr.createRouteButtonElement(options);
    parent.appendChild(button);
    return button;
  };

  pr.appendRouteLink = function(parent, options) {
    var link = pr.createRouteActionLink(options);
    parent.appendChild(link);
    return link;
  };

  pr.selectedAddDeleteButtonOptions = function(labelMode) {
    var selectedInRoute = pr.selectedStopIndex && pr.selectedStopIndex() >= 0;
    var label = selectedInRoute ? 'Del' : 'Add';

    return {
      label: labelMode === 'symbol' ? (selectedInRoute ? '-' : '+') : label,
      action: selectedInRoute ? 'toggle-selected-stop' : 'smart-add',
      ariaLabel: selectedInRoute ? 'Remove selected waypoint from route' : 'Add selected portal or create a waypoint',
      smart: true,
      addDelete: selectedInRoute,
      remove: selectedInRoute,
      active: !selectedInRoute && !!(pr.state && pr.state.addPointMode)
    };
  };

  pr.selectedAddDeleteButton = function(labelMode) {
    return pr.routeButtonHtml(pr.selectedAddDeleteButtonOptions(labelMode));
  };

  pr.undoRouteEditButtonOptions = function() {
    return {
      label: 'Undo',
      action: 'undo-route-edit',
      ariaLabel: 'Undo last route edit',
      smart: true,
      disabled: !(pr.canUndoRouteEdit && pr.canUndoRouteEdit())
    };
  };

  pr.undoRouteEditButton = function() {
    return pr.routeButtonHtml(pr.undoRouteEditButtonOptions());
  };

  pr.mainMenuButtonOptions = function(label, extraClass) {
    return {
      label: label || 'Menu',
      action: 'open-main-menu',
      smart: true,
      extraClass: extraClass,
      attrs: { 'data-main-menu': 'true' }
    };
  };

  pr.mainMenuButton = function(label, extraClass) {
    return pr.routeButtonHtml(pr.mainMenuButtonOptions(label, extraClass));
  };

  pr.mainMenuLinkOptions = function(label, extraClass) {
    return pr.mainMenuButtonOptions(label || 'Menu', extraClass);
  };

  pr.routeReplotLabel = function() {
    return pr.state.routeDirty || pr.state.route ? 'Replot' : 'Route';
  };

  pr.canCalculateRoute = function() {
    return !!(pr.getRouteStops && pr.getRouteStops().length >= 2);
  };

  pr.routeReplotButtonOptions = function(options) {
    options = options || {};
    var classes = pr.ROUTE_CONTROL_CLASSES.replotButton;
    if (pr.state.routeDirty) classes += ' ' + pr.ROUTE_CONTROL_CLASSES.replotNeeded;

    return {
      label: pr.routeReplotLabel(),
      action: 'calculate-route',
      disabled: !!options.disableWhenUnavailable && !pr.canCalculateRoute(),
      extraClass: classes
    };
  };

  pr.routeReplotMenuItem = function() {
    return {
      label: pr.routeReplotLabel(),
      action: 'calculate-route',
      disabled: !pr.canCalculateRoute(),
      className: pr.state.routeDirty ? pr.ROUTE_CONTROL_CLASSES.contextStale : ''
    };
  };

  pr.reverseRouteButtonOptions = function() {
    return {
      label: 'Reverse route',
      action: 'reverse-route',
      disabled: pr.state.stops.length <= 1
    };
  };

  pr.fitRouteButtonOptions = function() {
    return {
      label: 'Fit',
      action: 'fit-route'
    };
  };

  pr.loopBackButtonOptions = function() {
    return {
      label: pr.state.settings.includeReturnToStart ? 'Unloop' : 'Loop',
      action: 'toggle-loop-back',
      ariaLabel: pr.state.settings.includeReturnToStart ? 'Turn off loop back to start' : 'Loop back to start'
    };
  };

  pr.createMiniControlButton = function(options) {
    options = options || {};

    var className = options.className ? ' class="' + pr.escapeHtml(options.className) + '"' : '';
    var attrs = {
      href: '#',
      'aria-label': options.ariaLabel || options.label || '',
      'data-action': options.action || ''
    };
    if (options.mainMenu) attrs['data-main-menu'] = 'true';
    if (options.mapsMenu) attrs['data-maps-menu'] = 'true';

    return '<a' + className + pr.routeAttrHtml(attrs) + '>' + pr.escapeHtml(options.label || '') + '</a>';
  };

  pr.miniControlButtonOptions = function() {
    var selectedInRoute = pr.selectedStopIndex && pr.selectedStopIndex() >= 0;
    var addPointActive = !!(pr.state && pr.state.addPointMode);
    var addRemoveClass = selectedInRoute ? 'portal-route-mini-add portal-route-mini-remove' : 'portal-route-mini-add';
    if (addPointActive && !selectedInRoute) addRemoveClass += ' portal-route-mini-add-active';
    var loopClass = pr.state.settings.includeReturnToStart ? 'portal-route-mini-loop portal-route-mini-active' : 'portal-route-mini-loop';

    return [
      { label: 'M', action: 'open-maps-menu', ariaLabel: 'Open map export choices', className: 'portal-route-mini-maps', mapsMenu: true },
      { label: 'L', action: 'toggle-loop-back', ariaLabel: pr.state.settings.includeReturnToStart ? 'Turn off loop back to start' : 'Loop back to start', className: loopClass },
      { label: selectedInRoute ? '-' : '+', action: selectedInRoute ? 'toggle-selected-stop' : 'smart-add', ariaLabel: selectedInRoute ? 'Remove selected waypoint from route' : 'Add selected portal or place a map point', className: addRemoveClass },
      { label: String(pr.state.stops.length), action: 'open-points-list', ariaLabel: 'Open points list' },
      { label: '=', action: 'open-main-menu', ariaLabel: 'Open Portal Route menu', mainMenu: true }
    ];
  };

  pr.renderMiniControlButtons = function() {
    return pr.miniControlButtonOptions().map(function(options) {
      return pr.createMiniControlButton(options);
    }).join('');
  };

  pr.routeContextMenuButtonHtml = function(item) {
    if (!item) return '';
    if (item.divider) return '<div class="portal-route-context-divider"></div>';

    return pr.routeButtonHtml({
      label: item.label,
      action: item.action,
      index: item.index,
      disabled: item.disabled,
      extraClass: item.className,
      attrs: item.attrs
    });
  };

  pr.routeContextMenuHtml = function(items) {
    var html = '';
    (items || []).forEach(function(item) {
      html += pr.routeContextMenuButtonHtml(item);
    });
    return html;
  };

  pr.mapExportMenuItems = function() {
    var hasRoute = pr.canCalculateRoute();

    return [
      { label: 'Google Maps', action: 'open-google-maps', disabled: !hasRoute },
      { label: 'Apple Maps', action: 'open-apple-maps', disabled: !hasRoute }
    ];
  };

  pr.mainMenuItems = function() {
    var hasStops = pr.state.stops.length > 0;

    return [
      { label: 'Add me', action: 'add-current-location' },
      { label: 'Add Home', action: 'add-home-location', disabled: !pr.getHomeLocation() },
      { label: window.selectedPortal ? 'Set Home to portal' : 'Pick Home on map', action: 'set-home-current-location' },
      { label: 'Bulk select', action: 'open-bulk-select-menu' },
      { label: pr.state.settings.includeReturnToStart ? 'Unloop' : 'Loop', action: 'toggle-loop-back' },
      { label: 'Clear Route', action: 'clear-route', disabled: !hasStops },
      { label: 'Save', action: 'save-route', disabled: !hasStops },
      { label: 'Undo', action: 'undo-route-edit', disabled: !(pr.canUndoRouteEdit && pr.canUndoRouteEdit()) },
      { divider: true }
    ].concat(pr.mapExportMenuItems(), [
      { divider: true },
      pr.routeReplotMenuItem(),
      { label: 'Route List', action: 'open-points-list', disabled: !hasStops },
      { label: 'Library', action: 'load-route' },
      { label: 'Settings', action: 'open-main' }
    ]);
  };

  pr.mapsMenuItems = function() {
    return pr.mapExportMenuItems();
  };

  pr.stopMenuItems = function(index) {
    var stop = pr.getRouteStop(index);
    if (!stop || stop.generatedLoop) return null;
    var isManagedStart = pr.isManagedStartStop(stop);

    return [
      { label: 'Delete', action: 'remove-stop', index: index, disabled: isManagedStart },
      { label: 'Rename', action: 'rename-stop', index: index, disabled: isManagedStart },
      { divider: true },
      { label: 'Set as start', action: 'set-stop-start', index: index, disabled: isManagedStart },
      { label: 'Set as end', action: 'set-stop-end', index: index, disabled: isManagedStart }
    ];
  };

  pr.openRouteContextMenu = function(items, className, x, y, options) {
    options = options || {};
    if (!options.keepExisting) pr.closeAddMenu();

    if (!items) return;
    var menu = document.createElement('div');
    menu.className = 'portal-route-context-menu' + (className ? ' ' + className : '');
    menu.innerHTML = pr.routeContextMenuHtml(items);

    document.body.appendChild(menu);
    pr.positionContextMenu(menu, x, y);
  };

  pr.portalToStop = function(guid) {
    var portal = guid && window.portals && window.portals[guid];
    if (!portal || !portal.getLatLng) return null;

    var latlng = portal.getLatLng();
    var data = portal.options && portal.options.data ? portal.options.data : {};

    return {
      guid: guid,
      title: data.title || data.name || guid,
      lat: latlng.lat,
      lng: latlng.lng
    };
  };

  pr.clearIitcPortalSelection = function() {
    var cleared = false;

    if (typeof window.renderPortalDetails === 'function') {
      try {
        window.renderPortalDetails(null);
        cleared = true;
      } catch (e) {
        console.warn('Portal Route: unable to clear IITC portal details via renderPortalDetails', e);
      }
    }

    if (!cleared && typeof window.selectPortal === 'function') {
      try {
        window.selectPortal(null, 'portal-route-map-point');
        cleared = true;
      } catch (e2) {
        console.warn('Portal Route: unable to clear IITC portal selection via selectPortal', e2);
      }
    }

    window.selectedPortal = null;

    var details = document.getElementById('portaldetails');
    if (details) details.innerHTML = '';

    if (typeof window.setPortalIndicators === 'function') {
      try {
        window.setPortalIndicators(null);
      } catch (e3) {
        console.warn('Portal Route: unable to clear IITC portal indicators', e3);
      }
    }
  };

  pr.addSelectedPortal = function() {
    var guid = window.selectedPortal;
    var stop = pr.portalToStop(guid);
    if (!stop) {
      pr.showMessage('No selected portal found.');
      return;
    }
    pr.addStop(stop);
  };

  pr.selectedPortalStopIndex = function() {
    var guid = window.selectedPortal;
    if (!guid) return -1;

    for (var i = 0; i < pr.state.stops.length; i++) {
      if (pr.state.stops[i] && pr.state.stops[i].guid === guid) return i;
    }

    return -1;
  };

  pr.selectedInfoPanelStopIndex = function() {
    var mapPointIndex = pr.selectedMapPointIndex ? pr.selectedMapPointIndex() : -1;
    if (mapPointIndex >= 0) return mapPointIndex;

    return pr.selectedPortalStopIndex();
  };

  pr.removePortalDetailsAction = function() {
    var existing = document.querySelector('.portal-route-portal-action');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
  };

  pr.portalDetailsActionAnchor = function(container) {
    if (!container || !document.createTreeWalker) return null;

    var nodeFilter = window.NodeFilter;
    if (!nodeFilter) return null;
    var walker = document.createTreeWalker(container, nodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        return node.nodeValue && node.nodeValue.indexOf('History:') >= 0
          ? nodeFilter.FILTER_ACCEPT
          : nodeFilter.FILTER_SKIP;
      }
    });
    var node = walker.nextNode();
    if (!node) return null;

    while (node && node.parentNode && node.parentNode !== container) {
      node = node.parentNode;
    }

    return node && node.parentNode === container ? node : null;
  };

  pr.placePortalDetailsAction = function(container, wrapper) {
    var anchor = pr.portalDetailsActionAnchor(container);
    var next = anchor ? anchor.nextSibling : null;

    if (next !== wrapper) container.insertBefore(wrapper, next);
  };

  pr.injectPortalDetailsAction = function() {
    var container = document.querySelector('#portaldetails');
    if (!container) return;

    if (!pr.state.settings.showPortalDetailsControls) {
      pr.removePortalDetailsAction();
      return;
    }

    var wrapper = container.querySelector('.portal-route-portal-action');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'portal-route-portal-action';
      container.appendChild(wrapper);
    }
    pr.placePortalDetailsAction(container, wrapper);

    var selectedIndex = pr.selectedInfoPanelStopIndex();
    var isInRoute = selectedIndex >= 0;
    var hasSelectedMapPoint = pr.selectedMapPointIndex && pr.selectedMapPointIndex() >= 0;

    wrapper.innerHTML = '';

    var header = document.createElement('div');
    header.className = 'portal-route-portal-action-title';
    header.textContent = 'Portal Route';
    wrapper.appendChild(header);

    var links = document.createElement('div');
    links.className = 'portal-route-portal-action-links';

    function addActionLink(label, action, options) {
      options = options || {};
      options.label = label;
      options.action = action;
      return pr.appendRouteLink(links, options);
    }

    function addActionButton(options) {
      return pr.appendRouteButton(links, options);
    }

    if (isInRoute || window.selectedPortal || !hasSelectedMapPoint) {
      addActionButton(pr.selectedAddDeleteButtonOptions());
    }

    addActionButton(pr.undoRouteEditButtonOptions());

    addActionLink('Fit', 'fit-route');
    addActionLink(
      pr.state.settings.includeReturnToStart ? 'Unloop' : 'Loop',
      'toggle-loop-back',
      pr.loopBackButtonOptions()
    );
    addActionLink('Menu', 'open-main-menu', pr.mainMenuLinkOptions());

    wrapper.appendChild(links);

    if (pr.renderAddPointModeHint) {
      wrapper.insertAdjacentHTML('beforeend', pr.renderAddPointModeHint());
    }

    if (pr.renderHomePickModeHint) {
      wrapper.insertAdjacentHTML('beforeend', pr.renderHomePickModeHint());
    }

    if (pr.renderCompactRouteStats) {
      wrapper.insertAdjacentHTML('beforeend', pr.renderCompactRouteStats(pr.state.route));
    }
  };

  pr.markRouteStale = function(options) {
    options = options || {};
    var hadRouteState = !!pr.state.route || !!pr.state.routeDirty;
    var hasRouteableStops = pr.getRouteStops().length >= 2;
    var shouldAutoReplot = hasRouteableStops && !options.skipAutoReplot;
    pr.state.routeDirty = hadRouteState || hasRouteableStops;

    if (options.clearRoute && !shouldAutoReplot) {
      pr.state.route = null;
      pr.clearRouteLine();
    } else if (pr.state.route && pr.state.route.legs) {
      pr.refreshRouteTravelEstimates(pr.state.route);
    }

    if (pr.applyRouteLineStyle) pr.applyRouteLineStyle();
    pr.saveRoute();
    if (shouldAutoReplot) pr.queueAutoReplot();
  };

  pr.queueAutoReplot = function() {
    if (!pr.calculateRoute || !window.setTimeout) return;
    if (pr.state.autoReplotTimer) window.clearTimeout(pr.state.autoReplotTimer);

    pr.state.autoReplotTimer = window.setTimeout(function() {
      pr.state.autoReplotTimer = null;
      if (!pr.state.routeDirty) return;
      pr.calculateRoute();
    }, 0);
  };

  pr.queueRouteCalculationIfReady = function() {
    if (pr.getRouteStops().length < 2) return false;
    pr.state.routeDirty = true;
    pr.saveRoute();
    pr.queueAutoReplot();
    return true;
  };

  pr.markRouteCurrent = function() {
    pr.state.routeDirty = false;
    if (pr.applyRouteLineStyle) pr.applyRouteLineStyle();
    pr.saveRoute();
  };

  pr.isManagedStartStop = function(stop) {
    return !!(stop && stop.startOnMe && pr.state.settings.startOnCurrentLocation);
  };

  pr.isManagedStartIndex = function(index) {
    return pr.isManagedStartStop(pr.state.stops[index]);
  };

  pr.findStartOnMeIndex = function() {
    for (var i = 0; i < pr.state.stops.length; i++) {
      if (pr.state.stops[i] && pr.state.stops[i].startOnMe) return i;
    }
    return -1;
  };

  pr.makeLoopStop = function() {
    if (!pr.state.settings.includeReturnToStart) return null;
    if (!pr.state.stops.length) return null;

    var first = pr.state.stops[0];
    return {
      guid: first.guid || null,
      type: 'loop',
      title: first.title || 'Start',
      lat: first.lat,
      lng: first.lng,
      stopMinutes: 0,
      generatedLoop: true,
      linkedStopIndex: 0,
      linkedStopGuid: first.guid || null
    };
  };

  pr.getRouteStops = function() {
    var stops = pr.state.stops.slice();
    var loopStop = pr.makeLoopStop();
    if (loopStop && stops.length > 1) stops.push(loopStop);
    return stops;
  };

  pr.getRouteStop = function(index) {
    return pr.getRouteStops()[index] || null;
  };

  pr.currentLocationStopFromPosition = function(position, options) {
    options = options || {};
    var coords = position && position.coords;
    if (!coords || typeof coords.latitude !== 'number' || typeof coords.longitude !== 'number') return null;

    return {
      guid: null,
      type: 'map',
      title: options.title || 'Current location',
      lat: coords.latitude,
      lng: coords.longitude,
      stopMinutes: options.startOnMe ? 0 : null,
      startOnMe: !!options.startOnMe,
      accuracy: typeof coords.accuracy === 'number' ? coords.accuracy : null,
      updatedAt: new Date().toISOString()
    };
  };

  pr.getCurrentLocation = function(onSuccess, onError) {
    if (!window.navigator || !navigator.geolocation) {
      if (onError) onError(new Error('Geolocation is not available.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      function(position) { onSuccess(position); },
      function(error) {
        if (onError) onError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000
      }
    );
  };

  pr.applyStartOnCurrentLocation = function(position, options) {
    options = options || {};
    var stop = pr.currentLocationStopFromPosition(position, { startOnMe: true });
    if (!stop) {
      pr.showMessage('Could not read current location.');
      return false;
    }

    if (!options.skipUndo && pr.pushUndoSnapshot) pr.pushUndoSnapshot('update start location');

    var selectedIndex = pr.state.selectedMapPointIndex;
    var selectedStop = typeof selectedIndex === 'number' ? pr.state.stops[selectedIndex] : null;
    var existingIndex = pr.findStartOnMeIndex();
    var existingStop = existingIndex >= 0 ? pr.state.stops[existingIndex] : null;

    if (existingStop) {
      Object.assign(existingStop, stop);
      pr.state.stops.splice(existingIndex, 1);
      pr.state.stops.unshift(existingStop);
    } else {
      pr.state.stops.unshift(stop);
    }

    if (selectedStop) {
      var newSelectedIndex = pr.state.stops.indexOf(selectedStop);
      pr.state.selectedMapPointIndex = newSelectedIndex >= 0 ? newSelectedIndex : null;
    }

    pr.markRouteStale({ clearRoute: true });
    pr.saveStops();
    pr.redrawLabels();
    pr.renderPanel();
    if (pr.state.pointsPanelOpen) pr.renderPointsPanel();
    pr.renderMiniControl();
    if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
    return true;
  };

  pr.setStartOnCurrentLocation = function(enabled) {
    enabled = !!enabled;
    if (enabled !== !!pr.state.settings.startOnCurrentLocation && pr.pushUndoSnapshot) {
      pr.pushUndoSnapshot(enabled ? 'enable start on me' : 'disable start on me');
    }

    pr.state.settings.startOnCurrentLocation = enabled;
    pr.saveSettings();

    if (!enabled) {
      pr.renderPanel();
      return;
    }

    pr.showMessage('Getting current location...');
    pr.getCurrentLocation(
      function(position) {
        if (!pr.state.settings.startOnCurrentLocation) return;
        if (pr.applyStartOnCurrentLocation(position, { skipUndo: true })) {
          pr.showMessage('Start set to current location.');
        }
      },
      function(error) {
        pr.state.settings.startOnCurrentLocation = false;
        pr.saveSettings();
        pr.renderPanel();
        pr.showMessage('Could not get current location' + (error && error.message ? ': ' + error.message : '.'));
      }
    );
  };

  pr.setLoopBackToStart = function(enabled) {
    enabled = !!enabled;
    if (enabled !== !!pr.state.settings.includeReturnToStart && pr.pushUndoSnapshot) {
      pr.pushUndoSnapshot(enabled ? 'enable loop' : 'disable loop');
    }

    pr.state.settings.includeReturnToStart = enabled;
    pr.saveSettings();
    pr.markRouteStale({ clearRoute: true });
    pr.redrawLabels();
    pr.renderPanel();
    pr.renderMiniControl();
    if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
  };

  pr.toggleLoopBackToStart = function() {
    pr.setLoopBackToStart(!pr.state.settings.includeReturnToStart);
  };

  pr.addCurrentLocation = function() {
    pr.showMessage('Getting current location...');
    pr.getCurrentLocation(
      function(position) {
        var stop = pr.currentLocationStopFromPosition(position, { title: 'Current location' });
        if (!stop) {
          pr.showMessage('Could not read current location.');
          return;
        }
        delete stop.startOnMe;
        pr.addStop(stop);
        pr.showMessage('Current location added.');
      },
      function(error) {
        pr.showMessage('Could not get current location' + (error && error.message ? ': ' + error.message : '.'));
      }
    );
  };


  pr.parseHomeCoordinate = function(value, min, max) {
    var number = Number(String(value == null ? '' : value).trim());
    if (!isFinite(number) || number < min || number > max) return null;
    return number;
  };

  pr.getHomeLocation = function() {
    var lat = pr.parseHomeCoordinate(pr.state.settings.homeLat, -90, 90);
    var lng = pr.parseHomeCoordinate(pr.state.settings.homeLng, -180, 180);
    if (lat === null || lng === null) return null;

    return {
      type: 'map',
      title: pr.state.settings.homeTitle || pr.DEFAULT_SETTINGS.homeTitle,
      lat: lat,
      lng: lng,
      stopMinutes: null,
      home: true
    };
  };

  pr.updateHomeWaypoint = function(home) {
    if (!home || typeof home.lat !== 'number' || typeof home.lng !== 'number') return false;

    var existingIndex = pr.state.stops.findIndex(function(stop) {
      return stop && stop.type === 'map' && !!stop.home;
    });

    if (existingIndex < 0) {
      pr.addStop(home);
      return true;
    }

    if (pr.pushUndoSnapshot) pr.pushUndoSnapshot('update Home waypoint');

    pr.state.stops[existingIndex].title = home.title || pr.DEFAULT_SETTINGS.homeTitle;
    pr.state.stops[existingIndex].lat = home.lat;
    pr.state.stops[existingIndex].lng = home.lng;
    pr.state.stops[existingIndex].stopMinutes = typeof home.stopMinutes === 'number' ? home.stopMinutes : null;
    pr.state.stops[existingIndex].home = true;
    pr.state.selectedMapPointIndex = existingIndex;
    if (pr.clearIitcPortalSelection) pr.clearIitcPortalSelection();

    pr.markRouteStale({ clearRoute: true });
    pr.saveStops();
    pr.redrawLabels();
    pr.renderPanel();
    pr.renderMiniControl();
    if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
    return true;
  };

  pr.setHomeLocation = function(lat, lng, title, options) {
    options = options || {};
    lat = pr.parseHomeCoordinate(lat, -90, 90);
    lng = pr.parseHomeCoordinate(lng, -180, 180);
    if (lat === null || lng === null) {
      pr.showMessage('Invalid home location.');
      return false;
    }

    pr.state.settings.homeLat = String(lat);
    pr.state.settings.homeLng = String(lng);
    pr.state.settings.homeTitle = String(title || pr.state.settings.homeTitle || pr.DEFAULT_SETTINGS.homeTitle).trim() || pr.DEFAULT_SETTINGS.homeTitle;
    pr.saveSettings();

    if (options.addWaypoint) {
      pr.updateHomeWaypoint(pr.getHomeLocation());
    } else {
      pr.renderPanel();
      if (pr.state.pointsPanelOpen) pr.renderPointsPanel();
    }

    pr.showMessage(options.addWaypoint ? 'Home saved and added to route.' : 'Home location saved.');
    return true;
  };

  pr.setHomeToCurrentLocation = function() {
    var selectedPortal = pr.portalToStop && pr.portalToStop(window.selectedPortal);
    if (selectedPortal) {
      pr.cancelHomePickMode({ silent: true });
      pr.cancelAddPointMode({ silent: true });
      pr.setHomeLocation(selectedPortal.lat, selectedPortal.lng, selectedPortal.title || pr.DEFAULT_SETTINGS.homeTitle, { addWaypoint: true });
      return;
    }

    pr.setHomePickMode(true);
  };

  pr.cancelHomePickMode = function(options) {
    options = options || {};
    if (!pr.state.homePickMode) return false;
    pr.state.homePickMode = false;
    pr.syncAddPointModeUi();
    if (!options.silent) pr.showMessage(options.message || 'Set Home canceled.');
    return true;
  };

  pr.setHomePickMode = function(enabled, options) {
    options = options || {};
    enabled = !!enabled;
    if (enabled === !!pr.state.homePickMode) return false;

    pr.state.homePickMode = enabled;
    if (enabled && pr.state.addPointMode) pr.state.addPointMode = false;
    pr.syncAddPointModeUi();
    if (!options.silent) {
      pr.showMessage(enabled ? 'Click or tap the map to set Home. Select a portal first to use that portal instead.' : 'Set Home canceled.');
    }
    return true;
  };

  pr.addHomeLocation = function() {
    var home = pr.getHomeLocation();
    if (!home) {
      pr.showMessage('Set Home first.');
      return;
    }

    pr.addStop(home);
    pr.showMessage('Home added.');
  };

  pr.smartAdd = function() {
    if (window.selectedPortal && pr.portalToStop && pr.portalToStop(window.selectedPortal)) {
      pr.setAddPointMode(false, { silent: true });
      pr.addSelectedPortal();
      return;
    }

    pr.setAddPointMode(!pr.state.addPointMode);
  };

  pr.stopTitleNeedsHydration = function(title) {
    var cleanTitle = String(title == null ? '' : title).trim();
    return !cleanTitle ||
      cleanTitle.toLowerCase().indexOf('unknown') === 0 ||
      cleanTitle === 'Unnamed portal' ||
      /^Portal \d+$/.test(cleanTitle);
  };

  pr.portalTitleFromGuid = function(guid) {
    var portal = guid && window.portals && window.portals[guid];
    var data = portal && portal.options && portal.options.data ? portal.options.data : null;
    if (!data) return null;
    return data.title || data.name || null;
  };

  pr.portalDetailTitle = function(details) {
    if (!details) return null;
    var data = details.details || details.portalDetails || details.portalData || details;
    return data.title || data.name || null;
  };

  pr.normalizeRoutingProvider = function(provider) {
    if (provider === pr.ROUTING_PROVIDERS.ors) return provider;
    return pr.ROUTING_PROVIDERS.google;
  };

  pr.getRoutingProvider = function() {
    return pr.normalizeRoutingProvider(pr.state.settings.routingProvider);
  };

  pr.getRoutingProviderLabel = function(provider) {
    provider = pr.normalizeRoutingProvider(provider);
    if (provider === pr.ROUTING_PROVIDERS.ors) return 'OpenRouteService beta';
    return 'Google';
  };

  pr.normalizeTravelMode = function(mode) {
    if (mode === pr.TRAVEL_MODES.bike || mode === pr.TRAVEL_MODES.walk) return mode;
    return pr.TRAVEL_MODES.drive;
  };

  pr.getTravelMode = function() {
    return pr.normalizeTravelMode(pr.state.settings.defaultTravelMode);
  };

  pr.getTravelModeLabel = function(mode) {
    mode = pr.normalizeTravelMode(mode);
    if (mode === pr.TRAVEL_MODES.bike) return 'Bike';
    if (mode === pr.TRAVEL_MODES.walk) return 'Walk';
    return 'Drive';
  };

  pr.getTravelSpeedMph = function(mode) {
    mode = pr.normalizeTravelMode(mode);
    if (mode === pr.TRAVEL_MODES.bike) return Number(pr.state.settings.bikeSpeedMph) || pr.DEFAULT_SETTINGS.bikeSpeedMph;
    if (mode === pr.TRAVEL_MODES.walk) return Number(pr.state.settings.walkSpeedMph) || pr.DEFAULT_SETTINGS.walkSpeedMph;
    return Number(pr.state.settings.driveSpeedMph) || pr.DEFAULT_SETTINGS.driveSpeedMph;
  };

  pr.travelSecondsForDistance = function(distanceMeters, mode) {
    var miles = Math.max(0, Number(distanceMeters || 0)) / 1609.344;
    var mph = Math.max(0.1, pr.getTravelSpeedMph(mode));
    return miles / mph * 3600;
  };

  pr.refreshRouteTravelEstimates = function(route) {
    route = route || pr.state.route;
    if (!route || !Array.isArray(route.legs)) return route;

    var mode = pr.getTravelMode();
    route.legs.forEach(function(leg) {
      leg.travelMode = mode;
      leg.durationSeconds = pr.travelSecondsForDistance(leg.distanceMeters, mode);
      leg.durationText = pr.formatDuration(leg.durationSeconds);
      leg.durationSource = 'speed';
    });

    route.totals = pr.calculateTotals(route.legs);
    return route;
  };

  pr.applyPortalTitleFromDetails = function(guid, details) {
    var title = pr.portalDetailTitle(details);
    var changed = false;

    if (!guid || pr.stopTitleNeedsHydration(title)) return false;

    pr.state.stops.forEach(function(stop) {
      if (!stop || stop.guid !== guid) return;
      if (!pr.stopTitleNeedsHydration(stop.title)) return;

      stop.title = String(title).trim();
      changed = true;
    });

    return changed;
  };

  pr.requestPortalDetailTitle = function(guid, onDone) {
    var existingTitle = pr.portalTitleFromGuid(guid);
    if (existingTitle) {
      onDone(guid, { title: existingTitle });
      return;
    }

    if (!window.portalDetail || typeof window.portalDetail.request !== 'function') {
      onDone(guid, null);
      return;
    }

    try {
      var request = window.portalDetail.request(guid);
      if (request && typeof request.done === 'function') {
        request
          .done(function(details) { onDone(guid, details); })
          .fail(function() { onDone(guid, null); });
      } else if (request && typeof request.then === 'function') {
        request.then(
          function(details) { onDone(guid, details); },
          function() { onDone(guid, null); }
        );
      } else {
        onDone(guid, null);
      }
    } catch (e) {
      console.warn('Portal Route: unable to load portal details for ' + guid, e);
      onDone(guid, null);
    }
  };

  pr.hydrateStopTitles = function() {
    var seen = {};
    var guids = pr.state.stops.filter(function(stop) {
      if (!stop || !stop.guid) return false;
      if (!pr.stopTitleNeedsHydration(stop.title)) return false;
      if (seen[stop.guid]) return false;
      seen[stop.guid] = true;
      return true;
    }).map(function(stop) {
      return stop.guid;
    });

    if (!guids.length) return;

    var index = 0;
    var changedCount = 0;
    var finishedCount = 0;
    var maxActive = 2;
    var active = 0;

    pr.showMessage('Loading portal names...');

    var finishOne = function(guid, details) {
      active -= 1;
      finishedCount += 1;

      if (pr.applyPortalTitleFromDetails(guid, details)) {
        changedCount += 1;
        pr.saveStops();
        pr.redrawLabels();
        pr.renderPanel();
        pr.renderMiniControl();
        if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
      }

      if (finishedCount >= guids.length) {
        pr.showMessage(changedCount
          ? 'Loaded names for ' + changedCount + ' portals.'
          : 'No portal names found.');
        return;
      }

      runNext();
    };

    var runNext = function() {
      while (active < maxActive && index < guids.length) {
        var guid = guids[index];
        index += 1;
        active += 1;
        pr.requestPortalDetailTitle(guid, finishOne);
      }
    };

    runNext();
  };

  pr.stopGuidFromData = function(stop) {
    return stop.guid || stop.portalGuid || stop.portal_guid || null;
  };

  pr.stopRawTitleFromData = function(stop) {
    return stop.title || stop.portalTitle || stop.portal_title || stop.name || stop.label || '';
  };

  pr.hydratedStopTitle = function(stop, stopType, index) {
    var rawTitle = pr.stopRawTitleFromData(stop);
    if (!pr.stopTitleNeedsHydration(rawTitle)) return String(rawTitle).trim();

    if (stopType !== 'map') {
      var portalTitle = pr.portalTitleFromGuid(pr.stopGuidFromData(stop));
      if (portalTitle) return portalTitle;
      return typeof index === 'number' ? 'Portal ' + (index + 1) : 'Unnamed portal';
    }

    return typeof index === 'number' ? 'Map point ' + (index + 1) : 'Map point';
  };

  pr.addStop = function(stop) {
    if (!stop || typeof stop.lat !== 'number' || typeof stop.lng !== 'number') return;

    var guid = pr.stopGuidFromData(stop);
    var stopType = stop.type || (guid ? 'portal' : 'map');
    var title = pr.hydratedStopTitle(stop, stopType, pr.state.stops.length);

    if (guid && pr.state.stops.some(function(existing) { return existing.guid === guid; })) {
      pr.showMessage('Already in route: ' + title);
      return;
    }

    if (pr.pushUndoSnapshot) pr.pushUndoSnapshot('add waypoint');

    pr.state.stops.push({
      guid: guid,
      type: stopType,
      title: title,
      lat: stop.lat,
      lng: stop.lng,
      stopMinutes: typeof stop.stopMinutes === 'number' ? stop.stopMinutes : null,
      startOnMe: !!stop.startOnMe,
      accuracy: typeof stop.accuracy === 'number' ? stop.accuracy : null,
      updatedAt: stop.updatedAt || null,
      home: stopType === 'map' && !!stop.home
    });

    if (stopType === 'map') {
      pr.state.selectedMapPointIndex = pr.state.stops.length - 1;
      if (pr.clearIitcPortalSelection) pr.clearIitcPortalSelection();
    }

    pr.markRouteStale({ clearRoute: true });
    pr.saveStops();
    pr.redrawLabels();
    pr.renderPanel();
    pr.renderMiniControl();
    if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
  };

  pr.nextMapPointTitle = function() {
    var count = pr.state.stops.filter(function(stop) {
      return stop && stop.type === 'map' && !stop.startOnMe;
    }).length + 1;
    return 'Map point ' + count;
  };

  pr.addMapPointAtLatLng = function(latlng) {
    if (!latlng || typeof latlng.lat !== 'number' || typeof latlng.lng !== 'number') return;

    pr.addStop({
      type: 'map',
      title: pr.nextMapPointTitle(),
      lat: latlng.lat,
      lng: latlng.lng
    });
  };

  pr.updateMapPointPosition = function(index, latlng, options) {
    options = options || {};
    if (index < 0 || index >= pr.state.stops.length) return false;
    if (!latlng || typeof latlng.lat !== 'number' || typeof latlng.lng !== 'number') return false;

    var stop = pr.state.stops[index];
    if (!stop || stop.type !== 'map') return false;
    if (pr.isManagedStartStop(stop)) return false;

    if (!options.live && !options.skipUndo && pr.pushUndoSnapshot) pr.pushUndoSnapshot('move waypoint');

    stop.lat = latlng.lat;
    stop.lng = latlng.lng;

    if (options.live) return true;

    pr.state.selectedMapPointIndex = index;
    pr.markRouteStale();
    pr.saveStops();
    pr.redrawLabels();
    pr.renderPanel();
    pr.renderMiniControl();
    if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
    return true;
  };

  pr.replaceStopLocation = function(index, replacement) {
    if (index < 0 || index >= pr.state.stops.length) return false;
    if (!replacement || typeof replacement.lat !== 'number' || typeof replacement.lng !== 'number') return false;

    var existing = pr.state.stops[index];
    if (!existing || pr.isManagedStartStop(existing)) return false;

    var guid = pr.stopGuidFromData(replacement);
    if (guid && pr.state.stops.some(function(stop, stopIndex) {
      return stopIndex !== index && stop && stop.guid === guid;
    })) {
      pr.showMessage('Already in route: ' + pr.hydratedStopTitle(replacement, 'portal', index));
      return false;
    }

    var stopType = replacement.type || (guid ? 'portal' : 'map');
    var title = pr.hydratedStopTitle(replacement, stopType, index);

    if (pr.pushUndoSnapshot) pr.pushUndoSnapshot('move waypoint');

    pr.state.stops[index] = Object.assign({}, existing, {
      guid: guid,
      type: stopType,
      title: title,
      lat: replacement.lat,
      lng: replacement.lng,
      startOnMe: false,
      accuracy: typeof replacement.accuracy === 'number' ? replacement.accuracy : null,
      updatedAt: replacement.updatedAt || null,
      home: stopType === 'map' && !!(replacement.home || existing.home)
    });

    if (stopType === 'map') {
      pr.state.selectedMapPointIndex = index;
      if (pr.clearIitcPortalSelection) pr.clearIitcPortalSelection();
    } else {
      pr.state.selectedMapPointIndex = null;
      window.selectedPortal = guid;
      if (typeof window.renderPortalDetails === 'function') {
        try {
          window.renderPortalDetails(guid);
        } catch (e) {
          console.warn('Portal Route: unable to render replacement portal details', e);
        }
      }
    }

    pr.markRouteStale({ clearRoute: true });
    pr.saveStops();
    pr.redrawLabels();
    pr.renderPanel();
    pr.renderMiniControl();
    if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
    return true;
  };

  pr.syncAddPointModeUi = function() {
    var mapContainer = window.map && window.map.getContainer ? window.map.getContainer() : null;
    if (mapContainer && mapContainer.classList) {
      mapContainer.classList.toggle('portal-route-add-point-mode', !!pr.state.addPointMode);
      mapContainer.classList.toggle('portal-route-home-pick-mode', !!pr.state.homePickMode);
    }
    pr.renderPanel();
    pr.renderMiniControl();
    if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
  };

  pr.cancelAddPointMode = function(options) {
    options = options || {};
    if (!pr.state.addPointMode) return false;
    pr.state.addPointMode = false;
    pr.syncAddPointModeUi();
    if (!options.silent) pr.showMessage(options.message || 'Add point canceled.');
    return true;
  };

  pr.setAddPointMode = function(enabled, options) {
    options = options || {};
    enabled = !!enabled;
    if (enabled === !!pr.state.addPointMode) return false;

    pr.state.addPointMode = enabled;
    if (enabled && pr.state.homePickMode) pr.state.homePickMode = false;
    pr.syncAddPointModeUi();
    if (!options.silent) {
      pr.showMessage(enabled ? 'Click or tap the map to add a point. Press Add again or Esc to cancel.' : 'Add point canceled.');
    }
    return true;
  };

  pr.removeStop = function(index) {
    if (index < 0 || index >= pr.state.stops.length) return;
    if (pr.isManagedStartIndex(index)) {
      pr.showMessage('Untick Start on me before removing that point.');
      return;
    }

    if (pr.pushUndoSnapshot) pr.pushUndoSnapshot('delete waypoint');

    if (pr.state.selectedMapPointIndex === index) {
      pr.state.selectedMapPointIndex = null;
    } else if (pr.state.selectedMapPointIndex > index) {
      pr.state.selectedMapPointIndex -= 1;
    }

    pr.state.stops.splice(index, 1);
    pr.markRouteStale({ clearRoute: true });
    pr.saveStops();
    pr.redrawLabels();
    pr.renderPanel();
    pr.renderMiniControl();
    if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
  };

  pr.clearStops = function() {
    var restoreStartOnMe = !!pr.state.settings.startOnCurrentLocation;
    if ((pr.state.stops.length || pr.state.route || pr.state.routeDirty) && pr.pushUndoSnapshot) {
      pr.pushUndoSnapshot('clear route');
    }

    pr.state.stops = [];
    pr.state.route = null;
    pr.state.routeDirty = false;
    pr.state.selectedMapPointIndex = null;
    pr.state.activeRouteId = null;
    pr.saveStops();
    pr.saveRoute();
    pr.clearRouteLine();
    pr.redrawLabels();
    pr.renderPanel();
    pr.renderMiniControl();
    if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();

    if (restoreStartOnMe) {
      pr.setStartOnCurrentLocation(true);
    }
  };

  pr.clearRouteWithConfirm = function() {
    if (pr.state.stops.length && window.confirm && !window.confirm('Clear all points from the route?')) return;
    pr.clearStops();
  };

  pr.reverseRoute = function() {
    if (pr.state.stops.length < 2) {
      pr.showMessage('Add at least two waypoints to reverse.');
      return;
    }

    if (pr.pushUndoSnapshot) pr.pushUndoSnapshot('reverse route');

    var selectedStop = typeof pr.state.selectedMapPointIndex === 'number' ? pr.state.stops[pr.state.selectedMapPointIndex] : null;
    var pinnedStart = pr.isManagedStartIndex(0) ? pr.state.stops.slice(0, 1) : [];
    var routeStops = pr.state.stops.slice(pinnedStart.length).reverse();

    pr.state.stops = pinnedStart.concat(routeStops);
    pr.state.selectedMapPointIndex = selectedStop ? pr.state.stops.indexOf(selectedStop) : null;
    if (pr.state.selectedMapPointIndex < 0) pr.state.selectedMapPointIndex = null;

    pr.markRouteStale({ clearRoute: true });
    pr.saveStops();
    pr.redrawLabels();
    pr.renderPanel();
    pr.renderMiniControl();
    if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
    pr.showMessage('Route reversed.');
  };

  pr.renameStop = function(index) {
    if (index < 0 || index >= pr.state.stops.length) return;
    var stop = pr.state.stops[index];
    if (!stop || pr.isManagedStartStop(stop)) return;

    var title = window.prompt ? window.prompt('Waypoint name', stop.title || '') : null;
    if (title === null) return;

    title = String(title).trim();
    if (!title) title = stop.type === 'map' ? pr.nextMapPointTitle() : 'Unnamed portal';

    if (title !== stop.title && pr.pushUndoSnapshot) pr.pushUndoSnapshot('rename waypoint');

    stop.title = title;
    pr.saveStops();
    pr.redrawLabels();
    pr.redrawSegmentTimeLabels();
    pr.renderPanel();
    pr.renderMiniControl();
    if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
  };

  pr.moveStopToEdge = function(index, edge) {
    if (index < 0 || index >= pr.state.stops.length) return;
    if (pr.isManagedStartIndex(index)) return;

    var toIndex = edge === 'end' ? pr.state.stops.length - 1 : 0;
    if (edge === 'start' && pr.state.settings.startOnCurrentLocation) toIndex = 1;
    pr.moveStop(index, toIndex);
  };

  pr.replaceStops = function(stops, options) {
    options = options || {};
    if (!Array.isArray(stops)) return;
    if (!options.skipUndo && pr.pushUndoSnapshot) pr.pushUndoSnapshot('replace route');

    pr.state.stops = [];
    pr.state.route = null;
    pr.state.routeDirty = false;
    pr.state.selectedMapPointIndex = null;
    pr.state.activeRouteId = null;

    stops.forEach(function(stop) {
      if (!stop || typeof stop.lat !== 'number' || typeof stop.lng !== 'number') return;
      var guid = pr.stopGuidFromData(stop);
      var stopType = stop.type || (guid ? 'portal' : 'map');
      pr.state.stops.push({
        guid: guid,
        type: stopType,
        title: pr.hydratedStopTitle(stop, stopType, pr.state.stops.length),
        lat: stop.lat,
        lng: stop.lng,
        stopMinutes: typeof stop.stopMinutes === 'number' ? stop.stopMinutes : null,
        startOnMe: !!stop.startOnMe,
        accuracy: typeof stop.accuracy === 'number' ? stop.accuracy : null,
        updatedAt: stop.updatedAt || null,
        home: stopType === 'map' && !!stop.home
      });
    });

    pr.saveStops();
    pr.saveRoute();
    pr.clearRouteLine();
    pr.redrawLabels();
    if (options.openPanel || options.openPointsPanel) {
      pr.state.pointsPanelOpen = true;
    }
    pr.renderPanel();
    pr.renderPointsPanel();
    pr.renderMiniControl();
    if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
    pr.showMessage('Imported ' + pr.state.stops.length + ' stops.');
    pr.hydrateStopTitles();
  };

  pr.moveStop = function(fromIndex, toIndex) {
    if (fromIndex < 0 || fromIndex >= pr.state.stops.length) return;
    if (toIndex < 0 || toIndex >= pr.state.stops.length) return;
    if (fromIndex === toIndex) return;
    if (pr.isManagedStartIndex(fromIndex)) return;
    if (pr.state.settings.startOnCurrentLocation && toIndex === 0) toIndex = 1;
    if (fromIndex === toIndex) return;

    if (pr.pushUndoSnapshot) pr.pushUndoSnapshot('move waypoint');

    var selectedIndex = pr.state.selectedMapPointIndex;
    var item = pr.state.stops.splice(fromIndex, 1)[0];
    pr.state.stops.splice(toIndex, 0, item);

    if (selectedIndex === fromIndex) {
      pr.state.selectedMapPointIndex = toIndex;
    } else if (selectedIndex !== null && selectedIndex !== undefined) {
      if (fromIndex < selectedIndex && selectedIndex <= toIndex) {
        pr.state.selectedMapPointIndex -= 1;
      } else if (toIndex <= selectedIndex && selectedIndex < fromIndex) {
        pr.state.selectedMapPointIndex += 1;
      }
    }

    pr.markRouteStale({ clearRoute: true });
    pr.saveStops();
    pr.redrawLabels();
    pr.renderPanel();
    pr.renderMiniControl();
    if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
  };


  pr.setStopTitle = function(index, title) {
    if (index < 0 || index >= pr.state.stops.length) return;

    var stop = pr.state.stops[index];
    if (!stop || stop.type !== 'map') return;
    if (pr.isManagedStartStop(stop)) return;

    var cleanTitle = String(title == null ? '' : title).trim();
    if (!cleanTitle) cleanTitle = pr.nextMapPointTitle();

    if (cleanTitle !== stop.title && pr.pushUndoSnapshot) pr.pushUndoSnapshot('rename waypoint');

    stop.title = cleanTitle;
    pr.saveStops();
    pr.redrawLabels();
    pr.redrawSegmentTimeLabels();
    pr.renderPanel();
  };


  pr.setStopMinutes = function(index, minutes) {
    if (index < 0 || index >= pr.state.stops.length) return;
    if (pr.isManagedStartIndex(index)) return;
    if (typeof minutes !== 'number' || !isFinite(minutes) || minutes < 0) return;

    minutes = Math.round(minutes);
    if (pr.state.stops[index].stopMinutes === minutes) return;
    if (pr.pushUndoSnapshot) pr.pushUndoSnapshot('change wait time');

    pr.state.stops[index].stopMinutes = minutes;
    pr.markRouteStale();
    pr.saveStops();
    pr.renderPanel();
  };

  pr.parseDurationMinutes = function(text) {
    var match = String(text == null ? '' : text).trim().toLowerCase().match(/^(\d+(?:\.\d+)?)\s*([mhd]?)$/);
    if (!match) return null;

    var value = Number(match[1]);
    var unit = match[2] || 'm';

    if (!isFinite(value) || value < 0) return null;

    if (unit === 'm') return Math.round(value);
    if (unit === 'h') return Math.round(value * 60);
    if (unit === 'd') return Math.round(value * 24 * 60);

    return null;
  };

  pr.formatDurationInput = function(minutes) {
    minutes = Math.max(0, Math.round(Number(minutes || 0)));

    if (minutes && minutes % 1440 === 0) return (minutes / 1440) + 'd';
    if (minutes && minutes % 60 === 0) return (minutes / 60) + 'h';
    return minutes + 'm';
  };

  pr.selectStopPortal = function(index, center) {
    var stop = pr.getRouteStop(index);
    if (!stop) return;

    if (stop.generatedLoop) {
      if (center && window.map) {
        window.map.setView([stop.lat, stop.lng], window.map.getZoom());
      }
      pr.showMessage('Loop endpoint returns to the first waypoint.');
      return;
    }

    if (!stop.guid) {
      pr.state.selectedMapPointIndex = index;
      if (pr.clearIitcPortalSelection) pr.clearIitcPortalSelection();
      if (center && window.map) {
        window.map.setView([stop.lat, stop.lng], window.map.getZoom());
      }
      pr.redrawLabels();
      pr.renderPanel();
      pr.renderMiniControl();
      if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
      return;
    }

    pr.state.selectedMapPointIndex = null;

    var portal = window.portals && window.portals[stop.guid];
    if (center && portal && portal.getLatLng && window.map) {
      window.map.setView(portal.getLatLng(), window.map.getZoom());
    }

    if (typeof window.renderPortalDetails === 'function') {
      window.renderPortalDetails(stop.guid);
    } else {
      window.selectedPortal = stop.guid;
    }

    pr.redrawLabels();
    pr.renderPanel();
    pr.renderMiniControl();
    if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
  };


  pr.calculateTotals = function(legs) {
    var driveSeconds = 0;
    var distanceMeters = 0;

    legs.forEach(function(leg) {
      driveSeconds += leg.durationSeconds || 0;
      distanceMeters += leg.distanceMeters || 0;
    });

    var stopSeconds = pr.state.stops.reduce(function(sum, stop) {
      return sum + pr.getEffectiveStopMinutes(stop) * 60;
    }, 0);

    return {
      driveSeconds: driveSeconds,
      stopSeconds: stopSeconds,
      tripSeconds: driveSeconds + stopSeconds,
      distanceMeters: distanceMeters,
      travelMode: pr.getTravelMode(),
      routingProvider: pr.getRoutingProvider()
    };
  };

  pr.getGoogleLatLng = function(stop) {
    return new google.maps.LatLng(stop.lat, stop.lng);
  };

  pr.googleDirectionsTravelMode = function() {
    var mode = pr.getTravelMode();
    if (!window.google || !google.maps || !google.maps.TravelMode) return null;
    if (mode === pr.TRAVEL_MODES.bike && google.maps.TravelMode.BICYCLING) return google.maps.TravelMode.BICYCLING;
    if (mode === pr.TRAVEL_MODES.walk && google.maps.TravelMode.WALKING) return google.maps.TravelMode.WALKING;
    return google.maps.TravelMode.DRIVING;
  };

  pr.calculateGoogleRoute = function() {
    var stops = pr.getRouteStops();
    if (stops.length < 2) {
      pr.showMessage('Add at least two waypoints to calculate a route.');
      return;
    }

    if (!window.google || !google.maps || !google.maps.DirectionsService) {
      pr.showMessage('Google Maps DirectionsService is not available in this IITC session.');
      return;
    }

    var origin = stops[0];
    var destination = stops[stops.length - 1];
    var waypoints = stops.slice(1, -1).map(function(stop) {
      return { location: pr.getGoogleLatLng(stop), stopover: true };
    });

    var service = new google.maps.DirectionsService();
    var request = {
      origin: pr.getGoogleLatLng(origin),
      destination: pr.getGoogleLatLng(destination),
      waypoints: waypoints,
      optimizeWaypoints: false,
      travelMode: pr.googleDirectionsTravelMode()
    };

    pr.setBusy(true);
    service.route(request, function(result, status) {
      pr.setBusy(false);

      if (status !== google.maps.DirectionsStatus.OK) {
        pr.showMessage('Route calculation failed: ' + status);
        return;
      }

      var route = result.routes && result.routes[0];
      if (!route) {
        pr.showMessage('Route calculation returned no route.');
        return;
      }

      var legs = route.legs.map(function(leg, index) {
        var fromStop = stops[index];
        var toStop = stops[index + 1];
        var legPath = [];

        if (leg.steps) {
          leg.steps.forEach(function(step) {
            if (step.path) {
              step.path.forEach(function(point) {
                legPath.push({ lat: point.lat(), lng: point.lng() });
              });
            }
          });
        }

        return {
          fromIndex: index,
          toIndex: index + 1,
          fromLabel: fromStop ? fromStop.title : 'Stop ' + (index + 1),
          toLabel: toStop ? toStop.title : 'Stop ' + (index + 2),
          distanceMeters: leg.distance ? leg.distance.value : 0,
          durationSeconds: leg.duration ? leg.duration.value : 0,
          distanceText: leg.distance ? leg.distance.text : '',
          durationText: leg.duration ? leg.duration.text : '',
          googleDurationSeconds: leg.duration ? leg.duration.value : 0,
          googleDurationText: leg.duration ? leg.duration.text : '',
          path: legPath
        };
      });

      var path = [];
      if (route.overview_path) {
        path = route.overview_path.map(function(point) {
          return L.latLng(point.lat(), point.lng());
        });
      }

      pr.state.route = {
        providerId: pr.ROUTING_PROVIDERS.google,
        providerLabel: pr.getRoutingProviderLabel(pr.ROUTING_PROVIDERS.google),
        travelMode: pr.getTravelMode(),
        legs: legs,
        totals: pr.calculateTotals(legs),
        path: path.map(function(point) {
          return { lat: point.lat, lng: point.lng };
        })
      };
      pr.refreshRouteTravelEstimates(pr.state.route);
      pr.markRouteCurrent();

      pr.drawRoutePath(path);
      pr.renderPanel();
      pr.renderMiniControl();
      if (pr.state.pointsPanelOpen) pr.renderPointsPanel();
      if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
    });
  };

  pr.ORS_PROFILES = {
    drive: 'driving-car',
    bike: 'cycling-regular',
    walk: 'foot-walking'
  };

  pr.orsProfileForTravelMode = function(mode) {
    mode = pr.normalizeTravelMode(mode);
    return pr.ORS_PROFILES[mode] || pr.ORS_PROFILES.drive;
  };

  pr.getOrsBaseUrl = function() {
    return String(pr.state.settings.orsBaseUrl || pr.DEFAULT_SETTINGS.orsBaseUrl || '').trim().replace(/\/+$/, '');
  };

  pr.getOrsApiKey = function() {
    return String(pr.state.settings.orsApiKey || '').trim();
  };

  pr.orsRouteUrl = function(profile) {
    return pr.getOrsBaseUrl() + '/v2/directions/' + encodeURIComponent(profile) + '/geojson';
  };

  pr.orsErrorMessage = function(data, status) {
    if (data && data.error && data.error.message) return data.error.message;
    if (data && data.error && data.error.code) return 'OpenRouteService error ' + data.error.code;
    if (data && data.message) return data.message;
    if (status) return 'OpenRouteService request failed: HTTP ' + status;
    return 'OpenRouteService request failed.';
  };

  pr.orsPathDistanceMeters = function(points) {
    if (!points || points.length < 2 || !window.L) return 0;

    var distance = 0;
    for (var i = 1; i < points.length; i++) {
      distance += L.latLng(points[i - 1].lat, points[i - 1].lng).distanceTo(L.latLng(points[i].lat, points[i].lng));
    }
    return distance;
  };

  pr.orsLegPath = function(path, steps) {
    if (!path || !path.length || !steps || !steps.length) return [];

    var start = null;
    var end = null;
    steps.forEach(function(step) {
      var wayPoints = step && step.way_points;
      if (!Array.isArray(wayPoints) || wayPoints.length < 2) return;
      if (start === null || wayPoints[0] < start) start = wayPoints[0];
      if (end === null || wayPoints[1] > end) end = wayPoints[1];
    });

    if (start === null || end === null || start < 0 || end < start) return [];
    return path.slice(start, end + 1);
  };

  pr.orsFallbackLegDistance = function(stops, index) {
    var fromStop = stops[index];
    var toStop = stops[index + 1];
    if (!fromStop || !toStop || !window.L) return 0;
    return L.latLng(fromStop.lat, fromStop.lng).distanceTo(L.latLng(toStop.lat, toStop.lng));
  };

  pr.routeFromOrsGeoJson = function(data, stops, profile) {
    var feature = data && data.features && data.features[0];
    var properties = feature && feature.properties ? feature.properties : {};
    var geometry = feature && feature.geometry ? feature.geometry : {};
    var coordinates = Array.isArray(geometry.coordinates) ? geometry.coordinates : [];
    var path = coordinates.map(function(coord) {
      return { lat: Number(coord[1]), lng: Number(coord[0]) };
    }).filter(function(point) {
      return isFinite(point.lat) && isFinite(point.lng);
    });

    var segments = Array.isArray(properties.segments) ? properties.segments : [];
    var legs = [];

    for (var i = 0; i < stops.length - 1; i++) {
      var fromStop = stops[i];
      var toStop = stops[i + 1];
      var segment = segments[i] || {};
      var segmentDistance = Number(segment.distance);
      var segmentDuration = Number(segment.duration);
      var legPath = pr.orsLegPath(path, segment.steps);

      if (!isFinite(segmentDistance) || segmentDistance <= 0) {
        segmentDistance = legPath.length > 1 ? pr.orsPathDistanceMeters(legPath) : pr.orsFallbackLegDistance(stops, i);
      }

      legs.push({
        fromIndex: i,
        toIndex: i + 1,
        fromLabel: fromStop ? fromStop.title : 'Stop ' + (i + 1),
        toLabel: toStop ? toStop.title : 'Stop ' + (i + 2),
        distanceMeters: segmentDistance,
        durationSeconds: isFinite(segmentDuration) && segmentDuration > 0 ? segmentDuration : 0,
        distanceText: pr.formatDistance(segmentDistance),
        durationText: isFinite(segmentDuration) && segmentDuration > 0 ? pr.formatDuration(segmentDuration) : '',
        providerDurationSeconds: isFinite(segmentDuration) && segmentDuration > 0 ? segmentDuration : 0,
        providerDurationText: isFinite(segmentDuration) && segmentDuration > 0 ? pr.formatDuration(segmentDuration) : '',
        providerProfile: profile,
        path: legPath
      });
    }

    return {
      providerId: pr.ROUTING_PROVIDERS.ors,
      providerLabel: pr.getRoutingProviderLabel(pr.ROUTING_PROVIDERS.ors),
      providerProfile: profile,
      travelMode: pr.getTravelMode(),
      legs: legs,
      totals: pr.calculateTotals(legs),
      path: path
    };
  };

  pr.calculateOrsRoute = function() {
    var stops = pr.getRouteStops();
    if (stops.length < 2) {
      pr.showMessage('Add at least two waypoints to calculate a route.');
      return;
    }

    if (!window.fetch) {
      pr.showMessage('OpenRouteService routing needs browser fetch support.');
      return;
    }

    var apiKey = pr.getOrsApiKey();
    var baseUrl = pr.getOrsBaseUrl();
    if (!baseUrl) {
      pr.showMessage('Set an OpenRouteService URL first.');
      return;
    }
    if (!apiKey && baseUrl.indexOf('api.openrouteservice.org') !== -1) {
      pr.showMessage('Set an OpenRouteService API key first.');
      return;
    }

    var profile = pr.orsProfileForTravelMode(pr.getTravelMode());
    var body = {
      coordinates: stops.map(function(stop) {
        return [Number(stop.lng), Number(stop.lat)];
      }),
      instructions: true,
      geometry: true,
      units: 'm'
    };

    var headers = {
      'Accept': 'application/geo+json, application/json',
      'Content-Type': 'application/json'
    };
    if (apiKey) headers.Authorization = apiKey;

    pr.setBusy(true);
    fetch(pr.orsRouteUrl(profile), {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    }).then(function(response) {
      return response.text().then(function(text) {
        var data = null;
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (e) {
            data = { message: text };
          }
        }
        if (!response.ok) throw new Error(pr.orsErrorMessage(data, response.status));
        return data;
      });
    }).then(function(data) {
      var route = pr.routeFromOrsGeoJson(data, stops, profile);
      if (!route.path || route.path.length < 2 || !route.legs.length) {
        pr.showMessage('OpenRouteService returned no usable route.');
        return;
      }

      pr.state.route = route;
      pr.refreshRouteTravelEstimates(pr.state.route);
      pr.markRouteCurrent();

      var path = pr.state.route.path.map(function(point) {
        return L.latLng(point.lat, point.lng);
      });
      pr.drawRoutePath(path);
      pr.renderPanel();
      pr.renderMiniControl();
      if (pr.state.pointsPanelOpen) pr.renderPointsPanel();
      if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
    }, function(error) {
      pr.showMessage(error && error.message ? error.message : 'OpenRouteService route calculation failed.');
    }).then(function() {
      pr.setBusy(false);
    });
  };

  pr.calculateRoute = function() {
    var provider = pr.getRoutingProvider();

    if (provider === pr.ROUTING_PROVIDERS.ors) {
      if (pr.calculateOrsRoute) {
        pr.calculateOrsRoute();
        return;
      }

      pr.showMessage('OpenRouteService routing is not available in this build.');
      return;
    }

    pr.calculateGoogleRoute();
  };

  pr.routeOverlayTarget = function() {
    if (pr.layerGroup) return pr.layerGroup;
    return window.map;
  };

  pr.ensureLayers = function() {
    var target = pr.routeOverlayTarget();

    if (!pr.state.layers.labels) {
      pr.state.layers.labels = L.layerGroup().addTo(target);
    }

    if (!pr.state.layers.segmentLabels) {
      pr.state.layers.segmentLabels = L.layerGroup().addTo(target);
    }
  };

  pr.clearLabels = function() {
    if (pr.state.layers.labels) {
      pr.state.layers.labels.clearLayers();
    }
  };

  pr.clearSegmentTimeLabels = function() {
    if (pr.state.layers.segmentLabels) {
      pr.state.layers.segmentLabels.clearLayers();
    }
  };

  pr.clearRouteLine = function() {
    if (pr.state.layers.routeLine) {
      var owner = pr.routeOverlayTarget();
      if (owner && owner.hasLayer && owner.hasLayer(pr.state.layers.routeLine)) {
        owner.removeLayer(pr.state.layers.routeLine);
      } else if (window.map && window.map.hasLayer && window.map.hasLayer(pr.state.layers.routeLine)) {
        window.map.removeLayer(pr.state.layers.routeLine);
      }
      pr.state.layers.routeLine = null;
    }

    pr.clearSegmentTimeLabels();
  };

  pr.portalAtLatLng = function(latlng, excludeIndex) {
    if (!window.map || !window.L || !latlng) return null;

    var dropPoint = window.map.latLngToLayerPoint(latlng);
    var best = null;
    var maxDistance = 28;

    Object.keys(window.portals || {}).forEach(function(guid) {
      var stop = excludeIndex >= 0 ? pr.state.stops[excludeIndex] : null;
      if (stop && stop.guid === guid) return;

      var portal = window.portals[guid];
      if (!portal || !portal.getLatLng) return;

      var point = window.map.latLngToLayerPoint(portal.getLatLng());
      var distance = point.distanceTo(dropPoint);
      if (distance <= maxDistance && (!best || distance < best.distance)) {
        best = {
          distance: distance,
          guid: guid
        };
      }
    });

    if (!best) return null;
    return pr.portalToStop(best.guid);
  };

  pr.mapReplacementStop = function(index, latlng) {
    var portalStop = pr.portalAtLatLng(latlng, index);
    if (portalStop) return portalStop;

    var existing = pr.state.stops[index] || {};
    return {
      type: 'map',
      title: existing.type === 'map' && existing.title ? existing.title : 'Map point ' + (index + 1),
      lat: latlng.lat,
      lng: latlng.lng,
      home: !!(existing.type === 'map' && existing.home)
    };
  };

  pr.stopMarkerTitle = function(stop, index) {
    return stop.generatedLoop ? 'Loop back to ' + stop.title : (index + 1) + '. ' + stop.title;
  };

  pr.stopLabelClass = function(stop, index, hasLoopStop) {
    var isLoop = !!stop.generatedLoop;
    var isSelected = !isLoop && pr.selectedStopIndex && pr.selectedStopIndex() === index;
    var isMapPoint = stop.type === 'map';
    var isHomePoint = isMapPoint && !!stop.home;
    var canDragRouteStop = !isLoop && !pr.isManagedStartStop(stop);
    var label = index + 1;
    var className = 'portal-route-stop-label';

    if (String(label).length > 2) className += ' portal-route-stop-label-wide';
    if (!isLoop && hasLoopStop && (index === 0 || index === pr.state.stops.length - 1)) {
      className += ' portal-route-stop-label-loop-endpoint';
    }
    if (!isLoop && index === 0) className += ' portal-route-stop-label-start';
    if (!isLoop && pr.state.stops.length > 1 && index === pr.state.stops.length - 1) {
      className += ' portal-route-stop-label-end';
    }
    if (isMapPoint) className += ' portal-route-map-point-label';
    if (isHomePoint) className += ' portal-route-home-point-label';
    if (canDragRouteStop) className += ' portal-route-stop-label-draggable';
    if (isLoop) className += ' portal-route-loop-label';
    if (isSelected) className += ' portal-route-stop-label-selected';

    return className;
  };

  pr.stopMarkerEvent = function(e) {
    var originalEvent = e && e.originalEvent ? e.originalEvent : e;
    if (originalEvent && originalEvent.stopPropagation) originalEvent.stopPropagation();
    if (originalEvent && originalEvent.preventDefault) originalEvent.preventDefault();
  };

  pr.openRouteListForStop = function(index, e) {
    pr.stopMarkerEvent(e);
    pr.selectStopPortal(index, false);
    pr.state.pointsPanelOpen = true;
    pr.renderPointsPanel();
  };

  pr.stopClickHandler = function(index) {
    var clickTimer = null;

    return function(e) {
      pr.stopMarkerEvent(e);

      if (!window.setTimeout || !window.clearTimeout) {
        pr.selectStopPortal(index, false);
        return;
      }

      if (clickTimer) {
        window.clearTimeout(clickTimer);
        clickTimer = null;
        pr.openRouteListForStop(index, e);
        return;
      }

      clickTimer = window.setTimeout(function() {
        clickTimer = null;
        pr.selectStopPortal(index, false);
      }, 300);
    };
  };

  pr.createMapPointMarker = function(stop, index, title, clickHandler) {
    var isSelected = pr.selectedStopIndex && pr.selectedStopIndex() === index;
    var pointIcon = L.divIcon({
      className: 'portal-route-map-point-marker' + (stop.home ? ' portal-route-home-point-marker' : '') + (isSelected ? ' portal-route-map-point-marker-selected' : ''),
      html: '<span></span>',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    var marker = L.marker([stop.lat, stop.lng], {
      icon: pointIcon,
      draggable: !pr.isManagedStartStop(stop),
      interactive: true,
      keyboard: false,
      bubblingMouseEvents: false
    });

    marker.on('click', clickHandler);
    return marker;
  };

  pr.createStopLabelMarker = function(stop, index, hasLoopStop, title, clickHandler) {
    var isLoop = !!stop.generatedLoop;
    var label = index + 1;
    var icon = L.divIcon({
      className: pr.stopLabelClass(stop, index, hasLoopStop),
      html: '<span>' + label + '</span>',
      iconSize: [18, 18],
      iconAnchor: isLoop ? [-18, 24] : [0, 24]
    });

    var marker = L.marker([stop.lat, stop.lng], {
      icon: icon,
      draggable: !isLoop && !pr.isManagedStartStop(stop),
      interactive: true,
      keyboard: false,
      bubblingMouseEvents: false
    });

    marker.on('click', clickHandler);

    return marker;
  };

  pr.attachMapPointDragHandlers = function(index, pointMarker, labelMarker) {
    if (!pointMarker) return;

    pointMarker.on('dragstart', function(e) {
      if (pr.pushUndoSnapshot) pr.pushUndoSnapshot('move waypoint');
      if (e.target && e.target._icon) e.target._icon.classList.add('portal-route-map-point-marker-dragging');
      pr.state.selectedMapPointIndex = index;
      if (pr.clearIitcPortalSelection) pr.clearIitcPortalSelection();
      if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
      pr.renderPanel();
      pr.renderMiniControl();
    });
    pointMarker.on('drag', function(e) {
      var latlng = e.target.getLatLng();
      pr.updateMapPointPosition(index, latlng, { live: true });
      pointMarker.setLatLng(latlng);
      labelMarker.setLatLng(latlng);
    });
    pointMarker.on('dragend', function(e) {
      if (e.target && e.target._icon) e.target._icon.classList.remove('portal-route-map-point-marker-dragging');
      pr.updateMapPointPosition(index, e.target.getLatLng(), { skipUndo: true });
    });
  };

  pr.attachStopLabelDragHandlers = function(index, stop, labelMarker) {
    labelMarker.on('dragstart', function(e) {
      var originalPoint = e.target && e.target.getLatLng
        ? window.map.latLngToLayerPoint(e.target.getLatLng())
        : null;
      pr.state.stopReplaceDragStartPoint = originalPoint;
      if (stop.guid) {
        pr.state.selectedMapPointIndex = null;
        window.selectedPortal = stop.guid;
      } else {
        pr.state.selectedMapPointIndex = index;
        if (pr.clearIitcPortalSelection) pr.clearIitcPortalSelection();
      }
      if (e.target && e.target._icon) e.target._icon.classList.add('portal-route-stop-label-dragging');
      pr.renderPanel();
      pr.renderMiniControl();
    });
    labelMarker.on('dragend', function(e) {
      if (e.target && e.target._icon) e.target._icon.classList.remove('portal-route-stop-label-dragging');

      var latlng = e.target.getLatLng();
      var dropPoint = window.map.latLngToLayerPoint(latlng);
      var startPoint = pr.state.stopReplaceDragStartPoint;
      pr.state.stopReplaceDragStartPoint = null;

      if (startPoint && dropPoint && startPoint.distanceTo(dropPoint) < 8) {
        pr.redrawLabels();
        return;
      }

      if (!pr.replaceStopLocation(index, pr.mapReplacementStop(index, latlng))) {
        pr.redrawLabels();
      }
    });
  };

  pr.redrawLabels = function() {
    if (!window.map || !window.L) return;
    pr.ensureLayers();
    pr.clearLabels();

    var loopStop = pr.makeLoopStop && pr.makeLoopStop();
    var hasLoopStop = !!(loopStop && pr.state.stops.length > 1);

    pr.getRouteStops().forEach(function(stop, index) {
      var isLoop = !!stop.generatedLoop;
      var isMapPoint = stop.type === 'map';
      var canDragMapPoint = isMapPoint && !pr.isManagedStartStop(stop);
      var canDragRouteStop = !isLoop && !pr.isManagedStartStop(stop);
      var title = pr.stopMarkerTitle(stop, index);
      var clickHandler = pr.stopClickHandler(index);
      var pointMarker = null;

      if (isMapPoint) {
        pointMarker = pr.createMapPointMarker(stop, index, title, clickHandler);
        pointMarker.addTo(pr.state.layers.labels);
      }

      var labelMarker = pr.createStopLabelMarker(stop, index, hasLoopStop, title, clickHandler);

      if (canDragMapPoint) {
        pr.attachMapPointDragHandlers(index, pointMarker, labelMarker);
      }
      if (canDragRouteStop) {
        pr.attachStopLabelDragHandlers(index, stop, labelMarker);
      }

      labelMarker.addTo(pr.state.layers.labels);
    });
  };

  pr.toLatLng = function(point) {
    if (!point) return null;
    if (point.lat && typeof point.lat === 'function' && point.lng && typeof point.lng === 'function') {
      return L.latLng(point.lat(), point.lng());
    }
    if (typeof point.lat === 'number' && typeof point.lng === 'number') {
      return L.latLng(point.lat, point.lng);
    }
    return null;
  };

  pr.getPathMidpoint = function(path) {
    if (!path || path.length === 0) return null;

    var points = path.map(pr.toLatLng).filter(Boolean);
    if (points.length === 0) return null;
    if (points.length === 1) return points[0];

    var total = 0;
    for (var i = 1; i < points.length; i++) {
      total += points[i - 1].distanceTo(points[i]);
    }

    if (!total) return points[Math.floor(points.length / 2)];

    var halfway = total / 2;
    var walked = 0;

    for (var j = 1; j < points.length; j++) {
      var from = points[j - 1];
      var to = points[j];
      var segment = from.distanceTo(to);

      if (walked + segment >= halfway) {
        var ratio = segment ? (halfway - walked) / segment : 0;
        return L.latLng(
          from.lat + (to.lat - from.lat) * ratio,
          from.lng + (to.lng - from.lng) * ratio
        );
      }

      walked += segment;
    }

    return points[Math.floor(points.length / 2)];
  };

  pr.getLegLabelLatLng = function(leg) {
    var midpoint = pr.getPathMidpoint(leg && leg.path);
    if (midpoint) return midpoint;

    var stops = pr.getRouteStops();
    var fromStop = stops[leg.fromIndex];
    var toStop = stops[leg.toIndex];
    if (!fromStop || !toStop) return null;

    return L.latLng(
      (fromStop.lat + toStop.lat) / 2,
      (fromStop.lng + toStop.lng) / 2
    );
  };

  pr.redrawSegmentTimeLabels = function() {
    if (!window.map || !window.L) return;
    pr.ensureLayers();
    pr.clearSegmentTimeLabels();

    if (!pr.state.settings.showSegmentTimesOnMap) return;
    if (!pr.state.route || !Array.isArray(pr.state.route.legs)) return;

    pr.state.route.legs.forEach(function(leg) {
      var latLng = pr.getLegLabelLatLng(leg);
      if (!latLng) return;

      var text = leg.durationText || pr.formatDuration(leg.durationSeconds);
      var icon = L.divIcon({
        className: 'portal-route-segment-time-label',
        html: '<span>' + pr.escapeHtml(text) + '</span>',
        iconSize: null,
        iconAnchor: [16, 8]
      });

      L.marker(latLng, {
        icon: icon,
        interactive: false,
        keyboard: false,
        bubblingMouseEvents: false
      }).addTo(pr.state.layers.segmentLabels);
    });
  };

  pr.getRouteLineStyle = function() {
    var color = pr.normalizeRouteLineColor(pr.state.settings.routeLineColor);
    var weight = pr.normalizeRouteLineWeight(pr.state.settings.routeLineWeight);
    var lineStyle = pr.normalizeRouteLineStyle(pr.state.settings.routeLineStyle);
    var dashArray = pr.getRouteLineDashArray(lineStyle, weight);

    return {
      color: color,
      weight: weight,
      opacity: pr.state.routeDirty ? 0.35 : 0.8,
      dashArray: dashArray,
      lineCap: 'round',
      lineJoin: 'round',
      interactive: false,
      bubblingMouseEvents: false
    };
  };

  pr.applyRouteLineStyle = function() {
    if (!pr.state.layers.routeLine || !pr.state.layers.routeLine.setStyle) return;
    pr.state.layers.routeLine.setStyle(pr.getRouteLineStyle());
  };

  pr.drawRoutePath = function(path) {
    pr.clearRouteLine();
    if (!path || path.length < 2) return;

    pr.state.layers.routeLine = L.polyline(path, pr.getRouteLineStyle()).addTo(pr.routeOverlayTarget());

    pr.redrawSegmentTimeLabels();
  };

  pr.fitRouteToMap = function() {
    if (!window.map || !pr.state.layers.routeLine || !pr.state.layers.routeLine.getBounds) {
      pr.showMessage('Add at least two waypoints first.');
      return;
    }

    try {
      window.map.fitBounds(pr.state.layers.routeLine.getBounds(), { padding: [30, 30] });
    } catch (e) {
      console.warn('Portal Route: unable to fit route bounds', e);
      pr.showMessage('Could not fit route.');
    }
  };

  pr.redrawRouteLine = function() {
    if (!window.map || !window.L) return;
    if (!pr.state.route || !Array.isArray(pr.state.route.path)) return;

    var path = pr.state.route.path.map(function(point) {
      return L.latLng(point.lat, point.lng);
    });

    pr.drawRoutePath(path);
  };

  pr.escapeHtml = function(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  pr.renderEmptyHelp = function() {
    return '<p class="portal-route-empty">There are no waypoints defined.<br>Use Add or Menu to start a route.</p>';
  };

  pr.renderRouteSegment = function(leg) {
    if (!leg) {
      return '<span class="portal-route-leg portal-route-leg-empty">---- / ----</span>';
    }

    var duration = leg.durationText || pr.formatDuration(leg.durationSeconds);
    var distance = leg.distanceText || pr.formatDistance(leg.distanceMeters);
    var staleClass = pr.state.routeDirty ? ' portal-route-leg-stale' : '';

    return '<span class="portal-route-leg' + staleClass + '">' +
      pr.escapeHtml(duration) +
      ' / ' +
      pr.escapeHtml(distance) +
      '</span>';
  };

  pr.renderStopsList = function(legsByToIndex) {
    var stops = pr.getRouteStops();
    if (stops.length === 0) return pr.renderEmptyHelp();

    var html = '';
    html += '<div class="portal-route-waypoints-list">';

    stops.forEach(function(stop, index) {
      var isLoop = !!stop.generatedLoop;
      var isManagedStart = pr.isManagedStartStop(stop);
      var waitValue = isLoop ? '0m' : pr.formatDurationInput(pr.getEffectiveStopMinutes(stop));
      var selectedClass = !isLoop && pr.selectedStopIndex && pr.selectedStopIndex() === index ? ' portal-route-selected-stop' : '';
      var rowClass = selectedClass + (isLoop ? ' portal-route-loop-row' : '');
      var badge = isLoop ? 'L' : (index + 1);
      var badgeClass = String(badge).length > 2 ? ' portal-route-waypoint-badge-wide' : '';
      var canDragRow = !isLoop && !isManagedStart;
      var dragClass = canDragRow ? ' portal-route-waypoint-row-draggable' : '';
      var dragAttr = canDragRow ? ' draggable="true"' : '';
      var dragHandleAttr = canDragRow ? ' draggable="true"' : '';
      var selectTitle = isLoop ? 'Loop back to start' : 'Select and center stop';
      var badgeLabel = canDragRow ? 'Drag to reorder; click to select and center' : selectTitle;

      html += '<div class="portal-route-waypoint-row portal-route-stop' + rowClass + dragClass + '" data-index="' + index + '"' + dragAttr + '>';
      html += '<div class="portal-route-waypoint-num"><button type="button" class="portal-route-stop-num portal-route-waypoint-badge portal-route-waypoint-drag-handle' + badgeClass + (isLoop ? ' portal-route-loop-badge' : '') + '" aria-label="' + pr.escapeHtml(badgeLabel) + '" data-action="select-stop-center" data-index="' + index + '"' + dragHandleAttr + '>' + badge + '</button></div>';

      if (isLoop) {
        html += '<div class="portal-route-waypoint-name-cell"><button type="button" class="portal-route-waypoint-name" aria-label="Loop back to first waypoint" data-action="select-stop-center" data-index="' + index + '">Loop back to ' + pr.escapeHtml(stop.title) + '</button></div>';
      } else {
        html += '<div class="portal-route-waypoint-name-cell"><button type="button" class="portal-route-waypoint-name" aria-label="Select stop" data-action="select-stop" data-index="' + index + '">' + pr.escapeHtml(stop.title) + '</button></div>';
      }

      html += '<div class="portal-route-leg-cell">' + (index < stops.length - 1 ? pr.renderRouteSegment(legsByToIndex[index + 1]) : '') + '</div>';
      html += '<div class="portal-route-wait-cell"><input class="portal-route-wait-input" type="text" inputmode="decimal" value="' + pr.escapeHtml(waitValue) + '" aria-label="Stop wait time" placeholder="15m" data-field="stop-minutes" data-index="' + index + '" ' + (isLoop || isManagedStart ? 'disabled' : '') + '></div>';

      if (isLoop) {
        html += '<div class="portal-route-row-actions"></div>';
      } else {
        var canMoveUp = !isManagedStart && index > 0 && !(pr.state.settings.startOnCurrentLocation && index <= 1);
        var canMoveDown = !isManagedStart && index < pr.state.stops.length - 1;
        var canRemove = !isManagedStart;
        html += '<div class="portal-route-row-actions">';
        html += '<button type="button" aria-label="Move waypoint up" data-action="move-stop-up" data-index="' + index + '"' + (canMoveUp ? '' : ' disabled') + '><span class="portal-route-row-action-full">Up</span><span class="portal-route-row-action-short" aria-hidden="true">↑</span></button>';
        html += '<button type="button" aria-label="Move waypoint down" data-action="move-stop-down" data-index="' + index + '"' + (canMoveDown ? '' : ' disabled') + '><span class="portal-route-row-action-full">Dn</span><span class="portal-route-row-action-short" aria-hidden="true">↓</span></button>';
        html += '<button type="button" aria-label="Delete waypoint" data-action="remove-stop" data-index="' + index + '"' + (canRemove ? '' : ' disabled') + '><span class="portal-route-row-action-full">Del</span><span class="portal-route-row-action-short" aria-hidden="true">×</span></button>';
        html += '</div>';
      }
      html += '</div>';
    });

    html += '</div>';
    return html;
  };

  pr.renderTotals = function(route) {
    if (!route || !route.totals) return '';

    var travelLabel = pr.getTravelModeLabel(route.totals.travelMode);
    var html = '';
    html += '<div class="portal-route-totals">';
    html += '<div><span>' + pr.escapeHtml(travelLabel) + '</span><strong>' + pr.formatDuration(route.totals.driveSeconds) + '</strong></div>';
    html += '<div><span>Stops</span><strong>' + pr.formatDuration(route.totals.stopSeconds) + '</strong></div>';
    html += '<div><span>Trip</span><strong>' + pr.formatDuration(route.totals.tripSeconds) + '</strong></div>';
    html += '<div><span>Distance</span><strong>' + pr.formatDistance(route.totals.distanceMeters) + '</strong></div>';
    html += '</div>';
    return html;
  };

  pr.renderPointsSummary = function(route) {
    if (!route || !route.totals) return '';

    var travelLabel = pr.getTravelModeLabel(route.totals.travelMode);
    var html = '';
    html += '<div class="portal-route-totals portal-route-points-summary">';
    html += '<div><span>Trip</span><strong>' + pr.formatDuration(route.totals.tripSeconds) + '</strong></div>';
    html += '<div><span>' + pr.escapeHtml(travelLabel) + '</span><strong>' + pr.formatDuration(route.totals.driveSeconds) + '</strong></div>';
    html += '<div><span>Stops</span><strong>' + pr.formatDuration(route.totals.stopSeconds) + '</strong></div>';
    html += '<div><span>Distance</span><strong>' + pr.formatDistance(route.totals.distanceMeters) + ' / ' + pr.formatDistanceKm(route.totals.distanceMeters) + '</strong></div>';
    html += '</div>';
    return html;
  };

  pr.renderAddPointModeHint = function() {
    if (!pr.state.addPointMode) return '';
    return '<div class="portal-route-add-point-hint">Tap map to add point · Add/Esc cancels</div>';
  };

  pr.renderHomePickModeHint = function() {
    if (!pr.state.homePickMode) return '';
    return '<div class="portal-route-add-point-hint">Tap map to set Home · Esc cancels</div>';
  };

  pr.renderRouteStaleHint = function() {
    if (!pr.state.routeDirty) return '';
    return '<div class="portal-route-stale portal-route-stale-hint">Route changed. Replot to update stats and map line.</div>';
  };

  pr.renderCompactRouteStats = function(route) {
    if (!route || !route.totals) return '';

    var staleClass = pr.state.routeDirty ? ' portal-route-compact-stats-stale' : '';
    var staleText = pr.state.routeDirty ? '<span class="portal-route-compact-stats-flag">stale</span>' : '';
    var html = '';
    html += '<div class="portal-route-compact-stats' + staleClass + '">' + staleText;
    html += '<span><b>Tot</b> ' + pr.escapeHtml(pr.formatDuration(route.totals.tripSeconds)) + '</span>';
    html += '<span><b>' + pr.escapeHtml(pr.getTravelModeLabel(route.totals.travelMode).slice(0, 1)) + '</b> ' + pr.escapeHtml(pr.formatDuration(route.totals.driveSeconds)) + '</span>';
    html += '<span><b>Wait</b> ' + pr.escapeHtml(pr.formatDuration(route.totals.stopSeconds)) + '</span>';
    html += '<span><b>Dist</b> ' + pr.escapeHtml(pr.formatDistance(route.totals.distanceMeters)) + '</span>';
    html += '</div>';
    return html;
  };

  pr.renderTravelModeControls = function() {
    var html = '';
    html += '<div class="portal-route-list-options portal-route-travel-controls">';
    html += '<label class="portal-route-setting portal-route-default-stop-setting">Mode <select aria-label="Default travel mode" data-field="default-travel-mode">' +
      '<option value="' + pr.TRAVEL_MODES.drive + '"' + (pr.getTravelMode() === pr.TRAVEL_MODES.drive ? ' selected' : '') + '>Drive</option>' +
      '<option value="' + pr.TRAVEL_MODES.bike + '"' + (pr.getTravelMode() === pr.TRAVEL_MODES.bike ? ' selected' : '') + '>Bike</option>' +
      '<option value="' + pr.TRAVEL_MODES.walk + '"' + (pr.getTravelMode() === pr.TRAVEL_MODES.walk ? ' selected' : '') + '>Walk</option>' +
      '</select></label>';
    html += '<label class="portal-route-setting portal-route-default-stop-setting">Drive <input type="text" inputmode="decimal" value="' + pr.escapeHtml(pr.formatSpeedInput(pr.state.settings.driveSpeedMph)) + '" aria-label="Drive speed in miles per hour" placeholder="30" data-field="drive-speed-mph"></label>';
    html += '<label class="portal-route-setting portal-route-default-stop-setting">Bike <input type="text" inputmode="decimal" value="' + pr.escapeHtml(pr.formatSpeedInput(pr.state.settings.bikeSpeedMph)) + '" aria-label="Bike speed in miles per hour" placeholder="10" data-field="bike-speed-mph"></label>';
    html += '<label class="portal-route-setting portal-route-default-stop-setting">Walk <input type="text" inputmode="decimal" value="' + pr.escapeHtml(pr.formatSpeedInput(pr.state.settings.walkSpeedMph)) + '" aria-label="Walk speed in miles per hour" placeholder="3" data-field="walk-speed-mph"></label>';
    html += '</div>';
    return html;
  };


  pr.renderMainPanel = function(legsByToIndex) {
    var html = '';
    var provider = pr.getRoutingProvider();

    html += '<div class="portal-route-body portal-route-settings-body">';
    html += '<div class="portal-route-settings-scroll-body">';
    html += '<div class="portal-route-list-options">';
    html += '<label class="portal-route-setting portal-route-default-stop-setting">Default stop time <input type="text" inputmode="decimal" value="' + pr.escapeHtml(pr.formatDurationInput(pr.state.settings.defaultStopMinutes)) + '" aria-label="Default stop time" placeholder="15m" data-field="default-stop-minutes"> per portal</label>';
    html += '</div>';

    html += '<div class="portal-route-list-options">';
    html += '<label class="portal-route-setting portal-route-default-stop-setting">Routing <select aria-label="Routing provider" data-field="routing-provider">' +
      '<option value="' + pr.ROUTING_PROVIDERS.google + '"' + (provider === pr.ROUTING_PROVIDERS.google ? ' selected' : '') + '>Google</option>' +
      '<option value="' + pr.ROUTING_PROVIDERS.ors + '"' + (provider === pr.ROUTING_PROVIDERS.ors ? ' selected' : '') + '>ORS beta</option>' +
      '</select></label>';
    html += '</div>';
    html += '<div class="portal-route-list-options portal-route-long-setting-row portal-route-ors-settings">';
    html += '<label class="portal-route-setting portal-route-default-stop-setting portal-route-long-setting">ORS API key <input type="password" autocomplete="off" value="' + pr.escapeHtml(pr.state.settings.orsApiKey || '') + '" aria-label="OpenRouteService API key" placeholder="Required for public ORS" data-field="ors-api-key"></label>';
    html += '</div>';
    html += '<div class="portal-route-list-options portal-route-long-setting-row portal-route-ors-settings">';
    html += '<label class="portal-route-setting portal-route-default-stop-setting portal-route-long-setting">ORS URL <input type="text" value="' + pr.escapeHtml(pr.state.settings.orsBaseUrl || pr.DEFAULT_SETTINGS.orsBaseUrl) + '" aria-label="OpenRouteService base URL" placeholder="https://api.openrouteservice.org" data-field="ors-base-url"></label>';
    html += '</div>';

    html += '<div class="portal-route-settings-row">';
    html += '<label class="portal-route-setting portal-route-checkbox-setting"><input type="checkbox" data-field="show-segment-times-on-map" ' + (pr.state.settings.showSegmentTimesOnMap ? 'checked ' : '') + '> Show segment times on map</label>';
    html += '<label class="portal-route-setting portal-route-checkbox-setting"><input type="checkbox" data-field="include-return-to-start" ' + (pr.state.settings.includeReturnToStart ? 'checked ' : '') + '> Loop to start</label>';
    html += '<label class="portal-route-setting portal-route-checkbox-setting"><input type="checkbox" data-field="show-mini-control" ' + (pr.state.settings.showMiniControl ? 'checked ' : '') + '> Mini control</label>';
    html += '<label class="portal-route-setting portal-route-checkbox-setting"><input type="checkbox" data-field="show-portal-details-controls" ' + (pr.state.settings.showPortalDetailsControls ? 'checked ' : '') + '> Info panel controls</label>';
    if (pr.SHOW_VERSION_IN_PANEL) {
      html += '<span class="portal-route-version">Portal Route ' + pr.escapeHtml(pr.VERSION) + '</span>';
    }
    html += '</div>';
    var routeLineWeight = pr.normalizeRouteLineWeight(pr.state.settings.routeLineWeight);
    var routeLineStyle = pr.normalizeRouteLineStyle(pr.state.settings.routeLineStyle);
    html += '<div class="portal-route-list-options portal-route-line-style-options">';
    html += '<label class="portal-route-setting portal-route-default-stop-setting">Route color <input type="color" value="' + pr.escapeHtml(pr.normalizeRouteLineColor(pr.state.settings.routeLineColor)) + '" aria-label="Route line color" data-field="route-line-color"></label>';
    html += '<label class="portal-route-setting portal-route-default-stop-setting">Thickness <select aria-label="Route line thickness" data-field="route-line-weight">' +
      '<option value="3"' + (routeLineWeight === 3 ? ' selected' : '') + '>Thin</option>' +
      '<option value="5"' + (routeLineWeight === 5 ? ' selected' : '') + '>Normal</option>' +
      '<option value="7"' + (routeLineWeight === 7 ? ' selected' : '') + '>Thick</option>' +
      '<option value="9"' + (routeLineWeight === 9 ? ' selected' : '') + '>Heavy</option>' +
      '</select></label>';
    html += '<label class="portal-route-setting portal-route-default-stop-setting">Style <select aria-label="Route line style" data-field="route-line-style">' +
      '<option value="solid"' + (routeLineStyle === pr.ROUTE_LINE_STYLES.solid ? ' selected' : '') + '>Solid</option>' +
      '<option value="dashed"' + (routeLineStyle === pr.ROUTE_LINE_STYLES.dashed ? ' selected' : '') + '>Dashed</option>' +
      '<option value="dotted"' + (routeLineStyle === pr.ROUTE_LINE_STYLES.dotted ? ' selected' : '') + '>Dotted</option>' +
      '</select></label>';
    html += '</div>';

    html += '<div class="portal-route-list-options portal-route-long-setting-row">';
    html += '<label class="portal-route-setting portal-route-default-stop-setting portal-route-long-setting">Home name <input type="text" value="' + pr.escapeHtml(pr.state.settings.homeTitle || pr.DEFAULT_SETTINGS.homeTitle) + '" aria-label="Home name" placeholder="Home" data-field="home-title"></label>';
    html += '</div>';
    html += '<div class="portal-route-list-options">';
    html += '<label class="portal-route-setting portal-route-default-stop-setting portal-route-home-coordinate-setting">Home lat <input type="text" inputmode="decimal" value="' + pr.escapeHtml(pr.state.settings.homeLat || '') + '" aria-label="Home latitude" placeholder="43.000000" data-field="home-lat"></label>';
    html += '<label class="portal-route-setting portal-route-default-stop-setting portal-route-home-coordinate-setting">Home lng <input type="text" inputmode="decimal" value="' + pr.escapeHtml(pr.state.settings.homeLng || '') + '" aria-label="Home longitude" placeholder="-72.000000" data-field="home-lng"></label>';
    html += '<button type="button" data-action="set-home-current-location">' + (window.selectedPortal ? 'Set Home to portal' : 'Pick Home on map') + '</button>';
    html += '</div>';

    html += '<div class="portal-route-list-options portal-route-long-setting-row">';
    html += '<label class="portal-route-setting portal-route-default-stop-setting portal-route-long-setting">Google Drive OAuth Client ID <input type="text" value="' + pr.escapeHtml(pr.state.settings.googleDriveOAuthClientId || '') + '" aria-label="Google Drive OAuth Client ID" placeholder="Used when Sync auth is unavailable" data-field="google-drive-oauth-client-id"></label>';
    html += '</div>';
    html += '</div>';

    html += '<div class="portal-route-settings-footer">';
    html += '<div class="portal-route-control-group-buttons portal-route-footer-actions portal-route-points-actions">';
    html += pr.selectedAddDeleteButton();
    html += pr.undoRouteEditButton();
    html += pr.routeButtonHtml(pr.routeReplotButtonOptions());
    html += pr.mainMenuButton();
    html += '</div>';
    html += pr.renderAddPointModeHint();
    html += pr.renderHomePickModeHint();
    html += pr.renderRouteStaleHint();

    html += '<div class="portal-route-message" id="portal-route-message"></div>';
    html += '</div>';
    html += '</div>';
    return html;
  };


  pr.getDialogSize = function(defaultWidth, defaultHeight, minWidth, minHeight) {
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth || defaultWidth;
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight || defaultHeight;
    var maxWidth = viewportWidth <= 640 ? viewportWidth : viewportWidth - 40;
    var maxHeight = viewportHeight - 90;

    return {
      width: Math.min(defaultWidth, Math.max(minWidth, maxWidth)),
      height: Math.min(defaultHeight, Math.max(minHeight, maxHeight))
    };
  };

  pr.getDialogWidth = function() {
    return pr.getDialogSize(540, 280, 360, 260).width;
  };

  pr.getDialogHeight = function() {
    return pr.getDialogSize(540, 280, 360, 260).height;
  };

  pr.getPointsDialogWidth = function() {
    return pr.getDialogSize(600, 375, 320, 260).width;
  };

  pr.getPointsDialogHeight = function() {
    return pr.getDialogSize(600, 375, 320, 260).height;
  };

  pr.getRouteLibraryDialogWidth = function() {
    return pr.getDialogSize(430, 375, 320, 260).width;
  };

  pr.getRouteLibraryDialogHeight = function() {
    return pr.getDialogSize(430, 375, 320, 260).height;
  };

  pr.isDialogOpen = function(content) {
    if (!content || !window.jQuery) return false;

    try {
      var dialogContent = window.jQuery(content).closest('.ui-dialog-content');
      return dialogContent.length > 0 && dialogContent.dialog('isOpen');
    } catch (e) {
      return false;
    }
  };

  pr.shouldRestorePanelPosition = function() {
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 520;
    return viewportWidth > 640;
  };

  pr.clampPanelPosition = function(position, wrapper) {
    if (!position || !wrapper || !wrapper.length) return null;
    if (position.left === 0 && position.top === 0) return null;

    var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 520;
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 640;
    var width = wrapper.outerWidth() || pr.getDialogWidth();
    var height = wrapper.outerHeight() || 220;
    var maxLeft = Math.max(0, viewportWidth - Math.min(width, viewportWidth));
    var maxTop = Math.max(0, viewportHeight - Math.min(height, viewportHeight));

    return {
      left: Math.min(Math.max(0, position.left), maxLeft),
      top: Math.min(Math.max(0, position.top), maxTop)
    };
  };

  pr.clampPanelSize = function(size) {
    if (!size || !pr.shouldRestorePanelPosition()) return null;

    var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 520;
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 640;
    var maxWidth = Math.max(320, viewportWidth - 20);
    var maxHeight = Math.max(220, viewportHeight - 20);

    return {
      width: Math.min(Math.max(320, size.width), maxWidth),
      height: Math.min(Math.max(220, size.height), maxHeight)
    };
  };

  pr.saveCurrentPanelPosition = function(wrapper) {
    if (!wrapper || !wrapper.length || !pr.shouldRestorePanelPosition()) return;

    var offset = wrapper.offset();
    if (!offset) return;
    if (Math.round(offset.left) === 0 && Math.round(offset.top) === 0) return;

    pr.state.panelPosition = {
      left: Math.round(offset.left),
      top: Math.round(offset.top)
    };
    pr.savePanelPosition();
  };

  pr.saveCurrentPanelSize = function(wrapper) {
    if (!wrapper || !wrapper.length || !pr.shouldRestorePanelPosition()) return;

    var size = pr.clampPanelSize({
      width: Math.round(wrapper.outerWidth() || 0),
      height: Math.round(wrapper.outerHeight() || 0)
    });
    if (!size) return;

    pr.state.panelSize = size;
    pr.savePanelSize();
  };

  pr.restorePanelSize = function(wrapper, dialogContent) {
    if (!wrapper || !wrapper.length || !pr.shouldRestorePanelPosition()) return;

    var size = pr.clampPanelSize(pr.state.panelSize);
    if (!size) return;

    if (dialogContent && dialogContent.length) {
      try {
        dialogContent.dialog('option', {
          width: size.width,
          height: size.height
        });
        return;
      } catch (e) {
        // Fall back to direct sizing if the dialog API is unavailable.
      }
    }

    wrapper.css({ width: size.width + 'px', height: size.height + 'px' });
  };

  pr.restorePanelPosition = function(wrapper) {
    if (!wrapper || !wrapper.length || !pr.shouldRestorePanelPosition()) return;

    var position = pr.clampPanelPosition(pr.state.panelPosition, wrapper);
    if (!position) return;

    wrapper.css({
      left: position.left + 'px',
      top: position.top + 'px',
      right: 'auto',
      bottom: 'auto'
    });
  };

  pr.attachPanelPositionHandlers = function(content) {
    if (!content || !window.jQuery) return;

    try {
      var dialogContent = window.jQuery(content).closest('.ui-dialog-content');
      var wrapper = dialogContent.closest('.ui-dialog');
      pr.restorePanelSize(wrapper, dialogContent);
      pr.restorePanelPosition(wrapper);
      dialogContent
        .off('dialogdragstop.portalRoute dialogresizestop.portalRoute')
        .on('dialogdragstop.portalRoute', function() {
          pr.saveCurrentPanelPosition(wrapper);
        })
        .on('dialogresizestop.portalRoute', function() {
          pr.saveCurrentPanelPosition(wrapper);
          pr.saveCurrentPanelSize(wrapper);
        });
    } catch (e) {
      console.warn('Portal Route: failed to attach dialog position handler', e);
    }
  };

  pr.focusPanelContainer = function(content) {
    if (!content || !content.focus || !window.setTimeout) return;

    window.setTimeout(function() {
      if (!content || !content.focus) return;
      try {
        content.focus({ preventScroll: true });
      } catch (e) {
        content.focus();
      }
    }, 0);
  };

  pr.renderPanel = function() {
    if (pr.isLayerEnabled && !pr.isLayerEnabled()) {
      pr.closeDialog();
      pr.closePointsDialog();
      return;
    }

    pr.renderMiniControl();

    if (!pr.state.panelOpen) {
      pr.closeDialog();
      if (pr.state.pointsPanelOpen) pr.renderPointsPanel();
      return;
    }

    var route = pr.state.route;
    var legsByToIndex = {};
    if (route && route.legs) {
      route.legs.forEach(function(leg) { legsByToIndex[leg.toIndex] = leg; });
    }

    var contentHtml = pr.renderMainPanel(legsByToIndex);
    var existingContent = document.getElementById(pr.DOM_IDS.dialogContent);

    if (pr.isDialogOpen(existingContent)) {
      existingContent.innerHTML = contentHtml;
      if (pr.state.pointsPanelOpen) pr.renderPointsPanel();
      return;
    }

    var html = '<div id="' + pr.DOM_IDS.dialogContent + '" class="portal-route-dialog-content portal-route-settings-dialog-content" tabindex="-1">' + contentHtml + '</div>';

    if (typeof window.dialog === 'function') {
      window.dialog({
        id: pr.DOM_IDS.dialog,
        title: 'Portal Route Settings',
        html: html,
        dialogClass: 'portal-route-dialog portal-route-settings-dialog',
        width: pr.getDialogWidth(),
        height: pr.getDialogHeight()
      });

      var newContent = document.getElementById(pr.DOM_IDS.dialogContent);
      if (newContent && window.jQuery) {
        try {
          pr.attachPanelPositionHandlers(newContent);
          pr.focusPanelContainer(newContent);
          window.jQuery(newContent)
            .closest('.ui-dialog-content')
            .off('dialogclose.portalRoute')
            .on('dialogclose.portalRoute', function() {
              pr.state.panelOpen = false;
              pr.savePanelOpen();
            });
        } catch (e) {
          console.warn('Portal Route: failed to attach dialog close handler', e);
        }
      }
    } else {
      console.log('Portal Route: IITC dialog API is unavailable.');
    }

    if (pr.state.pointsPanelOpen) pr.renderPointsPanel();
  };

  pr.renderPointsPanel = function() {
    if (pr.isLayerEnabled && !pr.isLayerEnabled()) {
      pr.closePointsDialog();
      return;
    }

    if (!pr.state.pointsPanelOpen) {
      pr.closePointsDialog();
      return;
    }

    var route = pr.state.route;
    var legsByToIndex = {};
    if (route && route.legs) {
      route.legs.forEach(function(leg) { legsByToIndex[leg.toIndex] = leg; });
    }

    var contentHtml = '';
    contentHtml += pr.renderPointsSummary(route);
    contentHtml += pr.renderRouteStaleHint();
    contentHtml += '<div class="portal-route-bottom-summary"><b>Waypoints:</b> ' + pr.state.stops.length + (pr.makeLoopStop() && pr.state.stops.length > 1 ? ' + loop' : '') + '</div>';
    contentHtml += pr.renderTravelModeControls();
    contentHtml += '<div class="portal-route-points-list-body">';
    contentHtml += '<div class="portal-route-body">' + pr.renderStopsList(legsByToIndex) + '</div>';
    contentHtml += '</div>';
    contentHtml += '<div class="portal-route-control-group-buttons portal-route-footer-actions portal-route-points-panel-actions">';
    contentHtml += pr.selectedAddDeleteButton();
    contentHtml += pr.undoRouteEditButton();
    contentHtml += pr.routeButtonHtml(pr.loopBackButtonOptions());
    contentHtml += pr.routeButtonHtml(pr.fitRouteButtonOptions());
    contentHtml += pr.routeButtonHtml(pr.reverseRouteButtonOptions());
    contentHtml += '<span class="portal-route-button-divider" aria-hidden="true"></span>';
    contentHtml += '<button type="button" data-action="print-route">Print</button>';
    contentHtml += '<button type="button" data-action="save-route">Save</button>';
    contentHtml += '<button type="button" data-action="load-route">Load</button>';
    contentHtml += pr.mainMenuButton();
    contentHtml += '</div>';
    contentHtml += pr.renderAddPointModeHint();
    contentHtml += pr.renderHomePickModeHint();
    var existingContent = document.getElementById(pr.DOM_IDS.pointsDialogContent);

    if (pr.isDialogOpen(existingContent)) {
      existingContent.innerHTML = contentHtml;
      return;
    }

    var html = '<div id="' + pr.DOM_IDS.pointsDialogContent + '" class="portal-route-dialog-content portal-route-points-dialog-content" tabindex="-1">' + contentHtml + '</div>';

    if (typeof window.dialog === 'function') {
      window.dialog({
        id: pr.DOM_IDS.pointsDialog,
        title: 'Portal Route Points',
        html: html,
        dialogClass: 'portal-route-dialog portal-route-points-dialog',
        width: pr.getPointsDialogWidth(),
        height: pr.getPointsDialogHeight()
      });

      var newContent = document.getElementById(pr.DOM_IDS.pointsDialogContent);
      if (newContent && window.jQuery) {
        try {
          pr.focusPanelContainer(newContent);
          window.jQuery(newContent)
            .closest('.ui-dialog-content')
            .off('dialogclose.portalRoutePoints')
            .on('dialogclose.portalRoutePoints', function() {
              pr.state.pointsPanelOpen = false;
            });
        } catch (e) {
          console.warn('Portal Route: failed to attach points dialog close handler', e);
        }
      }
    } else {
      console.log('Portal Route: IITC dialog API is unavailable.');
    }
  };

  pr.GOOGLE_MAPS_TOTAL_POINT_LIMIT = 11;
  pr.GOOGLE_MAPS_INTERMEDIATE_STOP_LIMIT = 9;
  pr.APPLE_MAPS_TOTAL_POINT_LIMIT = 15;
  pr.ROUTE_EXPORT_FORMAT = 'portal-route.v1';
  pr.GOOGLE_MAPS_TRAVEL_MODES = {
    drive: 'driving',
    bike: 'bicycling',
    walk: 'walking'
  };

  pr.googleMapsTravelMode = function() {
    return pr.GOOGLE_MAPS_TRAVEL_MODES[pr.getTravelMode()] || 'driving';
  };

  pr.googleMapsUrlForStops = function(stops) {
    if (!stops || stops.length < 2) return null;
    var origin = stops[0];
    var destination = stops[stops.length - 1];
    var waypoints = stops.slice(1, -1);

    var params = new URLSearchParams();
    params.set('api', '1');
    params.set('travelmode', pr.googleMapsTravelMode());
    params.set('origin', origin.lat + ',' + origin.lng);
    params.set('destination', destination.lat + ',' + destination.lng);

    if (waypoints.length > 0) {
      params.set('waypoints', waypoints.map(function(stop) {
        return stop.lat + ',' + stop.lng;
      }).join('|'));
    }

    return 'https://www.google.com/maps/dir/?' + params.toString();
  };

  pr.googleMapsUrl = function() {
    var stops = pr.getRouteStops();
    return pr.googleMapsUrlForStops(stops);
  };

  pr.routeExportProviders = {
    google: {
      id: 'google',
      label: 'Google Maps',
      pointLimit: pr.GOOGLE_MAPS_TOTAL_POINT_LIMIT,
      urlForStops: function(stops) {
        return pr.googleMapsUrlForStops(stops);
      },
      openStagesDialog: function(stages) {
        pr.openGoogleMapsStagesDialog(stages);
      }
    }
  };

  pr.appleMapsUrlForStops = function(stops) {
    if (!stops || stops.length < 2) return null;
    var origin = stops[0];
    var destination = stops[stops.length - 1];
    var waypoints = stops.slice(1, -1);

    var params = new URLSearchParams();
    params.set('source', origin.lat + ',' + origin.lng);
    params.set('destination', destination.lat + ',' + destination.lng);
    params.set('mode', 'driving');

    waypoints.forEach(function(stop) {
      params.append('waypoint', stop.lat + ',' + stop.lng);
    });

    return 'https://maps.apple.com/directions?' + params.toString();
  };

  pr.appleMapsUrl = function() {
    var stops = pr.getRouteStops();
    return pr.appleMapsUrlForStops(stops);
  };

  pr.mapsStages = function(pointLimit, urlForStops) {
    var stops = pr.getRouteStops();
    if (stops.length < 2) return [];
    if (stops.length <= pointLimit) {
      return [{
        number: 1,
        fromIndex: 0,
        toIndex: stops.length - 1,
        stops: stops,
        url: urlForStops(stops)
      }];
    }

    var stages = [];
    var fromIndex = 0;
    while (fromIndex < stops.length - 1) {
      var toIndex = Math.min(fromIndex + pointLimit - 1, stops.length - 1);
      var stageStops = stops.slice(fromIndex, toIndex + 1);
      stages.push({
        number: stages.length + 1,
        fromIndex: fromIndex,
        toIndex: toIndex,
        stops: stageStops,
        url: urlForStops(stageStops)
      });
      fromIndex = toIndex;
    }
    return stages;
  };

  pr.googleMapsStages = function() {
    return pr.mapsStages(pr.routeExportProviders.google.pointLimit, pr.routeExportProviders.google.urlForStops);
  };

  pr.appleMapsStages = function() {
    return pr.mapsStages(pr.APPLE_MAPS_TOTAL_POINT_LIMIT, pr.appleMapsUrlForStops);
  };

  pr.formatMapsStageNumber = function(number) {
    return number < 10 ? '0' + number : String(number);
  };

  pr.openMapsStagesDialog = function(stages, options) {
    var html = '<div class="portal-route-dialog-content portal-route-maps-stages">';
    html += '<p class="portal-route-empty">' + pr.escapeHtml(options.message) + '</p>';
    html += '<div class="portal-route-control-group-buttons">';
    var longestTextLength = 0;
    stages.forEach(function(stage) {
      var fromStop = stage.stops[0];
      var toStop = stage.stops[stage.stops.length - 1];
      var label = 'Stage ' + stage.number + ': ' + pr.formatMapsStageNumber(stage.fromIndex + 1) + '-' + pr.formatMapsStageNumber(stage.toIndex + 1);
      var title = fromStop.title + ' to ' + toStop.title;
      longestTextLength = Math.max(longestTextLength, label.length, title.length);
      html += '<div class="portal-route-stage-item">';
      html += '<a class="portal-route-stage-link" target="_blank" rel="noopener" href="' + pr.escapeHtml(stage.url) + '" aria-label="' + pr.escapeHtml(label + ' - ' + title) + '" onclick="this.blur()">' + pr.escapeHtml(label) + '</a>';
      html += '<div class="portal-route-stage-summary">' + pr.escapeHtml(title) + '</div>';
      html += '</div>';
    });
    html += '</div></div>';

    if (typeof window.dialog === 'function') {
      var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 520;
      var maxWidth = Math.min(520, Math.max(320, viewportWidth - 40));
      var width = Math.min(maxWidth, Math.max(320, longestTextLength * 6 + 50));
      window.dialog({
        id: options.id,
        title: options.title,
        html: html,
        dialogClass: 'portal-route-dialog',
        width: width
      });
    } else {
      pr.showMessage('Route split into ' + stages.length + ' ' + options.name + ' stages.');
      window.open(stages[0].url, '_blank', 'noopener');
    }
  };

  pr.openGoogleMapsStagesDialog = function(stages) {
    pr.openMapsStagesDialog(stages, {
      id: 'iitc-plugin-portal-route-google-maps-stages',
      title: 'Google Maps stages',
      name: 'Google Maps',
      message: 'Google Maps uses up to 11 route points per link. Open each stage in order.'
    });
  };

  pr.openAppleMapsStagesDialog = function(stages) {
    pr.openMapsStagesDialog(stages, {
      id: 'iitc-plugin-portal-route-apple-maps-stages',
      title: 'Apple Maps stages',
      name: 'Apple Maps',
      message: 'Apple Maps uses up to 15 route points per link. Open each stage in order.'
    });
  };

  pr.openGoogleMaps = function() {
    var provider = pr.routeExportProviders.google;
    var stages = pr.googleMapsStages();
    if (!stages.length) {
      pr.showMessage('Add at least two waypoints first.');
      return;
    }

    if (stages.length > 1) {
      provider.openStagesDialog(stages);
      return;
    }

    window.open(stages[0].url, '_blank', 'noopener');
  };

  pr.openAppleMaps = function() {
    var stages = pr.appleMapsStages();
    if (!stages.length) {
      pr.showMessage('Add at least two waypoints first.');
      return;
    }

    if (stages.length > 1) {
      pr.openAppleMapsStagesDialog(stages);
      return;
    }

    window.open(stages[0].url, '_blank', 'noopener');
  };

  pr.routeExportData = function() {
    return {
      format: pr.ROUTE_EXPORT_FORMAT,
      plugin: pr.ID,
      pluginName: pr.NAME,
      pluginVersion: pr.VERSION,
      exportedAt: new Date().toISOString(),
      settings: pr.routeLibrarySettings ? pr.routeLibrarySettings() : {
        defaultStopMinutes: pr.state.settings.defaultStopMinutes,
        includeReturnToStart: !!pr.state.settings.includeReturnToStart,
        routingProvider: pr.state.settings.routingProvider || pr.ROUTING_PROVIDERS.google,
        defaultTravelMode: pr.state.settings.defaultTravelMode || pr.TRAVEL_MODES.drive,
        driveSpeedMph: pr.state.settings.driveSpeedMph,
        bikeSpeedMph: pr.state.settings.bikeSpeedMph,
        walkSpeedMph: pr.state.settings.walkSpeedMph
      },
      stops: pr.state.stops.map(function(stop) {
        return {
          guid: stop.guid || null,
          type: stop.type || (stop.guid ? 'portal' : 'map'),
          title: stop.title || ((stop.type || (stop.guid ? 'portal' : 'map')) === 'map' ? 'Map point' : 'Unnamed portal'),
          lat: Number(stop.lat),
          lng: Number(stop.lng),
          stopMinutes: typeof stop.stopMinutes === 'number' ? stop.stopMinutes : null,
          startOnMe: !!stop.startOnMe,
          home: (stop.type || (stop.guid ? 'portal' : 'map')) === 'map' && !!stop.home
        };
      }),
      route: pr.state.route || null,
      routeDirty: !!pr.state.routeDirty
    };
  };

  pr.routeExportFilename = function() {
    var stamp = new Date().toISOString().replace(/[:.]/g, '-');
    return 'portal-route-' + stamp + '.json';
  };

  pr.downloadTextFile = function(filename, text, mimeType) {
    var blob = new Blob([text], { type: mimeType || 'text/plain' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
  };

  pr.exportRouteJson = function() {
    if (!pr.state.stops.length) {
      pr.showMessage('No route to export.');
      return;
    }

    var json = JSON.stringify(pr.routeExportData(), null, 2);
    pr.downloadTextFile(pr.routeExportFilename(), json, 'application/json');
    pr.showMessage('Route JSON exported.');
  };

  pr.normalizeImportedStop = function(stop, index) {
    if (!stop || typeof stop !== 'object') return null;

    var lat = Number(stop.lat);
    var lng = Number(stop.lng);
    if (!isFinite(lat) || !isFinite(lng)) return null;

    var stopMinutes = null;
    if (stop.stopMinutes !== null && stop.stopMinutes !== undefined && stop.stopMinutes !== '') {
      stopMinutes = Number(stop.stopMinutes);
      if (!isFinite(stopMinutes) || stopMinutes < 0) stopMinutes = null;
      if (stopMinutes !== null) stopMinutes = Math.round(stopMinutes);
    }

    var guid = pr.stopGuidFromData(stop);
    var type = stop.type || (guid ? 'portal' : 'map');

    return {
      guid: guid,
      type: type,
      title: pr.hydratedStopTitle(stop, type, index),
      lat: lat,
      lng: lng,
      stopMinutes: stopMinutes,
      startOnMe: !!stop.startOnMe,
      home: type === 'map' && !!stop.home,
      accuracy: typeof stop.accuracy === 'number' ? stop.accuracy : null,
      updatedAt: stop.updatedAt || null
    };
  };

  pr.importRouteData = function(data) {
    if (!data || typeof data !== 'object') throw new Error('Import data is not an object.');
    if (!Array.isArray(data.stops)) throw new Error('Import data does not contain a stops array.');

    var stops = data.stops.map(pr.normalizeImportedStop).filter(Boolean);
    if (stops.length !== data.stops.length) throw new Error('One or more stops are missing valid coordinates.');

    if (pr.pushUndoSnapshot) pr.pushUndoSnapshot('import route');

    pr.state.stops = stops;
    pr.state.settings = pr.normalizeSettings(Object.assign({}, pr.state.settings, data.settings || {}));
    pr.state.route = data.route && Array.isArray(data.route.legs) ? data.route : null;
    if (pr.state.route && pr.refreshRouteTravelEstimates) pr.refreshRouteTravelEstimates(pr.state.route);
    pr.state.routeDirty = !!pr.state.route || !!data.routeDirty;
    pr.state.activeRouteId = null;

    pr.saveSettings();
    pr.saveStops();
    pr.saveRoute();
    pr.redrawLabels();
    pr.redrawRouteLine();
    pr.redrawSegmentTimeLabels();
    pr.renderPanel();
    pr.queueAutoReplot();
    pr.showMessage('Route imported.');
    pr.hydrateStopTitles();
  };

  pr.importRouteJsonText = function(text) {
    var data = JSON.parse(text);
    pr.importRouteData(data);
  };

  pr.importRouteJson = function() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.style.display = 'none';

    input.addEventListener('change', function() {
      var file = input.files && input.files[0];
      if (!file) {
        if (input.parentNode) input.parentNode.removeChild(input);
        return;
      }

      var reader = new FileReader();
      reader.onload = function() {
        try {
          pr.importRouteJsonText(String(reader.result || ''));
        } catch (e) {
          console.warn('Portal Route: route import failed', e);
          pr.showMessage('Route import failed: ' + e.message);
        }
        if (input.parentNode) input.parentNode.removeChild(input);
      };
      reader.onerror = function() {
        pr.showMessage('Route import failed while reading file.');
        if (input.parentNode) input.parentNode.removeChild(input);
      };
      reader.readAsText(file);
    });

    document.body.appendChild(input);
    input.click();
  };

  pr.printableLegText = function(leg) {
    if (!leg) return '---- / ----';

    var duration = leg.durationText || pr.formatDuration(leg.durationSeconds);
    var distance = leg.distanceText || pr.formatDistance(leg.distanceMeters);
    return duration + ' / ' + distance;
  };

  pr.printRoute = function() {
    var stops = pr.getRouteStops();
    if (!stops.length) {
      pr.showMessage('No route to print.');
      return;
    }

    var route = pr.state.route;
    var legsByFromIndex = {};
    if (route && Array.isArray(route.legs)) {
      route.legs.forEach(function(leg) { legsByFromIndex[leg.fromIndex] = leg; });
    }

    var totals = route && route.totals ? route.totals : null;
    var generatedAt = new Date().toLocaleString();
    var rows = stops.map(function(stop, index) {
      var wait = stop.generatedLoop ? '0m' : pr.formatDurationInput(pr.getEffectiveStopMinutes(stop));
      var legText = index < stops.length - 1 ? pr.printableLegText(legsByFromIndex[index]) : '';

      return '<tr>' +
        '<td class="num">' + (stop.generatedLoop ? 'L' : (index + 1)) + '</td>' +
        '<td><div class="title">' + pr.escapeHtml(stop.title) + '</div><div class="coords">' + pr.escapeHtml(stop.lat + ', ' + stop.lng) + '</div></td>' +
        '<td>' + pr.escapeHtml(wait) + '</td>' +
        '<td>' + pr.escapeHtml(legText) + '</td>' +
        '</tr>';
    }).join('');

    var totalsHtml = totals ? '<div class="totals">' +
      '<span><b>Travel:</b> ' + pr.escapeHtml(pr.formatDuration(totals.driveSeconds)) + '</span>' +
      '<span><b>Stops:</b> ' + pr.escapeHtml(pr.formatDuration(totals.stopSeconds)) + '</span>' +
      '<span><b>Trip:</b> ' + pr.escapeHtml(pr.formatDuration(totals.tripSeconds)) + '</span>' +
      '<span><b>Distance:</b> ' + pr.escapeHtml(pr.formatDistance(totals.distanceMeters)) + '</span>' +
      '</div>' : '<div class="warning">Route has not been calculated yet.</div>';

    var staleHtml = pr.state.routeDirty ? '<div class="warning">Route is still updating. Totals and leg data may change.</div>' : '';

    var html = '<!doctype html><html><head><meta charset="utf-8">' +
      '<title>Portal Route</title>' +
      '<style>' +
      'body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:24px;color:#111;}' +
      'h1{font-size:22px;margin:0 0 4px 0;}' +
      '.meta{font-size:12px;color:#555;margin-bottom:16px;}' +
      '.totals{display:flex;flex-wrap:wrap;gap:12px;margin:12px 0 16px 0;padding:8px;border:1px solid #ccc;}' +
      '.warning{margin:12px 0;padding:8px;border:1px solid #c90;background:#fff8d0;}' +
      'table{width:100%;border-collapse:collapse;font-size:13px;}' +
      'th,td{border-bottom:1px solid #ddd;padding:6px;text-align:left;vertical-align:top;}' +
      'th{font-size:12px;color:#333;background:#f3f3f3;}' +
      '.num{width:32px;text-align:right;color:#555;}' +
      '.title{font-weight:600;}' +
      '.coords{font-size:11px;color:#666;margin-top:2px;}' +
      '@media print{body{margin:12mm}.no-print{display:none}}' +
      '</style></head><body>' +
      '<h1>Portal Route</h1>' +
      '<div class="meta">Generated ' + pr.escapeHtml(generatedAt) + '</div>' +
      staleHtml + totalsHtml +
      '<table><thead><tr><th>#</th><th>Portal</th><th>Wait</th><th>Next leg</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<p class="no-print"><button onclick="window.print()">Print</button></p>' +
      '</body></html>';

    var printWindow = window.open('', '_blank');
    if (!printWindow) {
      pr.showMessage('Popup blocked while opening printable route.');
      return;
    }

    try {
      printWindow.document.open('text/html', 'replace');
      printWindow.document.write(html);
      printWindow.document.close();
      if (printWindow.focus) printWindow.focus();
    } catch (e) {
      console.warn('Portal Route: failed to render printable route', e);
      pr.showMessage('Unable to render printable route.');
    }
  };

  pr.ROUTE_LIBRARY_SCHEMA_VERSION = 1;

  pr.routeLibraryNow = function() {
    return new Date().toISOString();
  };

  pr.newRouteLibraryId = function() {
    return 'route-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  };

  pr.getMapSnapshot = function() {
    if (!window.map || !window.map.getCenter || !window.map.getZoom) return null;

    var center = window.map.getCenter();
    if (!center || typeof center.lat !== 'number' || typeof center.lng !== 'number') return null;

    return {
      center: {
        lat: center.lat,
        lng: center.lng
      },
      zoom: window.map.getZoom()
    };
  };

  pr.routeLibrarySettings = function() {
    return {
      defaultStopMinutes: pr.state.settings.defaultStopMinutes,
      includeReturnToStart: !!pr.state.settings.includeReturnToStart,
      routingProvider: pr.state.settings.routingProvider || pr.ROUTING_PROVIDERS.google,
      defaultTravelMode: pr.state.settings.defaultTravelMode || pr.TRAVEL_MODES.drive,
      driveSpeedMph: pr.state.settings.driveSpeedMph,
      bikeSpeedMph: pr.state.settings.bikeSpeedMph,
      walkSpeedMph: pr.state.settings.walkSpeedMph
    };
  };

  pr.serializeRouteLibraryStops = function() {
    return pr.state.stops.map(function(stop) {
      return {
        guid: stop.guid || null,
        type: stop.type || (stop.guid ? 'portal' : 'map'),
        title: stop.title || ((stop.type || (stop.guid ? 'portal' : 'map')) === 'map' ? 'Map point' : 'Unnamed portal'),
        lat: Number(stop.lat),
        lng: Number(stop.lng),
        stopMinutes: typeof stop.stopMinutes === 'number' ? stop.stopMinutes : null,
        startOnMe: !!stop.startOnMe,
        home: (stop.type || (stop.guid ? 'portal' : 'map')) === 'map' && !!stop.home,
        accuracy: typeof stop.accuracy === 'number' ? stop.accuracy : null,
        updatedAt: stop.updatedAt || null
      };
    });
  };

  pr.suggestRouteName = function() {
    if (pr.state.stops.length) {
      var first = pr.state.stops[0] && pr.state.stops[0].title ? pr.state.stops[0].title : 'Route';
      return first + ' route';
    }
    return 'New route';
  };

  pr.makeRouteRecord = function(existing, name) {
    var now = pr.routeLibraryNow();
    var record = existing && typeof existing === 'object' ? existing : {};

    return {
      schemaVersion: pr.ROUTE_LIBRARY_SCHEMA_VERSION,
      pluginVersion: pr.VERSION,
      id: record.id || pr.newRouteLibraryId(),
      name: name || record.name || pr.suggestRouteName(),
      createdAt: record.createdAt || now,
      updatedAt: now,
      map: pr.getMapSnapshot(),
      route: {
        stops: pr.serializeRouteLibraryStops()
      },
      settings: pr.routeLibrarySettings()
    };
  };

  pr.emptyRouteLibrary = function() {
    return {
      schemaVersion: pr.ROUTE_LIBRARY_SCHEMA_VERSION,
      plugin: pr.ID,
      pluginVersion: pr.VERSION,
      updatedAt: pr.routeLibraryNow(),
      routes: []
    };
  };

  pr.normalizeRouteLibrary = function(library) {
    if (!library || typeof library !== 'object' || !Array.isArray(library.routes)) {
      return pr.emptyRouteLibrary();
    }

    var normalized = {
      schemaVersion: library.schemaVersion || pr.ROUTE_LIBRARY_SCHEMA_VERSION,
      plugin: library.plugin || pr.ID,
      pluginVersion: library.pluginVersion || pr.VERSION,
      updatedAt: library.updatedAt || null,
      routes: []
    };

    library.routes.forEach(function(route) {
      var record = pr.normalizeRouteRecord(route, {
        keepUpdatedAt: true
      });
      if (record) normalized.routes.push(record);
    });

    if (!normalized.updatedAt) normalized.updatedAt = pr.routeLibraryNow();
    return normalized;
  };

  pr.loadRouteLibrary = function() {
    var raw = localStorage.getItem(pr.STORAGE_KEYS.routeLibrary);
    if (!raw) return pr.emptyRouteLibrary();

    try {
      return pr.normalizeRouteLibrary(JSON.parse(raw));
    } catch (e) {
      console.warn('Portal Route: failed to load route library', e);
      return pr.emptyRouteLibrary();
    }
  };

  pr.saveRouteLibrary = function(library) {
    library = pr.normalizeRouteLibrary(library);
    library.updatedAt = pr.routeLibraryNow();
    localStorage.setItem(pr.STORAGE_KEYS.routeLibrary, JSON.stringify(library));
  };

  pr.findLibraryRoute = function(library, id) {
    if (!library || !Array.isArray(library.routes) || !id) return null;
    for (var i = 0; i < library.routes.length; i++) {
      if (library.routes[i] && library.routes[i].id === id) return library.routes[i];
    }
    return null;
  };

  pr.normalizeRouteRecord = function(record, options) {
    options = options || {};
    if (!record || typeof record !== 'object') return null;
    if (record.schemaVersion !== pr.ROUTE_LIBRARY_SCHEMA_VERSION) return null;

    var route = record.route || {};
    if (!Array.isArray(route.stops)) return null;

    var stops = route.stops.map(pr.normalizeImportedStop).filter(Boolean);
    if (stops.length !== route.stops.length) return null;

    var now = pr.routeLibraryNow();
    var id = options.newId ? pr.newRouteLibraryId() : (record.id || pr.newRouteLibraryId());
    var name = String(record.name || 'Imported route').trim() || 'Imported route';
    if (options.nameSuffix) name += ' ' + options.nameSuffix;

    return {
      schemaVersion: pr.ROUTE_LIBRARY_SCHEMA_VERSION,
      pluginVersion: record.pluginVersion || pr.VERSION,
      id: id,
      name: name,
      createdAt: options.newId ? now : (record.createdAt || now),
      updatedAt: options.keepUpdatedAt ? (record.updatedAt || now) : now,
      map: record.map && typeof record.map === 'object' ? record.map : null,
      route: {
        stops: stops
      },
      settings: record.settings && typeof record.settings === 'object' ? record.settings : {}
    };
  };

  pr.prepareImportedRouteRecord = function(record, library) {
    var id = record && record.id;
    var duplicate = !!pr.findLibraryRoute(library, id);
    return pr.normalizeRouteRecord(record, {
      newId: duplicate,
      nameSuffix: duplicate ? 'imported' : '',
      keepUpdatedAt: !duplicate
    });
  };

  pr.storageBackends = pr.storageBackends || {};

  pr.localRouteStorage = {
    id: 'local',
    label: 'This browser',
    loadLibrary: function() {
      return pr.loadRouteLibrary();
    },
    saveLibrary: function(library) {
      pr.saveRouteLibrary(library);
      return library;
    },
    listRoutes: function() {
      return this.loadLibrary().routes.slice().sort(function(a, b) {
        return String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''));
      });
    },
    getRoute: function(id) {
      return pr.findLibraryRoute(this.loadLibrary(), id);
    },
    saveRoute: function(route) {
      var library = this.loadLibrary();
      var replaced = false;

      library.routes = library.routes.map(function(existing) {
        if (existing && existing.id === route.id) {
          replaced = true;
          return route;
        }
        return existing;
      });

      if (!replaced) library.routes.push(route);
      this.saveLibrary(library);
      return route;
    },
    deleteRoute: function(id) {
      var library = this.loadLibrary();
      var before = library.routes.length;
      library.routes = library.routes.filter(function(route) {
        return route && route.id !== id;
      });
      this.saveLibrary(library);
      return library.routes.length !== before;
    }
  };

  pr.storageBackends.local = pr.localRouteStorage;

  pr.driveStorage = {
    id: 'googleDrive',
    label: 'Google Drive',
    loadLibrary: function() {
      return pr.loadDriveRouteLibraryCache();
    },
    saveLibrary: function(library) {
      library = pr.saveDriveRouteLibraryCache(library);
      pr.pushDriveRouteLibrarySoon();
      return library;
    },
    listRoutes: function() {
      return this.loadLibrary().routes.slice().sort(function(a, b) {
        return String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''));
      });
    },
    getRoute: function(id) {
      return pr.findLibraryRoute(this.loadLibrary(), id);
    },
    saveRoute: function(route) {
      var library = this.loadLibrary();
      var replaced = false;

      library.routes = library.routes.map(function(existing) {
        if (existing && existing.id === route.id) {
          replaced = true;
          return route;
        }
        return existing;
      });

      if (!replaced) library.routes.push(route);
      this.saveLibrary(library);
      return route;
    },
    deleteRoute: function(id) {
      var library = this.loadLibrary();
      var before = library.routes.length;
      library.routes = library.routes.filter(function(route) {
        return route && route.id !== id;
      });
      this.saveLibrary(library);
      return library.routes.length !== before;
    }
  };

  pr.storageBackends.googleDrive = pr.driveStorage;

  pr.routeLibraryStorage = function() {
    var backendId = pr.state.routeLibraryBackendId || 'local';
    return pr.storageBackends[backendId] || pr.localRouteStorage;
  };

  pr.setRouteLibraryBackend = function(backendId) {
    if (!pr.storageBackends[backendId]) backendId = 'local';
    pr.state.routeLibraryBackendId = backendId;
    pr.state.selectedLibraryRouteIds = [];
    pr.refreshRouteLibraryPanel();
  };

  pr.promptRouteName = function(defaultName) {
    if (!window.prompt) return defaultName || pr.suggestRouteName();

    var name = window.prompt('Route name', defaultName || pr.suggestRouteName());
    if (name === null) return null;

    name = String(name).trim();
    return name || pr.suggestRouteName();
  };

  pr.saveCurrentRouteToLibrary = function() {
    if (!pr.state.stops.length) {
      pr.showMessage('No route to save.');
      return null;
    }

    var storage = pr.routeLibraryStorage();
    var existing = storage.getRoute(pr.state.activeRouteId);
    var name = pr.promptRouteName(existing && existing.name);
    if (name === null) return null;

    var record = pr.makeRouteRecord(existing, name);
    storage.saveRoute(record);
    pr.state.activeRouteId = record.id;
    pr.showMessage('Route saved.');
    return record;
  };

  pr.saveCurrentRouteAsNewLibraryRoute = function() {
    if (!pr.state.stops.length) {
      pr.showMessage('No route to save.');
      return null;
    }

    var name = pr.promptRouteName(pr.suggestRouteName());
    if (name === null) return null;

    var record = pr.makeRouteRecord(null, name);
    pr.routeLibraryStorage().saveRoute(record);
    pr.state.activeRouteId = record.id;
    pr.state.selectedLibraryRouteIds = [record.id];
    pr.refreshRouteLibraryPanel();
    pr.showMessage('Route saved.');
    return record;
  };

  pr.saveCurrentRouteFromLibraryPanel = function() {
    var ids = pr.getSelectedLibraryRouteIds();
    if (ids.length > 1) {
      pr.showMessage('Select one route to overwrite, or uncheck routes to save new.');
      return;
    }

    if (ids.length === 1) {
      pr.updateSavedRouteFromCurrent(ids[0]);
      return;
    }

    pr.saveCurrentRouteAsNewLibraryRoute();
  };

  pr.setSavedRouteName = function(id, name) {
    var storage = pr.routeLibraryStorage();
    var library = storage.loadLibrary();
    var route = pr.findLibraryRoute(library, id);
    if (!route) {
      pr.showMessage('Saved route not found.');
      return false;
    }

    name = String(name == null ? '' : name).trim();
    if (!name) {
      pr.showMessage('Route name cannot be empty.');
      return false;
    }

    route.name = name;
    route.updatedAt = pr.routeLibraryNow();
    storage.saveLibrary(library);
    pr.showMessage('Route renamed.');
    return true;
  };

  pr.deleteSavedRoute = function(id) {
    if (!id) return;
    var storage = pr.routeLibraryStorage();
    var route = storage.getRoute(id);
    if (!route) {
      pr.showMessage('Saved route not found.');
      return;
    }

    if (window.confirm && !window.confirm('Delete saved route "' + (route.name || 'Unnamed route') + '"?')) return;

    if (storage.deleteRoute(id)) {
      if (pr.state.activeRouteId === id) pr.state.activeRouteId = null;
      pr.refreshRouteLibraryPanel();
      pr.showMessage('Route deleted.');
    }
  };

  pr.updateSavedRouteFromCurrent = function(id) {
    if (!id) return;
    if (!pr.state.stops.length) {
      pr.showMessage('No route to save.');
      return;
    }

    var existing = pr.routeLibraryStorage().getRoute(id);
    if (!existing) {
      pr.showMessage('Saved route not found.');
      return;
    }

    if (window.confirm && !window.confirm('Overwrite "' + (existing.name || 'Unnamed route') + '" with current route?')) return;

    var record = pr.makeRouteRecord(existing, existing.name);
    pr.routeLibraryStorage().saveRoute(record);
    pr.state.activeRouteId = record.id;
    pr.refreshRouteLibraryPanel();
    pr.showMessage('Route updated.');
  };

  pr.getSelectedLibraryRouteIds = function() {
    var storage = pr.routeLibraryStorage();
    var library = storage.loadLibrary();
    var ids = Array.isArray(pr.state.selectedLibraryRouteIds) ? pr.state.selectedLibraryRouteIds : [];
    var selected = ids.filter(function(id, index) {
      return ids.indexOf(id) === index && !!pr.findLibraryRoute(library, id);
    });

    if (selected.length !== ids.length) pr.state.selectedLibraryRouteIds = selected;
    return selected;
  };

  pr.setLibraryRouteSelected = function(id, selected) {
    if (!id) return;
    var ids = pr.getSelectedLibraryRouteIds();
    var index = ids.indexOf(id);

    if (selected && index === -1) ids.push(id);
    if (!selected && index !== -1) ids.splice(index, 1);

    pr.state.selectedLibraryRouteIds = ids;
  };

  pr.requireSingleSelectedLibraryRouteId = function() {
    var ids = pr.getSelectedLibraryRouteIds();
    if (ids.length !== 1) {
      pr.showMessage('Select one route first.');
      return null;
    }
    return ids[0];
  };

  pr.requireSelectedLibraryRouteIds = function() {
    var ids = pr.getSelectedLibraryRouteIds();
    if (!ids.length) {
      pr.showMessage('Select a route first.');
      return null;
    }
    return ids;
  };

  pr.applyRouteLibrarySettings = function(settings) {
    if (!settings || typeof settings !== 'object') return;

    if (typeof settings.defaultStopMinutes === 'number' && isFinite(settings.defaultStopMinutes) && settings.defaultStopMinutes >= 0) {
      pr.state.settings.defaultStopMinutes = Math.round(settings.defaultStopMinutes);
    }

    if (typeof settings.includeReturnToStart === 'boolean') {
      pr.state.settings.includeReturnToStart = settings.includeReturnToStart;
    }

    if (settings.routingProvider === pr.ROUTING_PROVIDERS.google ||
        settings.routingProvider === pr.ROUTING_PROVIDERS.ors) {
      pr.state.settings.routingProvider = settings.routingProvider;
    }

    if (settings.defaultTravelMode === pr.TRAVEL_MODES.drive ||
        settings.defaultTravelMode === pr.TRAVEL_MODES.bike ||
        settings.defaultTravelMode === pr.TRAVEL_MODES.walk) {
      pr.state.settings.defaultTravelMode = settings.defaultTravelMode;
    }

    ['driveSpeedMph', 'bikeSpeedMph', 'walkSpeedMph'].forEach(function(key) {
      var value = Number(settings[key]);
      if (isFinite(value) && value > 0) pr.state.settings[key] = value;
    });
  };

  pr.applyRouteRecord = function(record) {
    if (!record || record.schemaVersion !== pr.ROUTE_LIBRARY_SCHEMA_VERSION) {
      pr.showMessage('Saved route is not compatible.');
      return false;
    }

    var route = record.route || {};
    if (!Array.isArray(route.stops)) {
      pr.showMessage('Saved route has no stops.');
      return false;
    }

    var stops = route.stops.map(pr.normalizeImportedStop).filter(Boolean);
    if (stops.length !== route.stops.length) {
      pr.showMessage('Saved route has invalid stops.');
      return false;
    }

    if (pr.pushUndoSnapshot) pr.pushUndoSnapshot('load route');

    pr.state.stops = stops;
    pr.applyRouteLibrarySettings(record.settings);
    pr.state.route = null;
    pr.state.routeDirty = stops.length >= 2;
    pr.state.selectedMapPointIndex = null;
    pr.state.activeRouteId = record.id || null;

    pr.saveSettings();
    pr.saveStops();
    pr.saveRoute();
    pr.clearRouteLine();
    pr.redrawLabels();
    pr.renderPanel();
    if (pr.state.pointsPanelOpen) pr.renderPointsPanel();
    pr.renderMiniControl();
    pr.queueRouteCalculationIfReady();
    pr.hydrateStopTitles();

    if (record.map && record.map.center && window.map && window.map.setView &&
        typeof record.map.center.lat === 'number' &&
        typeof record.map.center.lng === 'number' &&
        typeof record.map.zoom === 'number') {
      window.map.setView([record.map.center.lat, record.map.center.lng], record.map.zoom);
    }

    pr.showMessage('Route loaded.');
    return true;
  };

  pr.closeRouteLibraryPanel = function() {
    var content = document.getElementById(pr.DOM_IDS.routeLibraryContent);
    if (content && window.jQuery) {
      try {
        window.jQuery(content).closest('.ui-dialog-content').dialog('close');
        return;
      } catch (e) {
        // Fall through to hiding the content if the dialog wrapper is unavailable.
      }
    }
    if (content) content.style.display = 'none';
  };

  pr.routeRecordFilename = function(route) {
    var safeName = String(route && route.name ? route.name : 'route')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'route';
    return 'portal-route-' + safeName + '.json';
  };

  pr.routeLibraryFilename = function() {
    var stamp = new Date().toISOString().replace(/[:.]/g, '-');
    return 'portal-route-library-' + stamp + '.json';
  };

  pr.exportSavedRouteJson = function(id) {
    if (!id) return;
    var route = pr.routeLibraryStorage().getRoute(id);
    if (!route) {
      pr.showMessage('Saved route not found.');
      return;
    }

    pr.downloadTextFile(pr.routeRecordFilename(route), JSON.stringify(route, null, 2), 'application/json');
    pr.showMessage('Saved route exported.');
  };

  pr.exportRouteLibraryJson = function() {
    var library = pr.routeLibraryStorage().loadLibrary();
    pr.exportRouteLibraryRoutesJson(library.routes, 'Route library exported.');
  };

  pr.exportRouteLibraryRoutesJson = function(routes, message) {
    var data = {
      schemaVersion: pr.ROUTE_LIBRARY_SCHEMA_VERSION,
      plugin: pr.ID,
      pluginVersion: pr.VERSION,
      exportedAt: pr.routeLibraryNow(),
      routes: routes
    };

    pr.downloadTextFile(pr.routeLibraryFilename(), JSON.stringify(data, null, 2), 'application/json');
    pr.showMessage(message || 'Route library exported.');
  };

  pr.exportSelectedSavedRoutesJson = function() {
    var ids = pr.requireSelectedLibraryRouteIds();
    if (!ids) return;

    var library = pr.routeLibraryStorage().loadLibrary();
    var routes = ids.map(function(id) {
      return pr.findLibraryRoute(library, id);
    }).filter(Boolean);

    if (routes.length === 1) {
      pr.exportSavedRouteJson(routes[0].id);
      return;
    }

    pr.exportRouteLibraryRoutesJson(routes, routes.length + ' saved routes exported.');
  };

  pr.deleteSelectedSavedRoutes = function() {
    var ids = pr.requireSelectedLibraryRouteIds();
    if (!ids) return;

    if (ids.length === 1) {
      pr.deleteSavedRoute(ids[0]);
      return;
    }

    if (window.confirm && !window.confirm('Delete ' + ids.length + ' saved routes?')) return;

    var storage = pr.routeLibraryStorage();
    var library = storage.loadLibrary();
    var idMap = {};
    ids.forEach(function(id) { idMap[id] = true; });
    library.routes = library.routes.filter(function(route) {
      return route && !idMap[route.id];
    });
    storage.saveLibrary(library);

    if (idMap[pr.state.activeRouteId]) pr.state.activeRouteId = null;
    pr.state.selectedLibraryRouteIds = [];
    pr.refreshRouteLibraryPanel();
    pr.showMessage(ids.length + ' routes deleted.');
  };

  pr.readJsonFile = function(onData, onError) {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.style.display = 'none';

    input.addEventListener('change', function() {
      var file = input.files && input.files[0];
      if (!file) {
        if (input.parentNode) input.parentNode.removeChild(input);
        return;
      }

      var reader = new FileReader();
      reader.onload = function() {
        try {
          onData(JSON.parse(String(reader.result || '')));
        } catch (e) {
          if (onError) onError(e);
        }
        if (input.parentNode) input.parentNode.removeChild(input);
      };
      reader.onerror = function() {
        if (onError) onError(new Error('Unable to read file.'));
        if (input.parentNode) input.parentNode.removeChild(input);
      };
      reader.readAsText(file);
    });

    document.body.appendChild(input);
    input.click();
  };

  pr.importSavedRouteRecord = function(record) {
    var storage = pr.routeLibraryStorage();
    var library = storage.loadLibrary();
    var imported = pr.prepareImportedRouteRecord(record, library);
    if (!imported) throw new Error('JSON is not a compatible saved route.');

    library.routes.push(imported);
    storage.saveLibrary(library);
    pr.refreshRouteLibraryPanel();
    pr.showMessage('Saved route imported.');
  };

  pr.importSavedRouteJson = function() {
    pr.readJsonFile(function(data) {
      try {
        pr.importSavedRouteRecord(data);
      } catch (e) {
        console.warn('Portal Route: saved route import failed', e);
        pr.showMessage('Route import failed: ' + e.message);
      }
    }, function(e) {
      pr.showMessage('Route import failed: ' + e.message);
    });
  };

  pr.importRouteLibraryData = function(data) {
    if (!data || typeof data !== 'object') throw new Error('Import data is not an object.');
    if (data.schemaVersion !== pr.ROUTE_LIBRARY_SCHEMA_VERSION) throw new Error('Route library version is not compatible.');
    if (!Array.isArray(data.routes)) throw new Error('Import data does not contain routes.');

    var storage = pr.routeLibraryStorage();
    var library = storage.loadLibrary();
    var added = 0;

    data.routes.forEach(function(route) {
      var imported = pr.prepareImportedRouteRecord(route, library);
      if (!imported) return;
      library.routes.push(imported);
      added += 1;
    });

    storage.saveLibrary(library);
    pr.refreshRouteLibraryPanel();
    pr.showMessage(added ? 'Imported ' + added + ' saved routes.' : 'No routes imported.');
  };

  pr.renderRouteLibraryStorageControls = function(storage) {
    var driveReady = pr.isDriveReady();
    var driveState = pr.driveStatusText();
    var html = '';

    html += '<div class="portal-route-library-storage">';
    html += '<label>Store <select data-field="route-library-backend">';
    html += '<option value="local"' + (storage.id === 'local' ? ' selected' : '') + '>This browser</option>';
    html += '<option value="googleDrive"' + (storage.id === 'googleDrive' ? ' selected' : '') + '>Google Drive</option>';
    html += '</select></label>';
    html += '<span>' + pr.escapeHtml(driveState) + '</span>';
    html += '</div>';

    if (storage.id === 'googleDrive') {
      html += '<div class="portal-route-control-group-buttons portal-route-library-toolbar">';
      html += '<button type="button" data-action="drive-connect">' + (driveReady ? 'Change Folder' : 'Connect Drive') + '</button>';
      html += '<button type="button" data-action="drive-pull"' + (driveReady ? '' : ' disabled') + '>Pull Drive</button>';
      html += '<button type="button" data-action="drive-push"' + (driveReady ? '' : ' disabled') + '>Push Drive</button>';
      html += '</div>';
    }

    return html;
  };

  pr.importRouteLibraryJson = function() {
    pr.readJsonFile(function(data) {
      try {
        pr.importRouteLibraryData(data);
      } catch (e) {
        console.warn('Portal Route: route library import failed', e);
        pr.showMessage('Library import failed: ' + e.message);
      }
    }, function(e) {
      pr.showMessage('Library import failed: ' + e.message);
    });
  };

  pr.renderRouteLibraryRows = function(routes) {
    if (!routes.length) {
      return '<p class="portal-route-empty">No saved routes.</p>';
    }

    var html = '<div class="portal-route-library-list">';
    var selectedIds = pr.getSelectedLibraryRouteIds();
    routes.forEach(function(route) {
      var stopCount = route.route && Array.isArray(route.route.stops) ? route.route.stops.length : 0;
      var selected = selectedIds.indexOf(route.id) !== -1;
      html += '<div class="portal-route-library-row' + (selected ? ' portal-route-library-row-selected' : '') + '">';
      html += '<label class="portal-route-library-select" aria-label="Select route"><input type="checkbox" data-field="selected-library-route" data-route-id="' + pr.escapeHtml(route.id) + '"' + (selected ? ' checked' : '') + '></label>';
      html += '<div class="portal-route-library-info">';
      html += '<input type="text" class="portal-route-library-name-input" value="' + pr.escapeHtml(route.name || 'Unnamed route') + '" data-field="saved-route-name" data-route-id="' + pr.escapeHtml(route.id) + '" aria-label="Edit route name">';
      html += '<span>' + stopCount + ' stops - ' + pr.escapeHtml(route.updatedAt || '') + '</span>';
      html += '</div>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  };

  pr.renderRouteLibraryContent = function() {
    var storage = pr.routeLibraryStorage();
    var routes = storage.listRoutes();
    var selectedCount = pr.getSelectedLibraryRouteIds().length;
    var singleDisabled = selectedCount === 1 ? '' : ' disabled';
    var saveDisabled = selectedCount <= 1 ? '' : ' disabled';
    var anyDisabled = selectedCount ? '' : ' disabled';
    var contentHtml = '';
    contentHtml += '<div class="portal-route-library-source">Stored in: ' + pr.escapeHtml(storage.label || storage.id || 'Route library') + '</div>';
    contentHtml += pr.renderRouteLibraryStorageControls(storage);
    contentHtml += '<div class="portal-route-control-group-buttons portal-route-library-toolbar">';
    contentHtml += '<button type="button" data-action="export-route-library">Export Library</button>';
    contentHtml += '<button type="button" data-action="import-route-library">Import Library</button>';
    contentHtml += '</div>';
    contentHtml += '<div class="portal-route-library-scroll-body">';
    contentHtml += pr.renderRouteLibraryRows(routes);
    contentHtml += '</div>';
    contentHtml += '<div class="portal-route-library-footer">';
    if (selectedCount === 1) {
      contentHtml += '<div class="portal-route-library-tip">' + selectedCount + ' route selected. Save will overwrite it after confirmation.</div>';
    } else if (selectedCount > 1) {
      contentHtml += '<div class="portal-route-library-tip portal-route-library-tip-active">Select one route to load or save over. Export/Delete can use multiple.</div>';
    } else {
      contentHtml += '<div class="portal-route-library-tip portal-route-library-tip-active">Save creates a new route. Select one route to load or overwrite.</div>';
    }
    contentHtml += '<div class="portal-route-control-group-buttons portal-route-footer-actions portal-route-library-actions">';
    contentHtml += '<button type="button" data-action="save-route-from-library"' + saveDisabled + '>Save</button>';
    contentHtml += '<button type="button" data-action="load-selected-saved-route"' + singleDisabled + '>Load</button>';
    contentHtml += '<button type="button" data-action="import-saved-route">Import</button>';
    contentHtml += '<button type="button" data-action="export-selected-saved-route"' + anyDisabled + '>Export</button>';
    contentHtml += '<button type="button" data-action="delete-selected-saved-route"' + anyDisabled + '>Delete</button>';
    contentHtml += pr.mainMenuButton('Menu', 'portal-route-library-menu-button');
    contentHtml += '</div>';
    contentHtml += '<div class="portal-route-message"></div>';
    contentHtml += '</div>';
    return contentHtml;
  };

  pr.refreshRouteLibraryPanel = function() {
    var content = document.getElementById(pr.DOM_IDS.routeLibraryContent);
    if (!content || !pr.isDialogOpen || !pr.isDialogOpen(content)) {
      pr.openRouteLibraryPanel();
      return;
    }

    content.innerHTML = pr.renderRouteLibraryContent();
  };

  pr.openRouteLibraryPanel = function() {
    if (pr.cancelAddPointMode) pr.cancelAddPointMode({ silent: true });
    var contentHtml = '<div class="portal-route-dialog-content portal-route-library-dialog-content" id="' + pr.DOM_IDS.routeLibraryContent + '" tabindex="-1">';
    contentHtml += pr.renderRouteLibraryContent();
    contentHtml += '</div>';

    if (typeof window.dialog === 'function') {
      window.dialog({
        id: pr.DOM_IDS.routeLibrary,
        title: 'Route Library',
        html: contentHtml,
        dialogClass: 'portal-route-dialog portal-route-library-dialog',
        width: pr.getRouteLibraryDialogWidth(),
        height: pr.getRouteLibraryDialogHeight()
      });

      var content = document.getElementById(pr.DOM_IDS.routeLibraryContent);
      if (content && pr.focusPanelContainer) pr.focusPanelContainer(content);
    } else {
      console.log('Portal Route: IITC dialog API is unavailable.');
    }
  };

  pr.DRIVE_LIBRARY_FILE_NAME = 'route-library.json';
  pr.DRIVE_DEFAULT_FOLDER_NAME = 'IITC Portal Route';
  pr.DRIVE_API_SCRIPT = 'https://apis.google.com/js/api.js';
  pr.DRIVE_DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
  pr.DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';

  pr.driveState = {
    apiLoading: false,
    apiLoaded: false,
    authorizing: false,
    authorized: false,
    folderId: null,
    folderName: null,
    fileId: null,
    lastError: null,
    pushTimer: null
  };

  pr.getSyncPlugin = function() {
    return window.plugin && window.plugin.sync ? window.plugin.sync : null;
  };

  pr.loadDriveState = function() {
    pr.driveState.folderId = localStorage.getItem(pr.STORAGE_KEYS.routeLibraryDriveFolderId) || null;
    pr.driveState.folderName = localStorage.getItem(pr.STORAGE_KEYS.routeLibraryDriveFolderName) || pr.DRIVE_DEFAULT_FOLDER_NAME;
    pr.driveState.fileId = localStorage.getItem(pr.STORAGE_KEYS.routeLibraryDriveFileId) || null;
  };

  pr.saveDriveState = function() {
    if (pr.driveState.folderId) {
      localStorage.setItem(pr.STORAGE_KEYS.routeLibraryDriveFolderId, pr.driveState.folderId);
    } else {
      localStorage.removeItem(pr.STORAGE_KEYS.routeLibraryDriveFolderId);
    }

    if (pr.driveState.folderName) {
      localStorage.setItem(pr.STORAGE_KEYS.routeLibraryDriveFolderName, pr.driveState.folderName);
    } else {
      localStorage.removeItem(pr.STORAGE_KEYS.routeLibraryDriveFolderName);
    }

    if (pr.driveState.fileId) {
      localStorage.setItem(pr.STORAGE_KEYS.routeLibraryDriveFileId, pr.driveState.fileId);
    } else {
      localStorage.removeItem(pr.STORAGE_KEYS.routeLibraryDriveFileId);
    }
  };

  pr.loadDriveRouteLibraryCache = function() {
    var raw = localStorage.getItem(pr.STORAGE_KEYS.routeLibraryDriveCache);
    if (!raw) return pr.emptyRouteLibrary();

    try {
      return pr.normalizeRouteLibrary(JSON.parse(raw));
    } catch (e) {
      console.warn('Portal Route: failed to load Drive route library cache', e);
      return pr.emptyRouteLibrary();
    }
  };

  pr.saveDriveRouteLibraryCache = function(library) {
    library = pr.normalizeRouteLibrary(library);
    library.updatedAt = pr.routeLibraryNow();
    localStorage.setItem(pr.STORAGE_KEYS.routeLibraryDriveCache, JSON.stringify(library));
    return library;
  };

  pr.getDriveOAuthClientId = function() {
    var settings = pr.state && pr.state.settings ? pr.state.settings : null;
    return settings && typeof settings.googleDriveOAuthClientId === 'string'
      ? settings.googleDriveOAuthClientId.trim()
      : '';
  };

  pr.getGoogleAuthInstance = function() {
    if (!window.gapi || !window.gapi.auth2 || !window.gapi.auth2.getAuthInstance) return null;
    try {
      return window.gapi.auth2.getAuthInstance();
    } catch (e) {
      return null;
    }
  };

  pr.hasSyncDriveSession = function() {
    return !!(pr.getSyncPlugin() && pr.getGoogleAuthInstance());
  };

  pr.getDriveAuthSource = function() {
    if (pr.hasSyncDriveSession()) return 'sync';
    if (pr.getDriveOAuthClientId()) return 'settings';
    return null;
  };

  pr.driveOAuthClientIdRequiredMessage = function() {
    return 'Google Drive needs IITC Sync Google auth or a Portal Route OAuth Client ID in settings.';
  };

  pr.driveActionErrorMessage = function(prefix, error) {
    var detail = error && error.message ? error.message : prefix;
    return prefix === detail ? prefix : prefix + ': ' + detail;
  };

  pr.driveStatusText = function() {
    if (pr.driveState.lastError) return 'Drive: ' + pr.driveState.lastError;
    if (pr.isDriveReady()) return 'Drive: ' + (pr.driveState.folderName || pr.DRIVE_DEFAULT_FOLDER_NAME);
    if (pr.hasSyncDriveSession()) return 'Drive: using IITC Sync auth';
    if (!pr.getDriveOAuthClientId()) return 'Drive: Sync auth or OAuth Client ID required';
    if (pr.driveState.authorizing || pr.driveState.apiLoading) return 'Drive: connecting';
    if (pr.driveState.folderId) return 'Drive: reconnect needed';
    return 'Drive: not connected';
  };

  pr.isDriveReady = function() {
    return !!(pr.driveState.authorized && pr.driveState.folderId && pr.driveState.fileId);
  };

  pr.driveEscapeQueryValue = function(value) {
    return String(value || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  };

  pr.loadGoogleDriveApi = function() {
    if (pr.driveState.apiLoaded && window.gapi) return Promise.resolve();
    if (pr.driveApiPromise) return pr.driveApiPromise;

    pr.driveState.apiLoading = true;
    pr.driveState.lastError = null;

    pr.driveApiPromise = new Promise(function(resolve, reject) {
      var finish = function() {
        pr.driveState.apiLoading = false;
        pr.driveState.apiLoaded = true;
        resolve();
      };

      if (window.gapi) {
        finish();
        return;
      }

      var script = document.createElement('script');
      script.src = pr.DRIVE_API_SCRIPT;
      script.onload = finish;
      script.onerror = function() {
        pr.driveState.apiLoading = false;
        pr.driveApiPromise = null;
        reject(new Error('Could not load Google API.'));
      };
      document.head.appendChild(script);
    });

    return pr.driveApiPromise;
  };

  pr.loadDriveClientApi = function() {
    return new Promise(function(resolve, reject) {
      window.gapi.load('client', {
        callback: resolve,
        onerror: function() { reject(new Error('Could not initialize Google API client.')); }
      });
    }).then(function() {
      if (window.gapi.client && window.gapi.client.drive && window.gapi.client.drive.files) return;
      return window.gapi.client.load('drive', 'v3');
    });
  };

  pr.authorizeDrive = function() {
    pr.loadDriveState();
    var authSource = pr.getDriveAuthSource();
    var clientId = authSource === 'settings' ? pr.getDriveOAuthClientId() : '';
    if (!authSource) {
      var configError = new Error(pr.driveOAuthClientIdRequiredMessage());
      pr.driveState.authorized = false;
      pr.driveState.lastError = 'Sync auth or OAuth Client ID required';
      pr.refreshRouteLibraryPanel();
      return Promise.reject(configError);
    }

    pr.driveState.authorizing = true;
    pr.driveState.authorized = false;
    pr.driveState.lastError = null;
    pr.refreshRouteLibraryPanel();

    return pr.loadGoogleDriveApi()
      .then(function() {
        if (authSource === 'sync') return pr.loadDriveClientApi();
        return new Promise(function(resolve, reject) {
          window.gapi.load('client:auth2', {
            callback: resolve,
            onerror: function() { reject(new Error('Could not initialize Google auth.')); }
          });
        });
      })
      .then(function() {
        if (authSource === 'sync') return;
        return window.gapi.client.init({
          discoveryDocs: pr.DRIVE_DISCOVERY_DOCS,
          client_id: clientId,
          scope: pr.DRIVE_SCOPE
        });
      })
      .then(function() {
        var auth = pr.getGoogleAuthInstance();
        if (!auth) throw new Error('Google auth is not ready. Connect IITC Sync or enter a Portal Route OAuth Client ID.');
        if (auth.isSignedIn.get()) return true;
        return auth.signIn().then(function() { return true; });
      })
      .then(function() {
        pr.driveState.authorizing = false;
        pr.driveState.authorized = true;
        pr.refreshRouteLibraryPanel();
      })
      .catch(function(error) {
        pr.driveState.authorizing = false;
        pr.driveState.authorized = false;
        pr.driveState.lastError = error && error.message ? error.message : 'Drive connect failed.';
        pr.refreshRouteLibraryPanel();
        throw error;
      });
  };

  pr.promptDriveFolderName = function() {
    var current = pr.driveState.folderName || pr.DRIVE_DEFAULT_FOLDER_NAME;
    if (!window.prompt) return current;

    var name = window.prompt('Google Drive folder', current);
    if (name === null) return null;

    name = String(name).trim();
    return name || pr.DRIVE_DEFAULT_FOLDER_NAME;
  };

  pr.ensureDriveFolder = function(forcePrompt) {
    var promptedName = forcePrompt || !pr.driveState.folderName ? pr.promptDriveFolderName() : pr.driveState.folderName;
    if (promptedName === null) return Promise.reject(new Error('Drive folder not selected.'));

    pr.driveState.folderName = promptedName;
    pr.saveDriveState();

    if (pr.driveState.folderId && !forcePrompt) return Promise.resolve(pr.driveState.folderId);

    var name = pr.driveEscapeQueryValue(pr.driveState.folderName);
    var q = "name = '" + name + "' and mimeType = 'application/vnd.google-apps.folder' and trashed = false";

    return window.gapi.client.drive.files.list({
      q: q,
      fields: 'files(id,name,modifiedTime)',
      pageSize: 10
    }).then(function(response) {
      var folders = response.result && response.result.files ? response.result.files : [];
      if (folders.length) {
        pr.driveState.folderId = folders[0].id;
        pr.saveDriveState();
        return pr.driveState.folderId;
      }

      return window.gapi.client.drive.files.create({
        fields: 'id',
        resource: {
          name: pr.driveState.folderName,
          mimeType: 'application/vnd.google-apps.folder'
        }
      }).then(function(createResponse) {
        pr.driveState.folderId = createResponse.result.id;
        pr.saveDriveState();
        return pr.driveState.folderId;
      });
    });
  };

  pr.ensureDriveLibraryFile = function(forceFolderPrompt) {
    return pr.ensureDriveFolder(forceFolderPrompt).then(function(folderId) {
      if (pr.driveState.fileId && !forceFolderPrompt) return pr.driveState.fileId;

      var fileName = pr.driveEscapeQueryValue(pr.DRIVE_LIBRARY_FILE_NAME);
      var q = "name = '" + fileName + "' and trashed = false and '" + folderId + "' in parents";

      return window.gapi.client.drive.files.list({
        q: q,
        fields: 'files(id,name,modifiedTime)',
        pageSize: 10
      }).then(function(response) {
        var files = response.result && response.result.files ? response.result.files : [];
        if (files.length) {
          pr.driveState.fileId = files[0].id;
          pr.saveDriveState();
          return pr.driveState.fileId;
        }

        return window.gapi.client.drive.files.create({
          fields: 'id',
          resource: {
            name: pr.DRIVE_LIBRARY_FILE_NAME,
            mimeType: 'application/json',
            parents: [folderId]
          }
        }).then(function(createResponse) {
          pr.driveState.fileId = createResponse.result.id;
          pr.saveDriveState();
          return pr.writeDriveRouteLibrary(pr.loadDriveRouteLibraryCache());
        });
      });
    });
  };

  pr.readDriveRouteLibrary = function() {
    return pr.authorizeDrive().then(function() {
      return pr.ensureDriveLibraryFile();
    }).then(function() {
      return window.gapi.client.drive.files.get({
        fileId: pr.driveState.fileId,
        alt: 'media'
      });
    }).then(function(response) {
      var data = response.result;
      if (typeof data === 'string' && data) data = JSON.parse(data);
      var library = data && typeof data === 'object' ? pr.normalizeRouteLibrary(data) : pr.emptyRouteLibrary();
      pr.saveDriveRouteLibraryCache(library);
      pr.state.routeLibraryBackendId = 'googleDrive';
      pr.state.selectedLibraryRouteIds = [];
      pr.refreshRouteLibraryPanel();
      pr.showMessage('Drive library loaded.');
      return library;
    }).catch(function(error) {
      pr.driveState.lastError = error && error.message ? error.message : 'Drive load failed.';
      pr.refreshRouteLibraryPanel();
      pr.showMessage(pr.driveActionErrorMessage('Drive load failed.', error));
    });
  };

  pr.writeDriveRouteLibrary = function(library) {
    library = pr.saveDriveRouteLibraryCache(library);

    return window.gapi.client.request({
      path: '/upload/drive/v3/files/' + pr.driveState.fileId,
      method: 'PATCH',
      params: { uploadType: 'media' },
      body: JSON.stringify(library, null, 2)
    }).then(function() {
      pr.driveState.lastError = null;
      pr.refreshRouteLibraryPanel();
      return library;
    });
  };

  pr.pushDriveRouteLibrary = function() {
    return pr.authorizeDrive().then(function() {
      return pr.ensureDriveLibraryFile();
    }).then(function() {
      return pr.writeDriveRouteLibrary(pr.loadDriveRouteLibraryCache());
    }).then(function() {
      pr.showMessage('Drive library saved.');
    }).catch(function(error) {
      pr.driveState.lastError = error && error.message ? error.message : 'Drive save failed.';
      pr.refreshRouteLibraryPanel();
      pr.showMessage(pr.driveActionErrorMessage('Drive save failed.', error));
    });
  };

  pr.pushDriveRouteLibrarySoon = function() {
    if (pr.state.routeLibraryBackendId !== 'googleDrive') return;
    if (!pr.isDriveReady()) return;

    if (pr.driveState.pushTimer) window.clearTimeout(pr.driveState.pushTimer);
    pr.driveState.pushTimer = window.setTimeout(function() {
      pr.driveState.pushTimer = null;
      pr.pushDriveRouteLibrary();
    }, 500);
  };

  pr.connectDriveRouteLibrary = function() {
    pr.loadDriveState();
    return pr.authorizeDrive().then(function() {
      return pr.ensureDriveLibraryFile();
    }).then(function() {
      pr.state.routeLibraryBackendId = 'googleDrive';
      pr.refreshRouteLibraryPanel();
      pr.showMessage('Drive connected.');
    }).catch(function(error) {
      console.warn('Portal Route: Drive connect failed', error);
      pr.driveState.lastError = error && error.message ? error.message : 'Drive connect failed.';
      pr.refreshRouteLibraryPanel();
      pr.showMessage(pr.driveActionErrorMessage('Drive connect failed.', error));
    });
  };

  pr.chooseDriveRouteLibraryFolder = function() {
    pr.loadDriveState();
    pr.driveState.folderId = null;
    pr.driveState.fileId = null;
    pr.saveDriveState();

    return pr.authorizeDrive().then(function() {
      return pr.ensureDriveLibraryFile(true);
    }).then(function() {
      pr.state.routeLibraryBackendId = 'googleDrive';
      pr.refreshRouteLibraryPanel();
      pr.showMessage('Drive folder ready.');
    }).catch(function(error) {
      console.warn('Portal Route: Drive folder setup failed', error);
      pr.driveState.lastError = error && error.message ? error.message : 'Drive folder setup failed.';
      pr.refreshRouteLibraryPanel();
      pr.showMessage(pr.driveActionErrorMessage('Drive folder setup failed.', error));
    });
  };

  pr.loadDriveState();

  pr.bulkSelect = pr.bulkSelect || {
    mode: null,
    layer: null,
    control: null,
    points: [],
    previewStops: [],
    previewStartGuid: null,
    previewEndGuid: null
  };

  pr.ensureBulkSelectLayer = function() {
    if (!window.L || !window.map) return null;
    if (!pr.bulkSelect.layer) {
      pr.bulkSelect.layer = L.layerGroup().addTo(pr.routeOverlayTarget());
    }
    return pr.bulkSelect.layer;
  };

  pr.clearBulkSelectLayer = function() {
    if (pr.bulkSelect.layer) pr.bulkSelect.layer.clearLayers();
  };

  pr.removeBulkSelectControl = function() {
    if (pr.bulkSelect.control && window.map) {
      try {
        window.map.removeControl(pr.bulkSelect.control);
      } catch (e) {
        console.warn('Portal Route: unable to remove bulk select control', e);
      }
    }
    pr.bulkSelect.control = null;
  };

  pr.bulkSelectControlHtml = function(mode) {
    var title = mode === 'polygon' ? 'Draw polygon' : 'Draw circle';
    var help = mode === 'polygon'
      ? 'Tap portals area points. Finish after 3+ points.'
      : 'Tap center, then edge.';

    return '' +
      '<div class="portal-route-bulk-select-control-title">' + pr.escapeHtml(title) + '</div>' +
      '<div class="portal-route-bulk-select-control-help">' + pr.escapeHtml(help) + '</div>' +
      '<div class="portal-route-bulk-select-control-buttons">' +
      '<button type="button" data-portal-route-bulk-action="finish"' + (mode === 'polygon' ? '' : ' disabled') + '>Finish</button>' +
      '<button type="button" data-portal-route-bulk-action="cancel">Cancel</button>' +
      '</div>';
  };

  pr.updateBulkSelectControl = function() {
    var container = document.querySelector('.portal-route-bulk-select-control');
    if (!container) return;
    container.innerHTML = pr.bulkSelectControlHtml(pr.bulkSelect.mode);
    var finish = container.querySelector('[data-portal-route-bulk-action="finish"]');
    if (finish) finish.disabled = pr.bulkSelect.mode !== 'polygon' || pr.bulkSelect.points.length < 3;
  };

  pr.showBulkSelectControl = function(mode) {
    if (!window.L || !window.map) return;
    pr.removeBulkSelectControl();

    var BulkSelectControl = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: function() {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control portal-route-bulk-select-control');
        container.innerHTML = pr.bulkSelectControlHtml(mode);
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);
        container.addEventListener('click', function(ev) {
          var button = ev.target.closest('[data-portal-route-bulk-action]');
          if (!button) return;
          ev.preventDefault();
          ev.stopPropagation();

          var action = button.getAttribute('data-portal-route-bulk-action');
          if (action === 'cancel') pr.cancelBulkPortalSelection();
          if (action === 'finish') pr.finishBulkPortalSelection();
        });
        return container;
      }
    });

    pr.bulkSelect.control = new BulkSelectControl();
    window.map.addControl(pr.bulkSelect.control);
    pr.updateBulkSelectControl();
  };

  pr.loadedPortalStops = function() {
    return Object.keys(window.portals || {}).map(function(guid) {
      return pr.portalToStop(guid);
    }).filter(function(stop) {
      return !!stop;
    });
  };

  pr.pointInPolygon = function(latlng, polygonPoints) {
    if (!latlng || !polygonPoints || polygonPoints.length < 3) return false;

    var inside = false;
    var x = latlng.lng;
    var y = latlng.lat;

    for (var i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++) {
      var xi = polygonPoints[i].lng;
      var yi = polygonPoints[i].lat;
      var xj = polygonPoints[j].lng;
      var yj = polygonPoints[j].lat;
      var intersects = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-12) + xi);
      if (intersects) inside = !inside;
    }

    return inside;
  };

  pr.selectedStopsInPolygon = function(points) {
    return pr.loadedPortalStops().filter(function(stop) {
      return pr.pointInPolygon({ lat: stop.lat, lng: stop.lng }, points);
    });
  };

  pr.selectedStopsInCircle = function(center, radiusMeters) {
    if (!window.L || !center || !isFinite(radiusMeters)) return [];

    return pr.loadedPortalStops().filter(function(stop) {
      return center.distanceTo(L.latLng(stop.lat, stop.lng)) <= radiusMeters;
    });
  };


  pr.bookmarksPluginAvailable = function() {
    return !!(window.plugin && window.plugin.bookmarks && window.plugin.bookmarks.bkmrksObj);
  };

  pr.ensureBookmarksLoaded = function() {
    if (!pr.bookmarksPluginAvailable()) return false;
    var bookmarks = window.plugin.bookmarks;
    if ((!bookmarks.bkmrksObj || !bookmarks.bkmrksObj.portals) && typeof bookmarks.loadStorage === 'function') {
      try {
        bookmarks.loadStorage();
      } catch (e) {
        console.warn('Portal Route: unable to load IITC bookmarks', e);
      }
    }
    return !!(bookmarks.bkmrksObj && bookmarks.bkmrksObj.portals);
  };

  pr.bookmarkPortalFolders = function() {
    if (!pr.ensureBookmarksLoaded()) return [];

    var folders = window.plugin.bookmarks.bkmrksObj.portals || {};
    return Object.keys(folders).map(function(id) {
      var folder = folders[id] || {};
      var entries = folder.bkmrk || {};
      return {
        id: id,
        label: folder.label || id,
        count: Object.keys(entries).length
      };
    }).filter(function(folder) {
      return folder.count > 0;
    });
  };

  pr.parseBookmarkLatLng = function(value) {
    if (!value) return null;

    if (typeof value === 'string') {
      var parts = value.split(',').map(function(part) { return parseFloat(part); });
      if (parts.length >= 2 && isFinite(parts[0]) && isFinite(parts[1])) {
        return { lat: parts[0], lng: parts[1] };
      }
      return null;
    }

    if (Array.isArray(value) && value.length >= 2) {
      var lat = parseFloat(value[0]);
      var lng = parseFloat(value[1]);
      return isFinite(lat) && isFinite(lng) ? { lat: lat, lng: lng } : null;
    }

    if (typeof value.lat === 'number' && typeof value.lng === 'number') {
      return { lat: value.lat, lng: value.lng };
    }

    return null;
  };

  pr.bookmarkToStop = function(bookmark) {
    if (!bookmark || !bookmark.guid) return null;

    var loadedStop = pr.portalToStop(bookmark.guid);
    if (loadedStop) {
      loadedStop.title = bookmark.label || loadedStop.title || bookmark.guid;
      return loadedStop;
    }

    var latlng = pr.parseBookmarkLatLng(bookmark.latlng);
    if (!latlng) return null;

    return {
      guid: bookmark.guid,
      type: 'portal',
      title: bookmark.label || bookmark.guid,
      lat: latlng.lat,
      lng: latlng.lng
    };
  };

  pr.bookmarkFolderStops = function(folderId) {
    if (!pr.ensureBookmarksLoaded()) return [];

    var folders = window.plugin.bookmarks.bkmrksObj.portals || {};
    var folderIds = folderId === '__all__' ? Object.keys(folders) : [folderId];
    var stops = [];

    folderIds.forEach(function(id) {
      var folder = folders[id];
      var entries = folder && folder.bkmrk ? folder.bkmrk : {};
      Object.keys(entries).forEach(function(bookmarkId) {
        var stop = pr.bookmarkToStop(entries[bookmarkId]);
        if (stop) stops.push(stop);
      });
    });

    return pr.uniquePortalStops(stops);
  };

  pr.bookmarkFolderOptionHtml = function(folder, selectedId) {
    var label = folder.label + ' (' + folder.count + ')';
    return '<option value="' + pr.escapeHtml(folder.id) + '"' +
      (folder.id === selectedId ? ' selected' : '') + '>' +
      pr.escapeHtml(label) + '</option>';
  };

  pr.bulkDialogSize = function(defaultWidth, defaultHeight, minWidth, minHeight) {
    var size = pr.getDialogSize(defaultWidth, defaultHeight, minWidth, minHeight);
    return {
      width: size.width,
      height: size.height
    };
  };

  pr.clampBulkDialogPosition = function(left, top, width, height) {
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 320;
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 480;
    var dialogWidth = width || 420;
    var dialogHeight = height || 260;

    return {
      left: Math.max(6, Math.min(left, viewportWidth - dialogWidth - 6)),
      top: Math.max(6, Math.min(top, viewportHeight - dialogHeight - 6))
    };
  };

  pr.bulkDialogPositionForTarget = function(target, width, height) {
    if (!target || !target.getBoundingClientRect) return null;
    var rect = target.getBoundingClientRect();
    return pr.clampBulkDialogPosition(rect.left, rect.top, width, height);
  };

  pr.currentBulkDialogPosition = function(contentId) {
    var content = document.getElementById(contentId);
    if (!content || !window.jQuery) return null;

    try {
      var wrapper = window.jQuery(content).closest('.ui-dialog');
      if (!wrapper || !wrapper.length) return null;
      var offset = wrapper.offset();
      if (!offset) return null;
      return { left: offset.left, top: offset.top };
    } catch (e) {
      return null;
    }
  };

  pr.positionBulkDialog = function(contentId, position, width, height) {
    if (!position || !window.jQuery) return;
    var content = document.getElementById(contentId);
    if (!content) return;

    try {
      var wrapper = window.jQuery(content).closest('.ui-dialog');
      if (!wrapper || !wrapper.length) return;
      var clamped = pr.clampBulkDialogPosition(position.left, position.top, width, height);
      wrapper.css({
        left: clamped.left + 'px',
        top: clamped.top + 'px',
        right: 'auto',
        bottom: 'auto',
        transform: 'none'
      });
    } catch (e) {
      // Dialog positioning is best-effort; the normal IITC dialog still works.
    }
  };

  pr.renderBookmarkFolderPicker = function(folders) {
    var total = folders.reduce(function(sum, folder) { return sum + folder.count; }, 0);
    var html = '';

    html += '<div id="portal-route-bookmark-picker-content" class="portal-route-dialog-content portal-route-bookmark-picker" tabindex="-1">';
    html += '<p><b>Choose a bookmarks folder.</b></p>';
    html += '<p>Bookmark folders use saved portal positions, so portals do not need to be loaded on the map.</p>';
    html += '<label>Folder <select data-portal-route-bookmark-folder>';
    if (folders.length > 1) {
      html += '<option value="__all__">All folders (' + total + ')</option>';
    }
    folders.forEach(function(folder, index) {
      html += pr.bookmarkFolderOptionHtml(folder, index === 0 && folders.length === 1 ? folder.id : '');
    });
    html += '</select></label>';
    html += '<div class="portal-route-control-group-buttons portal-route-footer-actions portal-route-bookmark-actions">';
    html += '<button type="button" data-portal-route-bookmark-action="preview">Preview</button>';
    html += '<button type="button" data-portal-route-bookmark-action="cancel">Cancel</button>';
    html += '</div>';
    html += '</div>';

    return html;
  };

  pr.closeBookmarkFolderPicker = function() {
    var content = document.getElementById('portal-route-bookmark-picker-content');
    if (content && window.jQuery) {
      try {
        window.jQuery(content).closest('.ui-dialog-content').dialog('close');
        return;
      } catch (e) {
        // Fall through to hiding the content if the IITC dialog wrapper is unavailable.
      }
    }
    if (content) content.style.display = 'none';
  };

  pr.openBookmarkFolderPicker = function(target) {
    if (!pr.ensureBookmarksLoaded()) {
      pr.showMessage('Bookmarks plugin is not enabled.');
      return;
    }

    var folders = pr.bookmarkPortalFolders();
    if (!folders.length) {
      pr.showMessage('No portal bookmarks found.');
      return;
    }

    if (typeof window.dialog !== 'function') {
      pr.showMessage('Bookmarks are available, but the picker cannot open here.');
      return;
    }

    var size = pr.bulkDialogSize(430, 260, 330, 230);
    var position = pr.bulkDialogPositionForTarget(target, size.width, size.height) || pr.bulkSelect.lastDialogPosition;
    pr.bulkSelect.lastDialogPosition = position;

    pr.closeAddMenu();

    window.dialog({
      id: 'iitc-plugin-portal-route-bookmark-picker-dialog',
      title: 'Bulk select bookmarks',
      html: pr.renderBookmarkFolderPicker(folders),
      dialogClass: 'portal-route-dialog portal-route-anchored-dialog portal-route-bookmark-picker-dialog',
      width: size.width,
      height: size.height
    });

    pr.positionBulkDialog('portal-route-bookmark-picker-content', position, size.width, size.height);

    var content = document.getElementById('portal-route-bookmark-picker-content');
    if (!content) return;

    content.addEventListener('click', function(ev) {
      var button = ev.target.closest('[data-portal-route-bookmark-action]');
      if (!button) return;
      ev.preventDefault();

      var action = button.getAttribute('data-portal-route-bookmark-action');
      if (action === 'cancel') {
        pr.closeBookmarkFolderPicker();
        pr.showMessage('Bookmark selection canceled.');
        return;
      }

      var select = content.querySelector('[data-portal-route-bookmark-folder]');
      var folderId = select ? select.value : '';
      var stops = pr.bookmarkFolderStops(folderId);
      var dialogPosition = pr.currentBulkDialogPosition('portal-route-bookmark-picker-content') || pr.bulkSelect.lastDialogPosition;
      pr.bulkSelect.lastDialogPosition = dialogPosition;
      pr.closeBookmarkFolderPicker();
      pr.openBulkPortalPreview(stops, { source: 'bookmarks', dialogPosition: dialogPosition });
    });
  };

  pr.bulkSelectionStartPoint = function(mode, stops) {
    if (mode === 'add' && pr.state.stops.length) {
      var last = pr.state.stops[pr.state.stops.length - 1];
      if (last && typeof last.lat === 'number' && typeof last.lng === 'number') {
        return { lat: last.lat, lng: last.lng };
      }
    }

    if (window.map && window.map.getCenter) {
      var center = window.map.getCenter();
      if (center) return { lat: center.lat, lng: center.lng };
    }

    return stops && stops.length ? { lat: stops[0].lat, lng: stops[0].lng } : null;
  };

  pr.distanceBetweenStops = function(a, b) {
    if (!a || !b) return Infinity;
    if (window.L) return L.latLng(a.lat, a.lng).distanceTo(L.latLng(b.lat, b.lng));

    var dLat = a.lat - b.lat;
    var dLng = a.lng - b.lng;
    return Math.sqrt(dLat * dLat + dLng * dLng);
  };

  pr.findStopByGuid = function(stops, guid) {
    if (!guid) return null;
    for (var i = 0; i < (stops || []).length; i++) {
      if (stops[i] && stops[i].guid === guid) return stops[i];
    }
    return null;
  };

  pr.removeStopByGuid = function(stops, guid) {
    if (!guid) return stops || [];
    return (stops || []).filter(function(stop) {
      return !stop || stop.guid !== guid;
    });
  };

  pr.nearestLookaheadScore = function(current, candidate, remaining) {
    var score = pr.distanceBetweenStops(current, candidate);
    if (!remaining || !remaining.length) return score;

    var bestFollowup = Infinity;
    remaining.forEach(function(next) {
      if (!next || next.guid === candidate.guid) return;
      bestFollowup = Math.min(bestFollowup, pr.distanceBetweenStops(candidate, next));
    });

    if (bestFollowup < Infinity) score += bestFollowup;
    return score;
  };

  pr.orderStopsNearestNeighbor = function(stops, mode, options) {
    stops = (stops || []).slice();
    options = options || {};
    if (stops.length < 2) return stops;

    var startStop = pr.findStopByGuid(stops, options.startGuid);
    var endStop = pr.findStopByGuid(stops, options.endGuid);
    var ordered = [];
    var current = null;

    if (startStop) {
      ordered.push(startStop);
      current = startStop;
      stops = pr.removeStopByGuid(stops, startStop.guid);
    } else {
      current = pr.bulkSelectionStartPoint(mode, stops);
    }

    if (endStop && (!startStop || endStop.guid !== startStop.guid)) {
      stops = pr.removeStopByGuid(stops, endStop.guid);
    } else {
      endStop = null;
    }

    while (stops.length) {
      var bestIndex = 0;
      var bestScore = Infinity;
      for (var i = 0; i < stops.length; i++) {
        var score = pr.nearestLookaheadScore(current, stops[i], stops);
        if (score < bestScore) {
          bestScore = score;
          bestIndex = i;
        }
      }
      current = stops.splice(bestIndex, 1)[0];
      ordered.push(current);
    }

    if (endStop) ordered.push(endStop);
    return ordered;
  };

  pr.existingPortalGuidSet = function() {
    var seen = {};
    pr.state.stops.forEach(function(stop) {
      if (stop && stop.guid) seen[stop.guid] = true;
    });
    return seen;
  };

  pr.uniquePortalStops = function(stops) {
    var seen = {};
    var result = [];

    (stops || []).forEach(function(stop) {
      if (!stop || !stop.guid || seen[stop.guid]) return;
      seen[stop.guid] = true;
      result.push(stop);
    });

    return result;
  };

  pr.filterNewPortalStops = function(stops) {
    var existing = pr.existingPortalGuidSet();
    return pr.uniquePortalStops(stops).filter(function(stop) {
      return !existing[stop.guid];
    });
  };

  pr.addBulkPortalStops = function(stops, options) {
    options = options || {};
    stops = pr.filterNewPortalStops(stops);
    if (!stops.length) {
      pr.showMessage('No new portals to add.');
      return;
    }

    stops = pr.orderStopsNearestNeighbor(stops, 'add', options);
    if (pr.pushUndoSnapshot) pr.pushUndoSnapshot('add loaded portals');

    stops.forEach(function(stop) {
      pr.state.stops.push({
        guid: stop.guid,
        type: 'portal',
        title: pr.hydratedStopTitle(stop, 'portal', pr.state.stops.length),
        lat: stop.lat,
        lng: stop.lng,
        stopMinutes: typeof stop.stopMinutes === 'number' ? stop.stopMinutes : null,
        startOnMe: false,
        accuracy: null,
        updatedAt: null
      });
    });

    pr.state.selectedMapPointIndex = null;
    pr.markRouteStale({ clearRoute: true });
    pr.saveStops();
    pr.redrawLabels();
    pr.renderPanel();
    pr.renderPointsPanel();
    pr.renderMiniControl();
    if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
    pr.showMessage('Added ' + stops.length + ' portals.');
  };

  pr.replaceWithBulkPortalStops = function(stops, options) {
    options = options || {};
    stops = pr.orderStopsNearestNeighbor(pr.uniquePortalStops(stops), 'replace', options);
    if (!stops.length) {
      pr.showMessage('No portals selected.');
      return;
    }
    pr.replaceStops(stops, { openPointsPanel: true });
    pr.markRouteStale({ clearRoute: true });
    pr.showMessage('Replaced route with ' + stops.length + ' portals.');
  };

  pr.closeBulkPortalPreview = function() {
    var content = document.getElementById(pr.DOM_IDS.bulkSelectDialogContent);
    if (content && window.jQuery) {
      try {
        window.jQuery(content).closest('.ui-dialog-content').dialog('close');
        return;
      } catch (e) {
        // Fall through to hiding the content if the IITC dialog wrapper is unavailable.
      }
    }
    if (content) content.style.display = 'none';
  };

  pr.bulkEndpointLabel = function(stop, fallbackIndex) {
    var title = pr.hydratedStopTitle ? pr.hydratedStopTitle(stop, 'portal', fallbackIndex) : (stop && stop.title);
    title = title || ('Portal ' + (fallbackIndex + 1));
    return title;
  };

  pr.bulkEndpointOptionsHtml = function(stops, selectedGuid) {
    var html = '';
    (stops || []).forEach(function(stop, index) {
      if (!stop || !stop.guid) return;
      html += '<option value="' + pr.escapeHtml(stop.guid) + '"' +
        (stop.guid === selectedGuid ? ' selected' : '') + '>' +
        pr.escapeHtml(pr.bulkEndpointLabel(stop, index)) + '</option>';
    });
    return html;
  };

  pr.defaultBulkEndpointGuids = function(stops) {
    stops = stops || [];
    if (!stops.length) return { startGuid: '', endGuid: '' };
    if (stops.length === 1) return { startGuid: stops[0].guid, endGuid: stops[0].guid };

    var ordered = pr.orderStopsNearestNeighbor(stops, 'replace', {});
    return {
      startGuid: ordered[0] && ordered[0].guid ? ordered[0].guid : stops[0].guid,
      endGuid: ordered[ordered.length - 1] && ordered[ordered.length - 1].guid ? ordered[ordered.length - 1].guid : stops[stops.length - 1].guid
    };
  };

  pr.bulkPreviewEndpointSelection = function(content) {
    var start = content ? content.querySelector('[data-portal-route-bulk-endpoint="start"]') : null;
    var end = content ? content.querySelector('[data-portal-route-bulk-endpoint="end"]') : null;
    return {
      startGuid: start ? start.value : '',
      endGuid: end ? end.value : ''
    };
  };

  pr.renderBulkPortalPreview = function(stops, options) {
    options = options || {};
    var addableCount = pr.filterNewPortalStops(stops).length;
    var replaceCount = pr.uniquePortalStops(stops).length;

    var html = '';
    html += '<div id="' + pr.DOM_IDS.bulkSelectDialogContent + '" class="portal-route-dialog-content portal-route-bulk-select-preview" tabindex="-1">';
    var noun = options.source === 'bookmarks' ? 'bookmarked portal' : 'loaded portal';
    html += '<p><b>Found ' + replaceCount + ' ' + noun + (replaceCount === 1 ? '' : 's') + '.</b></p>';
    if (replaceCount >= 50) {
      html += '<p>That is a chunky route. Portal Route can add them, but routing services may object.</p>';
    } else if (replaceCount >= 25) {
      html += '<p>That is a pretty healthy route. Portal Route can add them, but plotting may get slow.</p>';
    }
    if (options.source === 'bookmarks') {
      html += '<p>Bookmarks use saved portal positions, so portals do not need to be loaded on the map.</p>';
    } else {
      html += '<p>Only loaded portals are included. Zoom or pan first if you expected more.</p>';
    }
    if (replaceCount > 1) {
      var endpoints = pr.defaultBulkEndpointGuids(pr.uniquePortalStops(stops));
      html += '<div class="portal-route-bulk-endpoints">';
      html += '<label>Start <select data-portal-route-bulk-endpoint="start">' + pr.bulkEndpointOptionsHtml(pr.uniquePortalStops(stops), endpoints.startGuid) + '</select></label>';
      html += '<label>End <select data-portal-route-bulk-endpoint="end">' + pr.bulkEndpointOptionsHtml(pr.uniquePortalStops(stops), endpoints.endGuid) + '</select></label>';
      html += '</div>';
    }
    if (replaceCount !== addableCount) {
      html += '<p>' + (replaceCount - addableCount) + ' already in this route.</p>';
    }
    html += '<div class="portal-route-control-group-buttons portal-route-footer-actions portal-route-bulk-select-actions">';
    html += '<button type="button" data-portal-route-bulk-preview="add"' + (addableCount ? '' : ' disabled') + '>Add to route</button>';
    html += '<button type="button" data-portal-route-bulk-preview="replace"' + (replaceCount ? '' : ' disabled') + '>Replace route</button>';
    html += '<button type="button" data-portal-route-bulk-preview="cancel">Cancel</button>';
    html += '</div>';
    html += '</div>';

    return html;
  };

  pr.openBulkPortalPreview = function(stops, options) {
    options = options || {};
    pr.bulkSelect.previewStops = pr.uniquePortalStops(stops);

    if (typeof window.dialog !== 'function') {
      pr.showMessage('Found ' + pr.bulkSelect.previewStops.length + ' loaded portals.');
      return;
    }

    var previewSize = pr.bulkDialogSize(430, 280, 330, 240);

    window.dialog({
      id: pr.DOM_IDS.bulkSelectDialog,
      title: options.source === 'bookmarks' ? 'Bulk select bookmarks' : 'Select loaded portals',
      html: pr.renderBulkPortalPreview(pr.bulkSelect.previewStops, options),
      dialogClass: 'portal-route-dialog portal-route-anchored-dialog portal-route-bulk-select-dialog',
      width: previewSize.width,
      height: previewSize.height
    });

    pr.positionBulkDialog(pr.DOM_IDS.bulkSelectDialogContent, options.dialogPosition || pr.bulkSelect.lastDialogPosition, previewSize.width, previewSize.height);

    var content = document.getElementById(pr.DOM_IDS.bulkSelectDialogContent);
    if (!content) return;

    content.addEventListener('click', function(ev) {
      var button = ev.target.closest('[data-portal-route-bulk-preview]');
      if (!button) return;
      ev.preventDefault();

      var action = button.getAttribute('data-portal-route-bulk-preview');
      var previewStops = pr.bulkSelect.previewStops.slice();
      var endpoints = pr.bulkPreviewEndpointSelection(content);

      if ((action === 'add' || action === 'replace') && previewStops.length > 1 && endpoints.startGuid === endpoints.endGuid) {
        pr.showMessage('Pick different start and end portals.');
        return;
      }

      pr.closeBulkPortalPreview();
      pr.clearBulkSelectLayer();
      pr.bulkSelect.previewStops = [];
      pr.bulkSelect.previewStartGuid = null;
      pr.bulkSelect.previewEndGuid = null;

      if (action === 'add') pr.addBulkPortalStops(previewStops, endpoints);
      if (action === 'replace') pr.replaceWithBulkPortalStops(previewStops, endpoints);
      if (action === 'cancel') pr.showMessage('Portal selection canceled.');
    });
  };

  pr.finishBulkPortalSelection = function() {
    var stops = [];

    if (pr.bulkSelect.mode === 'polygon') {
      if (pr.bulkSelect.points.length < 3) {
        pr.showMessage('Add at least 3 polygon points.');
        return;
      }
      stops = pr.selectedStopsInPolygon(pr.bulkSelect.points);
    } else if (pr.bulkSelect.mode === 'circle') {
      if (!pr.bulkSelect.center || !isFinite(pr.bulkSelect.radiusMeters)) {
        pr.showMessage('Tap center, then edge.');
        return;
      }
      stops = pr.selectedStopsInCircle(pr.bulkSelect.center, pr.bulkSelect.radiusMeters);
    }

    pr.stopBulkSelectMode({ keepShape: true });
    pr.openBulkPortalPreview(stops);
  };

  pr.bulkSelectStyle = function() {
    return {
      color: '#00e5ff',
      haloColor: '#111111',
      fillColor: '#00e5ff'
    };
  };

  pr.drawBulkVertex = function(layer, point) {
    var style = pr.bulkSelectStyle();

    L.circleMarker(point, {
      radius: 8,
      weight: 4,
      color: style.haloColor,
      fillColor: style.fillColor,
      fillOpacity: 0.95,
      opacity: 0.85
    }).addTo(layer);

    L.circleMarker(point, {
      radius: 5,
      weight: 2,
      color: '#ffffff',
      fillColor: style.fillColor,
      fillOpacity: 1
    }).addTo(layer);
  };

  pr.drawBulkPath = function(layer, points, closePath) {
    if (!points || points.length < 2) return;

    var style = pr.bulkSelectStyle();
    var pathPoints = points.slice();
    if (closePath && points.length > 2) pathPoints.push(points[0]);

    L.polyline(pathPoints, {
      color: style.haloColor,
      weight: 6,
      opacity: 0.55
    }).addTo(layer);

    L.polyline(pathPoints, {
      color: style.color,
      weight: 3,
      opacity: 1
    }).addTo(layer);
  };

  pr.redrawBulkPolygon = function() {
    var layer = pr.ensureBulkSelectLayer();
    if (!layer || !window.L) return;

    layer.clearLayers();
    var points = pr.bulkSelect.points;
    if (!points.length) return;

    if (points.length > 2) {
      var style = pr.bulkSelectStyle();
      L.polygon(points, {
        color: style.color,
        weight: 0,
        fillColor: style.fillColor,
        fillOpacity: 0.18
      }).addTo(layer);
      pr.drawBulkPath(layer, points, true);
    } else {
      pr.drawBulkPath(layer, points, false);
    }

    points.forEach(function(point) {
      pr.drawBulkVertex(layer, point);
    });
  };

  pr.drawBulkCircle = function() {
    var layer = pr.ensureBulkSelectLayer();
    if (!layer || !window.L || !pr.bulkSelect.center || !isFinite(pr.bulkSelect.radiusMeters)) return;

    layer.clearLayers();
    var style = pr.bulkSelectStyle();
    L.circle(pr.bulkSelect.center, {
      radius: pr.bulkSelect.radiusMeters,
      color: style.haloColor,
      weight: 6,
      opacity: 0.55,
      fillOpacity: 0
    }).addTo(layer);
    L.circle(pr.bulkSelect.center, {
      radius: pr.bulkSelect.radiusMeters,
      color: style.color,
      weight: 3,
      fillColor: style.fillColor,
      fillOpacity: 0.18
    }).addTo(layer);
    pr.drawBulkVertex(layer, pr.bulkSelect.center);
  };

  pr.handleBulkSelectMapClick = function(e) {
    if (!pr.bulkSelect.mode || !e || !e.latlng) return;
    if (pr.isLayerEnabled && !pr.isLayerEnabled()) return;

    if (pr.bulkSelect.mode === 'polygon') {
      pr.bulkSelect.points.push(e.latlng);
      pr.redrawBulkPolygon();
      pr.updateBulkSelectControl();
      return;
    }

    if (pr.bulkSelect.mode === 'circle') {
      if (!pr.bulkSelect.center) {
        pr.bulkSelect.center = e.latlng;
        pr.bulkSelect.radiusMeters = 0;
        pr.showMessage('Tap circle edge to finish.');
        return;
      }

      pr.bulkSelect.radiusMeters = pr.bulkSelect.center.distanceTo(e.latlng);
      pr.drawBulkCircle();
      pr.finishBulkPortalSelection();
    }
  };

  pr.stopBulkSelectMode = function(options) {
    options = options || {};
    if (window.map && pr.bulkSelect.mapClickHandler) {
      window.map.off('click', pr.bulkSelect.mapClickHandler);
    }
    pr.bulkSelect.mapClickHandler = null;
    pr.bulkSelect.mode = null;
    pr.bulkSelect.points = [];
    pr.bulkSelect.center = null;
    pr.bulkSelect.radiusMeters = null;
    pr.removeBulkSelectControl();
    if (!options.keepShape) pr.clearBulkSelectLayer();

    var mapContainer = window.map && window.map.getContainer ? window.map.getContainer() : null;
    if (mapContainer && mapContainer.classList) {
      mapContainer.classList.remove('portal-route-bulk-select-mode');
    }
  };

  pr.cancelBulkPortalSelection = function() {
    pr.stopBulkSelectMode();
    pr.closeBulkPortalPreview();
    pr.showMessage('Portal selection canceled.');
  };

  pr.startBulkPortalSelection = function(mode) {
    if (!window.L || !window.map) {
      pr.showMessage('Map is not ready.');
      return;
    }

    if (pr.cancelAddPointMode) pr.cancelAddPointMode({ silent: true });
    pr.stopBulkSelectMode();
    pr.closeBulkPortalPreview();
    pr.ensureBulkSelectLayer();

    pr.bulkSelect.mode = mode;
    pr.bulkSelect.points = [];
    pr.bulkSelect.center = null;
    pr.bulkSelect.radiusMeters = null;
    pr.bulkSelect.mapClickHandler = pr.handleBulkSelectMapClick;
    window.map.on('click', pr.bulkSelect.mapClickHandler);
    pr.showBulkSelectControl(mode);

    var mapContainer = window.map.getContainer ? window.map.getContainer() : null;
    if (mapContainer && mapContainer.classList) {
      mapContainer.classList.add('portal-route-bulk-select-mode');
    }

    pr.showMessage(mode === 'polygon' ? 'Tap polygon points, then Finish.' : 'Tap circle center.');
  };

  pr.bulkSelectMenuItems = function() {
    return [
      { label: 'Circle', action: 'select-portals-circle' },
      { label: 'Polygon', action: 'select-portals-polygon' },
      { label: 'Bookmarks', action: 'select-portals-bookmarks', disabled: !(pr.bookmarkPortalFolders && pr.bookmarkPortalFolders().length) },
      { label: 'Cancel', action: 'cancel-bulk-select' }
    ];
  };

  pr.openBulkSelectMenu = function(x, y, options) {
    pr.openRouteContextMenu(pr.bulkSelectMenuItems(), 'portal-route-bulk-select-menu', x, y, options);
  };

  pr.setBusy = function(isBusy) {
    var panel = document.getElementById(pr.DOM_IDS.dialogContent);
    if (panel) panel.classList.toggle('portal-route-busy', !!isBusy);
  };

  pr.showMessage = function(message) {
    var node = document.getElementById('portal-route-message') ||
      document.querySelector('#' + pr.DOM_IDS.routeLibraryContent + ' .portal-route-message') ||
      document.querySelector('#' + pr.DOM_IDS.pointsDialogContent + ' .portal-route-message');
    if (node) {
      node.textContent = message;
      node.classList.add('portal-route-message-visible');
      window.setTimeout(function() {
        node.classList.remove('portal-route-message-visible');
      }, 5000);
    } else {
      console.log('Portal Route:', message);
    }
  };

  pr.selectedMapPointIndex = function() {
    var index = pr.state.selectedMapPointIndex;
    var stop = typeof index === 'number' ? pr.state.stops[index] : null;

    if (stop && stop.type === 'map') return index;

    pr.state.selectedMapPointIndex = null;
    return -1;
  };

  pr.clearSelectedMapPoint = function() {
    if (pr.state.selectedMapPointIndex === null || pr.state.selectedMapPointIndex === undefined) return;
    pr.state.selectedMapPointIndex = null;
    pr.redrawLabels();
    pr.renderPanel();
    pr.renderMiniControl();
  };

  pr.selectedStopIndex = function() {
    var mapPointIndex = pr.selectedMapPointIndex();
    if (mapPointIndex >= 0) return mapPointIndex;

    var guid = window.selectedPortal;
    if (!guid) return -1;

    for (var i = 0; i < pr.state.stops.length; i++) {
      if (pr.state.stops[i].guid === guid) return i;
    }
    return -1;
  };

  pr.removeSelectedStop = function() {
    var index = pr.selectedStopIndex();
    if (index < 0) {
      pr.showMessage('Selected portal or map point is not in the route.');
      return;
    }
    pr.removeStop(index);
  };

  pr.removeSelectedPortal = pr.removeSelectedStop;

  pr.toggleSelectedPortalStop = function() {
    if (pr.selectedStopIndex() >= 0) {
      pr.removeSelectedStop();
    } else {
      pr.addSelectedPortal();
    }
  };

  pr.closeDialog = function() {
    var content = document.getElementById(pr.DOM_IDS.dialogContent);
    if (content && window.jQuery) {
      try {
        window.jQuery(content).closest('.ui-dialog-content').dialog('close');
        return;
      } catch (e) {
        // Fall through to hiding the content if the IITC dialog wrapper is unavailable.
      }
    }
    if (content) content.style.display = 'none';
  };

  pr.closePointsDialog = function() {
    var content = document.getElementById(pr.DOM_IDS.pointsDialogContent);
    if (content && window.jQuery) {
      try {
        window.jQuery(content).closest('.ui-dialog-content').dialog('close');
        return;
      } catch (e) {
        // Fall through to hiding the content if the IITC dialog wrapper is unavailable.
      }
    }
    if (content) content.style.display = 'none';
  };

  pr.listDropTarget = function(ev, item) {
    if (!item) return null;

    var targetIndex = Number(item.getAttribute('data-index'));
    if (!isFinite(targetIndex)) return null;

    var rect = item.getBoundingClientRect ? item.getBoundingClientRect() : null;
    var after = rect ? ev.clientY > rect.top + rect.height / 2 : false;
    var insertIndex = after ? targetIndex + 1 : targetIndex;

    if (targetIndex >= pr.state.stops.length) {
      insertIndex = pr.state.stops.length;
      after = false;
    }

    return {
      after: after,
      index: insertIndex
    };
  };

  pr.moveStopToInsertIndex = function(fromIndex, insertIndex) {
    if (!isFinite(fromIndex) || !isFinite(insertIndex)) return;
    if (fromIndex < 0 || fromIndex >= pr.state.stops.length) return;

    var toIndex = fromIndex < insertIndex ? insertIndex - 1 : insertIndex;
    toIndex = Math.min(Math.max(0, toIndex), pr.state.stops.length - 1);
    if (toIndex === fromIndex) return;

    pr.moveStop(fromIndex, toIndex);
  };

  pr.openMainPanel = function() {
    if (pr.cancelAddPointMode) pr.cancelAddPointMode({ silent: true });
    pr.state.panelOpen = true;
    pr.savePanelOpen();
    pr.renderPanel();
  };

  pr.handleAction = function(action, target) {
    if (pr.isLayerEnabled && !pr.isLayerEnabled()) {
      pr.syncLayerUi();
      return;
    }

    var index = target ? Number(target.getAttribute('data-index')) : -1;
    var actions = {
      'open-main': pr.openMainPanel,
      'open-main-menu': function() {
        if (pr.cancelAddPointMode) pr.cancelAddPointMode({ silent: true });
        if (!target || !target.getBoundingClientRect) {
          pr.openMainMenu(20, 20);
          return;
        }
        var rect = target.getBoundingClientRect();
        pr.openMainMenu(rect.left, rect.bottom + 4);
      },
      'open-add-menu': function() {
        pr.handleAction('open-main-menu', target);
      },
      'open-route-menu': function() {
        pr.handleAction('open-main-menu', target);
      },
      'open-maps-menu': function() {
        if (pr.cancelAddPointMode) pr.cancelAddPointMode({ silent: true });
        if (!target || !target.getBoundingClientRect) {
          pr.openMapsMenu(20, 20);
          return;
        }
        var rect = target.getBoundingClientRect();
        pr.openMapsMenu(rect.left, rect.bottom + 4);
      },
      'open-bulk-select-menu': function() {
        if (pr.cancelAddPointMode) pr.cancelAddPointMode({ silent: true });
        if (!target || !target.getBoundingClientRect) {
          pr.openBulkSelectMenu(20, 20, { keepExisting: true });
          return;
        }
        var rect = target.getBoundingClientRect();
        pr.openBulkSelectMenu(rect.right + 4, rect.top, { keepExisting: true });
      },
      'open-edit': pr.openMainPanel,
      'close-panel': function() {
        pr.state.panelOpen = false;
        pr.savePanelOpen();
        pr.closeDialog();
      },
      'toggle-selected-stop': pr.toggleSelectedPortalStop,
      'smart-add': pr.smartAdd,
      'undo-route-edit': pr.undoRouteEdit,
      'redo-route-edit': pr.redoRouteEdit,
      'add-selected-stop': pr.addSelectedPortal,
      'add-map-point': function() { pr.setAddPointMode(!pr.state.addPointMode); },
      'add-current-location': pr.addCurrentLocation,
      'add-home-location': pr.addHomeLocation,
      'set-home-current-location': pr.setHomeToCurrentLocation,
      'select-portals-circle': function() { pr.startBulkPortalSelection('circle'); },
      'select-portals-polygon': function() { pr.startBulkPortalSelection('polygon'); },
      'select-portals-bookmarks': function() { pr.openBookmarkFolderPicker(target); },
      'cancel-bulk-select': pr.cancelBulkPortalSelection,
      'toggle-loop-back': pr.toggleLoopBackToStart,
      'reverse-route': pr.reverseRoute,
      'remove-stop': function() { pr.removeStop(index); },
      'move-stop-up': function() { pr.moveStop(index, index - 1); },
      'move-stop-down': function() { pr.moveStop(index, index + 1); },
      'rename-stop': function() { pr.renameStop(index); },
      'set-stop-start': function() { pr.moveStopToEdge(index, 'start'); },
      'set-stop-end': function() { pr.moveStopToEdge(index, 'end'); },
      'select-stop': function() { pr.selectStopPortal(index, false); },
      'select-stop-center': function() { pr.selectStopPortal(index, true); },
      'calculate-route': pr.calculateRoute,
      'fit-route': pr.fitRouteToMap,
      'open-google-maps': pr.openGoogleMaps,
      'open-apple-maps': pr.openAppleMaps,
      'save-route': pr.saveCurrentRouteToLibrary,
      'save-route-from-library': pr.saveCurrentRouteFromLibraryPanel,
      'load-route': pr.openRouteLibraryPanel,
      'load-selected-saved-route': function() {
        var route = pr.routeLibraryStorage().getRoute(pr.requireSingleSelectedLibraryRouteId());
        pr.applyRouteRecord(route);
      },
      'delete-selected-saved-route': function() { pr.deleteSelectedSavedRoutes(); },
      'export-selected-saved-route': function() { pr.exportSelectedSavedRoutesJson(); },
      'import-saved-route': pr.importSavedRouteJson,
      'export-route-library': pr.exportRouteLibraryJson,
      'import-route-library': pr.importRouteLibraryJson,
      'drive-connect': pr.chooseDriveRouteLibraryFolder,
      'drive-pull': pr.readDriveRouteLibrary,
      'drive-push': pr.pushDriveRouteLibrary,
      'export-route-json': pr.exportRouteJson,
      'import-route-json': pr.importRouteJson,
      'print-route': pr.printRoute,
      'open-points-list': function() {
        if (pr.cancelAddPointMode) pr.cancelAddPointMode({ silent: true });
        pr.state.pointsPanelOpen = true;
        pr.renderPointsPanel();
      },
      'clear-route': function() {
        pr.clearRouteWithConfirm();
      }
    };

    if (actions[action]) {
      if (action !== 'open-bulk-select-menu' && action !== 'select-portals-bookmarks') pr.closeAddMenu();
      actions[action]();
    }
  };

  pr.isLayerEnabled = function() {
    if (!window.map || !pr.layerGroup) return true;
    return window.map.hasLayer(pr.layerGroup);
  };

  pr.createMiniControl = function() {
    if (!pr.state.settings.showMiniControl) return;
    if (!window.L || !window.map) return;
    if (pr.state.miniControl || document.getElementById(pr.DOM_IDS.miniControl)) return;

    var PortalRouteControl = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: function() {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control portal-route-mini-control iitc-plugin-portal-route-control');
        container.id = pr.DOM_IDS.miniControl;
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);
        container.addEventListener('click', function(ev) {
          var button = ev.target.closest('[data-action]');
          if (!button) return;
          ev.preventDefault();
          ev.stopPropagation();
          if (pr.state.suppressNextAddClick && button.hasAttribute('data-main-menu')) {
            pr.state.suppressNextAddClick = false;
            return;
          }
          pr.handleAction(button.getAttribute('data-action'), button);
        });
        return container;
      }
    });

    pr.state.miniControl = new PortalRouteControl();
    window.map.addControl(pr.state.miniControl);
    pr.setMiniControlVisible(pr.isLayerEnabled());
  };

  pr.setMiniControlVisible = function(isVisible) {
    var container = document.getElementById(pr.DOM_IDS.miniControl);
    isVisible = !!isVisible && !!pr.state.settings.showMiniControl;
    if (container) container.style.display = isVisible ? '' : 'none';
  };

  pr.removeMiniControl = function() {
    if (pr.state.miniControl && window.map) {
      try {
        window.map.removeControl(pr.state.miniControl);
      } catch (e) {
        console.warn('Portal Route: unable to remove mini control', e);
      }
    }

    pr.state.miniControl = null;

    var container = document.getElementById(pr.DOM_IDS.miniControl);
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  };

  pr.renderMiniControl = function() {
    if (!pr.state.settings.showMiniControl) {
      pr.setMiniControlVisible(false);
      return;
    }

    var container = document.getElementById(pr.DOM_IDS.miniControl);
    if (!container) return;

    if (!pr.isLayerEnabled()) {
      pr.setMiniControlVisible(false);
      return;
    }

    pr.setMiniControlVisible(true);

    container.innerHTML = pr.renderMiniControlButtons();
  };

  pr.panelForEvent = function(ev) {
    if (!ev.target || !ev.target.closest) return null;
    return ev.target.closest('#' + pr.DOM_IDS.dialogContent + ', #' + pr.DOM_IDS.pointsDialogContent + ', #' + pr.DOM_IDS.routeLibraryContent + ', .portal-route-portal-action, .portal-route-context-menu');
  };

  pr.handleDialogClick = function(ev) {
    if (!ev.target.closest('.portal-route-context-menu')) pr.closeAddMenu();
    if (!pr.panelForEvent(ev)) return;

    var target = ev.target.closest('[data-action]');
    var action = target && target.getAttribute('data-action');
    if (!action) {
      var row = ev.target.closest('.portal-route-stop');
      if (!row || ev.target.closest('input, textarea, select')) return;
      ev.preventDefault();
      pr.selectStopPortal(Number(row.getAttribute('data-index')), false);
      return;
    }

    ev.preventDefault();
    if (pr.state.suppressNextAddClick && target.hasAttribute('data-main-menu')) {
      pr.state.suppressNextAddClick = false;
      return;
    }
    pr.handleAction(action, target);
  };

  pr.mainMenuTarget = function(target) {
    return target && target.closest ? target.closest('[data-main-menu]') : null;
  };

  pr.addMenuTarget = pr.mainMenuTarget;
  pr.routeMenuTarget = pr.mainMenuTarget;
  pr.mapsMenuTarget = pr.mainMenuTarget;

  pr.closeAddMenu = function() {
    var menus = document.querySelectorAll('.portal-route-context-menu');
    var removedAny = false;
    menus.forEach(function(menu) {
      if (menu && menu.parentNode) {
        menu.parentNode.removeChild(menu);
        removedAny = true;
      }
    });
    if (removedAny && pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
  };

  pr.openMainMenu = function(x, y) {
    pr.openRouteContextMenu(pr.mainMenuItems(), 'portal-route-main-menu', x, y);
  };

  pr.openMapsMenu = function(x, y) {
    pr.openRouteContextMenu(pr.mapsMenuItems(), 'portal-route-maps-menu', x, y);
  };

  pr.openAddMenu = pr.openMainMenu;
  pr.openRouteMenu = pr.openMainMenu;

  pr.positionContextMenu = function(menu, x, y) {
    var rect = menu.getBoundingClientRect();
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 320;
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 480;
    menu.style.left = Math.max(6, Math.min(x, viewportWidth - rect.width - 6)) + 'px';
    menu.style.top = Math.max(6, Math.min(y, viewportHeight - rect.height - 6)) + 'px';
  };

  pr.openStopMenu = function(index, x, y) {
    pr.openRouteContextMenu(pr.stopMenuItems(index), '', x, y);
  };

  pr.handleStopMenuContext = function(ev) {
    var row = ev.target.closest('.portal-route-stop');
    if (!row || ev.target.closest('input, textarea, select')) return false;

    ev.preventDefault();
    pr.openStopMenu(Number(row.getAttribute('data-index')), ev.clientX || 12, ev.clientY || 12);
    return true;
  };

  pr.handleAddMenuContext = function(ev) {
    if (pr.handleStopMenuContext(ev)) return;

    var target = pr.mainMenuTarget(ev.target);
    if (!target) return;

    ev.preventDefault();
    pr.openMainMenu(ev.clientX || 12, ev.clientY || 12);
  };

  pr.handleAddMenuTouchStart = function(ev) {
    var target = pr.mainMenuTarget(ev.target);
    var row = ev.target.closest('.portal-route-stop');
    if ((!target && !row) || !window.setTimeout) return;

    if (pr.state.addMenuLongPressTimer) window.clearTimeout(pr.state.addMenuLongPressTimer);
    var touch = ev.touches && ev.touches[0];
    var x = touch ? touch.clientX : 12;
    var y = touch ? touch.clientY : 12;

    pr.state.addMenuLongPressTimer = window.setTimeout(function() {
      pr.state.addMenuLongPressTimer = null;
      pr.state.suppressNextAddClick = true;
      if (row && !ev.target.closest('input, textarea, select')) {
        pr.openStopMenu(Number(row.getAttribute('data-index')), x, y);
      } else {
        pr.openMainMenu(x, y);
      }
    }, 650);
  };

  pr.cancelAddMenuTouch = function() {
    if (!pr.state.addMenuLongPressTimer) return;
    window.clearTimeout(pr.state.addMenuLongPressTimer);
    pr.state.addMenuLongPressTimer = null;
  };

  pr.handleDialogDragStart = function(ev) {
    if (!pr.panelForEvent(ev)) return;

    var item = ev.target.closest('.portal-route-stop');
    if (!item) return;
    if (ev.target.closest('.portal-route-wait-cell, .portal-route-row-actions')) {
      ev.preventDefault();
      return;
    }

    pr.state.dragStopIndex = Number(item.getAttribute('data-index'));
    if (!isFinite(pr.state.dragStopIndex)) {
      pr.state.dragStopIndex = null;
      ev.preventDefault();
      return;
    }

    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData('text/plain', String(pr.state.dragStopIndex));
    item.classList.add('portal-route-dragging');
  };

  pr.handleDialogDragEnd = function(ev) {
    var item = ev.target.closest('.portal-route-stop');
    if (item) item.classList.remove('portal-route-dragging');
    document.querySelectorAll('.portal-route-drop-target').forEach(function(row) {
      row.classList.remove('portal-route-drop-target', 'portal-route-drop-after');
    });
    pr.state.dragStopIndex = null;
  };

  pr.handleDialogDragOver = function(ev) {
    if (!pr.panelForEvent(ev)) return;

    var item = ev.target.closest('.portal-route-stop');
    if (!item) return;
    if (pr.state.dragStopIndex === null || pr.state.dragStopIndex === undefined) return;

    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
    document.querySelectorAll('.portal-route-drop-target').forEach(function(row) {
      if (row !== item) row.classList.remove('portal-route-drop-target', 'portal-route-drop-after');
    });
    var dropTarget = pr.listDropTarget(ev, item);
    item.classList.add('portal-route-drop-target');
    item.classList.toggle('portal-route-drop-after', !!(dropTarget && dropTarget.after));
  };

  pr.handleDialogDrop = function(ev) {
    if (!pr.panelForEvent(ev)) return;

    var item = ev.target.closest('.portal-route-stop');
    if (!item) return;

    ev.preventDefault();
    item.classList.remove('portal-route-drop-target', 'portal-route-drop-after');

    var fromIndex = pr.state.dragStopIndex;
    var dropTarget = pr.listDropTarget(ev, item);
    pr.state.dragStopIndex = null;

    if (!dropTarget) return;
    pr.moveStopToInsertIndex(fromIndex, dropTarget.index);
  };

  pr.handleDialogSettingChange = function(target) {
    var field = target && target.getAttribute('data-field');
    if (field === 'start-on-current-location') {
      pr.setStartOnCurrentLocation(!!target.checked);
      return true;
    }

    if (field === 'include-return-to-start') {
      pr.setLoopBackToStart(!!target.checked);
      return true;
    }

    if (field === 'show-segment-times-on-map') {
      pr.state.settings.showSegmentTimesOnMap = !!target.checked;
      pr.saveSettings();
      pr.redrawSegmentTimeLabels();
      return true;
    }

    if (field === 'show-mini-control') {
      pr.state.settings.showMiniControl = !!target.checked;
      pr.saveSettings();
      if (pr.state.settings.showMiniControl) {
        pr.createMiniControl();
        pr.renderMiniControl();
      } else {
        pr.removeMiniControl();
      }
      return true;
    }

    if (field === 'show-portal-details-controls') {
      pr.state.settings.showPortalDetailsControls = !!target.checked;
      pr.saveSettings();
      if (pr.state.settings.showPortalDetailsControls) {
        pr.injectPortalDetailsAction();
      } else {
        pr.removePortalDetailsAction();
      }
      return true;
    }

    return false;
  };

  pr.handleDialogFieldChange = function(ev) {
    if (!pr.panelForEvent(ev)) return;

    var target = ev.target;
    var field = target && target.getAttribute('data-field');
    if (pr.handleDialogSettingChange(target)) return;

    var applyTravelTimeSettings = function() {
      if (pr.refreshRouteTravelEstimates && pr.state.route) {
        pr.refreshRouteTravelEstimates(pr.state.route);
        pr.saveRoute();
        pr.redrawSegmentTimeLabels();
      }
      pr.renderPanel();
      if (pr.state.pointsPanelOpen) pr.renderPointsPanel();
      pr.renderMiniControl();
      if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
    };

    var replotForRoutingChange = function() {
      if (pr.getRouteStops().length >= 2) {
        pr.markRouteStale({ clearRoute: true });
      } else {
        pr.renderPanel();
        if (pr.state.pointsPanelOpen) pr.renderPointsPanel();
        pr.renderMiniControl();
        if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
      }
    };

    if (field === 'default-stop-minutes') {
      var value = pr.parseDurationMinutes(target.value);
      if (value === null) {
        pr.showMessage('Invalid duration. Use values like 15m, 1.5h, or 2d.');
        target.value = pr.formatDurationInput(pr.state.settings.defaultStopMinutes);
        return;
      }

      if (value === pr.state.settings.defaultStopMinutes) return;
      if (pr.pushUndoSnapshot) pr.pushUndoSnapshot('change default wait time');

      pr.state.settings.defaultStopMinutes = value;
      pr.saveSettings();
      pr.markRouteStale();
      pr.renderPanel();
    } else if (field === 'routing-provider') {
      var provider = pr.normalizeRoutingProvider(target.value);
      if (provider === pr.state.settings.routingProvider) return;
      if (pr.pushUndoSnapshot) pr.pushUndoSnapshot('change routing provider');
      pr.state.settings.routingProvider = provider;
      pr.saveSettings();
      replotForRoutingChange();
    } else if (field === 'default-travel-mode') {
      var mode = pr.normalizeTravelMode(target.value);
      if (mode === pr.state.settings.defaultTravelMode) return;
      if (pr.pushUndoSnapshot) pr.pushUndoSnapshot('change travel mode');
      pr.state.settings.defaultTravelMode = mode;
      pr.saveSettings();
      replotForRoutingChange();
    } else if (field === 'drive-speed-mph' || field === 'bike-speed-mph' || field === 'walk-speed-mph') {
      var speed = Number(String(target.value || '').trim());
      if (!isFinite(speed) || speed <= 0) {
        pr.showMessage('Invalid speed. Use a number greater than 0.');
        if (field === 'drive-speed-mph') target.value = pr.formatSpeedInput(pr.state.settings.driveSpeedMph);
        if (field === 'bike-speed-mph') target.value = pr.formatSpeedInput(pr.state.settings.bikeSpeedMph);
        if (field === 'walk-speed-mph') target.value = pr.formatSpeedInput(pr.state.settings.walkSpeedMph);
        return;
      }

      var settingsKey = field === 'drive-speed-mph'
        ? 'driveSpeedMph'
        : (field === 'bike-speed-mph' ? 'bikeSpeedMph' : 'walkSpeedMph');
      if (speed === pr.state.settings[settingsKey]) return;
      if (pr.pushUndoSnapshot) pr.pushUndoSnapshot('change travel speed');
      pr.state.settings[settingsKey] = speed;
      pr.saveSettings();
      target.value = pr.formatSpeedInput(speed);
      applyTravelTimeSettings();
    } else if (field === 'ors-api-key') {
      var orsApiKey = String(target.value || '').trim();
      if (orsApiKey === pr.state.settings.orsApiKey) return;

      pr.state.settings.orsApiKey = orsApiKey;
      pr.saveSettings();
      if (pr.getRoutingProvider() === pr.ROUTING_PROVIDERS.ors) replotForRoutingChange();
    } else if (field === 'ors-base-url') {
      var orsBaseUrl = String(target.value || '').trim().replace(/\/+$/, '') || pr.DEFAULT_SETTINGS.orsBaseUrl;
      if (orsBaseUrl === pr.state.settings.orsBaseUrl) return;

      pr.state.settings.orsBaseUrl = orsBaseUrl;
      pr.saveSettings();
      target.value = orsBaseUrl;
      if (pr.getRoutingProvider() === pr.ROUTING_PROVIDERS.ors) replotForRoutingChange();
    } else if (field === 'route-line-color') {
      var routeLineColor = pr.normalizeRouteLineColor(target.value);
      if (routeLineColor === pr.state.settings.routeLineColor) return;

      pr.state.settings.routeLineColor = routeLineColor;
      pr.saveSettings();
      target.value = routeLineColor;
      if (pr.applyRouteLineStyle) pr.applyRouteLineStyle();
    } else if (field === 'route-line-weight') {
      var routeLineWeight = pr.normalizeRouteLineWeight(target.value);
      if (routeLineWeight === pr.state.settings.routeLineWeight) return;

      pr.state.settings.routeLineWeight = routeLineWeight;
      pr.saveSettings();
      target.value = String(routeLineWeight);
      if (pr.applyRouteLineStyle) pr.applyRouteLineStyle();
    } else if (field === 'route-line-style') {
      var routeLineStyle = pr.normalizeRouteLineStyle(target.value);
      if (routeLineStyle === pr.state.settings.routeLineStyle) return;

      pr.state.settings.routeLineStyle = routeLineStyle;
      pr.saveSettings();
      target.value = routeLineStyle;
      if (pr.applyRouteLineStyle) pr.applyRouteLineStyle();
    } else if (field === 'home-title') {
      var homeTitle = String(target.value || '').trim() || pr.DEFAULT_SETTINGS.homeTitle;
      if (homeTitle === pr.state.settings.homeTitle) return;

      pr.state.settings.homeTitle = homeTitle;
      pr.saveSettings();
      target.value = homeTitle;
    } else if (field === 'home-lat' || field === 'home-lng') {
      var homeValue = String(target.value || '').trim();
      var parsedHomeValue = field === 'home-lat'
        ? pr.parseHomeCoordinate(homeValue, -90, 90)
        : pr.parseHomeCoordinate(homeValue, -180, 180);
      if (homeValue && parsedHomeValue === null) {
        pr.showMessage(field === 'home-lat' ? 'Invalid latitude.' : 'Invalid longitude.');
        target.value = field === 'home-lat' ? pr.state.settings.homeLat : pr.state.settings.homeLng;
        return;
      }

      var homeKey = field === 'home-lat' ? 'homeLat' : 'homeLng';
      var normalizedHomeValue = homeValue ? String(parsedHomeValue) : '';
      if (normalizedHomeValue === pr.state.settings[homeKey]) return;

      pr.state.settings[homeKey] = normalizedHomeValue;
      pr.saveSettings();
      target.value = normalizedHomeValue;
    } else if (field === 'google-drive-oauth-client-id') {
      var clientId = String(target.value || '').trim();
      if (clientId === pr.state.settings.googleDriveOAuthClientId) return;

      pr.state.settings.googleDriveOAuthClientId = clientId;
      pr.saveSettings();
      pr.driveState.authorized = false;
      pr.driveState.lastError = null;
      if (document.getElementById(pr.DOM_IDS.routeLibraryContent) && pr.refreshRouteLibraryPanel) {
        pr.refreshRouteLibraryPanel();
      }
    } else if (field === 'stop-minutes') {
      var stopIndex = Number(target.getAttribute('data-index'));
      var stopValue = pr.parseDurationMinutes(target.value);
      if (stopValue === null) {
        pr.showMessage('Invalid duration. Use values like 15m, 1.5h, or 2d.');
        target.value = pr.formatDurationInput(pr.getEffectiveStopMinutes(pr.state.stops[stopIndex]));
        return;
      }

      pr.setStopMinutes(stopIndex, stopValue);
    } else if (field === 'saved-route-name') {
      var routeId = target.getAttribute('data-route-id');
      var previous = pr.routeLibraryStorage().getRoute(routeId);
      if (!pr.setSavedRouteName(routeId, target.value) && previous) {
        target.value = previous.name || '';
      }
    } else if (field === 'selected-library-route') {
      pr.setLibraryRouteSelected(target.getAttribute('data-route-id'), target.checked);
      pr.refreshRouteLibraryPanel();
    } else if (field === 'route-library-backend') {
      pr.setRouteLibraryBackend(target.value);
    }
  };

  pr.handleRouteKeydown = function(ev) {
    var key = ev.key || '';
    if (ev.target && ev.target.closest && ev.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (pr.isLayerEnabled && !pr.isLayerEnabled()) return;

    if (key === 'Escape' && pr.state.addPointMode) {
      ev.preventDefault();
      if (pr.cancelAddPointMode) pr.cancelAddPointMode();
      return;
    }

    if (key === 'Escape' && pr.state.homePickMode) {
      ev.preventDefault();
      if (pr.cancelHomePickMode) pr.cancelHomePickMode();
      return;
    }

    if (key === 'Escape' && pr.bulkSelect && pr.bulkSelect.mode) {
      ev.preventDefault();
      if (pr.cancelBulkPortalSelection) pr.cancelBulkPortalSelection();
      return;
    }

    if (!(ev.ctrlKey || ev.metaKey) || key.toLowerCase() !== 'z') return;

    ev.preventDefault();
    if (ev.shiftKey) {
      if (pr.redoRouteEdit) pr.redoRouteEdit();
    } else if (pr.undoRouteEdit) {
      pr.undoRouteEdit();
    }
  };

  pr.setupDialogEventHandlers = function() {
    if (pr.dialogEventsRegistered) return;
    pr.dialogEventsRegistered = true;

    document.addEventListener('click', pr.handleDialogClick);
    document.addEventListener('dragstart', pr.handleDialogDragStart);
    document.addEventListener('dragend', pr.handleDialogDragEnd);
    document.addEventListener('dragover', pr.handleDialogDragOver);
    document.addEventListener('drop', pr.handleDialogDrop);
    document.addEventListener('change', pr.handleDialogFieldChange);
    document.addEventListener('keydown', pr.handleRouteKeydown);
    document.addEventListener('contextmenu', pr.handleAddMenuContext);
    document.addEventListener('touchstart', pr.handleAddMenuTouchStart);
    document.addEventListener('touchend', pr.cancelAddMenuTouch);
    document.addEventListener('touchcancel', pr.cancelAddMenuTouch);
    document.addEventListener('touchmove', pr.cancelAddMenuTouch);
  };

  pr.addToolboxLink = function() {
    if (!document.getElementById('toolbox')) return;
    if (document.getElementById(pr.DOM_IDS.toolboxLink)) return;

    var link = document.createElement('a');
    link.id = pr.DOM_IDS.toolboxLink;
    link.href = '#';
    link.textContent = 'Portal Route';
    link.addEventListener('click', function(ev) {
      ev.preventDefault();
      if (!pr.isLayerEnabled()) return;
      pr.openMainPanel();
    });

    var toolbox = document.getElementById('toolbox');
    toolbox.appendChild(link);
  };

  pr.removeToolboxLink = function() {
    var link = document.getElementById(pr.DOM_IDS.toolboxLink);
    if (link && link.parentNode) {
      link.parentNode.removeChild(link);
    }
  };

  pr.injectCss = function() {
    if (document.getElementById(pr.DOM_IDS.css)) return;
    var style = document.createElement('style');
    style.id = pr.DOM_IDS.css;
    style.textContent = pr.CSS;
    document.head.appendChild(style);
  };


  pr.setupLayerControl = function() {
    if (pr.layerGroup) return;

    pr.layerGroup = L.FeatureGroup ? new L.FeatureGroup() : L.layerGroup();

    if (typeof window.addLayerGroup === 'function') {
      window.addLayerGroup('Portal Route', pr.layerGroup, true);
    } else if (window.layerChooser && typeof window.layerChooser.addOverlay === 'function') {
      window.layerChooser.addOverlay(pr.layerGroup, 'Portal Route');
      pr.layerGroup.addTo(window.map);
    }
  };

  pr.syncLayerUi = function() {
    if (pr.isLayerEnabled()) {
      pr.addToolboxLink();
      if (pr.state.settings.showMiniControl) {
        pr.createMiniControl();
      } else {
        pr.removeMiniControl();
      }
      pr.setMiniControlVisible(true);
      pr.renderMiniControl();
      return;
    }

    pr.state.panelOpen = false;
    pr.savePanelOpen();
    pr.closeDialog();
    pr.state.pointsPanelOpen = false;
    pr.closePointsDialog();
    if (pr.cancelBulkPortalSelection) pr.cancelBulkPortalSelection();
    pr.setMiniControlVisible(false);
    pr.removeToolboxLink();
  };

  pr.enable = function() {
    pr.addToolboxLink();
    if (pr.state.settings.showMiniControl) pr.createMiniControl();
    pr.setMiniControlVisible(true);
    pr.renderMiniControl();
    pr.redrawLabels();
  };

  pr.disable = function() {
    pr.state.panelOpen = false;
    pr.savePanelOpen();
    pr.closeDialog();
    pr.state.pointsPanelOpen = false;
    pr.closePointsDialog();
    if (pr.cancelBulkPortalSelection) pr.cancelBulkPortalSelection();
    pr.setMiniControlVisible(false);
    pr.removeToolboxLink();
  };

  pr.setupLayerEvents = function() {
    if (pr.layerEventsRegistered) return;
    if (!window.map || !pr.layerGroup) return;

    window.map.on('layeradd', function(e) {
      if (e.layer !== pr.layerGroup) return;
      pr.enable();
    });

    window.map.on('layerremove', function(e) {
      if (e.layer !== pr.layerGroup) return;
      pr.disable();
    });

    pr.layerEventsRegistered = true;
  };

  pr.setupMapPointEvents = function() {
    if (pr.mapPointEventsRegistered) return;
    if (!window.map) return;

    window.map.on('click', function(e) {
      if (pr.isLayerEnabled && !pr.isLayerEnabled()) return;

      if (pr.state.homePickMode) {
        if (pr.cancelHomePickMode) {
          pr.cancelHomePickMode({ silent: true });
        } else {
          pr.state.homePickMode = false;
          if (pr.syncAddPointModeUi) pr.syncAddPointModeUi();
        }
        pr.setHomeLocation(e.latlng.lat, e.latlng.lng, pr.state.settings.homeTitle || pr.DEFAULT_SETTINGS.homeTitle, { addWaypoint: true });
        return;
      }

      if (!pr.state.addPointMode) return;

      if (pr.cancelAddPointMode) {
        pr.cancelAddPointMode({ silent: true });
      } else {
        pr.state.addPointMode = false;
        if (pr.syncAddPointModeUi) pr.syncAddPointModeUi();
      }
      pr.addMapPointAtLatLng(e.latlng);
      pr.showMessage('Map point added.');
    });

    pr.mapPointEventsRegistered = true;
  };

  pr.setup = function() {
    try {
      if (plugin_info && plugin_info.script && plugin_info.script.version) {
        pr.VERSION = plugin_info.script.version;
      }

      pr.injectCss();
      pr.loadState();
      pr.setupLayerControl();
      pr.setupLayerEvents();
      pr.createMiniControl();
      pr.setupDialogEventHandlers();
      pr.setupMapPointEvents();
      pr.addToolboxLink();
      pr.syncLayerUi();
      pr.renderPanel();
      pr.renderMiniControl();
      pr.redrawLabels();
      pr.redrawRouteLine();
      if (!pr.state.route || pr.state.routeDirty) pr.queueRouteCalculationIfReady();
      pr.injectPortalDetailsAction();

      if (typeof window.addHook === 'function' && !pr.portalHookRegistered) {
        window.addHook('portalDetailsUpdated', function() {
          pr.clearSelectedMapPoint();
          pr.injectPortalDetailsAction();
          pr.renderMiniControl();
        });

        window.addHook('portalSelected', function(data) {
          data = data || {};
          if (data.selectedPortalGuid === data.unselectedPortalGuid) return;

          if (data.selectedPortalGuid) {
            window.selectedPortal = data.selectedPortalGuid;
            pr.clearSelectedMapPoint();
          } else {
            window.selectedPortal = null;
          }

          pr.redrawLabels();
          pr.renderPanel();
          pr.renderMiniControl();
          if (pr.injectPortalDetailsAction) pr.injectPortalDetailsAction();
        });
        pr.portalHookRegistered = true;
      }

      console.log('Portal Route setup complete');
    } catch (e) {
      console.error('Portal Route setup failed:', e);
    }
  };

(function() {
  function isPortalRouteLayerOff() {
    return pr.isLayerEnabled && !pr.isLayerEnabled();
  }

  function removePortalRouteInfoPanelControls() {
    if (pr.removePortalDetailsAction) pr.removePortalDetailsAction();
  }

  var originalInjectPortalDetailsAction = pr.injectPortalDetailsAction;
  if (typeof originalInjectPortalDetailsAction === 'function') {
    pr.injectPortalDetailsAction = function() {
      if (isPortalRouteLayerOff()) {
        removePortalRouteInfoPanelControls();
        return;
      }

      return originalInjectPortalDetailsAction.apply(this, arguments);
    };
  }

  var originalSyncLayerUi = pr.syncLayerUi;
  if (typeof originalSyncLayerUi === 'function') {
    pr.syncLayerUi = function() {
      var result = originalSyncLayerUi.apply(this, arguments);

      if (isPortalRouteLayerOff()) {
        removePortalRouteInfoPanelControls();
      }

      return result;
    };
  }

  var originalDisable = pr.disable;
  if (typeof originalDisable === 'function') {
    pr.disable = function() {
      var result = originalDisable.apply(this, arguments);
      removePortalRouteInfoPanelControls();
      return result;
    };
  }
})();


  var setup = pr.setup;

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
