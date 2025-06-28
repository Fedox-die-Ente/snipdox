<template>
	<div class="p-4 mx-auto">
		<h1 class="text-2xl font-bold mb-4">Allowed Emails</h1>

		<form class="flex mb-6 gap-2" @submit.prevent="addEmail">
			<input
				v-model="newEmail"
				class="flex-1 border px-2 py-1"
				placeholder="New allowed email"
				required
				type="email"
			/>
			<Button class=" text-white px-4 py-1">
				Add
			</Button>
		</form>

		<table class="w-full border border-gray-300 text-sm">
			<thead class="bg-gray-100">
			<tr>
				<th class="border px-2 py-1 text-left">ID</th>
				<th class="border px-2 py-1 text-left">Email</th>
				<th class="border px-2 py-1 text-center">Action</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="email in allowedEmails" :key="email.id">
				<td class="border px-2 py-1">{{ email.id }}</td>
				<td class="border px-2 py-1">{{ email.email }}</td>
				<td class="border px-2 py-1 text-center">
					<Button
						class=" text-white px-2 py-1 "
						@click="removeEmail(email.id)"
					>
						Delete
					</Button>
				</td>
			</tr>
			</tbody>
		</table>

		<p v-if="message" class="text-green-600 mt-4">{{ message }}</p>
		<p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({
	layout: 'admin'
})
import {onMounted, ref} from 'vue'

interface AllowedEmail {
	id: number
	email: string
}

const allowedEmails = ref<AllowedEmail[]>([])
const newEmail = ref('')
const message = ref('')
const error = ref('')

async function fetchEmails() {
	try {
		allowedEmails.value = await $fetch('/api/admin/allowed-emails')
	} catch {
		error.value = 'Error while fetching allowed emails.'
	}
}

async function addEmail() {
	if (!newEmail.value) return
	try {
		const result = await $fetch('/api/admin/allowed-emails', {
			method: 'POST',
			body: {email: newEmail.value},
		})
		allowedEmails.value.push(result)
		message.value = 'Email added.'
		newEmail.value = ''
	} catch (e: any) {
		error.value = e.data?.message || 'Error while adding.'
	}
}

async function removeEmail(id: number) {
	if (!confirm('Wanna delete email?')) return
	try {
		await $fetch(`/api/admin/allowed-emails/${id}`, {method: 'DELETE'})
		allowedEmails.value = allowedEmails.value.filter((e) => e.id !== id)
		message.value = 'Email deleted.'
	} catch {
		error.value = 'Error while deleting.'
	}
}

onMounted(fetchEmails)
</script>
