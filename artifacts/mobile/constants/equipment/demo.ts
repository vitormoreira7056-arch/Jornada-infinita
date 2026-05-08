// Arquivo de demonstração - Gera itens de exemplo para teste
import { generateWeapon, generateHead, generateChest, generateLegs, generateFeet, generateOffHand } from "./index";
import { EquipmentBase } from "./base";
import { EQUIPMENT_SETS } from "./sets";

// Gerar um personagem equipado completo para demonstração
export function generateDemoCharacter() {
  const level = 25;
  
  // Arma - Espada épica
  const weapon = generateWeapon("espada", "B", level, "Conjunto do Matador de Dragões");
  
  // Cabeça - Elmo
  const head = generateHead("elmo", "B", level, "Conjunto do Matador de Dragões");
  
  // Peitoral - Armadura de placas
  const chest = generateChest("armadura", "B", level, "Conjunto do Matador de Dragões");
  
  // Pernas - Grevas
  const legs = generateLegs("grevas", "B", level, "Conjunto do Matador de Dragões");
  
  // Pés - Botas
  const feet = generateFeet("botas", "B", level, "Conjunto do Matador de Dragões");
  
  // Off-hand - Escudo
  const offHand = generateOffHand("escudo", "A", level);
  
  return {
    weapon,
    head,
    chest,
    legs,
    feet,
    offHand,
  };
}

// Gerar inventário de exemplo
export function generateDemoInventory(count: number = 10): EquipmentBase[] {
  const inventory: EquipmentBase[] = [];
  const tiers: EquipmentBase["tier"][] = ["F", "E", "D", "C", "B", "A"];
  
  for (let i = 0; i < count; i++) {
    const tier = tiers[Math.floor(Math.random() * tiers.length)];
    const level = Math.floor(Math.random() * 30) + 1;
    
    const rand = Math.random();
    let item: EquipmentBase | null = null;
    
    if (rand < 0.2) {
      // Arma
      const types = ["espada", "machado", "arco", "varinha"] as const;
      item = generateWeapon(types[Math.floor(Math.random() * types.length)], tier, level);
    } else if (rand < 0.35) {
      // Cabeça
      const types = ["elmo", "capuz", "coroa"] as const;
      item = generateHead(types[Math.floor(Math.random() * types.length)], tier, level);
    } else if (rand < 0.5) {
      // Peitoral
      const types = ["armadura", "robe", "casaco"] as const;
      item = generateChest(types[Math.floor(Math.random() * types.length)], tier, level);
    } else if (rand < 0.65) {
      // Pernas
      const types = ["calca", "grevas", "saia"] as const;
      item = generateLegs(types[Math.floor(Math.random() * types.length)], tier, level);
    } else if (rand < 0.8) {
      // Pés
      const types = ["botas", "sandalias", "sapatos"] as const;
      item = generateFeet(types[Math.floor(Math.random() * types.length)], tier, level);
    } else {
      // Off-hand
      const types = ["escudo", "orb", "grimorio", "tocha"] as const;
      item = generateOffHand(types[Math.floor(Math.random() * types.length)], tier, level);
    }
    
    if (item) {
      inventory.push(item);
    }
  }
  
  return inventory;
}

// Demonstrar variações de nomes
export function demonstrateNameVariations() {
  console.log("=== VARIAÇÕES DE NOMES DE EQUIPAMENTOS ===\n");
  
  // Armas
  console.log("🗡️ ARMAS:");
  for (let i = 0; i < 5; i++) {
    const weapon = generateWeapon("espada", "S", 50);
    console.log(`  ${i + 1}. ${weapon.name}`);
  }
  
  console.log("\n🏹 ARCOS:");
  for (let i = 0; i < 5; i++) {
    const bow = generateWeapon("arco", "A", 40);
    console.log(`  ${i + 1}. ${bow.name}`);
  }
  
  console.log("\n🔮 VARINHAS:");
  for (let i = 0; i < 5; i++) {
    const wand = generateWeapon("varinha", "SS", 80);
    console.log(`  ${i + 1}. ${wand.name}`);
  }
  
  // Armaduras
  console.log("\n⛑️ ELMOS:");
  for (let i = 0; i < 5; i++) {
    const helm = generateHead("elmo", "B", 35);
    console.log(`  ${i + 1}. ${helm.name}`);
  }
  
  console.log("\n🛡️ ARMADURAS:");
  for (let i = 0; i < 5; i++) {
    const chest = generateChest("armadura", "A", 45);
    console.log(`  ${i + 1}. ${chest.name}`);
  }
  
  // Off-hand
  console.log("\n🛡️ ESCUDOS:");
  for (let i = 0; i < 5; i++) {
    const shield = generateOffHand("escudo", "S", 60);
    console.log(`  ${i + 1}. ${shield.name}`);
  }
  
  console.log("\n🔮 ORBES:");
  for (let i = 0; i < 5; i++) {
    const orb = generateOffHand("orb", "SS", 75);
    console.log(`  ${i + 1}. ${orb.name}`);
  }
}

// Demonstrar sets disponíveis
export function demonstrateSets() {
  console.log("=== SETS DE EQUIPAMENTO DISPONÍVEIS ===\n");
  
  EQUIPMENT_SETS.forEach((set, index) => {
    console.log(`${index + 1}. ${set.name} (${set.tier})`);
    console.log(`   Tema: ${set.theme} | Nível mínimo: ${set.minLevel}`);
    console.log(`   ${set.description}`);
    console.log("   Bônus:");
    set.bonuses.forEach(bonus => {
      console.log(`     ${bonus.requiredPieces} peças: ${bonus.description}`);
    });
    console.log("");
  });
}

// Estatísticas do sistema
export function getEquipmentSystemStats() {
  // Contar variações
  const weaponTypes = ["espada", "espada_dupla", "adaga", "adaga_dupla", "machado", "martelo", "maca", "foice", "arco", "varinha", "cajado", "lanca"];
  const headTypes = ["elmo", "capuz", "capacete", "coroa", "mascara", "bandana"];
  const chestTypes = ["armadura", "robe", "casaco", "colete", "tunica", "couraca"];
  const legsTypes = ["calca", "saia", "bermuda", "grevas", "calcas"];
  const feetTypes = ["botas", "sandalias", "sapatos", "grevas_pes", "meias"];
  const offHandTypes = ["escudo", "orb", "tocha", "grimorio", "lume", "bengala", "lanterna", "totem", "livro", "adaga_off"];
  
  const tiers = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS", "SSS+"];
  
  // Estimativa de variações (nomes base × prefixos × sufixos)
  const variationsPerItem = 30 * 5 * 40; // ~6000 variações por tipo base
  
  return {
    weaponTypes: weaponTypes.length,
    headTypes: headTypes.length,
    chestTypes: chestTypes.length,
    legsTypes: legsTypes.length,
    feetTypes: feetTypes.length,
    offHandTypes: offHandTypes.length,
    totalTypes: weaponTypes.length + headTypes.length + chestTypes.length + legsTypes.length + feetTypes.length + offHandTypes.length,
    tiers: tiers.length,
    sets: EQUIPMENT_SETS.length,
    estimatedVariationsPerType: variationsPerItem,
    totalEstimatedVariations: (weaponTypes.length + headTypes.length + chestTypes.length + legsTypes.length + feetTypes.length + offHandTypes.length) * variationsPerItem * tiers.length,
  };
}
