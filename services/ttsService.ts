// ElevenLabs TTS Service with audio ducking

import { duckAudio, unduckAudio } from '../utils/sound';

const API_KEY = 'sk_d1dfa75ad0480ab3ceaf4f5431507b9452c9be9d9efe25b9';
const VOICE_ID = 'pqHfZKP75CvOlQylNhV4'; // Bill - deep, mysterious voice
const WHISPER_VOICE_ID = 'z9fAnlkpzviPz146aGWa'; // Glinda - witch-like, unsettling

// Creepy voice configurations for variety
const CREEPY_VOICES = [
  {
    id: 'z9fAnlkpzviPz146aGWa', // Glinda - witch
    settings: { stability: 0.1, similarity_boost: 0.95, style: 0.8, use_speaker_boost: true }
  },
  {
    id: 'pqHfZKP75CvOlQylNhV4', // Bill - deep male, made creepy
    settings: { stability: 0.2, similarity_boost: 0.9, style: 0.6, use_speaker_boost: true }
  },
  {
    id: 'z9fAnlkpzviPz146aGWa', // Glinda - more unstable/distorted
    settings: { stability: 0.05, similarity_boost: 1.0, style: 0.9, use_speaker_boost: true }
  },
  {
    id: 'pqHfZKP75CvOlQylNhV4', // Bill - whisper-like
    settings: { stability: 0.15, similarity_boost: 0.85, style: 0.7, use_speaker_boost: false }
  },
];

let currentAudio: HTMLAudioElement | null = null;
let speechCancelled = false;

export const stopSpeech = () => {
  speechCancelled = true; // Prevent any pending TTS from playing
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
    unduckAudio();
  }
};

// Reset cancelled flag when starting new speech
const resetCancelled = () => {
  speechCancelled = false;
};

export const speakWithGemini = (text: string): Promise<void> => {
  return new Promise(async (resolve) => {
    stopSpeech();
    resetCancelled();

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          }
        })
      });

      if (!response.ok) {
        console.error('ElevenLabs TTS Error:', response.status);
        resolve();
        return;
      }

      // Check if cancelled while fetching
      if (speechCancelled) {
        resolve();
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Check again after blob processing
      if (speechCancelled) {
        URL.revokeObjectURL(audioUrl);
        resolve();
        return;
      }

      const audio = new Audio(audioUrl);
      audio.volume = 0.9;
      currentAudio = audio;

      duckAudio();

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        unduckAudio();
        resolve();
      };

      audio.onerror = () => {
        unduckAudio();
        resolve();
      };

      audio.play().catch(err => {
        console.error('Audio play failed:', err);
        unduckAudio();
        resolve();
      });
    } catch (error) {
      console.error('TTS Error:', error);
      unduckAudio();
      resolve();
    }
  });
};

// Creepy witch voice for game narration
export const speakWithCreepyWoman = (text: string): Promise<void> => {
  return new Promise(async (resolve) => {
    stopSpeech();
    resetCancelled();

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${WHISPER_VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.15,
            similarity_boost: 0.95,
            style: 0.7,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        console.error('ElevenLabs TTS Error:', response.status);
        resolve();
        return;
      }

      if (speechCancelled) {
        resolve();
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (speechCancelled) {
        URL.revokeObjectURL(audioUrl);
        resolve();
        return;
      }

      const audio = new Audio(audioUrl);
      audio.volume = 0.95;
      currentAudio = audio;

      duckAudio();

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        unduckAudio();
        resolve();
      };

      audio.onerror = () => {
        unduckAudio();
        resolve();
      };

      audio.play().catch(err => {
        console.error('Audio play failed:', err);
        unduckAudio();
        resolve();
      });
    } catch (error) {
      console.error('TTS Error:', error);
      unduckAudio();
      resolve();
    }
  });
};

// Random creepy voice for Truth or Dare variety
export const speakWithRandomCreepyVoice = (text: string): Promise<void> => {
  return new Promise(async (resolve) => {
    stopSpeech();
    resetCancelled();

    // Pick a random voice configuration
    const voiceConfig = CREEPY_VOICES[Math.floor(Math.random() * CREEPY_VOICES.length)];

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: voiceConfig.settings
        })
      });

      if (!response.ok) {
        console.error('ElevenLabs TTS Error:', response.status);
        resolve();
        return;
      }

      if (speechCancelled) {
        resolve();
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (speechCancelled) {
        URL.revokeObjectURL(audioUrl);
        resolve();
        return;
      }

      const audio = new Audio(audioUrl);
      audio.volume = 0.95;
      currentAudio = audio;

      duckAudio();

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        unduckAudio();
        resolve();
      };

      audio.onerror = () => {
        unduckAudio();
        resolve();
      };

      audio.play().catch(err => {
        console.error('Audio play failed:', err);
        unduckAudio();
        resolve();
      });
    } catch (error) {
      console.error('TTS Error:', error);
      unduckAudio();
      resolve();
    }
  });
};

// Kind, gentle voice for Whispers intro
export const speakWithKindVoice = (text: string): Promise<void> => {
  return new Promise(async (resolve) => {
    stopSpeech();

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.85,
            similarity_boost: 0.5,
            style: 0.3,
            use_speaker_boost: false
          }
        })
      });

      if (!response.ok) {
        console.error('ElevenLabs TTS Error:', response.status);
        resolve();
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audio.volume = 0.85;
      currentAudio = audio;

      duckAudio();

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        unduckAudio();
        resolve();
      };

      audio.onerror = () => {
        unduckAudio();
        resolve();
      };

      audio.play().catch(err => {
        console.error('Audio play failed:', err);
        unduckAudio();
        resolve();
      });
    } catch (error) {
      console.error('TTS Error:', error);
      unduckAudio();
      resolve();
    }
  });
};

// Little Girl Voice for Truth or Dare
export const speakWithLittleGirl = (text: string): Promise<void> => {
  return new Promise(async (resolve) => {
    stopSpeech();
    resetCancelled();

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/MF3mGyEYCl7XYWbV9V6O`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.9,
            style: 0.5,
            use_speaker_boost: false
          }
        })
      });

      if (!response.ok) {
        console.error('ElevenLabs TTS Error:', response.status);
        resolve();
        return;
      }

      if (speechCancelled) {
        resolve();
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (speechCancelled) {
        URL.revokeObjectURL(audioUrl);
        resolve();
        return;
      }

      const audio = new Audio(audioUrl);
      audio.volume = 0.95;
      currentAudio = audio;

      duckAudio();

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        unduckAudio();
        resolve();
      };

      audio.onerror = () => {
        unduckAudio();
        resolve();
      };

      audio.play().catch(err => {
        console.error('Audio play failed:', err);
        unduckAudio();
        resolve();
      });
    } catch (error) {
      console.error('TTS Error:', error);
      unduckAudio();
      resolve();
    }
  });
};
