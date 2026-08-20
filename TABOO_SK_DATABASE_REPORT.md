# Zakázané slovo — slovenská databáza

## Súhrn

| Kontrola | Výsledok |
| --- | --- |
| Celkový počet | **1500 kariet** |
| Štruktúra | 10 kategórií × 150 kariet |
| Jazyk | Slovenčina (`sk`) |
| Aktívny herný pool | Pôvodný výber 2 000 kariet bol nahradený novou databázou 1 500 kariet. |
| Jedinečnosť | 74 potenciálnych lexikálnych prekrytí bolo kurátorsky nahradených; po finálnej kontrole zostalo **0** presných aj blízkych duplicít. |
| Validácia | **PASSED** — 0 chýb, 0 upozornení. |
| TypeScript | `pnpm check` úspešný. |
| Produkčný build | `pnpm build` úspešný. Build iba upozornil na veľkosť existujúceho JavaScriptového balíka a runtime cestu jedného uloženého obrázka; nejde o chyby buildu. |

## Kategórie

| Kategória | Počet kariet |
| --- | ---: |
| Jedlo a nápoje | 150 |
| Zvieratá | 150 |
| Ľudia a povolania | 150 |
| Predmety a domácnosť | 150 |
| Miesta a cestovanie | 150 |
| Aktivity a šport | 150 |
| Filmy, seriály a kultúra | 150 |
| Technológie a médiá | 150 |
| Príroda a svet | 150 |
| Všeobecné pojmy a situácie | 150 |

## Dvadsať náhodných ukážok

> Výber je reprodukovateľný, semenom určený a stratifikovaný: dve náhodné karty z každej kategórie.

| ID | Kategória | Cieľové slovo | Zakázané slová |
| --- | --- | --- | --- |
| taboo_sk_0685 | Jedlo a nápoje | **kurča** | pečené, kosť, gril, krídlo |
| taboo_sk_0387 | Jedlo a nápoje | **sendvič** | plátky, obložený, obed, majonéza |
| taboo_sk_0632 | Zvieratá | **kuna** | les, nočné, potrava, prívesok |
| taboo_sk_0079 | Zvieratá | **krokodíl** | bažina, zub, rieka, šupiny |
| taboo_sk_0163 | Ľudia a povolania | **murár** | tehla, malta, kladivo, betón |
| taboo_sk_0179 | Ľudia a povolania | **herec** | divadlo, rola, scéna, premiéra |
| taboo_sk_0517 | Predmety a domácnosť | **šatka** | krk, obväz, hlava, móda |
| taboo_sk_0513 | Predmety a domácnosť | **špendlík** | šitie, látka, ostrý, pripevniť |
| taboo_sk_0283 | Miesta a cestovanie | **skanzen** | drevené, obydlia, remeslá, expozícia |
| taboo_sk_0850 | Miesta a cestovanie | **pamätník** | história, socha, pripomienka, verejnosť |
| taboo_sk_0784 | Aktivity a šport | **pétanque** | gule, piesok, trávnik, francúzsko |
| taboo_sk_0941 | Aktivity a šport | **zbieranie húb** | voľný čas, príroda, výlet, zážitok |
| taboo_sk_1036 | Filmy, seriály a kultúra | **skladateľ** | hudba, zvuk, melódia, vystúpenie |
| taboo_sk_0992 | Filmy, seriály a kultúra | **komiks** | kniha, text, autor, čítanie |
| taboo_sk_1125 | Technológie a médiá | **bannerová reklama** | médiá, obsah, správa, publikum |
| taboo_sk_1149 | Technológie a médiá | **verzia programu** | kód, vývoj, softvér, funkcia |
| taboo_sk_1266 | Príroda a svet | **závej** | počasie, obloha, vzduch, príroda |
| taboo_sk_1217 | Príroda a svet | **púpava** | rastlina, príroda, zem, rast |
| taboo_sk_1390 | Všeobecné pojmy a situácie | **prosba** | ľudia, rozhovor, vzťah, situácia |
| taboo_sk_1473 | Všeobecné pojmy a situácie | **zasnúbenie** | rodina, domov, blízki, každý deň |

## Rozsah integrácie

Súbor `client/src/data/teamBattleExtras.ts` teraz exportuje aktívny pool `FORBIDDEN_CARDS` priamo z `tabooCardsSk.json`. Formát zostal kompatibilný s existujúcim rozhraním `ForbiddenCard`: `word` a pole štyroch hodnôt `forbidden`. Herná logika ani používateľské rozhranie sa nemenili; databáza nebola preložená do ďalších jazykov.

