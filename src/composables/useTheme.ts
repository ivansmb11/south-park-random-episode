import { ref, onMounted, watch } from "vue";

type Theme = "dark" | "light" | "system";

const STORAGE_KEY = "vite-ui-theme";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

export function useTheme() {
  const theme = ref<Theme>("system");
  const resolvedTheme = ref<"dark" | "light">("dark");

  const getSystemTheme = (): "dark" | "light" => {
    return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";
  };

  const updateResolvedTheme = () => {
    resolvedTheme.value = theme.value === "system" ? getSystemTheme() : theme.value;
  };

  const applyTheme = () => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme.value === "system") {
      const systemTheme = getSystemTheme();
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme.value);
    }
    
    // Update resolved theme whenever we apply
    updateResolvedTheme();
  };

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    localStorage.setItem(STORAGE_KEY, newTheme);
    applyTheme();
  };

  const toggleTheme = () => {
    if (theme.value === "light") {
      setTheme("dark");
    } else if (theme.value === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const initializeTheme = () => {
    const storedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (storedTheme && ["dark", "light", "system"].includes(storedTheme)) {
      theme.value = storedTheme;
    }
    applyTheme();
  };

  onMounted(() => {
    initializeTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia(MEDIA_QUERY);
    const handleChange = () => {
      if (theme.value === "system") {
        applyTheme();
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  });

  // Watch for theme changes
  watch(theme, applyTheme);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };
}
