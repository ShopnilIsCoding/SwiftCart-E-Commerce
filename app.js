
const API_BASE = "https://fakestoreapi.com";


document.getElementById("year").textContent = new Date().getFullYear();


const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
mobileMenuBtn?.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));


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

modalClose.addEventListener("click", closeModal);
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
const categoryWrap = document.getElementById("categoryWrap");
const cartCountEl = document.getElementById("cartCount");


let allProducts = [];
let currentProducts = [];
let currentCategory = "all";

cartCountEl.textContent = "0";


function setLoading(isLoading) {
  if (!loadingEl) return;
  loadingEl.classList.toggle("hidden", !isLoading);
}

function truncate(text, max = 45) {
  return text && text.length > max ? text.slice(0, max) + "..." : (text || "");
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

function renderProducts(list) {
  if (!list || list.length === 0) {
    productGrid.innerHTML = `
      <div class="col-span-full p-8 bg-white rounded-2xl border text-center">
        <p class="text-slate-600">No products found.</p>
      </div>
    `;
    return;
  }
  productGrid.innerHTML = list.map(productCard).join("");
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
        </div>
      </div>
    `
    )
    .join("");
}


function renderCategoryButtons(categories) {
  const allBtn = categoryButton("all", "All");
  const otherBtns = categories.map((c) => categoryButton(c, titleCase(c))).join("");
  categoryWrap.innerHTML = allBtn + otherBtns;
  setActiveCategoryBtn(currentCategory);
}

function categoryButton(value, label) {
  return `
    <button
      class="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 text-sm"
      data-cat="${value}"
    >
      ${label}
    </button>
  `;
}

function setActiveCategoryBtn(cat) {
  const btns = categoryWrap.querySelectorAll("button[data-cat]");
  btns.forEach((b) => {
    const isActive = b.dataset.cat === cat;
    b.classList.toggle("bg-slate-900", isActive);
    b.classList.toggle("text-white", isActive);
    b.classList.toggle("border-slate-900", isActive);

    b.classList.toggle("bg-white", !isActive);
    b.classList.toggle("text-slate-900", !isActive);
  });
}

function titleCase(str) {
  return (str || "")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}


async function fetchCategories() {
  const res = await fetch(`${API_BASE}/products/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

async function fetchAllProducts() {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

async function fetchProductsByCategory(category) {
  const res = await fetch(`${API_BASE}/products/category/${encodeURIComponent(category)}`);
  if (!res.ok) throw new Error("Failed to fetch category products");
  return res.json();
}


async function fetchSingleProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product details");
  return res.json();
}


function modalLoadingUI() {
  return `
    <div class="p-2">
      <div class="animate-pulse space-y-4">
        <div class="h-6 bg-slate-100 rounded w-3/4"></div>
        <div class="h-4 bg-slate-100 rounded w-1/2"></div>
        <div class="h-64 bg-slate-100 rounded-2xl"></div>
        <div class="h-4 bg-slate-100 rounded"></div>
        <div class="h-4 bg-slate-100 rounded w-5/6"></div>
        <div class="h-10 bg-slate-100 rounded-xl w-40"></div>
      </div>
    </div>
  `;
}


function productModalUI(p) {
  return `
    <div class="grid gap-6 md:grid-cols-2">
      <div class="bg-slate-50 rounded-2xl p-4 grid place-items-center">
        <img src="${p.image}" alt="${p.title}" class="h-64 object-contain" />
      </div>

      <div>
        <div class="flex flex-wrap items-center gap-2">
          <span class="px-2 py-1 rounded-lg text-xs border bg-slate-50">${p.category}</span>
          <span class="text-xs text-slate-500">ID: ${p.id}</span>
        </div>

        <h2 class="mt-2 text-xl font-bold leading-snug">${p.title}</h2>

        <div class="mt-3 flex items-center justify-between">
          <span class="font-bold text-lg">$${p.price}</span>
          <div class="flex items-center gap-2">
            ${renderStars(p.rating?.rate)}
            <span class="text-sm text-slate-600">
              ${p.rating?.rate ?? 0} • ${p.rating?.count ?? 0} reviews
            </span>
          </div>
        </div>

        <p class="mt-4 text-slate-600 text-sm leading-relaxed">
          ${p.description}
        </p>

        <div class="mt-6 flex flex-wrap gap-2">
          <button
            class="px-5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
            id="modalAddBtn"
            data-id="${p.id}"
          >
            Add to Cart
          </button>

          <button
            class="px-5 py-2 rounded-xl border hover:bg-slate-50"
            onclick="document.getElementById('modalClose').click()"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  `;
}


async function init() {
  setLoading(true);
  try {
    const [cats, products] = await Promise.all([fetchCategories(), fetchAllProducts()]);
    allProducts = products;
    currentProducts = products;

    renderCategoryButtons(cats);
    renderProducts(currentProducts);
    renderTopRated(allProducts);
  } catch (err) {
    console.error(err);
    productGrid.innerHTML = `
      <div class="col-span-full p-8 bg-white rounded-2xl border text-center">
        <p class="text-red-600 font-semibold">Failed to load data.</p>
        <p class="text-slate-600 mt-2">Check internet and refresh.</p>
      </div>
    `;
    topRatedGrid.innerHTML = "";
    categoryWrap.innerHTML = "";
  } finally {
    setLoading(false);
  }
}


categoryWrap.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-cat]");
  if (!btn) return;

  const cat = btn.dataset.cat;
  if (cat === currentCategory) return;

  currentCategory = cat;
  setActiveCategoryBtn(currentCategory);

  setLoading(true);
  try {
    if (cat === "all") currentProducts = allProducts;
    else currentProducts = await fetchProductsByCategory(cat);

    renderProducts(currentProducts);
  } catch (err) {
    console.error(err);
    renderProducts([]);
  } finally {
    setLoading(false);
  }
});


document.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = Number(btn.dataset.id);

  if (action === "details") {
   
    openModal(modalLoadingUI());
    try {
      const fresh = await fetchSingleProduct(id);
      openModal(productModalUI(fresh));
    } catch (err) {
      console.error(err);
      openModal(`
        <div class="p-4">
          <p class="text-red-600 font-semibold">Failed to load product details.</p>
          <button class="mt-4 px-4 py-2 rounded-xl border hover:bg-slate-50" onclick="document.getElementById('modalClose').click()">
            Close
          </button>
        </div>
      `);
    }
  }

  if (action === "add") {
    
    const product =
      currentProducts.find((p) => p.id === id) || allProducts.find((p) => p.id === id);
    if (!product) return;
    alert(`Added to cart: ${truncate(product.title, 30)}`);
  }
});


modalBody.addEventListener("click", (e) => {
  const addBtn = e.target.closest("#modalAddBtn");
  if (!addBtn) return;

  const id = Number(addBtn.dataset.id);
  const product =
    currentProducts.find((p) => p.id === id) || allProducts.find((p) => p.id === id);

  if (!product) return;
  alert(`Added to cart: ${truncate(product.title, 30)}`);
});


init();
