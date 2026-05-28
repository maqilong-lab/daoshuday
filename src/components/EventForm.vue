<script setup lang="ts">
import { reactive } from 'vue'
import type { CountdownEvent, ThemeColor } from '@/types'
import { THEME_GRADIENTS } from '@/types'

const props = defineProps<{ event: CountdownEvent | null }>()
const emit = defineEmits<{
  close: []
  save: [{ name: string; targetDate: string; themeColor: ThemeColor }]
}>()

const isEdit = !!props.event

const form = reactive({
  name: props.event?.name ?? '',
  targetDate: props.event?.targetDate ?? '',
  themeColor: (props.event?.themeColor ?? 'sunset') as ThemeColor,
})

const errors = reactive({ name: '', targetDate: '' })

function validate(): boolean {
  errors.name = ''
  errors.targetDate = ''

  if (!form.name.trim()) {
    errors.name = '请输入事件名称'
    return false
  }
  if (!form.targetDate) {
    errors.targetDate = '请选择日期'
    return false
  }
  return true
}

function handleSubmit() {
  if (!validate()) return
  emit('save', { ...form, name: form.name.trim() })
}

const themeKeys = Object.keys(THEME_GRADIENTS) as ThemeColor[]
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">{{ isEdit ? '编辑' : '新建' }}倒数日</h2>
        <button class="btn-close" @click="emit('close')">&times;</button>
      </div>

      <div class="form-group">
        <label class="form-label">事件名称</label>
        <input
          v-model="form.name"
          class="form-input"
          type="text"
          placeholder="例如：生日、考试、旅行..."
          maxlength="50"
        />
        <div v-if="errors.name" class="form-error">{{ errors.name }}</div>
      </div>

      <div class="form-group">
        <label class="form-label">目标日期</label>
        <input
          v-model="form.targetDate"
          class="form-input"
          type="date"
        />
        <div v-if="errors.targetDate" class="form-error">{{ errors.targetDate }}</div>
      </div>

      <div class="form-group">
        <label class="form-label">卡片主题色</label>
        <div class="color-grid">
          <button
            v-for="key in themeKeys"
            :key="key"
            class="color-option"
            :class="{ selected: form.themeColor === key }"
            :style="{ background: THEME_GRADIENTS[key].gradient }"
            :title="THEME_GRADIENTS[key].label"
            @click="form.themeColor = key"
          />
        </div>
      </div>

      <button class="btn-submit" @click="handleSubmit">
        {{ isEdit ? '保存修改' : '创建倒数日' }}
      </button>
    </div>
  </div>
</template>
