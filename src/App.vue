<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import { RouterView } from 'vue-router'

const route = useRoute()
const isCommandRoute = computed(() => route.path.startsWith('/ue-stc'))
</script>

<template>
  <div class="app-layout">
    <template v-if="!isCommandRoute">
      <SiteHeader />
      <main class="main-content">
        <RouterView />
      </main>
      <SiteFooter />
    </template>
    <template v-else>
      <RouterView />
    </template>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1.25rem;
}
</style>
