<script setup lang="ts">
import Card from '@/components/ui/card.vue'
import CardHeader from '@/components/ui/card-header.vue'
import CardTitle from '@/components/ui/card-title.vue'
import CardContent from '@/components/ui/card-content.vue'
import Button from '@/components/ui/button.vue'
import HeroSection from '@/components/HeroSection.vue'
import { Target, Zap, Sparkles, Wrench, Dice6, Library } from 'lucide-vue-next'

const cards = [
  { icon: Target, title: 'What is this app?', delay: 0 },
  { icon: Zap, title: 'How it works', delay: 80 },
  { icon: Sparkles, title: 'Features', delay: 160 },
  { icon: Wrench, title: 'Technology', delay: 240 },
]
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-8 sm:space-y-10">
    <HeroSection
      title="About South Park Random Episode"
      subtitle="Your ultimate companion for discovering South Park episodes"
    />

    <div class="grid gap-5 sm:gap-6">
      <Card
        class="hover:neon-border-primary hover:-translate-y-0.5 transition-all duration-300"
        v-motion
        :initial="{ opacity: 0, y: 16 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, delay: cards[0].delay } }"
      >
        <CardHeader>
          <CardTitle class="flex items-center gap-3 text-base sm:text-lg">
            <Target class="h-5 w-5 shrink-0 text-primary neon-text-primary" />
            What is this app?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-sm sm:text-base text-muted-foreground leading-relaxed">
            South Park Random Episode is a simple web application that helps you discover
            random South Park episodes to watch. Perfect for when you can't decide which
            episode to enjoy!
          </p>
        </CardContent>
      </Card>

      <Card
        class="hover:neon-border-primary hover:-translate-y-0.5 transition-all duration-300"
        v-motion
        :initial="{ opacity: 0, y: 16 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, delay: cards[1].delay } }"
      >
        <CardHeader>
          <CardTitle class="flex items-center gap-3 text-base sm:text-lg">
            <Zap class="h-5 w-5 shrink-0 text-primary neon-text-primary" />
            How it works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol class="list-decimal list-inside space-y-2.5 text-sm sm:text-base text-muted-foreground">
            <li>Click the "Get Random Episode" button on the home page</li>
            <li>Get a randomly selected episode number</li>
            <li>View episode details or browse all episodes</li>
            <li>Enjoy watching!</li>
          </ol>
        </CardContent>
      </Card>

      <Card
        class="hover:neon-border-primary hover:-translate-y-0.5 transition-all duration-300"
        v-motion
        :initial="{ opacity: 0, y: 16 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, delay: cards[2].delay } }"
      >
        <CardHeader>
          <CardTitle class="flex items-center gap-3 text-base sm:text-lg">
            <Sparkles class="h-5 w-5 shrink-0 text-primary neon-text-primary" />
            Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul class="list-disc list-inside space-y-2.5 text-sm sm:text-base text-muted-foreground">
            <li>Random episode generator</li>
            <li>Browse all episodes with search</li>
            <li>Detailed episode information</li>
            <li>Dark/Light mode toggle</li>
            <li>Responsive design for all devices</li>
            <li>Loading skeletons for better UX</li>
          </ul>
        </CardContent>
      </Card>

      <Card
        class="hover:neon-border-primary hover:-translate-y-0.5 transition-all duration-300"
        v-motion
        :initial="{ opacity: 0, y: 16 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 400, delay: cards[3].delay } }"
      >
        <CardHeader>
          <CardTitle class="flex items-center gap-3 text-base sm:text-lg">
            <Wrench class="h-5 w-5 shrink-0 text-primary neon-text-primary" />
            Technology
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <p class="text-sm sm:text-base text-muted-foreground">
              Built with modern web technologies for the best user experience:
            </p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div class="text-center p-4 glass-card rounded-xl hover:neon-border-primary transition-all duration-300">
                <div class="font-semibold text-sm sm:text-base text-primary">Vue 3</div>
                <div class="text-xs text-muted-foreground mt-1">Framework</div>
              </div>
              <div class="text-center p-4 glass-card rounded-xl hover:neon-border-primary transition-all duration-300">
                <div class="font-semibold text-sm sm:text-base text-primary">TypeScript</div>
                <div class="text-xs text-muted-foreground mt-1">Language</div>
              </div>
              <div class="text-center p-4 glass-card rounded-xl hover:neon-border-primary transition-all duration-300">
                <div class="font-semibold text-sm sm:text-base text-primary">Vite</div>
                <div class="text-xs text-muted-foreground mt-1">Build Tool</div>
              </div>
              <div class="text-center p-4 glass-card rounded-xl hover:neon-border-primary transition-all duration-300">
                <div class="font-semibold text-sm sm:text-base text-primary">SHADCN/ui</div>
                <div class="text-xs text-muted-foreground mt-1">UI Library</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="text-center space-y-4 pt-6 sm:pt-8">
      <!-- Neon gradient separator -->
      <div class="w-1/3 mx-auto h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
      <p class="text-sm sm:text-base text-muted-foreground pt-2">Ready to find your next episode?</p>
      <div class="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center">
        <RouterLink to="/" class="block sm:inline-block">
          <Button size="lg" class="w-full sm:w-auto flex items-center justify-center gap-2">
            <Dice6 class="h-5 w-5" />
            Get Random Episode
          </Button>
        </RouterLink>
        <RouterLink to="/episodes" class="block sm:inline-block">
          <Button variant="outline" size="lg" class="w-full sm:w-auto flex items-center justify-center gap-2">
            <Library class="h-5 w-5" />
            Browse All Episodes
          </Button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
