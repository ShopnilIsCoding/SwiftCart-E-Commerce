
const yearEl = document.getElementById("year");
yearEl.textContent = new Date().getFullYear();


const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

mobileMenuBtn?.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});


const newsletterForm = document.getElementById("newsletterForm");
newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("newsletterEmail").value.trim();
  alert(`Subscribed: ${email}`);
  newsletterForm.reset();
});


const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");

modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
});
