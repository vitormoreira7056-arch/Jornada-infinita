# Sistema de Drops - Jornada Infinita

## Visão Geral

Sistema completo de drops de equipamentos baseado no tipo e rank do mob.

## Chances de Drop

| Tipo do Mob | Chance de Drop | Itens (min-max) | Boost de Tier |
|-------------|----------------|-----------------|---------------|
| Normal | 15% | 0-1 | - |
| Elite | 40% | 0-2 | +1 tier |
| Único | 60% | 0-2 | +1 tier |
| Boss | 85% | 1-3 | +2 tiers |

## Tier dos Drops

O tier do item dropado é baseado no rank do mob, com boost conforme o tipo:

### Mobs Normais
- Rank F → Tier F
- Rank E → Tier E
- Rank D → Tier D
- ...

### Elites e Únicos (+1 tier)
- Rank F → Tier E
- Rank E → Tier D
- Rank D → Tier C
- ...

### Bosses (+2 tiers)
- Rank F → Tier D
- Rank E → Tier C
- Rank D → Tier B
- Rank C → Tier A
- ...

## Bônus de Boss

Itens dropados por bosses recebem:
- Nome único: `"[Nome do Item] de [Nome do Boss]"`
- +30% em todos os stats
- Tier significativamente melhor

## Exemplos

### Mob Normal Rank F (Level 5)
- Chance: 15% de dropar 1 item
- Tier: F
- Exemplo: `"Espada Usada de Ferro"` (Tier F)

### Elite Rank C (Level 25)
- Chance: 40% de dropar 0-2 itens
- Tier: B
- Exemplo: `"Lâmina Refinada de Mithril"` (Tier B)

### Boss Rank S (Level 100)
- Chance: 85% de dropar 1-3 itens
- Tier: SSS
- Exemplo: `"Lendária Espada Flamejante de Dragão Ancião"` (Tier SSS)

## Fluxo do Sistema

1. **Combate Inicia** → Jogador vs Mob
2. **Vitória** → Calcula drops
3. **Gera Itens** → Baseado no tipo/rank do mob
4. **Adiciona ao Inventário** → Se houver espaço
5. **Mostra Loot** → Tela de loot com itens dropados
6. **Equipar/Guardar** → Jogador decide o que fazer

## Funções Principais

```typescript
// Gerar loot de mob específico
const loot = generateMobLoot(mobName, mobLevel, mobRank, mobType);

// Gerar loot de boss
const bossLoot = generateBossLoot(bossName, bossLevel, tier, itemCount);

// Gerar loot de mini-boss
const miniBossLoot = generateMiniBossLoot(miniBossName, miniBossLevel, tier);
```

## Integração com Combate

O sistema está integrado na função `endCombat()` do GameContext:

```typescript
if (victory) {
  // Gerar loot baseado no tipo do mob
  const itemDrops = generateMobLoot(mob.name, mob.level, mob.rank, mob.type);
  
  // Adicionar ao inventário
  for (const item of itemDrops) {
    if (newInventory.length < prev.inventorySize) {
      newInventory.push(item);
    }
  }
  
  // Mostrar no log de combate
  combatLog.push(`📦 Drops: ${item.name} (${tier})`);
}
```

## Tela de Loot

Após a vitória, o jogador é redirecionado para a tela de loot que mostra:
- Todos os itens dropados
- Stats de cada item
- Efeitos passivos e habilidades
- Botão para equipar imediatamente
- Botão para continuar (guarda no inventário)
