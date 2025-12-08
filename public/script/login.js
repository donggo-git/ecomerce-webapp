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




document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const identifier = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ identifier, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Login failed");
            return;
        }
        console.log(data)
        //  Save token & user
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("isAdmin", data.user.isAdmin);
        //  Redirect after success
        if (!data.user.isAdmin)
            window.location.href = "/index.html";
        else
            window.location.href = "/admin.html"

    } catch (err) {
        console.error(err);
        alert("Server error");
    }
});
