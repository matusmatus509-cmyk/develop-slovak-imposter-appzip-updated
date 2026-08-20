# Jazyková a herná kontrola — Zakázané slovo (SK)

## Rozsah a výsledok

Celá existujúca databáza bola skontrolovaná karte po karte. Nešlo o tvorbu novej zásoby: zachovali sa ID, kategórie, počet 1 500 kariet aj dátový model. Upravovali sa iba ciele alebo zakázané slová, pri ktorých audit odhalil nepresný pravopis, neprirodzený cieľ alebo príliš všeobecné a opakované asociácie.

| Metrika | Výsledok |
| --- | ---: |
| Skontrolované karty | **1500** |
| Opravené karty | **539** |
| Nahradené neprirodzené cieľové slová | **1** |
| Pravopisné opravy cieľov | **1** |
| Karty so spresnenými zakázanými slovami | **539** |
| Potvrdene odstránené významové duplicity | **0** |
| Validácia dát | **PASSED** — 0 chýb, 0 upozornení |
| TypeScript | `pnpm check` úspešný |
| Produkčný build | `pnpm build` úspešný |

Pri počte opravených kariet sú zahrnuté aj karty s ponechaným cieľom, ktorým sa nahradila celá štvorica opakovaných všeobecných zákazov vecnými asociáciami. Príkladom je nahradenie vzorov typu „šport, pohyb, tréning, výkon“ konkrétnymi indíciami podľa športu.

## Povinné kontroly

Automatická validácia potvrdila presne 1 500 kariet, 10 kategórií po 150 položkách, jedinečné ID `taboo_sk_0001` až `taboo_sk_1500`, štyri neprázdne zákazy na kartu, žiadny cieľ medzi vlastnými zákazmi a žiadne presné ani blízke cieľové duplicity. Dodatočný jazykovo-herny audit po úpravách nenašiel žiadne prázdne alebo opakované všeobecné vzory.

## Dvadsať opravených kariet — vzorka

> Výber je reprodukovateľný a náhodný: obsahuje dvadsať kariet zo všetkých opráv vykonaných počas auditu.

| ID | Kategória | Typ opravy | Pred úpravou | Po úprave |
| --- | --- | --- | --- | --- |
| taboo_sk_1049 | Filmy, seriály a kultúra | spresnené zakázané slová | **vernisáž** — umenie, tvorba, výstava, autor | **vernisáž** — múzeum, história, kurátor, návštevník |
| taboo_sk_1411 | Všeobecné pojmy a situácie | spresnené zakázané slová | **koniec** — čas, život, zmena, plán | **koniec** — záver, posledný, skončiť, hotovo |
| taboo_sk_1229 | Príroda a svet | spresnené zakázané slová | **šiška** — rastlina, príroda, zem, rast | **šiška** — pôda, list, koreň, pestovať |
| taboo_sk_1027 | Filmy, seriály a kultúra | spresnené zakázané slová | **hudobný album** — hudba, zvuk, melódia, vystúpenie | **hudobný album** — skladby, nahrávka, spevák, prehrávač |
| taboo_sk_1223 | Príroda a svet | spresnené zakázané slová | **fialka** — rastlina, príroda, zem, rast | **fialka** — pôda, list, koreň, pestovať |
| taboo_sk_1313 | Príroda a svet | spresnené zakázané slová | **jazyk** — Zem, svet, krajina, ľudia | **jazyk** — mapa, štát, hranica, svetadiel |
| taboo_sk_1202 | Príroda a svet | spresnené zakázané slová | **breza** — rastlina, príroda, zem, rast | **breza** — pôda, list, koreň, pestovať |
| taboo_sk_1483 | Všeobecné pojmy a situácie | spresnené zakázané slová | **pokazený spotrebič** — rodina, domov, blízki, každý deň | **pokazený spotrebič** — oprava, zásuvka, servis, záruka |
| taboo_sk_1043 | Filmy, seriály a kultúra | spresnené zakázané slová | **portrét** — umenie, tvorba, výstava, autor | **portrét** — farby, štetec, maliar, obraz |
| taboo_sk_1158 | Technológie a médiá | spresnené zakázané slová | **rozšírená realita** — kód, vývoj, softvér, funkcia | **rozšírená realita** — kamera, mobil, obraz, vrstva |
| taboo_sk_0918 | Aktivity a šport | spresnené zakázané slová | **osemsmerovka** — hra, pravidlá, hráči, zábava | **osemsmerovka** — písmená, slová, mriežka, hľadať |
| taboo_sk_1354 | Všeobecné pojmy a situácie | spresnené zakázané slová | **závisť** — emócia, pocit, nálada, človek | **závisť** — prežívanie, reakcia, myšlienky, správanie |
| taboo_sk_1083 | Technológie a médiá | spresnené zakázané slová | **doména** — internet, sieť, pripojenie, online | **doména** — web, adresa, koncovka, registrácia |
| taboo_sk_1037 | Filmy, seriály a kultúra | spresnené zakázané slová | **bibliofilia** — tvorba, publikum, dielo, vystúpenie | **bibliofilia** — umenie, autor, výstava, galéria |
| taboo_sk_1199 | Technológie a médiá | spresnené zakázané slová | **3D tlačiareň** — elektrina, zariadenie, kábel, energia | **3D tlačiareň** — prúd, ovládanie, dom, zapnúť |
| taboo_sk_0906 | Aktivity a šport | spresnené zakázané slová | **vodné pólo** — šport, pohyb, tréning, výkon | **vodné pólo** — bazén, lopta, bránka, družstvo |
| taboo_sk_0929 | Aktivity a šport | spresnené zakázané slová | **turnaj** — hra, pravidlá, hráči, zábava | **turnaj** — súper, kolo, body, stôl |
| taboo_sk_1476 | Všeobecné pojmy a situácie | spresnené zakázané slová | **spoločná večera** — rodina, domov, blízki, každý deň | **spoločná večera** — stôl, jedlo, tanier, rodina |
| taboo_sk_1137 | Technológie a médiá | spresnené zakázané slová | **online anketa** — médiá, obsah, správa, publikum | **online anketa** — kanál, zdieľať, reklama, sledovať |
| taboo_sk_1436 | Všeobecné pojmy a situácie | spresnené zakázané slová | **druhá šanca** — čas, život, zmena, plán | **druhá šanca** — oprava, znovu, možnosť, odpustenie |

## Technický rozsah

Zmenil sa iba zdroj `client/src/data/tabooCardsSk.json` a pomocné auditné skripty. Integrácia v hre, názvy polí, kategórie, ID, používateľské rozhranie a preklady ostali nezmenené. Žiadna zmena nebola odoslaná na GitHub ani publikovaná.

