const socket = io();
const streamdeck = document.getElementById('streamdeck');
const buttonStates = {};
const pressedButtons = new Set();
const holdTimers = {};

fetch('/config.json').then(r => r.json()).then(config => {
    const buttons = config.buttons || [];
    const rules = config.rules || { autodisable: [], lock: [] };
    const theme = config.theme || '1';

    document.getElementById('themeStylesheet').href = `/static/style${theme}.css`;

    const allButtons = [];
    for (let i = 1; i <= 35; i++) {
        const existing = buttons.find(btn => btn.id === i);
        allButtons.push(existing || { id: i, title: '', label: '', key: '', toggleable: false, color1: '#ffffff', color2: '#ffffff' });
    }

    function applyAutodisableRules(triggerId, isOn) {
        if (!rules.autodisable) return;
        rules.autodisable.forEach(rule => {
            if (rule.trigger === triggerId) {
                if ((rule.condition === 'off' && !isOn) || (rule.condition === 'on' && isOn)) {
                    rule.targets.forEach(targetId => {
                        const targetButton = allButtons.find(b => b.id === targetId);
                        const targetElement = document.getElementById(`btn-${targetId}`);
                        if (targetButton && targetElement && buttonStates[targetId]) {
                            buttonStates[targetId] = false;
                            targetElement.style.background = targetButton.color1;
                            targetElement.classList.remove('pressed');
                            socket.emit('keyup', { key: targetButton.key });
                        }
                    });
                }
            }
        });
    }

    function isButtonBlocked(buttonId) {
        if (!rules.lock) return false;
        for (const rule of rules.lock) {
            if (rule.targets && rule.targets.includes(buttonId)) {
                if (rule.condition === 'on') return buttonStates[rule.trigger] === true;
                if (rule.condition === 'off') return buttonStates[rule.trigger] === false;
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
            btnElement.innerHTML = `<div class="button-label">${button.label}</div>`;
            buttonStates[button.id] = false;

            btnElement.addEventListener('mousedown', (e) => {
                e.preventDefault();
                if (button.key && !pressedButtons.has(button.id) && !isButtonBlocked(button.id)) {
                    pressedButtons.add(button.id);
                    socket.emit('keydown', { key: button.key, id: button.id });
                    btnElement.classList.add('pressed');
                    if (button.toggleable) {
                        if (button.holdTime && !buttonStates[button.id]) {
                            holdTimers[button.id] = setTimeout(() => {
                                buttonStates[button.id] = true;
                                btnElement.style.background = button.color2;
                                btnElement.classList.add('pressed');
                                delete holdTimers[button.id];
                                applyAutodisableRules(button.id, buttonStates[button.id]);
                            }, button.holdTime);
                        } else {
                            buttonStates[button.id] = !buttonStates[button.id];
                            btnElement.style.background = buttonStates[button.id] ? button.color2 : button.color1;
                            if (buttonStates[button.id]) btnElement.classList.add('pressed');
                            applyAutodisableRules(button.id, buttonStates[button.id]);
                        }
                    } else {
                        btnElement.style.background = button.color2;
                        applyAutodisableRules(button.id, true);
                    }
                }
            });

            btnElement.addEventListener('mouseup', (e) => {
                e.preventDefault();
                if (button.key && pressedButtons.has(button.id)) {
                    pressedButtons.delete(button.id);
                    socket.emit('keyup', { key: button.key });
                    if (holdTimers[button.id]) {
                        clearTimeout(holdTimers[button.id]);
                        delete holdTimers[button.id];
                        btnElement.classList.remove('pressed');
                        return;
                    }
                    if (button.toggleable) {
                        if (!buttonStates[button.id]) {
                            btnElement.style.background = button.color1;
                            btnElement.classList.remove('pressed');
                        } else {
                            btnElement.classList.add('pressed');
                        }
                    } else {
                        btnElement.style.background = button.color1;
                        btnElement.classList.remove('pressed');
                    }
                }
            });

            btnElement.addEventListener('mouseleave', () => {
                if (button.key && pressedButtons.has(button.id) && !button.toggleable) {
                    pressedButtons.delete(button.id);
                    socket.emit('keyup', { key: button.key });
                    btnElement.style.background = button.color1;
                    btnElement.classList.remove('pressed');
                }
                if (holdTimers[button.id]) {
                    clearTimeout(holdTimers[button.id]);
                    delete holdTimers[button.id];
                }
            });

            btnElement.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (button.key && !pressedButtons.has(button.id) && !isButtonBlocked(button.id)) {
                    pressedButtons.add(button.id);
                    socket.emit('keydown', { key: button.key, id: button.id });
                    btnElement.classList.add('pressed');
                    if (button.toggleable) {
                        if (button.holdTime && !buttonStates[button.id]) {
                            holdTimers[button.id] = setTimeout(() => {
                                buttonStates[button.id] = true;
                                btnElement.style.background = button.color2;
                                btnElement.classList.add('pressed');
                                applyAutodisableRules(button.id, buttonStates[button.id]);
                            }, button.holdTime);
                        } else {
                            buttonStates[button.id] = !buttonStates[button.id];
                            btnElement.style.background = buttonStates[button.id] ? button.color2 : button.color1;
                            if (buttonStates[button.id]) btnElement.classList.add('pressed');
                            applyAutodisableRules(button.id, buttonStates[button.id]);
                        }
                    } else {
                        btnElement.style.background = button.color2;
                        applyAutodisableRules(button.id, true);
                    }
                }
            });

            btnElement.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (button.key && pressedButtons.has(button.id)) {
                    pressedButtons.delete(button.id);
                    socket.emit('keyup', { key: button.key });
                    if (holdTimers[button.id]) {
                        clearTimeout(holdTimers[button.id]);
                        delete holdTimers[button.id];
                        btnElement.classList.remove('pressed');
                        return;
                    }
                    if (button.toggleable) {
                        if (!buttonStates[button.id]) {
                            btnElement.style.background = button.color1;
                            btnElement.classList.remove('pressed');
                        } else {
                            btnElement.classList.add('pressed');
                        }
                    } else {
                        btnElement.style.background = button.color1;
                        btnElement.classList.remove('pressed');
                    }
                }
            });

            btnElement.addEventListener('contextmenu', (e) => e.preventDefault());
        }

        streamdeck.appendChild(btnElement);
    });

    window.addEventListener('blur', () => {
        pressedButtons.forEach(buttonId => {
            const button = allButtons.find(b => b.id === buttonId);
            if (button && button.key) {
                socket.emit('keyup', { key: button.key });
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
});

socket.on('connect', () => console.log('Connected to the server'));
socket.on('disconnect', () => console.log('Disconnected from the server'));
