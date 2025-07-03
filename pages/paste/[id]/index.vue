<script lang="ts" setup>
import PasteActionsSection from "~/components/PasteActionsSection.vue";
import {ref} from 'vue';
import type {Paste} from '~/types/types';

definePageMeta({
	auth: false
})

const route = useRoute();
const id = route.params.id as string;

const {data: paste, pending: loading, error} = await useFetch<Paste>(`/api/paste/${id}`, {
	server: true
});

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

if (paste.value) {
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