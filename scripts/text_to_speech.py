import sys
from gtts import gTTS
import base64
import os
import tempfile

def text_to_speech(text):
    try:
        tts = gTTS(text=text, lang='en')
        with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as temp_file:
            temp_filename = temp_file.name
            tts.save(temp_filename)

        with open(temp_filename, 'rb') as audio_file:
            audio_data = audio_file.read()
            base64_audio = base64.b64encode(audio_data).decode('utf-8')

        os.unlink(temp_filename)  # Safely delete the temporary file
        return base64_audio
    except Exception as e:
        print(f"Error in text_to_speech: {str(e)}", file=sys.stderr)
        return None

if __name__ == "__main__":
    input_text = sys.argv[1]
    base64_audio = text_to_speech(input_text)
    if base64_audio:
        print(base64_audio)
    else:
        sys.exit(1)

