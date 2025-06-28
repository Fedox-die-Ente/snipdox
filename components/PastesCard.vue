<script lang="ts" setup>
const props = defineProps({
	id: {
		type: String,
		required: true
	},
	title: {
		type: String,
		default: 'Untitled Paste'
	},
	language: {
		type: String,
		default: 'plaintext'
	},
	isPrivate: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: String,
		default: ''
	},
	content: {
		type: String,
		default: ''
	},
	expiration: {
		type: String,
		default: 'Never'
	},
})

const toast = useToast();

const copyToClipboard = () => {
	navigator.clipboard.writeText(props.content).then(() => {
		toast.success('Copied to clipboard!', {duration: 2000});
	}).catch(err => {
		toast.danger('Failed to copy text', {duration: 2000});
	});
};

const isLoading = ref(false);
const emit = defineEmits(['refreshPastes']);

const deletePaste = (pasteId: string) => {
	const data = {
		pasteId: pasteId
	}

	if (!pasteId) {
		toast.danger('Paste ID is required to delete a paste.', {duration: 5000});
		return;
	}

	if (!confirm('Are you sure you want to delete this paste? This action cannot be undone.')) {
		return;
	}

	if (isLoading.value) {
		toast.danger('Delete operation is already in progress.', {duration: 3000});
		return;
	}

	isLoading.value = true;

	window.fetch('/api/paste/delete', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(async (response) => {
			const responseData = await response.json();
			if (response.ok && responseData.success) {
				toast.success('Paste deleted successfully!', {duration: 5000});
				emit('refreshPastes');
			} else {
				toast.danger('Failed to delete paste: ' + responseData.message, {duration: 5000});
			}
		})
		.catch((error) => {
			console.error('Error deleting paste:', error);
			toast.danger('An error occurred while deleting the paste.', {duration: 5000});
		})
		.finally(() => {
			isLoading.value = false;
		});
}
</script>

<template>
	<div class="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-colors">
		<div class="flex items-start justify-between">
			<div class="flex-1">
				<div class="flex items-center space-x-3 mb-3">
					<h3 class="text-lg font-semibold text-white hover:text-primary cursor-pointer transition-colors group">
						{{ title }}
					</h3>
					<span class="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full border border-slate-600">
								{{ language.charAt(0).toUpperCase() + language.slice(1) }}
							</span>
					<span :class="isPrivate ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'"
						  class="px-2 py-1 text-xs rounded-full border"
					>
						{{ isPrivate ? 'Private' : 'Public' }}
					</span>
				</div>
				<div class="flex items-center space-x-6 text-sm text-slate-400 font-semibold">
							<span class="flex items-center space-x-1">
								<svgo-calendar class="text-lg my-0.5"/>
								<span>Created at {{ formatDateTime(createdAt) }}</span>
							</span>
					<span class="flex items-center space-x-1">
								<svgo-document class="text-lg my-0.5"/>
								<span>{{ content.length }} characters</span>
							</span>
					<span class="flex items-center space-x-1">
								<svgo-clock class="text-lg my-0.5"/>
								<span>Expires {{ formatRelativeExpiration(expiration) }}</span>
							</span>
				</div>
			</div>
			<div class="flex items-center space-x-2 ml-4">
				<button class="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
						@click="copyToClipboard	">
					<svgo-copy class="text-lg"/>
				</button>

				<button class="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
						@click="deletePaste(props.id)">
					<svgo-trashcan class="text-lg"/>
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>