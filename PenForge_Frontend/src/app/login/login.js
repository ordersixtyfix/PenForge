document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('loginButton').addEventListener('click', onLogin);
});

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('loginButton').addEventListener('click', onLogin);
});

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
                const userDto = data.data;
                const profilePictureUrl = userDto.profilePictureUrl ? `http://localhost:8888/api/v1/files/${userDto.profilePictureUrl}` : null;
                if (profilePictureUrl) {
                    fetch(profilePictureUrl)
                        .then(res => res.blob())
                        .then(blob => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                userDto.profileImage = reader.result;
                                localStorage.setItem('userDto', JSON.stringify(userDto));
                                window.location.href = '../home/homepage.html';
                            };
                            reader.readAsDataURL(blob);
                        });
                } else {
                    localStorage.setItem('userDto', JSON.stringify(userDto));
                    window.location.href = '../home/homepage.html';
                }
            } else {
                console.log("Giriş başarısız");
            }
        })
        .catch((error) => {
            console.error('Hata:', error);
        });
}


