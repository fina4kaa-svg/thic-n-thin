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
    if (heroContent.dataset.white) {
      delete heroContent.dataset.white;
    } else {
      delete heroContent.dataset.detail;
    }
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

document.querySelectorAll(".hero__white-gallery").forEach((gallery) => {
  const track = gallery.querySelector(".hero__white-gallery-track");
  const dots = [...gallery.querySelectorAll(".hero__white-dot")];
  if (!track || dots.length === 0) return;

  const setActive = (index) => {
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  };

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      track.scrollTo({ left: track.clientWidth * i, behavior: "smooth" });
    });
  });

  track.addEventListener("scroll", () => {
    const index = Math.round(track.scrollLeft / track.clientWidth);
    setActive(index);
  });
});
