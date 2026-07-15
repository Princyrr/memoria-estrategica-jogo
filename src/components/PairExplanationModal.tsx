interface PairExplanationModalProps {
  title: string;
  explanation: string;
  onClose: () => void;
}

export default function PairExplanationModal({
  title,
  explanation,
  onClose,
}: PairExplanationModalProps) {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-2xl border border-cyan-500/30 bg-slate-900 p-6 shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* título */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white mb-2">
            Combinação Correta!
          </h2>

          <p className="text-cyan-400 font-semibold text-lg">{title}</p>
        </div>

        {/* conteúdo */}
        <div className="rounded-xl bg-slate-800/70 border border-slate-700 p-4">
          <p className="text-slate-300 leading-relaxed">{explanation}</p>
        </div>

        {/* botão */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold hover:opacity-90 transition"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
