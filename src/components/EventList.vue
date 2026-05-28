<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CountdownEvent, ViewMode } from '@/types'
import { isFutureEvent, isPastEvent, isToday } from '@/utils/date'
import EventCard from '@/components/EventCard.vue'

const props = defineProps<{ events: CountdownEvent[]; viewMode: ViewMode }>()
const emit = defineEmits<{
  edit: [event: CountdownEvent]
  delete: [event: CountdownEvent]
  reorder: [orderedIds: string[]]
}>()

const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const filtered = computed(() => {
  if (props.viewMode === 'future') {
    return props.events.filter(e => isFutureEvent(e.targetDate) || isToday(e.targetDate))
  }
  return props.events.filter(e => isPastEvent(e.targetDate))
})

function onDragStart(e: DragEvent, index: number) {
  dragIndex.value = index
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }
  const el = e.currentTarget as HTMLElement
  requestAnimationFrame(() => el.classList.add('dragging'))
}

function onDragEnd(e: DragEvent) {
  dragIndex.value = null
  dragOverIndex.value = null
  const el = e.currentTarget as HTMLElement
  el.classList.remove('dragging')
  // Remove all drag-over classes
  document.querySelectorAll('.event-card.drag-over').forEach(el => el.classList.remove('drag-over'))
}

function onDragOver(e: DragEvent, index: number) {
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  if (dragIndex.value === null || dragIndex.value === index) return

  // Remove old drag-over
  document.querySelectorAll('.event-card.drag-over').forEach(el => el.classList.remove('drag-over'))

  dragOverIndex.value = index
  const el = e.currentTarget as HTMLElement
  el.classList.add('drag-over')
}

function onDragLeave(e: DragEvent) {
  const el = e.currentTarget as HTMLElement
  el.classList.remove('drag-over')
}

function onDrop(e: DragEvent, dropIndex: number) {
  e.preventDefault()
  const el = e.currentTarget as HTMLElement
  el.classList.remove('drag-over')

  if (dragIndex.value === null || dragIndex.value === dropIndex) return

  const ids = filtered.value.map(e => e.id)
  const [movedId] = ids.splice(dragIndex.value, 1)
  ids.splice(dropIndex, 0, movedId!)
  emit('reorder', ids)

  dragIndex.value = null
  dragOverIndex.value = null
}
</script>

<template>
  <div v-if="viewMode === 'future' && filtered.length === 0" class="empty-state">
    <div class="empty-icon">&#128197;</div>
    <div class="empty-text">还没有倒数事件</div>
    <div class="empty-hint">点击右上角 + 添加一个吧</div>
  </div>

  <div v-else-if="viewMode === 'past' && filtered.length === 0" class="empty-state">
    <div class="empty-icon">&#9203;</div>
    <div class="empty-text">没有已过去的事件</div>
    <div class="empty-hint">时间会让一切到来</div>
  </div>

  <section v-else class="event-section">
    <div class="section-header">
      <span class="section-icon">{{ viewMode === 'future' ? '✨' : '⏳' }}</span>
      <span class="section-title">{{ viewMode === 'future' ? '未来事件' : '过去事件' }}</span>
      <span class="section-tag" :class="viewMode">{{ filtered.length }}</span>
    </div>
    <div class="event-cards">
      <EventCard
        v-for="(event, index) in filtered"
        :key="event.id"
        :event="event"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
        @dragstart="onDragStart($event, index)"
        @dragend="onDragEnd($event)"
        @dragover="onDragOver($event, index)"
        @dragleave="onDragLeave($event)"
        @drop="onDrop($event, index)"
      />
    </div>
    <div
      v-if="filtered.length > 1"
      style="text-align:center;margin-top:12px;font-size:12px;color:var(--text-tertiary)"
    >
      拖拽卡片可调整排序
    </div>
  </section>
</template>
