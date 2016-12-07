:- use_module(library(lists)).
:- use_module(library(samsort)).
:- use_module(library(random)).
:- use_module(library(system)).
:- ensure_loaded('board/init.pl').
:- ensure_loaded('board/display.pl').
:- ensure_loaded('board/logic.pl').
:- ensure_loaded('plays.pl').
:- ensure_loaded('ai.pl').
:- ensure_loaded('menus.pl').

%teste servidor
parse_input(handshake, handshake).
parse_input(oi, ola).
parse_input(test(C,N), Res) :- test(C,Res,N).
parse_input(quit, goodbye).

test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).
%


%numeros random com seed diferente
:- now(Timestamp),
   setrand(Timestamp).

%inicializacoes
initGame(X):-
  initGraph,
  board(X).


%fim
 finalize(X):-
   retract(board(_)),
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
   assert(currentPlayer(orange)).


%Main Game cycle
%game(+M,+D)
game(M,D) :-
    initGame(X),
			repeat,
				once(retract(board(BoardInit))),
				once(displayBoard(BoardInit)),
				once(retract(currentPlayer(P))),
			 	once(play(M, D, P, BoardInit, BoardEnd)),
				once(changeCurrentPlayer(P)),
				once(assert(board(BoardEnd))),
			checkEnd,!,
     waitInput,
	   finalize(X),
     blockade.

%updates to cuurent player to next one
%changeCurrentPlayer(+P)
changeCurrentPlayer(P) :-
	(P = orange , assert(currentPlayer(yellow)));
	(P = yellow , assert(currentPlayer(orange))).

%check's if anyone has won
checkEnd :-
		(position([orange | _],X,Y) , ((X =:= 6 ; X =:= 14) , Y =:= 20) , winMessage(orange));
		(position([yellow | _],X,Y) , ((X =:= 6 ; X =:= 14) , Y =:= 6) , winMessage(yellow)).
