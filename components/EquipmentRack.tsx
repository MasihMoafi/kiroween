import React, { useEffect, useState, useRef } from 'react';
import { playClick } from '../utils/sound.ts';

interface EquipmentRackProps {
  volume: number;
  setVolume: (v: number) => void;
  musicEnabled: boolean;
  onToggleMusic: (enabled: boolean) => void;
  onSkipTrack: () => void;
}

export const EquipmentRack: React.FC<EquipmentRackProps> = ({
  volume,
  setVolume,
  musicEnabled,
  onToggleMusic,
  onSkipTrack
}) => {
  const [meterLevels, setMeterLevels] = useState([20, 40, 60, 30]);
  const [knobRot, setKnobRot] = useState(volume * 270 - 135);
  const knobRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Animate VU meters based on volume
  useEffect(() => {
    const interval = setInterval(() => {
      setMeterLevels(prev => prev.map(() => Math.floor(Math.random() * 60 * volume) + 10 + volume * 20));
    }, 150);
    return () => clearInterval(interval);
  }, [volume]);

  // Draggable VOLUME knob
  const handleKnobMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !knobRef.current) return;
    
    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI) + 90;
    
    // Clamp to -135 to 135 degrees
    const clampedAngle = Math.max(-135, Math.min(135, angle));
    setKnobRot(clampedAngle);
    
    // Map to 0-1 volume
    const newVolume = (clampedAngle + 135) / 270;
    setVolume(Math.max(0, Math.min(1, newVolume)));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    playClick();
  };


  return (
    <div className="w-full max-w-[800px] mx-auto mt-2 bg-[#0e0e0e] border-t-8 border-[#1a1a1a] rounded-b-lg p-6 shadow-[0_30px_60px_rgba(0,0,0,0.9)] relative z-10">
      
      {/* Screws */}
      <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-[#222] border border-[#444] shadow-sm"></div>
      <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#222] border border-[#444] shadow-sm"></div>
      <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-[#222] border border-[#444] shadow-sm"></div>
      <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-[#222] border border-[#444] shadow-sm"></div>

      <div className="flex justify-between items-center gap-6 bg-[#050505] p-4 rounded border border-[#222] shadow-inner">
        
        {/* VU Meters */}
        <div className="flex-1 flex flex-col gap-2">
           <div className="flex items-center justify-between border-b border-[#333] pb-1 mb-1">
             <span className="text-[0.5rem] text-neutral-500">SIGNAL LEVEL</span>
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
           </div>
           <div className="bg-black border border-[#333] p-2 rounded h-24 flex items-end gap-1 justify-center overflow-hidden relative">
             <div className="absolute inset-0 bg-[linear-gradient(transparent_90%,rgba(0,255,0,0.2)_90%)] bg-[length:100%_10px] pointer-events-none"></div>
             <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_90%,rgba(0,255,0,0.2)_90%)] bg-[length:10px_100%] pointer-events-none"></div>
             
             {meterLevels.map((level, i) => (
               <div key={i} className="w-3 bg-[#1a1a1a] h-full relative flex items-end">
                 <div 
                   className="w-full bg-gradient-to-t from-green-900 via-green-500 to-yellow-400 transition-all duration-150"
                   style={{ height: `${Math.min(level, 100)}%` }}
                 ></div>
               </div>
             ))}
           </div>
        </div>

        {/* Controls - PLAY/PAUSE and SKIP */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2 border-l border-r border-[#222] px-4">
           <div className="flex gap-4 items-start">
             {/* PLAY/PAUSE toggle - vintage style */}
             <div className="flex flex-col items-center gap-1">
               <div
                 onClick={() => { playClick(); onToggleMusic(!musicEnabled); }}
                 className={`w-12 h-12 bg-[#0a0a0a] rounded border-2 border-[#333] relative cursor-pointer shadow-inner flex items-center justify-center ${musicEnabled ? 'border-green-900/60' : 'border-red-900/60'}`}
                 style={{ boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8)' }}
               >
                 <span className={`text-base font-mono ${musicEnabled ? 'text-green-500' : 'text-red-500'}`}>
                   {musicEnabled ? '||' : '►'}
                 </span>
               </div>
               <span className="text-[0.4rem] text-neutral-500 tracking-wider">{musicEnabled ? 'PAUSE' : 'PLAY'}</span>
             </div>

             {/* SKIP button - vintage style */}
             <div className="flex flex-col items-center gap-1">
               <div
                 onClick={() => { playClick(); onSkipTrack(); }}
                 className="w-12 h-12 bg-[#0a0a0a] rounded border-2 border-[#333] relative cursor-pointer shadow-inner flex items-center justify-center hover:border-amber-900/60"
                 style={{ boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8)' }}
               >
                 <span className="text-base font-mono text-amber-500">»</span>
               </div>
               <span className="text-[0.4rem] text-neutral-500 tracking-wider">SKIP</span>
             </div>
           </div>
        </div>

        {/* VOLUME Knob */}
        <div className="flex-1 flex flex-col items-center">
           <div 
             ref={knobRef}
             onMouseDown={handleKnobMouseDown}
             className="w-24 h-24 rounded-full bg-[#111] border-[6px] border-[#222] shadow-[0_10px_20px_rgba(0,0,0,0.5),inset_0_2px_10px_rgba(255,255,255,0.05)] flex items-center justify-center cursor-grab active:cursor-grabbing relative"
             style={{ transform: `rotate(${knobRot}deg)` }}
           >
             <div className="absolute top-2 w-2 h-8 bg-neutral-700 rounded-full shadow-[0_0_5px_rgba(0,0,0,1)]"></div>
             <span className="absolute text-[0.5rem] text-neutral-600 font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transform: `rotate(${-knobRot}deg)` }}>VOL</span>
           </div>
           <div className="flex w-full justify-between px-4 mt-2 text-[0.4rem] text-neutral-600 font-mono">
             <span>MIN</span>
             <span>MAX</span>
           </div>
        </div>

      </div>
    </div>
  );
};
