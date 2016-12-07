:- ensure_loaded('board/graph.pl').
:- ensure_loaded('utils.pl').

%calculates the distance between the point (X,Y) and (TargetX,TargetY)
%distance(+X,+Y,+TargetX,+TargetY,-N)
distance(X,Y,TargetX,TargetY,N) :-
  N is round(abs(X - TargetX)/2 +  abs(Y - TargetY)/2).

%evaluates the best pawn to move
%evaluateBestPawn(+Player,+N)
evaluateBestPawn(Player,N) :-
  evaluateMinPath(Player, 1, _, Cost1, _, Cost2),
  evaluateMinPath(Player, 2, _, Cost3, _, Cost4),
  min([Cost1, Cost2], MinPlayer1),
  min([Cost3, Cost4], MinPlayer2),
  min([MinPlayer1, MinPlayer2], MinCost),
  choosePlayer(MinCost, MinPlayer1, MinPlayer2, N).

%auxiliar to the evaluateBestPawn predicate choose the best player based on the distance and if the distances are equal choose's a player randomly
%choosePlayer(+Nend, +NPlayer1, +NPlayer2, -N)
choosePlayer(Nend, NPlayer1, NPlayer2, N) :-
  Nend =:= NPlayer1, Nend =:= NPlayer2, random_member(RandPlayer, [1,2]), N is RandPlayer.

choosePlayer(Nend, NPlayer1, _, N) :-
  Nend =:= NPlayer1 , N is 1.

choosePlayer(Nend, _, NPlayer2, N) :-
  Nend =:= NPlayer2 , N is 2.

%evaluates the best direction based on path finding (considering the wall placement)
%evaluateBestDirectionPro(+Player, +Id, -Direction)
evaluateBestDirectionPro(Player, Id, Direction) :-
  position([Player, Id], X, Y),
  evaluateMinPath(Player, Id, Path1, Cost1, Path2, Cost2),
  getBestCoordinates(Path1, Cost1, Path2, Cost2, [Nx,Ny]),
  OffsetX is round((Nx - X)/2),
  OffsetY is round((Ny - Y)/2),
  Direction = [OffsetX, OffsetY].

%evaluates the minimum path to the to targets of the Pawn(Player,Id), instatiating the values of the path and cost
%evaluateMinPath(+Player, +Id, -Path1, -Cost1, -Path2, -Cost2)
evaluateMinPath(Player, Id, Path1, Cost1, Path2, Cost2) :-
  position([Player,Id], X, Y),
  graph(G),
  V1 = [X,Y],
  targetPosition([Player, 1], Tx1, Ty1),
  targetPosition([Player, 2], Tx2, Ty2),
  V2 = [Tx1, Ty1],
  V3 = [Tx2, Ty2],
  (min_path(V1, V2, G, Path1, Cost1) ; (Path1 = [], Cost1 is 0)),
  (min_path(V1, V3, G, Path2, Cost2) ; (Path2 = [], Cost2 is 0)).

%evaluates the best direction based on the distance to the target's (not considering the wall placement)
%evaluateBestDirection(+Player,+Id,-Directions)
evaluateBestDirection(Player,Id,Directions) :-
  position([Player,Id],X,Y),
  %calcular distancia a que fica do targer
  %North
  Xn is X,Yn is Y - 1,
  getBestDistanceToTarget(Xn,Yn,Player,N),
  %South
  Xs is X,Ys is Y + 1,
  getBestDistanceToTarget(Xs,Ys,Player,S),
  %West
  Xw is X - 1,Yw is Y,
  getBestDistanceToTarget(Xw,Yw,Player,W),
  %East
  Xe is X + 1,Ye is Y,
  getBestDistanceToTarget(Xe,Ye,Player,E),
  %ordenar distancias
  samsort( [[N,1],[S,2],[W,3],[E,4]],  AuxDirections),
  shuffleList(AuxDirections,Directions).

%shuffle's a list, mantaining the head unaltered
%evaluateBestDirection(+Player,+Id,-Directions)
shuffleList([H|T],Nlist):-
  random_permutation(T, NewT),
  Nlist = [H|NewT].

%get the coordintes of the best position to move considering to path and to costs
%getBestCoordinates(+Path1, +Cost1, +Path2, +Cost2, -NewCoords)
getBestCoordinates(Path1, Cost1, _, Cost2, NewCoords) :-
  Cost1 =< Cost2, !,
  nth0(1, Path1, NewCoords).

getBestCoordinates(_, Cost1, Path2, Cost2, NewCoords) :-
  Cost2 < Cost1, !,
  nth0(1, Path2, NewCoords).


%evalutes the best wall to place for the Player instatiating a list of the best Walls
%evaluateBestWall(+Player,-Walls)
evaluateBestWall(Player,Walls) :-
  getOpponent(Player,Opponent),
  evaluateBestPawn(Opponent,Id),
  evaluateBestDirection(Opponent,Id,Direction),
  nth0(0,Direction,Elem1),
  createWallCoords([Opponent,Id],Elem1,W1,W2),
  nth0(1,Direction,Elem2),
  createWallCoords([Opponent,Id],Elem2,W3,W4),
  nth0(2,Direction,Elem3),
  createWallCoords([Opponent,Id],Elem3,W5,W6),
  nth0(3,Direction,Elem4),
  createWallCoords([Opponent,Id],Elem4,W7,W8),
  Walls = [W1,W2,W3,W4,W5,W6,W7,W8].


%instantiate to wall cords based on the pawn and direction
%createWallCoords(+Pawn, +[_ , Direction],-Wall1,-Wall2)
%north/south
createWallCoords(Pawn,[_ , Direction],Wall1,Wall2) :-
  (Direction = 1 ; Direction = 2 ),
  position(Pawn,Px,Py),
  convertDirection(Direction,X,Y),
  Wx is Px + X , Wy is Py + Y,
  O = h ,
  Wall1 = [Wx,Wy,O],
  Wx2 is Wx - 1,
  Wall2 = [Wx2,Wy,O].

%east/west
createWallCoords(Pawn,[_ , Direction],Wall1,Wall2) :-
  (Direction = 3 ; Direction = 4 ),
  position(Pawn,Px,Py),
  convertDirection(Direction,X,Y),
  Wx is Px + X , Wy is Py + Y,
  O = v ,
  Wall1 = [Wx,Wy,O],
  Wy2 is Wy - 2,
  Wall2 = [Wx,Wy2,O].


%gets the minor distance of the coordinates (X,Y) to the one of the target's of the Player
%getBestDistanceToTarget(+X,+Y,+Player,-N)
getBestDistanceToTarget(X,Y,Player,N) :-
    targetPosition([Player, 1], Tx,Ty),
    distance(X,Y,Tx,Ty,N1),
    targetPosition([Player, 2], Tx2,Ty2),
    distance(X,Y,Tx2,Ty2,N2),
    getSmaller(N1,N2,N).

%takes to number ans intatiates N with the smaller argument
%getSmaller(+N1,+N2,-N)
getSmaller(N1,N2,N) :-
  (N1 < N2, N is N1) ;
  (N1 >= N2, N is N2).
