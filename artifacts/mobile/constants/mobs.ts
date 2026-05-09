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
  dropRate: number; // Chance de dropar item (0-1) - tiers altos = drops mais raros
}> = {
  "F": { statMult: 0.5, goldMult: 1, diamondMin: 0, diamondMax: 0, mithrilChance: 0, mithrilMax: 0, color: "#9ca3af", dropRate: 0.45 },   // 45% - comum
  "E": { statMult: 0.7, goldMult: 1.5, diamondMin: 0, diamondMax: 0, mithrilChance: 0, mithrilMax: 0, color: "#22c55e", dropRate: 0.40 },  // 40%
  "D": { statMult: 1, goldMult: 2.5, diamondMin: 0, diamondMax: 0, mithrilChance: 0, mithrilMax: 0, color: "#3b82f6", dropRate: 0.30 },    // 30%
  "C": { statMult: 1.4, goldMult: 4, diamondMin: 0, diamondMax: 0, mithrilChance: 0, mithrilMax: 0, color: "#a855f7", dropRate: 0.25 },    // 25%
  "B": { statMult: 2, goldMult: 7, diamondMin: 0, diamondMax: 0, mithrilChance: 0, mithrilMax: 0, color: "#f59e0b", dropRate: 0.20 },     // 20%
  "A": { statMult: 3, goldMult: 12, diamondMin: 1, diamondMax: 5, mithrilChance: 0, mithrilMax: 0, color: "#ef4444", dropRate: 0.10 },     // 10%
  "S": { statMult: 5, goldMult: 25, diamondMin: 10, diamondMax: 50, mithrilChance: 5, mithrilMax: 100, color: "#ec4899", dropRate: 0.05 }, // 5%
  "SS": { statMult: 8, goldMult: 60, diamondMin: 100, diamondMax: 500, mithrilChance: 15, mithrilMax: 1000, color: "#22d3ee", dropRate: 0.01 }, // 1%
  "SSS": { statMult: 15, goldMult: 200, diamondMin: 1000, diamondMax: 5000, mithrilChance: 35, mithrilMax: 5000, color: "#fbbf24", dropRate: 0.005 }, // 0.5%
  "SSS+": { statMult: 30, goldMult: 1000, diamondMin: 10000, diamondMax: 100000, mithrilChance: 50, mithrilMax: 10000, color: "#ffffff", dropRate: 0.0001 }, // 0.01%
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
export function generateMob(
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
// Nomes especiais para mobs da torre (andares 1-20+)
const TOWER_MOB_NAMES = {
  normal: [
    "Espectro", "Constructo", "Gárgula", "Homúnculo", "Familiar",
    "Servo", "Guarda", "Sentinela", "Vigia", "Patrulheiro",
    "Cristal Vivo", "Gosma", "Limo", "Vapor", "Névoa",
    "Sombra", "Eco", "Reflexo", "Eco Temporal", "Fragmento",
    "Ecos", "Remanescente", "Eco de Alma", "Eco de Magia", "Eco de Guerra",
  ],
  elite: [
    "Cavaleiro da Torre", "Mago do Andar", "Caçador de Almas", "Executor", "Inquisidor",
    "Paladino Corrompido", "Necromante", "Elementalista", "Invocador", "Dominador",
    "Senhor das Sombras", "Mestre das Ilusões", "Guardião de Cristal", "Guardião de Fogo", "Guardião de Gelo",
    "Arquimago", "Grão-Sacerdote", "Lorde Demoníaco", "Príncipe Celestial", "Avatar do Caos",
  ],
  boss: [
    "Guardião do Portal", "Sentinela Eterna", "Vigilante Ancião", "Protetor Primordial", "Defensor Lendário",
    "Mestre da Torre", "Arquiteto do Vazio", "Criador de Mundos", "Deus Menor", "Entidade Suprema",
  ],
};

// Skills especiais da torre
const TOWER_SKILLS: Record<string, MobSkill[]> = {
  guardian: [
    { name: "Golpe de Escudo", description: "Ataque com escudo", damageMultiplier: 1.2, cooldown: 0 },
    { name: "Provocar", description: "Aumenta defesa", damageMultiplier: 0, cooldown: 5, effect: "buff_def" },
    { name: "Golpe Poderoso", description: "Golpe devastador", damageMultiplier: 2.0, cooldown: 4 },
  ],
  mage: [
    { name: "Bola de Fogo", description: "Lança fogo", damageMultiplier: 1.5, cooldown: 2, element: "fogo" },
    { name: "Raio Gélido", description: "Gelo penetrante", damageMultiplier: 1.4, cooldown: 3, element: "gelo", effect: "slow" },
    { name: "Tempestade", description: "Ataque elétrico em área", damageMultiplier: 2.2, cooldown: 5, element: "trovao" },
  ],
  assassin: [
    { name: "Golpe Sombrio", description: "Ataque furtivo", damageMultiplier: 1.8, cooldown: 3, effect: "bleed" },
    { name: "Veneno Mortal", description: "Aplica veneno", damageMultiplier: 0.5, cooldown: 4, effect: "poison" },
    { name: "Execução", description: "Golpe final", damageMultiplier: 3.0, cooldown: 6 },
  ],
};

export function generateTowerMobs(floor: number): MobDef[] {
  const mobs: MobDef[] = [];
  const elements: ElementId[] = ["fogo", "agua", "terra", "ar", "gelo", "trovao", "arcano", "caos"];
  
  // Determinar rank baseado no andar (até andar 20)
  let rank: MobRank;
  if (floor <= 3) rank = "F";
  else if (floor <= 6) rank = "E";
  else if (floor <= 10) rank = "D";
  else if (floor <= 15) rank = "C";
  else rank = "B"; // Andares 16-20
  
  const level = floor * 2;
  
  // Quantidade de mobs baseada no andar (1-20 mobs)
  // Andar 1: 1-3 mobs, Andar 20: 15-20 mobs
  const minMobs = Math.min(20, Math.floor(floor * 0.8) + 1);
  const maxMobs = Math.min(20, Math.floor(floor * 1.2) + 3);
  const mobCount = Math.floor(Math.random() * (maxMobs - minMobs + 1)) + minMobs;
  
  // Gerar mobs normais
  for (let i = 0; i < mobCount; i++) {
    const name = TOWER_MOB_NAMES.normal[Math.floor(Math.random() * TOWER_MOB_NAMES.normal.length)];
    const element = elements[Math.floor(Math.random() * elements.length)];
    
    // A cada 5 mobs, adicionar um elite
    const isElite = i > 0 && i % 5 === 0;
    
    if (isElite) {
      const eliteRank: MobRank = floor <= 10 ? "D" : "C";
      const eliteName = TOWER_MOB_NAMES.elite[Math.floor(Math.random() * TOWER_MOB_NAMES.elite.length)];
      mobs.push(generateMob(
        `${eliteName} [Elite]`,
        eliteRank,
        "elite",
        level + 2,
        element,
        ["guardian", "mage", "assassin"][Math.floor(Math.random() * 3)],
        100
      ));
    } else {
      mobs.push(generateMob(
        `${name} do Andar ${floor}`,
        rank,
        "normal",
        level,
        element,
        ["lobo", "aranha", "elemental"][Math.floor(Math.random() * 3)],
        100
      ));
    }
  }
  
  // Boss sempre no final (se andar for múltiplo de 5)
  if (floor % 5 === 0) {
    const bossRank: MobRank = floor === 5 ? "D" : floor === 10 ? "C" : floor === 15 ? "B" : "A";
    const element = elements[Math.floor(Math.random() * elements.length)];
    
    mobs.push(generateMob(
      `${TOWER_MOB_NAMES.boss[(floor / 5) - 1]} [BOSS]`,
      bossRank,
      "boss",
      level + 10,
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

// Calcular drops de moedas
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

// ============================================
// SISTEMA DE DROP DE EQUIPAMENTOS PROFISSIONAL
// ============================================

// Tiers de equipamentos possíveis por rank do mob
const DROP_TIERS_BY_MOB_RANK: Record<MobRank, { normal: string[]; boss: string[] }> = {
  "F": { normal: ["F", "E"], boss: ["F", "E", "D"] },
  "E": { normal: ["E", "D"], boss: ["E", "D", "C"] },
  "D": { normal: ["D", "C"], boss: ["D", "C", "B"] },
  "C": { normal: ["C", "B"], boss: ["C", "B", "A"] },
  "B": { normal: ["B", "A"], boss: ["B", "A", "S"] },
  "A": { normal: ["E", "D", "C", "B", "A", "S"], boss: ["D", "C", "B", "A", "S", "SS"] },
  "S": { normal: ["E", "D", "C", "B", "A", "S", "SS"], boss: ["E", "D", "C", "B", "A", "S", "SS"] },
  "SS": { normal: ["C", "B", "A", "S", "SS", "SSS"], boss: ["C", "B", "A", "S", "SS", "SSS"] },
  "SSS": { normal: ["B", "A", "S", "SS", "SSS", "SSS+"], boss: ["B", "A", "S", "SS", "SSS", "SSS+"] },
  "SSS+": { normal: ["A", "S", "SS", "SSS", "SSS+"], boss: ["A", "S", "SS", "SSS", "SSS+"] },
};

// Taxas de drop base por tier de equipamento
const BASE_DROP_RATES: Record<string, number> = {
  "F": 0.45,    // 45%
  "E": 0.40,    // 40%
  "D": 0.30,    // 30%
  "C": 0.25,    // 25%
  "B": 0.20,    // 20%
  "A": 0.10,    // 10%
  "S": 0.05,    // 5%
  "SS": 0.01,   // 1%
  "SSS": 0.005, // 0.5%
  "SSS+": 0.0001, // 0.01%
};

// Multiplicadores de drop para bosses (aumentam chance do tier do mob)
const BOSS_DROP_MULTIPLIERS: Record<MobRank, Record<string, number>> = {
  "F": { "F": 1.0, "E": 0.88, "D": 0.66 },
  "E": { "E": 1.0, "D": 0.75, "C": 0.62 },
  "D": { "D": 1.5, "C": 1.16, "B": 1.0 },  // Boss D: D=45%, C=35%, B=30%
  "C": { "C": 1.5, "B": 1.2, "A": 1.0 },
  "B": { "B": 1.5, "A": 1.25, "S": 1.0 },
  "A": { "A": 1.5, "S": 1.5, "SS": 1.0 },
  "S": { "S": 1.5, "SS": 1.5 },
  "SS": { "SS": 1.5, "SSS": 1.5 },
  "SSS": { "SSS": 1.5, "SSS+": 1.5 },
  "SSS+": { "SSS+": 2.0 },
};

// Qualidades possíveis por tier de equipamento
const QUALITIES_BY_TIER: Record<string, string[]> = {
  "F": ["common", "uncommon"],
  "E": ["common", "uncommon", "rare"],
  "D": ["uncommon", "rare", "epic"],
  "C": ["rare", "epic"],
  "B": ["rare", "epic", "legendary"],
  "A": ["epic", "legendary"],
  "S": ["epic", "legendary", "mythic"],
  "SS": ["legendary", "mythic"],
  "SSS": ["legendary", "mythic", "divine"],
  "SSS+": ["mythic", "divine"],
};

// Peso das qualidades para cálculo de probabilidade
const QUALITY_WEIGHTS: Record<string, number> = {
  "common": 50,
  "uncommon": 30,
  "rare": 15,
  "epic": 4,
  "legendary": 0.9,
  "mythic": 0.09,
  "divine": 0.01,
};

/**
 * Sistema de drop de equipamentos profissional
 * @param mobRank Rank do mob derrotado
 * @param mobType Tipo do mob (normal, elite, boss)
 * @param playerLevel Nível do jogador
 * @returns Objeto com tier e qualidade do equipamento, ou null se não dropou
 */
export function rollEquipmentDrop(
  mobRank: MobRank, 
  mobType: MobType, 
  playerLevel: number
): { tier: string; quality: string; dropped: boolean } | null {
  
  const isBoss = mobType === "boss" || mobType === "unique";
  const possibleTiers = DROP_TIERS_BY_MOB_RANK[mobRank][isBoss ? "boss" : "normal"];
  
  // Calcular chance de drop base (se vai dropar algum item)
  const baseDropChance = isBoss ? 0.70 : 0.45; // 70% para boss, 45% para normal
  
  if (Math.random() > baseDropChance) {
    return null; // Não dropou nada
  }
  
  // Calcular probabilidades para cada tier possível
  const tierProbabilities: { tier: string; probability: number }[] = [];
  let totalProbability = 0;
  
  for (const tier of possibleTiers) {
    let probability = BASE_DROP_RATES[tier] || 0.05;
    
    // Aplicar multiplicador de boss se for boss
    if (isBoss && BOSS_DROP_MULTIPLIERS[mobRank]?.[tier]) {
      probability *= BOSS_DROP_MULTIPLIERS[mobRank][tier];
    }
    
    // Penalidade se o tier for muito acima do nível do jogador
    const tierLevelReq = getTierLevelRequirement(tier);
    if (playerLevel < tierLevelReq) {
      probability *= 0.1; // 90% de redução se não atender requisito de nível
    }
    
    tierProbabilities.push({ tier, probability });
    totalProbability += probability;
  }
  
  // Normalizar probabilidades
  for (const tp of tierProbabilities) {
    tp.probability /= totalProbability;
  }
  
  // Rolar o tier
  const roll = Math.random();
  let cumulative = 0;
  let selectedTier = possibleTiers[0];
  
  for (const tp of tierProbabilities) {
    cumulative += tp.probability;
    if (roll <= cumulative) {
      selectedTier = tp.tier;
      break;
    }
  }
  
  // Rolar a qualidade baseada no tier
  const possibleQualities = QUALITIES_BY_TIER[selectedTier] || ["common"];
  const qualityWeights = possibleQualities.map(q => QUALITY_WEIGHTS[q] || 1);
  const totalWeight = qualityWeights.reduce((a, b) => a + b, 0);
  
  let qualityRoll = Math.random() * totalWeight;
  let selectedQuality = possibleQualities[0];
  
  for (let i = 0; i < possibleQualities.length; i++) {
    qualityRoll -= qualityWeights[i];
    if (qualityRoll <= 0) {
      selectedQuality = possibleQualities[i];
      break;
    }
  }
  
  return { tier: selectedTier, quality: selectedQuality, dropped: true };
}

/**
 * Retorna o nível mínimo recomendado para equipamentos de determinado tier
 */
function getTierLevelRequirement(tier: string): number {
  const requirements: Record<string, number> = {
    "F": 1,
    "E": 5,
    "D": 15,
    "C": 30,
    "B": 50,
    "A": 75,
    "S": 100,
    "SS": 150,
    "SSS": 200,
    "SSS+": 250,
  };
  return requirements[tier] || 1;
}

/**
 * Informações sobre o sistema de drop para exibição ao jogador
 */
export function getDropInfo(mobRank: MobRank, mobType: MobType): string {
  const isBoss = mobType === "boss" || mobType === "unique";
  const tiers = DROP_TIERS_BY_MOB_RANK[mobRank][isBoss ? "boss" : "normal"];
  
  if (isBoss) {
    return `👑 Boss: Pode dropar tier ${tiers.join(", ")}`;
  } else {
    return `👤 Normal: Pode dropar tier ${tiers.join(", ")}`;
  }
}
