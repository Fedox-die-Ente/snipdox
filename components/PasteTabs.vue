<script lang="ts" setup>
defineProps<{
	current?: 'code' | 'error'
	hasError?: boolean
	loading?: boolean
}>()

const emit = defineEmits<{
	(e: 'change', section: 'code' | 'error'): void
}>()
</script>

<template>
	<section id="paste-tabs" class="mb-6">
		<div class="flex space-x-1 bg-slate-800 rounded-lg p-1 border border-slate-700">
			<div v-if="loading" class="w-full h-8 skeleton"/>

			<button
				v-if="!loading"
				id="code-tab"
				:class="[
					'flex w-full px-4 py-2 items-center justify-center rounded-md text-sm font-medium transition-all duration-200 section-clickable',
					current === 'code' ? 'bg-primary text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'
				]"
				@click="emit('change', 'code')"
			>
				<svgo-code class="mr-2 text-lg my-0.5"/>
				Code
			</button>

			<button
				v-if="hasError && !loading"
				id="error-tab"
				:class="[
					'flex w-full px-4 py-2 items-center justify-center rounded-md text-sm font-medium transition-all duration-200 section-clickable',
					current === 'error' ? 'bg-primary text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'
				]"
				@click="emit('change', 'error')"
			>
				<svgo-error class="mr-2 text-lg my-0.5"/>
				Error Log
			</button>
		</div>
	</section>
</template>
