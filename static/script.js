const socket = io();
const streamdeck = document.getElementById('streamdeck');
const buttonStates = {};
const pressedButtons = new Set();
const holdTimers = {};

// Générer tous les boutons (35 au total)
const allButtons = [];
for (let i = 1; i <= 35; i++) {
    const existingButton = buttons.find(btn => btn.id === i);
    if (existingButton) {
        allButtons.push(existingButton);
    } else {
        allButtons.push({
            id: i,
            title: "",
            label: "",
            key: "",
            toggleable: false,
            color1: "#ffffff",
            color2: "#ffffff"
        });
    }
}

// Appliquer les règles autodisable
function applyAutodisableRules(triggerId, isOn) {
    if (!rules.autodisable) return;
    
    rules.autodisable.forEach(rule => {
        if (rule.trigger === triggerId && rule.condition === 'off' && !isOn) {
            rule.targets.forEach(targetId => {
                const targetButton = allButtons.find(b => b.id === targetId);
                const targetElement = document.getElementById(`btn-${targetId}`);
                if (targetButton && targetElement && buttonStates[targetId]) {
                    buttonStates[targetId] = false;
                    targetElement.style.background = targetButton.color1;
                    socket.emit('keyup', {key: targetButton.key});
                }
            });
        }
    });
}

// Vérifier si un bouton est freeze
function isButtonBlocked(buttonId) {
    if (rules.stopmac && rules.stopmac.targets && rules.stopmac.targets.includes(buttonId)) {
        // Vérifier la condition du trigger
        if (rules.stopmac.condition === "off") {
            return !buttonStates[rules.stopmac.trigger];
        }
    }
    return false;
}

allButtons.forEach(button => {
    const btnElement = document.createElement('button');
    btnElement.className = 'button';
    btnElement.id = `btn-${button.id}`;
    
    if (button.key === '') {
        btnElement.classList.add('empty');
        btnElement.style.background = button.color1;
    } else {
        btnElement.style.background = button.color1;
        btnElement.innerHTML = `
            <div class="button-label">${button.label}</div>
        `;
        
        buttonStates[button.id] = false;
        
        btnElement.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (button.key && !pressedButtons.has(button.id) && !isButtonBlocked(button.id)) {
                pressedButtons.add(button.id);
                socket.emit('keydown', {key: button.key});
                btnElement.classList.add('pressed');
                
                if (button.toggleable) {
                    if (button.holdTime && !buttonStates[button.id]) {
                        // Bouton avec holdTime pour activation - attends pour le changement de couleur
                        holdTimers[button.id] = setTimeout(() => {
                            buttonStates[button.id] = true;
                            btnElement.style.background = button.color2;
                            applyAutodisableRules(button.id, buttonStates[button.id]);
                        }, button.holdTime);
                    } else {
                        // Bouton normal ou désactivation - changement immédiat
                        buttonStates[button.id] = !buttonStates[button.id];
                        btnElement.style.background = buttonStates[button.id] ? button.color2 : button.color1;
                        applyAutodisableRules(button.id, buttonStates[button.id]);
                    }
                } else {
                    // Bouton non-toggleable - changement immédiat
                    btnElement.style.background = button.color2;
                }
            }
        });
        
        btnElement.addEventListener('mouseup', (e) => {
            e.preventDefault();
            if (button.key && pressedButtons.has(button.id)) {
                pressedButtons.delete(button.id); // FDP
                socket.emit('keyup', {key: button.key});
                btnElement.classList.remove('pressed');
                
                // Annuler le timer si relâché avant la fin
                if (holdTimers[button.id]) {
                    clearTimeout(holdTimers[button.id]);
                    delete holdTimers[button.id];
                }
                
                if (button.toggleable) {
                    if (!buttonStates[button.id]) {
                        btnElement.style.background = button.color1;
                    }
                } else {
                    btnElement.style.background = button.color1;
                }
            }
        });
        
        btnElement.addEventListener('mouseleave', (e) => {
            if (button.key && pressedButtons.has(button.id) && !button.toggleable) {
                pressedButtons.delete(button.id);
                socket.emit('keyup', {key: button.key});
                btnElement.style.background = button.color1;
                btnElement.classList.remove('pressed');
            }
            
            // Annuler le timer si on sort du bouton
            if (holdTimers[button.id]) {
                clearTimeout(holdTimers[button.id]);
                delete holdTimers[button.id];
            }
        });
        
        btnElement.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (button.key && !pressedButtons.has(button.id) && !isButtonBlocked(button.id)) {
                pressedButtons.add(button.id);
                socket.emit('keydown', {key: button.key});
                btnElement.classList.add('pressed');
                
                if (button.toggleable) {
                    if (button.holdTime && !buttonStates[button.id]) {
                        holdTimers[button.id] = setTimeout(() => {
                            buttonStates[button.id] = true;
                            btnElement.style.background = button.color2;
                            applyAutodisableRules(button.id, buttonStates[button.id]);
                        }, button.holdTime);
                    } else {
                        buttonStates[button.id] = !buttonStates[button.id];
                        btnElement.style.background = buttonStates[button.id] ? button.color2 : button.color1;
                        applyAutodisableRules(button.id, buttonStates[button.id]);
                    }
                } else {
                    btnElement.style.background = button.color2;
                }
            }
        });
        
        btnElement.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (button.key && pressedButtons.has(button.id)) {
                pressedButtons.delete(button.id);
                socket.emit('keyup', {key: button.key});
                btnElement.classList.remove('pressed');
                
                if (holdTimers[button.id]) {
                    clearTimeout(holdTimers[button.id]);
                    delete holdTimers[button.id];
                }
                
                if (button.toggleable) {
                    if (!buttonStates[button.id]) {
                        btnElement.style.background = button.color1;
                    }
                } else {
                    btnElement.style.background = button.color1;
                }
            }
        });
        
        btnElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    streamdeck.appendChild(btnElement);
});

window.addEventListener('blur', () => {
    pressedButtons.forEach(buttonId => {
        const button = allButtons.find(b => b.id === buttonId);
        if (button && button.key) {
            socket.emit('keyup', {key: button.key});
            const btnElement = document.getElementById(`btn-${buttonId}`);
            if (btnElement && !button.toggleable) {
                btnElement.style.background = button.color1;
                btnElement.classList.remove('pressed');
            }
        }
        
        if (holdTimers[buttonId]) {
            clearTimeout(holdTimers[buttonId]);
            delete holdTimers[buttonId];
        }
    });
    pressedButtons.clear();
});

socket.on('connect', () => {
    console.log('Connecté au serveur');
});

socket.on('disconnect', () => {
    console.log('Déconnecté du serveur');
});