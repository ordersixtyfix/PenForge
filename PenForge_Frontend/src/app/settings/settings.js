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
                if (userDto.profilePictureUrl) {
                    const imageUrl = `http://localhost:8888/api/v1/files/${userDto.profilePictureUrl}`;
                    profileImage.src = imageUrl;
                    profileImage2.src = imageUrl;
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
    document.getElementById('profile-upload').addEventListener('change', async function (event) {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('profilePicture', file);

            const userDtoString = localStorage.getItem('userDto');
            if (userDtoString) {
                const userDto = JSON.parse(userDtoString);
                const userId = userDto.id;

                try {
                    const response = await fetch(`http://localhost:8888/api/v1/files/update-profile-picture/${userId}`, {
                        method: 'PUT',
                        body: formData,
                    });

                    if (response.ok) {
                        const updatedUser = await response.json();
                        localStorage.setItem('userDto', JSON.stringify(updatedUser));
                        const imageUrl = `http://localhost:8888/api/v1/files/${updatedUser.profilePictureUrl}`;
                        document.getElementById('profile-pic').src = imageUrl;
                        document.getElementById('profile-pic2').src = imageUrl;
                        showAlert("Profil resmi başarıyla güncellendi!");
                    } else {
                        showAlert("Profil resmi güncellenemedi. Lütfen tekrar deneyin.");
                    }
                } catch (error) {
                    console.error('Error:', error);
                    showAlert("Bir hata oluştu. Lütfen tekrar deneyin.");
                }
            }
        }
    });

    document.getElementById('edit-email').addEventListener('click', function () {
        const editSection = document.getElementById('email-edit');
        const editButton = document.getElementById('edit-email');
        const isVisible = editSection.style.display === 'block';
        editSection.style.display = isVisible ? 'none' : 'block';
        editButton.style.display = isVisible ? 'inline-block' : 'none';
    });

    document.getElementById('confirm-email').addEventListener('click', async function () {
        const newEmail = document.getElementById('new-email').value;
        const confirmNewEmail = document.getElementById('confirm-new-email').value;
        if (newEmail && confirmNewEmail) {
            if (newEmail === confirmNewEmail) {
                const userDtoString = localStorage.getItem('userDto');
                if (userDtoString) {
                    const userDto = JSON.parse(userDtoString);
                    userDto.email = newEmail;

                    try {
                        const response = await fetch(`http://localhost:8888/api/forgot-password/update-email?userId=${userDto.id}&newEmail=${newEmail}`, {
                            method: 'PUT',
                        });

                        if (response.ok) {
                            localStorage.setItem('userDto', JSON.stringify(userDto));
                            document.getElementById('email').innerText = newEmail;
                            document.getElementById('email-edit').style.display = 'none';
                            document.getElementById('edit-email').style.display = 'inline-block';
                            showAlert("E-mail adresiniz başarıyla değiştirildi.");
                        } else {
                            showAlert("E-mail adresiniz değiştirilemedi. Lütfen tekrar deneyin.");
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        showAlert("Bir hata oluştu. Lütfen tekrar deneyin.");
                    }
                }
            } else {
                showAlert("E-posta adresleri eşleşmiyor. Lütfen tekrar kontrol edin.");
            }
        }
    });

    document.getElementById('edit-password').addEventListener('click', function () {
        const editSection = document.getElementById('password-edit');
        const editButton = document.getElementById('edit-password');
        const isVisible = editSection.style.display === 'block';
        editSection.style.display = isVisible ? 'none' : 'block';
        editButton.style.display = isVisible ? 'inline-block' : 'none';
    });

    document.getElementById('confirm-password').addEventListener('click', async function () {
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;
        if (newPassword && confirmNewPassword) {
            if (newPassword === confirmNewPassword) {
                const userDtoString = localStorage.getItem('userDto');
                if (userDtoString) {
                    const userDto = JSON.parse(userDtoString);

                    try {
                        const response = await fetch(`http://localhost:8888/api/forgot-password/update-password?userId=${userDto.id}&newPassword=${newPassword}`, {
                            method: 'PUT',
                        });

                        if (response.ok) {
                            document.getElementById('password-edit').style.display = 'none';
                            document.getElementById('edit-password').style.display = 'inline-block';
                            showAlert("Şifreniz başarıyla değiştirildi.");
                        } else {
                            showAlert("Şifreniz değiştirilemedi. Lütfen tekrar deneyin.");
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        showAlert("Bir hata oluştu. Lütfen tekrar deneyin.");
                    }
                }
            } else {
                showAlert("Şifreler eşleşmiyor. Lütfen tekrar kontrol edin.");
            }
        }
    });
});

function showAlert(message) {
    const customAlert = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('custom-alert-message');
    alertMessage.textContent = message;
    customAlert.classList.remove('hide-visibility');
    customAlert.classList.add('show-visibility');
}

function closeAlert() {
    const customAlert = document.getElementById('custom-alert');
    customAlert.classList.remove('show-visibility');
    customAlert.classList.add('hide-visibility');
}
