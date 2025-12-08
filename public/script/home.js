let currentPage = 1;
let totalPages = 1;
const productGrid = document.getElementById('productGrid');
const pageNumber = document.getElementById('pageNumber');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

const applyFiltersBtn = document.getElementById('applyFilters');
const token = localStorage.getItem("token");
const username = localStorage.getItem("username");
const authArea = document.getElementById("authArea");

// Check if user browse to not valid pages
// List of valid "base" pages
const validPages = [
    '/',
    '/index.html',
    '/login.html',
    '/register.html',
    '/home.html',
    '/product.html',
    '/favorites.html',
    '/admin.html'
];

// Get current base page
const currentURL = window.location.pathname;
console.log(currentURL)
// Redirect if invalid
if (!validPages.includes(currentURL)) {
    window.location.href = '/404.html';
}



if (token && username) {
    authArea.innerHTML = `
        <span>Hello, ${username}</span>
        <button onclick="goFavorites()">Favorites</button>
        <button onclick="logout()">Logout</button>
    `;
} else {
    authArea.innerHTML = `
        <a href="/login.html">Login</a>
        <a href="/register.html">Register</a>
    `;
}

function logout() {
    localStorage.clear();
    window.location.href = "/index.html";
}

async function loadProducts() {
    const search = searchInput.value.trim();

    const brands = [...document.querySelectorAll('.brand-filter:checked')]
        .map(cb => cb.value)
        .join(';');

    const types = [...document.querySelectorAll('.type-filter:checked')]
        .map(cb => cb.value)
        .join(';');

    try {
        const res = await fetch(
            `/api/product?page=${currentPage}&search=${encodeURIComponent(search)}&brand=${brands}&type=${types}`
        );

        if (!res.ok) throw new Error("Failed to load products");

        const data = await res.json();

        productGrid.innerHTML = '';

        if (!data.products || data.products.length === 0) {
            productGrid.innerHTML = `<h3>No products found</h3>`;
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            return;
        }

        data.products.forEach(product => {
            const div = document.createElement('div');
            div.className = 'product-card';

            div.innerHTML = `
        <img src="${product.image || '../../images/default.png'}" alt="${product.name} image"/>
        <h4>${product.name}</h4>
        <p>${product.brand} - ${product.type}</p>
        <strong>$${product.price}</strong>
      `;

            div.onclick = () => {
                window.location.href = `/detail.html?id=${product._id}`;
            };

            productGrid.appendChild(div);
        });

        totalPages = data.totalPages || 1;
        pageNumber.textContent = currentPage;

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;

    } catch (err) {
        console.error("LOAD PRODUCTS ERROR:", err);
        productGrid.innerHTML = `<h3>Failed to load products</h3>`;
    }
}

searchBtn.onclick = () => {
    currentPage = 1;
    loadProducts();
};

applyFiltersBtn.onclick = () => {
    currentPage = 1;
    loadProducts();
};

prevBtn.onclick = () => {
    if (currentPage > 1) {
        currentPage--;
        loadProducts();
    }
};

nextBtn.onclick = () => {
    if (currentPage < totalPages) {
        currentPage++;
        loadProducts();
    }
};

function goFavorites() {
    window.location.href = "/favorite.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "/index.html";
}

loadProducts();
