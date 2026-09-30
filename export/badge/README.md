# Kodek badge – potpis „Izrada: Kodek”

Potpis s logom za stranice koje je izradio Kodek. Tri ravnopravne varijante – odaberi onu koja
odgovara projektu. Nijedna ne učitava font ni vanjske datoteke: tekst „odek\_” u logu pretvoren je
u krivulje.

```
kodek-badge.js                 web komponenta <kodek-badge> (preporučeno)
kodek-badge.css + snippet.html varijanta bez JavaScripta
KodekBadge.tsx                 React komponenta (KodekBadge + KodekLogo)
kodek-logo-outlined-light.svg  puni logo u krivuljama, za svijetle podloge
kodek-logo-outlined-dark.svg   puni logo u krivuljama, za tamne podloge
demo.html                      pregled svih načina rada
```

## 1. Web komponenta (bilo koja stranica)

Kopiraj `kodek-badge.js` u projekt klijenta i dodaj pred kraj `<body>`:

```html
<script src="/kodek-badge.js" defer></script>
<kodek-badge></kodek-badge>
```

| Atribut | Vrijednosti                          | Zadano                          |
| ------- | ------------------------------------ | ------------------------------- |
| `mode`  | `sticky`, `static`, `inline`         | `sticky`                        |
| `theme` | `auto`, `light`, `dark`              | `auto` (`prefers-color-scheme`) |
| `align` | `center`, `left`, `right`            | `center`                        |
| `lang`  | `hr`, `en`                           | najbliži `lang` na stranici     |
| `label` | vlastiti tekst; `label=""` samo logo | „Izrada:” / „Built by:”         |
| `href`  | URL                                  | `https://kodek.hr`              |

- `sticky` – traka zalijepljena za dno prozora. Element mora biti **zadnje dijete `<body>`**
  (ili visokog omotača stranice); unutar niskog roditelja `position: sticky` nema učinka.
- `static` – obična traka na mjestu gdje je element postavljen.
- `inline` – samo tekst + logo, bez pozadine; za umetanje u postojeći footer klijenta.
- Ako stranica ima vlastitu tamnu/svijetlu temu koja ne prati sustav, postavi `theme` izričito.
- Redoslijed slojeva: `--kodek-badge-z` (zadano 40), npr. `kodek-badge { --kodek-badge-z: 5 }`.

Stilovi su u shadow DOM-u, pa CSS stranice ne može promijeniti logo. Radi i uz strogi CSP
(`style-src` bez `'unsafe-inline'`); skripta mora biti dopuštena kroz `script-src 'self'`.

## 2. Bez JavaScripta

Uključi `kodek-badge.css` i zalijepi sadržaj `snippet.html`. Modifikatori na korijenskom elementu:
`kodek-badge--static`, `--inline`, `--light`, `--dark`, `--left`, `--right`.

## 3. React

Kopiraj `KodekBadge.tsx` u projekt:

```tsx
import KodekBadge, { KodekLogo } from './KodekBadge'

<KodekBadge />                          // sticky traka, zadnji element stranice
<KodekBadge mode="inline" theme="dark" lang="en" />
<KodekLogo theme="dark" height={32} />  // samo logo
```

Tema je ovdje `light` ili `dark` (nema `auto`) kako bi prikaz na serveru i klijentu bio isti.

## Pravila brenda

- Minimalna visina punog loga je 24 px – toliko je u svim varijantama; ne smanjivati.
- Ne mijenjati boje, ne rotirati, ne dodavati sjene ni zaobljene uglove.
- Svijetla podloga: tekst Ink `#201e1d`, „\_” Navy `#15318f`. Tamna: Paper `#f3f2f2`, „\_” Blue
  `#4264e3`.
- Link nema `nofollow`; potpis se postavlja uz dogovor s klijentom.

Krivulje su generirane iz `fonts/ChakraPetch-Bold.ttf` (font-size 96, x = 103, osnovna linija 83),
istim rasporedom kao `svg/kodek-logo-*.svg`.
