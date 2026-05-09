// Sistema de Equipamentos - Exportações
export * from "./base";
export * from "./weapons";
export * from "./armor";
export * from "./offhand";
export * from "./accessories";
export * from "./sets";
export * from "./demo";

// Funções utilitárias
import { EquipmentBase, EquipmentSlot } from "./base";
import { generateWeapon, generateWeaponPool, generateUniqueWeapon } from "./weapons";
import { generateHead, generateChest, generateLegs, generateFeet, generateArmorPool } from "./armor";
import { generateOffHand, generateOffHandPool, generateUniqueOffHand } from "./offhand";
import { generateEarrings, generateNecklace, generateFace, generateAccessoriesPool } from "./accessories";

// Gerar item aleatório para um slot específico
export function generateRandomEquipment(
  slot: EquipmentSlot,
  tier: EquipmentBase["tier"],
  level: number,
  setName?: string
): EquipmentBase | null {
  switch (slot) {
    case "mainHand":
      const weaponTypes = ["espada", "espada_dupla", "adaga", "adaga_dupla", "machado", "martelo", "maca", "foice", "arco", "varinha", "cajado", "lanca"] as const;
      return generateWeapon(weaponTypes[Math.floor(Math.random() * weaponTypes.length)], tier, level, setName);
    
    case "offHand":
      const offHandTypes = ["escudo", "orb", "tocha", "grimorio", "lume", "bengala", "lanterna", "totem", "livro", "adaga_off"] as const;
      return generateOffHand(offHandTypes[Math.floor(Math.random() * offHandTypes.length)], tier, level, setName);
    
    case "head":
      const headTypes = ["elmo", "capuz", "capacete", "coroa", "mascara", "bandana"] as const;
      return generateHead(headTypes[Math.floor(Math.random() * headTypes.length)], tier, level, setName);
    
    case "chest":
      const chestTypes = ["armadura", "robe", "casaco", "colete", "tunica", "couraca"] as const;
      return generateChest(chestTypes[Math.floor(Math.random() * chestTypes.length)], tier, level, setName);
    
    case "legs":
      const legsTypes = ["calca", "saia", "bermuda", "grevas", "calcas"] as const;
      return generateLegs(legsTypes[Math.floor(Math.random() * legsTypes.length)], tier, level, setName);
    
    case "feet":
      const feetTypes = ["botas", "sandalias", "sapatos", "grevas_pes", "meias"] as const;
      return generateFeet(feetTypes[Math.floor(Math.random() * feetTypes.length)], tier, level, setName);
    
    case "earrings":
      const earringsTypes = ["brinco", "pendente", "argola", "plug", "alargador", "corrente"] as const;
      return generateEarrings(earringsTypes[Math.floor(Math.random() * earringsTypes.length)], tier, level, setName);
    
    case "necklace":
      const necklaceTypes = ["colar", "amuleto", "medalhao", "gargantilha", "rosario", "pingente"] as const;
      return generateNecklace(necklaceTypes[Math.floor(Math.random() * necklaceTypes.length)], tier, level, setName);
    
    case "face":
      const faceTypes = ["mascara", "oculos", "piercing", "bandana", "venda", "monoculo", "tatuagem"] as const;
      return generateFace(faceTypes[Math.floor(Math.random() * faceTypes.length)], tier, level, setName);
    
    default:
      return null;
  }
}

// Gerar loot de boss
export function generateBossLoot(
  bossName: string,
  bossLevel: number,
  tier: EquipmentBase["tier"],
  itemCount: number = 1
): EquipmentBase[] {
  const loot: EquipmentBase[] = [];
  const slots: EquipmentSlot[] = ["mainHand", "offHand", "head", "chest", "legs", "feet"];
  
  for (let i = 0; i < itemCount; i++) {
    const slot = slots[Math.floor(Math.random() * slots.length)];
    const item = generateRandomEquipment(slot, tier, bossLevel);
    if (item) {
      item.name = `${item.name} de ${bossName}`;
      // Melhorar stats para item único de boss
      item.atkF = Math.floor(item.atkF * 1.2);
      item.atkM = Math.floor(item.atkM * 1.2);
      item.def = Math.floor(item.def * 1.2);
      item.armor = Math.floor(item.armor * 1.2);
      item.hp = Math.floor(item.hp * 1.2);
      item.mp = Math.floor(item.mp * 1.2);
      loot.push(item);
    }
  }
  
  return loot;
}

// Gerar loot de mini-boss (menor chance de item bom)
export function generateMiniBossLoot(
  miniBossName: string,
  miniBossLevel: number,
  tier: EquipmentBase["tier"]
): EquipmentBase | null {
  const slots: EquipmentSlot[] = ["mainHand", "offHand", "head", "chest", "legs", "feet"];
  const slot = slots[Math.floor(Math.random() * slots.length)];
  const item = generateRandomEquipment(slot, tier, miniBossLevel);
  
  if (item && Math.random() > 0.3) { // 70% chance de dropar
    item.name = `${item.name} do ${miniBossName}`;
    return item;
  }
  
  return null;
}

// Gerar loot baseado no tipo e rank do mob
export function generateMobLoot(
  mobName: string,
  mobLevel: number,
  mobRank: string,
  mobType: "normal" | "elite" | "boss" | "unique"
): EquipmentBase[] {
  const loot: EquipmentBase[] = [];
  
  // Mapear rank para tier
  const rankToTier: Record<string, EquipmentBase["tier"]> = {
    "F": "F", "E": "E", "D": "D", "C": "C", "B": "B",
    "A": "A", "S": "S", "SS": "SS", "SSS": "SSS", "SSS+": "SSS+"
  };
  
  // Chance base de drop por tipo
  const dropChances: Record<string, number> = {
    "normal": 0.15,    // 15% chance
    "elite": 0.40,     // 40% chance
    "boss": 0.85,      // 85% chance (1-2 itens)
    "unique": 0.60,    // 60% chance
  };
  
  // Número de itens por tipo
  const itemCounts: Record<string, { min: number; max: number }> = {
    "normal": { min: 0, max: 1 },
    "elite": { min: 0, max: 2 },
    "boss": { min: 1, max: 3 },
    "unique": { min: 0, max: 2 },
  };
  
  const dropChance = dropChances[mobType] || 0.15;
  const itemCountRange = itemCounts[mobType] || { min: 0, max: 1 };
  
  // Determinar quantos itens dropar
  let itemsToDrop = 0;
  if (Math.random() < dropChance) {
    itemsToDrop = Math.floor(Math.random() * (itemCountRange.max - itemCountRange.min + 1)) + itemCountRange.min;
  }
  
  // Bosses sempre dropam pelo menos 1 item
  if (mobType === "boss" && itemsToDrop === 0) {
    itemsToDrop = 1;
  }
  
  // Ajustar tier baseado no tipo
  let tier = rankToTier[mobRank] || "F";
  
  // Bosses e uniques dropam tier melhor
  if (mobType === "boss") {
    const tierBoost: Record<string, EquipmentBase["tier"]> = {
      "F": "D", "E": "C", "D": "B", "C": "A", "B": "S", "A": "SS", "S": "SSS", "SS": "SSS+", "SSS": "SSS+", "SSS+": "SSS+"
    };
    tier = tierBoost[tier] || tier;
  } else if (mobType === "elite" || mobType === "unique") {
    const tierBoost: Record<string, EquipmentBase["tier"]> = {
      "F": "E", "E": "D", "D": "C", "C": "B", "B": "A", "A": "S", "S": "SS", "SS": "SSS", "SSS": "SSS+", "SSS+": "SSS+"
    };
    tier = tierBoost[tier] || tier;
  }
  
  // Gerar os itens (todos os 9 slots)
  const slots: EquipmentSlot[] = ["mainHand", "offHand", "head", "chest", "legs", "feet", "earrings", "necklace", "face"];
  
  for (let i = 0; i < itemsToDrop; i++) {
    const slot = slots[Math.floor(Math.random() * slots.length)];
    const item = generateRandomEquipment(slot, tier, mobLevel);
    
    if (item) {
      // Adicionar sufixo do mob para itens de boss/unique
      if (mobType === "boss" || mobType === "unique") {
        item.name = `${item.name} de ${mobName}`;
        // Melhorar stats para bosses
        if (mobType === "boss") {
          item.atkF = Math.floor(item.atkF * 1.3);
          item.atkM = Math.floor(item.atkM * 1.3);
          item.def = Math.floor(item.def * 1.3);
          item.armor = Math.floor(item.armor * 1.3);
          item.hp = Math.floor(item.hp * 1.3);
          item.mp = Math.floor(item.mp * 1.3);
        }
      }
      loot.push(item);
    }
  }
  
  return loot;
}

// Calcular power level de um item
export function calculateItemPower(item: EquipmentBase): number {
  let power = 0;
  power += item.atkF * 2;
  power += item.atkM * 2;
  power += item.def * 1.5;
  power += item.armor * 1.5;
  power += item.magicRes * 1.5;
  power += item.hp * 0.5;
  power += item.mp * 0.5;
  power += item.critRate * 100;
  power += item.critDmg * 10;
  power += item.atkSpeed * 50;
  power += item.dodge * 100;
  return Math.floor(power);
}

// Comparar dois itens
export function compareItems(item1: EquipmentBase, item2: EquipmentBase): {
  better: EquipmentBase;
  power1: number;
  power2: number;
  difference: number;
} {
  const power1 = calculateItemPower(item1);
  const power2 = calculateItemPower(item2);
  
  return {
    better: power1 >= power2 ? item1 : item2,
    power1,
    power2,
    difference: Math.abs(power1 - power2),
  };
}

// Gerar nome de cor baseado no tier
export function getTierColor(tier: EquipmentBase["tier"]): string {
  const colors: Record<EquipmentBase["tier"], string> = {
    "F": "#9ca3af",    // Cinza
    "E": "#22c55e",    // Verde
    "D": "#3b82f6",    // Azul
    "C": "#a855f7",    // Roxo
    "B": "#f59e0b",    // Laranja
    "A": "#ef4444",    // Vermelho
    "S": "#ec4899",    // Rosa
    "SS": "#22d3ee",   // Ciano
    "SSS": "#fbbf24",  // Dourado
    "SSS+": "#ffffff", // Branco/Prata
  };
  return colors[tier];
}

// Gerar nome de tier traduzido
export function getTierName(tier: EquipmentBase["tier"]): string {
  const names: Record<EquipmentBase["tier"], string> = {
    "F": "Comum",
    "E": "Incomum",
    "D": "Raro",
    "C": "Épico",
    "B": "Lendário",
    "A": "Mítico",
    "S": "Sagrado",
    "SS": "Divino",
    "SSS": "Cósmico",
    "SSS+": "Transcendental",
  };
  return names[tier];
}
