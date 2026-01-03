const buttons = [
    {
        "id": 1,
        "title": "Batterie",
        "label": "\ud83d\udd0b",
        "key": "w",
        "toggleable": true,
        "color1": "red",
        "color2": "green",
        "holdTime": 2250
    },
    {
        "id": 2,
        "title": "Power",
        "label": "\ud83d\udd1b",
        "key": "v",
        "toggleable": true,
        "color1": "red",
        "color2": "green"
    },
    {
        "id": 3,
        "title": "Alimentation",
        "label": "\ud83d\udd0c",
        "key": "p",
        "toggleable": true,
        "color1": "red",
        "color2": "green"
    },
    {
        "id": 8,
        "title": "Disjoncteur1",
        "label": "\ud83d\udd38",
        "key": "t",
        "toggleable": true,
        "color1": "red",
        "color2": "green"
    },
    {
        "id": 9,
        "title": "Disjoncteur12",
        "label": "\ud83d\udd39",
        "key": "y",
        "toggleable": true,
        "color1": "red",
        "color2": "green",
        "holdTime": 2250
    },
    {
        "id": 5,
        "title": "Marcheavant",
        "label": "\u2b06\ufe0e",
        "key": "z",
        "toggleable": false,
        "color1": "#fff000",
        "color2": "#ffa500"
    },
    {
        "id": 12,
        "title": "Marchearriere",
        "label": "\u2b07\ufe0e",
        "key": "s",
        "toggleable": false,
        "color1": "#fff000",
        "color2": "#ffa500"
    },
    {
        "id": 6,
        "title": "Mode",
        "label": "+",
        "key": "k",
        "toggleable": false,
        "color1": "#fff000",
        "color2": "#ffa500"
    },
    {
        "id": 13,
        "title": "Mode2",
        "label": "-",
        "key": "j",
        "toggleable": false,
        "color1": "#fff000",
        "color2": "#ffa500"
    },
    {
        "id": 22,
        "title": "accelerer",
        "label": "\ud83d\udd3c",
        "key": "d",
        "toggleable": false,
        "color1": "#25edf7",
        "color2": "#0099ff"
    },
    {
        "id": 29,
        "title": "freiner",
        "label": "\ud83d\udd3d",
        "key": "q",
        "toggleable": false,
        "color1": "#f7b525ff",
        "color2": "#ff5100ff"
    },
    {
        "id": 10,
        "title": "urgence",
        "label": "\ud83d\udea8",
        "key": "x",
        "toggleable": true,
        "color1": "#4ff725ff",
        "color2": "#ff0000ff"
    },
    {
        "id": 11,
        "title": "signaux",
        "label": "\u26a0\ufe0f",
        "key": "a",
        "toggleable": false,
        "color1": "#d8f725ff",
        "color2": "#ff5e00ff"
    },
    {
        "id": 35,
        "title": "portedroite",
        "label": "\ud83d\udeaa",
        "key": "o",
        "toggleable": true,
        "color1": "#a9b8a6ff",
        "color2": "#ff0000ff"
    },
    {
        "id": 34,
        "title": "fermerporte",
        "label": "\ud83d\udd12",
        "key": "i",
        "toggleable": false,
        "color1": "#a9b8a6ff",
        "color2": "#ff0000ff"
    },
    {
        "id": 33,
        "title": "portegauche",
        "label": "\ud83d\udeaa",
        "key": "u",
        "toggleable": true,
        "color1": "#a9b8a6ff",
        "color2": "#ff0000ff"
    },
    {
        "id": 7,
        "title": "siffletaigue",
        "label": "\ud83d\udd0a",
        "key": "h",
        "toggleable": false,
        "color1": "#31333bff",
        "color2": "#ebe8c5ff"
    },
    {
        "id": 14,
        "title": "siffletgrave",
        "label": "\ud83d\udd09",
        "key": "b",
        "toggleable": false,
        "color1": "#31333bff",
        "color2": "#ebe8c5ff"
    },
    {
        "id": 26,
        "title": "lampe1",
        "label": "\u2600\ufe0f",
        "key": "l",
        "toggleable": true,
        "color1": "#414df3ff",
        "color2": "#cca63dff"
    },
    {
        "id": 27,
        "title": "lampe2",
        "label": "\ud83d\udc68\u200d\u2708\ufe0f",
        "key": "g",
        "toggleable": true,
        "color1": "#414df3ff",
        "color2": "#cca63dff"
    },
    {
        "id": 28,
        "title": "lampe3",
        "label": "\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66",
        "key": "\u00f9",
        "toggleable": true,
        "color1": "#414df3ff",
        "color2": "#cca63dff"
    }
];

const rules = {
    "autodisable": [
        {
            "trigger": 34,
            "targets": [
                33,
                35
            ],
            "condition": "on"
        },
        {
            "trigger": 1,
            "targets": [
                2
            ],
            "condition": "off"
        },
        {
            "trigger": 8,
            "targets": [
                9
            ],
            "condition": "off"
        }
    ],
    "stopmac": [
        {
            "trigger": 1,
            "targets": [
                2,
                3,
                7,
                14,
                26,
                27,
                28,
                33,
                34,
                35,
                22,
                29,
                8,
                9
            ],
            "condition": "off"
        },
        {
            "trigger": 2,
            "targets": [
                5,
                6,
                7,
                12,
                13,
                14
            ],
            "condition": "off"
        }
    ]
};