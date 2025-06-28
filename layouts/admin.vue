<template>
	<Body class="min-h-screen bg-white p-6 w-screen">
	<div class="flex items-center justify-between">
		<NuxtLink class="text-2xl" to="/">Snipdox Admin</NuxtLink>
		<NuxtLink class="text-lg font-semibold" to="/admin/pastes">Pastes</NuxtLink>
		<NuxtLink class="text-lg font-semibold" to="/admin/users">Users</NuxtLink>
		<NuxtLink class="text-lg font-semibold" to="/admin/reports">Reports</NuxtLink>
		<NuxtLink class="text-lg font-semibold" to="/admin/allowed">Allowed</NuxtLink>
	</div>
	<div class="w-full h-2 bg-slate-700"/>
	<slot class="w-screen"/>
	</Body>
</template>
<script setup>

</script>