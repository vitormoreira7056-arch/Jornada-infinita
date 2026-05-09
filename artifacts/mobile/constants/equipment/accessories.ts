// Sistema de Acessórios - Brincos, Colares e Rosto
// 10000+ variações por tipo
import { EquipmentBase, EarringsType, NecklaceType, FaceType, TIER_MULTIPLIERS } from "./base";

// Prefixos de qualidade
const PREFIXOS = {
  comum: ["", "Simples", "Básico", "Comum", "Ordinário"],
  raro: ["Brilhante", "Polido", "Refinado", "Trabalhado", "Decorado"],
  epico: ["Rúnico", "Encantado", "Místico", "Arcano", "Mágico"],
  lendario: ["Divino", "Épico", "Lendário", "Mítico", "Primordial"],
  unico: ["Único", "Relíquia", "Artefato", "Eterno", "Ancestral"],
};

// Sufixos de material
const SUFIXOS_MATERIAL = [
  "de Prata", "de Ouro", "de Platina", "de Bronze", "de Cobre",
  "de Mithril", "de Adamantita", "de Cristal", "de Obsidiana", "de Marfim",
  "de Jade", "de Rubi", "de Safira", "de Esmeralda", "de Diamante",
  "de Âmbar", "de Pérola", "de Coral", "de Ossos", "de Madeira",
  "de Ébano", "de Aço", "de Ferro", "de Titânio", "de Arcanita"
];

// Sufixos de origem
const SUFIXOS_ORIGEM = [
  "do Lobo", "do Dragão", "da Águia", "da Serpente", "do Tigre",
  "do Leão", "do Urso", "da Pantera", "do Falcão", "da Coruja",
  "do Elfos", "dos Anões", "dos Orcs", "dos Trolls", "dos Gigantes",
  "do Sol", "da Lua", "das Estrelas", "do Vazio", "do Abismo",
  "da Natureza", "do Fogo", "do Gelo", "do Trovão", "da Sombra"
];

// ==================== BRINCOS ====================

const NOMES_BRINCOS: Record<EarringsType, string[]> = {
  brinco: [
    "Brinco", "Brinco de Pressão", "Brinco de Argola", "Brinco Pendente",
    "Brinco de Pérola", "Brinco de Cristal", "Brinco de Gota", "Brinco de Coração",
    "Brinco Estrela", "Brinco Lua", "Brinco Sol", "Brinco Floral",
    "Brinco Élfico", "Brinco Real", "Brinco Simples", "Brinco Elegante"
  ],
  pendente: [
    "Pendente", "Pendente Longo", "Pendente de Cristal", "Pendente Místico",
    "Pendente Rúnico", "Pendente de Gema", "Pendente de Dragão", "Pendente de Fênix",
    "Pendente Lunar", "Pendente Solar", "Pendente Estelar", "Pendente Arcano"
  ],
  argola: [
    "Argola", "Argola Grande", "Argola Pequena", "Argola Dupla",
    "Argola Trançada", "Argola de Ouro", "Argola de Prata", "Argola Tribal",
    "Argola Élfica", "Argola de Guerreiro", "Argola de Xamã", "Argola Mística"
  ],
  plug: [
    "Plug", "Plug de Madeira", "Plug de Osso", "Plug de Cristal",
    "Plug de Obsidiana", "Plug Rúnico", "Plug Tribal", "Plug de Guerra",
    "Plug Xamânico", "Plug de Status", "Plug de Clã", "Plug Cerimonial"
  ],
  alargador: [
    "Alargador", "Alargador de Osso", "Alargador de Madeira", "Alargador de Pedra",
    "Alargador Tribal", "Alargador de Guerra", "Alargador de Xamã", "Alargador de Clã",
    "Alargador Cerimonial", "Alargador de Status", "Alargador de Prova", "Alargador Ancestral"
  ],
  corrente: [
    "Corrente", "Corrente de Ouro", "Corrente de Prata", "Corrente de Aço",
    "Corrente Delicada", "Corrente Grossa", "Corrente Dupla", "Corrente Tripla",
    "Corrente com Pingente", "Corrente Rúnica", "Corrente Mística", "Corrente Real"
  ],
};

const EFEITOS_BRINCOS = [
  "+5% Chance de crítico", "+3% Velocidade de ataque", "+10% Dano mágico",
  "+5% Resistência mágica", "+2% Roubo de vida", "+5% Precisão",
  "+3% Esquiva", "+10% Regeneração de MP", "+5% Experiência ganha",
  "+3% Chance de encontrar itens", "+5% Dano elemental", "+2% Todos os atributos"
];

// ==================== COLARES ====================

const NOMES_COLARES: Record<NecklaceType, string[]> = {
  colar: [
    "Colar", "Colar de Pérolas", "Colar de Cristais", "Colar de Ouro",
    "Colar de Prata", "Colar de Jade", "Colar Élfico", "Colar Real",
    "Colar Simples", "Colar Elegante", "Colar de Gêmeos", "Colar de Três Voltas"
  ],
  amuleto: [
    "Amuleto", "Amuleto de Proteção", "Amuleto de Sorte", "Amuleto de Força",
    "Amuleto de Sabedoria", "Amuleto de Vida", "Amuleto de Mana", "Amuleto Elemental",
    "Amuleto Rúnico", "Amuleto Místico", "Amuleto Ancestral", "Amuleto do Guardião"
  ],
  medalhao: [
    "Medalhão", "Medalhão de Guerra", "Medalhão de Honra", "Medalhão Real",
    "Medalhão de Família", "Medalhão de Clã", "Medalhão de Guilda", "Medalhão de Herói",
    "Medalhão de Campeão", "Medalhão de Conquistador", "Medalhão de Explorador", "Medalhão de Lenda"
  ],
  gargantilha: [
    "Gargantilha", "Gargantilha de Veludo", "Gargantilha de Couro", "Gargantilha de Metal",
    "Gargantilha de Espinhos", "Gargantilha de Cristais", "Gargantilha Sombria", "Gargantilha Real",
    "Gargantilha de Vampiro", "Gargantilha de Liche", "Gargantilha Demoníaca", "Gargantilha Sagrada"
  ],
  rosario: [
    "Rosário", "Rosário de Oração", "Rosário de Proteção", "Rosário de Cura",
    "Rosário Sagrado", "Rosário Divino", "Rosário de Luz", "Rosário de Fé",
    "Rosário de Bênção", "Rosário de Milagres", "Rosário de Santos", "Rosário de Anjos"
  ],
  pingente: [
    "Pingente", "Pingente de Cristal", "Pingente de Gema", "Pingente de Dente",
    "Pingente de Garra", "Pingente de Chifre", "Pingente de Asa", "Pingente de Escama",
    "Pingente de Olho", "Pingente de Coração", "Pingente de Chama", "Pingente de Gelo"
  ],
};

const EFEITOS_COLARES = [
  "+10% HP máximo", "+10% MP máximo", "+5% Regeneração de HP",
  "+5% Regeneração de MP", "+3% Resistência a todos os elementos", "+5% Defesa",
  "+3% Redução de dano", "+10% Cura recebida", "+5% Duração de buffs",
  "-5% Duração de debuffs", "+2% Revive com 20% HP uma vez por dia", "+5% Vampirismo mágico"
];

// ==================== ROSTO ====================

const NOMES_ROSTO: Record<FaceType, string[]> = {
  mascara: [
    "Máscara", "Máscara de Madeira", "Máscara de Metal", "Máscara de Couro",
    "Máscara de Ossos", "Máscara de Demônio", "Máscara de Dragão", "Máscara de Lobo",
    "Máscara de Coruja", "Máscara de Corvo", "Máscara de Caveira", "Máscara de Morte",
    "Máscara de Festa", "Máscara de Corte", "Máscara de Veneza", "Máscara Teatral"
  ],
  oculos: [
    "Óculos", "Óculos Redondos", "Óculos de Sol", "Óculos de Lente Única",
    "Óculos de Leitura", "Óculos de Precisão", "Óculos de Alquimista", "Óculos de Mago",
    "Óculos de Caçador", "Óculos de Engenheiro", "Óculos de Aviador", "Óculos de Visão Noturna"
  ],
  piercing: [
    "Piercing", "Piercing no Nariz", "Piercing na Sobrancelha", "Piercing no Lábio",
    "Piercing na Língua", "Piercing no Queixo", "Piercing na Bochecha", "Piercing no Septo",
    "Piercing de Ouro", "Piercing de Prata", "Piercing de Cristal", "Piercing Rúnico"
  ],
  bandana: [
    "Bandana", "Bandana Vermelha", "Bandana Negra", "Bandana Azul",
    "Bandana de Pirata", "Bandana de Ninja", "Bandana de Mercenário", "Bandana de Ladrão",
    "Bandana de Explorador", "Bandana de Deserto", "Bandana de Selva", "Bandana de Montanha"
  ],
  venda: [
    "Venda", "Venda de Tecido", "Venda de Couro", "Venda de Seda",
    "Venda Mística", "Venda de Cegueira", "Venda de Meditação", "Venda de Xamã",
    "Venda de Profecia", "Venda de Visão", "Venda de Luz", "Venda das Trevas"
  ],
  monoculo: [
    "Monóculo", "Monóculo de Ouro", "Monóculo de Prata", "Monóculo de Cobre",
    "Monóculo de Precisão", "Monóculo de Alquimista", "Monóculo de Inventor", "Monóculo de Espião",
    "Monóculo Mágico", "Monóculo de Detecção", "Monóculo de Verdade", "Monóculo de Ilusão"
  ],
  tatuagem: [
    "Tatuagem", "Tatuagem Tribal", "Tatuagem Rúnica", "Tatuagem de Dragão",
    "Tatuagem de Fênix", "Tatuagem de Lobo", "Tatuagem de Serpente", "Tatuagem de Tigre",
    "Tatuagem Mística", "Tatuagem Mágica", "Tatuagem de Clã", "Tatuagem de Guilda"
  ],
};

const EFEITOS_ROSTO = [
  "+5% Precisão", "+3% Chance de crítico", "+10% Dano de habilidades",
  "+5% Velocidade de conjuração", "+3% Esquiva", "+5% Resistência a medo",
  "+10% Dano pelas costas", "+5% Camuflagem", "+3% Intimidação",
  "+5% Carisma", "+10% Visão noturna", "+5% Detecção de armadilhas"
];

// ==================== FUNÇÕES DE GERAÇÃO ====================

function generateName(
  type: string,
  tier: EquipmentBase["tier"],
  nomes: string[]
): string {
  const mult = TIER_MULTIPLIERS[tier].statMult;
  const nomeBase = nomes[Math.floor(Math.random() * nomes.length)];
  
  let nomeFinal = nomeBase;
  
  // Adicionar prefixo baseado no tier
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
  
  // Adicionar sufixo
  if (Math.random() > 0.3) {
    if (Math.random() > 0.5) {
      nomeFinal += ` ${SUFIXOS_MATERIAL[Math.floor(Math.random() * SUFIXOS_MATERIAL.length)]}`;
    } else {
      nomeFinal += ` ${SUFIXOS_ORIGEM[Math.floor(Math.random() * SUFIXOS_ORIGEM.length)]}`;
    }
  }
  
  return nomeFinal;
}

// Gerar brinco
export function generateEarrings(
  type: EarringsType,
  tier: EquipmentBase["tier"],
  level: number,
  setName?: string
): EquipmentBase {
  const mult = TIER_MULTIPLIERS[tier].statMult;
  const nome = generateName(type, tier, NOMES_BRINCOS[type]);
  const passiveEffect = EFEITOS_BRINCOS[Math.floor(Math.random() * EFEITOS_BRINCOS.length)];
  
  const icons: Record<EarringsType, string> = {
    brinco: "💎", pendente: "📿", argola: "⭕", plug: "🔘", alargador: "⏺️", corrente: "⛓️"
  };
  
  return {
    id: `earrings_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: nome,
    slot: "earrings",
    type,
    tier,
    level,
    atkF: Math.floor(2 * mult * (1 + level * 0.05)),
    atkM: Math.floor(3 * mult * (1 + level * 0.05)),
    def: 0,
    armor: 0,
    magicRes: Math.floor(3 * mult * (1 + level * 0.05)),
    hp: Math.floor(5 * mult * (1 + level * 0.1)),
    mp: Math.floor(10 * mult),
    critRate: 0.02 * mult,
    critDmg: 1 + (0.05 * mult),
    atkSpeed: 0.02 * mult,
    dodge: 0.01 * mult,
    passiveEffect,
    icon: icons[type],
    color: TIER_MULTIPLIERS[tier].color,
    setName,
  };
}

// Gerar colar
export function generateNecklace(
  type: NecklaceType,
  tier: EquipmentBase["tier"],
  level: number,
  setName?: string
): EquipmentBase {
  const mult = TIER_MULTIPLIERS[tier].statMult;
  const nome = generateName(type, tier, NOMES_COLARES[type]);
  const passiveEffect = EFEITOS_COLARES[Math.floor(Math.random() * EFEITOS_COLARES.length)];
  
  const icons: Record<NecklaceType, string> = {
    colar: "📿", amuleto: "🧿", medalhao: "🏅", gargantilha: "⛓️", rosario: "📿", pingente: "💍"
  };
  
  return {
    id: `necklace_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: nome,
    slot: "necklace",
    type,
    tier,
    level,
    atkF: 0,
    atkM: Math.floor(2 * mult * (1 + level * 0.05)),
    def: Math.floor(2 * mult * (1 + level * 0.05)),
    armor: 0,
    magicRes: Math.floor(5 * mult * (1 + level * 0.05)),
    hp: Math.floor(15 * mult * (1 + level * 0.1)),
    mp: Math.floor(20 * mult),
    critRate: 0,
    critDmg: 1,
    atkSpeed: 0,
    dodge: 0,
    passiveEffect,
    icon: icons[type],
    color: TIER_MULTIPLIERS[tier].color,
    setName,
  };
}

// Gerar item de rosto
export function generateFace(
  type: FaceType,
  tier: EquipmentBase["tier"],
  level: number,
  setName?: string
): EquipmentBase {
  const mult = TIER_MULTIPLIERS[tier].statMult;
  const nome = generateName(type, tier, NOMES_ROSTO[type]);
  const passiveEffect = EFEITOS_ROSTO[Math.floor(Math.random() * EFEITOS_ROSTO.length)];
  
  const icons: Record<FaceType, string> = {
    mascara: "🎭", oculos: "👓", piercing: "💎", bandana: "🧣", venda: "👁️", monoculo: "🔍", tatuagem: "✨"
  };
  
  return {
    id: `face_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: nome,
    slot: "face",
    type,
    tier,
    level,
    atkF: Math.floor(3 * mult * (1 + level * 0.05)),
    atkM: Math.floor(2 * mult * (1 + level * 0.05)),
    def: Math.floor(2 * mult * (1 + level * 0.05)),
    armor: Math.floor(1 * mult * (1 + level * 0.05)),
    magicRes: Math.floor(2 * mult * (1 + level * 0.05)),
    hp: Math.floor(8 * mult * (1 + level * 0.1)),
    mp: Math.floor(5 * mult),
    critRate: 0.01 * mult,
    critDmg: 1 + (0.03 * mult),
    atkSpeed: 0.01 * mult,
    dodge: 0.02 * mult,
    passiveEffect,
    icon: icons[type],
    color: TIER_MULTIPLIERS[tier].color,
    setName,
  };
}

// Gerar pool de acessórios
export function generateAccessoriesPool(count: number = 1000): EquipmentBase[] {
  const accessories: EquipmentBase[] = [];
  const earringsTypes: EarringsType[] = ["brinco", "pendente", "argola", "plug", "alargador", "corrente"];
  const necklaceTypes: NecklaceType[] = ["colar", "amuleto", "medalhao", "gargantilha", "rosario", "pingente"];
  const faceTypes: FaceType[] = ["mascara", "oculos", "piercing", "bandana", "venda", "monoculo", "tatuagem"];
  const tiers: EquipmentBase["tier"][] = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS"];
  
  for (let i = 0; i < count; i++) {
    const slot = Math.floor(Math.random() * 3);
    const tier = tiers[Math.floor(Math.random() * tiers.length)];
    const level = Math.floor(Math.random() * 100) + 1;
    
    switch (slot) {
      case 0:
        accessories.push(generateEarrings(earringsTypes[Math.floor(Math.random() * earringsTypes.length)], tier, level));
        break;
      case 1:
        accessories.push(generateNecklace(necklaceTypes[Math.floor(Math.random() * necklaceTypes.length)], tier, level));
        break;
      case 2:
        accessories.push(generateFace(faceTypes[Math.floor(Math.random() * faceTypes.length)], tier, level));
        break;
    }
  }
  
  return accessories;
}

// Exportar tudo
export * from "./base";
