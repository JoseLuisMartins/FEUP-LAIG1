:- ensure_loaded('../utils.pl').

%set the board ceel in the position (X,Y) to Elem
%setBoardCell(+X, +Y, +Elem, +Board, -NewBoard)
setBoardCell(X, Y, Elem, Board, NewBoard) :-
  nth0(Y, Board, Line),
  setCell(X, Elem, Line, Nline),
  setCell(Y, Nline, Board, NewBoard).

%calculates the targets coords to where the Pawn is moving based on the offset (X,Y)
%targetCoords(+Pawn, +X, +Y, -Tx, -Ty)
targetCoords(Pawn, X, Y, Tx, Ty) :-
	position(Pawn, Px, Py),
	Tx is Px + X*2,
	Ty is Py + Y*2.

%cleans the position (Px,Py) of the board accordingly to the cell
%emptyPosition(+Px,+Py,+Board,-NBoard)
emptyPosition(Px,Py,Board,NBoard) :-
	(((Px =:= 6 ; Px =:= 14) , Py =:= 6) , setBoardCell(Px, Py, [orange, base], Board, NBoard));
	(((Px =:= 6 ; Px =:= 14) , Py =:= 20) , setBoardCell(Px, Py, [yellow, base], Board, NBoard));
	(setBoardCell(Px, Py, square, Board, NBoard)).

%checks if the Player hasWalls
%hasWalls(+Player)
hasWalls(Player) :-
	wallNumber(Player, H, V),
	(H =\= 0 ; V =\= 0).


%moves the Pawn with the (X,Y) offset
%moveOneSpace(+Pawn, +X, +Y, +Board, -NewBoard)
moveOneSpace(Pawn, X, Y, Board, NewBoard) :-
	targetCoords(Pawn, X, Y, Nx, Ny),
	retract(position(Pawn, Px, Py)),
  emptyPosition(Px,Py,Board,AuxBoard),
	assert(position(Pawn, Nx, Ny)),
  setBoardCell(Nx, Ny, Pawn, AuxBoard, NewBoard).



validPosition(_, _, 0, 0,0,0) :-
		true.

%checks if the position to where the Pawn is trying to move is valid and instantiate (Nx,Ny)
% to the new position that are diferent if the player jumps over other player
%validPosition(+Pawn, +Board, +X, +Y,-Nx,-Ny)
validPosition(Pawn, Board, X, Y,Nx,Ny) :-
	targetCoords(Pawn, X,Y, Tx,Ty),
	inBounds(Tx, Ty),
	elementCoords(Board, Tx, Ty, Elem),
	(
    ((Elem = square ; Elem = [orange, base] ; Elem = [yellow, base]),
      Nx is X ,Ny is Y, !,
      noWallBlocking(Pawn, Board, X, Y)) ;
    ((Elem = [orange, 1] ; Elem = [orange, 2] ; Elem = [yellow, 1];Elem = [yellow, 1] ),
      checkJumpOver(Pawn,X,Y,Nx,Ny),
      Aux1 is Nx + X,
      Aux2 is Ny + Y, !,
      noWallBlocking(Pawn, Board, Aux1, Aux2))
  ).

validPosition(_, _, _, _,_,_) :-
	displayLog('---- You can \'t move to that position. ----'),
	fail.

%checks if there is no wall blocking the position to where the Pawn is trying to move
%noWallBlocking(+Pawn, +Board, +X, +Y)
noWallBlocking(Pawn, Board, X, Y) :-
	position(Pawn, Px, Py),
	wallCoords(X,Y, Px,Py, Wx, Wy),
	elementCoords(Board, Wx, Wy, Elem),
	checkWallColision(Elem).


%checks if it's possible to jump over the other player
%checkJumpOver(+Pawn,+X,+Y,-Nx,-Ny)
checkJumpOver(Pawn,X,Y,Nx,Ny) :-
    Nx is X + X,
    Ny is Y + Y,
    targetCoords(Pawn, Nx,Ny, Tx,Ty),
  	inBounds(Tx, Ty).

%check's if the player is in the board bounds
%inBounds(+Tx, +Ty)
inBounds(Tx, Ty) :-
	Tx >= 0, Tx < 21,
	Ty >= 0, Ty < 27.



placeWall(Player, _, _, 'h', _, _) :-
	wallNumber(Player, 0, _), !,
	displayLog('---- You\'re out of horizontal walls ----'),
	fail.


placeWall(Player, _, _, 'v', _, _) :-
	wallNumber(Player, _, 0), !,
	displayLog('---- You\'re out of vertical walls ----'),
	fail.

%check if it's possible to place a wall and if it is place it creating a NewBoard
%placeWall(+Player,+X, +Y,+O,+Board, -NewBoard)
placeWall(Player,X, Y,'h',Board, NewBoard) :-%!!! não deixar dar place se a wall bloquear todos os caminhos ao jogador
  getOpponent(Player, Opponent),
	checkWallCoords(X, Y,'h',Board),
  manageEdges(remove, X,Y,'h'),
  evaluateMinPath(Player, 1, _, Cost1, _, Cost2),
  evaluateMinPath(Player, 2, _, Cost3, _, Cost4),
  evaluateMinPath(Opponent, 1, _, Cost5, _, Cost6),
  evaluateMinPath(Opponent, 2, _, Cost7, _, Cost8), !,
  playerHasPath(X, Y, 'h', Cost1, Cost2, Cost3, Cost4, Cost5, Cost6, Cost7, Cost8),
	retract(wallNumber(Player, H, V)),
	Nh is H - 1,
	assert(wallNumber(Player, Nh, V)),
	Nx is round(X/2),
  setBoardCell(Nx, Y, [horizontal, placed], Board, AuxBoard),
	Nx2 is Nx + 1,
	setBoardCell(Nx2, Y, [horizontal, placed], AuxBoard, NewBoard).


placeWall(Player,X, Y,'v',Board, NewBoard) :-
  getOpponent(Player, Opponent),
	checkWallCoords(X, Y,'v',Board),
  manageEdges(remove, X,Y,'v'),
  evaluateMinPath(Player, 1, _, Cost1, _, Cost2),
  evaluateMinPath(Player, 2, _, Cost3, _, Cost4),
  evaluateMinPath(Opponent, 1, _, Cost5, _, Cost6),
  evaluateMinPath(Opponent, 2, _, Cost7, _, Cost8), !,
  playerHasPath(X, Y, 'v', Cost1, Cost2, Cost3, Cost4, Cost5, Cost6, Cost7, Cost8),
	retract(wallNumber(Player, H, V)),
	Nv is V - 1,
	assert(wallNumber(Player, H, Nv)),
  setBoardCell(X, Y, [vertical, placed], Board, AuxBoard),
	Ny is Y + 2,
	setBoardCell(X, Ny, [vertical, placed], AuxBoard, NewBoard).


%check' if the player has path to the targets after placing a wall
%playerHasPath(+X, +Y, +O, +Cost1, +Cost2, +Cost3, +Cost4, +Cost5, +Cost6, +Cost7, +Cost8)
playerHasPath(_, _, _, Cost1, Cost2, Cost3, Cost4, Cost5, Cost6, Cost7, Cost8) :-
  Cost1 =\= 0,
  Cost2 =\= 0,
  Cost3 =\= 0,
  Cost4 =\= 0,
  Cost5 =\= 0,
  Cost6 =\= 0,
  Cost7 =\= 0,
  Cost8 =\= 0.

playerHasPath(X, Y, O, _, _, _, _, _, _, _, _) :-
  manageEdges(add, X, Y, O),
  displayLog('You can\'t fully block a player'),
  fail.

%manages the edges of the graph removing edges if a wall is placed so that the graph loses connectivity in that part
%manageEdges(+Management, +X,+Y,+O)
manageEdges(Management, X,Y,'h') :-
  retract(graph(G)),
  Y1 is Y - 1,
  Y2 is Y + 1,
  NX is X + 2,
  (
    (Management = remove, del_edges(G,[[X,Y1]-[X,Y2],[X,Y2]-[X,Y1],[NX,Y1]-[NX,Y2],[NX,Y2]-[NX,Y1]], Ng)) ;
    (Management = add, add_edges(G,[[X,Y1]-[X,Y2],[X,Y2]-[X,Y1],[NX,Y1]-[NX,Y2],[NX,Y2]-[NX,Y1]], Ng))
  ),
  assert(graph(Ng)).

manageEdges(Management, X,Y,'v') :-
  retract(graph(G)),
  X1 is X - 1,
  X2 is X + 1,
  NY is Y + 2,
  (
    (Management = remove, del_edges(G,[[X1,Y]-[X2,Y],[X2,Y]-[X1,Y],[X1,NY]-[X2,NY],[X2,NY]-[X1,NY]], Ng)) ;
    (Management = add, add_edges(G,[[X1,Y]-[X2,Y],[X2,Y]-[X1,Y],[X1,NY]-[X2,NY],[X2,NY]-[X1,NY]], Ng))
  ),
  assert(graph(Ng)).

% auxiliar to the placeWall predicate, check's if it's possible to place a wall with position (X,Y) and Orientatio O
%checkWallCoords(+X, +Y, +O, +Board)
checkWallCoords(X, Y,'v',Board) :-
	X mod 2 =:= 1,
	Y mod 2 =:= 0,
	X < 20, X > 0,
	Y < 25, Y >= 0,
	noWallPlaced(Board, X, Y, 'v'),
	Cx is X - 1,
	Cy is Y + 1,
	noWallCrossing(Board, Cx, Cy, 'h').


checkWallCoords(X, Y,'h',Board) :-
	X mod 2 =:= 0,
	Y mod 2 =:= 1,
	X >= 0, X < 19,
	Y > 0, Y < 26,
	noWallPlaced(Board, X, Y, 'h'),
	Cx is X + 1,
	Cy is Y - 1,
	noWallCrossing(Board, Cx, Cy, 'v').


checkWallCoords(_,_,_,_) :-
	displayLog('---- Invalid wall coordenates ----'),
	fail.


%check's if there is no wall placed at the position X,Y with Orientation O
%noWallPlaced(+Board, +X, +Y, +O)
noWallPlaced(Board, X, Y, 'h') :-
  Nx is round(X/2),
  elementCoords(Board, Nx, Y, Elem1),
  Nx2 is Nx + 1,
  elementCoords(Board, Nx2, Y, Elem2),
  (Elem1 = [_, empty] , Elem2 = [_, empty]).


noWallPlaced(Board, X, Y, 'v') :-
  elementCoords(Board, X, Y, Elem1),
  Ny is Y + 2,
  elementCoords(Board, X, Ny, Elem2),
  (Elem1 = [_, empty] , Elem2 = [_, empty]).

%check's if the wall that is trying to be placed is not crossing another wall
%noWallCrossing(+Board, +X, +Y, +O)
noWallCrossing(Board, X, Y, 'h') :-
  Nx is round(X/2),
  elementCoords(Board, Nx, Y, Elem1),
  Nx2 is Nx + 1,
  elementCoords(Board, Nx2, Y, Elem2),
  (Elem1 = [_, empty] ; Elem2 = [_, empty]).


noWallCrossing(Board, X, Y, 'v') :-
  elementCoords(Board, X, Y, Elem1),
  Ny is Y + 2,
  elementCoords(Board, X, Ny, Elem2),
  (Elem1 = [_, empty] ; Elem2 = [_, empty]).



%Calculates the wall Coords to where the player is trying to move, based on the offset of the movement and the player position
%wallCoords(+X,+Y,+Px,+Py,-Wx,-Wy)
wallCoords(X,Y,Px,Py,Wx,Wy) :-
  (X =:= 0 , Wx is round(Px/2) , Wy is Py + Y);
  (Y =:= 0 , Wx is Px + X , Wy is Py).

%fails if the wall received is placed, suceeds if it is not
%checkWallColision(+Wall)
checkWallColision([_ | [placed | _ ]]) :-
	displayLog('----There is a wall in the way you have to choose another path!----'),
	fail.


checkWallColision([_ | [empty | _]]) :-
	true.
