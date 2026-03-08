const menuToggleButton = document.getElementById("menuToggle");
const menuLinksList = document.getElementById("menuLinks");
const currentYearSpan = document.getElementById("currentYear");

if (currentYearSpan) {
  currentYearSpan.textContent = new Date().getFullYear();
}

if (menuToggleButton && menuLinksList) {
  menuToggleButton.addEventListener("click", () => {
    const isOpen = menuLinksList.classList.toggle("is-open");
    menuToggleButton.setAttribute("aria-expanded", String(isOpen));
  });

  menuLinksList.querySelectorAll("a").forEach((linkItem) => {
    linkItem.addEventListener("click", () => {
      menuLinksList.classList.remove("is-open");
      menuToggleButton.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menuLinksList.classList.remove("is-open");
      menuToggleButton.setAttribute("aria-expanded", "false");
    }
  });
}