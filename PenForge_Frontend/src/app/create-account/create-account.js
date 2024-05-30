document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector('.user-form').addEventListener('submit', onSubmit);
});

function onSubmit(event) {
    event.preventDefault(); // Prevent page refresh

    console.log('Form submission function called');

    // Get user input from form
    const firstName = document.getElementById('firstname').value;
    const lastName = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const appUserLevel = document.querySelector('input[name="skill_level"]:checked').value;
    const profilePicture = document.getElementById('profile-picture').files[0];

    // Prepare the data object
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('appUserLevel', appUserLevel); // Update this key to match backend expectation
    formData.append('profilePicture', profilePicture);

    // Send registration request to server
    fetch('http://localhost:8888/api/v1/registration', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Successful:', data);
            if (data.code === 200) {
                document.getElementById('message2').innerText = "Kullanıcı Oluşturuldu";
            } else {
                document.getElementById('message1').innerText = "Kullanıcı Oluşturulamadı";
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
