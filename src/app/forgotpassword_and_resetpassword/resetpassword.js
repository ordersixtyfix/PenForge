document.getElementById('resetPasswordButton').addEventListener('click', function() {
    var newPassword = document.getElementById('newPassword').value;
    var confirmPassword = document.getElementById('confirmPassword').value;

    // Yeni şifre veya onay şifresi alanlarının boş olup olmadığını kontrol et
    if (!newPassword || !confirmPassword) {
        alert('Lütfen bir şifre giriniz.');
        return;
    }

    // Girilen şifrelerin birbiriyle uyuşup uyuşmadığını kontrol et
    if (newPassword !== confirmPassword) {
        alert('Şifreler uyuşmuyor. Lütfen tekrar deneyin.');
        return;
    }

    // Her iki kontrolü geçerse şifrenin başarıyla güncellendiğini bildir
    alert('Şifreniz başarıyla güncellendi!');
    // Burada şifre sıfırlama işlemi sunucuya gönderilecek
});
