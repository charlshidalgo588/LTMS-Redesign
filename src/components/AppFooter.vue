<template>
  <footer class="footer">
    <div class="footer-left">Release 2.5.4</div>
    <div class="footer-center">
      <img class="footer-logo" :src="logo" alt="LTO Logo" />
      <span>MANAGEMENT INFORMATION DIVISION (MID)</span>
    </div>
    <div class="footer-right"></div>
  </footer>
</template>

<script setup lang="ts">
import logo from "@/assets/logo.png";
</script>

<style scoped>
.footer {
  height: 62px;
  background: #0a3779;
  color: #fff;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 20px;
  font-size: 12px;
}

.footer-left {
  justify-self: start;
  font-weight: 600;
}

.footer-center {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}

.footer-logo {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.footer-right {
  justify-self: end;
}

/* Mobile view */
:global(html.mobile-view) .footer {
  grid-template-columns: 1fr;
  height: auto;
  gap: 6px;
  padding: 12px;
  text-align: center;
}

:global(html.mobile-view) .footer-left,
:global(html.mobile-view) .footer-center,
:global(html.mobile-view) .footer-right {
  justify-self: center;
}

:global(html.mobile-view) .footer-center span {
  font-size: 11px;
}

@media (max-width: 640px) {
  .footer {
    grid-template-columns: 1fr;
    height: auto;
    gap: 6px;
    padding: 12px;
    text-align: center;
  }
  .footer-left,
  .footer-center,
  .footer-right {
    justify-self: center;
  }
}
</style>
