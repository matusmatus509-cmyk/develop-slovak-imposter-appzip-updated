export interface CharacterCategory {
  id: string;
  name: string;
  icon: string;
  characters: string[];
}

// Karty su rozdelene podla typu, aby si hraci mohli vybrat tematicky balik.
const CHARACTER_CATEGORIES_BASE: CharacterCategory[] = [
  {
    id: "world-personalities",
    name: "Svetové osobnosti",
    icon: "🌍",
    characters: [
      "Elon Musk", "Barack Obama", "Nelson Mandela", "Greta Thunberg", "Oprah Winfrey",
      "Malala Yousafzai", "Mark Zuckerberg", "Bill Gates", "Steve Jobs", "Jeff Bezos",
      "Dalajlama", "Pápež František", "David Attenborough", "Stephen Hawking", "Jane Goodall",
      "Walt Disney", "Coco Chanel", "Pablo Picasso", "Frida Kahlo", "Andy Warhol",
      "Mahatma Gandhi", "Martin Luther King Jr.", "Amelia Earhart", "Rosa Parks", "Anne Frank",
    ],
  },
  {
    id: "world-athletes",
    name: "Svetoví športovci",
    icon: "🏅",
    characters: [
      "Cristiano Ronaldo", "Lionel Messi", "Kylian Mbappé", "Erling Haaland", "Neymar",
      "LeBron James", "Michael Jordan", "Stephen Curry", "Kobe Bryant", "Serena Williams",
      "Roger Federer", "Rafael Nadal", "Novak Djokovic", "Usain Bolt", "Simone Biles",
      "Michael Phelps", "Tiger Woods", "Lewis Hamilton", "Max Verstappen", "Valentino Rossi",
      "Muhammad Ali", "Mike Tyson", "Conor McGregor", "Katie Ledecky", "Shaquille O'Neal",
    ],
  },
  {
    id: "world-youtubers",
    name: "Svetoví YouTuberi",
    icon: "▶️",
    characters: [
      "MrBeast", "PewDiePie", "Markiplier", "Jacksepticeye", "KSI",
      "Logan Paul", "Jake Paul", "Ninja", "Dream", "DanTDM",
      "SssniperWolf", "Emma Chamberlain", "Ryan Trahan", "Dude Perfect", "The Sidemen",
      "T-Series", "Zach King", "Khaby Lame", "iJustine", "Marques Brownlee",
      "Casey Neistat", "LazarBeam", "Valkyrae", "Pokimane", "TommyInnit",
    ],
  },
  {
    id: "world-actors",
    name: "Svetovi herci a herecky",
    icon: "🎭",
    characters: [
      "Leonardo DiCaprio", "Tom Hanks", "Keanu Reeves", "Dwayne Johnson", "Will Smith",
      "Johnny Depp", "Robert Downey Jr.", "Brad Pitt", "Ryan Reynolds", "Morgan Freeman",
      "Scarlett Johansson", "Jennifer Aniston", "Angelina Jolie", "Margot Robbie", "Emma Stone",
      "Zendaya", "Anne Hathaway", "Meryl Streep", "Julia Roberts", "Sandra Bullock",
      "Daniel Radcliffe", "Tom Holland", "Chris Hemsworth", "Jason Momoa", "Pedro Pascal",
    ],
  },
  {
    id: "world-musicians",
    name: "Svetovi hudobnici",
    icon: "🎤",
    characters: [
      "Taylor Swift", "Beyoncé", "Rihanna", "Billie Eilish", "Lady Gaga",
      "Adele", "Dua Lipa", "Ariana Grande", "Katy Perry", "Madonna",
      "Ed Sheeran", "Justin Bieber", "Drake", "Eminem", "The Weeknd",
      "Bruno Mars", "Harry Styles", "Elvis Presley", "Michael Jackson", "Freddie Mercury",
      "John Lennon", "Bob Marley", "Shakira", "Sia", "Miley Cyrus",
    ],
  },
  {
    id: "slovak-personalities",
    name: "Slovenske osobnosti",
    icon: "🇸🇰",
    characters: [
      "Zuzana Čaputová", "Milan Rastislav Štefánik", "Ľudovít Štúr", "Anton Bernolák", "Ján Kollár",
      "Pavol Jozef Šafárik", "Jozef Murgaš", "Aurel Stodola", "Ivan Bella", "Jozef Gabčík",
      "Milan Lasica", "Július Satinský", "Róbert Bezák", "Vlado Dzurilla", "Ján Kuciak",
      "Mária Terézia", "Matúš Čák Trenčiansky", "Svätopluk", "Juraj Jánošík", "Mária Rázusová-Martáková",
      "Dominik Tatarka", "Martin Kukučín", "Božena Slančíková-Timrava", "Pavol Országh Hviezdoslav", "Janko Kráľ",
    ],
  },
  {
    id: "slovak-athletes",
    name: "Slovenski sportovci",
    icon: "🏒",
    characters: [
      "Peter Sagan", "Marek Hamšík", "Miroslav Šatan", "Zdeno Chára", "Marián Hossa",
      "Jaroslav Halák", "Peter Bondra", "Pavol Demitra", "Peter Šťastný", "Stan Mikita",
      "Dominika Cibulková", "Daniela Hantuchová", "Anna Karolína Schmiedlová", "Matej Tóth", "Jozef Pribilinec",
      "Petra Vlhová", "Veronika Velez-Zuzulová", "Richard Tury", "Ján Volko", "Michal Martikán",
      "Anastasiya Kuzminová", "Erik Vlček", "Filip Polášek", "František Kunzo", "Martin Vaculík",
    ],
  },
  {
    id: "slovak-actors",
    name: "Slovenski herci a herecky",
    icon: "🎬",
    characters: [
      "Maroš Kramár", "Jozef Kroner", "Emília Vášáryová", "Magda Vášáryová", "Božidara Turzonovová",
      "Milan Lasica", "Július Satinský", "Milan Kňažko", "Dušan Jamrich", "Juraj Kukura",
      "Zuzana Kronerová", "Táňa Pauhofová", "Jana Oľhová", "Zuzana Mauréry", "Anna Šišková",
      "Tomáš Maštalír", "Ján Koleník", "Alexander Bárta", "Jozef Vajda", "Marián Labuda",
      "Gregor Hološka", "Jana Hubinská", "Petra Polnišová", "Jakub Prachař", "Ady Hajdu",
    ],
  },
  {
    id: "slovak-musicians",
    name: "Slovenski hudobnici",
    icon: "🎵",
    characters: [
      "Pavol Habera", "Richard Müller", "Jana Kirschner", "Kristína", "Adam Ďurica",
      "Peter Nagy", "Peter Lipa", "Vašo Patejdl", "Meky Žbirka", "Dežo Ursiny",
      "Tina", "Dara Rolins", "Sima Magušinová", "Kali", "Rytmus",
      "Majk Spirit", "Ego", "IMT Smile", "Desmod", "Elán",
      "Horkýže Slíže", "No Name", "Katarína Knechtová", "Mária Čírová", "Kollárovci",
    ],
  },
  {
    id: "movie-characters",
    name: "Filmove postavy",
    icon: "🍿",
    characters: [
      "Harry Potter", "Hermiona Grangerová", "Ron Weasley", "Lord Voldemort", "Spider-Man",
      "Batman", "Superman", "Wonder Woman", "Iron Man", "Thor",
      "Captain America", "Hulk", "Joker", "Darth Vader", "Luke Skywalker",
      "Jack Sparrow", "Frodo Bublík", "Gandalf", "Legolas", "James Bond",
      "Indiana Jones", "Rocky Balboa", "Forrest Gump", "Shrek", "Donkey",
      "Woody", "Buzz Rakeťák", "Elsa", "Simba", "John Wick",
    ],
  },
  {
    id: "films-series",
    name: "Filmy a serialy",
    icon: "📺",
    characters: [
      "Titanic", "Avatar", "Barbie", "Oppenheimer", "Matrix",
      "Pán prsteňov", "Harry Potter", "Star Wars", "Jurský park", "Gladiátor",
      "Sám doma", "Toy Story", "Leví kráľ", "Hľadá sa Nemo", "Ľadové kráľovstvo",
      "Priatelia", "Hra o tróny", "Stranger Things", "Wednesday", "Bridgerton",
      "The Last of Us", "Breaking Bad", "Squid Game", "The Office", "Simpsonovci",
    ],
  },
  {
    id: "fairy-tales",
    name: "Rozpravkove postavy",
    icon: "🧚",
    characters: [
      "Popoluška", "Snehulienka", "Šípková Ruženka", "Červená čiapočka", "Pinocchio",
      "Alenka v krajine zázrakov", "Peter Pan", "Tinker Bell", "Macko Puf", "Kocúr v čižmách",
      "Mickey Mouse", "Minnie Mouse", "Kačer Donald", "Bugs Bunny", "Tom a Jerry",
      "SpongeBob", "Patrik", "Scooby-Doo", "Asterix", "Obelix",
      "Janko Hraško", "Rytier bez bázne", "Soľ nad zlato", "Janko a Marienka", "Aladin",
    ],
  },
  {
    id: "history-science",
    name: "Historia a veda",
    icon: "📚",
    characters: [
      "Napoleon Bonaparte", "Julius Caesar", "Alexander Veľký", "Kleopatra", "Tutanchamón",
      "Albert Einstein", "Leonardo da Vinci", "Nikola Tesla", "Isaac Newton", "Marie Curie",
      "Charles Darwin", "Galileo Galilei", "Mikuláš Kopernik", "Ada Lovelace", "Alan Turing",
      "Aristoteles", "Platón", "Sokrates", "William Shakespeare", "Wolfgang Amadeus Mozart",
      "Ludwig van Beethoven", "Vincent van Gogh", "Claude Monet", "Salvador Dalí", "Johannes Gutenberg",
    ],
  },
  {
    id: "animals",
    name: "Zvierata",
    icon: "🦁",
    characters: [
      "Lev", "Tiger", "Slon", "Žirafa", "Gorila", "Šimpanz", "Panda", "Koala",
      "Tučniak", "Flamingo", "Papagáj", "Sova", "Delfín", "Žralok", "Veľryba", "Chobotnica",
      "Krokodíl", "Hroch", "Nosorožec", "Zebra", "Vlk", "Medveď", "Líška", "Jaguár",
      "Gepard", "Leopard", "Puma", "Suriikata", "Kengura", "Lenivec",
    ],
  },
];

const WORLD_ATHLETES_EXTRA = [
  "Pelé", "Diego Maradona", "Zinedine Zidane", "David Beckham", "Ronaldinho", "Ronaldo Nazário", "Andrés Iniesta", "Xavi", "Luka Modrić", "Mohamed Salah",
  "Karim Benzema", "Robert Lewandowski", "Vinícius Júnior", "Jude Bellingham", "Antoine Griezmann", "Kevin De Bruyne", "Virgil van Dijk", "Gianluigi Buffon", "Manuel Neuer", "Iker Casillas",
  "Marta", "Alex Morgan", "Megan Rapinoe", "David Ortiz", "Babe Ruth", "Tom Brady", "Patrick Mahomes", "Aaron Rodgers", "Peyton Manning", "Joe Montana",
  "Wayne Gretzky", "Sidney Crosby", "Alex Ovechkin", "Connor McDavid", "Jaromír Jágr", "Manny Pacquiao", "Floyd Mayweather", "Anthony Joshua", "Canelo Álvarez", "Oleksandr Usyk",
  "Jannik Sinner", "Carlos Alcaraz", "Iga Świątek", "Naomi Osaka", "Venus Williams", "Steffi Graf", "Andre Agassi", "Björn Borg", "Martina Navrátilová", "Andy Murray",
  "Eliud Kipchoge", "Mo Farah", "Yelena Isinbayeva", "Carl Lewis", "Jesse Owens", "Allyson Felix", "Sha'Carri Richardson", "Simone Manuel", "Mark Spitz", "Katie Ledecky",
  "Sebastian Vettel", "Fernando Alonso", "Charles Leclerc", "Lando Norris", "Michael Schumacher", "Kimi Räikkönen", "Niki Lauda", "Ronda Rousey", "Khabib Nurmagomedov", "Jon Jones",
  "Tony Hawk", "Kelly Slater", "Shaun White", "Lindsey Vonn", "Mikaela Shiffrin", "George Weah",
];

const WORLD_YOUTUBERS_EXTRA = [
  "IShowSpeed", "Kai Cenat", "Vikkstar123", "Miniminter", "Zerkaa", "Behzinga", "W2S", "TBJZL", "Kwebbelkop", "Unspeakable",
  "PrestonPlayz", "Technoblade", "Skeppy", "GeorgeNotFound", "Sapnap", "BadBoyHalo", "CaptainSparklez", "PopularMMOs", "ItsFunneh", "LDShadowLady",
  "Aphmau", "StacyPlays", "Grian", "Mumbo Jumbo", "Ssundee", "TheOdd1sOut", "Jaiden Animations", "Domics", "Kurzgesagt", "Vsauce",
  "Veritasium", "Mark Rober", "Nerdwriter", "HowToBasic", "Nelk", "Good Mythical Morning", "Rhett and Link", "Safiya Nygaard", "Tana Mongeau", "James Charles",
  "Jeffree Star", "Bretman Rock", "Liza Koshy", "David Dobrik", "Zane Hijazi", "Lele Pons", "Miranda Sings", "Colleen Ballinger", "Philip DeFranco", "H3H3Productions",
  "Mo Vlogs", "Faze Rug", "FaZe Banks", "RiceGum", "Ali-A", "Typical Gamer", "Lachlan", "Muselk", "Nick Eh 30", "SypherPK",
  "CoryxKenshin", "Berleezy", "Kubz Scouts", "The Game Theorists", "MatPat", "Screen Junkies", "CinemaSins", "Joshua Weissman", "Binging with Babish", "Gordon Ramsay",
  "Mrwhosetheboss", "Unbox Therapy", "Linus Tech Tips", "Austin Evans", "The Try Guys",
];

const SLOVAK_PERSONALITIES_EXTRA = [
  "Mária Bartalos", "Mária Čírová", "Katarína Knechtová", "Nela Pocisková", "Celeste Buckingham", "Emma Drobná", "Mária Kolárová", "Veronika Strapková", "Lucia Barmošová", "Adela Vinczeová",
  "Dara Rolins", "Rytmus", "Majk Spirit", "Kali", "Ego", "Separ", "Sima", "Ewa Farna", "Michaela Čobejová", "Zuzana Fialová",
  "Zuzana Norisová", "Monika Hilmerová", "Diana Mórová", "Sväťo Malachovský", "Lukáš Latinák",
  "Kamil Peteraj", "Jozef Banáš", "Matej Bel", "Mária Podhradská", "Peter Marcin", "Andrej Bičan", "Dano Dangl", "Mária Kráľovičová", "Jozef Bednárik",
];

const SLOVAK_ATHLETES_EXTRA = [
  "Marek Mintál", "Róbert Vittek", "Martin Škrtel", "Vladimír Weiss", "Ondrej Duda", "Stanislav Lobotka", "Milan Škriniar", "Dávid Hancko", "Juraj Kucka", "Ján Ďurica",
  "Martin Dúbravka", "Ján Mucha", "Kamil Kopúnek", "Dušan Tittel", "Jozef Adamec", "Ladislav Kubala", "Jozef Vengloš", "František Plánička", "Juraj Slafkovský", "Tomáš Tatar",
  "Martin Pospíšil", "Martin Fehérváry", "Šimon Nemec", "Marek Hrivík", "Richard Pánik", "Branislav Mezei", "Andrej Sekera", "Marek Svatoš", "Jozef Stümpel", "Richard Zedník",
  "Roman Čechmánek", "Ján Lašák", "Rastislav Staňa", "Jozef Golonka", "Vladimír Dzurilla", "Dárius Rusnák", "Igor Liba", "Zigmund Pálffy", "Miroslav Ihnačák", "Róbert Pál",
  "Martina Moravcová", "Richard Nagy", "Tomáš Klobučník", "Katarína Remeňová", "Elena Kaliská", "Zuzana Rehák-Štefečeková", "Danka Barteková", "Jozef Gönci", "Michal Kováč", "Michal Čajkovský",
  "Ivan Klement", "Ján Svorada", "Peter Velits", "Martin Velits", "Jozef Metelka", "Tibor Linka", "Denisa Baránková", "Boris Valábik", "Mário Lunter", "Richard Tóth",
  "Lukáš Krpálek", "Attila Végh", "Ivan Buchinger", "Gábor Boráros", "Monika Chochlíková", "Alex Molčan", "Lukáš Lacko", "Karol Kučera", "Miloš Mečíř", "Dominik Hrbatý",
  "Martin Kližan", "Viktória Kužmová", "Rebecca Šramková", "Jana Čepelová", "Michal Martikán", "Vladimír Országh",
];

const MOVIE_CHARACTERS_EXTRA = [
  "Neo", "Trinity", "Morpheus", "Terminátor", "John Rambo", "Ethan Hunt", "Marty McFly", "Doc Brown", "Maximus Decimus Meridius", "Katniss Everdeen",
  "Peeta Mellark", "Dumbledore", "Severus Snape", "Rubeus Hagrid", "Draco Malfoy", "Sirius Black", "Dobby", "Princezná Leia", "Han Solo", "Yoda",
  "Chewbacca", "Obi-Wan Kenobi", "Anakin Skywalker", "Rey", "Kylo Ren", "Aragorn", "Samwise Gamgee", "Glum", "Gimli", "Sauron",
  "Čierna vdova", "Hawkeye", "Deadpool", "Wolverine", "Black Panther", "Doctor Strange", "Thanos", "Loki", "Ant-Man", "Groot",
  "Rocket Raccoon", "Star-Lord", "Captain Marvel", "Aquaman", "Flash", "Harley Quinn", "Catwoman", "Green Lantern", "Shazam", "Venom",
  "Mary Poppins", "Willy Wonka", "Edward Nožnicovoruký", "Beetlejuice", "Ace Ventura", "Maska", "Kevin McCallister", "Votrelkyňa Ripleyová", "Predátor", "Robocop",
  "Jack Dawson", "Rose DeWitt Bukater", "Jake Sully", "Neytiri", "Barbie", "Ken", "Dominic Toretto", "Brian O'Conner", "Letty Ortiz", "Mia Toretto",
  "Will Turner", "Elizabeth Swannová", "Davy Jones", "Hannibal Lecter", "Clarice Starlingová", "Norman Bates", "Ghostface", "Freddy Krueger", "Jason Voorhees", "Michael Myers",
  "Regan MacNeilová", "Indiana Jones", "Lara Croft", "Agent J", "Agent K", "Peter Venkman", "Alan Grant", "John Hammond", "Forrest Gump", "Chuck Noland",
  "Vito Corleone", "Michael Corleone", "Tony Montana", "Jordan Belfort", "Tyler Durden", "Truman Burbank", "Borat", "Mr. Bean", "Bridget Jonesová", "Elle Woodsová",
  "Maverick", "Rocky Balboa", "Ivan Drago", "Daniel LaRusso", "Pán Miyagi", "John McClane", "Beatrix Kiddo", "Amélie Poulainová", "Biela pani", "Perinbaba",
  "Popolvár", "Princezná Fantaghirò", "Arabela", "Rumburak", "Lietajúci Cyprián", "Jánošík", "Bathory", "Pelíšky – Kraus", "Cisárov pekár", "Kráľ Drozdia brada",
];

const ANIMATED_CHARACTERS = [
  "Mickey Mouse", "Minnie Mouse", "Kačer Donald", "Goofy", "Pluto", "Bugs Bunny", "Daffy Duck", "Tweety", "Sylvester", "Tasmánsky čert",
  "Tom", "Jerry", "Scooby-Doo", "Shaggy", "Fred Flintstone", "Vilma Flintstoneová", "Medveď Yogi", "Šmolko", "Gargamel", "Pepek námorník",
  "SpongeBob", "Patrik Hviezdica", "Squidward", "Pán Krab", "Sandy", "Simpson Homer", "Marge Simpsonová", "Bart Simpson", "Lisa Simpsonová", "Maggie Simpsonová",
  "Peter Griffin", "Stewie Griffin", "Brian Griffin", "Eric Cartman", "Kenny McCormick", "Rick Sanchez", "Morty Smith", "BoJack Horseman", "Aang", "Korra",
  "Pokémon Pikachu", "Ash Ketchum", "Misty", "Meowth", "Macko Puf", "Prasiatko", "Tiger", "Ijáčik", "Calimero", "Krtko",
  "Včielka Maja", "Vilko", "Pat a Mat", "Lolek", "Bolek", "Bob", "Bobek", "Maťko", "Kubko", "Macko Uško",
  "Shrek", "Oslík", "Fiona", "Kocúr v čižmách", "Lord Farquaad", "Kráľ Julien", "Marty zo ZOO", "Alex lev", "Gloria hrošica", "Melman žirafa",
  "Po z Kung Fu Pandy", "Majster Shifu", "Bezzubka", "Štikút", "Gru", "Mimoni Kevin", "Mimoni Stuart", "Mimoni Bob", "Megamozog", "Dracula z Hotela Transylvánia",
  "Woody", "Buzz Rakeťák", "Jessie", "Lightning McQueen", "Mater", "Nemo", "Dory", "Marlin", "WALL-E", "EVE",
  "Ratatouille Remy", "Mike Wazowski", "Sully", "Pán Úžasný", "Elastigirl", "Jack-Jack", "Carl Fredricksen", "Russell", "Radosť z V hlave", "Smútok z V hlave",
  "Elsa", "Anna", "Olaf", "Sven", "Simba", "Nala", "Timon", "Pumba", "Scar", "Mufasa",
  "Ariel", "Sebastián", "Aladin", "Džin", "Jasmína", "Belle", "Zviera", "Rapunzel", "Mauí", "Vaiana",
  "Stitch", "Lilo", "Mulan", "Mushu", "Tarzan", "Herkules", "Robin Hood – líška", "Bambi", "Dumbo", "Pinocchio",
  "Snehulienka", "Popoluška", "Šípková Ruženka", "Peter Pan", "Tinker Bell", "Alica", "Šialený klobučník", "Cruella de Vil", "Maleficent", "Ursula",
];

const SERIES_CHARACTERS = [
  "Rachel Greenová", "Ross Geller", "Monica Gellerová", "Chandler Bing", "Joey Tribbiani", "Phoebe Buffayová", "Sheldon Cooper", "Leonard Hofstadter", "Penny", "Howard Wolowitz",
  "Walter White", "Jesse Pinkman", "Saul Goodman", "Gus Fring", "Hank Schrader", "Michael Scott", "Dwight Schrute", "Jim Halpert", "Pam Beeslyová", "Andy Bernard",
  "Ted Mosby", "Barney Stinson", "Robin Scherbatská", "Marshall Eriksen", "Lily Aldrinová", "Wednesday Addamsová", "Enid Sinclairová", "Eleven", "Mike Wheeler", "Dustin Henderson",
  "Steve Harrington", "Jim Hopper", "Jon Snow", "Daenerys Targaryen", "Tyrion Lannister", "Arya Starková", "Sansa Starková", "Cersei Lannisterová", "Jaime Lannister", "Khal Drogo",
  "Thomas Shelby", "Arthur Shelby", "Sherlock Holmes", "John Watson", "Moriarty", "Dexter Morgan", "Joe Goldberg", "Lucifer Morningstar", "Dr. House", "Perry Cox",
  "Meredith Greyová", "Derek Shepherd", "Carrie Bradshawová", "Samantha Jonesová", "Bridgerton Anthony", "Bridgerton Daphne", "Emily Cooperová", "Beth Harmonová", "June Osborneová", "Villanelle",
  "Profesor z Money Heist", "Tokio z Money Heist", "Berlín z Money Heist", "Nairobi z Money Heist", "Denver z Money Heist", "Seong Gi-hun", "Front Man", "Wednesday – Vec", "Geralt z Rivie", "Yennefer",
  "Ciri", "Joel Miller", "Ellie Williamsová", "Pedro z Narcos", "Pablo Escobar", "Rick Grimes", "Daryl Dixon", "Negan", "Homelander", "Billy Butcher",
  "Loki zo seriálu", "Mandalorian", "Grogu", "Ahsoka Tano", "Obi-Wan Kenobi", "Jack Reacher", "Jack Ryan", "Harvey Specter", "Mike Ross", "Donna Paulsenová",
  "Mr. Bean", "Alf", "MacGyver", "Walker, texaský ranger", "Mitch Buchannon", "Xena", "Herkules zo seriálu", "Buffy", "Dean Winchester", "Sam Winchester",
  "Mulder", "Scullyová", "Columbo", "Monk", "Hawkeye Pierce", "Tony Soprano", "Don Draper", "Frank Underwood", "Tommy z The Last of Us", "Cobra Kai Johnny Lawrence",
];

const VIDEO_GAME_CHARACTERS = [
  "Super Mario", "Luigi", "Princezná Peach", "Bowser", "Yoshi", "Toad", "Donkey Kong", "Link", "Princezná Zelda", "Ganondorf",
  "Sonic", "Tails", "Knuckles", "Dr. Eggman", "Pikachu", "Charizard", "Mewtwo", "Kirby", "Samus Aranová", "Fox McCloud",
  "Pac-Man", "Mega Man", "Crash Bandicoot", "Coco Bandicoot", "Spyro", "Rayman", "Sackboy", "Steve z Minecraftu", "Alex z Minecraftu", "Creeper",
  "Enderman", "Lara Croft", "Nathan Drake", "Kratos", "Atreus", "Aloy", "Geralt z Rivie", "Ciri", "Yennefer", "Master Chief",
  "Cortana", "Doom Slayer", "Solid Snake", "Agent 47", "Leon Kennedy", "Jill Valentineová", "Chris Redfield", "Claire Redfieldová", "Nemesis", "Albert Wesker",
  "Arthur Morgan", "John Marston", "Trevor Philips", "Michael De Santa", "Franklin Clinton", "CJ zo San Andreas", "Niko Bellic", "Tommy Vercetti", "Max Payne", "Alan Wake",
  "Ezio Auditore", "Altaïr", "Bayek", "Kassandra", "Eivor", "Prince of Persia", "Ryu", "Ken Masters", "Chun-Li", "M. Bison",
  "Scorpion", "Sub-Zero", "Raiden", "Liu Kang", "Kitana", "Sonya Blade", "Johnny Cage", "Cloud Strife", "Sephiroth", "Tifa Lockhartová",
  "Sora", "Joker z Persony", "2B", "Tracer", "D.Va", "Mercy", "Reaper", "Winston", "Jinx", "Ahri",
  "Teemo", "Garen", "Fortnite Jonesy", "Peely", "Among Us Crewmate", "Fall Guys postavička", "Gordon Freeman", "GLaDOS", "Chell", "Alyx Vanceová",
  "Marcus Fenix", "Commander Shepard", "Tali'Zorah", "Joel Miller", "Ellie Williamsová", "Big Daddy z BioShock", "Dutch van der Linde", "Handsome Jack", "Claptrap", "Vault Boy",
  "Sans", "Papyrus", "Cuphead", "Mugman", "Freddy Fazbear", "Bonnie", "Chica", "Foxy", "Bendy", "Huggy Wuggy",
];

function cards(id: string) {
  return CHARACTER_CATEGORIES_BASE.find((category) => category.id === id)?.characters ?? [];
}

function uniqueCards(characters: string[]) {
  return [...new Set(characters)];
}

export const CHARACTER_CATEGORIES: CharacterCategory[] = [
  {
    id: "world-personalities",
    name: "Svetove osobnosti",
    icon: "🌍",
    characters: uniqueCards([...cards("world-personalities"), ...cards("world-actors"), ...cards("world-musicians"), ...cards("history-science")]),
  },
  {
    id: "world-athletes",
    name: "Svetovi sportovci",
    icon: "🏅",
    characters: uniqueCards([...cards("world-athletes"), ...WORLD_ATHLETES_EXTRA]),
  },
  {
    id: "world-youtubers",
    name: "Svetovi YouTuberi",
    icon: "▶️",
    characters: uniqueCards([...cards("world-youtubers"), ...WORLD_YOUTUBERS_EXTRA]),
  },
  {
    id: "slovak-personalities",
    name: "Slovenské osobnosti a herci",
    icon: "🇸🇰",
    characters: uniqueCards([...cards("slovak-personalities"), ...cards("slovak-actors"), ...cards("slovak-musicians"), ...SLOVAK_PERSONALITIES_EXTRA]),
  },
  {
    id: "slovak-athletes",
    name: "Slovenskí športovci",
    icon: "🏒",
    characters: uniqueCards([...cards("slovak-athletes"), ...SLOVAK_ATHLETES_EXTRA]),
  },
  {
    id: "movie-characters",
    name: "Filmové postavy",
    icon: "🍿",
    characters: uniqueCards([...cards("movie-characters"), ...MOVIE_CHARACTERS_EXTRA]),
  },
  {
    id: "animated-characters",
    name: "Animované postavičky",
    icon: "🎨",
    characters: uniqueCards(ANIMATED_CHARACTERS),
  },
  {
    id: "series-characters",
    name: "Postavy zo seriálov",
    icon: "📺",
    characters: uniqueCards(SERIES_CHARACTERS),
  },
  {
    id: "video-game-characters",
    name: "Postavy z videohier",
    icon: "🎮",
    characters: uniqueCards(VIDEO_GAME_CHARACTERS),
  },
];

export function getCharacterCategories(includeSlovak: boolean): CharacterCategory[] {
  return includeSlovak
    ? CHARACTER_CATEGORIES
    : CHARACTER_CATEGORIES.filter((category) => !category.id.startsWith("slovak-"));
}
