// Sistema de Cidade - Lojas e NPCs

export type CityBuilding = "shop" | "blacksmith" | "enchanter" | "artisan";

export interface BuildingDef {
  id: CityBuilding;
  name: string;
  emoji: string;
  description: string;
  color: string;
  unlockLevel: number;
}

export const CITY_BUILDINGS: Record<CityBuilding, BuildingDef> = {
  shop: {
    id: "shop",
    name: "Loja Geral",
    emoji: "🏪",
    description: "Compre poções, itens consumíveis e materiais básicos",
    color: "#22c55e",
    unlockLevel: 1,
  },
  blacksmith: {
    id: "blacksmith",
    name: "Ferreiro",
    emoji: "⚒️",
    description: "Forje, aprimore e repare seus equipamentos",
    color: "#f59e0b",
    unlockLevel: 5,
  },
  enchanter: {
    id: "enchanter",
    name: "Imbuidor",
    emoji: "🔮",
    description: "Encante equipamentos com propriedades mágicas",
    color: "#a855f7",
    unlockLevel: 15,
  },
  artisan: {
    id: "artisan",
    name: "Artesão",
    emoji: "🎨",
    description: "Crie itens especiais, joias e consumíveis únicos",
    color: "#ec4899",
    unlockLevel: 25,
  },
};

// Itens da loja
export interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
  price: { type: "copper" | "silver" | "gold" | "diamond"; amount: number };
  effect?: string;
  requiredLevel: number;
}

export const SHOP_ITEMS: ShopItem[] = [
  // Poções de HP
  { id: "potion_hp_small", name: "Poção de HP Pequena", emoji: "🧪", description: "Recupera 50 HP", price: { type: "copper", amount: 50 }, effect: "heal_50", requiredLevel: 1 },
  { id: "potion_hp_medium", name: "Poção de HP Média", emoji: "🧪", description: "Recupera 200 HP", price: { type: "copper", amount: 200 }, effect: "heal_200", requiredLevel: 10 },
  { id: "potion_hp_large", name: "Poção de HP Grande", emoji: "🧪", description: "Recupera 500 HP", price: { type: "silver", amount: 50 }, effect: "heal_500", requiredLevel: 25 },
  { id: "potion_hp_greater", name: "Poção de HP Superior", emoji: "🧪", description: "Recupera 1000 HP", price: { type: "silver", amount: 200 }, effect: "heal_1000", requiredLevel: 50 },
  
  // Poções de Mana
  { id: "potion_mp_small", name: "Poção de Mana Pequena", emoji: "💧", description: "Recupera 30 MP", price: { type: "copper", amount: 75 }, effect: "mana_30", requiredLevel: 1 },
  { id: "potion_mp_medium", name: "Poção de Mana Média", emoji: "💧", description: "Recupera 100 MP", price: { type: "copper", amount: 300 }, effect: "mana_100", requiredLevel: 10 },
  { id: "potion_mp_large", name: "Poção de Mana Grande", emoji: "💧", description: "Recupera 250 MP", price: { type: "silver", amount: 75 }, effect: "mana_250", requiredLevel: 25 },
  
  // Poções de buff
  { id: "potion_atk", name: "Poção de Força", emoji: "⚔️", description: "+20% ATK por 10 minutos", price: { type: "silver", amount: 100 }, effect: "buff_atk_20", requiredLevel: 15 },
  { id: "potion_def", name: "Poção de Defesa", emoji: "🛡️", description: "+20% DEF por 10 minutos", price: { type: "silver", amount: 100 }, effect: "buff_def_20", requiredLevel: 15 },
  { id: "potion_speed", name: "Poção de Velocidade", emoji: "⚡", description: "+20% Velocidade por 10 minutos", price: { type: "silver", amount: 100 }, effect: "buff_speed_20", requiredLevel: 15 },
  { id: "potion_luck", name: "Poção da Sorte", emoji: "🍀", description: "+50% Chance de Drop por 10 minutos", price: { type: "gold", amount: 10 }, effect: "buff_luck_50", requiredLevel: 30 },
  
  // Scrolls
  { id: "scroll_recall", name: "Scroll de Retorno", emoji: "📜", description: "Retorna à cidade instantaneamente", price: { type: "silver", amount: 50 }, effect: "recall", requiredLevel: 1 },
  { id: "scroll_identify", name: "Scroll de Identificação", emoji: "📜", description: "Identifica um item não identificado", price: { type: "silver", amount: 25 }, effect: "identify", requiredLevel: 5 },
  
  // Materiais
  { id: "material_herb", name: "Erva Medicinal", emoji: "🌿", description: "Material para criação de poções", price: { type: "copper", amount: 10 }, requiredLevel: 1 },
  { id: "material_ore", name: "Minério de Ferro", emoji: "⛏️", description: "Material para forja", price: { type: "copper", amount: 20 }, requiredLevel: 5 },
  { id: "material_leather", name: "Couro", emoji: "🟫", description: "Material para criação", price: { type: "copper", amount: 15 }, requiredLevel: 1 },
];

// Serviços do ferreiro
export interface BlacksmithService {
  id: string;
  name: string;
  emoji: string;
  description: string;
  basePrice: number;
  currency: "copper" | "silver" | "gold";
}

export const BLACKSMITH_SERVICES: BlacksmithService[] = [
  { id: "repair", name: "Reparar Equipamento", emoji: "🔧", description: "Repara a durabilidade de um item", basePrice: 100, currency: "copper" },
  { id: "upgrade", name: "Aprimorar", emoji: "⬆️", description: "Aumenta o tier de um equipamento", basePrice: 500, currency: "silver" },
  { id: "reforge", name: "Rerrforjar", emoji: "🔨", description: "Muda os atributos de um item", basePrice: 200, currency: "silver" },
  { id: "socket", name: "Adicionar Soquete", emoji: "💎", description: "Adiciona um soquete para gemas", basePrice: 1000, currency: "silver" },
];

// Serviços do imbuidor
export interface EnchantService {
  id: string;
  name: string;
  emoji: string;
  description: string;
  effect: string;
  basePrice: number;
  currency: "gold" | "diamond";
}

export const ENCHANT_SERVICES: EnchantService[] = [
  { id: "enchant_fire", name: "Encantamento de Fogo", emoji: "🔥", description: "Adiciona dano de fogo", effect: "fire_dmg", basePrice: 5, currency: "gold" },
  { id: "enchant_ice", name: "Encantamento de Gelo", emoji: "❄️", description: "Adiciona dano de gelo", effect: "ice_dmg", basePrice: 5, currency: "gold" },
  { id: "enchant_lightning", name: "Encantamento de Raio", emoji: "⚡", description: "Adiciona dano de raio", effect: "lightning_dmg", basePrice: 5, currency: "gold" },
  { id: "enchant_life", name: "Encantamento de Vida", emoji: "💚", description: "Aumenta HP máximo", effect: "max_hp", basePrice: 10, currency: "gold" },
  { id: "enchant_mana", name: "Encantamento de Mana", emoji: "💙", description: "Aumenta MP máximo", effect: "max_mp", basePrice: 10, currency: "gold" },
];

// Receitas do artesão
export interface ArtisanRecipe {
  id: string;
  name: string;
  emoji: string;
  description: string;
  materials: { id: string; amount: number }[];
  result: string;
}

export const ARTISAN_RECIPES: ArtisanRecipe[] = [
  { 
    id: "craft_hp_potion", 
    name: "Poção de HP", 
    emoji: "🧪", 
    description: "Cria uma poção de cura", 
    materials: [{ id: "material_herb", amount: 3 }],
    result: "potion_hp_small"
  },
  { 
    id: "craft_mp_potion", 
    name: "Poção de Mana", 
    emoji: "💧", 
    description: "Cria uma poção de mana", 
    materials: [{ id: "material_herb", amount: 2 }, { id: "material_ore", amount: 1 }],
    result: "potion_mp_small"
  },
];
