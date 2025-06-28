<template>
	<div class="flex flex-col items-center justify-center">
		<div class="p-14 bg-slate-800 border border-slate-700 rounded-lg flex flex-col items-center justify-center space-y-4">
			<div class="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
				<svgo-lock class="text-2xl text-primary"/>
			</div>
			<h1 class="font-bold text-4xl">
				Invite Only
			</h1>
			<p class="text-xl text-slate-400 max-w-2xl text-center leading-relaxed">
				Snipdox is currently restricted to invited users only. You'll need a special invitation to use this site.
			</p>

			<Button v-if="status == 'unauthenticated'" variant="primary" @click="signIn('github')" class="mt-4 flex flex-row items-center justify-center gap-2">
				<svgo-github-mark-white class="text-md text-white my-0.5"/>
				Sign In with GitHub
			</Button>
			<Button v-else variant="primary" @click="signOut" class="mt-4 flex flex-row items-center justify-center gap-2">
				Sign Out
			</Button>
		</div>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ auth: false })
const { signIn, status, signOut } = useAuth()

useHead({
	title: "Home"
})
</script>
