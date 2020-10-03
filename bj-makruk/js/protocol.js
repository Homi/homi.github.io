//BJ Makruk

function ThreeFoldRep() {
	var i = 0, r = 0;
	for (i = 0; i < brd_hisPly; ++i)	{
	    if (brd_history[i].posKey == brd_posKey) {
		    r++;
		}
	}
	return r;
}

function DrawMaterial() {

	if (brd_pceNum[PIECES.wR] !=0 || brd_pceNum[PIECES.bR] !=0) return BOOL.FALSE;
    if (brd_pceNum[PIECES.wC] !=0 || brd_pceNum[PIECES.bC] !=0) return BOOL.FALSE;
	if (brd_pceNum[PIECES.wP] > 1 || brd_pceNum[PIECES.bP] > 1) return BOOL.FALSE;
	if ((brd_pceNum[PIECES.wM] > 0 && brd_pceNum[PIECES.wP] > 0) || (brd_pceNum[PIECES.bM] > 0 && brd_pceNum[PIECES.bP] > 0)) return BOOL.FALSE;
	if ((brd_pceNum[PIECES.wM] > 1 && pairOfMed(PIECES.wM) == BOOL.TRUE) || (brd_pceNum[PIECES.bM] > 1 && pairOfMed(PIECES.bM) == BOOL.TRUE)) return BOOL.FALSE;
	if ((brd_pceNum[PIECES.wN] > 0 && brd_pceNum[PIECES.wM] > 0) || (brd_pceNum[PIECES.wN] > 0 && brd_pceNum[PIECES.wP] > 0)) return BOOL.FALSE;
	if ((brd_pceNum[PIECES.bN] > 0 && brd_pceNum[PIECES.bM] > 0) || (brd_pceNum[PIECES.bN] > 0 && brd_pceNum[PIECES.bP] > 0)) return BOOL.FALSE;
	if ((brd_pceNum[PIECES.wN] > 0 && brd_pceNum[PIECES.bP] > 0) || (brd_pceNum[PIECES.bN] > 0 && brd_pceNum[PIECES.wP] > 0)) return BOOL.FALSE;
	
    return BOOL.TRUE;
}

