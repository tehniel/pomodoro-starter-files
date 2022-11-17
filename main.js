const timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    sessions: 0,
};

let interval;

const buttonSound = new Audio('./timer_components/button-sound.mp3');
const playButton = document.getElementById('play-btn');
playButton.addEventListener('click', () => {
    buttonSound.play();
    const { action } = playButton.dataset;
    if (action === 'start') {
        startTimer();
    } else {
        stopTimer();
    }
});


const modeButtons = document.querySelector('#js-mode-buttons');
modeButtons.addEventListener('click', handleMode);

function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;

    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);

    return {
        total,
        minutes,
        seconds,
    };
}

function startTimer() {
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;

    if (timer.mode === 'pomodoro') timer.sessions++;

    playButton.dataset.action = 'stop';
    playButton.innerHTML = '<img src="./timer_components/Pause.svg" />'
    playButton.classList.add('active');

    interval = setInterval(function () {
        timer.remainingTime = getRemainingTime(endTime);
        updateClock();

        total = timer.remainingTime.total;
        if (total <= 0) {
            clearInterval(interval);

            switch (timer.mode) {
                case 'pomodoro':
                    if (timer.sessions % timer.longBreakInterval === 0) {
                        switchMode('longBreak');
                    } else {
                        switchMode('shortBreak');
                    }
                    break;
                default:
                    switchMode('pomodoro');
            }

            document.querySelector(`[data-sound="${timer.mode}"]`).play();

            startTimer();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);

    playButton.dataset.action = 'start';
    playButton.innerHTML = '<img src="./timer_components/Play button.svg" />'
    playButton.classList.remove('active');
}

function updateClock() {
    const { remainingTime } = timer;
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');

    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');
    min.textContent = minutes;
    sec.textContent = seconds;
}

function switchMode(mode) {
    timer.mode = mode;
    timer.remainingTime = {
        total: timer[mode] * 60,
        minutes: timer[mode],
        seconds: 0,
    };

    document
        .querySelectorAll('button[data-mode]')
        .forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

    updateClock();
}

function handleMode(event) {
    const { mode } = event.target.dataset;

    if (!mode) return;

    switchMode(mode);
    stopTimer();
}


const resetButton = document.getElementById('reset-btn');
resetButton.addEventListener('click', () => {
    buttonSound.play();

    const { action } = resetButton.dataset;
    if (action === 'reset') {
        switchMode(timer.mode);
        stopTimer();
    }

});

document.addEventListener('DOMContentLoaded', () => {

    switchMode('pomodoro');
});