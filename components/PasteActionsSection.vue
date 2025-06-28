<script lang="ts" setup>
import {ref} from 'vue'

defineProps({
	loading: {
		type: Boolean,
		default: false
	},
	author: {
		type: String,
		default: ''
	}
})

const toast = useToast()

const copyUrl = () => {
	navigator.clipboard.writeText(window.location.href)
		.then(() => {
			toast.success('URL copied to clipboard!', {
				duration: 3000
			})
		})
		.catch(() => {
			toast.danger('Failed to copy URL', {
				duration: 3000
			})
		})
}

const showReportDialog = ref(false)
const reportReason = ref('')
const isLoading = ref(false)

const openReportDialog = () => {
	reportReason.value = ''
	showReportDialog.value = true
}

const closeReportDialog = () => {
	showReportDialog.value = false
}

const sendReport = () => {
	if (!reportReason.value.trim()) {
		toast.danger('Please enter a reason for reporting.', {duration: 3000})
		return
	}

	isLoading.value = true

	const reportData = {
		pasteId: window.location.pathname.split('/').pop(),
		reportReason: reportReason.value.trim()
	}

	window.fetch('/api/report/create', {
		method: 'POST',
		body: JSON.stringify(reportData),
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(async (response) => {
			const responseData = await response.json();
			if (response.ok && responseData.success) {
				toast.success('Report successfully created, thanks for helping to keep the community safe.', {duration: 3000});
				closeReportDialog();
			} else {
				toast.danger('Failed to create report: ' + responseData.message, {duration: 5000});
			}
		})
		.catch((error) => {
			console.error('Error creating report:', error);
			toast.danger('An error occurred while creating the report.', {duration: 5000});
		})
		.finally(() => {
			isLoading.value = false;
		});
}
</script>

<template>
	<section id="paste-actions" class="mt-8">
		<div class="flex items-center justify-between bg-slate-800 rounded-xl border border-slate-700 p-6">
			<div class="flex items-center space-x-4">
				<div v-if="loading">
					<div class="skeleton w-24 py-4"></div>
				</div>
				<Button v-else @click="openReportDialog">
					<svgo-exclamation class="text-lg my-0.5 "/>
					Report
				</Button>
				<div v-if="loading">
					<div class="skeleton w-24 py-4"></div>
				</div>
				<Button v-else variant="secondary" @click="copyUrl">
					<svgo-share class="text-lg my-0.5"/>
					Share
				</Button>
			</div>
			<SkeletonWrapper :loading="loading">
				<template #loader>
					<div class="skeleton w-32 py-4"></div>
				</template>
				<template #loaded>
					<div class="text-sm text-slate-400" contenteditable="false">
						Created by
						<NuxtLink
							:to="`/user/${author}`"
							class="text-primary" contenteditable="false">@{{ author }}
						</NuxtLink>
					</div>
				</template>
			</SkeletonWrapper>
		</div>

		<!-- Report Dialog -->
		<Transition name="fade">
			<div v-if="showReportDialog"
				 class="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
				<div class="bg-slate-900 rounded-lg p-6 w-full max-w-md mx-4">
					<h2 class="text-xl mb-4 font-semibold text-white">Report this paste</h2>
					<textarea
						v-model="reportReason"
						class="w-full rounded-md p-2 bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
						placeholder="Please enter the reason for reporting..."
						rows="4"
					></textarea>

					<div class="mt-4 flex justify-end space-x-3">
						<Button variant="secondary" @click="closeReportDialog">
							Cancel
						</Button>
						<Button variant="primary" @click="sendReport">
							<svgo-spinner v-if="isLoading" class="animate-spin text-lg my-0.5"/>
							<span v-else>Submit</span>
						</Button>
					</div>
				</div>
			</div>
		</Transition>
	</section>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
	transition: opacity 0.25s ease;
}

.fade-enter-from, .fade-leave-to {
	opacity: 0;
}
</style>
