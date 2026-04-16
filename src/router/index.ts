import { createRouter, createWebHistory } from "vue-router";
import Landingpage from "../components/Landingpage.vue";
import Homepage from "../components/Homepage.vue";
import LicensingPage from "../components/LicensingPage.vue";
import ELearningPage from "../components/ELearningPage.vue";
import ELearningLessonPage from "../components/ELearningLessonPage.vue";

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
