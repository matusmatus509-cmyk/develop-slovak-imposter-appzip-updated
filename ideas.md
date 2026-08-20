# Dizajnové smerovanie: Podvodník — Párty hry

## Tri zvažované prístupy

### Prístup A
**Theme Name:** Nočný herný salón

**Very Brief Intro:** Tmavý mobilný herný priestor s výraznými 3D kartami, klubovým svetlom a filmovou atmosférou. Má pôsobiť ako dobre pripravený večer s partiou, nie ako bežná zbierka mobilných minihier.

**Probability:** 0.07

### Prístup B
**Theme Name:** Papierová párty dielňa

**Very Brief Intro:** Teplý, ilustratívny svet kartičiek, fixiek a ručne kreslených rekvizít. Prístup kladie dôraz na spontánnosť a domáce hranie pri stole.

**Probability:** 0.04

### Prístup C
**Theme Name:** Tichý spoločenský klub

**Very Brief Intro:** Sofistikované rozhranie v atramentovej modrej, vínovej a mosadznej s jemnými textúrami. Zdôrazňuje konverzáciu, pravidlá a pokojnejší večerný rytmus.

**Probability:** 0.09

## Vybraný prístup: Nočný herný salón

### Design Movement

Prémiový **cinematic game UI** s filmovým svetlom, tmavými povrchmi a hmatateľne pôsobiacimi 3D kartami. Dizajn nadväzuje na existujúce herné vizuály a premení ich na súdržný digitálny priestor pre živú partiu.

### Core Principles

1. Každá hra má vlastný výrazný vizuálny motív, ktorý je čitateľný aj v úzkom mobilnom výreze.
2. Rozhranie prioritizuje okamžité spustenie hry pred dekoráciou alebo zbytočnými nastaveniami.
3. Svetlo, jemné presahy a materiálové povrchy dávajú kartám hĺbku bez preplnenia.
4. Všetky cesty v aplikácii musia mať jasný návrat a zrozumiteľné primárne tlačidlo.

### Color Philosophy

Základ tvorí takmer čierna atramentová modrá, ktorá funguje ako pokojné pozadie pre svetelné akcenty. Jednotlivé hry používajú vlastnú farbu ako orientačný signál, nie ako plošnú výplň: neonová modrá pre rýchle kvízy, malinová pre odvážne otázky, fialová pre slová a oranžová pre napätie. Tmavé pozadie chráni kontrast bieleho textu a umožňuje vizuálom prirodzene žiariť.

### Layout Paradigm

Rozhranie sa skladá ako **herný stolík**: výrazný úvodný panel, za ním radené herné karty v jednom čitateľnom vertikálnom prúde. Na väčších obrazovkách sa obsah rozšíri do dvoch stĺpcov, no primárne rozhodovanie vždy zostáva lineárne a palcom ovládateľné.

### Signature Elements

1. Osvetlený farebný pruh na ľavom okraji hernej karty.
2. Filmový prechod z obrázka do tmavého povrchu cez jemný gradient.
3. Malé informačné štítky pre počet hráčov a trvanie v široko rozostúpených veľkých písmenách.

### Interaction Philosophy

Každá karta je jednoznačne klikateľná plachta s veľkou dotykovou zónou. Obľúbené hry sú doplnkové, vizuálne tiché ovládanie. Používateľ vidí okamžitú odozvu pri dotyku, bez rušivých dlhých animácií.

### Animation

Karty pri vstupe jemne nastupujú zospodu v 40–70 ms kaskáde. Pri hoveri alebo fokuse sa obrázok posunie najviac o 3,5 % a karta zvýrazní svoj farebný okraj. Všetky prechody trvajú 160–260 ms s krivkou `cubic-bezier(0.23, 1, 0.32, 1)` a rešpektujú `prefers-reduced-motion`.

### Typography System

Headliny používajú **Space Grotesk** v 700–800 váhe pre súčasný herný charakter; text rozhrania používa **DM Sans** v 400–700 váhe pre dobú čitateľnosť. Názvy hier sú kompaktné a silné, metadáta sú malé, veľkými písmenami a s výrazným rozostupom.

### Brand Essence

**Podvodník je svižná slovenská zbierka párty hier pre skupiny, ktoré chcú začať hrať skôr, než si stihnú vybrať pravidlá.**

Osobnosť: energická, vtipná, sústredená.

### Brand Voice

Nadpisy sú priame a vytvárajú očakávanie; tlačidlá vyzývajú ku konkrétnemu kroku bez marketingovej vaty. Príklady: „Zavolaj partiu. Zvyšok je hra.“ a „Jedna karta, rýchla odpoveď, veľký smiech.“

### Wordmark & Logo

Značka používa znak dvoch prekrývajúcich sa hracích kariet, kde jedna má výrez v tvare otázniku a druhá diskrétny šikmý pruh. Znak musí fungovať samostatne ako favicon aj ako veľká ikona v hlavičke; textový názov je typografický doplnok, nie náhrada symbolu.

### Signature Brand Color

**Elektrická malina `#fb4e82`** je vlastná akcentová farba značky: teplá, zábavná a dobre čitateľná na atramentovom pozadí.

## Style Decisions

- Zachovať existujúcu tmavú mobilnú hernú logiku a funkčné herné toky počas migrácie.
- Pre všetky obrázky použiť hostované mediálne URL; zdrojové súbory nesmú zostať v priečinku webového projektu.
- Nepridávať falošné recenzie, hodnotenia ani používateľské odporúčania.
- Hlavička musí pomenovať produkt **Podvodník**; „Párty hry“ je iba opis kategórie.
- Každá primárna herná karta má svietiaci farebný ľavý okraj, filmový prechod do tmavej vrstvy a veľké metadátové štítky.
- Elektrická malina `#fb4e82` vedie značku v logu, hlavnom copy a prioritných vstupoch; ostatné farby rozlišujú konkrétne herné režimy.
- Menu minihier sa člení na štyri herné kapitoly namiesto jedného dlhého rovnakého zoznamu: rozohriatie partie, slová a postreh, hudba a výzvy, klasiky pri stole.
- Každá karta má vlastný akcent podľa hernej nálady; akcent sa opakuje len ako orientačný pruh, štítok a jemný svetelný odlesk, nikdy nie ako plošná výplň.
- Prvá karta dvoch hlavných kapitol má na väčších obrazovkách výraznejší formát, aby katalóg získal rytmus a nepôsobil ako šablónová mriežka.
- Domovská hlavička vždy ukazuje znak dvoch prekrývajúcich sa kariet spolu s názvom Podvodník; „Párty hry“ ostáva iba doplnkový opis.
- Viditeľné navigácie, akcie a štítky používajú energickú slovenčinu, s výnimkou úmyselne značkovaných názvov hier.
- Pred prvým posunom je zreteľná atmosféra nočného herného stolíka: atramentové pozadie, elektrická malina, svietiaci farebný okraj a hmatateľný 3D herný vizuál.
