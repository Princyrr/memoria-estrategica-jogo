const crescimento = new URL("../assets/crescimento.png", import.meta.url).href;
const dados = new URL("../assets/dados.png", import.meta.url).href;
const digitalizacao = new URL("../assets/digitalizacao.png", import.meta.url)
  .href;
const educacao = new URL("../assets/educacao.png", import.meta.url).href;
const energialimpa = new URL("../assets/energialimpa.png", import.meta.url)
  .href;
const exportacao = new URL("../assets/exportacao.png", import.meta.url).href;
const industria = new URL("../assets/industria.png", import.meta.url).href;
const infraestrutura = new URL("../assets/infraestrutura.png", import.meta.url)
  .href;
const logistica = new URL("../assets/logistica.png", import.meta.url).href;
const sustentabilidade = new URL(
  "../assets/sustentabilidade.png",
  import.meta.url,
).href;
const tecnologia = new URL("../assets/tecnologia.png", import.meta.url).href;
const treinamento = new URL("../assets/treinamento.png", import.meta.url).href;

export type Difficulty = "easy" | "medium" | "hard";

export interface CardData {
  id: string;
  pairId: string;
  concept: string;
  description: string;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameCard extends CardData {
  uniqueId: string;
}

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  time_seconds: number;
  moves: number;
  difficulty: string;
  created_at: string;
}

export interface GameState {
  cards: GameCard[];
  flippedCards: string[];
  matchedPairs: number;
  moves: number;
  isGameOver: boolean;
  isPlaying: boolean;
  startTime: number | null;
  difficulty: Difficulty;
}

export interface CardPair {
  pairId: string;

  explanation: string;

  left: {
    concept: string;
    description: string;
    icon: string;
  };

  right: {
    concept: string;
    description: string;
    icon: string;
  };
}

export const CARD_PAIRS: CardPair[] = [
  {
    pairId: "industry-jobs",
    explanation:
      "O aumento da produção industrial é um indicador direto da expansão do mercado de trabalho e da geração de empregos.",

    left: {
      concept: "Produção Industrial",
      description: "Atividade econômica",
      icon: industria,
    },
    right: {
      concept: "Empregos",
      description: "Indicador de trabalho",
      icon: industria,
    },
  },

  {
    pairId: "education-qualification",
    explanation:
      "O avanço da educação técnica impacta diretamente os indicadores de qualificação da força de trabalho.",

    left: {
      concept: "Educação Técnica",
      description: "Formação profissional",
      icon: educacao,
    },
    right: {
      concept: "Qualificação Profissional",
      description: "Indicador de capacitação",
      icon: educacao,
    },
  },

  {
    pairId: "sustainability-development",
    explanation:
      "A adoção de práticas sustentáveis influencia indicadores de desenvolvimento econômico e ambiental.",

    left: {
      concept: "Práticas Sustentáveis",
      description: "Gestão ambiental",
      icon: sustentabilidade,
    },
    right: {
      concept: "Desenvolvimento Sustentável",
      description: "Indicador de progresso",
      icon: sustentabilidade,
    },
  },

  {
    pairId: "innovation-technology",
    explanation:
      "O nível de inovação nas empresas reflete diretamente os indicadores de modernização tecnológica.",

    left: {
      concept: "Inovação",
      description: "Novas soluções",
      icon: tecnologia,
    },
    right: {
      concept: "Tecnologia",
      description: "Indicador de modernização",
      icon: tecnologia,
    },
  },

  {
    pairId: "investment-growth",
    explanation:
      "O volume de investimentos realizados impacta diretamente os indicadores de crescimento econômico.",

    left: {
      concept: "Investimentos",
      description: "Aplicação de capital",
      icon: crescimento,
    },
    right: {
      concept: "Crescimento Econômico",
      description: "Indicador macroeconômico",
      icon: crescimento,
    },
  },

  {
    pairId: "exports-economy",
    explanation:
      "O desempenho das exportações influencia os indicadores de força da economia nacional.",

    left: {
      concept: "Exportações",
      description: "Comércio exterior",
      icon: exportacao,
    },
    right: {
      concept: "Economia Nacional",
      description: "Indicador econômico",
      icon: exportacao,
    },
  },

  {
    pairId: "data-decisions",
    explanation:
      "A análise de dados melhora a qualidade dos indicadores utilizados na tomada de decisões estratégicas.",

    left: {
      concept: "Análise de Dados",
      description: "Base informacional",
      icon: dados,
    },
    right: {
      concept: "Decisões Estratégicas",
      description: "Indicador de gestão",
      icon: dados,
    },
  },

  {
    pairId: "energy-future",
    explanation:
      "O uso de energia limpa influencia indicadores de sustentabilidade e transição energética.",

    left: {
      concept: "Energia Limpa",
      description: "Fontes renováveis",
      icon: energialimpa,
    },
    right: {
      concept: "Futuro Sustentável",
      description: "Indicador ambiental",
      icon: energialimpa,
    },
  },

  {
    pairId: "digital-productivity",
    explanation:
      "A Rede de Observatórios acompanha tendências, indicadores e dados estratégicos que apoiam a tomada de decisão e fortalecem a competitividade da indústria paraibana.",

    left: {
      concept: "Observatório PB",
      description:
        "Integra informações, estudos e inteligência estratégica para o desenvolvimento industrial",
      icon: digitalizacao,
    },

    right: {
      concept: "Observatório PB",
      description:
        "Produz análises e indicadores que apoiam empresas, instituições e o setor produtivo da Paraíba",
      icon: digitalizacao,
    },
  },
  {
    pairId: "logistics-distribution",
    explanation:
      "A eficiência logística impacta diretamente indicadores de distribuição e tempo de entrega.",

    left: {
      concept: "Logística",
      description: "Gestão de fluxo",
      icon: logistica,
    },
    right: {
      concept: "Distribuição",
      description: "Indicador operacional",
      icon: logistica,
    },
  },

  {
    pairId: "training-quality",
    explanation:
      "O treinamento de equipes melhora indicadores de qualidade e desempenho operacional.",

    left: {
      concept: "Treinamento",
      description: "Capacitação",
      icon: treinamento,
    },
    right: {
      concept: "Qualidade",
      description: "Indicador de desempenho",
      icon: treinamento,
    },
  },

  {
    pairId: "infrastructure-development",
    explanation:
      "O investimento em infraestrutura influencia indicadores de desenvolvimento regional.",

    left: {
      concept: "Infraestrutura",
      description: "Base estrutural",
      icon: infraestrutura,
    },
    right: {
      concept: "Desenvolvimento Regional",
      description: "Indicador territorial",
      icon: infraestrutura,
    },
  },
];
export const getDifficultyConfig = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "easy":
      return { pairs: 4, gridCols: 4, name: "Fácil" };
    case "medium":
      return { pairs: 6, gridCols: 4, name: "Médio" };
    case "hard":
      return { pairs: 8, gridCols: 4, name: "Difícil" };
  }
};

export const calculateScore = (
  moves: number,
  timeSeconds: number,
  difficulty: Difficulty,
): number => {
  const baseScore = getDifficultyConfig(difficulty).pairs * 100;
  const movesPenalty =
    Math.max(0, moves - getDifficultyConfig(difficulty).pairs) * 5;
  const timeBonus = Math.max(0, 300 - timeSeconds) * 2;
  const difficultyMultiplier =
    difficulty === "easy" ? 1 : difficulty === "medium" ? 1.5 : 2;

  return Math.round(
    (baseScore - movesPenalty + timeBonus) * difficultyMultiplier,
  );
};
