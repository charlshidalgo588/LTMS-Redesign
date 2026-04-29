<template>
  <div class="page">
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

    <header class="topbar">
      <div class="topbar-left">
        <button class="brand-wrap" type="button" @click="goToDashboard">
          <img class="brand-logo" :src="logo" alt="LTO Logo" />
          <div class="brand-copy">
            <span class="brand-kicker">LTMS PORTAL</span>
            <span class="brand-text">LICENSING</span>
          </div>
        </button>
      </div>

      <nav class="topbar-nav">
        <a href="#" class="nav-item" @click.prevent="openOfficialWebsite">
          LTO OFFICIAL WEBPAGE
        </a>

        <a href="#" class="nav-item" @click.prevent="goToELearning">
          E-LEARNING
        </a>

        <a href="#" class="nav-item" @click.prevent="goToContact"> CONTACT </a>

        <div ref="dashboardMenuRef" class="dashboard-menu">
          <button
            type="button"
            class="nav-item dashboard-active dashboard-trigger"
            :class="{ active: isDashboardSectionActive }"
            @click="toggleDashboardMenu"
          >
            DASHBOARD
            <svg class="dashboard-caret" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <div v-if="showDashboardMenu" class="mega-dropdown">
            <div class="mega-dropdown-head">
              <div>
                <span class="mega-kicker">LTMS Services</span>
                <h3>Dashboard Navigation</h3>
                <p>Select a service area to continue your transaction.</p>
              </div>
            </div>

            <div class="mega-grid">
              <button
                v-for="item in dashboardMenuItems"
                :key="item.title"
                type="button"
                class="mega-item"
                :class="{ active: isRouteActive(item.route) }"
                @click="goToDashboardItem(item.route)"
              >
                <span class="mega-icon" v-html="item.icon"></span>

                <span class="mega-copy">
                  <strong>{{ item.title }}</strong>
                  <small v-html="item.description"></small>
                </span>

                <span class="mega-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
            </div>

            <div class="mega-footer">
              <span>Active module: {{ currentSectionLabel }}</span>
              <button type="button" @click="goToDashboard">
                Return to main dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div ref="userMenuRef" class="user-menu">
        <button class="user-menu-trigger" type="button" @click="toggleUserMenu">
          <div class="user-avatar">H</div>
          <div class="user-info">
            <span class="user-name">HIDALGO</span>
            <span class="user-id">{{ clientId }}</span>
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
          <button type="button" class="user-dropdown-item" @click="goToProfile">
            Profile
          </button>

          <button
            type="button"
            class="user-dropdown-item"
            @click="openSettingsModal"
          >
            Settings
          </button>

          <button
            type="button"
            class="user-dropdown-item danger"
            @click="requestLogout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="hero">
      <div class="hero-overlay"></div>

      <div class="seal-watermark">
        <img :src="logo" alt="LTO Watermark" />
      </div>

      <nav class="breadcrumb-bar" aria-label="Breadcrumb">
        <button
          v-for="(item, index) in breadcrumbItems"
          :key="`${item.label}-${index}`"
          type="button"
          class="breadcrumb-item"
          :class="{ current: index === breadcrumbItems.length - 1 }"
          @click="
            index === breadcrumbItems.length - 1
              ? undefined
              : navigateTo(item.route)
          "
        >
          <span v-if="index > 0" class="breadcrumb-separator">/</span>
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <section class="licensing-modal">
        <div class="modal-top-strip"></div>

        <div class="progress-track" aria-label="Application progress">
          <div
            v-for="step in steps"
            :key="step.number"
            class="progress-step"
            :class="{
              active: currentStep === step.number,
              complete: currentStep > step.number,
            }"
          >
            <span class="progress-number">
              <svg v-if="currentStep > step.number" viewBox="0 0 24 24">
                <path d="M5 12.5l4.2 4.2L19 7" />
              </svg>
              <template v-else
                >{{ step.number }}
                <div
                  v-if="showLogoutModal"
                  class="logout-modal-overlay"
                  @click.self="cancelLogout"
                >
                  <div class="logout-modal-card">
                    <div class="logout-modal-icon-wrap">
                      <div class="logout-modal-icon">↗</div>
                    </div>

                    <div class="logout-modal-copy">
                      <span class="logout-modal-kicker">Confirm action</span>
                      <h3>Log out of LTMS Portal?</h3>
                      <p>
                        You are about to end your current session and return to
                        the landing page.
                      </p>
                    </div>

                    <div class="logout-modal-actions">
                      <button
                        type="button"
                        class="logout-cancel-btn"
                        :disabled="isPageLoading"
                        @click="cancelLogout"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        class="logout-confirm-btn"
                        :disabled="isPageLoading"
                        @click="logoutUser"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  v-if="showSettingsModal"
                  class="settings-modal-overlay"
                  @click.self="closeSettingsModal"
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
                        :disabled="isPageLoading"
                        @click="closeSettingsModal"
                      >
                        ×
                      </button>
                    </div>

                    <div class="settings-modal-body">
                      <div class="settings-option-card">
                        <div class="settings-option-copy">
                          <strong>Dark Mode</strong>
                          <span
                            >Use a darker color scheme for better low-light
                            viewing.</span
                          >
                        </div>

                        <label class="switch">
                          <input
                            v-model="accessibilitySettings.darkMode"
                            type="checkbox"
                          />
                          <span class="slider"></span>
                        </label>
                      </div>

                      <div class="settings-option-card">
                        <div class="settings-option-copy">
                          <strong>Larger Text</strong>
                          <span
                            >Increase text size to improve readability.</span
                          >
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
                            >Minimize animations and transitions across the
                            interface.</span
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
                          <span>
                            Increase contrast to improve visibility of interface
                            elements.
                          </span>
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
                        @click="closeSettingsModal"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </span>
            <span>{{ step.label }}</span>
          </div>
        </div>

        <!-- STEP 1 -->
        <template v-if="currentStep === 1">
          <div class="modal-hero">
            <div>
              <div class="agency-kicker">
                <span class="kicker-dot"></span>
                Driver Licensing Services
              </div>

              <h1>Application for Driver's License Classification</h1>

              <p class="client-id">
                Client Profile <span>|</span> ID: {{ clientId }}
              </p>

              <p class="instruction">
                Choose the license classification that matches your transaction.
              </p>
            </div>

            <div class="step-card">
              <span>Step 1 of 4</span>
              <strong>Select Classification</strong>
            </div>
          </div>

          <div class="license-list">
            <button
              v-for="license in licenseOptions"
              :key="license.value"
              class="license-option"
              :class="{ selected: selectedLicense === license.value }"
              @click="selectedLicense = license.value"
              type="button"
            >
              <span class="selection-indicator" aria-hidden="true">
                <span v-if="selectedLicense === license.value"></span>
              </span>

              <div
                class="premium-icon"
                aria-hidden="true"
                v-html="license.icon"
              ></div>

              <div class="option-copy">
                <div class="option-title-row">
                  <strong>{{ license.title }}</strong>
                  <span
                    class="option-chip"
                    :class="{ recommended: license.recommended }"
                  >
                    {{ license.chip }}
                  </span>
                </div>
                <span>{{ license.description }}</span>
              </div>

              <span class="option-chevron" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </span>
            </button>

            <label class="upload-option">
              <div class="upload-left">
                <div class="upload-icon premium-soft-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M8 3.75h6.25L19.25 8.75V19A1.75 1.75 0 0 1 17.5 20.75H8A2.75 2.75 0 0 1 5.25 18V6.5A2.75 2.75 0 0 1 8 3.75Z"
                    />
                    <path d="M14.25 3.75v5h5" />
                    <path d="M12 16.25v-5" />
                    <path d="M9.75 13.5L12 11.25l2.25 2.25" />
                  </svg>
                </div>

                <div class="option-copy upload-copy">
                  <strong>Upload Medical Certificate</strong>
                  <span
                    >Optional for this step. Click to upload or drag file
                    here.</span
                  >
                </div>
              </div>

              <span class="upload-cta">{{
                medicalFileName || "Choose File"
              }}</span>
              <input
                type="file"
                class="file-input"
                @change="handleFileUpload"
              />
            </label>
          </div>
        </template>

        <!-- STEP 2 -->
        <template v-else-if="currentStep === 2">
          <div class="form-header">
            <div class="form-title">
              <span class="form-title-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M8 3.75h6.25L19.25 8.75V19A1.75 1.75 0 0 1 17.5 20.75H8A2.75 2.75 0 0 1 5.25 18V6.5A2.75 2.75 0 0 1 8 3.75Z"
                  />
                  <path d="M14.25 3.75v5h5" />
                  <path d="M8.75 13h6.5" />
                  <path d="M8.75 16h4.5" />
                </svg>
              </span>
              <div>
                <h1>Online Application Form</h1>
                <p>Please select application type(s) you want to apply for.</p>
              </div>
            </div>

            <div class="step-card compact">
              <span>Step 2 of 4</span>
              <strong>Application Type</strong>
            </div>
          </div>

          <div class="application-form">
            <div class="notice-card">
              Please select application type(s) you want to apply for.
            </div>

            <div class="form-grid">
              <label>Client ID</label>
              <div class="readonly-field">{{ clientId }}</div>

              <label>License Classification</label>
              <div class="readonly-field">{{ licenseLabel }}</div>

              <label>
                Type of Application
                <small>Multiple application is allowed</small>
              </label>

              <div class="application-type-grid">
                <button
                  v-for="type in applicationTypes"
                  :key="type.value"
                  type="button"
                  class="application-type"
                  :class="{
                    selected: selectedApplicationTypes.includes(type.value),
                  }"
                  @click="toggleApplicationType(type.value)"
                >
                  <span class="application-check" aria-hidden="true">
                    <svg
                      v-if="selectedApplicationTypes.includes(type.value)"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12.5l4.2 4.2L19 7" />
                    </svg>
                  </span>

                  <span class="application-type-label">{{ type.label }}</span>
                  <strong>{{ type.description }}</strong>
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- STEP 3 -->
        <template v-else-if="currentStep === 3">
          <div class="form-header">
            <div class="form-title">
              <span class="form-title-icon amber" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M12 3.75l8 3.5v5.8c0 4.65-3.25 7.75-8 9.2-4.75-1.45-8-4.55-8-9.2v-5.8l8-3.5Z"
                  />
                  <path d="M12 8.5v5" />
                  <path d="M12 17h.01" />
                </svg>
              </span>
              <div>
                <h1>Review &amp; Confirmation</h1>
                <p>
                  Verify your details and confirm the declaration before
                  submission.
                </p>
              </div>
            </div>

            <div class="step-card compact">
              <span>Step 3 of 4</span>
              <strong>Confirm Details</strong>
            </div>
          </div>

          <div class="review-panel">
            <div class="review-summary">
              <div class="summary-card">
                <span>Client ID</span>
                <strong>{{ clientId }}</strong>
              </div>

              <div class="summary-card">
                <span>License Classification</span>
                <strong>{{ licenseLabel }}</strong>
              </div>

              <div class="summary-card">
                <span>Application Type(s)</span>
                <strong>{{
                  selectedApplicationLabels || "No application type selected"
                }}</strong>
              </div>

              <div class="summary-card">
                <span>Medical Certificate</span>
                <strong>{{ medicalFileName || "Not uploaded" }}</strong>
              </div>
            </div>

            <div class="confirmation-box">
              <div class="confirmation-icon amber-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M12 3.75l8 3.5v5.8c0 4.65-3.25 7.75-8 9.2-4.75-1.45-8-4.55-8-9.2v-5.8l8-3.5Z"
                  />
                  <path d="M8.7 12.5l2.2 2.2 4.7-5.1" />
                </svg>
              </div>

              <div>
                <h2>Applicant declaration</h2>
                <p>
                  I confirm that the selected license classification and
                  application type(s) are correct. I understand that incorrect
                  information may delay or invalidate this application.
                </p>

                <label class="declaration-check">
                  <input type="checkbox" v-model="isConfirmed" />
                  <span>I have reviewed and confirm the details above.</span>
                </label>
              </div>
            </div>
          </div>
        </template>

        <!-- STEP 4 -->
        <template v-else>
          <div class="success-state">
            <div class="success-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M5 12.5l4.2 4.2L19 7" />
                <path d="M21 12a9 9 0 1 1-3.4-7.05" />
              </svg>
            </div>

            <h1>Application Submitted</h1>
            <p>
              Your online application has been prepared successfully. Please
              keep your reference number and proceed with the next official LTMS
              instructions.
            </p>

            <div class="reference-card">
              <span>Application Reference Number</span>
              <strong>{{ referenceNumber }}</strong>
            </div>

            <div class="success-summary">
              <div>
                <span>Classification</span>
                <strong>{{ licenseLabel }}</strong>
              </div>
              <div>
                <span>Application Type(s)</span>
                <strong>{{ selectedApplicationLabels }}</strong>
              </div>
            </div>
          </div>
        </template>

        <div v-if="validationMessage" class="validation-message">
          {{ validationMessage }}
        </div>

        <div class="modal-actions">
          <button
            v-if="currentStep > 1 && currentStep < 4"
            class="btn-back"
            type="button"
            @click="handleBack"
          >
            Back
          </button>

          <button
            v-if="currentStep < 4"
            class="btn-cancel"
            type="button"
            @click="showCancelConfirm = true"
          >
            Cancel Application
          </button>

          <button
            v-if="currentStep < 4"
            class="btn-proceed"
            type="button"
            @click="handleProceed"
          >
            {{ currentStep === 3 ? "Submit Application" : "Proceed" }}
          </button>

          <button
            v-else
            class="btn-proceed"
            type="button"
            @click="resetApplication"
          >
            Start New Application
          </button>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-left">Release 2.5.4</div>
      <div class="footer-center">
        <img class="footer-logo" :src="logo" alt="LTO Logo" />
        <span>MANAGEMENT INFORMATION DIVISION (MID)</span>
      </div>
      <div class="footer-right">●</div>
    </footer>

    <div v-if="showCancelConfirm || showSubmitConfirm" class="confirm-overlay">
      <div class="confirm-dialog">
        <div
          class="confirm-dialog-icon"
          :class="{ danger: showCancelConfirm, submit: showSubmitConfirm }"
          aria-hidden="true"
        >
          <svg v-if="showCancelConfirm" viewBox="0 0 24 24">
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path
              d="M10.3 4.5h3.4L21 18.25A1.5 1.5 0 0 1 19.65 20.5H4.35A1.5 1.5 0 0 1 3 18.25L10.3 4.5Z"
            />
          </svg>

          <svg v-else viewBox="0 0 24 24">
            <path
              d="M12 3.75l8 3.5v5.8c0 4.65-3.25 7.75-8 9.2-4.75-1.45-8-4.55-8-9.2v-5.8l8-3.5Z"
            />
            <path d="M8.7 12.5l2.2 2.2 4.7-5.1" />
          </svg>
        </div>

        <h2>
          {{
            showCancelConfirm ? "Cancel application?" : "Submit application?"
          }}
        </h2>

        <p>
          {{
            showCancelConfirm
              ? "This will cancel your current application and return you to the dashboard."
              : "Please confirm that all information is correct before submitting this application."
          }}
        </p>

        <div class="confirm-actions">
          <button
            class="btn-dialog-secondary"
            type="button"
            @click="closeConfirmDialogs"
          >
            {{ showCancelConfirm ? "Keep Editing" : "Review Again" }}
          </button>

          <button
            class="btn-dialog-primary"
            :class="{ danger: showCancelConfirm }"
            type="button"
            @click="showCancelConfirm ? confirmCancel() : confirmSubmit()"
          >
            {{ showCancelConfirm ? "Yes, Cancel" : "Confirm Submit" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { useRouter } from "vue-router";
import logo from "../assets/logo.png";
import { useAccessibility } from "../composables/useAccessibility";

const clientId = "26-050525-2424960";

const router = useRouter();
const { settings: accessibilitySettings } = useAccessibility();

const isPageLoading = ref(false);
const showUserMenu = ref(false);
const showDashboardMenu = ref(false);
const showLogoutModal = ref(false);
const showSettingsModal = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);
const dashboardMenuRef = ref<HTMLElement | null>(null);

const currentStep = ref(1);
const selectedLicense = ref("driver");
const selectedApplicationTypes = ref<string[]>([]);
const medicalFileName = ref("");
const validationMessage = ref("");
const isConfirmed = ref(false);
const showCancelConfirm = ref(false);
const showSubmitConfirm = ref(false);

const referenceNumber = computed(() => {
  return `LTMS-${clientId.replaceAll("-", "")}-${new Date().getFullYear()}`;
});

const steps = [
  { number: 1, label: "Classification" },
  { number: 2, label: "Application Type" },
  { number: 3, label: "Confirmation" },
  { number: 4, label: "Submitted" },
];

const dashboardMenuItems = [
  {
    title: "DASHBOARD",
    route: "/home",
    description: "Return to main dashboard<br>overview and services",
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="M3 11l9-7 9 7" />
        <path d="M5.5 10.5v9h13v-9" />
        <path d="M9.5 19.5v-6h5v6" />
      </svg>
    `,
  },
  {
    title: "LICENSING",
    route: "/licensing",
    description: "Apply, renew, manage<br>driver & student licenses",
    icon: `
      <svg viewBox="0 0 24 24">
        <rect x="3.75" y="5.5" width="16.5" height="13" rx="2.4" />
        <path d="M7.5 10h5.5" />
        <path d="M7.5 13h3.7" />
        <circle cx="16" cy="12" r="2.15" />
      </svg>
    `,
  },
  {
    title: "VEHICLE",
    route: "/vehicle",
    description: "Check registrations<br>and manage vehicle records",
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="M5.25 13.5l1.45-4.18A2.75 2.75 0 0 1 9.3 7.5h5.4a2.75 2.75 0 0 1 2.6 1.82l1.45 4.18" />
        <path d="M4.75 13.5h14.5A1.75 1.75 0 0 1 21 15.25v2.25a1.25 1.25 0 0 1-1.25 1.25H4.25A1.25 1.25 0 0 1 3 17.5v-2.25a1.75 1.75 0 0 1 1.75-1.75Z" />
        <circle cx="7.5" cy="15.8" r="1" fill="currentColor" stroke="none" />
        <circle cx="16.5" cy="15.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    `,
  },
  {
    title: "TRANSACTIONS",
    route: "/transactions",
    description: "Track application<br>status and payment history",
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="M7 3.75h10A2.25 2.25 0 0 1 19.25 6v14.25l-2.35-1.4-2.35 1.4-2.35-1.4-2.35 1.4-2.35-1.4-2.35 1.4V6A2.25 2.25 0 0 1 7 3.75Z" />
        <path d="M8.5 8h7" />
        <path d="M8.5 11.5h7" />
        <path d="M8.5 15h4.5" />
      </svg>
    `,
  },
  {
    title: "VIOLATIONS",
    route: "/violations",
    description: "View and settle<br>traffic violations",
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="M12 3.75l8 3.5v5.8c0 4.65-3.25 7.75-8 9.2-4.75-1.45-8-4.55-8-9.2v-5.8l8-3.5Z" />
        <path d="M12 8.5v5" />
        <path d="M12 17h.01" />
      </svg>
    `,
  },
  {
    title: "DOCUMENTS",
    route: "/documents",
    description: "Request official copies<br>and electronic records",
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="M7.5 4.25h7l4 4v11.5H7.5A2.5 2.5 0 0 1 5 17.25V6.75a2.5 2.5 0 0 1 2.5-2.5Z" />
        <path d="M14.5 4.25v4h4" />
        <path d="M8.5 12h7" />
        <path d="M8.5 15.5h5" />
      </svg>
    `,
  },
];

const applicationTypes = [
  {
    value: "new",
    label: "New",
    description: "First-time application",
  },
  {
    value: "renewal",
    label: "Renewal",
    description: "Extend existing validity",
  },
  {
    value: "duplicate",
    label: "Duplicate",
    description: "Replace lost or damaged permit",
  },
  {
    value: "revision",
    label: "Revision of Records",
    description: "Update personal or license records",
  },
];

const licenseOptions = [
  {
    value: "student",
    title: "Student-Driver's Permit",
    chip: "Beginner",
    recommended: false,
    description:
      "For applicants who are learning to drive and need an official permit.",
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="M4.75 6.75A2.25 2.25 0 0 1 7 4.5h10a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 17 19.5H7a2.25 2.25 0 0 1-2.25-2.25V6.75Z" />
        <path d="M8 9h5.25" />
        <path d="M8 12h3.75" />
        <path d="M8 15h2.75" />
        <circle cx="16" cy="12" r="2.25" />
        <path d="M14.4 15.8c.38-.7.92-1.05 1.6-1.05s1.22.35 1.6 1.05" />
      </svg>
    `,
  },
  {
    value: "driver",
    title: "Driver's License",
    chip: "Most Common",
    recommended: true,
    description: "For new, renewal, or full driver's license applications.",
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="M5.25 13.5l1.45-4.18A2.75 2.75 0 0 1 9.3 7.5h5.4a2.75 2.75 0 0 1 2.6 1.82l1.45 4.18" />
        <path d="M4.75 13.5h14.5A1.75 1.75 0 0 1 21 15.25v2.25a1.25 1.25 0 0 1-1.25 1.25H18.5v-1.1a1.15 1.15 0 0 0-1.15-1.15H16.2a1.15 1.15 0 0 0-1.15 1.15v1.1h-6.1v-1.1A1.15 1.15 0 0 0 7.8 16.5H6.65a1.15 1.15 0 0 0-1.15 1.15v1.1H4.25A1.25 1.25 0 0 1 3 17.5v-2.25a1.75 1.75 0 0 1 1.75-1.75Z" />
        <path d="M7.25 13.5h9.5" />
        <circle cx="7.5" cy="15.8" r="1" fill="currentColor" stroke="none" />
        <circle cx="16.5" cy="15.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    `,
  },
  {
    value: "conductor",
    title: "Conductor's License",
    chip: "Public Transport",
    recommended: false,
    description: "For public transport conductor authorization and licensing.",
    icon: `
      <svg viewBox="0 0 24 24">
        <path d="M7 15.5V9.25A3.25 3.25 0 0 1 10.25 6h3.5A3.25 3.25 0 0 1 17 9.25v6.25" />
        <path d="M6.25 15.5h11.5A1.75 1.75 0 0 1 19.5 17.25v1A1.75 1.75 0 0 1 17.75 20H6.25a1.75 1.75 0 0 1-1.75-1.75v-1a1.75 1.75 0 0 1 1.75-1.75Z" />
        <path d="M9 10h6" />
        <path d="M9 13h6" />
        <circle cx="8" cy="18" r="1" fill="currentColor" stroke="none" />
        <circle cx="16" cy="18" r="1" fill="currentColor" stroke="none" />
      </svg>
    `,
  },
];

const licenseLabel = computed(() => {
  if (selectedLicense.value === "student") return "STUDENT-DRIVER'S PERMIT";
  if (selectedLicense.value === "driver") return "DRIVER'S LICENSE";
  return "CONDUCTOR'S LICENSE";
});

const selectedApplicationLabels = computed(() => {
  return selectedApplicationTypes.value
    .map(
      (value) => applicationTypes.find((type) => type.value === value)?.label,
    )
    .filter(Boolean)
    .join(", ");
});

const currentRoutePath = computed(() => router.currentRoute.value.path);

const isRouteActive = (route: string) => currentRoutePath.value === route;

const isDashboardSectionActive = computed(() =>
  [
    "/home",
    "/licensing",
    "/vehicle",
    "/transactions",
    "/violations",
    "/documents",
  ].includes(currentRoutePath.value),
);

const currentSectionLabel = computed(() => {
  const item = dashboardMenuItems.find(
    (menuItem) => menuItem.route === currentRoutePath.value,
  );
  return item?.title || "DASHBOARD";
});

const breadcrumbItems = computed(() => [
  { label: "Dashboard", route: "/home" },
  { label: currentSectionLabel.value, route: currentRoutePath.value },
]);

const toggleApplicationType = (value: string) => {
  validationMessage.value = "";

  if (selectedApplicationTypes.value.includes(value)) {
    selectedApplicationTypes.value = selectedApplicationTypes.value.filter(
      (item) => item !== value,
    );
    return;
  }

  selectedApplicationTypes.value.push(value);
};

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  medicalFileName.value = input.files?.[0]?.name || "";
};

const handleProceed = () => {
  validationMessage.value = "";

  if (currentStep.value === 1) {
    currentStep.value = 2;
    selectedApplicationTypes.value =
      selectedLicense.value === "student" ? ["new"] : [];
    return;
  }

  if (currentStep.value === 2) {
    if (selectedApplicationTypes.value.length === 0) {
      validationMessage.value =
        "Please select at least one application type before proceeding.";
      return;
    }

    currentStep.value = 3;
    return;
  }

  if (currentStep.value === 3) {
    if (!isConfirmed.value) {
      validationMessage.value =
        "Please confirm that you have reviewed the application details.";
      return;
    }

    showSubmitConfirm.value = true;
  }
};

const handleBack = () => {
  validationMessage.value = "";

  if (currentStep.value > 1) {
    currentStep.value -= 1;
  }
};

const closeConfirmDialogs = () => {
  showCancelConfirm.value = false;
  showSubmitConfirm.value = false;
};

const confirmCancel = async () => {
  closeConfirmDialogs();
  resetApplication();
  await navigateTo("/home");
};

const confirmSubmit = () => {
  closeConfirmDialogs();
  currentStep.value = 4;
};

const resetApplication = () => {
  currentStep.value = 1;
  selectedLicense.value = "driver";
  selectedApplicationTypes.value = [];
  medicalFileName.value = "";
  validationMessage.value = "";
  isConfirmed.value = false;
};

const delay = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

const beginPageLoading = async () => {
  if (isPageLoading.value) return false;

  isPageLoading.value = true;
  showUserMenu.value = false;
  showDashboardMenu.value = false;
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  await nextTick();
  await delay(220);
  return true;
};

const endPageLoading = () => {
  isPageLoading.value = false;
};

const navigateTo = async (route: string) => {
  const currentPath = router.currentRoute.value.path;
  const started = await beginPageLoading();
  if (!started) return;

  if (currentPath === route) {
    await delay(280);
    endPageLoading();
    return;
  }

  try {
    await router.push(route);
  } catch {
    endPageLoading();
  }
};

const goToDashboard = () => navigateTo("/home");
const goToELearning = () => navigateTo("/e-learning");
const goToProfile = () => navigateTo("/profile");

const goToContact = async () => {
  const started = await beginPageLoading();
  if (!started) return;
  await delay(280);
  endPageLoading();
};

const openOfficialWebsite = async () => {
  const started = await beginPageLoading();
  if (!started) return;

  await delay(180);
  window.open("https://lto.gov.ph", "_blank", "noopener,noreferrer");
  await delay(160);
  endPageLoading();
};

const goToDashboardItem = (route: string) => {
  navigateTo(route);
};

const toggleDashboardMenu = () => {
  if (isPageLoading.value) return;
  showDashboardMenu.value = !showDashboardMenu.value;
  showUserMenu.value = false;
};

const toggleUserMenu = () => {
  if (isPageLoading.value) return;
  showUserMenu.value = !showUserMenu.value;
  showDashboardMenu.value = false;
};

const closeFloatingMenus = () => {
  showUserMenu.value = false;
  showDashboardMenu.value = false;
};

const closeUserMenu = () => {
  showUserMenu.value = false;
};

const handleDocumentClick = (event: MouseEvent) => {
  const target = event.target as Node | null;
  if (!target) return;

  const clickedUserMenu = userMenuRef.value?.contains(target);
  const clickedDashboardMenu = dashboardMenuRef.value?.contains(target);

  if (!clickedUserMenu && !clickedDashboardMenu) {
    closeFloatingMenus();
  }
};

const openSettingsModal = () => {
  closeFloatingMenus();
  showSettingsModal.value = true;
};

const closeSettingsModal = () => {
  if (isPageLoading.value) return;
  showSettingsModal.value = false;
};

const requestLogout = () => {
  closeFloatingMenus();
  showLogoutModal.value = true;
};

const cancelLogout = () => {
  if (isPageLoading.value) return;
  showLogoutModal.value = false;
};

const logoutUser = async () => {
  showLogoutModal.value = false;

  const started = await beginPageLoading();
  if (!started) return;

  try {
    localStorage.clear();
    sessionStorage.clear();
    await router.push("/");
  } catch {
    endPageLoading();
  }
};

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocumentClick);
});

watch(
  () => router.currentRoute.value.fullPath,
  async () => {
    if (!isPageLoading.value) return;
    await delay(120);
    endPageLoading();
  },
);
</script>

<style scoped>
* {
  box-sizing: border-box;
}

:global(html, body, #app) {
  margin: 0;
  min-height: 100%;
  width: 100%;
  font-family: Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #0f172a;
}

:global(body) {
  background: #eaf0f6;
}

.page {
  min-height: 100vh;
  background: #edf2f7;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 74px;
  background: linear-gradient(180deg, #0d468f 0%, #0a3874 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px;
  box-shadow: 0 10px 24px rgba(7, 32, 67, 0.2);
  z-index: 5;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.28);
}

.brand-text {
  font-size: 25px;
  font-weight: 800;
  letter-spacing: 0.4px;
}

.topbar-nav {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-item {
  color: rgba(255, 255, 255, 0.94);
  text-decoration: none;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.6px;
  transition: opacity 0.18s ease;
}

.nav-item:hover {
  opacity: 0.82;
}

.user-id {
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: 0.2px;
}

.hero {
  flex: 1;
  position: relative;
  background:
    linear-gradient(rgba(244, 247, 251, 0.76), rgba(244, 247, 251, 0.88)),
    url("../assets/BGC.jpg") center/cover no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 42px 24px 30px;
  overflow-x: hidden;
  overflow-y: auto;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at top right,
      rgba(29, 78, 216, 0.13),
      transparent 34%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(15, 61, 135, 0.1),
      transparent 38%
    );
  pointer-events: none;
}

.seal-watermark {
  position: absolute;
  left: 34px;
  top: 34px;
  width: 320px;
  opacity: 0.055;
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
  width: 95%;
  max-width: 1120px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  border: 1px solid rgba(148, 163, 184, 0.42);
  border-radius: 24px;
  box-shadow:
    0 28px 70px rgba(15, 23, 42, 0.18),
    0 10px 24px rgba(15, 23, 42, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  padding: 0 34px 26px;
  overflow: hidden;
}

.modal-top-strip {
  height: 7px;
  margin: 0 -34px;
  background: linear-gradient(90deg, #0a3779 0%, #1d4ed8 52%, #93c5fd 100%);
}

.progress-track {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 22px 0 0;
}

.progress-step {
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 42px;
  padding: 9px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  color: #64748b;
  background: #f8fafc;
  font-size: 12px;
  font-weight: 850;
  text-transform: uppercase;
  letter-spacing: 0.35px;
}

.progress-step.active {
  color: #0f3d87;
  border-color: #bfdbfe;
  background: linear-gradient(180deg, #eff6ff 0%, #ffffff 100%);
}

.progress-step.complete {
  color: #047857;
  border-color: #bbf7d0;
  background: #ecfdf5;
}

.progress-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #e2e8f0;
  color: #334155;
  font-size: 12px;
  font-weight: 900;
}

.progress-step.active .progress-number {
  color: #ffffff;
  background: #1d4ed8;
}

.progress-step.complete .progress-number {
  color: #ffffff;
  background: #047857;
}

.progress-number svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.modal-hero {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 28px;
  align-items: start;
  padding: 28px 0 22px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.95);
}

.agency-kicker {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 7px 12px;
  border-radius: 999px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #0f3d87;
  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0.48px;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.kicker-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1d4ed8;
  box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.12);
}

.modal-hero h1 {
  margin: 0;
  max-width: 760px;
  font-size: 29px;
  line-height: 1.16;
  font-weight: 900;
  letter-spacing: -0.55px;
  color: #0b1220;
}

.client-id {
  margin: 14px 0 0;
  font-size: 14px;
  color: #334155;
  font-weight: 750;
}

.client-id span {
  color: #94a3b8;
  margin: 0 7px;
}

.instruction {
  margin: 11px 0 0;
  font-size: 15px;
  color: #64748b;
  font-weight: 500;
}

.step-card {
  min-width: 210px;
  border: 1px solid #dbeafe;
  background: linear-gradient(180deg, #f8fbff 0%, #eff6ff 100%);
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
}

.step-card.compact {
  min-width: 190px;
}

.step-card span {
  display: block;
  color: #2563eb;
  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0.45px;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.step-card strong {
  display: block;
  color: #0f172a;
  font-size: 15px;
  line-height: 1.25;
}

.license-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 20px;
}

.license-option {
  position: relative;
  width: 100%;
  border: 1px solid #dbe3ee;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.license-option::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 5px;
  background: transparent;
  transition: background 0.2s ease;
}

.license-option:hover {
  transform: translateY(-1px);
  border-color: #93c5fd;
  background: #ffffff;
  box-shadow:
    0 14px 26px rgba(15, 23, 42, 0.07),
    0 4px 10px rgba(37, 99, 235, 0.06);
}

.license-option.selected {
  border-color: #1d4ed8;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow:
    0 18px 34px rgba(29, 78, 216, 0.12),
    0 0 0 4px rgba(29, 78, 216, 0.08);
}

.license-option.selected::before {
  background: linear-gradient(180deg, #1d4ed8, #0f3d87);
}

.selection-indicator {
  width: 22px;
  height: 22px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex: 0 0 22px;
  background: #ffffff;
  transition: border-color 0.2s ease;
}

.selection-indicator span {
  width: 10px;
  height: 10px;
  background: #1d4ed8;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.12);
}

.license-option.selected .selection-indicator {
  border-color: #1d4ed8;
}

.premium-icon,
.premium-soft-icon {
  width: 58px;
  height: 58px;
  flex: 0 0 58px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: #0f3d87;
  background: linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bfdbfe;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 10px 20px rgba(37, 99, 235, 0.09);
}

.premium-icon svg,
.upload-icon svg,
.option-chevron svg,
.form-title-icon svg,
.application-check svg,
.confirmation-icon svg,
.success-icon svg,
.confirm-dialog-icon svg {
  width: 100%;
  height: 100%;
  display: block;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.premium-icon svg {
  width: 30px;
  height: 30px;
}

.license-option.selected .premium-icon {
  color: #ffffff;
  background: linear-gradient(145deg, #1d4ed8 0%, #0f3d87 100%);
  border-color: rgba(255, 255, 255, 0.35);
  box-shadow:
    0 16px 26px rgba(29, 78, 216, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.28);
}

.option-copy {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  flex: 1;
}

.option-title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 9px;
}

.option-copy strong {
  font-size: 16px;
  line-height: 1.15;
  color: #0f172a;
  font-weight: 900;
  letter-spacing: -0.18px;
  text-transform: uppercase;
}

.option-copy span {
  font-size: 13.5px;
  color: #64748b;
  line-height: 1.4;
}

.option-chip {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 4px 9px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
  font-size: 11px !important;
  line-height: 1 !important;
  font-weight: 850;
  text-transform: uppercase;
  letter-spacing: 0.35px;
}

.option-chip.recommended {
  background: #ecfdf5;
  color: #047857;
}

.option-chevron {
  width: 34px;
  height: 34px;
  color: #94a3b8;
  border-radius: 50%;
  display: grid;
  place-items: center;
  margin-left: auto;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.option-chevron svg {
  width: 20px;
  height: 20px;
  stroke-width: 2.2;
}

.license-option:hover .option-chevron,
.license-option.selected .option-chevron {
  color: #1d4ed8;
  background: #eff6ff;
  transform: translateX(2px);
}

.upload-option {
  border: 1px dashed #94a3b8;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  padding: 17px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.upload-option:hover {
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.07);
}

.upload-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.upload-icon {
  width: 54px;
  height: 54px;
  flex: 0 0 54px;
  padding: 12px;
}

.upload-copy strong {
  font-size: 15px;
  color: #0f172a;
}

.upload-cta {
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 0 0 auto;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
  padding: 9px 14px;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.35px;
}

.file-input {
  display: none;
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 26px 0 22px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.95);
}

.form-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.form-title-icon {
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  border-radius: 15px;
  color: #0f3d87;
  background: linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bfdbfe;
  padding: 11px;
}

.form-title-icon.amber {
  color: #92400e;
  background: #fffbeb;
  border-color: #fde68a;
}

.form-title h1 {
  margin: 0;
  font-size: 25px;
  line-height: 1.15;
  font-weight: 900;
  color: #0b1220;
  letter-spacing: -0.35px;
}

.form-title p {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.application-form {
  padding-top: 22px;
}

.notice-card {
  border: 1px solid #bfdbfe;
  background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
  color: #0f3d87;
  border-radius: 14px;
  padding: 15px 18px;
  font-size: 14px;
  font-weight: 750;
  text-align: center;
  margin-bottom: 22px;
}

.form-grid {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 16px 18px;
  align-items: center;
}

.form-grid label {
  color: #0f172a;
  font-size: 14px;
  font-weight: 850;
  text-align: right;
  text-transform: uppercase;
}

.form-grid label small {
  display: block;
  margin-top: 4px;
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
  font-style: italic;
  text-transform: none;
}

.readonly-field {
  min-height: 44px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #f8fafc;
  color: #0f3d87;
  display: flex;
  align-items: center;
  padding: 0 14px;
  font-size: 14px;
  font-weight: 750;
}

.application-type-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.application-type {
  position: relative;
  min-height: 78px;
  border: 1px solid #dbe3ee;
  border-radius: 14px;
  background: #ffffff;
  padding: 14px 16px 14px 52px;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease,
    transform 0.18s ease;
}

.application-type:hover {
  transform: translateY(-1px);
  border-color: #93c5fd;
  box-shadow: 0 10px 22px rgba(37, 99, 235, 0.08);
}

.application-type.selected {
  border-color: #1d4ed8;
  background: linear-gradient(180deg, #ffffff 0%, #eff6ff 100%);
  box-shadow:
    0 0 0 4px rgba(29, 78, 216, 0.08),
    0 12px 24px rgba(29, 78, 216, 0.12);
}

.application-check {
  position: absolute;
  left: 16px;
  top: 18px;
  width: 22px;
  height: 22px;
  border: 2px solid #cbd5e1;
  border-radius: 7px;
  display: grid;
  place-items: center;
  color: #ffffff;
  background: #ffffff;
}

.application-type.selected .application-check {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.application-check svg {
  width: 15px;
  height: 15px;
  stroke-width: 3;
}

.application-type-label {
  display: block;
  color: #0f3d87;
  font-size: 15px;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.application-type strong {
  display: block;
  color: #64748b;
  font-size: 12.5px;
  font-weight: 600;
}

.review-panel {
  padding-top: 22px;
}

.review-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.summary-card {
  border: 1px solid #dbe3ee;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  padding: 18px;
}

.summary-card span {
  display: block;
  color: #64748b;
  font-size: 12px;
  font-weight: 850;
  text-transform: uppercase;
  letter-spacing: 0.35px;
  margin-bottom: 8px;
}

.summary-card strong {
  display: block;
  color: #0f172a;
  font-size: 15px;
  line-height: 1.35;
  font-weight: 900;
}

.confirmation-box {
  margin-top: 16px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
  border: 1px solid #fde68a;
  border-radius: 18px;
  background: linear-gradient(180deg, #fffbeb 0%, #ffffff 100%);
  padding: 18px;
}

.confirmation-icon {
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  border-radius: 15px;
  display: grid;
  place-items: center;
  padding: 11px;
}

.amber-icon {
  background: #f59e0b;
  color: #ffffff;
}

.confirmation-box h2 {
  margin: 0;
  color: #78350f;
  font-size: 17px;
  font-weight: 900;
}

.confirmation-box p {
  margin: 6px 0 0;
  color: #475569;
  font-size: 14px;
  line-height: 1.45;
}

.declaration-check {
  margin-top: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #0f172a;
  font-size: 14px;
  font-weight: 750;
  cursor: pointer;
}

.declaration-check input {
  width: 18px;
  height: 18px;
  accent-color: #1d4ed8;
}

.success-state {
  padding: 42px 0 18px;
  text-align: center;
}

.success-icon {
  width: 86px;
  height: 86px;
  margin: 0 auto 18px;
  border-radius: 28px;
  display: grid;
  place-items: center;
  color: #ffffff;
  background: linear-gradient(145deg, #10b981 0%, #047857 100%);
  box-shadow: 0 20px 34px rgba(4, 120, 87, 0.22);
  padding: 22px;
}

.success-state h1 {
  margin: 0;
  color: #064e3b;
  font-size: 30px;
  font-weight: 950;
  letter-spacing: -0.5px;
}

.success-state p {
  max-width: 680px;
  margin: 12px auto 0;
  color: #475569;
  font-size: 15px;
  line-height: 1.55;
}

.reference-card {
  max-width: 520px;
  margin: 24px auto 0;
  border: 1px solid #bbf7d0;
  background: #ecfdf5;
  border-radius: 18px;
  padding: 18px;
}

.reference-card span,
.success-summary span {
  display: block;
  color: #047857;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 6px;
}

.reference-card strong {
  color: #064e3b;
  font-size: 20px;
  font-weight: 950;
}

.success-summary {
  max-width: 720px;
  margin: 16px auto 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.success-summary div {
  border: 1px solid #dbe3ee;
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
}

.success-summary strong {
  color: #0f172a;
  font-size: 14px;
  font-weight: 900;
}

.validation-message {
  margin-top: 18px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #991b1b;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 13px;
  font-weight: 750;
}

.modal-actions {
  margin-top: 22px;
  display: flex;
  justify-content: space-between;
  gap: 14px;
}

.btn-back,
.btn-cancel,
.btn-proceed {
  border-radius: 12px;
  min-height: 46px;
  padding: 0 26px;
  font-size: 14px;
  font-weight: 850;
  letter-spacing: 0.2px;
  cursor: pointer;
  transition:
    transform 0.16s ease,
    background 0.18s ease,
    box-shadow 0.18s ease,
    opacity 0.18s ease;
}

.btn-back {
  background: #ffffff;
  color: #0f3d87;
  border: 1px solid #bfdbfe;
}

.btn-back:hover {
  background: #eff6ff;
}

.btn-cancel {
  background: #ffffff;
  color: #b42318;
  border: 1px solid #fecaca;
}

.btn-cancel:hover {
  background: #fef2f2;
  border-color: #fca5a5;
}

.btn-proceed {
  border: none;
  background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  margin-left: auto;
  box-shadow: 0 12px 22px rgba(29, 78, 216, 0.24);
}

.btn-proceed:hover {
  background: linear-gradient(180deg, #1d4ed8 0%, #1e40af 100%);
}

.btn-back:hover,
.btn-cancel:hover,
.btn-proceed:hover {
  transform: translateY(-1px);
}

.confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(8px);
}

.confirm-dialog {
  width: min(100%, 460px);
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 24px;
  box-shadow: 0 30px 70px rgba(15, 23, 42, 0.28);
  padding: 26px;
  text-align: center;
}

.confirm-dialog-icon {
  width: 62px;
  height: 62px;
  margin: 0 auto 14px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  padding: 15px;
}

.confirm-dialog-icon.danger {
  color: #b42318;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.confirm-dialog-icon.submit {
  color: #047857;
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
}

.confirm-dialog h2 {
  margin: 0;
  color: #0f172a;
  font-size: 22px;
  font-weight: 950;
}

.confirm-dialog p {
  margin: 10px 0 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  margin-top: 22px;
}

.btn-dialog-secondary,
.btn-dialog-primary {
  flex: 1;
  min-height: 44px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 850;
  cursor: pointer;
}

.btn-dialog-secondary {
  background: #ffffff;
  color: #334155;
  border: 1px solid #cbd5e1;
}

.btn-dialog-primary {
  border: none;
  background: #047857;
  color: #ffffff;
}

.btn-dialog-primary.danger {
  background: #b42318;
}

.footer {
  height: 62px;
  background: #0a3779;
  color: #ffffff;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 20px;
  font-size: 12px;
}

.footer-left {
  justify-self: start;
  font-weight: 700;
}

.footer-center {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.footer-logo {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.footer-right {
  justify-self: end;
  font-size: 18px;
  opacity: 0.75;
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

  .modal-hero,
  .form-header {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: stretch;
  }

  .step-card {
    width: 100%;
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
    padding: 0 18px 18px;
    border-radius: 18px;
  }

  .modal-top-strip {
    margin: 0 -18px;
  }

  .progress-track,
  .review-summary,
  .success-summary {
    grid-template-columns: 1fr;
  }

  .modal-hero h1,
  .form-title h1 {
    font-size: 22px;
  }

  .instruction {
    font-size: 14px;
  }

  .license-option {
    align-items: flex-start;
    padding: 16px;
  }

  .premium-icon {
    width: 50px;
    height: 50px;
    flex-basis: 50px;
    border-radius: 15px;
  }

  .premium-icon svg {
    width: 27px;
    height: 27px;
  }

  .option-copy strong,
  .upload-copy strong {
    font-size: 14px;
  }

  .option-copy span {
    font-size: 12.5px;
  }

  .upload-option {
    align-items: flex-start;
    flex-direction: column;
  }

  .upload-cta {
    width: 100%;
    max-width: none;
    text-align: center;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-grid label {
    text-align: left;
  }

  .application-type-grid {
    grid-template-columns: 1fr;
  }

  .confirmation-box {
    flex-direction: column;
  }

  .modal-actions,
  .confirm-actions {
    flex-direction: column;
  }

  .btn-back,
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

  .selection-indicator {
    display: none;
  }

  .option-chevron {
    display: none;
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

/* HOMEPAGE TOPBAR + SYSTEM CONNECTION OVERRIDES */

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
  animation: dashboardSpin 0.85s linear infinite;
}

.page-loading-text {
  color: #154b96;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.01em;
}

@keyframes dashboardSpin {
  to {
    transform: rotate(360deg);
  }
}

.topbar {
  min-height: 72px;
  height: auto;
  background: linear-gradient(180deg, #0d468f 0%, #0b3d82 100%);
  padding: 0 28px;
  box-shadow: 0 8px 18px rgba(10, 46, 99, 0.18);
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
  color: #ffffff;
}

.brand-logo {
  background: transparent;
  border: none;
  box-shadow: none;
}

.brand-text {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.3px;
  color: #ffffff;
}

.topbar-nav {
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
  background: transparent;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.nav-item:hover {
  opacity: 1;
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

.dashboard-menu {
  position: relative;
}

.dashboard-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.dashboard-caret {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.9;
}

.dashboard-dropdown {
  position: absolute;
  top: calc(100% + 14px);
  right: 0;
  width: 390px;
  padding: 10px;
  border-radius: 22px;
  background: #ffffff;
  border: 1px solid #dbe5f3;
  box-shadow: 0 24px 54px rgba(15, 23, 42, 0.22);
  z-index: 60;
}

.dashboard-dropdown::before {
  content: "";
  position: absolute;
  top: -7px;
  right: 32px;
  width: 14px;
  height: 14px;
  background: #ffffff;
  border-left: 1px solid #dbe5f3;
  border-top: 1px solid #dbe5f3;
  transform: rotate(45deg);
}

.dashboard-dropdown-item {
  width: 100%;
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border: none;
  border-radius: 16px;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.dashboard-dropdown-item:hover {
  background: #f4f8ff;
  transform: translateY(-1px);
}

.dashboard-dropdown-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: #0f3d87;
  background: linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bfdbfe;
}

.dashboard-dropdown-icon svg {
  width: 25px;
  height: 25px;
  display: block;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.dashboard-dropdown-copy {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.dashboard-dropdown-copy strong {
  color: #0f172a;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.04em;
}

.dashboard-dropdown-copy small {
  color: #64748b;
  font-size: 12px;
  line-height: 1.35;
  font-weight: 650;
}

.user-menu {
  position: relative;
  display: flex;
  align-items: center;
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
  color: #ffffff;
  cursor: pointer;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
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
  min-width: 180px;
  padding: 8px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #dbe5f3;
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.16);
  z-index: 60;
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

.logout-modal-overlay,
.settings-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.42);
  backdrop-filter: blur(8px);
}

.logout-modal-card,
.settings-modal-card {
  width: min(560px, 100%);
  border-radius: 24px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dbe5f3;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.18);
}

.logout-modal-card {
  width: min(420px, 100%);
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
}

.logout-modal-kicker,
.settings-modal-kicker {
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

.logout-modal-actions,
.settings-modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 22px;
}

.logout-cancel-btn,
.logout-confirm-btn,
.settings-done-btn {
  flex: 1;
  min-height: 46px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}

.logout-cancel-btn {
  border: 1px solid #d8e2ef;
  background: #ffffff;
  color: #154b96;
}

.logout-confirm-btn {
  border: none;
  background: linear-gradient(180deg, #d92d20 0%, #b42318 100%);
  color: #ffffff;
  box-shadow: 0 12px 22px rgba(180, 35, 24, 0.18);
}

.settings-modal-card {
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
  margin-top: 0;
}

.settings-done-btn {
  width: 100%;
  border: none;
  background: linear-gradient(180deg, #1f5fb7 0%, #154b96 100%);
  color: #ffffff;
  box-shadow: 0 12px 22px rgba(21, 75, 150, 0.16);
}

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

@media (max-width: 900px) {
  .dashboard-dropdown {
    right: 50%;
    transform: translateX(50%);
    width: min(92vw, 390px);
  }

  .user-menu-trigger {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .dashboard-dropdown {
    position: fixed;
    top: 160px;
    left: 12px;
    right: 12px;
    width: auto;
    transform: none;
  }

  .dashboard-dropdown::before {
    display: none;
  }

  .settings-option-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .switch {
    align-self: flex-end;
  }

  .logout-modal-actions {
    flex-direction: column;
  }
}

/* MEGA DROPDOWN + ANIMATED PREMIUM ICONS + BREADCRUMB */

.breadcrumb-bar {
  position: relative;
  z-index: 2;
  width: 95%;
  max-width: 1120px;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 14px;
  padding: 0 4px;
}

.breadcrumb-item {
  border: none;
  background: transparent;
  color: #475569;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 4px;
}

.breadcrumb-item:not(.current):hover {
  color: #0f3d87;
  text-decoration: underline;
}

.breadcrumb-item.current {
  color: #0f3d87;
  cursor: default;
}

.breadcrumb-separator {
  color: #94a3b8;
  font-weight: 900;
}

.dashboard-menu {
  position: relative;
}

.dashboard-trigger.active .dashboard-caret {
  transform: rotate(180deg);
}

.dashboard-caret {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.9;
  transition: transform 0.22s ease;
}

.mega-dropdown {
  position: absolute;
  top: calc(100% + 16px);
  right: 0;
  width: min(760px, 92vw);
  padding: 18px;
  border-radius: 26px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(248, 251, 255, 0.98) 100%
  );
  border: 1px solid rgba(219, 229, 243, 0.95);
  box-shadow:
    0 28px 70px rgba(15, 23, 42, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  z-index: 80;
  backdrop-filter: blur(12px);
}

.mega-dropdown::before {
  content: "";
  position: absolute;
  top: -7px;
  right: 40px;
  width: 14px;
  height: 14px;
  background: #ffffff;
  border-left: 1px solid rgba(219, 229, 243, 0.95);
  border-top: 1px solid rgba(219, 229, 243, 0.95);
  transform: rotate(45deg);
}

.mega-dropdown-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 8px 8px 16px;
  border-bottom: 1px solid #e5edf7;
  margin-bottom: 14px;
}

.mega-kicker {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.mega-dropdown-head h3 {
  margin: 0;
  color: #0f172a;
  font-size: 22px;
  line-height: 1.1;
  font-weight: 950;
  letter-spacing: -0.35px;
}

.mega-dropdown-head p {
  margin: 7px 0 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.45;
}

.mega-home-btn {
  min-height: 46px;
  border: 1px solid #dbeafe;
  border-radius: 999px;
  background: #ffffff;
  color: #0f3d87;
  padding: 0 14px 0 8px;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 10px 22px rgba(29, 78, 216, 0.08);
}

.mega-home-btn:hover,
.mega-home-btn.active {
  background: #eff6ff;
  border-color: #93c5fd;
}

.mega-home-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #ffffff;
  background: linear-gradient(135deg, #475569, #1e293b);
}

.mega-home-icon svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.mega-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.mega-item {
  position: relative;
  min-height: 92px;
  display: grid;
  grid-template-columns: 58px 1fr 28px;
  align-items: center;
  gap: 13px;
  padding: 14px;
  border: 1px solid transparent;
  border-radius: 20px;
  background: transparent;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  transition:
    transform 0.22s ease,
    background 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.mega-item::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: transparent;
  transition: background 0.22s ease;
}

.mega-item:hover,
.mega-item.active {
  background: #f4f8ff;
  border-color: #dbeafe;
  box-shadow: 0 14px 28px rgba(29, 78, 216, 0.1);
  transform: translateY(-2px);
}

.mega-item.active::before {
  background: linear-gradient(180deg, #1d4ed8, #0f3d87);
}

.mega-icon {
  width: 58px;
  height: 58px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  color: #ffffff;
  background: linear-gradient(135deg, #1d4ed8, #0f3d87);
  box-shadow:
    0 14px 26px rgba(29, 78, 216, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.28);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    filter 0.25s ease;
}

.mega-icon svg {
  width: 27px;
  height: 27px;
  display: block;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.85;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.mega-item:first-child .mega-icon {
  background: linear-gradient(135deg, #64748b, #1e293b);
  box-shadow:
    0 14px 26px rgba(51, 65, 85, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.mega-item:hover .mega-icon,
.mega-item.active .mega-icon {
  transform: scale(1.08) rotate(-2deg);
  filter: saturate(1.12);
  box-shadow:
    0 18px 34px rgba(29, 78, 216, 0.42),
    0 0 0 5px rgba(29, 78, 216, 0.12);
  animation: premiumIconPulse 1.4s ease-in-out infinite;
}

.mega-item:first-child:hover .mega-icon,
.mega-item:first-child.active .mega-icon {
  box-shadow:
    0 18px 34px rgba(51, 65, 85, 0.38),
    0 0 0 5px rgba(100, 116, 139, 0.14);
}

@keyframes premiumIconPulse {
  0%,
  100% {
    transform: scale(1.08) rotate(-2deg);
  }
  50% {
    transform: scale(1.13) rotate(-2deg);
  }
}

.mega-copy {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.mega-copy strong {
  color: #0f172a;
  font-size: 13px;
  font-weight: 950;
  letter-spacing: 0.05em;
}

.mega-copy small {
  color: #64748b;
  font-size: 12.5px;
  line-height: 1.35;
  font-weight: 650;
}

.mega-arrow {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #94a3b8;
  background: #f8fafc;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.mega-arrow svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.mega-item:hover .mega-arrow,
.mega-item.active .mega-arrow {
  color: #1d4ed8;
  background: #dbeafe;
  transform: translateX(3px);
}

.mega-footer {
  margin-top: 14px;
  padding: 14px 8px 4px;
  border-top: 1px solid #e5edf7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.mega-footer span {
  color: #475569;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.mega-footer button {
  border: none;
  background: transparent;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
}

.mega-footer button:hover {
  text-decoration: underline;
}

.dashboard-dropdown,
.dashboard-dropdown-item,
.dashboard-dropdown-icon,
.dashboard-dropdown-copy {
  display: none !important;
}

@media (max-width: 900px) {
  .mega-dropdown {
    right: 50%;
    transform: translateX(50%);
    width: min(94vw, 760px);
  }

  .mega-grid {
    grid-template-columns: 1fr;
  }

  .mega-dropdown-head {
    flex-direction: column;
  }

  .mega-home-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .mega-dropdown {
    position: fixed;
    top: 154px;
    left: 12px;
    right: 12px;
    width: auto;
    max-height: calc(100vh - 176px);
    overflow-y: auto;
    transform: none;
  }

  .mega-dropdown::before {
    display: none;
  }

  .mega-item {
    grid-template-columns: 52px 1fr;
  }

  .mega-arrow {
    display: none;
  }

  .mega-icon {
    width: 52px;
    height: 52px;
    border-radius: 18px;
  }

  .mega-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mega-item:hover .mega-icon,
  .mega-item.active .mega-icon {
    animation: none;
  }
}

/* FINAL FIX: PREVENT SIDEWAYS MODAL + FORCE PREMIUM ICON COLORS */

/* The breadcrumb and licensing modal are siblings inside .hero.
   This keeps them vertically stacked instead of side-by-side. */
.hero {
  flex-direction: column !important;
  justify-content: flex-start !important;
  align-items: center !important;
  gap: 0 !important;
  overflow-x: hidden !important;
}

.breadcrumb-bar,
.licensing-modal {
  flex: 0 0 auto !important;
  align-self: center !important;
}

.breadcrumb-bar {
  width: min(95%, 1120px) !important;
}

.licensing-modal {
  width: min(95%, 1120px) !important;
}

/* v-html SVGs do not reliably receive scoped styles unless :deep() is used.
   These rules stop icons from rendering black. */
:deep(.mega-icon svg),
:deep(.dashboard-dropdown-icon svg),
:deep(.premium-icon svg),
:deep(.premium-soft-icon svg),
:deep(.upload-icon svg),
:deep(.form-title-icon svg),
:deep(.confirmation-icon svg),
:deep(.success-icon svg),
:deep(.confirm-dialog-icon svg),
:deep(.mega-home-icon svg) {
  fill: none !important;
  stroke: currentColor !important;
  color: inherit !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
}

:deep(.mega-icon svg circle[fill="currentColor"]),
:deep(.mega-icon svg path[fill="currentColor"]),
:deep(.premium-icon svg circle[fill="currentColor"]),
:deep(.premium-icon svg path[fill="currentColor"]) {
  fill: currentColor !important;
  stroke: none !important;
}

/* Mega menu icons: premium blue/charcoal tiles with white line icons. */
.mega-icon {
  color: #ffffff !important;
  background: linear-gradient(135deg, #2563eb 0%, #0f3d87 100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
}

.mega-item:first-child .mega-icon,
.mega-home-icon {
  color: #ffffff !important;
  background: linear-gradient(135deg, #64748b 0%, #1e293b 100%) !important;
}

/* License and form icons: premium blue by default, white when selected. */
.premium-icon,
.premium-soft-icon,
.upload-icon,
.form-title-icon {
  color: #0f3d87 !important;
  background: linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%) !important;
}

.license-option.selected .premium-icon {
  color: #ffffff !important;
  background: linear-gradient(145deg, #2563eb 0%, #0f3d87 100%) !important;
}

/* Amber and success icons keep their semantic premium colors. */
.form-title-icon.amber {
  color: #92400e !important;
  background: linear-gradient(145deg, #fffbeb 0%, #fde68a 100%) !important;
}

.amber-icon {
  color: #ffffff !important;
  background: linear-gradient(145deg, #f59e0b 0%, #b45309 100%) !important;
}

.success-icon {
  color: #ffffff !important;
  background: linear-gradient(145deg, #10b981 0%, #047857 100%) !important;
}

/* Make the mega dropdown stay inside the viewport instead of pushing layout. */
.mega-dropdown {
  max-width: calc(100vw - 32px) !important;
}

@media (max-width: 900px) {
  .mega-dropdown {
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%) !important;
  }
}

@media (max-width: 640px) {
  .mega-dropdown {
    left: 12px !important;
    right: 12px !important;
    transform: none !important;
  }
}

/* FINAL FIX: HOMEPAGE USER DROPDOWN EXACT OVERRIDE */

.user-menu {
  position: relative;
  display: flex;
  align-items: center;
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
}

.logout-cancel-btn {
  border: 1px solid #d8e2ef;
  background: #ffffff;
  color: #154b96;
}

.logout-confirm-btn {
  flex: 1;
  min-height: 46px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}

.user-menu {
  position: relative !important;
  display: flex !important;
  align-items: center !important;
  justify-content: flex-end !important;
  z-index: 90 !important;
}

.user-menu-trigger {
  display: inline-flex !important;
  align-items: center !important;
  gap: 10px !important;
  min-height: 42px !important;
  padding: 6px 10px !important;
  border: 1px solid rgba(255, 255, 255, 0.14) !important;
  border-radius: 999px !important;
  background: rgba(255, 255, 255, 0.08) !important;
  color: #fff !important;
  cursor: pointer !important;
}

.user-dropdown {
  position: absolute !important;
  top: calc(100% + 10px) !important;
  right: 0 !important;
  min-width: 180px !important;
  padding: 8px !important;
  border-radius: 16px !important;
  background: #ffffff !important;
  border: 1px solid #dbe5f3 !important;
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.16) !important;
  z-index: 1400 !important;
  color: #1f2937 !important;
  display: block !important;
}

.user-dropdown-item {
  width: 100% !important;
  border: none !important;
  background: transparent !important;
  color: #1f2937 !important;
  text-align: left !important;
  border-radius: 10px !important;
  padding: 11px 12px !important;
  font-size: 13px !important;
  font-weight: 700 !important;
  cursor: pointer !important;
}

.user-dropdown-item:hover {
  background: #f4f8ff !important;
  color: #154b96 !important;
}

.user-dropdown-item.danger:hover {
  background: #fff1f2 !important;
  color: #be123c !important;
}

.user-avatar {
  width: 30px !important;
  height: 30px !important;
  border-radius: 50% !important;
  display: grid !important;
  place-items: center !important;
  background: rgba(255, 255, 255, 0.18) !important;
  color: #fff !important;
  font-size: 13px !important;
  font-weight: 800 !important;
  flex: 0 0 30px !important;
}

.user-info {
  display: flex !important;
  flex-direction: column !important;
  align-items: flex-start !important;
  line-height: 1.15 !important;
}

.user-name {
  font-size: 12px !important;
  font-weight: 800 !important;
  letter-spacing: 0.04em !important;
  color: #ffffff !important;
}

.user-id {
  font-size: 11px !important;
  font-weight: 700 !important;
  opacity: 0.84 !important;
  white-space: nowrap !important;
  color: #ffffff !important;
}

.user-caret {
  width: 14px !important;
  height: 14px !important;
  opacity: 0.86 !important;
  color: #ffffff !important;
}

@media (max-width: 900px) {
  .user-menu-trigger {
    width: 100% !important;
    justify-content: center !important;
  }

  .user-dropdown {
    right: 50% !important;
    transform: translateX(50%) !important;
  }
}

@media (max-width: 640px) {
  .user-dropdown {
    position: absolute !important;
    right: 0 !important;
    transform: none !important;
  }
}

/* FINAL FIX: CANCEL TO DASHBOARD + HOMEPAGE SETTINGS/LOGOUT MODALS */

.logout-modal-overlay,
.settings-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.42);
  backdrop-filter: blur(8px);
}

.logout-modal-card,
.settings-modal-card {
  width: min(560px, 100%);
  border-radius: 24px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dbe5f3;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.18);
}

.logout-modal-card {
  width: min(420px, 100%);
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
}

.logout-modal-kicker,
.settings-modal-kicker {
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

.logout-modal-actions,
.settings-modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 22px;
}

.logout-cancel-btn,
.logout-confirm-btn,
.settings-done-btn {
  flex: 1;
  min-height: 46px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}

.logout-cancel-btn {
  border: 1px solid #d8e2ef;
  background: #ffffff;
  color: #154b96;
}

.logout-confirm-btn {
  border: none;
  background: linear-gradient(180deg, #d92d20 0%, #b42318 100%);
  color: #ffffff;
  box-shadow: 0 12px 22px rgba(180, 35, 24, 0.18);
}

.settings-modal-card {
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
  margin-top: 0;
}

.settings-done-btn {
  width: 100%;
  border: none;
  background: linear-gradient(180deg, #1f5fb7 0%, #154b96 100%);
  color: #ffffff;
  box-shadow: 0 12px 22px rgba(21, 75, 150, 0.16);
}

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

@media (max-width: 640px) {
  .logout-modal-actions,
  .settings-modal-actions {
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
