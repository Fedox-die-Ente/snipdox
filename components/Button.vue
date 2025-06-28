<script lang="ts" setup>
const props = defineProps({
	onClick: {
		type: Function,
		default: () => {
		}
	},
	variant: {
		type: String,
		default: 'primary'
	},
	classes: {
		type: String,
		default: ''
	},
	isLoading: {
		type: Boolean,
		default: false
	}
})

const styles = {
	primary: 'bg-primary hover:bg-primary-dark',
	secondary: 'bg-none border border-slate-600 text-slate-300 hover:bg-slate-700',
}

const emit = defineEmits(['click'])
const onClick = () => {
	if (props.isLoading) return;
	emit('click')
}

const style = defineModel({
	type: String,
	default: 'primary',
})
</script>

<template>
	<button>
		<div
			:class="styles[variant] + ' ' + classes
		+ ' px-4 py-2 rounded-lg transition-all duration-200 font-medium cursor-pointer flex flex-row gap-2 items-center justify-center'"
			@click="onClick"
		>
			<slot v-if="!isLoading"></slot>
			<div v-else>
				Loading...
			</div>
		</div>
	</button>
</template>

<style scoped>

</style>