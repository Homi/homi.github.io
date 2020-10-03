/*
 BJ Makruk 
 Base on JS Chess 2.1 (http://www.bluefever.net/Chess/index.html)
 
 Boonhome Bamroongpakdee
 boonhome.b@gmail.com
 
 Changed log
 
 14 AUG 2014
 - Launched version 0.10 base on JS Chess 2.1
 - Replaced pieces:  Queen (Q) with Med (M), Bishop (B) with Con (C)
 - Change: Pawn's start position, promotion ranks, promoted piece is always Queen.
 - Change: piece value, piece-position value and victim scores
 - Removed: en passant, castling, pawn's double move, fifty moves counting
 - First time uploaded
 
 24 AUG 2014
 - Version 0.11
 - Add: board honour rule, piece honour rule
 - Add: show coordinates, show history moves, last move highlight
 - Add option to select opponent as computer or not. It is helpful for book creation. 
 - Update BookXML
 
 4 SEPT 2014
 - Version 0.12
 - Tuned piece value
 - Improved honour rules
 
 15 SEPT 2014
 - Version 0.13
 - Tuned piece value 
 - Improved evaluation
 - Add Auto Move 
 - Fixed some bug
 
 20 SEPT 2014
 - Version 0.14
 - Enhanced evaluation function with some known endgame
 - Fixed some bug
 
 10 OCT 2014
 - Version 0.15
 - Fixed bug
 - Add link to Thaibg's Thai Chess Viewer 
 - Add button for PGN to replay in Winboard
 - Changed FEN def., 3.section is used for Honour Rule's flag and 5.section for counting  
 
 28 OCT 2014
 - Version 0.16
 - Fixed bug
 - Add Set Board
 
 9 NOV 2014
 - Version 0.17
 - Fixed bug
 - Add Thai letter for coordinate
 - Add background texture
 - Add EvalMobility
 
*/

$(document).ajaxComplete(function() {
  	
  	
});

$(function() {
	init();
	//$('#fenIn').val(START_FEN);
	NewGame();
	/*
	newGameAjax();
	*/
	$.ajax({
		url : "BookXML.xml",
		cache : false,
		dataType: "xml",
		success: function (xml) {				
			console.log("Read success");
			$(xml).find('line').each(function() {	
				var trimmed = $(this).text();
				trimmed = $.trim(trimmed);						
				brd_bookLines.push(trimmed);
			});
			GameController.BookLoaded = BOOL.TRUE;
			$('#LoadingBook').remove();
			console.log("Book length: " + brd_bookLines.length + " entries");
			for(var i = 0; i <brd_bookLines.length; ++i) {
			//	console.log('Array: ' + brd_bookLines[i]);
			}
		}
	});
	
});

function InitBoardVars() {
	var index = 0;
	for(index = 0; index < MAXGAMEMOVES; index++) {
		brd_history.push({
			move : NOMOVE,
			posKey : 0
		}); 
	}
	for(index = 0; index < PVENTRIES; index++) {
		brd_PvTable.push({
			move : NOMOVE,
			posKey : 0
		}); 
	}
}

function EvalInit() {
	var index = 0;
	for(index = 0; index < 10; ++index) {				
		PawnRanksWhite[index] = 0;		 	
		PawnRanksBlack[index] = 0;
	}
}

function InitHashKeys() {
    var index = 0;
	for(index = 0; index < 13 * 120; ++index) {				
		PieceKeys[index] = RAND_32();
	}
	SideKey = RAND_32();
}

function InitSq120To64() {
	var index = 0;
	var file = FILES.FILE_A;
	var rank = RANKS.RANK_1;
	var sq = SQUARES.A1;
	var sq64 = 0;
	for(index = 0; index < BRD_SQ_NUM; ++index) {
		Sq120ToSq64[index] = 65;
	}
	for(index = 0; index < 64; ++index) {
		Sq64ToSq120[index] = 120;
	}
	for(rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {
		for(file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
			sq = FR2SQ(file,rank);
			Sq64ToSq120[sq64] = sq;
			Sq120ToSq64[sq] = sq64;
			sq64++;
		}
	}
}

function InitFilesRanksBrd() {
	var index = 0;
	var file = FILES.FILE_A;
	var rank = RANKS.RANK_1;
	var sq = SQUARES.A1;
	var sq64 = 0;
	for(index = 0; index < BRD_SQ_NUM; ++index) {
		FilesBrd[index] = SQUARES.OFFBOARD;
		RanksBrd[index] = SQUARES.OFFBOARD;
	}
	for(rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {
		for(file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
			sq = FR2SQ(file,rank);
			FilesBrd[sq] = file;
			RanksBrd[sq] = rank;
		}
	}
}

function init() {	
	InitFilesRanksBrd();
	InitSq120To64();
	InitHashKeys();
	InitBoardVars();
	InitMvvLva();
	initBoardSquares();
	EvalInit();
	srch_thinking = BOOL.FALSE;
}

