document.getElementById('loginButton').addEventListener('click', function() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    // Bu örnek için basit bir doğrulama:
    if (username === 'beklenenKullaniciAdi' && password === 'beklenenSifre') {
        window.electronAPI.sendLoginSuccess(); // IPC mesajı gönderiliyor
    } else {
        alert('Kullanıcı adı veya şifre yanlış!');
    }
});
