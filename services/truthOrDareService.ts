// Truth or Dare Game Service
// Dark, unsettling game with specific audio triggers

const API_KEY = import.meta.env.GEMINI_API_KEY || 'AIzaSyBPhl9fMdTgbELhe4PM6TVsxVxy83XgN-o';
const MODEL_NAME = 'gemini-2.0-flash-lite';

const CREEPY_TRUTHS = [
  "have you ever thought about killing anyone...",
  "how many have you buried...",
  "if you could kill someone... who would it be...",
  "what's the most wicked thing you've done...",
  "who have you hurt that still haunts you...",
  "what secret would destroy you if it came out...",
  "whose death have you wished for...",
  "what do you see when you close your eyes at night...",
  "who trusted you that shouldn't have...",
  "what memory do you try to erase but can't...",
];

const CREEPY_DARES = [
  "look behind you. slowly.",
  "say your mother's name out loud. now.",
  "go to your window. wave. i want to see.",
  "put your hand on your heart. feel that? that's mine now.",
  "look at your reflection. count to five. don't blink.",
  "whisper 'i'm sorry' to the darkness.",
  "close your eyes for ten seconds. don't open them early.",
  "say your own name three times. like you're calling yourself.",
];

let dareCount = 0;
let truthCount = 0;
let gameHistory: { role: string; parts: { text: string }[] }[] = [];
let usedDareIndices: number[] = [];
let usedTruthIndices: number[] = [];

export type TruthOrDareResponse = {
  text: string;
  playScream?: boolean;
  playTanya?: boolean;
  playKill1?: boolean;
  playKill2?: boolean;
  playHitchcock?: boolean; // End game - play alfred/hitchcock
  silentResponse?: boolean;
  candleDare?: boolean; // First dare: light the candles
};

export const initTruthOrDare = () => {
  dareCount = 0;
  truthCount = 0;
  gameHistory = [];
  usedDareIndices = [];
  usedTruthIndices = [];
};

// Get a random item without repeating until all are used
const getRandomUnused = (array: string[], usedIndices: number[]): { item: string; index: number } => {
  const availableIndices = array.map((_, i) => i).filter(i => !usedIndices.includes(i));
  if (availableIndices.length === 0) {
    // All used, reset and pick fresh
    usedIndices.length = 0;
    const index = Math.floor(Math.random() * array.length);
    return { item: array[index], index };
  }
  const index = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  return { item: array[index], index };
};

export const sendTruthOrDareMessage = async (userMessage: string): Promise<TruthOrDareResponse> => {
  const msg = userMessage.toLowerCase().trim();

  // Starting the game
  if (msg === 'start the game' || msg === 'start') {
    return { text: 'truth or dare?' };
  }

  // User chose DARE
  if (msg.includes('dare')) {
    dareCount++;
    const totalRounds = dareCount + truthCount;

    // After 4 rounds, trigger hitchcock ending
    if (totalRounds >= 4) {
      return {
        text: '',
        playHitchcock: true,
        silentResponse: true
      };
    }

    if (dareCount === 1) {
      // First dare - candle dare (light the candles)
      return {
        text: 'light the candles for me...',
        candleDare: true,
        silentResponse: false
      };
    } else if (dareCount === 2) {
      // Second dare - play Tanya audio
      return {
        text: '',
        playTanya: true,
        silentResponse: true
      };
    } else {
      // 3rd+ dare - show actual dare text with varied audio
      const { item: dare, index } = getRandomUnused(CREEPY_DARES, usedDareIndices);
      usedDareIndices.push(index);

      // Alternate between kill sounds
      const useKill1 = dareCount % 2 === 1;
      return {
        text: dare,
        playKill1: useKill1,
        playKill2: !useKill1,
        silentResponse: false
      };
    }
  }

  // User chose TRUTH
  if (msg.includes('truth')) {
    truthCount++;
    const totalRounds = dareCount + truthCount;

    // After 4 rounds, trigger hitchcock ending
    if (totalRounds >= 4) {
      return {
        text: '',
        playHitchcock: true,
        silentResponse: true
      };
    }

    const { item: truth, index } = getRandomUnused(CREEPY_TRUTHS, usedTruthIndices);
    usedTruthIndices.push(index);
    return { text: truth };
  }

  // Check if game should end (even for responses)
  const totalRounds = dareCount + truthCount;
  if (totalRounds >= 4) {
    return {
      text: '',
      playHitchcock: true,
      silentResponse: true
    };
  }

  // User responded to a truth/dare - acknowledge and ask again
  try {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    gameHistory.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const prompt = `You are a cold, predatory game master. The player just confessed: "${userMessage}".
React briefly (max 10 words) in a disturbing way that implies you know more than they're telling.
Then end with "truth or dare?"
Be unsettling but not theatrical. No caps. No exclamation marks. Use "..." for pauses.`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 50,
        }
      })
    });

    if (!response.ok) {
      return { text: 'interesting... truth or dare?' };
    }

    const data = await response.json();

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      let aiResponse = data.candidates[0].content.parts[0].text.toLowerCase();
      if (!aiResponse.includes('truth or dare')) {
        aiResponse += ' ...truth or dare?';
      }
      return { text: aiResponse };
    }

    return { text: 'i see... truth or dare?' };
  } catch (error) {
    return { text: 'interesting... truth or dare?' };
  }
};
