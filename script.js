// Add this to the top of your script.js file
const translations = {
    en: {
        title: "Sudoku Solver",
        validate: "Validate Puzzle",
        solve: "Solve Puzzle",
        clear: "Clear Board",
        created: "Created by",
        validMessage: "Current puzzle configuration is valid!",
        invalidMessage: "Invalid puzzle configuration! Check for duplicate numbers.",
        minCluesMessage: "At least 17 numbers are required to solve a Sudoku puzzle!",
        solvedMessage: "Puzzle solved successfully!",
        noSolutionMessage: "No solution exists for this puzzle!",
        clearConfirm: "Are you sure you want to clear the board?",
        solveConfirm: "Are you sure you want to solve the puzzle?",
        clearedMessage: "Board cleared!"
    },
    tr: {
        title: "Sudoku Çözücü",
        validate: "Bulmacayı Doğrula",
        solve: "Bulmacayı Çöz",
        clear: "Tahtayı Temizle",
        created: "Created by",
        validMessage: "Mevcut bulmaca yapılandırması geçerli!",
        invalidMessage: "Geçersiz bulmaca yapılandırması! Yinelenen sayıları kontrol edin.",
        minCluesMessage: "Bir Sudoku bulmacasını çözmek için en az 17 sayı gereklidir!",
        solvedMessage: "Bulmaca başarıyla çözüldü!",
        noSolutionMessage: "Bu bulmaca için çözüm yok!",
        clearConfirm: "Tahtayı temizlemek istediğinizden emin misiniz?",
        solveConfirm: "Bulmacayı çözmek istediğinizden emin misiniz?",
        clearedMessage: "Tahta temizlendi!"
    }
};

let currentLang = 'en';

function updateLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('.translate').forEach(element => {
        const key = element.getAttribute('data-tr');
        if (key) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
}

// Add language button event listeners
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        updateLanguage(e.target.getAttribute('data-lang'));
    });
});

// Update message functions to use translations
function showMessage(key, color) {
    const message = document.getElementById('message');
    message.textContent = translations[currentLang][key];
    message.style.color = color;
}

// Initialize 9x9 grid
let grid = Array(9).fill().map(() => Array(9).fill(0));

// Function to get values from input fields into the grid
function updateGridFromInput() {
    const inputs = document.querySelectorAll('input');
    let index = 0;
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const value = inputs[index].value;
            grid[i][j] = value === '' ? 0 : parseInt(value);
            index++;
        }
    }
}

// Function to check if a number is valid in a specific position
function isValid(grid, row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num) {
            return false;
        }
    }
    
    // Check column
    for (let x = 0; x < 9; x++) {
        if (grid[x][col] === num) {
            return false;
        }
    }
    
    // Check 3x3 box
    let startRow = row - row % 3;
    let startCol = col - col % 3;
    
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i + startRow][j + startCol] === num) {
                return false;
            }
        }
    }
    
    return true;
}

// Function to find an empty cell in the grid
function findEmpty(grid) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] === 0) {
                return [i, j];  // row, col
            }
        }
    }
    return null;  // No empty cell found
}

// Function to update the visual grid from our array
function updateInputFromGrid() {
    const inputs = document.querySelectorAll('input');
    let index = 0;
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            inputs[index].value = grid[i][j] === 0 ? '' : grid[i][j];
            index++;
        }
    }
}

// Function to solve the Sudoku using backtracking
function solveSudoku(grid) {
    const emptySpot = findEmpty(grid);
    
    // If no empty spot is found, puzzle is solved
    if (!emptySpot) {
        return true;
    }

    const [row, col] = emptySpot;

    // Try digits 1-9
    for (let num = 1; num <= 9; num++) {
        // Check if number can be placed
        if (isValid(grid, row, col, num)) {
            grid[row][col] = num;

            // Recursively try to solve the rest
            if (solveSudoku(grid)) {
                return true;
            }

            // If placing num didn't lead to a solution, backtrack
            grid[row][col] = 0;
        }
    }
    
    return false;
}

// Add this new function to check the entire board
function validateBoard() {
    updateGridFromInput();
    
    // Check each filled cell
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            let currentNum = grid[row][col];
            if (currentNum !== 0) {  // If cell is not empty
                // Temporarily remove the number to check if it's valid
                grid[row][col] = 0;
                if (!isValid(grid, row, col, currentNum)) {
                    grid[row][col] = currentNum;  // Restore the number
                    return false;
                }
                grid[row][col] = currentNum;  // Restore the number
            }
        }
    }
    return true;
}

// Add this function to count filled cells
function countFilledCells() {
    updateGridFromInput();
    let count = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] !== 0) {
                count++;
            }
        }
    }
    return count;
}

// Event listeners for buttons
document.getElementById('validate-btn').addEventListener('click', function() {
    updateGridFromInput();
    if (validateBoard()) {
        showMessage('validMessage', 'green');
    } else {
        showMessage('invalidMessage', 'red');
    }
});

document.getElementById('clear-btn').addEventListener('click', function() {
    if (confirm(translations[currentLang].clearConfirm)) {
        grid = Array(9).fill().map(() => Array(9).fill(0));
        updateInputFromGrid();
        showMessage('clearedMessage', 'blue');
    }
});

document.getElementById('solve-btn').addEventListener('click', function() {
    // First check if we have enough clues
    if (countFilledCells() < 17) {
        showMessage('minCluesMessage', 'red');
        return;
    }

    // If enough clues, proceed with confirmation
    if (confirm(translations[currentLang].solveConfirm)) {
        updateGridFromInput();
        
        if (solveSudoku(grid)) {
            updateInputFromGrid();
            showMessage('solvedMessage', 'green');
        } else {
            showMessage('noSolutionMessage', 'red');
        }
    }
}); 