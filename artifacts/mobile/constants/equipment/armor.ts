// Sistema de Armaduras - 10000+ variações
import { EquipmentBase, HeadType, ChestType, LegsType, FeetType, TIER_MULTIPLIERS } from "./base";

// Prefixos de qualidade
const PREFIXOS = {
  comum: ["", "Usado", "Desgastado", "Simples", "Básico"],
  raro: ["Reforçado", "Ajustado", "Equilibrado", "Refinado", "Protegido"],
  epico: ["Brilhante", "Runico", "Encantado", "Místico", "Arcano"],
  lendario: ["Divino", "Épico", "Lendário", "Mítico", "Primordial"],
  unico: ["Único", "Exclusivo", "Relíquia", "Artefato", "Eterno"],
};

// Sufixos de material
const SUFIXOS_MATERIAL = [
  "de Couro", "de Couro Reforçado", "de Malha", "de Placas", "de Escamas",
  "de Mithril", "de Adamantita", "de Obsidiana", "de Cristal", "de Ossos",
  "de Madeira", "de Ébano", "de Marfim", "de Jade", "de Rubi",
  "de Tecido Mágico", "de Seda de Aranha", "de Pelo de Lobo", "de Escamas de Dragão"
];

// Sufixos de origem
const SUFIXOS_ORIGEM = [
  "do Guardião", "do Defensor", "do Protetor", "do Cavaleiro", "do Paladino",
  "do Berserker", "do Mago", "do Bruxo", "do Druida", "do Caçador",
  "do Assassino", "do Ladrão", "do Sacerdote", "do Monge", "do Samurai"
];

// Nomes base por tipo de cabeça
const NOMES_CABECA: Record<HeadType, string[]> = {
  elmo: [
    "Elmo", "Elmo Fechado", "Elmo Aberto", "Elmo com Viseira", "Elmo de Batalha",
    "Elmo de Guerra", "Elmo Real", "Elmo Nobre", "Elmo de Campeão", "Elmo de Gladiador",
    "Elmo de Placas", "Elmo de Malha", "Elmo Pesado", "Elmo Leve", "Elmo Decorado"
  ],
  capuz: [
    "Capuz", "Capuz de Tecido", "Capuz de Lã", "Capuz de Seda", "Capuz Místico",
    "Capuz das Sombras", "Capuz do Caçador", "Capuz do Mago", "Capuz do Druida",
    "Capuz da Natureza", "Capuz Élfico", "Capuz Sombrio", "Capuz Encantado"
  ],
  capacete: [
    "Capacete", "Capacete Leve", "Capacete Médio", "Capacete de Couro",
    "Capacete de Madeira", "Capacete de Bronze", "Capacete de Caçador",
    "Capacete de Explorador", "Capacete de Aventureiro"
  ],
  coroa: [
    "Coroa", "Coroa Real", "Coroa de Ouro", "Coroa de Prata", "Coroa de Cristal",
    "Coroa Mágica", "Coroa Arcana", "Coroa Sagrada", "Coroa Profana",
    "Diadema", "Tiara", "Diadema Místico", "Tiara de Estrelas"
  ],
  mascara: [
    "Máscara", "Máscara de Madeira", "Máscara de Ossos", "Máscara de Metal",
    "Máscara do Assassino", "Máscara Sombria", "Máscara de Ladrão",
    "Máscara Cerimonial", "Máscara Ritualística", "Máscara Tribal"
  ],
  bandana: [
    "Bandana", "Bandana de Pano", "Bandana de Seda", "Bandana de Couro",
    "Bandana do Pirata", "Bandana do Mercenário", "Bandana do Viajante",
    "Bandana Colorida", "Bandana Vermelha", "Bandana Negra"
  ],
};

// Nomes base por tipo de peitoral
const NOMES_PEITORAL: Record<ChestType, string[]> = {
  armadura: [
    "Armadura", "Armadura de Placas", "Armadura de Malha", "Armadura de Escamas",
    "Armadura de Batalha", "Armadura de Guerra", "Armadura Real", "Armadura de Cavaleiro",
    "Armadura Completa", "Armadura Pesada", "Armadura Média", "Armadura Leve",
    "Cota de Malha", "Brunea", "Loriga", "Cota de Placas"
  ],
  robe: [
    "Robe", "Robe de Mago", "Robe de Bruxo", "Robe de Feiticeiro", "Robe Arcano",
    "Robe Místico", "Robe das Estrelas", "Robe do Vazio", "Robe Sombrio",
    "Robe Sagrado", "Robe de Seda", "Robe de Veludo", "Robe Cerimonial"
  ],
  casaco: [
    "Casaco", "Casaco de Couro", "Casaco de Pele", "Casaco de Caçador",
    "Casaco de Explorador", "Casaco de Viajante", "Casaco de Aventureiro",
    "Casaco Reforçado", "Casaco Acolchoado", "Casaco de Lã", "Sobretudo"
  ],
  colete: [
    "Colete", "Colete de Couro", "Colete de Couro Reforçado", "Colete de Malha",
    "Colete de Placas", "Colete de Caçador", "Colete de Mercenário",
    "Colete Leve", "Colete Pesado", "Colete de Batalha"
  ],
  tunica: [
    "Túnica", "Túnica de Tecido", "Túnica de Seda", "Túnica de Lã",
    "Túnica de Mago", "Túnica de Sacerdote", "Túnica de Druida",
    "Túnica Simples", "Túnica Cerimonial", "Túnica Élfica"
  ],
  couraca: [
    "Couraça", "Couraça de Couro", "Couraça de Metal", "Couraça de Placas",
    "Couraça de Bronze", "Couraça de Ferro", "Couraça de Aço",
    "Peitoral", "Peitoral de Malha", "Peitoral de Escamas"
  ],
};

// Nomes base por tipo de pernas
const NOMES_PERNAS: Record<LegsType, string[]> = {
  calca: [
    "Calça", "Calças", "Calças de Couro", "Calças de Tecido", "Calças de Lã",
    "Calças de Caçador", "Calças de Explorador", "Calças de Aventureiro",
    "Calças Reforçadas", "Calças de Malha", "Calças de Placas"
  ],
  saia: [
    "Saia", "Saia Longa", "Saia de Tecido", "Saia de Seda", "Saia de Lã",
    "Saia de Mago", "Saia de Sacerdotisa", "Saia Cerimonial", "Saia Élfica",
    "Vestido", "Vestido Simples", "Vestido de Mago"
  ],
  bermuda: [
    "Bermuda", "Bermuda de Couro", "Bermuda de Tecido", "Bermuda de Caçador",
    "Calções", "Calções de Couro", "Calções de Explorador"
  ],
  grevas: [
    "Grevas", "Grevas de Placas", "Grevas de Malha", "Grevas de Couro",
    "Grevas de Cavaleiro", "Grevas de Batalha", "Caneleiras", "Caneleiras de Metal"
  ],
  calcas: [
    "Calças", "Calças Simples", "Calças de Viajante", "Calças de Mercenário",
    "Calças de Ladrão", "Calças de Assassino"
  ],
};

// Nomes base por tipo de pés
const NOMES_PES: Record<FeetType, string[]> = {
  botas: [
    "Botas", "Botas de Couro", "Botas de Couro Reforçado", "Botas de Malha",
    "Botas de Placas", "Botas de Batalha", "Botas de Cavaleiro", "Botas de Guerra",
    "Botas Pesadas", "Botas de Montaria", "Botas de Explorador", "Botas de Aventureiro"
  ],
  sandalias: [
    "Sandálias", "Sandálias de Couro", "Sandálias de Tecido", "Sandálias de Mago",
    "Sandálias de Sacerdote", "Sandálias de Druida", "Sandálias Simples",
    "Sandálias Cerimoniais", "Sandálias Élficas", "Sandálias de Viajante"
  ],
  sapatos: [
    "Sapatos", "Sapatos de Couro", "Sapatos Simples", "Sapatos de Mago",
    "Sapatos de Nobre", "Sapatos de Ladrão", "Sapatos de Assassino",
    "Sapatos Silenciosos", "Mocassins", "Mocassins de Couro"
  ],
  grevas_pes: [
    "Grevas de Pés", "Botas de Placas", "Botas de Metal", "Botas de Cavaleiro",
    "Sabatons", "Sabatons de Aço", "Sabatons de Mithril"
  ],
  meias: [
    "Meias", "Meias de Lã", "Meias de Tecido", "Meias de Couro",
    "Meias de Explorador", "Meias de Viajante"
  ],
};

// Efeitos passivos por slot
const EFEITOS_CABECA = [
  "+5% Resistência mágica", "+3% Inteligência", "+10% Precisão",
  "+5% Regeneração de MP", "+2% Experiência ganha", "+5% Resistência a atordoamento"
];

const EFEITOS_PEITORAL = [
  "+10% Armadura", "+5% HP máximo", "+5% Regeneração de HP",
  "+3% Força", "+3% Constituição", "Redução de dano físico: 5%"
];

const EFEITOS_PERNAS = [
  "+5% Velocidade de movimento", "+3% Agilidade", "+5% Esquiva",
  "+5% Resistência elemental", "+3% Destreza"
];

const EFEITOS_PES = [
  "+10% Velocidade de movimento", "+5% Esquiva", "Imunidade a terreno difícil",
  "+3% Velocidade de ataque", "Silencioso: Inimigos não ouvem seus passos"
];

// Gerar item de cabeça
export function generateHead(
  type: HeadType,
  tier: EquipmentBase["tier"],
  level: number,
  setName?: string
): EquipmentBase {
  const mult = TIER_MULTIPLIERS[tier].statMult;
  const nomes = NOMES_CABECA[type];
  const nomeBase = nomes[Math.floor(Math.random() * nomes.length)];
  
  let nomeFinal = nomeBase;
  
  if (tier === "S" || tier === "SS" || tier === "SSS" || tier === "SSS+") {
    const prefixos = PREFIXOS.lendario;
    nomeFinal = `${prefixos[Math.floor(Math.random() * prefixos.length)]} ${nomeFinal}`;
  } else if (tier === "A" || tier === "B") {
    const prefixos = PREFIXOS.epico;
    nomeFinal = `${prefixos[Math.floor(Math.random() * prefixos.length)]} ${nomeFinal}`;
  } else if (tier === "C" || tier === "D") {
    const prefixos = PREFIXOS.raro;
    nomeFinal = `${prefixos[Math.floor(Math.random() * prefixos.length)]} ${nomeFinal}`;
  }
  
  if (Math.random() > 0.3) {
    if (Math.random() > 0.5) {
      nomeFinal += ` ${SUFIXOS_MATERIAL[Math.floor(Math.random() * SUFIXOS_MATERIAL.length)]}`;
    } else {
      nomeFinal += ` ${SUFIXOS_ORIGEM[Math.floor(Math.random() * SUFIXOS_ORIGEM.length)]}`;
    }
  }
  
  const passiveEffect = EFEITOS_CABECA[Math.floor(Math.random() * EFEITOS_CABECA.length)];
  
  return {
    id: `head_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: nomeFinal,
    slot: "head",
    type,
    tier,
    level,
    atkF: 0,
    atkM: Math.floor(2 * mult),
    def: Math.floor(5 * mult * (1 + level * 0.05)),
    armor: Math.floor(3 * mult * (1 + level * 0.05)),
    magicRes: Math.floor(5 * mult * (1 + level * 0.05)),
    hp: Math.floor(20 * mult * (1 + level * 0.1)),
    mp: Math.floor(15 * mult),
    critRate: 0,
    critDmg: 1,
    atkSpeed: 0,
    dodge: 0.01 * mult,
    passiveEffect,
    icon: getHeadIcon(type),
    color: TIER_MULTIPLIERS[tier].color,
    setName,
  };
}

// Gerar peitoral
export function generateChest(
  type: ChestType,
  tier: EquipmentBase["tier"],
  level: number,
  setName?: string
): EquipmentBase {
  const mult = TIER_MULTIPLIERS[tier].statMult;
  const nomes = NOMES_PEITORAL[type];
  const nomeBase = nomes[Math.floor(Math.random() * nomes.length)];
  
  let nomeFinal = nomeBase;
  
  if (tier === "S" || tier === "SS" || tier === "SSS" || tier === "SSS+") {
    const prefixos = PREFIXOS.lendario;
    nomeFinal = `${prefixos[Math.floor(Math.random() * prefixos.length)]} ${nomeFinal}`;
  } else if (tier === "A" || tier === "B") {
    const prefixos = PREFIXOS.epico;
    nomeFinal = `${prefixos[Math.floor(Math.random() * prefixos.length)]} ${nomeFinal}`;
  } else if (tier === "C" || tier === "D") {
    const prefixos = PREFIXOS.raro;
    nomeFinal = `${prefixos[Math.floor(Math.random() * prefixos.length)]} ${nomeFinal}`;
  }
  
  if (Math.random() > 0.3) {
    if (Math.random() > 0.5) {
      nomeFinal += ` ${SUFIXOS_MATERIAL[Math.floor(Math.random() * SUFIXOS_MATERIAL.length)]}`;
    } else {
      nomeFinal += ` ${SUFIXOS_ORIGEM[Math.floor(Math.random() * SUFIXOS_ORIGEM.length)]}`;
    }
  }
  
  const passiveEffect = EFEITOS_PEITORAL[Math.floor(Math.random() * EFEITOS_PEITORAL.length)];
  
  // Stats base variam por tipo
  const isHeavy = type === "armadura" || type === "couraca";
  const isLight = type === "robe" || type === "tunica";
  
  return {
    id: `chest_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: nomeFinal,
    slot: "chest",
    type,
    tier,
    level,
    atkF: 0,
    atkM: isLight ? Math.floor(5 * mult) : 0,
    def: Math.floor((isHeavy ? 15 : 8) * mult * (1 + level * 0.05)),
    armor: Math.floor((isHeavy ? 12 : 5) * mult * (1 + level * 0.05)),
    magicRes: Math.floor((isLight ? 10 : 5) * mult * (1 + level * 0.05)),
    hp: Math.floor((isHeavy ? 50 : 30) * mult * (1 + level * 0.1)),
    mp: Math.floor((isLight ? 30 : 10) * mult),
    critRate: 0,
    critDmg: 1,
    atkSpeed: 0,
    dodge: isLight ? 0.02 * mult : 0,
    passiveEffect,
    icon: getChestIcon(type),
    color: TIER_MULTIPLIERS[tier].color,
    setName,
  };
}

// Gerar pernas
export function generateLegs(
  type: LegsType,
  tier: EquipmentBase["tier"],
  level: number,
  setName?: string
): EquipmentBase {
  const mult = TIER_MULTIPLIERS[tier].statMult;
  const nomes = NOMES_PERNAS[type];
  const nomeBase = nomes[Math.floor(Math.random() * nomes.length)];
  
  let nomeFinal = nomeBase;
  
  if (tier === "S" || tier === "SS" || tier === "SSS" || tier === "SSS+") {
    const prefixos = PREFIXOS.lendario;
    nomeFinal = `${prefixos[Math.floor(Math.random() * prefixos.length)]} ${nomeFinal}`;
  } else if (tier === "A" || tier === "B") {
    const prefixos = PREFIXOS.epico;
    nomeFinal = `${prefixos[Math.floor(Math.random() * prefixos.length)]} ${nomeFinal}`;
  } else if (tier === "C" || tier === "D") {
    const prefixos = PREFIXOS.raro;
    nomeFinal = `${prefixos[Math.floor(Math.random() * prefixos.length)]} ${nomeFinal}`;
  }
  
  if (Math.random() > 0.3) {
    if (Math.random() > 0.5) {
      nomeFinal += ` ${SUFIXOS_MATERIAL[Math.floor(Math.random() * SUFIXOS_MATERIAL.length)]}`;
    } else {
      nomeFinal += ` ${SUFIXOS_ORIGEM[Math.floor(Math.random() * SUFIXOS_ORIGEM.length)]}`;
    }
  }
  
  const passiveEffect = EFEITOS_PERNAS[Math.floor(Math.random() * EFEITOS_PERNAS.length)];
  
  const isHeavy = type === "grevas";
  const isLight = type === "saia" || type === "bermuda";
  
  return {
    id: `legs_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: nomeFinal,
    slot: "legs",
    type,
    tier,
    level,
    atkF: 0,
    atkM: 0,
    def: Math.floor((isHeavy ? 10 : 6) * mult * (1 + level * 0.05)),
    armor: Math.floor((isHeavy ? 8 : 4) * mult * (1 + level * 0.05)),
    magicRes: Math.floor(3 * mult * (1 + level * 0.05)),
    hp: Math.floor((isHeavy ? 40 : 25) * mult * (1 + level * 0.1)),
    mp: Math.floor(10 * mult),
    critRate: 0,
    critDmg: 1,
    atkSpeed: 0,
    dodge: (isLight ? 0.03 : 0.01) * mult,
    passiveEffect,
    icon: getLegsIcon(type),
    color: TIER_MULTIPLIERS[tier].color,
    setName,
  };
}

// Gerar pés
export function generateFeet(
  type: FeetType,
  tier: EquipmentBase["tier"],
  level: number,
  setName?: string
): EquipmentBase {
  const mult = TIER_MULTIPLIERS[tier].statMult;
  const nomes = NOMES_PES[type];
  const nomeBase = nomes[Math.floor(Math.random() * nomes.length)];
  
  let nomeFinal = nomeBase;
  
  if (tier === "S" || tier === "SS" || tier === "SSS" || tier === "SSS+") {
    const prefixos = PREFIXOS.lendario;
    nomeFinal = `${prefixos[Math.floor(Math.random() * prefixos.length)]} ${nomeFinal}`;
  } else if (tier === "A" || tier === "B") {
    const prefixos = PREFIXOS.epico;
    nomeFinal = `${prefixos[Math.floor(Math.random() * prefixos.length)]} ${nomeFinal}`;
  } else if (tier === "C" || tier === "D") {
    const prefixos = PREFIXOS.raro;
    nomeFinal = `${prefixos[Math.floor(Math.random() * prefixos.length)]} ${nomeFinal}`;
  }
  
  if (Math.random() > 0.3) {
    if (Math.random() > 0.5) {
      nomeFinal += ` ${SUFIXOS_MATERIAL[Math.floor(Math.random() * SUFIXOS_MATERIAL.length)]}`;
    } else {
      nomeFinal += ` ${SUFIXOS_ORIGEM[Math.floor(Math.random() * SUFIXOS_ORIGEM.length)]}`;
    }
  }
  
  const passiveEffect = EFEITOS_PES[Math.floor(Math.random() * EFEITOS_PES.length)];
  
  const isHeavy = type === "botas" || type === "grevas_pes";
  const isLight = type === "sandalias" || type === "meias";
  
  return {
    id: `feet_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: nomeFinal,
    slot: "feet",
    type,
    tier,
    level,
    atkF: 0,
    atkM: 0,
    def: Math.floor((isHeavy ? 5 : 2) * mult * (1 + level * 0.05)),
    armor: Math.floor((isHeavy ? 4 : 2) * mult * (1 + level * 0.05)),
    magicRes: Math.floor(2 * mult * (1 + level * 0.05)),
    hp: Math.floor((isHeavy ? 20 : 10) * mult * (1 + level * 0.1)),
    mp: Math.floor(5 * mult),
    critRate: 0,
    critDmg: 1,
    atkSpeed: isLight ? 0.05 * mult : 0,
    dodge: (isLight ? 0.05 : 0.02) * mult,
    passiveEffect,
    icon: getFeetIcon(type),
    color: TIER_MULTIPLIERS[tier].color,
    setName,
  };
}

function getHeadIcon(type: HeadType): string {
  const icons: Record<HeadType, string> = {
    elmo: "⛑️", capuz: "🎩", capacete: "🪖", coroa: "👑", mascara: "🎭", bandana: "🧣",
  };
  return icons[type];
}

function getChestIcon(type: ChestType): string {
  const icons: Record<ChestType, string> = {
    armadura: "🛡️", robe: "🥋", casaco: "🧥", colete: "🦺", tunica: "👘", couraca: "🛡️",
  };
  return icons[type];
}

function getLegsIcon(type: LegsType): string {
  const icons: Record<LegsType, string> = {
    calca: "👖", saia: "👗", bermuda: "🩳", grevas: "🦵", calcas: "👖",
  };
  return icons[type];
}

function getFeetIcon(type: FeetType): string {
  const icons: Record<FeetType, string> = {
    botas: "🥾", sandalias: "🩴", sapatos: "👞", grevas_pes: "🥾", meias: "🧦",
  };
  return icons[type];
}

// Gerar pool de armaduras
export function generateArmorPool(count: number = 1000): EquipmentBase[] {
  const armors: EquipmentBase[] = [];
  const headTypes: HeadType[] = ["elmo", "capuz", "capacete", "coroa", "mascara", "bandana"];
  const chestTypes: ChestType[] = ["armadura", "robe", "casaco", "colete", "tunica", "couraca"];
  const legsTypes: LegsType[] = ["calca", "saia", "bermuda", "grevas", "calcas"];
  const feetTypes: FeetType[] = ["botas", "sandalias", "sapatos", "grevas_pes", "meias"];
  const tiers: EquipmentBase["tier"][] = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS"];
  
  for (let i = 0; i < count; i++) {
    const slot = Math.floor(Math.random() * 4);
    const tier = tiers[Math.floor(Math.random() * tiers.length)];
    const level = Math.floor(Math.random() * 100) + 1;
    
    switch (slot) {
      case 0:
        armors.push(generateHead(headTypes[Math.floor(Math.random() * headTypes.length)], tier, level));
        break;
      case 1:
        armors.push(generateChest(chestTypes[Math.floor(Math.random() * chestTypes.length)], tier, level));
        break;
      case 2:
        armors.push(generateLegs(legsTypes[Math.floor(Math.random() * legsTypes.length)], tier, level));
        break;
      case 3:
        armors.push(generateFeet(feetTypes[Math.floor(Math.random() * feetTypes.length)], tier, level));
        break;
    }
  }
  
  return armors;
}
