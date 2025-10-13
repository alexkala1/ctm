<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div class="container mx-auto px-4 py-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Modern UI Components Demo
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Showcasing glassmorphism, neumorphism, and modern design elements
        </p>
      </div>

      <!-- Modern Cards Section -->
      <div class="mb-16">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">✨ Modern Cards</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Glassmorphism Card -->
          <UiModernCard 
            variant="glass" 
            color="blue" 
            size="md" 
            interactive 
            hover
            class="group"
          >
            <template #header>
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-white/20 dark:bg-white/10 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm">
                  <span class="text-2xl">🔮</span>
                </div>
                <h3 class="text-2xl font-bold">Glassmorphism</h3>
              </div>
            </template>
            <template #content>
              <p class="text-lg mb-6 leading-relaxed">
                Beautiful glassmorphism effect with backdrop blur and transparency that creates depth.
              </p>
            </template>
            <template #footer>
              <UiThemedButton 
                color="info" 
                variant="soft" 
                size="md"
              >
                Learn More →
              </UiThemedButton>
            </template>
          </UiModernCard>

          <!-- Neumorphism Card -->
          <UiModernCard 
            variant="neumorphism" 
            color="gray" 
            size="md" 
            interactive 
            hover
            class="group"
          >
            <template #header>
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center mr-4 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.1)]">
                  <span class="text-2xl">🎯</span>
                </div>
                <h3 class="text-2xl font-bold">Neumorphism</h3>
              </div>
            </template>
            <template #content>
              <p class="text-lg mb-6 leading-relaxed">
                Soft UI with subtle shadows creating a tactile, embossed feel that's modern and elegant.
              </p>
            </template>
            <template #footer>
              <UiThemedButton 
                color="secondary" 
                variant="soft" 
                size="md"
              >
                Explore →
              </UiThemedButton>
            </template>
          </UiModernCard>

          <!-- Gradient Card -->
          <UiModernCard 
            variant="gradient" 
            color="emerald" 
            size="md" 
            interactive 
            hover
            class="group"
          >
            <template #header>
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm">
                  <span class="text-2xl">🌈</span>
                </div>
                <h3 class="text-2xl font-bold text-white">Gradient Magic</h3>
              </div>
            </template>
            <template #content>
              <p class="text-white/90 text-lg mb-6 leading-relaxed">
                Vibrant gradient background with modern styling that creates visual impact and energy.
              </p>
            </template>
            <template #footer>
              <UiThemedButton 
                color="primary" 
                variant="outline" 
                size="md"
              >
                Get Started →
              </UiThemedButton>
            </template>
          </UiModernCard>
        </div>
      </div>

      <!-- Buttons Section -->
      <div class="mb-16">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">🚀 Modern Buttons</h2>
        <div class="flex flex-wrap gap-6 justify-center">
          <!-- Primary Button -->
          <UiThemedButton 
            color="primary" 
            variant="solid" 
            size="md"
          >
            Primary Action
          </UiThemedButton>

          <!-- Success Button -->
          <UiThemedButton 
            color="success" 
            variant="solid" 
            size="md"
          >
            Success Action
          </UiThemedButton>

          <!-- Outline Button -->
          <UiThemedButton 
            color="primary" 
            variant="outline" 
            size="md"
          >
            Outline Style
          </UiThemedButton>

          <!-- Soft Button -->
          <UiThemedButton 
            color="info" 
            variant="soft" 
            size="md"
          >
            Soft Touch
          </UiThemedButton>

          <!-- Ghost Button -->
          <UiThemedButton 
            color="warning" 
            variant="ghost" 
            size="md"
          >
            Ghost Style
          </UiThemedButton>
        </div>
      </div>

      <!-- Status Badges Section -->
      <div class="mb-16">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">🏷️ Status Badges</h2>
        <div class="flex flex-wrap gap-6 justify-center">
          <!-- Pending Badge -->
          <UiStatusBadge 
            status="PENDING" 
            variant="soft" 
            size="md"
          />

          <!-- Approved Badge -->
          <UiStatusBadge 
            status="APPROVED" 
            variant="solid" 
            size="md"
          />

          <!-- Rejected Badge -->
          <UiStatusBadge 
            status="REJECTED" 
            variant="outline" 
            size="md"
          />

          <!-- In Progress Badge -->
          <UiStatusBadge 
            status="IN_PROGRESS" 
            variant="soft" 
            size="md"
          />

          <!-- Finished Badge -->
          <UiStatusBadge 
            status="FINISHED" 
            variant="solid" 
            size="md"
          />
        </div>
      </div>

      <!-- Alerts Section -->
      <div class="mb-16">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">🚨 Modern Alerts</h2>
        <div class="space-y-6 max-w-4xl mx-auto">
          <!-- Default UAlert Components with Modern Design -->
          <UAlert
            color="success"
            icon="i-heroicons-check-circle"
            title="Success!"
            description="Your action was completed successfully with modern styling."
          />

          <UAlert
            color="warning"
            icon="i-heroicons-exclamation-triangle"
            title="Warning"
            description="Please review your input before proceeding with enhanced visual feedback."
          />

          <UAlert
            color="error"
            icon="i-heroicons-x-circle"
            title="Error"
            description="Something went wrong. Please try again with modern error handling."
          />

          <UAlert
            color="info"
            icon="i-heroicons-information-circle"
            title="Information"
            description="Here's some helpful information for you with beautiful modern styling."
          />

          <UAlert
            color="primary"
            icon="i-heroicons-star"
            title="Primary Alert"
            description="This is a primary alert with the modern glassmorphism design."
          />

          <UAlert
            color="secondary"
            icon="i-heroicons-heart"
            title="Secondary Alert"
            description="This is a secondary alert showcasing the purple gradient theme."
          />
        </div>
      </div>

      <!-- Interactive Demo -->
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-6">🎨 Interactive Demo</h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
          Hover over the elements to see the modern animations and effects in action. Experience the power of contemporary design!
        </p>
        <div class="flex justify-center">
          <UiThemedButton 
            color="primary" 
            variant="solid" 
            size="xl"
            class="animate-pulse"
          >
            <template #icon>
              <span class="text-3xl">✨</span>
            </template>
            Modern UI Magic
            <template #trailing>
              <span class="text-3xl">✨</span>
            </template>
          </UiThemedButton>
        </div>
        
        <!-- Floating Elements -->
        <div class="mt-16 relative">
          <div class="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-bounce" />
          <div
            class="absolute -top-4 -right-12 w-12 h-12 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-30 animate-bounce"
            style="animation-delay: 0.5s;"
          />
          <div
            class="absolute -bottom-4 -left-12 w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-25 animate-bounce"
            style="animation-delay: 1s;"
          />
          <div
            class="absolute -bottom-8 -right-8 w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-bounce"
            style="animation-delay: 1.5s;"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// This page demonstrates the modern UI components
</script>
