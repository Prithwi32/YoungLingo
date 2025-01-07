import speech_recognition as sr

def listen_for_speech():
    # Initialize recognizer
    recognizer = sr.Recognizer()

    # Use microphone as the audio source
    with sr.Microphone() as source:
        print("Please say something...")
        recognizer.adjust_for_ambient_noise(source)  # Adjust for ambient noise
        audio = recognizer.listen(source)  # Listen to the input from the microphone
    
    try:
        # Recognize speech using Google Web Speech API
        print("Recognizing...")
        text = recognizer.recognize_google(audio)  # Convert speech to text
        print("You said: " + text)
    except sr.UnknownValueError:
        print("Sorry, could not understand the audio.")
    except sr.RequestError as e:
        print(f"Could not request results; {e}")

if _name_ == "_main_":
    listen_for_speech()