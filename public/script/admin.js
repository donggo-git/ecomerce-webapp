const token = localStorage.getItem("token");
const usersList = document.getElementById("usersList");
const favoritesSection = document.getElementById("favoritesSection");
const favoritesList = document.getElementById("favoritesList");
const selectedUser = document.getElementById("selectedUser");
const isAdmin = localStorage.getItem("isAdmin")

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



// Check if user is admin
async function checkAdmin() {
    if (!token) {
        window.location.href = "/unauthorized.html";
        return;
    }

    if (!isAdmin)
        window.location.href = "/unauthorized.html";
    else
        loadUsers();
}

// Load all users
async function loadUsers() {
    console.log(token)
    try {
        const res = await fetch("/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to load users");

        const data = await res.json();
        console.log(data)
        usersList.innerHTML = "";
        data.users.forEach(user => {
            const div = document.createElement("div");
            div.className = "user-card";
            div.innerHTML = `
                <strong>${user.username}</strong> (${user.email}) - Favorites: ${user.favoriteCount}
            `;
            div.onclick = () => showFavorites(user._id, user.username);
            usersList.appendChild(div);
        });

    } catch (err) {
        console.error(err);
        usersList.innerHTML = "<p>Failed to load users</p>";
    }
}

// Show favorites of a specific user
async function showFavorites(userId, username) {
    try {
        const res = await fetch(`/api/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to load favorites");

        const data = await res.json();

        selectedUser.textContent = username;
        favoritesList.innerHTML = "";

        if (!data.favoriteProducts || data.favoriteProducts.length === 0) {
            favoritesList.innerHTML = "<p>No favorite products</p>";
        } else {
            data.favoriteProducts.forEach(p => {
                const div = document.createElement("div");
                div.className = "product-card";
                div.innerHTML = `
                    <img src="${p.image || '/images/default.png'}" />
                    <strong>${p.name}</strong> - $${p.price}
                `;
                favoritesList.appendChild(div);
            });
        }

        favoritesSection.style.display = "block";
    } catch (err) {
        alert(err.message);
    }
}

function closeFavorites() {
    favoritesSection.style.display = "none";
}

// Logout
function logout() {
    localStorage.clear();
    window.location.href = "/login.html";
}

// Initialize
checkAdmin();
