<%*
const modalForm = app.plugins.plugins.modalforms?.api;
if (!modalForm) {
  new Notice("Modal Forms plugin is not enabled.");
  return;
}

const result = await modalForm.openForm("New-District");
if (!result || result.status !== "ok") return;

const data = result.getData();

const districtName = String(data["SelectDistrictName"] ?? "").trim();
const hubName = String(data["SelectHub"] ?? "").trim();
const category = String(data["SelectCategory"] ?? "").trim();

// Rename note
if (districtName) {
  await tp.file.rename(districtName);
}

// Build MyContainer link
let myContainerValue = "None";
if (hubName) {
  myContainerValue = `[[2-World/Hubs/${hubName}|${hubName}]]`;
}

// Write frontmatter
tR = `---
tags:
  - Category/District
MyContainer: "${myContainerValue}"
MyCategory: "${category}"
obsidianUIMode: preview
image: Map_District_Placeholder.png
---
`;
%>
> [!NOTE|div-m] Parent Hub: `INPUT[inlineListSuggester(optionQuery(#Category/Hub)):MyContainer]`

> [!column|no-i no-t]
>> [!info|no-title] Map
>> ```zoommap
>> imageBases:
>>   - path: z_Assets/Map_District_Placeholder.png
>> markers: Map_District_Placeholder.markers.json
>> markerLayers:
>>   - Default
>> minZoom: 0.00005
>> maxZoom: 8
>> wrap: false
>> responsive: false
>> height: 476px
>> resizable: false
>> resizeHandle: native
>> render: dom
>> id: map-mkx4mhxn
>> ```
>
>> [!note|no-title] Town Name
>> ~~~meta-bind
>> INPUT[select(
>> option(1, ℹ️General),
>> option(2, 🏃‍♂️‍➡️NPCs),
>> option(3, 📝GM Notes),
>> class(tabbed)
>> )]
>> ~~~
>>>[!tabbed-box-maxh]
>>> >[!div-m|no-title]
>>> > ![[#General|no-h clean]]
>>>
>>> >[!div-m|no-title]
>>> > ![[#NPCs|no-h clean]]
>>>
>>> > [!div-m|no-title]
>>> > ![[#GM Notes|no-h clean]]
>>> 

> [!NOTE|no-title]
> ~~~meta-bind
> INPUT[select(
> option(1, 🛒Commerce),
> option(2, 🍎Agriculture),
> option(3, ⚔️Military),
> option(4, 💭Philosophy),
> option(5, ⚙️Industrial),
> option(6, 🏠Nesting),
> option(7, 👑Government),
> class(tabbed)
> )]
> ~~~
> >[!tabbed-box]
> > >[!div-m|no-title]
> > > ![[#Commerce|no-h clean]]
> >
> > > [!div-m|no-title]
> > > ![[#Agriculture|no-h2 clean]]
> > 
> > > [!div-m|no-title]
> > > ![[#Military|no-h clean]]
> > 
> > > [!div-m|no-title]
> > > ![[#Philosophy|no-h clean]]
> > 
> > > [!div-m|no-title]
> > > ![[#Industrial|no-h clean]]
> > 
> > > [!div-m|no-title]
> > > ![[#Nesting|no-h clean]]
> > 
> > > [!div-m|no-title]
> > > ![[#Government|no-h clean]]

---
# General

Select Hub: `INPUT[inlineListSuggester(optionQuery(#Category/Hub)):MyContainer]`
%% DISPLAYS NOTES THAT MATCH THE TAGS ABOVE %% 

Select Category: `INPUT[template-district-category][:MyCategory]`
%% MODIFY OPTIONS IN SETTINGS > COMMUNITY PLUGINS > META-BIND > EDIT TEMPLATES > template-hub-category %%

This is the district description. 

# NPCs

`BUTTON[button_person]` List important NPCs here. 

```base
filters:
  and:
    - file.inFolder("2-World/People")
formulas:
  LinkedViaPlace: |
    list(MyContainer)                                          
      .filter( file(value)                                     
               && list(file(value).properties.MyContainer)     
                    .contains(this) )                          
      .length > 0
  PlacesForThis: |
    list(MyContainer)
      .filter( file(value)
               && list(file(value).properties.MyContainer).contains(this) )
      .map( link(value, file(value).name) )
properties:
  file.name:
    displayName: Person
  PlacesForThis:
    displayName: Places (for this note)
  note.char_race:
    displayName: Race
  note.char_gender:
    displayName: Gender
  note.char_age:
    displayName: Age
views:
  - type: cards
    name: People linked via Places → this note
    filters:
      or:
        - formula.LinkedViaPlace
        - list(MyContainer).contains(this)
    order:
      - file.name
      - char_age
      - char_gender
      - char_race
    image: note.image
    cardSize: 100
  - type: table
    name: View

```

# GM Notes

Make notes of what you need to track in the town here. 

# CAMPING 

C - Commerce (Economics and Entertainment) - Shops, Malls, Theatres, Markets, Carnivals, Electronics
A - Agriculture (Resource Production and Collection) - Farms, Mines, Fisheries, Lumber Yards, Oil Rigs, Power Plants
M - Military (Protection and Transportation) - Forts, Bases, Armories, Walls, Seaports, Airports, Spaceports
P - Philosophy (Religion and Education) - Houses of Worship, Schools, Universities, Laboratories, Arboretums
I - Industrial (Resource Utilization and Processing) - Factories, Metalworks, Bakeries, Artisans, Jewelers
N - Nesting (Housing and Civil Engineering) - Residential Areas, Inns/Hotels
G - Government (Legislation and Judicial) - Town Halls, Courthouses, Tourist Stops, Monuments/Landmarks

## Commerce

`BUTTON[button_district_place]` `BUTTON[button_person]` **C - Commerce** (Economics and Entertainment) - Shops, Malls, Theatres, Markets, Carnivals, Electronics

```base
properties:
  file.name:
    displayName: Places Name
  note.MyCategory:
    displayName: Type of Place
views:
  - type: cards
    name: Region - Cards
    filters:
      and:
        - file.folder == "2-World/Places"
        - list(MyContainer).contains(this)
        - MyCategory == "Commerce"
    order:
      - file.name
      - MyCategory
    image: note.image
  - type: table
    name: Region - Table
    filters:
      and:
        - file.folder == "2-World/Places"
        - list(MyContainer).contains(this)
        - MyCategory == "Commerce"
    order:
      - file.name
      - MyContainer
    sort:
      - property: file.name
        direction: ASC
    columnSize:
      file.name: 182

```


## Agriculture

`BUTTON[button_district_place]` `BUTTON[button_person]` **A - Agriculture** (Resource Production and Collection) - Farms, Mines, Fisheries, Lumber Yards, Oil Rigs, Power Plants

```base
properties:
  file.name:
    displayName: Places Name
  note.MyCategory:
    displayName: Type of Place
views:
  - type: cards
    name: Region - Cards
    filters:
      and:
        - file.folder == "2-World/Places"
        - list(MyContainer).contains(this)
        - MyCategory == "Agriculture"
    order:
      - file.name
      - MyCategory
    image: note.image
  - type: table
    name: Region - Table
    filters:
      and:
        - file.folder == "2-World/Places"
        - list(MyContainer).contains(this)
        - MyCategory == "Agriculture"
    order:
      - file.name
      - MyContainer
    sort:
      - property: file.name
        direction: ASC
    columnSize:
      file.name: 182

```

## Military

`BUTTON[button_district_place]` `BUTTON[button_person]` **M - Military** (Protection and Transportation) - Forts, Bases, Armories, Walls, Seaports, Airports, Spaceports

```base
properties:
  file.name:
    displayName: Places Name
  note.MyCategory:
    displayName: Type of Place
views:
  - type: cards
    name: Region - Cards
    filters:
      and:
        - file.folder == "2-World/Places"
        - list(MyContainer).contains(this)
        - MyCategory == "Military"
    order:
      - file.name
      - MyCategory
    image: note.image
  - type: table
    name: Region - Table
    filters:
      and:
        - file.folder == "2-World/Places"
        - list(MyContainer).contains(this)
        - MyCategory == "Military"
    order:
      - file.name
      - MyContainer
    sort:
      - property: file.name
        direction: ASC
    columnSize:
      file.name: 182

```

## Philosophy

`BUTTON[button_district_place]` `BUTTON[button_person]` **P - Philosophy** (Religion and Education) - Houses of Worship, Schools, Universities, Laboratories, Arboretums

```base
properties:
  file.name:
    displayName: Places Name
  note.MyCategory:
    displayName: Type of Place
views:
  - type: cards
    name: Region - Cards
    filters:
      and:
        - file.folder == "2-World/Places"
        - list(MyContainer).contains(this)
        - MyCategory == "Philosophy"
    order:
      - file.name
      - MyCategory
    image: note.image
  - type: table
    name: Region - Table
    filters:
      and:
        - file.folder == "2-World/Places"
        - list(MyContainer).contains(this)
        - MyCategory == "Philosophy"
    order:
      - file.name
      - MyContainer
    sort:
      - property: file.name
        direction: ASC
    columnSize:
      file.name: 182

```

## Industrial

`BUTTON[button_district_place]` `BUTTON[button_person]` **I - Industrial** (Resource Utilization and Processing) - Factories, Metalworks, Bakeries, Artisans, Jewelers

```base
properties:
  file.name:
    displayName: Places Name
  note.MyCategory:
    displayName: Type of Place
views:
  - type: cards
    name: Region - Cards
    filters:
      and:
        - file.folder == "2-World/Places"
        - list(MyContainer).contains(this)
        - MyCategory == "Industrial"
    order:
      - file.name
      - MyCategory
    image: note.image
  - type: table
    name: Region - Table
    filters:
      and:
        - file.folder == "2-World/Places"
        - list(MyContainer).contains(this)
        - MyCategory == "Industrial"
    order:
      - file.name
      - MyContainer
    sort:
      - property: file.name
        direction: ASC
    columnSize:
      file.name: 182

```

## Nesting

`BUTTON[button_district_place]` `BUTTON[button_person]` **N - Nesting** (Housing and Civil Engineering) - Residential Areas, Bridges, Parks, Inns/Hotels

```base
properties:
  file.name:
    displayName: Places Name
  note.MyCategory:
    displayName: Type of Place
views:
  - type: cards
    name: Region - Cards
    filters:
      and:
        - file.folder == "2-World/Places"
        - list(MyContainer).contains(this)
        - MyCategory == "Nesting"
    order:
      - file.name
      - MyCategory
    image: note.image
  - type: table
    name: Region - Table
    filters:
      and:
        - file.folder == "2-World/Places"
        - list(MyContainer).contains(this)
        - MyCategory == "Nesting"
    order:
      - file.name
      - MyContainer
    sort:
      - property: file.name
        direction: ASC
    columnSize:
      file.name: 182

```

## Government

`BUTTON[button_district_place]` `BUTTON[button_person]` **G - Government** (Legislation and Judicial) - Town Halls, Courthouses, Tourist Stops, Monuments/Landmarks

```base
properties:
  file.name:
    displayName: Places Name
  note.MyCategory:
    displayName: Type of Place
views:
  - type: cards
    name: Region - Cards
    filters:
      and:
        - file.folder == "2-World/Places"
        - list(MyContainer).contains(this)
        - MyCategory == "Government"
    order:
      - file.name
      - MyCategory
    image: note.image
  - type: table
    name: Region - Table
    filters:
      and:
        - file.folder == "2-World/Places"
        - list(MyContainer).contains(this)
        - MyCategory == "Government"
    order:
      - file.name
      - MyContainer
    sort:
      - property: file.name
        direction: ASC
    columnSize:
      file.name: 182

```


