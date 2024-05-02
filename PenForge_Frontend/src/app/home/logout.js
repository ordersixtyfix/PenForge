document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            logout();
        });
    } else {
        console.log('Çıkış butonu bulunamadı.');
    }
});

function logout() {
    console.log('Çıkış işlemi başlatılıyor...');

    // HTTP POST isteği ile çıkış işlemini başlatın
    fetch('http://localhost:8888/logout', {  // Sunucu adresinizi doğru girin
        method: 'POST'
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();  // JSON yanıtını işlemek için
    }).then(data => {
        console.log('Çıkış başarılı, kullanıcı yönlendiriliyor...');
        window.location.href = '../../app/login/login.html';  // Giriş sayfasına yönlendirme yolu
    }).catch(error => {
        console.error('Çıkış işleminde hata oluştu:', error);
    });
}
