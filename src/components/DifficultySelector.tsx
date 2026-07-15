import { memo } from "react";
import { Sparkles, Zap, Flame } from "lucide-react";
import { Difficulty, getDifficultyConfig } from "../types/game";

interface DifficultySelectorProps {
  selected: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

const DifficultySelector = memo(function DifficultySelector({
  selected,
  onSelect,
}: DifficultySelectorProps) {
  const options: { value: Difficulty; icon: React.ReactNode; color: string }[] =
    [
      {
        value: "easy",
        icon: <Sparkles className="w-5 h-5" />,
        color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40",
      },
      {
        value: "medium",
        icon: <Zap className="w-5 h-5" />,
        color: "from-amber-500/20 to-orange-500/20 border-amber-500/40",
      },
      {
        value: "hard",
        icon: <Flame className="w-5 h-5" />,
        color: "from-red-500/20 to-orange-500/20 border-red-500/40",
      },
    ];

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {options.map((option) => {
        const config = getDifficultyConfig(option.value);
        const isSelected = selected === option.value;

        return (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`relative px-5 py-3 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 group
              ${
                isSelected
                  ? `bg-gradient-to-br ${option.color} scale-[1.02]`
                  : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800/80"
              }`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300
              ${
                isSelected
                  ? option.value === "easy"
                    ? "bg-emerald-500/30 text-emerald-400"
                    : option.value === "medium"
                      ? "bg-amber-500/30 text-amber-400"
                      : "bg-red-500/30 text-red-400"
                  : "bg-slate-700/50 text-slate-400 group-hover:bg-slate-700"
              }`}
            >
              {option.icon}
            </div>
            <div className="flex flex-col items-start">
              <span
                className={`font-bold text-sm -none
                ${isSelected ? "text-slate-50" : "text-slate-300"}`}
              >
                {config.name}
              </span>
              <span
                className={`text-xs
                ${isSelected ? "text-slate-400" : "text-slate-500"}`}
              >
                {config.pairs * 2} cartas
              </span>
            </div>
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
});

export default DifficultySelector;
