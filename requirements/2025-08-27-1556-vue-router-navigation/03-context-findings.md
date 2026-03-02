# Context Findings

## Current Codebase Analysis

### Project Structure
- **Framework**: Vue 3 + TypeScript + Vite
- **Entry Point**: `src/main.ts` - Creates Vue app and mounts to `#app`
- **Main Component**: `src/App.vue` - Currently shows Vite + Vue logos and HelloWorld component
- **Components**: Only `src/components/HelloWorld.vue` exists (basic counter example)
- **Styling**: Global styles in `src/style.css`, scoped component styles
- **Build Tool**: Vite with `@vitejs/plugin-vue`

### Current State
- This is a fresh Vue 3 project with default Vite template
- **Vue Router is NOT installed** - needs to be added as dependency
- Project uses Composition API with `<script setup>` syntax
- TypeScript is properly configured with strict settings
- No existing navigation or routing structure

### Files That Need Modification
1. **`package.json`** - Add vue-router dependency
2. **`src/main.ts`** - Register router plugin
3. **`src/App.vue`** - Add navigation and router-view
4. **Create new router file** - `src/router/index.ts`
5. **Create view components** - Replace/restructure existing components

## Vue Router 4 Best Practices (2025)

### Installation & Setup
- Install via `npm install vue-router@4`
- Use `createRouter()` and `createWebHistory()` for browser routing
- TypeScript support is built-in with Vue Router 4

### Recommended File Structure
```
src/
  router/
    index.ts          # Router configuration
  views/              # Page components
    HomeView.vue
    AboutView.vue
  components/         # Reusable components
    Navigation.vue
```

### Router Configuration Pattern
- Use `createWebHistory()` for browser back/forward support
- Define routes with lazy loading for better performance
- Use TypeScript interfaces for route parameters

### Integration Points
- Router must be registered in `src/main.ts` with `app.use(router)`
- Navigation components use `<RouterLink>` instead of regular anchors
- Page content rendered through `<RouterView>` component
- Common layout achieved through App.vue structure

## Technical Constraints
- Must maintain existing TypeScript strict configuration
- Should follow Vue 3 Composition API patterns
- Must work with existing Vite build setup
- Need to preserve existing styling approach

## South Park Episode App Considerations
- Dynamic routes needed for individual episodes: `/episode/:id`
- Likely need routes for:
  - Home/Random episode picker
  - Episode detail pages
  - Possibly character or season browsing
- Navigation should be persistent across all pages