<template>
  <div class="page">
    <header class="topbar">
      <div class="topbar-left">
        <img class="brand-logo" :src="logo" alt="LTO Logo" />
        <span class="brand-text">LTO PORTAL</span>
      </div>

      <nav class="topbar-nav">
        <a href="#" class="nav-item">OFFICIAL WEBSITE</a>
        <a href="#" class="nav-item" @click.prevent="goToELearning"
          >E-LEARNING</a
        >
        <a href="#" class="nav-item">CONTACT</a>
        <a href="#" class="nav-item">DASHBOARD</a>
      </nav>

      <div class="user-dropdown" @click="toggleMenu">
        <div class="user-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="8"
              r="4"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              d="M4 20c0-4 4-6 8-6s8 2 8 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </div>

        <span class="user-id">ID: 26-050525-2424960</span>

        <span class="dropdown-arrow">▾</span>

        <div v-if="open" class="dropdown-menu">
          <button>Profile</button>
          <button>Settings</button>
          <button>Logout</button>
        </div>
      </div>
    </header>

    <main class="hero">
      <div class="hero-content">
        <img class="hero-logo" :src="logo" alt="LTO seal" />

        <h1 class="hero-title">WELCOME, <span>CHARLS BENEDICT.</span></h1>
        <p class="hero-subtitle">It's good to have you back.</p>
        <p class="hero-caption">Your personalized LTO digital hub.</p>

        <section class="cards">
          <article class="service-card digital-id-card">
            <div class="card-top-media">
              <div class="mini-id-card">
                <div class="mini-id-header">
                  <img :src="logo" alt="LTO" class="mini-id-logo" />
                  <div class="mini-id-header-text">
                    <span>LTMS PORTAL</span>
                    <small>Digital ID</small>
                  </div>
                </div>

                <div class="mini-id-body">
                  <img
                    :src="profileImage"
                    alt="License photo"
                    class="mini-id-photo"
                  />
                  <div class="mini-id-meta">
                    <strong>CHARLS BENEDICT</strong>
                    <span>Driver</span>
                    <small>ID No. 26-050525-2424960</small>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-title">DIGITAL ID</div>
            <div class="card-desc">Status: Active</div>

            <button class="view-btn" @click="showIdModal = true">
              View Full ID
            </button>
          </article>

          <article
            v-for="card in cards"
            :key="card.title"
            class="service-card clickable-card"
            @click="goToCard(card.title)"
          >
            <div class="card-top-media">
              <div class="icon-shell">
                <component
                  :is="card.icon"
                  class="premium-icon"
                  :stroke-width="2.2"
                />
              </div>
            </div>

            <div class="card-title">{{ card.title }}</div>
            <div class="card-desc" v-html="card.desc"></div>
          </article>
        </section>

        <section class="dashboard-lower">
          <div class="recent-activity-card">
            <div class="section-head">
              <h3>Recent Activity</h3>
              <a href="#" class="view-all-link">View All</a>
            </div>

            <div class="activity-list">
              <button type="button" class="activity-item">
                <div class="activity-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="7"
                      width="18"
                      height="10"
                      rx="2"
                      stroke="currentColor"
                      stroke-width="1.8"
                    />
                    <circle
                      cx="7.5"
                      cy="17"
                      r="1.5"
                      stroke="currentColor"
                      stroke-width="1.8"
                    />
                    <circle
                      cx="16.5"
                      cy="17"
                      r="1.5"
                      stroke="currentColor"
                      stroke-width="1.8"
                    />
                    <path
                      d="M6 7l2-3h8l2 3"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>

                <div class="activity-copy">
                  <strong>Driver License Renewal</strong>
                  <span>Applied for Drivers License Renewal</span>
                </div>

                <div class="activity-meta">
                  <small>5 days ago</small>
                  <span class="activity-arrow">›</span>
                </div>
              </button>

              <button type="button" class="activity-item">
                <div class="activity-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect
                      x="4"
                      y="3"
                      width="10"
                      height="18"
                      rx="2"
                      stroke="currentColor"
                      stroke-width="1.8"
                    />
                    <path
                      d="M8 7h2M8 11h2M8 15h2"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                    />
                    <circle
                      cx="18"
                      cy="15"
                      r="3.5"
                      stroke="currentColor"
                      stroke-width="1.8"
                    />
                    <path
                      d="M20.5 17.5l2 2"
                      stroke="currentColor"
                      stroke-width="1.8"
                      stroke-linecap="round"
                    />
                  </svg>
                </div>

                <div class="activity-copy">
                  <strong>Viewed Defensive Driving Course</strong>
                  <span>Completed Driver Online Course</span>
                </div>

                <div class="activity-meta">
                  <small>2 weeks ago</small>
                  <span class="activity-arrow">›</span>
                </div>
              </button>
            </div>
          </div>

          <div class="help-card">
            <h3>Need Help?</h3>
            <p>Where to Assist you!</p>

            <div class="help-actions">
              <button type="button" class="help-btn">
                <span class="help-btn-left">
                  <span class="help-btn-icon">?</span>
                  <span>Browse for FQA</span>
                </span>
                <span class="help-btn-arrow">›</span>
              </button>

              <button type="button" class="help-btn">
                <span class="help-btn-left">
                  <span class="help-btn-icon">🎧</span>
                  <span>Contact For LTO Support</span>
                </span>
                <span class="help-btn-arrow">›</span>
              </button>
            </div>
          </div>
        </section>
      </div>
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
      v-if="showIdModal"
      class="modal-overlay"
      @click.self="showIdModal = false"
    >
      <div class="modal-card">
        <button class="modal-close" @click="showIdModal = false">×</button>

        <div class="full-id-card">
          <div class="full-id-top">
            <div class="full-id-brand">
              <img :src="logo" alt="LTO Logo" class="full-id-logo" />
              <div>
                <div class="full-id-agency">LAND TRANSPORTATION OFFICE</div>
                <div class="full-id-sub">
                  Land Transportation Management System
                </div>
              </div>
            </div>

            <div class="full-id-badge">ACTIVE</div>
          </div>

          <div class="full-id-main">
            <img
              :src="profileImage"
              alt="License Photo"
              class="full-id-photo"
            />

            <div class="full-id-details">
              <div class="detail-row">
                <span class="label">Full Name</span>
                <strong>CHARLS BENEDICT</strong>
              </div>

              <div class="detail-grid">
                <div class="detail-row">
                  <span class="label">License No.</span>
                  <strong>26-050525-2424960</strong>
                </div>
                <div class="detail-row">
                  <span class="label">Type</span>
                  <strong>Non-Professional</strong>
                </div>
                <div class="detail-row">
                  <span class="label">Status</span>
                  <strong>Verified Active</strong>
                </div>
                <div class="detail-row">
                  <span class="label">Nationality</span>
                  <strong>Filipino</strong>
                </div>
              </div>
            </div>
          </div>

          <div class="full-id-footer">
            <span>Official LTMS Digital Identification</span>
            <span>Management Information Division</span>
          </div>
        </div>
      </div>
    </div>

    <!-- TERMS AND CONDITIONS MODAL -->
    <div v-if="showTermsModal" class="terms-overlay">
      <div class="terms-modal" @click.stop>
        <div class="terms-header">
          <div class="terms-title-wrap">
            <div class="terms-info-icon">!</div>
            <h2>LTMS Terms of Use</h2>
          </div>

          <button class="terms-top-close" @click="closeTermsModal">×</button>
        </div>

        <div class="terms-body">
          <p>
            By clicking "I Agree", "I Accept", "Continue", "Sign Up", or
            likewise, registering, accessing or using the LTMS Website or parts
            of it, you agree to enter into a legally binding contract with the
            Land Transportation Office (LTO) (even if you are a minor or
            representing a person, company or entity). If you do not agree on
            any of the Terms, do not proceed to avail the service.
          </p>

          <p>
            The Services at the LTMS Website are available only to person,
            natural or juridical, with a User Account. You will be held
            responsible not only for the confidentiality of your password but
            also for any statements made on your account. LTO likewise may,
            without prior notice, alter, modify, restrict, or even suspend, and
            stop any part of its LTMS website at its sole discretion.
          </p>

          <p>
            LTO shall have no liability for any claim, loss or damage resulting
            from the accuracy or completeness of the information at the LTMS
            Website.
          </p>

          <p>
            LTO neither makes no warranty nor guarantee, expressed or implied,
            as to the eligibility or qualification for the Services since it
            will be subjected to validation in order to approve any request for
            application for the service. While LTO makes reasonable efforts to
            ensure the availability of the Services, it does not guarantee,
            however, that the Services will be processed at the designated place
            or time.
          </p>

          <p>
            LTO may change or impose additional fees for the Services at any
            time without prior notice.
          </p>

          <p>
            Unless otherwise specified, the Fee indicated in the pay order slip
            is the Application Fee and does not cover the actual fees for the
            Services. Confirmed payment for obligations are non-cancellable and
            fees paid are non-refundable.
          </p>
        </div>

        <div class="terms-actions">
          <button class="terms-close-btn" @click="closeTermsModal">
            Close
          </button>
          <button class="terms-accept-btn" @click="acceptTerms">Accept</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import logo from "../assets/logo.png";
import profileImage from "../assets/profile.png";

import {
  IdCard,
  CarFront,
  ReceiptText,
  ShieldAlert,
  Files,
} from "lucide-vue-next";

const open = ref(false);

const toggleMenu = () => {
  open.value = !open.value;
};

const goToELearning = () => {
  router.push("/e-learning");
};

const showIdModal = ref(false);
const showTermsModal = ref(false);
const router = useRouter();

const pendingRoute = ref("");

const goToCard = (title: string) => {
  if (title === "LICENSING") {
    pendingRoute.value = "/licensing";
    showTermsModal.value = true;
    return;
  }

  if (title === "VEHICLE") {
    router.push("/vehicle");
    return;
  }

  if (title === "TRANSACTIONS") {
    router.push("/transactions");
    return;
  }

  if (title === "VIOLATIONS") {
    router.push("/violations");
    return;
  }

  if (title === "DOCUMENTS") {
    router.push("/documents");
    return;
  }
};

const closeTermsModal = () => {
  showTermsModal.value = false;
  pendingRoute.value = "";
};

const acceptTerms = () => {
  showTermsModal.value = false;

  if (pendingRoute.value) {
    router.push(pendingRoute.value);
    pendingRoute.value = "";
  }
};

const cards = [
  {
    title: "LICENSING",
    desc: "Apply, renew, manage<br>driver &amp; student licenses",
    icon: IdCard,
  },
  {
    title: "VEHICLE",
    desc: "Check registrations<br>and manage vehicle records",
    icon: CarFront,
  },
  {
    title: "TRANSACTIONS",
    desc: "Track application<br>status and payment history",
    icon: ReceiptText,
  },
  {
    title: "VIOLATIONS",
    desc: "View and settle<br>traffic violations",
    icon: ShieldAlert,
  },
  {
    title: "DOCUMENTS",
    desc: "Request official copies<br>and electronic records",
    icon: Files,
  },
];
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.user-dropdown {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: white;
}

.user-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-icon svg {
  width: 100%;
  height: 100%;
}

.user-id {
  font-size: 12px;
  font-weight: 600;
}

.dropdown-arrow {
  font-size: 12px;
}

.dropdown-menu {
  position: absolute;
  top: 120%;
  right: 0;
  width: 140px;
  background: white;
  color: #1f2937;
  border-radius: 10px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 10;
}

.dropdown-menu button {
  width: 100%;
  padding: 10px;
  border: none;
  background: none;
  text-align: left;
  font-size: 13px;
  cursor: pointer;
}

.dropdown-menu button:hover {
  background: #f3f4f6;
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

.profile-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8f8f8;
  color: #11243f;
  border-radius: 12px;
  padding: 8px 12px;
  min-width: 250px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14);
}

.profile-image {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  object-fit: cover;
}

.profile-name {
  font-size: 13px;
  font-weight: 800;
}

.profile-status {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #129247;
  font-size: 12px;
  margin: 4px 0;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #129247;
}

.profile-id {
  font-size: 12px;
  color: #59697c;
}

.service-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
}

.hero {
  flex: 1;
  background:
    linear-gradient(rgba(244, 246, 249, 0.616), rgba(244, 246, 249, 0.678)),
    url("../assets/BGC.jpg") center/cover no-repeat;
  display: flex;
  justify-content: center;
  padding: 38px 24px 28px;
}

.hero-content {
  width: 100%;
  max-width: 1260px;
  text-align: center;
}

.hero-logo {
  width: 118px;
  height: 118px;
  object-fit: contain;
  margin-bottom: 8px;
}

.hero-title {
  margin: 0;
  font-size: clamp(38px, 5vw, 64px);
  line-height: 1.08;
  font-weight: 300;
  color: #192338;
}

.hero-title span {
  color: #102a63;
  font-weight: 900;
}

.hero-subtitle {
  margin: 8px 0 4px;
  font-size: clamp(20px, 2.2vw, 30px);
  color: #1f2430;
}

.hero-caption {
  margin: 0 0 26px;
  font-size: 14px;
  color: #5f6772;
}

.cards {
  display: grid;
  grid-template-columns: repeat(6, minmax(170px, 1fr));
  gap: 16px;
  align-items: stretch;
}

.service-card {
  min-height: 235px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 18px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(17, 24, 39, 0.05);
  padding: 14px 14px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.digital-id-card {
  justify-content: flex-start;
}

.card-top-media {
  width: 100%;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.icon-shell {
  width: 74px;
  height: 74px;
  border-radius: 22px;
  background: linear-gradient(180deg, #ffffff 0%, #eef4ff 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    0 10px 18px rgba(27, 74, 145, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(34, 67, 121, 0.08);
}

.premium-icon {
  width: 34px;
  height: 34px;
  color: #183153;
}

.mini-id-card {
  width: 98px;
  min-height: 64px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1a4c98 0%, #0d3273 100%);
  color: white;
  padding: 6px;
  box-shadow: 0 8px 16px rgba(13, 50, 115, 0.28);
  text-align: left;
}

.mini-id-header {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
}

.mini-id-logo {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
}

.mini-id-header-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.mini-id-header-text span {
  font-size: 5px;
  font-weight: 700;
}

.mini-id-header-text small {
  font-size: 4px;
  opacity: 0.9;
}

.mini-id-body {
  display: flex;
  gap: 5px;
  align-items: center;
}

.mini-id-photo {
  width: 24px;
  height: 28px;
  border-radius: 4px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.mini-id-meta {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
  min-width: 0;
}

.mini-id-meta strong {
  font-size: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-id-meta span,
.mini-id-meta small {
  font-size: 4px;
  opacity: 0.92;
}

.card-title {
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  font-weight: 800;
  line-height: 1.15;
  color: #1f2937;
  letter-spacing: 0.2px;
  margin-bottom: 8px;
}

.card-desc {
  min-height: 54px;
  font-size: 12px;
  line-height: 1.45;
  color: #414b57;
}

.view-btn {
  margin-top: auto;
  border: none;
  background: linear-gradient(180deg, #1f5fb7 0%, #154b96 100%);
  color: white;
  font-size: 13px;
  font-weight: 700;
  border-radius: 9px;
  padding: 10px 14px;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(21, 75, 150, 0.22);
}

.dashboard-lower {
  margin-top: 28px;
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(280px, 0.95fr);
  gap: 22px;
  align-items: stretch;
}

.recent-activity-card,
.help-card {
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-radius: 10px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
}

.recent-activity-card {
  padding: 14px 14px 12px;
}

.help-card {
  padding: 16px 18px 18px;
  text-align: left;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-head h3,
.help-card h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #454545;
}

.view-all-link {
  color: #3f32e0;
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.activity-item {
  width: 100%;
  border: 1px solid #d7d7d7;
  background: #dcdcdc;
  border-radius: 4px;
  min-height: 44px;
  padding: 10px 14px;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  text-align: left;
  cursor: pointer;
  transition:
    background 0.18s ease,
    transform 0.18s ease;
}

.activity-item:hover {
  background: #d3d3d3;
}

.activity-icon {
  width: 28px;
  height: 28px;
  color: #3047ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-icon svg {
  width: 100%;
  height: 100%;
  display: block;
}

.activity-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.activity-copy strong {
  font-size: 15px;
  line-height: 1.15;
  color: #3f3f3f;
}

.activity-copy span {
  font-size: 13px;
  color: #5a5a5a;
  line-height: 1.2;
}

.activity-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #6a6a6a;
}

.activity-meta small {
  font-size: 12px;
  white-space: nowrap;
}

.activity-arrow {
  font-size: 20px;
  color: #3d4bff;
  line-height: 1;
}

.help-card p {
  margin: 6px 0 16px;
  font-size: 13px;
  color: #616161;
}

.help-actions {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.help-btn {
  width: 100%;
  min-height: 38px;
  border: none;
  border-radius: 4px;
  background: linear-gradient(90deg, #2d2be2 0%, #3827dd 100%);
  color: #fff;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(52, 44, 214, 0.18);
}

.help-btn-left {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 700;
}

.help-btn-icon {
  width: 18px;
  height: 18px;
  border: 1.7px solid #fff;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  line-height: 1;
}

.help-btn-arrow {
  font-size: 20px;
  line-height: 1;
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

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 18, 34, 0.58);
  display: grid;
  place-items: center;
  padding: 24px;
  z-index: 50;
  backdrop-filter: blur(4px);
}

.modal-card {
  position: relative;
  width: min(760px, 100%);
}

.modal-close {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: #102a63;
  font-size: 26px;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.18);
}

.full-id-card {
  background: linear-gradient(135deg, #0d3273 0%, #154b96 55%, #1c65c0 100%);
  color: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 24px 50px rgba(8, 33, 79, 0.34);
  border: 1px solid rgba(255, 255, 255, 0.16);
}

.full-id-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.full-id-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.full-id-logo {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: white;
}

.full-id-agency {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.full-id-sub {
  font-size: 13px;
  opacity: 0.88;
}

.full-id-badge {
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.full-id-main {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 24px;
  align-items: start;
}

.full-id-photo {
  width: 180px;
  height: 220px;
  object-fit: cover;
  border-radius: 18px;
  border: 2px solid rgba(255, 255, 255, 0.28);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  background: #dce6f7;
}

.full-id-details {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.1);
}

.label {
  font-size: 12px;
  opacity: 0.85;
}

.detail-row strong {
  font-size: 16px;
  line-height: 1.25;
}

.full-id-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  opacity: 0.9;
}

.terms-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.24);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 32px 18px;
  z-index: 1000;
}

.terms-modal {
  width: min(760px, 100%);
  background: #f7f7f7;
  border: 1px solid #d7d7d7;
  border-radius: 4px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);
  overflow: hidden;
}

.terms-header {
  height: 58px;
  background: #efefef;
  border-bottom: 1px solid #d8d8d8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px 0 16px;
}

.terms-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.terms-title-wrap h2 {
  margin: 0;
  color: #0a4ead;
  font-size: 17px;
  font-weight: 700;
}

.terms-info-icon {
  width: 28px;
  height: 28px;
  border: 2px solid #0a4ead;
  border-radius: 50%;
  color: #0a4ead;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  font-weight: 700;
  line-height: 1;
}

.terms-top-close {
  width: 28px;
  height: 28px;
  border: 1px solid #bdbdbd;
  border-radius: 50%;
  background: #f4f4f4;
  color: #444;
  font-size: 18px;
  cursor: pointer;
}

.terms-body {
  background: #f7f7f7;
  padding: 20px 16px 22px;
  color: #3d4b5e;
  font-size: 15px;
  line-height: 1.42;
  max-height: 420px;
  overflow-y: auto;
}

.terms-body p {
  margin: 0 0 18px;
}

.terms-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 14px 12px;
  background: #f7f7f7;
}

.terms-close-btn,
.terms-accept-btn {
  min-width: 92px;
  height: 36px;
  border: none;
  border-radius: 2px;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.terms-close-btn {
  background: #e11428;
}

.terms-accept-btn {
  background: #0f4fc1;
}

@media (max-width: 1280px) {
  .cards {
    grid-template-columns: repeat(3, minmax(180px, 1fr));
  }
}

@media (max-width: 1100px) {
  .dashboard-lower {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
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

  .cards {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }

  .full-id-main {
    grid-template-columns: 1fr;
  }

  .full-id-photo {
    width: 180px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .full-id-footer {
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .cards {
    grid-template-columns: 1fr;
  }

  .brand-text {
    font-size: 20px;
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

  .modal-card {
    width: 100%;
  }

  .full-id-card {
    padding: 20px;
  }

  .full-id-top {
    flex-direction: column;
  }

  .full-id-brand {
    align-items: flex-start;
  }

  .full-id-photo {
    width: 100%;
    max-width: 240px;
    height: auto;
    aspect-ratio: 4 / 5;
  }

  .terms-body {
    font-size: 14px;
    max-height: 55vh;
  }

  .terms-actions {
    gap: 10px;
  }

  .terms-close-btn,
  .terms-accept-btn {
    flex: 1;
  }

  .activity-item {
    grid-template-columns: 30px 1fr;
  }

  .activity-meta {
    grid-column: 2;
    justify-content: space-between;
    margin-top: 4px;
  }
}
</style>
