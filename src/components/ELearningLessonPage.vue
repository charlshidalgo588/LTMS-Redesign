<template>
  <div class="page">
    <header class="topbar">
      <div class="topbar-left">
        <img class="brand-logo" :src="logo" alt="LTO Logo" />
        <span class="brand-text">LTMS PORTAL</span>
      </div>

      <nav class="topbar-nav">
        <a href="#" class="nav-item" @click.prevent="goBackToCatalog">
          E-LEARNING
        </a>
        <a href="#" class="nav-item">CONTACT</a>
        <a href="#" class="nav-item">DASHBOARD</a>
      </nav>

      <div class="user-badge">HIDALGO - 26-050525-2424960</div>
    </header>

    <main class="main-content" v-if="lesson">
      <section class="lesson-hero">
        <div class="lesson-hero-left">
          <button class="back-btn" @click="goBackToCatalog">
            ← Back to Catalog
          </button>
          <span class="lesson-pill">{{ lesson.category }}</span>
          <h1>{{ lesson.title }}</h1>
          <p class="lesson-summary">{{ lesson.description }}</p>

          <div class="lesson-meta">
            <span>{{ lesson.duration }}</span>
            <span>{{ lesson.lessons.length }} lessons</span>
            <span>{{ lesson.level }}</span>
          </div>
        </div>

        <div class="lesson-hero-right">
          <div class="progress-card">
            <span class="progress-label">Learning Path</span>
            <strong>{{ lesson.code }}</strong>
            <p>{{ lesson.tagline }}</p>

            <div class="course-status-wrap">
              <span
                class="course-status-badge"
                :class="{ completed: completed }"
              >
                {{ completed ? "Completed" : "In Progress" }}
              </span>

              <button
                class="complete-btn"
                :class="{ completed: completed }"
                @click="toggleComplete"
              >
                {{ completed ? "Completed ✓" : "Mark as Complete" }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="lesson-layout">
        <div class="lesson-main">
          <div class="section-card">
            <h2>About this course</h2>
            <p>{{ lesson.about }}</p>
          </div>

          <div class="section-card">
            <h2>What you will learn</h2>
            <ul class="learning-list">
              <li v-for="item in lesson.outcomes" :key="item">{{ item }}</li>
            </ul>
          </div>

          <div class="section-card">
            <h2>Lesson Content</h2>

            <div
              v-for="chapter in lesson.lessons"
              :key="chapter.title"
              class="chapter-card"
            >
              <div class="chapter-head">
                <strong>{{ chapter.title }}</strong>
                <span>{{ chapter.time }}</span>
              </div>
              <p>{{ chapter.content }}</p>
            </div>
          </div>
        </div>

        <aside class="lesson-sidebar">
          <div class="sidebar-card">
            <h3>Course Outline</h3>

            <button
              v-for="chapter in lesson.lessons"
              :key="chapter.title"
              class="outline-item"
              type="button"
            >
              <span>{{ chapter.title }}</span>
              <small>{{ chapter.time }}</small>
            </button>
          </div>

          <div class="sidebar-card">
            <h3>Recommended Next Step</h3>
            <p>{{ lesson.nextStep }}</p>
            <button class="primary-btn" @click="goBackToCatalog">
              Browse More Courses
            </button>
          </div>
        </aside>
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
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import logo from "../assets/logo.png";

type Chapter = {
  title: string;
  time: string;
  content: string;
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
  lessons: Chapter[];
};

const COMPLETED_KEY = "ltms_completed_lessons";

const router = useRouter();
const route = useRoute();
const completed = ref(false);

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
    lessons: [
      {
        title: "1. Introduction to Driver Licensing",
        time: "4 min",
        content:
          "Driver licensing exists to make sure motorists meet legal and safety standards before using public roads. It is both a qualification process and a public safety measure.",
      },
      {
        title: "2. License Classifications",
        time: "5 min",
        content:
          "Applicants should understand the differences among student permits, non-professional licenses, and professional licenses. Each has different privileges and requirements.",
      },
      {
        title: "3. Requirements and Eligibility",
        time: "5 min",
        content:
          "Core eligibility includes age, identity verification, medical fitness, educational requirements where applicable, and supporting documents.",
      },
      {
        title: "4. Fees and Processing Flow",
        time: "6 min",
        content:
          "Applicants should review processing steps carefully, including portal registration, uploading requirements, evaluations, payments, and scheduling.",
      },
    ],
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
    lessons: [
      {
        title: "1. Driver Readiness",
        time: "4 min",
        content:
          "A safe trip begins with the driver’s condition. Fatigue, distraction, stress, and poor judgment can all affect road decisions before driving even starts.",
      },
      {
        title: "2. Vehicle Safety Check",
        time: "5 min",
        content:
          "Basic checks include tires, brakes, lights, fuel level, mirrors, horn, and visible leaks or unusual warnings in the dashboard area.",
      },
      {
        title: "3. Position and Visibility",
        time: "4 min",
        content:
          "Correct seat adjustment, steering reach, mirror placement, and visibility reduce driving strain and improve awareness.",
      },
      {
        title: "4. Road Entry Awareness",
        time: "5 min",
        content:
          "Before moving, a driver should observe surroundings, pedestrians, obstacles, and nearby vehicles to avoid sudden conflicts.",
      },
    ],
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
    lessons: [
      {
        title: "1. Basic Controls",
        time: "6 min",
        content:
          "Drivers must be familiar with steering, pedals, signal controls, gear positions, hand brake usage, and dashboard indicators before using a vehicle in motion.",
      },
      {
        title: "2. Steering and Positioning",
        time: "6 min",
        content:
          "Good steering technique supports smoother turns, safer lane control, and better reaction to hazards or road changes.",
      },
      {
        title: "3. Braking and Speed Control",
        time: "6 min",
        content:
          "Drivers should apply gradual braking, maintain safe following distance, and adjust speed according to road and traffic conditions.",
      },
      {
        title: "4. Safe Movement in Traffic",
        time: "6 min",
        content:
          "A driver must observe road users continuously, signal intentions early, and maintain control when merging, stopping, or turning.",
      },
    ],
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
    lessons: [
      {
        title: "1. Respect for Other Road Users",
        time: "5 min",
        content:
          "Road courtesy includes yielding when appropriate, avoiding aggressive behavior, respecting pedestrians, and following lane discipline.",
      },
      {
        title: "2. Defensive Driving",
        time: "6 min",
        content:
          "Defensive driving means anticipating hazards, leaving room for mistakes by others, and prioritizing safety over speed or convenience.",
      },
      {
        title: "3. Hazard Awareness",
        time: "5 min",
        content:
          "Drivers must identify blind spots, weather risks, heavy traffic stress points, and sudden road changes to reduce accident potential.",
      },
      {
        title: "4. Safe Decision-Making",
        time: "6 min",
        content:
          "When uncertain, the safer decision should always be taken. Good drivers avoid rushed or emotional decisions in traffic.",
      },
    ],
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
    lessons: [
      {
        title: "1. Driver Privilege and Accountability",
        time: "4 min",
        content:
          "Holding a driver’s license gives legal authority to operate a vehicle, but this comes with continuous duty to follow rules and protect others.",
      },
      {
        title: "2. Duties While Driving",
        time: "4 min",
        content:
          "Drivers are expected to stay alert, obey signals, keep documents valid, and prevent actions that may endanger the public.",
      },
      {
        title: "3. Public Responsibility",
        time: "4 min",
        content:
          "Every decision behind the wheel affects passengers, pedestrians, and other motorists. Responsible conduct prevents harm.",
      },
      {
        title: "4. Consequences of Negligence",
        time: "4 min",
        content:
          "Negligent driving can lead to injury, legal penalties, and license-related consequences that affect both personal and public safety.",
      },
    ],
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
    lessons: [
      {
        title: "1. Why Registration Matters",
        time: "5 min",
        content:
          "Vehicle registration creates an official legal record, supports enforcement, and confirms the vehicle’s lawful use on public roads.",
      },
      {
        title: "2. Required Documents",
        time: "5 min",
        content:
          "Applicants must keep essential ownership and supporting documents complete, valid, and accessible during processing.",
      },
      {
        title: "3. Compliance and Renewal",
        time: "4 min",
        content:
          "Timely compliance prevents penalties, record issues, and unnecessary delays in keeping a vehicle road legal.",
      },
      {
        title: "4. Record Accuracy",
        time: "5 min",
        content:
          "Accurate owner and vehicle information matters for identification, transfer, and future legal or administrative transactions.",
      },
    ],
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
    lessons: [
      {
        title: "1. Purpose of Transportation Laws",
        time: "6 min",
        content:
          "Transportation laws exist to regulate road use, protect the public, and create consistent standards for traffic behavior.",
      },
      {
        title: "2. Legal Duties of Motorists",
        time: "7 min",
        content:
          "Motorists are required to follow signs, licensing rules, registration obligations, and traffic procedures defined by law.",
      },
      {
        title: "3. Enforcement and Compliance",
        time: "6 min",
        content:
          "Laws are enforced to discourage harmful behavior and maintain order. Compliance supports fairness and safety.",
      },
      {
        title: "4. Legal Awareness in Daily Driving",
        time: "7 min",
        content:
          "A legally aware driver makes better decisions and avoids preventable violations through knowledge and discipline.",
      },
    ],
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
    lessons: [
      {
        title: "1. Common Violations",
        time: "4 min",
        content:
          "Frequent violations often involve failure to follow traffic rules, incomplete documents, unsafe driving behavior, or non-compliance with legal requirements.",
      },
      {
        title: "2. Fines and Sanctions",
        time: "4 min",
        content:
          "Penalties vary depending on the severity and nature of the offense. They may include fines, warnings, or administrative action.",
      },
      {
        title: "3. Effect on Driving Privilege",
        time: "3 min",
        content:
          "Repeated or serious violations may affect eligibility, records, and a driver’s authority to continue operating a motor vehicle.",
      },
      {
        title: "4. Prevention Through Awareness",
        time: "4 min",
        content:
          "Understanding penalties helps drivers make safer, more lawful choices before problems happen.",
      },
    ],
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
    lessons: [
      {
        title: "1. Renewal Overview",
        time: "7 min",
        content:
          "Renewal requires not only processing compliance but also refreshed awareness of safe driving and legal obligations.",
      },
      {
        title: "2. Updated Safety Reminders",
        time: "8 min",
        content:
          "Drivers renewing a license should revisit hazard awareness, speed discipline, courtesy, and proper road behavior.",
      },
      {
        title: "3. Renewal Requirements",
        time: "7 min",
        content:
          "Applicants should review documentary, portal, medical, and payment-related requirements before submitting renewal.",
      },
      {
        title: "4. Final Course Review",
        time: "8 min",
        content:
          "A final review helps learners connect rules, habits, and legal compliance before returning to the renewal process.",
      },
    ],
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
    lessons: [
      {
        title: "1. Why Medical Fitness Matters",
        time: "4 min",
        content:
          "Driving requires physical and mental capability. Health conditions may affect perception, control, and reaction.",
      },
      {
        title: "2. Disclosure and Declaration",
        time: "3 min",
        content:
          "Applicants are expected to provide honest medical declarations for appropriate evaluation and public safety.",
      },
      {
        title: "3. Restrictions and Indications",
        time: "3 min",
        content:
          "Some approved drivers may receive restrictions or indications depending on assessed conditions and safe driving capacity.",
      },
      {
        title: "4. Responsibility and Safety",
        time: "4 min",
        content:
          "Medical honesty supports personal safety and prevents avoidable road risks for everyone.",
      },
    ],
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
    lessons: [
      {
        title: "1. Core Qualification Standards",
        time: "4 min",
        content:
          "Applicants must meet basic eligibility standards such as age, identity, and other legal qualifications for processing.",
      },
      {
        title: "2. Common Required Documents",
        time: "5 min",
        content:
          "Supporting papers should be complete, valid, and consistent with the information used in the application.",
      },
      {
        title: "3. Verification and Review",
        time: "4 min",
        content:
          "Verification ensures that only qualified and properly documented applicants move forward in the process.",
      },
      {
        title: "4. Avoiding Delays",
        time: "4 min",
        content:
          "Incomplete or inconsistent documents are among the most common causes of application delays.",
      },
    ],
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
    lessons: [
      {
        title: "1. Portal Overview",
        time: "3 min",
        content:
          "The LTMS portal helps users manage learning, applications, records, and transactions through a digital process flow.",
      },
      {
        title: "2. Step-by-Step Journey",
        time: "4 min",
        content:
          "Users typically move from account access to document preparation, submission, evaluation, payment, and confirmation steps.",
      },
      {
        title: "3. Practical Navigation Tips",
        time: "5 min",
        content:
          "Knowing where to click, what to prepare, and what step comes next makes the full portal experience faster and easier.",
      },
    ],
  },
];

const lesson = computed(() => {
  const id = Number(route.params.id);
  return lessonCourses.find((item) => item.id === id);
});

const loadCompletedState = () => {
  const saved = localStorage.getItem(COMPLETED_KEY);
  const completedIds: number[] = saved ? JSON.parse(saved) : [];
  const lessonId = Number(route.params.id);
  completed.value = completedIds.includes(lessonId);
};

watch(
  () => route.params.id,
  () => {
    loadCompletedState();
  },
  { immediate: true },
);

const toggleComplete = () => {
  const lessonId = Number(route.params.id);
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

const goBackToCatalog = () => {
  router.push("/e-learning");
};
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
  width: min(1500px, calc(100vw - 48px));
  margin: 0 auto;
  padding: 30px 0 40px;
}

.lesson-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.6fr);
  gap: 22px;
  padding: 30px;
  background: linear-gradient(
    135deg,
    rgba(12, 62, 139, 0.94) 0%,
    rgba(36, 88, 180, 0.92) 100%
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

.lesson-pill {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  font-size: 12px;
  font-weight: 800;
}

.lesson-hero h1 {
  margin: 14px 0 10px;
  font-size: clamp(30px, 4vw, 48px);
  line-height: 1.06;
}

.lesson-summary {
  margin: 0;
  max-width: 900px;
  font-size: 16px;
  line-height: 1.6;
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

.progress-card {
  background: rgba(255, 255, 255, 0.12);
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

.complete-btn.completed {
  background: #22c55e;
  color: #fff;
}

.lesson-layout {
  margin-top: 28px;
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(300px, 0.65fr);
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
  background: rgba(255, 255, 255, 0.96);
  border-radius: 22px;
  padding: 24px;
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
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

.learning-list {
  margin: 0;
  padding-left: 20px;
  color: #5b6472;
  line-height: 1.8;
}

.chapter-card {
  border: 1px solid #e5eaf2;
  border-radius: 16px;
  padding: 16px;
  background: #fbfcff;
}

.chapter-card + .chapter-card {
  margin-top: 14px;
}

.chapter-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.chapter-head strong {
  color: #1f2937;
  font-size: 16px;
}

.chapter-head span {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
}

.outline-item {
  width: 100%;
  border: 1px solid #e5eaf2;
  background: #fff;
  border-radius: 14px;
  min-height: 48px;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  text-align: left;
  cursor: pointer;
}

.outline-item + .outline-item {
  margin-top: 10px;
}

.outline-item span {
  color: #334155;
  font-size: 14px;
  font-weight: 700;
}

.outline-item small {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.primary-btn {
  margin-top: 16px;
  min-height: 42px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(180deg, #1f5fb7 0%, #154b96 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  padding: 0 16px;
  cursor: pointer;
}

.not-found-card {
  max-width: 700px;
  margin: 40px auto 0;
  text-align: center;
}

@media (max-width: 1100px) {
  .lesson-hero,
  .lesson-layout {
    grid-template-columns: 1fr;
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

  .chapter-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .outline-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
