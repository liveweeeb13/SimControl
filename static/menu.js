let currentConfig = {
    buttons: [...buttons],
    rules: JSON.parse(JSON.stringify(rules))
};

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
            alert('Configuration importée avec succès!');
        } catch (error) {
            alert('Erreur lors de l\'import: ' + error.message);
        }
    };
    reader.readAsText(file);
}

function editButtons() {
    const modal = document.getElementById('buttonModal');
    const content = modal.querySelector('.modal-content');
    
    let gridHTML = '<h3>Sélectionner un bouton à modifier</h3><div class="button-grid">';
    for (let i = 1; i <= 35; i++) {
        const btn = currentConfig.buttons.find(b => b.id === i);
        const configured = btn && btn.key !== '';
        gridHTML += `<div class="grid-button ${configured ? 'configured' : ''}" onclick="openButtonEditor(${i})">
            ${configured ? btn.label || i : i}
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
    
    content.innerHTML = `
        <span class="close" onclick="closeModal('buttonModal')">&times;</span>
        <h3>Modifier Bouton ${buttonId}</h3>
        <form id="buttonForm">
            <input type="hidden" id="buttonId" value="${buttonId}">
            <label>Titre: <input type="text" id="buttonTitle" value="${btn.title}"></label>
            <label>Label: <input type="text" id="buttonLabel" value="${btn.label}"></label>
            <label>Touche: <input type="text" id="buttonKey" maxlength="1" value="${btn.key}"></label>
            <label>Toggleable: <input type="checkbox" id="buttonToggleable" ${btn.toggleable ? 'checked' : ''}></label>
            <label>Couleur OFF: <input type="color" id="buttonColor1" value="${btn.color1}"></label>
            <label>Couleur ON: <input type="color" id="buttonColor2" value="${btn.color2}"></label>
            <label>Hold Time (ms): <input type="number" id="buttonHoldTime" min="0" value="${btn.holdTime || 0}"></label>
            <div class="modal-buttons">
                <button type="button" onclick="saveButton()">Sauvegarder</button>
                <button type="button" onclick="deleteButton()">Supprimer</button>
                <button type="button" onclick="editButtons()">Retour</button>
            </div>
        </form>
    `;
}

function saveButton() {
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
    
    alert('Bouton sauvegardé!');
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
    
    html += '<h4>Règles Stopmac</h4>';
    currentConfig.rules.stopmac.forEach((rule, index) => {
        html += `
            <div class="rule-item">
                <p>Trigger: ${rule.trigger} | Targets: [${rule.targets.join(', ')}] | Condition: ${rule.condition}</p>
                <div class="rule-controls">
                    <button onclick="editRule('stopmac', ${index})">Modifier</button>
                    <button class="delete-btn" onclick="deleteRule('stopmac', ${index})">Supprimer</button>
                </div>
            </div>
        `;
    });
    
    content.innerHTML = html;
}

function addRule(type) {
    const trigger = prompt('ID du bouton déclencheur:');
    const targets = prompt('IDs des boutons cibles (séparés par des virgules):');
    const condition = prompt('Condition (on/off):');
    
    if (trigger && targets && condition) {
        const rule = {
            trigger: parseInt(trigger),
            targets: targets.split(',').map(t => parseInt(t.trim())),
            condition: condition
        };
        
        currentConfig.rules[type].push(rule);
        displayRules();
    }
}

function deleteRule(type, index) {
    currentConfig.rules[type].splice(index, 1);
    displayRules();
}

function saveRules() {
    alert('Règles sauvegardées!');
    closeModal('rulesModal');
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