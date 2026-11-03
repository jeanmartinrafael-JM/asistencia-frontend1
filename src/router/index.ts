import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomeView },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../views/DashboardView.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

// Navigation guard: protege rutas y recupera la sesión al recargar
router.beforeEach(async (to) => {
  const auth = useAuthStore();

  // Al recargar la página el store está vacío: preguntamos al backend con /me
  if (!auth.checked) await auth.fetchUser();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: "login" };
  }
  if (to.name === "login" && auth.isAuthenticated) {
    return { name: "dashboard" };
  }

  return true; // <-- cambio: permitir la navegación en los demás casos
});

export default router;