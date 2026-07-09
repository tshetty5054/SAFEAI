import React, { createContext, useContext, useState, useEffect } from 'react';
import { useEmergency } from './EmergencyContext';

const ThreatContext = createContext();

export const useThreat = () => useContext(ThreatContext);

export const ThreatProvider = ({ children }) => {
  const { safetyMode, location, currentZoneAlert, activeSOS } = useEmergency();

  const [voiceTriggerActive, setVoiceTriggerActive] = useState(false);
  const [simulateRapidMovement, setSimulateRapidMovement] = useState(false);
  const [threatConfidence, setThreatConfidence] = useState(0);
  const [threatLevel, setThreatLevel] = useState('Safe');
  const [recommendedAction, setRecommendedAction] = useState('System is active. No threat detected.');
  const [statusColor, setStatusColor] = useState('text-threat-safe');

  // Helper to check if it is nighttime (8 PM to 6 AM)
  const isNightTime = () => {
    const hour = new Date().getHours();
    return hour >= 20 || hour < 6;
  };

  // Recalculate threat metrics whenever dependencies change
  useEffect(() => {
    let score = 0;

    // 1. SOS Button Active
    if (activeSOS) {
      score += 55;
    }

    // 2. Voice Trigger Active
    if (voiceTriggerActive) {
      score += 30;
    }

    // 3. User inside unsafe zone
    if (currentZoneAlert) {
      score += 40;
    }

    // 4. Nighttime
    if (isNightTime()) {
      score += 15;
    }

    // 5. Rapid movement
    if (simulateRapidMovement || (location.speed && location.speed > 8)) {
      score += 20;
    }

    // Caps score between 0 and 100
    const finalScore = Math.min(Math.max(score, 0), 100);
    setThreatConfidence(finalScore);

    // Resolve Level, Action & Status indicator
    if (finalScore >= 85) {
      setThreatLevel('Critical');
      setRecommendedAction('EMERGENCY: SOS activated! Seek safe refuge immediately. Audio is recording and contacts are notified.');
      setStatusColor('text-red-600 bg-red-950/20 border-red-500/30');
    } else if (finalScore >= 60) {
      setThreatLevel('High');
      setRecommendedAction('Threat detected! Move to a well-lit, populated public area. Alert contacts if necessary.');
      setStatusColor('text-red-500 bg-red-950/10 border-red-500/20');
    } else if (finalScore >= 30) {
      setThreatLevel('Medium');
      setRecommendedAction('Caution: Elevating indicators. Keep safety companion open and monitor geofences.');
      setStatusColor('text-amber-500 bg-amber-950/10 border-amber-500/20');
    } else if (finalScore >= 11) {
      setThreatLevel('Low');
      setRecommendedAction('System monitoring. Night time or minor movement detected. Stay aware of surroundings.');
      setStatusColor('text-blue-500 bg-blue-950/10 border-blue-500/20');
    } else {
      setThreatLevel('Safe');
      setRecommendedAction('All systems green. SAFEAI is actively monitoring your location.');
      setStatusColor('text-emerald-500 bg-emerald-950/10 border-emerald-500/20');
    }
  }, [safetyMode, location, currentZoneAlert, activeSOS, voiceTriggerActive, simulateRapidMovement]);

  return (
    <ThreatContext.Provider value={{
      threatConfidence,
      threatLevel,
      recommendedAction,
      statusColor,
      voiceTriggerActive,
      setVoiceTriggerActive,
      simulateRapidMovement,
      setSimulateRapidMovement,
      isNightTime: isNightTime()
    }}>
      {children}
    </ThreatContext.Provider>
  );
};
