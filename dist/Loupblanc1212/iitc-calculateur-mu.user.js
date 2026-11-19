// ==UserScript==
// @author          Loupblanc1212
// @name            Calculateur de MU
// @namespace       https://intel.ingress.com/
// @version         1.4.1
// @description     Estime les Mind Units d’un champ en sélectionnant ses trois portails sur la carte Intel.
// @runAt           document-end
// @updateURL       https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/Loupblanc1212/iitc-calculateur-mu.meta.js
// @downloadURL     https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/Loupblanc1212/iitc-calculateur-mu.user.js
// @antiFeatures    export
// @id              iitc-calculateur-mu@Loupblanc1212
// @homepageURL     https://github.com/LoupblancSwitzerland/Ingress
// @issueTracker    https://github.com/LoupblancSwitzerland/Ingress/issues
// @match           https://intel.ingress.com/*
// @grant           none
// ==/UserScript==


(function () {
  'use strict';

  function install() {
    const id = 'loupblanc1212-mu';
    window.plugin = window.plugin || function () {};
    if (window.plugin[id]) return;
    window.plugin[id] = {};

    function setup() {
      const { L, map } = window;
      const preview = L.layerGroup().addTo(map);
      const vertices = [];
      const fields = new Map();
      const number = new Intl.NumberFormat('fr-CH');
      const area = new Intl.NumberFormat('fr-CH', { maximumFractionDigits: 4 });

      let active = false;

      const control = L.control({ position: 'topright' });
      control.onAdd = () => {
        const container = L.DomUtil.create('div', 'leaflet-bar');
        container.style.cssText = 'background:#14252c;color:#fff;padding:8px;max-width:min(260px,65vw);';
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.textContent = 'Calculateur MU';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', id);
        container.append(toggle);

        const panel = document.createElement('div');
        panel.id = id;
        panel.hidden = true;
        container.append(panel);

        const instructions = document.createElement('p');
        panel.append(instructions);

        const layers = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = 'Multi-couche';
        const extraRows = document.createElement('div');
        extraRows.style.cssText = 'max-height:40vh;overflow:auto;';
        const total = document.createElement('p');
        total.setAttribute('role', 'status');
        layers.append(summary, extraRows, total);

        const rows = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ', (letter, index) => {
          const row = document.createElement('div');
          row.style.cssText = 'display:grid;grid-template-columns:1.25em minmax(0,1fr) auto;gap:6px;margin:4px 0;align-items:center;';
          const label = document.createElement('label');
          label.textContent = letter;
          const input = document.createElement('input');
          input.id = `${id}-${letter}`;
          label.htmlFor = input.id;
          input.type = 'text';
          input.readOnly = true;
          input.style.cssText = 'width:100%;min-width:0;color:#111;background:#fff;';
          input.setAttribute('aria-label', `Coordonnées du portail ${letter}`);
          const mu = document.createElement('span');
          row.append(label, input, mu);
          (index < 3 ? panel : extraRows).append(row);
          return { input, mu };
        });

        const unlock = document.createElement('button');
        unlock.type = 'button';
        unlock.textContent = '🔓';
        unlock.title = 'Déverrouiller les portails A et B';
        unlock.setAttribute('aria-label', unlock.title);
        panel.append(unlock, layers);

        const disclosure = document.createElement('p');
        disclosure.textContent = 'Le calcul envoie les trois coordonnées à InvestigateXM.';
        const credit = document.createElement('p');
        credit.textContent = 'Plug-in créé par Loupblanc1212';
        panel.append(disclosure, credit);

        const status = document.createElement('div');
        status.setAttribute('role', 'status');
        panel.append(status);

        function refresh() {
          const selected = [...fields.values()];
          instructions.textContent = vertices.length < 2
            ? `Choisis le portail ${vertices.length === 0 ? 'A' : 'B'}.`
            : layers.open
              ? 'A et B sont verrouillés. Choisis les autres portails sur la carte.'
              : 'A et B sont verrouillés. Ouvre Multi-couche pour ajouter des champs.';
          const completed = selected.filter((field) => field.result);
          const sum = completed.reduce((acc, field) => acc + BigInt(field.result.mu), 0n);
          total.textContent = `Total estimé ${number.format(sum)} MU (${completed.length}/${selected.length} champs calculés)`;
          unlock.hidden = vertices.length < 2;
          rows.forEach(({ input, mu }, index) => {
            const field = selected[index - 2];
            const point = index < 2 ? vertices[index] : field?.point;
            input.value = point ? coordinates(point) : '';
            input.title = field?.name ?? '';
            mu.textContent = field?.message ?? '';
            mu.title = field?.detail ?? '';
          });

          preview.clearLayers();
          if (!active) return;
          const base = vertices.map(({ lat, lng }) => [lat, lng]);
          const style = { color: '#27d5ec', weight: 3, interactive: false };
          if (base.length === 2 && !selected.length) L.polyline(base, style).addTo(preview);
          for (const { point: { lat, lng } } of selected) {
            L.polygon([...base, [lat, lng]], { ...style, fillOpacity: 0.1 }).addTo(preview);
          }
          base.forEach((point) => L.circleMarker(point, { ...style, radius: 8, fill: false }).addTo(preview));
        }

        function coordinates({ lat, lng }) {
          return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        }

        function clearFields() {
          for (const field of fields.values()) {
            const controller = field.controller;
            field.controller = null;
            controller?.abort();
          }
          fields.clear();
        }

        function clear() {
          clearFields();
          vertices.length = 0;
          status.textContent = '';
          refresh();
        }

        toggle.addEventListener('click', () => {
          active = !active;
          panel.hidden = !active;
          toggle.setAttribute('aria-expanded', String(active));
          if (active || vertices.length >= 2) refresh();
          else clear();
        });
        unlock.addEventListener('click', clear);
        layers.addEventListener('toggle', () => {
          status.textContent = '';
          refresh();
        });

        window.addHook('portalSelected', ({ selectedPortalGuid }) => {
          if (!active || !selectedPortalGuid) return;
          const portal = window.portals[selectedPortalGuid];
          const point = portal?.getLatLng();
          if (!point || !Number.isFinite(point.lat) || !Number.isFinite(point.lng)) return;
          const key = coordinates(point);
          if (vertices.some((base) => base.guid === selectedPortalGuid || coordinates(base) === key)) {
            status.textContent = 'Choisis un autre portail.';
            return;
          }
          status.textContent = '';
          if (vertices.length < 2) {
            vertices.push({ guid: selectedPortalGuid, lat: point.lat, lng: point.lng });
            refresh();
            return;
          }
          let field = fields.get(key);
          if (!field) {
            if (!layers.open && fields.size > 1) {
              status.textContent = 'Ouvre Multi-couche pour ajouter un portail à la série.';
              return;
            }
            if (!layers.open) clearFields();
            if (fields.size >= rows.length - 2) {
              status.textContent = 'Les 24 champs sont remplis. Déverrouille A et B pour commencer une autre série.';
              return;
            }
            field = { point, name: portal.options?.data?.title || key };
            fields.set(key, field);
          }
          if (!field.result && !field.controller) calculate(field);
        });

        async function calculate(field) {
          const controller = new AbortController();
          field.controller = controller;
          const report = (message, detail = '') => {
            field.message = message;
            field.detail = detail;
          };
          const timer = setTimeout(() => controller.abort(), 25000);
          report('…', 'Calcul en cours');
          refresh();
          try {
            const response = await fetch('https://api.investigatexm.com/getMU', {
              method: 'POST',
              credentials: 'omit',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ coordinates: [...vertices, field.point].map(({ lat, lng }) => ({ lat, lng })) }),
              signal: controller.signal,
            });
            if (!response.ok) {
              if (response.status === 400) throw new Error('Ces trois points ne forment pas un champ valide.');
              throw new Error(`Le service a renvoyé une erreur (${response.status}). Réessaie.`);
            }
            const result = await response.json();
            if (!Number.isSafeInteger(result.mu) || result.mu < 0 ||
                !Number.isFinite(result.area_km2) || result.area_km2 < 0) {
              throw new Error('Le service a renvoyé un résultat illisible.');
            }
            if (field.controller === controller && !controller.signal.aborted) {
              field.result = result;
              report(`${number.format(result.mu)} MU`, `${area.format(result.area_km2)} km²`);
            }
          } catch (error) {
            if (field.controller === controller) {
              const detail = controller.signal.aborted ? 'Délai dépassé.'
                : error instanceof TypeError ? 'Service inaccessible.' : error.message;
              report('Erreur', `${detail} Clique à nouveau sur ce portail pour réessayer.`);
              status.textContent = field.detail;
            }
          } finally {
            clearTimeout(timer);
            if (field.controller === controller) {
              field.controller = null;
              refresh();
            }
          }
        }

        refresh();
        return container;
      };
      control.addTo(map);
    }

    setup.info = { pluginId: id, buildName: 'release', dateTimeVersion: '20261119.140000' };
    window.bootPlugins = window.bootPlugins || [];
    window.bootPlugins.push(setup);
    if (window.iitcLoaded) setup();
  }

  const script = document.createElement('script');
  script.textContent = `(${install.toString()})();`;
  (document.head || document.documentElement).append(script);
  script.remove();
})();
