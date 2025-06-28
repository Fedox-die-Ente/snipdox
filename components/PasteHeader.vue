<script lang="ts" setup>
const {status, data} = useAuth();
defineProps({
	title: {
		type: String,
		default: 'Paste Header'
	},
	expiration: {
		type: String,
		default: 'Never'
	},
	createdAt: {
		type: String,
		default: ''
	},
	language: {
		type: String,
		default: 'plaintext'
	},
	content: {
		type: String,
		default: ''
	},
	loading: {
		type: Boolean,
		default: false
	}
})

const isLoading = ref(false);
const toast = useToast();

const deletePaste = () => {
	if (status.value !== 'authenticated') {
		return;
	}

	const pasteId = useRoute().params.id as string;
	if (!pasteId) {
		return;
	}

	const confirmDelete = confirm('Are you sure you want to delete this paste? This action cannot be undone.');
	if (!confirmDelete) {
		return;
	}

	console.log(`Deleting paste with ID: ${pasteId}`);

	const data = {
		pasteId: pasteId
	}

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
				navigateTo(`/`);
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
	<section id="paste-header" class="mb-8 section-clickable">
		<div class="bg-slate-800 rounded-xl border border-slate-700 p-6">
			<div class="flex items-center justify-between mb-4">
				<SkeletonWrapper :loading="loading">
					<template #loader>
						<div class="skeleton w-40 h-6"></div>
					</template>
					<template #loaded>
						<h2 :class="loading && 'bg-slate-700 text-transparent rounded-md animate-pulse w-40 h-6'"
							class="text-2xl font-bold text-white">
							{{ title }}
						</h2>
					</template>
				</SkeletonWrapper>

				<SkeletonWrapper :loading="loading">
					<template #loader>
						<div class="skeleton w-24 h-6"></div>
					</template>
					<template #loaded>
						<div class="flex items-center space-x-4">
							<div class="flex items-center space-x-2 text-slate-300 font-semibold">
								<svgo-clock class="text-lg"/>
								<span class="text-sm">
									Expires {{ formatRelativeExpiration(expiration) }}
								</span>
							</div>
							<button v-if="status === 'authenticated'" class="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
									@click="deletePaste">
								<svgo-trashcan class="text-lg"/>
							</button>
						</div>
					</template>
				</SkeletonWrapper>
			</div>

			<SkeletonWrapper :loading="loading">
				<template #loader>
					<div class="skeleton w-xl h-6"/>
				</template>
				<template #loaded>
					<div class="flex items-center space-x-4 text-sm text-slate-400 font-semibold">
                    <span class="flex items-center space-x-1">
						<svgo-calendar class="text-lg"/>
                        <span>
							Created at {{ formatDateTime(createdAt) }}
						</span>
                    </span>
						<span class="flex items-center space-x-1">
							<svgo-binary class="text-lg"/>
                        <span>
							{{ language.charAt(0).toUpperCase() + language.slice(1) }}
						</span>
                    </span>
						<span class="flex items-center flex-row gap-1">
							<svgo-document class="text-lg"/>
							{{ content.length }} characters
                    </span>
					</div>
				</template>
			</SkeletonWrapper>

		</div>
	</section>
</template>