:- dynamic(logMessages/1).

%set's a Index of a list to the Elem instatiating a NewList with the result
%setCell(+Index, +Element, +List, -NewList)
setCell(Index, Element, List, NewList) :-
		length(AuxL, Index),
		append(AuxL, [_ | E],List),
		append(AuxL, [Element | E], NewList).

%get's the Elem in the position (X,Y) of the board
%elementCoords(+Board, +X, +Y, -Elem)
elementCoords(Board, X, Y, Elem) :-
		nth0(Y, Board, Line),
		nth0(X, Line, Elem).

%get's the Opponent of the Player
%getOpponent(+Player,-Opponent)
getOpponent(Player, Opponent) :-
  (Player = yellow, Opponent = orange);
  (Player = orange, Opponent = yellow).

%convert's de direction M to coordinates (X,Y)
%convertDirection(+M,-X,-Y)
convertDirection(M,X,Y) :-
	((M =:= 1 , X is 0 , Y is -1);
	 (M =:= 2 , X is 0 , Y is 1);
	 (M =:= 3 , X is -1, Y is 0);
	 (M =:= 4 , X is 1,Y is 0);
	 (M =:= 5 , X is 0,Y is 0)).

%get's the minimum value on a list
%min(List,Value)
min([],X,X).
min([H|T],M,X) :- H =< M, min(T,H,X).
min([H|T],M,X) :- M < H, min(T,M,X).
min([H|T],X) :- min(T,H,X).


%writes every element of a list
%writeList(List)
writeList([]).

writeList([H | T]) :-
  write(H), nl,
  writeList(T).


%log messages
%when logMessages = 1 the error messages are displayed
logMessages(1).

%change the log message state to X
%logMessagesState(+X)
logMessagesState(X) :-
	retract(logMessages(_)),
	assert(logMessages(X)).
