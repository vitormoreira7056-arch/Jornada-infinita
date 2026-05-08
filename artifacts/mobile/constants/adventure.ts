// Sistema de Aventura - Biomas e Dungeons

export type BiomeId = 
  | "floresta"      // Floresta Encantada
  | "montanha"      // Montanhas Gélidas
  | "deserto"       // Deserto de Areia Negra
  | "pantano"       // Pântano das Almas
  | "vulcao"        // Vulcão Adormecido
  | "tundra"        // Tundra Eterna
  | "selva"         // Selva Profunda
  | "costa";        // Costa dos Naufrágios

export type DungeonTier = "F" | "E" | "D" | "C" | "B" | "A" | "S" | "SS" | "SSS" | "SSS+";

export type DungeonType = "solo" | "group";

export interface DungeonDef {
  id: string;
  name: string;
  biomeId: BiomeId;
  tier: DungeonTier;
  type: DungeonType;
  minLevel: number;
  maxLevel: number;
  description: string;
  discoveryChance: number; // Chance de encontrar ao explorar (%)
  groupSize?: number; // Para dungeons em grupo
  icon: string;
  color: string;
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
  explorationTime: number; // Tempo base de exploração (minutos)
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

// Gerar dungeons solo para um bioma
function generateSoloDungeons(biomeId: BiomeId, count: number): DungeonDef[] {
  const dungeons: DungeonDef[] = [];
  const tiers: DungeonTier[] = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS"];
  
  for (let i = 0; i < count; i++) {
    const tier = tiers[Math.floor(Math.random() * tiers.length)];
    const discoveryChance = tier === "F" ? 15 : tier === "E" ? 10 : tier === "D" ? 7 : tier === "C" ? 5 : tier === "B" ? 3 : tier === "A" ? 2 : tier === "S" ? 1 : tier === "SS" ? 0.5 : 0.2;
    
    dungeons.push({
      id: `${biomeId}_solo_${i}`,
      name: `Dungeon ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) + 1}`,
      biomeId,
      tier,
      type: "solo",
      minLevel: 1 + Math.floor(i / 3) * 10,
      maxLevel: 300,
      description: `Uma dungeon misteriosa encontrada em ${biomeId}.`,
      discoveryChance,
      icon: "🏛️",
      color: DUNGEON_TIERS[tier].color,
    });
  }
  
  return dungeons;
}

// Gerar dungeons em grupo para um bioma
function generateGroupDungeons(biomeId: BiomeId, count: number): DungeonDef[] {
  const dungeons: DungeonDef[] = [];
  const tiers: DungeonTier[] = ["C", "B", "A", "S", "SS", "SSS", "SSS+"];
  
  for (let i = 0; i < count; i++) {
    const tier = tiers[Math.floor(Math.random() * tiers.length)];
    const discoveryChance = tier === "C" ? 3 : tier === "B" ? 2 : tier === "A" ? 1.5 : tier === "S" ? 0.8 : tier === "SS" ? 0.4 : tier === "SSS" ? 0.15 : 0.05;
    const groupSize = tier === "C" || tier === "B" ? 3 : tier === "A" || tier === "S" ? 5 : tier === "SS" ? 8 : tier === "SSS" ? 12 : 20;
    
    dungeons.push({
      id: `${biomeId}_group_${i}`,
      name: `Raid ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) + 1}`,
      biomeId,
      tier,
      type: "group",
      minLevel: 20 + Math.floor(i / 2) * 15,
      maxLevel: 300,
      description: `Uma raid perigosa em ${biomeId}. Requer ${groupSize} jogadores.`,
      discoveryChance,
      groupSize,
      icon: "🏰",
      color: DUNGEON_TIERS[tier].color,
    });
  }
  
  return dungeons;
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
    dungeons: [
      ...generateSoloDungeons("floresta", 30),
      ...generateGroupDungeons("floresta", 10),
    ],
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
    dungeons: [
      ...generateSoloDungeons("montanha", 30),
      ...generateGroupDungeons("montanha", 10),
    ],
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
    dungeons: [
      ...generateSoloDungeons("deserto", 30),
      ...generateGroupDungeons("deserto", 10),
    ],
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
    dungeons: [
      ...generateSoloDungeons("pantano", 30),
      ...generateGroupDungeons("pantano", 10),
    ],
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
    dungeons: [
      ...generateSoloDungeons("vulcao", 30),
      ...generateGroupDungeons("vulcao", 10),
    ],
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
    dungeons: [
      ...generateSoloDungeons("tundra", 30),
      ...generateGroupDungeons("tundra", 10),
    ],
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
    dungeons: [
      ...generateSoloDungeons("selva", 30),
      ...generateGroupDungeons("selva", 10),
    ],
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
    dungeons: [
      ...generateSoloDungeons("costa", 30),
      ...generateGroupDungeons("costa", 10),
    ],
  },
};

// Sistema da Torre
export interface TowerFloor {
  floor: number;
  name: string;
  type: "normal" | "miniboss" | "boss";
  minGroupSize: number;
  description: string;
  rewards: string[];
}

export const TOWER_NAME = "A Torre";
export const TOWER_FLOORS = 1000;

// Gerar os 1000 andares da Torre
export function generateTowerFloors(): TowerFloor[] {
  const floors: TowerFloor[] = [];
  
  for (let i = 1; i <= TOWER_FLOORS; i++) {
    let type: "normal" | "miniboss" | "boss" = "normal";
    let minGroupSize = 1;
    let name = `Andar ${i}`;
    let description = "Um andar comum da Torre.";
    
    // Boss a cada 20 andares
    if (i % 20 === 0) {
      type = "boss";
      if (i < 100) minGroupSize = 5;
      else if (i < 500) minGroupSize = 10;
      else if (i < 800) minGroupSize = 20;
      else minGroupSize = 30;
      
      if (i === 1000) {
        minGroupSize = 50;
        name = "ANDAR FINAL";
        description = "O ápice da Torre. Requer 50 heróis corajosos.";
      } else {
        name = `Boss ${i / 20}`;
        description = `Um poderoso boss guarda este andar. Requer ${minGroupSize} jogadores.`;
      }
    }
    // Mini-boss a cada 5 andares (que não são boss)
    else if (i % 5 === 0) {
      type = "miniboss";
      name = `Mini-Boss ${Math.floor(i / 5)}`;
      description = "Um mini-boss protege este andar. Pode ser derrotado solo ou em grupo.";
    }
    
    floors.push({
      floor: i,
      name,
      type,
      minGroupSize,
      description,
      rewards: [],
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
export function tryDiscoverDungeon(biomeId: BiomeId, dungeonsFound: string[]): DungeonDef | null {
  const biome = BIOMES[biomeId];
  const availableDungeons = biome.dungeons.filter(d => !dungeonsFound.includes(d.id));
  
  if (availableDungeons.length === 0) return null;
  
  // Tentar encontrar uma dungeon baseada na chance
  for (const dungeon of availableDungeons) {
    if (Math.random() * 100 < dungeon.discoveryChance) {
      return dungeon;
    }
  }
  
  return null;
}

// Sistema de Level Up - Progressão exponencial para 5 anos de jogo
// Nível máximo: 300
// Tempo estimado: ~5 anos de jogo casual
export function calculateExpNeeded(level: number): number {
  // Fórmula exponencial crescente
  // Nível 1: 100 XP
  // Nível 100: ~1 milhão XP
  // Nível 300: ~1 bilhão XP
  if (level >= 300) return Infinity;
  
  const base = 100;
  const multiplier = 1.08; // Crescimento de 8% por nível
  return Math.floor(base * Math.pow(multiplier, level - 1));
}

// Tempo estimado para upar (em horas de jogo ativo)
export function calculateTimeToLevel(level: number): number {
  const expNeeded = calculateExpNeeded(level);
  const expPerHour = 500 * Math.pow(1.02, level); // Aumenta gradualmente
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

// ~4.5 anos de jogo casual (2-3 horas por dia)
export const TOTAL_HOURS_TO_MAX = calculateTotalTimeToMax();
export const TOTAL_DAYS_TO_MAX = TOTAL_HOURS_TO_MAX / 2.5; // 2.5 horas por dia em média
