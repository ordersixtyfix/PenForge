document.getElementById('verifyCodeButton').addEventListener('click', async function () {
    sendVerificationCode();
});

document.getElementById('codeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    sendVerificationCode();
});

async function sendVerificationCode() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const code = document.getElementById('code').value;
    const errorMessage = document.getElementById('error-message');

    errorMessage.textContent = '';

    try {
        const response = await window.electronAPI.sendValidateTokenRequest(`token=${code}&email=${email}`);

        if (response.code === 200) {
            window.location.href = 'reset-password.html?token=' + code;
        } else {
            errorMessage.textContent = 'Kod hatalı.';
        }
    } catch (error) {
        errorMessage.textContent = 'Bir hata oluştu: ' + error.message;
    }
}
