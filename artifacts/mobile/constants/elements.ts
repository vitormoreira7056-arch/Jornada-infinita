export type ElementId =
  | "fogo" | "agua" | "terra" | "trovao" | "gelo" | "vento" | "escuridao" | "luz"
  | "arcano" | "veneno" | "metal" | "natureza" | "sangue" | "void" | "caos"
  | "sagrado" | "sombra" | "infernal" | "tempestade" | "runico" | "divino";

export interface ElementDef {
  id: ElementId;
  name: string;
  emoji: string;
  color: string;
  category: "basico" | "avancado" | "variante";
  parentId?: ElementId;
  description: string;
  variants?: ElementId[];
}

export const ELEMENTS: Record<ElementId, ElementDef> = {
  // BÁSICOS
  fogo: {
    id: "fogo", name: "Fogo", emoji: "🔥", color: "#FF5722", category: "basico",
    description: "Chamas que consomem tudo. Alta ofensividade, queima ao longo do tempo.",
    variants: ["infernal", "sagrado"],
  },
  agua: {
    id: "agua", name: "Água", emoji: "💧", color: "#2196F3", category: "basico",
    description: "Fluida e adaptável. Cura, controle e devastação em tempestades.",
    variants: ["tempestade"],
  },
  terra: {
    id: "terra", name: "Terra", emoji: "🌍", color: "#795548", category: "basico",
    description: "Resistência e força bruta. Defesas impenetráveis e golpes esmagadores.",
  },
  trovao: {
    id: "trovao", name: "Trovão", emoji: "⚡", color: "#FFC107", category: "basico",
    description: "Velocidade e poder devastador. Paralisia e dano em área.",
  },
  gelo: {
    id: "gelo", name: "Gelo", emoji: "❄️", color: "#00BCD4", category: "basico",
    description: "Controle absoluto. Congela inimigos e reduz velocidade.",
  },
  vento: {
    id: "vento", name: "Vento", emoji: "🌪️", color: "#80CBC4", category: "basico",
    description: "Agilidade e mobilidade. Esquiva aprimorada e ataques em rajada.",
  },
  escuridao: {
    id: "escuridao", name: "Escuridão", emoji: "🌑", color: "#7C4DFF", category: "basico",
    description: "Poder das trevas. Enfraquece e corrompe os inimigos.",
    variants: ["sombra"],
  },
  luz: {
    id: "luz", name: "Luz", emoji: "☀️", color: "#FFD54F", category: "basico",
    description: "Pureza e poder sagrado. Extra efetivo contra trevas.",
    variants: ["sagrado", "divino"],
  },
  // AVANÇADOS
  arcano: {
    id: "arcano", name: "Arcano", emoji: "✨", color: "#CE93D8", category: "avancado",
    description: "Magia pura e instável. Potencializa outros elementos.",
    variants: ["runico"],
  },
  veneno: {
    id: "veneno", name: "Veneno", emoji: "☠️", color: "#8BC34A", category: "avancado",
    description: "Dano ao longo do tempo e enfraquecimento progressivo.",
  },
  metal: {
    id: "metal", name: "Metal", emoji: "⚙️", color: "#90A4AE", category: "avancado",
    description: "Dureza e penetração. Ignora parte da defesa inimiga.",
    variants: ["runico"],
  },
  natureza: {
    id: "natureza", name: "Natureza", emoji: "🌿", color: "#66BB6A", category: "avancado",
    description: "Equilíbrio entre ataque e cura. Regeneração passiva.",
  },
  sangue: {
    id: "sangue", name: "Sangue", emoji: "🩸", color: "#D32F2F", category: "avancado",
    description: "Roubo de vida e sacrifício por poder. Vampirismo.",
  },
  void: {
    id: "void", name: "Void", emoji: "🌌", color: "#3949AB", category: "avancado",
    description: "Poder do espaço vazio. Anula magias e destrói barreiras.",
  },
  caos: {
    id: "caos", name: "Caos", emoji: "💜", color: "#E91E63", category: "avancado",
    description: "Imprevisível e destrutivo. Efeitos aleatórios mas devastadores.",
  },
  // VARIANTES
  sagrado: {
    id: "sagrado", name: "Sagrado", emoji: "✝️", color: "#FFEE58", category: "variante",
    parentId: "luz",
    description: "Luz divina purificada. Extra efetivo contra mortos-vivos e demônios.",
  },
  sombra: {
    id: "sombra", name: "Sombra", emoji: "👤", color: "#424242", category: "variante",
    parentId: "escuridao",
    description: "Escuridão concentrada. Ataques invisíveis e ilusões mortais.",
  },
  infernal: {
    id: "infernal", name: "Infernal", emoji: "😈", color: "#BF360C", category: "variante",
    parentId: "fogo",
    description: "Fogo dos abismos. Ignora resistências normais ao fogo.",
  },
  tempestade: {
    id: "tempestade", name: "Tempestade", emoji: "🌩️", color: "#1565C0", category: "variante",
    parentId: "agua",
    description: "Fusão de água e trovão. AOE massivo e paralisação.",
  },
  runico: {
    id: "runico", name: "Rúnico", emoji: "🔣", color: "#AB47BC", category: "variante",
    parentId: "arcano",
    description: "Magia gravada em runas. Efeitos permanentes e amplificados.",
  },
  divino: {
    id: "divino", name: "Divino", emoji: "👑", color: "#F9A825", category: "variante",
    parentId: "luz",
    description: "Poder dos deuses. O mais puro de todos os elementos.",
  },
};

export function getElement(id: ElementId): ElementDef {
  return ELEMENTS[id];
}

export type ResistanceMap = Partial<Record<ElementId, number>>;
