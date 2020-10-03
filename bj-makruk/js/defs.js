//BJ Makruk

var PIECES =  { EMPTY : 0, wP : 1, wN : 2, wC : 3,wR : 4, wM : 5, wK : 6, bP : 7, bN : 8, bC : 9, bR : 10, bM : 11, bK : 12  };
var BRD_SQ_NUM = 120;

var MAXGAMEMOVES = 2048;
var MAXPOSITIONMOVES = 256;
var MAXDEPTH = 64;

var INFINITE = 30000;
var MATE = 29000;

var START_FEN = "rncmkcnr/8/pppppppp/8/8/PPPPPPPP/8/RNCKMCNR w - - 0 0";

var FILES =  { FILE_A:0, FILE_B:1, FILE_C:2, FILE_D:3, FILE_E:4, FILE_F:5, FILE_G:6, FILE_H:7, FILE_NONE:8 };
var RANKS =  { RANK_1:0, RANK_2:1, RANK_3:2, RANK_4:3, RANK_5:4, RANK_6:5, RANK_7:6, RANK_8:7, RANK_NONE:8 };

var COLOURS = { WHITE:0, BLACK:1, BOTH:2 };

var SQUARES = {
  A1:21, B1:22, C1:23, D1:24, E1:25, F1:26, G1:27, H1:28,  
  A8:91, B8:92, C8:93, D8:94, E8:95, F8:96, G8:97, H8:98, NO_SQ:99, OFFBOARD:100
};

var BOOL = { FALSE:0, TRUE:1 };

var FilesBrd = new Array(BRD_SQ_NUM);
var RanksBrd = new Array(BRD_SQ_NUM);

var Sq120ToSq64 = new Array(BRD_SQ_NUM);
var Sq64ToSq120 = new Array(64);

var PceChar = ".PNCRMKpncrmk";
var SideChar = "wb-";
var RankChar = "12345678";
var FileChar = "abcdefgh";

var PieceVal_O= [ 0, 100, 375, 350, 700, 175, 50000, 100, 375, 350, 550, 175, 50000  ];
var PieceVal= [ 0, 125, 350, 265, 500, 145, 50000, 125, 350, 265, 500, 145, 50000  ];//Thank you Phoomchai

var PieceBig = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE ];
var PieceMaj = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE ];
var PieceMin = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE ];
var PieceCol = [ COLOURS.BOTH, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK ];
	
var PiecePawn = [ BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];	
var PieceKnight = [ BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
var PieceCon = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE ];
var PieceMed = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE ];
var PieceKing = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE ];
var PieceRook = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE ];
var PieceSlides = [ BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE ];

var KnDir = [ -8, -19,	-21, -12, 8, 19, 21, 12 ];
var RkDir = [ -1, -10,	1, 10 ];
var WcDir = [ -9, -11, 11, 10, 9 ];
var BcDir = [ -9, -10,-11, 11, 9 ];
var MeDir = [ -9, -11, 11, 9 ];
var KiDir = [ -1, -10,	1, 10, -9, -11, 11, 9 ];

var DirNum = [ 0, 0, 8, 5, 4, 4, 8, 0, 8, 5, 4, 4, 8 ];
var PceDir = [0, 0, KnDir, WcDir, RkDir, MeDir, KiDir, 0, KnDir, BcDir, RkDir, MeDir, KiDir ];
var LoopSlidePce = [ PIECES.wR, 0, PIECES.bR, 0 ];
var LoopNonSlidePce = [ PIECES.wN, PIECES.wC, PIECES.wM, PIECES.wK, 0, PIECES.bN, PIECES.bC, PIECES.bM, PIECES.bK, 0 ];
var LoopSlideIndex = [ 0, 2 ];
var LoopNonSlideIndex = [ 0, 5 ];

var Kings = [PIECES.wK, PIECES.bK];

var PieceKeys = new Array(14 * 120);
var SideKey;

var Mirror64 = [
56	,	57	,	58	,	59	,	60	,	61	,	62	,	63	,
48	,	49	,	50	,	51	,	52	,	53	,	54	,	55	,
40	,	41	,	42	,	43	,	44	,	45	,	46	,	47	,
32	,	33	,	34	,	35	,	36	,	37	,	38	,	39	,
24	,	25	,	26	,	27	,	28	,	29	,	30	,	31	,
16	,	17	,	18	,	19	,	20	,	21	,	22	,	23	,
8	,	9	,	10	,	11	,	12	,	13	,	14	,	15	,
0	,	1	,	2	,	3	,	4	,	5	,	6	,	7
];

var SQCOL = { LIGHT:0, DARK:1};

var SqCol64 = [
SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,
SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK	,
SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,
SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK	,
SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,
SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK	,
SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,
SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK	,	SQCOL.LIGHT	,	SQCOL.DARK  ,	SQCOL.LIGHT	,	SQCOL.DARK
];

/*                         	                        
0000 0000 0000 0000 0000 0000 0111 1111 -> From 0x7F
0000 0000 0000 0000 0011 1111 1000 0000 -> To >> 7, 0x7F
0000 0000 0000 0011 1100 0000 0000 0000 -> Captured >> 14, 0xF
0000 0000 1111 0000 0000 0000 0000 0000 -> Promoted Piece >> 20, 0xF
*/

function FROMSQ(m) { return (m & 0x7F); }
function TOSQ(m)  { return (((m)>>7) & 0x7F); }
function CAPTURED(m)  { return (((m)>>14) & 0xF); }
function PROMOTED(m)  { return (((m)>>20) & 0xF); }

var MFLAGCAP = (0xF<<14);
var MFLAGPROM = (0xF<<20);

var NOMOVE = 0;

var PVENTRIES = 10000;

function PCEINDEX(pce, pceNum) {
	return (pce * 10 + pceNum);
}

function FR2SQ(f,r) {
 	return ( (21 + (f) ) + ( (r) * 10 ) );
}

function SQ64(sq120) { 
	return Sq120ToSq64[(sq120)];
}

function SQ120(sq64) {
	return Sq64ToSq120[(sq64)];
}

function MIRROR64(sq) {
	return Mirror64[sq];
}

function RAND_32() {
	return (Math.floor((Math.random()*255)+1) << 23) | (Math.floor((Math.random()*255)+1) << 16)
		 | (Math.floor((Math.random()*255)+1) << 8) | Math.floor((Math.random()*255)+1);

}

function SQOFFBOARD(sq) {
	if(FilesBrd[sq]==SQUARES.OFFBOARD) return BOOL.TRUE;
	return BOOL.FALSE;	
}

function HASH_PCE(pce,sq) { 
	brd_posKey ^= PieceKeys[pce*120 + sq]; 
}

function HASH_SIDE() { 
	brd_posKey ^= SideKey; 
}

var GameController = {};
GameController.EngineSide = COLOURS.BOTH;
GameController.PlayerSide = COLOURS.BOTH;
GameController.BoardFlipped = BOOL.FALSE;
GameController.GameOver = BOOL.FALSE;
GameController.BookLoaded = BOOL.FALSE;
GameController.GameSaved = BOOL.TRUE;

