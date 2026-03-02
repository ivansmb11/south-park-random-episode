# Initial Request

**Date:** 2025-08-27 16:21  
**Request:** modify the current implementation to use https://www.shadcn-vue.com/docs/introduction.html SHADCN for Vue. Install it and modify every view to match the library. Style so there is a LayoutComponent that has navigation bar, and content (children as current route suggests).

## User Requirements
- Integrate SHADCN for Vue component library into existing Vue Router implementation
- Install and configure SHADCN for Vue following their documentation
- Modify all existing views to use SHADCN components
- Create a LayoutComponent with:
  - Navigation bar
  - Content area for route children
- Update styling to match SHADCN design system

## Context
- Current application has Vue 3 + TypeScript + Vite + Vue Router setup
- Existing views: HomeView, EpisodeView, EpisodesView, AboutView
- Current navigation implemented directly in App.vue
- Need to refactor to use SHADCN component library for better UI/UX