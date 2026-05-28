<script setup lang="ts">
import type { ViewMode } from '@/types'

defineProps<{ viewMode: ViewMode }>()
const emit = defineEmits<{
  'toggle-view': [value: ViewMode]
  'add-event': []
}>()
</script>

<template>
  <header class="header">
    <div class="header-top">
      <h1 class="header-title">倒数日</h1>
      <button class="btn-add" @click="emit('add-event')" title="添加倒数日">
        +
      </button>
    </div>
    <div class="view-toggle">
      <button
        :class="{ active: viewMode === 'future' }"
        @click="emit('toggle-view', 'future')"
      >
        ✨ 未来事件
      </button>
      <button
        :class="{ active: viewMode === 'past' }"
        @click="emit('toggle-view', 'past')"
      >
        ⏳ 过去事件
      </button>
    </div>
  </header>
</template>
