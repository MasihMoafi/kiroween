# Tech Stack

## Core Technologies
- **React 18** with functional components and hooks
- **TypeScript** for type safety
- **Vite** for fast development and builds
- **Tailwind CSS** for styling

## APIs & Services
- **Google Gemini API** (gemini-2.0-flash-lite) - AI responses in Truth or Dare
- **ElevenLabs API** - Text-to-speech with multiple voice configurations
- **Web Audio API** - Procedural sound effects (click, static, match strike)

## Key Patterns
- useState/useEffect for state management
- useRef for audio elements and DOM references
- Async/await for API calls
- CSS keyframe animations for CRT effects and candle flicker

## Audio Architecture
- Background music sequence: buffalo-intro → snip → music-box-loop
- TTS ducking: music fades to 8% during speech, 60% normal
- Game mode ducking: music to 0% during Truth or Dare
- Master volume controlled by equipment rack knob

## Deployment
- Vercel for hosting
- Environment variables for API keys (VITE_GEMINI_API_KEY, VITE_ELEVENLABS_API_KEY)
