import { createRouter, createWebHashHistory } from "vue-router";

import Landingpage from "../components/Landingpage.vue";
import Homepage from "../components/Homepage.vue";
import LicensingPage from "../components/LicensingPage.vue";
import VehiclePage from "../components/VehiclePage.vue";
import TransactionPage from "../components/TransactionPage.vue";
import ViolationsPage from "../components/ViolationsPage.vue";
import DocumentsPage from "../components/DocumentsPage.vue";
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
  {
    path: "/vehicle",
    name: "Vehicle",
    component: VehiclePage,
  },
  {
    path: "/transactions",
    name: "Transactions",
    component: TransactionPage,
  },
  {
    path: "/violations",
    name: "Violations",
    component: ViolationsPage,
  },
  {
    path: "/documents",
    name: "Documents",
    component: DocumentsPage,
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
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
