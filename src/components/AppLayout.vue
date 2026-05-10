<template>
  <!--
    AppLayout.vue
    ─────────────
    Drop this around your page content and you get:
      • Consistent topbar (with nav, user menu, hamburger)
      • Consistent footer
      • Page-loading overlay
      • Logout confirmation modal
      • Settings / accessibility modal

    Usage in any page:
      <AppLayout>
        <main class="hero"> … your page content … </main>
      </AppLayout>
  -->
  <div class="page" :class="{ 'page--loading': isPageLoading }">
    <!-- Page loading overlay -->
    <div
      v-if="isPageLoading"
      class="page-loading-overlay"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="page-loading-card">
        <span class="page-loading-spinner"></span>
        <span class="page-loading-text">Loading page...</span>
      </div>
    </div>

    <!-- Shared topbar -->
    <AppTopbar
      :is-page-loading="isPageLoading"
      @open-settings="showSettingsModal = true"
      @request-logout="showLogoutModal = true"
    />

    <!-- Page content slot -->
    <slot />

    <!-- Shared footer -->
    <AppFooter />

    <!-- ── Settings modal ───────────────────────────────── -->
    <div
      v-if="showSettingsModal"
      class="settings-modal-overlay"
      @click.self="showSettingsModal = false"
    >
      <div
        class="settings-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        <div class="settings-modal-header">
          <div>
            <span class="settings-modal-kicker">Accessibility</span>
            <h3 id="settings-modal-title">Settings</h3>
          </div>
          <button
            type="button"
            class="settings-close-btn"
            @click="showSettingsModal = false"
          >
            ×
          </button>
        </div>

        <div class="settings-modal-body">
          <div class="settings-option-card">
            <div class="settings-option-copy">
              <strong>Dark Mode</strong>
              <span
                >Use a darker colour scheme for better low-light viewing.</span
              >
            </div>
            <label class="switch">
              <input v-model="accessibilitySettings.darkMode" type="checkbox" />
              <span class="slider"></span>
            </label>
          </div>

          <div class="settings-option-card">
            <div class="settings-option-copy">
              <strong>Larger Text</strong>
              <span>Increase text size to improve readability.</span>
            </div>
            <label class="switch">
              <input
                v-model="accessibilitySettings.largeText"
                type="checkbox"
              />
              <span class="slider"></span>
            </label>
          </div>

          <div class="settings-option-card">
            <div class="settings-option-copy">
              <strong>Reduced Motion</strong>
              <span
                >Minimise animations and transitions across the interface.</span
              >
            </div>
            <label class="switch">
              <input
                v-model="accessibilitySettings.reducedMotion"
                type="checkbox"
              />
              <span class="slider"></span>
            </label>
          </div>

          <div class="settings-option-card">
            <div class="settings-option-copy">
              <strong>High Contrast</strong>
              <span
                >Increase contrast to improve visibility of interface
                elements.</span
              >
            </div>
            <label class="switch">
              <input
                v-model="accessibilitySettings.highContrast"
                type="checkbox"
              />
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="settings-modal-actions">
          <button
            type="button"
            class="settings-done-btn"
            @click="showSettingsModal = false"
          >
            Done
          </button>
        </div>
      </div>
    </div>

    <!-- ── Logout modal ──────────────────────────────────── -->
    <div
      v-if="showLogoutModal"
      class="logout-modal-overlay"
      @click.self="showLogoutModal = false"
    >
      <div class="logout-modal-card">
        <div class="logout-modal-icon-wrap">
          <div class="logout-modal-icon">↗</div>
        </div>
        <div class="logout-modal-copy">
          <span class="logout-modal-kicker">Confirm action</span>
          <h3>Log out of LTMS Portal?</h3>
          <p>
            You are about to end your current session and return to the landing
            page.
          </p>
        </div>
        <div class="logout-modal-actions">
          <button
            type="button"
            class="logout-cancel-btn"
            :disabled="isPageLoading"
            @click="showLogoutModal = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="logout-confirm-btn"
            :disabled="isPageLoading"
            @click="logoutUser()"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import AppTopbar from "@/components/AppTopbar.vue";
import AppFooter from "@/components/AppFooter.vue";

const router = useRouter();
const accessibilitySettings = reactive({
  darkMode: false,
  largeText: false,
  reducedMotion: false,
  highContrast: false,
});

const isPageLoading = ref(false);
const showSettingsModal = ref(false);
const showLogoutModal = ref(false);

async function logoutUser() {
  showLogoutModal.value = false;
  isPageLoading.value = true;
  try {
    localStorage.clear();
    sessionStorage.clear();
    await router.push("/");
  } catch {
    isPageLoading.value = false;
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.page {
  min-height: 100vh;
  background: #edf1f4;
  display: flex;
  flex-direction: column;
}

/* Page loading overlay */
.page-loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 120px;
  background: rgba(237, 241, 244, 0.56);
  backdrop-filter: blur(4px);
}

.page-loading-card {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 0 20px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #d9e6f7;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
}

.page-loading-spinner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #cfe0fb;
  border-top-color: #1f5fb7;
  animation: spin 0.85s linear infinite;
}

.page-loading-text {
  color: #154b96;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.01em;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Settings modal ────────────────────────────────────────── */
.settings-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1350;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.42);
  backdrop-filter: blur(8px);
}

.settings-modal-card {
  width: min(560px, 100%);
  border-radius: 24px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dbe5f3;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.18);
  overflow: hidden;
}

.settings-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e5edf7;
}

.settings-modal-kicker {
  display: inline-block;
  margin-bottom: 8px;
  color: #1f5fb7;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.settings-modal-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 28px;
  line-height: 1.1;
}

.settings-close-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #d8e2ef;
  border-radius: 50%;
  background: #ffffff;
  color: #154b96;
  font-size: 22px;
  cursor: pointer;
}

.settings-modal-body {
  padding: 20px 24px;
  display: grid;
  gap: 14px;
}

.settings-option-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border: 1px solid #e4ebf5;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
}

.settings-option-copy {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.settings-option-copy strong {
  color: #1f2937;
  font-size: 16px;
}
.settings-option-copy span {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  max-width: 360px;
}

.settings-modal-actions {
  padding: 0 24px 24px;
}

.settings-done-btn {
  width: 100%;
  min-height: 46px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(180deg, #1f5fb7 0%, #154b96 100%);
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 12px 22px rgba(21, 75, 150, 0.16);
}

/* Toggle switch */
.switch {
  position: relative;
  width: 56px;
  height: 32px;
  flex: 0 0 56px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}
.slider {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: #d7e3f5;
  cursor: pointer;
  transition: 0.25s ease;
}
.slider::before {
  content: "";
  position: absolute;
  width: 24px;
  height: 24px;
  left: 4px;
  top: 4px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.16);
  transition: 0.25s ease;
}
.switch input:checked + .slider {
  background: linear-gradient(180deg, #1f5fb7 0%, #154b96 100%);
}
.switch input:checked + .slider::before {
  transform: translateX(24px);
}

/* ── Logout modal ──────────────────────────────────────────── */
.logout-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.42);
  backdrop-filter: blur(6px);
}

.logout-modal-card {
  width: min(420px, 100%);
  border-radius: 24px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dbe5f3;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.18);
  padding: 24px;
  text-align: center;
}

.logout-modal-icon-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 14px;
}

.logout-modal-icon {
  width: 58px;
  height: 58px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, #eef4ff 0%, #dfeaff 100%);
  color: #154b96;
  font-size: 26px;
  font-weight: 800;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 10px 20px rgba(21, 75, 150, 0.12);
}

.logout-modal-kicker {
  display: inline-block;
  margin-bottom: 8px;
  color: #1f5fb7;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.logout-modal-copy h3 {
  margin: 0 0 10px;
  color: #1f2937;
  font-size: 24px;
  line-height: 1.15;
}
.logout-modal-copy p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.7;
}

.logout-modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 22px;
}

.logout-cancel-btn,
.logout-confirm-btn {
  flex: 1;
  min-height: 46px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.18s ease;
}

.logout-cancel-btn {
  border: 1px solid #d8e2ef;
  background: #ffffff;
  color: #154b96;
}
.logout-confirm-btn {
  border: none;
  background: linear-gradient(180deg, #d92d20 0%, #b42318 100%);
  color: #fff;
  box-shadow: 0 12px 22px rgba(180, 35, 24, 0.18);
}
.logout-cancel-btn:hover,
.logout-confirm-btn:hover {
  transform: translateY(-1px);
}

button:disabled {
  cursor: wait;
  opacity: 0.72;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .logout-modal-actions {
    flex-direction: column;
  }
  .settings-option-card {
    align-items: flex-start;
    flex-direction: column;
  }
  .switch {
    align-self: flex-end;
  }
}
</style>
