document.getElementById('resetPasswordButton').addEventListener('click', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert("Şifreler eşleşmiyor");
        return;
    }

    const response = await window.electronAPI.sendResetPasswordRequest(`token=${token}&newPassword=${newPassword}`);

    if (response.code === 200) {
        alert("Şifre başarıyla sıfırlandı.");
        window.location.href = '../login/login.html';
    } else {
        alert(response.data);
    }
});
