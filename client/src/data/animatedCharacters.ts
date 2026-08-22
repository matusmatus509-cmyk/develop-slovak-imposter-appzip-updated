/**
 * "Animované postavičky" deck for "Hádaj kto som".
 *
 * The deck is deliberately kept to characters a regular viewer actually
 * recognises: classic Disney fairy tales, Disney Renaissance and modern
 * films, Pixar, DreamWorks, Illumination, Looney Tunes, Hanna-Barbera,
 * SpongeBob, The Simpsons, Winnie the Pooh, Slovak/Czech cartoon classics,
 * Peanuts/Garfield, Pokémon, a couple of globally known anime icons, and a
 * handful of other mainstream cartoon casts. Obscure, deep-cut characters are
 * intentionally left out.
 *
 * Names are kept in the form Slovak audiences actually know them by — some
 * international (Mickey Mouse, Shrek), some dubbed (Kačer Donald, Bezzubka) —
 * matching how the rest of the app already names its cards.
 */

function toon(entries: string): string[] {
  return entries
    .split("|")
    .map(entry => entry.trim())
    .filter(Boolean);
}

/** Klasické Disney rozprávky. */
const DISNEY_CLASSIC_FAIRY_TALES = toon(`
Snehulienka|Popoluška|Šípková Ruženka|Alica|Šialený klobučník|Kráľovná Srdcová|Biely králik|Peter Pan|Tinker Bell|Kapitán Hook|
Pinocchio|Gepetto|Bambi|Dumbo|Mauglí|Balú|Baghíra|Šér Chán|Kráľ Ľudovít|Kocúr v čižmách|
Robin Hood|Pongo|Perdita|Cruella de Vil
`);

/** Disney renesancia. */
const DISNEY_RENAISSANCE = toon(`
Ariel|Sebastián|Flounder|Ursula|Kráľ Triton|Belle|Zviera|Gaston|Lumiere|Aladin|
Džin|Jasmína|Jafar|Simba|Nala|Timon|Pumba|Scar|Mufasa|Pocahontas|
Meeko|Quasimodo|Esmeralda|Herkules|Megara|Mulan|Mushu|Tarzan|Jane
`);

/** Moderné Disney filmy. */
const DISNEY_MODERN = toon(`
Elsa|Anna|Olaf|Sven|Kristoff|Rapunzel|Flynn Rider|Moana|Mauí|Miguel z Encanto|
Mirabel|Judy Hopps|Nick Wilde|Vanellope|Raya|Wish – Asha|Baymax|Hiro
`);

/** Pixar. */
const PIXAR = toon(`
Woody|Buzz Rakeťák|Jessie|Rex|Zemiakova hlava|Nemo|Dory|Marlin|Mike Wazowski|Sully|
Lightning McQueen|Mater|Ratatouille Remy|WALL-E|EVE|Carl Fredricksen|Russell|Merida|Radosť|Smútok|
Riley|Luca|Alberto
`);

/** DreamWorks. */
const DREAMWORKS = toon(`
Shrek|Fiona|Oslík|Kráľ Julien|Marty zo ZOO|Alex lev|Gloria hrošica|Melman žirafa|Po z Kung Fu Pandy|Majster Shifu|
Bezzubka|Štikút|Poppy z Trolls|Branch z Trolls
`);

/** Illumination. */
const ILLUMINATION = toon(`
Gru|Mimoni Kevin|Mimoni Stuart|Mimoni Bob|Megamozog|Buddy zo Sing|Max zo Secret Life of Pets|Grinch|Lorax|Mario zo Super Mario filmu
`);

/** Looney Tunes. */
const LOONEY_TUNES = toon(`
Bugs Bunny|Daffy Duck|Tweety|Sylvester|Tasmánsky čert|Porky Pig|Cestár|Vlk Wile E. Coyote|Elmer Fudd|Speedy Gonzales|
Marvin Marťan
`);

/** Klasické Disney krátke filmy. */
const CLASSIC_DISNEY_SHORTS = toon(`
Mickey Mouse|Minnie Mouse|Kačer Donald|Goofy|Pluto|Kačica Daisy|Čip a Dale
`);

/** Hanna-Barbera a klasické kreslené seriály. */
const HANNA_BARBERA = toon(`
Tom|Jerry|Scooby-Doo|Shaggy|Fred Flintstone|Vilma Flintstoneová|Medveď Yogi|Ružový panter
`);

/** SpongeBob. */
const SPONGEBOB = toon(`
SpongeBob|Patrik Hviezdica|Squidward|Pán Krab|Sandy|Plankton|Garry
`);

/** The Simpsons. */
const SIMPSONS = toon(`
Homer Simpson|Marge Simpsonová|Bart Simpson|Lisa Simpsonová|Maggie Simpsonová|Ned Flanders|Krusty Klaun
`);

/** Family Guy. */
const FAMILY_GUY = toon(`
Peter Griffin|Stewie Griffin|Brian Griffin|Lois Griffinová
`);

/** South Park. */
const SOUTH_PARK = toon(`
Eric Cartman|Kenny McCormick|Stan Marsh|Kyle Broflovski
`);

/** Medvedík Pú. */
const WINNIE_THE_POOH = toon(`
Macko Puf|Prasiatko|Tiger|Ijáčik|Sova|Klokanica Kanga|Klokanček Roo
`);

/** Slovenská a česká kreslená klasika. */
const SLOVAK_CZECH_CLASSICS = toon(`
Krtko|Včielka Maja|Vilko|Pat|Mat|Lolek|Bolek|Bob|Bobek
`);

/** Peanuts a Garfield. */
const PEANUTS_AND_GARFIELD = toon(`
Garfield|Odie|Snoopy|Charlie Brown|Woodstock
`);

/** Pokémon. */
const POKEMON = toon(`
Pikachu|Ash Ketchum|Misty|Meowth|Jigglypuff
`);

/** Studio Ghibli. */
const STUDIO_GHIBLI = toon(`
Totoro|Bezmenná bytosť
`);

/** Svetovo známe anime postavičky. */
const GLOBAL_ANIME_ICONS = toon(`
Doraemon|Son Goku|Naruto Uzumaki|Luffy|Sailor Moon
`);

/** Ninja Turtles. */
const NINJA_TURTLES = toon(`
Leonardo|Michelangelo|Donatello|Raphael|Splinter
`);

/** Powerpuff Girls. */
const POWERPUFF_GIRLS = toon(`
Blossom|Bubbles|Buttercup
`);

/** Adventure Time. */
const ADVENTURE_TIME = toon(`
Finn|Jake
`);

/** My Little Pony. */
const MY_LITTLE_PONY = toon(`
Twilight Sparkle|Rainbow Dash|Pinkie Pie
`);

/** Avatar. */
const AVATAR_UNIVERSE = toon(`
Aang|Korra
`);

/**
 * Final animated characters deck.
 * Order is stable and duplicates are removed so the deck can be diffed easily.
 */
export const ANIMATED_CHARACTERS: string[] = [
  ...new Set([
    ...DISNEY_CLASSIC_FAIRY_TALES,
    ...DISNEY_RENAISSANCE,
    ...DISNEY_MODERN,
    ...PIXAR,
    ...DREAMWORKS,
    ...ILLUMINATION,
    ...LOONEY_TUNES,
    ...CLASSIC_DISNEY_SHORTS,
    ...HANNA_BARBERA,
    ...SPONGEBOB,
    ...SIMPSONS,
    ...FAMILY_GUY,
    ...SOUTH_PARK,
    ...WINNIE_THE_POOH,
    ...SLOVAK_CZECH_CLASSICS,
    ...PEANUTS_AND_GARFIELD,
    ...POKEMON,
    ...STUDIO_GHIBLI,
    ...GLOBAL_ANIME_ICONS,
    ...NINJA_TURTLES,
    ...POWERPUFF_GIRLS,
    ...ADVENTURE_TIME,
    ...MY_LITTLE_PONY,
    ...AVATAR_UNIVERSE,
  ]),
];
