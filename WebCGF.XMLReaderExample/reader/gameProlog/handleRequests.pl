:- ensure_loaded('blockade.pl').

%teste servidor
parse_input(handshake, handshake).
parse_input(oi, 'entao tudo bem?').
parse_input(quit, goodbye).

parse_input(board, X):- board(X).

parse_input(init,'mequie meu munino'):-
  retract(board(_)),
  boardDefault(X),
  assert(board(X)),
  retractall(edge(_)),
  retractall(vertex(_)),
  retract(graph(_)),
  retractall(wallNumber(_,_,_)),
  assert(wallNumber(orange,9,9)),
  assert(wallNumber(yellow,9,9)),
  retractall(position(_,_,_)),
  assert(position([orange, 1], 6, 6)),
  assert(position([orange, 2], 14, 6)),
  assert(position([yellow, 1], 6, 20)),
  assert(position([yellow, 2], 14, 20)),
  retract(currentPlayer(_)),
  assert(currentPlayer(orange)),
  initGraph,
  board(Z),
  displayBoard(Z).

parse_input(init,'mequie meu munino'):-
  initGraph.


parse_input(move(Pawn, X, Y),[NewPosX,NewPosY]) :-
  board(Board),
  validPosition(Pawn, Board, X, Y,Nx,Ny),
  moveOneSpace(Pawn, Nx, Ny, Board, NewBoard),
  retract(board(Board)),
  assert(board(NewBoard)),
  position(Pawn, NewPosX,NewPosY).



parse_input(move(Pawn, X, Y),[NewPosX,NewPosY]) :-
  NewPosX is - 1,
  NewPosY is - 1.

parse_input(placewall(Player,X, Y,O),Sucess):-
  board(Board),
  placeWall(Player,X, Y,O,Board, NewBoard),
  retract(board(Board)),
  assert(board(NewBoard)),
  Sucess is 1.

parse_input(placewall(Player,X, Y,O),Sucess):-
  Sucess is 0.


parse_input([Type,Id],[X,Y]):- position([Type, Id], X, Y).

parse_input(changePlayer,"muito xiroo este prolog"):-
  retract(currentPlayer(P)),
  changeCurrentPlayer(P).


parse_input(checkEnd,Res):-
  checkEnd,
  Res is 1.

parse_input(checkEnd,Res):-
  Res is 0.


















parse_input(test(C,N), Res) :- test(C,Res,N).


test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).
