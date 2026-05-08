import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RaceId, getRaceById, RaceAbility } from "@/constants/races";

const USERS_KEY = "rpg_idle_users_v3";
const CURRENT_USER_KEY = "rpg_idle_current_user_v3";

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
  critRate: number;
  critDmg: number;
  atkSpeed: number;
  moveSpeed: number;
  luck: number;
  dodge: number;
  lifeSteal: number;
  armorPen: number;
  hpRegen: number;
  // Elemental
  fireDmg: number;
  iceDmg: number;
  lightningDmg: number;
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
  baseCritRate: number;
  baseCritDmg: number;
  baseAtkSpeed: number;
  baseMoveSpeed: number;
  baseLuck: number;
  baseDodge: number;
  baseLifeSteal: number;
  baseArmorPen: number;
  baseHpRegen: number;
  
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
  baseCritRate: 0.05,
  baseCritDmg: 1.5,
  baseAtkSpeed: 1,
  baseMoveSpeed: 1,
  baseLuck: 0.001,
  baseDodge: 0.01,
  baseLifeSteal: 0,
  baseArmorPen: 0,
  baseHpRegen: 0,
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
    critRate: number;
    critDmg: number;
    atkSpeed: number;
    moveSpeed: number;
    luck: number;
    dodge: number;
    lifeSteal: number;
    armorPen: number;
    hpRegen: number;
  };
  getAllRaceStats: (raceId: RaceId) => {
    hp: number;
    atkF: number;
    atkM: number;
    def: number;
    critRate: number;
    critDmg: number;
    atkSpeed: number;
    moveSpeed: number;
    luck: number;
    dodge: number;
    lifeSteal: number;
    armorPen: number;
    hpRegen: number;
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

    // Initialize skills from race abilities
    const activeAbilities = race.abilities.filter(a => a.type === "ativa");
    const activeSkills: ActiveSkill[] = activeAbilities.map((ability, index) => ({
      ability,
      cooldown: 0,
      maxCooldown: 3 + index, // Skill 1: 3 turns, Skill 2: 4 turns, Skill 3: 5 turns
      unlocked: index === 0, // First skill unlocked, others at higher levels
    }));

    setState((prev) => ({
      ...prev,
      raceId,
      gender,
      baseHp: 100 + (race.stats.hp || 0),
      baseAtkF: 10 + (race.stats.atkF || 0),
      baseAtkM: 10 + (race.stats.atkM || 0),
      baseDef: 5 + (race.stats.armor || 0),
      baseCritRate: 0.05 + (race.stats.critBonus || 0),
      baseCritDmg: 1.5 + (race.stats.critMultBonus || 0),
      baseAtkSpeed: 1 + (race.stats.speed || 0) * 0.1,
      baseMoveSpeed: 1,
      baseLuck: 0.001 + (race.stats.luck || 0),
      baseDodge: 0.01 + (race.stats.dodge || 0),
      baseLifeSteal: race.stats.lifeSteal || 0,
      baseArmorPen: race.stats.armorPen || 0,
      baseHpRegen: race.stats.hpRegen || 0,
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
      if (skills[skillIndex] && skills[skillIndex].cooldown === 0) {
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
    let critRate = state.baseCritRate;
    let critDmg = state.baseCritDmg;
    let atkSpeed = state.baseAtkSpeed;
    let moveSpeed = state.baseMoveSpeed;
    let luck = state.baseLuck;
    let dodge = state.baseDodge;
    let lifeSteal = state.baseLifeSteal;
    let armorPen = state.baseArmorPen;
    let hpRegen = state.baseHpRegen;

    // Add equipment stats
    Object.values(state.equipment).forEach((item) => {
      if (item) {
        hp += item.hp;
        atkF += item.atkF;
        atkM += item.atkM;
        def += item.def;
        critRate += item.critRate;
        critDmg += item.critDmg;
        atkSpeed += item.atkSpeed;
        moveSpeed += item.moveSpeed;
        luck += item.luck;
        dodge += item.dodge;
        lifeSteal += item.lifeSteal;
        armorPen += item.armorPen;
        hpRegen += item.hpRegen;
      }
    });

    return { hp, atkF, atkM, def, critRate, critDmg, atkSpeed, moveSpeed, luck, dodge, lifeSteal, armorPen, hpRegen };
  };

  const getAllRaceStats = (raceId: RaceId) => {
    const race = getRaceById(raceId);
    if (!race) return null;

    return {
      hp: race.stats.hp,
      atkF: race.stats.atkF,
      atkM: race.stats.atkM,
      def: race.stats.armor,
      critRate: race.stats.critBonus,
      critDmg: race.stats.critMultBonus,
      atkSpeed: race.stats.speed,
      moveSpeed: 0,
      luck: race.stats.luck,
      dodge: race.stats.dodge,
      lifeSteal: race.stats.lifeSteal,
      armorPen: race.stats.armorPen,
      hpRegen: race.stats.hpRegen,
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
