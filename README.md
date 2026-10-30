# 🌡️ Carte Pompe à Chaleur (PAC) · Synoptique

Carte Lovelace personnalisée pour Home Assistant permettant de visualiser et contrôler l'état de votre **Pompe à Chaleur (PAC)** en temps réel, grâce à un schéma synoptique dynamique et animé.

---

## 📸 Ce qu'affiche la carte

* **Schémas synoptiques dynamiques :** Changement visuel automatique (GIFs animés) selon le mode de fonctionnement (Zone 1, Zone 2, ECS / Eau Chaude Sanitaire, ou combiné) ;
* **Suivi des températures :** Température extérieure, consignes de chauffage, températures ambiantes et d'eau ;
* **État de fonctionnement :** Indication claire des cycles de chauffe, de la puissance et du statut de la PAC ;
* **Incrustation d'images :** Visuel clair avec gestion intégrée des assets graphiques.
* **Propres images :** Possibilité de mettre vos images.
  
---

## ⚙️ Prérequis

Avant d'utiliser cette carte, assurez-vous d'avoir :
1. Un serveur **Home Assistant** fonctionnel avec **HACS** installé (recommandé).
2. Vos entités PAC correctement configurées (`sensor` de température, `climate` ou `switch` de statut/mode).

---

## 🛠️ Installation

### Option 1 : Via HACS (Recommandé)

1. Ouvrez **HACS** dans votre interface Home Assistant.
2. Allez dans la section **Tableaux de bord** (*Front-end*).
3. Cliquez sur les trois petits points **⋮** en haut à droite, puis sélectionnez **Dépôts personnalisés** (*Custom repositories*).
4. Ajoutez l'URL de ce dépôt :
   ```text
   https://github.com/AlainEspe/ha-carte-PAC
   ```
5. Choisissez la catégorie **Tableau de bord** (*Dashboard*).
6. Cliquez sur **Ajouter**, puis recherchez et téléchargez **Carte Pompe à Chaleur**.
7. Rechargez la page de votre navigateur (`Ctrl` + `F5`).

### Option 2 : Installation Manuelle

1. Téléchargez le fichier `pac-synoptic-card.js` ainsi que le dossier d'images (`.gif`, `.jpeg`) depuis ce dépôt.
2. Copiez l'ensemble dans votre dossier Home Assistant : `/config/www/community/ha-carte-PAC/`.
3. Allez dans **Paramètres** → **Tableaux de bord** → **⋮** → **Ressources** → **Ajouter une ressource**.
4. Saisissez :
   * **URL :** `/local/community/ha-carte-PAC/pac-synoptic-card.js?v=1.0.0`
   * **Type :** Module JavaScript
5. Rechargez votre navigateur (`Ctrl` + `F5`).

---

## ⚙️ Configuration

La carte peut être ajoutée via l'interface graphique de Lovelace ou directement en YAML :

### Exemple de configuration YAML

```yaml
type: custom:pac-synoptic-card
title: "Synoptique Pompe à Chaleur"
entity_status: sensor.pac_statut
entity_temp_ext: sensor.temperature_exterieure
entity_temp_int: sensor.temperature_salon
entity_climate: climate.pompe_a_chaleur
```

> ⚠️ **Note :** Pensez à remplacer les noms d'entités ci-dessus par les identifiants réels de vos capteurs dans Home Assistant.

---

## 🧩 Fichiers et Synoptiques inclus

Le dépôt inclut plusieurs visuels animés gérant automatiquement vos différents modes d'exploitation :
* `synoptique_ecs.gif` : Mode Eau Chaude Sanitaire
* `synoptique_zone1.gif` : Chauffage Zone 1
* `synoptique_zone2.gif` : Chauffage Zone 2
* `synoptique_zones1et2.gif` : Chauffage combiné Zones 1 & 2
* `essai_pac.jpeg` : Aperçu global de la carte

---

## 🤝 Support & Contribution

Si vous constatez un problème ou souhaitez suggérer une amélioration :
* Ouvrez un **Issue** sur le dépôt GitHub.
* N'hésitez pas à proposer un **Pull Request** pour contribuer au code !
<img width="705" height="376" alt="essai_pac" src="https://github.com/user-attachments/assets/07b5f9ad-92ec-424f-9a2e-0c616a243ea3" />

<img width="705" height="376" alt="synoptique_zones1et2" src="https://github.com/user-attachments/assets/b621a40e-43f2-44c9-b85a-17066e43194b" />

<img width="705" height="376" alt="synoptique_ecs" src="https://github.com/user-attachments/assets/5938acc5-3b4b-4288-b066-7de42f3bfc5e" />
