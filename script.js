let products = [];
let filteredProducts = [];

let currentPage = 1;
const productsPerPage = 6;

const homePage = document.getElementById("homePage");
const cartPage = document.getElementById("cartPage");
const checkoutPage = document.getElementById("checkoutPage");

async function getApiData() {
  const response = await fetch("https://fakestoreapi.com/products");

  products = await response.json();

  filteredProducts = [...products];

  displayProducts();
  createPagination();
  updateCartCount();
}

function displayProducts() {
  const container = document.getElementById("products");

  container.innerHTML = "";

  const start = (currentPage - 1) * productsPerPage;

  const end = start + productsPerPage;

  const pageData = filteredProducts.slice(start, end);

  pageData.forEach((product) => {
    const card = document.createElement("div");

    card.classList.add("card");

    card.innerHTML = `
        <img src="${product.image}">
        <h3>${product.title}</h3>
        <p>$ ${product.price}</p>
        <p>${product.category}</p>
        
        <button class="cart-btn" onclick="addToCart(${product.id})">
        Add To Cart
        </button>
        `;

    container.appendChild(card);
  });
}

function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const product = products.find((item) => item.id === id);

  cart.push(product);

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  document.getElementById("cartCount").innerText = cart.length;
}

function createPagination() {
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const pagination = document.getElementById("pagination");

  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");

    btn.innerText = i;

    btn.onclick = () => {
      currentPage = i;
      displayProducts();
    };

    pagination.appendChild(btn);
  }
}

document.getElementById("search").addEventListener("input", function () {
  const value = this.value.toLowerCase();

  filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(value),
  );

  currentPage = 1;

  displayProducts();
  createPagination();
});

document.getElementById("filter").addEventListener("change", function () {
  if (this.value === "all") {
    filteredProducts = [...products];
  } else {
    filteredProducts = products.filter(
      (product) => product.category === this.value,
    );
  }

  currentPage = 1;

  displayProducts();
  createPagination();
});

document.getElementById("cartBtn").addEventListener("click", showCart);

document.getElementById("homeBtn").addEventListener("click", showHome);

function showHome() {
  homePage.classList.remove("hidden");

  cartPage.classList.add("hidden");

  checkoutPage.classList.add("hidden");
}

function showCart() {
  homePage.classList.add("hidden");

  cartPage.classList.remove("hidden");

  checkoutPage.classList.add("hidden");

  renderCart();
}

function renderCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let total = 0;

  const container = document.getElementById("cartItems");

  container.innerHTML = "";

  cart.forEach((item, index) => {
    total += item.price;

    container.innerHTML += `
        <div class="cart-item">
        
        <span>${item.title}</span>
        
        <div> 
        $${item.price}
        
        <button class="remove-btn" onclick="removeItem(${index})">
        Remove
        </button>
        
        </div>
    
        </div>
        `;
  });

  document.getElementById("totalPrice").innerText =
    `Total : $${total.toFixed(2)}`;
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart"));

  cart.splice(index, 1);

  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart();
  updateCartCount();
}

document.getElementById("checkoutBtn").addEventListener("click", () => {
  cartPage.classList.add("hidden");

  checkoutPage.classList.remove("hidden");
});

document.getElementById("checkoutForm").addEventListener("submit", (e) => {
  e.preventDefault();

  alert("Order Placed Successfully");

  localStorage.removeItem("cart");

  updateCartCount();

  showHome();
});

getApiData();
