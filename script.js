// Przykładowe konta lokalne
const accounts = {
    dziabolud: 'chuj',
    mty: 'chuj',
    Ever: 'chuj',
    antek: 'chuj'
};

let currentUser = null;  // Aktualnie zalogowany użytkownik

// Funkcja do logowania
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('login-message');
    const overlay = document.getElementById('overlay');

    if (accounts[username] && accounts[username] === password) {
        loginMessage.innerText = 'Zalogowano pomyślnie!';
        loginMessage.style.color = 'green';

        // Ustaw aktualnego użytkownika
        currentUser = username;

        // Aktualizacja nagłówka z nazwą użytkownika
        document.getElementById('username-header').innerText = currentUser;

        // Ukryj nakładkę po udanym logowaniu
        overlay.style.display = 'none'; // Ustaw nakładkę jako niewidoczną
        
        // Wczytaj liczniki użytkownika
        loadUserCounters();

        // Wczytaj liczniki innych użytkowników
        loadOtherUsersCounters();

    } else {
        loginMessage.innerText = 'Błędna nazwa użytkownika lub hasło.';
    }
}

// Dodajemy obsługę kliknięcia dla przycisku logowania
document.getElementById('login-button').addEventListener('click', login);

function loadUserCounters() {
    const savedCounters = localStorage.getItem(`counters_${currentUser}`);
    if (savedCounters) {
        counters = JSON.parse(savedCounters);
    } else {
        counters = {
            holownik: 0,
            zlomiarz: 0,
            kurier: 0,
            elektryk: 0
        };
    }

    // Zaktualizowanie wyświetlanych wartości liczników
    for (let counterName in counters) {
        updateCounter(counterName);
    }

    loadUserLogs();
}

function saveCounters() {
    if (currentUser) {
        localStorage.setItem(`counters_${currentUser}`, JSON.stringify(counters));
    }
}

function loadUserLogs() {
    const savedLogs = localStorage.getItem(`logs_${currentUser}`);
    const logList = document.getElementById('log-list');
    logList.innerHTML = '';  // Wyczyść aktualne logi z DOM
    
    if (savedLogs) {
        const logs = JSON.parse(savedLogs);
        logs.forEach(log => addLogToDOM(log.time, log.counterName, log.action, false));
    }
}

function saveLog(logs) {
    if (currentUser) {
        localStorage.setItem(`logs_${currentUser}`, JSON.stringify(logs));
    }
}

// Funkcja dodająca logi
function addLog(counterName, action) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const log = { time: timeString, counterName: counterName, action: action };
    
    const logs = JSON.parse(localStorage.getItem(`logs_${currentUser}`)) || [];
    logs.push(log);
    saveLog(logs);
    
    addLogToDOM(timeString, counterName, action);
}
// Funkcja do czyszczenia logów
function clearLogs() {
    if (currentUser) {
        // Usunięcie logów z LocalStorage dla aktualnie zalogowanego użytkownika
        localStorage.removeItem(`logs_${currentUser}`);

        // Usunięcie logów z DOM
        const logList = document.getElementById('log-list');
        logList.innerHTML = '';
    }
}


// Dodajemy obsługę kliknięcia dla przycisku "Wyczyść logi"
document.getElementById('clear-logs').addEventListener('click', clearLogs);


// Funkcja dodająca log do DOM
function addLogToDOM(timeString, counterName, action, scroll = true) {
    const logList = document.getElementById('log-list');
    const logItem = document.createElement('div');
    logItem.classList.add('log-item');

    const logTime = document.createElement('span');
    logTime.classList.add('log-time');
    logTime.innerText = `[${timeString}] `;

    const logAction = document.createElement('span');
    logAction.classList.add('log-action');
    logAction.innerText = `${counterName.toUpperCase()}: `;

    if (action === 'dodano 1') {
        logAction.classList.add('add');
        logAction.innerText += action;
    } else if (action === 'odjęto 1') {
        logAction.classList.add('subtract');
        logAction.innerText += action;
    } else if (action === 'zresetowano licznik') {
        logAction.classList.add('reset');
        logAction.innerText += action;
    }

    logItem.appendChild(logTime);
    logItem.appendChild(logAction);
    logList.appendChild(logItem);

    if (scroll) {
        logList.scrollTop = logList.scrollHeight;
    }
}
function loadOtherUsersCounters() {
    const otherUsersList = document.getElementById('other-users-list');
    otherUsersList.innerHTML = ''; // Wyczyść listę przed załadowaniem

    // Przejdź przez wszystkich użytkowników (dla przykładu "accounts")
    for (let username in accounts) {
        if (username !== currentUser) {  // Pomiń aktualnie zalogowanego użytkownika
            // Pobierz liczniki tego użytkownika
            const savedCounters = localStorage.getItem(`counters_${username}`);
            const counters = savedCounters ? JSON.parse(savedCounters) : {
                holownik: 0,
                zlomiarz: 0,
                kurier: 0,
                elektryk: 0
            };

            // Tworzenie elementów do wyświetlenia liczników tego użytkownika
            const userSection = document.createElement('div');
            userSection.classList.add('user-section');

            // Tworzymy nagłówek osobno, poza sekcją z licznikami
            const userHeader = document.createElement('h3');
            userHeader.innerText = `Licznik użytkownika: ${username}`;
            userSection.appendChild(userHeader);

            // Tworzymy kontener na liczniki (counter-container)
            const counterContainer = document.createElement('div');
            counterContainer.classList.add('counter-container');

            // Tworzenie liczników dla każdego użytkownika wewnątrz counter-container
            for (let counterName in counters) {
                const counterDiv = document.createElement('div');
                counterDiv.classList.add('counter-item');

                const counterLabel = document.createElement('span');
                counterLabel.innerText = `${counterName.toUpperCase()}: `;
                counterDiv.appendChild(counterLabel);

                const counterValue = document.createElement('span');
                counterValue.id = `${username}-${counterName}-count`;
                counterValue.innerText = counters[counterName];
                counterDiv.appendChild(counterValue);

                // Dodajemy element z licznikiem do kontenera
                counterContainer.appendChild(counterDiv);
            }

            // Dodajemy kontener z licznikami do sekcji użytkownika
            userSection.appendChild(counterContainer);

            // Dodanie sekcji użytkownika do listy
            otherUsersList.appendChild(userSection);
        }
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
    // Zaktualizuj wartość licznika
    document.getElementById(`${counterName}-count`).innerText = counters[counterName];

    // Oblicz procent postępu w odniesieniu do wartości maksymalnej (200)
    const progressPercentage = (counters[counterName] / 200) * 100;

    // Ustaw szerokość paska postępu
    document.getElementById(`${counterName}-progress`).style.width = `${progressPercentage}%`;
}


function logout() {
    currentUser = null;
    document.getElementById('overlay').style.display = 'block';
    
    // Wyczyść nagłówek z nazwą użytkownika
    document.getElementById('username-header').innerText = '';
}

// Dodajemy obsługę kliknięć przycisków w modalnym oknie
document.getElementById('confirm-reset').addEventListener('click', resetCounter);
document.getElementById('cancel-reset').addEventListener('click', closeModal);

// Inicjalizacja
initialize();
