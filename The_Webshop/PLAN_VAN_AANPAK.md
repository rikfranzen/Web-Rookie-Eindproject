# Plan van aanpak (eenvoudige versie)

## Doel
Ik heb een webshop gemaakt voor bass gear: **The Low End**.

## Pagina's
- `pub/index.html` voor de homepagina
- `pub/browse.html` voor producten en filters
- `pub/cart.html` voor winkelwagen en afrekenen
- `pub/admin.html` voor beheer

## Wat de bezoeker kan
- Producten bekijken
- Filteren op categorie, prijs en zoektekst
- Producten toevoegen aan winkelwagen
- Aantallen aanpassen in de winkelwagen
- Een bestelling plaatsen

## Wat de admin kan
- Product toevoegen
- Product wijzigen
- Product verwijderen
- Producten resetten naar de startlijst
- Bestellingen bekijken
- Bestellingen wijzigen
- Bestellingen verwijderen
- Alle bestellingen wissen

## Belangrijke regels
- Bij product toevoegen/wijzigen is categorie verplicht
- Categorie bepaalt waar het product in browse zichtbaar is
- Producten blijven bewaard in `localStorage`
- Reset in admin zet producten terug naar `pub/data/products.json`

## Data en opslag
- Startdata: `pub/data/products.json`
- Lokale opslag: `webshop_products`
- Lokale opslag: `webshop_cart`
- Lokale opslag: `webshop_orders`

## JavaScript bestanden
- `pub/js/script.js` voor home
- `pub/js/browse.js` voor filters en productlijst
- `pub/js/cart-page.js` voor cart
- `pub/js/admin.js` voor admin
- `pub/js/products.js` voor productopslag
- `pub/js/orders.js` voor bestellingen
- `pub/js/cart.js` voor winkelwagen
- `pub/js/validation.js` voor validatie

## Korte gebruikersflow
1. Bezoeker opent home
2. Bezoeker gaat naar browse en filtert producten
3. Bezoeker voegt producten toe aan cart
4. Bezoeker plaatst bestelling
5. Admin beheert producten en bestellingen

## Live website
- `https://thelowend.netlify.app`
