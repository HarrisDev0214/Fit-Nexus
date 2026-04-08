<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useColorMode } from '@vueuse/core'

const colorMode = useColorMode()

colorMode.value = 'dark'
</script>

<template>
  <UApp>
    <RouterView />
  </UApp>
</template>

<style scoped>
</style>
