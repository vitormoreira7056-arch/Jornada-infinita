# 🎲 Tabela Completa de Taxas de Drop - Jornada Infinita

## 📊 Resumo por Tipo de Mob

| Tipo de Mob | Chance de Drop | Itens (min-max) | Boost de Tier |
|-------------|----------------|-----------------|---------------|
| **Normal** | 15% | 0-1 | - |
| **Elite** | 40% | 0-2 | +1 tier |
| **Único** | 60% | 0-2 | +1 tier |
| **Boss** | 85% | 1-3 | +2 tiers |

---

## 🎯 Tier dos Drops por Rank do Mob

### Mobs Normais (sem boost)

| Rank do Mob | Tier Dropado | Cor | Multiplicador de Stats |
|-------------|--------------|-----|------------------------|
| F | F (Comum) | Cinza | 0.5x |
| E | E (Incomum) | Verde | 0.7x |
| D | D (Raro) | Azul | 1.0x |
| C | C (Épico) | Roxo | 1.4x |
| B | B (Lendário) | Laranja | 2.0x |
| A | A (Mítico) | Vermelho | 3.0x |
| S | S (Sagrado) | Rosa | 5.0x |
| SS | SS (Divino) | Ciano | 8.0x |
| SSS | SSS (Cósmico) | Dourado | 15.0x |
| SSS+ | SSS+ (Transcendental) | Branco | 30.0x |

### Elites e Únicos (+1 tier)

| Rank do Mob | Tier Dropado | Exemplo de Nome |
|-------------|--------------|-----------------|
| F | E | Adaga Polida de Lobo |
| E | D | Espada Rúnica de Urso |
| D | C | Elmo Místico de Troll |
| C | B | Armadura Lendária de Dragão |
| B | A | Machado Mítico de Gigante |
| A | S | Cajado Sagrado de Demônio |
| S | SS | Arco Divino de Elemental |
| SS | SSS | Foice Cósmica de Ceifador |
| SSS | SSS+ | Varinha Transcendental de Deus |

### Bosses (+2 tiers)

| Rank do Mob | Tier Dropado | Bônus de Stats |
|-------------|--------------|----------------|
| F | D | +30% em todos os stats |
| E | C | +30% em todos os stats |
| D | B | +30% em todos os stats |
| C | A | +30% em todos os stats |
| B | S | +30% em todos os stats |
| A | SS | +30% em todos os stats |
| S | SSS | +30% em todos os stats |
| SS | SSS+ | +30% em todos os stats |
| SSS | SSS+ | +30% em todos os stats |

**Exemplo**: Boss Rank C (Level 50) → Dropa item Tier A com nome "Lendária Espada Flamejante de Dragão Ancião" com +30% stats

---

## 📈 Probabilidade de Drop por Tier (Dentro da chance base)

Quando um mob dropa um item, a probabilidade de cada tier é:

| Tier | Drop Rate | Cor | Raridade |
|------|-----------|-----|----------|
| F | 35% | Cinza | Muito Comum |
| E | 25% | Verde | Comum |
| D | 18% | Azul | Incomum |
| C | 12% | Roxo | Raro |
| B | 6% | Laranja | Muito Raro |
| A | 3% | Vermelho | Épico |
| S | 1% | Rosa | Lendário |
| SS | 0.4% | Ciano | Mítico |
| SSS | 0.1% | Dourado | Divino |
| SSS+ | 0.01% | Branco | Transcendental |

---

## 🎲 Exemplos Práticos

### Cenário 1: Matar 100 Lobos Cinzentos (Normal, Rank F, Level 3)
- **Chance de drop**: 15%
- **Itens esperados**: ~15 itens
- **Tier**: F (Comum)
- **Exemplo**: "Adaga Usada de Ossos" (Tier F, stats 0.5x)

### Cenário 2: Matar 10 Elites (Elite, Rank C, Level 25)
- **Chance de drop**: 40% cada
- **Itens esperados**: ~4-8 itens (0-2 por elite)
- **Tier**: B (Lendário) - boost +1
- **Exemplo**: "Lâmina Lendária de Mithril do Elite" (Tier B, stats 2.0x)

### Cenário 3: Matar 1 Dragão Ancião (Boss, Rank S, Level 100)
- **Chance de drop**: 85%
- **Itens esperados**: 1-3 itens
- **Tier**: SSS (Cósmico) - boost +2
- **Bônus**: +30% em todos os stats
- **Exemplo**: "Lendária Espada Flamejante de Dragão Ancião" (Tier SSS, stats 15.0x + 30%)

---

## 🎁 Tabela de Drops por Bioma (Futuro)

| Bioma | Level | Mobs Comuns | Elites | Boss |
|-------|-------|-------------|--------|------|
| Floresta | 1-20 | F-E | D-C | B |
| Caverna | 15-35 | E-D | C-B | A |
| Montanha | 30-50 | D-C | B-A | S |
| Pântano | 45-65 | C-B | A-S | SS |
| Deserto | 60-80 | B-A | S-SS | SSS |
| Vulcão | 75-100 | A-S | SS-SSS | SSS+ |

---

## 💡 Dicas para Farmar

1. **Para itens Tier F-C**: Farme mobs normais em grande quantidade
2. **Para itens Tier B-A**: Procure Elites e Únicos
3. **Para itens Tier S+**: Só drops de Bosses
4. **Para itens SSS+**: Apenas Bosses de rank SS ou superior

---

## 🔧 Fórmula de Cálculo

```typescript
// Chance de dropar item
if (Math.random() < dropChance) {
  // Quantidade de itens
  itemsToDrop = random(min, max);
  
  // Tier baseado no rank + boost
  tier = rankToTier[mobRank];
  if (boss) tier = tierBoostBoss[tier];
  if (elite/unique) tier = tierBoostElite[tier];
  
  // Gerar item
  item = generateRandomEquipment(slot, tier, mobLevel);
  
  // Bônus de boss
  if (boss) {
    item.stats *= 1.3;
    item.name = `${item.name} de ${bossName}`;
  }
}
```
