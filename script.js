const maxAttempts = 10;
let targetNumber;
let attempts;
let bestScores = [null, null, null]; 

const inputField = document.getElementById('gameInput');
const attemptsDisplay = document.getElementById('attemptsCount');
const historyContainer = document.getElementById('historialContainer');
const gameStateMessage = document.getElementById('mensaje');
const gameBtn = document.getElementById('gameButton');
const btnReiniciar = document.getElementById('btnReiniciar');
const sabiasque = document.getElementById('sabiasque');
const rankScores = document.querySelectorAll('.rank-score');

function startGame() {
    targetNumber = Math.floor(Math.random() * 100) + 1;
    console.log("🤫 (DEBUG) El número secreto es:", targetNumber);
    attempts = 0;
    
    inputField.value = '';
    attemptsDisplay.textContent = attempts;
    historyContainer.innerHTML = ''; // Como "Historial:" está en el HTML fuera de este div, no se borra.
    
    updateGameState('🎯 ¡Nuevo juego! Adivina el número...', '#ff33aa');
    sabiasque.textContent = 'Si adivinas, tienes una intuición asombrosa!';
    
    gameBtn.disabled = false;
    btnReiniciar.style.display = 'none';
    inputField.focus();
}

function updateGameState(message, color) {
    gameStateMessage.textContent = message;
    gameStateMessage.style.color = color;
    gameStateMessage.style.textShadow = `0 0 10px ${color}`;
}

function addGuessToHistory(guess, isCorrect, isHigh) {
    const badge = document.createElement('span');
    badge.className = 'history-badge';
    badge.textContent = guess;
    
    if (isCorrect) {
        badge.style.color = '#00ff00';
    } else if (isHigh) {
        badge.style.color = '#ff3333';
    } else {
        badge.style.color = '#33ffff';
    }
    
    historyContainer.appendChild(badge);
}

function updateDragonScores(nuevoScore) {
    bestScores.push(nuevoScore);
    bestScores.sort((a, b) => {
        if (a === null) return 1;
        if (b === null) return -1;
        return a - b;
    });
    bestScores = bestScores.slice(0, 3); 

    rankScores.forEach((scoreSpan, index) => {
        scoreSpan.textContent = bestScores[index] !== null ? `${bestScores[index]} intentos` : '? intentos';
    });
}

function checkGuess() {
    const guess = parseInt(inputField.value);

    if (isNaN(guess) || guess < 1 || guess > 100) {
        updateGameState('⚠️ Número inválido. (1 a 100)', '#ff9900');
        return;
    }

    attempts++;
    attemptsDisplay.textContent = attempts;

    if (guess === targetNumber) {
        addGuessToHistory(guess, true, false);
        updateGameState(`🎉 ¡Felicidades! Era el ${targetNumber}.`, '#00ff00');
        sabiasque.innerHTML = '¡Asombroso! Tienes intuición de dragón 🔥🐉';
        
        gameBtn.disabled = true;
        btnReiniciar.style.display = 'block';
        updateDragonScores(attempts);
        
    } else {
        addGuessToHistory(guess, false, guess > targetNumber);
        
        if (attempts >= maxAttempts) {
            updateGameState(`😔 ¡Game Over! El número era ${targetNumber}.`, '#ff3333');
            gameBtn.disabled = true;
            btnReiniciar.style.display = 'block';
        } else {
            if (guess < targetNumber) {
                updateGameState('📉 Demasiado bajo...', '#ff33aa');
            } else {
                updateGameState('📈 Demasiado alto...', '#ff33aa');
            }
        }
    }

    inputField.value = ''; 
    inputField.focus();
}

// Inicializar y Eventos
startGame(); 
gameBtn.addEventListener('click', checkGuess);
btnReiniciar.addEventListener('click', startGame);
inputField.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !gameBtn.disabled) {
        checkGuess();
    }
});
// --- Prevención en tiempo real ---
inputField.addEventListener('input', function () {
    // Si escribe un número mayor a 100, lo fijamos en 100 automáticamente
    if (this.value > 100) {
        this.value = 100;
    }
    // Si intenta poner un número negativo o 0, vaciamos la caja
    if (this.value !== "" && this.value < 1) {
        this.value = "";
    }
});