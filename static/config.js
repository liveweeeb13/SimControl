const buttons = [
    {
        id: 1, // Numero du bouton
        title: "Batterie", // Nom du bouton (nom affiché dans l'interface)
        label: "🔋", // Nom affiché
        key: "w", // Touche associée
        toggleable: true, // Est-ce que le bouton est un toggle (true) ou un bouton poussoir (false)
        color1: "red", // Couleur quand le bouton est off
        color2: "green", // Couleur quand le bouton est on
        holdTime: 2500 // Temps en ms à maintenir la touche pour activer l'action 
    },
    {
        id: 2,
        title: "Power",
        label: "⏻",
        key: "v",
        toggleable: true,
        color1: "red",
        color2: "green"
    },
    {
        id: 3,
        title: "Alimentation",
        label: "🔌",
        key: "p",
        toggleable: true,
        color1: "red",
        color2: "green"
    }
];

const rules = {
    // AUTODISABLE : Désactive automatiquement d'autres boutons
    autodisable: [
        {
            trigger: 1, // ID du bouton déclencheur
            targets: [2], // IDs des boutons à modifier automatiquement
            condition: "off" // A NE PAS CHANGER
        }
    ],
    // STOPMAC : Bloque/débloque des boutons selon l'état d'un autre
    stopmac: {
        trigger: 1, // ID du bouton déclencheur 
        targets: [2, 3], // IDs des boutons à bloquer/débloquer 
        condition: "off" // Quand le trigger est "off", les targets sont bloqués (non-cliquables)
    } 
};