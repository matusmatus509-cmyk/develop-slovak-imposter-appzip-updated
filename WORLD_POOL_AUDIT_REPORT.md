# Audit svetového poolu hudobného kvízu

Svetový pool má obsahovať to, čo pozná celá partia — primárne anglické hity a
z iných jazykov len skutočne svetové kusy. Posúdiť 1 737 skladieb odhadom nejde,
preto sa merali dva nezávislé signály (`scripts/audit-world-pool.mjs`).

## Čím sa meralo

| Signál | Čo hovorí | Prečo nestačí sám |
|---|---|---|
| **Deezer `rank`** (0–1 000 000) | ako často sa skladba dnes hrá | skresľuje domácim trhom — Deezer je francúzska firma, francúzske skladby majú rank nadhodnotený |
| **Počet jazykových verzií článku na Wikipédii** | o koľkých národoch je skladba téma | pri generických názvoch sa zhodne s iným článkom (Elán „Vanesa" vyšla na 54 jazykov, lebo trafila článok o mene) |

Preto sa rozhodovalo z oboch a **nemeraná hodnota skladbu netrestala**. Bez toho
by vypadli „Hello — Adele" či „Payphone — Maroon 5" len preto, že vyhľadávanie
na Wikipédii pri generickom názve zlyhalo.

Kalibrácia signálov:

| Skladba | Deezer rank | Wikipédia | verdikt |
|---|---|---|---|
| Gangnam Style — PSY | 772 386 | 77 jazykov | svetová |
| Despacito — Luis Fonsi | 873 208 | 52 | svetová |
| Dancing Queen — ABBA | 912 759 | 35 | svetová |
| 99 Luftballons — Nena | 791 870 | 25 | svetová |
| Atemlos durch die Nacht — Helene Fischer | 613 472 | ~4 | len domáca |

Nemecký „Atemlos" má na Deezeri **viac** fanúšikov než „99 Luftballons" — až
Wikipédia ukáže, že o prvom píšu štyri národy a o druhom dvadsaťpäť.

## Čo z auditu vyplynulo

### Odstránené zo svetového poolu — 51 skladieb

| Dôvod | Počet | Príklady |
|---|---|---|
| málo hraná **a** Wikipédia ju nepozná | 17 | Au revoir — Mark Forster, Šrouby do hlavy — Lucie |
| nenájdená ani na Deezeri, ani na iTunes | 15 | neexistujúce a preklepnuté záznamy |
| neanglická a nie svetovo známa | 8 | Láska moja — Elán, Bára — Kabát |
| **národná sláva v svetovom poole** | 11 | Vanesa — Elán, Pedestal — Aiko, Bochum — Grönemeyer |

Posledná skupina sa nezmazala — presunula sa do svojich jazykových poolov
(`sk` +1, `cs` +3, `de` +1; zvyšok tam už bol). Slovenských a českých skladieb
je teraz vo svetovom poole **nula**.

### Vrátené do hry z archívu — 107 skladieb

Archív (`WORLD_HITS_EXTENDED`, `WORLD_SONG_EXPANSION`) bol kedysi vyradený celý
naraz, takže v ňom zostali aj slávne skladby. Vrátili sa tie s dokázanou
hranosťou (rank ≥ 600 000, alebo ≥ 350 000 pri klasike s aspoň ôsmimi
jazykovými Wikipédiami):

Mockingbird — Eminem · Still Loving You — Scorpions · Beggin' — Måneskin ·
No Surprises — Radiohead · Don't Stop Believin' — Journey · I Feel It Coming —
The Weeknd · Torn — Natalie Imbruglia · Mr. Saxobeat — Alexandra Stan · …

Deväť skladieb z tohto zoznamu sa **nevrátilo** — sú na zozname
`REJECTED_ACTIVE_RECORDINGS` vo validátore ako coververzie (Self Control —
Laura Branigan, All the Things She Said — t.A.T.u.). Audit chcel vrátiť aj
„Twist and Shout — The Beatles"; originál je od The Isley Brothers, takže
skladba zostala v archíve a pravidlo drží po novom validátor, nie iba test.

## Neanglické skladby, ktoré zostali

84 z 1 507 (**94 % poolu je anglických**). Sú to práve tie svetovo známe:
Despacito, Gangnam Style, Macarena, Dragostea Din Tei, Gasolina, Danza Kuduro,
Sofia, Zitti e buoni, L'italiano, Con te partirò, Sarà perché ti amo, Felicità,
The Ketchup Song, Garota de Ipanema, La Vie en rose, Formidable, 99 Luftballons,
BTS a BLACKPINK, súčasné latino hity (Bad Bunny, Karol G, Farruko).

Pri súčasných latino hitoch rozhodol Deezer rank (900k+), nie Wikipédia —
tá pre nedávne skladby ešte nestihla vzniknúť vo viacerých jazykoch.

## Výsledok

|  | pred | po |
|---|---|---|
| svetový pool | 1 458 | **1 507** |
| z toho anglických | — | 94 % |
| slovenské/české v svetovom poole | 5 | **0** |
| celý katalóg | 4 151 | 4 221 |

Overenie: `npm run check` čisté · `npx vitest run` 125/125 · `npx vite build` prejde.

Podrobné merania pre každú skladbu: `world-pool-audit.json`,
`world-archive-audit.json`. Audit sa dá zopakovať (`node scripts/audit-world-pool.mjs`,
`… archive`) — priebežne ukladá, takže sa dá prerušiť a dobehnúť.
