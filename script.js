// Przykładowe konta lokalne
const accounts = {
    dziabolud: 'chuj',
    user2: 'password2'
};

// Funkcja do logowania
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('login-message');
    const overlay = document.getElementById('overlay');

    if (accounts[username] && accounts[username] === password) {
        loginMessage.innerText = 'Zalogowano pomyślnie!';
        loginMessage.style.color = 'green';

        // Ukryj nakładkę po udanym logowaniu
        overlay.style.display = 'none'; // Ustaw nakładkę jako niewidoczną
        
        // Możesz dodać logikę po zalogowaniu, np. ukrycie formularza logowania
    } else {
        loginMessage.innerText = 'Błędna nazwa użytkownika lub hasło.';
    }
}



// Dodajemy obsługę kliknięcia dla przycisku logowania
document.getElementById('login-button').addEventListener('click', login);

let counters = {
    holownik: 0,
    zlomiarz: 0,
    kurier: 0,
    elektryk: 0
};

// Funkcja inicjalizująca - wczytuje dane z LocalStorage
function initialize() {
    // Wczytanie liczników z LocalStorage
    const savedCounters = localStorage.getItem('counters');
    if (savedCounters) {
        counters = JSON.parse(savedCounters);
    }
    
    // Zaktualizowanie wyświetlanych wartości liczników
    for (let counterName in counters) {
        updateCounter(counterName);
    }

    // Wczytanie logów z LocalStorage
    const savedLogs = localStorage.getItem('logs');
    if (savedLogs) {
        const logs = JSON.parse(savedLogs);
        logs.forEach(log => addLogToDOM(log.time, log.counterName, log.action, false));
    }
}

// Zapisuje aktualne liczniki do LocalStorage
function saveCounters() {
    localStorage.setItem('counters', JSON.stringify(counters));
}

// Funkcja do zapisu logów w LocalStorage
function saveLog(logs) {
    localStorage.setItem('logs', JSON.stringify(logs));
}

// Funkcja dodająca logi
function addLog(counterName, action) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const log = { time: timeString, counterName: counterName, action: action };
    
    // Wczytanie aktualnych logów z LocalStorage
    const logs = JSON.parse(localStorage.getItem('logs')) || [];
    
    // Dodanie nowego logu
    logs.push(log);
    saveLog(logs); // Zapisanie logów do LocalStorage
    
    // Dodanie logu do DOM
    addLogToDOM(timeString, counterName, action);
}
// Funkcja do czyszczenia logów
function clearLogs() {
    // Usunięcie logów z LocalStorage
    localStorage.removeItem('logs');

    // Usunięcie logów z DOM
    const logList = document.getElementById('log-list');
    logList.innerHTML = '';
}

// Dodajemy obsługę kliknięcia dla przycisku "Wyczyść logi"
document.getElementById('clear-logs').addEventListener('click', clearLogs);


// Funkcja dodająca log do DOM
function addLogToDOM(timeString, counterName, action, scroll = true) {
    const logList = document.getElementById('log-list');
    const logItem = document.createElement('div');
    logItem.classList.add('log-item');

    // Tworzenie elementu z czasem
    const logTime = document.createElement('span');
    logTime.classList.add('log-time');
    logTime.innerText = `[${timeString}] `;

    // Tworzenie elementu z akcją
    const logAction = document.createElement('span');
    logAction.classList.add('log-action');

    // Ustawienie klasy i tekstu w zależności od akcji
    logAction.innerText = `${counterName.toUpperCase()}: `;
    if (action === 'dodano 1') {
        logAction.classList.add('add');
        logAction.innerText += action; // Biały tekst
    } else if (action === 'odjęto 1') {
        logAction.classList.add('subtract');
        logAction.innerText += action; // Niebieski tekst
    } else if (action === 'zresetowano licznik') {
        logAction.classList.add('reset');
        logAction.innerText += action; // Czerwony tekst
    }

    logItem.appendChild(logTime);
    logItem.appendChild(logAction);
    logList.appendChild(logItem);

    // Scrollowanie do dołu tylko, jeśli wymagane
    if (scroll) {
        logList.scrollTop = logList.scrollHeight;
    }
}


// Funkcje dla liczników
function increment(counterName) {
    counters[counterName]++;
    updateCounter(counterName);
    addLog(counterName, 'dodano 1');
    saveCounters();
}

function decrement(counterName) {
    if (counters[counterName] > 0) {
        counters[counterName]--;
        updateCounter(counterName);
        addLog(counterName, 'odjęto 1');
        saveCounters();
    }
}

function showResetModal(counterName) {
    currentCounter = counterName;
    document.getElementById('modal-message').innerText = `Czy na pewno chcesz zresetować licznik dla: ${counterName}?`;
    document.getElementById('resetModal').style.display = 'flex';
}

function resetCounter() {
    if (currentCounter) {
        counters[currentCounter] = 0;
        updateCounter(currentCounter);
        addLog(currentCounter, 'zresetowano licznik');
        saveCounters();
        closeModal();
    }
}

function closeModal() {
    document.getElementById('resetModal').style.display = 'none';
}

function updateCounter(counterName) {
    document.getElementById(`${counterName}-count`).innerText = counters[counterName];
}

// Dodajemy obsługę kliknięć przycisków w modalnym oknie
document.getElementById('confirm-reset').addEventListener('click', resetCounter);
document.getElementById('cancel-reset').addEventListener('click', closeModal);

// Inicjalizacja
initialize();
