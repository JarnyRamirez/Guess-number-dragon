const maxAttempts = 10;
let targetNumber;
let attempts;
let bestScores = [null, null, null]; 

// IDs basados en tu estructura HTML de vidrio
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
    historyContainer.innerHTML = ''; 
    
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

// --- TU FUNCIÓN DE PISTAS (Única fuente de verdad) ---
function obtenerPista(intento, secreto) {
    let diferencia = Math.abs(intento - secreto);

    if (diferencia <= 5) {
        return '🔥 ¡Muy cerca!';
    } else if (diferencia <= 15) {
        return '♨️ Caliente';
    } else if (diferencia <= 30) {
        return '🌤️ Tibio';
    } else {
        return '❄️ Frío';
    }
}

function checkGuess() {
    const guess = parseInt(inputField.value);

    // Validación de entrada
    if (isNaN(guess) || guess < 1 || guess > 100) {
        updateGameState('⚠️ Ingresa del 1 al 100', '#ff9900');
        return;
    }

    attempts++;
    attemptsDisplay.textContent = attempts;

    // Lógica de Historial (Solo el número)
    const badge = document.createElement('span');
    badge.className = 'history-badge';
    badge.textContent = guess;
    historyContainer.appendChild(badge);

    if (guess === targetNumber) {
        // VICTORIA
        updateGameState(`🎉 ¡Correcto! Era el ${targetNumber}.`, '#00ff00');
        sabiasque.innerHTML = '¡Asombroso! Tienes intuición de dragón 🔥🐉';
        gameBtn.disabled = true;
        btnReiniciar.style.display = 'inline-block';
        updateDragonScores(attempts);
        
    } else if (attempts >= maxAttempts) {
        // DERROTA
        updateGameState(`😔 Game Over. Era el ${targetNumber}.`, '#ff3333');
        gameBtn.disabled = true;
        btnReiniciar.style.display = 'inline-block';
        
    } else {
        // PISTA ÚNICA (Solo temperatura)
        let pista = obtenerPista(guess, targetNumber);
        updateGameState(pista, '#ff33aa');
    }

    inputField.value = ''; 
    inputField.focus();
}

// --- Ranking y Prevención ---
function updateDragonScores(nuevoScore) {
    bestScores.push(nuevoScore);
    bestScores.sort((a, b) => (a === null ? 1 : b === null ? -1 : a - b));
    bestScores = bestScores.slice(0, 3); 
    rankScores.forEach((span, i) => {
        span.textContent = bestScores[i] ? `${bestScores[i]} intentos` : '? intentos';
    });
}

// Prevención de entrada errónea
inputField.addEventListener('input', function() {
    if (this.value > 100) this.value = 100;
    if (this.value !== "" && this.value < 1) this.value = "";
});

// Eventos de botones
gameBtn.addEventListener('click', checkGuess);
btnReiniciar.addEventListener('click', startGame);
inputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkGuess(); });

startGame();