<script lang="ts" setup>
const props = defineProps({
	title: {
		type: String,
		default: 'Total Pastes'
	},
	amount: {
		type: Number,
		default: 0
	},
	iconBgColor: {
		type: String,
		default: 'bg-primary/20'
	},
	iconColor: {
		type: String,
		default: 'text-primary'
	},
	icon: {
		type: String,
		default: 'svgo-file'
	}
})
</script>

<template>
	<div id="total-pastes" class="bg-slate-800 rounded-xl border border-slate-700 p-6">
		<div class="flex items-center justify-between">
			<div>
				<h2 class="text-slate-400 text-sm">{{ title }}</h2>
				<p class="text-2xl font-bold text-white">{{ amount }}</p>
			</div>
			<div :class="props.iconBgColor + ' ' + props.iconColor"
				 class="w-12 h-12 rounded-lg flex items-center justify-center">
				<component :is="props.icon" class="text-lg my-0.5"/>
			</div>
		</div>
	</div>
</template>