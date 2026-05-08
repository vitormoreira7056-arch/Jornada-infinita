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
import { RaceId, Gender, getRaceById, LUCK_MAX, DODGE_MAX } from "@/constants/races";

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
  raceId: RaceId | null;
  gender: Gender | null;
  level: number;
  exp: number;
  expToNext: number;
  currentHp: number;
  maxHp: number;
  baseAtk: number;
  baseAtkM: number;
  baseDef: number;
  critRate: number;
  critDmg: number;
  luck: number;
  dodge: number;
  lifeSteal: number;
  speed: number;
  magicPower: number;
  fortune: number;
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
  isLoading: boolean;
  selectClass: (classId: ClassId) => void;
  selectRace: (raceId: RaceId) => void;
  selectGender: (gender: Gender) => void;
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
const STORAGE_KEY = "rpg_idle_v4";

const DEFAULT_HERO: Hero = {
  classId: null,
  raceId: null,
  gender: null,
  level: 1,
  exp: 0,
  expToNext: 100,
  currentHp: 100,
  maxHp: 100,
  baseAtk: 20,
  baseAtkM: 10,
  baseDef: 10,
  critRate: 0.05,
  critDmg: 1.5,
  luck: 0.0001,
  dodge: 0.001,
  lifeSteal: 0,
  speed: 0,
  magicPower: 0,
  fortune: 0,
  prestigeCount: 0,
  prestigeBonus: 1,
};

const DEFAULT_STATE: GameState = {
  hero: DEFAULT_HERO,
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

function tryDropEquipment(zone: number, stage: number, fortune: number): EquipmentItem | null {
  const dropChance = 0.18 + stage * 0.02 + fortune / 100;
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

function getRaceStats(state: GameState) {
  if (!state.hero.raceId) return null;
  return getRaceById(state.hero.raceId)?.stats ?? null;
}

export function computePlayerAtk(state: GameState): number {
  const equipAtk = Object.values(state.equippedItems).reduce(
    (sum, eq) => sum + (eq?.atkBonus ?? 0), 0
  );
  const powerBonus = (state.skillLevels["power"] ?? 0) * 5;
  const raceAtk = getRaceStats(state)?.atkF ?? 0;
  return Math.floor(
    (state.hero.baseAtk + equipAtk + raceAtk) *
      (1 + powerBonus / 100) *
      state.hero.prestigeBonus
  );
}

export function computePlayerAtkM(state: GameState): number {
  const raceAtkM = getRaceStats(state)?.atkM ?? 0;
  const powerBonus = (state.skillLevels["power"] ?? 0) * 3;
  return Math.floor(
    (state.hero.baseAtkM + raceAtkM) *
      (1 + powerBonus / 100) *
      state.hero.prestigeBonus
  );
}

export function computePlayerDef(state: GameState): number {
  const equipDef = Object.values(state.equippedItems).reduce(
    (sum, eq) => sum + (eq?.defBonus ?? 0), 0
  );
  const defBonus = (state.skillLevels["iron_skin"] ?? 0) * 6;
  const raceArmor = getRaceStats(state)?.armor ?? 0;
  return Math.floor((state.hero.baseDef + equipDef + raceArmor) * (1 + defBonus / 100));
}

export function computePlayerMaxHp(state: GameState): number {
  const equipHp = Object.values(state.equippedItems).reduce(
    (sum, eq) => sum + (eq?.hpBonus ?? 0), 0
  );
  const hpBonus = (state.skillLevels["fortitude"] ?? 0) * 8;
  const raceHp = getRaceStats(state)?.hp ?? 0;
  return Math.floor((state.hero.maxHp + equipHp + raceHp) * (1 + hpBonus / 100));
}

export function computePlayerCritRate(state: GameState): number {
  const equipCrit = Object.values(state.equippedItems).reduce(
    (sum, eq) => sum + (eq?.critBonus ?? 0), 0
  );
  const critRateBonus = (state.skillLevels["precision"] ?? 0) * 2 / 100;
  const raceCrit = getRaceStats(state)?.critBonus ?? 0;
  return state.hero.critRate + equipCrit + critRateBonus + raceCrit;
}

export function computePlayerDodge(state: GameState): number {
  const raceDodge = getRaceStats(state)?.dodge ?? 0;
  return Math.min(state.hero.dodge + raceDodge, DODGE_MAX);
}

export function computePlayerLuck(state: GameState): number {
  const raceLuck = getRaceStats(state)?.luck ?? 0;
  return Math.min(state.hero.luck + raceLuck, LUCK_MAX);
}

export function computePlayerLifeSteal(state: GameState): number {
  const raceLS = getRaceStats(state)?.lifeSteal ?? 0;
  return state.hero.lifeSteal + raceLS;
}

export function computePlayerFortune(state: GameState): number {
  const raceFortune = getRaceStats(state)?.fortune ?? 0;
  const skillFortune = (state.skillLevels["fortune"] ?? 0) * 10;
  return state.hero.fortune + raceFortune + skillFortune;
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(true);
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
          try {
            const parsed = JSON.parse(saved) as GameState;
            // Validate parsed data structure
            if (!parsed || typeof parsed !== 'object') {
              throw new Error('Invalid saved data structure');
            }
            // Ensure battle exists
            if (!parsed.battle) parsed.battle = DEFAULT_STATE.battle;
            parsed.battle.isActive = false;
            // Ensure hero exists
            if (!parsed.hero) parsed.hero = DEFAULT_STATE.hero;
            // Migrate old saves: add missing hero fields
            if (parsed.hero.raceId === undefined) parsed.hero.raceId = null;
            if (parsed.hero.gender === undefined) parsed.hero.gender = null;
            if (parsed.hero.baseAtkM === undefined) parsed.hero.baseAtkM = 10;
            if (parsed.hero.luck === undefined) parsed.hero.luck = 0.0001;
            if (parsed.hero.dodge === undefined) parsed.hero.dodge = 0.001;
            if (parsed.hero.lifeSteal === undefined) parsed.hero.lifeSteal = 0;
            if (parsed.hero.speed === undefined) parsed.hero.speed = 0;
            if (parsed.hero.magicPower === undefined) parsed.hero.magicPower = 0;
            if (parsed.hero.fortune === undefined) parsed.hero.fortune = 0;
            // Ensure other required fields exist
            if (!parsed.resources) parsed.resources = DEFAULT_STATE.resources;
            if (!parsed.equippedItems) parsed.equippedItems = {};
            if (!parsed.inventory) parsed.inventory = [];
            if (!parsed.skillLevels) parsed.skillLevels = {};
            if (!parsed.unlockedZones) parsed.unlockedZones = [1];
            setState(parsed);
          } catch (parseError) {
            console.error("Error parsing saved game data:", parseError);
            // Keep default state if parsing fails
          }
        }
      } catch (e) {
        console.error("Error loading game data:", e);
      }
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {}
    }, 2500);
    return () => clearTimeout(timer);
  }, [state, isLoading]);

  useEffect(() => {
    const shouldBattle = state.battle.isActive && state.hero.currentHp > 0 && !!state.hero.classId;
    isBattlingRef.current = shouldBattle;

    if (shouldBattle) {
      battleTimerRef.current = setInterval(() => {
        if (!isBattlingRef.current) return;
        setState((prev) => {
          if (!prev.battle.isActive || !prev.battle.currentMonster) return prev;

          const totalAtk = computePlayerAtk(prev);
          const critRate = computePlayerCritRate(prev);
          const dodge = computePlayerDodge(prev);
          const luck = computePlayerLuck(prev);
          const lifeSteal = computePlayerLifeSteal(prev);
          const fortune = computePlayerFortune(prev);
          const hpRegen = getRaceStats(prev)?.hpRegen ?? 0;

          const isCrit = Math.random() < critRate;
          const isLucky = Math.random() < luck;

          let atkMult = isCrit ? prev.hero.critDmg : 1;
          if (isLucky) atkMult *= 1.15;
          let newPowerStrikeReady = prev.battle.powerStrikeReady;
          if (prev.battle.powerStrikeReady) {
            atkMult *= 3;
            newPowerStrikeReady = false;
          }

          const rawDmg = totalAtk * atkMult - prev.battle.currentMonster.def;
          const dmgToMonster = Math.max(1, Math.floor(rawDmg));

          const totalDef = computePlayerDef(prev);
          const dodged = Math.random() < dodge;
          let dmgToPlayer = dodged ? 0 : Math.max(1, Math.floor(prev.battle.currentMonster.atk - totalDef * 0.5));
          if (prev.battle.battleCryActive > 0) {
            dmgToPlayer = Math.floor(dmgToPlayer * 0.4);
          }

          const healFromLS = Math.floor(dmgToMonster * lifeSteal);
          const healFromRegen = hpRegen;
          const totalHeal = healFromLS + healFromRegen;
          const maxHp = computePlayerMaxHp(prev);

          const newMonsterHp = prev.battle.currentMonster.currentHp - dmgToMonster;
          const newPlayerHp = Math.max(0, Math.min(maxHp, prev.hero.currentHp - dmgToPlayer + totalHeal));

          const critTag = isCrit ? " [CRIT]" : "";
          const luckyTag = isLucky ? " [SORTE]" : "";
          const dodgeTag = dodged ? " [ESQUIVA]" : "";
          const shieldTag = prev.battle.battleCryActive > 0 ? " [ESCUDO]" : "";
          const lsTag = totalHeal > 0 ? ` [+${totalHeal}HP]` : "";
          const psTag = prev.battle.powerStrikeReady ? " [PODER]" : "";
          const newLog = [
            `ATK${critTag}${luckyTag}${psTag}: ${dmgToMonster} | DEF${dodgeTag}${shieldTag}: ${dmgToPlayer}${lsTag}`,
            ...prev.battle.log,
          ].slice(0, 30);

          const newPsCd = Math.max(0, prev.battle.powerStrikeCooldown - 1);
          const newBcCd = Math.max(0, prev.battle.battleCryCooldown - 1);
          const newBcActive = Math.max(0, prev.battle.battleCryActive - 1);

          if (newMonsterHp <= 0) {
            const goldEarned = Math.floor(prev.battle.currentMonster.goldReward * (1 + fortune / 100));
            const expEarned = prev.battle.currentMonster.expReward;

            let newExp = prev.hero.exp + expEarned;
            let newLevel = prev.hero.level;
            let newExpToNext = prev.hero.expToNext;
            let newMaxHp = prev.hero.maxHp;
            let newBaseAtk = prev.hero.baseAtk;
            let newBaseDef = prev.hero.baseDef;
            const extraLog: string[] = [
              `Derrotou ${prev.battle.currentMonster.name}! +${goldEarned}g +${expEarned}xp`,
            ];

            while (newExp >= newExpToNext) {
              newExp -= newExpToNext;
              newLevel++;
              newExpToNext = getExpToNext(newLevel);
              const cd = CLASSES.find((c) => c.id === prev.hero.classId)!;
              newMaxHp += cd.hpPerLevel;
              newBaseAtk += cd.atkPerLevel;
              newBaseDef += cd.defPerLevel;
              extraLog.push(`Level Up! Você é agora Nv.${newLevel}!`);
            }

            const droppedItem = tryDropEquipment(prev.battle.zone, prev.battle.stage, fortune);
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
                extraLog.push(`ZONA DESBLOQUEADA: ${ZONES[nextZone - 1].name}!`);
              }
            }

            const nextMonster = spawnMonster(newZone, newStage);
            const newHpAfterKill = Math.min(
              computePlayerMaxHp({ ...prev, hero: { ...prev.hero, maxHp: newMaxHp } }),
              newPlayerHp
            );

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
                currentHp: newHpAfterKill,
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
                log: ["Derrotado! Toque em Reviver para continuar.", ...newLog].slice(0, 30),
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

  const selectRace = useCallback((raceId: RaceId) => {
    setState((prev) => ({
      ...prev,
      hero: { ...prev.hero, raceId },
    }));
  }, []);

  const selectGender = useCallback((gender: Gender) => {
    setState((prev) => ({
      ...prev,
      hero: { ...prev.hero, gender },
    }));
  }, []);

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
        baseAtkM: Math.floor(cd.baseAtk * 0.4),
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
          log: ["Revivido com 50% HP.", ...prev.battle.log].slice(0, 30),
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
          ...DEFAULT_HERO,
          classId: prev.hero.classId,
          raceId: prev.hero.raceId,
          gender: prev.hero.gender,
          maxHp: cd.baseHp,
          currentHp: cd.baseHp,
          baseAtk: cd.baseAtk,
          baseAtkM: Math.floor(cd.baseAtk * 0.4),
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
        isLoading,
        selectClass,
        selectRace,
        selectGender,
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
