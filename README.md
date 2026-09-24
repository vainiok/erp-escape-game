# erp-escape-game

Interaktiivinen selainpeli Innofactorin demokäyttöön: **How to escape from the old ERP?**

## Paikallinen ajo

Edellyttää Node.js-versiota 22.12+.

```bash
npm install
npm run dev
```

Avaa selaimessa Viten ilmoittama paikallinen osoite.

## Muut hyödylliset komennot

```bash
npm test
npm run lint
npm run build
```

## Pisteytys ja tuloslogiikka

Peli sisältää 8 kysymystä, jotka näytetään yksi kerrallaan.

- Useimmissa kysymyksissä **Kyllä** on riskivastaus ja **Ei** ei ole riskivastaus.
- Kysymyksessä **“Montako käyttäjää järjestelmällä on?”** vaihtoehto **“Yli 100”** käsitellään riskivastauksena, jotta suuremman ERP-ympäristön vaikutus näkyy arvioinnissa läpinäkyvästi.
- Kysymyksessä **“Onko teillä käytössä L7 tai muu vanheneva ERP?”** vastaus **Kyllä** ohjaa aina punaiseen tulokseen.

Tulokset muodostuvat näin:

- **Punainen**: kysymys 5 = Kyllä, tai riskivastauksia on vähintään 4
- **Keltainen**: riskivastauksia on täsmälleen 3 eikä punainen ehto täyty
- **Vihreä**: muuten (0–2 riskivastausta)

## Toteutus

- Vite + React + TypeScript
- Responsiivinen ja saavutettava käyttöliittymä
- Näppäimistötuki, näkyvät fokustilat ja ruudunlukijalle sopiva etenemisteksti
- Erillinen testattava pisteytysmoduuli (`src/game.ts`) ja yksikkötestit (`src/game.test.ts`)
