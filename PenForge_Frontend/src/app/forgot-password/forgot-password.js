document.getElementById('sendCodeButton').addEventListener('click', async function () {
    const email = document.getElementById('email').value;

    const response = await window.electronAPI.sendForgotPasswordRequest(`email=${email}`);

    if (response.code === 200) {
        alert("Kod başarıyla gönderildi.");
        window.location.href = 'verify-code.html?email=' + email;
    } else {
        alert(response.data);
    }
});

