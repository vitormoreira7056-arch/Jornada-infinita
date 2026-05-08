// Sistema de Off-Hand - Escudos, Orbes, Grimórios, Tochas
import { EquipmentBase, OffHandType, TIER_MULTIPLIERS } from "./base";

// Prefixos
const PREFIXOS = {
  comum: ["", "Usado", "Desgastado", "Simples", "Básico"],
  raro: ["Reforçado", "Ajustado", "Equilibrado", "Refinado", "Protegido"],
  epico: ["Brilhante", "Runico", "Encantado", "Místico", "Arcano"],
  lendario: ["Divino", "Épico", "Lendário", "Mítico", "Primordial"],
  unico: ["Único", "Exclusivo", "Relíquia", "Artefato", "Eterno"],
};

// Sufixos
const SUFIXOS_MATERIAL = [
  "de Ferro", "de Aço", "de Bronze", "de Prata", "de Ouro",
  "de Mithril", "de Adamantita", "de Obsidiana", "de Cristal", "de Ossos",
  "de Madeira", "de Ébano", "de Marfim", "de Jade", "de Rubi",
  "de Safira", "de Esmeralda", "de Diamante", "de Âmbar", "de Ânima"
];

const SUFIXOS_ORIGEM = [
  "do Guardião", "do Defensor", "do Protetor", "do Cavaleiro", "do Paladino",
  "do Mago", "do Bruxo", "do Sacerdote", "do Druida", "do Explorador",
  "do Aventureiro", "do Herói", "do Campeão", "do Ancião", "do Sábio"
];

// Nomes base por tipo
const NOMES_OFFHAND: Record<OffHandType, string[]> = {
  escudo: [
    "Escudo", "Escudo de Madeira", "Escudo de Ferro", "Escudo de Aço", "Escudo de Bronze",
    "Escudo de Batalha", "Escudo de Guerra", "Escudo de Cavaleiro", "Escudo de Torre",
    "Escudo Redondo", "Escudo Oval", "Escudo de Corpo", "Broquel", "Pavês",
    "Escudo Real", "Escudo Nobre", "Escudo Sagrado", "Escudo Profano",
    "Escudo de Placas", "Escudo de Malha", "Escudo de Escamas", "Escudo de Cristal"
  ],
  orb: [
    "Orbe", "Orbe Mágico", "Orbe Arcano", "Orbe Rúnico", "Orbe Elemental",
    "Orbe de Cristal", "Orbe de Gelo", "Orbe de Fogo", "Orbe de Raio",
    "Orbe Sombrio", "Orbe Sagrado", "Orbe do Vazio", "Orbe Estelar",
    "Esfera Mágica", "Esfera Arcana", "Globo de Cristal", "Orbe Primordial",
    "Orbe de Alma", "Orbe de Sangue", "Orbe de Veneno", "Orbe de Luz"
  ],
  tocha: [
    "Tocha", "Tocha de Madeira", "Tocha de Ferro", "Tocha Mágica", "Tocha Eterna",
    "Tocha Flamejante", "Tocha Sagrada", "Tocha Profana", "Tocha de Cristal",
    "Tocha de Âmbar", "Tocha Rúnica", "Tocha do Explorador", "Tocha do Aventureiro",
    "Lanterna", "Lanterna de Metal", "Lanterna Mágica", "Lanterna Eterna",
    "Luz Portátil", "Facho", "Facho de Luz", "Braseiro Portátil"
  ],
  grimorio: [
    "Grimório", "Livro de Magias", "Livro Arcano", "Livro Rúnico", "Tomo Mágico",
    "Tomo Arcano", "Tomo Proibido", "Tomo Sagrado", "Tomo das Sombras",
    "Códice", "Códice Mágico", "Códice Arcano", "Códice Proibido",
    "Livro de Feitiços", "Livro de Encantamentos", "Livro de Runas",
    "Grimório Elemental", "Grimório Necromântico", "Grimório Divino",
    "Livro do Conhecimento", "Livro dos Segredos", "Tomo do Poder"
  ],
  lume: [
    "Lume", "Luz", "Luz Mágica", "Luz Sagrada", "Luz Protetora",
    "Brilho", "Brilho Místico", "Brilho Arcano", "Brilho Divino",
    "Fogo Fátuo", "Chama Mágica", "Chama Eterna", "Chama Sagrada",
    "Luz Interior", "Luz da Alma", "Luz da Vida", "Luz da Esperança",
    "Fagulha", "Fagulha Mágica", "Fagulha Divina", "Centelha Arcana"
  ],
  bengala: [
    "Bengala", "Bengala de Madeira", "Bengala de Ferro", "Bengala de Prata",
    "Bengala de Cristal", "Bengala Mágica", "Bengala Arcana", "Bengala Rúnica",
    "Cajado de Apoio", "Cajado de Caminhada", "Bastão de Apoio",
    "Bengala do Sábio", "Bengala do Ancião", "Bengala do Mago",
    "Bengala de Comando", "Bengala de Autoridade", "Bengala Cerimonial"
  ],
  lanterna: [
    "Lanterna", "Lanterna de Metal", "Lanterna de Bronze", "Lanterna de Prata",
    "Lanterna Mágica", "Lanterna Eterna", "Lanterna do Explorador",
    "Lanterna de Mineração", "Lanterna de Aventureiro", "Lanterna de Viagem",
    "Lampião", "Lampião de Óleo", "Lampião Mágico", "Lampião Eterno",
    "Lanterna de Cristal", "Lanterna Rúnica", "Lanterna Sagrada"
  ],
  totem: [
    "Totem", "Totem de Madeira", "Totem de Osso", "Totem de Pedra",
    "Totem Ancestral", "Totem Tribal", "Totem Xamânico", "Totem Místico",
    "Totem de Proteção", "Totem de Cura", "Totem de Força", "Totem de Sabedoria",
    "Ídolo", "Ídolo Ancestral", "Ídolo Tribal", "Ídolo Sagrado",
    "Estatueta", "Estatueta Mística", "Estatueta de Poder"
  ],
  livro: [
    "Livro", "Livro de Anotações", "Livro de Receitas", "Livro de Histórias",
    "Livro de Conhecimento", "Livro de Sabedoria", "Livro de Estratégia",
    "Diário", "Diário de Viagem", "Diário de Aventuras", "Diário Mágico",
    "Caderno", "Caderno de Anotações", "Caderno de Magias", "Caderno Arcano",
    "Manual", "Manual de Combate", "Manual de Sobrevivência", "Manual do Aventureiro"
  ],
  adaga_off: [
    "Adaga", "Punhal", "Faca", "Lâmina Oculta", "Presa", "Garra", "Agulha",
    "Estilete", "Stiletto", "Kris", "Katar", "Shiv", "Lâmina Sombria",
    "Cortadora de Sombras", "Perfuradora", "Sussurro", "Sussurro da Morte",
    "Beijo Fatal", "Mordida Venenosa", "Lâmina do Assassino", "Lâmina Parceira"
  ],
};

// Efeitos passivos por tipo
const EFEITOS_OFFHAND: Record<OffHandType, string[]> = {
  escudo: [
    "Bloqueio: +15% chance de bloquear ataques",
    "Defesa Reforçada: +10% armadura",
    "Proteção: Reduz dano recebido em 8%",
    "Escudo de Ferro: +20 defesa",
    "Barreira: Absorve 50 de dano a cada 10s",
    "Reflexão: 5% do dano bloqueado reflete no atacante"
  ],
  orb: [
    "Amplificação: +15% dano mágico",
    "Reserva de Mana: +30 MP máximo",
    "Regeneração Arcana: +3 MP/s",
    "Foco: +10% precisão mágica",
    "Canalização: -15% tempo de conjuração",
    "Potência: Habilidades mágicas têm +10% chance de crítico"
  ],
  tocha: [
    "Luz: Revela inimigos invisíveis em 5m",
    "Fogo: +10 dano de fogo nos ataques",
    "Claridade: +20% precisão em áreas escuras",
    "Aquecimento: Imunidade a congelamento",
    "Iluminação: +10% chance de encontrar itens",
    "Chama Eterna: Nunca se apaga"
  ],
  grimorio: [
    "Conhecimento: +1 nível em todas as habilidades",
    "Sabedoria Arcana: +20 MP máximo",
    "Grimório Protegido: +15 resistência mágica",
    "Aprendizado: +10% experiência ganha",
    "Memorização: -20% cooldown de habilidades",
    "Poder do Conhecimento: +15% dano de habilidades"
  ],
  lume: [
    "Luz Interior: +10 regeneração de HP/s",
    "Esperança: +5% todos os atributos",
    "Claridade Mental: Imunidade a confusão",
    "Brilho Sagrado: +15 dano sagrado",
    "Proteção de Luz: +10% resistência a escuridão",
    "Iluminação Divina: Cura aliados próximos em 2 HP/s"
  ],
  bengala: [
    "Apoio: +10% velocidade de movimento",
    "Equilíbrio: +5% esquiva",
    "Autoridade: +10 carisma (preços 5% melhores)",
    "Sabedoria do Ancião: +10% experiência ganha",
    "Comando: Aliados próximos têm +5% dano",
    "Firmeza: Imunidade a knockback"
  ],
  lanterna: [
    "Luz Orientadora: +15% precisão",
    "Explorador: +15% chance de encontrar recursos",
    "Iluminação: Revela armadilhas em 3m",
    "Aquecimento: +10 resistência a gelo",
    "Sinalizador: Aliados próximos têm +5% precisão",
    "Luz Eterna: Nunca se apaga"
  ],
  totem: [
    "Proteção Ancestral: +15 defesa",
    "Espírito Guardião: +10% HP máximo",
    "Sabedoria Tribal: +10 MP máximo",
    "Força dos Ancestrais: +10 força",
    "Bênção Xamânica: +5% regeneração de todos os recursos",
    "Vínculo Espiritual: Revive com 20% HP uma vez por dia"
  ],
  livro: [
    "Conhecimento: +10% experiência ganha",
    "Preparação: +5% dano contra todos os tipos de inimigos",
    "Estratégia: +10% dano em ataques surpresa",
    "Sobrevivência: +20 HP máximo",
    "Registro: Anota informações sobre novos inimigos",
    "Estudo: +15% dano contra inimigos já derrotados"
  ],
  adaga_off: [
    "Lâmina Parceira: +10% dano quando usando duas armas",
    "Contra-ataque: 15% chance de atacar ao esquivar",
    "Velocidade: +10% velocidade de ataque",
    "Precisão Cirúrgica: +15% dano crítico",
    "Estocada: Ataques têm 10% chance de perfurar armadura",
    "Dança das Lâminas: +5% esquiva"
  ],
};

// Habilidades ativas
const HABILIDADES_OFFHAND: Record<OffHandType, { name: string; description: string; cooldown: number; manaCost: number }[]> = {
  escudo: [
    { name: "Levantar Escudo", description: "Bloqueia 90% do dano por 3s", cooldown: 15, manaCost: 20 },
    { name: "Investida com Escudo", description: "Avança atordoando inimigos no caminho", cooldown: 20, manaCost: 25 },
    { name: "Muralha", description: "+50% defesa para todos os aliados por 5s", cooldown: 45, manaCost: 50 },
  ],
  orb: [
    { name: "Explosão Arcana", description: "Dano mágico em área", cooldown: 15, manaCost: 40 },
    { name: "Canalização", description: "Regenera 50 MP instantaneamente", cooldown: 30, manaCost: 0 },
    { name: "Sobrecarga", description: "Próxima habilidade causa +100% dano", cooldown: 45, manaCost: 60 },
  ],
  tocha: [
    { name: "Labareda", description: "Cria uma área de fogo que queima inimigos", cooldown: 20, manaCost: 30 },
    { name: "Clarão", description: "Cega inimigos por 3s", cooldown: 25, manaCost: 25 },
    { name: "Pira", description: "+30 dano de fogo por 10s", cooldown: 40, manaCost: 40 },
  ],
  grimorio: [
    { name: "Conjurar Rápida", description: "Próxima magia é instantânea", cooldown: 30, manaCost: 30 },
    { name: "Poder Arcano", description: "+50% dano mágico por 8s", cooldown: 60, manaCost: 80 },
    { name: "Recuperação", description: "Recupera 30% do MP máximo", cooldown: 90, manaCost: 0 },
  ],
  lume: [
    { name: "Cura de Luz", description: "Cura 30% do HP máximo", cooldown: 45, manaCost: 50 },
    { name: "Proteção Radiante", description: "Escudo que absorve 100 de dano", cooldown: 30, manaCost: 40 },
    { name: "Purificação", description: "Remove todos os efeitos negativos", cooldown: 60, manaCost: 60 },
  ],
  bengala: [
    { name: "Comandar", description: "Aliados causam +20% dano por 10s", cooldown: 60, manaCost: 50 },
    { name: "Discurso Inspirador", description: "Todos os aliados recuperam 20% HP", cooldown: 90, manaCost: 60 },
    { name: "Autoridade", description: "Atordoa todos os inimigos por 2s", cooldown: 45, manaCost: 40 },
  ],
  lanterna: [
    { name: "Luz Intensa", description: "Revela todas as armadilhas e inimigos ocultos no mapa", cooldown: 60, manaCost: 30 },
    { name: "Sinal de Socorro", description: "Invoca aliados para sua posição", cooldown: 120, manaCost: 50 },
    { name: "Facho Orientador", description: "Mostra o caminho para o objetivo por 30s", cooldown: 90, manaCost: 40 },
  ],
  totem: [
    { name: "Invocar Espírito", description: "Invoca um espírito ancestral que luta por você por 20s", cooldown: 90, manaCost: 70 },
    { name: "Bênção dos Ancestrais", description: "Todos os atributos +20% por 15s", cooldown: 120, manaCost: 80 },
    { name: "Proteção Total", description: "Imunidade a dano por 3s", cooldown: 180, manaCost: 100 },
  ],
  livro: [
    { name: "Estratégia Perfeita", description: "+30% dano contra o tipo atual de inimigo por 20s", cooldown: 60, manaCost: 40 },
    { name: "Conhecimento Aplicado", description: "Descobre ponto fraco do inimigo (+50% dano no próximo ataque)", cooldown: 45, manaCost: 30 },
    { name: "Preparação Total", description: "Remove cooldown de todas as habilidades", cooldown: 300, manaCost: 100 },
  ],
  adaga_off: [
    { name: "Contra-ataque Fatal", description: "Próxima esquiva causa ataque com +200% dano", cooldown: 20, manaCost: 25 },
    { name: "Dança das Lâminas", description: "8 ataques rápidos", cooldown: 30, manaCost: 40 },
    { name: "Golpe Duplo", description: "Ataca com ambas as armas simultaneamente", cooldown: 15, manaCost: 30 },
  ],
};

// Gerar off-hand
export function generateOffHand(
  type: OffHandType,
  tier: EquipmentBase["tier"],
  level: number,
  setName?: string
): EquipmentBase {
  const mult = TIER_MULTIPLIERS[tier].statMult;
  const nomes = NOMES_OFFHAND[type];
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
  
  const efeitos = EFEITOS_OFFHAND[type];
  const passiveEffect = efeitos[Math.floor(Math.random() * efeitos.length)];
  
  const habilidades = HABILIDADES_OFFHAND[type];
  const activeSkill = habilidades[Math.floor(Math.random() * habilidades.length)];
  
  // Stats base por tipo
  const baseStats: Record<OffHandType, { def: number; armor: number; magicRes: number; mp: number; atkF: number; atkM: number }> = {
    escudo: { def: 15, armor: 12, magicRes: 5, mp: 0, atkF: 0, atkM: 0 },
    orb: { def: 2, armor: 0, magicRes: 10, mp: 30, atkF: 0, atkM: 10 },
    tocha: { def: 3, armor: 2, magicRes: 5, mp: 5, atkF: 3, atkM: 3 },
    grimorio: { def: 5, armor: 2, magicRes: 15, mp: 40, atkF: 0, atkM: 8 },
    lume: { def: 5, armor: 3, magicRes: 10, mp: 20, atkF: 2, atkM: 8 },
    bengala: { def: 5, armor: 3, magicRes: 5, mp: 10, atkF: 2, atkM: 2 },
    lanterna: { def: 4, armor: 3, magicRes: 5, mp: 5, atkF: 1, atkM: 1 },
    totem: { def: 8, armor: 5, magicRes: 10, mp: 15, atkF: 2, atkM: 5 },
    livro: { def: 3, armor: 1, magicRes: 8, mp: 25, atkF: 0, atkM: 5 },
    adaga_off: { def: 2, armor: 0, magicRes: 0, mp: 0, atkF: 8, atkM: 0 },
  };
  
  const stats = baseStats[type];
  
  return {
    id: `offhand_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: nomeFinal,
    slot: "offHand",
    type,
    tier,
    level,
    atkF: Math.floor(stats.atkF * mult * (1 + level * 0.05)),
    atkM: Math.floor(stats.atkM * mult * (1 + level * 0.05)),
    def: Math.floor(stats.def * mult * (1 + level * 0.05)),
    armor: Math.floor(stats.armor * mult * (1 + level * 0.05)),
    magicRes: Math.floor(stats.magicRes * mult * (1 + level * 0.05)),
    hp: Math.floor(15 * mult * (1 + level * 0.1)),
    mp: Math.floor(stats.mp * mult),
    critRate: type === "adaga_off" ? 0.03 * mult : 0,
    critDmg: type === "adaga_off" ? 1.3 + (0.1 * mult) : 1,
    atkSpeed: type === "adaga_off" ? 0.1 * mult : 0,
    dodge: type === "adaga_off" ? 0.03 * mult : 0.01 * mult,
    passiveEffect,
    activeSkill,
    icon: getOffHandIcon(type),
    color: TIER_MULTIPLIERS[tier].color,
    setName,
  };
}

function getOffHandIcon(type: OffHandType): string {
  const icons: Record<OffHandType, string> = {
    escudo: "🛡️", orb: "🔮", tocha: "🔥", grimorio: "📖", lume: "✨",
    bengala: "🦯", lanterna: "🏮", totem: "🗿", livro: "📚", adaga_off: "🗡️",
  };
  return icons[type];
}

// Gerar pool de off-hands
export function generateOffHandPool(count: number = 1000): EquipmentBase[] {
  const offhands: EquipmentBase[] = [];
  const types: OffHandType[] = ["escudo", "orb", "tocha", "grimorio", "lume", "bengala", "lanterna", "totem", "livro", "adaga_off"];
  const tiers: EquipmentBase["tier"][] = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS"];
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const tier = tiers[Math.floor(Math.random() * tiers.length)];
    const level = Math.floor(Math.random() * 100) + 1;
    offhands.push(generateOffHand(type, tier, level));
  }
  
  return offhands;
}

// Gerar off-hand único de boss
export function generateUniqueOffHand(bossName: string, bossLevel: number, tier: EquipmentBase["tier"]): EquipmentBase {
  const types: OffHandType[] = ["escudo", "orb", "grimorio", "totem"];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const offhand = generateOffHand(type, tier, bossLevel);
  offhand.name = `${offhand.name} de ${bossName}`;
  offhand.passiveEffect = `${offhand.passiveEffect} (Bônus Único: +10% todos os atributos)`;
  
  return offhand;
}
