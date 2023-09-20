class Piece {
    img: HTMLImageElement
    i: number
    j: number
    rank: string
    white: boolean = false

    constructor(img: HTMLImageElement, i: number, j: number) {
        this.img = img
        this.i = i
        this.j = j
        this.rank = ""
    }
    setSrc(source: string) {
        this.img.src = source
        if (source.includes("white")) {
            this.white = true
        }
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
let pieces = ["rook", "knight", "bishop", "king", "queen", "bishop", "knight", "rook"]
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
    drawPieces(pieces)
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
    let target = null
    if (_selected == null) {
        if (clicked.img.src != "") {
            _selected = clicked
            _selected.img.classList.add("selected")
        }
    } else {
        target = clicked
        switch (_selected.rank) {
            case "pawn":
                canMove = handlePawn(_selected, target, _pieceMatrix)
                if (canMove) {
                    //handle queen res
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
                        _selected.white = false
                        canMove = false
                    }
                }
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
                canMove = (handleBishop(_selected, target, _pieceMatrix) || handleRook(_selected, target, _pieceMatrix))
                break
            case "king":
                canMove = (handleBishop(_selected, target, _pieceMatrix) || handleRook(_selected, target, _pieceMatrix))
                break
        }

        if (canMove) {
            makeMove(target)
        }
        _selected.img.classList.remove("selected")
        _selected = null
        canMove = false
    }
}
function makeMove(p: Piece) {
    if (_selected != null) {
        let target = p
        if (target == _selected) {
            return
        }
        if (_whiteToMove == _selected.white) {

            target.img.src = _selected.img.src
            target.rank = _selected.rank
            _selected.rank = ""
            target.white = _selected.white
            _selected.white = false
            _selected.img.removeAttribute("src")
            _whiteToMove = !_whiteToMove
        } else {
            console.log("Not your turn")
        }
    }
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
        if (select.white == target.white) {
            return false
        }
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


    if (target.rank != "" && selected.white == target.white) {
        return false
    }

    let difI = selected.i - target.i
    let difJ = selected.j - target.j

    if (selected.rank == "king") {
        if (Math.abs(selected.i - target.i) > 1 || Math.abs(selected.j - target.j) > 1) {
            console.log("uslov za kralja kod topovu funkciju")
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
            console.log("ima nesto ispred kod topa")
            return false
        }
    }

    if (selected.i == target.i || selected.j == target.j) {
        return true
    }
    console.log("kraj od topovu funkciju")
    return false
}

function handleBishop(selected: Piece, target: Piece, matrix: Piece[][]): boolean {
    let difI = selected.i - target.i
    let difJ = selected.j - target.j

    if (target.rank != "" && selected.white == target.white) {
        return false
    }

    if (selected.rank == "king") {
        if (Math.abs(selected.i - target.i) != 1 || Math.abs(selected.j - target.j) != 1) {
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

    if (Math.abs(selected.i - target.i) == Math.abs(selected.j - target.j)) {
        return true
    }
    return false
}
function handleKnight(selected: Piece, target: Piece): boolean {
    let difI = Math.abs(selected.i - target.i)
    let difJ = Math.abs(selected.j - target.j)

    if (target.rank != "" && selected.white == target.white) {
        return false
    }

    if ((difI == 2 && difJ == 1) || (difI == 1 && difJ == 2)) {
        return true
    }
    return false
}
