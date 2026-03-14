# Build And Run Guide (Any Computer)

This file is the complete setup and run guide for FrameTalk.

## 1. Prerequisites

Install these first:

1. Git
2. Node.js 18+ (LTS recommended)
3. npm (comes with Node.js)
4. A modern browser (Chrome, Edge, or Safari)
5. A working microphone

Check versions:

```bash
node --version
npm --version
git --version
```

## 2. Get The Project

```bash
git clone https://github.com/caasion/frametalk.git
cd frametalk
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Configure Environment Variables

Create these files in the project root.

### `.env`

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### `.env.local`

```env
AZURE_SPEECH_KEY=your_azure_speech_key_here
AZURE_SPEECH_REGION=your_azure_region_here
```

Notes:

- `AZURE_SPEECH_REGION` must match your Azure Speech resource region exactly (example: `eastus`).
- Keep these files private and never commit real keys.

## 5. Run In Development

```bash
npm run dev
```

Open:

`http://localhost:3000`

## 6. Build And Run Production Locally

```bash
npm run build
npm run start
```

Open:

`http://localhost:3000`

## 7. Run Tests And Lint

```bash
npm test
npm run lint
```

## 8. AI Behavior (Important)

Sentence generation uses this order:

1. Gemini (if `GEMINI_API_KEY` is set)
2. Local Ollama at `http://localhost:11434` (if running)
3. Built-in fallback sentence generation

If you want local LLM fallback quality, install and run Ollama separately.

## 9. Common Problems

### App does not start

- Re-run `npm install`.
- Ensure Node.js is version 18 or later.

### Port 3000 already in use

Run on another port:

```bash
npm run dev -- -p 3001
```

### Sentence generation is weak or generic

- Confirm `GEMINI_API_KEY` is valid.
- If no Gemini key, run Ollama locally for better fallback.

### Pronunciation scoring fails

- Confirm both `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` are present.
- Confirm the region is correct.

### Microphone does not work

- Allow browser microphone permission.
- Try Chrome or Edge.

## 10. Clean Reinstall (If Needed)

```bash
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```
