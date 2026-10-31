/**
 * ecodan-synoptic-card
 * Synoptique d'une PAC Mitsubishi Ecodan : image de fond + valeurs
 * positionnées en pourcentage de la carte. Entités choisies par l'utilisateur
 * (YAML ou éditeur visuel).
 */

// ---------------------------------------------------------------
// 1. Les champs affichables et leur position par défaut
//   top / left : % de l'image    size : % de la largeur de la carte
// ---------------------------------------------------------------
const R = { left: 92, size: 1.3, right: true }; // colonne de droite
const B = { top: 95, size: 1.2 };                // ligne du bas

const FIELDS = {
  outdoor_temp: { top: 16, left: 20, size: 2.2, bold: true },
  weather: { top: 18, left: 10, size: 3.5, icon: true },
  
  // Étage (Zone 1) affiché en haut (positions 19, 23, 27)
  z1_flow: { ...R, top: 19 },
  z1_target: { ...R, top: 23 },
  z1_room: { ...R, top: 27 },
  
  // RDC (Zone 2) affiché en bas (positions 45, 49, 53)
  z2_flow: { ...R, top: 45 },
  z2_target: { ...R, top: 49 },
  z2_room: { ...R, top: 53 },

  dhw_current: { ...R, top: 71 },
  dhw_target: { ...R, top: 76 },
  dhw_force: { top: 82, left: 89, size: 3, icon: true },
  refrigerant: { top: 84.5, left: 20, size: 1.3, right: true },
  mode: { ...B, left: 31 },
  compressor: { ...B, left: 43 },
  hvac_action: { ...B, left: 55 },
  firmware: { ...B, left: 66.5 },
  
  // Binary sensors pour les circulateurs (utilisés en arrière-plan pour les GIFs, sans affichage d'icône)
  z1_pump: {},
  z2_pump: {},
};

// Noms affichés dans l'éditeur visuel
const LABELS = {
  image: "Image de fond par défaut",
  image_ecs: "GIF : ECS seule",
  image_zone_1: "GIF : Zone 1 seule",
  image_zone_2: "GIF : Zone 2 seule",
  image_zones_1_2: "GIF : Zone 1 + Zone 2",
  max_height: "Hauteur maximale (ex. 80vh ; vide = toute la hauteur disponible)",
  
  outdoor_temp: "Température extérieure",
  weather: "Météo actuelle (entité weather)",
  
  z1_flow: "Zone 1 (Étage) – Départ",
  z1_target: "Zone 1 (Étage) – Consigne",
  z1_room: "Zone 1 (Étage) – Température actuelle",
  z2_flow: "Zone 2 (RDC) – Départ",
  z2_target: "Zone 2 (RDC) – Consigne",
  z2_room: "Zone 2 (RDC) – Température actuelle",

  dhw_current: "ECS – Température du ballon",
  dhw_target: "ECS – Consigne",
  dhw_force: "ECS – Forcer l'ECS (interrupteur)",
  refrigerant: "Fluide frigorigène (liquide)",
  mode: "Mode de fonctionnement",
  compressor: "Fréquence du compresseur",
  hvac_action: "Action en cours (entité climate)",
  firmware: "Mise à jour du firmware (entité update)",
  
  z1_pump: "Binary Sensor - Circulateur Zone 1 (Étage)",
  z2_pump: "Binary Sensor - Circulateur Zone 2 (RDC)",
};

const HVAC_LABELS = {
  heating: "Chauffage",
  heat: "Chauffage",
  cooling: "Refroidissement",
  cool: "Refroidissement",
  idle: "En attente",
  off: "Éteint",
};

const WEATHER_ICONS = {
  clear_night: "mdi:weather-night",
  cloudy: "mdi:weather-cloudy",
  exceptional: "mdi:alert-circle-outline",
  fog: "mdi:weather-fog",
  hail: "mdi:weather-hail",
  lightning: "mdi:weather-lightning",
  lightning_rainy: "mdi:weather-lightning-rainy",
  partlycloudy: "mdi:weather-partly-cloudy",
  pouring: "mdi:weather-pouring",
  rainy: "mdi:weather-rainy",
  snowy: "mdi:weather-snowy",
  snowy_rainy: "mdi:weather-snowy-rainy",
  sunny: "mdi:weather-sunny",
  windy: "mdi:weather-windy",
  windy_variant: "mdi:weather-windy-variant"
};

// ---------------------------------------------------------------
// 2. La carte
// ---------------------------------------------------------------
class EcodanSynopticCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("ecodan-synoptic-card-editor");
  }

  static getStubConfig() {
    return { image: "", entities: {} };
  }

  setConfig(config) {
    this._config = { ...config, entities: config.entities || {} };
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this._build();
    if (this._hass) this.hass = this._hass;
  }

  _build() {
    const c = this._config;
    const maxH = c.max_height || "calc(100vh - var(--header-height, 56px) - 8px)";
    
    // On filtre z1_pump et z2_pump pour qu'aucun élément visuel ne soit généré pour eux sur l'image
    const fields = Object.entries(FIELDS)
      .filter(([key]) => c.entities[key] && key !== "z1_pump" && key !== "z2_pump")
      .map(([key, defaults]) => {
        const p = { ...defaults, ...(c.positions?.[key] || {}) };
        if (p.icon) {
          return `<div class="f icon" data-key="${key}"
                       style="top:${p.top}%;left:${p.left}%;--mdc-icon-size:${p.size}cqw">
                    <ha-state-icon></ha-state-icon>
                  </div>`;
        }
        const cls = ["f", p.right ? "right" : "", p.bold ? "bold" : ""].join(" ");
        return `<div class="${cls}" data-key="${key}"
                    style="top:${p.top}%;left:${p.left}%;font-size:${p.size}cqw"></div>`;
      })
      .join("");

    const image = `<img src="${c.image || ''}" alt="">`;

    this.shadowRoot.innerHTML = `
      <style>
        ha-card { background: transparent; box-shadow: none; border: none; overflow: hidden; }
        .wrap { --ratio: 1.6; --max-h: ${maxH};
                width: min(100%, calc(var(--max-h) * var(--ratio))); margin: 0 auto;
                position: relative; container-type: inline-size; line-height: 0; }
        img { width: 100%; display: block; }
        .hint { padding: 24px; line-height: 1.4; color: var(--secondary-text-color); }
        .f { position: absolute; color: #fff; white-space: nowrap; line-height: 1;
             transform: translate(-50%, -50%); }
        .f.right { transform: translate(-100%, -50%); }
        .f.bold { font-weight: bold; }
        .f { cursor: pointer; }
        .f.icon { line-height: 0; }
        .f.icon.on { color: var(--ecodan-active-color, #ff9800); }
      </style>
      <ha-card>
        <div class="wrap">${image}${fields}</div>
      </ha-card>`;

    const img = this.shadowRoot.querySelector("img");
    if (img) {
      const apply = () => {
        if (img.naturalHeight) {
          this.shadowRoot
            .querySelector(".wrap")
            .style.setProperty("--ratio", img.naturalWidth / img.naturalHeight);
        }
      };
      img.addEventListener("load", apply);
      if (img.complete) apply();
    }

    this.shadowRoot.querySelectorAll(".f").forEach((el) => {
      const key = el.dataset.key;
      
      if (key === "dhw_force") {
        let timer;
        let held = false;
        el.addEventListener("pointerdown", () => {
          held = false;
          timer = setTimeout(() => {
            held = true;
            this._moreInfo(key);
          }, 500);
        });
        ["pointerup", "pointerleave", "pointercancel"].forEach((evt) =>
          el.addEventListener(evt, () => clearTimeout(timer))
        );
        el.addEventListener("contextmenu", (ev) => ev.preventDefault());
        el.addEventListener("click", () => {
          if (!held) this._toggle(key);
        });
        return;
      }

      el.addEventListener("click", () => this._moreInfo(key));
    });
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config || !this.shadowRoot) return;

    // --- SÉLECTION DYNAMIQUE DE L'IMAGE / GIF AVEC LIENS GITHUB BRUTS ---
    const imgEl = this.shadowRoot.querySelector("img");
    if (imgEl) {
      const hvacActionState = this._config.entities.hvac_action ? hass.states[this._config.entities.hvac_action]?.attributes?.hvac_action : null;
      const dhwForceState = this._config.entities.dhw_force ? hass.states[this._config.entities.dhw_force]?.state === "on" : false;
      const isDhwActive = dhwForceState || hvacActionState === "heating_water" || hvacActionState === "heat_water";

      const z1PumpActive = this._config.entities.z1_pump ? hass.states[this._config.entities.z1_pump]?.state === "on" : false;
      const z2PumpActive = this._config.entities.z2_pump ? hass.states[this._config.entities.z2_pump]?.state === "on" : false;

      const defaultImg = this._config.image || "https://raw.githubusercontent.com/AlainEspe/ha-carte-PAC/main/images/essai_pac.jpeg";
      const defaultEcs = this._config.image_ecs || "https://raw.githubusercontent.com/AlainEspe/ha-carte-PAC/main/images/synoptique_ecs.gif";
      const defaultZ1 = this._config.image_zone_1 || "https://raw.githubusercontent.com/AlainEspe/ha-carte-PAC/main/images/synoptique_zone1.gif";
      const defaultZ2 = this._config.image_zone_2 || "https://raw.githubusercontent.com/AlainEspe/ha-carte-PAC/main/images/synoptique_zone2.gif";
      const defaultZ1Z2 = this._config.image_zones_1_2 || "https://raw.githubusercontent.com/AlainEspe/ha-carte-PAC/main/images/synoptique_zones1et2.gif";

      let targetImage = defaultImg;

      if (isDhwActive) {
        targetImage = defaultEcs;
      } else if (z1PumpActive && z2PumpActive) {
        targetImage = defaultZ1Z2;
      } else if (z2PumpActive) {
        targetImage = defaultZ2;
      } else if (z1PumpActive) {
        targetImage = defaultZ1;
      }

      if (targetImage && imgEl.getAttribute("src") !== targetImage) {
        imgEl.src = targetImage;
      }
    }

    // --- MISE À JOUR DES CHAMPS VISIBLES ---
    this.shadowRoot.querySelectorAll(".f").forEach((el) => {
      const key = el.dataset.key;
      const stateObj = hass.states[this._config.entities[key]];
      
      if (el.classList.contains("icon")) {
        const icon = el.querySelector("ha-state-icon");
        if (icon) {
          icon.hass = hass;
          if (key === "weather" && stateObj) {
            const customStateObj = {
              ...stateObj,
              attributes: {
                ...stateObj.attributes,
                icon: WEATHER_ICONS[stateObj.state] || stateObj.attributes.icon || "mdi:weather-sunny"
              }
            };
            icon.stateObj = customStateObj;
          } else {
            icon.stateObj = stateObj;
          }
        }
        el.classList.toggle("on", stateObj?.state === "on");
        return;
      }
      el.textContent = stateObj ? this._format(hass, key, stateObj) : "—";
    });
  }

  _format(hass, key, stateObj) {
    if (key === "hvac_action") {
      const action = stateObj.attributes.hvac_action;
      return HVAC_LABELS[action] ?? action ?? "—";
    }
    
    if (["z1_target", "z2_target", "dhw_target"].includes(key) && stateObj.attributes.temperature !== undefined) {
      const temp = parseFloat(stateObj.attributes.temperature);
      const unit = stateObj.attributes.unit_of_measurement || hass.config.unit_system.temperature || "";
      return `${isNaN(temp) ? stateObj.attributes.temperature : temp.toFixed(1)} ${unit}`.trim();
    }

    const val = parseFloat(stateObj.state);
    if (!isNaN(val) && (key.includes("temp") || key.includes("flow") || key.includes("current"))) {
      const unit = stateObj.attributes.unit_of_measurement ?? "";
      return `${val.toFixed(1)} ${unit}`.trim();
    }

    if (typeof hass.formatEntityState === "function") {
      return hass.formatEntityState(stateObj);
    }
    const unit = stateObj.attributes.unit_of_measurement ?? "";
    return `${stateObj.state} ${unit}`.trim();
  }

  _moreInfo(key) {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: this._config.entities[key] },
        bubbles: true,
        composed: true,
      })
    );
  }

  _toggle(key) {
    this._hass.callService("homeassistant", "toggle", {
      entity_id: this._config.entities[key],
    });
  }

  getCardSize() {
    return 6;
  }
}

// ---------------------------------------------------------------
// 3. L'éditeur visuel
// ---------------------------------------------------------------
const DOMAINS = {
  hvac_action: "climate",
  firmware: "update",
  dhw_force: "switch",
  weather: "weather",
  z1_pump: "binary_sensor",
  z2_pump: "binary_sensor",
};

const SCHEMA = [
  { name: "image", selector: { text: {} } },
  { name: "image_ecs", selector: { text: {} } },
  { name: "image_zone_1", selector: { text: {} } },
  { name: "image_zone_2", selector: { text: {} } },
  { name: "image_zones_1_2", selector: { text: {} } },
  { name: "max_height", selector: { text: {} } },
  ...Object.keys(FIELDS).map((key) => ({
    name: key,
    selector: { entity: DOMAINS[key] ? { domain: DOMAINS[key] } : {} },
  })),
];

class EcodanSynopticCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    this._render();
    if (this._form) {
      this._form.data = {
        image: config.image,
        image_ecs: config.image_ecs,
        image_zone_1: config.image_zone_1,
        image_zone_2: config.image_zone_2,
        image_zones_1_2: config.image_zones_1_2,
        max_height: config.max_height,
        ...(config.entities || {}),
      };
    }
  }

  set hass(hass) {
    this._hass = hass;
    if (this._form) this._form.hass = hass;
  }

  _render() {
    if (this._form) return;
    this._form = document.createElement("ha-form");
    this._form.schema = SCHEMA;
    this._form.computeLabel = (item) => LABELS[item.name] ?? item.name;
    this._form.hass = this._hass;
    this._form.addEventListener("value-changed", (ev) => this._changed(ev));
    this.appendChild(this._form);
  }

  _changed(ev) {
    const { image, image_ecs, image_zone_1, image_zone_2, image_zones_1_2, max_height, ...rest } = ev.detail.value;
    const entities = Object.fromEntries(
      Object.entries(rest).filter(([, value]) => value)
    );
    this._config = { 
      ...this._config, 
      image, 
      image_ecs, 
      image_zone_1, 
      image_zone_2, 
      image_zones_1_2, 
      entities 
    };
    if (max_height) this._config.max_height = max_height;
    else delete this._config.max_height;
    
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }
}

// ---------------------------------------------------------------
// 4. Enregistrement auprès de Home Assistant
// ---------------------------------------------------------------
customElements.define("ecodan-synoptic-card", EcodanSynopticCard);
customElements.define("ecodan-synoptic-card-editor", EcodanSynopticCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "ecodan-synoptic-card",
  name: "Ecodan Synoptic Card",
  description: "Synoptique d'une PAC Mitsubishi Ecodan dynamique avec binary_sensors pour les GIFs",
  preview: false,
});
