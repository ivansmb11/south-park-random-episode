<script setup lang="ts">
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'
import { UpdateProfilePayloadSchema } from '@/core/schemas/profile.schema'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import Card from '@/components/ui/card.vue'
import CardContent from '@/components/ui/card-content.vue'
import Button from '@/components/ui/button.vue'
import FormField from '@/components/FormField.vue'
import { Save, Loader2 } from 'lucide-vue-next'

const authStore = useAuthStore()

const { handleSubmit, errors, defineField, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(UpdateProfilePayloadSchema),
})

const [fullName, fullNameAttrs] = defineField('full_name')
const [username, usernameAttrs] = defineField('username')
const [birthday, birthdayAttrs] = defineField('birthday')

const populateForm = () => {
  resetForm({
    values: {
      full_name: authStore.profile?.full_name ?? authStore.user?.user_metadata?.full_name ?? '',
      username: authStore.profile?.username ?? '',
      birthday: authStore.profile?.birthday ?? '',
    },
  })
}

populateForm()
watch(() => authStore.profile, populateForm)

const initials = () => {
  const name = fullName.value || authStore.userDisplayName
  const parts = (name ?? '').split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return (name ?? '').slice(0, 2).toUpperCase() || '??'
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.updateProfile({
      full_name: values.full_name,
      username: values.username,
      birthday: values.birthday || null,
    })
    toast.success('Profile updated successfully')
  } catch {
    toast.error(authStore.error || 'Failed to update profile')
  }
})
</script>

<template>
  <div class="mx-auto max-w-lg space-y-6 sm:space-y-8">
    <div class="space-y-2">
      <h1 class="text-2xl sm:text-3xl font-bold text-foreground font-sp neon-text-primary">Profile</h1>
      <p class="text-sm text-muted-foreground">Manage your account information</p>
    </div>

    <Card
      v-motion
      :initial="{ opacity: 0, y: 16 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 400 } }"
    >
      <CardContent class="pt-6 sm:pt-8 px-5 sm:px-7 pb-6 sm:pb-8 space-y-6 sm:space-y-7">
        <!-- Avatar + email (read-only) -->
        <div class="flex items-center gap-3 sm:gap-4">
          <Avatar class="h-14 w-14 sm:h-20 sm:w-20 rounded-xl border-2 border-primary/30 shadow-[0_0_12px_oklch(0.75_0.18_210/0.2)]">
            <AvatarImage :src="authStore.userAvatar" :alt="authStore.userDisplayName" />
            <AvatarFallback class="rounded-xl text-base sm:text-lg">{{ initials() }}</AvatarFallback>
          </Avatar>
          <div class="min-w-0">
            <p class="font-medium text-foreground truncate">{{ authStore.userDisplayName }}</p>
            <p class="text-sm text-muted-foreground truncate">{{ authStore.userEmail }}</p>
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="onSubmit" class="space-y-4 sm:space-y-5">
          <FormField label="Full name" html-for="fullName" :error="errors.full_name">
            <Input id="fullName" v-model="fullName" v-bind="fullNameAttrs" placeholder="Your full name" />
          </FormField>

          <FormField label="Username" html-for="username" :error="errors.username">
            <Input id="username" v-model="username" v-bind="usernameAttrs" placeholder="Pick a username" />
          </FormField>

          <FormField label="Birthday" html-for="birthday" :error="errors.birthday">
            <Input id="birthday" :model-value="birthday ?? ''" @update:model-value="birthday = String($event) || null" v-bind="birthdayAttrs" type="date" />
          </FormField>

          <FormField label="Email" hint="Email is managed by your Google account">
            <Input :model-value="authStore.userEmail" disabled />
          </FormField>

          <Button type="submit" :disabled="isSubmitting" class="w-full h-11">
            <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
            <Save v-else class="mr-2 h-4 w-4" />
            {{ isSubmitting ? 'Saving...' : 'Save changes' }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
