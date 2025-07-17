// ==UserScript==
// @author          Xelminoe
// @id              Microfield-checker@Xelminoe
// @name            Microfield Checker
// @version         1.0.5
// @category        Layer
// @description     Check optimal microfields inside a triangle. Ideal for nearly-completed or densely built microfields.
// @downloadURL     https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/Xelminoe/Microfield-checker.user.js
// @updateURL       https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/Xelminoe/Microfield-checker.meta.js
// @depends         draw-tools@breunigs
// @recommends      keepalldata@DanielOnDiordna
// @preview         https://raw.github.com/Xelminoe/Microfield-Checker/main/images/example00.jpg
// @issueTracker    https://github.com/Xelminoe/Microfield-Checker/issues
// @match           https://intel.ingress.com/*
// @grant           none
// ==/UserScript==


(function () {
    function wrapper() {
        // Ensure plugin namespace exists
        if (typeof window.plugin !== 'function') window.plugin = () => {};

        const plugin = {};

        // Floating point tolerance (used in marker matching)
        plugin.TOLERANCE = 1e-5;

        // Generate a unique string key for a portal/point based on its coordinates
        plugin.key = function (p) {
            return `${p.lat.toFixed(6)},${p.lng.toFixed(6)}`;
        };

        // Point-in-polygon test using ray-casting algorithm
        plugin.pnpoly = function (polygon, point) {
            let c = false;
            const n = polygon.length;
            for (let i = 0, j = n - 1; i < n; j = i++) {
                if (
                    ((polygon[i].lat > point.lat) !== (polygon[j].lat > point.lat)) &&
                    (point.lng <
                     (polygon[j].lng - polygon[i].lng) * (point.lat - polygon[i].lat) /
                     (polygon[j].lat - polygon[i].lat) +
                     polygon[i].lng)
                ) {
                    c = !c;
                }
            }
            return c;
        };

        // Check if two portals are linked (exact coordinate match, no tolerance)
        plugin.portalsLinked = function (p1, p2) {
            return Object.values(window.links).some(link => {
                const [a, b] = link.getLatLngs();
                const same = (a, b, x, y) =>
                a.lat === x.lat &&
                      a.lng === x.lng &&
                      b.lat === y.lat &&
                      b.lng === y.lng;
                return same(a, b, p1, p2) || same(b, a, p1, p2);
            });
        };

        // Main analysis function
        plugin.analyze = function () {
          const runAnalysis = () => {
            
            if (window._microfieldLayer) {
                window._microfieldLayer.clearLayers();
            } else {
                window._microfieldLayer = L.layerGroup().addTo(window.map);
            }
            const resultLayer = window._microfieldLayer;


            const markers = [];

            // Collect user-drawn markers from drawTools
            window.plugin.drawTools.drawnItems.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    const { lat, lng } = layer.getLatLng();
                    markers.push({ lat, lng });
                }
            });

            // Ensure exactly 3 markers are placed
            if (markers.length !== 3) {
                alert(`Error: Expected exactly 3 markers, found ${markers.length}.`);
                return;
            }

            // Build a list of all loaded portals with coordinates
            const portalList = Object.values(window.portals).map(p => ({
                lat: p.getLatLng().lat,
                lng: p.getLatLng().lng,
                ref: p
            }));

            // Build a list of all fields with 3 anchor portals (triangle fields)
            const fieldList = Object.values(window.fields).map(f => {
                const points = f.options?.data?.points;
                if (!points || points.length !== 3) return null;

                return {
                    latlngs: points.map(pt => ({
                        lat: pt.latE6 / 1e6,
                        lng: pt.lngE6 / 1e6,
                    })),
                    ref: f
                };
            }).filter(f => f !== null);

            // Helper: check if a triangle matches any loaded field
            function matchField(triangle, fieldList) {
                const triCoords = triangle.map(p => `${p.lat},${p.lng}`);
                return fieldList.some(field => {
                    const fieldCoords = field.latlngs.map(p => `${p.lat},${p.lng}`);
                    return triCoords.every(coord => fieldCoords.includes(coord));
                });
            }

            // Helper: find the portal in portalList that matches a marker
            function matchMarker(marker) {
                return portalList.find(p =>
                                       Math.abs(p.lat - marker.lat) < plugin.TOLERANCE &&
                                       Math.abs(p.lng - marker.lng) < plugin.TOLERANCE
                                      );
            }

            // Match 3 drawn markers to real portals
            const triangle = markers.map(m => {
                const match = matchMarker(m);
                if (!match) {
                    alert(`Error: No exact portal found at ${m.lat}, ${m.lng}`);
                    throw new Error("Unmatched marker.");
                }
                return match;
            });

            const [A, B, C] = triangle;

            // Verify that the triangle is fully linked
            if (
                !plugin.portalsLinked(A, B) ||
                !plugin.portalsLinked(B, C) ||
                !plugin.portalsLinked(C, A)
            ) {
                alert("Error: The three portals are not all linked pairwise.");
                return;
            }

            // Initialize nesting level tracking
            const levelMap = new Map();
            levelMap.set(plugin.key(A), 0);
            levelMap.set(plugin.key(B), 0);
            levelMap.set(plugin.key(C), 0);

            // Identify all portals inside the triangle (excluding the vertices)
            const polygon = [A, B, C];
            const insidePortals = portalList.filter(p => plugin.pnpoly(polygon, p));
            const unmarked = insidePortals.filter(p => !levelMap.has(plugin.key(p)));

            // Begin BFS triangle expansion from initial triangle
            const queue = [{ points: [A, B, C], level: 0 }];
            const missingFields = [];

            while (queue.length > 0) {
                const tri = queue.shift();
                const [p1, p2, p3] = tri.points;

                // Record triangles that are not covered by existing fields
                if (!matchField([p1, p2, p3], fieldList)) {
                    missingFields.push({
                        points: [p1, p2, p3],
                        level: tri.level
                    });
                }

                // Determine next nesting level
                const l = Math.max(
                    levelMap.get(plugin.key(p1)),
                    levelMap.get(plugin.key(p2)),
                    levelMap.get(plugin.key(p3))
                ) + 1;

                // Attempt to add new portals inside the current triangle
                for (const portal of unmarked) {
                    const k = plugin.key(portal);
                    if (levelMap.has(k)) continue;
                    if (!plugin.pnpoly([p1, p2, p3], portal)) continue;

                    if (
                        plugin.portalsLinked(portal, p1) &&
                        plugin.portalsLinked(portal, p2) &&
                        plugin.portalsLinked(portal, p3)
                    ) {
                        levelMap.set(k, l);
                        queue.push({ points: [p1, p2, portal], level: l });
                        queue.push({ points: [p2, p3, portal], level: l });
                        queue.push({ points: [p3, p1, portal], level: l });
                    }
                }
            }

            // Draw level-labeled colored circles for all nested portals
            const COLORS = [
                '#000000', '#ffcc00', '#ffa500', '#ff6600', '#ff0000',
                '#ff00ff', '#cc00ff', '#9900ff', '#6600ff', '#3333ff',
                '#00ccff', '#00ffcc', '#00ff66', '#00ff00', '#66ff00',
                '#ccff00', '#ffff00'
            ];

            for (const [pos, lvl] of levelMap.entries()) {
                const [lat, lng] = pos.split(',').map(Number);
                const color = COLORS[lvl % COLORS.length];

                const marker = L.circleMarker([lat, lng], {
                    radius: 8,
                    color,
                    fillColor: color,
                    fillOpacity: 0.8,
                    weight: 2
                });
                resultLayer.addLayer(marker);

                const label = L.tooltip({
                    permanent: true,
                    direction: 'center',
                    className: 'mf-label'
                })
                .setContent(`${lvl}`)
                .setLatLng([lat, lng]);

                marker.bindTooltip(label);
                resultLayer.addLayer(label);
            }

            // Mark un-nested portals inside the triangle with red circles
            for (const p of insidePortals) {
                if (!levelMap.has(plugin.key(p))) {
                    const marker = L.circleMarker([p.lat, p.lng], {
                        radius: 6,
                        color: 'red',
                        fillColor: 'red',
                        fillOpacity: 1,
                        weight: 2
                    });
                    resultLayer.addLayer(marker);
                }
            }

            console.log("Microfield Level Map:", levelMap);

            // Remove existing info panel if present
            $('#microfield-info-panel').remove();

            // Create panel container
            const panel = $(`
              <div id="microfield-info-panel" style="
                position: absolute;
                top: 80px;
                right: 20px;
                width: 360px;
                background: #ffffffee;
                border: 1px solid #aaa;
                padding: 10px;
                font-size: 13px;
                z-index: 9999;
                box-shadow: 0 0 8px rgba(0,0,0,0.2);
                border-radius: 6px;
              ">
                <div style="text-align: right;">
                  <button id="microfield-info-close" style="border: none; background: none; font-size: 16px; cursor: pointer;">✖</button>
                </div>
                <div id="microfield-info-content"></div>
              </div>
            `);
            $('body').append(panel);
            $('#microfield-info-panel').draggable();

            // Handle close button
            $('#microfield-info-close').on('click', () => {
                $('#microfield-info-panel').remove();
                if (window._microfieldLayer) {
                    window._microfieldLayer.clearLayers();
                }
            });


            // Populate stats info
            const info = `
                <b>Microfield Analysis Complete</b><br/>
                Total Portal Number: ${insidePortals.length + 3}<br/>
                Well-Nested Portals Number: ${levelMap.size}<br/>
                Field Optimal Number: ${insidePortals.length * 3 + 1}<br/>
                Well-Nested Field Theory Number: ${(levelMap.size - 3) * 3 + 1}<br/>
                Well-Nested Field Actual Number: ${(levelMap.size - 3) * 3 + 1 - missingFields.length}<br/>
                Well-Nested Field Missing Number: ${missingFields.length}<br/>
                ${missingFields.length > 0 ? "<br/><b>Click Each Missing Field to Highlight:</b>" : ""}
                `;

            $('#microfield-info-content').html(info);
            $('#microfield-info-content').css({
              'color': '#111'
            }); // Fixing render issue for mobile

            // Clean up previous polygons
            const missingPolygons = [];

            missingFields.forEach((tri, index) => {
                const latlngs = tri.points.map(p => [p.lat, p.lng]);

                // Create red triangle polygon
                const poly = L.geodesicPolygon(latlngs, {
                    color: 'red',
                    fillColor: 'red',
                    fillOpacity: 0.15,
                    weight: 1,
                    dashArray: '5,5',
                    interactive: false
                });
                resultLayer.addLayer(poly);

                poly._highlighted = false;
                missingPolygons.push(poly);

                // Generate display text
                const coordsText = tri.points.map(p => `(${p.lat.toFixed(6)}, ${p.lng.toFixed(6)})`).join(" - ");

                // Add clickable line to panel
                const entry = $(`<div style="margin: 4px 0; cursor: pointer;">${index + 1}. ${coordsText}</div>`);
                entry.on('click', () => {
                    poly._highlighted = !poly._highlighted;
                    if (poly._highlighted) {
                        poly.setStyle({ weight: 3, color: 'orange', fillOpacity: 0.4 });
                    } else {
                        poly.setStyle({ weight: 1, color: 'red', fillOpacity: 0.15 });
                    }
                });
                $('#microfield-info-content').append(entry);
            });
            console.log('info content:', $('#microfield-info-content').html()); // Testing for mobile
          }; // End of const runAnalysis
        
          const updatestatus = document.getElementById('updatestatus');
        
          if (updatestatus && getComputedStyle(updatestatus).display === 'none') {
            // 📱 Mobile mode and info panel on. Waiting for it to be closed.
            const observer = new MutationObserver(() => {
              if (getComputedStyle(updatestatus).display === 'block') {
                observer.disconnect();
                runAnalysis();
              }
            });
        
            observer.observe(updatestatus, { attributes: true, attributeFilter: ['style'] });
          } else {
            // 💻 Desktop mode
            runAnalysis();
          }
        };

        // Add a button to IITC toolbox to trigger analysis
        plugin.setup = function () {
            $('#toolbox').append(
                `<a onclick="window.plugin.microfieldAnalyzer.analyze()" title="Run microfield analysis">Check-Microfield</a>`
            );
        };

        // Register plugin with IITC
        window.plugin.microfieldAnalyzer = plugin;

        if (!window.bootPlugins) window.bootPlugins = [];
        window.bootPlugins.push(plugin.setup);

        // If IITC already booted, run setup immediately
        if (window.iitcLoaded) plugin.setup();
    }

    // Inject plugin into IITC context
    const script = document.createElement('script');
    script.appendChild(document.createTextNode('(' + wrapper + ')();'));
    (document.body || document.head || document.documentElement).appendChild(script);
})();
