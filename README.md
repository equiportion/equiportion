![Logo von EquiPortion](https://raw.githubusercontent.com/equiportion/equiportion/dev/src/assets/LogoWide.svg)

# EquiPortion

Aufteilen von Rechnungen war noch nie so einfach. Mit EquiPortion kannst du deine Rechnungen aufteilen und mit deinen Freunden teilen. Einfach, schnell und sicher über den Matrix-Server deines Vertrauens.

## Nutzen

EquiPortion läuft in jedem modernen Browser.
Keine Lust EquiPortion zu installieren? Wir haben EquiPortion für dich gehosted: <https://equiportion.github.io>

Außerdem findest du die Progressive Web App auch im Google Play Store: <https://play.google.com/store/apps/details?id=de.phsta.equiportion>

## Features

- Heller und dunkler Anzeigemodus
- Plattformunabhängige PWA: Durch die Nutzung im Browser kann EquiPortion auf so gut wie jedem Gerät ausgeführt und installiert werden
- Nutzung von Matrix als Datenbank: Such dir deinen eigenen Homeserver aus und kommuniziere dank Föderation trotzdem mit Nutzern von anderen Homeservern
- Erstelle Räume und lade Nutzer dazu ein
- Ausgaben pro Raum erfassen und auflisten
- Minimierung der Zahlungen, die zum Ausgleich der Schulden notwendig sind
- Belege zu Ausgabe hochladen
- Automatische Erfassung des Gesamtbetrags aus hochgeladenen Belegen (mittels OCR)

## Screenshots

... folgen noch :)

## Mithelfen / Contributing

Contributions are always welcome!

Just make a PR or contact us (via issues), if you have further ideas or want to know how to help.

## Support

For support, create an issue in our GitHub Repository (<https://github.com/equiportion/equiportion>).

## Autoren

- Clara Gießibl [@anonymous-froggo](https://github.com/anonymous-froggo)
- Jörn Mihatsch [@jmih03](https://github.com/jmih03)
- Leandro El Omari [@leandroelomari](https://github.com/leandroelomari)
- Philipp Stappert [@philippstappert](https://github.com/philippstappert)
- Yinlei Ba

EquiPortion ist entstanden als Praxisprojekt (für Praxis der Softwareentwicklung) am KIT (Karlsruher Institut für Technologie), diese App und sämtliche Inhalte gehören aber der Gruppe an Personen, die das Projekt durchgeführt und eigenständig veröffentlicht haben.

## Lizenz

[MIT](https://github.com/equiportion/equiportion/blob/main/LICENSE)

## Useful commands for developers

### Install Dependencies / Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Headed Component Tests with [Cypress Component Testing](https://on.cypress.io/component)

```sh
npm run test:unit:dev # or `npm run test:unit` for headless testing
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

For safety, you should run the tests against the build too.

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Check CodeStyle with [Prettier](https://prettier.io/)

```sh
npm run format
```
