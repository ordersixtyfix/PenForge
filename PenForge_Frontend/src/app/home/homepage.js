document.getElementById('logoutButton').addEventListener('click', async function () {
    const response = await window.electronAPI.logout();
    if (response.error) {
        alert("Çıkış işlemi sırasında bir hata oluştu: " + response.error);
    } else if (response.code === 200) {
        alert("Oturum başarıyla kapatıldı.");
        window.location.href = 'login.html';
    } else {
        alert("Çıkış işlemi sırasında beklenmeyen bir hata oluştu.");
    }
});
