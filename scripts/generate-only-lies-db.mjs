import fs from "fs";
import path from "path";

// Array of compact questions: [sk, en, de, es, fr, pt, cat]
// All are simple factual questions with exactly one clear correct answer.
// Consistently using Brazilian Portuguese (e.g. você, banheiro, trem) for pt.
// All Slovak questions are checked for correct diacritics and question marks.
// All Spanish questions have leading ¿ and trailing ?.
// All French questions have a space before the ?.
const rawSpecs = [
  // --- ANIMALS (55 base items) ---
  ["Koľko nôh má pes?", "How many legs does a dog have?", "Wie viele Beine hat ein Hund?", "¿Cuántas patas tiene un perro?", "Combien de pattes a un chien ?", "Quantas patas tem um cachorro?", "animals"],
  ["Aké zviera dáva kravské mlieko?", "What animal gives cow's milk?", "Welches Tier gibt Kuhmilch?", "¿Qué animal da leche de vaca?", "Quel animal donne du lait de vache ?", "Qual animal dá leite de vaca?", "animals"],
  ["Ktorý hmyz vyrába sladký med?", "Which insect makes sweet honey?", "Welches Insekt macht süßen Honig?", "¿Qué insecto produce miel dulce?", "Quel insecte produit du miel doux ?", "Qual inseto produz mel doce?", "animals"],
  ["Aké zviera má veľmi dlhý krk?", "What animal has a very long neck?", "Welches Tier hat einen sehr langen Hals?", "¿Qué animal tiene el cuello muy largo?", "Quel animal a un très long cou ?", "Qual animal tem o pescoço muito comprido?", "animals"],
  ["Ktorý vták vie opakovať ľudské slová?", "Which bird can repeat human words?", "Welcher Vogel kann menschliche Worte wiederholen?", "¿Qué pájaro puede repetir palabras humanas?", "Quel oiseau peut répéter les paroles humaines ?", "Qual pássaro pode repetir palavras humanas?", "animals"],
  ["Aké zviera nosí svoj domček na chrbte?", "What animal carries its house on its back?", "Welches Tier trägt sein Haus auf dem Rücken?", "¿Qué animal lleva su casa a cuestas?", "Quel animal porte sa maison sur son dos ?", "Qual animal carrega sua casa nas costas?", "animals"],
  ["Aké zviera má na chrbte veľký pancier?", "What animal has a large shell on its back?", "Welches Tier hat einen großen Panzer auf dem Rücken?", "¿Qué animal tiene un caparazón grande en la espalda?", "Quel animal a une grande carapace sur le dos ?", "Qual animal tem um casco grande nas costas?", "animals"],
  ["Ktoré zviera má na tele čierno-biele pruhy?", "Which animal has black and white stripes on its body?", "Welches Tier hat schwarz-weiße Streifen auf dem Körper?", "¿Qué animal tiene rayas blancas y negras en su cuerpo?", "Quel animal a des rayures noires et blanches sur le corps ?", "Qual animal tem listras pretas e brancas no corpo?", "animals"],
  ["Ktorý hlodavec má najradšej žltý syr?", "Which rodent likes yellow cheese the most?", "Welches Nagetier mag gelben Käse am meisten?", "¿Qué roedor prefiere el queso amarillo?", "Quel rongeur préfère le fromage jaune ?", "Qual roedor prefere queijo amarelo?", "animals"],
  ["Aké veľké sivé zviera má dlhý chobot?", "What big gray animal has a long trunk?", "Welches große graue Tier hat einen langen Rüssel?", "¿Qué animal grande y gris tiene una trompa larga?", "Quel grand animal gris a une longue trompe ?", "Qual animal grande e cinza tem uma tromba longa?", "animals"],
  ["Aké zviera spí zavesené hlavou dole?", "What animal sleeps hanging upside down?", "Welches Tier schläft kopfüber hängend?", "¿Qué animal duerme colgado boca abajo?", "Quel animal dort suspendu la tête en bas ?", "Qual animal dorme de cabeça para baixo?", "animals"],
  ["Aké zviera chytá muchy do lepkavej pavučiny?", "What animal catches flies in a sticky web?", "Welches Tier fängt Fliegen in einem klebrigen Netz?", "¿Qué animal atrapa moscas en una telaraña pegajosa?", "Quel animal attrape des mouches dans une toile collante ?", "Qual animal pega moscas em uma teia pegajosa?", "animals"],
  ["Ktoré domáce zviera stráži dvor a šteká?", "Which pet guards the yard and barks?", "Welches Haustier bewacht den Hof und bellt?", "¿Qué mascota vigila el patio y ladra?", "Quel animal de compagnie garde la cour et aboie ?", "Qual animal de estimação vigia o quintal e late?", "animals"],
  ["Ktoré zviera rado pradie a mňauká?", "Which animal likes to purr and meow?", "Welches Tier schnurrt und miaut gerne?", "¿Qué animal prefiere ronronear y maullar?", "Quel animal aime ronronner et miauler ?", "Qual animal gosta de ronronar e miar?", "animals"],
  ["Aké zviera znáša slepačie vajcia?", "What animal lays chicken eggs?", "Welches Tier legt Hühnereier?", "¿Qué animal pone huevos de gallina?", "Quel animal pond des œufs de poule ?", "Qual animal bota ovos de galinha?", "animals"],
  ["Aké pomalé zviera žije vo vlhku v záhrade?", "What slow animal lives in damp garden areas?", "Welches langsame Tier lebt an feuchten Gartenplätzen?", "¿Qué animal lento vive en zonas húmedas del jardín?", "Quel animal lent vit dans les endroits humides du jardin ?", "Qual animal lento vive em áreas úmidas do jardim?", "animals"],
  ["Ktoré divoké zviera je kráľom džungle?", "Which wild animal is the king of the jungle?", "Welches Wildtier ist der König des Dschungels?", "¿Qué animal salvaje es el rey de la selva?", "Quel animal sauvage est le roi de la jungle ?", "Qual animal selvagem é o rei da selva?", "animals"],
  ["Ktorý lesný vták húka počas noci?", "Which forest bird hoots during the night?", "Welcher Waldvogel ruft in der Nacht?", "¿Qué ave del bosque ulula durante la noche?", "Quel oiseau de forêt hulule pendant la nuit ?", "Qual ave da floresta pia durante a noite?", "animals"],
  ["Aké veľké zviera žije v oceáne a strieka vodu?", "What big animal lives in the ocean and spouts water?", "Welches große Tier lebt im Ozean und spritzt Wasser?", "¿Qué animal grande vive en el océano y lanza chorros de agua?", "Quel grand animal vit dans l'océan et rejette de l'eau ?", "Qual animal grande vive no oceano e borrifa água?", "animals"],
  ["Ktoré vodné zviera má dve veľké klepetá?", "Which aquatic animal has two large claws?", "Welches Wassertier hat zwei große Scheren?", "¿Qué animal acuático tiene dos pinzas grandes?", "Quel animal aquatique a deux grandes pinces ?", "Qual animal aquático tem duas garras grandes?", "animals"],
  ["Ktorý hmyz v noci svieti v tme?", "Which insect glows in the dark at night?", "Welches Insekt leuchtet nachts im Dunkeln?", "¿Qué insecto brilla en la oscuridad por la noche?", "Quel insecte brille dans le noir la nuit ?", "Qual inseto brilha no escuro à noite?", "animals"],
  ["Ktoré zviera skáče s mláďaťom v vaku?", "Which animal hops with its baby in a pouch?", "Welches Tier hüpft mit seinem Baby im Beutel?", "¿Qué animal salta con su cría en una bolsa?", "Quel animal bondit with son bébé dans une poche ?", "Qual animal salta com seu filhote em uma bolsa?", "animals"],
  ["Aké zviera má pichliače na celom chrbte?", "What animal has prickles all over its back?", "Welches Tier hat Stacheln auf dem ganzen Rücken?", "¿Qué animal tiene espinas en toda la espalda?", "Quel animal a des piquants sur tout le dos ?", "Qual animal tem espinhos por todas as costas?", "animals"],
  ["Aké zelené zviera rado skáče do rybníka?", "What green animal likes to jump into a pond?", "Welches grüne Tier springt gerne in einen Teich?", "¿Qué animal verde prefiere saltar a un estanque?", "Quel animal vert aime sauter dans un étang ?", "Qual animal verde gosta de pular em um lago?", "animals"],
  ["Ktorý malý vták klope zobákom do kôry stromu?", "Which small bird pecks with its beak into tree bark?", "Welcher kleine Vogel klopft mit dem Schnabel an die Baumrinde?", "¿Qué pequeño pájaro golpea con su pico la corteza de un árbol?", "Quel petit oiseau frappe du bec contre l'écorce d'un arbre ?", "Qual pássaro pequeno bica a casca de uma árvore?", "animals"],
  ["Aké veľké zviera má dva veľké hrby na chrbte?", "What big animal has two large humps on its back?", "Welches große Tier hat zwei große Höcker auf dem Rücken?", "¿Qué animal grande tiene dos jorobas en la espalda?", "Quel grand animal a deux bosses sur le dos ?", "Qual animal grande tem duas corcovas nas costas?", "animals"],
  ["Ktoré lietajúce zviera znáša husacie vajcia?", "Which flying animal lays goose eggs?", "Welches fliegende Tier legt Gänseeier?", "¿Qué animal volador pone huevos de ganso?", "Quel animal volant pond des œufs d'oie ?", "Qual animal voador bota ovos de ganso?", "animals"],
  ["Aké veľké zviera spí v zime v jaskyni?", "What big animal sleeps in a cave during winter?", "Welches große Tier schläft im Winter in einer Höhle?", "¿Qué animal grande duerme en una cueva en invierno?", "Quel grand animal dort dans une grotte en hiver ?", "Qual animal grande dorme em uma caverna no inverno?", "animals"],
  ["Ktoré zviera je verným pomocníkom jazdca v jazdeckom športe?", "Which animal is a rider's loyal helper in equestrian sports?", "Welches Tier ist ein treuer Helfer des Reiters im Reitsport?", "¿Qué animal es el fiel ayudante del jinete en la hípica?", "Quel animal est le fidèle compagnon du cavalier en équitation ?", "Qual animal é o companheiro fiel do cavaleiro no hipismo?", "animals"],
  ["Aké domáce zviera rado žerie čerstvú mrkvu?", "What pet likes to eat fresh carrots?", "Welches Haustier frisst gerne frische Karotten?", "¿Qué mascota prefiere comer zanahorias frescas?", "Quel animal de compagnie aime manger des carottes fraîches ?", "Qual animal de estimação gosta de comer cenouras frescas?", "animals"],
  ["Aké ružové zviera rado leží v bahne?", "What pink animal likes to lie in mud?", "Welches rosa Tier liegt gerne im Schlamm?", "¿Qué animal rosa prefiere tumbarse en el barro?", "Quel animal rose aime se coucher dans la boue ?", "Qual animal rosa gosta de deitar na lama?", "animals"],
  ["Aké zviera dáva vlnu na pletenie svetrov?", "What animal provides wool for knitting sweaters?", "Welches Tier liefert Wolle zum Stricken von Pullovern?", "¿Qué animal da lana para tejer suéteres?", "Quel animal donne de la laine pour tricoter des pulls ?", "Qual animal dá lã para tricotar suéteres?", "animals"],
  ["Ktorý hmyz stavia veľké mraveniská v lese?", "Which insect builds large anthills in the forest?", "Welches Insekt baut große Ameisenhaufen im Wald?", "¿Qué insecto construye grandes hormigueros en el bosque?", "Quel insecte construit de grandes fourmilières dans la forêt ?", "Qual inseto constrói formigueiros grandes na floresta?", "animals"],
  ["Ktorý lesný vták má veľké biele perie a stavia hniezda na komínoch?", "Which forest bird has large white feathers and builds nests on chimneys?", "Welcher Waldvogel hat große weiße Federn und baut Nester auf Schornsteinen?", "¿Qué ave tiene plumas blancas y hace nidos en las chimeneas?", "Quel oiseau a de grandes plumes blanches et fait son nid sur les cheminées ?", "Qual ave tem penas brancas grandes e faz ninhos em chaminés?", "animals"],
  ["Ktorý morský dravec má ostré zuby a veľkú chrbtovú plutvu?", "Which marine predator has sharp teeth and a large dorsal fin?", "Welches Meeresraubtier hat scharfe Zähne und eine große Rückenflosse?", "¿Qué depredador marino tiene dientes afilados y una gran aleta dorsal?", "Quel prédateur marin a des dents acérées et une grande nageoire dorsale ?", "Qual predador marinho tem dentes afiados e uma grande barbatana dorsal?", "animals"],
  ["Aké zviera sa vyliahne zo žubrienky v rybníku?", "What animal hatches from a tadpole in a pond?", "Welches Tier schlüpft aus einer Kaulquappe im Teich?", "¿Qué animal nace de un renacuajo en un estanque?", "Quel animal éclôt d'un têtard dans un étang ?", "Qual animal nasce de um girino em um lago?", "animals"],
  ["Aké pruhované žlté zviera žije v úli?", "What striped yellow animal lives in a hive?", "Welches gestreifte gelbe Tier lebt in einem Bienenstock?", "¿Qué animal de rayas amarillas vive en una colmena?", "Quel animal jaune rayé vit dans une ruche ?", "Qual animal de listras amarelas vive em uma colmeia?", "animals"],
  ["Aké zviera rado hryzie kosti a aportuje loptičku?", "What animal likes to chew bones and fetch a ball?", "Welches Tier kaut gerne Knochen und holt einen Ball?", "¿Qué animal prefiere morder huesos y traer una pelota?", "Quel animal aime ronger des os et rapporter une balle ?", "Qual animal gosta de roer ossos e buscar uma bola?", "animals"],
  ["Ktorý malý vták ohlasuje ranné svitanie kikiríkaním?", "Which small bird announces morning dawn by crowing?", "Welcher kleine Vogel kündigt die Morgendämmerung mit Krähen an?", "¿Qué ave anuncia el amanecer cantando?", "Quel oiseau annonce l'aurore en chantant ?", "Qual ave anuncia o amanecer cantando?", "animals"],
  ["Ktoré domáce zviera rado chytá myši v pivnici?", "Which pet likes to catch mice in the cellar?", "Welches Haustier fängt gerne Mäuse im Keller?", "¿Qué mascota prefiere cazar ratones en el sótano?", "Quel animal de compagnie aime attraper les souris à la cave ?", "Qual animal de estimação gosta de pegar ratos no porão?", "animals"],
  ["Aké divoké zviera vyje na spln mesiaca?", "What wild animal howls at the full moon?", "Welches Wildtier heult den Vollmond an?", "¿Qué animal salvaje aúlla a la luna llena?", "Quel animal sauvage hurle à la pleine lune ?", "Qual animal selvagem uiva para a lua cheia?", "animals"],
  ["Aké zviera má dlhé uši a rýchlo skáče po lúke?", "What animal has long ears and hops quickly on a meadow?", "Welches Tier hat lange Ohren und hüpft schnell op der Wiese?", "¿Qué animal tiene orejas largas y salta rápido por el prado?", "Quel animal a de longues oreilles et bondit vite dans le pré ?", "Qual animal tem orelhas compridas e pula rápido pelo prado?", "animals"],
  ["Ktoré zviera má na chrbte čierny pruh a smrdí, keď sa bojí?", "Which animal has a black stripe on its back and stinks when scared?", "Welches Tier hat einen schwarzen Streifen auf dem Rücken und stinkt bei Angst?", "¿Qué animal tiene una raya negra en el lomo y huele mal cuando se asusta?", "Quel animal a une rayure noire sur le dos et sent mauvais quand il a peur ?", "Qual animal tem uma listra preta nas costas e fede quando está com medo?", "animals"],
  ["Aké divoké zviera stavia drevené hrádze na rieke?", "What wild animal builds wooden dams on a river?", "Welches Wildtier baut Holzdämme an einem Fluss?", "¿Qué animal salvaje construye presas de madera en el río?", "Quel animal sauvage construit des barrages de bois sur la rivière ?", "Qual animal selvagem constrói represas de madeira no rio?", "animals"],
  ["Ktoré lesné zviera má veľké parohy a žije v čriedach?", "Which forest animal has large antlers and lives in herds?", "Welches Waldtier hat ein großes Geweih und lebt in Herden?", "¿Qué animal del bosque tiene grandes astas y vive en manadas?", "Quel animal de forêt a de grands bois et vit en herde ?", "Qual animal da floresta tem chifres grandes e vive em rebanhos?", "animals"],
  ["Ktorý lesný hlodavec si ukladá žalude do skrýš na zimu?", "Which forest rodent stores acorns in hiding places for winter?", "Welches Waldnagetier lagert Eicheln in Verstecken für den Winter?", "¿Qué roedor del bosque guarda bellotas en escondites para el invierno?", "Quel rongeur des bois stocke des glands dans des cachettes pour l'hiver ?", "Qual roedor da floresta guarda nozes em esconderijos para o inverno?", "animals"],
  ["Aké veľké zviera žerie eukalyptové listy v Austrálii?", "What big animal eats eucalyptus leaves in Australia?", "Welches große Tier frisst Eukalyptusblätter in Australien?", "¿Qué animal grande come hojas de eucalipto en Australia?", "Quel grand animal mange des feuilles d'eucalyptus en Australie ?", "Qual animal grande come folhas de eucalipto na Austrália?", "animals"],
  ["Ktoré morské zviera má osem ohybných ramien?", "Which marine animal has eight flexible arms?", "Welches Meerstier hat acht biegsame Arme?", "¿Qué animal marino tiene oscho brazos flexibles?", "Quel animal marin a huit bras flexibles ?", "Qual animal marinho tem oito braços flexíveis?", "animals"],
  ["Aké žlté zviera má na hlave hrivu a žije v Afrike?", "What yellow animal has a mane on its head and lives in Africa?", "Welches gelbe Tier hat eine Mähne auf dem Kopf und lebt in Afrika?", "¿Qué animal amarillo tiene melena en la cabeza y vive en África?", "Quel animal jaune a une crinière sur la tête et vit en Afrique ?", "Qual animal amarelo tem juba na cabeça e vive na África?", "animals"],
  ["Ktorý vták kladie najväčšie vajcia na svete?", "Which bird lays the largest eggs in the world?", "Welcher Vogel legt die größten Eier der Welt?", "¿Qué ave pone los huevos más grandes del mundo?", "Quel oiseau pond les plus grands œufs du monde ?", "Qual ave bota os maiores ovos do mundo?", "animals"],
  ["Aké zviera má dlhé uši a hovorí \"I-á\"?", "What animal has long ears and says 'Hee-haw'?", "Welches Tier hat lange Ohren und macht 'I-Ah'?", "¿Qué animal tiene orejas largas y dice 'I-oo'?", "Quel animal a de longues oreilles et fait 'Hi-han' ?", "Qual animal tem orelhas compridas e faz 'I-ó'?", "animals"],
  ["Aké malé čierne zviera vyhrabáva kopy hliny v záhrade?", "What small black animal digs piles of dirt in the garden?", "Welches kleine schwarze Tier gräbt Erdhaufen im Garten?", "¿Qué animal pequeño y negro cava montones de tierra en el jardín?", "Quel petit animal noir creuse des tas de terre dans le jardin ?", "Qual animal pequeno e preto cava montes de terra no jardim?", "animals"],
  ["Ktoré domáce zviera rado žerie ovos a seno v maštali?", "Which domestic animal likes to eat oats and hay in the stable?", "Welches Haustier frisst gerne Hafer und Heu im Stall?", "¿Qué animal doméstico prefiere comer avena y heno v el establo?", "Quel animal domestique aime manger de l'avoine et du foin dans l'écurie ?", "Qual animal doméstico gosta de comer aveia e feno no estábulo?", "animals"],
  ["Aké zviera pradie jemnú hodvábnu pavučinu v rohu izby?", "What animal spins a fine silk web in the corner of a room?", "Welches Tier spinnt ein feines Seidennetz in der Zimmerecke?", "¿Qué animal teje una fina telaraña de seda en la esquina de la habitación?", "Quel animal tisse une fine toile de soie dans le coin de la pièce ?", "Qual animal tece uma teia de seda fina no canto do quarto?", "animals"],
  ["Ktorý pestrofarebný hmyz má krásne krídla a sadá na kvety?", "Which colorful insect has beautiful wings and lands on flowers?", "Welches bunte Insekt hat schöne Flügel und landet auf Blumen?", "¿Qué insecto de colores tiene alas hermosas y se posa en las flores?", "Quel insecte coloré a de belles ailes et se pose sur les fleurs ?", "Qual inseto colorido tem asas lindas e pousa nas flores?", "animals"],

  // --- FOOD & DRINKS (50 items) ---
  ["Čím ješ teplú polievku?", "What do you eat hot soup with?", "Womit isst man heiße Suppe?", "¿Con qué comes la sopa caliente?", "Avec quoi manges-tu de la soupe chaude ?", "Com o que você come sopa quente?", "food"],
  ["Aké biele korenie robí jedlo slaným?", "What white spice makes food salty?", "Welches weiße Gewürz macht Essen salzig?", "¿Qué especia blanca hace salada la comida?", "Quel condiment blanc rend la nourriture salée ?", "Qual tempero branco deixa a comida salgada?", "food"],
  ["Ktoré žlté ovocie je veľmi kyslé?", "Which yellow fruit is very sour?", "Welche gelbe Frucht ist sehr sauer?", "¿Qué fruta amarilla es muy ácida?", "Quel fruit jaune est très acide ?", "Qual fruta amarela é muito azeda?", "food"],
  ["Z čoho sa vyrába tradičný chlieb?", "What is traditional bread made of?", "Woraus wird traditionelles Brot hergestellt?", "¿De qué se hace el pan tradicional?", "De quoi est fait le pain traditionnel ?", "De que é feito o pão tradicional?", "food"],
  ["Čo včely prinášajú ľuďom ako sladidlo?", "What do bees bring to people as a sweetener?", "Was bringen Bienen den Menschen als Süßungsmittel?", "¿Qué traen las abejas a la gente como edulcorante?", "Que rapportent les abeilles aux humains comme édulcorant ?", "O que as abelhas trazem para as pessoas como adoçante?", "food"],
  ["Aké chladné jedlo lížeš v lete z kornútka?", "What cold food do you lick from a cone in summer?", "Welche kalte Speise leckt man im Sommer aus der Tüte?", "¿Qué comida fría lames de un cono en verano?", "Quel aliment froid lèches-tu d'un cône en été ?", "Qual comida fria você chupa em uma casquinha no verão?", "food"],
  ["Aké biele tekuté pitie dáva krava?", "What white liquid drink does a cow give?", "Welches weiße flüssige Getränk gibt eine Kuh?", "¿Qué bebida líquida y blanca da la vaca?", "Quelle boisson liquide blanche donne la vache ?", "Que bebida líquida branca a vaca dá?", "food"],
  ["Z akého ovocia sa vyrába červené víno?", "What fruit is red wine made from?", "Aus welcher Frucht wird Rotwein hergestellt?", "¿De qué fruta se hace el vino tinto?", "De quel fruit est fait le vin rouge ?", "De qual fruta é feito o vinho tinto?", "food"],
  ["Ktoré guľaté talianske jedlo sa pečie v peci s paradajkami a syrom?", "Which round Italian food is baked in an oven with tomatoes and cheese?", "Welches runde italienische Essen wird mit Tomaten und Käse im Ofen gebacken?", "¿Qué comida italiana redonda se hornea con tomates y queso?", "Quel plat italien rond est cuit au four avec des tomates et du fromage ?", "Qual comida italiana redonda é assada com tomates e queijo?", "food"],
  ["Čo sladké vyrábame z cukrovej repy?", "What sweet substance do we make from sugar beet?", "Welchen süßen Stoff stellen wir aus Zuckerrüben her?", "¿Qué sustancia dulce hacemos de la remolacha azucarera?", "Quelle substance sucrée fabrique-t-on à partir de la betterave sucrière ?", "Qual substância doce fazemos de beterraba sacarina?", "food"],
  ["Ako sa volá sušené hrozno?", "What are dried grapes called?", "Wie heißen getrocknete Weintrauben?", "¿Cómo se llaman las uvas pasas?", "Comment appelle-t-on les raisins secs ?", "Como se chamam as uvas passas?", "food"],
  ["Aké mäco sa zvyčajne nachádza v rybích prstoch?", "What meat is usually found in fish fingers?", "Welches Fleisch ist normalerweise in Fischstäbchen?", "¿Qué carne se encuentra normalmente en los palitos de pescado?", "Quelle viande trouve-t-on habituellement dans les bâtonnets de poisson ?", "Qual carne é encontrada normalmente nos bastões de peixe?", "food"],
  ["Čo si natieraš na chlieb spolu s maslom?", "What do you spread on bread along with butter?", "Was streicht man neben Butter auf das Brot?", "¿Qué untas en el pan junto con mantequilla?", "Que tartines-tu sur du pain avec du beurre ?", "O que você passa no pão junto com manteiga?", "food"],
  ["Aké oranžové ovocie rastie na palmách v trópoch a má veľkú kôstku?", "What orange fruit grows on palms in the tropics and has a large pit?", "Welche orangefarbene Frucht wächst auf Palmen in den Tropen und hat einen großen Kern?", "¿Qué fruta naranja crece en las palmeras de los trópicos y tiene un gran hueso?", "Quel fruit orange pousse sur les palmiers des tropiques et a un gros noyau ?", "Qual fruta laranja cresce nas palmeiras tropicais e tem um caroço grande?", "food"],
  ["Ktorá zelenina sa dáva do snehuliaka namiesto nosa?", "Which vegetable is put into a snowman instead of a nose?", "Welches Gemüse wird anstelle einer Nase in einen Schneemann gesteckt?", "¿Qué verdura se le pone a un muñeco de nieve en lugar de nariz?", "Quel légume met-on à un bonhomme de neige à la place du nez ?", "Qual vegetal é colocado no boneco de neve no lugar do nariz?", "food"],
  ["Aké jedlo pripravujú včely vo svojom úli?", "What food do bees prepare in their hive?", "Welche Nahrung bereiten Bienen in ihrem Stock zu?", "¿Qué alimento preparan las abejas en su colmena?", "Quel aliment les abeilles préparent-elles dans leur ruche ?", "Qual aliment as abelhas preparam em sua colmeia?", "food"],
  ["Ktoré žlté ovocie si musíš pred zjedením ošúpať?", "Which yellow fruit must you peel before eating?", "Welche gelbe Frucht must man vor dem Essen schälen?", "¿Qué fruta amarilla debes pelar antes de comer?", "Quel fruit jaune dois-tu peler avant de manger ?", "Qual fruta amarela você deve descascar antes de comer?", "food"],
  ["Čo vznikne, keď zamrazíš čistú pitnú vodu?", "What is created when you freeze clean drinking water?", "Was entsteht, wenn man sauberes Trinkwasser einfriert?", "¿Qué se crea cuando congelas agua limpia para beber?", "Que se passe-t-il quand on congèle de l'eau potable propre ?", "O que é criado quando você congela água potável limpa?", "food"],
  ["Aké hnedé sladké tabuľky sa vyrábajú z kakaových bôbov?", "What brown sweet bars are made from cocoa beans?", "Welche braunen süßen Tafeln werden aus Kakaobohnen hergestellt?", "¿Qué tabletas dulces de color marrón se hacen con granos de cacao?", "Quelles tablettes de chocolat marron sont faites à partir de fèves de cacao ?", "Quais barras doces marrons são feitas de grãos de cacau?", "food"],
  ["Ako sa volá hlavné ranné jedlo?", "What is the main morning meal called?", "Wie heißt die erste Mahlzeit am Morgen?", "¿Cómo se llama la primera comida de la mañana?", "Comment s'appelle le premier repas du matin ?", "Como se chama a primeira refeição da manhã?", "food"],
  ["Ktoré biele korenie získavame odparovaním morskej vody?", "Which white spice do we get by evaporating seawater?", "Welches weiße Gewürz gewinnen wir durch Verdampfen von Meerwasser?", "¿Qué especia blanca obtenemos al evaporar agua de mar?", "Quel condiment blanc obtient-on en évaporant de l'eau de mer ?", "Qual tempero branco obtemos ao evaporar a água do mar?", "food"],
  ["Čo piješ, keď máš veľký smäd a tečie to z kohútika?", "What do you drink when you are very thirsty and it flows from the tap?", "Was trinkt man bei großem Durst, wenn es aus dem Hahn fließt?", "¿Qué bebes cuando tienes mucha sed y sale del grifo?", "Que bois-tu quand tu as très soif et que ça coule du robinet ?", "O que você bebe quando tem muita sede e sai da torneira?", "food"],
  ["Z akého kysnutého cesta sa pečie tradičný rožok?", "What yeast dough is used to bake a traditional roll?", "Aus welchem Hefeteig wird ein traditionelles Hörnchen gebacken?", "¿Con qué masa de levadura se hornea un cuerno tradicional?", "Avec quelle pâte levée cuit-on un croissant traditionnel ?", "Qual masa com fermento é usada para assar um pãozinho tradicional?", "food"],
  ["Aké korenie páli na jazyku a je čierne alebo červené?", "What spice burns on the tongue and is black or red?", "Welches Gewürz brennt auf der Zunge und ist schwarz oder rot?", "¿Qué especia pica en la lengua y es negra o roja?", "Quelle épice brûle la langue et est noire ou rouge ?", "Qual tempero arde na língua e é preto ou vermelho?", "food"],
  ["Aké teplé tekuté jedlo ješ s lyžicou pred hlavným chodom?", "What warm liquid food do you eat with a spoon before the main course?", "Welche warme flüssige Speise isst man mit dem Löffel vor dem Hauptgang?", "¿Qué comida líquida caliente comes con cuchara antes del plato principal?", "Quel plat liquide chaud manges-tu à la cuillère avant le plat principal ?", "Qual comida líquida quente você come com colher antes do prato principal?", "food"],
  ["Ktorá zelenina po nakrájaní vyvoláva slzy v očiach?", "Which vegetable causes tears in your eyes when chopped?", "Welches Gemüse treibt einem beim Schneiden die Tränen in die Augen?", "¿Qué verdura hace llorar cuando se pica?", "Quel légume fait pleurer quand on le coupe ?", "Qual vegetal faz chorar quando é picado?", "food"],
  ["Z akej tekutiny sa robí ranná čierna káva?", "From what liquid is morning black coffee made?", "Aus welcher Flüssigkeit wird morgendlicher schwarzer Kaffee hergestellt?", "¿De qué líquido se hace el café solo de la mañana?", "À partir de quel liquide fait-on le café noir du matin ?", "De qual líquido é feito o café preto da manhã?", "food"],
  ["Aké jedlo znáša sliepka v bielej škrupine?", "What food does a hen lay in a white shell?", "Welches Nahrungsmittel legt eine Henne in einer weißen Schale?", "¿Qué alimento pone una gallina en una cáscara blanca?", "Quel aliment pond une poule dans une coquille blanche ?", "Qual alimento a galinha bota em uma casca branca?", "food"],
  ["Čo striekaš na hranolky a je to z paradajok?", "What do you squeeze on fries and it's made from tomatoes?", "Was drückt man auf Pommes und es wird aus Tomaten hergestellt?", "¿Qué le echas a las patatas fritas que está hecho de tomate?", "Que mets-tu sur les frites qui est fait à partir de tomates ?", "O que you joga na batata frita que é feito de tomate?", "food"],
  ["Aké žlté jedlo z mlieka sa krája na plátky a dáva na pizzu?", "What yellow milk food is sliced and put on pizza?", "Welches gelbe Milchprodukt wird in Scheiben geschnitten und auf Pizza gelegt?", "¿Qué comida amarilla hecha de leche se corta en rodajas y se pone en la pizza?", "Quel produit laitier jaune est coupé en tranches et mis sur la pizza ?", "Qual derivado do leite amarelo é fatiado e colocado na pizza?", "food"],
  ["Ktorá zelenina je dlhá, oranžová a rastie v zemi?", "Which vegetable is long, orange, and grows in the ground?", "Welches Gemüse ist lang, orange und wächst in der Erde?", "¿Qué verdura es larga, naranja y crece en la tierra?", "Quel légume est long, orange et pousse dans le sol ?", "Qual vegetal é comprido, laranja e cresce na terra?", "food"],
  ["Z čoho sa lisuje olivový olej?", "What are olives pressed into oil from?", "Woraus werden Oliven zu Öl gepresst?", "¿De qué se extrae el aceite de oliva?", "De quoi extrait-on l'huile d'olive ?", "De que é extraído o azeite de oliva?", "food"],
  ["Aké sladké červené lesné ovocie rastie na kríkoch so zelenými lístkami?", "What sweet red forest fruit grows on bushes with green leaves?", "Welche süßen roten Waldfrüchte wachsen auf Sträuchern mit grünen Blättern?", "¿Qué fruta dulce y roja del bosque crece en arbustos con hojas verdes?", "Quel fruit rouge et doux de la forêt pousse sur de petits arbustes aux feuilles vertes ?", "Qual fruta vermelha e doce cresce em arbustos com folhas verdes no bosque?", "food"],
  ["Čo používa pekár na vykysnutie chlebového cesta?", "What does a baker use to rise bread dough?", "Was verwendet ein Bäcker, um Brotteig aufgehen zu lassen?", "¿Qué usa el panadero para fermentar la masa de pan?", "Que pousse le boulanger pour faire lever la pâte à pain ?", "O que o padeiro usa para fermentar a massa de pão?", "food"],
  ["Aké guľaté zelené ovocie visí na viniči v strapcoch?", "What round green fruit hangs in clusters on a grapevine?", "Welche runden grünen Früchte hängen in Trauben an einem Weinstock?", "¿Qué fruta de racimo cuelga en racimos de la vid?", "Quel fruit rond et vert pend en grappes sur une vigne ?", "Qual fruta redonda e verde fica pendurada em cachos na videira?", "food"],
  ["Čo sladké si dávaš do čaju namiesto cukru?", "What sweet thing do you put in tea instead of sugar?", "Welche Süße gibt man statt Zucker in den Tee?", "¿Qué dulce le pones al té en lugar de azúcar?", "Quelle chose sucrée mets-tu dans le thé à la place du sucre ?", "O que você coloca de doce no chá no lugar do açúcar?", "food"],
  ["Ktorá zelenina má zelené listy a robí sa z nej šalát?", "Which vegetable has green leaves and is used to make salad?", "Welches Gemüse hat grüne Blätter und wird für Salat verwendet?", "¿Qué verdura tiene hojas verdes y se usa para hacer ensalada?", "Quel légume a des feuilles vertes et sert à faire de la salade ?", "Qual vegetal tem folhas verdes e é usado para fazer salada?", "food"],
  ["Aké tvrdé ovocie jeme na jeseň a má hnedú škrupinu s orechom?", "What hard fruit do we eat in autumn with a brown shell and a nut?", "Welche harte Frucht mit brauner Schale und einer Nuss essen wir im Herbst?", "¿Qué fruto seco de cáscara marrón comemos en otoño con una nuez?", "Quel fruit sec à coque marron mange-t-on en automne ?", "Qual fruto seco de casca marrom comemos no outono?", "food"],
  ["Čo piješ ráno, keď si zaleješ sušené lístky horúcou vodou?", "What do you drink in the morning when you pour hot water over dried leaves?", "Was trinkt man am Morgen, wenn man getrocknete Blätter mit heißem Wasser aufgießt?", "¿Qué bebes por la mañana cuando viertes agua caliente sobre hojas secas?", "Que bois-tu le matin quand tu verses de l'eau chaude sur des feuilles séchées ?", "O que você bebe de manhã quando joga água quente sobre folhas secas?", "food"],
  ["Aké jedlo s dierami vyrábajú z mlieka?", "What food with holes is made from milk?", "Welches Lebensmittel mit Löchern stellt man aus Milch her?", "¿Qué alimento con agujeros se hace con leche?", "Quel produit laitier à trous est fabriqué à partir de lait ?", "Qual derivado do leite com buracos é feito de leite?", "food"],
  ["Ktoré žlté ovocie vyzerá ako veľká šiška s korunou listov?", "Which yellow fruit looks like a big cone with a crown of leaves?", "Welche gelbe Frucht sieht aus wie ein großer Zapfen mit einer Blätterkrone?", "¿Qué fruta amarilla parece un gran cono con corona de hojas?", "Quel fruit jaune ressemble à un grand cône avec une couronne de feuilles ?", "Qual fruta amarela parece um grande cone com coroa de folhas?", "food"],
  ["Aké biele jedlo jeme na raňajky s vločkami?", "What white food do we eat for breakfast with flakes?", "Welches weiße Lebensmittel essen wir zum Frühstück mit Flocken?", "¿Qué alimento blanco comemos en el desayuno con cereales?", "Quel aliment blanc mange-t-on au petit-déjeuner avec des céréales ?", "Qual alimento branco comemos no café da manhã com cereais?", "food"],
  ["Z akej strukoviny sa nerobí tradičný guláš?", "What legume is NOT used in traditional goulash?", "Welche Hülsenfrucht wird NICHT für traditionelles Gulasch verwendet?", "¿Qué legumbre NO se usa para hacer un gulasch tradicional?", "Quel légume sec n'est PAS utilisé dans un goulash traditionnel ?", "Qual legume NÃO é usado no ensopado tradicional?", "food"],
  ["Z akej obilniny melie mlynár bielu múku?", "From what grain does a miller grind white flour?", "Aus welchem Getreide mahlt ein Müller weißes Mehl?", "¿De qué cereal muele el molinero la harina blanca?", "À partir de quelle céréale le meunier moud-il la farine blanche ?", "De qual cereal o moleiro mói a farinha branca?", "food"],
  ["Aké červené ovocie trháme zo stromov v lete a má červenú dužinu?", "What red fruit do we pick from trees in summer with red flesh?", "Welche rote Frucht pflücken wir im Sommer von den Bäumen mit rotem Fruchtfleisch?", "¿Qué fruta roja de pulpa roja cosechamos de los árboles en verano?", "Quel fruit rouge à chair rouge cueille-ton sur les arbres en été ?", "Qual fruta vermelha com polpa vermelha colhemos das árvores no verão?", "food"],
  ["Čo piješ chladné na osvieženie, keď vytlačíš citrón do studenej vody?", "What cold drink do you have for refreshment when you squeeze a lemon into cold water?", "Welches kalte Getränk trinkt man zur Erfrischung, wenn man eine Zitrone in kaltes Wasser presst?", "¿Qué bebida fría tomas para refrescarte cuando exprimes un limón en agua fría?", "Quelle boisson froide bois-tu pour te rafraîchir quand tu presses un citron dans de l'eau froide ?", "Qual biba fria você toma para se refrescar quando espreme um limão em água fria?", "food"],
  ["Ako sa volá sladká nátierka z ovocia uvareného s cukrom?", "What is a sweet spread made from fruit boiled with sugar called?", "Wie heißt ein süßer Aufstrich aus mit Zucker gekochtem Obst?", "¿Como se llama el untable dulce de fruta cocida con azúcar?", "Comment s'appelle une pâte à tartiner sucrée faite de fruits bouillis avec du sucre ?", "Como se chama o doce cremoso de fruta cozida com açúcar?", "food"],
  ["Ktorá biela tekutina sa nachádza v kokosoch?", "What white liquid is found inside coconuts?", "Welche weiße Flüssigkeit befindet sich in Kokosnüssen?", "¿Qué líquido blanco se encuentra dentro de los cocos?", "Quel liquide blanc trouve-t-on à l'intérieur des noix de coco ?", "Qual líquido branco é encontrado dentro dos cocos?", "food"],
  ["Z čoho sa lisuje sladký jablkový mušt?", "What is sweet apple cider pressed from?", "Woraus wird süßer Apfelmost gepresst?", "¿De qué se extrae la sidra dulce de manzana?", "De quoi presse-t-on le cidre de pomme doux ?", "De que é espremida a sidra de maçã doce?", "food"],
  ["Ktorá zelenina rastie v zelených strukoch a vyzerá ako malé guličky?", "Which vegetable grows in green pods and looks like small balls?", "Welches Gemüse wächst in grünen Schoten und sieht aus wie kleine Kugeln?", "¿Qué verdura crece en vainas verdes y parece pequeñas bolitas?", "Quel légume pousse dans des cosses vertes et ressemble à de petites billes ?", "Qual vegetal cresce em vagens verdes e parece pequenas bolinhas?", "food"]
];

// Let's add more questions for other categories.
// We need to generate up to 1010 questions.
// To make it very compact and fast, let's write a generator function that reads raw specs,
// and we define about 905 more specs!
// Let's write them category by category.
// To ensure the array contains exactly 1010 items, we will define a series of compact specs!

const moreSpecs = [
  // --- COLORS (50 items) ---
  ["Akú farbu má čerstvo napadaný sneh?", "What color is freshly fallen snow?", "Welche Farbe hat frisch gefallener Schnee?", "¿De qué color es la nieve recién caída?", "De quelle couleur est la neige fraîchement tombée ?", "De que cor é a neve que acabou de cair?", "colors"],
  ["Akú farbu má tráva na zdravom trávniku?", "What color is grass on a healthy lawn?", "Welche Farbe hat Gras auf einem gesunden Rasen?", "¿De qué color es la hierba en un césped sano?", "De quelle couleur est l'herbe d'une pelouse saine ?", "De que cor é a grama em um gramado saudável?", "colors"],
  ["Akú farbu má uhlie z bane?", "What color is coal from a mine?", "Welche Farbe hat Kohle aus einer Mine?", "¿De qué color es el carbón de una mina?", "De quelle couleur est le charbon d'une mine ?", "De que cor é o carvão de uma mina?", "colors"],
  ["Akú farbu má zrelá jahoda?", "What color is a ripe strawberry?", "Welche Farbe hat eine reife Erdbeere?", "¿De qué color es una fresa madura?", "De quelle couleur est une fraise mûre ?", "De que cor é um morango maduro?", "colors"],
  ["Akú farbu má obloha počas jasného slnečného dňa?", "What color is the sky on a clear sunny day?", "Welche Farbe hat der Himmel an einem klaren, sonnigen Tag?", "¿De qué color es el cielo en un día despejado y soleado?", "De quelle couleur est le ciel par une journée ensoleillée et claire ?", "De que cor é o céu em um dia limpo e ensolarado?", "colors"],
  ["Akú farbu má zrelá šupka žltého banánu?", "What color is the ripe peel of a yellow banana?", "Welche Farbe hat die reife Schale einer gelben Banane?", "¿De qué color es la cáscara madura de un plátano amarillo?", "De quelle couleur est la peau mûre d'une banane jaune ?", "De que cor é a casca madura de uma banana amarela?", "colors"],
  ["Akú farbu má pomarančová kôra?", "What color is orange peel?", "Welche Farbe hat eine Orangenschale?", "¿De qué color es la cáscara de naranja?", "De quelle couleur est la peau d'orange ?", "De que cor é a casca de laranja?", "colors"],
  ["Akú farbu má mliečna čokoláda?", "What color is milk chocolate?", "Welche Farbe hat Milchschokolade?", "¿De qué color es el chocolate con leche?", "De quelle couleur est le chocolat au lait ?", "De que cor é o chocolate ao leite?", "colors"],
  ["Akú farbu má plameň na plynovej varnej doske?", "What color is the flame on a gas hob?", "Welche Farbe hat die Flamme auf einem Gaskochfeld?", "¿De qué color es la llama de una cocina de gas?", "De quelle couleur est la flamme d'une plaque de cuisson au gaz ?", "De que cor é a chama em um fogão a gás?", "colors"],
  ["Akú farbu majú listy stromov na jeseň pred opadaním?", "What color do tree leaves turn in autumn before falling?", "Welche Farbe nehmen Baumblätter im Herbst an, bevor sie abfallen?", "¿De qué color se ponen las hojas en otoño antes de caer?", "De quelle couleur deviennent les feuilles des arbres en automne avant de tomber ?", "De que cor as folhas das árvores ficam no outono antes de cair?", "colors"],
  ["Akú farbu má vnútro zrelého kiwi?", "What color is the inside of a ripe kiwi?", "Welche Farbe hat das Innere einer reifen Kiwi?", "¿De qué color es the interior de un kiwi maduro?", "De quelle couleur est l'intérieur d'un kiwi mûr ?", "De que cor é o interior de um kiwi maduro?", "colors"],
  ["Akú farbu má kôra stromu brezy?", "What color is birch tree bark?", "Welche Farbe hat die Rinde einer Birke?", "¿De qué color es la corteza del abedul?", "De quelle couleur est l'écorce de bouleau ?", "De que cor é a casca da árvore de bétula?", "colors"],
  ["Akú farbu má kovová strieborná lyžica?", "What color is a metallic silver spoon?", "Welche Farbe hat ein metallischer Silberlöffel?", "¿De qué color es una cuchara de plata metálica?", "De quelle couleur est une cuillère en argent métallique ?", "De que cor é uma colher de prata metálica?", "colors"],
  ["Akú farbu má obal tvojej zubnej pasty vo vnútri tuby?", "What color is the toothpaste inside the tube?", "Welche Farbe hat die Zahnpasta in der Tube?", "¿De qué color es la pasta de dientes dentro del tubo?", "De quelle couleur est le dentifrice à l'intérieur du tube ?", "De que cor é o creme dental dentro do tubo?", "colors"],
  ["Akú farbu má krieda, ktorou učiteľ píše na čiernu tabuľku?", "What color is the chalk that a teacher writes with on a blackboard?", "Welche Farbe hat die Kreide, mit der ein Lehrer auf eine Tafel schreibt?", "¿De qué color es la tiza con la que escribe el maestro en la pizarra?", "De quelle couleur est la craie avec laquelle le maître écrit sur le tableau ?", "De que cor é o giz com o qual o professor escreve na lousa?", "colors"],
  ["Akú farbu má asfalt na novej ceste?", "What color is asphalt on a new road?", "Welche Farbe hat Asphalt auf einer neuen Straße?", "¿De qué color es el asfalto de una carretera nueva?", "De quelle couleur est l'asphalte d'une route neuve ?", "De que cor é o asphalt em uma estrada nova?", "colors"],
  ["Akú farbu má plameň zápalky, keď horí drevo?", "What color is the match flame when the wood burns?", "Welche Farbe hat die Streichholzflamme, wenn das Holz brennt?", "¿De qué color es la llama de un fósforo cuando se quema la madera?", "De quelle couleur est la flamme de l'allumette quand le bois brûle ?", "De que cor é a chama do fósforo quando a madeira queima?", "colors"],
  ["Akú farbu má zrelá paradajka?", "What color is a ripe tomato?", "Welche Farbe hat eine reife Tomate?", "¿De qué color es un tomate maduro?", "De quelle couleur est une tomate mûre ?", "De que cor é um tomate maduro?", "colors"],
  ["Akú farbu má šupka zrelého baklažánu?", "What color is the skin of a ripe eggplant?", "Welche Farbe hat die Schale einer reifen Aubergine?", "¿De qué color es la piel de una berenjena madura?", "De quelle couleur est la peau d'une aubergine mûre ?", "De que cor é a casca de uma berinjela madura?", "colors"],
  ["Akú farbu má slnečnica, keď plno kvitne v lete?", "What color is a sun flower when in full bloom in summer?", "Welche Farbe hat eine Sonnenblume, wenn sie im Sommer in voller Blüte steht?", "¿De qué color es el girasol cuando florece en verano?", "De quelle couleur est un tournesol en pleine floraison en été ?", "De que cor é o girassol quando floresce no verão?", "colors"],
  ["Akú farbu má list stromu javora v lete?", "What color is a maple tree leaf in summer?", "Welche Farbe hat das Blatt eines Ahorns im Sommer?", "¿De qué color es la hoja del arce en verano?", "De quelle couleur est la feuille d'érable en été ?", "De que cor é a folha do bordo no verão?", "colors"],
  ["Akú farbu má kôra zrelého červeného jablka?", "What color is the skin of a ripe red apple?", "Welche Farbe hat die Schale eines reifen roten Apfels?", "¿De qué color es la piel de una manzana roja madura?", "De quelle couleur est la peau d'une pomme rouge mûre ?", "De que cor é a casca de uma maçã vermelha madura?", "colors"],
  ["Akú farbu má vnútro zrelého vodného melónu?", "What color is the inside of a ripe watermelon?", "Welche Farbe hat das Innere einer reifen Wassermelone?", "¿De qué color es el interior de una sandía madura?", "De quelle couleur est l'intérieur d'une pastèque mûre ?", "De que cor é o interior de uma melancia madura?", "colors"],
  ["Akú farbu má mrkva vytiahnutá zo zeme?", "What color is a carrot pulled from the ground?", "Welche Farbe hat eine aus der Erde gezogene Karotte?", "¿De qué color es la zanahoria sacada de la tierra?", "De quelle couleur est une carotte tirée du sol ?", "De que cor é a cenoura arrancada da terra?", "colors"],
  ["Akú farbu má šupka zrelého citróna?", "What color is the peel of a ripe lemon?", "Welche Farbe hat die Schale einer reifen Zitrone?", "¿De qué color es la cáscara de un limón maduro?", "De quelle couleur est la peau d'un citron mûr ?", "De que cor é a casca de um limão maduro?", "colors"],
  ["Akú farbu má čisté biele mlieko?", "What color is pure white milk?", "Welche Farbe hat reine weiße Milch?", "¿De qué color es la leche blanca pura?", "De quelle couleur est le lait blanc pur ?", "De que cor é o leite branco puro?", "colors"],
  ["Akú farbu má papier do tlačiarne?", "What color is printer paper?", "Welche Farbe hat Druckerpapier?", "¿De qué color es el papel de impresora?", "De quelle couleur est le papier d'imprimante ?", "De que cor é o papel de impressora?", "colors"],
  ["Akú farbu má suchá hlina v záhrade?", "What color is dry soil in the garden?", "Welche Farbe hat trockene Erde im Garten?", "¿De qué color es la tierra seca del jardín?", "De quelle couleur est la terre sèche dans le jardin ?", "De que cor é a terra seca no jardim?", "colors"],
  ["Akú farbu má oblek ženícha na klasickej svadbe?", "What color is a groom's suit in a classic wedding?", "Welche Farbe hat der Anzug des Bräutigams bei einer klassischen Hochzeit?", "¿De qué color es el traje del novio en una boda clásica?", "De quelle couleur est le costume du marié dans un mariage classique ?", "De que cor é o terno do noivo em um casamento clássico?", "colors"],
  ["Akú farbu majú listy špenátu?", "What color are spinach leaves?", "Welche Farbe haben Spinatblätter?", "¿De qué color son las hojas de espinaca?", "De quelle couleur sont les feuilles d'épinard ?", "De que cor são as folhas de espinafre?", "colors"],
  ["Akú farbu má drevo pod hnedou kôrou stromu?", "What color is wood under the brown tree bark?", "Welche Farbe hat Holz unter der braunen Baumrinde?", "¿De qué color es la madera bajo la corteza marrón del árbol?", "De quelle couleur est le bois sous l'écorce marron de l'arbre ?", "De que cor é a madeira sob a casca marrom da árvore?", "colors"],
  ["Akú farbu má kôra stromu borovice?", "What color is pine tree bark?", "Welche Farbe hat die Rinde einer Kiefer?", "¿De qué color es la corteza del pino?", "De quelle couleur est l'écorce de pin ?", "De que cor é a casca da árvore de pinheiro?", "colors"],
  ["Akú farbu má oblek Santa Clausa?", "What color is Santa Claus's suit?", "Welche Farbe hat der Anzug vom Weihnachtsmann?", "¿De qué color es el traje de Papá Noel?", "De quelle couleur est le costume du Père Noël ?", "De que cor é a roupa do Papai Noel?", "colors"],
  ["Akú farbu má zrelá čučoriedka?", "What color is a ripe blueberry?", "Welche Farbe hat eine reife Heidelbeere?", "¿De qué color es un arándano maduro?", "De quelle couleur est une myrtille mûre ?", "De que cor é um mirtilo maduro?", "colors"],
  ["Akú farbu má šupka zrelého pomaranča?", "What color is the skin of a ripe orange?", "Welche Farbe hat die Schale einer reifen Orange?", "¿De qué color es la piel de una naranja madura?", "De quelle couleur est la peau d'une orange mûre ?", "De que cor é a casca de uma laranja madura?", "colors"],
  ["Akú farbu má vnútro zrelého avokáda?", "What color is the inside of a ripe avocado?", "Welche Farbe hat das Das Innere einer reifen Avocado?", "¿De qué color es el interior de un aguacate maduro?", "De quelle couleur est l'intérieur d'un avocat mûr ?", "De que cor é o interior de um abacate maduro?", "colors"],
  ["Akú farbu majú vlasy čiernovlasého človeka?", "What color is the hair of a black-haired person?", "Welche Farbe hat das Haar einer schwarzhaarigen Person?", "¿De qué color es el pelo de una persona pelinegra?", "De quelle couleur sont les cheveux d'une personne brune ?", "De que cor é o cabelo de uma pessoa de cabelos pretos?", "colors"],
  ["Akú farbu má dym, keď stúpa z horiaceho dreva?", "What color is smoke when rising from burning wood?", "Welche Farbe hat Rauch, wenn er von brennendem Holz aufsteigt?", "¿De qué color es el humo que sale de la madera ardiendo?", "De quelle couleur est la fumée qui s'élève du bois qui brûle ?", "De que cor é a fumaça quando sobe da madeira queimando?", "colors"],
  ["Akú farbu má klasická tehla?", "What color is a classic brick?", "Welche Farbe hat ein klassischer Backstein?", "¿De qué color es un ladrillo clásico?", "De quelle couleur est une brique classique ?", "De que cor é um tijolo clássico?", "colors"],
  ["Akú farbu má škrupina vlašského orecha?", "What color is a walnut shell?", "Welche Farbe hat eine Walnussschale?", "¿De qué color es la cáscara de nuez?", "De quelle couleur est la coquille de noix ?", "De que cor é la casca de noz?", "colors"],
  ["Akú farbu majú zuby zdravého človeka?", "What color are the teeth of a healthy person?", "Welche Farbe haben die Zähne eines gesunden Menschen?", "¿De qué color son los dientes de una persona sana?", "De quelle couleur sont les dents d'une personne en bonne santé ?", "De que cor são os dentes de uma pessoa saudável?", "colors"],
  ["Akú farbu má kôra stromu smreka?", "What color is spruce tree bark?", "Welche Farbe hat die Rinde einer Fichte?", "¿De qué color es la corteza del abeto?", "De quelle couleur est l'écorce d'épicéa ?", "De que cor é a casca da árvore de abeto?", "colors"],
  ["Akú farbu má koža klasického ružového prasiatka?", "What color is the skin of a classic pink pig?", "Welche Farbe hat die Haut eines klassischen rosa Schweins?", "¿De qué color es la piel de un cerdo rosa clásico?", "De quelle couleur est la peau d'un cochon rose classique ?", "De que cor é a pele de um porco rosa clássico?", "colors"],
  ["Akú farbu má vnútro zrelého banánu?", "What color is the inside of a ripe banana?", "Welche Farbe hat das Innere einer reifen Banane?", "¿De qué color es el interior de un plátano maduro?", "De quelle couleur est l'intérieur d'une banane mûre ?", "De que cor é o interior de uma banana madura?", "colors"],
  ["Akú farbu má krieda, ktorou učiteľ píše na zelenú tabuľku?", "What color is the chalk with which a teacher writes on a green board?", "Welche Farbe hat die Kreide, mit der ein Lehrer auf eine grüne Tafel schreibt?", "¿De qué color es la tiza con la que escribe el maestro en una pizarra verde?", "De quelle couleur est la craie avec laquelle le maître écrit sur un tableau vert ?", "De que cor é o giz com o qual o professor escreve em uma lousa verde?", "colors"],
  ["Akú farbu má šupka zrelého červeného melónu?", "What color is the skin of a ripe watermelon?", "Welche Farbe hat die Schale einer reifen Wassermelone?", "¿De qué color es la piel de una sandía madura?", "De quelle couleur est la peau d'une pastèque mûre ?", "De que cor é a casca de uma melancia madura?", "colors"],
  ["Akú farbu má obloha v noci, keď nie sú oblaky?", "What color is the sky at night when there are no clouds?", "Welche Farbe hat der Himmel nachts, wenn keine Wolken da sind?", "¿De qué color es el cielo de noche cuando no hay nubes?", "De quelle couleur est le ciel la nuit quand il n'y a pas de nuages ?", "De que cor é o céu à noite quando não há nuvens?", "colors"],
  ["Akú farbu má lístie borovice po celý rok?", "What color is pine foliage all year round?", "Welche Farbe haben Kiefernadeln das ganze Jahr über?", "¿De qué color son las hojas del pino todo el año?", "De quelle couleur sont les aiguilles du pin toute l'année ?", "De que cor são as folhas do pinheiro o ano todo?", "colors"],
  ["Akú farbu majú vlasy svetlovlasého človeka?", "What color is the hair of a light-haired person?", "Welche Farbe hat das Haar einer hellhaarigen Person?", "¿De qué color es el pelo de una persona rubia?", "De quelle couleur sont les cheveux d'une personne blonde ?", "De que cor é o cabelo de uma pessoa loira?", "colors"],
  ["Akú farbu má šupka zrelého hrozna na víno?", "What color is the skin of ripe wine grapes?", "Welche Farbe hat die Schale reifer Weintrauben?", "¿De qué color es la piel de las uvas maduras para vino?", "De quelle couleur est la peau des raisins de cuve mûrs ?", "De que cor é a casca das uvas maduras para vinho?", "colors"],

  // --- NUMBERS & MATH (30 items) ---
  ["Koľko kolies má klasický dvojkolesový bicykel?", "How many wheels does a classic two-wheeled bicycle have?", "Wie viele Räder hat ein klassisches Zweirad?", "¿Cuántas ruedas tiene una bicicleta de dos ruedas clásica?", "Combien de roues a un vélo classique à deux roues ?", "Quantas rodas tem uma bicicleta clássica de duas rodas?", "numbers"],
  ["Koľko prstov má zdravý človek na jednej ruke?", "How many fingers does a healthy human have on one hand?", "Wie viele Finger hat ein gesunder Mensch an einer Hand?", "¿Cuántos dedos tiene una persona sana en una mano?", "Combien de doigts a une personne en bonne santé sur une main ?", "Quantos dedos uma pessoa saudável tem em uma mão?", "numbers"],
  ["Koľko kolies má bežné osobné auto?", "How many wheels does a regular passenger car have?", "Wie viele Räder hat ein normales Auto?", "¿Cuántas ruedas tiene un coche de pasajeros común?", "Combien de roues a une voiture de tourisme ordinaire ?", "Quantas rodas tem um carro de passeio comum?", "numbers"],
  ["Koľko dni má jeden bežný týždeň?", "How many days are in a regular week?", "Wie viele Tage hat eine normale Woche?", "¿Cuántos días tiene una semana común?", "Combien de jours a une semaine ordinaire ?", "Quantos dias tem uma semana comum?", "numbers"],
  ["Koľko prstov na nohách má človek spolu na oboch nohách?", "How many toes does a human have on both feet together?", "Wie viele Zehen hat ein Mensch an beiden Füßen zusammen?", "¿Cuántos dedos tiene una persona en ambos pies juntos?", "Combien d'orteils a un être humain sur les deux pieds réunis ?", "Quantos dedos uma pessoa tem em ambos os pés juntos?", "numbers"],
  ["Koľko hodín trvá jeden celý deň?", "How many hours are in one full day?", "Wie viele Stunden hat ein ganzer Tag?", "¿Cuántas horas tiene un día entero?", "Combien d'heures dure une journée entière ?", "Quantas horas tem um dia inteiro?", "numbers"],
  ["Koľko mesiacov má jeden rok?", "How many months are in one year?", "Wie viele Monate hat ein Jahr?", "¿Cuántos meses tiene un año?", "Combien de mois y a-t-il dans une année ?", "Quantos meses tem um ano?", "numbers"],
  ["Koľko strán má geometrický trojuholník?", "How many sides does a geometric triangle have?", "Wie viele Seiten hat ein geometrisches Dreieck?", "¿Cuántos lados tiene un triángulo geométrico?", "Combien de côtés a un triangle géométrique ?", "Quantos lados tem um triângulo geométrico?", "numbers"],
  ["Koľko očí má zdravý človek?", "How many eyes does a healthy human have?", "Wie viele Augen hat ein gesunder Mensch?", "¿Cuántos ojos tiene una persona sana?", "Combien d'yeux a un être humain en bonne santé ?", "Quantos olhos uma pessoa saudável tem?", "numbers"],
  ["Koľko rúk má človek?", "How many arms does a human have?", "Wie viele Arme hat ein Mensch?", "¿Cuántos brazos tiene un humano?", "Combien de bras a un être humain ?", "Quantos braços tem um ser humano?", "numbers"],
  ["Koľko minút má jedna hodina?", "How many minutes are in one hour?", "Wie viele Minuten hat eine Stunde?", "¿Cuántos minutos tiene una hora?", "Combien de minutes y a-t-il dans une heure ?", "Quantos minutos tem uma hora?", "numbers"],
  ["Koľko sekúnd má jedna minúta?", "How many seconds are in one minute?", "Wie viele Sekunden hat eine minute?", "¿Cuántos segundos tiene un minuto?", "Combien de secondes y a-t-il dans une minute ?", "Quantos segundos tem um minuto?", "numbers"],
  ["Koľko strán má geometrický štvorec?", "How many sides does a geometric square have?", "Wie viele Seiten hat ein geometrisches Quadrat?", "¿Cuántos lados tiene un cuadrado geométrico?", "Combien de côtés a un carré géométrique ?", "Quantos lados tem um quadrado geométrico?", "numbers"],
  ["Koľko uší má človek?", "How many ears does a human have?", "Wie viele Ohren hat ein Mensch?", "¿Cuántos oídos tiene una persona?", "Combien d'oreilles a un être humain ?", "Quantas orelhas tem um ser humano?", "numbers"],
  ["Koľko prstov má človek spolu na oboch rukách?", "How many fingers does a human have on both hands together?", "Wie viele Finger hat ein Mensch an beiden Händen zusammen?", "¿Cuántos dedos tiene una persona en ambas manos juntas?", "Combien de doigts a un être humain sur les deux mains réunies ?", "Quantos dedos uma pessoa tem em ambas as mãos juntas?", "numbers"],
  ["Koľko kolies má klasická trojkolka pre deti?", "How many wheels does a classic tricycle for children have?", "Wie viele Räder hat ein klassisches Dreirad für Kinder?", "¿Cuántas ruedas tiene un triciclo clásico para niños?", "Combien de roues a un tricycle classique pour enfants ?", "Quantas rodas tem um triciclo clássico para crianças?", "numbers"],
  ["Koľko tónov má základná hudobná stupnica?", "How many notes are in a basic musical scale?", "Wie viele Töne hat eine grundlegende Musiktonleiter?", "¿Cuántas notas tiene una escala musical básica?", "Combien de notes y a-t-il dans une gamme musicale de base ?", "Quantas notas tem uma escala musical básica?", "numbers"],
  ["Koľko nôh má zdravá krava?", "How many legs does a healthy cow have?", "Wie viele Beine hat eine gesunde Kuh?", "¿Cuántas patas tiene una vaca sana?", "Combien de pattes a une vache en bonne santé ?", "Quantas patas tem uma vaca saudável?", "numbers"],
  ["Koľko nôh má pavúk?", "How many legs does a spider have?", "Wie viele Beine hat eine Spinne?", "¿Cuántas patas tiene una araña?", "Combien de pattes a une araignée ?", "Quantas patas tem uma aranha?", "numbers"],
  ["Koľko kolies má klasický jednokolový fúrik?", "How many wheels does a classic single-wheel wheelbarrow have?", "Wie viele Räder hat eine klassische einrädrige Schubkarre?", "¿Cuántas ruedas tiene una carretilla clásica de una sola rueda?", "Combien de roues a une brouette classique à roue unique ?", "Quantas rodas tem um carrinho de mão clássico de uma roda?", "numbers"],
  ["Koľko ročných období má jeden bežný kalendárny rok?", "How many seasons are in a regular calendar year?", "Wie viele Jahreszeiten hat ein normales Kalenderjahr?", "¿Cuántas estaciones tiene un año natural común?", "Combien de saisons compte une année civile ordinaire ?", "Quantas estações tem um ano civil comum?", "numbers"],
  ["Koľko kolies má klasický detský bicykel s pomocnými kolieskami?", "How many wheels does a kids' bicycle with training wheels have?", "Wie viele Räder hat ein Kinderfahrrad mit Stützrädern?", "¿Cuántas ruedas tiene una bicicleta infantil con ruedas de entrenamiento?", "Combien de roues a un vélo pour enfants avec des roues d'apprentissage ?", "Quantas rodas tem uma bicicleta infantil com rodinhas de treino?", "numbers"],
  ["Koľko kolies má bežný skejtbord?", "How many wheels does a regular skateboard have?", "Wie viele Räder hat ein normales Skateboard?", "¿Cuántas ruedas tiene un monopatín común?", "Combien de roues a un skateboard ordinaire ?", "Quantas rodas tem um skate comum?", "numbers"],
  ["Koľko nôh má mravec?", "How many legs does an ant have?", "Wie viele Beine hat eine Ameise?", "¿Cuántas patas tiene una hormiga?", "Combien de pattes a une fourmi ?", "Quantas patas tem uma formiga?", "numbers"],
  ["Koľko hrbov má klasická dromedária ťava?", "How many humps does a classic dromedary camel have?", "Wie viele Höcker hat ein klassisches Dromedar-Kamel?", "¿Cuántas jorobas tiene un camello dromedario clásico?", "Combien de bosses a un dromadaire classique ?", "Quantas corcovas tem um dromedário clássico?", "numbers"],
  ["Koľko prstov má mačka na jednej prednej labke?", "How many toes does a cat have on one front paw?", "Wie viele Zehen hat eine Katze an einer Vorderpfote?", "¿Cuántos dedos tiene un gato en una pata delantera?", "Combien d'orteils a un chat sur une patte avant ?", "Quantos dedos um gato tem em uma pata dianteira?", "numbers"],
  ["Koľko očí má mucha?", "How many eyes does a fly have?", "Wie viele Augen hat eine Fliege?", "¿Cuántos ojos tiene una mosca?", "Combien d'yeux a une mouche ?", "Quantos olhos tem uma mosca?", "numbers"],
  ["Koľko dní má mesiac január?", "How many days are in the month of January?", "Wie viele Tage hat der Monat Januar?", "¿Cuántos días tiene el mes de enero?", "Combien de jours compte le mois de janvier ?", "Quantos dias tem o mês de janeiro?", "numbers"],
  ["Koľko krídiel má lietadlo?", "How many wings does an airplane have?", "Wie viele Flügel hat ein Flugzeug?", "¿Cuántas alas tiene un avión?", "Combien d'ailes a un avion ?", "Quantas asas tem um avião?", "numbers"],
  ["Koľko rohov má bežný obdĺžnik?", "How many corners does a regular rectangle have?", "Wie viele Ecken hat ein normales Rechteck?", "¿Cuántas esquinas tiene un rectángulo común?", "Combien de coins a un rectangle ordinaire ?", "Quantas pontas tem um retângulo comum?", "numbers"],

  // --- BODY & SENSES (40 items) ---
  ["Ktorým orgánom vidíš svet okolo seba?", "Which organ do you see the world around you with?", "Mit welchem Organ sieht man die Welt um sich herum?", "¿Con qué órgano ves el mundo a tu alrededor?", "Avec quel organe vois-tu le monde autour de toi ?", "Com qual órgão você vê o mundo ao seu redor?", "body"],
  ["Ktorým orgánom počúvaš hudbu?", "Which organ do you listen to music with?", "Mit welchem Organ hört man Musik?", "¿Con qué órgano escuchas música?", "Avec quel organe écoutes-tu de la musique ?", "Com qual órgão você ouve música?", "body"],
  ["Ktorým orgánom dýchaš a cítiš vône?", "Which organ do you breathe and smell scents with?", "Mit welchem Organ atmet und riecht man Düfte?", "¿Con qué órgano respiras y hueles los aromas?", "Avec quel organe respires-tu et sens-tu les odeurs ?", "Com qual órgão você respira e sente os cheiros?", "body"],
  ["V ktorej časti tela sa nachádza ľudský mozog?", "In which part of the body is the human brain located?", "In welchem Teil des Körpers befindet sich das menschliche Gehirn?", "¿En qué parte del cuerpo se encuentra el cerebro humano?", "Dans quelle partie du corps se trouve le cerveau humain ?", "Em qual parte do corpo fica o cérebro humano?", "body"],
  ["Čo bije v tvojom hrudníku a poháňa krv?", "What beats in your chest and pumps blood?", "Was schlägt in deiner Brust und pumpt Blut?", "¿Qué late en tu pecho y bombea sangre?", "Qu'est-ce qui bat dans ta poitrine et pompe le sang ?", "O que bate no seu peito e bombeia sangue?", "body"],
  ["Čím žuješ jedlo vo svojich ústach?", "What do you chew food with in your mouth?", "Womit kaut man Essen im Mund?", "¿Con qué masticas la comida en tu boca?", "Avec quoi mâches-tu la nourriture dans ta bouche ?", "Com o que você mastiga a comida na boca?", "body"],
  ["Čím pokrývaš svoju hlavu a rastie to na nej?", "What covers your head and grows on it?", "Was bedeckt deinen Kopf und wächst darauf?", "¿Qué cubre tu cabeza y crece en ella?", "Qu'est-ce qui couvre ta tête et pousse dessus ?", "O que cobre sua cabeça e cresce nela?", "body"],
  ["Ktorú časť nohy si obúvaš do topánky?", "Which part of the leg do you put into a shoe?", "Welchen Teil des Beins steckt man in einen Schuh?", "¿Qué parte del pie te pones en el zapato?", "Quelle partie du pied mets-tu dans une chaussure ?", "Qual parte do pé você coloca no sapato?", "body"],
  ["Na ktorej časti tela nosíš náramkové hodinky?", "On which part of the body do you wear a wristwatch?", "An welchem Teil des Körpers trägt man eine Armbanduhr?", "¿En qué parte del cuerpo llevas el reloj de pulsera?", "Sur quelle partie du corps portes-tu une montre-bracelet ?", "Em qual parte do corpo você usa o relógio de pulso?", "body"],
  ["Ktorým zmyslom vnímaš chuť jedla?", "With which sense do you perceive the taste of food?", "Mit welchem Sinn nimmt man den Geschmack von Essen wahr?", "¿Con qué sentido percibes el sabor de la comida?", "Avec quel sens perçois-tu le goût des aliments ?", "Com qual sentido você percebe o sabor da comida?", "body"],
  ["Ktoré kosti v ústach používaš na hryzenie jablka?", "Which bones in your mouth do you use to bite an apple?", "Welche Knochen im Mund benutzt man, um in einen Apfel zu beißen?", "¿Qué huesos de la boca usas para morder una manzana?", "Quels os de la bouche utilises-tu pour croquer une pomme ?", "Quais ossos da boca você usa para morder uma maçã?", "body"],
  ["Čo ti chráni oči pred potom stekajúcim z čela?", "What protects your eyes from sweat running down your forehead?", "Was schützt die Augen vor Schweiß, der von der Stirn läuft?", "¿Qué protege tus ojos del sudor que baja de la frente?", "Qu'est-ce qui protège tes yeux de la sueur qui coule du front ?", "O que protege seus olhos do suor que desce da testa?", "body"],
  ["Aké ohybné kĺby spájajú tvoje stehná s lýtkami?", "What flexible joints connect your thighs to your calves?", "Welche flexiblen Gelenke verbinden deine Oberschenkel mit den Waden?", "¿Qué articulaciones flexibles conectan tus muslos con tus pantorrillas?", "Quelles articulations flexibles relient tes cuisses à tes mollets ?", "Quais articulações flexíveis conectam suas coxas às panturrilhas?", "body"],
  ["Čím píšeš, kreslíš a chytáš predmety?", "What do you write, draw, and catch objects with?", "Womit schreibt, zeichnet und greift man Gegenstände?", "¿Con qué escribes, dibujas y agarras objetos?", "Avec quoi écris-tu, dessines-tu et attrapes-tu des objets ?", "Com o que você escreve, desenha e segura objetos?", "body"],
  ["Ktorá ohybná časť krku spája hlavu s trupom?", "Which flexible part of the neck connects the head to the torso?", "Welcher flexible Teil des Halses verbindet den Kopf mit dem Rumpf?", "¿Qué parte flexible del cuello conecta la cabeza con el torso?", "Quelle partie flexible du cou relie la tête au torse ?", "Qual parte flexível do pescoço conecta a cabeça ao tronco?", "body"],
  ["Čím kráčaš, beháš a skáčeš po zemi?", "What do you walk, run, and jump on the ground with?", "Womit geht, läuft und springt man auf dem Boden?", "¿Con qué caminas, corres y saltas en el suelo?", "Avec quoi marches-tu, cours-tu et sautes-tu sur le sol ?", "Com o que você caminha, corre e pula no chão?", "body"],
  ["Ktorý zmysel ti hovorí, že jedlo vonia príjemne?", "Which sense tells you that food smells nice?", "Welcher Sinn verrät, dass Essen angenehm riecht?", "¿Qué sentido te dice que la comida huele bien?", "Quel sens te dit que la nourriture sent bon ?", "Qual sentido diz que a comida cheira bem?", "body"],
  ["Aké tvrdé biele veci ti vyrastajú v ústach, keď si dieťa?", "What hard white things grow in your mouth when you are a child?", "Welche harten weißen Dinge wachsen im Mund, wenn man ein Kind ist?", "¿Qué cosas blancas y duras crecen en tu boca cuando eres niño?", "Quelles choses blanches et dures poussent dans ta bouche quand tu es enfant ?", "Quais coisas brancas e duras crescem na sua boca quando você é criança?", "body"],
  ["Ktorý zmysel ti pomáha počuť hlas priateľa?", "Which sense helps you hear a friend's voice?", "Welcher Sinn hilft, die Stimme eines Freundes zu hören?", "¿Qué sentido te ayuda a oír la voz de un amigo?", "Quel sens t'aide à entendre la voix d'un ami ?", "Qual sentido ajuda você a ouvir a voz de um amigo?", "body"],
  ["Ktoré kĺby na rukách ti umožňujú ohýbať lakte?", "Which joints on your arms allow you to bend your elbows?", "Welche Gelenke an den Armen ermöglichen es, die Ellbogen zu beugen?", "¿Qué articulaciones de los brazos te permiten doblar los codos?", "Quelles articulations des bras te permettent de plier les coudes ?", "Quais articulações dos braços ajudam você a dobrar os cotovelos?", "body"],
  ["Aké jemné chĺpky ti lemujú očné viečka?", "What fine hairs line your eyelids?", "Welche feinen Härchen säumen deine Augenlider?", "¿Qué pelos finos bordean tus párpados?", "Quels poils fins bordent tes paupières ?", "Quais pelos finos cobrem suas pálpebras?", "body"],
  ["Ktorá mäkká červená vec sa hýbe vo tvojich ústach, keď hovoríš?", "What soft red thing moves in your mouth when you speak?", "Welches weiche rote Ding bewegt sich im Mund, wenn man spricht?", "¿Qué cosa roja y blanda se mueve en tu boca cuando hablas?", "Quelle chose rouge et douce bouge dans ta bouche quand tu parles ?", "Qual coisa vermelha e macia se move na sua boca quando você fala?", "body"],
  ["Ktorým ohybným kĺbom spájaš nohu s chodidlom?", "With which flexible joint do you connect the leg to the foot?", "Mit welchem flexiblen Gelenk verbindet man das Bein mit dem Fuß?", "¿Con qué articulación flexible conectas la pierna con el pie?", "Avec quelle articulation flexible relies-tu la jambe au pied ?", "Com qual articulação flexível você conecta a perna ao pé?", "body"],
  ["Ktorá veľká kosť chráni tvoj mozog pred nárazom?", "What big bone protects your brain from impact?", "Welcher große Knochen schützt dein Gehirn vor Stößen?", "¿Qué hueso grande protege tu cerebro de un impacto?", "Quel grand os protège ton cerveau des chocs ?", "Qual osso grande protege seu cérebro de impactos?", "body"],
  ["Ktorý vnútorný organ čistí krv a produkuje moč?", "Which internal organ cleans the blood and produces urine?", "Welches innere Organ reinigt das Blut und produziert Urin?", "¿Qué órgano interno limpia la sangre y produce orina?", "Quel organe interne nettoie le sang et produit l'urine ?", "Qual órgão interno limpa o sangue e produz urina?", "body"],
  ["Čím zatváraš oči, keď ideš spať alebo žmurkáš?", "What do you close your eyes with when you go to sleep or blink?", "Womit schließt man die Augen, wenn man schlafen geht oder blinzelt?", "¿Con qué cierras los ojos cuando te vas a dormir o parpadeas?", "Avec quoi fermes-tu les yeux quand tu t'endors ou cilles ?", "Com o que você fecha os olhos quando vai dormir ou pisca?", "body"],
  ["Ktorá kosť tvorí hlavnú os tvojho chrbta?", "Which bone forms the main axis of your back?", "Welcher Knochen bildet die Hauptachse deines Rückens?", "¿Qué hueso forma el eje principal de tu espalda?", "Quel os forme l'axe principal de ton dos ?", "Qual osso forma o eixo principal das suas costas?", "body"],
  ["Čo ti pokrýva celé telo a chráni ťa pred chladom a infekciami?", "What covers your entire body and protects you from cold and infections?", "Was bedeckt deinen ganzen Körper und schützt vor Kälte und Infektionen?", "¿Qué cubre todo tu cuerpo y te protege del frío y las infecciones?", "Qu'est-ce qui couvre tout ton corps et te protège du froid et des infections ?", "O que cobre todo o seu corpo e protege você do frio e de infecções?", "body"],
  ["Ktorá ohybná časť prsta ti pomáha držať ceruzku pevne?", "Which flexible part of the finger helps you hold a pencil firmly?", "Welcher flexible Teil des Fingers hilft, einen Bleistift festzuhalten?", "¿Qué parte flexible del dedo te ayuda a sujetar firmemente un lápiz?", "Quelle partie flexible du doigt t'aide à tenir fermement un crayon ?", "Qual parte flexível do dedo ajuda você a segurar o lápiz com firmeza?", "body"],
  ["Čím ochutnávaš jedlo a rozoznávaš sladké a slané?", "What do you taste food with and distinguish sweet and salty?", "Womit schmeckt man Essen und unterscheidet süß und salzig?", "¿Con qué pruebas la comida y distingues lo dulce y lo salado?", "Avec quoi goûtes-tu les aliments et distingues-tu le sucré du salé ?", "Com o que você prova a comida e distingue o doce do salgado?", "body"],
  ["Ktoré kosti chránia tvoje pľúca a srdce v hrudnom koši?", "Which bones protect your lungs and heart in the rib cage?", "Welche Knochen schützen deine Lunge und dein Herz im Brustkorb?", "¿Qué huesos protegen tus pulmões y corazón en la caja torácica?", "Quels os protègent tes poumons et ton cœur dans la cage thoracique ?", "Quais ossos protegem seus pulmões e coração na caixa torácica?", "body"],
  ["Ktorý zmysel ti hovorí, že sa dotýkaš niečoho horúceho?", "Which sense tells you that you are touching something hot?", "Welcher Sinn verrät, dass man etwas Heißes berührt?", "¿Qué sentido te dice que estás tocando algo caliente?", "Quel sens te dit que tu touches quelque chose de chaud ?", "Qual sentido diz que você está tocando em algo quente?", "body"],
  ["Ktoré zmyslové orgány sa nachádzajú na bokoch tvojej hlavy?", "Which sensory organs are located on the sides of your head?", "Welche Sinnesorgane befinden sich an den Seiten deines Kopfes?", "¿Qué órganos sensoriales se encuentran a los lados de la cabeza?", "Quels organes sensoriels se trouvent sur les côtés de ta tête ?", "Quais órgãos sensoriais ficam nas laterais da sua cabeça?", "body"],
  ["Aké mäkké červené pyskami pokrývajú tvoje ústa zvonka?", "What soft red lips cover your mouth on the outside?", "Welche weichen roten Lippen bedecken deinen Mund von außen?", "¿Qué labios blandos y rojos cubren tu boca por fuera?", "Quelles lèvres douces et rouges couvrent ta bouche de l'extérieur ?", "Quais lábios macios e vermelhos cobrem sua boca por fora?", "body"],
  ["Ktorý zmysel ti pomáha vidieť krásne farby kvetov?", "Which sense helps you see the beautiful colors of flowers?", "Welcher Sinn hilft, die schönen Farben der Blumen zu sehen?", "¿Qué sentido te ayuda a ver los hermosos colores de las flores?", "Quel sens t'aide à voir les belles couleurs des fleurs ?", "Qual sentido ajuda você a ver as cores lindas das flores?", "body"],
  ["Čo používaš na ohnutie nohy, keď si sadáš na stoličku?", "What do you use to bend your leg when sitting on a chair?", "Was benutzt man, um das Bein zu beugen, wenn man sich auf einen Stuhl setzt?", "¿Qué usas para doblar la pierna al sentarte en una silla?", "Qu'utilises-tu pour plier la jambe quand tu t'assieds sur une chaise ?", "O que você usa para dobrar a perna quando se senta em uma cadeira?", "body"],
  ["Ktoré chĺpky ti rastú nad očami na tvári?", "What hair grows above your eyes on your face?", "Welche Haare wachsen über den Augen im Gesicht?", "¿Qué pelo crece sobre tus ojos en la cara?", "Quels poils poussent au-dessus de tes yeux sur le visage ?", "Qual pelo cresce acima dos seus olhos no rosto?", "body"],
  ["Aké tvrdé rohovinové platničky ti chránia končeky prstov na rukách?", "What hard horn-like plates protect your fingertips?", "Welche harten hornartigen Platten schützen deine Fingerkuppen?", "¿Qué placas duras protegen las yemas de tus dedos?", "Quelles plaques dures protègent le bout de tes doigts ?", "Quais placas duras protegem as pontas dos seus dedos?", "body"],
  ["Čím prehĺtaš jedlo z úst do žalúdka?", "What do you swallow food with from mouth to stomach?", "Womit schluckt man Nahrung vom Mund in den Magen?", "¿Con qué tragas la comida de la boca al estómago?", "Avec quoi avales-tu la nourriture de la bouche à l'estomac ?", "Com o que você engole a comida da boca para o estômago?", "body"],
  ["Ktoré svaly na nohách ti pomáhajú odraziť sa pri skoku do výšky?", "Which leg muscles help you push off when high jumping?", "Welche Beinmuskeln helfen beim Abspringen beim Hochsprung?", "¿Qué músculos de las piernas te ayudan a impulsarte en el salto de altura?", "Quels muscles des jambes t'aident à prendre ton élan lors d'un saut en hauteur ?", "Quais muscles das pernas ajudam você a pegar impulso no salto em altura?", "body"]
];

// Combine arrays and append to the main database
for (const spec of moreSpecs) {
  rawSpecs.push(spec);
}

// Now let's append listSpecs
const listSpecs = {
  household: [
    ["vankúš", "Ktorú mäkkú vec si dávaš pod hlavu, keď spíš v posteli?", "What soft thing do you put under your head when you sleep in bed?", "Welches weiche Ding legt man unter den Kopf, wenn man im Bett schläft?", "¿Qué objeto blando te pones bajo la cabeza al dormir en la cama?", "Quelle chose douce mets-tu sous ta tête quand tu dors dans ton lit ?", "Qual coisa macia você coloca sob a cabeça quando dorme na cama?"],
    ["metla", "Čo používaš na zametanie omroviniek z dlážky v kuchyni?", "What do you use to sweep crumbs off the kitchen floor?", "Was benutzt man, um Krümel vom Küchenboden aufzufegen?", "¿Qué usas para barrer las migas del suelo de la cocina?", "Qu'utilises-tu pour balayer les miettes du sol de la cuisine ?", "O que você usa para varrer as migalhas do chão da cozinha?"],
    ["zrkadlo", "V čom vidíš svoj vlastný odraz, keď stojíš v kúpeľni?", "What do you see your own reflection in when standing in the bathroom?", "Worin sieht man sein eigenes Spiegelbild, wenn man im Bad steht?", "¿En qué ve tu propio reflejo cuando estás en el baño?", "Dans quoi vois-tu ton propre reflet quand tu es dans la salle de bain ?", "Em que você vê o seu próprio reflexo quando está no banheiro?"],
    ["žehlička", "Čo používaš na vyhladenie pokrčeného oblečenia?", "What do you use to smooth out wrinkled clothes?", "Was benutzt man, um zerknitterte Kleidung glattzubügeln?", "¿Qué usas para alisar la ropa arrugada?", "Qu'utilises-tu pour défroisser des vêtements froissés ?", "O que você usa para passar roupas amassadas?"],
    ["vysávač", "Akým elektrickým strojom vysávaš prach z koberca?", "What electrical machine do you use to vacuum dust from the carpet?", "Mit welcher elektrischen Maschine saugt man Staub vom Teppich?", "¿Qué máquina eléctrica usas para aspirar el polvo de la alfombra?", "Quel appareil électrique utilises-tu pour aspirer la poussière du tapis ?", "Qual máquina elétrica você usa para aspirar o pó do tapete?"],
    ["hrebeň", "Čo používaš na úpravu rozcuchaných vlasov pred zrkadlom?", "What do you use to style messy hair in front of the mirror?", "Was benutzt man, um unordentliches Haar vor dem Spiegel zu stylen?", "¿Qué usas para peinar el cabello alborotado frente al espejo?", "Qu'utilises-tu pour coiffer des cheveux ébouriffés devant le miroir ?", "O que você usa para pentear o cabelo bagunçado na frente do espelho?"],
    ["mydlo", "Čo používaš spolu s teplou vodou na umývanie špinavých rúk?", "What do you use along with warm water to wash dirty hands?", "Was benutzt man zusammen mit warmem Wasser, um schmutzige Hände zu waschen?", "¿Qué usas junto con agua caliente para lavarte las manos sucias?", "Qu'utilises-tu avec de l'eau chaude pour te laver les mains sales ?", "O que você usa junto com água morna para lavar as mãos sujas?"],
    ["kanvica", "V čom varíš horúcu vodu na ranný čaj alebo kávu?", "What do you boil hot water in for morning tea or coffee?", "Worin kocht man heißes Wasser für den morgendlichen Tee oder Kaffee?", "¿En qué hierves agua caliente para el té o café de la mañana?", "Dans quoi fais-tu bouillir de l'eau chaude pour le thé ou le café du matin ?", "Em que você ferve água quente para o chá ou café da manhã?"],
    ["uterák", "Čo používaš na vysušenie tela po sprchovaní?", "What do you use to dry your body after showering?", "Was benutzt man, um den Körper nach dem Duschen abzutrocknen?", "¿Qué usas para secarte el cuerpo después de ducharte?", "Qu'utilises-tu pour te sécher le corps après la douche ?", "O que você usa para se secar após o banho?"],
    ["skriňa", "Kam si vešiaš kabáty a ukladáš oblečenie v spálni?", "Where do you hang coats and store clothes in the bedroom?", "Wo hängt man Mäntel auf und lagert Kleidung im Schlafzimmer?", "¿Dónde cuelgas los abrigos y guardas la ropa en el dormitorio?", "Où pends-tu les manteaux et ranges-tu les vêtements dans la chambre ?", "Onde você pendura casacos e guarda roupas no quarto?"]
  ],
  school: [
    ["tabuľa", "Na čo píše učiteľ v triede bielou kriedou?", "What does a teacher write on in class with white chalk?", "Worauf schreibt der Lehrer im Klassenzimmer mit weißer Kreide?", "¿En qué escribe el maestro en clase con tiza blanca?", "Sur quoi le maître écrit-il en classe avec de la craie blanche ?", "Em que o professor escreve na sala com giz branco?"],
    ["peračník", "Kam si žiaci ukladajú perá, ceruzky a strúhadlo?", "Where do students store pens, pencils, and the sharpener?", "Wo bewahren Schüler Stifte, Bleistifte und den Anspitzer auf?", "¿Dónde guardan los estudiantes los bolígrafos, lápices y sacapuntas?", "Où les élèves rangent-ils stylos, crayons et taille-crayon ?", "Onde os alunos guardam canetas, lápis e apontador?"],
    ["aktovka", "V čom si nosí žiak zošity a učebnice do školy?", "What does a student carry notebooks and textbooks to school in?", "Worin trägt ein Schüler Hefte und Lehrbücher zur Schule?", "¿En qué lleva el alumno los cuadernos y libros a la escuela?", "Dans quoi l'élève transporte-t-il cahiers et manuels à l'école ?", "Em que o aluno carrega cadernos e livros para a escola?"],
    ["zošit", "Do čoho si žiaci zapisujú poznámky počas vyučovania?", "What do students write notes in during class?", "Worin schreiben Schüler während des Unterrichts Notizen?", "¿En qué escriben notas los estudiantes durante la clase?", "Dans quoi les élèves écrivent-ils des notes pendant les cours ?", "Em que os alunos escrevem notas durante as aulas?"],
    ["guma", "Čo používaš na odstránenie stôp po grafitovej ceruzke?", "What do you use to remove graphite pencil marks?", "Was benutzt man, um Bleistiftstriche zu entfernen?", "¿Qué usas para borrar las marcas de lápiz de grafito?", "Qu'utilises-tu pour effacer les traces de crayon de papier ?", "O que você usa para apagar marcas de lápis de grafite?"],
    ["pravítko", "Ktorá plastová pomôcka ti pomáha odmerať dĺžku v centimetroch?", "Which plastic tool helps you measure length in centimeters?", "Welches Kunststoffwerkzeug hilft beim Messen der Länge in Zentimetern?", "¿Qué herramienta de plástico te ayuda a medir la longitud en centímetros?", "Quel outil en plastique t'aide à mesurer la longueur en centimètres ?", "Qual ferramenta de plástico ajuda você a medir o comprimento em centímetros?"],
    ["šlabikár", "Z akej knihy sa prváci učia prvé písmenká abecedy?", "From what book do first-graders learn their first letters?", "Aus welchem Buch lernen Erstklässler ihre ersten Buchstaben?", "¿De qué libro aprenden los niños de primer grado sus primeras letras?", "Dans quel livre les élèves de CP apprennent-ils leurs premières lettres ?", "Em qual livro os alunos do primeiro ano aprendem as primeiras letras?"],
    ["glóbus", "Čo zobrazuje zmenšený guľatý model našej planéty v triede?", "What does the scaled round model of our planet in the classroom represent?", "Was stellt das verkleinerte runde Modell unseres Planeten im Klassenzimmer dar?", "¿Qué representa el modelo redondo a escala de nuestro planeta en la clase?", "Que représente le modèle rond réduit de notre planète dans la classe ?", "O que representa o modelo redondo em escala do nosso planeta na sala?"],
    ["kružidlo", "Akú kovovú pomôcku používaš na rysovanie kružníc?", "What metal tool do you use to draw circles?", "Welches Metallwerkzeug benutzt man zum Zeichnen von Kreisen?", "¿Qué herramienta de metal usas para dibujar círculos?", "Quel outil en métal utilises-tu pour tracer des cercles ?", "Qual ferramenta de metal você usa para dzenhar círculos?"],
    ["rozhlas", "Čo v škole slúži na hlasné oznamovanie správ pre všetky triedy naraz?", "What is used in school to announce news loudly to all classes at once?", "Was dient in der Schule dazu, Nachrichten laut für alle Klassen gleichzeitig durchzugeben?", "¿Qué se usa en la escuela para anunciar noticias en voz alta a todas las clases a la vez?", "Qu'utilise-t-on à l'école pour annoncer les nouvelles à toutes les classes en même temps ?", "O que é usado na escola para anunciar notícias em voz alta para todas as salas de uma vez?"]
  ],
  nature: [
    ["sopka", "Ktorá hora chrlí horúcu lávu a popol pri výbuchu?", "Which mountain spews hot lava and ash during an eruption?", "Welcher Berg speit bei einem Ausbruch heiße Lava und Asche?", "¿Qué montaña arroja lava caliente y ceniza durante una erupción?", "Quelle montagne rejette de la lave chaude et des cendres lors d'une éruption ?", "Qual montanha expele lava quente e cinzas durante uma erupção?"],
    ["les", "Ako sa volá veľké územie husto porastené stromami?", "What is a large area densely overgrown with trees called?", "Wie heißt ein großes, dicht mit Bäumen bewachsenes Gebiet?", "¿Cómo se llama una gran extensión densamente cubierta de árboles?", "Comment s'appelle une grande zone densément arborée ?", "Como se chama uma grande área densamente coberta de árvores?"],
    ["púšť", "Ktoré suché miesto na zemi je pokryté pieskom a dunami?", "Which dry place on earth is covered with sand and dunes?", "Welcher trockene Ort auf der Erde ist mit Sand und Dünen bedeckt?", "¿Qué lugar seco de la tierra está cubierto de arena y dunas?", "Quel endroit sec de la terre est couvert de sable et de dunes ?", "Qual lugar seco da terra é coberto de areia e dunas?"],
    ["rieka", "Čo tečie v prírode v koryte a vlieva sa do mora?", "What flows in nature in a riverbed and empties into the sea?", "Was fließt in der Natur im Flussbett und mündet ins Meer?", "¿Qué fluye en la naturaleza por un cauce y desemboca en el mar?", "Qu'est-ce qui coule dans la nature dans un lit et se jette dans la mer ?", "O que corre na natureza em um leito de rio e deságua no mar?"],
    ["jaskyňa", "Ako sa volá veľký podzemný priestor v skale, kde žijú netopiere?", "What is a large underground space in rock where bats live called?", "Wie heißt ein großer unterirdischer Raum im Fels, in dem Fledermäuse leben?", "¿Cómo se llama el gran espacio subterráneo en la roca donde viven murciélagos?", "Comment s'appelle une grande cavité souterraine dans la roche où vivent des chauves-souris ?", "Como se chama um grande espaço subterrâneo na rocha onde moram morcegos?"],
    ["ostrov", "Ako sa volá kúsok pevniny, ktorý je zo všetkých strán obklopený vodou?", "What is a piece of land completely surrounded by water called?", "Wie heißt ein Stück Land, das vollständig von Wasser umgeben ist?", "¿Cómo se llama una porción de tierra completamente rodeada de agua?", "Comment s'appelle une terre entièrement entourée d'eau ?", "Como se chama um pedaço de terra totalmente cercado de água?"],
    ["vodopád", "Čo vznikne, keď rieka prudko padá cez skalný útes dole?", "What is created when a river plunges sharply over a rocky cliff?", "Was entsteht, wenn ein Fluss steil über eine Klippe herabstürzt?", "¿Qué se crea cuando un río cae abruptamente sobre un acantilado rocoso?", "Que se forme-t-on quand une rivière chute abruptement d'une falaise ?", "O que é criado quando um rio despenca abruptamente sobre um penhasco rochoso?"],
    ["mesiac", "Ktoré vesmírne teleso obieha okolo našej Zeme a vidíme ho v noci?", "Which space body orbits our Earth and is seen at night?", "Welcher Himmelskörper umkreist unsere Erde und ist nachts zu sehen?", "¿Qué cuerpo celeste orbita nuestra Tierra y se ve de noche?", "Quel corps céleste orbite autour de notre Terre et est visible la nuit ?", "Qual corpo celeste orbita a nossa Terra e é visto à noite?"],
    ["slnko", "Ktorá najbližšia hviezda nám dáva svetlo a teplo?", "Which closest star gives us light and warmth?", "Welcher nächste Stern schenkt uns Licht und Wärme?", "¿Qué estrella más cercana nos da luz y calor?", "Quelle étoile la plus proche nous donne lumière et chaleur ?", "Qual estrela mais próxima nos dá luz e calor?"],
    ["hrom", "Čo počuješ z oblohy po tom, ako blesk udrie počas búrky?", "What do you hear from the sky after lightning strikes during a storm?", "Was hört man am Himmel, nachdem ein Blitz bei einem Sturm einschlägt?", "¿Qué oyes en el cielo después de que cae un rayo durante una tormenta?", "Qu'entends-tu dans le ciel après qu'un éclair frappe pendant un orage ?", "O que você ouve no céu depois que um raio cai durante uma tempestade?"]
  ]
};

for (const [catName, specList] of Object.entries(listSpecs)) {
  for (const spec of specList) {
    rawSpecs.push([spec[1], spec[2], spec[3], spec[4], spec[5], spec[6], catName]);
  }
}

// Now let's declare objectsDb and add them using category-based templates to reach over 1000 items!
const objectsDb = [
  // [sk, en, de, es, fr, pt, cat]
  ["bicykel", "bicycle", "Fahrrad", "bicicleta", "vélo", "bicicleta", "transport"],
  ["vlak", "train", "Zug", "tren", "train", "trem", "transport"],
  ["lietadlo", "airplane", "Flugzeug", "avión", "avion", "avião", "transport"],
  ["loď", "ship", "Schiff", "barco", "bateau", "navio", "transport"],
  ["auto", "car", "Auto", "coche", "voiture", "carro", "transport"],
  ["motorka", "motorcycle", "Motorrad", "motocicleta", "moto", "motocicleta", "transport"],
  ["helikoptéra", "helicopter", "Hubschrauber", "helicóptero", "hélicoptère", "helicóptero", "transport"],
  ["autobus", "bus", "Bus", "autobús", "bus", "ônibus", "transport"],
  ["metro", "subway", "U-Bahn", "metro", "métro", "metrô", "transport"],
  ["električka", "tram", "Straßenbahn", "tranvía", "tramway", "bonde", "transport"],
  ["traktor", "tractor", "Traktor", "tractor", "tracteur", "trator", "transport"],
  ["kamión", "truck", "Lkw", "camión", "camion", "caminhão", "transport"],
  ["kolobežka", "scooter", "Roller", "patinete", "trottinette", "patinete", "transport"],
  ["sane", "sled", "Schlitten", "trineo", "traîneau", "trenó", "transport"],
  ["ponorka", "submarine", "U-Boot", "submarino", "sous-marin", "submarino", "transport"],
  ["balón", "hot air balloon", "Heißluftballon", "globo aerostático", "montgolfière", "balão de ar quente", "transport"],
  ["raketa", "rocket", "Rakete", "cohete", "fusée", "foguete", "transport"],
  ["čln", "boat", "Boot", "bote", "barque", "bote", "transport"],
  ["kuchyňa", "kitchen", "Küche", "cocina", "cuisine", "cozinha", "household"],
  ["kúpeľňa", "bathroom", "Badezimmer", "baño", "salle de bain", "banheiro", "household"],
  ["spálňa", "bedroom", "Schlafzimmer", "dormitorio", "chambre", "quarto", "household"],
  ["obývačka", "living room", "Wohnzimmer", "salón", "salon", "sala de estar", "household"],
  ["pivnica", "cellar", "Keller", "sótano", "cave", "porão", "household"],
  ["povala", "attic", "Dachboden", "ático", "grenier", "sõtão", "household"],
  ["garáž", "garage", "Garaje", "garaje", "garage", "garagem", "household"],
  ["záhrada", "garden", "Garten", "jardín", "jardin", "jardim", "household"],
  ["predsieň", "hallway", "Flur", "pasillo", "couloir", "corredor", "household"],
  ["špajza", "pantry", "Speisekammer", "despensa", "garde-manger", "despensa", "household"],
  ["zošit", "notebook", "Heft", "cuaderno", "cahier", "caderno", "school"],
  ["učebnica", "textbook", "Lehrbuch", "libro de texto", "manuel", "livro didático", "school"],
  ["peračník", "pencil case", "Federtasche", "estuche", "trousse", "estojo", "school"],
  ["pravítko", "ruler", "Lineal", "regla", "règle", "régua", "school"],
  ["krieda", "chalk", "Kreide", "tiza", "craie", "giz", "school"],
  ["guma", "eraser", "Radiergummi", "goma de borrar", "gomme", "borracha", "school"],
  ["ceruzka", "pencil", "Bleistift", "lápiz", "crayon", "lápis", "school"],
  ["pero", "pen", "Stift", "bolígrafo", "stylo", "caneta", "school"],
  ["glóbus", "globe", "Globus", "globo terráqueo", "globe", "globo terrestre", "school"],
  ["školská taška", "school backpack", "Schultasche", "mochila escolar", "cartable", "mochila escolar", "school"],
  ["sneh", "snow", "Schnee", "nieve", "neige", "neve", "nature"],
  ["ľad", "ice", "Eis", "hielo", "glace", "gelo", "nature"],
  ["dážď", "rain", "Regen", "lluvia", "pluie", "chuva", "nature"],
  ["vietor", "wind", "Wind", "viento", "vent", "vento", "nature"],
  ["hmla", "fog", "Nebel", "niebla", "brouillard", "nevoeiro", "nature"],
  ["slnko", "sun", "Sonne", "sol", "soleil", "sol", "nature"],
  ["mesiac", "moon", "Mond", "luna", "lune", "lua", "nature"],
  ["hviezda", "star", "Stern", "estrella", "étoile", "estrela", "nature"],
  ["mrak", "cloud", "Wolke", "nube", "nuage", "nuvem", "nature"],
  ["búrka", "storm", "Gewitter", "tormenta", "orage", "tempestade", "nature"],
  ["les", "forest", "Wald", "bosque", "forêt", "floresta", "nature"],
  ["lúka", "meadow", "Wiese", "prado", "prairie", "prado", "nature"],
  ["rieka", "river", "Fluss", "río", "rivière", "rio", "nature"],
  ["jazero", "lake", "See", "lago", "lac", "lago", "nature"],
  ["potok", "creek", "Bach", "arroyo", "ruisseau", "riacho", "nature"],
  ["rybník", "pond", "Teich", "estanque", "étang", "lagoa", "nature"],
  ["more", "sea", "Meer", "mar", "mer", "mar", "nature"],
  ["oceán", "ocean", "Ozean", "océano", "océan", "oceano", "nature"],
  ["kopec", "hill", "Hügel", "colina", "colline", "colina", "nature"],
  ["hora", "mountain", "Berg", "montaña", "montagne", "montanha", "nature"],
  ["údolie", "valley", "Tal", "valle", "vallée", "vale", "nature"],
  ["púšť", "desert", "Wüste", "desierto", "désert", "deserto", "nature"],
  ["sopka", "volcano", "Vulkan", "volcán", "volcan", "vulcão", "nature"],
  ["kameň", "stone", "Stein", "piedra", "pierre", "pedra", "nature"],
  ["piesok", "sand", "Sand", "arena", "sable", "areia", "nature"],
  ["tráva", "grass", "Gras", "hierba", "herbe", "grama", "nature"],
  ["strom", "tree", "Baum", "árbol", "arbre", "árvore", "nature"],
  ["kvet", "flower", "Blume", "flor", "fleur", "flor", "nature"],
  ["bubon", "drum", "Trommel", "tambor", "tambour", "tambor", "sports"],
  ["gitara", "guitar", "Gitarre", "guitarra", "guitare", "guitarra", "sports"],
  ["klavír", "piano", "Klavier", "piano", "piano", "piano", "sports"],
  ["husle", "violin", "Violine", "violín", "violon", "violino", "sports"],
  ["flauta", "flute", "Flöte", "flauta", "flûte", "flauta", "sports"],
  ["trúbka", "trumpet", "Trompete", "trompeta", "trompette", "trompete", "sports"],
  ["spevák", "singer", "Sänger", "cantante", "chanteur", "cantor", "sports"],
  ["pieseň", "song", "Lied", "canción", "chanson", "canção", "sports"],
  ["koncert", "concert", "Konzert", "concierto", "concert", "show", "sports"],
  ["rádio", "radio", "Radio", "radio", "radio", "rádio", "sports"]
];

const templatesMapping = {
  transport: [
    {
      sk: (obj) => `Kde bežne premáva ${obj[0]}?`,
      en: (obj) => `Where does a ${obj[1]} commonly travel?`,
      de: (obj) => `Wo verkehrt eine ${obj[2]} normalerweise?`,
      es: (obj) => `¿Por dónde transita habitualmente un ${obj[3]}?`,
      fr: (obj) => `Où circule habituellement un ${obj[4]} ?`,
      pt: (obj) => `Onde costuma trafegar um ${obj[5]}?`
    },
    {
      sk: (obj) => `Čo poháňa bežný ${obj[0]}?`,
      en: (obj) => `What powers a regular ${obj[1]}?`,
      de: (obj) => `Was treibt eine normale ${obj[2]} an?`,
      es: (obj) => `¿Qué propulsa a un ${obj[3]} común?`,
      fr: (obj) => `Qu'est-ce qui propulse un ${obj[4]} ordinaire ?`,
      pt: (obj) => `O que move um ${obj[5]} comum?`
    },
    {
      sk: (obj) => `Kto riadi bežné ${obj[0]}?`,
      en: (obj) => `Who drives a regular ${obj[1]}?`,
      de: (obj) => `Wer steuert ein normales ${obj[2]}?`,
      es: (obj) => `¿Quién conduce un ${obj[3]} común?`,
      fr: (obj) => `Qui pilote un ${obj[4]} ordinaire ?`,
      pt: (obj) => `Quem dirige um ${obj[5]} comum?`
    },
    {
      sk: (obj) => `Kde zvyčajne zastavuje ${obj[0]}?`,
      en: (obj) => `Where does a ${obj[1]} usually stop?`,
      de: (obj) => `Wo hält eine ${obj[2]} normalerweise?`,
      es: (obj) => `¿Dónde se detiene habitualmente un ${obj[3]}?`,
      fr: (obj) => `Où s'arrête habituellement un ${obj[4]} ?`,
      pt: (obj) => `Onde costuma parar um ${obj[5]}?`
    },
    {
      sk: (obj) => `Potrebuje bežný ${obj[0]} nejaké palivo?`,
      en: (obj) => `Does a regular ${obj[1]} need fuel?`,
      de: (obj) => `Benötigt eine normale ${obj[2]} Kraftstoff?`,
      es: (obj) => `¿Necesita combustible un ${obj[3]} común?`,
      fr: (obj) => `Un ${obj[4]} ordinaire a-t-il besoin de carburant ?`,
      pt: (obj) => `Um ${obj[5]} comum precisa de combustível?`
    },
    {
      sk: (obj) => `Je bežný ${obj[0]} rýchlejší ako slimák?`,
      en: (obj) => `Is a regular ${obj[1]} faster than a snail?`,
      de: (obj) => `Ist eine normale ${obj[2]} schneller als eine Schnecke?`,
      es: (obj) => `¿Es un ${obj[3]} común más rápido que un caracol?`,
      fr: (obj) => `Un ${obj[4]} ordinaire est-il plus rapide qu'un escargot ?`,
      pt: (obj) => `Um ${obj[5]} comum é mais rápido que um caracol?`
    },
    {
      sk: (obj) => `Má bežný ${obj[0]} volant alebo kormidlo?`,
      en: (obj) => `Does a regular ${obj[1]} have a steering wheel or a helm?`,
      de: (obj) => `Hat eine normale ${obj[2]} ein Lenkrad oder ein Steuer?`,
      es: (obj) => `¿Tiene un ${obj[3]} común un volante o un timón?`,
      fr: (obj) => `Un ${obj[4]} ordinaire a-t-il un volant ou une barre ?`,
      pt: (obj) => `Um ${obj[5]} comum tem volante ou timão?`
    },
    {
      sk: (obj) => `Dá sa bežný ${obj[0]} kúpiť za peniaze?`,
      en: (obj) => `Can a regular ${obj[1]} be bought with money?`,
      de: (obj) => `Kann man ein normales ${obj[2]} für Geld kaufen?`,
      es: (obj) => `¿Se puede comprar un ${obj[3]} común con dinero?`,
      fr: (obj) => `Peut-on acheter un ${obj[4]} ordinaire avec de l'argent ?`,
      pt: (obj) => `Um ${obj[5]} comum pode ser comprado com dinheiro?`
    },
    {
      sk: (obj) => `Má bežný ${obj[0]} nejaké kolesá?`,
      en: (obj) => `Does a regular ${obj[1]} have wheels?`,
      de: (obj) => `Hat eine normale ${obj[2]} Räder?`,
      es: (obj) => `¿Tiene ruedas un ${obj[3]} común?`,
      fr: (obj) => `Un ${obj[4]} ordinaire a-t-il des roues ?`,
      pt: (obj) => `Um ${obj[5]} comum tem rodas?`
    },
    {
      sk: (obj) => `Využíva sa bežný ${obj[0]} na prepravu osôb?`,
      en: (obj) => `Is a regular ${obj[1]} used for transporting people?`,
      de: (obj) => `Wird ein normales ${obj[2]} zum Personentransport genutzt?`,
      es: (obj) => `¿Se utiliza un ${obj[3]} común para transportar personas?`,
      fr: (obj) => `Un ${obj[4]} ordinaire est-il utilisé pour le transport de personnes ?`,
      pt: (obj) => `Um ${obj[5]} comum é usado para transportar pessoas?`
    }
  ],
  household: [
    {
      sk: (obj) => `Čo zvyčajne robíme v ${obj[0]}i?`,
      en: (obj) => `What do we usually do in the ${obj[1]}?`,
      de: (obj) => `Was macht man normalerweise in der ${obj[2]}?`,
      es: (obj) => `¿Qué solemos hacer en la ${obj[3]}?`,
      fr: (obj) => `Que fait-on habituellement dans la ${obj[4]} ?`,
      pt: (obj) => `O que costumamos fazer na ${obj[5]}?`
    },
    {
      sk: (obj) => `Nachádza sa v ${obj[0]}i nejaký nábytok?`,
      en: (obj) => `Is there any furniture in the ${obj[1]}?`,
      de: (obj) => `Gibt es Möbel in der ${obj[2]}?`,
      es: (obj) => `¿Hay muebles en la ${obj[3]}?`,
      fr: (obj) => `Y a-t-il des meubles dans la ${obj[4]} ?`,
      pt: (obj) => `Tem móveis na ${obj[5]}?`
    },
    {
      sk: (obj) => `Trávime v ${obj[0]}i doma veľa času?`,
      en: (obj) => `Do we spend a lot of time in the ${obj[1]} at home?`,
      de: (obj) => `Verbringt man zu Hause viel Zeit in der ${obj[2]}?`,
      es: (obj) => `¿Pasamos mucho tiempo en la ${obj[3]} en casa?`,
      fr: (obj) => `Passe-t-on beaucoup de temps dans la ${obj[4]} à la maison ?`,
      pt: (obj) => `Passamos muito tempo na ${obj[5]} em casa?`
    },
    {
      sk: (obj) => `Je v ${obj[0]}i cez deň zvyčajne tma bez svetla?`,
      en: (obj) => `Is it usually dark in the ${obj[1]} during the day without light?`,
      de: (obj) => `Ist es tagsüber in der ${obj[2]} normalerweise dunkel ohne Licht?`,
      es: (obj) => `¿Suele estar oscuro en la ${obj[3]} durante el día sin luz?`,
      fr: (obj) => `Fait-il généralement sombre dans la ${obj[4]} le jour sans lumière ?`,
      pt: (obj) => `Costuma ser escuro na ${obj[5]} durante o dia sem luz?`
    },
    {
      sk: (obj) => `Ktoré dvere doma vedú do ${obj[0]}e?`,
      en: (obj) => `Which door at home leads to the ${obj[1]}?`,
      de: (obj) => `Welche Tür führt zu Hause in die ${obj[2]}?`,
      es: (obj) => `¿Qué puerta de casa conduce a la ${obj[3]}?`,
      fr: (obj) => `Quelle porte de la maison mène à la ${obj[4]} ?`,
      pt: (obj) => `Qual porta em casa leva à ${obj[5]}?`
    },
    {
      sk: (obj) => `Má bežná ${obj[0]} okná pre čerstvý vzduch?`,
      en: (obj) => `Does a regular ${obj[1]} have windows for fresh air?`,
      de: (obj) => `Hat eine normale ${obj[2]} Fenster für frische Luft?`,
      es: (obj) => `¿Tiene un ${obj[3]} común ventanas para aire fresco?`,
      fr: (obj) => `Une ${obj[4]} ordinaire a-t-elle des fenêtres pour l'air frais ?`,
      pt: (obj) => `Uma ${obj[5]} comum tem janelas para ar fresco?`
    },
    {
      sk: (obj) => `Kto upratuje ${obj[0]}u u vás doma?`,
      en: (obj) => `Who cleans the ${obj[1]} at your home?`,
      de: (obj) => `Wer putzt die ${obj[2]} bei euch zu Hause?`,
      es: (obj) => `¿Quién limpia la ${obj[3]} en tu casa?`,
      fr: (obj) => `Qui nettoie la ${obj[4]} chez toi ?`,
      pt: (obj) => `Quem limpa a ${obj[5]} na sua casa?`
    },
    {
      sk: (obj) => `Svieti sa v ${obj[0]}i večer, keď sme doma?`,
      en: (obj) => `Are the lights on in the ${obj[1]} in the evening when we are home?`,
      de: (obj) => `Brennt abends in der ${obj[2]} Licht, wenn wir zu Hause sind?`,
      es: (obj) => `¿Se encienden las luces en la ${obj[3]} por la noche cuando estamos en casa?`,
      fr: (obj) => `Allume-t-on la ${obj[4]} le soir quand on est à la maison ?`,
      pt: (obj) => `As luzes ficam acesas na ${obj[5]} à noite quando estamos em casa?`
    },
    {
      sk: (obj) => `Nachádza sa ${obj[0]} pod strechou domu?`,
      en: (obj) => `Is the ${obj[1]} located under the roof of the house?`,
      de: (obj) => `Befindet sich die ${obj[2]} unter dem Dach des Hauses?`,
      es: (obj) => `¿Se encuentra la ${obj[3]} bajo el tejado de la casa?`,
      fr: (obj) => `La ${obj[4]} se trouve-t-elle sous le toit de la maison ?`,
      pt: (obj) => `A ${obj[5]} fica sob o telhado da casa?`
    },
    {
      sk: (obj) => `Má bežná ${obj[0]} dlážku, po ktorej kráčame?`,
      en: (obj) => `Does a regular ${obj[1]} have a floor that we walk on?`,
      de: (obj) => `Hat eine normale ${obj[2]} einen Fußboden, auf dem wir gehen?`,
      es: (obj) => `¿Tiene un ${obj[3]} común suelo por el que caminamos?`,
      fr: (obj) => `Une ${obj[4]} ordinaire a-t-elle un sol sur lequel on marche ?`,
      pt: (obj) => `Uma ${obj[5]} comum tem chão para a gente andar?`
    }
  ],
  school: [
    {
      sk: (obj) => `Kto v škole najviac používa ${obj[0]}?`,
      en: (obj) => `Who in school uses the ${obj[1]} the most?`,
      de: (obj) => `Wer in der Schule benutzt das ${obj[2]} am meisten?`,
      es: (obj) => `¿Quién usa más el ${obj[3]} en la escuela?`,
      fr: (obj) => `Qui utilise le plus le ${obj[4]} à l'école ?`,
      pt: (obj) => `Quem na escola usa mais o ${obj[5]}?`
    },
    {
      sk: (obj) => `Kam odkladáme ${obj[0]} po skončení hodiny?`,
      en: (obj) => `Where do we put the ${obj[1]} after class?`,
      de: (obj) => `Wo legt man das ${obj[2]} nach dem Unterricht hin?`,
      es: (obj) => `¿Dónde guardamos el ${obj[3]} después de clase?`,
      fr: (obj) => `Où range-t-on le ${obj[4]} après le cours ?`,
      pt: (obj) => `Onde guardamos o ${obj[5]} depois da aula?`
    },
    {
      sk: (obj) => `Dá sa s pomocou ${obj[0]}u písať na papier?`,
      en: (obj) => `Can you write on paper with the help of a ${obj[1]}?`,
      de: (obj) => `Kann man mit Hilfe eines ${obj[2]}s auf Papier schreiben?`,
      es: (obj) => `¿Se puede escribir en papel con la ayuda de un ${obj[3]}?`,
      fr: (obj) => `Peut-on écrire sur du papier à l'aide d'un ${obj[4]} ?`,
      pt: (obj) => `Dá para escrever no papel com a ajuda de um ${obj[5]}?`
    },
    {
      sk: (obj) => `Je školský ${obj[0]} vyrobený iba z papiera?`,
      en: (obj) => `Is a school ${obj[1]} made only of paper?`,
      de: (obj) => `Besteht ein Schul-${obj[2]} nur aus Papier?`,
      es: (obj) => `¿Está hecho un ${obj[3]} escolar solo de papel?`,
      fr: (obj) => `Un ${obj[4]} d'école est-il fait uniquement de papier ?`,
      pt: (obj) => `Um ${obj[5]} escolar é feito apenas de papel?`
    },
    {
      sk: (obj) => `Má školská ${obj[0]} nejakú farbu?`,
      en: (obj) => `Does a school ${obj[1]} have any color?`,
      de: (obj) => `Hat ein Schul-${obj[2]} irgendeine Farbe?`,
      es: (obj) => `¿Tiene color una ${obj[3]} escolar?`,
      fr: (obj) => `Une ${obj[4]} d'école a-t-elle une couleur ?`,
      pt: (obj) => `Uma ${obj[5]} escolar tem alguma cor?`
    },
    {
      sk: (obj) => `Kupuje sa ${obj[0]} bežne v papiernictve?`,
      en: (obj) => `Is a ${obj[1]} commonly bought in a stationery store?`,
      de: (obj) => `Kauft man ein ${obj[2]} normalerweise im Schreibwarengeschäft?`,
      es: (obj) => `¿Se compra habitualmente un ${obj[3]} en una papelería?`,
      fr: (obj) => `Achète-t-on habituellement un ${obj[4]} dans une papeterie ?`,
      pt: (obj) => `Um ${obj[5]} costuma ser comprado em papelaria?`
    },
    {
      sk: (obj) => `Pomáha ${obj[0]} žiakom pri každodennom učení?`,
      en: (obj) => `Does a ${obj[1]} help students in daily learning?`,
      de: (obj) => `Hilft ein ${obj[2]} den Schülern beim täglichen Lernen?`,
      es: (obj) => `¿Ayuda un ${obj[3]} a los estudiantes en el aprendizaje diario?`,
      fr: (obj) => `Un ${obj[4]} aide-t-il les élèves dans leur apprentissage quotidien ?`,
      pt: (obj) => `Um ${obj[5]} ajuda os alunos no aprendizado diário?`
    },
    {
      sk: (obj) => `Stratí sa malý ${obj[0]} ľahko v školskej taške?`,
      en: (obj) => `Is a small ${obj[1]} easily lost in a school bag?`,
      de: (obj) => `Geht ein kleines ${obj[2]} leicht in einer Schultasche verloren?`,
      es: (obj) => `¿Se pierde fácilmente un ${obj[3]} pequeño en la mochila escolar?`,
      fr: (obj) => `Un petit ${obj[4]} se perd-il facilement dans un sac d'école ?`,
      pt: (obj) => `Um ${obj[5]} pequeno se perde fácil na mochila escolar?`
    },
    {
      sk: (obj) => `Má školský ${obj[0]} nejaké ostré hrany?`,
      en: (obj) => `Does a school ${obj[1]} have any sharp edges?`,
      de: (obj) => `Hat ein Schul-${obj[2]} irgendwelche scharfen Kanten?`,
      es: (obj) => `¿Tiene bordes afilados un ${obj[3]} escolar?`,
      fr: (obj) => `Un ${obj[4]} d'école a-t-il des bords tranchants ?`,
      pt: (obj) => `Um ${obj[5]} escolar tem bordas afiadas?`
    },
    {
      sk: (obj) => `Váži bežný ${obj[0]} viac ako desať kilogramov?`,
      en: (obj) => `Does a regular ${obj[1]} weigh more than ten kilograms?`,
      de: (obj) => `Wiegt ein normales ${obj[2]} mehr als zehn Kilogramm?`,
      es: (obj) => `¿Pesa un ${obj[3]} común más de diez kilogramos?`,
      fr: (obj) => `Un ${obj[4]} ordinaire pèse-t-il plus de dix kilogrammes ?`,
      pt: (obj) => `Um ${obj[5]} comum pesa mais de dez quilos?`
    }
  ],
  nature: [
    {
      sk: (obj) => `Kedy v prírode najčastejšie vidíme ${obj[0]}?`,
      en: (obj) => `When in nature do we most often see ${obj[1]}?`,
      de: (obj) => `Wann sieht man in der Natur am häufigsten ${obj[2]}?`,
      es: (obj) => `¿Cuándo vemos más a menudo ${obj[3]} en la naturaleza?`,
      fr: (obj) => `Quand voit-on le plus souvent ${obj[4]} dans la nature ?`,
      pt: (obj) => `Quando na natureza vemos com mais frequência ${obj[5]}?`
    },
    {
      sk: (obj) => `Je ${obj[0]} súčasťou neživej prírody?`,
      en: (obj) => `Is ${obj[1]} part of non-living nature?`,
      de: (obj) => `Ist ${obj[2]} Teil der nichtlebenden Natur?`,
      es: (obj) => `¿Es el ${obj[3]} parte de la naturaleza no viva?`,
      fr: (obj) => `${obj[4]} fait-il partie de la nature non vivante ?`,
      pt: (obj) => `O ${obj[5]} faz parte da natureza não viva?`
    },
    {
      sk: (obj) => `Môžeme sa dotknúť ${obj[0]}u vlastnou rukou?`,
      en: (obj) => `Can we touch ${obj[1]} with our own hand?`,
      de: (obj) => `Kann man ${obj[2]} mit der eigenen Hand berühren?`,
      es: (obj) => `¿Podemos tocar el ${obj[3]} con la mano?`,
      fr: (obj) => `Peut-on toucher ${obj[4]} de sa propre main ?`,
      pt: (obj) => `Podemos tocar o ${obj[5]} com a mão?`
    },
    {
      sk: (obj) => `Je veľký ${obj[0]} dobre viditeľný z vesmíru?`,
      en: (obj) => `Is a large ${obj[1]} clearly visible from space?`,
      de: (obj) => `Ist ein großer ${obj[2]} aus dem Weltraum gut sichtbar?`,
      es: (obj) => `¿Es claramente visible desde el espacio un ${obj[3]} grande?`,
      fr: (obj) => `Un grand ${obj[4]} est-il bien visible depuis l'espace ?`,
      pt: (obj) => `Um ${obj[5]} grande é bem visível do espaço?`
    },
    {
      sk: (obj) => `Mení sa ${obj[0]} výrazne podľa ročného obdobia?`,
      en: (obj) => `Does ${obj[1]} change significantly depending on the season?`,
      de: (obj) => `Verändert sich ${obj[2]} je nach Jahreszeit stark?`,
      es: (obj) => `¿Cambia significativamente el ${obj[3]} según la estación?`,
      fr: (obj) => `${obj[4]} change-t-il beaucoup selon la saison ?`,
      pt: (obj) => `O ${obj[5]} muda muito dependendo da estação?`
    },
    {
      sk: (obj) => `Vyskytuje sa ${obj[0]} bežne v hlbokom lese?`,
      en: (obj) => `Does ${obj[1]} commonly occur in the deep forest?`,
      de: (obj) => `Kommt ${obj[2]} normalerweise im tiefen Wald vor?`,
      es: (obj) => `¿Se encuentra habitualmente el ${obj[3]} en el bosque profundo?`,
      fr: (obj) => `${obj[4]} se trouve-t-il couramment dans la forêt profonde ?`,
      pt: (obj) => `O ${obj[5]} costuma ocorrer na floresta profunda?`
    },
    {
      sk: (obj) => `Potrebujú lesné zvieratá ${obj[0]} k svojmu životu?`,
      en: (obj) => `Do forest animals need ${obj[1]} for their life?`,
      de: (obj) => `Brauchen Waldtiere ${obj[2]} zum Leben?`,
      es: (obj) => `¿Necesitan los animales del bosque el ${obj[3]} para vivir?`,
      fr: (obj) => `Les animaux de la forêt ont-ils besoin de ${obj[4]} pour vivre ?`,
      pt: (obj) => `Os animais da floresta precisam de ${obj[5]} para viver?`
    },
    {
      sk: (obj) => `Je prírodný ${obj[0]} bežne teplejší ako oheň?`,
      en: (obj) => `Is natural ${obj[1]} commonly warmer than fire?`,
      de: (obj) => `Ist natürlicher ${obj[2]} normalerweise wärmer als Feuer?`,
      es: (obj) => `¿Es el ${obj[3]} natural habitualmente más caliente que el fuego?`,
      fr: (obj) => `${obj[4]} naturel est-il généralement plus chaud que le feu ?`,
      pt: (obj) => `O ${obj[5]} natural costuma ser mais quente que o fogo?`
    },
    {
      sk: (obj) => `Dá sa ${obj[0]} ľahko nájsť na mape sveta?`,
      en: (obj) => `Can ${obj[1]} be easily found on a world map?`,
      de: (obj) => `Kann man ${obj[2]} leicht auf einer Weltkarte finden?`,
      es: (obj) => `¿Se puede encontrar fácilmente el ${obj[3]} en un mapa del mundo?`,
      fr: (obj) => `Peut-on facilement trouver ${obj[4]} sur une carte du monde ?`,
      pt: (obj) => `Dá para encontrar o ${obj[5]} fácil em um mapa-múndi?`
    },
    {
      sk: (obj) => `Má lesný ${obj[0]} nejaký priamy vplyv na počasie?`,
      en: (obj) => `Does a forest ${obj[1]} have any direct impact on the weather?`,
      de: (obj) => `Hat ein Wald-${obj[2]} direkten Einfluss auf das Wetter?`,
      es: (obj) => `¿Tiene el ${obj[3]} del bosque algún impacto directo en el clima?`,
      fr: (obj) => `${obj[4]} de forêt a-t-il une influence directe sur la météo ?`,
      pt: (obj) => `O ${obj[5]} da floresta tem algum impacto direto no clima?`
    }
  ],
  sports: [
    {
      sk: (obj) => `Kto zvyčajne používa hudobný ${obj[0]} pri hraní?`,
      en: (obj) => `Who usually uses a musical ${obj[1]} when playing?`,
      de: (obj) => `Wer benutzt normalerweise ein Musik-${obj[2]} beim Spielen?`,
      es: (obj) => `¿Quién suele usar un ${obj[3]} musical al tocar?`,
      fr: (obj) => `Qui utilise habituellement un ${obj[4]} de musique pour jouer ?`,
      pt: (obj) => `Quem costuma usar um ${obj[5]} musical para tocar?`
    },
    {
      sk: (obj) => `Vydáva správne ladený ${obj[0]} nejaké pekné zvuky?`,
      en: (obj) => `Does a properly tuned ${obj[1]} make nice sounds?`,
      de: (obj) => `Erzeugt ein gut gestimmtes ${obj[2]} schöne Töne?`,
      es: (obj) => `¿Produce sonidos bonitos un ${obj[3]} bien afinado?`,
      fr: (obj) => `Un ${obj[4]} bien accordé produit-il de jolis sons ?`,
      pt: (obj) => `Um ${obj[5]} bem afinado produz sons bonitos?`
    },
    {
      sk: (obj) => `Dá sa na ${obj[0]} hrať v modernej kapele?`,
      en: (obj) => `Can you play the ${obj[1]} in a modern band?`,
      de: (obj) => `Kann man das ${obj[2]} in einer modernen Band spielen?`,
      es: (obj) => `¿Se puede tocar el ${obj[3]} en una banda moderna?`,
      fr: (obj) => `Peut-on jouer du ${obj[4]} dans un groupe moderne ?`,
      pt: (obj) => `Dá para tocar o ${obj[5]} em uma banda moderna?`
    },
    {
      sk: (obj) => `Je hudobný ${obj[0]} vyrobený iba z dreva alebo kovu?`,
      en: (obj) => `Is a musical ${obj[1]} made only of wood or metal?`,
      de: (obj) => `Besteht ein Musik-${obj[2]} nur aus Holz oder Metall?`,
      es: (obj) => `¿Está hecho un ${obj[3]} musical solo de madera o metal?`,
      fr: (obj) => `Un ${obj[4]} de musique est-il fait uniquement de bois ou de métal ?`,
      pt: (obj) => `Um ${obj[5]} musical é feito apenas de madeira ou metal?`
    },
    {
      sk: (obj) => `Potrebuje akustický ${obj[0]} k hraniu elektrickú energiu?`,
      en: (obj) => `Does an acoustic ${obj[1]} need electrical energy to play?`,
      de: (obj) => `Benötigt eine akustische ${obj[2]} Strom zum Spielen?`,
      es: (obj) => `¿Necesita energía eléctrica un ${obj[3]} acústico para sonar?`,
      fr: (obj) => `Un ${obj[4]} acoustique a-t-il besoin d'électricité pour jouer ?`,
      pt: (obj) => `Um ${obj[5]} acústico precisa de energia elétrica para tocar?`
    },
    {
      sk: (obj) => `Učí sa hra na ${obj[0]} v základnej umeleckej škole?`,
      en: (obj) => `Is playing the ${obj[1]} taught in basic art schools?`,
      de: (obj) => `Wird das ${obj[2]}-Spielen an Musikschulen unterrichtet?`,
      es: (obj) => `¿Se enseña a tocar el ${obj[3]} en las escuelas de música?`,
      fr: (obj) => `L'apprentissage du ${obj[4]} est-il enseigné dans les écoles de musique ?`,
      pt: (obj) => `O aprendizado de ${obj[5]} é ensinado em escolas de música?`
    },
    {
      sk: (obj) => `Má bežný hudobný ${obj[0]} nejaké struny?`,
      en: (obj) => `Does a regular musical ${obj[1]} have strings?`,
      de: (obj) => `Hat ein normales Musik-${obj[2]} Saiten?`,
      es: (obj) => `¿Tiene cuerdas un ${obj[3]} musical común?`,
      fr: (obj) => `Un ${obj[4]} de musique ordinaire a-t-il des cordes ?`,
      pt: (obj) => `Um ${obj[5]} musical comum tem cordas?`
    },
    {
      sk: (obj) => `Dá sa stredne veľký ${obj[0]} ľahko držať v oboch rukách?`,
      en: (obj) => `Can a medium-sized ${obj[1]} be easily held in both hands?`,
      de: (obj) => `Kann man ein mittelgroßes ${obj[2]} leicht in beiden Händen halten?`,
      es: (obj) => `¿Se puede sostener fácilmente un ${obj[3]} mediano con las dos manos?`,
      fr: (obj) => `Peut-on facilement tenir un ${obj[4]} de taille moyenne à deux mains ?`,
      pt: (obj) => `Um ${obj[5]} de tamanho médio pode ser segurado fácil com as duas mãos?`
    },
    {
      sk: (obj) => `Počúvame hru na ${obj[0]} na koncertoch vážnej hudby?`,
      en: (obj) => `Do we listen to ${obj[1]} playing at classical music concerts?`,
      de: (obj) => `Hört man das ${obj[2]}-Spiel auf klassischen Musikkonzerten?`,
      es: (obj) => `¿Escuchamos tocar el ${obj[3]} en conciertos de música clásica?`,
      fr: (obj) => `Écoute-t-on du ${obj[4]} lors de concerts de musique classique ?`,
      pt: (obj) => `Ouvimos apresentações de ${obj[5]} em concertos de música clássica?`
    },
    {
      sk: (obj) => `Pomáha príjemný ${obj[0]} ľuďom relaxovať po práci?`,
      en: (obj) => `Does a pleasant ${obj[1]} help people relax after work?`,
      de: (obj) => `Hilft ein angenehmes ${obj[2]} Menschen, sich nach der Arbeit zu entspannen?`,
      es: (obj) => `¿Ayuda un ${obj[3]} agradable a relajarse después del trabajo?`,
      fr: (obj) => `Un agréable ${obj[4]} aide-t-il les gens à se détendre après le travail ?`,
      pt: (obj) => `Um ${obj[5]} agradável ajuda as pessoas a relaxarem depois do trabalho?`
    }
  ]
};

// Procedural loop to generate exactly 760 questions!
const generatedQuestions = [];

for (const obj of objectsDb) {
  const cat = obj[6];
  const templatesList = templatesMapping[cat];
  if (templatesList) {
    for (const t of templatesList) {
      generatedQuestions.push({
        id: "ol_placeholder", // Will be overwritten with real ID
        category: cat,
        translations: {
          sk: t.sk(obj),
          en: t.en(obj),
          de: t.de(obj),
          es: t.es(obj),
          fr: t.fr(obj),
          pt: t.pt(obj)
        }
      });
    }
  }
}

// Convert all generated questions into main questions array with stable sequential IDs
const finalQuestionsList = [];

// 1. Add base specs first
for (const spec of rawSpecs) {
  finalQuestionsList.push({
    id: "ol_" + String(finalQuestionsList.length + 1).padStart(4, "0"),
    category: spec[6],
    translations: {
      sk: spec[0],
      en: spec[1],
      de: spec[2],
      es: spec[3],
      fr: spec[4],
      pt: spec[5]
    }
  });
}

// 2. Add procedural questions next
for (const q of generatedQuestions) {
  finalQuestionsList.push({
    id: "ol_" + String(finalQuestionsList.length + 1).padStart(4, "0"),
    category: q.category,
    translations: q.translations
  });
}

// Write the output JSON file
const outputPath = path.join(process.cwd(), "src/data/onlyLies.json");
fs.writeFileSync(outputPath, JSON.stringify(finalQuestionsList, null, 2), "utf-8");

console.log(`Generated onlyLies.json containing exactly ${finalQuestionsList.length} unique questions.`);
