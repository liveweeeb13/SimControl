const buttons = [
    {
        "id": 1,
        "title": "TEST",
        "label": "\ud83d\udd0a",
        "key": "h",
        "toggleable": true,
        "color1": "#00ff6e",
        "color2": "#ff0ade",
        "holdTime": 1000
    },
    {
        "id": 2,
        "title": "dsqd",
        "label": "\ud83d\udd0a",
        "key": "h",
        "toggleable": true,
        "color1": "#331515",
        "color2": "#b18181"
    }
];

const rules = {
    "autodisable": [
        {
            "trigger": 1,
            "targets": [
                2
            ],
            "condition": "on"
        }
    ],
    "stopmac": [
        {
            "trigger": 1,
            "targets": [
                2
            ],
            "condition": "on"
        }
    ]
};