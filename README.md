# FrameTalk

A speech practice app that helps Rohingya refugees and low-English-literacy learners practice English pronunciation using pictograms (visual symbols) and AI-powered feedback.

**How it works:** Pick pictures → Get a sentence → Record yourself → See how you did.

---

## What You'll Need Before Starting

Before running this app, make sure you have the following:

1. **Node.js** (version 18 or higher)
   - Download from [nodejs.org](https://nodejs.org) — choose the "LTS" version
   - To check if it's installed, open your terminal and run: `node --version`

2. **A microphone** — your computer's built-in mic works fine

3. **API keys** (the app uses two external services):
   - **Gemini API key** (for generating sentences) — free at [aistudio.google.com](https://aistudio.google.com)
   - **Azure Speech key** (for pronunciation scoring) — get one at [portal.azure.com](https://portal.azure.com) by creating a "Speech" resource

---

## Installation

### Step 1 — Clone the repository

Open your terminal and run:

```bash
git clone https://github.com/caasion/frametalk.git
cd frametalk
```

### Step 2 — Install dependencies

```bash
npm install
```

This downloads all the packages the app needs. It may take a minute.

### Step 3 — Set up your API keys

You need to create two files in the project root (the `frametalk/` folder).

**File 1: `.env`**

Create a file named `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

**File 2: `.env.local`**

Create a file named `.env.local` and add your Azure credentials:

```
AZURE_SPEECH_KEY=your_azure_speech_key_here
AZURE_SPEECH_REGION=eastus
```

> **Note:** Replace `eastus` with whichever region you chose when creating your Azure Speech resource (e.g., `westus`, `eastus2`).

> **Tip:** These files are secret — never share them or commit them to Git. They are already listed in `.gitignore` so you're protected by default.

### Step 4 — Start the app

```bash
npm run dev
```

Then open your browser and go to: **http://localhost:3000**

You should see the FrameTalk pictogram screen.

---

## How to Use the App

1. **Pick pictograms** — Tap visual symbols to describe how you feel or what you need (e.g., stomach → pain → a little → me)
2. **Get a sentence** — The app generates a simple English sentence from your selections
3. **Listen first** — Tap the speaker icon to hear how the sentence should sound
4. **Record yourself** — Hold the microphone button and say the sentence out loud
5. **See your score** — Each word lights up green (good) or red (needs work), with a score out of 100
6. **Practice again** — Tap any red word to hear it again, then re-record to improve

---

## Running Tests

```bash
npm test
```

---

## Project Structure (for developers)

```
frametalk/
├── app/
│   ├── api/
│   │   ├── evaluate/     # Sends audio to Azure for pronunciation scoring
│   │   ├── generate/     # Generates sentences using Gemini AI
│   │   └── tts/          # Text-to-speech helpers
│   ├── pictogram/        # Main app page
│   └── globals.css       # Global styles and animations
│
├── components/
│   ├── AudioRecorder.tsx        # Microphone recording UI
│   └── PronunciationFeedback.tsx # Karaoke-style word-by-word feedback
│
├── lib/
│   ├── pictogramTree.ts   # Pictogram categories and hierarchy
│   └── wavRecorder.ts     # Audio encoding for Azure
│
├── .env                   # Gemini API key (you create this)
└── .env.local             # Azure credentials (you create this)
```

---

## Troubleshooting

**The app won't start**
- Make sure you ran `npm install` first
- Make sure you're using Node.js 18+: `node --version`

**Sentences aren't generating**
- Check that your `.env` file exists and contains a valid `GEMINI_API_KEY`
- Make sure there are no extra spaces around the `=` sign

**Pronunciation scoring isn't working**
- Check that `.env.local` has both `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION`
- Make sure your Azure Speech resource is active in the Azure portal
- Allow microphone access in your browser when prompted

**The microphone isn't working**
- Make sure your browser has permission to use the microphone (look for a mic icon in the address bar)
- Try using Chrome or Edge for best compatibility

---

## Tech Stack

- **Next.js** — web framework
- **Azure Cognitive Services** — pronunciation assessment
- **Google Gemini AI** — sentence generation
- **ARASAAC** — pictogram images
- **Web Audio API** — microphone recording
