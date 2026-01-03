from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
from pynput.keyboard import Key, Controller
import threading
import json
import requests
import os
import ctypes
from ctypes import wintypes

app = Flask(__name__)
app.config['SECRET_KEY'] = 'jugfhuigfyhghfyghfygfgfgff4gf545g5g5h7548ù74ù'
socketio = SocketIO(app, cors_allowed_origins="*")

keyboard = Controller()
pressed_keys = set()

def check_version():
    try:
        with open('version.txt', 'r') as f:
            current_version = f.read().strip()
        
        response = requests.get('https://raw.githubusercontent.com/liveweeeb13/SimControl/refs/heads/main/version.txt')
        latest_version = response.text.strip()
        
        if current_version != latest_version:
            print(f"⚠️  MISE À JOUR DISPONIBLE !")
            print(f"Version installée: {current_version}")
            print(f"Dernière version: {latest_version}")
            print(f"Lancez UPDATE.exe pour mettre à jour")
            return current_version, latest_version, True
        else:
            print(f"✅ Version à jour: {current_version}")
            return current_version, latest_version, False
    except:
        return "unknown", "unknown", False

current_ver, latest_ver, needs_update = check_version()

def create_default_config():
    if not os.path.exists('static/config.js'):
        default_config = '''const buttons = [];

const rules = {
    autodisable: [],
    stopmac: []
};'''
        os.makedirs('static', exist_ok=True)
        with open('static/config.js', 'w', encoding='utf-8') as f:
            f.write(default_config)
        print("✅ Default config.js created")

create_default_config()

@app.route('/')
def menu():
    return render_template('menu.html', current_version=current_ver, latest_version=latest_ver, needs_update=needs_update)

@app.route('/keytest')
def keytest():
    return render_template('keytest.html')

@app.route('/simcontrol')
def index():
    return render_template('index.html')

@app.route('/save-config', methods=['POST'])
def save_config():
    config_data = request.json
    
    config_js = f"""const buttons = {json.dumps(config_data['buttons'], indent=4)};

const rules = {json.dumps(config_data['rules'], indent=4)};"""
    
    with open('static/config.js', 'w', encoding='utf-8') as f:
        f.write(config_js)
    
    return jsonify({'success': True})

@socketio.on('keydown')
def handle_keydown(data):
    key = data['key']
    print(f"[DEBUG] Received keydown: {key}")
    if key not in pressed_keys:
        pressed_keys.add(key)
        try:
            if key == 'space':
                print(f"[DEBUG] Pressing Key.space")
                keyboard.press(Key.space)
            elif key == 'NumpadEnter':
                print(f"[DEBUG] NumpadEnter avec flag étendu")
                # Flag KEYEVENTF_EXTENDEDKEY = 0x0001
                ctypes.windll.user32.keybd_event(0x0D, 0x1C, 0x0001, 0)  # Press avec flag étendu
                ctypes.windll.user32.keybd_event(0x0D, 0x1C, 0x0001 | 0x0002, 0)  # Release
            elif key == 'Enter':
                print(f"[DEBUG] Pressing Key.enter (Enter)")
                keyboard.press(Key.enter)
            elif key.startswith('Numpad'):
                # Gérer les autres touches numpad
                numpad_map = {
                    'Numpad0': Key.insert, 'Numpad1': Key.end, 'Numpad2': Key.down,
                    'Numpad3': Key.page_down, 'Numpad4': Key.left, 'Numpad5': '5',
                    'Numpad6': Key.right, 'Numpad7': Key.home, 'Numpad8': Key.up,
                    'Numpad9': Key.page_up, 'NumpadAdd': '+', 'NumpadSubtract': '-',
                    'NumpadMultiply': '*', 'NumpadDivide': '/', 'NumpadDecimal': Key.delete
                }
                if key in numpad_map:
                    print(f"[DEBUG] Pressing numpad key: {key} -> {numpad_map[key]}")
                    keyboard.press(numpad_map[key])
                else:
                    print(f"[DEBUG] Pressing unknown numpad key: {key}")
                    keyboard.press(key)
            else:
                print(f"[DEBUG] Pressing regular key: {key}")
                keyboard.press(key)
            print(f"✅ Touche enfoncée: {key}")
        except Exception as e:
            print(f"❌ Erreur keydown: {e}")

@socketio.on('keyup')
def handle_keyup(data):
    key = data['key']
    print(f"[DEBUG] Received keyup: {key}")
    if key in pressed_keys:
        pressed_keys.remove(key)
        try:
            if key == 'space':
                print(f"[DEBUG] Releasing Key.space")
                keyboard.release(Key.space)
            elif key == 'NumpadEnter':
                print(f"[DEBUG] NumpadEnter handled by press event")
                pass  # Déjà géré dans keydown
            elif key == 'Enter':
                print(f"[DEBUG] Releasing Key.enter (Enter)")
                keyboard.release(Key.enter)
            elif key.startswith('Numpad'):
                # Gérer les autres touches numpad
                numpad_map = {
                    'Numpad0': Key.insert, 'Numpad1': Key.end, 'Numpad2': Key.down,
                    'Numpad3': Key.page_down, 'Numpad4': Key.left, 'Numpad5': '5',
                    'Numpad6': Key.right, 'Numpad7': Key.home, 'Numpad8': Key.up,
                    'Numpad9': Key.page_up, 'NumpadAdd': '+', 'NumpadSubtract': '-',
                    'NumpadMultiply': '*', 'NumpadDivide': '/', 'NumpadDecimal': Key.delete
                }
                if key in numpad_map:
                    print(f"[DEBUG] Releasing numpad key: {key} -> {numpad_map[key]}")
                    keyboard.release(numpad_map[key])
                else:
                    print(f"[DEBUG] Releasing unknown numpad key: {key}")
                    keyboard.release(key)
            else:
                print(f"[DEBUG] Releasing regular key: {key}")
                keyboard.release(key)
            print(f"✅ Touche relâchée: {key}")
        except Exception as e:
            print(f"❌ Erreur keyup: {e}")

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=3001, debug=True)