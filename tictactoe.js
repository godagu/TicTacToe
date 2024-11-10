
document.addEventListener('DOMContentLoaded', () => {
    const GameBoard = (() => {
        const board = Array(9).fill(null); // nine spots

        const getBoard = () => board;

        const setCell = (index, player) => {
            if (index >= 0 && index < board.length && !board[index]) {
                board[index] = player; // assign an square to a player
                return true;
            }
            return false;
        };

        const resetBoard = () => board.fill(null); // clear

        return { getBoard, setCell, resetBoard };
    })();

    const Player = (name, symbol) =>{
        return{name, symbol};
    }

    const GameController = (() => {
        const player1 = Player("Player 1", "O");
        const player2 = Player("Player 2", "X");

        let currentPlayer = player1;
        let gameOver = false;

        const switchTurn = () =>{
            currentPlayer = currentPlayer == player1 ? player2 : player1; // switch turns back and forth
            updateTurnIndicator();
        };

        const playTurn = (index) => {
            if (gameOver) return;

            requestAnimationFrame(() => {

                if (GameBoard.setCell(index, currentPlayer.symbol)){
                    render();

                    if(checkWin()){
                        requestAnimationFrame(() => {
                            showAlert(`${currentPlayer.symbol} wins!`);
                        });
                        gameOver = true;
                    }
                    else if(checkDraw()){
                        requestAnimationFrame(() => {
                            showAlert('It\'s a Draw!');
                        });
                        gameOver = true;
                    }
                    else{
                        switchTurn();
                    }
                }
            
            });


        };

        const checkWin = () => {
            const board = GameBoard.getBoard();
            const winPatterns = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
                [0, 4, 8], [2, 4, 6] //Diagonal
            ];
            return winPatterns.some(pattern => 
                pattern.every(index => board[index] === currentPlayer.symbol) // check if a winning pattern found
            );
        };

        const checkDraw = () => {
            return GameBoard.getBoard().every(cell => cell !== null); // ever
        };

        const resetGame = () => {
            GameBoard.resetBoard();
            currentPlayer = player1;
            gameOver = false;
            updateTurnIndicator();
            render();
        };

        const updateTurnIndicator = () => {
            const turnIndicator = document.getElementById('turn-indicator');
            turnIndicator.textContent = `${currentPlayer.symbol}\'s turn`;
        };

        return { playTurn, resetGame };

    })();


    const render = () => {
        const board = GameBoard.getBoard();
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.textContent = board[index] || '';  
        });
    };

    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            GameController.playTurn(index); // play turn on each click
        });
    });


    const resetButton = document.querySelector('#reset');
    resetButton.addEventListener('click', () => {
        GameController.resetGame();
        
    });

    render();



});

function showAlert(message) {
    const alertBox = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('custom-alert-message');
    const alertOkButton = document.getElementById('custom-alert-ok');
    
    alertMessage.textContent = message;
    alertBox.style.display = 'flex'; 

    alertOkButton.onclick = () => {
        alertBox.style.display = 'none';
    };
}
