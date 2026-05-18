<template>
    <div class="space-y-5">
  
      <!-- Summary stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="flora-card text-center" v-for="s in summaryStats" :key="s.label">
          <div class="text-4xl mb-2">{{ s.icon }}</div>
          <p class="text-2xl font-bold text-[#1a0a10]">
            {{ s.value }}<span class="text-sm font-normal text-[#b08090] ml-1">{{ s.unit }}</span>
          </p>
          <p class="text-xs text-[#b08090] mt-1">{{ s.label }}</p>
        </div>
      </div>
  
      <!-- Charts row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
  
        <!-- Bar chart -->
        <div class="flora-card">
          <p class="flora-card-title">Calorias por Dia<br><small class="font-body text-xs text-[#b08090] font-normal">Últimos 7 dias</small></p>
          <div class="relative h-52">
            <canvas ref="barRef"></canvas>
          </div>
        </div>
  
        <!-- Day breakdown table -->
        <div class="flora-card">
          <p class="flora-card-title">Resumo por Dia</p>
          <div class="divide-y divide-rose-100">
            <div v-for="d in nutritionStore.weeklyDays" :key="d.key" class="flex items-center gap-3 py-2.5">
              <span class="text-[11px] font-bold text-[#b08090] uppercase w-8 flex-shrink-0">{{ d.name }}</span>
              <div class="flex-1">
                <div class="progress-bg h-2">
                  <div class="progress-fill h-full"
                    :style="{ width: (d.kcal / Math.max(...nutritionStore.weeklyDays.map(x => x.kcal), 1) * 100) + '%' }">
                  </div>
                </div>
              </div>
              <span class="text-xs text-[#6b3a4a] font-semibold w-16 text-right flex-shrink-0">{{ d.kcal }} kcal</span>
              <span class="text-xs text-rose-500 font-bold w-10 text-right flex-shrink-0">{{ fastHoursForDay(d.key) }}h</span>
            </div>
          </div>
          <p class="text-[10px] text-[#b08090] mt-3 text-right">colunas: kcal · rosa: h de jejum</p>
        </div>
      </div>
  
      <!-- History row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
  
        <!-- Fast history -->
        <div class="flora-card">
          <p class="flora-card-title">Histórico de Jejuns</p>
          <div v-if="fastStore.fastHistory.length === 0" class="empty-state">
            <span class="text-4xl mb-2">🌙</span>
            <p class="text-sm">Nenhum jejum registrado ainda</p>
          </div>
          <div v-else class="divide-y divide-rose-100 max-h-72 overflow-y-auto">
            <div v-for="f in [...fastStore.fastHistory].reverse()" :key="f.id"
              class="flex items-center gap-3 py-3">
              <div class="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0"></div>
              <span class="text-xs text-[#b08090] w-24 flex-shrink-0">{{ f.date }}</span>
              <span class="text-sm font-semibold text-[#1a0a10] flex-1">{{ f.window }}</span>
              <span class="text-sm text-[#6b3a4a]">{{ f.duration }}</span>
            </div>
          </div>
        </div>
  
        <!-- Meal history -->
        <div class="flora-card">
          <p class="flora-card-title">Histórico de Refeições</p>
          <MealList
            :meals="[...nutritionStore.allMeals].reverse().slice(0, 25)"
            :deletable="false"
            :show-date="true"
            empty-text="Nenhuma refeição registrada ainda"
          />
        </div>
      </div>
  
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, nextTick } from 'vue'
  import Chart from 'chart.js/auto'
  import MealList from '../components/MealList.vue'
  import { useFastStore }      from '../stores/fastStore.js'
  import { useNutritionStore } from '../stores/nutritionStore.js'
  
  const fastStore      = useFastStore()
  const nutritionStore = useNutritionStore()
  
  // ── Summary stats ──────────────────────────────
  const summaryStats = computed(() => [
    {
      icon: '🔥', label: 'Média diária de calorias',
      value: nutritionStore.weeklyAvgKcal, unit: 'kcal',
    },
    {
      icon: '⏳', label: 'Total de horas em jejum',
      value: fastStore.fastHistory.reduce((s, f) => s + (f.completedH || 0), 0).toFixed(1),
      unit: 'h',
    },
    {
      icon: '📅', label: 'Jejuns realizados',
      value: fastStore.fastHistory.length, unit: 'registros',
    },
  ])
  
  function fastHoursForDay(dateKey) {
    return fastStore.fastHistory
      .filter(f => f.date === dateKey)
      .reduce((s, f) => s + (f.completedH || 0), 0)
      .toFixed(1)
  }
  
  // ── Bar chart ──────────────────────────────────
  const barRef = ref(null)
  let barChart = null
  
  onMounted(() => nextTick(() => {
    if (!barRef.value) return
    const labels = nutritionStore.weeklyDays.map(d => d.name)
    const data   = nutritionStore.weeklyDays.map(d => d.kcal)
    barChart = new Chart(barRef.value, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'kcal',
          data,
          backgroundColor: 'rgba(249,41,94,.50)',
          borderColor: '#f9295e',
          borderWidth: 1.5,
          borderRadius: 10,
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
  }))
  </script>