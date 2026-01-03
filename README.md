# SimControl 2026 🚀

**Contrôleur web moderne pour simulateurs** par liveweeeb

[![Version](https://img.shields.io/badge/version-beta--2026.01.03--1-blue)](https://github.com/liveweeeb/SimControl)
[![Python](https://img.shields.io/badge/python-3.8+-green)](https://python.org)



## 🚀 Installation rapide

```bash
# Cloner le projet
git clone https://github.com/liveweeeb/SimControl.git
cd SimControl

# Installer les dépendances
pip install -r requirements.txt

# Lancer SimControl
python app.py
```

**Accès** : http://IP:3001

> 💡 **Recommandé** : Utilisation sur mobile/tablette en mode paysage

## 🎮 Utilisation

### 1. Configuration initiale
- Cliquez sur "🎛️ Modifier Boutons"
- Configurez vos boutons (35 emplacements disponibles)
- Définissez les règles si nécessaire

### 2. Lancement
- Cliquez sur "🚀 Démarrer SimControl"
- Votre controlleur est prêt !

## ⚙️ Configuration avancée

### Structure des boutons
```js
{
    id: 1,                    // Position (1-35)
    title: "Batterie",        // Nom descriptif
    label: "🔋",              // Emoji/texte affiché
    key: "w",                 // Touche clavier
    toggleable: true,         // Toggle ou poussoir
    color1: "#ff0000",        // Couleur OFF
    color2: "#00ff00",        // Couleur ON
    holdTime: 2500            // Temps maintien (ms)
}
```

### Règles automatiques
```js
const rules = {
    // Désactivation automatique
    autodisable: [
        {
            trigger: 1,           // Bouton déclencheur
            targets: [2, 3],      // Boutons à désactiver
            condition: "off"      // Condition (on/off)
        }
    ],
    // Blocage conditionnel
    stopmac: [
        {
            trigger: 1,           // Bouton déclencheur
            targets: [4, 5],      // Boutons à bloquer
            condition: "off"      // Quand bloquer
        }
    ]
};
```

## 🔄 Auto-Update

SimControl se met à jour automatiquement au démarrage :
- ✅ Code source toujours à jour
- ✅ Nouvelles fonctionnalités instantanées
- ✅ Corrections de bugs automatiques
- ✅ Configuration utilisateur préservée

## 🛠️ Développement

**Créé avec ❤️ par liveweeeb**



## 🤝 Contribution

**Aide à la conception** : Mr_Ewann 🚂🚃


**SimControl 2026**