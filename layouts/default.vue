<template>
	<div class="min-h-screen flex flex-col w-full">
		<Navbar/>
		<main class="flex-grow flex justify-center w-full">
			<slot/>
		</main>
		<Footer/>
	</div>
</template>