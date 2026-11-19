# Website Responsible IT

De website van het lectoraat Responsible IT (Hogeschool van Amsterdam). Alle teksten, projecten, nieuws en
activiteiten staan als tekstbestanden in de map **`content/`**. Bij elke goedgekeurde wijziging bouwt GitHub
de website automatisch opnieuw en zet hem online.

Het ontwerp is gemaakt door studenten van CMD (`elizaWentz/RIT-website`). De banners zijn p5.js-sketches;
die worden bij het bouwen één keer als afbeelding gemaakt, zodat de site snel blijft.

## Inhoud aanpassen: drie manieren

1. **Beheeromgeving** (makkelijkst): ga naar `/admin` op de website en log in met GitHub. Je vult formulieren
   in; je wijziging wordt een *pull request* die iemand anders goedkeurt.
2. **Op github.com**: open een bestand in `content/`, klik op het potlood, pas aan en kies *Propose changes*.
3. **In VS Code**: zie [Voor ontwikkelaars](#voor-ontwikkelaars).

Je hebt een GitHub-account nodig met schrijfrechten op de repository.

## Hoe een bestand eruitziet

Bovenaan staan tussen `---` de **velden** (de *frontmatter*), daaronder de gewone tekst in Markdown:

```markdown
---
title: "Check Out: wifi zonder socials"
type: student
summary: Korte samenvatting voor de projectkaart.
school_year: 2025-2026
featured: true
sketch: 03-favoriet-50-variatie3
---
Hier komt de uitgebreide beschrijving. **Vet**, *schuin*, [een link](https://www.hva.nl) en
![beschrijving van de foto](foto.jpg) werken allemaal.
```

Let op: na een dubbele punt hoort een spatie, en inspringen gebeurt met spaties (niet met tabs). Staat er in
de tekst zelf een dubbele punt (zoals in de titel hierboven), zet de tekst dan tussen aanhalingstekens.

## Een project toevoegen

1. Maak een map `content/projecten/<naam-van-het-project>/` (kleine letters, cijfers en streepjes).
2. Zet daarin een `index.md` en eventueel foto's en een eigen `sketch.js`.
3. Velden die je kunt gebruiken:

| Veld | Verplicht | Wat |
|---|---|---|
| `title` | ja | Titel |
| `type` | ja | `student` of `research` |
| `summary` | ja | Eén à twee zinnen voor de kaart |
| `school_year` | ja | `2025-2026` of `2024` |
| `featured` | | `true` = uitgelicht op de homepage |
| `draft` | | `true` = (nog) niet publiceren |
| `sketch` | | Naam van een banner uit `content/sketches/` |
| `sketch_file` / `sketch_alt` | | Eigen sketch naast het project (bijv. `sketch.js`) en de beschrijving ervan |
| `card_image` | | Eigen afbeelding voor de projectkaart |
| `gallery` | | Foto's: lijst van `image` + `alt` |
| `video` | | YouTube- of Vimeo-link |
| `sources` | | Links: lijst van `label` + `url` |
| `partners` | | Namen van mappen in `content/partners/` |
| `partner_names` | | Overige partners (alleen naam) |
| `related` | | Gerelateerde projecten (mapnamen); leeg = automatisch |
| `cta` | | Knop: `label` + `url` |
| `programme`, `level`, `unit`, `study_year`, `student_count` | | Studentenprojecten |
| `scheme`, `researchers` | | Onderzoeksprojecten (`researchers` = mapnamen in `content/mensen/`) |
| `sections` | | Extra blokken, bijv. uitklapbare documentatie |

Voorbeelden: `content/projecten/check-out/` (student), `content/projecten/generatieve-ai-provincie-noord-holland/`
(onderzoek), `content/projecten/p5-banners-voor-de-rit-website/` (met documentatie en foto's) en
`content/projecten/aiaiai/` (met een eigen sketch).

> De projecten *Fashion Police*, *AiAiAi*, *RAAIT Dashboard* en *AI en media* hebben nog de voorbeeldtekst
> uit het ontwerp. Vervang die door de echte tekst.

## Pagina's en blokken

Pagina's staan in `content/pages/`. Een pagina bestaat uit **secties** onder `sections:`, van boven naar
beneden. Elk blok begint met `- type:`:

| Type | Wat |
|---|---|
| `hero` | p5-banner; met `title` en `text` krijgt hij een bruine kaart |
| `intro` | Grote titel met tekst en knoppen (homepage) |
| `project-cards` | Rij projectkaarten: `source: featured`, `latest` of `manual` |
| `project-overview` | Alle projecten met filters |
| `text` | Tekst in Markdown |
| `text-image` | Afbeelding links, tekst rechts |
| `video` | YouTube/Vimeo |
| `accordion` | Uitklapbare onderdelen met inhoudsopgave |
| `news-list`, `event-list` | Nieuws / agenda |
| `people-grid`, `partner-logos` | Mensen / partners |

## Banners (p5-sketches)

De banners staan in `content/sketches/<naam>/` (`sketch.js` + `index.md` met titel en beschrijving).
Een sketch moet **statisch** zijn: gebruik `noLoop()` en `randomSeed(…)`, zodat hij elke keer hetzelfde
beeld geeft. De website toont een afbeelding van de sketch; bezoekers kunnen de code downloaden.

> Veel sketches in de bibliotheek hebben nog een algemene beschrijving ("Abstracte generatieve
> p5.js-visualisatie…"). Een betere `alt` beschrijft de kleuren en vormen die je ziet.

## Wat gebeurt er na je wijziging?

GitHub controleert automatisch je bestanden. Klopt er iets niet (verplicht veld leeg, typfout in een
veldnaam, foto niet gevonden, onbekende partner), dan zie je in de pull request precies welk bestand en
welk veld. Na goedkeuring en samenvoegen staat de wijziging binnen een paar minuten online.

## Voor ontwikkelaars

Docker is genoeg; Node hoeft niet lokaal geïnstalleerd te zijn.

```bash
cp .env.example .env
docker compose up -d dev            # http://localhost:8080, ververst automatisch
docker compose run --rm cli npm test
docker compose run --rm cli npm run build
```

De technische opzet staat in [CLAUDE.md](CLAUDE.md). Hoe het inloggen met GitHub in `/admin` is ingericht
(OAuth App, hulpserver op Coolify) staat in [cms-auth/README.md](cms-auth/README.md). Het inhoudsmodel (welke velden er zijn) staat in
`src/admin/schema.yml`: dat bestand stuurt zowel de beheeromgeving als de controle.

### Performance

Gemeten met Playwright (desktop, lokaal):

| Pagina | Oude site | Deze site |
|---|---|---|
| Homepage | 5,3 MB, waarvan 1 MB JavaScript | 0,84 MB, 10 kB JavaScript |
| p5-project (was `over-p5.html`) | 11,4 MB | 0,5 MB |
