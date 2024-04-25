document.addEventListener('DOMContentLoaded', (event) => {
    // Add event listener to form submission to trigger onSubmit function
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
    const skillLevel = document.querySelector('input[name="skill_level"]:checked').value;

    // Prepare the data object
    const data = {
        firstName: firstName,
        lastName: lastName,
        password: password,
        email: email,
        appUserLevel: skillLevel
    };

    // Send registration request to server
    fetch('http://localhost:8888/api/v1/registration', {
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
            console.log('Successful:', data);
            if (data.code === 200) {

                document.getElementById('message2').innerText = "Kullanıcı Oluşturuldu";
            } else {
                document.getElementById('message1').innerText = "Kullanıcı Oluşturulamadı";            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
