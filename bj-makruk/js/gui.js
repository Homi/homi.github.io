//BJ Makruk

var Opponent = "comp";
var computerPlay = BOOL.TRUE;
var Show = BOOL.FALSE;

var LastMove = {};
LastMove.from = SQUARES.NO_SQ;
LastMove.to = SQUARES.NO_SQ;

var UserMove = {};
UserMove.from = SQUARES.NO_SQ;
UserMove.to = SQUARES.NO_SQ;

var MirrorFiles = [ FILES.FILE_H, FILES.FILE_G, FILES.FILE_F, FILES.FILE_E, FILES.FILE_D, FILES.FILE_C, FILES.FILE_B, FILES.FILE_A ];
var MirrorRanks = [ RANKS.RANK_8, RANKS.RANK_7, RANKS.RANK_6, RANKS.RANK_5, RANKS.RANK_4, RANKS.RANK_3, RANKS.RANK_2, RANKS.RANK_1 ];

function MIRROR120(sq) {
	var file = MirrorFiles[FilesBrd[sq]];
	var rank = MirrorRanks[RanksBrd[sq]];
	return FR2SQ(file,rank);
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
				
				if(BHV_flag == BOOL.TRUE) BHV_flag == BOOL.FALSE;
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
		brd_HR_flag ^= brd_HR_flag;
		brd_HR_flag = BHV_flag | PHV_flag;
	}
	
}

function CheckResult() {

	if (ThreeFoldRep() >= 2) {
     $("#GameStatus").text("GAME DRAWN {3-fold repetition}"); 
     return BOOL.TRUE;
    }
	
	if (DrawMaterial() == BOOL.TRUE) {
     $("#GameStatus").text("GAME DRAWN {insufficient material to mate}"); 
     return BOOL.TRUE;
    }

	check_honour_ruls();

	if (brd_BHV_count > brd_BHV_value) {
     $("#GameStatus").text("GAME DRAWN {board's honour rule}"); 
     return BOOL.TRUE;
    }
	if (brd_PHV_count > brd_PHV_value) {
     $("#GameStatus").text("GAME DRAWN {piece's honour rule}"); 
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
		$("#BHVCountSpan").text("BoardHonourCount: " + brd_BHV_count + "/64 "); 
	else $("#BHVCountSpan").text(""); 
	if(PHV_flag == BOOL.TRUE)
		$("#PHVCountSpan").text("PieceHonourCount: " + brd_PHV_count + "/" + brd_PHV_value);
	else $("#PHVCountSpan").text(""); 
	
	if(found != 0) return BOOL.FALSE;
	
	var InCheck = SqAttacked(brd_pList[PCEINDEX(Kings[brd_side],0)], brd_side^1);
	console.log('No Move Found, incheck:' + InCheck);
	
	if(InCheck == BOOL.TRUE)	{
	    if(brd_side == COLOURS.WHITE) {
	      $("#GameStatus").text("GAME OVER {black mates}");return BOOL.TRUE;
        } else {
	      $("#GameStatus").text("GAME OVER {white mates}");return BOOL.TRUE;
        }
    } else {
      $("#GameStatus").text("GAME DRAWN {stalemate}");return BOOL.TRUE;
    }	
    console.log('Returning False');
	return BOOL.FALSE;	
}

function ClickedSquare(pageX, pageY) {

	var position = $("#Board").position();
	console.log("Piece clicked at " + pageX + "," + pageY + " board top:" + position.top + " board left:" + position.left);
	
	var workedX = Math.floor(position.left);
	var workedY = Math.floor(position.top);
	var pageX = Math.floor(pageX);
	var pageY = Math.floor(pageY);
	
	var file = Math.floor((pageX-workedX) / 60);
	var rank = 7 - Math.floor((pageY-workedY) / 60);
	
	var sq = FR2SQ(file,rank);
	
	if(GameController.BoardFlipped == BOOL.TRUE) {
		sq = MIRROR120(sq);
	}
	
	console.log("WorkedX: " + workedX + " WorkedY:" + workedY + " File:" + file + " Rank:" + rank);
	console.log("clicked:" + PrSq(sq));	
	
	SetSqSelected(sq); // must go here before mirror
	
	return sq;
}

function updateMove(){
	//Endgame material
	WhiteMat = 0;
	WhiteMat |= brd_pceNum[PIECES.wP]&3;
	WhiteMat |= ((brd_pceNum[PIECES.wM]&3)<<2);
	WhiteMat |= ((brd_pceNum[PIECES.wN]&3)<<4);
	WhiteMat |= ((brd_pceNum[PIECES.wC]&1)<<6);
	WhiteMat |= ((brd_pceNum[PIECES.wR]&1)<<7);
	if( brd_pceNum[PIECES.wP] > 3 || brd_pceNum[PIECES.wM] > 3 || brd_pceNum[PIECES.wN] == 2 || brd_pceNum[PIECES.wC] == 2 || brd_pceNum[PIECES.wR] > 0 ){
		WhiteMat = 0xFF;
	}
	BlackMat = 0;
	BlackMat |= brd_pceNum[PIECES.bP]&3;
	BlackMat |= ((brd_pceNum[PIECES.bM]&3)<<2);
	BlackMat |= ((brd_pceNum[PIECES.bN]&3)<<4);
	BlackMat |= ((brd_pceNum[PIECES.bC]&1)<<6);
	BlackMat |= ((brd_pceNum[PIECES.bR]&1)<<7);
	if( brd_pceNum[PIECES.bP] > 3 || brd_pceNum[PIECES.bM] > 3 || brd_pceNum[PIECES.bN] == 2 || brd_pceNum[PIECES.bC] == 2 || brd_pceNum[PIECES.bR] > 0 ){
		BlackMat = 0xFF;
	}
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
		GameController.autoMove == BOOL.FALSE;
		$("#AutoMove").text("Auto Move");
		
	}
	updateMove();
	$("#currentFenSpan").text(BoardToFen());
	if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
	
	if(GameController.autoMove == BOOL.TRUE) 
		PreSearch(); 
}

$("#showHist").click(function(e){

	if(Show == BOOL.TRUE){
		Show = BOOL.FALSE;
		$("#showHist").text("Show history");
		$("#moveHistory").text(" ");
		$('#TCViewer').hide()
		$('#WBPGN').hide()
	} else {
		Show = BOOL.TRUE;
		$("#showHist").text("Hide history");
		$("#moveHistory").text(" " + printGameLine());
		$('#TCViewer').show()
		$('#WBPGN').show()
	}
});

function toCopy(text) {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

$('#currentFenSpan').click(function() {
    toCopy($('#currentFenSpan').text())
});

$('#moveHistory').click(function() {
    toCopy($('#moveHistory').text())
});

$('#TCViewer').click(function() {
	var fenStr = $("#fenIn").val();	
	fenStr = fenStr.split(' ');
    var txt = fenStr[0].split('/');
    var i, s = '';
    for(i=7;i>=0;i--){
		txt[i]=txt[i].replace(/k/g,'S');
		txt[i]=txt[i].replace(/n/g,'L');
		txt[i]=txt[i].replace(/r/g,'I');
		txt[i]=txt[i].replace(/p/g,'D');
		txt[i]=txt[i].replace(/K/g,'k');
		txt[i]=txt[i].replace(/N/g,'n');
		txt[i]=txt[i].replace(/R/g,'r');
		txt[i]=txt[i].replace(/P/g,'p');
		txt[i]=txt[i].replace(/S/g,'K');
		txt[i]=txt[i].replace(/L/g,'N');
		txt[i]=txt[i].replace(/I/g,'R');
		txt[i]=txt[i].replace(/D/g,'P');
        txt[i]=txt[i].replace(/m/g,'Q');
        txt[i]=txt[i].replace(/M/g,'q');
        txt[i]=txt[i].replace(/c/g,'B');
        txt[i]=txt[i].replace(/C/g,'b');
        txt[i]=txt[i].replace(/1/g,'e');
        txt[i]=txt[i].replace(/2/g,'ee');
        txt[i]=txt[i].replace(/3/g,'eee');
        txt[i]=txt[i].replace(/4/,'eeee');
        txt[i]=txt[i].replace(/5/,'eeeee');
        txt[i]=txt[i].replace(/6/,'eeeeee');
        txt[i]=txt[i].replace(/7/,'eeeeeee');
        txt[i]=txt[i].replace(/8/,'eeeeeeee');
        s = s + txt[i];
    }
    var url = 'http://www.thaibg.com/TChess/viewgame.php?Tournament=BJ+Makruk+online&Place=&Time=&RoundNo=&BoardNo=&White=&Black=&Result=&StartPos='
	url = url + s;
	url = url + '&MoveList=';
	url = url + $('#moveHistory').text().replace(/\s|m/g, '');
	url = url + '&View=++++++View++++++';
	var win = window.open(url, '_blank');
	if(win){
		//Browser has allowed it to be opened
		win.focus();
	}else{
		//Browser has blocked it
		alert('Please allow popups for this site');
	}
});

$('#WBPGN').click(function() {
	var fenStr = $("#fenIn").val();	
	fenStr = fenStr.replace(/c/g, 's');
	fenStr = fenStr.replace(/C/g, 'S');
	var txt = '[Event "BJ Makruk online"]\n';
	txt = txt + '[Variant "makruk" ]\n';
	txt = txt + '[FEN \"' + fenStr + '\"]\n';
	txt = txt + '[SetUp \"1\"]\n\n';
	txt = txt + $('#moveHistory').text();
	toCopy(txt);
});

$('#TCViewer').hide();
$('#WBPGN').hide();

function PreSearch() {

	if(GameController.GameOver != BOOL.TRUE) {				
		srch_thinking = BOOL.TRUE;
		$('#ThinkingImageDiv').append('<image src="images/think4.png" id="ThinkingPng"/>')
		setTimeout( function() {StartSearch(); }, 200);
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

	$( ".Piece" ).each(function( index ) {
		 if( (RanksBrd[sq] == 7 - Math.round($(this).position().top/60)) && (FilesBrd[sq] == Math.round($(this).position().left/60)) ){		
			$(this).remove();			
		 }
		});
}

function AddGUIPiece(sq,pce) {	

	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\"/>";
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
		RemoveGUIPiece(flippedTo);
	}
	
	var rank = RanksBrd[flippedTo];
	var file = FilesBrd[flippedTo];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);
	
	$( ".Piece" ).each(function( index ) {
	 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     	$(this).removeClass();
     	$(this).addClass("Piece clickElement " + rankName + " " + fileName);     
     }
    });

    var prom = PROMOTED(move);
    console.log("PromPce:" + prom);
    if(prom != PIECES.EMPTY) {
		console.log("prom removing from " + PrSq(flippedTo));
    	RemoveGUIPiece(flippedTo);
    	AddGUIPiece(flippedTo,prom);
    }
	
	LastMove.From = from;
	LastMove.To = to;
	
	SetSqSelected(LastMove.From );
	SetSqSelected(LastMove.To);
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
}

function DeselectSq(sq) {

	if(GameController.BoardFlipped == BOOL.TRUE) {
		sq = MIRROR120(sq);
	}
	$( ".Square" ).each(function( index ) {     
	 if( (RanksBrd[sq] == 7 - Math.round($(this).position().top/60)) && (FilesBrd[sq] == Math.round($(this).position().left/60)) ){     	
     	$(this).removeClass('SqSelected');    
     }
    });
}

function SetSqSelected(sq) {

	if(GameController.BoardFlipped == BOOL.TRUE) {
		sq = MIRROR120(sq);
	}
	$( ".Square" ).each(function( index ) {    
	 if( (RanksBrd[sq] == 7 - Math.round($(this).position().top/60)) && (FilesBrd[sq] == Math.round($(this).position().left/60)) ){   
     	$(this).addClass('SqSelected');    
     }
    });
}

function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// TODO MakeMove here on internal board and GUI
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}

$("#TakeButton").click(function () {
	
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		brd_PHV_count = brd_HR_count;
		if(brd_HR_flag){
			if(brd_HR_piece == 'K')
				BHV_flag = BOOL.TRUE;
			else 
				PHV_flag = BOOL.TRUE;
		}
		$("#GameStatus").text("");
		$("#PHVCountSpan").text(""); 
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

	SetSqSelected(LastMove.From);
	SetSqSelected(LastMove.To);
});

function NewGame() {

	setupBoard = BOOL.FALSE;
	
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
			if(fileIter == FILES.FILE_H && rankIter == RANKS.RANK_8) 
				divString = "<div class=\"Square clickElement " + rankName + " " + fileName + " " + lightString + "\">" +
				"<span class=\"rankchar r" + (t_rank+1) +"\">"+( ranksChar_en[t_rank] ) + "</span>" + 
				"<span class=\"filechar f" + String.fromCharCode('a'.charCodeAt() + t_file) + "\">" + (filesChar_en[t_file]) + "</span></div>";
			else if(fileIter < FILES.FILE_H && rankIter == RANKS.RANK_8) 
				divString = "<div class=\"Square clickElement " + rankName + " " + fileName + " " + lightString + "\">" +
				"<span class=\"filechar f" + String.fromCharCode('a'.charCodeAt() + t_file) + "\">" + (filesChar_en[t_file]) + "</span></div>";
			else if(fileIter == FILES.FILE_H && rankIter < RANKS.RANK_8){
				divString = "<div class=\"Square clickElement " + rankName + " " + fileName + " " + lightString + "\">" +
				"<span class=\"rankchar r" + (t_rank+1) +"\">"+( ranksChar_en[t_rank] ) + "</span></div>";
			}
			else
				divString = "<div class=\"Square clickElement " + rankName + " " + fileName + " " + lightString + "\"/>";
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
			imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece " + rankName + " " + fileName + "\"/>";
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
	$("#AutoMove").text("Auto Move");
}

function clearThinking(){
	$("#OrderingOut").text("Ordering:");
	$("#DepthOut").text("Depth: ");
	$("#ScoreOut").text("Score:");
	$("#NodesOut").text("Nodes:");
	$("#TimeOut").text("Time: ");
	$("#BestOut").text("BestMove: ");
}

GameController.autoMove = BOOL.FALSE;

$("#AutoMove").click(function(){
	GameController.autoMove ^= 1;
	if(GameController.autoMove == BOOL.TRUE) {
		$("input:radio[name=opponent][value=comp]").prop("checked",true);
		Opponent = "comp";
		computerPlay = BOOL.TRUE;
		$("#AutoMove").text("Stop Auto Move");
		PreSearch();
	}
	else $("#AutoMove").text("Auto Move");
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
		imageString = "<image src=\"" + pieceFileName + "\" class=\"PieceS " + SideChar[PieceCol[pce]] + " " + PceChar[pce].toUpperCase() + "\"/>";
		$("#SetPiece").append(imageString);
	}
	$('#SetBoard').hide();
});

$(document).on('click','.PieceS', function (e) {	
	if(setupBoard == BOOL.TRUE){
		var pPiece = [PIECES.wK, PIECES.wR, PIECES.wC, PIECES.wN, PIECES.wM, PIECES.wP, 
					PIECES.bK, PIECES.bR, PIECES.bC, PIECES.bN, PIECES.bM, PIECES.bP]; 
		var position = $("#SetPiece").position(); 
		var workedX = Math.floor(position.left); 
		var workedY = Math.floor(position.top);
		var PX = Math.floor(e.pageX); 
		var PY = Math.floor(e.pageY); 
		var file = Math.floor((PX-workedX) / 60); 
		var rank = Math.floor((PY-workedY) / 60); 
		
		selectedPiece = pPiece[ rank + 6 * file]; 
		
		$( ".SquareS" ).each(function( index ) { 
				$(this).removeClass('SqSelected'); 
		}); 
		$( ".SquareS" ).each(function( index ) {    
			if( ( rank == $(this).position().top / 60) && 
				( file == $(this).position().left /60) ){   
				$(this).addClass('SqSelected'); 
			} 
		}); 
	} 
});

var aString = "<div class=\"Stm\"><input type=\"radio\" name=\"STM\" value=\"w\" checked=\"yes\">White<br>";
	aString = aString +  "<input type=\"radio\" name=\"STM\" value=\"b\" >Black<br>";
	aString = aString + "<button type=\"button\" id=\"ClearBoard\">Clear board</button><br><br>";
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
	ResetBoard();
	SetInitialBoardPieces();
	$("input:radio[name=STM][value=w]").prop("checked",true);
	brd_side = COLOURS.WHITE; 
	$("#currentFenSpan").text(BoardToFen());
	$('#fenIn').val(BoardToFen());
});


