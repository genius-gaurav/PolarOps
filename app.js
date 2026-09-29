/* ============================================================
   POLAROPS | COMPLETE FRONTEND SCRIPT
   ============================================================ */


/* ============================================================
   PAGE ELEMENT
   ============================================================ */

const pageContent =
    document.getElementById("page-content");


/* ============================================================
   OPERATIONAL DATA
   ============================================================ */

const operationalData = {

    assets: [
        {
            id: "GEN-07",
            name: "Diesel Generator 07",
            category: "Power",
            location: "Maitri",
            status: "WARNING",
            requiredSpare: "Fuel Pump"
        },

        {
            id: "GEN-03",
            name: "Diesel Generator 03",
            category: "Power",
            location: "Bharati",
            status: "OPERATIONAL",
            requiredSpare: "Oil Filter"
        },

        {
            id: "VEH-12",
            name: "Snow Vehicle 12",
            category: "Transport",
            location: "Field Camp 02",
            status: "OPERATIONAL",
            requiredSpare: "Hydraulic Belt"
        },

        {
            id: "SCI-04",
            name: "Atmospheric Sensor",
            category: "Scientific",
            location: "Research Site 04",
            status: "OPERATIONAL",
            requiredSpare: "Sensor Module"
        }
    ],


    inventory: [
        {
            name: "Fuel Pump",
            available: 2,
            reserved: 0,
            reorderLevel: 5,
            location: "Maitri"
        },

        {
            name: "Oil Filter",
            available: 23,
            reserved: 5,
            reorderLevel: 10,
            location: "Maitri"
        },

        {
            name: "Hydraulic Belt",
            available: 3,
            reserved: 2,
            reorderLevel: 6,
            location: "Maitri"
        },

        {
            name: "Sensor Module",
            available: 4,
            reserved: 0,
            reorderLevel: 2,
            location: "Research Site 04"
        }
    ],


    personnel: [
        {
            id: "TEAM-01",
            name: "Field Team A",
            count: 6,
            location: "Field Camp 02",
            status: "AVAILABLE"
        },

        {
            id: "TEAM-02",
            name: "Research Team B",
            count: 4,
            location: "Maitri Station",
            status: "SAFE"
        },

        {
            id: "TEAM-03",
            name: "Logistics Team",
            count: 8,
            location: "Cargo Zone",
            status: "MOVING"
        },

        {
            id: "TEAM-04",
            name: "Field Team C",
            count: 5,
            location: "Research Site 04",
            status: "CHECK-IN DUE"
        }
    ],


    cargo: [
        {
            id: "CARGO-104",
            name: "Generator Spare Parts",
            origin: "Goa",
            destination: "Maitri",
            status: "IN TRANSIT",
            priority: "High"
        },

        {
            id: "CARGO-105",
            name: "Medical Supplies",
            origin: "Delhi",
            destination: "Bharati",
            status: "RECEIVED",
            priority: "Critical"
        },

        {
            id: "CARGO-106",
            name: "Scientific Equipment",
            origin: "Bengaluru",
            destination: "Maitri",
            status: "PREPARED",
            priority: "Normal"
        },

        {
            id: "CARGO-107",
            name: "Fuel Filters",
            origin: "Goa",
            destination: "Maitri",
            status: "AT RISK",
            priority: "Critical"
        }
    ]

};


/* ============================================================
   GLOBAL STATE
   ============================================================ */

let activityLog = [];

let currentCargoFilter = "ALL";

let currentCargoSearch = "";


/* ============================================================
   HELPERS
   ============================================================ */

function getStatusClass(status) {

    return String(status || "")
        .toLowerCase()
        .replace(/\s+/g, "-");

}


function kpiCard(
    label,
    value,
    description,
    icon,
    state = ""
) {

    return `

        <div class="kpi-card ${state}">

            <div class="kpi-card-icon">
                ${icon}
            </div>

            <div class="kpi-card-label">
                ${label}
            </div>

            <div class="kpi-card-value">
                ${value}
            </div>

            <div class="kpi-card-description">
                ${description}
            </div>

        </div>

    `;

}


function renderPageHeader(
    title,
    subtitle
) {

    return `

        <div class="page-header">

            <div>

                <h1>
                    ${title}
                </h1>

                <p>
                    ${subtitle}
                </p>

            </div>

        </div>

    `;

}


/* ============================================================
   DATA HELPERS
   ============================================================ */

function getAssetCount() {

    return operationalData.assets.length;

}


function getOperationalAssets() {

    return operationalData.assets.filter(
        asset =>
            asset.status === "OPERATIONAL"
    );

}


function getWarningAssets() {

    return operationalData.assets.filter(
        asset =>
            asset.status === "WARNING"
    );

}


function getCriticalAssets() {

    return operationalData.assets.filter(
        asset =>
            asset.status === "CRITICAL"
    );

}


function getLowStockItems() {

    return operationalData.inventory.filter(
        item =>
            item.available <= item.reorderLevel
    );

}


function getPersonnelCount() {

    return operationalData.personnel.reduce(
        (total, team) =>
            total + team.count,
        0
    );

}


function getTeamsNeedingAttention() {

    return operationalData.personnel.filter(
        team =>
            team.status === "CHECK-IN DUE"
    );

}


function getCargoCount() {

    return operationalData.cargo.length;

}


function getCargoByStatus(status) {

    return operationalData.cargo.filter(
        cargo =>
            cargo.status === status
    );

}


/* ============================================================
   MISSION READINESS
   ============================================================ */

function calculateMissionReadiness() {

    let score = 100;


    score -=
        getWarningAssets().length * 8;


    score -=
        getCriticalAssets().length * 20;


    score -=
        getLowStockItems().length * 5;


    score -=
        getTeamsNeedingAttention().length * 10;


    score -=
        getCargoByStatus("AT RISK").length * 7;


    return Math.max(
        0,
        Math.min(100, score)
    );

}


function getReadinessStatus(score) {

    if (score >= 80) {

        return "MISSION READY";

    }

    if (score >= 60) {

        return "MONITOR";

    }

    return "HIGH RISK";

}


/* ============================================================
   ACTIVITY LOG
   ============================================================ */

function addActivity(
    type,
    message,
    priority = "INFO"
) {

    activityLog.unshift({

        time:
            new Date().toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            ),

        type,

        message,

        priority

    });


    if (activityLog.length > 30) {

        activityLog =
            activityLog.slice(0, 30);

    }

}


function initializeActivityLog() {

    if (activityLog.length > 0) {

        return;

    }


    addActivity(
        "SYSTEM",
        "PolarOps mission monitoring initialized.",
        "INFO"
    );


    addActivity(
        "TELEMETRY",
        "Antarctic station telemetry link established.",
        "INFO"
    );


    addActivity(
        "AUTOMATION",
        "Mission monitoring cycle completed.",
        "ACTION"
    );


    addActivity(
        "PERSONNEL",
        "TEAM-04 check-in monitoring active.",
        "CRITICAL"
    );

}


/* ============================================================
   OVERVIEW
   ============================================================ */

function showOverview() {

    const readiness =
        calculateMissionReadiness();


    const warningAssets =
        getWarningAssets().length;


    const criticalAssets =
        getCriticalAssets().length;


    const lowStock =
        getLowStockItems().length;


    const personnelAlerts =
        getTeamsNeedingAttention().length;


    const cargoRisk =
        getCargoByStatus("AT RISK").length;


    const recentEvents =
        activityLog.slice(0, 6);


    const totalAssets =
        operationalData.assets.length;


    const operationalAssets =
        getOperationalAssets().length;


    const assetHealth =
        totalAssets
            ? Math.round(
                operationalAssets /
                totalAssets *
                100
            )
            : 0;


    const inventoryHealth =
        operationalData.inventory.length
            ? Math.round(
                operationalData.inventory.filter(
                    item =>
                        item.available >
                        item.reorderLevel
                ).length /
                operationalData.inventory.length *
                100
            )
            : 0;


    const personnelHealth =
        operationalData.personnel.length
            ? Math.round(
                operationalData.personnel.filter(
                    team =>
                        team.status !==
                        "CHECK-IN DUE"
                ).length /
                operationalData.personnel.length *
                100
            )
            : 0;


    pageContent.innerHTML = `

        ${renderPageHeader(
            "Mission Command Center",
            "Antarctic expedition operations and intelligent decision support."
        )}


        <div class="kpi-grid">

            ${kpiCard(
                "MISSION READINESS",
                readiness + "%",
                getReadinessStatus(readiness),
                "◉",
                readiness >= 80
                    ? "healthy"
                    : readiness >= 60
                        ? "warning"
                        : "critical"
            )}


            ${kpiCard(
                "ASSETS",
                totalAssets,
                `${warningAssets} warning`,
                "◈"
            )}


            ${kpiCard(
                "LOW STOCK",
                lowStock,
                "inventory items",
                "▤",
                lowStock
                    ? "warning"
                    : "healthy"
            )}


            ${kpiCard(
                "ACTIVE RISKS",
                criticalAssets +
                personnelAlerts +
                cargoRisk,
                "conditions requiring attention",
                "!",
                criticalAssets +
                personnelAlerts +
                cargoRisk
                    ? "critical"
                    : "healthy"
            )}

        </div>


        <div class="panel">

            <div class="panel-heading">

                <div>

                    <h2>
                        Mission Readiness
                    </h2>

                    <p class="table-subtitle">
                        Current operational condition across the expedition.
                    </p>

                </div>

                <span class="panel-meta">
                    LIVE
                </span>

            </div>


            <div class="readiness-panel">

                <div class="readiness-score">

                    <div class="readiness-circle">

                        <strong>
                            ${readiness}%
                        </strong>

                        <span>
                            READINESS
                        </span>

                    </div>


                    <div class="readiness-info">

                        <strong>
                            ${getReadinessStatus(readiness)}
                        </strong>

                        <p>
                            PolarOps continuously evaluates
                            asset health, inventory availability,
                            personnel safety and cargo conditions.
                        </p>

                    </div>

                </div>

            </div>

        </div>


        <div class="dashboard-grid">


            <!-- MISSION HEALTH -->

            <div class="panel">

                <div class="panel-heading">

                    <div>

                        <h2>
                            Mission Health
                        </h2>

                        <p class="table-subtitle">
                            Live subsystem condition.
                        </p>

                    </div>

                </div>


                <div class="command-health">


                    <div class="health-row">

                        <div class="health-row-header">

                            <span>
                                ASSETS
                            </span>

                            <strong>
                                ${assetHealth}%
                            </strong>

                        </div>

                        <div class="health-bar">

                            <div
                                class="health-fill"
                                style="width:${assetHealth}%"
                            ></div>

                        </div>

                    </div>


                    <div class="health-row">

                        <div class="health-row-header">

                            <span>
                                INVENTORY
                            </span>

                            <strong>
                                ${inventoryHealth}%
                            </strong>

                        </div>

                        <div class="health-bar">

                            <div
                                class="health-fill"
                                style="width:${inventoryHealth}%"
                            ></div>

                        </div>

                    </div>


                    <div class="health-row">

                        <div class="health-row-header">

                            <span>
                                PERSONNEL
                            </span>

                            <strong>
                                ${personnelHealth}%
                            </strong>

                        </div>

                        <div class="health-bar">

                            <div
                                class="health-fill"
                                style="width:${personnelHealth}%"
                            ></div>

                        </div>

                    </div>


                    <div class="health-row">

                        <div class="health-row-header">

                            <span>
                                MISSION READINESS
                            </span>

                            <strong>
                                ${readiness}%
                            </strong>

                        </div>

                        <div class="health-bar">

                            <div
                                class="health-fill readiness"
                                style="width:${readiness}%"
                            ></div>

                        </div>

                    </div>

                </div>

            </div>


            <!-- LIVE OPERATIONS -->

            <div class="panel live-feed-panel">

                <div class="panel-heading">

                    <div>

                        <h2>
                            Live Operations
                        </h2>

                        <p class="table-subtitle">
                            Latest mission events.
                        </p>

                    </div>

                    <div class="live-feed-status">

                        <span class="status-dot"></span>

                        LIVE

                    </div>

                </div>


                <div class="live-feed">

                    ${
                        recentEvents.length

                        ?

                        recentEvents.map(
                            event => `

                            <div class="
                                live-event
                                ${event.priority.toLowerCase()}
                            ">

                                <div class="live-event-time">

                                    ${event.time}

                                </div>


                                <div class="live-event-icon">

                                    ${
                                        event.priority ===
                                        "CRITICAL"
                                            ? "!"
                                            :
                                        event.priority ===
                                        "ACTION"
                                            ? "⚡"
                                            : "◉"
                                    }

                                </div>


                                <div class="live-event-content">

                                    <strong>
                                        ${event.type}
                                    </strong>

                                    <p>
                                        ${event.message}
                                    </p>

                                </div>


                                <div class="
                                    live-event-status
                                    ${event.priority.toLowerCase()}
                                ">

                                    ${event.priority}

                                </div>

                            </div>

                            `
                        ).join("")

                        :

                        `
                        <div class="empty-state">
                            <strong>
                                No recent events
                            </strong>
                        </div>
                        `
                    }

                </div>

            </div>

        </div>


        <div class="panel">

            <div class="panel-heading">

                <div>

                    <h2>
                        Mission Signals
                    </h2>

                    <p class="table-subtitle">
                        Current operational alerts.
                    </p>

                </div>

            </div>


            <div class="alert-list">


                <div class="alert-row">

                    <div class="alert-icon">
                        !
                    </div>

                    <div>

                        <strong>
                            GEN-07
                        </strong>

                        <p>
                            Generator requires maintenance attention.
                        </p>

                    </div>

                    <span class="status-badge warning">
                        WARNING
                    </span>

                </div>


                <div class="alert-row">

                    <div class="alert-icon">
                        !
                    </div>

                    <div>

                        <strong>
                            TEAM-04
                        </strong>

                        <p>
                            Personnel check-in is due.
                        </p>

                    </div>

                    <span class="status-badge critical">
                        CHECK-IN
                    </span>

                </div>


                <div class="alert-row">

                    <div class="alert-icon">
                        !
                    </div>

                    <div>

                        <strong>
                            INVENTORY
                        </strong>

                        <p>
                            ${lowStock} spare items require monitoring.
                        </p>

                    </div>

                    <span class="status-badge warning">
                        LOW STOCK
                    </span>

                </div>


            </div>

        </div>

    `;

}


/* ============================================================
   EXPEDITION
   ============================================================ */

function showExpedition() {

    pageContent.innerHTML = `

        ${renderPageHeader(
            "Expedition Command Center",
            "Monitor stations, field teams and expedition movement."
        )}


        <div class="panel">

            <div class="panel-heading">

                <div>

                    <h2>
                        Antarctic Expedition Map
                    </h2>

                    <p class="table-subtitle">
                        Simulated mission operating area.
                    </p>

                </div>

                <span class="panel-meta">
                    LIVE
                </span>

            </div>


            <div class="expedition-map">

                <div
                    class="map-station"
                    style="left:18%;top:30%;"
                >

                    <strong>
                        MAITRI
                    </strong>

                    <span>
                        PRIMARY STATION
                    </span>

                </div>


                <div
                    class="map-station"
                    style="left:62%;top:22%;"
                >

                    <strong>
                        BHARATI
                    </strong>

                    <span>
                        RESEARCH STATION
                    </span>

                </div>


                <div
                    class="map-station"
                    style="left:38%;top:67%;"
                >

                    <strong>
                        FIELD CAMP 02
                    </strong>

                    <span>
                        FIELD OPERATIONS
                    </span>

                </div>


                <div
                    class="map-station"
                    style="left:72%;top:65%;"
                >

                    <strong>
                        RESEARCH SITE 04
                    </strong>

                    <span>
                        SCIENCE OPERATIONS
                    </span>

                </div>


                <div class="map-legend">

                    <span>
                        <span class="status-dot"></span>
                        Active
                    </span>

                    <span>
                        ● Station
                    </span>

                </div>

            </div>

        </div>


        <div class="dashboard-grid">


            <!-- STATION STATUS -->

            <div class="panel">

                <div class="panel-heading">

                    <div>

                        <h2>
                            Station Status
                        </h2>

                        <p class="table-subtitle">
                            Current station condition.
                        </p>

                    </div>

                </div>


                <div class="station-status-row">

                    <span class="status-dot"></span>

                    <div>

                        <strong>
                            Maitri Station
                        </strong>

                        <p>
                            Primary expedition station
                        </p>

                    </div>

                    <span class="status-badge operational">
                        ONLINE
                    </span>

                </div>


                <div class="station-status-row">

                    <span class="status-dot"></span>

                    <div>

                        <strong>
                            Bharati Station
                        </strong>

                        <p>
                            Research operations
                        </p>

                    </div>

                    <span class="status-badge operational">
                        ONLINE
                    </span>

                </div>


                <div class="station-status-row">

                    <span class="status-dot"></span>

                    <div>

                        <strong>
                            Field Camp 02
                        </strong>

                        <p>
                            Field deployment
                        </p>

                    </div>

                    <span class="status-badge warning">
                        MONITORED
                    </span>

                </div>


                <div class="station-status-row">

                    <span class="status-dot"></span>

                    <div>

                        <strong>
                            Research Site 04
                        </strong>

                        <p>
                            Scientific monitoring
                        </p>

                    </div>

                    <span class="status-badge warning">
                        CHECK
                    </span>

                </div>

            </div>


            <!-- FIELD TEAMS -->

            <div class="panel">

                <div class="panel-heading">

                    <div>

                        <h2>
                            Field Team Activity
                        </h2>

                        <p class="table-subtitle">
                            Personnel movement and safety state.
                        </p>

                    </div>

                </div>


                ${operationalData.personnel.map(
                    team => `

                    <div class="team-activity-row">

                        <div>

                            <strong>
                                ${team.name}
                            </strong>

                            <p>
                                ${team.count} personnel · ${team.location}
                            </p>

                        </div>

                        <span class="
                            status-badge
                            ${getStatusClass(team.status)}
                        ">
                            ${team.status}
                        </span>

                    </div>

                    `
                ).join("")}

            </div>

        </div>

    `;

}


/* ============================================================
   CARGO
   ============================================================ */

function showCargo() {

    const filtered =
        operationalData.cargo.filter(
            cargo => {

                const matchesFilter =
                    currentCargoFilter === "ALL" ||
                    cargo.status === currentCargoFilter;


                const search =
                    currentCargoSearch.toLowerCase();


                const matchesSearch =
                    cargo.id.toLowerCase().includes(search) ||
                    cargo.name.toLowerCase().includes(search) ||
                    cargo.origin.toLowerCase().includes(search) ||
                    cargo.destination.toLowerCase().includes(search);


                return matchesFilter &&
                       matchesSearch;

            }
        );


    pageContent.innerHTML = `

        ${renderPageHeader(
            "Cargo Intelligence",
            "Track cargo movement, priority and logistics risk."
        )}


        <div class="kpi-grid">

            ${kpiCard(
                "TOTAL CARGO",
                operationalData.cargo.length,
                "active shipments",
                "▣"
            )}

            ${kpiCard(
                "IN TRANSIT",
                getCargoByStatus("IN TRANSIT").length,
                "moving shipments",
                "→"
            )}

            ${kpiCard(
                "RECEIVED",
                getCargoByStatus("RECEIVED").length,
                "arrived shipments",
                "✓",
                "healthy"
            )}

            ${kpiCard(
                "AT RISK",
                getCargoByStatus("AT RISK").length,
                "require attention",
                "!",
                "critical"
            )}

        </div>


        <div class="panel">

            <div class="cargo-toolbar">

                <input
                    class="cargo-search"
                    id="cargo-search"
                    placeholder="Search cargo..."
                    value="${currentCargoSearch}"
                />


                <button
                    class="filter-button ${currentCargoFilter === "ALL" ? "active" : ""}"
                    data-filter="ALL"
                >
                    ALL
                </button>


                <button
                    class="filter-button ${currentCargoFilter === "IN TRANSIT" ? "active" : ""}"
                    data-filter="IN TRANSIT"
                >
                    IN TRANSIT
                </button>


                <button
                    class="filter-button ${currentCargoFilter === "RECEIVED" ? "active" : ""}"
                    data-filter="RECEIVED"
                >
                    RECEIVED
                </button>


                <button
                    class="filter-button ${currentCargoFilter === "AT RISK" ? "active" : ""}"
                    data-filter="AT RISK"
                >
                    AT RISK
                </button>

            </div>


            ${
                filtered.length

                ?

                filtered.map(
                    cargo => `

                    <div
                        class="cargo-row"
                        onclick="inspectCargo('${cargo.id}')"
                    >

                        <div class="cargo-id">
                            ${cargo.id}
                        </div>


                        <div class="cargo-name">

                            <strong>
                                ${cargo.name}
                            </strong>

                            <p>
                                ${cargo.origin} →
                                ${cargo.destination}
                            </p>

                        </div>


                        <div class="cargo-route">

                            ${cargo.destination}

                        </div>


                        <span class="
                            status-badge
                            ${getStatusClass(cargo.status)}
                        ">

                            ${cargo.status}

                        </span>


                        <div class="cargo-priority">

                            ${cargo.priority}

                        </div>

                    </div>

                    `
                ).join("")

                :

                `
                <div class="empty-state">

                    <strong>
                        No cargo found
                    </strong>

                    <p>
                        Try another filter or search.
                    </p>

                </div>
                `
            }

        </div>

    `;


    const search =
        document.getElementById(
            "cargo-search"
        );


    if (search) {

        search.addEventListener(
            "input",
            function () {

                currentCargoSearch =
                    this.value;

                showCargo();

            }
        );

    }


    document
        .querySelectorAll(
            ".filter-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        currentCargoFilter =
                            this.dataset.filter;

                        showCargo();

                    }
                );

            }
        );

}


/* ============================================================
   CARGO DETAILS
   ============================================================ */

function inspectCargo(cargoId) {

    const cargo =
        operationalData.cargo.find(
            item =>
                item.id === cargoId
        );


    if (!cargo) return;


    pageContent.innerHTML = `

        ${renderPageHeader(
            cargo.id,
            "Cargo movement and logistics details."
        )}


        <div class="kpi-grid">

            ${kpiCard(
                "CARGO",
                cargo.id,
                cargo.name,
                "▣"
            )}

            ${kpiCard(
                "ORIGIN",
                cargo.origin,
                "departure point",
                "●"
            )}

            ${kpiCard(
                "DESTINATION",
                cargo.destination,
                "mission destination",
                "◆"
            )}

            ${kpiCard(
                "PRIORITY",
                cargo.priority,
                cargo.status,
                "!"
            )}

        </div>


        <div class="panel">

            <div class="panel-heading">

                <div>

                    <h2>
                        Cargo Movement
                    </h2>

                    <p class="table-subtitle">
                        Current shipment route.
                    </p>

                </div>

                <span class="
                    status-badge
                    ${getStatusClass(cargo.status)}
                ">
                    ${cargo.status}
                </span>

            </div>


            <div class="ai-assessment">

                <div class="assessment-score">

                    <strong>
                        ${cargo.status === "AT RISK"
                            ? "82"
                            : "24"}
                    </strong>

                    <span>
                        RISK SCORE
                    </span>

                </div>


                <div class="assessment-message">

                    <strong>
                        Logistics Assessment
                    </strong>

                    <p>

                        ${
                            cargo.status === "AT RISK"

                            ? "Cargo requires logistics attention because the shipment has been flagged as at risk."

                            : "Cargo is currently progressing through the expedition logistics chain."

                        }

                    </p>

                </div>

            </div>

        </div>

    `;

}


/* ============================================================
   INVENTORY
   ============================================================ */

function showInventory() {

    pageContent.innerHTML = `

        ${renderPageHeader(
            "Inventory Intelligence",
            "Monitor mission-critical spares and replenishment requirements."
        )}


        <div class="kpi-grid">

            ${kpiCard(
                "ITEM TYPES",
                operationalData.inventory.length,
                "tracked inventory",
                "▤"
            )}

            ${kpiCard(
                "LOW STOCK",
                getLowStockItems().length,
                "below threshold",
                "!",
                getLowStockItems().length
                    ? "warning"
                    : "healthy"
            )}

            ${kpiCard(
                "TOTAL UNITS",
                operationalData.inventory.reduce(
                    (sum, item) =>
                        sum + item.available,
                    0
                ),
                "available units",
                "◈"
            )}

            ${kpiCard(
                "RESERVED",
                operationalData.inventory.reduce(
                    (sum, item) =>
                        sum + item.reserved,
                    0
                ),
                "reserved units",
                "◇"
            )}

        </div>


        <div class="panel">

            <div class="panel-heading">

                <div>

                    <h2>
                        Inventory Status
                    </h2>

                    <p class="table-subtitle">
                        Live stock availability.
                    </p>

                </div>

            </div>


            <div class="inventory-grid">

                ${operationalData.inventory.map(
                    item => {

                        const percentage =
                            Math.min(
                                100,
                                Math.round(
                                    item.available /
                                    item.reorderLevel *
                                    100
                                )
                            );


                        return `

                        <div class="inventory-card">

                            <div class="inventory-card-header">

                                <strong>
                                    ${item.name}
                                </strong>

                                <span class="
                                    status-badge
                                    ${
                                        item.available <=
                                        item.reorderLevel
                                            ? "warning"
                                            : "operational"
                                    }
                                ">

                                    ${
                                        item.available <=
                                        item.reorderLevel
                                            ? "LOW STOCK"
                                            : "HEALTHY"
                                    }

                                </span>

                            </div>


                            <div class="inventory-location">

                                ${item.location}

                            </div>


                            <div class="inventory-number">

                                ${item.available}

                                <span>
                                    available
                                </span>

                            </div>


                            <div class="inventory-progress">

                                <div
                                    style="width:${percentage}%"
                                ></div>

                            </div>

                        </div>

                        `;

                    }
                ).join("")}

            </div>

        </div>

    `;

}


/* ============================================================
   ASSETS
   ============================================================ */

function showAssets() {

    pageContent.innerHTML = `

        ${renderPageHeader(
            "Asset Intelligence",
            "Monitor equipment health and maintenance conditions."
        )}


        <div class="kpi-grid">

            ${kpiCard(
                "TOTAL ASSETS",
                operationalData.assets.length,
                "tracked assets",
                "◈"
            )}

            ${kpiCard(
                "OPERATIONAL",
                getOperationalAssets().length,
                "healthy assets",
                "✓",
                "healthy"
            )}

            ${kpiCard(
                "WARNING",
                getWarningAssets().length,
                "require attention",
                "!",
                "warning"
            )}

            ${kpiCard(
                "CRITICAL",
                getCriticalAssets().length,
                "immediate action",
                "!",
                "critical"
            )}

        </div>


        <div class="panel">

            <div class="panel-heading">

                <div>

                    <h2>
                        Asset Fleet
                    </h2>

                    <p class="table-subtitle">
                        Current equipment condition.
                    </p>

                </div>

            </div>


            <div class="asset-grid">

                ${operationalData.assets.map(
                    asset => `

                    <div class="asset-card">

                        <div class="asset-card-header">

                            <div>

                                <strong>
                                    ${asset.id}
                                </strong>

                                <p>
                                    ${asset.name}
                                </p>

                            </div>


                            <span class="
                                status-badge
                                ${getStatusClass(asset.status)}
                            ">

                                ${asset.status}

                            </span>

                        </div>


                        <div class="asset-metrics">

                            <div class="asset-metric">

                                <span>
                                    LOCATION
                                </span>

                                <strong>
                                    ${asset.location}
                                </strong>

                            </div>


                            <div class="asset-metric">

                                <span>
                                    CATEGORY
                                </span>

                                <strong>
                                    ${asset.category}
                                </strong>

                            </div>


                            <div class="asset-metric">

                                <span>
                                    SPARE
                                </span>

                                <strong>
                                    ${asset.requiredSpare}
                                </strong>

                            </div>

                        </div>


                        <button
                            class="primary-button"
                            style="margin-top:15px"
                            onclick="scheduleMaintenance('${asset.id}')"
                        >
                            SCHEDULE MAINTENANCE
                        </button>

                    </div>

                    `
                ).join("")}

            </div>

        </div>

    `;

}


/* ============================================================
   PERSONNEL
   ============================================================ */

function showPersonnel() {

    pageContent.innerHTML = `

        ${renderPageHeader(
            "Personnel Intelligence",
            "Monitor field teams, movement and personnel safety."
        )}


        <div class="kpi-grid">

            ${kpiCard(
                "TOTAL PERSONNEL",
                getPersonnelCount(),
                "deployed personnel",
                "◎"
            )}

            ${kpiCard(
                "TEAMS",
                operationalData.personnel.length,
                "active teams",
                "◉"
            )}

            ${kpiCard(
                "CHECK-IN DUE",
                getTeamsNeedingAttention().length,
                "require confirmation",
                "!",
                getTeamsNeedingAttention().length
                    ? "critical"
                    : "healthy"
            )}

            ${kpiCard(
                "SAFE TEAMS",
                operationalData.personnel.filter(
                    team =>
                        team.status !==
                        "CHECK-IN DUE"
                ).length,
                "within normal state",
                "✓",
                "healthy"
            )}

        </div>


        <div class="panel">

            <div class="panel-heading">

                <div>

                    <h2>
                        Field Teams
                    </h2>

                    <p class="table-subtitle">
                        Current team locations and safety status.
                    </p>

                </div>

            </div>


            <div class="personnel-grid">

                ${operationalData.personnel.map(
                    team => `

                    <div class="personnel-card">

                        <div class="personnel-card-header">

                            <strong>
                                ${team.name}
                            </strong>

                            <span class="
                                status-badge
                                ${getStatusClass(team.status)}
                            ">

                                ${team.status}

                            </span>

                        </div>


                        <div class="personnel-card-location">

                            ${team.location}

                        </div>


                        <div class="personnel-count">

                            ${team.count}

                            <span>
                                personnel
                            </span>

                        </div>


                        <button
                            class="primary-button"
                            style="margin-top:15px"
                            onclick="contactPersonnelTeam('${team.id}')"
                        >
                            CONTACT TEAM
                        </button>

                    </div>

                    `
                ).join("")}

            </div>

        </div>

    `;

}


/* ============================================================
   EMERGENCY
   ============================================================ */

function showEmergency() {

    const team04 = operationalData.personnel.find(
        team => team.id === "TEAM-04"
    );

    const gen07 = operationalData.assets.find(
        asset => asset.id === "GEN-07"
    );

    const cargo107 = operationalData.cargo.find(
        cargo => cargo.id === "CARGO-107"
    );

    const activeIncidents = [
        team04 && team04.status === "CHECK-IN DUE",
        gen07 && gen07.status === "WARNING",
        cargo107 && cargo107.status === "AT RISK"
    ].filter(Boolean).length;

    const criticalIncidents = [
        team04 && team04.status === "CHECK-IN DUE",
        cargo107 && cargo107.status === "AT RISK"
    ].filter(Boolean).length;

    let recommendation = "Continue emergency monitoring.";
    let recommendationReason = "No immediate response condition is currently active.";

    if (team04 && team04.status === "CHECK-IN DUE") {
        recommendation = "Verify TEAM-04 safety status immediately.";
        recommendationReason = "Personnel check-in is overdue at Research Site 04.";
    } else if (gen07 && gen07.status === "WARNING") {
        recommendation = "Initiate GEN-07 maintenance response.";
        recommendationReason = "Generator telemetry remains in a warning condition.";
    } else if (cargo107 && cargo107.status === "AT RISK") {
        recommendation = "Inspect CARGO-107 logistics status.";
        recommendationReason = "Critical cargo shipment is currently flagged as at risk.";
    }

    pageContent.innerHTML = `

        ${renderPageHeader(
            "Emergency Command Center",
            "Monitor and coordinate emergency response."
        )}

        <div class="emergency-banner">

            <div class="emergency-icon">
                ⚠
            </div>

            <div>
                <strong>EMERGENCY MONITORING ACTIVE</strong>
                <p>
                    PolarOps is continuously monitoring personnel,
                    assets and logistics conditions.
                </p>
            </div>

            <div class="emergency-live-state">
                <span class="status-dot"></span>
                LIVE RESPONSE
            </div>

        </div>

        <div class="emergency-intelligence-grid">

            <div class="emergency-intel-card critical">
                <span>ACTIVE INCIDENTS</span>
                <strong>${activeIncidents}</strong>
                <small>conditions requiring response</small>
            </div>

            <div class="emergency-intel-card danger">
                <span>CRITICAL CONDITIONS</span>
                <strong>${criticalIncidents}</strong>
                <small>personnel or cargo risk</small>
            </div>

            <div class="emergency-intel-card ready">
                <span>RESPONSE MODE</span>
                <strong>AUTONOMOUS</strong>
                <small>rule-based response available</small>
            </div>

        </div>

        <div class="emergency-recommendation">

            <div class="emergency-rec-icon">🧠</div>

            <div class="emergency-rec-content">
                <span>AI RESPONSE RECOMMENDATION</span>
                <strong>${recommendation}</strong>
                <p>${recommendationReason}</p>
            </div>

            <button
                class="primary-button emergency-execute-button"
                onclick="executeEmergencyRecommendation()"
            >
                EXECUTE RESPONSE
            </button>

        </div>

        <div class="panel">

            <div class="panel-heading">
                <div>
                    <h2>Active Incidents</h2>
                    <p class="table-subtitle">
                        Current conditions requiring attention.
                    </p>
                </div>
                <span class="panel-meta">LIVE</span>
            </div>

            <div class="alert-list">

                <div class="alert-row">
                    <div class="alert-icon">!</div>
                    <div>
                        <strong>TEAM-04</strong>
                        <p>Personnel check-in overdue at Research Site 04.</p>
                    </div>
                    <button
                        class="danger-button"
                        onclick="executeEmergencyResponse('TEAM-04')"
                    >
                        ACKNOWLEDGE
                    </button>
                </div>

                <div class="alert-row">
                    <div class="alert-icon">!</div>
                    <div>
                        <strong>GEN-07</strong>
                        <p>Generator warning condition at Maitri.</p>
                    </div>
                    <button
                        class="danger-button"
                        onclick="executeEmergencyResponse('GEN-07')"
                    >
                        RESPOND
                    </button>
                </div>

                <div class="alert-row">
                    <div class="alert-icon">!</div>
                    <div>
                        <strong>CARGO-107</strong>
                        <p>Critical cargo shipment is currently at risk.</p>
                    </div>
                    <button
                        class="danger-button"
                        onclick="executeEmergencyResponse('CARGO-107')"
                    >
                        INSPECT
                    </button>
                </div>

            </div>
        </div>

        <div class="emergency-response-flow">
            <div class="emergency-flow-title">RESPONSE WORKFLOW</div>
            <div class="emergency-flow-steps">
                <div><span>01</span><strong>DETECT</strong><small>Incident identified</small></div>
                <div><span>02</span><strong>ASSESS</strong><small>Severity evaluated</small></div>
                <div><span>03</span><strong>DECIDE</strong><small>Response selected</small></div>
                <div><span>04</span><strong>ACT</strong><small>Mission state updated</small></div>
            </div>
        </div>

    `;
}

function executeEmergencyResponse(targetId) {

    if (targetId === "TEAM-04") {
        const team = operationalData.personnel.find(
            item => item.id === "TEAM-04"
        );

        if (!team) return;

        team.status = "AVAILABLE";

        addActivity(
            "EMERGENCY",
            "TEAM-04 safety verification completed. Personnel status updated to AVAILABLE.",
            "CRITICAL"
        );

        if (typeof addAutomationFeedEvent === "function") {
            addAutomationFeedEvent(
                "EMERGENCY",
                "TEAM-04 safety verification completed. Personnel status updated to AVAILABLE.",
                "CRITICAL"
            );
        }

        showSimulationNotification(
            "PERSONNEL VERIFIED",
            "TEAM-04 safety status updated to AVAILABLE."
        );
    }

    else if (targetId === "GEN-07") {
        const asset = operationalData.assets.find(
            item => item.id === "GEN-07"
        );

        if (!asset) return;

        asset.status = "OPERATIONAL";

        addActivity(
            "EMERGENCY",
            "GEN-07 emergency maintenance response completed. Asset returned to OPERATIONAL.",
            "ACTION"
        );

        if (typeof addAutomationFeedEvent === "function") {
            addAutomationFeedEvent(
                "EMERGENCY",
                "GEN-07 emergency maintenance response completed. Asset returned to OPERATIONAL.",
                "ACTION"
            );
        }

        showSimulationNotification(
            "ASSET RESPONSE",
            "GEN-07 returned to operational state."
        );
    }

    else if (targetId === "CARGO-107") {
        const cargo = operationalData.cargo.find(
            item => item.id === "CARGO-107"
        );

        if (!cargo) return;

        cargo.status = "INSPECTION";

        addActivity(
            "EMERGENCY",
            "CARGO-107 logistics inspection initiated from Emergency Command Center.",
            "ACTION"
        );

        if (typeof addAutomationFeedEvent === "function") {
            addAutomationFeedEvent(
                "EMERGENCY",
                "CARGO-107 logistics inspection initiated from Emergency Command Center.",
                "ACTION"
            );
        }

        showSimulationNotification(
            "CARGO RESPONSE",
            "CARGO-107 inspection initiated."
        );
    }

    refreshCurrentPage();
}

function executeEmergencyRecommendation() {
    const team04 = operationalData.personnel.find(
        team => team.id === "TEAM-04"
    );

    const gen07 = operationalData.assets.find(
        asset => asset.id === "GEN-07"
    );

    const cargo107 = operationalData.cargo.find(
        cargo => cargo.id === "CARGO-107"
    );

    if (team04 && team04.status === "CHECK-IN DUE") {
        executeEmergencyResponse("TEAM-04");
        return;
    }

    if (gen07 && gen07.status === "WARNING") {
        executeEmergencyResponse("GEN-07");
        return;
    }

    if (cargo107 && cargo107.status === "AT RISK") {
        executeEmergencyResponse("CARGO-107");
        return;
    }

    showSimulationNotification(
        "MONITORING",
        "No emergency response action is currently required."
    );
}



let automationFeed = [];

function addAutomationFeedEvent(source, message, type = "INFO") {

    const now = new Date();

    const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    automationFeed.unshift({
        time,
        source,
        message,
        type
    });

    automationFeed = automationFeed.slice(0, 12);

    const feedList = document.getElementById("automation-feed-list");

    if (feedList) {
        feedList.innerHTML = renderAutomationFeed();
    }
}

function renderAutomationFeed() {

    if (!automationFeed.length) {
        return `
            <div class="automation-feed-empty">
                No automation events yet. Run an automation test to begin.
            </div>
        `;
    }

    return automationFeed.map(event => `
        <div class="automation-feed-row ${event.type.toLowerCase()}">
            <span class="automation-feed-time">${event.time}</span>
            <span class="automation-feed-source">${event.source}</span>
            <div class="automation-feed-message">
                <strong>${event.message}</strong>
                <span>${event.type}</span>
            </div>
        </div>
    `).join("");
}



/* ============================================================
   AUTOMATION INTELLIGENCE LAYER
   ============================================================ */

let automationIntelligence = {
    riskLevel: "MONITOR",
    confidence: 96,
    priority: "NONE",
    recommendation: "Continue monitoring operational conditions.",
    reasoning: "No active condition currently requires an autonomous response.",
    actionType: "FULL"
};

function calculateAutomationIntelligence() {

    const warningAssets = operationalData.assets.filter(
        asset => asset.status === "WARNING"
    );

    const lowStockItems = operationalData.inventory.filter(
        item => item.available <= 3
    );

    const personnelAlerts = operationalData.personnel.filter(
        team => team.status === "CHECK-IN DUE"
    );

    /* Personnel safety condition gets the highest response priority. */
    if (personnelAlerts.length) {
        automationIntelligence = {
            riskLevel: "CRITICAL",
            confidence: 98,
            priority: `${personnelAlerts[0].id} SAFETY CHECK`,
            recommendation: "Initiate personnel safety verification immediately.",
            reasoning: `${personnelAlerts.length} team condition(s) require check-in verification.`,
            actionType: "EMERGENCY"
        };
        return automationIntelligence;
    }

    if (warningAssets.length) {
        automationIntelligence = {
            riskLevel: "HIGH",
            confidence: 95,
            priority: `${warningAssets[0].id} MAINTENANCE`,
            recommendation: "Trigger predictive maintenance response for the warning asset.",
            reasoning: `${warningAssets.length} asset(s) are reporting WARNING status.`,
            actionType: "MAINTENANCE"
        };
        return automationIntelligence;
    }

    if (lowStockItems.length) {
        automationIntelligence = {
            riskLevel: "MEDIUM",
            confidence: 93,
            priority: `${lowStockItems[0].name} REPLENISHMENT`,
            recommendation: "Replenish critical spare inventory before the threshold is breached.",
            reasoning: `${lowStockItems.length} inventory item(s) are at or below reorder threshold.`,
            actionType: "INVENTORY"
        };
        return automationIntelligence;
    }

    automationIntelligence = {
        riskLevel: "MONITOR",
        confidence: 96,
        priority: "ROUTINE MONITORING",
        recommendation: "Continue autonomous monitoring; no immediate intervention required.",
        reasoning: "Assets, inventory and personnel are currently within monitored conditions.",
        actionType: "FULL"
    };

    return automationIntelligence;
}

function executeRecommendedAutomation() {
    const intelligence = calculateAutomationIntelligence();

    addAutomationFeedEvent(
        "AI ADVISOR",
        `${intelligence.priority}: ${intelligence.recommendation}`,
        intelligence.riskLevel === "CRITICAL" ? "CRITICAL" : "ACTION"
    );

    runAutomationTest(intelligence.actionType);
}

function renderAutomationIntelligence() {

    const intelligence = calculateAutomationIntelligence();

    const riskClass = intelligence.riskLevel.toLowerCase();

    return `
        <div class="automation-intelligence-panel">

            <div class="automation-intelligence-summary ${riskClass}">
                <div class="automation-intelligence-icon">🧠</div>

                <div class="automation-intelligence-main">
                    <span class="automation-intelligence-kicker">AUTONOMOUS INTELLIGENCE</span>
                    <h3>${intelligence.recommendation}</h3>
                    <p>${intelligence.reasoning}</p>
                </div>

                <div class="automation-confidence">
                    <span>CONFIDENCE</span>
                    <strong>${intelligence.confidence}%</strong>
                </div>
            </div>

            <div class="automation-intelligence-grid">
                <div>
                    <span>RISK LEVEL</span>
                    <strong class="ai-risk-${riskClass}">${intelligence.riskLevel}</strong>
                </div>

                <div>
                    <span>PRIORITY</span>
                    <strong>${intelligence.priority}</strong>
                </div>

                <div>
                    <span>DECISION MODE</span>
                    <strong>RULE + CONTEXT</strong>
                </div>

                <button
                    class="primary-button automation-ai-action"
                    onclick="executeRecommendedAutomation()">
                    EXECUTE RECOMMENDED ACTION
                </button>
            </div>

        </div>
    `;
}


function showAutomation() {

    const gen07 = operationalData.assets.find(
        asset => asset.id === "GEN-07"
    );

    const gen03 = operationalData.assets.find(
        asset => asset.id === "GEN-03"
    );

    const fuelPump = operationalData.inventory.find(
        item => item.name === "Fuel Pump"
    );

    const hydraulicBelt = operationalData.inventory.find(
        item => item.name === "Hydraulic Belt"
    );

    const team01 = operationalData.personnel.find(
        team => team.id === "TEAM-01"
    );

    const team04 = operationalData.personnel.find(
        team => team.id === "TEAM-04"
    );

    const warningAssets = operationalData.assets.filter(
        asset => asset.status === "WARNING"
    ).length;

    const lowStockItems = operationalData.inventory.filter(
        item => item.available <= 3
    ).length;

    const personnelAlerts = operationalData.personnel.filter(
        team => team.status === "CHECK-IN DUE"
    ).length;

    const activeConditions =
        warningAssets +
        lowStockItems +
        personnelAlerts;

    const monitoredAssets = operationalData.assets.length;
    const monitoredTeams = operationalData.personnel.length;

    pageContent.innerHTML = `

        ${renderPageHeader(
            "Smart Automation Command Center",
            "Autonomous monitoring, decision-making and response for polar expedition operations."
        )}

        <!-- AUTOMATION ENGINE -->

        <div class="data-panel">

            <div class="data-panel-header">

                <div>
                    <h3>POLAROPS AUTOMATION ENGINE</h3>
                    <p>
                        Real-time autonomous decision system
                    </p>
                </div>

                <span class="healthy">
                    ● ENGINE ONLINE
                </span>

            </div>

            <div class="automation-engine-grid">

                <div class="automation-engine-item">
                    <span>ENGINE STATUS</span>
                    <strong>ONLINE</strong>
                </div>

                <div class="automation-engine-item">
                    <span>ACTIVE CONDITIONS</span>
                    <strong>${activeConditions}</strong>
                </div>

                <div class="automation-engine-item">
                    <span>MONITORED ASSETS</span>
                    <strong>${monitoredAssets}</strong>
                </div>

                <div class="automation-engine-item">
                    <span>MONITORED TEAMS</span>
                    <strong>${monitoredTeams}</strong>
                </div>

            </div>

        </div>


        <!-- AUTOMATION INTELLIGENCE -->

        <div class="data-panel">

            <div class="data-panel-header">
                <div>
                    <h3>AUTOMATION INTELLIGENCE</h3>
                    <p>
                        Context-aware recommendation generated from live operational conditions
                    </p>
                </div>

                <span class="panel-meta">
                    AI DECISION SUPPORT
                </span>
            </div>

            ${renderAutomationIntelligence()}

        </div>


        <!-- MONITORING SNAPSHOT -->

        <div class="data-panel">

            <div class="data-panel-header">

                <div>
                    <h3>LIVE MONITORING SNAPSHOT</h3>
                    <p>
                        Conditions currently being evaluated by the automation engine
                    </p>
                </div>

                <span class="panel-meta">
                    ${activeConditions} CONDITIONS
                </span>

            </div>

            <div class="automation-module-grid">

                <div class="automation-module">

                    <div class="automation-module-icon">◉</div>

                    <div>
                        <h3>${gen07.id} · ${gen07.name}</h3>
                        <p>
                            ${gen07.location} · Asset status:
                            <strong class="warning">${gen07.status}</strong>
                        </p>
                    </div>

                    <span class="ai-risk-badge">
                        ACTION REQUIRED
                    </span>

                </div>


                <div class="automation-module">

                    <div class="automation-module-icon">▣</div>

                    <div>
                        <h3>${hydraulicBelt.name}</h3>
                        <p>
                            ${hydraulicBelt.available} units available ·
                            Reorder level ${hydraulicBelt.reorderLevel}
                        </p>
                    </div>

                    <span class="ai-monitor-badge">
                        LOW STOCK
                    </span>

                </div>


                <div class="automation-module">

                    <div class="automation-module-icon">◎</div>

                    <div>
                        <h3>${team04.id} · ${team04.name}</h3>
                        <p>
                            ${team04.location} · ${team04.count} members
                        </p>
                    </div>

                    <span class="ai-risk-badge">
                        CHECK-IN DUE
                    </span>

                </div>


                <div class="automation-module">

                    <div class="automation-module-icon">◈</div>

                    <div>
                        <h3>${gen03.id} · ${gen03.name}</h3>
                        <p>
                            ${gen03.location} · Asset status:
                            <strong class="healthy">${gen03.status}</strong>
                        </p>
                    </div>

                    <span class="status-badge operational">
                        NORMAL
                    </span>

                </div>

            </div>

        </div>


        <!-- KPI CARDS -->

        <div class="cards">

            <div class="card">
                <div class="card-label">DECISIONS TODAY</div>
                <div class="card-value">24</div>
                <div class="card-info">
                    Autonomous decisions processed
                </div>
            </div>

            <div class="card">
                <div class="card-label">ACTIVE RULES</div>
                <div class="card-value">7</div>
                <div class="card-info">
                    Automation rules monitoring
                </div>
            </div>

            <div class="card">
                <div class="card-label">ACTIONS EXECUTED</div>
                <div class="card-value">18</div>
                <div class="card-info">
                    Automated responses completed
                </div>
            </div>

            <div class="card">
                <div class="card-label">SUCCESS RATE</div>
                <div class="card-value healthy-text">96.4%</div>
                <div class="card-info">
                    Successful automated actions
                </div>
            </div>

        </div>


        <!-- DECISION PIPELINE -->

        <div class="data-panel">

            <div class="data-panel-header">

                <div>
                    <h3>LIVE AUTOMATION PIPELINE</h3>
                    <p>
                        How PolarOps converts operational events into actions
                    </p>
                </div>

                <span class="panel-meta">
                    REAL TIME
                </span>

            </div>

            <div class="automation-pipeline">

                <div class="pipeline-step active intelligence-pipeline-step">
                    <div class="pipeline-number">01</div>
                    <strong>DETECT</strong>
                    <p>
                        Telemetry and operational data
                    </p>
                </div>

                <div class="pipeline-arrow">→</div>

                <div class="pipeline-step active">
                    <div class="pipeline-number">02</div>
                    <strong>ANALYZE</strong>
                    <p>
                        Evaluate operational conditions
                    </p>
                </div>

                <div class="pipeline-arrow">→</div>

                <div class="pipeline-step active">
                    <div class="pipeline-number">03</div>
                    <strong>DECIDE</strong>
                    <p>
                        Select predefined response
                    </p>
                </div>

                <div class="pipeline-arrow">→</div>

                <div class="pipeline-step active">
                    <div class="pipeline-number">04</div>
                    <strong>ACT</strong>
                    <p>
                        Execute automated response
                    </p>
                </div>

            </div>

        </div>


        <!-- LIVE AUTOMATION FEED -->

        <div class="data-panel live-automation-feed-panel">

            <div class="data-panel-header">

                <div>
                    <h3>LIVE AUTOMATION FEED</h3>
                    <p>
                        Real-time record of autonomous detection, analysis, decisions and actions
                    </p>
                </div>

                <span class="live-feed-status">
                    <span class="status-dot"></span>
                    LIVE
                </span>

            </div>

            <div class="automation-feed-list" id="automation-feed-list">
                ${renderAutomationFeed()}
            </div>

        </div>


        <!-- AUTOMATED RESPONSE MODULES -->

        <div class="data-panel">

            <div class="data-panel-header">

                <div>
                    <h3>AUTOMATED RESPONSE MODULES</h3>
                    <p>
                        Test individual autonomous decision systems
                    </p>
                </div>

            </div>

            <div class="automation-module-grid">

                <div class="automation-module">
                    <div class="automation-module-icon">◉</div>

                    <div>
                        <h3>Telemetry Monitoring</h3>
                        <p>
                            Detect equipment warnings and trigger automated recovery.
                        </p>
                    </div>

                    <button
                        class="secondary-button"
                        onclick="runAutomationTest('TELEMETRY')">
                        Run Test
                    </button>
                </div>


                <div class="automation-module">
                    <div class="automation-module-icon">⚙</div>

                    <div>
                        <h3>Predictive Maintenance</h3>
                        <p>
                            Detect equipment maintenance conditions and initiate action.
                        </p>
                    </div>

                    <button
                        class="secondary-button"
                        onclick="runAutomationTest('MAINTENANCE')">
                        Run Test
                    </button>
                </div>


                <div class="automation-module">
                    <div class="automation-module-icon">▣</div>

                    <div>
                        <h3>Inventory Replenishment</h3>
                        <p>
                            Detect low stock and automatically replenish critical spares.
                        </p>
                    </div>

                    <button
                        class="secondary-button"
                        onclick="runAutomationTest('INVENTORY')">
                        Run Test
                    </button>
                </div>


                <div class="automation-module">
                    <div class="automation-module-icon">⚠</div>

                    <div>
                        <h3>Emergency Response</h3>
                        <p>
                            Detect personnel safety alerts and initiate verification.
                        </p>
                    </div>

                    <button
                        class="secondary-button"
                        onclick="runAutomationTest('EMERGENCY')">
                        Run Test
                    </button>
                </div>

            </div>

        </div>


        <!-- DECISION RULES -->

        <div class="data-panel">

            <div class="data-panel-header">

                <div>
                    <h3>AUTONOMOUS DECISION RULES</h3>
                    <p>
                        Transparent IF → THEN automation logic
                    </p>
                </div>

            </div>

            <div class="automation-rules">

                <div class="automation-rule">

                    <div class="rule-condition">
                        <span class="warning">IF</span>
                        <strong>Asset status = WARNING</strong>
                    </div>

                    <div class="rule-arrow">→</div>

                    <div class="rule-action">
                        <span class="healthy">THEN</span>
                        <strong>Trigger maintenance response</strong>
                    </div>

                </div>


                <div class="automation-rule">

                    <div class="rule-condition">
                        <span class="warning">IF</span>
                        <strong>Spare stock ≤ threshold</strong>
                    </div>

                    <div class="rule-arrow">→</div>

                    <div class="rule-action">
                        <span class="healthy">THEN</span>
                        <strong>Create replenishment action</strong>
                    </div>

                </div>


                <div class="automation-rule">

                    <div class="rule-condition">
                        <span class="warning">IF</span>
                        <strong>Personnel check-in overdue</strong>
                    </div>

                    <div class="rule-arrow">→</div>

                    <div class="rule-action">
                        <span class="healthy">THEN</span>
                        <strong>Initiate safety verification</strong>
                    </div>

                </div>

            </div>

        </div>


        <!-- CURRENT CONDITIONS -->

        <div class="data-panel">

            <div class="data-panel-header">

                <div>
                    <h3>CURRENT AUTOMATION CONDITIONS</h3>
                    <p>
                        Live conditions currently visible to the automation engine
                    </p>
                </div>

                <span class="panel-meta">
                    ${activeConditions} ACTIVE
                </span>

            </div>

            <div class="automation-condition-list">

                <div class="data-row">

                    <div>
                        <strong>${gen07.id}</strong>
                        <p>${gen07.name} · ${gen07.location}</p>
                    </div>

                    <span class="warning">
                        ${gen07.status}
                    </span>

                </div>


                <div class="data-row">

                    <div>
                        <strong>${hydraulicBelt.name}</strong>
                        <p>
                            ${hydraulicBelt.available} units available ·
                            ${hydraulicBelt.location}
                        </p>
                    </div>

                    <span class="warning">
                        LOW STOCK
                    </span>

                </div>


                <div class="data-row">

                    <div>
                        <strong>${team04.name}</strong>
                        <p>
                            ${team04.location} ·
                            ${team04.count} members
                        </p>
                    </div>

                    <span class="warning">
                        ${team04.status}
                    </span>

                </div>


                <div class="data-row">

                    <div>
                        <strong>${gen03.id}</strong>
                        <p>${gen03.name} · ${gen03.location}</p>
                    </div>

                    <span class="healthy">
                        ${gen03.status}
                    </span>

                </div>

            </div>

        </div>


        <!-- FULL SIMULATION -->

        <div class="data-panel automation-simulation-panel">

            <div class="data-panel-header">

                <div>
                    <h3>AUTOMATION SIMULATION</h3>
                    <p>
                        Execute a complete autonomous mission-control cycle
                    </p>
                </div>

                <button
                    class="primary-button"
                    onclick="runAutomationTest('FULL')">
                    ⚡ Run Full Automation Cycle
                </button>

            </div>

            <div class="simulation-info">

                <div>
                    <strong>${activeConditions}</strong>
                    <span>Active Conditions</span>
                </div>

                <div>
                    <strong>4</strong>
                    <span>Detection Modules</span>
                </div>

                <div>
                    <strong>7</strong>
                    <span>Automation Rules</span>
                </div>

                <div>
                    <strong>AUTO</strong>
                    <span>Decision Mode</span>
                </div>

            </div>

        </div>

    `;
}

/* ============================================================
   AI DECISION ENGINE
   ============================================================ */

function generateAIDecisionQueue() {

    const decisions = [];


    const checkInTeams =
        getTeamsNeedingAttention();


    checkInTeams.forEach(
        team => {

            decisions.push({

                category: "PERSONNEL",

                title:
                    `${team.id} check-in overdue`,

                description:
                    `${team.name} requires immediate safety confirmation at ${team.location}.`,

                reason:
                    "Personnel safety threshold has been exceeded.",

                riskScore: 95,

                confidence: 94,

                riskLabel: "CRITICAL",

                actionType: "checkin",

                target: team.id,

                detectedAt: "NOW"

            });

        }
    );


    getCriticalAssets().forEach(
        asset => {

            decisions.push({

                category: "ASSET",

                title:
                    `${asset.id} critical condition`,

                description:
                    `${asset.name} at ${asset.location} requires maintenance intervention.`,

                reason:
                    "Asset status indicates a critical operational condition.",

                riskScore: 91,

                confidence: 90,

                riskLabel: "CRITICAL",

                actionType: "asset",

                target: asset.id,

                detectedAt: "NOW"

            });

        }
    );


    getWarningAssets().forEach(
        asset => {

            decisions.push({

                category: "ASSET",

                title:
                    `${asset.id} maintenance required`,

                description:
                    `${asset.name} is operating under a warning condition.`,

                reason:
                    "Asset health has crossed the warning threshold.",

                riskScore: 76,

                confidence: 88,

                riskLabel: "HIGH",

                actionType: "asset",

                target: asset.id,

                detectedAt: "NOW"

            });

        }
    );


    getLowStockItems().forEach(
        item => {

            decisions.push({

                category: "INVENTORY",

                title:
                    `${item.name} below threshold`,

                description:
                    `${item.available} units available against reorder level ${item.reorderLevel}.`,

                reason:
                    "Available spare inventory is below the defined threshold.",

                riskScore: 72,

                confidence: 92,

                riskLabel: "HIGH",

                actionType: "inventory",

                target: item.name,

                quantity:
                    Math.max(
                        1,
                        item.reorderLevel -
                        item.available
                    ),

                detectedAt: "NOW"

            });

        }
    );


    getCargoByStatus("AT RISK").forEach(
        cargo => {

            decisions.push({

                category: "CARGO",

                title:
                    `${cargo.id} logistics risk`,

                description:
                    `${cargo.name} is currently flagged as at risk.`,

                reason:
                    "Cargo movement requires logistics attention.",

                riskScore: 68,

                confidence: 85,

                riskLabel: "HIGH",

                actionType: "cargo",

                target: cargo.id,

                detectedAt: "NOW"

            });

        }
    );


    decisions.push({

        category: "CARGO",

        title: "Monitor active shipments",

        description:
            "Continue monitoring cargo currently in transit.",

        reason:
            "Shipment is progressing within normal monitoring conditions.",

        riskScore: 32,

        confidence: 80,

        riskLabel: "MONITOR",

        actionType: "monitor",

        target: "",

        detectedAt: "NOW"

    });


    return decisions;

}


/* ============================================================
   AI ADVISOR
   ============================================================ */

function showAIAdvisor() {

    const decisions =
        generateAIDecisionQueue();


    const critical =
        decisions.filter(
            item =>
                item.riskLabel === "CRITICAL"
        ).length;


    const high =
        decisions.filter(
            item =>
                item.riskLabel === "HIGH"
        ).length;


    pageContent.innerHTML = `

        ${renderPageHeader(
            "AI Operations Advisor",
            "Automated mission analysis and recommended operational actions."
        )}


        <div class="ai-advisor-banner">

            <div class="ai-brain">
                ✦
            </div>

            <div class="ai-banner-content">

                <strong>
                    AI OPERATIONS ADVISOR
                </strong>

                <p>
                    Analyzing assets, inventory, personnel,
                    cargo and mission readiness.
                </p>

            </div>

            <div class="ai-status">

                <span class="status-dot"></span>

                ANALYSIS ACTIVE

            </div>

        </div>


        <div class="ai-summary-grid">

            <div class="ai-summary-card critical">

                <span>
                    CRITICAL
                </span>

                <strong>
                    ${critical}
                </strong>

                <small>
                    immediate attention
                </small>

            </div>


            <div class="ai-summary-card warning">

                <span>
                    HIGH
                </span>

                <strong>
                    ${high}
                </strong>

                <small>
                    recommended actions
                </small>

            </div>


            <div class="ai-summary-card healthy">

                <span>
                    ANALYZED
                </span>

                <strong>
                    ${decisions.length}
                </strong>

                <small>
                    current decisions
                </small>

            </div>

        </div>


        <div class="ai-decision-summary-panel">

            <div class="ai-decision-summary-head">

                <div>
                    <span class="ai-decision-kicker">AUTONOMOUS INTELLIGENCE</span>
                    <h2>AI Decision Summary</h2>
                    <p>Mission conditions converted into a prioritized operational recommendation.</p>
                </div>

                <div class="ai-decision-live">
                    <span class="status-dot"></span>
                    LIVE ANALYSIS
                </div>

            </div>

            <div class="ai-decision-summary-grid">

                <div class="ai-decision-metric">
                    <span>MISSION STATE</span>
                    <strong class="ai-decision-critical-text">${critical > 0 ? "INTERVENTION REQUIRED" : high > 0 ? "ELEVATED RISK" : "STABLE"}</strong>
                </div>

                <div class="ai-decision-metric">
                    <span>TOP PRIORITY</span>
                    <strong>${decisions[0] ? decisions[0].title : "No active conditions"}</strong>
                </div>

                <div class="ai-decision-metric">
                    <span>AI CONFIDENCE</span>
                    <strong>${decisions.length ? Math.round(decisions.reduce((sum, item) => sum + Number(item.confidence || 0), 0) / decisions.length) : 0}%</strong>
                </div>

                <div class="ai-decision-metric">
                    <span>RECOMMENDED MODE</span>
                    <strong>${decisions[0] && decisions[0].riskLabel === "CRITICAL" ? "IMMEDIATE RESPONSE" : high > 0 ? "PRIORITIZED RESPONSE" : "AUTONOMOUS MONITORING"}</strong>
                </div>

            </div>

            <div class="ai-decision-recommendation">
                <div class="ai-decision-recommendation-icon">✦</div>
                <div>
                    <span>RECOMMENDED NEXT ACTION</span>
                    <strong>${decisions[0] ? decisions[0].title : "Continue mission monitoring"}</strong>
                    <p>${decisions[0] ? decisions[0].description : "Current mission conditions remain within monitored thresholds."}</p>
                </div>
            </div>

        </div>


        <div class="panel">

            <div class="panel-heading">

                <div>

                    <h2>
                        AI Action Queue
                    </h2>

                    <p class="table-subtitle">
                        Prioritized recommendations generated from current mission conditions.
                    </p>

                </div>

                <span class="panel-meta">
                    AI ENGINE
                </span>

            </div>


            <div class="ai-recommendation-list">

                ${decisions.map(
                    (item, index) => `

                    <div class="
                        ai-recommendation
                        ${item.riskLabel.toLowerCase()}
                    ">

                        <div class="ai-rec-number">
                            ${String(index + 1).padStart(2,"0")}
                        </div>


                        <div class="ai-rec-priority">

                            ${
                                item.riskLabel === "CRITICAL"
                                    ? "!"
                                    :
                                item.riskLabel === "HIGH"
                                    ? "⚠"
                                    : "◌"
                            }

                        </div>


                        <div class="ai-rec-content">

                            <div class="ai-rec-title">

                                <span>
                                    ${item.category}
                                </span>

                                <strong>
                                    ${item.title}
                                </strong>

                            </div>


                            <p>
                                ${item.description}
                            </p>


                            <div class="risk-reason">

                                <span>
                                    AI REASON
                                </span>

                                ${item.reason}

                            </div>

                        </div>


                        <div class="ai-rec-action">

                            ${
                                item.actionType ===
                                "checkin"

                                    ?

                                    `
                                    <button
                                        class="ai-action-button critical"
                                        onclick="
                                            aiCheckIn('${item.target}')
                                        "
                                    >
                                        EXECUTE
                                    </button>
                                    `

                                    :

                                item.actionType ===
                                "asset"

                                    ?

                                    `
                                    <button
                                        class="ai-action-button warning"
                                        onclick="
                                            aiAssetAction('${item.target}')
                                        "
                                    >
                                        EXECUTE
                                    </button>
                                    `

                                    :

                                item.actionType ===
                                "inventory"

                                    ?

                                    `
                                    <button
                                        class="ai-action-button warning"
                                        onclick="
                                            aiInventoryAction(
                                                '${item.target}',
                                                ${item.quantity}
                                            )
                                        "
                                    >
                                        REORDER
                                    </button>
                                    `

                                    :

                                item.actionType ===
                                "cargo"

                                    ?

                                    `
                                    <button
                                        class="ai-action-button critical"
                                        onclick="
                                            aiCargoAction('${item.target}')
                                        "
                                    >
                                        INSPECT
                                    </button>
                                    `

                                    :

                                    `
                                    <span class="ai-monitor-badge">
                                        MONITOR
                                    </span>
                                    `
                            }

                        </div>

                    </div>

                    `
                ).join("")}

            </div>

        </div>


        <div class="panel">

            <div class="panel-heading">

                <div>

                    <h2>
                        Decision Logic
                    </h2>

                    <p class="table-subtitle">
                        How PolarOps converts mission data into recommendations.
                    </p>

                </div>

            </div>


            <div class="ai-logic">

                <div class="ai-logic-step">

                    <div class="ai-logic-icon">
                        01
                    </div>

                    <div>

                        <strong>
                            DATA
                        </strong>

                        <p>
                            Assets, cargo, inventory and personnel.
                        </p>

                    </div>

                </div>


                <div class="ai-logic-line"></div>


                <div class="ai-logic-step">

                    <div class="ai-logic-icon">
                        02
                    </div>

                    <div>

                        <strong>
                            RISK ANALYSIS
                        </strong>

                        <p>
                            Current conditions compared with thresholds.
                        </p>

                    </div>

                </div>


                <div class="ai-logic-line"></div>


                <div class="ai-logic-step">

                    <div class="ai-logic-icon">
                        03
                    </div>

                    <div>

                        <strong>
                            PRIORITIZATION
                        </strong>

                        <p>
                            Conditions ranked by operational severity.
                        </p>

                    </div>

                </div>


                <div class="ai-logic-line"></div>


                <div class="ai-logic-step">

                    <div class="ai-logic-icon">
                        04
                    </div>

                    <div>

                        <strong>
                            ACTION
                        </strong>

                        <p>
                            Recommended response presented to the operator.
                        </p>

                    </div>

                </div>

            </div>

        </div>

    `;

}


/* ============================================================
   AI RISK ANALYSIS
   ============================================================ */

function showAIRiskAnalysis() {

    const decisions =
        generateAIDecisionQueue();


    pageContent.innerHTML = `

        ${renderPageHeader(
            "AI Risk Analysis",
            "Operational risk assessment across the mission."
        )}


        <div class="panel">

            <div class="panel-heading">

                <div>

                    <h2>
                        Risk Assessment
                    </h2>

                    <p class="table-subtitle">
                        Current conditions converted into risk scores.
                    </p>

                </div>

                <span class="panel-meta">
                    AI ANALYSIS
                </span>

            </div>


            <div class="ai-risk-table">

                ${decisions.map(
                    (item, index) => `

                    <div class="
                        ai-risk-row
                        ${
                            item.riskLabel === "CRITICAL"
                                ? "critical"
                                :
                            item.riskLabel === "HIGH"
                                ? "high"
                                : "medium"
                        }
                    ">

                        <div class="risk-rank">
                            #${index + 1}
                        </div>


                        <div class="risk-score">

                            <strong>
                                ${item.riskScore}
                            </strong>

                            <span>
                                RISK
                            </span>

                        </div>


                        <div class="risk-main">

                            <div class="risk-title">

                                <span>
                                    ${item.category}
                                </span>

                                <strong>
                                    ${item.title}
                                </strong>

                            </div>


                            <p>
                                ${item.description}
                            </p>


                            <div class="risk-reason">

                                <span>
                                    REASON
                                </span>

                                ${item.reason}

                            </div>

                        </div>


                        <div class="risk-confidence">

                            <strong>
                                ${item.confidence}%
                            </strong>

                            <span>
                                CONFIDENCE
                            </span>

                        </div>


                        <div>

                            <span class="
                                ai-risk-badge
                                ${
                                    item.riskLabel ===
                                    "CRITICAL"
                                        ? "critical"
                                        :
                                    item.riskLabel ===
                                    "HIGH"
                                        ? "high"
                                        : "medium"
                                }
                            ">

                                ${item.riskLabel}

                            </span>

                        </div>

                    </div>

                    `
                ).join("")}

            </div>

        </div>

    `;

}


/* ============================================================
   ACTIVITY LOG PAGE
   ============================================================ */

function showActivityLog() {

    pageContent.innerHTML = `

        ${renderPageHeader(
            "Mission Activity Log",
            "Chronological record of PolarOps operational events."
        )}


        <div class="panel">

            <div class="panel-heading">

                <div>

                    <h2>
                        Event Stream
                    </h2>

                    <p class="table-subtitle">
                        Latest mission events.
                    </p>

                </div>

                <span class="panel-meta">
                    ${activityLog.length} EVENTS
                </span>

            </div>


            <div class="activity-list">

                ${
                    activityLog.length

                    ?

                    activityLog.map(
                        event => `

                        <div class="activity-row">

                            <div class="activity-time">
                                ${event.time}
                            </div>


                            <div class="activity-icon">

                                ${
                                    event.priority ===
                                    "CRITICAL"
                                        ? "!"
                                        :
                                    event.priority ===
                                    "ACTION"
                                        ? "⚡"
                                        : "◉"
                                }

                            </div>


                            <div class="activity-content">

                                <strong>
                                    ${event.type}
                                </strong>

                                <p>
                                    ${event.message}
                                </p>

                            </div>


                            <span class="
                                status-badge
                                ${
                                    event.priority ===
                                    "CRITICAL"
                                        ? "critical"
                                        :
                                    event.priority ===
                                    "ACTION"
                                        ? "warning"
                                        : "operational"
                                }
                            ">

                                ${event.priority}

                            </span>

                        </div>

                        `
                    ).join("")

                    :

                    `
                    <div class="empty-state">
                        <strong>
                            No events
                        </strong>
                    </div>
                    `
                }

            </div>

        </div>

    `;

}


/* ============================================================
   MISSION SIMULATOR
   ============================================================ */

function showMissionSimulator() {

    pageContent.innerHTML = `

        ${renderPageHeader(
            "Mission Event Simulator",
            "Trigger operational scenarios for demonstration and testing."
        )}


        <div class="simulator-banner">

            <div class="simulator-icon">
                ⚡
            </div>

            <div class="simulator-info">

                <strong>
                    LIVE MISSION SIMULATION
                </strong>

                <p>
                    Trigger events and observe automated mission response.
                </p>

            </div>

            <div class="simulator-status">

                <span class="status-dot"></span>

                SIMULATION READY

            </div>

        </div>


        <div class="panel">

            <div class="panel-heading">

                <div>

                    <h2>
                        Event Controls
                    </h2>

                    <p class="table-subtitle">
                        Select an event to simulate an operational condition.
                    </p>

                </div>

                <span class="panel-meta">
                    COMMAND
                </span>

            </div>


            <div class="simulation-grid">


                <div class="simulation-card">

                    <div class="simulation-card-icon">
                        ⚙
                    </div>

                    <span>
                        ASSET
                    </span>

                    <strong>
                        Simulate Asset Failure
                    </strong>

                    <p>
                        Generate a critical equipment condition.
                    </p>

                    <button
                        class="simulation-button critical"
                        onclick="simulateAssetFailure()"
                    >
                        TRIGGER EVENT
                    </button>

                </div>


                <div class="simulation-card">

                    <div class="simulation-card-icon">
                        ◎
                    </div>

                    <span>
                        PERSONNEL
                    </span>

                    <strong>
                        Personnel Emergency
                    </strong>

                    <p>
                        Trigger a field-team safety alert.
                    </p>

                    <button
                        class="simulation-button critical"
                        onclick="simulatePersonnelEmergency()"
                    >
                        TRIGGER EVENT
                    </button>

                </div>


                <div class="simulation-card">

                    <div class="simulation-card-icon">
                        ▤
                    </div>

                    <span>
                        INVENTORY
                    </span>

                    <strong>
                        Deplete Inventory
                    </strong>

                    <p>
                        Simulate rapid consumption of a spare.
                    </p>

                    <button
                        class="simulation-button warning"
                        onclick="simulateInventoryDepletion()"
                    >
                        TRIGGER EVENT
                    </button>

                </div>


                <div class="simulation-card">

                    <div class="simulation-card-icon">
                        ▣
                    </div>

                    <span>
                        CARGO
                    </span>

                    <strong>
                        Flag Cargo Risk
                    </strong>

                    <p>
                        Simulate a logistics risk event.
                    </p>

                    <button
                        class="simulation-button critical"
                        onclick="simulateCargoRisk()"
                    >
                        TRIGGER EVENT
                    </button>

                </div>


                <div class="simulation-card">

                    <div class="simulation-card-icon">
                        ◉
                    </div>

                    <span>
                        SYSTEM
                    </span>

                    <strong>
                        Telemetry Burst
                    </strong>

                    <p>
                        Generate a live telemetry event.
                    </p>

                    <button
                        class="simulation-button info"
                        onclick="simulateTelemetryBurst()"
                    >
                        TRIGGER EVENT
                    </button>

                </div>


                <div class="simulation-card">

                    <div class="simulation-card-icon">
                        ↻
                    </div>

                    <span>
                        CONTROL
                    </span>

                    <strong>
                        Reset Simulation
                    </strong>

                    <p>
                        Restore the baseline mission state.
                    </p>

                    <button
                        class="simulation-button reset"
                        onclick="resetMissionSimulation()"
                    >
                        RESET SYSTEM
                    </button>

                </div>

            </div>

        </div>


        <div class="panel">

            <div class="panel-heading">

                <div>

                    <h2>
                        Automated Response Pipeline
                    </h2>

                    <p class="table-subtitle">
                        Detect → Analyze → Risk → Action
                    </p>

                </div>

                <span class="panel-meta">
                    SMART AUTOMATION
                </span>

            </div>


            <div class="simulation-flow">


                <div class="simulation-flow-step">

                    <div class="simulation-flow-number">
                        01
                    </div>

                    <strong>
                        EVENT
                    </strong>

                    <span>
                        Mission condition detected.
                    </span>

                </div>


                <div class="simulation-arrow">
                    →
                </div>


                <div class="simulation-flow-step">

                    <div class="simulation-flow-number">
                        02
                    </div>

                    <strong>
                        ANALYZE
                    </strong>

                    <span>
                        Operational data evaluated.
                    </span>

                </div>


                <div class="simulation-arrow">
                    →
                </div>


                <div class="simulation-flow-step">

                    <div class="simulation-flow-number">
                        03
                    </div>

                    <strong>
                        RISK
                    </strong>

                    <span>
                        Severity automatically calculated.
                    </span>

                </div>


                <div class="simulation-arrow">
                    →
                </div>


                <div class="simulation-flow-step">

                    <div class="simulation-flow-number">
                        04
                    </div>

                    <strong>
                        ACTION
                    </strong>

                    <span>
                        Recommended response generated.
                    </span>

                </div>

            </div>

        </div>

    `;

}


/* ============================================================
   SIMULATION ACTIONS
   ============================================================ */

function simulateAssetFailure() {

    const asset =
        operationalData.assets[
            Math.floor(
                Math.random() *
                operationalData.assets.length
            )
        ];


    if (!asset) return;


    asset.status = "CRITICAL";


    addActivity(
        "SIMULATOR",
        `${asset.id} simulated critical failure at ${asset.location}.`,
        "CRITICAL"
    );


    showSimulationNotification(
        "CRITICAL EVENT",
        `${asset.id} entered a critical failure state.`
    );


    refreshCurrentPage();

}


function simulatePersonnelEmergency() {

    const team =
        operationalData.personnel[
            Math.floor(
                Math.random() *
                operationalData.personnel.length
            )
        ];


    if (!team) return;


    team.status = "CHECK-IN DUE";


    addActivity(
        "SIMULATOR",
        `${team.id} simulated personnel emergency.`,
        "CRITICAL"
    );


    showSimulationNotification(
        "PERSONNEL ALERT",
        `${team.id} requires immediate check-in.`
    );


    refreshCurrentPage();

}


function simulateInventoryDepletion() {

    const item =
        operationalData.inventory[
            Math.floor(
                Math.random() *
                operationalData.inventory.length
            )
        ];


    if (!item) return;


    const previous =
        item.available;


    item.available =
        Math.max(
            0,
            item.available - 3
        );


    addActivity(
        "SIMULATOR",
        `${item.name}: ${previous} → ${item.available} units.`,
        "ACTION"
    );


    showSimulationNotification(
        "INVENTORY ALERT",
        `${item.name} stock reduced to ${item.available}.`
    );


    refreshCurrentPage();

}


function simulateCargoRisk() {

    const shipment =
        operationalData.cargo[
            Math.floor(
                Math.random() *
                operationalData.cargo.length
            )
        ];


    if (!shipment) return;


    shipment.status = "AT RISK";


    addActivity(
        "SIMULATOR",
        `${shipment.id} flagged as at risk.`,
        "CRITICAL"
    );


    showSimulationNotification(
        "CARGO ALERT",
        `${shipment.id} is now AT RISK.`
    );


    refreshCurrentPage();

}


function simulateTelemetryBurst() {

    const asset =
        operationalData.assets[
            Math.floor(
                Math.random() *
                operationalData.assets.length
            )
        ];


    if (!asset) return;


    addActivity(
        "TELEMETRY",
        `Telemetry burst received from ${asset.id} at ${asset.location}.`,
        "INFO"
    );


    showSimulationNotification(
        "TELEMETRY",
        `Live telemetry received from ${asset.id}.`
    );


    refreshCurrentPage();

}


/* ============================================================
   RESET SIMULATION
   ============================================================ */

function resetMissionSimulation() {

    operationalData.assets.forEach(
        asset => {

            asset.status =
                asset.id === "GEN-07"
                    ? "WARNING"
                    : "OPERATIONAL";

        }
    );


    operationalData.inventory.forEach(
        item => {

            if (item.name === "Fuel Pump") {

                item.available = 2;

            }

            if (item.name === "Oil Filter") {

                item.available = 23;

            }

            if (item.name === "Hydraulic Belt") {

                item.available = 3;

            }

            if (item.name === "Sensor Module") {

                item.available = 4;

            }

        }
    );


    operationalData.personnel.forEach(
        team => {

            if (team.id === "TEAM-04") {

                team.status =
                    "CHECK-IN DUE";

            }

            else if (
                team.id === "TEAM-01"
            ) {

                team.status =
                    "AVAILABLE";

            }

            else if (
                team.id === "TEAM-02"
            ) {

                team.status =
                    "SAFE";

            }

            else {

                team.status =
                    "MOVING";

            }

        }
    );


    operationalData.cargo.forEach(
        cargo => {

            if (cargo.id === "CARGO-104") {

                cargo.status =
                    "IN TRANSIT";

            }

            if (cargo.id === "CARGO-105") {

                cargo.status =
                    "RECEIVED";

            }

            if (cargo.id === "CARGO-106") {

                cargo.status =
                    "PREPARED";

            }

            if (cargo.id === "CARGO-107") {

                cargo.status =
                    "AT RISK";

            }

        }
    );


    addActivity(
        "SYSTEM",
        "Mission simulation restored to baseline.",
        "ACTION"
    );


    showSimulationNotification(
        "SYSTEM RESET",
        "Mission simulation restored."
    );


    refreshCurrentPage();

}


/* ============================================================
   SIMULATION NOTIFICATION
   ============================================================ */

function showSimulationNotification(
    title,
    message
) {

    const oldToast =
        document.querySelector(
            ".simulation-toast"
        );


    if (oldToast) {

        oldToast.remove();

    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        "simulation-toast";


    toast.innerHTML = `

        <div class="toast-icon">
            ⚡
        </div>

        <div>

            <strong>
                ${title}
            </strong>

            <p>
                ${message}
            </p>

        </div>

    `;


    document.body.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.classList.add(
                "hide"
            );


            setTimeout(
                () => toast.remove(),
                300
            );

        },
        3500
    );

}


/* ============================================================
   ACTION FUNCTIONS
   ============================================================ */

function scheduleMaintenance(
    assetId
) {

    const asset =
        operationalData.assets.find(
            item =>
                item.id === assetId
        );


    if (!asset) return;


    asset.status =
        "OPERATIONAL";


    addActivity(
        "MAINTENANCE",
        `${asset.id} maintenance action completed.`,
        "ACTION"
    );


    showSimulationNotification(
        "MAINTENANCE",
        `${asset.id} returned to operational state.`
    );


    refreshCurrentPage();

}


function checkInTeam(
    teamId
) {

    const team =
        operationalData.personnel.find(
            item =>
                item.id === teamId
        );


    if (!team) return;


    team.status =
        "AVAILABLE";


    addActivity(
        "PERSONNEL",
        `${team.id} check-in completed successfully.`,
        "ACTION"
    );


    refreshCurrentPage();

}


function contactPersonnelTeam(
    teamId
) {

    addActivity(
        "PERSONNEL",
        `Communication channel opened with ${teamId}.`,
        "INFO"
    );


    showSimulationNotification(
        "CONTACT",
        `Contacting ${teamId}...`
    );

}


function acknowledgeEmergency(
    message
) {

    addActivity(
        "EMERGENCY",
        `Emergency acknowledged: ${message}.`,
        "ACTION"
    );


    showSimulationNotification(
        "EMERGENCY",
        "Incident acknowledged."
    );


    refreshCurrentPage();

}


function aiCheckIn(
    teamId
) {

    checkInTeam(teamId);

}


function aiAssetAction(
    assetId
) {

    scheduleMaintenance(assetId);

}


function aiInventoryAction(
    itemName,
    quantity
) {

    const item =
        operationalData.inventory.find(
            inventoryItem =>
                inventoryItem.name === itemName
        );


    if (!item) return;


    addActivity(
        "AI AUTOMATION",
        `Replenishment order generated for ${itemName}: ${quantity} units.`,
        "ACTION"
    );


    showSimulationNotification(
        "REORDER GENERATED",
        `${quantity} units of ${itemName} requested.`
    );


    refreshCurrentPage();

}


function aiCargoAction(
    cargoId
) {

    const cargo =
        operationalData.cargo.find(
            item =>
                item.id === cargoId
        );


    if (!cargo) return;


    addActivity(
        "AI AUTOMATION",
        `${cargo.id} logistics inspection initiated.`,
        "ACTION"
    );


    showSimulationNotification(
        "CARGO INSPECTION",
        `${cargo.id} inspection initiated.`
    );


    refreshCurrentPage();

}


/* ============================================================
   CURRENT PAGE REFRESH
   ============================================================ */

function refreshCurrentPage() {

    const active =
        document.querySelector(
            ".nav-item.active"
        );


    if (!active) {

        showOverview();

        return;

    }


    navigateTo(
        active.dataset.page,
        false
    );

}


/* ============================================================
   NAVIGATION
   ============================================================ */

function navigateTo(
    page,
    updateActive = true
) {

    if (updateActive) {

        document
            .querySelectorAll(".nav-item")
            .forEach(
                item => {

                    item.classList.remove(
                        "active"
                    );

                }
            );


        const selected =
            document.querySelector(
                `.nav-item[data-page="${page}"]`
            );


        if (selected) {

            selected.classList.add(
                "active"
            );

        }

    }


    switch (page) {

        case "overview":

            showOverview();

            break;


        case "expedition":

            showExpedition();

            break;


        case "cargo":

            showCargo();

            break;


        case "inventory":

            showInventory();

            break;


        case "assets":

            showAssets();

            break;


        case "personnel":

            showPersonnel();

            break;


        case "emergency":

            showEmergency();

            break;


        case "automation":

            showAutomation();

            break;


        case "ai-advisor":

            showAIAdvisor();

            break;


        case "ai-risk":

            showAIRiskAnalysis();

            break;


        case "simulator":

            showMissionSimulator();

            break;


        case "activity":

            showActivityLog();

            break;


        default:

            showOverview();

    }

}


/* ============================================================
   NAVIGATION CLICK HANDLER
   ============================================================ */

document.addEventListener(
    "click",
    function(event) {

        const navItem =
            event.target.closest(
                ".nav-item"
            );


        if (!navItem) {

            return;

        }


        /*
         * VERY IMPORTANT:
         * Prevent href="#" from
         * reloading/jumping the page.
         */

        event.preventDefault();


        const page =
            navItem.dataset.page;


        if (!page) {

            return;

        }


        navigateTo(page);

    }
);


/* ============================================================
   AUTOMATIC MISSION SIMULATION
   ============================================================ */

function simulateMission() {

    const event =
        Math.floor(
            Math.random() * 5
        );


    if (event === 0) {

        const asset =
            operationalData.assets[
                Math.floor(
                    Math.random() *
                    operationalData.assets.length
                )
            ];


        if (asset) {

            addActivity(
                "TELEMETRY",
                `${asset.id} telemetry packet received from ${asset.location}.`,
                "INFO"
            );

        }

    }


    if (event === 1) {

        const assets =
            operationalData.assets.filter(
                asset =>
                    asset.status ===
                    "OPERATIONAL"
            );


        if (
            assets.length &&
            Math.random() > .5
        ) {

            const asset =
                assets[
                    Math.floor(
                        Math.random() *
                        assets.length
                    )
                ];


            asset.status =
                "WARNING";


            addActivity(
                "AI ENGINE",
                `${asset.id} condition changed to WARNING.`,
                "ACTION"
            );

        }

    }


    if (event === 2) {

        const items =
            operationalData.inventory.filter(
                item =>
                    item.available > 0
            );


        if (items.length) {

            const item =
                items[
                    Math.floor(
                        Math.random() *
                        items.length
                    )
                ];


            item.available =
                Math.max(
                    0,
                    item.available - 1
                );


            addActivity(
                "INVENTORY",
                `${item.name} consumption detected. ${item.available} units remaining.`,
                "ACTION"
            );

        }

    }


    if (event === 3) {

        const teams =
            operationalData.personnel.filter(
                team =>
                    team.status ===
                    "AVAILABLE"
            );


        if (
            teams.length &&
            Math.random() > .65
        ) {

            const team =
                teams[
                    Math.floor(
                        Math.random() *
                        teams.length
                    )
                ];


            team.status =
                "CHECK-IN DUE";


            addActivity(
                "PERSONNEL",
                `${team.id} check-in monitoring activated.`,
                "CRITICAL"
            );

        }

    }


    if (event === 4) {

        const shipments =
            operationalData.cargo.filter(
                cargo =>
                    cargo.status ===
                    "IN TRANSIT"
            );


        if (
            shipments.length &&
            Math.random() > .65
        ) {

            const shipment =
                shipments[
                    Math.floor(
                        Math.random() *
                        shipments.length
                    )
                ];


            shipment.status =
                "AT RISK";


            addActivity(
                "CARGO",
                `${shipment.id} flagged as AT RISK.`,
                "CRITICAL"
            );

        }

    }


    /*
     * Only refresh automatically when
     * the user is currently on Overview.
     *
     * This prevents the application
     * from suddenly changing pages.
     */

    const active =
        document.querySelector(
            ".nav-item.active"
        );


    if (
        active &&
        active.dataset.page ===
        "overview"
    ) {

        showOverview();

    }

}




/* ============================================================
   START POLAROPS
   ============================================================ */

initializeActivityLog();

showOverview();


/*
 * Mission simulation runs every 10 seconds.
 */

setInterval(
    simulateMission,
    10000
);


let automationRunning = false;

function executeAutomationImpact(type) {

    let actions = 0;
    const impactMessages = [];

    const gen07 = operationalData.assets.find(
        asset => asset.id === "GEN-07"
    );

    const fuelPump = operationalData.inventory.find(
        item => item.name === "Fuel Pump"
    );

    const hydraulicBelt = operationalData.inventory.find(
        item => item.name === "Hydraulic Belt"
    );

    const team04 = operationalData.personnel.find(
        team => team.id === "TEAM-04"
    );

    const cargo104 = operationalData.cargo.find(
        cargo => cargo.id === "CARGO-104"
    );

    const cargo107 = operationalData.cargo.find(
        cargo => cargo.id === "CARGO-107"
    );

    const record = (typeName, message, priority = "ACTION") => {
        addActivity(typeName, message, priority);
        addAutomationFeedEvent(typeName, message, priority === "CRITICAL" ? "CRITICAL" : "ACTION");
    };

    /* TELEMETRY → ASSET */
    if (type === "TELEMETRY") {

        if (gen07 && gen07.status === "WARNING") {
            gen07.status = "OPERATIONAL";
            actions++;

            const message = "GEN-07 telemetry warning cleared and asset returned to OPERATIONAL.";
            record("ASSET", message);
            impactMessages.push(message);
        }

    }

    /* MAINTENANCE → ASSET + INVENTORY + CARGO */
    else if (type === "MAINTENANCE") {

        if (gen07 && gen07.status === "WARNING") {

            gen07.status = "OPERATIONAL";
            actions++;

            if (fuelPump && fuelPump.available > 0) {
                fuelPump.available -= 1;
                actions++;

                const message = `Fuel Pump consumed for ${gen07.id}. Inventory synchronized: ${fuelPump.available} unit(s) remaining.`;
                record("INVENTORY", message);
                impactMessages.push(message);
            }

            if (cargo104) {
                cargo104.status = "DISPATCHED";
                actions++;

                const message = `${cargo104.id} linked to maintenance logistics and marked DISPATCHED.`;
                record("CARGO", message);
                impactMessages.push(message);
            }

            const message = `${gen07.id} maintenance response completed. Asset returned to OPERATIONAL.`;
            record("ASSET", message);
            impactMessages.push(message);
        }

    }

    /* INVENTORY → INVENTORY + CARGO */
    else if (type === "INVENTORY") {

        if (hydraulicBelt && hydraulicBelt.available <= hydraulicBelt.reorderLevel) {

            hydraulicBelt.available += 6;
            actions++;

            const message = `Hydraulic Belt replenished by 6 units. New available stock: ${hydraulicBelt.available}.`;
            record("INVENTORY", message);
            impactMessages.push(message);

            if (cargo107) {
                cargo107.status = "REPLENISHMENT PLANNED";
                actions++;

                const cargoMessage = `${cargo107.id} linked to the replenishment workflow.`;
                record("CARGO", cargoMessage);
                impactMessages.push(cargoMessage);
            }
        }

    }

    /* EMERGENCY → PERSONNEL + EMERGENCY LOG */
    else if (type === "EMERGENCY") {

        if (team04 && team04.status === "CHECK-IN DUE") {

            team04.status = "AVAILABLE";
            actions++;

            const message = `${team04.id} safety verification completed. Personnel status updated to AVAILABLE.`;
            record("PERSONNEL", message, "CRITICAL");
            impactMessages.push(message);
        }

    }

    /* FULL → ALL MODULES */
    else if (type === "FULL") {

        if (team04 && team04.status === "CHECK-IN DUE") {
            team04.status = "AVAILABLE";
            actions++;
            const message = `${team04.id} safety verification completed.`;
            record("PERSONNEL", message, "CRITICAL");
            impactMessages.push(message);
        }

        if (gen07 && gen07.status === "WARNING") {
            gen07.status = "OPERATIONAL";
            actions++;
            const message = `${gen07.id} maintenance warning cleared and asset returned to OPERATIONAL.`;
            record("ASSET", message);
            impactMessages.push(message);
        }

        if (fuelPump && fuelPump.available > 0 && gen07) {
            fuelPump.available -= 1;
            actions++;
            const message = `Fuel Pump inventory synchronized after maintenance. ${fuelPump.available} unit(s) remaining.`;
            record("INVENTORY", message);
            impactMessages.push(message);
        }

        if (hydraulicBelt && hydraulicBelt.available <= hydraulicBelt.reorderLevel) {
            hydraulicBelt.available += 6;
            actions++;
            const message = `Hydraulic Belt replenishment completed. New available stock: ${hydraulicBelt.available}.`;
            record("INVENTORY", message);
            impactMessages.push(message);
        }

        if (cargo104 && gen07) {
            cargo104.status = "DISPATCHED";
            actions++;
            const message = `${cargo104.id} synchronized with the automated maintenance workflow.`;
            record("CARGO", message);
            impactMessages.push(message);
        }
    }

    const summary = impactMessages.length
        ? `${type} automation completed with ${actions} cross-module action(s).`
        : `${type} automation scan completed. No state change was required.`;

    return summary;
}


function runAutomationTest(type) {

    if (automationRunning) {
        addAutomationFeedEvent(
            "AUTOMATION ENGINE",
            "An automation cycle is already running. Waiting for completion.",
            "INFO"
        );
        return;
    }

    automationRunning = true;

    const configs = {
        TELEMETRY: {
            title: "TELEMETRY MONITORING",
            icon: "◉",
            detect: "Telemetry anomaly detected on GEN-07",
            analyze: "Analyzing generator condition and live telemetry",
            decide: "Recovery rule selected for GEN-07",
            act: "Automated recovery command executed",
            color: "var(--accent)"
        },

        MAINTENANCE: {
            title: "PREDICTIVE MAINTENANCE",
            icon: "⚙",
            detect: "GEN-07 maintenance warning detected",
            analyze: "Checking asset condition and required spare",
            decide: "Maintenance response selected",
            act: "Maintenance action scheduled automatically",
            color: "var(--yellow)"
        },

        INVENTORY: {
            title: "INVENTORY REPLENISHMENT",
            icon: "▣",
            detect: "Critical spare stock threshold detected",
            analyze: "Checking Hydraulic Belt availability",
            decide: "Replenishment rule activated",
            act: "Automatic replenishment order generated",
            color: "var(--accent)"
        },

        EMERGENCY: {
            title: "EMERGENCY RESPONSE",
            icon: "⚠",
            detect: "TEAM-04 check-in condition detected",
            analyze: "Evaluating personnel safety condition",
            decide: "Safety verification protocol selected",
            act: "Automated personnel verification initiated",
            color: "var(--red)"
        },

        FULL: {
            title: "FULL AUTOMATION CYCLE",
            icon: "⚡",
            detect: "Scanning assets, inventory and personnel",
            analyze: "Correlating all active operational conditions",
            decide: "Prioritizing autonomous response actions",
            act: "Executing complete automation cycle",
            color: "var(--green)"
        }
    };

    const config = configs[type] || configs.FULL;

    /* ------------------------------------------------------------
       Create the automation execution overlay.
       ------------------------------------------------------------ */

    let overlay = document.getElementById("automation-execution-overlay");

    if (!overlay) {

        overlay = document.createElement("div");

        overlay.id = "automation-execution-overlay";

        overlay.innerHTML = `
            <div class="automation-execution-card">

                <div class="automation-execution-header">

                    <div class="automation-execution-icon">
                        ${config.icon}
                    </div>

                    <div>
                        <div class="automation-execution-kicker">
                            POLAROPS AUTONOMOUS ENGINE
                        </div>

                        <h2 id="automation-execution-title">
                            ${config.title}
                        </h2>

                        <p id="automation-execution-status">
                            Initializing automation sequence...
                        </p>
                    </div>

                    <button
                        class="automation-execution-close"
                        onclick="closeAutomationExecution()"
                        aria-label="Close">
                        ×
                    </button>

                </div>

                <div class="automation-execution-pipeline">

                    <div class="execution-step" id="execution-detect">
                        <span class="execution-step-number">01</span>
                        <div>
                            <strong>DETECT</strong>
                            <p>${config.detect}</p>
                        </div>
                        <span class="execution-state">WAITING</span>
                    </div>

                    <div class="execution-connector"></div>

                    <div class="execution-step" id="execution-analyze">
                        <span class="execution-step-number">02</span>
                        <div>
                            <strong>ANALYZE</strong>
                            <p>${config.analyze}</p>
                        </div>
                        <span class="execution-state">WAITING</span>
                    </div>

                    <div class="execution-connector"></div>

                    <div class="execution-step" id="execution-decide">
                        <span class="execution-step-number">03</span>
                        <div>
                            <strong>DECIDE</strong>
                            <p>${config.decide}</p>
                        </div>
                        <span class="execution-state">WAITING</span>
                    </div>

                    <div class="execution-connector"></div>

                    <div class="execution-step" id="execution-act">
                        <span class="execution-step-number">04</span>
                        <div>
                            <strong>ACT</strong>
                            <p>${config.act}</p>
                        </div>
                        <span class="execution-state">WAITING</span>
                    </div>

                </div>

                <div class="automation-execution-footer">

                    <span>
                        <span class="status-dot"></span>
                        AUTONOMOUS EXECUTION
                    </span>

                    <strong id="automation-execution-result">
                        PROCESSING
                    </strong>

                </div>

            </div>
        `;

        document.body.appendChild(overlay);
    }

    /* ------------------------------------------------------------
       Add the visual execution styles once.
       ------------------------------------------------------------ */

    if (!document.getElementById("automation-execution-styles")) {

        const style = document.createElement("style");

        style.id = "automation-execution-styles";

        style.textContent = `
            #automation-execution-overlay {
                position: fixed;
                inset: 0;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 24px;
                background: rgba(2, 8, 16, .82);
                backdrop-filter: blur(10px);
            }

            .automation-execution-card {
                width: min(900px, 100%);
                max-height: 90vh;
                overflow-y: auto;
                padding: 26px;
                border: 1px solid var(--border);
                border-radius: 12px;
                background: var(--bg-panel);
                box-shadow: 0 25px 80px rgba(0,0,0,.45);
                animation: automationCardIn .25s ease;
            }

            @keyframes automationCardIn {
                from {
                    opacity: 0;
                    transform: translateY(15px) scale(.98);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .automation-execution-header {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .automation-execution-icon {
                width: 48px;
                height: 48px;
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 10px;
                background: var(--accent-soft);
                color: var(--accent);
                font-size: 21px;
            }

            .automation-execution-kicker {
                color: var(--accent);
                font-size: 6px;
                font-weight: 800;
                letter-spacing: 1.4px;
            }

            .automation-execution-header h2 {
                margin-top: 5px;
                font-size: 15px;
            }

            .automation-execution-header p {
                margin-top: 5px;
                color: var(--text-muted);
                font-size: 7px;
            }

            .automation-execution-close {
                margin-left: auto;
                width: 30px;
                height: 30px;
                border: 1px solid var(--border);
                border-radius: 5px;
                background: transparent;
                color: var(--text-secondary);
                font-size: 18px;
            }

            .automation-execution-pipeline {
                margin-top: 25px;
            }

            .execution-step {
                display: grid;
                grid-template-columns: 42px minmax(0,1fr) auto;
                align-items: center;
                gap: 14px;
                min-height: 78px;
                padding: 14px 16px;
                border: 1px solid var(--border);
                border-radius: 8px;
                background: rgba(255,255,255,.015);
                opacity: .52;
                transition: .3s ease;
            }

            .execution-step.running {
                opacity: 1;
                border-color: rgba(53,199,255,.35);
                background: var(--accent-soft);
                box-shadow: 0 0 22px rgba(53,199,255,.06);
            }

            .execution-step.completed {
                opacity: 1;
                border-color: rgba(53,230,154,.28);
                background: var(--green-soft);
            }

            .execution-step-number {
                color: var(--accent);
                font-family: monospace;
                font-size: 8px;
                font-weight: 800;
            }

            .execution-step strong {
                font-size: 9px;
            }

            .execution-step p {
                margin-top: 5px;
                color: var(--text-muted);
                font-size: 7px;
                line-height: 1.5;
            }

            .execution-state {
                padding: 5px 8px;
                border-radius: 4px;
                background: rgba(255,255,255,.04);
                color: var(--text-muted);
                font-size: 5px;
                font-weight: 800;
                letter-spacing: .6px;
            }

            .execution-step.running .execution-state {
                background: var(--accent-soft);
                color: var(--accent);
            }

            .execution-step.completed .execution-state {
                background: var(--green-soft);
                color: var(--green);
            }

            .execution-connector {
                width: 1px;
                height: 20px;
                margin-left: 21px;
                background: var(--border);
            }

            .automation-execution-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 15px;
                margin-top: 22px;
                padding-top: 16px;
                border-top: 1px solid var(--border);
                color: var(--text-muted);
                font-size: 6px;
                font-weight: 800;
                letter-spacing: .8px;
            }

            .automation-execution-footer > span {
                display: flex;
                align-items: center;
                gap: 7px;
            }

            .automation-execution-footer .status-dot {
                width: 6px;
                height: 6px;
            }

            #automation-execution-result {
                color: var(--accent);
            }

            .live-automation-feed-panel {
                overflow: hidden;
            }

            .automation-feed-list {
                padding: 0 20px;
                max-height: 360px;
                overflow-y: auto;
            }

            .automation-feed-row {
                display: grid;
                grid-template-columns: 65px 115px minmax(0,1fr);
                align-items: center;
                gap: 14px;
                min-height: 68px;
                border-bottom: 1px solid rgba(255,255,255,.05);
                animation: automationFeedIn .25s ease;
            }

            .automation-feed-row:last-child {
                border-bottom: none;
            }

            @keyframes automationFeedIn {
                from { opacity: 0; transform: translateY(-6px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .automation-feed-time {
                color: var(--text-muted);
                font-family: monospace;
                font-size: 7px;
            }

            .automation-feed-source {
                width: max-content;
                padding: 5px 8px;
                border-radius: 4px;
                background: var(--accent-soft);
                color: var(--accent);
                font-size: 6px;
                font-weight: 800;
                letter-spacing: .6px;
            }

            .automation-feed-message {
                min-width: 0;
            }

            .automation-feed-message strong {
                display: block;
                font-size: 8px;
                line-height: 1.4;
            }

            .automation-feed-message span {
                display: inline-block;
                margin-top: 4px;
                color: var(--text-muted);
                font-size: 5px;
                font-weight: 800;
                letter-spacing: .7px;
            }

            .automation-feed-row.action .automation-feed-source {
                background: var(--yellow-soft);
                color: var(--yellow);
            }

            .automation-feed-row.critical .automation-feed-source {
                background: var(--red-soft);
                color: var(--red);
            }

            .automation-feed-row.completed .automation-feed-source {
                background: var(--green-soft);
                color: var(--green);
            }

            .automation-feed-empty {
                padding: 35px 10px;
                text-align: center;
                color: var(--text-muted);
                font-size: 7px;
            }

            .automation-intelligence-panel {
                padding: 20px;
            }

            .automation-intelligence-summary {
                display: grid;
                grid-template-columns: 48px minmax(0,1fr) auto;
                align-items: center;
                gap: 16px;
                padding: 18px;
                border: 1px solid var(--border);
                border-radius: 10px;
                background: rgba(255,255,255,.015);
            }

            .automation-intelligence-summary.critical {
                border-color: rgba(255,80,80,.35);
                background: var(--red-soft);
            }

            .automation-intelligence-summary.high {
                border-color: rgba(255,190,60,.30);
                background: rgba(255,190,60,.05);
            }

            .automation-intelligence-summary.medium {
                border-color: rgba(53,199,255,.30);
                background: var(--accent-soft);
            }

            .automation-intelligence-icon {
                width: 46px;
                height: 46px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 10px;
                background: rgba(255,255,255,.05);
                font-size: 21px;
            }

            .automation-intelligence-kicker {
                color: var(--accent);
                font-size: 6px;
                font-weight: 800;
                letter-spacing: 1px;
            }

            .automation-intelligence-main h3 {
                margin-top: 6px;
                font-size: 11px;
                line-height: 1.5;
            }

            .automation-intelligence-main p {
                margin-top: 5px;
                color: var(--text-muted);
                font-size: 7px;
                line-height: 1.5;
            }

            .automation-confidence {
                min-width: 85px;
                text-align: right;
            }

            .automation-confidence span {
                display: block;
                color: var(--text-muted);
                font-size: 5px;
                font-weight: 800;
                letter-spacing: .8px;
            }

            .automation-confidence strong {
                display: block;
                margin-top: 5px;
                color: var(--green);
                font-size: 17px;
            }

            .automation-intelligence-grid {
                display: grid;
                grid-template-columns: repeat(3, minmax(0,1fr)) auto;
                gap: 10px;
                margin-top: 12px;
            }

            .automation-intelligence-grid > div {
                padding: 12px;
                border: 1px solid var(--border);
                border-radius: 7px;
                background: rgba(255,255,255,.012);
            }

            .automation-intelligence-grid span {
                display: block;
                color: var(--text-muted);
                font-size: 5px;
                font-weight: 800;
                letter-spacing: .7px;
            }

            .automation-intelligence-grid strong {
                display: block;
                margin-top: 6px;
                font-size: 8px;
            }

            .ai-risk-critical { color: var(--red); }
            .ai-risk-high { color: var(--yellow); }
            .ai-risk-medium { color: var(--accent); }
            .ai-risk-monitor { color: var(--green); }

            .automation-ai-action {
                min-width: 170px;
                align-self: stretch;
            }

            @media (max-width: 800px) {
                .automation-intelligence-summary {
                    grid-template-columns: 44px minmax(0,1fr);
                }

                .automation-confidence {
                    grid-column: 2;
                    text-align: left;
                }

                .automation-intelligence-grid {
                    grid-template-columns: 1fr 1fr;
                }

                .automation-ai-action {
                    grid-column: 1 / -1;
                }
            }

            @media (max-width: 650px) {
                #automation-execution-overlay {
                    padding: 12px;
                }

                .automation-execution-card {
                    padding: 18px;
                }

                .execution-step {
                    grid-template-columns: 32px minmax(0,1fr);
                }

                .execution-state {
                    grid-column: 2;
                    justify-self: start;
                }
            }
        `;

        document.head.appendChild(style);
    }

    overlay.style.display = "flex";

    const steps = [
        document.getElementById("execution-detect"),
        document.getElementById("execution-analyze"),
        document.getElementById("execution-decide"),
        document.getElementById("execution-act")
    ];

    const status = document.getElementById(
        "automation-execution-status"
    );

    const result = document.getElementById(
        "automation-execution-result"
    );

    const wait = ms =>
        new Promise(resolve => setTimeout(resolve, ms));

    const activateStep = async (index, text) => {

        const step = steps[index];

        if (!step) return;

        step.classList.add("running");

        const state =
            step.querySelector(".execution-state");

        if (state) {
            state.textContent = "RUNNING";
        }

        status.textContent = text;

        await wait(750);

        step.classList.remove("running");
        step.classList.add("completed");

        if (state) {
            state.textContent = "COMPLETED";
        }
    };

    (async function executeAutomation() {

        result.textContent = "EXECUTING";

        await activateStep(
            0,
            config.detect
        );
        addAutomationFeedEvent("DETECT", config.detect, "INFO");

        await activateStep(
            1,
            config.analyze
        );
        addAutomationFeedEvent("ANALYZER", config.analyze, "ACTION");

        await activateStep(
            2,
            config.decide
        );
        addAutomationFeedEvent("DECISION ENGINE", config.decide, "ACTION");

        await activateStep(
            3,
            config.act
        );
        addAutomationFeedEvent("ACTION", config.act, type === "EMERGENCY" ? "CRITICAL" : "ACTION");

        /*
         * Execute the real cross-module operational impact only after
         * the visual decision pipeline completes.
         */

        const message = executeAutomationImpact(type);

        addActivity(
            "AUTOMATION",
            message,
            type === "EMERGENCY" ? "CRITICAL" : "ACTION"
        );

        addAutomationFeedEvent(
            "AUTOMATION",
            message,
            "COMPLETED"
        );

        result.textContent = "COMPLETED";
        result.style.color = "var(--green)";

        status.textContent =
            "Automation cycle completed successfully.";

        await wait(1000);

        closeAutomationExecution();

        automationRunning = false;

        refreshCurrentPage();

    })();
}


function closeAutomationExecution() {

    const overlay =
        document.getElementById(
            "automation-execution-overlay"
        );

    if (overlay) {
        overlay.style.display = "none";
    }

    if (automationRunning && !document.querySelector(".automation-execution-card")) {
        automationRunning = false;
    }

}

