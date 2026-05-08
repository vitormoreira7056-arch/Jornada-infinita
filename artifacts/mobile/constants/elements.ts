// Sistema de Elementos - 21 Elementos Principais + Sub-elementos

export type ElementId = 
  // Elementos Básicos (6)
  | "fogo" | "agua" | "terra" | "ar" | "luz" | "escuridao"
  // Elementos Avançados (8)
  | "gelo" | "trovao" | "natureza" | "metal" | "veneno" | "sangue" | "arcano" | "caos"
  // Elementos Épicos (7)
  | "void" | "infernal" | "divino" | "sombra" | "tempestade" | "runico" | "astral"
  // Sub-elementos especiais
  | "sagrado";

// Sub-elementos - Combinações de elementos
export interface SubElement {
  id: string;
  name: string;
  description: string;
  parentElements: [ElementId, ElementId];
  color: string;
  emoji: string;
  effects: {
    damageBonus: number;
    resistanceBonus: number;
    specialEffect?: string;
  };
}

export const SUB_ELEMENTS: SubElement[] = [
  // Fogo + X
  { id: "magma", name: "Magma", description: "Fogo + Terra", parentElements: ["fogo", "terra"], color: "#ff4500", emoji: "🌋", effects: { damageBonus: 1.3, resistanceBonus: 1.2, specialEffect: "Queimadura prolongada" } },
  { id: "vapor", name: "Vapor", description: "Fogo + Água", parentElements: ["fogo", "agua"], color: "#ffd700", emoji: "💨", effects: { damageBonus: 1.2, resistanceBonus: 1.1, specialEffect: "Cegueira" } },
  { id: "plasma", name: "Plasma", description: "Fogo + Ar", parentElements: ["fogo", "ar"], color: "#ff1493", emoji: "⚡", effects: { damageBonus: 1.4, resistanceBonus: 1.0, specialEffect: "Penetração de armadura" } },
  { id: "solar", name: "Solar", description: "Fogo + Luz", parentElements: ["fogo", "luz"], color: "#ffff00", emoji: "☀️", effects: { damageBonus: 1.5, resistanceBonus: 1.3, specialEffect: "Dano extra em mortos-vivos" } },
  { id: "sombra_ardente", name: "Sombra Ardente", description: "Fogo + Escuridão", parentElements: ["fogo", "escuridao"], color: "#8b0000", emoji: "🔥", effects: { damageBonus: 1.35, resistanceBonus: 1.15, specialEffect: "Dano de alma" } },
  
  // Água + X
  { id: "geada", name: "Gelada Eterna", description: "Água + Gelo", parentElements: ["agua", "gelo"], color: "#e0ffff", emoji: "❄️", effects: { damageBonus: 1.25, resistanceBonus: 1.25, specialEffect: "Congelamento profundo" } },
  { id: "nevoa", name: "Névoa", description: "Água + Ar", parentElements: ["agua", "ar"], color: "#f0f8ff", emoji: "🌫️", effects: { damageBonus: 1.1, resistanceBonus: 1.3, specialEffect: "Evasão aumentada" } },
  { id: "lunar", name: "Lunar", description: "Água + Luz", parentElements: ["agua", "luz"], color: "#c0c0c0", emoji: "🌙", effects: { damageBonus: 1.3, resistanceBonus: 1.2, specialEffect: "Regeneração noturna" } },
  { id: "abismo", name: "Abismo", description: "Água + Escuridão", parentElements: ["agua", "escuridao"], color: "#000080", emoji: "🌊", effects: { damageBonus: 1.35, resistanceBonus: 1.15, specialEffect: "Sugamento de vida" } },
  
  // Terra + X
  { id: "cristal", name: "Cristal", description: "Terra + Luz", parentElements: ["terra", "luz"], color: "#e6e6fa", emoji: "💎", effects: { damageBonus: 1.2, resistanceBonus: 1.4, specialEffect: "Reflexão de dano" } },
  { id: "obsidiana", name: "Obsidiana", description: "Terra + Escuridão", parentElements: ["terra", "escuridao"], color: "#1a1a2e", emoji: "⬛", effects: { damageBonus: 1.3, resistanceBonus: 1.3, specialEffect: "Absorção de dano" } },
  { id: "ferro", name: "Ferro", description: "Terra + Metal", parentElements: ["terra", "metal"], color: "#708090", emoji: "⚙️", effects: { damageBonus: 1.15, resistanceBonus: 1.5, specialEffect: "Armadura reforçada" } },
  { id: "veneno_terrestre", name: "Peste", description: "Terra + Veneno", parentElements: ["terra", "veneno"], color: "#556b2f", emoji: "☠️", effects: { damageBonus: 1.4, resistanceBonus: 1.1, specialEffect: "Envenenamento em área" } },
  
  // Ar + X
  { id: "raio", name: "Raio", description: "Ar + Trovão", parentElements: ["ar", "trovao"], color: "#00ffff", emoji: "⚡", effects: { damageBonus: 1.45, resistanceBonus: 1.0, specialEffect: "Atordoamento" } },
  { id: "sonico", name: "Sônico", description: "Ar + Arcano", parentElements: ["ar", "arcano"], color: "#dda0dd", emoji: "🔊", effects: { damageBonus: 1.3, resistanceBonus: 1.1, specialEffect: "Silêncio mágico" } },
  { id: "caos_aereo", name: "Ciclone", description: "Ar + Caos", parentElements: ["ar", "caos"], color: "#9932cc", emoji: "🌪️", effects: { damageBonus: 1.5, resistanceBonus: 0.9, specialEffect: "Dano aleatório" } },
  
  // Luz + X
  { id: "sagrado", name: "Sagrado", description: "Luz + Natureza", parentElements: ["luz", "natureza"], color: "#ffd700", emoji: "✨", effects: { damageBonus: 1.35, resistanceBonus: 1.25, specialEffect: "Cura ao causar dano" } },
  { id: "celestial", name: "Celestial", description: "Luz + Arcano", parentElements: ["luz", "arcano"], color: "#fffacd", emoji: "⭐", effects: { damageBonus: 1.4, resistanceBonus: 1.2, specialEffect: "Dano verdadeiro" } },
  { id: "ordem", name: "Ordem", description: "Luz + Metal", parentElements: ["luz", "metal"], color: "#f5f5dc", emoji: "⚖️", effects: { damageBonus: 1.25, resistanceBonus: 1.35, specialEffect: "Remoção de buffs" } },
  
  // Escuridão + X
  { id: "necrotico", name: "Necrótico", description: "Escuridão + Sangue", parentElements: ["escuridao", "sangue"], color: "#4b0082", emoji: "💀", effects: { damageBonus: 1.45, resistanceBonus: 1.1, specialEffect: "Dreno de vida" } },
  { id: "corrupto", name: "Corrupto", description: "Escuridão + Veneno", parentElements: ["escuridao", "veneno"], color: "#2f004f", emoji: "🦠", effects: { damageBonus: 1.4, resistanceBonus: 1.15, specialEffect: "Decomposição" } },
  { id: "void", name: "Vazio", description: "Escuridão + Void", parentElements: ["escuridao", "void"], color: "#000000", emoji: "🕳️", effects: { damageBonus: 1.6, resistanceBonus: 1.0, specialEffect: "Aniquilação" } },
  
  // Elementos Épicos Combinados
  { id: "inferno", name: "Inferno", description: "Fogo + Infernal", parentElements: ["fogo", "infernal"], color: "#dc143c", emoji: "🔥", effects: { damageBonus: 1.7, resistanceBonus: 1.3, specialEffect: "Queimadura eterna" } },
  { id: "divino", name: "Divino Supremo", description: "Luz + Divino", parentElements: ["luz", "divino"], color: "#ffffff", emoji: "👑", effects: { damageBonus: 1.8, resistanceBonus: 1.5, specialEffect: "Ressurreição passiva" } },
  { id: "temporal", name: "Temporal", description: "Arcano + Astral", parentElements: ["arcano", "astral"], color: "#00ced1", emoji: "⏳", effects: { damageBonus: 1.6, resistanceBonus: 1.2, specialEffect: "Manipulação do tempo" } },
  { id: "prismatico", name: "Prismático", description: "Todos os elementos básicos", parentElements: ["fogo", "agua"], color: "#ff00ff", emoji: "🌈", effects: { damageBonus: 2.0, resistanceBonus: 1.8, specialEffect: "Dano de todos os elementos" } },
];

// Elementos principais para exibição
export const MAIN_ELEMENTS: { id: ElementId; name: string; emoji: string; color: string; description: string }[] = [
  { id: "fogo", name: "Fogo", emoji: "🔥", color: "#ff4444", description: "Queima tudo em seu caminho" },
  { id: "agua", name: "Água", emoji: "💧", color: "#4444ff", description: "Fluido e adaptável" },
  { id: "terra", name: "Terra", emoji: "🌍", color: "#8b4513", description: "Sólido e resistente" },
  { id: "ar", name: "Ar", emoji: "💨", color: "#87ceeb", description: "Veloz e imprevisível" },
  { id: "luz", name: "Luz", emoji: "☀️", color: "#ffd700", description: "Ilumina e purifica" },
  { id: "escuridao", name: "Escuridão", emoji: "🌑", color: "#4b0082", description: "Consome e corrompe" },
  { id: "gelo", name: "Gelo", emoji: "❄️", color: "#e0ffff", description: "Congela até o tempo" },
  { id: "trovao", name: "Trovão", emoji: "⚡", color: "#ffff00", description: "Rápido e devastador" },
  { id: "natureza", name: "Natureza", emoji: "🌿", color: "#228b22", description: "Cresce e adapta-se" },
  { id: "metal", name: "Metal", emoji: "⚙️", color: "#c0c0c0", description: "Indestrutível e afiado" },
  { id: "veneno", name: "Veneno", emoji: "☠️", color: "#32cd32", description: "Mata silenciosamente" },
  { id: "sangue", name: "Sangue", emoji: "🩸", color: "#8b0000", description: "Vida e morte unidas" },
  { id: "arcano", name: "Arcano", emoji: "🔮", color: "#9370db", description: "Magia pura e bruta" },
  { id: "caos", name: "Caos", emoji: "🌀", color: "#9932cc", description: "Imprevisível e destrutivo" },
  { id: "void", name: "Vazio", emoji: "🕳️", color: "#000000", description: "O nada absoluto" },
  { id: "infernal", name: "Infernal", emoji: "👹", color: "#dc143c", description: "Fogo demoníaco" },
  { id: "divino", name: "Divino", emoji: "😇", color: "#ffffff", description: "Poder celestial" },
  { id: "sombra", name: "Sombras", emoji: "👤", color: "#2f2f2f", description: "A escuridão viva" },
  { id: "tempestade", name: "Tempestade", emoji: "⛈️", color: "#4682b4", description: "Fúria dos céus" },
  { id: "runico", name: "Rúnico", emoji: "ᚢ", color: "#ff8c00", description: "Magia ancestral" },
  { id: "astral", name: "Astral", emoji: "🌌", color: "#191970", description: "Energia das estrelas" },
  { id: "sagrado", name: "Sagrado", emoji: "✨", color: "#ffd700", description: "Poder sagrado divino" },
];

// Resistências base por elemento
export function getBaseResistance(element: ElementId): number {
  const resistances: Record<ElementId, number> = {
    fogo: 0, agua: 0, terra: 0, ar: 0, luz: 0, escuridao: 0,
    gelo: 0, trovao: 0, natureza: 0, metal: 0, veneno: 0, sangue: 0,
      arcano: 0, caos: 0, void: 0, infernal: 0, divino: 0, sombra: 0,
    tempestade: 0, runico: 0, astral: 0, sagrado: 0,
  };
  return resistances[element] || 0;
}

// Verificar sinergia entre elementos
export function checkElementSynergy(elem1: ElementId, elem2: ElementId): SubElement | null {
  return SUB_ELEMENTS.find(sub => 
    (sub.parentElements[0] === elem1 && sub.parentElements[1] === elem2) ||
    (sub.parentElements[0] === elem2 && sub.parentElements[1] === elem1)
  ) || null;
}

// Tipo para mapa de resistências
export type ResistanceMap = Record<ElementId, number>;
