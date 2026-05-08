import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RaceId, getRaceById, RaceAbility } from "@/constants/races";
import { ElementId } from "@/constants/elements";
import { TierId, QualityId, rollTier, rollQuality, getTotalMultiplier, TIERS, QUALITIES } from "@/constants/tiers";
import { BiomeId, DungeonDef, DiscoveredDungeon, BIOMES, tryDiscoverDungeon, calculateExpNeeded, TOWER_FLOORS_DATA, TowerFloor, getDiscoveredDungeonsForBiome, getBiomeDiscoveryProgress } from "@/constants/adventure";
import { MobDef, FOREST_MOBS, findRandomMob, calculateDrops, MOB_RANK_MULTIPLIERS } from "@/constants/mobs";
import { 
  EquipmentBase, EquipmentSlot as NewEquipmentSlot,
  generateRandomEquipment, generateBossLoot, generateMiniBossLoot, generateMobLoot,
  getActiveSetBonuses, calculateTotalStatsWithSets, getTierColor, getTierName
} from "@/constants/equipment";

// Estado do inimigo em combate
export interface EnemyState {
  mob: MobDef;
  currentHp: number;
  maxHp: number;
  skillCooldowns: number[];
}

const USERS_KEY = "rpg_idle_users_v5";
const CURRENT_USER_KEY = "rpg_idle_current_user_v5";

// Slots de equipamento (simplificado para 6 slots principais)
export type EquipmentSlot = "mainHand" | "offHand" | "head" | "chest" | "legs" | "feet";

// Item de equipamento usando o novo sistema
export interface Item extends EquipmentBase {
  quality: QualityId;
  luck: number;
  lifeSteal: number;
  armorPen: number;
  hpRegen: number;
  value: number;
  resFire: number; resWater: number; resEarth: number; resThunder: number;
  resIce: number; resWind: number; resDark: number; resLight: number;
  resArcane: number; resPoison: number; resMetal: number; resNature: number;
  resBlood: number; resVoid: number; resChaos: number; resHoly: number;
  resShadow: number; resInfernal: number; resStorm: number; resRunic: number;
  resDivine: number;
}

export interface ActiveSkill {
  ability: RaceAbility;
  cooldown: number;
  maxCooldown: number;
  unlocked: boolean;
  levelRequired: number;
}

export interface Currencies {
  copper: number; bronze: number; silver: number;
  gold: number; diamond: number; mithril: number;
}

export interface GameState {
  username: string; isLoggedIn: boolean;
  playerName: string; raceId: RaceId | null; gender: "male" | "female" | null;
  level: number; exp: number; maxLevel: number;
  currencies: Currencies;
  discoveredDungeons: DiscoveredDungeon[];
  currentBiome: BiomeId | null;
  towerProgress: number; unlockedFloors: number[];
  totalDungeonRuns: number; successfulDungeonRuns: number;
  baseHp: number; baseMp: number; baseAtkF: number; baseAtkM: number;
  baseDef: number; baseArmor: number; baseMagicRes: number;
  baseCritRate: number; baseCritDmg: number; baseAtkSpeed: number;
  baseLuck: number; baseDodge: number; baseLifeSteal: number;
  baseArmorPen: number; baseHpRegen: number; baseMpRegen: number;
  baseRes: Record<ElementId, number>;
  activeSkills: ActiveSkill[]; passiveSkillUnlocked: boolean;
  equipment: Record<EquipmentSlot, Item | null>;
  inventory: Item[]; inventorySize: number;
  activeSetBonuses: Map<string, any[]>; // Bônus de sets ativos
  maxZone: number; completedZones: number[];
  currentHp: number; currentMp: number; inCombat: boolean;
  currentEnemy: EnemyState | null; combatLog: string[];
}

const DEFAULT_RES: Record<ElementId, number> = {
  fogo: 0, agua: 0, terra: 0, ar: 0, luz: 0, escuridao: 0,
  gelo: 0, trovao: 0, natureza: 0, metal: 0, veneno: 0, sangue: 0,
  arcano: 0, caos: 0, void: 0, infernal: 0, divino: 0, sombra: 0,
  tempestade: 0, runico: 0, astral: 0, sagrado: 0,
};

const DEFAULT_CURRENCIES: Currencies = {
  copper: 0, bronze: 0, silver: 0, gold: 0, diamond: 0, mithril: 0,
};

const DEFAULT_STATE: GameState = {
  username: "", isLoggedIn: false, playerName: "", raceId: null, gender: null,
  level: 1, exp: 0, maxLevel: 300, currencies: DEFAULT_CURRENCIES,
  discoveredDungeons: [], currentBiome: null, towerProgress: 0, unlockedFloors: [1],
  totalDungeonRuns: 0, successfulDungeonRuns: 0,
  baseHp: 100, baseMp: 50, baseAtkF: 10, baseAtkM: 10, baseDef: 5,
  baseArmor: 0, baseMagicRes: 0, baseCritRate: 0.05, baseCritDmg: 1.5,
  baseAtkSpeed: 1, baseLuck: 0.001, baseDodge: 0.01, baseLifeSteal: 0,
  baseArmorPen: 0, baseHpRegen: 1, baseMpRegen: 0.5, baseRes: DEFAULT_RES,
  activeSkills: [], passiveSkillUnlocked: false,
  equipment: {
    head: null, chest: null, legs: null, feet: null, mainHand: null, offHand: null,
  },
  inventory: [], inventorySize: 50, maxZone: 1, completedZones: [],
  currentHp: 100, currentMp: 50, inCombat: false, currentEnemy: null, combatLog: [],
  activeSetBonuses: new Map(),
};

interface GameContextType {
  state: GameState; isLoading: boolean;
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
  getItemTierName: (item: Item) => string;
  getEquippedSetBonuses: () => Map<string, any[]>;
  generateLootFromMob: (mob: MobDef) => Item[];
  generateLootFromBoss: (mob: MobDef) => Item[];
  exploreBiome: (biomeId: BiomeId) => { found: boolean; dungeon?: DungeonDef; expGained: number; isNew: boolean };
  getDiscoveredDungeons: (biomeId: BiomeId) => DungeonDef[];
  getBiomeProgress: (biomeId: BiomeId) => { discovered: number; total: number; percentage: number };
  enterDungeon: (dungeonId: string) => boolean;
  completeDungeon: (dungeonId: string, success: boolean, timeSeconds: number) => void;
  getExpNeeded: () => number; getExpProgress: () => number;
  climbTower: (floor: number) => boolean;
  getTotalStats: () => {
    hp: number; mp: number; atkF: number; atkM: number; def: number;
    armor: number; magicRes: number; critRate: number; critDmg: number;
    atkSpeed: number; luck: number; dodge: number; lifeSteal: number;
    armorPen: number; hpRegen: number; mpRegen: number;
    res: Record<ElementId, number>;
  };
  getAllRaceStats: (raceId: RaceId) => any;
  startCombat: (mob: MobDef) => void;
  endCombat: (victory: boolean) => void;
  playerAttack: () => { damage: number; isCrit: boolean };
  playerUseSkill: (skillIndex: number) => { success: boolean; damage?: number; message?: string };
  enemyAttack: () => { damage: number; skillUsed?: string };
  regenHpMp: () => void;
  findEncounter: (biomeId: BiomeId) => { type: "mob" | "resource" | "dungeon" | "nothing"; mob?: MobDef; message: string };
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

  useEffect(() => { loadUserData(); }, []);

  async function loadUserData() {
    try {
      const currentUser = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (currentUser) {
        const userSaveKey = `save_${currentUser}`;
        const saved = await AsyncStorage.getItem(userSaveKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          setState({
            ...DEFAULT_STATE, ...parsed,
            currencies: { ...DEFAULT_CURRENCIES, ...(parsed.currencies || {}) },
            equipment: { ...DEFAULT_STATE.equipment, ...(parsed.equipment || {}) },
            baseRes: { ...DEFAULT_RES, ...(parsed.baseRes || {}) },
            username: currentUser, isLoggedIn: true,
          });
        } else {
          setState({ ...DEFAULT_STATE, username: currentUser, isLoggedIn: true });
        }
      }
    } catch (e) { console.error("Failed to load save:", e); }
    setIsLoading(false);
  }

  useEffect(() => {
    if (!isLoading && state.isLoggedIn && state.username) {
      AsyncStorage.setItem(`save_${state.username}`, JSON.stringify(state));
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
            ...DEFAULT_STATE, ...parsed,
            currencies: { ...DEFAULT_CURRENCIES, ...(parsed.currencies || {}) },
            equipment: { ...DEFAULT_STATE.equipment, ...(parsed.equipment || {}) },
            baseRes: { ...DEFAULT_RES, ...(parsed.baseRes || {}) },
            username, isLoggedIn: true,
          });
        } else {
          setState({ ...DEFAULT_STATE, username, isLoggedIn: true });
        }
        return true;
      }
      return false;
    } catch (e) { console.error("Login error:", e); return false; }
  }

  async function register(username: string, password: string): Promise<boolean> {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users: Record<string, string> = usersJson ? JSON.parse(usersJson) : {};
      if (users[username]) return false;
      users[username] = hashPassword(password);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      await AsyncStorage.setItem(CURRENT_USER_KEY, username);
      const newState = { ...DEFAULT_STATE, username, isLoggedIn: true };
      setState(newState);
      await AsyncStorage.setItem(`save_${username}`, JSON.stringify(newState));
      return true;
    } catch (e) { console.error("Register error:", e); return false; }
  }

  async function logout() {
    try {
      if (state.username) {
        await AsyncStorage.setItem(`save_${state.username}`, JSON.stringify(state));
      }
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      setState(DEFAULT_STATE);
    } catch (e) { console.error("Logout error:", e); }
  }

  const setPlayerName = (name: string) => setState(prev => ({ ...prev, playerName: name }));

  const selectRace = (raceId: RaceId, gender: "male" | "female") => {
    const race = getRaceById(raceId);
    if (!race) return;
    const activeAbilities = race.abilities.filter(a => a.type === "ativa");
    const activeSkills: ActiveSkill[] = activeAbilities.map((ability, index) => ({
      ability, cooldown: 0, maxCooldown: 5 + index * 2,
      unlocked: index === 0, levelRequired: 1 + index * 5,
    }));
    const res: Record<ElementId, number> = { ...DEFAULT_RES };
    Object.entries(race.resistances).forEach(([element, value]) => {
      if (element in res && value !== undefined) res[element as ElementId] = value;
    });
    setState(prev => ({
      ...prev, raceId, gender,
      baseHp: 100 + (race.stats.hp || 0), baseMp: 50 + (race.stats.hp || 0) * 0.5,
      baseAtkF: 10 + (race.stats.atkF || 0), baseAtkM: 10 + (race.stats.atkM || 0),
      baseDef: 5 + (race.stats.def || 0), baseArmor: race.stats.armor || 0,
      baseMagicRes: race.stats.magicRes || 0,
      baseCritRate: 0.03 + (race.stats.critBonus || 0),
      baseCritDmg: 1.3 + (race.stats.critMultBonus || 0),
      baseAtkSpeed: 1 + (race.stats.speed || 0) * 0.05,
      baseLuck: 0.001 + (race.stats.luck || 0),
      baseDodge: 0.01 + (race.stats.dodge || 0),
      baseLifeSteal: Math.min(race.stats.lifeSteal || 0, 0.03),
      baseArmorPen: race.stats.armorPen || 0, baseHpRegen: race.stats.hpRegen || 0,
      baseRes: res, activeSkills, passiveSkillUnlocked: true,
      currentHp: 100 + (race.stats.hp || 0),
      currentMp: 50 + (race.stats.hp || 0) * 0.5,
    }));
  };

  const equipItem = (item: Item, slot: EquipmentSlot) => {
    setState(prev => {
      const currentEquipped = prev.equipment[slot];
      const newInventory = [...prev.inventory];
      const itemIndex = newInventory.findIndex(i => i.id === item.id);
      if (itemIndex > -1) newInventory.splice(itemIndex, 1);
      if (currentEquipped) newInventory.push(currentEquipped);
      
      const newEquipment = { ...prev.equipment, [slot]: item };
      const equippedItems = Object.values(newEquipment).filter((i): i is Item => i !== null);
      const activeSetBonuses = getActiveSetBonuses(equippedItems);
      
      return { ...prev, equipment: newEquipment, inventory: newInventory, activeSetBonuses };
    });
  };

  const unequipItem = (slot: EquipmentSlot) => {
    setState(prev => {
      const item = prev.equipment[slot];
      if (!item || prev.inventory.length >= prev.inventorySize) return prev;
      
      const newEquipment = { ...prev.equipment, [slot]: null };
      const equippedItems = Object.values(newEquipment).filter((i): i is Item => i !== null);
      const activeSetBonuses = getActiveSetBonuses(equippedItems);
      
      return { ...prev, equipment: newEquipment, inventory: [...prev.inventory, item], activeSetBonuses };
    });
  };

  const sellItem = (itemId: string) => {
    setState(prev => {
      const item = prev.inventory.find(i => i.id === itemId);
      if (!item) return prev;
      return {
        ...prev,
        currencies: { ...prev.currencies, copper: prev.currencies.copper + item.value },
        inventory: prev.inventory.filter(i => i.id !== itemId),
      };
    });
  };

  const useSkill = (skillIndex: number) => {
    setState(prev => {
      const skills = [...prev.activeSkills];
      if (skills[skillIndex] && skills[skillIndex].cooldown === 0 && skills[skillIndex].unlocked) {
        skills[skillIndex] = { ...skills[skillIndex], cooldown: skills[skillIndex].maxCooldown };
      }
      return { ...prev, activeSkills: skills };
    });
  };

  const addCurrency = (type: keyof Currencies, amount: number) => {
    setState(prev => ({ ...prev, currencies: { ...prev.currencies, [type]: prev.currencies[type] + amount } }));
  };

  const getTotalStats = () => {
    let hp = state.baseHp, mp = state.baseMp, atkF = state.baseAtkF, atkM = state.baseAtkM;
    let def = state.baseDef, armor = state.baseArmor, magicRes = state.baseMagicRes;
    let critRate = state.baseCritRate, critDmg = state.baseCritDmg, atkSpeed = state.baseAtkSpeed;
    let luck = state.baseLuck, dodge = state.baseDodge, lifeSteal = state.baseLifeSteal;
    let armorPen = state.baseArmorPen, hpRegen = state.baseHpRegen, mpRegen = state.baseMpRegen;
    const res = { ...state.baseRes };

    // Stats base dos itens equipados
    const equippedItems = Object.values(state.equipment).filter((i): i is Item => i !== null);
    
    equippedItems.forEach(item => {
      hp += item.hp; atkF += item.atkF; atkM += item.atkM; def += item.def;
      armor += item.armor; magicRes += item.magicRes; critRate += item.critRate;
      critDmg += item.critDmg; atkSpeed += item.atkSpeed; luck += item.luck;
      dodge += item.dodge; lifeSteal += item.lifeSteal; armorPen += item.armorPen; hpRegen += item.hpRegen;
      res.fogo += item.resFire; res.agua += item.resWater; res.terra += item.resEarth;
      res.trovao += item.resThunder; res.gelo += item.resIce; res.ar += item.resWind;
      res.escuridao += item.resDark; res.luz += item.resLight; res.arcano += item.resArcane;
      res.veneno += item.resPoison; res.metal += item.resMetal; res.natureza += item.resNature;
      res.sangue += item.resBlood; res.void += item.resVoid; res.caos += item.resChaos;
      res.sombra += item.resShadow; res.infernal += item.resInfernal; res.tempestade += item.resStorm;
      res.runico += item.resRunic; res.divino += item.resDivine; res.sagrado += item.resHoly || 0;
    });

    // Aplicar bônus de sets
    for (const [setName, bonuses] of state.activeSetBonuses) {
      for (const bonus of bonuses) {
        if (bonus.stats) {
          hp += bonus.stats.hp || 0;
          mp += bonus.stats.mp || 0;
          atkF += bonus.stats.atkF || 0;
          atkM += bonus.stats.atkM || 0;
          def += bonus.stats.def || 0;
          armor += bonus.stats.armor || 0;
          magicRes += bonus.stats.magicRes || 0;
          critRate += bonus.stats.critRate || 0;
          critDmg += bonus.stats.critDmg || 0;
          atkSpeed += bonus.stats.atkSpeed || 0;
          dodge += bonus.stats.dodge || 0;
        }
      }
    }

    critRate = Math.min(critRate, 0.8); dodge = Math.min(dodge, 0.6); lifeSteal = Math.min(lifeSteal, 0.25);
    mp = hp * 0.5; mpRegen = hp * 0.01;

    return { hp, mp, atkF, atkM, def, armor, magicRes, critRate, critDmg, atkSpeed, luck, dodge, lifeSteal, armorPen, hpRegen, mpRegen, res };
  };

  const getAllRaceStats = (raceId: RaceId) => {
    const race = getRaceById(raceId);
    if (!race) return null;
    const res: Record<ElementId, number> = { ...DEFAULT_RES };
    Object.entries(race.resistances).forEach(([element, value]) => {
      if (element in res && value !== undefined) res[element as ElementId] = value;
    });
    return { ...race.stats, res };
  };

  // ============ SISTEMA DE COMBATE ============
  const startCombat = (mob: MobDef) => {
    setState(prev => ({
      ...prev, inCombat: true,
      currentEnemy: { mob, currentHp: mob.hp, maxHp: mob.hp, skillCooldowns: mob.skills.map(() => 0) },
      combatLog: [`⚔️ Combate iniciado contra ${mob.name}!`],
    }));
  };

  const endCombat = (victory: boolean) => {
    if (!state.currentEnemy) return;
    const mob = state.currentEnemy.mob;
    if (victory) {
      const drops = calculateDrops(mob);
      let remaining = drops.gold;
      const gold = Math.floor(remaining / 10000); remaining %= 10000;
      const silver = Math.floor(remaining / 100); remaining %= 100;
      const copper = remaining;
      
      // Gerar loot de equipamentos baseado no tipo do mob
      const mobType = mob.type || "normal";
      const itemDrops = generateMobLoot(mob.name, mob.level, mob.rank, mobType as any);
      const itemDropMessages: string[] = [];
      
      setState(prev => {
        const newCurrencies = { ...prev.currencies };
        if (copper > 0) newCurrencies.copper += copper;
        if (silver > 0) newCurrencies.silver += silver;
        if (gold > 0) newCurrencies.gold += gold;
        if (drops.diamonds > 0) newCurrencies.diamond += drops.diamonds;
        if (drops.mithril > 0) newCurrencies.mithril += drops.mithril;
        
        // Adicionar itens ao inventário (se houver espaço)
        const newInventory = [...prev.inventory];
        let itemsAdded = 0;
        let itemsDropped = 0;
        
        for (const item of itemDrops) {
          itemsDropped++;
          if (newInventory.length < prev.inventorySize) {
            newInventory.push(item);
            itemsAdded++;
            itemDropMessages.push(`${item.icon} ${item.name} (${getTierName(item.tier)})`);
          }
        }
        
        if (itemsDropped > 0 && itemsAdded === 0) {
          itemDropMessages.push("📦 Inventário cheio! Itens perdidos...");
        }
        
        const expGained = Math.floor(mob.level * 10 * (MOB_RANK_MULTIPLIERS[mob.rank]?.statMult || 1));
        
        const combatLogMessages: string[] = [
          `🎉 Vitória! +${expGained} XP`,
          ...(drops.gold > 0 ? [`💰 +${drops.gold} ouro`] : []),
          ...(drops.diamonds > 0 ? [`💎 +${drops.diamonds} diamantes`] : []),
          ...(drops.mithril > 0 ? [`✨ +${drops.mithril} mithril`] : []),
          ...(itemDropMessages.length > 0 ? ["📦 Drops:", ...itemDropMessages] : []),
        ];
        
        return {
          ...prev, 
          inCombat: false, 
          currentEnemy: null,
          currencies: newCurrencies, 
          exp: prev.exp + expGained,
          inventory: newInventory,
          combatLog: [...prev.combatLog, ...combatLogMessages],
        };
      });
    } else {
      setState(prev => ({ ...prev, inCombat: false, currentEnemy: null, combatLog: [...prev.combatLog, "💀 Derrota!"] }));
    }
  };

  const playerAttack = (): { damage: number; isCrit: boolean } => {
    if (!state.currentEnemy) return { damage: 0, isCrit: false };
    const stats = getTotalStats();
    const enemy = state.currentEnemy;
    let damage = stats.atkF - enemy.mob.def;
    const isCrit = Math.random() < stats.critRate;
    if (isCrit) damage *= stats.critDmg;
    damage *= (0.9 + Math.random() * 0.2);
    damage = Math.max(1, Math.floor(damage));
    const newHp = Math.max(0, enemy.currentHp - damage);
    setState(prev => ({
      ...prev,
      currentEnemy: prev.currentEnemy ? { ...prev.currentEnemy, currentHp: newHp } : null,
      combatLog: [...prev.combatLog, `⚔️ Você causou ${damage}${isCrit ? " CRÍTICO" : ""} de dano!`],
    }));
    if (newHp <= 0) setTimeout(() => endCombat(true), 500);
    return { damage, isCrit };
  };

  const playerUseSkill = (skillIndex: number): { success: boolean; damage?: number; message?: string } => {
    if (!state.currentEnemy) return { success: false, message: "Não está em combate" };
    const skill = state.activeSkills[skillIndex];
    if (!skill || !skill.unlocked) return { success: false, message: "Skill não desbloqueada" };
    if (skill.cooldown > 0) return { success: false, message: `Skill em cooldown (${skill.cooldown})` };
    const manaCost = 10 + (skillIndex * 5);
    if (state.currentMp < manaCost) return { success: false, message: "Mana insuficiente" };
    const stats = getTotalStats();
    const enemy = state.currentEnemy;
    let damage = stats.atkF * (1.5 + skillIndex * 0.5);
    if (skill.ability.description.includes("3 vezes") || skill.ability.description.includes("6 vezes")) {
      const hits = skill.ability.description.includes("6") ? 6 : 3;
      let totalDamage = 0;
      for (let i = 0; i < hits; i++) totalDamage += damage * 0.4;
      damage = totalDamage;
    }
    damage = Math.floor(damage);
    const newHp = Math.max(0, enemy.currentHp - damage);
    setState(prev => ({
      ...prev, currentMp: prev.currentMp - manaCost,
      currentEnemy: prev.currentEnemy ? { ...prev.currentEnemy, currentHp: newHp } : null,
      activeSkills: prev.activeSkills.map((s, i) => i === skillIndex ? { ...s, cooldown: s.maxCooldown } : s),
      combatLog: [...prev.combatLog, `✨ ${skill.ability.name}! ${damage} de dano!`],
    }));
    if (newHp <= 0) setTimeout(() => endCombat(true), 500);
    return { success: true, damage };
  };

  const enemyAttack = (): { damage: number; skillUsed?: string } => {
    if (!state.currentEnemy) return { damage: 0 };
    const enemy = state.currentEnemy;
    const stats = getTotalStats();
    let damage = 0; let skillUsed: string | undefined;
    const availableSkills = enemy.mob.skills.filter((s, i) => enemy.skillCooldowns[i] <= 0 && s.damageMultiplier > 0);
    if (availableSkills.length > 0 && Math.random() < 0.4) {
      const skill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
      damage = enemy.mob.atkF * skill.damageMultiplier;
      skillUsed = skill.name;
      const skillIndex = enemy.mob.skills.indexOf(skill);
      enemy.skillCooldowns[skillIndex] = skill.cooldown;
    } else {
      damage = enemy.mob.atkF;
    }
    damage = Math.max(1, damage - stats.def);
    if (Math.random() < stats.dodge) {
      setState(prev => ({ ...prev, combatLog: [...prev.combatLog, `💨 Você esquivou do ataque!`] }));
      return { damage: 0 };
    }
    const newHp = Math.max(0, state.currentHp - damage);
    setState(prev => ({
      ...prev, currentHp: newHp,
      currentEnemy: prev.currentEnemy ? { ...prev.currentEnemy, skillCooldowns: prev.currentEnemy.skillCooldowns.map(c => Math.max(0, c - 1)) } : null,
      combatLog: [...prev.combatLog, `🗡️ ${enemy.mob.name} causou ${damage} de dano${skillUsed ? ` (${skillUsed})` : ""}!`],
    }));
    if (newHp <= 0) setTimeout(() => endCombat(false), 500);
    return { damage, skillUsed };
  };

  const regenHpMp = () => {
    const stats = getTotalStats();
    setState(prev => ({
      ...prev,
      currentHp: Math.min(stats.hp, prev.currentHp + stats.hpRegen),
      currentMp: Math.min(stats.mp, prev.currentMp + stats.mpRegen),
    }));
  };

  // ============ SISTEMA DE AVENTURA ============
  const exploreBiome = (biomeId: BiomeId): { found: boolean; dungeon?: DungeonDef; expGained: number; isNew: boolean } => {
    const biome = BIOMES[biomeId];
    if (state.level < biome.minLevel) return { found: false, expGained: 0, isNew: false };
    const result = tryDiscoverDungeon(biomeId, state.discoveredDungeons, state.level);
    let isNew = false;
    if (result) {
      const alreadyDiscovered = state.discoveredDungeons.find(d => d.dungeonId === result.dungeon.id);
      isNew = !alreadyDiscovered;
      if (isNew) {
        const newDiscovered: DiscoveredDungeon = {
          dungeonId: result.dungeon.id, discoveredAt: Date.now(),
          timesCompleted: 0, totalRuns: 0, successfulRuns: 0,
        };
        setState(prev => ({
          ...prev,
          discoveredDungeons: [...prev.discoveredDungeons, newDiscovered],
          currentBiome: biomeId,
        }));
      }
    }
    const baseExp = 50 * biome.minLevel;
    const expGained = Math.floor(baseExp * (0.8 + Math.random() * 0.4));
    return { found: !!result, dungeon: result?.dungeon, expGained, isNew };
  };

  const getDiscoveredDungeons = (biomeId: BiomeId): DungeonDef[] => {
    return getDiscoveredDungeonsForBiome(biomeId, state.discoveredDungeons);
  };

  const getBiomeProgress = (biomeId: BiomeId) => {
    return getBiomeDiscoveryProgress(biomeId, state.discoveredDungeons);
  };

  const enterDungeon = (dungeonId: string): boolean => {
    const discovered = state.discoveredDungeons.find(d => d.dungeonId === dungeonId);
    return !!discovered;
  };

  const completeDungeon = (dungeonId: string, success: boolean, timeSeconds: number) => {
    setState(prev => {
      const discovered = prev.discoveredDungeons.find(d => d.dungeonId === dungeonId);
      if (!discovered) return prev;
      const updatedDiscovered = prev.discoveredDungeons.map(d => {
        if (d.dungeonId === dungeonId) {
          return {
            ...d, timesCompleted: success ? d.timesCompleted + 1 : d.timesCompleted,
            lastCompletedAt: Date.now(),
            bestTime: d.bestTime ? Math.min(d.bestTime, timeSeconds) : timeSeconds,
            totalRuns: d.totalRuns + 1,
            successfulRuns: success ? d.successfulRuns + 1 : d.successfulRuns,
          };
        }
        return d;
      });
      return {
        ...prev, discoveredDungeons: updatedDiscovered,
        totalDungeonRuns: prev.totalDungeonRuns + 1,
        successfulDungeonRuns: success ? prev.successfulDungeonRuns + 1 : prev.successfulDungeonRuns,
      };
    });
  };

  const getExpNeeded = () => calculateExpNeeded(state.level);
  const getExpProgress = () => (state.exp / calculateExpNeeded(state.level)) * 100;

  const climbTower = (floor: number): boolean => {
    if (!state.unlockedFloors.includes(floor)) return false;
    if (state.towerProgress >= floor) return false;
    return true;
  };

  const findEncounter = (biomeId: BiomeId): { type: "mob" | "resource" | "dungeon" | "nothing"; mob?: MobDef; message: string } => {
    const roll = Math.random() * 100;
    if (roll < 40) {
      const mob = findRandomMob(state.level, FOREST_MOBS);
      if (mob) return { type: "mob", mob, message: `Você encontrou um ${mob.name}!` };
    }
    if (roll < 60) return { type: "dungeon", message: "Você sente uma presença misteriosa..." };
    if (roll < 75) return { type: "resource", message: "Você encontrou alguns recursos!" };
    return { type: "nothing", message: "Você explorou a área mas não encontrou nada de interessante." };
  };

  const generateItem = (slot: EquipmentSlot): Item => {
    const tier = rollTier(); const quality = rollQuality(); const multiplier = getTotalMultiplier(tier, quality);
    const baseValue = 10;
    return {
      id: Date.now().toString(), name: `${TIERS[tier].name} ${slot}`, slot, tier, quality,
      hp: Math.floor(baseValue * multiplier * (Math.random() * 0.5 + 0.75)),
      atkF: slot === "mainHand" ? Math.floor(baseValue * multiplier * (Math.random() * 0.5 + 0.75)) : 0,
      atkM: slot === "mainHand" ? Math.floor(baseValue * 0.7 * multiplier * (Math.random() * 0.5 + 0.75)) : 0,
      def: 0, armor: ["helmet", "chest", "legs", "boots", "shoulders"].includes(slot) ? Math.floor(baseValue * 0.5 * multiplier) : 0,
      magicRes: ["helmet", "chest", "legs", "boots", "cape"].includes(slot) ? Math.floor(baseValue * 0.3 * multiplier) : 0,
      critRate: slot === "ring1" || slot === "ring2" ? 0.01 * multiplier : 0, critDmg: 0, atkSpeed: 0, luck: 0,
      dodge: slot === "boots" ? 0.01 * multiplier : 0, lifeSteal: 0, armorPen: 0, hpRegen: 0,
      resFire: 0, resWater: 0, resEarth: 0, resThunder: 0, resIce: 0, resWind: 0, resDark: 0, resLight: 0,
      resArcane: 0, resPoison: 0, resMetal: 0, resNature: 0, resBlood: 0, resVoid: 0, resChaos: 0,
      resHoly: 0, resShadow: 0, resInfernal: 0, resStorm: 0, resRunic: 0, resDivine: 0,
      value: Math.floor(baseValue * multiplier), icon: "🗡️",
    };
  };

  const getItemColor = (item: Item): string => getTierColor(item.tier);
  const getItemTierName = (item: Item): string => getTierName(item.tier);
  const getEquippedSetBonuses = (): Map<string, any[]> => state.activeSetBonuses;
  
  // Gerar loot de mob comum
  const generateLootFromMob = (mob: MobDef): Item[] => {
    const loot: Item[] = [];
    const dropChance = MOB_RANK_MULTIPLIERS[mob.rank]?.dropRate || 0.3;
    
    if (Math.random() < dropChance) {
      const slots: EquipmentSlot[] = ["mainHand", "offHand", "head", "chest", "legs", "feet"];
      const slot = slots[Math.floor(Math.random() * slots.length)];
      
      // Tier baseado no rank do mob
      const tierMap: Record<string, EquipmentBase["tier"]> = {
        "F": "F", "E": "E", "D": "D", "C": "C", "B": "B",
        "A": "A", "S": "S", "SS": "SS", "SSS": "SSS", "SSS+": "SSS+"
      };
      const tier = tierMap[mob.rank] || "F";
      
      const item = generateRandomEquipment(slot, tier, mob.level);
      if (item) {
        // Adicionar campos extras do Item
        const fullItem: Item = {
          ...item,
          quality: "common",
          luck: 0,
          lifeSteal: 0,
          armorPen: 0,
          hpRegen: 0,
          value: Math.floor(10 * (tier === "F" ? 1 : tier === "E" ? 2 : tier === "D" ? 5 : tier === "C" ? 10 : tier === "B" ? 25 : tier === "A" ? 50 : tier === "S" ? 100 : tier === "SS" ? 250 : tier === "SSS" ? 500 : 1000)),
          resFire: 0, resWater: 0, resEarth: 0, resThunder: 0,
          resIce: 0, resWind: 0, resDark: 0, resLight: 0,
          resArcane: 0, resPoison: 0, resMetal: 0, resNature: 0,
          resBlood: 0, resVoid: 0, resChaos: 0, resHoly: 0,
          resShadow: 0, resInfernal: 0, resStorm: 0, resRunic: 0, resDivine: 0,
        };
        loot.push(fullItem);
      }
    }
    
    return loot;
  };
  
  // Gerar loot de boss
  const generateLootFromBoss = (mob: MobDef): Item[] => {
    const tierMap: Record<string, EquipmentBase["tier"]> = {
      "F": "D", "E": "C", "D": "B", "C": "A", "B": "S", "A": "SS", "S": "SSS", "SS": "SSS", "SSS": "SSS+", "SSS+": "SSS+"
    };
    const tier = tierMap[mob.rank] || "C";
    const bossLoot = generateBossLoot(mob.name, mob.level, tier, 2);
    
    // Converter para Item completo
    return bossLoot.map(item => ({
      ...item,
      quality: "epic",
      luck: 0.01,
      lifeSteal: 0,
      armorPen: 0,
      hpRegen: 0,
      value: Math.floor(100 * (tier === "C" ? 10 : tier === "B" ? 25 : tier === "A" ? 50 : tier === "S" ? 100 : tier === "SS" ? 250 : tier === "SSS" ? 500 : 1000)),
      resFire: 0, resWater: 0, resEarth: 0, resThunder: 0,
      resIce: 0, resWind: 0, resDark: 0, resLight: 0,
      resArcane: 0, resPoison: 0, resMetal: 0, resNature: 0,
      resBlood: 0, resVoid: 0, resChaos: 0, resHoly: 0,
      resShadow: 0, resInfernal: 0, resStorm: 0, resRunic: 0, resDivine: 0,
    }));
  };

  return (
    <GameContext.Provider value={{
      state, isLoading, login, register, logout, setPlayerName, selectRace,
      equipItem, unequipItem, sellItem, useSkill, addCurrency, generateItem, getItemColor,
      getItemTierName, getEquippedSetBonuses, generateLootFromMob, generateLootFromBoss,
      exploreBiome, getDiscoveredDungeons, getBiomeProgress, enterDungeon, completeDungeon,
      getExpNeeded, getExpProgress, climbTower, getTotalStats, getAllRaceStats,
      startCombat, endCombat, playerAttack, playerUseSkill, enemyAttack, regenHpMp, findEncounter,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
