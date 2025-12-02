import React, { useState, useEffect, useRef } from 'react';
import { Message, Sender, AppState } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { speakWithGemini, speakWithCreepyWoman, speakWithLittleGirl, stopSpeech } from '../services/ttsService';
import { initTruthOrDare, sendTruthOrDareMessage, TruthOrDareResponse } from '../services/truthOrDareService';
import { playStaticSound, playClick, playTanya, playScreamFile, playKill1, playKill2, playHitchcock, duckForGame, unduckForGame, stopKillSounds, stopAllGameAudio } from '../utils/sound.ts';

interface ScreenProps {
  appState: AppState;
  setAppState: (state: AppState) => void;
  audioEnabled: boolean;
  voiceEnabled: boolean;
  leftCandleOn: boolean;
  rightCandleOn: boolean;
  setLeftCandleOn: (on: boolean) => void;
  setRightCandleOn: (on: boolean) => void;
}

const BOOT_SEQUENCE = [
  "INITIALIZING...",
  "...........................................",
  "WARNING: [CORRUPTED] DETECTED",
  "STATUS: UNSTABLE",
  ""
];

export const Screen: React.FC<ScreenProps> = ({
  appState, setAppState, audioEnabled, voiceEnabled,
  leftCandleOn, rightCandleOn, setLeftCandleOn, setRightCandleOn
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [bootLineIndex, setBootLineIndex] = useState(0);
  const [selectedMenuItem, setSelectedMenuItem] = useState(0);
  const [videoSequence, setVideoSequence] = useState<'kiro-vid' | 'kiro-vid-2' | 'image-vid' | 'creep-vid' | null>(null);
  const [whispersWaiting, setWhispersWaiting] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false); // Block input during dare sounds
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoLoopCount = useRef(0); // Track video loops

  // Candle dare state
  const [candleDareMode, setCandleDareMode] = useState(false);
  const [candleDareClicks, setCandleDareClicks] = useState(0);
  const [candleDareImage, setCandleDareImage] = useState<'innocent' | 'decay' | null>(null);
  const prevLeftCandleRef = useRef(leftCandleOn);
  const prevRightCandleRef = useRef(rightCandleOn);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, bootLineIndex]);

  useEffect(() => {
    if (appState === AppState.STATIC_BOOT) {
      // Clear messages immediately when entering static boot (channel change)
      setMessages([]);
      stopSpeech();
      stopAllGameAudio(); // Ensure all game sounds die
      if (audioEnabled) playStaticSound(1500);
      const timer = setTimeout(() => {
        setAppState(AppState.SYSTEM_BOOT);
        setBootLineIndex(0);
      }, 1500);
      return () => clearTimeout(timer);
    }

    if (appState === AppState.SYSTEM_BOOT) {
      if (bootLineIndex < BOOT_SEQUENCE.length) {
        const timeout = setTimeout(() => {
          setMessages(prev => [...prev, {
            id: `boot-${bootLineIndex}`,
            text: BOOT_SEQUENCE[bootLineIndex],
            sender: Sender.SYSTEM,
            timestamp: Date.now()
          }]);
          playClick();
          setBootLineIndex(prev => prev + 1);
        }, 400);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setAppState(AppState.MAIN_MENU);
        }, 800);
        return () => clearTimeout(timeout);
      }
    }
  }, [appState, bootLineIndex, setAppState, audioEnabled]);

  // Handle video ended event - return to menu (but NOT for creep-vid)
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    // Skip this handler for creep-vid - it has its own handler
    if (videoSequence === 'creep-vid') return;

    const handleVideoEnd = () => {
      // Loop 'kiro-vid' (Party Mode) 3 times
      if (videoSequence === 'kiro-vid') {
        videoLoopCount.current += 1;
        if (videoLoopCount.current < 3) {
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => {});
          }
          return;
        }
      }

      // Reset loop count
      videoLoopCount.current = 0;

      setVideoSequence(null);
      setMessages([]);
      stopSpeech(); // Stop any ongoing TTS
      setAppState(AppState.MAIN_MENU);
      unduckForGame();
      setTimeout(() => inputRef.current?.focus(), 100);
    };

    videoElement.addEventListener('ended', handleVideoEnd);
    return () => videoElement.removeEventListener('ended', handleVideoEnd);
  }, [videoSequence, setAppState]);

  // Main menu keyboard navigation
  useEffect(() => {
    if (appState !== AppState.MAIN_MENU) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        playClick();
        setSelectedMenuItem(prev => (prev - 1 + 4) % 4);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        playClick();
        setSelectedMenuItem(prev => (prev + 1) % 4);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        playClick();
        handleMenuSelect(selectedMenuItem);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState, selectedMenuItem]);

  // ESC key to return to menu from any mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && appState !== AppState.MAIN_MENU && appState !== AppState.STATIC_BOOT && appState !== AppState.SYSTEM_BOOT) {
        e.preventDefault();
        playClick();
        stopSpeech(); // Stop TTS
        stopAllGameAudio(); // Stop all game audio (kill sounds, tanya, hitchcock, etc.)
        unduckForGame(); // Restore music volume
        setVideoSequence(null); // Clear video overlay
        setMessages([]);
        setAppState(AppState.MAIN_MENU);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState, setAppState]);

  // TRUTH OR DARE - Game with chatbot
  useEffect(() => {
    if (appState === AppState.TRUTH_OR_DARE) {
      duckForGame(); // Lower music significantly
      stopKillSounds(); // Stop kill sounds in game modes
      initTruthOrDare();
      // Turn candles OFF at the start
      setLeftCandleOn(false);
      setRightCandleOn(false);
      // Reset candle dare state
      setCandleDareMode(false);
      setCandleDareClicks(0);
      setCandleDareImage(null);
      setIsTyping(true);
      sendTruthOrDareMessage("start the game").then((response: TruthOrDareResponse) => {
        setIsTyping(false);
        setMessages([{
          id: '1',
          text: response.text,
          sender: Sender.AI,
          timestamp: Date.now()
        }]);
        if (voiceEnabled) speakWithLittleGirl(response.text);
      });
      setTimeout(() => inputRef.current?.focus(), 500);
    }
  }, [appState]);

  // WHISPERS - TTS intro then wait for user input
  useEffect(() => {
    if (appState === AppState.WHISPERS) {
      duckForGame();
      stopKillSounds(); // Stop kill sounds in game modes
      setWhispersWaiting(false);

      const runWhispersIntro = async () => {
        if (voiceEnabled) {
          await speakWithCreepyWoman("do you want to hear my whispers... love? come closer... let me tell you what the dead have told me...");
        }
        setWhispersWaiting(true);
      };

      runWhispersIntro();
    }
  }, [appState, voiceEnabled]);

  // WHISPERS keyboard handling - Enter to play video, Escape to go back
  useEffect(() => {
    if (appState !== AppState.WHISPERS || !whispersWaiting) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        playClick();
        setWhispersWaiting(false);
        setVideoSequence('image-vid');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        playClick();
        stopSpeech();
        setWhispersWaiting(false);
        setMessages([]);
        setAppState(AppState.MAIN_MENU);
        unduckForGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState, whispersWaiting, setAppState]);

  // DORIAN GRAY - Transforming images (commented out - incomplete feature)
  // useEffect(() => {
  //   if (appState === AppState.DORIAN_GRAY) {
  //     duckForGame();
  //     stopKillSounds();
  //     setIsTyping(true);
  //     sendMessageToGemini([], "you want to see my face to paint my portrait, ask me creepily").then(response => {
  //       setIsTyping(false);
  //       setMessages([{
  //         id: '1',
  //         text: response,
  //         sender: Sender.AI,
  //         timestamp: Date.now()
  //       }]);
  //       if (voiceEnabled) speakWithGemini(response);
  //     });
  //   }
  // }, [appState]);

  // Stop TTS and unduck music when returning to main menu
  useEffect(() => {
    if (appState === AppState.MAIN_MENU) {
      stopSpeech();
      unduckForGame();
      // Reset candle dare state
      setCandleDareMode(false);
      setCandleDareClicks(0);
      setCandleDareImage(null);
    }
  }, [appState]);

  // Handle candle state during candle dare mode
  // Flow: innocent.jpg shown → first candle ON → decay.jpg + scream → BOTH candles ON → creep.mp4
  useEffect(() => {
    if (!candleDareMode) {
      // Update refs when not in dare mode
      prevLeftCandleRef.current = leftCandleOn;
      prevRightCandleRef.current = rightCandleOn;
      return;
    }

    // Check how many candles are currently ON
    const candlesOn = (leftCandleOn ? 1 : 0) + (rightCandleOn ? 1 : 0);

    // Detect if a candle just turned ON
    const leftTurnedOn = leftCandleOn && !prevLeftCandleRef.current;
    const rightTurnedOn = rightCandleOn && !prevRightCandleRef.current;

    // Update refs
    prevLeftCandleRef.current = leftCandleOn;
    prevRightCandleRef.current = rightCandleOn;

    // Phase 1: First candle turned ON → show decay image
    if ((leftTurnedOn || rightTurnedOn) && candlesOn === 1 && candleDareClicks === 0) {
      setCandleDareClicks(1);
      setCandleDareImage('decay');
      return;
    }

    // Phase 2: BOTH candles now ON → play creep.mp4
    if (candlesOn === 2 && candleDareClicks >= 1) {
      setCandleDareMode(false);
      setCandleDareImage(null);
      setVideoSequence('creep-vid');
    }
  }, [leftCandleOn, rightCandleOn, candleDareMode, candleDareClicks]);

  // Video ended handler for creep video - return to Truth or Dare chat
  useEffect(() => {
    if (videoSequence === 'creep-vid') {
      const videoEl = videoRef.current;
      if (!videoEl) return;

      const handleCreepEnd = () => {
        setVideoSequence(null);
        stopSpeech(); // Stop any ongoing TTS first
        // Return to Truth or Dare chat with follow-up
        const followUp: Message = {
          id: Date.now().toString(),
          text: 'truth or dare?',
          sender: Sender.AI,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, followUp]);
        if (voiceEnabled) speakWithLittleGirl('truth or dare?');
        setTimeout(() => inputRef.current?.focus(), 100);
      };

      videoEl.addEventListener('ended', handleCreepEnd);
      return () => videoEl.removeEventListener('ended', handleCreepEnd);
    }
  }, [videoSequence, voiceEnabled]);

  const handleMenuSelect = (index: number) => {
    stopSpeech(); // Stop any ongoing TTS
    stopAllGameAudio(); // Stop any game-specific audio
    setMessages([]);
    switch (index) {
      case 0: // TRUTH OR DARE - Game with chatbot
        setAppState(AppState.TRUTH_OR_DARE);
        break;
      case 1: // WHISPERS - TTS intro then video
        setAppState(AppState.WHISPERS);
        break;
      case 2: // CONFESS - Play kiro-vid then return to menu
        duckForGame();
        stopKillSounds(); // Stop kill sounds in game modes
        setVideoSequence('kiro-vid');
        setAppState(AppState.CONFESS);
        break;
      // case 3: // DORIAN GRAY - Images that transform (commented out - incomplete)
      //   setAppState(AppState.DORIAN_GRAY);
      //   break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isAudioPlaying) return; // Block if audio is playing

    if (appState !== AppState.TRUTH_OR_DARE) return;

    playClick();
    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: Sender.USER,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setIsTyping(true);
    await new Promise(r => setTimeout(r, 600));
    const response: TruthOrDareResponse = await sendTruthOrDareMessage(userMsg.text);
    setIsTyping(false);

    // Play audio based on response, then ask again
    if (response.candleDare) {
      // First dare: show innocent.jpg and prompt to light candles
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: Sender.AI,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
      if (voiceEnabled) speakWithCreepyWoman(response.text);
      // Activate candle dare mode
      setCandleDareMode(true);
      setCandleDareClicks(0);
      setCandleDareImage('innocent');
    } else if (response.playScream) {
      setIsAudioPlaying(true);
      await playScreamFile();
      setIsAudioPlaying(false);
      // After scream ends, ask truth or dare again
      const followUp: Message = {
        id: (Date.now() + 1).toString(),
        text: 'truth or dare?',
        sender: Sender.AI,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, followUp]);
      if (voiceEnabled) speakWithLittleGirl('truth or dare?');
    } else if (response.playTanya) {
      setIsAudioPlaying(true);
      await playTanya();
      setIsAudioPlaying(false);
      // After tanya ends, ask truth or dare again
      const followUp: Message = {
        id: (Date.now() + 1).toString(),
        text: 'truth or dare?',
        sender: Sender.AI,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, followUp]);
      if (voiceEnabled) speakWithLittleGirl('truth or dare?');
    } else if (response.playKill1 || response.playKill2) {
      // Show dare text if provided
      if (response.text) {
        const dareMsg: Message = {
          id: (Date.now()).toString(),
          text: response.text,
          sender: Sender.AI,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, dareMsg]);
        if (voiceEnabled) await speakWithLittleGirl(response.text);
      }
      // Play the kill sound
      setIsAudioPlaying(true);
      if (response.playKill1) {
        await playKill1();
      } else {
        await playKill2();
      }
      setIsAudioPlaying(false);
      // Ask again
      const followUp: Message = {
        id: (Date.now() + 1).toString(),
        text: 'truth or dare?',
        sender: Sender.AI,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, followUp]);
      if (voiceEnabled) speakWithLittleGirl('truth or dare?');
    } else if (response.playHitchcock) {
      // End game - play Hitchcock/Alfred and return to menu
      setIsAudioPlaying(true);
      const endMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'good night...',
        sender: Sender.AI,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, endMsg]);
      await playHitchcock();
      setIsAudioPlaying(false);
      // Return to main menu after hitchcock
      setMessages([]);
      setAppState(AppState.MAIN_MENU);
      unduckForGame();
    } else if (!response.silentResponse && response.text) {
      // Only show message if not silent
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: Sender.AI,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);

      if (voiceEnabled) {
        speakWithLittleGirl(response.text);
      }
    }
  };

  return (
    <div 
      className="relative w-full h-full p-4 font-mono text-[#c0ffc0] overflow-hidden flex flex-col selection:bg-[#c0ffc0] selection:text-black"
      style={{ 
        textShadow: '0 0 10px rgba(192, 255, 192, 0.8), 0 0 25px rgba(192, 255, 192, 0.5)',
        fontFamily: '"Courier New", Courier, monospace',
        backgroundColor: '#1a1a1a',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
      }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* CRT Flicker */}
      <div className="absolute inset-0 bg-white/5 pointer-events-none animate-[flicker_0.15s_infinite] mix-blend-overlay"></div>

      {/* Messages - hide during main menu */}
      {appState !== AppState.MAIN_MENU && (
        <div className="flex-1 overflow-y-auto pr-2 space-y-2 pb-2 scrollbar-hide">
          {messages.map((msg) => (
            <div key={msg.id} className={`${msg.sender === Sender.USER ? 'text-[#70ff70]' : 'text-[#c0ffc0]'}`}>
              <span className="opacity-70 mr-3 font-bold text-xs tracking-widest">
                {msg.sender === Sender.USER ? '>' : '#'}
              </span>
              <span className="whitespace-pre-wrap uppercase tracking-wider leading-6">
                {msg.text}
              </span>
            </div>
          ))}
          {isTyping && (
            <div className="text-[#c0ffc0] animate-pulse mt-2">
               PROCESSING...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Main Menu */}
      {appState === AppState.MAIN_MENU && (
        <div className="flex-1 flex flex-col items-center justify-center relative">
          
          {/* Menu Title */}
          <div className="mb-8 text-center">
            <h2 
              className="text-2xl tracking-[0.4em] uppercase mb-2"
              style={{ textShadow: '0 0 20px rgba(192, 255, 192, 0.8)' }}
            >
              SELECT MODE
            </h2>
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#c0ffc0]/50 to-transparent mx-auto" />
          </div>
          
          <div className="space-y-3 w-full max-w-sm">
            {[
              { name: 'TRUTH OR DARE', desc: 'PLAY A GAME WITH ME', icon: '◈' },
              { name: 'WHISPERS', desc: 'HEAR MY STORIES', icon: '◉' },
              { name: 'KIROWEEN', desc: 'TRICK OR TREAT', icon: '🎃' },
              // { name: 'DORIAN GRAY', desc: 'SHOW ME YOUR FACE', icon: '◐' }, // Commented out - incomplete feature
            ].map((option, index) => (
              <div
                key={index}
                onClick={() => {
                  playClick();
                  setSelectedMenuItem(index);
                  handleMenuSelect(index);
                }}
                className={`
                  cursor-pointer px-6 py-3 border transition-all duration-300 relative overflow-hidden
                  ${selectedMenuItem === index 
                    ? 'border-[#c0ffc0] bg-[#c0ffc0]/10 scale-[1.02]' 
                    : 'border-[#c0ffc0]/20 hover:border-[#c0ffc0]/50 hover:bg-[#c0ffc0]/5'
                  }
                `}
                style={{
                  textShadow: selectedMenuItem === index ? '0 0 15px rgba(192, 255, 192, 1)' : 'none'
                }}
              >
                {/* Glitch line on hover */}
                {selectedMenuItem === index && (
                  <div className="absolute left-0 top-0 w-1 h-full bg-[#c0ffc0] animate-pulse" />
                )}
                
                <div className="flex items-center gap-4">
                  <span className="text-xl opacity-60">{option.icon}</span>
                  <div className="flex-1">
                    <span className="text-base tracking-wider block">{option.name}</span>
                    <span className="text-[0.6rem] text-[#c0ffc0]/40 tracking-widest">{option.desc}</span>
                  </div>
                  {selectedMenuItem === index && (
                    <span className="animate-pulse text-lg">▶</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation hint */}
          <div className="mt-8 text-xs text-[#c0ffc0]/60 tracking-widest" style={{ textShadow: '0 0 8px rgba(192,255,192,0.5)' }}>
            ↑↓ NAVIGATE • ENTER SELECT • ESC BACK
          </div>
        </div>
      )}

      {/* Input - TRUTH_OR_DARE mode only */}
      {appState === AppState.TRUTH_OR_DARE && (
        <form onSubmit={handleSubmit} className="flex items-center mt-auto border-t border-[#c0ffc0]/20 pt-3 pb-1 bg-black/30 relative z-10">
          <span className={`mr-2 font-bold text-lg ${isAudioPlaying ? 'text-red-500' : 'text-[#70ff70] animate-pulse'}`}>{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => !isAudioPlaying && setInput(e.target.value)}
            disabled={isAudioPlaying}
            className={`flex-1 bg-transparent border-none outline-none uppercase tracking-wider text-sm ${isAudioPlaying ? 'text-[#70ff70]/30 cursor-not-allowed' : 'text-[#70ff70] placeholder-[#70ff70]/30'}`}
            autoFocus
            spellCheck={false}
            placeholder={isAudioPlaying ? "LISTENING..." : "TRUTH OR DARE..."}
          />
        </form>
      )}

      {/* Static Overlay - same grey noise, just more intense during boot */}
      {(appState === AppState.STATIC_BOOT) && (
        <div 
          className="absolute inset-0 z-50"
          style={{
            backgroundColor: '#1a1a1a',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E")`,
          }}
        ></div>
      )}

      {/* WHISPERS waiting prompt */}
      {appState === AppState.WHISPERS && whispersWaiting && !videoSequence && (
        <div className="absolute inset-0 z-40 flex items-center justify-center">
          <div className="text-center">
            <div className="text-[#c0ffc0] text-lg tracking-widest mb-4 animate-pulse">
              DO YOU WANT TO HEAR MY WHISPERS, LOVE?
            </div>
            <div className="text-[#c0ffc0]/50 text-xs tracking-widest">
              PRESS ENTER TO CONTINUE • ESC TO GO BACK
            </div>
          </div>
        </div>
      )}

      {/* Candle Dare Image Overlay */}
      {candleDareImage && (
        <div className="absolute inset-0 z-40 bg-black flex items-center justify-center">
          <img
            src={candleDareImage === 'innocent' ? '/dull1.jpg' : '/dull2.jpg'}
            alt=""
            className="w-full h-full object-cover"
          />
          {/* CRT Scanlines overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 1px, transparent 1px, transparent 3px)',
            }}
          />
          {/* CRT vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)',
            }}
          />
          {/* Instruction */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#c0ffc0] text-sm tracking-widest animate-pulse px-4 py-2 bg-black/80 border border-[#c0ffc0]/50 rounded"
            style={{ textShadow: '0 0 10px #c0ffc0' }}
          >
            {candleDareClicks === 0 ? 'click to light a candle...' : 'now the other one...'}
          </div>
        </div>
      )}

      {/* Video Sequence Overlay - Fullscreen with CRT effects */}
      {videoSequence && (
        <div className="absolute inset-0 z-50 bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={
              videoSequence === 'kiro-vid' ? '/party2.mp4' :
              videoSequence === 'creep-vid' ? '/perfect_2.mp4' :
              '/image-final/image.mp4'
            }
            autoPlay
            preload="auto"
            className="w-full h-full object-cover"
          />
          {/* CRT Scanlines overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 1px, transparent 1px, transparent 3px)',
            }}
          />
          {/* CRT Screen curve / vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)',
            }}
          />
          {/* Phosphor glow */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(192,255,192,0.3) 0%, transparent 70%)',
            }}
          />
        </div>
      )}
    </div>
  );
};
