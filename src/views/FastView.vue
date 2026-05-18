<template>
    <div class="space-y-5">
  
      <!-- Hero banner -->
      <div class="relative overflow-hidden rounded-3xl p-8 md:p-10 text-white
                  bg-gradient-to-br from-rose-500 via-rose-400 to-[#ff8ba0]
                  flex flex-col md:flex-row items-center justify-between gap-8">
  
        <!-- Decorative circles -->
        <div class="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-white/10 pointer-events-none"></div>
        <div class="absolute -bottom-16 left-1/3 w-40 h-40 rounded-full bg-white/8 pointer-events-none"></div>
  
        <div class="relative z-10 text-center md:text-left">
          <p class="text-sm font-medium opacity-80 mb-1">
            {{ fastStore.fastingActive ? 'Jejum em andamento' : 'Pronto para jejuar?' }}
          </p>
          <div class="font-display text-5xl md:text-6xl font-semibold tracking-tight">
            {{ fastStore.fastingActive ? fastStore.timerDisplay : '00:00:00' }}
          </div>
          <p class="text-sm opacity-75 mt-2" v-if="fastStore.fastingActive">
            Meta: {{ fastStore.selectedWindow }} &nbsp;·&nbsp; {{ fastStore.fastProgressLabel }}
          </p>
          <p class="text-sm opacity-75 mt-2" v-else>Escolha uma janela abaixo e comece</p>
        </div>
  
        <!-- Start / Stop circle -->
        <div class="relative z-10 flex-shrink-0">
          <button
            @click="toggleFast"
            class="w-36 h-36 rounded-full bg-white/15 hover:bg-white/25 transition-all duration-200
                   flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95"
          >
            <span class="text-3xl">{{ fastStore.fastingActive ? '⏹' : '▶' }}</span>
            <span class="text-xs font-bold tracking-widest uppercase">
              {{ fastStore.fastingActive ? 'Parar' : 'Iniciar' }}
            </span>
          </button>
        </div>
      </div>
  
      <!-- Window selector + progress -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
  
        <!-- Window picker -->
        <div class="flora-card">
          <p class="flora-card-title">Janela de Jejum</p>
          <div class="flex flex-wrap gap-2 mb-4">
            <button
              v-for="w in fastStore.WINDOWS"
              :key="w.label"
              @click="fastStore.setWindow(w.label)"
              :disabled="fastStore.fastingActive"
              class="px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-150
                     disabled:opacity-50 disabled:cursor-not-allowed"
              :class="fastStore.selectedWindow === w.label
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-white text-[#6b3a4a] border-rose-200 hover:border-rose-400 hover:text-rose-500'"
            >
              {{ w.label }}
            </button>
  
            <button
              @click="openCustom"
              :disabled="fastStore.fastingActive"
              class="px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-150
                     disabled:opacity-50 disabled:cursor-not-allowed"
              :class="fastStore.selectedWindow === 'Personalizado'
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-white text-[#6b3a4a] border-rose-200 hover:border-rose-400 hover:text-rose-500'"
            >
              ✏️ Personalizado
            </button>
          </div>
  
          <div v-if="fastStore.windowObj" class="pill pill-rose">
            🕐 Jejum: {{ fastStore.windowObj.fast }}h &nbsp;|&nbsp; 🍽️ Alimentação: {{ fastStore.windowObj.eat }}h
          </div>
        </div>
  
        <!-- Progress arc -->
        <div class="flora-card flex flex-col items-center justify-center text-center">
          <p class="flora-card-title w-full text-left">Progresso</p>
          <svg viewBox="0 0 200 112" class="w-full max-w-[260px]">
            <path d="M20 100 A80 80 0 0 1 180 100"
              fill="none" stroke="#ffe0e8" stroke-width="14" stroke-linecap="round"/>
            <path d="M20 100 A80 80 0 0 1 180 100"
              fill="none" stroke="#f9295e" stroke-width="14" stroke-linecap="round"
              :stroke-dasharray="251"
              :stroke-dashoffset="251 - (fastStore.fastProgress / 100) * 251"
              style="transition: stroke-dashoffset .6s ease"/>
            <text x="100" y="88" text-anchor="middle"
              font-family="DM Sans" font-size="22" font-weight="700" fill="#f9295e">
              {{ Math.round(fastStore.fastProgress) }}%
            </text>
          </svg>
          <p class="text-xs text-[#b08090] mt-1">{{ fastStore.fastProgressLabel }}</p>
        </div>
      </div>
  
      <!-- History -->
      <div class="flora-card">
        <p class="flora-card-title">Histórico de Jejuns<br><small class="font-body text-xs text-[#b08090] font-normal">Seus registros anteriores</small></p>
  
        <div v-if="fastStore.fastHistory.length === 0" class="empty-state">
          <span class="text-5xl mb-2">🌙</span>
          <p class="text-sm">Nenhum jejum concluído ainda</p>
        </div>
  
        <div v-else class="divide-y divide-rose-100 max-h-80 overflow-y-auto">
          <div
            v-for="f in [...fastStore.fastHistory].reverse()"
            :key="f.id"
            class="flex items-center gap-3 py-3"
          >
            <div class="w-2.5 h-2.5 rounded-full flex-shrink-0"
              :class="f.completed >= f.target * 0.8 ? 'bg-rose-400' : 'bg-rose-200'">
            </div>
            <span class="text-xs text-[#b08090] w-24 flex-shrink-0">{{ f.date }}</span>
            <span class="text-sm font-semibold text-[#1a0a10] flex-1">{{ f.window }}</span>
            <span class="text-sm text-[#6b3a4a]">{{ f.duration }}</span>
            <span v-if="f.completed >= f.target * 0.8" class="pill pill-green">✓</span>
            <span v-else class="pill pill-amber">parcial</span>
          </div>
        </div>
      </div>
  
    </div>
  
    <!-- Custom window modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a0a10]/30 backdrop-blur-sm"
          @click.self="showModal = false">
          <div class="bg-white rounded-3xl p-8 w-full max-w-sm shadow-rose-lg">
            <h3 class="font-display text-2xl mb-1">Janela Personalizada 🕐</h3>
            <p class="text-sm text-[#b08090] mb-6">Jejum + Alimentação deve somar 24 horas</p>
  
            <div class="grid grid-cols-2 gap-4 mb-2">
              <div>
                <label class="flora-label">Horas de Jejum</label>
                <input v-model.number="customFast" type="number" class="flora-input" min="1" max="23" placeholder="16"/>
              </div>
              <div>
                <label class="flora-label">Horas de Alimentação</label>
                <input v-model.number="customEat" type="number" class="flora-input" min="1" max="23" placeholder="8"/>
              </div>
            </div>
  
            <p v-if="customFast + customEat !== 24" class="pill pill-amber mb-4 mt-2">
              ⚠️ Total atual: {{ customFast + customEat }}h (precisa ser 24h)
            </p>
  
            <div class="flex gap-3 mt-6">
              <button class="btn-ghost flex-1 justify-center" @click="showModal = false">Cancelar</button>
              <button
                class="btn-primary flex-1 justify-center"
                :disabled="customFast + customEat !== 24"
                @click="applyCustom"
              >Aplicar</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup>
  import { ref, inject } from 'vue'
  import { useFastStore } from '../stores/fastStore.js'
  
  const fastStore  = useFastStore()
  const showToast  = inject('showToast')
  
  const showModal  = ref(false)
  const customFast = ref(16)
  const customEat  = ref(8)
  
  function toggleFast() {
    if (fastStore.fastingActive) {
      const dur = fastStore.stopFast()
      showToast(`Jejum concluído! ${dur} 🎉`, '🎉')
    } else {
      fastStore.startFast()
      showToast('Jejum iniciado! 🌙', '🌙')
    }
  }
  
  function openCustom() {
    showModal.value = true
  }
  
  function applyCustom() {
    if (customFast.value + customEat.value !== 24) return
    fastStore.setCustomWindow(customFast.value, customEat.value)
    showModal.value = false
    showToast(`Janela ${customFast.value}:${customEat.value} aplicada! ✨`)
  }
  </script>
  
  <style scoped>
  .modal-enter-active, .modal-leave-active { transition: all .22s ease; }
  .modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(.95); }
  </style>