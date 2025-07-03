<script lang="ts" setup>
const {status, data, signOut} = useAuth()
</script>


<template>
	<div class="py-4 px-16 border-b border-slate-700 bg-slate-800 text-white mt-auto">
		<div class="flex flex-row justify-between items-center">
			<div class="flex items-center space-x-3 cursor-pointer" @click="navigateTo('/')">
				<div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
					<svgo-code class="text-white text-xl my-0.5"/>
				</div>
				<h1 class="text-xl font-bold text-white">Snipdox</h1>
			</div>
			<div v-if="status === 'authenticated'" class="flex flex-row gap-4 items-center justify-center">
				<Button variant="primary" @click="navigateTo('/create')">
					<svgo-plus class="text-lg text-white my-0.5"/>
					New Paste
				</Button>
				<Button variant="secondary" @click="navigateTo('/pastes')">
					<svgo-list class="text-lg text-slate-300 my-0.5"/>
					My Pastes
				</Button>
				<Button variant="secondary" @click="navigateTo('/profile')">
					<svgo-human class="text-lg text-slate-300 my-0.5"/>
					Profile
				</Button>
				<button class="p-2 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer" @click="signOut">
					<svgo-logout class="text-lg text-white my-0.5"/>
				</button>
			</div>
		</div>
	</div>
</template>

