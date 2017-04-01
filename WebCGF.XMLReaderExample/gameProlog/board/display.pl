%external representation
% 3x3 Components:
% Square
translate(square, 'top', '   ').
translate(square, 'mid', '   ').
translate(square, 'bottom', '   ').

% Orange's first pawn
translate([orange, 1], 'top', '___').
translate([orange, 1], 'mid', '|O1').
translate([orange, 1], 'bottom', '\'\'\'').

% Orange's second pawn
translate([orange, 2], 'top', '___').
translate([orange, 2], 'mid', '|O2').
translate([orange, 2], 'bottom', '^^^').

% Orange's base
translate([orange, base], 'top', '   ').
translate([orange, base], 'mid', '[O]').
translate([orange, base], 'bottom', '   ').

% Yellow's first pawn
translate([yellow, 1], 'top', '___').
translate([yellow, 1], 'mid', '|Y1').
translate([yellow, 1], 'bottom', '\'\'\'').

% Yellow's second pawn
translate([yellow, 2], 'top', '___').
translate([yellow, 2], 'mid', '|Y2').
translate([yellow, 2], 'bottom', '^^^').

% Yellow's base
translate([yellow, base], 'top', '   ').
translate([yellow, base], 'mid', '[Y]').
translate([yellow, base], 'bottom', '   ').

% Vertical wall slot
translate([vertical, empty], 'top', ' . ').
translate([vertical, empty], 'mid', ' . ').
translate([vertical, empty], 'bottom', ' . ').

% Vertical wall (placed)
translate([vertical, placed], 'top', ' X ').
translate([vertical, placed], 'mid', ' X ').
translate([vertical, placed], 'bottom', ' X ').


% 6x1 Components:
% Horizontal wall slot
translate([horizontal, empty], 'single', '----- ').

% Horizontal wall (placed)
translate([horizontal, placed], 'single', 'XXXXX ').


% displays the board
% displayBoard(+Ls)
displayBoard(Ls) :-
	nl,
	write('******************************BLOCKADE*****************************'), nl,
	write('   0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 '), nl,
	write(' ------------------------------------------------------------------'), nl,
	displayBoardAux(Ls, 0).



displayBoardAux([L1 | Ls], Line) :-
	(display3x3(L1, Line) ; display6x1(L1, Line)),
	N is Line+1,
	displayBoardAux(Ls, N).


displayBoardAux([], _) :-
	write(' ------------------------------------------------------------------'), nl,
	wallNumber(orange, O_hor, O_ver),
	format('-Orange has ~w horizontal walls and ~w vertical walls ~n',[O_hor,O_ver]),
	wallNumber(yellow, Y_hor, Y_ver),
	format('-Yellow has ~w horizontal walls and ~w vertical walls ~n',[Y_hor,Y_ver]),nl.




display3x3(L1, Line) :-
	Line mod 2 =:= 0,
	write('| '), displayLine(L1, 'top'),
	write('| '), displayLine(L1, 'mid', Line),
	write('| '), displayLine(L1, 'bottom').



display6x1(L1, Line) :-
	Line mod 2 =\= 0,
	write(' '), displayLine(L1, 'single', Line).



displayLine([E1 | Es], Type) :-
	displayElement(E1, Type),
	displayLine(Es, Type).

displayLine([], _) :-
	write(' | '),
	nl.


displayLine([E1 | Es], Type, Line) :-
	displayElement(E1, Type),
	displayLine(Es, Type, Line).

displayLine([], _, Line) :-
	Line mod 2 =\= 0,
	write('  '),
	write(Line),
	nl.

displayLine([], _, Line) :-
	Line mod 2 =:= 0,
	write(' |  '),
	write(Line),
	nl.


displayElement(Element, Type) :-
	translate(Element, Type, T),
	write(T).
