// Sistema de Tiers e Qualidades para Equipamentos

export type TierId = 
  | "common"      // Comum
  | "uncommon"    // Incomum
  | "rare"        // Raro
  | "epic"        // Épico
  | "legendary"   // Lendário
  | "mythic"      // Mítico
  | "divine"      // Divino
  | "artifact"    // Artefato
  | "god";        // Deus

export type QualityId =
  | "normal"      // Normal
  | "good"        // Bom
  | "exceptional" // Excepcional
  | "excellent"   // Excelente
  | "masterpiece"; // Obra-prima

export interface TierDef {
  id: TierId;
  name: string;
  color: string;
  bgColor: string;
  dropRate: number; // Chance de drop (%)
  maxDropRate: number; // Taxa máxima de drop (para limitar)
  icon: string;
  description: string;
  statMultiplier: number; // Multiplicador de stats base
}

export interface QualityDef {
  id: QualityId;
  name: string;
  color: string;
  dropRate: number; // Chance de qualidade dentro do tier (%)
  statMultiplier: number; // Multiplicador adicional de stats
}

// Definição dos Tiers
export const TIERS: Record<TierId, TierDef> = {
  common: {
    id: "common",
    name: "Comum",
    color: "#9ca3af", // Cinza
    bgColor: "#374151",
    dropRate: 30.0,
    maxDropRate: 100.0,
    icon: "⚪",
    description: "Equipamento básico, sem atributos especiais.",
    statMultiplier: 1.0,
  },
  uncommon: {
    id: "uncommon",
    name: "Incomum",
    color: "#22c55e", // Verde
    bgColor: "#14532d",
    dropRate: 15.0,
    maxDropRate: 100.0,
    icon: "🟢",
    description: "Equipamento ligeiramente superior ao comum.",
    statMultiplier: 1.3,
  },
  rare: {
    id: "rare",
    name: "Raro",
    color: "#3b82f6", // Azul
    bgColor: "#1e3a8a",
    dropRate: 8.0,
    maxDropRate: 100.0,
    icon: "🔵",
    description: "Equipamento com atributos notáveis.",
    statMultiplier: 1.7,
  },
  epic: {
    id: "epic",
    name: "Épico",
    color: "#a855f7", // Roxo
    bgColor: "#581c87",
    dropRate: 3.5,
    maxDropRate: 100.0,
    icon: "🟣",
    description: "Equipamento poderoso com habilidades únicas.",
    statMultiplier: 2.3,
  },
  legendary: {
    id: "legendary",
    name: "Lendário",
    color: "#fbbf24", // Dourado
    bgColor: "#92400e",
    dropRate: 1.0,
    maxDropRate: 100.0,
    icon: "🟡",
    description: "Equipamento de poder lendário, muito raro.",
    statMultiplier: 3.0,
  },
  mythic: {
    id: "mythic",
    name: "Mítico",
    color: "#ef4444", // Vermelho
    bgColor: "#991b1b",
    dropRate: 0.5,
    maxDropRate: 100.0,
    icon: "🔴",
    description: "Equipamento mitológico de poder imenso.",
    statMultiplier: 4.0,
  },
  divine: {
    id: "divine",
    name: "Divino",
    color: "#ec4899", // Arco-íris (rosa como base)
    bgColor: "#831843",
    dropRate: 0.08,
    maxDropRate: 100.0,
    icon: "🌈",
    description: "Equipamento abençoado pelos deuses.",
    statMultiplier: 5.5,
  },
  artifact: {
    id: "artifact",
    name: "Artefato",
    color: "#f97316", // Laranja
    bgColor: "#9a3412",
    dropRate: 0.01,
    maxDropRate: 100.0,
    icon: "🏺",
    description: "Artefato antigo de poder inestimável.",
    statMultiplier: 7.5,
  },
  god: {
    id: "god",
    name: "Deus",
    color: "#ffffff", // Branco e preto
    bgColor: "#000000",
    dropRate: 0.009,
    maxDropRate: 1.0, // Apenas 1 no jogo inteiro!
    icon: "⚡",
    description: "Equipamento divino, único em todo o jogo. Apenas um jogador pode possuí-lo.",
    statMultiplier: 15.0,
  },
};

// Definição das Qualidades
export const QUALITIES: Record<QualityId, QualityDef> = {
  normal: {
    id: "normal",
    name: "Normal",
    color: "#9ca3af",
    dropRate: 40.0,
    statMultiplier: 1.0,
  },
  good: {
    id: "good",
    name: "Bom",
    color: "#22c55e",
    dropRate: 25.0,
    statMultiplier: 1.15,
  },
  exceptional: {
    id: "exceptional",
    name: "Excepcional",
    color: "#3b82f6",
    dropRate: 15.0,
    statMultiplier: 1.35,
  },
  excellent: {
    id: "excellent",
    name: "Excelente",
    color: "#a855f7",
    dropRate: 10.0,
    statMultiplier: 1.6,
  },
  masterpiece: {
    id: "masterpiece",
    name: "Obra-prima",
    color: "#fbbf24",
    dropRate: 5.0,
    statMultiplier: 2.0,
  },
};

// Ordem dos tiers (do mais comum ao mais raro)
export const TIER_ORDER: TierId[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
  "divine",
  "artifact",
  "god",
];

// Ordem das qualidades (da pior para a melhor)
export const QUALITY_ORDER: QualityId[] = [
  "normal",
  "good",
  "exceptional",
  "excellent",
  "masterpiece",
];

// Função para obter tier por ID
export function getTierById(id: TierId): TierDef {
  return TIERS[id];
}

// Função para obter qualidade por ID
export function getQualityById(id: QualityId): QualityDef {
  return QUALITIES[id];
}

// Função para sortear um tier baseado nas chances de drop
export function rollTier(): TierId {
  const roll = Math.random() * 100;
  let cumulative = 0;
  
  for (const tierId of TIER_ORDER) {
    cumulative += TIERS[tierId].dropRate;
    if (roll <= cumulative) {
      return tierId;
    }
  }
  
  return "common"; // Fallback
}

// Função para sortear uma qualidade baseado nas chances
export function rollQuality(): QualityId {
  const roll = Math.random() * 100;
  let cumulative = 0;
  
  for (const qualityId of QUALITY_ORDER) {
    cumulative += QUALITIES[qualityId].dropRate;
    if (roll <= cumulative) {
      return qualityId;
    }
  }
  
  return "normal"; // Fallback
}

// Função para calcular o multiplicador total de stats
export function getTotalMultiplier(tier: TierId, quality: QualityId): number {
  return TIERS[tier].statMultiplier * QUALITIES[quality].statMultiplier;
}

// Função para formatar o nome do item com tier e qualidade
export function formatItemName(baseName: string, tier: TierId, quality: QualityId): string {
  const tierName = TIERS[tier].name;
  const qualityName = QUALITIES[quality].name;
  return `${qualityName} ${baseName} ${tierName}`;
}

// Verifica se o tier Deus já foi dropado (deve ser verificado no backend/servidor)
export function isGodItemDropped(): boolean {
  // TODO: Implementar verificação com servidor/backend
  // Por enquanto retorna false
  return false;
}

// Função para gerar cor do item baseado no tier e qualidade
export function getItemColor(tier: TierId, quality: QualityId): string {
  // Se for tier Deus, retorna branco/preto especial
  if (tier === "god") {
    return "#ffffff";
  }
  
  // Para outros tiers, mistura a cor do tier com a qualidade
  const tierColor = TIERS[tier].color;
  const qualityColor = QUALITIES[quality].color;
  
  // Retorna a cor do tier (pode ser melhorado com mistura de cores)
  return tierColor;
}
