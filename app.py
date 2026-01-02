from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from pynput.keyboard import Key, Controller
import threading

app = Flask(__name__)
app.config['SECRET_KEY'] = 'streamdeck'
socketio = SocketIO(app, cors_allowed_origins="*")

keyboard = Controller()
pressed_keys = set()

@app.route('/')
def index():
    return render_template('index.html')

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