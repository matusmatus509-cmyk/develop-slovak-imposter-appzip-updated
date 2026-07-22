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
  "🎤🐝👑|Beyoncé", "🎤🌧️|Rihanna", "🎤🎹3️⃣0️⃣|Adele", "🎤🎭|Lady Gaga", "🎤🪩|Bruno Mars",
  "🎤🐉|Imagine Dragons", "🎤🟣|Billie Eilish", "🎤🎸|Ed Sheeran", "🎤💜|Justin Bieber", "🎤🌸|Ariana Grande",
  "🎤🔥|Shakira", "🎤🎺|Katy Perry", "🎤🌟|Dua Lipa", "🎤🧢|Eminem", "🎤🎹👓|Elton John",
  "🎸🎩|Slash", "🎸⚡|Angus Young", "🎤👓|John Lennon", "🎤👑|Freddie Mercury", "🎤🌻|Miley Cyrus",
  "🎬🕶️|Tom Cruise", "🎬🏴‍☠️|Johnny Depp", "🎬💋|Angelina Jolie", "🎬👠|Julia Roberts", "🎬🕷️|Tobey Maguire",
  "🎬🦇|Christian Bale", "🎬🧙|Daniel Radcliffe", "🎬🌹|Leonardo DiCaprio", "🎬🚢|Kate Winslet", "🎬🐺|Brad Pitt",
  "🎬💄|Margot Robbie", "🎬🖤|Keanu Reeves", "🎬⚔️|Jason Momoa", "🎬🛡️|Chris Evans", "🎬🔨|Chris Hemsworth",
  "🎬🦸|Robert Downey Jr.", "🎬🌌|Zoe Saldaña", "🎬🧙‍♀️|Emma Watson", "🎬🧟|Jenna Ortega", "🎬🕵️|Benedict Cumberbatch",
  "🔬⚡|Albert Einstein", "🍎📜|Isaac Newton", "🧬🔭|Marie Curie", "🎨🙂|Leonardo da Vinci", "🎨👂|Vincent van Gogh",
  "🎨🌻|Frida Kahlo", "🧠📖|Stephen Hawking", "🧪⚙️|Nikola Tesla", "🌍🧭|Krištof Kolumbus", "🚀🌕|Neil Armstrong",
  "👑🇬🇧|Kráľovná Alžbeta II.", "👑🏛️|Kleopatra", "👑⚔️|Napoleon", "👑🐎|Július Cézar", "🕊️👓|Mahatma Gandhi",
  "🕊️✊|Martin Luther King Jr.", "🕊️🇿🇦|Nelson Mandela", "👩‍⚖️🇸🇰|Zuzana Čaputová", "👨‍🚀🇸🇰|Ivan Bella", "🎾🇸🇰💪|Dominika Cibulková",
  "🎾🇸🇰🌟|Daniela Hantuchová", "⚽🇸🇰🧑‍🎤|Marek Hamšík", "⚽🇸🇰⭐|Peter Dubovský", "🚴🇸🇰|Peter Sagan", "🏒🇸🇰📏|Zdeno Chára",
  "🏒🇸🇰🏆|Marián Hossa", "🏒🇨🇿6️⃣8️⃣|Jaromír Jágr", "🏊🇺🇸|Michael Phelps", "🏃🏅|Usain Bolt", "🎾🏆👑|Serena Williams",
  "🎾🏆🇷🇸|Novak Djoković", "🏀🐐|Michael Jordan", "🏀👑|LeBron James", "🥊🐝|Muhammad Ali", "⛳🏆|Tiger Woods",
  "🧑‍🍳⭐|Gordon Ramsay", "🧑‍🍳🇸🇰|Pavol Páll", "📺🎤|Ellen DeGeneres", "📺👓|Oprah Winfrey", "🧑‍💻🍎|Steve Jobs",
  "🧑‍💻🚀|Elon Musk", "🧑‍💻💙|Mark Zuckerberg", "🛍️👠|Coco Chanel", "👗✨|Karl Lagerfeld", "📚⚡|J. K. Rowling",
  "📚👻|Stephen King", "📚🕵️|Agatha Christie", "🎭📜|William Shakespeare", "🎼🎹🎻|Wolfgang Amadeus Mozart", "🎼🎹👂|Ludwig van Beethoven",
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
  "🛋️🪡|Čalúnnik", "🧯🏢|Bezpečnostný technik", "🏋️💪|Tréner", "⚽📣|Športový komentátor", "🏊🏅|Plavčík",
  "🎯🏹|Lukostrelec", "🧗🪢|Horolezecký inštruktor", "🧘🧘‍♀️|Joga inštruktor", "🧭🥾|Horský sprievodca", "🏝️🗺️|Sprievodca",
  "🛒🧾|Pokladník", "🏪📦|Skladník", "📦🚚|Logistik", "⚓🔩|Lodný mechanik", "🔬🧫|Laborant",
  "🩻🏥|Rádiológ", "🧠🏥|Psychológ", "🗣️🧠|Logopéd", "👂🩺|ORL lekár", "👁️🩺|Očný lekár",
]);

const ANIMATED_CHARACTERS = cards([
  "🐭🧤⭐|Mickey Mouse", "🐭🎀👗|Minnie Mouse", "🦆⚓😡|Kačer Donald", "🐶🤪🎩|Goofy", "🐶🦴🟡|Pluto",
  "🐰🥕😎|Bugs Bunny", "🦆🖤💢|Daffy Duck", "🐱🐭🏃|Tom", "🐭🧀🏠|Jerry", "🐕🍪👻|Scooby-Doo",
  "👨🟢🍔|Shaggy", "🧽🍍🌊|SpongeBob", "⭐🌊🩳|Patrik Hviezdica", "🐙🎷😒|Squidward", "👨🍩🍺|Homer Simpson",
  "👩💙💇|Marge Simpsonová", "👦🛹😈|Bart Simpson", "👧🎷📚|Lisa Simpsonová", "👴🔬🌀|Rick Sanchez", "👦😰🌀|Morty Smith",
  "⚡🐭🟡|Pikachu", "🧢🔴⚪|Ash Ketchum", "🐱🪙🗣️|Meowth", "🧸🍯🐝|Macko Puf", "🐷🎀😨|Prasiatko",
  "🐯🦘😁|Tiger z Macka Puf", "🫏☁️😔|Ijáčik", "🔵🍄🧢|Šmolko", "🧙🐈🍄|Gargamel", "⚓🥬💪|Pepek námorník",
  "🐝🌼👧|Včielka Maja", "🕳️🌼⚫|Krtko", "👷🔨🏠|Pat a Mat", "👹🏰💚|Shrek", "🫏🗣️😂|Oslík zo Shreka",
  "👸👹💚|Fiona", "🐱👢⚔️|Kocúr v čižmách", "🐼🥋🍜|Po z Kung Fu Pandy", "🐭🥋🧘|Majster Shifu", "🐉🖤🔥|Bezzubka",
  "👦🐉🦿|Štikút", "👨‍🦲🧣🌙|Gru", "🟡🥽🍌|Mimoň Kevin", "🟡👁️🎸|Mimoň Stuart", "🟡🧸👑|Mimoň Bob",
  "🦁🎪🌴|Alex z Madagaskaru", "🦓🎤🌴|Marty z Madagaskaru", "🐒👑💃|Kráľ Julien", "🦒💊🌴|Melman", "🦛💃🌴|Gloria",
  "🤠⭐🧸|Woody", "🚀🧑‍🚀🧸|Buzz Rakeťák", "🤠👩‍🦰🧸|Jessie", "🏎️⚡🏆|Bleskový McQueen", "🚛🔧😁|Mater",
  "🐠🦈🔍|Nemo", "🐟💙❓|Dory", "🤖🗑️🌱|WALL-E", "🤖🤍🌿|EVE", "🐀👨‍🍳🍲|Remy z Ratatouille",
  "👁️🟢🚪|Mike Wazowski", "👹💙🚪|Sully", "🦸‍♂️💪🔴|Pán Úžasný", "🦸‍♀️🧘‍♀️🔴|Elastigirl", "👶🔥🦸|Jack-Jack",
  "👴🎈🏠|Carl z V hore", "👦🎒🎈|Russell z V hore", "😁💛🧠|Radosť", "😢💙🧠|Smútok", "❄️👸🧊|Elsa",
  "👩‍🦰👸❄️|Anna", "⛄🥕☀️|Olaf", "🦁👑🌅|Simba", "🦁🖤🔥|Scar", "🐿️🌵🪲|Timon",
  "🐗💨🌴|Pumba", "🧜‍♀️🐚🦀|Ariel", "🦀🎵🌊|Sebastián", "🧞‍♂️🪔🏜️|Aladin", "🧞💙✨|Džin",
  "👸💇‍♀️🏮|Rapunzel", "👧🌊⛵|Vaiana", "💪🪝🌊|Mauí", "👽💙🌺|Stitch", "👧🌺👽|Lilo",
  "👩⚔️🐉|Mulan", "🐉🔥😂|Mushu", "👨🌿🦍|Tarzan", "🦌🌲🌸|Bambi", "🐘👂🎪|Dumbo",
  "🤥🪵🦗|Pinocchio", "👦🧚‍♀️🏴‍☠️|Peter Pan", "🧚‍♀️✨🔔|Tinker Bell", "👧🐇🫖|Alenka", "🎩🫖🤪|Šialený klobučník",
  "👩‍🦳🖤🐕|Cruella de Vil", "🧙‍♀️🐉🖤|Maleficent", "🐙🧙‍♀️🔱|Ursula", "👦💨💧|Aang", "👩💧🔥|Korra",
]);

const VIDEO_GAMES = cards([
  "🍄👨🔴|Super Mario", "🍄👨🟢|Luigi", "👸🍑👑|Princezná Peach", "🐢🔥👑|Bowser", "🦖🥚💚|Yoshi",
  "🍄🧢🏰|Toad", "🦍🍌🎮|Donkey Kong", "🧝⚔️🛡️|Link", "👸🔺✨|Princezná Zelda", "👹🔺🔥|Ganondorf",
  "🦔💙💨|Sonic", "🦊✌️🚁|Tails", "🦔🔴👊|Knuckles", "🥚👨‍🔬🤖|Dr. Eggman", "🩷⭐😋|Kirby",
  "👩🚀🔫|Samus Aranová", "🟡👻🍒|Pac-Man", "🤖🔵🔫|Mega Man", "🦊👖📦|Crash Bandicoot", "🐉💜💎|Spyro",
  "👐🟣🌟|Rayman", "⛏️🧱👨|Steve z Minecraftu", "⛏️🧱👩|Alex z Minecraftu", "🟢💥🧱|Creeper", "⚫🟣👁️|Enderman",
  "👩🏹🏺|Lara Croft", "👨🧭💰|Nathan Drake", "👨‍🦲🪓❄️|Kratos", "👦🏹🐺|Atreus", "👩🏹🤖|Aloy",
  "⚔️🐺🧙|Geralt z Rivie", "👩‍🦳⚔️✨|Ciri", "🪖🟢🚀|Master Chief", "👹🔫🔥|Doom Slayer", "🐍📦🔫|Solid Snake",
  "👨‍🦲🔴🎯|Agent 47", "👮🧟🔫|Leon Kennedy", "👩‍✈️🧟⭐|Jill Valentineová", "🧟‍♂️🚀💀|Nemesis", "🤠🐎💰|Arthur Morgan",
  "🤠🌵🔫|John Marston", "🤪🚗💥|Trevor Philips", "👨‍💼🚗🔫|Michael De Santa", "👨‍🦱🐕🚙|Franklin Clinton", "🧑🏾🚲🌴|CJ zo San Andreas",
  "🧥🗽🚕|Niko Bellic", "💊🕵️🌧️|Max Payne", "🗡️🏛️🦅|Ezio Auditore", "🥷🦅🏜️|Altaïr", "🥋🔴🔥|Ryu",
  "🥋🟡🔥|Ken Masters", "👩🥋🦵|Chun-Li", "🥷🟡🦂|Scorpion", "🥷🔵❄️|Sub-Zero", "⚡👒🥷|Raiden",
  "🐉🔥🥋|Liu Kang", "🗡️☁️🟡|Cloud Strife", "🗡️🪽⚫|Sephiroth", "👩🥊🍸|Tifa Lockhartová", "🔑🗡️👦|Sora",
  "👩🟠⏱️|Tracer", "👩🤖🐰|D.Va", "👼💛⚕️|Mercy", "💀🖤🔫|Reaper", "👩‍🦰💙💥|Jinx",
  "🐹🟢🍄|Teemo", "🧔🟦🗡️|Garen", "🪖🟡🏝️|Jonesy z Fortnite", "🍌🕴️🏝️|Peely", "🚀🔴🔪|Among Us Crewmate",
  "🫘👑🏁|Fall Guys postavička", "👓🔧👽|Gordon Freeman", "🤖🍰🧪|GLaDOS", "👩🔫🌀|Chell", "🪖⚙️🔫|Marcus Fenix",
  "🚀🧑‍✈️🌌|Commander Shepard", "🤖📦🗣️|Claptrap", "👍💙☢️|Vault Boy", "💀🧥❤️|Sans", "💀🧣🦴|Papyrus",
  "☕👦🔫|Cuphead", "☕👦💙|Mugman", "🐻🎩🎤|Freddy Fazbear", "🐰🎸💜|Bonnie", "🐔🍕💛|Chica",
  "🦊🏴‍☠️❤️|Foxy", "🐉🔥🪽|Charizard", "🐱🔮💜|Mewtwo", "🧶👦🌍|Sackboy", "👨🧔🍄🔫|Joel Miller",
  "👧🎒🦒|Ellie Williamsová", "🏹🦅🏜️|Bayek", "👩🗡️🏺|Kassandra", "🪓🛡️⛵|Eivor", "🤴⌛🗡️|Prince of Persia",
  "😎🥋🟢|Johnny Cage", "👸🪭💙|Kitana", "👩‍💻🔵🧠|Cortana", "😈🎭🔫|Handsome Jack", "🐱🎰🔫|Lucky z Brawl Stars",
  "🧙‍♀️🔮🐺|Yennefer", "🦊🚀🔫|Fox McCloud", "🐵🥊🍌|Diddy Kong", "👻👑🟡|King Boo", "🦑🔫🎨|Inkling",
  "🤖🔵🦔|Metal Sonic", "🐺⚔️🌑|Sekiro", "🧒❤️🌻|Frisk", "🖋️😈🎞️|Bendy", "🔵🧸😬|Huggy Wuggy",
]);

const FOOD_AND_DRINKS = cards([
  "🍕🇮🇹|Pizza", "🍔🍟|Hamburger s hranolkami", "🌭🥫|Hotdog", "🌮🇲🇽|Tacos", "🌯🔥|Burrito",
  "🍣🇯🇵|Sushi", "🍜🥢|Rezance", "🍝🇮🇹|Špagety", "🥟🥢|Knedličky", "🥘🇪🇸|Paella",
  "🥩🔥|Steak", "🍗🔥|Pečené kura", "🍖🦴|Mäso na kosti", "🥓🍳|Slanina s vajíčkom", "🍳🌞|Volské oko",
  "🥞🍯|Palacinky", "🧇🍓|Vafle", "🥐☕|Croissant", "🥖🧀|Bageta so syrom", "🥨🇩🇪|Praclík",
  "🧀🇨🇭|Švajčiarsky syr", "🥗🥬|Šalát", "🥪🧀|Sendvič", "🍲🥄|Polievka", "🥣🌽|Kaša",
  "🍚🥢|Ryža", "🍛🌶️|Kari", "🫕🧀|Fondue", "🥙🧆|Falafel", "🍤🔥|Grilované krevety",
  "🦞🍽️|Homár", "🦀🍽️|Krab", "🐟🍋|Ryba s citrónom", "🥔🔥|Pečený zemiak", "🍟🧂|Hranolky",
  "🍿🎬|Popcorn", "🍕🍍|Havajská pizza", "🍎🥧|Jablkový koláč", "🎂🕯️|Narodeninová torta", "🍰🍓|Jahodový koláč",
  "🧁🌈|Cupcake", "🍩☕|Šiška", "🍪🥛|Sušienky s mliekom", "🍫🥜|Čokoláda s orechmi", "🍬🌈|Cukríky",
  "🍭👅|Lízanka", "🍦☀️|Zmrzlina", "🍨🍒|Zmrzlinový pohár", "🍧❄️|Ľadová drť", "🍮🍯|Puding",
  "🍯🐝|Med", "🥜🧈|Arašidové maslo", "🍓🍓|Jahodový džem", "🍌🥛|Banánový kokteil", "🥭🥤|Mangové smoothie",
  "☕🌅|Ranná káva", "🍵🌿|Zelený čaj", "🥛🐄|Kravské mlieko", "🧋🟤|Bubble tea", "🥤🧊|Limonáda",
  "🍋💧|Citrónová voda", "🍊🥤|Pomarančový džús", "🍎🧃|Jablkový džús", "🥥💧|Kokosová voda", "🍺🇩🇪|Pivo",
  "🍷🍇|Víno", "🥂🎉|Šampanské", "🍹🏝️|Tropický koktail", "🍸🫒|Martini", "🥃🧊|Whisky s ľadom",
  "🍎🍏|Jablká", "🍌🐒|Banán", "🍉☀️|Vodný melón", "🍇🍷|Hrozno", "🍓❤️|Jahoda",
  "🍒👯|Čerešne", "🍍🏝️|Ananás", "🥝💚|Kiwi", "🥑🍞|Avokádový toast", "🌽🔥|Grilovaná kukurica",
  "🥕🐰|Mrkva", "🍅🥫|Kečup", "🥒🥗|Uhorkový šalát", "🌶️🔥|Pálivá paprika", "🧄🧛|Cesnak",
  "🧅😭|Cibuľa", "🍄🌲|Huby", "🥦💪|Brokolica", "🍋😖|Kyslý citrón", "🍑☀️|Broskyňa",
  "🥚🐔|Vajce", "🥛🍫|Kakao", "🧈🍞|Chlieb s maslom", "🥣🥛|Cereálie", "🍞🔥|Hrianka",
  "🥫🐟|Tuniak v konzerve", "🍱🇯🇵|Bento", "🥠🔮|Koláčik šťastia", "🍡🇯🇵|Dango", "🧆🥙|Pita s falafelom",
]);

const PLACES_AND_OBJECTS = cards([
  "🏫📚|Škola", "🏥🩺|Nemocnica", "🏦💰|Banka", "🏨🛏️|Hotel", "🏪🌙|Večierka",
  "🏬🛍️|Nákupné centrum", "🏭🏗️|Továreň", "🏰👑|Hrad", "🏛️📜|Múzeum", "⛪🔔|Kostol",
  "🕌🌙|Mešita", "🛕🪷|Chrám", "🏟️⚽|Štadión", "🎡🎢|Zábavný park", "🎪🤡|Cirkus",
  "🎭👏|Divadlo", "🎬🍿|Kino", "📚🤫|Knižnica", "🍽️👨‍🍳|Reštaurácia", "☕🥐|Kaviareň",
  "✈️🧳|Letisko", "🚉🚆|Železničná stanica", "⛽🚗|Čerpacia stanica", "🚢⚓|Prístav", "🗼🇫🇷|Eiffelova veža",
  "🗽🇺🇸|Socha slobody", "🏯🇯🇵|Japonský chrám", "🗿🏝️|Veľkonočný ostrov", "🏜️🐫|Púšť", "🏖️☀️|Pláž",
  "🏝️🥥|Tropický ostrov", "🏔️❄️|Zasnežené hory", "🌋🔥|Sopka", "🏕️🔥|Kemp", "🌲🦌|Les",
  "🌳🛝|Park", "🌾🚜|Farma", "🦁🦒|Zoologická záhrada", "🐠🪸|Akvárium", "🌌🔭|Hvezdáreň",
  "🏠❤️|Domov", "🛋️📺|Obývačka", "🛏️🌙|Spálňa", "🛁🫧|Kúpeľňa", "🍳🧊|Kuchyňa",
  "🚗🔧|Garáž", "🌷🪴|Záhrada", "💼💻|Kancelária", "🧑‍🏫🖍️|Trieda", "🧪🔬|Laboratórium",
  "📱🔋|Mobilný telefón", "💻⌨️|Notebook", "🖥️🖱️|Počítač", "⌚❤️|Smart hodinky", "📷⚡|Fotoaparát",
  "📺🛋️|Televízor", "🎧🎵|Slúchadlá", "🔊🎶|Reproduktor", "🎮🕹️|Herná konzola", "🖨️📄|Tlačiareň",
  "💡⚡|Žiarovka", "🔦🌙|Baterka", "🕯️🔥|Sviečka", "⏰😴|Budík", "🧭🗺️|Kompas",
  "🔭🌙|Teleskop", "🔬🦠|Mikroskop", "🧲📎|Magnet", "🔑🚪|Kľúč", "🔒🔐|Zámok",
  "🧰🔨|Náradie", "🪛🔩|Skrutkovač", "🪚🪵|Píla", "🧯🔥|Hasiaci prístroj", "🪜🏠|Rebrík",
  "🧹✨|Metla", "🧺👕|Kôš na bielizeň", "🧻🚽|Toaletný papier", "🪥😁|Zubná kefka", "🧼🫧|Mydlo",
  "✏️📓|Ceruzka a zošit", "🖊️✍️|Pero", "📐📏|Pravítko", "🎒🏫|Školská taška", "📎📄|Kancelárska spinka",
  "✂️📄|Nožnice", "📌🗺️|Pripináčik", "📦🚚|Balík", "✉️📮|List", "🗑️♻️|Odpadkový kôš",
  "☂️🌧️|Dáždnik", "🕶️☀️|Slnečné okuliare", "👓📖|Okuliare", "👛💳|Peňaženka", "🧳✈️|Cestovný kufor",
  "🎁🎀|Darček", "🎈🎉|Balón", "🪁💨|Šarkan", "🧸👶|Plyšový medveď", "🧩🧠|Puzzle",
]);

export const EMOJI_CATEGORIES: EmojiCategory[] = [
  { id: "films", title: "Filmy a seriály", icon: "🎬", puzzles: FILMS },
  { id: "people", title: "Osobnosti", icon: "🌟", puzzles: PERSONALITIES },
  { id: "jobs", title: "Povolania", icon: "🧑‍💼", puzzles: PROFESSIONS },
  { id: "animated", title: "Animované postavy", icon: "🎨", puzzles: ANIMATED_CHARACTERS },
  { id: "games", title: "Videohry", icon: "🎮", puzzles: VIDEO_GAMES },
  { id: "food", title: "Jedlo a nápoje", icon: "🍕", puzzles: FOOD_AND_DRINKS },
  { id: "places", title: "Miesta a predmety", icon: "🗺️", puzzles: PLACES_AND_OBJECTS },
];

export function getEmojiCategories(includeSlovak: boolean): EmojiCategory[] {
  if (includeSlovak) return EMOJI_CATEGORIES;
  return EMOJI_CATEGORIES.map((category) => ({
    ...category,
    puzzles: category.puzzles.filter((puzzle) => !puzzle.emoji.includes("🇸🇰")),
  }));
}
