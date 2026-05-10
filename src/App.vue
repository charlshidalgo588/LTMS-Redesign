<template>
  <!-- Root app shell -->
  <div id="app-root">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAccessibility } from "./composables/useAccessibility";
import { useMobileView } from "./composables/useMobileView";

// Accessibility setup
const { loadAccessibilitySettings } = useAccessibility();

// Boot mobile detection globally
useMobileView();

onMounted(() => {
  loadAccessibilitySettings();
});
</script>
