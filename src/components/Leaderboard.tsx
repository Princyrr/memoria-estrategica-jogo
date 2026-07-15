import { useState, useEffect, useCallback, memo } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Trophy,
  Medal,
  Clock,
  Target,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { LeaderboardEntry } from "../types/game";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
);

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
};

interface LeaderboardProps {
  onRefresh?: () => void;
  highlightScore?: number;
}

const Leaderboard = memo(function Leaderboard({
  highlightScore,
}: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("leaderboard")
      .select("*")
      .order("score", { ascending: false })
      .limit(10);

    if (fetchError) {
      setError("Não foi possível carregar o ranking");
      setLoading(false);
      return;
    }

    setEntries(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-amber-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-slate-300" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const isHighlighted = (entry: LeaderboardEntry) => {
    return highlightScore !== undefined && entry.score === highlightScore;
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-3 py-8">
          <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
          <span className="text-slate-400">Carregando ranking...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-slate-800/50 border border-red-500/30 p-6 backdrop-blur-sm">
        <div className="text-center py-4">
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchLeaderboard}
            className="mt-3 text-cyan-400 hover:text-cyan-300 text-sm"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-900/70 backdrop-blur-xl shadow-2xl">
      {/* glow background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.03] via-transparent to-amber-500/[0.03]" />

      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-slate-700/40 px-5 py-5">
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/10">
            <TrendingUp className="w-5 h-5 text-amber-400" />

            <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.15)]" />
          </div>

          <div>
            <h3 className="text-xl font-black tracking-tight text-slate-100">
              Top 10 Jogadores
            </h3>

            <p className="text-xs text-slate-500">Maiores pontuações do jogo</p>
          </div>
        </div>

        <button
          onClick={fetchLeaderboard}
          className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700/50 bg-slate-800/60 transition-all duration-300 hover:scale-105 hover:bg-slate-700/60"
        >
          <RefreshCw className="w-4 h-4 text-slate-400 transition-transform duration-500 group-hover:rotate-180 group-hover:text-cyan-400" />
        </button>
      </div>

      {/* Empty */}
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-slate-400">
          <div className="mb-4 rounded-full bg-slate-800/70 p-5">
            <Trophy className="w-12 h-12 text-amber-400/70" />
          </div>

          <p className="font-medium">Nenhum jogador ainda. Seja o primeiro!</p>
        </div>
      ) : (
        <div className="relative p-3">
          <div className="space-y-2">
            {entries.map((entry, index) => {
              const rank = index + 1;

              return (
                <div
                  key={entry.id}
                  className={`
                  group relative overflow-hidden rounded-2xl border px-4 py-4
                  transition-all duration-300 hover:scale-[1.01]
                  ${
                    isHighlighted(entry)
                      ? "border-cyan-400/30 bg-cyan-500/10 shadow-[0_0_30px_rgba(34,211,238,0.08)]"
                      : "border-slate-700/40 bg-slate-800/40 hover:bg-slate-800/70"
                  }
                `}
                >
                  {/* hover shine */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute -left-10 top-0 h-full w-16 rotate-12 bg-white/5 blur-xl" />
                  </div>

                  <div className="relative flex items-center gap-4">
                    {/* Rank */}
                    <div
                      className={`
                      flex h-11 w-11 items-center justify-center rounded-xl border font-bold
                      ${
                        rank <= 3
                          ? "border-amber-500/20 bg-gradient-to-br from-amber-500/20 to-orange-500/20"
                          : "border-slate-700/50 bg-slate-700/40"
                      }
                    `}
                    >
                      <span
                        className={
                          rank <= 3 ? "text-amber-400" : "text-slate-400"
                        }
                      >
                        {getRankIcon(rank) || rank}
                      </span>
                    </div>

                    {/* Player */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={`
                          truncate text-sm font-bold tracking-wide
                          ${
                            isHighlighted(entry)
                              ? "text-cyan-100"
                              : "text-slate-100"
                          }
                        `}
                        >
                          {entry.player_name}
                        </p>

                        {rank === 1 && (
                          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amber-400/10">
                            🏆 Líder
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span
                          className={`
                          rounded-full px-2.5 py-1 font-semibold uppercase tracking-wide
                          ${
                            entry.difficulty === "hard"
                              ? "bg-red-500/15 text-red-400"
                              : entry.difficulty === "medium"
                                ? "bg-amber-500/15 text-amber-400"
                                : "bg-emerald-500/15 text-emerald-400"
                          }
                        `}
                        >
                          {entry.difficulty === "hard"
                            ? "Difícil"
                            : entry.difficulty === "medium"
                              ? "Médio"
                              : "Fácil"}
                        </span>

                        <div className="flex items-center gap-1 rounded-full bg-slate-700/40 px-2.5 py-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          {formatTime(entry.time_seconds)}
                        </div>

                        <div className="flex items-center gap-1 rounded-full bg-slate-700/40 px-2.5 py-1 text-slate-400">
                          <Target className="w-3 h-3" />
                          {entry.moves} jogadas
                        </div>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <div
                        className={`
                        text-2xl font-black tracking-tight
                        ${
                          rank <= 3
                            ? "bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent"
                            : "text-slate-100"
                        }
                      `}
                      >
                        {entry.score}
                      </div>

                      <div className="mt-1 text-[10px] uppercase tracking-widest text-slate-600">
                        {formatDate(entry.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

export default Leaderboard;
