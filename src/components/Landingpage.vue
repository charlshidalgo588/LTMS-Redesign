<script setup lang="ts">
import logo from "../assets/logo.png";
import bgImage from "../assets/BGC.jpg";
import { computed, nextTick, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

type PortalView = "cover" | "login" | "register";

type MockAccount = {
  username: string;
  password: string;
  clientId: string;
  fullName: string;
};

const router = useRouter();

const activeView = ref<PortalView>("cover");
const isTransitioning = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const username = ref("");
const password = ref("");
const captchaInput = ref("");
const rememberUsername = ref(false);
const captchaCode = ref("");
const captchaCanvas = ref<HTMLCanvasElement | null>(null);

const errorModalOpen = ref(false);
const errorTitle = ref("Portal Notice");
const errorMessages = ref<string[]>([]);

const baseMockAccounts: MockAccount[] = [
  {
    username: "charls@gmail.com",
    password: "Charls@123",
    clientId: "26-050525-2424960",
    fullName: "Charls Benedict M. Hidalgo",
  },
  {
    username: "26-050525-2424960",
    password: "Driver@2025",
    clientId: "26-050525-2424960",
    fullName: "Hidalgo Client",
  },
  {
    username: "ltoportal@gmail.com",
    password: "Portal#2025",
    clientId: "26-050525-2424960",
    fullName: "LTMS Portal",
  },
];

const registeredAccounts = ref<MockAccount[]>([]);
const allAccounts = computed(() => [
  ...baseMockAccounts,
  ...registeredAccounts.value,
]);

const registerForm = reactive({
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  birthDate: "",
  sex: "",
  civilStatus: "",
  nationality: "Filipino",
  mobile: "",
  email: "",
  clientId: "",
  region: "",
  province: "",
  city: "",
  barangay: "",
  street: "",
  zipCode: "",
  validIdType: "",
  validIdNumber: "",
  password: "",
  confirmPassword: "",
  agreeAccuracy: false,
  agreePrivacy: false,
});

const serviceCards = [
  {
    title: "Licensing Services",
    description: "Apply, renew, and manage license-related transactions.",
    icon: "DL",
    tone: "blue",
  },
  {
    title: "Vehicle Records",
    description: "Monitor registration details and vehicle-related requests.",
    icon: "VR",
    tone: "cyan",
  },
  {
    title: "Transactions",
    description: "Track payment references, receipts, and application updates.",
    icon: "TX",
    tone: "red",
  },
  {
    title: "Documents",
    description:
      "Review official records, clearances, and downloadable copies.",
    icon: "DOC",
    tone: "navy",
  },
];

const agencyPillars = [
  {
    number: "01",
    title: "Safer Roads",
    text: "Promotes responsible driving behavior and road safety awareness.",
  },
  {
    number: "02",
    title: "Digital Services",
    text: "Supports online government transactions and service accessibility.",
  },
  {
    number: "03",
    title: "Reliable Records",
    text: "Improves access to licensing and vehicle registration information.",
  },
  {
    number: "04",
    title: "Public Guidance",
    text: "Provides advisories, reminders, and transport service information.",
  },
];

const ltoServices = [
  "Driver's License Application and Renewal",
  "Student Permit Processing",
  "Vehicle Registration Transactions",
  "Online Appointment Scheduling",
  "Transaction and Payment Monitoring",
  "Documents, Receipts, and Clearance Records",
];

function getServiceRoute(service: string) {
  if (service.includes("License") || service.includes("Student Permit")) {
    return "/licensing";
  }
  if (service.includes("Vehicle")) return "/vehicle";
  if (service.includes("Appointment")) return "/transactions";
  if (service.includes("Transaction") || service.includes("Payment")) {
    return "/transactions";
  }
  if (service.includes("Documents") || service.includes("Receipts")) {
    return "/documents";
  }
  return "/home";
}

function goToPublicService(service: string) {
  router.push(getServiceRoute(service));
}

function goToELearning() {
  router.push("/e-learning");
}

function goToContact() {
  router.push("/contact");
}

const reminderCards = [
  {
    label: "Verify identity",
    title: "Prepare valid identification",
    text: "Keep your ID and supporting documents ready before starting a transaction.",
  },
  {
    label: "Review entries",
    title: "Check all submitted information",
    text: "Review portal entries carefully before final submission.",
  },
  {
    label: "Secure account",
    title: "Protect your client number",
    text: "Keep your registered email, password, and client number private.",
  },
  {
    label: "Official channels",
    title: "Use verified LTO sources only",
    text: "Avoid unofficial payment links, pages, or third-party transaction claims.",
  },
];

const ltoNews = [
  {
    title: "LTMS Online Services",
    date: "Digital Service",
    text: "Access selected licensing, vehicle, document, and transaction services through the online portal.",
    image: bgImage,
  },
  {
    title: "Prepare Requirements Before Applying",
    date: "Citizen Advisory",
    text: "Verify required documents and account information before beginning any online transaction.",
    image: bgImage,
  },
  {
    title: "Road Safety and Compliance",
    date: "Public Reminder",
    text: "The portal supports safer roads through accessible records and responsible driving reminders.",
    image: bgImage,
  },
];

const ltoVideos = [
  {
    title: "LTO KONEK: Mga Kailangan sa Pagkuha ng Plaka",
    embedUrl: "https://www.youtube-nocookie.com/embed/KL_m3n8C0k4",
    category: "Official Video",
  },
  {
    title: "Welcome to LTO KONEK",
    embedUrl: "https://www.youtube-nocookie.com/embed/VVj5nW_X-nE",
    category: "Official Video",
  },
  {
    title: "Bago Magtungo sa Opisina ng LTO",
    embedUrl: "https://www.youtube-nocookie.com/embed/olJhfjgLMG0",
    category: "Official Guide",
  },
];

const isGmail = (value: string) =>
  /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(value.trim());
const isLtoClientNumber = (value: string) =>
  /^\d{2}-\d{6}-\d{7}$/.test(value.trim());

const usernameHint = computed(() => {
  if (!username.value) return "";
  if (isGmail(username.value)) return "Detected Gmail account format";
  if (isLtoClientNumber(username.value))
    return "Detected LTO client number format";
  return "Use a valid Gmail address or LTO client number";
});

function passwordValidation(value: string) {
  return {
    minLength: value.length >= 8,
    firstUppercase: /^[A-Z]/.test(value),
    hasNumber: /\d/.test(value),
    hasSpecial: /[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]/.test(value),
  };
}

const passwordChecks = computed(() => passwordValidation(password.value));
const registerPasswordChecks = computed(() =>
  passwordValidation(registerForm.password),
);

function randomFrom(chars: string) {
  return chars[Math.floor(Math.random() * chars.length)];
}

function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  captchaCode.value = Array.from({ length: 5 }, () => randomFrom(chars)).join(
    "",
  );
  drawCaptcha();
}

function drawCaptcha() {
  const canvas = captchaCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#f8fafc");
  gradient.addColorStop(0.45, "#dbeafe");
  gradient.addColorStop(1, "#eff6ff");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 32; i += 1) {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(${80 + Math.random() * 90}, ${110 + Math.random() * 80}, ${160 + Math.random() * 70}, 0.22)`;
    ctx.lineWidth = Math.random() * 1.4 + 0.4;
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.lineTo(Math.random() * width, Math.random() * height);
    ctx.stroke();
  }

  for (let i = 0; i < 110; i += 1) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(${90 + Math.random() * 90}, ${105 + Math.random() * 90}, ${150 + Math.random() * 90}, 0.14)`;
    ctx.arc(
      Math.random() * width,
      Math.random() * height,
      Math.random() * 1.6,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  const section = width / (captchaCode.value.length + 1);
  captchaCode.value.split("").forEach((char, index) => {
    const x = section * (index + 1);
    const y = height / 2 + 8 + (Math.random() * 10 - 5);
    const rotation = Math.random() * 0.48 - 0.24;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.font = `${50 + Math.floor(Math.random() * 8)}px Arial Black`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = index % 2 === 0 ? "#0b4ab2" : "#e60023";
    ctx.shadowColor = "rgba(15, 23, 42, 0.22)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 2;
    ctx.fillText(char, 0, 0);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(15, 23, 42, 0.28)";
    ctx.strokeText(char, 0, 0);
    ctx.restore();
  });
}

function openErrorModal(title: string, messages: string[]) {
  errorTitle.value = title;
  errorMessages.value = messages;
  errorModalOpen.value = true;
}

function closeErrorModal() {
  errorModalOpen.value = false;
}

async function switchView(view: PortalView) {
  isTransitioning.value = true;
  await new Promise((resolve) => window.setTimeout(resolve, 180));
  activeView.value = view;
  isTransitioning.value = false;
  await nextTick();
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (view === "login") generateCaptcha();
}

function validateUsername(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return ["Username is required."];
  if (!isGmail(trimmed) && !isLtoClientNumber(trimmed)) {
    return [
      "Enter either a valid Gmail address or a valid LTO client number.",
      "LTO client number format must look like: 26-050525-2424960.",
    ];
  }
  return [];
}

function validatePassword(value: string) {
  const checks = passwordValidation(value);
  const messages: string[] = [];
  if (!value) return ["Password is required."];
  if (!checks.minLength)
    messages.push("Password must be at least 8 characters long.");
  if (!checks.firstUppercase)
    messages.push("Password must start with a capital letter.");
  if (!checks.hasNumber)
    messages.push("Password must include at least one number.");
  if (!checks.hasSpecial)
    messages.push("Password must include at least one special character.");
  return messages;
}

function validateCaptcha() {
  const input = captchaInput.value.trim().toUpperCase();
  if (!input) return ["Security code is required."];
  if (input !== captchaCode.value)
    return ["Security code does not match the CAPTCHA."];
  return [];
}

function handleLogin() {
  const problems = [
    ...validateUsername(username.value),
    ...validatePassword(password.value),
    ...validateCaptcha(),
  ];

  if (problems.length > 0) {
    openErrorModal("Please correct the following", problems);
    captchaInput.value = "";
    generateCaptcha();
    return;
  }

  const matchedAccount = allAccounts.value.find(
    (account) =>
      account.username.toLowerCase() === username.value.trim().toLowerCase() &&
      account.password === password.value,
  );

  if (!matchedAccount) {
    openErrorModal("Invalid credentials", [
      "The username and password do not match our mock records.",
      "Use a registered demo account or complete the prototype registration form.",
    ]);
    captchaInput.value = "";
    generateCaptcha();
    return;
  }

  if (rememberUsername.value)
    localStorage.setItem("ltms_username", username.value.trim());
  router.push("/home");
}

function validateRegistration() {
  const messages: string[] = [];
  const requiredFields: Array<[string, string]> = [
    [registerForm.firstName, "First name is required."],
    [registerForm.lastName, "Last name is required."],
    [registerForm.birthDate, "Birth date is required."],
    [registerForm.sex, "Sex is required."],
    [registerForm.civilStatus, "Civil status is required."],
    [registerForm.mobile, "Mobile number is required."],
    [registerForm.email, "Gmail address is required."],
    [registerForm.region, "Region is required."],
    [registerForm.province, "Province is required."],
    [registerForm.city, "City/Municipality is required."],
    [registerForm.barangay, "Barangay is required."],
    [registerForm.validIdType, "Valid ID type is required."],
    [registerForm.validIdNumber, "Valid ID number is required."],
  ];

  requiredFields.forEach(([value, message]) => {
    if (!value.trim()) messages.push(message);
  });

  if (registerForm.email && !isGmail(registerForm.email)) {
    messages.push("Registered email must be a valid Gmail address.");
  }
  if (registerForm.mobile && !/^09\d{9}$/.test(registerForm.mobile.trim())) {
    messages.push(
      "Mobile number must use Philippine format, for example 09171234567.",
    );
  }
  if (registerForm.clientId && !isLtoClientNumber(registerForm.clientId)) {
    messages.push(
      "Optional client number must follow the format 26-050525-2424960.",
    );
  }
  messages.push(...validatePassword(registerForm.password));
  if (registerForm.password !== registerForm.confirmPassword) {
    messages.push("Password and confirm password must match.");
  }
  if (!registerForm.agreeAccuracy)
    messages.push(
      "You must confirm that the information provided is accurate.",
    );
  if (!registerForm.agreePrivacy)
    messages.push("You must agree to the data privacy notice.");
  if (
    registerForm.email &&
    allAccounts.value.some(
      (account) =>
        account.username.toLowerCase() ===
        registerForm.email.trim().toLowerCase(),
    )
  ) {
    messages.push(
      "This Gmail address is already registered in the prototype records.",
    );
  }
  return messages;
}

async function submitRegistration() {
  const problems = validateRegistration();
  if (problems.length > 0) {
    openErrorModal("Registration incomplete", problems);
    return;
  }

  const generatedClientId =
    registerForm.clientId.trim() ||
    `26-${String(Math.floor(100000 + Math.random() * 899999))}-${String(Math.floor(1000000 + Math.random() * 8999999))}`;

  registeredAccounts.value.push({
    username: registerForm.email.trim(),
    password: registerForm.password,
    clientId: generatedClientId,
    fullName: `${registerForm.firstName} ${registerForm.lastName}`.trim(),
  });

  username.value = registerForm.email.trim();
  password.value = registerForm.password;
  openErrorModal("Registration Submitted", [
    `Your prototype LTMS account has been created with Client ID ${generatedClientId}.`,
    "You may now log in using your registered Gmail address and password.",
  ]);
  await switchView("login");
}

function resetRegistration() {
  Object.assign(registerForm, {
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    birthDate: "",
    sex: "",
    civilStatus: "",
    nationality: "Filipino",
    mobile: "",
    email: "",
    clientId: "",
    region: "",
    province: "",
    city: "",
    barangay: "",
    street: "",
    zipCode: "",
    validIdType: "",
    validIdNumber: "",
    password: "",
    confirmPassword: "",
    agreeAccuracy: false,
    agreePrivacy: false,
  });
}

onMounted(() => {
  username.value = localStorage.getItem("ltms_username") || "";
  generateCaptcha();
});
</script>

<template>
  <div class="page">
    <header class="topbar">
      <button class="brand-button" type="button" @click="switchView('cover')">
        <span class="brand-seal"><img :src="logo" alt="LTO Logo" /></span>
        <span class="brand-copy">
          <small>Republic of the Philippines</small>
          <strong>LTMS PORTAL</strong>
        </span>
      </button>

      <nav class="topbar-nav" aria-label="Main navigation">
        <a
          href="https://lto.gov.ph"
          target="_blank"
          rel="noreferrer"
          class="nav-item"
        >
          <svg viewBox="0 0 24 24">
            <path
              d="M19 18a3 3 0 0 0 0-6h-1a6 6 0 1 0-11.6 1.8A3.5 3.5 0 0 0 7 21h12"
            />
          </svg>
          Official Webpage
        </a>
        <button type="button" class="nav-item" @click="goToELearning">
          <svg viewBox="0 0 24 24">
            <path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z" />
            <path d="M6.5 10.5V15L12 18l5.5-3v-4.5" />
          </svg>
          E-Learning
        </button>
        <button type="button" class="nav-item" @click="goToContact">
          <svg viewBox="0 0 24 24">
            <path
              d="M7 5h3l1.5 3.2-1.9 1.9a13.5 13.5 0 0 0 4.3 4.3l1.9-1.9L19 14v3a1 1 0 0 1-1 1C10.8 18 6 13.2 6 7a1 1 0 0 1 1-1Z"
            />
          </svg>
          Contact
        </button>
        <button
          type="button"
          class="nav-item nav-pill"
          :class="{ active: activeView === 'register' }"
          @click="switchView('register')"
        >
          Register
        </button>
        <button
          type="button"
          class="nav-item nav-pill primary"
          :class="{ active: activeView === 'login' }"
          @click="switchView('login')"
        >
          Login
        </button>
      </nav>
    </header>

    <main class="view-shell">
      <section
        v-if="activeView === 'cover'"
        class="cover-hero"
        :style="{
          backgroundImage: `linear-gradient(120deg, rgba(4, 35, 86, 0.88), rgba(8, 75, 178, 0.76)), url(${bgImage})`,
        }"
      >
        <div class="grid-lines" aria-hidden="true"></div>
        <div class="orb orb-one" aria-hidden="true"></div>
        <div class="orb orb-two" aria-hidden="true"></div>

        <div class="cover-shell">
          <div class="cover-left">
            <span class="hero-kicker"
              >Land Transportation Management System</span
            >
            <h1>LTMS PORTAL</h1>
            <p>
              A front line government agency showcasing fast and efficient
              public service for a progressive land transport sector
            </p>
            <div class="cover-actions">
              <button
                type="button"
                class="hero-primary"
                @click="switchView('register')"
              >
                Register Account
              </button>
              <button
                type="button"
                class="hero-secondary"
                @click="switchView('login')"
              >
                Login to Portal
              </button>
            </div>
          </div>

          <aside class="hero-card">
            <img :src="logo" alt="LTO Seal" />
            <span>Official Portal Access</span>
            <h2>LTMS PORTAL</h2>
            <p>
              Secure mock access for your project dashboard and
              government-service modules.
            </p>
            <div class="hero-stats">
              <div><strong>24/7</strong><small>Online Access</small></div>
              <div><strong>2.5.4</strong><small>Release</small></div>
              <div><strong>MID</strong><small>Managed</small></div>
            </div>
          </aside>
        </div>
      </section>

      <section
        v-else-if="activeView === 'login'"
        class="auth-stage centered-login-stage"
        :style="{
          backgroundImage: `linear-gradient(135deg, rgba(239,246,255,0.88), rgba(248,250,252,0.94)), url(${bgImage})`,
        }"
      >
        <button
          type="button"
          class="back-link login-back-link"
          @click="switchView('cover')"
        >
          ← Back to Cover
        </button>

        <section class="center-login-card">
          <div class="center-login-seal">
            <img :src="logo" alt="LTO Seal" />
          </div>

          <div class="center-login-header">
            <span class="center-login-badge">Official Portal Access</span>
            <h2>Sign in to LTMS</h2>
            <p>
              Use your registered email address or LTO Client ID to access your
              account.
            </p>
          </div>

          <form class="center-login-form" @submit.prevent="handleLogin">
            <div class="field-shell">
              <label>Account Identifier</label>
              <div class="input-group official-input">
                <span class="input-icon">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="3.2" />
                    <path d="M5 19c0-3.4 3.2-5.4 7-5.4s7 2 7 5.4" />
                  </svg>
                </span>
                <input
                  v-model="username"
                  type="text"
                  placeholder="Email or LTO Client Number"
                  autocomplete="username"
                />
              </div>
              <p v-if="usernameHint" class="live-hint">
                {{ usernameHint }}
              </p>
            </div>

            <div class="field-shell">
              <label>Password</label>
              <div class="input-group official-input">
                <span class="input-icon">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M7 11V8.8A4.8 4.8 0 0 1 11.8 4h.4A4.8 4.8 0 0 1 17 8.8V11"
                    />
                    <rect x="6" y="11" width="12" height="9" rx="2" />
                    <circle cx="12" cy="15.5" r="1.1" />
                  </svg>
                </span>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter password"
                  autocomplete="current-password"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                  aria-label="Toggle password visibility"
                >
                  <svg v-if="!showPassword" viewBox="0 0 24 24">
                    <path
                      d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"
                    />
                    <circle cx="12" cy="12" r="2.8" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24">
                    <path d="M3 3l18 18" />
                    <path
                      d="M2 12s3.5-6 10-6c2.1 0 3.9.6 5.4 1.6M22 12s-3.5 6-10 6c-2.1 0-3.9-.6-5.4-1.6"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div class="password-rules official-rules">
              <span :class="{ ok: passwordChecks.firstUppercase }"
                >Starts with capital letter</span
              >
              <span :class="{ ok: passwordChecks.hasNumber }">Has number</span>
              <span :class="{ ok: passwordChecks.hasSpecial }"
                >Has special character</span
              >
              <span :class="{ ok: passwordChecks.minLength }"
                >At least 8 characters</span
              >
            </div>

            <div class="center-captcha-row">
              <canvas
                ref="captchaCanvas"
                width="265"
                height="92"
                aria-label="Security code"
              ></canvas>
              <button
                type="button"
                class="center-refresh-code"
                @click="generateCaptcha"
                aria-label="Refresh security code"
              >
                ↻
              </button>
            </div>

            <div class="field-shell">
              <label>Security Code</label>
              <div class="input-group official-input">
                <span class="input-icon hash-icon">#</span>
                <input
                  v-model="captchaInput"
                  type="text"
                  placeholder="Enter CAPTCHA code"
                />
              </div>
            </div>

            <div class="center-form-meta">
              <label class="remember-me">
                <input v-model="rememberUsername" type="checkbox" />
                <span>Remember Username</span>
              </label>
              <a href="#" class="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" class="center-login-btn">Sign In</button>
          </form>

          <div class="center-demo-note">
            <button type="button" @click="switchView('register')">
              Create an LTMS account
            </button>
          </div>
        </section>
      </section>

      <section
        v-else
        class="register-stage"
        :style="{
          backgroundImage: `linear-gradient(rgba(239,244,250,0.90), rgba(248,250,252,0.95)), url(${bgImage})`,
        }"
      >
        <button type="button" class="back-link" @click="switchView('cover')">
          ← Back to Cover
        </button>
        <section class="register-panel">
          <div class="register-header">
            <div>
              <span class="panel-kicker">LTMS Account Enrollment</span>
              <h2>Create Your Portal Account</h2>
              <p>
                Detailed mock citizen registration in a separate-view experience
                without adding another route.
              </p>
            </div>
            <img :src="logo" alt="LTO" />
          </div>

          <form class="register-form" @submit.prevent="submitRegistration">
            <div class="form-section">
              <div class="section-label">
                <strong>Personal Information</strong
                ><span>Applicant identity record</span>
              </div>
              <div class="register-grid four">
                <label
                  >First Name<input
                    v-model="registerForm.firstName"
                    type="text"
                    placeholder="Juan"
                /></label>
                <label
                  >Middle Name<input
                    v-model="registerForm.middleName"
                    type="text"
                    placeholder="Santos"
                /></label>
                <label
                  >Last Name<input
                    v-model="registerForm.lastName"
                    type="text"
                    placeholder="Dela Cruz"
                /></label>
                <label
                  >Suffix<input
                    v-model="registerForm.suffix"
                    type="text"
                    placeholder="Jr., III"
                /></label>
              </div>
              <div class="register-grid four compact-grid">
                <label
                  >Birth Date<input
                    v-model="registerForm.birthDate"
                    type="date"
                /></label>
                <label
                  >Sex<select v-model="registerForm.sex">
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select></label
                >
                <label
                  >Civil Status<select v-model="registerForm.civilStatus">
                    <option value="">Select</option>
                    <option>Single</option>
                    <option>Married</option>
                    <option>Widowed</option>
                    <option>Separated</option>
                  </select></label
                >
                <label
                  >Nationality<input
                    v-model="registerForm.nationality"
                    type="text"
                /></label>
              </div>
            </div>

            <div class="form-section">
              <div class="section-label">
                <strong>Contact and Account</strong
                ><span>Used for login and notifications</span>
              </div>
              <div class="register-grid three">
                <label
                  >Mobile Number<input
                    v-model="registerForm.mobile"
                    type="text"
                    placeholder="09171234567"
                /></label>
                <label
                  >Gmail Address<input
                    v-model="registerForm.email"
                    type="email"
                    placeholder="yourname@gmail.com"
                /></label>
                <label
                  >Existing Client ID <small>Optional</small
                  ><input
                    v-model="registerForm.clientId"
                    type="text"
                    placeholder="26-050525-2424960"
                /></label>
              </div>
            </div>

            <div class="form-section">
              <div class="section-label">
                <strong>Residential Address</strong
                ><span>Current Philippine address</span>
              </div>
              <div class="register-grid three">
                <label
                  >Region<input
                    v-model="registerForm.region"
                    type="text"
                    placeholder="Region XIII"
                /></label>
                <label
                  >Province<input
                    v-model="registerForm.province"
                    type="text"
                    placeholder="Agusan del Sur"
                /></label>
                <label
                  >City/Municipality<input
                    v-model="registerForm.city"
                    type="text"
                    placeholder="Trento"
                /></label>
              </div>
              <div class="register-grid three compact-grid">
                <label
                  >Barangay<input
                    v-model="registerForm.barangay"
                    type="text"
                    placeholder="Barangay"
                /></label>
                <label
                  >Street / House No.<input
                    v-model="registerForm.street"
                    type="text"
                    placeholder="Street, building, house no."
                /></label>
                <label
                  >ZIP Code<input
                    v-model="registerForm.zipCode"
                    type="text"
                    placeholder="8505"
                /></label>
              </div>
            </div>

            <div class="form-section">
              <div class="section-label">
                <strong>Identity Verification</strong
                ><span>Mock document details</span>
              </div>
              <div class="register-grid two">
                <label
                  >Valid ID Type<select v-model="registerForm.validIdType">
                    <option value="">Select ID</option>
                    <option>PhilSys National ID</option>
                    <option>Passport</option>
                    <option>Driver's License</option>
                    <option>UMID</option>
                    <option>Voter's ID</option>
                  </select></label
                >
                <label
                  >Valid ID Number<input
                    v-model="registerForm.validIdNumber"
                    type="text"
                    placeholder="ID reference number"
                /></label>
              </div>
            </div>

            <div class="form-section">
              <div class="section-label">
                <strong>Security Credentials</strong
                ><span>Password must satisfy all rules</span>
              </div>
              <div class="register-grid two">
                <label
                  >Password<input
                    v-model="registerForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Password@123"
                /></label>
                <label
                  >Confirm Password<input
                    v-model="registerForm.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="Repeat password"
                /></label>
              </div>
              <div class="password-rules register-rules">
                <span :class="{ ok: registerPasswordChecks.firstUppercase }"
                  >Starts with capital letter</span
                >
                <span :class="{ ok: registerPasswordChecks.hasNumber }"
                  >Has number</span
                >
                <span :class="{ ok: registerPasswordChecks.hasSpecial }"
                  >Has special character</span
                >
                <span :class="{ ok: registerPasswordChecks.minLength }"
                  >At least 8 characters</span
                >
              </div>
              <div class="show-options">
                <label
                  ><input v-model="showPassword" type="checkbox" /> Show
                  password</label
                >
                <label
                  ><input v-model="showConfirmPassword" type="checkbox" /> Show
                  confirm password</label
                >
              </div>
            </div>

            <div class="agreement-box">
              <label
                ><input v-model="registerForm.agreeAccuracy" type="checkbox" />
                I certify that the information provided is true and
                correct.</label
              >
              <label
                ><input v-model="registerForm.agreePrivacy" type="checkbox" /> I
                agree to the use of my information for LTMS account verification
                in this prototype.</label
              >
            </div>

            <div class="register-actions">
              <button
                type="button"
                class="secondary-btn"
                @click="resetRegistration"
              >
                Clear Form
              </button>
              <button
                type="button"
                class="secondary-btn"
                @click="switchView('login')"
              >
                Already Registered
              </button>
              <button type="submit" class="primary-btn">
                Submit Registration
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>

    <section v-if="activeView === 'cover'" class="public-section">
      <div class="public-container">
        <div class="public-heading-card">
          <div>
            <span class="section-kicker">Public Information</span>
            <h2>Official Information, Media, and Online Services</h2>
            <p>
              Explore core LTO services, public reminders, media highlights, and
              official video guides through a polished government-style public
              service interface.
            </p>
          </div>
          <aside class="public-seal-card">
            <img :src="logo" alt="LTO Seal" />
            <span>LTMS Public Service Hub</span>
            <strong>Release 2.5.4</strong>
          </aside>
        </div>

        <div class="citizen-center-card">
          <div class="citizen-copy">
            <span>Citizen Service Center</span>
            <h3>Fast access to essential LTO digital services</h3>
            <p>
              Review service reminders, monitor records, prepare requirements,
              and access official guidance before starting a transaction.
            </p>
          </div>
          <div class="kpi-grid">
            <article>
              <strong>24/7</strong><span>Online Portal Access</span
              ><small>Available anytime</small>
            </article>
            <article>
              <strong>ID</strong><span>Secure Record Verification</span
              ><small>Client lookup ready</small>
            </article>
            <article>
              <strong>RS</strong><span>Road Safety Advisory</span
              ><small>Compliance guidance</small>
            </article>
          </div>
        </div>

        <div class="service-grid">
          <article
            v-for="card in serviceCards"
            :key="card.title"
            class="service-card"
            :class="`tone-${card.tone}`"
          >
            <div class="service-icon">{{ card.icon }}</div>
            <span>Online Service</span>
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </article>
        </div>

        <div class="main-info-grid">
          <article class="public-card agency-card">
            <div class="public-card-header">
              <span>Agency Profile</span>
              <h3>About LTO</h3>
              <p>
                The Land Transportation Office supports driver licensing,
                vehicle registration, law enforcement coordination, and public
                road transport regulation through accessible government
                services.
              </p>
            </div>

            <div class="agency-pillar-grid">
              <article
                v-for="pillar in agencyPillars"
                :key="pillar.number"
                class="agency-pillar"
              >
                <span>{{ pillar.number }}</span>
                <div>
                  <h4>{{ pillar.title }}</h4>
                  <p>{{ pillar.text }}</p>
                </div>
              </article>
            </div>
          </article>

          <article class="public-card service-directory-card">
            <div class="public-card-header">
              <span>Service Directory</span>
              <h3>Online Services</h3>
            </div>

            <div class="service-directory-panel">
              <div class="directory-header" aria-hidden="true">
                <span>Service Name</span>
              </div>

              <button
                v-for="(service, index) in ltoServices"
                :key="service"
                type="button"
                class="directory-row"
                @click="goToPublicService(service)"
              >
                <div class="directory-left">
                  <span class="directory-number">
                    {{ String(index + 1).padStart(2, "0") }}
                  </span>

                  <div class="directory-copy">
                    <strong>{{ service }}</strong>
                    <small>Online portal processing and records access</small>
                  </div>
                </div>
              </button>
            </div>
          </article>
        </div>

        <div class="main-info-grid lower">
          <article class="public-card news-card">
            <div class="public-card-header split-header">
              <div>
                <span>Advisory Board</span>
                <h3>Latest News & Announcements</h3>
              </div>
              <em>Updated</em>
            </div>

            <div class="news-list">
              <article
                v-for="item in ltoNews"
                :key="item.title"
                class="news-item"
              >
                <div
                  class="news-thumb"
                  :style="{
                    backgroundImage: `linear-gradient(rgba(11,74,178,0.10), rgba(11,74,178,0.34)), url(${item.image})`,
                  }"
                ></div>
                <div>
                  <span>{{ item.date }}</span>
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.text }}</p>
                </div>
              </article>
            </div>
          </article>

          <article class="public-card reminders-card">
            <div class="public-card-header">
              <span>Before You Proceed</span>
              <h3>Important Reminders</h3>
            </div>

            <div class="reminder-grid">
              <article
                v-for="reminder in reminderCards"
                :key="reminder.title"
                class="reminder-item"
              >
                <span>{{ reminder.label }}</span>
                <h4>{{ reminder.title }}</h4>
                <p>{{ reminder.text }}</p>
              </article>
            </div>
          </article>
        </div>

        <section class="video-section">
          <div class="public-card-header split-header">
            <div>
              <span>Media Center</span>
              <h3>Official Video Guides</h3>
              <p>
                Embed official LTO video explainers to make the page more useful
                and credible.
              </p>
            </div>
            <em>Official</em>
          </div>

          <div class="video-grid">
            <article
              v-for="video in ltoVideos"
              :key="video.title"
              class="video-card"
            >
              <div class="video-frame">
                <iframe
                  :src="video.embedUrl"
                  :title="video.title"
                  loading="lazy"
                  allow="
                    accelerometer;
                    autoplay;
                    clipboard-write;
                    encrypted-media;
                    gyroscope;
                    picture-in-picture;
                  "
                  allowfullscreen
                ></iframe>
              </div>
              <div class="video-copy">
                <span>{{ video.category }}</span>
                <h4>{{ video.title }}</h4>
              </div>
            </article>
          </div>
        </section>
      </div>
    </section>

    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-brand">
          <img :src="logo" alt="LTO Logo" />
          <div>
            <strong>LTMS PORTAL</strong
            ><span>Land Transportation Management System</span>
          </div>
        </div>
        <div class="footer-links">
          <a href="#">About LTO</a>
          <a href="#">Announcements</a>
          <a href="#">Online Services</a>
          <a href="#">Contact Information</a>
        </div>
      </div>
    </footer>

    <div v-if="errorModalOpen" class="modal-overlay" @click="closeErrorModal">
      <div class="error-modal" @click.stop>
        <div class="error-modal-header">
          <div class="error-icon">!</div>
          <div>
            <h3>{{ errorTitle }}</h3>
            <p>Please review the notice below.</p>
          </div>
        </div>
        <ul class="error-list">
          <li v-for="(message, index) in errorMessages" :key="index">
            {{ message }}
          </li>
        </ul>
        <div class="modal-actions">
          <button type="button" class="modal-btn" @click="closeErrorModal">
            OK
          </button>
        </div>
      </div>
    </div>

    <div v-if="isTransitioning" class="transition-overlay">
      <span></span> Loading...
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}
:global(html, body, #app) {
  margin: 0;
  min-height: 100%;
  width: 100%;
  font-family: Inter, "Segoe UI", Roboto, Arial, Helvetica, sans-serif;
}
:global(body) {
  background: #e7edf5;
  color: #1e2a38;
}
:global(button, input, select) {
  font-family: inherit;
}

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(circle at 12% 10%, rgba(37, 99, 235, 0.1), transparent 26%),
    radial-gradient(
      circle at 92% 20%,
      rgba(239, 11, 42, 0.08),
      transparent 24%
    ),
    #eef4fb;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  min-height: 82px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 36px;
  background: linear-gradient(180deg, #073b98 0%, #062f7d 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 18px 42px rgba(4, 31, 78, 0.28);
  backdrop-filter: blur(18px);
}
.brand-button {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: #fff;
  padding: 0;
}
.brand-seal {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.98);
  box-shadow:
    0 14px 28px rgba(0, 0, 0, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}
.brand-seal img {
  width: 43px;
  height: 43px;
  object-fit: contain;
}
.brand-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.08;
}
.brand-copy small {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  opacity: 0.82;
}
.brand-copy strong {
  font-size: 25px;
  font-weight: 950;
  letter-spacing: 0.01em;
}
.topbar-nav {
  display: flex;
  align-items: center;
  gap: 9px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.nav-item {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 0 16px;
  background: transparent;
  color: rgba(255, 255, 255, 0.94);
  text-decoration: none;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.2s ease;
}
.nav-item svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.85;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.nav-item:hover,
.nav-item.active {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.18);
  transform: translateY(-1px);
}
.nav-pill {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.14);
}
.nav-pill.primary {
  min-width: 86px;
  justify-content: center;
  background: #fff;
  color: #0b4ab2;
  border-color: rgba(255, 255, 255, 0.76);
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.12);
}
.nav-pill.primary.active {
  color: #fff;
  background: #e60023;
  border-color: #ff8ca0;
}
.view-shell {
  flex: 1;
}

.cover-hero {
  position: relative;
  min-height: calc(100vh - 82px);
  overflow: hidden;
  isolation: isolate;
  display: grid;
  place-items: center;
  background-position: center;
  background-size: cover;
  padding: 92px 42px;
}
.grid-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(circle at center, black, transparent 72%);
  opacity: 0.5;
}
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(3px);
  pointer-events: none;
}
.orb-one {
  width: 460px;
  height: 460px;
  top: 8%;
  left: 8%;
  background: radial-gradient(
    circle,
    rgba(147, 197, 253, 0.22),
    transparent 68%
  );
}
.orb-two {
  width: 540px;
  height: 540px;
  right: -80px;
  bottom: -120px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.16),
    transparent 68%
  );
}
.cover-shell {
  position: relative;
  z-index: 2;
  width: min(1320px, 100%);
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 56px;
  align-items: center;
}
.cover-left {
  color: #fff;
}
.hero-kicker,
.side-kicker,
.section-kicker,
.panel-kicker {
  display: inline-flex;
  width: fit-content;
  padding: 8px 13px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.hero-kicker,
.side-kicker {
  background: rgba(255, 255, 255, 0.13);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
.cover-left h1 {
  max-width: 840px;
  margin: 20px 0 0;
  font-size: clamp(62px, 7.4vw, 108px);
  line-height: 0.96;
  font-weight: 950;
  letter-spacing: -0.075em;
  text-shadow: 0 20px 42px rgba(0, 0, 0, 0.25);
}
.cover-left p {
  max-width: 840px;
  margin: 24px 0 0;
  font-size: clamp(20px, 2.15vw, 30px);
  line-height: 1.28;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.86);
  text-shadow: 0 10px 22px rgba(0, 0, 0, 0.2);
}
.cover-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 34px;
}
.hero-primary,
.hero-secondary {
  min-height: 58px;
  border-radius: 16px;
  padding: 0 24px;
  font-size: 15px;
  font-weight: 950;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: 0.22s ease;
}
.hero-primary {
  border: 0;
  color: #fff;
  background: linear-gradient(180deg, #f20b2a, #c8001c);
  box-shadow: 0 18px 32px rgba(230, 0, 35, 0.3);
}
.hero-secondary {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.46);
  backdrop-filter: blur(12px);
}
.hero-primary:hover,
.hero-secondary:hover,
.login-btn:hover,
.primary-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.04);
}
.hero-card {
  justify-self: end;
  width: min(470px, 100%);
  padding: 38px;
  border-radius: 38px;
  color: #fff;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.18),
    rgba(255, 255, 255, 0.09)
  );
  border: 1px solid rgba(255, 255, 255, 0.24);
  box-shadow: 0 36px 90px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(18px);
}
.hero-card img {
  width: 128px;
  height: 128px;
  object-fit: contain;
  filter: drop-shadow(0 18px 28px rgba(0, 0, 0, 0.22));
}
.hero-card span {
  display: block;
  margin-top: 20px;
  color: #bfdbfe;
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.hero-card h2 {
  margin: 8px 0 0;
  font-size: 42px;
  line-height: 1;
  font-weight: 950;
}
.hero-card p {
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.6;
  font-weight: 650;
}
.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 20px;
}
.hero-stats div {
  border-radius: 18px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.13);
  border: 1px solid rgba(255, 255, 255, 0.16);
}
.hero-stats strong {
  display: block;
  font-size: 20px;
}
.hero-stats small {
  color: rgba(255, 255, 255, 0.76);
  font-weight: 800;
}

.auth-stage,
.register-stage {
  position: relative;
  min-height: calc(100vh - 78px);
  display: grid;
  place-items: center;
  padding: 110px 28px 80px;
  background-position: center;
  background-size: cover;
  overflow: hidden;
}
.auth-stage::before,
.register-stage::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at 15% 20%,
      rgba(37, 99, 235, 0.16),
      transparent 28%
    ),
    radial-gradient(
      circle at 88% 76%,
      rgba(14, 165, 233, 0.16),
      transparent 32%
    );
  pointer-events: none;
}
.back-link {
  position: absolute;
  top: 26px;
  left: 32px;
  z-index: 5;
  border: 1px solid #bfdbfe;
  background: rgba(255, 255, 255, 0.92);
  color: #0b4ab2;
  border-radius: 999px;
  padding: 10px 14px;
  font-weight: 950;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
}
.auth-layout {
  position: relative;
  z-index: 2;
  width: min(1120px, 100%);
  display: grid;
  grid-template-columns: 0.9fr 1fr;
  gap: 30px;
  align-items: stretch;
}
.auth-side-panel {
  position: relative;
  overflow: hidden;
  border-radius: 34px;
  padding: 36px;
  color: #fff;
  background:
    linear-gradient(145deg, rgba(10, 55, 121, 0.98), rgba(37, 99, 235, 0.9)),
    url("../assets/BGC.jpg") center/cover no-repeat;
  box-shadow: 0 36px 86px rgba(15, 23, 42, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
.auth-side-panel::after {
  content: "";
  position: absolute;
  right: -110px;
  top: -130px;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.24),
    transparent 68%
  );
}
.auth-side-panel h2 {
  margin: 22px 0 12px;
  font-size: 42px;
  line-height: 1.04;
  letter-spacing: -0.06em;
}
.auth-side-panel p {
  margin: 0;
  color: rgba(255, 255, 255, 0.82);
  line-height: 1.7;
  font-weight: 650;
}
.auth-mini-list {
  display: grid;
  gap: 12px;
  margin-top: 28px;
}
.auth-mini-list div {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.11);
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-size: 13px;
  font-weight: 850;
}
.auth-mini-list span {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #10b981;
}
.login-panel,
.register-panel {
  position: relative;
  width: 100%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.985),
    rgba(248, 251, 255, 0.965)
  );
  border: 1px solid rgba(191, 219, 254, 0.96);
  box-shadow:
    0 40px 90px rgba(15, 23, 42, 0.24),
    0 18px 40px rgba(37, 99, 235, 0.13),
    inset 0 1px 0 rgba(255, 255, 255, 0.96);
}
.login-panel {
  max-width: 590px;
  border-radius: 36px;
  padding-top: 58px;
  overflow: visible;
}
.login-panel::before,
.register-panel::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 7px;
  border-radius: inherit;
  background: linear-gradient(90deg, #ef0b2a, #2563eb, #93c5fd);
}
.seal-wrap {
  position: absolute;
  top: -70px;
  left: 50%;
  transform: translateX(-50%);
  width: 156px;
  height: 156px;
  display: grid;
  place-items: center;
}
.seal-wrap::before {
  content: "";
  position: absolute;
  inset: 10px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.96),
    rgba(219, 234, 254, 0.75)
  );
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.18);
}
.seal-logo {
  position: relative;
  width: 148px;
  height: 148px;
  object-fit: contain;
  filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.1));
}
.panel-body {
  position: relative;
  z-index: 2;
  padding: 76px 46px 40px;
  text-align: center;
}
.panel-kicker,
.section-kicker {
  background: linear-gradient(180deg, #eff6ff, #dbeafe);
  border: 1px solid #bfdbfe;
  color: #0b4ab2;
  margin-bottom: 14px;
}
.panel-body h2,
.register-header h2 {
  margin: 0;
  font-size: 50px;
  line-height: 1;
  font-weight: 950;
  letter-spacing: -0.06em;
  background: linear-gradient(135deg, #072f78, #0b4ab2 58%, #38bdf8);
  -webkit-background-clip: text;
  color: transparent;
}
.subtitle,
.register-header p {
  margin: 12px 0 28px;
  color: #52677f;
  font-size: 16px;
  line-height: 1.65;
  font-weight: 650;
}
.login-form {
  display: grid;
  gap: 16px;
}
.field-shell {
  text-align: left;
  display: grid;
  gap: 7px;
}
.field-shell label {
  color: #334155;
  font-size: 12px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.input-group {
  min-height: 62px;
  display: flex;
  align-items: center;
  overflow: hidden;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(203, 213, 225, 0.95);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.045);
  transition: 0.18s ease;
}
.input-group:focus-within {
  border-color: #2563eb;
  box-shadow:
    0 0 0 5px rgba(37, 99, 235, 0.13),
    0 16px 28px rgba(37, 99, 235, 0.1);
  transform: translateY(-1px);
}
.input-icon {
  width: 62px;
  height: 62px;
  flex: 0 0 62px;
  display: grid;
  place-items: center;
  color: #0f3d87;
  background: linear-gradient(145deg, #eff6ff, #dbeafe);
}
.input-icon svg,
.password-toggle svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.hash-icon {
  font-size: 31px;
  font-weight: 800;
}
.input-group input {
  width: 100%;
  min-height: 62px;
  border: 0;
  outline: none;
  background: transparent;
  padding: 0 15px;
  color: #0f172a;
  font-size: 14.5px;
  font-weight: 800;
  letter-spacing: 0.03em;
}
.input-group input::placeholder {
  color: #8a97a8;
}
.password-toggle {
  width: 62px;
  height: 62px;
  border: 0;
  border-left: 1px solid #dbeafe;
  background: transparent;
  color: #0f3d87;
  display: grid;
  place-items: center;
  cursor: pointer;
}
.live-hint {
  margin: 0;
  font-size: 12px;
  color: #1d4ed8;
  font-weight: 750;
}
.password-rules {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px 10px;
  padding: 12px;
  border-radius: 16px;
  background: #f8fbff;
  border: 1px solid #e0ecff;
  text-align: left;
}
.password-rules span {
  position: relative;
  padding-left: 16px;
  color: #7a8591;
  font-size: 11.5px;
  font-weight: 750;
}
.password-rules span::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #9ba8b4;
}
.password-rules span.ok {
  color: #047857;
  font-weight: 900;
}
.password-rules span.ok::before {
  content: "✓";
  color: #047857;
}
.captcha-card {
  display: grid;
  justify-content: center;
  gap: 7px;
}
.captcha-card canvas {
  width: 265px;
  max-width: 100%;
  height: 92px;
  border-radius: 18px;
  border: 1px solid rgba(147, 197, 253, 0.9);
  box-shadow: 0 16px 28px rgba(29, 78, 216, 0.12);
  overflow: hidden;
}
.refresh-code {
  border: 0;
  background: transparent;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
}
.form-meta,
.show-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.remember-me,
.show-options label,
.agreement-box label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #475569;
  font-size: 13px;
  font-weight: 750;
  cursor: pointer;
}
.remember-me input,
.show-options input,
.agreement-box input {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: #1d4ed8;
}
.forgot-link,
.auth-switch button {
  color: #1d4ed8;
  text-decoration: none;
  font-size: 13px;
  font-weight: 900;
  background: transparent;
  border: 0;
  cursor: pointer;
}
.login-btn,
.primary-btn {
  min-height: 62px;
  border: 0;
  border-radius: 20px;
  background: linear-gradient(180deg, #2563eb 0%, #0f3d87 100%);
  color: #fff;
  font-size: 17px;
  font-weight: 950;
  letter-spacing: 0.04em;
  cursor: pointer;
  box-shadow: 0 18px 30px rgba(37, 99, 235, 0.3);
  transition: 0.18s ease;
}
.demo-accounts {
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 18px;
  background: linear-gradient(180deg, #f8fbff, #eff6ff);
  border: 1px solid rgba(191, 219, 254, 0.95);
  text-align: left;
}
.demo-title {
  margin: 0 0 8px;
  color: #17488f;
  font-size: 12px;
  font-weight: 950;
}
.demo-accounts ul {
  margin: 0;
  padding-left: 16px;
}
.demo-accounts li {
  color: #4e5c6d;
  font-size: 12px;
  line-height: 1.55;
}
.auth-switch {
  margin: 16px 0 0;
  color: #475569;
  font-size: 13px;
  font-weight: 750;
}

.register-panel {
  max-width: 1240px;
  border-radius: 34px;
  padding: 42px;
  overflow: hidden;
}
.register-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  border-bottom: 1px solid #dbeafe;
  padding-bottom: 24px;
  margin-bottom: 24px;
}
.register-header img {
  width: 88px;
  height: 88px;
  object-fit: contain;
  filter: drop-shadow(0 8px 18px rgba(15, 23, 42, 0.16));
}
.register-form {
  display: grid;
  gap: 20px;
}
.form-section {
  border: 1px solid #dbeafe;
  border-radius: 24px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.92),
    rgba(248, 251, 255, 0.82)
  );
  padding: 24px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.88);
}
.section-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
}
.section-label strong {
  color: #0f3d87;
  font-size: 17px;
  font-weight: 950;
}
.section-label span {
  color: #64748b;
  font-size: 13px;
  font-weight: 750;
}
.register-grid {
  display: grid;
  gap: 14px;
}
.register-grid.four {
  grid-template-columns: repeat(4, 1fr);
}
.register-grid.three {
  grid-template-columns: repeat(3, 1fr);
}
.register-grid.two {
  grid-template-columns: repeat(2, 1fr);
}
.compact-grid {
  margin-top: 14px;
}
.register-grid label {
  display: grid;
  gap: 7px;
  color: #334155;
  font-size: 12px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.register-grid label small {
  color: #64748b;
  font-style: italic;
  text-transform: none;
}
.register-grid input,
.register-grid select {
  min-height: 52px;
  border: 1px solid #cbd5e1;
  border-radius: 15px;
  background: #fff;
  color: #0f172a;
  padding: 0 13px;
  font-size: 13px;
  font-weight: 750;
  outline: none;
}
.register-grid input:focus,
.register-grid select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}
.register-rules {
  margin-top: 12px;
}
.show-options {
  justify-content: flex-start;
  margin-top: 12px;
}
.agreement-box {
  display: grid;
  gap: 10px;
  padding: 16px;
  border-radius: 18px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}
.register-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}
.secondary-btn {
  min-height: 48px;
  border: 1px solid #bfdbfe;
  background: #fff;
  color: #0f3d87;
  border-radius: 14px;
  padding: 0 18px;
  font-weight: 950;
  cursor: pointer;
}
.primary-btn {
  min-width: 220px;
}

.public-section {
  position: relative;
  overflow: hidden;
  padding: 88px 32px 108px;
  background:
    radial-gradient(circle at 9% 10%, rgba(37, 99, 235, 0.12), transparent 28%),
    radial-gradient(
      circle at 90% 15%,
      rgba(239, 11, 42, 0.08),
      transparent 30%
    ),
    linear-gradient(180deg, #f8fbff 0%, #edf5fc 48%, #e7eff8 100%);
}
.public-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(15, 61, 135, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15, 61, 135, 0.045) 1px, transparent 1px);
  background-size: 58px 58px;
  mask-image: linear-gradient(to bottom, black 0%, transparent 78%);
  pointer-events: none;
}
.public-container {
  width: min(1240px, 100%);
  margin: 0 auto;
  position: relative;
  z-index: 2;
}
.public-heading-card,
.citizen-center-card,
.public-card,
.video-section,
.service-card,
.public-seal-card {
  border: 1px solid rgba(191, 219, 254, 0.85);
  box-shadow:
    0 24px 60px rgba(15, 23, 42, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
.public-heading-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 28px;
  align-items: stretch;
  margin-bottom: 28px;
  padding: 38px;
  border-radius: 36px;
  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.98),
      rgba(248, 251, 255, 0.94)
    ),
    radial-gradient(
      circle at top right,
      rgba(37, 99, 235, 0.1),
      transparent 38%
    );
}
.public-heading-card h2 {
  max-width: 760px;
  margin: 0 0 18px;
  font-size: clamp(38px, 4.8vw, 64px);
  line-height: 0.98;
  letter-spacing: -0.07em;
  font-weight: 950;
  background: linear-gradient(135deg, #082f74 0%, #0b4ab2 50%, #2563eb 100%);
  -webkit-background-clip: text;
  color: transparent;
}
.public-heading-card p {
  max-width: 760px;
  margin: 0;
  color: #52677f;
  font-size: 17px;
  line-height: 1.75;
  font-weight: 650;
}
.public-seal-card {
  position: relative;
  overflow: hidden;
  min-height: 220px;
  border-radius: 30px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #ffffff;
  background:
    linear-gradient(135deg, rgba(7, 48, 121, 0.96), rgba(37, 99, 235, 0.86)),
    url("../assets/BGC.jpg") center/cover no-repeat;
  box-shadow: 0 24px 46px rgba(15, 61, 135, 0.2);
}
.public-seal-card::after {
  content: "";
  position: absolute;
  width: 190px;
  height: 190px;
  right: -74px;
  top: -74px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.24),
    transparent 70%
  );
}
.public-seal-card img {
  width: 94px;
  height: 94px;
  object-fit: contain;
  margin-bottom: 16px;
  filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.24));
}
.public-seal-card span {
  font-size: 12px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.86);
}
.public-seal-card strong {
  margin-top: 8px;
  font-size: 22px;
  font-weight: 950;
}
.citizen-center-card {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(360px, 0.85fr);
  gap: 28px;
  align-items: center;
  margin-bottom: 28px;
  padding: 38px;
  border-radius: 36px;
  color: #ffffff;
  background:
    linear-gradient(135deg, rgba(7, 48, 121, 0.98), rgba(37, 99, 235, 0.9)),
    url("../assets/BGC.jpg") center/cover no-repeat;
  box-shadow: 0 34px 80px rgba(15, 61, 135, 0.26);
}
.citizen-center-card::after {
  content: "";
  position: absolute;
  width: 520px;
  height: 520px;
  right: -170px;
  top: -190px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.24),
    transparent 68%
  );
  pointer-events: none;
}
.citizen-copy,
.kpi-grid {
  position: relative;
  z-index: 2;
}
.citizen-copy span,
.public-card-header > span,
.news-list article span,
.video-copy span {
  display: inline-flex;
  margin-bottom: 9px;
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.citizen-copy span {
  color: #bfdbfe;
}
.public-card-header > span,
.news-list article span,
.video-copy span {
  color: #2563eb;
}
.citizen-copy h3 {
  max-width: 720px;
  margin: 0;
  font-size: clamp(34px, 3.6vw, 52px);
  line-height: 1.02;
  letter-spacing: -0.06em;
  font-weight: 950;
}
.citizen-copy p {
  max-width: 700px;
  margin: 16px 0 0;
  color: rgba(255, 255, 255, 0.84);
  font-size: 15.5px;
  line-height: 1.75;
  font-weight: 650;
}
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.kpi-grid article {
  min-height: 154px;
  border-radius: 26px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(255, 255, 255, 0.13);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);
}
.kpi-grid strong {
  display: block;
  font-size: 42px;
  line-height: 1;
  font-weight: 950;
  letter-spacing: -0.04em;
}
.kpi-grid span {
  display: block;
  margin-top: 13px;
  color: rgba(255, 255, 255, 0.94);
  font-size: 13px;
  line-height: 1.3;
  font-weight: 900;
}
.kpi-grid small {
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.66);
  font-size: 11px;
  font-weight: 800;
}
.service-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;
  margin-bottom: 30px;
}
.service-card {
  position: relative;
  overflow: hidden;
  min-height: 208px;
  padding: 26px;
  border-radius: 30px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.98),
    rgba(248, 251, 255, 0.96)
  );
  transition:
    transform 0.24s ease,
    box-shadow 0.24s ease;
}
.service-card::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 6px;
  background: linear-gradient(180deg, #ef0b2a, #2563eb);
}
.service-card::after {
  content: "";
  position: absolute;
  width: 150px;
  height: 150px;
  right: -58px;
  bottom: -58px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.13), transparent 68%);
}
.service-card:hover {
  transform: translateY(-6px);
  box-shadow:
    0 34px 70px rgba(15, 23, 42, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}
.service-icon {
  width: 68px;
  height: 68px;
  border-radius: 23px;
  display: grid;
  place-items: center;
  color: #ffffff;
  background: linear-gradient(145deg, #2563eb, #0f3d87);
  font-size: 15px;
  font-weight: 950;
  box-shadow:
    0 18px 30px rgba(37, 99, 235, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}
.tone-red .service-icon {
  background: linear-gradient(145deg, #ef0b2a, #b91c1c);
}
.tone-cyan .service-icon {
  background: linear-gradient(145deg, #0891b2, #0f3d87);
}
.tone-navy .service-icon {
  background: linear-gradient(145deg, #0f172a, #0f3d87);
}
.service-card > span {
  display: block;
  margin-top: 18px;
  color: #2563eb;
  font-size: 11px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.service-card h3 {
  margin: 7px 0 8px;
  color: #0f3d87;
  font-size: 21px;
  line-height: 1.15;
  letter-spacing: -0.03em;
  font-weight: 950;
}
.service-card p {
  margin: 0;
  color: #5b6f86;
  font-size: 14.5px;
  line-height: 1.65;
  font-weight: 650;
}
.main-info-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 30px;
  margin-bottom: 30px;
}
.public-card,
.video-section {
  position: relative;
  overflow: hidden;
  padding: 34px;
  border-radius: 34px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.99),
    rgba(248, 251, 255, 0.96)
  );
}
.public-card::before,
.video-section::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 6px;
  background: linear-gradient(90deg, #ef0b2a, #2563eb, #93c5fd);
}
.public-card-header {
  margin-bottom: 20px;
}
.public-card-header h3 {
  margin: 0;
  color: #0f3d87;
  font-size: 31px;
  line-height: 1.05;
  letter-spacing: -0.05em;
  font-weight: 950;
}
.public-card-header p,
.video-section .public-card-header p {
  margin: 12px 0 0;
  color: #52677f;
  font-size: 15px;
  line-height: 1.75;
  font-weight: 650;
}
.agency-pillar-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.agency-pillar {
  position: relative;
  overflow: hidden;
  min-height: 150px;
  padding: 18px;
  border-radius: 22px;
  background: linear-gradient(180deg, #ffffff, #f8fbff);
  border: 1px solid #e2e8f0;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.045);
}
.agency-pillar::after {
  content: "";
  position: absolute;
  inset: auto -52px -52px auto;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.11), transparent 70%);
}
.agency-pillar > span {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: #1d4ed8;
  background: linear-gradient(180deg, #eff6ff, #dbeafe);
  border: 1px solid #bfdbfe;
  font-size: 12px;
  font-weight: 950;
  margin-bottom: 16px;
}
.agency-pillar h4 {
  margin: 0 0 8px;
  color: #0f172a;
  font-size: 16px;
  font-weight: 950;
  letter-spacing: -0.02em;
}
.agency-pillar p {
  margin: 0;
  color: #5b6f86;
  font-size: 13.5px;
  line-height: 1.55;
  font-weight: 650;
}
/* Professional Government Service Directory */
.service-directory-panel {
  display: grid;
  gap: 8px;
  padding: 12px;
  border-radius: 20px;
  background: #f8fafc;
  border: 1px solid #d8e0ea;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.82);
}
.directory-header {
  padding: 6px 14px 4px;
  color: #64748b;
  font-size: 10.5px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.directory-row {
  width: 100%;
  min-height: 70px;
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #ffffff;
  color: #1e293b;
  cursor: pointer;
  text-align: left;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
}
.directory-row:hover {
  background: #fbfdff;
  border-color: #cbd5e1;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
  transform: translateY(-1px);
}
.directory-row:focus-visible {
  outline: 3px solid rgba(15, 61, 135, 0.16);
  outline-offset: 2px;
}
.directory-left {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 14px;
}
.directory-number {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #f1f5f9;
  border: 1px solid #dbe3ee;
  color: #334155;
  font-size: 12px;
  font-weight: 950;
  letter-spacing: 0.02em;
}
.directory-copy {
  min-width: 0;
  display: grid;
  gap: 4px;
}
.directory-copy strong {
  color: #1e293b;
  font-size: 14.5px;
  font-weight: 900;
  line-height: 1.35;
}
.directory-copy small {
  color: #64748b;
  font-size: 11.5px;
  font-weight: 750;
  line-height: 1.35;
}
.split-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}
.split-header em {
  flex: 0 0 auto;
  min-height: 32px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0 13px;
  background: #ecfdf5;
  color: #047857;
  font-size: 11px;
  font-style: normal;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.news-list {
  display: grid;
  gap: 14px;
}
.news-item {
  display: grid;
  grid-template-columns: 154px 1fr;
  gap: 18px;
  align-items: center;
  padding: 18px;
  border-radius: 24px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.055);
}
.news-thumb {
  min-height: 128px;
  border-radius: 22px;
  background-size: cover;
  background-position: center;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}
.news-list h4 {
  margin: 0 0 8px;
  color: #0f172a;
  font-size: 19px;
  letter-spacing: -0.025em;
  font-weight: 950;
}
.news-list p {
  margin: 0;
  color: #5b6f86;
  font-size: 14.5px;
  line-height: 1.65;
  font-weight: 650;
}
.reminder-grid {
  display: grid;
  gap: 14px;
}
.reminder-item {
  position: relative;
  overflow: hidden;
  padding: 18px;
  border-radius: 22px;
  background: linear-gradient(180deg, #ffffff, #f8fbff);
  border: 1px solid #e2e8f0;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.045);
}
.reminder-item::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 5px;
  background: linear-gradient(180deg, #10b981, #2563eb);
}
.reminder-item > span {
  display: inline-flex;
  margin-bottom: 10px;
  padding: 5px 9px;
  border-radius: 999px;
  color: #047857;
  background: #ecfdf5;
  font-size: 10px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.reminder-item h4 {
  margin: 0 0 8px;
  color: #0f172a;
  font-size: 16px;
  font-weight: 950;
}
.reminder-item p {
  margin: 0;
  color: #5b6f86;
  font-size: 14px;
  line-height: 1.58;
  font-weight: 650;
}
.video-section {
  margin-top: 34px;
}
.video-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}
.video-card {
  overflow: hidden;
  border-radius: 28px;
  background: #ffffff;
  border: 1px solid rgba(191, 219, 254, 0.85);
  box-shadow: 0 24px 58px rgba(15, 23, 42, 0.1);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;
}
.video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 32px 65px rgba(15, 23, 42, 0.14);
}
.video-frame {
  position: relative;
  padding-top: 56.25%;
  background: linear-gradient(135deg, #0f3d87, #2563eb);
}
.video-frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
.video-copy {
  padding: 22px;
}
.video-copy h4 {
  margin: 0;
  color: #0f172a;
  font-size: 18px;
  line-height: 1.45;
  font-weight: 950;
}
.site-footer {
  background: linear-gradient(180deg, #0a3779, #072f6f);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 28px 36px;
}
.footer-container {
  width: min(1280px, 100%);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
}
.footer-brand img {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: contain;
  background: #fff;
}
.footer-brand div {
  display: flex;
  flex-direction: column;
}
.footer-brand strong {
  font-size: 14px;
  letter-spacing: 0.03em;
}
.footer-brand span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.78);
}
.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}
.footer-links a {
  color: rgba(255, 255, 255, 0.84);
  text-decoration: none;
  font-size: 13px;
}
.modal-overlay,
.transition-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.46);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 999;
  backdrop-filter: blur(8px);
}
.error-modal {
  width: 100%;
  max-width: 460px;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.32);
  overflow: hidden;
}
.error-modal-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 22px 24px 16px;
  background: linear-gradient(180deg, #fff5f5, #fff);
  border-bottom: 1px solid #f0d4d4;
}
.error-icon {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  border-radius: 50%;
  background: #d93025;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 950;
  font-size: 18px;
}
.error-modal-header h3 {
  margin: 0;
  color: #7a1c1c;
  font-size: 20px;
}
.error-modal-header p {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 13px;
}
.error-list {
  margin: 0;
  padding: 18px 24px 8px 42px;
}
.error-list li {
  margin-bottom: 10px;
  color: #374151;
  font-size: 14px;
  line-height: 1.45;
}
.modal-actions {
  padding: 0 22px 22px;
  display: flex;
  justify-content: flex-end;
}
.modal-btn {
  min-width: 96px;
  height: 42px;
  border: 0;
  border-radius: 12px;
  background: #0c49b4;
  color: #fff;
  font-size: 14px;
  font-weight: 850;
  cursor: pointer;
}
.transition-overlay {
  color: #fff;
  gap: 12px;
  font-weight: 950;
}
.transition-overlay span {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.38);
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1180px) {
  .cover-shell,
  .auth-layout,
  .public-heading-card,
  .citizen-center-card,
  .main-info-grid {
    grid-template-columns: 1fr;
  }
  .hero-card {
    justify-self: stretch;
  }
  .auth-side-panel {
    display: none;
  }
  .service-grid,
  .video-grid,
  .kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .register-grid.four,
  .register-grid.three,
  .register-grid.two {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 900px) {
  .topbar {
    position: relative;
    flex-direction: column;
    padding: 15px 18px;
  }
  .topbar-nav {
    justify-content: center;
  }
}
@media (max-width: 760px) {
  .cover-hero,
  .auth-stage,
  .register-stage {
    min-height: auto;
    padding: 72px 16px;
  }
  .cover-left h1 {
    font-size: 48px;
  }
  .cover-left p {
    font-size: 19px;
  }
  .hero-card {
    padding: 24px;
    border-radius: 26px;
  }
  .hero-stats,
  .password-rules,
  .register-grid.four,
  .register-grid.three,
  .register-grid.two,
  .service-grid,
  .video-grid,
  .kpi-grid,
  .agency-pillar-grid,
  .news-item {
    grid-template-columns: 1fr;
  }
  .panel-body,
  .register-panel {
    padding: 56px 20px 24px;
  }
  .login-panel,
  .register-panel {
    border-radius: 26px;
  }
  .register-header {
    flex-direction: column;
  }
  .register-actions,
  .form-meta,
  .show-options {
    flex-direction: column;
    align-items: stretch;
  }
  .public-section {
    padding: 58px 16px 68px;
  }
  .public-heading-card,
  .citizen-center-card,
  .public-card,
  .video-section {
    padding: 24px;
    border-radius: 26px;
  }
  .footer-container {
    flex-direction: column;
    align-items: flex-start;
  }
  .back-link {
    left: 18px;
    top: 18px;
  }
  .split-header {
    flex-direction: column;
  }
}
@media (max-width: 520px) {
  .brand-copy strong {
    font-size: 18px;
  }
  .nav-item {
    font-size: 11px;
    min-height: 36px;
    padding: 0 10px;
  }
  .panel-body h2,
  .register-header h2 {
    font-size: 32px;
  }
  .seal-wrap,
  .seal-logo {
    width: 124px;
    height: 124px;
  }
  .seal-wrap {
    top: -54px;
  }
  .public-heading-card h2 {
    font-size: 34px;
  }
  .citizen-copy h3 {
    font-size: 32px;
  }
}
@media (max-width: 520px) {
  .directory-header {
    display: none;
  }
  .directory-row {
    min-height: 76px;
  }
}
</style>

<style scoped>
/* LOGIN VIEW — PROFESSIONAL PREMIUM GOVERNMENT POLISH */
.auth-stage {
  min-height: calc(100vh - 82px) !important;
  padding: 88px 32px 86px !important;
  place-items: center !important;
  background:
    linear-gradient(
      115deg,
      rgba(241, 246, 252, 0.94),
      rgba(248, 250, 252, 0.97)
    ),
    url("../assets/BGC.jpg") center/cover no-repeat !important;
}

.auth-stage::before {
  background:
    linear-gradient(120deg, rgba(7, 48, 121, 0.09), transparent 38%),
    radial-gradient(circle at 82% 18%, rgba(7, 48, 121, 0.09), transparent 30%) !important;
}

.back-link {
  top: 28px !important;
  left: 32px !important;
  min-height: 42px !important;
  padding: 0 18px !important;
  border-radius: 999px !important;
  background: rgba(255, 255, 255, 0.94) !important;
  border: 1px solid #d6e0ec !important;
  color: #0f3d87 !important;
  font-size: 13px !important;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08) !important;
}

.auth-layout {
  width: min(1180px, 100%) !important;
  grid-template-columns: minmax(360px, 0.9fr) minmax(460px, 1fr) !important;
  gap: 34px !important;
  align-items: stretch !important;
}

.auth-side-panel {
  border-radius: 30px !important;
  padding: 46px 42px !important;
  background:
    linear-gradient(145deg, rgba(7, 48, 121, 0.97), rgba(10, 72, 158, 0.94)),
    url("../assets/BGC.jpg") center/cover no-repeat !important;
  box-shadow: 0 32px 70px rgba(7, 48, 121, 0.23) !important;
}

.auth-side-panel::after {
  opacity: 0.48 !important;
}

.side-kicker {
  background: rgba(255, 255, 255, 0.13) !important;
  border-color: rgba(255, 255, 255, 0.22) !important;
  color: rgba(255, 255, 255, 0.92) !important;
  letter-spacing: 0.14em !important;
}

.auth-side-panel h2 {
  max-width: 390px !important;
  margin-top: 24px !important;
  font-size: clamp(36px, 3.2vw, 48px) !important;
  line-height: 1.04 !important;
  letter-spacing: -0.055em !important;
}

.auth-side-panel p {
  max-width: 420px !important;
  font-size: 15.5px !important;
  color: rgba(255, 255, 255, 0.82) !important;
}

.auth-mini-list {
  margin-top: 34px !important;
  gap: 14px !important;
}

.auth-mini-list div {
  min-height: 58px !important;
  border-radius: 18px !important;
  background: rgba(255, 255, 255, 0.105) !important;
  border: 1px solid rgba(255, 255, 255, 0.16) !important;
  color: rgba(255, 255, 255, 0.92) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
}

.auth-mini-list span {
  background: rgba(255, 255, 255, 0.16) !important;
  border: 1px solid rgba(255, 255, 255, 0.28) !important;
  color: #ffffff !important;
}

.login-panel {
  max-width: 610px !important;
  border-radius: 30px !important;
  background: rgba(255, 255, 255, 0.98) !important;
  border: 1px solid #d8e3f0 !important;
  box-shadow:
    0 34px 74px rgba(15, 23, 42, 0.16),
    0 10px 26px rgba(7, 48, 121, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.94) !important;
}

.login-panel::before {
  height: 5px !important;
  background: linear-gradient(90deg, #c9a227, #0f3d87) !important;
}

.seal-wrap {
  top: -60px !important;
  width: 132px !important;
  height: 132px !important;
}

.seal-wrap::before {
  inset: 8px !important;
  background: #ffffff !important;
  border: 1px solid #d8e3f0 !important;
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.14) !important;
}

.seal-logo {
  width: 122px !important;
  height: 122px !important;
}

.panel-body {
  padding: 72px 48px 38px !important;
}

.panel-kicker {
  background: #f1f5f9 !important;
  border-color: #dbe3ee !important;
  color: #0f3d87 !important;
  font-size: 10.5px !important;
  letter-spacing: 0.12em !important;
}

.panel-body h2 {
  font-size: clamp(42px, 4vw, 56px) !important;
  background: none !important;
  color: #0f3d87 !important;
  letter-spacing: -0.055em !important;
}

.subtitle {
  margin-bottom: 30px !important;
  color: #52677f !important;
  font-size: 15px !important;
}

.field-shell label {
  color: #1e293b !important;
  font-size: 11.5px !important;
  letter-spacing: 0.075em !important;
}

.input-group {
  min-height: 60px !important;
  border-radius: 16px !important;
  border-color: #d8e0ea !important;
  background: #ffffff !important;
  box-shadow: none !important;
}

.input-group:focus-within {
  border-color: #0f3d87 !important;
  box-shadow: 0 0 0 4px rgba(15, 61, 135, 0.1) !important;
  transform: none !important;
}

.input-icon,
.password-toggle {
  width: 60px !important;
  height: 60px !important;
  flex-basis: 60px !important;
  color: #0f3d87 !important;
  background: #f1f5f9 !important;
}

.password-toggle {
  border-left-color: #d8e0ea !important;
}

.input-group input {
  min-height: 60px !important;
  color: #1e293b !important;
  letter-spacing: 0.02em !important;
}

.password-rules {
  border-radius: 14px !important;
  background: #f8fafc !important;
  border-color: #e2e8f0 !important;
  padding: 12px 14px !important;
}

.password-rules span {
  color: #64748b !important;
}

.password-rules span.ok {
  color: #0f3d87 !important;
}

.password-rules span.ok::before {
  color: #0f3d87 !important;
}

.captcha-card canvas {
  border-radius: 16px !important;
  border-color: #d8e0ea !important;
  box-shadow: none !important;
}

.refresh-code,
.forgot-link,
.auth-switch button,
.live-hint {
  color: #0f3d87 !important;
}

.login-btn {
  min-height: 60px !important;
  border-radius: 16px !important;
  background: linear-gradient(180deg, #0f3d87 0%, #082f74 100%) !important;
  box-shadow: 0 16px 28px rgba(15, 61, 135, 0.22) !important;
}

.demo-accounts {
  background: #f8fafc !important;
  border-color: #e2e8f0 !important;
  border-radius: 16px !important;
}

.demo-title {
  color: #0f3d87 !important;
}

@media (max-width: 1180px) {
  .auth-layout {
    grid-template-columns: 1fr !important;
    width: min(660px, 100%) !important;
  }

  .auth-side-panel {
    display: none !important;
  }

  .login-panel {
    max-width: 660px !important;
  }
}

@media (max-width: 760px) {
  .auth-stage {
    padding: 86px 16px 54px !important;
  }

  .panel-body {
    padding: 62px 22px 28px !important;
  }

  .seal-wrap {
    width: 116px !important;
    height: 116px !important;
    top: -52px !important;
  }

  .seal-logo {
    width: 108px !important;
    height: 108px !important;
  }
}
</style>

<style scoped>
/* FINAL GOVERNMENT LOGIN PANEL REFINEMENT */
.auth-layout {
  width: min(1120px, 100%) !important;
  grid-template-columns: minmax(340px, 0.82fr) minmax(460px, 1fr) !important;
  gap: 28px !important;
  align-items: stretch !important;
}

.gov-info-panel {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  padding: 44px 38px;
  color: #ffffff;
  background:
    linear-gradient(180deg, rgba(9, 55, 128, 0.98), rgba(7, 42, 96, 0.98)),
    url("../assets/BGC.jpg") center/cover no-repeat;
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 30px 68px rgba(15, 23, 42, 0.22);
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 620px;
}

.gov-info-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
  background-size: 42px 42px;
  opacity: 0.45;
  pointer-events: none;
}

.gov-info-panel::after {
  content: "";
  position: absolute;
  right: -140px;
  bottom: -150px;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.18),
    transparent 70%
  );
  pointer-events: none;
}

.gov-info-panel > * {
  position: relative;
  z-index: 1;
}

.gov-badge {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 13px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.11);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.88);
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.gov-info-panel h1 {
  max-width: 390px;
  margin: 22px 0 0;
  color: #ffffff;
  font-size: clamp(34px, 3vw, 44px);
  line-height: 1.06;
  letter-spacing: -0.055em;
  font-weight: 950;
}

.gov-info-panel p {
  max-width: 430px;
  margin: 18px 0 0;
  color: rgba(226, 232, 240, 0.9);
  font-size: 15px;
  line-height: 1.75;
  font-weight: 650;
}

.gov-divider {
  width: 100%;
  height: 1px;
  margin: 30px 0 24px;
  background: rgba(255, 255, 255, 0.18);
}

.gov-meta {
  display: grid;
  gap: 12px;
}

.gov-meta div {
  padding: 15px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.13);
}

.gov-meta strong {
  display: block;
  margin-bottom: 5px;
  color: rgba(203, 213, 225, 0.85);
  font-size: 10.5px;
  font-weight: 950;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.gov-meta span {
  color: #ffffff;
  font-size: 14px;
  font-weight: 850;
}

.login-panel {
  box-shadow: 0 30px 70px rgba(15, 23, 42, 0.18) !important;
}

@media (max-width: 1180px) {
  .auth-layout {
    grid-template-columns: 1fr !important;
  }

  .gov-info-panel {
    display: none;
  }
}

/* CENTERED PROFESSIONAL GOVERNMENT LOGIN */
.centered-login-stage {
  min-height: calc(100vh - 82px);
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 96px 24px 76px !important;
  background-position: center !important;
  background-size: cover !important;
}

.centered-login-stage::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at 50% 18%,
      rgba(255, 255, 255, 0.62),
      transparent 34%
    ),
    linear-gradient(180deg, rgba(241, 245, 249, 0.22), rgba(226, 232, 240, 0.5));
  pointer-events: none;
}

.login-back-link {
  top: 28px;
  left: 36px;
}

.center-login-card {
  position: relative;
  z-index: 3;
  width: min(480px, 100%);
  padding: 42px 38px 34px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(203, 213, 225, 0.9);
  box-shadow:
    0 30px 80px rgba(15, 23, 42, 0.2),
    0 10px 28px rgba(15, 61, 135, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 1);
  text-align: center;
  overflow: hidden;
}

.center-login-card::before {
  content: "";
  position: absolute;
  inset: 0 0 auto;
  height: 5px;
  background: #0f3d87;
}

.center-login-seal {
  width: 92px;
  height: 92px;
  margin: 0 auto 16px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #ffffff;
  border: 1px solid #dbe3ee;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.12);
}

.center-login-seal img {
  width: 78px;
  height: 78px;
  object-fit: contain;
}

.center-login-header {
  margin-bottom: 24px;
}

.center-login-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #0f3d87;
  font-size: 11px;
  font-weight: 950;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.center-login-header h2 {
  margin: 14px 0 8px;
  color: #0f2f6f;
  font-size: 34px;
  line-height: 1;
  font-weight: 950;
  letter-spacing: -0.045em;
}

.center-login-header p {
  max-width: 360px;
  margin: 0 auto;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  font-weight: 650;
}

.center-login-form {
  display: grid;
  gap: 15px;
  text-align: left;
}

.official-input {
  min-height: 56px !important;
  border-radius: 14px !important;
  background: #ffffff !important;
  border: 1px solid #d7e0ea !important;
  box-shadow: none !important;
}

.official-input:focus-within {
  border-color: #0f3d87 !important;
  box-shadow: 0 0 0 4px rgba(15, 61, 135, 0.1) !important;
  transform: none !important;
}

.official-input .input-icon,
.official-input .password-toggle {
  width: 56px !important;
  height: 56px !important;
  flex-basis: 56px !important;
  background: #f1f5f9 !important;
  color: #0f3d87 !important;
}

.official-input input {
  min-height: 56px !important;
  font-size: 14px !important;
  font-weight: 750 !important;
  letter-spacing: 0 !important;
}

.official-rules {
  grid-template-columns: 1fr 1fr;
  padding: 11px 12px;
  background: #f8fafc;
  border-color: #e2e8f0;
  border-radius: 14px;
}

.center-captcha-row {
  display: grid;
  grid-template-columns: 1fr 46px;
  align-items: stretch;
  gap: 10px;
}

.center-captcha-row canvas {
  width: 100%;
  height: 78px;
  border-radius: 14px;
  border: 1px solid #d7e0ea;
  background: #f8fafc;
  box-shadow: none;
}

.center-refresh-code {
  border: 1px solid #d7e0ea;
  border-radius: 14px;
  background: #f8fafc;
  color: #0f3d87;
  font-size: 22px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.16s ease;
}

.center-refresh-code:hover {
  background: #eef2f7;
}

.center-form-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.center-login-btn {
  width: 100%;
  min-height: 54px;
  border: 0;
  border-radius: 14px;
  background: #0f3d87;
  color: #ffffff;
  font-size: 15px;
  font-weight: 950;
  letter-spacing: 0.03em;
  cursor: pointer;
  box-shadow: 0 16px 28px rgba(15, 61, 135, 0.22);
  transition: 0.18s ease;
}

.center-login-btn:hover {
  background: #0a3274;
  transform: translateY(-1px);
}

.center-demo-note {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
}

.center-demo-note button {
  border: 0;
  background: transparent;
  color: #0f3d87;
  font-weight: 950;
  cursor: pointer;
}

@media (max-width: 560px) {
  .center-login-card {
    padding: 34px 22px 28px;
    border-radius: 22px;
  }

  .center-login-header h2 {
    font-size: 28px;
  }

  .center-form-meta,
  .official-rules {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
