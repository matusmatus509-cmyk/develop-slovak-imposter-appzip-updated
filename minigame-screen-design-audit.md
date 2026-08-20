# Audit dizajnu jednotlivých minihier

Audit sa sústredil na **herné obrazovky po spustení minihry**, nie na katalóg Minihry. Kritériom bola hustota textu, jasnosť hlavnej akcie a to, či je obsah už prirodzene dominantný cez hernú plochu, otázku alebo časovač.

| Minihra alebo spoločný tok | Rozhodnutie | Dôvod |
|---|---|---|
| **Iba nepravda** | Upravené | Pôvodná obrazovka obsahovala dlhé vysvetlenie pravidla, samostatný kruhový časovač a ďalšiu poznámku. Nový layout má jedno krátke pravidlo, časovú lištu, dominantnú otázku a jedno tlačidlo. |
| **Pravda alebo výzva** | Upravené | Dlhý úvodný popis je nahradený krátkym pokynom a dvoma veľkými voľbami. Karta Pravda/Výzva je teraz hlavný vizuálny prvok. |
| **Nikdy som nikdy** | Upravené | Odstránená je sekundárna poznámka o opakovaní kariet. Ostalo jedno krátke pravidlo, dominantný výrok a jasné pokračovanie. |
| **Čo by si radšej** | Upravené | Dve veľké protichodné voľby zostali bez zmeny, ale jemné teplo-studené pozadie a stredový predel teraz podporujú ich porovnanie bez ďalšieho textu. |
| **Hádaj emoji** | Bez zmeny | Emoji puzzle je primárnym vizuálom a ovládanie sa obmedzuje na kategóriu, odhalenie a ďalšiu kartu. |
| **Hádaj, kto som** | Upravené | Otočená herná plocha dostala tmavé cyanovo-fialové pozadie a výraznejší tieň slova; text indície ostáva dominantný a pravidlá sa nemenili. |
| **Kto dostane bombu** | Upravené | Herná fáza používa tmavočerveno-oranžový podklad, dominantnú bombu a úlohu; čas, držiteľ a odovzdanie zostávajú jadrom mechaniky. |
| **Slovné šarády** | Upravené | Funkčný layout kariet, časovača a skóre zostal nezmenený; tmavé fialové javiskové nasvietenie jasnejšie oddeľuje dominantnú slovnú kartu od ovládania. |
| **Slovný Ping Pong** | Bez zmeny | Text zobrazuje stav kola a pripravenosť hráčov; pri rýchlej reakčnej hre je informačne potrebný. |
| **Zakázané slovo, pesnička, hudobný kvíz, zvuk, slovo na písmeno, 5 za 10** | Bez zmeny | Tieto hry používajú spoločný obrazový setup a špecializované herné komponenty. Text nastavení je zbalený na hráčov/tímy, tempo a počet kôl. |
| **Piškvorky** | Bez zmeny | Jadrom je herná doska; krátky opis režimu a voľba súpera sú potrebné len pred kolom. |
| **Loďky** | Bez zmeny | Jadrom je hracia mriežka a výber lodí. Textové prvky sú nevyhnutné na prípravu a priebeh súboja. |

> Výsledkom je zjednotený vzor pre minihry s jednou otázkou alebo výrokom: **krátke pravidlo → dominantná karta obsahu → jediná primárna akcia**. Interaktívne doskové a časované hry ostali funkčne nezmenené, aby sa nepridávali zbytočné vrstvy nad hernú mechaniku.

## Overenie

Mobilný viewport 390 × 844 bol overený pre upravené obrazovky vrátane Iba nepravda, Pravda alebo výzva, Nikdy som nikdy, Hádaj, kto som, Radšej by som a Slovných šarád. Reálne desktopové aj mobilné toky prešli aj pri Slovnom ping pongu. Testy, TypeScript kontrola a produkčný build prešli úspešne.
