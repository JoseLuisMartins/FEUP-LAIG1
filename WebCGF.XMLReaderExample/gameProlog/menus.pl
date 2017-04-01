clearScreen :-
  nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,
  nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,
  nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,
  nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl,nl.

out(O):-
  write(O),
  nl.


intro :-
  clearScreen,
  out('__________________________________________________________________________________'),
  out('  ______   _                 _                 _        '),
  out(' (____  \\ | |               | |               | |       '),
  out('  ____)  )| |   ___    ____ | |  _  _____   __| | _____ '),
  out(' |  __  ( | |  / _ \\  / ___)| |_/ )(____ | / _  || ___ |'),
  out(' | |__)  )| | | |_| |( (___ |  _ ( / ___ |( (_| || ____|'),
  out(' |______/  \\_) \\___/  \\____)|_| \\_)\\_____| \\____||_____)'),
  out('                                                        '),
  out('                            Made by:'),
  out('                                  Joao Barbosa - up201406241'),
  out('                                  Jose Martins - up201404189'),
  out('                                                        ').

blockade :-
  intro,
  out('   1. Player vs  Player'),
  out('   2. Player vs  Bot'),
  out('   3. Bot vs  Bot'),
  out('   4. Rules'),
  out('   5. Exit'),
  out('__________________________________________________________________________________'),
  read(Option),
  (
    (Option =:= 5) ;
    (Option =:= 4, about) ;
    (
      (Option =:= 1, clearScreen , game(Option,1));
      ((dificultyMenu(Dificulty)), ((Dificulty =:= 3 , blockade) ; (clearScreen , game(Option,Dificulty))))
    )
  ).


dificultyMenu(Option) :-
  intro,
  out('Dificulty:'),
  out('   1. Hard'),
  out('   2. Easy'),
  out('   3. Back'),
  out('__________________________________________________________________________________'),
  read(Option).

waitInput :-
  nl,nl,nl,
  out('             ------Press Enter------ '),
  get_char(_),
  get_char(_).

about :-
  clearScreen,
  out('____________________________Blockade Rules_________________________________________'),
  out('Blockade is a board game for two players, invented by Mirko Marchesi'),
  out('and published by Lakeside Industries in 1975.'),
  nl,nl,
  out('Two players are each given two pawns, nine green walls (which are placed vertically),'),
  out('and nine blue walls (placed horizontally). Pawns are placed on their starting locations'),
  out('on each of the four corners of the 11-14 board.'),
  out('One team\'s starting location  at 4-4 and 8 4 and the other at 4-11 and 8-11 . '),
  out('The object of the game is for each player to get both their pawns to a starting locations of their opponent.'),
  out('The first to do so wins.'),
  out('On each turn, a player moves one pawn one or two spaces (horizontally, vertically, or any combination of the two) '),
  out('and places one wall anywhere on the board (useful for blocking off their opponent\'s move).'),
  out('Walls always cover two squares and must be placed according to their color (vertically or horizontally).'),
  out('Pawns may jump over other pawns that are blocking their path.'),
  out('Once players are out of walls, they keep moving pawns until one wins.'),
  out('__________________________________________________________________________________'),
  waitInput,
  blockade.
