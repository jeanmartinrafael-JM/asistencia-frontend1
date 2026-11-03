<script setup lang="ts">
  import { useRouter } from "vue-router";
  import { useAuthStore } from "@/stores/auth";

  const auth = useAuthStore();
  const router = useRouter();

  async function onLogout() {
    await auth.logout();
    router.push({ name: "login" });
  }
</script>

<template>
  <section v-if="auth.user">
    <h1>Bienvenido, {{ auth.user.name }}</h1>
    <p>Correo: {{ auth.user.email }}</p>
    <p>Rol: {{ auth.user.role }}</p>
    <button class="btn" @click="onLogout">Cerrar sesión</button>
  </section>
</template>

<style scoped>
  .btn {
    padding: 0.5rem 1rem;
    font-size: 1.1rem;
    cursor: pointer;
  }
</style>