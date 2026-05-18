<template>
    <div class="flex flex-col items-center">
      <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
        <!-- Track -->
        <circle
          :cx="cx" :cy="cy" :r="r"
          fill="none"
          stroke="#ffe0e8"
          :stroke-width="sw"
        />
        <!-- Fill -->
        <circle
          :cx="cx" :cy="cy" :r="r"
          fill="none"
          stroke="url(#floraGrad)"
          :stroke-width="sw"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="offset"
          stroke-linecap="round"
          :transform="`rotate(-90 ${cx} ${cy})`"
          style="transition: stroke-dashoffset 0.6s cubic-bezier(.34,1.56,.64,1)"
        />
        <defs>
          <linearGradient id="floraGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#ff5c85"/>
            <stop offset="100%" stop-color="#f9295e"/>
          </linearGradient>
        </defs>
        <!-- Center text -->
        <text
          :x="cx" :y="cy - 6"
          text-anchor="middle"
          font-family="DM Sans"
          :font-size="size * 0.14"
          font-weight="700"
          fill="#f9295e"
        >{{ Math.min(percent, 100) }}%</text>
        <text
          :x="cx" :y="cy + 12"
          text-anchor="middle"
          font-family="DM Sans"
          :font-size="size * 0.075"
          fill="#b08090"
        >{{ sublabel }}</text>
      </svg>
  
      <slot />
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    percent:  { type: Number, default: 0 },
    size:     { type: Number, default: 140 },
    sublabel: { type: String, default: 'consumido' },
  })
  
  const cx = computed(() => props.size / 2)
  const cy = computed(() => props.size / 2)
  const r  = computed(() => props.size * 0.38)
  const sw = computed(() => props.size * 0.09)
  
  const circumference = computed(() => 2 * Math.PI * r.value)
  const offset = computed(() =>
    circumference.value - (Math.min(props.percent, 100) / 100) * circumference.value
  )
  </script>