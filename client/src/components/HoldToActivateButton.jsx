import React, { useState, useEffect, useRef } from 'react';

export const HoldToActivateButton = ({ onActivate }) => {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const duration = 5000; // 5 seconds
  const step = 100; // check every 100ms

  // Pulse sound to alert the user they are holding the button
  useEffect(() => {
    audioRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
  }, []);

  const startHolding = () => {
    setHolding(true);
    setProgress(0);
    const startTime = Date.now();

    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);

      // Soft vibration ticks if supported
      if (navigator.vibrate) {
        navigator.vibrate(40);
      }

      if (elapsed >= duration) {
        clearInterval(timerRef.current);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        setHolding(false);
        setProgress(0);
        onActivate();
      }
    }, step);
  };

  const stopHolding = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setHolding(false);
    setProgress(0);
  };

  // Prevent context menu from popping up on mobile devices during long press
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const radius = 80;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div 
        className="relative cursor-pointer select-none touch-none"
        onMouseDown={startHolding}
        onMouseUp={stopHolding}
        onMouseLeave={stopHolding}
        onTouchStart={startHolding}
        onTouchEnd={stopHolding}
        onContextMenu={handleContextMenu}
      >
        {/* Progress Circle Ring */}
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90 transition-transform duration-100"
        >
          <circle
            stroke="#1F2E4C"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="#EF4444"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-100 ease-linear"
          />
        </svg>

        {/* Center SOS Trigger Button */}
        <div className={`absolute top-0 left-0 right-0 bottom-0 m-4 flex flex-col items-center justify-center rounded-full transition-all duration-200 shadow-lg ${
          holding 
            ? 'bg-red-600 scale-95 alert-glow-red' 
            : 'bg-red-500 hover:bg-red-600 scale-100'
        }`}>
          <span className="text-3xl font-extrabold text-white tracking-widest">SOS</span>
          <span className="text-[10px] text-red-100 mt-1 uppercase font-semibold">
            {holding ? `${Math.ceil((5000 - (progress / 100) * 5000) / 1000)}s` : 'Hold 5s'}
          </span>
        </div>
      </div>

      <p className="text-gray-400 text-sm text-center mt-4">
        {holding ? (
          <span className="text-red-500 font-bold animate-pulse">TRIGGERING INITIATED... KEEP HOLDING!</span>
        ) : (
          "Press and hold the button for 5 seconds to activate safety mode."
        )}
      </p>
    </div>
  );
};
