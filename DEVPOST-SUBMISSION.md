# Devpost Submission - Static: Layers of Fear

## Built With

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Google Gemini API (gemini-2.0-flash-lite)
- ElevenLabs Text-to-Speech API
- Web Audio API
- Vercel

---

## About the Project

### Inspiration

Horror games like "Layers of Fear" and the Black Ops terminal from Call of Duty. The idea was to create something that feels wrong - a vintage CRT TV that talks back, asks uncomfortable questions, and knows things it shouldn't. The green phosphor glow, the static between channels, the flicker - technology from a dead era brought back with AI that makes it unsettling.

### What it does

A vintage 1970s CRT television interface with three horror experiences:

**Truth or Dare** - A 4-round psychological game. The AI asks disturbing questions ("whose death have you wished for...", "what memory do you try to erase but can't...") and gives creepy dares. The first dare requires lighting the candles on either side of the TV - when you do, the innocent image transforms into decay. Uses a little girl voice (ElevenLabs "Elli") for maximum discomfort. Ends with Hitchcock's voice.

**Whispers** - A creepy woman's voice invites you closer to hear secrets from the dead, then plays a haunting video through the CRT filter.

**Kiroween** - Halloween-themed video content that loops through the TV, complete with CRT scanlines and phosphor effects.

The whole experience: dark room with flickering candles, dust particles floating in candlelight, floating Kiro ghost logos, wooden TV stand, equipment rack with working volume/skip controls and animated VU meter.

### How we built it

Started with a KIRO_PROMPT.md spec defining the entire experience - components, game modes, audio system, visual effects. Built incrementally:

1. Core UI - CRT TV housing with wooden frame, glass screen effects
2. Boot sequence - Static noise, typewriter terminal text
3. Menu system - Keyboard navigation with arrow keys and Enter
4. Truth or Dare - Game state machine, Gemini API integration for responses, candle dare logic
5. Audio system - Background music sequence (buffalo intro → snip → music box loop), TTS ducking, sound effects
6. TTS integration - ElevenLabs API with multiple voice configurations (creepy woman, little girl, random creepy)
7. Visual polish - Scanlines, phosphor glow, chromatic aberration, vignette, dust particles

### Challenges we ran into

**Audio state management** - Coordinating background music, TTS voices, sound effects, and video audio. Music needs to duck during speech, stop during game modes, resume correctly. Required careful volume management and cleanup.

**Candle dare flow** - State needed to flow between App.tsx (candle components) and Screen.tsx (game logic). First candle shows decay image, both candles trigger creep video, then return to game. Lots of useEffect cleanup to prevent memory leaks.

**TTS cancellation** - When user presses ESC or switches modes, any pending TTS needs to stop immediately. Implemented cancellation flags that check before each playback step.

**CRT effect layering** - Scanlines, vignette, flicker, noise, phosphor glow - stacking too many effects causes performance issues. Balanced visual authenticity with frame rate.

### Accomplishments that we're proud of

**The atmosphere works** - The dark room, flickering candles, dust particles, CRT glow - it genuinely feels unsettling. Not jump-scare horror, but uncomfortable wrongness.

**The little girl voice** - Using "Elli" from ElevenLabs for Truth or Dare questions like "whose death have you wished for..." creates genuine discomfort. The innocent voice asking dark questions hits different.

**The candle dare sequence** - Click to light candles, watch the image transform from innocent to decay, then the creep video plays. Interactive horror that involves the user physically.

**Equipment rack actually works** - VU meter animates with audio levels, volume knob controls master volume, skip button cycles tracks. Not just decoration.

### What we learned

**Audio is the hardest part of web horror** - Browser autoplay restrictions, managing multiple audio sources, proper cleanup, volume balancing. Spent more time on audio than anything else.

**CRT effects need restraint** - Easy to overdo scanlines and flicker until it's annoying instead of atmospheric. Subtle opacity and timing matters.

**State flows between components are tricky** - Candle state in App, game state in Screen, audio state in utils. Keeping them synchronized without race conditions required careful design.

### What's next for Static: Layers of Fear

- More dare sequences with different visual transformations
- Additional TTS voice personalities
- Sound design expansion - reactive ambient audio
- Mobile touch support
