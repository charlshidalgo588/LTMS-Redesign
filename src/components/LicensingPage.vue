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

      <nav class="topbar-nav" aria-label="Primary navigation">
        <a href="#" class="nav-item" @click.prevent="openOfficialWebsite">
          LTO OFFICIAL WEBPAGE
        </a>
        <a href="#" class="nav-item" @click.prevent="goToELearning">
          E-LEARNING
        </a>
        <a href="#" class="nav-item" @click.prevent="goToContact">CONTACT</a>

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
                  <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
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
              <template v-else>{{ step.number }}</template>
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
                Choose one license classification. The next step will only show
                application types that make sense for that classification.
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
              @click="selectLicense(license.value)"
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
                <small class="option-meta">
                  Available application types:
                  {{ license.availableLabels.join(", ") }}
                </small>
              </div>

              <span class="option-chevron" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
              </span>
            </button>
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
                <p>Select one application type for {{ licenseLabel }}.</p>
              </div>
            </div>

            <div class="step-card compact">
              <span>Step 2 of 4</span>
              <strong>Application Type</strong>
            </div>
          </div>

          <div class="application-form">
            <div class="notice-card">
              Only one application type can be selected at a time. Process,
              requirements, estimated fee, and next instructions update based on
              your selection.
            </div>

            <div class="form-grid">
              <label>Client ID</label>
              <div class="readonly-field">{{ clientId }}</div>

              <label>License Classification</label>
              <div class="readonly-field">{{ licenseLabel }}</div>

              <label>
                Type of Application
                <small>Single application only</small>
              </label>

              <div class="application-type-grid">
                <button
                  v-for="type in availableApplicationTypes"
                  :key="type.value"
                  type="button"
                  class="application-type"
                  :class="{ selected: selectedApplicationType === type.value }"
                  @click="selectApplicationType(type.value)"
                >
                  <span class="application-check" aria-hidden="true">
                    <svg
                      v-if="selectedApplicationType === type.value"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12.5l4.2 4.2L19 7" />
                    </svg>
                  </span>
                  <span class="application-type-label">{{ type.label }}</span>
                  <strong>{{ type.description }}</strong>
                  <small>{{ type.hint }}</small>
                </button>
              </div>
            </div>

            <div v-if="selectedProcess" class="dynamic-panel">
              <div class="dynamic-header">
                <div>
                  <span class="dynamic-kicker">Selected transaction</span>
                  <h2>{{ selectedProcess.title }}</h2>
                  <p>{{ selectedProcess.summary }}</p>
                </div>
                <div class="fee-card">
                  <span>Estimated Fees</span>
                  <strong>{{ selectedProcess.fee }}</strong>
                  <small>{{ selectedProcess.feeNote }}</small>
                </div>
              </div>

              <div class="dynamic-grid">
                <div class="dynamic-card">
                  <h3>Process Flow</h3>
                  <ol class="process-list">
                    <li v-for="item in selectedProcess.process" :key="item">
                      {{ item }}
                    </li>
                  </ol>
                </div>

                <div class="dynamic-card">
                  <h3>Required Documents</h3>
                  <ul class="requirement-list">
                    <li
                      v-for="item in selectedProcess.requirements"
                      :key="item"
                    >
                      {{ item }}
                    </li>
                  </ul>
                </div>
              </div>

              <div class="upload-grid">
                <label
                  v-for="requirement in selectedProcess.uploads"
                  :key="requirement.key"
                  class="upload-option"
                >
                  <div class="upload-left">
                    <div
                      class="upload-icon premium-soft-icon"
                      aria-hidden="true"
                    >
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
                      <strong>{{ requirement.label }}</strong>
                      <span>{{ requirement.description }}</span>
                      <small v-if="requirement.required"
                        >Required before submission</small
                      >
                      <small v-else>Optional supporting file</small>
                    </div>
                  </div>

                  <span class="upload-cta">
                    {{ uploadedFiles[requirement.key] || "Choose File" }}
                  </span>
                  <input
                    type="file"
                    class="file-input"
                    @change="handleRequirementUpload($event, requirement.key)"
                  />
                </label>
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
                <p>{{ selectedProcess?.reviewPrompt }}</p>
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
                <span>Application Type</span>
                <strong>{{ selectedApplicationLabel }}</strong>
              </div>

              <div class="summary-card">
                <span>Estimated Fees</span>
                <strong>{{ selectedProcess?.fee }}</strong>
              </div>
            </div>

            <div class="review-detail-grid">
              <div class="review-detail-card">
                <h3>Required Files</h3>
                <div
                  v-for="upload in selectedProcess?.uploads || []"
                  :key="upload.key"
                  class="file-row"
                >
                  <span>{{ upload.label }}</span>
                  <strong>{{
                    uploadedFiles[upload.key] || "Not uploaded"
                  }}</strong>
                </div>
              </div>

              <div class="review-detail-card">
                <h3>Next Steps After Submission</h3>
                <ol class="process-list compact-list">
                  <li
                    v-for="item in selectedProcess?.afterSubmit || []"
                    :key="item"
                  >
                    {{ item }}
                  </li>
                </ol>
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
                <p>{{ selectedProcess?.declaration }}</p>

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

            <h1>{{ selectedProcess?.successTitle }}</h1>
            <p>{{ selectedProcess?.successMessage }}</p>

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
                <span>Application Type</span>
                <strong>{{ selectedApplicationLabel }}</strong>
              </div>
              <div>
                <span>Estimated Fees</span>
                <strong>{{ selectedProcess?.fee }}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>For Review / Scheduling</strong>
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
              : `Please confirm your ${selectedApplicationLabel} application before submission.`
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
            You are about to end your current session and return to the landing
            page.
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
      <div class="settings-modal-card" role="dialog" aria-modal="true">
        <div class="settings-modal-header">
          <div>
            <span class="settings-modal-kicker">Accessibility</span>
            <h3>Settings</h3>
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
                >Use a darker color scheme for better low-light viewing.</span
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
                >Minimize animations and transitions across the interface.</span
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
            @click="closeSettingsModal"
          >
            Done
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
  reactive,
  ref,
  watch,
} from "vue";
import { useRouter } from "vue-router";
import logo from "../assets/logo.png";
import { useAccessibility } from "../composables/useAccessibility";

type LicenseKey = "student" | "driver" | "conductor";
type ApplicationKey =
  | "new"
  | "renewal"
  | "duplicate"
  | "revision"
  | "conversion";
type UploadRequirement = {
  key: string;
  label: string;
  description: string;
  required: boolean;
};
type ApplicationTypeOption = {
  value: ApplicationKey;
  label: string;
  description: string;
  hint: string;
};
type ApplicationProcess = {
  title: string;
  summary: string;
  fee: string;
  feeNote: string;
  process: string[];
  requirements: string[];
  uploads: UploadRequirement[];
  afterSubmit: string[];
  reviewPrompt: string;
  declaration: string;
  successTitle: string;
  successMessage: string;
};

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
const selectedLicense = ref<LicenseKey>("driver");
const selectedApplicationType = ref<ApplicationKey | null>(null);
const uploadedFiles = reactive<Record<string, string>>({});
const validationMessage = ref("");
const isConfirmed = ref(false);
const showCancelConfirm = ref(false);
const showSubmitConfirm = ref(false);

const steps = [
  { number: 1, label: "Classification" },
  { number: 2, label: "Application Type" },
  { number: 3, label: "Confirmation" },
  { number: 4, label: "Submitted" },
];

const applicationTypes: ApplicationTypeOption[] = [
  {
    value: "new",
    label: "New",
    description: "First-time application",
    hint: "For applicants who do not yet hold this license classification.",
  },
  {
    value: "renewal",
    label: "Renewal",
    description: "Extend existing validity",
    hint: "For licenses or permits that are expired or near expiry.",
  },
  {
    value: "duplicate",
    label: "Duplicate",
    description: "Replace lost or damaged license",
    hint: "Requires affidavit or supporting reason for replacement.",
  },
  {
    value: "revision",
    label: "Revision of Records",
    description: "Update personal or license records",
    hint: "For name, address, civil status, restriction, or record updates.",
  },
  {
    value: "conversion",
    label: "Conversion",
    description: "Convert permit to license",
    hint: "For student permit holders applying for a driver license.",
  },
];

const availableByLicense: Record<LicenseKey, ApplicationKey[]> = {
  student: ["new", "renewal", "duplicate", "revision"],
  driver: ["new", "renewal", "duplicate", "revision", "conversion"],
  conductor: ["new", "renewal", "duplicate", "revision"],
};

const processMap: Record<
  LicenseKey,
  Record<ApplicationKey, ApplicationProcess | null>
> = {
  student: {
    new: {
      title: "New Student-Driver's Permit",
      summary:
        "For first-time applicants who need authority to learn driving under supervision.",
      fee: "₱317.63",
      feeNote: "Estimated application and computer fees only.",
      process: [
        "Submit application information through LTMS.",
        "Upload or present medical certificate from accredited clinic.",
        "Validate identity and age eligibility at LTO office if requested.",
        "Pay assessed permit fees through available payment channel.",
        "Permit is released after LTO review and encoding.",
      ],
      requirements: [
        "Valid government-issued ID or birth certificate.",
        "Medical certificate from LTO-accredited clinic.",
        "Theoretical Driving Course certificate when applicable.",
        "Active LTMS client profile.",
      ],
      uploads: [
        {
          key: "medicalCertificate",
          label: "Medical Certificate",
          description: "Upload clinic-issued medical certificate if available.",
          required: true,
        },
        {
          key: "identityDocument",
          label: "Proof of Identity",
          description: "Upload valid ID or birth certificate for verification.",
          required: true,
        },
        {
          key: "tdcCertificate",
          label: "TDC Certificate",
          description:
            "Upload theoretical driving course certificate if issued.",
          required: false,
        },
      ],
      afterSubmit: [
        "LTO officer reviews submitted profile and uploaded documents.",
        "Applicant may be asked to appear for validation or payment.",
        "Permit release depends on verification and payment posting.",
      ],
      reviewPrompt:
        "Review your student permit application details and uploaded documents before submission.",
      declaration:
        "I certify that I am applying for a Student-Driver's Permit and that all identity, medical, and course information submitted is accurate.",
      successTitle: "Student Permit Application Submitted",
      successMessage:
        "Your student permit request has been submitted for LTO review. Monitor your transactions page for assessment, payment, and release updates.",
    },
    renewal: {
      title: "Renewal of Student-Driver's Permit",
      summary:
        "For applicants renewing an existing student permit record before applying for higher licensing privileges.",
      fee: "₱317.63",
      feeNote: "Estimated renewal-related fees only.",
      process: [
        "Confirm existing student permit details in LTMS.",
        "Submit updated medical certificate.",
        "Review previous permit record for validation.",
        "Pay assessed fees once renewal is accepted.",
      ],
      requirements: [
        "Existing student permit record.",
        "Updated medical certificate.",
        "Valid identification document.",
      ],
      uploads: [
        {
          key: "medicalCertificate",
          label: "Updated Medical Certificate",
          description:
            "Upload current medical certificate from accredited clinic.",
          required: true,
        },
        {
          key: "oldPermit",
          label: "Existing Student Permit",
          description: "Upload old permit copy if available.",
          required: false,
        },
      ],
      afterSubmit: [
        "Existing permit record will be checked by LTO.",
        "Medical certificate will be verified.",
        "Applicant proceeds to payment once renewal is assessed.",
      ],
      reviewPrompt: "Review the permit renewal details before submission.",
      declaration:
        "I confirm that I am renewing an existing Student-Driver's Permit and that my submitted medical and identity information is updated.",
      successTitle: "Student Permit Renewal Submitted",
      successMessage:
        "Your student permit renewal request has been submitted. Wait for LTO assessment and payment instructions.",
    },
    duplicate: {
      title: "Duplicate Student-Driver's Permit",
      summary:
        "For replacement of a lost, damaged, or unreadable student permit.",
      fee: "₱225.00",
      feeNote: "Estimated duplicate/replacement fees only.",
      process: [
        "Declare reason for duplicate request through uploaded supporting document.",
        "LTO verifies existing permit record.",
        "Pay duplicate permit fees after approval.",
        "Replacement permit is released after validation.",
      ],
      requirements: [
        "Existing student permit record.",
        "Affidavit of loss or damaged permit copy.",
        "Valid ID for identity validation.",
      ],
      uploads: [
        {
          key: "affidavitOrDamagedCopy",
          label: "Affidavit / Damaged Permit Copy",
          description: "Upload affidavit of loss or photo of damaged permit.",
          required: true,
        },
        {
          key: "identityDocument",
          label: "Proof of Identity",
          description: "Upload valid ID for verification.",
          required: true,
        },
      ],
      afterSubmit: [
        "Existing permit record will be verified.",
        "Supporting document will be checked.",
        "Duplicate permit request proceeds to payment when approved.",
      ],
      reviewPrompt:
        "Review duplicate permit replacement details before submission.",
      declaration:
        "I confirm that this duplicate request is due to loss, damage, or unreadability of my existing permit and that my supporting documents are valid.",
      successTitle: "Duplicate Permit Request Submitted",
      successMessage:
        "Your duplicate student permit request has been submitted for LTO verification.",
    },
    revision: {
      title: "Revision of Student Permit Records",
      summary:
        "For corrections or updates to personal details in the student permit record.",
      fee: "₱150.00",
      feeNote: "Estimated records revision fee only.",
      process: [
        "Submit supporting document showing correct information.",
        "LTO validates the requested record change.",
        "Record is updated after officer approval.",
      ],
      requirements: [
        "Existing student permit record.",
        "Valid ID or civil registry document supporting the correction.",
        "Clear statement of correction requested.",
      ],
      uploads: [
        {
          key: "supportingDocument",
          label: "Supporting Document",
          description:
            "Upload document showing correct name, birth date, or address.",
          required: true,
        },
      ],
      afterSubmit: [
        "Record correction will be reviewed by LTO personnel.",
        "Applicant may be asked to present original documents.",
        "Updated records appear after approval and encoding.",
      ],
      reviewPrompt: "Review record revision details before submission.",
      declaration:
        "I confirm that the revision requested is supported by valid documents and that I may be required to present originals for verification.",
      successTitle: "Student Permit Revision Submitted",
      successMessage:
        "Your student permit record revision request has been submitted for verification.",
    },
    conversion: null,
  },
  driver: {
    new: {
      title: "New Driver's License",
      summary:
        "For applicants applying for a Non-Professional or Professional Driver's License for the first time.",
      fee: "₱585.00",
      feeNote: "Estimated license, application, and computer fees only.",
      process: [
        "Submit online driver license application.",
        "Validate student permit holding period and eligibility.",
        "Complete medical and documentary verification.",
        "Take written/theoretical examination when required.",
        "Complete practical driving test at LTO office.",
        "Pay assessed fees and wait for license release.",
      ],
      requirements: [
        "Valid student permit record.",
        "Medical certificate from accredited clinic.",
        "Practical driving course certificate when applicable.",
        "Valid identification document.",
      ],
      uploads: [
        {
          key: "medicalCertificate",
          label: "Medical Certificate",
          description: "Upload current medical certificate.",
          required: true,
        },
        {
          key: "studentPermit",
          label: "Student Permit",
          description: "Upload student permit copy or reference.",
          required: true,
        },
        {
          key: "pdcCertificate",
          label: "PDC Certificate",
          description:
            "Upload practical driving course certificate if available.",
          required: false,
        },
      ],
      afterSubmit: [
        "LTO checks eligibility and submitted documents.",
        "Applicant proceeds to examination and driving test when scheduled.",
        "Payment and license release follow successful evaluation.",
      ],
      reviewPrompt:
        "Review new driver license details, eligibility documents, and test requirements before submission.",
      declaration:
        "I confirm that I am applying for a new Driver's License and that I understand examination, practical test, and LTO validation may be required.",
      successTitle: "New Driver License Application Submitted",
      successMessage:
        "Your driver license application has been submitted. Monitor your transactions page for examination, payment, and release instructions.",
    },
    renewal: {
      title: "Driver's License Renewal",
      summary:
        "For renewing an existing driver license that is expired or near expiry.",
      fee: "₱585.00",
      feeNote: "May vary depending on penalties, validity, and record status.",
      process: [
        "Retrieve existing driver license record.",
        "Validate demerit points and violation status.",
        "Submit updated medical certificate.",
        "Complete CDE validation if required.",
        "Pay renewal fees and wait for license release.",
      ],
      requirements: [
        "Existing driver license record.",
        "Medical certificate from accredited clinic.",
        "CDE certificate or validation when required.",
        "No blocking unsettled violations.",
      ],
      uploads: [
        {
          key: "medicalCertificate",
          label: "Medical Certificate",
          description: "Upload updated medical certificate.",
          required: true,
        },
        {
          key: "oldLicense",
          label: "Existing Driver License",
          description: "Upload current or expired license copy if available.",
          required: false,
        },
        {
          key: "cdeCertificate",
          label: "CDE Certificate",
          description: "Upload CDE certificate if already completed.",
          required: false,
        },
      ],
      afterSubmit: [
        "LTO validates license status and violation record.",
        "Medical certificate and CDE status are checked.",
        "Renewal proceeds to payment and release once cleared.",
      ],
      reviewPrompt: "Review renewal details before submission.",
      declaration:
        "I confirm that I am renewing my existing Driver's License and that my medical, CDE, and violation status records are subject to LTO verification.",
      successTitle: "Driver License Renewal Submitted",
      successMessage:
        "Your driver license renewal request has been submitted for verification and assessment.",
    },
    duplicate: {
      title: "Duplicate Driver's License",
      summary:
        "For replacement of a lost, stolen, damaged, or unreadable driver license card.",
      fee: "₱225.00",
      feeNote: "Estimated duplicate card fee only.",
      process: [
        "Submit duplicate card request.",
        "Upload affidavit of loss or damaged license proof.",
        "LTO verifies active driver license record.",
        "Pay duplicate card fee after verification.",
        "Replacement card is released after processing.",
      ],
      requirements: [
        "Existing valid driver license record.",
        "Affidavit of loss, police report, or damaged card copy.",
        "Valid ID for identity verification.",
      ],
      uploads: [
        {
          key: "affidavitOrDamagedCard",
          label: "Affidavit / Damaged Card Proof",
          description:
            "Upload affidavit of loss or damaged license card photo.",
          required: true,
        },
        {
          key: "identityDocument",
          label: "Proof of Identity",
          description: "Upload valid ID for verification.",
          required: true,
        },
      ],
      afterSubmit: [
        "LTO checks card status and license validity.",
        "Supporting proof is verified.",
        "Duplicate license card proceeds to payment and release.",
      ],
      reviewPrompt:
        "Review duplicate license request details before submission.",
      declaration:
        "I confirm that I am requesting a duplicate Driver's License due to loss, damage, theft, or unreadability and that all supporting documents are valid.",
      successTitle: "Duplicate License Request Submitted",
      successMessage:
        "Your duplicate driver license request has been submitted for verification.",
    },
    revision: {
      title: "Revision of Driver's License Records",
      summary:
        "For updating license holder information or adding/changing license restrictions where allowed.",
      fee: "₱150.00",
      feeNote: "May vary depending on requested revision type.",
      process: [
        "Select record update and submit supporting documents.",
        "LTO verifies the requested correction or restriction update.",
        "Biometrics or photo update may be required.",
        "Revised record/card is issued after approval and payment.",
      ],
      requirements: [
        "Existing driver license record.",
        "Valid supporting document for requested revision.",
        "Medical certificate if restriction or physical detail is affected.",
      ],
      uploads: [
        {
          key: "supportingDocument",
          label: "Supporting Document",
          description:
            "Upload marriage certificate, birth certificate, or other proof.",
          required: true,
        },
        {
          key: "medicalCertificate",
          label: "Medical Certificate",
          description:
            "Required when the revision affects restriction/medical details.",
          required: false,
        },
      ],
      afterSubmit: [
        "LTO reviews the correction request and uploaded proof.",
        "Applicant may be asked to present original documents.",
        "Updated record/card is processed after approval.",
      ],
      reviewPrompt:
        "Review revision request details and supporting proof before submission.",
      declaration:
        "I confirm that I am requesting a legitimate revision to my Driver's License record and that all supporting documents are authentic.",
      successTitle: "Driver License Revision Submitted",
      successMessage:
        "Your driver license revision request has been submitted for review.",
    },
    conversion: {
      title: "Student Permit to Driver License Conversion",
      summary:
        "For converting a valid student permit into a driver license after meeting eligibility requirements.",
      fee: "₱585.00",
      feeNote: "Estimated license and examination-related fees only.",
      process: [
        "Validate student permit age and holding period.",
        "Submit medical and driving course documents.",
        "Take required written examination.",
        "Take practical driving test for requested restriction code.",
        "Pay assessed fees after passing evaluation.",
      ],
      requirements: [
        "Valid student permit record.",
        "Medical certificate from accredited clinic.",
        "Practical Driving Course certificate when applicable.",
        "Valid ID and active LTMS profile.",
      ],
      uploads: [
        {
          key: "studentPermit",
          label: "Student Permit",
          description: "Upload student permit copy or reference document.",
          required: true,
        },
        {
          key: "medicalCertificate",
          label: "Medical Certificate",
          description: "Upload current medical certificate.",
          required: true,
        },
        {
          key: "pdcCertificate",
          label: "PDC Certificate",
          description:
            "Upload practical driving course certificate if available.",
          required: false,
        },
      ],
      afterSubmit: [
        "Student permit eligibility will be verified.",
        "Applicant proceeds to examination and practical test when scheduled.",
        "Driver license release follows successful evaluation and payment.",
      ],
      reviewPrompt: "Review conversion details before submission.",
      declaration:
        "I confirm that I am converting my Student Permit to a Driver's License and that I understand examination and practical test requirements apply.",
      successTitle: "License Conversion Application Submitted",
      successMessage:
        "Your permit-to-license conversion request has been submitted. Wait for test and assessment instructions.",
    },
  },
  conductor: {
    new: {
      title: "New Conductor's License",
      summary: "For first-time public transport conductor authorization.",
      fee: "₱585.00",
      feeNote: "Estimated application and license fees only.",
      process: [
        "Submit conductor license application through LTMS.",
        "Upload medical and identity documents.",
        "Complete verification and assessment at LTO office.",
        "Pay assessed fees after approval.",
        "Conductor license is released after processing.",
      ],
      requirements: [
        "Valid ID or proof of identity.",
        "Medical certificate from accredited clinic.",
        "Clearance or supporting employment document when required.",
      ],
      uploads: [
        {
          key: "medicalCertificate",
          label: "Medical Certificate",
          description: "Upload current medical certificate.",
          required: true,
        },
        {
          key: "identityDocument",
          label: "Proof of Identity",
          description: "Upload valid ID for verification.",
          required: true,
        },
      ],
      afterSubmit: [
        "LTO validates eligibility and uploaded documents.",
        "Assessment and payment follow after officer verification.",
        "License is released once processing is complete.",
      ],
      reviewPrompt: "Review conductor license application before submission.",
      declaration:
        "I confirm that I am applying for a Conductor's License and that I meet the eligibility and document requirements.",
      successTitle: "Conductor License Application Submitted",
      successMessage:
        "Your conductor license application has been submitted for LTO review.",
    },
    renewal: {
      title: "Conductor's License Renewal",
      summary: "For renewing an existing conductor license.",
      fee: "₱485.00",
      feeNote: "May vary depending on penalties and validity status.",
      process: [
        "Retrieve existing conductor license record.",
        "Submit updated medical certificate.",
        "LTO checks record status and violations.",
        "Pay renewal fees once assessed.",
      ],
      requirements: [
        "Existing conductor license record.",
        "Updated medical certificate.",
        "Valid ID for verification.",
      ],
      uploads: [
        {
          key: "medicalCertificate",
          label: "Medical Certificate",
          description: "Upload updated medical certificate.",
          required: true,
        },
        {
          key: "oldLicense",
          label: "Existing Conductor License",
          description: "Upload current or expired license copy if available.",
          required: false,
        },
      ],
      afterSubmit: [
        "License record and medical certificate are verified.",
        "Renewal fees are assessed.",
        "Renewed license is released after payment and processing.",
      ],
      reviewPrompt:
        "Review conductor license renewal details before submission.",
      declaration:
        "I confirm that I am renewing my Conductor's License and that my submitted information is accurate.",
      successTitle: "Conductor License Renewal Submitted",
      successMessage:
        "Your conductor license renewal request has been submitted for assessment.",
    },
    duplicate: {
      title: "Duplicate Conductor's License",
      summary: "For replacement of a lost or damaged conductor license.",
      fee: "₱225.00",
      feeNote: "Estimated replacement card fee only.",
      process: [
        "Submit duplicate request and reason.",
        "Upload affidavit of loss or damaged card proof.",
        "LTO verifies existing conductor license record.",
        "Pay duplicate card fee after approval.",
      ],
      requirements: [
        "Existing conductor license record.",
        "Affidavit of loss or damaged card proof.",
        "Valid ID.",
      ],
      uploads: [
        {
          key: "affidavitOrDamagedCard",
          label: "Affidavit / Damaged Card Proof",
          description: "Upload affidavit or damaged card photo.",
          required: true,
        },
        {
          key: "identityDocument",
          label: "Proof of Identity",
          description: "Upload valid ID for verification.",
          required: true,
        },
      ],
      afterSubmit: [
        "Existing record is verified.",
        "Supporting document is checked.",
        "Replacement license proceeds to payment and release.",
      ],
      reviewPrompt:
        "Review duplicate conductor license request before submission.",
      declaration:
        "I confirm that I am requesting a duplicate Conductor's License due to loss, damage, or unreadability.",
      successTitle: "Duplicate Conductor License Request Submitted",
      successMessage:
        "Your duplicate conductor license request has been submitted for verification.",
    },
    revision: {
      title: "Revision of Conductor's License Records",
      summary:
        "For correcting or updating conductor license holder information.",
      fee: "₱150.00",
      feeNote: "Estimated record revision fee only.",
      process: [
        "Submit revision request and supporting proof.",
        "LTO verifies requested correction.",
        "Record is updated after approval.",
      ],
      requirements: [
        "Existing conductor license record.",
        "Supporting document for requested correction.",
        "Valid ID.",
      ],
      uploads: [
        {
          key: "supportingDocument",
          label: "Supporting Document",
          description: "Upload document proving the requested correction.",
          required: true,
        },
      ],
      afterSubmit: [
        "Requested correction is reviewed by LTO.",
        "Applicant may be asked to present original documents.",
        "Updated record appears after approval and encoding.",
      ],
      reviewPrompt:
        "Review conductor license revision details before submission.",
      declaration:
        "I confirm that my conductor license revision request is supported by valid documents.",
      successTitle: "Conductor License Revision Submitted",
      successMessage:
        "Your conductor license revision request has been submitted for verification.",
    },
    conversion: null,
  },
};

const licenseOptions = computed(() => [
  {
    value: "student" as LicenseKey,
    title: "Student-Driver's Permit",
    chip: "Beginner",
    recommended: false,
    description:
      "For applicants who are learning to drive and need an official permit.",
    availableLabels: labelsForLicense("student"),
    icon: `<svg viewBox="0 0 24 24"><path d="M4.75 6.75A2.25 2.25 0 0 1 7 4.5h10a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 17 19.5H7a2.25 2.25 0 0 1-2.25-2.25V6.75Z" /><path d="M8 9h5.25" /><path d="M8 12h3.75" /><path d="M8 15h2.75" /><circle cx="16" cy="12" r="2.25" /><path d="M14.4 15.8c.38-.7.92-1.05 1.6-1.05s1.22.35 1.6 1.05" /></svg>`,
  },
  {
    value: "driver" as LicenseKey,
    title: "Driver's License",
    chip: "Most Common",
    recommended: true,
    description:
      "For new, renewal, conversion, duplicate, or revision applications.",
    availableLabels: labelsForLicense("driver"),
    icon: `<svg viewBox="0 0 24 24"><path d="M5.25 13.5l1.45-4.18A2.75 2.75 0 0 1 9.3 7.5h5.4a2.75 2.75 0 0 1 2.6 1.82l1.45 4.18" /><path d="M4.75 13.5h14.5A1.75 1.75 0 0 1 21 15.25v2.25a1.25 1.25 0 0 1-1.25 1.25H18.5v-1.1a1.15 1.15 0 0 0-1.15-1.15H16.2a1.15 1.15 0 0 0-1.15 1.15v1.1h-6.1v-1.1A1.15 1.15 0 0 0 7.8 16.5H6.65a1.15 1.15 0 0 0-1.15 1.15v1.1H4.25A1.25 1.25 0 0 1 3 17.5v-2.25a1.75 1.75 0 0 1 1.75-1.75Z" /><path d="M7.25 13.5h9.5" /><circle cx="7.5" cy="15.8" r="1" fill="currentColor" stroke="none" /><circle cx="16.5" cy="15.8" r="1" fill="currentColor" stroke="none" /></svg>`,
  },
  {
    value: "conductor" as LicenseKey,
    title: "Conductor's License",
    chip: "Public Transport",
    recommended: false,
    description: "For public transport conductor authorization and licensing.",
    availableLabels: labelsForLicense("conductor"),
    icon: `<svg viewBox="0 0 24 24"><path d="M7 15.5V9.25A3.25 3.25 0 0 1 10.25 6h3.5A3.25 3.25 0 0 1 17 9.25v6.25" /><path d="M6.25 15.5h11.5A1.75 1.75 0 0 1 19.5 17.25v1A1.75 1.75 0 0 1 17.75 20H6.25a1.75 1.75 0 0 1-1.75-1.75v-1a1.75 1.75 0 0 1 1.75-1.75Z" /><path d="M9 10h6" /><path d="M9 13h6" /><circle cx="8" cy="18" r="1" fill="currentColor" stroke="none" /><circle cx="16" cy="18" r="1" fill="currentColor" stroke="none" /></svg>`,
  },
]);

const dashboardMenuItems = [
  {
    title: "DASHBOARD",
    route: "/home",
    description: "Return to main dashboard<br>overview and services",
    icon: `<svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7" /><path d="M5.5 10.5v9h13v-9" /><path d="M9.5 19.5v-6h5v6" /></svg>`,
  },
  {
    title: "LICENSING",
    route: "/licensing",
    description: "Apply, renew, manage<br>driver & student licenses",
    icon: `<svg viewBox="0 0 24 24"><rect x="3.75" y="5.5" width="16.5" height="13" rx="2.4" /><path d="M7.5 10h5.5" /><path d="M7.5 13h3.7" /><circle cx="16" cy="12" r="2.15" /></svg>`,
  },
  {
    title: "VEHICLE",
    route: "/vehicle",
    description: "Check registrations<br>and manage vehicle records",
    icon: `<svg viewBox="0 0 24 24"><path d="M5.25 13.5l1.45-4.18A2.75 2.75 0 0 1 9.3 7.5h5.4a2.75 2.75 0 0 1 2.6 1.82l1.45 4.18" /><path d="M4.75 13.5h14.5A1.75 1.75 0 0 1 21 15.25v2.25a1.25 1.25 0 0 1-1.25 1.25H4.25A1.25 1.25 0 0 1 3 17.5v-2.25a1.75 1.75 0 0 1 1.75-1.75Z" /><circle cx="7.5" cy="15.8" r="1" fill="currentColor" stroke="none" /><circle cx="16.5" cy="15.8" r="1" fill="currentColor" stroke="none" /></svg>`,
  },
  {
    title: "TRANSACTIONS",
    route: "/transactions",
    description: "Track application<br>status and payment history",
    icon: `<svg viewBox="0 0 24 24"><path d="M7 3.75h10A2.25 2.25 0 0 1 19.25 6v14.25l-2.35-1.4-2.35 1.4-2.35-1.4-2.35 1.4-2.35-1.4-2.35 1.4V6A2.25 2.25 0 0 1 7 3.75Z" /><path d="M8.5 8h7" /><path d="M8.5 11.5h7" /><path d="M8.5 15h4.5" /></svg>`,
  },
  {
    title: "VIOLATIONS",
    route: "/violations",
    description: "View and settle<br>traffic violations",
    icon: `<svg viewBox="0 0 24 24"><path d="M12 3.75l8 3.5v5.8c0 4.65-3.25 7.75-8 9.2-4.75-1.45-8-4.55-8-9.2v-5.8l8-3.5Z" /><path d="M12 8.5v5" /><path d="M12 17h.01" /></svg>`,
  },
  {
    title: "DOCUMENTS",
    route: "/documents",
    description: "Request official copies<br>and electronic records",
    icon: `<svg viewBox="0 0 24 24"><path d="M7.5 4.25h7l4 4v11.5H7.5A2.5 2.5 0 0 1 5 17.25V6.75a2.5 2.5 0 0 1 2.5-2.5Z" /><path d="M14.5 4.25v4h4" /><path d="M8.5 12h7" /><path d="M8.5 15.5h5" /></svg>`,
  },
];

function labelsForLicense(license: LicenseKey) {
  return availableByLicense[license]
    .map(
      (value) => applicationTypes.find((type) => type.value === value)?.label,
    )
    .filter(Boolean) as string[];
}

const licenseLabel = computed(() => {
  if (selectedLicense.value === "student") return "STUDENT-DRIVER'S PERMIT";
  if (selectedLicense.value === "driver") return "DRIVER'S LICENSE";
  return "CONDUCTOR'S LICENSE";
});

const availableApplicationTypes = computed(() =>
  applicationTypes.filter((type) =>
    availableByLicense[selectedLicense.value].includes(type.value),
  ),
);

const selectedProcess = computed(() => {
  if (!selectedApplicationType.value) return null;
  return processMap[selectedLicense.value][selectedApplicationType.value];
});

const selectedApplicationLabel = computed(() =>
  selectedApplicationType.value
    ? applicationTypes.find(
        (type) => type.value === selectedApplicationType.value,
      )?.label || "None"
    : "None",
);

const referenceNumber = computed(() => {
  const licenseCode = selectedLicense.value.toUpperCase().slice(0, 3);
  const applicationCode = (selectedApplicationType.value || "APP")
    .toUpperCase()
    .slice(0, 3);
  return `LTMS-${licenseCode}-${applicationCode}-${clientId.replaceAll("-", "")}-${new Date().getFullYear()}`;
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

const selectLicense = (value: LicenseKey) => {
  selectedLicense.value = value;
  selectedApplicationType.value = null;
  clearUploads();
  validationMessage.value = "";
  isConfirmed.value = false;
};

const selectApplicationType = (value: ApplicationKey) => {
  validationMessage.value = "";
  selectedApplicationType.value =
    selectedApplicationType.value === value ? null : value;
  clearUploads();
  isConfirmed.value = false;
};

const clearUploads = () => {
  Object.keys(uploadedFiles).forEach((key) => delete uploadedFiles[key]);
};

const handleRequirementUpload = (event: Event, key: string) => {
  const input = event.target as HTMLInputElement;
  const fileName = input.files?.[0]?.name || "";
  if (fileName) uploadedFiles[key] = fileName;
};

const missingRequiredUploads = computed(() => {
  if (!selectedProcess.value) return [];
  return selectedProcess.value.uploads.filter(
    (upload) => upload.required && !uploadedFiles[upload.key],
  );
});

const handleProceed = () => {
  validationMessage.value = "";

  if (currentStep.value === 1) {
    currentStep.value = 2;
    selectedApplicationType.value = null;
    clearUploads();
    isConfirmed.value = false;
    return;
  }

  if (currentStep.value === 2) {
    if (!selectedApplicationType.value || !selectedProcess.value) {
      validationMessage.value =
        "Please select one application type before proceeding.";
      return;
    }

    if (missingRequiredUploads.value.length > 0) {
      validationMessage.value = `Please upload required file(s): ${missingRequiredUploads.value
        .map((item) => item.label)
        .join(", ")}.`;
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
  if (currentStep.value > 1) currentStep.value -= 1;
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
  selectedApplicationType.value = null;
  clearUploads();
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
const goToContact = () => navigateTo("/contact");

const openOfficialWebsite = async () => {
  const started = await beginPageLoading();
  if (!started) return;
  await delay(180);
  window.open("https://lto.gov.ph", "_blank", "noopener,noreferrer");
  await delay(160);
  endPageLoading();
};

const goToDashboardItem = (route: string) => navigateTo(route);

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

const handleDocumentClick = (event: MouseEvent) => {
  const target = event.target as Node | null;
  if (!target) return;

  const clickedUserMenu = userMenuRef.value?.contains(target);
  const clickedDashboardMenu = dashboardMenuRef.value?.contains(target);

  if (!clickedUserMenu && !clickedDashboardMenu) closeFloatingMenus();
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
}

@keyframes dashboardSpin {
  to {
    transform: rotate(360deg);
  }
}

.topbar {
  min-height: 72px;
  background: linear-gradient(180deg, #0d468f 0%, #0b3d82 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  box-shadow: 0 8px 18px rgba(10, 46, 99, 0.18);
  z-index: 5;
}

.topbar-left,
.brand-wrap,
.topbar-nav,
.user-menu-trigger,
.user-info,
.dashboard-trigger {
  display: flex;
  align-items: center;
}

.brand-wrap {
  gap: 12px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}

.brand-logo {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
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
  transition: 0.2s ease;
}

.nav-item:hover,
.nav-item.active {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.14);
  transform: translateY(-1px);
}

.dashboard-menu,
.user-menu {
  position: relative;
}

.dashboard-trigger {
  gap: 8px;
  cursor: pointer;
}

.dashboard-caret,
.user-caret {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.dashboard-trigger.active .dashboard-caret {
  transform: rotate(180deg);
}

.user-menu {
  display: flex;
  align-items: center;
  z-index: 90;
}

.user-menu-trigger {
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
}

.user-info {
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.15;
}

.user-name {
  font-size: 12px;
  font-weight: 800;
}

.user-id {
  font-size: 11px;
  font-weight: 700;
  opacity: 0.84;
  white-space: nowrap;
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
  z-index: 1400;
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

.breadcrumb-bar,
.licensing-modal {
  position: relative;
  z-index: 2;
  width: min(95%, 1120px);
}

.breadcrumb-bar {
  display: flex;
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

.licensing-modal {
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

.modal-hero,
.form-header,
.dynamic-header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 28px;
  align-items: start;
  padding: 28px 0 22px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.95);
}

.agency-kicker,
.dynamic-kicker {
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

.modal-hero h1,
.form-title h1,
.dynamic-header h2 {
  margin: 0;
  max-width: 760px;
  font-size: 29px;
  line-height: 1.16;
  font-weight: 900;
  letter-spacing: -0.55px;
  color: #0b1220;
}

.dynamic-header h2 {
  font-size: 24px;
}

.client-id,
.instruction,
.form-title p,
.dynamic-header p {
  color: #64748b;
  font-size: 15px;
  font-weight: 500;
}

.client-id {
  margin: 14px 0 0;
  color: #334155;
  font-weight: 750;
}

.client-id span {
  color: #94a3b8;
  margin: 0 7px;
}

.instruction,
.form-title p,
.dynamic-header p {
  margin: 11px 0 0;
}

.step-card,
.fee-card {
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

.step-card span,
.fee-card span {
  display: block;
  color: #2563eb;
  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0.45px;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.step-card strong,
.fee-card strong {
  display: block;
  color: #0f172a;
  font-size: 15px;
  line-height: 1.25;
}

.fee-card strong {
  font-size: 27px;
  color: #0f3d87;
}

.fee-card small {
  display: block;
  margin-top: 6px;
  color: #64748b;
  font-weight: 650;
}

.license-list,
.application-form,
.review-panel {
  padding-top: 22px;
}

.license-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
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
  transition: 0.2s ease;
}

.license-option::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 5px;
  background: transparent;
}

.license-option:hover {
  transform: translateY(-1px);
  border-color: #93c5fd;
  box-shadow: 0 14px 26px rgba(15, 23, 42, 0.07);
}

.license-option.selected {
  border-color: #1d4ed8;
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
}

.selection-indicator span {
  width: 10px;
  height: 10px;
  background: #1d4ed8;
  border-radius: 50%;
}

.license-option.selected .selection-indicator {
  border-color: #1d4ed8;
}

.premium-icon,
.premium-soft-icon,
.upload-icon,
.form-title-icon {
  width: 58px;
  height: 58px;
  flex: 0 0 58px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: #0f3d87;
  background: linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bfdbfe;
  padding: 12px;
}

.form-title-icon {
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  border-radius: 15px;
  padding: 11px;
}

.form-title-icon.amber {
  color: #92400e;
  background: #fffbeb;
  border-color: #fde68a;
}

.license-option.selected .premium-icon {
  color: #ffffff;
  background: linear-gradient(145deg, #2563eb 0%, #0f3d87 100%);
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

.option-copy span,
.option-copy small {
  font-size: 13.5px;
  color: #64748b;
  line-height: 1.4;
}

.option-meta {
  color: #0f3d87 !important;
  font-weight: 750;
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
  font-weight: 850;
  text-transform: uppercase;
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
}

.option-chevron svg,
.premium-icon svg,
.upload-icon svg,
.form-title-icon svg,
.application-check svg,
.confirmation-icon svg,
.success-icon svg,
.confirm-dialog-icon svg,
.mega-icon svg,
.mega-arrow svg {
  width: 100%;
  height: 100%;
  display: block;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.option-chevron svg {
  width: 20px;
  height: 20px;
  stroke-width: 2.2;
}

.form-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.form-title h1 {
  font-size: 25px;
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
  min-height: 96px;
  border: 1px solid #dbe3ee;
  border-radius: 14px;
  background: #ffffff;
  padding: 14px 16px 14px 52px;
  text-align: left;
  cursor: pointer;
  transition: 0.18s ease;
}

.application-type:hover,
.application-type.selected {
  transform: translateY(-1px);
  border-color: #1d4ed8;
  box-shadow: 0 10px 22px rgba(37, 99, 235, 0.08);
}

.application-type.selected {
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

.application-type strong,
.application-type small {
  display: block;
  color: #64748b;
  font-size: 12.5px;
  line-height: 1.35;
}

.application-type small {
  margin-top: 6px;
  color: #475569;
}

.dynamic-panel {
  margin-top: 22px;
  border: 1px solid #dbe3ee;
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  padding: 20px;
}

.dynamic-header {
  padding: 0 0 18px;
}

.dynamic-grid,
.review-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-top: 18px;
}

.dynamic-card,
.review-detail-card,
.summary-card {
  border: 1px solid #dbe3ee;
  border-radius: 16px;
  background: #ffffff;
  padding: 18px;
}

.dynamic-card h3,
.review-detail-card h3 {
  margin: 0 0 12px;
  color: #0f172a;
  font-size: 16px;
  font-weight: 950;
}

.process-list,
.requirement-list {
  margin: 0;
  padding-left: 18px;
  color: #475569;
  font-size: 13.5px;
  line-height: 1.65;
  font-weight: 650;
}

.compact-list {
  line-height: 1.55;
}

.upload-grid {
  display: grid;
  gap: 12px;
  margin-top: 18px;
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
  transition: 0.2s ease;
}

.upload-option:hover {
  border-color: #2563eb;
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
}

.upload-copy strong {
  font-size: 15px;
}

.upload-copy small {
  font-size: 12px;
  font-weight: 800;
  color: #0f3d87;
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
}

.file-input {
  display: none;
}

.review-summary,
.success-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.summary-card span,
.reference-card span,
.success-summary span {
  display: block;
  color: #64748b;
  font-size: 12px;
  font-weight: 850;
  text-transform: uppercase;
  letter-spacing: 0.35px;
  margin-bottom: 8px;
}

.summary-card strong,
.success-summary strong {
  display: block;
  color: #0f172a;
  font-size: 15px;
  line-height: 1.35;
  font-weight: 900;
}

.file-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 13px;
  font-weight: 750;
}

.file-row:last-child {
  border-bottom: none;
}

.file-row strong {
  color: #0f172a;
  text-align: right;
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
  max-width: 560px;
  margin: 24px auto 0;
  border: 1px solid #bbf7d0;
  background: #ecfdf5;
  border-radius: 18px;
  padding: 18px;
}

.reference-card span,
.success-summary span {
  color: #047857;
}

.reference-card strong {
  color: #064e3b;
  font-size: 20px;
  font-weight: 950;
}

.success-summary {
  max-width: 760px;
  margin: 16px auto 0;
}

.success-summary div {
  border: 1px solid #dbe3ee;
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
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
.btn-proceed,
.btn-dialog-secondary,
.btn-dialog-primary,
.logout-cancel-btn,
.logout-confirm-btn,
.settings-done-btn {
  border-radius: 12px;
  min-height: 46px;
  padding: 0 26px;
  font-size: 14px;
  font-weight: 850;
  cursor: pointer;
}

.btn-back,
.btn-dialog-secondary,
.logout-cancel-btn {
  background: #ffffff;
  color: #0f3d87;
  border: 1px solid #bfdbfe;
}

.btn-cancel {
  background: #ffffff;
  color: #b42318;
  border: 1px solid #fecaca;
}

.btn-proceed,
.settings-done-btn {
  border: none;
  background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  margin-left: auto;
  box-shadow: 0 12px 22px rgba(29, 78, 216, 0.24);
}

.btn-dialog-primary {
  border: none;
  background: #047857;
  color: #ffffff;
}

.btn-dialog-primary.danger,
.logout-confirm-btn {
  border: none;
  background: #b42318;
  color: #ffffff;
}

.confirm-overlay,
.logout-modal-overlay,
.settings-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1300;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(8px);
}

.logout-modal-overlay,
.settings-modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.42);
}

.confirm-dialog,
.logout-modal-card,
.settings-modal-card {
  width: min(100%, 460px);
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 24px;
  box-shadow: 0 30px 70px rgba(15, 23, 42, 0.28);
  padding: 26px;
  text-align: center;
}

.settings-modal-card {
  width: min(560px, 100%);
  padding: 0;
  overflow: hidden;
  text-align: left;
}

.confirm-dialog-icon,
.logout-modal-icon {
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

.confirm-dialog h2,
.logout-modal-copy h3 {
  margin: 0;
  color: #0f172a;
  font-size: 22px;
  font-weight: 950;
}

.confirm-dialog p,
.logout-modal-copy p {
  margin: 10px 0 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
}

.confirm-actions,
.logout-modal-actions,
.settings-modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 22px;
}

.confirm-actions button,
.logout-modal-actions button {
  flex: 1;
}

.settings-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid #e5edf7;
}

.settings-modal-kicker,
.logout-modal-kicker {
  display: inline-block;
  margin-bottom: 8px;
  color: #1f5fb7;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

.settings-modal-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 28px;
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
  margin-left: 0;
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

.mega-dropdown {
  position: absolute;
  top: calc(100% + 16px);
  right: 0;
  width: min(760px, 92vw);
  max-width: calc(100vw - 32px);
  padding: 18px;
  border-radius: 26px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.98),
    rgba(248, 251, 255, 0.98)
  );
  border: 1px solid rgba(219, 229, 243, 0.95);
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.25);
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
  text-transform: uppercase;
  margin-bottom: 8px;
}

.mega-dropdown-head h3 {
  margin: 0;
  color: #0f172a;
  font-size: 22px;
  font-weight: 950;
}

.mega-dropdown-head p {
  margin: 7px 0 0;
  color: #64748b;
  font-size: 13px;
}

.mega-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.mega-item {
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
}

.mega-item:hover,
.mega-item.active {
  background: #f4f8ff;
  border-color: #dbeafe;
  box-shadow: 0 14px 28px rgba(29, 78, 216, 0.1);
  transform: translateY(-2px);
}

.mega-icon {
  width: 58px;
  height: 58px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb, #0f3d87);
  padding: 16px;
}

.mega-copy {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.mega-copy strong {
  color: #0f172a;
  font-size: 13px;
  font-weight: 950;
}

.mega-copy small {
  color: #64748b;
  font-size: 12.5px;
  line-height: 1.35;
}

.mega-arrow {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #94a3b8;
  background: #f8fafc;
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
}

.mega-footer button {
  border: none;
  background: transparent;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
}

:deep(.mega-icon svg),
:deep(.premium-icon svg),
:deep(.premium-soft-icon svg),
:deep(.upload-icon svg),
:deep(.form-title-icon svg) {
  fill: none !important;
  stroke: currentColor !important;
  color: inherit !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
}

:deep(svg circle[fill="currentColor"]),
:deep(svg path[fill="currentColor"]) {
  fill: currentColor !important;
  stroke: none !important;
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

  .modal-hero,
  .form-header,
  .dynamic-header,
  .dynamic-grid,
  .review-detail-grid {
    grid-template-columns: 1fr;
  }

  .step-card,
  .fee-card {
    width: 100%;
  }
}

@media (max-width: 900px) {
  .mega-dropdown {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    width: min(94vw, 760px);
  }

  .mega-grid {
    grid-template-columns: 1fr;
  }

  .user-menu-trigger {
    width: 100%;
    justify-content: center;
  }

  .user-dropdown {
    right: 50%;
    transform: translateX(50%);
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
  .success-summary,
  .application-type-grid,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-grid label {
    text-align: left;
  }

  .modal-actions,
  .confirm-actions,
  .logout-modal-actions,
  .settings-modal-actions {
    flex-direction: column;
  }

  .btn-back,
  .btn-cancel,
  .btn-proceed {
    width: 100%;
    margin-left: 0;
  }

  .upload-option,
  .confirmation-box {
    align-items: flex-start;
    flex-direction: column;
  }

  .upload-cta {
    width: 100%;
    max-width: none;
    text-align: center;
  }
}

@media (max-width: 640px) {
  .brand-text {
    font-size: 20px;
  }

  .selection-indicator,
  .option-chevron,
  .mega-arrow {
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

  .settings-option-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .switch {
    align-self: flex-end;
  }
}
</style>
