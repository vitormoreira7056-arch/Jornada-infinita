// Sistema de Anéis - 20000+ variações
// 4 slots de anéis (ring1, ring2, ring3, ring4)
import { EquipmentBase, RingType, TIER_MULTIPLIERS } from "./base";

// Prefixos de qualidade
const PREFIXOS = {
  comum: ["", "Simples", "Básico", "Comum", "Ordinário", "Humilde", "Modesto"],
  raro: ["Brilhante", "Polido", "Refinado", "Trabalhado", "Decorado", "Ornado", "Gravado"],
  epico: ["Rúnico", "Encantado", "Místico", "Arcano", "Mágico", "Sobrenatural", "Etéreo"],
  lendario: ["Divino", "Épico", "Lendário", "Mítico", "Primordial", "Cósmico", "Transcendental"],
  unico: ["Único", "Relíquia", "Artefato", "Eterno", "Ancestral", "Primordial", "Infinito"],
};

// Sufixos de material
const SUFIXOS_MATERIAL = [
  "de Prata", "de Ouro", "de Platina", "de Bronze", "de Cobre",
  "de Mithril", "de Adamantita", "de Cristal", "de Obsidiana", "de Marfim",
  "de Jade", "de Rubi", "de Safira", "de Esmeralda", "de Diamante",
  "de Âmbar", "de Pérola", "de Coral", "de Ossos", "de Madeira",
  "de Ébano", "de Aço", "de Ferro", "de Titânio", "de Arcanita",
  "de Sangue", "de Sombra", "de Luz", "de Vazio", "de Alma"
];

// Sufixos de origem
const SUFIXOS_ORIGEM = [
  "do Lobo", "do Dragão", "da Águia", "da Serpente", "do Tigre",
  "do Leão", "do Urso", "da Pantera", "do Falcão", "da Coruja",
  "do Elfos", "dos Anões", "dos Orcs", "dos Trolls", "dos Gigantes",
  "do Sol", "da Lua", "das Estrelas", "do Vazio", "do Abismo",
  "da Natureza", "do Fogo", "do Gelo", "do Trovão", "da Sombra",
  "da Terra", "do Vento", "da Água", "da Vida", "da Morte"
];

// Nomes base por tipo de anel
const NOMES_ANEIS: Record<RingType, string[]> = {
  anel: [
    "Anel", "Anel de Compromisso", "Anel de Ouro", "Anel de Prata", "Anel de Platina",
    "Anel de Pedra", "Anel de Cristal", "Anel de Gema", "Anel Simples", "Anel Elegante",
    "Anel Duplo", "Anel Triplo", "Anel Entrelaçado", "Anel de Falange", "Anel de Dedo Mínimo"
  ],
  anel_selo: [
    "Anel-Selo", "Selo Real", "Selo de Guilda", "Selo de Família", "Selo de Clã",
    "Selo de Autoridade", "Selo de Comando", "Selo de Diplomata", "Selo de Embaixador",
    "Selo de Lorde", "Selo de Rei", "Selo de Imperador", "Selo de Magistrado"
  ],
  anel_sinete: [
    "Anel-Sinete", "Sinete de Cera", "Sinete Real", "Sinete de Nobre", "Sinete de Cavaleiro",
    "Sinete de Mercante", "Sinete de Ladino", "Sinete de Mago", "Sinete de Clérigo",
    "Sinete de Guilda", "Sinete de Mestre", "Sinete de Grão-Mestre"
  ],
  anel_claddagh: [
    "Anel Claddagh", "Claddagh de Amor", "Claddagh de Amizade", "Claddagh de Lealdade",
    "Claddagh Tradicional", "Claddagh Moderno", "Claddagh Antigo", "Claddagh Élfico",
    "Claddagh Anão", "Claddagh Real", "Claddagh Sagrado", "Claddagh Profano"
  ],
  anel_pois: [
    "Anel Pois", "Anel de Veneno", "Anel Tóxico", "Anel de Peçonha", "Anel de Serpente",
    "Anel de Escorpião", "Anel de Aranha", "Anel de Necromante", "Anel de Assassino",
    "Anel de Alquimista", "Anel de Herbalista", "Anel de Mestre Veneno"
  ],
  anel_sol: [
    "Anel do Sol", "Anel Solar", "Anel Radiante", "Anel de Luz", "Anel de Aurora",
    "Anel de Ocaso", "Anel de Fogo Solar", "Anel de Calor", "Anel de Verão",
    "Anel de Helios", "Anel de Apolo", "Anel de Ra"
  ],
  anel_lua: [
    "Anel da Lua", "Anel Lunar", "Anel Crescente", "Anel Minguante", "Anel Cheio",
    "Anel de Prata Lunar", "Anel de Noite", "Anel de Sono", "Anel de Sonhos",
    "Anel de Selene", "Anel de Diana", "Anel de Khonsu"
  ],
  anel_estrela: [
    "Anel da Estrela", "Anel Estelar", "Anel de Estrela Cadente", "Anel de Constelação",
    "Anel de Via Láctea", "Anel de Nebulosa", "Anel de Supernova", "Anel de Buraco Negro",
    "Anel de Cometa", "Anel de Astro", "Anel de Galáxia", "Anel de Universo"
  ],
  anel_dragao: [
    "Anel do Dragão", "Anel Dracônico", "Anel de Escama", "Anel de Garra", "Anel de Chama",
    "Anel de Gelo", "Anel de Trovão", "Anel de Vento", "Anel de Terra", "Anel de Veneno",
    "Anel de Dragão Ancião", "Anel de Wyrm", "Anel de Wyvern", "Anel de Hydra"
  ],
  anel_fenix: [
    "Anel da Fênix", "Anel de Renascimento", "Anel de Cinzas", "Anel de Chama Eterna",
    "Anel de Imortalidade", "Anel de Vida", "Anel de Cura", "Anel de Purificação",
    "Anel de Fogo Sagrado", "Anel de Sol Eterno", "Anel de Rejuvenescimento"
  ],
  anel_lobo: [
    "Anel do Lobo", "Anel de Alcateia", "Anel de Presa", "Anel de Uivo", "Anel de Lua",
    "Anel de Caçador", "Anel de Alfa", "Anel de Matilha", "Anel de Lobo Solitário",
    "Anel de Lobo Branco", "Anel de Lobo Negro", "Anel de Lobo Prateado"
  ],
  anel_urso: [
    "Anel do Urso", "Anel de Força", "Anel de Resistência", "Anel de Garra", "Anel de Pelagem",
    "Anel de Hibernação", "Anel de Proteção", "Anel de Urso Pardo", "Anel de Urso Negro",
    "Anel de Urso Polar", "Anel de Urso Grisalho", "Anel de Urso Ancião"
  ],
  anel_tigre: [
    "Anel do Tigre", "Anel de Listras", "Anel de Caça", "Anel de Velocidade", "Anel de Agilidade",
    "Anel de Tigre Branco", "Anel de Tigre Negro", "Anel de Tigre Dourado", "Anel de Tigre de Fogo",
    "Anel de Tigre de Gelo", "Anel de Tigre de Trovão", "Anel de Tigre Sagrado"
  ],
  anel_serpente: [
    "Anel da Serpente", "Anel de Cobra", "Anel de Víbora", "Anel de Naja", "Anel de Píton",
    "Anel de Escamas", "Anel de Veneno", "Anel de Sabedoria", "Anel de Renovação",
    "Anel de Serpente Alada", "Anel de Basilisco", "Anel de Hydra", "Anel de Jormungandr"
  ],
  anel_coruja: [
    "Anel da Coruja", "Anel de Sabedoria", "Anel de Conhecimento", "Anel de Visão", "Anel de Noite",
    "Anel de Penas", "Anel de Bico", "Anel de Coruja Branca", "Anel de Coruja Negra",
    "Anel de Coruja Dourada", "Anel de Coruja das Neves", "Anel de Coruja Anciã"
  ],
  anel_elemental: [
    "Anel Elemental", "Anel de Fogo", "Anel de Água", "Anel de Terra", "Anel de Ar",
    "Anel de Gelo", "Anel de Trovão", "Anel de Natureza", "Anel de Metal", "Anel de Luz",
    "Anel de Sombra", "Anel de Vazio", "Anel de Caos", "Anel de Ordem", "Anel de Equilíbrio"
  ],
  anel_runico: [
    "Anel Rúnico", "Anel de Runas", "Anel de Futhark", "Anel de Ogham", "Anel de Hieróglifos",
    "Anel de Alfabeto Mágico", "Anel de Sigilos", "Anel de Encantamentos", "Anel de Proteção Rúnica",
    "Anel de Poder Rúnico", "Anel de Sabedoria Rúnica", "Anel de Visão Rúnica"
  ],
  anel_magico: [
    "Anel Mágico", "Anel de Mago", "Anel de Bruxo", "Anel de Feiticeiro", "Anel de Conjurador",
    "Anel de Mana", "Anel de Arcano", "Anel de Feitiço", "Anel de Conjuração", "Anel de Canalização",
    "Anel de Foco", "Anel de Poder", "Anel de Energia", "Anel de Fluxo Mágico"
  ],
  anel_sagrado: [
    "Anel Sagrado", "Anel Divino", "Anel de Luz", "Anel de Bênção", "Anel de Proteção Sagrada",
    "Anel de Cura", "Anel de Fé", "Anel de Devoção", "Anel de Santidade", "Anel de Pureza",
    "Anel de Anjo", "Anel de Santo", "Anel de Paladino", "Anel de Clérigo", "Anel de Sacerdote"
  ],
  anel_profano: [
    "Anel Profano", "Anel das Trevas", "Anel de Sombra", "Anel de Escuridão", "Anel de Corrupção",
    "Anel de Demônio", "Anel de Diabo", "Anel de Inferno", "Anel de Abismo", "Anel de Void",
    "Anel de Necromante", "Anel de Bruxo das Trevas", "Anel de Warlock", "Anel de Cultista"
  ],
};

// 100+ Efeitos passivos para anéis
const EFEITOS_ANEIS = [
  // Dano
  "+5% Dano físico", "+5% Dano mágico", "+5% Dano elemental", "+3% Dano crítico",
  "+10% Dano contra humanoides", "+10% Dano contra bestas", "+10% Dano contra mortos-vivos",
  "+10% Dano contra demônios", "+10% Dano contra dragões", "+5% Dano de fogo",
  "+5% Dano de gelo", "+5% Dano de trovão", "+5% Dano de veneno", "+5% Dano sagrado",
  "+5% Dano sombrio", "+3% Dano verdadeiro",
  
  // Defesa
  "+5% Defesa física", "+5% Defesa mágica", "+3% Redução de dano", "+5% Armadura",
  "+5% Resistência mágica", "+10% Resistência a fogo", "+10% Resistência a gelo",
  "+10% Resistência a trovão", "+10% Resistência a veneno", "+10% Resistência sagrada",
  "+10% Resistência sombria", "+5% Resistência a todos os elementos",
  
  // Vida/Mana
  "+5% HP máximo", "+5% MP máximo", "+3% Regeneração de HP", "+3% Regeneração de MP",
  "+2% Roubo de vida", "+2% Roubo de mana", "+10% Cura recebida", "+10% Eficiência de poções",
  
  // Combate
  "+3% Chance de crítico", "+10% Dano crítico", "+3% Velocidade de ataque", "+3% Precisão",
  "+3% Esquiva", "+2% Bloqueio", "+5% Aparar", "+3% Contra-ataque",
  "+10% Dano pelas costas", "+5% Dano a distância", "+5% Dano corpo a corpo",
  
  // Utilidade
  "+5% Velocidade de movimento", "+5% Experiência ganha", "+3% Ouro encontrado",
  "+3% Chance de drop mágico", "+5% Duração de buffs", "-5% Duração de debuffs",
  "+10% Visão noturna", "+5% Detecção de armadilhas", "+5% Detecção de inimigos",
  "+3% Carisma", "+3% Sorte", "+5% Crafting speed",
  
  // Especiais
  "Revive com 10% HP uma vez por dia", "Imunidade a veneno", "Imunidade a sangramento",
  "Imunidade a queimadura", "Imunidade a congelamento", "Imunidade a atordoamento",
  "+1 Slot de habilidade", "-5% Custo de mana", "-5% Custo de stamina",
  "+10% Alcance de habilidades", "+10% Área de efeito", "+5% Duração de invocações"
];

// Gerar nome único
function generateName(type: RingType, tier: EquipmentBase["tier"]): string {
  const mult = TIER_MULTIPLIERS[tier].statMult;
  const nomes = NOMES_ANEIS[type];
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

// Gerar anel
export function generateRing(
  type: RingType,
  tier: EquipmentBase["tier"],
  level: number,
  setName?: string
): EquipmentBase {
  const mult = TIER_MULTIPLIERS[tier].statMult;
  const nome = generateName(type, tier);
  const passiveEffect = EFEITOS_ANEIS[Math.floor(Math.random() * EFEITOS_ANEIS.length)];
  
  return {
    id: `ring_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: nome,
    slot: "ring1", // Será ajustado pelo chamador
    type,
    tier,
    level,
    atkF: Math.floor(2 * mult * (1 + level * 0.05)),
    atkM: Math.floor(2 * mult * (1 + level * 0.05)),
    def: Math.floor(1 * mult * (1 + level * 0.05)),
    armor: 0,
    magicRes: Math.floor(2 * mult * (1 + level * 0.05)),
    hp: Math.floor(8 * mult * (1 + level * 0.1)),
    mp: Math.floor(8 * mult * (1 + level * 0.1)),
    critRate: 0.01 * mult,
    critDmg: 1 + (0.03 * mult),
    atkSpeed: 0.01 * mult,
    dodge: 0.01 * mult,
    passiveEffect,
    icon: "💍",
    color: TIER_MULTIPLIERS[tier].color,
    setName,
  };
}

// Gerar pool de anéis
export function generateRingsPool(count: number = 1000): EquipmentBase[] {
  const rings: EquipmentBase[] = [];
  const ringTypes: RingType[] = [
    "anel", "anel_selo", "anel_sinete", "anel_claddagh", "anel_pois",
    "anel_sol", "anel_lua", "anel_estrela", "anel_dragao", "anel_fenix",
    "anel_lobo", "anel_urso", "anel_tigre", "anel_serpente", "anel_coruja",
    "anel_elemental", "anel_runico", "anel_magico", "anel_sagrado", "anel_profano"
  ];
  const tiers: EquipmentBase["tier"][] = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS"];
  
  for (let i = 0; i < count; i++) {
    const type = ringTypes[Math.floor(Math.random() * ringTypes.length)];
    const tier = tiers[Math.floor(Math.random() * tiers.length)];
    const level = Math.floor(Math.random() * 100) + 1;
    rings.push(generateRing(type, tier, level));
  }
  
  return rings;
}

// Gerar anel para slot específico
export function generateRingForSlot(
  slot: "ring1" | "ring2" | "ring3" | "ring4",
  tier: EquipmentBase["tier"],
  level: number,
  setName?: string
): EquipmentBase {
  const ringTypes: RingType[] = [
    "anel", "anel_selo", "anel_sinete", "anel_claddagh", "anel_pois",
    "anel_sol", "anel_lua", "anel_estrela", "anel_dragao", "anel_fenix",
    "anel_lobo", "anel_urso", "anel_tigre", "anel_serpente", "anel_coruja",
    "anel_elemental", "anel_runico", "anel_magico", "anel_sagrado", "anel_profano"
  ];
  const type = ringTypes[Math.floor(Math.random() * ringTypes.length)];
  const ring = generateRing(type, tier, level, setName);
  ring.slot = slot;
  return ring;
}
