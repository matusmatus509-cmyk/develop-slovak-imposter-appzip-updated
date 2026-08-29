/**
 * "Animované postavičky" deck for "Hádaj kto som".
 *
 * The deck is built franchise by franchise from cartoons everybody actually
 * knows — Toy Story, Hľadá sa Nemo, SpongeBob, Shrek, Leví kráľ, Ľadové
 * kráľovstvo, Mimoni, Madagaskar, Ľadová doba, Disney classics, Looney Tunes,
 * Tom a Jerry, Šmolkovia, Simpsonovci, Medvedík Pú and the Slovak/Czech
 * classics. Every card is a character a player can name on sight.
 *
 * Deliberately excluded: deep-cut side characters, anime, and anything whose
 * name a normal player would not recognise even if they saw the film.
 *
 * Names use the form Slovak audiences know them by, matching how the rest of
 * the app already names its cards.
 */

function toon(entries: string): string[] {
  return entries
    .split("|")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/** Toy Story. */
const TOY_STORY = toon(`
Woody|Buzz Rakeťák|Jessie
`);

/** Hľadá sa Nemo. */
const FINDING_NEMO = toon(`
Nemo|Dory|Marlin
`);

/** SpongeBob. */
const SPONGEBOB = toon(`
SpongeBob|Patrik Hviezdica|Squidward|Pán Krab|Sandy Cheeks|Plankton
`);

/** Shrek. */
const SHREK = toon(`
Shrek|Fiona|Oslík|Kocúr v čižmách
`);

/** Leví kráľ. */
const LION_KING = toon(`
Simba|Nala|Timon|Pumba|Scar|Mufasa
`);

/** Ľadové kráľovstvo. */
const FROZEN = toon(`
Elsa|Anna|Olaf|Sven|Kristoff
`);

/** Ja, zloduch a Mimoni. */
const DESPICABLE_ME = toon(`
Gru|Mimoni
`);

/** Madagaskar. */
const MADAGASCAR = toon(`
Alex lev|Marty zo ZOO|Melman žirafa|Gloria hrošica|Kráľ Julien
`);

/** Ľadová doba. */
const ICE_AGE = toon(`
Sid|Manny|Diego|Scrat
`);

/** Kung Fu Panda. */
const KUNG_FU_PANDA = toon(`
Po z Kung Fu Pandy|Majster Shifu
`);

/** Ako si vycvičiť draka. */
const HOW_TO_TRAIN_YOUR_DRAGON = toon(`
Bezzubka|Štikút
`);

/** Autá. */
const CARS = toon(`
Lightning McQueen|Mater
`);

/** Ďalšie Pixar hity. */
const MORE_PIXAR = toon(`
Ratatouille Remy|WALL-E|EVE (WALL-E)|Carl Fredricksen|Russell|Radosť z V hlave|Smútok z V hlave|Mike Wazowski|Sully|Pán Úžasný|
Elastigirl|Jack-Jack
`);

/** Mickey Mouse a partia. */
const MICKEY_AND_FRIENDS = toon(`
Mickey Mouse|Minnie Mouse|Kačer Donald|Goofy|Pluto
`);

/** Klasické Disney rozprávky. */
const DISNEY_CLASSICS = toon(`
Snehulienka|Popoluška|Šípková Ruženka|Pinocchio|Peter Pan|Tinker Bell|Kapitán Hook|Bambi|Dumbo|Alica|
Mauglí|Balú
`);

/** Disney princezné a hrdinovia. */
const DISNEY_HEROES = toon(`
Ariel|Sebastián|Aladin|Džin|Jasmína|Belle (Disney)|Zviera|Rapunzel|Vaiana|Mauí|
Mulan|Mushu|Tarzan|Herkules|Stitch|Lilo|Judy Hopps|Nick Wilde
`);

/** Disney zloduchovia. */
const DISNEY_VILLAINS = toon(`
Ursula|Jafar|Cruella de Vil|Maleficent
`);

/** Looney Tunes. */
const LOONEY_TUNES = toon(`
Bugs Bunny|Daffy Duck|Tweety|Sylvester|Tasmánsky čert
`);

/** Klasické kreslené seriály. */
const CLASSIC_CARTOONS = toon(`
Tom|Jerry|Scooby-Doo|Shaggy|Fred Flintstone|Medveď Yogi|Ružový panter|Pepek námorník
`);

/** Šmolkovia. */
const SMURFS = toon(`
Šmolko|Šmolkuľa|Papa Šmolko|Gargamel
`);

/** Simpsonovci. */
const SIMPSONS = toon(`
Homer Simpson|Marge Simpsonová|Bart Simpson|Lisa Simpsonová|Maggie Simpsonová
`);

/** Family Guy, South Park a Rick and Morty. */
const ADULT_CARTOONS = toon(`
Peter Griffin|Stewie Griffin|Brian Griffin|Eric Cartman|Kenny McCormick|Rick Sanchez|Morty Smith
`);

/** Medvedík Pú. */
const WINNIE_THE_POOH = toon(`
Macko Puf|Prasiatko|Tiger|Ijáčik
`);

/** Včielka Maja je európska klasika, poznajú ju aj ostatné jazyky. */
const EUROPEAN_CLASSICS = toon(`
Včielka Maja
`);

/** Komiksové a ďalšie známe postavičky. */
const OTHER_FAMOUS = toon(`
Garfield|Snoopy|Pikachu|Ash Ketchum|Dracula z Hotela Transylvánia|Grinch|Megamozog
`);

/**
 * Final animated characters deck.
 * Order is stable and duplicates are removed so the deck can be diffed easily.
 */
export const ANIMATED_CHARACTERS: string[] = [
  ...new Set([
    ...TOY_STORY,
    ...FINDING_NEMO,
    ...SPONGEBOB,
    ...SHREK,
    ...LION_KING,
    ...FROZEN,
    ...DESPICABLE_ME,
    ...MADAGASCAR,
    ...ICE_AGE,
    ...KUNG_FU_PANDA,
    ...HOW_TO_TRAIN_YOUR_DRAGON,
    ...CARS,
    ...MORE_PIXAR,
    ...MICKEY_AND_FRIENDS,
    ...DISNEY_CLASSICS,
    ...DISNEY_HEROES,
    ...DISNEY_VILLAINS,
    ...LOONEY_TUNES,
    ...CLASSIC_CARTOONS,
    ...SMURFS,
    ...SIMPSONS,
    ...ADULT_CARTOONS,
    ...WINNIE_THE_POOH,
    ...EUROPEAN_CLASSICS,
    ...OTHER_FAMOUS,
  ]),
];

/**
 * Slovak and Czech cartoon classics.
 *
 * These are only added to the Slovak deck. A player using English, German,
 * Spanish, French or Portuguese would have no chance of guessing Maťko a Kubko
 * or Bob a Bobek, so the other languages never see them.
 */
export const ANIMATED_CHARACTERS_SK_ONLY: string[] = toon(`
Krtko|Pat a Mat|Bob a Bobek|Maťko a Kubko|Macko Uško
`);
