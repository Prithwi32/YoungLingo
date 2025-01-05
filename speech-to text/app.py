from flask import Flask, request, jsonify, send_from_directory
import os
from gtts import gTTS
import random
import difflib
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
# Static files path
app.config['UPLOAD_FOLDER'] = 'static'

# Route to serve static files
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Example sentences
sentences = ["The cat is on the table.", "I like to play soccer.", "What time is it?"]

@app.route('/generate-voice', methods=['GET'])
def generate_voice():
    sentence = random.choice(sentences)  # Random sentence
    tts = gTTS(sentence, lang='en')      # Convert to speech
    tts.save(os.path.join(app.config['UPLOAD_FOLDER'], "sentence.mp3"))   # Save as audio
    return jsonify({"audio_url": "/static/sentence.mp3", "sentence": sentence})

@app.route('/validate', methods=['POST'])
def validate():
    data = request.json
    user_input = data.get("user_input", "").strip()
    correct_sentence = data.get("correct_sentence", "").strip()
    
    # Check similarity
    similarity = difflib.SequenceMatcher(None, user_input.lower(), correct_sentence.lower()).ratio()
    result = "Right" if similarity > 0.9 else "Wrong"
    return jsonify({"result": result, "similarity": round(similarity * 100, 2)})

@app.route('/')
def home():
    return "Welcome to the Language Learning App!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

