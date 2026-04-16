<template>
  <div class="page">
    <header class="topbar">
      <div class="topbar-left">
        <img class="brand-logo" :src="logo" alt="LTO Logo" />
        <span class="brand-text">LTMS PORTAL</span>
      </div>

      <nav class="topbar-nav">
        <a href="#" class="nav-item">HOME</a>
        <a href="#" class="nav-item">OFFICIAL WEBSITE</a>
        <a href="#" class="nav-item">E-LEARNING</a>
        <a href="#" class="nav-item">CONTACT</a>
        <a href="#" class="nav-item">DASHBOARD</a>
      </nav>

      <div class="user-dropdown" @click="toggleMenu">
        <div class="user-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="8"
              r="3.5"
              stroke="currentColor"
              stroke-width="1.9"
            />
            <path
              d="M5 19c0-3.2 3.2-5.2 7-5.2s7 2 7 5.2"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
            />
          </svg>
        </div>

        <span class="user-id">ID: 26-050525-2424960</span>
        <span class="dropdown-arrow" :class="{ open: open }">▾</span>

        <div v-if="open" class="dropdown-menu" @click.stop>
          <button type="button">Profile</button>
          <button type="button">Settings</button>
          <button type="button">Logout</button>
        </div>
      </div>
    </header>

    <main class="hero">
      <div class="hero-overlay"></div>

      <div class="seal-watermark">
        <img :src="logo" alt="LTO Watermark" />
      </div>

      <section class="licensing-modal">
        <div class="modal-header">
          <h1>
            Land Transportation Office | Application
            <br />
            for Driver's License Classification
          </h1>

          <p class="client-id">Client Profile | ID: 26-050525-2424960</p>
          <p class="instruction">Select your desired license to continue:</p>
        </div>

        <div class="license-list">
          <button
            class="license-option"
            :class="{ selected: selectedLicense === 'student' }"
            @click="selectedLicense = 'student'"
          >
            <span class="radio-dot">
              <span
                v-if="selectedLicense === 'student'"
                class="radio-fill"
              ></span>
            </span>

            <div class="option-icon option-icon-student">
              <svg viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="19" cy="40" r="5" />
                <circle cx="47" cy="40" r="5" />
                <path
                  d="M15 39l4-13h16l5 6h7c2.5 0 4 1.8 4 4v3"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M28 26v-7l8-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                />
              </svg>
            </div>

            <div class="option-copy">
              <strong>STUDENT-DRIVER'S PERMIT</strong>
              <span>Apply for a learn-to-drive permit.</span>
            </div>
          </button>

          <button
            class="license-option"
            :class="{ selected: selectedLicense === 'driver' }"
            @click="selectedLicense = 'driver'"
          >
            <span class="radio-dot">
              <span
                v-if="selectedLicense === 'driver'"
                class="radio-fill"
              ></span>
            </span>

            <div class="option-icon option-icon-driver">
              <svg viewBox="0 0 64 64" aria-hidden="true">
                <circle
                  cx="32"
                  cy="32"
                  r="18"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                />
                <circle cx="32" cy="32" r="4" />
                <path
                  d="M32 14v9M32 41v9M14 32h9M41 32h9M20 20l6 6M38 38l6 6M44 20l-6 6M26 38l-6 6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                />
              </svg>
            </div>

            <div class="option-copy">
              <strong>DRIVER'S LICENSE</strong>
              <span>Apply for a full, renewal, or new license.</span>
            </div>
          </button>

          <button
            class="license-option"
            :class="{ selected: selectedLicense === 'conductor' }"
            @click="selectedLicense = 'conductor'"
          >
            <span class="radio-dot">
              <span
                v-if="selectedLicense === 'conductor'"
                class="radio-fill"
              ></span>
            </span>

            <div class="option-icon option-icon-conductor">
              <svg viewBox="0 0 64 64" aria-hidden="true">
                <path
                  d="M16 36c0-10 7-18 16-18s16 8 16 18"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                />
                <path
                  d="M18 36h28c4 0 7 3 7 7 0 2-1 4-3 5-6 3-31 3-37 0-2-1-3-3-3-5 0-4 3-7 8-7z"
                  fill="currentColor"
                  opacity=".95"
                />
                <rect x="23" y="14" width="18" height="6" rx="2" />
                <path
                  d="M24 24c2 2 5 3 8 3s6-1 8-3"
                  fill="none"
                  stroke="#ffffff"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </div>

            <div class="option-copy">
              <strong>CONDUCTOR'S LICENSE</strong>
              <span>Apply for a public transport operator license.</span>
            </div>
          </button>

          <label class="upload-option">
            <div class="upload-left">
              <div class="upload-icon">
                <svg viewBox="0 0 64 64" aria-hidden="true">
                  <path
                    d="M22 10h15l9 9v35H22z"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M37 10v9h9"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M32 44V28M26 34l6-6 6 6"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>

              <div class="option-copy upload-copy">
                <strong>
                  ADD FILE |
                  <span>[Drop File or Click to Upload]</span>
                </strong>
                <span>Add Medical Certificate (Optional for this step)</span>
              </div>
            </div>

            <input type="file" class="file-input" />
          </label>
        </div>

        <div class="modal-actions">
          <button class="btn-cancel">Cancel &amp; Exit</button>
          <button class="btn-proceed">PROCEED ›</button>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-left">Release 2.5.4</div>
      <div class="footer-center">
        <img class="footer-logo" :src="logo" alt="LTO Logo" />
        <span>MANAGEMENT INFORMATION DIVISION (MID)</span>
      </div>
      <div class="footer-right">✦</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import logo from "../assets/logo.png";

const selectedLicense = ref("driver");
const open = ref(false);

const toggleMenu = () => {
  open.value = !open.value;
};

const closeMenu = (event: MouseEvent) => {
  const target = event.target as HTMLElement | null;
  if (!target?.closest(".user-dropdown")) {
    open.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeMenu);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeMenu);
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

:global(html, body, #app) {
  margin: 0;
  min-height: 100%;
  width: 100%;
  font-family: Arial, Helvetica, sans-serif;
}

.page {
  min-height: 100vh;
  background: #edf1f4;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 72px;
  background: linear-gradient(180deg, #0d468f 0%, #0b3d82 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  box-shadow: 0 8px 18px rgba(10, 46, 99, 0.18);
  z-index: 5;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  background: white;
}

.brand-text {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 0.3px;
}

.topbar-nav {
  display: flex;
  gap: 18px;
  align-items: center;
}

.nav-item {
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
}

.user-dropdown {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  cursor: pointer;
  user-select: none;
  min-width: 210px;
  justify-content: flex-end;
}

.user-icon {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  opacity: 0.95;
  flex: 0 0 30px;
}

.user-icon svg {
  width: 100%;
  height: 100%;
  display: block;
}

.user-id {
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.dropdown-arrow {
  font-size: 12px;
  line-height: 1;
  transition: transform 0.18s ease;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 150px;
  background: #ffffff;
  color: #1f2937;
  border-radius: 10px;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.18);
  overflow: hidden;
  z-index: 20;
  border: 1px solid rgba(17, 24, 39, 0.08);
}

.dropdown-menu button {
  width: 100%;
  padding: 11px 12px;
  border: none;
  background: none;
  text-align: left;
  font-size: 13px;
  color: #1f2937;
  cursor: pointer;
}

.dropdown-menu button:hover {
  background: #f3f6fb;
}

.hero {
  flex: 1;
  position: relative;
  background:
    linear-gradient(rgba(244, 246, 249, 0.52), rgba(244, 246, 249, 0.62)),
    url("../assets/BGC.jpg") center/cover no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 38px 24px 28px;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.04) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
  pointer-events: none;
}

.seal-watermark {
  position: absolute;
  left: 30px;
  top: 34px;
  width: 300px;
  opacity: 0.12;
  pointer-events: none;
}

.seal-watermark img {
  width: 100%;
  display: block;
  filter: grayscale(100%);
}

.licensing-modal {
  position: relative;
  z-index: 2;

  width: 95%; /* take almost full screen */
  max-width: 1200px; /* clean max width like real systems */

  background: linear-gradient(180deg, #fdfdfd 0%, #f3f3f3 100%);
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: 18px;

  box-shadow:
    0 18px 42px rgba(0, 0, 0, 0.24),
    0 3px 8px rgba(0, 0, 0, 0.12);

  padding: 26px 32px 24px; /* more breathing space */
}

.modal-header h1 {
  margin: 0;
  font-size: 24px;
  line-height: 1.16;
  font-weight: 800;
  color: #262626;
}

.client-id {
  margin: 12px 0 0;
  font-size: 14px;
  color: #4b4b4b;
  font-weight: 600;
}

.instruction {
  margin: 16px 0 14px;
  font-size: 16px;
  color: #404040;
}

.license-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.license-option {
  width: 100%;
  border: 1px solid #d3d6da;
  border-radius: 10px;
  background: linear-gradient(180deg, #f3f3f3 0%, #ececec 100%);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.license-option:hover {
  border-color: #98bfe0;
}

.license-option.selected {
  border-color: #6fb3e8;
  background: linear-gradient(180deg, #eef8ff 0%, #e6f4ff 100%);
  box-shadow:
    0 0 0 2px rgba(76, 163, 226, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.radio-dot {
  width: 18px;
  height: 18px;
  border: 2px solid #a1a7af;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex: 0 0 18px;
  background: #fff;
}

.selected .radio-dot {
  border-color: #49a8e7;
}

.radio-fill {
  width: 8px;
  height: 8px;
  background: #49a8e7;
  border-radius: 50%;
}

.option-icon {
  width: 38px;
  height: 38px;
  color: #51606d;
  flex: 0 0 38px;
}

.option-icon svg {
  width: 100%;
  height: 100%;
  display: block;
}

.option-icon-driver {
  color: #475569;
}

.option-icon-student {
  color: #5d7487;
}

.option-icon-conductor {
  color: #54606f;
}

.option-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.option-copy strong {
  font-size: 15px;
  line-height: 1.15;
  color: #2f2f2f;
}

.option-copy span {
  font-size: 13px;
  color: #555;
  line-height: 1.25;
}

.upload-option {
  border: 1px solid #d3d6da;
  border-radius: 10px;
  background: linear-gradient(180deg, #f5f5f5 0%, #ededed 100%);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
}

.upload-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.upload-icon {
  width: 30px;
  height: 30px;
  color: #6b7280;
  flex: 0 0 30px;
}

.upload-icon svg {
  width: 100%;
  height: 100%;
  display: block;
}

.upload-copy strong {
  font-size: 15px;
}

.upload-copy strong span {
  font-weight: 700;
  color: #444;
}

.file-input {
  display: none;
}

.modal-actions {
  margin-top: 18px;
  display: flex;
  justify-content: space-between;
  gap: 14px;
}

.btn-cancel,
.btn-proceed {
  border: none;
  border-radius: 8px;
  height: 40px;
  padding: 0 22px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}

.btn-cancel {
  background: linear-gradient(180deg, #f53f56 0%, #cf1831 100%);
  color: white;
  box-shadow: 0 6px 14px rgba(207, 24, 49, 0.22);
}

.btn-proceed {
  background: linear-gradient(180deg, #2a8ad9 0%, #1f6fbe 100%);
  color: white;
  margin-left: auto;
  box-shadow: 0 6px 14px rgba(31, 111, 190, 0.22);
}

.footer {
  height: 62px;
  background: #0a3779;
  color: #fff;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 20px;
  font-size: 12px;
}

.footer-left {
  justify-self: start;
  font-weight: 600;
}

.footer-center {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}

.footer-logo {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.footer-right {
  justify-self: end;
  font-size: 22px;
}

@media (max-width: 1000px) {
  .topbar {
    height: auto;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
  }

  .topbar-nav {
    flex-wrap: wrap;
    justify-content: center;
  }

  .user-dropdown {
    min-width: auto;
  }
}

@media (max-width: 760px) {
  .seal-watermark {
    width: 220px;
    left: 10px;
    top: 70px;
  }

  .licensing-modal {
    width: min(96%, 760px);
    padding: 18px 16px;
  }

  .modal-header h1 {
    font-size: 20px;
  }

  .instruction {
    font-size: 14px;
  }

  .option-copy strong,
  .upload-copy strong {
    font-size: 14px;
  }

  .option-copy span {
    font-size: 12px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-proceed {
    width: 100%;
    margin-left: 0;
  }
}

@media (max-width: 640px) {
  .brand-text {
    font-size: 20px;
  }

  .user-id {
    font-size: 11px;
  }

  .footer {
    grid-template-columns: 1fr;
    height: auto;
    gap: 6px;
    padding: 12px;
    text-align: center;
  }

  .footer-left,
  .footer-center,
  .footer-right {
    justify-self: center;
  }
}
</style>
