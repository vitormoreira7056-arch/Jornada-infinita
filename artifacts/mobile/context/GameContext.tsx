import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RaceId, getRaceById, RaceAbility } from "@/constants/races";
import { ElementId } from "@/constants/elements";
import { TierId, QualityId, rollTier, rollQuality, getTotalMultiplier, TIERS, QUALITIES } from "@/constants/tiers";
import { BiomeId, DungeonDef, BIOMES, tryDiscoverDungeon, calculateExpNeeded, TOWER_FLOORS_DATA, TowerFloor } from "@/constants/adventure";

const USERS_KEY = "rpg_idle_users_v5";
const CURRENT_USER_KEY = "rpg_idle_current_user_v5";

// 21 slots de equipamento
export type EquipmentSlot =
  | "helmet" | "chest" | "legs" | "boots"
  | "mainHand" | "offHand"
  | "cape" | "necklace" | "earrings"
  | "ring1" | "ring2" | "ring3" | "ring4"
  | "bracelet" | "face" | "shoulders"
  | "pet" | "spirit";

export interface Item {
  id: string;
  name: string;
  slot: EquipmentSlot;
  tier: TierId;
  quality: QualityId;
  // Stats
  hp: number;
  atkF: number;
  atkM: number;
  def: number;
  armor: number;
  magicRes: number;
  critRate: number;
  critDmg: number;
  atkSpeed: number;
  luck: number;
  dodge: number;
  lifeSteal: number;
  armorPen: number;
  hpRegen: number;
  // Elemental Resistances
  resFire: number;
  resWater: number;
  resEarth: number;
  resThunder: number;
  resIce: number;
  resWind: number;
  resDark: number;
  resLight: number;
  resArcane: number;
  resPoison: number;
  resMetal: number;
  resNature: number;
  resBlood: number;
  resVoid: number;
  resChaos: number;
  resHoly: number;
  resShadow: number;
  resInfernal: number;
  resStorm: number;
  resRunic: number;
  resDivine: number;
  // Value
  value: number;
  // Visual
  icon: string;
}

export interface ActiveSkill {
  ability: RaceAbility;
  cooldown: number;
  maxCooldown: number;
  unlocked: boolean;
  levelRequired: number;
}

export interface Currencies {
  copper: number;    // Cobre
  bronze: number;    // Bronze
  silver: number;    // Prata
  gold: number;      // Ouro
  diamond: number;   // Diamante
  mithril: number;   // Mithril
}

export interface GameState {
  // Account
  username: string;
  isLoggedIn: boolean;
  
  // Player
  playerName: string;
  raceId: RaceId | null;
  gender: "male" | "female" | null;
  level: number;
  exp: number;
  maxLevel: number;
  
  // Currencies
  currencies: Currencies;
  
  // Adventure
  discoveredDungeons: string[];
  currentBiome: BiomeId | null;
  towerProgress: number; // Último andar completado
  unlockedFloors: number[]; // Andares desbloqueados na Torre
  
  // Stats base
  baseHp: number;
  baseAtkF: number;
  baseAtkM: number;
  baseDef: number;
  baseArmor: number;
  baseMagicRes: number;
  baseCritRate: number;
  baseCritDmg: number;
  baseAtkSpeed: number;
  baseLuck: number;
  baseDodge: number;
  baseLifeSteal: number;
  baseArmorPen: number;
  baseHpRegen: number;
  
  // Elemental Resistances base
  baseRes: Record<ElementId, number>;
  
  // Skills
  activeSkills: ActiveSkill[];
  passiveSkillUnlocked: boolean;
  
  // Equipment (21 slots)
  equipment: Record<EquipmentSlot, Item | null>;
  
  // Inventory
  inventory: Item[];
  inventorySize: number;
  
  // Unlocked content
  maxZone: number;
  completedZones: number[];
}

const DEFAULT_RES: Record<ElementId, number> = {
  fogo: 0, agua: 0, terra: 0, trovao: 0, gelo: 0, vento: 0, escuridao: 0, luz: 0,
  arcano: 0, veneno: 0, metal: 0, natureza: 0, sangue: 0, void: 0, caos: 0,
  sagrado: 0, sombra: 0, infernal: 0, tempestade: 0, runico: 0, divino: 0,
};

const DEFAULT_CURRENCIES: Currencies = {
  copper: 0,
  bronze: 0,
  silver: 0,
  gold: 0,
  diamond: 0,
  mithril: 0,
};

const DEFAULT_STATE: GameState = {
  username: "",
  isLoggedIn: false,
  playerName: "",
  raceId: null,
  gender: null,
  level: 1,
  exp: 0,
  maxLevel: 300,
  currencies: { ...DEFAULT_CURRENCIES },
  discoveredDungeons: [],
  currentBiome: null,
  towerProgress: 0,
  unlockedFloors: [1],
  baseHp: 100,
  baseAtkF: 10,
  baseAtkM: 10,
  baseDef: 5,
  baseArmor: 0,
  baseMagicRes: 0,
  baseCritRate: 0.05,
  baseCritDmg: 1.5,
  baseAtkSpeed: 1,
  baseLuck: 0.001,
  baseDodge: 0.01,
  baseLifeSteal: 0,
  baseArmorPen: 0,
  baseHpRegen: 0,
  baseRes: { ...DEFAULT_RES },
  activeSkills: [],
  passiveSkillUnlocked: false,
  equipment: {
    helmet: null, chest: null, legs: null, boots: null,
    mainHand: null, offHand: null, cape: null, necklace: null,
    earrings: null, ring1: null, ring2: null, ring3: null, ring4: null,
    bracelet: null, face: null, shoulders: null, pet: null, spirit: null,
  },
  inventory: [],
  inventorySize: 50,
  maxZone: 1,
  completedZones: [],
};

interface GameContextType {
  state: GameState;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setPlayerName: (name: string) => void;
  selectRace: (raceId: RaceId, gender: "male" | "female") => void;
  equipItem: (item: Item, slot: EquipmentSlot) => void;
  unequipItem: (slot: EquipmentSlot) => void;
  sellItem: (itemId: string) => void;
  useSkill: (skillIndex: number) => void;
  addCurrency: (type: keyof Currencies, amount: number) => void;
  generateItem: (slot: EquipmentSlot) => Item;
  getItemColor: (item: Item) => string;
  exploreBiome: (biomeId: BiomeId) => { found: boolean; dungeon?: DungeonDef; expGained: number };
  getExpNeeded: () => number;
  getExpProgress: () => number;
  climbTower: (floor: number) => boolean;
  getTotalStats: () => {
    hp: number;
    atkF: number;
    atkM: number;
    def: number;
    armor: number;
    magicRes: number;
    critRate: number;
    critDmg: number;
    atkSpeed: number;
    luck: number;
    dodge: number;
    lifeSteal: number;
    armorPen: number;
    hpRegen: number;
    res: Record<ElementId, number>;
  };
  getAllRaceStats: (raceId: RaceId) => {
    hp: number;
    atkF: number;
    atkM: number;
    def: number;
    armor: number;
    magicRes: number;
    critRate: number;
    critDmg: number;
    atkSpeed: number;
    luck: number;
    dodge: number;
    lifeSteal: number;
    armorPen: number;
    hpRegen: number;
    res: Record<ElementId, number>;
  } | null;
}

const GameContext = createContext<GameContextType | null>(null);

function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      const currentUser = await AsyncStorage.getItem(CURRENT_USER_KEY);
      
      if (currentUser) {
        const userSaveKey = `save_${currentUser}`;
        const saved = await AsyncStorage.getItem(userSaveKey);
        
        if (saved) {
          const parsed = JSON.parse(saved);
          setState({
            ...DEFAULT_STATE,
            ...parsed,
            currencies: { ...DEFAULT_CURRENCIES, ...(parsed.currencies || {}) },
            equipment: { ...DEFAULT_STATE.equipment, ...(parsed.equipment || {}) },
            baseRes: { ...DEFAULT_RES, ...(parsed.baseRes || {}) },
            username: currentUser,
            isLoggedIn: true,
          });
        } else {
          setState({ ...DEFAULT_STATE, username: currentUser, isLoggedIn: true });
        }
      }
    } catch (e) {
      console.error("Failed to load save:", e);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (!isLoading && state.isLoggedIn && state.username) {
      const userSaveKey = `save_${state.username}`;
      AsyncStorage.setItem(userSaveKey, JSON.stringify(state));
    }
  }, [state, isLoading]);

  async function login(username: string, password: string): Promise<boolean> {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users: Record<string, string> = usersJson ? JSON.parse(usersJson) : {};
      
      if (users[username] && users[username] === hashPassword(password)) {
        await AsyncStorage.setItem(CURRENT_USER_KEY, username);
        
        const userSaveKey = `save_${username}`;
        const saved = await AsyncStorage.getItem(userSaveKey);
        
        if (saved) {
          const parsed = JSON.parse(saved);
          setState({
            ...DEFAULT_STATE,
            ...parsed,
            currencies: { ...DEFAULT_CURRENCIES, ...(parsed.currencies || {}) },
            equipment: { ...DEFAULT_STATE.equipment, ...(parsed.equipment || {}) },
            baseRes: { ...DEFAULT_RES, ...(parsed.baseRes || {}) },
            username,
            isLoggedIn: true,
          });
        } else {
          setState({ ...DEFAULT_STATE, username, isLoggedIn: true });
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error("Login error:", e);
      return false;
    }
  }

  async function register(username: string, password: string): Promise<boolean> {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users: Record<string, string> = usersJson ? JSON.parse(usersJson) : {};
      
      if (users[username]) {
        return false;
      }
      
      users[username] = hashPassword(password);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      await AsyncStorage.setItem(CURRENT_USER_KEY, username);
      
      const newState = { ...DEFAULT_STATE, username, isLoggedIn: true };
      setState(newState);
      await AsyncStorage.setItem(`save_${username}`, JSON.stringify(newState));
      
      return true;
    } catch (e) {
      console.error("Register error:", e);
      return false;
    }
  }

  async function logout() {
    try {
      if (state.username) {
        await AsyncStorage.setItem(`save_${state.username}`, JSON.stringify(state));
      }
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      setState(DEFAULT_STATE);
    } catch (e) {
      console.error("Logout error:", e);
    }
  }

  const setPlayerName = (name: string) => {
    setState((prev) => ({ ...prev, playerName: name }));
  };

  const selectRace = (raceId: RaceId, gender: "male" | "female") => {
    const race = getRaceById(raceId);
    if (!race) return;

    const activeAbilities = race.abilities.filter(a => a.type === "ativa");
    const activeSkills: ActiveSkill[] = activeAbilities.map((ability, index) => ({
      ability,
      cooldown: 0,
      maxCooldown: 5 + index * 2,
      unlocked: index === 0,
      levelRequired: 1 + index * 5,
    }));

    const res: Record<ElementId, number> = { ...DEFAULT_RES };
    Object.entries(race.resistances).forEach(([element, value]) => {
      if (element in res) {
        res[element as ElementId] = value;
      }
    });

    setState((prev) => ({
      ...prev,
      raceId,
      gender,
      baseHp: 100 + (race.stats.hp || 0),
      baseAtkF: 10 + (race.stats.atkF || 0),
      baseAtkM: 10 + (race.stats.atkM || 0),
      baseDef: 5 + (race.stats.def || 0),
      baseArmor: race.stats.armor || 0,
      baseMagicRes: race.stats.magicRes || 0,
      baseCritRate: 0.03 + (race.stats.critBonus || 0),
      baseCritDmg: 1.3 + (race.stats.critMultBonus || 0),
      baseAtkSpeed: 1 + (race.stats.speed || 0) * 0.05,
      baseLuck: 0.001 + (race.stats.luck || 0),
      baseDodge: 0.01 + (race.stats.dodge || 0),
      baseLifeSteal: Math.min(race.stats.lifeSteal || 0, 0.03),
      baseArmorPen: race.stats.armorPen || 0,
      baseHpRegen: race.stats.hpRegen || 0,
      baseRes: res,
      activeSkills,
      passiveSkillUnlocked: true,
    }));
  };

  const equipItem = (item: Item, slot: EquipmentSlot) => {
    setState((prev) => {
      const currentEquipped = prev.equipment[slot];
      const newInventory = [...prev.inventory];
      
      const itemIndex = newInventory.findIndex((i) => i.id === item.id);
      if (itemIndex > -1) {
        newInventory.splice(itemIndex, 1);
      }
      
      if (currentEquipped) {
        newInventory.push(currentEquipped);
      }
      
      return {
        ...prev,
        equipment: { ...prev.equipment, [slot]: item },
        inventory: newInventory,
      };
    });
  };

  const unequipItem = (slot: EquipmentSlot) => {
    setState((prev) => {
      const item = prev.equipment[slot];
      if (!item) return prev;
      
      if (prev.inventory.length >= prev.inventorySize) {
        return prev;
      }
      
      return {
        ...prev,
        equipment: { ...prev.equipment, [slot]: null },
        inventory: [...prev.inventory, item],
      };
    });
  };

  const sellItem = (itemId: string) => {
    setState((prev) => {
      const item = prev.inventory.find((i) => i.id === itemId);
      if (!item) return prev;
      return {
        ...prev,
        currencies: {
          ...prev.currencies,
          copper: prev.currencies.copper + item.value,
        },
        inventory: prev.inventory.filter((i) => i.id !== itemId),
      };
    });
  };

  const useSkill = (skillIndex: number) => {
    setState((prev) => {
      const skills = [...prev.activeSkills];
      if (skills[skillIndex] && skills[skillIndex].cooldown === 0 && skills[skillIndex].unlocked) {
        skills[skillIndex] = {
          ...skills[skillIndex],
          cooldown: skills[skillIndex].maxCooldown,
        };
      }
      return { ...prev, activeSkills: skills };
    });
  };

  const addCurrency = (type: keyof Currencies, amount: number) => {
    setState((prev) => ({
      ...prev,
      currencies: {
        ...prev.currencies,
        [type]: prev.currencies[type] + amount,
      },
    }));
  };

  const getTotalStats = () => {
    let hp = state.baseHp;
    let atkF = state.baseAtkF;
    let atkM = state.baseAtkM;
    let def = state.baseDef;
    let armor = state.baseArmor;
    let magicRes = state.baseMagicRes;
    let critRate = state.baseCritRate;
    let critDmg = state.baseCritDmg;
    let atkSpeed = state.baseAtkSpeed;
    let luck = state.baseLuck;
    let dodge = state.baseDodge;
    let lifeSteal = state.baseLifeSteal;
    let armorPen = state.baseArmorPen;
    let hpRegen = state.baseHpRegen;
    
    const res = { ...state.baseRes };

    Object.values(state.equipment).forEach((item) => {
      if (item) {
        hp += item.hp;
        atkF += item.atkF;
        atkM += item.atkM;
        def += item.def;
        armor += item.armor;
        magicRes += item.magicRes;
        critRate += item.critRate;
        critDmg += item.critDmg;
        atkSpeed += item.atkSpeed;
        luck += item.luck;
        dodge += item.dodge;
        lifeSteal += item.lifeSteal;
        armorPen += item.armorPen;
        hpRegen += item.hpRegen;
        
        res.fogo += item.resFire;
        res.agua += item.resWater;
        res.terra += item.resEarth;
        res.trovao += item.resThunder;
        res.gelo += item.resIce;
        res.vento += item.resWind;
        res.escuridao += item.resDark;
        res.luz += item.resLight;
        res.arcano += item.resArcane;
        res.veneno += item.resPoison;
        res.metal += item.resMetal;
        res.natureza += item.resNature;
        res.sangue += item.resBlood;
        res.void += item.resVoid;
        res.caos += item.resChaos;
        res.sagrado += item.resHoly;
        res.sombra += item.resShadow;
        res.infernal += item.resInfernal;
        res.tempestade += item.resStorm;
        res.runico += item.resRunic;
        res.divino += item.resDivine;
      }
    });

    critRate = Math.min(critRate, 0.8);
    dodge = Math.min(dodge, 0.6);
    lifeSteal = Math.min(lifeSteal, 0.25);

    return { hp, atkF, atkM, def, armor, magicRes, critRate, critDmg, atkSpeed, luck, dodge, lifeSteal, armorPen, hpRegen, res };
  };

  const getAllRaceStats = (raceId: RaceId) => {
    const race = getRaceById(raceId);
    if (!race) return null;

    const res: Record<ElementId, number> = { ...DEFAULT_RES };
    Object.entries(race.resistances).forEach(([element, value]) => {
      if (element in res) {
        res[element as ElementId] = value;
      }
    });

    return {
      hp: race.stats.hp,
      atkF: race.stats.atkF,
      atkM: race.stats.atkM,
      def: race.stats.def,
      armor: race.stats.armor,
      magicRes: race.stats.magicRes,
      critRate: race.stats.critBonus,
      critDmg: race.stats.critMultBonus,
      atkSpeed: race.stats.speed,
      luck: race.stats.luck,
      dodge: race.stats.dodge,
      lifeSteal: race.stats.lifeSteal,
      armorPen: race.stats.armorPen,
      hpRegen: race.stats.hpRegen,
      res,
    };
  };

  return (
    <GameContext.Provider
      value={{
        state,
        isLoading,
        login,
        register,
        logout,
        setPlayerName,
        selectRace,
        equipItem,
        unequipItem,
        sellItem,
        useSkill,
        addCurrency,
        generateItem,
        getItemColor,
        exploreBiome,
        getExpNeeded,
        getExpProgress,
        climbTower,
        getTotalStats,
        getAllRaceStats,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

// Função para explorar um bioma
function exploreBiome(biomeId: BiomeId): { found: boolean; dungeon?: DungeonDef; expGained: number } {
  const state = useGame().state;
  
  // Verificar se pode explorar
  const biome = BIOMES[biomeId];
  if (state.level < biome.minLevel) {
    return { found: false, expGained: 0 };
  }
  
  // Tentar encontrar dungeon
  const dungeon = tryDiscoverDungeon(biomeId, state.discoveredDungeons);
  
  // Calcular XP ganho baseado no nível do bioma
  const baseExp = 50 * biome.minLevel;
  const expGained = Math.floor(baseExp * (0.8 + Math.random() * 0.4));
  
  return {
    found: !!dungeon,
    dungeon: dungeon || undefined,
    expGained,
  };
}

// Função para obter XP necessário para o próximo nível
function getExpNeeded(): number {
  const state = useGame().state;
  return calculateExpNeeded(state.level);
}

// Função para obter progresso de XP
function getExpProgress(): number {
  const state = useGame().state;
  const needed = calculateExpNeeded(state.level);
  return (state.exp / needed) * 100;
}

// Função para subir um andar na Torre
function climbTower(floor: number): boolean {
  const state = useGame().state;
  
  // Verificar se o andar está desbloqueado
  if (!state.unlockedFloors.includes(floor)) return false;
  
  // Verificar se já completou este andar
  if (state.towerProgress >= floor) return false;
  
  const floorData = TOWER_FLOORS_DATA[floor - 1];
  
  // Verificar requisitos de grupo para bosses
  if (floorData.type === "boss" && floorData.minGroupSize > 1) {
    // TODO: Verificar se o jogador está em um grupo do tamanho adequado
  }
  
  return true;
}

// Função para gerar um item aleatório
function generateItem(slot: EquipmentSlot): Item {
  const tier = rollTier();
  const quality = rollQuality();
  const multiplier = getTotalMultiplier(tier, quality);
  
  // Base stats escalados pelo multiplicador
  const baseValue = 10;
  
  return {
    id: Date.now().toString(),
    name: `${TIERS[tier].name} ${slot}`,
    slot,
    tier,
    quality,
    hp: Math.floor(baseValue * multiplier * (Math.random() * 0.5 + 0.75)),
    atkF: slot === "mainHand" ? Math.floor(baseValue * multiplier * (Math.random() * 0.5 + 0.75)) : 0,
    atkM: slot === "mainHand" ? Math.floor(baseValue * 0.7 * multiplier * (Math.random() * 0.5 + 0.75)) : 0,
    def: 0,
    armor: ["helmet", "chest", "legs", "boots", "shoulders"].includes(slot) ? Math.floor(baseValue * 0.5 * multiplier) : 0,
    magicRes: ["helmet", "chest", "legs", "boots", "cape"].includes(slot) ? Math.floor(baseValue * 0.3 * multiplier) : 0,
    critRate: slot === "ring1" || slot === "ring2" ? 0.01 * multiplier : 0,
    critDmg: 0,
    atkSpeed: 0,
    luck: 0,
    dodge: slot === "boots" ? 0.01 * multiplier : 0,
    lifeSteal: 0,
    armorPen: 0,
    hpRegen: 0,
    resFire: 0,
    resWater: 0,
    resEarth: 0,
    resThunder: 0,
    resIce: 0,
    resWind: 0,
    resDark: 0,
    resLight: 0,
    resArcane: 0,
    resPoison: 0,
    resMetal: 0,
    resNature: 0,
    resBlood: 0,
    resVoid: 0,
    resChaos: 0,
    resHoly: 0,
    resShadow: 0,
    resInfernal: 0,
    resStorm: 0,
    resRunic: 0,
    resDivine: 0,
    value: Math.floor(baseValue * multiplier),
    icon: "🗡️",
  };
}

// Função para obter a cor do item
function getItemColor(item: Item): string {
  if (item.tier === "god") {
    return "#ffffff";
  }
  return TIERS[item.tier].color;
}
