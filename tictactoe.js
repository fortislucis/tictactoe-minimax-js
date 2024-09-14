class TicTacToe{
    constructor(depth){
        this.depth = depth || 3;
        this.reset();
    }

    reset(){
        this.tiles = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];

        this.isPlayerTurn = true;
        this.isFinished = false;
    }

    nextTurn(){
        if(!this.isMovesLeft() || this.checkWin(this.getSymbol())){
            this.isFinished = true;
        }

        if(!this.isFinished){
            this.isPlayerTurn = !this.isPlayerTurn;

            // AI move
            if(!this.isPlayerTurn){
                const bestMove = this.minimax(this.depth, -Infinity, Infinity, true);
                this.place(bestMove.move.x, bestMove.move.y);
            }
        }
    }

    place(x, y){
        if(!this.isFinished){
            this.tiles[x][y] = this.getSymbol();
            this.nextTurn();
        }
    }

    getSymbol(opposite){
        if(opposite){
            return this.isPlayerTurn ? 'O' : 'X';
        } else{
            return this.isPlayerTurn ? 'X' : 'O';
        }
    }

    minimax(depth, alpha, beta, isMaximizingPlayer) {
        if (depth === 0 || this.checkWin(this.getSymbol()) || this.checkWin(this.getSymbol(true)) || !this.isMovesLeft()) {
            return { score: this.evaluateBoard(), move: null };
        }
    
        let bestMove;
        const moves = this.getLegalMoves();
        
        if (isMaximizingPlayer) {
            let maxScore = -Infinity;
            for (let move of moves) {
                this.tiles[move.x][move.y] = this.getSymbol();
                let result = this.minimax(depth - 1, alpha, beta, false);
                this.tiles[move.x][move.y] = null;
                
                if (result.score > maxScore) {
                    maxScore = result.score;
                    bestMove = move;
                }
                alpha = Math.max(alpha, result.score);
                if (beta <= alpha) break;
            }
            return { score: maxScore, move: bestMove };
        } else {
            let minScore = Infinity;
            for (let move of moves) {
                this.tiles[move.x][move.y] = this.getSymbol(true);
                let result = this.minimax(depth - 1, alpha, beta, true);
                this.tiles[move.x][move.y] = null;
                
                if (result.score < minScore) {
                    minScore = result.score;
                    bestMove = move;
                }
                beta = Math.min(beta, result.score);
                if (beta <= alpha) break;
            }
            return { score: minScore, move: bestMove };
        }
    }

    getLegalMoves() {
        const moves = [];
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                if (this.tiles[x][y] === null) {
                    moves.push({x, y});
                }
            }
        }
        return moves;
    }
    
    evaluateBoard() {
        if (this.checkWin(this.getSymbol())) return 10; // AI wins
        if (this.checkWin(this.getSymbol(true))) return -10; // Player wins
        return this.evaluatePosition(); // Evaluate the current board state
    }

    evaluatePosition() {
        let score = 0;
        // Check rows, columns, and diagonals
        for (let i = 0; i < 3; i++) {
            score += this.evaluateLine(this.tiles[i][0], this.tiles[i][1], this.tiles[i][2]); // Row
            score += this.evaluateLine(this.tiles[0][i], this.tiles[1][i], this.tiles[2][i]); // Column
        }
        score += this.evaluateLine(this.tiles[0][0], this.tiles[1][1], this.tiles[2][2]); // Diagonal
        score += this.evaluateLine(this.tiles[0][2], this.tiles[1][1], this.tiles[2][0]); // Diagonal
        return score;
    }
    
    evaluateLine(cell1, cell2, cell3) {
        let score = 0;
        const aiSymbol = this.getSymbol();
        const playerSymbol = this.getSymbol(true);
        
        if (cell1 === aiSymbol) score++;
        else if (cell1 === playerSymbol) score--;
        if (cell2 === aiSymbol) score++;
        else if (cell2 === playerSymbol) score--;
        if (cell3 === aiSymbol) score++;
        else if (cell3 === playerSymbol) score--;
        
        if (score === 2 && (cell1 === null || cell2 === null || cell3 === null)) score *= 2;
        if (score === -2 && (cell1 === null || cell2 === null || cell3 === null)) score *= 2;
        
        return score;
    }

    isMovesLeft(){
        for(let y = 0; y < 3; y++){
            for(let x = 0; x < 3; x++){
                if(this.tiles[x][y] === null){
                    return true;
                }
            }
        }
        return false;
    }

    checkWin(symbol) {
        return this.checkVertical(symbol) || this.checkHorizontal(symbol) || this.checkDiagonal(symbol);
    }

    checkVertical(symbol) {
        for (let x = 0; x < 3; x++) {
            let count = 0;
            for (let y = 0; y < 3; y++) {
                if (this.tiles[x][y] === symbol) {
                    count++;
                }
            }
            if (count === 3) return true;
        }
        return false;
    }
    
    checkHorizontal(symbol) {
        for (let y = 0; y < 3; y++) {
            let count = 0;
            for (let x = 0; x < 3; x++) {
                if (this.tiles[x][y] === symbol) {
                    count++;
                }
            }
            if (count === 3) return true;
        }
        return false;
    }
    

    checkDiagonal(symbol) {
        let majorDiagonal = true;
        let minorDiagonal = true;
    
        for (let i = 0; i < 3; i++) {
            if (this.tiles[i][i] !== symbol) {
                majorDiagonal = false;
            }
            if (this.tiles[i][2 - i] !== symbol) {
                minorDiagonal = false;
            }
        }
        return majorDiagonal || minorDiagonal;
    }
}


(()=>{
    const game = new TicTacToe(6);
    const tiles = document.getElementsByClassName('tile');
    const resetButton = document.getElementById('reset-button');

    function boardSetup(){
        let n = 0
        for(let x = 0; x < 3; x++){
            for(let y = 0; y < 3; y++){
                const tile = tiles[x+y+n*2];
                tile.addEventListener('click', ()=>{
                    game.place(x, y);
                    boardRefresh();
                })
            }
            n++;
        }

        resetButton.addEventListener('click', ()=>{
            game.reset();
            boardRefresh();
        })
    }

    function boardRefresh(){
        let n = 0
        for(let x = 0; x < 3; x++){
            for(let y = 0; y < 3; y++){
                const tile = tiles[x+y+n*2];
                const symbol = game.tiles[x][y];
                if(symbol === 'X'){
                    tile.classList.add("cross");
                } else if(symbol === 'O'){
                    tile.classList.add("naught");
                } else{
                    tile.classList.remove("cross");
                    tile.classList.remove("naught");
                }
            }
            n++;
        }
    }

    boardSetup();
})();
