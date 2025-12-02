import React, { useState } from 'react';
import { Screen } from './components/Screen';
import { TVHousing } from './components/TVHousing';
import { EquipmentRack } from './components/EquipmentRack';
import { AppState } from './types';
import { initAudio, toggleMusicBox, setMasterVolume, skipToMusicBox, startKillSounds, stopKillSounds, playCandleLight } from './utils/sound.ts';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.OFF);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [started, setStarted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [voiceEnabled] = useState(true); // Always enabled for TTS
  const [leftCandleHover, setLeftCandleHover] = useState(false);
  const [rightCandleHover, setRightCandleHover] = useState(false);
  const [leftCandleOn, setLeftCandleOn] = useState(true);
  const [rightCandleOn, setRightCandleOn] = useState(true);

  const handleStart = async () => {
    setStarted(true);
    initAudio();
    setAudioEnabled(true);
    setAppState(AppState.STATIC_BOOT);

    // Start music box immediately
    toggleMusicBox(true);
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    if (!muted) {
      setMasterVolume(v);
    }
  };

  const handleToggleMusic = (enabled: boolean) => {
    setMusicEnabled(enabled);
    toggleMusicBox(enabled);
    // Kill sounds play when music is OFF
    if (!enabled) {
      startKillSounds();
    } else {
      stopKillSounds();
    }
  };

  const handleSkipTrack = () => {
    skipToMusicBox();
    setMusicEnabled(true);
  };

  if (!started) {
    return (
      <div 
        className="min-h-screen w-full bg-black flex items-center justify-center cursor-pointer overflow-hidden relative"
        onClick={handleStart}
      >
        {/* Animated noise background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            animation: 'staticShift 0.1s steps(5) infinite',
          }}
        />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.9)_100%)]" />
        
        {/* Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30" />
        
        <div className="text-center relative z-10">
          {/* Glitchy title */}
          <div className="relative mb-8">
            <h1 
              className="text-[#c0ffc0] font-mono text-5xl md:text-7xl font-bold tracking-[0.3em] uppercase"
              style={{ 
                textShadow: '0 0 40px rgba(192,255,192,0.8), 0 0 80px rgba(192,255,192,0.4), -2px 0 #ff0000, 2px 0 #00ffff',
                animation: 'textGlitch 3s infinite',
              }}
            >
              STATIC
            </h1>
            <p 
              className="text-[#c0ffc0]/60 font-mono text-sm tracking-[0.5em] uppercase mt-2"
              style={{ textShadow: '0 0 10px rgba(192,255,192,0.5)' }}
            >
              LAYERS OF FEAR
            </p>
          </div>
          
          {/* Pulsing prompt */}
          <div className="animate-pulse">
            <p className="text-[#c0ffc0]/40 font-mono text-xs tracking-[0.3em] uppercase mb-4">
              ▶ SIGNAL DETECTED ◀
            </p>
          </div>
          
          {/* Click instruction with flicker */}
          <p 
            className="text-neutral-500 font-mono text-sm tracking-widest"
            style={{ animation: 'flicker 2s infinite' }}
          >
            [ CLICK ANYWHERE TO CONNECT ]
          </p>
          
          {/* Warning text */}
          <p className="text-red-900/50 font-mono text-[0.6rem] tracking-wider mt-8 uppercase">
            ⚠ HEADPHONES RECOMMENDED ⚠
          </p>
        </div>
        
        {/* CSS for animations */}
        <style>{`
          @keyframes staticShift {
            0% { transform: translate(0, 0); }
            25% { transform: translate(-1px, 1px); }
            50% { transform: translate(1px, -1px); }
            75% { transform: translate(-1px, -1px); }
            100% { transform: translate(1px, 1px); }
          }
          @keyframes textGlitch {
            0%, 90%, 100% { transform: translate(0); }
            92% { transform: translate(-2px, 1px); }
            94% { transform: translate(2px, -1px); }
            96% { transform: translate(-1px, 2px); }
            98% { transform: translate(1px, -2px); }
          }
          @keyframes flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
            52% { opacity: 1; }
            54% { opacity: 0.3; }
            56% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center overflow-hidden relative select-none"
      style={{
        background: 'linear-gradient(180deg, #0a0806 0%, #0d0a08 50%, #080604 100%)',
      }}
    >
      {/* Dark room walls - subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Fog/mist layer */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 80%, rgba(40,35,30,0.8) 0%, transparent 60%)',
        }}
      />

      {/* Dust particles floating in candlelight */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`dust-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${1 + (i % 3)}px`,
            height: `${1 + (i % 3)}px`,
            left: `${20 + (i * 3) % 60}%`,
            top: `${10 + (i * 4) % 70}%`,
            background: 'rgba(255,200,150,0.4)',
            boxShadow: '0 0 3px rgba(255,170,100,0.3)',
            animation: `dustFloat ${6 + (i % 4) * 2}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}

      {/* Floating Kiro Particles */}
      {[...Array(8)].map((_, i) => (
        <img
          key={i}
          src="/kiro.png"
          alt=""
          className="absolute pointer-events-none"
          style={{
            width: `${6 + (i % 4) * 3}px`,
            height: `${6 + (i % 4) * 3}px`,
            left: `${5 + (i * 12)}%`,
            top: `${10 + ((i * 9) % 80)}%`,
            opacity: 0.1 + (i % 3) * 0.05,
            filter: 'drop-shadow(0 0 6px #c0ffc0)',
            animation: `kiroFloat${(i % 4) + 1} ${10 + i * 2}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Heavy vignette - dark room corners */}
      <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)]"></div>


      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        
        {/* TV with candles on wooden stand */}
        <div className="relative mb-4 w-[56rem]">
          {/* Left Candle - burned longer, shorter height */}
          <div
            className="absolute -left-24 bottom-6 flex flex-col items-center z-10 cursor-pointer"
            onClick={() => { if (!leftCandleOn) playCandleLight(); setLeftCandleOn(!leftCandleOn); }}
          >
            {/* Flame - only this dims on hover */}
            <div
              className="w-9 h-[72px] rounded-[50%_50%_40%_40%] transition-all duration-300"
              onMouseEnter={() => setLeftCandleHover(true)}
              onMouseLeave={() => setLeftCandleHover(false)}
              style={{
                background: leftCandleOn
                  ? 'radial-gradient(ellipse at 50% 60%, #ffaa00 0%, #ff6b00 40%, #ff4500 70%, transparent 100%)'
                  : 'transparent',
                boxShadow: leftCandleOn
                  ? (leftCandleHover ? '0 0 15px #ffaa00, 0 0 30px rgba(255,170,0,0.3)' : '0 0 30px #ffaa00, 0 0 60px rgba(255,170,0,0.4)')
                  : 'none',
                animation: leftCandleOn ? 'candleFlicker 0.2s ease-in-out infinite' : 'none',
                opacity: leftCandleHover && leftCandleOn ? 0.5 : 1,
              }}
            />
            <div className="w-1.5 h-3 bg-[#2a2a2a]" />
            <div className="w-[60px] h-3 bg-gradient-to-b from-[#fffacd]/80 to-[#f5f5dc] rounded-t-full" />
            <div
              className="w-[60px] h-36 rounded-sm"
              style={{
                background: 'linear-gradient(135deg, #fffacd 0%, #f5f5dc 30%, #e8e4c9 60%, #d4cfb0 100%)',
                boxShadow: 'inset -4px 0 10px rgba(0,0,0,0.2), inset 4px 0 10px rgba(255,255,255,0.3), 0 10px 25px rgba(0,0,0,0.6)',
              }}
            />
          </div>

          {/* TV */}
          <TVHousing 
            appState={appState} 
            setAppState={setAppState}
          >
            <Screen
              appState={appState}
              setAppState={setAppState}
              audioEnabled={audioEnabled && !muted}
              voiceEnabled={voiceEnabled && !muted}
              leftCandleOn={leftCandleOn}
              rightCandleOn={rightCandleOn}
              setLeftCandleOn={setLeftCandleOn}
              setRightCandleOn={setRightCandleOn}
            />
          </TVHousing>
          
          {/* Right Candle - positioned absolutely */}
          <div
            className="absolute -right-24 bottom-6 flex flex-col items-center z-10 cursor-pointer"
            onClick={() => { if (!rightCandleOn) playCandleLight(); setRightCandleOn(!rightCandleOn); }}
          >
            {/* Flame - only this dims on hover */}
            <div
              className="w-9 h-[72px] rounded-[50%_50%_40%_40%] transition-all duration-300"
              onMouseEnter={() => setRightCandleHover(true)}
              onMouseLeave={() => setRightCandleHover(false)}
              style={{
                background: rightCandleOn
                  ? 'radial-gradient(ellipse at 50% 60%, #ffaa00 0%, #ff6b00 40%, #ff4500 70%, transparent 100%)'
                  : 'transparent',
                boxShadow: rightCandleOn
                  ? (rightCandleHover ? '0 0 15px #ffaa00, 0 0 30px rgba(255,170,0,0.3)' : '0 0 30px #ffaa00, 0 0 60px rgba(255,170,0,0.4)')
                  : 'none',
                animation: rightCandleOn ? 'candleFlicker 0.25s ease-in-out infinite' : 'none',
                opacity: rightCandleHover && rightCandleOn ? 0.5 : 1,
              }}
            />
            <div className="w-1.5 h-3 bg-[#2a2a2a]" />
            <div className="w-[60px] h-3 bg-gradient-to-b from-[#fffacd]/80 to-[#f5f5dc] rounded-t-full" />
            <div
              className="w-[60px] h-48 rounded-sm"
              style={{
                background: 'linear-gradient(135deg, #fffacd 0%, #f5f5dc 30%, #e8e4c9 60%, #d4cfb0 100%)',
                boxShadow: 'inset -4px 0 10px rgba(0,0,0,0.2), inset 4px 0 10px rgba(255,255,255,0.3), 0 10px 25px rgba(0,0,0,0.6)',
              }}
            />
          </div>
          
          {/* Wooden stand under TV - wide enough for candles */}
          <div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[140%] h-10 z-0"
            style={{
              background: 'linear-gradient(180deg, #4a3520 0%, #3d2817 30%, #2a1810 70%, #1a0f08 100%)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.9), inset 0 2px 0 rgba(255,255,255,0.1), inset 0 -2px 8px rgba(0,0,0,0.5)',
              borderRadius: '6px',
            }}
          >
            <div
              className="w-full h-full opacity-30"
              style={{
                backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.4) 10px, rgba(0,0,0,0.4) 11px)`,
              }}
            />
          </div>
        </div>

        {/* Equipment rack on wooden table */}
        <div className="relative -mt-2">
          <EquipmentRack
            volume={volume}
            setVolume={handleVolumeChange}
            musicEnabled={musicEnabled}
            onToggleMusic={handleToggleMusic}
            onSkipTrack={handleSkipTrack}
          />
          {/* Wooden shelf under stereo */}
          <div
            className="w-[850px] h-8 mx-auto -mt-1"
            style={{
              background: 'linear-gradient(180deg, #5a4530 0%, #4a3520 30%, #3d2817 60%, #2a1810 100%)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.8), inset 0 2px 0 rgba(255,255,255,0.08)',
              borderRadius: '3px',
            }}
          >
            <div
              className="w-full h-full opacity-20"
              style={{
                backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(0,0,0,0.3) 12px, rgba(0,0,0,0.3) 13px)`,
              }}
            />
          </div>
        </div>

      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes candleFlicker {
          0%, 100% { transform: scaleY(1) scaleX(1); opacity: 1; }
          25% { transform: scaleY(0.95) scaleX(1.05); opacity: 0.9; }
          50% { transform: scaleY(1.05) scaleX(0.95); opacity: 1; }
          75% { transform: scaleY(0.98) scaleX(1.02); opacity: 0.95; }
        }
        @keyframes kiroFloat1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(10deg); }
        }
        @keyframes kiroFloat2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(-8deg); }
        }
        @keyframes kiroFloat3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(15deg); }
        }
        @keyframes kiroFloat4 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(-12deg); }
        }
        @keyframes kiroDrift1 {
          0%, 100% { margin-left: 0px; }
          50% { margin-left: 20px; }
        }
        @keyframes kiroDrift2 {
          0%, 100% { margin-left: 0px; }
          50% { margin-left: -30px; }
        }
        @keyframes kiroDrift3 {
          0%, 100% { margin-left: 0px; }
          50% { margin-left: 15px; }
        }
        @keyframes dustFloat {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-30px) translateX(10px); opacity: 0.5; }
          50% { transform: translateY(-50px) translateX(-5px); opacity: 0.4; }
          75% { transform: translateY(-30px) translateX(15px); opacity: 0.5; }
        }
      `}</style>

    </div>
  );
}

export default App;
