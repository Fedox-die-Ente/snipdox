<script lang="ts" setup>
useHead({
	title: "Imprint",
});

definePageMeta({
	auth: false,
});

const selectedLanguage = ref("en");
const availableLanguages = ref([
	{code: "en", name: "English"},
	{code: "de", name: "Deutsch"},
]);


const imprintText = ref<{ address: string; phone: string; email: string }>({
	address: '',
	phone: '',
	email: '',
});

onMounted(async () => {
	const response = await fetch('/legal/imprint.json');
	imprintText.value = await response.json();
});
</script>

<template>
	<div class="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-8">
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

		<div class="text-center">
			<h1 class="text-3xl font-semibold text-primary mb-2">
				{{ selectedLanguage === 'de' ? 'Allgemeine Informationen' : 'General information' }}
			</h1>

			<div class="text-slate-300 leading-relaxed">
				<pre class="whitespace-pre-wrap">{{ imprintText.address }}</pre>
			</div>
		</div>

		<div class="text-center">
			<h2 class="text-2xl font-semibold text-primary mb-2">
				{{ selectedLanguage === 'de' ? 'Kontakt' : 'Contact' }}
			</h2>

			<p class="text-slate-300 leading-relaxed">
				{{ selectedLanguage === 'de' ? 'Telefon' : 'Telephone' }}:
				<span class="font-medium text-slate-300">{{ imprintText.phone }}</span>
				<span class="text-primary">*</span><br/>
				E-Mail:
				<a :href="`mailto:${imprintText.email}`" class="text-blue-600 hover:underline">{{
						imprintText.email
					}}</a>
			</p>
			<p class="mt-4 text-xs text-red-500 font-semibold">
				<span class="text-primary">*</span>
				{{
					selectedLanguage === 'de' ? 'Unter dieser Telefonnummer ist kein technischer Support verfügbar.' : 'Under this telephone number, no technical support is available.'
				}}
				<br/>
				<span class="text-primary">*</span>
				{{
					selectedLanguage === 'de' ? 'Für geschäftliche Anfragen bitte eine E-Mail senden.' : 'For business inquiries, please send an email.'
				}}
			</p>
		</div>
	</div>
</template>


<style scoped>
h1 {
	font-size: 2rem;
	font-weight: bold;
	color: #6366F1; /* Primary color */
	margin-bottom: 1rem;
}

@media (max-width: 600px) {
	h1 {
		font-size: 1.5rem;
	}
}

h2 {
	font-size: 1.5rem;
	font-weight: bold;
	color: #6366F1; /* Primary color */
	margin-top: 1.5rem;
}

@media (max-width: 600px) {
	h2 {
		font-size: 1.25rem;
	}
}

h3 {
	font-size: 1.25rem;
	font-weight: bold;
	color: #6366F1; /* Primary color */
	margin-top: 1.25rem;
}

@media (max-width: 600px) {
	h3 {
		font-size: 1rem;
	}
}

p {
	font-size: 1rem;
	color: #ffffff; /* Slate color */
	line-height: 1.5;
	margin-bottom: 1rem;
}

@media (max-width: 600px) {
	p {
		font-size: 0.875rem;
	}
}

ul {
	list-style-type: disc;
	margin-left: 1.5rem;
	color: #ffffff; /* Slate color */
}

@media (max-width: 600px) {
	ul {
		margin-left: 1rem;
	}
}

li {
	margin-bottom: 0.5rem;
}

@media (max-width: 600px) {
	li {
		font-size: 0.875rem;
	}
}

</style>