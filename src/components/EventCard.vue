<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import type { CountdownEvent } from '@/types'
import { THEME_GRADIENTS } from '@/types'
import { calcDaysDiff, formatDate, getDaysText } from '@/utils/date'

const props = defineProps<{ event: CountdownEvent }>()
const emit = defineEmits<{
  edit: [event: CountdownEvent]
  delete: [event: CountdownEvent]
}>()

const cardRef = useTemplateRef<HTMLElement>('card')

const tiltX = ref(0)
const tiltY = ref(0)
const isHovering = ref(false)
let rafId = 0

const daysDiff = computed(() => calcDaysDiff(props.event.targetDate))
const daysText = computed(() => getDaysText(daysDiff.value))
const isPast = computed(() => daysDiff.value < 0)
const isToday = computed(() => daysDiff.value === 0)

const theme = computed(() => THEME_GRADIENTS[props.event.themeColor])

const cardStyle = computed(() => ({
  background: `linear-gradient(135deg, ${theme.value.glassBg} 0%, rgba(255,255,255,0.04) 100%)`,
  borderColor: isHovering.value ? theme.value.glassBorder : 'var(--liquid-border)',
  color: 'var(--text-primary)',
  transform: `perspective(800px) rotateX(${tiltX.value}deg) rotateY(${tiltY.value}deg)`,
}))

const badgeStyle = computed(() => ({
  background: theme.value.glassBg,
  border: `1px solid ${theme.value.glassBorder}`,
  color: theme.value.glassBorder.replace('0.25', '0.85'),
}))

const prefix = computed(() => {
  if (isToday.value) return '就是'
  if (isPast.value) return '已过'
  return '还有'
})

function onMouseMove(e: MouseEvent) {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    rafId = 0
    const el = cardRef.value
    if (!el) return

    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Glow follows cursor — set CSS custom properties directly
    const gx = (x / rect.width) * 100
    const gy = (y / rect.height) * 100
    el.style.setProperty('--glow-x', `${gx}%`)
    el.style.setProperty('--glow-y', `${gy}%`)

    // Tilt: -5..5 degrees based on distance from center
    const cx = rect.width / 2
    const cy = rect.height / 2
    tiltY.value = ((x - cx) / cx) * 5
    tiltX.value = -((y - cy) / cy) * 5
  })
}

function onMouseEnter() {
  isHovering.value = true
  cardRef.value?.style.setProperty('will-change', 'transform')
}

function onMouseLeave() {
  isHovering.value = false
  tiltX.value = 0
  tiltY.value = 0
  const el = cardRef.value
  if (el) {
    el.style.removeProperty('--glow-x')
    el.style.removeProperty('--glow-y')
    el.style.removeProperty('will-change')
  }
}
</script>

<template>
  <div
    ref="card"
    class="event-card"
    :style="cardStyle"
    draggable="true"
    @mousemove="onMouseMove"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div class="card-refraction" />

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
