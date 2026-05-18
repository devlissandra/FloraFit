import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNutritionStore = defineStore('nutrition', () => {

  // ── State ────────────────────────────────────────
  const allMeals    = ref([])   // { id, name, kcal, date, time }
  const calorieGoal = ref(2000)

  // ── Computed ─────────────────────────────────────
  const todayKey = computed(() => new Date().toISOString().slice(0, 10))

  const todayMeals = computed(() =>
    allMeals.value.filter(m => m.date === todayKey.value)
  )

  const todayKcal = computed(() =>
    todayMeals.value.reduce((s, m) => s + m.kcal, 0)
  )

  const caloriePercent = computed(() =>
    calorieGoal.value > 0
      ? Math.round((todayKcal.value / calorieGoal.value) * 100)
      : 0
  )

  const remaining = computed(() =>
    Math.max(0, calorieGoal.value - todayKcal.value)
  )

  // Last 7 days summary
  const weeklyDays = computed(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d   = new Date()
      d.setDate(d.getDate() - i)
      const key  = d.toISOString().slice(0, 10)
      const name = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
      const kcal = allMeals.value
        .filter(m => m.date === key)
        .reduce((s, m) => s + m.kcal, 0)
      days.push({ key, name, kcal })
    }
    return days
  })

  const weeklyAvgKcal = computed(() => {
    const active = weeklyDays.value.filter(d => d.kcal > 0)
    if (!active.length) return 0
    return Math.round(active.reduce((s, d) => s + d.kcal, 0) / active.length)
  })

  // ── Helpers ──────────────────────────────────────
  function mealEmoji(name = '') {
    const n = name.toLowerCase()
    if (n.includes('café') || n.includes('cafe') || n.includes('manhã')) return '☕'
    if (n.includes('almoço') || n.includes('almoco'))  return '🍽️'
    if (n.includes('janta'))   return '🌙'
    if (n.includes('lanche'))  return '🥪'
    if (n.includes('fruta'))   return '🍎'
    if (n.includes('suco'))    return '🥤'
    if (n.includes('salada'))  return '🥗'
    if (n.includes('shake') || n.includes('protein')) return '💪'
    return '🍴'
  }

  // ── Actions ──────────────────────────────────────
  function addMeal(name, kcal) {
    if (!name || !kcal || kcal <= 0) return false
    const now = new Date()
    allMeals.value.push({
      id:   Date.now(),
      name,
      kcal: Number(kcal),
      date: now.toISOString().slice(0, 10),
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    })
    persist()
    return true
  }

  function deleteMeal(id) {
    allMeals.value = allMeals.value.filter(m => m.id !== id)
    persist()
  }

  function clearToday() {
    allMeals.value = allMeals.value.filter(m => m.date !== todayKey.value)
    persist()
  }

  function setGoal(g) {
    calorieGoal.value = Number(g)
    persist()
  }

  // ── Persistence ──────────────────────────────────
  function persist() {
    localStorage.setItem('florafit_nutrition', JSON.stringify({
      allMeals:    allMeals.value,
      calorieGoal: calorieGoal.value,
    }))
  }

  function load() {
    try {
      const raw = localStorage.getItem('florafit_nutrition')
      if (!raw) return
      const d = JSON.parse(raw)
      if (d.allMeals)    allMeals.value    = d.allMeals
      if (d.calorieGoal) calorieGoal.value = d.calorieGoal
    } catch (e) { console.warn('nutritionStore load error', e) }
  }

  return {
    allMeals, calorieGoal, todayKey,
    todayMeals, todayKcal, caloriePercent, remaining,
    weeklyDays, weeklyAvgKcal,
    mealEmoji, addMeal, deleteMeal, clearToday, setGoal, persist, load,
  }
})