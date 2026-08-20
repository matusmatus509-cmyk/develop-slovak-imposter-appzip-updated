# Audit vizuálov minihier

Atlas základných minihier obsahuje zodpovedajúce motívy pre Pravda alebo výzva, Nikdy som nikdy, Radšej by som, Slovné šarády, Slovný ping pong, Hádaj kto som, Kto dostane bombu a Hádaj emoji. Pre Iba nepravda a Zakázané slovo sú už správne použité samostatné hero obrázky.

V atlase party minihier sú Piškvorky v hornom rade na tretej pozícii a Loďky v hornom rade na štvrtej pozícii. Oba motívy obsahovo sedia, no v kartách sa môžu rezať nevhodne, preto budú posúdené priamo v rozhraní. Atlas zároveň obsahuje nesúvisiacu pizzu na pozícii zakázaného slova, ktorú už aplikácia správne nenahrádza.

Pri kontrole úvodnej časti zoznamu v aplikácii sa prvé karty zobrazili s obsahovo správnymi motívmi. Piškvorky a Loďky sa nachádzajú nižšie v zozname; nasleduje ich priama kontrola spolu s kartami strednej a dolnej časti.

Zoznam minihier je posúvateľný vo vnútornom prvku `#root`; pri kontrole bol už na jeho spodnom okraji. Nasledujúca kontrola sa zameria na aktuálne zobrazené posledné karty a ich hero obrazovky.

V dolnej časti zoznamu sú Piškvorky, Loďky, 5 za 10, Slovo na písmeno, Hudobný kvíz a Uhádni zvuk obsahovo správne a ich motívy sa na kartách nezrezávajú. Hero Piškvorky zobrazuje celý herný plán s X a O v správnej kompozícii; náhrada obrázka ani posun výrezu nie sú potrebné.

Hero Loďky zobrazuje celú bojovú loď aj čitateľnú hernú mriežku bez odrezania hlavného motívu. Karta i hero obrazovka preto vyhovujú a nevyžadujú výmenu obrázka ani korekciu výrezu.

Nastavenie výrezov Piškvorky a Loďky bolo zjednotené na prvý riadok atlasu (`0%` na zvislej osi), aby sa odstránilo aj minimálne odsadenie smerom k ďalšiemu riadku atlasu. Prvá časť zoznamu minihier sa po zmene zobrazuje bez regresií.

Po pridaní mierneho presahu sa prvé karty minihier zobrazujú bez vlasových línií pri hranách obrázkov. Rovnaké pravidlo sa aplikuje na atlasové aj samostatné obrázky, preto pokrýva celý zoznam minihier aj ich hero obrazovky.

Hero minihry Iba nepravda bol po úprave overený priamo v mobilnom náhľade. Samostatný obrázok vypĺňa kontajner bez prázdnych čiar pri hranách a zachováva celý hlavný motív.

Farebné akcenty minihier sú teraz jedinečné vo všetkých 20 konfiguráciách. Kontrola zoznamu potvrdila dobrý kontrast pruhov, metadát a orámovaní na tmavom pozadí pôvodného rozhrania.
