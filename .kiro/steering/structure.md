# Project Structure

```
layers-of-static/
├── App.tsx                 # Root - dark room, candles, TV, equipment rack
├── index.tsx               # Entry point
├── types.ts                # AppState enum, Message interface
├── components/
│   ├── Screen.tsx          # Main screen - boot, menu, game modes, videos
│   ├── TVHousing.tsx       # Wooden TV frame, power button, channel knob
│   └── EquipmentRack.tsx   # Audio controls, VU meter
├── services/
│   ├── geminiService.ts    # Google Gemini API integration
│   ├── ttsService.ts       # ElevenLabs TTS with multiple voices
│   └── truthOrDareService.ts # Game logic, truths/dares arrays
├── utils/
│   └── sound.ts            # Audio system - music, effects, ducking
└── public/
    ├── audio/              # MP3 files (music, sound effects)
    ├── images/             # JPG files (innocent, decay, corrupted)
    └── *.mp4               # Video files
```

## Key Files

| File | Purpose |
|------|---------|
| `App.tsx` | Dark room atmosphere, candles, dust particles, floating Kiro logos |
| `Screen.tsx` | Boot sequence, menu navigation, Truth or Dare, Whispers, Kiroween modes |
| `ttsService.ts` | ElevenLabs API with 4 voice options (creepy woman, little girl, etc.) |
| `sound.ts` | Background music sequence, crossfades, ducking, procedural effects |
| `truthOrDareService.ts` | 10 truths, 8 dares, candle dare logic, Hitchcock ending |

## State Flow
- `AppState` enum controls screen content (OFF, STATIC_BOOT, SYSTEM_BOOT, MAIN_MENU, TRUTH_OR_DARE, WHISPERS, KIROWEEN)
- Candle state flows from App.tsx to Screen.tsx for candle dare
- Audio state managed in sound.ts with ducking coordination
