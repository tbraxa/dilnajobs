(function () {
  var toggle = document.querySelector(".menu-toggle");
  var drawer = document.querySelector(".nav-drawer");
  if (toggle && drawer) {
    toggle.addEventListener("click", function () {
      var open = drawer.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  var filterBtn = document.querySelector(".filter-toggle");
  var filters = document.querySelector(".filters");
  if (filterBtn && filters) {
    filterBtn.addEventListener("click", function () {
      filters.classList.toggle("is-open");
    });
  }
})();
