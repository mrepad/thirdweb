document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll("[data-cell]");
    const board = document.getElementById("board");
    const winningMessageElement = document.getElementById("winningMessage");
    const restartButton = document.getElementById("restartButton");
    const winnerElement = document.getElementById("winner");
    let isXTurn = true;

    const WINNING_COMBINATIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    startGame();

    restartButton.addEventListener("click", startGame);

    function startGame() {
        isXTurn = true;
        cells.forEach(cell => {
            cell.classList.remove("x");
            cell.classList.remove("o");
            cell.removeEventListener("click", handleClick);
            cell.addEventListener("click", handleClick, { once: true });
        });
        setBoardHoverClass();
        winningMessageElement.classList.add("hidden");
    }

    function handleClick(e) {
        const cell = e.target;
        const currentClass = isXTurn ? "x" : "o";
        placeMark(cell, currentClass);
        if (checkWin(currentClass)) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            swapTurns();
            setBoardHoverClass();
        }
    }

    function endGame(draw) {
        if (draw) {
            winnerElement.innerText = "Draw!";
        } else {
            winnerElement.innerText = `${isXTurn ? "X" : "O"}`;
        }
        winningMessageElement.classList.remove("hidden");
    }

    function isDraw() {
        return [...cells].every(cell => {
            return cell.classList.contains("x") || cell.classList.contains("o");
        });
    }

    function placeMark(cell, currentClass) {
        cell.classList.add(currentClass);
    }

    function swapTurns() {
        isXTurn = !isXTurn;
    }

    function setBoardHoverClass() {
        board.classList.remove("x");
        board.classList.remove("o");
        if (isXTurn) {
            board.classList.add("x");
        } else {
            board.classList.add("o");
        }
    }

    function checkWin(currentClass) {
        return WINNING_COMBINATIONS.some(combination => {
            return combination.every(index => {
                return cells[index].classList.contains(currentClass);
            });
        });
    }
});
