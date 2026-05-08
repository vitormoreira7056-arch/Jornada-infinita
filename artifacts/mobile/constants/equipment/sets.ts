// Sistema de Sets de Equipamento
// Bônus de coleção completa quando todos os itens do set são equipados

import { EquipmentBase } from "./base";

export interface SetBonus {
  requiredPieces: number;
  description: string;
  stats: {
    atkF?: number;
    atkM?: number;
    def?: number;
    armor?: number;
    magicRes?: number;
    hp?: number;
    mp?: number;
    critRate?: number;
    critDmg?: number;
    atkSpeed?: number;
    dodge?: number;
  };
  specialEffect?: string;
}

export interface EquipmentSet {
  id: string;
  name: string;
  description: string;
  pieces: {
    mainHand?: string;
    offHand?: string;
    head?: string;
    chest?: string;
    legs?: string;
    feet?: string;
  };
  bonuses: SetBonus[];
  theme: "warrior" | "mage" | "rogue" | "ranger" | "paladin" | "dark" | "nature" | "elemental";
  minLevel: number;
  tier: EquipmentBase["tier"];
}

// Sets de Equipamento
export const EQUIPMENT_SETS: EquipmentSet[] = [
  // Tier F-E: Sets Iniciais
  {
    id: "set_apprentice",
    name: "Conjunto do Aprendiz",
    description: "Equipamento básico para aventureiros iniciantes.",
    pieces: { head: "Capuz do Aprendiz", chest: "Robe do Aprendiz", legs: "Calças do Aprendiz", feet: "Sandálias do Aprendiz" },
    bonuses: [
      { requiredPieces: 2, description: "+5 MP máximo", stats: { mp: 5 } },
      { requiredPieces: 4, description: "+10% regeneração de MP", stats: { mp: 10 }, specialEffect: "Regenera 1 MP/s adicional" },
    ],
    theme: "mage",
    minLevel: 1,
    tier: "F",
  },
  {
    id: "set_recruit",
    name: "Conjunto do Recruta",
    description: "Armadura básica de treinamento militar.",
    pieces: { head: "Capacete do Recruta", chest: "Armadura do Recruta", legs: "Calças do Recruta", feet: "Botas do Recruta" },
    bonuses: [
      { requiredPieces: 2, description: "+10 HP máximo", stats: { hp: 10 } },
      { requiredPieces: 4, description: "+5 defesa", stats: { def: 5, armor: 3 }, specialEffect: "Reduz dano recebido em 3%" },
    ],
    theme: "warrior",
    minLevel: 1,
    tier: "F",
  },
  {
    id: "set_hunter",
    name: "Conjunto do Caçador",
    description: "Vestimentas leves para rastreamento e caça.",
    pieces: { head: "Capuz do Caçador", chest: "Casaco do Caçador", legs: "Calças do Caçador", feet: "Botas do Caçador" },
    bonuses: [
      { requiredPieces: 2, description: "+3% precisão", stats: { critRate: 0.03 } },
      { requiredPieces: 4, description: "+10% dano a animais", stats: { atkF: 3, atkM: 1 }, specialEffect: "Rastreia inimigos em 10m" },
    ],
    theme: "ranger",
    minLevel: 5,
    tier: "E",
  },
  
  // Tier D-C: Sets Intermediários
  {
    id: "set_iron_will",
    name: "Conjunto da Vontade de Ferro",
    description: "Armadura reforçada para guerreiros resistentes.",
    pieces: { head: "Elmo de Ferro", chest: "Armadura de Placas", legs: "Grevas de Ferro", feet: "Grevas de Pés" },
    bonuses: [
      { requiredPieces: 2, description: "+15 defesa", stats: { def: 15, armor: 10 } },
      { requiredPieces: 3, description: "+30 HP", stats: { hp: 30 } },
      { requiredPieces: 4, description: "Vontade de Ferro: Imunidade a atordoamento", stats: { def: 10 }, specialEffect: "Não pode ser atordoado" },
    ],
    theme: "warrior",
    minLevel: 15,
    tier: "D",
  },
  {
    id: "set_arcane_student",
    name: "Conjunto do Estudante Arcano",
    description: "Vestes mágicas para aprendizes de magia avançada.",
    pieces: { head: "Coroa Arcana", chest: "Robe Arcano", legs: "Saia Arcana", feet: "Sandálias Rúnicas" },
    bonuses: [
      { requiredPieces: 2, description: "+20 MP", stats: { mp: 20 } },
      { requiredPieces: 3, description: "+10 ataque mágico", stats: { atkM: 10 } },
      { requiredPieces: 4, description: "Sabedoria Arcana: -10% custo de mana", stats: { atkM: 5, mp: 10 }, specialEffect: "Habilidades custam 10% menos mana" },
    ],
    theme: "mage",
    minLevel: 15,
    tier: "D",
  },
  {
    id: "set_shadow_walker",
    name: "Conjunto do Caminhante das Sombras",
    description: "Armadura leve para assassinos e ladrões.",
    pieces: { head: "Máscara Sombria", chest: "Colete de Couro", legs: "Calças de Ladrão", feet: "Sapatos Silenciosos" },
    bonuses: [
      { requiredPieces: 2, description: "+5% esquiva", stats: { dodge: 0.05 } },
      { requiredPieces: 3, description: "+10% dano pelas costas", stats: { atkF: 5 } },
      { requiredPieces: 4, description: "Sombra: Invisibilidade por 3s ao esquivar", stats: { dodge: 0.03 }, specialEffect: "Fica invisível por 3 segundos após esquivar com sucesso" },
    ],
    theme: "rogue",
    minLevel: 20,
    tier: "C",
  },
  {
    id: "set_forest_guardian",
    name: "Conjunto do Guardião da Floresta",
    description: "Armadura feita de materiais naturais, abençoada pelos espíritos.",
    pieces: { head: "Coroa de Folhas", chest: "Túnica da Natureza", legs: "Saia de Ervas", feet: "Sandálias de Cipó" },
    bonuses: [
      { requiredPieces: 2, description: "+15 HP", stats: { hp: 15 } },
      { requiredPieces: 3, description: "+5 regeneração HP/s", stats: { hp: 10 } },
      { requiredPieces: 4, description: "Bênção da Natureza: Cura 2% HP/s", stats: { hp: 20, mp: 10 }, specialEffect: "Regenera 2% do HP máximo por segundo" },
    ],
    theme: "nature",
    minLevel: 20,
    tier: "C",
  },
  
  // Tier B-A: Sets Avançados
  {
    id: "set_dragon_slayer",
    name: "Conjunto do Matador de Dragões",
    description: "Armadura forjada com escamas de dragão, imbuída com poder dracônico.",
    pieces: { head: "Elmo de Escamas", chest: "Armadura Dracônica", legs: "Grevas de Dragão", feet: "Botas de Escamas" },
    bonuses: [
      { requiredPieces: 2, description: "+20 defesa, +10 resistência mágica", stats: { def: 20, magicRes: 10 } },
      { requiredPieces: 3, description: "+50 HP, +15 ataque físico", stats: { hp: 50, atkF: 15 } },
      { requiredPieces: 4, description: "Alma de Dragão: +30% resistência a fogo", stats: { def: 15, hp: 30 }, specialEffect: "Imunidade a queimadura e +30% resistência a fogo" },
    ],
    theme: "warrior",
    minLevel: 35,
    tier: "B",
  },
  {
    id: "set_storm_caller",
    name: "Conjunto do Invocador de Tempestades",
    description: "Vestes que canalizam o poder dos céus.",
    pieces: { head: "Coroa de Raios", chest: "Robe da Tempestade", legs: "Saia de Vento", feet: "Sandálias de Trovão" },
    bonuses: [
      { requiredPieces: 2, description: "+30 MP, +15 ataque mágico", stats: { mp: 30, atkM: 15 } },
      { requiredPieces: 3, description: "+20% dano elétrico", stats: { atkM: 20 } },
      { requiredPieces: 4, description: "Ira da Tempestade: Ataques têm 20% chance de lançar raio", stats: { atkM: 15, mp: 20 }, specialEffect: "20% chance de lançar um raio ao atacar (dano elétrico adicional)" },
    ],
    theme: "elemental",
    minLevel: 35,
    tier: "B",
  },
  {
    id: "set_paladin",
    name: "Conjunto do Paladino",
    description: "Armadura sagrada para campeões da luz.",
    pieces: { head: "Elmo Sagrado", chest: "Armadura de Prata", legs: "Grevas de Luz", feet: "Botas Sagradas" },
    bonuses: [
      { requiredPieces: 2, description: "+25 defesa, +15 resistência mágica", stats: { def: 25, magicRes: 15 } },
      { requiredPieces: 3, description: "+40 HP, +20 MP", stats: { hp: 40, mp: 20 } },
      { requiredPieces: 4, description: "Proteção Divina: Cura 5% HP ao bloquear", stats: { def: 15, magicRes: 10 }, specialEffect: "Ao bloquear um ataque, cura 5% do HP máximo" },
    ],
    theme: "paladin",
    minLevel: 40,
    tier: "A",
  },
  {
    id: "set_night_blade",
    name: "Conjunto da Lâmina Noturna",
    description: "Armadura das sombras para mestres assassinos.",
    pieces: { head: "Máscara da Noite", chest: "Colete das Sombras", legs: "Calças de Ébano", feet: "Sapatos do Silêncio" },
    bonuses: [
      { requiredPieces: 2, description: "+8% esquiva, +10 ataque físico", stats: { dodge: 0.08, atkF: 10 } },
      { requiredPieces: 3, description: "+20% dano crítico", stats: { critDmg: 0.2 } },
      { requiredPieces: 4, description: "Morte Súbita: +50% dano pelas costas", stats: { atkF: 15, critRate: 0.05 }, specialEffect: "Dano pelas costas aumentado em 50%" },
    ],
    theme: "rogue",
    minLevel: 40,
    tier: "A",
  },
  
  // Tier S: Sets Épicos
  {
    id: "set_ancient_king",
    name: "Conjunto do Rei Antigo",
    description: "Armadura lendária de um rei esquecido, forjada em eras passadas.",
    pieces: { head: "Coroa do Rei", chest: "Armadura Real", legs: "Grevas de Ouro", feet: "Botas do Conquistador" },
    bonuses: [
      { requiredPieces: 2, description: "+30 defesa, +20 armadura", stats: { def: 30, armor: 20 } },
      { requiredPieces: 3, description: "+60 HP, +20 ataque físico", stats: { hp: 60, atkF: 20 } },
      { requiredPieces: 4, description: "Autoridade Real: +15% todos os atributos", stats: { atkF: 15, def: 15, hp: 40, mp: 20 }, specialEffect: "Todos os atributos aumentados em 15%" },
    ],
    theme: "warrior",
    minLevel: 60,
    tier: "S",
  },
  {
    id: "set_archmage",
    name: "Conjunto do Arquimago",
    description: "Vestes de um mago de poder inimaginável.",
    pieces: { head: "Tiara do Arquimago", chest: "Robe do Infinito", legs: "Saia de Estrelas", feet: "Sandálias Etéreas" },
    bonuses: [
      { requiredPieces: 2, description: "+50 MP, +25 ataque mágico", stats: { mp: 50, atkM: 25 } },
      { requiredPieces: 3, description: "+20% dano mágico, -15% custo de mana", stats: { atkM: 20 } },
      { requiredPieces: 4, description: "Poder do Infinito: Habilidades não custam mana por 5s a cada 60s", stats: { atkM: 25, mp: 30 }, specialEffect: "A cada 60 segundos, habilidades não custam mana por 5 segundos" },
    ],
    theme: "mage",
    minLevel: 60,
    tier: "S",
  },
  {
    id: "set_demon_hunter",
    name: "Conjunto do Caçador de Demônios",
    description: "Armadura forjada para enfrentar as criaturas do abismo.",
    pieces: { head: "Elmo do Caçador", chest: "Armadura de Caçador", legs: "Grevas de Caçador", feet: "Botas de Caçador" },
    bonuses: [
      { requiredPieces: 2, description: "+20 ataque físico, +10 ataque mágico", stats: { atkF: 20, atkM: 10 } },
      { requiredPieces: 3, description: "+30% dano a demônios", stats: { atkF: 15, atkM: 10 } },
      { requiredPieces: 4, description: "Caçador de Demônios: +50% dano a criaturas das trevas", stats: { atkF: 25, def: 15 }, specialEffect: "Dano aumentado em 50% contra demônios e mortos-vivos" },
    ],
    theme: "dark",
    minLevel: 65,
    tier: "S",
  },
  
  // Tier SS: Sets Lendários
  {
    id: "set_celestial",
    name: "Conjunto Celestial",
    description: "Armadura abençoada pelos próprios deuses.",
    pieces: { head: "Elmo Celestial", chest: "Armadura Divina", legs: "Grevas de Luz", feet: "Botas de Anjo" },
    bonuses: [
      { requiredPieces: 2, description: "+40 defesa, +30 resistência mágica", stats: { def: 40, magicRes: 30 } },
      { requiredPieces: 3, description: "+80 HP, +50 MP, +20 todos ataques", stats: { hp: 80, mp: 50, atkF: 20, atkM: 20 } },
      { requiredPieces: 4, description: "Proteção Divina: Revive com 30% HP uma vez por dia", stats: { def: 25, hp: 50, mp: 30 }, specialEffect: "Ao morrer, revive instantaneamente com 30% do HP máximo (1 vez por dia)" },
    ],
    theme: "paladin",
    minLevel: 80,
    tier: "SS",
  },
  {
    id: "set_void_walker",
    name: "Conjunto do Caminhante do Vazio",
    description: "Vestes que existem entre dimensões, tocando o vazio entre mundos.",
    pieces: { head: "Máscara do Vazio", chest: "Robe do Abismo", legs: "Saia de Trevas", feet: "Botas Etéreas" },
    bonuses: [
      { requiredPieces: 2, description: "+15% esquiva, +30 ataque mágico", stats: { dodge: 0.15, atkM: 30 } },
      { requiredPieces: 3, description: "+25% dano das trevas, +20 MP", stats: { atkM: 25, mp: 20 } },
      { requiredPieces: 4, description: "Forma do Vazio: 30% chance de ignorar dano", stats: { dodge: 0.1, atkM: 20 }, specialEffect: "30% chance de fazer qualquer ataque inimigo atravessar você sem causar dano" },
    ],
    theme: "dark",
    minLevel: 80,
    tier: "SS",
  },
  {
    id: "set_elemental_lord",
    name: "Conjunto do Senhor Elemental",
    description: "Armadura que domina os quatro elementos primordiais.",
    pieces: { head: "Coroa Elemental", chest: "Armadura de Elementos", legs: "Grevas Primordiais", feet: "Botas de Fênix" },
    bonuses: [
      { requiredPieces: 2, description: "+30 ataque mágico, +20 resistência elemental", stats: { atkM: 30, magicRes: 20 } },
      { requiredPieces: 3, description: "+30% dano elemental (fogo, gelo, raio)", stats: { atkM: 30 } },
      { requiredPieces: 4, description: "Mestre dos Elementos: Ataques adicionam dano elemental aleatório", stats: { atkM: 25, atkF: 15 }, specialEffect: "Cada ataque adiciona dano elemental aleatório (fogo, gelo ou raio)" },
    ],
    theme: "elemental",
    minLevel: 85,
    tier: "SS",
  },
  
  // Tier SSS: Sets Míticos
  {
    id: "set_immortal",
    name: "Conjunto do Imortal",
    description: "Armadura que desafia a própria morte, forjada por deuses antigos.",
    pieces: { head: "Elmo do Imortal", chest: "Armadura Eterna", legs: "Grevas Imortais", feet: "Botas do Infinito" },
    bonuses: [
      { requiredPieces: 2, description: "+50 defesa, +40 armadura", stats: { def: 50, armor: 40 } },
      { requiredPieces: 3, description: "+100 HP, +30 regeneração HP/s", stats: { hp: 100 } },
      { requiredPieces: 4, description: "Imortalidade: Não pode morrer (fica com 1 HP mínimo)", stats: { def: 30, hp: 80, armor: 20 }, specialEffect: "Não pode morrer - ao receber dano letal, fica com 1 HP (cooldown: 5 minutos)" },
    ],
    theme: "warrior",
    minLevel: 100,
    tier: "SSS",
  },
  {
    id: "set_cosmic_sage",
    name: "Conjunto do Sábio Cósmico",
    description: "Vestes que contêm o conhecimento do universo inteiro.",
    pieces: { head: "Tiara Cósmica", chest: "Robe do Universo", legs: "Saia de Galáxias", feet: "Sandálias de Estrelas" },
    bonuses: [
      { requiredPieces: 2, description: "+80 MP, +50 ataque mágico", stats: { mp: 80, atkM: 50 } },
      { requiredPieces: 3, description: "+40% dano mágico, regeneração de MP triplicada", stats: { atkM: 40 } },
      { requiredPieces: 4, description: "Poder Cósmico: Habilidades têm 50% chance de não gastar cooldown", stats: { atkM: 50, mp: 50 }, specialEffect: "50% chance de habilidades não entrarem em cooldown" },
    ],
    theme: "mage",
    minLevel: 100,
    tier: "SSS",
  },
  {
    id: "set_shadow_king",
    name: "Conjunto do Rei das Sombras",
    description: "Armadura do governante do reino das trevas.",
    pieces: { head: "Coroa das Sombras", chest: "Armadura Sombria", legs: "Grevas de Ébano", feet: "Botas da Noite Eterna" },
    bonuses: [
      { requiredPieces: 2, description: "+20% esquiva, +40 ataque físico", stats: { dodge: 0.2, atkF: 40 } },
      { requiredPieces: 3, description: "+50% dano pelas costas, +30% dano crítico", stats: { atkF: 30, critDmg: 0.3 } },
      { requiredPieces: 4, description: "Domínio das Sombras: Fica invisível após cada kill por 5s", stats: { atkF: 30, dodge: 0.1 }, specialEffect: "Ao matar um inimigo, fica invisível por 5 segundos" },
    ],
    theme: "dark",
    minLevel: 110,
    tier: "SSS",
  },
  {
    id: "set_nature_avatar",
    name: "Conjunto do Avatar da Natureza",
    description: "Armadura viva, feita da própria essência da natureza.",
    pieces: { head: "Coroa de Flores Eternas", chest: "Armadura Viva", legs: "Grevas de Raízes", feet: "Botas de Musgo" },
    bonuses: [
      { requiredPieces: 2, description: "+50 HP, +30 MP, +20 defesa", stats: { hp: 50, mp: 30, def: 20 } },
      { requiredPieces: 3, description: "+5% regeneração HP/s, +5% regeneração MP/s", stats: { hp: 30, mp: 20 } },
      { requiredPieces: 4, description: "Avatar da Natureza: Invoca espírito da natureza para lutar ao seu lado", stats: { hp: 50, def: 25, atkF: 20 }, specialEffect: "Invoca um espírito da natureza que luta ao seu lado permanentemente" },
    ],
    theme: "nature",
    minLevel: 110,
    tier: "SSS",
  },
];

// Função para verificar bônus de set ativos
export function getActiveSetBonuses(equippedItems: EquipmentBase[]): Map<string, SetBonus[]> {
  const setCounts = new Map<string, number>();
  const setPieces = new Map<string, Set<string>>();
  
  // Contar peças de cada set equipado
  for (const item of equippedItems) {
    if (item.setName) {
      setCounts.set(item.setName, (setCounts.get(item.setName) || 0) + 1);
      if (!setPieces.has(item.setName)) {
        setPieces.set(item.setName, new Set());
      }
      setPieces.get(item.setName)!.add(item.slot);
    }
  }
  
  // Verificar bônus ativos
  const activeBonuses = new Map<string, SetBonus[]>();
  
  for (const [setName, count] of setCounts) {
    const set = EQUIPMENT_SETS.find(s => s.name === setName);
    if (set) {
      const bonuses: SetBonus[] = [];
      for (const bonus of set.bonuses) {
        if (count >= bonus.requiredPieces) {
          bonuses.push(bonus);
        }
      }
      if (bonuses.length > 0) {
        activeBonuses.set(setName, bonuses);
      }
    }
  }
  
  return activeBonuses;
}

// Função para calcular stats totais incluindo bônus de set
export function calculateTotalStatsWithSets(baseStats: any, equippedItems: EquipmentBase[]): any {
  const activeBonuses = getActiveSetBonuses(equippedItems);
  const totalStats = { ...baseStats };
  
  for (const [setName, bonuses] of activeBonuses) {
    for (const bonus of bonuses) {
      for (const [stat, value] of Object.entries(bonus.stats)) {
        if (totalStats[stat] !== undefined && typeof value === 'number') {
          totalStats[stat] += value;
        }
      }
    }
  }
  
  return totalStats;
}
