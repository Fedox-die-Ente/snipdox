<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'

const props = defineProps({
	error_title: {
		type: String,
		default: 'Error Log'
	},
	error_details: {
		type: String,
		default: 'N/A'
	}
})

const textareaRef = ref<HTMLTextAreaElement | null>(null)

const resizeTextarea = () => {
	if (textareaRef.value) {
		textareaRef.value.style.height = 'auto'
		textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
	}
}

onMounted(() => {
	resizeTextarea()
})

watch(() => props.error_details, () => {
	resizeTextarea()
})
</script>


<template>
	<main class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
		<div class="flex items-center justify-between px-6 py-3 border-b border-slate-700 bg-slate-750">
			<div class="flex items-center space-x-3">
					<span class="text-sm text-slate-400">
						{{ props.error_title }}
					</span>
			</div>
		</div>

		<div class="p-6 space-y-4">
			<div class="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
				<div class="flex items-start text-left space-x-3">
					<svgo-error class="text-red-300 my-1"/>
					<textarea
						ref="textareaRef"
						class="w-full text-left bg-transparent text-sm text-red-200 font-jetbrains-mono border-none focus:ring-0 resize-none overflow-hidden"
						readonly
					>{{ props.error_details }}</textarea>
				</div>
			</div>
		</div>
	</main>
</template>