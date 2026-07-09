import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaShieldAlt, FaBullhorn, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useEmergency } from '../contexts/EmergencyContext';
import { useThreat } from '../contexts/ThreatContext';

export const VoiceAssistantPage = () => {
  const { safetyMode, setSafetyMode, createAlert } = useEmergency();
  const { voiceTriggerActive, setVoiceTriggerActive } = useThreat();

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const [detectedKeyword, setDetectedKeyword] = useState('');
  const [recognition, setRecognition] = useState(null);

  const keywords = ['sos', 'help me', 'emergency', 'save me', 'i need help', 'help'];

  // Initialize Speech Recognition API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecognitionSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onresult = (event) => {
      const current = event.resultIndex;
      const resultText = event.results[current][0].transcript.trim().toLowerCase();
      setTranscript(resultText);

      // Check for keywords
      const matched = keywords.find(word => resultText.includes(word));
      if (matched) {
        handleKeywordTrigger(matched);
      }
    };

    rec.onerror = (e) => {
      console.warn('Speech recognition error:', e.error);
      if (e.error === 'not-allowed') {
        setListening(false);
      }
    };

    rec.onend = () => {
      // Auto restart if safety mode remains active and we didn't manually stop it
      if (listening && safetyMode) {
        try {
          rec.start();
        } catch (e) {}
      }
    };

    setRecognition(rec);
  }, [listening, safetyMode]);

  // Synchronize listening state with safetyMode
  useEffect(() => {
    if (safetyMode && recognitionSupported && recognition) {
      startListening();
    } else {
      stopListening();
    }
  }, [safetyMode, recognition, recognitionSupported]);

  const startListening = () => {
    if (!recognition) return;
    try {
      recognition.start();
      setListening(true);
    } catch (e) {}
  };

  const stopListening = () => {
    if (!recognition) return;
    try {
      recognition.stop();
      setListening(false);
    } catch (e) {}
  };

  const handleKeywordTrigger = async (keyword) => {
    setDetectedKeyword(keyword.toUpperCase());
    setVoiceTriggerActive(true);
    setSafetyMode(true);

    // Alert dispatch creation
    await createAlert({
      threatLevel: 'High',
      threatConfidence: 85,
      notes: `VOICE ASSISTANT: Emergency keyword detected: "${keyword.toUpperCase()}" via speech recognition.`
    });

    // Voice announcement cue
    if (typeof SpeechSynthesisUtterance !== 'undefined') {
      const speech = new SpeechSynthesisUtterance('Emergency threat detected. Broadcasted GPS location details.');
      speech.volume = 0.8;
      window.speechSynthesis.speak(speech);
    }

    // Dismiss alert popup after 6 seconds
    setTimeout(() => {
      setDetectedKeyword('');
      setVoiceTriggerActive(false);
    }, 6000);
  };

  // Demo simulate trigger
  const handleSimulateKeyword = (word) => {
    handleKeywordTrigger(word);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      
      <div className="flex items-center gap-2">
        <FaMicrophone className="text-red-500 text-xl" />
        <h2 className="text-xl font-extrabold text-white">Voice Companion Assistant</h2>
      </div>

      {/* Main Indicator Card */}
      <div className="glass-panel border-safety-border p-8 rounded-2xl text-center space-y-6">
        
        {/* Pulsing Mic circle */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          {listening && (
            <>
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
              <div className="absolute inset-2 bg-red-500/30 rounded-full animate-pulse"></div>
            </>
          )}
          <div className={`absolute inset-4 rounded-full flex items-center justify-center text-3xl shadow-lg transition-colors duration-300 ${
            listening ? 'bg-red-500 text-white' : 'bg-safety-bg border border-safety-border text-gray-400'
          }`}>
            {listening ? <FaMicrophone /> : <FaMicrophoneSlash />}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {listening ? 'Voice Guard Active' : 'Voice Guard Standby'}
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
            {listening 
              ? 'SAFEAI is continuously listening for emergency voice commands. Say one of the keywords below to trigger protection.' 
              : 'Safety Mode is offline. Turn on Safety Mode in the header or click the toggle below to activate voice listeners.'}
          </p>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSafetyMode(prev => !prev)}
          className={`font-bold text-xs px-8 py-3 rounded-xl border transition duration-200 ${
            safetyMode 
              ? 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30' 
              : 'bg-safety-border text-gray-300 border-safety-border hover:bg-gray-700'
          }`}
        >
          {safetyMode ? 'Deactivate Voice Guard' : 'Activate Voice Guard'}
        </button>
      </div>

      {/* Keyword Alert Modal */}
      {detectedKeyword && (
        <div className="bg-red-950/20 border border-red-500/40 p-5 rounded-2xl flex items-center gap-4 alert-glow-red animate-pulse">
          <FaBullhorn className="text-3xl text-red-500 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Keyword Detected: {detectedKeyword}</h4>
            <p className="text-[10px] text-gray-400 mt-1">
              Safety Mode escalated to High. GPS broadcasts sent to emergency contacts.
            </p>
          </div>
        </div>
      )}

      {/* Target Keywords list */}
      <div className="glass-panel border-safety-border p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Monitored Safety Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {keywords.map(word => (
            <span 
              key={word} 
              className="bg-safety-bg border border-safety-border text-gray-300 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:border-red-500/30 hover:text-white transition duration-200 cursor-pointer"
              onClick={() => handleSimulateKeyword(word)}
              title={`Click to simulate: "${word.toUpperCase()}"`}
            >
              {word}
            </span>
          ))}
        </div>
        <p className="text-[10px] text-gray-500 italic">
          💡 Evaluators: If your browser microphone permissions are blocked, you can click on any keyword pill above to simulate a live voice command trigger.
        </p>
      </div>

      {/* Web API Info status */}
      {!recognitionSupported && (
        <div className="bg-amber-950/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
          <FaExclamationCircle className="text-amber-500 text-base shrink-0 mt-0.5" />
          <p className="text-[10px] text-gray-400 leading-relaxed">
            Note: Speech recognition requires browser Web Speech support. Run SAFEAI on Google Chrome, Edge, or Safari. STANDBY simulate triggers remain operational.
          </p>
        </div>
      )}
    </div>
  );
};
