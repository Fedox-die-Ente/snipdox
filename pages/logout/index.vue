<script lang="ts" setup>
const {signOut} = useAuth();


onMounted(async () => {
	try {
		await signOut({
			redirect: true,
			callbackUrl: "/"
		});
	} catch (error) {
		console.error('Error during logout:', error);
	}
});

</script>

<template>
	<div>
		<h1 class="text-2xl font-bold text-center mt-10">Logout</h1>
		<p class="text-center mt-4">You have been successfully logged out.</p>
		<p class="text-center mt-2">Redirecting to the homepage...</p>
	</div>
</template>