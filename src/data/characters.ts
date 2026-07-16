export interface CharacterCategory {
  id: string;
  name: string;
  icon: string;
  characters: string[];
}

// Karty su rozdelene podla typu, aby si hraci mohli vybrat tematicky balik.
export const CHARACTER_CATEGORIES: CharacterCategory[] = [
  {
    id: "world-personalities",
    name: "Svetove osobnosti",
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
    name: "Svetovi sportovci",
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
    name: "Svetovi YouTuberi",
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
