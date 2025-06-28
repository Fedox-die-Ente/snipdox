<template>
	<div>
		<slot v-if="loading" name="loader"/>
		<slot v-else name="loaded"/>
	</div>
</template>

<script lang="ts" setup>
defineProps<{
	loading: boolean
}>()
</script>
