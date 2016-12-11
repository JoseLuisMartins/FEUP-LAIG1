:- dynamic(board/1).
:- dynamic(position/3).
:- dynamic(wallNumber/3).
:- dynamic(currentPlayer/1).

%Initial Board
board([[square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square],
				[[horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty]],
				[square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square],
				[[horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty]],
				[square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square],
				[[horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty]],
				[square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], [orange,1], [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], [orange,2], [vertical, empty], square, [vertical, empty], square, [vertical, empty], square],
				[[horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty]],
				[square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square],
				[[horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty]],
				[square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square],
				[[horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty]],
				[square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square],
				[[horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty]],
				[square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square],
				[[horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty]],
				[square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square],
				[[horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty]],
				[square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square],
				[[horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty]],
				[square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], [yellow, 1], [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], [yellow, 2], [vertical, empty], square, [vertical, empty], square, [vertical, empty], square],
				[[horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty]],
				[square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square],
				[[horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty]],
				[square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square],
				[[horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty], [horizontal, empty]],
				[square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square, [vertical, empty], square] ]).




%Initial Position's of the pawn's
position([orange, 1], 6, 6).
position([orange, 2], 14, 6).
position([yellow, 1], 6, 20).
position([yellow, 2], 14, 20).

%Initial Wall Number
%type,horizontal number, vertical number
wallNumber(orange,9,9).
wallNumber(yellow,9,9).

%Initial Player
currentPlayer(orange).

%target position
%targetPosition([player, target number], X,Y)
targetPosition([yellow, 1], 6, 6).
targetPosition([yellow, 2], 14, 6).
targetPosition([orange, 1], 6, 20).
targetPosition([orange, 2], 14, 20).
