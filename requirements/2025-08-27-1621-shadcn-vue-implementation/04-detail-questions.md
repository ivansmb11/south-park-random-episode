# Expert Detail Questions

## Q6: Should we implement the theme provider as a Vue composable in `src/composables/useTheme.ts` or as a global plugin?
**Default if unknown:** Vue composable (aligns with Vue 3 Composition API patterns and easier testing)

## Q7: Should we maintain the existing Vue Router structure with LayoutComponent wrapping RouterView, or restructure routes to have layout-specific route groupings?
**Default if unknown:** Maintain existing structure with LayoutComponent wrapper (simpler migration, preserves current routing logic)

## Q8: Should we create a components.json config file for SHADCN Vue to customize the default component styling and paths?
**Default if unknown:** Yes (allows customization of component installation paths and default styling)

## Q9: Should we implement a loading skeleton component using SHADCN components for the episode loading states?
**Default if unknown:** No (keep existing loading states simple, focus on core component migration)

## Q10: Should we add SHADCN's Toast component for user feedback when actions like "Get Random Episode" are performed?
**Default if unknown:** No (maintain current simple UI, avoid scope creep beyond styling migration)