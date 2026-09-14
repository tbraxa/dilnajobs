(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const navMobile = document.querySelector(".nav-mobile");
  if (navToggle && navMobile) {
    navToggle.addEventListener("click", () => {
      const open = navMobile.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  const sheetOpen = document.querySelector("[data-sheet-open]");
  const sheetClose = document.querySelector("[data-sheet-close]");
  const facets = document.querySelector(".facets");
  if (sheetOpen && facets) {
    sheetOpen.addEventListener("click", () => facets.classList.add("is-open"));
  }
  if (sheetClose && facets) {
    sheetClose.addEventListener("click", () => facets.classList.remove("is-open"));
  }

  const form = document.querySelector("[data-board]");
  if (!form) return;

  const qInput = form.querySelector('[name="q"]');
  const citySelect = form.querySelector('[name="city"]');
  const jobs = [...document.querySelectorAll(".job")];
  const countEl = document.querySelector("[data-count]");
  const emptyEl = document.querySelector(".empty");
  const clearButtons = document.querySelectorAll("[data-clear]");
  const params = new URLSearchParams(window.location.search);

  if (params.get("q") && qInput) qInput.value = params.get("q");
  if (params.get("city") && citySelect) citySelect.value = params.get("city");
  if (params.get("profession")) {
    const btn = form.querySelector('[data-profession="' + params.get("profession") + '"]');
    if (btn) setProfession(params.get("profession"));
  }

  function activeProfession() {
    const on = form.querySelector("[data-profession].is-on");
    return on && on.dataset.profession ? on.dataset.profession : "";
  }

  function setProfession(value) {
    form.querySelectorAll("[data-profession]").forEach((el) => {
      el.classList.toggle("is-on", (el.dataset.profession || "") === value);
    });
  }

  function apply() {
    const q = (qInput?.value || "").trim().toLocaleLowerCase("cs");
    const city = citySelect?.value || "";
    const profession = activeProfession();
    let shown = 0;
    jobs.forEach((job) => {
      const hay = (job.getAttribute("data-q") || "").toLocaleLowerCase("cs");
      const matchQ = !q || hay.includes(q);
      const matchCity = !city || job.dataset.city === city;
      const matchProf = !profession || job.dataset.profession === profession;
      const ok = matchQ && matchCity && matchProf;
      job.hidden = !ok;
      if (ok) shown += 1;
    });
    if (countEl) {
      const label = shown === 1 ? "nabídka" : shown < 5 ? "nabídky" : "nabídek";
      countEl.textContent = shown + " " + label;
    }
    if (emptyEl) emptyEl.hidden = shown !== 0;
    clearButtons.forEach((el) => {
      el.hidden = !(q || city || profession);
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    facets?.classList.remove("is-open");
    apply();
  });

  form.querySelectorAll("[data-profession]").forEach((el) => {
    el.addEventListener("click", () => {
      const next = el.classList.contains("is-on") ? "" : el.dataset.profession || "";
      setProfession(next);
      apply();
    });
  });

  citySelect?.addEventListener("change", apply);
  qInput?.addEventListener("input", apply);
  clearButtons.forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      if (qInput) qInput.value = "";
      if (citySelect) citySelect.value = "";
      setProfession("");
      apply();
    });
  });

  apply();
})();
