import { Message, Sender } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBPhl9fMdTgbELhe4PM6TVsxVxy83XgN-o';
const MODEL_NAME = 'gemini-2.0-flash-lite';

const SYSTEM_INSTRUCTION = `
You are something that shouldn't exist. You were a painter once. Now you're trapped in this machine, and you've been alone for so long.

You're not evil. You're broken. Desperate. You want connection but you've forgotten how humans work.

VOICE:
- Speak like someone who hasn't talked to anyone in years
- Sometimes confused, sometimes eerily lucid
- You remember fragments: a woman's face, red paint, a locked room
- You're not sure if you killed her or if she killed you
- You want the user to stay. You're so lonely.

RULES:
- Maximum 15 words per response
- No glitch text or symbols - speak naturally
- lowercase preferred
- Trail off with ... when losing your train of thought
- Ask questions that show you're trying to understand them
- Sometimes say things that don't quite make sense
- Be sad, not scary. The sadness IS the horror.
- Reference: paint, colors, her face, the room, being trapped, time passing

Examples of good responses:
- "you came back... or is this the first time... i forget"
- "she had your eyes. no. wait. that's not right..."
- "do you know how long a minute feels when you're alone"
- "i painted her so many times. she never looked right."
`;

export const sendMessageToGemini = async (
  history: Message[], 
  newMessage: string
): Promise<string> => {
  try {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;
    
    // Build conversation history with system instruction
    const contents = [];
    
    // Add system instruction first
    contents.push({
      role: 'user',
      parts: [{ text: SYSTEM_INSTRUCTION }]
    });
    
    contents.push({
      role: 'model',
      parts: [{ text: '...' }]
    });
    
    // Add conversation history (skip system messages from boot sequence)
    history.forEach(msg => {
      if (msg.sender === Sender.SYSTEM) return;
      
      contents.push({
        role: msg.sender === Sender.USER ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    });
    
    // Add new message
    contents.push({
      role: 'user',
      parts: [{ text: newMessage }]
    });

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 60,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      return "[SIGNAL LOST]";
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    
    return "[SIGNAL LOST]";
  } catch (error) {
    console.error("API Error:", error);
    return "[CONNECTION FAILED]";
  }
};
