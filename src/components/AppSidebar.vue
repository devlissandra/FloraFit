<template>
    <!-- Desktop sidebar -->
    <nav class="
      fixed top-0 left-0 bottom-0 z-40
      w-[88px] flex flex-col items-center
      bg-gradient-to-b from-rose-500 to-rose-400
      rounded-r-[32px] shadow-rose-md
      py-7
      hidden md:flex
    ">
      <!-- Logo -->
      <div class="mb-8 text-center">
        <span class="font-display italic text-white/80 text-[11px] leading-tight block">Flora</span>
        <span class="font-display font-semibold text-white text-[13px] leading-tight block">Fit</span>
      </div>
  
      <!-- Nav items -->
      <div class="flex flex-col gap-2 flex-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ 'nav-link-active': isActive(item.to) }"
        >
          <span class="text-[22px] leading-none">{{ item.icon }}</span>
          <span class="text-[10px] font-semibold leading-none">{{ item.label }}</span>
        </RouterLink>
      </div>
  
      <!-- Bottom help -->
      <button class="w-9 h-9 rounded-full bg-white/10 text-white/60 text-sm hover:bg-white/20 transition-colors">
        ?
      </button>
    </nav>
  
    <!-- Mobile bottom bar -->
    <nav class="
      fixed bottom-0 left-0 right-0 z-40
      h-[70px] flex items-center justify-around
      bg-gradient-to-r from-rose-500 to-rose-400
      rounded-t-[24px] shadow-rose-lg
      md:hidden px-2
    ">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="mobile-nav-link"
        :class="{ 'mobile-nav-link-active': isActive(item.to) }"
      >
        <span class="text-[24px] leading-none">{{ item.icon }}</span>
        <span class="text-[9px] font-semibold mt-0.5">{{ item.label }}</span>
      </RouterLink>
    </nav>
  </template>
  
  <script setup>
  import { RouterLink, useRoute } from 'vue-router'
  
  const route = useRoute()
  
  const navItems = [
    { to: '/',         icon: '🏠', label: 'Início'   },
    { to: '/jejum',    icon: '⏳', label: 'Jejum'    },
    { to: '/nutricao', icon: '🍽️', label: 'Nutrição' },
    { to: '/semanal',  icon: '📊', label: 'Semana'   },
  ]
  
  function isActive(to) {
    if (to === '/') return route.path === '/'
    return route.path.startsWith(to)
  }
  </script>
  
  <style scoped>
  .nav-link {
    @apply w-[52px] h-[52px] rounded-xl flex flex-col items-center justify-center gap-1
           bg-white/10 text-white/70 transition-all duration-200 cursor-pointer no-underline;
  }
  .nav-link:hover {
    @apply bg-white/20 text-white scale-105;
  }
  .nav-link-active {
    @apply bg-white text-rose-500 shadow-rose;
  }
  /* override tailwind color for icon when active */
  .nav-link-active span { filter: none; }
  
  .mobile-nav-link {
    @apply flex flex-col items-center justify-center gap-0.5 px-4 py-1
           text-white/70 rounded-xl transition-all duration-200 no-underline;
  }
  .mobile-nav-link:hover { @apply text-white; }
  .mobile-nav-link-active {
    @apply bg-white/20 text-white;
  }
  </style>