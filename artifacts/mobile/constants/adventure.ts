// Sistema de Aventura - Biomas, Dungeons e Variantes

import { ElementId } from "./elements";

export type BiomeId = 
  | "floresta"      // Floresta Encantada
  | "montanha"      // Montanhas Gélidas
  | "deserto"       // Deserto de Areia Negra
  | "pantano"       // Pântano das Almas
  | "vulcao"        // Vulcão Adormecido
  | "tundra"        // Tundra Eterna
  | "selva"         // Selva Profunda
  | "costa"         // Costa dos Naufrágios
  | "ceu"           // Reino Celestial
  | "inferno"       // Abismo Infernal
  | "void";         // Vazio Cósmico

export type DungeonTier = "F" | "E" | "D" | "C" | "B" | "A" | "S" | "SS" | "SSS" | "SSS+";

export type DungeonType = "solo" | "group" | "raid";

// Variantes de dungeons
export type DungeonVariant = 
  | "normal"
  | "corrupted"      // Corrompida - inimigos mais fortes, melhores drops
  | "blessed"        // Abençoada - cura ao entrar, buffs
  | "cursed"         // Amaldiçoada - debuffs, mas drops únicos
  | "ancient"        // Antiga - inimigos ancestrais, loot histórico
  | "elemental"      // Elemental - focada em um elemento
  | "time_warped"    // Temporal - inimigos de diferentes épocas
  | "shadow"         // Sombria - inimigos das sombras
  | "crystalline"    // Cristalina - cristais mágicos por toda parte
  | "living"         // Viva - a própria dungeon é um organismo
  | "mechanical"     // Mecânica - armadilhas e construtos
  | "ethereal";      // Etérea - fantasmas e espíritos

export interface DungeonVariantDef {
  id: DungeonVariant;
  name: string;
  emoji: string;
  description: string;
  modifiers: {
    enemyHp: number;      // Multiplicador de HP dos inimigos
    enemyDmg: number;     // Multiplicador de dano dos inimigos
    dropRate: number;     // Multiplicador de chance de drop
    expBonus: number;     // Bônus de experiência
    specialLoot: boolean; // Tem loot especial?
  };
  color: string;
}

export const DUNGEON_VARIANTS: Record<DungeonVariant, DungeonVariantDef> = {
  normal: {
    id: "normal",
    name: "Normal",
    emoji: "📍",
    description: "Uma dungeon comum",
    modifiers: { enemyHp: 1, enemyDmg: 1, dropRate: 1, expBonus: 1, specialLoot: false },
    color: "#9ca3af",
  },
  corrupted: {
    id: "corrupted",
    name: "Corrompida",
    emoji: "🩸",
    description: "Energia maligna permeia este lugar",
    modifiers: { enemyHp: 1.5, enemyDmg: 1.3, dropRate: 1.4, expBonus: 1.3, specialLoot: true },
    color: "#8b0000",
  },
  blessed: {
    id: "blessed",
    name: "Abençoada",
    emoji: "✨",
    description: "Bênçãos divinas protegem os aventureiros",
    modifiers: { enemyHp: 0.9, enemyDmg: 0.8, dropRate: 1.2, expBonus: 1.1, specialLoot: true },
    color: "#ffd700",
  },
  cursed: {
    id: "cursed",
    name: "Amaldiçoada",
    emoji: "💀",
    description: "Uma maldição antiga assombra este lugar",
    modifiers: { enemyHp: 1.3, enemyDmg: 1.4, dropRate: 1.5, expBonus: 1.4, specialLoot: true },
    color: "#4b0082",
  },
  ancient: {
    id: "ancient",
    name: "Antiga",
    emoji: "🏛️",
    description: "Ruínas de uma civilização perdida",
    modifiers: { enemyHp: 1.4, enemyDmg: 1.2, dropRate: 1.6, expBonus: 1.5, specialLoot: true },
    color: "#d2691e",
  },
  elemental: {
    id: "elemental",
    name: "Elemental",
    emoji: "🔮",
    description: "Um elemento dominante neste lugar",
    modifiers: { enemyHp: 1.2, enemyDmg: 1.3, dropRate: 1.3, expBonus: 1.2, specialLoot: true },
    color: "#9370db",
  },
  time_warped: {
    id: "time_warped",
    name: "Temporal",
    emoji: "⏳",
    description: "O tempo flui de forma estranha aqui",
    modifiers: { enemyHp: 1.3, enemyDmg: 1.3, dropRate: 1.4, expBonus: 1.6, specialLoot: true },
    color: "#00ced1",
  },
  shadow: {
    id: "shadow",
    name: "Sombria",
    emoji: "🌑",
    description: "As sombras ganham vida neste lugar",
    modifiers: { enemyHp: 1.1, enemyDmg: 1.5, dropRate: 1.3, expBonus: 1.3, specialLoot: true },
    color: "#2f2f2f",
  },
  crystalline: {
    id: "crystalline",
    name: "Cristalina",
    emoji: "💎",
    description: "Cristais mágicos crescem por toda parte",
    modifiers: { enemyHp: 1.2, enemyDmg: 1.2, dropRate: 1.7, expBonus: 1.4, specialLoot: true },
    color: "#e6e6fa",
  },
  living: {
    id: "living",
    name: "Viva",
    emoji: "🌿",
    description: "A própria dungeon é um organismo gigante",
    modifiers: { enemyHp: 1.6, enemyDmg: 1.1, dropRate: 1.5, expBonus: 1.5, specialLoot: true },
    color: "#228b22",
  },
  mechanical: {
    id: "mechanical",
    name: "Mecânica",
    emoji: "⚙️",
    description: "Construtos antigos patrulham os corredores",
    modifiers: { enemyHp: 1.4, enemyDmg: 1.3, dropRate: 1.4, expBonus: 1.3, specialLoot: true },
    color: "#708090",
  },
  ethereal: {
    id: "ethereal",
    name: "Etérea",
    emoji: "👻",
    description: "O véu entre os mundos é fino aqui",
    modifiers: { enemyHp: 0.8, enemyDmg: 1.6, dropRate: 1.5, expBonus: 1.7, specialLoot: true },
    color: "#dda0dd",
  },
};

export interface DungeonDef {
  id: string;
  name: string;
  biomeId: BiomeId;
  tier: DungeonTier;
  type: DungeonType;
  variant: DungeonVariant;
  minLevel: number;
  maxLevel: number;
  description: string;
  discoveryChance: number;
  groupSize?: number;
  icon: string;
  color: string;
  element?: ElementId; // Para dungeons elementais
  discoveredAt?: number; // Timestamp de quando foi descoberta
  timesCompleted: number; // Quantas vezes foi completada
  isUnlocked: boolean; // Se está disponível para entrar
}

export interface DiscoveredDungeon {
  dungeonId: string;
  discoveredAt: number;
  timesCompleted: number;
  lastCompletedAt?: number;
  bestTime?: number; // Melhor tempo em segundos
  fastestRun?: number;
  totalRuns: number;
  successfulRuns: number;
}

export interface BiomeDef {
  id: BiomeId;
  name: string;
  description: string;
  emoji: string;
  color: string;
  bgColor: string;
  minLevel: number;
  maxLevel: number;
  dungeons: DungeonDef[];
  explorationTime: number;
  nativeElements: ElementId[]; // Elementos nativos do bioma
  hazards: string[]; // Perigos do bioma
}

// Tiers de dungeons com cores
export const DUNGEON_TIERS: Record<DungeonTier, { name: string; color: string; multiplier: number }> = {
  "F": { name: "F", color: "#9ca3af", multiplier: 1.0 },
  "E": { name: "E", color: "#22c55e", multiplier: 1.3 },
  "D": { name: "D", color: "#3b82f6", multiplier: 1.7 },
  "C": { name: "C", color: "#a855f7", multiplier: 2.2 },
  "B": { name: "B", color: "#f59e0b", multiplier: 2.8 },
  "A": { name: "A", color: "#ef4444", multiplier: 3.5 },
  "S": { name: "S", color: "#ec4899", multiplier: 4.5 },
  "SS": { name: "SS", color: "#22d3ee", multiplier: 6.0 },
  "SSS": { name: "SSS", color: "#fbbf24", multiplier: 8.0 },
  "SSS+": { name: "SSS+", color: "#ffffff", multiplier: 12.0 },
};

// Nomes temáticos para dungeons
const DUNGEON_NAMES = {
  floresta: [
    "Templo da Folha Eterna", "Caverna das Raízes Profundas", "Santuário do Ancião",
    "Ruínas Élficas", "Covil da Aranha Rainha", "Árvore da Vida Morta",
    "Pântano Sombrio", "Círculo de Pedras", "Toca dos Lobos",
    "Jardim Proibido", "Fonte da Juventude", "Altar da Natureza",
  ],
  montanha: [
    "Pico do Dragão Adormecido", "Mina Abandonada", "Fortaleza Anã",
    "Passo da Águia", "Caverna de Cristal", "Templo do Gelo Eterno",
    "Abismo sem Fundo", "Ponte do Céu", "Refúgio dos Yetis",
    "Forja Sagrada", "Tumba do Rei da Montanha", "Santuário Gelado",
  ],
  deserto: [
    "Pirâmide Perdida", "Templo do Sol", "Oásis Escondido",
    "Cidade Enterrada", "Fenda das Areias", "Tumba do Faraó",
    "Mercado Fantasma", "Palácio de Sal", "Labirinto de Pedra",
    "Poço das Almas", "Jardins Suspensos", "Relíquia Antiga",
  ],
  pantano: [
    "Cabana da Bruxa", "Lago do Lamento", "Árvore dos Enforcados",
    "Ilha das Bonecas", "Cemitério de Barcos", "Covil do Crocodilo",
    "Fonte de Lágrimas", "Ruínas Submersas", "Jardim de Cogumelos",
    "Pântano das Wisps", "Templo do Sapo", "Caverna do Lodo",
  ],
  vulcao: [
    "Caldeira do Inferno", "Forja dos Deuses", "Covil do Verme de Lava",
    "Câmara de Obsidiana", "Passagem de Fogo", "Templo do Fogo Eterno",
    "Fonte de Magma", "Cidade de Cinzas", "Santuário do Demônio",
    "Pico Flamejante", "Caverna Enxofre", "Portal do Inferno",
  ],
  tundra: [
    "Cidadela de Gelo", "Tumba do Rei do Inverno", "Caverna do Urso Polar",
    "Ponte de Gelo", "Santuário da Aurora", "Ruínas Congeladas",
    "Fonte Termal", "Vale da Morte Branca", "Torre do Mago do Gelo",
    "Covil da Besta das Neves", "Templo do Lobo", "Cristal do Eterno",
  ],
  selva: [
    "Cidade Perdida", "Templo dos Mil Deuses", "Caverna das Serpentes",
    "Árvore do Mundo", "Altar dos Sacrifícios", "Ruínas Maias",
    "Cataratas Escondidas", "Vale dos Dinossauros", "Santuário do Jaguar",
    "Jardim das Orquídeas", "Pântano de Sangue", "Pico do Falcão",
  ],
  costa: [
    "Caverna da Maré", "Navio Fantasma", "Templo de Poseidon",
    "Recife de Coral", "Fenda Abissal", "Faroil Abandonado",
    "Cidade Submersa", "Praia dos Ossos", "Covil da Sereia",
    "Ilha do Tesouro", "Gruta da Pérola", "Forte dos Piratas",
  ],
  ceu: [
    "Palácio das Nuvens", "Jardim Celestial", "Arena dos Anjos",
    "Biblioteca dos Deuses", "Forja Estelar", "Santuário do Sol",
    "Castelo de Cristal", "Ponte Arco-Íris", "Templo da Lua",
    "Cidade Flutuante", "Observatório Divino", "Trono do Arconte",
  ],
  inferno: [
    "Trono de Lucifer", "Rio de Fogo", "Campo de Batalha Demoníaco",
    "Prisão das Almas", "Forja Infernal", "Labirinto do Desespero",
    "Covil do Demônio Príncipe", "Fonte de Sangue", "Templo da Dor",
    "Cidade dos Pecadores", "Abismo sem Fundo", "Portal do Caos",
  ],
  void: [
    "Núcleo do Vazio", "Dimensão Paralela", "Cidade dos Esquecidos",
    "Labirinto Dimensional", "Olho do Vazio", "Templo do Nada",
    "Câmara das Sombras", "Ponte entre Mundos", "Santuário do Último",
    "Biblioteca Infinita", "Trono do Vazio", "Origem de Tudo",
  ],
};

// Gerar uma variante aleatória
function rollVariant(): DungeonVariant {
  const variants = Object.keys(DUNGEON_VARIANTS) as DungeonVariant[];
  const weights = [40, 12, 10, 10, 8, 8, 5, 4, 3, 3, 2, 1]; // Normal é mais comum
  
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < variants.length; i++) {
    random -= weights[i];
    if (random <= 0) return variants[i];
  }
  
  return "normal";
}

// Gerar dungeons solo para um bioma
function generateSoloDungeons(biomeId: BiomeId, count: number): DungeonDef[] {
  const dungeons: DungeonDef[] = [];
  const tiers: DungeonTier[] = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS"];
  const names = DUNGEON_NAMES[biomeId] || DUNGEON_NAMES.floresta;
  const biome = BIOMES[biomeId];
  
  for (let i = 0; i < count; i++) {
    const tier = tiers[Math.floor(Math.random() * tiers.length)];
    const variant = rollVariant();
    const discoveryChance = tier === "F" ? 15 : tier === "E" ? 10 : tier === "D" ? 7 : tier === "C" ? 5 : tier === "B" ? 3 : tier === "A" ? 2 : tier === "S" ? 1 : tier === "SS" ? 0.5 : 0.2;
    const element = biome.nativeElements[Math.floor(Math.random() * biome.nativeElements.length)];
    
    dungeons.push({
      id: `${biomeId}_solo_${i}_${Date.now()}`,
      name: names[i % names.length] || `Dungeon ${i + 1}`,
      biomeId,
      tier,
      type: "solo",
      variant,
      minLevel: biome.minLevel + Math.floor(i / 3) * 5,
      maxLevel: 300,
      description: generateDungeonDescription(variant, tier, "solo"),
      discoveryChance,
      icon: DUNGEON_VARIANTS[variant].emoji,
      color: DUNGEON_TIERS[tier].color,
      element: variant === "elemental" ? element : undefined,
      timesCompleted: 0,
      isUnlocked: false,
    });
  }
  
  return dungeons;
}

// Gerar dungeons em grupo para um bioma
function generateGroupDungeons(biomeId: BiomeId, count: number): DungeonDef[] {
  const dungeons: DungeonDef[] = [];
  const tiers: DungeonTier[] = ["C", "B", "A", "S", "SS", "SSS", "SSS+"];
  const names = DUNGEON_NAMES[biomeId] || DUNGEON_NAMES.floresta;
  const biome = BIOMES[biomeId];
  
  for (let i = 0; i < count; i++) {
    const tier = tiers[Math.floor(Math.random() * tiers.length)];
    const variant = rollVariant();
    const discoveryChance = tier === "C" ? 3 : tier === "B" ? 2 : tier === "A" ? 1.5 : tier === "S" ? 0.8 : tier === "SS" ? 0.4 : tier === "SSS" ? 0.15 : 0.05;
    const groupSize = tier === "C" || tier === "B" ? 3 : tier === "A" || tier === "S" ? 5 : tier === "SS" ? 8 : tier === "SSS" ? 12 : 20;
    const element = biome.nativeElements[Math.floor(Math.random() * biome.nativeElements.length)];
    
    dungeons.push({
      id: `${biomeId}_group_${i}_${Date.now()}`,
      name: names[(i + 30) % names.length] || `Raid ${i + 1}`,
      biomeId,
      tier,
      type: "group",
      variant,
      minLevel: biome.minLevel + 10 + Math.floor(i / 2) * 8,
      maxLevel: 300,
      description: generateDungeonDescription(variant, tier, "group", groupSize),
      discoveryChance,
      groupSize,
      icon: "🏰",
      color: DUNGEON_TIERS[tier].color,
      element: variant === "elemental" ? element : undefined,
      timesCompleted: 0,
      isUnlocked: false,
    });
  }
  
  return dungeons;
}

// Gerar raids épicas
function generateRaidDungeons(biomeId: BiomeId, count: number): DungeonDef[] {
  const dungeons: DungeonDef[] = [];
  const tiers: DungeonTier[] = ["A", "S", "SS", "SSS", "SSS+"];
  const names = DUNGEON_NAMES[biomeId] || DUNGEON_NAMES.floresta;
  const biome = BIOMES[biomeId];
  
  for (let i = 0; i < count; i++) {
    const tier = tiers[Math.floor(Math.random() * tiers.length)];
    const variant: DungeonVariant = Math.random() > 0.7 ? "corrupted" : Math.random() > 0.5 ? "ancient" : "cursed";
    const discoveryChance = tier === "A" ? 0.8 : tier === "S" ? 0.4 : tier === "SS" ? 0.2 : tier === "SSS" ? 0.08 : 0.02;
    const groupSize = tier === "A" ? 10 : tier === "S" ? 15 : tier === "SS" ? 20 : tier === "SSS" ? 30 : 50;
    
    dungeons.push({
      id: `${biomeId}_raid_${i}_${Date.now()}`,
      name: `Raid Épica: ${names[(i + 20) % names.length]}`,
      biomeId,
      tier,
      type: "raid",
      variant,
      minLevel: biome.minLevel + 20 + i * 10,
      maxLevel: 300,
      description: `Uma raid épica que requer ${groupSize} heróis corajosos.`,
      discoveryChance,
      groupSize,
      icon: "👑",
      color: DUNGEON_TIERS[tier].color,
      timesCompleted: 0,
      isUnlocked: false,
    });
  }
  
  return dungeons;
}

function generateDungeonDescription(variant: DungeonVariant, tier: DungeonTier, type: string, groupSize?: number): string {
  const variantDef = DUNGEON_VARIANTS[variant];
  let desc = variantDef.description;
  
  if (type === "group" && groupSize) {
    desc += ` Requer ${groupSize} jogadores.`;
  }
  
  return desc;
}

// Definição dos Biomas
export const BIOMES: Record<BiomeId, BiomeDef> = {
  floresta: {
    id: "floresta",
    name: "Floresta Encantada",
    description: "Uma floresta mágica cheia de criaturas místicas e segredos antigos.",
    emoji: "🌲",
    color: "#22c55e",
    bgColor: "#14532d",
    minLevel: 1,
    maxLevel: 50,
    explorationTime: 5,
    nativeElements: ["natureza", "terra", "veneno"],
    hazards: ["Armadilhas de caçadores", "Plantas carnívoras", "Névoa tóxica"],
    dungeons: [],
  },
  montanha: {
    id: "montanha",
    name: "Montanhas Gélidas",
    description: "Picos cobertos de gelo onde dragões ancestrais dormem.",
    emoji: "🏔️",
    color: "#06b6d4",
    bgColor: "#164e63",
    minLevel: 20,
    maxLevel: 80,
    explorationTime: 8,
    nativeElements: ["gelo", "terra", "vento"],
    hazards: ["Avalanches", "Hipotermia", "Penhascos"],
    dungeons: [],
  },
  deserto: {
    id: "deserto",
    name: "Deserto de Areia Negra",
    description: "Um deserto maldito onde o sol nunca brilha.",
    emoji: "🏜️",
    color: "#78716c",
    bgColor: "#451a03",
    minLevel: 40,
    maxLevel: 100,
    explorationTime: 10,
    nativeElements: ["fogo", "terra", "caos"],
    hazards: ["Tempestades de areia", "Desidratação", "Ilusões"],
    dungeons: [],
  },
  pantano: {
    id: "pantano",
    name: "Pântano das Almas",
    description: "Terras úmidas onde espíritos perdidos vagam eternamente.",
    emoji: "🌿",
    color: "#84cc16",
    bgColor: "#365314",
    minLevel: 60,
    maxLevel: 120,
    explorationTime: 12,
    nativeElements: ["veneno", "agua", "escuridao"],
    hazards: ["Gases tóxicos", "Pântanos movediços", "Doenças"],
    dungeons: [],
  },
  vulcao: {
    id: "vulcao",
    name: "Vulcão Adormecido",
    description: "O coração de fogo da terra, lar de demônios ancestrais.",
    emoji: "🌋",
    color: "#ef4444",
    bgColor: "#7f1d1d",
    minLevel: 80,
    maxLevel: 150,
    explorationTime: 15,
    nativeElements: ["fogo", "infernal", "metal"],
    hazards: ["Lava", "Gases tóxicos", "Terremotos"],
    dungeons: [],
  },
  tundra: {
    id: "tundra",
    name: "Tundra Eterna",
    description: "Gelo eterno onde nem o tempo passa.",
    emoji: "❄️",
    color: "#3b82f6",
    bgColor: "#1e3a8a",
    minLevel: 100,
    maxLevel: 180,
    explorationTime: 18,
    nativeElements: ["gelo", "vento", "agua"],
    hazards: ["Frio extremo", "Ventos cortantes", "Crevasses"],
    dungeons: [],
  },
  selva: {
    id: "selva",
    name: "Selva Profunda",
    description: "Uma selva tão densa que a luz do sol nunca toca o chão.",
    emoji: "🌴",
    color: "#10b981",
    bgColor: "#064e3b",
    minLevel: 130,
    maxLevel: 220,
    explorationTime: 20,
    nativeElements: ["natureza", "veneno", "sangue"],
    hazards: ["Predadores", "Doenças tropicais", "Vegetação densa"],
    dungeons: [],
  },
  costa: {
    id: "costa",
    name: "Costa dos Naufrágios",
    description: "Onde navios de todas as eras encontraram seu fim.",
    emoji: "⚓",
    color: "#f59e0b",
    bgColor: "#78350f",
    minLevel: 160,
    maxLevel: 300,
    explorationTime: 25,
    nativeElements: ["agua", "trovao", "metal"],
    hazards: ["Marés", "Sereias", "Tempestades"],
    dungeons: [],
  },
  ceu: {
    id: "ceu",
    name: "Reino Celestial",
    description: "O domínio dos deuses, flutuando acima das nuvens.",
    emoji: "☁️",
    color: "#fbbf24",
    bgColor: "#854d0e",
    minLevel: 200,
    maxLevel: 300,
    explorationTime: 30,
    nativeElements: ["luz", "ar", "divino"],
    hazards: ["Quedas mortais", "Guardiões celestiais", "Pressão divina"],
    dungeons: [],
  },
  inferno: {
    id: "inferno",
    name: "Abismo Infernal",
    description: "As profundezas do submundo, onde os pecadores sofrem eternamente.",
    emoji: "🔥",
    color: "#dc2626",
    bgColor: "#7f1d1d",
    minLevel: 220,
    maxLevel: 300,
    explorationTime: 35,
    nativeElements: ["infernal", "fogo", "caos"],
    hazards: ["Fogo eterno", "Demônios", "Corrupção"],
    dungeons: [],
  },
  void: {
    id: "void",
    name: "Vazio Cósmico",
    description: "O espaço entre as dimensões, onde a realidade se desfaz.",
    emoji: "🌌",
    color: "#7c3aed",
    bgColor: "#4c1d95",
    minLevel: 250,
    maxLevel: 300,
    explorationTime: 40,
    nativeElements: ["void", "astral", "caos"],
    hazards: ["Loucura", "Desmaterialização", "Entidades do vazio"],
    dungeons: [],
  },
};

// Inicializar dungeons para todos os biomas
Object.keys(BIOMES).forEach((biomeId) => {
  const biome = BIOMES[biomeId as BiomeId];
  biome.dungeons = [
    ...generateSoloDungeons(biomeId as BiomeId, 30),
    ...generateGroupDungeons(biomeId as BiomeId, 10),
    ...generateRaidDungeons(biomeId as BiomeId, 5),
  ];
});

// Sistema da Torre
export interface TowerFloor {
  floor: number;
  name: string;
  type: "normal" | "miniboss" | "boss" | "raid";
  minGroupSize: number;
  description: string;
  rewards: string[];
  element?: ElementId;
}

export const TOWER_NAME = "A Torre Infinita";
export const TOWER_FLOORS = 1000;

// Nomes especiais para andares da torre
const TOWER_FLOOR_NAMES = [
  "Entrada", "Primeiros Passos", "Subida Inicial", "Desafio Novato", "Teste de Fogo",
  "Caminho de Pedra", "Ventos Cortantes", "Névoa Densa", "Floresta Vertical", "Ponte Estreita",
  "Câmara de Cristal", "Salão de Espelhos", "Labirinto", "Armadilhas", "Guardião Menor",
  // ... pode adicionar mais
];

// Gerar os 1000 andares da Torre
export function generateTowerFloors(): TowerFloor[] {
  const floors: TowerFloor[] = [];
  const elements: ElementId[] = ["fogo", "agua", "terra", "ar", "gelo", "trovao", "natureza", "veneno", "arcano", "caos"];
  
  for (let i = 1; i <= TOWER_FLOORS; i++) {
    let type: "normal" | "miniboss" | "boss" | "raid" = "normal";
    let minGroupSize = 1;
    let name = TOWER_FLOOR_NAMES[i - 1] || `Andar ${i}`;
    let description = "Um andar da Torre Infinita.";
    const element = elements[i % elements.length];
    
    // Boss a cada 20 andares
    if (i % 20 === 0) {
      type = "boss";
      if (i < 100) minGroupSize = 5;
      else if (i < 500) minGroupSize = 10;
      else if (i < 800) minGroupSize = 20;
      else minGroupSize = 30;
      
      if (i === 1000) {
        type = "raid";
        minGroupSize = 50;
        name = "PINÁCULO DO INFINITO";
        description = "O ápice da Torre. Requer 50 heróis lendários.";
      } else {
        name = `Guardião ${i / 20}`;
        description = `Um poderoso guardião protege este andar. Requer ${minGroupSize} jogadores.`;
      }
    }
    // Mini-boss a cada 5 andares (que não são boss)
    else if (i % 5 === 0) {
      type = "miniboss";
      name = `Desafio ${Math.floor(i / 5)}`;
      description = "Um desafio especial aguarda neste andar.";
    }
    
    floors.push({
      floor: i,
      name,
      type,
      minGroupSize,
      description,
      rewards: [],
      element,
    });
  }
  
  return floors;
}

export const TOWER_FLOORS_DATA = generateTowerFloors();

// Função para verificar se um jogador pode explorar um bioma
export function canExploreBiome(biomeId: BiomeId, playerLevel: number): boolean {
  const biome = BIOMES[biomeId];
  return playerLevel >= biome.minLevel;
}

// Função para tentar descobrir uma dungeon
export function tryDiscoverDungeon(
  biomeId: BiomeId, 
  discoveredDungeons: DiscoveredDungeon[],
  playerLevel: number
): { dungeon: DungeonDef; discovered: boolean } | null {
  const biome = BIOMES[biomeId];
  
  // Filtrar dungeons disponíveis (que o jogador tem nível e ainda não descobriu)
  const discoveredIds = discoveredDungeons.map(d => d.dungeonId);
  const availableDungeons = biome.dungeons.filter(d => 
    !discoveredIds.includes(d.id) && 
    playerLevel >= d.minLevel
  );
  
  if (availableDungeons.length === 0) return null;
  
  // Tentar encontrar uma dungeon baseada na chance
  // Ordenar por chance de descoberta (maiores chances primeiro)
  const shuffled = [...availableDungeons].sort(() => Math.random() - 0.5);
  
  for (const dungeon of shuffled) {
    // Ajustar chance baseada no tier e na sorte do jogador
    const adjustedChance = dungeon.discoveryChance * (1 + (Math.random() * 0.5));
    
    if (Math.random() * 100 < adjustedChance) {
      return { dungeon, discovered: true };
    }
  }
  
  return null;
}

// Sistema de Level Up - Progressão exponencial para 5 anos de jogo
// Nível máximo: 300
// Tempo estimado: ~5 anos de jogo casual
export function calculateExpNeeded(level: number): number {
  if (level >= 300) return Infinity;
  
  const base = 100;
  const multiplier = 1.08;
  return Math.floor(base * Math.pow(multiplier, level - 1));
}

// Tempo estimado para upar (em horas de jogo ativo)
export function calculateTimeToLevel(level: number): number {
  const expNeeded = calculateExpNeeded(level);
  const expPerHour = 500 * Math.pow(1.02, level);
  return expNeeded / expPerHour;
}

// Tempo total estimado para chegar no nível 300 (em horas)
export function calculateTotalTimeToMax(): number {
  let totalHours = 0;
  for (let i = 1; i < 300; i++) {
    totalHours += calculateTimeToLevel(i);
  }
  return totalHours;
}

export const TOTAL_HOURS_TO_MAX = calculateTotalTimeToMax();
export const TOTAL_DAYS_TO_MAX = TOTAL_HOURS_TO_MAX / 2.5;

// Obter todas as dungeons descobertas de um bioma
export function getDiscoveredDungeonsForBiome(
  biomeId: BiomeId, 
  discoveredDungeons: DiscoveredDungeon[]
): DungeonDef[] {
  const biome = BIOMES[biomeId];
  const discoveredIds = new Set(discoveredDungeons.map(d => d.dungeonId));
  
  return biome.dungeons.filter(d => discoveredIds.has(d.id)).map(d => {
    const discovered = discoveredDungeons.find(disc => disc.dungeonId === d.id);
    return {
      ...d,
      discoveredAt: discovered?.discoveredAt,
      timesCompleted: discovered?.timesCompleted || 0,
      isUnlocked: true,
    };
  });
}

// Obter progresso de descoberta de um bioma
export function getBiomeDiscoveryProgress(
  biomeId: BiomeId, 
  discoveredDungeons: DiscoveredDungeon[]
): { discovered: number; total: number; percentage: number } {
  const biome = BIOMES[biomeId];
  const discoveredIds = new Set(discoveredDungeons.map(d => d.dungeonId));
  const discovered = biome.dungeons.filter(d => discoveredIds.has(d.id)).length;
  
  return {
    discovered,
    total: biome.dungeons.length,
    percentage: Math.round((discovered / biome.dungeons.length) * 100),
  };
}
