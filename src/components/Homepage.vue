<template>
  <div class="page" :class="{ 'mobile-view': isMobileView }">
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

    <!-- ─── VIEW TOGGLE BUTTON ─────────────────────────────────── -->
    <button
      class="view-toggle-fab"
      type="button"
      :title="isMobileView ? 'Switch to Desktop View' : 'Switch to Mobile View'"
      @click="toggleViewMode"
      aria-label="Toggle view mode"
    >
      <span class="view-toggle-icon">
        <svg
          v-if="isMobileView"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="2"
            y="3"
            width="20"
            height="14"
            rx="2"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
          <path
            d="M8 21h8M12 17v4"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect
            x="7"
            y="2"
            width="10"
            height="20"
            rx="2.5"
            stroke="currentColor"
            stroke-width="1.8"
          />
          <circle cx="12" cy="18.5" r="1" fill="currentColor" />
        </svg>
      </span>
      <span class="view-toggle-label">{{
        isMobileView ? "Desktop" : "Mobile"
      }}</span>
    </button>

    <header class="topbar">
      <div class="topbar-left">
        <button class="brand-wrap" type="button" @click="goToDashboard()">
          <img class="brand-logo" :src="logo" alt="LTO Logo" />
          <div class="brand-copy">
            <span class="brand-kicker">LTMS PORTAL</span>
            <span class="brand-text">DASHBOARD</span>
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

      <nav class="topbar-nav" :class="{ 'mobile-open': showMobileNav }">
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
          class="nav-item"
          @click.prevent="
            goToContact();
            showMobileNav = false;
          "
        >
          CONTACT
        </a>
        <a
          href="#"
          class="nav-item active dashboard-active"
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
          <button
            type="button"
            class="user-dropdown-item"
            @click="goToProfile()"
          >
            Profile
          </button>
          <button
            type="button"
            class="user-dropdown-item"
            @click="openSettingsModal()"
          >
            Settings
          </button>
          <button
            type="button"
            class="user-dropdown-item danger"
            @click="requestLogout()"
          >
            Logout
          </button>
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
            <div class="card-body-text">
              <div class="card-title">DIGITAL ID</div>
              <div class="card-desc">Status: Active</div>
            </div>
            <button
              class="view-btn"
              :disabled="isPageLoading"
              @click="showIdModal = true"
            >
              View Full ID
            </button>
          </article>

          <article
            v-for="card in cards"
            :key="card.title"
            class="service-card clickable-card"
            :class="{ loadingDisabled: isPageLoading }"
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
              <a
                href="#"
                class="view-all-link"
                @click.prevent="openRecentActivityModal()"
                >View All</a
              >
            </div>
            <div class="activity-list">
              <button
                v-for="activity in recentActivities.slice(0, 2)"
                :key="activity.id"
                type="button"
                class="activity-item"
              >
                <div class="activity-icon" v-html="activity.icon"></div>
                <div class="activity-copy">
                  <strong>{{ activity.title }}</strong>
                  <span>{{ activity.description }}</span>
                </div>
                <div class="activity-meta">
                  <small>{{ formatRelativeDate(activity.date) }}</small>
                  <span class="activity-arrow">›</span>
                </div>
              </button>
            </div>
          </div>

          <div class="help-card">
            <h3>Need Help?</h3>
            <p>Where to Assist you!</p>
            <div class="help-actions">
              <button type="button" class="help-btn" @click="openFaqModal()">
                <span class="help-btn-left">
                  <span class="help-btn-icon">?</span>
                  <span>Browse for FAQ</span>
                </span>
                <span class="help-btn-arrow">›</span>
              </button>
              <button type="button" class="help-btn" @click="goToContactPage()">
                <span class="help-btn-left">
                  <span class="help-btn-icon">🎧</span>
                  <span>Contact For LTO Support</span>
                </span>
                <span class="help-btn-arrow">›</span>
              </button>
            </div>
          </div>
        </section>

        <section class="dashboard-news-section">
          <div class="dashboard-news-grid">
            <article class="news-panel updates-panel">
              <div class="news-panel-head">
                <div>
                  <span class="news-kicker">LTO Updates</span>
                  <h3>Latest official updates</h3>
                  <p>
                    Helpful service reminders and portal updates for quick
                    reference.
                  </p>
                </div>
                <button
                  type="button"
                  class="news-head-btn"
                  :disabled="isPageLoading"
                  @click="openOfficialWebsite()"
                >
                  View Official Site
                </button>
              </div>
              <div class="news-list">
                <article
                  v-for="item in ltoUpdates"
                  :key="item.title"
                  class="news-item-card"
                >
                  <div class="news-item-top">
                    <span class="news-badge">{{ item.badge }}</span>
                    <small>{{ item.time }}</small>
                  </div>
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.text }}</p>
                </article>
              </div>
            </article>

            <aside class="news-panel advisory-panel">
              <div class="news-panel-head compact">
                <div>
                  <span class="news-kicker">Quick Advisory</span>
                  <h3>Service information</h3>
                </div>
              </div>
              <div class="advisory-stack">
                <div class="advisory-card">
                  <span class="advisory-label">CDE Online Validation Exam</span>
                  <strong>Passing score is 80%</strong>
                  <p>
                    Review the CDE before renewal-related steps and take the
                    online validation exam when ready.
                  </p>
                </div>
                <div class="advisory-card">
                  <span class="advisory-label">LTMS Portal</span>
                  <strong>Release 2.5.4</strong>
                  <p>
                    The public portal currently shows Release 2.5.4, which you
                    can mirror in the dashboard for consistency.
                  </p>
                </div>
                <div class="advisory-card">
                  <span class="advisory-label">Client Care</span>
                  <strong>Use Contact for concerns</strong>
                  <p>
                    Users can reach LTO Client Care from the Contact page for
                    support, inquiries, and transaction concerns.
                  </p>
                </div>
              </div>
            </aside>
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
      <div class="footer-right"></div>
    </footer>

    <!-- ─── MODALS ─────────────────────────────────── -->

    <div
      v-if="showIdModal"
      class="modal-overlay"
      @click.self="showIdModal = false"
    >
      <div class="modal-card">
        <button
          class="modal-close"
          :disabled="isPageLoading"
          @click="showIdModal = false"
        >
          ×
        </button>
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

    <div
      v-if="showFaqModal"
      class="faq-modal-overlay"
      @click.self="closeFaqModal()"
    >
      <div
        class="faq-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="faq-modal-title"
      >
        <div class="faq-modal-header">
          <div>
            <span class="faq-modal-kicker">LTO Help Center</span>
            <h3 id="faq-modal-title">Frequently Asked Questions</h3>
            <p>
              Find quick answers about LTMS, licensing, vehicles, transactions,
              violations, documents, and account support.
            </p>
          </div>
          <button
            type="button"
            class="faq-modal-close"
            :disabled="isPageLoading"
            @click="closeFaqModal()"
          >
            ×
          </button>
        </div>
        <div class="faq-tools">
          <div class="faq-search-field">
            <label for="faq-search">Search FAQ</label>
            <input
              id="faq-search"
              v-model="faqSearch"
              type="search"
              placeholder="Search by keyword, service, or concern"
            />
          </div>
          <div class="faq-category-tabs">
            <button
              v-for="category in faqCategories"
              :key="category"
              type="button"
              class="faq-category-tab"
              :class="{ active: selectedFaqCategory === category }"
              @click="selectedFaqCategory = category"
            >
              {{ category }}
            </button>
          </div>
        </div>
        <div class="faq-count-row">
          <span>{{ filteredFaqItems.length }} FAQ result(s)</span>
          <button type="button" @click="clearFaqFilters()">
            Reset filters
          </button>
        </div>
        <div class="faq-note">
          For direct assistance, use the separate "Contact For LTO Support"
          button in the Need Help section.
        </div>
        <div class="faq-list">
          <article
            v-for="item in filteredFaqItems"
            :key="item.id"
            class="faq-item"
            :class="{ open: selectedFaqItem?.id === item.id }"
          >
            <button
              type="button"
              class="faq-question"
              @click.stop="openFaqDetail(item)"
            >
              <span class="faq-question-left">
                <span class="faq-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 17h.01M9.25 9.25A2.75 2.75 0 1 1 12 12v1.25"
                      stroke="currentColor"
                      stroke-width="1.9"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      stroke-width="1.9"
                    />
                  </svg>
                </span>
                <span>
                  <strong>{{ item.question }}</strong>
                  <small>{{ item.category }}</small>
                </span>
              </span>
              <span
                class="faq-chevron"
                :class="{ open: selectedFaqItem?.id === item.id }"
              >
                ›
              </span>
            </button>
          </article>
          <div v-if="filteredFaqItems.length === 0" class="empty-faq-state">
            <strong>No FAQ found</strong>
            <span>Try another keyword or select All FAQs.</span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="selectedFaqItem"
      class="faq-detail-overlay"
      @click.self="closeFaqDetail()"
    >
      <div
        class="faq-detail-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="faq-detail-title"
      >
        <div class="faq-detail-header">
          <div class="faq-detail-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 17h.01M9.25 9.25A2.75 2.75 0 1 1 12 12v1.25"
                stroke="currentColor"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                stroke-width="1.9"
              />
            </svg>
          </div>
          <div class="faq-detail-title-wrap">
            <span class="faq-detail-kicker">{{
              selectedFaqItem.category
            }}</span>
            <h3 id="faq-detail-title">{{ selectedFaqItem.question }}</h3>
          </div>
          <button
            type="button"
            class="faq-detail-close"
            @click="closeFaqDetail()"
          >
            ×
          </button>
        </div>
        <div class="faq-detail-body">
          <p>{{ selectedFaqItem.answer }}</p>
          <div class="faq-detail-note">
            <strong>Reminder</strong>
            <span>
              Requirements and availability may still depend on official LTO
              validation, transaction type, and your account records.
            </span>
          </div>
        </div>
        <div class="faq-detail-actions">
          <button
            type="button"
            class="faq-detail-done"
            @click="closeFaqDetail()"
          >
            Done
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showRecentActivityModal"
      class="activity-modal-overlay"
      @click.self="closeRecentActivityModal()"
    >
      <div
        class="activity-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-modal-title"
      >
        <div class="activity-modal-header">
          <div>
            <span class="activity-modal-kicker">LTMS Activity Log</span>
            <h3 id="activity-modal-title">All Recent Activities</h3>
            <p>
              View your 10 most recent LTMS actions and filter by specific
              dates.
            </p>
          </div>
          <button
            type="button"
            class="activity-modal-close"
            :disabled="isPageLoading"
            @click="closeRecentActivityModal()"
          >
            ×
          </button>
        </div>
        <div class="activity-filter-panel">
          <div class="filter-field">
            <label for="activity-sort">Sort</label>
            <select id="activity-sort" v-model="activitySortOrder">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
          <div class="filter-field">
            <label for="activity-from">From</label>
            <input id="activity-from" v-model="activityDateFrom" type="date" />
          </div>
          <div class="filter-field">
            <label for="activity-to">To</label>
            <input id="activity-to" v-model="activityDateTo" type="date" />
          </div>
          <button
            type="button"
            class="clear-filter-btn"
            @click="clearActivityFilters()"
          >
            Clear Filters
          </button>
        </div>
        <div class="activity-count-row">
          <span>{{ filteredRecentActivities.length }} activity record(s)</span>
          <strong>Showing most recent LTMS actions</strong>
        </div>
        <div class="activity-modal-list">
          <button
            v-for="activity in filteredRecentActivities"
            :key="activity.id"
            type="button"
            class="activity-modal-item"
          >
            <div class="activity-modal-icon" v-html="activity.icon"></div>
            <div class="activity-modal-copy">
              <div class="activity-modal-title-row">
                <strong>{{ activity.title }}</strong>
                <span :class="['activity-status-chip', activity.statusClass]">
                  {{ activity.status }}
                </span>
              </div>
              <p>{{ activity.description }}</p>
              <div class="activity-modal-meta">
                <span>{{ formatFullDate(activity.date) }}</span>
                <span>•</span>
                <span>{{ activity.category }}</span>
              </div>
            </div>
          </button>
          <div
            v-if="filteredRecentActivities.length === 0"
            class="empty-activity-state"
          >
            <strong>No activities found</strong>
            <span>Try adjusting the selected date range.</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showTermsModal" class="terms-overlay">
      <div
        class="terms-modal premium-terms-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-modal-title"
        @click.stop
      >
        <div class="terms-hero">
          <div class="terms-seal-wrap">
            <img :src="logo" alt="LTO Logo" class="terms-seal" />
          </div>
          <div class="terms-hero-copy">
            <span class="terms-kicker">Secure LTMS Access</span>
            <h2 id="terms-modal-title">{{ termsModalTitle }}</h2>
            <p>
              Please review and accept the terms before continuing to
              {{ pendingServiceLabel }} services.
            </p>
          </div>
          <button
            class="terms-top-close premium-close"
            type="button"
            :disabled="isPageLoading"
            @click="closeTermsModal()"
            aria-label="Close terms modal"
          >
            ×
          </button>
        </div>
        <div class="terms-service-card">
          <div class="terms-service-icon">
            <component
              :is="pendingServiceIcon"
              :stroke-width="2.2"
              aria-hidden="true"
            />
          </div>
          <div class="terms-service-copy">
            <span>Selected Service</span>
            <strong>{{ pendingServiceLabel }}</strong>
            <small>{{ pendingServiceDescription }}</small>
          </div>
        </div>
        <div class="terms-body premium-terms-body">
          <section class="terms-section">
            <h3>Terms of Use</h3>
            <p>
              By clicking "I Agree", "I Accept", "Continue", "Sign Up", or
              likewise, registering, accessing or using the LTMS Website or
              parts of it, you agree to enter into a legally binding contract
              with the Land Transportation Office (LTO) even if you are a minor
              or representing a person, company or entity. If you do not agree
              on any of the Terms, do not proceed to avail the service.
            </p>
            <p>
              The Services at the LTMS Website are available only to person,
              natural or juridical, with a User Account. You will be held
              responsible not only for the confidentiality of your password but
              also for any statements made on your account. LTO may, without
              prior notice, alter, modify, restrict, suspend, or stop any part
              of its LTMS website at its sole discretion.
            </p>
            <p>
              LTO shall have no liability for any claim, loss or damage
              resulting from the accuracy or completeness of the information at
              the LTMS Website.
            </p>
            <p>
              LTO makes no warranty or guarantee, expressed or implied, as to
              the eligibility or qualification for the Services because requests
              are still subject to validation and approval. While LTO makes
              reasonable efforts to ensure the availability of the Services, it
              does not guarantee that the Services will be processed at the
              designated place or time.
            </p>
            <p>
              LTO may change or impose additional fees for the Services at any
              time without prior notice. Unless otherwise specified, the fee
              indicated in the pay order slip is the Application Fee and does
              not cover the actual fees for the Services. Confirmed payment
              obligations are non-cancellable and fees paid are non-refundable.
            </p>
          </section>
        </div>
        <div class="terms-confirm-panel">
          <label class="terms-checkbox">
            <input
              v-model="hasAcceptedTerms"
              type="checkbox"
              :disabled="isPageLoading"
            />
            <span>
              I have read and agree to the LTMS Terms of Use for
              {{ pendingServiceLabel }}.
            </span>
          </label>
        </div>
        <div class="terms-actions premium-terms-actions">
          <button
            class="terms-close-btn"
            type="button"
            :disabled="isPageLoading"
            @click="closeTermsModal()"
          >
            Cancel
          </button>
          <button
            class="terms-accept-btn"
            type="button"
            :disabled="isPageLoading || !hasAcceptedTerms"
            @click="acceptTerms()"
          >
            Accept &amp; Continue
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="showLogoutModal"
    class="logout-modal-overlay"
    @click.self="cancelLogout()"
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
          @click="cancelLogout()"
        >
          Cancel
        </button>
        <button
          type="button"
          class="logout-confirm-btn"
          :disabled="isPageLoading"
          @click="logoutUser()"
        >
          Log Out
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="showSettingsModal"
    class="settings-modal-overlay"
    @click.self="closeSettingsModal()"
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
          @click="closeSettingsModal()"
        >
          ×
        </button>
      </div>
      <div class="settings-modal-body">
        <div class="settings-option-card">
          <div class="settings-option-copy">
            <strong>Dark Mode</strong>
            <span>Use a darker color scheme for better low-light viewing.</span>
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
            <input v-model="accessibilitySettings.largeText" type="checkbox" />
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
          @click="closeSettingsModal()"
        >
          Done
        </button>
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
import profileImage from "../assets/profile.png";
import { useAccessibility } from "../composables/useAccessibility";

import {
  IdCard,
  CarFront,
  ReceiptText,
  ShieldAlert,
  Files,
} from "lucide-vue-next";

// ─── VIEW MODE TOGGLE ──────────────────────────────────────────
const isMobileView = ref(false);
const showMobileNav = ref(false);

const toggleViewMode = () => {
  isMobileView.value = !isMobileView.value;
  showMobileNav.value = false;
};

watch(isMobileView, (val) => {
  if (!val) showMobileNav.value = false;
});

// ─── SETTINGS & ACCESSIBILITY ─────────────────────────────────
const showSettingsModal = ref(false);
const { settings: accessibilitySettings } = useAccessibility();

const openSettingsModal = () => {
  closeUserMenu();
  showSettingsModal.value = true;
};

const closeSettingsModal = () => {
  if (isPageLoading.value) return;
  showSettingsModal.value = false;
};

// ─── LOGOUT ───────────────────────────────────────────────────
const showLogoutModal = ref(false);

const requestLogout = () => {
  closeUserMenu();
  showLogoutModal.value = true;
};

const cancelLogout = () => {
  if (isPageLoading.value) return;
  showLogoutModal.value = false;
};

// ─── USER MENU ────────────────────────────────────────────────
const showUserMenu = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);
const isPageLoading = ref(false);
const showIdModal = ref(false);
const showTermsModal = ref(false);
const showRecentActivityModal = ref(false);
const showFaqModal = ref(false);
const faqSearch = ref("");
const selectedFaqCategory = ref("All FAQs");
// const openFaqItems = ref<number[]>([]);
const selectedFaqItem = ref<null | {
  id: number;
  category: string;
  question: string;
  answer: string;
}>(null);
const activitySortOrder = ref<"newest" | "oldest">("newest");
const activityDateFrom = ref("");
const activityDateTo = ref("");
const pendingRoute = ref("");
const pendingServiceTitle = ref("");
const hasAcceptedTerms = ref(false);

const router = useRouter();

const serviceTermsMeta: Record<
  string,
  { label: string; description: string; icon: typeof IdCard }
> = {
  LICENSING: {
    label: "Licensing",
    description: "Apply, renew, and manage driver or student license services.",
    icon: IdCard,
  },
  VEHICLE: {
    label: "Vehicle",
    description:
      "Check vehicle registration details and manage vehicle records.",
    icon: CarFront,
  },
};

const pendingServiceMeta = computed(() => {
  return (
    serviceTermsMeta[pendingServiceTitle.value] || {
      label: "LTMS",
      description: "Continue to the selected LTMS service.",
      icon: IdCard,
    }
  );
});

const pendingServiceLabel = computed(() => pendingServiceMeta.value.label);
const pendingServiceDescription = computed(
  () => pendingServiceMeta.value.description,
);
const pendingServiceIcon = computed(() => pendingServiceMeta.value.icon);
const termsModalTitle = computed(
  () => `${pendingServiceLabel.value} Terms & Conditions`,
);

const delay = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

const beginPageLoading = async () => {
  if (isPageLoading.value) return false;
  isPageLoading.value = true;
  showUserMenu.value = false;
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  await nextTick();
  await delay(220);
  return true;
};

const endPageLoading = () => {
  isPageLoading.value = false;
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

const toggleUserMenu = () => {
  if (isPageLoading.value) return;
  showUserMenu.value = !showUserMenu.value;
};

const closeUserMenu = () => {
  showUserMenu.value = false;
};

const handleDocumentClick = (event: MouseEvent) => {
  const target = event.target as Node | null;
  if (!userMenuRef.value || !target) return;
  if (!userMenuRef.value.contains(target)) closeUserMenu();
};

// ─── NAVIGATION FUNCTIONS (all fixed with proper () calls) ────

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
  closeUserMenu();
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

const goToCard = async (title: string) => {
  if (isPageLoading.value) return;
  const routeMap: Record<string, string> = {
    LICENSING: "/licensing",
    VEHICLE: "/vehicle",
    TRANSACTIONS: "/transactions",
    VIOLATIONS: "/violations",
    DOCUMENTS: "/documents",
  };
  const targetRoute = routeMap[title];
  if (!targetRoute) return;
  if (title === "LICENSING" || title === "VEHICLE") {
    pendingRoute.value = targetRoute;
    pendingServiceTitle.value = title;
    hasAcceptedTerms.value = false;
    showTermsModal.value = true;
    return;
  }
  const currentPath = router.currentRoute.value.path;
  const started = await beginPageLoading();
  if (!started) return;
  if (currentPath === targetRoute) {
    await delay(280);
    endPageLoading();
    return;
  }
  try {
    await router.push(targetRoute);
  } catch {
    endPageLoading();
  }
};

const closeTermsModal = () => {
  if (isPageLoading.value) return;
  showTermsModal.value = false;
  pendingRoute.value = "";
  pendingServiceTitle.value = "";
  hasAcceptedTerms.value = false;
};

const acceptTerms = async () => {
  if (!hasAcceptedTerms.value) return;
  const targetRoute = pendingRoute.value;
  showTermsModal.value = false;
  if (!targetRoute) return;
  const currentPath = router.currentRoute.value.path;
  const started = await beginPageLoading();
  if (!started) return;
  pendingRoute.value = "";
  if (currentPath === targetRoute) {
    await delay(280);
    endPageLoading();
    return;
  }
  try {
    await router.push(targetRoute);
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

// ─── FAQ DATA ─────────────────────────────────────────────────
const faqItems = [
  {
    id: 1,
    category: "LTMS Account",
    question: "How do I create or access an LTMS account?",
    answer:
      "Open the LTMS portal, register using your personal information, verify your account, and sign in with your registered credentials. Keep your email, mobile number, and password secure.",
  },
  {
    id: 2,
    category: "Licensing",
    question: "How do I apply for or renew a driver's license online?",
    answer:
      "Go to Licensing, accept the terms, select the correct license classification and application type, review your details, then submit the application. Some steps may still require validation or appearance at an LTO office.",
  },
  {
    id: 3,
    category: "E-Learning",
    question: "What is the CDE online validation exam?",
    answer:
      "The Comprehensive Driver Education validation exam is used for renewal-related learning requirements. Review the course materials first, then take the online validation exam when ready.",
  },
  {
    id: 4,
    category: "Vehicle",
    question: "How can I view or manage my vehicle records?",
    answer:
      "Go to Vehicle services to check linked motor vehicle records, registration details, renewal options, and available vehicle-related transactions.",
  },
  {
    id: 5,
    category: "Vehicle",
    question: "What if my vehicle is not listed in my LTMS account?",
    answer:
      "If your vehicle is not listed, visit or contact the appropriate LTO office so the motor vehicle record can be verified and linked to your LTMS account.",
  },
  {
    id: 6,
    category: "Transactions",
    question: "Where can I track application status and payment history?",
    answer:
      "Use the Transactions module to review application progress, payment-related records, official receipt information, and transaction history.",
  },
  {
    id: 7,
    category: "Violations",
    question: "Can I check or settle traffic violations through the portal?",
    answer:
      "Use the Violations module to check traffic violation records and available settlement options. Some violations may require additional verification or office processing.",
  },
  {
    id: 8,
    category: "Documents",
    question: "How do I request official copies or electronic records?",
    answer:
      "Open Documents to request available official copies, electronic records, or related documents. Make sure your profile and transaction information are accurate before submission.",
  },
  {
    id: 9,
    category: "Profile",
    question: "How do I update my profile information?",
    answer:
      "Go to Profile to review your personal information. Some fields may be editable online, while sensitive identity details may require LTO verification.",
  },
  {
    id: 10,
    category: "Support",
    question: "How do I contact LTO support?",
    answer:
      "Click Contact For LTO Support or open the Contact page from the top navigation. Use it for account issues, transaction concerns, portal support, and general inquiries.",
  },
];

const faqCategories = computed(() => [
  "All FAQs",
  ...Array.from(new Set(faqItems.map((item) => item.category))),
]);

const filteredFaqItems = computed(() => {
  const search = faqSearch.value.trim().toLowerCase();
  return faqItems.filter((item) => {
    const matchesCategory =
      selectedFaqCategory.value === "All FAQs" ||
      item.category === selectedFaqCategory.value;
    const matchesSearch =
      !search ||
      [item.question, item.answer, item.category]
        .join(" ")
        .toLowerCase()
        .includes(search);
    return matchesCategory && matchesSearch;
  });
});

const openFaqModal = () => {
  if (isPageLoading.value) return;
  showFaqModal.value = true;
};

const closeFaqModal = () => {
  if (isPageLoading.value) return;
  selectedFaqItem.value = null;
  showFaqModal.value = false;
};

const openFaqDetail = (item: {
  id: number;
  category: string;
  question: string;
  answer: string;
}) => {
  selectedFaqItem.value = item;
};

const closeFaqDetail = () => {
  selectedFaqItem.value = null;
};

const clearFaqFilters = () => {
  faqSearch.value = "";
  selectedFaqCategory.value = "All FAQs";
};

const goToContactPage = async () => {
  closeFaqModal();
  closeUserMenu();
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

// ─── ACTIVITY DATA ────────────────────────────────────────────
const recentActivities = [
  {
    id: 1,
    title: "Vehicle Registration Renewal",
    description: "Submitted renewal application for Toyota Vios NAB 4827.",
    category: "Vehicle",
    status: "Submitted",
    statusClass: "submitted",
    date: "2026-04-28",
    icon: `<svg viewBox="0 0 24 24" fill="none"><path d="M5.25 13.5l1.45-4.18A2.75 2.75 0 0 1 9.3 7.5h5.4a2.75 2.75 0 0 1 2.6 1.82l1.45 4.18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.75 13.5h14.5A1.75 1.75 0 0 1 21 15.25v2.25a1.25 1.25 0 0 1-1.25 1.25H4.25A1.25 1.25 0 0 1 3 17.5v-2.25a1.75 1.75 0 0 1 1.75-1.75Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    id: 2,
    title: "Driver License Renewal",
    description: "Applied for driver's license renewal.",
    category: "Licensing",
    status: "For Review",
    statusClass: "review",
    date: "2026-04-24",
    icon: `<svg viewBox="0 0 24 24" fill="none"><rect x="3.75" y="5.5" width="16.5" height="13" rx="2.4" stroke="currentColor" stroke-width="1.8"/><path d="M7.5 10h5.5M7.5 13h3.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="16" cy="12" r="2.15" stroke="currentColor" stroke-width="1.8"/></svg>`,
  },
  {
    id: 3,
    title: "CDE Online Validation Exam",
    description:
      "Completed the Comprehensive Driver Education validation exam.",
    category: "E-Learning",
    status: "Completed",
    statusClass: "completed",
    date: "2026-04-18",
    icon: `<svg viewBox="0 0 24 24" fill="none"><path d="M4.5 6.5h15v11h-15z" stroke="currentColor" stroke-width="1.8"/><path d="M8 10h8M8 13.5h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  },
  {
    id: 4,
    title: "Official Receipt Viewed",
    description: "Opened official receipt validation details.",
    category: "Transactions",
    status: "Viewed",
    statusClass: "viewed",
    date: "2026-04-12",
    icon: `<svg viewBox="0 0 24 24" fill="none"><path d="M7 3.75h10A2.25 2.25 0 0 1 19.25 6v14.25l-2.35-1.4-2.35 1.4-2.35-1.4-2.35 1.4-2.35-1.4-2.35 1.4V6A2.25 2.25 0 0 1 7 3.75Z" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 8h7M8.5 11.5h7M8.5 15h4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  },
  {
    id: 5,
    title: "Digital ID Opened",
    description: "Viewed full LTMS digital ID information.",
    category: "Profile",
    status: "Viewed",
    statusClass: "viewed",
    date: "2026-04-08",
    icon: `<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><circle cx="9" cy="11" r="2" stroke="currentColor" stroke-width="1.8"/><path d="M13.5 10h3M13.5 13h3M7 16c.5-1 1.2-1.5 2-1.5s1.5.5 2 1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  },
  {
    id: 6,
    title: "Vehicle Record Checked",
    description: "Reviewed linked vehicle record for Honda Click DCA 9142.",
    category: "Vehicle",
    status: "Checked",
    statusClass: "completed",
    date: "2026-04-03",
    icon: `<svg viewBox="0 0 24 24" fill="none"><path d="M6 16h12M7 16l1.5-5h7L17 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="17" r="1.5" stroke="currentColor" stroke-width="1.8"/><circle cx="16" cy="17" r="1.5" stroke="currentColor" stroke-width="1.8"/></svg>`,
  },
  {
    id: 7,
    title: "Profile Information Updated",
    description: "Updated contact and profile information.",
    category: "Profile",
    status: "Updated",
    statusClass: "completed",
    date: "2026-03-28",
    icon: `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.5" stroke="currentColor" stroke-width="1.8"/><path d="M5 19c0-3.2 3.2-5.2 7-5.2s7 2 7 5.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  },
  {
    id: 8,
    title: "Traffic Violation Check",
    description: "Checked account for unsettled traffic violations.",
    category: "Violations",
    status: "No Record",
    statusClass: "completed",
    date: "2026-03-21",
    icon: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 3.75l8 3.5v5.8c0 4.65-3.25 7.75-8 9.2-4.75-1.45-8-4.55-8-9.2v-5.8l8-3.5Z" stroke="currentColor" stroke-width="1.8"/><path d="M12 8.5v5M12 17h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  },
  {
    id: 9,
    title: "Document Request Started",
    description: "Started request for electronic records.",
    category: "Documents",
    status: "Draft",
    statusClass: "review",
    date: "2026-03-15",
    icon: `<svg viewBox="0 0 24 24" fill="none"><path d="M7.5 4.25h7l4 4v11.5H7.5A2.5 2.5 0 0 1 5 17.25V6.75a2.5 2.5 0 0 1 2.5-2.5Z" stroke="currentColor" stroke-width="1.8"/><path d="M14.5 4.25v4h4M8.5 12h7M8.5 15.5h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  },
  {
    id: 10,
    title: "Defensive Driving Course Viewed",
    description: "Viewed defensive driving course material.",
    category: "E-Learning",
    status: "Viewed",
    statusClass: "viewed",
    date: "2026-03-10",
    icon: `<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="10" height="18" rx="2" stroke="currentColor" stroke-width="1.8"/><circle cx="18" cy="15" r="3.5" stroke="currentColor" stroke-width="1.8"/><path d="M20.5 17.5l2 2M8 7h2M8 11h2M8 15h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  },
];

const filteredRecentActivities = computed(() => {
  const from = activityDateFrom.value ? new Date(activityDateFrom.value) : null;
  const to = activityDateTo.value ? new Date(activityDateTo.value) : null;
  if (to) to.setHours(23, 59, 59, 999);
  return [...recentActivities]
    .filter((activity) => {
      const activityDate = new Date(activity.date);
      if (from && activityDate < from) return false;
      if (to && activityDate > to) return false;
      return true;
    })
    .sort((a, b) => {
      const first = new Date(a.date).getTime();
      const second = new Date(b.date).getTime();
      return activitySortOrder.value === "newest"
        ? second - first
        : first - second;
    });
});

const openRecentActivityModal = () => {
  if (isPageLoading.value) return;
  showRecentActivityModal.value = true;
};

const closeRecentActivityModal = () => {
  if (isPageLoading.value) return;
  showRecentActivityModal.value = false;
};

const clearActivityFilters = () => {
  activityDateFrom.value = "";
  activityDateTo.value = "";
  activitySortOrder.value = "newest";
};

const formatFullDate = (dateValue: string) => {
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateValue));
};

const formatRelativeDate = (dateValue: string) => {
  const activityDate = new Date(dateValue);
  const today = new Date("2026-04-29");
  const diffMs = today.getTime() - activityDate.getTime();
  const diffDays = Math.max(0, Math.round(diffMs / 86400000));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30)
    return `${Math.round(diffDays / 7)} week${Math.round(diffDays / 7) > 1 ? "s" : ""} ago`;
  return formatFullDate(dateValue);
};

// ─── STATIC DATA ──────────────────────────────────────────────
const ltoUpdates = [
  {
    badge: "Portal Update",
    time: "Current",
    title: "LTMS public portal remains available online",
    text: "The LTMS public portal is available for account access, e-learning, contact support, and online services.",
  },
  {
    badge: "Renewal Reminder",
    time: "Current",
    title: "CDE online validation exam requires an 80% passing score",
    text: "The public CDE page indicates that renewal-related validation requires at least 20 correct answers out of 25 items.",
  },
  {
    badge: "Service Notice",
    time: "Current",
    title: "Official receipt and digital ID validation remain available",
    text: "Public LTMS validation pages continue to support official receipt and digital ID verification access.",
  },
];

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

/* ═══════════════════════════════════════════════════════════════
   VIEW TOGGLE FAB
═══════════════════════════════════════════════════════════════ */
.view-toggle-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px 10px 12px;
  border-radius: 999px;
  background: linear-gradient(180deg, #1f5fb7 0%, #154b96 100%);
  color: #fff;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 22px rgba(21, 75, 150, 0.35);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.03em;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
  user-select: none;
}
.view-toggle-fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(21, 75, 150, 0.42);
}
.view-toggle-fab:active {
  transform: translateY(0);
}
.view-toggle-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.view-toggle-icon svg {
  width: 18px;
  height: 18px;
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE NAV HAMBURGER
═══════════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════════
   PAGE LOADING
═══════════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════════
   BASE
═══════════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════════
   TOPBAR
═══════════════════════════════════════════════════════════════ */
.topbar {
  min-height: 72px;
  background: linear-gradient(180deg, #0d468f 0%, #0b3d82 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  box-shadow: 0 8px 18px rgba(10, 46, 99, 0.18);
  gap: 12px;
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
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
  white-space: nowrap;
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

/* ─── USER MENU ───────────────────────────────────────────── */
.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
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

/* ═══════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════════
   CARDS
═══════════════════════════════════════════════════════════════ */
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

/* ─── MINI ID CARD (desktop) ─────────────────────────────── */
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
button:disabled {
  cursor: wait;
  opacity: 0.72;
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD LOWER
═══════════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════════
   NEWS SECTION
═══════════════════════════════════════════════════════════════ */
.dashboard-news-section {
  margin-top: 24px;
}
.dashboard-news-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(300px, 0.75fr);
  gap: 22px;
  align-items: start;
}
.news-panel {
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-radius: 14px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  padding: 18px;
  text-align: left;
}
.news-panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}
.news-panel-head.compact {
  margin-bottom: 14px;
}
.news-kicker {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: #eef4ff;
  color: #1f4fb8;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.news-panel-head h3 {
  margin: 0 0 6px;
  font-size: 24px;
  color: #1f2937;
}
.news-panel-head p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.55;
  max-width: 620px;
}
.news-head-btn {
  min-height: 38px;
  border: none;
  border-radius: 10px;
  padding: 0 14px;
  background: linear-gradient(180deg, #1f5fb7 0%, #154b96 100%);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
}
.news-list,
.advisory-stack {
  display: grid;
  gap: 12px;
}
.news-item-card,
.advisory-card {
  border: 1px solid #e6ebf3;
  border-radius: 14px;
  background: linear-gradient(180deg, #fbfdff 0%, #ffffff 100%);
  padding: 14px;
}
.news-item-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}
.news-badge,
.advisory-label {
  display: inline-flex;
  align-items: center;
  min-height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  background: #e9f0ff;
  color: #2154d8;
  font-size: 11px;
  font-weight: 800;
}
.news-item-top small {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}
.news-item-card h4,
.advisory-card strong {
  margin: 0 0 8px;
  color: #1f2937;
  font-size: 17px;
  line-height: 1.35;
}
.news-item-card p,
.advisory-card p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════════
   HOVER / ACTIVE TRANSITIONS
═══════════════════════════════════════════════════════════════ */
.service-card,
.clickable-card,
.digital-id-card,
.activity-item,
.help-btn,
.news-item-card,
.advisory-card {
  cursor: pointer;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease,
    background 0.22s ease;
}
.service-card:hover,
.clickable-card:hover,
.digital-id-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 34px rgba(0, 0, 0, 0.16);
  border-color: rgba(21, 75, 150, 0.18);
}
.clickable-card:hover .icon-shell,
.digital-id-card:hover .mini-id-card {
  transform: scale(1.04);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    0 14px 24px rgba(27, 74, 145, 0.14);
}
.icon-shell,
.mini-id-card {
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;
}
.activity-item:hover,
.help-btn:hover,
.news-item-card:hover,
.advisory-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}
.view-btn:hover,
.news-head-btn:hover {
  cursor: pointer;
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(21, 75, 150, 0.2);
}
.clickable-card:active,
.digital-id-card:active,
.activity-item:active,
.help-btn:active,
.news-item-card:active,
.advisory-card:active,
.view-btn:active {
  transform: translateY(-1px) scale(0.99);
}

/* ═══════════════════════════════════════════════════════════════
   NATURAL RESPONSIVE BREAKPOINTS
═══════════════════════════════════════════════════════════════ */
@media (max-width: 1280px) {
  .cards {
    grid-template-columns: repeat(3, minmax(180px, 1fr));
  }
}
@media (max-width: 1100px) {
  .dashboard-lower,
  .dashboard-news-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 900px) {
  .topbar {
    height: auto;
    flex-wrap: wrap;
    padding: 12px 16px;
  }
  .topbar-nav {
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
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
    font-size: 16px;
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
  .user-id {
    display: none;
  }
  .activity-item {
    grid-template-columns: 30px 1fr;
  }
  .activity-meta {
    grid-column: 2;
    justify-content: space-between;
    margin-top: 4px;
  }
  .logout-modal-actions {
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

/* ═══════════════════════════════════════════════════════════════
   MOBILE VIEW CLASS  (.page.mobile-view)
═══════════════════════════════════════════════════════════════ */
.page.mobile-view .topbar {
  height: auto;
  flex-wrap: wrap;
  padding: 10px 14px;
  gap: 10px;
  position: relative;
}
.page.mobile-view .topbar-left {
  flex: 1;
  min-width: 0;
}
.page.mobile-view .brand-text {
  font-size: 15px;
}
.page.mobile-view .brand-kicker {
  font-size: 9px;
}
.page.mobile-view .brand-logo {
  width: 32px;
  height: 32px;
}
.page.mobile-view .mobile-nav-toggle {
  display: flex;
  order: 2;
}
.page.mobile-view .topbar-nav {
  order: 4;
  width: 100%;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.28s ease;
}
.page.mobile-view .topbar-nav.mobile-open {
  max-height: 260px;
}
.page.mobile-view .nav-item {
  padding: 11px 14px;
  border-radius: 8px;
  font-size: 13px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
}
.page.mobile-view .user-menu {
  order: 3;
}
.page.mobile-view .user-id {
  display: none;
}
.page.mobile-view .user-name {
  font-size: 11px;
}
.page.mobile-view .user-avatar {
  width: 26px;
  height: 26px;
  font-size: 11px;
  flex: 0 0 26px;
}
.page.mobile-view .user-caret {
  display: none;
}
.page.mobile-view .hero {
  padding: 20px 12px 20px;
}
.page.mobile-view .hero-logo {
  width: 72px;
  height: 72px;
}
.page.mobile-view .hero-title {
  font-size: 26px;
}
.page.mobile-view .hero-subtitle {
  font-size: 16px;
}
.page.mobile-view .hero-caption {
  font-size: 13px;
  margin-bottom: 18px;
}

/* ─── MOBILE VIEW: CARDS ─────────────────────────────────── */
.page.mobile-view .cards {
  grid-template-columns: 1fr;
  gap: 12px;
}

/* All service cards become a horizontal row by default */
.page.mobile-view .service-card {
  min-height: unset;
  flex-direction: row;
  align-items: center;
  gap: 14px;
  text-align: left;
  padding: 14px;
  border-radius: 14px;
}

/* Non-ID cards: icon + text side by side */
.page.mobile-view .clickable-card .card-top-media {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  margin-bottom: 0;
}
.page.mobile-view .icon-shell {
  width: 54px;
  height: 54px;
  border-radius: 16px;
}
.page.mobile-view .premium-icon {
  width: 26px;
  height: 26px;
}
.page.mobile-view .card-title {
  font-size: 15px;
  min-height: unset;
  margin-bottom: 4px;
  justify-content: flex-start;
}
.page.mobile-view .card-desc {
  font-size: 12px;
  min-height: unset;
}

/* ─── MOBILE VIEW: DIGITAL ID CARD ──────────────────────── */
/* Stack vertically so the ID preview has full width */
.page.mobile-view .digital-id-card {
  flex-direction: column !important;
  align-items: stretch;
  gap: 12px;
  padding: 16px;
}

/* Media area: full width, auto height */
.page.mobile-view .digital-id-card .card-top-media {
  width: 100%;
  height: auto;
  margin-bottom: 0;
  display: flex;
  justify-content: center;
}

/* Mini ID card: wider and taller so it's actually readable */
.page.mobile-view .mini-id-card {
  width: 220px;
  min-height: 130px;
  border-radius: 14px;
  padding: 12px;
}
.page.mobile-view .mini-id-header {
  margin-bottom: 10px;
}
.page.mobile-view .mini-id-logo {
  width: 22px;
  height: 22px;
}
.page.mobile-view .mini-id-header-text span {
  font-size: 8px;
}
.page.mobile-view .mini-id-header-text small {
  font-size: 7px;
}
.page.mobile-view .mini-id-body {
  gap: 10px;
}
.page.mobile-view .mini-id-photo {
  width: 46px;
  height: 56px;
  border-radius: 6px;
}
.page.mobile-view .mini-id-meta strong {
  font-size: 10px;
}
.page.mobile-view .mini-id-meta span {
  font-size: 8px;
}
.page.mobile-view .mini-id-meta small {
  font-size: 7px;
}

/* Title + desc text block below the ID */
.page.mobile-view .digital-id-card .card-body-text {
  text-align: center;
}
.page.mobile-view .digital-id-card .card-title {
  justify-content: center;
  font-size: 16px;
  margin-bottom: 2px;
}
.page.mobile-view .digital-id-card .card-desc {
  text-align: center;
  font-size: 13px;
}

/* View Full ID button: full width at bottom */
.page.mobile-view .digital-id-card .view-btn {
  margin-top: 4px;
  margin-left: 0;
  width: 100%;
  padding: 12px 14px;
  font-size: 14px;
}

/* ─── MOBILE VIEW: LOWER SECTIONS ───────────────────────── */
.page.mobile-view .dashboard-lower {
  grid-template-columns: 1fr;
  gap: 14px;
  margin-top: 18px;
}
.page.mobile-view .dashboard-news-grid {
  grid-template-columns: 1fr;
  gap: 14px;
}
.page.mobile-view .dashboard-news-section {
  margin-top: 14px;
}
.page.mobile-view .news-panel-head {
  flex-direction: column;
  gap: 10px;
}
.page.mobile-view .news-head-btn {
  width: 100%;
  text-align: center;
}
.page.mobile-view .news-panel-head h3 {
  font-size: 18px;
}
.page.mobile-view .activity-item {
  grid-template-columns: 30px minmax(0, 1fr);
  gap: 10px;
}
.page.mobile-view .activity-copy strong {
  font-size: 13px;
}
.page.mobile-view .activity-copy span {
  font-size: 12px;
}
.page.mobile-view .activity-meta {
  display: none;
}
.page.mobile-view .footer {
  grid-template-columns: 1fr;
  height: auto;
  gap: 6px;
  padding: 12px;
  text-align: center;
}
.page.mobile-view .footer-left,
.page.mobile-view .footer-center,
.page.mobile-view .footer-right {
  justify-self: center;
}
.page.mobile-view .footer-center span {
  font-size: 11px;
}
.page.mobile-view .section-head h3 {
  font-size: 16px;
}
.page.mobile-view .help-card h3 {
  font-size: 16px;
}

/* Disable hover lift on mobile view */
.page.mobile-view .service-card:hover,
.page.mobile-view .clickable-card:hover,
.page.mobile-view .digital-id-card:hover {
  transform: none;
}

/* ═══════════════════════════════════════════════════════════════
   MODALS — BASE
═══════════════════════════════════════════════════════════════ */
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

/* ─── FULL ID CARD (desktop / base) ─────────────────────── */
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

/* ═══════════════════════════════════════════════════════════════
   FULL ID MODAL — MOBILE VIEW OVERRIDES
   Applied when .page.mobile-view is active (toggled via FAB),
   ensuring the ID modal is readable on a narrow simulated screen.
═══════════════════════════════════════════════════════════════ */
.page.mobile-view ~ * .modal-overlay,
.page.mobile-view + * .modal-overlay {
  padding: 12px;
}

/* Since the modal sits inside .page, we scope via the page class
   using a global override pattern for the fixed overlay           */
:global(.page.mobile-view) ~ .modal-overlay,
:global(.page.mobile-view) .modal-overlay {
  padding: 12px;
}

/* The overlay is actually INSIDE .page, so scoped styles work: */
.page.mobile-view .modal-overlay {
  padding: 10px;
  align-items: flex-start;
  overflow-y: auto;
}

.page.mobile-view .modal-card {
  width: 100%;
  max-width: 100%;
  margin: auto;
}

.page.mobile-view .full-id-card {
  padding: 16px 14px 20px;
  border-radius: 18px;
}

/* Header: stack vertically, hide sub-label to save space */
.page.mobile-view .full-id-top {
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 16px;
}

.page.mobile-view .full-id-brand {
  align-items: center;
  gap: 10px;
}

.page.mobile-view .full-id-logo {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
}

.page.mobile-view .full-id-agency {
  font-size: 13px;
  letter-spacing: 0.01em;
  line-height: 1.2;
}

.page.mobile-view .full-id-sub {
  font-size: 11px;
}

.page.mobile-view .full-id-badge {
  align-self: flex-start;
  padding: 5px 12px;
  font-size: 11px;
}

/* Main body: stack photo above details */
.page.mobile-view .full-id-main {
  grid-template-columns: 1fr;
  gap: 16px;
}

/* Photo: centered, fixed proportional size */
.page.mobile-view .full-id-photo {
  width: 120px;
  height: 148px;
  border-radius: 14px;
  margin: 0 auto;
  display: block;
}

/* Details: full name row */
.page.mobile-view .full-id-details {
  gap: 12px;
}

.page.mobile-view .full-id-details > .detail-row strong {
  font-size: 18px;
}

/* Detail grid: single column on mobile */
.page.mobile-view .detail-grid {
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.page.mobile-view .detail-row {
  padding: 10px 12px;
  border-radius: 12px;
  gap: 4px;
}

.page.mobile-view .detail-row .label {
  font-size: 10px;
}

.page.mobile-view .detail-row strong {
  font-size: 13px;
  word-break: break-word;
}

/* Footer: stack on mobile */
.page.mobile-view .full-id-footer {
  margin-top: 16px;
  padding-top: 12px;
  flex-direction: column;
  gap: 4px;
  font-size: 11px;
  align-items: center;
  text-align: center;
}

/* ─── LOGOUT MODAL ─────────────────────────────────────── */
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
  border: none;
  background: linear-gradient(180deg, #d92d20 0%, #b42318 100%);
  color: #ffffff;
  box-shadow: 0 12px 22px rgba(180, 35, 24, 0.18);
}
.logout-cancel-btn:hover,
.logout-confirm-btn:hover {
  transform: translateY(-1px);
}

/* ─── SETTINGS MODAL ────────────────────────────────────── */
.settings-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1350;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.42);
  backdrop-filter: blur(8px);
}
.settings-modal-card {
  width: min(560px, 100%);
  border-radius: 24px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid #dbe5f3;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.18);
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
.settings-modal-kicker {
  display: inline-block;
  margin-bottom: 8px;
  color: #1f5fb7;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
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
  min-height: 46px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(180deg, #1f5fb7 0%, #154b96 100%);
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 12px 22px rgba(21, 75, 150, 0.16);
}

/* ─── TOGGLE SWITCH ─────────────────────────────────────── */
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

/* ─── TERMS MODAL ───────────────────────────────────────── */
.terms-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 28px 18px;
  background:
    radial-gradient(circle at top, rgba(37, 99, 235, 0.24), transparent 34%),
    rgba(15, 23, 42, 0.52);
  backdrop-filter: blur(10px);
}
.terms-modal.premium-terms-modal {
  width: min(860px, 100%);
  max-height: min(88vh, 760px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 28px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid rgba(219, 229, 243, 0.95);
  box-shadow:
    0 30px 80px rgba(15, 23, 42, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.94);
}
.terms-hero {
  position: relative;
  display: grid;
  grid-template-columns: 72px 1fr auto;
  gap: 16px;
  align-items: center;
  padding: 24px 24px 20px;
  background:
    linear-gradient(135deg, rgba(13, 70, 143, 0.98), rgba(10, 56, 116, 0.98)),
    radial-gradient(
      circle at top right,
      rgba(147, 197, 253, 0.28),
      transparent 38%
    );
  color: #ffffff;
}
.terms-seal-wrap {
  width: 72px;
  height: 72px;
  border-radius: 22px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
}
.terms-seal {
  width: 52px;
  height: 52px;
  object-fit: contain;
  border-radius: 50%;
}
.terms-kicker {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #dbeafe;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.terms-hero-copy h2 {
  margin: 0;
  font-size: 27px;
  line-height: 1.1;
  font-weight: 950;
  letter-spacing: -0.45px;
}
.terms-hero-copy p {
  margin: 8px 0 0;
  max-width: 560px;
  color: rgba(255, 255, 255, 0.84);
  font-size: 14px;
  line-height: 1.45;
}
.terms-top-close.premium-close {
  width: 42px;
  height: 42px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-size: 26px;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    background 0.18s ease;
}
.terms-top-close.premium-close:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.2);
}
.terms-service-card {
  margin: 18px 24px 0;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border: 1px solid #dbeafe;
  border-radius: 20px;
  background: linear-gradient(180deg, #eff6ff 0%, #ffffff 100%);
  box-shadow: 0 14px 28px rgba(29, 78, 216, 0.08);
}
.terms-service-icon {
  width: 56px;
  height: 56px;
  flex: 0 0 56px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb 0%, #0f3d87 100%);
  box-shadow:
    0 14px 26px rgba(29, 78, 216, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}
.terms-service-icon svg {
  width: 28px;
  height: 28px;
}
.terms-service-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.terms-service-copy span {
  color: #2563eb;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.terms-service-copy strong {
  color: #0f172a;
  font-size: 18px;
  font-weight: 950;
}
.terms-service-copy small {
  color: #64748b;
  font-size: 13px;
  line-height: 1.4;
}
.terms-body.premium-terms-body {
  margin: 18px 24px 0;
  padding: 0;
  max-height: 320px;
  overflow-y: auto;
  background: transparent;
  color: #334155;
  font-size: 14.5px;
  line-height: 1.65;
}
.terms-section {
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: #ffffff;
}
.terms-section h3 {
  margin: 0 0 14px;
  color: #0f3d87;
  font-size: 17px;
  font-weight: 950;
}
.terms-body.premium-terms-body p {
  margin: 0 0 16px;
}
.terms-body.premium-terms-body p:last-child {
  margin-bottom: 0;
}
.terms-confirm-panel {
  margin: 16px 24px 0;
  padding: 15px 16px;
  border: 1px solid #dbeafe;
  border-radius: 18px;
  background: #f8fbff;
}
.terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  color: #0f172a;
  font-size: 14px;
  font-weight: 750;
  line-height: 1.45;
  cursor: pointer;
}
.terms-checkbox input {
  width: 18px;
  height: 18px;
  margin-top: 1px;
  accent-color: #1d4ed8;
  flex: 0 0 18px;
}
.terms-actions.premium-terms-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 18px 24px 24px;
  background: transparent;
}
.terms-close-btn,
.terms-accept-btn {
  min-width: 136px;
  min-height: 46px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease,
    opacity 0.18s ease;
}
.terms-close-btn {
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #334155;
}
.terms-close-btn:hover {
  background: #f8fafc;
  transform: translateY(-1px);
}
.terms-accept-btn {
  border: none;
  background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  box-shadow: 0 14px 24px rgba(29, 78, 216, 0.24);
}
.terms-accept-btn:hover:not(:disabled) {
  background: linear-gradient(180deg, #1d4ed8 0%, #1e40af 100%);
  transform: translateY(-1px);
}
.terms-accept-btn:disabled {
  cursor: not-allowed;
  opacity: 0.52;
  box-shadow: none;
}
@media (max-width: 720px) {
  .terms-modal.premium-terms-modal {
    max-height: 92vh;
    border-radius: 22px;
  }
  .terms-hero {
    grid-template-columns: 1fr auto;
  }
  .terms-seal-wrap {
    display: none;
  }
  .terms-hero-copy h2 {
    font-size: 22px;
  }
  .terms-service-card {
    margin-inline: 16px;
  }
  .terms-body.premium-terms-body {
    margin-inline: 16px;
    max-height: 38vh;
  }
  .terms-confirm-panel {
    margin-inline: 16px;
  }
  .terms-actions.premium-terms-actions {
    flex-direction: column;
    padding-inline: 16px;
  }
  .terms-close-btn,
  .terms-accept-btn {
    width: 100%;
  }
}

/* ─── ACTIVITY MODAL ────────────────────────────────────── */
.activity-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1250;
  display: grid;
  place-items: center;
  padding: 28px 18px;
  background:
    radial-gradient(circle at top, rgba(37, 99, 235, 0.22), transparent 34%),
    rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(10px);
}
.activity-modal-card {
  width: min(920px, 100%);
  max-height: min(88vh, 780px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 26px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid rgba(219, 229, 243, 0.96);
  box-shadow:
    0 30px 80px rgba(15, 23, 42, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.94);
}
.activity-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 24px 18px;
  background:
    linear-gradient(135deg, rgba(13, 70, 143, 0.98), rgba(10, 56, 116, 0.98)),
    radial-gradient(
      circle at top right,
      rgba(147, 197, 253, 0.28),
      transparent 38%
    );
  color: #ffffff;
}
.activity-modal-kicker {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #dbeafe;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.activity-modal-header h3 {
  margin: 0;
  font-size: 27px;
  line-height: 1.1;
  font-weight: 950;
  letter-spacing: -0.45px;
}
.activity-modal-header p {
  margin: 8px 0 0;
  max-width: 560px;
  color: rgba(255, 255, 255, 0.84);
  font-size: 14px;
  line-height: 1.45;
}
.activity-modal-close {
  width: 42px;
  height: 42px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-size: 26px;
  cursor: pointer;
}
.activity-filter-panel {
  margin: 18px 24px 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 12px;
  align-items: end;
  padding: 16px;
  border: 1px solid #dbeafe;
  border-radius: 20px;
  background: linear-gradient(180deg, #eff6ff 0%, #ffffff 100%);
}
.filter-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}
.filter-field label {
  color: #0f3d87;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.filter-field input,
.filter-field select {
  min-height: 42px;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  background: #ffffff;
  color: #0f172a;
  padding: 0 12px;
  font-size: 13px;
  font-weight: 700;
}
.clear-filter-btn {
  min-height: 42px;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  background: #ffffff;
  color: #0f3d87;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
}
.clear-filter-btn:hover {
  background: #f8fbff;
}
.activity-count-row {
  margin: 14px 24px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #64748b;
  font-size: 13px;
  font-weight: 800;
}
.activity-count-row strong {
  color: #0f3d87;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.activity-modal-list {
  margin: 14px 24px 24px;
  padding-right: 4px;
  display: grid;
  gap: 10px;
  overflow-y: auto;
}
.activity-modal-item {
  width: 100%;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  border-radius: 18px;
  padding: 14px;
  display: grid;
  grid-template-columns: 54px 1fr;
  gap: 14px;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease;
}
.activity-modal-item:hover {
  transform: translateY(-2px);
  border-color: #bfdbfe;
  background: #f8fbff;
  box-shadow: 0 14px 28px rgba(29, 78, 216, 0.09);
}
.activity-modal-icon {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: #ffffff;
  background: linear-gradient(145deg, #2563eb 0%, #0f3d87 100%);
  box-shadow:
    0 12px 22px rgba(29, 78, 216, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.24);
}
.activity-modal-icon svg {
  width: 27px;
  height: 27px;
}
.activity-modal-copy {
  min-width: 0;
}
.activity-modal-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 5px;
}
.activity-modal-title-row strong {
  color: #0f172a;
  font-size: 15px;
  line-height: 1.25;
  font-weight: 950;
}
.activity-status-chip {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}
.activity-status-chip.completed,
.activity-status-chip.submitted {
  background: #ecfdf5;
  color: #047857;
}
.activity-status-chip.review {
  background: #fffbeb;
  color: #b45309;
}
.activity-status-chip.viewed {
  background: #eff6ff;
  color: #1d4ed8;
}
.activity-modal-copy p {
  margin: 0;
  color: #475569;
  font-size: 13.5px;
  line-height: 1.45;
}
.activity-modal-meta {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 7px;
  color: #64748b;
  font-size: 12px;
  font-weight: 750;
}
.empty-activity-state {
  min-height: 160px;
  display: grid;
  place-items: center;
  text-align: center;
  gap: 4px;
  color: #64748b;
  border: 1px dashed #cbd5e1;
  border-radius: 18px;
  background: #ffffff;
}
.empty-activity-state strong {
  color: #0f172a;
}
:deep(.activity-modal-icon svg),
.activity-icon svg {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
}
@media (max-width: 760px) {
  .activity-modal-card {
    max-height: 92vh;
    border-radius: 22px;
  }
  .activity-filter-panel {
    grid-template-columns: 1fr;
    margin-inline: 16px;
  }
  .activity-count-row {
    margin-inline: 16px;
    flex-direction: column;
    align-items: flex-start;
  }
  .activity-modal-list {
    margin-inline: 16px;
  }
  .activity-modal-item {
    grid-template-columns: 46px 1fr;
  }
  .activity-modal-icon {
    width: 46px;
    height: 46px;
    border-radius: 15px;
  }
  .activity-modal-title-row {
    align-items: flex-start;
    flex-direction: column;
  }
}

/* ─── FAQ MODAL ─────────────────────────────────────────── */
.faq-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1260;
  display: grid;
  place-items: center;
  padding: 28px 18px;
  background:
    radial-gradient(circle at top, rgba(37, 99, 235, 0.22), transparent 34%),
    rgba(15, 23, 42, 0.52);
  backdrop-filter: blur(10px);
}
.faq-modal-card {
  width: min(940px, 100%);
  max-height: min(88vh, 800px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 26px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid rgba(219, 229, 243, 0.96);
  box-shadow:
    0 30px 80px rgba(15, 23, 42, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.94);
}
.faq-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 24px 18px;
  background:
    linear-gradient(135deg, rgba(13, 70, 143, 0.98), rgba(10, 56, 116, 0.98)),
    radial-gradient(
      circle at top right,
      rgba(147, 197, 253, 0.28),
      transparent 38%
    );
  color: #ffffff;
}
.faq-modal-kicker {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #dbeafe;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.faq-modal-header h3 {
  margin: 0;
  font-size: 27px;
  line-height: 1.1;
  font-weight: 950;
  letter-spacing: -0.45px;
}
.faq-modal-header p {
  margin: 8px 0 0;
  max-width: 620px;
  color: rgba(255, 255, 255, 0.84);
  font-size: 14px;
  line-height: 1.45;
}
.faq-modal-close {
  width: 42px;
  height: 42px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-size: 26px;
  cursor: pointer;
}
.faq-tools {
  margin: 18px 24px 0;
  padding: 16px;
  border: 1px solid #dbeafe;
  border-radius: 20px;
  background: linear-gradient(180deg, #eff6ff 0%, #ffffff 100%);
}
.faq-search-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  text-align: left;
}
.faq-search-field label {
  color: #0f3d87;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.faq-search-field input {
  min-height: 44px;
  border: 1px solid #bfdbfe;
  border-radius: 13px;
  background: #ffffff;
  color: #0f172a;
  padding: 0 14px;
  font-size: 14px;
  font-weight: 700;
}
.faq-category-tabs {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.faq-category-tab {
  min-height: 34px;
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  background: #ffffff;
  color: #0f3d87;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
}
.faq-category-tab.active,
.faq-category-tab:hover {
  background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  border-color: transparent;
}
.faq-count-row {
  margin: 14px 24px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #64748b;
  font-size: 13px;
  font-weight: 800;
}
.faq-count-row button {
  border: none;
  background: transparent;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
}
.faq-note {
  margin: 10px 24px 0;
  padding: 12px 14px;
  border: 1px solid #dbeafe;
  border-radius: 14px;
  background: #f8fbff;
  color: #475569;
  font-size: 13px;
  line-height: 1.5;
  font-weight: 700;
  text-align: left;
}
.faq-list {
  margin: 14px 24px 18px !important;
  padding-right: 4px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 10px !important;
  overflow-y: auto !important;
  min-height: 260px !important;
}
.faq-item {
  display: block !important;
  width: 100% !important;
  min-height: 78px !important;
  border: 1px solid #dbeafe !important;
  border-radius: 18px !important;
  background: #ffffff !important;
  overflow: visible !important;
  opacity: 1 !important;
}
.faq-item:hover {
  border-color: #93c5fd !important;
  box-shadow: 0 14px 28px rgba(29, 78, 216, 0.08) !important;
}
.faq-item.open {
  border-color: #93c5fd !important;
  box-shadow: 0 14px 28px rgba(29, 78, 216, 0.12) !important;
}
.faq-question {
  width: 100% !important;
  min-height: 78px !important;
  border: none !important;
  background: #ffffff !important;
  padding: 14px 16px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 14px !important;
  cursor: pointer !important;
  text-align: left !important;
  color: #0f172a !important;
  opacity: 1 !important;
}
.faq-question-left {
  display: flex !important;
  align-items: center !important;
  gap: 13px !important;
  min-width: 0 !important;
  flex: 1 !important;
}
.faq-icon {
  width: 48px !important;
  height: 48px !important;
  flex: 0 0 48px !important;
  border-radius: 16px !important;
  display: grid !important;
  place-items: center !important;
  color: #ffffff !important;
  background: linear-gradient(145deg, #2563eb 0%, #0f3d87 100%) !important;
}
.faq-icon svg {
  width: 25px !important;
  height: 25px !important;
  display: block !important;
  color: #ffffff !important;
  fill: none !important;
  stroke: currentColor !important;
}
.faq-question strong {
  display: block !important;
  color: #0f172a !important;
  font-size: 15px !important;
  line-height: 1.3 !important;
  font-weight: 950 !important;
}
.faq-question small {
  display: inline-flex !important;
  margin-top: 5px !important;
  min-height: 22px !important;
  align-items: center !important;
  padding: 0 8px !important;
  border-radius: 999px !important;
  background: #eff6ff !important;
  color: #1d4ed8 !important;
  font-size: 11px !important;
  font-weight: 900 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.04em !important;
}
.faq-chevron {
  display: inline-flex !important;
  width: 28px !important;
  height: 28px !important;
  align-items: center !important;
  justify-content: center !important;
  color: #1d4ed8 !important;
  font-size: 28px !important;
  line-height: 1 !important;
  transform: rotate(0deg) !important;
  transition: transform 0.18s ease !important;
}
.faq-chevron.open {
  transform: rotate(90deg) !important;
}
.faq-answer {
  display: none !important;
}
.empty-faq-state {
  min-height: 160px;
  display: grid;
  place-items: center;
  text-align: center;
  gap: 4px;
  color: #64748b;
  border: 1px dashed #cbd5e1;
  border-radius: 18px;
  background: #ffffff;
}
.empty-faq-state strong {
  color: #0f172a;
}
@media (max-width: 760px) {
  .faq-modal-card {
    max-height: 92vh;
    border-radius: 22px;
  }
  .faq-tools,
  .faq-count-row,
  .faq-list,
  .faq-note {
    margin-inline: 16px !important;
  }
  .faq-question {
    align-items: flex-start !important;
  }
  .faq-question-left {
    align-items: flex-start !important;
  }
}

/* ─── FAQ DETAIL MODAL ──────────────────────────────────── */
.faq-detail-overlay {
  position: fixed;
  inset: 0;
  z-index: 1400;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top, rgba(37, 99, 235, 0.22), transparent 34%),
    rgba(15, 23, 42, 0.56);
  backdrop-filter: blur(10px);
}
.faq-detail-card {
  width: min(640px, 100%);
  overflow: hidden;
  border-radius: 26px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border: 1px solid rgba(219, 229, 243, 0.96);
  box-shadow:
    0 30px 80px rgba(15, 23, 42, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.94);
}
.faq-detail-header {
  display: grid;
  grid-template-columns: 58px 1fr 42px;
  gap: 14px;
  align-items: start;
  padding: 22px;
  color: #ffffff;
  background:
    linear-gradient(135deg, rgba(13, 70, 143, 0.98), rgba(10, 56, 116, 0.98)),
    radial-gradient(
      circle at top right,
      rgba(147, 197, 253, 0.28),
      transparent 38%
    );
}
.faq-detail-icon {
  width: 58px;
  height: 58px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.22);
}
.faq-detail-icon svg {
  width: 30px;
  height: 30px;
}
.faq-detail-title-wrap {
  min-width: 0;
}
.faq-detail-kicker {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #dbeafe;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.faq-detail-header h3 {
  margin: 0;
  color: #ffffff;
  font-size: 22px;
  line-height: 1.22;
  font-weight: 950;
  letter-spacing: -0.3px;
}
.faq-detail-close {
  width: 42px;
  height: 42px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-size: 26px;
  cursor: pointer;
}
.faq-detail-body {
  padding: 24px;
  text-align: left;
}
.faq-detail-body p {
  margin: 0;
  color: #334155;
  font-size: 15px;
  line-height: 1.75;
  font-weight: 650;
}
.faq-detail-note {
  margin-top: 18px;
  padding: 15px 16px;
  border: 1px solid #dbeafe;
  border-radius: 16px;
  background: #f8fbff;
  display: grid;
  gap: 5px;
}
.faq-detail-note strong {
  color: #0f3d87;
  font-size: 13px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.faq-detail-note span {
  color: #64748b;
  font-size: 13px;
  line-height: 1.55;
  font-weight: 650;
}
.faq-detail-actions {
  padding: 0 24px 24px;
  display: flex;
  justify-content: flex-end;
}
.faq-detail-done {
  min-width: 120px;
  min-height: 44px;
  border: none;
  border-radius: 13px;
  background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 12px 22px rgba(29, 78, 216, 0.22);
}
@media (max-width: 640px) {
  .faq-detail-header {
    grid-template-columns: 1fr 42px;
  }
  .faq-detail-icon {
    display: none;
  }
  .faq-detail-actions {
    display: block;
  }
  .faq-detail-done {
    width: 100%;
  }
}
</style>
