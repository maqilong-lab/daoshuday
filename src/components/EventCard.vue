<script setup lang="ts">
import { computed } from 'vue'
import type { CountdownEvent } from '@/types'
import { THEME_GRADIENTS } from '@/types'
import { calcDaysDiff, formatDate, getDaysText } from '@/utils/date'

const props = defineProps<{ event: CountdownEvent }>()
const emit = defineEmits<{
  edit: [event: CountdownEvent]
  delete: [event: CountdownEvent]
}>()

const daysDiff = computed(() => calcDaysDiff(props.event.targetDate))
const daysText = computed(() => getDaysText(daysDiff.value))
const isPast = computed(() => daysDiff.value < 0)
const isToday = computed(() => daysDiff.value === 0)

const theme = computed(() => THEME_GRADIENTS[props.event.themeColor])

const cardStyle = computed(() => ({
  background: `linear-gradient(135deg, ${theme.value.glassBg} 0%, rgba(255,255,255,0.08) 100%)`,
  borderColor: theme.value.glassBorder,
  color: 'var(--text-primary)',
}))

const badgeStyle = computed(() => ({
  background: theme.value.glassBg,
  border: `1px solid ${theme.value.glassBorder}`,
  color: theme.value.glassBorder.replace('0.35', '0.85'),
}))

const prefix = computed(() => {
  if (isToday.value) return '就是'
  if (isPast.value) return '已过'
  return '还有'
})
</script>

<template>
  <div
    class="event-card"
    :style="cardStyle"
    draggable="true"
  >
    <div class="card-grip">
      <span /><span /><span /><span /><span /><span />
    </div>

    <div class="card-actions">
      <button @click.stop="emit('edit', event)" title="编辑">&#9998;</button>
      <button class="btn-delete" @click.stop="emit('delete', event)" title="删除">&#10005;</button>
    </div>

    <div class="card-theme-badge" :style="badgeStyle">
      {{ theme.icon }} {{ theme.label }}
    </div>

    <div class="card-days" :class="{ past: isPast }">
      {{ daysText.number }}
    </div>
    <div class="card-days-label">
      {{ isToday ? '今天' : `${prefix} ${daysText.label}` }}
    </div>
    <div class="card-name">{{ event.name }}</div>
    <div class="card-date">{{ formatDate(event.targetDate) }}</div>
  </div>
</template>
