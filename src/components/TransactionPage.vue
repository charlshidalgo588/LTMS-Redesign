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
            <span class="brand-text">TRANSACTIONS</span>
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

      <section class="transactions-modal">
        <div class="modal-top-strip"></div>

        <div class="transaction-header">
          <div class="transaction-title-wrap">
            <span class="transaction-title-icon" aria-hidden="true">
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
              <h1>Transaction Overview</h1>
              <p>
                Track open applications, completed requests, and payment
                activity.
              </p>
            </div>
          </div>

          <div class="client-pill">
            <span>Client ID</span>
            <strong>{{ clientId }}</strong>
          </div>
        </div>

        <div class="transaction-summary-grid" aria-label="Transaction summary">
          <div class="summary-tile blue">
            <span>Open Transactions</span>
            <strong>{{ openTransactions.length }}</strong>
            <small>Active requests requiring action or review</small>
          </div>

          <div class="summary-tile green">
            <span>Closed Transactions</span>
            <strong>{{ closedTransactions.length }}</strong>
            <small>Completed or archived transaction records</small>
          </div>

          <div class="summary-tile amber">
            <span>Pending Payment</span>
            <strong>{{ pendingPaymentCount }}</strong>
            <small>Transactions waiting for payment confirmation</small>
          </div>
        </div>

        <div class="transaction-tabs">
          <button
            type="button"
            :class="{ active: activeTab === 'open' }"
            @click="setTab('open')"
          >
            Open
          </button>

          <button
            type="button"
            :class="{ active: activeTab === 'closed' }"
            @click="setTab('closed')"
          >
            Closed
          </button>
        </div>

        <div class="transaction-toolbar">
          <div class="search-field">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.25" />
              <path d="M16 16l4 4" />
            </svg>
            <input
              v-model.trim="searchTerm"
              type="search"
              placeholder="Search by reference number, service, or status"
            />
          </div>

          <select
            v-model="serviceFilter"
            class="filter-select"
            aria-label="Filter by service"
          >
            <option value="all">All Services</option>
            <option value="Licensing">Licensing</option>
            <option value="Vehicle">Vehicle</option>
            <option value="Documents">Documents</option>
            <option value="Violations">Violations</option>
          </select>
        </div>

        <div class="transaction-content">
          <div v-if="filteredTransactions.length === 0" class="empty-state">
            <div class="empty-icon" aria-hidden="true"></div>
            <p>NO TRANSACTIONS FOUND</p>
          </div>

          <div v-else class="transaction-list">
            <article
              v-for="transaction in filteredTransactions"
              :key="transaction.id"
              class="transaction-row"
            >
              <div class="transaction-row-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M7 3.75h10A2.25 2.25 0 0 1 19.25 6v14.25l-2.35-1.4-2.35 1.4-2.35-1.4-2.35 1.4-2.35-1.4-2.35 1.4V6A2.25 2.25 0 0 1 7 3.75Z"
                  />
                  <path d="M8.5 8h7" />
                  <path d="M8.5 11.5h7" />
                  <path d="M8.5 15h4.5" />
                </svg>
              </div>

              <div class="transaction-row-copy">
                <div class="transaction-row-head">
                  <strong>{{ transaction.title }}</strong>
                  <span class="status-chip" :class="transaction.statusClass">
                    {{ transaction.status }}
                  </span>
                </div>
                <span>{{ transaction.reference }}</span>
                <small>
                  {{ transaction.service }} • {{ transaction.date }} •
                  {{ transaction.amount }}
                </small>
              </div>

              <div class="transaction-row-actions">
                <button
                  type="button"
                  @click="openTransactionDetails(transaction)"
                >
                  View Details
                </button>
              </div>
            </article>
          </div>
        </div>

        <div class="transaction-footer">
          <button type="button" class="btn-back" @click="goToDashboard">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>

          <span>
            Showing {{ filteredTransactions.length }} transaction record(s)
          </span>
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

    <div
      v-if="selectedTransaction"
      class="details-overlay"
      @click.self="closeTransactionDetails"
    >
      <div class="details-card" role="dialog" aria-modal="true">
        <div class="details-header">
          <div>
            <span class="details-kicker">Transaction Details</span>
            <h2>{{ selectedTransaction.title }}</h2>
          </div>
          <button
            type="button"
            class="details-close"
            @click="closeTransactionDetails"
          >
            ×
          </button>
        </div>

        <div class="details-body">
          <div class="details-row">
            <span>Reference Number</span>
            <strong>{{ selectedTransaction.reference }}</strong>
          </div>
          <div class="details-row">
            <span>Service</span>
            <strong>{{ selectedTransaction.service }}</strong>
          </div>
          <div class="details-row">
            <span>Status</span>
            <strong>{{ selectedTransaction.status }}</strong>
          </div>
          <div class="details-row">
            <span>Date Filed</span>
            <strong>{{ selectedTransaction.date }}</strong>
          </div>
          <div class="details-row">
            <span>Amount</span>
            <strong>{{ selectedTransaction.amount }}</strong>
          </div>
          <div class="details-row">
            <span>Payment Method</span>
            <strong>{{ selectedTransaction.paymentMethod }}</strong>
          </div>
          <div class="details-row">
            <span>Remarks</span>
            <strong>{{ selectedTransaction.remarks }}</strong>
          </div>
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
              <span>
                Increase contrast to improve visibility of interface elements.
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

type TransactionStatus =
  | "Pending"
  | "For Payment"
  | "Processing"
  | "Completed"
  | "Cancelled";

type TransactionRecord = {
  id: number;
  title: string;
  reference: string;
  service: "Licensing" | "Vehicle" | "Documents" | "Violations";
  date: string;
  tab: "open" | "closed";
  status: TransactionStatus;
  statusClass: string;
  amount: string;
  paymentMethod: string;
  remarks: string;
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
const activeTab = ref<"open" | "closed">("open");
const searchTerm = ref("");
const serviceFilter = ref("all");
const selectedTransaction = ref<TransactionRecord | null>(null);

const transactions = ref<TransactionRecord[]>([
  {
    id: 1,
    title: "Driver's License Renewal",
    reference: "LTMS-260505252424960-2026-001",
    service: "Licensing",
    date: "May 02, 2026",
    tab: "open",
    status: "For Payment",
    statusClass: "for-payment",
    amount: "₱585.00",
    paymentMethod: "Pending Payment",
    remarks: "Proceed to payment to continue processing.",
  },
  {
    id: 2,
    title: "Motor Vehicle Registration Renewal",
    reference: "LTMS-260505252424960-2026-002",
    service: "Vehicle",
    date: "May 01, 2026",
    tab: "open",
    status: "Processing",
    statusClass: "processing",
    amount: "₱1,250.00",
    paymentMethod: "GCash",
    remarks: "Payment received. Registration is under review.",
  },
  {
    id: 3,
    title: "Revision of Driver Record",
    reference: "LTMS-260505252424960-2026-003",
    service: "Licensing",
    date: "April 28, 2026",
    tab: "open",
    status: "Pending",
    statusClass: "pending",
    amount: "₱100.00",
    paymentMethod: "Over-the-counter",
    remarks: "Awaiting document verification.",
  },
  {
    id: 4,
    title: "Electronic Official Receipt Request",
    reference: "LTMS-260505252424960-2026-004",
    service: "Documents",
    date: "April 24, 2026",
    tab: "closed",
    status: "Completed",
    statusClass: "completed",
    amount: "₱75.00",
    paymentMethod: "Maya",
    remarks: "Receipt has been generated successfully.",
  },
  {
    id: 5,
    title: "Traffic Violation Settlement",
    reference: "LTMS-260505252424960-2026-005",
    service: "Violations",
    date: "April 15, 2026",
    tab: "closed",
    status: "Completed",
    statusClass: "completed",
    amount: "₱1,000.00",
    paymentMethod: "GCash",
    remarks: "Violation payment has been settled.",
  },
  {
    id: 6,
    title: "Duplicate Driver's License Request",
    reference: "LTMS-260505252424960-2026-006",
    service: "Licensing",
    date: "March 30, 2026",
    tab: "closed",
    status: "Cancelled",
    statusClass: "cancelled",
    amount: "₱250.00",
    paymentMethod: "Not paid",
    remarks: "Request was cancelled by the client.",
  },
]);

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
  return item?.title || "TRANSACTIONS";
});

const breadcrumbItems = computed(() => [
  { label: "Dashboard", route: "/home" },
  { label: "Transactions", route: "/transactions" },
]);

const openTransactions = computed(() =>
  transactions.value.filter((transaction) => transaction.tab === "open"),
);

const closedTransactions = computed(() =>
  transactions.value.filter((transaction) => transaction.tab === "closed"),
);

const pendingPaymentCount = computed(
  () =>
    transactions.value.filter(
      (transaction) => transaction.status === "For Payment",
    ).length,
);

const filteredTransactions = computed(() => {
  const normalizedSearch = searchTerm.value.toLowerCase();

  return transactions.value.filter((transaction) => {
    const matchesTab = transaction.tab === activeTab.value;
    const matchesService =
      serviceFilter.value === "all" ||
      transaction.service === serviceFilter.value;
    const matchesSearch =
      !normalizedSearch ||
      transaction.title.toLowerCase().includes(normalizedSearch) ||
      transaction.reference.toLowerCase().includes(normalizedSearch) ||
      transaction.status.toLowerCase().includes(normalizedSearch) ||
      transaction.service.toLowerCase().includes(normalizedSearch) ||
      transaction.amount.toLowerCase().includes(normalizedSearch);

    return matchesTab && matchesService && matchesSearch;
  });
});

const setTab = (tab: "open" | "closed") => {
  activeTab.value = tab;
};

const openTransactionDetails = (transaction: TransactionRecord) => {
  selectedTransaction.value = transaction;
};

const closeTransactionDetails = () => {
  selectedTransaction.value = null;
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

.topbar {
  min-height: 72px;
  height: auto;
  background: linear-gradient(180deg, #0d468f 0%, #0b3d82 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  box-shadow: 0 8px 18px rgba(10, 46, 99, 0.18);
  z-index: 5;
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

.brand-logo {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  background: transparent;
  border: none;
  box-shadow: none;
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
  display: flex;
  gap: 22px;
  align-items: center;
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

.hero {
  flex: 1;
  position: relative;
  background:
    linear-gradient(rgba(244, 247, 251, 0.76), rgba(244, 247, 251, 0.88)),
    url("../assets/BGC.jpg") center/cover no-repeat;
  display: flex;
  flex-direction: column !important;
  justify-content: flex-start !important;
  align-items: center !important;
  gap: 0 !important;
  padding: 42px 24px 30px;
  overflow-x: hidden !important;
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
  width: min(95%, 1120px) !important;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 14px;
  padding: 0 4px;
  flex: 0 0 auto !important;
  align-self: center !important;
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

.transactions-modal {
  position: relative;
  z-index: 2;
  width: min(95%, 1120px) !important;
  max-width: 1120px;
  flex: 0 0 auto !important;
  align-self: center !important;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  border: 1px solid rgba(148, 163, 184, 0.42);
  border-radius: 24px;
  box-shadow:
    0 28px 70px rgba(15, 23, 42, 0.18),
    0 10px 24px rgba(15, 23, 42, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  padding: 0;
  overflow: hidden;
}

.modal-top-strip {
  height: 7px;
  background: linear-gradient(90deg, #0a3779 0%, #1d4ed8 52%, #93c5fd 100%);
}

.transaction-header {
  min-height: 84px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.95);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 22px 32px;
}

.transaction-title-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
}

.transaction-title-icon {
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  border-radius: 15px;
  color: #0f3d87;
  background: linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bfdbfe;
  padding: 11px;
}

.transaction-title-icon svg {
  width: 100%;
  height: 100%;
  display: block;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.transaction-header h1 {
  margin: 0;
  color: #0b1220;
  font-size: 25px;
  font-weight: 900;
  letter-spacing: -0.35px;
}

.transaction-header p {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.client-pill {
  min-width: 210px;
  border: 1px solid #dbeafe;
  background: linear-gradient(180deg, #f8fbff 0%, #eff6ff 100%);
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
}

.client-pill span {
  color: #2563eb;
  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0.45px;
  text-transform: uppercase;
}

.client-pill strong {
  color: #0f172a;
  font-size: 15px;
  line-height: 1.25;
  font-weight: 900;
}

.transaction-summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  padding: 22px 32px 0;
}

.summary-tile {
  min-height: 118px;
  border: 1px solid #dbe3ee;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  padding: 18px;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.04);
}

.summary-tile span {
  display: block;
  color: #475569;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.summary-tile strong {
  display: block;
  margin-top: 8px;
  color: #0f172a;
  font-size: 30px;
  line-height: 1;
  font-weight: 950;
}

.summary-tile small {
  display: block;
  margin-top: 9px;
  color: #64748b;
  font-size: 12.5px;
  line-height: 1.4;
  font-weight: 650;
}

.summary-tile.blue {
  border-color: #bfdbfe;
  background: linear-gradient(180deg, #eff6ff 0%, #ffffff 100%);
}

.summary-tile.blue strong {
  color: #0645ad;
}

.summary-tile.green {
  border-color: #bbf7d0;
  background: linear-gradient(180deg, #ecfdf5 0%, #ffffff 100%);
}

.summary-tile.green strong {
  color: #047857;
}

.summary-tile.amber {
  border-color: #fde68a;
  background: linear-gradient(180deg, #fffbeb 0%, #ffffff 100%);
}

.summary-tile.amber strong {
  color: #b45309;
}

.transaction-tabs {
  display: flex;
  align-items: center;
  padding: 28px 32px 0;
}

.transaction-tabs button {
  min-width: 95px;
  min-height: 44px;
  border: 1px solid #d6d6d6;
  background: #fafafa;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.transaction-tabs button.active {
  background: #0645ad;
  border-color: #0645ad;
  color: #ffffff;
  font-weight: 800;
}

.transaction-toolbar {
  display: grid;
  grid-template-columns: 1fr 210px;
  gap: 12px;
  padding: 16px 32px 0;
}

.search-field {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #dbe3ee;
  border-radius: 12px;
  background: #ffffff;
  padding: 0 14px;
}

.search-field svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: #64748b;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.search-field input {
  width: 100%;
  border: none;
  outline: none;
  color: #0f172a;
  font-size: 14px;
  font-weight: 650;
}

.search-field input::placeholder {
  color: #94a3b8;
}

.filter-select {
  min-height: 44px;
  border: 1px solid #dbe3ee;
  border-radius: 12px;
  background: #ffffff;
  color: #0f172a;
  padding: 0 12px;
  font-size: 13px;
  font-weight: 800;
  outline: none;
}

.transaction-content {
  min-height: 260px;
  padding: 22px 32px 28px;
  display: grid;
  place-items: center;
}

.empty-state {
  text-align: center;
  color: #444;
  transform: translateY(-2px);
}

.empty-state p {
  margin: 14px 0 0;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.empty-icon {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  border: 3px solid #cfcfcf;
  border-radius: 50%;
  position: relative;
}

.empty-icon::after {
  content: "";
  position: absolute;
  width: 28px;
  height: 3px;
  background: #cfcfcf;
  right: -23px;
  bottom: -9px;
  transform: rotate(45deg);
  transform-origin: left center;
}

.transaction-list {
  width: 100%;
  display: grid;
  gap: 12px;
}

.transaction-row {
  width: 100%;
  display: grid;
  grid-template-columns: 52px 1fr auto;
  gap: 14px;
  align-items: center;
  border: 1px solid #dbe3ee;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  padding: 15px;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.transaction-row:hover {
  transform: translateY(-1px);
  border-color: #93c5fd;
  box-shadow: 0 14px 26px rgba(37, 99, 235, 0.08);
}

.transaction-row-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb 0%, #0f3d87 100%);
  padding: 12px;
}

.transaction-row-icon svg {
  width: 100%;
  height: 100%;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.transaction-row-copy {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.transaction-row-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.transaction-row-copy strong {
  color: #0f172a;
  font-size: 15px;
  line-height: 1.2;
  font-weight: 950;
}

.transaction-row-copy span,
.transaction-row-copy small {
  color: #64748b;
  font-size: 12.5px;
  font-weight: 650;
}

.status-chip {
  display: inline-flex !important;
  align-items: center;
  min-height: 22px;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 11px !important;
  line-height: 1 !important;
  font-weight: 900 !important;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.status-chip.pending {
  background: #eff6ff;
  color: #1d4ed8;
}

.status-chip.for-payment {
  background: #fffbeb;
  color: #b45309;
}

.status-chip.processing {
  background: #f0f9ff;
  color: #0369a1;
}

.status-chip.completed {
  background: #ecfdf5;
  color: #047857;
}

.status-chip.cancelled {
  background: #fef2f2;
  color: #b42318;
}

.transaction-row-actions button {
  min-height: 38px;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  background: #eff6ff;
  color: #0f3d87;
  padding: 0 14px;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
}

.transaction-row-actions button:hover {
  background: #dbeafe;
}

.transaction-footer {
  min-height: 91px;
  border-top: 1px solid #e1e1e1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 25px;
}

.transaction-footer span {
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.btn-back {
  width: 72px;
  height: 37px;
  border: 1px solid #d5d5d5;
  background: #fafafa;
  color: #444;
  cursor: pointer;
  display: grid;
  place-items: center;
}

.btn-back svg {
  width: 28px;
  height: 28px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.btn-back:hover {
  background: #f1f5f9;
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

.mega-dropdown {
  position: absolute;
  top: calc(100% + 16px);
  right: 0;
  width: min(760px, 92vw);
  max-width: calc(100vw - 32px) !important;
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
  color: #ffffff !important;
  background: linear-gradient(135deg, #2563eb 0%, #0f3d87 100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  box-shadow:
    0 14px 26px rgba(29, 78, 216, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.28);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    filter 0.25s ease;
}

.mega-item:first-child .mega-icon {
  color: #ffffff !important;
  background: linear-gradient(135deg, #64748b 0%, #1e293b 100%) !important;
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

.details-overlay,
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

.details-card,
.logout-modal-card,
.settings-modal-card {
  width: min(560px, 100%);
  border-radius: 24px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dbe5f3;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.18);
}

.details-card {
  overflow: hidden;
}

.details-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid #e5edf7;
}

.details-kicker,
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

.details-header h2 {
  margin: 0;
  color: #1f2937;
  font-size: 24px;
  line-height: 1.15;
}

.details-close,
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

.details-body {
  padding: 22px 24px 24px;
  display: grid;
  gap: 12px;
}

.details-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border: 1px solid #e5edf7;
  border-radius: 14px;
  background: #ffffff;
  padding: 14px 16px;
}

.details-row span {
  color: #64748b;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.details-row strong {
  color: #0f172a;
  font-size: 14px;
  font-weight: 900;
  text-align: right;
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

:deep(.mega-icon svg),
:deep(.transaction-title-icon svg),
:deep(.transaction-row-icon svg) {
  fill: none !important;
  stroke: currentColor !important;
  color: inherit !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
}

:deep(.mega-icon svg circle[fill="currentColor"]),
:deep(.mega-icon svg path[fill="currentColor"]) {
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

  .transaction-summary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .mega-dropdown {
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%) !important;
    width: min(94vw, 760px);
  }

  .mega-grid {
    grid-template-columns: 1fr;
  }

  .mega-dropdown-head {
    flex-direction: column;
  }

  .user-menu-trigger {
    width: 100% !important;
    justify-content: center !important;
  }

  .user-dropdown {
    right: 50% !important;
    transform: translateX(50%) !important;
  }

  .transaction-toolbar {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .seal-watermark {
    width: 220px;
    left: 10px;
    top: 70px;
  }

  .transactions-modal {
    width: min(96%, 760px) !important;
    border-radius: 18px;
  }

  .transaction-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .client-pill {
    width: 100%;
  }

  .transaction-summary-grid,
  .transaction-tabs,
  .transaction-toolbar,
  .transaction-content {
    padding-left: 18px;
    padding-right: 18px;
  }

  .transaction-row {
    grid-template-columns: 52px 1fr;
  }

  .transaction-row-actions {
    grid-column: 1 / -1;
  }

  .transaction-row-actions button {
    width: 100%;
  }

  .details-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .details-row strong {
    text-align: left;
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

  .mega-dropdown {
    position: fixed;
    top: 154px;
    left: 12px !important;
    right: 12px !important;
    width: auto;
    max-height: calc(100vh - 176px);
    overflow-y: auto;
    transform: none !important;
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

  .mega-footer,
  .logout-modal-actions,
  .settings-modal-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .settings-option-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .switch {
    align-self: flex-end;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mega-item:hover .mega-icon,
  .mega-item.active .mega-icon {
    animation: none;
  }

  * {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
</style>
