<template>
  <div class="page">
    <header class="topbar">
      <div class="topbar-left">
        <img class="brand-logo" :src="logo" alt="LTO Logo" />
        <span class="brand-text">LTMS PORTAL</span>
      </div>

      <nav class="topbar-nav">
        <a href="#" class="nav-item">LTO OFFICIAL WEBPAGE</a>
        <a href="#" class="nav-item">E-LEARNING</a>
        <a href="#" class="nav-item">CONTACT</a>
        <a href="#" class="nav-item" @click.prevent="goToDashboard"
          >DASHBOARD</a
        >
      </nav>

      <div class="user-badge">HIDALGO - 26-050525-2424960</div>
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
              learning journey with a Coursera-inspired experience.
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
                @click="searchQuery = tag"
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
              <button
                type="button"
                class="featured-btn"
                @click="openLesson(item.id)"
              >
                {{ isCompleted(item.id) ? "Review Lesson" : "Start Learning" }}
              </button>
            </div>
          </article>
        </div>
      </section>

      <section class="catalog-section">
        <div class="catalog-head">
          <div>
            <h2>Learning Catalog</h2>
            <p>
              {{ filteredModules.length }} course<span
                v-if="filteredModules.length !== 1"
                >s</span
              >
              found
            </p>
          </div>

          <div class="catalog-tools">
            <select v-model="selectedCategory" class="category-select">
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

            <button
              type="button"
              class="module-btn"
              @click="openLesson(module.id)"
            >
              {{ isCompleted(module.id) ? "Review Lesson" : "Open Lesson" }}
            </button>
          </article>
        </div>

        <div v-else class="empty-state">
          <h3>No lessons found</h3>
          <p>Try another keyword or choose a different category.</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import logo from "../assets/logo.png";

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
};

const COMPLETED_KEY = "ltms_completed_lessons";

const router = useRouter();
const searchQuery = ref("");
const selectedCategory = ref("ALL");
const completedLessons = ref<number[]>([]);

const loadCompletedLessons = () => {
  const saved = localStorage.getItem(COMPLETED_KEY);
  completedLessons.value = saved ? JSON.parse(saved) : [];
};

onMounted(() => {
  loadCompletedLessons();
  window.addEventListener("storage", loadCompletedLessons);
  window.addEventListener(
    "ltms-progress-updated",
    loadCompletedLessons as EventListener,
  );
});

const openLesson = (id: number) => {
  router.push(`/e-learning/${id}`);
};

const goToDashboard = () => {
  router.push("/home");
};

const isCompleted = (id: number) => completedLessons.value.includes(id);

const completedCount = computed(() => completedLessons.value.length);

const modules = ref<ModuleItem[]>([
  {
    id: 1,
    code: "I",
    title: "Licensing Information",
    description:
      "Learn the overview of licensing, classifications, qualifications, requirements, processing flow, and fees before starting your application.",
    category: "Licensing",
    duration: "20 min",
    lessons: 6,
    level: "Beginner",
    featured: true,
    keywords: [
      "license",
      "licensing",
      "classification",
      "fees",
      "requirements",
    ],
  },
  {
    id: 2,
    code: "II",
    title: "Getting Ready to Drive",
    description:
      "Build the right habits before driving, including personal readiness, vehicle checks, and safe preparation before entering the road.",
    category: "Driving Basics",
    duration: "18 min",
    lessons: 4,
    level: "Beginner",
    featured: true,
    keywords: ["ready", "drive", "preparation", "safety", "vehicle check"],
  },
  {
    id: 3,
    code: "III",
    title: "Driving Fundamentals",
    description:
      "Study the foundations of driving, from controls and steering to braking, awareness, and safe movement in traffic.",
    category: "Driving Basics",
    duration: "24 min",
    lessons: 7,
    level: "Beginner",
    featured: true,
    keywords: ["fundamentals", "steering", "controls", "driving"],
  },
  {
    id: 4,
    code: "IV",
    title: "Road Courtesy and Safety",
    description:
      "Understand respectful road behavior, lane discipline, defensive driving, and practical safety principles.",
    category: "Road Safety",
    duration: "22 min",
    lessons: 5,
    level: "Intermediate",
    featured: true,
    keywords: ["road", "courtesy", "safety", "defensive", "discipline"],
  },
  {
    id: 5,
    code: "V",
    title: "Rights, Duties and Responsibilities of Drivers",
    description:
      "Explore the responsibilities of being a licensed driver, including lawful behavior and public accountability.",
    category: "Driver Responsibility",
    duration: "16 min",
    lessons: 4,
    level: "Beginner",
    keywords: ["rights", "duties", "responsibilities", "drivers", "law"],
  },
  {
    id: 6,
    code: "VI",
    title: "Motor Vehicle Registration",
    description:
      "Review vehicle registration procedures, documents, compliance reminders, and record management essentials.",
    category: "Vehicle",
    duration: "19 min",
    lessons: 5,
    level: "Intermediate",
    keywords: ["motor vehicle", "registration", "vehicle", "records"],
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
  },
]);

const quickTags = [
  "Licensing",
  "Road Safety",
  "Registration",
  "Renewal",
  "Law",
];

const categories = computed(() => {
  return [...new Set(modules.value.map((item) => item.category))];
});

const featuredModules = computed(() => {
  return modules.value.filter((item) => item.featured).slice(0, 4);
});

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
      ...module.keywords,
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

.brand-logo {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  background: #fff;
}

.brand-text {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.3px;
}

.topbar-nav {
  display: flex;
  align-items: center;
  gap: 22px;
}

.nav-item {
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
}

.user-badge {
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
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
.catalog-section {
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
  min-height: 250px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
}

.featured-card.done,
.module-card.done {
  border-color: #b7e1c5;
  box-shadow: 0 8px 18px rgba(34, 197, 94, 0.08);
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

.featured-card h3 {
  margin: 16px 0 10px;
  font-size: 22px;
  line-height: 1.18;
  color: #1f2937;
}

.featured-card p {
  margin: 0;
  color: #667085;
  font-size: 14px;
  line-height: 1.55;
  flex: 1;
}

.featured-footer {
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
  color: #475569;
  font-weight: 700;
}

.featured-btn {
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
  min-height: 305px;
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

.module-card h3 {
  margin: 16px 0 10px;
  font-size: 21px;
  line-height: 1.2;
  color: #1f2937;
}

.module-desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: #667085;
  flex: 1;
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

.module-btn {
  margin-top: 16px;
  height: 42px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(180deg, #1f5fb7 0%, #154b96 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
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

@media (max-width: 1400px) {
  .featured-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .module-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
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
}

@media (max-width: 760px) {
  .main-content {
    width: min(100%, calc(100vw - 20px));
    padding: 16px 0 28px;
  }

  .hero-grid,
  .featured-section,
  .catalog-section {
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

  .user-badge {
    font-size: 12px;
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
}
</style>
