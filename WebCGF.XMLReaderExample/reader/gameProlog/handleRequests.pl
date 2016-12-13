:- ensure_loaded('blockade.pl').

%teste servidor
parse_input(handshake, handshake).
parse_input(oi, 'entao tudo bem?').
parse_input(quit, goodbye).
parse_input(board, X):- board(X).
parse_input(orange1,[X,Y]):- position([orange, 1], X, Y).
parse_input(orange2,[X,Y]):- position([orange, 2], X, Y).
parse_input(yellow1,[X,Y]):- position([yellow, 1], X, Y).
parse_input(yellow2,[X,Y]):- position([yellow, 2], X, Y).

parse_input(test(C,N), Res) :- test(C,Res,N).


test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).
