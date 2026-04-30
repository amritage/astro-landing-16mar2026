const BATCH = 12;

const wrappers = document.querySelectorAll(".product-card-wrapper");

if (wrappers.length > 0) {
  let revealedCount = document.querySelectorAll(".product-card-wrapper:not([data-scroll-hidden])").length;

  function revealNextBatch() {
    const toReveal = document.querySelectorAll('.product-card-wrapper[data-scroll-hidden="true"]');
    let count = 0;
    for (const wrapper of toReveal) {
      if (count >= BATCH) break;
      wrapper.removeAttribute("data-scroll-hidden");
      wrapper.style.display = "";
      revealedCount++;
      count++;
    }
  }

  const sentinel = document.getElementById("scroll-sentinel");
  const indicator = document.getElementById("load-more-indicator");

  function setLoadingIndicator(isLoading) {
    if (!indicator) return;

    if (!isLoading) {
      indicator.style.display = "none";
      indicator.removeAttribute("aria-busy");
      indicator.textContent = "";
      return;
    }

    indicator.style.display = "flex";
    indicator.setAttribute("aria-busy", "true");
    indicator.innerHTML = `
      <span class="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-[#775a19]" aria-hidden="true"></span>
      <span class="sr-only">Loading more products</span>
    `;
  }

  function renderNoResults(noResults) {
    if (noResults.dataset.rendered === "true") return;

    noResults.dataset.rendered = "true";
    noResults.innerHTML = `
      <svg class="w-16 h-16 text-slate-200 mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm-1-7h2v2h2v2h-2v2h-2v-2h-2v-2h2V7z"/>
      </svg>
      <h3 class="font-headline text-2xl text-[#041632] mb-2">No matching fabrics found</h3>
      <p class="text-sm text-slate-500 max-w-xs mb-6">Try removing a few filters to broaden your search, or browse our full collection.</p>
      <a href="/fabric" class="inline-flex items-center gap-2 bg-[#041632] px-6 py-3 text-xs font-label font-bold uppercase tracking-widest text-white transition hover:bg-[#775a19]">
        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z"/>
        </svg>
        Browse all products
      </a>
    `;
  }

  if (sentinel) {
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        const remaining = document.querySelectorAll('.product-card-wrapper[data-scroll-hidden="true"]');
        if (remaining.length === 0) {
          io.disconnect();
          return;
        }
        setLoadingIndicator(true);
        requestAnimationFrame(() => {
          revealNextBatch();
          setLoadingIndicator(false);
        });
      },
      { rootMargin: "300px" }
    );
    io.observe(sentinel);
  }

  function onFilterStateChange(hasActiveFilters) {
    if (hasActiveFilters) {
      document.querySelectorAll('.product-card-wrapper[data-scroll-hidden="true"]').forEach((wrapper) => {
        wrapper.removeAttribute("data-scroll-hidden");
        wrapper.style.display = "";
      });
    } else {
      let count = 0;
      document.querySelectorAll(".product-card-wrapper").forEach((wrapper) => {
        count++;
        if (count > revealedCount) {
          wrapper.setAttribute("data-scroll-hidden", "true");
          wrapper.style.display = "none";
        } else {
          wrapper.style.display = "";
        }
      });
    }
  }

  window.__onFilterStateChange = onFilterStateChange;

  function updateEmptyState() {
    const visibleWrappers = document.querySelectorAll(".product-card-wrapper:not([data-scroll-hidden])");
    const hasVisibleCard = [...visibleWrappers].some((wrapper) => wrapper.style.display !== "none");
    const noResults = document.getElementById("no-results");
    if (!noResults) return;

    if (!hasVisibleCard) {
      renderNoResults(noResults);
    } else {
      noResults.textContent = "";
      delete noResults.dataset.rendered;
    }

    noResults.classList.toggle("hidden", hasVisibleCard);
    noResults.classList.toggle("flex", !hasVisibleCard);
  }

  const observer = new MutationObserver(updateEmptyState);
  wrappers.forEach((wrapper) => {
    observer.observe(wrapper, { attributes: true, attributeFilter: ["style"] });
  });
}
