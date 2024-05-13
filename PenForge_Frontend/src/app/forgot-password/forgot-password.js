document.addEventListener("DOMContentLoaded", function () {
    const sendCodeButton = document.getElementById('sendCodeButton');
    const emailInput = document.getElementById('email');
    const codeInput = document.getElementById('code');
    const codeGroup = document.getElementById('codeGroup');
    let countdownInterval;
    let verificationCode;

    function generateVerificationCode(length) {
        let code = '';
        for (let i = 0; i < length; i++) {
            code += Math.floor(Math.random() * 10); // 0-9 arası rastgele bir sayı ekler
        }
        return code;
    }

    sendCodeButton.addEventListener('click', function () {
        if (sendCodeButton.innerText === "Kod Gönder") {
            if (!emailInput.value) {
                alert('Lütfen e-posta adresinizi giriniz.');
                return;
            }
            // Rastgele sayısal kod üret
            verificationCode = generateVerificationCode(6);
            alert('Kodunuz (' + verificationCode + ') ' + emailInput.value + ' adresine gönderildi. Lütfen kontrol ediniz.');
            sendCodeButton.innerText = "Kodu Doğrula";
            codeGroup.style.display = 'block';

            // 60 saniyelik geri sayım başlat
            let seconds = 60;
            countdownInterval = setInterval(function () {
                seconds--;
                sendCodeButton.innerText = "Kodu Doğrula (" + seconds + " saniye)";
                if (seconds <= 0) {
                    clearInterval(countdownInterval);
                    alert('Kodun süresi doldu. Lütfen tekrar deneyin.');
                    sendCodeButton.innerText = "Kod Gönder";
                    codeGroup.style.display = 'none'; // Kod girişini gizle
                }
            }, 1000);
        } else if (sendCodeButton.innerText.startsWith("Kodu Doğrula")) {
            clearInterval(countdownInterval); // Zamanlayıcıyı durdur
            if (!codeInput.value || codeInput.value !== verificationCode) {
                alert('Yanlış veya eksik kod girdiniz. Lütfen doğrulama kodunu giriniz.');
                return;
            }
            // Kod doğrulama işlemi simüle edilir
            alert('Kod doğrulandı. Lütfen yeni şifrenizi belirleyiniz.');
            window.location.href = 'reset-password.html'; // Yeni şifre belirleme sayfasına yönlendir
        }
    });
});