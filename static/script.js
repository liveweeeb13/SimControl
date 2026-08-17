const socket = io({ transports: ['websocket'] });
const streamdeck = document.getElementById('streamdeck');
const buttonStates = {};
const pressedButtons = new Set();
const holdTimers = {};
const touchMap = {}; // touchIdentifier -> buttonId

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

            function releaseButton() {
                if (holdTimers[button.id]) {
                    clearTimeout(holdTimers[button.id]);
                    delete holdTimers[button.id];
                }
                if (!button.toggleable && pressedButtons.has(button.id)) {
                    pressedButtons.delete(button.id);
                    socket.emit('keyup', { key: button.key });
                    btnElement.style.background = button.color1;
                    btnElement.classList.remove('pressed');
                } else if (button.toggleable) {
                    socket.emit('keyup', { key: button.key });
                }
            }

            btnElement.addEventListener('mousedown', (e) => {
                if (Object.keys(touchMap).length > 0) return;
                e.preventDefault();
                if (!button.key || isButtonBlocked(button.id)) return;
                if (!button.toggleable && pressedButtons.has(button.id)) return;
                socket.emit('keydown', { key: button.key, id: button.id });
                btnElement.classList.add('pressed');
                if (button.toggleable) {
                    if (button.holdTime && !buttonStates[button.id]) {
                        holdTimers[button.id] = setTimeout(() => {
                            buttonStates[button.id] = true;
                            btnElement.style.background = button.color2;
                            delete holdTimers[button.id];
                            applyAutodisableRules(button.id, true);
                        }, button.holdTime);
                    } else {
                        buttonStates[button.id] = !buttonStates[button.id];
                        btnElement.style.background = buttonStates[button.id] ? button.color2 : button.color1;
                        if (!buttonStates[button.id]) btnElement.classList.remove('pressed');
                        applyAutodisableRules(button.id, buttonStates[button.id]);
                    }
                } else {
                    pressedButtons.add(button.id);
                    btnElement.style.background = button.color2;
                    applyAutodisableRules(button.id, true);
                }
            });
            btnElement.addEventListener('mouseup', releaseButton);
            btnElement.addEventListener('mouseleave', () => {
                if (pressedButtons.has(button.id)) releaseButton();
                if (holdTimers[button.id]) { clearTimeout(holdTimers[button.id]); delete holdTimers[button.id]; }
            });

            btnElement.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (!button.key || isButtonBlocked(button.id)) return;
                if (!button.toggleable && pressedButtons.has(button.id)) return;
                const touch = e.changedTouches[0];
                touchMap[touch.identifier] = button.id;
                socket.emit('keydown', { key: button.key, id: button.id });
                btnElement.classList.add('pressed');
                if (button.toggleable) {
                    if (button.holdTime && !buttonStates[button.id]) {
                        holdTimers[button.id] = setTimeout(() => {
                            buttonStates[button.id] = true;
                            btnElement.style.background = button.color2;
                            delete holdTimers[button.id];
                            applyAutodisableRules(button.id, true);
                        }, button.holdTime);
                    } else {
                        buttonStates[button.id] = !buttonStates[button.id];
                        btnElement.style.background = buttonStates[button.id] ? button.color2 : button.color1;
                        if (!buttonStates[button.id]) btnElement.classList.remove('pressed');
                        applyAutodisableRules(button.id, buttonStates[button.id]);
                    }
                } else {
                    pressedButtons.add(button.id);
                    btnElement.style.background = button.color2;
                    applyAutodisableRules(button.id, true);
                }
            }, { passive: false });

            btnElement.addEventListener('contextmenu', (e) => e.preventDefault());
        }

        streamdeck.appendChild(btnElement);
    });

    function handleTouchEnd(e) {
        Array.from(e.changedTouches).forEach(touch => {
            const buttonId = touchMap[touch.identifier];
            if (buttonId === undefined) return;
            delete touchMap[touch.identifier];
            const btn = allButtons.find(b => b.id === buttonId);
            const el = document.getElementById(`btn-${buttonId}`);
            if (!btn || !el) return;
            if (holdTimers[buttonId]) { clearTimeout(holdTimers[buttonId]); delete holdTimers[buttonId]; }
            if (!btn.toggleable && pressedButtons.has(buttonId)) {
                pressedButtons.delete(buttonId);
                socket.emit('keyup', { key: btn.key });
                el.style.background = btn.color1;
                el.classList.remove('pressed');
            } else if (btn.toggleable) {
                socket.emit('keyup', { key: btn.key });
            }
        });
    }

    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchcancel', handleTouchEnd, { passive: false });

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
