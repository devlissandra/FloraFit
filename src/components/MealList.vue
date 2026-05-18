<template>
    <div>
      <!-- Empty -->
      <div v-if="meals.length === 0" class="empty-state">
        <span class="text-5xl mb-3">🍽️</span>
        <p class="text-sm">{{ emptyText }}</p>
      </div>
  
      <!-- List -->
      <div v-else class="divide-y divide-rose-100">
        <div
          v-for="meal in meals"
          :key="meal.id"
          class="flex items-center gap-3 py-3 group"
        >
          <!-- Icon -->
          <div class="w-10 h-10 rounded-xl bg-blush flex items-center justify-center text-xl flex-shrink-0">
            {{ mealEmoji(meal.name) }}
          </div>
  
          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-[#1a0a10] truncate">{{ meal.name }}</p>
            <p class="text-[11px] text-[#b08090]">
              <span v-if="showDate">{{ meal.date }} · </span>{{ meal.time }}
            </p>
          </div>
  
          <!-- Kcal -->
          <span class="text-sm font-bold text-rose-500 flex-shrink-0">{{ meal.kcal }} kcal</span>
  
          <!-- Delete -->
          <button
            v-if="deletable"
            @click="$emit('delete', meal.id)"
            class="w-7 h-7 rounded-lg bg-blush text-rose-400 text-xs opacity-0 group-hover:opacity-100
                   transition-all hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center"
          >✕</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useNutritionStore } from '../stores/nutritionStore.js'
  
  defineProps({
    meals:     { type: Array,   default: () => [] },
    deletable: { type: Boolean, default: true  },
    showDate:  { type: Boolean, default: false },
    emptyText: { type: String,  default: 'Nenhuma refeição registrada ainda.' },
  })
  
  defineEmits(['delete'])
  
  const { mealEmoji } = useNutritionStore()
  </script>