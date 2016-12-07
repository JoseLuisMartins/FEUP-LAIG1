:- ensure_loaded('cli.pl').
:- ensure_loaded('board/logic.pl').

% make a play in Mode M with Level L and Player
%play(+M, +L, +Player, +Board, -NewBoard)
play(M, L, Player, Board, NewBoard) :-
	(M =:= 1, logMessagesState(1), playHuman(Player, Board, NewBoard));
	(M =:= 2, Player = orange ,logMessagesState(1), playHuman(Player,Board,NewBoard));
	(M =:= 2, Player = yellow ,logMessagesState(0), playBot(L, Player,Board,NewBoard));
	(M =:= 3, format("~n Next Player: ~s ~n",[Player]),waitInput,logMessagesState(0), playBot(L, Player, Board, NewBoard)).


%make a play human side
%playHuman(+Player, +Board, -NewBoard)
playHuman(Player, Board, NewBoard) :-
	format('--------------Its your turn ~s ----------- ~n',[Player]),
	getPawnNumber(N),
	moveHuman([Player, N], Board, AuxBoard),
	handleWall(Player, AuxBoard, NewBoard).

%make a play bot side
%playBot(+L,+Player, +Board, -NewBoard)
playBot(L, Player,Board,NewBoard):-
	format('--------------Its Bot ~s turn----------- ~n',[Player]),
	moveBot(L, Player, Board, AuxBoard),
	handleWallBot(L, Player, AuxBoard, NewBoard).


%move asking the coords
%moveHuman(+Pawn, +Board, -NewBoard)
moveHuman(Pawn, Board, NewBoard) :-
	moveOneSpaceHuman(Pawn,Board,AuxBoard),
	moveOneSpaceHuman(Pawn,AuxBoard,NewBoard).


%handles the wall part of the play (asking coordes to the user)
%handleWall(+Player, +Board, -NewBoard)
handleWall(Player, Board, NewBoard) :-
	hasWalls(Player), !,
	getPlaceWal(Awnser),
	(
		(Awnser =:= 1,
		repeat,
			once(getWallCoords(X, Y, O)),		% posicionar a parede
		placeWall(Player, X, Y, O, Board, NewBoard)); 	%ver se o numero de paredes for 0 não perguntar as coordenadas
		(Awnser =:= 2,NewBoard = Board)
	).

handleWall(_, Board, Board) :-
	true.

%moves one space asking the coords
%moveOneSpaceHuman(+Pawn,+Board,-NewBoard)
moveOneSpaceHuman(Pawn,Board,NewBoard) :-
	repeat, %verificar colisoes
		once(getMovCoords(X,Y)),
	validPosition(Pawn, Board, X, Y,Nx,Ny),
	moveOneSpace(Pawn, Nx, Ny, Board, NewBoard),
	displayBoard(NewBoard).


%move (Pc calculates the coords)
%moveBot(+L, +Player, +Board, -NewBoard)
moveBot(1, Player, Board, NewBoard) :-
	evaluateBestPawn(Player,N),
	auxMoveBot(Player,N,Board,AuxBoard),
	(
		(checkBotWin(Player, N), NewBoard = AuxBoard) ;
		auxMoveBot(Player,N,AuxBoard,NewBoard)
	).


moveBot(2, Player, Board, NewBoard) :-
	random_member(N, [1, 2]),
	Pawn = [Player, N],
	moveOneSpaceRandom(Pawn, Board, AuxBoard),
	moveOneSpaceRandom(Pawn, AuxBoard, NewBoard).


%handles the wall part of the play (PC calculating the coords)
%handleWallBot(+L,+Player, +Board, -NewBoard)
handleWallBot(1, Player, Board, NewBoard) :-
	hasWalls(Player), !,
	evaluateBestWall(Player,Walls),
	iterateWallList(Walls,Player,Board,NewBoard).


handleWallBot(2, Player, Board, NewBoard) :-
	hasWalls(Player), !,
	repeat,
		once(randomWall(X, Y, O)),
	placeWall(Player, X, Y, O, Board, NewBoard).


handleWallBot(_, _, Board, Board) :-
	true.



auxMoveBot(Player,N,Board,NewBoard) :-
	evaluateBestDirectionPro(Player, N, [X,Y]),
	(
		(validPosition([Player,N], Board, X, Y,Nx,Ny),
		 moveOneSpaceBot([Player,N], [Nx,Ny], Board, NewBoard)) ;
		(NewBoard = Board)
	).


%moves one space receiving the coords
%moveOneSpaceBot(+Pawn,+Coords,+Board,-NewBoard)
moveOneSpaceBot(Pawn, [X,Y], Board,NewBoard) :-
	moveOneSpace(Pawn, X, Y, Board, NewBoard),
	displayBoard(NewBoard).


%iterate's a wall list trying to place one of the walls in the list
%iterateWallList(+WallList, +Player, +Board, -NewBoard)
iterateWallList([], _, Board, Board) :- %ver cruzados tambem
	 true.

iterateWallList([[X,Y,O] | _], Player, Board, NewBoard) :-
	placeWall(Player, X, Y, O, Board, NewBoard).

iterateWallList([[_,_,_] | Res], Player, Board, NewBoard) :-
	iterateWallList(Res,Player,Board,NewBoard).


%moves one space randomly
%moveOneSpaceRandom(+Pawn,+Board,-NewBoard)
moveOneSpaceRandom(Pawn, Board, NewBoard) :-
	repeat,
		randomMove(X, Y),
	validPosition(Pawn, Board, X, Y,Nx,Ny),
	moveOneSpace(Pawn, Nx, Ny, Board, NewBoard),
	displayBoard(NewBoard).

%caculates a random offset (X,Y) to make a random move
%randomMove(X, Y)
randomMove(X, Y) :-
		random_member(X, [-1, 0, 1]),
		(
			(X =:= 0, random_member(Y, [-1, 0, 1])) ;
			(X =\= 0, Y is 0)
		).

%caculates a random wall coordinate(X,Y,O) to make a random wall placement
%randomWall(-X, -Y, -O)
randomWall(X, Y, O) :-
		random(0, 19, X),
 		random(0, 25, Y),
 		random_member(O, [h,v]).


%check's if the Pawn [Player,N] won
%checkBotWin(+Player,+N)
checkBotWin(Player,N) :-
	position([Player,N], X, Y),
	targetPosition([Player, 1], Tx1, Ty1),
	targetPosition([Player, 2], Tx2, _),
	(X =:= Tx1 ; X =:= Tx2),
	 Y =:= Ty1.
