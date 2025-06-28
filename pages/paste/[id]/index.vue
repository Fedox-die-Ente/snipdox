<script lang="ts" setup>
import PasteActionsSection from "~/components/PasteActionsSection.vue";
import {onMounted, ref} from 'vue';
import {useHead, useRoute} from '#imports';
import type {Paste} from '~/types/types';

definePageMeta({
	auth: false
})

const route = useRoute();
const id = route.params.id as string;

const paste = ref<Paste | null>(null) as any;
const loading = ref(true);
const error = ref<Error | null>(null);

const currentSection = ref<'code' | 'error'>('code');

const changeSection = (section: 'code' | 'error') => {
	currentSection.value = section;
};

onMounted(async () => {
	try {
		const response = await $fetch<Paste>(`/api/paste/${id}`);
		paste.value = response;

		useHead({
			title: response.paste_title,
			meta: [
				{
					name: 'description',
					content: `Paste content for ${response.paste_title}`
				}
			]
		});
	} catch (err) {
		error.value = err as Error;
	} finally {
		loading.value = false;
	}
});
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
			<p v-if="error.message.contains('404')" class="text-red-500">
				Paste not found. It may have been deleted or never existed.
			</p>
			<p v-else class="text-red-500">
				An error occurred while fetching the paste: {{ error.message }}
			</p>
		</div>

		<div v-else>
			<PasteHeader
				:content="paste!.content"
				:createdAt="paste!.created_at"
				:expiration="paste!.expiration"
				:language="paste!.language"
				:title="paste!.paste_title"
			/>
			<PasteTabs
				:current="currentSection"
				:hasError="!!paste!.error_content"
				@change="changeSection"
			/>
			<section v-if="currentSection === 'code'" id="code-content">
				<PasteContentSection
					:content="paste!.content"
					:language="paste!.language"
					fileName="Unknown File"
				/>
			</section>
			<section v-else-if="currentSection === 'error'" id="error-content">
				<PasteErrorSection :error_details="paste!.error_content" :error_title="paste!.error_title"/>
			</section>
			<PasteActionsSection :author="paste!.username"/>
		</div>
	</main>
</template>
