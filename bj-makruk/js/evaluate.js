//BJ Makruk

var RookOpenFile = 10;
var RookSemiOpenFile = 5;
var RookSightKing = 8;

var PawnRanksWhite = new Array(10);
var PawnRanksBlack = new Array(10);

var PawnIsolated = -10;
var PawnPassed = [ 0, 0, 10, 30, 60, 100, 0, 0 ]; 

var backCon = -30;

var PawnTable = [
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	,
3	,	5	,	0	,	0	,	0	,	-5	,	5	,	3	,
5	,	10	,	15	,	15	,	15	,	15	,	10	,	5	,
10	,	10	,	20	,	30	,	30	,	20	,	10	,	10	,
10	,	10	,	20	,	30	,	30	,	20	,	10	,	10	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0	
];

var KnightTable = [
0	,	-10	,	0	,	0	,	0	,	0	,	-10	,	0	,
0	,	0	,	0	,	10	,	10	,	0	,	0	,	0	,
0	,	0	,	10	,	10	,	10	,	10	,	0	,	0	,
0	,	0	,	10	,	20	,	20	,	10	,	5	,	0	,
5	,	10	,	15	,	20	,	20	,	15	,	10	,	5	,
5	,	10	,	10	,	20	,	20	,	10	,	10	,	5	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	0	,	0	,	0	,	0	,	0	,	0		
];

var ConTable = [
-20	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-20	,
-10	,	0	,	10	,	10	,	10	,	10	,	0	,	-10	,
-10	,	5	,	10	,	15	,	15	,	10	,	5	,	-10	,
-10	,	10	,	15	,	20	,	20	,	15	,	10	,	-10	,
-10	,	10	,	15	,	20	,	20	,	15	,	10	,	-10	,
-10	,	5	,	10	,	15	,	15	,	10	,	5	,	-10	,
-10	,	0	,	10	,	10	,	10	,	10	,	0	,	-10	,
-20	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-20	
];

var MedTable = [
-20	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-20	,
-10	,	5	,	10	,	10	,	10	,	10	,	5	,	-10	,
-5	,	10	,	20	,	20	,	20	,	20	,	10	,	-5	,
-5	,	10	,	20	,	30	,	30	,	20	,	10	,	-5	,
-5	,	10	,	20	,	30	,	30	,	20	,	10	,	-5	,
0	,	10	,	20	,	20	,	20	,	20	,	10	,	0	,
-10	,	5	,	10	,	10	,	10	,	10	,	5	,	-10	,
-20	,	-10	,	-10	,	-10	,	-10	,	-10	,	-10	,	-20	
];

var RookTable = [
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0	,
25	,	25	,	25	,	25	,	25	,	25	,	25	,	25	,
0	,	0	,	5	,	10	,	10	,	5	,	0	,	0		
];

var KingE = [	
	-50	,	-10	,	0	,	0	,	0	,	0	,	-10	,	-50	,
	-10	,	0	,	10	,	10	,	10	,	10	,	0	,	-10	,
	0	,	10	,	55	,	20	,	20	,	55	,	10	,	0	,
	0	,	10	,	20	,	25	,	25	,	20	,	10	,	0	,
	0	,	10	,	20	,	25	,	25	,	20	,	10	,	0	,
	0	,	10	,	55	,	20	,	20	,	55	,	10	,	0	,
	-10,	0	,	10	,	10	,	10	,	10	,	0	,	-10	,
	-50	,	-10	,	0	,	0	,	0	,	0	,	-10	,	-50	
];

var KingE2 = [	
	-50	,	-10	,	0	,	0	,	0	,	0	,	-10	,	-50	,
	-10	,	0	,	30	,	10	,	10	,	30	,	0	,	-10	,
	0	,	30	,	0	,	10	,	10	,	0	,	30	,	0	,
	0	,	10	,	20	,	0	,	0	,	20	,	10	,	0	,
	0	,	10	,	20	,	0	,	0	,	20	,	10	,	0	,
	0	,	30	,	0	,	10	,	10	,	0	,	30	,	0	,
	-10,	0	,	30	,	10	,	10	,	30	,	0	,	-10	,
	-50	,	-10	,	0	,	0	,	0	,	0	,	-10	,	-50	
];

var KingKRK = [
	-45,	-38,	-30,	-28,	-28,	-30,	-38,	-45,
	-38,	-28,	-20,	-18,	-18,	-20,	-28,	-38,  
	-30,	-22,	-15,	-10,	-10,	-15,	-22,	-30, 
	-28,	-18,	-10,	 00,	 00,	-10,	-18,	-28,  
	-28,	-18,	-10,	 00,	 00,	-10,	-18,	-28,  
	-30,	-22,	-15,	-10,	-10,	-15,	-22,	-30,  
	-38,	-28,	-20,	-18,	-18,	-20,	-28,	-38, 
	-45,	-38,	-30,	-28,	-28,	-30,	-38,	-45
];

var KingO = [	
	-10	,	0	,	0	,	-10	,	-10	,	0	,	0	,	-10	,
	-30	,	0	,	3	,	5	,	5	,	3	,	0	,	-30	,
	-50	,	-50	,	-50	,	-50	,	-50	,	-50	,	-50	,	-50	,
	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,
	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,
	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,
	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,
	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70	,	-70		
];

var LoneKingDark = [
	100	,	80	,	60	,	40	,	20	,	10	,	0	,	-10	,	 
	80	,	100	,	80	,	60	,	40	,	20	,	20	,	0	,	
	60	,	80	,	120	,	100	,	80	,	60	,	20	,	10	,	
	40	,	60	,	100	,	150	,	120	,	80	,	40	,	20	,	
	20	,	40	,	80	,	120	,	150	,	100	,	60	,	40	,	
	10	,	20	,	60	,	80	,	100	,	120	,	80	,	60	,	
	0	,	10	,	20	,	40	,	60	,	80	,	100	,	80	,	
	-10	,	0	,	10	,	20	,	40	,	60	,	80	,	100
];

var LoneKingLight = [
	-10	,	0	,	10	,	20	,	40	,	60	,	80	,	100	,	
	0	,	10	,	20	,	40	,	60	,	80	,	100	,	80	,	
	10	,	20	,	60	,	80	,	100	,	120	,	80	,	60	,	
	20	,	40	,	80	,	120	,	150	,	100	,	60	,	40	,	
	40	,	60	,	100	,	150	,	120	,	80	,	40	,	20	,	
	60	,	80	,	120	,	100	,	80	,	60	,	20	,	10	,	
	80	,	100	,	80	,	60	,	40	,	20	,	10	,	0	,	
	100	,	80	,	60	,	40	,	20	,	10	,	0	,	-10
];

var LoneKingCon = [
	-10	,	0	,	40	,	80	,	80	,	40	,	0	,	-10	,	
	0	,	5	,	30	,	70	,	70	,	30	,	5	,	0	,	
	0	,	10	,	20	,	60	,	60	,	20	,	10	,	0	,	
	10	,	5	,	10	,	50	,	50	,	10	,	5	,	10	,	
	-10	,	0	,	20	,	50	,	50	,	20	,	0	,	-10	,	
	-20	,	-5	,	40	,	50	,	50	,	40	,	-5	,	-20,	
	-30	,	-10	,	30	,	50	,	50	,	30	,	-10	,	-30	,	
	-40	,	-20	,	20	,	40	,	40	,	20	,	-20	,	-40
];

var MedE = [
	-20	,	-6	,	20	,	18	,	18	,	80	,	-6	,	-20	,	
	-8 	,	20 	,	18 	,	6 	,	6 	,	18 	,	20 	,	-8	,	
	20	,	18 	,	10	,	10	,	10	,	10	,	18 	,	80	,	
	18 	,	6 	,	12	,	10	,	12	,	8 	,	6 	,	18	,	
	18 	,	4 	,	6 	,	12	,	8 	,	12	,	4 	,	18	,	
	80 	,	18 	,	4 	,	6 	,	10	,	4 	,	18 	,	20	,	
	-8 	,	20 	,	18 	,	4 	,	4 	,	18 	,	20 	,	-8	,	
	-20	,	-8	,	80	,	18	,	18	,	20	,	-8	,	-20
];

var KCorner = [
	1	,	1	,	1	,	1	,	0	,	0	,	0	,	0 	,	
	1 	,	1 	,	1 	,	1 	,	0 	,	0 	,	0 	,	0	,	
	1	,	1 	,	1	,	1	,	0	,	0	,	0 	,	0	,	
	1 	,	1 	,	1	,	1	,	0	,	0 	,	0 	,	0	,	
	0 	,	0 	,	0 	,	0	,	1 	,	1	,	1 	,	1	,	
	0 	,	0 	,	0 	,	0 	,	1	,	1 	,	1 	,	1	,	
	0 	,	0 	,	0 	,	0 	,	1 	,	1 	,	1 	,	1	,	
	0	,	0	,	0	,	0	,	1	,	1	,	1	,	1
];

var MedDark = [
	-20	,	0	,	30	,	0	,	0	,	30	,	0	,	-20	,	
	0 	,	35 	,	0 	,	25 	,	25 	,	0 	,	35 	,	0	,	
	30	,	0 	,	-5	,	10	,	10	,	-5	,	0 	,	30	,	
	0 	,	25 	,	10	,	10	,	10	,	10 	,	25 	,	0	,	
	0 	,	25 	,	10 	,	10	,	10 	,	10	,	25 	,	0	,	
	30 	,	0 	,	-5	,	10 	,	10	,	-5	,	0 	,	30	,	
	0 	,	35 	,	0 	,	25 	,	25 	,	0 	,	35 	,	0	,	
	-20	,	0	,	30	,	0	,	0	,	30	,	0	,	-20
];

var MedLight = [
	-20	,	0	,	0	,	0	,	0	,	0	,	0	,	-20	,	
	0 	,	10 	,	15 	,	20 	,	20 	,	15 	,	10 	,	0	,	
	0	,	15 	,	10	,	20	,	20	,	20	,	15 	,	0	,	
	0 	,	20 	,	20	,	20	,	20	,	20 	,	20 	,	0	,	
	0 	,	20 	,	20 	,	20	,	20 	,	20	,	20 	,	0	,	
	0 	,	15 	,	10 	,	20 	,	20	,	20 	,	15 	,	0	,	
	0 	,	10 	,	15 	,	20 	,	20 	,	15 	,	10 	,	0	,	
	0	,	0	,	0	,	0	,	0	,	0	,	0	,	-20
];


var BlackMat = 0;
var WhiteMat = 0;

var ENDGAME_MAT = 1 * PieceVal[PIECES.wR] + 2 * PieceVal[PIECES.wN] + 2 * PieceVal[PIECES.wP] + PieceVal[PIECES.wK];

function MaterialDraw() {

    if( 0 == brd_pceNum[PIECES.wR] && 0 == brd_pceNum[PIECES.bR] ){
		if( 0 == brd_pceNum[PIECES.wC] && 0 == brd_pceNum[PIECES.bC] ){
			if( 0 == brd_pceNum[PIECES.wM] && 0 == brd_pceNum[PIECES.bM] ){
				if( 0 == brd_pceNum[PIECES.wP] && 0 == brd_pceNum[PIECES.bP] ){
					return BOOL.TRUE;
				}
				else if( 0 == brd_pceNum[PIECES.wN] && 0 == brd_pceNum[PIECES.bN] ){
					if(Math.abs(brd_pceNum[PIECES.wP] - brd_pceNum[PIECES.bP]) < 2){
						return BOOL.TRUE;
					}
					else if(pairOfPawn(PIECES.wP) == BOOL.FALSE && pairOfPawn(PIECES.bP)){
						return BOOL.TRUE;
					}
				}
			}
			else if( 0 == brd_pceNum[PIECES.wP] && 0 == brd_pceNum[PIECES.bP] ){
				if( 0 == brd_pceNum[PIECES.wN] && 0 == brd_pceNum[PIECES.bN] ){
					if(Math.abs(brd_pceNum[PIECES.wM] - brd_pceNum[PIECES.bM]) < 2){
						return BOOL.TRUE;
					}
				}
			}
		}
		else if( 0 == brd_pceNum[PIECES.wM] && 0 == brd_pceNum[PIECES.bM] ){
			if( 0 == brd_pceNum[PIECES.wP] && 0 == brd_pceNum[PIECES.bP] ){
				if( brd_pceNum[PIECES.wC] == brd_pceNum[PIECES.bC] ){
					return BOOL.TRUE;
				}
			}
		}
	}
	
	return BOOL.FALSE;
}

function PawnsInit() {

	var index = 0;
	for(index = 0; index < 10; ++index) {	// Files: (0) 1 2 3 4 5 6 7 8 (9)			
		PawnRanksWhite[index] = RANKS.RANK_8;			
		PawnRanksBlack[index] = RANKS.RANK_1;
	}
	pce = PIECES.wP;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		if(RanksBrd[sq] < PawnRanksWhite[FilesBrd[sq]+1]) {
			PawnRanksWhite[FilesBrd[sq]+1] = RanksBrd[sq];
		}
	}	
	pce = PIECES.bP;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		if(RanksBrd[sq] > PawnRanksBlack[FilesBrd[sq]+1]) {
			PawnRanksBlack[FilesBrd[sq]+1] = RanksBrd[sq];
		}			
	}	
}

function pceDistance(sq1, sq2){

	var dx = Math.abs(FilesBrd[sq1] - FilesBrd[sq2]);
	var dy = Math.abs(RanksBrd[sq1] - RanksBrd[sq2]);
	return Math.max(dx, dy);
}

function MedCol(pceMed){

	var pceNum, sq, q0 = 0, q1 = 0;
	for(pceNum = 0; pceNum < brd_pceNum[pceMed]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pceMed,pceNum)];
		if( SqCol64[SQ64(sq)] == 1) ++q1;
		else ++q0;
	}
	if(q1 > q0) return 1;
	else return 0;
}

function pairOfMed(pceMed){

	if(brd_pceNum[pceMed]<2) return BOOL.FALSE;
	
	var pceNum, sq, q0 = 0, q1 = 0;
	for(pceNum = 0; pceNum < brd_pceNum[pceMed]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pceMed,pceNum)];
		if( SqCol64[SQ64(sq)] == 1) ++q1;
		else ++q0;
	}
	
	if(q0 && q1) return BOOL.TRUE;
	return BOOL.FALSE;
}

function pairOfPawn(pcePawn){

	if(brd_pceNum[pcePawn]<2) return BOOL.FALSE;

	var file, pceNum, sq, m = 0;
	var pawnFiles = [0, 0, 0, 0, 0, 0, 0, 0];
	for(pceNum = 0; pceNum < brd_pceNum[pcePawn]; ++pceNum){
		sq = brd_pList[PCEINDEX(pcePawn,pceNum)];
		if( FilesBrd[sq] != SQUARES.OFFBOARD ) pawnFiles[FilesBrd[sq]]++;
	} 
	for(file = FILES.FILE_A; file < FILES.FILE_H; ++file) {
		if( pawnFiles[file] > 0 && pawnFiles[file+1] > 0 ) return BOOL.TRUE;
	}
	return BOOL.FALSE;
}

function EvalEndgame(bscore, wkSq, bkSq){
	var score = bscore;
	
	// some known end-game
	if(BlackMat == 0){
		switch(WhiteMat){
			case 0x0C: //KMMMK
				pce = PIECES.wM;
				var mc = MedCol(pce);
				for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
					sq = brd_pList[PCEINDEX(pce,pceNum)];
					if(pceDistance(sq, bkSq) > 4) score -= 15;
					if(mc == KCorner[SQ64(bkSq)]) {
						score += MedLight[SQ64(sq)];
						score += KingE2[SQ64(wkSq)];
					}
					else {
						score += MedDark[SQ64(sq)];
						score += KingE[SQ64(wkSq)];
					}
				}
				
			break;
			case 0x14: //KNMK
				pce = PIECES.wM;
				for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
					sq = brd_pList[PCEINDEX(pce,pceNum)];
					score += MedE[MIRROR64(SQ64(sq))];
					if(MedCol(pce) != SQCOL.LIGHT) 
						score -= LoneKingLight[SQ64(bkSq)];
					else if(MedCol(pce) != SQCOL.DARK)
						score -= LoneKingDark[SQ64(bkSq)];
				}
			break;
			case 0x44: //KCMK
				sq = brd_pList[PCEINDEX(PIECES.wC,0)];
				if(RanksBrd[sq] >= RanksBrd[bkSq]) 
					score += backCon;
				if(pceDistance(sq, bkSq) > 4) score -= 40;
				sq = brd_pList[PCEINDEX(PIECES.wM,0)];
				if(pceDistance(sq, bkSq) > 4) score -= 40;
				score -= LoneKingCon[SQ64(bkSq)];
			break;
			default:
				score -= (KingKRK[SQ64(bkSq)]*2) - 1;
				if( brd_pceNum[PIECES.wC] > 0 ) score -= pceDistance( brd_pList[PCEINDEX(PIECES.wC,0)],	wkSq ) * 8;
				if( brd_pceNum[PIECES.wM] > 0 ) score -= pceDistance( brd_pList[PCEINDEX(PIECES.wM,0)],	wkSq ) * 8;
			break;
		}
	}
	
	if(WhiteMat == 0){
		switch(BlackMat){
			case 0x0C: //KMMMK
				pce = PIECES.bM;
				var mc = MedCol(pce);
				for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
					sq = brd_pList[PCEINDEX(pce,pceNum)];
					if(pceDistance(sq, wkSq) > 4) score += 15;
					if(mc == KCorner[SQ64(wkSq)]) {
						score -= MedLight[SQ64(sq)];
						score -= KingE2[MIRROR64(SQ64(bkSq))];
					}
					else{
						score -= MedDark[SQ64(sq)];
						score -= KingE[SQ64(bkSq)];
					}
				}
				
			break;
			case 0x14: //KNMK
				pce = PIECES.bM;
				for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
					sq = brd_pList[PCEINDEX(pce,pceNum)];
					score -= MedE[SQ64(sq)];
					if(MedCol(pce) != SQCOL.LIGHT) 
						score += LoneKingLight[SQ64(wkSq)];
					else if(MedCol(pce) != SQCOL.DARK)
						score += LoneKingDark[SQ64(wkSq)];
				}
			break;
			case 0x44: //KCMK
				sq = brd_pList[PCEINDEX(PIECES.bC,0)];
				if(RanksBrd[sq] <= RanksBrd[wkSq]) 
					score -= backCon;
				if(pceDistance(sq, wkSq) > 4) score += 40;
				sq = brd_pList[PCEINDEX(PIECES.bM,0)];
				if(pceDistance(sq, wkSq) > 4) score -= 40;
				score += LoneKingCon[MIRROR64(SQ64(wkSq))];
			break;
			default:
				score += (KingKRK[MIRROR64(SQ64(wkSq))]*2) - 1;
				if( brd_pceNum[PIECES.bC] > 0 ) score += pceDistance( brd_pList[PCEINDEX(PIECES.bC,0)],	bkSq ) * 8;
				if( brd_pceNum[PIECES.bM] > 0 ) score += pceDistance( brd_pList[PCEINDEX(PIECES.bM,0)],	bkSq ) * 8;
			break;
		}
	}
	
	if( Math.abs( bscore ) > 40 ){
		if( bscore > 40 ) score -= pceDistance( wkSq,	bkSq ) * 8;
		if( bscore <-40 ) score += pceDistance( wkSq,	bkSq ) * 8;
	}
	score +=  KingE[SQ64(wkSq)] * 2;
	score -=  KingE[MIRROR64(SQ64(bkSq))] * 2;
	
	return score;
}

function SliderMobility(sq,	dir) {
	var side = PieceCol[brd_pieces[sq]];
	var t_sq = sq + dir;
    var result = 0;
 
    while ( SQOFFBOARD(t_sq) == BOOL.FALSE ) {
		if ( brd_pieces[t_sq] != PIECES.EMPTY ) {
			if ( PieceCol[brd_pieces[t_sq]] == (side ^ 1) )
				return result + 1;
			return result;
		}
		++result;
		t_sq += dir;
    }
    return result;
}

function LeaperMobility(sq,	dir) {
	var side = PieceCol[brd_pieces[sq]];
	var t_sq = sq + dir;
    var result = 0;
	
	if( SQOFFBOARD(t_sq) == BOOL.FALSE ){
		if ( brd_pieces[t_sq] != PIECES.EMPTY ) {
			if ( PieceCol[brd_pieces[t_sq]] == (side ^ 1) )
				return result + 1;
			return result;
		}
		++result;
	}
    return result;
}

var rook_mob = [ -4,	-2,	0,	1,	1,	2,	2,0,0,0,0,0,0,0,0,0];

function RookMob(sq) {
	var localMobility = 0
						+ SliderMobility(sq,	  1)
						+ SliderMobility(sq,	 -1)
						;
    return rook_mob[localMobility];
}

var knight_mob = [ -6,	-4,	0,	2,	4,	0,	0,	0,	0 ];

function WKnightMob(sq) { 
    var localMobility = 0
						+ LeaperMobility(sq,	-8)
						+ LeaperMobility(sq,	-12)
						+ LeaperMobility(sq,	-19)
						+ LeaperMobility(sq,	-21)
						;
    return knight_mob[localMobility];
}

function BKnightMob(sq) { 
    var localMobility = 0
						+ LeaperMobility(sq,	8)
						+ LeaperMobility(sq,	12)
						+ LeaperMobility(sq,	19)
						+ LeaperMobility(sq,	21)
						;
    return knight_mob[localMobility];
}

var cm_mob = [ -6,	-2,	0,	1,	2,	0 ];

function WConMob(sq) {
    var localMobility = 0
						+ LeaperMobility(sq,	-9)
						+ LeaperMobility(sq,	-11)
						;
    return cm_mob[localMobility];
}

function BConMob(sq) {
    var localMobility = 0
						+ LeaperMobility(sq,	11)
						+ LeaperMobility(sq,	9)
						;
    return cm_mob[localMobility];
}

function WMedMob(sq) {
    return WConMob(sq);
}

function BMedMob(sq) {
    return BConMob(sq);
}

function EvalMobility(){
	var pce, sq, pceNum, eval = 0;
	
	pce = PIECES.wR;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		eval += RookMob(sq);
	}
	pce = PIECES.bR;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		eval -= RookMob(sq);
	}
	
	pce = PIECES.wC;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		eval += WConMob(sq);
	}
	pce = PIECES.bC;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		eval -= BConMob(sq);
	}
	
	pce = PIECES.wM;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		eval += WMedMob(sq);
	}
	pce = PIECES.bM;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		eval -= BMedMob(sq);
	}
	
	pce = PIECES.wN;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		eval += WKnightMob(sq);
	}
	pce = PIECES.bN;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		eval -= BKnightMob(sq);
	}
	
	return eval;
}

function EvalAdvance(){
	var score = 0;
	
	if(brd_pceNum[PIECES.wR] == 0 && brd_pceNum[PIECES.wC] > 0) score += 50;
	if(brd_pceNum[PIECES.wR] == 0 && brd_pceNum[PIECES.wC] == 0 && brd_pceNum[PIECES.wM] > 1) score += 50;
	
	if(brd_pceNum[PIECES.bR] == 0 && brd_pceNum[PIECES.bC] > 0) score -= 50;
	if(brd_pceNum[PIECES.bR] == 0 && brd_pceNum[PIECES.bC] == 0 && brd_pceNum[PIECES.bM] > 1) score -= 50;
		
	return score;
}

function EvalPosition() {

	var pce;
	var pceNum;
	var sq, wkSq, bkSq;
	var score = brd_material[COLOURS.WHITE] - brd_material[COLOURS.BLACK];
	var file;
	var rank;
	
	wkSq = brd_pList[PCEINDEX(PIECES.wK,0)];
	bkSq = brd_pList[PCEINDEX(PIECES.bK,0)];
	
	if(MaterialDraw() == BOOL.TRUE) {
		return 0;
	}
	
	if(BlackMat == 0 || WhiteMat == 0 ){
		return EvalEndgame(score, wkSq, bkSq);
	}
	
	PawnsInit();
	
	pce = PIECES.wP;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score += PawnTable[SQ64(sq)];	
		file = FilesBrd[sq]+1;
		rank = RanksBrd[sq];
		if(PawnRanksWhite[file-1]==RANKS.RANK_8 && PawnRanksWhite[file+1]==RANKS.RANK_8) { //no neighbour
			score += PawnIsolated;
		}
		if(PawnRanksBlack[file-1]<=rank && PawnRanksBlack[file]<=rank && PawnRanksBlack[file+1]<=rank) { //no enemy
			score += PawnPassed[rank];
		}
	}	
	
	pce = PIECES.bP;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score -= PawnTable[MIRROR64(SQ64(sq))];	
		file = FilesBrd[sq]+1;
		rank = RanksBrd[sq];
		if(PawnRanksBlack[file-1]==RANKS.RANK_1 && PawnRanksBlack[file+1]==RANKS.RANK_1) { //no neighbour
			score -= PawnIsolated;
		}	
		if(PawnRanksWhite[file-1]>=rank && PawnRanksWhite[file]>=rank && PawnRanksWhite[file+1]>=rank) { //no enemy
			score -= PawnPassed[7-rank];
		}	
	}	
	
	pce = PIECES.wN;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score += KnightTable[SQ64(sq)];
		
		if( (brd_pieces[sq+ 9] == PIECES.EMPTY && brd_pieces[sq+19] == PIECES.bP)||
			(brd_pieces[sq+11] == PIECES.EMPTY && brd_pieces[sq+21] == PIECES.bP) )
			score -= 10;
		if(brd_pieces[sq- 9] == PIECES.wP || brd_pieces[sq-11] == PIECES.wP)
			score += 10;
	}	
	
	pce = PIECES.bN;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score -= KnightTable[MIRROR64(SQ64(sq))];
		
		if( (brd_pieces[sq- 9] == PIECES.EMPTY && brd_pieces[sq-19] == PIECES.wP)||
			(brd_pieces[sq-11] == PIECES.EMPTY && brd_pieces[sq-21] == PIECES.wP) )
			score += 10;
		if(brd_pieces[sq+ 9] == PIECES.bP || brd_pieces[sq+11] == PIECES.bP)
			score -= 10;
	}			
	
	pce = PIECES.wC;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score += ConTable[SQ64(sq)];
		if( (brd_pieces[sq+ 9] == PIECES.EMPTY && brd_pieces[sq+19] == PIECES.bP)||
			(brd_pieces[sq+11] == PIECES.EMPTY && brd_pieces[sq+21] == PIECES.bP) )
			score -= 10;
		if(RanksBrd[bkSq] - RanksBrd[sq] < 0) score += (RanksBrd[bkSq] - RanksBrd[sq]) * 4;
		if(brd_material[COLOURS.WHITE] <= ENDGAME_MAT) score -= pceDistance(sq, wkSq) * 4;
	}	
	if(brd_pceNum[pce] == 2) score += 15;
	
	pce = PIECES.bC;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score -= ConTable[MIRROR64(SQ64(sq))];
		if( (brd_pieces[sq- 9] == PIECES.EMPTY && brd_pieces[sq-19] == PIECES.wP)||
			(brd_pieces[sq-11] == PIECES.EMPTY && brd_pieces[sq-21] == PIECES.wP) )
			score += 10;
		if(RanksBrd[wkSq] - RanksBrd[sq] >= 0) score += (RanksBrd[wkSq] - RanksBrd[sq]) * 4;
		if(brd_material[COLOURS.BLACK] <= ENDGAME_MAT) score += pceDistance(sq, bkSq) * 4;
	}
	if(brd_pceNum[pce] == 2) score -= 15;
	
	pce = PIECES.wM;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		if(brd_material[COLOURS.WHITE] <= ENDGAME_MAT){
			score += MedE[MIRROR64(SQ64(sq))];
			score -= pceDistance(sq, wkSq) * 4;
		} 
		else
			score += MedTable[SQ64(sq)];
	}
	if(pairOfMed(pce)) score += 15;
	
	pce = PIECES.bM;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		if(brd_material[COLOURS.BLACK] <= ENDGAME_MAT){
			score -= MedE[SQ64(sq)];
			score += pceDistance(sq, bkSq) * 4;
		} 
		else
			score -= MedTable[MIRROR64(SQ64(sq))];
	}
	if(pairOfMed(pce)) score -= 15;
	
	pce = PIECES.wR;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score += RookTable[SQ64(sq)];	
		file = FilesBrd[sq];

		if( file == FilesBrd[bkSq] ) score += RookSightKing;

		file++;
		if(PawnRanksWhite[file]==RANKS.RANK_8) {
			if(PawnRanksBlack[file]==RANKS.RANK_1) {
				score += RookOpenFile;
			} else  {
				score += RookSemiOpenFile;
			}
		}
	}	
	
	pce = PIECES.bR;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score -= RookTable[MIRROR64(SQ64(sq))];	
		file = FilesBrd[sq];

		if( file == FilesBrd[wkSq] ) score -= RookSightKing;
			
		file++;
		if(PawnRanksBlack[file]==RANKS.RANK_1) {
			if(PawnRanksWhite[file]==RANKS.RANK_8) {
				score -= RookOpenFile;
			} else  {
				score -= RookSemiOpenFile;
			}
		}
	}
	
	if( (brd_material[COLOURS.BLACK] <= ENDGAME_MAT) ) {
		score += KingE[SQ64(wkSq)];
	} else {
		score += KingO[SQ64(wkSq)];
	}

	if( (brd_material[COLOURS.WHITE] <= ENDGAME_MAT) ) {
		score -= KingE[MIRROR64(SQ64(bkSq))];
	} else {
		score -= KingO[MIRROR64(SQ64(bkSq))];
	}
	
	score += EvalMobility();
	
	score += EvalAdvance();
	
	if(brd_side == COLOURS.WHITE) {
		return score;
	} else {
		return -score;
	}	
}

