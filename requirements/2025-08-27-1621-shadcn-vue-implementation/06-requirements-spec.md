# SHADCN Vue Implementation - Requirements Specification

## Problem Statement
The current south-park-random-episode application uses custom CSS styling throughout all components. To improve design consistency, accessibility, and maintainability, we need to migrate to SHADCN for Vue component library with Tailwind CSS, implement dark/light mode switching, and create a proper LayoutComponent architecture.

## Solution Overview
Replace all custom styling with SHADCN Vue components, implement Tailwind CSS v4, create a composable-based theme system with dark/light mode toggle, restructure the application with a dedicated LayoutComponent, and enhance user experience with loading skeletons and toast notifications.

## Functional Requirements

### FR1: SHADCN Vue Component Integration
- All existing UI components must be replaced with SHADCN Vue equivalents
- Buttons, cards, inputs, and navigation elements must use SHADCN components
- Component functionality must remain identical to current implementation

### FR2: Dark/Light Mode Toggle
- Users must be able to switch between dark and light themes
- Theme preference must persist across browser sessions
- System theme preference must be detected and applied by default
- Theme toggle button must be accessible in the navigation

### FR3: Layout Component Architecture
- Create a dedicated LayoutComponent for navigation and content structure
- LayoutComponent must wrap RouterView for all routes
- Navigation must be persistent across all pages
- Content area must properly render route-specific components

### FR4: Enhanced User Experience
- Loading states must use SHADCN skeleton components
- Toast notifications must provide feedback for user actions
- Responsive design must work across all device sizes
- Accessibility must be maintained or improved

## Technical Requirements

### TR1: Dependencies and Installation
- **File**: `package.json`
- Install Tailwind CSS v4: `@tailwindcss/vite`, `tailwindcss`
- Install SHADCN Vue CLI access
- Maintain existing Vue 3, TypeScript, Vite, Vue Router dependencies

### TR2: Build Configuration Updates
- **File**: `vite.config.ts`
- Add `@tailwindcss/vite` plugin
- Update existing path alias configuration for compatibility
- Ensure TypeScript definitions remain functional

### TR3: CSS Migration
- **File**: `src/style.css`
- Replace custom CSS with Tailwind CSS imports
- Remove all component-specific `<style>` blocks
- Implement SHADCN CSS custom properties for theming

### TR4: SHADCN Configuration
- **File**: `components.json` (new)
- Configure component installation paths
- Set up custom styling preferences
- Define alias mappings for component imports

### TR5: Theme Management System
- **File**: `src/composables/useTheme.ts` (new)
- Implement Vue composable for theme state management
- Handle localStorage persistence
- Detect system color scheme preference
- Provide theme toggle functionality

### TR6: Layout Component
- **File**: `src/components/LayoutComponent.vue` (new)
- Implement SHADCN Navigation Menu for routing
- Include theme toggle button in navigation
- Structure for header, main content, and footer areas
- Responsive design implementation

### TR7: Application Structure Updates
- **File**: `src/App.vue`
- Simplify to use LayoutComponent wrapper
- Remove existing navigation and styling
- Focus on router and theme provider setup

### TR8: View Component Migration
- **Files**: All `src/views/*.vue` files
- Replace custom buttons with SHADCN Button components
- Replace custom cards with SHADCN Card components
- Replace custom inputs with SHADCN Input components
- Implement SHADCN loading skeletons
- Add toast notifications for user actions

### TR9: Composables Directory
- **Directory**: `src/composables/` (new)
- Create useTheme composable for theme management
- Create useToast composable for notification management
- Follow Vue 3 Composition API best practices

## Implementation Hints and Patterns

### SHADCN Vue Installation Commands
```bash
# Install Tailwind CSS v4
pnpm add tailwindcss @tailwindcss/vite

# Initialize SHADCN Vue
pnpm dlx shadcn-vue@latest init

# Add required components
pnpm dlx shadcn-vue@latest add button
pnpm dlx shadcn-vue@latest add card
pnpm dlx shadcn-vue@latest add input
pnpm dlx shadcn-vue@latest add navigation-menu
pnpm dlx shadcn-vue@latest add skeleton
pnpm dlx shadcn-vue@latest add toast
```

### Theme Composable Pattern
```typescript
// src/composables/useTheme.ts
import { ref, onMounted } from 'vue'

export function useTheme() {
  const theme = ref<'light' | 'dark' | 'system'>('system')
  
  const setTheme = (newTheme: typeof theme.value) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    applyTheme()
  }
  
  const applyTheme = () => {
    // Implementation logic
  }
  
  return { theme, setTheme }
}
```

### LayoutComponent Structure
```vue
<template>
  <div class="min-h-screen">
    <NavigationMenu>
      <!-- Navigation items -->
      <Button @click="toggleTheme" variant="ghost">
        <!-- Theme toggle icon -->
      </Button>
    </NavigationMenu>
    
    <main class="container mx-auto">
      <RouterView />
    </main>
    
    <footer>
      <!-- Footer content -->
    </footer>
  </div>
</template>
```

### Component Migration Examples
```vue
<!-- Before: Custom Button -->
<button @click="action" class="custom-btn">Click me</button>

<!-- After: SHADCN Button -->
<Button @click="action" variant="default">Click me</Button>

<!-- Before: Custom Card -->
<div class="episode-card">
  <h3>Title</h3>
  <p>Content</p>
</div>

<!-- After: SHADCN Card -->
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content</p>
  </CardContent>
</Card>
```

## Acceptance Criteria

### AC1: SHADCN Installation and Configuration
- [ ] Tailwind CSS v4 is properly installed and configured
- [ ] SHADCN Vue CLI can install components successfully
- [ ] components.json configuration file exists and is properly configured
- [ ] All required components (Button, Card, Input, NavigationMenu, Skeleton, Toast) are installed

### AC2: Theme System Implementation
- [ ] useTheme composable provides theme state management
- [ ] Theme toggle button switches between light/dark modes
- [ ] Theme preference persists across browser sessions
- [ ] System theme preference is detected and applied by default
- [ ] Dark mode classes are applied correctly to document root

### AC3: Layout Architecture
- [ ] LayoutComponent exists and wraps RouterView
- [ ] Navigation uses SHADCN NavigationMenu component
- [ ] All routes render within the LayoutComponent structure
- [ ] Navigation remains persistent across route changes
- [ ] Theme toggle is accessible in navigation bar

### AC4: Component Migration
- [ ] All buttons use SHADCN Button component with appropriate variants
- [ ] All cards use SHADCN Card component structure
- [ ] All inputs use SHADCN Input component
- [ ] Custom CSS is removed from all component files
- [ ] Loading states use SHADCN Skeleton components
- [ ] Toast notifications appear for user actions

### AC5: Visual and Functional Consistency
- [ ] Application maintains all existing functionality
- [ ] Responsive design works across device sizes
- [ ] Dark and light themes render correctly
- [ ] Typography and spacing follow SHADCN design system
- [ ] Accessibility features are maintained or improved

### AC6: Build and Development
- [ ] TypeScript compilation succeeds without errors
- [ ] Development server starts without issues
- [ ] Production build completes successfully
- [ ] Hot module replacement works correctly
- [ ] Path aliases (@/) resolve correctly for SHADCN components

## Migration Strategy

### Phase 1: Foundation Setup
1. Install Tailwind CSS v4 and configure Vite
2. Initialize SHADCN Vue and install core components
3. Create components.json configuration
4. Update CSS imports and remove custom styles

### Phase 2: Theme System
1. Create useTheme composable
2. Implement theme toggle functionality
3. Add theme persistence and system detection
4. Test theme switching across all components

### Phase 3: Layout Migration
1. Create LayoutComponent with SHADCN NavigationMenu
2. Integrate theme toggle in navigation
3. Update App.vue to use LayoutComponent
4. Test navigation and routing functionality

### Phase 4: Component Migration
1. Migrate HomeView to use SHADCN components
2. Migrate EpisodesView with Card and Input components
3. Migrate EpisodeView with loading skeletons
4. Migrate AboutView and add toast notifications
5. Remove all custom CSS from component files

### Phase 5: Testing and Polish
1. Test all functionality in both light and dark modes
2. Verify responsive design across devices
3. Test build process and deployment
4. Performance testing and optimization

## Assumptions

1. **Component Compatibility**: SHADCN Vue components will provide equivalent functionality to current custom components
2. **Performance Impact**: Tailwind CSS and SHADCN components will not negatively impact application performance
3. **Browser Support**: Target browsers support CSS custom properties and modern JavaScript features
4. **Design Flexibility**: SHADCN's default design system will be suitable for the South Park theme
5. **Migration Complexity**: Migration can be completed without breaking existing route and state management
6. **Accessibility**: SHADCN components provide better accessibility than current custom implementation
7. **Maintenance**: SHADCN Vue will be actively maintained and compatible with future Vue updates