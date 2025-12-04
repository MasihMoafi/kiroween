# Static: Layers of Fear

Static: Layers of Fear is an interactive horror experience that immerses you in a dark, unsettling atmosphere. It's not about jump scares; it's about a slow-burning psychological dread that gets under your skin. The project is built around a vintage 1970s CRT television that flickers to life and communicates with you, blurring the lines between technology and the supernatural.

## Features

*   **Interactive CRT TV Interface:** Navigate a vintage TV menu with keyboard controls, complete with static, scanlines, and phosphor glow effects.
*   **Truth or Dare:** A four-round psychological game where an AI with a child's voice asks you increasingly disturbing questions and gives you creepy dares.
*   **Whispers from the Dead:** A haunting experience where a mysterious woman's voice shares secrets from the other side.
*   **Interactive Environment:** The scene is set with flickering candles that you can light, a dusty room, and a fully functional equipment rack with volume and skip controls.
*   **Immersive Audio:** The experience is backed by a carefully crafted soundscape, including background music, sound effects, and dynamic text-to-speech voices from ElevenLabs.

## About the Project

Inspired by horror games like "Layers of Fear" and the Black Ops terminal from Call of Duty, this project aims to create a sense of wrongness. The central idea is a piece of obsolete technology, a CRT TV, that becomes a conduit for something unsettling and intelligent. The goal is to create a memorable and genuinely creepy experience through atmosphere and psychological tension.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js and npm (or yarn/pnpm)
*   An API key from ElevenLabs for the text-to-speech features.

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username_/your_repository.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Create a `.env` file in the root of the project and add your ElevenLabs API key:
    ```
    VITE_ELEVENLABS_API_KEY=YOUR_API_KEY
    ```
4.  Run the development server
    ```sh
    npm run dev
    ```

## Built With

*   [React 18](https://reactjs.org/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Vite](https://vitejs.dev/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [Google Gemini API](https://ai.google.dev/)
*   [ElevenLabs Text-to-Speech API](https://elevenlabs.io/)
*   [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
*   [Vercel](https://vercel.com/)

## License

Distributed under the GNU GPL v3.0 License. See `LICENSE` for more information.
