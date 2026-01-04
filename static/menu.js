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
            <label>Label: <input type="text" id="buttonLabel" value="${btn.label}"></label>
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
            <label>Color OFF: <input type="color" id="buttonColor1" value="${color1}"></label>
            <label>Color ON: <input type="color" id="buttonColor2" value="${color2}"></label>
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
    const trigger = prompt('Trigger button ID:');
    const targets = prompt('Target button IDs (separated by commas):');
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
            rules: { autodisable: [], stopmac: [] }
        };
        alert('Configuration cleared!');
    }
}

let tutorialActive = false;

const originalEditButtons = editButtons;

function showTutorial() {
    tutorialStep = 1;
    tutorialActive = true;
    showTutorialStep();
}

function showTutorialStep() {
    const overlay = document.getElementById('tutorialOverlay');
    const tooltip = document.getElementById('tutorialTooltip');
    
    if (tutorialStep === 1) {
        const editBtn = document.querySelector('button[onclick="editButtons()"]');
        positionTooltip(tooltip, editBtn);
        tooltip.innerHTML = `
            <div class="tutorial-step-content">
                <h4>Create your first button!</h4>
                <p>Click on "🎛️ Edit Buttons" to start</p>
                <div class="tutorial-arrow"></div>
            </div>
        `;
        overlay.style.display = 'block';
    }
}

function positionTooltip(tooltip, target) {
    currentTargetElement = target;
    const rect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const arrow = tooltip.querySelector('.tutorial-arrow');
    
    arrow.style.top = '';
    arrow.style.bottom = '';
    arrow.style.left = '';
    arrow.style.right = '';
    arrow.style.borderTop = '';
    arrow.style.borderBottom = '';
    arrow.style.borderLeft = '';
    arrow.style.borderRight = '';
    
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = window.innerWidth - rect.right;
    const spaceLeft = rect.left;
    
    if (spaceBelow >= 150) {
        tooltip.style.top = (rect.bottom + 10) + 'px';
        tooltip.style.left = Math.max(10, rect.left + (rect.width / 2) - 150) + 'px';
        arrow.style.top = '-8px';
        arrow.style.left = Math.min(280, Math.max(20, rect.left + (rect.width / 2) - Math.max(10, rect.left + (rect.width / 2) - 150))) + 'px';
        arrow.style.borderBottom = '8px solid #ffeb3b';
        arrow.style.borderLeft = '8px solid transparent';
        arrow.style.borderRight = '8px solid transparent';
    } else if (spaceAbove >= 150) {
        tooltip.style.top = (rect.top - 150) + 'px';
        tooltip.style.left = Math.max(10, rect.left + (rect.width / 2) - 150) + 'px';
        arrow.style.bottom = '-8px';
        arrow.style.left = Math.min(280, Math.max(20, rect.left + (rect.width / 2) - Math.max(10, rect.left + (rect.width / 2) - 150))) + 'px';
        arrow.style.borderTop = '8px solid #ffeb3b';
        arrow.style.borderLeft = '8px solid transparent';
        arrow.style.borderRight = '8px solid transparent';
    } else if (spaceRight >= 320) {
        tooltip.style.top = Math.max(10, rect.top - 50) + 'px';
        tooltip.style.left = (rect.right + 10) + 'px';
        arrow.style.left = '-8px';
        arrow.style.top = '20px';
        arrow.style.borderRight = '8px solid #ffeb3b';
        arrow.style.borderTop = '8px solid transparent';
        arrow.style.borderBottom = '8px solid transparent';
    } else {
        tooltip.style.top = Math.max(10, rect.top - 50) + 'px';
        tooltip.style.left = Math.max(10, rect.left - 320) + 'px';
        arrow.style.right = '-8px';
        arrow.style.top = '20px';
        arrow.style.borderLeft = '8px solid #ffeb3b';
        arrow.style.borderTop = '8px solid transparent';
        arrow.style.borderBottom = '8px solid transparent';
    }
}

function nextTutorialStep() {
    tutorialStep++;
    if (tutorialStep > 4) {
        closeTutorial();
    } else {
        showTutorialStep();
    }
}

function closeTutorial() {
    tutorialActive = false;
    currentTargetElement = null;
    document.getElementById('tutorialOverlay').style.display = 'none';
}

function markTutorialSeen() {
    localStorage.setItem('tutorialSeen', 'true');
    closeTutorial();
}

function showHelpModal() {
    document.getElementById('helpModal').style.display = 'block';
}

let currentTargetElement = null;

window.addEventListener('resize', function() {
    if (tutorialActive && currentTargetElement) {
        const tooltip = document.getElementById('tutorialTooltip');
        positionTooltip(tooltip, currentTargetElement);
    }
});

editButtons = function() {
    originalEditButtons();
    if (tutorialActive && tutorialStep === 1) {
        setTimeout(() => {
            tutorialStep = 2;
            const tooltip = document.getElementById('tutorialTooltip');
            const modal = document.getElementById('buttonModal');
            const gridBtn = document.querySelector('.grid-button');
            if (gridBtn) {
                modal.appendChild(tooltip);
                positionTooltip(tooltip, gridBtn);
                tooltip.innerHTML = `
                    <div class="tutorial-step-content">
                        <h4>Select a position</h4>
                        <p>Click on any number to configure that button</p>
                        <div class="tutorial-arrow"></div>
                    </div>
                `;
            }
        }, 500);
    }
};

const originalOpenButtonEditor = openButtonEditor;
openButtonEditor = function(buttonId) {
    originalOpenButtonEditor(buttonId);
    if (tutorialActive && tutorialStep === 2) {
        setTimeout(() => {
            tutorialStep = 3;
            const tooltip = document.getElementById('tutorialTooltip');
            const modal = document.getElementById('buttonModal');
            const titleInput = document.getElementById('buttonTitle');
            if (titleInput) {
                modal.appendChild(tooltip);
                highlightElement(titleInput);
                positionTooltip(tooltip, titleInput);
                tooltip.innerHTML = `
                    <div class="tutorial-step-content">
                        <h4>Enter a title</h4>
                        <p>Give your button a name (e.g., "Engine", "Lights")</p>
                        <div class="tutorial-arrow"></div>
                    </div>
                `;
                
                titleInput.addEventListener('input', function() {
                    if (titleInput.value.length > 0 && tutorialStep === 3) {
                        setTimeout(() => {
                            tutorialStep = 4;
                            const labelInput = document.getElementById('buttonLabel');
                            highlightElement(labelInput);
                            positionTooltip(tooltip, labelInput);
                            tooltip.innerHTML = `
                                <div class="tutorial-step-content">
                                    <h4>Add a label</h4>
                                    <p>Text shown on button (emoji or text)</p>
                                    <div class="tutorial-arrow"></div>
                                </div>
                            `;
                            
                            labelInput.addEventListener('input', function() {
                                if (labelInput.value.length > 0 && tutorialStep === 4) {
                                    setTimeout(() => {
                                        tutorialStep = 5;
                                        const keySelect = document.getElementById('buttonKey');
                                        highlightElement(keySelect);
                                        positionTooltip(tooltip, keySelect);
                                        tooltip.innerHTML = `
                                            <div class="tutorial-step-content">
                                                <h4>Select a key</h4>
                                                <p>Choose which keyboard key this button will send</p>
                                                <div class="tutorial-arrow"></div>
                                            </div>
                                        `;
                                        
                                        keySelect.addEventListener('change', function() {
                                            if (keySelect.value && tutorialStep === 5) {
                                                setTimeout(() => {
                                                    const saveBtn = document.querySelector('button[onclick="saveButton()"]');
                                                    highlightElement(saveBtn);
                                                    positionTooltip(tooltip, saveBtn);
                                                    tooltip.innerHTML = `
                                                        <div class="tutorial-step-content">
                                                            <h4>Save your button!</h4>
                                                            <p>Click Save to create your first button</p>
                                                            <div class="tutorial-arrow"></div>
                                                        </div>
                                                    `;
                                                    
                                                    setTimeout(() => {
                                                        markTutorialSeen();
                                                    }, 3000);
                                                }, 500);
                                            }
                                        }, {once: true});
                                    }, 500);
                                }
                            }, {once: true});
                        }, 500);
                    }
                }, {once: true});
            }
        }, 500);
    }
};

function highlightElement(element) {
    document.querySelectorAll('.tutorial-highlight').forEach(el => {
        el.classList.remove('tutorial-highlight');
    });
    
    element.classList.add('tutorial-highlight');
    
    const overlay = document.getElementById('tutorialOverlay');
    overlay.style.background = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'block';
}

if (!localStorage.getItem('tutorialSeen')) {
    setTimeout(() => showTutorial(), 1000);
}