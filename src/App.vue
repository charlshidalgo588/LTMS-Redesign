<script setup lang="ts">
import { onMounted } from "vue";
import { useAccessibility } from "./composables/useAccessibility";

const { loadAccessibilitySettings } = useAccessibility();

onMounted(() => {
  loadAccessibilitySettings();
});
</script>

<template>
  <router-view />
</template>
