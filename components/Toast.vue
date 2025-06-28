<script lang="ts" setup>

const props = defineProps<{
	id: string
	message: string
	type?: 'normal' | 'success' | 'danger'
	duration?: number
	closable?: boolean
	icon?: string
}>()

const emit = defineEmits<{
	close: [id: string]
}>()

const isVisible = ref(false)
const progress = ref(100)
const timer = ref<NodeJS.Timeout | null>(null)

const iconToUse = computed(() => {
	if (props.icon) {
		return props.icon
	}

	switch (props.type) {
		case 'success':
			return 'svgo-check'
		case 'danger':
			return 'svgo-error'
		default:
			return 'i-heroicons-information-circle'
	}
})

const toastClass = computed(() => {
	return {
		'toast': true,
		'toast-normal': props.type === 'normal' || !props.type,
		'toast-success': props.type === 'success',
		'toast-danger': props.type === 'danger',
	}
})

function startTimer() {
	if (props.duration && props.duration > 0) {
		const startTime = Date.now()
		const endTime = startTime + props.duration

		const updateProgress = () => {
			const now = Date.now()
			const remaining = endTime - now
			const total = props.duration || 0

			if (remaining <= 0) {
				closeToast()
			} else {
				progress.value = (remaining / total) * 100
				timer.value = setTimeout(updateProgress, 16) // ~60fps
			}
		}

		timer.value = setTimeout(updateProgress, 16)
	}
}

function closeToast() {
	isVisible.value = false
	if (timer.value) {
		clearTimeout(timer.value)
		timer.value = null
	}

	setTimeout(() => {
		emit('close', props.id)
	}, 300)
}

onMounted(() => {
	setTimeout(() => {
		isVisible.value = true
	}, 10)

	startTimer()
})

onBeforeUnmount(() => {
	if (timer.value) {
		clearTimeout(timer.value)
	}
})
</script>

<template>
	<div
		:class="toastClass"
		:data-visible="isVisible"
		@click="props.closable !== false ? closeToast() : null"
	>
		<div class="toast-content">
			<!-- Icon-Bereich -->
			<div v-if="iconToUse" class="toast-icon">
				<svgo-error v-if="props.type === 'danger'" class="my-0.5"/>
				<svgo-check v-if="props.type === 'success'" class="my-0.5"/>
				<svgo-info v-if="props.type === 'normal'" class="my-0.5"/>
			</div>

			<div class="toast-message">{{ message }}</div>

			<button
				v-if="props.closable !== false"
				class="toast-close"
				@click.stop="closeToast()"
			>
				&times;
			</button>
		</div>

		<div
			v-if="props.duration && props.duration > 0"
			class="toast-progress"
		>
			<div :style="{ width: `${progress}%` }" class="toast-progress-bar"></div>
		</div>
	</div>
</template>

<style scoped>
.toast {
	position: relative;
	min-width: 250px;
	max-width: 450px;
	margin-bottom: 10px;
	padding: 15px;
	border-radius: 4px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	transform: translateX(100%);
	opacity: 0;
	transition: transform 0.3s ease, opacity 0.3s ease;
	cursor: pointer;
	overflow: hidden;
}

.toast[data-visible="true"] {
	transform: translateX(0);
	opacity: 1;
}

.toast-normal {
	background-color: #f8f9fa;
	color: #212529;
	border-left: 4px solid #6c757d;
}

.toast-success {
	background-color: #f1f9f7;
	color: #1e7c66;
	border-left: 4px solid #28a745;
}

.toast-danger {
	background-color: #fdf3f4;
	color: #d9534f;
	border-left: 4px solid #dc3545;
}

.toast-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.toast-icon {
	display: flex;
	align-items: center;
	margin-right: 10px;
	font-size: 1.25rem;
}

.toast-normal .toast-icon {
	color: #6c757d;
}

.toast-success .toast-icon {
	color: #28a745;
}

.toast-danger .toast-icon {
	color: #dc3545;
}

.toast-message {
	flex: 1;
	word-break: break-word;
}

.toast-close {
	background: none;
	border: none;
	font-size: 20px;
	line-height: 1;
	padding: 0 0 0 10px;
	cursor: pointer;
	opacity: 0.5;
	transition: opacity 0.2s;
}

.toast-close:hover {
	opacity: 1;
}

.toast-progress {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 4px;
	background-color: rgba(0, 0, 0, 0.1);
}

.toast-progress-bar {
	height: 100%;
	transition: width 0.1s linear;
}

.toast-normal .toast-progress-bar {
	background-color: #6c757d;
}

.toast-success .toast-progress-bar {
	background-color: #28a745;
}

.toast-danger .toast-progress-bar {
	background-color: #dc3545;
}
</style>