/**
 * Marvel deck for "Hádaj kto som".
 *
 * Every entry is a real Marvel character: heroes, anti-heroes, villains,
 * supporting cast and cosmic beings from the comics, movies and series.
 * Names are kept in their internationally recognised form so the deck works in
 * every app language without a separate translation table.
 */

function marvel(entries: string): string[] {
  return entries
    .split("|")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/** Avengers a najznámejší hrdinovia. */
const AVENGERS_AND_HEROES = marvel(`
Iron Man|Captain America|Thor|Hulk|Black Widow|Hawkeye|Ant-Man|Wasp|Vision|Scarlet Witch|
Falcon|Winter Soldier|War Machine|Doctor Strange|Black Panther|Captain Marvel|Spider-Man|She-Hulk|Ms. Marvel|Shang-Chi|
Quicksilver|Wonder Man|Mockingbird|Tigra|Black Knight|Sentry|Nova|Valkyrie|Hellcat|Spider-Woman|
Namor|Silver Surfer|Moon Knight|Blade|Daredevil|Elektra|Punisher|Ghost Rider|Iron Fist|Luke Cage|
Jessica Jones|Doctor Voodoo|Wong|Clea|The Ancient One|Agatha Harkness|America Chavez|Kate Bishop|Yelena Belova|Red Guardian|
U.S. Agent|Monica Rambeau|Hank Pym|Janet van Dyne|Cassie Lang|Ironheart|Amadeus Cho|Squirrel Girl|Skaar|Echo|
Blue Marvel|Nighthawk|Hyperion|Doctor Spectrum|Power Princess|Machine Man|Jocasta|Living Lightning|Stingray|Triathlon|
Silverclaw|Gorilla-Man|Marvel Boy|Prodigy|Wiccan|Speed|Hulkling|Patriot|Iron Lad|Isaiah Bradley|
Songbird|Moonstone|Atlas|Jolt|Darkhawk|Sleepwalker|Speedball|Night Thrasher|Justice|Firestar|
Rage|Silhouette|Paladin|Sasquatch|Guardian|Snowbird|Puck|Shaman|Union Jack|Spitfire|
Captain Britain|Meggan|Pete Wisdom|Ka-Zar|Zabu|Shanna the She-Devil|White Tiger|Misty Knight|Colleen Wing|Silver Sable|
Cloak|Dagger|Man-Thing|Werewolf by Night|Elsa Bloodstone|Howard the Duck|Moon Girl|Devil Dinosaur|Rocket Racer|Puma|
Nico Minoru|Karolina Dean|Chase Stein|Gert Yorkes|Molly Hayes|Old Lace|Layla El-Faouly|Star Brand|Nightmask|Two-Gun Kid
`);

/** X-Men, New Mutants, X-Force a ďalší mutanti. */
const X_MEN_AND_MUTANTS = marvel(`
Professor X|Cyclops|Jean Grey|Storm|Wolverine|Beast|Iceman|Nightcrawler|Colossus|Rogue|
Gambit|Jubilee|Psylocke|Bishop|Cable|Domino|Deadpool|Shadowcat|Emma Frost|Angel|
Banshee|Havok|Polaris|Sunfire|Forge|Dazzler|Northstar|Aurora|Multiple Man|Siryn|
Cannonball|Sunspot|Magik|Mirage|Karma|Cypher|Wolfsbane|X-23|Honey Badger|Legion|
Hope Summers|Warpath|Thunderbird|Caliban|Morph|Fantomex|Shatterstar|Rictor|Feral|Boom-Boom|
Marrow|Chamber|Husk|Penance|Mimic|Maggott|Kid Omega|Pixie|Armor|Anole|
Rockslide|Dust|Surge|Elixir|Hellion|Mercury|Wind Dancer|Blindfold|Goldballs|Triage|
Random|Strong Guy|Wolfcub|Warlock|Doop|Sage|Callisto|Leech|Jumbo Carnation|Rachel Summers|
Nate Grey|Negasonic Teenage Warhead|Yukio|Firefist|Copycat|Blind Al|Weasel|Dopinder|Lady Deadpool|Dogpool
`);

/** Fantastic Four a ich svet. */
const FANTASTIC_FOUR_WORLD = marvel(`
Mister Fantastic|Invisible Woman|Human Torch|The Thing|Franklin Richards|Valeria Richards|H.E.R.B.I.E.|Alicia Masters|Impossible Man|Lyja|
Mole Man|Puppet Master|Wizard|Diablo|Psycho-Man|Molecule Man|Super-Skrull|Blastaar|Terrax|Firelord
`);

/** Spider-Manov svet: hrdinovia, priatelia a rodina. */
const SPIDER_VERSE_HEROES = marvel(`
Miles Morales|Spider-Gwen|Spider-Man 2099|Spider-Ham|Peni Parker|Spider-Man Noir|Silk|Scarlet Spider|Ben Reilly|Kaine|
Madame Web|Black Cat|Mary Jane Watson|Gwen Stacy|Aunt May|Uncle Ben|J. Jonah Jameson|Betty Brant|Ned Leeds|Flash Thompson|
Harry Osborn|Liz Allan|Captain Stacy|Anya Corazon|Spider-Girl|Prowler|Spider-Boy|Robbie Robertson|Jean DeWolff|Spider-Man India
`);

/** Spider-Manovi zloduchovia a symbiotické hrozby. */
const SPIDER_VERSE_VILLAINS = marvel(`
Green Goblin|Doctor Octopus|Venom|Carnage|Sandman|Electro|Vulture|Mysterio|Kraven the Hunter|Rhino|
Scorpion|Lizard|Shocker|Hobgoblin|Chameleon|Morbius|Kingpin|Tombstone|Molten Man|Hydro-Man|
Jackal|Mister Negative|Silvermane|The Spot|Toxin|Riot|Scream|Agony|Phage|Lasher|
Shriek|Demogoblin|Alistair Smythe|Big Wheel|Beetle|Boomerang|Speed Demon|Overdrive|Screwball|Knull
`);

/** Guardians of the Galaxy a kozmické postavy. */
const COSMIC_AND_GUARDIANS = marvel(`
Star-Lord|Gamora|Drax the Destroyer|Rocket Raccoon|Groot|Mantis|Nebula|Yondu|Kraglin|Cosmo the Spacedog|
Adam Warlock|Ayesha|Phyla-Vell|Moondragon|Mar-Vell|Ronan the Accuser|Korath|Supreme Intelligence|Talos|G'iah|
Gravik|Sonya Falsworth|Gladiator|Lilandra|Deathbird|Ego the Living Planet|The Collector|The Grandmaster|High Evolutionary|Korvac|
Annihilus|Kang the Conqueror|Immortus|Rama-Tut|Scarlet Centurion|He Who Remains|Mobius M. Mobius|Ravonna Renslayer|Miss Minutes|Hunter B-15|
Sylvie|Xialing|Xu Wenwu|Razor Fist|Death Dealer|Morris|Namora|Attuma|Tiger Shark|Beta Ray Bill|
Angela|Arishem|Tiamut|Eson the Searcher|Kro|Lylla|Teefs|Floor|Goose the Flerken|Valentina Allegra de Fontaine
`);

/** Asgard, bohovia a mytologické bytosti. */
const ASGARD_AND_GODS = marvel(`
Odin|Loki|Frigga|Heimdall|Sif|Balder|Tyr|Hela|Fenris Wolf|Surtur|
Ymir|Malekith|Kurse|Skurge|Enchantress|Volstagg|Fandral|Hogun|Jane Foster|Ulik|
Mangog|Bor|Laufey|Gorr the God Butcher|Hercules|Ares|Zeus|Khonshu|Ammit|Taweret|
Bast|Seth|Korg|Miek|Topaz|Thori|Kid Loki|Alligator Loki|Classic Loki|President Loki
`);

/** Eternals a Inhumans. */
const ETERNALS_AND_INHUMANS = marvel(`
Ikaris|Sersi|Thena|Ajak|Kingo|Sprite|Phastos|Makkari|Druig|Gilgamesh|
Black Bolt|Medusa|Karnak|Gorgon|Triton|Crystal|Lockjaw|Maximus|Ahura|Kronos
`);

/** Veľkí zloduchovia Marvelu. */
const MAJOR_VILLAINS = marvel(`
Thanos|Red Skull|Ultron|Doctor Doom|Baron Zemo|Baron Mordo|Kaecilius|Dormammu|Nightmare|Shuma-Gorath|
Mephisto|Blackheart|Lilith|Abomination|The Leader|Red Hulk|Absorbing Man|Titania|Wrecker|Thunderball|
Piledriver|Bulldozer|Whirlwind|Crossbones|Batroc the Leaper|Arnim Zola|Baron Strucker|Viper|Grim Reaper|M.O.D.O.K.|
Mandarin|Iron Monger|Whiplash|Justin Hammer|Aldrich Killian|Ghost|Yellowjacket|Klaw|Killmonger|Taskmaster|
Bullseye|Typhoid Mary|Madame Gao|Nobu|Purple Man|Ebony Maw|Corvus Glaive|Proxima Midnight|Cull Obsidian|Fin Fang Foom|
Arcade|Mojo|Sin|Diamondback|Constrictor|Blizzard|Nuke|Zzzax|Wendigo|Baron Blood|
Dreadknight|Graviton|Nitro|Radioactive Man|Living Laser|Unicorn|Firebrand|Spymaster|Controller|Crimson Dynamo|
Titanium Man|Mister Fear|Dreykov|Arthur Harrow|Kazi|The Void|Verussa Bloodstone|Jack Duquesne|Eleanor Bishop|Paradox
`);

/** Zloduchovia z X-Menov a mutantské hrozby. */
const X_MEN_VILLAINS = marvel(`
Magneto|Apocalypse|Mister Sinister|Juggernaut|Sabretooth|Mystique|Toad|Pyro|Avalanche|Blob|
Azazel|Omega Red|Silver Samurai|Lady Deathstrike|Bolivar Trask|William Stryker|Nimrod|Selene|Shadow King|Dark Beast|
Onslaught|Stryfe|Bastion|Cassandra Nova|Exodus|Vulcan|Black Tom Cassidy|Sentinel|Donald Pierce|Sugar Man
`);

/** S.H.I.E.L.D., Wakanda a ďalšie vedľajšie postavy. */
const SUPPORTING_CAST = marvel(`
Nick Fury|Maria Hill|Phil Coulson|Melinda May|Daisy Johnson|Leo Fitz|Jemma Simmons|Alphonso Mackenzie|Sharon Carter|Peggy Carter|
Howard Stark|Pepper Potts|Happy Hogan|Obadiah Stane|Erik Selvig|Darcy Lewis|Betty Ross|Thunderbolt Ross|Everett Ross|Okoye|
Shuri|Nakia|M'Baku|Ramonda|Ayo|Jimmy Woo|Luis|Christine Palmer|Foggy Nelson|Karen Page|
Claire Temple|Stick|Turk Barrett|Alexander Pierce|Jasper Sitwell|Mallory Book|Nikki Ramos|Pug|Ben Urich|Melina Vostokoff
`);

/** Kozmické entity a najvyššie mocnosti. */
const COSMIC_ENTITIES = marvel(`
Galactus|Eternity|The Living Tribunal|The Watcher|Death|Infinity|The Beyonder|The One Above All|Oblivion|The In-Betweener|
Cyttorak|Chthon|Master Order|Lord Chaos|Phoenix Force|Captain Universe|Eon|Agamotto|Dweller-in-Darkness|Zom
`);

/**
 * Final Marvel deck.
 * Order is stable and duplicates are removed so the deck can be diffed easily.
 */
export const MARVEL_CHARACTERS: string[] = [
  ...new Set([
    ...AVENGERS_AND_HEROES,
    ...X_MEN_AND_MUTANTS,
    ...FANTASTIC_FOUR_WORLD,
    ...SPIDER_VERSE_HEROES,
    ...SPIDER_VERSE_VILLAINS,
    ...COSMIC_AND_GUARDIANS,
    ...ASGARD_AND_GODS,
    ...ETERNALS_AND_INHUMANS,
    ...MAJOR_VILLAINS,
    ...X_MEN_VILLAINS,
    ...SUPPORTING_CAST,
    ...COSMIC_ENTITIES,
  ]),
];
