# Code Citations

## License: unknown
https://github.com/Homi/homi.github.io/blob/2abb4b7fad3dbba8f04478760d32337a494beb3d/bj-makruk/js/gui.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square
```


## License: unknown
https://github.com/Homi/homi.github.io/blob/2abb4b7fad3dbba8f04478760d32337a494beb3d/bj-makruk/js/gui.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square
```


## License: unknown
https://github.com/Homi/homi.github.io/blob/2abb4b7fad3dbba8f04478760d32337a494beb3d/bj-makruk/js/gui.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square
```


## License: unknown
https://github.com/Homi/homi.github.io/blob/2abb4b7fad3dbba8f04478760d32337a494beb3d/bj-makruk/js/gui.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square
```


## License: unknown
https://github.com/Homi/homi.github.io/blob/2abb4b7fad3dbba8f04478760d32337a494beb3d/bj-makruk/js/gui.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square
```


## License: unknown
https://github.com/Homi/homi.github.io/blob/2abb4b7fad3dbba8f04478760d32337a494beb3d/bj-makruk/js/gui.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square index
	imageString = "<image src=\"" + pieceFileName + "\" class
```


## License: unknown
https://github.com/Homi/homi.github.io/blob/2abb4b7fad3dbba8f04478760d32337a494beb3d/bj-makruk/js/gui.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square index
	imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\" data-sq=\"" + sq + "\"/>";
	$("#Board").append(imageString);
}

// ใน MoveGUIPiece():
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
	
	// ใช้ data-sq แทน position() calculation
	$( ".Piece[data-sq='" + flippedFrom + "']" ).each(function( index ) {
		$(this).removeClass();
		$(this).addClass("Piece clickElement " + rankName + " " + fileName);
		$(this).attr("data-sq", square);  // อัพเดต square index
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
	
	SetSqSelected(LastMove.From);
	SetSqSelected(LastMove.To);
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
}

function RemoveGUIPiece(sq) {
	// ใช้ data-sq selector แทน position()
	$( ".Piece[data-sq='" + sq + "']" ).remove();
}
````

---

### 4. **CheckAndSet() - ตรวจ AutoMove flag**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function CheckAndSet() {
	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE;
		
		computer
```


## License: unknown
https://github.com/Homi/homi.github.io/blob/2abb4b7fad3dbba8f04478760d32337a494beb3d/bj-makruk/js/gui.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square index
	imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\" data-sq=\"" + sq + "\"/>";
	$("#Board").append(imageString);
}

// ใน MoveGUIPiece():
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
	
	// ใช้ data-sq แทน position() calculation
	$( ".Piece[data-sq='" + flippedFrom + "']" ).each(function( index ) {
		$(this).removeClass();
		$(this).addClass("Piece clickElement " + rankName + " " + fileName);
		$(this).attr("data-sq", square);  // อัพเดต square index
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
	
	SetSqSelected(LastMove.From);
	SetSqSelected(LastMove.To);
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
}

function RemoveGUIPiece(sq) {
	// ใช้ data-sq selector แทน position()
	$( ".Piece[data-sq='" + sq + "']" ).remove();
}
````

---

### 4. **CheckAndSet() - ตรวจ AutoMove flag**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function CheckAndSet() {
	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE;
		
		computer
```


## License: unknown
https://github.com/Homi/homi.github.io/blob/2abb4b7fad3dbba8f04478760d32337a494beb3d/bj-makruk/js/gui.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square index
	imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\" data-sq=\"" + sq + "\"/>";
	$("#Board").append(imageString);
}

// ใน MoveGUIPiece():
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
	
	// ใช้ data-sq แทน position() calculation
	$( ".Piece[data-sq='" + flippedFrom + "']" ).each(function( index ) {
		$(this).removeClass();
		$(this).addClass("Piece clickElement " + rankName + " " + fileName);
		$(this).attr("data-sq", square);  // อัพเดต square index
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
	
	SetSqSelected(LastMove.From);
	SetSqSelected(LastMove.To);
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
}

function RemoveGUIPiece(sq) {
	// ใช้ data-sq selector แทน position()
	$( ".Piece[data-sq='" + sq + "']" ).remove();
}
````

---

### 4. **CheckAndSet() - ตรวจ AutoMove flag**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function CheckAndSet() {
	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE;
		
		computer
```


## License: unknown
https://github.com/shadowvz96/shadowvz96.github.io/blob/adda7a0124590aac862702fac94c2c8d4deec0e1/hackmult/pages/Ch/js/guiMultiPlayer.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square index
	imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\" data-sq=\"" + sq + "\"/>";
	$("#Board").append(imageString);
}

// ใน MoveGUIPiece():
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
	
	// ใช้ data-sq แทน position() calculation
	$( ".Piece[data-sq='" + flippedFrom + "']" ).each(function( index ) {
		$(this).removeClass();
		$(this).addClass("Piece clickElement " + rankName + " " + fileName);
		$(this).attr("data-sq", square);  // อัพเดต square index
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
	
	SetSqSelected(LastMove.From);
	SetSqSelected(LastMove.To);
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
}

function RemoveGUIPiece(sq) {
	// ใช้ data-sq selector แทน position()
	$( ".Piece[data-sq='" + sq + "']" ).remove();
}
````

---

### 4. **CheckAndSet() - ตรวจ AutoMove flag**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function CheckAndSet() {
	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE;
		
		computerPlay = BOOL.FALSE;
		GameController.autoMove = BOOL.FALSE;  // ✓ แก้แล้ว
		$("#AutoMove").text("Auto Move");
	}
	// ...existing code...
}
````

✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

---

### 5. **TakeButton** - Reset honour flags ไม่สมบูรณ์
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text
```


## License: unknown
https://github.com/shadowvz96/shadowvz96.github.io/blob/adda7a0124590aac862702fac94c2c8d4deec0e1/hackmult/pages/Ch/js/guiMultiPlayer.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square index
	imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\" data-sq=\"" + sq + "\"/>";
	$("#Board").append(imageString);
}

// ใน MoveGUIPiece():
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
	
	// ใช้ data-sq แทน position() calculation
	$( ".Piece[data-sq='" + flippedFrom + "']" ).each(function( index ) {
		$(this).removeClass();
		$(this).addClass("Piece clickElement " + rankName + " " + fileName);
		$(this).attr("data-sq", square);  // อัพเดต square index
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
	
	SetSqSelected(LastMove.From);
	SetSqSelected(LastMove.To);
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
}

function RemoveGUIPiece(sq) {
	// ใช้ data-sq selector แทน position()
	$( ".Piece[data-sq='" + sq + "']" ).remove();
}
````

---

### 4. **CheckAndSet() - ตรวจ AutoMove flag**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function CheckAndSet() {
	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE;
		
		computerPlay = BOOL.FALSE;
		GameController.autoMove = BOOL.FALSE;  // ✓ แก้แล้ว
		$("#AutoMove").text("Auto Move");
	}
	// ...existing code...
}
````

✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

---

### 5. **TakeButton** - Reset honour flags ไม่สมบูรณ์
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text
```


## License: unknown
https://github.com/shadowvz96/shadowvz96.github.io/blob/adda7a0124590aac862702fac94c2c8d4deec0e1/hackmult/pages/Ch/js/guiMultiPlayer.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square index
	imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\" data-sq=\"" + sq + "\"/>";
	$("#Board").append(imageString);
}

// ใน MoveGUIPiece():
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
	
	// ใช้ data-sq แทน position() calculation
	$( ".Piece[data-sq='" + flippedFrom + "']" ).each(function( index ) {
		$(this).removeClass();
		$(this).addClass("Piece clickElement " + rankName + " " + fileName);
		$(this).attr("data-sq", square);  // อัพเดต square index
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
	
	SetSqSelected(LastMove.From);
	SetSqSelected(LastMove.To);
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
}

function RemoveGUIPiece(sq) {
	// ใช้ data-sq selector แทน position()
	$( ".Piece[data-sq='" + sq + "']" ).remove();
}
````

---

### 4. **CheckAndSet() - ตรวจ AutoMove flag**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function CheckAndSet() {
	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE;
		
		computerPlay = BOOL.FALSE;
		GameController.autoMove = BOOL.FALSE;  // ✓ แก้แล้ว
		$("#AutoMove").text("Auto Move");
	}
	// ...existing code...
}
````

✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

---

### 5. **TakeButton** - Reset honour flags ไม่สมบูรณ์
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text
```


## License: unknown
https://github.com/Homi/homi.github.io/blob/2abb4b7fad3dbba8f04478760d32337a494beb3d/bj-makruk/js/gui.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square index
	imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\" data-sq=\"" + sq + "\"/>";
	$("#Board").append(imageString);
}

// ใน MoveGUIPiece():
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
	
	// ใช้ data-sq แทน position() calculation
	$( ".Piece[data-sq='" + flippedFrom + "']" ).each(function( index ) {
		$(this).removeClass();
		$(this).addClass("Piece clickElement " + rankName + " " + fileName);
		$(this).attr("data-sq", square);  // อัพเดต square index
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
	
	SetSqSelected(LastMove.From);
	SetSqSelected(LastMove.To);
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
}

function RemoveGUIPiece(sq) {
	// ใช้ data-sq selector แทน position()
	$( ".Piece[data-sq='" + sq + "']" ).remove();
}
````

---

### 4. **CheckAndSet() - ตรวจ AutoMove flag**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function CheckAndSet() {
	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE;
		
		computerPlay = BOOL.FALSE;
		GameController.autoMove = BOOL.FALSE;  // ✓ แก้แล้ว
		$("#AutoMove").text("Auto Move");
	}
	// ...existing code...
}
````

✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

---

### 5. **TakeButton** - Reset honour flags ไม่สมบูรณ์
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// BUG: Logic ไม่ถูก - ควรรีเซ็ต flags
		brd_PHV_count = brd_HR_count;  // ← ใช้เก่าค่า HR_count ไม่ถูก
		if(brd_HR_flag){
			if(brd_HR_piece == 'K')
				BHV_flag = BOOL.TRUE;
			else 
				PHV_flag = BOOL.TRUE;
		}
		// ควรเพิ่ม:
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		brd_BHV_count = 0;
		brd_PHV_count = 0;
		
		$("#GameStatus").text("");
		$("#PHVCountSpan").text(""); 
		$("#BHVCountSpan").text("");  // เพิ่ม
	}
});
````

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearTh
```


## License: unknown
https://github.com/Homi/homi.github.io/blob/2abb4b7fad3dbba8f04478760d32337a494beb3d/bj-makruk/js/gui.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square index
	imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\" data-sq=\"" + sq + "\"/>";
	$("#Board").append(imageString);
}

// ใน MoveGUIPiece():
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
	
	// ใช้ data-sq แทน position() calculation
	$( ".Piece[data-sq='" + flippedFrom + "']" ).each(function( index ) {
		$(this).removeClass();
		$(this).addClass("Piece clickElement " + rankName + " " + fileName);
		$(this).attr("data-sq", square);  // อัพเดต square index
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
	
	SetSqSelected(LastMove.From);
	SetSqSelected(LastMove.To);
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
}

function RemoveGUIPiece(sq) {
	// ใช้ data-sq selector แทน position()
	$( ".Piece[data-sq='" + sq + "']" ).remove();
}
````

---

### 4. **CheckAndSet() - ตรวจ AutoMove flag**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function CheckAndSet() {
	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE;
		
		computerPlay = BOOL.FALSE;
		GameController.autoMove = BOOL.FALSE;  // ✓ แก้แล้ว
		$("#AutoMove").text("Auto Move");
	}
	// ...existing code...
}
````

✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

---

### 5. **TakeButton** - Reset honour flags ไม่สมบูรณ์
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// BUG: Logic ไม่ถูก - ควรรีเซ็ต flags
		brd_PHV_count = brd_HR_count;  // ← ใช้เก่าค่า HR_count ไม่ถูก
		if(brd_HR_flag){
			if(brd_HR_piece == 'K')
				BHV_flag = BOOL.TRUE;
			else 
				PHV_flag = BOOL.TRUE;
		}
		// ควรเพิ่ม:
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		brd_BHV_count = 0;
		brd_PHV_count = 0;
		
		$("#GameStatus").text("");
		$("#PHVCountSpan").text(""); 
		$("#BHVCountSpan").text("");  // เพิ่ม
	}
});
````

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearTh
```


## License: unknown
https://github.com/Homi/homi.github.io/blob/2abb4b7fad3dbba8f04478760d32337a494beb3d/bj-makruk/js/gui.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square index
	imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\" data-sq=\"" + sq + "\"/>";
	$("#Board").append(imageString);
}

// ใน MoveGUIPiece():
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
	
	// ใช้ data-sq แทน position() calculation
	$( ".Piece[data-sq='" + flippedFrom + "']" ).each(function( index ) {
		$(this).removeClass();
		$(this).addClass("Piece clickElement " + rankName + " " + fileName);
		$(this).attr("data-sq", square);  // อัพเดต square index
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
	
	SetSqSelected(LastMove.From);
	SetSqSelected(LastMove.To);
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
}

function RemoveGUIPiece(sq) {
	// ใช้ data-sq selector แทน position()
	$( ".Piece[data-sq='" + sq + "']" ).remove();
}
````

---

### 4. **CheckAndSet() - ตรวจ AutoMove flag**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function CheckAndSet() {
	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE;
		
		computerPlay = BOOL.FALSE;
		GameController.autoMove = BOOL.FALSE;  // ✓ แก้แล้ว
		$("#AutoMove").text("Auto Move");
	}
	// ...existing code...
}
````

✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

---

### 5. **TakeButton** - Reset honour flags ไม่สมบูรณ์
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// BUG: Logic ไม่ถูก - ควรรีเซ็ต flags
		brd_PHV_count = brd_HR_count;  // ← ใช้เก่าค่า HR_count ไม่ถูก
		if(brd_HR_flag){
			if(brd_HR_piece == 'K')
				BHV_flag = BOOL.TRUE;
			else 
				PHV_flag = BOOL.TRUE;
		}
		// ควรเพิ่ม:
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		brd_BHV_count = 0;
		brd_PHV_count = 0;
		
		$("#GameStatus").text("");
		$("#PHVCountSpan").text(""); 
		$("#BHVCountSpan").text("");  // เพิ่ม
	}
});
````

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearTh
```


## License: unknown
https://github.com/Homi/homi.github.io/blob/2abb4b7fad3dbba8f04478760d32337a494beb3d/bj-makruk/js/gui.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square index
	imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\" data-sq=\"" + sq + "\"/>";
	$("#Board").append(imageString);
}

// ใน MoveGUIPiece():
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
	
	// ใช้ data-sq แทน position() calculation
	$( ".Piece[data-sq='" + flippedFrom + "']" ).each(function( index ) {
		$(this).removeClass();
		$(this).addClass("Piece clickElement " + rankName + " " + fileName);
		$(this).attr("data-sq", square);  // อัพเดต square index
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
	
	SetSqSelected(LastMove.From);
	SetSqSelected(LastMove.To);
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
}

function RemoveGUIPiece(sq) {
	// ใช้ data-sq selector แทน position()
	$( ".Piece[data-sq='" + sq + "']" ).remove();
}
````

---

### 4. **CheckAndSet() - ตรวจ AutoMove flag**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function CheckAndSet() {
	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE;
		
		computerPlay = BOOL.FALSE;
		GameController.autoMove = BOOL.FALSE;  // ✓ แก้แล้ว
		$("#AutoMove").text("Auto Move");
	}
	// ...existing code...
}
````

✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

---

### 5. **TakeButton** - Reset honour flags ไม่สมบูรณ์
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// BUG: Logic ไม่ถูก - ควรรีเซ็ต flags
		brd_PHV_count = brd_HR_count;  // ← ใช้เก่าค่า HR_count ไม่ถูก
		if(brd_HR_flag){
			if(brd_HR_piece == 'K')
				BHV_flag = BOOL.TRUE;
			else 
				PHV_flag = BOOL.TRUE;
		}
		// ควรเพิ่ม:
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		brd_BHV_count = 0;
		brd_PHV_count = 0;
		
		$("#GameStatus").text("");
		$("#PHVCountSpan").text(""); 
		$("#BHVCountSpan").text("");  // เพิ่ม
	}
});
````

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearTh
```


## License: unknown
https://github.com/shadowvz96/shadowvz96.github.io/blob/adda7a0124590aac862702fac94c2c8d4deec0e1/hackmult/pages/Ch/js/guiMultiPlayer.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square index
	imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\" data-sq=\"" + sq + "\"/>";
	$("#Board").append(imageString);
}

// ใน MoveGUIPiece():
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
	
	// ใช้ data-sq แทน position() calculation
	$( ".Piece[data-sq='" + flippedFrom + "']" ).each(function( index ) {
		$(this).removeClass();
		$(this).addClass("Piece clickElement " + rankName + " " + fileName);
		$(this).attr("data-sq", square);  // อัพเดต square index
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
	
	SetSqSelected(LastMove.From);
	SetSqSelected(LastMove.To);
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
}

function RemoveGUIPiece(sq) {
	// ใช้ data-sq selector แทน position()
	$( ".Piece[data-sq='" + sq + "']" ).remove();
}
````

---

### 4. **CheckAndSet() - ตรวจ AutoMove flag**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function CheckAndSet() {
	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE;
		
		computerPlay = BOOL.FALSE;
		GameController.autoMove = BOOL.FALSE;  // ✓ แก้แล้ว
		$("#AutoMove").text("Auto Move");
	}
	// ...existing code...
}
````

✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

---

### 5. **TakeButton** - Reset honour flags ไม่สมบูรณ์
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// BUG: Logic ไม่ถูก - ควรรีเซ็ต flags
		brd_PHV_count = brd_HR_count;  // ← ใช้เก่าค่า HR_count ไม่ถูก
		if(brd_HR_flag){
			if(brd_HR_piece == 'K')
				BHV_flag = BOOL.TRUE;
			else 
				PHV_flag = BOOL.TRUE;
		}
		// ควรเพิ่ม:
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		brd_BHV_count = 0;
		brd_PHV_count = 0;
		
		$("#GameStatus").text("");
		$("#PHVCountSpan").text(""); 
		$("#BHVCountSpan").text("");  // เพิ่ม
	}
});
````

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// รีเซ็ต honour flags ให้ถูกต้อง
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		
```


## License: unknown
https://github.com/shadowvz96/shadowvz96.github.io/blob/adda7a0124590aac862702fac94c2c8d4deec0e1/hackmult/pages/Ch/js/guiMultiPlayer.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square index
	imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\" data-sq=\"" + sq + "\"/>";
	$("#Board").append(imageString);
}

// ใน MoveGUIPiece():
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
	
	// ใช้ data-sq แทน position() calculation
	$( ".Piece[data-sq='" + flippedFrom + "']" ).each(function( index ) {
		$(this).removeClass();
		$(this).addClass("Piece clickElement " + rankName + " " + fileName);
		$(this).attr("data-sq", square);  // อัพเดต square index
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
	
	SetSqSelected(LastMove.From);
	SetSqSelected(LastMove.To);
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
}

function RemoveGUIPiece(sq) {
	// ใช้ data-sq selector แทน position()
	$( ".Piece[data-sq='" + sq + "']" ).remove();
}
````

---

### 4. **CheckAndSet() - ตรวจ AutoMove flag**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function CheckAndSet() {
	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE;
		
		computerPlay = BOOL.FALSE;
		GameController.autoMove = BOOL.FALSE;  // ✓ แก้แล้ว
		$("#AutoMove").text("Auto Move");
	}
	// ...existing code...
}
````

✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

---

### 5. **TakeButton** - Reset honour flags ไม่สมบูรณ์
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// BUG: Logic ไม่ถูก - ควรรีเซ็ต flags
		brd_PHV_count = brd_HR_count;  // ← ใช้เก่าค่า HR_count ไม่ถูก
		if(brd_HR_flag){
			if(brd_HR_piece == 'K')
				BHV_flag = BOOL.TRUE;
			else 
				PHV_flag = BOOL.TRUE;
		}
		// ควรเพิ่ม:
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		brd_BHV_count = 0;
		brd_PHV_count = 0;
		
		$("#GameStatus").text("");
		$("#PHVCountSpan").text(""); 
		$("#BHVCountSpan").text("");  // เพิ่ม
	}
});
````

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// รีเซ็ต honour flags ให้ถูกต้อง
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		
```


## License: unknown
https://github.com/Homi/homi.github.io/blob/2abb4b7fad3dbba8f04478760d32337a494beb3d/bj-makruk/js/gui.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square index
	imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\" data-sq=\"" + sq + "\"/>";
	$("#Board").append(imageString);
}

// ใน MoveGUIPiece():
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
	
	// ใช้ data-sq แทน position() calculation
	$( ".Piece[data-sq='" + flippedFrom + "']" ).each(function( index ) {
		$(this).removeClass();
		$(this).addClass("Piece clickElement " + rankName + " " + fileName);
		$(this).attr("data-sq", square);  // อัพเดต square index
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
	
	SetSqSelected(LastMove.From);
	SetSqSelected(LastMove.To);
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
}

function RemoveGUIPiece(sq) {
	// ใช้ data-sq selector แทน position()
	$( ".Piece[data-sq='" + sq + "']" ).remove();
}
````

---

### 4. **CheckAndSet() - ตรวจ AutoMove flag**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function CheckAndSet() {
	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE;
		
		computerPlay = BOOL.FALSE;
		GameController.autoMove = BOOL.FALSE;  // ✓ แก้แล้ว
		$("#AutoMove").text("Auto Move");
	}
	// ...existing code...
}
````

✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

---

### 5. **TakeButton** - Reset honour flags ไม่สมบูรณ์
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// BUG: Logic ไม่ถูก - ควรรีเซ็ต flags
		brd_PHV_count = brd_HR_count;  // ← ใช้เก่าค่า HR_count ไม่ถูก
		if(brd_HR_flag){
			if(brd_HR_piece == 'K')
				BHV_flag = BOOL.TRUE;
			else 
				PHV_flag = BOOL.TRUE;
		}
		// ควรเพิ่ม:
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		brd_BHV_count = 0;
		brd_PHV_count = 0;
		
		$("#GameStatus").text("");
		$("#PHVCountSpan").text(""); 
		$("#BHVCountSpan").text("");  // เพิ่ม
	}
});
````

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// รีเซ็ต honour flags ให้ถูกต้อง
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		
```


## License: unknown
https://github.com/shadowvz96/shadowvz96.github.io/blob/adda7a0124590aac862702fac94c2c8d4deec0e1/hackmult/pages/Ch/js/guiMultiPlayer.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square index
	imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\" data-sq=\"" + sq + "\"/>";
	$("#Board").append(imageString);
}

// ใน MoveGUIPiece():
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
	
	// ใช้ data-sq แทน position() calculation
	$( ".Piece[data-sq='" + flippedFrom + "']" ).each(function( index ) {
		$(this).removeClass();
		$(this).addClass("Piece clickElement " + rankName + " " + fileName);
		$(this).attr("data-sq", square);  // อัพเดต square index
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
	
	SetSqSelected(LastMove.From);
	SetSqSelected(LastMove.To);
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
}

function RemoveGUIPiece(sq) {
	// ใช้ data-sq selector แทน position()
	$( ".Piece[data-sq='" + sq + "']" ).remove();
}
````

---

### 4. **CheckAndSet() - ตรวจ AutoMove flag**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function CheckAndSet() {
	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE;
		
		computerPlay = BOOL.FALSE;
		GameController.autoMove = BOOL.FALSE;  // ✓ แก้แล้ว
		$("#AutoMove").text("Auto Move");
	}
	// ...existing code...
}
````

✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

---

### 5. **TakeButton** - Reset honour flags ไม่สมบูรณ์
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// BUG: Logic ไม่ถูก - ควรรีเซ็ต flags
		brd_PHV_count = brd_HR_count;  // ← ใช้เก่าค่า HR_count ไม่ถูก
		if(brd_HR_flag){
			if(brd_HR_piece == 'K')
				BHV_flag = BOOL.TRUE;
			else 
				PHV_flag = BOOL.TRUE;
		}
		// ควรเพิ่ม:
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		brd_BHV_count = 0;
		brd_PHV_count = 0;
		
		$("#GameStatus").text("");
		$("#PHVCountSpan").text(""); 
		$("#BHVCountSpan").text("");  // เพิ่ม
	}
});
````

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// รีเซ็ต honour flags ให้ถูกต้อง
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		
```


## License: unknown
https://github.com/Homi/homi.github.io/blob/2abb4b7fad3dbba8f04478760d32337a494beb3d/bj-makruk/js/gui.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square index
	imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\" data-sq=\"" + sq + "\"/>";
	$("#Board").append(imageString);
}

// ใน MoveGUIPiece():
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
	
	// ใช้ data-sq แทน position() calculation
	$( ".Piece[data-sq='" + flippedFrom + "']" ).each(function( index ) {
		$(this).removeClass();
		$(this).addClass("Piece clickElement " + rankName + " " + fileName);
		$(this).attr("data-sq", square);  // อัพเดต square index
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
	
	SetSqSelected(LastMove.From);
	SetSqSelected(LastMove.To);
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
}

function RemoveGUIPiece(sq) {
	// ใช้ data-sq selector แทน position()
	$( ".Piece[data-sq='" + sq + "']" ).remove();
}
````

---

### 4. **CheckAndSet() - ตรวจ AutoMove flag**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function CheckAndSet() {
	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE;
		
		computerPlay = BOOL.FALSE;
		GameController.autoMove = BOOL.FALSE;  // ✓ แก้แล้ว
		$("#AutoMove").text("Auto Move");
	}
	// ...existing code...
}
````

✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

---

### 5. **TakeButton** - Reset honour flags ไม่สมบูรณ์
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// BUG: Logic ไม่ถูก - ควรรีเซ็ต flags
		brd_PHV_count = brd_HR_count;  // ← ใช้เก่าค่า HR_count ไม่ถูก
		if(brd_HR_flag){
			if(brd_HR_piece == 'K')
				BHV_flag = BOOL.TRUE;
			else 
				PHV_flag = BOOL.TRUE;
		}
		// ควรเพิ่ม:
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		brd_BHV_count = 0;
		brd_PHV_count = 0;
		
		$("#GameStatus").text("");
		$("#PHVCountSpan").text(""); 
		$("#BHVCountSpan").text("");  // เพิ่ม
	}
});
````

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// รีเซ็ต honour flags ให้ถูกต้อง
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		
```


## License: unknown
https://github.com/Homi/homi.github.io/blob/2abb4b7fad3dbba8f04478760d32337a494beb3d/bj-makruk/js/gui.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square index
	imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\" data-sq=\"" + sq + "\"/>";
	$("#Board").append(imageString);
}

// ใน MoveGUIPiece():
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
	
	// ใช้ data-sq แทน position() calculation
	$( ".Piece[data-sq='" + flippedFrom + "']" ).each(function( index ) {
		$(this).removeClass();
		$(this).addClass("Piece clickElement " + rankName + " " + fileName);
		$(this).attr("data-sq", square);  // อัพเดต square index
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
	
	SetSqSelected(LastMove.From);
	SetSqSelected(LastMove.To);
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
}

function RemoveGUIPiece(sq) {
	// ใช้ data-sq selector แทน position()
	$( ".Piece[data-sq='" + sq + "']" ).remove();
}
````

---

### 4. **CheckAndSet() - ตรวจ AutoMove flag**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function CheckAndSet() {
	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE;
		
		computerPlay = BOOL.FALSE;
		GameController.autoMove = BOOL.FALSE;  // ✓ แก้แล้ว
		$("#AutoMove").text("Auto Move");
	}
	// ...existing code...
}
````

✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

---

### 5. **TakeButton** - Reset honour flags ไม่สมบูรณ์
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// BUG: Logic ไม่ถูก - ควรรีเซ็ต flags
		brd_PHV_count = brd_HR_count;  // ← ใช้เก่าค่า HR_count ไม่ถูก
		if(brd_HR_flag){
			if(brd_HR_piece == 'K')
				BHV_flag = BOOL.TRUE;
			else 
				PHV_flag = BOOL.TRUE;
		}
		// ควรเพิ่ม:
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		brd_BHV_count = 0;
		brd_PHV_count = 0;
		
		$("#GameStatus").text("");
		$("#PHVCountSpan").text(""); 
		$("#BHVCountSpan").text("");  // เพิ่ม
	}
});
````

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// รีเซ็ต honour flags ให้ถูกต้อง
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		brd_BHV_count = 0;
		brd_PHV_count = 0;
		brd_HR_flag = 0;
		
		$("#GameStatus").text("");
		$("#PHVCountSpan").text(""); 
		$("#BHVCountSpan").text("");
	}
});
````

---

### 6. **RemoveGUIPiece / SetSqSelected / DeselectSq - Rounding Issue**
````javascript
// ทั้ง 3 ฟังก์ชันใช้ position().top/60 
// ¶ เป
```


## License: unknown
https://github.com/Homi/homi.github.io/blob/2abb4b7fad3dbba8f04478760d32337a494beb3d/bj-makruk/js/gui.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square index
	imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\" data-sq=\"" + sq + "\"/>";
	$("#Board").append(imageString);
}

// ใน MoveGUIPiece():
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
	
	// ใช้ data-sq แทน position() calculation
	$( ".Piece[data-sq='" + flippedFrom + "']" ).each(function( index ) {
		$(this).removeClass();
		$(this).addClass("Piece clickElement " + rankName + " " + fileName);
		$(this).attr("data-sq", square);  // อัพเดต square index
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
	
	SetSqSelected(LastMove.From);
	SetSqSelected(LastMove.To);
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
}

function RemoveGUIPiece(sq) {
	// ใช้ data-sq selector แทน position()
	$( ".Piece[data-sq='" + sq + "']" ).remove();
}
````

---

### 4. **CheckAndSet() - ตรวจ AutoMove flag**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function CheckAndSet() {
	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE;
		
		computerPlay = BOOL.FALSE;
		GameController.autoMove = BOOL.FALSE;  // ✓ แก้แล้ว
		$("#AutoMove").text("Auto Move");
	}
	// ...existing code...
}
````

✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

---

### 5. **TakeButton** - Reset honour flags ไม่สมบูรณ์
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// BUG: Logic ไม่ถูก - ควรรีเซ็ต flags
		brd_PHV_count = brd_HR_count;  // ← ใช้เก่าค่า HR_count ไม่ถูก
		if(brd_HR_flag){
			if(brd_HR_piece == 'K')
				BHV_flag = BOOL.TRUE;
			else 
				PHV_flag = BOOL.TRUE;
		}
		// ควรเพิ่ม:
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		brd_BHV_count = 0;
		brd_PHV_count = 0;
		
		$("#GameStatus").text("");
		$("#PHVCountSpan").text(""); 
		$("#BHVCountSpan").text("");  // เพิ่ม
	}
});
````

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// รีเซ็ต honour flags ให้ถูกต้อง
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		brd_BHV_count = 0;
		brd_PHV_count = 0;
		brd_HR_flag = 0;
		
		$("#GameStatus").text("");
		$("#PHVCountSpan").text(""); 
		$("#BHVCountSpan").text("");
	}
});
````

---

### 6. **RemoveGUIPiece / SetSqSelected / DeselectSq - Rounding Issue**
````javascript
// ทั้ง 3 ฟังก์ชันใช้ position().top/60 
// ¶ เป
```


## License: unknown
https://github.com/Homi/homi.github.io/blob/2abb4b7fad3dbba8f04478760d32337a494beb3d/bj-makruk/js/gui.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square index
	imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\" data-sq=\"" + sq + "\"/>";
	$("#Board").append(imageString);
}

// ใน MoveGUIPiece():
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
	
	// ใช้ data-sq แทน position() calculation
	$( ".Piece[data-sq='" + flippedFrom + "']" ).each(function( index ) {
		$(this).removeClass();
		$(this).addClass("Piece clickElement " + rankName + " " + fileName);
		$(this).attr("data-sq", square);  // อัพเดต square index
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
	
	SetSqSelected(LastMove.From);
	SetSqSelected(LastMove.To);
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
}

function RemoveGUIPiece(sq) {
	// ใช้ data-sq selector แทน position()
	$( ".Piece[data-sq='" + sq + "']" ).remove();
}
````

---

### 4. **CheckAndSet() - ตรวจ AutoMove flag**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function CheckAndSet() {
	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE;
		
		computerPlay = BOOL.FALSE;
		GameController.autoMove = BOOL.FALSE;  // ✓ แก้แล้ว
		$("#AutoMove").text("Auto Move");
	}
	// ...existing code...
}
````

✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

---

### 5. **TakeButton** - Reset honour flags ไม่สมบูรณ์
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// BUG: Logic ไม่ถูก - ควรรีเซ็ต flags
		brd_PHV_count = brd_HR_count;  // ← ใช้เก่าค่า HR_count ไม่ถูก
		if(brd_HR_flag){
			if(brd_HR_piece == 'K')
				BHV_flag = BOOL.TRUE;
			else 
				PHV_flag = BOOL.TRUE;
		}
		// ควรเพิ่ม:
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		brd_BHV_count = 0;
		brd_PHV_count = 0;
		
		$("#GameStatus").text("");
		$("#PHVCountSpan").text(""); 
		$("#BHVCountSpan").text("");  // เพิ่ม
	}
});
````

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// รีเซ็ต honour flags ให้ถูกต้อง
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		brd_BHV_count = 0;
		brd_PHV_count = 0;
		brd_HR_flag = 0;
		
		$("#GameStatus").text("");
		$("#PHVCountSpan").text(""); 
		$("#BHVCountSpan").text("");
	}
});
````

---

### 6. **RemoveGUIPiece / SetSqSelected / DeselectSq - Rounding Issue**
````javascript
// ทั้ง 3 ฟังก์ชันใช้ position().top/60 
// ¶ เป
```


## License: unknown
https://github.com/Homi/homi.github.io/blob/2abb4b7fad3dbba8f04478760d32337a494beb3d/bj-makruk/js/gui.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square index
	imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\" data-sq=\"" + sq + "\"/>";
	$("#Board").append(imageString);
}

// ใน MoveGUIPiece():
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
	
	// ใช้ data-sq แทน position() calculation
	$( ".Piece[data-sq='" + flippedFrom + "']" ).each(function( index ) {
		$(this).removeClass();
		$(this).addClass("Piece clickElement " + rankName + " " + fileName);
		$(this).attr("data-sq", square);  // อัพเดต square index
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
	
	SetSqSelected(LastMove.From);
	SetSqSelected(LastMove.To);
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
}

function RemoveGUIPiece(sq) {
	// ใช้ data-sq selector แทน position()
	$( ".Piece[data-sq='" + sq + "']" ).remove();
}
````

---

### 4. **CheckAndSet() - ตรวจ AutoMove flag**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function CheckAndSet() {
	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE;
		
		computerPlay = BOOL.FALSE;
		GameController.autoMove = BOOL.FALSE;  // ✓ แก้แล้ว
		$("#AutoMove").text("Auto Move");
	}
	// ...existing code...
}
````

✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

---

### 5. **TakeButton** - Reset honour flags ไม่สมบูรณ์
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// BUG: Logic ไม่ถูก - ควรรีเซ็ต flags
		brd_PHV_count = brd_HR_count;  // ← ใช้เก่าค่า HR_count ไม่ถูก
		if(brd_HR_flag){
			if(brd_HR_piece == 'K')
				BHV_flag = BOOL.TRUE;
			else 
				PHV_flag = BOOL.TRUE;
		}
		// ควรเพิ่ม:
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		brd_BHV_count = 0;
		brd_PHV_count = 0;
		
		$("#GameStatus").text("");
		$("#PHVCountSpan").text(""); 
		$("#BHVCountSpan").text("");  // เพิ่ม
	}
});
````

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// รีเซ็ต honour flags ให้ถูกต้อง
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		brd_BHV_count = 0;
		brd_PHV_count = 0;
		brd_HR_flag = 0;
		
		$("#GameStatus").text("");
		$("#PHVCountSpan").text(""); 
		$("#BHVCountSpan").text("");
	}
});
````

---

### 6. **RemoveGUIPiece / SetSqSelected / DeselectSq - Rounding Issue**
````javascript
// ทั้ง 3 ฟังก์ชันใช้ position().top/60 
// ¶ เป
```


## License: unknown
https://github.com/Homi/homi.github.io/blob/2abb4b7fad3dbba8f04478760d32337a494beb3d/bj-makruk/js/gui.js

```
# วิเคราะห์ gui.js - ค้นหาบั๊ก

## บั๊ก Critical ที่พบ

### 1. **StartSearch() - ไม่ตรวจ srch_best validity**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function StartSearch() {
	if(setupBoard == BOOL.TRUE) return;
	srch_depth = MAXDEPTH;
	var t = $.now();
	var tt = $('#ThinkTimeChoice').val();
	console.log("time:" + t + " TimeChoice:" + tt);
	srch_time = parseInt(tt) * 1000;
	
	SearchPosition(); 
	
	GameController.EngineSide = brd_side;
	
	// BUG: ถ้า srch_best == NOMOVE จะเกิด error
	if(srch_best == NOMOVE) {
		console.log("Error: No valid move found");
		CheckAndSet();
		return;
	}
	
	MakeMove(srch_best);
	MoveGUIPiece(srch_best);	
	
	$('#ThinkingPng').remove();
	
	CheckAndSet();
}
````

**ปัญหา:** ถ้า `SearchPosition()` ไม่หาการเคลื่อน → `srch_best = NOMOVE` → `MakeMove(NOMOVE)` crash

---

### 2. **check_honour_ruls() - ประสิทธิภาพและโลจิก**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// บรรทัดประมาณ 63
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
// ✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

// แต่เปลี่ยนจาก == ให้ถูกต้อง:
// BUG: BHV_flag == BOOL.FALSE;  ← เปรียบเทียบ ไม่ใช่ assignment
// FIX:
if(BHV_flag == BOOL.TRUE) BHV_flag = BOOL.FALSE;
````

ใน code ไฟล์ปัจจุบันแล้วแก้แล้ว ✓

---

### 3. **MoveGUIPiece() - ประสิทธิภาพ Position Calculation**
````javascript
// บรรทัด ~360
$( ".Piece" ).each(function( index ) {
 if( (RanksBrd[flippedFrom] == 7 - Math.round($(this).position().top/60)) && 
     (FilesBrd[flippedFrom] == Math.round($(this).position().left/60)) ){
     // ...
 }
});
````

**ปัญหา:** 
- `Math.round()` อาจให้ค่าผิด เนื่อง rounding error หรือ sub-pixel positioning
- **แนะนำ:** ใช้ `Math.floor()` หรือเพิ่ม data attribute

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
// ในฟังก์ชัน AddGUIPiece() เพิ่ม data attribute:
function AddGUIPiece(sq,pce) {	
	var rank = RanksBrd[sq];
	var file = FilesBrd[sq];
	var rankName = "rank" + (rank + 1);	
	var fileName = "file" + (file + 1);	
	pieceFileName = "images/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
	// เพิ่ม data-square เก็บ square index
	imageString = "<image src=\"" + pieceFileName + "\" class=\"Piece clickElement " + rankName + " " + fileName + "\" data-sq=\"" + sq + "\"/>";
	$("#Board").append(imageString);
}

// ใน MoveGUIPiece():
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
	
	// ใช้ data-sq แทน position() calculation
	$( ".Piece[data-sq='" + flippedFrom + "']" ).each(function( index ) {
		$(this).removeClass();
		$(this).addClass("Piece clickElement " + rankName + " " + fileName);
		$(this).attr("data-sq", square);  // อัพเดต square index
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
	
	SetSqSelected(LastMove.From);
	SetSqSelected(LastMove.To);
	
	computerPlay = (Opponent == "comp")?BOOL.TRUE:BOOL.FALSE;
}

function RemoveGUIPiece(sq) {
	// ใช้ data-sq selector แทน position()
	$( ".Piece[data-sq='" + sq + "']" ).remove();
}
````

---

### 4. **CheckAndSet() - ตรวจ AutoMove flag**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
function CheckAndSet() {
	if(CheckResult() != BOOL.TRUE) {
		GameController.GameOver = BOOL.FALSE;
		$("#GameStatus").text('');		
	} else {
		GameController.GameOver = BOOL.TRUE;
		GameController.GameSaved = BOOL.TRUE;
		
		computerPlay = BOOL.FALSE;
		GameController.autoMove = BOOL.FALSE;  // ✓ แก้แล้ว
		$("#AutoMove").text("Auto Move");
	}
	// ...existing code...
}
````

✓ แก้แล้ว (ใช้ = ไม่ใช่ ==)

---

### 5. **TakeButton** - Reset honour flags ไม่สมบูรณ์
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// BUG: Logic ไม่ถูก - ควรรีเซ็ต flags
		brd_PHV_count = brd_HR_count;  // ← ใช้เก่าค่า HR_count ไม่ถูก
		if(brd_HR_flag){
			if(brd_HR_piece == 'K')
				BHV_flag = BOOL.TRUE;
			else 
				PHV_flag = BOOL.TRUE;
		}
		// ควรเพิ่ม:
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		brd_BHV_count = 0;
		brd_PHV_count = 0;
		
		$("#GameStatus").text("");
		$("#PHVCountSpan").text(""); 
		$("#BHVCountSpan").text("");  // เพิ่ม
	}
});
````

**แก้ไข:**
````javascript
// filepath: d:\Dev\HTML\Homi\homi.github.io\bj-makruk\js\gui.js
$("#TakeButton").click(function () {
	console.log('TakeBack request... brd_hisPly:' + brd_hisPly);
	if(brd_hisPly > 0) {
		TakeMove();
		brd_ply = 0;
		clearThinking();
		SetInitialBoardPieces();
		$("#currentFenSpan").text(BoardToFen());
		if(Show == BOOL.TRUE) $("#moveHistory").text(" " + printGameLine());
		
		// รีเซ็ต honour flags ให้ถูกต้อง
		BHV_flag = BOOL.FALSE;
		PHV_flag = BOOL.FALSE;
		brd_BHV_count = 0;
		brd_PHV_count = 0;
		brd_HR_flag = 0;
		
		$("#GameStatus").text("");
		$("#PHVCountSpan").text(""); 
		$("#BHVCountSpan").text("");
	}
});
````

---

### 6. **RemoveGUIPiece / SetSqSelected / DeselectSq - Rounding Issue**
````javascript
// ทั้ง 3 ฟังก์ชันใช้ position().top/60 
// ¶ เป
```

