/**
 * Ručne kurátorovaná databáza chartových hitov pre hudobný kvíz.
 *
 * Cieľ: najznámejšie skladby posledných rokov (2015–2025) + nadčasové
 * klasiky, ktoré sa dajú spoľahlivo zahmkať a uhádnuť. Každý riadok nesie
 * plné metadáta (rok, žáner, náročnosť, hum), takže výber aj ukážky
 * pracujú s nimi bez profilovania interpreta.
 *
 * Riadok: `Názov|Interpret|Rok|Žáner|Náročnosť|hum`
 * Neanglickí interpreti sú prepísaní cez CHART_HITS_ARTIST_LANGUAGES.
 *
 * Tento zoznam sa pravidelne dopĺňa; `npm run update:songs` k nemu
 * pripája aj automaticky stiahnuté aktuálne rebríčky (chartAuto.ts).
 */
export const CHART_HITS_SONG_EXPANSION = String.raw`
Uptown Funk|Mark Ronson & Bruno Mars|2014|funk|easy|hum
Locked Out of Heaven|Bruno Mars|2012|pop|easy|hum
Grenade|Bruno Mars|2010|pop|easy|hum
When I Was Your Man|Bruno Mars|2013|pop|easy|hum
24K Magic|Bruno Mars|2016|funk|easy|hum
That's What I Like|Bruno Mars|2017|funk|medium|hum
Stay|The Kid LAROI & Justin Bieber|2021|pop|easy|hum
Love Yourself|Justin Bieber|2015|pop|easy|hum
Sorry|Justin Bieber|2015|pop|easy|hum
Cold Water|Major Lazer & Justin Bieber|2016|dance|medium|hum
Peaches|Justin Bieber|2021|pop|medium|hum
Shape of You|Ed Sheeran|2017|pop|easy|hum
Perfect|Ed Sheeran|2017|pop|easy|hum
Photograph|Ed Sheeran|2015|pop|easy|hum
Castle on the Hill|Ed Sheeran|2017|pop|medium|hum
Bad Habits|Ed Sheeran|2021|dance|easy|hum
Shivers|Ed Sheeran|2021|pop|easy|hum
Thinking Out Loud|Ed Sheeran|2014|pop|easy|hum
Hello|Adele|2015|pop|easy|hum
Rolling in the Deep|Adele|2011|pop|easy|hum
Someone Like You|Adele|2011|pop|easy|hum
Set Fire to the Rain|Adele|2011|pop|easy|hum
Skyfall|Adele|2012|soundtrack|easy|hum
Easy On Me|Adele|2021|pop|easy|hum
Umbrella|Rihanna|2007|rnb|easy|hum
Diamonds|Rihanna|2012|pop|easy|hum
We Found Love|Rihanna & Calvin Harris|2011|dance|easy|hum
Don't Stop the Music|Rihanna|2007|dance|easy|hum
Love on the Brain|Rihanna|2016|rnb|medium|hum
This Is What You Came For|Calvin Harris & Rihanna|2016|dance|easy|hum
Summer|Calvin Harris|2014|dance|easy|hum
Feel So Close|Calvin Harris|2011|dance|medium|hum
Miracle|Calvin Harris & Ellie Goulding|2023|dance|easy|hum
Titanium|David Guetta & Sia|2011|dance|easy|hum
Hey Mama|David Guetta|2015|dance|medium|hum
Without You|David Guetta & Usher|2011|dance|medium|hum
I'm Good (Blue)|David Guetta & Bebe Rexha|2022|dance|easy|hum
Chandelier|Sia|2014|pop|easy|hum
Cheap Thrills|Sia|2016|dance|easy|hum
Unstoppable|Sia|2016|pop|easy|hum
Bad Guy|Billie Eilish|2019|pop|easy|hum
Ocean Eyes|Billie Eilish|2016|pop|medium|hum
Everything I Wanted|Billie Eilish|2019|pop|medium|hum
Happier Than Ever|Billie Eilish|2021|pop|medium|hum
Lovely|Billie Eilish & Khalid|2018|pop|easy|hum
Birds of a Feather|Billie Eilish|2024|pop|easy|hum
Lunch|Billie Eilish|2024|pop|medium|hum
What Was I Made For|Billie Eilish|2023|soundtrack|medium|hum
Levitating|Dua Lipa|2020|dance|easy|hum
Don't Start Now|Dua Lipa|2019|dance|easy|hum
New Rules|Dua Lipa|2017|dance|easy|hum
One Kiss|Calvin Harris & Dua Lipa|2018|dance|easy|hum
Physical|Dua Lipa|2020|dance|medium|hum
Houdini|Dua Lipa|2023|dance|easy|hum
Illusion|Dua Lipa|2024|dance|medium|hum
Training Season|Dua Lipa|2024|pop|medium|hum
Vampire|Olivia Rodrigo|2023|pop|easy|hum
Drivers License|Olivia Rodrigo|2021|pop|easy|hum
Good 4 U|Olivia Rodrigo|2021|pop|easy|hum
Deja Vu|Olivia Rodrigo|2021|pop|medium|hum
Cruel Summer|Taylor Swift|2019|pop|easy|hum
Blank Space|Taylor Swift|2014|pop|easy|hum
Shake It Off|Taylor Swift|2014|pop|easy|hum
Love Story|Taylor Swift|2008|pop|easy|hum
You Belong with Me|Taylor Swift|2009|pop|easy|hum
Karma|Taylor Swift|2022|pop|easy|hum
Lover|Taylor Swift|2019|pop|medium|hum
Is It Over Now|Taylor Swift|2023|pop|medium|hum
Fortnight|Taylor Swift & Post Malone|2024|pop|medium|hum
I Can Do It With a Broken Heart|Taylor Swift|2024|pop|medium|hum
greedy|Tate McRae|2023|pop|easy|hum
Exes|Tate McRae|2023|pop|medium|hum
Taste|Sabrina Carpenter|2024|pop|easy|hum
Please Please Please|Sabrina Carpenter|2024|pop|easy|hum
Nonsense|Sabrina Carpenter|2022|pop|medium|hum
Feather|Sabrina Carpenter|2023|pop|medium|hum
Good Luck, Babe!|Chappell Roan|2024|pop|easy|hum
Pink Pony Club|Chappell Roan|2023|pop|medium|hum
HOT TO GO!|Chappell Roan|2023|pop|easy|hum
The Subway|Chappell Roan|2025|pop|medium|hum
Messy|Lola Young|2024|pop|medium|hum
That's So True|Gracie Abrams|2024|pop|medium|hum
Risk|Gracie Abrams|2024|pop|medium|hum
Beautiful Things|Benson Boone|2024|pop|easy|hum
Slow It Down|Benson Boone|2024|pop|medium|hum
Mystical Magical|Benson Boone|2025|pop|medium|hum
Lose Control|Teddy Swims|2023|soul|easy|hum
Stargazing|Myles Smith|2024|pop|medium|hum
Too Sweet|Hozier|2024|rock|easy|hum
Take Me to Church|Hozier|2013|rock|easy|hum
A Bar Song (Tipsy)|Shaboozey|2024|country|easy|hum
I Had Some Help|Post Malone & Morgan Wallen|2024|country|easy|hum
Chemical|Post Malone|2023|pop|medium|hum
Circles|Post Malone|2019|pop|easy|hum
rockstar|Post Malone & 21 Savage|2017|rap|easy|nohum
Sunflower|Post Malone & Swae Lee|2018|soundtrack|easy|hum
Old Town Road|Lil Nas X|2019|rap|easy|nohum
Montero (Call Me By Your Name)|Lil Nas X|2021|pop|medium|hum
Industry Baby|Lil Nas X & Jack Harlow|2021|rap|medium|nohum
Lovin On Me|Jack Harlow|2023|rap|easy|nohum
First Class|Jack Harlow|2022|rap|medium|nohum
Say So|Doja Cat|2020|dance|easy|hum
Paint The Town Red|Doja Cat|2023|rap|easy|nohum
Agora Hills|Doja Cat|2023|rnb|medium|hum
Woman|Doja Cat|2021|dance|medium|hum
Kiss Me More|Doja Cat & SZA|2021|pop|easy|hum
Kill Bill|SZA|2022|rnb|easy|hum
Good Days|SZA|2020|rnb|medium|hum
Snooze|SZA|2022|rnb|medium|hum
Bad Habit|Steve Lacy|2022|rnb|easy|hum
Not Like Us|Kendrick Lamar|2024|rap|easy|nohum
Lose Yourself|Eminem|2002|rap|easy|nohum
Without Me|Eminem|2002|rap|easy|nohum
In Da Club|50 Cent|2003|rap|easy|nohum
Still D.R.E.|Dr. Dre & Snoop Dogg|1999|rap|easy|nohum
Houdini|Eminem|2024|rap|medium|nohum
God's Plan|Drake|2018|rap|easy|nohum
One Dance|Drake|2016|dance|easy|hum
Hotline Bling|Drake|2015|pop|easy|hum
In My Feelings|Drake|2018|rap|medium|nohum
Save Your Tears|The Weeknd|2020|pop|easy|hum
Starboy|The Weeknd & Daft Punk|2016|dance|easy|hum
Can't Feel My Face|The Weeknd|2015|funk|easy|hum
Call Out My Name|The Weeknd|2018|rnb|medium|hum
Timeless|The Weeknd & Playboi Carti|2024|rap|medium|nohum
Dance Monkey|Tones and I|2019|pop|easy|hum
Somebody That I Used to Know|Gotye & Kimbra|2011|pop|easy|hum
Counting Stars|OneRepublic|2013|pop|easy|hum
Apologize|OneRepublic|2007|pop|easy|hum
Demons|Imagine Dragons|2012|rock|easy|hum
Radioactive|Imagine Dragons|2012|rock|easy|hum
Believer|Imagine Dragons|2017|rock|easy|hum
Thunder|Imagine Dragons|2017|pop|easy|hum
Bones|Imagine Dragons|2022|rock|easy|hum
Enemy|Imagine Dragons & JID|2021|soundtrack|easy|hum
Viva la Vida|Coldplay|2008|rock|easy|hum
The Scientist|Coldplay|2002|rock|easy|hum
Fix You|Coldplay|2005|rock|easy|hum
Clocks|Coldplay|2002|rock|easy|hum
Paradise|Coldplay|2011|pop|easy|hum
Something Just Like This|The Chainsmokers & Coldplay|2017|dance|easy|hum
Hymn for the Weekend|Coldplay|2015|pop|easy|hum
Mr. Brightside|The Killers|2004|rock|easy|hum
Somebody Told Me|The Killers|2004|rock|medium|hum
Human|The Killers|2008|rock|medium|hum
Seven Nation Army|The White Stripes|2003|rock|easy|hum
Wonderwall|Oasis|1995|rock|easy|hum
Don't Look Back in Anger|Oasis|1996|rock|easy|hum
Live Forever|Oasis|1994|rock|medium|hum
Zombie|The Cranberries|1994|rock|easy|hum
Dreams|Fleetwood Mac|1977|rock|easy|hum
Go Your Own Way|Fleetwood Mac|1977|rock|easy|hum
Losing My Religion|R.E.M.|1991|rock|easy|hum
Everybody Hurts|R.E.M.|1992|rock|medium|hum
With or Without You|U2|1987|rock|easy|hum
I Still Haven't Found What I'm Looking For|U2|1987|rock|easy|hum
Beautiful Day|U2|2000|rock|easy|hum
Smells Like Teen Spirit|Nirvana|1991|rock|easy|hum
Come as You Are|Nirvana|1991|rock|easy|hum
Livin' on a Prayer|Bon Jovi|1986|rock|easy|hum
It's My Life|Bon Jovi|2000|rock|easy|hum
Sweet Child O' Mine|Guns N' Roses|1987|rock|easy|hum
November Rain|Guns N' Roses|1991|rock|medium|hum
Paradise City|Guns N' Roses|1987|rock|easy|hum
Smoke on the Water|Deep Purple|1972|rock|easy|hum
Highway to Hell|AC/DC|1979|rock|easy|hum
Back in Black|AC/DC|1980|rock|easy|hum
Enter Sandman|Metallica|1991|metal|easy|hum
Nothing Else Matters|Metallica|1991|metal|easy|hum
Numb|Linkin Park|2003|rock|easy|hum
In the End|Linkin Park|2000|rock|easy|hum
Faint|Linkin Park|2003|rock|medium|hum
Pumped Up Kicks|Foster the People|2010|indie|easy|hum
Little Talks|Of Monsters and Men|2011|indie|easy|hum
Ho Hey|The Lumineers|2012|indie|easy|hum
Riptide|Vance Joy|2013|indie|easy|hum
I'm Yours|Jason Mraz|2008|pop|easy|hum
Let Her Go|Passenger|2012|pop|easy|hum
Hey Brother|Avicii|2013|dance|easy|hum
Wake Me Up|Avicii|2013|dance|easy|hum
Levels|Avicii|2011|dance|easy|hum
The Nights|Avicii|2014|dance|medium|hum
Faded|Alan Walker|2015|dance|easy|hum
Alone|Alan Walker|2016|dance|medium|hum
Closer|The Chainsmokers & Halsey|2016|dance|easy|hum
Don't Let Me Down|The Chainsmokers & Daya|2016|dance|easy|hum
Happier|Marshmello & Bastille|2018|dance|easy|hum
Animals|Maroon 5|2014|pop|easy|hum
Sugar|Maroon 5|2014|pop|easy|hum
Payphone|Maroon 5 & Wiz Khalifa|2012|pop|easy|hum
Moves Like Jagger|Maroon 5 & Christina Aguilera|2011|pop|easy|hum
Maps|Maroon 5|2014|pop|medium|hum
Girls Like You|Maroon 5 & Cardi B|2018|pop|easy|hum
Memories|Maroon 5|2019|pop|easy|hum
One More Night|Maroon 5|2012|pop|medium|hum
Happy|Pharrell Williams|2013|funk|easy|hum
Get Lucky|Daft Punk|2013|funk|easy|hum
Feel It Still|Portugal. The Man|2017|rock|medium|hum
Can't Stop the Feeling!|Justin Timberlake|2016|funk|easy|hum
Mirrors|Justin Timberlake|2013|pop|easy|hum
SexyBack|Justin Timberlake|2006|funk|easy|hum
Cry Me a River|Justin Timberlake|2002|pop|medium|hum
Suit & Tie|Justin Timberlake & Jay-Z|2013|funk|medium|hum
Party Rock Anthem|LMFAO|2011|dance|easy|hum
Thrift Shop|Macklemore & Ryan Lewis|2012|rap|easy|nohum
Can't Hold Us|Macklemore & Ryan Lewis|2013|rap|easy|nohum
See You Again|Wiz Khalifa & Charlie Puth|2015|soundtrack|easy|hum
We Don't Talk Anymore|Charlie Puth & Selena Gomez|2016|pop|easy|hum
Attention|Charlie Puth|2017|pop|easy|hum
How Long|Charlie Puth|2017|pop|medium|hum
Despacito|Luis Fonsi & Daddy Yankee|2017|latin|easy|hum
Bailando|Enrique Iglesias|2014|latin|easy|hum
Hero|Enrique Iglesias|2001|latin|easy|hum
El Perdón|Nicky Jam & Enrique Iglesias|2015|latin|easy|hum
Gasolina|Daddy Yankee|2004|latin|easy|hum
Con Calma|Daddy Yankee & Snow|2019|latin|easy|hum
Tusa|Karol G & Nicki Minaj|2019|latin|easy|hum
Vivir Mi Vida|Marc Anthony|2013|latin|easy|hum
Macarena|Los del Río|1996|latin|easy|hum
Livin' la Vida Loca|Ricky Martin|1999|latin|easy|hum
María|Ricky Martin|1995|latin|easy|hum
Suavemente|Elvis Crespo|1998|latin|easy|hum
Ai Se Eu Te Pego|Michel Teló|2011|latin|easy|hum
Mas Que Nada|Jorge Ben Jor|1963|latin|easy|hum
Garota de Ipanema|Tom Jobim & João Gilberto|1964|latin|medium|hum
Evidências|Chitãozinho & Xororó|1990|latin|medium|hum
Envolver|Anitta|2021|latin|medium|hum
La Vie en rose|Édith Piaf|1947|chanson|easy|hum
Je veux|Zaz|2010|chanson|easy|hum
Dernière danse|Indila|2013|chanson|easy|hum
Papaoutai|Stromae|2013|dance|easy|hum
Alors on danse|Stromae|2009|dance|easy|hum
Formidable|Stromae|2013|chanson|medium|hum
J'ai demandé à la lune|Indochine|2002|rock|medium|hum
Djadja|Aya Nakamura|2018|pop|medium|hum
Copines|Aya Nakamura|2018|pop|medium|hum
99 Luftballons|Nena|1983|rock|easy|hum
Haus am See|Peter Fox|2008|pop|easy|hum
Zukunft Pink|Peter Fox & Inéa|2023|pop|medium|hum
Roller|Apache 207|2019|pop|easy|hum
Wunder|Nina Chuba|2022|pop|easy|hum
Au revoir|Mark Forster|2014|pop|easy|hum
Chöre|Mark Forster|2023|pop|easy|hum
Pläne|Wincent Weiss|2018|pop|medium|hum
Gangnam Style|PSY|2012|dance|easy|hum
Dynamite|BTS|2020|dance|easy|hum
Butter|BTS|2021|dance|easy|hum
How You Like That|BLACKPINK|2020|dance|medium|hum
APT.|ROSÉ & Bruno Mars|2024|pop|easy|hum
On The Ground|ROSÉ|2021|pop|medium|hum
Super Shy|NewJeans|2023|dance|medium|hum
Hype Boy|NewJeans|2022|dance|medium|hum
Wannabe|Spice Girls|1996|pop|easy|hum
...Baby One More Time|Britney Spears|1998|pop|easy|hum
Toxic|Britney Spears|2003|dance|easy|hum
Oops!... I Did It Again|Britney Spears|2000|pop|easy|hum
I Will Survive|Gloria Gaynor|1978|disco|easy|hum
Stayin' Alive|Bee Gees|1977|disco|easy|hum
Night Fever|Bee Gees|1977|disco|easy|hum
Y.M.C.A.|Village People|1978|disco|easy|hum
Hot Stuff|Donna Summer|1979|disco|easy|hum
I Feel Love|Donna Summer|1977|disco|easy|hum
Le Freak|Chic|1978|disco|easy|hum
Good Times|Chic|1979|disco|medium|hum
Celebration|Kool & The Gang|1980|funk|easy|hum
September|Earth, Wind & Fire|1978|funk|easy|hum
Boogie Wonderland|Earth, Wind & Fire|1979|disco|easy|hum
Play That Funky Music|Wild Cherry|1976|funk|easy|hum
Superstition|Stevie Wonder|1972|funk|easy|hum
Sir Duke|Stevie Wonder|1976|funk|easy|hum
I Wish|Stevie Wonder|1976|funk|medium|hum
Signed, Sealed, Delivered (I'm Yours)|Stevie Wonder|1970|soul|easy|hum
Ain't No Sunshine|Bill Withers|1971|soul|easy|hum
Lovely Day|Bill Withers|1977|soul|easy|hum
Lean on Me|Bill Withers|1972|soul|easy|hum
Respect|Aretha Franklin|1967|soul|easy|hum
I Got You (I Feel Good)|James Brown|1965|funk|easy|hum
Sex Machine|James Brown|1970|funk|medium|hum
Let's Stay Together|Al Green|1972|soul|easy|hum
Sitting on the Dock of the Bay|Otis Redding|1968|soul|easy|hum
(Your Love Keeps Lifting Me) Higher and Higher|Jackie Wilson|1967|soul|medium|hum
I Wanna Dance with Somebody|Whitney Houston|1987|pop|easy|hum
I Will Always Love You|Whitney Houston|1992|soul|easy|hum
Greatest Love of All|Whitney Houston|1986|soul|medium|hum
I'm Every Woman|Chaka Khan|1978|disco|medium|hum
Ain't Nobody|Chaka Khan|1983|funk|easy|hum
Careless Whisper|George Michael|1984|pop|easy|hum
Faith|George Michael|1987|pop|easy|hum
Freedom! '90|George Michael|1990|pop|medium|hum
Like a Prayer|Madonna|1989|pop|easy|hum
Material Girl|Madonna|1984|pop|easy|hum
La Isla Bonita|Madonna|1986|latin|easy|hum
Vogue|Madonna|1990|dance|easy|hum
Hung Up|Madonna|2005|dance|easy|hum
Girls Just Want to Have Fun|Cyndi Lauper|1983|pop|easy|hum
Time After Time|Cyndi Lauper|1983|pop|easy|hum
Sweet Dreams (Are Made of This)|Eurythmics|1983|pop|easy|hum
Take On Me|a-ha|1985|pop|easy|hum
Don't You (Forget About Me)|Simple Minds|1985|pop|easy|hum
Wake Me Up Before You Go-Go|Wham!|1984|pop|easy|hum
Last Christmas|Wham!|1984|pop|easy|hum
I'm Still Standing|Elton John|1983|pop|easy|hum
Africa|Toto|1982|rock|easy|hum
Rosanna|Toto|1982|rock|medium|hum
Every Breath You Take|The Police|1983|rock|easy|hum
Message in a Bottle|The Police|1979|rock|easy|hum
Roxanne|The Police|1978|rock|easy|hum
Hotel California|Eagles|1976|rock|easy|hum
Take It Easy|Eagles|1972|rock|easy|hum
Take Me Home, Country Roads|John Denver|1971|country|easy|hum
Jolene|Dolly Parton|1973|country|easy|hum
9 to 5|Dolly Parton|1980|country|easy|hum
Islands in the Stream|Kenny Rogers & Dolly Parton|1983|country|easy|hum
Ring of Fire|Johnny Cash|1963|country|easy|hum
Hey Jude|The Beatles|1968|rock|easy|hum
Let It Be|The Beatles|1970|rock|easy|hum
Yesterday|The Beatles|1965|pop|easy|hum
Here Comes the Sun|The Beatles|1969|pop|easy|hum
I Want to Hold Your Hand|The Beatles|1963|rock|easy|hum
Can't Buy Me Love|The Beatles|1964|rock|easy|hum
Satisfaction|The Rolling Stones|1965|rock|easy|hum
Paint It Black|The Rolling Stones|1966|rock|easy|hum
Angie|The Rolling Stones|1973|rock|medium|hum
Start Me Up|The Rolling Stones|1981|rock|easy|hum
Dancing in the Moonlight|Toploader|2000|pop|easy|hum
I'm a Believer|The Monkees|1966|pop|easy|hum
Daydream Believer|The Monkees|1967|pop|easy|hum
Build Me Up Buttercup|The Foundations|1968|soul|easy|hum
Dancing in the Street|Martha Reeves & The Vandellas|1964|soul|easy|hum
My Girl|The Temptations|1964|soul|easy|hum
Ain't No Mountain High Enough|Marvin Gaye & Tammi Terrell|1967|soul|easy|hum
I Heard It Through the Grapevine|Marvin Gaye|1968|soul|easy|hum
What's Going On|Marvin Gaye|1971|soul|medium|hum
Stand by Me|Ben E. King|1961|soul|easy|hum
Under the Boardwalk|The Drifters|1964|soul|easy|hum
Sloop John B|The Beach Boys|1966|rock|easy|hum
Surfin' USA|The Beach Boys|1963|rock|easy|hum
Wouldn't It Be Nice|The Beach Boys|1966|pop|easy|hum
Kokomo|The Beach Boys|1988|pop|easy|hum
Láska moja|Elán|1984|pop|easy|hum
Nech sa vráti láska|IMT Smile|1998|pop|easy|hum
Starosta|No Name|2000|rock|easy|hum
Sima|Kali|2023|rap|easy|nohum
Sľúbila|Mirai|2019|pop|easy|hum
Vráť mi tie hviezdy|Mirai|2018|pop|medium|hum
Bára|Kabát|2003|rock|easy|hum
Šrouby do hlavy|Lucie|2000|rock|easy|hum
1970|Chinaski|2007|rock|easy|hum
Lógr|Kryštof|2012|pop|easy|hum
Ty a já|Kryštof|2008|pop|easy|hum
Hlava krachuje|Pokáč|2014|pop|medium|hum
Lie to Me|Mikolas Josef|2018|pop|easy|hum
Lights Off|We Are Domi|2022|dance|easy|hum
Síň slávy|Tina & Rytmus|2007|pop|easy|hum
Podvod|Ben Cristovao|2021|pop|medium|hum
Pedestal|Aiko|2024|pop|medium|hum
Sandstorm|Darude|1999|dance|easy|hum
Pump It|The Black Eyed Peas|2006|dance|easy|hum
I Gotta Feeling|The Black Eyed Peas|2009|dance|easy|hum
Boom Boom Pow|The Black Eyed Peas|2009|dance|easy|hum
Where Is the Love?|The Black Eyed Peas|2003|pop|easy|hum
Meet Me Halfway|The Black Eyed Peas|2009|pop|easy|hum
Stereo Love|Edward Maya & Vika Jigulina|2009|dance|easy|hum
Mr. Saxobeat|Alexandra Stan|2011|dance|easy|hum
Bad Romance|Lady Gaga|2009|dance|easy|hum
Poker Face|Lady Gaga|2008|dance|easy|hum
Just Dance|Lady Gaga|2008|dance|easy|hum
Born This Way|Lady Gaga|2011|dance|easy|hum
Alejandro|Lady Gaga|2010|dance|medium|hum
Shallow|Lady Gaga & Bradley Cooper|2018|soundtrack|easy|hum
Rain On Me|Lady Gaga & Ariana Grande|2020|dance|easy|hum
Thank U, Next|Ariana Grande|2018|pop|easy|hum
7 rings|Ariana Grande|2019|pop|easy|hum
Into You|Ariana Grande|2016|pop|easy|hum
No Tears Left to Cry|Ariana Grande|2018|pop|easy|hum
Positions|Ariana Grande|2020|rnb|medium|hum
Problem|Ariana Grande & Iggy Azalea|2014|pop|easy|hum
One Last Time|Ariana Grande|2015|pop|easy|hum
Single Ladies|Beyoncé|2008|funk|easy|hum
Halo|Beyoncé|2009|pop|easy|hum
Crazy in Love|Beyoncé & Jay-Z|2003|funk|easy|hum
Love On Top|Beyoncé|2011|soul|easy|hum
Texas Hold 'Em|Beyoncé|2024|country|easy|hum
Break My Soul|Beyoncé|2022|dance|medium|hum
Run the World (Girls)|Beyoncé|2011|dance|easy|hum
If I Ain't Got You|Alicia Keys|2003|soul|easy|hum
Empire State of Mind|Jay-Z & Alicia Keys|2009|rap|easy|hum
Fallin'|Alicia Keys|2001|soul|easy|hum
Piano Man|Billy Joel|1973|oldies|easy|hum
Uptown Girl|Billy Joel|1983|pop|easy|hum
We Didn't Start the Fire|Billy Joel|1989|pop|medium|hum
Sweet Caroline|Neil Diamond|1969|oldies|easy|hum
Dancing in the Dark|Bruce Springsteen|1984|rock|easy|hum
Born to Run|Bruce Springsteen|1975|rock|medium|hum
I'm on Fire|Bruce Springsteen|1984|rock|medium|hum
Hungry Heart|Bruce Springsteen|1980|rock|easy|hum
I Love Rock 'n' Roll|Joan Jett & the Blackhearts|1982|rock|easy|hum
Eye of the Tiger|Survivor|1982|rock|easy|hum
Hips Don't Lie|Shakira & Wyclef Jean|2006|latin|easy|hum
Whenever, Wherever|Shakira|2001|latin|easy|hum
La Tortura|Shakira & Alejandro Sanz|2005|latin|easy|hum
Chantaje|Shakira & Maluma|2016|latin|medium|hum
Te Felicito|Shakira & Rauw Alejandro|2022|latin|medium|hum
Bzrp Music Sessions, Vol. 53|Shakira & Bizarrap|2023|latin|easy|hum
Monotonía|Shakira & Ozuna|2022|latin|medium|hum
TQG|Karol G & Shakira|2023|latin|easy|hum
Provenza|Karol G|2022|latin|medium|hum
Mañana Será Bonito|Karol G|2023|latin|medium|hum
Despechá|Rosalía & Cardi B|2022|latin|easy|hum
Con Altura|Rosalía & J Balvin|2019|latin|easy|hum
La Fama|Rosalía & The Weeknd|2021|latin|medium|hum
Linda|Rosalía|2022|latin|medium|hum
Mia|Bad Bunny & Drake|2018|latin|easy|hum
Me Porto Bonito|Bad Bunny & Chencho Corleone|2022|latin|easy|hum
Tití Me Preguntó|Bad Bunny|2022|latin|medium|hum
Callaíta|Bad Bunny|2019|latin|medium|hum
Dákiti|Bad Bunny & Jhay Cortez|2020|latin|easy|hum
La Canción|J Balvin & Bad Bunny|2019|latin|medium|hum
In Da Getto|J Balvin & Skrillex|2021|dance|medium|hum
Pepas|Farruko|2021|latin|easy|hum
Cold Heart|Elton John & Dua Lipa|2021|dance|easy|hum
Your Song|Elton John|1970|pop|easy|hum
Rocket Man|Elton John|1972|rock|easy|hum
Tiny Dancer|Elton John|1971|rock|easy|hum
Crocodile Rock|Elton John|1972|pop|easy|hum
Bennie and the Jets|Elton John|1973|rock|medium|hum
Sacrifice|Elton John|1989|pop|medium|hum
Treat You Better|Shawn Mendes|2016|pop|easy|hum
Stitches|Shawn Mendes|2015|pop|easy|hum
There's Nothing Holdin' Me Back|Shawn Mendes|2017|pop|medium|hum
Ghost|Justin Bieber|2021|pop|medium|hum
Runaway (U & I)|Galantis|2014|dance|easy|hum
No Money|Galantis|2016|dance|easy|hum
Lush Life|Zara Larsson|2015|pop|easy|hum
Never Forget You|Zara Larsson & MNEK|2015|pop|medium|hum
Rockabye|Clean Bandit & Sean Paul|2016|dance|easy|hum
Rather Be|Clean Bandit & Jess Glynne|2014|dance|easy|hum
Youngblood|5 Seconds of Summer|2018|rock|easy|hum
She Looks So Perfect|5 Seconds of Summer|2014|rock|easy|hum
Hey There Delilah|Plain White T's|2006|pop|easy|hum
The Man Who Can't Be Moved|The Script|2008|rock|easy|hum
Hall of Fame|The Script & will.i.am|2012|pop|easy|hum
Pompeii|Bastille|2013|rock|easy|hum
Am I Wrong|Nico & Vinz|2014|pop|easy|hum
Fireflies|Owl City|2009|pop|easy|hum
Stressed Out|Twenty One Pilots|2015|rock|easy|hum
Ride|Twenty One Pilots|2015|rock|medium|hum
Heathens|Twenty One Pilots|2016|rock|easy|hum
Paris|The Chainsmokers|2017|dance|easy|hum
All We Know|The Chainsmokers & Phoebe Ryan|2016|dance|medium|hum
Silence|Marshmello & Khalid|2017|dance|medium|hum
Friends|Marshmello & Anne-Marie|2018|dance|easy|hum
More Than You Know|Axwell & Ingrosso|2017|dance|easy|hum
Harder, Better, Faster, Stronger|Daft Punk|2001|dance|medium|hum
One More Time|Daft Punk|2000|dance|easy|hum
Around the World|Daft Punk|2001|dance|medium|hum
In the Name of Love|Martin Garrix & Bebe Rexha|2016|dance|easy|hum
Love Me Like You Do|Ellie Goulding|2015|pop|easy|hum
Stereo Hearts|Gym Class Heroes & Adam Levine|2011|pop|easy|hum
Turn Down for What|DJ Snake & Lil Jon|2013|dance|easy|hum
Lean On|Major Lazer & DJ Snake|2015|dance|easy|hum
Let Me Love You|DJ Snake & Justin Bieber|2016|dance|easy|hum
Story of My Life|One Direction|2013|pop|easy|hum
What Makes You Beautiful|One Direction|2011|pop|easy|hum
Best Song Ever|One Direction|2013|pop|easy|hum
Drag Me Down|One Direction|2015|pop|easy|hum
Worth It|Fifth Harmony|2015|dance|easy|hum
Work from Home|Fifth Harmony|2016|dance|easy|hum
I Like It|Cardi B & Bad Bunny|2018|latin|easy|hum
Savage Love|Jason Derulo & Jawsh 685|2020|dance|easy|hum
Want to Want Me|Jason Derulo|2015|dance|easy|hum
Talk Dirty|Jason Derulo|2013|dance|medium|hum
Wildflower|Billie Eilish|2024|pop|medium|hum
Somewhere Only We Know|Keane|2004|rock|easy|hum
Always Remember Us This Way|Lady Gaga|2018|soundtrack|easy|hum
I Remember Everything|Zach Bryan & Kacey Musgraves|2023|country|medium|hum
Something in the Orange|Zach Bryan|2022|country|medium|hum
Gata Only|FloyyMenor & Cris MJ|2024|latin|easy|hum
Ella Baila Sola|Eslabon Armado & Peso Pluma|2023|latin|easy|hum
Si Antes Te Hubiera Conocido|Karol G|2024|latin|easy|hum
Mi Ex Tenía Razón|Karol G|2023|latin|medium|hum
Luna|Feid & ATL Jacob|2023|latin|medium|hum
Waiting for Tonight|Jennifer Lopez|1999|dance|medium|hum
Black Magic Woman|Santana|1970|rock|medium|hum
Smooth|Santana & Rob Thomas|1999|rock|easy|hum
Maria Maria|Santana & The Product G&B|1999|latin|easy|hum
Make You Feel My Love|Adele|2008|pop|easy|hum
Send My Love|Adele|2016|pop|easy|hum
When We Were Young|Adele|2016|pop|easy|hum
Say You Won't Let Go|James Arthur|2016|pop|easy|hum
Work Song|Hozier|2014|rock|medium|hum
80 Millionen|Max Giesinger|2017|pop|easy|hum
Wenn sie tanzt|Max Giesinger|2016|pop|medium|hum
Auf anderen Wegen|Andreas Bourani|2014|pop|medium|hum
Bochum|Herbert Grönemeyer|1984|rock|medium|hum
Sympathique|Pink Martini|1997|chanson|easy|hum
L'enfer|Stromae|2021|pop|medium|hum
Ma Meilleure Ennemie|Stromae & Pomme|2024|pop|medium|hum
Time to Say Goodbye|Andrea Bocelli & Sarah Brightman|1996|pop|easy|hum
Il Mondo|Jimmy Fontana|1965|oldies|medium|hum
Sharazan|Al Bano & Romina Power|1981|oldies|medium|hum
Grande grande grande|Mina|1972|oldies|medium|hum
Se telefonando|Mina|1966|oldies|hard|hum
Sin Miedo al Dolor|TINI|2022|latin|medium|hum
Un Beso|Aventura|2006|latin|medium|hum
Obsesión|Aventura|2002|latin|easy|hum
Dile al Amor|Aventura|2009|latin|medium|hum
Propuesta Indecente|Romeo Santos|2014|latin|easy|hum
Bailando Por Ahí|Farruko|2012|latin|medium|hum
Vivir lo Nuestro|Marc Anthony & La India|1994|latin|medium|hum
Aguanile|Héctor Lavoe|1978|latin|hard|hum
`
  .split("\n")
  .join("\n");
/**
 * Interpreti, ktorí nespievajú po anglicky — provider store routing.
 */
export const CHART_HITS_ARTIST_LANGUAGES = {
  "Édith Piaf": "fr",
  Zaz: "fr",
  Indila: "fr",
  Stromae: "fr",
  Indochine: "fr",
  "Aya Nakamura": "fr",
  Nena: "de",
  "Peter Fox": "de",
  "Peter Fox & Inéa": "de",
  "Apache 207": "de",
  "Nina Chuba": "de",
  "Mark Forster": "de",
  "Wincent Weiss": "de",
  PSY: "other",
  BTS: "other",
  BLACKPINK: "other",
  "ROSÉ": "other",
  "ROSÉ & Bruno Mars": "other",
  NewJeans: "other",
  "Elán": "sk",
  "IMT Smile": "sk",
  "No Name": "sk",
  Kali: "sk",
  Mirai: "sk",
  Kabát: "cs",
  Lucie: "cs",
  Chinaski: "cs",
  Kryštof: "cs",
  Pokáč: "cs",
  "Mikolas Josef": "cs",
  "We Are Domi": "cs",
  "Tina & Rytmus": "sk",
  "Ben Cristovao": "cs",
  Aiko: "cs",
  "Luis Fonsi & Daddy Yankee": "es",
  "Enrique Iglesias": "es",
  "Nicky Jam & Enrique Iglesias": "es",
  "Daddy Yankee": "es",
  "Daddy Yankee & Snow": "es",
  "Karol G & Nicki Minaj": "es",
  "Marc Anthony": "es",
  "Los del Río": "es",
  "Ricky Martin": "es",
  "Elvis Crespo": "es",
  "Michel Teló": "pt",
  "Jorge Ben Jor": "pt",
  "Tom Jobim & João Gilberto": "pt",
  "Chitãozinho & Xororó": "pt",
  Anitta: "pt",
  "Shakira & Wyclef Jean": "es",
  Shakira: "es",
  "Shakira & Alejandro Sanz": "es",
  "Shakira & Maluma": "es",
  "Shakira & Rauw Alejandro": "es",
  "Shakira & Bizarrap": "es",
  "Shakira & Ozuna": "es",
  "Karol G & Shakira": "es",
  "Karol G": "es",
  "Rosalía & Cardi B": "es",
  "Rosalía & J Balvin": "es",
  "Rosalía & The Weeknd": "es",
  Rosalía: "es",
  "Bad Bunny & Drake": "es",
  "Bad Bunny & Chencho Corleone": "es",
  "Bad Bunny": "es",
  "Bad Bunny & Jhay Cortez": "es",
  "J Balvin & Bad Bunny": "es",
  "J Balvin & Skrillex": "es",
  Farruko: "es",
  "Max Giesinger": "de",
  "Revolverheld": "de",
  "Andreas Bourani": "de",
  "Tokio Hotel": "de",
  "Herbert Grönemeyer": "de",
  "Die Toten Hosen": "de",
  "Die Ärzte": "de",
  "Peter Schilling": "de",
  "Rammstein": "de",
  "Pink Martini": "fr",
  "Kids United": "fr",
  "Renaud": "fr",
  "Stromae & Pomme": "fr",
  "Jimmy Fontana": "it",
  "Al Bano & Romina Power": "it",
  "Mina": "it",
  "Andrea Bocelli & Sarah Brightman": "it",
  "TINI": "es",
  "Aventura": "es",
  "Romeo Santos": "es",
  "Marc Anthony & La India": "es",
  "Eslabon Armado & Peso Pluma": "es",
  "FloyyMenor & Cris MJ": "es",
  "Feid & ATL Jacob": "es",
  "Cardi B & Bad Bunny": "es",
} as const;
