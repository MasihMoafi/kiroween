# Design Document

## Overview

Static Layers of Fear is a React-based single-page application that creates an immersive psychological horror experience through a simulated 1970s CRT television interface. The application uses a component-based architecture with React 19, TypeScript, and Vite for the build system. Styling is handled via Tailwind CSS loaded from CDN.

The core experience revolves around three interactive horror game modes accessible through a vintage TV interface with authentic CRT visual effects. The system integrates Google Gemini AI for contextual horror responses and ElevenLabs for text-to-speech narration, creating a dynamic and unsettling atmosphere.

Key technical features include:
- State machine-based UI flow management
- Web Audio API for procedural sound effects and audio mixing
- Dynamic audio ducking system for speech clarity
- Real-time CRT visual effects using CSS filters and animations
- Event-driven architecture for keyboard and mouse interactions

## Architecture

### High-Level Architecture

The application follows a layered architecture:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (React Components + Tailwind CSS)      │
│  - App.tsx (root orchestrator)          │
│  - TVHousing, Screen, EquipmentRack     │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Service Layer                   │
│  - geminiService (AI responses)         │
│  - ttsService (speech synthesis)        │
│  - truthOrDareService (game logic)      │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Utility Layer                   │
│  - sound.ts (audio management)          │
│  - Web Audio API                        │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         External APIs                   │
│  - Google Gemini API                    │
│  - ElevenLabs API                       │
└─────────────────────────────────────────┘
```

### State Management

The application uses React's built-in state management (useState, useEffect) with state lifted to the App component for cross-component coordination. The primary state machine controls the UI flow:

**State Transitions:**
```
OFF → STATIC_BOOT → SYSTEM_BOOT → MAIN_MENU
                                      ↓
                    ┌─────────────────┼─────────────────┐
                    ↓                 ↓                 ↓
              TRUTH_OR_DARE       WHISPERS          CONFESS
                    ↓                 ↓                 ↓
                    └─────────────────┴─────────────────┘
                                      ↓
                                  MAIN_MENU
```

ESC key from any game mode returns to MAIN_MENU.

### Component Hierarchy

```
App (root state manager)
├── Candles (2x, clickable with state)
├── TVHousing
│   ├── PowerButton (toggles on/off)
│   ├── ChannelKnob (rotates, changes mode)
│   └── Screen (displays current state content)
│       ├── Static animation
│       ├── Boot sequence
│       ├── Main menu
│       ├── Truth or Dare UI
│       ├── Whispers UI
│       ├── Confess UI
│       └── VideoOverlay (when playing videos)
└── EquipmentRack
    ├── PlayPauseButton
    ├── SkipButton
    ├── VolumeKnob
    └── VUMeter
```

## Components and Interfaces

### App.tsx

**Responsibilities:**
- Root state management for app state, candle states, and current mode
- Coordinate state changes between child components
- Handle global keyboard events (ESC key)
- Manage candle click handlers and pass state to Screen

**Key State:**
```typescript
type AppState = 'OFF' | 'STATIC_BOOT' | 'SYSTEM_BOOT' | 'MAIN_MENU' | 
                'TRUTH_OR_DARE' | 'WHISPERS' | 'CONFESS';

interface AppStateData {
  appState: AppState;
  leftCandleLit: boolean;
  rightCandleLit: boolean;
  currentMode: number; // for channel knob rotation
}
```

**Props Interface:**
```typescript
// App is root, no props
```

### TVHousing.tsx

**Responsibilities:**
- Render vintage TV enclosure with wood styling
- Provide PowerButton and ChannelKnob controls
- Contain Screen component

**Props Interface:**
```typescript
interface TVHousingProps {
  isOn: boolean;
  onPowerToggle: () => void;
  onChannelChange: (direction: 'next' | 'prev') => void;
  children: React.ReactNode; // Screen component
}
```

### Screen.tsx

**Responsibilities:**
- Display content based on current app state
- Apply CRT visual effects (scanlines, vignette, flicker, phosphor glow)
- Handle typewriter text animations for boot sequence
- Manage keyboard input for menu navigation and game interactions
- Display images and video overlays
- Coordinate with game services

**Props Interface:**
```typescript
interface ScreenProps {
  appState: AppState;
  candlesLit: { left: boolean; right: boolean };
  onStateChange: (newState: AppState) => void;
}
```

**Internal State:**
```typescript
interface ScreenState {
  menuSelection: number;
  messages: string[];
  userInput: string;
  currentImage: string | null;
  currentVideo: string | null;
  roundCount: number;
}
```

### EquipmentRack.tsx

**Responsibilities:**
- Render audio control interface
- Handle play/pause, skip, and volume controls
- Display VU meter visualization
- Communicate with sound utility

**Props Interface:**
```typescript
interface EquipmentRackProps {
  onVolumeChange: (volume: number) => void;
  onPlayPause: () => void;
  onSkip: () => void;
  audioLevel: number; // for VU meter
}
```

## Data Models

### Game State Types

```typescript
type AppState = 'OFF' | 'STATIC_BOOT' | 'SYSTEM_BOOT' | 'MAIN_MENU' | 
                'TRUTH_OR_DARE' | 'WHISPERS' | 'CONFESS';

interface TruthOrDareState {
  roundCount: number;
  usedTruths: Set<string>;
  usedDares: Set<string>;
  lastDareAudioIndex: number; // for alternating kill sounds
  candleDareActive: boolean;
  candleDareComplete: boolean;
}

interface Message {
  text: string;
  sender: 'ai' | 'user' | 'system';
  timestamp: number;
}
```

### Audio Configuration

```typescript
interface AudioTrack {
  src: string;
  loop: boolean;
  volume: number; // 0-1
}

interface AudioState {
  masterVolume: number; // 0-1
  musicVolume: number; // 0-1, affected by ducking
  currentTrack: string;
  isPlaying: boolean;
  isDucked: boolean;
}

interface VoiceConfig {
  voiceId: string;
  stability: number;
  similarityBoost: number;
}
```

### API Request/Response Types

```typescript
interface GeminiRequest {
  prompt: string;
  systemPrompt: string;
  maxTokens: number;
}

interface GeminiResponse {
  text: string;
}

interface TTSRequest {
  text: string;
  voiceConfig: VoiceConfig;
}

interface TTSResponse {
  audioUrl: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Channel knob rotation triggers sound and transition

*For any* channel knob rotation event, the system should play a click sound effect and display a static transition for 300ms before switching modes.
**Validates: Requirements 3.1, 3.2**

### Property 2: Mode cycling maintains correct order

*For any* sequence of channel changes, the system should cycle through modes in the order: main menu → Truth or Dare → Whispers → Confess → main menu.
**Validates: Requirements 3.3, 3.4**

### Property 3: CRT effects are always applied

*For any* content displayed on the TV interface, the system should apply scanline, vignette, and flicker effects to the screen element.
**Validates: Requirements 4.1, 4.2, 4.3**

### Property 4: Text rendering uses phosphor styling

*For any* text displayed on screen, the system should render it in phosphor green color with glow effects and monospace font.
**Validates: Requirements 4.4, 4.5**

### Property 5: User input triggers AI service

*For any* user response in Truth or Dare mode, the system should send the input to the AI service and display the generated response.
**Validates: Requirements 5.2**

### Property 6: AI responses are formatted correctly

*For any* AI service response, the system should ensure it contains maximum 15 words in lowercase and ends with "truth or dare?".
**Validates: Requirements 6.1, 6.2, 6.3**

### Property 7: Truth questions are unique until exhausted

*For any* sequence of 10 truth question selections, all questions should be unique and selected from the predefined array.
**Validates: Requirements 7.1, 7.2**

### Property 8: Dare texts are from predefined array

*For any* dare presented after round 1, the dare text should be selected from the predefined array of eight dare texts.
**Validates: Requirements 7.3**

### Property 9: Kill sounds alternate in rounds 3+

*For any* sequence of dares in rounds 3 and later, the system should alternate between kill.mp3 and kill-2.mp3.
**Validates: Requirements 7.5**

### Property 10: Play/pause toggles music state

*For any* play/pause button click, the system should toggle the background music playback state.
**Validates: Requirements 10.4**

### Property 11: Skip cycles between two tracks

*For any* sequence of skip button clicks, the system should alternate between music-box-loop.mp3 and piano.mp3.
**Validates: Requirements 10.5**

### Property 12: TTS triggers audio ducking

*For any* TTS playback start event, the system should fade background music to 8% of master volume, and restore to 60% when TTS stops.
**Validates: Requirements 11.1, 11.2**

### Property 13: Game modes mute background music

*For any* game mode activation (Truth or Dare, Whispers, Confess), the system should mute background music to 0% volume.
**Validates: Requirements 11.3**

### Property 14: Menu restores music volume

*For any* return to main menu, the system should restore background music to 60% of master volume.
**Validates: Requirements 11.4**

### Property 15: Volume knob adjusts master volume

*For any* volume knob rotation, the system should adjust master volume proportionally and apply the change to all audio sources.
**Validates: Requirements 12.1, 12.2**

### Property 16: Interactive elements generate click sounds

*For any* interactive element click, the system should generate a click sound using Web Audio API with sine wave sweep from 800Hz to 200Hz.
**Validates: Requirements 13.1**

### Property 17: Static transition generates white noise

*For any* static transition playback, the system should generate white noise with bandpass filter using Web Audio API.
**Validates: Requirements 13.2**

### Property 18: Candle clicks generate match strike sound

*For any* candle click during candle dare, the system should generate a noise burst simulating a match strike using Web Audio API.
**Validates: Requirements 13.3**

### Property 19: ESC key exits game modes

*For any* ESC key press while in a game mode, the system should stop all TTS and game audio, restore music volume to 60%, clear messages, and return to main menu.
**Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5**

### Property 20: Arrow keys navigate menu

*For any* up or down arrow key press in main menu, the system should move selection to the previous or next menu option respectively.
**Validates: Requirements 15.2, 15.3**

### Property 21: Enter activates menu selection

*For any* Enter key press in main menu, the system should activate the currently selected menu option.
**Validates: Requirements 15.4**

### Property 22: TTS uses ElevenLabs API

*For any* TTS narration playback, the system should use ElevenLabs API to generate speech.
**Validates: Requirements 16.1**

### Property 23: Truth or Dare uses random voices

*For any* TTS response in Truth or Dare mode, the system should randomly select from multiple creepy voice configurations.
**Validates: Requirements 16.3**

### Property 24: Mode changes cancel TTS

*For any* ESC key press or game mode change, the system should cancel any active TTS playback.
**Validates: Requirements 16.4**

### Property 25: AI requests use correct model

*For any* AI service request, the system should use Google Gemini API with gemini-2.0-flash-lite model and include the painter persona system prompt.
**Validates: Requirements 17.1, 17.2**

### Property 26: AI responses are constrained

*For any* AI service response, the system should ensure it contains maximum 15 words and uses lowercase formatting.
**Validates: Requirements 17.3, 17.4**

### Property 27: Videos display with CRT effects

*For any* video playback, the system should display it as a fullscreen overlay with scanline and vignette effects maintained.
**Validates: Requirements 18.1, 18.2, 18.3**

### Property 28: Video end triggers state transition

*For any* video end event, the system should remove the overlay and continue game flow or return to main menu.
**Validates: Requirements 18.4**

### Property 29: VU meter reflects audio levels

*For any* audio playback or volume change, the system should display animated VU meter bars with heights proportional to audio levels.
**Validates: Requirements 19.1, 19.2**

## Error Handling

### API Failures

**Gemini API Errors:**
- Network timeout: Display fallback message "the machine is silent..." and allow retry
- Invalid API key: Log error to console, display generic error message
- Rate limiting: Queue requests and retry with exponential backoff
- Malformed response: Use fallback response "..." and continue game

**ElevenLabs API Errors:**
- Network timeout: Skip TTS and display text only
- Invalid API key: Log error, fall back to text-only mode
- Voice not found: Use default voice configuration
- Audio playback failure: Continue without audio

### Audio System Errors

**Web Audio API Failures:**
- Context creation failure: Disable all audio features, continue with visual-only experience
- Audio file load failure: Log error, skip audio, continue game flow
- Playback interruption: Attempt to resume, fall back to restarting track

**Sound Generation Errors:**
- Oscillator creation failure: Skip procedural sound effect
- Invalid frequency parameters: Use default safe values (440Hz)

### State Management Errors

**Invalid State Transitions:**
- Validate state changes before applying
- Log invalid transitions to console
- Maintain current state if transition is invalid

**Component Unmount During Async Operations:**
- Use cleanup functions in useEffect to cancel pending operations
- Check component mount status before state updates
- Cancel TTS and API requests on unmount

### User Input Errors

**Invalid Keyboard Input:**
- Ignore unrecognized keys
- Validate menu selection bounds before applying
- Sanitize text input before sending to AI service

**Video Playback Errors:**
- Video file not found: Display error message, return to menu
- Playback failure: Log error, return to previous state
- Codec not supported: Display compatibility message

## Testing Strategy

### Unit Testing

The application will use Vitest as the testing framework for unit tests. Unit tests will focus on:

**Component Rendering:**
- Test that each component renders without crashing
- Verify correct props are passed to child components
- Test conditional rendering based on state

**State Management:**
- Test state transitions in App component
- Verify state updates trigger correct re-renders
- Test state lifting and prop drilling

**Service Functions:**
- Test API request formatting for Gemini and ElevenLabs
- Test response parsing and error handling
- Test game logic in truthOrDareService (question selection, round counting)

**Audio Utilities:**
- Test volume calculations and ducking logic
- Test track sequencing and crossfade timing
- Test master volume application to all sources

**Example Unit Tests:**
- Test that clicking power button when off transitions to STATIC_BOOT state
- Test that 4 completed rounds in Truth or Dare triggers ending sequence
- Test that truth question selection doesn't repeat until all are used
- Test that ESC key in any game mode returns to MAIN_MENU

### Property-Based Testing

The application will use fast-check as the property-based testing library for JavaScript/TypeScript. Property tests will verify universal behaviors across many randomly generated inputs.

**Configuration:**
- Each property test will run a minimum of 100 iterations
- Tests will use custom generators for domain-specific data (game states, audio levels, etc.)
- Each test will be tagged with a comment referencing the design document property

**Property Test Coverage:**
- Channel rotation cycling (Property 2)
- CRT effects application (Property 3, 4)
- AI response formatting (Property 6)
- Truth question uniqueness (Property 7)
- Audio ducking behavior (Property 12, 13, 14)
- Volume adjustments (Property 15)
- ESC key behavior (Property 19)
- Menu navigation (Property 20, 21)
- Video overlay effects (Property 27)

**Custom Generators:**
```typescript
// Generate random app states
const appStateArbitrary = fc.constantFrom(
  'OFF', 'STATIC_BOOT', 'SYSTEM_BOOT', 'MAIN_MENU',
  'TRUTH_OR_DARE', 'WHISPERS', 'CONFESS'
);

// Generate random volume levels (0-1)
const volumeArbitrary = fc.float({ min: 0, max: 1 });

// Generate random menu selections (0-2)
const menuSelectionArbitrary = fc.integer({ min: 0, max: 2 });

// Generate random truth/dare responses
const userResponseArbitrary = fc.string({ minLength: 1, maxLength: 100 });
```

### Integration Testing

Integration tests will verify interactions between components and services:

- Test full game flow from power on to game completion
- Test audio system integration with TTS and background music
- Test keyboard event handling across component boundaries
- Test video overlay integration with game state management

### Manual Testing Checklist

Due to the audio-visual nature of the application, manual testing is essential:

- Verify CRT visual effects appear correctly across browsers
- Test audio crossfades and ducking sound natural
- Verify TTS voice quality and timing
- Test candle click interactions and visual feedback
- Verify video playback with effects overlay
- Test keyboard navigation feels responsive
- Verify all audio files load and play correctly

## Implementation Notes

### Performance Considerations

**Audio Management:**
- Preload all audio files on application start to avoid playback delays
- Use audio sprites for short sound effects to reduce HTTP requests
- Implement audio context resume on user interaction (required by browser autoplay policies)

**Animation Performance:**
- Use CSS transforms for animations (GPU accelerated)
- Limit particle count for dust animations to maintain 60fps
- Use requestAnimationFrame for VU meter updates

**State Updates:**
- Batch state updates where possible to minimize re-renders
- Use React.memo for components that don't need frequent updates
- Implement debouncing for volume knob rotation events

### Browser Compatibility

**Target Browsers:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Polyfills/Fallbacks:**
- Web Audio API is well-supported, no polyfill needed
- CSS Grid and Flexbox for layout (widely supported)
- Fallback to text-only mode if TTS fails

### Security Considerations

**API Key Management:**
- Store API keys in environment variables (VITE_GEMINI_API_KEY, VITE_ELEVENLABS_API_KEY)
- Never commit API keys to version control
- Use .env.local for local development

**Input Sanitization:**
- Sanitize user input before sending to AI service
- Validate AI responses before displaying
- Escape HTML in user-generated content

**Content Security:**
- Implement Content Security Policy headers
- Validate video and audio file sources
- Use HTTPS for all API requests

### Accessibility Considerations

While this is a horror experience with specific visual/audio requirements, basic accessibility should be maintained:

- Provide keyboard navigation for all interactive elements
- Ensure sufficient color contrast for text (phosphor green on black meets WCAG AA)
- Allow users to control master volume
- Provide ESC key as universal exit mechanism

### Development Workflow

**Project Setup:**
1. Initialize Vite project with React and TypeScript
2. Configure Tailwind CSS via CDN in index.html
3. Set up environment variables for API keys
4. Install dependencies: fast-check, vitest, @testing-library/react

**Development Phases:**
1. Core UI components (TV housing, screen, equipment rack)
2. State management and navigation
3. Audio system implementation
4. Game mode implementations (one at a time)
5. API integrations (Gemini, ElevenLabs)
6. Visual effects and polish
7. Testing and bug fixes

**Testing During Development:**
- Write property tests alongside implementation
- Run tests frequently during development
- Use Vitest watch mode for rapid feedback
- Manual testing for audio/visual verification
