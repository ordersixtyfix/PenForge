document.getElementById('verifyCodeButton').addEventListener('click', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const code = document.getElementById('code').value;

    const response = await window.electronAPI.sendValidateTokenRequest(`token=${code}&email=${email}`);

    if (response.code === 200) {
        alert("Kod doğrulandı.");
        window.location.href = 'reset-password.html?token=' + code;
    } else {
        alert(response.data);
    }
});

// Timer
let timeLeft = 60;
const timerElement = document.getElementById('time');

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timerElement.textContent = timeLeft;
    } else {
        alert("Süreniz doldu. Lütfen yeniden kod isteyin.");
        window.location.href = 'forgot-password.html';
    }
}

setInterval(updateTimer, 1000);
