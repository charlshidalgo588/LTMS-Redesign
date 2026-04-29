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
            <span class="brand-text">E-LEARNING</span>
          </div>
        </button>
      </div>

      <nav class="topbar-nav">
        <a href="#" class="nav-item" @click.prevent="openOfficialWebsite">
          LTO OFFICIAL WEBPAGE
        </a>
        <a
          href="#"
          class="nav-item active elearning-active"
          @click.prevent="goToELearning"
        >
          E-LEARNING
        </a>
        <a href="#" class="nav-item" @click.prevent="goToContact">CONTACT</a>
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
          <button type="button" class="user-dropdown-item" @click="goToContact">
            Contact
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

    <main class="main-content">
      <section class="hero">
        <div class="hero-grid">
          <div class="hero-copy">
            <p class="eyebrow">LTO E-Learning</p>
            <h1>Learn faster. Search smarter. Drive better.</h1>
            <p class="hero-text">
              Explore LTMS learning content in a cleaner, easier-to-find format.
              Search for lessons, browse road safety topics, and continue your
              learning journey with a more structured government learning
              experience.
            </p>

            <div class="search-wrap">
              <div class="search-box">
                <svg viewBox="0 0 24 24" class="search-icon" aria-hidden="true">
                  <circle
                    cx="11"
                    cy="11"
                    r="6.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  />
                  <path
                    d="M16 16l5 5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>

                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search topics, modules, road safety lessons, vehicle registration..."
                  class="search-input"
                  @keydown.enter.prevent="focusSearchResults"
                />

                <button
                  v-if="searchQuery"
                  type="button"
                  class="clear-btn"
                  @click="searchQuery = ''"
                >
                  ×
                </button>
              </div>
            </div>

            <div class="quick-tags">
              <button
                v-for="tag in quickTags"
                :key="tag"
                type="button"
                class="tag-btn"
                @click="applyQuickTag(tag)"
              >
                {{ tag }}
              </button>
            </div>
          </div>

          <div class="hero-panel">
            <div class="hero-stat-card">
              <span class="hero-stat-label">Available Courses</span>
              <strong>{{ modules.length }}</strong>
            </div>
            <div class="hero-stat-card">
              <span class="hero-stat-label">Learning Categories</span>
              <strong>{{ categories.length }}</strong>
            </div>
            <div class="hero-stat-card">
              <span class="hero-stat-label">Completed Courses</span>
              <strong>{{ completedCount }}</strong>
            </div>
          </div>
        </div>
      </section>

      <section class="featured-section">
        <div class="section-title-row">
          <div>
            <h2>Featured Learning Paths</h2>
            <p>Start with the most useful and commonly accessed modules.</p>
          </div>
        </div>

        <div class="featured-grid">
          <article
            v-for="item in featuredModules"
            :key="item.id"
            class="featured-card"
            :class="{ done: isCompleted(item.id) }"
          >
            <div
              class="featured-image"
              :style="{
                backgroundImage: `linear-gradient(rgba(8,44,102,0.12), rgba(8,44,102,0.4)), url(${item.heroImage})`,
              }"
            ></div>

            <div class="featured-top">
              <span class="featured-pill">{{ item.category }}</span>
              <span class="featured-time">{{ item.duration }}</span>
            </div>

            <div class="completion-row">
              <span
                class="completion-badge"
                :class="{ completed: isCompleted(item.id) }"
              >
                {{ isCompleted(item.id) ? "Completed" : "Not Started" }}
              </span>
            </div>

            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>

            <div class="featured-footer">
              <span>{{ item.lessons }} lessons</span>
              <div class="featured-actions">
                <button
                  type="button"
                  class="preview-btn"
                  @click="previewLesson(item.id)"
                >
                  Preview
                </button>
                <button
                  type="button"
                  class="featured-btn"
                  @click="openLesson(item.id)"
                >
                  {{
                    isCompleted(item.id) ? "Review Lesson" : "Start Learning"
                  }}
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section
        ref="courseOverviewRef"
        class="details-section"
        v-if="selectedModule"
      >
        <div class="section-title-row">
          <div>
            <h2>Course Overview</h2>
            <p>
              Review the selected topic, lessons, videos, quiz items, and
              supplemental resources.
            </p>
          </div>
        </div>

        <div class="details-grid">
          <article class="details-main-card">
            <div
              class="details-banner"
              :style="{
                backgroundImage: `linear-gradient(rgba(8,44,102,0.14), rgba(8,44,102,0.46)), url(${selectedModule.heroImage})`,
              }"
            >
              <div class="details-banner-content">
                <span class="details-code">{{ selectedModule.code }}</span>
                <span class="details-category">{{
                  selectedModule.category
                }}</span>
              </div>
            </div>

            <div class="details-body">
              <div class="details-head">
                <div>
                  <h3>{{ selectedModule.title }}</h3>
                  <p class="details-description">
                    {{ selectedModule.description }}
                  </p>
                </div>

                <div class="details-meta-boxes">
                  <div class="meta-box">
                    <span>Duration</span>
                    <strong>{{ selectedModule.duration }}</strong>
                  </div>
                  <div class="meta-box">
                    <span>Lessons</span>
                    <strong>{{ selectedModule.lessons }}</strong>
                  </div>
                  <div class="meta-box">
                    <span>Level</span>
                    <strong>{{ selectedModule.level }}</strong>
                  </div>
                </div>
              </div>

              <div class="details-content-grid">
                <div class="details-subcard">
                  <h4>What you will learn</h4>
                  <ul class="details-list">
                    <li
                      v-for="outcome in selectedModule.outcomes"
                      :key="outcome"
                    >
                      {{ outcome }}
                    </li>
                  </ul>
                </div>

                <div class="details-subcard">
                  <h4>Official learning note</h4>
                  <p class="official-note">{{ selectedModule.officialNote }}</p>

                  <div class="module-tags large-tags">
                    <span
                      v-for="keyword in selectedModule.keywords"
                      :key="keyword"
                      class="module-tag"
                    >
                      {{ keyword }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="details-block">
                <div class="block-header">
                  <h4>Learning Modules</h4>
                  <span>{{ selectedModule.modules.length }} modules</span>
                </div>

                <div class="lesson-module-list">
                  <article
                    v-for="lesson in selectedModule.modules"
                    :key="lesson.title"
                    class="lesson-module-card"
                  >
                    <div class="lesson-module-number">{{ lesson.number }}</div>
                    <div class="lesson-module-copy">
                      <h5>{{ lesson.title }}</h5>
                      <p>{{ lesson.description }}</p>
                    </div>
                    <span class="lesson-module-time">{{
                      lesson.duration
                    }}</span>
                  </article>
                </div>
              </div>

              <div class="details-block">
                <div class="block-header">
                  <h4>Quick Quiz Preview</h4>
                  <span>{{ selectedModule.quiz.length }} questions</span>
                </div>

                <div class="quiz-preview-list">
                  <article
                    v-for="question in selectedModule.quiz"
                    :key="question.question"
                    class="quiz-preview-card"
                  >
                    <h5>{{ question.question }}</h5>
                    <ul>
                      <li v-for="choice in question.choices" :key="choice">
                        {{ choice }}
                      </li>
                    </ul>
                  </article>
                </div>
              </div>

              <div class="details-actions">
                <button
                  type="button"
                  class="module-btn large-btn"
                  @click="openLesson(selectedModule.id)"
                >
                  {{
                    isCompleted(selectedModule.id)
                      ? "Review Full Lesson"
                      : "Open Full Lesson"
                  }}
                </button>
              </div>
            </div>
          </article>

          <aside class="details-side-card full-media-panel">
            <div class="side-card-header">
              <h4>Supplemental Videos</h4>
              <p>
                Helpful explainers, public information clips, and review
                materials for this topic.
              </p>
            </div>

            <div class="topic-video-shell">
              <div class="topic-video-hero" v-if="selectedModule.videos.length">
                <div class="topic-video-hero-frame">
                  <iframe
                    :src="selectedModule.videos[0].url"
                    :title="selectedModule.videos[0].title"
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

                  <div class="topic-video-hero-overlay">
                    <span class="topic-video-play-chip">Featured Video</span>
                  </div>
                </div>

                <div class="topic-video-hero-copy">
                  <div class="topic-video-hero-row">
                    <span class="video-badge hero-badge">
                      {{ selectedModule.videos[0].label }}
                    </span>
                    <span class="topic-video-runtime">Recommended First</span>
                  </div>

                  <h5>{{ selectedModule.videos[0].title }}</h5>
                  <p>
                    {{
                      selectedModule.videos[0].description ||
                      "Featured explainer for this lesson topic, recommended as the first review material before proceeding to the next step."
                    }}
                  </p>
                </div>
              </div>

              <div class="topic-video-stats">
                <div class="topic-video-stat">
                  <span>Topic videos</span>
                  <strong>{{ selectedModule.videos.length }}</strong>
                </div>
                <div class="topic-video-stat">
                  <span>Recommended use</span>
                  <strong>Review</strong>
                </div>
              </div>

              <div class="topic-video-grid">
                <article
                  v-for="(video, index) in selectedModule.videos.slice(1)"
                  :key="`${video.title}-${index}`"
                  class="topic-video-card compact"
                >
                  <div class="topic-video-frame compact-frame">
                    <iframe
                      :src="video.url"
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

                    <div class="topic-video-thumb-overlay">
                      <span class="topic-video-thumb-play">▶</span>
                    </div>
                  </div>

                  <div class="topic-video-copy compact-copy">
                    <div class="topic-video-copy-top">
                      <span class="video-badge">{{ video.label }}</span>
                      <span class="topic-video-mini-tag">Watch</span>
                    </div>

                    <h5>{{ video.title }}</h5>
                    <p class="topic-video-description">
                      {{
                        video.description ||
                        "Helpful review material for lesson reinforcement and additional topic context."
                      }}
                    </p>
                  </div>
                </article>

                <div
                  v-if="selectedModule.videos.length < 4"
                  class="topic-video-card study-guide-card"
                >
                  <div class="study-guide-copy">
                    <div class="study-guide-head">
                      <span class="video-badge">Topic Study Guide</span>
                      <span class="topic-video-mini-tag">{{
                        selectedModule.duration
                      }}</span>
                    </div>

                    <h5>Use this topic panel as a quick review guide</h5>
                    <ul class="study-guide-list">
                      <li>
                        Watch the featured explainer first for the main
                        overview.
                      </li>
                      <li>
                        Use the supporting videos below for reinforcement and
                        recall.
                      </li>
                      <li>
                        Return to the lesson notes before moving to the next
                        topic.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section class="highlights-section">
        <div class="section-title-row">
          <div>
            <h2>Official Learning Highlights</h2>
            <p>Key areas learners should focus on across the LTMS platform.</p>
          </div>
        </div>

        <div class="highlight-grid">
          <article
            v-for="item in officialLearningHighlights"
            :key="item.title"
            class="highlight-learning-card"
          >
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </article>
        </div>
      </section>

      <section ref="learningCatalogRef" class="catalog-section">
        <div class="catalog-head">
          <div>
            <h2>Learning Catalog</h2>
            <p>
              {{ filteredModules.length }} course<span
                v-if="filteredModules.length !== 1"
              >
                s</span
              >
              found
            </p>
          </div>

          <div class="catalog-tools">
            <select
              v-model="selectedCategory"
              class="category-select"
              @change="focusLearningCatalog"
            >
              <option value="ALL">All Categories</option>
              <option
                v-for="category in categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="filteredModules.length" class="module-grid">
          <article
            v-for="module in filteredModules"
            :key="module.id"
            class="module-card"
            :class="{ done: isCompleted(module.id) }"
          >
            <div
              class="module-cover"
              :style="{
                backgroundImage: `linear-gradient(rgba(8,44,102,0.1), rgba(8,44,102,0.35)), url(${module.heroImage})`,
              }"
            ></div>

            <div class="module-card-top">
              <div class="module-badge-row">
                <span class="module-badge">{{ module.code }}</span>
                <span class="module-level">{{ module.level }}</span>
              </div>

              <span class="module-duration">{{ module.duration }}</span>
            </div>

            <div class="completion-row">
              <span
                class="completion-badge"
                :class="{ completed: isCompleted(module.id) }"
              >
                {{ isCompleted(module.id) ? "Completed" : "Not Started" }}
              </span>
            </div>

            <h3>{{ module.title }}</h3>
            <p class="module-desc">{{ module.description }}</p>

            <div class="module-meta">
              <span>{{ module.category }}</span>
              <span>{{ module.lessons }} lessons</span>
            </div>

            <div class="module-tags">
              <span
                v-for="keyword in module.keywords.slice(0, 3)"
                :key="keyword"
                class="module-tag"
              >
                {{ keyword }}
              </span>
            </div>

            <div class="module-actions">
              <button
                type="button"
                class="preview-btn"
                @click="previewLesson(module.id)"
              >
                Preview
              </button>

              <button
                type="button"
                class="module-btn"
                @click="openLesson(module.id)"
              >
                {{ isCompleted(module.id) ? "Review Lesson" : "Open Lesson" }}
              </button>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          <h3>No lessons found</h3>
          <p>Try another keyword or choose a different category.</p>
        </div>
      </section>

      <section class="supplemental-media-section">
        <div class="section-title-row">
          <div>
            <h2>Supplemental Video Guides</h2>
            <p>
              Helpful video references for learning reinforcement and public
              information.
            </p>
          </div>
        </div>

        <div class="video-grid">
          <article
            v-for="video in supplementalVideos"
            :key="video.title"
            class="video-card"
          >
            <div class="video-frame">
              <iframe
                :src="video.url"
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
              <span class="video-badge">{{ video.label }}</span>
              <h3>{{ video.title }}</h3>
              <p>{{ video.description }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="photo-learning-section">
        <div class="section-title-row">
          <div>
            <h2>Learning Support Cards</h2>
            <p>Visual reminders and topic snapshots for faster review.</p>
          </div>
        </div>

        <div class="photo-grid">
          <article
            v-for="card in learningSupportCards"
            :key="card.title"
            class="photo-card"
          >
            <div
              class="photo-card-image"
              :style="{
                backgroundImage: `linear-gradient(rgba(8,44,102,0.14), rgba(8,44,102,0.46)), url(${card.image})`,
              }"
            ></div>
            <div class="photo-card-body">
              <span class="photo-card-tag">{{ card.tag }}</span>
              <h3>{{ card.title }}</h3>
              <p>{{ card.text }}</p>
            </div>
          </article>
        </div>
      </section>
    </main>

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
import { computed, nextTick, onMounted, onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";
import logo from "../assets/logo.png";

type LessonModule = {
  number: string;
  title: string;
  description: string;
  duration: string;
};

type VideoItem = {
  title: string;
  url: string;
  label: string;
  description?: string;
};

type QuizItem = {
  question: string;
  choices: string[];
};

type ModuleItem = {
  id: number;
  code: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  lessons: number;
  level: string;
  featured?: boolean;
  keywords: string[];
  outcomes: string[];
  officialNote: string;
  heroImage: string;
  modules: LessonModule[];
  videos: VideoItem[];
  quiz: QuizItem[];
  images: string[];
};

const COMPLETED_KEY = "ltms_completed_lessons";

const router = useRouter();
const searchQuery = ref("");
const selectedCategory = ref("ALL");
const completedLessons = ref<number[]>([]);
const selectedModuleId = ref<number | null>(1);
const courseOverviewRef = ref<HTMLElement | null>(null);
const learningCatalogRef = ref<HTMLElement | null>(null);
const isPageLoading = ref(false);
const showUserMenu = ref(false);
const showLogoutModal = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

const goToProfile = async () => {
  closeUserMenu();
  const started = await beginPageLoading();
  if (!started) return;

  try {
    await router.push("/profile");
  } catch {
    isPageLoading.value = false;
  }
};

const mockImages = {
  licensing:
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80",
  driving:
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  road: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  vehicle:
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
  document:
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
  traffic:
    "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1200&q=80",
  office:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  classroom:
    "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80",
  safety:
    "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=1200&q=80",
};

const loadCompletedLessons = () => {
  const saved = localStorage.getItem(COMPLETED_KEY);
  completedLessons.value = saved ? JSON.parse(saved) : [];
};

const delay = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

const beginPageLoading = async () => {
  if (isPageLoading.value) return false;
  isPageLoading.value = true;
  showUserMenu.value = false;
  showLogoutModal.value = false;
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  await nextTick();
  await delay(220);
  return true;
};

const endPageLoading = async (ms = 220) => {
  await delay(ms);
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
  if (!userMenuRef.value.contains(target)) {
    closeUserMenu();
  }
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
  closeUserMenu();

  const started = await beginPageLoading();
  if (!started) return;

  try {
    localStorage.clear();
    sessionStorage.clear();
    await router.push("/");
  } catch {
    isPageLoading.value = false;
  }
};

onMounted(() => {
  loadCompletedLessons();
  window.addEventListener("storage", loadCompletedLessons);
  window.addEventListener(
    "ltms-progress-updated",
    loadCompletedLessons as EventListener,
  );
  document.addEventListener("click", handleDocumentClick);
});

onBeforeUnmount(() => {
  window.removeEventListener("storage", loadCompletedLessons);
  window.removeEventListener(
    "ltms-progress-updated",
    loadCompletedLessons as EventListener,
  );
  document.removeEventListener("click", handleDocumentClick);
});

const openLesson = async (id: number) => {
  closeUserMenu();
  selectedModuleId.value = id;

  const started = await beginPageLoading();
  if (!started) return;

  try {
    await router.push(`/e-learning/${id}`);
  } catch {
    isPageLoading.value = false;
  }
};

const previewLesson = async (id: number) => {
  if (isPageLoading.value) return;

  isPageLoading.value = true;
  selectedModuleId.value = id;

  await nextTick();
  courseOverviewRef.value?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  await endPageLoading(180);
};

const focusLearningCatalog = async () => {
  if (isPageLoading.value) return;

  isPageLoading.value = true;
  await nextTick();

  learningCatalogRef.value?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  await endPageLoading(180);
};

const focusSearchResults = async () => {
  await focusLearningCatalog();
};

const applyQuickTag = async (tag: string) => {
  searchQuery.value = tag;
  selectedCategory.value = categories.value.includes(tag) ? tag : "ALL";
  await focusLearningCatalog();
};

const goToELearning = async () => {
  closeUserMenu();
  const currentPath = router.currentRoute.value.path;
  const started = await beginPageLoading();
  if (!started) return;

  if (currentPath === "/e-learning") {
    await endPageLoading(260);
    return;
  }

  try {
    await router.push("/e-learning");
  } catch {
    isPageLoading.value = false;
  }
};

const goToDashboard = async () => {
  closeUserMenu();
  const currentPath = router.currentRoute.value.path;
  const started = await beginPageLoading();
  if (!started) return;

  if (currentPath === "/home") {
    await endPageLoading(260);
    return;
  }

  try {
    await router.push("/home");
  } catch {
    isPageLoading.value = false;
  }
};

const goToContact = async () => {
  closeUserMenu();
  const started = await beginPageLoading();
  if (!started) return;
  await endPageLoading(280);
};

const openOfficialWebsite = async () => {
  closeUserMenu();
  const started = await beginPageLoading();
  if (!started) return;

  await delay(180);
  window.open("https://lto.gov.ph", "_blank", "noopener,noreferrer");
  await endPageLoading(160);
};

const isCompleted = (id: number) => completedLessons.value.includes(id);

const completedCount = computed(() => completedLessons.value.length);

const modules = ref<ModuleItem[]>([
  {
    id: 1,
    code: "I",
    title: "Licensing Information",
    description:
      "Understand license classifications, qualifications, fees, requirements, and the overall application process.",
    category: "Licensing",
    duration: "20 min",
    lessons: 6,
    level: "Beginner",
    featured: true,
    keywords: ["license", "classification", "fees", "requirements"],
    outcomes: [
      "Identify the main driver's license classifications",
      "Understand qualification requirements before applying",
      "Review fees, process flow, and documentary expectations",
    ],
    officialNote:
      "Best taken before starting any new application or renewal-related workflow.",
    heroImage: mockImages.licensing,
    modules: [
      {
        number: "1.1",
        title: "License Classifications",
        description:
          "Review the different driver's license types and their allowed vehicle classes.",
        duration: "4 min",
      },
      {
        number: "1.2",
        title: "Eligibility and Qualifications",
        description:
          "Understand age, identity, and other basic requirements before applying.",
        duration: "3 min",
      },
      {
        number: "1.3",
        title: "Required Documents",
        description:
          "Learn which supporting documents are usually needed during processing.",
        duration: "4 min",
      },
      {
        number: "1.4",
        title: "Fees and Processing Flow",
        description:
          "Review the standard sequence from submission to release and related costs.",
        duration: "5 min",
      },
    ],
    videos: [
      {
        title: "LTO Portal Overview",
        url: "https://www.youtube-nocookie.com/embed/VVj5nW_X-nE",
        label: "Portal Guide",
      },
      {
        title: "Before Going to an LTO Office",
        url: "https://www.youtube-nocookie.com/embed/olJhfjgLMG0",
        label: "Preparation",
      },
      {
        title: "Mga Kailangan sa Pagkuha ng Plaka",
        url: "https://www.youtube-nocookie.com/embed/KL_m3n8C0k4",
        label: "Compliance",
      },
    ],
    quiz: [
      {
        question:
          "Which topic should be reviewed before starting an application?",
        choices: [
          "License classifications",
          "Movie trailers",
          "Restaurant schedules",
          "Shopping brands",
        ],
      },
      {
        question: "Why are documentary requirements important?",
        choices: [
          "They support identity and qualification checks",
          "They replace driving lessons",
          "They remove all fees",
          "They skip evaluation",
        ],
      },
    ],
    images: [
      mockImages.licensing,
      mockImages.document,
      mockImages.office,
      mockImages.classroom,
    ],
  },
  {
    id: 2,
    code: "II",
    title: "Getting Ready to Drive",
    description:
      "Learn how to prepare yourself and your vehicle before entering the road.",
    category: "Driving Basics",
    duration: "18 min",
    lessons: 4,
    level: "Beginner",
    featured: true,
    keywords: ["ready", "drive", "preparation", "vehicle check"],
    outcomes: [
      "Perform basic pre-drive readiness checks",
      "Recognize safe preparation habits before travel",
      "Build awareness before actual vehicle operation",
    ],
    officialNote:
      "Ideal for first-time learners and student permit applicants.",
    heroImage: mockImages.driving,
    modules: [
      {
        number: "2.1",
        title: "Driver Readiness",
        description:
          "Check alertness, condition, and responsibility before driving.",
        duration: "4 min",
      },
      {
        number: "2.2",
        title: "Vehicle Walkaround",
        description:
          "Inspect tires, mirrors, lights, and basic condition before travel.",
        duration: "5 min",
      },
      {
        number: "2.3",
        title: "Seat, Mirror, and Control Setup",
        description: "Prepare the vehicle interior for safer operation.",
        duration: "4 min",
      },
    ],
    videos: [
      {
        title: "Before Going to an LTO Office",
        url: "https://www.youtube-nocookie.com/embed/olJhfjgLMG0",
        label: "Preparation",
      },
      {
        title: "Welcome to LTO Konek",
        url: "https://www.youtube-nocookie.com/embed/VVj5nW_X-nE",
        label: "Guide",
      },
    ],
    quiz: [
      {
        question: "What should be checked before driving?",
        choices: [
          "Vehicle condition and personal readiness",
          "Only the radio volume",
          "Only the seat color",
          "Only the fuel brand",
        ],
      },
      {
        question: "Why adjust mirrors before driving?",
        choices: [
          "To improve visibility and awareness",
          "To increase engine power",
          "To reduce registration cost",
          "To change plate number",
        ],
      },
    ],
    images: [
      mockImages.driving,
      mockImages.vehicle,
      mockImages.safety,
      mockImages.traffic,
    ],
  },
  {
    id: 3,
    code: "III",
    title: "Driving Fundamentals",
    description:
      "Study steering, braking, controls, awareness, and basic safe vehicle movement in traffic.",
    category: "Driving Basics",
    duration: "24 min",
    lessons: 7,
    level: "Beginner",
    featured: true,
    keywords: ["fundamentals", "steering", "controls", "driving"],
    outcomes: [
      "Understand basic vehicle control concepts",
      "Apply safer movement and awareness principles",
      "Recognize essential driving fundamentals for new learners",
    ],
    officialNote: "Recommended after completing pre-drive preparation topics.",
    heroImage: mockImages.traffic,
    modules: [
      {
        number: "3.1",
        title: "Basic Controls",
        description:
          "Learn the function of steering, pedals, gears, and hand signals.",
        duration: "5 min",
      },
      {
        number: "3.2",
        title: "Starting, Stopping, and Turning",
        description:
          "Practice the core movement sequence in a controlled manner.",
        duration: "6 min",
      },
      {
        number: "3.3",
        title: "Awareness in Motion",
        description:
          "Build scanning habits and safer reaction awareness while driving.",
        duration: "5 min",
      },
    ],
    videos: [
      {
        title: "Driving Guide Support Video",
        url: "https://www.youtube-nocookie.com/embed/VVj5nW_X-nE",
        label: "Learning",
      },
      {
        title: "Preparation and Guidance",
        url: "https://www.youtube-nocookie.com/embed/olJhfjgLMG0",
        label: "Guide",
      },
      {
        title: "Mga Kailangan sa Pagkuha ng Plaka",
        url: "https://www.youtube-nocookie.com/embed/KL_m3n8C0k4",
        label: "Review",
      },
    ],
    quiz: [
      {
        question: "Which is a core driving fundamental?",
        choices: [
          "Steering and braking control",
          "Changing wallpaper",
          "Shopping online",
          "Choosing music playlists",
        ],
      },
      {
        question: "Why is awareness important while driving?",
        choices: [
          "It helps recognize hazards and react safely",
          "It makes the car faster",
          "It reduces all penalties automatically",
          "It replaces licensing requirements",
        ],
      },
    ],
    images: [
      mockImages.traffic,
      mockImages.driving,
      mockImages.vehicle,
      mockImages.safety,
    ],
  },
  {
    id: 4,
    code: "IV",
    title: "Road Courtesy and Safety",
    description:
      "Learn lane discipline, defensive driving, respectful road behavior, and public safety principles.",
    category: "Road Safety",
    duration: "22 min",
    lessons: 5,
    level: "Intermediate",
    featured: true,
    keywords: ["road", "courtesy", "safety", "defensive"],
    outcomes: [
      "Apply courtesy and discipline on public roads",
      "Recognize defensive driving behavior",
      "Reduce risk through safer road decisions",
    ],
    officialNote:
      "Important for all drivers, especially those reviewing for compliance and renewal.",
    heroImage: mockImages.safety,
    modules: [
      {
        number: "4.1",
        title: "Road Courtesy Principles",
        description:
          "Understand respectful road behavior toward pedestrians and other motorists.",
        duration: "4 min",
      },
      {
        number: "4.2",
        title: "Defensive Driving Basics",
        description:
          "Identify ways to reduce risk through anticipation and caution.",
        duration: "5 min",
      },
      {
        number: "4.3",
        title: "Lane Discipline and Road Awareness",
        description:
          "Review proper positioning and behavior in shared road environments.",
        duration: "5 min",
      },
    ],
    videos: [
      {
        title: "LTO KONEK: Mga Kailangan sa Pagkuha ng Plaka",
        url: "https://www.youtube-nocookie.com/embed/KL_m3n8C0k4",
        label: "Compliance",
      },
      {
        title: "Before Going to an LTO Office",
        url: "https://www.youtube-nocookie.com/embed/olJhfjgLMG0",
        label: "Safety",
      },
      {
        title: "Welcome to LTO Konek",
        url: "https://www.youtube-nocookie.com/embed/VVj5nW_X-nE",
        label: "Guide",
      },
    ],
    quiz: [
      {
        question: "What is a defensive driving principle?",
        choices: [
          "Anticipating possible hazards",
          "Ignoring road signs",
          "Speeding in curves",
          "Blocking intersections",
        ],
      },
      {
        question: "Road courtesy helps improve:",
        choices: [
          "Safety and shared road discipline",
          "Engine displacement",
          "Paint color",
          "Fuel brand preference",
        ],
      },
    ],
    images: [
      mockImages.safety,
      mockImages.road,
      mockImages.traffic,
      mockImages.driving,
    ],
  },
  {
    id: 5,
    code: "V",
    title: "Rights, Duties and Responsibilities of Drivers",
    description:
      "Review the responsibilities of being a licensed driver, including lawful behavior and public accountability.",
    category: "Driver Responsibility",
    duration: "16 min",
    lessons: 4,
    level: "Beginner",
    keywords: ["rights", "duties", "responsibilities", "drivers", "law"],
    outcomes: [
      "Understand the duties expected from licensed drivers",
      "Recognize accountability on public roads",
      "Align driving behavior with lawful practice",
    ],
    officialNote:
      "Useful for both new applicants and experienced drivers reviewing obligations.",
    heroImage: mockImages.document,
    modules: [
      {
        number: "5.1",
        title: "Driver Obligations",
        description: "Review legal and ethical responsibilities on the road.",
        duration: "4 min",
      },
      {
        number: "5.2",
        title: "Public Accountability",
        description: "Understand how driver conduct affects other road users.",
        duration: "4 min",
      },
    ],
    videos: [
      {
        title: "Public Guide Video",
        url: "https://www.youtube-nocookie.com/embed/olJhfjgLMG0",
        label: "Guide",
      },
      {
        title: "Welcome to LTO Konek",
        url: "https://www.youtube-nocookie.com/embed/VVj5nW_X-nE",
        label: "Learning",
      },
      {
        title: "Mga Kailangan sa Pagkuha ng Plaka",
        url: "https://www.youtube-nocookie.com/embed/KL_m3n8C0k4",
        label: "Reference",
      },
    ],
    quiz: [
      {
        question: "A driver should be accountable to:",
        choices: [
          "Other road users and the law",
          "Only passengers they know",
          "Only private parking guards",
          "Only insurance agents",
        ],
      },
    ],
    images: [
      mockImages.document,
      mockImages.office,
      mockImages.classroom,
      mockImages.road,
    ],
  },
  {
    id: 6,
    code: "VI",
    title: "Motor Vehicle Registration",
    description:
      "Review vehicle registration procedures, compliance reminders, and record management essentials.",
    category: "Vehicle",
    duration: "19 min",
    lessons: 5,
    level: "Intermediate",
    keywords: ["motor vehicle", "registration", "vehicle", "records"],
    outcomes: [
      "Understand basic registration-related workflow topics",
      "Review documentation and compliance awareness",
      "Recognize the role of updated records in legal road use",
    ],
    officialNote:
      "Important for motorists managing registration status and supporting records.",
    heroImage: mockImages.vehicle,
    modules: [
      {
        number: "6.1",
        title: "Registration Basics",
        description:
          "Understand the purpose of registration and why updated records matter.",
        duration: "4 min",
      },
      {
        number: "6.2",
        title: "Record and Compliance Review",
        description:
          "Learn about maintaining complete and updated registration information.",
        duration: "5 min",
      },
    ],
    videos: [
      {
        title: "Mga Kailangan sa Pagkuha ng Plaka",
        url: "https://www.youtube-nocookie.com/embed/KL_m3n8C0k4",
        label: "Vehicle",
      },
      {
        title: "Before Going to an LTO Office",
        url: "https://www.youtube-nocookie.com/embed/olJhfjgLMG0",
        label: "Preparation",
      },
      {
        title: "Welcome to LTO Konek",
        url: "https://www.youtube-nocookie.com/embed/VVj5nW_X-nE",
        label: "Guide",
      },
    ],
    quiz: [
      {
        question: "Why are updated registration records important?",
        choices: [
          "They support legal and compliant road use",
          "They increase music quality",
          "They change license class",
          "They replace driver tests",
        ],
      },
    ],
    images: [
      mockImages.vehicle,
      mockImages.document,
      mockImages.traffic,
      mockImages.office,
    ],
  },
  {
    id: 7,
    code: "VII",
    title: "Land Transportation Related Laws",
    description:
      "Get familiar with transportation laws, public road rules, and the legal basis of traffic enforcement.",
    category: "Law",
    duration: "26 min",
    lessons: 6,
    level: "Intermediate",
    keywords: ["laws", "transportation", "legal", "rules", "policy"],
    outcomes: [
      "Recognize major transport-related legal concepts",
      "Understand the role of laws in road discipline and enforcement",
      "Connect lawful behavior with safer road usage",
    ],
    officialNote:
      "Recommended for learners reviewing responsibilities, violations, and compliance.",
    heroImage: mockImages.office,
    modules: [
      {
        number: "7.1",
        title: "Legal Foundations",
        description:
          "Review the purpose of transport-related laws in public safety.",
        duration: "5 min",
      },
      {
        number: "7.2",
        title: "Rules and Enforcement",
        description:
          "Understand how rules support order and legal road behavior.",
        duration: "5 min",
      },
    ],
    videos: [
      {
        title: "Guide Before Visiting LTO",
        url: "https://www.youtube-nocookie.com/embed/olJhfjgLMG0",
        label: "Law",
      },
      {
        title: "Welcome to LTO Konek",
        url: "https://www.youtube-nocookie.com/embed/VVj5nW_X-nE",
        label: "Guide",
      },
      {
        title: "Mga Kailangan sa Pagkuha ng Plaka",
        url: "https://www.youtube-nocookie.com/embed/KL_m3n8C0k4",
        label: "Reference",
      },
    ],
    quiz: [
      {
        question: "Transportation laws mainly help with:",
        choices: [
          "Road order, safety, and accountability",
          "Vehicle paint selection",
          "Seat cover trends",
          "Fuel discounts only",
        ],
      },
    ],
    images: [
      mockImages.office,
      mockImages.document,
      mockImages.road,
      mockImages.classroom,
    ],
  },
  {
    id: 8,
    code: "VIII",
    title: "Fines and Penalties for Violations",
    description:
      "Know the consequences of common violations, including fines, penalties, suspensions, and sanctions.",
    category: "Law",
    duration: "15 min",
    lessons: 4,
    level: "Beginner",
    keywords: ["fines", "penalties", "violations", "sanctions"],
    outcomes: [
      "Understand the impact of common transport violations",
      "Recognize why compliance reduces legal and financial risk",
      "Review how penalties connect to driver accountability",
    ],
    officialNote:
      "Useful as a quick review before renewal and compliance learning.",
    heroImage: mockImages.road,
    modules: [
      {
        number: "8.1",
        title: "Common Violations",
        description:
          "Review the types of violations that can lead to penalties.",
        duration: "4 min",
      },
      {
        number: "8.2",
        title: "Penalties and Consequences",
        description:
          "Understand the effect of fines, suspensions, and sanctions.",
        duration: "4 min",
      },
    ],
    videos: [
      {
        title: "Compliance Reminder Video",
        url: "https://www.youtube-nocookie.com/embed/KL_m3n8C0k4",
        label: "Penalty",
      },
      {
        title: "Before Going to an LTO Office",
        url: "https://www.youtube-nocookie.com/embed/olJhfjgLMG0",
        label: "Guide",
      },
      {
        title: "Welcome to LTO Konek",
        url: "https://www.youtube-nocookie.com/embed/VVj5nW_X-nE",
        label: "Learning",
      },
    ],
    quiz: [
      {
        question: "Why should drivers know about fines and penalties?",
        choices: [
          "To avoid risky and unlawful behavior",
          "To remove all documentation",
          "To skip road rules",
          "To replace registration requirements",
        ],
      },
    ],
    images: [
      mockImages.road,
      mockImages.traffic,
      mockImages.document,
      mockImages.vehicle,
    ],
  },
  {
    id: 9,
    code: "IX",
    title: "Driver's License Renewal Course",
    description:
      "Complete the renewal course path and review the lessons and reminders needed before license renewal.",
    category: "Licensing",
    duration: "30 min",
    lessons: 8,
    level: "Intermediate",
    featured: true,
    keywords: ["renewal", "driver license renewal", "course", "license"],
    outcomes: [
      "Prepare for renewal-related learning requirements",
      "Review the most relevant compliance topics before renewal",
      "Strengthen awareness of safe and lawful road behavior",
    ],
    officialNote:
      "Strongly recommended for users returning to the portal for renewal-related learning.",
    heroImage: mockImages.classroom,
    modules: [
      {
        number: "9.1",
        title: "Renewal Course Introduction",
        description:
          "Review the learning expectations for renewal preparation.",
        duration: "5 min",
      },
      {
        number: "9.2",
        title: "Compliance Refresher",
        description:
          "Revisit the most relevant safety and legal awareness topics.",
        duration: "6 min",
      },
      {
        number: "9.3",
        title: "Readiness Before Renewal",
        description:
          "Understand what to review before continuing with renewal-related steps.",
        duration: "5 min",
      },
    ],
    videos: [
      {
        title: "Welcome to LTO Konek",
        url: "https://www.youtube-nocookie.com/embed/VVj5nW_X-nE",
        label: "Renewal",
      },
      {
        title: "Before Going to an LTO Office",
        url: "https://www.youtube-nocookie.com/embed/olJhfjgLMG0",
        label: "Preparation",
      },
    ],
    quiz: [
      {
        question: "What is important before renewal-related processing?",
        choices: [
          "Reviewing compliance and learning reminders",
          "Changing vehicle color",
          "Buying accessories",
          "Skipping documentation",
        ],
      },
      {
        question: "A renewal learning course helps drivers:",
        choices: [
          "Refresh safety and legal awareness",
          "Avoid all road rules",
          "Remove all penalties instantly",
          "Replace registration duties",
        ],
      },
    ],
    images: [
      mockImages.classroom,
      mockImages.licensing,
      mockImages.document,
      mockImages.safety,
    ],
  },
  {
    id: 10,
    code: "X",
    title: "Medical Conditions and Driving Indications",
    description:
      "Understand how medical conditions can affect driving eligibility, restrictions, and declarations.",
    category: "Licensing",
    duration: "14 min",
    lessons: 3,
    level: "Beginner",
    keywords: ["medical", "conditions", "driving indications", "health"],
    outcomes: [
      "Recognize when medical declarations affect licensing",
      "Understand the importance of accurate health-related information",
      "Review how health can influence safe vehicle operation",
    ],
    officialNote:
      "Important for ensuring safe and compliant licensing declarations.",
    heroImage: mockImages.safety,
    modules: [
      {
        number: "10.1",
        title: "Health and Driving Awareness",
        description:
          "Review how medical conditions can affect safe driving decisions.",
        duration: "4 min",
      },
      {
        number: "10.2",
        title: "Declarations and Restrictions",
        description: "Understand why accurate disclosure matters in licensing.",
        duration: "4 min",
      },
    ],
    videos: [
      {
        title: "Preparation Guide",
        url: "https://www.youtube-nocookie.com/embed/olJhfjgLMG0",
        label: "Health",
      },
      {
        title: "Welcome to LTO Konek",
        url: "https://www.youtube-nocookie.com/embed/VVj5nW_X-nE",
        label: "Guide",
      },
      {
        title: "Mga Kailangan sa Pagkuha ng Plaka",
        url: "https://www.youtube-nocookie.com/embed/KL_m3n8C0k4",
        label: "Reference",
      },
    ],
    quiz: [
      {
        question: "Why is accurate medical information important?",
        choices: [
          "It supports safety and proper licensing review",
          "It changes plate color",
          "It lowers fuel use",
          "It replaces exams",
        ],
      },
    ],
    images: [
      mockImages.safety,
      mockImages.document,
      mockImages.office,
      mockImages.classroom,
    ],
  },
  {
    id: 11,
    code: "XI",
    title: "Qualifications and Documentary Requirements",
    description:
      "Review all documentary requirements, supporting papers, identity checks, and qualification standards.",
    category: "Licensing",
    duration: "17 min",
    lessons: 4,
    level: "Beginner",
    keywords: ["documents", "requirements", "qualifications", "papers"],
    outcomes: [
      "Identify the main documentary requirements",
      "Understand qualification-related screening basics",
      "Prepare more efficiently for official processing",
    ],
    officialNote:
      "Recommended before starting applications to avoid incomplete submissions.",
    heroImage: mockImages.document,
    modules: [
      {
        number: "11.1",
        title: "Core Documents",
        description:
          "Review the usual supporting documents required during processing.",
        duration: "4 min",
      },
      {
        number: "11.2",
        title: "Qualification Review",
        description:
          "Understand identity and standards-related screening basics.",
        duration: "4 min",
      },
    ],
    videos: [
      {
        title: "Portal Overview",
        url: "https://www.youtube-nocookie.com/embed/VVj5nW_X-nE",
        label: "Documents",
      },
      {
        title: "Before Going to an LTO Office",
        url: "https://www.youtube-nocookie.com/embed/olJhfjgLMG0",
        label: "Preparation",
      },
      {
        title: "Mga Kailangan sa Pagkuha ng Plaka",
        url: "https://www.youtube-nocookie.com/embed/KL_m3n8C0k4",
        label: "Reference",
      },
    ],
    quiz: [
      {
        question:
          "Why should applicants review documentary requirements early?",
        choices: [
          "To avoid incomplete submissions",
          "To skip all evaluation",
          "To replace learning modules",
          "To avoid road rules",
        ],
      },
    ],
    images: [
      mockImages.document,
      mockImages.office,
      mockImages.licensing,
      mockImages.classroom,
    ],
  },
  {
    id: 12,
    code: "XII",
    title: "LTO Portal Flowchart and Application Journey",
    description:
      "See the step-by-step path from learning to application, including evaluation, processing, and portal navigation.",
    category: "Portal Guide",
    duration: "12 min",
    lessons: 3,
    level: "Beginner",
    keywords: ["portal", "flowchart", "journey", "application"],
    outcomes: [
      "Understand the sequence of portal-based steps",
      "Navigate the application journey more confidently",
      "See how learning connects to transaction flow",
    ],
    officialNote:
      "Best for first-time users of the LTMS portal and learners unfamiliar with digital steps.",
    heroImage: mockImages.office,
    modules: [
      {
        number: "12.1",
        title: "Portal Navigation Basics",
        description:
          "Understand the general structure of LTMS learning and service flow.",
        duration: "4 min",
      },
      {
        number: "12.2",
        title: "Application Journey Overview",
        description:
          "See how the portal connects learning, evaluation, and service steps.",
        duration: "4 min",
      },
    ],
    videos: [
      {
        title: "Welcome to LTO Konek",
        url: "https://www.youtube-nocookie.com/embed/VVj5nW_X-nE",
        label: "Portal",
      },
      {
        title: "Before Going to an LTO Office",
        url: "https://www.youtube-nocookie.com/embed/olJhfjgLMG0",
        label: "Preparation",
      },
      {
        title: "Mga Kailangan sa Pagkuha ng Plaka",
        url: "https://www.youtube-nocookie.com/embed/KL_m3n8C0k4",
        label: "Reference",
      },
    ],
    quiz: [
      {
        question: "Why is the portal journey helpful to understand?",
        choices: [
          "It helps users move through services more confidently",
          "It changes road signs",
          "It reduces vehicle size",
          "It skips all processing",
        ],
      },
    ],
    images: [
      mockImages.office,
      mockImages.classroom,
      mockImages.document,
      mockImages.licensing,
    ],
  },
]);

const quickTags = [
  "Licensing",
  "Road Safety",
  "Registration",
  "Renewal",
  "Law",
];

const supplementalVideos = ref([
  {
    title: "Welcome to LTO Konek",
    url: "https://www.youtube-nocookie.com/embed/VVj5nW_X-nE",
    label: "Portal Guide",
    description:
      "Introductory video content supporting public understanding of LTMS services and digital access.",
  },
  {
    title: "Mga Kailangan sa Pagkuha ng Plaka",
    url: "https://www.youtube-nocookie.com/embed/KL_m3n8C0k4",
    label: "Compliance",
    description:
      "Supplemental public information relevant to documentation, compliance, and motorist awareness.",
  },
  {
    title: "Before Going to an LTO Office",
    url: "https://www.youtube-nocookie.com/embed/olJhfjgLMG0",
    label: "Preparation",
    description:
      "Useful reminders and preparation guidance before continuing with service-related actions.",
  },
]);

const learningSupportCards = ref([
  {
    title: "Licensing Readiness",
    tag: "Preparation",
    text: "Review qualifications, required documents, and category guidance before you begin an application.",
    image: mockImages.licensing,
  },
  {
    title: "Road Safety Review",
    tag: "Safety",
    text: "Reinforce safe driving behavior, courtesy, and defensive road awareness before taking the next module.",
    image: mockImages.safety,
  },
  {
    title: "Vehicle and Registration Awareness",
    tag: "Vehicle",
    text: "Stay familiar with registration-related learning and compliance-oriented responsibilities for motorists.",
    image: mockImages.vehicle,
  },
]);

const categories = computed(() => {
  return [...new Set(modules.value.map((item) => item.category))];
});

const featuredModules = computed(() => {
  return modules.value.filter((item) => item.featured).slice(0, 4);
});

const selectedModule = computed(() => {
  return (
    modules.value.find((item) => item.id === selectedModuleId.value) ?? null
  );
});

const officialLearningHighlights = computed(() => [
  {
    title: "CDE Renewal Preparation",
    text: "Review renewal-related lessons and compliance-driven learning before proceeding with renewal-oriented services.",
  },
  {
    title: "Licensing and Requirements",
    text: "Understand classifications, supporting documents, declarations, and qualification requirements before applying.",
  },
  {
    title: "Road Safety and Legal Awareness",
    text: "Study courtesy, safety, penalties, transport laws, and responsible driver behavior across core modules.",
  },
]);

const filteredModules = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return modules.value.filter((module) => {
    const matchesCategory =
      selectedCategory.value === "ALL" ||
      module.category === selectedCategory.value;

    if (!matchesCategory) return false;
    if (!query) return true;

    const haystack = [
      module.code,
      module.title,
      module.description,
      module.category,
      module.level,
      module.officialNote,
      ...module.keywords,
      ...module.outcomes,
      ...module.modules.map((item) => `${item.title} ${item.description}`),
      ...module.quiz.map((item) => item.question),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
});
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
  animation: elearnSpin 0.85s linear infinite;
}

.page-loading-text {
  color: #154b96;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.01em;
}

@keyframes elearnSpin {
  to {
    transform: rotate(360deg);
  }
}

:global(html, body, #app) {
  margin: 0;
  min-height: 100%;
  width: 100%;
  font-family: Arial, Helvetica, sans-serif;
  background: #f4f7fb;
}

.page {
  min-height: 100vh;
  background:
    linear-gradient(
      180deg,
      rgba(244, 247, 251, 0.96) 0%,
      rgba(244, 247, 251, 0.98) 100%
    ),
    url("../assets/BGC.jpg") center/cover no-repeat;
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
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.nav-item:hover,
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
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  flex: 0 0 30px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.05;
}

.user-name {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #fff;
}

.user-id {
  font-size: 11px;
  font-weight: 700;
  opacity: 0.84;
  color: #fff;
  white-space: nowrap;
}

.user-caret {
  width: 14px;
  height: 14px;
  opacity: 0.9;
  color: #fff;
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

.nav-item:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.14);
  transform: translateY(-1px);
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

.nav-item.dashboard-active {
  padding-inline: 16px;
}

.nav-item.elearning-active {
  padding-inline: 16px;
}

.main-content {
  width: min(1600px, calc(100vw - 48px));
  margin: 0 auto;
  padding: 30px 0 40px;
}

.hero {
  border-radius: 28px;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    rgba(12, 62, 139, 0.94) 0%,
    rgba(36, 88, 180, 0.92) 100%
  );
  color: #fff;
  box-shadow: 0 18px 36px rgba(12, 40, 96, 0.18);
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(300px, 0.65fr);
  gap: 24px;
  padding: 46px 48px 40px;
}

.hero-copy {
  min-width: 0;
}

.hero-panel {
  display: grid;
  gap: 14px;
  align-content: center;
}

.hero-stat-card {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 18px;
  padding: 18px 18px 16px;
  backdrop-filter: blur(4px);
}

.hero-stat-label {
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.8;
  margin-bottom: 8px;
}

.hero-stat-card strong {
  font-size: 24px;
  line-height: 1.15;
}

.eyebrow {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.85;
}

.hero h1 {
  margin: 0;
  font-size: clamp(34px, 4vw, 54px);
  line-height: 1.04;
  font-weight: 800;
  max-width: 900px;
}

.hero-text {
  margin: 16px 0 0;
  max-width: 860px;
  font-size: 17px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.92);
}

.search-wrap {
  margin-top: 30px;
}

.search-box {
  width: 100%;
  max-width: 940px;
  min-height: 62px;
  background: #fff;
  border-radius: 999px;
  display: flex;
  align-items: center;
  padding: 0 18px;
  box-shadow: 0 12px 26px rgba(15, 43, 92, 0.16);
}

.search-icon {
  width: 22px;
  height: 22px;
  color: #5c6b7f;
  flex: 0 0 22px;
}

.search-input {
  flex: 1;
  height: 60px;
  border: none;
  outline: none;
  font-size: 16px;
  color: #1f2937;
  padding: 0 12px;
  background: transparent;
}

.clear-btn {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background: #eef2f7;
  color: #4b5563;
  font-size: 18px;
  cursor: pointer;
}

.quick-tags {
  margin-top: 16px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag-btn {
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  border-radius: 999px;
  padding: 9px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.featured-section,
.details-section,
.highlights-section,
.catalog-section,
.supplemental-media-section,
.photo-learning-section {
  margin-top: 28px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
}

.section-title-row,
.catalog-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 22px;
}

.section-title-row h2,
.catalog-head h2 {
  margin: 0;
  font-size: 30px;
  color: #1f2937;
}

.section-title-row p,
.catalog-head p {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 14px;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.featured-card {
  background: linear-gradient(180deg, #f9fbff 0%, #ffffff 100%);
  border: 1px solid #e5eaf2;
  border-radius: 20px;
  padding: 20px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
}

.featured-card.done,
.module-card.done {
  border-color: #b7e1c5;
  box-shadow: 0 8px 18px rgba(34, 197, 94, 0.08);
}

.featured-image,
.module-cover {
  width: 100%;
  height: 140px;
  border-radius: 16px;
  background-size: cover;
  background-position: center;
  margin-bottom: 16px;
}

.featured-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.featured-pill {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: #e9f0ff;
  color: #2154d8;
  font-size: 12px;
  font-weight: 800;
}

.featured-time {
  font-size: 12px;
  color: #6b7280;
  font-weight: 700;
}

.completion-row {
  margin-top: 12px;
}

.completion-badge {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: #eef2f7;
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
}

.completion-badge.completed {
  background: #dcfce7;
  color: #166534;
}

.featured-card h3,
.module-card h3 {
  margin: 16px 0 10px;
  font-size: 22px;
  line-height: 1.18;
  color: #1f2937;
}

.featured-card p,
.module-desc {
  margin: 0;
  color: #667085;
  font-size: 14px;
  line-height: 1.55;
  flex: 1;
}

.featured-footer,
.module-actions {
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 13px;
  color: #475569;
  font-weight: 700;
}

.featured-actions {
  display: flex;
  gap: 8px;
}

.preview-btn {
  border: 1px solid #d7dfeb;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 10px;
  background: #fff;
  color: #1f4fb8;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.featured-btn,
.module-btn {
  border: none;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 10px;
  background: linear-gradient(180deg, #1f5fb7 0%, #154b96 100%);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.large-btn {
  min-height: 44px;
  padding: 0 18px;
  font-size: 14px;
}

.catalog-tools {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-select {
  min-width: 210px;
  height: 44px;
  border: 1px solid #d6dbe4;
  border-radius: 10px;
  background: #fff;
  padding: 0 12px;
  font-size: 14px;
  color: #334155;
}

.details-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(340px, 0.65fr);
  gap: 20px;
}

.details-main-card,
.details-side-card {
  border: 1px solid #e5eaf2;
  border-radius: 20px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.05);
}

.details-banner {
  height: 220px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.details-banner-content {
  position: absolute;
  left: 20px;
  bottom: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.details-code,
.details-category {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  color: #0f438e;
  font-size: 12px;
  font-weight: 800;
}

.details-body {
  padding: 22px;
}

.details-head {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 22px;
}

.details-head h3 {
  margin: 0 0 10px;
  font-size: 30px;
  color: #17212f;
}

.details-description {
  margin: 0;
  color: #667085;
  line-height: 1.65;
  font-size: 15px;
}

.details-meta-boxes {
  display: grid;
  gap: 10px;
  min-width: 180px;
}

.meta-box {
  background: #f8fbff;
  border: 1px solid #e3ebf6;
  border-radius: 14px;
  padding: 14px;
}

.meta-box span {
  display: block;
  font-size: 12px;
  color: #64748b;
  font-weight: 700;
  margin-bottom: 6px;
}

.meta-box strong {
  font-size: 18px;
  color: #163d7b;
}

.details-content-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.details-subcard {
  border: 1px solid #e6ebf3;
  border-radius: 16px;
  padding: 18px;
  background: #fff;
}

.details-subcard h4,
.side-card-header h4,
.block-header h4 {
  margin: 0 0 12px;
  font-size: 18px;
  color: #1f2937;
}

.details-list {
  margin: 0;
  padding-left: 18px;
}

.details-list li {
  margin-bottom: 10px;
  color: #556274;
  line-height: 1.55;
  font-size: 14px;
}

.official-note {
  margin: 0 0 14px;
  color: #556274;
  line-height: 1.65;
  font-size: 14px;
}

.large-tags {
  margin-top: 10px;
}

.details-block {
  margin-top: 18px;
  border: 1px solid #e6ebf3;
  border-radius: 16px;
  padding: 18px;
}

.block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.block-header span {
  font-size: 12px;
  font-weight: 800;
  color: #64748b;
}

.lesson-module-list,
.quiz-preview-list {
  display: grid;
  gap: 12px;
}

.lesson-module-card,
.quiz-preview-card {
  border: 1px solid #e5eaf2;
  border-radius: 14px;
  padding: 14px;
  background: #fbfdff;
}

.lesson-module-card {
  display: grid;
  grid-template-columns: 54px 1fr auto;
  gap: 12px;
  align-items: stretch;
}

.lesson-module-number {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: #e9f0ff;
  color: #1f4fb8;
  font-size: 15px;
  font-weight: 800;
}

.lesson-module-copy h5,
.quiz-preview-card h5,
.topic-video-copy h5 {
  margin: 0 0 6px;
  font-size: 16px;
  color: #1f2937;
}

.lesson-module-copy p,
.quiz-preview-card ul,
.topic-video-copy {
  margin: 0;
  color: #667085;
  font-size: 14px;
  line-height: 1.55;
}

.topic-video-description {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.55;
}

.lesson-module-time {
  font-size: 12px;
  font-weight: 800;
  color: #64748b;
}

.quiz-preview-card ul {
  padding-left: 18px;
}

.quiz-preview-card li {
  margin-bottom: 8px;
}

.details-actions {
  margin-top: 18px;
}

.details-side-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
}

.full-media-panel {
  min-height: 100%;
}

.topic-video-shell {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 100%;
}

.topic-video-hero {
  border: 1px solid #e5eaf2;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(180deg, #fbfdff 0%, #ffffff 100%);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.06);
}

.topic-video-hero-frame {
  position: relative;
  padding-top: 56.25%;
  background: #dbe7f6;
}

.topic-video-hero-frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.topic-video-hero-overlay {
  position: absolute;
  inset: auto 12px 12px 12px;
  display: flex;
  justify-content: flex-start;
  pointer-events: none;
}

.topic-video-play-chip {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.72);
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  backdrop-filter: blur(6px);
}

.topic-video-hero-copy {
  padding: 16px;
}

.topic-video-hero-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.topic-video-runtime {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.topic-video-hero-copy h5 {
  margin: 0 0 8px;
  font-size: 19px;
  color: #1f2937;
}

.topic-video-hero-copy p {
  margin: 0;
  color: #667085;
  font-size: 14px;
  line-height: 1.6;
}

.hero-badge {
  margin-bottom: 0;
}

.topic-video-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.topic-video-stat {
  border: 1px solid #e5eaf2;
  border-radius: 14px;
  padding: 14px;
  background: #fbfdff;
}

.topic-video-stat span {
  display: block;
  margin-bottom: 6px;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.topic-video-stat strong {
  color: #163d7b;
  font-size: 18px;
}

.topic-video-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: minmax(0, 1fr);
  gap: 12px;
  align-content: stretch;
}

.topic-video-card {
  border: 1px solid #e5eaf2;
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  height: 100%;
}

.topic-video-card.compact {
  display: grid;
  grid-template-columns: 190px 1fr;
  align-items: stretch;
  min-height: 156px;
}

.topic-video-card.study-guide-card {
  display: flex;
  align-items: center;
  justify-content: stretch;
  background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
  min-height: 156px;
}

.study-guide-copy {
  width: 100%;
  padding: 18px;
}

.study-guide-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.study-guide-copy h5 {
  margin: 0 0 10px;
  color: #1f2937;
  font-size: 17px;
  line-height: 1.35;
}

.study-guide-list {
  margin: 0;
  padding-left: 18px;
  color: #64748b;
  font-size: 14px;
  line-height: 1.65;
}

.study-guide-list li + li {
  margin-top: 6px;
}
.topic-video-frame {
  position: relative;
  height: 100%;
  background: #dbe7f6;
}

.topic-video-frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.topic-video-frame.compact-frame {
  min-height: 100%;
}

.topic-video-thumb-overlay {
  position: absolute;
  inset: auto 10px 10px 10px;
  display: flex;
  justify-content: flex-start;
  pointer-events: none;
}

.topic-video-thumb-play {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(15, 23, 42, 0.72);
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  backdrop-filter: blur(6px);
}

.topic-video-copy {
  padding: 14px;
}

.topic-video-copy.compact-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}

.topic-video-copy-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.topic-video-mini-tag {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.topic-video-copy h5 {
  margin: 0;
  font-size: 16px;
  color: #1f2937;
}

.lesson-module-copy p,
.quiz-preview-card ul,
.topic-video-copy {
  margin: 0;
  color: #667085;
  font-size: 14px;
  line-height: 1.55;
}

.topic-video-description {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.55;
}

.lesson-module-time {
  font-size: 12px;
  font-weight: 800;
  color: #64748b;
}

.quiz-preview-card ul {
  padding-left: 18px;
}

.quiz-preview-card li {
  margin-bottom: 8px;
}

.details-actions {
  margin-top: 18px;
}

.details-side-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.full-media-panel {
  min-height: 100%;
}

.topic-video-hero {
  border: 1px solid #e5eaf2;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(180deg, #fbfdff 0%, #ffffff 100%);
}

.topic-video-hero-frame {
  position: relative;
  padding-top: 56.25%;
  background: #dbe7f6;
}

.topic-video-hero-frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.topic-video-hero-copy {
  padding: 16px;
}

.topic-video-hero-copy h5 {
  margin: 0 0 8px;
  font-size: 19px;
  color: #1f2937;
}

.topic-video-hero-copy p {
  margin: 0;
  color: #667085;
  font-size: 14px;
  line-height: 1.6;
}

.hero-badge {
  margin-bottom: 10px;
}

.topic-video-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.topic-video-stat {
  border: 1px solid #e5eaf2;
  border-radius: 14px;
  padding: 14px;
  background: #fbfdff;
}

.topic-video-stat span {
  display: block;
  margin-bottom: 6px;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.topic-video-stat strong {
  color: #163d7b;
  font-size: 18px;
}

.topic-video-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.topic-video-card {
  border: 1px solid #e5eaf2;
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
}

.topic-video-card.compact {
  display: grid;
  grid-template-columns: 180px 1fr;
  align-items: stretch;
}

.topic-video-frame {
  position: relative;
  padding-top: 56.25%;
  background: #dbe7f6;
}

.topic-video-frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.topic-video-frame.compact-frame {
  padding-top: 0;
  min-height: 140px;
}

.topic-video-copy {
  padding: 14px;
}

.topic-video-copy.compact-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.topic-video-copy h5 {
  margin: 0 0 6px;
  font-size: 16px;
  color: #1f2937;
}

.side-card-header p {
  margin: 0;
  color: #64748b;
  line-height: 1.55;
  font-size: 14px;
}

.topic-video-card {
  border: 1px solid #e5eaf2;
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
}

.topic-video-frame {
  position: relative;
  padding-top: 56.25%;
  background: #dbe7f6;
}

.topic-video-frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.topic-video-copy {
  padding: 14px;
}

.video-badge {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: #e9f0ff;
  color: #2154d8;
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 10px;
}

.topic-photos-header {
  margin-top: 8px;
}

.topic-photo-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.topic-photo {
  height: 120px;
  border-radius: 14px;
  background-size: cover;
  background-position: center;
}

.highlight-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.highlight-learning-card {
  border: 1px solid #e5eaf2;
  border-radius: 18px;
  background: linear-gradient(180deg, #f9fbff 0%, #ffffff 100%);
  padding: 20px;
}

.highlight-learning-card h3 {
  margin: 0 0 10px;
  font-size: 20px;
  color: #1f2937;
}

.highlight-learning-card p {
  margin: 0;
  color: #64748b;
  line-height: 1.6;
  font-size: 14px;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

.module-card {
  background: #fff;
  border: 1px solid #e5eaf2;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  min-height: 420px;
}

.module-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.module-badge-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.module-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 34px;
  border-radius: 999px;
  background: #eaf1ff;
  color: #1e4fd8;
  font-weight: 800;
  font-size: 14px;
}

.module-level {
  font-size: 12px;
  color: #475569;
  font-weight: 700;
}

.module-duration {
  font-size: 12px;
  color: #6b7280;
  font-weight: 700;
}

.module-meta {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 18px;
  font-size: 13px;
  color: #475569;
  font-weight: 700;
}

.module-tags {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.module-tag {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: #f2f6fc;
  color: #4b5563;
  font-size: 12px;
  font-weight: 700;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.video-card {
  border: 1px solid #e5eaf2;
  border-radius: 18px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
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
  border: none;
}

.video-copy {
  padding: 18px;
}

.video-copy h3 {
  margin: 0 0 8px;
  font-size: 20px;
  color: #1f2937;
}

.video-copy p {
  margin: 0;
  color: #667085;
  font-size: 14px;
  line-height: 1.6;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.photo-card {
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid #e5eaf2;
  background: #fff;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
}

.photo-card-image {
  height: 220px;
  background-size: cover;
  background-position: center;
}

.photo-card-body {
  padding: 18px;
}

.photo-card-tag {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: #eef4ff;
  color: #1e4fd8;
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 10px;
}

.photo-card-body h3 {
  margin: 0 0 8px;
  font-size: 20px;
  color: #1f2937;
}

.photo-card-body p {
  margin: 0;
  color: #667085;
  font-size: 14px;
  line-height: 1.6;
}

.empty-state {
  border: 1px dashed #d5dbe5;
  border-radius: 18px;
  padding: 40px 20px;
  text-align: center;
  background: #fbfcfe;
}

.empty-state h3 {
  margin: 0 0 8px;
  font-size: 22px;
  color: #334155;
}

.empty-state p {
  margin: 0;
  color: #64748b;
}

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

@media (max-width: 1400px) {
  .featured-grid,
  .module-grid,
  .video-grid,
  .photo-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .highlight-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1250px) {
  .details-grid,
  .details-content-grid {
    grid-template-columns: 1fr;
  }

  .topic-video-card.compact {
    grid-template-columns: 1fr;
  }

  .topic-video-frame.compact-frame {
    padding-top: 56.25%;
    min-height: 0;
  }

  .details-head {
    flex-direction: column;
  }

  .details-meta-boxes {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    display: grid;
  }
}

@media (max-width: 1150px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }

  .module-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

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

  .featured-grid,
  .video-grid,
  .photo-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .main-content {
    width: min(100%, calc(100vw - 20px));
    padding: 16px 0 28px;
  }

  .hero-grid,
  .featured-section,
  .details-section,
  .highlights-section,
  .catalog-section,
  .supplemental-media-section,
  .photo-learning-section {
    padding: 18px;
  }

  .featured-grid,
  .module-grid {
    grid-template-columns: 1fr;
  }

  .catalog-head,
  .section-title-row {
    flex-direction: column;
    align-items: stretch;
  }

  .category-select {
    width: 100%;
  }

  .brand-text {
    font-size: 18px;
  }

  .user-menu-trigger {
    width: 100%;
    justify-content: center;
  }

  .user-id {
    font-size: 10px;
  }

  .hero h1 {
    font-size: 32px;
  }

  .search-box {
    min-height: 54px;
  }

  .search-input {
    height: 52px;
    font-size: 15px;
  }

  .details-head h3 {
    font-size: 24px;
  }

  .section-title-row h2,
  .catalog-head h2 {
    font-size: 24px;
  }

  .lesson-module-card {
    grid-template-columns: 1fr;
  }

  .topic-photo-grid {
    grid-template-columns: 1fr 1fr;
  }

  .logout-modal-card {
    padding: 20px;
    border-radius: 20px;
  }

  .logout-modal-actions {
    flex-direction: column;
  }
}
</style>
