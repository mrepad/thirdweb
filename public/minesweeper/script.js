document.addEventListener("DOMContentLoaded", () => {
    const boardSize = 10;
    const mineCount = 10;
    const board = document.getElementById("minesweeper-board");

    let cells;
    let mines;

    function createBoard() {
        board.innerHTML = "";
        cells = [];
        mines = [];

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener("click", handleCellClick);
                cell.addEventListener("contextmenu", handleCellRightClick);
                board.appendChild(cell);
                cells.push(cell);
            }
        }

        board.style.gridTemplateColumns = `repeat(${boardSize}, 40px)`;

        placeMines();
    }

    function placeMines() {
        let placedMines = 0;
        while (placedMines < mineCount) {
            const row = Math.floor(Math.random() * boardSize);
            const col = Math.floor(Math.random() * boardSize);
            const cell = cells.find(c => c.dataset.row == row && c.dataset.col == col);

            if (!cell.classList.contains("mine")) {
                cell.classList.add("mine");
                mines.push(cell);
                placedMines++;
            }
        }
    }

    function handleCellClick(event) {
        const cell = event.target;
        if (cell.classList.contains("revealed") || cell.classList.contains("flag")) return;

        if (cell.classList.contains("mine")) {
            revealMines();
            alert("Game Over!");
        } else {
            revealCell(cell);
        }
    }

    function handleCellRightClick(event) {
        event.preventDefault();
        const cell = event.target;
        if (cell.classList.contains("revealed")) return;

        cell.classList.toggle("flag");
    }

    function revealMines() {
        mines.forEach(mine => mine.classList.add("revealed"));
    }

    function revealCell(cell) {
        if (cell.classList.contains("revealed")) return;
        cell.classList.add("revealed");

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const adjacentCells = getAdjacentCells(row, col);
        const mineCount = adjacentCells.filter(c => c.classList.contains("mine")).length;

        if (mineCount > 0) {
            cell.textContent = mineCount;
        } else {
            adjacentCells.forEach(revealCell);
        }
    }

    function getAdjacentCells(row, col) {
        const adjacentCells = [];

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;

                const adjacentRow = row + i;
                const adjacentCol = col + j;

                if (adjacentRow >= 0 && adjacentRow < boardSize && adjacentCol >= 0 && adjacentCol < boardSize) {
                    const cell = cells.find(c => c.dataset.row == adjacentRow && c.dataset.col == adjacentCol);
                    adjacentCells.push(cell);
                }
            }
        }

        return adjacentCells;
    }

    createBoard();
});
