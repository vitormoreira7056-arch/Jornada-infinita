// Sistema de Capas - 6000+ variações
import { EquipmentBase, CapeType, TIER_MULTIPLIERS } from "./base";

// Prefixos
const PREFIXOS = {
  comum: ["", "Simples", "Básica", "Comum", "Leve", "Pesada"],
  raro: ["Refinada", "Trabalhada", "Ornada", "Bordada", "Decorada", "Elegante"],
  epico: ["Mística", "Arcana", "Encantada", "Rúnica", "Mágica", "Sobrenatural"],
  lendario: ["Lendária", "Épica", "Divina", "Mítica", "Primordial", "Cósmica"],
  unico: ["Única", "Relíquia", "Artefato", "Eterna", "Ancestral", "Infinita"],
};

// Sufixos
const SUFIXOS_MATERIAL = [
  "de Lã", "de Algodão", "de Seda", "de Veludo", "de Couro",
  "de Pele", "de Escamas", "de Penas", "de Tecido Mágico", "de Sombra",
  "de Luz", "de Gelo", "de Fogo", "de Vento", "de Natureza"
];

const SUFIXOS_ORIGEM = [
  "do Rei", "da Rainha", "do Lorde", "do Cavaleiro", "do Mago",
  "do Caçador", "do Ladrão", "do Assassino", "do Paladino", "do Bárbaro",
  "do Druida", "do Bruxo", "do Clérigo", "do Monge", "do Bardo"
];

// Nomes por tipo
const NOMES_CAPAS: Record<CapeType, string[]> = {
  capa: [
    "Capa", "Capa Curta", "Capa Longa", "Capa de Viagem", "Capa de Aventura",
    "Capa de Explorador", "Capa de Mercenário", "Capa de Viajante", "Capa de Combate",
    "Capa de Proteção", "Capa de Camuflagem", "Capa de Manto"
  ],
  capa_real: [
    "Capa Real", "Capa de Coroação", "Capa de Corte", "Capa de Gala", "Capa de Cerimônia",
    "Capa de Nobre", "Capa de Duque", "Capa de Conde", "Capa de Marquês", "Capa de Visconde",
    "Capa de Barão", "Capa de Cavaleiro Real"
  ],
  capa_sombria: [
    "Capa das Sombras", "Capa Sombria", "Capa de Stealth", "Capa de Infiltração", "Capa de Assassino",
    "Capa de Ladrão", "Capa de Espião", "Capa de Ninja", "Capa de Noite", "Capa de Trevas",
    "Capa de Penumbra", "Capa de Eclipse"
  ],
  capa_elfica: [
    "Capa Élfica", "Capa de Elfo", "Capa de Floresta", "Capa de Natureza", "Capa de Folhas",
    "Capa de Vento", "Capa de Luz", "Capa de Lua", "Capa de Estrelas", "Capa de Aurora",
    "Capa de Druida", "Capa de Xamã"
  ],
  capa_guilda: [
    "Capa de Guilda", "Capa de Mestre", "Capa de Grão-Mestre", "Capa de Oficial", "Capa de Veterano",
    "Capa de Recruta", "Capa de Iniciado", "Capa de Especialista", "Capa de Herói", "Capa de Lenda",
    "Capa de Campeão", "Capa de Conquistador"
  ],
  capa_gelo: [
    "Capa de Gelo", "Capa Gélida", "Capa de Neve", "Capa de Inverno", "Capa de Cristal",
    "Capa de Gelo Eterno", "Capa de Nevasca", "Capa de Tundra", "Capa de Glacial", "Capa de Frio",
    "Capa de Yeti", "Capa de Lobo Branco"
  ],
  capa_fogo: [
    "Capa de Fogo", "Capa Flamejante", "Capa de Chamas", "Capa de Brasas", "Capa de Magma",
    "Capa de Fogo Eterno", "Capa de Fênix", "Capa de Salamandra", "Capa de Inferno", "Capa de Vulcão",
    "Capa de Dragão de Fogo", "Capa de Ifrit"
  ],
  capa_trovao: [
    "Capa de Trovão", "Capa Elétrica", "Capa de Raios", "Capa de Tempestade", "Capa de Nuvem",
    "Capa de Trovoada", "Capa de Tempestade Eterna", "Capa de Thor", "Capa de Zeus", "Capa de Raios Divinos",
    "Capa de Pássaro Trovão", "Capa de Kirin"
  ],
  capa_natureza: [
    "Capa de Natureza", "Capa Verde", "Capa de Folhas", "Capa de Flores", "Capa de Cipós",
    "Capa de Musgo", "Capa de Árvore", "Capa de Broto", "Capa de Semente", "Capa de Vida",
    "Capa de Crescimento", "Capa de Renovação"
  ],
  capa_vazio: [
    "Capa do Vazio", "Capa de Abismo", "Capa de Nada", "Capa de Escuridão Eterna", "Capa de Vazio Cósmico",
    "Capa de Buraco Negro", "Capa de Antimatéria", "Capa de Entropia", "Capa de Caos", "Capa de Destruição",
    "Capa de Oblívio", "Capa de Aniquilação"
  ],
  capa_demoniaca: [
    "Capa Demoníaca", "Capa de Demônio", "Capa de Inferno", "Capa de Fogo do Inferno", "Capa de Enxofre",
    "Capa de Diabo", "Capa de Imp", "Capa de Succubus", "Capa de Incubus", "Capa de Balrog",
    "Capa de Pit Fiend", "Capa de Archdevil"
  ],
  capa_angelical: [
    "Capa Angelical", "Capa de Anjo", "Capa de Arcanjo", "Capa de Serafim", "Capa de Querubim",
    "Capa de Luz Divina", "Capa de Asas", "Capa de Plumas", "Capa de Ouro", "Capa de Prata",
    "Capa de Santidade", "Capa de Pureza"
  ],
  capa_dragonica: [
    "Capa Dracônica", "Capa de Dragão", "Capa de Escamas", "Capa de Asas de Dragão", "Capa de Fogo de Dragão",
    "Capa de Gelo de Dragão", "Capa de Trovão de Dragão", "Capa de Veneno de Dragão", "Capa de Sombra de Dragão",
    "Capa de Luz de Dragão", "Capa de Wyrm", "Capa de Wyvern"
  ],
  capa_fantasma: [
    "Capa Fantasma", "Capa Espectral", "Capa de Fantasma", "Capa de Espírito", "Capa de Alma",
    "Capa de Ectoplasma", "Capa de Aparição", "Capa de Espectro", "Capa de Sombra", "Capa de Wraith",
    "Capa de Banshee", "Capa de Lich"
  ],
  capa_manto: [
    "Manto", "Manto Longo", "Manto de Mago", "Manto de Bruxo", "Manto de Feiticeiro",
    "Manto de Sábio", "Manto de Mestre", "Manto de Ancião", "Manto de Arquimago", "Manto de Mago Supremo",
    "Manto de Runas", "Manto de Estrelas"
  ],
};

// 50+ Efeitos passivos para capas
const EFEITOS_CAPAS = [
  // Defesa
  "+10% Defesa", "+8% Armadura", "+10% Resistência mágica", "+5% Redução de dano",
  "+15% Resistência a fogo", "+15% Resistência a gelo", "+15% Resistência a trovão",
  "+15% Resistência a veneno", "+10% Resistência a todos os elementos",
  
  // Vida/Mana
  "+10% HP máximo", "+5% Regeneração de HP", "+10% Cura recebida",
  "+20% Resistência a sangramento", "+20% Resistência a veneno",
  
  // Combate
  "+5% Esquiva", "+3% Bloqueio", "+5% Aparar", "+10% Resistência a knockback",
  "Imunidade a atordoamento", "Imunidade a lentidão",
  
  // Movimento
  "+10% Velocidade de movimento", "+15% Velocidade de corrida", "+5% Velocidade de ataque",
  "Possibilidade de planar", "Queda suave", "+20% Altura de pulo",
  
  // Stealth
  "+10% Camuflagem", "+15% Furtividade", "Reduz detecção de inimigos em 20%",
  "+10% Dano pelas costas", "+5% Chance de esquiva em áreas escuras",
  
  // Clima/Ambiente
  "Imunidade a clima frio", "Imunidade a clima quente", "Respiração subaquática",
  "Resistência a radiação", "Resistência a pressão",
  
  // Especiais
  "Deixa rastro de fogo", "Deixa rastro de gelo", "Deixa rastro de veneno",
  "Brilha no escuro", "Muda de cor", "Resiste a rasgos"
];

// Gerar nome
function generateName(type: CapeType, tier: EquipmentBase["tier"]): string {
  const mult = TIER_MULTIPLIERS[tier].statMult;
  const nomes = NOMES_CAPAS[type];
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
  
  return nomeFinal;
}

// Gerar capa
export function generateCape(
  type: CapeType,
  tier: EquipmentBase["tier"],
  level: number,
  setName?: string
): EquipmentBase {
  const mult = TIER_MULTIPLIERS[tier].statMult;
  const nome = generateName(type, tier);
  const passiveEffect = EFEITOS_CAPAS[Math.floor(Math.random() * EFEITOS_CAPAS.length)];
  
  const icons: Record<CapeType, string> = {
    capa: "🦸", capa_real: "👑", capa_sombria: "🥷", capa_elfica: "🧝",
    capa_guilda: "🏛️", capa_gelo: "❄️", capa_fogo: "🔥", capa_trovao: "⚡",
    capa_natureza: "🌿", capa_vazio: "🌑", capa_demoniaca: "😈", capa_angelical: "😇",
    capa_dragonica: "🐉", capa_fantasma: "👻", capa_manto: "🧙"
  };
  
  return {
    id: `cape_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: nome,
    slot: "cape",
    type,
    tier,
    level,
    atkF: 0,
    atkM: Math.floor(2 * mult * (1 + level * 0.05)),
    def: Math.floor(5 * mult * (1 + level * 0.05)),
    armor: Math.floor(8 * mult * (1 + level * 0.05)),
    magicRes: Math.floor(5 * mult * (1 + level * 0.05)),
    hp: Math.floor(20 * mult * (1 + level * 0.1)),
    mp: Math.floor(5 * mult),
    critRate: 0,
    critDmg: 1,
    atkSpeed: 0,
    dodge: 0.03 * mult,
    passiveEffect,
    icon: icons[type],
    color: TIER_MULTIPLIERS[tier].color,
    setName,
  };
}

// Gerar pool de capas
export function generateCapesPool(count: number = 1000): EquipmentBase[] {
  const capes: EquipmentBase[] = [];
  const capeTypes: CapeType[] = [
    "capa", "capa_real", "capa_sombria", "capa_elfica", "capa_guilda",
    "capa_gelo", "capa_fogo", "capa_trovao", "capa_natureza", "capa_vazio",
    "capa_demoniaca", "capa_angelical", "capa_dragonica", "capa_fantasma", "capa_manto"
  ];
  const tiers: EquipmentBase["tier"][] = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS"];
  
  for (let i = 0; i < count; i++) {
    const type = capeTypes[Math.floor(Math.random() * capeTypes.length)];
    const tier = tiers[Math.floor(Math.random() * tiers.length)];
    const level = Math.floor(Math.random() * 100) + 1;
    capes.push(generateCape(type, tier, level));
  }
  
  return capes;
}
