<script lang="ts" setup>
import PasteActionsSection from "~/components/PasteActionsSection.vue";
import {ref} from 'vue';
import type {Paste} from '~/types/types';

definePageMeta({
	auth: false
})

const route = useRoute();
const id = route.params.id as string;
const toast = useToast();

const showPasswordModal = ref(false);
const passwordInput = ref('');
const isVerifying = ref(false);
const passwordError = ref('');

const {data: initialData, pending: loading, error: initialError} = await useFetch<any>(`/api/paste/${id}`, {
	server: true
});

const requiresPassword = ref(initialData.value?.requiresPassword || false);
const paste = ref<Paste | null>(requiresPassword.value ? null : initialData.value);
const error = ref(initialError.value);

if (requiresPassword.value) {
	showPasswordModal.value = true;
}

const fetchWithPassword = async () => {
	if (!passwordInput.value) {
		passwordError.value = 'Please enter a password';
		return;
	}

	isVerifying.value = true;
	passwordError.value = '';

	try {
		const response = await $fetch<Paste>(`/api/paste/${id}`, {
			headers: {
				'x-paste-password': passwordInput.value
			}
		});

		paste.value = response;
		showPasswordModal.value = false;
		requiresPassword.value = false;
		toast.success('Password verified successfully!', {duration: 3000});
	} catch (err: any) {
		passwordError.value = err.data?.message || 'Invalid password';
		toast.danger('Invalid password', {duration: 3000});
	} finally {
		isVerifying.value = false;
	}
};

const createDescription = (paste: Paste) => {
	const parts = [];

	if (paste.language && paste.language !== 'text') {
		parts.push(`${paste.language.toUpperCase()} code snippet`);
	} else {
		parts.push('Code snippet');
	}

	if (paste.username) {
		parts.push(`shared by ${paste.username}`);
	} else {
		parts.push('shared anonymously');
	}

	if (paste.created_at) {
		const date = formatDate(paste.created_at);
		parts.push(`on ${date}`);
	}

	if (paste.content) {
		const lines = paste.content.split('\n').length;
		const chars = paste.content.length;
		parts.push(`(${lines} lines, ${chars} characters)`);
	}

	return parts.join(' ') + ' on Snipdox.';
};

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
};

if (paste.value && !requiresPassword.value) {
	const description = createDescription(paste.value);
	const title = paste.value.paste_title + ' — Snipdox';

	const detailedTitle = [
		paste.value.paste_title,
		paste.value.language && paste.value.language !== 'text' ? `(${paste.value.language.toUpperCase()})` : null,
		paste.value.username ? `by ${paste.value.username}` : null
	].filter(Boolean).join(' ') + ' — Snipdox';

	useHead({
		title: paste.value.paste_title,
		meta: [
			{
				name: 'description',
				content: description
			},
			{
				name: 'author',
				content: paste.value.username || 'Anonymous'
			},
			{
				name: 'keywords',
				content: [
					'code sharing',
					'paste',
					paste.value.language,
					'programming',
					paste.value.username
				].filter(Boolean).join(', ')
			}
		]
	});

	useSeoMeta({
		title: detailedTitle,
		description: description,

		ogTitle: detailedTitle,
		ogDescription: description,
		ogUrl: `https://snipdox.fedox.ovh/paste/${id}`,
		ogType: 'article',

		...(paste.value.username && {
			articleAuthor: paste.value.username,
		}),
		...(paste.value.created_at && {
			articlePublishedTime: paste.value.created_at,
		}),
		...(paste.value.language && {
			articleTag: paste.value.language,
		}),

		twitterCard: 'summary_large_image',
		twitterTitle: detailedTitle,
		twitterDescription: description,
		twitterSite: '@snipdox',
		...(paste.value.username && {
			twitterCreator: `@${paste.value.username}`,
		}),

		colorScheme: 'dark',

		robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
	});
}

const currentSection = ref<'code' | 'error'>('code');

const changeSection = (section: 'code' | 'error') => {
	currentSection.value = section;
};
</script>

<template>
	<main class="max-w-7xl mx-auto px-6 py-8 w-full">
		<div v-if="showPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
			<div class="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-md w-full mx-4">
				<div class="flex items-center mb-6">
					<svgo-lock class="text-primary text-3xl mr-3"/>
					<h2 class="text-2xl font-bold text-white">Password Required</h2>
				</div>
				
				<p class="text-slate-300 mb-6">
					This paste is private and requires a password to view.
				</p>
				
				<div class="mb-4">
					<label class="block text-sm font-medium text-slate-300 mb-2">
						Enter Password
					</label>
					<input
						v-model="passwordInput"
						type="password"
						class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
						placeholder="Enter password..."
						@keyup.enter="fetchWithPassword"
					/>
					<p v-if="passwordError" class="text-red-400 text-sm mt-2">
						{{ passwordError }}
					</p>
				</div>
				
				<div class="flex space-x-3">
					<Button variant="secondary" class="flex-1" @click="navigateTo('/')">
						Cancel
					</Button>
					<Button variant="primary" class="flex-1" :is-loading="isVerifying" @click="fetchWithPassword">
						<svgo-check class="text-lg my-0.5"/>
						Verify
					</Button>
				</div>
			</div>
		</div>

		<div v-if="loading">
			<PasteHeader :loading="true"/>
			<PasteTabs :loading="true"/>
			<PasteContentSection :loading="true"/>
			<PasteActionsSection :loading="true"/>
		</div>

		<div v-else-if="error">
			<p v-if="error.statusCode === 404" class="text-red-500">
				Paste not found. It may have been deleted or never existed.
			</p>
			<p v-else class="text-red-500">
				An error occurred while fetching the paste: {{ error.message }}
			</p>
		</div>

		<div v-else-if="paste">
			<PasteHeader
				:content="paste.content"
				:createdAt="paste.created_at"
				:expiration="paste.expiration"
				:language="paste.language"
				:title="paste.paste_title"
			/>

			<PasteTabs
				:current="currentSection"
				:hasError="!!paste.error_content"
				@change="changeSection"
			/>

			<section v-if="currentSection === 'code'" id="code-content">
				<PasteContentSection
					:content="paste.content"
					:language="paste.language"
					fileName="Unknown File"
				/>
			</section>

			<section v-else-if="currentSection === 'error'" id="error-content">
				<PasteErrorSection
					:error_details="paste.error_content"
					:error_title="paste.error_title"
				/>
			</section>

			<PasteActionsSection :author="paste.username"/>
		</div>
	</main>
</template>