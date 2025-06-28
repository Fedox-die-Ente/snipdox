<script lang="ts" setup>
useHead({
	title: "Privacy Policy",
});

definePageMeta({
	auth: false,
});

const selectedLanguage = ref("en");
const availableLanguages = ref([
	{code: "en", name: "English"},
	{code: "de", name: "Deutsch"},
]);

const privacyHtml = ref('');

async function loadPrivacyHtml(lang: string) {
	try {
		const res = await fetch(`/legal/privacy/privacy-${lang}.html`);
		if (!res.ok) {
			privacyHtml.value = '<p>Could not load privacy policy.</p>';
			return;
		}
		privacyHtml.value = await res.text();
	} catch {
		privacyHtml.value = '<p>Error loading privacy policy.</p>';
	}
}

onMounted(() => loadPrivacyHtml(selectedLanguage.value));
watch(selectedLanguage, (newLang) => loadPrivacyHtml(newLang));
</script>

<template>
	<div class="mx-auto px-6 py-10 flex flex-col gap-8">
		<div class="flex justify-center gap-4">
			<button
				v-for="language in availableLanguages"
				:key="language.code"
				:class="[
          'px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-colors duration-200',
          selectedLanguage === language.code
            ? 'bg-primary text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
        ]"
				@click="selectedLanguage = language.code"
			>
				{{ language.name }}
			</button>
		</div>

		<div v-if="selectedLanguage === 'de'" class="text-left break-words wrap-break-word max-w-full">
			<div class="text-slate-300 leading-relaxed privacy-content" v-html="privacyHtml"></div>
		</div>
		<div v-else class="text-left">
			<div class="text-slate-300 leading-relaxed privacy-content" v-html="privacyHtml"></div>
		</div>
	</div>
</template>

<style>
.privacy-content h1 {
	font-size: 2rem;
	font-weight: bold;
	color: #6366F1; /* Primary color */
	margin-bottom: 1rem;
}

@media (max-width: 600px) {
	.privacy-content h1 {
		font-size: 1.5rem;
	}
}

.privacy-content h2 {
	font-size: 1.5rem;
	font-weight: bold;
	color: #6366F1; /* Primary color */
	margin-top: 1.5rem;
}

@media (max-width: 600px) {
	.privacy-content h2 {
		font-size: 1.25rem;
	}
}

.privacy-content h3 {
	font-size: 1.25rem;
	font-weight: bold;
	color: #6366F1; /* Primary color */
	margin-top: 1.25rem;
}

@media (max-width: 600px) {
	.privacy-content h3 {
		font-size: 1rem;
	}
}

.privacy-content p {
	font-size: 1rem;
	color: #ffffff; /* Slate color */
	line-height: 1.5;
	margin-bottom: 1rem;
}

@media (max-width: 600px) {
	.privacy-content p {
		font-size: 0.875rem;
	}
}

.privacy-content ul {
	list-style-type: disc;
	margin-left: 1.5rem;
	color: #ffffff; /* Slate color */
}

@media (max-width: 600px) {
	.privacy-content ul {
		margin-left: 1rem;
	}
}

.privacy-content li {
	margin-bottom: 0.5rem;
}

@media (max-width: 600px) {
	.privacy-content li {
		font-size: 0.875rem;
	}
}

</style>