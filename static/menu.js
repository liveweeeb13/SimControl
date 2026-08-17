function toggleTheme() {
    const current = currentConfig.theme || '1';
    const next = current === '1' ? '2' : '1';
    currentConfig.theme = next;
    document.getElementById('themeBtn').textContent = `🎨 Controller Theme: ${next}`;
}

function initThemeBtn() {
    const btn = document.getElementById('themeBtn');
    if (!btn) return;
    const current = currentConfig.theme || '1';
    btn.textContent = `🎨 Controller Theme: ${current}`;
}

document.addEventListener('DOMContentLoaded', initThemeBtn);

let currentConfig = { buttons: [], rules: { autodisable: [], lock: [] }, theme: '1' };

fetch('/config.json').then(r => r.json()).then(data => {
    currentConfig = data;
    if (!currentConfig.rules) currentConfig.rules = {};
    if (!currentConfig.rules.autodisable) currentConfig.rules.autodisable = [];
    if (!currentConfig.rules.lock) currentConfig.rules.lock = [];
    initThemeBtn();
}).catch(() => initThemeBtn());

function exportConfig() {
    const dataStr = JSON.stringify(currentConfig, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'simcontrol-config.json';
    link.click();
    URL.revokeObjectURL(url);
}

function importConfig(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const config = JSON.parse(e.target.result);
            currentConfig = config;
            alert('Configuration successfully imported!');
        } catch (error) {
            alert('Error during import: ' + error.message);
        }
    };
    reader.readAsText(file);
}

function editButtons() {
    const modal = document.getElementById('buttonModal');
    const content = modal.querySelector('.modal-content');
    
    let gridHTML = '<h3>Select a button to edit</h3><div class="button-grid">';
    for (let i = 1; i <= 35; i++) {
        const btn = currentConfig.buttons.find(b => b.id === i);
        const configured = btn && btn.key !== '';
        gridHTML += `<div class="grid-button ${configured ? 'configured' : ''}" onclick="openButtonEditor(${i})">
            ${configured ? (btn.label && btn.label.startsWith('<img') ? `<img src="${btn.label.match(/src="([^"]+)"/)?.[1]}" style="width:100%;height:100%;object-fit:cover;">` : btn.label || i) : i}
        </div>`;
    }
    gridHTML += '</div>';
    
    content.innerHTML = `
        <span class="close" onclick="closeModal('buttonModal')">&times;</span>
        ${gridHTML}
    `;
    
    modal.style.display = 'block';
}

function openButtonEditor(buttonId) {
    const modal = document.getElementById('buttonModal');
    const content = modal.querySelector('.modal-content');
    
    const btn = currentConfig.buttons.find(b => b.id === buttonId) || {
        id: buttonId,
        title: '',
        label: '',
        key: '',
        toggleable: false,
        color1: '#ffffff',
        color2: '#ffffff',
        holdTime: 0
    };
    
    const colorNameToHex = {
        'red': '#ff0000',
        'green': '#00ff00',
        'blue': '#0000ff',
        'yellow': '#ffff00',
        'black': '#000000',
        'white': '#ffffff'
    };
    
    function cleanColor(color) {
        if (!color) return '#ffffff';
        if (colorNameToHex[color]) return colorNameToHex[color];
        if (color.endsWith('ff') && color.length === 9) {
            return color.slice(0, 7);
        }
        return color;
    }
    
    const color1 = cleanColor(btn.color1);
    const color2 = cleanColor(btn.color2);
    
    content.innerHTML = `
        <span class="close" onclick="closeModal('buttonModal')">&times;</span>
        <h3>Modifier Bouton ${buttonId}</h3>
        <form id="buttonForm">
            <input type="hidden" id="buttonId" value="${buttonId}">
            <label>Titre: <input type="text" id="buttonTitle" value="${btn.title}"></label>
            <label>Label: <textarea id="buttonLabel" rows="3" style="width: 100%; resize: vertical;">${btn.label}</textarea></label>
            <p style="font-size: 11px; color: #888; margin: 5px 0;">Emoji, SVG in "&lt;svg&gt;&lt;/svg&gt;" or image are supported</p>
            <div style="margin: 8px 0;">
                <input type="file" id="buttonImageInput" accept="image/*" style="display:none;" onchange="insertImage(event)">
                <button type="button" onclick="document.getElementById('buttonImageInput').click()" class="svg-btn">Import Image</button>
            </div>
            <div id="imagePreviewContainer" style="display:none; margin: 10px 0;">
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                    <span style="font-size:10px; color:#9aa0a6; font-family:'IBM Plex Mono',monospace; text-transform:uppercase; letter-spacing:1px;">Zoom</span>
                    <button type="button" onclick="adjustZoom(-10)" class="svg-btn" style="padding:2px 8px;">-</button>
                    <span id="zoomValue" style="font-size:11px; color:#ffb000; font-family:'IBM Plex Mono',monospace; min-width:35px; text-align:center;">100%</span>
                    <button type="button" onclick="adjustZoom(10)" class="svg-btn" style="padding:2px 8px;">+</button>
                </div>
                <div style="width:80px; height:80px; border-radius:50%; overflow:hidden; border:2px solid #ffb000; margin:0 auto; background:#0c0d0f;">
                    <img id="imagePreview" style="width:100%; height:100%; object-fit:cover; transform-origin:center; transition:transform 0.1s;">
                </div>
            </div>
            <label>Key: 
                <select id="buttonKey">
                    <option value="">-- Select Key --</option>
                    <optgroup label="Letters">
                        <option value="a">A</option>
                        <option value="b">B</option>
                        <option value="c">C</option>
                        <option value="d">D</option>
                        <option value="e">E</option>
                        <option value="f">F</option>
                        <option value="g">G</option>
                        <option value="h">H</option>
                        <option value="i">I</option>
                        <option value="j">J</option>
                        <option value="k">K</option>
                        <option value="l">L</option>
                        <option value="m">M</option>
                        <option value="n">N</option>
                        <option value="o">O</option>
                        <option value="p">P</option>
                        <option value="q">Q</option>
                        <option value="r">R</option>
                        <option value="s">S</option>
                        <option value="t">T</option>
                        <option value="u">U</option>
                        <option value="v">V</option>
                        <option value="w">W</option>
                        <option value="x">X</option>
                        <option value="y">Y</option>
                        <option value="z">Z</option>
                    </optgroup>
                    <optgroup label="Numbers">
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                    </optgroup>
                    <optgroup label="Function Keys">
                        <option value="F1">F1</option>
                        <option value="F2">F2</option>
                        <option value="F3">F3</option>
                        <option value="F4">F4</option>
                        <option value="F5">F5</option>
                        <option value="F6">F6</option>
                        <option value="F7">F7</option>
                        <option value="F8">F8</option>
                        <option value="F9">F9</option>
                        <option value="F10">F10</option>
                        <option value="F11">F11</option>
                        <option value="F12">F12</option>
                    </optgroup>
                    <optgroup label="Special Keys">
                        <option value=" ">Space</option>
                        <option value="Enter">Enter</option>
                        <option value="Tab">Tab</option>
                        <option value="Escape">Escape</option>
                        <option value="Backspace">Backspace</option>
                        <option value="Delete">Delete</option>
                        <option value="Insert">Insert</option>
                        <option value="Home">Home</option>
                        <option value="End">End</option>
                        <option value="PageUp">Page Up</option>
                        <option value="PageDown">Page Down</option>
                    </optgroup>
                    <optgroup label="Arrow Keys">
                        <option value="ArrowUp">Arrow Up</option>
                        <option value="ArrowDown">Arrow Down</option>
                        <option value="ArrowLeft">Arrow Left</option>
                        <option value="ArrowRight">Arrow Right</option>
                    </optgroup>
                    <optgroup label="Numpad">
                        <option value="Numpad0">Numpad 0</option>
                        <option value="Numpad1">Numpad 1</option>
                        <option value="Numpad2">Numpad 2</option>
                        <option value="Numpad3">Numpad 3</option>
                        <option value="Numpad4">Numpad 4</option>
                        <option value="Numpad5">Numpad 5</option>
                        <option value="Numpad6">Numpad 6</option>
                        <option value="Numpad7">Numpad 7</option>
                        <option value="Numpad8">Numpad 8</option>
                        <option value="Numpad9">Numpad 9</option>
                        <option value="NumpadEnter">Numpad Enter</option>
                        <option value="NumpadAdd">Numpad +</option>
                        <option value="NumpadSubtract">Numpad -</option>
                        <option value="NumpadMultiply">Numpad *</option>
                        <option value="NumpadDivide">Numpad /</option>
                        <option value="NumpadDecimal">Numpad .</option>
                    </optgroup>
                </select>
            </label>
            <label>Toggleable: <input type="checkbox" id="buttonToggleable" ${btn.toggleable ? 'checked' : ''}></label>
            <label>Color OFF / ON:
                <div class="color-row">
                    <input type="color" id="buttonColor1" value="${color1}">
                    <input type="color" id="buttonColor2" value="${color2}">
                </div>
            </label>
            <label>Hold Time (ms): <input type="number" id="buttonHoldTime" min="0" value="${btn.holdTime || 0}"></label>
            <div class="modal-buttons">
                <button type="button" onclick="saveButton()">Save</button>
                <button type="button" onclick="deleteButton()">Delete</button>
                <button type="button" onclick="editButtons()">Back</button>
            </div>
        </form>
    `;
    
    if (btn.key) {
        document.getElementById('buttonKey').value = btn.key;
    }
}

function saveButton() {
    if (currentImageSrc) updateImageLabel();
    const id = parseInt(document.getElementById('buttonId').value);
    const title = document.getElementById('buttonTitle').value;
    const label = document.getElementById('buttonLabel').value;
    const key = document.getElementById('buttonKey').value;
    const toggleable = document.getElementById('buttonToggleable').checked;
    const color1 = document.getElementById('buttonColor1').value;
    const color2 = document.getElementById('buttonColor2').value;
    const holdTime = parseInt(document.getElementById('buttonHoldTime').value) || 0;
    
    const existingIndex = currentConfig.buttons.findIndex(b => b.id === id);
    const buttonData = {
        id, title, label, key, toggleable, color1, color2
    };
    
    if (holdTime > 0) buttonData.holdTime = holdTime;
    
    if (existingIndex >= 0) {
        currentConfig.buttons[existingIndex] = buttonData;
    } else {
        currentConfig.buttons.push(buttonData);
    }
    
    alert('Button saved!');
    editButtons();
}

function deleteButton() {
    const id = parseInt(document.getElementById('buttonId').value);
    currentConfig.buttons = currentConfig.buttons.filter(b => b.id !== id);
    alert('Bouton supprimé!');
    editButtons();
}

function editRules() {
    const modal = document.getElementById('rulesModal');
    displayRules();
    modal.style.display = 'block';
}

function displayRules() {
    if (!currentConfig.rules.autodisable) currentConfig.rules.autodisable = [];
    if (!currentConfig.rules.lock) currentConfig.rules.lock = [];

    const modal = document.getElementById('rulesModal');
    if (!document.getElementById('rulesContent')) {
        modal.querySelector('.modal-content').innerHTML = `
            <span class="close" onclick="closeModal('rulesModal')">&times;</span>
            <h3>Edit Rules</h3>
            <div id="rulesContent"></div>
            <div class="modal-buttons">
                <button onclick="addRule('autodisable')" class="menu-btn">+ Add Autodisable</button>
                <button onclick="addRule('stopmac')" class="menu-btn">+ Add Lock</button>
            </div>
        `;
    }

    const content = document.getElementById('rulesContent');
    let html = '<h4>Règles Autodisable</h4>';
    
    currentConfig.rules.autodisable.forEach((rule, index) => {
        html += `
            <div class="rule-item">
                <p>Trigger: ${rule.trigger} | Targets: [${rule.targets.join(', ')}] | Condition: ${rule.condition}</p>
                <div class="rule-controls">
                    <button onclick="editRule('autodisable', ${index})">Modifier</button>
                    <button class="delete-btn" onclick="deleteRule('autodisable', ${index})">Supprimer</button>
                </div>
            </div>
        `;
    });
    
    html += '<h4>Règles Lock</h4>';
    currentConfig.rules.lock.forEach((rule, index) => {
        html += `
            <div class="rule-item">
                <p>Trigger: ${rule.trigger} | Targets: [${rule.targets.join(', ')}] | Condition: ${rule.condition}</p>
                <div class="rule-controls">
                    <button onclick="editRule('lock', ${index})">Modifier</button>
                    <button class="delete-btn" onclick="deleteRule('lock', ${index})">Supprimer</button>
                </div>
            </div>
        `;
    });
    
    content.innerHTML = html;
}

function addRule(type) {
    const modal = document.getElementById('rulesModal');
    const content = modal.querySelector('.modal-content');

    let gridHTML = (label, idPrefix) => {
        let html = `<div class="button-grid" id="${idPrefix}Grid">`;
        for (let i = 1; i <= 35; i++) {
            const btn = currentConfig.buttons.find(b => b.id === i);
            const configured = btn && btn.key !== '';
            const label2 = configured ? (btn.label && btn.label.startsWith('<img') ? `<img src="${btn.label.match(/src="([^"]+)"/)?.[1]}" style="width:100%;height:100%;object-fit:cover;">` : btn.label || i) : i;
            html += `<div class="grid-button ${configured ? 'configured' : ''}" id="${idPrefix}-${i}" onclick="toggleRuleBtn('${idPrefix}', ${i})">${label2}</div>`;
        }
        html += '</div>';
        return html;
    };

    content.innerHTML = `
        <span class="close" onclick="displayRules()">&times;</span>
        <h3>Add ${type === 'autodisable' ? 'Autodisable' : 'Lock'} Rule</h3>

        <p style="font-size:11px;color:#9aa0a6;font-family:'IBM Plex Mono',monospace;text-transform:uppercase;letter-spacing:1px;margin:14px 0 6px;">Trigger (1 button)</p>
        ${gridHTML('Trigger', 'trigger')}

        <p style="font-size:11px;color:#9aa0a6;font-family:'IBM Plex Mono',monospace;text-transform:uppercase;letter-spacing:1px;margin:14px 0 6px;">Targets (multiple)</p>
        ${gridHTML('Targets', 'targets')}

        <p style="font-size:11px;color:#9aa0a6;font-family:'IBM Plex Mono',monospace;text-transform:uppercase;letter-spacing:1px;margin:14px 0 6px;">Condition</p>
        <div style="display:flex;gap:10px;margin-bottom:16px;">
            <button type="button" id="cond-on" class="svg-btn" onclick="selectCondition('on')" style="flex:1;">ON</button>
            <button type="button" id="cond-off" class="svg-btn" onclick="selectCondition('off')" style="flex:1;">OFF</button>
        </div>

        <div class="modal-buttons">
            <button type="button" onclick="saveRule('${type}')">Save</button>
            <button type="button" onclick="displayRules()">Back</button>
        </div>
    `;

    window._ruleCondition = 'off';
    document.getElementById('cond-off').style.borderColor = '#ffb000';
    document.getElementById('cond-off').style.color = '#ffb000';
}

function toggleRuleBtn(prefix, id) {
    const el = document.getElementById(`${prefix}-${id}`);
    if (prefix === 'trigger') {
        document.querySelectorAll('[id^="trigger-"]').forEach(b => b.classList.remove('rule-selected'));
        el.classList.add('rule-selected');
    } else {
        el.classList.toggle('rule-selected');
    }
}

function selectCondition(val) {
    window._ruleCondition = val;
    ['on', 'off'].forEach(v => {
        const btn = document.getElementById(`cond-${v}`);
        btn.style.borderColor = v === val ? '#ffb000' : '';
        btn.style.color = v === val ? '#ffb000' : '';
    });
}

function saveRule(type) {
    const triggerEl = document.querySelector('[id^="trigger-"].rule-selected');
    const targetEls = document.querySelectorAll('[id^="targets-"].rule-selected');

    if (!triggerEl) return alert('Select a trigger button.');
    if (!targetEls.length) return alert('Select at least one target.');

    const trigger = parseInt(triggerEl.id.split('-')[1]);
    const targets = Array.from(targetEls).map(el => parseInt(el.id.split('-')[1]));
    const key = type === 'stopmac' ? 'lock' : type;

    if (!currentConfig.rules[key]) currentConfig.rules[key] = [];
    currentConfig.rules[key].push({ trigger, targets, condition: window._ruleCondition });
    displayRules();
}

function editRule(type, index) {
    const key = type === 'stopmac' ? 'lock' : type;
    const rule = currentConfig.rules[key][index];
    const modal = document.getElementById('rulesModal');
    const content = modal.querySelector('.modal-content');

    let gridHTML = (idPrefix) => {
        let html = `<div class="button-grid" id="${idPrefix}Grid">`;
        for (let i = 1; i <= 35; i++) {
            const btn = currentConfig.buttons.find(b => b.id === i);
            const configured = btn && btn.key !== '';
            const label = configured ? (btn.label && btn.label.startsWith('<img') ? `<img src="${btn.label.match(/src="([^"]+)"/)?.[1]}" style="width:100%;height:100%;object-fit:cover;">` : btn.label || i) : i;
            html += `<div class="grid-button ${configured ? 'configured' : ''}" id="${idPrefix}-${i}" onclick="toggleRuleBtn('${idPrefix}', ${i})">${label}</div>`;
        }
        html += '</div>';
        return html;
    };

    content.innerHTML = `
        <span class="close" onclick="displayRules()">&times;</span>
        <h3>Edit ${type === 'autodisable' ? 'Autodisable' : 'Lock'} Rule</h3>
        <p style="font-size:11px;color:#9aa0a6;font-family:'IBM Plex Mono',monospace;text-transform:uppercase;letter-spacing:1px;margin:14px 0 6px;">Trigger (1 button)</p>
        ${gridHTML('trigger')}
        <p style="font-size:11px;color:#9aa0a6;font-family:'IBM Plex Mono',monospace;text-transform:uppercase;letter-spacing:1px;margin:14px 0 6px;">Targets (multiple)</p>
        ${gridHTML('targets')}
        <p style="font-size:11px;color:#9aa0a6;font-family:'IBM Plex Mono',monospace;text-transform:uppercase;letter-spacing:1px;margin:14px 0 6px;">Condition</p>
        <div style="display:flex;gap:10px;margin-bottom:16px;">
            <button type="button" id="cond-on" class="svg-btn" onclick="selectCondition('on')" style="flex:1;">ON</button>
            <button type="button" id="cond-off" class="svg-btn" onclick="selectCondition('off')" style="flex:1;">OFF</button>
        </div>
        <div class="modal-buttons">
            <button type="button" onclick="saveEditRule('${type}', ${index})">Save</button>
            <button type="button" onclick="displayRules()">Back</button>
        </div>
    `;

    // Pre-select existing values
    window._ruleCondition = rule.condition;
    document.getElementById(`trigger-${rule.trigger}`).classList.add('rule-selected');
    rule.targets.forEach(t => document.getElementById(`targets-${t}`).classList.add('rule-selected'));
    const condBtn = document.getElementById(`cond-${rule.condition}`);
    condBtn.style.borderColor = '#ffb000';
    condBtn.style.color = '#ffb000';
}

function saveEditRule(type, index) {
    const triggerEl = document.querySelector('[id^="trigger-"].rule-selected');
    const targetEls = document.querySelectorAll('[id^="targets-"].rule-selected');

    if (!triggerEl) return alert('Select a trigger button.');
    if (!targetEls.length) return alert('Select at least one target.');

    const key = type === 'stopmac' ? 'lock' : type;
    currentConfig.rules[key][index] = {
        trigger: parseInt(triggerEl.id.split('-')[1]),
        targets: Array.from(targetEls).map(el => parseInt(el.id.split('-')[1])),
        condition: window._ruleCondition
    };
    displayRules();
}

function deleteRule(type, index) {
    currentConfig.rules[type].splice(index, 1);
    displayRules();
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function startSimControl() {
    fetch('/save-config', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentConfig)
    }).then(() => {
        window.location.href = '/simcontrol';
    });
}

function showCredits() {
    const modal = document.getElementById('creditsModal');
    modal.style.display = 'block';
}

function clearConfig() {
    if (confirm('Are you sure you want to clear all configuration? This will remove all buttons and rules.')) {
        currentConfig = {
            buttons: [],
            rules: { autodisable: [], lock: [] }
        };
        alert('Configuration cleared!');
    }
}

let tutorialActive = false;
let tutorialStep = 0;

const TUTORIAL_STEPS = [
    {
        title: "Welcome to SimControl",
        desc: "This tutorial will guide you through the basics. You can skip at any time."
    },
    {
        title: "Configure your buttons",
        desc: "Click \"Edit Buttons\" to open the button editor. You have 35 slots available to configure."
    },
    {
        title: "Set up a button",
        desc: "Select a slot, fill in a title, a label (emoji or text), and choose a keyboard key to send."
    },
    {
        title: "Automate with rules",
        desc: "Use \"Edit Rules\" to create Autodisable or Lock rules that automate button behavior based on states."
    },
    {
        title: "Launch!",
        desc: "Click \"Start SimControl\" to save your config and open the controller. Access it from any device on your network."
    }
];

function showTutorial() {
    tutorialStep = 0;
    tutorialActive = true;
    renderTutorialStep();
    document.getElementById('tutorialOverlay').style.display = 'flex';
}

function renderTutorialStep() {
    const step = TUTORIAL_STEPS[tutorialStep];
    const total = TUTORIAL_STEPS.length;

    document.getElementById('tutorialStepLabel').textContent = `Step ${tutorialStep + 1} / ${total}`;
    document.getElementById('tutorialTitle').textContent = step.title;
    document.getElementById('tutorialDesc').textContent = step.desc;
    document.getElementById('tutorialNextBtn').textContent = tutorialStep === total - 1 ? 'Finish' : 'Next';
    document.getElementById('tutorialPrevBtn').style.display = tutorialStep === 0 ? 'none' : 'inline-block';

    const progress = document.getElementById('tutorialProgress');
    progress.innerHTML = '';
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.className = 'tutorial-dot' + (i <= tutorialStep ? ' active' : '');
        progress.appendChild(dot);
    }
}

function prevTutorialStep() {
    if (tutorialStep > 0) {
        tutorialStep--;
        renderTutorialStep();
    }
}

function nextTutorialStep() {
    if (tutorialStep >= TUTORIAL_STEPS.length - 1) {
        skipTutorial();
    } else {
        tutorialStep++;
        renderTutorialStep();
    }
}

function skipTutorial() {
    tutorialActive = false;
    document.getElementById('tutorialOverlay').style.display = 'none';
    markTutorialSeen();
}

function markTutorialSeen() {
    localStorage.setItem('tutorialSeen', 'true');
}

function closeTutorial() {
    skipTutorial();
}

function showHelpModal() {
    document.getElementById('helpModal').style.display = 'block';
}

let currentImageSrc = null;
let currentZoom = 100;

function insertImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        currentImageSrc = e.target.result;
        currentZoom = 100;
        document.getElementById('zoomValue').textContent = '100%';
        document.getElementById('imagePreview').src = currentImageSrc;
        document.getElementById('imagePreview').style.transform = 'scale(1)';
        document.getElementById('imagePreviewContainer').style.display = 'block';
        updateImageLabel();
    };
    reader.readAsDataURL(file);
}

function adjustZoom(delta) {
    currentZoom = Math.min(200, Math.max(50, currentZoom + delta));
    document.getElementById('zoomValue').textContent = currentZoom + '%';
    document.getElementById('imagePreview').style.transform = `scale(${currentZoom / 100})`;
}

function updateImageLabel() {
    if (!currentImageSrc) return;
    const scale = currentZoom / 100;
    document.getElementById('buttonLabel').value = `<img src="${currentImageSrc}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;transform:scale(${scale});transform-origin:center;">`;
}

if (!localStorage.getItem('tutorialSeen')) {
    setTimeout(() => showTutorial(), 1000);
}