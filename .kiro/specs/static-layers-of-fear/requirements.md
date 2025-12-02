# Requirements Document

## Introduction

Static Layers of Fear is a psychological horror web application that simulates a vintage 1970s CRT television interface. The system provides an immersive horror experience through interactive game modes, atmospheric audio, text-to-speech narration, and AI-generated responses. Users interact with a retro TV interface featuring phosphor green terminal text, CRT visual effects, and multiple horror game modes accessible via channel navigation.

## Glossary

- **System**: The Static Layers of Fear web application
- **CRT**: Cathode Ray Tube display simulation with scanlines, phosphor glow, and flicker effects
- **TV Interface**: The main visual component simulating a 1970s television set
- **Channel Knob**: A rotatable UI control for switching between game modes
- **Power Button**: A toggle control for turning the TV Interface on and off
- **Game Mode**: One of three interactive horror experiences (Truth or Dare, Whispers, Confess)
- **Equipment Rack**: Audio control panel with play/pause, skip, volume, and VU meter
- **TTS**: Text-to-speech audio narration using ElevenLabs API
- **AI Service**: Google Gemini API for generating contextual horror responses
- **Audio Ducking**: Automatic volume reduction of background music during speech
- **Candle Dare**: A specific interactive challenge requiring user to click candle elements
- **Round**: A single question-answer cycle in Truth or Dare mode
- **Master Volume**: Global audio level controlled by Equipment Rack volume knob
- **Static Transition**: Brief white noise effect displayed when switching channels
- **Boot Sequence**: Startup animation showing terminal text with typewriter effect
- **Video Overlay**: Full-screen video player with CRT effects maintained

## Requirements

### Requirement 1

**User Story:** As a user, I want to see a vintage TV interface with atmospheric elements, so that I feel immersed in a retro horror environment.

#### Acceptance Criteria

1. WHEN the application loads THEN the System SHALL display a dark background with dust particle animations
2. WHEN the application loads THEN the System SHALL display two clickable candles with flame flicker animations positioned on either side of the TV Interface
3. WHEN the application loads THEN the System SHALL display a wooden shelf supporting the TV Interface
4. WHEN the application loads THEN the System SHALL display an Equipment Rack below the TV Interface with visible audio controls
5. WHEN the TV Interface is displayed THEN the System SHALL render a wooden enclosure with vintage styling and a glass screen area

### Requirement 2

**User Story:** As a user, I want to control the TV power state, so that I can turn the experience on and off.

#### Acceptance Criteria

1. WHEN the user clicks the Power Button while the TV Interface is off THEN the System SHALL play a Static Transition for 1.5 seconds followed by a Boot Sequence
2. WHEN the user clicks the Power Button while the TV Interface is on THEN the System SHALL play a CRT collapse animation and transition to a black screen
3. WHEN the Boot Sequence completes THEN the System SHALL display the main menu with phosphor green text

### Requirement 3

**User Story:** As a user, I want to navigate between different horror experiences using a channel knob, so that I can choose which game mode to play.

#### Acceptance Criteria

1. WHEN the user rotates the Channel Knob THEN the System SHALL play a click sound effect
2. WHEN the user rotates the Channel Knob THEN the System SHALL display a Static Transition for 300 milliseconds
3. WHEN the Static Transition completes THEN the System SHALL switch to the next or previous Game Mode in rotation sequence
4. WHEN switching Game Modes THEN the System SHALL cycle through main menu, Truth or Dare, Whispers, and Confess in order

### Requirement 4

**User Story:** As a user, I want to see CRT visual effects on the screen, so that the retro television aesthetic feels authentic.

#### Acceptance Criteria

1. WHEN any content is displayed on the TV Interface THEN the System SHALL apply scanline overlay effects to the screen area
2. WHEN any content is displayed on the TV Interface THEN the System SHALL apply vignette darkening to screen edges
3. WHEN any content is displayed on the TV Interface THEN the System SHALL apply subtle flicker animation to simulate CRT instability
4. WHEN text is displayed THEN the System SHALL render it in phosphor green color with glow effect using multiple box shadows
5. WHEN text is displayed THEN the System SHALL use monospace font family

### Requirement 5

**User Story:** As a user, I want to play Truth or Dare, so that I can experience an interactive psychological horror game.

#### Acceptance Criteria

1. WHEN Truth or Dare mode starts THEN the System SHALL display the question "truth or dare?" using AI Service
2. WHEN the user types a response THEN the System SHALL send the input to AI Service and display the generated response
3. WHEN four Rounds have been completed THEN the System SHALL play alfred-intro.mp3 audio file and return to main menu
4. WHEN the first Round is a dare THEN the System SHALL display the text "light the candles for me..." and show innocent.jpg image
5. WHEN the user clicks the first candle during Candle Dare THEN the System SHALL change the displayed image to decay.jpg
6. WHEN the user clicks both candles during Candle Dare THEN the System SHALL play creep.mp4 as a Video Overlay and continue the game after video ends

### Requirement 6

**User Story:** As a user, I want the AI to respond to my truth answers with unsettling reactions, so that the horror atmosphere is maintained.

#### Acceptance Criteria

1. WHEN the user answers a truth question THEN the System SHALL send the answer to AI Service with a prompt requesting a brief unsettling reaction
2. WHEN AI Service returns a response THEN the System SHALL display the response with maximum 15 words in lowercase
3. WHEN the AI response is displayed THEN the System SHALL end the response with "truth or dare?"

### Requirement 7

**User Story:** As a user, I want to receive randomized truth questions and dare challenges, so that each playthrough feels unique.

#### Acceptance Criteria

1. WHEN the System selects a truth question THEN the System SHALL choose randomly from a predefined array of ten truth questions
2. WHEN the System selects a truth question THEN the System SHALL not repeat any question until all questions have been used
3. WHEN the System presents a dare after Round 1 THEN the System SHALL select randomly from a predefined array of eight dare texts
4. WHEN the System presents a dare in Round 2 THEN the System SHALL play tanya.mp3 audio file
5. WHEN the System presents a dare in Round 3 or later THEN the System SHALL play either kill.mp3 or kill-2.mp3 alternating between them

### Requirement 8

**User Story:** As a user, I want to experience the Whispers mode, so that I can hear narration followed by a video.

#### Acceptance Criteria

1. WHEN Whispers mode starts THEN the System SHALL play TTS narration with the text "do you want to hear my whispers... love? come closer... let me tell you what the dead have told me..."
2. WHEN TTS narration completes THEN the System SHALL display "PRESS ENTER TO CONTINUE • ESC TO GO BACK" on screen
3. WHEN the user presses Enter key THEN the System SHALL play the whispers video as a Video Overlay
4. WHEN the whispers video ends THEN the System SHALL return to main menu

### Requirement 9

**User Story:** As a user, I want to experience the Confess mode, so that I can view a video immediately.

#### Acceptance Criteria

1. WHEN Confess mode starts THEN the System SHALL immediately play the confess video as a Video Overlay
2. WHEN the confess video ends THEN the System SHALL return to main menu

### Requirement 10

**User Story:** As a user, I want to control background music playback, so that I can manage the audio experience.

#### Acceptance Criteria

1. WHEN the application starts THEN the System SHALL play buffalo-intro.mp3 without looping
2. WHEN buffalo-intro.mp3 ends THEN the System SHALL crossfade to snip.mp3 without looping
3. WHEN snip.mp3 ends THEN the System SHALL crossfade to music-box-loop.mp3 and loop it indefinitely
4. WHEN the user clicks the play/pause button on Equipment Rack THEN the System SHALL toggle background music playback state
5. WHEN the user clicks the skip track button on Equipment Rack THEN the System SHALL cycle between music-box-loop.mp3 and piano.mp3

### Requirement 11

**User Story:** As a user, I want background music to automatically adjust during speech and game modes, so that audio elements don't compete for attention.

#### Acceptance Criteria

1. WHEN TTS begins speaking THEN the System SHALL fade background music volume to 8 percent of Master Volume
2. WHEN TTS stops speaking THEN the System SHALL fade background music volume to 60 percent of Master Volume
3. WHEN any Game Mode is active THEN the System SHALL mute background music to 0 percent volume
4. WHEN returning to main menu THEN the System SHALL restore background music to 60 percent of Master Volume

### Requirement 12

**User Story:** As a user, I want to adjust the master volume, so that I can control overall audio loudness.

#### Acceptance Criteria

1. WHEN the user rotates the volume knob on Equipment Rack THEN the System SHALL adjust Master Volume proportionally to knob rotation
2. WHEN Master Volume changes THEN the System SHALL apply the new volume level to all audio sources proportionally

### Requirement 13

**User Story:** As a user, I want to hear procedural sound effects for interactions, so that the interface feels responsive and immersive.

#### Acceptance Criteria

1. WHEN the user clicks any interactive element THEN the System SHALL generate a click sound using Web Audio API with sine wave sweep from 800Hz to 200Hz
2. WHEN Static Transition plays THEN the System SHALL generate white noise with bandpass filter using Web Audio API
3. WHEN the user clicks a candle during Candle Dare THEN the System SHALL generate a noise burst simulating a match strike using Web Audio API

### Requirement 14

**User Story:** As a user, I want to use the ESC key to exit any game mode, so that I can quickly return to the main menu.

#### Acceptance Criteria

1. WHEN the user presses ESC key while in any Game Mode THEN the System SHALL stop all TTS playback immediately
2. WHEN the user presses ESC key while in any Game Mode THEN the System SHALL stop all game-specific audio files immediately
3. WHEN the user presses ESC key while in any Game Mode THEN the System SHALL restore background music volume to 60 percent of Master Volume
4. WHEN the user presses ESC key while in any Game Mode THEN the System SHALL clear all displayed messages
5. WHEN the user presses ESC key while in any Game Mode THEN the System SHALL return to main menu state

### Requirement 15

**User Story:** As a user, I want to navigate the main menu with keyboard controls, so that I can select game modes without using a mouse.

#### Acceptance Criteria

1. WHEN the main menu is displayed THEN the System SHALL show three selectable options with visual highlighting
2. WHEN the user presses up arrow key THEN the System SHALL move selection to the previous menu option
3. WHEN the user presses down arrow key THEN the System SHALL move selection to the next menu option
4. WHEN the user presses Enter key THEN the System SHALL activate the currently selected menu option

### Requirement 16

**User Story:** As a user, I want TTS narration with varied voices, so that the audio experience feels dynamic and unsettling.

#### Acceptance Criteria

1. WHEN the System plays TTS narration THEN the System SHALL use ElevenLabs API to generate speech
2. WHEN the System plays narration in Whispers mode THEN the System SHALL use a creepy woman voice configuration
3. WHEN the System plays responses in Truth or Dare mode THEN the System SHALL randomly select from multiple creepy voice configurations
4. WHEN the user presses ESC key or changes Game Mode THEN the System SHALL cancel any active TTS playback

### Requirement 17

**User Story:** As a user, I want AI-generated responses that match a specific horror persona, so that the narrative feels cohesive.

#### Acceptance Criteria

1. WHEN the System requests AI responses THEN the System SHALL use Google Gemini API with gemini-2.0-flash-lite model
2. WHEN the System sends prompts to AI Service THEN the System SHALL include a system prompt describing a lonely broken painter persona trapped in the machine
3. WHEN AI Service returns responses THEN the System SHALL ensure responses contain maximum 15 words
4. WHEN AI Service returns responses THEN the System SHALL prefer lowercase text formatting

### Requirement 18

**User Story:** As a user, I want videos to play with CRT effects maintained, so that visual consistency is preserved during video playback.

#### Acceptance Criteria

1. WHEN the System plays any video THEN the System SHALL display the video as a Video Overlay covering the entire screen
2. WHEN a Video Overlay is displayed THEN the System SHALL maintain scanline effects over the video content
3. WHEN a Video Overlay is displayed THEN the System SHALL maintain vignette effects over the video content
4. WHEN a video ends THEN the System SHALL remove the Video Overlay and continue game flow or return to main menu

### Requirement 19

**User Story:** As a user, I want to see a VU meter visualization, so that I can see audio levels visually represented.

#### Acceptance Criteria

1. WHEN audio is playing THEN the System SHALL display animated bars on the Equipment Rack VU meter
2. WHEN audio volume changes THEN the System SHALL update VU meter bar heights proportionally to audio levels
