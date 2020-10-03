//BJ Makruk

function ClearPiece(sq) {	
	
    var pce = brd_pieces[sq];	
	var col = PieceCol[pce];
	var index = 0;
	var t_pceNum = -1;
    HASH_PCE(pce,sq);
	brd_pieces[sq] = PIECES.EMPTY;
    brd_material[col] -= PieceVal[pce];
	brd_colPceNum[col]--;
	for(index = 0; index < brd_pceNum[pce]; ++index) {
		if(brd_pList[PCEINDEX(pce,index)] == sq) {
			t_pceNum = index;
			break;
		}
	}
	brd_pceNum[pce]--;		
	brd_pList[PCEINDEX(pce,t_pceNum)] = brd_pList[PCEINDEX(pce,brd_pceNum[pce])];
}

function AddPiece(sq, pce) {   
	
	var col = PieceCol[pce];

	if( pce == PIECES.wK ){
		if(brd_pceNum[pce] == 1) return BOOL.FALSE;
		if(brd_pieces[sq+ 1] == PIECES.bK) return BOOL.FALSE;
		if(brd_pieces[sq- 1] == PIECES.bK) return BOOL.FALSE;
		if(brd_pieces[sq+10] == PIECES.bK) return BOOL.FALSE;
		if(brd_pieces[sq-10] == PIECES.bK) return BOOL.FALSE;
		if(brd_pieces[sq+ 9] == PIECES.bK) return BOOL.FALSE;
		if(brd_pieces[sq- 9] == PIECES.bK) return BOOL.FALSE;
		if(brd_pieces[sq+11] == PIECES.bK) return BOOL.FALSE;
		if(brd_pieces[sq-11] == PIECES.bK) return BOOL.FALSE;
	}
	if( pce == PIECES.bK ){
		if(brd_pceNum[pce] == 1) return BOOL.FALSE;
		if(brd_pieces[sq+ 1] == PIECES.wK) return BOOL.FALSE;
		if(brd_pieces[sq- 1] == PIECES.wK) return BOOL.FALSE;
		if(brd_pieces[sq+10] == PIECES.wK) return BOOL.FALSE;
		if(brd_pieces[sq-10] == PIECES.wK) return BOOL.FALSE;
		if(brd_pieces[sq+ 9] == PIECES.wK) return BOOL.FALSE;
		if(brd_pieces[sq- 9] == PIECES.wK) return BOOL.FALSE;
		if(brd_pieces[sq+11] == PIECES.wK) return BOOL.FALSE;
		if(brd_pieces[sq-11] == PIECES.wK) return BOOL.FALSE;
	}
	if( PieceRook[pce] == BOOL.TRUE &&  brd_pceNum[pce] == 2) return BOOL.FALSE;
	if( PieceCon[pce] == BOOL.TRUE &&  brd_pceNum[pce] == 2) return BOOL.FALSE;
	if( PieceKnight[pce] == BOOL.TRUE &&  brd_pceNum[pce] == 2) return BOOL.FALSE;
	if( pce == PIECES.wP && (RanksBrd[sq] < 2 || RanksBrd[sq] > 4 || brd_pceNum[pce] == 8)) return BOOL.FALSE;
	if( pce == PIECES.bP && (RanksBrd[sq] < 3 || RanksBrd[sq] > 5 || brd_pceNum[pce] == 8)) return BOOL.FALSE;
	if( pce == PIECES.wM || pce == PIECES.wP)
		if(brd_pceNum[PIECES.wM] + brd_pceNum[PIECES.wP] == 9) return BOOL.FALSE;
	if( pce == PIECES.bM || pce == PIECES.bP)
		if(brd_pceNum[PIECES.bM] + brd_pceNum[PIECES.bP] == 9) return BOOL.FALSE;
	
    HASH_PCE(pce,sq);
	brd_pieces[sq] = pce;  	
	brd_material[col] += PieceVal[pce];
	brd_colPceNum[col]++;
	brd_pList[PCEINDEX(pce,brd_pceNum[pce])] = sq;
	brd_pceNum[pce]++;
	return BOOL.TRUE;
}

function MovePiece(from, to) {   
	
	var index = 0;
	var pce = brd_pieces[from];	
	var col = PieceCol[pce];	
	HASH_PCE(pce,from);
	brd_pieces[from] = PIECES.EMPTY;
	HASH_PCE(pce,to);
	brd_pieces[to] = pce;	
	for(index = 0; index < brd_pceNum[pce]; ++index) {
		if(brd_pList[PCEINDEX(pce,index)] == from) {
			brd_pList[PCEINDEX(pce,index)] = to;
			break;
		}
	}
}

function MakeMove(move) {
	
	var from = FROMSQ(move);
    var to = TOSQ(move);
    var side = brd_side;	
	brd_history[brd_hisPly].posKey = brd_posKey;
	brd_history[brd_hisPly].move = move;
	
	brd_history[brd_hisPly].brd_HR_flag = brd_HR_flag;
	brd_history[brd_hisPly].brd_HR_weak = brd_HR_weak;
	brd_history[brd_hisPly].brd_HR_piece = brd_HR_piece;
	brd_history[brd_hisPly].brd_HR_count = brd_HR_count;

	var captured = CAPTURED(move);
	if(captured != PIECES.EMPTY) {
        ClearPiece(to);
    }
	brd_hisPly++;
	brd_ply++;
	MovePiece(from, to);
	
	var prPce = PROMOTED(move);
    if(prPce != PIECES.EMPTY)   {       
        ClearPiece(to);
        AddPiece(to, prPce);
    }
	
	brd_side ^= 1;
    HASH_SIDE();
	if(SqAttacked(brd_pList[PCEINDEX(Kings[side],0)], brd_side))  {
        TakeMove();
        return BOOL.FALSE;
    }
	return BOOL.TRUE;	
}

function TakeMove() {		
	
	brd_hisPly--;
    brd_ply--;
    var move = brd_history[brd_hisPly].move;
    var from = FROMSQ(move);
    var to = TOSQ(move);	

	brd_HR_flag = brd_history[brd_hisPly].brd_HR_flag;
	brd_HR_weak = brd_history[brd_hisPly].brd_HR_weak;
	brd_HR_piece = brd_history[brd_hisPly].brd_HR_piece;
	brd_HR_count = brd_history[brd_hisPly].brd_HR_count;
	
    brd_side ^= 1;
    HASH_SIDE();
	MovePiece(to, from);
	var captured = CAPTURED(move);
    if(captured != PIECES.EMPTY) {      
        AddPiece(to, captured);
    }
	if(PROMOTED(move) != PIECES.EMPTY)   {        
        ClearPiece(from);
        AddPiece(from, (PieceCol[PROMOTED(move)] == COLOURS.WHITE ? PIECES.wP : PIECES.bP));
    }
}

