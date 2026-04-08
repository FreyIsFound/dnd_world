<%*  
const modalForm = app.plugins.plugins.modalforms?.api;  
if (!modalForm) {  
new Notice("Modal Forms plugin is not enabled.");  
return;  
}  
  
const result = await modalForm.openForm("New-Continent");  
if (!result || result.status !== "ok") return;  
  
const data = result.getData();  
  
const continentName = String(data["SelectContinentName"] ?? "").trim();  
const planetName = String(data["SelectPlanet"] ?? "").trim();  
  
// Rename note  
if (continentName) {  
await tp.file.rename(continentName);  
}  
  
// Build MyContainer link  
let myContainerValue = "None";  
if (planetName) {  
myContainerValue = `[[2-World/Planets/${planetName}|${planetName}]]`;  
}  
  
// Write frontmatter  
tR = `---
tags:  
- Category/Continent  
obsidianUIMode: preview  
MyContainer: "${myContainerValue}"  
image: "Template_Continent_Placeholder.png"  
---
`;  
%>
> [!NOTE] Parent Planet: `INPUT[suggester(optionQuery(#Category/Planet)):MyContainer]`

> [!column|no-i no-t]
>> [!info|no-title] Map
>> ```zoommap
>> imageBases:
>>   - path: z_Assets/Template_Continent_Placeholder.png
>> markers: z_Assets/Template_Continent_Placeholder.markers.json
>> markerLayers:
>>   - Default
>> minZoom: 0.00005
>> maxZoom: 8
>> wrap: false
>> responsive: false
>> height: 478px
>> resizable: false
>> resizeHandle: native
>> render: dom
>> id: map-ml0oegh2
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
> option(1, 🗺️Regions),
> option(2, ⚔️Capital Cities),
> class(tabbed)
> )]
> ~~~
> >[!tabbed-box]
> > >[!div-m|no-title]
> > > ![[#Regions|no-h clean]]
> >
> > > [!div-m|no-title]
> > > ![[#Capital Cities|no-h clean]]
> > 

---
# General Info

This is the continent description. 

# Region Details

**Dominant Races:**  
**Climate:** 

# GM Notes

Make notes of what you need to track in the region here. 

# Regions

`BUTTON[button_region]` **continent** Places where people live - Cities, Towns, Villages, Hamlets, Encampment, Keeps, Fortresses, Strongholds.

```base
properties:
  file.name:
    displayName: Region Name
views:
  - type: cards
    name: Region - Cards
    filters:
      and:
        - file.folder == "2-World/Regions"
        - list(MyContainer).contains(this)
    order:
      - file.name
    image: note.image
  - type: table
    name: Region - Table
    filters:
      and:
        - file.folder == "2-World/Regions"
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

# Capital Cities

`BUTTON[button_hub]` **Hubs** Places where people live - Cities, Towns, Villages, Hamlets, Encampment, Keeps, Fortresses, Strongholds.

```base
formulas:
  LinkedToThisContinent: |
    list(MyContainer)
      .map(link(value))
      .filter(file(value))
      .filter(
        list(file(value).properties.MyContainer)
          .map(link(value))
          .contains(this)
      )
      .length > 0
  RegionsForThis: |
    list(MyContainer)
      .map(link(value))
      .filter(file(value))
      .filter(
        list(file(value).properties.MyContainer)
          .map(link(value))
          .contains(this)
      )
      .map(link(value, file(value).name))
properties:
  file:
    displayName: Hub
  MyCategory:
    displayName: Type
  RegionsForThis:
    displayName: Region(s)
views:
  - type: cards
    name: Capital Cities (Cards)
    image: note.image
    filters:
      and:
        - file.inFolder("2-World/Hubs")
        - formula.LinkedToThisContinent
        - or:
            - MyCategory.contains("City +1500")
            - list(MyCategory).contains("City +1500")
  - type: table
    name: Capital Cities (List)
    filters:
      and:
        - file.inFolder("2-World/Hubs")
        - formula.LinkedToThisContinent
        - or:
            - MyCategory.contains("City +1500")
            - list(MyCategory).contains("City +1500")
    order:
      - file
      - MyCategory
      - RegionsForThis
```


