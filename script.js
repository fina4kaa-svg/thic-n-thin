const heroContent = document.querySelector(".hero__content");
const railItems = document.querySelectorAll(".hero__rail-item[data-n]");
const detailPanels = document.querySelectorAll(".hero__detail[data-n]");
const detailNumbers = new Set([...detailPanels].map((panel) => panel.dataset.n));

railItems.forEach((item) => {
  if (!detailNumbers.has(item.dataset.n)) return;

  item.addEventListener("click", () => {
    const n = item.dataset.n;
    const isOpen = heroContent.dataset.detail === n;
    if (isOpen) {
      delete heroContent.dataset.detail;
    } else {
      heroContent.dataset.detail = n;
    }
  });
});

const backBtn = document.querySelector(".hero__back-btn");
if (backBtn) {
  backBtn.addEventListener("click", () => {
    delete heroContent.dataset.detail;
  });
}

const plusBtn = document.querySelector(".hero__plus-btn");
if (plusBtn) {
  plusBtn.addEventListener("click", () => {
    const n = heroContent.dataset.detail;
    if (!n) return;
    heroContent.dataset.white = n;
  });
}

const whiteBackBtns = document.querySelectorAll(".hero__white-page[data-n] .hero__white-back-btn");
whiteBackBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    delete heroContent.dataset.white;
  });
});
