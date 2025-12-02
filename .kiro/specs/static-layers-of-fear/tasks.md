# Implementation Plan

- [x] 1. Set up project structure and core types





  - Initialize Vite project with React 19 and TypeScript
  - Configure Tailwind CSS via CDN in index.html
  - Create types.ts with AppState, TruthOrDareState, AudioState, and API types
  - Set up environment variables for VITE_GEMINI_API_KEY and VITE_ELEVENLABS_API_KEY
  - Install dependencies: fast-check, vitest, @testing-library/react
  - _Requirements: All requirements depend on this foundation_
-

- [x] 2. Implement audio system with Web Audio API



  - [x] 2.1 Create sound.ts utility with audio context and master volume control


    - Implement Web Audio API context initialization
    - Create functions for procedural sound generation (click, static, match strike)
    - Implement background music sequencing (buffalo-intro → snip → music-box-loop)
    - Add crossfade logic between tracks
    - Implement audio ducking system (8% during TTS, 60% normal, 0% in game modes)
    - Add play/pause and skip track controls
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 11.1, 11.2, 11.3, 11.4, 12.1, 12.2, 13.1, 13.2, 13.3_
  - [ ]* 2.2 Write property test for audio ducking behavior
    - **Property 12: TTS triggers audio ducking**
    - **Validates: Requirements 11.1, 11.2**
  - [ ]* 2.3 Write property test for volume knob adjustments
    - **Property 15: Volume knob adjusts master volume**
    - **Validates: Requirements 12.1, 12.2**
  - [ ]* 2.4 Write property test for play/pause toggle
    - **Property 10: Play/pause toggles music state**
    - **Validates: Requirements 10.4**
  - [ ]* 2.5 Write property test for skip track cycling
    - **Property 11: Skip cycles between two tracks**

    - **Validates: Requirements 10.5**

- [x] 3. Build core UI components with CRT effects



  - [x] 3.1 Create App.tsx with root state management


    - Implement AppState state machine (OFF, STATIC_BOOT, SYSTEM_BOOT, MAIN_MENU, game modes)
    - Add candle state management (leftCandleLit, rightCandleLit)
    - Implement global ESC key handler
    - Create candle components with click handlers and flicker animations
    - Add dark background with dust particle animations
    - _Requirements: 1.1, 1.2, 14.1, 14.2, 14.3, 14.4, 14.5_
  - [x] 3.2 Create TVHousing.tsx component


    - Render wooden TV enclosure with vintage styling
    - Implement PowerButton with on/off toggle and CRT collapse animation
    - Implement ChannelKnob with rotation interaction
    - Add speaker grille visual
    - _Requirements: 1.3, 1.5, 2.1, 2.2, 3.1, 3.2_
  - [x] 3.3 Create Screen.tsx with CRT visual effects


    - Apply scanline overlay using CSS
    - Apply vignette darkening to edges
    - Add subtle flicker animation
    - Implement phosphor green text styling with glow effects
    - Handle different app states (OFF, STATIC_BOOT, SYSTEM_BOOT, MAIN_MENU)
    - Add typewriter effect for boot sequence
    - _Requirements: 2.3, 4.1, 4.2, 4.3, 4.4, 4.5_
  - [x] 3.4 Create EquipmentRack.tsx component


    - Render audio control panel below TV
    - Add play/pause button
    - Add skip track button
    - Add rotatable volume knob
    - Implement VU meter visualization with animated bars
    - _Requirements: 1.4, 19.1, 19.2_
  - [ ]* 3.5 Write property test for CRT effects application
    - **Property 3: CRT effects are always applied**
    - **Validates: Requirements 4.1, 4.2, 4.3**
  - [ ]* 3.6 Write property test for text rendering
    - **Property 4: Text rendering uses phosphor styling**
    - **Validates: Requirements 4.4, 4.5**
  - [ ]* 3.7 Write property test for ESC key behavior
    - **Property 19: ESC key exits game modes**
    - **Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5**

- [x] 4. Implement main menu with keyboard navigation




  - [x] 4.1 Add main menu UI to Screen.tsx


    - Display three selectable options (Truth or Dare, Whispers, Confess)
    - Implement visual highlighting for selected option
    - Handle up/down arrow key navigation
    - Handle Enter key to activate selection
    - _Requirements: 15.1, 15.2, 15.3, 15.4_
  - [ ]* 4.2 Write property test for arrow key navigation
    - **Property 20: Arrow keys navigate menu**
    - **Validates: Requirements 15.2, 15.3**
  - [ ]* 4.3 Write property test for Enter key activation
    - **Property 21: Enter activates menu selection**
    - **Validates: Requirements 15.4**
  - [ ]* 4.4 Write property test for channel knob mode cycling
    - **Property 2: Mode cycling maintains correct order**
    - **Validates: Requirements 3.3, 3.4**
- [x] 5. Implement API services




- [ ] 5. Implement API services

  - [x] 5.1 Create geminiService.ts


    - Implement API request function using fetch
    - Add system prompt for lonely broken painter persona
    - Implement response formatting (max 15 words, lowercase, append "truth or dare?")
    - Add error handling with fallback messages
    - _Requirements: 6.1, 6.2, 6.3, 17.1, 17.2, 17.3, 17.4_
  - [x] 5.2 Create ttsService.ts


    - Implement ElevenLabs API integration
    - Add multiple creepy voice configurations
    - Implement voice selection logic (specific for Whispers, random for Truth or Dare)
    - Add TTS cancellation support
    - Integrate with audio ducking system
    - _Requirements: 16.1, 16.2, 16.3, 16.4_
  - [ ]* 5.3 Write property test for AI response formatting
    - **Property 6: AI responses are formatted correctly**
    - **Validates: Requirements 6.1, 6.2, 6.3**
  - [ ]* 5.4 Write property test for AI request configuration
    - **Property 25: AI requests use correct model**
    - **Validates: Requirements 17.1, 17.2**
-

- [x] 6. Implement Truth or Dare game mode



  - [x] 6.1 Create truthOrDareService.ts


    - Define arrays of 10 truth questions and 8 dare texts
    - Implement random selection without repeats for truths
    - Implement random selection for dares
    - Add round counting logic
    - Implement alternating kill sound logic for rounds 3+
    - _Requirements: 7.1, 7.2, 7.3, 7.5_
  - [x] 6.2 Add Truth or Dare UI to Screen.tsx

    - Display AI messages and user input
    - Handle user text input
    - Implement candle dare logic (show images, detect candle clicks)
    - Play appropriate audio for each round (tanya.mp3 for round 2, kill sounds for 3+)
    - Play alfred-intro.mp3 after 4 rounds and return to menu
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 7.4_
  - [ ]* 6.3 Write property test for truth question uniqueness
    - **Property 7: Truth questions are unique until exhausted**
    - **Validates: Requirements 7.1, 7.2**
  - [ ]* 6.4 Write property test for dare text selection
    - **Property 8: Dare texts are from predefined array**
    - **Validates: Requirements 7.3**
  - [ ]* 6.5 Write property test for kill sound alternation
    - **Property 9: Kill sounds alternate in rounds 3+**
    - **Validates: Requirements 7.5**
-

- [x] 7. Implement Whispers and Confess modes with video overlay



  - [x] 7.1 Add video overlay component to Screen.tsx


    - Create fullscreen video overlay with CRT effects (scanlines, vignette)
    - Handle video end events to transition state
    - _Requirements: 18.1, 18.2, 18.3, 18.4_
  - [x] 7.2 Implement Whispers mode


    - Play TTS narration on mode start
    - Display "PRESS ENTER TO CONTINUE • ESC TO GO BACK" after narration
    - Play whispers video on Enter key
    - Return to menu after video ends
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - [x] 7.3 Implement Confess mode


    - Play confess video immediately on mode start
    - Return to menu after video ends
    - _Requirements: 9.1, 9.2_
  - [ ]* 7.4 Write property test for video overlay effects
    - **Property 27: Videos display with CRT effects**
    - **Validates: Requirements 18.1, 18.2, 18.3**
  - [ ]* 7.5 Write property test for video end transitions
    - **Property 28: Video end triggers state transition**
    - **Validates: Requirements 18.4**

- [x] 8. Final integration and polish





  - Wire all components together in App.tsx
  - Ensure all state transitions work correctly
  - Test audio sequencing and ducking across all modes
  - Verify keyboard controls work in all states
  - Add any missing error handling
  - _Requirements: All requirements_
