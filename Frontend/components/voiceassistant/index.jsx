import { useRouter } from 'next/router';
import { Mic, MicOff, X } from 'lucide-react';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';
import { useTheme } from '../../context/ThemeContext';

export default function VoiceAssistant() {
  const { variation } = useTheme();
  const { listening, transcript, supported, toggleListening, setTranscript } = useVoiceSearch();
  const router = useRouter();

  if (!supported) return null;

  const handleSubmit = () => {
    if (transcript.trim()) {
      router.push(`/search?q=${encodeURIComponent(transcript.trim())}`);
      setTranscript('');
    }
  };

  const micBg = variation === 2
    ? listening ? 'bg-destructive glow-neon' : 'bg-gradient-neon text-teknova-dark glow-neon'
    : variation === 3
      ? listening ? 'bg-destructive' : 'bg-primary'
      : listening ? 'bg-destructive' : 'bg-foreground';

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {(listening || transcript) && (
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xl max-w-xs w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {listening ? '🎙️ Listening...' : '🔍 Search for:'}
            </span>
            <button onClick={() => setTranscript('')} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
          </div>
          {transcript && (
            <>
              <p className="text-sm text-foreground font-medium mb-3">"{transcript}"</p>
              <button onClick={handleSubmit} className={'w-full py-2 rounded-lg text-sm font-medium ' + (variation === 2 ? 'bg-gradient-neon text-teknova-dark' : 'bg-primary text-primary-foreground')}>
                Search
              </button>
            </>
          )}
          {listening && !transcript && (
            <div className="flex items-center justify-center gap-1 h-8">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="w-1 bg-primary rounded-full animate-pulse" style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
          )}
        </div>
      )}
      <button
        onClick={toggleListening}
        className={'w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl transition-all hover:scale-110 active:scale-95 ' + micBg}
        title={listening ? 'Stop listening' : 'Voice search'}
      >
        {listening ? <MicOff size={20} /> : <Mic size={20} />}
      </button>
    </div>
  );
}
