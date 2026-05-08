import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RaceId, getRaceById } from "@/constants/races";
import { ZONES } from "@/constants/game";

const STORAGE_KEY = "rpg_idle_v6";
const USERS_KEY = "rpg_idle_users";
const CURRENT_USER_KEY = "rpg_idle_current_user";

export interface Item {
  id: string;
  name: string;
  slot: "weapon" | "armor" | "ring";
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  atk: number;
  hp: number;
  def: number;
  crit: number;
  value: number;
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
  
  // Stats
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  critRate: number;
  critDmg: number;
  
  // Battle
  battleActive: boolean;
  zone: number;
  stage: number;
  monsterHp: number;
  monsterMaxHp: number;
  monsterName: string;
  
  // Inventory
  inventory: Item[];
  equippedWeapon: Item | null;
  equippedArmor: Item | null;
  equippedRing: Item | null;
  
  // Unlocked
  maxZone: number;
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
  hp: 100,
  maxHp: 100,
  atk: 20,
  def: 10,
  critRate: 0.05,
  critDmg: 1.5,
  battleActive: false,
  zone: 1,
  stage: 1,
  monsterHp: 0,
  monsterMaxHp: 0,
  monsterName: "",
  inventory: [],
  equippedWeapon: null,
  equippedArmor: null,
  equippedRing: null,
  maxZone: 1,
};

interface GameContextType {
  state: GameState;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setPlayerName: (name: string) => void;
  selectRace: (raceId: RaceId, gender: "male" | "female") => void;
  startBattle: () => void;
  stopBattle: () => void;
  selectZone: (zone: number) => void;
  equipItem: (item: Item) => void;
  sellItem: (itemId: string) => void;
  getTotalStats: () => { hp: number; atk: number; def: number; critRate: number };
}

const GameContext = createContext<GameContextType | null>(null);

// Simple hash function for passwords
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

  // Load saved data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      // Check if there's a current user
      const currentUser = await AsyncStorage.getItem(CURRENT_USER_KEY);
      
      if (currentUser) {
        // Load user-specific save
        const userSaveKey = `${STORAGE_KEY}_${currentUser}`;
        const saved = await AsyncStorage.getItem(userSaveKey);
        
        if (saved) {
          const parsed = JSON.parse(saved);
          setState({ ...DEFAULT_STATE, ...parsed, username: currentUser, isLoggedIn: true });
        } else {
          setState({ ...DEFAULT_STATE, username: currentUser, isLoggedIn: true });
        }
      }
    } catch (e) {
      console.error("Failed to load save:", e);
    }
    setIsLoading(false);
  }

  // Save data on changes
  useEffect(() => {
    if (!isLoading && state.isLoggedIn && state.username) {
      const userSaveKey = `${STORAGE_KEY}_${state.username}`;
      AsyncStorage.setItem(userSaveKey, JSON.stringify(state));
    }
  }, [state, isLoading]);

  async function login(username: string, password: string): Promise<boolean> {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users: Record<string, string> = usersJson ? JSON.parse(usersJson) : {};
      
      const hashedPassword = hashPassword(password);
      
      if (users[username] && users[username] === hashedPassword) {
        // Set current user
        await AsyncStorage.setItem(CURRENT_USER_KEY, username);
        
        // Load user save data
        const userSaveKey = `${STORAGE_KEY}_${username}`;
        const saved = await AsyncStorage.getItem(userSaveKey);
        
        if (saved) {
          const parsed = JSON.parse(saved);
          setState({ ...DEFAULT_STATE, ...parsed, username, isLoggedIn: true });
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
        return false; // Username already exists
      }
      
      users[username] = hashPassword(password);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Set current user
      await AsyncStorage.setItem(CURRENT_USER_KEY, username);
      
      // Create new user save
      const newState = { ...DEFAULT_STATE, username, isLoggedIn: true };
      setState(newState);
      await AsyncStorage.setItem(`${STORAGE_KEY}_${username}`, JSON.stringify(newState));
      
      return true;
    } catch (e) {
      console.error("Register error:", e);
      return false;
    }
  }

  async function logout() {
    try {
      // Save current state before logout
      if (state.username) {
        const userSaveKey = `${STORAGE_KEY}_${state.username}`;
        await AsyncStorage.setItem(userSaveKey, JSON.stringify(state));
      }
      
      // Clear current user
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      
      // Reset state
      setState(DEFAULT_STATE);
    } catch (e) {
      console.error("Logout error:", e);
    }
  }

  // Battle loop
  useEffect(() => {
    if (!state.battleActive || !state.raceId) return;

    const interval = setInterval(() => {
      setState((prev) => {
        if (!prev.battleActive) return prev;

        const stats = getTotalStatsInternal(prev);
        let newMonsterHp = prev.monsterHp - stats.atk;
        let newHp = prev.hp;
        let newExp = prev.exp;
        let newGold = prev.gold;
        let newLevel = prev.level;
        let newMaxHp = prev.maxHp;
        let newAtk = prev.atk;
        let newDef = prev.def;
        let newStage = prev.stage;
        let newZone = prev.zone;
        let newMaxZone = prev.maxZone;
        let newInventory = [...prev.inventory];
        let newMonsterName = prev.monsterName;
        let newMonsterMaxHp = prev.monsterMaxHp;

        // Monster attacks back
        const monsterAtk = Math.floor(10 * (1 + prev.zone * 0.5));
        const dmgTaken = Math.max(1, monsterAtk - stats.def);
        newHp -= dmgTaken;

        // Monster defeated
        if (newMonsterHp <= 0) {
          const expGain = 10 * prev.zone;
          const goldGain = 5 * prev.zone;
          newExp += expGain;
          newGold += goldGain;

          // Level up
          const expNeeded = newLevel * 100;
          if (newExp >= expNeeded) {
            newExp -= expNeeded;
            newLevel++;
            newMaxHp += 10;
            newAtk += 2;
            newDef += 1;
          }

          // Drop item (30% chance)
          if (Math.random() < 0.3 && newInventory.length < 30) {
            const rarities: Item["rarity"][] = ["common", "uncommon", "rare", "epic", "legendary"];
            const rarity = rarities[Math.floor(Math.random() * Math.min(rarities.length, prev.zone + 1))];
            const slots: Item["slot"][] = ["weapon", "armor", "ring"];
            const slot = slots[Math.floor(Math.random() * slots.length)];
            
            newInventory.push({
              id: Date.now().toString(),
              name: `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} ${slot}`,
              slot,
              rarity,
              atk: slot === "weapon" ? Math.floor(5 * prev.zone * (rarity === "common" ? 1 : rarity === "uncommon" ? 1.5 : rarity === "rare" ? 2 : rarity === "epic" ? 3 : 5)) : 0,
              hp: slot === "armor" ? Math.floor(10 * prev.zone * (rarity === "common" ? 1 : rarity === "uncommon" ? 1.5 : rarity === "rare" ? 2 : rarity === "epic" ? 3 : 5)) : 0,
              def: slot === "armor" ? Math.floor(3 * prev.zone * (rarity === "common" ? 1 : rarity === "uncommon" ? 1.5 : rarity === "rare" ? 2 : rarity === "epic" ? 3 : 5)) : 0,
              crit: slot === "ring" ? 0.02 * (rarity === "common" ? 1 : rarity === "uncommon" ? 1.5 : rarity === "rare" ? 2 : rarity === "epic" ? 3 : 5) : 0,
              value: 10 * prev.zone * (rarity === "common" ? 1 : rarity === "uncommon" ? 2 : rarity === "rare" ? 4 : rarity === "epic" ? 8 : 16),
            });
          }

          // Next stage/zone
          newStage++;
          if (newStage > 10) {
            newStage = 1;
            newZone++;
            if (newZone > newMaxZone) {
              newMaxZone = newZone;
            }
          }

          // Spawn new monster
          const zoneData = ZONES[Math.min(newZone - 1, ZONES.length - 1)];
          const isBoss = newStage === 10;
          newMonsterName = isBoss ? zoneData.bossName : zoneData.monsters[Math.floor(Math.random() * zoneData.monsters.length)].name;
          newMonsterMaxHp = Math.floor((isBoss ? 100 : 50) * (1 + newZone * 0.5));
          newMonsterHp = newMonsterMaxHp;
          
          // Heal player
          newHp = newMaxHp;
        }

        // Player defeated
        if (newHp <= 0) {
          return {
            ...prev,
            battleActive: false,
            hp: 0,
          };
        }

        return {
          ...prev,
          hp: newHp,
          maxHp: newMaxHp,
          atk: newAtk,
          def: newDef,
          level: newLevel,
          exp: newExp,
          gold: newGold,
          zone: newZone,
          stage: newStage,
          maxZone: newMaxZone,
          inventory: newInventory,
          monsterHp: newMonsterHp,
          monsterMaxHp: newMonsterMaxHp,
          monsterName: newMonsterName,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.battleActive, state.raceId]);

  function getTotalStatsInternal(s: GameState) {
    const race = s.raceId ? getRaceById(s.raceId) : null;
    let hp = s.maxHp + (race?.stats.hp || 0);
    let atk = s.atk + (race?.stats.atkF || 0);
    let def = s.def + (race?.stats.armor || 0);
    let crit = s.critRate + (race?.stats.critBonus || 0);

    if (s.equippedWeapon) {
      atk += s.equippedWeapon.atk;
      crit += s.equippedWeapon.crit;
    }
    if (s.equippedArmor) {
      hp += s.equippedArmor.hp;
      def += s.equippedArmor.def;
    }
    if (s.equippedRing) {
      atk += s.equippedRing.atk;
      crit += s.equippedRing.crit;
    }

    return { hp, atk, def, critRate: crit };
  }

  const getTotalStats = () => getTotalStatsInternal(state);

  const setPlayerName = (name: string) => {
    setState((prev) => ({ ...prev, playerName: name }));
  };

  const selectRace = (raceId: RaceId, gender: "male" | "female") => {
    const race = getRaceById(raceId);
    setState((prev) => ({
      ...prev,
      raceId,
      gender,
      maxHp: 100 + (race?.stats.hp || 0),
      hp: 100 + (race?.stats.hp || 0),
      atk: 20 + (race?.stats.atkF || 0),
      def: 10 + (race?.stats.armor || 0),
    }));
  };

  const startBattle = () => {
    const zoneData = ZONES[state.zone - 1];
    const isBoss = state.stage === 10;
    const monsterName = isBoss ? zoneData.bossName : zoneData.monsters[Math.floor(Math.random() * zoneData.monsters.length)].name;
    const monsterMaxHp = Math.floor((isBoss ? 100 : 50) * (1 + state.zone * 0.5));
    
    setState((prev) => ({
      ...prev,
      battleActive: true,
      monsterHp: monsterMaxHp,
      monsterMaxHp,
      monsterName,
      hp: prev.maxHp,
    }));
  };

  const stopBattle = () => {
    setState((prev) => ({ ...prev, battleActive: false }));
  };

  const selectZone = (zone: number) => {
    setState((prev) => ({
      ...prev,
      zone,
      stage: 1,
      battleActive: false,
    }));
  };

  const equipItem = (item: Item) => {
    setState((prev) => {
      const newState = { ...prev };
      
      // Return current equipped to inventory
      if (item.slot === "weapon" && prev.equippedWeapon) {
        newState.inventory = [...prev.inventory, prev.equippedWeapon];
      } else if (item.slot === "armor" && prev.equippedArmor) {
        newState.inventory = [...prev.inventory, prev.equippedArmor];
      } else if (item.slot === "ring" && prev.equippedRing) {
        newState.inventory = [...prev.inventory, prev.equippedRing];
      }
      
      // Equip new item
      if (item.slot === "weapon") newState.equippedWeapon = item;
      if (item.slot === "armor") newState.equippedArmor = item;
      if (item.slot === "ring") newState.equippedRing = item;
      
      // Remove from inventory
      newState.inventory = prev.inventory.filter((i) => i.id !== item.id);
      
      return newState;
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
        startBattle,
        stopBattle,
        selectZone,
        equipItem,
        sellItem,
        getTotalStats,
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
