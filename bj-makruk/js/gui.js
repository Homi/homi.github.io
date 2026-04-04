//BJ Makruk

var Opponent = "comp";
var computerPlay = BOOL.TRUE;
var Show = BOOL.FALSE;

var LastMove = {};
LastMove.From = SQUARES.NO_SQ;
LastMove.To = SQUARES.NO_SQ;

function ResetLastMove() {
	LastMove.From = SQUARES.NO_SQ;
	LastMove.To = SQUARES.NO_SQ;
}

function RestorePreviousLastMove() {
	ResetLastMove();
	if(brd_hisPly > 0) {
		var lastMove = brd_history[brd_hisPly - 1].move;
		if(lastMove != NOMOVE) {
			LastMove.From = FROMSQ(lastMove);
			LastMove.To = TOSQ(lastMove);
		}
	}
}

var UserMove = {};
UserMove.from = SQUARES.NO_SQ;
UserMove.to = SQUARES.NO_SQ;

function ResetUserMove() {
	UserMove.from = SQUARES.NO_SQ;
	UserMove.to = SQUARES.NO_SQ;
}

var searchDelayHandle = null;

var MirrorFiles = [ FILES.FILE_H, FILES.FILE_G, FILES.FILE_F, FILES.FILE_E, FILES.FILE_D, FILES.FILE_C, FILES.FILE_B, FILES.FILE_A ];
var MirrorRanks = [ RANKS.RANK_8, RANKS.RANK_7, RANKS.RANK_6, RANKS.RANK_5, RANKS.RANK_4, RANKS.RANK_3, RANKS.RANK_2, RANKS.RANK_1 ];

function MIRROR120(sq) {
	var file = MirrorFiles[FilesBrd[sq]];
	var rank = MirrorRanks[RanksBrd[sq]];
	return FR2SQ(file,rank);
}

function GetBoardSquareSize() {
	return $("#Board").width() / 8;
}

$("#SetFen").click(function () {

	var fenStr = $("#fenIn").val();	
	ParseFen(fenStr);
	if(brd_pceNum[PIECES.wK]==0 || brd_pceNum[PIECES.bK]==0){
		$('#fenIn').val(START_FEN);
		ParseFen(START_FEN);
	}
	PrintBoard();
	
	$('#fenIn').val(BoardToFen());	
	$("#brdHC").prop("checked",false);
	clearThinking();
	$('#moveHistory').text('');
	
	$('#EngineOutput').show();
	$('#OppSelect').show();
	$('#SetBoard').show();
	$('#SetPiece').hide();
	setupBoard = BOOL.FALSE;
	ResetLastMove();
	ResetUserMove();
	
	SetInitialBoardPieces();	
	GameController.PlayerSide = brd_side;	
	GameController.EngineSide = brd_side^1;
	CheckAndSet();	
	//PerftTest(12); 
	
});

var ROOKS_HONOUR = 16;
var CONS_HONOUR = 44;
var KNIGHT_HONOUR = 64;
var BOARDS_HONOUR = 64;

function check_honour_ruls(){
	var CurrVal;
	if(brd_pceNum[PIECES.wP] == 0 && brd_pceNum[PIECES.bP] == 0){ // No pawn ==> check honour rule
	
		CurrVal = (domUpdate_score)?domUpdate_score:EvalPosition();
		
		if(PHV_flag == BOOL.FALSE && $("#brdHC").is(":checked") == false){
			if((CurrVal < 0 && GameController.EngineSide == COLOURS.BLACK) || (CurrVal > 0 && GameController.EngineSide == COLOURS.WHITE))
				$("#brdHC").prop("checked",true); // Engine requests for board's honour rule.
		}
		
		if(brd_colPceNum[COLOURS.WHITE] == 1 || brd_colPceNum[COLOURS.BLACK] == 1){ // Bare king ==> Piece's Honour Rule
			if(PHV_flag == BOOL.FALSE){ // First time check
			
				if(brd_colPceNum[COLOURS.WHITE] > 1){ //White is superior.
					brd_HR_weak = COLOURS.BLACK;
					
					if (brd_pceNum[PIECES.wR] != 0){ 
						brd_PHV_value = ROOKS_HONOUR/brd_pceNum[PIECES.wR]; brd_HR_piece = 'R';
					}
					else if (brd_pceNum[PIECES.wC] != 0){ 
						brd_PHV_value = CONS_HONOUR/brd_pceNum[PIECES.wC]; brd_HR_piece = 'C';
					}
					else if (brd_pceNum[PIECES.wN] != 0){ 
						brd_PHV_value = KNIGHT_HONOUR/brd_pceNum[PIECES.wN]; brd_HR_piece = 'N';
					}
					else {
						brd_PHV_value = BOARDS_HONOUR; brd_HR_piece = 'M';
					}
				}
				
				if(brd_colPceNum[COLOURS.BLACK] > 1){ //Black is superior.
					brd_HR_weak = COLOURS.WHITE;
					
					if (brd_pceNum[PIECES.bR] != 0){ 
						brd_PHV_value = ROOKS_HONOUR/brd_pceNum[PIECES.bR]; brd_HR_piece = 'r';
					}
					else if (brd_pceNum[PIECES.bC] != 0){ 
						brd_PHV_value = CONS_HONOUR/brd_pceNum[PIECES.bC]; brd_HR_piece = 'c';
					}
					else if (brd_pceNum[PIECES.bN] != 0){ 
						brd_PHV_value = KNIGHT_HONOUR/brd_pceNum[PIECES.bN]; brd_HR_piece = 'n';
					}
					else {
						brd_PHV_value = BOARDS_HONOUR; brd_HR_piece = 'm';
					}
				}
				
				if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
				if($("#brdHC").is(":checked") == true) $("#brdHC").prop("checked",false);
				brd_BHV_count = 0;
				
				PHV_flag = BOOL.TRUE;	// Set flag
				brd_PHV_count = brd_colPceNum[COLOURS.WHITE] + brd_colPceNum[COLOURS.BLACK]; // Initial number
			}
			else { // Next time
				if( brd_HR_weak ==  brd_side^1) brd_PHV_count++;
				brd_HR_count = brd_PHV_count;
			}
		}
		else if($("#brdHC").is(":checked") == true && PHV_flag == BOOL.FALSE) { // Board's honour rule is requested.
			if(BHV_flag == BOOL.FALSE){ // First time check
				BHV_flag = BOOL.TRUE; // Set flag
				brd_BHV_count = 0;
				if(CurrVal > 0) {
					brd_HR_weak = COLOURS.BLACK; 
					brd_HR_piece = 'K';
				}
				else {
					brd_HR_weak = COLOURS.WHITE;
					brd_HR_piece = 'k';
				}
			}
			else { // Next time count
				if( brd_HR_weak ==  brd_side^1 ) brd_BHV_count++;
				brd_HR_count = brd_BHV_count;
			}
		}
		brd_HR_flag = BHV_flag | PHV_flag;
	}
	
}

function CheckResult() {

	if (ThreeFoldRep() >= 2) {
     $("#GameStatus").text("เกมเสมอ {เดินซ้ำ 3 ครั้ง}"); 
     return BOOL.TRUE;
    }
	
	if (DrawMaterial() == BOOL.TRUE) {
     $("#GameStatus").text("เกมเสมอ {กำลังหมากไม่พอรุกจน}"); 
     return BOOL.TRUE;
    }

	check_honour_ruls();

	if (brd_BHV_count > brd_BHV_value) {
     $("#GameStatus").text("เกมเสมอ {ครบศักดิ์กระดาน}"); 
     return BOOL.TRUE;
    }
	if (brd_PHV_count > brd_PHV_value) {
     $("#GameStatus").text("เกมเสมอ {ครบศักดิ์หมาก}"); 
     return BOOL.TRUE;
    }
   
	console.log('Checking end of game');
	
	GenerateMoves();
    var MoveNum = 0;
	var found = 0;
	for(MoveNum = brd_moveListStart[brd_ply]; MoveNum < brd_moveListStart[brd_ply + 1]; ++MoveNum) {	
       
        if ( MakeMove(brd_moveList[MoveNum]) == BOOL.FALSE)  {
            continue;
        }
        found++;
		TakeMove();
		break;
    }
    //$("#currentFenSpan").text(BoardToFen()); 

	if($("#brdHC").is(":checked"))
		$("#BHVCountSpan").text("นับศักดิ์กระดาน: " + brd_BHV_count + "/64 "); 
	else $("#BHVCountSpan").text(""); 
	if(PHV_flag == BOOL.TRUE)
		$("#PHVCountSpan").text("นับศักดิ์หมาก: " + brd_PHV_count + "/" + brd_PHV_value);
	else $("#PHVCountSpan").text(""); 
	
	if(found != 0) return BOOL.FALSE;
	
	var InCheck = SqAttacked(brd_pList[PCEINDEX(Kings[brd_side],0)], brd_side^1);
	console.log('No Move Found, incheck:' + InCheck);
	
	if(InCheck == BOOL.TRUE)	{
	    if(brd_side == COLOURS.WHITE) {
	      $("#GameStatus").text("เกมจบ {ดำรุกจน}");return BOOL.TRUE;
        } else {
	      $("#GameStatus").text("เกมจบ {ขาวรุกจน}");return BOOL.TRUE;
        }
    } else {
      $("#GameStatus").text("เกมเสมอ {อับจน}");return BOOL.TRUE;
    }	
    console.log('Returning False');
	return BOOL.FALSE;	
}

function ClickedSquare(pageX, pageY) {

	var boardOffset = $("#Board").offset();
	if(!boardOffset) return SQUARES.NO_SQ;
	console.log("Piece clicked at " + pageX + "," + pageY + " board top:" + boardOffset.top + " board left:" + boardOffset.left);
	
	var workedX = Math.floor(boardOffset.left);
	var workedY = Math.floor(boardOffset.top);
	pageX = Math.floor(pageX);
	pageY = Math.floor(pageY);
	
	var squareSize = GetBoardSquareSize() || 60;
	var file = Math.floor((pageX-workedX) / squareSize);
	var rank = 7 - Math.floor((pageY-workedY) / squareSize);
	
	if(file < FILES.FILE_A || file > FILES.FILE_H || rank < RANKS.RANK_1 || rank > RANKS.RANK_8) {
		return SQUARES.NO_SQ;
	}
	
	var sq = FR2SQ(file,rank);
	
	if(GameController.BoardFlipped == BOOL.TRUE) {
		sq = MIRROR120(sq);
	}
	
	console.log("WorkedX: " + workedX + " WorkedY:" + workedY + " File:" + file + " Rank:" + rank);
	console.log("clicked:" + PrSq(sq));	
	
	SetSqSelected(sq); // must go here before mirror
	
	return sq;
}

function SyncFenDisplay() {
	var currentFen = BoardToFen();
	$("#currentFenSpan").text(currentFen);
	$('#fenIn').val(currentFen);
}

function updateMove(){
	UpdateMaterialSignature();
}

function CheckAndSet() {

	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE; // save the game here
		
		// saveGame();
		
		computerPlay = BOOL.FALSE;
		GameController.autoMove = BOOL.FALSE;
		$("#AutoMove").text("เดินอัตโนมัติ");
		
	}
	updateMove();
	SyncFenDisplay();
	if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
	
	if(GameController.autoMove == BOOL.TRUE) 
		PreSearch(); 
}

$("#showHist").click(function(e){

	if(Show == BOOL.TRUE){
		Show = BOOL.FALSE;
		$("#showHist").text("แสดงประวัติ");
		$("#moveHistory").text(" ");
		$('#WBPGN').hide()
	} else {
		Show = BOOL.TRUE;
		$("#showHist").text("ซ่อนประวัติ");
		$("#moveHistory").text(" " + printGameLine());
		$('#WBPGN').show()
	}
});

function toCopy(text) {
    window.prompt("คัดลอกข้อความ: กด Ctrl+C แล้วกด Enter", text);
}

$('#currentFenSpan').click(function() {
    toCopy($('#currentFenSpan').text())
});

$('#moveHistory').click(function() {
    toCopy($('#moveHistory').text())
});

$('#WBPGN').click(function() {
	var fenStr = BoardToFen();	
	fenStr = fenStr.replace(/c/g, 's');
	fenStr = fenStr.replace(/C/g, 'S');
	var txt = '[Event "BJ Makruk online"]\n';
	txt = txt + '[Variant "makruk" ]\n';
	txt = txt + '[FEN \"' + fenStr + '\"]\n';
	txt = txt + '[SetUp \"1\"]\n\n';
	txt = txt + $('#moveHistory').text();
	toCopy(txt);
});

$('#WBPGN').hide();

function PreSearch() {

	if(GameController.GameOver != BOOL.TRUE && srch_thinking != BOOL.TRUE) {				
		srch_stop = BOOL.FALSE;
		srch_thinking = BOOL.TRUE;
		$('#ThinkingPng').remove();
		if(searchDelayHandle !== null) {
			clearTimeout(searchDelayHandle);
		}
		$('#ThinkingImageDiv').show().append('<img src="images/think4.png" id="ThinkingPng" alt="คอมพิวเตอร์กำลังคิด"/>');
		searchDelayHandle = setTimeout(function() {
			searchDelayHandle = null;
			StartSearch();
		}, 200);
	}
}

function MakeUserMove() {

	if(UserMove.from != SQUARES.NO_SQ && UserMove.to != SQUARES.NO_SQ) {
		console.log("User Move:" + PrSq(UserMove.from) + PrSq(UserMove.to));
		
		var parsed = ParseMove(UserMove.from,UserMove.to);
		
		DeselectSq(UserMove.from);
		DeselectSq(UserMove.to);
		
		console.log("Parsed:" + parsed);
		
		if(parsed != NOMOVE) {
			MakeMove(parsed);
			MoveGUIPiece(parsed);
			CheckAndSet();
			if(computerPlay == BOOL.TRUE) {
				PreSearch();
			}
			else { 
				GameController.PlayerSide ^= 1;
			}
		}
		UserMove.from = SQUARES.NO_SQ;
		UserMove.to = SQUARES.NO_SQ; 	
	}
}

$(document).on('click','.Piece', function (e) {	

	console.log("Piece Click");
	
	if(setupBoard == BOOL.TRUE){
		var sq = ClickedSquare(e.pageX, e.pageY);
		ClearPiece(sq);
		$("#currentFenSpan").text(BoardToFen());
		$('#fenIn').val(BoardToFen());
		
		RemoveGUIPiece(sq);
		DeselectSq(sq);
		return;
	}
	
	if(srch_thinking == BOOL.FALSE && GameController.PlayerSide == brd_side) {
		if(UserMove.from == SQUARES.NO_SQ) 
			UserMove.from = ClickedSquare(e.pageX, e.pageY);
		else 
			UserMove.to = ClickedSquare(e.pageX, e.pageY);	
		MakeUserMove();	
	}	
});

$(document).on('click','.Square', function (e) {	

	console.log("Square Click");
	
	if(setupBoard == BOOL.TRUE){
		if( selectedPiece == PIECES.EMPTY) return;
		var sq = ClickedSquare(e.pageX, e.pageY);
		if( AddPiece(sq, selectedPiece) == BOOL.TRUE){
			AddGUIPiece(sq, selectedPiece);
		}
		DeselectSq(sq);
		$("#currentFenSpan").text(BoardToFen());
		$('#fenIn').val(BoardToFen());

		return;
	}
	
	if(srch_thinking == BOOL.FALSE && GameController.PlayerSide == brd_side && UserMove.from != SQUARES.NO_SQ) {
		UserMove.to = ClickedSquare(e.pageX, e.pageY);
		MakeUserMove();
	}
});

function RemoveGUIPiece(sq) {

	if(GameController.BoardFlipped == BOOL.TRUE) {
		sq = MIRROR120(sq);
	}
	$(".Piece[data-sq='" + sq + "']").remove();
}

function AddGUIPiece(sq,pce) {	

	if(GameController.BoardFlipped == BOOL.TRUE) {
		sq = MIRROR120(sq);
	}
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	imageString = "<img src=\"" + pieceFileName + "\" alt=\"\" data-sq=\"" + sq + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\"/>";
	$("#Board").append(imageString);
}

function MoveGUIPiece(move) {

	var from = FROMSQ(move);
	var to = TOSQ(move);
	
	var flippedFrom = from;
	var flippedTo = to;
	
	if(GameController.BoardFlipped == BOOL.TRUE) {
		flippedFrom = MIRROR120(from);
		flippedTo = MIRROR120(to);
	}
	
	DeselectSq(LastMove.From);
	DeselectSq(LastMove.To);
	
	if(CAPTURED(move)) {
		RemoveGUIPiece(to);
	}
	
	var rank = RanksBrd[flippedTo];
	var file = FilesBrd[flippedTo];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);
	var $piece = $(".Piece[data-sq='" + flippedFrom + "']").first();
	if($piece.length) {
		$piece.removeClass();
		$piece.addClass("Piece clickElement " + rankName + " " + fileName);
		$piece.attr('data-sq', flippedTo);
	}

    var prom = PROMOTED(move);
    console.log("PromPce:" + prom);
    if(prom != PIECES.EMPTY) {
		console.log("prom removing from " + PrSq(flippedTo));
    	RemoveGUIPiece(to);
    	AddGUIPiece(to,prom);
    }
	
	LastMove.From = from;
	LastMove.To = to;
	
	SetSqSelected(LastMove.From );
	SetSqSelected(LastMove.To);
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
}

function DeselectSq(sq) {
	if(sq == SQUARES.NO_SQ) return;
	$(".Square[data-sq='" + sq + "']").removeClass('SqSelected');
}

function SetSqSelected(sq) {
	if(sq == SQUARES.NO_SQ) return;
	$(".Square[data-sq='" + sq + "']").addClass('SqSelected');
}

function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	$('#ThinkingPng').remove();
	$('#ThinkingImageDiv').hide();
	
	if(srch_best == NOMOVE) {
		CheckAndSet();
		return;
	}
	
	GameController.EngineSide = brd_side;
	
	// TODO MakeMove here on internal board and GUI
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	CheckAndSet();
}

$("#TakeButton").click(function () {
	
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		var takeBackCount = 1;
		if(computerPlay == BOOL.TRUE && brd_hisPly > 1) {
			takeBackCount = 2;
		}
		while(takeBackCount > 0 && brd_hisPly > 0) {
			TakeMove();
			takeBackCount--;
		}
		brd_ply = 0;
		ResetUserMove();
		RestorePreviousLastMove();
		GameController.PlayerSide = brd_side;
		GameController.EngineSide = brd_side ^ 1;
		clearThinking();
		SetInitialBoardPieces();
		SetSqSelected(LastMove.From);
		SetSqSelected(LastMove.To);
		CheckAndSet();
		GameController.GameSaved = BOOL.FALSE;
	}
});

$("#SearchButton").click(function () {	

	$("input:radio[name=opponent][value=comp]").prop("checked",true);
	Opponent = "comp";
	computerPlay = BOOL.TRUE;
	
	GameController.PlayerSide = brd_side^1;
	PreSearch();	
});

$("#FlipButton").click(function () {

	GameController.BoardFlipped ^= 1;

	console.log("Flipped:" + GameController.BoardFlipped);
	initBoardSquares();
	SetInitialBoardPieces();

	if(setupBoard != BOOL.TRUE) {
		SetSqSelected(LastMove.From);
		SetSqSelected(LastMove.To);
	}
});

function NewGame() {

	setupBoard = BOOL.FALSE;
	ResetLastMove();
	ResetUserMove();
	
	$('#fenIn').val(START_FEN);
	ParseFen(START_FEN);
	PrintBoard();		
	$("#brdHC").prop("checked",false);
	clearThinking();
	$('#moveHistory').text('');
	
	SetInitialBoardPieces();	
	GameController.PlayerSide = brd_side;	
	GameController.EngineSide = brd_side^1;
	CheckAndSet();	
	
	GameController.GameSaved = BOOL.FALSE;
}

$("#NewGameButton").click(function () {	

	NewGame();
});

$("input:radio[name=opponent]").click(function(){
    Opponent = $(this).val();
    
    if(Opponent == "comp") {
        computerPlay = BOOL.TRUE;
        GameController.PlayerSide = brd_side^1;  // Player is opposite side
        GameController.EngineSide = brd_side;    // Engine is current side
    } else {
        computerPlay = BOOL.FALSE;
        GameController.PlayerSide = brd_side;    // Player is current side
        GameController.EngineSide = brd_side^1;  // Opponent is opposite side
    }
    
    console.log("Opponent changed to: " + Opponent + ", PlayerSide: " + GameController.PlayerSide);
});

var ranksChar_en = '12345678';
var filesChar_en = 'abcdefgh';
var ranksChar_th = '๑๒๓๔๕๖๗๘';
var filesChar_th = 'กขคงจฉชญ';

var EN = 1;
var THA = 2;
var langSET = EN;

$('#lang').click(function(){
	if(langSET == EN) setTHA();
	else setEN();
});

function setTHA(){
	langSET = THA;
	$('.lang').removeClass('langEN');
	$('.lang').addClass('langTHA');
	$('.r1').text(ranksChar_th[0]); $('.r2').text(ranksChar_th[1]); $('.r3').text(ranksChar_th[2]); $('.r4').text(ranksChar_th[3]); $('.r5').text(ranksChar_th[4]); $('.r6').text(ranksChar_th[5]); $('.r7').text(ranksChar_th[6]); $('.r8').text(ranksChar_th[7]);
	$('.fa').text(filesChar_th[0]); $('.fb').text(filesChar_th[1]); $('.fc').text(filesChar_th[2]); $('.fd').text(filesChar_th[3]); $('.fe').text(filesChar_th[4]); $('.ff').text(filesChar_th[5]); $('.fg').text(filesChar_th[6]); $('.fh').text(filesChar_th[7]);
}

function setEN(){
	langSET = EN;
	$('.lang').removeClass('langTHA');
	$('.lang').addClass('langEN');
	$('.r1').text(ranksChar_en[0]); $('.r2').text(ranksChar_en[1]); $('.r3').text(ranksChar_en[2]); $('.r4').text(ranksChar_en[3]); $('.r5').text(ranksChar_en[4]); $('.r6').text(ranksChar_en[5]); $('.r7').text(ranksChar_en[6]); $('.r8').text(ranksChar_en[7]);
	$('.fa').text(filesChar_en[0]); $('.fb').text(filesChar_en[1]); $('.fc').text(filesChar_en[2]); $('.fd').text(filesChar_en[3]); $('.fe').text(filesChar_en[4]); $('.ff').text(filesChar_en[5]); $('.fg').text(filesChar_en[6]); $('.fh').text(filesChar_en[7]);
}

function initBoardSquares() {

	var light = 0;
	var rankName;
	var fileName;
	var divString;
	var lightString;
	var lastLight=0;
	var t_rank, t_file;
	var dataSq;

	$("#Board").empty();

	for(rankIter = RANKS.RANK_8; rankIter >= RANKS.RANK_1; rankIter--) {	
		light = lastLight ^ 1;
		lastLight ^= 1;
		rankName = "rank" + (rankIter + 1);	
		t_rank = (GameController.BoardFlipped==BOOL.TRUE)?(7-rankIter):rankIter;
		for(fileIter = FILES.FILE_A; fileIter <= FILES.FILE_H; fileIter++) {			
		    fileName = "file" + (fileIter + 1); 
		    if(light==0) lightString="Light";
			else lightString="Dark";
			t_file = (GameController.BoardFlipped==BOOL.TRUE)?(7-fileIter):fileIter;
			dataSq = FR2SQ(t_file, t_rank);
			if(fileIter == FILES.FILE_H && rankIter == RANKS.RANK_8) 
				divString = "<div class=\"Square clickElement " + rankName + " " + fileName + " " + lightString + "\" data-sq=\"" + dataSq + "\">" +
				"<span class=\"rankchar r" + (t_rank+1) +"\">"+( ranksChar_en[t_rank] ) + "</span>" + 
				"<span class=\"filechar f" + String.fromCharCode('a'.charCodeAt() + t_file) + "\">" + (filesChar_en[t_file]) + "</span></div>";
			else if(fileIter < FILES.FILE_H && rankIter == RANKS.RANK_8) 
				divString = "<div class=\"Square clickElement " + rankName + " " + fileName + " " + lightString + "\" data-sq=\"" + dataSq + "\">" +
				"<span class=\"filechar f" + String.fromCharCode('a'.charCodeAt() + t_file) + "\">" + (filesChar_en[t_file]) + "</span></div>";
			else if(fileIter == FILES.FILE_H && rankIter < RANKS.RANK_8){
				divString = "<div class=\"Square clickElement " + rankName + " " + fileName + " " + lightString + "\" data-sq=\"" + dataSq + "\">" +
				"<span class=\"rankchar r" + (t_rank+1) +"\">"+( ranksChar_en[t_rank] ) + "</span></div>";
			}
			else
				divString = "<div class=\"Square clickElement " + rankName + " " + fileName + " " + lightString + "\" data-sq=\"" + dataSq + "\"/>";
			light ^= 1;
			$("#Board").append(divString);
		}
	}	
	if(langSET == EN) setEN(); else setTHA(); // HACK for coordinates.

}

function ClearAllPieces() {

	$( ".Square" ).each(function( index ) {   	
     	$(this).removeClass('SqSelected');    
    })
	
	console.log("Removing pieces");
	$(".Piece").remove();
}

function SetInitialBoardPieces() {

	var sq;
	var sq120;
	var file,rank;	
	var rankName;
	var fileName;
	var imageString;
	var pieceFileName;
	var pce;
	
	ClearAllPieces();
	
	for( sq = 0; sq < 64; ++sq) {
		sq120 = SQ120(sq);
		pce = brd_pieces[sq120]; // crucial here
		if(GameController.BoardFlipped == BOOL.TRUE) {
			sq120 = MIRROR120(sq120);
		}
		file = FilesBrd[sq120];
		rank = RanksBrd[sq120];
		if(pce>=PIECES.wP && pce<=PIECES.bK) {				
			rankName = "rank" + (rank + 1);	
			fileName = "file" + (file + 1);
			pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
			imageString = "<img src=\"" + pieceFileName + "\" alt=\"\" data-sq=\"" + sq120 + "\" class=\"Piece " + rankName + " " + fileName + "\"/>";
			$("#Board").append(imageString);
		}
	}
	
	if(setupBoard == BOOL.TRUE) return;
	
	brd_BHV_count = 0;
	brd_PHV_count = 0;
	BHV_flag = BOOL.FALSE;
	PHV_flag = BOOL.FALSE;
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
	GameController.autoMove = BOOL.FALSE;
	$("#AutoMove").text("เดินอัตโนมัติ");
}

function clearThinking(){
	if(searchDelayHandle !== null) {
		clearTimeout(searchDelayHandle);
		searchDelayHandle = null;
	}
	srch_stop = BOOL.TRUE;
	srch_thinking = BOOL.FALSE;
	$('#ThinkingPng').remove();
	$('#ThinkingImageDiv').hide();
	$("#OrderingOut").text("ประสิทธิภาพการเรียง:");
	$("#DepthOut").text("ความลึก: ");
	$("#ScoreOut").text("คะแนน:");
	$("#NodesOut").text("จำนวนโหนด:");
	$("#TimeOut").text("เวลา: ");
	$("#BestOut").text("ตาเดินที่แนะนำ: ");
}

GameController.autoMove = BOOL.FALSE;

$("#AutoMove").click(function(){
	GameController.autoMove ^= 1;
	if(GameController.autoMove == BOOL.TRUE) {
		$("input:radio[name=opponent][value=comp]").prop("checked",true);
		Opponent = "comp";
		computerPlay = BOOL.TRUE;
		GameController.EngineSide = brd_side;
		GameController.PlayerSide = brd_side ^ 1;
		$("#AutoMove").text("หยุดเดินอัตโนมัติ");
		PreSearch();
	}
	else $("#AutoMove").text("เดินอัตโนมัติ");
});

/*
function saveGame(){

	var urlStr = "{$MyURL}/gamesave.php";
	var gameStatus = $("#GameStatus").text();
	var tt = $('#ThinkTimeChoice').val();
	var fenStr = $("#fenIn").val();
	var moveStr = printGameLine();
	
	//Cross-Origin Resource Sharing standard (CORS)
	$.ajax({ 
		type: 'POST',
		url: urlStr,
		crossDomain: true,
		data : { num : '04', pstart: fenStr, mlist: moveStr, result: gameStatus, t_sec:tt },
		dataType: 'json',
		success: function(responseData, textStatus, jqXHR){
			console.log( 'Game saved: ' + responseData.record );
		},
		error: function(responseData, textStatus, errorThrown){
			console.log('POST failed.');
		}
	});
}
*/

$('#SetBoard').click(function (){

	setupBoard = BOOL.TRUE;
	ResetLastMove();
	ResetUserMove();
	selectedPiece = PIECES.EMPTY;
	$('#SetPiece .SquareS, #SetPiece .PieceS').remove();
	
	$('#EngineOutput').hide();
	$('#OppSelect').hide();
	$('#SetPiece').show();
	
	ResetBoard();
	ClearAllPieces();
	brd_side = COLOURS.WHITE; 
	$("#currentFenSpan").text(BoardToFen());
	$('#fenIn').val(BoardToFen());
	
	var pce, divString, pieceFileName, imageString, lightString="Light";
	for(pce=PIECES.wP; pce<=PIECES.bK; pce++){	
		divString = "<div class=\"SquareS clickElement " + SideChar[PieceCol[pce]] + " " + PceChar[pce].toUpperCase() + " " + lightString + "\"/>";
		$("#SetPiece").append(divString);
		pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
		imageString = "<img src=\"" + pieceFileName + "\" alt=\"\" class=\"PieceS " + SideChar[PieceCol[pce]] + " " + PceChar[pce].toUpperCase() + "\"/>";
		$("#SetPiece").append(imageString);
	}
	$('#SetBoard').hide();
});

$(document).on('click','.PieceS', function (e) {	
	if(setupBoard == BOOL.TRUE){
		var pPiece = [PIECES.wK, PIECES.wR, PIECES.wC, PIECES.wN, PIECES.wM, PIECES.wP, 
					PIECES.bK, PIECES.bR, PIECES.bC, PIECES.bN, PIECES.bM, PIECES.bP]; 
		var position = $("#SetPiece").offset(); 
		var workedX = Math.floor(position.left); 
		var workedY = Math.floor(position.top);
		var PX = Math.floor(e.pageX); 
		var PY = Math.floor(e.pageY); 
		var squareSize = $("#SetPiece .SquareS").first().outerWidth() || 60;
		var file = Math.floor((PX-workedX) / squareSize); 
		var rank = Math.floor((PY-workedY) / squareSize); 
		if(file < 0 || file > 1 || rank < 0 || rank > 5) return;
		
		selectedPiece = pPiece[ rank + 6 * file]; 
		
		$( ".SquareS" ).each(function( index ) { 
				$(this).removeClass('SqSelected'); 
		}); 
		$( ".SquareS" ).each(function( index ) {    
			if( ( rank == Math.round($(this).position().top / squareSize)) && 
				( file == Math.round($(this).position().left / squareSize) ) ){   
				$(this).addClass('SqSelected'); 
			} 
		}); 
	} 
});

var aString = "<div class=\"Stm\"><input type=\"radio\" name=\"STM\" value=\"w\" checked=\"checked\">ขาว<br>";
	aString = aString +  "<input type=\"radio\" name=\"STM\" value=\"b\" >ดำ<br>";
	aString = aString + "<button type=\"button\" id=\"ClearBoard\">ล้างกระดาน</button><br><br>";
	aString = aString + "</div>";
$("#SetPiece").append(aString);
	
$('#SetPiece').hide();
var setupBoard = BOOL.FALSE;
var StmSet = "w";
var selectedPiece = PIECES.EMPTY;

$("input:radio[name=STM]").click(function(){
	StmSet = $(this).val();
	if(StmSet=="b") brd_side = COLOURS.BLACK; 
	else brd_side = COLOURS.WHITE; 
	$("#currentFenSpan").text(BoardToFen());
	$('#fenIn').val(BoardToFen());
});

$('#ClearBoard').click(function(){
	ResetLastMove();
	ResetUserMove();
	ResetBoard();
	SetInitialBoardPieces();
	$("input:radio[name=STM][value=w]").prop("checked",true);
	brd_side = COLOURS.WHITE; 
	$("#currentFenSpan").text(BoardToFen());
	$('#fenIn').val(BoardToFen());
});


