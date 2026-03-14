import io
import os
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from google.cloud import texttospeech

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

# GOOGLE_APPLICATION_CREDENTIALS is read automatically by the Google SDK.
# Set it in .env to point to your service account JSON file.
client = texttospeech.TextToSpeechClient()

VOICE = texttospeech.VoiceSelectionParams(
    language_code=os.getenv("TTS_LANGUAGE_CODE", "en-US"),
    name=os.getenv("TTS_VOICE_NAME", "en-US-Neural2-C"),
    ssml_gender=texttospeech.SsmlVoiceGender.FEMALE,
)

AUDIO_CONFIG = texttospeech.AudioConfig(
    audio_encoding=texttospeech.AudioEncoding.MP3,
)


class TTSRequest(BaseModel):
    sentence: str


def build_ssml(sentence: str) -> str:
    """
    Builds SSML that:
      1. Speaks the full sentence once at normal pace.
      2. Pauses 1 second.
      3. Repeats each word individually at 20% speed, with a 1-second pause after each word.

    Example output for "I need water":

    <speak>
      I need water
      <break time="1s"/>
      <prosody rate="20%">I</prosody><break time="1s"/>
      <prosody rate="20%">need</prosody><break time="1s"/>
      <prosody rate="20%">water</prosody><break time="1s"/>
    </speak>

    Rate reference (Google TTS):
      x-slow ≈ 50% | 20% is the practical lower limit before audio artifacts appear.
    """
    # Strip punctuation from individual words so the TTS doesn't clip on commas/periods.
    words = [re.sub(r"[^\w'-]", "", w) for w in sentence.split()]
    words = [w for w in words if w]  # drop empty strings

    word_parts = "\n      ".join(
        f'<prosody rate="20%">{word}</prosody><break time="1s"/>'
        for word in words
    )

    ssml = f"""<speak>
      {sentence}
      <break time="1s"/>
      {word_parts}
    </speak>"""

    return ssml


@app.post("/tts")
async def text_to_speech(request: TTSRequest):
    sentence = request.sentence.strip()
    if not sentence:
        raise HTTPException(status_code=400, detail="sentence must not be empty")

    ssml = build_ssml(sentence)

    synthesis_input = texttospeech.SynthesisInput(ssml=ssml)

    response = client.synthesize_speech(
        input=synthesis_input,
        voice=VOICE,
        audio_config=AUDIO_CONFIG,
    )

    return StreamingResponse(
        io.BytesIO(response.audio_content),
        media_type="audio/mpeg",
        headers={"Content-Disposition": 'inline; filename="tts.mp3"'},
    )
