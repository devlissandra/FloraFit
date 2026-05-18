<template>
    <div class="space-y-5">
  
      <!-- Stat row -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="s in stats" :key="s.label" class="flora-card flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            :class="s.bg">{{ s.icon }}</div>
          <div>
            <p class="text-[11px] text-[#b08090] font-medium">{{ s.label }}</p>
            <p class="text-xl font-bold text-[#1a0a10] leading-tight">
              {{ s.value }}<span class="text-xs font-normal text-[#b08090] ml-1">{{ s.unit }}</span>
            </p>
          </div>
        </div>
      </div>
  
      <!-- Main grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
  
        <!-- Calorie ring -->
        <div class="flora-card flex flex-col items-center">
          <p class="flora-card-title w-full">Progresso Calórico</p>
          <CalorieRing :percent="nutritionStore.caloriePercent" :size="150" sublabel="consumido">
            <div class="mt-3 text-center">
              <p class="text-sm text-[#6b3a4a]">
                {{ nutritionStore.todayKcal }} / {{ nutritionStore.calorieGoal }} kcal
              </p>
              <span v-if="nutritionStore.caloriePercent >= 100" class="pill pill-rose mt-2">⚠️ Meta atingida</span>
              <span v-else class="pill pill-green mt-2">✅ {{ nutritionStore.remaining }} kcal restantes</span>
            </div>
          </CalorieRing>
        </div>
  
        <!-- Weekly chart -->
        <div class="flora-card lg:col-span-2">
          <p class="flora-card-title">Calorias — Últimos 7 dias</p>
          <div class="relative h-44">
            <canvas ref="chartRef"></canvas>
          </div>
        </div>
  
        <!-- Fast status -->
        <div class="flora-card flex flex-col items-center justify-center text-center gap-3">
          <p class="flora-card-title w-full">Status do Jejum</p>
          <span class="text-5xl">{{ fastStore.fastingActive ? '🌙' : '☀️' }}</span>
          <p class="text-2xl font-bold text-[#1a0a10]">
            {{ fastStore.fastingActive ? fastStore.timerDisplay : 'Inativo' }}
          </p>
          <p class="text-xs text-[#b08090]">
            {{ fastStore.fastingActive ? 'Janela: ' + fastStore.selectedWindow : 'Nenhum jejum ativo' }}
          </p>
          <RouterLink to="/jejum" class="btn-primary btn-sm">
            {{ fastStore.fastingActive ? 'Ver progresso' : 'Iniciar jejum' }}
          </RouterLink>
        </div>
  
        <!-- Recent meals -->
        <div class="flora-card lg:col-span-2">
          <div class="flex items-center justify-between mb-4">
            <p class="flora-card-title mb-0">Refeições de Hoje</p>
            <RouterLink to="/nutricao" class="text-xs text-rose-500 font-semibold hover:underline">Ver tudo</RouterLink>
          </div>
          <MealList
            :meals="nutritionStore.todayMeals.slice().reverse().slice(0, 5)"
            :deletable="false"
            empty-text="Nenhuma refeição hoje. Adicione na aba Nutrição!"
          />
        </div>
  
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch, nextTick } from 'vue'
  import { RouterLink } from 'vue-router'
  import Chart from 'chart.js/auto'
  import CalorieRing from '../components/CalorieRing.vue'
  import MealList    from '../components/MealList.vue'
  import { useFastStore }      from '../stores/fastStore.js'
  import { useNutritionStore } from '../stores/nutritionStore.js'
  
  const fastStore      = useFastStore()
  const nutritionStore = useNutritionStore()
  
  // ── Stats ──────────────────────────────────────
  const stats = computed(() => [
    { icon: '🔥', label: 'Calorias hoje',     value: nutritionStore.todayKcal,            unit: 'kcal',      bg: 'bg-rose-100'    },
    { icon: '⏳', label: 'Jejum ativo',        value: fastStore.fastingActive ? fastStore.timerDisplay : '—', unit: '', bg: 'bg-amber-50'   },
    { icon: '🎯', label: 'Meta calórica',      value: nutritionStore.calorieGoal,          unit: 'kcal',      bg: 'bg-emerald-50'  },
    { icon: '📋', label: 'Jejuns completos',   value: fastStore.fastHistory.length,        unit: 'registros', bg: 'bg-blue-50'     },
  ])
  
  // ── Chart ──────────────────────────────────────
  const chartRef = ref(null)
  let chart = null
  
  function buildChart() {
    if (!chartRef.value) return
    const labels = nutritionStore.weeklyDays.map(d => d.name)
    const data   = nutritionStore.weeklyDays.map(d => d.kcal)
    if (chart) { chart.data.labels = labels; chart.data.datasets[0].data = data; chart.update(); return }
    chart = new Chart(chartRef.value, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data,
          borderColor: '#f9295e',
          backgroundColor: 'rgba(249,41,94,.10)',
          borderWidth: 2.5,
          fill: true,
          tension: .4,
          pointBackgroundColor: '#f9295e',
          pointRadius: 5,
          pointHoverRadius: 7,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 11 }, color: '#b08090' } },
          y: { grid: { color: '#ffe0e8' }, ticks: { font: { family: 'DM Sans', size: 11 }, color: '#b08090' } },
        },
      },
    })
  }
  
  onMounted(() => nextTick(buildChart))
  watch(() => nutritionStore.allMeals, () => nextTick(buildChart), { deep: true })
  </script>