<%*
const modalForm = app.plugins.plugins.modalforms?.api;
if (!modalForm) {
  new Notice("Modal Forms plugin is not enabled.");
  return;
}

const result = await modalForm.openForm("New-Region");
if (!result || result.status !== "ok") return;

const data = result.getData();

const regionName = String(data["SelectRegionName"] ?? "").trim();
const continentName = String(data["SelectContinent"] ?? "").trim();

// Rename note
if (regionName) {
  await tp.file.rename(regionName);
}

// Build MyContainer link
let myContainerValue = "None";
if (continentName) {
  myContainerValue = `[[2-World/Continents/${continentName}|${continentName}]]`;
}

// Write frontmatter
tR = `---
tags:
  - Category/Region
obsidianUIMode: preview
MyContainer: "${myContainerValue}"
image: "The Island of Screams.jpg"
---
`;
%>
> [!NOTE] Parent Continent: `INPUT[suggester(optionQuery(#Category/Continent)):MyContainer]`

> [!column|no-i no-t]
>> [!info|no-title] Map
>> ```zoommap
>> imageBases:
>>   - path: z_Assets/The Island of Screams.jpg
>> markers: z_Assets/The Island of Screams.markers.json
>> markerLayers:
>>   - Default
>>   - Pings
>> minZoom: 0.00005
>> maxZoom: 8
>> wrap: false
>> responsive: false
>> height: 476px
>> resizable: false
>> resizeHandle: native
>> render: dom
>> id: map-ml0nrs35
>> ```
>
>> [!note|no-title] Town Name
>> ~~~meta-bind
>> INPUT[select(
>> option(1, ℹ️General Info),
>> option(2, 🌐Region Details),
>> option(3, 📝GM Notes),
>> class(tabbed)
>> )]
>> ~~~
>>>[!tabbed-box-maxh]
>>> >[!div-m|no-title]
>>> > ![[#General Info|no-h clean]]
>>>
>>> >[!div-m|no-title]
>>> > ![[#Region Details|no-h clean]]
>>>
>>> > [!div-m|no-title]
>>> > ![[#GM Notes|no-h clean]]
>>> 

> [!NOTE|no-title]
> ~~~meta-bind
> INPUT[select(
> option(1, 🏡Hubs),
> option(2, 🍎Points of Interest),
> option(3, ⚔️Groups),
> option(4, 💭Quests),
> class(tabbed)
> )]
> ~~~
> >[!tabbed-box]
> > >[!div-m|no-title]
> > > ![[#Hubs|no-h clean]]
> >
> > > [!div-m|no-title]
> > > ![[#Points of Interest|no-h clean]]
> > 
> > > [!div-m|no-title]
> > > ![[#Groups|no-h clean]]
> > 
> > > [!div-m|no-title]
> > > ![[#Quests|no-h clean]]

---
# General Info

This is the region description. 

# Region Details

**Dominant Races:**  
**Climate:** 
**Seasons:**

# GM Notes

Make notes of what you need to track in the region here. 

# Hubs

`BUTTON[button_hub]` `BUTTON[button_hub_district]` **Hubs** Places where people live - Cities, Towns, Villages, Hamlets, Encampment, Keeps, Fortresses, Strongholds.

```base
properties:
  file.name:
    displayName: Hub Name
views:
  - type: cards
    name: Hubs - Cards
    filters:
      and:
        - file.folder == "2-World/Hubs"
        - list(MyContainer).contains(this)
    order:
      - file.name
    image: note.image
  - type: table
    name: Hubs - Table
    filters:
      and:
        - file.folder == "2-World/Hubs"
        - list(MyContainer).contains(this)
    order:
      - file.name
      - MyContainer
    sort:
      - property: file.name
        direction: ASC
    columnSize:
      file.name: 182

```

# Points of Interest

`BUTTON[button_pointofinterest]`  Places that can be explored. 

```base
properties:
  file.name:
    displayName: Hub Name
views:
  - type: cards
    name: POIs - Cards
    filters:
      and:
        - file.folder == "2-World/Points of Interest"
        - list(MyContainer).contains(this)
    order:
      - file.name
    image: note.image
  - type: table
    name: POIs - Table
    filters:
      and:
        - file.folder == "2-World/Points of Interest"
        - list(MyContainer).contains(this)
    order:
      - file.name
      - MyContainer
    sort:
      - property: file.name
        direction: ASC
    columnSize:
      file.name: 182

```

# Groups

`BUTTON[button_group]` Groups of people and power - religious, cults, guilds, military

```base
properties:
  file.name:
    displayName: Hub Name
views:
  - type: cards
    name: Groups - Cards
    filters:
      and:
        - file.folder == "2-World/Groups"
        - list(MyContainer).contains(this)
    order:
      - file.name
    image: note.image
  - type: table
    name: Groups - Table
    filters:
      and:
        - file.folder == "2-World/Groups"
        - list(MyContainer).contains(this)
    order:
      - file.name
      - MyContainer
    sort:
      - property: file.name
        direction: ASC
    columnSize:
      file.name: 182

```

# Quests

`BUTTON[button_quest]` **P - Philosophy** (Religion and Education) - Houses of Worship, Schools, Universities, Laboratories, Arboretums

```base
properties:
  file.name:
    displayName: Hub Name
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
      - MyContainer
    sort:
      - property: file.name
        direction: ASC
    columnSize:
      file.name: 182

```


