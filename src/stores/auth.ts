import { ref, computed } from "vue";
import { defineStore } from "pinia";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface User {
  uuid: string;
  name: string;
  email: string;
  role: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const checked = ref(false); // ¿ya preguntamos al backend si hay sesión?

  const isAuthenticated = computed(() => user.value !== null);

  async function login(email: string, password: string): Promise<string | null> {
    try {
      const request = await fetch(`${BACKEND_URL}/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=utf-8" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!request.ok) {
        const error = await request.json().catch(() => null);
        return error?.message ?? "No se pudo iniciar sesión";
      }

      user.value = await request.json();
      checked.value = true;
      return null; // null = sin error
    } catch {
      return "No se pudo conectar con el servidor";
    }
  }

  async function fetchUser() {
    try {
      const request = await fetch(`${BACKEND_URL}/v1/auth/me`, {
        credentials: "include",
      });
      user.value = request.ok ? await request.json() : null;
    } catch {
      user.value = null;
    } finally {
      checked.value = true;
    }
  }

  async function logout() {
    try {
      await fetch(`${BACKEND_URL}/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      user.value = null;
    }
  }

  return { user, checked, isAuthenticated, login, fetchUser, logout };
});