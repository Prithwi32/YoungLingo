import sys
from gtts import gTTS
import base64
import os

def text_to_speech(text):
    tts = gTTS(text=text, lang='en')
    temp_filename = 'temp.mp3'
    tts.save(temp_filename)

    with open(temp_filename, 'rb') as audio_file:
        audio_data = audio_file.read()
        base64_audio = base64.b64encode(audio_data).decode('utf-8')

    # Ensure the file is closed before attempting to delete it
    # audio_file.close()

    # os.remove(temp_filename)  # Clean up the temporary file
    return base64_audio

if __name__ == "__main__":
    input_text = sys.argv[1]
    base64_audio = text_to_speech(input_text)
    print(base64_audio)
