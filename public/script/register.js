// Check if user browse to not valid pages
(function () {
    const validPages = [
        '/',
        '/index.html',
        '/login.html',
        '/register.html',
        '/home.html',
        '/detail.html',
        '/favorite.html',
        '/admin.html'
    ];

    if (!validPages.includes(window.location.pathname)) {
        window.location.href = '/404.html';
    }
})();



const form = document.getElementById('registerForm');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (password !== confirm) {
        message.textContent = "Passwords do not match";
        return;
    }

    try {
        const res = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        localStorage.setItem('token', data.token);
        message.textContent = "Registration successful!";
        window.location.href = "/login.html";

    } catch (err) {
        message.textContent = err.message;
    }
});
