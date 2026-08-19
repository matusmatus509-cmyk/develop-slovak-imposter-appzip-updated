# Audit vizuálov minihier — zistenia z atlasov

## Party minigame atlas
Zdroj: https://3000-im7zfyfpnz2eyyzfzj480-75efe601.us4.manus.computer/manus-storage/party-minigame-atlas_9c130998.png
Rozmer: 1448×1086. Atlas je mriežka 4×3 s výraznými realistickými/3D scénami: zlaté písmeno K, zelený časovač 10, neonové piškvorky, modrá loď, pizza, slúchadlá s mikrofónom, DJ gramofón, reproduktor, divadelné masky, skupina ľudí, telefón s publikom a televízny kvíz. Štýl je moderný, kontrastný a väčšina scén je vhodná na bezpečné výrezy.

## Hlavný minigame atlas
Zdroj: https://3000-im7zfyfpnz2eyyzfzj480-75efe601.us4.manus.computer/manus-storage/minigame-art-atlas_715990a8.png
Rozmer: 1254×1254. Atlas je mriežka 3×3 s neonovo-filmovými scénami: otáznikové karty, prípitok, oranžovo-modrá cesta, komunikačné bubliny, pingpongová loptička, siluety hráčov, divadelné masky, bomba a emoji karty. Štýl je konzistentný a moderný; rizikom je nesprávny atlasový výrez alebo príliš tmavý overlay, nie kvalita zdrojových scén.

## Všeobecný herný sprite atlas
Zdroj: https://3000-im7zfyfpnz2eyyzfzj480-75efe601.us4.manus.computer/manus-storage/game-art-sprite_aecfd6d2.jpg
Rozmer: 1448×1086. Atlas je mriežka 4×3 s ilustratívnymi scénami: karty, hlasovanie v skupine, dve cesty, bubliny, pingpong, telefón na čele, maska, bomba, emoji, podvodník v tieni, kreslenie a tímová scéna. Pri nastavení `backgroundSize: 400% 300%` je jeden tile správne pomerovo štvorec/obdĺžnik podľa karty; percentuálne pozície 33.333%, 66.666% a 100% zodpovedajú stĺpcom. Okrajové čiary sú súčasťou atlasu medzi bunkami, preto je potrebný mierny scale presah (už existuje `scale-[1.06]`/`scale-[1.07]`).

## Overené výrezy
`impostor-setup` používa predvolený `gameArt` na pozícii `33.333% 100%`, čo cieli spodný riadok, druhý stĺpec — siluety podvodníka, vhodné.
`drawing-setup` používa predvolený `gameArt` na `66.666% 100%`, čo cieli spodný riadok, tretí stĺpec — tím kresliaci obraz, vhodné.
`teambattle` má predvolený `gameArt` na `100% 100%`, čo cieli tímovú scénu vpravo dole, vhodné.

## Per-game výsledok auditu

| Minigame | Zdroj a výrez | Výsledok |
|---|---|---|
| Pravda alebo výzva | Hlavný atlas, 0% 0% | OK — otáznikové karty sú čitateľné. |
| Nikdy som nikdy | Hlavný atlas, 50% 0% | OK — prípitok má bezpečný stred. |
| Radšej by som | Hlavný atlas, 100% 0% | OK — obe farebné cesty ostávajú viditeľné. |
| Slovné šarády | Párty atlas, 0% 100% | OK — masky dobre fungujú v karte. |
| Slovný ping pong | Hlavný atlas, 50% 50% | OK — loptička a farebné stopy sú v strede. |
| Hádaj kto som | Párty atlas, 66.667% 100% | OK — telefón a publikum sú správne vycentrované. |
| Iba nepravda | Samostatný hero v3 | OK — kontrast a orezanie sú vhodné. |
| Kto dostane bombu | Hlavný atlas, 50% 100% | OK — bomba zostáva v bezpečnej oblasti. |
| Hádaj emoji | Hlavný atlas, 100% 100% | OK — emoji karty sú výrazné. |
| Zakázané slovo | Samostatný hero v3 | OK — masky a textová zóna sa nebijú. |
| Zahmkaj pesničku | Samostatný hero v2 | OK — mikrofón a slúchadlá sú čitateľné. |
| Hudobný kvíz | Nový samostatný hero v3 | UPRAVENÉ — nahradený tmavý asset jasným gramofónom, slúchadlami a zvukovou vlnou. |
| Uhádni zvuk | Párty atlas, 100% 50% | OK — reproduktor je okamžite rozpoznateľný. |
| Slovo na písmeno | Samostatný hero v2 | OK — písmeno K je čitateľné a bezpečne centrované. |
| 5 za 10 | Samostatný hero v2 | OK — časovač je v strede kompozície. |
| Piškvorky | Párty atlas, 66.667% 0% | OK — celý neonový panel je viditeľný. |
| Loďky | Párty atlas, 100% 0% | OK — loď aj mriežka sú v bezpečnom strede. |

## Reálny náhľad menu Minihry
V desktopovom preview sa prvých šesť kariet zobrazuje bez zjavného zlého obsahu: otáznikové karty, prípitok, dve cesty, masky, pingpong a telefón na čele sú správne priradené. Karty pôsobia konzistentne v pomere 2 stĺpce; text je nad tmavým spodným prechodom čitateľný. Spodné karty potvrdili vhodný výber samostatných hero obrázkov pre Zahmkaj pesničku, Slovo na písmeno, 5 za 10, Piškvorky a Loďky.

## Implementovaná oprava
Pôvodný hero Hudobného kvízu bol v karte príliš tmavý, preto bol nahradený novým hostovaným assetom `party-music-quiz-hero-v3_7a166f09.png`, ktorý má jasnejší stredový motív gramofónu/slúchadiel a farebnú zvukovú vlnu. Obrazové vrstvy kariet dostali jednotný presah `inset: -1px`, mierne väčší scale a zvýšenú sýtosť/kontrast, čím sa prekryjú deliace línie atlasov bez zmeny textu alebo rozloženia.

## Hero a responzívne overenie
Hudobný kvíz bol otvorený priamo z menu. Nový hero v rozmere welcome panelu má jasný centrálny gramofón, slúchadlá a farebnú zvukovú vlnu; nič podstatné sa neorezáva a textová zóna ostáva čitateľná. Piškvorky aj Loďky boli otvorené priamo z menu. Piškvorky zobrazujú celý neonový 3×3 herný panel bez odrezania symbolov; Loďky zobrazujú celú loď a mriežku v bezpečnom strede. Oba hero panely používajú správny 4×3 atlasový tile a presah odstránil presvitanie hraníc. Mobilný viewport 390×844 bol zachytený po zmenách; hlavná aplikácia zachováva čitateľné karty, bezpečné okraje a spodnú navigáciu. CSS má samostatné breakpointy pre minigame grid a menšie displeje.

## Validácia
TypeScript kontrola prešla. Unit test asset registry prešiel: 1 súbor, 2 testy. Produkčný build prešiel; zostáva iba existujúce upozornenie na veľkosť JS chunku a runtime oneskorenie externého `dotenv` v serverovom placeholderi, ktoré nesúvisí s obrazovými zmenami.
