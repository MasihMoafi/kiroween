import React, { useState, useRef } from 'react';
import { AppState } from '../types';
import { playClick, playStaticSound } from '../utils/sound.ts';

interface TVHousingProps {
  children: React.ReactNode;
  appState: AppState;
  setAppState: (state: AppState) => void;
}

// Add drip animation to global styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes drip {
      0% { height: 0; opacity: 1; }
      50% { height: 60%; opacity: 0.8; }
      100% { height: 100%; opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

export const TVHousing: React.FC<TVHousingProps> = ({ 
  children, 
  appState, 
  setAppState
}) => {
  const isPowered = appState !== AppState.OFF;
  const [channelKnobRot, setChannelKnobRot] = useState(-15);
  const knobRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const togglePower = () => {
    playClick();
    if (isPowered) {
      setAppState(AppState.OFF);
    } else {
      setAppState(AppState.STATIC_BOOT);
    }
  };

  const handleKnobMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Channel order for knob navigation
  const CHANNELS = [AppState.MAIN_MENU, AppState.TRUTH_OR_DARE, AppState.WHISPERS, AppState.CONFESS]; // DORIAN_GRAY commented out
  const [currentChannel, setCurrentChannel] = useState(0);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !knobRef.current) return;

    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) + 90;

    const prevAngle = channelKnobRot;
    setChannelKnobRot(angle);
    
    // Change channel when knob rotates significantly
    if (isPowered && Math.abs(angle - prevAngle) > 30) {
      playClick();
      playStaticSound(300);
      
      // Determine direction and change channel
      const direction = angle > prevAngle ? 1 : -1;
      const newChannel = (currentChannel + direction + CHANNELS.length) % CHANNELS.length;
      setCurrentChannel(newChannel);
      
      // Brief static then switch to new channel
      setAppState(AppState.STATIC_BOOT);
      setTimeout(() => {
        setAppState(CHANNELS[newChannel]);
      }, 300);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto perspective-[1000px]">
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] h-20 bg-black/60 blur-2xl rounded-[50%]"></div>

      <div className="relative bg-[#252320] rounded-[2rem] p-4 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_0_50px_rgba(0,0,0,0.9)] border-t border-white/10 group">
        
        <div className="absolute inset-0 opacity-20 rounded-[2rem] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>

        <div className="flex gap-6 h-[500px]">
          
          {/* LEFT CONTROL PANEL */}
          <div className="w-28 bg-[#1a1918] rounded-xl border-r border-white/5 flex flex-col items-center py-6 gap-6 relative shadow-[inset_2px_2px_10px_rgba(0,0,0,0.5)]">


            {/* Channel Knob */}
            <div className="mt-10 relative">
               <div 
                  ref={knobRef}
                  onMouseDown={handleKnobMouseDown}
                  className="w-16 h-16 rounded-full bg-[#0f0f0f] border-4 border-[#3a3a3a] shadow-[0_5px_15px_rgba(0,0,0,0.8),inset_0_2px_5px_rgba(255,255,255,0.1)] flex items-center justify-center cursor-grab active:cursor-grabbing"
                  style={{ transform: `rotate(${channelKnobRot}deg)` }}
               >
                  <div className="w-full h-full rounded-full border-2 border-dashed border-neutral-700 opacity-50"></div>
                  <div className="absolute top-1 w-2 h-5 bg-orange-600 rounded-full shadow-[0_0_8px_rgba(255,100,0,0.6)]"></div>
               </div>
               <div className="text-[0.6rem] text-neutral-400 mt-2 text-center font-mono tracking-widest font-bold">CHANNEL</div>
            </div>

            {/* Power Button */}
            <div className="mt-auto flex flex-col gap-3 items-center">
               <div className="flex gap-3">
                  <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${isPowered ? 'bg-green-400 shadow-[0_0_12px_#22c55e]' : 'bg-green-900'}`}></div>
                  <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${!isPowered ? 'bg-red-400 shadow-[0_0_12px_#ef4444]' : 'bg-red-900'}`}></div>
               </div>
               <button 
                 onClick={togglePower}
                 className="w-14 h-14 rounded-full bg-[#1a1a1a] border-2 border-[#444] shadow-[0_4px_0_#000,0_5px_10px_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center"
               >
                  <div className="w-7 h-7 rounded-full border-2 border-neutral-500 flex items-center justify-center">
                    <div className="w-3 h-3 bg-neutral-700 rounded-full"></div>
                  </div>
               </button>
               <span className="text-[0.6rem] text-neutral-400 font-mono font-bold">POWER</span>
            </div>
          </div>

          {/* CENTER SCREEN */}
          <div className="flex-1 relative bg-black rounded-[3rem] border-[16px] border-[#1a1a1a] shadow-[inset_0_0_80px_rgba(0,0,0,1)] overflow-hidden">
             

             {/* Glass Glare */}
             <div className="absolute inset-0 z-50 pointer-events-none bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-[2.5rem]"></div>
             
             {/* SHATTERED GLASS EFFECT */}
             <svg className="absolute inset-0 w-full h-full z-[55] pointer-events-none opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
               <defs>
                 <linearGradient id="crackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                   <stop offset="0%" stopColor="white" stopOpacity="0.4"/>
                   <stop offset="100%" stopColor="white" stopOpacity="0"/>
                 </linearGradient>
               </defs>
               {/* Main crack from top-left */}
               <path d="M 15 5 L 25 20 L 22 35 L 30 50 L 25 65 L 35 80" stroke="url(#crackGrad)" strokeWidth="0.3" fill="none"/>
               <path d="M 25 20 L 40 25 L 55 22" stroke="url(#crackGrad)" strokeWidth="0.2" fill="none"/>
               <path d="M 22 35 L 10 45 L 5 60" stroke="url(#crackGrad)" strokeWidth="0.2" fill="none"/>
               <path d="M 30 50 L 45 55 L 60 50 L 75 55" stroke="url(#crackGrad)" strokeWidth="0.2" fill="none"/>
               {/* Secondary crack */}
               <path d="M 70 10 L 65 25 L 70 40 L 60 55" stroke="url(#crackGrad)" strokeWidth="0.25" fill="none"/>
               <path d="M 65 25 L 80 30 L 90 25" stroke="url(#crackGrad)" strokeWidth="0.15" fill="none"/>
               {/* Small fragments */}
               <path d="M 40 70 L 45 80 L 50 75 L 55 85" stroke="url(#crackGrad)" strokeWidth="0.15" fill="none"/>
               <path d="M 80 60 L 85 70 L 90 65" stroke="url(#crackGrad)" strokeWidth="0.15" fill="none"/>
             </svg>
             
             {/* Screen Content */}
             <div className={`w-full h-full transition-all duration-300 ${isPowered ? 'opacity-100' : 'opacity-0'}`}>
                {children}
             </div>

             {/* CRT Turn Off */}
             {!isPowered && (
               <div className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-none">
                 <div className="w-full h-[2px] bg-white animate-[collapse-h_0.4s_ease-out_forwards]"></div>
               </div>
             )}

             {/* Scanlines */}
             <div className="absolute inset-0 z-40 pointer-events-none rounded-[2.5rem] shadow-[inset_0_0_80px_rgba(0,0,0,0.7)]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]"></div>
             </div>

          </div>

          {/* RIGHT SPEAKER */}
          <div className="w-24 bg-[#1a1918] rounded-xl border-l border-white/5 flex flex-col items-center justify-center gap-3 shadow-inner relative">
             {[...Array(20)].map((_, i) => (
               <div key={i} className="w-[80%] h-1.5 bg-black/80 rounded-full border-b border-white/5"></div>
             ))}
             <div className="absolute bottom-8 text-[0.6rem] text-neutral-500 -rotate-90 tracking-widest font-bold">
               AUDIO
             </div>
          </div>

        </div>
      </div>
      
      <div className="absolute -bottom-6 left-12 w-12 h-8 bg-[#1a1a1a] -skew-x-12 shadow-lg -z-10"></div>
      <div className="absolute -bottom-6 right-12 w-12 h-8 bg-[#1a1a1a] skew-x-12 shadow-lg -z-10"></div>

    </div>
  );
};
