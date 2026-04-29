import { ref, watch } from "vue";

type AccessibilitySettings = {
  darkMode: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
};

const STORAGE_KEY = "ltms_accessibility_settings";

const defaultSettings: AccessibilitySettings = {
  darkMode: false,
  largeText: false,
  reducedMotion: false,
  highContrast: false,
};

const settings = ref<AccessibilitySettings>({ ...defaultSettings });
const initialized = ref(false);

const applyAccessibilitySettings = () => {
  const root = document.documentElement;

  root.classList.toggle("ltms-dark-mode", settings.value.darkMode);
  root.classList.toggle("ltms-large-text", settings.value.largeText);
  root.classList.toggle("ltms-reduced-motion", settings.value.reducedMotion);
  root.classList.toggle("ltms-high-contrast", settings.value.highContrast);
};

const loadAccessibilitySettings = () => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    try {
      settings.value = {
        ...defaultSettings,
        ...JSON.parse(saved),
      };
    } catch {
      settings.value = { ...defaultSettings };
    }
  }

  applyAccessibilitySettings();
  initialized.value = true;
};

watch(
  settings,
  () => {
    if (!initialized.value) return;

    applyAccessibilitySettings();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value));
  },
  { deep: true },
);

export const useAccessibility = () => {
  return {
    settings,
    loadAccessibilitySettings,
    applyAccessibilitySettings,
  };
};
