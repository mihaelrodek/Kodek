# Kodek – logo paket

Verzija 7b: kvadratni znak „K” + „odek_” u fontu Chakra Petch Bold.

## Datoteke

```
svg/
  kodek-mark-blue.svg      znak: tamnoplavi kvadrat, bijeli K (primarni)
  kodek-mark-black.svg     znak: crni kvadrat
  kodek-mark-white.svg     znak: bijeli kvadrat, plavi K (za tamne podloge)
  kodek-logo-light.svg     puni logo za svijetle podloge (tamni tekst)
  kodek-logo-dark.svg      puni logo za tamne podloge (svijetli tekst)
  kodek-logo-mono-black.svg  jednobojni, crni (pečat, faktura, fax)
  kodek-logo-mono-white.svg  jednobojni, bijeli
png/mark/<varijanta>/      16, 24, 32, 48, 64, 96, 128, 180, 192, 256, 512, 1024 px (kvadrat)
png/logo/<varijanta>/      visine 32, 48, 64, 96, 128, 256, 512, 1024 px, prozirna pozadina
favicon/                   favicon.ico (16/32/48), favicon.svg, apple-touch-icon.png (180), icon-192.png, icon-512.png
fonts/                     ChakraPetch-Bold.ttf, latin woff2, OFL licenca
css/kodek-tokens.css       CSS varijable boja + @font-face
tokens.json                isto, strojno čitljivo
```

## Boje

| Naziv | HEX | Upotreba |
|---|---|---|
| Navy | #15318f | pozadina znaka, primarna boja brenda, „_” na svijetloj podlozi |
| Blue | #4264e3 | kosa crtica u K, „_” na tamnoj podlozi, linkovi i hover |
| Ink | #201e1d | tekst na svijetloj podlozi |
| Paper | #f3f2f2 | svijetla podloga, tekst na tamnoj |
| White | #ffffff | K u znaku |

## Tipografija

- Logo: **Chakra Petch Bold (700)**, razmak slova 0. Besplatan, SIL Open Font License (fonts/OFL.txt).
- Google Fonts: `https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&display=swap`
- Za ostatak stranice (tekst) preporuka: Chakra Petch 400/500 za kraće tekstove ili neutralan sans (npr. system-ui) za duže.

## Pravila

- Omjer: znak je visok 93, font-size teksta 96 (≈ 0,97 : 1). Razmak znak–tekst 10 jedinica.
- Minimalna veličina: puni logo 24 px visine, znak 16 px.
- Zaštitna zona oko loga: najmanje ¼ visine znaka sa svake strane.
- Ne mijenjati boje, ne rotirati, ne dodavati sjene ni zaobljene uglove.

## Napomena o SVG-u punog loga

Tekst „odek_” u SVG-u je pravi tekst s ugrađenim fontom (base64), pa se prikazuje ispravno u pregledniku bez instalacije fonta.
Za tisak (Illustrator/Figma) otvori SVG i napravi *Create outlines / Outline stroke* na tekstu.
