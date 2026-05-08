import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RaceId, getRaceById, RaceAbility } from "@/constants/races";
import { ElementId } from "@/constants/elements";

const USERS_KEY = "rpg_idle_users_v4";
const CURRENT_USER_KEY = "rpg_idle_current_user_v4";

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
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
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
  gold: number;
  diamonds: number;
  
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

const DEFAULT_STATE: GameState = {
  username: "",
  isLoggedIn: false,
  playerName: "",
  raceId: null,
  gender: null,
  level: 1,
  exp: 0,
  gold: 0,
  diamonds: 0,
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
  addGold: (amount: number) => void;
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

    // Initialize skills from race abilities with level requirements
    const activeAbilities = race.abilities.filter(a => a.type === "ativa");
    const activeSkills: ActiveSkill[] = activeAbilities.map((ability, index) => ({
      ability,
      cooldown: 0,
      maxCooldown: 5 + index * 2, // Skill 1: 5 turns, Skill 2: 7 turns, Skill 3: 9 turns
      unlocked: index === 0, // First skill unlocked at start
      levelRequired: 1 + index * 5, // Skill 1: lv1, Skill 2: lv6, Skill 3: lv11
    }));

    // Build resistance map from race resistances
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
      baseCritRate: 0.03 + (race.stats.critBonus || 0), // Base 3% + race bonus
      baseCritDmg: 1.3 + (race.stats.critMultBonus || 0), // Base 130% + race bonus
      baseAtkSpeed: 1 + (race.stats.speed || 0) * 0.05,
      baseLuck: 0.001 + (race.stats.luck || 0),
      baseDodge: 0.01 + (race.stats.dodge || 0),
      baseLifeSteal: Math.min(race.stats.lifeSteal || 0, 0.03), // Cap at 3% early game
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
        gold: prev.gold + item.value,
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

    // Add equipment stats
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
        
        // Elemental resistances
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

    // Cap some stats
    critRate = Math.min(critRate, 0.8); // Max 80% crit rate
    dodge = Math.min(dodge, 0.6); // Max 60% dodge
    lifeSteal = Math.min(lifeSteal, 0.25); // Max 25% life steal

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

  const addGold = (amount: number) => {
    setState((prev) => ({ ...prev, gold: prev.gold + amount }));
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
        getTotalStats,
        getAllRaceStats,
        addGold,
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
