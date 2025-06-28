<template>
	<div class="mt-8 space-y-6">
		<h1 class="text-3xl font-bold">Welcome to the Admin Dashboard</h1>
		<p class="text-gray-600">Use the navigation above to manage users, pastes, reports, and allowed emails.</p>

		<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
			<div class="bg-slate-100 rounded-xl p-4 shadow-sm">
				<p class="text-sm text-gray-500">Total Users</p>
				<p class="text-2xl font-semibold">{{ stats.users }}</p>
			</div>
			<div class="bg-slate-100 rounded-xl p-4 shadow-sm">
				<p class="text-sm text-gray-500">Total Pastes</p>
				<p class="text-2xl font-semibold">{{ stats.pastes }}</p>
			</div>
			<div class="bg-slate-100 rounded-xl p-4 shadow-sm">
				<p class="text-sm text-gray-500">Open Reports</p>
				<p class="text-2xl font-semibold">{{ stats.reports }}</p>
			</div>
			<div class="bg-slate-100 rounded-xl p-4 shadow-sm">
				<p class="text-sm text-gray-500">Allowed Emails</p>
				<p class="text-2xl font-semibold">{{ stats.allowed }}</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({
	layout: 'admin'
})

const stats = ref({
	users: 0,
	pastes: 0,
	reports: 0,
	allowed: 0
})

onMounted(async () => {
	const res = await $fetch('/api/admin/stats')
	stats.value = res
})
</script>
