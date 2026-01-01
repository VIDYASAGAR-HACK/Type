const textToType = document.getElementById('text-to-type');
const input = document.getElementById('input');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const streakEl = document.getElementById('streak');
const timerEl = document.getElementById('timer');
const resetBtn = document.getElementById('reset-btn');
const difficultyBtns = document.querySelectorAll('.difficulty .btn');

let timer;
let time = 60;
let currentLevel = 'easy';
let words = [];
let currentWordIndex = 0;
let correctChars = 0;
let totalChars = 0;
let streak = 0;
let gameStarted = false;

const levelConfig = {
    easy: {
        words: ['code', 'hack', 'type', 'fast', 'neon', 'blue', 'cyber', 'glitch', 'matrix', 'virus'],
        time: 60
    },
    medium: {
        words: ['Hacking the mainframe.', 'Cybernetic enhancements activated.', 'Digital rain falls endlessly.', 'The quick brown fox jumps over the lazy dog.'],
        time: 45
    },
    hard: {
        words: ['The syntax is `const x = 10;`', 'Follow the white rabbit: Neo.', 'System.out.println("Hello, World!");', 'sudo rm -rf / --no-preserve-root'],
        time: 30
    },
    expert: {
        words: ['0110100001100101011011000110110001101111', 'pwned_by_the_l33t_h4x0rs', 'SELECT * FROM users WHERE id = 1;', 'function_exploit(buffer_overflow)'],
        time: 15
    }
};

function init() {
    time = levelConfig[currentLevel].time;
    words = levelConfig[currentLevel].words;
    currentWordIndex = 0;
    correctChars = 0;
    totalChars = 0;
    streak = 0;
    gameStarted = false;
    input.disabled = false;


    timerEl.textContent = time;
    wpmEl.textContent = 0;
    accuracyEl.textContent = 100;
    streakEl.textContent = 0;
    input.value = '';
    textToType.innerHTML = words.map((word, index) => `<span class="word ${index === 0 ? 'active' : ''}">${word}</span>`).join(' ');
    input.focus();
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        timer = setInterval(updateTimer, 1000);
    }
}

function updateTimer() {
    time--;
    timerEl.textContent = time;
    if (time === 0) {
        endGame();
    }
}

function endGame() {
    clearInterval(timer);
    input.disabled = true;
    const elapsedTime = levelConfig[currentLevel].time - time;
    const wpm = Math.round((correctChars / 5) / (elapsedTime / 60));
    wpmEl.textContent = wpm > 0 ? wpm : 0;
    accuracyEl.textContent = Math.round((correctChars / totalChars) * 100) || 0;
}

function updateWordStatus() {
    const wordSpans = textToType.querySelectorAll('.word');
    wordSpans.forEach((span, index) => {
        if (index < currentWordIndex) {
            span.classList.add('correct');
            span.classList.remove('active', 'incorrect');
        } else if (index === currentWordIndex) {
            span.classList.add('active');
            span.classList.remove('correct', 'incorrect');
        } else {
            span.classList.remove('active', 'correct', 'incorrect');
        }
    });
}

function checkInput() {
    if (!gameStarted) {
        startGame();
    }

    const currentWord = words[currentWordIndex];
    const typedValue = input.value;
    const typedValueTrimmed = typedValue.trim();

    totalChars++;
    if (currentWord.startsWith(typedValueTrimmed) && typedValue.charAt(typedValue.length - 1) !== ' ') {
        correctChars++;
        input.classList.remove('incorrect');
    } else if (typedValue.charAt(typedValue.length - 1) === ' ') {
        if (typedValueTrimmed === currentWord) {
            currentWordIndex++;
            streak++;
            input.value = '';
            updateWordStatus();
        } else {
            streak = 0;
        }
        streakEl.textContent = streak;
    } else {
        input.classList.add('incorrect');
    }

    const elapsedTime = levelConfig[currentLevel].time - time;
    const wpm = Math.round((correctChars / 5) / (elapsedTime / 60));
    wpmEl.textContent = wpm > 0 ? wpm : 0;
    accuracyEl.textContent = Math.round((correctChars / totalChars) * 100) || 0;

    if (currentWordIndex === words.length) {
        endGame();
    }
}

difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        currentLevel = btn.dataset.level;
        init();
    });
});

resetBtn.addEventListener('click', init);
input.addEventListener('input', checkInput);

init();