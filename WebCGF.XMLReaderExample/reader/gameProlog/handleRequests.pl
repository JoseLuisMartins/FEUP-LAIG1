:- ensure_loaded('blockade.pl').

%teste servidor
parse_input(handshake, handshake).
parse_input(oi, 'entao tudo bem?').
parse_input(quit, goodbye).

parse_input(board, X):- board(X).

parse_input(init,'i'):-
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
  initGraph.

parse_input(init,'i'):-
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

parse_input(botPlay(Player,Difficulty),[Id,Px,Py,O,Wx,Wy]):-
  retract(board(Board)),
  playBot(Difficulty,Player,Board,NewBoard,Id,Px,Py,Or,Wx,Wy),
  getOrientationInteger(Or,O),
  assert(board(NewBoard)),
  displayBoard(NewBoard).

getOrientationInteger(h,0).
getOrientationInteger(v,1).
getOrientationInteger(-1,-1).

parse_input([Type,Id],[X,Y]):- position([Type, Id], X, Y).

parse_input(changePlayer,"c"):-
  retract(currentPlayer(P)),
  changeCurrentPlayer(P).

parse_input(hasWalls(P),[HorWalls,VerWalls]):-
  wallNumber(P,HorWalls,VerWalls).




parse_input(undoWall(Player,WallX,WallY,v),Res):-
  retract(board(Board)),
  retract(wallNumber(Player, H, V)),
	Nv is V + 1,
	assert(wallNumber(Player, H, Nv)),
  setBoardCell(WallX, WallY, [vertical, empty], Board, AuxBoard),
	NWallY is Y + 2,
	setBoardCell(WallX, NWallY, [vertical, empty], AuxBoard, NewBoard),
  assert(board(NewBoard)),
  displayBoard(NewBoard),
  Res is 1.

parse_input(undoWall(Player,WallX,WallY,h),Res):-
  retract(board(Board)),
  retract(wallNumber(Player, H, V)),
	Nh is H + 1,
	assert(wallNumber(Player, Nh, V)),
	Nx is round(WallX/2),
  setBoardCell(Nx, WallY, [horizontal, empty], Board, AuxBoard),
	Nx2 is Nx + 1,
	setBoardCell(Nx2, WallY, [horizontal, empty], AuxBoard, NewBoard),
  assert(board(NewBoard)),
  displayBoard(NewBoard),
  Res is 1.




parse_input(checkEnd,Res):-
  checkEnd,
  Res is 1.

parse_input(checkEnd,Res):-
  Res is 0.



parse_input(test(C,N), Res) :- test(C,Res,N).


test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).
