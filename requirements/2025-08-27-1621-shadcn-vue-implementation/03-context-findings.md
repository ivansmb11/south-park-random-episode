# Context Findings

## Current Codebase Analysis

### Project Structure
- **Framework**: Vue 3 + TypeScript + Vite + Vue Router 4
- **Current Styling**: Custom CSS with manual styling throughout components
- **Navigation**: Implemented directly in App.vue with custom CSS classes
- **Views**: 4 main views (HomeView, EpisodeView, EpisodesView, AboutView) all with custom styling
- **Dependencies**: Vue, Vue Router, Axios, basic Vite setup

### Current Styling Patterns
- **Navigation**: Custom CSS with dark theme (#2c3e50 background, #ff6b35 accent)
- **Buttons**: Custom styled buttons with hover effects
- **Cards**: Episode cards with custom styling and hover animations
- **Inputs**: Custom search input with focus states
- **Layout**: Flexbox-based layout with manual responsive breakpoints

### Files Requiring Modification
1. **`package.json`** - Add Tailwind CSS and SHADCN dependencies
2. **`vite.config.ts`** - Update for Tailwind v4 integration
3. **`src/main.ts`** - Potential theme provider setup
4. **`src/App.vue`** - Refactor to use new LayoutComponent
5. **`src/components/LayoutComponent.vue`** - New component for navigation and content
6. **All view files** - Migrate to SHADCN components
7. **`src/style.css`** - Replace with Tailwind CSS imports

## SHADCN for Vue Research Findings

### Installation Requirements
- **Tailwind CSS v4** with @tailwindcss/vite plugin
- **SHADCN Vue CLI** for component installation
- **TypeScript Configuration** with baseUrl and paths for @/* aliases
- **Component Installation** via `pnpm dlx shadcn-vue@latest add [component]`

### Key Components Needed
1. **Navigation Menu** - For main navigation bar
2. **Button** - Replace all custom buttons
3. **Card** - For episode cards and content containers
4. **Input** - For search functionality
5. **Typography** - Headers and text elements

### Dark/Light Mode Implementation
- **Theme Storage**: Uses localStorage for theme persistence
- **System Detection**: Automatically detects system color scheme preference
- **CSS Classes**: Toggles "dark" class on document root element
- **Implementation**: Requires theme provider and toggle functionality

### Component Structure Patterns
```vue
// Navigation Menu
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuLink>Link</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>

// Button variants
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>

// Card structure
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

## Technical Integration Points

### Vite Configuration
- Add Tailwind CSS plugin: `@tailwindcss/vite`
- Maintain existing path alias setup
- Update for Node.js type definitions

### CSS Migration Strategy
- Replace `src/style.css` with Tailwind imports
- Remove all custom CSS from component `<style>` blocks
- Use Tailwind utility classes and SHADCN component styling

### Component Architecture
- Create `LayoutComponent.vue` as wrapper for navigation and content
- Move navigation logic from App.vue to LayoutComponent
- Implement theme toggle in navigation
- Use SHADCN Navigation Menu for routing

### Dark/Light Mode Architecture
- Create composable for theme management
- Implement theme toggle button in navigation
- Use SHADCN's dark mode implementation pattern
- Persist theme choice in localStorage

## Performance Considerations
- **Lazy Loading**: Maintain existing route-based code splitting
- **Component Tree Shaking**: SHADCN components import only what's needed
- **CSS Bundle Size**: Tailwind CSS provides smaller bundle with purging
- **Runtime Performance**: SHADCN components are optimized for Vue 3

## Migration Complexity Assessment
- **High Impact**: Complete CSS rewrite required
- **Medium Risk**: Theme system implementation
- **Dependencies**: Need to add multiple new packages
- **Testing Required**: All views and interactions need verification
- **Progressive Migration**: Can be done component by component