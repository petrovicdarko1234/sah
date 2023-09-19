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

let _selected: Piece | null = null
let _pieceMatrix: Piece[][] = []

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
    drawPieces()
}

function drawPawns() {
    let whiteI = 6
    let blackI = 1

    for (let j = 0; j < _pieceMatrix[0].length; j++) {
        _pieceMatrix[whiteI][j].setSrc("pieces/white/pawn.svg")
        _pieceMatrix[blackI][j].setSrc("pieces/black/pawn.svg")
    }
}
function drawPieces() {
    //black
    _pieceMatrix[0][0].setSrc("pieces/black/rook.svg")
    _pieceMatrix[0][1].setSrc("pieces/black/knight.svg")
    _pieceMatrix[0][2].setSrc("pieces/black/bishop.svg")
    _pieceMatrix[0][3].setSrc("pieces/black/king.svg")
    _pieceMatrix[0][4].setSrc("pieces/black/queen.svg")
    _pieceMatrix[0][5].setSrc("pieces/black/bishop.svg")
    _pieceMatrix[0][6].setSrc("pieces/black/knight.svg")
    _pieceMatrix[0][7].setSrc("pieces/black/rook.svg")

    //white
    _pieceMatrix[7][0].setSrc("pieces/white/rook.svg")
    _pieceMatrix[7][1].setSrc("pieces/white/knight.svg")
    _pieceMatrix[7][2].setSrc("pieces/white/bishop.svg")
    _pieceMatrix[7][3].setSrc("pieces/white/king.svg")
    _pieceMatrix[7][4].setSrc("pieces/white/queen.svg")
    _pieceMatrix[7][5].setSrc("pieces/white/bishop.svg")
    _pieceMatrix[7][6].setSrc("pieces/white/knight.svg")
    _pieceMatrix[7][7].setSrc("pieces/white/rook.svg")
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
                canMove = handlePawn(_selected, target)
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
                        canMove = false
                    }
                }
                break
            case "rook":
                canMove = handleRook(_selected, target)
                break
            case "knight":
                //code
                break
            case "bishop":
                //code
                break
            case "queen":
                //code
                break
            case "king":
                //code
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
        target.img.src = _selected.img.src
        target.rank = _selected.rank
        _selected.rank = ""
        target.white = _selected.white
        _selected.white = false
        _selected.img.removeAttribute("src")
    }
}

function handlePawn(select: Piece, target: Piece): boolean {
    let startI = 6
    let offsetI = -1
    if (!select.white) {
        offsetI = 1
        startI = 1
    }

    //move
    if (target.img.src == "") {
        if (select.i == startI && select.i + 2 * offsetI == target.i && select.j == target.j) {
            return true
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
function handleRook(_selected: Piece, t: Piece): boolean {
    let selected = _selected
    let target = t

    if (target.rank != "" && selected.white == target.white) {
        return false
    }

    let difI = selected.i - target.i
    let difJ = selected.j - target.j

    let offsetI = 0
    let offsetJ = 0

    if (difI > 0) {
        offsetI = 1
        offsetJ = 0
    } else if (difI < 0) {
        offsetI = -1
        offsetJ = 0
    } else if (difJ > 0) {
        offsetI = 0
        offsetJ = 1
    } else if (difJ < 0) {
        offsetI = 0
        offsetJ = -1
    }
    while (true) {
        selected.i = selected.i + offsetI
        selected.j = selected.j + offsetJ

        if (selected.i == target.i && selected.j == target.j) {
            break
        }
    }

    if (selected.i == target.i || selected.j == target.j) {
        return true
    }

    return false
}

//podesi sliku
/*   let img = document.createElement("img")
img.src = "path_to_svg"*/

//ukloni sliku
// select.img.removeAttribute("src")
//postavi nov
//select.img.src = "path to src"

//on cick
//   img.addEventListener("click", (ev: Event) => {
//  console.log("click:", img.id)
//})
