# SimControl 2026 🚀

SimControl is a web controller that transforms your device into a button interface for simulators. You can configure 35 buttons with colors, labels, and interaction rules, then control your games from your mobile/tablet via a browser.

[![Version](https://img.shields.io/badge/version-beta--2026.01.03--1-blue)](https://github.com/liveweeeb/SimControl)
[![Python](https://img.shields.io/badge/python-3.8+-green)](https://python.org)



**Access**: http://IP:3001

> 💡 **Recommended**: Use on mobile/tablet in landscape mode

## 📦 Installation

1. Go to [SimControl Releases](https://github.com/liveweeeb13/SimControl/releases/tag/ALL-1)
2. Download the latest release
3. Run `UPDATE.exe` to install SimControl
4. Launch the application (with the ``start.bat``)

[Any problem, come talk to us ](https://github.com/liveweeeb13/SimControl?tab=readme-ov-file#-support)

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

**Helper**: Mr_Ewann 🚂🚃

## 📞 Support

- 🐈 **GitHub**: https://github.com/liveweeeb
- 💬 **Discord**: https://discord.gg/ukJegYrXWR
- 📧 **Contact**: https://id.rappytv.com/790240841598763018

---

![f](https://media.discordapp.net/attachments/1452248393064775732/1457375436463013999/image.png?ex=695bc624&is=695a74a4&hm=c7f740a22c1b91b351fdc8eed6112aac03b748bcd56a91503699bf7d8028f52f&=&format=webp&quality=lossless&width=1142&height=544)

---

**Created with ❤️ by liveweeeb | SimControl 2026**



