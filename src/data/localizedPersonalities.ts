import type { AppLanguage } from "../i18n/LanguageProvider";

export interface LocalPersonalityCategory {
  id: string;
  name: string;
  icon: string;
  characters: string[];
}

function people(entries: string): string[] {
  return [...new Set(entries.split("|").map((entry) => entry.trim()).filter(Boolean))];
}

export const LOCAL_PERSONALITY_CATEGORIES: Record<AppLanguage, LocalPersonalityCategory> = {
  sk: {
    id: "local-personalities-sk",
    name: "Slovenské a české osobnosti",
    icon: "🇸🇰",
    characters: people(`
Peter Sagan|Petra Vlhová|Marek Hamšík|Zdeno Chára|Marián Hossa|Pavol Demitra|Peter Bondra|Miroslav Šatan|Peter Šťastný|Stan Mikita|
Dominika Cibulková|Daniela Hantuchová|Matej Tóth|Ján Volko|Michal Martikán|Elena Kaliská|Anastasia Kuzminová|Richard Tury|Ondrej Nepela|Attila Végh|
Zuzana Čaputová|Milan Rastislav Štefánik|Ľudovít Štúr|Juraj Jánošík|Alexander Dubček|Jozef Gabčík|Ivan Bella|Anton Bernolák|Pavol Országh Hviezdoslav|Andy Warhol|
Milan Lasica|Július Satinský|Marián Labuda|Jozef Kroner|Emília Vášáryová|Magda Vášáryová|Zdena Studenková|Tomáš Maštalír|Ján Koleník|Alexander Bárta|
Táňa Pauhofová|Petra Polnišová|Zuzana Mauréry|Marek Fašiang|Vladimír Kobielsky|Michaela Čobejová|Andrej Bičan|Adela Vinczeová|Viktor Vincze|Sajfa|
Miro Žbirka|Richard Müller|Marika Gombitová|Jožo Ráž|Pavol Habera|Peter Nagy|Jana Kirschner|Katarína Knechtová|Celeste Buckingham|Emma Drobná|
Adam Ďurica|Majk Spirit|Rytmus|Ego|Kali|Separ|Tina|Sima|Alan Murin|Kristína Peláková|
Ivan Tásler|Kamil Peteraj|Kandráčovci|Mária Čírová|Peter Cmorik|Desmod|IMT Smile|No Name|Horkýže Slíže|Kontrafakt|
Karel Gott|Lucie Bílá|Ewa Farna|Helena Vondráčková|Marta Kubišová|Jaromír Nohavica|Tomáš Klus|Marek Ztracený|Ben Cristovao|Calin|
Viktor Sheen|Yzomandias|Leo Beránek|Monika Bagárová|Richard Krajčo|Vojtěch Dyk|Jiří Korn|Michal David|Daniel Landa|Pokáč|
Jaromír Jágr|Petr Čech|Pavel Nedvěd|Tomáš Rosický|Patrik Schick|Petra Kvitová|Martina Navrátilová|Barbora Krejčíková|Ester Ledecká|Eva Adamczyková|
Ivan Lendl|Emil Zátopek|Roman Šebrle|Lukáš Krpálek|David Pastrňák|Dominik Hašek|Patrik Eliáš|Tomáš Berdych|Gabriela Soukalová|Martina Sáblíková|
Václav Havel|Tomáš Garrigue Masaryk|Karel Čapek|Miloš Forman|Jiří Menzel|Zdeněk Svěrák|Jan Werich|Vlasta Burian|Bolek Polívka|Jiřina Bohdalová|
Ivan Trojan|Ondřej Vetchý|Tatiana Dyková Vilhelmová|Tereza Ramba|Karel Roden|Hynek Čermák|Pavel Liška|Jakub Prachař|Libuše Šafránková|Josef Abrhám
`),
  },
  en: {
    id: "local-personalities-en",
    name: "British and American celebrities",
    icon: "🇬🇧",
    characters: people(`
Taylor Swift|Beyoncé|Billie Eilish|Lady Gaga|Ariana Grande|Miley Cyrus|Katy Perry|Madonna|Britney Spears|Olivia Rodrigo|
Bruno Mars|Justin Timberlake|Eminem|Snoop Dogg|Drake|Post Malone|Kendrick Lamar|Jay-Z|Usher|Pharrell Williams|
Adele|Ed Sheeran|Harry Styles|Dua Lipa|Elton John|Paul McCartney|Mick Jagger|Freddie Mercury|David Bowie|Amy Winehouse|
Chris Martin|Sam Smith|Lewis Capaldi|Robbie Williams|Sting|Ozzy Osbourne|Liam Gallagher|George Michael|Phil Collins|Tom Jones|
Tom Hanks|Leonardo DiCaprio|Brad Pitt|Will Smith|Dwayne Johnson|Robert Downey Jr.|Johnny Depp|Tom Cruise|Morgan Freeman|Samuel L. Jackson|
Jennifer Aniston|Angelina Jolie|Scarlett Johansson|Meryl Streep|Julia Roberts|Sandra Bullock|Anne Hathaway|Emma Stone|Zendaya|Margot Robbie|
Ryan Reynolds|Chris Hemsworth|Chris Evans|Jason Momoa|Keanu Reeves|Ben Affleck|Matt Damon|Hugh Jackman|Joaquin Phoenix|Timothée Chalamet|
Daniel Radcliffe|Emma Watson|Tom Holland|Benedict Cumberbatch|Idris Elba|Henry Cavill|Millie Bobby Brown|Jenna Ortega|Pedro Pascal|Cillian Murphy|
LeBron James|Michael Jordan|Stephen Curry|Kobe Bryant|Serena Williams|Simone Biles|Tiger Woods|Michael Phelps|Shaquille O'Neal|Tom Brady|
Lewis Hamilton|David Beckham|Harry Kane|Jude Bellingham|Wayne Rooney|Andy Murray|Anthony Joshua|Tyson Fury|Mo Farah|Marcus Rashford|
Oprah Winfrey|Ellen DeGeneres|Jimmy Fallon|Gordon Ramsay|Simon Cowell|David Attenborough|Bear Grylls|Jeremy Clarkson|James Corden|Jamie Oliver|
MrBeast|KSI|Logan Paul|Jake Paul|Emma Chamberlain|Mark Rober|Ryan Trahan|Khaby Lame|Charli D'Amelio|Addison Rae|
Barack Obama|Michelle Obama|Bill Gates|Steve Jobs|Elon Musk|Mark Zuckerberg|Jeff Bezos|Walt Disney|Stephen Hawking|J. K. Rowling|
William Shakespeare|Charles Darwin|Isaac Newton|Winston Churchill|Princess Diana|Queen Elizabeth II|King Charles III|Prince William|Prince Harry|Meghan Markle
`),
  },
  de: {
    id: "local-personalities-de",
    name: "Bekannte Persönlichkeiten aus Deutschland",
    icon: "🇩🇪",
    characters: people(`
Til Schweiger|Matthias Schweighöfer|Elyas M'Barek|Florian David Fitz|Jella Haase|Karoline Herfurth|Diane Kruger|Daniel Brühl|Moritz Bleibtreu|Nora Tschirner|
Christoph Waltz|Sandra Hüller|Emilia Schüle|Frederick Lau|Heike Makatsch|Wotan Wilke Möhring|Bjarne Mädel|Jan Josef Liefers|Axel Prahl|Uwe Ochsenknecht|
Helene Fischer|Herbert Grönemeyer|Udo Lindenberg|Peter Maffay|Nena|Sarah Connor|Mark Forster|LEA|Nina Chuba|Shirin David|
Apache 207|Cro|Sido|Capital Bra|RAF Camora|Bonez MC|Ayliva|Clueso|Max Giesinger|Johannes Oerding|
Wincent Weiss|Namika|Adel Tawil|Xavier Naidoo|Lena Meyer-Landrut|Michael Schulte|Kim Petras|Bill Kaulitz|Tom Kaulitz|Campino|
Manuel Neuer|Thomas Müller|Toni Kroos|Miroslav Klose|Bastian Schweinsteiger|Philipp Lahm|Joshua Kimmich|Jamal Musiala|Florian Wirtz|Kai Havertz|
Mats Hummels|Jürgen Klopp|Rudi Völler|Oliver Kahn|Lothar Matthäus|Michael Schumacher|Sebastian Vettel|Nico Rosberg|Dirk Nowitzki|Dennis Schröder|
Alexander Zverev|Steffi Graf|Boris Becker|Angelique Kerber|Franziska van Almsick|Malaika Mihambo|Gina Lückenkemper|Magdalena Neuner|Laura Dahlmeier|Felix Neureuther|
Thomas Gottschalk|Günther Jauch|Barbara Schöneberger|Heidi Klum|Stefan Raab|Joko Winterscheidt|Klaas Heufer-Umlauf|Jan Böhmermann|Palina Rojinski|Michelle Hunziker|
Rezo|Pamela Reif|Julien Bam|Dagi Bee|Bianca Heinicke|MontanaBlack|Gronkh|Shirin David|Knossi|Papaplatte|
Albert Einstein|Ludwig van Beethoven|Johann Sebastian Bach|Johann Wolfgang von Goethe|Friedrich Schiller|Karl Lagerfeld|Karl Benz|Robert Koch|Alexander von Humboldt|Sophie Scholl|
Otto von Bismarck|Konrad Adenauer|Angela Merkel|Frank-Walter Steinmeier|Olaf Scholz|Thomas Mann|Hermann Hesse|Anne Frank|Brüder Grimm|Bertolt Brecht|
Arnold Schwarzenegger|Falco|Conchita Wurst|Andreas Gabalier|Christoph Baumgartner|David Alaba|Dominic Thiem|Marcel Hirscher|Niki Lauda|Hansi Hinterseer
`),
  },
  es: {
    id: "local-personalities-es",
    name: "Personalidades famosas de España y Latinoamérica",
    icon: "🇪🇸",
    characters: people(`
Antonio Banderas|Penélope Cruz|Javier Bardem|Mario Casas|Blanca Suárez|Úrsula Corberó|Miguel Ángel Silvestre|Ester Expósito|Álvaro Morte|Pedro Alonso|
Jaime Lorente|Itziar Ituño|Najwa Nimri|Paz Vega|Elsa Pataky|Miguel Herrán|María Pedraza|Yon González|Clara Galle|Georgina Amorós|
Rosalía|Aitana|Enrique Iglesias|Julio Iglesias|Alejandro Sanz|David Bisbal|Pablo Alborán|Lola Índigo|Quevedo|C. Tangana|
Ana Mena|Abraham Mateo|Manuel Carrasco|Mónica Naranjo|Miguel Bosé|Rocío Jurado|Raphael|Amaia Montero|David Bustamante|Rels B|
Shakira|Karol G|Bad Bunny|J Balvin|Maluma|Rauw Alejandro|Daddy Yankee|Luis Fonsi|Ozuna|Feid|
Sebastián Yatra|Camilo|Becky G|Natti Natasha|TINI|Maria Becerra|Nicki Nicole|Bizarrap|Duki|Paulo Londra|
Lionel Messi|Diego Maradona|Cristiano Ronaldo|Rafael Nadal|Carlos Alcaraz|Pau Gasol|Fernando Alonso|Marc Márquez|Andrés Iniesta|Xavi Hernández|
Sergio Ramos|Iker Casillas|Gerard Piqué|Lamine Yamal|Aitana Bonmatí|Alexia Putellas|Carolina Marín|Mireia Belmonte|Garbiñe Muguruza|Carlos Sainz|
Ibai Llanos|El Rubius|AuronPlay|TheGrefg|Willyrex|Vegetta777|Dulceida|María Pombo|Georgina Rodríguez|Pablo Motos|
Sofía Vergara|Salma Hayek|Gael García Bernal|Diego Luna|Eugenio Derbez|Guillermo del Toro|Pedro Pascal|Anya Taylor-Joy|Ricardo Darín|Luis Miguel|
Frida Kahlo|Pablo Picasso|Salvador Dalí|Miguel de Cervantes|Federico García Lorca|Gabriel García Márquez|Isabel Allende|Jorge Luis Borges|Fernando Botero|Mario Vargas Llosa|
Che Guevara|Simón Bolívar|Eva Perón|Pope Francis|Rigoberta Menchú|Carlos Slim|Alfonso Cuarón|Alejandro González Iñárritu|Juanes|Ricky Martin|
Thalía|Jennifer Lopez|Gloria Estefan|Marc Anthony|Don Omar|Romeo Santos|Nicky Jam|Anuel AA|Myke Towers|Tokischa
`),
  },
  fr: {
    id: "local-personalities-fr",
    name: "Personnalités françaises célèbres",
    icon: "🇫🇷",
    characters: people(`
Omar Sy|Jean Dujardin|Marion Cotillard|Vincent Cassel|Léa Seydoux|Audrey Tautou|Sophie Marceau|Dany Boon|François Cluzet|Gilles Lellouche|
Pierre Niney|Adèle Exarchopoulos|Camille Cottin|Juliette Binoche|Isabelle Huppert|Louis Garrel|Romain Duris|Kad Merad|Jamel Debbouze|Christian Clavier|
Gims|Aya Nakamura|Stromae|Angèle|Vianney|Louane|Slimane|Vitaa|Kendji Girac|Dadju|
Ninho|Gazo|Niska|Soprano|Black M|Clara Luciani|Zaz|Indila|M. Pokora|Julien Doré|
Vanessa Paradis|Jean-Jacques Goldman|Mylène Farmer|Patrick Bruel|Florent Pagny|Michel Sardou|Édith Piaf|Johnny Hallyday|Charles Aznavour|Serge Gainsbourg|
Kylian Mbappé|Zinédine Zidane|Antoine Griezmann|Karim Benzema|Olivier Giroud|Paul Pogba|N'Golo Kanté|Thierry Henry|Hugo Lloris|Ousmane Dembélé|
Victor Wembanyama|Tony Parker|Rudy Gobert|Teddy Riner|Léon Marchand|Antoine Dupont|Julian Alaphilippe|Romain Bardet|Martin Fourcade|Clarisse Agbégnénou|
Gaël Monfils|Jo-Wilfried Tsonga|Amélie Mauresmo|Caroline Garcia|Sébastien Loeb|Esteban Ocon|Pierre Gasly|Fabio Quartararo|Franck Ribéry|Didier Deschamps|
Squeezie|Cyprien|Tibo InShape|Léna Situations|Michou|Inoxtag|Amixem|Natoo|HugoDécrypte|EnjoyPhoenix|
Thomas Pesquet|Cyril Lignac|Philippe Etchebest|Nagui|Cyril Hanouna|Nikos Aliagas|Jean-Luc Reichmann|Camille Combal|Karine Le Marchand|Denis Brogniart|
Napoléon Bonaparte|Jeanne d'Arc|Marie Curie|Louis Pasteur|Gustave Eiffel|Victor Hugo|Antoine de Saint-Exupéry|Claude Monet|Coco Chanel|Christian Dior|
Auguste Rodin|Émile Zola|Alexandre Dumas|Molière|Voltaire|René Descartes|Blaise Pascal|Jacques Cousteau|Louis de Funès|Brigitte Bardot|
Daft Punk|David Guetta|DJ Snake|Christine and the Queens|Zaho de Sagazan|Pierre Garnier|Santa|Tayc|Ronisia|La Zarra
`),
  },
  pt: {
    id: "local-personalities-pt",
    name: "Personalidades famosas de Portugal e do Brasil",
    icon: "🇵🇹",
    characters: people(`
Cristiano Ronaldo|José Mourinho|Luís Figo|Bernardo Silva|Bruno Fernandes|Diogo Jota|João Félix|Rúben Dias|Rafael Leão|Pepe|
Eusébio|Ricardo Quaresma|Nani|Rui Costa|Vítor Baía|João Cancelo|Gonçalo Ramos|Miguel Oliveira|Rui Patrício|Nelson Évora|
Daniela Ruah|Albano Jerónimo|Rita Pereira|José Condessa|Diogo Morgado|Sara Sampaio|Nuno Lopes|Pêpê Rapazote|Joaquim de Almeida|Beatriz Batarda|
Cristina Ferreira|Catarina Furtado|Manuel Luís Goucha|Vasco Palmeirim|Ricardo Araújo Pereira|Herman José|Fernando Rocha|César Mourão|Joana Marques|Filomena Cautela|
Mariza|Ana Moura|Carminho|Tony Carreira|David Carreira|Mickael Carreira|Diogo Piçarra|Carolina Deslandes|Bárbara Tinoco|Bárbara Bandeira|
Nuno Ribeiro|Dino D'Santiago|Plutonio|Bispo|Ivandro|Slow J|António Zambujo|Salvador Sobral|Iolanda|NAPA|
Neymar|Vinícius Júnior|Pelé|Ronaldo Nazário|Ronaldinho|Kaká|Romário|Roberto Carlos|Marta|Endrick|
Gabriel Medina|Ayrton Senna|Rubens Barrichello|Anderson Silva|José Aldo|Amanda Nunes|Gustavo Kuerten|Rebeca Andrade|Rayssa Leal|João Fonseca|
Fernanda Montenegro|Fernanda Torres|Wagner Moura|Rodrigo Santoro|Lázaro Ramos|Taís Araújo|Bruna Marquezine|Cauã Reymond|Paolla Oliveira|Giovanna Antonelli|
Selton Mello|Alice Braga|Sônia Braga|Marcos Mion|Luciano Huck|Angélica|Fátima Bernardes|Tatá Werneck|Paulo Gustavo|Renato Aragão|
Anitta|Ivete Sangalo|Ludmilla|Luísa Sonza|Pabllo Vittar|IZA|Marília Mendonça|Ana Castela|Simone Mendes|Gusttavo Lima|
Luan Santana|Jorge & Mateus|Henrique & Juliano|Alok|Seu Jorge|Caetano Veloso|Gilberto Gil|Chico Buarque|Roberto Carlos|Djavan|
Whindersson Nunes|Felipe Neto|Virginia Fonseca|Carlinhos Maia|Gkay|Juliette|Maisa Silva|Larissa Manoela|Ney Matogrosso|Xuxa|
Paulo Coelho|Oscar Niemeyer|Machado de Assis|Jorge Amado|Clarice Lispector|Fernando Pessoa|José Saramago|Luís de Camões|Vasco da Gama|Santos Dumont
`),
  },
};
