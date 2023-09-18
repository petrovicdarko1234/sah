"use strict";
let pieceMatrix = [];
function drawBoard() {
    let board = document.getElementById('Board');
    if (board == null) {
        return;
    }
    for (let i = 0; i < 8; i++) {
        pieceMatrix[i] = [];
        for (let j = 0; j < 8; j++) {
            let img = document.createElement('img');
            if ((i + j) % 2 == 0) {
                img.className = "gridBlack";
            }
            else {
                img.className = "gridWhite";
            }
            img.id = i + '_' + j;
            pieceMatrix[i][j] = img;
            board.appendChild(img);
        }
    }
    drawPawns();
}
function drawPawns() {
    let whiteI = 6;
    let blackI = 1;
    for (let j = 0; j < pieceMatrix[0].length; j++) {
        pieceMatrix[whiteI][j].src = "pieces/white/pawn.svg";
        pieceMatrix[blackI][j].src = "pieces/black/pawn.svg";
    }
}
//podesi sliku
/*   let img = document.createElement("img")
img.src = "path_to_svg"*/
//ukloni sliku
// select.img.removeAttribute("src")
//postavi nov
//select.img.src = "path to src"
//# sourceMappingURL=index.js.map