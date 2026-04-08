---
questObtained: 2024-04-03
questStatus: In Progress
questGiver: "[[Wilma|Wilma]]"
questLocationObtained: "[[Lampoteuo City|Lampoteuo City]]"
questSessionObtained: "[[2000-01-01|2000-01-01]]"
questNotes:
questLootAvail: "[[Broken Stick|Broken Stick]]"
questLookEarned:
NoteIcon: quest
obsidianUIMode: preview
tags:
  - quest
---

# `=this.file.name`

> [!infobox]+
> # `=this.file.name`
> ###### Quest Details
> Type |  Stat |
> ---|---|
> Date Obtained | `INPUT[datePicker:questObtained]` |
> Status | `INPUT[inlineSelect(option(Not Started), option(In Progress), option(Complete)):questStatus]` |
> Quest Giver | `INPUT[suggester(optionQuery(#npc)):questGiver]` |
> Quest Location | `INPUT[suggester(optionQuery(#Category/Settlement)):questLocationObtained]` |
> Session Obtained | `INPUT[suggester(optionQuery(#journal)):questSessionObtained]` |
> Available Loot | `INPUT[suggester(optionQuery(#item)):questLootAvail]` |
> Acquired Loot | `INPUT[suggester(optionQuery(#item)):questLookEarned]` |

Naughty Goblin. 

### Quest Objective

- Beat him

### Rewards

- Bigger stick
