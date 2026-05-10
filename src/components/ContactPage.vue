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

      <nav
        class="topbar-nav"
        :class="{ 'mobile-open': showMobileNav }"
        aria-label="Main navigation"
      >
        <a
          href="#"
          class="nav-item"
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
          @click.prevent="
            goToELearning();
            showMobileNav = false;
          "
        >
          E-LEARNING
        </a>
        <a
          href="#"
          class="nav-item active contact-active"
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
      <section class="hero-panel">
        <div class="hero-copy">
          <span class="eyebrow">Official Client Care Center</span>
          <h1>Contact LTO Support</h1>
          <p>
            Get assistance for LTMS account access, licensing, vehicle records,
            transactions, documents, and public service concerns through
            official support channels.
          </p>

          <div class="hero-actions">
            <button
              type="button"
              class="primary-action"
              @click="openLiveChatModal"
            >
              Start Live Chat
            </button>
            <a href="mailto:clientcare@lto.gov.ph" class="secondary-action">
              Email Client Care
            </a>
          </div>
        </div>

        <aside class="support-card">
          <div class="support-card-head">
            <img :src="logo" alt="LTO Logo" />
            <div>
              <span>Support Availability</span>
              <strong>Monday to Friday</strong>
              <small>8:00 AM – 5:00 PM</small>
            </div>
          </div>

          <div class="support-contact-grid">
            <div>
              <span>Hotline</span>
              <strong>1342</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>clientcare@lto.gov.ph</strong>
            </div>
          </div>

          <div class="support-reference">
            <span>Logged-in Client</span>
            <strong>26-050525-2424960</strong>
          </div>
        </aside>
      </section>

      <section class="content-grid">
        <div class="left-stack">
          <article class="panel">
            <div class="panel-header compact-row">
              <div>
                <span class="section-label">Support Desk</span>
                <h2>Concern Routing</h2>
              </div>
              <small class="directory-note"
                >Use the correct desk for faster review</small
              >
            </div>

            <div class="directory-list">
              <button
                v-for="office in officeDirectory"
                :key="office.name"
                type="button"
                class="directory-row"
                @click="selectConcernCategory(office.category)"
              >
                <div class="directory-main">
                  <strong>{{ office.name }}</strong>
                  <span>{{ office.scope }}</span>
                </div>
                <div class="directory-contact">
                  <small>{{ office.phone }}</small>
                  <small>{{ office.email }}</small>
                </div>
              </button>
            </div>
          </article>

          <article class="panel official-channel-panel">
            <div class="panel-header">
              <span class="section-label">Official Channels</span>
              <h2>Primary Contact Points</h2>
              <p>
                Use only recognized LTO contact channels for support and
                follow-up.
              </p>
            </div>

            <div class="support-channel-grid">
              <article class="support-channel featured">
                <div class="channel-icon">☎</div>
                <span>Primary Hotline</span>
                <h3>1342</h3>
                <p>For urgent public assistance and general client care.</p>
              </article>

              <article class="support-channel">
                <div class="channel-icon">✉</div>
                <span>Email Support</span>
                <h3>clientcare@lto.gov.ph</h3>
                <p>
                  Send your concern with reference number and contact details.
                </p>
              </article>

              <article class="support-channel">
                <div class="channel-icon">⌂</div>
                <span>Central Office</span>
                <h3>East Avenue, Quezon City</h3>
                <p>For office-based and administrative assistance.</p>
              </article>
            </div>
          </article>
        </div>

        <aside class="right-stack">
          <article class="panel live-chat-panel">
            <div class="live-chat-topline">
              <span class="chat-status-badge">Live Chat Available</span>
              <small>Est. wait: {{ estimatedWait }}</small>
            </div>
            <h2>Get guided assistance</h2>
            <p>
              Start a realistic support session with queue routing, ticket
              reference, and step-by-step guidance.
            </p>

            <div class="chat-preview">
              <div class="preview-bubble agent">
                Good day. I can help route your concern to the correct support
                desk.
              </div>
              <div class="preview-bubble user">
                I need help checking my LTMS account.
              </div>
            </div>

            <button
              type="button"
              class="primary-action full"
              @click="openLiveChatModal"
            >
              Connect to Live Chat
            </button>
          </article>

          <article class="panel inquiry-panel">
            <div class="panel-header">
              <span class="section-label">Formal Inquiry</span>
              <h2>Submit a Support Request</h2>
              <p>A ticket reference will be generated after submission.</p>
            </div>

            <form class="inquiry-form" @submit.prevent="submitInquiry">
              <div class="form-grid two">
                <label class="field">
                  <span>Full Name</span>
                  <input v-model="inquiry.fullName" type="text" />
                </label>
                <label class="field">
                  <span>Contact Number</span>
                  <input v-model="inquiry.mobile" type="text" />
                </label>
              </div>

              <label class="field">
                <span>Email Address</span>
                <input v-model="inquiry.email" type="email" />
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

              <label class="field">
                <span>Message</span>
                <textarea
                  v-model="inquiry.message"
                  rows="5"
                  placeholder="Describe your concern clearly. Include any transaction or reference number if available."
                ></textarea>
              </label>

              <button class="submit-btn" type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? "Submitting Request..." : "Submit Inquiry" }}
              </button>

              <div v-if="submitMessage" class="submit-banner">
                <strong>{{ generatedTicket }}</strong>
                <span>{{ submitMessage }}</span>
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
      <div class="footer-right">Official LTMS Prototype</div>
    </footer>

    <!-- Live Chat Modal -->
    <div
      v-if="showLiveChatModal"
      class="modal-overlay chat-overlay"
      @click.self="closeLiveChatModal"
    >
      <div class="live-chat-modal-card">
        <div class="live-chat-modal-head">
          <div>
            <span class="modal-kicker">Live Support Session</span>
            <h3>LTMS Client Care Chat</h3>
            <p>
              Queue: <strong>{{ liveChatSelectedQueue }}</strong> · Ticket:
              <strong>{{ liveChatTicket }}</strong>
            </p>
          </div>
          <button
            type="button"
            class="modal-close-btn"
            :disabled="isPageLoading"
            @click="closeLiveChatModal"
          >
            ×
          </button>
        </div>

        <div class="chat-modal-grid">
          <aside class="queue-panel">
            <div class="queue-panel-header">
              <strong>Select Queue</strong>
              <span>{{ estimatedWait }} average wait</span>
            </div>
            <button
              v-for="queue in liveChatQueues"
              :key="queue"
              type="button"
              class="queue-card"
              :class="{ selected: liveChatSelectedQueue === queue }"
              @click="startLiveChat(queue)"
            >
              <strong>{{ queue }}</strong>
              <span>{{ getQueueDescription(queue) }}</span>
            </button>
          </aside>

          <section class="chat-window">
            <div class="chat-window-header">
              <div class="agent-avatar">CC</div>
              <div>
                <strong>{{ assignedAgent }}</strong>
                <span><i></i> Online · Client Care Representative</span>
              </div>
            </div>

            <div class="mock-chat-messages" ref="chatMessagesRef">
              <div
                v-for="(message, index) in liveChatConversation"
                :key="`${message.sender}-${index}`"
                class="mock-chat-bubble"
                :class="message.sender"
              >
                <small>{{ message.time }}</small>
                <p>{{ message.text }}</p>
              </div>
              <div v-if="isAgentTyping" class="typing-indicator">
                <span></span><span></span><span></span>
                Agent is typing
              </div>
            </div>

            <div v-if="liveChatMessage" class="live-chat-banner">
              {{ liveChatMessage }}
            </div>

            <div class="quick-replies">
              <button
                v-for="reply in quickReplies"
                :key="reply"
                type="button"
                @click="useQuickReply(reply)"
              >
                {{ reply }}
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
          </section>
        </div>
      </div>
    </div>

    <!-- Logout Modal -->
    <div
      v-if="showLogoutModal"
      class="modal-overlay"
      @click.self="cancelLogout"
    >
      <div class="logout-modal-card">
        <div class="logout-modal-icon">↗</div>
        <span class="modal-kicker">Confirm action</span>
        <h3>Log out of LTMS Portal?</h3>
        <p>
          You are about to end your current session and return to the landing
          page.
        </p>
        <div class="logout-modal-actions">
          <button type="button" class="outline-btn" @click="cancelLogout">
            Cancel
          </button>
          <button type="button" class="danger-btn" @click="logoutUser">
            Log Out
          </button>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <div
      v-if="showSettingsModal"
      class="modal-overlay"
      @click.self="closeSettingsModal"
    >
      <div class="settings-modal-card">
        <div class="settings-modal-header">
          <div>
            <span class="modal-kicker">Accessibility</span>
            <h3>Settings</h3>
          </div>
          <button
            type="button"
            class="modal-close-btn"
            @click="closeSettingsModal"
          >
            ×
          </button>
        </div>
        <div class="settings-modal-body">
          <div class="settings-option-card">
            <div>
              <strong>Dark Mode</strong>
              <span>Use a darker color scheme for low-light viewing.</span>
            </div>
            <label class="switch">
              <input v-model="accessibilitySettings.darkMode" type="checkbox" />
              <span class="slider"></span>
            </label>
          </div>
          <div class="settings-option-card">
            <div>
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
            <div>
              <strong>Reduced Motion</strong>
              <span>Minimize animations and transitions.</span>
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
            <div>
              <strong>High Contrast</strong>
              <span>Increase contrast for better visibility.</span>
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

<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { useRouter } from "vue-router";
import { useAccessibility } from "../composables/useAccessibility";
import logo from "../assets/logo.png";

const router = useRouter();
const { settings: accessibilitySettings, loadAccessibilitySettings } =
  useAccessibility();

const showUserMenu = ref(false);
const showMobileNav = ref(false);
const showLogoutModal = ref(false);
const showSettingsModal = ref(false);
const showLiveChatModal = ref(false);
const liveChatMessage = ref("");
const liveChatSelectedQueue = ref("General Assistance");
const liveChatInput = ref("");
const liveChatConversation = ref<
  { sender: "agent" | "user"; text: string; time: string }[]
>([]);
const userMenuRef = ref<HTMLElement | null>(null);
const chatMessagesRef = ref<HTMLElement | null>(null);
const isPageLoading = ref(false);
const isSubmitting = ref(false);
const submitMessage = ref("");
const generatedTicket = ref("");
const liveChatTicket = ref("");
const assignedAgent = ref("Client Care Agent");
const isAgentTyping = ref(false);

const estimatedWait = "1–3 min";

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
    category: "General Inquiry",
  },
  {
    name: "Licensing Assistance Desk",
    scope: "Driver licensing, renewal, permits, and classifications",
    phone: "(02) 8922-9061",
    email: "licensing@lto.gov.ph",
    category: "Licensing",
  },
  {
    name: "Vehicle Registration Support",
    scope: "Registration, ownership records, OR/CR, and vehicle documents",
    phone: "(02) 8927-5584",
    email: "registration@lto.gov.ph",
    category: "Vehicle Registration",
  },
  {
    name: "LTMS Technical Support",
    scope: "Account access, portal login, and system-related concerns",
    phone: "(02) 8790-8988",
    email: "ltmssupport@lto.gov.ph",
    category: "LTMS Portal",
  },
];

const liveChatQueues = [
  "Portal Support",
  "Licensing Support",
  "Vehicle Support",
  "General Assistance",
];

const quickReplies = [
  "I forgot my password",
  "License renewal requirements",
  "Vehicle registration concern",
  "Where do I follow up?",
];

const queueDescriptions: Record<string, string> = {
  "Portal Support": "Login, account access, and LTMS technical help.",
  "Licensing Support": "Permits, renewals, and license process guidance.",
  "Vehicle Support": "Registration, records, plates, and ownership concerns.",
  "General Assistance": "General questions, referrals, and public assistance.",
};

const queueAgents: Record<string, string> = {
  "Portal Support": "Agent Mara · Portal Desk",
  "Licensing Support": "Agent Reyes · Licensing Desk",
  "Vehicle Support": "Agent Santos · Vehicle Desk",
  "General Assistance": "Agent Cruz · Client Care",
};

const queueGreetings: Record<string, string[]> = {
  "Portal Support": [
    "Good day. You are connected to Portal Support.",
    "Please provide whether your concern is login access, password recovery, account verification, or LTMS page error.",
  ],
  "Licensing Support": [
    "Good day. You are connected to Licensing Support.",
    "Please indicate if your concern is renewal, student permit, license classification, medical certificate, or CDE validation.",
  ],
  "Vehicle Support": [
    "Good day. You are connected to Vehicle Support.",
    "Please provide your concern type, such as registration renewal, OR/CR, plate release, ownership transfer, or vehicle record update.",
  ],
  "General Assistance": [
    "Good day. You are connected to Client Care.",
    "I can help route your concern. Please describe your issue and include any reference number if available.",
  ],
};

const mockReplies = [
  {
    keywords: ["renew", "renewal", "license", "cde"],
    reply:
      "For license renewal, check that your LTMS profile is updated, complete the required CDE or validation step if applicable, and prepare your medical certificate or appointment details before continuing.",
  },
  {
    keywords: ["forgot", "password", "login", "account", "email"],
    reply:
      "For account access concerns, first use the official password recovery option. If the registered email or mobile number is no longer accessible, prepare a valid ID and client number for account verification.",
  },
  {
    keywords: ["registration", "vehicle", "or/cr", "plate", "ownership"],
    reply:
      "For vehicle registration concerns, prepare your plate number, OR/CR details, latest transaction reference, and ownership documents so the correct desk can verify the record efficiently.",
  },
  {
    keywords: ["violation", "penalty", "ticket", "apprehension"],
    reply:
      "For violation or penalty concerns, prepare the apprehension or reference number, plate number if applicable, and payment record if already settled.",
  },
  {
    keywords: ["requirements", "document", "documents"],
    reply:
      "For document requirements, prepare a valid ID, transaction reference, and service-specific supporting records. You may also submit a formal inquiry for review.",
  },
  {
    keywords: ["hotline", "contact", "office", "follow"],
    reply:
      "For official follow-up, use hotline 1342, clientcare@lto.gov.ph, or the correct concern desk listed on this page. Include your client ID and reference number when available.",
  },
];

const delay = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

const makeTicket = (prefix = "LTO") => {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${date}-${random}`;
};

const currentTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const scrollChatToBottom = async () => {
  await nextTick();
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
  }
};

const addAgentMessages = async (messages: string[]) => {
  for (const text of messages) {
    isAgentTyping.value = true;
    await delay(550);
    isAgentTyping.value = false;
    liveChatConversation.value.push({
      sender: "agent",
      text,
      time: currentTime(),
    });
    await scrollChatToBottom();
  }
};

const beginPageLoading = async () => {
  if (isPageLoading.value) return false;
  isPageLoading.value = true;
  showUserMenu.value = false;
  showMobileNav.value = false;
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
const selectConcernCategory = (category: string) => {
  inquiry.category = category;
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
};
const getQueueDescription = (queue: string) =>
  queueDescriptions[queue] || queueDescriptions["General Assistance"];

const openLiveChatModal = async () => {
  closeUserMenu();
  liveChatMessage.value = "";
  liveChatInput.value = "";
  liveChatTicket.value = makeTicket("CHAT");
  liveChatSelectedQueue.value = "General Assistance";
  assignedAgent.value = queueAgents["General Assistance"];
  liveChatConversation.value = [
    {
      sender: "agent",
      text: "Welcome to LTMS Client Care Live Chat. Please select the support queue that best matches your concern.",
      time: currentTime(),
    },
  ];
  showLiveChatModal.value = true;
  await scrollChatToBottom();
};

const closeLiveChatModal = () => {
  if (isPageLoading.value) return;
  showLiveChatModal.value = false;
  liveChatMessage.value = "";
  liveChatInput.value = "";
  liveChatConversation.value = [];
  isAgentTyping.value = false;
};

const startLiveChat = async (queue: string) => {
  liveChatSelectedQueue.value = queue;
  assignedAgent.value = queueAgents[queue] || queueAgents["General Assistance"];
  liveChatConversation.value = [];
  liveChatMessage.value = `${queue} selected. Ticket ${liveChatTicket.value} is now active.`;
  await addAgentMessages(
    queueGreetings[queue] || queueGreetings["General Assistance"],
  );
};

const sendLiveChatMessage = async () => {
  const message = liveChatInput.value.trim();
  if (!message || isAgentTyping.value) return;
  liveChatConversation.value.push({
    sender: "user",
    text: message,
    time: currentTime(),
  });
  liveChatInput.value = "";
  await scrollChatToBottom();
  isAgentTyping.value = true;
  await delay(850);
  isAgentTyping.value = false;
  const normalized = message.toLowerCase();
  const matched = mockReplies.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword)),
  );
  liveChatConversation.value.push({
    sender: "agent",
    time: currentTime(),
    text:
      matched?.reply ||
      "Thank you. To proceed, please provide your client ID, concern category, and any transaction or reference number. I can then guide you to the correct next step.",
  });
  await scrollChatToBottom();
};

const useQuickReply = (reply: string) => {
  liveChatInput.value = reply;
  sendLiveChatMessage();
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
  generatedTicket.value = makeTicket("REQ");
  submitMessage.value =
    "Your inquiry has been submitted for review. Please keep this reference number for follow-up.";
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

:global(html, body, #app) {
  margin: 0;
  min-height: 100%;
  width: 100%;
  font-family: Arial, Helvetica, sans-serif;
  background: #edf1f4;
}

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(circle at 86% 8%, rgba(13, 70, 143, 0.12), transparent 28%),
    linear-gradient(rgba(244, 246, 249, 0.92), rgba(244, 246, 249, 0.97)),
    url("../assets/BGC.jpg") center/cover no-repeat fixed;
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

/* ── TOPBAR ── */
.topbar {
  min-height: 72px;
  background: linear-gradient(180deg, #0d468f 0%, #0b3d82 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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
.brand-logo {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: contain;
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

/* ── MOBILE NAV HAMBURGER ── */
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

/* ── USER MENU ── */
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
  font-size: 13px;
  font-weight: 800;
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

/* ── MAIN ── */
.main-shell {
  width: min(1320px, calc(100vw - 36px));
  margin: 0 auto;
  padding: 30px 0 42px;
}
.hero-panel,
.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.26fr) minmax(380px, 0.74fr);
  gap: 24px;
}
.hero-panel {
  margin-bottom: 24px;
}
.hero-copy,
.support-card,
.panel {
  border: 1px solid rgba(215, 226, 241, 0.96);
  background: rgba(255, 255, 255, 0.97);
  box-shadow:
    0 24px 54px rgba(15, 23, 42, 0.085),
    inset 0 1px 0 rgba(255, 255, 255, 0.84);
  backdrop-filter: blur(8px);
}
.hero-copy {
  border-radius: 30px;
  padding: 44px;
  position: relative;
  overflow: hidden;
}
.hero-copy::after {
  content: "";
  position: absolute;
  width: 260px;
  height: 260px;
  right: -120px;
  top: -120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(31, 95, 183, 0.12), transparent 68%);
}
.eyebrow,
.section-label,
.modal-kicker,
.chat-status-badge {
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
.panel-header h2,
.live-chat-panel h2 {
  margin: 0 0 10px;
  color: #1f2937;
  font-size: clamp(31px, 3vw, 48px);
  line-height: 1.05;
  letter-spacing: -0.035em;
}
.hero-copy p,
.panel-header p,
.live-chat-panel p {
  margin: 0;
  color: #64748b;
  font-size: 15px;
  line-height: 1.75;
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}
.primary-action,
.secondary-action,
.submit-btn,
.mock-chat-send-btn,
.settings-done-btn {
  min-height: 46px;
  border-radius: 14px;
  padding: 0 18px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.primary-action,
.submit-btn,
.mock-chat-send-btn,
.settings-done-btn {
  border: none;
  background: linear-gradient(180deg, #1f5fb7 0%, #154b96 100%);
  color: #fff;
  box-shadow: 0 12px 22px rgba(21, 75, 150, 0.16);
}
.primary-action.full {
  width: 100%;
}
.secondary-action {
  border: 1px solid #d8e3f0;
  background: #fff;
  color: #154b96;
}
.support-card {
  border-radius: 30px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.support-card-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}
.support-card-head img {
  width: 58px;
  height: 58px;
  object-fit: contain;
}
.support-card-head span,
.support-reference span,
.support-contact-grid span {
  display: block;
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.support-card-head strong {
  display: block;
  color: #163d7b;
  font-size: 22px;
  margin-top: 3px;
}
.support-card-head small {
  display: block;
  color: #64748b;
  margin-top: 5px;
}
.support-contact-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.support-contact-grid div,
.support-reference {
  padding: 15px;
  border-radius: 18px;
  background: #f8fbff;
  border: 1px solid #e1eaf6;
}
.support-contact-grid strong,
.support-reference strong {
  display: block;
  margin-top: 6px;
  color: #163d7b;
  font-size: 14px;
  word-break: break-word;
}
.support-reference {
  margin-top: 12px;
}
.left-stack,
.right-stack {
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.panel {
  border-radius: 28px;
  padding: 24px;
}
.panel-header {
  margin-bottom: 18px;
}
.compact-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}
.directory-note {
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
  padding-top: 8px;
}
.directory-list {
  display: grid;
  gap: 12px;
}
.directory-row {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  padding: 18px;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
  border: 1px solid #e4ebf5;
  text-align: left;
  cursor: pointer;
  transition: 0.18s ease;
}
.directory-row:hover {
  border-color: #b7cceb;
  transform: translateY(-1px);
  box-shadow: 0 14px 24px rgba(15, 23, 42, 0.06);
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
.directory-contact {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  color: #154b96;
  font-size: 12px;
  font-weight: 700;
  text-align: right;
}
.support-channel-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
.support-channel {
  padding: 20px;
  border-radius: 22px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dfe8f5;
}
.support-channel.featured {
  color: #fff;
  background: linear-gradient(135deg, #0d3273 0%, #154b96 55%, #1c65c0 100%);
  border-color: rgba(255, 255, 255, 0.1);
}
.channel-icon {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: #e9f0ff;
  color: #154b96;
  font-size: 22px;
  margin-bottom: 14px;
}
.featured .channel-icon {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}
.support-channel span {
  display: block;
  color: inherit;
  opacity: 0.72;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}
.support-channel h3 {
  margin: 0 0 8px;
  color: inherit;
  font-size: 18px;
  word-break: break-word;
}
.support-channel p {
  margin: 0;
  color: inherit;
  opacity: 0.86;
  line-height: 1.65;
  font-size: 14px;
}
.live-chat-panel {
  background:
    radial-gradient(
      circle at top right,
      rgba(31, 95, 183, 0.12),
      transparent 32%
    ),
    rgba(255, 255, 255, 0.97);
}
.live-chat-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.live-chat-topline small {
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
}
.chat-preview {
  display: grid;
  gap: 10px;
  margin: 18px 0;
  padding: 16px;
  border-radius: 20px;
  background: #f8fbff;
  border: 1px solid #e1eaf6;
}
.preview-bubble {
  max-width: 88%;
  padding: 12px 14px;
  border-radius: 16px;
  font-size: 13px;
  line-height: 1.5;
}
.preview-bubble.agent {
  justify-self: start;
  background: #eef4ff;
  color: #163d7b;
}
.preview-bubble.user {
  justify-self: end;
  background: #154b96;
  color: #fff;
}
.inquiry-form {
  display: grid;
  gap: 14px;
}
.form-grid.two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
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
.field textarea,
.mock-chat-input {
  width: 100%;
  min-height: 50px;
  border-radius: 16px;
  border: 1px solid #dce5f2;
  background: rgba(255, 255, 255, 0.94);
  padding: 0 16px;
  color: #1f2937;
  font-size: 14px;
  outline: none;
}
.field textarea {
  min-height: 132px;
  padding: 14px 16px;
  resize: vertical;
}
.field input:focus,
.field select:focus,
.field textarea:focus,
.mock-chat-input:focus {
  border-color: #8fb5ef;
  box-shadow: 0 0 0 4px rgba(31, 95, 183, 0.08);
}
.submit-banner,
.live-chat-banner {
  display: grid;
  gap: 3px;
  padding: 14px 16px;
  border-radius: 16px;
  background: #ecfdf3;
  border: 1px solid #bbf7d0;
  color: #166534;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.55;
}
.submit-banner strong {
  font-size: 13px;
  color: #14532d;
}

/* ── FOOTER ── */
.footer {
  min-height: 62px;
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
  font-size: 12px;
  font-weight: 700;
  opacity: 0.86;
}

/* ── MODALS ── */
.modal-overlay {
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
  width: min(980px, 100%);
  padding: 24px;
  max-height: 92vh;
  overflow-y: auto;
}
.live-chat-modal-head,
.settings-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}
.live-chat-modal-head h3,
.settings-modal-header h3,
.logout-modal-card h3 {
  margin: 0 0 8px;
  color: #1f2937;
  font-size: 28px;
}
.live-chat-modal-head p,
.logout-modal-card p {
  margin: 0;
  color: #64748b;
  line-height: 1.7;
}
.modal-close-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #d8e2ef;
  border-radius: 50%;
  background: #ffffff;
  color: #154b96;
  font-size: 22px;
  cursor: pointer;
}
.chat-modal-grid {
  display: grid;
  grid-template-columns: minmax(230px, 0.35fr) minmax(0, 0.65fr);
  gap: 18px;
}
.queue-panel {
  border: 1px solid #dfe8f5;
  border-radius: 22px;
  padding: 16px;
  background: #fbfdff;
  display: grid;
  gap: 10px;
  align-content: start;
}
.queue-panel-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 2px 8px;
}
.queue-panel-header strong {
  color: #1f2937;
  font-size: 15px;
}
.queue-panel-header span {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}
.queue-card {
  border: 1px solid #e1eaf6;
  border-radius: 16px;
  background: #fff;
  padding: 14px;
  text-align: left;
  cursor: pointer;
}
.queue-card.selected,
.queue-card:hover {
  border-color: #9fc0ee;
  background: #f4f8ff;
}
.queue-card strong {
  display: block;
  color: #153c79;
  font-size: 14px;
  margin-bottom: 6px;
}
.queue-card span {
  color: #64748b;
  font-size: 12px;
  line-height: 1.5;
}
.chat-window {
  border: 1px solid #dfe8f5;
  border-radius: 22px;
  background: #fff;
  overflow: hidden;
}
.chat-window-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(180deg, #eef4ff 0%, #e4efff 100%);
  border-bottom: 1px solid #d7e5f8;
}
.agent-avatar {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: #154b96;
  color: #fff;
  font-size: 13px;
  font-weight: 900;
}
.chat-window-header strong {
  display: block;
  color: #153c79;
  font-size: 14px;
}
.chat-window-header span {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #5b6b84;
  font-size: 12px;
  font-weight: 700;
}
.chat-window-header i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #16a34a;
}
.mock-chat-messages {
  height: 360px;
  overflow-y: auto;
  padding: 16px;
  display: grid;
  gap: 10px;
  background: #fbfdff;
}
.mock-chat-bubble {
  max-width: 84%;
  padding: 11px 14px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.55;
  box-shadow: 0 8px 16px rgba(15, 23, 42, 0.05);
}
.mock-chat-bubble small {
  display: block;
  margin-bottom: 4px;
  font-size: 10px;
  font-weight: 800;
  opacity: 0.64;
}
.mock-chat-bubble p {
  margin: 0;
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
.typing-indicator {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 10px;
}
.typing-indicator span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #94a3b8;
  animation: pulse 1s infinite ease-in-out;
}
.typing-indicator span:nth-child(2) {
  animation-delay: 0.12s;
}
.typing-indicator span:nth-child(3) {
  animation-delay: 0.24s;
}
@keyframes pulse {
  0%,
  80%,
  100% {
    opacity: 0.35;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(-2px);
  }
}
.quick-replies {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px 14px 0;
}
.quick-replies button {
  border: 1px solid #dbe5f3;
  background: #f8fbff;
  color: #154b96;
  border-radius: 999px;
  padding: 7px 10px;
  font-size: 12px;
  font-weight: 800;
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
.mock-chat-send-btn {
  min-width: 100px;
}
.logout-modal-card,
.settings-modal-card {
  width: min(460px, 100%);
  padding: 24px;
}
.logout-modal-card {
  text-align: center;
}
.logout-modal-icon {
  width: 58px;
  height: 58px;
  margin: 0 auto 14px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, #eef4ff 0%, #dfeaff 100%);
  color: #154b96;
  font-size: 26px;
  font-weight: 800;
}
.logout-modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 22px;
}
.outline-btn,
.danger-btn {
  flex: 1;
  min-height: 46px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}
.outline-btn {
  border: 1px solid #d8e2ef;
  background: #ffffff;
  color: #154b96;
}
.danger-btn {
  border: none;
  background: linear-gradient(180deg, #d92d20 0%, #b42318 100%);
  color: #ffffff;
}
.settings-modal-body {
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
  background: #fff;
}
.settings-option-card div {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.settings-option-card strong {
  color: #1f2937;
  font-size: 16px;
}
.settings-option-card span {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}
.settings-done-btn {
  width: 100%;
  margin-top: 18px;
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

/* ── RESPONSIVE ── */
@media (max-width: 1100px) {
  .hero-panel,
  .content-grid,
  .chat-modal-grid {
    grid-template-columns: 1fr;
  }
  .support-channel-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .topbar {
    height: auto;
    flex-wrap: wrap;
    padding: 10px 14px;
    gap: 10px;
  }
  .topbar-left {
    flex: 1;
    min-width: 0;
  }
  .brand-text {
    font-size: 15px;
  }
  .brand-kicker {
    font-size: 9px;
  }
  .brand-logo {
    width: 32px;
    height: 32px;
  }

  .mobile-nav-toggle {
    display: flex;
    order: 2;
  }

  .topbar-nav {
    order: 4;
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.28s ease;
  }
  .topbar-nav.mobile-open {
    max-height: 320px;
  }
  .nav-item {
    padding: 11px 14px;
    border-radius: 8px;
    font-size: 13px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.06);
  }

  .nav-item.active::after {
    display: none;
  }

  .user-menu {
    order: 3;
  }
  .user-id {
    display: none;
  }
  .user-name {
    font-size: 11px;
  }
  .user-avatar {
    width: 26px;
    height: 26px;
    font-size: 11px;
    flex: 0 0 26px;
  }
  .user-caret {
    display: none;
  }

  .main-shell {
    width: min(100%, calc(100vw - 18px));
    padding: 16px 0 26px;
  }
  .hero-copy,
  .support-card,
  .panel,
  .live-chat-modal-card {
    padding: 18px;
    border-radius: 22px;
  }
  .support-contact-grid,
  .form-grid.two {
    grid-template-columns: 1fr;
  }
  .directory-row {
    grid-template-columns: 1fr;
  }
  .directory-contact {
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
  .mock-chat-input-row,
  .logout-modal-actions {
    grid-template-columns: 1fr;
    flex-direction: column;
  }
  .mock-chat-send-btn,
  .outline-btn,
  .danger-btn {
    width: 100%;
  }
}
</style>
