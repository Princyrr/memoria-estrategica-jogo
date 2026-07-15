import { memo } from 'react';
import { Target, Move, Trophy } from 'lucide-react';

interface ScoreProps {
  moves: number;
  matchedPairs: number;
  totalPairs: number;
  score?: number;
}

const Score = memo(function Score({ moves, matchedPairs, totalPairs, score }: ScoreProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center">
          <Move className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Jogadas</span>
          <span className="font-mono font-bold text-lg leading-none text-slate-100">{moves}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 backdrop-blur-sm">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
          <Target className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Pares</span>
          <span className="font-mono font-bold text-lg leading-none text-slate-100">{matchedPairs}/{totalPairs}</span>
        </div>
      </div>

      {score !== undefined && score > 0 && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 backdrop-blur-sm">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-amber-200/70 font-medium">Pontos</span>
            <span className="font-mono font-bold text-lg leading-none text-amber-100">{score}</span>
          </div>
        </div>
      )}
    </div>
  );
});

export default Score;
