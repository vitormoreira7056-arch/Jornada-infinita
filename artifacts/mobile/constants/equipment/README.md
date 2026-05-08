# Sistema de Equipamentos - Jornada Infinita

## Visão Geral

Sistema completo de equipamentos com **10,000+ variações por tipo**, incluindo:
- Armas com habilidades ativas e passivas
- Armaduras com bônus defensivos
- Itens de mão secundária (off-hand) com utilidades diversas
- Sets de equipamento com bônus de coleção completa

## Estrutura de Arquivos

```
equipment/
├── base.ts       # Tipos base, slots, multiplicadores de tier
├── weapons.ts    # Sistema de armas (12 tipos)
├── armor.ts      # Sistema de armaduras (cabeça, peitoral, pernas, pés)
├── offhand.ts    # Sistema de off-hand (10 tipos)
├── sets.ts       # Sets com bônus de coleção (20+ sets)
├── demo.ts       # Funções de demonstração e teste
└── index.ts      # Exportações e funções utilitárias
```

## Tipos de Equipamento

### Armas (12 tipos)
- **Espada** - Equilibrada, boa para iniciantes
- **Espada Dupla** - Alta velocidade, dano rápido
- **Adaga** - Críticos altos, dano pelas costas
- **Adaga Dupla** - Velocidade extrema, múltiplos ataques
- **Machado** - Dano alto, quebra armaduras
- **Martelo** - Atordoamento, dano massivo
- **Maça** - Esmagamento, reduz defesa
- **Foice** - Executa inimigos fracos, drena vida
- **Arco** - Alcance longo, precisão
- **Varinha** - Magia rápida, baixo custo
- **Cajado** - Magia poderosa, alto custo
- **Lança** - Alcance médio, perfura múltiplos alvos

### Armaduras

#### Cabeça (6 tipos)
- Elmo, Capuz, Capacete, Coroa, Máscara, Bandana

#### Peitoral (6 tipos)
- Armadura, Robe, Casaco, Colete, Túnica, Couraça

#### Pernas (5 tipos)
- Calça, Saia, Bermuda, Grevas, Calças

#### Pés (5 tipos)
- Botas, Sandálias, Sapatos, Grevas de Pés, Meias

### Off-Hand (10 tipos)
- **Escudo** - Defesa, bloqueio
- **Orbe** - Poder mágico, mana
- **Tocha** - Luz, dano de fogo
- **Grimório** - Conhecimento, redução de cooldown
- **Lume** - Cura, proteção sagrada
- **Bengala** - Velocidade, comando
- **Lanterna** - Exploração, precisão
- **Totem** - Proteção ancestral, invocação
- **Livro** - Estratégia, experiência
- **Adaga Off** - Combate dual, contra-ataque

## Sistema de Tier

| Tier | Cor | Multiplicador | Drop Rate |
|------|-----|---------------|-----------|
| F | Cinza | 0.5x | 35% |
| E | Verde | 0.7x | 25% |
| D | Azul | 1.0x | 18% |
| C | Roxo | 1.4x | 12% |
| B | Laranja | 2.0x | 6% |
| A | Vermelho | 3.0x | 3% |
| S | Rosa | 5.0x | 1% |
| SS | Ciano | 8.0x | 0.4% |
| SSS | Dourado | 15.0x | 0.1% |
| SSS+ | Branco | 30.0x | 0.01% |

## Sistema de Sets

Cada set possui bônus progressivos baseados no número de peças equipadas:

### Sets Iniciais (Tier F-E)
- **Conjunto do Aprendiz** - Foco em mana e regeneração
- **Conjunto do Recruta** - Foco em defesa e HP
- **Conjunto do Caçador** - Foco em precisão e dano a animais

### Sets Intermediários (Tier D-C)
- **Vontade de Ferro** - Imunidade a atordoamento
- **Estudante Arcano** - Redução de custo de mana
- **Caminhante das Sombras** - Invisibilidade ao esquivar
- **Guardião da Floresta** - Regeneração de HP

### Sets Avançados (Tier B-A)
- **Matador de Dragões** - Resistência a fogo, stats elevados
- **Invocador de Tempestades** - Dano elétrico, procs de raio
- **Paladino** - Cura ao bloquear, proteção divina
- **Lâmina Noturna** - Dano pelas costas, assassinato

### Sets Épicos (Tier S)
- **Rei Antigo** - Bônus em todos atributos
- **Arquimago** - Habilidades gratuitas periodicamente
- **Caçador de Demônios** - Dano aumentado contra trevas

### Sets Lendários (Tier SS)
- **Celestial** - Revive uma vez por dia
- **Caminhante do Vazio** - Chance de ignorar dano
- **Senhor Elemental** - Dano elemental aleatório

### Sets Míticos (Tier SSS)
- **Imortal** - Não pode morrer (fica com 1 HP)
- **Sábio Cósmico** - Habilidades sem cooldown
- **Rei das Sombras** - Invisibilidade após kills
- **Avatar da Natureza** - Invoca espírito permanente

## Geração de Nomes

Cada item é gerado com nome único seguindo o padrão:
```
[Prefixo] [Nome Base] [Sufixo de Material/Origem]
```

Exemplos:
- "Lendária Espada Flamejante de Mithril"
- "Épico Elmo de Dragão do Guardião"
- "Divino Grimório Arcano de Ossos"

### Prefixos por Tier
- **F-E**: (vazio), Usado, Desgastado, Simples
- **D-C**: Polido, Afiado, Equilibrado, Refinado
- **B-A**: Brilhante, Rúnico, Encantado, Místico
- **S-SSS+**: Divino, Épico, Lendário, Mítico, Primordial

### Sufixos de Material (20+)
Ferro, Aço, Bronze, Prata, Ouro, Mithril, Adamantita, Obsidiana, Cristal, Ossos, Madeira, Ébano, Marfim, Jade, Rubi, Safira, Esmeralda, Diamante, Âmbar, Ânima

### Sufixos de Origem (20+)
Lobo, Urso, Dragão, Aranha, Serpente, Orc, Troll, Gigante, Elemental, Demônio, Anjo, Espírito, Natureza, Sombras, Luz, Vazio, Abismo, Céu, Inferno, Caos

## Habilidades

### Passivas
Cada item possui um efeito passivo único:
- Armas: Dano crítico, vampirismo, velocidade, efeitos de status
- Armaduras: Defesa, regeneração, resistências, esquiva
- Off-hand: Utilidades específicas do tipo

### Ativas
Armas e off-hands possuem habilidades ativas:
- Cooldowns variando de 5s a 300s
- Custos de mana proporcionais ao poder
- Efeitos únicos (dano, cura, buffs, invocação)

## Integração com GameContext

```typescript
// Gerar loot de mob
const loot = generateLootFromMob(mob);

// Gerar loot de boss
const bossLoot = generateLootFromBoss(boss);

// Equipar item
equipItem(item, slot);

// Ver bônus de sets ativos
const setBonuses = getEquippedSetBonuses();

// Stats totais com bônus de sets
const stats = getTotalStats();
```

## Estimativa de Variações

- **Tipos de equipamento**: 44
- **Tiers**: 10
- **Nomes base**: ~30 por tipo
- **Prefixos**: 5 por tier
- **Sufixos**: 40
- **Efeitos passivos**: 6+ por tipo
- **Habilidades ativas**: 3+ por tipo

**Total estimado**: 10,000+ variações por tipo de equipamento

## Uso no Jogo

1. **Drops de Mobs**: Chance baseada no rank do mob
2. **Drops de Bosses**: Tier garantido mais alto
3. **Loja**: Itens comuns a raros
4. **Ferreiro**: Crafting e upgrades
5. **Imbuidor**: Adicionar/alterar propriedades
6. **Artesão**: Criar sets específicos
