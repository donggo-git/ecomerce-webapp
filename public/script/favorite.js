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

const token = localStorage.getItem("token");
const nav = document.getElementById("nav-right");
const container = document.getElementById("favorites-container");

const loadFavorite = async () => {
    try {
        const res = await fetch("/api/users/favorites", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
        const data = await res.json();

        if (!data.favorites.length) {
            container.innerHTML = "<p>No favorites yet</p>";
            return;
        }

        data.favorites.forEach(p => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
    <img src="${p.image}">
        <h4>${p.name}</h4>
        <p>$${p.price}</p>
        <button onclick="removeFavorite('${p._id}')">Remove</button>
        `;
            container.appendChild(card);
        });

    } catch (err) {
        console.error(err)
        container.textContent = err.message
    }
}

// Check if user is logged in
if (!token) {
    // Not logged in → redirect to unauthorized page
    window.location.href = "unauthorized.html";
}
else
    loadFavorite()

function removeFavorite(id) {
    fetch(`/api/users/favorites/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
        .then(() => location.reload());
}