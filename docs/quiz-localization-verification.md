# Overenie lokalizovaného kvízu

## Priama kontrola v prehliadači

Po prepnutí aplikácie do angličtiny a spustení finálového tímového kvízového kola sa zobrazila lokalizovaná otázka „Which natural moon in the Solar System is largest by diameter?“ s možnosťami Callisto, Titan, Ganymede a Triton. Otázka, kategória aj možnosti sa vykreslili v angličtine a správna odpoveď zostala na pôvodnom indexe C (`Ganymede`).

## Výber bez opakovania

Tímový kvíz teraz používa existujúci `takePersistentItems` deck. Jeho kľúč obsahuje jazyk a obtiažnosť, takže každá jazyková a obtiažnostná zásoba sa mieša samostatne a položky sa nezopakujú až do vyčerpania dostupných otázok.

## Test cyklu bez opakovania

V prehliadači bol na samostatnom testovacom kľúči overený deck s ôsmimi položkami. Prvé vybratie obsahovalo päť jedinečných položiek a druhé tri zostávajúce položky; všetkých osem položiek bolo pred resetom jedinečných. Až ďalšie vybratie začalo nový premiešaný cyklus.
