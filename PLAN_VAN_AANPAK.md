# Plan van aanpak (eenvoudige versie)

## Doel
Ik heb een webshop gemaakt voor bass gear: **The Low End**.

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
- Reset in admin zet producten terug naar de startlijst

## Data en opslag
- Er is een startlijst met producten
- Producten, winkelwagen en bestellingen worden lokaal opgeslagen

## Korte gebruikersflow
1. Bezoeker opent home
2. Bezoeker gaat naar browse en filtert producten
3. Bezoeker voegt producten toe aan cart
4. Bezoeker plaatst bestelling
5. Admin beheert producten en bestellingen

## Live website
- `https://thelowend.netlify.app`
