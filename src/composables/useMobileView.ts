// composables/useMobileView.ts
// ─────────────────────────────────────────────────────────────
// Globally detects whether the viewport is mobile-sized and
// applies / removes the `mobile-view` class on <html> so every
// page is affected without any per-page code.
//
// Usage – import once in App.vue:
//   import { useMobileView } from '@/composables/useMobileView'
//   const { isMobileView } = useMobileView()
//
// All pages can also import it to READ the reactive value:
//   const { isMobileView } = useMobileView()
// ─────────────────────────────────────────────────────────────

import { ref, onMounted, onBeforeUnmount } from "vue";

// Shared singleton so every component reads the same ref
const isMobileView = ref(false);

// The breakpoint that triggers "mobile view" (px)
const MOBILE_BREAKPOINT = 768;

function updateMobileState() {
  isMobileView.value = window.innerWidth <= MOBILE_BREAKPOINT;

  // Apply / remove class on <html> so global CSS can target it
  if (isMobileView.value) {
    document.documentElement.classList.add("mobile-view");
  } else {
    document.documentElement.classList.remove("mobile-view");
  }
}

let registered = false; // only attach the listener once

export function useMobileView() {
  onMounted(() => {
    if (!registered) {
      registered = true;
      updateMobileState(); // run immediately
      window.addEventListener("resize", updateMobileState);
    }
  });

  onBeforeUnmount(() => {
    // We intentionally keep the listener alive for the whole
    // session because the html class must stay in sync.
    // If you ever fully unmount App.vue you can clean up here:
    // window.removeEventListener('resize', updateMobileState)
  });

  return { isMobileView };
}
