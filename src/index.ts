class Piece {
    img: HTMLImageElement
    i: number
    j: number
    rank: string
    white: boolean = false
    pMoves: Piece[]

    constructor(img: HTMLImageElement, i: number, j: number) {
        this.img = img
        this.i = i
        this.j = j
        this.rank = ""
        this.pMoves = []
    }
    setSrc(source: string) {
        this.img.src = source
        this.white = source.includes("white")
        if (source.includes("king")) {
            this.rank = "king"
        } else if (source.includes("queen")) {
            this.rank = "queen"
        } else if (source.includes("rook")) {
            this.rank = "rook"
        } else if (source.includes("bishop")) {
            this.rank = "bishop"
        } else if (source.includes("knight")) {
            this.rank = "knight"
        } else if (source.includes("pawn")) {
            this.rank = "pawn"
        }
    }
}
const _pieces = ["rook", "knight", "bishop", "king", "queen", "bishop", "knight", "rook"]
const captureAudio = new Audio("capture.mp3")
const moveAudio = new Audio("move-self.mp3")

let _selected: Piece | null = null
let _pieceMatrix: Piece[][] = []
let _whiteToMove = true

function drawBoard() {
    let board = document.getElementById('Board')
    if (board == null) {
        return
    }
    for (let i = 0; i < 8; i++) {
        _pieceMatrix[i] = []
        for (let j = 0; j < 8; j++) {
            let img = document.createElement('img');
            if ((i + j) % 2 == 0) {
                img.className = "gridBlack"
            } else {
                img.className = "gridWhite"
            }
            img.draggable = false
            img.id = i + '_' + j
            _pieceMatrix[i][j] = new Piece(img, i, j)
            board.appendChild(img)
            img.addEventListener("click", (ev: Event) => {
                onClick(_pieceMatrix[i][j])
                console.log("click:", img.id)
            })
        }
    }
    drawPawns()
    drawPieces(_pieces)
}

function drawPawns() {
    let whiteI = 6
    let blackI = 1

    for (let j = 0; j < _pieceMatrix[0].length; j++) {
        _pieceMatrix[whiteI][j].setSrc("pieces/white/pawn.svg")
        _pieceMatrix[blackI][j].setSrc("pieces/black/pawn.svg")
    }
}
function drawPieces(pieces: string[]) {
    let startPosWhite = 7
    let startPosBlack = 0

    for (let j = 0; j < 8; j++) {
        _pieceMatrix[startPosWhite][j].setSrc("pieces/white/" + pieces[j] + ".svg")
        _pieceMatrix[startPosBlack][j].setSrc("pieces/black/" + pieces[j] + ".svg")
    }
}

function onClick(clicked: Piece) {
    let canMove = false
    calcMoves(_pieceMatrix)

    console.log("potezi za topa su:", _pieceMatrix[0][0].pMoves)
    if (_selected == null) {
        if (_whiteToMove != clicked.white) {
            return
        }
        if (clicked.img.src != "") {
            _selected = clicked
            _selected.img.classList.add("selected")
            for (let i = 0; i < _selected.pMoves.length; i++) {
                _selected.pMoves[i].img.classList.add("posibleMoves")
            }
        }
    } else {
        for (let i = 0; i < _selected.pMoves.length; i++) {
            _selected.pMoves[i].img.classList.remove("posibleMoves")
        }
        let target = clicked
        if (target.rank != "" && _selected.white == target.white) {
            _selected.img.classList.remove("selected")
            _selected = null
            return
        }
        canMove = canMoveFunc(_selected, target, _pieceMatrix)
        if (canMove) {
            if (_selected.rank == "pawn") {
                let queen = "pieces/white/queen.svg"
                let queenRes = 0

                if (!_selected.white) {
                    queenRes = 7
                    queen = "pieces/black/queen.svg"
                }

                if (target.i == queenRes) {
                    target.setSrc(queen)
                    _selected.img.removeAttribute("src")
                    _selected.rank = ""
                    canMove = false
                    resetAudio()
                    captureAudio.play()
                } else {
                    makeMove(_selected, target)
                }
            } else {
                makeMove(_selected, target)
            }
            _whiteToMove = !_whiteToMove
        }
        _selected.img.classList.remove("selected")
        _selected = null
    }
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            _pieceMatrix[i][j].pMoves = []
        }
    }
}
function canMoveFunc(_selected: Piece, target: Piece, _pieceMatrix: Piece[][]): boolean {
    let canMove = false
    if (target.rank != "" && _selected.white == target.white) {
        return false
    }
    switch (_selected.rank) {
        case "pawn":
            canMove = handlePawn(_selected, target, _pieceMatrix)
            break
        case "rook":
            canMove = handleRook(_selected, target, _pieceMatrix)
            break
        case "knight":
            canMove = handleKnight(_selected, target)
            break
        case "bishop":
            canMove = handleBishop(_selected, target, _pieceMatrix)
            break
        case "queen":
        case "king":
            canMove = handleBishop(_selected, target, _pieceMatrix)
                || handleRook(_selected, target, _pieceMatrix)
            break
    }
    return canMove
}
function makeMove(select: Piece, target: Piece) {
    if (target == select) {
        return
    }
    resetAudio()
    if (target.rank == "") {
        moveAudio.play()
    } else {
        captureAudio.play()
    }
    target.img.src = select.img.src
    target.rank = select.rank
    select.rank = ""
    target.white = select.white
    select.white = false
    select.img.removeAttribute("src")

}

function handlePawn(select: Piece, target: Piece, matrix: Piece[][]): boolean {
    let startI = 6
    let offsetI = -1
    if (!select.white) {
        offsetI = 1
        startI = 1
    }
    //move
    if (target.img.src == "") {
        if (select.i == startI && select.i + 2 * offsetI == target.i && select.j == target.j) {
            if (matrix[select.i + offsetI][select.j].rank == "") {
                return true
            }
        }
        if (select.i + offsetI == target.i && select.j == target.j) {
            return true
        }
    } else { //take
        if (select.i + offsetI == target.i && select.j + 1 == target.j) {
            return true
        }
        if (select.i + offsetI == target.i && select.j - 1 == target.j) {
            return true
        }
    }
    return false
}
function handleRook(selected: Piece, target: Piece, matrix: Piece[][]): boolean {
    let difI = selected.i - target.i
    let difJ = selected.j - target.j

    if (selected.rank == "king") {
        if (Math.abs(difI) > 1 || Math.abs(difJ) > 1) {
            return false
        }
    }

    let offsetI = 0
    let offsetJ = 0
    if (difI > 0) {
        offsetI = -1
        offsetJ = 0
    } else if (difI < 0) {
        offsetI = 1
        offsetJ = 0
    } else if (difJ > 0) {
        offsetI = 0
        offsetJ = -1
    } else if (difJ < 0) {
        offsetI = 0
        offsetJ = 1
    }

    let curI = selected.i
    let curJ = selected.j
    while (true) {
        curI = curI + offsetI
        curJ = curJ + offsetJ

        if (curJ > 7 || curJ < 0) {
            break
        }
        if (curI > 7 || curI < 0) {
            break
        }
        if (curI == target.i && curJ == target.j) {
            break
        }
        if (matrix[curI][curJ].rank != "") {
            return false
        }
    }

    if (selected.i == target.i || selected.j == target.j) {
        return true
    }
    return false
}

function handleBishop(selected: Piece, target: Piece, matrix: Piece[][]): boolean {
    let difI = selected.i - target.i
    let difJ = selected.j - target.j

    if (selected.rank == "king") {
        if (Math.abs(difI) != 1 || Math.abs(difJ) != 1) {
            return false
        }
    }

    let offsetI = 0
    let offsetJ = 0
    if (difI < 0 && difJ < 0) {
        offsetI = 1
        offsetJ = 1
    }
    if (difI < 0 && difJ > 0) {
        offsetI = 1
        offsetJ = -1
    }
    if (difI > 0 && difJ > 0) {
        offsetI = -1
        offsetJ = -1
    }
    if (difI > 0 && difJ < 0) {
        offsetI = -1
        offsetJ = 1
    }

    let curI = selected.i
    let curJ = selected.j
    while (true) {
        curI = curI + offsetI
        curJ = curJ + offsetJ

        if (curJ > 7 || curJ < 0) {
            break
        }
        if (curI > 7 || curI < 0) {
            break
        }
        if (curI == target.i && curJ == target.j) {
            break
        }
        if (matrix[curI][curJ].rank != "") {
            return false
        }
    }

    if (Math.abs(difI) == Math.abs(difJ)) {
        return true
    }
    return false
}
function handleKnight(selected: Piece, target: Piece): boolean {
    let difI = Math.abs(selected.i - target.i)
    let difJ = Math.abs(selected.j - target.j)

    if ((difI == 2 && difJ == 1) || (difI == 1 && difJ == 2)) {
        return true
    }
    return false
}
function resetAudio() {
    moveAudio.pause();
    moveAudio.currentTime = 0;
    captureAudio.pause();
    captureAudio.currentTime = 0;
}
function calcMoves(matrix: Piece[][]) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            for (let k = 0; k < 8; k++) {
                for (let p = 0; p < 8; p++) {
                    if (canMoveFunc(_pieceMatrix[i][j], _pieceMatrix[k][p], matrix)) {
                        _pieceMatrix[i][j].pMoves.push(_pieceMatrix[k][p])
                    }
                }
            }
        }
    }
}