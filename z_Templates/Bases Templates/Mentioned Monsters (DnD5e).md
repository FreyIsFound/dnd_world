```base
views:
  - type: cards
    name: Mentioned Monsters
    filters:
      and:
        - this.hasLink(file)
        - cssclass == ["json5e-monster"]
    image: note.image
    cardSize: 200
    imageFit: contain
    imageAspectRatio: 1

```

