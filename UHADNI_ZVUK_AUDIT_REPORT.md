# Uhádni zvuk: audit hlasitosti a názvov

## Stav

| | Pred auditom | Po audite |
|---|---|---|
| Záznamy v databáze | 557 (552 unikátnych súborov) | 557 (nič sa nezmazalo) |
| Hrateľné (`SOUND_CLUES`) | 557 | **290** |
| Na kontrolu (`SOUND_CLUES_NEEDS_REVIEW`) | – | 267 |
| Hlasitosť prvých 7 s (hrateľné) | −44,7 až +0,6 LUFS, rozptyl 45 LU | **−23,9 až −17,6 LUFS, medián −18,0** |
| V rozsahu ±3 LU od cieľa | 72 / 290 | **259 / 290** |
| Clipping po normalizácii | – | 0 (najvyššia vzorka 0,969) |
| Priemerná dĺžka názvu | 3,6 slova | 2,0 slova |

## Hlasitosť

Nahrávky sú externé (Wikimedia Commons), takže sa nedajú upraviť na disku.
Každá sa preto zmerala a do databázy sa zapísala korekcia, ktorú prehrávač
aplikuje za behu.

- Meranie: prvých 7 s od `startAt` (predvolená dĺžka ukážky), EBU R128 +
  true peak (ffmpeg), všetkých 552 súborov stiahnutých a overených na dĺžku.
- Cieľ: −18 LUFS. Pri dlhších ukážkach (10–15 s) sa hlasitosť 10 s drží pod −16 LUFS.
- Prehrávanie: `<audio crossOrigin>` → `GainNode(gainDb)` → ochranný limiter
  (`DynamicsCompressorNode`, 20:1, prah −4,5 dBFS) → výstup. Limiter zachytí
  iba krátke špičky. Automatický makeup gain kompresora sa kompenzuje.
- Kalibrácia: každý hrateľný zvuk sa vyrenderoval v Chromiu (OfflineAudioContext)
  cez rovnaký reťazec a `gainDb` sa doladil podľa výsledku. Výstup nikdy
  nepresiahne 0 dBFS.
- Tiché nahrávky so slabým odstupom od šumu sa nezosilňujú o viac ako +15 dB
  (pri jasnom odstupe od šumu najviac +24 dB).
- `startAt` preskočí úvodné ticho pri 8 zvukoch.
- Fallback: ak prehliadač nepodporuje Web Audio alebo server nepovolí CORS,
  zvuk sa prehrá bez korekcie (zoslabenie funguje, zosilnenie nie). Hra teda
  nikdy neostane bez zvuku.

Nástroj: `scripts/measure-sound-loudness.py` (`--calibrate --write`).
Hodnoty pre jednotlivé zvuky: `docs/uhadni-zvuk-hlasitost.json`.

## Názvy, odpovede, kredity

- 259 z 290 hrateľných názvov je prepísaných na krátke, bežné pomenovania,
  napríklad „Cisternový kamión s palivom“ → „Kamión“ a „Pneumatická sekacia
  kladivo“ → „Zbíjačka“.
- Opravené vecné chyby: „Grcanie prasaťa“ → „Chrochtanie prasaťa“,
  „Kotkodákanie sliepky po vyliahnutí vajca“ → „Kotkodákanie sliepky“,
  „Vyžmýkanie mokrej hubky“ → „Umývanie tabule hubkou“ (zodpovedá popisu
  nahrávky), „Zvonenie telefónu“ → „Vytáčanie čísla na telefóne“.
- Všetkých 290 zvukov má alternatívne odpovede. Hra ich zobrazí pri odhalení
  („Platí aj: …“), aby rozhodujúci hráč vedel, čo ešte uznať.
- Kredity a licencie sa prevzali priamo z Commons (pole Artist a LicenseShortName).
  Opravilo sa 237 kreditov a 21 licencií, predtým napríklad „Licencia je
  uvedená na zdrojovej stránke“ alebo odhadnutý autor.
- 30 adries `Special:Redirect` sa nahradilo priamou URL súboru, ktorá je
  potrebná pre CORS / Web Audio.

## Prečo 267 zvukov nie je v hre

Nič sa nezmazalo. Každý zvuk je v `SOUND_CLUES_NEEDS_REVIEW` s dôvodom:

| Dôvod | Počet |
|---|---|
| Duplicitný alebo zameniteľný koncept (napr. 4 hasičské sirény, 3 tlačiarenské stroje) | 114 |
| Nedá sa férovo určiť podľa zvuku (priemyselné stroje, hukot) | 85 |
| Príliš tiché: bezpečná normalizácia nestačí, prípadne > 6 LU pod cieľom | 46 |
| Príliš krátke (< 2 s) | 17 |
| Rovnaká nahrávka ako iný zvuk (predtým neodhalené: URL v inom tvare) | 5 |

## Kontroly

- `npm run check` (tsc + všetky validátory vrátane nového `validate:sounds`): prešlo.
- `vitest run`: 125/125.
- `vite build`: prešlo.
- Prehrávanie v Chromiu: 25 reálnych URL (ogg, oga, mp3, wav, opus, aj
  so `startAt`) išlo cez Web Audio cestu so signálom, bez chyby CORS.
- Test celého UI kola sa v sandboxe nepodarilo dokončiť, lebo CDN
  Wikimedie po meraní vracal tejto IP adrese HTTP 429.
