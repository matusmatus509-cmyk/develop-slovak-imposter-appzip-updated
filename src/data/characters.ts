import type { AppLanguage } from "../i18n/LanguageProvider";
import { LOCAL_PERSONALITY_CATEGORIES } from "./localizedPersonalities";
import { GENERATED_CHARACTER_CARDS } from "./expandedContent";

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

const WORLD_ATHLETES_MORE = [
  // Futbal
  "Thierry Henry", "Zlatan Ibrahimović", "Kaká", "Luís Figo", "Roberto Carlos", "Paolo Maldini", "Sergio Ramos", "Gerard Piqué", "Carles Puyol", "Didier Drogba",
  "Samuel Eto'o", "Gareth Bale", "Wayne Rooney", "Paul Scholes", "Steven Gerrard", "Frank Lampard", "Andrea Pirlo", "Francesco Totti", "Alessandro Del Piero", "Ruud Gullit",
  "Marco van Basten", "Johan Cruyff", "Franz Beckenbauer", "Gerd Müller", "Lev Yashin", "Eric Cantona", "Dennis Bergkamp", "Arjen Robben", "Robin van Persie", "Sergio Agüero",
  "Harry Kane", "Son Heung-min", "Rodri", "Pedri", "Lamine Yamal", "Jamal Musiala", "Florian Wirtz", "Bukayo Saka", "Phil Foden", "Gianluigi Donnarumma",
  "Aitana Bonmatí", "Alexia Putellas", "Ada Hegerberg", "Wendie Renard", "Sam Kerr", "Lucy Bronze", "Christine Sinclair", "Birgit Prinz", "Nadine Angerer", "Hope Solo",

  // Ľadový hokej
  "Mario Lemieux", "Bobby Orr", "Gordie Howe", "Maurice Richard", "Mark Messier", "Patrick Roy", "Dominik Hašek", "Martin Brodeur", "Steve Yzerman", "Joe Sakic",
  "Ray Bourque", "Nicklas Lidström", "Peter Forsberg", "Teemu Selänne", "Pavel Bure", "Sergei Fedorov", "Evgeni Malkin", "Nikita Kucherov", "Auston Matthews", "Leon Draisaitl",
  "Nathan MacKinnon", "Cale Makar", "Carey Price", "Henrik Lundqvist", "Steven Stamkos", "Patrick Kane", "Jonathan Toews", "Jarome Iginla", "Phil Esposito", "Bobby Hull",

  // Basketbal
  "Kevin Durant", "Giannis Antetokounmpo", "Nikola Jokić", "Luka Dončić", "Jayson Tatum", "Kyrie Irving", "James Harden", "Russell Westbrook", "Anthony Davis", "Kawhi Leonard",
  "Magic Johnson", "Larry Bird", "Kareem Abdul-Jabbar", "Wilt Chamberlain", "Bill Russell", "Tim Duncan", "Dirk Nowitzki", "Dwyane Wade", "Allen Iverson", "Kevin Garnett",
  "Scottie Pippen", "Dennis Rodman", "Carmelo Anthony", "Vince Carter", "Yao Ming", "Pau Gasol", "Tony Parker", "Derrick Rose", "Ja Morant", "Victor Wembanyama",
  "Sue Bird", "Diana Taurasi", "Candace Parker", "Breanna Stewart", "Caitlin Clark",

  // Formula 1 a motoršport
  "Ayrton Senna", "Alain Prost", "Juan Manuel Fangio", "Jackie Stewart", "Nigel Mansell", "Mika Häkkinen", "Jenson Button", "Nico Rosberg", "Daniel Ricciardo", "Carlos Sainz Jr.",
  "George Russell", "Oscar Piastri", "Sergio Pérez", "Valtteri Bottas", "Pierre Gasly", "Esteban Ocon", "Alex Albon", "Lance Stroll", "Marc Márquez", "Jorge Lorenzo",
  "Giacomo Agostini", "Casey Stoner", "Mick Doohan", "Sébastien Loeb", "Carlos Sainz Sr.",

  // Tenis
  "Maria Sharapova", "Monica Seles", "Chris Evert", "Billie Jean King", "Margaret Court", "Caroline Wozniacki", "Simona Halep", "Aryna Sabalenka", "Coco Gauff", "Emma Raducanu",
  "Ashleigh Barty", "Justine Henin", "Lindsay Davenport", "John McEnroe", "Jimmy Connors", "Pete Sampras", "Boris Becker", "Goran Ivanišević", "Daniil Medvedev", "Alexander Zverev",

  // Cyklistika
  "Tadej Pogačar", "Jonas Vingegaard", "Remco Evenepoel", "Mathieu van der Poel", "Wout van Aert", "Primož Roglič", "Geraint Thomas", "Chris Froome", "Egan Bernal", "Nairo Quintana",
  "Mark Cavendish", "Peter Sagan", "Eddy Merckx", "Bernard Hinault", "Miguel Induráin", "Alberto Contador", "Marco Pantani", "Fabian Cancellara", "Tom Boonen", "Vincenzo Nibali",
  "Marianne Vos", "Annemiek van Vleuten", "Demi Vollering", "Pauline Ferrand-Prévot", "Beryl Burton",

  // Atletika, plávanie a gymnastika
  "Noah Lyles", "Mondo Duplantis", "Jakob Ingebrigtsen", "Shelly-Ann Fraser-Pryce", "Elaine Thompson-Herah", "Florence Griffith Joyner", "Jackie Joyner-Kersee", "Sydney McLaughlin-Levrone", "Faith Kipyegon", "Sifan Hassan",
  "David Rudisha", "Kenenisa Bekele", "Haile Gebrselassie", "Abebe Bikila", "Daley Thompson", "Jan Železný", "Hicham El Guerrouj", "Wayde van Niekerk", "Yohan Blake", "Allyson Felix",
  "Ian Thorpe", "Ryan Lochte", "Caeleb Dressel", "Adam Peaty", "Sarah Sjöström", "Ariarne Titmus", "Summer McIntosh", "Rebecca Adlington", "Kristóf Milák", "Chad le Clos",
  "Nadia Comăneci", "Olga Korbut", "Kohei Uchimura", "Rebeca Andrade", "Sunisa Lee",

  // Bojové športy, golf a ďalšie veľké športy
  "Georges St-Pierre", "Anderson Silva", "Israel Adesanya", "Francis Ngannou", "Amanda Nunes", "Valentina Shevchenko", "José Aldo", "Nate Diaz", "Chuck Liddell", "Daniel Cormier",
  "Sugar Ray Leonard", "George Foreman", "Joe Frazier", "Evander Holyfield", "Lennox Lewis", "Tyson Fury", "Gervonta Davis", "Naoya Inoue", "Katie Taylor", "Claressa Shields",
  "Rory McIlroy", "Phil Mickelson", "Jack Nicklaus", "Arnold Palmer", "Jon Rahm", "Scottie Scheffler", "Nelly Korda", "Annika Sörenstam", "Lydia Ko", "Brooks Koepka",
  "Sachin Tendulkar", "Virat Kohli", "MS Dhoni", "Rohit Sharma", "Ben Stokes", "Jonny Wilkinson", "Dan Carter", "Richie McCaw", "Antoine Dupont", "Jonah Lomu",
  "Teddy Riner", "Clarisse Agbégnénou", "Aleksandr Karelin", "Mijaín López", "Jan-Ove Waldner", "Ma Long", "Lin Dan", "Viktor Axelsen", "Magnus Carlsen", "Garry Kasparov",
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

const WORLD_MOVIES = [
  "Titanic", "Avatar", "Avatar: The Way of Water", "The Godfather", "The Godfather Part II", "The Dark Knight", "Pulp Fiction", "Fight Club", "Forrest Gump", "The Green Mile",
  "The Shawshank Redemption", "Schindler's List", "Gladiator", "Braveheart", "Saving Private Ryan", "The Pianist", "Oppenheimer", "Barbie", "Inception", "Interstellar",
  "Tenet", "Dunkirk", "The Prestige", "Memento", "The Matrix", "The Matrix Reloaded", "Terminator", "Terminator 2", "Alien", "Aliens",
  "Predator", "Blade Runner", "Blade Runner 2049", "The Martian", "Gravity", "Apollo 13", "Dune", "Dune: Part Two", "Everything Everywhere All at Once", "Arrival",
  "Star Wars: A New Hope", "The Empire Strikes Back", "Return of the Jedi", "The Force Awakens", "Rogue One", "The Lord of the Rings: The Fellowship of the Ring", "The Two Towers", "The Return of the King", "The Hobbit", "Harry Potter and the Philosopher's Stone",
  "Harry Potter and the Prisoner of Azkaban", "Harry Potter and the Goblet of Fire", "Harry Potter and the Deathly Hallows", "Fantastic Beasts", "Pirates of the Caribbean", "The Hunger Games", "Catching Fire", "Twilight", "The Chronicles of Narnia", "Jurassic Park",
  "Jurassic World", "King Kong", "Godzilla", "Jaws", "E.T.", "Back to the Future", "Ghostbusters", "Indiana Jones", "Raiders of the Lost Ark", "Top Gun",
  "Top Gun: Maverick", "Mission: Impossible", "James Bond: Casino Royale", "Skyfall", "John Wick", "Die Hard", "Rocky", "Creed", "Rambo", "The Karate Kid",
  "Kill Bill", "Mad Max: Fury Road", "Fast & Furious", "The Transporter", "Ocean's Eleven", "Now You See Me", "The Italian Job", "The Bourne Identity", "The Equalizer", "The Revenant",
  "The Wolf of Wall Street", "Catch Me If You Can", "The Great Gatsby", "Once Upon a Time in Hollywood", "Goodfellas", "Scarface", "Taxi Driver", "The Silence of the Lambs", "Se7en", "Zodiac",
  "The Sixth Sense", "Shutter Island", "A Quiet Place", "The Conjuring", "It", "Scream", "Halloween", "A Nightmare on Elm Street", "The Exorcist", "Saw",
  "Home Alone", "Mrs. Doubtfire", "The Mask", "Ace Ventura", "Dumb and Dumber", "The Hangover", "Mean Girls", "Legally Blonde", "Pretty Woman", "Notting Hill",
  "Love Actually", "The Devil Wears Prada", "Mamma Mia!", "La La Land", "The Greatest Showman", "A Star Is Born", "Bohemian Rhapsody", "Rocketman", "Dirty Dancing", "Grease",
  "The Notebook", "The Fault in Our Stars", "Me Before You", "Edward Scissorhands", "Charlie and the Chocolate Factory", "Alice in Wonderland", "The Wizard of Oz", "Mary Poppins", "Wonka", "Enola Holmes",
  "The Truman Show", "Cast Away", "The Terminal", "Green Book", "Intouchables", "Slumdog Millionaire", "Parasite", "The Grand Budapest Hotel", "Knives Out", "Glass Onion",
];

const ANIMATED_MOVIES = [
  "The Lion King", "Frozen", "Frozen 2", "Moana", "Encanto", "Coco", "Tangled", "The Little Mermaid", "Beauty and the Beast", "Aladdin",
  "Mulan", "Pocahontas", "Hercules", "Tarzan", "Lilo & Stitch", "Peter Pan", "Pinocchio", "Dumbo", "Bambi", "Snow White and the Seven Dwarfs",
  "Cinderella", "Sleeping Beauty", "The Jungle Book", "The Aristocats", "One Hundred and One Dalmatians", "Robin Hood", "The Sword in the Stone", "The Princess and the Frog", "Wreck-It Ralph", "Ralph Breaks the Internet",
  "Zootopia", "Big Hero 6", "Raya and the Last Dragon", "Wish", "Bolt", "The Emperor's New Groove", "Atlantis: The Lost Empire", "Treasure Planet", "The Hunchback of Notre Dame", "Oliver & Company",
  "Toy Story", "Toy Story 2", "Toy Story 3", "Toy Story 4", "Finding Nemo", "Finding Dory", "Monsters, Inc.", "Monsters University", "The Incredibles", "Incredibles 2",
  "Cars", "Cars 2", "Cars 3", "Ratatouille", "WALL-E", "Up", "Brave", "Inside Out", "Inside Out 2", "The Good Dinosaur",
  "Onward", "Soul", "Luca", "Turning Red", "Elemental", "Lightyear", "A Bug's Life", "Kung Fu Panda", "Kung Fu Panda 2", "Kung Fu Panda 3",
  "Shrek", "Shrek 2", "Puss in Boots", "Puss in Boots: The Last Wish", "Madagascar", "Madagascar 2", "The Penguins of Madagascar", "How to Train Your Dragon", "How to Train Your Dragon 2", "The Croods",
  "Megamind", "The Boss Baby", "Trolls", "Spirit: Stallion of the Cimarron", "The Prince of Egypt", "Chicken Run", "Wallace & Gromit", "Flushed Away", "Bee Movie", "Over the Hedge",
  "Despicable Me", "Despicable Me 2", "Minions", "Sing", "Sing 2", "The Secret Life of Pets", "The Lorax", "The Grinch", "Migration", "The Super Mario Bros. Movie",
  "Ice Age", "Ice Age: The Meltdown", "Rio", "Rio 2", "Ferdinand", "The Peanuts Movie", "Epic", "Robots", "Horton Hears a Who!", "Spies in Disguise",
  "Hotel Transylvania", "Cloudy with a Chance of Meatballs", "The Smurfs", "Open Season", "Surf's Up", "The Angry Birds Movie", "Vivo", "The Mitchells vs. the Machines", "Spider-Man: Into the Spider-Verse", "Spider-Man: Across the Spider-Verse",
  "Coraline", "The Nightmare Before Christmas", "Corpse Bride", "Kubo and the Two Strings", "ParaNorman", "The Lego Movie", "The Lego Batman Movie", "Rango", "The Polar Express", "Arthur Christmas",
  "Pokémon: The First Movie", "My Neighbor Totoro", "Spirited Away", "Howl's Moving Castle", "Ponyo", "Kiki's Delivery Service", "The Boy and the Heron", "Your Name", "The Iron Giant", "The Simpsons Movie",
];

const HEROES_AND_VILLAINS = [
  "Spider-Man", "Iron Man", "Captain America", "Thor", "Hulk", "Black Widow", "Hawkeye", "Doctor Strange", "Black Panther", "Captain Marvel",
  "Ant-Man", "Wasp", "Scarlet Witch", "Vision", "Falcon", "Winter Soldier", "Star-Lord", "Gamora", "Drax", "Groot",
  "Rocket Raccoon", "Wolverine", "Deadpool", "Professor X", "Magneto", "Storm", "Cyclops", "Jean Grey", "Mystique", "Daredevil",
  "Punisher", "Blade", "Moon Knight", "She-Hulk", "Ms. Marvel", "Shang-Chi", "Nick Fury", "Silver Surfer", "Ghost Rider", "Fantastic Four",
  "Thanos", "Loki", "Ultron", "Green Goblin", "Doctor Octopus", "Venom", "Carnage", "Red Skull", "Hela", "Killmonger",
  "Batman", "Superman", "Wonder Woman", "Aquaman", "The Flash", "Cyborg", "Green Lantern", "Shazam", "Supergirl", "Batgirl",
  "Robin", "Nightwing", "Green Arrow", "Black Canary", "Martian Manhunter", "Blue Beetle", "Constantine", "Harley Quinn", "Catwoman", "Peacemaker",
  "Joker", "Lex Luthor", "Darkseid", "Bane", "The Riddler", "Penguin", "Two-Face", "Poison Ivy", "Scarecrow", "Deathstroke",
  "Harry Potter", "Hermione Granger", "Ron Weasley", "Albus Dumbledore", "Severus Snape", "Rubeus Hagrid", "Sirius Black", "Dobby", "Lord Voldemort", "Draco Malfoy",
  "Frodo Baggins", "Samwise Gamgee", "Gandalf", "Aragorn", "Legolas", "Gimli", "Galadriel", "Gollum", "Sauron", "Saruman",
  "Luke Skywalker", "Leia Organa", "Han Solo", "Obi-Wan Kenobi", "Yoda", "Ahsoka Tano", "The Mandalorian", "Grogu", "Darth Vader", "Emperor Palpatine",
  "Rey", "Kylo Ren", "Finn", "Chewbacca", "R2-D2", "C-3PO", "Katniss Everdeen", "Peeta Mellark", "Indiana Jones", "Lara Croft",
  "James Bond", "Ethan Hunt", "John Wick", "Rocky Balboa", "Rambo", "The Terminator", "Neo", "Trinity", "Jack Sparrow", "Zorro",
  "Sherlock Holmes", "Robin Hood", "Hercules", "Achilles", "King Arthur", "Merlin", "Mulan", "Tarzan", "Aladdin", "Peter Pan",
  "Elsa", "Moana", "Rapunzel", "Belle", "Ariel", "Simba", "Po", "Shrek", "Hiccup", "Toothless",
  "Optimus Prime", "Bumblebee", "Megatron", "Godzilla", "King Kong", "He-Man", "She-Ra", "Power Rangers", "Teenage Mutant Ninja Turtles", "The Mask",
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
    characters: uniqueCards([...cards("world-athletes"), ...WORLD_ATHLETES_EXTRA, ...WORLD_ATHLETES_MORE]),
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
  {
    id: "world-movies",
    name: "Svetové filmy",
    icon: "🎞️",
    characters: uniqueCards(WORLD_MOVIES),
  },
  {
    id: "animated-movies",
    name: "Animované filmy",
    icon: "🎥",
    characters: uniqueCards(ANIMATED_MOVIES),
  },
  {
    id: "heroes-villains",
    name: "Hrdinovia a zloduchovia",
    icon: "🦸",
    characters: uniqueCards(HEROES_AND_VILLAINS),
  },
  {
    id: "character-archetypes",
    name: "Postavy a archetypy",
    icon: "🎭",
    characters: GENERATED_CHARACTER_CARDS.slice(0, 1436),
  },
];

export function getCharacterCategories(languageOrIncludeSlovak: AppLanguage | boolean): CharacterCategory[] {
  const language: AppLanguage = typeof languageOrIncludeSlovak === "boolean"
    ? languageOrIncludeSlovak ? "sk" : "en"
    : languageOrIncludeSlovak;
  const globalCategories = CHARACTER_CATEGORIES.filter((category) => !category.id.startsWith("slovak-"));
  return [...globalCategories, LOCAL_PERSONALITY_CATEGORIES[language]];
}
