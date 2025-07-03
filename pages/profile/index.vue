<template>
	<div class="flex flex-col items-center justify-center min-h-screen p-4 w-full">
		<div
			class="p-14 bg-slate-800 border border-slate-700 rounded-lg flex flex-col items-center justify-center space-y-6 w-full max-w-2xl">
			<div class="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
				<svgo-human class="text-2xl text-primary"/>
			</div>

			<h1 class="font-bold text-4xl text-center">
				Profile Settings
			</h1>

			<div class="w-full space-y-4">
				<div class="flex items-center space-x-4">
					<img
						v-if="data?.user?.image"
						:alt="data.user.name || 'User'"
						:src="data.user.image"
						class="w-12 h-12 rounded-full"
					>
					<div v-else class="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
						<svgo-human class="text-slate-400"/>
					</div>
					<div>
						<h3 class="text-lg font-semibold">{{ data?.user?.name || 'Unknown User' }}</h3>
						<p class="text-slate-400">{{ data?.user?.email }}</p>
					</div>
				</div>
			</div>

			<div class="w-full space-y-4 pt-6">
				<div>
					<div class="flex items-center justify-between">
						<div
							class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                            <span v-if="!showApiKey" class="text-slate-400">
                                {{ maskedApiKey }}
                            </span>
							<span v-else class="text-primary break-all">
                                {{ apiKey || 'No API key generated' }}
                            </span>
						</div>
						<div class="flex space-x-2 ml-4">
							<Button
								:disabled="!apiKey"
								variant="secondary"
								@click="toggleApiKeyVisibility"
							>
								<svgo-eye v-if="!showApiKey" class="w-4 h-4"/>
								<svgo-eye-off v-else class="w-4 h-4"/>
							</Button>
							<Button
								:disabled="!apiKey"
								variant="secondary"
								@click="copyApiKey"
							>
								<svgo-copy class="w-4 h-4"/>
							</Button>
						</div>
					</div>
				</div>

				<div class="flex flex-col sm:flex-row gap-3 justify-center w-full">
					<Button
						v-if="!apiKey"
						:disabled="isLoading"
						class="w-full"
						variant="primary"
						@click="generateApiKey"
					>
						<svgo-plus v-if="!isLoading" class="w-4 h-4"/>
						<svgo-spinner v-else class="w-4 h-4 animate-spin"/>
						{{ isLoading ? 'Generating...' : 'Generate API Key' }}
					</Button>

					<Button
						v-else
						:disabled="isLoading"
						class="flex items-center gap-2 w-full"
						variant="secondary"
						@click="showResetDialog = true"
					>
						<svgo-plus class="w-4 h-4 my-0.5"/>
						Reset API Key
					</Button>
				</div>
			</div>

			<div class="border-t border-slate-700 pt-6 w-full">
				<Button
					class="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white"
					variant="ghost"
					@click="signOut"
				>
					<svgo-logout class="w-4 h-4"/>
					Sign Out
				</Button>
			</div>
		</div>

		<div
			v-if="showResetDialog"
			class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
			@click.self="showResetDialog = false"
		>
			<div class="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-md w-full">
				<div class="flex items-center space-x-3 mb-4">
					<div class="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
						<svgo-error class="w-5 h-5 text-red-500"/>
					</div>
					<h3 class="text-lg font-semibold">Reset API Key</h3>
				</div>

				<p class="text-slate-400 mb-6">
					Are you sure you want to reset your API key? This action cannot be undone and will invalidate your
					current key.
				</p>

				<div class="flex space-x-3">
					<Button
						class="flex-1"
						variant="secondary"
						@click="showResetDialog = false"
					>
						Cancel
					</Button>
					<Button
						:disabled="isLoading"
						class="flex-1"
						variant="primary"
						@click="resetApiKey"
					>
						{{ isLoading ? 'Resetting...' : 'Reset Key' }}
					</Button>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'

const toast = useToast()

definePageMeta({
	auth: true,
	title: 'Profile'
})

const {data, signOut} = useAuth()

const showApiKey = ref(false)
const showResetDialog = ref(false)
const isLoading = ref(false)

const apiKey = ref('')

const maskedApiKey = computed(() => {
	if (!apiKey.value) return 'No API key generated'
	return '••••••••••••••••••••••••••••••••'
})

const toggleApiKeyVisibility = () => {
	showApiKey.value = !showApiKey.value
}

const copyApiKey = async () => {
	if (!apiKey.value) return

	try {
		await navigator.clipboard.writeText(apiKey.value)
		toast.success('API Key copied to clipboard!', {
			duration: 2000
		});
	} catch (err) {
		console.error('Failed to copy API key:', err)
		toast.danger('Failed to copy API key', {
			duration: 2000
		})
	}
}

const generateApiKey = async () => {
	isLoading.value = true
	try {
		const response = await $fetch('/api/user/generate-api-key', {
			method: 'POST'
		})

		if (response.success) {
			apiKey.value = response.apiKey
			toast.success('API key generated successfully!', {
				duration: 2000
			})
		}
	} catch (error) {
		console.error('Failed to generate API key:', error)
		toast.danger('Failed to generate API key', {
			duration: 2000
		})
	} finally {
		isLoading.value = false
	}
}

const resetApiKey = async () => {
	isLoading.value = true
	try {
		const response = await $fetch('/api/user/reset-api-key', {
			method: 'POST'
		})

		if (response.success) {
			apiKey.value = response.apiKey
			showResetDialog.value = false
			showApiKey.value = true // Show the new key
			toast.success('API key reset successfully!', {
				duration: 2000
			})
		}
	} catch (error) {
		console.error('Failed to reset API key:', error)
		toast.danger('Failed to reset API key', {
			duration: 2000
		})
	} finally {
		isLoading.value = false
	}
}

const loadApiKey = async () => {
	try {
		const response = await $fetch('/api/user/api-key')
		if (response.success && response.apiKey) {
			apiKey.value = response.apiKey
		}
	} catch (error) {
		console.error('Failed to load API key:', error)
	}
}

onMounted(() => {
	loadApiKey()
})

useHead({
	title: 'Profile'
})
</script>

