import { createRouter, createWebHistory } from "vue-router";

import Landingpage from "../components/Landingpage.vue";
import Homepage from "../components/Homepage.vue";
import LicensingPage from "../components/LicensingPage.vue";
import VehiclePage from "../components/VehiclePage.vue"; // ✅ ADD THIS
import ELearningPage from "../components/ELearningPage.vue";
import ELearningLessonPage from "../components/ELearningLessonPage.vue";
import ProfilePage from "../components/ProfilePage.vue";
import ContactPage from "../components/ContactPage.vue";

const routes = [
  {
    path: "/",
    name: "Landing",
    component: Landingpage,
  },
  {
    path: "/home",
    name: "Home",
    component: Homepage,
  },
  {
    path: "/licensing",
    name: "Licensing",
    component: LicensingPage,
  },

  // ✅ VEHICLE PAGE (CONNECTED TO HOMEPAGE CARD)
  {
    path: "/vehicle",
    name: "Vehicle",
    component: VehiclePage,
  },

  {
    path: "/e-learning",
    name: "ELearning",
    component: ELearningPage,
  },
  {
    path: "/e-learning/:id",
    name: "ELearningLesson",
    component: ELearningLessonPage,
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfilePage,
  },
  {
    path: "/contact",
    name: "Contact",
    component: ContactPage,
  },

  // ✅ OPTIONAL (PREMIUM UX): fallback route
  {
    path: "/:pathMatch(.*)*",
    redirect: "/home",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
