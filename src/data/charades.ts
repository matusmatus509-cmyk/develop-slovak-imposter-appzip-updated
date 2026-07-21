import {
  SOLO_CHARADES_EASY_EXTRA,
  SOLO_CHARADES_HARD_EXTRA,
  SOLO_CHARADES_MEDIUM_EXTRA,
} from "./charadesExtra.ts";

export type CharadesDifficulty = "lahke" | "stredne" | "tazke";

function uniqueWords(words: string[]): string[] {
  const seen = new Set<string>();
  return words.filter((word) => {
    const key = word.trim().toLocaleLowerCase("sk");
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Samostatná minihra má vlastný balík. Tieto slová nepoužíva Imposter ani
// tímový režim, takže zmeny v jednej hre nemôžu vyprázdniť inú hru.
export const SOLO_CHARADES_WORDS: Record<CharadesDifficulty, string[]> = {
  lahke: uniqueWords([
    "Pes", "Mačka", "Slon", "Žirafa", "Tučniak", "Delfín", "Motýľ", "Včela", "Korytnačka", "Papagáj",
    "Jablko", "Banán", "Pizza", "Palacinka", "Zmrzlina", "Čokoláda", "Hamburger", "Špagety", "Melón", "Mrkva",
    "Stolička", "Posteľ", "Zrkadlo", "Kľúč", "Dáždnik", "Kufor", "Batoh", "Hodiny", "Sviečka", "Vankúš",
    "Auto", "Bicykel", "Vlak", "Lietadlo", "Loď", "Traktor", "Kolobežka", "Autobus", "Motorka", "Helikoptéra",
    "Futbal", "Tenis", "Hokej", "Plávanie", "Lyžovanie", "Box", "Golf", "Basketbal", "Volejbal", "Korčuľovanie",
    "Lekár", "Učiteľ", "Kuchár", "Policajt", "Hasič", "Kaderník", "Pilot", "Pekár", "Maliar", "Záhradník",
    "Králik", "Kôň", "Opica", "Lev", "Tiger", "Medveď", "Žaba", "Had", "Krokodíl", "Sova",
    "Hruška", "Pomaranč", "Jahoda", "Ananás", "Hrozno", "Chlieb", "Syr", "Koláč", "Polievka", "Klobása",
    "Televízor", "Chladnička", "Lyžica", "Vidlička", "Kniha", "Lampa", "Kefa", "Uterák", "Telefón", "Okuliare",
    "Spevák", "Herec", "Poštár", "Čašník", "Farmár", "Veterinár", "Sudca", "Predavač", "Stavbár", "Fotograf",
    ...SOLO_CHARADES_EASY_EXTRA,
  ]),
  stredne: uniqueWords([
    "Budík", "Vysávač", "Práčka", "Mikrovlnka", "Kávovar", "Ventilátor", "Diaľkový ovládač", "Nabíjačka", "Slúchadlá", "Fotoaparát",
    "Semafor", "Kruhový objazd", "Čerpacia stanica", "Letisková hala", "Železničné nástupište", "Parkovací automat", "Horská lanovka", "Záchranný čln", "Dopravná zápcha", "Hraničný priechod",
    "Narodeninová oslava", "Svadobná hostina", "Školský výlet", "Rodinný piknik", "Vianočný stromček", "Veľkonočná oblievačka", "Novoročný ohňostroj", "Hudobný festival", "Futbalový zápas", "Filmová premiéra",
    "Objednávanie jedla", "Balenie darčeka", "Venčenie psa", "Umývanie okien", "Žehlenie košele", "Sadenie kvetov", "Pečenie koláča", "Čistenie zubov", "Telefonický rozhovor", "Nakupovanie oblečenia",
    "Detektív", "Archeológ", "Astronaut", "Fotograf", "Moderátor", "Zubár", "Mechanik", "Záchranár", "Kúzelník", "Dirigent",
    "Tajná chodba", "Stratený poklad", "Opustený ostrov", "Horská chata", "Podmorský svet", "Strašidelný dom", "Kráľovský palác", "Vesmírna stanica", "Džungľová výprava", "Čarovný les",
    "Výmena pneumatiky", "Stavanie stanu", "Kosenie trávnika", "Maľovanie steny", "Skladanie nábytku", "Hľadanie signálu", "Rezervácia hotela", "Kontrola lístka", "Rozbaľovanie balíka", "Fotografovanie západu slnka",
    "Pracovný pohovor", "Maturitná skúška", "Promócie", "Stužková slávnosť", "Rozlúčka so slobodou", "Triedne stretnutie", "Silvestrovská párty", "Letná dovolenka", "Detská besiedka", "Nedeľný obed",
    "Meteorológ", "Architekt", "Tlmočník", "Novinár", "Režisér", "Knihovník", "Laborant", "Dispečer", "Tréner", "Scenárista",
    "Pirátska loď", "Ľadový palác", "Podzemné mesto", "Tropická búrka", "Tajné laboratórium", "Časostroj", "Lietajúci koberec", "Zakliaty hrad", "Mimozemská planéta", "Zabudnutá civilizácia",
    ...SOLO_CHARADES_MEDIUM_EXTRA,
  ]),
  tazke: uniqueWords([
    "Trpezlivosť", "Zvedavosť", "Nedôvera", "Odvaha", "Spravodlivosť", "Žiarlivosť", "Tvorivosť", "Zodpovednosť", "Sloboda", "Nádej",
    "Prvý dojem", "Slepá ulička", "Ticho pred búrkou", "Ihla v kope sena", "Mať hlavu v oblakoch", "Chodiť okolo horúcej kaše", "Držať jazyk za zubami", "Kúpiť mačku vo vreci", "Byť za vodou", "Hádzať flintu do žita",
    "Časový paradox", "Umelá inteligencia", "Klimatická zmena", "Teória relativity", "Gravitačná sila", "Slnečné zatmenie", "Evolučná teória", "Virtuálna realita", "Genetická informácia", "Obnoviteľná energia",
    "Diplomatické rokovanie", "Tlačová konferencia", "Volebná kampaň", "Súdne pojednávanie", "Vedecký experiment", "Historický prevrat", "Ekonomická kríza", "Kultúrne dedičstvo", "Medzinárodná dohoda", "Verejná mienka",
    "Nečakané stretnutie", "Stratená príležitosť", "Zakázané tajomstvo", "Morálna dilema", "Dokonalé alibi", "Falošná stopa", "Osudové rozhodnutie", "Dvojitý agent", "Posledná nádej", "Nevyriešená záhada",
    "Búrka v pohári vody", "Kameň úrazu", "Medvedia služba", "Achillova päta", "Danajský dar", "Pyrrhovo víťazstvo", "Začarovaný kruh", "Labutia pieseň", "Tantalove muky", "Pandorina skrinka",
    "Svedomie", "Predsudok", "Sebavedomie", "Nostalgia", "Solidarita", "Pokrytectvo", "Tolerancia", "Intuícia", "Ambícia", "Disciplína",
    "Za päť minút dvanásť", "Mať maslo na hlave", "Prilievať olej do ohňa", "Robiť z komára somára", "Vziať nohy na plecia", "Trafiť klinec po hlavičke", "Mať oči na stopkách", "Ostať na ocot", "Nosiť drevo do lesa", "Bod zlomu",
    "Kvantová fyzika", "Čierna diera", "Fotosyntéza", "Tektonická doska", "Prirodzený výber", "Elektromagnetické pole", "Kozmické žiarenie", "Reťazová reakcia", "Biologická rovnováha", "Digitálna stopa",
    "Stratená pamäť", "Utajená identita", "Posledný svedok", "Nemožná misia", "Nevinný podozrivý", "Záhadný odkaz", "Nečakaný spojenec", "Tajný vchod", "Falošné obvinenie", "Dokonalý podvod",
    ...SOLO_CHARADES_HARD_EXTRA,
  ]),
};

// Tímová hra používa druhý, samostatný balík. Zámerne nie je vytvorený zo
// SOLO_CHARADES_WORDS, aby obe hry mali nezávislé zásoby a poradie.
export const TEAM_CHARADES_WORDS: Record<CharadesDifficulty, string[]> = {
  lahke: [
    "Lev", "Tiger", "Opica", "Zebra", "Krokodíl", "Žaba", "Králik", "Veverička", "Medveď", "Sova",
    "Hruška", "Pomaranč", "Chlieb", "Syr", "Polievka", "Ryža", "Koláč", "Klobása", "Ananás", "Uhorka",
    "Stôl", "Skriňa", "Televízor", "Chladnička", "Lyžica", "Vidlička", "Kefa", "Uterák", "Lampa", "Kniha",
    "Električka", "Metro", "Taxík", "Rakieta", "Ponorka", "Karavan", "Nákladné auto", "Výťah", "Kočík", "Trajekt",
    "Beh", "Cyklistika", "Šach", "Bowling", "Šípky", "Surfovanie", "Skok do výšky", "Stolný tenis", "Gymnastika", "Rybárčenie",
    "Herec", "Spevák", "Farmár", "Poštár", "Sudca", "Čašník", "Predavač", "Veterinár", "Programátor", "Stavbár",
  ],
  stredne: [
    "Umývačka riadu", "Elektrická kolobežka", "Bezdrôtová myš", "Herná konzola", "Inteligentné hodinky", "Solárny panel", "Požiarny hlásič", "Nákupný vozík", "Kancelárska tlačiareň", "Robotický vysávač",
    "Autobusová zastávka", "Diaľničný tunel", "Podzemná garáž", "Prístavný maják", "Lyžiarske stredisko", "Mestská knižnica", "Nákupné centrum", "Futbalový štadión", "Botanická záhrada", "Zábavný park",
    "Promócie", "Stužková slávnosť", "Rozlúčka so slobodou", "Detská besiedka", "Maturitná skúška", "Pracovný pohovor", "Triedne stretnutie", "Nedeľný obed", "Letná dovolenka", "Silvestrovská párty",
    "Výmena pneumatiky", "Stavanie stanu", "Kosenie trávnika", "Maľovanie steny", "Skladanie nábytku", "Hľadanie signálu", "Rezervácia hotela", "Kontrola lístka", "Fotografovanie západu slnka", "Rozbaľovanie balíka",
    "Meteorológ", "Geológ", "Architekt", "Tlmočník", "Novinár", "Režisér", "Knihovník", "Laborant", "Dispečer", "Tréner",
    "Pirátska loď", "Ľadový palác", "Podzemné mesto", "Tropická búrka", "Zabudnutá civilizácia", "Tajné laboratórium", "Časostroj", "Lietajúci koberec", "Zakliaty hrad", "Mimozemská planéta",
  ],
  tazke: [
    "Svedomie", "Predsudok", "Sebavedomie", "Nostalgia", "Solidarita", "Pokrytectvo", "Tolerancia", "Intuícia", "Ambícia", "Disciplína",
    "Bod zlomu", "Za päť minút dvanásť", "Mať maslo na hlave", "Prilievať olej do ohňa", "Nosiť drevo do lesa", "Robiť z komára somára", "Vziať nohy na plecia", "Trafiť klinec po hlavičke", "Mať oči na stopkách", "Ostať na ocot",
    "Kvantová fyzika", "Čierna diera", "Fotosyntéza", "Tektonická doska", "Prirodzený výber", "Elektromagnetické pole", "Kozmické žiarenie", "Reťazová reakcia", "Biologická rovnováha", "Digitálna stopa",
    "Mierová konferencia", "Ústavný zákon", "Priemyselná revolúcia", "Humanitárna pomoc", "Menová reforma", "Občianska neposlušnosť", "Sloboda prejavu", "Ochrana súkromia", "Konflikt záujmov", "Prezumpcia neviny",
    "Stratená pamäť", "Dokonalý podvod", "Utajená identita", "Posledný svedok", "Nemožná misia", "Nevinný podozrivý", "Záhadný odkaz", "Nečakaný spojenec", "Tajný vchod", "Falošné obvinenie",
    "Zakázané ovocie", "Jablko sváru", "Damoklov meč", "Sizyfovská práca", "Trójsky kôň", "Šalamúnske rozhodnutie", "Kolumbovo vajce", "Gordický uzol", "Ariadnina niť", "Prokrustovo lôžko",
  ],
};

export const ALL_SOLO_CHARADES_WORDS = uniqueWords(Object.values(SOLO_CHARADES_WORDS).flat());
export const ALL_TEAM_CHARADES_WORDS = Object.values(TEAM_CHARADES_WORDS).flat();
