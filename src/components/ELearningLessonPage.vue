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
        <span class="page-loading-text">Loading content...</span>
      </div>
    </div>
    <header class="topbar">
      <div class="topbar-left">
        <button class="brand-wrap" @click="goBackToCatalog">
          <img class="brand-logo" :src="logo" alt="LTO Logo" />
          <div class="brand-copy">
            <span class="brand-kicker">LTMS PORTAL</span>
            <span class="brand-text">E-LEARNING</span>
          </div>
        </button>
      </div>

      <nav class="topbar-nav">
        <a href="#" class="nav-item active" @click.prevent="goBackToCatalog">
          E-LEARNING
        </a>
        <a href="#" class="nav-item">CONTACT</a>
        <a href="#" class="nav-item" @click.prevent="goToDashboard">
          DASHBOARD
        </a>
      </nav>

      <div class="user-badge">HIDALGO - 26-050525-2424960</div>
    </header>

    <main class="main-content" v-if="lesson">
      <section class="lesson-hero">
        <div class="lesson-hero-left">
          <button class="back-btn" @click="goBackToCatalog">
            ← Back to Catalog
          </button>

          <div class="hero-pill-row">
            <span class="lesson-pill">{{ lesson.category }}</span>
            <span class="lesson-pill light">{{ lesson.code }}</span>
            <span class="lesson-pill light">{{ lesson.level }}</span>
          </div>

          <h1>{{ lesson.title }}</h1>
          <p class="lesson-summary">{{ lesson.description }}</p>

          <div class="lesson-meta">
            <span>{{ lesson.duration }}</span>
            <span>{{ lesson.lessons.length }} topics</span>
            <span>{{ lesson.videos.length }} videos</span>
            <span>{{ lesson.quiz.length }} quiz items</span>
          </div>
        </div>

        <div class="lesson-hero-right">
          <div
            class="hero-image"
            :style="{
              backgroundImage: `linear-gradient(rgba(8,44,102,0.18), rgba(8,44,102,0.46)), url(${lesson.heroImage})`,
            }"
          ></div>

          <div class="progress-card">
            <span class="progress-label">Learning Path</span>
            <strong>{{ lesson.code }}</strong>
            <p>{{ lesson.tagline }}</p>

            <div class="hero-progress-bar">
              <div
                :style="{ width: completed ? '100%' : moduleProgressWidth }"
              ></div>
            </div>
            <div class="hero-progress-caption">
              {{ completedTopicCount }}/{{ lesson.lessons.length }} topics
              completed
            </div>

            <div class="course-status-wrap">
              <span
                class="course-status-badge"
                :class="{ completed: completed }"
              >
                {{ completed ? "Completed" : "In Progress" }}
              </span>

              <p v-if="!passedQuiz" class="complete-warning">
                Pass the quiz with at least 80% before this course can be marked
                as complete.
              </p>

              <button
                class="complete-btn"
                :class="{
                  completed: completed,
                  locked: !passedQuiz && !completed,
                }"
                :disabled="!passedQuiz && !completed"
                @click="toggleComplete"
              >
                {{
                  completed
                    ? "Completed ✓"
                    : passedQuiz
                      ? "Mark as Complete"
                      : "Pass Quiz First"
                }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="lesson-layout">
        <aside class="lesson-sidebar">
          <div class="sidebar-card sticky-card">
            <div class="sidebar-heading">
              <h3>Course Navigation</h3>
              <p>
                Select a topic to view its lesson content and supporting
                discussion.
              </p>
            </div>

            <div class="module-progress-panel">
              <div class="module-progress-head">
                <strong>Progress across topics</strong>
                <span>{{ moduleProgressPercent }}%</span>
              </div>
              <div class="module-progress-bar">
                <div :style="{ width: `${moduleProgressPercent}%` }"></div>
              </div>
            </div>

            <div class="topic-list">
              <button
                v-for="(chapter, index) in lesson.lessons"
                :key="chapter.title"
                class="topic-nav-item"
                type="button"
                :disabled="isPageLoading"
                :class="{ active: !quizView && selectedTopicIndex === index }"
                @click="selectTopic(index)"
              >
                <div class="topic-nav-number">{{ chapter.number }}</div>

                <div class="topic-nav-copy">
                  <div class="topic-nav-title-row">
                    <strong>{{ chapter.title }}</strong>
                    <span class="topic-status-icon" aria-hidden="true">
                      <span
                        v-if="isTopicCompleted(index)"
                        class="topic-status-check"
                        >✓</span
                      >
                      <span v-else class="topic-status-circle"></span>
                    </span>
                  </div>
                  <span>{{ chapter.description }}</span>
                </div>
              </button>
            </div>

            <div class="nav-final-step">
              <div class="nav-final-step-label">Last Step</div>
              <button
                class="topic-nav-item final-quiz-nav"
                type="button"
                :disabled="isPageLoading"
                :class="{ active: quizView }"
                @click="goToQuizSection"
              >
                <div class="topic-nav-number final">QZ</div>

                <div class="topic-nav-copy">
                  <div class="final-quiz-title-row">
                    <strong>Final Quiz Assessment</strong>
                    <span class="final-quiz-icon" aria-hidden="true">
                      <span v-if="quizCompleted" class="icon-check">✓</span>
                      <span v-else class="icon-circle"></span>
                    </span>
                  </div>
                  <span
                    >Take the formal graded quiz after finishing all learning
                    topics.</span
                  >
                </div>
              </button>
            </div>
          </div>

          <div class="sidebar-card">
            <h3>Recommended Next Step</h3>
            <p>{{ lesson.nextStep }}</p>
            <button class="primary-btn" @click="goBackToCatalog">
              Browse More Courses
            </button>
          </div>
        </aside>

        <div ref="lessonMainRef" class="lesson-main">
          <div
            ref="courseOverviewRef"
            class="section-card course-overview-card"
            v-if="!quizView"
          >
            <div class="section-head-row">
              <div>
                <span class="section-eyebrow">Course overview</span>
                <h2>About this course</h2>
                <p class="section-subtext">
                  Course context, learning outcomes, and topic flow.
                </p>
              </div>
            </div>

            <p class="about-copy">{{ lesson.about }}</p>

            <div class="overview-grid">
              <div class="overview-stat">
                <span>Level</span>
                <strong>{{ lesson.level }}</strong>
              </div>
              <div class="overview-stat">
                <span>Duration</span>
                <strong>{{ lesson.duration }}</strong>
              </div>
              <div class="overview-stat">
                <span>Videos</span>
                <strong>{{ lesson.videos.length }}</strong>
              </div>
              <div class="overview-stat">
                <span>Assessment</span>
                <strong>Quiz</strong>
              </div>
            </div>

            <div class="outcomes-block">
              <h3>What you will learn</h3>
              <ul class="learning-list coursera-learning-list">
                <li v-for="item in lesson.outcomes" :key="item">
                  <span class="learning-check">✓</span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div
            class="section-card topic-focus-card"
            v-if="currentTopic && !quizView"
          >
            <div class="topic-stage-badge">
              Step {{ selectedTopicIndex + 1 }} of {{ lesson.lessons.length }}
            </div>
            <div class="topic-focus-head">
              <div>
                <span class="section-eyebrow">Current topic</span>
                <h2>{{ currentTopic.title }}</h2>
                <p class="section-subtext">{{ currentTopic.description }}</p>
              </div>

              <div class="topic-time-badge">{{ currentTopic.time }}</div>
            </div>

            <div class="topic-content-card">
              <div class="topic-content-label">Lesson content</div>
              <p class="topic-main-text">{{ currentTopic.content }}</p>
              <p class="topic-discussion-text">{{ currentTopic.discussion }}</p>

              <div class="topic-detail-grid">
                <div class="topic-detail-section">
                  <h4>Key Discussion Points</h4>
                  <ul class="topic-detail-list">
                    <li v-for="item in currentTopic.details" :key="item">
                      {{ item }}
                    </li>
                  </ul>
                </div>

                <div class="topic-detail-section">
                  <h4>Examples</h4>
                  <ul class="topic-detail-list">
                    <li v-for="item in currentTopic.examples" :key="item">
                      {{ item }}
                    </li>
                  </ul>
                </div>

                <div class="topic-detail-section">
                  <h4>Learner Reminders</h4>
                  <ul class="topic-detail-list">
                    <li v-for="item in currentTopic.tips" :key="item">
                      {{ item }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="topic-pagination">
              <button
                class="secondary-btn"
                @click="selectTopic(Math.max(0, selectedTopicIndex - 1))"
                :disabled="selectedTopicIndex === 0 || isPageLoading"
              >
                Previous Topic
              </button>

              <button
                class="secondary-btn topic-complete-btn"
                :disabled="isPageLoading"
                :class="{ completed: isTopicCompleted(selectedTopicIndex) }"
                @click="markTopicComplete(selectedTopicIndex)"
              >
                {{
                  isTopicCompleted(selectedTopicIndex)
                    ? "Topic Completed ✓"
                    : "Mark Topic Complete"
                }}
              </button>

              <button
                class="primary-btn topic-next-btn"
                @click="
                  selectTopic(
                    Math.min(lesson.lessons.length - 1, selectedTopicIndex + 1),
                  )
                "
                :disabled="
                  selectedTopicIndex === lesson.lessons.length - 1 ||
                  isPageLoading
                "
              >
                Next Topic
              </button>
            </div>
          </div>

          <div class="section-card" v-if="!quizView">
            <div class="section-head-row">
              <div>
                <span class="section-eyebrow">Lecture resources</span>
                <h2>Supplemental Videos</h2>
                <p class="section-subtext">
                  Topic-specific videos for explanation and review.
                </p>
              </div>
            </div>

            <div class="video-grid">
              <article
                v-for="video in lesson.videos"
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
          </div>

          <div
            v-if="completed && quizView"
            class="section-card certificate-card"
          >
            <div class="certificate-header-row">
              <div>
                <span class="certificate-badge">Certificate</span>
                <h2>Course completion certificate</h2>
                <p class="certificate-copy">
                  This certificate records successful completion of
                  <strong>{{ lesson.title }}</strong> and a passing result on
                  the final graded assessment.
                </p>
              </div>

              <div class="certificate-status-pill">Officially Verified</div>
            </div>

            <div class="certificate-sheet">
              <div class="certificate-watermark">
                <img :src="logo" alt="LTO Transparent Seal" />
              </div>

              <div class="certificate-topline">
                <div class="certificate-brand-marks">
                  <div class="certificate-logo-chip primary">
                    <img :src="logo" alt="LTO Logo" />
                    <span>Land Transportation Office</span>
                  </div>
                </div>

                <div class="certificate-org-copy">
                  <span class="certificate-org-kicker"
                    >Republic of the Philippines · Land Transportation
                    Office</span
                  >
                  <strong>Official Certificate of Completion</strong>
                  <small
                    >Issued upon successful topic completion and passing of the
                    final graded assessment</small
                  >
                </div>
              </div>

              <div class="certificate-body">
                <span class="certificate-awarded-label"
                  >This certifies that</span
                >
                <h3>Charls Benedict Hidalgo</h3>
                <p class="certificate-awarded-copy">
                  has successfully completed the course
                </p>
                <h4>{{ lesson.title }}</h4>
                <p class="certificate-description">
                  and demonstrated satisfactory performance by completing all
                  required learning topics and passing the final graded
                  assessment with a final score of
                  <strong>{{ latestScoreDisplay }}</strong
                  >.
                </p>
              </div>

              <div class="certificate-footer-grid">
                <div class="certificate-meta-card">
                  <span>Module</span>
                  <strong>{{ lesson.code }}</strong>
                </div>
                <div class="certificate-meta-card">
                  <span>Issue Date</span>
                  <strong>{{ certificateIssueDate }}</strong>
                </div>
                <div class="certificate-meta-card">
                  <span>Reference No.</span>
                  <strong>{{ certificateReference }}</strong>
                </div>
              </div>

              <div class="certificate-signatures">
                <div class="certificate-signature-block">
                  <div class="signature-line"></div>
                  <strong>LTMS Learning Division</strong>
                  <span>Certification Authority</span>
                </div>

                <div class="certificate-signature-block">
                  <div class="signature-line"></div>
                  <strong>Assessment Validation Office</strong>
                  <span>Government Learning Verification</span>
                </div>
              </div>
            </div>
          </div>

          <div class="section-card" id="quiz-section" v-if="quizView">
            <div class="section-head-row">
              <div>
                <span class="section-eyebrow">Graded assessment</span>
                <h2>Final Quiz Assessment</h2>
                <p class="section-subtext">
                  This is the final graded assessment for the course. Passing
                  score is 80%, and unlimited attempts are allowed.
                </p>
              </div>
            </div>

            <div class="quiz-summary-card">
              <div class="quiz-summary-row">
                <div>
                  <span class="quiz-summary-label">Required to pass</span>
                  <strong>80%</strong>
                </div>
                <div>
                  <span class="quiz-summary-label">Items</span>
                  <strong>{{ lesson.quiz.length }}</strong>
                </div>
                <div>
                  <span class="quiz-summary-label">Attempts</span>
                  <strong>Unlimited</strong>
                </div>
                <div>
                  <span class="quiz-summary-label">Latest Score</span>
                  <strong>{{ latestScoreDisplay }}</strong>
                </div>
              </div>

              <div class="progress-bar">
                <div :style="{ width: `${score}%` }"></div>
              </div>

              <div class="quiz-intro-card" v-if="!quizStarted && !quizFinished">
                <h3>Ready to take the final quiz?</h3>
                <p>
                  Complete this assessment after studying all topics in the
                  course. Your course can only be marked complete after you pass
                  this quiz.
                </p>
                <button class="primary-btn attempt-btn" @click="startQuiz">
                  Attempt Quiz
                </button>
              </div>

              <div
                v-if="quizFinished"
                class="quiz-result-banner"
                :class="{ pass: passedQuiz, fail: !passedQuiz }"
              >
                <strong v-if="passedQuiz"
                  >Congratulations — you passed the final quiz!</strong
                >
                <strong v-else>Not yet passed — {{ score }}%</strong>
                <span>
                  {{
                    passedQuiz
                      ? "Your result has been saved. This final assessment is complete, and you can use Review Answers any time."
                      : "Review the lesson topics, then try the final quiz again until you reach 80%."
                  }}
                </span>
              </div>

              <div v-if="quizCompleted" class="quiz-complete-card">
                <div class="quiz-complete-icon">✓</div>
                <div class="quiz-complete-copy">
                  <h3>Assessment completed</h3>
                  <p>
                    Final score: <strong>{{ score }}%</strong>. You have
                    finished the graded assessment for this course. Your
                    completion has been saved for a more Coursera-like sense of
                    accomplishment.
                  </p>
                </div>
              </div>
            </div>

            <div v-if="quizStarted || reviewMode" class="quiz-list">
              <article
                v-for="(question, index) in lesson.quiz"
                :key="question.question"
                class="quiz-card"
              >
                <div class="quiz-number">Q{{ index + 1 }}</div>

                <div class="quiz-body">
                  <h3>{{ question.question }}</h3>

                  <div class="choices-list">
                    <label
                      v-for="choice in question.choices"
                      :key="choice"
                      class="choice-item"
                      :class="getChoiceClass(index, choice)"
                    >
                      <input
                        type="radio"
                        :name="`q-${index}`"
                        :value="choice"
                        v-model="answers[index]"
                        :disabled="quizFinished && passedQuiz"
                      />
                      <span>{{ choice }}</span>
                    </label>
                  </div>
                </div>
              </article>
            </div>

            <div class="quiz-actions" v-if="quizStarted || quizFinished">
              <button
                v-if="quizStarted && !quizFinished"
                class="primary-btn"
                @click="submitQuiz"
              >
                Submit Quiz
              </button>

              <template v-else-if="quizFinished">
                <button
                  v-if="!passedQuiz"
                  class="primary-btn"
                  @click="retryQuiz"
                >
                  Retry Quiz
                </button>

                <button
                  v-if="passedQuiz"
                  class="secondary-btn"
                  @click="reviewAnswers"
                >
                  Review Answers
                </button>
              </template>
            </div>
          </div>
        </div>
      </section>
    </main>

    <main v-else class="main-content">
      <div class="not-found-card">
        <h2>Lesson not found</h2>
        <p>The learning module you selected does not exist.</p>
        <button class="primary-btn" @click="goBackToCatalog">
          Back to Catalog
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import logo from "../assets/logo.png";

type Chapter = {
  number: string;
  title: string;
  description: string;
  time: string;
  content: string;
  discussion: string;
  details: string[];
  examples: string[];
  tips: string[];
};

type VideoItem = {
  title: string;
  url: string;
  label: string;
  description: string;
};

type QuizItem = {
  question: string;
  choices: string[];
  correct: string;
};

type LessonCourse = {
  id: number;
  code: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: string;
  tagline: string;
  about: string;
  outcomes: string[];
  nextStep: string;
  heroImage: string;
  lessons: Chapter[];
  videos: VideoItem[];
  quiz: QuizItem[];
};

const COMPLETED_KEY = "ltms_completed_lessons";
const QUIZ_RESULTS_KEY = "ltms_quiz_results";
const TOPIC_PROGRESS_KEY = "ltms_topic_progress";

const router = useRouter();
const route = useRoute();
const completed = ref(false);

const activeTab = ref<"about" | "learn" | "modules" | "videos" | "quiz">(
  "about",
);

const openChapter = ref<number | null>(0);
const selectedTopicIndex = ref(0);
const quizView = ref(false);
const isPageLoading = ref(false);
const lessonMainRef = ref<HTMLElement | null>(null);
const courseOverviewRef = ref<HTMLElement | null>(null);

const answers = ref<string[]>([]);
const quizStarted = ref(false);
const quizFinished = ref(false);
const reviewMode = ref(false);
const score = ref(0);
const topicProgressMap = ref<Record<string, number[]>>({});

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

const licensingQuiz: QuizItem[] = [
  {
    question: "Why does driver licensing exist?",
    choices: [
      "To ensure legal and safety standards are met",
      "To replace traffic signs",
      "To avoid vehicle registration",
      "To remove all document checks",
    ],
    correct: "To ensure legal and safety standards are met",
  },
  {
    question: "Which is commonly reviewed before application?",
    choices: [
      "Eligibility and supporting requirements",
      "Restaurant menus",
      "Movie schedules",
      "Shopping trends",
    ],
    correct: "Eligibility and supporting requirements",
  },
  {
    question: "Which is an example of an eligibility factor?",
    choices: [
      "Age and identity verification",
      "Favorite car color",
      "Preferred fuel brand",
      "Radio volume preference",
    ],
    correct: "Age and identity verification",
  },
  {
    question: "Why are supporting documents important?",
    choices: [
      "They help verify qualifications",
      "They replace practical driving",
      "They remove all fees",
      "They skip evaluation",
    ],
    correct: "They help verify qualifications",
  },
  {
    question: "What should applicants review before paying fees?",
    choices: [
      "The process flow and requirements",
      "Music playlists",
      "Wheel designs",
      "Parking decorations",
    ],
    correct: "The process flow and requirements",
  },
  {
    question: "What is the role of portal registration in processing?",
    choices: [
      "It begins the digital application journey",
      "It changes the license class automatically",
      "It removes identity checks",
      "It replaces learning modules",
    ],
    correct: "It begins the digital application journey",
  },
  {
    question: "What does a licensing process help promote?",
    choices: [
      "Public safety",
      "Unlimited road access without rules",
      "Automatic approval",
      "No-document transactions",
    ],
    correct: "Public safety",
  },
  {
    question: "What should be prepared before evaluation?",
    choices: [
      "Complete and valid requirements",
      "A vehicle repaint",
      "A new plate design",
      "Travel accessories",
    ],
    correct: "Complete and valid requirements",
  },
  {
    question: "Which topic belongs to Licensing Information?",
    choices: [
      "License classifications",
      "Home decoration",
      "Entertainment subscriptions",
      "Restaurant booking",
    ],
    correct: "License classifications",
  },
  {
    question: "Why should applicants understand fees and steps early?",
    choices: [
      "To reduce confusion during application",
      "To skip legal requirements",
      "To replace training",
      "To remove identity review",
    ],
    correct: "To reduce confusion during application",
  },
];

const gettingReadyQuiz: QuizItem[] = [
  {
    question: "What should be checked before driving?",
    choices: [
      "Vehicle condition and personal readiness",
      "Only the radio volume",
      "Only the paint color",
      "Only the music playlist",
    ],
    correct: "Vehicle condition and personal readiness",
  },
  {
    question: "Why is mirror adjustment important?",
    choices: [
      "It improves visibility and awareness",
      "It changes the vehicle class",
      "It replaces registration",
      "It reduces penalties automatically",
    ],
    correct: "It improves visibility and awareness",
  },
  {
    question: "A safe trip begins with what?",
    choices: [
      "The driver's condition",
      "A louder horn",
      "A new seat cover",
      "A full music library",
    ],
    correct: "The driver's condition",
  },
  {
    question: "Which is part of a basic vehicle check?",
    choices: [
      "Tires, brakes, and lights",
      "Window tint design",
      "Phone wallpaper",
      "Steering wheel cover color",
    ],
    correct: "Tires, brakes, and lights",
  },
  {
    question: "Why is visibility important before moving?",
    choices: [
      "It helps reduce sudden conflicts",
      "It increases top speed",
      "It changes registration records",
      "It removes road rules",
    ],
    correct: "It helps reduce sudden conflicts",
  },
  {
    question: "What should a driver observe before entering the road?",
    choices: [
      "Surroundings and nearby hazards",
      "Only dashboard brightness",
      "Only seat fabric",
      "Only engine sound",
    ],
    correct: "Surroundings and nearby hazards",
  },
  {
    question: "Proper seat adjustment helps with:",
    choices: [
      "Control and comfort",
      "Changing the vehicle category",
      "Waiving traffic rules",
      "Reducing plate number requirements",
    ],
    correct: "Control and comfort",
  },
  {
    question: "Which of the following can affect decisions before driving?",
    choices: [
      "Fatigue and distraction",
      "Favorite snack brand",
      "Car perfume scent",
      "Mirror shape preference",
    ],
    correct: "Fatigue and distraction",
  },
  {
    question: "Why are pre-driving checks useful?",
    choices: [
      "They help prevent avoidable problems",
      "They make the car look newer",
      "They replace licensing",
      "They avoid all future penalties",
    ],
    correct: "They help prevent avoidable problems",
  },
  {
    question: "What is part of road entry awareness?",
    choices: [
      "Checking pedestrians and nearby vehicles",
      "Changing music volume",
      "Adjusting the plate number",
      "Turning off all mirrors",
    ],
    correct: "Checking pedestrians and nearby vehicles",
  },
];

const fundamentalsQuiz: QuizItem[] = [
  {
    question: "Which is a core driving fundamental?",
    choices: [
      "Steering and braking control",
      "Changing wallpaper",
      "Online shopping",
      "Changing plate size",
    ],
    correct: "Steering and braking control",
  },
  {
    question: "Why is awareness important while driving?",
    choices: [
      "It helps recognize hazards and react safely",
      "It makes the car faster",
      "It removes legal duties",
      "It replaces licensing",
    ],
    correct: "It helps recognize hazards and react safely",
  },
  {
    question: "What should drivers know before moving a vehicle?",
    choices: [
      "Basic controls and indicators",
      "Only tire brand names",
      "Only seat height",
      "Only sound system settings",
    ],
    correct: "Basic controls and indicators",
  },
  {
    question: "Good steering technique supports:",
    choices: [
      "Safer lane control",
      "Skipping traffic rules",
      "Automatic approval",
      "No-brake driving",
    ],
    correct: "Safer lane control",
  },
  {
    question: "Why maintain safe following distance?",
    choices: [
      "To support safer braking and reaction time",
      "To improve music quality",
      "To change registration type",
      "To avoid all inspections",
    ],
    correct: "To support safer braking and reaction time",
  },
  {
    question: "What helps when merging or turning?",
    choices: [
      "Signaling intentions early",
      "Ignoring other road users",
      "Driving faster than others",
      "Turning without observation",
    ],
    correct: "Signaling intentions early",
  },
  {
    question: "Which belongs to basic vehicle control?",
    choices: [
      "Pedals and gear positions",
      "Phone case color",
      "Dashboard sticker style",
      "Car perfume choice",
    ],
    correct: "Pedals and gear positions",
  },
  {
    question: "Speed should be adjusted according to:",
    choices: [
      "Road and traffic conditions",
      "Only the driver's mood",
      "The paint quality",
      "The weather app icon",
    ],
    correct: "Road and traffic conditions",
  },
  {
    question: "A driver must observe road users:",
    choices: [
      "Continuously",
      "Only when stopped",
      "Only at night",
      "Only after turning",
    ],
    correct: "Continuously",
  },
  {
    question: "What supports safer starts and stops?",
    choices: [
      "Smooth control and awareness",
      "Sudden hard movement",
      "Ignoring surroundings",
      "Removing mirror checks",
    ],
    correct: "Smooth control and awareness",
  },
];

const roadSafetyQuiz: QuizItem[] = [
  {
    question: "What is a defensive driving principle?",
    choices: [
      "Anticipating possible hazards",
      "Ignoring road signs",
      "Speeding through turns",
      "Blocking intersections",
    ],
    correct: "Anticipating possible hazards",
  },
  {
    question: "Road courtesy helps improve:",
    choices: [
      "Safety and shared road discipline",
      "Only fuel consumption",
      "Paint quality",
      "Music volume",
    ],
    correct: "Safety and shared road discipline",
  },
  {
    question: "Road courtesy includes:",
    choices: [
      "Respecting pedestrians and lane discipline",
      "Aggressive overtaking",
      "Blocking crossings",
      "Ignoring blind spots",
    ],
    correct: "Respecting pedestrians and lane discipline",
  },
  {
    question: "Defensive driving means:",
    choices: [
      "Leaving room for mistakes by others",
      "Driving emotionally",
      "Taking every risk quickly",
      "Always choosing speed first",
    ],
    correct: "Leaving room for mistakes by others",
  },
  {
    question: "A driver should identify:",
    choices: [
      "Blind spots and sudden road changes",
      "Only seat color",
      "Only dashboard shapes",
      "Only wheel covers",
    ],
    correct: "Blind spots and sudden road changes",
  },
  {
    question: "When uncertain on the road, the driver should:",
    choices: [
      "Choose the safer decision",
      "Rush to finish the turn",
      "Ignore the situation",
      "Speed up immediately",
    ],
    correct: "Choose the safer decision",
  },
  {
    question: "Hazard awareness helps reduce:",
    choices: [
      "Accident potential",
      "Mirror use",
      "Vehicle documents",
      "Traffic lights",
    ],
    correct: "Accident potential",
  },
  {
    question: "Good road behavior requires:",
    choices: [
      "Patience and discipline",
      "Aggression and hurry",
      "Ignoring lane rules",
      "Constant overtaking",
    ],
    correct: "Patience and discipline",
  },
  {
    question: "Why follow lane discipline?",
    choices: [
      "To support order and safety",
      "To avoid all documents",
      "To increase horn volume",
      "To replace licensing rules",
    ],
    correct: "To support order and safety",
  },
  {
    question: "Who benefits from responsible road sharing?",
    choices: [
      "All road users",
      "Only one driver",
      "Only vehicle owners",
      "Only traffic officers",
    ],
    correct: "All road users",
  },
];

const responsibilityQuiz: QuizItem[] = [
  {
    question: "A driver should be accountable to:",
    choices: [
      "Other road users and the law",
      "Only passengers they know",
      "Only private parking staff",
      "Only fuel attendants",
    ],
    correct: "Other road users and the law",
  },
  {
    question: "A driver's license is:",
    choices: [
      "A privilege with responsibility",
      "A permanent right without rules",
      "A replacement for registration",
      "A way to ignore road laws",
    ],
    correct: "A privilege with responsibility",
  },
  {
    question: "Drivers are expected to:",
    choices: [
      "Stay alert and obey signals",
      "Ignore warning signs",
      "Use unsafe shortcuts",
      "Drive emotionally",
    ],
    correct: "Stay alert and obey signals",
  },
  {
    question: "Public responsibility means:",
    choices: [
      "Driving decisions affect others",
      "Road use affects only the driver",
      "Passengers have all responsibility",
      "Law applies only during tests",
    ],
    correct: "Driving decisions affect others",
  },
  {
    question: "Negligent driving may lead to:",
    choices: [
      "Injury and legal penalties",
      "Automatic approval",
      "Free renewal",
      "No consequences",
    ],
    correct: "Injury and legal penalties",
  },
  {
    question: "Lawful conduct is important because it:",
    choices: [
      "Supports safety and order",
      "Removes all fees",
      "Changes vehicle class",
      "Avoids every requirement",
    ],
    correct: "Supports safety and order",
  },
  {
    question: "Drivers must keep documents:",
    choices: [
      "Valid and updated",
      "Hidden and outdated",
      "Optional at all times",
      "Only during weekends",
    ],
    correct: "Valid and updated",
  },
  {
    question: "Responsible driving helps:",
    choices: [
      "Protect the public",
      "Skip all regulations",
      "Ignore signals safely",
      "Avoid all inspections",
    ],
    correct: "Protect the public",
  },
  {
    question: "What comes with operating a vehicle?",
    choices: [
      "Continuous duty to follow rules",
      "Freedom from accountability",
      "No need for awareness",
      "No effect on others",
    ],
    correct: "Continuous duty to follow rules",
  },
  {
    question: "Why should drivers avoid unsafe actions?",
    choices: [
      "To prevent danger to others",
      "To change the vehicle type",
      "To remove traffic lights",
      "To skip penalties permanently",
    ],
    correct: "To prevent danger to others",
  },
];

const registrationQuiz: QuizItem[] = [
  {
    question: "Why is vehicle registration important?",
    choices: [
      "It creates a lawful and official road-use record",
      "It replaces a driver's license",
      "It removes penalties",
      "It changes the engine size",
    ],
    correct: "It creates a lawful and official road-use record",
  },
  {
    question: "Vehicle registration supports:",
    choices: [
      "Lawful use on public roads",
      "Skipping legal checks",
      "Removing ownership records",
      "Changing license class",
    ],
    correct: "Lawful use on public roads",
  },
  {
    question: "Which must be kept complete during processing?",
    choices: [
      "Ownership and supporting documents",
      "Entertainment subscriptions",
      "Car wash receipts only",
      "Music playlists",
    ],
    correct: "Ownership and supporting documents",
  },
  {
    question: "Timely compliance helps prevent:",
    choices: [
      "Penalties and delays",
      "License learning",
      "Vehicle ownership",
      "Mirror adjustments",
    ],
    correct: "Penalties and delays",
  },
  {
    question: "Accurate records matter for:",
    choices: [
      "Identification and future transactions",
      "Changing the horn tone",
      "Improving engine sound",
      "Replacing road signs",
    ],
    correct: "Identification and future transactions",
  },
  {
    question: "What does registration confirm?",
    choices: [
      "The vehicle is lawfully recognized for road use",
      "The vehicle can ignore traffic rules",
      "The vehicle needs no documents",
      "The driver is automatically renewed",
    ],
    correct: "The vehicle is lawfully recognized for road use",
  },
  {
    question: "Registration compliance should be:",
    choices: [
      "Maintained regularly",
      "Ignored until penalties appear",
      "Done only after accidents",
      "Handled without documents",
    ],
    correct: "Maintained regularly",
  },
  {
    question: "Which topic belongs to this lesson?",
    choices: [
      "Record accuracy",
      "Fashion trends",
      "Dashboard themes",
      "Roadside food stops",
    ],
    correct: "Record accuracy",
  },
  {
    question: "Why do updated records matter?",
    choices: [
      "They support legal and administrative accuracy",
      "They increase fuel size",
      "They replace insurance",
      "They remove all processing",
    ],
    correct: "They support legal and administrative accuracy",
  },
  {
    question: "Registration is related to:",
    choices: [
      "Compliance obligations",
      "Skipping rules",
      "Removing ownership",
      "Changing road markings",
    ],
    correct: "Compliance obligations",
  },
];

const lawsQuiz: QuizItem[] = [
  {
    question: "Transportation laws mainly help with:",
    choices: [
      "Road order, safety, and accountability",
      "Vehicle paint selection",
      "Seat cover trends",
      "Fuel brand discounts",
    ],
    correct: "Road order, safety, and accountability",
  },
  {
    question: "Why do transportation laws exist?",
    choices: [
      "To regulate road use and protect the public",
      "To remove road discipline",
      "To avoid all enforcement",
      "To replace learning modules",
    ],
    correct: "To regulate road use and protect the public",
  },
  {
    question: "Motorists are required to follow:",
    choices: [
      "Signs, licensing rules, and traffic procedures",
      "Only personal preference",
      "Only passenger advice",
      "Only weather reports",
    ],
    correct: "Signs, licensing rules, and traffic procedures",
  },
  {
    question: "Enforcement exists to:",
    choices: [
      "Discourage harmful behavior",
      "Increase confusion",
      "Remove fairness",
      "Replace road safety",
    ],
    correct: "Discourage harmful behavior",
  },
  {
    question: "Legal awareness helps drivers:",
    choices: [
      "Avoid preventable violations",
      "Ignore standards more confidently",
      "Drive faster without limits",
      "Skip documents permanently",
    ],
    correct: "Avoid preventable violations",
  },
  {
    question: "Compliance supports:",
    choices: [
      "Fairness and safety",
      "Random decisions",
      "No accountability",
      "No structure",
    ],
    correct: "Fairness and safety",
  },
  {
    question: "Transport laws apply to:",
    choices: [
      "Motorists and road users",
      "Only parked cars",
      "Only passengers",
      "Only vehicle sellers",
    ],
    correct: "Motorists and road users",
  },
  {
    question: "Which is part of legal road behavior?",
    choices: [
      "Following traffic procedures",
      "Ignoring signal systems",
      "Driving without awareness",
      "Avoiding all rules",
    ],
    correct: "Following traffic procedures",
  },
  {
    question: "Why should a driver understand legal concepts?",
    choices: [
      "To make better decisions on the road",
      "To skip all enforcement",
      "To remove public safety",
      "To change vehicle ownership",
    ],
    correct: "To make better decisions on the road",
  },
  {
    question: "The public safety role of law is to:",
    choices: [
      "Create consistent standards for behavior",
      "Remove all limits",
      "Let drivers decide alone",
      "Ignore shared road use",
    ],
    correct: "Create consistent standards for behavior",
  },
];

const penaltiesQuiz: QuizItem[] = [
  {
    question: "Why should drivers know about fines and penalties?",
    choices: [
      "To avoid risky and unlawful behavior",
      "To remove all documents",
      "To skip traffic rules",
      "To replace registration requirements",
    ],
    correct: "To avoid risky and unlawful behavior",
  },
  {
    question: "Common violations often involve:",
    choices: [
      "Unsafe behavior and non-compliance",
      "Changing seat covers",
      "Buying accessories",
      "Listening to music",
    ],
    correct: "Unsafe behavior and non-compliance",
  },
  {
    question: "Penalties may include:",
    choices: [
      "Fines and administrative action",
      "Free license upgrades",
      "Automatic renewals",
      "Vehicle replacement",
    ],
    correct: "Fines and administrative action",
  },
  {
    question: "Serious or repeated violations may affect:",
    choices: [
      "Driving privilege and records",
      "Only dashboard style",
      "Only fuel brand",
      "Only seat color",
    ],
    correct: "Driving privilege and records",
  },
  {
    question: "Understanding penalties helps drivers:",
    choices: [
      "Make safer and more lawful choices",
      "Avoid all learning",
      "Skip road awareness",
      "Ignore enforcement",
    ],
    correct: "Make safer and more lawful choices",
  },
  {
    question: "Why review common violations?",
    choices: [
      "To recognize risky situations early",
      "To increase speed safely",
      "To remove documentation",
      "To avoid all inspections",
    ],
    correct: "To recognize risky situations early",
  },
  {
    question: "Administrative consequences are tied to:",
    choices: [
      "The nature and severity of the offense",
      "The music being played",
      "The color of the vehicle",
      "The age of the tires only",
    ],
    correct: "The nature and severity of the offense",
  },
  {
    question: "Which is a goal of penalty awareness?",
    choices: [
      "Prevention through informed behavior",
      "Ignoring traffic systems",
      "Removing responsibilities",
      "Skipping compliance",
    ],
    correct: "Prevention through informed behavior",
  },
  {
    question: "Violations can affect:",
    choices: [
      "Eligibility and official records",
      "Only windshield size",
      "Only radio settings",
      "Only parking color",
    ],
    correct: "Eligibility and official records",
  },
  {
    question: "A safer driver is usually one who:",
    choices: [
      "Understands the consequences of violations",
      "Avoids all road rules",
      "Relies only on luck",
      "Ignores compliance reminders",
    ],
    correct: "Understands the consequences of violations",
  },
];

const renewalQuiz: QuizItem[] = [
  {
    question: "What is important before renewal-related processing?",
    choices: [
      "Reviewing compliance and learning reminders",
      "Changing vehicle color",
      "Buying accessories",
      "Skipping documentation",
    ],
    correct: "Reviewing compliance and learning reminders",
  },
  {
    question: "A renewal learning course helps drivers:",
    choices: [
      "Refresh safety and legal awareness",
      "Avoid all road rules",
      "Remove all penalties instantly",
      "Replace registration duties",
    ],
    correct: "Refresh safety and legal awareness",
  },
  {
    question: "Renewal learning supports:",
    choices: [
      "Refreshed road safety awareness",
      "Less need for attention",
      "Skipping legal obligations",
      "Permanent exemption from rules",
    ],
    correct: "Refreshed road safety awareness",
  },
  {
    question: "Drivers renewing should revisit:",
    choices: [
      "Hazard awareness and courtesy",
      "Only vehicle color",
      "Only dashboard design",
      "Only plate appearance",
    ],
    correct: "Hazard awareness and courtesy",
  },
  {
    question: "Before renewal, applicants should review:",
    choices: [
      "Requirements and preparation steps",
      "Only restaurant hours",
      "Only fuel rewards",
      "Only new car ads",
    ],
    correct: "Requirements and preparation steps",
  },
  {
    question: "Why is a final course review useful?",
    choices: [
      "It connects rules, habits, and compliance",
      "It removes all road obligations",
      "It replaces identity checks",
      "It cancels previous records",
    ],
    correct: "It connects rules, habits, and compliance",
  },
  {
    question: "Renewal learning is designed for:",
    choices: [
      "Drivers returning for renewal",
      "Only vehicle sellers",
      "Only traffic enforcers",
      "Only first-time passengers",
    ],
    correct: "Drivers returning for renewal",
  },
  {
    question: "A key renewal topic is:",
    choices: [
      "Lawful and safe road behavior",
      "Changing wheel colors",
      "Decorating vehicles",
      "Buying new accessories",
    ],
    correct: "Lawful and safe road behavior",
  },
  {
    question: "Renewal preparation can reduce:",
    choices: [
      "Confusion during the process",
      "The number of road signs",
      "The need for awareness",
      "Traffic responsibilities",
    ],
    correct: "Confusion during the process",
  },
  {
    question: "Which belongs to renewal readiness?",
    choices: [
      "Documentary and portal preparation",
      "Skipping reminders",
      "Ignoring updates",
      "Avoiding review content",
    ],
    correct: "Documentary and portal preparation",
  },
];

const medicalQuiz: QuizItem[] = [
  {
    question: "Why is accurate medical information important?",
    choices: [
      "It supports safety and proper licensing review",
      "It changes plate color",
      "It lowers fuel use",
      "It replaces exams",
    ],
    correct: "It supports safety and proper licensing review",
  },
  {
    question: "Driving requires:",
    choices: [
      "Physical and mental capability",
      "Only a favorite car brand",
      "Only seat comfort",
      "Only road familiarity",
    ],
    correct: "Physical and mental capability",
  },
  {
    question: "Medical declarations are expected to be:",
    choices: [
      "Honest and accurate",
      "Optional and random",
      "Copied from others",
      "Hidden when inconvenient",
    ],
    correct: "Honest and accurate",
  },
  {
    question: "Some conditions may affect:",
    choices: [
      "Driving restrictions or indications",
      "Vehicle paint price",
      "Fuel choice only",
      "Road lane color",
    ],
    correct: "Driving restrictions or indications",
  },
  {
    question: "Medical honesty supports:",
    choices: [
      "Personal and public safety",
      "Skipping all evaluations",
      "Removing all legal duties",
      "Automatic approval",
    ],
    correct: "Personal and public safety",
  },
  {
    question: "Why does health matter in driving?",
    choices: [
      "It can affect perception and reaction",
      "It changes road signs",
      "It increases registration size",
      "It removes mirror use",
    ],
    correct: "It can affect perception and reaction",
  },
  {
    question: "What may be applied after assessment?",
    choices: [
      "Restrictions for safe driving",
      "Unlimited exemptions",
      "No-document privileges",
      "No need for awareness",
    ],
    correct: "Restrictions for safe driving",
  },
  {
    question: "Disclosure is important because it:",
    choices: [
      "Supports proper evaluation",
      "Changes vehicle ownership",
      "Replaces documentation",
      "Cancels road rules",
    ],
    correct: "Supports proper evaluation",
  },
  {
    question: "Safer road participation begins with:",
    choices: [
      "Truthful health information",
      "Ignoring declarations",
      "Avoiding review",
      "Skipping checks",
    ],
    correct: "Truthful health information",
  },
  {
    question: "Health-related restrictions are meant to:",
    choices: [
      "Support safer vehicle operation",
      "Remove all licensing steps",
      "Punish every applicant",
      "Replace all road laws",
    ],
    correct: "Support safer vehicle operation",
  },
];

const documentsQuiz: QuizItem[] = [
  {
    question: "Why should applicants review documentary requirements early?",
    choices: [
      "To avoid incomplete submissions",
      "To skip all evaluation",
      "To replace learning modules",
      "To avoid road rules",
    ],
    correct: "To avoid incomplete submissions",
  },
  {
    question: "Core qualification standards include:",
    choices: [
      "Age and identity requirements",
      "Favorite vehicle color",
      "Preferred radio station",
      "Home decoration style",
    ],
    correct: "Age and identity requirements",
  },
  {
    question: "Supporting papers should be:",
    choices: [
      "Complete and valid",
      "Optional and inconsistent",
      "Unrelated to the application",
      "Prepared after submission only",
    ],
    correct: "Complete and valid",
  },
  {
    question: "Verification helps ensure:",
    choices: [
      "Only qualified applicants proceed",
      "All documents are ignored",
      "No standards are checked",
      "Anyone can skip review",
    ],
    correct: "Only qualified applicants proceed",
  },
  {
    question: "One common cause of delays is:",
    choices: [
      "Incomplete submissions",
      "Too much awareness",
      "Too many valid papers",
      "Reviewing requirements early",
    ],
    correct: "Incomplete submissions",
  },
  {
    question: "Identity verification supports:",
    choices: [
      "Application accuracy and legality",
      "Fuel discounts only",
      "Paint selection",
      "Skipping eligibility checks",
    ],
    correct: "Application accuracy and legality",
  },
  {
    question: "Why prepare documents in advance?",
    choices: [
      "To improve processing readiness",
      "To avoid all portal use",
      "To remove legal standards",
      "To cancel requirements",
    ],
    correct: "To improve processing readiness",
  },
  {
    question: "Qualification standards matter because they:",
    choices: [
      "Help screen applicants properly",
      "Replace all safety rules",
      "Ignore legal obligations",
      "Change vehicle ownership",
    ],
    correct: "Help screen applicants properly",
  },
  {
    question: "Document consistency means information should be:",
    choices: [
      "Matching and accurate",
      "Conflicting and random",
      "Optional and incomplete",
      "Hidden from review",
    ],
    correct: "Matching and accurate",
  },
  {
    question: "Applicants can avoid delays by:",
    choices: [
      "Preparing complete requirements early",
      "Skipping document review",
      "Ignoring standards",
      "Submitting random files",
    ],
    correct: "Preparing complete requirements early",
  },
];

const portalQuiz: QuizItem[] = [
  {
    question: "Why is the portal journey helpful to understand?",
    choices: [
      "It helps users move through services more confidently",
      "It changes road signs",
      "It reduces vehicle size",
      "It skips all processing",
    ],
    correct: "It helps users move through services more confidently",
  },
  {
    question: "The LTMS portal helps users manage:",
    choices: [
      "Learning, applications, records, and transactions",
      "Only parking colors",
      "Only music choices",
      "Only vehicle accessories",
    ],
    correct: "Learning, applications, records, and transactions",
  },
  {
    question: "A typical user journey may begin with:",
    choices: [
      "Account access and preparation",
      "Skipping all steps",
      "Ignoring requirements",
      "Random payment first",
    ],
    correct: "Account access and preparation",
  },
  {
    question: "Portal navigation becomes easier when users know:",
    choices: [
      "What step comes next",
      "Only the logo color",
      "Only background images",
      "Only shortcut keys",
    ],
    correct: "What step comes next",
  },
  {
    question: "Digital process awareness helps reduce:",
    choices: [
      "Confusion during processing",
      "The need for documents",
      "All legal standards",
      "The number of required steps",
    ],
    correct: "Confusion during processing",
  },
  {
    question: "A portal overview is useful for:",
    choices: [
      "First-time users",
      "Only advanced coders",
      "Only vehicle dealers",
      "Only inspectors",
    ],
    correct: "First-time users",
  },
  {
    question: "Which belongs to the application journey?",
    choices: [
      "Preparation, submission, evaluation, and confirmation",
      "Skipping every review step",
      "Avoiding all records",
      "Removing all requirements",
    ],
    correct: "Preparation, submission, evaluation, and confirmation",
  },
  {
    question: "Practical navigation tips help users:",
    choices: [
      "Move through the portal faster and more clearly",
      "Avoid learning entirely",
      "Ignore transaction flow",
      "Skip awareness",
    ],
    correct: "Move through the portal faster and more clearly",
  },
  {
    question: "The LTMS journey connects learning with:",
    choices: [
      "Transactions and applications",
      "Only entertainment",
      "Only advertisements",
      "Only road decorations",
    ],
    correct: "Transactions and applications",
  },
  {
    question: "Understanding sequence in the portal helps with:",
    choices: [
      "Confidence and clarity",
      "Skipping legal process",
      "Avoiding all standards",
      "Replacing official steps",
    ],
    correct: "Confidence and clarity",
  },
];

const lessonCourses: LessonCourse[] = [
  {
    id: 1,
    code: "Module I",
    title: "Licensing Information",
    description:
      "Overview of licensing rules, classifications, requirements, fees, and application flow.",
    category: "Licensing",
    duration: "20 min",
    level: "Beginner",
    tagline: "Start here to understand the full LTMS licensing journey.",
    about:
      "This course explains the purpose of driver licensing, the different license classifications, the basic qualifications of applicants, and the steps required before approval.",
    outcomes: [
      "Understand the purpose of driver licensing",
      "Identify common license classifications",
      "Recognize the main documentary requirements",
      "Know the general application flow and processing sequence",
    ],
    nextStep:
      "Continue with Getting Ready to Drive after finishing the licensing overview.",
    heroImage: mockImages.licensing,
    lessons: [
      {
        number: "1.1",
        title: "Introduction to Driver Licensing",
        description:
          "Learn why licensing exists and how it supports public safety.",
        time: "4 min",
        content:
          "Driver licensing exists to make sure motorists meet legal and safety standards before using public roads. It is both a qualification process and a public safety measure. Learners should understand how this topic supports lawful application, public safety, and the responsibilities connected to obtaining a license.",
        discussion:
          "Driver licensing exists to make sure motorists meet legal and safety standards before using public roads. It is both a qualification process and a public safety measure. It explains why licensing is required, how it supports public safety, and why qualification must be verified before a person is allowed to drive on public roads.",
        details: [
          "Driver licensing confirms that an applicant meets required legal and safety standards.",
          "Licensing protects the public by ensuring that drivers are not operating vehicles without proper qualification.",
          "This topic provides the foundation for understanding later lessons on classifications, requirements, and process flow.",
        ],
        examples: [
          "A first-time applicant must complete the required steps before being allowed to lawfully operate a vehicle.",
          "Licensing acts as proof that a driver has gone through the necessary checks and responsibilities expected by the system.",
        ],
        tips: [
          "Understand the purpose of licensing before studying the rest of the module.",
          "Remember that licensing is both a legal and a public safety requirement.",
          "Use this topic as the foundation for the rest of the licensing lesson.",
        ],
      },
      {
        number: "1.2",
        title: "License Classifications",
        description: "Review the major license types and their differences.",
        time: "5 min",
        content:
          "Applicants should understand the differences among student permits, non-professional licenses, and professional licenses. Each has different privileges and requirements. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Applicants should understand the differences among student permits, non-professional licenses, and professional licenses. Each has different privileges and requirements. It explains that different classifications exist because not all drivers, vehicles, and purposes of use are the same.",
        details: [
          "License classifications determine the type of vehicle a person may legally operate.",
          "Each classification comes with its own scope and expected qualifications.",
          "Understanding classifications early helps applicants avoid confusion in later application steps.",
        ],
        examples: [
          "A student permit and a professional license do not carry the same privileges or requirements.",
          "Choosing the wrong classification may result in preparing the wrong documents or transaction type.",
        ],
        tips: [
          "Match the intended vehicle use with the correct classification.",
          "Do not assume all licenses give the same operating authority.",
          "Review this topic carefully before preparing application requirements.",
        ],
      },
      {
        number: "1.3",
        title: "Requirements and Eligibility",
        description: "Understand the key qualifications before applying.",
        time: "5 min",
        content:
          "Core eligibility includes age, identity verification, medical fitness, educational requirements where applicable, and supporting documents. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Core eligibility includes age, identity verification, medical fitness, educational requirements where applicable, and supporting documents. This topic helps learners understand which standards must be met before an application can properly continue.",
        details: [
          "Eligibility includes basic qualification requirements such as identity, age, and other supporting standards.",
          "Applicants should know that being interested in applying is not the same as already being eligible.",
          "Learning this section helps reduce incomplete or disqualified submissions later in the process.",
        ],
        examples: [
          "An applicant may be asked to present identity and supporting records before proceeding.",
          "A missing qualification can delay the entire process even when other documents are ready.",
        ],
        tips: [
          "Review requirements before paying or submitting anything.",
          "Confirm eligibility early so later steps are easier to complete.",
          "Treat qualifications as the first gateway to lawful processing.",
        ],
      },
      {
        number: "1.4",
        title: "Fees and Processing Flow",
        description: "Review the sequence from preparation to completion.",
        time: "6 min",
        content:
          "Applicants should review processing steps carefully, including portal registration, uploading requirements, evaluations, payments, and scheduling. Understanding this topic makes the digital process easier to follow from preparation, to submission, to confirmation.",
        discussion:
          "Applicants should review processing steps carefully, including portal registration, uploading requirements, evaluations, payments, and scheduling. It outlines how the process is normally sequenced so the learner knows what step usually comes first, next, and last.",
        details: [
          "Processing flow helps applicants understand the order of required actions.",
          "Fee awareness supports better preparation and fewer surprises during processing.",
          "This topic reduces confusion by showing how documents, evaluations, and payments fit together.",
        ],
        examples: [
          "A user may begin with registration and requirements before continuing to evaluation and payment-related steps.",
          "Knowing the sequence in advance helps avoid skipping a stage that later causes delay.",
        ],
        tips: [
          "Study the full flow before starting your transaction.",
          "Prepare payment expectations together with documentary requirements.",
          "Use process order as a guide whenever the next step seems unclear.",
        ],
      },
    ],
    videos: [
      {
        title: "LTO Portal Overview",
        url: "https://www.youtube-nocookie.com/embed/VVj5nW_X-nE",
        label: "Portal Guide",
        description:
          "A quick overview of LTMS access and digital journey guidance.",
      },
      {
        title: "Before Going to an LTO Office",
        url: "https://www.youtube-nocookie.com/embed/olJhfjgLMG0",
        label: "Preparation",
        description: "Helpful reminders before beginning an official process.",
      },
    ],
    quiz: licensingQuiz,
  },
  {
    id: 2,
    code: "Module II",
    title: "Getting Ready to Drive",
    description:
      "Prepare for driving with the right mindset, safety checks, and pre-driving habits.",
    category: "Driving Basics",
    duration: "18 min",
    level: "Beginner",
    tagline: "Build safe habits before the vehicle even starts moving.",
    about:
      "This course focuses on mental readiness, vehicle safety checks, proper seating position, mirror adjustment, and awareness before entering traffic.",
    outcomes: [
      "Practice pre-driving safety checks",
      "Develop awareness before starting a trip",
      "Understand safe seating and mirror adjustment",
      "Build confidence in preparing to drive",
    ],
    nextStep:
      "Proceed to Driving Fundamentals after mastering pre-drive preparation.",
    heroImage: mockImages.driving,
    lessons: [
      {
        number: "2.1",
        title: "Driver Readiness",
        description: "Check alertness and readiness before travel.",
        time: "4 min",
        content:
          "A safe trip begins with the driver’s condition. Fatigue, distraction, stress, and poor judgment can all affect road decisions before driving even starts. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "A safe trip begins with the driver’s condition. Fatigue, distraction, stress, and poor judgment can all affect road decisions before driving even starts. It emphasizes that safe driving starts with the driver's own condition before the vehicle even begins to move.",
        details: [
          "Readiness includes alertness, attention, and emotional control before starting a trip.",
          "A driver's condition can affect judgment before any road movement happens.",
          "This topic teaches that personal safety preparation is part of responsible driving.",
        ],
        examples: [
          "A tired or distracted driver may make unsafe decisions even at the beginning of a short trip.",
          "Checking personal readiness is as important as checking the condition of the vehicle.",
        ],
        tips: [
          "Do not drive when tired, distracted, or unprepared.",
          "Think about your own condition before thinking about movement.",
          "Road safety begins with the driver's readiness.",
        ],
      },
      {
        number: "2.2",
        title: "Vehicle Safety Check",
        description: "Inspect the vehicle before entering the road.",
        time: "5 min",
        content:
          "Basic checks include tires, brakes, lights, fuel level, mirrors, horn, and visible leaks or unusual warnings in the dashboard area. It encourages safer judgment by helping the learner recognize risk early and respond with more discipline and awareness.",
        discussion:
          "Basic checks include tires, brakes, lights, fuel level, mirrors, horn, and visible leaks or unusual warnings in the dashboard area. It guides learners through the basic checks that help identify visible or functional vehicle problems before travel.",
        details: [
          "Vehicle inspection helps reduce avoidable breakdowns and safety issues before entering the road.",
          "Checking tires, lights, brakes, and visible condition is part of safe preparation.",
          "This topic teaches a routine that supports safer and more confident road use.",
        ],
        examples: [
          "A simple pre-drive inspection may reveal a warning sign, low tire condition, or lighting issue before travel begins.",
          "A problem caught before movement is often easier and safer to address than one discovered on the road.",
        ],
        tips: [
          "Use a repeatable pre-drive safety routine.",
          "Never assume the vehicle is fine without checking essential items.",
          "Small checks can prevent larger problems later in the trip.",
        ],
      },
      {
        number: "2.3",
        title: "Position and Visibility",
        description: "Set seat position and mirrors correctly.",
        time: "4 min",
        content:
          "Correct seat adjustment, steering reach, mirror placement, and visibility reduce driving strain and improve awareness. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Correct seat adjustment, steering reach, mirror placement, and visibility reduce driving strain and improve awareness. This part of the lesson expands on position and visibility and explains why it matters in the wider course flow.",
        details: [
          "Position and Visibility focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: set seat position and mirrors correctly.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, position and visibility guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "2.4",
        title: "Road Entry Awareness",
        description: "Observe surroundings before moving.",
        time: "5 min",
        content:
          "Before moving, a driver should observe surroundings, pedestrians, obstacles, and nearby vehicles to avoid sudden conflicts. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Before moving, a driver should observe surroundings, pedestrians, obstacles, and nearby vehicles to avoid sudden conflicts. This part of the lesson expands on road entry awareness and explains why it matters in the wider course flow.",
        details: [
          "Road Entry Awareness focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: observe surroundings before moving.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, road entry awareness guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
    ],
    videos: [
      {
        title: "Driving Preparation Guide",
        url: "https://www.youtube-nocookie.com/embed/olJhfjgLMG0",
        label: "Preparation",
        description: "Helpful guidance before actual driving activity.",
      },
      {
        title: "Welcome to LTO Konek",
        url: "https://www.youtube-nocookie.com/embed/VVj5nW_X-nE",
        label: "Guide",
        description: "Supplemental information and service awareness.",
      },
    ],
    quiz: gettingReadyQuiz,
  },
  {
    id: 3,
    code: "Module III",
    title: "Driving Fundamentals",
    description:
      "Core driving knowledge including controls, steering, awareness, and safe movement.",
    category: "Driving Basics",
    duration: "24 min",
    level: "Beginner",
    tagline: "Learn the core actions that every safe driver must master.",
    about:
      "This course introduces the essential control systems of a vehicle and the practical basics of moving, turning, stopping, and maintaining awareness.",
    outcomes: [
      "Understand basic vehicle controls",
      "Learn steering and braking principles",
      "Apply safe starting and stopping habits",
      "Improve awareness while moving through traffic",
    ],
    nextStep:
      "Take Road Courtesy and Safety to strengthen defensive driving behavior.",
    heroImage: mockImages.traffic,
    lessons: [
      {
        number: "3.1",
        title: "Basic Controls",
        description: "Review steering, pedals, gears, and signals.",
        time: "6 min",
        content:
          "Drivers must be familiar with steering, pedals, signal controls, gear positions, hand brake usage, and dashboard indicators before using a vehicle in motion. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Drivers must be familiar with steering, pedals, signal controls, gear positions, hand brake usage, and dashboard indicators before using a vehicle in motion. This part of the lesson expands on basic controls and explains why it matters in the wider course flow.",
        details: [
          "Basic Controls focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: review steering, pedals, gears, and signals.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, basic controls guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "3.2",
        title: "Steering and Positioning",
        description: "Understand road positioning and turning control.",
        time: "6 min",
        content:
          "Good steering technique supports smoother turns, safer lane control, and better reaction to hazards or road changes. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Good steering technique supports smoother turns, safer lane control, and better reaction to hazards or road changes. This part of the lesson expands on steering and positioning and explains why it matters in the wider course flow.",
        details: [
          "Steering and Positioning focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: understand road positioning and turning control.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, steering and positioning guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "3.3",
        title: "Braking and Speed Control",
        description: "Apply smoother braking and safer speed decisions.",
        time: "6 min",
        content:
          "Drivers should apply gradual braking, maintain safe following distance, and adjust speed according to road and traffic conditions. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Drivers should apply gradual braking, maintain safe following distance, and adjust speed according to road and traffic conditions. This part of the lesson expands on braking and speed control and explains why it matters in the wider course flow.",
        details: [
          "Braking and Speed Control focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: apply smoother braking and safer speed decisions.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, braking and speed control guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "3.4",
        title: "Safe Movement in Traffic",
        description: "Develop awareness while moving with other road users.",
        time: "6 min",
        content:
          "A driver must observe road users continuously, signal intentions early, and maintain control when merging, stopping, or turning. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "A driver must observe road users continuously, signal intentions early, and maintain control when merging, stopping, or turning. This part of the lesson expands on safe movement in traffic and explains why it matters in the wider course flow.",
        details: [
          "Safe Movement in Traffic focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: develop awareness while moving with other road users.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, safe movement in traffic guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
    ],
    videos: [
      {
        title: "Driving Guide Support Video",
        url: "https://www.youtube-nocookie.com/embed/VVj5nW_X-nE",
        label: "Learning",
        description: "Helpful overview for beginner learners.",
      },
      {
        title: "Preparation and Guidance",
        url: "https://www.youtube-nocookie.com/embed/olJhfjgLMG0",
        label: "Guide",
        description: "Supplemental safety and readiness reminders.",
      },
    ],
    quiz: fundamentalsQuiz,
  },
  {
    id: 4,
    code: "Module IV",
    title: "Road Courtesy and Safety",
    description:
      "Learn respectful road behavior, awareness, discipline, and defensive driving principles.",
    category: "Road Safety",
    duration: "22 min",
    level: "Intermediate",
    tagline: "Be a disciplined, respectful, and safety-focused road user.",
    about:
      "This course explains responsible behavior on the road, defensive driving practices, courtesy toward other road users, and risk reduction.",
    outcomes: [
      "Practice respectful road sharing",
      "Understand defensive driving techniques",
      "Identify common risky driving behaviors",
      "Promote discipline and patience on the road",
    ],
    nextStep:
      "Study driver rights and responsibilities to deepen legal awareness.",
    heroImage: mockImages.safety,
    lessons: [
      {
        number: "4.1",
        title: "Respect for Other Road Users",
        description: "Share the road responsibly.",
        time: "5 min",
        content:
          "Road courtesy includes yielding when appropriate, avoiding aggressive behavior, respecting pedestrians, and following lane discipline. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Road courtesy includes yielding when appropriate, avoiding aggressive behavior, respecting pedestrians, and following lane discipline. This part of the lesson expands on respect for other road users and explains why it matters in the wider course flow.",
        details: [
          "Respect for Other Road Users focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: share the road responsibly.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, respect for other road users guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "4.2",
        title: "Defensive Driving",
        description: "Anticipate and reduce risk.",
        time: "6 min",
        content:
          "Defensive driving means anticipating hazards, leaving room for mistakes by others, and prioritizing safety over speed or convenience. It encourages safer judgment by helping the learner recognize risk early and respond with more discipline and awareness.",
        discussion:
          "Defensive driving means anticipating hazards, leaving room for mistakes by others, and prioritizing safety over speed or convenience. This part of the lesson expands on defensive driving and explains why it matters in the wider course flow.",
        details: [
          "Defensive Driving focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: anticipate and reduce risk.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, defensive driving guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "4.3",
        title: "Hazard Awareness",
        description: "Recognize common road risks.",
        time: "5 min",
        content:
          "Drivers must identify blind spots, weather risks, heavy traffic stress points, and sudden road changes to reduce accident potential. It encourages safer judgment by helping the learner recognize risk early and respond with more discipline and awareness.",
        discussion:
          "Drivers must identify blind spots, weather risks, heavy traffic stress points, and sudden road changes to reduce accident potential. This part of the lesson expands on hazard awareness and explains why it matters in the wider course flow.",
        details: [
          "Hazard Awareness focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: recognize common road risks.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, hazard awareness guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "4.4",
        title: "Safe Decision-Making",
        description: "Choose the safer option on the road.",
        time: "6 min",
        content:
          "When uncertain, the safer decision should always be taken. Good drivers avoid rushed or emotional decisions in traffic. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "When uncertain, the safer decision should always be taken. Good drivers avoid rushed or emotional decisions in traffic. This part of the lesson expands on safe decision-making and explains why it matters in the wider course flow.",
        details: [
          "Safe Decision-Making focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: choose the safer option on the road.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, safe decision-making guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
    ],
    videos: [
      {
        title: "Road Safety and Compliance Reminder",
        url: "https://www.youtube-nocookie.com/embed/KL_m3n8C0k4",
        label: "Compliance",
        description: "Awareness-oriented video for safer road behavior.",
      },
      {
        title: "Before Going to an LTO Office",
        url: "https://www.youtube-nocookie.com/embed/olJhfjgLMG0",
        label: "Safety",
        description: "Helpful preparation and responsibility reminders.",
      },
    ],
    quiz: roadSafetyQuiz,
  },
  {
    id: 5,
    code: "Module V",
    title: "Rights, Duties and Responsibilities of Drivers",
    description:
      "Understand driver obligations, lawful conduct, and public responsibility on the road.",
    category: "Driver Responsibility",
    duration: "16 min",
    level: "Beginner",
    tagline: "A driver’s role includes legal duty and public accountability.",
    about:
      "This course teaches that drivers have both rights and obligations. Operating a vehicle is a privilege that carries public safety responsibility.",
    outcomes: [
      "Recognize legal duties of licensed drivers",
      "Understand public accountability on roads",
      "Develop responsible driving habits",
      "Know the importance of lawful conduct",
    ],
    nextStep:
      "Move to transportation laws to connect responsibilities with enforcement.",
    heroImage: mockImages.document,
    lessons: [
      {
        number: "5.1",
        title: "Driver Privilege and Accountability",
        description: "Driving is a privilege with responsibilities.",
        time: "4 min",
        content:
          "Holding a driver’s license gives legal authority to operate a vehicle, but this comes with continuous duty to follow rules and protect others. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Holding a driver’s license gives legal authority to operate a vehicle, but this comes with continuous duty to follow rules and protect others. This part of the lesson expands on driver privilege and accountability and explains why it matters in the wider course flow.",
        details: [
          "Driver Privilege and Accountability focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: driving is a privilege with responsibilities.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, driver privilege and accountability guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "5.2",
        title: "Duties While Driving",
        description: "Understand behavior expected from drivers.",
        time: "4 min",
        content:
          "Drivers are expected to stay alert, obey signals, keep documents valid, and prevent actions that may endanger the public. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Drivers are expected to stay alert, obey signals, keep documents valid, and prevent actions that may endanger the public. This part of the lesson expands on duties while driving and explains why it matters in the wider course flow.",
        details: [
          "Duties While Driving focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: understand behavior expected from drivers.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, duties while driving guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "5.3",
        title: "Public Responsibility",
        description: "Driving decisions affect everyone on the road.",
        time: "4 min",
        content:
          "Every decision behind the wheel affects passengers, pedestrians, and other motorists. Responsible conduct prevents harm. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Every decision behind the wheel affects passengers, pedestrians, and other motorists. Responsible conduct prevents harm. This part of the lesson expands on public responsibility and explains why it matters in the wider course flow.",
        details: [
          "Public Responsibility focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: driving decisions affect everyone on the road.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, public responsibility guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "5.4",
        title: "Consequences of Negligence",
        description: "Understand the impact of unsafe conduct.",
        time: "4 min",
        content:
          "Negligent driving can lead to injury, legal penalties, and license-related consequences that affect both personal and public safety. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Negligent driving can lead to injury, legal penalties, and license-related consequences that affect both personal and public safety. This part of the lesson expands on consequences of negligence and explains why it matters in the wider course flow.",
        details: [
          "Consequences of Negligence focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: understand the impact of unsafe conduct.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, consequences of negligence guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
    ],
    videos: [
      {
        title: "Public Guide Video",
        url: "https://www.youtube-nocookie.com/embed/olJhfjgLMG0",
        label: "Guide",
        description: "General learning support for responsible motorists.",
      },
    ],
    quiz: responsibilityQuiz,
  },
  {
    id: 6,
    code: "Module VI",
    title: "Motor Vehicle Registration",
    description:
      "Registration basics, compliance steps, record handling, and related vehicle requirements.",
    category: "Vehicle",
    duration: "19 min",
    level: "Intermediate",
    tagline: "Keep your vehicle legal, documented, and road-ready.",
    about:
      "This course discusses vehicle registration requirements, ownership records, compliance obligations, and documentation handling.",
    outcomes: [
      "Understand the purpose of registration",
      "Know basic registration steps and documents",
      "Maintain legal compliance for registered vehicles",
      "Recognize the importance of updated records",
    ],
    nextStep:
      "Review fines and penalties to understand risks of non-compliance.",
    heroImage: mockImages.vehicle,
    lessons: [
      {
        number: "6.1",
        title: "Why Registration Matters",
        description: "Understand the legal purpose of registration.",
        time: "5 min",
        content:
          "Vehicle registration creates an official legal record, supports enforcement, and confirms the vehicle’s lawful use on public roads. This helps applicants prepare records correctly and avoid common mistakes that may delay official processing.",
        discussion:
          "Vehicle registration creates an official legal record, supports enforcement, and confirms the vehicle’s lawful use on public roads. This part of the lesson expands on why registration matters and explains why it matters in the wider course flow.",
        details: [
          "Why Registration Matters focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: understand the legal purpose of registration.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, why registration matters guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "6.2",
        title: "Required Documents",
        description: "Review ownership and support records.",
        time: "5 min",
        content:
          "Applicants must keep essential ownership and supporting documents complete, valid, and accessible during processing. This helps applicants prepare records correctly and avoid common mistakes that may delay official processing.",
        discussion:
          "Applicants must keep essential ownership and supporting documents complete, valid, and accessible during processing. This part of the lesson expands on required documents and explains why it matters in the wider course flow.",
        details: [
          "Required Documents focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: review ownership and support records.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, required documents guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "6.3",
        title: "Compliance and Renewal",
        description: "Stay updated and avoid delays.",
        time: "4 min",
        content:
          "Timely compliance prevents penalties, record issues, and unnecessary delays in keeping a vehicle road legal. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Timely compliance prevents penalties, record issues, and unnecessary delays in keeping a vehicle road legal. This part of the lesson expands on compliance and renewal and explains why it matters in the wider course flow.",
        details: [
          "Compliance and Renewal focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: stay updated and avoid delays.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, compliance and renewal guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "6.4",
        title: "Record Accuracy",
        description: "Maintain correct registration information.",
        time: "5 min",
        content:
          "Accurate owner and vehicle information matters for identification, transfer, and future legal or administrative transactions. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Accurate owner and vehicle information matters for identification, transfer, and future legal or administrative transactions. This part of the lesson expands on record accuracy and explains why it matters in the wider course flow.",
        details: [
          "Record Accuracy focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: maintain correct registration information.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, record accuracy guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
    ],
    videos: [
      {
        title: "Mga Kailangan sa Pagkuha ng Plaka",
        url: "https://www.youtube-nocookie.com/embed/KL_m3n8C0k4",
        label: "Vehicle",
        description:
          "Helpful supplemental content related to vehicle documentation.",
      },
    ],
    quiz: registrationQuiz,
  },
  {
    id: 7,
    code: "Module VII",
    title: "Land Transportation Related Laws",
    description:
      "Review major transportation laws, legal rules, and policy guidance for drivers and operators.",
    category: "Law",
    duration: "26 min",
    level: "Intermediate",
    tagline: "Understand the legal foundation behind traffic discipline.",
    about:
      "This course introduces key transportation-related laws and explains how legal rules apply to motorists, public safety, and enforcement.",
    outcomes: [
      "Identify major transportation law concepts",
      "Connect law with driver behavior",
      "Understand why enforcement exists",
      "Recognize the public safety role of legal compliance",
    ],
    nextStep:
      "Follow with fines and penalties to see how these laws are enforced.",
    heroImage: mockImages.office,
    lessons: [
      {
        number: "7.1",
        title: "Purpose of Transportation Laws",
        description: "Understand why transport laws exist.",
        time: "6 min",
        content:
          "Transportation laws exist to regulate road use, protect the public, and create consistent standards for traffic behavior. The discussion also helps explain why legal awareness matters in everyday driving and in preventing avoidable violations.",
        discussion:
          "Transportation laws exist to regulate road use, protect the public, and create consistent standards for traffic behavior. This part of the lesson expands on purpose of transportation laws and explains why it matters in the wider course flow.",
        details: [
          "Purpose of Transportation Laws focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: understand why transport laws exist.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, purpose of transportation laws guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "7.2",
        title: "Legal Duties of Motorists",
        description: "Review legal expectations on the road.",
        time: "7 min",
        content:
          "Motorists are required to follow signs, licensing rules, registration obligations, and traffic procedures defined by law. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Motorists are required to follow signs, licensing rules, registration obligations, and traffic procedures defined by law. This part of the lesson expands on legal duties of motorists and explains why it matters in the wider course flow.",
        details: [
          "Legal Duties of Motorists focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: review legal expectations on the road.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, legal duties of motorists guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "7.3",
        title: "Enforcement and Compliance",
        description: "See how rules are applied.",
        time: "6 min",
        content:
          "Laws are enforced to discourage harmful behavior and maintain order. Compliance supports fairness and safety. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Laws are enforced to discourage harmful behavior and maintain order. Compliance supports fairness and safety. This part of the lesson expands on enforcement and compliance and explains why it matters in the wider course flow.",
        details: [
          "Enforcement and Compliance focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: see how rules are applied.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, enforcement and compliance guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "7.4",
        title: "Legal Awareness in Daily Driving",
        description: "Apply legal awareness to daily road use.",
        time: "7 min",
        content:
          "A legally aware driver makes better decisions and avoids preventable violations through knowledge and discipline. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "A legally aware driver makes better decisions and avoids preventable violations through knowledge and discipline. This part of the lesson expands on legal awareness in daily driving and explains why it matters in the wider course flow.",
        details: [
          "Legal Awareness in Daily Driving focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: apply legal awareness to daily road use.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, legal awareness in daily driving guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
    ],
    videos: [
      {
        title: "Guide Before Visiting LTO",
        url: "https://www.youtube-nocookie.com/embed/olJhfjgLMG0",
        label: "Law",
        description:
          "Supplemental guidance around lawful preparation and awareness.",
      },
    ],
    quiz: lawsQuiz,
  },
  {
    id: 8,
    code: "Module VIII",
    title: "Fines and Penalties for Violations",
    description:
      "Know the common violations, penalties, sanctions, and consequences of non-compliance.",
    category: "Law",
    duration: "15 min",
    level: "Beginner",
    tagline: "Know the cost of violations before they happen.",
    about:
      "This course explains how violations lead to fines, administrative sanctions, and other consequences that affect drivers and vehicle owners.",
    outcomes: [
      "Identify common penalty situations",
      "Understand administrative consequences",
      "Recognize how violations affect driving privilege",
      "Avoid risky conduct through awareness",
    ],
    nextStep:
      "Return to the catalog and review safety-related modules for prevention.",
    heroImage: mockImages.road,
    lessons: [
      {
        number: "8.1",
        title: "Common Violations",
        description: "Review frequent transport violations.",
        time: "4 min",
        content:
          "Frequent violations often involve failure to follow traffic rules, incomplete documents, unsafe driving behavior, or non-compliance with legal requirements. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Frequent violations often involve failure to follow traffic rules, incomplete documents, unsafe driving behavior, or non-compliance with legal requirements. This part of the lesson expands on common violations and explains why it matters in the wider course flow.",
        details: [
          "Common Violations focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: review frequent transport violations.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, common violations guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "8.2",
        title: "Fines and Sanctions",
        description: "Understand the effect of penalties.",
        time: "4 min",
        content:
          "Penalties vary depending on the severity and nature of the offense. They may include fines, warnings, or administrative action. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Penalties vary depending on the severity and nature of the offense. They may include fines, warnings, or administrative action. This part of the lesson expands on fines and sanctions and explains why it matters in the wider course flow.",
        details: [
          "Fines and Sanctions focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: understand the effect of penalties.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, fines and sanctions guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "8.3",
        title: "Effect on Driving Privilege",
        description: "See how repeated violations matter.",
        time: "3 min",
        content:
          "Repeated or serious violations may affect eligibility, records, and a driver’s authority to continue operating a motor vehicle. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Repeated or serious violations may affect eligibility, records, and a driver’s authority to continue operating a motor vehicle. This part of the lesson expands on effect on driving privilege and explains why it matters in the wider course flow.",
        details: [
          "Effect on Driving Privilege focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: see how repeated violations matter.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, effect on driving privilege guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "8.4",
        title: "Prevention Through Awareness",
        description: "Reduce risk through informed choices.",
        time: "4 min",
        content:
          "Understanding penalties helps drivers make safer, more lawful choices before problems happen. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Understanding penalties helps drivers make safer, more lawful choices before problems happen. This part of the lesson expands on prevention through awareness and explains why it matters in the wider course flow.",
        details: [
          "Prevention Through Awareness focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: reduce risk through informed choices.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, prevention through awareness guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
    ],
    videos: [
      {
        title: "Compliance Reminder Video",
        url: "https://www.youtube-nocookie.com/embed/KL_m3n8C0k4",
        label: "Penalty",
        description:
          "Additional review support related to compliance and consequences.",
      },
    ],
    quiz: penaltiesQuiz,
  },
  {
    id: 9,
    code: "Module IX",
    title: "Driver's License Renewal Course",
    description:
      "Complete the renewal learning path and review the content needed for license renewal.",
    category: "Licensing",
    duration: "30 min",
    level: "Intermediate",
    tagline: "Refresh your knowledge before renewing your license.",
    about:
      "This course is designed for renewing drivers who need a complete refresher on safety, legal obligations, and updated process reminders.",
    outcomes: [
      "Refresh core driving knowledge",
      "Understand renewal-related requirements",
      "Review lawful and safe road behavior",
      "Prepare for renewal with confidence",
    ],
    nextStep:
      "After finishing, proceed to your renewal application process in LTMS.",
    heroImage: mockImages.classroom,
    lessons: [
      {
        number: "9.1",
        title: "Renewal Overview",
        description: "Review the purpose of renewal learning.",
        time: "7 min",
        content:
          "Renewal requires not only processing compliance but also refreshed awareness of safe driving and legal obligations. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Renewal requires not only processing compliance but also refreshed awareness of safe driving and legal obligations. This part of the lesson expands on renewal overview and explains why it matters in the wider course flow.",
        details: [
          "Renewal Overview focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: review the purpose of renewal learning.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, renewal overview guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "9.2",
        title: "Updated Safety Reminders",
        description: "Refresh modern safety awareness.",
        time: "8 min",
        content:
          "Drivers renewing a license should revisit hazard awareness, speed discipline, courtesy, and proper road behavior. It encourages safer judgment by helping the learner recognize risk early and respond with more discipline and awareness.",
        discussion:
          "Drivers renewing a license should revisit hazard awareness, speed discipline, courtesy, and proper road behavior. This part of the lesson expands on updated safety reminders and explains why it matters in the wider course flow.",
        details: [
          "Updated Safety Reminders focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: refresh modern safety awareness.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, updated safety reminders guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "9.3",
        title: "Renewal Requirements",
        description: "Know what to prepare before renewing.",
        time: "7 min",
        content:
          "Applicants should review documentary, portal, medical, and payment-related requirements before submitting renewal. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Applicants should review documentary, portal, medical, and payment-related requirements before submitting renewal. This part of the lesson expands on renewal requirements and explains why it matters in the wider course flow.",
        details: [
          "Renewal Requirements focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: know what to prepare before renewing.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, renewal requirements guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "9.4",
        title: "Final Course Review",
        description: "Connect learning with actual renewal readiness.",
        time: "8 min",
        content:
          "A final review helps learners connect rules, habits, and legal compliance before returning to the renewal process. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "A final review helps learners connect rules, habits, and legal compliance before returning to the renewal process. This part of the lesson expands on final course review and explains why it matters in the wider course flow.",
        details: [
          "Final Course Review focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: connect learning with actual renewal readiness.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, final course review guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
    ],
    videos: [
      {
        title: "Welcome to LTO Konek",
        url: "https://www.youtube-nocookie.com/embed/VVj5nW_X-nE",
        label: "Renewal",
        description:
          "Helpful refresher support before renewal-related actions.",
      },
      {
        title: "Before Going to an LTO Office",
        url: "https://www.youtube-nocookie.com/embed/olJhfjgLMG0",
        label: "Preparation",
        description: "Preparation reminders before continuing the process.",
      },
    ],
    quiz: renewalQuiz,
  },
  {
    id: 10,
    code: "Module X",
    title: "Medical Conditions and Driving Indications",
    description:
      "Understand how medical conditions can affect driving eligibility, restrictions, and required declarations.",
    category: "Licensing",
    duration: "14 min",
    level: "Beginner",
    tagline: "Safe driving includes honest health disclosure and assessment.",
    about:
      "This course highlights the importance of medical fitness in driving and how certain conditions may affect restrictions or approvals.",
    outcomes: [
      "Recognize the role of medical fitness in driving",
      "Understand why declarations are required",
      "Identify how restrictions may be applied",
      "Promote safer road participation through honesty",
    ],
    nextStep:
      "Review documentary requirements after understanding medical declarations.",
    heroImage: mockImages.safety,
    lessons: [
      {
        number: "10.1",
        title: "Why Medical Fitness Matters",
        description: "See how health affects driving safety.",
        time: "4 min",
        content:
          "Driving requires physical and mental capability. Health conditions may affect perception, control, and reaction. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Driving requires physical and mental capability. Health conditions may affect perception, control, and reaction. This part of the lesson expands on why medical fitness matters and explains why it matters in the wider course flow.",
        details: [
          "Why Medical Fitness Matters focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: see how health affects driving safety.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, why medical fitness matters guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "10.2",
        title: "Disclosure and Declaration",
        description: "Understand why health information matters.",
        time: "3 min",
        content:
          "Applicants are expected to provide honest medical declarations for appropriate evaluation and public safety. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Applicants are expected to provide honest medical declarations for appropriate evaluation and public safety. This part of the lesson expands on disclosure and declaration and explains why it matters in the wider course flow.",
        details: [
          "Disclosure and Declaration focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: understand why health information matters.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, disclosure and declaration guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "10.3",
        title: "Restrictions and Indications",
        description: "Review possible driving restrictions.",
        time: "3 min",
        content:
          "Some approved drivers may receive restrictions or indications depending on assessed conditions and safe driving capacity. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Some approved drivers may receive restrictions or indications depending on assessed conditions and safe driving capacity. This part of the lesson expands on restrictions and indications and explains why it matters in the wider course flow.",
        details: [
          "Restrictions and Indications focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: review possible driving restrictions.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, restrictions and indications guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "10.4",
        title: "Responsibility and Safety",
        description: "Connect honesty with public safety.",
        time: "4 min",
        content:
          "Medical honesty supports personal safety and prevents avoidable road risks for everyone. It encourages safer judgment by helping the learner recognize risk early and respond with more discipline and awareness.",
        discussion:
          "Medical honesty supports personal safety and prevents avoidable road risks for everyone. This part of the lesson expands on responsibility and safety and explains why it matters in the wider course flow.",
        details: [
          "Responsibility and Safety focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: connect honesty with public safety.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, responsibility and safety guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
    ],
    videos: [
      {
        title: "Preparation Guide",
        url: "https://www.youtube-nocookie.com/embed/olJhfjgLMG0",
        label: "Health",
        description: "General guidance relevant to readiness and declarations.",
      },
    ],
    quiz: medicalQuiz,
  },
  {
    id: 11,
    code: "Module XI",
    title: "Qualifications and Documentary Requirements",
    description:
      "Review all documentary requirements, supporting papers, identity checks, and qualification standards.",
    category: "Licensing",
    duration: "17 min",
    level: "Beginner",
    tagline: "Prepare complete documents before starting any application.",
    about:
      "This course gives a clear guide to qualification standards and documentary requirements needed for driver-related transactions.",
    outcomes: [
      "Know the usual supporting documents required",
      "Understand identity and eligibility verification",
      "Prepare applications more efficiently",
      "Avoid delays caused by incomplete submissions",
    ],
    nextStep:
      "Proceed to portal flowchart guidance to understand the next step after document preparation.",
    heroImage: mockImages.document,
    lessons: [
      {
        number: "11.1",
        title: "Core Qualification Standards",
        description: "Review the main eligibility standards.",
        time: "4 min",
        content:
          "Applicants must meet basic eligibility standards such as age, identity, and other legal qualifications for processing. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Applicants must meet basic eligibility standards such as age, identity, and other legal qualifications for processing. This part of the lesson expands on core qualification standards and explains why it matters in the wider course flow.",
        details: [
          "Core Qualification Standards focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: review the main eligibility standards.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, core qualification standards guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "11.2",
        title: "Common Required Documents",
        description: "Know the supporting papers often needed.",
        time: "5 min",
        content:
          "Supporting papers should be complete, valid, and consistent with the information used in the application. This helps applicants prepare records correctly and avoid common mistakes that may delay official processing.",
        discussion:
          "Supporting papers should be complete, valid, and consistent with the information used in the application. This part of the lesson expands on common required documents and explains why it matters in the wider course flow.",
        details: [
          "Common Required Documents focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: know the supporting papers often needed.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, common required documents guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "11.3",
        title: "Verification and Review",
        description: "Understand checking and validation.",
        time: "4 min",
        content:
          "Verification ensures that only qualified and properly documented applicants move forward in the process. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Verification ensures that only qualified and properly documented applicants move forward in the process. This part of the lesson expands on verification and review and explains why it matters in the wider course flow.",
        details: [
          "Verification and Review focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: understand checking and validation.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, verification and review guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "11.4",
        title: "Avoiding Delays",
        description: "Prevent common submission issues.",
        time: "4 min",
        content:
          "Incomplete or inconsistent documents are among the most common causes of application delays. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Incomplete or inconsistent documents are among the most common causes of application delays. This part of the lesson expands on avoiding delays and explains why it matters in the wider course flow.",
        details: [
          "Avoiding Delays focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: prevent common submission issues.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, avoiding delays guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
    ],
    videos: [
      {
        title: "Portal Overview",
        url: "https://www.youtube-nocookie.com/embed/VVj5nW_X-nE",
        label: "Documents",
        description: "Additional orientation for document-related preparation.",
      },
    ],
    quiz: documentsQuiz,
  },
  {
    id: 12,
    code: "Module XII",
    title: "LTO Portal Flowchart and Application Journey",
    description:
      "See the step-by-step path from learning to application, including evaluation, processing, and portal navigation guidance.",
    category: "Portal Guide",
    duration: "12 min",
    level: "Beginner",
    tagline: "Understand the LTMS journey from login to completion.",
    about:
      "This course presents a guided view of the LTMS process so users can understand portal navigation, transaction steps, and sequence clearly.",
    outcomes: [
      "Understand the LTMS user journey",
      "Follow application steps in order",
      "Navigate more confidently in the portal",
      "Reduce confusion during digital processing",
    ],
    nextStep:
      "Return to the catalog and take a specific licensing or safety module next.",
    heroImage: mockImages.office,
    lessons: [
      {
        number: "12.1",
        title: "Portal Overview",
        description: "Understand the digital service structure.",
        time: "3 min",
        content:
          "The LTMS portal helps users manage learning, applications, records, and transactions through a digital process flow. Understanding this topic makes the digital process easier to follow from preparation, to submission, to confirmation.",
        discussion:
          "The LTMS portal helps users manage learning, applications, records, and transactions through a digital process flow. This part of the lesson expands on portal overview and explains why it matters in the wider course flow.",
        details: [
          "Portal Overview focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: understand the digital service structure.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, portal overview guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "12.2",
        title: "Step-by-Step Journey",
        description: "See how users move through the process.",
        time: "4 min",
        content:
          "Users typically move from account access to document preparation, submission, evaluation, payment, and confirmation steps. Understanding this topic makes the digital process easier to follow from preparation, to submission, to confirmation.",
        discussion:
          "Users typically move from account access to document preparation, submission, evaluation, payment, and confirmation steps. This part of the lesson expands on step-by-step journey and explains why it matters in the wider course flow.",
        details: [
          "Step-by-Step Journey focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: see how users move through the process.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, step-by-step journey guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
      {
        number: "12.3",
        title: "Practical Navigation Tips",
        description: "Reduce confusion while using LTMS.",
        time: "5 min",
        content:
          "Knowing where to click, what to prepare, and what step comes next makes the full portal experience faster and easier. This topic should be understood as part of the overall lesson flow so the learner can connect each idea to practical and lawful driving or transaction readiness.",
        discussion:
          "Knowing where to click, what to prepare, and what step comes next makes the full portal experience faster and easier. This part of the lesson expands on practical navigation tips and explains why it matters in the wider course flow.",
        details: [
          "Practical Navigation Tips focuses on the learner's understanding of the topic before moving to the next step.",
          "It is connected to the lesson objective: reduce confusion while using ltms.",
          "A clear understanding of this discussion helps build confidence before the final graded assessment.",
        ],
        examples: [
          "In a real situation, practical navigation tips guides the learner in making more informed and safer decisions.",
          "This topic connects theory with practical road use, compliance, or portal-related preparation.",
        ],
        tips: [
          "Review the full discussion slowly before going to the next topic.",
          "Focus on the terms, rules, and reminders repeated in the lesson.",
          "Use the final quiz to test whether you understood this section correctly.",
        ],
      },
    ],
    videos: [
      {
        title: "Welcome to LTO Konek",
        url: "https://www.youtube-nocookie.com/embed/VVj5nW_X-nE",
        label: "Portal",
        description: "Supplemental portal orientation support.",
      },
    ],
    quiz: portalQuiz,
  },
];

const lesson = computed(() => {
  const id = Number(route.params.id);
  return lessonCourses.find((item) => item.id === id);
});

const currentTopic = computed(() => {
  if (!lesson.value) return null;
  return (
    lesson.value.lessons[selectedTopicIndex.value] ??
    lesson.value.lessons[0] ??
    null
  );
});

const progressWidth = computed(() => {
  if (!lesson.value) return "0%";
  const totalTopics = lesson.value.lessons.length || 1;
  const percent = Math.round(
    ((selectedTopicIndex.value + 1) / totalTopics) * 100,
  );
  return `${Math.max(18, percent)}%`;
});

const delay = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

const scrollToTopInstant = () => {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
};

const scrollToCourseOverview = () => {
  const target = courseOverviewRef.value || lessonMainRef.value;
  if (!target) return;

  target.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const runPageTransition = async (callback: () => void | Promise<void>) => {
  if (isPageLoading.value) return;
  isPageLoading.value = true;
  scrollToTopInstant();
  await nextTick();
  await delay(220);
  await callback();
  await nextTick();
  scrollToTopInstant();
  await delay(180);
  isPageLoading.value = false;
};

const selectTopic = async (index: number) => {
  if (!lesson.value || isPageLoading.value) return;

  const boundedIndex = Math.min(
    Math.max(index, 0),
    lesson.value.lessons.length - 1,
  );

  isPageLoading.value = true;
  await nextTick();
  await delay(180);

  selectedTopicIndex.value = boundedIndex;
  openChapter.value = boundedIndex;
  quizView.value = false;

  await nextTick();
  scrollToCourseOverview();
  await delay(180);
  isPageLoading.value = false;
};

const goToQuizSection = async () => {
  if (isPageLoading.value) return;

  isPageLoading.value = true;
  await nextTick();
  await delay(180);

  quizView.value = true;
  await nextTick();

  const target = document.getElementById("quiz-section") || lessonMainRef.value;
  if (target) {
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  await delay(180);
  isPageLoading.value = false;
};

const passedQuiz = computed(() => score.value >= 80);

const quizCompleted = computed(() => quizFinished.value && passedQuiz.value);

const latestScoreDisplay = computed(() => {
  if (!quizFinished.value) return "Not taken";
  return `${score.value}%`;
});

const certificateIssueDate = computed(() => {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const certificateReference = computed(() => {
  const lessonId = Number(route.params.id);
  const paddedLessonId = String(lessonId).padStart(2, "0");
  return `LTMS-${paddedLessonId}-${String(score.value || 0).padStart(3, "0")}`;
});

const resetQuizState = () => {
  answers.value = [];
  quizStarted.value = false;
  quizFinished.value = false;
  reviewMode.value = false;
  score.value = 0;
};

const saveQuizResult = () => {
  const lessonId = Number(route.params.id);
  const saved = localStorage.getItem(QUIZ_RESULTS_KEY);
  const quizResults: Record<
    string,
    { score: number; passed: boolean; finished: boolean }
  > = saved ? JSON.parse(saved) : {};

  quizResults[String(lessonId)] = {
    score: score.value,
    passed: passedQuiz.value,
    finished: quizFinished.value,
  };

  localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(quizResults));
};

const loadQuizResult = () => {
  const lessonId = Number(route.params.id);
  const saved = localStorage.getItem(QUIZ_RESULTS_KEY);
  const quizResults: Record<
    string,
    { score: number; passed: boolean; finished: boolean }
  > = saved ? JSON.parse(saved) : {};

  const current = quizResults[String(lessonId)];

  if (!current) {
    resetQuizState();
    return;
  }

  score.value = current.score ?? 0;
  quizFinished.value = !!current.finished;
  reviewMode.value = false;
  quizStarted.value = false;
};

const startQuiz = () => {
  if (quizCompleted.value) {
    reviewMode.value = true;
    return;
  }

  quizStarted.value = true;
  reviewMode.value = false;
};

const saveTopicProgress = () => {
  localStorage.setItem(
    TOPIC_PROGRESS_KEY,
    JSON.stringify(topicProgressMap.value),
  );
};

const loadTopicProgress = () => {
  const saved = localStorage.getItem(TOPIC_PROGRESS_KEY);
  topicProgressMap.value = saved ? JSON.parse(saved) : {};
};

const completedTopicCount = computed(() => {
  const lessonId = Number(route.params.id);
  const progress = topicProgressMap.value[String(lessonId)] || [];
  return progress.length;
});

const isTopicCompleted = (topicIndex: number): boolean => {
  const lessonId = Number(route.params.id);
  const progress = topicProgressMap.value[String(lessonId)] || [];
  return progress.includes(topicIndex);
};

const moduleProgressWidth = computed(() => {
  if (!lesson.value) return "0%";
  const totalTopics = lesson.value.lessons.length || 1;
  const completedCount = completedTopicCount.value;
  const percent = Math.round((completedCount / totalTopics) * 100);
  return `${Math.max(18, percent)}%`;
});

const moduleProgressPercent = computed(() => {
  if (!lesson.value) return 0;
  const totalTopics = lesson.value.lessons.length || 1;
  const completedCount = completedTopicCount.value;
  return Math.round((completedCount / totalTopics) * 100);
});

const markTopicComplete = async (topicIndex: number) => {
  const lessonId = Number(route.params.id);
  const lessonKey = String(lessonId);

  if (!topicProgressMap.value[lessonKey]) {
    topicProgressMap.value[lessonKey] = [];
  }

  if (!topicProgressMap.value[lessonKey].includes(topicIndex)) {
    topicProgressMap.value[lessonKey].push(topicIndex);
    topicProgressMap.value[lessonKey].sort((a, b) => a - b);
    saveTopicProgress();
    window.dispatchEvent(new Event("ltms-progress-updated"));
  }

  if (!lesson.value) return;
  const isLastTopic = topicIndex === lesson.value.lessons.length - 1;
  if (isLastTopic) {
    await goToQuizSection();
  } else {
    await selectTopic(topicIndex + 1);
  }
};

const loadCompletedState = () => {
  const saved = localStorage.getItem(COMPLETED_KEY);
  const completedIds: number[] = saved ? JSON.parse(saved) : [];
  const lessonId = Number(route.params.id);
  completed.value = completedIds.includes(lessonId);
  loadTopicProgress();
  loadQuizResult();
};

const toggleChapter = (index: number) => {
  openChapter.value = openChapter.value === index ? null : index;
};

const submitQuiz = () => {
  if (!lesson.value) return;

  let correctCount = 0;

  lesson.value.quiz.forEach((question, index) => {
    if (answers.value[index] === question.correct) {
      correctCount += 1;
    }
  });

  score.value = Math.round((correctCount / lesson.value.quiz.length) * 100);
  quizFinished.value = true;
  quizStarted.value = false;
  reviewMode.value = false;
  saveQuizResult();

  if (passedQuiz.value) {
    markCourseComplete();
  }
};

const retryQuiz = () => {
  if (quizCompleted.value) return;

  answers.value = [];
  quizStarted.value = true;
  quizFinished.value = false;
  reviewMode.value = false;
  score.value = 0;
};

const reviewAnswers = () => {
  quizStarted.value = false;
  reviewMode.value = true;
};

const getChoiceClass = (questionIndex: number, choice: string) => {
  if (!quizFinished.value) return "";

  const question = lesson.value?.quiz[questionIndex];
  if (!question) return "";

  if (choice === question.correct) return "correct";
  if (answers.value[questionIndex] === choice && choice !== question.correct)
    return "wrong";

  return "";
};

watch(
  () => route.params.id,
  async () => {
    isPageLoading.value = true;
    scrollToTopInstant();
    activeTab.value = "about";
    openChapter.value = 0;
    selectedTopicIndex.value = 0;
    quizView.value = false;
    loadCompletedState();
    await nextTick();
    scrollToTopInstant();
    await delay(220);
    isPageLoading.value = false;
  },
  { immediate: true },
);

const markCourseComplete = () => {
  const lessonId = Number(route.params.id);
  const saved = localStorage.getItem(COMPLETED_KEY);
  const completedIds: number[] = saved ? JSON.parse(saved) : [];

  if (!completedIds.includes(lessonId)) {
    completedIds.push(lessonId);
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedIds));
  }

  if (lesson.value) {
    topicProgressMap.value = {
      ...topicProgressMap.value,
      [String(lessonId)]: lesson.value.lessons.map((_, index) => index),
    };
    saveTopicProgress();
  }

  completed.value = true;
  window.dispatchEvent(new Event("ltms-progress-updated"));
};

const toggleComplete = () => {
  const lessonId = Number(route.params.id);

  if (!passedQuiz.value && !completed.value) {
    alert(
      "You must pass the quiz with at least 80% before marking this course as complete.",
    );
    return;
  }

  const saved = localStorage.getItem(COMPLETED_KEY);
  const completedIds: number[] = saved ? JSON.parse(saved) : [];

  const exists = completedIds.includes(lessonId);

  const updated = exists
    ? completedIds.filter((id) => id !== lessonId)
    : [...completedIds, lessonId];

  localStorage.setItem(COMPLETED_KEY, JSON.stringify(updated));
  completed.value = !exists;
  window.dispatchEvent(new Event("ltms-progress-updated"));
};

const goBackToCatalog = async () => {
  if (isPageLoading.value) return;
  isPageLoading.value = true;
  scrollToTopInstant();
  await delay(220);
  router.push("/e-learning");
};

const goToDashboard = async () => {
  if (isPageLoading.value) return;
  isPageLoading.value = true;
  scrollToTopInstant();
  await delay(220);
  router.push("/home");
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.page-loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 120px;
  background: rgba(244, 247, 251, 0.58);
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
  animation: ltms-spin 0.85s linear infinite;
}

.page-loading-text {
  color: #154b96;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.01em;
}

@keyframes ltms-spin {
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
  position: sticky;
  top: 0;
  z-index: 20;
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
  color: #fff;
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
  font-weight: 700;
  letter-spacing: 0.02em;
  opacity: 0.92;
}

.nav-item:hover,
.nav-item.active {
  opacity: 1;
}

.user-badge {
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

.main-content {
  width: min(1500px, calc(100vw - 48px));
  margin: 0 auto;
  padding: 30px 0 40px;
}

.lesson-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(340px, 0.85fr);
  gap: 22px;
  padding: 30px;
  background: linear-gradient(
    135deg,
    rgba(12, 62, 139, 0.95) 0%,
    rgba(36, 88, 180, 0.94) 100%
  );
  color: white;
  border-radius: 26px;
  box-shadow: 0 18px 36px rgba(12, 40, 96, 0.18);
}

.back-btn {
  border: none;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 16px;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.22);
}

.hero-pill-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.lesson-pill {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  font-size: 12px;
  font-weight: 800;
}

.lesson-pill.light {
  background: rgba(255, 255, 255, 0.1);
}

.lesson-hero h1 {
  margin: 14px 0 10px;
  font-size: clamp(32px, 4vw, 50px);
  line-height: 1.04;
}

.lesson-summary {
  margin: 0;
  max-width: 900px;
  font-size: 16px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.92);
}

.lesson-meta {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.lesson-meta span {
  background: rgba(255, 255, 255, 0.12);
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
}

.lesson-hero-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero-image {
  min-height: 220px;
  border-radius: 20px;
  background-size: cover;
  background-position: center;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.progress-card {
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 20px;
  padding: 20px;
  height: 100%;
}

.progress-label {
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  opacity: 0.8;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}

.progress-card strong {
  display: block;
  font-size: 26px;
  margin-bottom: 10px;
}

.progress-card p {
  margin: 0;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.92);
}

.hero-progress-bar {
  margin-top: 18px;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.16);
}

.hero-progress-bar div {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #dbeafe 0%, #ffffff 100%);
}

.course-status-wrap {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.course-status-badge {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-size: 12px;
  font-weight: 800;
}

.course-status-badge.completed {
  background: #dcfce7;
  color: #166534;
}

.complete-btn {
  min-height: 42px;
  border: none;
  border-radius: 10px;
  background: #ffffff;
  color: #154b96;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  padding: 0 16px;
}

.complete-btn:hover {
  transform: translateY(-1px);
}

.complete-btn.completed {
  background: #22c55e;
  color: #fff;
}

.lesson-layout {
  margin-top: 28px;
  display: grid;
  grid-template-columns: minmax(320px, 0.56fr) minmax(0, 1.44fr);
  gap: 24px;
}

.lesson-main,
.lesson-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-card,
.sidebar-card,
.not-found-card {
  background: rgba(255, 255, 255, 0.97);
  border-radius: 22px;
  padding: 24px;
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(222, 230, 240, 0.9);
}

.sticky-card {
  position: sticky;
  top: 92px;
}

.sidebar-heading {
  margin-bottom: 16px;
}

.sidebar-heading h3 {
  margin: 0 0 8px;
}

.sidebar-heading p {
  margin: 0;
  color: #5b6472;
  line-height: 1.65;
}

.topic-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.topic-nav-item {
  width: 100%;
  display: flex;
  gap: 14px;
  align-items: flex-start;
  border: 1px solid #d6e2f2;
  background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
  border-radius: 18px;
  padding: 16px;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);
}

.topic-nav-item:hover {
  border-color: #7faef0;
  background: linear-gradient(180deg, #ffffff 0%, #eef6ff 100%);
  transform: translateY(-2px);
  box-shadow: 0 14px 26px rgba(31, 95, 183, 0.12);
}

.topic-nav-item.active {
  border-color: #1f5fb7;
  background: linear-gradient(180deg, #eff6ff 0%, #e6f0ff 100%);
  box-shadow: 0 18px 32px rgba(31, 95, 183, 0.18);
}

.topic-nav-item:disabled {
  cursor: wait;
  opacity: 0.88;
  transform: none !important;
}

.topic-nav-number {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, #1f5fb7 0%, #154b96 100%);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  flex: 0 0 50px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    0 10px 18px rgba(21, 75, 150, 0.28);
}

.topic-nav-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.topic-status-icon,
.final-quiz-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  margin-left: auto;
}

.topic-status-circle,
.icon-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
  border: 2px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 6px 14px rgba(15, 23, 42, 0.22);
  display: inline-block;
}

.topic-status-check,
.icon-check {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: linear-gradient(180deg, #22c55e 0%, #16a34a 100%);
  color: #ffffff;
  font-size: 12px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.28),
    0 8px 16px rgba(34, 197, 94, 0.35);
}

.final-quiz-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: nowrap;
}

.topic-nav-copy {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.topic-nav-copy strong {
  color: #1f2937;
  font-size: 15px;
  line-height: 1.35;
  padding-right: 4px;
}

.topic-nav-copy span {
  color: #64748b;
  font-size: 13px;
  line-height: 1.45;
}

.section-card h2,
.sidebar-card h3,
.not-found-card h2 {
  margin: 0 0 16px;
  color: #1f2937;
}

.section-card p,
.sidebar-card p,
.not-found-card p {
  margin: 0;
  color: #5b6472;
  line-height: 1.7;
}

.section-head-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.section-eyebrow {
  display: inline-block;
  margin-bottom: 8px;
  color: #1f5fb7;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.section-subtext {
  margin-top: 6px;
  color: #64748b;
  font-size: 14px;
}

.about-copy {
  margin-bottom: 20px !important;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 22px;
}

.overview-stat {
  padding: 16px;
  border-radius: 16px;
  background: #f7fbff;
  border: 1px solid #dce8f8;
}

.overview-stat span {
  display: block;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.overview-stat strong {
  color: #1f2937;
  font-size: 18px;
}

.outcomes-block h3 {
  margin: 0 0 14px;
  color: #1f2937;
}

.learning-list {
  margin: 0;
  padding-left: 20px;
  color: #5b6472;
  line-height: 1.8;
}

.coursera-learning-list {
  list-style: none;
  padding-left: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 14px;
}

.coursera-learning-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px;
  border-radius: 16px;
  background: #f8fbff;
  border: 1px solid #dce8f8;
}

.learning-check {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #1f5fb7;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  flex: 0 0 22px;
}

.topic-focus-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 18px;
}

.topic-time-badge {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background: #e8f1ff;
  color: #154b96;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.topic-content-card {
  border: 1px solid #dce8f8;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  padding: 20px;
}

.topic-content-label {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: #e8f1ff;
  color: #154b96;
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 12px;
}

.topic-pagination {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.topic-next-btn {
  min-width: 160px;
}

.nav-final-step {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #dce8f8;
}

.nav-final-step-label {
  margin-bottom: 10px;
  color: #1f5fb7;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.topic-nav-number.final {
  background: linear-gradient(180deg, #0d468f 0%, #0b3d82 100%);
}

.final-quiz-nav {
  border-color: #bfd7fb;
}

.final-quiz-nav.active {
  border-color: #1f5fb7;
  background: linear-gradient(180deg, #edf5ff 0%, #e4f0ff 100%);
  box-shadow: 0 10px 20px rgba(31, 95, 183, 0.14);
}

.complete-warning {
  margin-top: 18px !important;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #fff !important;
  font-size: 13px;
  line-height: 1.5 !important;
}

.complete-btn.locked {
  background: #dbeafe;
  color: #154b96;
  cursor: not-allowed;
  box-shadow: none;
}

.topic-main-text {
  font-size: 15px;
  line-height: 1.8 !important;
  margin-bottom: 14px !important;
}

.topic-discussion-text {
  margin-bottom: 18px !important;
  color: #475569 !important;
  line-height: 1.8 !important;
}

.topic-detail-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 18px;
}

.topic-detail-section {
  padding: 16px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #dce8f8;
}

.topic-detail-section h4 {
  margin: 0 0 12px;
  color: #154b96;
  font-size: 14px;
}

.topic-detail-list {
  margin: 0;
  padding-left: 18px;
  color: #5b6472;
  line-height: 1.75;
}

.topic-detail-list li + li {
  margin-top: 8px;
}

.primary-btn,
.secondary-btn {
  margin-top: 16px;
  min-height: 42px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 800;
  padding: 0 16px;
  cursor: pointer;
}

.primary-btn {
  border: none;
  background: linear-gradient(180deg, #1f5fb7 0%, #154b96 100%);
  color: #fff;
}

.primary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 16px rgba(31, 95, 183, 0.18);
}

.secondary-btn {
  border: 1px solid #c9d9ee;
  background: #fff;
  color: #154b96;
}

.secondary-btn:hover {
  background: #f8fbff;
}

.secondary-btn:disabled,
.primary-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.video-card {
  border: 1px solid #dce8f8;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 12px 22px rgba(15, 23, 42, 0.06);
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

.video-copy h3 {
  margin: 0 0 8px;
  color: #1f2937;
  font-size: 18px;
}

.video-copy p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.quiz-summary-card {
  border: 1px solid #dce8f8;
  border-radius: 18px;
  padding: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  margin-bottom: 18px;
}

.quiz-intro-card {
  margin-top: 18px;
  padding: 18px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #dce8f8;
}

.quiz-intro-card h3 {
  margin: 0 0 8px;
  color: #1f2937;
  font-size: 18px;
}

.quiz-intro-card p {
  margin: 0;
  color: #5b6472;
  line-height: 1.75;
}

.attempt-btn {
  min-width: 180px;
}

.quiz-summary-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 16px;
}

.quiz-summary-row div {
  background: #fff;
  border: 1px solid #e8edf4;
  border-radius: 14px;
  padding: 14px;
}

.quiz-summary-label {
  display: block;
  font-size: 12px;
  color: #64748b;
  font-weight: 700;
  margin-bottom: 6px;
}

.quiz-summary-row strong {
  color: #1f2937;
  font-size: 18px;
}

.progress-bar {
  height: 10px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar div {
  height: 100%;
  background: linear-gradient(180deg, #1f5fb7 0%, #154b96 100%);
  border-radius: 999px;
}

.quiz-result-banner {
  margin-top: 16px;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.quiz-result-banner.pass {
  background: #ecfdf3;
  border: 1px solid #bbf7d0;
  color: #166534;
}

.quiz-result-banner.fail {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1d4ed8;
}

.quiz-list {
  display: grid;
  gap: 14px;
}

.quiz-card {
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: 14px;
  border: 1px solid #dce8f8;
  border-radius: 16px;
  padding: 16px;
  background: #fbfcff;
}

.quiz-number {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: #e9f0ff;
  color: #1f4fb8;
  font-size: 15px;
  font-weight: 800;
}

.quiz-body h3 {
  margin: 0 0 12px;
  color: #1f2937;
  font-size: 18px;
  line-height: 1.45;
}

.choices-list {
  display: grid;
  gap: 10px;
}

.choice-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid #dce8f8;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
}

.choice-item:hover {
  border-color: #9cc0f4;
  background: #f8fbff;
}

.choice-item input {
  margin-top: 2px;
}

.choice-item.correct {
  border-color: #86efac;
  background: #f0fdf4;
}

.choice-item.wrong {
  border-color: #93c5fd;
  background: #eff6ff;
}

.quiz-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.not-found-card {
  max-width: 700px;
  margin: 40px auto 0;
  text-align: center;
}

@media (max-width: 1100px) {
  .lesson-hero,
  .lesson-layout,
  .video-grid,
  .overview-grid,
  .coursera-learning-list,
  .topic-detail-grid {
    grid-template-columns: 1fr;
  }

  .sticky-card {
    position: static;
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

  .quiz-summary-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 980px) {
  .certificate-header-row,
  .certificate-topline {
    flex-direction: column;
    align-items: flex-start;
  }

  .certificate-footer-grid,
  .certificate-signatures,
  .topic-detail-grid {
    grid-template-columns: 1fr;
  }

  .certificate-body {
    text-align: left;
    padding-left: 0;
    padding-right: 0;
  }
}

@media (max-width: 760px) {
  .main-content {
    width: min(100%, calc(100vw - 20px));
    padding: 16px 0 28px;
  }

  .lesson-hero,
  .section-card,
  .sidebar-card,
  .not-found-card {
    padding: 18px;
  }

  .brand-text {
    font-size: 18px;
  }

  .user-badge {
    font-size: 12px;
  }

  .lesson-hero h1 {
    font-size: 30px;
  }

  .quiz-card,
  .quiz-summary-row {
    grid-template-columns: 1fr;
    display: grid;
  }

  .topic-focus-head,
  .topic-pagination {
    flex-direction: column;
    align-items: stretch;
  }
}

.topic-status-icon,
.final-quiz-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 28px;
  width: 28px;
  height: 28px;
  margin-left: auto;
}

.topic-status-circle,
.icon-circle {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: inline-block;
  background: linear-gradient(180deg, #f8fbff 0%, #eaf2ff 100%);
  border: 1.5px solid #c7d9f6;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    0 6px 16px rgba(148, 163, 184, 0.18);
  position: relative;
}

.topic-status-check,
.icon-check {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(
      circle at 30% 28%,
      rgba(255, 255, 255, 0.34),
      transparent 34%
    ),
    linear-gradient(180deg, #34d399 0%, #16a34a 100%);
  border: 1.5px solid rgba(255, 255, 255, 0.72);
  color: #ffffff;
  font-size: 12px;
  font-weight: 900;
  line-height: 1;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.12);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.28),
    0 10px 18px rgba(34, 197, 94, 0.28);
  position: relative;
}

.topic-status-check::before,
.icon-check::before {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 999px;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);
}

.certificate-card {
  border: 1px solid #d8e5f5;
  box-shadow: 0 22px 48px rgba(15, 23, 42, 0.08);
}

.certificate-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}

.certificate-badge {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: linear-gradient(180deg, #eef5ff 0%, #e2eeff 100%);
  color: #154b96;
  border: 1px solid #d0def5;
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 12px;
}

.certificate-copy {
  max-width: 820px;
}

.certificate-status-pill {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background: #ecfdf3;
  color: #166534;
  border: 1px solid #bbf7d0;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.certificate-sheet {
  position: relative;
  overflow: hidden;
  padding: 34px;
  border-radius: 28px;
  background:
    radial-gradient(
      circle at top right,
      rgba(31, 95, 183, 0.08),
      transparent 28%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(13, 70, 143, 0.05),
      transparent 32%
    ),
    linear-gradient(135deg, #ffffff 0%, #f7fbff 100%);
  border: 1px solid #d9e7f8;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 24px 40px rgba(15, 23, 42, 0.07);
}

.certificate-watermark {
  position: absolute;
  right: -28px;
  bottom: -8px;
  font-size: 128px;
  font-weight: 900;
  letter-spacing: 0.08em;
  color: rgba(13, 70, 143, 0.05);
  pointer-events: none;
  user-select: none;
}

.certificate-corner-seal {
  position: absolute;
  top: 26px;
  right: 26px;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background:
    radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 0.28),
      transparent 35%
    ),
    linear-gradient(180deg, #0d468f 0%, #0b3d82 100%);
  color: #fff;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: 6px solid #e5f0ff;
  box-shadow:
    inset 0 2px 0 rgba(255, 255, 255, 0.22),
    0 16px 28px rgba(11, 61, 130, 0.18);
}

.certificate-topline {
  display: flex;
  align-items: center;
  gap: 22px;
  margin-bottom: 28px;
  padding-right: 112px;
}

.certificate-brand-marks {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 0 0 auto;
}

.certificate-logo-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 86px;
  padding: 12px 10px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid #d7e5f7;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.05);
}

.certificate-logo-chip img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  background: #fff;
  border: 3px solid #edf4ff;
}

.certificate-logo-chip span {
  color: #154b96;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.certificate-org-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.certificate-org-kicker {
  color: #154b96;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.certificate-org-copy strong {
  color: #0f172a;
  font-size: 30px;
  line-height: 1.15;
}

.certificate-org-copy small {
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
}

.certificate-body {
  text-align: center;
  padding: 14px 10px 26px;
}

.certificate-awarded-label {
  display: block;
  color: #64748b;
  font-size: 14px;
  margin-bottom: 10px;
}

.certificate-body h3 {
  margin: 0;
  color: #0b3d82;
  font-size: clamp(38px, 5vw, 54px);
  line-height: 1.02;
  letter-spacing: -0.03em;
}

.certificate-awarded-copy {
  margin-top: 12px !important;
  color: #64748b !important;
  font-size: 15px;
}

.certificate-body h4 {
  margin: 10px 0 12px;
  color: #0f172a;
  font-size: 30px;
  line-height: 1.2;
}

.certificate-description {
  max-width: 840px;
  margin: 0 auto !important;
  color: #475569 !important;
  line-height: 1.85 !important;
  font-size: 15px;
}

.certificate-footer-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 6px;
}

.certificate-meta-card {
  padding: 16px 18px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid #dbe7f7;
}

.certificate-meta-card span {
  display: block;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 6px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.certificate-meta-card strong {
  color: #0f172a;
  font-size: 16px;
  font-weight: 800;
  word-break: break-word;
}

.certificate-signatures {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
  margin-top: 28px;
  padding-top: 8px;
}

.certificate-signature-block {
  text-align: center;
}

.signature-line {
  width: 100%;
  max-width: 240px;
  height: 1px;
  margin: 0 auto 10px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #9fb8df 18%,
    #9fb8df 82%,
    transparent 100%
  );
}

.certificate-signature-block strong {
  display: block;
  color: #0f172a;
  font-size: 14px;
}

.certificate-signature-block span {
  display: block;
  color: #64748b;
  font-size: 12px;
  margin-top: 4px;
}

@media (max-width: 980px) {
  .certificate-header-row,
  .certificate-topline {
    flex-direction: column;
    align-items: flex-start;
  }

  .certificate-topline {
    padding-right: 0;
  }

  .certificate-footer-grid,
  .certificate-signatures {
    grid-template-columns: 1fr;
  }

  .certificate-body {
    text-align: left;
    padding-left: 0;
    padding-right: 0;
  }

  .certificate-brand-marks {
    flex-wrap: wrap;
  }
}

.certificate-status-pill {
  min-height: 28px !important;
  padding: 0 10px !important;
  font-size: 11px !important;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%) !important;
  color: #154b96 !important;
  border: 1px solid #cfdff5 !important;
  box-shadow: 0 6px 14px rgba(21, 75, 150, 0.08);
}

.certificate-sheet {
  padding: 38px !important;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(247, 251, 255, 0.98) 100%
  ) !important;
}

.certificate-watermark {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
  user-select: none;
}

.certificate-watermark img {
  width: min(420px, 58%);
  opacity: 0.07;
  filter: grayscale(15%);
}

.certificate-brand-marks {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 0 0 auto;
}

.certificate-logo-chip.primary {
  min-width: 110px;
  padding: 12px 14px;
}

.certificate-logo-chip.primary img {
  width: 54px;
  height: 54px;
}

.certificate-logo-chip.primary span {
  font-size: 10px;
  line-height: 1.3;
  text-align: center;
  max-width: 110px;
}

.certificate-org-kicker {
  font-size: 10px !important;
  letter-spacing: 0.14em !important;
}

.certificate-org-copy strong {
  font-size: 32px !important;
}

.certificate-corner-seal {
  width: 76px !important;
  height: 76px !important;
  top: 22px !important;
  right: 22px !important;
  font-size: 9px !important;
  letter-spacing: 0.12em !important;
  border-width: 4px !important;
  box-shadow:
    inset 0 2px 0 rgba(255, 255, 255, 0.18),
    0 12px 22px rgba(11, 61, 130, 0.14) !important;
}

.certificate-body h3 {
  font-size: clamp(40px, 5vw, 56px) !important;
}

.certificate-body h4 {
  font-size: 32px !important;
}

.certificate-description {
  max-width: 760px !important;
}

.certificate-meta-card,
.certificate-logo-chip {
  background: rgba(255, 255, 255, 0.92) !important;
  backdrop-filter: blur(2px);
}

@media (max-width: 980px) {
  .certificate-watermark img {
    width: 78%;
  }
}

.certificate-logo-chip.primary img {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}

.certificate-corner-seal {
  width: 82px !important;
  height: 82px !important;
  top: 22px !important;
  right: 22px !important;
  border-radius: 50% !important;
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.92) !important;
  border: 1px solid #d9e7f8 !important;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1) !important;
  color: #154b96 !important;
  font-size: 8px !important;
  font-weight: 800 !important;
  letter-spacing: 0.08em !important;
  text-transform: uppercase !important;
  overflow: hidden;
}

.certificate-corner-seal img {
  width: 44px;
  height: 44px;
  object-fit: contain;
  border-radius: 50%;
}

.certificate-corner-seal span {
  line-height: 1;
}

/* ===== Certificate refinement overrides ===== */
.certificate-card {
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%) !important;
  border: 1px solid #d8e5f5 !important;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.08) !important;
}

.certificate-header-row {
  margin-bottom: 20px !important;
}

.certificate-badge {
  background: linear-gradient(180deg, #f4f8ff 0%, #eaf2ff 100%) !important;
  border: 1px solid #d7e4f7 !important;
  color: #154b96 !important;
  letter-spacing: 0.08em !important;
  text-transform: uppercase !important;
}

.certificate-status-pill {
  background: linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%) !important;
  border: 1px solid #d9e5f6 !important;
  color: #154b96 !important;
  box-shadow: 0 8px 16px rgba(21, 75, 150, 0.06) !important;
}

.certificate-sheet {
  position: relative !important;
  overflow: hidden !important;
  padding: 22px !important;
  border-radius: 28px !important;
  background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%) !important;
  border: 1px solid #dce7f7 !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    0 24px 40px rgba(15, 23, 42, 0.07) !important;
}

.certificate-watermark {
  position: absolute !important;
  inset: 0 !important;
  display: grid !important;
  place-items: center !important;
  pointer-events: none !important;
  user-select: none !important;
}

.certificate-watermark img {
  width: min(460px, 56%) !important;
  opacity: 0.055 !important;
  filter: grayscale(8%) !important;
}

.certificate-frame {
  position: relative !important;
  padding: 30px 30px 28px !important;
  border-radius: 22px !important;
  border: 1.5px solid #d6e3f4 !important;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.92) 0%,
    rgba(252, 253, 255, 0.96) 100%
  ) !important;
  box-shadow:
    inset 0 0 0 5px rgba(239, 245, 255, 0.9),
    inset 0 1px 0 rgba(255, 255, 255, 0.8) !important;
}

.certificate-frame::before,
.certificate-frame::after {
  content: "" !important;
  position: absolute !important;
  width: 22px !important;
  height: 22px !important;
  border: 2px solid #9bb9e1 !important;
  border-radius: 4px !important;
}

.certificate-frame::before {
  top: 14px !important;
  left: 14px !important;
  border-right: none !important;
  border-bottom: none !important;
}

.certificate-frame::after {
  right: 14px !important;
  bottom: 14px !important;
  border-left: none !important;
  border-top: none !important;
}

.certificate-topline {
  display: grid !important;
  grid-template-columns: 88px minmax(0, 1fr) !important;
  align-items: center !important;
  gap: 20px !important;
  margin-bottom: 30px !important;
  padding-right: 0 !important;
}

.certificate-brand-marks {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.certificate-logo-chip,
.certificate-logo-chip.primary {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  min-width: 0 !important;
  backdrop-filter: none !important;
}

.certificate-logo-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 76px;
  height: 76px;
}

.certificate-logo-mark img {
  width: 64px !important;
  height: 64px !important;
  object-fit: contain !important;
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
  border-radius: 0 !important;
}

.certificate-logo-chip span {
  display: none !important;
}

.certificate-org-copy {
  gap: 6px !important;
}

.certificate-org-kicker {
  color: #154b96 !important;
  font-size: 10px !important;
  font-weight: 800 !important;
  letter-spacing: 0.18em !important;
  text-transform: uppercase !important;
}

.certificate-org-copy strong {
  color: #0f172a !important;
  font-size: clamp(32px, 4vw, 42px) !important;
  line-height: 1.08 !important;
  letter-spacing: -0.02em !important;
}

.certificate-org-copy small {
  color: #64748b !important;
  font-size: 13px !important;
  line-height: 1.55 !important;
}

.certificate-body {
  text-align: center !important;
  padding: 26px 12px 28px !important;
}

.certificate-awarded-label {
  display: block !important;
  color: #64748b !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  letter-spacing: 0.12em !important;
  text-transform: uppercase !important;
  margin-bottom: 12px !important;
}

.certificate-body h3 {
  margin: 0 !important;
  color: #0b3d82 !important;
  font-size: clamp(40px, 5.2vw, 64px) !important;
  line-height: 1.02 !important;
  letter-spacing: -0.04em !important;
  font-family: Georgia, "Times New Roman", serif !important;
}

.certificate-awarded-copy {
  margin-top: 16px !important;
  color: #64748b !important;
  font-size: 15px !important;
}

.certificate-body h4 {
  margin: 14px 0 16px !important;
  color: #0f172a !important;
  font-size: clamp(28px, 3.5vw, 36px) !important;
  line-height: 1.18 !important;
  font-weight: 800 !important;
}

.certificate-description {
  max-width: 840px !important;
  margin: 0 auto !important;
  color: #475569 !important;
  line-height: 1.95 !important;
  font-size: 15px !important;
}

.certificate-footer-grid {
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  gap: 14px !important;
  margin-top: 6px !important;
}

.certificate-meta-card {
  padding: 16px 18px !important;
  border-radius: 16px !important;
  background: rgba(255, 255, 255, 0.9) !important;
  border: 1px solid #dbe7f7 !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72) !important;
}

.certificate-meta-card span {
  display: block !important;
  color: #64748b !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  margin-bottom: 6px !important;
  letter-spacing: 0.08em !important;
  text-transform: uppercase !important;
}

.certificate-meta-card strong {
  color: #0f172a !important;
  font-size: 16px !important;
  font-weight: 800 !important;
}

.certificate-signatures {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: 32px !important;
  margin-top: 30px !important;
  padding-top: 8px !important;
}

.certificate-signature-block {
  text-align: center !important;
}

.signature-line {
  width: 100% !important;
  max-width: 240px !important;
  height: 1px !important;
  margin: 0 auto 10px !important;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #9fb8df 18%,
    #9fb8df 82%,
    transparent 100%
  ) !important;
}

.certificate-signature-block strong {
  display: block !important;
  color: #0f172a !important;
  font-size: 14px !important;
}

.certificate-signature-block span {
  display: block !important;
  color: #64748b !important;
  font-size: 12px !important;
  margin-top: 4px !important;
}

.certificate-corner-seal {
  display: none !important;
}

/* remove the visible boxed border around the top-left certificate logo */
.certificate-logo-chip,
.certificate-logo-chip.primary,
.certificate-logo-chip.primary img {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}

/* remove top header logo border/background */
.brand-logo {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

@media (max-width: 980px) {
  .certificate-topline {
    grid-template-columns: 1fr !important;
    align-items: start !important;
  }

  .certificate-brand-marks {
    justify-content: flex-start !important;
  }

  .certificate-footer-grid,
  .certificate-signatures {
    grid-template-columns: 1fr !important;
  }

  .certificate-body {
    text-align: left !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .certificate-watermark img {
    width: 76% !important;
  }
}
</style>

<style scoped>
.topic-complete-btn.completed {
  background: #ecfdf3;
  border-color: #bbf7d0;
  color: #166534;
}

.certificate-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}

.certificate-badge {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: linear-gradient(180deg, #eaf3ff 0%, #dfeeff 100%);
  color: #154b96;
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 12px;
  border: 1px solid #cfe0ff;
}

.certificate-copy {
  max-width: 880px;
  margin: 0 !important;
}

.certificate-status-pill {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background: #ecfdf3;
  color: #166534;
  font-size: 12px;
  font-weight: 800;
  border: 1px solid #bbf7d0;
  white-space: nowrap;
}

.certificate-sheet {
  position: relative;
  overflow: hidden;
  padding: 32px;
  border-radius: 28px;
  background:
    radial-gradient(
      circle at top right,
      rgba(31, 95, 183, 0.08),
      transparent 30%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(11, 61, 130, 0.06),
      transparent 30%
    ),
    linear-gradient(135deg, #ffffff 0%, #f6faff 100%);
  border: 1px solid #d9e6f7;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    0 20px 36px rgba(15, 23, 42, 0.08);
}

.certificate-watermark {
  position: absolute;
  inset: auto -40px 6px auto;
  font-size: 132px;
  font-weight: 900;
  letter-spacing: 0.08em;
  color: rgba(13, 70, 143, 0.05);
  pointer-events: none;
  user-select: none;
}

.certificate-topline {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 28px;
}

.certificate-emblem {
  width: 82px;
  height: 82px;
  border-radius: 50%;
  background: linear-gradient(180deg, #0d468f 0%, #0b3d82 100%);
  box-shadow:
    inset 0 2px 0 rgba(255, 255, 255, 0.24),
    0 14px 26px rgba(11, 61, 130, 0.24);
  display: grid;
  place-items: center;
  border: 6px solid #dfeeff;
}

.certificate-emblem span {
  color: #fff;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.certificate-org-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.certificate-org-kicker {
  color: #154b96;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.certificate-org-copy strong {
  color: #0f172a;
  font-size: 30px;
  line-height: 1.15;
}

.certificate-org-copy small {
  color: #64748b;
  font-size: 13px;
}

.certificate-body {
  text-align: center;
  padding: 18px 10px 26px;
}

.certificate-awarded-label {
  display: block;
  color: #64748b;
  font-size: 14px;
  margin-bottom: 10px;
}

.certificate-body h3 {
  margin: 0;
  color: #0b3d82;
  font-size: clamp(38px, 5vw, 52px);
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.certificate-awarded-copy {
  margin-top: 12px !important;
  color: #64748b !important;
  font-size: 15px;
}

.certificate-body h4 {
  margin: 10px 0 12px;
  color: #0f172a;
  font-size: 30px;
  line-height: 1.2;
}

.certificate-description {
  max-width: 860px;
  margin: 0 auto !important;
  color: #475569 !important;
  line-height: 1.85 !important;
  font-size: 15px;
}

.certificate-footer-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 12px;
}

.certificate-meta-card {
  padding: 16px 18px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid #dbe7f7;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.certificate-meta-card span {
  display: block;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.certificate-meta-card strong {
  color: #0f172a;
  font-size: 16px;
  font-weight: 800;
  word-break: break-word;
}

.certificate-signatures {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
  margin-top: 28px;
  padding-top: 10px;
}

.certificate-signature-block {
  text-align: center;
}

.signature-line {
  width: 100%;
  max-width: 240px;
  height: 1px;
  margin: 0 auto 10px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #9fb8df 18%,
    #9fb8df 82%,
    transparent 100%
  );
}

.certificate-signature-block strong {
  display: block;
  color: #0f172a;
  font-size: 14px;
}

.certificate-signature-block span {
  display: block;
  color: #64748b;
  font-size: 12px;
  margin-top: 4px;
}

.certificate-corner-seal {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background:
    radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 0.28),
      transparent 35%
    ),
    linear-gradient(180deg, #0d468f 0%, #0b3d82 100%);
  color: #fff;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: 6px solid #dfeeff;
  box-shadow:
    inset 0 2px 0 rgba(255, 255, 255, 0.22),
    0 16px 26px rgba(11, 61, 130, 0.2);
}

.topic-status-icon,
.final-quiz-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 28px;
  width: 28px;
  height: 28px;
  margin-left: auto;
}

.topic-status-circle,
.icon-circle {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: inline-block;
  background: linear-gradient(180deg, #f8fbff 0%, #eaf2ff 100%);
  border: 1.5px solid #c7d9f6;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    0 6px 16px rgba(148, 163, 184, 0.18);
  position: relative;
}

.topic-status-check,
.icon-check {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(
      circle at 30% 28%,
      rgba(255, 255, 255, 0.34),
      transparent 34%
    ),
    linear-gradient(180deg, #34d399 0%, #16a34a 100%);
  border: 1.5px solid rgba(255, 255, 255, 0.72);
  color: #ffffff;
  font-size: 12px;
  font-weight: 900;
  line-height: 1;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.12);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.28),
    0 10px 18px rgba(34, 197, 94, 0.28);
  position: relative;
}

.topic-status-check::before,
.icon-check::before {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 999px;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);
}

.certificate-card {
  border: 1px solid #d8e5f5;
  box-shadow: 0 22px 48px rgba(15, 23, 42, 0.08);
}

.certificate-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
}

.certificate-badge {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: linear-gradient(180deg, #eef5ff 0%, #e2eeff 100%);
  color: #154b96;
  border: 1px solid #d0def5;
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 12px;
}

.certificate-copy {
  max-width: 820px;
}

.certificate-status-pill {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background: #ecfdf3;
  color: #166534;
  border: 1px solid #bbf7d0;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.certificate-sheet {
  position: relative;
  overflow: hidden;
  padding: 34px;
  border-radius: 28px;
  background:
    radial-gradient(
      circle at top right,
      rgba(31, 95, 183, 0.08),
      transparent 28%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(13, 70, 143, 0.05),
      transparent 32%
    ),
    linear-gradient(135deg, #ffffff 0%, #f7fbff 100%);
  border: 1px solid #d9e7f8;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 24px 40px rgba(15, 23, 42, 0.07);
}

.certificate-watermark {
  position: absolute;
  right: -28px;
  bottom: -8px;
  font-size: 128px;
  font-weight: 900;
  letter-spacing: 0.08em;
  color: rgba(13, 70, 143, 0.05);
  pointer-events: none;
  user-select: none;
}

.certificate-corner-seal {
  position: absolute;
  top: 26px;
  right: 26px;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background:
    radial-gradient(
      circle at 30% 30%,
      rgba(255, 255, 255, 0.28),
      transparent 35%
    ),
    linear-gradient(180deg, #0d468f 0%, #0b3d82 100%);
  color: #fff;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: 6px solid #e5f0ff;
  box-shadow:
    inset 0 2px 0 rgba(255, 255, 255, 0.22),
    0 16px 28px rgba(11, 61, 130, 0.18);
}

.certificate-topline {
  display: flex;
  align-items: center;
  gap: 22px;
  margin-bottom: 28px;
  padding-right: 112px;
}

.certificate-brand-marks {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 0 0 auto;
}

.certificate-logo-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 86px;
  padding: 12px 10px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid #d7e5f7;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.05);
}

.certificate-logo-chip img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  background: #fff;
  border: 3px solid #edf4ff;
}

.certificate-logo-chip span {
  color: #154b96;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.certificate-org-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.certificate-org-kicker {
  color: #154b96;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.certificate-org-copy strong {
  color: #0f172a;
  font-size: 30px;
  line-height: 1.15;
}

.certificate-org-copy small {
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
}

.certificate-body {
  text-align: center;
  padding: 14px 10px 26px;
}

.certificate-awarded-label {
  display: block;
  color: #64748b;
  font-size: 14px;
  margin-bottom: 10px;
}

.certificate-body h3 {
  margin: 0;
  color: #0b3d82;
  font-size: clamp(38px, 5vw, 54px);
  line-height: 1.02;
  letter-spacing: -0.03em;
}

.certificate-awarded-copy {
  margin-top: 12px !important;
  color: #64748b !important;
  font-size: 15px;
}

.certificate-body h4 {
  margin: 10px 0 12px;
  color: #0f172a;
  font-size: 30px;
  line-height: 1.2;
}

.certificate-description {
  max-width: 840px;
  margin: 0 auto !important;
  color: #475569 !important;
  line-height: 1.85 !important;
  font-size: 15px;
}

.certificate-footer-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 6px;
}

.certificate-meta-card {
  padding: 16px 18px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid #dbe7f7;
}

.certificate-meta-card span {
  display: block;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 6px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.certificate-meta-card strong {
  color: #0f172a;
  font-size: 16px;
  font-weight: 800;
  word-break: break-word;
}

.certificate-signatures {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
  margin-top: 28px;
  padding-top: 8px;
}

.certificate-signature-block {
  text-align: center;
}

.signature-line {
  width: 100%;
  max-width: 240px;
  height: 1px;
  margin: 0 auto 10px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #9fb8df 18%,
    #9fb8df 82%,
    transparent 100%
  );
}

.certificate-signature-block strong {
  display: block;
  color: #0f172a;
  font-size: 14px;
}

.certificate-signature-block span {
  display: block;
  color: #64748b;
  font-size: 12px;
  margin-top: 4px;
}

@media (max-width: 980px) {
  .certificate-header-row,
  .certificate-topline {
    flex-direction: column;
    align-items: flex-start;
  }

  .certificate-topline {
    padding-right: 0;
  }

  .certificate-footer-grid,
  .certificate-signatures {
    grid-template-columns: 1fr;
  }

  .certificate-body {
    text-align: left;
    padding-left: 0;
    padding-right: 0;
  }

  .certificate-brand-marks {
    flex-wrap: wrap;
  }
}

.certificate-status-pill {
  min-height: 28px !important;
  padding: 0 10px !important;
  font-size: 11px !important;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%) !important;
  color: #154b96 !important;
  border: 1px solid #cfdff5 !important;
  box-shadow: 0 6px 14px rgba(21, 75, 150, 0.08);
}

.certificate-sheet {
  padding: 38px !important;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(247, 251, 255, 0.98) 100%
  ) !important;
}

.certificate-watermark {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
  user-select: none;
}

.certificate-watermark img {
  width: min(420px, 58%);
  opacity: 0.07;
  filter: grayscale(15%);
}

.certificate-brand-marks {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 0 0 auto;
}

.certificate-logo-chip.primary {
  min-width: 110px;
  padding: 12px 14px;
}

.certificate-logo-chip.primary img {
  width: 54px;
  height: 54px;
}

.certificate-logo-chip.primary span {
  font-size: 10px;
  line-height: 1.3;
  text-align: center;
  max-width: 110px;
}

.certificate-org-kicker {
  font-size: 10px !important;
  letter-spacing: 0.14em !important;
}

.certificate-org-copy strong {
  font-size: 32px !important;
}

.certificate-corner-seal {
  width: 76px !important;
  height: 76px !important;
  top: 22px !important;
  right: 22px !important;
  font-size: 9px !important;
  letter-spacing: 0.12em !important;
  border-width: 4px !important;
  box-shadow:
    inset 0 2px 0 rgba(255, 255, 255, 0.18),
    0 12px 22px rgba(11, 61, 130, 0.14) !important;
}

.certificate-body h3 {
  font-size: clamp(40px, 5vw, 56px) !important;
}

.certificate-body h4 {
  font-size: 32px !important;
}

.certificate-description {
  max-width: 760px !important;
}

.certificate-meta-card,
.certificate-logo-chip {
  background: rgba(255, 255, 255, 0.92) !important;
  backdrop-filter: blur(2px);
}

@media (max-width: 980px) {
  .certificate-watermark img {
    width: 78%;
  }
}

.certificate-logo-chip.primary img {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}

.certificate-corner-seal {
  width: 82px !important;
  height: 82px !important;
  top: 22px !important;
  right: 22px !important;
  border-radius: 50% !important;
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.92) !important;
  border: 1px solid #d9e7f8 !important;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1) !important;
  color: #154b96 !important;
  font-size: 8px !important;
  font-weight: 800 !important;
  letter-spacing: 0.08em !important;
  text-transform: uppercase !important;
  overflow: hidden;
}

.certificate-corner-seal img {
  width: 44px;
  height: 44px;
  object-fit: contain;
  border-radius: 50%;
}

.certificate-corner-seal span {
  line-height: 1;
}
</style>
