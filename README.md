# ha-carte-PAC
Carte Pompe à Chaleur (PAC) pour Home Assistant

Une carte Lovelace personnalisée permettant de visualiser et suivre le fonctionnement de votre Pompe à Chaleur (PAC) en temps réel sur Home Assistant.

📸 Fonctionnalités

Visuels animés : Affichage des schémas synoptiques animés selon l'état et le mode de fonctionnement (Zone 1, Zone 2, ECS, etc.).

Suivi en temps réel : Visualisation des températures, de la consigne et du mode de la PAC.

Interface intuitive : Intégration fluide dans le tableau de bord Lovelace.

Possibilité de mettre ses propres images.

🛠️ Installation

Option 1 : Via HACS (Recommandé)

Ouvrez HACS dans votre interface Home Assistant.

Allez dans la section Tableaux de bord (Front-end).

Cliquez sur les trois petits points en haut à droite, puis sélectionnez Dépôts personnalisés.

Ajoutez l'URL de ce dépôt :
https://github.com/AlainEspe/ha-carte-PAC

Choisissez le type Tableau de bord (ou Plugin / Lovelace).

Cliquez sur Ajouter, puis recherchez et installez la carte Carte Pompe à Chaleur.

Rechargez la page de votre navigateur.

Option 2 : Installation Manuelle

Téléchargez le fichier pac-synoptic-card.js ainsi que les fichiers d'images de ce dépôt.

Placez-les dans le dossier /config/www/community/ha-carte-PAC/ de votre serveur Home Assistant.

Dans Home Assistant, allez dans Paramètres > Tableaux de bord > Ressources (via le menu 3 points).

Ajoutez une nouvelle ressource :

URL : /local/community/ha-carte-PAC/pac-synoptic-card.js

Type : Module JavaScript (module)

⚙️ Configuration YAML

Voici un exemple basique de configuration à ajouter dans votre tableau de bord Lovelace (en mode éditeur YAML) :

type: custom:pac-synoptic-card
title: "Ma Pompe à Chaleur"
entity_status: sensor.pac_status
entity_temperature_ext: sensor.temperature_exterieure
entity_temperature_int: sensor.temperature_interieure
entity_consigne: climate.pompe_a_chaleur


Note : Adaptez les noms d'entités (sensor..., climate...) avec les entités réelles disponibles sur votre installation Home Assistant.

🤝 Contribution & Retours

Si vous rencontrez un bug ou avez une suggestion d'amélioration, n'hésitez pas à ouvrir une Issue sur le dépôt GitHub.
<img width="705" height="376" alt="essai_pac" src="https://github.com/user-attachments/assets/07b5f9ad-92ec-424f-9a2e-0c616a243ea3" />

<img width="705" height="376" alt="synoptique_zones1et2" src="https://github.com/user-attachments/assets/b621a40e-43f2-44c9-b85a-17066e43194b" />

<img width="705" height="376" alt="synoptique_ecs" src="https://github.com/user-attachments/assets/5938acc5-3b4b-4288-b066-7de42f3bfc5e" />
