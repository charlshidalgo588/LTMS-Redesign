<script setup lang="ts">
import logo from "../assets/logo.png";
import bgImage from "../assets/BGC.jpg";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const showPassword = ref(false);
const username = ref("");
const password = ref("");
const captchaInput = ref("");
const rememberUsername = ref(false);

const captchaCode = ref("");
const captchaCanvas = ref<HTMLCanvasElement | null>(null);

const errorModalOpen = ref(false);
const errorTitle = ref("Login Error");
const errorMessages = ref<string[]>([]);

const mockAccounts = [
  { username: "sampleuser@gmail.com", password: "Password@123" },
  { username: "26-050525-2424960", password: "Driver@2025" },
  { username: "ltoportal@gmail.com", password: "Portal#2025" },
];

const ltoNews = ref([
  {
    title: "LTO Portal Online Access",
    date: "Digital Service",
    text: "Access account services, appointments, and selected licensing transactions through the LTMS portal.",
    image: bgImage,
  },
  {
    title: "Driver's License Application Guidance",
    date: "Citizen Advisory",
    text: "Applicants are encouraged to review requirements and prepare complete documentation before proceeding to LTO offices.",
    image: bgImage,
  },
  {
    title: "Road Safety and Compliance",
    date: "Public Reminder",
    text: "LTO continues to promote safer roads through compliance, updated records, and responsible driving practices.",
    image: bgImage,
  },
]);

const ltoServices = ref([
  "Driver's License Application and Renewal",
  "Student Permit Processing",
  "Vehicle Registration Transactions",
  "Online Appointment Scheduling",
  "Verification of Client Records",
  "Road Safety Information Services",
]);

const featuredMedia = ref([
  {
    title: "LTO Public Information",
    type: "photo",
    subtitle: "Citizen-facing digital services",
    text: "A more premium government landing page benefits from strong visual anchors, service summaries, and public advisories.",
    image: bgImage,
  },
  {
    title: "Online Transactions and Portal Access",
    type: "photo",
    subtitle: "Official digital service experience",
    text: "Showcase access to portal services, account login, appointment booking, and information updates.",
    image: bgImage,
  },
  {
    title: "Transportation Safety and Compliance",
    type: "photo",
    subtitle: "Public road safety messaging",
    text: "Use official-looking banner photography and clean overlays to make the page feel more institutional.",
    image: bgImage,
  },
]);

const ltoVideos = ref([
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
]);

const isGmail = (value: string) => {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(value.trim());
};

const isLtoClientNumber = (value: string) => {
  return /^\d{2}-\d{6}-\d{7}$/.test(value.trim());
};

const usernameHint = computed(() => {
  if (!username.value) return "";
  if (isGmail(username.value)) return "Detected Gmail account format";
  if (isLtoClientNumber(username.value))
    return "Detected LTO client number format";
  return "Use a valid Gmail address or LTO client number";
});

const passwordChecks = computed(() => {
  const value = password.value;
  return {
    minLength: value.length >= 8,
    firstUppercase: /^[A-Z]/.test(value),
    hasNumber: /\d/.test(value),
    hasSpecial: /[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]/.test(value),
  };
});

function randomFrom(chars: string) {
  return chars[Math.floor(Math.random() * chars.length)];
}

function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 5; i += 1) result += randomFrom(chars);
  captchaCode.value = result;
  drawCaptcha();
}

function drawCaptcha() {
  const canvas = captchaCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#f7f7f7");
  gradient.addColorStop(0.5, "#ececec");
  gradient.addColorStop(1, "#e2e2e2");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 28; i += 1) {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(${120 + Math.random() * 70}, ${120 + Math.random() * 70}, ${120 + Math.random() * 70}, 0.18)`;
    ctx.lineWidth = Math.random() * 1.2 + 0.4;
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.lineTo(Math.random() * width, Math.random() * height);
    ctx.stroke();
  }

  for (let i = 0; i < 120; i += 1) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(${110 + Math.random() * 90}, ${110 + Math.random() * 90}, ${110 + Math.random() * 90}, 0.12)`;
    ctx.arc(
      Math.random() * width,
      Math.random() * height,
      Math.random() * 1.6,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  const chars = captchaCode.value.split("");
  const section = width / (chars.length + 1);

  chars.forEach((char, index) => {
    const x = section * (index + 1);
    const y = height / 2 + 10 + (Math.random() * 10 - 5);
    const rotation = Math.random() * 0.5 - 0.25;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.font = `${52 + Math.floor(Math.random() * 8)}px Arial Black`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = index % 2 === 0 ? "#be1e2d" : "#d23232";
    ctx.shadowColor = "rgba(80,0,0,0.25)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 2;
    ctx.fillText(char, 0, 0);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(120, 10, 10, 0.35)";
    ctx.strokeText(char, 0, 0);
    ctx.restore();
  });

  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.strokeStyle = "rgba(70, 70, 70, 0.22)";
    ctx.lineWidth = 1.2;
    ctx.moveTo(0, Math.random() * height);
    ctx.bezierCurveTo(
      width * 0.3,
      Math.random() * height,
      width * 0.7,
      Math.random() * height,
      width,
      Math.random() * height,
    );
    ctx.stroke();
  }
}

function openErrorModal(title: string, messages: string[]) {
  errorTitle.value = title;
  errorMessages.value = messages;
  errorModalOpen.value = true;
}

function closeErrorModal() {
  errorModalOpen.value = false;
}

function validateUsername(value: string) {
  const messages: string[] = [];
  const trimmed = value.trim();

  if (!trimmed) {
    messages.push("Username is required.");
    return messages;
  }

  if (!isGmail(trimmed) && !isLtoClientNumber(trimmed)) {
    messages.push(
      "Enter either a valid Gmail address or a valid LTO client number.",
    );
    messages.push(
      "LTO client number format must look like: 26-050525-2424960.",
    );
  }

  return messages;
}

function validatePassword(value: string) {
  const messages: string[] = [];

  if (!value) {
    messages.push("Password is required.");
    return messages;
  }
  if (value.length < 8)
    messages.push("Password must be at least 8 characters long.");
  if (!/^[A-Z]/.test(value))
    messages.push("Password must start with a capital letter.");
  if (!/\d/.test(value))
    messages.push("Password must include at least one number.");
  if (!/[!@#$%^&*()_\-+=[\]{};:'\",.<>/?\\|`~]/.test(value)) {
    messages.push("Password must include at least one special character.");
  }

  return messages;
}

function validateCaptcha() {
  const messages: string[] = [];
  const input = captchaInput.value.trim().toUpperCase();

  if (!input) {
    messages.push("Security code is required.");
    return messages;
  }

  if (input !== captchaCode.value) {
    messages.push("Security code does not match the CAPTCHA.");
  }

  return messages;
}

function handleLogin() {
  const problems = [
    ...validateUsername(username.value),
    ...validatePassword(password.value),
    ...validateCaptcha(),
  ];

  if (problems.length > 0) {
    openErrorModal("Please correct the following", problems);
    if (captchaInput.value.trim().toUpperCase() !== captchaCode.value) {
      captchaInput.value = "";
      generateCaptcha();
    }
    return;
  }

  const matchedAccount = mockAccounts.find(
    (account) =>
      account.username.toLowerCase() === username.value.trim().toLowerCase() &&
      account.password === password.value,
  );

  if (!matchedAccount) {
    openErrorModal("Invalid credentials", [
      "The username and password do not match our mock records.",
      "Try one of the demo accounts listed below the form.",
    ]);
    generateCaptcha();
    captchaInput.value = "";
    return;
  }

  router.push("/home");
}

onMounted(() => {
  generateCaptcha();
});
</script>

<template>
  <div
    class="page"
    :style="{
      backgroundImage: `linear-gradient(rgba(239,244,250,0.76), rgba(239,244,250,0.80)), url(${bgImage})`,
    }"
  >
    <header class="topbar">
      <div class="topbar-left">
        <img class="brand-logo" :src="logo" alt="LTO Logo" />
        <span class="brand-text">LTO PORTAL</span>
      </div>

      <nav class="topbar-nav">
        <a href="#" class="nav-item">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M19 18a3 3 0 0 0 0-6h-1a6 6 0 1 0-11.6 1.8A3.5 3.5 0 0 0 7 21h12"
            />
          </svg>
          <span>LTO OFFICIAL WEBPAGE</span>
        </a>
        <a href="#" class="nav-item">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z" />
            <path d="M6.5 10.5V15L12 18l5.5-3v-4.5" />
          </svg>
          <span>E-LEARNING</span>
        </a>
        <a href="#" class="nav-item">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M7 5h3l1.5 3.2-1.9 1.9a13.5 13.5 0 0 0 4.3 4.3l1.9-1.9L19 14v3a1 1 0 0 1-1 1C10.8 18 6 13.2 6 7a1 1 0 0 1 1-1Z"
            />
          </svg>
          <span>CONTACT</span>
        </a>
        <a href="#" class="nav-item">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="3.2" />
            <path d="M5 19c0-3.4 3.2-5.4 7-5.4s7 2 7 5.4" />
          </svg>
          <span>REGISTER</span>
        </a>
        <a href="#" class="nav-item">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="3.2" />
            <path d="M5 19c0-3.4 3.2-5.4 7-5.4s7 2 7 5.4" />
          </svg>
          <span>LOGIN</span>
        </a>
      </nav>
    </header>

    <main class="hero-area">
      <section class="login-panel">
        <div class="seal-wrap">
          <img :src="logo" alt="LTO Seal" class="seal-logo" />
        </div>

        <div class="panel-body">
          <div class="panel-kicker">Official Portal Access</div>
          <h1>LTO PORTAL</h1>
          <p class="subtitle">Land Transportation Management System</p>

          <form class="login-form" @submit.prevent="handleLogin">
            <div class="input-group">
              <span class="input-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="3.2" />
                  <path d="M5 19c0-3.4 3.2-5.4 7-5.4s7 2 7 5.4" />
                </svg>
              </span>
              <input
                v-model="username"
                type="text"
                placeholder="EMAIL OR LTO CLIENT NUMBER"
                autocomplete="username"
              />
            </div>

            <p v-if="usernameHint" class="live-hint">{{ usernameHint }}</p>

            <div class="input-group">
              <span class="input-icon" aria-hidden="true">
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
                placeholder="PASSWORD"
                autocomplete="current-password"
              />

              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
                aria-label="Toggle password visibility"
              >
                <svg
                  v-if="!showPassword"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                  <circle cx="12" cy="12" r="2.8" />
                </svg>
                <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 3l18 18" />
                  <path
                    d="M2 12s3.5-6 10-6c2.1 0 3.9.6 5.4 1.6M22 12s-3.5 6-10 6c-2.1 0-3.9-.6-5.4-1.6"
                  />
                </svg>
              </button>
            </div>

            <div class="password-rules">
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

            <div class="captcha-box">
              <canvas
                ref="captchaCanvas"
                width="265"
                height="92"
                aria-label="Security code"
              ></canvas>
            </div>

            <button type="button" class="refresh-code" @click="generateCaptcha">
              refresh security code
            </button>

            <div class="input-group">
              <span class="input-icon hash-icon" aria-hidden="true">#</span>
              <input
                v-model="captchaInput"
                type="text"
                placeholder="SECURITY CODE (ABOVE)"
              />
            </div>

            <div class="form-meta">
              <label class="remember-me">
                <input v-model="rememberUsername" type="checkbox" />
                <span>Remember Username</span>
              </label>
              <a href="#" class="forgot-link">Forgot Password</a>
            </div>

            <button type="submit" class="login-btn">LOGIN</button>
          </form>

          <div class="demo-accounts">
            <p class="demo-title">Mock accounts for testing</p>
            <ul>
              <li><strong>sampleuser@gmail.com</strong> / Password@123</li>
              <li><strong>26-050525-2424960</strong> / Driver@2025</li>
              <li><strong>ltoportal@gmail.com</strong> / Portal#2025</li>
            </ul>
          </div>
        </div>
      </section>

      <div class="mid-badge">
        <img :src="logo" alt="LTO Logo" />
        <div>
          <strong>MANAGEMENT</strong>
          <strong>INFORMATION</strong>
          <strong>DIVISION (MID)</strong>
        </div>
      </div>
    </main>

    <section class="info-section">
      <div class="info-container">
        <div class="section-heading">
          <span class="section-kicker">Public Information</span>
          <h2>Official Information, Media, and Online Services</h2>
          <p>
            Explore core LTO services, public reminders, media highlights, and
            official video guides in a more polished government-style
            information layout.
          </p>
        </div>

        <div class="highlight-band">
          <div class="highlight-card">
            <div class="highlight-icon">24/7</div>
            <div>
              <strong>Online Access</strong>
              <span>Portal-first government services for citizens</span>
            </div>
          </div>
          <div class="highlight-card">
            <div class="highlight-icon">ID</div>
            <div>
              <strong>Records & Verification</strong>
              <span>Access client and transaction information securely</span>
            </div>
          </div>
          <div class="highlight-card">
            <div class="highlight-icon">RS</div>
            <div>
              <strong>Road Safety</strong>
              <span>Public advisories and responsible transport guidance</span>
            </div>
          </div>
        </div>

        <div class="info-grid premium-grid">
          <article class="info-card about-card">
            <div class="card-header">
              <h3>About LTO</h3>
            </div>
            <p>
              The Land Transportation Office is responsible for driver
              licensing, vehicle registration, law enforcement support, and
              public road transport regulation. A premium government landing
              page should communicate trust, clarity, and public service value
              immediately.
            </p>
            <ul class="bullet-list">
              <li>Promotes safer and more responsible driving</li>
              <li>Supports digital government transaction services</li>
              <li>Improves access to licensing and registration records</li>
              <li>Provides service advisories and transport information</li>
            </ul>
          </article>

          <article class="info-card services-card">
            <div class="card-header">
              <h3>Online Services</h3>
            </div>
            <ul class="service-list">
              <li v-for="service in ltoServices" :key="service">
                <span class="service-dot"></span>
                <span>{{ service }}</span>
              </li>
            </ul>
          </article>
        </div>

        <div class="media-gallery">
          <article
            v-for="item in featuredMedia"
            :key="item.title"
            class="media-photo-card"
          >
            <div
              class="media-photo"
              :style="{
                backgroundImage: `linear-gradient(rgba(12,37,79,0.18), rgba(12,37,79,0.46)), url(${item.image})`,
              }"
            >
              <span class="media-chip">{{ item.type }}</span>
            </div>
            <div class="media-copy">
              <span class="media-subtitle">{{ item.subtitle }}</span>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </div>
          </article>
        </div>

        <div class="info-grid lower-grid">
          <article class="info-card news-card">
            <div class="card-header">
              <h3>Latest News & Announcements</h3>
            </div>
            <div class="news-list">
              <div v-for="item in ltoNews" :key="item.title" class="news-item">
                <div
                  class="news-thumb"
                  :style="{
                    backgroundImage: `linear-gradient(rgba(11,74,178,0.12), rgba(11,74,178,0.28)), url(${item.image})`,
                  }"
                ></div>
                <div class="news-content">
                  <div class="news-meta">{{ item.date }}</div>
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.text }}</p>
                </div>
              </div>
            </div>
          </article>

          <article class="info-card reminders-card">
            <div class="card-header">
              <h3>Important Reminders</h3>
            </div>
            <ul class="bullet-list">
              <li>Prepare valid identification and supporting documents.</li>
              <li>Review portal entries carefully before submitting forms.</li>
              <li>Keep your client number and registered email secure.</li>
              <li>
                Verify schedules and service advisories before visiting an
                office.
              </li>
              <li>
                Use only official LTO channels for transactions and updates.
              </li>
            </ul>
          </article>
        </div>

        <div class="video-section">
          <div class="card-header video-header">
            <h3>Official Video Guides</h3>
            <p>
              Embed official LTO video explainers to make the page more useful
              and credible.
            </p>
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
                <span class="video-badge">{{ video.category }}</span>
                <h4>{{ video.title }}</h4>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-brand">
          <img :src="logo" alt="LTO Logo" />
          <div>
            <strong>LTO PORTAL</strong>
            <span>Land Transportation Management System</span>
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
            <p>Please review the fields below.</p>
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
  font-family: Arial, Helvetica, sans-serif;
}

:global(body) {
  background: #e7edf5;
  color: #1e2a38;
}

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.topbar {
  height: 78px;
  background: linear-gradient(180deg, #0b4ab2 0%, #083c95 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 6px 18px rgba(9, 42, 98, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-logo {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
  flex: 0 0 40px;
}

.brand-text {
  color: #ffffff;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 0.3px;
}

.topbar-nav {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: rgba(255, 255, 255, 0.96);
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.35px;
  white-space: nowrap;
}

.nav-item svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.95;
}

.hero-area {
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 52px 20px 56px;
}

.login-panel {
  position: relative;
  width: 100%;
  max-width: 500px;
  background: linear-gradient(
    180deg,
    rgba(250, 250, 250, 0.97) 0%,
    rgba(239, 239, 239, 0.97) 100%
  );
  border-radius: 18px;
  box-shadow:
    0 22px 48px rgba(57, 76, 102, 0.2),
    0 3px 8px rgba(57, 76, 102, 0.08);
  border: 1px solid rgba(205, 214, 226, 0.95);
  padding-top: 58px;
  overflow: visible;
}

.seal-wrap {
  position: absolute;
  top: -66px;
  left: 50%;
  transform: translateX(-50%);
  width: 156px;
  height: 156px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.seal-logo {
  width: 156px;
  height: 156px;
  object-fit: contain;
  filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.1));
}

.panel-body {
  padding: 62px 34px 30px;
  text-align: center;
}

.panel-kicker {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(11, 74, 178, 0.08);
  color: #0b4ab2;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 14px;
}

.panel-body h1 {
  margin: 0;
  color: #14459a;
  font-size: 54px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.subtitle {
  margin: 12px 0 28px;
  color: #445c7b;
  font-size: 16px;
  font-weight: 400;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.input-group {
  height: 48px;
  background: #f8f8f8;
  border: 1px solid #ccd2da;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.input-icon {
  width: 48px;
  height: 100%;
  flex: 0 0 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #747474;
  border-right: 1px solid #d7d7d7;
  background: rgba(255, 255, 255, 0.65);
}

.input-icon svg {
  width: 19px;
  height: 19px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.hash-icon {
  font-size: 31px;
  font-weight: 400;
  line-height: 1;
  color: #666666;
}

.input-group input {
  width: 100%;
  height: 100%;
  border: 0;
  outline: none;
  background: transparent;
  padding: 0 14px;
  font-size: 13px;
  color: #404040;
  letter-spacing: 0.3px;
}

.input-group input::placeholder {
  color: #8d8d8d;
  opacity: 1;
}

.password-toggle {
  width: 48px;
  height: 100%;
  border: 0;
  background: transparent;
  border-left: 1px solid #d7d7d7;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: #6d6d6d;
}

.password-toggle svg {
  width: 19px;
  height: 19px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.live-hint {
  margin: -4px 2px 0;
  text-align: left;
  font-size: 12px;
  color: #597298;
}

.password-rules {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 10px;
  text-align: left;
}

.password-rules span {
  font-size: 11px;
  color: #7a8591;
  padding-left: 14px;
  position: relative;
}

.password-rules span::before {
  content: "•";
  position: absolute;
  left: 0;
  top: 0;
  color: #9ba8b4;
}

.password-rules span.ok {
  color: #1b7a38;
  font-weight: 700;
}

.password-rules span.ok::before {
  content: "✓";
  color: #1b7a38;
}

.captcha-box {
  width: 265px;
  max-width: 100%;
  height: 92px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 20% 20%, rgba(0, 0, 0, 0.03) 0, transparent 32%),
    radial-gradient(circle at 80% 60%, rgba(0, 0, 0, 0.04) 0, transparent 30%),
    linear-gradient(180deg, #ededed 0%, #e5e5e5 100%);
  border: 1px solid #dddddd;
  border-radius: 6px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.captcha-box canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.refresh-code {
  margin: -2px auto 4px;
  border: 0;
  background: transparent;
  color: #395988;
  font-size: 14px;
  cursor: pointer;
}

.form-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.remember-me {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  color: #575757;
  cursor: pointer;
}

.remember-me input {
  width: 16px;
  height: 16px;
  margin: 0;
}

.forgot-link {
  color: #506c9d;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}

.login-btn {
  height: 52px;
  border: 0;
  border-radius: 8px;
  background: linear-gradient(180deg, #0c49b4 0%, #073b98 100%);
  color: #ffffff;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 0.2px;
  cursor: pointer;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    0 6px 14px rgba(8, 58, 145, 0.22);
}

.demo-accounts {
  margin-top: 18px;
  padding: 14px 16px;
  background: rgba(17, 69, 154, 0.05);
  border: 1px solid rgba(17, 69, 154, 0.12);
  border-radius: 10px;
  text-align: left;
}

.demo-title {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 800;
  color: #17488f;
}

.demo-accounts ul {
  margin: 0;
  padding-left: 16px;
}

.demo-accounts li {
  font-size: 12px;
  color: #4e5c6d;
  line-height: 1.55;
}

.mid-badge {
  position: absolute;
  right: 24px;
  bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 14px 18px;
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.85); /* brighter */
  backdrop-filter: blur(6px);

  border: 1px solid rgba(11, 74, 178, 0.15);

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.mid-badge img {
  width: 44px;
  height: 44px;
  object-fit: contain;
  opacity: 0.95;
}

.mid-badge div {
  display: flex;
  flex-direction: column;
  line-height: 1.03;
}

.mid-badge strong {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.5px;

  color: #0b4ab2; /* LTO BLUE */
}

.info-section {
  background: linear-gradient(180deg, #f3f7fb 0%, #ebf1f7 100%);
  border-top: 1px solid rgba(181, 196, 214, 0.55);
  padding: 64px 24px 72px;
}

.info-container {
  width: min(1280px, 100%);
  margin: 0 auto;
}

.section-heading {
  text-align: center;
  max-width: 860px;
  margin: 0 auto 34px;
}

.section-kicker {
  display: inline-block;
  margin-bottom: 10px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(11, 74, 178, 0.08);
  color: #0b4ab2;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.section-heading h2 {
  margin: 0 0 12px;
  color: #123f8e;
  font-size: 36px;
  line-height: 1.15;
}

.section-heading p {
  margin: 0;
  color: #51657f;
  font-size: 15px;
  line-height: 1.7;
}

.highlight-band {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.highlight-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(188, 203, 221, 0.88);
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 10px 22px rgba(66, 90, 122, 0.06);
}

.highlight-card strong {
  display: block;
  color: #163d7b;
  font-size: 16px;
  margin-bottom: 4px;
}

.highlight-card span {
  color: #5c6f84;
  font-size: 13px;
  line-height: 1.5;
}

.highlight-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(180deg, #0b4ab2 0%, #083b94 100%);
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 15px;
  font-weight: 800;
  flex: 0 0 52px;
}

.info-grid {
  display: grid;
  gap: 22px;
}

.premium-grid {
  grid-template-columns: 1.05fr 0.95fr;
  margin-bottom: 24px;
}

.lower-grid {
  grid-template-columns: 1.1fr 0.9fr;
  margin-top: 24px;
}

.info-card {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(190, 203, 220, 0.88);
  border-radius: 18px;
  padding: 24px 24px 22px;
  box-shadow: 0 12px 28px rgba(66, 90, 122, 0.08);
}

.card-header {
  margin-bottom: 14px;
}

.card-header h3 {
  margin: 0;
  color: #153d7b;
  font-size: 22px;
}

.about-card p {
  margin: 0 0 16px;
  color: #55697f;
  font-size: 14px;
  line-height: 1.75;
}

.bullet-list {
  margin: 0;
  padding-left: 18px;
}

.bullet-list li {
  margin-bottom: 10px;
  color: #51657b;
  font-size: 14px;
  line-height: 1.6;
}

.service-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.service-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 11px 0;
  border-bottom: 1px solid rgba(219, 228, 239, 0.8);
  color: #4f637b;
  font-size: 14px;
  line-height: 1.55;
}

.service-list li:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.service-dot {
  width: 9px;
  height: 9px;
  margin-top: 6px;
  border-radius: 50%;
  background: #0b4ab2;
  flex: 0 0 9px;
}

.media-gallery {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.media-photo-card {
  overflow: hidden;
  background: #fff;
  border-radius: 18px;
  border: 1px solid rgba(190, 203, 220, 0.88);
  box-shadow: 0 12px 28px rgba(66, 90, 122, 0.08);
}

.media-photo {
  height: 220px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.media-chip {
  position: absolute;
  top: 14px;
  left: 14px;
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);
  color: #123f8e;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.media-copy {
  padding: 18px;
}

.media-subtitle {
  display: block;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.45px;
  color: #0b4ab2;
  margin-bottom: 8px;
}

.media-copy h3 {
  margin: 0 0 8px;
  color: #22384f;
  font-size: 19px;
}

.media-copy p {
  margin: 0;
  color: #617387;
  font-size: 14px;
  line-height: 1.65;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.news-item {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(219, 228, 239, 0.85);
}

.news-item:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.news-thumb {
  min-height: 86px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
}

.news-meta {
  font-size: 11px;
  font-weight: 800;
  color: #0b4ab2;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.news-item h4 {
  margin: 0 0 6px;
  font-size: 16px;
  color: #243a54;
}

.news-item p {
  margin: 0;
  font-size: 14px;
  color: #5b6e83;
  line-height: 1.6;
}

.video-section {
  margin-top: 28px;
  padding: 28px;
  border-radius: 20px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.92) 0%,
    rgba(247, 250, 253, 0.92) 100%
  );
  border: 1px solid rgba(190, 203, 220, 0.88);
  box-shadow: 0 12px 28px rgba(66, 90, 122, 0.08);
}

.video-header {
  margin-bottom: 18px;
}

.video-header p {
  margin: 8px 0 0;
  color: #5d7086;
  font-size: 14px;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.video-card {
  background: #fff;
  border: 1px solid rgba(212, 221, 232, 0.95);
  border-radius: 16px;
  overflow: hidden;
}

.video-frame {
  position: relative;
  padding-top: 56.25%;
  background: #dbe7f6;
}

.video-frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.video-copy {
  padding: 16px;
}

.video-badge {
  display: inline-flex;
  margin-bottom: 8px;
  padding: 5px 9px;
  border-radius: 999px;
  background: rgba(11, 74, 178, 0.08);
  color: #0b4ab2;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

.video-copy h4 {
  margin: 0;
  color: #243a54;
  font-size: 15px;
  line-height: 1.45;
}

.site-footer {
  background: #0c2f6f;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 22px 24px;
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
  color: #ffffff;
}

.footer-brand img {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: contain;
}

.footer-brand div {
  display: flex;
  flex-direction: column;
}

.footer-brand strong {
  font-size: 14px;
  letter-spacing: 0.3px;
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

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 999;
}

.error-modal {
  width: 100%;
  max-width: 460px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.3);
  overflow: hidden;
}

.error-modal-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 20px 22px 14px;
  background: linear-gradient(180deg, #fff5f5 0%, #ffffff 100%);
  border-bottom: 1px solid #f0d4d4;
}

.error-icon {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border-radius: 50%;
  background: #d93025;
  color: #ffffff;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 18px;
}

.error-modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #7a1c1c;
}

.error-modal-header p {
  margin: 4px 0 0;
  font-size: 13px;
  color: #6b7280;
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
  padding: 0 22px 20px;
  display: flex;
  justify-content: flex-end;
}

.modal-btn {
  min-width: 92px;
  height: 40px;
  border: 0;
  border-radius: 8px;
  background: #0c49b4;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 1180px) {
  .highlight-band,
  .media-gallery,
  .video-grid,
  .premium-grid,
  .lower-grid {
    grid-template-columns: 1fr;
  }

  .news-item {
    grid-template-columns: 1fr;
  }

  .news-thumb {
    min-height: 160px;
  }
}

@media (max-width: 1100px) {
  .topbar {
    height: auto;
    flex-direction: column;
    gap: 12px;
    padding: 14px 18px;
  }

  .topbar-nav {
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px 24px;
  }
}

@media (max-width: 700px) {
  .hero-area {
    align-items: flex-start;
    padding-top: 80px;
  }

  .login-panel {
    max-width: 100%;
  }

  .panel-body {
    padding: 56px 20px 24px;
  }

  .panel-body h1 {
    font-size: 40px;
  }

  .subtitle {
    font-size: 15px;
    margin-bottom: 22px;
  }

  .captcha-box {
    height: 82px;
  }

  .form-meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .password-rules {
    grid-template-columns: 1fr;
  }

  .mid-badge {
    display: none;
  }

  .section-heading h2 {
    font-size: 28px;
  }

  .footer-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .video-section {
    padding: 18px;
  }
}

@media (max-width: 520px) {
  .brand-text {
    font-size: 18px;
  }

  .nav-item {
    font-size: 11px;
  }

  .seal-wrap,
  .seal-logo {
    width: 124px;
    height: 124px;
  }

  .seal-wrap {
    top: -54px;
  }

  .panel-body h1 {
    font-size: 34px;
  }

  .info-section {
    padding: 42px 16px 48px;
  }

  .info-card,
  .video-card,
  .media-photo-card {
    border-radius: 14px;
  }
}
</style>
