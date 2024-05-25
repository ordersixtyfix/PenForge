// Yükleme ekranını sayfa yüklendiğinde gizle
window.addEventListener('DOMContentLoaded', function() {
    const loadingDiv = document.getElementById('loading');
    loadingDiv.style.display = 'none';
});

document.getElementById('emailForm').addEventListener('submit', function(event) {
    event.preventDefault();
    sendCode();
});

document.getElementById('sendCodeButton').addEventListener('click', async function () {
    sendCode();
});

async function sendCode() {
    const email = document.getElementById('email').value;
    const loadingDiv = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');

    // Önce hata mesajını temizle
    errorMessage.textContent = '';

    // Yükleme ekranını göster
    loadingDiv.style.display = 'flex';

    try {
        const response = await window.electronAPI.sendForgotPasswordRequest(`email=${email}`);

        if (response.code === 200) {
            window.location.href = 'verify-code.html?email=' + email;
        } else {
            errorMessage.textContent = response.data;
        }
    } catch (error) {
        errorMessage.textContent = "Bir hata oluştu: " + error.message;
    } finally {
        // Yükleme ekranını gizle
        loadingDiv.style.display = 'none';
    }
}
