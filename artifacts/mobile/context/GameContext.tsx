import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ClassId,
  EquipSlot,
  Rarity,
  CLASSES,
  ZONES,
  PASSIVE_SKILLS,
  EQUIPMENT_BASES,
  RARITY_MULTS,
  RARITY_PREFIXES,
  getExpToNext,
  getSkillCost,
} from "@/constants/game";

export interface EquipmentItem {
  instanceId: string;
  baseId: string;
  name: string;
  slot: EquipSlot;
  rarity: Rarity;
  atkBonus: number;
  hpBonus: number;
  defBonus: number;
  critBonus: number;
  goldValue: number;
}

export interface CurrentMonster {
  id: string;
  name: string;
  level: number;
  maxHp: number;
  currentHp: number;
  atk: number;
  def: number;
  expReward: number;
  goldReward: number;
  isBoss: boolean;
}

interface Hero {
  classId: ClassId | null;
  level: number;
  exp: number;
  expToNext: number;
  currentHp: number;
  maxHp: number;
  baseAtk: number;
  baseDef: number;
  critRate: number;
  critDmg: number;
  prestigeCount: number;
  prestigeBonus: number;
}

interface Resources {
  gold: number;
  gems: number;
  totalGoldEarned: number;
  totalKills: number;
}

export interface GameState {
  hero: Hero;
  resources: Resources;
  battle: {
    isActive: boolean;
    zone: number;
    stage: number;
    currentMonster: CurrentMonster | null;
    log: string[];
    powerStrikeCooldown: number;
    powerStrikeReady: boolean;
    battleCryCooldown: number;
    battleCryActive: number;
  };
  equippedItems: Partial<Record<EquipSlot, EquipmentItem>>;
  inventory: EquipmentItem[];
  skillLevels: Record<string, number>;
  unlockedZones: number[];
  isFirstLaunch: boolean;
}

interface GameContextValue {
  state: GameState;
  selectClass: (classId: ClassId) => void;
  toggleBattle: () => void;
  selectZoneAndStage: (zone: number, stage: number) => void;
  equipItem: (instanceId: string) => void;
  unequipSlot: (slot: EquipSlot) => void;
  sellItem: (instanceId: string) => void;
  upgradeSkill: (skillId: string) => void;
  usePowerStrike: () => void;
  useBattleCry: () => void;
  revive: () => void;
  prestige: () => void;
  getPlayerAtk: (s?: GameState) => number;
  getPlayerDef: (s?: GameState) => number;
  getPlayerMaxHp: (s?: GameState) => number;
}

const GameContext = createContext<GameContextValue | null>(null);
const STORAGE_KEY = "rpg_idle_v3";

const DEFAULT_STATE: GameState = {
  hero: {
    classId: null,
    level: 1,
    exp: 0,
    expToNext: 100,
    currentHp: 100,
    maxHp: 100,
    baseAtk: 20,
    baseDef: 10,
    critRate: 0.05,
    critDmg: 1.5,
    prestigeCount: 0,
    prestigeBonus: 1,
  },
  resources: { gold: 0, gems: 0, totalGoldEarned: 0, totalKills: 0 },
  battle: {
    isActive: false,
    zone: 1,
    stage: 1,
    currentMonster: null,
    log: [],
    powerStrikeCooldown: 0,
    powerStrikeReady: false,
    battleCryCooldown: 0,
    battleCryActive: 0,
  },
  equippedItems: {},
  inventory: [],
  skillLevels: {},
  unlockedZones: [1],
  isFirstLaunch: true,
};

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function spawnMonster(zone: number, stage: number): CurrentMonster {
  const zoneData = ZONES[zone - 1];
  const isBoss = stage === 10;
  const scaleFactor = 1 + (zone - 1) * 0.9 + (stage - 1) * 0.14;
  const level = (zone - 1) * 10 + stage;

  if (isBoss) {
    const bossMult = 3.5;
    return {
      id: "boss",
      name: zoneData.bossName,
      level,
      maxHp: Math.floor(zoneData.bossHp * scaleFactor * bossMult),
      currentHp: Math.floor(zoneData.bossHp * scaleFactor * bossMult),
      atk: Math.floor(zoneData.bossAtk * scaleFactor * bossMult),
      def: Math.floor(zoneData.bossDef * scaleFactor),
      expReward: Math.floor(300 * scaleFactor * bossMult),
      goldReward: Math.floor(200 * scaleFactor * bossMult),
      isBoss: true,
    };
  }

  const monsterDef = zoneData.monsters[Math.floor(Math.random() * zoneData.monsters.length)];
  return {
    id: monsterDef.id,
    name: monsterDef.name,
    level,
    maxHp: Math.floor(monsterDef.baseHp * scaleFactor),
    currentHp: Math.floor(monsterDef.baseHp * scaleFactor),
    atk: Math.floor(monsterDef.baseAtk * scaleFactor),
    def: Math.floor(monsterDef.baseDef * scaleFactor),
    expReward: Math.floor(monsterDef.expReward * scaleFactor),
    goldReward: Math.floor(monsterDef.goldReward * scaleFactor),
    isBoss: false,
  };
}

function tryDropEquipment(zone: number, stage: number): EquipmentItem | null {
  const dropChance = 0.18 + stage * 0.02;
  if (Math.random() > dropChance) return null;

  const slots: EquipSlot[] = ["weapon", "armor", "ring"];
  const slot = slots[Math.floor(Math.random() * slots.length)];

  const rarityRoll = Math.random();
  let rarity: Rarity;
  if (zone >= 5 && rarityRoll < 0.05) rarity = "legendary";
  else if (zone >= 4 && rarityRoll < 0.12) rarity = "epic";
  else if (zone >= 3 && rarityRoll < 0.25) rarity = "rare";
  else if (zone >= 2 && rarityRoll < 0.5) rarity = "uncommon";
  else rarity = "common";

  const poolForSlot = EQUIPMENT_BASES.filter((e) => e.slot === slot);
  if (poolForSlot.length === 0) return null;
  const baseDef = poolForSlot[Math.floor(Math.random() * poolForSlot.length)];
  const zoneMult = 1 + (zone - 1) * 0.45;
  const mult = RARITY_MULTS[rarity] * zoneMult;
  const prefix = RARITY_PREFIXES[rarity];

  return {
    instanceId: generateId(),
    baseId: baseDef.id,
    name: prefix ? `${prefix} ${baseDef.name}` : baseDef.name,
    slot: baseDef.slot,
    rarity,
    atkBonus: Math.floor(baseDef.atkBonus * mult),
    hpBonus: Math.floor(baseDef.hpBonus * mult),
    defBonus: Math.floor(baseDef.defBonus * mult),
    critBonus: baseDef.critBonus * mult,
    goldValue: Math.floor(baseDef.goldValue * mult),
  };
}

export function computePlayerAtk(state: GameState): number {
  const equipAtk = Object.values(state.equippedItems).reduce(
    (sum, eq) => sum + (eq?.atkBonus ?? 0),
    0
  );
  const powerBonus = (state.skillLevels["power"] ?? 0) * 5;
  return Math.floor(
    (state.hero.baseAtk + equipAtk) *
      (1 + powerBonus / 100) *
      state.hero.prestigeBonus
  );
}

export function computePlayerDef(state: GameState): number {
  const equipDef = Object.values(state.equippedItems).reduce(
    (sum, eq) => sum + (eq?.defBonus ?? 0),
    0
  );
  const defBonus = (state.skillLevels["iron_skin"] ?? 0) * 6;
  return Math.floor((state.hero.baseDef + equipDef) * (1 + defBonus / 100));
}

export function computePlayerMaxHp(state: GameState): number {
  const equipHp = Object.values(state.equippedItems).reduce(
    (sum, eq) => sum + (eq?.hpBonus ?? 0),
    0
  );
  const hpBonus = (state.skillLevels["fortitude"] ?? 0) * 8;
  return Math.floor((state.hero.maxHp + equipHp) * (1 + hpBonus / 100));
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(DEFAULT_STATE);
  const stateRef = useRef<GameState>(state);
  const battleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isBattlingRef = useRef(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as GameState;
          parsed.battle.isActive = false;
          setState(parsed);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {}
    }, 2500);
    return () => clearTimeout(timer);
  }, [state]);

  useEffect(() => {
    const shouldBattle = state.battle.isActive && state.hero.currentHp > 0 && !!state.hero.classId;
    isBattlingRef.current = shouldBattle;

    if (shouldBattle) {
      battleTimerRef.current = setInterval(() => {
        if (!isBattlingRef.current) return;
        setState((prev) => {
          if (!prev.battle.isActive || !prev.battle.currentMonster) return prev;

          const totalAtk = computePlayerAtk(prev);
          const equipCrit = Object.values(prev.equippedItems).reduce(
            (sum, eq) => sum + (eq?.critBonus ?? 0),
            0
          );
          const critRateBonus = (prev.skillLevels["precision"] ?? 0) * 2 / 100;
          const critRate = prev.hero.critRate + equipCrit + critRateBonus;
          const isCrit = Math.random() < critRate;

          let atkMult = isCrit ? prev.hero.critDmg : 1;
          let newPowerStrikeReady = prev.battle.powerStrikeReady;
          if (prev.battle.powerStrikeReady) {
            atkMult *= 3;
            newPowerStrikeReady = false;
          }

          const rawDmg = totalAtk * atkMult - prev.battle.currentMonster.def;
          const dmgToMonster = Math.max(1, Math.floor(rawDmg));

          const totalDef = computePlayerDef(prev);
          let dmgToPlayer = Math.max(1, Math.floor(prev.battle.currentMonster.atk - totalDef * 0.5));
          if (prev.battle.battleCryActive > 0) {
            dmgToPlayer = Math.floor(dmgToPlayer * 0.4);
          }

          const newMonsterHp = prev.battle.currentMonster.currentHp - dmgToMonster;
          const newPlayerHp = Math.max(0, prev.hero.currentHp - dmgToPlayer);

          const critTag = isCrit ? (prev.battle.powerStrikeReady ? " [POWER+CRIT]" : " [CRIT]") : "";
          const shieldTag = prev.battle.battleCryActive > 0 ? " [SHIELD]" : "";
          const newLog = [
            `ATK${critTag}: ${dmgToMonster} | RCV${shieldTag}: ${dmgToPlayer}`,
            ...prev.battle.log,
          ].slice(0, 30);

          const newPsCd = Math.max(0, prev.battle.powerStrikeCooldown - 1);
          const newBcCd = Math.max(0, prev.battle.battleCryCooldown - 1);
          const newBcActive = Math.max(0, prev.battle.battleCryActive - 1);

          if (newMonsterHp <= 0) {
            const goldSkillBonus = (prev.skillLevels["fortune"] ?? 0) * 10 / 100;
            const goldEarned = Math.floor(prev.battle.currentMonster.goldReward * (1 + goldSkillBonus));
            const expEarned = prev.battle.currentMonster.expReward;

            let newExp = prev.hero.exp + expEarned;
            let newLevel = prev.hero.level;
            let newExpToNext = prev.hero.expToNext;
            let newMaxHp = prev.hero.maxHp;
            let newBaseAtk = prev.hero.baseAtk;
            let newBaseDef = prev.hero.baseDef;
            const extraLog: string[] = [
              `Defeated ${prev.battle.currentMonster.name}! +${goldEarned}g +${expEarned}xp`,
            ];

            while (newExp >= newExpToNext) {
              newExp -= newExpToNext;
              newLevel++;
              newExpToNext = getExpToNext(newLevel);
              const cd = CLASSES.find((c) => c.id === prev.hero.classId)!;
              newMaxHp += cd.hpPerLevel;
              newBaseAtk += cd.atkPerLevel;
              newBaseDef += cd.defPerLevel;
              extraLog.push(`Level Up! You are now Lv.${newLevel}!`);
            }

            const droppedItem = tryDropEquipment(prev.battle.zone, prev.battle.stage);
            const newInventory = [...prev.inventory];
            if (droppedItem && newInventory.length < 30) {
              newInventory.push(droppedItem);
              extraLog.push(`Drop: ${droppedItem.name}!`);
            }

            let newStage = prev.battle.stage + 1;
            let newZone = prev.battle.zone;
            const newUnlocked = [...prev.unlockedZones];

            if (newStage > 10) {
              newStage = 1;
              const nextZone = newZone + 1;
              if (nextZone <= ZONES.length && !newUnlocked.includes(nextZone)) {
                newUnlocked.push(nextZone);
                extraLog.push(`ZONE UNLOCKED: ${ZONES[nextZone - 1].name}!`);
              }
            }

            const nextMonster = spawnMonster(newZone, newStage);

            return {
              ...prev,
              hero: {
                ...prev.hero,
                level: newLevel,
                exp: newExp,
                expToNext: newExpToNext,
                maxHp: newMaxHp,
                baseAtk: newBaseAtk,
                baseDef: newBaseDef,
                currentHp: Math.min(prev.hero.currentHp, computePlayerMaxHp({ ...prev, hero: { ...prev.hero, maxHp: newMaxHp } })),
              },
              resources: {
                ...prev.resources,
                gold: prev.resources.gold + goldEarned,
                totalGoldEarned: prev.resources.totalGoldEarned + goldEarned,
                totalKills: prev.resources.totalKills + 1,
              },
              battle: {
                ...prev.battle,
                zone: newZone,
                stage: newStage,
                currentMonster: nextMonster,
                log: [...extraLog, ...newLog].slice(0, 30),
                powerStrikeReady: newPowerStrikeReady,
                powerStrikeCooldown: newPsCd,
                battleCryCooldown: newBcCd,
                battleCryActive: newBcActive,
              },
              inventory: newInventory,
              unlockedZones: newUnlocked,
            };
          } else if (newPlayerHp <= 0) {
            isBattlingRef.current = false;
            return {
              ...prev,
              hero: { ...prev.hero, currentHp: 0 },
              battle: {
                ...prev.battle,
                isActive: false,
                log: ["Defeated! Tap Revive to continue.", ...newLog].slice(0, 30),
              },
            };
          } else {
            return {
              ...prev,
              hero: { ...prev.hero, currentHp: newPlayerHp },
              battle: {
                ...prev.battle,
                currentMonster: { ...prev.battle.currentMonster, currentHp: newMonsterHp },
                log: newLog,
                powerStrikeReady: newPowerStrikeReady,
                powerStrikeCooldown: newPsCd,
                battleCryCooldown: newBcCd,
                battleCryActive: newBcActive,
              },
            };
          }
        });
      }, 1000);
    } else {
      if (battleTimerRef.current) {
        clearInterval(battleTimerRef.current);
        battleTimerRef.current = null;
      }
    }

    return () => {
      if (battleTimerRef.current) {
        clearInterval(battleTimerRef.current);
        battleTimerRef.current = null;
      }
    };
  }, [state.battle.isActive, state.hero.classId]);

  const selectClass = useCallback((classId: ClassId) => {
    const cd = CLASSES.find((c) => c.id === classId)!;
    const initialMonster = spawnMonster(1, 1);
    setState((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        classId,
        maxHp: cd.baseHp,
        currentHp: cd.baseHp,
        baseAtk: cd.baseAtk,
        baseDef: cd.baseDef,
        critRate: cd.baseCritRate,
        critDmg: cd.baseCritDmg,
      },
      battle: { ...prev.battle, currentMonster: initialMonster },
      isFirstLaunch: false,
    }));
  }, []);

  const toggleBattle = useCallback(() => {
    setState((prev) => {
      if (prev.hero.currentHp <= 0) return prev;
      const monster = prev.battle.currentMonster ?? spawnMonster(prev.battle.zone, prev.battle.stage);
      return {
        ...prev,
        battle: { ...prev.battle, isActive: !prev.battle.isActive, currentMonster: monster },
      };
    });
  }, []);

  const selectZoneAndStage = useCallback((zone: number, stage: number) => {
    setState((prev) => {
      if (!prev.unlockedZones.includes(zone)) return prev;
      const monster = spawnMonster(zone, stage);
      const maxHp = computePlayerMaxHp(prev);
      return {
        ...prev,
        hero: { ...prev.hero, currentHp: maxHp },
        battle: { ...prev.battle, zone, stage, currentMonster: monster, isActive: false, log: [] },
      };
    });
  }, []);

  const equipItem = useCallback((instanceId: string) => {
    setState((prev) => {
      const itemIdx = prev.inventory.findIndex((i) => i.instanceId === instanceId);
      if (itemIdx < 0) return prev;
      const item = prev.inventory[itemIdx];
      const currentEquipped = prev.equippedItems[item.slot];
      const newInventory = prev.inventory.filter((i) => i.instanceId !== instanceId);
      if (currentEquipped) newInventory.push(currentEquipped);
      return { ...prev, inventory: newInventory, equippedItems: { ...prev.equippedItems, [item.slot]: item } };
    });
  }, []);

  const unequipSlot = useCallback((slot: EquipSlot) => {
    setState((prev) => {
      const equipped = prev.equippedItems[slot];
      if (!equipped || prev.inventory.length >= 30) return prev;
      const newEquipped = { ...prev.equippedItems };
      delete newEquipped[slot];
      return { ...prev, equippedItems: newEquipped, inventory: [...prev.inventory, equipped] };
    });
  }, []);

  const sellItem = useCallback((instanceId: string) => {
    setState((prev) => {
      const item = prev.inventory.find((i) => i.instanceId === instanceId);
      if (!item) return prev;
      return {
        ...prev,
        inventory: prev.inventory.filter((i) => i.instanceId !== instanceId),
        resources: { ...prev.resources, gold: prev.resources.gold + item.goldValue },
      };
    });
  }, []);

  const upgradeSkill = useCallback((skillId: string) => {
    setState((prev) => {
      const skillDef = PASSIVE_SKILLS.find((s) => s.id === skillId);
      if (!skillDef) return prev;
      const currentLevel = prev.skillLevels[skillId] ?? 0;
      if (currentLevel >= skillDef.maxLevel) return prev;
      const cost = getSkillCost(skillDef, currentLevel);
      if (prev.resources.gold < cost) return prev;
      return {
        ...prev,
        resources: { ...prev.resources, gold: prev.resources.gold - cost },
        skillLevels: { ...prev.skillLevels, [skillId]: currentLevel + 1 },
      };
    });
  }, []);

  const usePowerStrike = useCallback(() => {
    setState((prev) => {
      if (prev.battle.powerStrikeCooldown > 0 || !prev.battle.isActive) return prev;
      return {
        ...prev,
        battle: { ...prev.battle, powerStrikeReady: true, powerStrikeCooldown: 10 },
      };
    });
  }, []);

  const useBattleCry = useCallback(() => {
    setState((prev) => {
      if (prev.battle.battleCryCooldown > 0 || !prev.battle.isActive) return prev;
      return {
        ...prev,
        battle: { ...prev.battle, battleCryActive: 5, battleCryCooldown: 20 },
      };
    });
  }, []);

  const revive = useCallback(() => {
    setState((prev) => {
      const maxHp = computePlayerMaxHp(prev);
      const monster = spawnMonster(prev.battle.zone, prev.battle.stage);
      return {
        ...prev,
        hero: { ...prev.hero, currentHp: Math.floor(maxHp * 0.5) },
        battle: {
          ...prev.battle,
          currentMonster: monster,
          isActive: false,
          log: ["Revived with 50% HP.", ...prev.battle.log].slice(0, 30),
        },
      };
    });
  }, []);

  const prestige = useCallback(() => {
    setState((prev) => {
      if (prev.hero.level < 20) return prev;
      const newPrestigeCount = prev.hero.prestigeCount + 1;
      const newPrestigeBonus = 1 + newPrestigeCount * 0.1;
      const cd = CLASSES.find((c) => c.id === prev.hero.classId)!;
      return {
        ...DEFAULT_STATE,
        hero: {
          ...DEFAULT_STATE.hero,
          classId: prev.hero.classId,
          maxHp: cd.baseHp,
          currentHp: cd.baseHp,
          baseAtk: cd.baseAtk,
          baseDef: cd.baseDef,
          critRate: cd.baseCritRate,
          critDmg: cd.baseCritDmg,
          prestigeCount: newPrestigeCount,
          prestigeBonus: newPrestigeBonus,
        },
        battle: { ...DEFAULT_STATE.battle, currentMonster: spawnMonster(1, 1) },
        unlockedZones: [1],
        isFirstLaunch: false,
      };
    });
  }, []);

  const getPlayerAtk = useCallback((s?: GameState) => computePlayerAtk(s ?? state), [state]);
  const getPlayerDef = useCallback((s?: GameState) => computePlayerDef(s ?? state), [state]);
  const getPlayerMaxHp = useCallback((s?: GameState) => computePlayerMaxHp(s ?? state), [state]);

  return (
    <GameContext.Provider
      value={{
        state,
        selectClass,
        toggleBattle,
        selectZoneAndStage,
        equipItem,
        unequipSlot,
        sellItem,
        upgradeSkill,
        usePowerStrike,
        useBattleCry,
        revive,
        prestige,
        getPlayerAtk,
        getPlayerDef,
        getPlayerMaxHp,
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
