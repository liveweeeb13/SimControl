const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

let repeatInterval = null;

app.post('/keydown', (req, res) => {
    if (!repeatInterval) {
        exec('powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait(\'p\')"');
        
        repeatInterval = setInterval(() => {
            exec('powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait(\'p\')"');
        }, 100);
    }
    res.json({ status: 'key pressed' });
});

app.post('/keyup', (req, res) => {
    if (repeatInterval) {
        clearInterval(repeatInterval);
        repeatInterval = null;
    }
    res.json({ status: 'key released' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});