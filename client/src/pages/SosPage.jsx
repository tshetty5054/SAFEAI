import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaShieldAlt, FaVolumeUp, FaVideo, FaMapMarkerAlt, FaFileAudio } from 'react-icons/fa';
import { useEmergency } from '../contexts/EmergencyContext';
import { HoldToActivateButton } from '../components/HoldToActivateButton';
import { AudioRecorder } from '../components/AudioRecorder';

export const SosPage = () => {
  const { activeSOS, setActiveSOS, createAlert, location } = useEmergency();
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [sirenAudio, setSirenAudio] = useState(null);
  const [dispatchStatus, setDispatchStatus] = useState([]);

  // Setup siren alarm sound
  useEffect(() => {
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');
    audio.loop = true;
    audio.volume = 0.6;
    setSirenAudio(audio);
    return () => {
      audio.pause();
    };
  }, []);

  // Trigger dispatch logs sequentially when SOS goes active
  useEffect(() => {
    if (activeSOS) {
      setDispatchStatus([
        '🚨 EMERGENCY ENFORCEMENT PROTOCOL INITIATED.',
        '📍 Capturing active device GPS coordinates...',
        '🗣️ Starting ambient audio evidence recorder...',
        '📲 Simulating emergency dispatch data packet payload...',
      ]);

      const timer1 = setTimeout(() => {
        setDispatchStatus(prev => [...prev, `✅ Broadcasted GPS coordinates (Lat: ${location.lat.toFixed(4)}) to Guardians.`]);
      }, 2000);

      const timer2 = setTimeout(() => {
        setDispatchStatus(prev => [...prev, '✅ Alert acknowledged by dispatch server. Police notification simulated.']);
      }, 4000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setDispatchStatus([]);
    }
  }, [activeSOS, location]);

  const handleSOSActivation = async () => {
    setActiveSOS(true);
    
    // Play Siren
    if (sirenAudio) {
      sirenAudio.play().catch(() => {});
      setSirenPlaying(true);
    }

    // Create alert entry in database
    await createAlert({
      threatLevel: 'Critical',
      threatConfidence: 98,
      notes: 'SOS BUTTON PROTOCOL: Activated via 5-second hold interface.'
    });
  };

  const handleDeactivate = () => {
    setActiveSOS(false);
    if (sirenAudio) {
      sirenAudio.pause();
      sirenAudio.currentTime = 0;
    }
    setSirenPlaying(false);
  };

  const toggleSiren = () => {
    if (!sirenAudio) return;
    if (sirenPlaying) {
      sirenAudio.pause();
      setSirenPlaying(false);
    } else {
      sirenAudio.play().catch(() => {});
      setSirenPlaying(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {!activeSOS ? (
        // SOS Button Interface
        <div className="glass-panel border-safety-border rounded-2xl p-8 space-y-6 text-center">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
              <FaShieldAlt className="text-red-500" />
              Emergency SOS Interface
            </h2>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              In case of immediate danger, press and hold the button below. The system will activate alarms, record audio, and share telemetry.
            </p>
          </div>

          <div className="py-4">
            <HoldToActivateButton onActivate={handleSOSActivation} />
          </div>

          <div className="border-t border-safety-border/40 pt-4 grid grid-cols-3 gap-2 text-[10px] text-gray-400">
            <div className="flex flex-col items-center gap-1.5 p-3 bg-safety-bg/30 border border-safety-border rounded-xl">
              <FaMapMarkerAlt className="text-red-500 text-sm animate-pulse" />
              <span>GPS Broadcast</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 bg-safety-bg/30 border border-safety-border rounded-xl">
              <FaFileAudio className="text-amber-500 text-sm" />
              <span>Audio Record</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-3 bg-safety-bg/30 border border-safety-border rounded-xl">
              <FaVolumeUp className="text-blue-500 text-sm" />
              <span>Local Sirens</span>
            </div>
          </div>
        </div>
      ) : (
        // EMERGENCY ACTIVATED DASHBOARD SCREEN
        <div className="space-y-6 text-left">
          
          {/* Warning Banner */}
          <div className="bg-red-950/20 border border-red-500/30 alert-glow-red rounded-2xl p-6 text-center space-y-4 animate-pulse">
            <FaExclamationTriangle className="text-5xl text-red-500 mx-auto" />
            <div className="space-y-1">
              <h2 className="text-xl font-black text-white tracking-widest uppercase">Emergency System Active</h2>
              <p className="text-xs text-red-400 font-semibold">Your contacts are alerted. Authorities have been simulated.</p>
            </div>
          </div>

          {/* Dispatch Logs */}
          <div className="glass-panel border-safety-border p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Automated Dispatch Logs</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto font-mono text-[10px] text-gray-300 bg-safety-bg/60 p-4 border border-safety-border rounded-xl">
              {dispatchStatus.map((log, i) => (
                <p key={i} className="leading-relaxed border-b border-safety-border/30 pb-1.5 last:border-0">{log}</p>
              ))}
            </div>
          </div>

          {/* Local Siren Controller */}
          <div className="glass-panel border-safety-border p-6 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Local Acoustic Siren</h3>
              <p className="text-[10px] text-gray-500 mt-0.5">Toggle loud watch alarms to attract public attention.</p>
            </div>
            <button
              onClick={toggleSiren}
              className={`font-bold text-xs px-6 py-2.5 rounded-xl transition duration-200 border ${
                sirenPlaying 
                  ? 'bg-red-500 text-white border-red-400' 
                  : 'bg-safety-border text-gray-300 border-safety-border'
              }`}
            >
              {sirenPlaying ? 'Mute Alarm' : 'Sound Alarm'}
            </button>
          </div>

          {/* Evidence Collection Widget */}
          <AudioRecorder />

          {/* Cancel Button */}
          <button
            onClick={handleDeactivate}
            className="w-full bg-safety-border hover:bg-gray-800 border border-safety-border text-gray-300 font-bold py-3 rounded-xl text-xs text-center transition"
          >
            Disarm Emergency Protocol
          </button>
        </div>
      )}
    </div>
  );
};
