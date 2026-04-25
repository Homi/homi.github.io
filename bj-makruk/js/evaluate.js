//BJ Makruk

var RookOpenFile = 10;		// โบนัสสำหรับเรือที่อยู่บนไฟล์เปิด (ไม่มีเบี้ยของฝ่ายเราอยู่ในไฟล์นั้น)
var RookSemiOpenFile = 5;	// โบนัสสำหรับเรือที่อยู่บนไฟล์ครึ่งเปิด (มีเบี้ยของฝ่ายเราอยู่ในไฟล์นั้นแต่ไม่มีเบี้ยศัตรู)
var RookSightKing = 8;		// โบนัสสำหรับเรือที่มองเห็นขุนศัตรู

var PawnRanksWhite = new Array(10); // เก็บแถวที่เบี้ยขาวอยู่สูงสุดในแต่ละไฟล์ 
var PawnRanksBlack = new Array(10); // เก็บแถวที่เบี้ยดำอยู่ต่ำสุดในแต่ละไฟล์ 

var PawnPassed = [ 0, 0, 10, 30, 60, 100, 0, 0 ]; // โบนัสสำหรับเบี้ยผ่าน (ขึ้นอยู่กับระยะทางที่เหลือถึงแถว 6)
var PawnIsolated = -15;  // เบี้ยเดี่ยว (ไม่มีเบี้ยเพื่อนอยู่ไฟล์ข้างๆ) เพิ่มโทษให้หนักขึ้นเล็กน้อย
var PawnDoubled = -20;   // เบี้ยซ้อน (เดินติดขัด เป็นเป้านิ่ง)
var PawnSupported = 10;  // เบี้ยผูก (ป้องกันกันเองแนวทแยง)
var PawnPhalanx = 15;    // เบี้ยเทียม (เบี้ยยืนคู่กันแถวเดียวกัน ควบคุมตาเดินศัตรูได้ดีมาก)

// เพิ่ม Array สำหรับนับจำนวนเบี้ยในแต่ละไฟล์ เพื่อหาเบี้ยซ้อน
var PawnCountWhite = new Array(10);
var PawnCountBlack = new Array(10);

var KnightOutpost = 25;  // โบนัสพิเศษสำหรับม้าตั้งป้อม

var ConDefendingPawn = 15; // โคนยืนผูกเบี้ยด้านหน้า
var ConSupported = 10;     // โคนมีเบี้ยผูกด้านหลัง
var ConOverextended = -20; // โคนลอย (ดันสูงโดยไม่มีเบี้ยคอยช่วย)
var TwoConBonus = 20;      // โบนัสสำหรับมีโคน 2 ตัว

var MedKingShield = 15;     // โบนัสเมื่อเม็ดยืนคุ้มกันอยู่ใกล้ขุน
var MedSupported = 10;      // โบนัสเมื่อมีเบี้ยผูกเม็ด (มั่นคง)
var MedOverextended = -25;  // บทลงโทษเมื่อเม็ดลอย (บุกสูงโดยไม่มีเบี้ยช่วย)

var PairOfMedBonus = 20; // โบนัสสำหรับมีเม็ดคู่ (ยืนคู่กันแถวเดียวกัน ควบคุมตาเดินศัตรูได้ดีมาก)

var PawnTable = [
0   ,   0   ,   0   ,   0   ,   0   ,   0   ,   0   ,   0   , // Rank 8
0   ,   0   ,   0   ,   0   ,   0   ,   0   ,   0   ,   0   , // Rank 7
50  ,   50  ,   50  ,   50  ,   50  ,   50  ,   50  ,   50  , // Rank 6 (จังหวะหงาย ให้โบนัสสูงสุด)
20  ,   25  ,   30  ,   40  ,   40  ,   30  ,   25  ,   20  , // Rank 5 (เบี้ยสูง/เบี้ยจ่อ กดดันแดนศัตรู)
10  ,   15  ,   20  ,   25  ,   25  ,   20  ,   15  ,   10  , // Rank 4 (คุมกลางกระดาน)
0   ,   5   ,   10  ,   10  ,   10  ,   10  ,   5   ,   0   , // Rank 3 (ตำแหน่งเริ่มต้น)
0   ,   0   ,   0   ,   0   ,   0   ,   0   ,   0   ,   0   , // Rank 2
0   ,   0   ,   0   ,   0   ,   0   ,   0   ,   0   ,   0     // Rank 1
];

var KnightTable = [
-50 ,   -30 ,   -20 ,   -20 ,   -20 ,   -20 ,   -30 ,   -50 ,
-30 ,   -10 ,   0   ,   5   ,   5   ,   0   ,   -10 ,   -30 ,
-20 ,   0   ,   15  ,   20  ,   20  ,   15  ,   0   ,   -20 ,
-20 ,   5   ,   20  ,   30  ,   30  ,   20  ,   5   ,   -20 , // คุมเซ็นเตอร์ได้ดีที่สุด
-20 ,   5   ,   20  ,   30  ,   30  ,   20  ,   5   ,   -20 , // คุมเซ็นเตอร์ได้ดีที่สุด
-20 ,   0   ,   10  ,   15  ,   15  ,   10  ,   0   ,   -20 ,
-30 ,   -10 ,   0   ,   5   ,   5   ,   0   ,   -10 ,   -30 ,
-50 ,   -30 ,   -20 ,   -20 ,   -20 ,   -20 ,   -30 ,   -50 
];

var ConTable = [
-30 ,   -20 ,   -20 ,   -20 ,   -20 ,   -20 ,   -20 ,   -30 ,
-20 ,   -10 ,   0   ,   0   ,   0   ,   0   ,   -10 ,   -20 ,
-10 ,   0   ,   10  ,   15  ,   15  ,   10  ,   0   ,   -10 ,
-10 ,   10  ,   15  ,   25  ,   25  ,   15  ,   10  ,   -10 , // แถว 5 (รุกคืบ)
-10 ,   10  ,   15  ,   25  ,   25  ,   15  ,   10  ,   -10 , // แถว 4 (คุมกลาง)
-10 ,   5   ,   10  ,   15  ,   15  ,   10  ,   5   ,   -10 , // แถว 3 (ยืนผูกมั่นคง)
-20 ,   -10 ,   0   ,   10  ,   10  ,   0   ,   -10 ,   -20 , 
-30 ,   -20 ,   -20 ,   -20 ,   -20 ,   -20 ,   -20 ,   -30   
];

var MedTable = [
-30 ,   -20 ,   -20 ,   -20 ,   -20 ,   -20 ,   -20 ,   -30 ,
-20 ,   -5  ,   5   ,   10  ,   10  ,   5   ,   -5  ,   -20 ,
-10 ,   5   ,   15  ,   20  ,   20  ,   15  ,   5   ,   -10 ,
-10 ,   10  ,   20  ,   30  ,   30  ,   20  ,   10  ,   -10 ,
-10 ,   10  ,   20  ,   30  ,   30  ,   20  ,   10  ,   -10 ,
-5  ,   5   ,   15  ,   20  ,   20  ,   15  ,   5   ,   -5  ,
-20 ,   -5  ,   5   ,   10  ,   10  ,   5   ,   -5  ,   -20 ,
-30 ,   -20 ,   -20 ,   -20 ,   -20 ,   -20 ,   -20 ,   -30 
];

var RookTable = [
0   ,   0   ,   5   ,   10  ,   10  ,   5   ,   0   ,   0   , // Rank 8
25  ,   25  ,   30  ,   30  ,   30  ,   30  ,   25  ,   25  , // Rank 7 (บุกทะลวงหลังบ้านศัตรู แข็งแกร่งที่สุด)
0   ,   0   ,   5   ,   15  ,   15  ,   5   ,   0   ,   0   , // Rank 6
0   ,   0   ,   5   ,   10  ,   10  ,   5   ,   0   ,   0   , // Rank 5
0   ,   0   ,   5   ,   10  ,   10  ,   5   ,   0   ,   0   , // Rank 4
0   ,   0   ,   5   ,   10  ,   10  ,   5   ,   0   ,   0   , // Rank 3
-5  ,   0   ,   5   ,   10  ,   10  ,   5   ,   0   ,   -5  , // Rank 2
-5  ,   0   ,   5   ,   10  ,   10  ,   5   ,   0   ,   -5    // Rank 1
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
	-28,	-18,	-10,	  0,	  0,	-10,	-18,	-28,  
	-28,	-18,	-10,	  0,	  0,	-10,	-18,	-28,  
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
	100,	100,	80	,	0	,	0	,	-80	,	-100,	-100,	
	100,	80	,	40	,	40	,	40	,	-40	,	-80	,	-100,	
	80	,	40	,	60	,	80	,	80	,	-60	,	-40	,	-80,	
	0	,	40	,	80	,	100	,	100	,	80	,	40	,	0,	
	0	,	40	,	80	,	100	,	100	,	80	,	40	,	0,	
	-80	,	-40	,	-60	,	80	,	80	,	60	,	40	,	80,	
	-100,	-80	,	-40	,	40	,	40	,	40	,	80	,	100,	
	-100,	-100,	-80	,	0	,	0	,	80	,	100,	100
];

var LoneKingLight = [
	-100,	-100,	-80	,	0	,	0	,	80	,	100	,	100,	
	-100,	-80	,	-40	,	40	,	40	,	40	,	80	,	100,	
	-80	,	-40	,	-60	,	80	,	80	,	60	,	40	,	80,	
	0	,	40	,	80	,	100	,	100	,	80	,	40	,	0,	
	0	,	40	,	80	,	100	,	100	,	80	,	40	,	0,	
	80	,	40	,	60	,	80	,	80	,	-60	,	-40	,	-80,	
	100	,	80	,	40	,	40	,	40	,	-40	,	-80	,	-100,	
	100	,	100	,	80	,	0	,	0	,	-80	,	-100,	-100
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

function UpdateMaterialSignature() {
	WhiteMat = 0;
	WhiteMat |= brd_pceNum[PIECES.wP] & 3;
	WhiteMat |= ((brd_pceNum[PIECES.wM] & 3) << 2);
	WhiteMat |= ((brd_pceNum[PIECES.wN] & 3) << 4);
	WhiteMat |= ((brd_pceNum[PIECES.wC] & 1) << 6);
	WhiteMat |= ((brd_pceNum[PIECES.wR] & 1) << 7);
	if(brd_pceNum[PIECES.wP] > 3 || brd_pceNum[PIECES.wM] > 3 || brd_pceNum[PIECES.wN] == 2 || brd_pceNum[PIECES.wC] == 2 || brd_pceNum[PIECES.wR] > 0) {
		WhiteMat = 0xFF;
	}

	BlackMat = 0;
	BlackMat |= brd_pceNum[PIECES.bP] & 3;
	BlackMat |= ((brd_pceNum[PIECES.bM] & 3) << 2);
	BlackMat |= ((brd_pceNum[PIECES.bN] & 3) << 4);
	BlackMat |= ((brd_pceNum[PIECES.bC] & 1) << 6);
	BlackMat |= ((brd_pceNum[PIECES.bR] & 1) << 7);
	if(brd_pceNum[PIECES.bP] > 3 || brd_pceNum[PIECES.bM] > 3 || brd_pceNum[PIECES.bN] == 2 || brd_pceNum[PIECES.bC] == 2 || brd_pceNum[PIECES.bR] > 0) {
		BlackMat = 0xFF;
	}
}

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
    var pce, pceNum, sq;
    for(index = 0; index < 10; ++index) {   
        PawnRanksWhite[index] = RANKS.RANK_8;         
        PawnRanksBlack[index] = RANKS.RANK_1;
        PawnCountWhite[index] = 0; // เคลียร์ค่า
        PawnCountBlack[index] = 0; // เคลียร์ค่า
    }
    
    pce = PIECES.wP;   
    for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
        sq = brd_pList[PCEINDEX(pce,pceNum)];
        var f = FilesBrd[sq]+1;
        if(f >= 0 && f < PawnRanksWhite.length) {
            PawnCountWhite[f]++; // เก็บสถิติจำนวนเบี้ยในไฟล์นี้
            if(RanksBrd[sq] < PawnRanksWhite[f]) {
                PawnRanksWhite[f] = RanksBrd[sq];
            }
        }
    }   
    
    pce = PIECES.bP;   
    for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
        sq = brd_pList[PCEINDEX(pce,pceNum)];
        var f = FilesBrd[sq]+1;
        if(f >= 0 && f < PawnRanksBlack.length) {
            PawnCountBlack[f]++; // เก็บสถิติจำนวนเบี้ยในไฟล์นี้
            if(RanksBrd[sq] > PawnRanksBlack[f]) {
                PawnRanksBlack[f] = RanksBrd[sq];
            }
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
		var f = FilesBrd[sq];
		if(f >= 0 && f < pawnFiles.length && f != SQUARES.OFFBOARD) pawnFiles[f]++;
	} 
	for(file = FILES.FILE_A; file < FILES.FILE_H-1; ++file) {
		if( pawnFiles[file] > 0 && pawnFiles[file+1] > 0 ) return BOOL.TRUE;
	}
	return BOOL.FALSE;
}

function EvalEndgame(bscore, wkSq, bkSq){
	var score = bscore;
	var pce, pceNum, sq;
	
	// some known end-game
	if(BlackMat == 0){
		switch(WhiteMat){
			case 0x44: // KCMK (ขุน + โคน + เม็ด)
				var cSq = brd_pList[PCEINDEX(PIECES.wC, 0)];
				var mSq = brd_pList[PCEINDEX(PIECES.wM, 0)];
				
				score -= LoneKingCon[SQ64(bkSq)]; // ใช้ PST ดันเข้ามุม
				score -= pceDistance(wkSq, bkSq) * 20; // บังคับขุนประชิด
				
				// หมากต้องเกาะกลุ่มกันเพื่อสร้างกำแพง
				if (pceDistance(cSq, wkSq) <= 2) score += 15;
				if (pceDistance(mSq, wkSq) <= 2) score += 15;
				
				// บังคับโคนและเม็ดให้ไล่ต้อน
				score -= pceDistance(cSq, bkSq) * 10;
				score -= pceDistance(mSq, bkSq) * 10;
			break;

			case 0x14: // KNMK (ขุน + ม้า + เม็ด)
				var nSq = brd_pList[PCEINDEX(PIECES.wN, 0)];
				var mSq = brd_pList[PCEINDEX(PIECES.wM, 0)];
				
				// ผลักเข้ามุมให้ถูกสีของเม็ด (ใช้ LoneKing matrices ที่คุณมีอยู่)
				if(MedCol(PIECES.wM) == 1) { // สมมติ 1 = Light, 0 = Dark
					score -= LoneKingLight[SQ64(bkSq)];
				} else {
					score -= LoneKingDark[SQ64(bkSq)];
				}
				
				score -= pceDistance(wkSq, bkSq) * 20;
				if(pceDistance(nSq, wkSq) <= 2) score += 15;
				if(pceDistance(mSq, wkSq) <= 2) score += 15;
				score -= pceDistance(nSq, bkSq) * 10;
				score -= pceDistance(mSq, bkSq) * 10;
			break;

			case 0x18: // KNMMK (ขุน + ม้า + 2 เม็ด)
				var nSq = brd_pList[PCEINDEX(PIECES.wN, 0)];
				var m1Sq = brd_pList[PCEINDEX(PIECES.wM, 0)];
				var m2Sq = brd_pList[PCEINDEX(PIECES.wM, 1)];
				
				score -= LoneKingCon[SQ64(bkSq)]; // ดันเข้ามุมไหนก็ได้
				score -= pceDistance(wkSq, bkSq) * 20;
				
				var nDist = pceDistance(nSq, bkSq);
				var m1Dist = pceDistance(m1Sq, bkSq);
				var m2Dist = pceDistance(m2Sq, bkSq);
				
				// ให้น้ำหนักม้าเป็นตัวนำ
				score -= nDist * 30; 
				score -= m1Dist * 10;
				score -= m2Dist * 10;
				
				// แก้ปัญหาการดองม้า (Lazy Knight Penalty)
				if(nDist > 3 && (m1Dist <= 2 || m2Dist <= 2)) {
					score -= 100;
				}
				if(nDist == 2 || nDist == 3) {
					score += 40; // โบนัสเมื่อม้าอยู่ในระยะคุมตา
				}
			break;

			case 0x40: // KCK (ขุน + โคน 1 ตัว)
				var cSq = brd_pList[PCEINDEX(PIECES.wC, 0)];
				var bKf = FilesBrd[bkSq], bKr = RanksBrd[bkSq];
				var cornerDist = Math.min(
					Math.max(bKf, bKr), 
					Math.max(7 - bKf, bKr), 
					Math.max(bKf, 7 - bKr), 
					Math.max(7 - bKf, 7 - bKr)
				);
				
				score += (7 - cornerDist) * 30;
				score -= pceDistance(wkSq, bkSq) * 20;
				if (pceDistance(cSq, wkSq) <= 2) score += 10;
				
				// Scale Factor: หมากเสมอ หากขุนเป้าหมายไม่อยู่ติดมุม ให้ดรอปคะแนน 95%
				if (cornerDist > 2) score = Math.floor(score * 0.05);
			break;

			case 0x08: // KMMK (ขุน + 2 เม็ด)
				var m1Sq = brd_pList[PCEINDEX(PIECES.wM, 0)];
				var m2Sq = brd_pList[PCEINDEX(PIECES.wM, 1)];
				
				// หากเดินสีเดียวกัน = เสมอ 100%
				if (SqCol64[SQ64(m1Sq)] == SqCol64[SQ64(m2Sq)]) {
					score = 0; 
					break;
				}
				
				var bKf = FilesBrd[bkSq], bKr = RanksBrd[bkSq];
				var cornerDist = Math.min(
					Math.max(bKf, bKr), Math.max(7 - bKf, bKr), 
					Math.max(bKf, 7 - bKr), Math.max(7 - bKf, 7 - bKr)
				);
				
				score += (7 - cornerDist) * 30;
				score -= pceDistance(wkSq, bkSq) * 20;
				
				// เช็คเบี้ยผูก
				if (Math.abs(FilesBrd[m1Sq] - FilesBrd[m2Sq]) == 1 && Math.abs(RanksBrd[m1Sq] - RanksBrd[m2Sq]) == 1) {
					score += 50; 
				} else {
					score -= pceDistance(m1Sq, wkSq) * 10;
					score -= pceDistance(m2Sq, wkSq) * 10;
				}
				
				// Scale Factor
				if (cornerDist > 2) score = Math.floor(score * 0.05);
			break;

			case 0x05: // KPMK (ขุน + 1 เบี้ย + 1 เม็ด)
				var pSq = brd_pList[PCEINDEX(PIECES.wP, 0)];
				var mSq = brd_pList[PCEINDEX(PIECES.wM, 0)];
				
				score += RanksBrd[pSq] * 30; // บังคับดันเบี้ยขึ้นไปโปรโมท
				score -= pceDistance(wkSq, pSq) * 15; // ขุนต้องคุ้มกันเบี้ย
				score -= pceDistance(mSq, pSq) * 15;
				
				// โดนขุนดำขวางหน้าเบี้ย
				if (FilesBrd[bkSq] == FilesBrd[pSq] && RanksBrd[bkSq] == RanksBrd[pSq] + 1) {
					score -= 50;
				}
				
				var bKf = FilesBrd[bkSq], bKr = RanksBrd[bkSq];
				var cornerDist = Math.min(
					Math.max(bKf, bKr), Math.max(7 - bKf, bKr), 
					Math.max(bKf, 7 - bKr), Math.max(7 - bKf, 7 - bKr)
				);
				score += (7 - cornerDist) * 10;
				
				// Scale Factor กันเอนจินดองเบี้ย
				if (cornerDist > 2) score = Math.floor(score * 0.05);
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
			case 0x44: // KCMK (ขุน + โคน + เม็ด)
				var cSq = brd_pList[PCEINDEX(PIECES.bC, 0)];
				var mSq = brd_pList[PCEINDEX(PIECES.bM, 0)];
				
				score += LoneKingCon[SQ64(wkSq)]; // ใช้ PST ดันเข้ามุม
				score += pceDistance(wkSq, bkSq) * 20; // บังคับขุนประชิด
				
				// หมากต้องเกาะกลุ่มกันเพื่อสร้างกำแพง
				if (pceDistance(cSq, bkSq) <= 2) score -= 15;
				if (pceDistance(mSq, bkSq) <= 2) score -= 15;
				
				// บังคับโคนและเม็ดให้ไล่ต้อน
				score += pceDistance(cSq, wkSq) * 10;
				score += pceDistance(mSq, wkSq) * 10;
			break;

			case 0x14: // KNMK (ขุน + ม้า + เม็ด)
				var nSq = brd_pList[PCEINDEX(PIECES.bN, 0)];
				var mSq = brd_pList[PCEINDEX(PIECES.bM, 0)];
				
				// ผลักเข้ามุมให้ถูกสีของเม็ด (ใช้ LoneKing matrices ที่คุณมีอยู่)
				if(MedCol(PIECES.bM) == 1) { // สมมติ 1 = Light, 0 = Dark
					score += LoneKingLight[SQ64(wkSq)];
				} else {
					score += LoneKingDark[SQ64(wkSq)];
				}
				
				score += pceDistance(wkSq, bkSq) * 20;
				if(pceDistance(nSq, bkSq) <= 2) score -= 15;
				if(pceDistance(mSq, bkSq) <= 2) score -= 15;
				score += pceDistance(nSq, wkSq) * 10;
				score += pceDistance(mSq, wkSq) * 10;
			break;

			case 0x18: // KNMMK (ขุน + ม้า + 2 เม็ด)
				var nSq = brd_pList[PCEINDEX(PIECES.bN, 0)];
				var m1Sq = brd_pList[PCEINDEX(PIECES.bM, 0)];
				var m2Sq = brd_pList[PCEINDEX(PIECES.bM, 1)];
				
				score += LoneKingCon[SQ64(wkSq)]; // ดันเข้ามุมไหนก็ได้
				score += pceDistance(wkSq, bkSq) * 20;
				
				var nDist = pceDistance(nSq, wkSq);
				var m1Dist = pceDistance(m1Sq, wkSq);
				var m2Dist = pceDistance(m2Sq, wkSq);
				
				// ให้น้ำหนักม้าเป็นตัวนำ
				score += nDist * 30; 
				score += m1Dist * 10;
				score += m2Dist * 10;
				
				// แก้ปัญหาการดองม้า (Lazy Knight Penalty)
				if(nDist > 3 && (m1Dist <= 2 || m2Dist <= 2)) {
					score += 100;
				}
				if(nDist == 2 || nDist == 3) {
					score -= 40; // โบนัสเมื่อม้าอยู่ในระยะคุมตา
				}
			break;

			case 0x40: // KCK (ขุน + โคน 1 ตัว)
				var cSq = brd_pList[PCEINDEX(PIECES.bC, 0)];
				var wKf = FilesBrd[wkSq], wKr = RanksBrd[wkSq];
				var cornerDist = Math.min(
					Math.max(wKf, wKr), 
					Math.max(7 - wKf, wKr), 
					Math.max(wKf, 7 - wKr), 
					Math.max(7 - wKf, 7 - wKr)
				);
				
				score -= (7 - cornerDist) * 30;
				score += pceDistance(wkSq, bkSq) * 20;
				if (pceDistance(cSq, bkSq) <= 2) score -= 10;
				
				// Scale Factor: หมากเสมอ หากขุนเป้าหมายไม่อยู่ติดมุม ให้ดรอปคะแนน 95%
				if (cornerDist > 2) score = Math.floor(score * 0.05);
			break;

			case 0x08: // KMMK (ขุน + 2 เม็ด)
				var m1Sq = brd_pList[PCEINDEX(PIECES.bM, 0)];
				var m2Sq = brd_pList[PCEINDEX(PIECES.bM, 1)];
				
				// หากเดินสีเดียวกัน = เสมอ 100%
				if (SqCol64[SQ64(m1Sq)] == SqCol64[SQ64(m2Sq)]) {
					score = 0; 
					break;
				}
				
				var wKf = FilesBrd[wkSq], wKr = RanksBrd[wkSq];
				var cornerDist = Math.min(
					Math.max(wKf, wKr), Math.max(7 - wKf, wKr), 
					Math.max(wKf, 7 - wKr), Math.max(7 - wKf, 7 - wKr)
				);
				
				score -= (7 - cornerDist) * 30;
				score += pceDistance(wkSq, bkSq) * 20;
				
				// เช็คเบี้ยผูก
				if (Math.abs(FilesBrd[m1Sq] - FilesBrd[m2Sq]) == 1 && Math.abs(RanksBrd[m1Sq] - RanksBrd[m2Sq]) == 1) {
					score -= 50; 
				} else {
					score += pceDistance(m1Sq, bkSq) * 10;
					score += pceDistance(m2Sq, bkSq) * 10;
				}
				
				// Scale Factor
				if (cornerDist > 2) score = Math.floor(score * 0.05);
			break;

			case 0x05: // KPMK (ขุน + 1 เบี้ย + 1 เม็ด)
				var pSq = brd_pList[PCEINDEX(PIECES.bP, 0)];
				var mSq = brd_pList[PCEINDEX(PIECES.bM, 0)];
				
				score -= RanksBrd[pSq] * 30; // บังคับดันเบี้ยขึ้นไปโปรโมท
				score += pceDistance(wkSq, pSq) * 15; // ขุนต้องคุ้มกันเบี้ย
				score += pceDistance(mSq, pSq) * 15;
				
				// โดนขุนขาวขวางหน้าเบี้ย
				if (FilesBrd[wkSq] == FilesBrd[pSq] && RanksBrd[wkSq] == RanksBrd[pSq] - 1) {
					score += 50;
				}
				
				var wKf = FilesBrd[wkSq], wKr = RanksBrd[wkSq];
				var cornerDist = Math.min(
					Math.max(wKf, wKr), Math.max(7 - wKf, wKr), 
					Math.max(wKf, 7 - wKr), Math.max(7 - wKf, 7 - wKr)
				);
				score -= (7 - cornerDist) * 10;
				
				// Scale Factor กันเอนจินดองเบี้ย
				if (cornerDist > 2) score = Math.floor(score * 0.05);
			break;

			default:
				score += (KingKRK[SQ64(wkSq)]*2) - 1;
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
	var pce, sq, pceNum, e_eval = 0;
	
	pce = PIECES.wR;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		e_eval += RookMob(sq);
	}
	pce = PIECES.bR;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		e_eval -= RookMob(sq);
	}
	
	pce = PIECES.wC;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		e_eval += WConMob(sq);
	}
	pce = PIECES.bC;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		e_eval -= BConMob(sq);
	}
	
	pce = PIECES.wM;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		e_eval += WMedMob(sq);
	}
	pce = PIECES.bM;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		e_eval -= BMedMob(sq);
	}
	
	pce = PIECES.wN;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		e_eval += WKnightMob(sq);
	}
	pce = PIECES.bN;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		e_eval -= BKnightMob(sq);
	}
	
	return e_eval;
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

	UpdateMaterialSignature();
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
		
		// 1. เบี้ยซ้อน (Doubled Pawn)
		if (PawnCountWhite[file] > 1) {
			score += PawnDoubled;
		}

		// 2. เบี้ยเดี่ยว (Isolated Pawn)
		if(PawnCountWhite[file-1] == 0 && PawnCountWhite[file+1] == 0) { 
			score += PawnIsolated;
		}
		
		// 3. เบี้ยผ่าน (Passed Pawn)
		if(PawnRanksBlack[file-1]<=rank && PawnRanksBlack[file]<=rank && PawnRanksBlack[file+1]<=rank) { 
			score += PawnPassed[rank];
		}
		
		// 4. แผงเบี้ย: เบี้ยผูก (Supported)
		// เช็คว่ามีเบี้ยเพื่อนอยู่ด้านหลังแนวทแยงเพื่อผูกหรือไม่ (สำหรับขาวคือ -9 และ -11)
		if (brd_pieces[sq - 9] == PIECES.wP || brd_pieces[sq - 11] == PIECES.wP) {
			score += PawnSupported;
		}
		
		// 5. แผงเบี้ย: เบี้ยเทียม (Phalanx)
		// เช็คว่ามีเบี้ยเพื่อนยืนขนาบข้างในแถวเดียวกันหรือไม่ (สำหรับหน้ากระดานหมากรุกไทย เบี้ยเทียมมีพลังทะลวงสูงมาก)
		// หาร 2 เพื่อไม่ให้คะแนนเบิ้ลซ้ำกันตอนวนลูปเจอเบี้ยอีกตัว
		if (brd_pieces[sq - 1] == PIECES.wP || brd_pieces[sq + 1] == PIECES.wP) {
			score += PawnPhalanx / 2; 
		}
	}	
	
	pce = PIECES.bP;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score -= PawnTable[MIRROR64(SQ64(sq))];	
		file = FilesBrd[sq]+1;
		rank = RanksBrd[sq];
		
		// 1. เบี้ยซ้อน (Doubled Pawn)
		if (PawnCountBlack[file] > 1) {
			score -= PawnDoubled; // (ค่าลบซ้อนลบ ทำให้คะแนน score เป็นบวก = เป็นผลดีต่อขาว)
		}

		// 2. เบี้ยเดี่ยว (Isolated Pawn)
		if(PawnCountBlack[file-1] == 0 && PawnCountBlack[file+1] == 0) { 
			score -= PawnIsolated;
		}	
		
		// 3. เบี้ยผ่าน (Passed Pawn)
		if(PawnRanksWhite[file-1]>=rank && PawnRanksWhite[file]>=rank && PawnRanksWhite[file+1]>=rank) { 
			score -= PawnPassed[7-rank];
		}
		
		// 4. แผงเบี้ย: เบี้ยผูก (Supported)
		// เช็คเบี้ยดำด้านหลัง (สำหรับดำคือ +9 และ +11 เพราะเดินทิศทางลง)
		if (brd_pieces[sq + 9] == PIECES.bP || brd_pieces[sq + 11] == PIECES.bP) {
			score -= PawnSupported;
		}
		
		// 5. แผงเบี้ย: เบี้ยเทียม (Phalanx)
		if (brd_pieces[sq - 1] == PIECES.bP || brd_pieces[sq + 1] == PIECES.bP) {
			score -= PawnPhalanx / 2;
		}
	}	
	
	pce = PIECES.wN;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score += KnightTable[SQ64(sq)];
		file = FilesBrd[sq] + 1;
		rank = RanksBrd[sq];
		
		// --- Knight Outpost (ม้าตั้งป้อม) ---
		// 1. เช็คว่ามีเบี้ยขาวผูกม้าอยู่ด้านหลังแนวทแยง (-9, -11)
		var isDefended = (brd_pieces[sq - 9] == PIECES.wP || brd_pieces[sq - 11] == PIECES.wP);
		// 2. เช็คว่าเบี้ยดำในไฟล์ข้างเคียงเดินผ่านแรงค์นี้ไปหมดแล้ว (แรงค์สูงสุดของเบี้ยดำอยู่ต่ำกว่าหรือเท่ากับม้า)
		var isSafe = (PawnRanksBlack[file - 1] <= rank && PawnRanksBlack[file + 1] <= rank);
		
		if (isDefended && isSafe) {
			// ให้คะแนนโบนัส หากม้าตั้งป้อมอยู่ในแดนกลางถึงแดนศัตรู (Rank 3 ถึง 5)
			if (rank >= 3 && rank <= 5) {
				score += KnightOutpost;
			}
		}
	}
	
	pce = PIECES.bN;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score -= KnightTable[MIRROR64(SQ64(sq))];
		file = FilesBrd[sq] + 1;
		rank = RanksBrd[sq];
		
		// --- Knight Outpost (ม้าตั้งป้อม) ---
		// 1. เช็คว่ามีเบี้ยดำผูกม้าอยู่ด้านหลังแนวทแยง (+9, +11 เพราะดำเดินลง)
		var isDefended = (brd_pieces[sq + 9] == PIECES.bP || brd_pieces[sq + 11] == PIECES.bP);
		// 2. เช็คว่าเบี้ยขาวในไฟล์ข้างเคียงเดินผ่านแรงค์นี้ไปหมดแล้ว (แรงค์ต่ำสุดของเบี้ยขาวอยู่สูงกว่าหรือเท่ากับม้า)
		var isSafe = (PawnRanksWhite[file - 1] >= rank && PawnRanksWhite[file + 1] >= rank);
		
		if (isDefended && isSafe) {
			// ให้คะแนนโบนัส (ฝ่ายดำติดลบ) หากม้าตั้งป้อมอยู่ในแดนกลางถึงแดนศัตรู (Rank 2 ถึง 4)
			if (rank >= 2 && rank <= 4) {
				score -= KnightOutpost; 
			}
		}
	}		
	
	pce = PIECES.wC;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score += ConTable[SQ64(sq)];
		rank = RanksBrd[sq];
		
		// 1. โคนเป็นฐาน (Defending Pawns) - โคนผูกเบี้ยในตาเดินหน้าทั้ง 3 ทิศทาง (+9, +10, +11)
		var isDefendingPawn = (brd_pieces[sq + 9] == PIECES.wP || brd_pieces[sq + 10] == PIECES.wP || brd_pieces[sq + 11] == PIECES.wP);
		if (isDefendingPawn) score += ConDefendingPawn;

		// 2. เบี้ยผูกโคน (Supported by Pawn) - มีเบี้ยขาวอยู่ด้านหลังทแยงมุม (-9, -11)
		var isSupported = (brd_pieces[sq - 9] == PIECES.wP || brd_pieces[sq - 11] == PIECES.wP);
		if (isSupported) score += ConSupported;

		// 3. ลงโทษโคนลอย (Overextended Khon) 
		// หากบุกขึ้นมาถึง Rank 4 ขึ้นไป แต่ไม่มีเบี้ยผูกและไม่ได้ผูกเบี้ย ให้หักคะแนนหนักๆ ป้องกันโคนโดนจับกิน
		if (rank >= 3 && !isDefendingPawn && !isSupported) {
			score += ConOverextended; 
		}

		if(RanksBrd[bkSq] - RanksBrd[sq] < 0) score += (RanksBrd[bkSq] - RanksBrd[sq]) * 4;
		if(brd_material[COLOURS.WHITE] <= ENDGAME_MAT) score -= pceDistance(sq, wkSq) * 4;
	}	
	if(brd_pceNum[pce] == 2) score += TwoConBonus;
	
	pce = PIECES.bC;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		score -= ConTable[MIRROR64(SQ64(sq))];
		rank = RanksBrd[sq];
		
		// 1. โคนเป็นฐาน - ดำเดินลง ทิศทางเดินหน้าคือ -9, -10, -11
		var isDefendingPawn = (brd_pieces[sq - 9] == PIECES.bP || brd_pieces[sq - 10] == PIECES.bP || brd_pieces[sq - 11] == PIECES.bP);
		if (isDefendingPawn) score -= ConDefendingPawn;

		// 2. เบี้ยผูกโคน - เบี้ยดำอยู่ด้านหลังคือ +9, +11
		var isSupported = (brd_pieces[sq + 9] == PIECES.bP || brd_pieces[sq + 11] == PIECES.bP);
		if (isSupported) score -= ConSupported;

		// 3. ลงโทษโคนลอย - ดำบุกคือ Rank มีค่าน้อยลง (Rank 5-6 ของกระดานคือ index 3 หรือ 2)
		if (rank <= 4 && !isDefendingPawn && !isSupported) {
			score -= ConOverextended; // ลบค่าลบ = บวกคะแนนให้ขาว (เป็นการหักคะแนนดำ)
		}

		if(RanksBrd[wkSq] - RanksBrd[sq] >= 0) score += (RanksBrd[wkSq] - RanksBrd[sq]) * 4;
		if(brd_material[COLOURS.BLACK] <= ENDGAME_MAT) score += pceDistance(sq, bkSq) * 4;
	}
	if(brd_pceNum[pce] == 2) score -= TwoConBonus;
	
	pce = PIECES.wM;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		
		// 1. ตรรกะช่วงปลายเกม (Endgame) - ให้ขุนเดินนำหน้าเม็ด
		if(brd_material[COLOURS.WHITE] <= ENDGAME_MAT){
			score += MedE[MIRROR64(SQ64(sq))];
			score -= pceDistance(sq, wkSq) * 4;
		} 
		// 2. ตรรกะช่วงต้น-กลางเกม (Opening/Midgame)
		else {
			score += MedTable[SQ64(sq)];
			rank = RanksBrd[sq];

			// --- กฎเม็ดคุ้มขุน (King Shield) ---
			// หากเม็ดยืนเกาะกลุ่มกับขุนไม่เกิน 2 ช่อง ให้คะแนนโบนัส
			if (pceDistance(sq, wkSq) <= 2) {
				score += MedKingShield;
			}

			// --- กฎเบี้ยผูกเม็ด (Supported by Pawn) ---
			// เช็คเบี้ยขาวที่อยู่แนวทแยงด้านหลัง (+9 และ +11)
			var isSupported = (brd_pieces[sq + 9] == PIECES.wP || brd_pieces[sq + 11] == PIECES.wP);
			if (isSupported) {
				score += MedSupported;
			}

			// --- กฎลงโทษเม็ดลอย (Overextended Met) ---
			// หากเม็ดบุกสูงถึงแถว 4 ขึ้นไป แต่ไม่มีคนผูก ให้หักคะแนนหนักๆ
			if (rank >= 3 && !isSupported) {
				score += MedOverextended;
			}
		}
	}
	if(pairOfMed(pce)) score += PairOfMedBonus;
	
	pce = PIECES.bM;	
	for(pceNum = 0; pceNum < brd_pceNum[pce]; ++pceNum) {
		sq = brd_pList[PCEINDEX(pce,pceNum)];
		
		if(brd_material[COLOURS.BLACK] <= ENDGAME_MAT){
			score -= MedE[SQ64(sq)];
			score += pceDistance(sq, bkSq) * 4;
		} 
		else {
			score -= MedTable[MIRROR64(SQ64(sq))];
			rank = RanksBrd[sq];

			// --- กฎเม็ดคุ้มขุน ---
			if (pceDistance(sq, bkSq) <= 2) {
				score -= MedKingShield; 
			}

			// --- กฎเบี้ยผูกเม็ด ---
			// เช็คเบี้ยดำที่อยู่แนวทแยงด้านหลัง (-9 และ -11)
			var isSupported = (brd_pieces[sq - 9] == PIECES.bP || brd_pieces[sq - 11] == PIECES.bP);
			if (isSupported) {
				score -= MedSupported;
			}

			// --- กฎลงโทษเม็ดลอย ---
			// ดำบุกคือเลข Rank จะน้อยลง (เดินจาก Rank 7 ลงไป 0)
			if (rank <= 4 && !isSupported) {
				score -= MedOverextended; // ลบค่าติดลบ = คืนคะแนนเป็นบวกให้ฝ่ายขาว
			}
		}
	}
	if(pairOfMed(pce)) score -= PairOfMedBonus;
	
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

