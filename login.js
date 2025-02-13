// Attach event listener to the login form
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get values from input fields
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if both are 'sus'
    if (username === 'sus' && password === 'sus') {
        // Redirect to welcome.html
        window.location.href = 'card.html';
    } else {
        alert('Invalid Username or Password');
    }
});
