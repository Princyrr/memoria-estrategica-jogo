import { useState, memo } from "react";
import { Trophy, Clock, Target, Play, X, Gamepad2 } from "lucide-react";

import { Difficulty, calculateScore, getDifficultyConfig } from "../types/game";

interface GameOverModalProps {
  moves: number;
  timeSeconds: number;
  difficulty: Difficulty;
  onRestart: () => void;
  onClose: () => void;
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const GameOverModal = memo(function GameOverModal({
  moves,
  timeSeconds,
  difficulty,
  onRestart,
  onClose,
}: GameOverModalProps) {
  const [playerName, setPlayerName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");
  const [scoreSaved, setScoreSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = getDifficultyConfig(difficulty);
  const score = calculateScore(moves, timeSeconds, difficulty);

  const efficiency = moves > 0 ? Math.round((config.pairs / moves) * 100) : 0;

  const handleSaveScore = async () => {
    const name = playerName.trim();
    const email = playerEmail.trim();

    if (!name) {
      setError("Digite um nome para continuar");
      return;
    }

    if (!email) {
      setError("Digite um e-mail para continuar");
      return;
    }

    if (!email.includes("@")) {
      setError("E-mail inválido");
      return;
    }
    if (!name) {
      setError("Digite um nome para continuar");
      return;
    }

    if (saving) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/leaderboard`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            player_name: name,
            email: email,
            score,
            time_seconds: timeSeconds,
            moves,
            difficulty,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Falha ao salvar no ranking");
      }

      setScoreSaved(true);
    } catch (err) {
      setError("Erro ao salvar pontuação. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-slate-700/50 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="relative p-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-slate-700/50 rounded-lg"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>

          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-slate-100">Parabéns!</h2>
          <p className="text-slate-400">Você concluiu o desafio</p>
        </div>

        {/* Stats */}
        <div className="px-6 pb-4 grid grid-cols-3 gap-3">
          <div className="bg-slate-800/80 p-3 rounded-xl text-center">
            <Clock className="w-4 h-4 mx-auto text-cyan-400" />
            <p className="text-sm font-mono text-white mt-1">
              {formatTime(timeSeconds)}
            </p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl text-center">
            <Target className="w-4 h-4 mx-auto text-emerald-400" />
            <p className="text-sm font-mono text-white mt-1">{moves}</p>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl text-center">
            <Gamepad2 className="w-4 h-4 mx-auto text-amber-400" />
            <p className="text-sm font-mono text-white mt-1">{efficiency}%</p>
          </div>
        </div>

        {/* Score */}
        <div className="mx-6 mb-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex justify-between items-center">
            <span className="text-amber-300">Pontuação</span>
            <span className="text-2xl font-bold text-amber-400">{score}</span>
          </div>
        </div>

        {/* Actions */}
        {!scoreSaved ? (
          <div className="px-6 pb-6">
            <input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Seu nome"
              maxLength={25}
              className="w-full mb-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white"
            />
            <input
              value={playerEmail}
              onChange={(e) => setPlayerEmail(e.target.value)}
              placeholder="Seu e-mail"
              type="email"
              className="w-full mb-2 px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white"
            />
            {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onRestart}
                className="bg-slate-700 text-white py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Jogar
              </button>

              <button
                onClick={handleSaveScore}
                disabled={saving}
                className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        ) : (
          <div className="px-6 pb-6 text-center">
            <p className="text-emerald-400 mb-4">
              Pontuação salva com sucesso!
            </p>

            <button
              onClick={onRestart}
              className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-3 rounded-xl"
            >
              Jogar novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default GameOverModal;
