document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('loginButton').addEventListener('click', onLogin);
});

function onLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = {
        email: username,
        password: password
    };

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
            if (data.code === 200) {
                localStorage.setItem('userDto', JSON.stringify(data.data));
                window.location.href = '../home/homepage.html';
            } else {
                console.log("Giriş başarısız");
            }
        })
        .catch((error) => {
            console.error('Hata:', error);
        });
}
