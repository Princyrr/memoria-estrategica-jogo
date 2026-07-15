import { memo } from "react";
import logoBranca from "../assets/logobranca.png";

interface CardData {
  uniqueId: string;
  concept: string;
  description: string;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface CardProps {
  card: CardData;
  onClick: (uniqueId: string) => void;
  disabled: boolean;
}

const Card = memo(function Card({ card, onClick, disabled }: CardProps) {
  return (
    <div
      className={`perspective-1000 cursor-pointer ${
        disabled ? "pointer-events-none" : ""
      }`}
      onClick={() =>
        !card.isFlipped && !card.isMatched && onClick(card.uniqueId)
      }
    >
      <div
        className={`relative w-full aspect-[3/2] transition-transform duration-500 transform-style-preserve-3d
        ${card.isFlipped || card.isMatched ? "rotate-y-180" : ""}`}
      >
        {/* CARD BACK */}
        <div className="absolute inset-0 backface-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 shadow-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={logoBranca}
              alt="Logo"
              className="w-20 h-20 sm:w-36 sm:h-36 object-contain opacity-90"
            />
          </div>

          {/* brilho */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

          {/* detalhes */}
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 bg-cyan-400/40 rounded-full blur-sm" />
          </div>

          <div className="absolute bottom-2 left-2">
            <div className="w-3 h-3 bg-teal-400/30 rounded-full blur-sm" />
          </div>
        </div>

        {/* CARD FRONT */}
        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl shadow-xl overflow-hidden
          ${
            card.isMatched
              ? "bg-gradient-to-br from-emerald-500 to-teal-600 border-2 border-emerald-400/50"
              : "bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/30"
          }`}
        >
          <div className="absolute inset-0 p-2 sm:p-3 flex flex-col items-center justify-center text-center">
            {/* IMAGEM PNG */}
            <div
              className={`w-full h-full flex items-center justify-center rounded-xl overflow-hidden
              ${
                card.isMatched
                  ? "bg-white/20"
                  : "bg-gradient-to-br from-cyan-500/20 to-teal-500/20"
              }`}
            >
              <img
                src={card.icon}
                alt={card.concept}
                className="w-16 h-16 sm:w-28 sm:h-28 object-contain"
              />
            </div>

            {/* DESKTOP ONLY */}
            <div className="hidden sm:block">
              {/* CONCEITO */}
              <h3
                className={`text-sm font-bold leading-tight mb-1 mt-2
                ${card.isMatched ? "text-white" : "text-slate-100"}`}
              >
                {card.concept}
              </h3>

              {/* DESCRIÇÃO */}
              <p
                className={`text-xs leading-tight line-clamp-2
                ${card.isMatched ? "text-white/90" : "text-slate-400"}`}
              >
                {card.description}
              </p>
            </div>
          </div>

          {/* CHECK  */}
          {card.isMatched && (
            <div className="absolute top-2 right-2">
              <div className="bg-white/20 rounded-full p-1">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Card;
