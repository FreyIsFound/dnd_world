<%*  
const modalForm = app.plugins.plugins.modalforms?.api;  
if (!modalForm) {  
  new Notice("Modal Forms plugin is not enabled.");  
  return;  
}  
  
const result = await modalForm.openForm("New-Planet");  
if (!result || result.status !== "ok") return;  
  
const data = result.getData();  
  
const planetName = String(data["SelectPlanetName"] ?? "").trim();  
const starsystemName = String(data["SelectStarSystem"] ?? "").trim();  
  
// Rename note using Templater method
if (planetName) {
  await tp.file.rename(planetName);
}

// Build MyContainer link
let myContainerValue = "None";
if (starsystemName) {
  myContainerValue = `[[2-World/Star Systems/${starsystemName}|${starsystemName}]]`;
}

// Write frontmatter
tR = `---
tags:
  - Category/StarSystem
obsidianUIMode: preview
MyContainer: "${myContainerValue}"
image: "Template_StarSystem_Placeholder.png"
---
`;
%>
> [!NOTE] Parent Star System: `INPUT[suggester(optionQuery(#Category/StarSystem)):MyContainer]`

> [!column|no-i no-t]
>> [!info|no-title] Map
>> ![[Template_Planet_Placeholder.png]]
>
>> [!note|no-title] Town Name
>> ~~~meta-bind
>> INPUT[select(
>> option(1, ℹ️General Info),
>> option(2, 🌐Planet Details),
>> option(3, 📝GM Notes),
>> class(tabbed)
>> )]
>> ~~~
>>>[!tabbed-box-maxh]
>>> >[!div-m|no-title]
>>> > ![[#General Info|no-h clean]]
>>>
>>> >[!div-m|no-title]
>>> > ![[#Planet Details|no-h clean]]
>>>
>>> > [!div-m|no-title]
>>> > ![[#GM Notes|no-h clean]]
>>> 

> [!NOTE|no-title]
> ~~~meta-bind
> INPUT[select(
> option(1, 🗺️Continents),
> option(2, 👽Sapient Species),
> option(3, ⚔️Capital Cities),
> class(tabbed)
> )]
> ~~~
> >[!tabbed-box]
> > >[!div-m|no-title]
> > > ![[#Continents|no-h clean]]
> >
> > > [!div-m|no-title]
> > > ![[#Sapient Species|no-h clean]]
> > 
> > > [!div-m|no-title]
> > > ![[#Capital Cities|no-h clean]]
> > 

---
# General Info

This is the planet description. 

# Planet Details

**Dominant Races:**  
**Climate:** 
**Seasons:**

# GM Notes

Make notes of what you need to track in the region here. 

# Continents

`BUTTON[button_continent]` **Continents**  Large continuous landmasses that contain regions.

```base
properties:
  file.name:
    displayName: Continent(s)
views:
  - type: cards
    name: Continents - Cards
    filters:
      and:
        - file.folder == "2-World/Continents"
        - list(MyContainer).contains(this)
    order:
      - file.name
    image: note.image
  - type: table
    name: Continents - Table
    filters:
      and:
        - file.folder == "2-World/Continents"
        - list(MyContainer).contains(this)
    order:
      - file.name
    sort:
      - property: file.name
        direction: DESC
    columnSize:
      file.name: 182

```

# Sapient Species

`BUTTON[button_species]`  Intelligent species that live on this planet. 

```base
properties:
  file.name:
    displayName: Sapient Species(s)
views:
  - type: cards
    name: Sapient Species - Cards
    filters:
      and:
        - file.folder == "2-World/Sapient Species"
        - list(MyContainer).contains(this)
    order:
      - file.name
    image: note.image
  - type: table
    name: Sapient Species - Table
    filters:
      and:
        - file.folder == "2-World/Sapient Species"
        - list(MyContainer).contains(this)
    order:
      - file.name
    sort:
      - property: file.name
        direction: DESC
    columnSize:
      file.name: 182

```

# Capital Cities

`BUTTON[button_hub]` Groups of people and power - religious, cults, guilds, military

```base
filters:
  and:
    - formula.LinkedToThisPlanet
    - MyContainer.contains(this)
formulas:
  LinkedToThisPlanet: |
    list(MyContainer)
      .filter(
        file(value)
        && list(file(value).properties.MyContainer)
             .filter(
               file(value)
               && list(file(value).properties.MyContainer)
                    .contains(this)
             ).length > 0
      ).length > 0
properties:
  file:
    displayName: Hub
  MyCategory:
    displayName: Type
  MyContainer:
    displayName: Region(s)
views:
  - type: cards
    name: Capital Cities (Cards)
    filters:
      and:
        - file.inFolder("2-World/Hubs")
        - list(MyCategory).contains("City +1500")
    order:
      - file
      - MyCategory
      - MyContainer
    image: note.image
  - type: table
    name: Capital Cities (List)
    filters:
      and:
        - file.inFolder("2-World/Hubs")
        - formula.LinkedToThisPlanet
        - list(MyCategory).contains("City +1500")
    order:
      - file
      - MyCategory
      - MyContainer

```
