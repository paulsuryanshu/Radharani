// form.js

// Select elements
const registerForm = document.querySelector('.form form');
const loginForm = document.querySelector('.form-login form');

// Validate registration form
if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.querySelector('.name').value.trim();
        const email = document.querySelector('.email').value.trim();
        const password = document.querySelector('.password').value.trim();
        const confirmPassword = document.querySelector('.confirm-password').value.trim();

        // Client-side validation
        if (!name || !email || !password || !confirmPassword) {
            alert("Please fill out all fields.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        // Prepare data for POST request
        const formData = new URLSearchParams();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);

        // Submit form data via fetch API
        try {
            const response = await fetch('register_process.php', {
                method: 'POST',
                body: formData,
            });

            const result = await response.text();

            if (result.includes('success')) {
                alert("Registration successful! Redirecting to login page.");
                window.location.href = 'login.html';
            } else {
                alert(result);
            }
        } catch (error) {
            alert("An error occurred during registration. Please try again.");
        }
    });
}

// Validate login form
if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.querySelector('.email').value.trim();
        const password = document.querySelector('.password').value.trim();

        if (!email || !password) {
            alert("Please fill out both fields.");
            return;
        }

        // Prepare data for POST request
        const formData = new URLSearchParams();
        formData.append('email', email);
        formData.append('password', password);

        // Submit form data via fetch API
        try {
            const response = await fetch('login_process.php', {
                method: 'POST',
                body: formData,
            });

            const result = await response.text();

            if (result.includes('success')) {
                alert("Login successful! Redirecting to dashboard.");
                window.location.href = 'dashboard.php';
            } else {
                alert("Invalid email or password.");
            }
        } catch (error) {
            alert("An error occurred during login. Please try again.");
        }
    });
}
