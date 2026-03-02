<script setup lang="ts">
import { type VariantProps, cva } from 'class-variance-authority'
import { Primitive, type PrimitiveProps } from 'radix-vue'
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold shadow-md ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
  {
    variants: {
      variant: {
        default: 'neon-btn-primary text-white',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:border-[oklch(0.75_0.18_210/0.4)] hover:shadow-[0_0_12px_oklch(0.75_0.18_210/0.1)] dark:bg-input/30 dark:border-input dark:hover:border-[oklch(0.75_0.18_210/0.4)]',
        secondary:
          'glass-card text-foreground hover:border-[oklch(0.75_0.18_210/0.3)]',
        ghost: 'shadow-none hover:bg-[oklch(0.75_0.18_210/0.08)] hover:text-foreground dark:hover:bg-[oklch(0.75_0.18_210/0.1)]',
        link: 'shadow-none text-primary underline-offset-4 hover:underline',
        neon: 'neon-btn-primary text-white',
        glass: 'glass-card text-foreground hover:neon-border-primary shadow-sm',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-12 rounded-lg px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface ButtonProps extends PrimitiveProps {
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<ButtonProps>(), {
  as: 'button',
})

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <Primitive
    :class="cn(buttonVariants({ variant, size }), props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </Primitive>
</template>
