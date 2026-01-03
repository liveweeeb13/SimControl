# SimControl 2026 🚀

**Modern web controller for simulators** by liveweeeb

[![Version](https://img.shields.io/badge/version-beta--2026.01.03--1-blue)](https://github.com/liveweeeb/SimControl)
[![Python](https://img.shields.io/badge/python-3.8+-green)](https://python.org)



**Access**: http://IP:3001

> 💡 **Recommended**: Use on mobile/tablet in landscape mode

## 🎮 Usage

### 1. Initial Setup
- Click on "🎛️ Edit Buttons"
- Configure your buttons (35 slots available)
- Define rules if necessary

### 2. Launch
- Click on "Start SimControl"
- Your controller is ready!

## ⚙️ Advanced Configuration (public/config.js)

### Button Structure 
```js
{
    id: 1,                    // Position (1-35)
    title: "Battery",         // Descriptive name
    label: "🔋",              // Emoji/text displayed
    key: "w",                 // Keyboard key
    toggleable: true,         // Toggle or push button
    color1: "#ff0000",        // OFF color
    color2: "#00ff00",        // ON color
    holdTime: 2500            // Hold time (ms)
}
```

### Automatic Rules
```js
const rules = {
    // Automatic disable
    autodisable: [
        {
            trigger: 1,           // Trigger button
            targets: [2, 3],      // Buttons to disable
            condition: "off"      // Condition (on/off)
        }
    ],
    // Conditional blocking
    stopmac: [
        {
            trigger: 1,           // Trigger button
            targets: [4, 5],      // Buttons to block
            condition: "off"      // When to block
        }
    ]
};
```

## 🛠️ Development


## 🤝 Contribution

**Design Help**: Mr_Ewann 🚂🚃

## 📞 Support

- 🐈 **GitHub**: https://github.com/liveweeeb
- 💬 **Discord**: https://discord.gg/ukJegYrXWR
- 📧 **Contact**: https://id.rappytv.com/790240841598763018

---

**Created with ❤️ by liveweeeb | SimControl 2026**