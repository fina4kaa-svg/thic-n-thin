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

// Populated below by each scrollable gallery/poster grid: {pageNumber,
// reset}. Letting the back button (and pageshow, for bfcache restores)
// call these directly - synchronously, at the moment we know for
// certain the page is closing or being freshly (re)shown - is more
// reliable than only resetting reactively off a data-white mutation,
// which depends on the attribute actually changing value and can miss
// edge cases like a browser back/forward-cache restore replaying the
// page with data-white already set to the same value it had when the
// tab was frozen.
const resettableTracks = [];

const backBtn = document.querySelector(".hero__back-btn");
if (backBtn) {
  backBtn.addEventListener("click", () => {
    if (heroContent.dataset.white) {
      const closingPage = heroContent.dataset.white;
      delete heroContent.dataset.white;
      resettableTracks.forEach(({ pageNumber, reset }) => {
        if (pageNumber === closingPage) reset();
      });
    } else {
      delete heroContent.dataset.detail;
    }
  });
}

window.addEventListener("pageshow", () => {
  resettableTracks.forEach(({ reset }) => reset());
});

const plusBtn = document.querySelector(".hero__plus-btn");
if (plusBtn) {
  plusBtn.addEventListener("click", () => {
    const n = heroContent.dataset.detail;
    if (!n) return;
    heroContent.dataset.white = n;
  });
}

const wordmarkBtn = document.querySelector(".hero__wordmark-btn");
if (wordmarkBtn) {
  wordmarkBtn.addEventListener("click", () => {
    heroContent.dataset.white = "posters";
  });
}

document.querySelectorAll(".hero__white-gallery").forEach((gallery) => {
  const page = gallery.closest(".hero__white-page");
  const pageNumber = page ? page.dataset.n : null;
  const track = gallery.querySelector(".hero__white-gallery-track");
  const dots = [...gallery.querySelectorAll(".hero__white-dot")];
  const slides = [...gallery.querySelectorAll(".hero__white-slide")];
  if (!track || dots.length === 0) return;

  const setActive = (index) => {
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  };

  // Snap the track back to the first slide instead of leaving it
  // wherever it was left last time. Toggling scroll-behavior to "auto"
  // for the reset means it jumps instantly rather than visibly
  // scrolling backwards as the page fades in; scroll-behavior:smooth
  // (CSS) is restored right after for normal dot/swipe navigation.
  const reset = () => {
    track.style.scrollBehavior = "auto";
    track.scrollLeft = 0;
    track.style.scrollBehavior = "";
    setActive(0);
  };

  if (pageNumber) {
    resettableTracks.push({ pageNumber, reset });
    // Also reset reactively on open, in case this page becomes visible
    // through some path other than the back button explicitly closing
    // it (see resettableTracks above for why both exist).
    new MutationObserver(() => {
      if (heroContent.dataset.white === pageNumber) reset();
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

// Poster page dot rail - same offsetTop/scrollTop-driven sync as the
// product galleries above, just on the vertical axis since this one
// scrolls by row instead of by single slide.
document.querySelectorAll(".hero__poster-viewport").forEach((viewport) => {
  const page = viewport.closest(".hero__white-page");
  const pageNumber = page ? page.dataset.n : null;
  const track = viewport.querySelector(".hero__poster-track");
  // Excludes the invisible ghost dot rail (see .hero__poster-dots--ghost
  // in style.css - a CSS-only trick to keep the poster grid centered
  // despite the real dot rail's width) which would otherwise double the
  // dot count and break the index-based active/scroll sync below.
  const dots = [...viewport.querySelectorAll(".hero__poster-dots:not(.hero__poster-dots--ghost) .hero__white-dot")];
  const rows = [...viewport.querySelectorAll(".hero__poster-row")];
  if (!track || dots.length === 0) return;

  const setActive = (index) => {
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  };

  const reset = () => {
    track.style.scrollBehavior = "auto";
    track.scrollTop = 0;
    track.style.scrollBehavior = "";
    setActive(0);
  };

  if (pageNumber) {
    resettableTracks.push({ pageNumber, reset });
    new MutationObserver(() => {
      if (heroContent.dataset.white === pageNumber) reset();
    }).observe(heroContent, { attributes: true, attributeFilter: ["data-white"] });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      track.scrollTo({ top: rows[i].offsetTop });
    });
  });

  track.addEventListener("scroll", () => {
    let closest = 0;
    let closestDist = Infinity;
    rows.forEach((row, i) => {
      const dist = Math.abs(row.offsetTop - track.scrollTop);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    setActive(closest);
  });
});
