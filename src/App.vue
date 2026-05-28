<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CountdownEvent, ViewMode } from '@/types'
import { useEvents } from '@/composables/useEvents'
import AppHeader from '@/components/AppHeader.vue'
import EventList from '@/components/EventList.vue'
import EventForm from '@/components/EventForm.vue'

const { events, addEvent, updateEvent, deleteEvent, reorderEvents, exportData, importData } = useEvents()

const viewMode = ref<ViewMode>('future')
const showForm = ref(false)
const editingEvent = ref<CountdownEvent | null>(null)

const sortedEvents = computed(() => {
  return [...events.value].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
})

function handleAdd() {
  editingEvent.value = null
  showForm.value = true
}

function handleEdit(event: CountdownEvent) {
  editingEvent.value = event
  showForm.value = true
}

function handleSave(data: { name: string; targetDate: string; themeColor: string }) {
  if (editingEvent.value) {
    updateEvent(editingEvent.value.id, data as Parameters<typeof updateEvent>[1])
  } else {
    addEvent(data.name, data.targetDate, data.themeColor as Parameters<typeof addEvent>[2])
  }
  showForm.value = false
  editingEvent.value = null
}

function handleDelete(event: CountdownEvent) {
  deleteEvent(event.id)
}

function handleReorder(orderedIds: string[]) {
  reorderEvents(orderedIds)
}

function handleImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) await importData(file)
  }
  input.click()
}
</script>

<template>
  <AppHeader
    :view-mode="viewMode"
    @toggle-view="(v: ViewMode) => viewMode = v"
    @add-event="handleAdd"
  />

  <EventList
    :events="sortedEvents"
    :view-mode="viewMode"
    @edit="handleEdit"
    @delete="handleDelete"
    @reorder="handleReorder"
  />

  <div class="footer-actions">
    <button @click="exportData">&#128229; 导出数据</button>
    <button @click="handleImport">&#128228; 导入数据</button>
  </div>

  <EventForm
    v-if="showForm"
    :event="editingEvent"
    @close="showForm = false; editingEvent = null"
    @save="handleSave"
  />
</template>
