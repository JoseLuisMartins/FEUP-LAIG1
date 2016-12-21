:- ensure_loaded('blockade.pl').

%teste servidor
parse_input(handshake, handshake).
parse_input(oi, 'entao tudo bem?').
parse_input(quit, goodbye).
parse_input(board, X):- board(X).

parse_input(init,'mequie meu munino'):-
  initGraph.

parse_input(move(Pawn, X, Y),[NewPosX,NewPosY]) :-
  board(Board),
  validPosition(Pawn, Board, X, Y,Nx,Ny),
  moveOneSpace(Pawn, Nx, Ny, Board, NewBoard),
  retract(board(Board)),
  assert(board(NewBoard)),
  position(Pawn, NewPosX,NewPosY).

parse_input(move(Pawn, X1, Y1, X2, Y2),[NewPosX,NewPosY]) :-
  board(Board),
  validPosition(Pawn, Board, X1, Y1,Nx1,Ny1),
  moveOneSpace(Pawn, Nx1, Ny1, Board, AuxBoard),
  validPosition(Pawn, AuxBoard, X2, Y2,Nx2,Ny2),
  moveOneSpace(Pawn, Nx2, Ny2, AuxBoard, NewBoard),
  retract(board(Board)),
  assert(board(NewBoard)),
  position(Pawn, NewPosX,NewPosY).

parse_input(move(Pawn, X1, Y1, X2, Y2),[NewPosX,NewPosY]) :-
  NewPosX is - 1,
  NewPosY is - 1.


parse_input(move(Pawn, X, Y),[NewPosX,NewPosY]) :-
  NewPosX is - 1,
  NewPosY is - 1.

parse_input(placewall(Player,X, Y,O),Sucess):-
  board(Board),write(X),write(Y),
  placeWall(Player,X, Y,O,Board, NewBoard),
  retract(board(Board)),
  assert(board(NewBoard)),
  Sucess is 1.

parse_input(placewall(Player,X, Y,O),Sucess):-
  Sucess is 0.


parse_input([Type,Id],[X,Y]):- position([Type, Id], X, Y).


parse_input(checkEnd,Res):-
  checkEnd,
  Res is 1.

parse_input(checkEnd,Res):-
  Res is 0.



parse_input(test(C,N), Res) :- test(C,Res,N).


test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).
