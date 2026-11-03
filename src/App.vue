<script setup lang="ts">
  import { RouterLink, RouterView } from "vue-router";
  import { useAuthStore } from "@/stores/auth";

  const auth = useAuthStore();
</script>

<template>
  <header>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink v-if="!auth.isAuthenticated" to="/login">Login</RouterLink>
    <RouterLink v-else to="/dashboard">Dashboard</RouterLink>
  </header>
  <main class="main">
    <RouterView />
  </main>
</template>