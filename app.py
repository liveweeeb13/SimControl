from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
from pynput.keyboard import Key, Controller
import threading
import json
import requests
import os

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
    if key not in pressed_keys:
        pressed_keys.add(key)
        try:
            if key == 'space':
                keyboard.press(Key.space)
            else:
                keyboard.press(key)
            print(f"Touche enfoncée: {key}")
        except Exception as e:
            print(f"Erreur: {e}")

@socketio.on('keyup')
def handle_keyup(data):
    key = data['key']
    if key in pressed_keys:
        pressed_keys.remove(key)
        try:
            if key == 'space':
                keyboard.release(Key.space)
            else:
                keyboard.release(key)
            print(f"Touche relâchée: {key}")
        except Exception as e:
            print(f"Erreur: {e}")

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=3001, debug=True)