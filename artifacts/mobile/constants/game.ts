export type ClassId = "warrior" | "mage" | "archer";
export type EquipSlot = "weapon" | "armor" | "ring";
export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface ClassDef {
  id: ClassId;
  name: string;
  description: string;
  color: string;
  featherIcon: string;
  baseHp: number;
  baseAtk: number;
  baseDef: number;
  baseCritRate: number;
  baseCritDmg: number;
  hpPerLevel: number;
  atkPerLevel: number;
  defPerLevel: number;
}

export interface MonsterDef {
  id: string;
  name: string;
  baseHp: number;
  baseAtk: number;
  baseDef: number;
  expReward: number;
  goldReward: number;
}

export interface ZoneDef {
  id: number;
  name: string;
  description: string;
  color: string;
  bossName: string;
  bossHp: number;
  bossAtk: number;
  bossDef: number;
  monsters: MonsterDef[];
}

export interface PassiveSkillDef {
  id: string;
  name: string;
  description: string;
  featherIcon: string;
  maxLevel: number;
  baseCost: number;
  costMultiplier: number;
  stat: "atk" | "hp" | "def" | "crit" | "gold";
  bonusPerLevel: number;
}

export interface ActiveSkillDef {
  id: string;
  name: string;
  description: string;
  featherIcon: string;
  cooldown: number;
  effect: "power_strike" | "battle_cry";
}

export interface EquipmentBase {
  id: string;
  name: string;
  slot: EquipSlot;
  atkBonus: number;
  hpBonus: number;
  defBonus: number;
  critBonus: number;
  goldValue: number;
}

export const CLASSES: ClassDef[] = [
  {
    id: "warrior",
    name: "Warrior",
    description: "Iron body and unbreakable will. Survives anything.",
    color: "#E84560",
    featherIcon: "shield",
    baseHp: 260,
    baseAtk: 22,
    baseDef: 18,
    baseCritRate: 0.05,
    baseCritDmg: 1.5,
    hpPerLevel: 36,
    atkPerLevel: 2.5,
    defPerLevel: 2.5,
  },
  {
    id: "mage",
    name: "Mage",
    description: "Arcane power beyond imagination. Fragile but devastating.",
    color: "#8844FF",
    featherIcon: "zap",
    baseHp: 120,
    baseAtk: 50,
    baseDef: 5,
    baseCritRate: 0.1,
    baseCritDmg: 2.2,
    hpPerLevel: 14,
    atkPerLevel: 6.5,
    defPerLevel: 0.8,
  },
  {
    id: "archer",
    name: "Archer",
    description: "Swift and precise. Critical strikes devastate enemies.",
    color: "#44CC88",
    featherIcon: "crosshair",
    baseHp: 175,
    baseAtk: 36,
    baseDef: 10,
    baseCritRate: 0.18,
    baseCritDmg: 1.9,
    hpPerLevel: 22,
    atkPerLevel: 4,
    defPerLevel: 1.5,
  },
];

export const ZONES: ZoneDef[] = [
  {
    id: 1,
    name: "Darkwood Forest",
    description: "Ancient trees hide deadly creatures lurking in shadow.",
    color: "#2E7D32",
    bossName: "Forest Warden",
    bossHp: 800,
    bossAtk: 50,
    bossDef: 20,
    monsters: [
      { id: "slime", name: "Slime", baseHp: 40, baseAtk: 8, baseDef: 2, expReward: 12, goldReward: 8 },
      { id: "spider", name: "Giant Spider", baseHp: 58, baseAtk: 12, baseDef: 3, expReward: 16, goldReward: 12 },
      { id: "wolf", name: "Dire Wolf", baseHp: 72, baseAtk: 15, baseDef: 4, expReward: 20, goldReward: 15 },
      { id: "goblin", name: "Goblin Scout", baseHp: 62, baseAtk: 14, baseDef: 5, expReward: 18, goldReward: 14 },
    ],
  },
  {
    id: 2,
    name: "Crystal Caves",
    description: "Underground labyrinth glimmering with dangerous crystals.",
    color: "#1565C0",
    bossName: "Cave Overlord",
    bossHp: 3000,
    bossAtk: 150,
    bossDef: 60,
    monsters: [
      { id: "bat", name: "Giant Bat", baseHp: 130, baseAtk: 28, baseDef: 8, expReward: 40, goldReward: 28 },
      { id: "golem", name: "Rock Golem", baseHp: 190, baseAtk: 22, baseDef: 18, expReward: 50, goldReward: 32 },
      { id: "skeleton", name: "Skeleton Archer", baseHp: 110, baseAtk: 34, baseDef: 6, expReward: 38, goldReward: 26 },
      { id: "troll", name: "Cave Troll", baseHp: 210, baseAtk: 26, baseDef: 15, expReward: 55, goldReward: 38 },
    ],
  },
  {
    id: 3,
    name: "Cursed Castle",
    description: "A once-grand fortress now ruled by undying darkness.",
    color: "#6A1B9A",
    bossName: "Castle Tyrant",
    bossHp: 10000,
    bossAtk: 380,
    bossDef: 140,
    monsters: [
      { id: "guard", name: "Undead Guard", baseHp: 300, baseAtk: 58, baseDef: 26, expReward: 100, goldReward: 70 },
      { id: "knight", name: "Dark Knight", baseHp: 380, baseAtk: 65, baseDef: 36, expReward: 125, goldReward: 88 },
      { id: "gargoyle", name: "Gargoyle", baseHp: 320, baseAtk: 72, baseDef: 22, expReward: 112, goldReward: 80 },
      { id: "necromancer", name: "Necromancer", baseHp: 270, baseAtk: 85, baseDef: 14, expReward: 118, goldReward: 84 },
    ],
  },
  {
    id: 4,
    name: "Void Realm",
    description: "Where reality shatters and nightmares made flesh roam free.",
    color: "#880E4F",
    bossName: "Void Titan",
    bossHp: 35000,
    bossAtk: 900,
    bossDef: 320,
    monsters: [
      { id: "wisp", name: "Void Wisp", baseHp: 650, baseAtk: 130, baseDef: 48, expReward: 260, goldReward: 190 },
      { id: "phantom", name: "Shadow Phantom", baseHp: 760, baseAtk: 150, baseDef: 40, expReward: 290, goldReward: 210 },
      { id: "chaos", name: "Chaos Beast", baseHp: 900, baseAtk: 140, baseDef: 58, expReward: 310, goldReward: 230 },
      { id: "abyss_c", name: "Abyss Crawler", baseHp: 820, baseAtk: 160, baseDef: 45, expReward: 300, goldReward: 220 },
    ],
  },
  {
    id: 5,
    name: "Abyssal Depths",
    description: "The deepest darkness. Only legends dare tread here.",
    color: "#B71C1C",
    bossName: "Abyssal Sovereign",
    bossHp: 120000,
    bossAtk: 2500,
    bossDef: 800,
    monsters: [
      { id: "demon", name: "Abyss Demon", baseHp: 1600, baseAtk: 320, baseDef: 110, expReward: 650, goldReward: 480 },
      { id: "fallen", name: "Fallen Angel", baseHp: 1900, baseAtk: 370, baseDef: 85, expReward: 750, goldReward: 560 },
      { id: "deathknight", name: "Death Knight", baseHp: 2100, baseAtk: 300, baseDef: 140, expReward: 800, goldReward: 600 },
      { id: "chaos_t", name: "Chaos Titan", baseHp: 2300, baseAtk: 340, baseDef: 120, expReward: 850, goldReward: 640 },
    ],
  },
];

export const PASSIVE_SKILLS: PassiveSkillDef[] = [
  {
    id: "power",
    name: "Power Training",
    description: "+{val}% ATK per level",
    featherIcon: "trending-up",
    maxLevel: 25,
    baseCost: 100,
    costMultiplier: 1.4,
    stat: "atk",
    bonusPerLevel: 5,
  },
  {
    id: "fortitude",
    name: "Fortitude",
    description: "+{val}% Max HP per level",
    featherIcon: "heart",
    maxLevel: 25,
    baseCost: 80,
    costMultiplier: 1.35,
    stat: "hp",
    bonusPerLevel: 8,
  },
  {
    id: "iron_skin",
    name: "Iron Skin",
    description: "+{val}% DEF per level",
    featherIcon: "shield",
    maxLevel: 25,
    baseCost: 90,
    costMultiplier: 1.35,
    stat: "def",
    bonusPerLevel: 6,
  },
  {
    id: "fortune",
    name: "Fortune",
    description: "+{val}% Gold from kills per level",
    featherIcon: "dollar-sign",
    maxLevel: 25,
    baseCost: 120,
    costMultiplier: 1.5,
    stat: "gold",
    bonusPerLevel: 10,
  },
  {
    id: "precision",
    name: "Precision",
    description: "+{val}% CRIT rate per level",
    featherIcon: "crosshair",
    maxLevel: 20,
    baseCost: 150,
    costMultiplier: 1.6,
    stat: "crit",
    bonusPerLevel: 2,
  },
];

export const ACTIVE_SKILLS: ActiveSkillDef[] = [
  {
    id: "power_strike",
    name: "Power Strike",
    description: "Next attack deals 3x damage",
    featherIcon: "zap",
    cooldown: 10,
    effect: "power_strike",
  },
  {
    id: "battle_cry",
    name: "Battle Cry",
    description: "Reduce damage taken by 60% for 5s",
    featherIcon: "shield",
    cooldown: 20,
    effect: "battle_cry",
  },
];

export const EQUIPMENT_BASES: EquipmentBase[] = [
  { id: "short_sword", name: "Short Sword", slot: "weapon", atkBonus: 10, hpBonus: 0, defBonus: 0, critBonus: 0, goldValue: 20 },
  { id: "battle_axe", name: "Battle Axe", slot: "weapon", atkBonus: 18, hpBonus: 0, defBonus: 0, critBonus: 0, goldValue: 35 },
  { id: "magic_staff", name: "Magic Staff", slot: "weapon", atkBonus: 22, hpBonus: 0, defBonus: 0, critBonus: 0.02, goldValue: 45 },
  { id: "elven_bow", name: "Elven Bow", slot: "weapon", atkBonus: 15, hpBonus: 0, defBonus: 0, critBonus: 0.04, goldValue: 40 },
  { id: "dragon_fang", name: "Dragon Fang", slot: "weapon", atkBonus: 30, hpBonus: 0, defBonus: 0, critBonus: 0.02, goldValue: 65 },
  { id: "leather_vest", name: "Leather Vest", slot: "armor", atkBonus: 0, hpBonus: 30, defBonus: 5, critBonus: 0, goldValue: 25 },
  { id: "chain_mail", name: "Chain Mail", slot: "armor", atkBonus: 0, hpBonus: 55, defBonus: 11, critBonus: 0, goldValue: 42 },
  { id: "plate_armor", name: "Plate Armor", slot: "armor", atkBonus: 0, hpBonus: 85, defBonus: 20, critBonus: 0, goldValue: 65 },
  { id: "shadow_cloak", name: "Shadow Cloak", slot: "armor", atkBonus: 5, hpBonus: 40, defBonus: 8, critBonus: 0.02, goldValue: 55 },
  { id: "copper_ring", name: "Copper Ring", slot: "ring", atkBonus: 3, hpBonus: 10, defBonus: 2, critBonus: 0.01, goldValue: 15 },
  { id: "silver_ring", name: "Silver Ring", slot: "ring", atkBonus: 6, hpBonus: 22, defBonus: 4, critBonus: 0.02, goldValue: 30 },
  { id: "gold_ring", name: "Gold Ring", slot: "ring", atkBonus: 10, hpBonus: 38, defBonus: 7, critBonus: 0.03, goldValue: 50 },
  { id: "enchanted_ring", name: "Enchanted Ring", slot: "ring", atkBonus: 14, hpBonus: 50, defBonus: 9, critBonus: 0.05, goldValue: 75 },
];

export const RARITY_MULTS: Record<Rarity, number> = {
  common: 1,
  uncommon: 1.7,
  rare: 3.0,
  epic: 5.5,
  legendary: 10,
};

export const RARITY_PREFIXES: Record<Rarity, string> = {
  common: "",
  uncommon: "Fine",
  rare: "Superior",
  epic: "Ancient",
  legendary: "Legendary",
};

export function getExpToNext(level: number): number {
  return Math.floor(100 * Math.pow(1.18, level - 1));
}

export function getSkillCost(skill: PassiveSkillDef, currentLevel: number): number {
  return Math.floor(skill.baseCost * Math.pow(skill.costMultiplier, currentLevel));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}
