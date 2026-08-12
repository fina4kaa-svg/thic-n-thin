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
  const page = gallery.closest(".hero__white-page");
  const pageNumber = page ? page.dataset.n : null;
  const viewport = gallery.querySelector(".hero__white-gallery-viewport");
  const track = gallery.querySelector(".hero__white-gallery-track");
  const dots = [...gallery.querySelectorAll(".hero__white-dot")];
  const slides = [...gallery.querySelectorAll(".hero__white-slide")];
  if (!track || !viewport || dots.length === 0) return;

  // Every slide is height:100%/width:auto (see style.css), so each one's
  // offsetWidth is already its own natural, height-constrained width -
  // same height as every other slide, width varying per photo, matching
  // the Figma gallery frames. The viewport has no fixed width of its own
  // (past the initial-paint fallback); it's resized here to whichever
  // slide is active, so the visible "window" frames each photo at its
  // own true proportions instead of stretching/cropping or leaving
  // empty space around it.
  let activeIndex = 0;
  const setActive = (index) => {
    activeIndex = index;
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    const slide = slides[index];
    if (slide) viewport.style.width = slide.offsetWidth + "px";
  };

  setActive(0);

  // Re-measure every time this specific page actually opens, not just
  // once at page load - offsetWidth read too early (before an image's
  // dimensions are resolved, or before the page's own layout settles)
  // can come back wrong, and nothing was ever correcting it afterward.
  // Watching data-white directly means this re-syncs on every open, so
  // it's self-healing regardless of image load/cache timing.
  if (pageNumber) {
    new MutationObserver(() => {
      if (heroContent.dataset.white === pageNumber) {
        requestAnimationFrame(() => setActive(activeIndex));
      }
    }).observe(heroContent, { attributes: true, attributeFilter: ["data-white"] });
  }

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
