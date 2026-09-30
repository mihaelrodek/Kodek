Dodaj Kodek logo i vizualni identitet na moju web stranicu. Sve potrebne datoteke nalaze se u mapi `kodek-brand/` (kopiraj je u projekt, npr. u `public/brand/` ili `static/brand/`, ovisno o frameworku). Prvo pročitaj `kodek-brand/README.md` i `kodek-brand/tokens.json`.

Zadaci:

1. **Favicon i ikone**: u <head> dodaj favicon.ico, favicon.svg (type="image/svg+xml"), apple-touch-icon.png (180×180) i web manifest ikone icon-192.png i icon-512.png iz `favicon/`. Postavi theme-color na #15318f.

2. **Logo u headeru**: koristi `svg/kodek-logo-light.svg` na svijetloj pozadini, a `svg/kodek-logo-dark.svg` ako je header taman (ili ako stranica ima dark mode, mijenjaj ih prema prefers-color-scheme / temi). Visina loga u headeru oko 32–40 px na desktopu. Na mobitelu ispod 480 px širine prikaži samo znak `svg/kodek-mark-blue.svg` (oko 32 px). Logo je link na početnu, s alt="Kodek".

3. **Boje**: uvezi `css/kodek-tokens.css` (ili prenesi varijable u postojeći sustav: Tailwind config, CSS varijable, theme objekt). Primarna boja #15318f (navy), akcent #4264e3 (blue) za linkove i hover, tekst #201e1d, svijetla podloga #f3f2f2. Zamijeni postojeće primarne/akcent boje ovima gdje ima smisla, bez redizajna ostatka stranice.

4. **Font**: Chakra Petch (Bold 700 za logo/naslove). Koristi lokalni `fonts/ChakraPetch-Bold.ttf` preko @font-face iz tokens CSS-a, ili Google Fonts link iz README-a ako trebaš i lakše debljine (400–600). Primijeni ga na naslove (h1–h3). Tijelo teksta ostavi kako je, osim ako ga nema, tada koristi Chakra Petch 400.

5. **Open Graph / društvene mreže**: postavi og:image na `png/mark/blue/kodek-mark-blue-1024.png` (ili napravi 1200×630 sliku s logom na #f3f2f2 podlozi ako projekt već generira OG slike).

Pravila: ne mijenjaj SVG datoteke loga, ne rastezi ih (zadrži omjer, postavi samo visinu), ne dodaji sjene ni zaobljene uglove na znak. Kad završiš, ukratko navedi koje si datoteke izmijenio.
