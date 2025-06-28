<template>
	<div class="p-4 max-w-full">
		<h1 class="text-2xl font-bold mb-4">Paste Management</h1>
		<table class="w-full border border-gray-300 text-sm">
			<thead class="bg-gray-100">
			<tr>
				<th class="border px-2 py-1 text-left">ID</th>
				<th class="border px-2 py-1">User ID</th>
				<th class="border px-2 py-1">Title</th>
				<th class="border px-2 py-1">Language</th>
				<th class="border px-2 py-1">Private</th>
				<th class="border px-2 py-1">Created</th>
				<th class="border px-2 py-1">Expires</th>
				<th class="border px-2 py-1">Actions</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="paste in pastes" :key="paste.id">
				<td class="border px-2 py-1 truncate max-w-[150px]">{{ paste.id }}</td>
				<td class="border px-2 py-1">{{ paste.user_id }}</td>
				<td class="border px-2 py-1">{{ paste.paste_title }}</td>
				<td class="border px-2 py-1">{{ paste.language }}</td>
				<td class="border px-2 py-1 text-center">
					<span v-if="paste.private" class="text-red-500">✔</span>
					<span v-else class="text-green-500">✘</span>
				</td>
				<td class="border px-2 py-1">{{ formatDate(paste.created_at) }}</td>
				<td class="border px-2 py-1">{{ formatDate(paste.expiration) || 'Never' }}</td>
				<td class="border px-2 py-1 text-center">
					<Button
						class="text-sm  text-white px-2 py-1"
						@click="deletePaste(paste.id)"
					>
						Delete
					</Button>
					<Button
						class="text-sm  text-white px-2 py-1 "
						@click="navigateTo(`/paste/${paste.id}`)"
					>
						View
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

interface Paste {
	id: string
	user_id: number
	paste_title: string
	language: string
	expiration: string | null
	created_at: string
	private: boolean
}

const pastes = ref<Paste[]>([])
const message = ref('')
const error = ref('')

async function fetchPastes() {
	error.value = ''
	try {
		pastes.value = await $fetch('/api/admin/pastes')
	} catch {
		error.value = 'Error while fetching pastes.'
	}
}

async function deletePaste(id: string) {
	if (!confirm('Are you sure, you want to delete that paste?')) return
	try {
		await $fetch('/api/admin/pastes/' + id, {
			method: 'DELETE',
		})
		pastes.value = pastes.value.filter(p => p.id !== id)
		message.value = 'Paste deleted.'
	} catch {
		error.value = 'Error while deleting paste.'
	}
}

function formatDate(date: string | null) {
	if (!date) return ''
	return new Date(date).toLocaleString()
}

onMounted(fetchPastes)
</script>
