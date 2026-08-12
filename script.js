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
  const slides = [...gallery.querySelectorAll(".hero__white-slide")];
  if (!track || dots.length === 0) return;

  const setActive = (index) => {
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  };

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      // Each slide's own offsetLeft, not clientWidth * i - the two can be
      // a fraction of a pixel apart (vw-based widths vs. the browser's own
      // integer-rounded offsetLeft), which was enough drift to land the
      // scroll position just short of the slide boundary and leave a
      // sliver of the neighboring image visible along one edge. Smoothness
      // comes from the track's own scroll-behavior:smooth (CSS) instead of
      // the behavior:"smooth" option here, so there's a single scrolling
      // system driving the animation instead of the JS animation and the
      // browser's native scroll-snap potentially disagreeing mid-transition.
      track.scrollTo({ left: slides[i].offsetLeft });
    });
  });

  track.addEventListener("scroll", () => {
    let closest = 0;
    let closestDist = Infinity;
    slides.forEach((slide, i) => {
      const dist = Math.abs(slide.offsetLeft - track.scrollLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setActive(closest);
  });
});
