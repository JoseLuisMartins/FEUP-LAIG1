:- ensure_loaded('blockade.pl').

%teste servidor
parse_input(handshake, handshake).
parse_input(oi, 'entao tudo bem?').
parse_input(quit, goodbye).
parse_input(board(X), X):- board(X).


parse_input(test(C,N), Res) :- test(C,Res,N).


test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).
