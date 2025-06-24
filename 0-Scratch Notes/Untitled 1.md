---
level: 1
proficiency_bonus: 2
hp: 60
modifier: 100
ac: 50
---

```badges
items:
  - label: Race
    value: 'Half-Orc'
  - label: Level
    value: '{{ frontmatter.level }}'
  - label: Initiative
    value: '+{{ modifier abilities.dexterity }}'
  - label: AC
    value: '{{ frontmatter.ac }}'
  - label: Spell Attack
    value: '{{ add 10 frontmatter.modifier (modifier abilities.intelligence) }}'
```

<br>

```event-btns
items:
  - name: Short Rest
    value: short-rest
  - name: Long Rest
    value: long-rest
```

<br>

```healthpoints
state_key: my_character_hp
health: '{{ frontmatter.hp }}'
reset_on: long-rest
hitdice:
  dice: d8
  value: 3
```

<br>

```ability
abilities:
  strength: 14
  dexterity: 16
  constitution: 13
  intelligence: 12
  wisdom: 10
  charisma: 8

proficiencies:
  - dexterity
  - intelligence
```

<br>

```skills
proficiencies:
  - arcana
  - deception
  - history
  - insight
  - investigation

bonuses:
  - name: Right of Arcana
    target: arcana
    value: 2

expertise:
  - investigation

half_proficiencies:
  - history
```

<br>

```consumable
items:
  - label: "Level 1 Spells"
    state_key: my_character_spells_1
    uses: 3
    reset_on: "long-rest"
  - label: "Sneak Attack"
    state_key: my_character_sneak_attack
    uses: 1
    reset_on: ["short-rest", "long-rest"]
```