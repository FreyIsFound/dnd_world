<%*
const modalForm = app.plugins.plugins.modalforms?.api;
if (!modalForm) {
  new Notice("Modal Forms plugin is not enabled.");
  return;
}

const result = await modalForm.openForm("New-PointOfInterest");
if (!result || result.status !== "ok") return;

const data = result.getData();

const poiName = String(data["SelectPOVName"] ?? "").trim();
const parentName = String(data["SelectParent"] ?? "").trim();

// Rename note
if (poiName) {
  await tp.file.rename(poiName);
}

// Build MyContainer link
let myContainerValue = "None";
if (parentName) {
  myContainerValue = `[[${parentName}|${parentName}]]`;
}

// Write frontmatter
tR = `---
tags:
  - Category/PointofInterest
MyContainer:
  - "${myContainerValue}"
MyCategory: Encounter
obsidianUIMode: preview
image: "A Cave.png"
---
`;
%>

> [!NOTE] Parent Region: `INPUT[suggester(optionQuery(#Category/Region),optionQuery(#Category/StarSystem)):MyContainer]`

> [!column|no-i no-t]
>> [!info|no-title] Map
>> ```zoommap
>> imageBases:
>>   - path: z_Assets/A Cave.png
>> markers: z_Assets/A Cave.markers.json
>> markerLayers:
>>   - Default
>> minZoom: 0.00005
>> maxZoom: 2
>> wrap: false
>> responsive: false
>> width: 1221px
>> height: 490px
>> resizable: false
>> resizeHandle: native
>> render: dom
>> id: map-mkx4t9jr
>> view:
>>   zoom: 0.0752
>>   centerX: 0.479370
>>   centerY: 0.543033
>> ```
>
>> [!note|no-title] Town Name
>> ~~~meta-bind
>> INPUT[select(
>> option(1, ℹ️General),
>> option(3, 📝GM Notes),
>> option(4, 📝Travel),
>> class(tabbed)
>> )]
>> ~~~
>>>[!tabbed-box-maxh|no-title]
>>> >[!div-m|no-title]
>>> > ![[#General|no-h clean]]
>>>
>>> > [!div-m|no-title]
>>> > ![[#GM Notes|no-h clean]]
>>> 
>>> > [!div-m|no-title]
>>> > ![[#Travel|no-h clean]]
>>> 

> [!NOTE|no-title]
> ~~~meta-bind
> INPUT[select(
> option(1, 🎬Scene Summary),
> option(2, ❗Quests),
> option(3, 🧑People),
> option(4, ⚔️Encounters),
> class(tabbed)
> )]
> ~~~
> >[!tabbed-box|no-title]
> > >[!div-m|no-title]
> > > ![[#Scene Summary|no-h1 clean]]
> >
> > > [!div-m|no-title]
> > > ![[#Quests|no-h2 clean]]
> > 
> > > [!div-m|no-title]
> > > ![[#People|no-h clean]]
> > 
> > > [!div-m|no-title]
> > > ![[#Encounter|no-h clean]]
> > 
> > > [!div-m|no-title]
> > > ![[#Loot|no-h clean]]

---
# General

Select Category: `INPUT[template-poi-type][:MyCategory]`
%% MODIFY OPTIONS IN SETTINGS > COMMUNITY PLUGINS > META-BIND > EDIT TEMPLATES > template-poi-type %%

This is the description for the location.

# GM Notes

Make notes of what you need to track in the Point of Interest here. 

# Travel

`VIEW[{Travel Calculator#HoursPerDay}][math]` hrs per day
[[Travel Calculator]]  / [[Exhaustion]] Level: `VIEW[{Travel Calculator#ExhaustionLevel}][math]`

| Destination |  Travel Days  |
| ---|---|
| [[Next Town A]] | 🕓: `VIEW[round((88* {Travel Calculator#TravelCalc}) / 60 / {Travel Calculator#HoursPerDay}, 1)]`      |
| [[Next Town B ]] | 🕓: `VIEW[round((99* {Travel Calculator#TravelCalc}) / 60 / {Travel Calculator#HoursPerDay}, 1)]`

# Scene Summary 

This is a cave

```statblock
monster: Troll
```

### Forest Approach

This is the approach

### Cave Interior

This is inside


# Quests

`BUTTON[button_quest]` `BUTTON[button_item]` 

- [ ]  Locate the human remains. 
- [ ] Recover the journal. 

```base
views:
  - type: cards
    name: Quests - Cards
    filters:
      and:
        - file.folder == "2-World/Quests"
        - list(MyContainer).contains(this)
    order:
      - file.name
    image: note.image
  - type: table
    name: Quests - Table
    filters:
      and:
        - file.folder == "2-World/Quests"
        - list(MyContainer).contains(this)
    order:
      - file.name
    sort:
      - property: file.name
        direction: DESC
    columnSize:
      file.name: 182

```

# People

`BUTTON[button_person]`  The following people are associated with this location.

```base
properties:
  note.Connected_Quests:
    displayName: Associated Quests
  note.Connected_Groups:
    displayName: Associated Groups
  note.char_race:
    displayName: Race
  note.char_gender:
    displayName: Gender
  note.char_age:
    displayName: Age
views:
  - type: cards
    name: People - Cards
    filters:
      and:
        - file.folder == "2-World/People"
        - list(MyContainer).contains(this)
        - char_status == "Alive"
    order:
      - file.name
      - char_age
      - char_gender
      - char_race
    image: note.image
  - type: table
    name: People - Table
    filters:
      and:
        - file.folder == "2-World/People"
        - list(MyContainer).contains(this)
    order:
      - file.name
      - char_race
      - char_gender
      - char_age
      - Connected_Groups
      - Connected_Quests
    sort:
      - property: Connected_Groups
        direction: ASC
      - property: char_gender
        direction: ASC
      - property: file.name
        direction: DESC
    columnSize:
      file.name: 182

```

# Encounter

Lists any mentioned monsters in this note.

%% The filter below should be updated based on your own monster notes. Find a way to filter on all monsters %%

```base
views:
  - type: cards
    name: Mentioned Monsters
    filters:
      and:
        - this.hasLink(file)
        - noteType == "pf2eMonster"
    image: note.image
    cardSize: 200
    imageFit: contain
    imageAspectRatio: 1

```

```encounter
name: Example
creatures:
 - 3: Goblin, 5, 15, 2, 25 # 1 goblin with HP: 7, AC: 15, MOD: 2 worth 25 XP will be added.
```

