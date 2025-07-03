<script lang="ts" setup>
const {app} = useAppConfig();

useHead({
	title: app.name,
	titleTemplate: `%s - ${app.name}`,
})

useSeoMeta({
	title: app.name + ' — Another Code-Sharing Platform',
	description: app.name + ' is a code-sharing platform that allows you to share code snippets with others.',
	robots: 'index, follow',
	ogTitle: app.name + ' — Another Code-Sharing Platform',
	ogDescription: app.name + ' is a code-sharing platform that allows you to share code snippets with others.',
	ogType: 'website',
	ogUrl: 'https://snipdox.fedox.ovh',
	twitterTitle: app.name + ' — Another Code-Sharing Platform',
	twitterDescription: app.name + ' is a code-sharing platform that allows you to share code snippets with others.',
	themeColor: "#6366F1",
})

</script>

<template>
	<Html class="min-h-screen">
	<Body class="bg-slate-900 text-white min-h-screen">
	<NuxtLayout>
		<NuxtPage/>
	</NuxtLayout>
	</Body>
	</Html>
</template>
