// Sistema Base de Equipamentos
// Define os tipos, slots e estrutura base

export type WeaponType = 
  | "espada" | "espada_dupla" | "adaga" | "adaga_dupla" 
  | "machado" | "martelo" | "maca" | "foice"
  | "arco" | "varinha" | "cajado" | "lanca";

export type HeadType = "elmo" | "capuz" | "capacete" | "coroa" | "mascara" | "bandana";

export type ChestType = "armadura" | "robe" | "casaco" | "colete" | "tunica" | "couraca";

export type LegsType = "calca" | "saia" | "bermuda" | "grevas" | "calcas";

export type FeetType = "botas" | "sandalias" | "sapatos" | "grevas_pes" | "meias";

export type OffHandType = 
  | "escudo" | "orb" | "tocha" | "grimorio" | "lume" 
  | "bengala" | "lanterna" | "totem" | "livro" | "adaga_off";

// Tipos de acessórios
export type EarringsType = "brinco" | "pendente" | "argola" | "plug" | "alargador" | "corrente";
export type NecklaceType = "colar" | "amuleto" | "medalhao" | "gargantilha" | "rosario" | "pingente";
export type FaceType = "mascara" | "oculos" | "piercing" | "bandana" | "venda" | "monoculo" | "tatuagem";

// Tipos de anéis
export type RingType = 
  | "anel" | "anel_selo" | "anel_sinete" | "anel_claddagh" | "anel_pois"
  | "anel_sol" | "anel_lua" | "anel_estrela" | "anel_dragao" | "anel_fenix"
  | "anel_lobo" | "anel_urso" | "anel_tigre" | "anel_serpente" | "anel_coruja"
  | "anel_elemental" | "anel_runico" | "anel_magico" | "anel_sagrado" | "anel_profano";

// Tipos de capas
export type CapeType = 
  | "capa" | "capa_real" | "capa_sombria" | "capa_elfica" | "capa_guilda"
  | "capa_gelo" | "capa_fogo" | "capa_trovao" | "capa_natureza" | "capa_vazio"
  | "capa_demoniaca" | "capa_angelical" | "capa_dragonica" | "capa_fantasma" | "capa_manto";

// Tipos de braceletes
export type BraceletType = 
  | "bracelete" | "bracelete_corrente" | "bracelete_couro" | "bracelete_metal"
  | "bracelete_runico" | "bracelete_magico" | "bracelete_gema" | "bracelete_tribal"
  | "pulseira" | "pulseira_perolas" | "pulseira_cristais" | "pulseira_ossos"
  | "manopla" | "manopla_guerra" | "manopla_magica" | "manopla_protetora"
  | "luva" | "luva_couro" | "luva_metal" | "luva_magica";

// Slots de equipamento (12 slots + 6 novos = 18 slots totais)
export type EquipmentSlot = 
  | "mainHand" | "offHand" 
  | "head" | "chest" | "legs" | "feet"
  | "earrings" | "necklace" | "face"
  | "ring1" | "ring2" | "ring3" | "ring4"
  | "cape" | "bracelet";

export interface EquipmentBase {
  id: string;
  name: string;
  slot: EquipmentSlot;
  type: WeaponType | HeadType | ChestType | LegsType | FeetType | OffHandType | EarringsType | NecklaceType | FaceType | RingType | CapeType | BraceletType;
  tier: "F" | "E" | "D" | "C" | "B" | "A" | "S" | "SS" | "SSS" | "SSS+";
  level: number;
  // Stats base
  atkF: number;
  atkM: number;
  def: number;
  armor: number;
  magicRes: number;
  hp: number;
  mp: number;
  critRate: number;
  critDmg: number;
  atkSpeed: number;
  dodge: number;
  // Efeitos
  passiveEffect?: string;
  activeSkill?: {
    name: string;
    description: string;
    cooldown: number;
    manaCost: number;
  };
  // Visual
  icon: string;
  color: string;
  // Set/Collection
  setName?: string;
  setBonus?: {
    requiredPieces: number;
    bonus: string;
    stats: Partial<EquipmentBase>;
  };
}

// Multiplicadores por tier
export const TIER_MULTIPLIERS: Record<EquipmentBase["tier"], { statMult: number; dropRate: number; color: string }> = {
  "F": { statMult: 0.5, dropRate: 35, color: "#9ca3af" },
  "E": { statMult: 0.7, dropRate: 25, color: "#22c55e" },
  "D": { statMult: 1.0, dropRate: 18, color: "#3b82f6" },
  "C": { statMult: 1.4, dropRate: 12, color: "#a855f7" },
  "B": { statMult: 2.0, dropRate: 6, color: "#f59e0b" },
  "A": { statMult: 3.0, dropRate: 3, color: "#ef4444" },
  "S": { statMult: 5.0, dropRate: 1, color: "#ec4899" },
  "SS": { statMult: 8.0, dropRate: 0.4, color: "#22d3ee" },
  "SSS": { statMult: 15.0, dropRate: 0.1, color: "#fbbf24" },
  "SSS+": { statMult: 30.0, dropRate: 0.01, color: "#ffffff" },
};
