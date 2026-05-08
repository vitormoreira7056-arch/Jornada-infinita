import { ElementId, ResistanceMap } from "./elements";

export type RaceId =
  | "anao_montanha" | "anao_runico" | "elfo_negro" | "alto_elfo" | "orc"
  | "humano" | "meio_elfo" | "meio_orc" | "draconato" | "fada"
  | "halfling" | "harpia" | "sereia" | "vampiro" | "homem_lobo"
  | "homem_tigre" | "homem_gato" | "homem_lagarto" | "kitsune";

export type Gender = "masculino" | "feminino";

export interface RaceStats {
  hp: number;
  armor: number;
  magicRes: number;
  atkF: number;
  atkM: number;
  def: number;
  critBonus: number;
  critMultBonus: number;
  luck: number;
  lifeSteal: number;
  dodge: number;
  speed: number;
  armorPen: number;
  hpRegen: number;
}

export interface RaceAbility {
  name: string;
  type: "ativa" | "passiva";
  description: string;
  icon: string;
}

export interface RaceDef {
  id: RaceId;
  name: string;
  emoji: string;
  color: string;
  lore: string;
  primaryElements: ElementId[];
  learnableElements: ElementId[];
  stats: RaceStats;
  resistances: Partial<ResistanceMap>;
  abilities: RaceAbility[];
}

const EMPTY_STATS: RaceStats = {
  hp: 0, armor: 0, magicRes: 0, atkF: 0, atkM: 0, def: 0,
  critBonus: 0, critMultBonus: 0, luck: 0,
  lifeSteal: 0, dodge: 0, speed: 0,
  armorPen: 0, hpRegen: 0,
};

export const RACES: RaceDef[] = [
  {
    id: "anao_montanha",
    name: "Anão das Montanhas",
    emoji: "⚒️",
    color: "#A1887F",
    lore: "Forjados pelo ferro das montanhas, os Anões são imbatíveis em resistência. Seu corpo rígido é como a rocha que habitam — inabaláveis.",
    primaryElements: ["terra", "metal"],
    learnableElements: ["fogo", "trovao", "arcano"],
    stats: { ...EMPTY_STATS, hp: 40, armor: 8, magicRes: 4, atkF: 6, def: 5, critBonus: 0.01, luck: 0.0001, dodge: 0.005, speed: -1, hpRegen: 1 },
    resistances: { terra: 20, metal: 15, fogo: 8, gelo: -5 },
    abilities: [
      { name: "Golpe de Martelo", type: "ativa", description: "Golpe pesado que reduz 15% da defesa do inimigo por 2 turnos.", icon: "tool" },
      { name: "Fortaleza de Pedra", type: "ativa", description: "Aumenta a armadura em 40% por 2 turnos.", icon: "shield" },
      { name: "Grito de Guerra", type: "ativa", description: "Aumenta o ATK.f em 12% por 3 turnos.", icon: "volume-2" },
      { name: "Pele de Rocha", type: "passiva", description: "Reduz dano físico recebido em 5%.", icon: "layers" },
    ],
  },
  {
    id: "anao_runico",
    name: "Anão Rúnico",
    emoji: "🔮",
    color: "#7E57C2",
    lore: "Mestres das runas ancestrais, os Anões Rúnicos gravaram a magia em seus próprios corpos. Cada runa em sua pele é um feitiço latente.",
    primaryElements: ["terra", "runico"],
    learnableElements: ["arcano", "metal", "trovao"],
    stats: { ...EMPTY_STATS, hp: 25, armor: 3, magicRes: 8, atkM: 10, def: 2, critBonus: 0.01, luck: 0.0001, dodge: 0.005 },
    resistances: { terra: 15, runico: 15, arcano: 10 },
    abilities: [
      { name: "Runa de Explosão", type: "ativa", description: "Causa dano mágico de Terra+Arcano moderado.", icon: "zap" },
      { name: "Escudo Rúnico", type: "ativa", description: "Absorve até 20% do HP máximo em dano por 2 turnos.", icon: "shield" },
      { name: "Âncora de Runas", type: "ativa", description: "Reduz esquiva do inimigo em 30% por 2 turnos.", icon: "anchor" },
      { name: "Sabedoria das Runas", type: "passiva", description: "Feitiços causam 6% mais dano mágico.", icon: "book" },
    ],
  },
  {
    id: "elfo_negro",
    name: "Elfo Negro",
    emoji: "🌑",
    color: "#7C4DFF",
    lore: "Nascidos nas sombras das florestas proibidas, os Elfos Negros dominam o veneno e a escuridão. Seus ataques são silenciosos como a morte.",
    primaryElements: ["escuridao", "veneno"],
    learnableElements: ["sombra", "ar", "arcano"],
    stats: { ...EMPTY_STATS, hp: 15, armor: 2, magicRes: 6, atkF: 4, atkM: 8, def: 2, critBonus: 0.025, dodge: 0.03, luck: 0.0002, speed: 2 },
    resistances: { escuridao: 20, veneno: 15, luz: -10 },
    abilities: [
      { name: "Flecha Sombria", type: "ativa", description: "Causa dano de Escuridão e aplica veneno fraco por 3 turnos.", icon: "target" },
      { name: "Passo das Sombras", type: "ativa", description: "Aumenta esquiva em 25% por 1 turno.", icon: "wind" },
      { name: "Névoa Venenosa", type: "ativa", description: "Causa dano de veneno em área por 2 turnos.", icon: "cloud" },
      { name: "Adaptação às Trevas", type: "passiva", description: "Ganha +5% de velocidade de ataque em combate.", icon: "moon" },
    ],
  },
  {
    id: "alto_elfo",
    name: "Alto Elfo",
    emoji: "☀️",
    color: "#FFD54F",
    lore: "Aristocratas da magia, os Altos Elfos nasceram com afinidade inata à luz e ao arcano. São os mais poderosos usuários de magia do mundo.",
    primaryElements: ["luz", "arcano"],
    learnableElements: ["sagrado", "divino", "ar"],
    stats: { ...EMPTY_STATS, hp: 20, armor: 2, magicRes: 10, atkM: 12, def: 2, critBonus: 0.015, luck: 0.0001, dodge: 0.01 },
    resistances: { luz: 25, arcano: 15, escuridao: -15 },
    abilities: [
      { name: "Raio de Pureza", type: "ativa", description: "Causa dano de Luz moderado, dobrado contra trevas.", icon: "sun" },
      { name: "Barreira Arcana", type: "ativa", description: "Absorve 25% do HP máximo em dano mágico por 2 turnos.", icon: "shield" },
      { name: "Chuva de Meteoros", type: "ativa", description: "Causa dano de Arcano em 3 acertos.", icon: "star" },
      { name: "Graça Élfica", type: "passiva", description: "Feitiços têm 10% de chance de causar 25% mais dano.", icon: "star" },
    ],
  },
  {
    id: "orc",
    name: "Orc",
    emoji: "🪓",
    color: "#558B2F",
    lore: "Guerreiros nascidos para a batalha, os Orcs canalizam a raiva tribal em força bruta incomparável. Quanto mais sangue, mais fortes ficam.",
    primaryElements: ["fogo", "terra"],
    learnableElements: ["metal", "trovao", "caos"],
    stats: { ...EMPTY_STATS, hp: 55, armor: 6, magicRes: 4, atkF: 10, def: 4, critBonus: 0.01, luck: 0.0001, dodge: 0.005, speed: 1 },
    resistances: { fogo: 15, terra: 15, veneno: 10 },
    abilities: [
      { name: "Esmagamento", type: "ativa", description: "Causa 140% ATK.f e ignora 15% da armadura.", icon: "arrow-down" },
      { name: "Fúria Berserker", type: "ativa", description: "+25% ATK.f por 3 turnos, mas recebe 10% a mais dano.", icon: "alert-triangle" },
      { name: "Grito de Invasão", type: "ativa", description: "Reduz defesa do inimigo em 12% por 2 turnos.", icon: "volume-2" },
      { name: "Sede de Sangue", type: "passiva", description: "Abaixo de 25% HP, ganha +15% ATK.f e 3% roubo de vida.", icon: "heart" },
    ],
  },
  {
    id: "humano",
    name: "Humano",
    emoji: "👤",
    color: "#FF9800",
    lore: "Sem dons inatos, os Humanos compensam com adaptabilidade inigualável. Sua sorte e determinação os tornam imprevisíveis em batalha.",
    primaryElements: ["fogo", "agua"],
    learnableElements: ["fogo", "agua", "terra", "trovao", "gelo", "ar", "escuridao", "luz"],
    stats: { ...EMPTY_STATS, hp: 30, armor: 3, magicRes: 3, atkF: 4, atkM: 4, def: 3, critBonus: 0.01, luck: 0.0003, dodge: 0.015 },
    resistances: { fogo: 5, agua: 5, terra: 5, trovao: 5, gelo: 5, ar: 5 },
    abilities: [
      { name: "Determinação", type: "ativa", description: "Reduz dano do próximo ataque em 30% e contra-ataca com 110% ATK.", icon: "shield" },
      { name: "Adaptação", type: "ativa", description: "Ganha buff aleatório (+10% em um atributo) por 3 turnos.", icon: "refresh-cw" },
      { name: "Golpe Certeiro", type: "ativa", description: "Ignora 50% da armadura do inimigo.", icon: "crosshair" },
      { name: "Potencial Humano", type: "passiva", description: "Ganha 10% mais EXP e ouro. Sorte acumula mais rápido.", icon: "trending-up" },
    ],
  },
  {
    id: "meio_elfo",
    name: "Meio-Elfo",
    emoji: "🌿",
    color: "#26C6DA",
    lore: "Filhos de dois mundos, os Meio-Elfos carregam a leveza élfica com a resiliência humana. Mestres da versatilidade e do equilíbrio.",
    primaryElements: ["luz", "ar"],
    learnableElements: ["natureza", "arcano", "agua"],
    stats: { ...EMPTY_STATS, hp: 25, atkF: 8, atkM: 8, critBonus: 0.02, dodge: 0.02, luck: 0.0001, speed: 2 },
    resistances: { luz: 15, ar: 15, natureza: 10 },
    abilities: [
      { name: "Flecha Élfica", type: "ativa", description: "Flecha imbuída de vento que perfura defesas e acerta 3 vezes.", icon: "wind" },
      { name: "Bênção da Floresta", type: "ativa", description: "Cura 20% do HP máximo e remove um debuff.", icon: "heart" },
      { name: "Golpe do Vento", type: "ativa", description: "Ataque carregado de vento com 100% de chance de crítico.", icon: "zap" },
      { name: "Herança Dual", type: "passiva", description: "ATK físico E mágico causam 8% mais dano. Bônus cumulativo.", icon: "layers" },
    ],
  },
  {
    id: "meio_orc",
    name: "Meio-Orc",
    emoji: "🛡️",
    color: "#8D6E63",
    lore: "Herdeiros da força orca e da inteligência humana, os Meio-Orcs são guerreiros pragmáticos que encontram poder no sofrimento.",
    primaryElements: ["fogo", "terra"],
    learnableElements: ["metal", "veneno", "caos"],
    stats: { ...EMPTY_STATS, hp: 45, armor: 5, atkF: 12, critBonus: 0.025, luck: 0.0001, dodge: 0.005 },
    resistances: { fogo: 15, terra: 12, veneno: 10 },
    abilities: [
      { name: "Impacto Bruto", type: "ativa", description: "Golpe brutal com 180% ATK.f que derruba o inimigo por 1 turno.", icon: "arrow-down" },
      { name: "Resistência de Batalha", type: "ativa", description: "Endurece o corpo, reduzindo dano recebido em 35% por 3 turnos.", icon: "shield" },
      { name: "Ira Tribal", type: "ativa", description: "Acumula fúria a cada golpe recebido, aumentando ATK.f em 10% por turno (máx 5).", icon: "trending-up" },
      { name: "Sangue de Guerreiro", type: "passiva", description: "Acertos críticos restauram 5% do HP máximo.", icon: "heart" },
    ],
  },
  {
    id: "draconato",
    name: "Draconato",
    emoji: "🐉",
    color: "#FF5722",
    lore: "Descendentes de dragões que cruzaram com mortais, os Draconatos carregam em suas veias o poder primordial das criaturas mais antigas do mundo.",
    primaryElements: ["fogo", "trovao"],
    learnableElements: ["infernal", "ar", "terra", "void"],
    stats: { ...EMPTY_STATS, hp: 40, armor: 8, atkF: 12, atkM: 12, critBonus: 0.02, luck: 0.0001, dodge: 0.01, hpRegen: 1 },
    resistances: { fogo: 35, trovao: 25, terra: -5 },
    abilities: [
      { name: "Sopro do Dragão", type: "ativa", description: "Sopra chamas dracônicas que causam dano de Fogo massivo e queimam por 4 turnos.", icon: "wind" },
      { name: "Raio do Céu", type: "ativa", description: "Convoca raio celestial: dano de Trovão + atordoamento por 2 turnos.", icon: "zap" },
      { name: "Escamas Dracônicas", type: "ativa", description: "Manifesta escamas de dragão: +80% armadura por 3 turnos.", icon: "shield" },
      { name: "Sangue do Dragão", type: "passiva", description: "Recebe 12% menos dano elemental de Fogo e Trovão. Regenera 1% HP/turno.", icon: "droplet" },
    ],
  },
  {
    id: "fada",
    name: "Fada",
    emoji: "🧚",
    color: "#F48FB1",
    lore: "Seres de pura energia mágica, as Fadas são imprevisíveis e encantadoras. Sua sorte é lendária e sua ilusão, impenetrável.",
    primaryElements: ["ar", "luz"],
    learnableElements: ["arcano", "natureza", "sagrado"],
    stats: { ...EMPTY_STATS, hp: 5, atkM: 16, magicPower: 6, critBonus: 0.02, dodge: 0.06, luck: 0.0004, fortune: 1, speed: 5 },
    resistances: { ar: 25, luz: 20, terra: -15 },
    abilities: [
      { name: "Pó de Fada", type: "ativa", description: "Cobre o inimigo com pó mágico: confusão por 3 turnos, causando erro nos ataques.", icon: "star" },
      { name: "Ilusão Encantada", type: "ativa", description: "Cria ilusão perfeita: inimigo erra os próximos 2 ataques garantidamente.", icon: "eye-off" },
      { name: "Bênção da Fada", type: "ativa", description: "Cura 25% HP e aumenta Sorte em 50% e Esquiva em 10% por 4 turnos.", icon: "heart" },
      { name: "Asas da Sorte", type: "passiva", description: "Todos os stats têm 8% de chance de dobrar seu efeito por turno.", icon: "wind" },
    ],
  },
  {
    id: "halfling",
    name: "Halfling",
    emoji: "🍀",
    color: "#66BB6A",
    lore: "Pequenos mas extraordinariamente sortudos, os Halflings transformam o destino em sua arma mais poderosa. Nada é impossível quando a sorte está ao seu lado.",
    primaryElements: ["terra", "ar"],
    learnableElements: ["natureza", "agua", "arcano"],
    stats: { ...EMPTY_STATS, hp: 10, atkF: 5, critBonus: 0.015, dodge: 0.03, luck: 0.0006, fortune: 3, speed: 2 },
    resistances: { veneno: 15, terra: 15 },
    abilities: [
      { name: "Golpe Sortudo", type: "ativa", description: "Ataque cujo dano é multiplicado pela Sorte atual (pode surpreender!).", icon: "star" },
      { name: "Fuga Ágil", type: "ativa", description: "Esquiva garantida + contra-ataque imediato com 120% ATK.", icon: "wind" },
      { name: "Amuleto da Sorte", type: "ativa", description: "Ativa amuleto que aumenta Sorte em 200% e Fortune em 50% por 5 turnos.", icon: "gift" },
      { name: "Sortudo por Natureza", type: "passiva", description: "Sorte tem limite 50% maior e acumula 2x mais rápido com cada vitória.", icon: "trending-up" },
    ],
  },
  {
    id: "harpia",
    name: "Harpia",
    emoji: "🦅",
    color: "#78909C",
    lore: "Senhoras dos céus, as Harpias atacam em mergulho devastador antes do inimigo perceber sua presença. Velocidade é sua armadura.",
    primaryElements: ["ar", "trovao"],
    learnableElements: ["tempestade", "gelo", "escuridao"],
    stats: { ...EMPTY_STATS, hp: 15, atkF: 14, atkM: 8, critBonus: 0.04, dodge: 0.04, luck: 0.0002, speed: 6, armorPen: 5 },
    resistances: { ar: 30, trovao: 20 },
    abilities: [
      { name: "Mergulho Trovejante", type: "ativa", description: "Mergulho em alta velocidade: dano de Trovão + Vento com 50% de penetração de armadura.", icon: "arrow-down-circle" },
      { name: "Grito da Harpia", type: "ativa", description: "Grito sônico que atordoa o inimigo e causa dano de vento em área.", icon: "volume-2" },
      { name: "Tempestade de Penas", type: "ativa", description: "Lança tempestade de penas cortantes que atingem 6 vezes com dano de vento.", icon: "wind" },
      { name: "Mestre dos Céus", type: "passiva", description: "Primeiro ataque de cada batalha causa 40% mais dano e é sempre crítico.", icon: "award" },
    ],
  },
  {
    id: "sereia",
    name: "Sereia / Tritão",
    emoji: "🧜",
    color: "#00ACC1",
    lore: "Guardiões das profundezas, Sereias e Tritões controlam correntes oceânicas e gelo abissal. Sua voz tem poder de cativar e destruir.",
    primaryElements: ["agua", "gelo"],
    learnableElements: ["tempestade", "void", "natureza"],
    stats: { ...EMPTY_STATS, hp: 30, atkM: 14, magicPower: 4, lifeSteal: 0.03, luck: 0.0002, dodge: 0.02, hpRegen: 2 },
    resistances: { agua: 35, gelo: 25, fogo: -15 },
    abilities: [
      { name: "Canto da Sereia", type: "ativa", description: "Canto hipnótico que paralisa o inimigo por 3 turnos e drena HP.", icon: "music" },
      { name: "Onda Congelante", type: "ativa", description: "Onda de gelo que causa dano massivo e reduz velocidade inimiga em 50%.", icon: "wind" },
      { name: "Corrente Abissal", type: "ativa", description: "Pressão das profundezas: dano de Água esmagador que ignora 30% da defesa.", icon: "arrow-down" },
      { name: "Cura das Marés", type: "passiva", description: "Regenera 3% do HP máximo por turno. Roubo de vida é 50% mais eficaz.", icon: "droplet" },
    ],
  },
  {
    id: "vampiro",
    name: "Vampiro",
    emoji: "🧛",
    color: "#C62828",
    lore: "Imortais malditos que se alimentam da força vital dos outros. Cada gota de sangue roubado os torna mais poderosos e ávidos.",
    primaryElements: ["sangue", "escuridao"],
    learnableElements: ["sombra", "void", "caos"],
    stats: { ...EMPTY_STATS, hp: 25, atkF: 14, critBonus: 0.04, lifeSteal: 0.06, luck: 0.0002, dodge: 0.03, speed: 2, hpRegen: 1 },
    resistances: { escuridao: 30, sangue: 25, luz: -30, sagrado: -40 },
    abilities: [
      { name: "Mordida Sombria", type: "ativa", description: "Morde o pescoço do inimigo: dano de Sangue + rouba 20% do dano como HP.", icon: "droplet" },
      { name: "Forma de Morcego", type: "ativa", description: "Transforma-se em morcego: Esquiva +60% por 2 turnos, ataca 3 vezes.", icon: "eye-off" },
      { name: "Sedução Vampírica", type: "ativa", description: "Encanta o inimigo: -30% ATK e -20% DEF por 4 turnos.", icon: "heart" },
      { name: "Sede Eterna", type: "passiva", description: "Roubo de vida cura o dobro. Cada kill em batalha aumenta ATK em 5%.", icon: "trending-up" },
    ],
  },
  {
    id: "homem_lobo",
    name: "Homem-Lobo",
    emoji: "🐺",
    color: "#607D8B",
    lore: "Amaldiçoados pela lua, os Homens-Lobo carregam a fúria bestial dentro de si. Quando a lua cheia surge, tornam-se incontroláveis e imparáveis.",
    primaryElements: ["terra", "escuridao"],
    learnableElements: ["sombra", "natureza", "sangue"],
    stats: { ...EMPTY_STATS, hp: 35, atkF: 16, critBonus: 0.03, dodge: 0.03, luck: 0.0001, speed: 4, armorPen: 3 },
    resistances: { terra: 20, escuridao: 20 },
    abilities: [
      { name: "Mordida da Lua", type: "ativa", description: "Mordida feroz que causa sangramento: dano inicial + 15% ATK por 5 turnos.", icon: "moon" },
      { name: "Rugido do Lobo", type: "ativa", description: "Rugido que aumenta ATK.f em 40% e Velocidade em 30% por 4 turnos.", icon: "volume-2" },
      { name: "Fúria da Lua Cheia", type: "ativa", description: "Desencadeia fúria bestial: 5 ataques rápidos consecutivos de 80% ATK.f.", icon: "alert-triangle" },
      { name: "Instinto Selvagem", type: "passiva", description: "15% de chance de esquivar automaticamente de qualquer ataque.", icon: "wind" },
    ],
  },
  {
    id: "homem_tigre",
    name: "Homem-Tigre",
    emoji: "🐯",
    color: "#F57C00",
    lore: "Ágeis como o vento e mortais como o fogo, os Homens-Tigre são caçadores natos. Seus críticos são lendários entre os guerreiros do mundo.",
    primaryElements: ["ar", "fogo"],
    learnableElements: ["trovao", "metal", "sombra"],
    stats: { ...EMPTY_STATS, hp: 20, atkF: 18, critBonus: 0.06, critMultBonus: 0.3, luck: 0.0002, dodge: 0.03, speed: 5 },
    resistances: { fogo: 20, ar: 15 },
    abilities: [
      { name: "Garras do Tigre", type: "ativa", description: "Combo feroz de 3 garras: cada ataque causa 90% ATK.f com alta taxa de crítico.", icon: "scissors" },
      { name: "Salto do Caçador", type: "ativa", description: "Salto sobre o inimigo: ataque garantidamente crítico causando 250% ATK.f.", icon: "arrow-up" },
      { name: "Rugido do Tigre", type: "ativa", description: "Rugido intimidante que reduz a DEF inimiga em 35% por 4 turnos.", icon: "volume-2" },
      { name: "Caçador Nato", type: "passiva", description: "Acertos críticos causam 35% mais dano. Taxa crítica efetiva é sempre maior.", icon: "target" },
    ],
  },
  {
    id: "homem_gato",
    name: "Homem-Gato",
    emoji: "🐱",
    color: "#BDBDBD",
    lore: "Graciosos e misteriosos, os Homens-Gato dançam entre as sombras e o vento. Jamais são pegos desprevenidos, e raramente ficam parados.",
    primaryElements: ["ar", "escuridao"],
    learnableElements: ["sombra", "arcano", "natureza"],
    stats: { ...EMPTY_STATS, hp: 10, atkF: 10, critBonus: 0.035, dodge: 0.06, luck: 0.0004, fortune: 1, speed: 6 },
    resistances: { escuridao: 15, ar: 15 },
    abilities: [
      { name: "Golpe Ágil", type: "ativa", description: "Ataca duas vezes em sequência rápida, cada golpe com 85% ATK.f.", icon: "wind" },
      { name: "Névoa do Gato", type: "ativa", description: "Cria névoa de ilusões: +40% esquiva e confunde o inimigo por 3 turnos.", icon: "cloud" },
      { name: "Pounce das Sombras", type: "ativa", description: "Ataca do ponto cego: ignora completamente a defesa neste turno.", icon: "arrow-right" },
      { name: "Nove Vidas", type: "passiva", description: "Uma vez por batalha, sobrevive com 1 HP ao invés de morrer.", icon: "heart" },
    ],
  },
  {
    id: "homem_lagarto",
    name: "Homem-Lagarto",
    emoji: "🦎",
    color: "#388E3C",
    lore: "Antigos como a terra e resistentes como as pedras, os Homens-Lagarto são a muralha viva do mundo. Suas escamas defletem o que a maioria não suporta.",
    primaryElements: ["terra", "agua"],
    learnableElements: ["veneno", "metal", "natureza"],
    stats: { ...EMPTY_STATS, hp: 50, armor: 14, atkF: 10, critBonus: 0.01, luck: 0.0001, dodge: 0.01, hpRegen: 3, armorPen: 2 },
    resistances: { terra: 30, agua: 25, veneno: 20, fogo: -10 },
    abilities: [
      { name: "Escamas de Aço", type: "ativa", description: "Endurece escamas: +100% armadura por 3 turnos e reflete 15% do dano.", icon: "shield" },
      { name: "Cauda Devastadora", type: "ativa", description: "Golpe de cauda que atingiu o inimigo 2 vezes e aplica veneno.", icon: "zap" },
      { name: "Veneno de Lagarto", type: "ativa", description: "Injeta veneno potente: dano crescente por 6 turnos.", icon: "droplet" },
      { name: "Regeneração de Escamas", type: "passiva", description: "Reduz dano recebido em 10% passivamente. Regenera 3 HP/turno.", icon: "refresh-cw" },
    ],
  },
  {
    id: "kitsune",
    name: "Kitsune",
    emoji: "🦊",
    color: "#FF7043",
    lore: "Espíritos-raposa de poder ancestral, os Kitsune crescem mais sábios e poderosos com cada rabo que desenvolvem. Sua astúcia é sua arma definitiva.",
    primaryElements: ["fogo", "arcano"],
    learnableElements: ["runico", "ar", "luz", "void"],
    stats: { ...EMPTY_STATS, hp: 15, atkM: 16, magicPower: 5, critBonus: 0.025, dodge: 0.025, luck: 0.0005, fortune: 2, speed: 3 },
    resistances: { fogo: 25, arcano: 20 },
    abilities: [
      { name: "Chamas do Kitsune", type: "ativa", description: "Lança chamas foxfire azuis de Fogo+Arcano que ignoram resistências normais.", icon: "zap" },
      { name: "Ilusão das Raposas", type: "ativa", description: "Cria 3 ilusões: inimigo erra os próximos 3 ataques obrigatoriamente.", icon: "eye-off" },
      { name: "Rabos de Poder", type: "ativa", description: "Ataca com múltiplos rabos mágicos: de 2 a 9 golpes de 70% ATK.m.", icon: "star" },
      { name: "Astúcia do Kitsune", type: "passiva", description: "Sorte afeta crítico, esquiva e drop de itens. Sorte máxima aumentada em 30%.", icon: "trending-up" },
    ],
  },
];

export function getRaceById(id: RaceId): RaceDef | undefined {
  return RACES.find((r) => r.id === id);
}

export const LUCK_MAX = 0.20;
export const DODGE_MAX = 0.35;
