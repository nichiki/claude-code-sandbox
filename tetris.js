const BLOCK_SIZE = 30;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const COLORS = {
    0: '#111',
    1: '#0ff',
    2: '#00f',
    3: '#fa0',
    4: '#ff0',
    5: '#0f0',
    6: '#f0f',
    7: '#f00'
};

const PIECES = [
    [[1, 1, 1, 1]],
    [[1, 1], [1, 1]],
    [[0, 1, 0], [1, 1, 1]],
    [[1, 0, 0], [1, 1, 1]],
    [[0, 0, 1], [1, 1, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 1, 0], [0, 1, 1]]
];

let board = [];
let currentPiece = null;
let currentX = 0;
let currentY = 0;
let currentColor = 1;
let nextPiece = null;
let nextColor = 1;
let score = 0;
let level = 1;
let lines = 0;
let gameOver = false;
let paused = false;
let dropCounter = 0;
let lastTime = 0;

const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next-piece');
const nextCtx = nextCanvas.getContext('2d');

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;
nextCanvas.width = BLOCK_SIZE * 4;
nextCanvas.height = BLOCK_SIZE * 4;

function initBoard() {
    board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
}

function drawBlock(ctx, x, y, color) {
    ctx.fillStyle = COLORS[color];
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    
    if (color !== 0) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(x * BLOCK_SIZE + 2, y * BLOCK_SIZE + 2, 10, 10);
    }
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            drawBlock(ctx, x, y, board[y][x]);
        }
    }
    
    if (currentPiece) {
        for (let y = 0; y < currentPiece.length; y++) {
            for (let x = 0; x < currentPiece[y].length; x++) {
                if (currentPiece[y][x]) {
                    drawBlock(ctx, currentX + x, currentY + y, currentColor);
                }
            }
        }
    }
}

function drawNextPiece() {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    if (nextPiece) {
        const offsetX = (4 - nextPiece[0].length) / 2;
        const offsetY = (4 - nextPiece.length) / 2;
        
        for (let y = 0; y < nextPiece.length; y++) {
            for (let x = 0; x < nextPiece[y].length; x++) {
                if (nextPiece[y][x]) {
                    drawBlock(nextCtx, offsetX + x, offsetY + y, nextColor);
                }
            }
        }
    }
}

function rotate(piece) {
    const rotated = Array(piece[0].length).fill().map(() => Array(piece.length).fill(0));
    
    for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
            rotated[x][piece.length - 1 - y] = piece[y][x];
        }
    }
    
    return rotated;
}

function canMove(piece, offsetX, offsetY) {
    for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
            if (piece[y][x]) {
                const newX = currentX + x + offsetX;
                const newY = currentY + y + offsetY;
                
                if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
                    return false;
                }
                
                if (newY >= 0 && board[newY][newX]) {
                    return false;
                }
            }
        }
    }
    return true;
}

function placePiece() {
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x]) {
                if (currentY + y < 0) {
                    gameOver = true;
                    showGameOver();
                    return;
                }
                board[currentY + y][currentX + x] = currentColor;
            }
        }
    }
    
    checkLines();
    newPiece();
}

function checkLines() {
    let linesCleared = 0;
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(BOARD_WIDTH).fill(0));
            linesCleared++;
            y++;
        }
    }
    
    if (linesCleared > 0) {
        lines += linesCleared;
        score += linesCleared * 100 * level;
        
        if (linesCleared === 4) {
            score += 400 * level;
        }
        
        level = Math.floor(lines / 10) + 1;
        
        updateInfo();
    }
}

function newPiece() {
    if (nextPiece) {
        currentPiece = nextPiece;
        currentColor = nextColor;
    } else {
        const pieceIndex = Math.floor(Math.random() * PIECES.length);
        currentPiece = PIECES[pieceIndex];
        currentColor = pieceIndex + 1;
    }
    
    currentX = Math.floor((BOARD_WIDTH - currentPiece[0].length) / 2);
    currentY = 0;
    
    const nextPieceIndex = Math.floor(Math.random() * PIECES.length);
    nextPiece = PIECES[nextPieceIndex];
    nextColor = nextPieceIndex + 1;
    
    drawNextPiece();
    
    if (!canMove(currentPiece, 0, 0)) {
        gameOver = true;
        showGameOver();
    }
}

function drop() {
    if (canMove(currentPiece, 0, 1)) {
        currentY++;
    } else {
        placePiece();
    }
}

function hardDrop() {
    while (canMove(currentPiece, 0, 1)) {
        currentY++;
        score += 2;
    }
    placePiece();
    updateInfo();
}

function updateInfo() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('lines').textContent = lines;
}

function showGameOver() {
    document.getElementById('final-score').textContent = score;
    document.getElementById('game-over').style.display = 'block';
}

function resetGame() {
    initBoard();
    score = 0;
    level = 1;
    lines = 0;
    gameOver = false;
    paused = false;
    currentPiece = null;
    nextPiece = null;
    document.getElementById('game-over').style.display = 'none';
    updateInfo();
    newPiece();
}

function gameLoop(time = 0) {
    if (!gameOver && !paused) {
        const deltaTime = time - lastTime;
        lastTime = time;
        
        dropCounter += deltaTime;
        const dropInterval = Math.max(50, 1000 - (level - 1) * 100);
        
        if (dropCounter > dropInterval) {
            drop();
            dropCounter = 0;
        }
        
        drawBoard();
    }
    
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    
    if (e.key === 'p' || e.key === 'P') {
        paused = !paused;
        return;
    }
    
    if (paused) return;
    
    switch (e.key) {
        case 'ArrowLeft':
            if (canMove(currentPiece, -1, 0)) {
                currentX--;
            }
            break;
        case 'ArrowRight':
            if (canMove(currentPiece, 1, 0)) {
                currentX++;
            }
            break;
        case 'ArrowDown':
            drop();
            score++;
            updateInfo();
            break;
        case 'ArrowUp':
            const rotated = rotate(currentPiece);
            if (canMove(rotated, 0, 0)) {
                currentPiece = rotated;
            }
            break;
        case ' ':
            hardDrop();
            break;
    }
});

initBoard();
newPiece();
updateInfo();
gameLoop();