import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFastStore = defineStore('fast', () => {

  // ── State ────────────────────────────────────────
  const fastingActive  = ref(false)
  const fastStart      = ref(null)   // timestamp ms
  const fastElapsed    = ref(0)      // seconds
  const selectedWindow = ref('16:8')
  const customWindow   = ref(null)   // { fast: N, eat: N }
  const fastHistory    = ref([])

  let _interval = null

  // ── Predefined windows ───────────────────────────
  const WINDOWS = [
    { label: '16:8',  fast: 16, eat: 8  },
    { label: '18:6',  fast: 18, eat: 6  },
    { label: '20:4',  fast: 20, eat: 4  },
    { label: '14:10', fast: 14, eat: 10 },
  ]

  // ── Computed ─────────────────────────────────────
  const windowObj = computed(() => {
    if (selectedWindow.value === 'Personalizado' && customWindow.value)
      return customWindow.value
    return WINDOWS.find(w => w.label === selectedWindow.value) ?? WINDOWS[0]
  })

  const targetSeconds = computed(() => (windowObj.value?.fast ?? 16) * 3600)

  const timerDisplay = computed(() => {
    const s   = fastElapsed.value
    const hh  = String(Math.floor(s / 3600)).padStart(2, '0')
    const mm  = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
    const ss  = String(s % 60).padStart(2, '0')
    return `${hh}:${mm}:${ss}`
  })

  const fastProgress = computed(() => {
    if (!fastingActive.value || targetSeconds.value === 0) return 0
    return Math.min((fastElapsed.value / targetSeconds.value) * 100, 100)
  })

  const fastProgressLabel = computed(() => {
    const rem = Math.max(0, targetSeconds.value - fastElapsed.value)
    const h   = Math.floor(rem / 3600)
    const m   = Math.floor((rem % 3600) / 60)
    if (fastElapsed.value >= targetSeconds.value) return '🎉 Meta de jejum atingida!'
    return `${h}h ${m}min restantes`
  })

  const todayKey = computed(() => new Date().toISOString().slice(0, 10))

  // ── Actions ──────────────────────────────────────
  function startFast() {
    if (fastingActive.value) return
    fastingActive.value = true
    fastStart.value     = Date.now() - fastElapsed.value * 1000
    _interval = setInterval(() => {
      fastElapsed.value = Math.floor((Date.now() - fastStart.value) / 1000)
    }, 1000)
    persist()
  }

  function stopFast() {
    if (!fastingActive.value) return
    clearInterval(_interval)
    _interval = null

    const elapsed = fastElapsed.value
    const hh = String(Math.floor(elapsed / 3600)).padStart(2, '0')
    const mm = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0')

    fastHistory.value.push({
      id:         Date.now(),
      date:       todayKey.value,
      window:     selectedWindow.value,
      duration:   `${hh}h ${mm}min`,
      completedH: Math.round((elapsed / 3600) * 10) / 10,
      completed:  elapsed,
      target:     targetSeconds.value,
    })

    fastingActive.value = false
    fastElapsed.value   = 0
    fastStart.value     = null
    persist()
    return `${hh}h ${mm}min`
  }

  function setWindow(label) {
    if (!fastingActive.value) selectedWindow.value = label
  }

  function setCustomWindow(fast, eat) {
    customWindow.value   = { fast, eat }
    selectedWindow.value = 'Personalizado'
  }

  // ── Persistence ──────────────────────────────────
  function persist() {
    localStorage.setItem('florafit_fast', JSON.stringify({
      fastingActive:  fastingActive.value,
      fastStart:      fastStart.value,
      fastElapsed:    fastElapsed.value,
      selectedWindow: selectedWindow.value,
      customWindow:   customWindow.value,
      fastHistory:    fastHistory.value,
    }))
  }

  function load() {
    try {
      const raw = localStorage.getItem('florafit_fast')
      if (!raw) return
      const d = JSON.parse(raw)
      if (d.fastHistory)    fastHistory.value    = d.fastHistory
      if (d.selectedWindow) selectedWindow.value = d.selectedWindow
      if (d.customWindow)   customWindow.value   = d.customWindow
      if (d.fastingActive && d.fastStart) {
        fastingActive.value = true
        fastStart.value     = d.fastStart
        fastElapsed.value   = Math.floor((Date.now() - d.fastStart) / 1000)
        _interval = setInterval(() => {
          fastElapsed.value = Math.floor((Date.now() - fastStart.value) / 1000)
        }, 1000)
      }
    } catch (e) { console.warn('fastStore load error', e) }
  }

  return {
    fastingActive, fastElapsed, selectedWindow, customWindow,
    fastHistory, WINDOWS, windowObj, targetSeconds,
    timerDisplay, fastProgress, fastProgressLabel, todayKey,
    startFast, stopFast, setWindow, setCustomWindow, persist, load,
  }
})