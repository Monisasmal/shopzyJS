if (!localStorage.getItem("isLoggedIn")) {
  window.location.href = "login.html";
}

const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search");
const filter = document.getElementById("filter");
const toggleTheme = document.getElementById("toggle-theme");

let products = [];
let liked = JSON.parse(localStorage.getItem("liked") || "[]");

document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "light");

toggleTheme?.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const newTheme = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});

function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "login.html";
}

fetch("https://fakestoreapi.com/products")
  .then(res => res.json())
  .then(data => {
    products = data;
    displayProducts(products);
    populateFilter(products);
  });

function displayProducts(data) {
  productList.innerHTML = data.map(p => `
    <div class="card">
      <img src="${p.image}" alt="${p.title}" />
      <h4>${p.title}</h4>
      <p><strong>$${p.price}</strong></p>
      <button onclick="like(${p.id})">
        ${liked.includes(p.id) ? "❤️" : "🤍"}
      </button>
      <button onclick="view(${p.id})">View</button>
    </div>
  `).join('');
}

function like(id) {
  if (liked.includes(id)) {
    liked = liked.filter(x => x !== id);
  } else {
    liked.push(id);
  }
  localStorage.setItem("liked", JSON.stringify(liked));
  displayProducts(products);
}

function view(id) {
  localStorage.setItem("selectedProduct", id);
  window.location.href = "product.html";
}

function populateFilter(data) {
  const categories = [...new Set(data.map(p => p.category))];
  filter.innerHTML = `<option value="">All</option>` + 
    categories.map(c => `<option value="${c}">${c}</option>`).join('');
}

searchInput?.addEventListener("input", () => {
  const val = searchInput.value.toLowerCase();
  const filtered = products.filter(p => 
    p.title.toLowerCase().includes(val) ||
    p.category.toLowerCase().includes(val)
  );
  displayProducts(filtered);
});

filter?.addEventListener("change", () => {
  const selected = filter.value;
  const filtered = selected ? products.filter(p => p.category === selected) : products;
  displayProducts(filtered);
});
