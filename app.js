

const API_BASE = "https://fakestoreapi.com";

const yearEl = document.getElementById("year");
yearEl.textContent = new Date().getFullYear();

// Mobile menu toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

mobileMenuBtn?.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Newsletter (simple demo)
const newsletterForm = document.getElementById("newsletterForm");
newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("newsletterEmail").value.trim();
  alert(`Subscribed: ${email}`);
  newsletterForm.reset();
});


const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const modalBody = document.getElementById("modalBody");

modalClose.addEventListener("click", () => closeModal());
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

function openModal(html) {
  modalBody.innerHTML = html;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeModal() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}


const productGrid = document.getElementById("productGrid");
const topRatedGrid = document.getElementById("topRatedGrid");
const loadingEl = document.getElementById("loading");


let allProducts = [];


function setLoading(isLoading) {
  if (!loadingEl) return;
  if (isLoading) loadingEl.classList.remove("hidden");
  else loadingEl.classList.add("hidden");
}

function truncate(text, max = 45) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
}

function renderStars(rate) {
  
  const r = Math.round(rate || 0);
  let stars = "";
  for (let i = 1; i <= 5; i++) stars += i <= r ? "★" : "☆";
  return `<span class="text-amber-500 text-sm">${stars}</span>`;
}

function productCard(p) {
  return `
    <div class="p-5 bg-white rounded-2xl border shadow-sm flex flex-col">
      <div class="h-40 rounded-xl bg-slate-50 grid place-items-center overflow-hidden">
        <img src="${p.image}" alt="${p.title}" class="h-36 object-contain" />
      </div>

      <div class="mt-4 flex-1">
        <div class="flex items-center justify-between gap-2">
          <span class="px-2 py-1 rounded-lg text-xs border bg-slate-50">${p.category}</span>
          <span class="font-bold">$${p.price}</span>
        </div>

        <h3 class="mt-3 font-semibold leading-snug" title="${p.title}">
          ${truncate(p.title, 55)}
        </h3>

        <div class="mt-2 flex items-center justify-between">
          <div class="flex items-center gap-2">
            ${renderStars(p.rating?.rate)}
            <span class="text-xs text-slate-600">(${p.rating?.rate ?? 0})</span>
          </div>
          <span class="text-xs text-slate-500">${p.rating?.count ?? 0} sold</span>
        </div>
      </div>

      <div class="mt-4 flex gap-2">
        <button
          class="flex-1 px-4 py-2 rounded-xl border hover:bg-slate-50"
          data-action="details"
          data-id="${p.id}"
        >
          Details
        </button>

        <button
          class="flex-1 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
          data-action="add"
          data-id="${p.id}"
        >
          Add to Cart
        </button>
      </div>
    </div>
  `;
}

function renderProducts(products) {
  if (!productGrid) return;

  if (!products || products.length === 0) {
    productGrid.innerHTML = `
      <div class="col-span-full p-8 bg-white rounded-2xl border text-center">
        <p class="text-slate-600">No products found.</p>
      </div>
    `;
    return;
  }

  productGrid.innerHTML = products.map(productCard).join("");
}

function renderTopRated(products) {
  
  const sorted = [...products].sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
  const top3 = sorted.slice(0, 3);

  topRatedGrid.innerHTML = top3
    .map(
      (p) => `
      <div class="p-6 bg-white rounded-2xl border shadow-sm flex gap-4">
        <div class="w-24 h-24 bg-slate-50 rounded-xl grid place-items-center overflow-hidden shrink-0">
          <img src="${p.image}" alt="${p.title}" class="h-20 object-contain" />
        </div>
        <div class="flex-1">
          <span class="text-xs px-2 py-1 rounded-lg border bg-slate-50">${p.category}</span>
          <h3 class="mt-2 font-semibold leading-snug" title="${p.title}">
            ${truncate(p.title, 55)}
          </h3>
          <div class="mt-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
              ${renderStars(p.rating?.rate)}
              <span class="text-xs text-slate-600">${p.rating?.rate ?? 0}</span>
            </div>
            <span class="font-bold">$${p.price}</span>
          </div>
          <div class="mt-3">
            <a href="#products" class="text-sm font-semibold text-slate-900 underline">View in Products</a>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

async function fetchAllProducts() {
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    allProducts = data;
    renderProducts(allProducts);
    renderTopRated(allProducts);
  } catch (err) {
    console.error(err);
    productGrid.innerHTML = `
      <div class="col-span-full p-8 bg-white rounded-2xl border text-center">
        <p class="text-red-600 font-semibold">Failed to load products.</p>
        <p class="text-slate-600 mt-2">Check your internet connection and try again.</p>
      </div>
    `;
    topRatedGrid.innerHTML = "";
  } finally {
    setLoading(false);
  }
}

// Event delegation for product buttons
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = Number(btn.dataset.id);
  const product = allProducts.find((p) => p.id === id);

  if (!product) return;

  if (action === "details") {
    
    openModal(`
      <div class="grid gap-6 md:grid-cols-2">
        <div class="bg-slate-50 rounded-2xl p-4 grid place-items-center">
          <img src="${product.image}" alt="${product.title}" class="h-56 object-contain" />
        </div>
        <div>
          <h2 class="text-xl font-bold">${product.title}</h2>
          <p class="mt-3 text-slate-600 text-sm">${product.description}</p>

          <div class="mt-4 flex items-center justify-between">
            <span class="font-bold text-lg">$${product.price}</span>
            <div class="flex items-center gap-2">
              ${renderStars(product.rating?.rate)}
              <span class="text-sm text-slate-600">(${product.rating?.rate ?? 0})</span>
            </div>
          </div>

          <div class="mt-5 flex gap-2">
            <button class="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800" id="modalAddBtn" data-id="${product.id}">
              Add to Cart
            </button>
            <button class="px-4 py-2 rounded-xl border hover:bg-slate-50" onclick="document.getElementById('modalClose').click()">
              Close
            </button>
          </div>
        </div>
      </div>
    `);
  }

  if (action === "add") {
    
    alert(`Added to cart: ${truncate(product.title, 30)}`);
  }
});

// Modal add button click (delegation inside modal)
modalBody.addEventListener("click", (e) => {
  const addBtn = e.target.closest("#modalAddBtn");
  if (!addBtn) return;

  const id = Number(addBtn.dataset.id);
  const product = allProducts.find((p) => p.id === id);
  if (!product) return;

  alert(`Added to cart: ${truncate(product.title, 30)}`);
});

// Init
fetchAllProducts();
