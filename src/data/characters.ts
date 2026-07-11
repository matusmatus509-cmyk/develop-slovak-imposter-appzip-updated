export interface CharacterCategory {
  id: string;
  name: string;
  icon: string;
  characters: string[];
}

export const CHARACTER_CATEGORIES: CharacterCategory[] = [
  {
    id: "sk-celeb",
    name: "Slovenské celebrity",
    icon: "🇸🇰",
    characters: [
      "Peter Sagan", "Marek Hamšík", "Miroslav Šatan", "Richard Müller",
      "Pavol Habera", "Jana Kirschner", "Kristína", "Maroš Kramár",
      "Milan Lasica", "Juraj Nvota", "Zuzana Čaputová", "Robert Fico",
      "Dominika Cibulková", "Daniela Hantuchová", "Ivan Bella", "Michal Rosič",
      "Adam Ďurica", "Peter Lipa", "Dežo Ursiny", "Vašo Patejdl",
      "Tomáš Jurík", "Igor Matovič", "Roman Juraško", "Braňo Moškovič",
    ],
  },
  {
    id: "world-celeb",
    name: "Svetové celebrity",
    icon: "🌟",
    characters: [
      "Elon Musk", "Taylor Swift", "Cristiano Ronaldo", "Lionel Messi",
      "Beyoncé", "Leonardo DiCaprio", "Keanu Reeves", "Tom Hanks",
      "Scarlett Johansson", "Jennifer Lopez", "Dwayne Johnson", "Will Smith",
      "Billie Eilish", "Ed Sheeran", "Justin Bieber", "Rihanna",
      "Lebron James", "Michael Jordan", "Usain Bolt", "Roger Federer",
      "Rafael Nadal", "Novak Djokovic", "Tiger Woods", "Michael Phelps",
      "Kanye West", "Drake", "Eminem", "Lady Gaga",
    ],
  },
  {
    id: "movies",
    name: "Filmové postavy",
    icon: "🎬",
    characters: [
      "Harry Potter", "Hermiona Grangerová", "Ron Weasley", "Lord Voldemort",
      "Spider-Man", "Batman", "Superman", "Wonder Woman",
      "Iron Man", "Thor", "Captain America", "Hulk",
      "Joker", "Darth Vader", "Luke Skywalker", "Princess Leia",
      "Jack Sparrow", "Frodo Pytlík", "Gandalf", "Legolas",
      "James Bond", "Indiana Jones", "Rocky Balboa", "Forrest Gump",
      "Shrek", "Donkey", "Buzz Rakeťák", "Woody",
      "Elsa", "Anna", "Simba", "Pumba",
      "Neo", "Morpheus", "Terminátor", "John Wick",
    ],
  },
  {
    id: "fairy-tales",
    name: "Rozprávkové postavy",
    icon: "🏰",
    characters: [
      "Popoluška", "Šípková Ruženka", "Snehulienka", "Červená čiapočka",
      "Pinocchio", "Alenka v krajine zázrakov", "Peter Pan", "Tinkerbell",
      "Biela Pani", "Drak Ohnivák", "Princ Charming", "Zlatovláska",
      "Janko Hraško", "Soľ nad zlato", "Smelý Zajko", "Jahodová Palculienka",
      "Mikuláš", "Snehová Kráľovná", "Palculienka", "Šípková Ruža",
      "Rumplestiltskin", "Čarovná Lampa", "Ali Baba", "Alibaba",
    ],
  },
  {
    id: "history",
    name: "Historické osobnosti",
    icon: "📜",
    characters: [
      "Napoleon Bonaparte", "Julius Caesar", "Alexander Veľký", "Kleopatra",
      "Albert Einstein", "Leonardo da Vinci", "Nikola Tesla", "Isaac Newton",
      "Marie Curie", "Charles Darwin", "Galileo Galilei", "Kopernik",
      "Martin Luther King", "Abraham Lincoln", "Winston Churchill", "Adolf Hitler",
      "Vladimir Lenin", "Joseph Stalin", "Mao Ce-tung", "Che Guevara",
      "Konfucius", "Platón", "Aristoteles", "Sokrates",
      "Elvis Presley", "John Lennon", "Frédéric Chopin", "Wolfgang Amadeus Mozart",
    ],
  },
  {
    id: "animals",
    name: "Zvieratá",
    icon: "🦁",
    characters: [
      "Lev", "Tiger", "Slon", "Žirafa",
      "Gorila", "Šimpanz", "Panda", "Koala",
      "Tučniak", "Flamingo", "Papagáj", "Sova",
      "Delfín", "Žralok", "Veľryba", "Chobotnica",
      "Krokodíl", "Hroch", "Nosorožec", "Zebra",
      "Kojot", "Vlk", "Medveď", "Líška",
      "Jaguár", "Gepard", "Leopard", "Puma",
    ],
  },
];
