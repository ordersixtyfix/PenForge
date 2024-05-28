document.getElementById('resetPasswordButton').addEventListener('click', async function () {
    sendResetPasswordRequest();
});

document.getElementById('newPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault();
    sendResetPasswordRequest();
});

async function sendResetPasswordRequest() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const formContainer = document.getElementById('form-container');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');

    // Önce hata mesajını temizle
    errorMessage.textContent = '';

    if (newPassword !== confirmPassword) {
        errorMessage.textContent = 'Şifreler eşleşmiyor';
        return;
    }

    const response = await window.electronAPI.sendResetPasswordRequest(`token=${token}&newPassword=${newPassword}`);

    if (response.code === 200) {
        formContainer.style.display = 'none';
        successMessage.style.display = 'block';
        setTimeout(() => {
            window.location.href = '../login/login.html';
        }, 2000);
    } else {
        errorMessage.textContent = response.data;
    }
}
