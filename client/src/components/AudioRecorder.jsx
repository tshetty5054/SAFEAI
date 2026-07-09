import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaStop, FaMicrophone, FaDownload, FaTrash, FaVolumeUp } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { isMock, storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const AudioRecorder = () => {
  const { currentUser } = useAuth();
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [history, setHistory] = useState([]);
  const [activePlayback, setActivePlayback] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Load history from localStorage
  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`audio_recordings_${currentUser.uid}`);
      setHistory(saved ? JSON.parse(saved) : []);
    }
  }, [currentUser]);

  // Sync recordings history
  const saveHistory = (newHistory) => {
    setHistory(newHistory);
    if (currentUser) {
      localStorage.setItem(`audio_recordings_${currentUser.uid}`, JSON.stringify(newHistory));
    }
  };

  // Timer effect
  useEffect(() => {
    if (recording && !paused) {
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [recording, paused]);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const options = { mimeType: 'audio/webm' };
      let recorder;
      try {
        recorder = new MediaRecorder(stream, options);
      } catch (e) {
        recorder = new MediaRecorder(stream);
      }

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Stop all tracks on the stream
        stream.getTracks().forEach(track => track.stop());

        const newId = 'record_' + Date.now();
        const timestamp = new Date().toLocaleString();
        
        let fileLink = audioUrl;

        // Try uploading to Firebase if not in mock mode
        if (!isMock && storage && currentUser) {
          try {
            const storageRef = ref(storage, `recordings/${currentUser.uid}/${newId}.webm`);
            const snapshot = await uploadBytes(storageRef, audioBlob);
            fileLink = await getDownloadURL(snapshot.ref);
            console.log('[SAFEAI] Uploaded audio file to Firebase Storage.');
          } catch (err) {
            console.error('Firebase storage upload failed, saving blob URL instead:', err);
          }
        }

        const newEntry = {
          id: newId,
          timestamp,
          duration: formatTime(duration),
          url: fileLink,
          fileName: `Evidence_${newId}.webm`
        };

        saveHistory([newEntry, ...history]);
        setDuration(0);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setPaused(false);
      setDuration(0);
    } catch (err) {
      alert('Microphone permission is required to capture evidence. Please allow microphone access in settings.');
    }
  };

  // Pause
  const pauseRecording = () => {
    if (mediaRecorderRef.current && recording && !paused) {
      mediaRecorderRef.current.pause();
      setPaused(true);
    }
  };

  // Resume
  const resumeRecording = () => {
    if (mediaRecorderRef.current && recording && paused) {
      mediaRecorderRef.current.resume();
      setPaused(false);
    }
  };

  // Stop
  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setPaused(false);
    }
  };

  // Play audio clip
  const playClip = (clip) => {
    if (activePlayback && activePlayback.id === clip.id) {
      activePlayback.audio.pause();
      setActivePlayback(null);
    } else {
      if (activePlayback) {
        activePlayback.audio.pause();
      }
      const audio = new Audio(clip.url);
      audio.play().catch(e => {
        console.warn('Playback error: Audio reference might have expired or requires networking permissions.', e.message);
      });
      audio.onended = () => setActivePlayback(null);
      setActivePlayback({ id: clip.id, audio });
    }
  };

  // Delete clip
  const deleteClip = (id) => {
    if (activePlayback && activePlayback.id === id) {
      activePlayback.audio.pause();
      setActivePlayback(null);
    }
    const updated = history.filter(c => c.id !== id);
    saveHistory(updated);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel rounded-2xl border border-safety-border p-6 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FaMicrophone className={recording && !paused ? 'text-red-500 animate-pulse' : 'text-gray-400'} />
          Evidence Audio Recorder
        </h3>
        {recording && (
          <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
            {paused ? 'PAUSED' : 'RECORDING'}
          </span>
        )}
      </div>

      {/* Control Display */}
      <div className="flex flex-col items-center justify-center py-6 bg-safety-bg/50 rounded-xl border border-safety-border mb-6">
        <div className="text-4xl font-mono font-bold text-white mb-4">
          {formatTime(duration)}
        </div>

        {/* Waves simulation */}
        {recording && !paused && (
          <div className="flex items-center gap-1 h-8 mb-6">
            <span className="w-1 bg-red-500 rounded animate-bounce" style={{ animationDelay: '0.1s', height: '60%' }} />
            <span className="w-1 bg-red-500 rounded animate-bounce" style={{ animationDelay: '0.3s', height: '90%' }} />
            <span className="w-1 bg-red-500 rounded animate-bounce" style={{ animationDelay: '0.5s', height: '40%' }} />
            <span className="w-1 bg-red-500 rounded animate-bounce" style={{ animationDelay: '0.2s', height: '80%' }} />
            <span className="w-1 bg-red-500 rounded animate-bounce" style={{ animationDelay: '0.4s', height: '50%' }} />
          </div>
        )}

        <div className="flex gap-4">
          {!recording ? (
            <button
              onClick={startRecording}
              className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full flex items-center justify-center shadow-lg transition duration-200"
            >
              <FaMicrophone size={20} />
            </button>
          ) : (
            <>
              {paused ? (
                <button
                  onClick={resumeRecording}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full flex items-center justify-center transition duration-200"
                >
                  <FaPlay size={18} />
                </button>
              ) : (
                <button
                  onClick={pauseRecording}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-full flex items-center justify-center transition duration-200"
                >
                  <FaPause size={18} />
                </button>
              )}
              <button
                onClick={stopRecording}
                className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-full flex items-center justify-center transition duration-200"
              >
                <FaStop size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Recording History */}
      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Recording History</h4>
        {history.length === 0 ? (
          <p className="text-xs text-gray-500 italic py-4 text-center">No audio captures recorded yet.</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {history.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-safety-bg/40 border border-safety-border rounded-xl">
                <div className="text-left">
                  <p className="text-xs font-medium text-white truncate max-w-[150px]">{item.fileName}</p>
                  <p className="text-[10px] text-gray-500">{item.timestamp} &bull; {item.duration}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => playClip(item)}
                    className={`p-2 rounded-lg text-xs font-semibold ${
                      activePlayback && activePlayback.id === item.id 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : 'bg-safety-border text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {activePlayback && activePlayback.id === item.id ? <FaPause /> : <FaPlay />}
                  </button>
                  <a
                    href={item.url}
                    download={item.fileName}
                    className="p-2 bg-safety-border text-gray-300 hover:bg-gray-700 rounded-lg text-xs"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaDownload />
                  </a>
                  <button
                    onClick={() => deleteClip(item.id)}
                    className="p-2 bg-red-950/20 text-red-400 hover:bg-red-900/40 rounded-lg text-xs"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
