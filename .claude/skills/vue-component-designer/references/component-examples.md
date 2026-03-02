# Component Examples

This document provides annotated examples of well-structured custom components.

## Example 1: FormInput (Base Wrapper Component)

**Location**: `resources/ts/Pages/Child-Components/FormInput.vue`

**Purpose**: Base wrapper providing label, error display, and validation states for all input components.

```vue
<script setup lang="ts">
import { computed } from "vue";
import { useUsersStore } from "../../stores/usersStore";

interface Props {
    label?: string;
    modelValue?: any;
    error?: string | null;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    isValid?: boolean;
    isValidating?: boolean;
    hideError?: boolean;
}

interface Emits {
    "update:modelValue": [value: any];
    blur: [];
    input: [];
}

const props = withDefaults(defineProps<Props>(), {
    isValid: true,
    isValidating: false,
    hideError: false,
});

const emit = defineEmits<Emits>();
const usersStore = useUsersStore();

const inputProps = computed(() => ({
    value: props.modelValue,
    disabled: props.disabled,
    placeholder: props.placeholder,
    required: props.required,
    "onUpdate:modelValue": (value: any) => emit("update:modelValue", value),
    onBlur: () => emit("blur"),
    onInput: () => emit("input"),
}));

const inputClasses = computed(() => {
    const baseClasses = [
        "w-full px-3 py-2 border rounded-md",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        "transition-colors duration-200",
    ];

    if (props.error || !props.isValid) {
        baseClasses.push(
            usersStore.isDarkMode
                ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                : "border-red-500 focus:ring-red-500 focus:border-red-500"
        );
    } else if (props.isValidating) {
        baseClasses.push(
            usersStore.isDarkMode
                ? "border-blue-400 focus:ring-blue-400 focus:border-blue-400"
                : "border-blue-500 focus:ring-blue-500 focus:border-blue-500"
        );
    } else {
        baseClasses.push(
            usersStore.isDarkMode ? "border-gray-600" : "border-gray-300"
        );
    }

    if (usersStore.isDarkMode) {
        baseClasses.push("bg-gray-700", "text-white");
    } else {
        baseClasses.push("bg-white", "text-gray-900");
    }

    if (props.disabled) {
        baseClasses.push(
            usersStore.isDarkMode
                ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-500 cursor-not-allowed"
        );
    }

    return baseClasses.join(" ");
});
</script>

<template>
    <div>
        <label
            v-if="label"
            :class="[
                'block text-sm font-medium mb-2',
                usersStore.isDarkMode ? 'text-gray-300' : 'text-gray-700',
                required
                    ? 'after:content-[\'*\'] after:text-red-500 after:ml-1'
                    : '',
            ]"
        >
            {{ label }}
        </label>

        <div class="relative">
            <slot :inputProps="inputProps" :inputClasses="inputClasses" />

            <div
                v-if="isValidating"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
            >
                <div
                    class="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"
                ></div>
            </div>
        </div>

        <div
            v-if="error && !hideError"
            :class="[
                'mt-1 text-sm',
                usersStore.isDarkMode ? 'text-red-400' : 'text-red-500',
            ]"
        >
            {{ error }}
        </div>
    </div>
</template>
```

**Key Patterns**:
- Slot-based design provides `inputProps` and `inputClasses` to children
- Validation states: `isValid`, `isValidating`, `error`
- Required field indicator using `after:content` pseudo-element
- Loading spinner absolute positioned in input
- Dark mode support throughout

---

## Example 2: TextInput (Simple Input Component)

**Location**: `resources/ts/Pages/Child-Components/TextInput.vue`

**Purpose**: Standard text input wrapping FormInput with proper v-model binding.

```vue
<script setup lang="ts">
import FormInput from "./FormInput.vue";

interface Props {
    label?: string;
    modelValue?: string;
    error?: string | null;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    isValid?: boolean;
    isValidating?: boolean;
}

interface Emits {
    "update:modelValue": [value: string];
    blur: [];
    input: [];
}

withDefaults(defineProps<Props>(), {
    modelValue: "",
    isValid: true,
    isValidating: false,
});

const emit = defineEmits<Emits>();

const handleInputChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit("update:modelValue", target.value);
};

const handleBlur = () => {
    emit("blur");
};

const handleInput = () => {
    emit("input");
};
</script>

<template>
    <FormInput
        :label="label"
        :error="error"
        :required="required"
        :is-valid="isValid"
        :is-validating="isValidating"
        @blur="handleBlur"
        @input="handleInput"
    >
        <template #default="{ inputProps, inputClasses }">
            <input
                type="text"
                :class="inputClasses"
                v-bind="inputProps"
                :value="modelValue"
                @input="handleInputChange"
                @blur="handleBlur"
            />
        </template>
    </FormInput>
</template>
```

---

## Example 3: Button (Versatile Action Component)

**Location**: `resources/ts/Pages/Child-Components/Button.vue`

**Purpose**: Reusable button component with variants, sizes, and loading states.

```vue
<script setup lang="ts">
import { computed } from "vue";
import { useUsersStore } from "../../stores/usersStore";

interface Props {
    icon?: string;
    text?: string;
    variant?: "primary" | "secondary" | "danger" | "ghost" | "text";
    size?: "xs" | "sm" | "md" | "lg";
    disabled?: boolean;
    loading?: boolean;
    rounded?: "none" | "sm" | "md" | "lg" | "full";
    iconPosition?: "left" | "right";
}

const props = withDefaults(defineProps<Props>(), {
    variant: "primary",
    size: "md",
    disabled: false,
    loading: false,
    rounded: "md",
    iconPosition: "left",
});

const emit = defineEmits<{
    click: [event: MouseEvent];
}>();

const usersStore = useUsersStore();

const baseClasses = computed(() => [
    "inline-flex items-center justify-center font-medium transition-all duration-200",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    {
        "px-2 py-1 text-xs": props.size === "xs",
        "px-3 py-1.5 text-sm": props.size === "sm",
        "px-4 py-2 text-sm": props.size === "md",
        "px-6 py-3 text-base": props.size === "lg",
    },
    {
        "rounded-none": props.rounded === "none",
        "rounded-sm": props.rounded === "sm",
        "rounded-md": props.rounded === "md",
        "rounded-lg": props.rounded === "lg",
        "rounded-full": props.rounded === "full",
    },
]);

const variantClasses = computed(() => {
    const isDark = usersStore.isDarkMode;

    switch (props.variant) {
        case "primary":
            return [
                isDark
                    ? "bg-blue-600/90 hover:bg-blue-700/90 text-white border border-blue-600/90"
                    : "bg-blue-500 hover:bg-blue-600 text-white border border-blue-500",
                "shadow-sm hover:shadow-md",
            ];
        case "secondary":
            return [
                isDark
                    ? "bg-gray-700 text-gray-100 border border-gray-600"
                    : "bg-gray-100 text-gray-700 border border-gray-300",
                "shadow-sm",
            ];
        case "danger":
            return [
                isDark
                    ? "bg-red-600/90 text-white border border-red-600/90"
                    : "bg-red-500 text-white border border-red-500",
                "shadow-sm",
            ];
        case "ghost":
            return [
                isDark
                    ? "bg-transparent text-gray-300 border border-gray-600"
                    : "bg-transparent text-gray-600 border border-gray-300",
            ];
        case "text":
            return [
                isDark
                    ? "bg-transparent text-gray-400"
                    : "bg-transparent text-gray-500",
                "border-0",
            ];
        default:
            return [];
    }
});

const handleClick = (event: MouseEvent) => {
    if (props.disabled || props.loading) return;
    emit("click", event);
};
</script>

<template>
    <button
        :class="[baseClasses, variantClasses]"
        :disabled="disabled || loading"
        @click="handleClick"
        type="button"
    >
        <slot />
    </button>
</template>
```

---

## Example 4: SaveButton (Specialized Button)

**Location**: `resources/ts/Pages/Child-Components/SaveButton.vue`

**Purpose**: Specialized button for save actions with i18n support.

```vue
<script setup lang="ts">
import { useUsersStore } from "../../stores/usersStore";
import { useI18n } from "vue-i18n";

interface Props {
    isSubmitting?: boolean;
    saveButtonText?: string;
    savingText?: string;
    disabled?: boolean;
    showBorder?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    isSubmitting: false,
    saveButtonText: "save",
    savingText: "saving",
    disabled: false,
    showBorder: true,
});

const emit = defineEmits<{
    save: [];
}>();

const { t } = useI18n();
const usersStore = useUsersStore();

const handleSaveClick = () => {
    if (!props.isSubmitting && !props.disabled) {
        emit("save");
    }
};
</script>

<template>
    <div
        :class="[
            showBorder && usersStore.isDarkMode
                ? 'border-t border-slate-700/50'
                : showBorder
                ? 'border-t border-gentle-moonlight-200/50'
                : '',
        ]"
    >
        <div class="flex justify-end">
            <button
                @click="handleSaveClick"
                :disabled="isSubmitting || disabled"
                :class="[
                    'relative px-6 py-4 rounded-xl text-base font-semibold transition-all duration-300',
                    'flex items-center space-x-3 justify-center min-w-[11rem] text-white',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    usersStore.isDarkMode
                        ? 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/25'
                        : 'bg-slate-700 hover:bg-slate-600 shadow-lg shadow-slate-900/25',
                    !isSubmitting && !disabled ? 'hover:shadow-xl' : '',
                ]"
            >
                <div v-if="isSubmitting" class="flex items-center space-x-3">
                    <div
                        class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    ></div>
                    <span>{{ t(savingText) }}</span>
                </div>

                <div v-else class="flex items-center space-x-3">
                    <i class="fa-solid fa-save text-lg"></i>
                    <span>{{ t(saveButtonText) }}</span>
                </div>
            </button>
        </div>
    </div>
</template>
```

---

## Common Custom Components Reference

### Available Custom Components

**Form Inputs** (Prefer over DevExtreme):
- `TextInput.vue` - Standard text input
- `NumberInput.vue` - Number input with validation
- `SelectBox.vue` - Single-select dropdown
- `TagBox.vue` - Multi-select with tags
- `FileUploader.vue` - File upload with progress

**Layout**:
- `UnifiedFormContainer.vue` - Main form container
- `FormPageHeader.vue` - Page title section
- `FormSectionHeader.vue` - Section dividers

**Actions**:
- `Button.vue` - Generic button with variants
- `SaveButton.vue` - Save action button
- `CancelButton.vue` - Cancel action button

**Feedback**:
- `ErrorPopup.vue` - Error/validation display
- `SuccessPopup.vue` - Success confirmation

**Base Components**:
- `FormInput.vue` - Input wrapper (don't use directly, use TextInput, etc.)

### When to Use DevExtreme

Only use DevExtreme components when no custom alternative exists:

```vue
<!-- Use DevExtreme when needed -->
<DxDateBox
    v-model="formData.date"
    type="date"
    display-format="dd/MM/yyyy"
/>

<!-- No custom date picker exists yet -->
```
