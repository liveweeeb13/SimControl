#  Controlleur/StreamDeck EN DEVELOPPEMENT ACTIF

Controlleur/StreamDeck web par liveweeeb

## Installation

```bash
pip install -r requirements.txt
```

## Démarrage

```bash
python app.py
```

Puis ouvrez http://IP:3001 __*Utilisatation sur mobile ou tablette conseillé*__ 

## Configuration

## Modifiez `static/config.js` 
**Ajouter/modifier les boutons :**

```js
    {
        id: 1, // Numero du bouton
        title: "Batterie", // Nom du bouton (nom affiché dans l'interface)
        label: "🔋", // Nom affiché
        key: "w", // Touche associée
        toggleable: true, // Est-ce que le bouton est un toggle (true) ou un bouton poussoir (false)
        color1: "red", // Couleur quand le bouton est off
        color2: "green", // Couleur quand le bouton est on
        holdTime: 2500 // Temps en ms à maintenir la touche pour activer l'action (non requis)
    }
```
**Ajouter des regles**
```js
const rules = {
    autodisable: [
        {
            trigger: 1, // Quand le bouton 1 est desactivé
            targets: [2], // Bouton 2
            condition: "off" // Se met en desactive
        }
    ],
    stopmac: [2,3] // Les ID des boutons qui seront freeze dans leurs etats actuels 
};
```