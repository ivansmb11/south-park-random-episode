<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface InputProps {
  class?: HTMLAttributes['class']
  type?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text'
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <input
    :type="props.type"
    :class="cn(
      'flex h-11 w-full rounded-lg glass-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      props.class
    )"
    :disabled="props.disabled"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>