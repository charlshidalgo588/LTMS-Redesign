import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// ─── GLOBAL STYLES ────────────────────────────────────────────
import "./assets/main.css";
import "./assets/mobile-global.css";

// ─── APP BOOTSTRAP ────────────────────────────────────────────
const app = createApp(App);

app.use(router);

app.mount("#app");
