# README

## Over dit project
Dit project is een bass-webshop: **The Low End**.

Je hebt 4 pagina's:
- `pub/index.html` (home)
- `pub/browse.html` (producten + filters)
- `pub/cart.html` (winkelwagen + bestellen)
- `pub/admin.html` (producten en bestellingen beheren)

## Wat werkt er?
- Producten bekijken en filteren op categorie, prijs en zoektekst
- Producten toevoegen aan winkelwagen
- Bestelling plaatsen
- Product toevoegen, aanpassen en verwijderen in admin
- Categorie kiezen bij toevoegen/wijzigen in admin (verplicht)
- Bestellingen bekijken, aanpassen en verwijderen in admin

## Data-opslag (simpel uitgelegd)
- Startproducten staan in `pub/data/products.json`
- Tijdens gebruik wordt data opgeslagen in `localStorage`
- Nieuwe producten uit admin blijven bewaard in `localStorage`
- Klik op "Reset producten" in admin om terug te gaan naar `products.json`

## Lokaal starten
1. Open een terminal in `The_Webshop`.
2. Run:
```bash
npx serve pub
```
3. Open de URL uit de terminal (meestal `http://localhost:3000`).

## Live link
- `https://thelowend.netlify.app`
