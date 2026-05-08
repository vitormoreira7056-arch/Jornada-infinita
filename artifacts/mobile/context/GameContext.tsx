import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RaceId, getRaceById } from "@/constants/races";

const USERS_KEY = "rpg_idle_users_v2";
const CURRENT_USER_KEY = "rpg_idle_current_user_v2";

// 21 slots de equipamento
export type EquipmentSlot =
  | "helmet"      // Cabeça
  | "chest"       // Peito
  | "legs"        // Pernas
  | "boots"       // Pés
  | "mainHand"    // Mão primária
  | "offHand"     // Mão secundária
  | "cape"        // Capa
  | "necklace"    // Colar
  | "earrings"    // Brincos
  | "ring1"       // Anel 1
  | "ring2"       // Anel 2
  | "ring3"       // Anel 3
  | "ring4"       // Anel 4
  | "bracelet"    // Pulseira
  | "face"        // Rosto
  | "shoulders"   // Ombros
  | "pet"         // Mascote
  | "spirit";     // Espírito

export interface Item {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
  // Stats
  hp: number;
  atk: number;
  def: number;
  critRate: number;
  critDmg: number;
  atkSpeed: number;
  moveSpeed: number;
  // Elemental
  fireDmg: number;
  iceDmg: number;
  lightningDmg: number;
  // Value
  value: number;
  // Visual
  icon: string;
  color: string;
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
  baseAtk: number;
  baseDef: number;
  
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
  baseAtk: 10,
  baseDef: 5,
  equipment: {
    helmet: null,
    chest: null,
    legs: null,
    boots: null,
    mainHand: null,
    offHand: null,
    cape: null,
    necklace: null,
    earrings: null,
    ring1: null,
    ring2: null,
    ring3: null,
    ring4: null,
    bracelet: null,
    face: null,
    shoulders: null,
    pet: null,
    spirit: null,
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
  getTotalStats: () => {
    hp: number;
    atk: number;
    def: number;
    critRate: number;
    critDmg: number;
    atkSpeed: number;
    moveSpeed: number;
  };
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
          // Merge with default to ensure all slots exist
          const merged = {
            ...DEFAULT_STATE,
            ...parsed,
            equipment: { ...DEFAULT_STATE.equipment, ...(parsed.equipment || {}) },
            username: currentUser,
            isLoggedIn: true,
          };
          setState(merged);
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
    setState((prev) => ({
      ...prev,
      raceId,
      gender,
      baseHp: 100 + (race?.stats.hp || 0),
      baseAtk: 10 + (race?.stats.atkF || 0),
      baseDef: 5 + (race?.stats.armor || 0),
    }));
  };

  const equipItem = (item: Item, slot: EquipmentSlot) => {
    setState((prev) => {
      const currentEquipped = prev.equipment[slot];
      const newInventory = [...prev.inventory];
      
      // Remove item from inventory
      const itemIndex = newInventory.findIndex((i) => i.id === item.id);
      if (itemIndex > -1) {
        newInventory.splice(itemIndex, 1);
      }
      
      // Return currently equipped item to inventory if exists
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
        return prev; // Inventory full
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

  const addGold = (amount: number) => {
    setState((prev) => ({ ...prev, gold: prev.gold + amount }));
  };

  const getTotalStats = () => {
    const race = state.raceId ? getRaceById(state.raceId) : null;
    
    let hp = state.baseHp + (race?.stats.hp || 0);
    let atk = state.baseAtk + (race?.stats.atkF || 0);
    let def = state.baseDef + (race?.stats.armor || 0);
    let critRate = 0.05 + (race?.stats.critBonus || 0);
    let critDmg = 1.5;
    let atkSpeed = 1;
    let moveSpeed = 1;

    // Add equipment stats
    Object.values(state.equipment).forEach((item) => {
      if (item) {
        hp += item.hp;
        atk += item.atk;
        def += item.def;
        critRate += item.critRate;
        critDmg += item.critDmg;
        atkSpeed += item.atkSpeed;
        moveSpeed += item.moveSpeed;
      }
    });

    return { hp, atk, def, critRate, critDmg, atkSpeed, moveSpeed };
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
        getTotalStats,
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
