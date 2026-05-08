// Sistema de Armas - 10000+ variações
import { EquipmentBase, WeaponType, TIER_MULTIPLIERS } from "./base";

// Prefixos de qualidade
const PREFIXOS = {
  comum: ["", "Usado", "Desgastado", "Simples", "Básico"],
  raro: ["Polido", "Afiado", "Equilibrado", "Refinado", "Laminado"],
  epico: ["Brilhante", "Runico", "Encantado", "Místico", "Arcano"],
  lendario: ["Divino", "Épico", "Lendário", "Mítico", "Primordial"],
  unico: ["Único", "Exclusivo", "Relíquia", "Artefato", "Eterno"],
};

// Sufixos de origem/material
const SUFIXOS_MATERIAL = [
  "de Ferro", "de Aço", "de Bronze", "de Prata", "de Ouro",
  "de Mithril", "de Adamantita", "de Obsidiana", "de Cristal", "de Ossos",
  "de Madeira", "de Ébano", "de Marfim", "de Jade", "de Rubi",
  "de Safira", "de Esmeralda", "de Diamante", "de Âmbar", "de Ânima"
];

// Sufixos de origem/monstro
const SUFIXOS_ORIGEM = [
  "do Lobo", "do Urso", "do Dragão", "da Aranha", "da Serpente",
  "do Orc", "do Troll", "do Gigante", "do Elemental", "do Demônio",
  "do Anjo", "do Espírito", "da Natureza", "das Sombras", "da Luz",
  "do Vazio", "do Abismo", "do Céu", "do Inferno", "do Caos"
];

// Nomes base por tipo de arma
const NOMES_ARMAS: Record<WeaponType, string[]> = {
  espada: [
    "Espada", "Lâmina", "Fio", "Gume", "Sanguinária", "Justiceira", "Vingadora",
    "Cortadora", "Destruidora", "Protetora", "Guardiã", "Honrada", "Gloriosa",
    "Longa", "Curta", "Larga", "Estreita", "Pesada", "Leve", "Rápida",
    "Flamejante", "Gélida", "Elétrica", "Venenosa", "Sagrada", "Profana",
    "Real", "Nobre", "Camponesa", "Mercenária", "Assassina", "Defensora"
  ],
  espada_dupla: [
    "Gêmeas", "Irmãs", "Gêmeas da Morte", "Lâminas Gêmeas", "Dupla Vingança",
    "Par Perfeito", "Dança Dupla", "Tempestade Dupla", "Fúria Gêmea",
    "Garras Gêmeas", "Presas Duplas", "Luz e Sombra", "Fogo e Gelo",
    "Vento e Trovão", "Vida e Morte", "Ordem e Caos", "Dia e Noite"
  ],
  adaga: [
    "Adaga", "Punhal", "Faca", "Lâmina Oculta", "Presa", "Garra", "Agulha",
    "Estilete", "Stiletto", "Kris", "Katar", "Shiv", "Lâmina Sombria",
    "Cortadora de Sombras", "Perfuradora", "Sussurro", "Sussurro da Morte",
    "Beijo Fatal", "Mordida Venenosa", "Lâmina do Assassino"
  ],
  adaga_dupla: [
    "Garras Gêmeas", "Presas Duplas", "Lâminas Gêmeas", "Par Sombrio",
    "Dança das Sombras", "Fúria Dupla", "Tempestade de Lâminas",
    "Morte Rápida", "Corte Duplo", "Sussurros Gêmeos", "Veneno Duplo"
  ],
  machado: [
    "Machado", "Machadinha", "Corta-Crânios", "Fendedor", "Destruidor",
    "Golpeador", "Cortador", "Cabeça-Cortadora", "Fúria", "Berserker",
    "Machado de Guerra", "Machado de Batalha", "Machado Duplo",
    "Lâmina Circular", "Cortador de Árvores", "Rachador", "Fendedor de Escudos"
  ],
  martelo: [
    "Martelo", "Marreta", "Malho", "Esmagador", "Destruidor", "Quebra-Crânios",
    "Punho de Guerra", "Martelo de Guerra", "Martelo Sagrado", "Julgador",
    "Martelo do Trovão", "Punho Divino", "Esmagador de Almas", "Quebra-Escudos"
  ],
  maca: [
    "Maça", "Clava", "Porrete", "Taco", "Clava com Espinhos", "Maça-Estrela",
    "Maça de Guerra", "Maça Sagrada", "Maça Profana", "Esmagadora",
    "Quebra-Ossos", "Dente de Aço", "Bola-Espinhos", "Cadeia com Crânios"
  ],
  foice: [
    "Foice", "Gadanha", "Ceifadora", "Lâmina da Morte", "Foice Sombria",
    "Ceifadora de Almas", "Foice do Ceifador", "Lâmina Final", "Último Corte",
    "Foice Lunar", "Gadanha da Lua", "Ceifadora Noturna", "Foice Demoníaca"
  ],
  arco: [
    "Arco", "Arco Longo", "Arco Curto", "Arco Composto", "Arco de Guerra",
    "Arco Élfico", "Arco de Caça", "Arco de Precisão", "Arco Veloz",
    "Arco Flamejante", "Arco Gélido", "Arco Elétrico", "Arco Sombrio",
    "Arco Sagrado", "Arco do Vento", "Arco do Trovão", "Arco Dracônico"
  ],
  varinha: [
    "Varinha", "Varinha Mágica", "Varinha Arcana", "Varinha Rúnica",
    "Varinha Elemental", "Varinha de Cristal", "Varinha de Ossos",
    "Varinha de Madeira", "Varinha de Ébano", "Varinha de Marfim",
    "Varinha do Mago", "Varinha da Bruxa", "Varinha do Feiticeiro",
    "Varinha Estelar", "Varinha do Vazio", "Varinha Primordial"
  ],
  cajado: [
    "Cajado", "Bastão", "Cajado Mágico", "Cajado Arcano", "Cajado Rúnico",
    "Cajado Elemental", "Cajado de Cristal", "Cajado de Madeira",
    "Cajado de Ébano", "Cajado de Marfim", "Cajado do Mago",
    "Cajado da Bruxa", "Cajado do Feiticeiro", "Cajado Estelar",
    "Cajado do Vazio", "Cajado Primordial", "Cajado Sagrado", "Cajado Profano"
  ],
  lanca: [
    "Lança", "Pique", "Alabarda", "Glaive", "Lança Longa", "Lança Curta",
    "Tridente", "Forquilha", "Lança de Cavalaria", "Lança de Infantaria",
    "Lança Dracônica", "Lança Flamejante", "Lança Gélida", "Lança Elétrica",
    "Lança Sombria", "Lança Sagrada", "Lança do Vazio", "Lança Primordial"
  ],
};

// Efeitos passivos por tipo
const EFEITOS_PASSIVOS: Record<WeaponType, string[]> = {
  espada: [
    "+5% Dano crítico", "+3% Chance de crítico", "+10% Dano em humanoides",
    "Cura 2% do dano causado", "+5% Velocidade de ataque", "Ignora 5% da armadura"
  ],
  espada_dupla: [
    "+10% Dano quando HP < 30%", "Ataques duplos têm 10% chance de acerto extra",
    "+15% Dano crítico", "Cura 3% do dano causado"
  ],
  adaga: [
    "+10% Dano pelas costas", "+5% Chance de esquiva", "Veneno: 2% dano/s por 5s",
    "Silencioso: Inimigos não alertam outros", "+15% Dano crítico"
  ],
  adaga_dupla: [
    "+15% Dano pelas costas", "Ataques têm 15% chance de sangramento",
    "+20% Dano crítico", "Cura 4% do dano causado"
  ],
  machado: [
    "+10% Dano a escudos", "Corte profundo: Sangramento 3% por 4s",
    "+5% Dano por acerto consecutivo (máx 15%)", "Quebra-armadura: -5% def inimiga"
  ],
  martelo: [
    "Atordoamento: 10% chance de stun por 1s", "+15% Dano a construtos",
    "Quebra-crânio: +20% dano em críticos", "+5% Dano por acerto (máx 20%)"
  ],
  maca: [
    "Esmagamento: -10% velocidade inimiga", "+10% Dano a armaduras pesadas",
    "Concussão: 15% chance de atordoar", "Dano de área: 20% em adjacentes"
  ],
  foice: [
    "Ceifadora: +20% dano em inimigos com <30% HP", "Dreno de vida: 5% do dano",
    "Marca da morte: Inimigo recebe +10% dano", "Corte final: Executa inimigos <5% HP"
  ],
  arco: [
    "+10% Alcance", "Tiro preciso: +15% dano em alvos distantes",
    "Tiro múltiplo: 10% chance de disparar 2 flechas", "Flechas flamejantes: +5 dano fogo"
  ],
  varinha: [
    "+10% Dano mágico", "-10% Custo de mana", "Regeneração: +2 MP/s",
    "Concentração: +5% precisão mágica", "Canalização: Habilidades carregam 10% mais rápido"
  ],
  cajado: [
    "+15% Dano mágico", "-15% Custo de mana", "Regeneração: +3 MP/s",
    "Amplificação: +10% dano de habilidades", "Proteção mágica: +10 resistência mágica"
  ],
  lanca: [
    "Alcance: +1 metro de distância", "Perfuração: Atinge 2 inimigos alinhados",
    "Formação: +10% defesa ao usar com escudo", "Carga: +20% dano ao correr"
  ],
};

// Habilidades ativas
const HABILIDADES_ATIVAS: Record<WeaponType, { name: string; description: string; cooldown: number; manaCost: number }[]> = {
  espada: [
    { name: "Corte Rápido", description: "Ataque instantâneo com +50% dano", cooldown: 5, manaCost: 10 },
    { name: "Golpe Giratório", description: "Ataque em área ao redor", cooldown: 8, manaCost: 15 },
    { name: "Estocada Precisa", description: "Ataque que ignora 50% da defesa", cooldown: 10, manaCost: 20 },
  ],
  espada_dupla: [
    { name: "Dança das Lâminas", description: "4 ataques rápidos em sequência", cooldown: 12, manaCost: 25 },
    { name: "Fúria Gêmea", description: "+100% dano por 5 segundos", cooldown: 20, manaCost: 30 },
  ],
  adaga: [
    { name: "Apunhalada", description: "Dano triplo pelas costas", cooldown: 8, manaCost: 15 },
    { name: "Veneno Mortal", description: "Aplica veneno que dura 10s", cooldown: 15, manaCost: 20 },
  ],
  adaga_dupla: [
    { name: "Tempestade de Aço", description: "8 ataques rápidos", cooldown: 15, manaCost: 30 },
    { name: "Sombra Assassina", description: "Fica invisível por 3s, próximo ataque causa +200% dano", cooldown: 25, manaCost: 40 },
  ],
  machado: [
    { name: "Corte Decapitador", description: "Ataque com +150% dano, chance de executar", cooldown: 15, manaCost: 25 },
    { name: "Fúria do Berserker", description: "+50% dano, -30% defesa por 10s", cooldown: 30, manaCost: 35 },
  ],
  martelo: [
    { name: "Pulso Sísmico", description: "Atordoamento em área por 2s", cooldown: 20, manaCost: 30 },
    { name: "Julgamento", description: "Ataque que causa +200% dano a inimigos atordoados", cooldown: 25, manaCost: 40 },
  ],
  maca: [
    { name: "Esmagamento", description: "Ataque que reduz armadura em 30% por 5s", cooldown: 12, manaCost: 20 },
    { name: "Impacto Devastador", description: "Dano em área com knockback", cooldown: 18, manaCost: 30 },
  ],
  foice: [
    { name: "Ceifar", description: "Executa inimigos com <20% HP, cura 20% do HP máximo", cooldown: 30, manaCost: 50 },
    { name: "Onda da Morte", description: "Projétil que causa dano e marca inimigos", cooldown: 15, manaCost: 35 },
  ],
  arco: [
    { name: "Tiro Carregado", description: "Ataque que causa +200% dano", cooldown: 10, manaCost: 20 },
    { name: "Chuva de Flechas", description: "Ataque em área grande", cooldown: 20, manaCost: 40 },
    { name: "Tiro Marcado", description: "Marca inimigo, próximos ataques causam +30% dano", cooldown: 15, manaCost: 25 },
  ],
  varinha: [
    { name: "Míssil Mágico", description: "3 projéteis que perseguem inimigos", cooldown: 8, manaCost: 25 },
    { name: "Explosão Arcana", description: "Dano em área mágico", cooldown: 15, manaCost: 40 },
    { name: "Escudo Mágico", description: "Absorve 50% do dano por 5s", cooldown: 25, manaCost: 50 },
  ],
  cajado: [
    { name: "Bola de Fogo", description: "Dano em área de fogo", cooldown: 12, manaCost: 35 },
    { name: "Raio", description: "Dano elétrico em linha", cooldown: 10, manaCost: 30 },
    { name: "Meteoro", description: "Dano massivo em área", cooldown: 45, manaCost: 100 },
  ],
  lanca: [
    { name: "Investida", description: "Avança causando +100% dano", cooldown: 10, manaCost: 20 },
    { name: "Giro da Lança", description: "Ataque circular ao redor", cooldown: 12, manaCost: 25 },
    { name: "Lançar", description: "Arremessa a lança causando dano massivo", cooldown: 20, manaCost: 35 },
  ],
};

// Gerar uma arma específica
export function generateWeapon(
  type: WeaponType,
  tier: EquipmentBase["tier"],
  level: number,
  setName?: string
): EquipmentBase {
  const mult = TIER_MULTIPLIERS[tier].statMult;
  const nomes = NOMES_ARMAS[type];
  const nomeBase = nomes[Math.floor(Math.random() * nomes.length)];
  
  // Construir nome completo
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
  
  // Adicionar sufixo de material ou origem
  if (Math.random() > 0.3) {
    if (Math.random() > 0.5) {
      nomeFinal += ` ${SUFIXOS_MATERIAL[Math.floor(Math.random() * SUFIXOS_MATERIAL.length)]}`;
    } else {
      nomeFinal += ` ${SUFIXOS_ORIGEM[Math.floor(Math.random() * SUFIXOS_ORIGEM.length)]}`;
    }
  }
  
  // Efeitos
  const efeitos = EFEITOS_PASSIVOS[type];
  const passiveEffect = efeitos[Math.floor(Math.random() * efeitos.length)];
  
  const habilidades = HABILIDADES_ATIVAS[type];
  const activeSkill = habilidades[Math.floor(Math.random() * habilidades.length)];
  
  // Stats base por tipo
  const baseStats: Record<WeaponType, { atkF: number; atkM: number; atkSpeed: number }> = {
    espada: { atkF: 15, atkM: 2, atkSpeed: 1.0 },
    espada_dupla: { atkF: 12, atkM: 2, atkSpeed: 1.2 },
    adaga: { atkF: 10, atkM: 3, atkSpeed: 1.5 },
    adaga_dupla: { atkF: 8, atkM: 2, atkSpeed: 1.8 },
    machado: { atkF: 20, atkM: 1, atkSpeed: 0.8 },
    martelo: { atkF: 25, atkM: 0, atkSpeed: 0.7 },
    maca: { atkF: 18, atkM: 0, atkSpeed: 0.9 },
    foice: { atkF: 22, atkM: 5, atkSpeed: 0.85 },
    arco: { atkF: 12, atkM: 0, atkSpeed: 1.1 },
    varinha: { atkF: 2, atkM: 15, atkSpeed: 1.3 },
    cajado: { atkF: 3, atkM: 20, atkSpeed: 1.0 },
    lanca: { atkF: 16, atkM: 2, atkSpeed: 0.95 },
  };
  
  const stats = baseStats[type];
  
  return {
    id: `weapon_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: nomeFinal,
    slot: "mainHand",
    type,
    tier,
    level,
    atkF: Math.floor(stats.atkF * mult * (1 + level * 0.1)),
    atkM: Math.floor(stats.atkM * mult * (1 + level * 0.1)),
    def: 0,
    armor: 0,
    magicRes: 0,
    hp: 0,
    mp: Math.floor(10 * mult),
    critRate: 0.02 * mult,
    critDmg: 1.5 + (0.1 * mult),
    atkSpeed: stats.atkSpeed,
    dodge: 0,
    passiveEffect,
    activeSkill,
    icon: getWeaponIcon(type),
    color: TIER_MULTIPLIERS[tier].color,
    setName,
  };
}

function getWeaponIcon(type: WeaponType): string {
  const icons: Record<WeaponType, string> = {
    espada: "⚔️", espada_dupla: "⚔️", adaga: "🗡️", adaga_dupla: "🗡️",
    machado: "🪓", martelo: "🔨", maca: "🏏", foice: "🔱",
    arco: "🏹", varinha: "🪄", cajado: "🦯", lanca: "🔱",
  };
  return icons[type];
}

// Gerar múltiplas armas
export function generateWeaponPool(count: number = 1000): EquipmentBase[] {
  const weapons: EquipmentBase[] = [];
  const types: WeaponType[] = ["espada", "espada_dupla", "adaga", "adaga_dupla", "machado", "martelo", "maca", "foice", "arco", "varinha", "cajado", "lanca"];
  const tiers: EquipmentBase["tier"][] = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS"];
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const tier = tiers[Math.floor(Math.random() * tiers.length)];
    const level = Math.floor(Math.random() * 100) + 1;
    weapons.push(generateWeapon(type, tier, level));
  }
  
  return weapons;
}

// Armas únicas de bosses
export function generateUniqueWeapon(bossName: string, bossLevel: number, tier: EquipmentBase["tier"]): EquipmentBase {
  const types: WeaponType[] = ["espada", "machado", "martelo", "arco", "varinha", "cajado", "lanca"];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const weapon = generateWeapon(type, tier, bossLevel);
  weapon.name = `${weapon.name} de ${bossName}`;
  weapon.passiveEffect = `${weapon.passiveEffect} (Bônus Único: +10% dano)`;
  weapon.atkF = Math.floor(weapon.atkF * 1.2);
  weapon.atkM = Math.floor(weapon.atkM * 1.2);
  
  return weapon;
}
