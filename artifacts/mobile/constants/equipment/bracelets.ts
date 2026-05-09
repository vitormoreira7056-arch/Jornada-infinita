// Sistema de Braceletes - 15000+ variações
import { EquipmentBase, BraceletType, TIER_MULTIPLIERS } from "./base";

// Prefixos
const PREFIXOS = {
  comum: ["", "Simples", "Básico", "Comum", "Leve", "Pesado"],
  raro: ["Refinado", "Trabalhado", "Ornado", "Decorado", "Elegante", "Resistente"],
  epico: ["Místico", "Arcano", "Encantado", "Rúnico", "Mágico", "Sobrenatural"],
  lendario: ["Lendário", "Épico", "Divino", "Mítico", "Primordial", "Cósmico"],
  unico: ["Único", "Relíquia", "Artefato", "Eterno", "Ancestral", "Infinito"],
};

// Sufixos
const SUFIXOS_MATERIAL = [
  "de Prata", "de Ouro", "de Platina", "de Bronze", "de Cobre",
  "de Mithril", "de Adamantita", "de Cristal", "de Obsidiana", "de Marfim",
  "de Jade", "de Rubi", "de Safira", "de Esmeralda", "de Diamante",
  "de Âmbar", "de Pérola", "de Coral", "de Ossos", "de Madeira",
  "de Ébano", "de Aço", "de Ferro", "de Titânio", "de Arcanita",
  "de Couro", "de Pele", "de Escamas", "de Tecido", "de Seda"
];

const SUFIXOS_ORIGEM = [
  "do Guerreiro", "do Mago", "do Caçador", "do Ladrão", "do Clérigo",
  "do Paladino", "do Bárbaro", "do Druida", "do Bruxo", "do Monge",
  "do Bardo", "do Ranger", "do Assassino", "do Necromante", "do Xamã",
  "do Sol", "da Lua", "das Estrelas", "do Vazio", "do Abismo"
];

// Nomes por tipo
const NOMES_BRACELETES: Record<BraceletType, string[]> = {
  bracelete: [
    "Bracelete", "Bracelete Simples", "Bracelete Duplo", "Bracelete Triplo", "Bracelete Largo",
    "Bracelete Fino", "Bracelete Grosso", "Bracelete de Pulso", "Bracelete de Antebraço",
    "Bracelete de Braço", "Bracelete de Canhoto", "Bracelete de Destro"
  ],
  bracelete_corrente: [
    "Bracelete de Corrente", "Corrente de Prata", "Corrente de Ouro", "Corrente de Platina",
    "Corrente Dupla", "Corrente Tripla", "Corrente Grossa", "Corrente Fina",
    "Corrente Entrelaçada", "Corrente de Elos", "Corrente de Malha", "Corrente de Escamas"
  ],
  bracelete_couro: [
    "Bracelete de Couro", "Bracelete de Pele", "Bracelete de Couro Cru", "Bracelete de Couro Tratado",
    "Bracelete de Couro de Dragão", "Bracelete de Pele de Lobo", "Bracelete de Pele de Urso",
    "Bracelete de Couro de Demônio", "Bracelete de Pele de Anjo", "Bracelete de Couro Élfico"
  ],
  bracelete_metal: [
    "Bracelete de Metal", "Bracelete de Aço", "Bracelete de Ferro", "Bracelete de Bronze",
    "Bracelete de Latão", "Bracelete de Cobre", "Bracelete de Titânio", "Bracelete de Tungstênio",
    "Bracelete de Metal Negro", "Bracelete de Metal Branco", "Bracelete de Metal Místico"
  ],
  bracelete_runico: [
    "Bracelete Rúnico", "Bracelete de Runas", "Bracelete de Futhark", "Bracelete de Ogham",
    "Bracelete de Hieróglifos", "Bracelete de Alfabeto Mágico", "Bracelete de Sigilos",
    "Bracelete de Encantamentos", "Bracelete de Proteção Rúnica", "Bracelete de Poder Rúnico"
  ],
  bracelete_magico: [
    "Bracelete Mágico", "Bracelete de Mago", "Bracelete de Bruxo", "Bracelete de Feiticeiro",
    "Bracelete de Mana", "Bracelete de Arcano", "Bracelete de Feitiço", "Bracelete de Conjuração",
    "Bracelete de Canalização", "Bracelete de Foco", "Bracelete de Poder Mágico"
  ],
  bracelete_gema: [
    "Bracelete de Gema", "Bracelete de Cristal", "Bracelete de Rubi", "Bracelete de Safira",
    "Bracelete de Esmeralda", "Bracelete de Diamante", "Bracelete de Âmbar", "Bracelete de Jade",
    "Bracelete de Ametista", "Bracelete de Topázio", "Bracelete de Opala", "Bracelete de Pérola"
  ],
  bracelete_tribal: [
    "Bracelete Tribal", "Bracelete de Clã", "Bracelete de Tribo", "Bracelete de Guerreiro",
    "Bracelete de Xamã", "Bracelete de Chefe", "Bracelete de Caçador", "Bracelete de Prova",
    "Bracelete de Iniciação", "Bracelete de Status", "Bracelete de Poder", "Bracelete Ancestral"
  ],
  pulseira: [
    "Pulseira", "Pulseira Simples", "Pulseira Delicada", "Pulseira Elegante", "Pulseira Fina",
    "Pulseira de Cordão", "Pulseira de Fio", "Pulseira de Corrente", "Pulseira de Elos",
    "Pulseira de Malha", "Pulseira de Tecido", "Pulseira de Seda"
  ],
  pulseira_perolas: [
    "Pulseira de Pérolas", "Pulseira de Pérola Negra", "Pulseira de Pérola Branca",
    "Pulseira de Pérola Rosa", "Pulseira de Pérola Dourada", "Pulseira de Pérola de Água Doce",
    "Pulseira de Pérola de Água Salgada", "Pulseira de Pérola Barroca", "Pulseira de Pérola Redonda"
  ],
  pulseira_cristais: [
    "Pulseira de Cristais", "Pulseira de Quartzo", "Pulseira de Cristal de Rocha",
    "Pulseira de Cristal Negro", "Pulseira de Cristal Branco", "Pulseira de Cristal Azul",
    "Pulseira de Cristal Vermelho", "Pulseira de Cristal Verde", "Pulseira de Cristal Amarelo"
  ],
  pulseira_ossos: [
    "Pulseira de Ossos", "Pulseira de Crânio", "Pulseira de Vértebra", "Pulseira de Costela",
    "Pulseira de Ossos de Animais", "Pulseira de Ossos de Monstros", "Pulseira de Ossos de Dragão",
    "Pulseira de Ossos de Demônio", "Pulseira de Ossos de Anjo", "Pulseira de Ossos Anciãos"
  ],
  manopla: [
    "Manopla", "Manopla de Couro", "Manopla de Metal", "Manopla de Aço", "Manopla de Ferro",
    "Manopla de Bronze", "Manopla de Mithril", "Manopla de Adamantita", "Manopla de Dragão",
    "Manopla de Demônio", "Manopla de Anjo", "Manopla Anciã"
  ],
  manopla_guerra: [
    "Manopla de Guerra", "Manopla de Batalha", "Manopla de Combate", "Manopla de Assalto",
    "Manopla de Cerco", "Manopla de Invocação", "Manopla de Conquista", "Manopla de Vitória",
    "Manopla de Glória", "Manopla de Honra", "Manopla de Coragem", "Manopla de Força"
  ],
  manopla_magica: [
    "Manopla Mágica", "Manopla de Mago", "Manopla de Arcano", "Manopla de Feitiço",
    "Manopla de Conjuração", "Manopla de Invocação", "Manopla de Elemental", "Manopla de Runas",
    "Manopla de Poder", "Manopla de Energia", "Manopla de Fluxo", "Manopla de Canalização"
  ],
  manopla_protetora: [
    "Manopla Protetora", "Manopla de Defesa", "Manopla de Proteção", "Manopla de Guarda",
    "Manopla de Escudo", "Manopla de Barreira", "Manopla de Absorção", "Manopla de Resistência",
    "Manopla de Imunidade", "Manopla de Reflexão", "Manopla de Deflexão", "Manopla de Aparo"
  ],
  luva: [
    "Luva", "Luva de Couro", "Luva de Tecido", "Luva de Lã", "Luva de Seda",
    "Luva de Algodão", "Luva Simples", "Luva Elegante", "Luva de Trabalho", "Luva de Combate"
  ],
  luva_couro: [
    "Luva de Couro", "Luva de Couro Cru", "Luva de Couro Tratado", "Luva de Couro de Boi",
    "Luva de Couro de Cervo", "Luva de Couro de Urso", "Luva de Couro de Lobo",
    "Luva de Couro de Dragão", "Luva de Couro de Demônio", "Luva de Couro de Anjo"
  ],
  luva_metal: [
    "Luva de Metal", "Luva de Aço", "Luva de Ferro", "Luva de Bronze", "Luva de Latão",
    "Luva de Cobre", "Luva de Titânio", "Luva de Mithril", "Luva de Adamantita",
    "Luva de Metal Negro", "Luva de Metal Branco", "Luva de Ouro", "Luva de Prata"
  ],
  luva_magica: [
    "Luva Mágica", "Luva de Mago", "Luva de Arcano", "Luva de Feitiço", "Luva de Conjuração",
    "Luva de Canalização", "Luva de Foco", "Luva de Poder", "Luva de Energia",
    "Luva de Fluxo", "Luva de Runas", "Luva de Elemental"
  ],
};

// 80+ Efeitos passivos para braceletes
const EFEITOS_BRACELETES = [
  // Força/Dano
  "+5% Força", "+5% Dano físico", "+3% Dano crítico", "+5% Dano corpo a corpo",
  "+3% Velocidade de ataque", "+5% Precisão", "+3% Penetração de armadura",
  "+10% Dano com armas de uma mão", "+10% Dano com armas de duas mãos",
  
  // Magia
  "+5% Inteligência", "+5% Dano mágico", "+3% Velocidade de conjuração",
  "-5% Custo de mana", "+10% Dano de feitiços elementais", "+10% Dano de feitiços arcanos",
  "+10% Dano de feitiços sagrados", "+10% Dano de feitiços sombrios",
  "+5% Duração de feitiços", "+5% Alcance de feitiços",
  
  // Defesa
  "+5% Constituição", "+5% Defesa", "+3% Bloqueio", "+5% Aparar",
  "+3% Esquiva", "+5% Armadura", "+5% Resistência mágica",
  "+10% Resistência a impacto", "+10% Resistência a corte", "+10% Resistência a perfuração",
  
  // Agilidade
  "+5% Agilidade", "+5% Destreza", "+10% Velocidade de movimento",
  "+10% Velocidade de ataque", "+5% Chance de acerto crítico",
  "+10% Dano pelas costas", "+5% Furtividade", "+5% Acrobacia",
  
  // Vida/Mana
  "+5% HP máximo", "+5% MP máximo", "+3% Regeneração de HP",
  "+3% Regeneração de MP", "+2% Roubo de vida", "+2% Roubo de mana",
  "+10% Cura recebida", "+10% Eficiência de poções",
  
  // Resistências
  "+10% Resistência a fogo", "+10% Resistência a gelo", "+10% Resistência a trovão",
  "+10% Resistência a veneno", "+10% Resistência a sangramento",
  "+10% Resistência a atordoamento", "+10% Resistência a lentidão",
  "+5% Resistência a todos os elementos",
  
  // Profissões
  "+10% Mineração", "+10% Herborismo", "+10% Couro", "+10% Alfaiataria",
  "+10% Ferraria", "+10% Encantamento", "+10% Alquimia", "+10% Culinária",
  
  // Especiais
  "Imunidade a desarmar", "Imunidade a quebrar", "Pode usar armas grandes com uma mão",
  "+1 Slot de anel", "+5% Experiência de combate", "+3% Ouro encontrado"
];

// Gerar nome
function generateName(type: BraceletType, tier: EquipmentBase["tier"]): string {
  const mult = TIER_MULTIPLIERS[tier].statMult;
  const nomes = NOMES_BRACELETES[type];
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

// Gerar bracelete
export function generateBracelet(
  type: BraceletType,
  tier: EquipmentBase["tier"],
  level: number,
  setName?: string
): EquipmentBase {
  const mult = TIER_MULTIPLIERS[tier].statMult;
  const nome = generateName(type, tier);
  const passiveEffect = EFEITOS_BRACELETES[Math.floor(Math.random() * EFEITOS_BRACELETES.length)];
  
  const icons: Record<BraceletType, string> = {
    bracelete: "🔗", bracelete_corrente: "⛓️", bracelete_couro: "🧶", bracelete_metal: "⚙️",
    bracelete_runico: "📜", bracelete_magico: "✨", bracelete_gema: "💎", bracelete_tribal: "🏺",
    pulseira: "📿", pulseira_perolas: "⚪", pulseira_cristais: "🔮", pulseira_ossos: "🦴",
    manopla: "🥊", manopla_guerra: "⚔️", manopla_magica: "🪄", manopla_protetora: "🛡️",
    luva: "🧤", luva_couro: "🧶", luva_metal: "⚙️", luva_magica: "✨"
  };
  
  return {
    id: `bracelet_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: nome,
    slot: "bracelet",
    type,
    tier,
    level,
    atkF: Math.floor(3 * mult * (1 + level * 0.05)),
    atkM: Math.floor(3 * mult * (1 + level * 0.05)),
    def: Math.floor(3 * mult * (1 + level * 0.05)),
    armor: Math.floor(2 * mult * (1 + level * 0.05)),
    magicRes: Math.floor(3 * mult * (1 + level * 0.05)),
    hp: Math.floor(10 * mult * (1 + level * 0.1)),
    mp: Math.floor(10 * mult * (1 + level * 0.1)),
    critRate: 0.02 * mult,
    critDmg: 1 + (0.05 * mult),
    atkSpeed: 0.02 * mult,
    dodge: 0.02 * mult,
    passiveEffect,
    icon: icons[type],
    color: TIER_MULTIPLIERS[tier].color,
    setName,
  };
}

// Gerar pool de braceletes
export function generateBraceletsPool(count: number = 1000): EquipmentBase[] {
  const bracelets: EquipmentBase[] = [];
  const braceletTypes: BraceletType[] = [
    "bracelete", "bracelete_corrente", "bracelete_couro", "bracelete_metal",
    "bracelete_runico", "bracelete_magico", "bracelete_gema", "bracelete_tribal",
    "pulseira", "pulseira_perolas", "pulseira_cristais", "pulseira_ossos",
    "manopla", "manopla_guerra", "manopla_magica", "manopla_protetora",
    "luva", "luva_couro", "luva_metal", "luva_magica"
  ];
  const tiers: EquipmentBase["tier"][] = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS"];
  
  for (let i = 0; i < count; i++) {
    const type = braceletTypes[Math.floor(Math.random() * braceletTypes.length)];
    const tier = tiers[Math.floor(Math.random() * tiers.length)];
    const level = Math.floor(Math.random() * 100) + 1;
    bracelets.push(generateBracelet(type, tier, level));
  }
  
  return bracelets;
}
