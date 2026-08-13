# Stav databázy Kvízu

Databáza v súbore [`src/data/quiz-master.raw.json`](src/data/quiz-master.raw.json) obsahuje hotový cieľ aktuálnej požiadavky: **najmenej 700 platných slovenských otázok v každej z dvoch úrovní obtiažnosti**. Je priamo pripojená k výberu tímového Kvízu prostredníctvom [`src/data/quizMaster.ts`](src/data/quizMaster.ts) a existujúceho dátového modelu. Používateľské rozhranie, bodovanie ani herná mechanika sa nemenili.

## Aktuálny rozsah

| Kategória | Počet otázok |
|---|---:|
| 🌍 Geografia | 198 |
| 🔬 Veda | 208 |
| 📜 História | 183 |
| 🏆 Šport | 174 |
| 🎬 Filmy a seriály | 196 |
| 🎵 Hudba | 206 |
| 🎨 Umenie a knihy | 199 |
| 🍝 Jedlo a život | 36 |
| **Spolu** | **1 400** |

Každá položka obsahuje `id`, `category`, `factKey`, `question`, štyri možnosti `options`, `correctIndex`, odvodenú správnu odpoveď `answer` a úroveň `difficulty`.

## Úrovne obtiažnosti

| Úroveň | Počet otázok | Určenie |
|---|---:|---|
| 🟢 Ľahšie otázky | 700 | Základné a všeobecne známe fakty |
| 🔴 Ťažšie otázky | 700 | Detailnejšie a náročnejšie faktické vedomosti |

V nastavení tímovej hry hráč vyberie jednu úroveň. Každé kvízové kolo následne žrebuje len z vybratej skupiny otázok a oba výbery majú samostatnú históriu neopakovaných kariet.

## Kontrola kvality

Kontrola v `scripts/audit-quiz-master.mjs` potvrdila 1 400 jedinečných `FACT_KEY`, 1 400 jedinečných normalizovaných textov otázok, nulový počet duplicitných otázok a nulový počet štrukturálnych chýb. Doplnková kontrola v `scripts/audit-quiz-language.py` potvrdila nulový výskyt URL-kódovaných textov a otázok, ktoré zostali začaté anglickou formuláciou.

> Otázky používajú stabilné vedomostné fakty, vierohodné možnosti a presný index správnej odpovede. Nové záložné položky boli preložené do slovenčiny a prešli programovou kontrolou štruktúry a jazykových artefaktov. Pri budúcej redakčnej úprave je vhodné priebežne manuálne preverovať aj vecnú vhodnosť jednotlivých otázok podľa spätných väzieb hráčov.

## Udržiavacie nástroje

| Súbor | Účel |
|---|---|
| `scripts/audit-quiz-master.mjs` | Kontrola štruktúry, identifikátorov, duplicít a počtov úrovní |
| `scripts/audit-quiz-language.py` | Kontrola URL-kódovania a zvyškov anglických začiatkov otázok |
| `scripts/expand-quiz-to-700-per-difficulty.py` | Pôvodný obnoviteľný postup tvorby kategorizovaných otázok |
| `scripts/fill-quiz-from-trivia-api.py` | Záložný obnoviteľný postup doplnenia s otvoreným zdrojom a slovenským prekladom |

## Referencie

[1] [The Trivia API – Documentation](https://the-trivia-api.com/docs/)

[2] [Wikidata Query Service – User Manual](https://www.mediawiki.org/wiki/Wikidata_Query_Service/User_Manual)
