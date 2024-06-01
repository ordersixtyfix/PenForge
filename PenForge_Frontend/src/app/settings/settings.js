document.getElementById('logoutButton').addEventListener('click', function () {
    localStorage.removeItem('userDto');
    window.location.href = '../login/login.html';
});

document.addEventListener('DOMContentLoaded', (event) => {
    const userDtoString = localStorage.getItem('userDto');

    if (userDtoString) {
        try {
            const userDto = JSON.parse(userDtoString);
            if (userDto) {
                document.getElementById('user-name').textContent = `${userDto.firstName} ${userDto.lastName}`;
                document.getElementById('email').textContent = userDto.email;
                const profileImage = document.getElementById('profile-pic');
                const profileImage2 = document.getElementById('profile-pic2');
                if (userDto.profileImage) {
                    profileImage.src = userDto.profileImage;
                    profileImage2.src = userDto.profileImage;

                }
            }
        } catch (e) {
            console.error('Invalid JSON in local storage:', e);
        }
    } else {
        console.log('Kullanıcı bilgileri bulunamadı');
    }

});

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById('profile-upload').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.querySelector('.profile-pic').src = e.target.result;
                const userDtoString = localStorage.getItem('userDto');
                if (userDtoString) {
                    try {
                        const userDto = JSON.parse(userDtoString);
                        userDto.profileImage = e.target.result;
                        localStorage.setItem('userDto', JSON.stringify(userDto));
                    } catch (e) {
                        console.error('Invalid JSON in local storage:', e);
                    }
                }
            }
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('edit-email').addEventListener('click', function () {
        const editSection = document.getElementById('email-edit');
        const editButton = document.getElementById('edit-email');
        const isVisible = editSection.style.display === 'block';
        editSection.style.display = isVisible ? 'none' : 'block';
        editButton.style.display = isVisible ? 'inline-block' : 'none';
    });

    document.getElementById('confirm-email').addEventListener('click', function () {
        const newEmail = document.getElementById('new-email').value;
        if (newEmail) {
            document.getElementById('email').innerText = newEmail;
            document.getElementById('email-edit').style.display = 'none';
            document.getElementById('edit-email').style.display = 'inline-block';

            showAlert("E-mail adresiniz başarıyla değiştirildi.");
        }
    });

    document.getElementById('edit-password').addEventListener('click', function () {
        const editSection = document.getElementById('password-edit');
        const editButton = document.getElementById('edit-password');
        const isVisible = editSection.style.display === 'block';
        editSection.style.display = isVisible ? 'none' : 'block';
        editButton.style.display = isVisible ? 'inline-block' : 'none';
    });

    document.getElementById('confirm-password').addEventListener('click', function () {
        const newPassword = document.getElementById('new-password').value;
        if (newPassword) {
            document.getElementById('password').innerText = '**********';
            document.getElementById('password-edit').style.display = 'none';
            document.getElementById('edit-password').style.display = 'inline-block';

            showAlert("Şifreniz başarıyla değiştirildi.");
        }
    });

    document.addEventListener('click', function (event) {
        const emailEditSection = document.getElementById('email-edit');
        const emailEditButton = document.getElementById('edit-email');
        if (emailEditSection.style.display === 'block' && !emailEditSection.contains(event.target) && !emailEditButton.contains(event.target)) {
            emailEditSection.style.display = 'none';
            emailEditButton.style.display = 'inline-block';
        }

        const passwordEditSection = document.getElementById('password-edit');
        const passwordEditButton = document.getElementById('edit-password');
        if (passwordEditSection.style.display === 'block' && !passwordEditSection.contains(event.target) && !passwordEditButton.contains(event.target)) {
            passwordEditSection.style.display = 'none';
            passwordEditButton.style.display = 'inline-block';
        }
    });
});

function closeAlert() {
    document.getElementById('custom-alert').classList.add('hide-visibility');
}

function showAlert(message) {
    const alertElement = document.getElementById('custom-alert');
    const messageElement = document.getElementById('custom-alert-message');

    messageElement.innerHTML = message;
    alertElement.classList.remove('hide-visibility');
}
