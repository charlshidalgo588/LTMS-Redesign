<template>
  <header class="topbar">
    <div class="topbar-left">
      <button class="brand-wrap" type="button" @click="goToDashboard()">
        <img class="brand-logo" :src="logo" alt="LTO Logo" />
        <div class="brand-copy">
          <span class="brand-kicker">LTMS PORTAL</span>
          <span class="brand-text">DASHBOARD</span>
        </div>
      </button>
    </div>

    <!-- Mobile hamburger -->
    <button
      class="mobile-nav-toggle"
      type="button"
      :aria-expanded="showMobileNav"
      aria-label="Toggle navigation"
      @click="showMobileNav = !showMobileNav"
    >
      <span></span><span></span><span></span>
    </button>

    <nav class="topbar-nav" :class="{ 'mobile-open': showMobileNav }">
      <a
        href="#"
        class="nav-item"
        :class="{ active: activeRoute === 'official' }"
        @click.prevent="
          openOfficialWebsite();
          showMobileNav = false;
        "
      >
        LTO OFFICIAL WEBPAGE
      </a>
      <a
        href="#"
        class="nav-item"
        :class="{ active: activeRoute === 'elearning' }"
        @click.prevent="
          goToELearning();
          showMobileNav = false;
        "
      >
        E-LEARNING
      </a>
      <a
        href="#"
        class="nav-item"
        :class="{ active: activeRoute === 'contact' }"
        @click.prevent="
          goToContact();
          showMobileNav = false;
        "
      >
        CONTACT
      </a>
      <a
        href="#"
        class="nav-item"
        :class="{ active: activeRoute === 'dashboard' }"
        @click.prevent="
          goToDashboard();
          showMobileNav = false;
        "
      >
        DASHBOARD
      </a>
    </nav>

    <div ref="userMenuRef" class="user-menu">
      <button class="user-menu-trigger" type="button" @click="toggleUserMenu">
        <div class="user-avatar">H</div>
        <div class="user-info">
          <span class="user-name">HIDALGO</span>
          <span class="user-id">26-050525-2424960</span>
        </div>
        <svg class="user-caret" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 9l6 6 6-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <div v-if="showUserMenu" class="user-dropdown">
        <button type="button" class="user-dropdown-item" @click="goToProfile()">
          Profile
        </button>
        <button
          type="button"
          class="user-dropdown-item"
          @click="emit('open-settings')"
        >
          Settings
        </button>
        <button
          type="button"
          class="user-dropdown-item danger"
          @click="emit('request-logout')"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRouter } from "vue-router";
import logo from "@/assets/logo.png";

// ── Props ────────────────────────────────────────────────────
// Pass isPageLoading from the parent so the topbar respects it
const props = withDefaults(
  defineProps<{
    isPageLoading?: boolean;
  }>(),
  { isPageLoading: false },
);

// ── Emits ────────────────────────────────────────────────────
const emit = defineEmits<{
  (e: "open-settings"): void;
  (e: "request-logout"): void;
}>();

// ── Internal state ───────────────────────────────────────────
const showMobileNav = ref(false);
const showUserMenu = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

const router = useRouter();

// ── Active nav highlight ─────────────────────────────────────
// Derives which nav item should appear active from the current route
const activeRoute = computed(() => {
  const path = router.currentRoute.value.path;
  if (path === "/home" || path === "/") return "dashboard";
  if (path.startsWith("/e-learning")) return "elearning";
  if (path.startsWith("/contact")) return "contact";
  return "";
});

// ── Helpers ──────────────────────────────────────────────────
const delay = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/** Navigate with a brief loading state. Skips if already on the target. */
async function navigate(target: string) {
  closeUserMenu();
  showMobileNav.value = false;
  const current = router.currentRoute.value.path;
  if (current === target) return;
  try {
    await router.push(target);
  } catch {
    /* navigation cancelled — ignore */
  }
}

// ── Navigation ───────────────────────────────────────────────
function goToDashboard() {
  navigate("/home");
}
function goToELearning() {
  navigate("/e-learning");
}
function goToContact() {
  navigate("/contact");
}

async function goToProfile() {
  closeUserMenu();
  navigate("/profile");
}

async function openOfficialWebsite() {
  closeUserMenu();
  showMobileNav.value = false;
  if (props.isPageLoading) return;
  await delay(180);
  window.open("https://lto.gov.ph", "_blank", "noopener,noreferrer");
}

// ── User menu ────────────────────────────────────────────────
function toggleUserMenu() {
  if (props.isPageLoading) return;
  showUserMenu.value = !showUserMenu.value;
}

function closeUserMenu() {
  showUserMenu.value = false;
}

function handleDocumentClick(event: MouseEvent) {
  const target = event.target as Node | null;
  if (!userMenuRef.value || !target) return;
  if (!userMenuRef.value.contains(target)) closeUserMenu();
}

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocumentClick);
});
</script>

<style scoped>
/* ── Topbar shell ─────────────────────────────────────────── */
.topbar {
  min-height: 72px;
  background: linear-gradient(180deg, #0d468f 0%, #0b3d82 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  box-shadow: 0 8px 18px rgba(10, 46, 99, 0.18);
  gap: 12px;
  position: sticky;
  top: 0;
  z-index: 100;
}

/* ── Brand ────────────────────────────────────────────────── */
.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}

.brand-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.brand-kicker {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  opacity: 0.88;
  color: #fff;
}

.brand-logo {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
}

.brand-text {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.3px;
  color: #fff;
}

/* ── Nav links ────────────────────────────────────────────── */
.topbar-nav {
  display: flex;
  align-items: center;
  gap: 22px;
}

.nav-item {
  position: relative;
  color: rgba(255, 255, 255, 0.88);
  text-decoration: none;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.04em;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid transparent;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
  white-space: nowrap;
}

.nav-item:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.14);
  transform: translateY(-1px);
}

.nav-item.active {
  color: #ffffff;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
  border-color: rgba(255, 255, 255, 0.22);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    0 10px 22px rgba(4, 20, 52, 0.22);
}

.nav-item.active::after {
  content: "";
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 6px;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, #ffffff 0%, #cfe0ff 100%);
  opacity: 0.95;
}

/* ── Hamburger (hidden on desktop) ───────────────────────── */
.mobile-nav-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  order: 3;
}

.mobile-nav-toggle span {
  display: block;
  width: 22px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: 0.2s ease;
}

/* ── User menu ────────────────────────────────────────────── */
.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.user-menu-trigger {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 6px 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  cursor: pointer;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  flex: 0 0 30px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.15;
}

.user-name {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.user-id {
  font-size: 11px;
  font-weight: 700;
  opacity: 0.84;
  white-space: nowrap;
}

.user-caret {
  width: 14px;
  height: 14px;
  opacity: 0.86;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 180px;
  padding: 8px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #dbe5f3;
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.16);
  z-index: 40;
}

.user-dropdown-item {
  width: 100%;
  border: none;
  background: transparent;
  color: #1f2937;
  text-align: left;
  border-radius: 10px;
  padding: 11px 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.user-dropdown-item:hover {
  background: #f4f8ff;
  color: #154b96;
}

.user-dropdown-item.danger:hover {
  background: #fff1f2;
  color: #be123c;
}

/* ── Natural responsive breakpoints ──────────────────────── */
@media (max-width: 900px) {
  .topbar {
    height: auto;
    flex-wrap: wrap;
    padding: 12px 16px;
  }
  .topbar-nav {
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }
}

/* ── Mobile view (driven by html.mobile-view from useMobileView) ── */
:global(html.mobile-view) .topbar {
  height: auto;
  flex-wrap: wrap;
  padding: 10px 14px;
  gap: 10px;
}

:global(html.mobile-view) .topbar-left {
  flex: 1;
  min-width: 0;
}

:global(html.mobile-view) .brand-text {
  font-size: 15px;
}
:global(html.mobile-view) .brand-kicker {
  font-size: 9px;
}
:global(html.mobile-view) .brand-logo {
  width: 32px;
  height: 32px;
}

:global(html.mobile-view) .mobile-nav-toggle {
  display: flex;
  order: 2;
}

:global(html.mobile-view) .topbar-nav {
  order: 4;
  width: 100%;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.28s ease;
}

:global(html.mobile-view) .topbar-nav.mobile-open {
  max-height: 260px;
}

:global(html.mobile-view) .nav-item {
  padding: 11px 14px;
  border-radius: 8px;
  font-size: 13px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
}

:global(html.mobile-view) .user-menu {
  order: 3;
}
:global(html.mobile-view) .user-id {
  display: none;
}
:global(html.mobile-view) .user-name {
  font-size: 11px;
}
:global(html.mobile-view) .user-avatar {
  width: 26px;
  height: 26px;
  font-size: 11px;
  flex: 0 0 26px;
}
:global(html.mobile-view) .user-caret {
  display: none;
}
</style>
