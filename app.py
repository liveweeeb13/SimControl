from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
import threading
import json
import requests
import os
import platform
import sys
import tkinter as tk
from tkinter import scrolledtext
import socket

if platform.system() == "Windows":
    from pynput.keyboard import Key, Controller
    import ctypes
    from ctypes import wintypes
else:
    try:
        from pynput.keyboard import Key, Controller
    except ImportError:
        import keyboard as kb_lib
        Controller = None
        Key = None

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24).hex() 

socketio = SocketIO(app, cors_allowed_origins="*", logger=False, engineio_logger=False)

if Controller:
    keyboard = Controller()
else:
    keyboard = None
pressed_keys = set()

def check_version():
    try:
        if os.path.exists('version.txt'): # dev
            with open('version.txt', 'r') as f:
                current_version = f.read().strip()
        else:
            current_version = "beta-2026.08.17-1"
        
        response = requests.get('https://raw.githubusercontent.com/liveweeeb13/SimControl/refs/heads/main/version.txt')
        latest_version = response.text.strip()
        
        if current_version != latest_version:
            print(f"UPDATE AVAILABLE!")
            print(f"Current version: {current_version}")
            print(f"Latest version: {latest_version}")
            return current_version, latest_version, True
        else:
            print(f"Updated version: {current_version}")
            return current_version, latest_version, False
    except:
        return "beta-2026.08.17-1", "unknown", False

current_ver, latest_ver, needs_update = check_version()

def get_config_path():
    if getattr(sys, 'frozen', False) and platform.system() == "Windows":
        app_dir = os.path.join(os.environ.get('LOCALAPPDATA', os.path.dirname(sys.executable)), 'SimControl')
        os.makedirs(app_dir, exist_ok=True)
    elif getattr(sys, 'frozen', False):
        app_dir = os.path.dirname(sys.executable)
    else:
        app_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(app_dir, 'config.json')

def create_default_config():
    config_path = get_config_path()
    if not os.path.exists(config_path):
        default_config = {"buttons": [], "rules": {"autodisable": [], "lock": []}, "theme": "1"}
        with open(config_path, 'w', encoding='utf-8') as f:
            json.dump(default_config, f, indent=4)
        print(f"Default config.json created at {config_path}")

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

@app.route('/config.json')
def serve_config():
    config_path = get_config_path()
    if os.path.exists(config_path):
        with open(config_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        if 'rules' in data and 'stopmac' in data['rules']:
            data['rules']['lock'] = data['rules'].pop('stopmac')
            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4)
        return jsonify(data)
    else:
        return jsonify({"buttons": [], "rules": {"autodisable": [], "lock": []}, "theme": "1"})

@app.route('/save-config', methods=['POST'])
def save_config():
    config_data = request.json
    config_path = get_config_path()
    with open(config_path, 'w', encoding='utf-8') as f:
        json.dump(config_data, f, indent=4)
    return jsonify({'success': True})

button_press_count = {}

@socketio.on('connect')
def handle_connect():
    client_ip = request.remote_addr
    gui_log(f"Connected : {client_ip}", "ok")

@socketio.on('disconnect')
def handle_disconnect():
    client_ip = request.remote_addr
    gui_log(f"Disconnected : {client_ip}", "warn")

@socketio.on('keydown')
def handle_keydown(data):
    key = data['key']
    btn_id = data.get('id', '?')
    if key not in pressed_keys:
        pressed_keys.add(key)
        button_press_count[btn_id] = button_press_count.get(btn_id, 0) + 1
        gui_log(f"Button #{btn_id} pressed : key: {key}", "key")
        try:
            if not keyboard:
                gui_log("No keyboard controller available", "warn")
                return
            if key == 'space':
                keyboard.press(Key.space)
            elif key == 'NumpadEnter':
                if platform.system() == "Windows":
                    ctypes.windll.user32.keybd_event(0x0D, 0x1C, 0x0001, 0)
                    ctypes.windll.user32.keybd_event(0x0D, 0x1C, 0x0001 | 0x0002, 0)
                else:
                    keyboard.press(Key.enter)
                    keyboard.release(Key.enter)
            elif key == 'Enter':
                keyboard.press(Key.enter)
            elif key.startswith('Numpad'):
                numpad_map = {
                    'Numpad0': Key.insert, 'Numpad1': Key.end, 'Numpad2': Key.down,
                    'Numpad3': Key.page_down, 'Numpad4': Key.left, 'Numpad5': '5',
                    'Numpad6': Key.right, 'Numpad7': Key.home, 'Numpad8': Key.up,
                    'Numpad9': Key.page_up, 'NumpadAdd': '+', 'NumpadSubtract': '-',
                    'NumpadMultiply': '*', 'NumpadDivide': '/', 'NumpadDecimal': Key.delete
                }
                keyboard.press(numpad_map.get(key, key))
            else:
                keyboard.press(key)
        except Exception as e:
            gui_log(f"Key error {key}: {e}", "error")

@socketio.on('keyup')
def handle_keyup(data):
    key = data['key']
    if key in pressed_keys:
        pressed_keys.remove(key)
        try:
            if key == 'space':
                keyboard.release(Key.space)
            elif key == 'NumpadEnter':
                pass
            elif key == 'Enter':
                keyboard.release(Key.enter)
            elif key.startswith('Numpad'):
                numpad_map = {
                    'Numpad0': Key.insert, 'Numpad1': Key.end, 'Numpad2': Key.down,
                    'Numpad3': Key.page_down, 'Numpad4': Key.left, 'Numpad5': '5',
                    'Numpad6': Key.right, 'Numpad7': Key.home, 'Numpad8': Key.up,
                    'Numpad9': Key.page_up, 'NumpadAdd': '+', 'NumpadSubtract': '-',
                    'NumpadMultiply': '*', 'NumpadDivide': '/', 'NumpadDecimal': Key.delete
                }
                keyboard.release(numpad_map.get(key, key))
            else:
                keyboard.release(key)
        except Exception as e:
            gui_log(f"Key release error {key}: {e}", "error")

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "localhost"

_gui_log_fn = None
def gui_log(msg, level="info"):
    if _gui_log_fn:
        _gui_log_fn(msg, level)

def start_gui():
    root = tk.Tk()
    root.title("SimControl")
    root.geometry("600x400")
    root.configure(bg="#1e1e1e")
    root.resizable(False, False)
    try:
        icon_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'icon.ico')
        root.iconbitmap(default=icon_path)
        if platform.system() == "Windows":
            ctypes.windll.shell32.SetCurrentProcessExplicitAppUserModelID("SimControl.App")
    except:
        pass

    # Header
    header = tk.Frame(root, bg="#1e1e1e")
    header.pack(fill="x", padx=10, pady=(10, 0))

    tk.Label(header, text="SimControl", font=("Segoe UI", 16, "bold"), bg="#1e1e1e", fg="white").pack(side="left")

    ip = get_local_ip()
    url = f"http://{ip}:3001"
    url_label = tk.Label(header, text=url, font=("Segoe UI", 10), bg="#1e1e1e", fg="#4fc3f7", cursor="hand2")
    url_label.pack(side="right", padx=5)
    url_label.bind("<Button-1>", lambda e: __import__('webbrowser').open(url))

    # Log area
    log_area = scrolledtext.ScrolledText(root, bg="#121212", fg="#cccccc", font=("Consolas", 9),
                                         state="disabled", bd=0, relief="flat")
    log_area.pack(fill="both", expand=True, padx=10, pady=10)

    # Footer
    footer = tk.Frame(root, bg="#1e1e1e")
    footer.pack(fill="x", padx=10, pady=(0, 10))

    status_label = tk.Label(footer, text="● Running on port 3001", font=("Segoe UI", 9), bg="#1e1e1e", fg="#66bb6a")
    status_label.pack(side="left")

    def on_close():
        root.destroy()
        os._exit(0)

    stop_btn = tk.Button(footer, text="Stop", command=on_close,
                         bg="#c62828", fg="white", font=("Segoe UI", 9, "bold"),
                         relief="flat", padx=12, cursor="hand2")
    stop_btn.pack(side="right")

    # Color tags
    log_area.tag_config("info",  foreground="#cccccc")
    log_area.tag_config("key",   foreground="#4fc3f7")
    log_area.tag_config("ok",    foreground="#66bb6a")
    log_area.tag_config("warn",  foreground="#ffa726")
    log_area.tag_config("error", foreground="#ef5350")

    def log(msg, level="info"):
        import datetime
        ts = datetime.datetime.now().strftime("%H:%M:%S")
        log_area.configure(state="normal")
        log_area.insert("end", f"[{ts}] {msg}\n", level)
        log_area.see("end")
        log_area.configure(state="disabled")

    global _gui_log_fn
    _gui_log_fn = log

    import re

    FLASK_NOISE = [
        "Serving Flask", "Debug mode", "WARNING", "development server",
        "WSGI", "Running on", "Press CTRL", "Restarting", " * ", "Werkzeug appears"
    ]
    HTTP_LOG_RE = re.compile(r'(\d+\.\d+\.\d+\.\d+).*"(?:GET|POST) ([^ ]+).*" (\d+)')

    def parse_http_log(msg):
        m = HTTP_LOG_RE.search(msg)
        if m:
            return True
        # Catch multiline fragments and raw HTTP lines
        if any(x in msg for x in ['HTTP/1.', '" 2', '" 3', '" 4', '" 5']):
            return True
        return False

    class LogRedirect:
        def __init__(self):
            pass
        def write(self, msg):
            if isinstance(msg, bytes):
                msg = msg.decode("utf-8", errors="replace")
            msg = msg.strip()
            if not msg:
                return
            if any(noise in msg for noise in FLASK_NOISE):
                return
            if parse_http_log(msg):
                return
            if any(x in msg for x in ["Error", "Traceback", "Exception"]):
                log(msg, "error")
            else:
                log(msg, "info")
        def flush(self):
            pass

    redirector = LogRedirect()
    sys.stdout = redirector
    sys.stderr = redirector

    def run_server():
        log(f"Server started on port 3001", "ok")
        log(f"Accessible at: http://{ip}:3001", "ok")
        socketio.run(app, host='0.0.0.0', port=3001, debug=False, allow_unsafe_werkzeug=True)

    threading.Thread(target=run_server, daemon=True).start()

    root.protocol("WM_DELETE_WINDOW", on_close)
    root.mainloop()

if __name__ == '__main__':
    start_gui()