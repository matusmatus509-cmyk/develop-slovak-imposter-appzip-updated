export interface EmojiPuzzle {
  emoji: string;
  answer: string;
}

export interface EmojiCategory {
  id: string;
  title: string;
  icon: string;
  puzzles: EmojiPuzzle[];
}

function cards(entries: string[]): EmojiPuzzle[] {
  return entries.map((entry) => {
    const [emoji, answer] = entry.split("|");
    return { emoji, answer };
  });
}

const FILMS = cards([
  "🦁👑|Leví kráľ", "❄️👸|Ľadové kráľovstvo", "🕷️👨|Spider-Man", "🐠🔍|Hľadá sa Nemo", "🧙💍|Pán prsteňov",
  "🦇🌃|Batman", "🚀⭐⚔️|Hviezdne vojny", "🐉🏰|Hra o tróny", "🌹👹|Kráska a zviera", "🐢🍕🥷|Ninja korytnačky",
  "🧸🍯|Macko Puf", "🐡🦈🌊|Čeľuste", "🐸👸💋|Žabí princ", "🧜🌊🐚|Malá morská víla", "🦄🌈|Jednorožec",
  "🎃👻🍬|Halloween", "👻🚫|Krotitelia duchov", "🤖🌱|WALL-E", "🐀👨‍🍳|Ratatouille", "🏎️⚡|Autá",
  "🧞🪔|Aladin", "👸🍎|Snehulienka", "👠⏰|Popoluška", "🏴‍☠️🌊|Piráti z Karibiku", "🦖🏝️|Jurský park",
  "👽🚲🌕|E.T.", "🧠🎈|V hlave", "🕯️👻|Coco", "🎈🏠|V hore", "🦸🛡️|Avengers",
  "🦸‍♀️⚡|Wonder Woman", "🤠🚀🧸|Toy Story", "🐼🥋|Kung Fu Panda", "🐲👦|Ako vycvičiť draka", "🧙⚡|Harry Potter",
  "🧙‍♀️🟡|Čarodejník z krajiny Oz", "🧛🌙|Twilight", "🧟🧠|The Walking Dead", "🦈🌪️|Sharknado", "🏠👦🎄|Sám doma",
  "🕵️🔍|Sherlock Holmes", "👨‍🚀🌌|Interstellar", "🌌👽|Avatar", "💊🕶️|Matrix", "🚢🧊💔|Titanic",
  "🦍🏙️|King Kong", "🐒🗽|Planéta opíc", "🚂🍫|Charlie a továreň na čokoládu", "👨‍⚕️🔮|Doctor Strange", "🐜🦸|Ant-Man",
  "🖤🐆|Black Panther", "⚡🔨|Thor", "🧙‍♂️🧹|Fantastické zvery", "👩‍🚀🌕|Prvý človek", "🌋💍|Sopka",
  "🎤💃|Mamma Mia!", "🎵🦁|The Greatest Showman", "💃🕺|Hriešny tanec", "👠🛍️|Pretty Woman", "🚓💨|Rýchlo a zbesilo",
  "🏁🏎️|Formula 1", "🥊🥶|Rocky", "🤖🤝|Terminátor", "🧠⚙️|Iron Man", "🔪😱|Vreskot",
  "🐑👨‍🌾|Babe", "🐕🎈|101 dalmatíncov", "🐼👑|Panda kráľ", "🐧🎤|Happy Feet", "🐝🎬|Včelí film",
  "🦊🐰|Zootropolis", "🐻❄️|Ľadový medveď", "🧊👸👭|Frozen 2", "👻🏨|Hotel Transylvánia", "👹🚪|Príšerky s.r.o.",
  "🐉👸|Shrek", "🦸‍♂️👨‍👩‍👧|Rodinka Úžasných", "🐜🌿|Mravec Z", "🐧🐧|Madagaskar", "🦣❄️|Doba ľadová",
  "🌊🐟|Hľadá sa Dory", "🚀🌍|Marťan", "🌕🚀|Apollo 13", "🧙‍♂️🪞|Doktor Parnassus", "🎩🐇|Iluzionista",
  "🦸‍♂️🕸️|Venom", "😈👠|Diabol nosí Pradu", "👑📖|Denník princeznej", "🎤⭐|Zrodila sa hviezda", "🎸🎶|Bohemian Rhapsody",
  "🕺🧤|Michael Jackson: This Is It", "🐺🌕|Vlkolak", "🧛🩸|Dracula", "🧟‍♀️🏠|Resident Evil", "🤡🎈|To",
  "🧸👻|Annabelle", "🚪🚪🚪|Narnia", "🌪️🏠|Twister", "🦸‍♀️🐱|Catwoman", "🐎🏇|Spirit",
  "🧚‍♂️🌿|Peter Pan", "🐘🎪|Dumbo", "👸🌹|Na vlásku", "🍎👸|Snehulienka a sedem trpaslíkov", "🐺👵|Červená čiapočka",
]);

const PERSONALITIES = cards([
  "🎤✨|Taylor Swift", "⚽🐐|Cristiano Ronaldo", "⚽🇦🇷|Lionel Messi", "🎤🕺|Michael Jackson", "🎸🕶️|Elvis Presley",
  "🎤👑|Beyoncé", "🎤🌧️|Rihanna", "🎤🎹|Adele", "🎤🎭|Lady Gaga", "🎤🪩|Bruno Mars",
  "🎤🐉|Imagine Dragons", "🎤🟣|Billie Eilish", "🎤🎸|Ed Sheeran", "🎤💜|Justin Bieber", "🎤🌸|Ariana Grande",
  "🎤🔥|Shakira", "🎤🎺|Katy Perry", "🎤🌟|Dua Lipa", "🎤🧢|Eminem", "🎤🎹|Elton John",
  "🎸🎩|Slash", "🎸⚡|Angus Young", "🎤👓|John Lennon", "🎤👑|Freddie Mercury", "🎤🌻|Miley Cyrus",
  "🎬🕶️|Tom Cruise", "🎬🏴‍☠️|Johnny Depp", "🎬💋|Angelina Jolie", "🎬👠|Julia Roberts", "🎬🕷️|Tobey Maguire",
  "🎬🦇|Christian Bale", "🎬🧙|Daniel Radcliffe", "🎬🌹|Leonardo DiCaprio", "🎬🚢|Kate Winslet", "🎬🐺|Brad Pitt",
  "🎬💄|Margot Robbie", "🎬🖤|Keanu Reeves", "🎬⚔️|Jason Momoa", "🎬🛡️|Chris Evans", "🎬🔨|Chris Hemsworth",
  "🎬🦸|Robert Downey Jr.", "🎬🌌|Zoe Saldaña", "🎬🧙‍♀️|Emma Watson", "🎬🧟|Jenna Ortega", "🎬🕵️|Benedict Cumberbatch",
  "🔬⚡|Albert Einstein", "🍎📜|Isaac Newton", "🧬🔭|Marie Curie", "🎨🙂|Leonardo da Vinci", "🎨👂|Vincent van Gogh",
  "🎨🌻|Frida Kahlo", "🧠📖|Stephen Hawking", "🧪⚙️|Nikola Tesla", "🌍🧭|Krištof Kolumbus", "🚀🌕|Neil Armstrong",
  "👑🇬🇧|Kráľovná Alžbeta II.", "👑🏛️|Kleopatra", "👑⚔️|Napoleon", "👑🐎|Július Cézar", "🕊️👓|Mahatma Gandhi",
  "🕊️✊|Martin Luther King Jr.", "🕊️🇿🇦|Nelson Mandela", "👩‍⚖️🇸🇰|Zuzana Čaputová", "👨‍🚀🇸🇰|Ivan Bella", "🎾🇸🇰|Dominika Cibulková",
  "🎾🇸🇰|Daniela Hantuchová", "⚽🇸🇰|Marek Hamšík", "⚽🇸🇰|Peter Dubovský", "🚴🇸🇰|Peter Sagan", "🏒🇸🇰|Zdeno Chára",
  "🏒🇸🇰|Marián Hossa", "🏒🇸🇰|Jaromír Jágr", "🏊🇺🇸|Michael Phelps", "🏃🏅|Usain Bolt", "🎾🏆|Serena Williams",
  "🎾🏆|Novak Djoković", "🏀🐐|Michael Jordan", "🏀👑|LeBron James", "🥊🐝|Muhammad Ali", "⛳🏆|Tiger Woods",
  "🧑‍🍳⭐|Gordon Ramsay", "🧑‍🍳🇸🇰|Pavol Páll", "📺🎤|Ellen DeGeneres", "📺👓|Oprah Winfrey", "🧑‍💻🍎|Steve Jobs",
  "🧑‍💻🚀|Elon Musk", "🧑‍💻💙|Mark Zuckerberg", "🛍️👠|Coco Chanel", "👗✨|Karl Lagerfeld", "📚⚡|J. K. Rowling",
  "📚👻|Stephen King", "📚🕵️|Agatha Christie", "🎭📜|William Shakespeare", "🎼🎹|Wolfgang Amadeus Mozart", "🎼🎹|Ludwig van Beethoven",
  "🎼🦢|Peter Iľjič Čajkovskij", "🎥🦈|Steven Spielberg", "🎥🦇|Tim Burton", "🎥🌌|James Cameron", "🎥🎞️|Quentin Tarantino",
]);

const PROFESSIONS = cards([
  "👨‍⚕️🩺|Lekár", "👩‍⚕️💉|Sestra", "🦷🪥|Zubár", "💊🏥|Lekárnik", "🚑🩹|Záchranár",
  "👨‍🚒🔥|Hasič", "👮🚓|Policajt", "🧑‍⚖️⚖️|Sudca", "⚖️📄|Advokát", "🪖🎖️|Vojak",
  "👩‍🏫📚|Učiteľ", "🧑‍🏫🔬|Profesor", "👶🧸|Učiteľ v škôlke", "🎓📖|Knihovník", "🧑‍🔬🧪|Vedec",
  "🔭🌌|Astronóm", "🧬🔬|Biológ", "⚗️🧪|Chemik", "🌦️📡|Meteorológ", "🗺️🌋|Geológ",
  "👨‍🍳🍲|Kuchár", "🍰🧁|Cukrár", "🍞🥖|Pekár", "☕🍵|Barista", "🍽️🧾|Čašník",
  "💇✂️|Kaderník", "💅✨|Manikér", "💄🪞|Vizážista", "👗🧵|Krajčír", "👠🛍️|Predavač",
  "🏗️👷|Stavbár", "🔨🪚|Stolár", "🔧🚗|Automechanik", "⚡🔌|Elektrikár", "🚰🔧|Inštalatér",
  "🎨🖌️|Maliar", "🧱🏠|Murár", "📐🏢|Architekt", "🛋️📏|Dizajnér", "🪴🌳|Záhradník",
  "🚜🌾|Farmár", "🐄🩺|Veterinár", "🐕🦮|Cvičiteľ psov", "🐠🌊|Morský biológ", "✈️🧑‍✈️|Pilot",
  "🛫🧳|Letuška", "🚆🧑‍✈️|Rušňovodič", "🚌🚏|Autobusár", "🚕🚗|Taxikár", "🚚📦|Kuriér",
  "📮✉️|Poštár", "🚢⚓|Námorník", "🏎️🏁|Pretekár", "🚲🔧|Cyklistický mechanik", "📷🎞️|Fotograf",
  "🎥🎬|Kameraman", "🎬🎞️|Režisér", "🎭🎤|Herec", "🎤🎶|Spevák", "🎸🎼|Hudobník",
  "💃🩰|Tanečník", "🎨🖼️|Ilustrátor", "📰✍️|Novinár", "📚✍️|Spisovateľ", "🎙️📻|Moderátor",
  "🧑‍💻⌨️|Programátor", "🌐🎨|Webdizajnér", "🛡️💻|Kyberbezpečnostný expert", "📊💼|Analytik", "🤖⚙️|Robotik",
  "💰🧮|Účtovník", "🏦📈|Bankár", "🏠🔑|Realitný maklér", "📣💡|Marketér", "🤝💼|Personalista",
  "🧑‍💼📋|Manažér", "📞🎧|Operátor zákazníckej linky", "🧹🪣|Upratovač", "🛡️🚪|Strážnik", "🗑️🚛|Smetiar",
  "🪡🩹|Krajčír", "🧯🏢|Bezpečnostný technik", "🏋️💪|Tréner", "⚽📣|Športový komentátor", "🏊🏅|Plavčík",
  "🎯🏹|Lukostrelec", "🧗🪢|Horolezecký inštruktor", "🧘🧘‍♀️|Joga inštruktor", "🧭🥾|Horský sprievodca", "🏝️🗺️|Sprievodca",
  "🛒🧾|Pokladník", "🏪📦|Skladník", "📦🚚|Logistik", "⚓🔩|Lodný mechanik", "🔬🧫|Laborant",
  "🩻🏥|Rádiológ", "🧠🏥|Psychológ", "🗣️🧠|Logopéd", "👂🩺|ORL lekár", "👁️🩺|Očný lekár",
]);

export const EMOJI_CATEGORIES: EmojiCategory[] = [
  { id: "films", title: "Filmy a seriály", icon: "🎬", puzzles: FILMS },
  { id: "people", title: "Osobnosti", icon: "🌟", puzzles: PERSONALITIES },
  { id: "jobs", title: "Povolania", icon: "🧑‍💼", puzzles: PROFESSIONS },
];
