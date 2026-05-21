<template>
  <div h-screen mx-a max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0 font-sans>
    <TheHeader />
    <main min-h="[calc(100vh-290px)]">
      <slot />
    </main>
    <TheFooter />
    <!-- <Plum /> -->
    <div v-if="ready && width > 1000">
      <Sun v-if="theme !== 'dark'" v-motion-roll-visible-right />
      <!-- <StarSky v-show="theme === 'dark'" /> -->
      <Moon v-else v-motion-roll-visible-right />
    </div>
  </div>
</template>

<script setup lang="ts">
import useTheme from '~/composables/useTheme'

const { theme, ready } = useTheme()

const { width } = useWindowSize()
</script>
