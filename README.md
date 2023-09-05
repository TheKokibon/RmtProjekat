# RmtProjekat
Rmt projekat - multiplayer igrica papir-kamen-makaze

Projekat je napravljen pomocu 2 framework-a: expressjs, nodejs i biblioteke socket.io

Napisan je u htmlu, css i javascript-u

Pre svega pravimo server koristeci express.js 
i pokrecemo ga pomocu http protokola na portu 3000

Pomocu socket.io mozemo da uspostavimo konekciju izmedju: 
1. Klijenta i servera
2. Izmedju klijenata preko servera

Aplikacija ima tri faze: 
1. initial phase - ovo je u sustini landing page na kom korisnik ima 2 opcije
   prva da kreira sobu i druga da pristupi sobi
2. waiting phase - jedan korisnik je kreirao sobu i sada cega drugog da se pridruzi
3. game phase - korisnici imaju izbor koji ce predmet odabrati - papir, kamen ili makaze
   , kao i racunanje ishoda igre

U slucaju da korisnik kreira sobu on postaje prvi igrac kada sledeci
udje u sobu on postaje igrac 2 
U trenutku kada je soba kreirana emituje se to serveru:
U tom trenutku soba je kreirana pomocu funkcije makeid koja generise 
nasumicni string od 6 karaktera u tom trenutku u niz se dodaje soba sa 
tim id-ijem 

To direktno predstavlja prelaz iz inital faze u waiting area fazu

U waiting fazi imamo dugme koje nam pomaze da kopiramo kod, i zahteva da se 
taj kod posalje drugom korisniku kako bi se soba desila 
i onda se prelazi iz waiting area faze u game area fazu

Unutar game area faze, imamo pristup 3 dugmica
Svako dugme predstavlja jedan znak - ili papir ili kamen ili makaze
Klikom na dugme okida se funkcija sendChoice koja u server delu
poredi izbore igraca
Proglasava pobednika i gubitnika, a nekada proglasava izjednacenje

Kreiranje sobe: 
