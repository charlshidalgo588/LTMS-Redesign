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
            <span class="brand-text">CONTACT</span>
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
        <a href="#" class="nav-item active" @click.prevent="goToContact">
          CONTACT
        </a>
        <a href="#" class="nav-item" @click.prevent="goToDashboard">
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

    <main class="main-shell">
      <section class="hero-section">
        <div class="hero-copy premium-panel">
          <span class="hero-kicker">Client support</span>
          <h1>Contact and Assistance</h1>
          <p>
            Access official support channels, verified contact references, and a
            cleaner live assistance experience for portal, licensing, vehicle,
            and transaction concerns.
          </p>

          <div class="hero-trust-row">
            <div class="hero-trust-pill">
              <span class="trust-dot"></span>Verified LTO channels
            </div>
            <div class="hero-trust-pill">
              <span class="trust-dot"></span>Secure inquiry handling
            </div>
            <div class="hero-trust-pill">
              <span class="trust-dot"></span>Live support available
            </div>
          </div>
        </div>

        <div class="hero-side-card premium-panel">
          <span class="hero-side-label">Support hours</span>
          <strong>Monday to Friday</strong>
          <p>8:00 AM to 5:00 PM</p>

          <div class="hero-mini-grid">
            <div class="hero-mini-item">
              <span>Hotline</span>
              <strong>1342</strong>
            </div>
            <div class="hero-mini-item">
              <span>Email</span>
              <strong>clientcare@lto.gov.ph</strong>
            </div>
          </div>

          <button
            class="live-chat-cta"
            type="button"
            @click="openLiveChatModal"
          >
            Start Live Support
          </button>
        </div>
      </section>

      <section class="contact-grid">
        <section class="left-column">
          <article class="section-card premium-panel">
            <div class="section-head">
              <div>
                <span class="section-kicker">Official channels</span>
                <h2>How to Contact LTO</h2>
                <p class="section-subtext">
                  Choose the support channel that best matches your concern.
                </p>
              </div>
            </div>

            <div class="contact-card-grid">
              <article class="contact-card primary-card">
                <div class="contact-icon-wrap">☎</div>
                <h3>Hotline Support</h3>
                <p>
                  Call the LTMS or LTO client assistance hotline for urgent
                  service concerns and general guidance.
                </p>
                <div class="contact-meta">1342</div>
              </article>

              <article class="contact-card">
                <div class="contact-icon-wrap">✉</div>
                <h3>Email Support</h3>
                <p>
                  Send account, portal, or service concerns through the official
                  client care email channel.
                </p>
                <div class="contact-meta">clientcare@lto.gov.ph</div>
              </article>

              <article class="contact-card">
                <div class="contact-icon-wrap">⌂</div>
                <h3>Central Office</h3>
                <p>
                  Visit the Land Transportation Office central office for
                  administrative and client support concerns.
                </p>
                <div class="contact-meta">East Avenue, Quezon City</div>
              </article>

              <article class="contact-card support-card">
                <div class="contact-icon-wrap live">✦</div>
                <h3>Live Support</h3>
                <p>
                  Start a guided support session for quicker help on portal,
                  licensing, and transaction-related concerns.
                </p>
                <button
                  class="link-btn premium-link-btn"
                  type="button"
                  @click="openLiveChatModal"
                >
                  Open Live Support
                </button>
              </article>
            </div>
          </article>

          <article class="section-card premium-panel">
            <div class="section-head">
              <div>
                <span class="section-kicker">Office directory</span>
                <h2>Directory of Contact Points</h2>
                <p class="section-subtext">
                  Common offices and assistance desks for specific concerns.
                </p>
              </div>
            </div>

            <div class="directory-list">
              <div
                v-for="office in officeDirectory"
                :key="office.name"
                class="directory-item"
              >
                <div class="directory-main">
                  <strong>{{ office.name }}</strong>
                  <span>{{ office.scope }}</span>
                </div>
                <div class="directory-side">
                  <small>{{ office.phone }}</small>
                  <small>{{ office.email }}</small>
                </div>
              </div>
            </div>
          </article>
        </section>

        <aside class="right-column">
          <article class="section-card premium-panel">
            <div class="section-head compact">
              <div>
                <span class="section-kicker">Live support</span>
                <h2>Need immediate assistance?</h2>
                <p class="section-subtext">
                  Connect to a guided support flow for quicker issue routing.
                </p>
              </div>
            </div>

            <div class="support-feature-list">
              <div class="support-feature">
                <strong>Real-time assistance</strong>
                <span
                  >Get guided replies for common portal and service
                  issues.</span
                >
              </div>
              <div class="support-feature">
                <strong>Cleaner support flow</strong>
                <span
                  >Choose your concern first, then continue directly in
                  chat.</span
                >
              </div>
              <div class="support-feature">
                <strong>Better next steps</strong>
                <span
                  >Receive structured guidance before formal escalation.</span
                >
              </div>
            </div>

            <button
              class="primary-btn support-main-btn"
              type="button"
              @click="openLiveChatModal"
            >
              Connect to Live Support
            </button>
          </article>

          <article class="section-card premium-panel inquiry-card">
            <div class="section-head">
              <div>
                <span class="section-kicker">Send inquiry</span>
                <h2>Client Inquiry Form</h2>
                <p class="section-subtext">
                  Submit a concern for review and follow-up.
                </p>
              </div>
            </div>

            <form class="inquiry-form" @submit.prevent="submitInquiry">
              <label class="field">
                <span>Full Name</span>
                <input v-model="inquiry.fullName" type="text" />
              </label>

              <label class="field">
                <span>Email Address</span>
                <input v-model="inquiry.email" type="email" />
              </label>

              <label class="field">
                <span>Contact Number</span>
                <input v-model="inquiry.mobile" type="text" />
              </label>

              <label class="field">
                <span>Concern Category</span>
                <select v-model="inquiry.category">
                  <option>Licensing</option>
                  <option>Vehicle Registration</option>
                  <option>LTMS Portal</option>
                  <option>Violation / Penalty</option>
                  <option>General Inquiry</option>
                </select>
              </label>

              <label class="field field-full">
                <span>Message</span>
                <textarea
                  v-model="inquiry.message"
                  rows="5"
                  placeholder="Describe your concern clearly."
                ></textarea>
              </label>

              <button
                class="primary-btn"
                type="submit"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? "Submitting..." : "Submit Inquiry" }}
              </button>

              <div v-if="submitMessage" class="submit-banner">
                {{ submitMessage }}
              </div>
            </form>
          </article>
        </aside>
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

    <div
      v-if="showLiveChatModal"
      class="live-chat-modal-overlay"
      @click.self="closeLiveChatModal"
    >
      <div class="live-chat-modal-card">
        <div class="live-chat-modal-head">
          <div>
            <span class="settings-modal-kicker">Live support</span>
            <h3>
              {{
                isChatStarted
                  ? liveChatSelectedQueue
                  : "Connect to Live Support"
              }}
            </h3>
            <p v-if="!isChatStarted">
              Select a support category to begin your session.
            </p>
            <p v-else>You are connected to a guided support session.</p>
          </div>

          <button
            type="button"
            class="settings-close-btn"
            :disabled="isPageLoading"
            @click="closeLiveChatModal"
          >
            ×
          </button>
        </div>

        <div v-if="!isChatStarted" class="support-queue-list">
          <button
            type="button"
            class="support-queue-card"
            @click="startLiveChat('Portal Support')"
          >
            <div class="support-queue-copy">
              <strong>Portal Support</strong>
              <span
                >Account access, password reset, verification, and LTMS login
                issues.</span
              >
            </div>
            <span class="support-queue-arrow">›</span>
          </button>

          <button
            type="button"
            class="support-queue-card"
            @click="startLiveChat('Licensing Support')"
          >
            <div class="support-queue-copy">
              <strong>Licensing Support</strong>
              <span
                >Renewal, student permits, license classifications, and
                requirements.</span
              >
            </div>
            <span class="support-queue-arrow">›</span>
          </button>

          <button
            type="button"
            class="support-queue-card"
            @click="startLiveChat('Vehicle Support')"
          >
            <div class="support-queue-copy">
              <strong>Vehicle Support</strong>
              <span
                >Registration, OR/CR, ownership updates, and record
                concerns.</span
              >
            </div>
            <span class="support-queue-arrow">›</span>
          </button>

          <button
            type="button"
            class="support-queue-card"
            @click="startLiveChat('General Assistance')"
          >
            <div class="support-queue-copy">
              <strong>General Assistance</strong>
              <span
                >General questions, support routing, and office contact
                guidance.</span
              >
            </div>
            <span class="support-queue-arrow">›</span>
          </button>
        </div>

        <div v-else class="premium-chat">
          <div class="mock-chat-topbar">
            <div class="chat-status">
              <span class="status-dot"></span>
              <strong>{{ liveChatSelectedQueue }}</strong>
            </div>
            <span class="chat-status-label">Online</span>
          </div>

          <div class="mock-chat-messages">
            <div
              v-for="(message, index) in liveChatConversation"
              :key="`${message.sender}-${index}`"
              class="mock-chat-bubble"
              :class="message.sender"
            >
              {{ message.text }}
            </div>
          </div>

          <div class="mock-chat-suggestion-row">
            <button
              v-for="suggestion in liveChatSuggestions"
              :key="suggestion"
              type="button"
              class="mock-chat-suggestion"
              @click="useSuggestion(suggestion)"
            >
              {{ suggestion }}
            </button>
          </div>

          <div class="mock-chat-input-row">
            <input
              v-model="liveChatInput"
              type="text"
              class="mock-chat-input"
              placeholder="Type your concern here..."
              @keydown.enter.prevent="sendLiveChatMessage"
            />
            <button
              type="button"
              class="mock-chat-send-btn"
              @click="sendLiveChatMessage"
            >
              Send
            </button>
          </div>

          <div class="mock-chat-footer-note">
            Mock support demo only. Use official hotline, email, or office
            support for formal processing.
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
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
  computed,
} from "vue";
import { useRouter } from "vue-router";
import { useAccessibility } from "../composables/useAccessibility";
import logo from "../assets/logo.png";

const router = useRouter();
const { settings: accessibilitySettings, loadAccessibilitySettings } =
  useAccessibility();

const showUserMenu = ref(false);
const showLogoutModal = ref(false);
const showSettingsModal = ref(false);
const showLiveChatModal = ref(false);
const isChatStarted = ref(false);
const liveChatSelectedQueue = ref("General Assistance");
const liveChatInput = ref("");
const liveChatConversation = ref<{ sender: "agent" | "user"; text: string }[]>(
  [],
);
const userMenuRef = ref<HTMLElement | null>(null);
const isPageLoading = ref(false);
const isSubmitting = ref(false);
const submitMessage = ref("");

const inquiry = reactive({
  fullName: "Charls Benedict Hidalgo",
  email: "charlshidalgo25@gmail.com",
  mobile: "09998887777",
  category: "General Inquiry",
  message: "",
});

const officeDirectory = [
  {
    name: "Client Care and Public Assistance",
    scope: "General concerns, complaints, and public assistance",
    phone: "1342",
    email: "clientcare@lto.gov.ph",
  },
  {
    name: "Licensing Assistance Desk",
    scope: "Driver licensing, renewal, permits, and classifications",
    phone: "(02) 8922-9061",
    email: "licensing@lto.gov.ph",
  },
  {
    name: "Vehicle Registration Support",
    scope: "Registration, ownership records, and vehicle documents",
    phone: "(02) 8927-5584",
    email: "registration@lto.gov.ph",
  },
  {
    name: "LTMS Technical Support",
    scope: "Account access, portal login, and system-related concerns",
    phone: "(02) 8790-8988",
    email: "ltmssupport@lto.gov.ph",
  },
];

const queueGreetings: Record<string, string[]> = {
  "Portal Support": [
    "Hello. You are connected to Portal Support. How may I help you with your LTMS account today?",
    "You may ask about password reset, account access, verification, or login-related concerns.",
  ],
  "Licensing Support": [
    "Hello. You are connected to Licensing Support. I can help with permits, renewal, and licensing questions.",
    "Please tell me whether your concern is about renewal, a student permit, a license classification, or documentary requirements.",
  ],
  "Vehicle Support": [
    "Hello. You are connected to Vehicle Support. I can help with registration, ownership, and vehicle record concerns.",
    "Please provide the vehicle-related concern you want checked, such as registration renewal, OR/CR, or transfer of ownership.",
  ],
  "General Assistance": [
    "Hello. You are connected to General Assistance. How may I assist you today?",
    "You may ask about LTMS services, office concerns, hotline guidance, or where to route your concern.",
  ],
};

const mockReplies = [
  {
    keywords: ["renew", "renewal", "license"],
    reply:
      "For license renewal, please make sure your LTMS account details are updated, complete the required CDE or validation steps if applicable, and review your active license record before proceeding.",
  },
  {
    keywords: ["forgot", "password", "login", "account"],
    reply:
      "If your concern is account access, please use the official password recovery tools in LTMS first. If recovery fails, Portal Support may ask you to verify your registered email and mobile number.",
  },
  {
    keywords: ["registration", "vehicle", "or/cr", "plate"],
    reply:
      "For vehicle registration concerns, please prepare your plate number, OR/CR details, and any recent transaction reference so support can guide you more efficiently.",
  },
  {
    keywords: ["requirements", "document", "documents"],
    reply:
      "For documentary concerns, it is best to prepare your valid ID, reference number, and any transaction-specific supporting records before visiting an office or continuing online.",
  },
  {
    keywords: ["hotline", "contact", "office"],
    reply:
      "You may continue through hotline 1342, client care email, or the appropriate office directory listed on this page if you need formal escalation.",
  },
  {
    keywords: ["student permit", "student"],
    reply:
      "For student permit concerns, please review your required supporting documents, identity details, and any applicable medical or course requirements before proceeding.",
  },
];

const liveChatSuggestions = computed(() => {
  const selected = liveChatSelectedQueue.value;

  if (selected === "Portal Support") {
    return ["I forgot my password", "My account is locked", "I cannot log in"];
  }

  if (selected === "Licensing Support") {
    return [
      "What are the renewal requirements?",
      "How do I get a student permit?",
      "What documents do I need?",
    ];
  }

  if (selected === "Vehicle Support") {
    return [
      "How do I renew registration?",
      "I need help with OR/CR",
      "How do I transfer ownership?",
    ];
  }

  return [
    "How do I contact the right office?",
    "Where can I ask about my transaction?",
    "What support channel should I use?",
  ];
});

const delay = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

const beginPageLoading = async () => {
  if (isPageLoading.value) return false;
  isPageLoading.value = true;
  showUserMenu.value = false;
  showLogoutModal.value = false;
  showSettingsModal.value = false;
  showLiveChatModal.value = false;
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  await nextTick();
  await delay(220);
  return true;
};

const endPageLoading = () => {
  isPageLoading.value = false;
};

const toggleUserMenu = () => {
  if (isPageLoading.value) return;
  showUserMenu.value = !showUserMenu.value;
};

const closeUserMenu = () => {
  showUserMenu.value = false;
};

const openSettingsModal = () => {
  closeUserMenu();
  showSettingsModal.value = true;
};

const closeSettingsModal = () => {
  if (isPageLoading.value) return;
  showSettingsModal.value = false;
};

const openLiveChatModal = () => {
  closeUserMenu();
  isChatStarted.value = false;
  liveChatInput.value = "";
  liveChatSelectedQueue.value = "General Assistance";
  liveChatConversation.value = [
    {
      sender: "agent",
      text: "Welcome to LTMS Live Support. Select a support category to begin your session.",
    },
  ];
  showLiveChatModal.value = true;
};

const closeLiveChatModal = () => {
  if (isPageLoading.value) return;
  showLiveChatModal.value = false;
  isChatStarted.value = false;
  liveChatInput.value = "";
  liveChatConversation.value = [];
};

const startLiveChat = (queue: string) => {
  liveChatSelectedQueue.value = queue;
  isChatStarted.value = true;
  liveChatConversation.value = [
    ...(queueGreetings[queue] || queueGreetings["General Assistance"]).map(
      (text) => ({
        sender: "agent" as const,
        text,
      }),
    ),
  ];
};

const useSuggestion = (suggestion: string) => {
  liveChatInput.value = suggestion;
  void sendLiveChatMessage();
};

const sendLiveChatMessage = async () => {
  const message = liveChatInput.value.trim();
  if (!message) return;

  liveChatConversation.value.push({
    sender: "user",
    text: message,
  });

  liveChatInput.value = "";

  await delay(500);

  const normalized = message.toLowerCase();
  const matched = mockReplies.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword)),
  );

  liveChatConversation.value.push({
    sender: "agent",
    text:
      matched?.reply ||
      "Thank you for your message. Your concern appears to need a more specific review. Please provide your reference number, concern category, and a short summary so support can guide you properly.",
  });
};

const handleDocumentClick = (event: MouseEvent) => {
  const target = event.target as Node | null;
  if (!userMenuRef.value || !target) return;
  if (!userMenuRef.value.contains(target)) closeUserMenu();
};

const requestLogout = () => {
  closeUserMenu();
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

const goToProfile = async () => {
  closeUserMenu();
  const started = await beginPageLoading();
  if (!started) return;

  try {
    await router.push("/profile");
  } catch {
    endPageLoading();
  }
};

const goToELearning = async () => {
  const currentPath = router.currentRoute.value.path;
  const started = await beginPageLoading();
  if (!started) return;

  if (currentPath === "/e-learning") {
    await delay(280);
    endPageLoading();
    return;
  }

  try {
    await router.push("/e-learning");
  } catch {
    endPageLoading();
  }
};

const goToDashboard = async () => {
  const currentPath = router.currentRoute.value.path;
  const started = await beginPageLoading();
  if (!started) return;

  if (currentPath === "/home") {
    await delay(280);
    endPageLoading();
    return;
  }

  try {
    await router.push("/home");
  } catch {
    endPageLoading();
  }
};

const goToContact = async () => {
  const currentPath = router.currentRoute.value.path;
  const started = await beginPageLoading();
  if (!started) return;

  if (currentPath === "/contact") {
    await delay(280);
    endPageLoading();
    return;
  }

  try {
    await router.push("/contact");
  } catch {
    endPageLoading();
  }
};

const openOfficialWebsite = async () => {
  closeUserMenu();
  const started = await beginPageLoading();
  if (!started) return;

  await delay(180);
  window.open("https://lto.gov.ph", "_blank", "noopener,noreferrer");
  await delay(160);
  endPageLoading();
};

const submitInquiry = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  submitMessage.value = "";

  await delay(900);

  isSubmitting.value = false;
  submitMessage.value =
    "Your inquiry has been submitted successfully for review.";

  inquiry.message = "";
};

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);
  loadAccessibilitySettings();
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
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.topbar {
  min-height: 72px;
  background: linear-gradient(180deg, #0d468f 0%, #0b3d82 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  box-shadow: 0 8px 18px rgba(10, 46, 99, 0.18);
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
}
.brand-text {
  font-size: 20px;
  font-weight: 800;
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
}
.nav-item:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.14);
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
  color: #fff;
}
.user-id {
  font-size: 11px;
  font-weight: 700;
  opacity: 0.84;
  white-space: nowrap;
  color: #fff;
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

.main-shell {
  width: min(1440px, calc(100vw - 36px));
  margin: 0 auto;
  padding: 28px 0 40px;
}
.hero-section {
  display: grid;
  grid-template-columns: minmax(0, 1.18fr) minmax(320px, 0.82fr);
  gap: 22px;
  margin-bottom: 24px;
}
.hero-copy,
.hero-side-card,
.section-card {
  border-radius: 28px;
}
.hero-copy {
  padding: 34px;
}
.hero-kicker,
.section-kicker {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: #eef4ff;
  color: #1f4fb8;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.hero-copy h1,
.section-head h2 {
  margin: 0 0 10px;
  color: #1f2937;
  font-size: clamp(30px, 3vw, 44px);
  line-height: 1.08;
  letter-spacing: -0.02em;
}
.hero-copy p,
.section-subtext {
  margin: 0;
  color: #64748b;
  font-size: 15px;
  line-height: 1.75;
}
.hero-trust-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}
.hero-trust-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid #e2eaf5;
  color: #173a74;
  font-size: 12px;
  font-weight: 800;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
}
.trust-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(180deg, #22c55e 0%, #16a34a 100%);
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.12);
}
.hero-side-card {
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background:
    radial-gradient(
      circle at top right,
      rgba(31, 95, 183, 0.12),
      transparent 32%
    ),
    rgba(255, 255, 255, 0.95);
}
.hero-side-label {
  display: block;
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}
.hero-side-card strong {
  font-size: 30px;
  color: #163d7b;
  margin-bottom: 8px;
}
.hero-side-card p {
  margin: 0;
  color: #64748b;
  line-height: 1.7;
}
.hero-mini-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}
.hero-mini-item {
  padding: 14px;
  border-radius: 18px;
  background: rgba(247, 251, 255, 0.98);
  border: 1px solid #e4edf8;
}
.hero-mini-item span {
  display: block;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 6px;
}
.hero-mini-item strong {
  font-size: 15px;
  color: #163d7b;
  word-break: break-word;
}
.live-chat-cta {
  margin-top: 18px;
  min-height: 46px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(180deg, #0d3273 0%, #154b96 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 14px 24px rgba(21, 75, 150, 0.18);
}

.contact-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(380px, 0.82fr);
  gap: 24px;
}
.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.section-card {
  padding: 24px;
}
.section-head {
  margin-bottom: 18px;
}
.section-head.compact {
  margin-bottom: 14px;
}
.contact-card-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.contact-card {
  padding: 20px;
  border-radius: 22px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dfe8f5;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
}
.contact-card.primary-card {
  background:
    radial-gradient(
      circle at top right,
      rgba(255, 255, 255, 0.18),
      transparent 30%
    ),
    linear-gradient(135deg, #0d3273 0%, #154b96 55%, #1c65c0 100%);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.08);
}
.support-card {
  background:
    radial-gradient(
      circle at top right,
      rgba(31, 95, 183, 0.08),
      transparent 32%
    ),
    linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
}
.contact-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: #e9f0ff;
  color: #154b96;
  font-size: 24px;
  margin-bottom: 14px;
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.06);
}
.contact-icon-wrap.live {
  background: linear-gradient(180deg, #eef4ff 0%, #dbe9ff 100%);
  color: #1f5fb7;
}
.primary-card .contact-icon-wrap {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}
.contact-card h3 {
  margin: 0 0 8px;
  color: inherit;
  font-size: 18px;
}
.contact-card p {
  margin: 0;
  color: inherit;
  opacity: 0.92;
  line-height: 1.65;
  font-size: 14px;
}
.contact-meta {
  margin-top: 14px;
  color: inherit;
  font-size: 13px;
  font-weight: 800;
}
.link-btn,
.primary-btn {
  margin-top: 14px;
  min-height: 46px;
  border-radius: 14px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}
.link-btn {
  border: 1px solid #d8e3f0;
  background: #fff;
  color: #154b96;
}
.premium-link-btn {
  border-color: #cfe0fb;
  background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.05);
}
.primary-btn {
  border: none;
  background: linear-gradient(180deg, #1f5fb7 0%, #154b96 100%);
  color: white;
  box-shadow: 0 12px 22px rgba(21, 75, 150, 0.16);
}
.support-main-btn {
  min-height: 48px;
  margin-top: 18px;
}

.directory-list {
  display: grid;
  gap: 12px;
}
.directory-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  padding: 18px;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
  border: 1px solid #e4ebf5;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
}
.directory-main {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.directory-main strong {
  color: #1f2937;
  font-size: 16px;
}
.directory-main span {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}
.directory-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  color: #154b96;
  font-size: 12px;
  font-weight: 700;
  text-align: right;
}

.support-feature-list {
  display: grid;
  gap: 12px;
}
.support-feature {
  padding: 16px;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
  border: 1px solid #e1eaf6;
}
.support-feature strong {
  display: block;
  margin-bottom: 6px;
  color: #163d7b;
  font-size: 15px;
}
.support-feature span {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.inquiry-form {
  display: grid;
  gap: 14px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.field span {
  color: #334155;
  font-size: 13px;
  font-weight: 700;
}
.field input,
.field select,
.field textarea {
  width: 100%;
  min-height: 50px;
  border-radius: 16px;
  border: 1px solid #dce5f2;
  background: rgba(255, 255, 255, 0.92);
  padding: 0 16px;
  color: #1f2937;
  font-size: 14px;
  outline: none;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
}
.field textarea {
  min-height: 138px;
  padding: 14px 16px;
  resize: vertical;
}
.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color: #8fb5ef;
  box-shadow: 0 0 0 4px rgba(31, 95, 183, 0.08);
}
.submit-banner {
  padding: 14px 16px;
  border-radius: 16px;
  background: #ecfdf3;
  border: 1px solid #bbf7d0;
  color: #166534;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.55;
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

.live-chat-modal-overlay,
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
.live-chat-modal-card,
.logout-modal-card,
.settings-modal-card {
  border-radius: 24px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dbe5f3;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.18);
}
.live-chat-modal-card {
  width: min(680px, 100%);
  padding: 24px;
}
.live-chat-modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}
.live-chat-modal-head h3 {
  margin: 0 0 8px;
  color: #1f2937;
  font-size: 28px;
}
.live-chat-modal-head p {
  margin: 0;
  color: #64748b;
  line-height: 1.7;
}
.support-queue-list {
  display: grid;
  gap: 12px;
}
.support-queue-card {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border-radius: 18px;
  border: 1px solid #e1eaf6;
  background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
  text-align: left;
  cursor: pointer;
}
.support-queue-copy strong {
  display: block;
  margin-bottom: 6px;
  color: #153c79;
  font-size: 16px;
}
.support-queue-copy span {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}
.support-queue-arrow {
  color: #1f5fb7;
  font-size: 22px;
  font-weight: 800;
}

.premium-chat {
  border: 1px solid #dfe8f5;
  border-radius: 22px;
  overflow: hidden;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}
.mock-chat-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(180deg, #eef4ff 0%, #e4efff 100%);
  border-bottom: 1px solid #d7e5f8;
}
.chat-status {
  display: flex;
  align-items: center;
  gap: 8px;
}
.status-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.15);
}
.chat-status strong {
  color: #153c79;
  font-size: 14px;
}
.chat-status-label {
  color: #5b6b84;
  font-size: 12px;
  font-weight: 700;
}
.mock-chat-messages {
  max-height: 300px;
  overflow-y: auto;
  padding: 16px;
  display: grid;
  gap: 10px;
  background:
    radial-gradient(
      circle at top right,
      rgba(31, 95, 183, 0.05),
      transparent 26%
    ),
    #fbfdff;
}
.mock-chat-bubble {
  max-width: 82%;
  padding: 12px 14px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.55;
  box-shadow: 0 8px 16px rgba(15, 23, 42, 0.05);
}
.mock-chat-bubble.agent {
  justify-self: start;
  background: #eef4ff;
  color: #163d7b;
  border: 1px solid #d9e7fb;
}
.mock-chat-bubble.user {
  justify-self: end;
  background: linear-gradient(180deg, #1f5fb7 0%, #154b96 100%);
  color: #fff;
}
.mock-chat-suggestion-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 0 14px 14px;
  background: #fbfdff;
}
.mock-chat-suggestion {
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid #d8e4f7;
  background: #fff;
  color: #174280;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}
.mock-chat-input-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  padding: 14px;
  border-top: 1px solid #e4ebf5;
  background: #fff;
}
.mock-chat-input {
  min-height: 46px;
  border-radius: 14px;
  border: 1px solid #dce5f2;
  padding: 0 14px;
  font-size: 14px;
  outline: none;
}
.mock-chat-input:focus {
  border-color: #8fb5ef;
  box-shadow: 0 0 0 4px rgba(31, 95, 183, 0.08);
}
.mock-chat-send-btn {
  min-width: 100px;
  min-height: 46px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(180deg, #1f5fb7 0%, #154b96 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}
.mock-chat-footer-note {
  padding: 0 14px 14px;
  color: #64748b;
  font-size: 12px;
  line-height: 1.5;
  background: #fff;
}

.logout-modal-card,
.settings-modal-card {
  width: min(420px, 100%);
}
.logout-modal-card {
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
.logout-modal-copy h3,
.settings-modal-header h3 {
  margin: 0 0 10px;
  color: #1f2937;
}
.logout-modal-copy h3 {
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
  border: none;
  background: linear-gradient(180deg, #d92d20 0%, #b42318 100%);
  color: #ffffff;
}

.settings-modal-card {
  width: min(560px, 100%);
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

@media (max-width: 1100px) {
  .hero-section,
  .contact-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .topbar {
    height: auto;
    flex-direction: column;
    gap: 12px;
    padding: 14px 18px;
  }
  .topbar-nav {
    flex-wrap: wrap;
    justify-content: center;
  }
  .main-shell {
    width: min(100%, calc(100vw - 18px));
    padding: 16px 0 26px;
  }
  .hero-copy,
  .hero-side-card,
  .section-card,
  .live-chat-modal-card {
    padding: 18px;
  }
  .contact-card-grid,
  .hero-mini-grid {
    grid-template-columns: 1fr;
  }
  .directory-item {
    grid-template-columns: 1fr;
  }
  .directory-side {
    align-items: flex-start;
    text-align: left;
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
  .user-menu-trigger {
    width: 100%;
    justify-content: center;
  }
  .live-chat-modal-card,
  .logout-modal-card,
  .settings-modal-card {
    border-radius: 20px;
  }
  .logout-modal-actions,
  .mock-chat-input-row {
    flex-direction: column;
    grid-template-columns: 1fr;
  }
  .mock-chat-send-btn {
    width: 100%;
  }
  .settings-modal-header,
  .settings-modal-body,
  .settings-modal-actions {
    padding-left: 18px;
    padding-right: 18px;
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
