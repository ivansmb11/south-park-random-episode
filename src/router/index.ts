import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { EpisodeRouteParamsSchema } from "@/core/schemas/route-params.schema";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/LoginView.vue"),
      meta: { requiresAuth: false },
    },
    {
      path: "/auth/callback",
      name: "AuthCallback",
      component: () => import("@/views/AuthCallbackView.vue"),
      meta: { requiresAuth: false },
    },
    {
      path: "/",
      name: "Home",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/episode/:season/:episode",
      name: "Episode",
      component: () => import("@/views/EpisodeView.vue"),
      props: (route) => {
        const parsed = EpisodeRouteParamsSchema.safeParse(route.params);
        if (!parsed.success) {
          return { season: 0, episode: 0, invalidParams: true };
        }
        return parsed.data;
      },
    },
    {
      path: "/episodes",
      name: "Episodes",
      component: () => import("@/views/EpisodesView.vue"),
    },
    {
      path: "/profile",
      name: "Profile",
      component: () => import("@/views/ProfileView.vue"),
    },
    {
      path: "/about",
      name: "About",
      component: () => import("@/views/AboutView.vue"),
    },
    {
      path: "/random",
      name: "Random",
      component: () => import("@/views/RandomView.vue"),
    },
  ],
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  // Wait for auth to finish initializing
  if (authStore.loading) {
    await new Promise<void>((resolve) => {
      const unwatch = authStore.$subscribe(() => {
        if (!authStore.loading) {
          unwatch();
          resolve();
        }
      });
      if (!authStore.loading) {
        unwatch();
        resolve();
      }
    });
  }

  const requiresAuth = to.meta.requiresAuth !== false;

  if (requiresAuth && !authStore.isAuthenticated) {
    return { name: "Login" };
  }

  if (to.name === "Login" && authStore.isAuthenticated) {
    return { path: "/" };
  }
});

export default router;
