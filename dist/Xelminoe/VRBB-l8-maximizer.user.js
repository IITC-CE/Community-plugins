// ==UserScript==
// @author          Xelminoe
// @id              VRBB-l8-maximizer@Xelminoe
// @name            VRBB L8 Maximizer
// @category        Info
// @version         1.0
// @description     Assist planning L8 resonator max-out using VRBB — e.g. 3 agents from the same side build an L8 portal in 15 minutes.
// @downloadURL     https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/Xelminoe/VRBB-l8-maximizer.user.js
// @updateURL       https://raw.githubusercontent.com/IITC-CE/Community-plugins/master/dist/Xelminoe/VRBB-l8-maximizer.meta.js
// @homePage        https://xelminoe.github.io/VRBB-L8-Maximizer/
// @homepageURL     https://xelminoe.github.io/VRBB-L8-Maximizer/
// @issueTracker    https://github.com/Xelminoe/VRBB-L8-Maximizer/issues
// @match           https://intel.ingress.com/*
// @grant           none
// ==/UserScript==


function wrapper(plugin_info) {
    if (typeof window.plugin !== 'function') window.plugin = () => {};
    window.plugin.vrbbL8Maximizer = {};

    const plugin = window.plugin.vrbbL8Maximizer;

    plugin.strategyLibrary = [
        {
            name: "Strategy-NullOrVRBB-P0-Flip",
            conditions: {
                isPortalTeamNullOrVRBBTeam: true,
            },
            stages: [
                {
                    stage: "before VRBB",
                    action: [
                        "XReso",
                        "VRBB"
                    ],
                },
                {
                    stage: "Phase 1",
                    action: [
                        "Wait"
                    ],
                },
                {
                    stage: "Phase 2",
                    action: [
                        "YReso",
                        "Wait"
                    ],
                },
                {
                    stage: "Phase 3",
                    action: [
                        "PseudoFlip",
                        "XFlip",
                        "YReso",
                        "Wait"
                    ]
                },
                {
                    stage: "Phase 4",
                    action: [
                        "XReso",
                        "Done"
                    ]
                },
                {
                    stage: "Phase 5",
                    action: [
                        "Done"
                    ]
                },
                {
                    stage: "After VRBB",
                    action: [
                        "Done"
                    ]
                },
            ]
        },
        {
            name: "Strategy-NullOrVRBB-P0-NoFlip",
            conditions: {
                isPortalTeamNullOrVRBBTeam: true,
            },
            stages: [
                {
                    stage: "before VRBB",
                    action: [
                        "XReso",
                        "VRBB"
                    ],
                },
                {
                    stage: "Phase 1",
                    action: [
                        "Wait"
                    ],
                },
                {
                    stage: "Phase 2",
                    action: [
                        "YReso",
                        "Wait"
                    ],
                },
                {
                    stage: "Phase 3",
                    action: [
                        "PseudoFlip",
                        "Done"
                    ]
                },
                {
                    stage: "Phase 4",
                    action: [
                        "Done"
                    ]
                },
                {
                    stage: "Phase 5",
                    action: [
                        "Done"
                    ]
                },
                {
                    stage: "After VRBB",
                    action: [
                        "Done"
                    ]
                },
            ]
        },
        {
            name: "Strategy-Null-YActive-P1-Flip",
            conditions: {
                isPortalTeamNull: true,
                isYTeamActive: true
            },
            stages: [
                {
                    stage: "before VRBB",
                    action: [
                        "NoReso",
                        "VRBB"
                    ],
                },
                {
                    stage: "Phase 1",
                    action: [
                        "XReso",
                        "Wait"
                    ],
                },
                {
                    stage: "Phase 2",
                    action: [
                        "YReso",
                        "YFlip",
                        "XReso",
                        "Wait"
                    ],
                },
                {
                    stage: "Phase 3",
                    action: [
                        "YReso",
                        "Done"
                    ]
                },
                {
                    stage: "Phase 4",
                    action: [
                        "Done"
                    ]
                },
                {
                    stage: "Phase 5",
                    action: [
                        "Done"
                    ]
                },
                {
                    stage: "After VRBB",
                    action: [
                        "Done"
                    ]
                },
            ]
        },
        {
            name: "Strategy-Null-YActive-P2-Flip",
            conditions: {
                isPortalTeamNull: true,
                isYTeamActive: true
            },
            stages: [
                {
                    stage: "before VRBB",
                    action: [
                        "NoReso",
                        "VRBB"
                    ],
                },
                {
                    stage: "Phase 1",
                    action: [
                        "NoReso"
                    ],
                },
                {
                    stage: "Phase 2",
                    action: [
                        "XReso",
                        "Wait"
                    ],
                },
                {
                    stage: "Phase 3",
                    action: [
                        "YReso",
                        "YFlip",
                        "XReso",
                        "Wait"
                    ]
                },
                {
                    stage: "Phase 4",
                    action: [
                        "YReso",
                        "Done"
                    ]
                },
                {
                    stage: "Phase 5",
                    action: [
                        "Done"
                    ]
                },
                {
                    stage: "After VRBB",
                    action: [
                        "Done"
                    ]
                },
            ]
        },
        {
            name: "Strategy-Null-YInactive-P1-Flip",
            conditions: {
                isPortalTeamNull: true,
                isYTeamActive: false
            },
            stages: [
                {
                    stage: "before VRBB",
                    action: [
                        "NoReso",
                        "VRBB"
                    ],
                },
                {
                    stage: "Phase 1",
                    action: [
                        "XReso",
                        "XFlip",
                        "Wait"
                    ],
                },
                {
                    stage: "Phase 2",
                    action: [
                        "XReso",
                        "Done"
                    ],
                },
                {
                    stage: "Phase 3",
                    action: [
                        "Done"
                    ]
                },
                {
                    stage: "Phase 4",
                    action: [
                        "Done"
                    ]
                },
                {
                    stage: "Phase 5",
                    action: [
                        "Done"
                    ]
                },
                {
                    stage: "After VRBB",
                    action: [
                        "Done"
                    ]
                },
            ]
        },
        {
            name: "Strategy-Null-YInactive-P2-Flip",
            conditions: {
                isPortalTeamNull: true,
                isYTeamActive: false
            },
            stages: [
                {
                    stage: "before VRBB",
                    action: [
                        "NoReso",
                        "VRBB"
                    ],
                },
                {
                    stage: "Phase 1",
                    action: [
                        "NoReso"
                    ],
                },
                {
                    stage: "Phase 2",
                    action: [
                        "XReso",
                        "XFlip",
                        "Wait"
                    ],
                },
                {
                    stage: "Phase 3",
                    action: [
                        "XReso",
                        "Done"
                    ]
                },
                {
                    stage: "Phase 4",
                    action: [
                        "Done"
                    ]
                },
                {
                    stage: "Phase 5",
                    action: [
                        "Done"
                    ]
                },
                {
                    stage: "After VRBB",
                    action: [
                        "Done"
                    ]
                },
            ]
        },
        {
            name: "Strategy-Other-Flip",
            conditions: {
                isPortalTeamNullOrVRBBTeam: false,
            },
            stages: [
                {
                    stage: "before VRBB",
                    action: [
                        "YReso",
                        "VRBB"
                    ],
                },
                {
                    stage: "Phase 1",
                    action: [
                        "Wait"
                    ],
                },
                {
                    stage: "Phase 2",
                    action: [
                        "PseudoFlip",
                        "XFlip",
                        "YReso",
                        "Wait"
                    ],
                },
                {
                    stage: "Phase 3",
                    action: [
                        "XReso",
                        "Done"
                    ]
                },
                {
                    stage: "Phase 4",
                    action: [
                        "Done"
                    ]
                },
                {
                    stage: "Phase 5",
                    action: [
                        "Done"
                    ]
                },
                {
                    stage: "After VRBB",
                    action: [
                        "Done"
                    ]
                },
            ]
        },
        {
            name: "Strategy-Other-NoFlip",
            conditions: {
                isPortalTeamNullOrVRBBTeam: false,
            },
            stages: [
                {
                    stage: "before VRBB",
                    action: [
                        "YReso",
                        "VRBB"
                    ],
                },
                {
                    stage: "Phase 1",
                    action: [
                        "Wait"
                    ],
                },
                {
                    stage: "Phase 2",
                    action: [
                        "PseudoFlip",
                        "Done"
                    ],
                },
                {
                    stage: "Phase 3",
                    action: [
                        "Done"
                    ]
                },
                {
                    stage: "Phase 4",
                    action: [
                        "Done"
                    ]
                },
                {
                    stage: "Phase 5",
                    action: [
                        "Done"
                    ]
                },
                {
                    stage: "After VRBB",
                    action: [
                        "Done"
                    ]
                },
            ]
        }
    ];

    plugin.initializeStrategyPointer = function(strategy) {
        return {
            strategyName: strategy.name,
            stageIndex: 0,
            actionIndex: 0,
            lastAction: null,
            currentAction: strategy.stages[0]?.action[0] || null,
            done: false
        };
    };

    plugin.advanceStrategyPointer = function(pointer, strategy) {
        const last = pointer.currentAction;

        let sIdx = pointer.stageIndex;
        let aIdx = pointer.actionIndex;

        const stageList = strategy.stages;

        if (aIdx + 1 < stageList[sIdx].action.length) {
            aIdx += 1;
        } else if (sIdx + 1 < stageList.length) {
            sIdx += 1;
            aIdx = 0;
        } else {
            return {
                ...pointer,
                lastAction: last,
                currentAction: null,
                done: true
            };
        }

        return {
            ...pointer,
            stageIndex: sIdx,
            actionIndex: aIdx,
            lastAction: last,
            currentAction: stageList[sIdx].action[aIdx],
            done: false
        };
    };

    plugin.isPortalTeamNullOrVRBBTeam = function (portalStatus0, agentList) {
        const team = portalStatus0?.team;
        if (!team) return true; 

        const vrbbAgent = agentList.find(a => a.useVrbb);
        if (!vrbbAgent || !vrbbAgent.team) return false;

        return team === vrbbAgent.team;
    };

    plugin.isPortalTeamNull = function (portalStatus0) {
        const team = portalStatus0?.team;
        return !team;
    };

    plugin.selectValidStrategies = function(portalStatus, agentList, strategyLibrary) {
        const isNull = plugin.isPortalTeamNull(portalStatus);
        const isNullOrSame = plugin.isPortalTeamNullOrVRBBTeam(portalStatus, agentList);

        const vrbbAgent = agentList.find(a => a.useVrbb);
        const XTeam = vrbbAgent?.team;
        const YTeam = (XTeam === 'R') ? 'E' : 'R';
        const hasY = agentList.some(a => a.active && a.team === YTeam);

        return strategyLibrary.filter(strategy => {
            const cond = strategy.conditions || {};
            if ('isPortalTeamNullOrVRBBTeam' in cond && cond.isPortalTeamNullOrVRBBTeam !== isNullOrSame) {
                return false;
            }
            if ('isPortalTeamNull' in cond && cond.isPortalTeamNull !== isNull) {
                return false;
            }
            if ('isYTeamActive' in cond && cond.isYTeamActive !== hasY) {
                return false;
            }
            return true;
        });
    };

    plugin.phaseChange = function(previousStatus) {
        const validPhases = new Set(["Phase 1", "Phase 2", "Phase 3", "Phase 4"]);
        if (!validPhases.has(previousStatus.stage)) {
            return { ...previousStatus };
        }

        const prevTeam = previousStatus.team;
        if (prevTeam === 'E') {
            return {
                ...previousStatus,
                team: 'R',
                resonators: previousStatus.resonators.map(r => ({
                    ...r,
                    holder: r.resOwner
                }))
            };
        } else if (prevTeam === 'R') {
            return {
                ...previousStatus,
                team: 'E',
                resonators: previousStatus.resonators.map(r => ({
                    ...r,
                    holder: r.enlOwner
                }))
            };
        } else {
            return { ...previousStatus };
        }
    };

    plugin.applyVRBB = function(previousStatus, agentList) {
        const team = previousStatus.team;
        if (team !== 'R' && team !== 'E') {
            return { ...previousStatus };
        }

        const vrbbAgent = agentList.find(a => a.useVrbb);
        if (!vrbbAgent || !vrbbAgent.team) {
            return { ...previousStatus };
        }

        const vrbbName = vrbbAgent.name;
        const vrbbTeam = vrbbAgent.team;

        const newResonators = previousStatus.resonators.map(r => {
            if (!r.holder) return { ...r };

            if (vrbbTeam === 'R') {
                return {
                    ...r,
                    resOwner: vrbbName
                };
            } else if (vrbbTeam === 'E') {
                return {
                    ...r,
                    enlOwner: vrbbName
                };
            } else {
                return { ...r };
            }
        });

        return {
            ...previousStatus,
            resonators: newResonators
        };
    };

    plugin.tryDeploy = function(previousStatus, lastAction, agentList, doubleResoEvent) {
        const resSystemAgent = "__ADA__";
        const enlSystemAgent = "__JARVIS__";

        const vrbbAgent = agentList.find(a => a.useVrbb);
        if (!vrbbAgent || !vrbbAgent.team) {
            console.warn("VRBB agent not found or has no team");
            return { ...previousStatus };
        }

        const XTeam = vrbbAgent.team;
        const YTeam = (XTeam === 'R') ? 'E' : 'R';

        const currentTeam = previousStatus.team;

        const resonators = [...previousStatus.resonators]; // clone array
        const emptySlots = resonators
        .map((r, idx) => ({ ...r, idx }))
        .filter(r => !r.holder);

        function countByHolder(agentName) {
            return resonators.filter(r => r.holder === agentName).length;
        }

        function tryAssign(teamKey, systemAgent, setResOwner, setEnlOwner) {
            const agents = agentList.filter(a => a.active && a.team === teamKey);

            for (const agent of agents) {
                while (countByHolder(agent.name) < doubleResoEvent) {
                    const slot = emptySlots.shift();
                    if (!slot) return; // no available slots

                    resonators[slot.idx] = {
                        holder: agent.name,
                        resOwner: setResOwner ? agent.name : systemAgent,
                        enlOwner: setEnlOwner ? agent.name : systemAgent
                    };
                }
            }
        }

        if (lastAction === "XReso" || lastAction === "PseudoFlip") {
            if (currentTeam !== XTeam && currentTeam !== null) {
                console.warn("Invalid team for XReso / PseudoFlip");
                return { ...previousStatus };
            }

            const isXResTeam = (XTeam === 'R');
            const systemAgent = (YTeam === 'R') ? resSystemAgent : enlSystemAgent;

            tryAssign(XTeam, systemAgent, isXResTeam, !isXResTeam);
        }

        else if (lastAction === "YReso") {
            if (currentTeam !== YTeam && currentTeam !== null) {
                console.warn("Invalid team for YReso");
                return { ...previousStatus };
            }

            const isYResTeam = (YTeam === 'R');
            const systemAgent = (XTeam === 'R') ? resSystemAgent : enlSystemAgent;

            tryAssign(YTeam, systemAgent, isYResTeam, !isYResTeam);
        }

        return {
            ...previousStatus,
            team: lastAction === "YReso" ? YTeam : XTeam,
            resonators: resonators
        };
    };

    plugin.flipCard = function(previousStatus) {
        const resSystemAgent = "__ADA__";
        const enlSystemAgent = "__JARVIS__";

        const prevTeam = previousStatus.team;
        let newTeam = null;
        let newResonators = [...previousStatus.resonators];

        if (prevTeam === 'R') {
            newTeam = 'E';
            newResonators = newResonators.map(r =>
                                              r.holder
                                              ? {
                ...r,
                holder: enlSystemAgent,
                resOwner: resSystemAgent,
                enlOwner: enlSystemAgent
            }
                                              : { ...r }
                                             );
        } else if (prevTeam === 'E') {
            newTeam = 'R';
            newResonators = newResonators.map(r =>
                                              r.holder
                                              ? {
                ...r,
                holder: resSystemAgent,
                resOwner: resSystemAgent,
                enlOwner: enlSystemAgent
            }
                                              : { ...r }
                                             );
        } else {
            return { ...previousStatus };
        }

        return {
            ...previousStatus,
            team: newTeam,
            resonators: newResonators
        };
    };

    plugin.computeCurrentPortalStatus = function(previousStatus, lastAction, currentAction, stage, agentList, doubleResoEvent) {
        if (!lastAction) {
            return { ...previousStatus,
                    stage: stage,
                    action: currentAction
                   };
        }

        const vrbbAgent = agentList.find(a => a.useVrbb);
        const XTeam = vrbbAgent?.team;
        const YTeam = (XTeam === 'R') ? 'E' : 'R';

        const hasY = agentList.some(a => a.active && a.team === YTeam);

        switch (lastAction) {
            case "Wait":
            case "Done":
            case "NoReso":
                return {...plugin.phaseChange(previousStatus),
                        stage: stage,
                        action: currentAction
                       };

            case "VRBB":
                return {...plugin.applyVRBB(previousStatus, agentList),
                        stage: stage,
                        action: currentAction
                       };

            case "XReso":
            case "PseudoFlip":
                return {...plugin.tryDeploy(previousStatus, lastAction, agentList, doubleResoEvent),
                        stage: stage,
                        action: currentAction
                       };

            case "YReso": {
                if (hasY) {
                    return {
                        ...plugin.tryDeploy(previousStatus, lastAction, agentList, doubleResoEvent),
                        stage: stage,
                        action: currentAction
                    };
                } else {
                    return null;
                }
            }


            case "XFlip":
                return {...plugin.flipCard(previousStatus),
                        stage: stage,
                        action: currentAction
                       };

            case "YFlip": {
                if (hasY) {
                    return {
                        ...plugin.flipCard(previousStatus, lastAction, agentList, doubleResoEvent),
                        stage: stage,
                        action: currentAction
                    };
                } else {
                    console.warn("YFlip failed: no valid Y team agent found.");
                    return {
                        ...previousStatus,
                        stage: stage,
                        action: currentAction,
                        flipFailed: true
                    };
                }
            }

            default:
                console.warn("Unknown action type:", lastAction);
                return { ...previousStatus };
        }
    };

    plugin.stepStrategyExecution = function(statusHistory, agentList, strategy, pointer, doubleResoEvent) {
        if (pointer.done || !pointer.currentAction) return { pointer, statusHistory };

        const prev = statusHistory.at(-1);
        const currentStatus = plugin.computeCurrentPortalStatus(prev, pointer.lastAction, pointer.currentAction, strategy.stages[pointer.stageIndex].stage, agentList, doubleResoEvent);

        const newPointer = plugin.advanceStrategyPointer(pointer, strategy);

        if (currentStatus) {
            statusHistory.push({ ...currentStatus });
        } else {
            statusHistory.at(-1).action =pointer.currentAction;
        }

        return {
            pointer: newPointer,
            statusHistory
        };
    };

    plugin.evaluateAndDisplayStrategies = function(portalStatus0, agentList, doubleResoEvent, strategyLibrary) {
        const results = [];

        const validStrategies = plugin.selectValidStrategies(portalStatus0, agentList, strategyLibrary);

        for (const strategy of validStrategies) {
            let pointer = plugin.initializeStrategyPointer(strategy);
            const statusHistory = [{
                ...portalStatus0,
            }];

            while (!pointer.done) {
                const result = plugin.stepStrategyExecution(
                    statusHistory,
                    agentList,
                    strategy,
                    pointer,
                    doubleResoEvent
                );
                pointer = result.pointer;
            }

            const finalState = statusHistory.at(-1);
            const hasXFlip = statusHistory.some(s => s.action === "XFlip");
            const hasYFlip = statusHistory.some(s => s.action === "YFlip");
            const validResonatorCount = finalState.resonators.filter(r => r.holder).length;
            const finalTeam = finalState.team;

            results.push({
                strategyName: strategy.name,
                statusHistory,
                summary: {
                    validResonatorCount,
                    hasXFlip,
                    hasYFlip,
                    finalTeam
                }
            });
        }

        // Step 1: keep validResonatorCount maxmizer
        const maxValidCount = Math.max(...results.map(r => r.summary.validResonatorCount));
        let filtered = results.filter(r => r.summary.validResonatorCount === maxValidCount);

        // Step 2: prefer no flip card
        const EResults = filtered.filter(r => r.summary.finalTeam === 'E');
        const E_NoFlip = EResults.filter(r => !r.summary.hasXFlip && !r.summary.hasYFlip);
        if (E_NoFlip.length > 0) {
            filtered = filtered.filter(r => r.summary.finalTeam !== 'E' || (!r.summary.hasXFlip && !r.summary.hasYFlip));
        }

        const RResults = filtered.filter(r => r.summary.finalTeam === 'R');
        const R_NoFlip = RResults.filter(r => !r.summary.hasXFlip && !r.summary.hasYFlip);
        if (R_NoFlip.length > 0) {
            filtered = filtered.filter(r => r.summary.finalTeam !== 'R' || (!r.summary.hasXFlip && !r.summary.hasYFlip));
        }

        plugin.renderStrategyPanel(filtered, agentList);
    };

    // ========== Utility ==========
    plugin.getSelectedPortalResonators = function () {
        const guid = window.selectedPortal;
        if (!guid) return [];

        const portal = window.portals[guid];
        const portalTeam = portal?._details?.team;

        if (portalTeam !== 'R' && portalTeam !== 'E') return [];

        const resoArray = portal?.options?.data?.resonators;
        if (!Array.isArray(resoArray)) return [];

        return resoArray
            .map((r, i) => {
            if (!r || !r.owner || r.level !== 8) return null;
            return {
                owner: r.owner,
                team: portalTeam,
                slot: i
            };
        })
            .filter(r => r);
    };

    plugin.buildInitialAgentListFromResonators = function () {
        const resos = plugin.getSelectedPortalResonators();
        const draftAgentList = [];
        const seen = new Set();
        const systemAgents = new Set(["__JARVIS__", "__ADA__"]);

        plugin._resonatorDraft = Array(8).fill(null); // reset

        resos.forEach((r, idx) => {
            const owner = r.owner || 'Unknown';
            plugin._resonatorDraft[idx] = owner;

            if (!seen.has(owner)) {
                seen.add(owner);

                draftAgentList.push({
                    name: owner,
                    team: r.team || null,
                    active: !systemAgents.has(owner), // ❗ false for system agents
                    useVrbb: false
                });
            }
        });

        return draftAgentList;
    };

    // ========== UI ==========
    plugin.renderAgentListEditor = function (draftList) {
        const container = $('#vrbb-agent-table');
        container.empty();

        draftList.forEach((agent, idx) => {
            const row = $(`
      <div style="margin-bottom: 4px;">
        <button class="vrbb-agent-remove" data-idx="${idx}">✖</button>
        <input type="text" value="${agent.name}" placeholder="Agent name" style="width: 100px;" />
        <select style="width: 60px;">
          <option value="R" ${agent.team === 'R' ? 'selected' : ''}>RES</option>
          <option value="E" ${agent.team === 'E' ? 'selected' : ''}>ENL</option>
        </select>
        <label><input type="checkbox" ${agent.active ? 'checked' : ''}/> Active</label>
        <label><input type="checkbox" ${agent.useVrbb ? 'checked' : ''}/> VRBB</label>
      </div>
    `);

            container.append(row);
        });

        container.find('input[type="text"]').on('input', function () {
            const idx = $(this).parent().index();
            draftList[idx].name = $(this).val();
            plugin.renderResonatorDropdowns(draftList);
        });

        container.find('select').on('change', function () {
            const idx = $(this).parent().index();
            draftList[idx].team = $(this).val();
            plugin.renderResonatorDropdowns(draftList);
        });

        container.find('input[type="checkbox"]').on('change', function () {
            const row = $(this).closest('div');
            const idx = row.index();
            const checkboxes = row.find('input[type="checkbox"]');
            draftList[idx].active = checkboxes.eq(0).is(':checked');
            draftList[idx].useVrbb = checkboxes.eq(1).is(':checked');
            plugin.renderResonatorDropdowns(draftList);
        });

        container.find('.vrbb-agent-remove').on('click', function () {
            const idx = parseInt($(this).attr('data-idx'));
            draftList.splice(idx, 1);
            plugin.renderAgentListEditor(draftList);
            plugin.renderResonatorDropdowns(draftList);
        });
    };

    plugin.renderResonatorDropdowns = function (draftList) {
        const container = $('#vrbb-reso-table');
        container.empty();

        const currentFactions = new Set();
        plugin._resonatorDraft.forEach(name => {
            if (!name) return;
            const team = draftList.find(a => a.name === name)?.team;
            if (team) currentFactions.add(team);
        });

        for (let row = 0; row < 4; row++) {
            const rowDiv = $('<div style="display: flex; gap: 10px; margin-bottom: 6px;"></div>');

            for (let col = 0; col < 2; col++) {
                const i = row * 2 + col;
                let current = plugin._resonatorDraft[i];

                // if current no longer in draft list, remove reference
                if (current && !draftList.find(a => a.name === current)) {
                    current = null;
                    plugin._resonatorDraft[i] = null;
                }

                const agent = draftList.find(a => a.name === current);
                const team = agent?.team;
                let color = '#444';

                if (team === 'R') color = '#007bff';
                else if (team === 'E') color = '#28a745';

                const slotLabel = $(`<div style="width: 50px; color: ${color};">Slot ${i+1}</div>`);

                const select = $(`<select data-slot="${i}" style="flex: 1;"></select>`);

                select.append(`<option value="">(empty)</option>`);

                draftList.forEach(agent => {
                    const label = `${agent.name} [${agent.team}]`;
                    const selected = agent.name === current ? 'selected' : '';

                    const isDisabled =
                          currentFactions.size > 0 && !currentFactions.has(agent.team);

                    select.append(`<option value="${agent.name}" ${selected} ${isDisabled ? 'disabled' : ''}>${label}</option>`);
                });

                select.on('change', function () {
                    const idx = parseInt($(this).attr('data-slot'), 10);
                    const val = $(this).val();
                    plugin._resonatorDraft[idx] = val || null;
                    plugin.renderResonatorDropdowns(draftList); // trigger re-render to lock opposing faction
                });

                const group = $('<div style="display: flex; width: 50%; align-items: center;"></div>');
                group.append(slotLabel).append(select);
                rowDiv.append(group);
            }

            container.append(rowDiv);
        }
    };

    plugin.createUIPanel = function () {
        if ($('#vrbb-helper-panel').length > 0) return;

        plugin._resonatorDraft = Array(8).fill(null);
        plugin.draftAgentList = plugin.buildInitialAgentListFromResonators();

        const panel = $(`
    <div id="vrbb-helper-panel" style="
      position: absolute;
      top: 80px;
      right: 20px;
      width: 400px;
      background: #ffffffee;
      border: 1px solid #888;
      padding: 10px;
      font-size: 13px;
      z-index: 9999;
      border-radius: 6px;
      box-shadow: 0 0 5px rgba(0,0,0,0.2);
    ">
      <div style="text-align: right;">
        <button id="vrbb-helper-close" style="border: none; background: none; font-size: 16px; cursor: pointer;">✖</button>
      </div>
      <div id="vrbb-helper-content">
        <b>VRBB Resonator Planner</b>

        <div id="vrbb-resonator-panel" style="margin-top:10px;">
          <b>Resonator Ownership</b>
          <div id="vrbb-reso-table"></div>
        </div>

        <div style="margin-top:10px;">
          <label><input type="checkbox" id="vrbb-double-reso" /> Double Resonator Bonus Active</label>
        </div>

        <div id="vrbb-agent-list" style="margin-top:10px;">
          <b>Agent List</b>
          <div id="vrbb-agent-table"></div>
          <button id="vrbb-add-agent" style="margin-top:5px;">Add Agent</button>
        </div>

        <div style="margin-top:10px; text-align:right;">
          <button id="vrbb-confirm-init">Confirm Initialization</button>
        </div>
      </div>
    </div>
  `);

        $('body').append(panel);
        $('#vrbb-helper-panel').draggable();

        $('#vrbb-helper-close').on('click', () => {
            $('#vrbb-helper-panel').remove();
        });

        $('#vrbb-add-agent').off('click').on('click', () => {
            plugin.draftAgentList.push({ name: '', team: 'R', active: true, useVrbb: false });
            plugin.renderAgentListEditor(plugin.draftAgentList);
            plugin.renderResonatorDropdowns(plugin.draftAgentList);
        });

        $('#vrbb-double-reso').prop('checked', plugin.doubleResoEvent);

        $('#vrbb-confirm-init').off('click').on('click', () => {
            const agentList = plugin.draftAgentList;
            const doubleResoEvent = $('#vrbb-double-reso').is(':checked') ? 2 : 1;

            const vrbbAgents = agentList.filter(a => a.useVrbb && a.active);
            const activeAgents = agentList.filter(a => a.active);

            if (vrbbAgents.length !== 1) {
                alert("You must designate exactly ONE active VRBB agent.");
                return;
            }

            if (activeAgents.length === 0) {
                alert("At least one active agent is required.");
                return;
            }

            const systemAgents = ["__ADA__", "__JARVIS__"];
            for (const a of agentList) {
                if (systemAgents.includes(a.name) && (a.active || a.useVrbb)) {
                    alert(`System agent ${a.name} cannot be active or use VRBB.`);
                    return;
                }
            }

            const resonators = plugin._resonatorDraft.map(name => {
                const team = agentList.find(a => a.name === name)?.team;

                if (team === 'R') {
                    return { resOwner: name, enlOwner: '__JARVIS__', holder: name };
                } else if (team === 'E') {
                    return { resOwner: '__ADA__', enlOwner: name, holder: name };
                } else {
                    return { resOwner: null, enlOwner: null, holder: null };
                }
            });

            const holderTeams = new Set();

            plugin._resonatorDraft.forEach(name => {
                if (!name) return;
                const team = agentList.find(a => a.name === name)?.team;
                if (team) holderTeams.add(team);
            });

            if (holderTeams.size > 1) {
                alert("All resonator holders must belong to the same team.");
                return;
            }

            const portalStatus0 = {
                stage: "initial",
                action: null,
                team: plugin._resonatorDraft
                .map(name => agentList.find(a => a.name === name)?.team)
                .find(t => t === 'R' || t === 'E') || null,
                resonators: resonators
            };

            $('#vrbb-helper-panel').remove();

            plugin.evaluateAndDisplayStrategies(portalStatus0, agentList, doubleResoEvent, plugin.strategyLibrary);
        });

        // initial render
        plugin.renderAgentListEditor(plugin.draftAgentList);
        plugin.renderResonatorDropdowns(plugin.draftAgentList);
    };

    plugin.renderStrategyPanel = function(filtered, agentList) {
        const vrbbAgent = agentList.find(a => a.useVrbb);
        const vrbbName = vrbbAgent.name;
        const vrbbTeam = vrbbAgent.team;

        $('#vrbb-strategy-panel').remove();
        $('body').append(`
        <div id="vrbb-strategy-panel" style="
          position: absolute;
          top: 80px;
          right: 20px;
          width: 400px;
          background: #ffffffee;
          border: 1px solid #888;
          padding: 10px;
          font-size: 13px;
          z-index: 9999;
          border-radius: 6px;
          box-shadow: 0 0 5px rgba(0,0,0,0.2);
          ">
          <div style="text-align: right;">
            <button id="vrbb-strategy-close" style="border: none; background: none; font-size: 16px; cursor: pointer;">✖</button>
          </div>
          <div id="vrbb-strategy-summary-list">
            <b>Valid Strategy List</b>
          </div>
          <hr/>
          <div id="vrbb-strategy-details">
            <b>Strategy Details</b>
          </div>
        </div>`);
        $('#vrbb-strategy-panel').draggable();

        if (!document.getElementById('vrbb-strategy-style')) {
            $('head').append(`
        <style id="vrbb-strategy-style">
            #vrbb-strategy-summary-list button {
                display: block;
                width: 100%;
                text-align: left;
                margin: 2px 0;
                padding: 4px 6px;
                border: 1px solid transparent;
                background-color: #f8f8f8;
                transition: background 0.2s, border 0.2s;
            }

            #vrbb-strategy-summary-list button.vrbb-strategy-selected {
                background-color: #ffedcc !important;
                border-color: #cc8800 !important;
            }
        </style>
    `);
        }


        const summaryList = $('#vrbb-strategy-summary-list');
        summaryList.empty();

        filtered.forEach((result, idx) => {
            const summary = result.summary;
            const label = `Strategy ${idx+1} | Final Team: ${summary.finalTeam} | Final L8 Reso: ${summary.validResonatorCount} | Flip Card: ${summary.hasXFlip || summary.hasYFlip ? 'Yes' : 'No'}`;

            const btn = $(`<button data-idx="${idx}" style="display:block; margin-bottom:5px;">${label}</button>`);
            summaryList.append(btn);
        });

        $('#vrbb-strategy-close').on('click', () => {
            $('#vrbb-strategy-panel').remove();
        });

        $('#vrbb-strategy-summary-list button').on('click', function () {
            const idx = parseInt($(this).data('idx'));

            $('#vrbb-strategy-summary-list button').removeClass('vrbb-strategy-selected');

            $(this).addClass('vrbb-strategy-selected');

            plugin.renderStrategyDetails(idx, filtered[idx], vrbbName, vrbbTeam);
        });

        if (filtered.length > 0) {
            $('#vrbb-strategy-summary-list button').first().trigger('click');
        }

    };

    plugin.renderStrategyDetails = function(idxStrategy, result, vrbbName, vrbbTeam) {
        const container = $('#vrbb-strategy-details');
        container.empty();

        const statusHistory = result.statusHistory;
        if (!statusHistory || statusHistory.length === 0) {
            container.append('<div>No status history available.</div>');
            return;
        }

        let idx = 0;

        function render() {
            const state = statusHistory[idx];
            container.empty();

            // Header with phase + action
            container.append(`
            <div style="margin-bottom: 8px;">
                <b>Strategy:</b> ${idxStrategy+1} &nbsp;
                <b>Stage:</b> ${state.stage}
            </div>
        `);

            // Slot grid (2x4)
            const grid = $('<div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px;"></div>');
            for (let i = 0; i < 8; i++) {
                const r = state.resonators[i];
                let name = r.holder || '-';

                let agentColor = '#444'; // Grey

                if (name === vrbbName) {
                    name = name + '*'
                }

                if ( !(name === '-')) {
                    const isR = state.team === 'R';
                    const isE = state.team === 'E';

                    if (isR) agentColor = '#007bff';
                    else if (isE) agentColor = '#28a745';
                }

                const slot = $(`
                <div style="
                    width: 45%;
                    padding: 4px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    background: #f8f8f8;
                    color: ${agentColor};
                ">
                    <b>Slot ${i+1}</b>: ${name}
                </div>
            `);
                grid.append(slot);
            }

            container.append(grid);

            // Action hint
            container.append(`<div style="margin-top:6px;"> ⚠️ Confirm L8 resonator numbers as above before next action. </div>`);
            container.append(`<div style="margin-top:6px;"> <b>Next action </b>: ${plugin.describeAction(state.action, vrbbName, vrbbTeam)}</div>`);

            // Navigation buttons
            const nav = $(`
            <div style="margin-top: 10px;">
                <button id="vrbb-prev-status" ${idx === 0 ? 'disabled' : ''}>&lt;=</button>
                <span style="margin: 0 10px;">${idx + 1} / ${statusHistory.length}</span>
                <button id="vrbb-next-status" ${idx === statusHistory.length - 1 ? 'disabled' : ''}>=&gt;</button>
            </div>
        `);
            container.append(nav);

            // bind
            $('#vrbb-prev-status').off('click').on('click', () => {
                if (idx > 0) {
                    idx -= 1;
                    render();
                }
            });
            $('#vrbb-next-status').off('click').on('click', () => {
                if (idx < statusHistory.length - 1) {
                    idx += 1;
                    render();
                }
            });
        }

        render();
    };

    plugin.describeAction = function(action, vrbbName, vrbbTeam) {
        switch (action) {
            case "Wait": return "Wait for next phase.";
            case "VRBB": return `${vrbbName} deploys VRBB.`;
            case "XReso": return `Team ${vrbbTeam} tries to deploy resonators.`;
            case "YReso": return `Team ${vrbbTeam === 'R' ? 'E' : 'R'} tries to deploy resonators.`;
            case "XFlip": return `Team ${vrbbTeam} uses a flip card.`;
            case "YFlip": return `Team ${vrbbTeam === 'R' ? 'E' : 'R'} uses a flip card.`;
            case "PseudoFlip": return `Pseudo flip gives some resonators to ${vrbbName}. Team ${vrbbTeam} tries to deploy.`;
            case "NoReso": return `DO NOT DEPLOY RESONATORS`;
            case "Done": return `No further actions.`;
            default: return `${action}`;
        }
    };

    // ========== Button Injection ==========
    plugin.injectButton = function () {
        if ($('#vrbb-helper-btn').length > 0) return;

        $('#toolbox').append(
            `<a id="vrbb-helper-btn" onclick="window.plugin.vrbbL8Maximizer.onButtonClick()" title="VRBB L8 Planner">VRBB-Plan</a>`
    );
    };

    plugin.onButtonClick = function () {
        const updatestatus = document.getElementById('updatestatus');
        if (updatestatus && getComputedStyle(updatestatus).display === 'none') {
            const observer = new MutationObserver(() => {
                if (getComputedStyle(updatestatus).display === 'block') {
                    observer.disconnect();
                    plugin.createUIPanel();
                }
            });
            observer.observe(updatestatus, { attributes: true, attributeFilter: ['style'] });
        } else {
            plugin.createUIPanel();
        }
    };

    // ========== Setup ==========
    plugin.setup = function () {
        plugin.injectButton();
    };

    // ========== Register ==========
    const setup = plugin.setup;
    setup.info = plugin_info;
    if (!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    if (window.iitcLoaded) setup();
}

const script = document.createElement('script');
const info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
    info.script = {
        version: GM_info.script.version,
        name: GM_info.script.name,
        description: GM_info.script.description
    };
}
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement).appendChild(script);
