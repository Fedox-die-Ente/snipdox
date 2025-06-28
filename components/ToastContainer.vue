<script lang="ts" setup>
import Toast from './Toast.vue'

interface ToastItem {
	id: string
	message: string
	type?: 'normal' | 'success' | 'danger'
	duration?: number
	closable?: boolean
	icon?: string
}

const toasts = ref<ToastItem[]>([])

/**
 * Adds a new toast to the list
 * @param toast - The toast item to add
 */
function addToast(toast: ToastItem) {
	toasts.value.push(toast)
}

/**
 * Removes a toast from the list
 * @param id - The id of the toast to remove
 */
function removeToast(id: string) {
	const index = toasts.value.findIndex(toast => toast.id === id)
	if (index !== -1) {
		toasts.value.splice(index, 1)
	}
}

/**
 * Clears all toasts from the list
 */
function clearAll() {
	toasts.value = []
}

defineExpose({
	addToast,
	removeToast,
	clearAll
})
</script>

<template>
	<div class="toast-container">
		<Toast
			v-for="toast in toasts"
			:key="toast.id"
			v-bind="toast"
			@close="removeToast"
		/>
	</div>
</template>

<style scoped>
.toast-container {
	position: fixed;
	top: 20px;
	right: 20px;
	z-index: 9999;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	pointer-events: none;
}

.toast-container :deep(.toast) {
	pointer-events: auto;
}

@media (max-width: 768px) {
	.toast-container {
		top: auto;
		bottom: 20px;
		left: 20px;
		right: 20px;
		align-items: stretch;
	}

	.toast-container :deep(.toast) {
		width: 100%;
		max-width: 100%;
		margin-left: auto;
		margin-right: auto;
	}
}
</style>