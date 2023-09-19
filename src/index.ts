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
let pieceMatrix: Piece[][] = []
function drawBoard() {
    let board = document.getElementById('Board')
    if (board == null) {
        return
    }
    for (let i = 0; i < 8; i++) {
        pieceMatrix[i] = []
        for (let j = 0; j < 8; j++) {
            let img = document.createElement('img');
            if ((i + j) % 2 == 0) {
                img.className = "gridBlack"
            } else {
                img.className = "gridWhite"
            }
            img.id = i + '_' + j
            pieceMatrix[i][j] = new Piece(img, i, j)
            board.appendChild(img)
            img.addEventListener("click", (ev: Event) => {
                onClick(pieceMatrix[i][j])
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

    for (let j = 0; j < pieceMatrix[0].length; j++) {
        pieceMatrix[whiteI][j].setSrc("pieces/white/pawn.svg")
        pieceMatrix[blackI][j].setSrc("pieces/black/pawn.svg")
    }
}
function drawPieces() {
    //black
    pieceMatrix[0][0].setSrc("pieces/black/rook.svg")
    pieceMatrix[0][1].setSrc("pieces/black/knight.svg")
    pieceMatrix[0][2].setSrc("pieces/black/bishop.svg")
    pieceMatrix[0][3].setSrc("pieces/black/king.svg")
    pieceMatrix[0][4].setSrc("pieces/black/queen.svg")
    pieceMatrix[0][5].setSrc("pieces/black/bishop.svg")
    pieceMatrix[0][6].setSrc("pieces/black/knight.svg")
    pieceMatrix[0][7].setSrc("pieces/black/rook.svg")

    //white
    pieceMatrix[7][0].setSrc("pieces/white/rook.svg")
    pieceMatrix[7][1].setSrc("pieces/white/knight.svg")
    pieceMatrix[7][2].setSrc("pieces/white/bishop.svg")
    pieceMatrix[7][3].setSrc("pieces/white/king.svg")
    pieceMatrix[7][4].setSrc("pieces/white/queen.svg")
    pieceMatrix[7][5].setSrc("pieces/white/bishop.svg")
    pieceMatrix[7][6].setSrc("pieces/white/knight.svg")
    pieceMatrix[7][7].setSrc("pieces/white/rook.svg")
}

function onClick(clicked: Piece) {
    if (_selected == null) {
        if (clicked.img.src != "") {
            _selected = clicked
            _selected.img.classList.add("selected")
        }
    } else {
        let target = clicked
        switch (_selected.rank) {
            case "pawn":
                handlePawn(_selected, target)
                break
            case "rook":
                //code

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
        target.img.src = _selected.img.src
        _selected.img.removeAttribute("src")
        _selected.img.classList.remove("selected")
        _selected = null
    }
}

function handlePawn(_selected: Piece, target: Piece) {

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
