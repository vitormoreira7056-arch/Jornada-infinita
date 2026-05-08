// Sistema de Mobs - Inimigos do jogo

import { ElementId } from "./elements";
import { DungeonTier } from "./adventure";

export type MobRank = "F" | "E" | "D" | "C" | "B" | "A" | "S" | "SS" | "SSS" | "SSS+";
export type MobType = "normal" | "elite" | "boss" | "unique";

export interface MobSkill {
  name: string;
  description: string;
  damageMultiplier: number;
  cooldown: number;
  element?: ElementId;
  effect?: string;
}

export interface MobDef {
  id: string;
  name: string;
  rank: MobRank;
  type: MobType;
  level: number;
  biomeId?: string;
  dungeonTier?: DungeonTier;
  // Stats
  hp: number;
  atkF: number;
  atkM: number;
  def: number;
  armor: number;
  magicRes: number;
  critRate: number;
  critDmg: number;
  atkSpeed: number;
  dodge: number;
  // Element
  element: ElementId;
  // Skills
  skills: MobSkill[];
  // Drops
  dropGold: number;
  dropDiamonds: number;
  dropMithrilChance: number;
  dropMithrilMax: number;
  // Encounter
  encounterRate: number; // Chance de encontrar (%)
  isDailyBoss?: boolean; // Chefe único 1x por dia
  dailyBossCooldown?: number; // Timestamp do último derrotado
}

// Multiplicadores por rank
export const MOB_RANK_MULTIPLIERS: Record<MobRank, { 
  statMult: number; 
  goldMult: number; 
  diamondMin: number;
  diamondMax: number;
  mithrilChance: number;
  mithrilMax: number;
  color: string;
}> = {
  "F": { statMult: 0.5, goldMult: 1, diamondMin: 0, diamondMax: 0, mithrilChance: 0, mithrilMax: 0, color: "#9ca3af" },
  "E": { statMult: 0.7, goldMult: 1.5, diamondMin: 0, diamondMax: 0, mithrilChance: 0, mithrilMax: 0, color: "#22c55e" },
  "D": { statMult: 1, goldMult: 2.5, diamondMin: 0, diamondMax: 0, mithrilChance: 0, mithrilMax: 0, color: "#3b82f6" },
  "C": { statMult: 1.4, goldMult: 4, diamondMin: 0, diamondMax: 0, mithrilChance: 0, mithrilMax: 0, color: "#a855f7" },
  "B": { statMult: 2, goldMult: 7, diamondMin: 0, diamondMax: 0, mithrilChance: 0, mithrilMax: 0, color: "#f59e0b" },
  "A": { statMult: 3, goldMult: 12, diamondMin: 1, diamondMax: 5, mithrilChance: 0, mithrilMax: 0, color: "#ef4444" },
  "S": { statMult: 5, goldMult: 25, diamondMin: 10, diamondMax: 50, mithrilChance: 5, mithrilMax: 100, color: "#ec4899" },
  "SS": { statMult: 8, goldMult: 60, diamondMin: 100, diamondMax: 500, mithrilChance: 15, mithrilMax: 1000, color: "#22d3ee" },
  "SSS": { statMult: 15, goldMult: 200, diamondMin: 1000, diamondMax: 5000, mithrilChance: 35, mithrilMax: 5000, color: "#fbbf24" },
  "SSS+": { statMult: 30, goldMult: 1000, diamondMin: 10000, diamondMax: 100000, mithrilChance: 50, mithrilMax: 10000, color: "#ffffff" },
};

// Nomes de mobs por bioma (Floresta Encantada - níveis 1-100)
const FOREST_MOB_NAMES = {
  normal: [
    "Lobo Selvagem", "Aranha Gigante", "Goblin Florestal", "Mosca Carnívora", "Cobra Venenosa",
    "Javali Furioso", "Morcego das Cavernas", "Rato Mutante", "Besouro de Aço", "Sapo Ácido",
    "Centopeia Venenosa", "Escorpião das Sombras", "Corvo Maldito", "Guaxinim Ladrão", "Fada Corrompida",
    "Píxie Maliciosa", "Bicho-Pau", "Lesma Gigante", "Caracol de Cristal", "Grilo Saltador",
    "Libélula Elétrica", "Borboleta Tóxica", "Formiga Operária", "Formiga Soldado", "Vespa Assassina",
    "Abelha Defensora", "Louva-a-Deus", "Besouro-Rinoceronte", "Gafanhoto Saltador", "Cigarra Cantora",
    "Barata das Profundezas", "Larva de Mariposa", "Casulo Explosivo", "Minhoca da Terra", "Carrapato Gigante",
    "Pulga Demoníaca", "Piolho de Dragão", "Ácaro da Mancha", "Toupeira Cega", "Esquilo Raivoso",
    "Coelho Carnívoro", "Ouriço Espinhoso", "Texugo Furioso", "Doninha Venenosa", "Raposa Astuta",
    "Corça Maluca", "Cervo Corrompido", "Alce Enraivecido", "Urso Pequeno", "Lince Sombrio",
  ],
  elite: [
    "Lobo Alfa", "Aranha Rainha", "Goblin Chefe", "Serpe Anciã", "Javali Rei",
    "Morcego Vampiro", "Rato Rei", "Besouro de Rubi", "Sapo do Pântano", "Centopeia Mortal",
    "Escorpião Imperador", "Corvo do Caos", "Fada Sombria", "Píxie das Trevas", "Bicho-Pau Gigante",
    "Lesma Corrosiva", "Caracol de Ouro", "Grilo da Noite", "Libélula de Gelo", "Borboleta Sombria",
    "Formiga Rainha", "Vespa Rainha", "Abelha Monarca", "Louva-a-Deus Real", "Besouro de Esmeralda",
    "Gafanhoto Devastador", "Barata Mãe", "Minhoca Anciã", "Toupeira Rei", "Esquilo Rei",
    "Coelho da Lua", "Ouriço de Cristal", "Texugo de Guerra", "Doninha Sombria", "Raposa de Nove Caudas",
    "Corça da Aurora", "Cervo de Ouro", "Alce da Montanha", "Urso Pardo", "Lince Estelar",
  ],
  boss: [
    "Lobisomem da Floresta", "Aracnídea Colossal", "Rei Goblin", "Hidra das Sombras", "Javali de Titânio",
    "Morcego Príncipe das Trevas", "Ratão Mutante", "Besouro Ancião", "Sapo Imperador", "Centopeia Colossal",
    "Escorpião Lendário", "Corvo Harbinger", "Fada Corrupta", "Píxie Rainha", "Bicho-Pau Ancião",
    "Lesma Mãe", "Caracol de Diamante", "Grilo Imperial", "Libélula Tempestade", "Borboleta da Morte",
    "Formiga Imperatriz", "Vespa Destruidora", "Abelha Suprema", "Louva-a-Deus Divino", "Besouro de Safira",
    "Gafanhoto Cataclismo", "Barata Anciã", "Minhoca do Abismo", "Toupeira Titã", "Esquilo Dourado",
    "Coelho da Morte", "Ouriço de Rubi", "Texugo Lendário", "Doninha Mortal", "Raposa Celestial",
    "Corça Divina", "Cervo Ancião", "Alce Colossal", "Urso da Montanha", "Lince da Lua",
  ],
  unique: [
    "Garra de Prata", "Teia de Ébano", "Goblinoide Supremo", "Serpente do Éden", "Javali de Ouro",
    "Noctis o Vampiro", "Rattus o Rei", "Besouro Sol", "Sapo do Caos", "Centopeia do Apocalipse",
    "Escorpião do Fim", "Corvo da Morte", "Fada Maldita", "Píxie Sombria", "Bicho-Pau Eterno",
    "Lesma do Abismo", "Caracol do Tempo", "Grilo da Imortalidade", "Libélula Divina", "Borboleta do Caos",
    "Formiga de Cristal", "Vespa do Inferno", "Abelha da Criação", "Louva-a-Deus Supremo", "Besouro de Ametista",
    "Gafanhoto do Juízo", "Barata Imortal", "Minhoca do Vazio", "Toupeira do Submundo", "Esquilo Estelar",
    "Coelho da Sorte", "Ouriço de Diamante", "Texugo de Titânio", "Doninha do Caos", "Raposa de Ouro",
    "Corça da Vida", "Cervo da Floresta", "Alce do Norte", "Urso Pai", "Lince do Amanhecer",
  ],
};

// Skills de mobs
const MOB_SKILLS: Record<string, MobSkill[]> = {
  lobo: [
    { name: "Mordida", description: "Mordida feroz", damageMultiplier: 1, cooldown: 0 },
    { name: "Garra", description: "Ataque com garras", damageMultiplier: 1.3, cooldown: 2 },
    { name: "Uivo", description: "Uivo que aumenta o ataque", damageMultiplier: 0, cooldown: 5, effect: "buff_atk" },
  ],
  aranha: [
    { name: "Mordida Venenosa", description: "Mordida com veneno", damageMultiplier: 1, cooldown: 0 },
    { name: "Teia", description: "Imobiliza o alvo", damageMultiplier: 0.5, cooldown: 3, effect: "stun" },
    { name: "Veneno", description: "Causa dano ao longo do tempo", damageMultiplier: 0.3, cooldown: 4, effect: "poison" },
  ],
  goblin: [
    { name: "Facada", description: "Ataque com faca", damageMultiplier: 1, cooldown: 0 },
    { name: "Roubar", description: "Rouba ouro", damageMultiplier: 0.8, cooldown: 3, effect: "steal_gold" },
    { name: "Fugir", description: "Tenta fugir", damageMultiplier: 0, cooldown: 5, effect: "flee" },
  ],
  elemental: [
    { name: "Bola de Fogo", description: "Lança uma bola de fogo", damageMultiplier: 1.5, cooldown: 3, element: "fogo" },
    { name: "Gelo", description: "Congela o alvo", damageMultiplier: 1.2, cooldown: 3, element: "gelo", effect: "slow" },
    { name: "Raio", description: "Ataque elétrico", damageMultiplier: 1.8, cooldown: 4, element: "trovao" },
  ],
  boss: [
    { name: "Golpe Devastador", description: "Golpe poderoso", damageMultiplier: 2, cooldown: 3 },
    { name: "Rugido", description: "Intimida o inimigo", damageMultiplier: 0, cooldown: 5, effect: "fear" },
    { name: "Regeneração", description: "Recupera HP", damageMultiplier: 0, cooldown: 6, effect: "heal" },
    { name: "Fúria", description: "Aumenta drasticamente o ataque", damageMultiplier: 0, cooldown: 8, effect: "rage" },
  ],
};

// Gerar mob base
function generateMob(
  name: string,
  rank: MobRank,
  type: MobType,
  level: number,
  element: ElementId,
  skillSet: string,
  encounterRate: number,
  isDailyBoss?: boolean
): MobDef {
  const mult = MOB_RANK_MULTIPLIERS[rank];
  const baseStat = 10 + level * 2;
  
  // Calcular drops
  const baseGold = 5 * level * mult.goldMult;
  
  return {
    id: `mob_${name.toLowerCase().replace(/\s+/g, '_')}_${rank}_${level}`,
    name: `${name} [${rank}]`,
    rank,
    type,
    level,
    hp: Math.floor(baseStat * 8 * mult.statMult * (type === "elite" ? 1.5 : type === "boss" ? 3 : type === "unique" ? 5 : 1)),
    atkF: Math.floor(baseStat * mult.statMult * (type === "elite" ? 1.3 : type === "boss" ? 2 : type === "unique" ? 3 : 1)),
    atkM: Math.floor(baseStat * 0.5 * mult.statMult * (type === "elite" ? 1.3 : type === "boss" ? 2 : type === "unique" ? 3 : 1)),
    def: Math.floor(baseStat * 0.3 * mult.statMult),
    armor: Math.floor(level * 0.5 * mult.statMult),
    magicRes: Math.floor(level * 0.3 * mult.statMult),
    critRate: 0.05 + (mult.statMult * 0.01),
    critDmg: 1.5 + (mult.statMult * 0.1),
    atkSpeed: 1 + (mult.statMult * 0.05),
    dodge: 0.02 + (mult.statMult * 0.005),
    element,
    skills: MOB_SKILLS[skillSet] || MOB_SKILLS.lobo,
    dropGold: Math.floor(baseGold),
    dropDiamonds: Math.floor(mult.diamondMin + Math.random() * (mult.diamondMax - mult.diamondMin)),
    dropMithrilChance: mult.mithrilChance,
    dropMithrilMax: mult.mithrilMax,
    encounterRate,
    isDailyBoss,
  };
}

// Gerar todos os mobs da Floresta Encantada (níveis 1-100)
export function generateForestMobs(): MobDef[] {
  const mobs: MobDef[] = [];
  const elements: ElementId[] = ["natureza", "terra", "veneno", "escuridao", "ar"];
  
  // Mobs normais níveis 1-30 (Rank F-E)
  for (let level = 1; level <= 30; level++) {
    const rank: MobRank = level <= 10 ? "F" : level <= 20 ? "E" : "D";
    const names = FOREST_MOB_NAMES.normal;
    const name = names[Math.floor(Math.random() * names.length)];
    const element = elements[Math.floor(Math.random() * elements.length)];
    
    mobs.push(generateMob(
      name,
      rank,
      "normal",
      level,
      element,
      ["lobo", "aranha", "goblin"][Math.floor(Math.random() * 3)],
      15 - (level * 0.3) // Taxa diminui conforme avança
    ));
  }
  
  // Mobs normais níveis 31-60 (Rank D-C)
  for (let level = 31; level <= 60; level++) {
    const rank: MobRank = level <= 45 ? "D" : "C";
    const names = FOREST_MOB_NAMES.normal;
    const name = names[Math.floor(Math.random() * names.length)];
    const element = elements[Math.floor(Math.random() * elements.length)];
    
    mobs.push(generateMob(
      name,
      rank,
      "normal",
      level,
      element,
      ["lobo", "aranha", "goblin", "elemental"][Math.floor(Math.random() * 4)],
      12 - ((level - 30) * 0.2)
    ));
  }
  
  // Mobs normais níveis 61-100 (Rank C-B)
  for (let level = 61; level <= 100; level++) {
    const rank: MobRank = level <= 80 ? "C" : "B";
    const names = FOREST_MOB_NAMES.normal;
    const name = names[Math.floor(Math.random() * names.length)];
    const element = elements[Math.floor(Math.random() * elements.length)];
    
    mobs.push(generateMob(
      name,
      rank,
      "normal",
      level,
      element,
      ["aranha", "goblin", "elemental"][Math.floor(Math.random() * 3)],
      10 - ((level - 60) * 0.15)
    ));
  }
  
  // Elites níveis 10-100
  for (let level = 10; level <= 100; level += 5) {
    const rank: MobRank = level <= 30 ? "D" : level <= 50 ? "C" : level <= 75 ? "B" : "A";
    const names = FOREST_MOB_NAMES.elite;
    const name = names[Math.floor(Math.random() * names.length)];
    const element = elements[Math.floor(Math.random() * elements.length)];
    
    mobs.push(generateMob(
      name,
      rank,
      "elite",
      level,
      element,
      ["lobo", "aranha", "elemental"][Math.floor(Math.random() * 3)],
      5
    ));
  }
  
  // Bosses de área (encontrados em pontos específicos)
  for (let level = 25; level <= 100; level += 25) {
    const rank: MobRank = level <= 50 ? "B" : level <= 75 ? "A" : "S";
    const names = FOREST_MOB_NAMES.boss;
    const name = names[Math.floor(Math.random() * names.length)];
    const element = elements[Math.floor(Math.random() * elements.length)];
    
    mobs.push(generateMob(
      name,
      rank,
      "boss",
      level,
      element,
      "boss",
      2
    ));
  }
  
  // Bosses únicos diários (1x por dia)
  const dailyBosses = [
    { name: "Guardião da Floresta", level: 50, rank: "A" as MobRank },
    { name: "Ancião Ent", level: 75, rank: "S" as MobRank },
    { name: "Dragão Verde Jovem", level: 100, rank: "SS" as MobRank },
  ];
  
  dailyBosses.forEach(boss => {
    const element = elements[Math.floor(Math.random() * elements.length)];
    mobs.push(generateMob(
      boss.name,
      boss.rank,
      "unique",
      boss.level,
      element,
      "boss",
      0.5, // Muito raro
      true // Daily boss
    ));
  });
  
  return mobs;
}

// Mobs para dungeons da Floresta (escalados pelo tier)
export function generateDungeonMobs(tier: DungeonTier, dungeonLevel: number): MobDef[] {
  const mobs: MobDef[] = [];
  const elements: ElementId[] = ["natureza", "terra", "veneno", "escuridao", "ar"];
  
  const tierMult = { "F": 1, "E": 1.3, "D": 1.7, "C": 2.2, "B": 2.8, "A": 3.5, "S": 4.5, "SS": 6, "SSS": 8, "SSS+": 12 };
  const mult = tierMult[tier];
  
  // Mobs normais da dungeon
  for (let i = 0; i < 5; i++) {
    const level = Math.max(1, dungeonLevel + Math.floor(Math.random() * 10) - 5);
    const name = FOREST_MOB_NAMES.normal[Math.floor(Math.random() * FOREST_MOB_NAMES.normal.length)];
    const element = elements[Math.floor(Math.random() * elements.length)];
    
    mobs.push(generateMob(
      name,
      tier,
      "normal",
      level,
      element,
      ["lobo", "aranha", "goblin", "elemental"][Math.floor(Math.random() * 4)],
      100 // Sempre encontrado na dungeon
    ));
  }
  
  // Elite
  mobs.push(generateMob(
    FOREST_MOB_NAMES.elite[Math.floor(Math.random() * FOREST_MOB_NAMES.elite.length)],
    tier,
    "elite",
    dungeonLevel + 5,
    elements[Math.floor(Math.random() * elements.length)],
    "elemental",
    100
  ));
  
  // Boss da dungeon
  if (tier >= "C") {
    mobs.push(generateMob(
      FOREST_MOB_NAMES.boss[Math.floor(Math.random() * FOREST_MOB_NAMES.boss.length)],
      tier,
      "boss",
      dungeonLevel + 10,
      elements[Math.floor(Math.random() * elements.length)],
      "boss",
      100
    ));
  }
  
  return mobs;
}

// Mobs para a Torre (andares 1-10)
export function generateTowerMobs(floor: number): MobDef[] {
  const mobs: MobDef[] = [];
  const elements: ElementId[] = ["fogo", "agua", "terra", "ar", "gelo", "trovao"];
  
  // Determinar rank baseado no andar
  const rank: MobRank = floor <= 3 ? "F" : floor <= 6 ? "E" : floor <= 9 ? "D" : "C";
  const level = floor * 2;
  
  // Mobs normais
  const normalCount = floor <= 5 ? 2 : 3;
  for (let i = 0; i < normalCount; i++) {
    const name = FOREST_MOB_NAMES.normal[Math.floor(Math.random() * FOREST_MOB_NAMES.normal.length)];
    const element = elements[Math.floor(Math.random() * elements.length)];
    
    mobs.push(generateMob(
      `Torre ${name}`,
      rank,
      "normal",
      level,
      element,
      ["lobo", "aranha", "elemental"][Math.floor(Math.random() * 3)],
      100
    ));
  }
  
  // Mini-boss a cada 5 andares
  if (floor % 5 === 0) {
    const element = elements[Math.floor(Math.random() * elements.length)];
    mobs.push(generateMob(
      `Guardião do Andar ${floor}`,
      floor === 10 ? "C" : "D",
      "boss",
      level + 5,
      element,
      "boss",
      100
    ));
  }
  
  return mobs;
}

// Todos os mobs da floresta
export const FOREST_MOBS = generateForestMobs();

// Encontrar mob aleatório para encontro
export function findRandomMob(playerLevel: number, biomeMobs: MobDef[]): MobDef | null {
  // Filtrar mobs adequados ao nível do jogador (+- 5 níveis)
  const suitableMobs = biomeMobs.filter(m => 
    m.level >= playerLevel - 5 && 
    m.level <= playerLevel + 5 &&
    !m.isDailyBoss
  );
  
  if (suitableMobs.length === 0) return null;
  
  // Rolar baseado na taxa de encontro
  const totalWeight = suitableMobs.reduce((sum, m) => sum + m.encounterRate, 0);
  let random = Math.random() * totalWeight;
  
  for (const mob of suitableMobs) {
    random -= mob.encounterRate;
    if (random <= 0) return mob;
  }
  
  return suitableMobs[0];
}

// Calcular drops
export function calculateDrops(mob: MobDef): { gold: number; diamonds: number; mithril: number } {
  const rankMult = MOB_RANK_MULTIPLIERS[mob.rank];
  
  let gold = mob.dropGold;
  let diamonds = 0;
  let mithril = 0;
  
  // Rank S+ sempre dropa diamantes
  if (["S", "SS", "SSS", "SSS+"].includes(mob.rank)) {
    diamonds = mob.dropDiamonds;
  }
  
  // Chance de mithril
  if (Math.random() * 100 < rankMult.mithrilChance) {
    mithril = Math.floor(Math.random() * rankMult.mithrilMax);
  }
  
  return { gold, diamonds, mithril };
}
