# Dávkový report — Jedlo a nápoje

Prvá kategória databázy **Zakázané slovo** bola spracovaná samostatne do jazykov EN, DE, ES, FR a PT. Slovenský master zostal nezmenený; všetkých 150 záznamov si zachovalo pôvodné ID a poradie. Kategória bola preložená prirodzene v každom jazyku a každý záznam má presne štyri zakázané výrazy.

| Jazyk | Preložené karty | Opravené preklady po validácii | Výsledok |
|---|---:|---:|---|
| EN | 150 | 3 | Validné |
| DE | 150 | 1 | Validné |
| ES | 150 | 0 | Validné |
| FR | 150 | 0 | Validné |
| PT | 150 | 4 | Validné |

Opravy sa týkali iba duplicitných zákazov alebo zákazu, ktorý sa zhodoval s cieľovým slovom. Neboli vytvorené nové karty, neboli zmenené ID ani kategórie mastera. Programová validácia potvrdila 150 kariet v každom jazyku, zhodu ID a poradia so slovenskou kategóriou, konzistentnú kategóriu v rámci jazyka, neprázdne slová, presne štyri zákazy a absenciu duplicít v zákazoch.

Dávka je integrovaná do `getForbiddenCardsForLanguage()`. Pri jazyku SK sa používa pôvodný master; pri EN, DE, ES, FR a PT sa preloží kategória Jedlo a nápoje a všetky zatiaľ nepreložené kategórie bezpečne používajú slovenský fallback. Výber karty používa jazykovo oddelený persistentný deck, takže randomizácia bez opakovania sa nemení a jednotlivé jazyky si navzájom nekolidujú.

Overenie projektu: `pnpm test` — 2 test files, 4 tests passed; `pnpm exec tsc --noEmit` — bez chýb; `pnpm build` — úspešný produkčný build. Zostáva existujúce upozornenie na veľkosť JS chunku a runtime upozornenie serverového placeholdera na `dotenv`, ktoré nesúvisí s touto dávkou.

## Live browser overenie

V preview bol zvolený jazyk **EN** a otvorená hra **Forbidden word**. Prvé spustené kolo zobrazilo slovenskú kartu `cvrček` s anglickým rozhraním, čím sa potvrdil bezpečný SK fallback pre zatiaľ nepreložené kategórie. Po nastavení anglického decku na testovacie overenie sa v ďalšom kole zobrazila karta `food` so štyrmi anglickými zákazmi `shop`, `basket`, `price`, `purchase`, čo potvrdilo načítanie lokalizovaného food batchu priamo v hre. Browser localStorage následne obsahoval kľúč `quick:forbidden-words:en` s jedinečným použitým identifikátorom (`usedCount: 1`, `uniqueCount: 1`, `noDuplicates: true`).

## Následná kontrola jedinečnosti

Po rozšírení validátora o kontrolu významových kolízií boli upravené len dotknuté preklady záznamov, ktoré sa v cieľovom jazyku zhodovali, napríklad rozdiel medzi koláčom a narodeninovou tortou či medzi rožkom a dlhším pečivom. Súčasne sa odlíšili rovnaké štvorice zákazov pri rôznych druhoch pečiva. Celkovo bolo precízne upravených 28 kariet: DE 5, EN 4, ES 5, FR 6 a PT 8. ID, poradie, počet 150 kariet aj kategória zostali vo všetkých piatich súboroch nezmenené. Nová kontrola už pre kategóriu Jedlo a nápoje nevykazuje žiadnu kolíziu cieľového slova, žiadne opakovanie zákazu v rámci karty ani opakovanú kombináciu štyroch zákazov.
