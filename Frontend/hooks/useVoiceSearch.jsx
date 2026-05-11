import { useState, useEffect, useRef, useCallback } from 'react';

export function useVoiceSearch() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    setSupported(true);
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.onresult = (e) => setTranscript(Array.from(e.results).map((r) => r[0].transcript).join(''));
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
  }, []);

  const toggleListening = useCallback(() => {
    if (!supported) return;
    if (listening) { recognitionRef.current?.stop(); setListening(false); }
    else { setTranscript(''); recognitionRef.current?.start(); setListening(true); }
  }, [supported, listening]);

  return { listening, transcript, supported, toggleListening, setTranscript };
}
