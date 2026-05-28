import { ref, watch } from 'vue'
import type { CountdownEvent, ThemeColor } from '@/types'

const STORAGE_KEY = 'daoshuday-events'

const VALID_COLORS: ThemeColor[] = ['sunset', 'ocean', 'forest', 'rose', 'sky', 'night', 'peach', 'mint']

function isValidEvent(item: unknown): item is CountdownEvent {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof (item as Record<string, unknown>).id === 'string' &&
    typeof (item as Record<string, unknown>).name === 'string' &&
    typeof (item as Record<string, unknown>).targetDate === 'string' &&
    VALID_COLORS.includes((item as Record<string, unknown>).themeColor as ThemeColor)
  )
}

function loadFromStorage(): CountdownEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const events = parsed.filter(isValidEvent)
    // Migration: backfill missing `order` field from pre-drag-drop data
    let needsMigration = false
    for (let i = 0; i < events.length; i++) {
      if (events[i]!.order === undefined) {
        events[i] = { ...events[i]!, order: i }
        needsMigration = true
      }
    }
    if (needsMigration) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(events)) } catch { /* ignore */ }
    }
    return events.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  } catch {
    return []
  }
}

function saveToStorage(events: CountdownEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  } catch {
    // Storage quota exceeded or unavailable
  }
}

export function useEvents() {
  const events = ref<CountdownEvent[]>(loadFromStorage())

  watch(events, (val) => saveToStorage(val), { deep: true })

  function addEvent(name: string, targetDate: string, themeColor: ThemeColor): CountdownEvent {
    const maxOrder = events.value.reduce((max, e) => Math.max(max, e.order ?? 0), 0)
    const event: CountdownEvent = {
      id: crypto.randomUUID(),
      name,
      targetDate,
      themeColor,
      createdAt: new Date().toISOString(),
      order: maxOrder + 1,
    }
    events.value = [...events.value, event]
    return event
  }

  function updateEvent(id: string, data: Partial<Pick<CountdownEvent, 'name' | 'targetDate' | 'themeColor'>>): boolean {
    if (events.value.findIndex(e => e.id === id) === -1) return false
    events.value = events.value.map(e =>
      e.id === id ? { ...e, ...data } : e
    )
    return true
  }

  function deleteEvent(id: string): void {
    events.value = events.value.filter(e => e.id !== id)
  }

  function reorderEvents(orderedIds: string[]): void {
    const idSet = new Set(orderedIds)
    const reordered = orderedIds
      .map(id => events.value.find(e => e.id === id))
      .filter((e): e is CountdownEvent => e !== undefined)
    const rest = events.value
      .filter(e => !idSet.has(e.id))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    events.value = [...reordered, ...rest].map((e, i) => ({ ...e, order: i }))
  }

  function exportData(): void {
    const json = JSON.stringify(events.value, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `daoshuday-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function importData(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const parsed: unknown = JSON.parse(reader.result as string)
          if (!Array.isArray(parsed)) { resolve(false); return }
          const data = parsed as CountdownEvent[]
          const merged = [...events.value]
          for (const item of data) {
            if (!isValidEvent(item)) continue
            if (!merged.find(e => e.id === item.id)) {
              merged.push({ ...item, order: item.order ?? merged.length })
            }
          }
          events.value = merged
          resolve(true)
        } catch {
          resolve(false)
        }
      }
      reader.onerror = () => resolve(false)
      reader.onabort = () => resolve(false)
      reader.readAsText(file)
    })
  }

  return { events, addEvent, updateEvent, deleteEvent, reorderEvents, exportData, importData }
}
