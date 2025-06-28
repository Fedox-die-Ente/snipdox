<template>
	<div class="p-4">
		<h1 class="text-2xl font-bold mb-4">Paste Reports</h1>
		<table class="w-full border border-gray-300 text-sm">
			<thead class="bg-gray-100">
			<tr>
				<th class="border px-2 py-1 text-left">ID</th>
				<th class="border px-2 py-1">Paste ID</th>
				<th class="border px-2 py-1">IP</th>
				<th class="border px-2 py-1">Reason</th>
				<th class="border px-2 py-1">Created</th>
				<th class="border px-2 py-1">Actions</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="report in reports" :key="report.id">
				<td class="border px-2 py-1">{{ report.id }}</td>
				<td class="border px-2 py-1">
					<NuxtLink
						:to="`/paste/${report.paste_id}`"
						class="text-blue-600 underline"
						target="_blank"
					>
						{{ report.paste_id }}
					</NuxtLink>
				</td>
				<td class="border px-2 py-1">{{ report.ip_address }}</td>
				<td class="border px-2 py-1">{{ report.reason }}</td>
				<td class="border px-2 py-1">{{ formatDate(report.created_at) }}</td>
				<td class="border px-2 py-1 text-center">
					<Button
						class=" text-white px-2 py-1  text-sm"
						@click="deleteReport(report.id)"
					>
						Delete
					</Button>
				</td>
			</tr>
			</tbody>
		</table>

		<div v-if="message" class="mt-4 text-green-600">{{ message }}</div>
		<div v-if="error" class="mt-4 text-red-600">{{ error }}</div>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({
	layout: 'admin'
})
import {onMounted, ref} from 'vue'

interface Report {
	id: number
	paste_id: string
	ip_address: string
	reason: string
	created_at: string
}

const reports = ref<Report[]>([])
const message = ref('')
const error = ref('')

async function fetchReports() {
	try {
		reports.value = await $fetch('/api/admin/reports')
	} catch {
		error.value = 'Error while fetching reports.'
	}
}

async function deleteReport(id: number) {
	if (!confirm('Are you sure, you want to delete the report?')) return
	try {
		await $fetch(`/api/admin/reports/${id}`, {
			method: 'DELETE',
		})
		reports.value = reports.value.filter((r) => r.id !== id)
		message.value = 'Report deleted.'
	} catch {
		error.value = 'Error deleting report.'
	}
}

function formatDate(date: string) {
	return new Date(date).toLocaleString()
}

onMounted(fetchReports)
</script>
