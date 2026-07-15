import { useState, useEffect, useCallback } from "react";
import {
  Factory,
  BarChart3,
  Play,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import logoBranca from "./assets/logobranca.png";
import memoriaImg from "./assets/memoria.png";
import {
  GameCard,
  Difficulty,
  CARD_PAIRS,
  getDifficultyConfig,
  calculateScore,
} from "./types/game";
import GameBoard from "./components/GameBoard";
import Timer from "./components/Timer";
import Score from "./components/Score";
import Leaderboard from "./components/Leaderboard";
import DifficultySelector from "./components/DifficultySelector";
import GameOverModal from "./components/GameOverModal";
import PairExplanationModal from "./components/PairExplanationModal";

type GameScreen = "start" | "playing" | "gameOver";

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const createCards = (difficulty: Difficulty): GameCard[] => {
  const config = getDifficultyConfig(difficulty);
  const selectedPairs = shuffleArray(CARD_PAIRS).slice(0, config.pairs);

  const cards: GameCard[] = [];
  let uniqueId = 0;

  selectedPairs.forEach((pair) => {
    cards.push({
      ...pair.left,
      id: `left-${pair.pairId}`,
      pairId: pair.pairId,
      uniqueId: `card-${uniqueId++}`,
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      ...pair.right,
      id: `right-${pair.pairId}`,
      pairId: pair.pairId,
      uniqueId: `card-${uniqueId++}`,
      isFlipped: false,
      isMatched: false,
    });
  });

  return shuffleArray(cards);
};

function App() {
  const [screen, setScreen] = useState<GameScreen>("start");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [score, setScore] = useState<number>(0);
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [previewing, setPreviewing] = useState(false);
  const [lastSavedScore, setLastSavedScore] = useState<number | undefined>(
    undefined,
  );
  const [pairExplanation, setPairExplanation] = useState<{
    title: string;
    explanation: string;
  } | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const config = getDifficultyConfig(difficulty);
  const isProcessing = flippedCards.length >= 2;

  const startGame = useCallback(() => {
    const newCards = createCards(difficulty).map((card) => ({
      ...card,
      isFlipped: true,
    }));

    setCards(newCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setSeconds(0);
    setScore(0);
    setLastSavedScore(undefined);
    setScreen("playing");

    setPreviewing(true);

    setTimeout(() => {
      setCards((prev) =>
        prev.map((card) => ({
          ...card,
          isFlipped: false,
          isMatched: false,
        })),
      );

      setPreviewing(false);
    }, 3000);
  }, [difficulty]);

  const handleCardClick = useCallback(
    (uniqueId: string) => {
      if (isProcessing) return;

      const card = cards.find((c) => c.uniqueId === uniqueId);
      if (!card || card.isFlipped || card.isMatched) return;

      const newFlippedCards = [...flippedCards, uniqueId];
      setFlippedCards(newFlippedCards);

      setCards((prev) =>
        prev.map((c) =>
          c.uniqueId === uniqueId ? { ...c, isFlipped: true } : c,
        ),
      );

      if (newFlippedCards.length === 2) {
        setMoves((prev) => prev + 1);

        const [firstId, secondId] = newFlippedCards;
        const firstCard = cards.find((c) => c.uniqueId === firstId);
        const secondCard = cards.find((c) => c.uniqueId === secondId);

        if (
          firstCard &&
          secondCard &&
          firstCard.pairId === secondCard.pairId &&
          firstCard.id !== secondCard.id
        ) {
          const pairData = CARD_PAIRS.find(
            (pair) => pair.pairId === firstCard.pairId,
          );

          setTimeout(() => {
            if (pairData?.explanation) {
              setPairExplanation({
                title: `${pairData.left.concept} + ${pairData.right.concept}`,
                explanation: pairData.explanation,
              });

              setIsPaused(true);
            }
          }, 600);

          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.uniqueId === firstId || c.uniqueId === secondId
                  ? { ...c, isMatched: true }
                  : c,
              ),
            );

            setMatchedPairs((prev) => {
              const newMatched = prev + 1;

              if (newMatched === config.pairs) {
                const finalScore = calculateScore(
                  moves + 1,
                  seconds,
                  difficulty,
                );

                setScore(finalScore);
                setScreen("gameOver");
              }

              return newMatched;
            });

            setFlippedCards([]);
          }, 500);
        } else {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.uniqueId === firstId || c.uniqueId === secondId
                  ? { ...c, isFlipped: false }
                  : c,
              ),
            );
            setFlippedCards([]);
          }, 1000);
        }
      }
    },
    [
      cards,
      flippedCards,
      isProcessing,
      config.pairs,
      moves,
      seconds,
      difficulty,
    ],
  );

  useEffect(() => {
    if (screen !== "playing" || isPaused || previewing) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, isPaused, previewing]);

  useEffect(() => {
    if (screen === "gameOver") {
      setLastSavedScore(score);
    }
  }, [screen, score]);

  const restartGame = () => {
    startGame();
  };

  if (screen === "start") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-[1800px] mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-14 pt-6">
            <div className="flex items-center justify-between flex-wrap gap-6">
              {/* Lado esquerdo */}
              <div className="flex items-center gap-4">
                <img
                  src={memoriaImg}
                  alt="Memória"
                  className="w-20 md:w-24 object-contain"
                />

                <div className="leading-none">
                  <h1 className="text-3xl md:text-4xl font-black text-white">
                    Memória
                  </h1>

                  <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mt-1">
                    Estratégica
                  </h2>
                </div>
              </div>

              {/* Logo direita */}
              <div>
                <img
                  src={logoBranca}
                  alt="Logo"
                  className="w-40 md:w-52 object-contain"
                />
              </div>
            </div>

            <p className="text-slate-400 text-base md:text-lg max-w-2xl mt-8 leading-relaxed">
              Conecte conceitos, indicadores e decisões estratégicas que
              impulsionam o desenvolvimento industrial.
            </p>
          </div>

          <div className="grid xl:grid-cols-3 gap-6 items-start">
            {/* Left Column - Game Setup */}
            <div className="xl:col-span-2 space-y-6">
              {/* Difficulty Selector */}
              <div className="rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/20 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-400/20 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-100">
                      Selecione a Dificuldade
                    </h2>
                    <p className="text-xs text-slate-500">
                      Quanto mais difícil, mais pontos!
                    </p>
                  </div>
                </div>
                <DifficultySelector
                  selected={difficulty}
                  onSelect={setDifficulty}
                />
              </div>

              {/* Start Button */}
              <button
                onClick={startGame}
                className="
relative
overflow-hidden
w-full
py-5
rounded-3xl
bg-gradient-to-r
from-cyan-500
to-emerald-500
text-white
font-bold
text-lg
shadow-[0_0_40px_rgba(6,182,212,0.25)]
hover:shadow-[0_0_60px_rgba(6,182,212,0.4)]
hover:scale-[1.01]
active:scale-[0.99]
transition-all
duration-300
flex
items-center
justify-center
gap-3
group
"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Começar Jogo
              </button>

              {/* Game Rules */}
              <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm p-6">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Como Jogar
                </h3>
                <div className="grid md:grid-cols-3 gap-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="font-bold text-cyan-400">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        Vire as cartas
                      </p>
                      <p className="text-xs text-slate-500">
                        Clique para revelar os conceitos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="font-bold text-emerald-400">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        Encontre os pares
                      </p>
                      <p className="text-xs text-slate-500">
                        Conecte dados e indicadores
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="font-bold text-amber-400">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        Acumule pontos
                      </p>
                      <p className="text-xs text-slate-500">
                        Menos jogadas = mais pontos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Leaderboard */}
            <div className="lg:col-span-1">
              <Leaderboard />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-[1300px]  mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center border border-cyan-500/30">
              <Factory className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 -none">
                Memória Estratégica
              </h1>
              <p className="text-xs text-slate-400">
                {config.name} - {config.pairs} pares
              </p>
            </div>
          </div>
          <button
            onClick={() => setScreen("start")}
            className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
          >
            <RotateCcw className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <Timer seconds={seconds} />
          <Score
            moves={moves}
            matchedPairs={matchedPairs}
            totalPairs={config.pairs}
          />
        </div>

        {/* Game Area */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Game Board */}
          <div className="lg:col-span-2">
            <GameBoard
              cards={cards}
              difficulty={difficulty}
              onCardClick={handleCardClick}
              disabled={isProcessing || previewing}
            />
          </div>

          {/* Sidebar - Leaderboard Toggle */}
          <div className="lg:col-span-1 hidden lg:block">
            <Leaderboard highlightScore={lastSavedScore} />
          </div>
        </div>

        {/* Mobile Leaderboard Toggle */}
        <div className="lg:hidden mt-4">
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="w-full py-3 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center gap-2 text-slate-300"
          >
            {showLeaderboard ? "Ocultar Ranking" : "Ver Ranking"}
            {showLeaderboard ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {showLeaderboard && (
            <div className="mt-4">
              <Leaderboard highlightScore={lastSavedScore} />
            </div>
          )}
        </div>
      </div>

      {/* Game Over Modal */}
      {screen === "gameOver" && (
        <GameOverModal
          moves={moves}
          timeSeconds={seconds}
          difficulty={difficulty}
          onRestart={restartGame}
          onClose={() => setScreen("start")}
        />
      )}

      {pairExplanation && (
        <PairExplanationModal
          title={pairExplanation.title}
          explanation={pairExplanation.explanation}
          onClose={() => {
            setPairExplanation(null);
            setIsPaused(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
