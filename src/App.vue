<template>
  <div class="flex min-h-screen bg-cream font-body">

    <!-- Sidebar -->
    <AppSidebar />

    <!-- Page content -->
    <main class="flex-1 ml-[88px] md:ml-[88px] mb-[70px] md:mb-0 p-6 md:p-10 min-h-screen">

      <!-- Top bar -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <p class="text-xs text-[#b08090] font-semibold uppercase tracking-wider">{{ greetingTime }}</p>
          <h1 class="font-display text-2xl md:text-3xl text-[#1a0a10] leading-tight mt-0.5">
            Bem-vinda, <span class="text-rose-500">Florzinha 🌸</span>
          </h1>
        </div>
        <div class="flex items-center gap-3">
          <span class="hidden sm:inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 text-xs font-medium text-[#6b3a4a] shadow-rose">
            📅 {{ todayLabel }}
          </span>
          <div class="w-11 h-11 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-bold text-base shadow-rose cursor-pointer select-none">
            F
          </div>
        </div>
      </div>

<!-- Router view com transition -->
<RouterView v-slot="{ Component }">
  <Transition name="page" mode="out-in">
    <div :key="$route.path">
      <component :is="Component" />
    </div>
  </Transition>
</RouterView>

    </main>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1a0a10] text-white px-5 py-3.5 rounded-2xl shadow-rose-lg text-sm font-medium">
        <span class="text-lg">{{ toast.icon }}</span>
        {{ toast.msg }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, provide, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'
import { useFastStore }      from './stores/fastStore.js'
import { useNutritionStore } from './stores/nutritionStore.js'

// ── Load stores from localStorage on boot ──
const fastStore      = useFastStore()
const nutritionStore = useNutritionStore()
onMounted(() => {
  fastStore.load()
  nutritionStore.load()
})

// ── Toast ─────────────────────────────────
const toast = ref({ show: false, msg: '', icon: '✅' })

function showToast(msg, icon = '✅') {
  toast.value = { show: true, msg, icon }
  setTimeout(() => { toast.value.show = false }, 2800)
}

// Provide toast globally so any child can call it
provide('showToast', showToast)

// ── Greeting ──────────────────────────────
const greetingTime = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia ☀️'
  if (h < 18) return 'Boa tarde 🌤️'
  return 'Boa noite 🌙'
})

const todayLabel = computed(() =>
  new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
)
</script>

<style>
.toast-enter-active, .toast-leave-active { transition: all .25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
</style>