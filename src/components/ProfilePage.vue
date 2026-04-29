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
            <span class="brand-text">PROFILE</span>
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
        <a href="#" class="nav-item" @click.prevent="goToContact">CONTACT</a>
        <a href="#" class="nav-item" @click.prevent="goToDashboard">
          DASHBOARD
        </a>
      </nav>

      <div ref="userMenuRef" class="user-menu">
        <button class="user-menu-trigger" type="button" @click="toggleUserMenu">
          <div class="user-avatar">{{ initials }}</div>
          <div class="user-info">
            <span class="user-name">{{ form.lastName || "USER" }}</span>
            <span class="user-id">{{
              form.licenseNumber || "NO LICENSE"
            }}</span>
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
            class="user-dropdown-item active-dropdown-item"
            @click="goToProfile"
          >
            Profile
          </button>
          <button
            type="button"
            class="user-dropdown-item"
            @click="goToSettings"
          >
            Settings
          </button>
          <button
            type="button"
            class="user-dropdown-item danger"
            @click="logoutUser"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <main class="main-shell">
      <section class="hero-grid">
        <article class="hero-card profile-hero">
          <div class="hero-main">
            <div class="hero-id-block">
              <div class="hero-avatar">{{ initials }}</div>
              <div>
                <span class="hero-kicker">Official driver record</span>
                <h1>{{ fullNameDisplay || "LTMS Profile Record" }}</h1>
                <p class="hero-subline">
                  License No. {{ form.licenseNumber }} · Client ID
                  {{ form.clientId }}
                </p>
              </div>
            </div>

            <div class="hero-badges">
              <span class="status-badge" :class="statusToneClass">
                {{ profileStatus }}
              </span>
              <span class="status-chip neutral-chip">
                {{ completionPercentage }}% Profile Complete
              </span>
            </div>
          </div>

          <div class="hero-progress-wrap">
            <div class="progress-meta">
              <span>Profile Completion</span>
              <strong>{{ completionPercentage }}%</strong>
            </div>
            <div class="progress-track" aria-hidden="true">
              <div
                class="progress-fill"
                :style="{ width: `${completionPercentage}%` }"
              ></div>
            </div>
            <p class="helper-text">
              Complete all required identity, contact, address, and emergency
              details to maintain an updated LTMS profile.
            </p>
          </div>
        </article>

        <article class="hero-card metric-card">
          <span class="metric-label">License Type</span>
          <strong class="metric-value">{{ form.licenseType }}</strong>
          <span class="metric-sub">Official record classification</span>
        </article>

        <article class="hero-card metric-card">
          <span class="metric-label">Restrictions</span>
          <strong class="metric-value">{{ form.restrictions }}</strong>
          <span class="metric-sub">Registered driving codes</span>
        </article>

        <article class="hero-card metric-card">
          <span class="metric-label">Validity</span>
          <strong class="metric-value">{{ formattedValidUntil }}</strong>
          <span class="metric-sub">License expiration date</span>
        </article>
      </section>

      <section class="content-grid">
        <aside class="left-rail">
          <article class="panel-card profile-summary-card">
            <div class="panel-head">
              <div>
                <span class="section-kicker">Record snapshot</span>
                <h2>Account Overview</h2>
              </div>
            </div>

            <div class="summary-list">
              <div class="summary-row">
                <span>Full name</span>
                <strong>{{ fullNameDisplay }}</strong>
              </div>
              <div class="summary-row">
                <span>Birth date</span>
                <strong>{{ prettyBirthDate }}</strong>
              </div>
              <div class="summary-row">
                <span>Email</span>
                <strong>{{ form.email || "Not provided" }}</strong>
              </div>
              <div class="summary-row">
                <span>Mobile</span>
                <strong>{{ form.mobile || "Not provided" }}</strong>
              </div>
              <div class="summary-row">
                <span>Address</span>
                <strong>{{ shortAddress }}</strong>
              </div>
              <div class="summary-row">
                <span>Emergency contact</span>
                <strong>{{ form.emergencyName || "Not provided" }}</strong>
              </div>
            </div>
          </article>

          <article class="panel-card validation-card">
            <div class="panel-head">
              <div>
                <span class="section-kicker">Validation</span>
                <h2>Record Checks</h2>
              </div>
              <span
                class="mini-badge"
                :class="
                  validationSummary.totalErrors === 0
                    ? 'success-mini'
                    : 'warning-mini'
                "
              >
                {{
                  validationSummary.totalErrors === 0
                    ? "Ready to save"
                    : `${validationSummary.totalErrors} issue(s)`
                }}
              </span>
            </div>

            <ul
              class="validation-list"
              v-if="validationSummary.totalErrors > 0"
            >
              <li v-for="item in validationSummary.items" :key="item.key">
                <button
                  type="button"
                  class="validation-link"
                  @click="goToTab(item.tab)"
                >
                  <span class="validation-dot"></span>
                  <span>{{ item.label }}</span>
                </button>
              </li>
            </ul>

            <div v-else class="validation-ok">
              All required profile sections are complete and valid.
            </div>
          </article>
        </aside>

        <section class="main-panel">
          <article class="panel-card form-shell">
            <div class="panel-head panel-head-lg">
              <div>
                <span class="section-kicker">Official account details</span>
                <h2>Complete LTMS Profile Record</h2>
                <p>
                  Review and update your registered driver information below.
                  The interface is organized into official record cards to make
                  validation, editing, and profile maintenance clearer and
                  faster.
                </p>
              </div>
            </div>

            <div
              class="section-tabs"
              role="tablist"
              aria-label="Profile sections"
            >
              <button
                v-for="tab in tabs"
                :key="tab"
                type="button"
                class="tab-btn"
                :class="{ active: activeTab === tab }"
                @click="activeTab = tab"
              >
                {{ tab }}
                <span
                  v-if="tabErrorCount(tab) > 0 && tab !== 'Show All'"
                  class="tab-error-pill"
                >
                  {{ tabErrorCount(tab) }}
                </span>
              </button>
            </div>

            <div v-if="showErrorSummary" class="error-summary" role="alert">
              <div class="error-summary-head">
                <strong
                  >Please correct the highlighted fields before saving.</strong
                >
                <button
                  type="button"
                  class="summary-close"
                  @click="showErrorSummary = false"
                >
                  Dismiss
                </button>
              </div>
              <ul>
                <li v-for="item in validationSummary.items" :key="item.key">
                  {{ item.label }}
                </li>
              </ul>
            </div>

            <form class="profile-form" @submit.prevent="saveProfile">
              <section
                class="form-section"
                v-show="activeTab === 'Show All' || activeTab === 'Identity'"
              >
                <div class="section-title-row">
                  <div>
                    <h3>Identity Information</h3>
                    <span class="section-note"
                      >Primary LTMS identity details</span
                    >
                  </div>
                  <span
                    class="section-status"
                    :class="sectionStatusClass('Identity')"
                  >
                    {{ sectionStatusText("Identity") }}
                  </span>
                </div>

                <div class="form-grid">
                  <div class="field">
                    <label for="licenseNumber">License number <em>*</em></label>
                    <input
                      id="licenseNumber"
                      v-model="form.licenseNumber"
                      type="text"
                      :class="{ invalid: hasError('licenseNumber') }"
                    />
                    <small v-if="hasError('licenseNumber')" class="field-error">
                      {{ errors.licenseNumber }}
                    </small>
                  </div>

                  <div class="field">
                    <label for="clientId">Client ID <em>*</em></label>
                    <input
                      id="clientId"
                      v-model="form.clientId"
                      type="text"
                      :class="{ invalid: hasError('clientId') }"
                    />
                    <small v-if="hasError('clientId')" class="field-error">
                      {{ errors.clientId }}
                    </small>
                  </div>

                  <div class="field">
                    <label for="firstName">First name <em>*</em></label>
                    <input
                      id="firstName"
                      v-model="form.firstName"
                      type="text"
                      :class="{ invalid: hasError('firstName') }"
                    />
                    <small v-if="hasError('firstName')" class="field-error">
                      {{ errors.firstName }}
                    </small>
                  </div>

                  <div class="field">
                    <label for="lastName">Last name <em>*</em></label>
                    <input
                      id="lastName"
                      v-model="form.lastName"
                      type="text"
                      :class="{ invalid: hasError('lastName') }"
                    />
                    <small v-if="hasError('lastName')" class="field-error">
                      {{ errors.lastName }}
                    </small>
                  </div>

                  <div class="field field-full">
                    <label for="middleName">Middle name</label>
                    <input
                      id="middleName"
                      v-model="form.middleName"
                      type="text"
                    />
                  </div>
                </div>
              </section>

              <section
                class="form-section"
                v-show="activeTab === 'Show All' || activeTab === 'Contact'"
              >
                <div class="section-title-row">
                  <div>
                    <h3>Contact Information</h3>
                    <span class="section-note"
                      >Email, mobile, and notification preferences</span
                    >
                  </div>
                  <span
                    class="section-status"
                    :class="sectionStatusClass('Contact')"
                  >
                    {{ sectionStatusText("Contact") }}
                  </span>
                </div>

                <div class="form-grid">
                  <div class="field field-full">
                    <label for="email">Email address <em>*</em></label>
                    <input
                      id="email"
                      v-model="form.email"
                      type="email"
                      :class="{ invalid: hasError('email') }"
                    />
                    <small v-if="hasError('email')" class="field-error">
                      {{ errors.email }}
                    </small>
                  </div>

                  <div class="field">
                    <label for="mobile">Mobile number <em>*</em></label>
                    <input
                      id="mobile"
                      v-model="form.mobile"
                      type="text"
                      :class="{ invalid: hasError('mobile') }"
                    />
                    <small v-if="hasError('mobile')" class="field-error">
                      {{ errors.mobile }}
                    </small>
                  </div>

                  <div class="field">
                    <label for="telephone">Telephone number</label>
                    <input
                      id="telephone"
                      v-model="form.telephone"
                      type="text"
                    />
                  </div>
                </div>

                <div class="toggle-list">
                  <label class="toggle-item">
                    <input v-model="form.receiveVerification" type="checkbox" />
                    <span>Receive verification via email and mobile</span>
                  </label>
                  <label class="toggle-item">
                    <input v-model="form.receiveEmailNews" type="checkbox" />
                    <span>Receive LTMS updates via e-mail</span>
                  </label>
                  <label class="toggle-item">
                    <input v-model="form.receiveSmsAlerts" type="checkbox" />
                    <span>Receive LTMS updates via SMS</span>
                  </label>
                </div>
              </section>

              <section
                class="form-section"
                v-show="activeTab === 'Show All' || activeTab === 'General'"
              >
                <div class="section-title-row">
                  <div>
                    <h3>General Information</h3>
                    <span class="section-note"
                      >Citizenship, civil status, and birthplace</span
                    >
                  </div>
                  <span
                    class="section-status"
                    :class="sectionStatusClass('General')"
                  >
                    {{ sectionStatusText("General") }}
                  </span>
                </div>

                <div class="form-grid">
                  <div class="field">
                    <label for="country">Country <em>*</em></label>
                    <input
                      id="country"
                      v-model="form.country"
                      type="text"
                      :class="{ invalid: hasError('country') }"
                    />
                    <small v-if="hasError('country')" class="field-error">
                      {{ errors.country }}
                    </small>
                  </div>

                  <div class="field">
                    <label for="civilStatus">Civil status <em>*</em></label>
                    <input
                      id="civilStatus"
                      v-model="form.civilStatus"
                      type="text"
                      :class="{ invalid: hasError('civilStatus') }"
                    />
                    <small v-if="hasError('civilStatus')" class="field-error">
                      {{ errors.civilStatus }}
                    </small>
                  </div>

                  <div class="field">
                    <label for="birthDate">Birth date <em>*</em></label>
                    <input
                      id="birthDate"
                      v-model="form.birthDate"
                      type="date"
                      :class="{ invalid: hasError('birthDate') }"
                    />
                    <small v-if="hasError('birthDate')" class="field-error">
                      {{ errors.birthDate }}
                    </small>
                  </div>

                  <div class="field">
                    <label for="currentCity">Current city <em>*</em></label>
                    <input
                      id="currentCity"
                      v-model="form.currentCity"
                      type="text"
                      :class="{ invalid: hasError('currentCity') }"
                    />
                    <small v-if="hasError('currentCity')" class="field-error">
                      {{ errors.currentCity }}
                    </small>
                  </div>

                  <div class="field">
                    <label for="birthplace">Birthplace <em>*</em></label>
                    <input
                      id="birthplace"
                      v-model="form.birthplace"
                      type="text"
                      :class="{ invalid: hasError('birthplace') }"
                    />
                    <small v-if="hasError('birthplace')" class="field-error">
                      {{ errors.birthplace }}
                    </small>
                  </div>

                  <div class="field">
                    <label for="tin">Tax identification number</label>
                    <input id="tin" v-model="form.tin" type="text" />
                  </div>
                </div>
              </section>

              <section
                class="form-section"
                v-show="activeTab === 'Show All' || activeTab === 'Medical'"
              >
                <div class="section-title-row">
                  <div>
                    <h3>Medical Information</h3>
                    <span class="section-note"
                      >Personal appearance and medical descriptors</span
                    >
                  </div>
                  <span
                    class="section-status"
                    :class="sectionStatusClass('Medical')"
                  >
                    {{ sectionStatusText("Medical") }}
                  </span>
                </div>

                <div class="form-grid">
                  <div class="field">
                    <label for="bloodType">Blood type</label>
                    <input
                      id="bloodType"
                      v-model="form.bloodType"
                      type="text"
                    />
                  </div>

                  <div class="field">
                    <label for="buildType">Build type</label>
                    <input
                      id="buildType"
                      v-model="form.buildType"
                      type="text"
                    />
                  </div>

                  <div class="field">
                    <label for="complexion">Complexion</label>
                    <input
                      id="complexion"
                      v-model="form.complexion"
                      type="text"
                    />
                  </div>

                  <div class="field">
                    <label for="eyeColor">Eye color</label>
                    <input id="eyeColor" v-model="form.eyeColor" type="text" />
                  </div>

                  <div class="field">
                    <label for="height">Height (m)</label>
                    <input
                      id="height"
                      v-model="form.height"
                      type="text"
                      :class="{ invalid: hasError('height') }"
                    />
                    <small v-if="hasError('height')" class="field-error">
                      {{ errors.height }}
                    </small>
                  </div>

                  <div class="field">
                    <label for="weight">Weight (kg)</label>
                    <input
                      id="weight"
                      v-model="form.weight"
                      type="text"
                      :class="{ invalid: hasError('weight') }"
                    />
                    <small v-if="hasError('weight')" class="field-error">
                      {{ errors.weight }}
                    </small>
                  </div>

                  <div class="field">
                    <label for="organDonor">Organ donor</label>
                    <input
                      id="organDonor"
                      v-model="form.organDonor"
                      type="text"
                    />
                  </div>

                  <div class="field">
                    <label for="nationality">Nationality</label>
                    <input
                      id="nationality"
                      v-model="form.nationality"
                      type="text"
                    />
                  </div>
                </div>
              </section>

              <section
                class="form-section"
                v-show="activeTab === 'Show All' || activeTab === 'People'"
              >
                <div class="section-title-row">
                  <div>
                    <h3>Emergency Contact and Family Details</h3>
                    <span class="section-note"
                      >Immediate contact, employer, and parent information</span
                    >
                  </div>
                  <span
                    class="section-status"
                    :class="sectionStatusClass('People')"
                  >
                    {{ sectionStatusText("People") }}
                  </span>
                </div>

                <div class="sub-card">
                  <div class="sub-card-head">
                    <h4>Emergency Contact</h4>
                  </div>
                  <div class="form-grid">
                    <div class="field">
                      <label for="emergencyName"
                        >Emergency contact name <em>*</em></label
                      >
                      <input
                        id="emergencyName"
                        v-model="form.emergencyName"
                        type="text"
                        :class="{ invalid: hasError('emergencyName') }"
                      />
                      <small
                        v-if="hasError('emergencyName')"
                        class="field-error"
                      >
                        {{ errors.emergencyName }}
                      </small>
                    </div>

                    <div class="field">
                      <label for="emergencyNumber"
                        >Emergency contact number <em>*</em></label
                      >
                      <input
                        id="emergencyNumber"
                        v-model="form.emergencyNumber"
                        type="text"
                        :class="{ invalid: hasError('emergencyNumber') }"
                      />
                      <small
                        v-if="hasError('emergencyNumber')"
                        class="field-error"
                      >
                        {{ errors.emergencyNumber }}
                      </small>
                    </div>

                    <div class="field field-full">
                      <label for="emergencyAddress"
                        >Emergency contact address <em>*</em></label
                      >
                      <input
                        id="emergencyAddress"
                        v-model="form.emergencyAddress"
                        type="text"
                        :class="{ invalid: hasError('emergencyAddress') }"
                      />
                      <small
                        v-if="hasError('emergencyAddress')"
                        class="field-error"
                      >
                        {{ errors.emergencyAddress }}
                      </small>
                    </div>
                  </div>
                </div>

                <div class="sub-card">
                  <div class="sub-card-head">
                    <h4>Employer</h4>
                  </div>
                  <div class="form-grid">
                    <div class="field">
                      <label for="employerName">Employer name</label>
                      <input
                        id="employerName"
                        v-model="form.employerName"
                        type="text"
                      />
                    </div>

                    <div class="field">
                      <label for="employerAddress">Employer address</label>
                      <input
                        id="employerAddress"
                        v-model="form.employerAddress"
                        type="text"
                      />
                    </div>
                  </div>
                </div>

                <div class="sub-card">
                  <div class="sub-card-head">
                    <h4>Mother's Maiden Name</h4>
                  </div>
                  <div class="form-grid">
                    <div class="field">
                      <label for="motherFirstName">First name</label>
                      <input
                        id="motherFirstName"
                        v-model="form.motherFirstName"
                        type="text"
                      />
                    </div>

                    <div class="field">
                      <label for="motherLastName">Last name</label>
                      <input
                        id="motherLastName"
                        v-model="form.motherLastName"
                        type="text"
                      />
                    </div>

                    <div class="field field-full">
                      <label for="motherMiddleName">Middle name</label>
                      <input
                        id="motherMiddleName"
                        v-model="form.motherMiddleName"
                        type="text"
                      />
                    </div>
                  </div>
                </div>

                <div class="sub-card">
                  <div class="sub-card-head">
                    <h4>Father</h4>
                  </div>
                  <div class="form-grid">
                    <div class="field">
                      <label for="fatherFirstName">First name</label>
                      <input
                        id="fatherFirstName"
                        v-model="form.fatherFirstName"
                        type="text"
                      />
                    </div>

                    <div class="field">
                      <label for="fatherLastName">Last name</label>
                      <input
                        id="fatherLastName"
                        v-model="form.fatherLastName"
                        type="text"
                      />
                    </div>

                    <div class="field field-full">
                      <label for="fatherMiddleName">Middle name</label>
                      <input
                        id="fatherMiddleName"
                        v-model="form.fatherMiddleName"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section
                class="form-section"
                v-show="activeTab === 'Show All' || activeTab === 'Address'"
              >
                <div class="section-title-row">
                  <div>
                    <h3>Main Address</h3>
                    <span class="section-note"
                      >Present and permanent address information</span
                    >
                  </div>
                  <span
                    class="section-status"
                    :class="sectionStatusClass('Address')"
                  >
                    {{ sectionStatusText("Address") }}
                  </span>
                </div>

                <div class="form-grid">
                  <div class="field">
                    <label for="houseNo">House / Bldg / Lot <em>*</em></label>
                    <input
                      id="houseNo"
                      v-model="form.houseNo"
                      type="text"
                      :class="{ invalid: hasError('houseNo') }"
                    />
                    <small v-if="hasError('houseNo')" class="field-error">
                      {{ errors.houseNo }}
                    </small>
                  </div>

                  <div class="field">
                    <label for="street">Street / Subdivision <em>*</em></label>
                    <input
                      id="street"
                      v-model="form.street"
                      type="text"
                      :class="{ invalid: hasError('street') }"
                    />
                    <small v-if="hasError('street')" class="field-error">
                      {{ errors.street }}
                    </small>
                  </div>

                  <div class="field">
                    <label for="barangay">Barangay <em>*</em></label>
                    <input
                      id="barangay"
                      v-model="form.barangay"
                      type="text"
                      :class="{ invalid: hasError('barangay') }"
                    />
                    <small v-if="hasError('barangay')" class="field-error">
                      {{ errors.barangay }}
                    </small>
                  </div>

                  <div class="field">
                    <label for="cityMunicipality"
                      >City / Municipality <em>*</em></label
                    >
                    <input
                      id="cityMunicipality"
                      v-model="form.cityMunicipality"
                      type="text"
                      :class="{ invalid: hasError('cityMunicipality') }"
                    />
                    <small
                      v-if="hasError('cityMunicipality')"
                      class="field-error"
                    >
                      {{ errors.cityMunicipality }}
                    </small>
                  </div>

                  <div class="field">
                    <label for="province">Province <em>*</em></label>
                    <input
                      id="province"
                      v-model="form.province"
                      type="text"
                      :class="{ invalid: hasError('province') }"
                    />
                    <small v-if="hasError('province')" class="field-error">
                      {{ errors.province }}
                    </small>
                  </div>

                  <div class="field">
                    <label for="zipCode">ZIP code <em>*</em></label>
                    <input
                      id="zipCode"
                      v-model="form.zipCode"
                      type="text"
                      :class="{ invalid: hasError('zipCode') }"
                    />
                    <small v-if="hasError('zipCode')" class="field-error">
                      {{ errors.zipCode }}
                    </small>
                  </div>
                </div>
              </section>
            </form>
          </article>
        </section>
      </section>
    </main>

    <transition name="slide-up">
      <div v-if="showStickyBar" class="sticky-save-bar">
        <div class="sticky-left">
          <span
            class="sticky-indicator"
            :class="hasUnsavedChanges ? 'dirty' : 'clean'"
          ></span>
          <div>
            <strong>
              {{
                hasUnsavedChanges
                  ? "You have unsaved changes"
                  : "All changes saved"
              }}
            </strong>
            <p>
              {{
                validationSummary.totalErrors > 0
                  ? `${validationSummary.totalErrors} validation issue(s) require attention before saving.`
                  : hasUnsavedChanges
                    ? "Review your changes, then save to update your LTMS profile."
                    : "No pending updates."
              }}
            </p>
          </div>
        </div>

        <div class="sticky-right">
          <button type="button" class="secondary-btn" @click="resetForm">
            Reset
          </button>
          <button
            type="button"
            class="primary-btn"
            :disabled="
              isSaving ||
              validationSummary.totalErrors > 0 ||
              !hasUnsavedChanges
            "
            @click="saveProfile"
          >
            {{ isSaving ? "Saving..." : "Save Changes" }}
          </button>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="saveMessage" class="save-toast" :class="saveStateClass">
        {{ saveMessage }}
      </div>
    </transition>
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

type TabName =
  | "Show All"
  | "Identity"
  | "Contact"
  | "General"
  | "Medical"
  | "People"
  | "Address";

type FormShape = {
  licenseNumber: string;
  clientId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  mobile: string;
  telephone: string;
  receiveVerification: boolean;
  receiveEmailNews: boolean;
  receiveSmsAlerts: boolean;
  country: string;
  civilStatus: string;
  birthDate: string;
  currentCity: string;
  birthplace: string;
  tin: string;
  bloodType: string;
  buildType: string;
  complexion: string;
  eyeColor: string;
  height: string;
  weight: string;
  organDonor: string;
  nationality: string;
  emergencyName: string;
  emergencyNumber: string;
  emergencyAddress: string;
  employerName: string;
  employerAddress: string;
  motherFirstName: string;
  motherMiddleName: string;
  motherLastName: string;
  fatherFirstName: string;
  fatherMiddleName: string;
  fatherLastName: string;
  houseNo: string;
  street: string;
  barangay: string;
  cityMunicipality: string;
  province: string;
  zipCode: string;
  licenseType: string;
  restrictions: string;
  validUntil: string;
};

const router = useRouter();

const isPageLoading = ref(false);
const showUserMenu = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);
const isSaving = ref(false);
const saveMessage = ref("");
const saveStateClass = ref("success-toast");
const showErrorSummary = ref(false);

const tabs: TabName[] = [
  "Show All",
  "Identity",
  "Contact",
  "General",
  "Medical",
  "People",
  "Address",
];
const activeTab = ref<TabName>("Show All");

const initialForm: FormShape = {
  licenseNumber: "26-050525-2424960",
  clientId: "243893019208",
  firstName: "CHARLS",
  middleName: "BENEDICT",
  lastName: "HIDALGO",
  email: "CHARLS.HIDALGO@GMAIL.COM",
  mobile: "09998887777",
  telephone: "N/A",
  receiveVerification: true,
  receiveEmailNews: true,
  receiveSmsAlerts: true,
  country: "PHILIPPINES",
  civilStatus: "SINGLE",
  birthDate: "2005-05-25",
  currentCity: "BUTUAN CITY",
  birthplace: "BUTUAN CITY",
  tin: "N/A",
  bloodType: "O",
  buildType: "MEDIUM",
  complexion: "FAIR",
  eyeColor: "DARK BROWN",
  height: "1.69",
  weight: "58",
  organDonor: "NO",
  nationality: "FILIPINO",
  emergencyName: "BUTUAN WOMEN IN RADIO",
  emergencyNumber: "09998882222",
  emergencyAddress: "BLES D PAZ TRAVELSERV & SERVICES",
  employerName: "N/A",
  employerAddress: "BLES D PAZ TRAVELSERV & SERVICES",
  motherFirstName: "MOTHER",
  motherMiddleName: "MAIDEN",
  motherLastName: "LASTNAME",
  fatherFirstName: "HIDALGO",
  fatherMiddleName: "CLARA",
  fatherLastName: "RICHARD",
  houseNo: "BLES HOSPITAL 3",
  street: "RIVERVILLE SUBDIVISION",
  barangay: "LIBERTAD",
  cityMunicipality: "BUTUAN CITY",
  province: "AGUSAN DEL NORTE",
  zipCode: "8600",
  licenseType: "Non-Professional",
  restrictions: "A, A1",
  validUntil: "2029-05-25",
};

const form = reactive<FormShape>({ ...initialForm });
const errors = reactive<Record<string, string>>({});

const fieldToTabMap: Record<string, TabName> = {
  licenseNumber: "Identity",
  clientId: "Identity",
  firstName: "Identity",
  lastName: "Identity",

  email: "Contact",
  mobile: "Contact",

  country: "General",
  civilStatus: "General",
  birthDate: "General",
  currentCity: "General",
  birthplace: "General",

  height: "Medical",
  weight: "Medical",

  emergencyName: "People",
  emergencyNumber: "People",
  emergencyAddress: "People",

  houseNo: "Address",
  street: "Address",
  barangay: "Address",
  cityMunicipality: "Address",
  province: "Address",
  zipCode: "Address",
};

const requiredFields: Array<keyof FormShape> = [
  "licenseNumber",
  "clientId",
  "firstName",
  "lastName",
  "email",
  "mobile",
  "country",
  "civilStatus",
  "birthDate",
  "currentCity",
  "birthplace",
  "emergencyName",
  "emergencyNumber",
  "emergencyAddress",
  "houseNo",
  "street",
  "barangay",
  "cityMunicipality",
  "province",
  "zipCode",
];

const fullNameDisplay = computed(() =>
  `${form.firstName} ${form.middleName} ${form.lastName}`
    .replace(/\s+/g, " ")
    .trim(),
);

const initials = computed(() => {
  const first = (form.firstName || "U").charAt(0);
  const last = (form.lastName || "N").charAt(0);
  return `${first}${last}`.toUpperCase();
});

const prettyBirthDate = computed(() => {
  const date = new Date(form.birthDate);
  return Number.isNaN(date.getTime())
    ? form.birthDate
    : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
});

const formattedValidUntil = computed(() => {
  const date = new Date(form.validUntil);
  return Number.isNaN(date.getTime())
    ? form.validUntil
    : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
});

const shortAddress = computed(() =>
  [
    form.houseNo,
    form.street,
    form.barangay,
    form.cityMunicipality,
    form.province,
  ]
    .filter(Boolean)
    .join(", "),
);

const completionPercentage = computed(() => {
  const total = requiredFields.length;
  const completed = requiredFields.filter(
    (key) => String(form[key] ?? "").trim() !== "",
  ).length;
  return Math.round((completed / total) * 100);
});

const profileStatus = computed(() => {
  if (
    validationSummary.value.totalErrors === 0 &&
    completionPercentage.value === 100
  ) {
    return "Verified / Complete";
  }
  if (completionPercentage.value >= 70) {
    return "Needs Review";
  }
  return "Incomplete";
});

const statusToneClass = computed(() => {
  if (profileStatus.value === "Verified / Complete") return "badge-success";
  if (profileStatus.value === "Needs Review") return "badge-warning";
  return "badge-danger";
});

const validationSummary = computed(() => {
  const items = Object.entries(errors).map(([key, message]) => ({
    key,
    label: message,
    tab: fieldToTabMap[key] || "Show All",
  }));
  return {
    totalErrors: items.length,
    items,
  };
});

const hasUnsavedChanges = computed(
  () => JSON.stringify(form) !== JSON.stringify(initialForm),
);

const showStickyBar = computed(
  () =>
    hasUnsavedChanges.value ||
    isSaving.value ||
    validationSummary.value.totalErrors > 0,
);

const delay = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

const isBlank = (value: string) => value.trim().length === 0;
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isMobile = (value: string) =>
  /^(09\d{9}|\+639\d{9})$/.test(value.replace(/\s+/g, ""));
const isDigitsOnly = (value: string) => /^\d+$/.test(value);
const isDecimal = (value: string) => /^(\d+(\.\d+)?)?$/.test(value);

const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);

  if (isBlank(form.licenseNumber)) {
    errors.licenseNumber = "License number is required.";
  }

  if (isBlank(form.clientId)) {
    errors.clientId = "Client ID is required.";
  } else if (!isDigitsOnly(form.clientId)) {
    errors.clientId = "Client ID must contain digits only.";
  }

  if (isBlank(form.firstName)) {
    errors.firstName = "First name is required.";
  }

  if (isBlank(form.lastName)) {
    errors.lastName = "Last name is required.";
  }

  if (isBlank(form.email)) {
    errors.email = "Email address is required.";
  } else if (!isEmail(form.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (isBlank(form.mobile)) {
    errors.mobile = "Mobile number is required.";
  } else if (!isMobile(form.mobile)) {
    errors.mobile = "Enter a valid Philippine mobile number.";
  }

  if (isBlank(form.country)) {
    errors.country = "Country is required.";
  }

  if (isBlank(form.civilStatus)) {
    errors.civilStatus = "Civil status is required.";
  }

  if (isBlank(form.birthDate)) {
    errors.birthDate = "Birth date is required.";
  }

  if (isBlank(form.currentCity)) {
    errors.currentCity = "Current city is required.";
  }

  if (isBlank(form.birthplace)) {
    errors.birthplace = "Birthplace is required.";
  }

  if (form.height && !isDecimal(form.height)) {
    errors.height = "Height must be a valid number.";
  }

  if (form.weight && !isDecimal(form.weight)) {
    errors.weight = "Weight must be a valid number.";
  }

  if (isBlank(form.emergencyName)) {
    errors.emergencyName = "Emergency contact name is required.";
  }

  if (isBlank(form.emergencyNumber)) {
    errors.emergencyNumber = "Emergency contact number is required.";
  } else if (!isMobile(form.emergencyNumber)) {
    errors.emergencyNumber = "Enter a valid Philippine mobile number.";
  }

  if (isBlank(form.emergencyAddress)) {
    errors.emergencyAddress = "Emergency contact address is required.";
  }

  if (isBlank(form.houseNo)) {
    errors.houseNo = "House / Bldg / Lot is required.";
  }

  if (isBlank(form.street)) {
    errors.street = "Street / Subdivision is required.";
  }

  if (isBlank(form.barangay)) {
    errors.barangay = "Barangay is required.";
  }

  if (isBlank(form.cityMunicipality)) {
    errors.cityMunicipality = "City / Municipality is required.";
  }

  if (isBlank(form.province)) {
    errors.province = "Province is required.";
  }

  if (isBlank(form.zipCode)) {
    errors.zipCode = "ZIP code is required.";
  } else if (!/^\d{4}$/.test(form.zipCode)) {
    errors.zipCode = "ZIP code must be 4 digits.";
  }

  return Object.keys(errors).length === 0;
};

const hasError = (field: string) => Boolean(errors[field]);

const tabErrorCount = (tab: TabName) => {
  if (tab === "Show All") return 0;
  return Object.keys(errors).filter((key) => fieldToTabMap[key] === tab).length;
};

const sectionStatusText = (tab: TabName) => {
  const count = tabErrorCount(tab);
  if (count === 0) return "Complete";
  return `${count} issue${count > 1 ? "s" : ""}`;
};

const sectionStatusClass = (tab: TabName) =>
  tabErrorCount(tab) === 0 ? "section-ok" : "section-alert";

const goToTab = (tab: TabName) => {
  activeTab.value = tab;
  showErrorSummary.value = true;
};

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

const goToProfile = async () => {
  closeUserMenu();
  const currentPath = router.currentRoute.value.path;
  const started = await beginPageLoading();
  if (!started) return;
  if (currentPath === "/profile") {
    await delay(280);
    endPageLoading();
    return;
  }
  try {
    await router.push("/profile");
  } catch {
    endPageLoading();
  }
};

const goToSettings = async () => {
  closeUserMenu();
  const started = await beginPageLoading();
  if (!started) return;
  await delay(280);
  endPageLoading();
};

const goToContact = async () => {
  closeUserMenu();
  const started = await beginPageLoading();
  if (!started) return;
  await delay(280);
  endPageLoading();
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

const logoutUser = async () => {
  closeUserMenu();
  const started = await beginPageLoading();
  if (!started) return;
  await delay(500);
  endPageLoading();
};

const resetForm = () => {
  Object.assign(form, initialForm);
  Object.keys(errors).forEach((key) => delete errors[key]);
  saveMessage.value = "";
  showErrorSummary.value = false;
  activeTab.value = "Show All";
};

const saveProfile = async () => {
  const valid = validateForm();
  showErrorSummary.value = !valid;

  if (!valid) {
    saveStateClass.value = "error-toast";
    saveMessage.value =
      "Unable to save. Please correct the highlighted fields.";
    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey) {
      activeTab.value = fieldToTabMap[firstErrorKey] || "Show All";
    }
    window.setTimeout(() => {
      saveMessage.value = "";
    }, 2800);
    return;
  }

  if (isSaving.value) return;

  isSaving.value = true;
  saveMessage.value = "";
  await delay(850);
  isSaving.value = false;

  Object.assign(initialForm, JSON.parse(JSON.stringify(form)));
  saveStateClass.value = "success-toast";
  saveMessage.value = "Profile details saved successfully.";
  showErrorSummary.value = false;

  window.setTimeout(() => {
    saveMessage.value = "";
  }, 2600);
};

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);
  validateForm();
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

watch(
  form,
  () => {
    validateForm();
  },
  { deep: true },
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
  font-family: Inter, Arial, Helvetica, sans-serif;
  background: #eef2f6;
}

button,
input {
  font: inherit;
}

.page {
  min-height: 100vh;
  background:
    linear-gradient(rgba(242, 246, 251, 0.95), rgba(242, 246, 251, 0.98)),
    url("../assets/BGC.jpg") center/cover no-repeat;
  color: #1f2937;
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
  animation: profileSpin 0.85s linear infinite;
}

.page-loading-text {
  color: #154b96;
  font-size: 14px;
  font-weight: 800;
}

@keyframes profileSpin {
  to {
    transform: rotate(360deg);
  }
}

.topbar {
  min-height: 74px;
  background: linear-gradient(180deg, #0d468f 0%, #0b3d82 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  box-shadow: 0 8px 18px rgba(10, 46, 99, 0.18);
  position: sticky;
  top: 0;
  z-index: 100;
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
  letter-spacing: 0.3px;
  color: #fff;
}

.topbar-nav {
  display: flex;
  align-items: center;
  gap: 18px;
}

.nav-item {
  position: relative;
  color: rgba(255, 255, 255, 0.88);
  text-decoration: none;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.05em;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid transparent;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.nav-item:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.14);
  transform: translateY(-1px);
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
  min-height: 44px;
  padding: 6px 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  cursor: pointer;
}

.user-avatar,
.hero-avatar {
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 800;
}

.user-avatar {
  width: 30px;
  height: 30px;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-size: 13px;
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

.user-dropdown-item:hover,
.active-dropdown-item {
  background: #f4f8ff;
  color: #154b96;
}

.user-dropdown-item.danger:hover {
  background: #fff1f2;
  color: #be123c;
}

.main-shell {
  width: min(1480px, calc(100vw - 36px));
  margin: 0 auto;
  padding: 26px 0 130px;
}

.hero-grid {
  display: grid;
  grid-template-columns: 2fr repeat(3, minmax(180px, 1fr));
  gap: 18px;
  margin-bottom: 22px;
}

.hero-card,
.panel-card {
  background: rgba(255, 255, 255, 0.97);
  border: 1px solid #dce4ef;
  border-radius: 22px;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.07);
}

.profile-hero {
  padding: 24px;
}

.hero-main {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
}

.hero-id-block {
  display: flex;
  gap: 16px;
  align-items: center;
}

.hero-avatar {
  width: 64px;
  height: 64px;
  flex: 0 0 64px;
  background: linear-gradient(180deg, #1f5fb7 0%, #154b96 100%);
  color: #fff;
  font-size: 24px;
  box-shadow: 0 12px 24px rgba(21, 75, 150, 0.25);
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

.profile-hero h1,
.panel-head h2 {
  margin: 0 0 8px;
  color: #153a72;
  font-size: clamp(26px, 2.6vw, 36px);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.hero-subline {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}

.status-badge,
.status-chip,
.mini-badge,
.section-status,
.tab-error-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  border-radius: 999px;
}

.status-badge,
.status-chip {
  min-height: 36px;
  padding: 0 14px;
  font-size: 12px;
  letter-spacing: 0.03em;
}

.badge-success {
  background: #ecfdf3;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.badge-warning {
  background: #fff7ed;
  color: #b45309;
  border: 1px solid #fed7aa;
}

.badge-danger {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.neutral-chip {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.hero-progress-wrap {
  margin-top: 22px;
  border-top: 1px solid #e6edf6;
  padding-top: 18px;
}

.progress-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  color: #334155;
  font-size: 13px;
  font-weight: 700;
}

.progress-track {
  width: 100%;
  height: 12px;
  background: #e7edf6;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #1f5fb7 0%, #3b82f6 100%);
  transition: width 0.24s ease;
}

.helper-text {
  margin: 10px 0 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
}

.metric-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 176px;
}

.metric-label {
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 10px;
}

.metric-value {
  color: #153a72;
  font-size: 26px;
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.metric-sub {
  color: #64748b;
  font-size: 13px;
  margin-top: 10px;
  line-height: 1.5;
}

.content-grid {
  display: grid;
  grid-template-columns: 340px minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.left-rail {
  display: grid;
  gap: 18px;
  position: sticky;
  top: 96px;
}

.panel-card {
  padding: 22px;
}

.panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.panel-head-lg p {
  margin: 0;
  color: #64748b;
  line-height: 1.8;
  font-size: 15px;
  max-width: 960px;
}

.panel-head h2 {
  font-size: 24px;
  margin-bottom: 0;
}

.summary-list {
  display: grid;
  gap: 12px;
}

.summary-row {
  padding: 12px 0;
  border-bottom: 1px solid #edf2f7;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.summary-row span {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.summary-row strong {
  color: #1f2937;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}

.mini-badge {
  min-height: 30px;
  padding: 0 12px;
  font-size: 11px;
  letter-spacing: 0.03em;
}

.success-mini {
  background: #ecfdf3;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.warning-mini {
  background: #fff7ed;
  color: #b45309;
  border: 1px solid #fed7aa;
}

.validation-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.validation-link {
  width: 100%;
  border: 1px solid #fee2e2;
  background: #fffafa;
  color: #991b1b;
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;
  cursor: pointer;
  font-weight: 700;
}

.validation-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #ef4444;
  flex: 0 0 9px;
}

.validation-ok {
  padding: 14px;
  border-radius: 14px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
  font-weight: 700;
  line-height: 1.6;
}

.form-shell {
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
}

.section-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-bottom: 14px;
  border-bottom: 1px solid #e6edf6;
  margin-bottom: 20px;
}

.tab-btn {
  border: 1px solid #dbe5f3;
  background: linear-gradient(180deg, #ffffff 0%, #f7faff 100%);
  color: #49627d;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.tab-btn.active {
  background: linear-gradient(180deg, #1f5fb7 0%, #154b96 100%);
  border-color: #154b96;
  color: #fff;
  box-shadow: 0 10px 18px rgba(31, 95, 183, 0.16);
}

.tab-error-pill {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: rgba(255, 255, 255, 0.18);
  color: inherit;
  font-size: 11px;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.error-summary {
  margin-bottom: 18px;
  border: 1px solid #fecaca;
  background: #fff6f6;
  color: #991b1b;
  border-radius: 18px;
  padding: 16px 18px;
}

.error-summary-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.error-summary ul {
  margin: 0;
  padding-left: 18px;
}

.summary-close {
  border: 1px solid #fecaca;
  background: #fff;
  color: #991b1b;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-section {
  border: 1px solid #e2e9f3;
  background: linear-gradient(180deg, #fcfdff 0%, #f9fbfe 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
  border-radius: 20px;
  padding: 20px;
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.section-title-row h3 {
  margin: 0;
  color: #163d7b;
  font-size: 19px;
  letter-spacing: -0.01em;
}

.section-note {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  display: block;
  margin-top: 6px;
}

.section-status {
  min-height: 32px;
  padding: 0 12px;
  font-size: 11px;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.section-ok {
  background: #ecfdf3;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.section-alert {
  background: #fff7ed;
  color: #b45309;
  border: 1px solid #fed7aa;
}

.sub-card {
  border: 1px solid #e6edf6;
  background: #ffffff;
  border-radius: 18px;
  padding: 16px;
  margin-top: 14px;
}

.sub-card:first-of-type {
  margin-top: 0;
}

.sub-card-head {
  margin-bottom: 14px;
}

.sub-card-head h4 {
  margin: 0;
  color: #1f4b88;
  font-size: 15px;
  font-weight: 800;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-full {
  grid-column: 1 / -1;
}

.field label {
  color: #29425f;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 11px;
  font-weight: 800;
}

.field label em {
  color: #dc2626;
  font-style: normal;
}

.field input {
  min-height: 50px;
  border-radius: 12px;
  border: 1px solid #d7e1ef;
  background: #fff;
  padding: 0 14px;
  color: #1f2937;
  font-size: 14px;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.field input:hover {
  border-color: #b8cae6;
  background: #fcfdff;
}

.field input:focus {
  border-color: #8fb5ef;
  box-shadow: 0 0 0 4px rgba(31, 95, 183, 0.08);
}

.field input.invalid {
  border-color: #fca5a5;
  background: #fffafa;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.06);
}

.field-error {
  color: #b91c1c;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
}

.toggle-list {
  display: grid;
  gap: 10px;
  margin-top: 14px;
  padding-top: 4px;
}

.toggle-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #475569;
  font-size: 14px;
  line-height: 1.5;
}

.toggle-item input {
  margin-top: 3px;
}

.sticky-save-bar {
  position: fixed;
  left: 20px;
  right: 20px;
  bottom: 20px;
  z-index: 120;
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: center;
  padding: 16px 18px;
  border-radius: 20px;
  background: rgba(16, 24, 40, 0.94);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 50px rgba(2, 6, 23, 0.32);
  backdrop-filter: blur(10px);
}

.sticky-left {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.sticky-left strong {
  display: block;
  font-size: 15px;
}

.sticky-left p {
  margin: 4px 0 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 13px;
  line-height: 1.5;
}

.sticky-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex: 0 0 12px;
}

.sticky-indicator.dirty {
  background: #f59e0b;
  box-shadow: 0 0 0 8px rgba(245, 158, 11, 0.16);
}

.sticky-indicator.clean {
  background: #22c55e;
  box-shadow: 0 0 0 8px rgba(34, 197, 94, 0.16);
}

.sticky-right {
  display: flex;
  gap: 10px;
  align-items: center;
}

.primary-btn,
.secondary-btn {
  min-height: 44px;
  border-radius: 12px;
  padding: 0 18px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 0.16s ease,
    opacity 0.16s ease,
    background 0.16s ease,
    border-color 0.16s ease;
}

.primary-btn {
  border: none;
  background: linear-gradient(180deg, #1f5fb7 0%, #154b96 100%);
  color: white;
  box-shadow: 0 12px 24px rgba(31, 95, 183, 0.16);
}

.primary-btn:hover:not(:disabled),
.secondary-btn:hover {
  transform: translateY(-1px);
}

.primary-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.secondary-btn {
  border: 1px solid #d7e1ef;
  background: #fff;
  color: #154b96;
}

.save-toast {
  position: fixed;
  top: 92px;
  right: 22px;
  z-index: 130;
  min-width: 280px;
  max-width: 420px;
  padding: 14px 16px;
  border-radius: 14px;
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.18);
  font-size: 14px;
  font-weight: 800;
}

.success-toast {
  background: #ecfdf3;
  border: 1px solid #bbf7d0;
  color: #166534;
}

.error-toast {
  background: #fff5f5;
  border: 1px solid #fecaca;
  color: #b91c1c;
}

.slide-up-enter-active,
.slide-up-leave-active,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.22s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(16px);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 1240px) {
  .hero-grid {
    grid-template-columns: 1fr 1fr;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .left-rail {
    position: static;
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 900px) {
  .topbar {
    min-height: auto;
    flex-direction: column;
    gap: 12px;
    padding: 14px 18px;
  }

  .topbar-nav {
    flex-wrap: wrap;
    justify-content: center;
  }

  .hero-grid,
  .left-rail,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .hero-main,
  .section-title-row,
  .sticky-save-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .hero-badges {
    justify-content: flex-start;
  }

  .sticky-right {
    justify-content: stretch;
  }

  .sticky-right .primary-btn,
  .sticky-right .secondary-btn {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .main-shell {
    width: min(100%, calc(100vw - 20px));
    padding-bottom: 150px;
  }

  .panel-card,
  .profile-hero,
  .form-section {
    padding: 16px;
  }

  .sticky-save-bar {
    left: 10px;
    right: 10px;
    bottom: 10px;
    border-radius: 16px;
  }

  .save-toast {
    left: 10px;
    right: 10px;
    top: auto;
    bottom: 96px;
    min-width: auto;
    max-width: none;
  }
}
</style>
