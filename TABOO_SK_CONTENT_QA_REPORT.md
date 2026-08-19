# Content QA — Zakázané slovo (SK)

## Cieľ kontroly

Táto kontrola posudzovala všetkých 1 500 cieľov nie ako slovníkové heslá, ale ako pojmy pre reálnu party hru. Ponechané zostali bežné, konkrétne a zrozumiteľné slová aj prirodzené ustálené viacslovné názvy. Nahradené boli len nebežné, umelé, príliš technické, administratívne alebo nehrateľné ciele; pri každej náhrade boli vytvorené nové štyri relevantné zakázané slová.

## Výsledky

| Metrika | Výsledok |
| --- | ---: |
| Skontrolované karty | **1500** |
| Nahradené cieľové slová | **189** |
| Karty so zmenenými zákázanými slovami | **188** |
| Zachované kategórie | **10 × 150** |
| Zachované ID | **taboo_sk_0001 – taboo_sk_1500** |
| Zákazy na kartu | **4** — zachovaný existujúci dátový model |
| Kolízie cieľa so zákazom | **0** |
| Používateľom označené umelé ciele ponechané v aktívnych dátach | **0** |

| Kategória | Nahradené ciele |
| --- | ---: |
| Jedlo a nápoje | 0 |
| Zvieratá | 10 |
| Miesta a cestovanie | 20 |
| Ľudia a povolania | 0 |
| Predmety a domácnosť | 0 |
| Aktivity a šport | 12 |
| Filmy, seriály a kultúra | 20 |
| Technológie a médiá | 74 |
| Príroda a svet | 22 |
| Všeobecné pojmy a situácie | 31 |

## Dvadsať ukážok nahradených kariet

> Výber je reprodukovateľný, náhodný a obsahuje len karty, pri ktorých sa cieľ reálne zmenil oproti predchádzajúcemu checkpointu.

| ID | Kategória | Predtým | Teraz |
| --- | --- | --- | --- |
| taboo_sk_1085 | Technológie a médiá | **prístupový kód** — číslice, heslo, zámok, overenie | **PIN** — číslo, banka, karta, tajné |
| taboo_sk_1294 | Príroda a svet | **delta rieky** — mapa, výhľad, výlet, geografia | **ústie** — rieka, more, voda, tok |
| taboo_sk_1126 | Technológie a médiá | **sponzorovaný príspevok** — sociálna sieť, reklama, značka, platiť | **príspevok** — profil, písať, zdieľať, sociálna sieť |
| taboo_sk_1128 | Technológie a médiá | **zdieľanie príspevku** — sociálna sieť, profil, odoslať, sledovať | **zdieľanie** — profil, poslať, sociálna sieť, príspevok |
| taboo_sk_1457 | Všeobecné pojmy a situácie | **reklamácia** — záruka, obchod, vrátiť, chybný tovar | **vrátenie** — obchod, tovar, peniaze, chyba |
| taboo_sk_1097 | Technológie a médiá | **videonahrávka** — kamera, záznam, prehrať, obraz | **filmček** — kamera, obraz, prehrať, záznam |
| taboo_sk_0869 | Miesta a cestovanie | **suvenírový obchod** — ubytovanie, nocľah, hosť, rezervácia | **suvenír** — darček, turista, pamiatka, obchod |
| taboo_sk_0662 | Aktivity a šport | **kriket** — pálka, lopta, ihrisko, hod | **naháňačka** — behať, deti, chytiť, hra |
| taboo_sk_0896 | Aktivity a šport | **moderný päťboj** — disciplína, beh, plávanie, šerm | **olympiáda** — šport, medaila, hry, súťaž |
| taboo_sk_0602 | Zvieratá | **mimikra** — napodobniť, vyzerať, maskovať, predátor | **hmyz** — krídla, malý, príroda, nohy |
| taboo_sk_1148 | Technológie a médiá | **oprava chyby** — debugovanie, programátor, test, aktualizácia | **oprava** — chyba, servis, zlepšiť, nový |
| taboo_sk_1111 | Technológie a médiá | **optické vlákno** — elektronika, batéria, ovládanie, kábel | **kábel** — zásuvka, nabíjačka, drôt, pripojiť |
| taboo_sk_1084 | Technológie a médiá | **používateľské meno** — účet, prihlásenie, identita, heslo | **profil** — meno, fotka, účet, sociálna sieť |
| taboo_sk_1125 | Technológie a médiá | **bannerová reklama** — web, obrázok, kliknúť, propagácia | **reklama** — značka, televízia, produkt, propagácia |
| taboo_sk_1039 | Filmy, seriály a kultúra | **etuda** — umenie, autor, výstava, galéria | **balet** — tanec, divadlo, špičky, hudba |
| taboo_sk_0556 | Zvieratá | **bylinožravec** — tráva, žuvanie, kopytá, pásť sa | **šteniatko** — pes, mláďa, štekať, labky |
| taboo_sk_1061 | Technológie a médiá | **biometrický snímač** — elektronika, batéria, ovládanie, kábel | **selfie** — fotka, mobil, tvár, kamera |
| taboo_sk_1309 | Príroda a svet | **časové pásmo** — mapa, štát, hranica, svetadiel | **zemeguľa** — mapa, svet, kontinent, kruhová |
| taboo_sk_0832 | Zvieratá | **suriikata** — púšť, nora, stáť, Afrika | **surikata** — púšť, nora, Afrika, stáť |
| taboo_sk_0863 | Miesta a cestovanie | **spoločná kuchyňa** — ubytovanie, nocľah, hosť, rezervácia | **kuchynka** — varenie, riad, izba, jedlo |

## Overenie

Po náhradách prešla štrukturálna validácia bez chýb, bez presných či blízkych duplicít a bez kolízií cieľov so zakázanými slovami. TypeScript kontrola aj produkčný build boli úspešné. Rozhranie, herná logika, počty, kategórie, identifikátory a existujúce rozhranie `ForbiddenCard` sa nemenili.

