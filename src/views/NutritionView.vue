<template>
    <div class="space-y-5">
  
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
  
        <!-- LEFT COLUMN -->
        <div class="space-y-5">
  
          <!-- Daily goal config -->
          <div class="flora-card">
            <p class="flora-card-title">Meta Diária de Calorias</p>
            <div class="mb-3">
              <label class="flora-label">Meta (kcal)</label>
              <input
                v-model.number="goalInput"
                @change="nutritionStore.setGoal(goalInput)"
                type="number" min="500" max="5000"
                class="flora-input"
                placeholder="Ex: 2000"
              />
            </div>
            <div class="progress-bg mb-2">
              <div
                class="progress-fill"
                :class="{ over: nutritionStore.caloriePercent > 100 }"
                :style="{ width: Math.min(nutritionStore.caloriePercent, 100) + '%' }"
              ></div>
            </div>
            <div class="flex justify-between text-xs text-[#b08090]">
              <span>{{ nutritionStore.todayKcal }} kcal consumidas</span>
              <span>{{ nutritionStore.remaining }} restantes</span>
            </div>
          </div>
  
          <!-- Calorie ring -->
          <div class="flora-card flex flex-col items-center">
            <p class="flora-card-title w-full">Balanço do Dia</p>
            <CalorieRing :percent="nutritionStore.caloriePercent" :size="160" sublabel="consumido">
              <div class="mt-3 text-center">
                <p class="text-sm text-[#6b3a4a] font-semibold">
                  {{ nutritionStore.todayKcal }} / {{ nutritionStore.calorieGoal }} kcal
                </p>
                <div class="mt-2">
                  <span v-if="nutritionStore.caloriePercent >= 100" class="pill pill-rose">⚠️ Meta ultrapassada</span>
                  <span v-else-if="nutritionStore.caloriePercent >= 80"  class="pill pill-amber">⚡ Quase lá!</span>
                  <span v-else class="pill pill-green">✅ No caminho certo</span>
                </div>
              </div>
            </CalorieRing>
          </div>
  
          <!-- Add meal form -->
          <div class="flora-card">
            <p class="flora-card-title">Adicionar Refeição</p>
            <div class="space-y-3 mb-4">
              <div>
                <label class="flora-label">Nome da refeição</label>
                <input
                  v-model="form.name"
                  @keyup.enter="submit"
                  type="text"
                  class="flora-input"
                  placeholder="Ex: Almoço, Lanche da tarde…"
                />
              </div>
              <div>
                <label class="flora-label">Calorias (kcal)</label>
                <input
                  v-model.number="form.kcal"
                  @keyup.enter="submit"
                  type="number" min="1"
                  class="flora-input"
                  placeholder="Ex: 450"
                />
              </div>
            </div>
            <button class="btn-primary w-full justify-center" @click="submit">
              <span>＋</span> Registrar Refeição
            </button>
          </div>
        </div>
  
        <!-- RIGHT COLUMN -->
        <div class="space-y-5">
  
          <!-- Weekly bar chart -->
          <div class="flora-card">
            <p class="flora-card-title">Consumo Semanal</p>
            <div class="relative h-48">
              <canvas ref="chartRef"></canvas>
            </div>
          </div>
  
          <!-- Meal list today -->
          <div class="flora-card flex-1">
            <div class="flex items-center justify-between mb-4">
              <p class="flora-card-title mb-0">
                Refeições de Hoje
                <small class="block font-body text-xs text-[#b08090] font-normal">{{ nutritionStore.todayMeals.length }} registros</small>
              </p>
              <button
                v-if="nutritionStore.todayMeals.length > 0"
                class="btn-ghost btn-sm"
                @click="clearAll"
              >Limpar</button>
            </div>
            <MealList
              :meals="[...nutritionStore.todayMeals].reverse()"
              :deletable="true"
              @delete="handleDelete"
              empty-text="Nenhuma refeição hoje. Adicione a primeira!"
            />
          </div>
  
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, nextTick, inject } from 'vue'
  import Chart from 'chart.js/auto'
  import CalorieRing from '../components/CalorieRing.vue'
  import MealList    from '../components/MealList.vue'
  import { useNutritionStore } from '../stores/nutritionStore.js'
  
  const nutritionStore = useNutritionStore()
  const showToast      = inject('showToast')
  
  const goalInput = ref(nutritionStore.calorieGoal)
  const form      = ref({ name: '', kcal: '' })
  
  function submit() {
    const ok = nutritionStore.addMeal(form.value.name, form.value.kcal)
    if (!ok) { showToast('Preencha nome e calorias!', '⚠️'); return }
    form.value = { name: '', kcal: '' }
    showToast('Refeição registrada! 🍽️')
    nextTick(updateChart)
  }
  
  function handleDelete(id) {
    nutritionStore.deleteMeal(id)
    showToast('Refeição removida', '🗑️')
    nextTick(updateChart)
  }
  
  function clearAll() {
    nutritionStore.clearToday()
    showToast('Refeições de hoje limpas', '🗑️')
    nextTick(updateChart)
  }
  
  // ── Chart ──────────────────────────────────────
  const chartRef = ref(null)
  let chart = null
  
  function updateChart() {
    if (!chartRef.value) return
    const labels = nutritionStore.weeklyDays.map(d => d.name)
    const data   = nutritionStore.weeklyDays.map(d => d.kcal)
    const colors = labels.map((_, i) =>
      i === labels.length - 1 ? 'rgba(249,41,94,.9)' : 'rgba(249,41,94,.30)'
    )
    if (chart) {
      chart.data.labels = labels
      chart.data.datasets[0].data = data
      chart.data.datasets[0].backgroundColor = colors
      chart.update()
      return
    }
    chart = new Chart(chartRef.value, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data, backgroundColor: colors, borderRadius: 8,
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
  
  onMounted(() => nextTick(updateChart))
  watch(() => nutritionStore.allMeals, () => nextTick(updateChart), { deep: true })
  watch(() => nutritionStore.calorieGoal, v => { goalInput.value = v })
  </script>