/**
 * "Svetoví športovci" deck for "Hádaj kto som".
 *
 * Only household names — athletes a normal person recognises even without
 * following that sport. Grouped by sport so coverage stays balanced across
 * football, hockey, basketball, Formula 1, tennis, athletics, boxing, cycling
 * and winter sports, instead of drowning in one discipline.
 *
 * Athlete names are not translated, so unlike the movie and series decks this
 * one is shared by every language. For the same reason names use their
 * international spelling (Alexander Ovechkin, not Ovečkin) — a Spanish or
 * French player has to be able to read the card.
 *
 * Slovak and Czech athletes belong to the separate "Slovenskí športovci"
 * category. Only the handful who are genuine worldwide legends appear here:
 * Jaromír Jágr, Dominik Hašek, Martina Navrátilová, Emil Zátopek, Peter Sagan.
 */

function athletes(entries: string): string[] {
  return entries
    .split("|")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/** Futbal. */
const FOOTBALL = athletes(`
Cristiano Ronaldo|Lionel Messi|Neymar|Kylian Mbappé|Erling Haaland|Pelé|Diego Maradona|Zinedine Zidane|David Beckham|Ronaldinho|
Ronaldo Nazário|Andrés Iniesta|Xavi|Luka Modrić|Mohamed Salah|Karim Benzema|Robert Lewandowski|Vinícius Júnior|Jude Bellingham|Antoine Griezmann|
Kevin De Bruyne|Virgil van Dijk|Gianluigi Buffon|Manuel Neuer|Iker Casillas|Sergio Ramos|Gerard Piqué|Thierry Henry|Zlatan Ibrahimović|Kaká|
Luís Figo|Roberto Carlos|Paolo Maldini|Didier Drogba|Gareth Bale|Wayne Rooney|Steven Gerrard|Frank Lampard|Andrea Pirlo|Francesco Totti|
Johan Cruyff|Franz Beckenbauer|Marco van Basten|Harry Kane|Son Heung-min|Lamine Yamal|Toni Kroos|Sergio Agüero|Marta|Alex Morgan|
Aitana Bonmatí|Alexia Putellas
`);

/** Ľadový hokej. */
const ICE_HOCKEY = athletes(`
Wayne Gretzky|Sidney Crosby|Alexander Ovechkin|Connor McDavid|Jaromír Jágr|Mario Lemieux|Bobby Orr|Gordie Howe|Dominik Hašek|Patrick Roy|
Martin Brodeur|Nicklas Lidström|Teemu Selänne|Pavel Bure|Evgeni Malkin|Auston Matthews|Leon Draisaitl|Nathan MacKinnon
`);

/** Basketbal. */
const BASKETBALL = athletes(`
LeBron James|Michael Jordan|Stephen Curry|Kobe Bryant|Shaquille O'Neal|Kevin Durant|Giannis Antetokounmpo|Nikola Jokić|Luka Dončić|Magic Johnson|
Larry Bird|Kareem Abdul-Jabbar|Wilt Chamberlain|Dirk Nowitzki|Dwyane Wade|Allen Iverson|Scottie Pippen|Dennis Rodman|Vince Carter|Yao Ming|
Pau Gasol|Tony Parker|Victor Wembanyama
`);

/** Formula 1 a motoršport. */
const MOTORSPORT = athletes(`
Lewis Hamilton|Max Verstappen|Michael Schumacher|Ayrton Senna|Sebastian Vettel|Fernando Alonso|Niki Lauda|Alain Prost|Kimi Räikkönen|Charles Leclerc|
Lando Norris|Daniel Ricciardo|Nico Rosberg|Jenson Button|Mika Häkkinen|Juan Manuel Fangio|George Russell|Oscar Piastri|Carlos Sainz|Valentino Rossi|
Marc Márquez|Sébastien Loeb
`);

/** Tenis. */
const TENNIS = athletes(`
Roger Federer|Rafael Nadal|Novak Djokovic|Serena Williams|Venus Williams|Maria Sharapova|Andre Agassi|Pete Sampras|Boris Becker|Steffi Graf|
Björn Borg|John McEnroe|Andy Murray|Carlos Alcaraz|Jannik Sinner|Iga Świątek|Naomi Osaka|Martina Navrátilová|Monica Seles
`);

/** Atletika, plávanie a gymnastika. */
const ATHLETICS_AND_SWIMMING = athletes(`
Usain Bolt|Michael Phelps|Simone Biles|Carl Lewis|Jesse Owens|Mo Farah|Eliud Kipchoge|Katie Ledecky|Caeleb Dressel|Mondo Duplantis|
Noah Lyles|Allyson Felix|Nadia Comăneci|Sergey Bubka|Florence Griffith Joyner|Emil Zátopek
`);

/** Box a MMA. */
const COMBAT_SPORTS = athletes(`
Muhammad Ali|Mike Tyson|Floyd Mayweather|Manny Pacquiao|Conor McGregor|Khabib Nurmagomedov|Anthony Joshua|Tyson Fury|Canelo Álvarez|Oleksandr Usyk|
George Foreman|Evander Holyfield|Ronda Rousey|Jon Jones
`);

/** Cyklistika. */
const CYCLING = athletes(`
Peter Sagan|Tadej Pogačar|Eddy Merckx|Miguel Induráin|Chris Froome|Mark Cavendish|Jonas Vingegaard|Marco Pantani|Bernard Hinault|Alberto Contador
`);

/** Zimné športy. */
const WINTER_SPORTS = athletes(`
Lindsey Vonn|Mikaela Shiffrin|Marcel Hirscher|Shaun White
`);

/** Golf, americký futbal a ďalšie. */
const OTHER_SPORTS = athletes(`
Tiger Woods|Rory McIlroy|Tom Brady|Tony Hawk|Magnus Carlsen|Garry Kasparov
`);

/**
 * Final world athletes deck.
 * Order is stable and duplicates are removed so the deck can be diffed easily.
 */
export const WORLD_ATHLETES: string[] = [
  ...new Set([
    ...FOOTBALL,
    ...ICE_HOCKEY,
    ...BASKETBALL,
    ...MOTORSPORT,
    ...TENNIS,
    ...ATHLETICS_AND_SWIMMING,
    ...COMBAT_SPORTS,
    ...CYCLING,
    ...WINTER_SPORTS,
    ...OTHER_SPORTS,
  ]),
];
