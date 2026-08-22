/**
 * Marvel deck for "Hádaj kto som".
 *
 * The deck is deliberately kept small and mainstream: only characters a regular
 * Marvel viewer actually recognises from the movies, the big series and the
 * classic cartoons. Deep comic-book cuts are intentionally left out, because an
 * unrecognisable card kills the round instead of making it fun.
 *
 * Names are kept in their internationally recognised form so the deck works in
 * every app language without a separate translation table.
 */

function marvel(entries: string): string[] {
  return entries
    .split("|")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/** Avengers a hlavní hrdinovia. */
const AVENGERS_AND_HEROES = marvel(`
Iron Man|Captain America|Thor|Hulk|Black Widow|Hawkeye|Ant-Man|Wasp|Vision|Scarlet Witch|
Falcon|Winter Soldier|War Machine|Doctor Strange|Black Panther|Captain Marvel|Spider-Man|She-Hulk|Ms. Marvel|Shang-Chi|
Quicksilver|Valkyrie|Nova|Moon Knight|Blade|Daredevil|Elektra|Punisher|Ghost Rider|Iron Fist|
Luke Cage|Jessica Jones|Silver Surfer|Namor|Yelena Belova|Kate Bishop|America Chavez|Ironheart|Cassie Lang|Monica Rambeau|
Wong|The Ancient One|Agatha Harkness|Korg|Sylvie|Echo
`);

/** Guardians of the Galaxy. */
const GUARDIANS = marvel(`
Star-Lord|Gamora|Drax the Destroyer|Rocket Raccoon|Groot|Mantis|Nebula|Yondu|Adam Warlock|Cosmo the Spacedog|
Goose the Flerken
`);

/** X-Men a mutanti. */
const X_MEN = marvel(`
Professor X|Cyclops|Jean Grey|Storm|Wolverine|Beast|Iceman|Nightcrawler|Colossus|Rogue|
Gambit|Jubilee|Psylocke|Bishop|Cable|Domino|Deadpool|Shadowcat|Emma Frost|Havok|
X-23|Magik|Negasonic Teenage Warhead
`);

/** Fantastic Four. */
const FANTASTIC_FOUR = marvel(`
Mister Fantastic|Invisible Woman|Human Torch|The Thing
`);

/** Spider-Manov svet: hrdinovia, priatelia a rodina. */
const SPIDER_VERSE = marvel(`
Miles Morales|Spider-Gwen|Spider-Man 2099|Spider-Ham|Spider-Man Noir|Peni Parker|Silk|Black Cat|Madame Web|Mary Jane Watson|
Gwen Stacy|Aunt May|Uncle Ben|J. Jonah Jameson|Harry Osborn|Ned Leeds|Flash Thompson|Prowler
`);

/** Asgard a bohovia. */
const ASGARD_AND_GODS = marvel(`
Odin|Loki|Frigga|Heimdall|Sif|Hela|Surtur|Malekith|Volstagg|Fandral|
Hogun|Jane Foster|Skurge|Enchantress|Gorr the God Butcher|Zeus|Khonshu
`);

/** Eternals a Inhumans. */
const ETERNALS_AND_INHUMANS = marvel(`
Ikaris|Sersi|Black Bolt|Medusa|Lockjaw
`);

/** Zloduchovia. */
const VILLAINS = marvel(`
Thanos|Red Skull|Ultron|Doctor Doom|Kang the Conqueror|He Who Remains|Galactus|Green Goblin|Doctor Octopus|Venom|
Carnage|Sandman|Electro|Vulture|Mysterio|Kraven the Hunter|Rhino|Scorpion|Lizard|Shocker|
Morbius|Kingpin|The Spot|Magneto|Apocalypse|Mystique|Sabretooth|Juggernaut|Mister Sinister|Toad|
Pyro|Silver Samurai|Baron Zemo|Baron Mordo|Dormammu|Kaecilius|Mephisto|Abomination|The Leader|Crossbones|
Arnim Zola|M.O.D.O.K.|Mandarin|Iron Monger|Whiplash|Killmonger|Taskmaster|Bullseye|Ebony Maw|Corvus Glaive|
Proxima Midnight|High Evolutionary|Ronan the Accuser|Titania|Xu Wenwu|Ghost|Yellowjacket|Klaw
`);

/** Kozmické bytosti a známe vedľajšie postavy. */
const COSMIC_AND_SUPPORTING = marvel(`
The Watcher|The Collector|The Grandmaster|Ego the Living Planet|Miss Minutes|Mobius M. Mobius|Nick Fury|Maria Hill|Phil Coulson|Peggy Carter|
Howard Stark|Pepper Potts|Happy Hogan|Shuri|Okoye|M'Baku|Thunderbolt Ross|Valentina Allegra de Fontaine
`);

/**
 * Final Marvel deck.
 * Order is stable and duplicates are removed so the deck can be diffed easily.
 */
export const MARVEL_CHARACTERS: string[] = [
  ...new Set([
    ...AVENGERS_AND_HEROES,
    ...GUARDIANS,
    ...X_MEN,
    ...FANTASTIC_FOUR,
    ...SPIDER_VERSE,
    ...ASGARD_AND_GODS,
    ...ETERNALS_AND_INHUMANS,
    ...VILLAINS,
    ...COSMIC_AND_SUPPORTING,
  ]),
];
