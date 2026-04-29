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
            <span class="brand-text">VEHICLE</span>
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
            class="nav-item dashboard-active dashboard-trigger active"
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
              <span>Active module: VEHICLE</span>
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
        <button type="button" class="breadcrumb-item" @click="goToDashboard">
          Dashboard
        </button>
        <span class="breadcrumb-separator">/</span>
        <button type="button" class="breadcrumb-item current">
          Vehicle Application
        </button>
      </nav>

      <section class="vehicle-modal">
        <div class="modal-top-strip"></div>

        <div class="progress-track" aria-label="Vehicle application progress">
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
                Motor Vehicle Services
              </div>

              <h1>Create Vehicle Application</h1>

              <p class="client-id">
                Client Profile <span>|</span> ID: {{ clientId }}
              </p>

              <p class="instruction">
                Select the motor vehicle linked to your LTMS account.
              </p>
            </div>

            <div class="step-card">
              <span>Step 1 of 4</span>
              <strong>Select Vehicle</strong>
            </div>
          </div>

          <div class="vehicle-select-panel">
            <label class="field-label">Motor Vehicle</label>

            <button
              type="button"
              class="vehicle-dropdown-trigger"
              @click="showVehiclePicker = true"
            >
              <div class="vehicle-trigger-copy">
                <span>{{ selectedVehicle.plateNo }}</span>
                <strong
                  >{{ selectedVehicle.make }}
                  {{ selectedVehicle.model }}</strong
                >
                <small>{{ selectedVehicle.mvFileNo }}</small>
              </div>

              <svg viewBox="0 0 24 24">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <div class="vehicle-card">
              <div class="vehicle-card-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M5.25 13.5l1.45-4.18A2.75 2.75 0 0 1 9.3 7.5h5.4a2.75 2.75 0 0 1 2.6 1.82l1.45 4.18"
                  />
                  <path
                    d="M4.75 13.5h14.5A1.75 1.75 0 0 1 21 15.25v2.25a1.25 1.25 0 0 1-1.25 1.25H4.25A1.25 1.25 0 0 1 3 17.5v-2.25a1.75 1.75 0 0 1 1.75-1.75Z"
                  />
                  <circle
                    cx="7.5"
                    cy="15.8"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                  <circle
                    cx="16.5"
                    cy="15.8"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </div>

              <div class="vehicle-card-copy">
                <div class="vehicle-card-top">
                  <strong>{{ selectedVehicle.plateNo }}</strong>
                  <span class="status-chip">Linked Vehicle</span>
                </div>
                <p>
                  {{ selectedVehicle.year }} {{ selectedVehicle.make }}
                  {{ selectedVehicle.model }} ·
                  {{ selectedVehicle.classification }}
                </p>
                <small>
                  Registration valid until {{ selectedVehicle.validUntil }}
                </small>
              </div>
            </div>
          </div>
        </template>

        <!-- STEP 2 -->
        <template v-else-if="currentStep === 2">
          <div class="form-header">
            <div class="form-title">
              <span class="form-title-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M7 3.75h10A2.25 2.25 0 0 1 19.25 6v14.25l-2.35-1.4-2.35 1.4-2.35-1.4-2.35 1.4-2.35-1.4-2.35 1.4V6A2.25 2.25 0 0 1 7 3.75Z"
                  />
                  <path d="M8.5 8h7" />
                  <path d="M8.5 11.5h7" />
                  <path d="M8.5 15h4.5" />
                </svg>
              </span>

              <div>
                <h1>Select Vehicle Application Type</h1>
                <p>
                  Choose the transaction you want to apply for this vehicle.
                </p>
              </div>
            </div>

            <div class="step-card compact">
              <span>Step 2 of 4</span>
              <strong>Application Type</strong>
            </div>
          </div>

          <div class="notice-card">
            Select one application type applicable to your vehicle transaction.
          </div>

          <div class="application-type-grid">
            <button
              v-for="type in vehicleApplicationTypes"
              :key="type.value"
              type="button"
              class="application-type"
              :class="{ selected: selectedApplicationType === type.value }"
              @click="selectApplicationType(type.value)"
            >
              <span
                class="application-check application-radio"
                aria-hidden="true"
              >
                <svg
                  v-if="selectedApplicationType === type.value"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12.5l4.2 4.2L19 7" />
                </svg>
              </span>

              <span class="application-type-label">{{ type.label }}</span>
              <strong>{{ type.description }}</strong>
            </button>
          </div>
        </template>

        <!-- STEP 3 -->
        <template v-else-if="currentStep === 3">
          <div class="form-header">
            <div class="form-title">
              <span class="form-title-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M7.5 4.25h7l4 4v11.5H7.5A2.5 2.5 0 0 1 5 17.25V6.75a2.5 2.5 0 0 1 2.5-2.5Z"
                  />
                  <path d="M14.5 4.25v4h4" />
                  <path d="M8.5 12h7" />
                  <path d="M8.5 15.5h5" />
                </svg>
              </span>

              <div>
                <h1>Vehicle Details & Documents</h1>
                <p>
                  Review your linked vehicle information and upload supporting
                  documents.
                </p>
              </div>
            </div>

            <div class="step-card compact">
              <span>Step 3 of 4</span>
              <strong>Details & Documents</strong>
            </div>
          </div>

          <div class="details-grid">
            <div class="detail-card">
              <span>Plate Number</span>
              <strong>{{ selectedVehicle.plateNo }}</strong>
            </div>

            <div class="detail-card">
              <span>MV File Number</span>
              <strong>{{ selectedVehicle.mvFileNo }}</strong>
            </div>

            <div class="detail-card">
              <span>Engine Number</span>
              <strong>{{ selectedVehicle.engineNo }}</strong>
            </div>

            <div class="detail-card">
              <span>Chassis Number</span>
              <strong>{{ selectedVehicle.chassisNo }}</strong>
            </div>

            <div class="detail-card">
              <span>Classification</span>
              <strong>{{ selectedVehicle.classification }}</strong>
            </div>

            <div class="detail-card">
              <span>Registration Validity</span>
              <strong>{{ selectedVehicle.validUntil }}</strong>
            </div>
          </div>

          <div class="document-section">
            <h2>Supporting Documents</h2>
            <p>
              Upload available documents for faster processing. You may also
              continue without uploads for this prototype.
            </p>

            <div class="document-upload-grid">
              <label
                v-for="document in requiredDocuments"
                :key="document.value"
                class="upload-card"
              >
                <span class="upload-card-icon">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M8 3.75h6.25L19.25 8.75V19A1.75 1.75 0 0 1 17.5 20.75H8A2.75 2.75 0 0 1 5.25 18V6.5A2.75 2.75 0 0 1 8 3.75Z"
                    />
                    <path d="M14.25 3.75v5h5" />
                    <path d="M12 16.25v-5" />
                    <path d="M9.75 13.5L12 11.25l2.25 2.25" />
                  </svg>
                </span>

                <span class="upload-card-copy">
                  <strong>{{ document.label }}</strong>
                  <small>{{
                    uploadedDocuments[document.value] || "Click to upload file"
                  }}</small>
                </span>

                <input
                  type="file"
                  class="file-input"
                  @change="handleDocumentUpload($event, document.value)"
                />
              </label>
            </div>
          </div>
        </template>

        <!-- STEP 4 -->
        <template v-else>
          <div class="form-header">
            <div class="form-title">
              <span class="form-title-icon amber">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M12 3.75l8 3.5v5.8c0 4.65-3.25 7.75-8 9.2-4.75-1.45-8-4.55-8-9.2v-5.8l8-3.5Z"
                  />
                  <path d="M8.7 12.5l2.2 2.2 4.7-5.1" />
                </svg>
              </span>

              <div>
                <h1>Review Vehicle Application</h1>
                <p>Confirm the transaction details before submitting.</p>
              </div>
            </div>

            <div class="step-card compact">
              <span>Step 4 of 4</span>
              <strong>Review & Submit</strong>
            </div>
          </div>

          <div class="review-panel">
            <div class="review-summary">
              <div class="summary-card">
                <span>Vehicle</span>
                <strong
                  >{{ selectedVehicle.plateNo }} · {{ selectedVehicle.make }}
                  {{ selectedVehicle.model }}</strong
                >
              </div>

              <div class="summary-card">
                <span>Application Type(s)</span>
                <strong>{{
                  selectedApplicationLabels || "No application type selected"
                }}</strong>
              </div>

              <div class="summary-card">
                <span>Registration Validity</span>
                <strong>{{ selectedVehicle.validUntil }}</strong>
              </div>

              <div class="summary-card">
                <span>Uploaded Documents</span>
                <strong>{{ uploadedDocumentCount }} file(s)</strong>
              </div>
            </div>

            <div class="confirmation-box">
              <div class="confirmation-icon">
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
                  I confirm that the selected vehicle, application type, and
                  uploaded documents are accurate and ready for LTO processing.
                </p>

                <label class="declaration-check">
                  <input type="checkbox" v-model="isConfirmed" />
                  <span
                    >I have reviewed and confirm the vehicle application
                    details.</span
                  >
                </label>
              </div>
            </div>
          </div>
        </template>

        <div v-if="validationMessage" class="validation-message">
          {{ validationMessage }}
        </div>

        <div class="modal-actions">
          <button
            v-if="currentStep > 1 && currentStep < 5"
            class="btn-back"
            type="button"
            @click="handleBack"
          >
            Back
          </button>

          <button
            class="btn-cancel"
            type="button"
            @click="showCancelConfirm = true"
          >
            Cancel Application
          </button>

          <button class="btn-proceed" type="button" @click="handleProceed">
            {{ currentStep === 4 ? "Submit Application" : "Next" }}
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
      <div class="footer-right">✦</div>
    </footer>

    <!-- Vehicle picker -->
    <div
      v-if="showVehiclePicker"
      class="dialog-overlay"
      @click.self="showVehiclePicker = false"
    >
      <div class="vehicle-picker-dialog">
        <div class="dialog-header">
          <div>
            <span class="dialog-kicker">Search Dialog</span>
            <h2>Select Motor Vehicle</h2>
          </div>

          <button
            type="button"
            class="dialog-close"
            @click="showVehiclePicker = false"
          >
            ×
          </button>
        </div>

        <div class="search-row">
          <input
            v-model="vehicleSearch"
            type="text"
            placeholder="Search plate, make, model, or MV file number"
          />
          <button type="button">Search</button>
        </div>

        <button
          v-for="vehicle in filteredVehicles"
          :key="vehicle.plateNo"
          type="button"
          class="vehicle-result"
          @click="selectVehicle(vehicle)"
        >
          <span class="vehicle-result-icon">
            <svg viewBox="0 0 24 24">
              <path
                d="M5.25 13.5l1.45-4.18A2.75 2.75 0 0 1 9.3 7.5h5.4a2.75 2.75 0 0 1 2.6 1.82l1.45 4.18"
              />
              <path
                d="M4.75 13.5h14.5A1.75 1.75 0 0 1 21 15.25v2.25a1.25 1.25 0 0 1-1.25 1.25H4.25A1.25 1.25 0 0 1 3 17.5v-2.25a1.75 1.75 0 0 1 1.75-1.75Z"
              />
            </svg>
          </span>

          <span class="vehicle-result-copy">
            <strong>{{ vehicle.plateNo }}</strong>
            <small
              >{{ vehicle.year }} {{ vehicle.make }} {{ vehicle.model }} ·
              {{ vehicle.mvFileNo }}</small
            >
          </span>
        </button>
      </div>
    </div>

    <!-- Confirm dialogs -->
    <div v-if="showCancelConfirm || showSubmitConfirm" class="confirm-overlay">
      <div class="confirm-dialog">
        <div
          class="confirm-dialog-icon"
          :class="{ danger: showCancelConfirm, submit: showSubmitConfirm }"
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
            showCancelConfirm
              ? "Cancel application?"
              : "Submit vehicle application?"
          }}
        </h2>

        <p>
          {{
            showCancelConfirm
              ? "This will cancel your current vehicle application and return you to the dashboard."
              : "Please confirm that all vehicle application information is correct before submission."
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

    <!-- Success state -->
    <div v-if="showSuccessModal" class="confirm-overlay">
      <div class="success-dialog">
        <div class="success-icon">
          <svg viewBox="0 0 24 24">
            <path d="M5 12.5l4.2 4.2L19 7" />
            <path d="M21 12a9 9 0 1 1-3.4-7.05" />
          </svg>
        </div>

        <h2>Vehicle Application Submitted</h2>
        <p>
          Your vehicle transaction has been prepared successfully. Keep your
          reference number for tracking.
        </p>

        <div class="reference-card">
          <span>Reference Number</span>
          <strong>{{ referenceNumber }}</strong>
        </div>

        <button
          type="button"
          class="btn-proceed success-btn"
          @click="goToDashboard"
        >
          Return to Dashboard
        </button>
      </div>
    </div>

    <!-- Settings modal -->
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

    <!-- Logout modal -->
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

type Vehicle = {
  plateNo: string;
  mvFileNo: string;
  make: string;
  model: string;
  year: string;
  classification: string;
  engineNo: string;
  chassisNo: string;
  validUntil: string;
};

const clientId = "26-050525-2424960";

const router = useRouter();
const { settings: accessibilitySettings } = useAccessibility();

const currentStep = ref(1);
const selectedApplicationType = ref("renewal");
const validationMessage = ref("");
const isConfirmed = ref(false);
const isPageLoading = ref(false);
const showUserMenu = ref(false);
const showDashboardMenu = ref(false);
const showVehiclePicker = ref(false);
const showCancelConfirm = ref(false);
const showSubmitConfirm = ref(false);
const showSuccessModal = ref(false);
const showSettingsModal = ref(false);
const showLogoutModal = ref(false);
const vehicleSearch = ref("");

const userMenuRef = ref<HTMLElement | null>(null);
const dashboardMenuRef = ref<HTMLElement | null>(null);

const linkedVehicles = ref<Vehicle[]>([
  {
    plateNo: "NAB 4827",
    mvFileNo: "1301-00000098765",
    make: "Toyota",
    model: "Vios 1.3 XLE",
    year: "2021",
    classification: "Private Passenger Car",
    engineNo: "2NRX987654",
    chassisNo: "MR053HYX100987654",
    validUntil: "May 2026",
  },
  {
    plateNo: "DCA 9142",
    mvFileNo: "1301-00000076421",
    make: "Honda",
    model: "Click 125i",
    year: "2022",
    classification: "Private Motorcycle",
    engineNo: "JM31E876543",
    chassisNo: "PHMC125202276421",
    validUntil: "September 2026",
  },
]);

const selectedVehicle = ref<Vehicle>(linkedVehicles.value[0]);

const steps = [
  { number: 1, label: "Vehicle" },
  { number: 2, label: "Type" },
  { number: 3, label: "Details" },
  { number: 4, label: "Documents" },
];

const vehicleApplicationTypes = [
  {
    value: "renewal",
    label: "Registration Renewal",
    description: "Renew the existing vehicle registration validity.",
  },
  {
    value: "duplicate_cr",
    label: "Duplicate Certificate of Registration",
    description: "Request replacement copy of registration record.",
  },
  {
    value: "duplicate_or",
    label: "Duplicate Official Receipt",
    description: "Request replacement copy of payment receipt.",
  },
  {
    value: "change_classification",
    label: "Change Classification",
    description: "Update vehicle use or registration classification.",
  },
  {
    value: "transfer_ownership",
    label: "Transfer of Ownership",
    description: "Process ownership transfer for registered vehicle.",
  },
  {
    value: "revision_records",
    label: "Revision of Records",
    description: "Correct or update motor vehicle registration details.",
  },
];

const requiredDocuments = [
  { value: "orcr", label: "Official Receipt / Certificate of Registration" },
  { value: "insurance", label: "Certificate of Cover / Insurance" },
  { value: "inspection", label: "Inspection Report" },
];

const uploadedDocuments = ref<Record<string, string>>({});

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

const selectedApplicationLabels = computed(() => {
  return (
    vehicleApplicationTypes.find(
      (type) => type.value === selectedApplicationType.value,
    )?.label || ""
  );
});

const uploadedDocumentCount = computed(
  () => Object.values(uploadedDocuments.value).filter(Boolean).length,
);

const filteredVehicles = computed(() => {
  const query = vehicleSearch.value.trim().toLowerCase();

  if (!query) return linkedVehicles.value;

  return linkedVehicles.value.filter((vehicle) => {
    return [
      vehicle.plateNo,
      vehicle.mvFileNo,
      vehicle.make,
      vehicle.model,
      vehicle.classification,
    ]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
});

const referenceNumber = computed(() => {
  return `LTO-MV-${selectedVehicle.value.plateNo.replaceAll(" ", "")}-${new Date().getFullYear()}`;
});

const delay = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

const beginPageLoading = async () => {
  if (isPageLoading.value) return false;
  isPageLoading.value = true;
  closeFloatingMenus();
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

const isRouteActive = (route: string) =>
  router.currentRoute.value.path === route;

const goToDashboard = () => navigateTo("/home");
const goToELearning = () => navigateTo("/e-learning");
const goToProfile = () => navigateTo("/profile");
const goToDashboardItem = (route: string) => navigateTo(route);

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

const selectApplicationType = (value: string) => {
  validationMessage.value = "";
  selectedApplicationType.value = value;
};

const selectVehicle = (vehicle: Vehicle) => {
  selectedVehicle.value = vehicle;
  showVehiclePicker.value = false;
};

const handleDocumentUpload = (event: Event, key: string) => {
  const input = event.target as HTMLInputElement;
  uploadedDocuments.value = {
    ...uploadedDocuments.value,
    [key]: input.files?.[0]?.name || "",
  };
};

const handleProceed = () => {
  validationMessage.value = "";

  if (currentStep.value === 1) {
    currentStep.value = 2;
    return;
  }

  if (currentStep.value === 2) {
    if (!selectedApplicationType.value) {
      validationMessage.value =
        "Please select one vehicle application type before proceeding.";
      return;
    }

    currentStep.value = 3;
    return;
  }

  if (currentStep.value === 3) {
    currentStep.value = 4;
    return;
  }

  if (currentStep.value === 4) {
    if (!isConfirmed.value) {
      validationMessage.value =
        "Please confirm that you have reviewed the vehicle application details.";
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
  await navigateTo("/home");
};

const confirmSubmit = () => {
  closeConfirmDialogs();
  showSuccessModal.value = true;
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

/* TOPBAR */

.topbar {
  min-height: 72px;
  background: linear-gradient(180deg, #0d468f 0%, #0b3d82 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  box-shadow: 0 8px 18px rgba(10, 46, 99, 0.18);
  z-index: 20;
}

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
  background: transparent;
  border: none;
  box-shadow: none;
}

.brand-text {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.3px;
  color: #fff;
}

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
  background: transparent;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
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
  background: linear-gradient(135deg, #2563eb 0%, #0f3d87 100%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 14px 26px rgba(29, 78, 216, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.28);
}

.mega-item:first-child .mega-icon {
  background: linear-gradient(135deg, #64748b, #1e293b);
}

:deep(.mega-icon svg) {
  width: 27px;
  height: 27px;
  display: block;
  fill: none !important;
  stroke: currentColor !important;
  stroke-width: 1.85;
  stroke-linecap: round;
  stroke-linejoin: round;
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

/* User menu */

.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 90;
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

/* Background */

.hero {
  flex: 1;
  position: relative;
  background:
    linear-gradient(rgba(244, 247, 251, 0.68), rgba(244, 247, 251, 0.82)),
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

.breadcrumb-bar {
  position: relative;
  z-index: 2;
  width: min(95%, 1120px);
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

.breadcrumb-item.current {
  color: #0f3d87;
  cursor: default;
}

.breadcrumb-separator {
  color: #94a3b8;
  font-weight: 900;
}

/* Modal */

.vehicle-modal {
  position: relative;
  z-index: 2;
  width: min(95%, 1120px);
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

/* Vehicle step */

.vehicle-select-panel {
  max-width: 620px;
  margin: 34px auto 26px;
}

.field-label {
  display: block;
  color: #0f172a;
  font-size: 13px;
  font-weight: 850;
  text-transform: uppercase;
  letter-spacing: 0.35px;
  margin-bottom: 9px;
}

.vehicle-dropdown-trigger {
  width: 100%;
  min-height: 70px;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  background: #ffffff;
  padding: 13px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  text-align: left;
  cursor: pointer;
}

.vehicle-dropdown-trigger svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: #0f3d87;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.vehicle-trigger-copy {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.vehicle-trigger-copy span {
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.vehicle-trigger-copy strong {
  color: #0f172a;
  font-size: 17px;
  font-weight: 900;
}

.vehicle-trigger-copy small {
  color: #0f3d87;
  font-size: 12px;
  font-weight: 800;
}

.vehicle-card {
  margin-top: 18px;
  display: flex;
  gap: 15px;
  align-items: center;
  border: 1px solid #dbeafe;
  background: linear-gradient(180deg, #eff6ff 0%, #ffffff 100%);
  border-radius: 18px;
  padding: 18px;
}

.vehicle-card-icon,
.vehicle-result-icon,
.form-title-icon,
.confirmation-icon,
.upload-card-icon,
.confirm-dialog-icon,
.success-icon {
  display: grid;
  place-items: center;
  color: #ffffff;
  background: linear-gradient(145deg, #2563eb 0%, #0f3d87 100%);
}

.vehicle-card-icon {
  width: 58px;
  height: 58px;
  flex: 0 0 58px;
  border-radius: 20px;
  box-shadow: 0 14px 26px rgba(29, 78, 216, 0.26);
}

.vehicle-card-icon svg,
.vehicle-result-icon svg,
.form-title-icon svg,
.confirmation-icon svg,
.upload-card-icon svg,
.confirm-dialog-icon svg,
.success-icon svg {
  width: 28px;
  height: 28px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.vehicle-card-icon circle,
.vehicle-card-icon path[fill="currentColor"] {
  fill: currentColor;
  stroke: none;
}

.vehicle-card-copy {
  flex: 1;
  min-width: 0;
}

.vehicle-card-top {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.vehicle-card-copy strong {
  color: #0f172a;
  font-size: 19px;
  font-weight: 950;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 9px;
  border-radius: 999px;
  background: #ecfdf5;
  color: #047857;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.35px;
}

.vehicle-card-copy p {
  margin: 0 0 5px;
  color: #475569;
  font-size: 14px;
  font-weight: 650;
}

.vehicle-card-copy small {
  color: #0f3d87;
  font-size: 12px;
  font-weight: 800;
}

/* Forms */

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
  padding: 11px;
}

.form-title-icon.amber {
  background: linear-gradient(145deg, #f59e0b 0%, #b45309 100%);
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

.notice-card {
  border: 1px solid #bfdbfe;
  background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
  color: #0f3d87;
  border-radius: 14px;
  padding: 15px 18px;
  font-size: 14px;
  font-weight: 750;
  text-align: center;
  margin: 22px 0;
}

.application-type-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.application-type {
  position: relative;
  min-height: 86px;
  border: 1px solid #dbe3ee;
  border-radius: 14px;
  background: #ffffff;
  padding: 15px 16px 15px 52px;
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
  fill: none;
  stroke: currentColor;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
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

/* Details and docs */

.details-grid,
.review-summary {
  margin-top: 22px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.detail-card,
.summary-card {
  border: 1px solid #dbe3ee;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  padding: 18px;
}

.detail-card span,
.summary-card span {
  display: block;
  color: #64748b;
  font-size: 12px;
  font-weight: 850;
  text-transform: uppercase;
  letter-spacing: 0.35px;
  margin-bottom: 8px;
}

.detail-card strong,
.summary-card strong {
  display: block;
  color: #0f172a;
  font-size: 15px;
  line-height: 1.35;
  font-weight: 900;
}

.document-section {
  margin-top: 18px;
  border: 1px solid #dbeafe;
  border-radius: 20px;
  background: linear-gradient(180deg, #eff6ff 0%, #ffffff 100%);
  padding: 20px;
}

.document-section h2 {
  margin: 0 0 6px;
  color: #0f172a;
  font-size: 19px;
  font-weight: 950;
}

.document-section p {
  margin: 0 0 16px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.45;
}

.document-upload-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.upload-card {
  min-height: 104px;
  border: 1px dashed #93c5fd;
  border-radius: 16px;
  background: #ffffff;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  cursor: pointer;
}

.upload-card-icon {
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: 14px;
}

.upload-card-icon svg {
  width: 24px;
  height: 24px;
}

.upload-card-copy {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.upload-card-copy strong {
  color: #0f172a;
  font-size: 13px;
  line-height: 1.3;
  font-weight: 900;
}

.upload-card-copy small {
  color: #64748b;
  font-size: 12px;
  line-height: 1.3;
  word-break: break-word;
}

.file-input {
  display: none;
}

/* Review */

.review-panel {
  padding-top: 0;
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
  background: linear-gradient(145deg, #f59e0b 0%, #b45309 100%);
  padding: 11px;
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

/* Actions */

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

/* Dialogs */

.dialog-overlay,
.confirm-overlay,
.settings-modal-overlay,
.logout-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1300;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(8px);
}

.vehicle-picker-dialog,
.confirm-dialog,
.success-dialog,
.settings-modal-card,
.logout-modal-card {
  width: min(100%, 560px);
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 24px;
  box-shadow: 0 30px 70px rgba(15, 23, 42, 0.28);
  padding: 26px;
}

.vehicle-picker-dialog {
  width: min(100%, 620px);
}

.dialog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.dialog-kicker {
  display: inline-block;
  color: #1d4ed8;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.dialog-header h2 {
  margin: 0;
  color: #0f172a;
  font-size: 23px;
  font-weight: 950;
}

.dialog-close {
  width: 38px;
  height: 38px;
  border: 1px solid #dbe5f3;
  border-radius: 50%;
  background: #ffffff;
  color: #0f3d87;
  font-size: 22px;
  cursor: pointer;
}

.search-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  margin-bottom: 14px;
}

.search-row input {
  min-height: 42px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 0 12px;
  font-size: 14px;
}

.search-row button {
  border: none;
  border-radius: 12px;
  background: #1d4ed8;
  color: #ffffff;
  padding: 0 16px;
  font-weight: 900;
  cursor: pointer;
}

.vehicle-result {
  width: 100%;
  display: flex;
  gap: 12px;
  align-items: center;
  border: 1px solid #dbe3ee;
  border-radius: 16px;
  background: #ffffff;
  padding: 13px;
  cursor: pointer;
  text-align: left;
}

.vehicle-result + .vehicle-result {
  margin-top: 10px;
}

.vehicle-result:hover {
  background: #f4f8ff;
}

.vehicle-result-icon {
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  border-radius: 15px;
}

.vehicle-result-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vehicle-result-copy strong {
  color: #0f172a;
  font-size: 16px;
  font-weight: 950;
}

.vehicle-result-copy small {
  color: #64748b;
  font-size: 13px;
}

.confirm-dialog,
.success-dialog,
.logout-modal-card {
  width: min(100%, 460px);
  text-align: center;
}

.confirm-dialog-icon,
.success-icon {
  width: 62px;
  height: 62px;
  margin: 0 auto 14px;
  border-radius: 20px;
  padding: 15px;
}

.confirm-dialog-icon.danger {
  color: #b42318;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.confirm-dialog-icon.submit,
.success-icon {
  color: #ffffff;
  background: linear-gradient(145deg, #10b981 0%, #047857 100%);
  border: none;
}

.confirm-dialog h2,
.success-dialog h2,
.logout-modal-copy h3 {
  margin: 0;
  color: #0f172a;
  font-size: 22px;
  font-weight: 950;
}

.confirm-dialog p,
.success-dialog p,
.logout-modal-copy p {
  margin: 10px 0 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
}

.confirm-actions,
.logout-modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 22px;
}

.btn-dialog-secondary,
.btn-dialog-primary,
.logout-cancel-btn,
.logout-confirm-btn,
.settings-done-btn {
  flex: 1;
  min-height: 44px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 850;
  cursor: pointer;
}

.btn-dialog-secondary,
.logout-cancel-btn {
  background: #ffffff;
  color: #334155;
  border: 1px solid #cbd5e1;
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

.reference-card {
  margin: 18px 0;
  border: 1px solid #bbf7d0;
  background: #ecfdf5;
  border-radius: 18px;
  padding: 16px;
}

.reference-card span {
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
  font-size: 18px;
  font-weight: 950;
}

.success-btn {
  width: 100%;
  margin-left: 0;
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

/* Settings */

.settings-modal-card {
  width: min(560px, 100%);
  padding: 0;
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

/* Footer */

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

/* Responsive */

@media (max-width: 1100px) {
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
  .form-header {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: stretch;
  }

  .step-card {
    width: 100%;
  }

  .details-grid,
  .review-summary,
  .document-upload-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .mega-dropdown {
    right: 50%;
    transform: translateX(50%);
    width: min(94vw, 760px);
  }

  .mega-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .hero {
    padding: 26px 14px 24px;
  }

  .seal-watermark {
    width: 220px;
    left: 10px;
    top: 70px;
  }

  .vehicle-modal {
    width: min(96%, 760px);
    padding: 0 18px 18px;
    border-radius: 18px;
  }

  .modal-top-strip {
    margin: 0 -18px;
  }

  .progress-track,
  .application-type-grid,
  .details-grid,
  .review-summary,
  .document-upload-grid {
    grid-template-columns: 1fr;
  }

  .modal-hero h1,
  .form-title h1 {
    font-size: 22px;
  }

  .vehicle-card,
  .confirmation-box {
    flex-direction: column;
    align-items: flex-start;
  }

  .modal-actions,
  .confirm-actions,
  .logout-modal-actions {
    flex-direction: column;
  }

  .btn-back,
  .btn-cancel,
  .btn-proceed,
  .btn-dialog-secondary,
  .btn-dialog-primary,
  .logout-cancel-btn,
  .logout-confirm-btn {
    width: 100%;
    margin-left: 0;
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

  .settings-option-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .switch {
    align-self: flex-end;
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

/* SINGLE-SELECTION VEHICLE TYPE FIX */

.application-radio {
  border-radius: 50% !important;
}

.application-type.selected .application-radio {
  background: #1d4ed8 !important;
  border-color: #1d4ed8 !important;
  box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.12);
}

.application-radio svg {
  width: 14px !important;
  height: 14px !important;
}
</style>
