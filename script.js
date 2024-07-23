const wordDisplay = document.getElementById('word-display');
const textInputDisplay = document.getElementById('text-input-display');
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speed-value');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn');
const backBtn = document.getElementById('back-btn');
const forwardBtn = document.getElementById('forward-btn');
const darkModeBtn = document.getElementById('dark-mode-btn');
const fontSizeSlider = document.getElementById('font-size-slider');

let words = [];
let currentIndex = 0;
let intervalId = null;
let isPaused = false;

function updateSpeed() {
    const speed = speedSlider.value;
    speedValue.textContent = `${speed} WPM`;
    if (intervalId) {
        clearInterval(intervalId);
        startDisplay();
    }
}

function displayNextWord() {
    if (currentIndex < words.length) {
        wordDisplay.textContent = words[currentIndex].textContent;
        highlightCurrentWord();
        currentIndex++;
    } else {
        stopDisplay();
    }
}

function startDisplay() {
    if (intervalId) clearInterval(intervalId);
    if (!words.length || currentIndex >= words.length) {
        updateWords();
        currentIndex = 0;
    }
    const interval = 60000 / parseInt(speedSlider.value);
    intervalId = setInterval(displayNextWord, interval);
    isPaused = false;
}

function pauseDisplay() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        isPaused = true;
    } else if (isPaused) {
        startDisplay();
    }
}

function stopDisplay() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    currentIndex = 0;
    wordDisplay.textContent = '';
    highlightCurrentWord();
    isPaused = false;
}

function jumpWords(amount) {
    currentIndex = Math.max(0, Math.min(words.length - 1, currentIndex + amount));
    if (intervalId) {
        clearInterval(intervalId);
        displayNextWord();
        startDisplay();
    } else {
        displayNextWord();
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    darkModeBtn.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
}

function updateFontSize() {
    wordDisplay.style.fontSize = `${fontSizeSlider.value}px`;
}

function updateWords() {
    const text = textInputDisplay.innerText;
    textInputDisplay.innerHTML = text.split(/\s+/).map(word => `<span>${word}</span>`).join(' ');
    words = Array.from(textInputDisplay.getElementsByTagName('span'));
    words.forEach((word, index) => {
        word.addEventListener('click', () => {
            currentIndex = index;
            if (intervalId) {
                clearInterval(intervalId);
                displayNextWord();
                startDisplay();
            } else {
                displayNextWord();
            }
        });
    });
    highlightCurrentWord();
}

function highlightCurrentWord() {
    words.forEach((word, index) => {
        if (index === currentIndex) {
            word.classList.add('current');
        } else {
            word.classList.remove('current');
        }
    });
}

speedSlider.addEventListener('input', updateSpeed);
startBtn.addEventListener('click', startDisplay);
pauseBtn.addEventListener('click', pauseDisplay);
stopBtn.addEventListener('click', stopDisplay);
backBtn.addEventListener('click', () => jumpWords(-10));
forwardBtn.addEventListener('click', () => jumpWords(10));
darkModeBtn.addEventListener('click', toggleDarkMode);
fontSizeSlider.addEventListener('input', updateFontSize);
textInputDisplay.addEventListener('input', updateWords);

updateSpeed();
updateFontSize();
updateWords();