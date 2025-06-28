<template>
	<div class="p-4 mx-auto w-full">
		<h1 class="text-2xl font-bold mb-4">User Management</h1>
		<table class="w-full border-collapse border border-gray-300">
			<thead>
			<tr>
				<th class="border border-gray-300 px-2 py-1 text-left">ID</th>
				<th class="border border-gray-300 px-2 py-1 text-left">Username</th>
				<th class="border border-gray-300 px-2 py-1 text-left">Email</th>
				<th class="border border-gray-300 px-2 py-1 text-left">Admin</th>
				<th class="border border-gray-300 px-2 py-1 text-left">Actions</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="user in users" :key="user.id">
				<td class="border border-gray-300 px-2 py-1">{{ user.id }}</td>
				<td class="border border-gray-300 px-2 py-1">
					<input
						v-model="user.username"
						class="border px-1 py-0.5 w-full"
						type="text"
						@change="updateUser(user)"
					/>
				</td>
				<td class="border border-gray-300 px-2 py-1">{{ user.email }}</td>
				<td class="border border-gray-300 px-2 py-1 text-center">
					<input
						v-model="user.admin"
						type="checkbox"
						@change="updateUser(user)"
					/>
				</td>
				<td class="border border-gray-300 px-2 py-1 text-center">
					<Button
						class="text-sm px-2 py-1  text-white"
						@click="deleteUser(user.id)"
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

interface User {
	id: number
	username: string
	email: string
	admin: boolean
}

const users = ref<User[]>([])
const message = ref('')
const error = ref('')

async function fetchUsers() {
	error.value = ''
	try {
		users.value = await $fetch<User[]>('/api/admin/users')
	} catch {
		error.value = 'Error while fetching users.'
	}
}

async function updateUser(user: User) {
	message.value = ''
	error.value = ''
	try {
		await $fetch('/api/admin/users/' + user.id, {
			method: 'PUT',
			body: {username: user.username, admin: user.admin},
		})
		message.value = `User ${user.username} updated successfully.`
	} catch {
		error.value = 'Error while updating user.'
	}
}

async function deleteUser(id: number) {
	message.value = ''
	error.value = ''
	if (!confirm('Are you sure, you want to delete the user?')) return

	try {
		await $fetch('/api/admin/users/' + id, {
			method: 'DELETE',
		})
		users.value = users.value.filter(u => u.id !== id)
		message.value = 'User deleted.'
	} catch {
		error.value = 'Error while deleting.'
	}
}

onMounted(() => {
	fetchUsers()
})
</script>
