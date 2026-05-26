# Plan van aanpak en ontwerp (eindversie)

## 1. Wat voor webshop is gemaakt?
Ik heb een bass gear webshop gemaakt: **The Low End**.

Het project bestaat uit een gebruikersdeel en een admindeel.

## 2. Functionele scope van de eindversie

### Eindgebruiker
- Homepagina (`index.html`) met introductie en categoriekaarten.
- Categoriekaarten linken door naar browse met vooraf ingestelde filter:
  - `basses`
  - `amplification`
  - `accessories`
- Browsepagina (`browse.html`) met:
  - Categorie-filter
  - Zoekfilter
  - Min/max-prijsfilter
  - Sorteeropties
  - Reset van alle filters
- Producten toevoegen aan winkelwagen.
- Winkelwagenpagina (`cart.html`) met:
  - Overzicht van regels
  - Aantal verhogen/verlagen
  - Regel verwijderen
  - Totaalprijs
  - Bestelling plaatsen

### Admin
- Productbeheer op `admin.html`:
  - Product toevoegen
  - Product wijzigen (via modal)
  - Product verwijderen
  - Producten resetten naar JSON-bron
- Bestelbeheer op `admin.html`:
  - Bestellingen bekijken
  - Bestelling wijzigen (via modal)
  - Bestelling verwijderen
  - Alle bestellingen wissen
- In bestelling wijzigen zijn aanpasbaar:
  - Order-ID
  - Datum/tijd
  - Orderregels (product + aantal)
  - Regels toevoegen/verwijderen

## 3. Pagina-ontwerp

Het project gebruikt Tailwind CSS en bestaat uit 4 pagina's:
- `pub/index.html`
- `pub/browse.html`
- `pub/cart.html`
- `pub/admin.html`

De browsepagina gebruikt een linker filterkolom en een productlijst rechts.

## 4. Data en opslag

- Productbron: `pub/data/products.json`
- Lokale opslag via `localStorage`:
  - `webshop_products`
  - `webshop_cart`
  - `webshop_orders`

Belangrijke keuze in de eindversie:
- Producten worden bij laden opnieuw gesynchroniseerd vanaf `products.json`.
- Producten hebben een expliciet `category` veld voor stabiele filtering.

## 5. JavaScript-structuur (actief gebruikt)

- `pub/js/script.js` → homepagina gedrag (cart label / navigatie)
- `pub/js/browse.js` → filters, sortering, productrender op browse
- `pub/js/cart-page.js` → cartpagina interactie + bestellen
- `pub/js/admin.js` → product- en orderbeheer + modals

Gedeelde modules:
- `pub/js/products.js`
- `pub/js/cart.js`
- `pub/js/orders.js`
- `pub/js/storage.js`
- `pub/js/constants.js`
- `pub/js/validation.js` (voor productvalidatie in admin)

## 6. Gebruikersflow (eindversie)

1. Bezoeker opent homepagina.
2. Bezoeker gaat naar browse (optioneel via categoriekaart met vooringestelde filter).
3. Bezoeker filtert/sorteert producten en voegt items toe aan cart.
4. Bezoeker beheert aantallen in cart en plaatst bestelling.
5. Bestelling wordt opgeslagen in `localStorage`.
6. Admin opent adminpagina en kan producten/bestellingen beheren en aanpassen.
