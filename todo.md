# Audit vizuálov minihier

- [x] Zozbierať všetky minihry, ich obrázky a parametre výrezov v karte aj hero obrazovke.
- [x] Vizuálne overiť obsah a kompozíciu každej minihry vrátane Piškvoriek a Loďiek.
- [x] Nahradiť alebo upraviť iba obrázky, ktoré sú nevhodné či zle orezané.
- [x] Nasadiť opravené hostované obrázky bez zmeny pôvodného rozhrania aplikácie.
- [x] Overiť karty minihier v mobilnom náhľade, produkčný build a uložiť novú verziu.

## Oprava okrajov obrázkov

- [x] Identifikovať zdroj prázdnych línií v obrázkových atlasoch a samostatných hero obrázkoch.
- [x] Nastaviť jednotné prekrytie obrázka cez hranice kontajnera bez zásahu do obsahu kariet.
- [x] Overiť karty aj hero obrazovky minihier v mobilnom rozhraní a uložiť novú verziu.

## Farebné akcenty minihier

- [x] Zozbierať opakujúce sa farby z konfigurácie všetkých minihier.
- [x] Prideliť každej minihre vlastný čitateľný akcent a zodpovedajúce jemné pozadie.
- [x] Overiť kontrast a farebné odlíšenie na kartách aj hero obrazovkách, potom uložiť novú verziu.

## Slovenský obsah a náhodný výber

- [x] Prečítať priložené pokyny a zmapovať dotknuté minihry a dátové zdroje.
- [x] Pripraviť a skontrolovať požadovanú slovenskú zásobu obsahu pred zmenou hernej logiky.
- [x] Zaviesť lokalizáciu a náhodný výber bez opakovania podľa schválených pokynov.
- [x] Otestovať herné toky, produkčný build a uložiť novú verziu.

## Pokyny z druhého súboru

- [x] Prečítať druhý priložený súbor a identifikovať konkrétne požiadavky.
- [ ] Pripraviť požadované obsahové alebo technické zmeny bez regresie existujúceho kvízu.
- [ ] Nasadiť zmeny, otestovať ich a uložiť novú verziu projektu.

## Content QA — Zakázané slovo

- [x] Stanoviť kritériá prirodzenosti, bežnosti a hrateľnosti cieľových slov pre party hru.
- [x] Posúdiť všetkých 1 500 existujúcich cieľov vrátane neprirodzených viacslovných a odborných pojmov.
- [x] Nahradiť iba nevhodné karty bežnými slovenskými pojmami a prepracovať ich štyri zákazy.
- [x] Overiť počet, kategórie, ID, duplicity, integráciu, TypeScript a produkčný build.
- [x] Pripraviť auditný súhrn s počtom náhrad a ukážkami opravených kariet.

## Oprava React kľúča — Tímová rýchla hra

- [x] Odovzdať kľúč komponentu ForbiddenWordGame priamo v JSX namiesto rozbaľovaného objektu props.
- [x] Overiť TypeScript, produkčný build a načítanie obrazovky bez upozornenia v konzole.

## Fáza 2 — Lokalizácie Zakázaného slova

- [x] Zmapovať master databázu, existujúci i18n vzor a aktívny výber kariet podľa jazyka.
- [ ] Vytvoriť prirodzené lokalizácie všetkých 1 500 kariet pre EN, DE, ES, FR a PT pri zachovaní ID a kategórií.
- [ ] Validovať počty, texty, štyri zákazy, identifikátory, kategórie a významovú zhodu so SK masterom.
- [ ] Integrovať lokalizovaný výber do Zakázaného slova bez zmeny randomizácie alebo herných pravidiel.
- [ ] Otestovať všetky jazyky, produkčný build a pripraviť záverečný auditný report.

### Kategóriové dávky

- [x] Upraviť prekladový skript na jednu kategóriu na beh a uložiť report s počtom, opravami a validáciou.
- [x] Preložiť a validovať kategóriu Jedlo a nápoje vo všetkých piatich jazykoch.
- [ ] Preložiť a validovať zostávajúcich deväť kategórií rovnakým obnoviteľným postupom.
- [ ] Validovať úplné dávky Jedlo a nápoje, Zvieratá, Miesta a cestovanie a Ľudia a povolania pred ich bezpečnou integráciou.

## Nová slovenská zásoba — Iba nepravda

- [x] Zmapovať aktuálny model otázok a mechaniku náhodného výberu bez opakovania.
- [x] Vytvoriť presne 500 nových krátkych slovenských otázok s jednou samozrejmou správnou odpoveďou.
- [x] Validovať jedinečnosť, otázniky, dĺžku, prázdne texty, pestrosť kategórií a nevhodné školské formulácie.
- [x] Pripojiť novú zásobu bez zmeny existujúcej logiky hry alebo jej randomizácie.
- [x] Otestovať hru, TypeScript, produkčný build a pripraviť auditný súhrn bez lokalizácií.

## Zjednodušené nastavenia minihier

- [x] Zmapovať spoločné obrazovky nastavení a odstrániť úvodnú voľbu spôsobu bodovania.
- [x] Ponechať iba jasný prepínač tímového režimu v relevantných hrách.
- [x] Zobraziť počet hráčov v zbalenom riadku a upravovanie mien presunúť do rozbaľovacieho panelu.
- [x] Overiť nový tok vo všetkých dotknutých hrách, mobilný náhľad, TypeScript a produkčný build.

## Moderné menu minihier

- [x] Zmapovať aktuálne rozloženie, obrazy a opakujúce sa akcenty na kartách minihier.
- [x] Stanoviť modernú, farebne vyváženú navigáciu a rozdielne akcenty pre karty bez opakovaní.
- [x] Prepracovať karty, hierarchiu a interakcie menu bez zásahu do navigácie alebo hier.
- [x] Overiť desktopový a mobilný náhľad, prístupnosť, TypeScript a produkčný build.

## Kompaktné obrazové menu minihier

- [x] Vrátiť domovskú stránku na vzhľad pred posledným vizuálnym zásahom.
- [x] Odstrániť textové kapitoly, poradové čísla a AI ikony z menu minihier.
- [x] Zmenšiť horný panel a vytvoriť hustejší obrazový prehľad s čo najviac hrami nad záhybom.
- [x] Zachovať jedinečné farebné akcenty a upraviť len nevhodné výrezy alebo obrázky.
- [x] Overiť desktopový a mobilný náhľad, navigáciu, TypeScript a produkčný build.

## Väčšie obrazové menu a Párty výber minihier

- [x] Pridať stručný nadpis a zväčšiť názvy aj obrazové karty v samostatnom menu minihier.
- [x] Zmapovať existujúci tok výberu minihier v Párty móde pred štartom kola.
- [x] Pridať obrazový výber minihier do Párty módu bez zmeny pravidiel alebo bodovania.
- [x] Overiť výber jednej aj viacerých minihier, navigáciu, mobilný náhľad, TypeScript a produkčný build.

## Väčšie vizuály, písmo a farby v herných výberoch

- [x] Preskúmať aktuálne veľkosti obrazových kariet, textov a akcentov v samostatnom menu aj Párty výbere.
- [x] Zväčšiť obrazové plochy a názvy pri zachovaní čitateľného mobilného rozloženia.
- [x] Upraviť typografiu a farebnú hierarchiu tak, aby mali hry výraznejší a jednotný charakter.
- [x] Overiť mobilný a desktopový náhľad, navigáciu, TypeScript a produkčný build.

## Návrat rozloženia a väčšie herné karty

- [x] Porovnať poslednú úpravu s predchádzajúcim rozložením obrazových výberov.
- [x] Obnoviť pôvodný počet stĺpcov a jemnejší charakter kariet.
- [x] Zväčšiť celé herné karty, názvy a textové spracovanie bez ďalšej zmeny vizuálneho smerovania.
- [x] Overiť samostatné menu, Párty výber, navigáciu, TypeScript a produkčný build.

## Samostatná obrazovka výberu minihier v Párty móde

- [x] Zmapovať aktuálne odovzdávanie výberu minihier medzi nastavením Párty módu a herným tokom.
- [x] Pripraviť celú obrazovku výberu v štýle samostatného menu Minihry so spätným návratom a potvrdením.
- [x] Prepojiť výber, zrušenie, potvrdenie a zobrazenie počtu zvolených hier v nastavení Párty módu.
- [x] Overiť výber, návrat, štart Párty hry, mobilný náhľad, TypeScript a produkčný build.

## Aktuálne vizuály a výber po štarte Párty hry

- [x] Zmapovať aktuálne obrázky minihier a hernú podporu Hudobného kvízu v Párty móde.
- [x] Použiť aktuálne hero obrázky v samostatnom Párty výbere a pridať Hudobný kvíz do zostavy.
- [x] Otvárať manuálny výber až po stlačení tlačidla Začať party hru a po potvrdení spustiť hru.
- [x] Overiť obrázky, výber, návrat, Hudobný kvíz, štart Párty hry, TypeScript a produkčný build.

## Zlepšenie dizajnu menu Minihry

- [x] Preskúmať aktuálne rozloženie menu Minihry a dostupné metadáta o hráčoch a dĺžke hier.
- [x] Navrhnúť výraznejšiu hlavičku s podnadpisom, počtom hier a nenápadným tmavým pozadím.
- [x] Prepracovať dvojstĺpcové karty s metadátami, konzistentnými badgeami, glow akcentmi a dostupnými stavmi interakcie.
- [x] Overiť mobilný náhľad, navigáciu, obľúbené, TypeScript a produkčný build; Minihry nemajú samostatnú spodnú navigáciu, takže aktívny stav nevyžadoval úpravu.

## Jemné obrazové pozadie kariet Minihry

- [x] Zmapovať pôvodné obrázky minihier a existujúce vrstvy kariet.
- [x] Pridať staršie obrázky ako subtílne tmavé pozadie s dostatočným kontrastom textu.
- [x] Overiť čitateľnosť, navigáciu, TypeScript a produkčný build.

## Viditeľnejšie obrazové pozadia Minihry

- [x] Zhodnotiť aktuálnu intenzitu starších obrázkov v kartách Minihry.
- [x] Zosilniť obrazové pozadie a upraviť ochranný prechod pod textom.
- [x] Overiť čitateľnosť, navigáciu, TypeScript a produkčný build.

## Výraznejšie obrazové pozadia Minihry

- [x] Zhodnotiť aktuálnu viditeľnosť starších obrázkov v kartách Minihry.
- [x] Ešte viac zosilniť obrazové pozadia a vyvážiť ochranný prechod pod textom.
- [x] Overiť čitateľnosť, navigáciu, TypeScript a produkčný build.

## Stručnejšie a vyrovnané karty Minihry

- [x] Preskúmať aktuálne popisy, rozostupy ikon a výšky názvov v kartách Minihry.
- [x] Skrátiť popisy na jednu vetu a upraviť ich vizuálnu prioritu.
- [x] Oddeliť ikonku a srdiečko, zjednotiť výšku názvu a ponechať pill odznak 17 hier bez zmeny.
- [x] Overiť čitateľnosť, obľúbené, navigáciu, TypeScript a produkčný build.

## Odstránenie odznakov NOVÉ

- [x] Odstrániť z kariet Minihry všetky viditeľné odznaky s textom NOVÉ.
- [x] Overiť, že ostatné prvky kariet a navigácia zostali nezmenené.
- [x] Overiť TypeScript a produkčný build.

## Audit a modernizácia obrázkov minihier

- [x] Zmapovať všetky obrázky, atlasové výrezy a použitia v menu aj herných obrazovkách.
- [x] Vizuálne posúdiť kompozíciu, orezanie, čitateľnosť a moderný vzhľad každého vizuálu.
- [x] Upraviť výrezy alebo pripraviť nové moderné obrázky tam, kde existujúce nesedia.
- [x] Integrovať zmeny a overiť menu, herné obrazovky, responzívnosť, TypeScript a produkčný build.

- [x] Nahradiť príliš tmavý hero Hudobného kvízu novým jasným hudobným vizuálom a upraviť bezpečný presah atlasových vrstiev bez viditeľných čiar.
- [x] Overiť nový asset a všetky opravené karty na desktope, mobile, v hero obrazovkách, cez TypeScript, testy a produkčný build.

## Dodatočné overenie auditu obrázkov

- [x] Otvoriť a vizuálne skontrolovať mobilný aj desktopový náhľad všetkých kariet Minihry po zmenách vrátane Piškvoriek a Loďiek.
- [x] Preklikať hero/welcome obrazovky dotknutých minihier a potvrdiť, že nové výrezy a presah fungujú aj mimo katalógu.
- [x] Zdokumentovať per-game výsledok auditu (OK alebo upravené) pre všetkých 17 minihier.
- [x] Až po vizuálnom overení mobile a hero obrazoviek označiť audit integrácie a finálnu validačnú položku ako hotové.

- [x] Integrovať dávku Jedlo a nápoje do výberu Zakázaného slova podľa aktuálneho jazyka s bezpečným slovenským fallbackom.
- [x] Otestovať integračný výber, randomizáciu bez opakovania, TypeScript a produkčný build.

## Obnova predchádzajúceho menu Imposter

- [x] Porovnať aktuálne menu Imposter s poslednou stabilnou verziou pred jeho vizuálnou zmenou.
- [x] Obnoviť iba vzhľad a rozloženie menu Imposter bez zásahu do Minihier, Párty módu alebo lokalizačných dát.
- [x] Overiť návrat, navigáciu, mobilný náhľad, TypeScript, testy a produkčný build.
- [x] Overiť obnovené menu Imposter aj v skutočnom mobilnom viewporte a až potom uzavrieť finálnu validáciu.

## Zjednodušenie a modernizácia menu Minihry

- [x] Zmapovať aktuálnu hlavičku, textové prvky a akcie na kartách Minihry.
- [x] Obmedziť kartu na názov, krátke metadáta a dominantný herný obraz bez dlhých popisov alebo dekoratívnych ikon.
- [x] Zjednodušiť hlavičku a rozostupy pre modernejší, vzdušný vzhľad pri zachovaní počtu hier a obľúbených.
- [x] Overiť výber hry, obľúbené, desktopový a mobilný náhľad, TypeScript, testy a produkčný build.
- [x] V zjednodušenom menu Minihry reálne otvoriť aspoň jednu hru a potvrdiť správnu welcome alebo hernú obrazovku.
- [x] V zjednodušenom menu Minihry reálne prepnúť obľúbené na jednej karte a potvrdiť funkčný stav bez regresie.

## Dizajn jednotlivých minihier

- [x] Vrátiť menu Minihry na vzhľad pred posledným zjednodušením kariet a hlavičky.
- [x] Auditovať herné obrazovky minihier a označiť tie s nadbytočným textom alebo neprehľadným layoutom.
- [x] Prepracovať Iba nepravda s jasnou hierarchiou, menej textom a vlastným tmavým herným pozadím.
- [x] Aplikovať rovnaké princípy primerane na ďalšie dotknuté minihry bez zmeny ich pravidiel.
- [x] Overiť herné toky, desktopový a mobilný náhľad, TypeScript, testy a produkčný build.
- [x] Dokončiť audit ostatných minihier a textovo hustých herných obrazoviek; pri každej stručne zdokumentovať, či bola upravená alebo prečo zostáva bez zmeny.
- [x] Overiť v mobilnom viewporte aj upravené hry Pravda alebo výzva a Nikdy som nikdy vrátane otvorenia promptu, akčných tlačidiel a čitateľnosti nového layoutu.
- [x] Až po úplnom audite a mobilnom overení všetkých dotknutých minihier označiť spoločnú validačnú položku za hotovú.
- [x] V mobilnom viewporte reálne otvoriť Pravda alebo výzva, zvoliť Pravda alebo Výzva a potvrdiť zobrazenie promptu aj funkčnosť akčných tlačidiel.
- [x] Po doplnení mobilného dôkazu pre Pravda alebo výzva znovu uzavrieť spoločnú validačnú položku pre upravené minihry.
- [x] V mobilnom viewporte bez preview skratiek reálne otvoriť Minihry → Pravda alebo výzva → Pripraviť hru → zvoliť Pravda alebo Výzva a zdokumentovať zobrazenie promptu.
- [x] V tom istom reálnom mobilnom toku Pravda alebo výzva stlačiť akčné tlačidlá Iná otázka a Späť a potvrdiť funkčnosť bez regresie.
- [x] Až po reálnom mobilnom overení Pravda alebo výzva znovu označiť finálnu spoločnú validačnú položku pre upravené minihry ako hotovú.

## Pokračovanie vizuálnych úprav minihier

- [x] Určiť ďalšie prioritné minihry s priestorom na lepšiu vizuálnu hierarchiu alebo tematické pozadie.
- [x] Prepracovať vizuálnu prezentáciu vybraných minihier bez zmeny ich pravidiel, dát alebo náhodného výberu.
- [x] Overiť nové herné obrazovky na desktope a mobile, cez TypeScript, testy a produkčný build.
- [x] Otvoriť a vizuálne overiť upravenú hernú obrazovku Hádaj, kto som na desktope aj v mobilnom viewporte vrátane čitateľnosti otočeného slova, pozadia a časovača.
- [x] Po browser/mobilnom overení Hádaj, kto som znovu uzavrieť spoločnú validačnú položku pre nové vizuálne úpravy minihier.

## Ďalší vizuálny audit minihier

- [x] Vizuálne posúdiť herné obrazovky Radšej by som, Slovné šarády a Slovný ping pong na desktope aj v prioritnom mobilnom viewporte.
- [x] Upraviť iba tie obrazovky z auditu, ktoré potrebujú jasnejšie tematické pozadie, menej pomocného textu alebo lepšiu hierarchiu bez zmeny pravidiel či dát.
- [x] Overiť reálne herné toky upravených obrazoviek na desktope a mobile, potom spustiť testy, TypeScript a produkčný build.
- [x] V reálnom mobilnom toku otvoriť Minihry → Radšej by som → Pripraviť hru až na aktívnu obrazovku s dvoma voľbami.
- [x] V reálnom mobilnom toku otvoriť Minihry → Slovné šarády → Pripraviť hru → Začať šarády → Štart až na aktívnu kartu so slovom.
- [x] Overiť Slovný ping pong aj v aktívnom mobilnom hernom toku, nie iba cez všeobecný preview vstup.
- [x] Znovu potvrdiť odstránenie dočasných QA preview vstupov pred automatickou kontrolou a checkpointom.

## Cielený audit Hádaj emoji

- [x] Vizuálne posúdiť aktívnu obrazovku Hádaj emoji na desktope a v mobilnom viewporte so zameraním na dominantné emoji, hierarchiu a tematické pozadie.
- [x] Upraviť iba dekoratívne vizuálne vrstvy Hádaj emoji, ak audit odhalí priestor na zlepšenie, bez zmeny obsahu kariet alebo hernej logiky; zmena nebola potrebná, pretože existujúca plocha má jasnú hierarchiu a čitateľné dominantné emoji.
- [x] Overiť prípadnú úpravu v reálnom desktopovom aj mobilnom toku a spustiť testy, TypeScript a produkčný build; úprava nebola potrebná a projekt ostal bez QA preview vstupu.

## Mobilný tok Iba nepravda

- [x] Zviditeľniť zostávajúci čas a priebeh časovača na mobilnej hernej obrazovke Iba nepravda.
- [x] Po vypršaní času automaticky načítať ďalšiu otázku bez dodatočnej akcie hráča.
- [x] Nahradiť hodnotenie správne/nesprávne jednoznačnou prehrou po stlačení možnosti Nesprávne a ukončiť aktuálnu hru.
- [x] Udržať hernú obrazovku Iba nepravda výhradne mobilne optimalizovanú bez rozširovania desktopového layoutu.
- [x] Doplniť testy a overiť nový mobilný tok vrátane odpočtu, automatického pokračovania a prehry, potom spustiť TypeScript a produkčný build.

## Odovzdanie aktuálnej verzie na GitHub

- [x] Skontrolovať stav pracovného stromu, cieľovú vetvu a aktuálny vzdialený repozitár pred odovzdaním; GitHub main má rozdielnu históriu, preto bude použitá bezpečná nová vetva bez prepisu main.
- [ ] Vytvoriť commit pre aktuálnu overenú verziu Iba nepravda a súvisiace vizuálne úpravy.
- [ ] Odoslať commit do vybraného repozitára GitHubu a potvrdiť výslednú vetvu a revíziu.
