import { memo } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  seconds: number;
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const Timer = memo(function Timer({ seconds }: TimerProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center">
        <Clock className="w-4 h-4 text-cyan-400" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Tempo</span>
        <span className={`font-mono font-bold text-lg leading-none
          ${seconds > 180 ? 'text-amber-400' : 'text-slate-100'}`}
        >
          {formatTime(seconds)}
        </span>
      </div>
    </div>
  );
});

export default Timer;
