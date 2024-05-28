

document.addEventListener('DOMContentLoaded', (event) => {
    // Giriş yap butonuna tıklandığında 'onLogin' fonksiyonunu tetikleyen olay dinleyicisini ekleyin
    document.getElementById('loginButton').addEventListener('click', onLogin);
});

// Giriş yap fonksiyonu
function onLogin() {
    console.log('Giriş yapma fonksiyonu çağrıldı'); // Fonksiyon çağrılıyor mu kontrol etmek için
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = {
        email: username,
        password: password
    };

    // Sunucuya giriş yapma isteğini gönder
    fetch('http://localhost:8888/api/v1/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Başarılı:', data);
            if (data.code === 200) {
                console.log("Giriş başarılı");
                window.location.href = '../../app/home/homepage.html'; // Başarı durumunda yönlendirme
            } else {
                console.log("Giriş başarısız");
            }
        })
        .catch((error) => {
            console.error('Hata:', error);
        });
}
