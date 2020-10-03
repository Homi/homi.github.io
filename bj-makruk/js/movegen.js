//BJ Makruk

//".PNCRMKpncrmk"
var VictimScore = [ 0, 100, 400, 300, 500, 200, 600, 100, 400, 300, 500, 200, 600 ];
var MvvLvaScores = new Array(14 * 14);

function InitMvvLva() {

	var Attacker;
	var Victim;
	for(Attacker = PIECES.wP; Attacker <= PIECES.bK; ++Attacker) {
		for(Victim = PIECES.wP; Victim <= PIECES.bK; ++Victim) {
			MvvLvaScores[Victim * 14 + Attacker] = VictimScore[Victim] + 6 - ( VictimScore[Attacker] / 100);
		}
	}		
}


function MOVE(from,to,captured,promoted,flag) {

	return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
}

function MoveExists(move) {

	GenerateMoves();
	var index;
	var moveFound = NOMOVE;
	for(index = brd_moveListStart[brd_ply]; index < brd_moveListStart[brd_ply + 1]; ++index) {
		moveFound = brd_moveList[index];	
		if(MakeMove(moveFound) == BOOL.FALSE) {
			continue;
		}				
		TakeMove();
		if(move == moveFound) {
			return BOOL.TRUE;
		}
	}
	return BOOL.FALSE;
}

function AddCaptureMove(move) {

	brd_moveList[brd_moveListStart[brd_ply + 1]] = move;
	brd_moveScores[brd_moveListStart[brd_ply + 1]++] = MvvLvaScores[CAPTURED(move) * 14 + brd_pieces[FROMSQ(move)]] + 1000000;	
}

function AddQuietMove(move) {

	brd_moveList[brd_moveListStart[brd_ply + 1]] = move;
	if(brd_searchKillers[brd_ply] == move) {	
		brd_moveScores[brd_moveListStart[brd_ply + 1]] = 900000;
	} else if(brd_searchKillers[MAXDEPTH + brd_ply] == move) {	
		brd_moveScores[brd_moveListStart[brd_ply + 1]] = 800000;
	} else {	
		brd_moveScores[brd_moveListStart[brd_ply + 1]] = brd_searchHistory[ brd_pieces[FROMSQ(move)] * BRD_SQ_NUM + TOSQ(move) ];
	}
	brd_moveListStart[brd_ply + 1]++;	
}

function AddWhitePawnCaptureMove(from, to, cap) {

	if(RanksBrd[from]==RANKS.RANK_5) {
		AddCaptureMove(MOVE(from,to,cap,PIECES.wM,0));
	} else {
		AddCaptureMove(MOVE(from,to,cap,PIECES.EMPTY,0));	
	}
}

function AddWhitePawnQuietMove(from, to) {

	if(RanksBrd[from]==RANKS.RANK_5) {
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.wM,0));
	} else {
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.EMPTY,0));	
	}
}

function AddBlackPawnCaptureMove(from, to, cap) {

	if(RanksBrd[from]==RANKS.RANK_4) {
		AddCaptureMove(MOVE(from,to,cap,PIECES.bM,0));
	} else {
		AddCaptureMove(MOVE(from,to,cap,PIECES.EMPTY,0));	
	}
}

function AddBlackPawnQuietMove(from, to) {

	if(RanksBrd[from]==RANKS.RANK_4) {
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.bM,0));
	} else {
		AddQuietMove(MOVE(from,to,PIECES.EMPTY,PIECES.EMPTY,0));	
	}
}

function GenerateMoves() {

	var pceType;
	var pceNum;
	var pceIndex;
	var pce;
	var sq;
	var tsq;
	var index;
	brd_moveListStart[brd_ply + 1] = brd_moveListStart[brd_ply];
	if(brd_side == COLOURS.WHITE) {
		pceType = PIECES.wP;
		for(pceNum = 0; pceNum < brd_pceNum[pceType]; ++pceNum) {
			sq = brd_pList[PCEINDEX(pceType,pceNum)];
			if(brd_pieces[sq + 10] == PIECES.EMPTY) {
				AddWhitePawnQuietMove(sq, sq+10);
			} 
			
			if(SQOFFBOARD(sq + 9) == BOOL.FALSE && PieceCol[brd_pieces[sq + 9]] == COLOURS.BLACK) {
				AddWhitePawnCaptureMove(sq, sq+9, brd_pieces[sq + 9]);
			}  
			if(SQOFFBOARD(sq + 11) == BOOL.FALSE && PieceCol[brd_pieces[sq + 11]] == COLOURS.BLACK) {
				AddWhitePawnCaptureMove(sq, sq+11, brd_pieces[sq + 11]);
			} 
		}
		pceType = PIECES.wN; // HACK to set for loop other pieces
	} else {
		pceType = PIECES.bP;
		for(pceNum = 0; pceNum < brd_pceNum[pceType]; ++pceNum) {
			sq = brd_pList[PCEINDEX(pceType,pceNum)];			
			
			if(brd_pieces[sq - 10] == PIECES.EMPTY) {
				AddBlackPawnQuietMove(sq, sq-10);
			} 
			
			if(SQOFFBOARD(sq - 9) == BOOL.FALSE && PieceCol[brd_pieces[sq - 9]] == COLOURS.WHITE) {
				AddBlackPawnCaptureMove(sq, sq-9, brd_pieces[sq - 9]);
			} 
			
			if(SQOFFBOARD(sq - 11) == BOOL.FALSE && PieceCol[brd_pieces[sq - 11]] == COLOURS.WHITE) {
				AddBlackPawnCaptureMove(sq, sq-11, brd_pieces[sq - 11]);
			} 
		}
		pceType = PIECES.bN; // HACK to set for loop other pieces
	} 
	pceIndex = LoopSlideIndex[brd_side];
	pce = LoopSlidePce[pceIndex++];
	while( pce != 0) {			
		for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
			sq = brd_pList[PCEINDEX(pce,pceNum)];
			
			for(index = 0; index < DirNum[pce]; ++index) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;
				while(SQOFFBOARD(t_sq)==BOOL.FALSE) {				
					if(brd_pieces[t_sq] != PIECES.EMPTY) {
						if( PieceCol[brd_pieces[t_sq]] == brd_side ^ 1) {
							AddCaptureMove(MOVE(sq, t_sq, brd_pieces[t_sq], PIECES.EMPTY, 0));
						}
						break;
					}	
					AddQuietMove(MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0));
					t_sq += dir;
				}
			}
		}		
		pce = LoopSlidePce[pceIndex++];
	}
	pceIndex = LoopNonSlideIndex[brd_side];
	pce = LoopNonSlidePce[pceIndex++];
	while( pce != 0) {	
		for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
			sq = brd_pList[PCEINDEX(pce,pceNum)];			
			for(index = 0; index < DirNum[pce]; ++index) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;
				if(SQOFFBOARD(t_sq) == BOOL.TRUE) {				    
					continue;
				}				
				if(brd_pieces[t_sq] != PIECES.EMPTY) {
					if( PieceCol[brd_pieces[t_sq]] == brd_side ^ 1) {
						AddCaptureMove(MOVE(sq, t_sq, brd_pieces[t_sq], PIECES.EMPTY, 0));
					}
					continue;
				}	
				AddQuietMove(MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0));
			}
		}				
		pce = LoopNonSlidePce[pceIndex++];
	}
}

function GenerateCaptures() {
	
	var pceType;
	var pceNum;
	var pceIndex;
	var pce;
	var sq;
	var tsq;
	var index;
	brd_moveListStart[brd_ply + 1] = brd_moveListStart[brd_ply];
	if(brd_side == COLOURS.WHITE) {
		pceType = PIECES.wP;
		for(pceNum = 0; pceNum < brd_pceNum[pceType]; ++pceNum) {
			sq = brd_pList[PCEINDEX(pceType,pceNum)];			
			
			if(SQOFFBOARD(sq + 9) == BOOL.FALSE && PieceCol[brd_pieces[sq + 9]] == COLOURS.BLACK) {
				AddWhitePawnCaptureMove(sq, sq+9, brd_pieces[sq + 9]);
			}  
			if(SQOFFBOARD(sq + 11) == BOOL.FALSE && PieceCol[brd_pieces[sq + 11]] == COLOURS.BLACK) {
				AddWhitePawnCaptureMove(sq, sq+11, brd_pieces[sq + 11]);
			} 
		}
		pceType = PIECES.wN; // HACK to set for loop other pieces
	} else {
		pceType = PIECES.bP;
		for(pceNum = 0; pceNum < brd_pceNum[pceType]; ++pceNum) {
			sq = brd_pList[PCEINDEX(pceType,pceNum)];				
			if(SQOFFBOARD(sq - 9) == BOOL.FALSE && PieceCol[brd_pieces[sq - 9]] == COLOURS.WHITE) {
				AddBlackPawnCaptureMove(sq, sq-9, brd_pieces[sq - 9]);
			} 
			if(SQOFFBOARD(sq - 11) == BOOL.FALSE && PieceCol[brd_pieces[sq - 11]] == COLOURS.WHITE) {
				AddBlackPawnCaptureMove(sq, sq-11, brd_pieces[sq - 11]);
			} 
		}
		pceType = PIECES.bN; // HACK to set for loop other pieces
	} 
	pceIndex = LoopSlideIndex[brd_side];
	pce = LoopSlidePce[pceIndex++];
	while( pce != 0) {			
		for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
			sq = brd_pList[PCEINDEX(pce,pceNum)];
			for(index = 0; index < DirNum[pce]; ++index) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;
				while(SQOFFBOARD(t_sq)==BOOL.FALSE) {				
					if(brd_pieces[t_sq] != PIECES.EMPTY) {
						if( PieceCol[brd_pieces[t_sq]] == brd_side ^ 1) {
							AddCaptureMove(MOVE(sq, t_sq, brd_pieces[t_sq], PIECES.EMPTY, 0));
						}
						break;
					}
					t_sq += dir;
				}
			}
		}		
		pce = LoopSlidePce[pceIndex++];
	}
	pceIndex = LoopNonSlideIndex[brd_side];
	pce = LoopNonSlidePce[pceIndex++];
	while( pce != 0) {	
		for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
			sq = brd_pList[PCEINDEX(pce,pceNum)];			
			for(index = 0; index < DirNum[pce]; ++index) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;
				if(SQOFFBOARD(t_sq) == BOOL.TRUE) {				    
					continue;
				}				
				if(brd_pieces[t_sq] != PIECES.EMPTY) {
					if( PieceCol[brd_pieces[t_sq]] == brd_side ^ 1) {
						AddCaptureMove(MOVE(sq, t_sq, brd_pieces[t_sq], PIECES.EMPTY, 0));
					}
					continue;
				}	
			}
		}				
		pce = LoopNonSlidePce[pceIndex++];
	}
}

