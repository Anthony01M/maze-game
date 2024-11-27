document.addEventListener('DOMContentLoaded', () => {
    const maze = document.getElementById('maze');
    const rows = 15;
    const cols = 15;
    const visibilityRadius = 2;
    let playerPosition = { x: 0, y: 0 };
    let level = 1;

    const generateMaze = () => {
        maze.innerHTML = '';

        maze.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
        maze.style.gridTemplateRows = `repeat(${rows}, 30px)`;

        const grid = Array.from({ length: rows }, () => Array(cols).fill(0));
        const cells = [];

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell', 'hidden');
                cell.dataset.x = x;
                cell.dataset.y = y;
                maze.appendChild(cell);
                cells.push(cell);
            }
        }

        const stack = [{ x: 0, y: 0 }];
        const directions = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 }
        ];

        while (stack.length > 0) {
            const current = stack.pop();
            const { x, y } = current;
            grid[y][x] = 1;

            directions.sort(() => Math.random() - 0.5);

            for (const { x: dx, y: dy } of directions) {
                const nx = x + dx * 2;
                const ny = y + dy * 2;

                if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && grid[ny][nx] === 0) {
                    grid[y + dy][x + dx] = 1;
                    grid[ny][nx] = 1;
                    stack.push({ x: nx, y: ny });
                }
            }
        }

        cells.forEach(cell => {
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);
            if (grid[y][x] === 0) {
                cell.classList.add('obstacle');
            }
        });

        const player = document.createElement('div');
        player.classList.add('player');
        cells[0].appendChild(player);

        let exitX = cols - 1;
        let exitY = rows - 1;
        while (grid[exitY][exitX] === 0) {
            exitX--;
            if (exitX < 0) {
                exitX = cols - 1;
                exitY--;
            }
        }
        const exitCell = document.querySelector(`.cell[data-x="${exitX}"][data-y="${exitY}"]`);
        exitCell.classList.add('exit');

        playerPosition = { x: 0, y: 0 };

        updateVisibility(playerPosition);
    };

    const updateVisibility = (position) => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);
            const distance = Math.abs(x - position.x) + Math.abs(y - position.y);
            if (distance <= visibilityRadius) {
                cell.classList.remove('hidden');
            } else {
                cell.classList.add('hidden');
            }
        });
    };

    const checkForExit = (position) => {
        const exitCell = document.querySelector('.exit');
        const exitX = parseInt(exitCell.dataset.x);
        const exitY = parseInt(exitCell.dataset.y);
        if (position.x === exitX && position.y === exitY) {
            level++;
            alert(`Level ${level - 1} completed! Moving to level ${level}.`);
            generateMaze();
        }
    };

    document.addEventListener('keydown', (e) => {
        const key = e.key;
        let newPosition = { ...playerPosition };

        switch (key) {
            case 'ArrowUp':
                if (playerPosition.y > 0) newPosition.y -= 1;
                break;
            case 'ArrowDown':
                if (playerPosition.y < rows - 1) newPosition.y += 1;
                break;
            case 'ArrowLeft':
                if (playerPosition.x > 0) newPosition.x -= 1;
                break;
            case 'ArrowRight':
                if (playerPosition.x < cols - 1) newPosition.x += 1;
                break;
        }

        const newCell = document.querySelector(`.cell[data-x="${newPosition.x}"][data-y="${newPosition.y}"]`);
        if (!newCell.classList.contains('obstacle')) {
            const player = document.querySelector('.player');
            const currentCell = document.querySelector(`.cell[data-x="${playerPosition.x}"][data-y="${playerPosition.y}"]`);
            if (currentCell.contains(player)) {
                currentCell.removeChild(player);
            }
            newCell.appendChild(player);
            playerPosition = newPosition;
            updateVisibility(playerPosition);
            checkForExit(playerPosition);
        }
    });

    generateMaze();
});