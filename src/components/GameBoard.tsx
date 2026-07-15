import { memo } from "react";
import { GameCard, Difficulty, getDifficultyConfig } from "../types/game";
import Card from "./Card";

interface GameBoardProps {
  cards: GameCard[];
  difficulty: Difficulty;
  onCardClick: (uniqueId: string) => void;
  disabled: boolean;
}

const GameBoard = memo(function GameBoard({
  cards,
  difficulty,
  onCardClick,
  disabled,
}: GameBoardProps) {
  const config = getDifficultyConfig(difficulty);

  return (
    <div
      className={`grid gap-3 w-full max-w-[1800px] mx-auto
      ${config.gridCols === 4 ? "grid-cols-4" : "grid-cols-4"}
      ${config.pairs <= 4 ? "sm:gap-4" : "sm:gap-3"}`}
    >
      {cards.map((card) => (
        <div
          key={card.uniqueId}
          className={config.pairs <= 4 ? "aspect-[3/2.2]" : "aspect-[3/2.5]"}
        >
          <Card card={card} onClick={onCardClick} disabled={disabled} />
        </div>
      ))}
    </div>
  );
});

export default GameBoard;
