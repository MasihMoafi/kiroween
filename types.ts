export enum Sender {
  USER = 'USER',
  AI = 'AI',
  SYSTEM = 'SYSTEM'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: number;
}

export enum AppState {
  STATIC_BOOT = 'STATIC_BOOT',
  SYSTEM_BOOT = 'SYSTEM_BOOT',
  MAIN_MENU = 'MAIN_MENU',
  TRUTH_OR_DARE = 'TRUTH_OR_DARE',  // Truth or Dare game with chatbot
  WHISPERS = 'WHISPERS',            // Scary stories with voice + image
  CONFESS = 'CONFESS',              // Terminal chat with AI
  DORIAN_GRAY = 'DORIAN_GRAY',      // Images that transform from calm to horrifying
  ACTIVE = 'ACTIVE',
  OFF = 'OFF'
}

export interface TerminalConfig {
  glitchIntensity: number;
  audioEnabled: boolean;
}