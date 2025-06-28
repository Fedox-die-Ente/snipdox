<template>
	<footer class="py-4 px-16 border-t border-slate-700 bg-slate-800 text-slate-400">
		<div class="flex flex-col md:flex-row justify-between items-center">
			<div class="flex items-center space-x-3">
				© 2025 Florian Ohldag. All rights reserved.
			</div>
			<div class="flex flex-row gap-8 items-center justify-center cursor-pointer">
				<p class="hover:text-white transition-colors" rel="noopener noreferrer"
				   @click="navigateTo('/legal/imprint')">
					Imprint
				</p>
				<p class="hover:text-white transition-colors" rel="noopener noreferrer"
				   @click="navigateTo('/legal/privacy')">
					Privacy Policy
				</p>
				<a class="hover:text-white transition-colors" href="https://github.com/Fedox-die-Ente" rel="noopener noreferrer"
				   target="_blank">
					GitHub
				</a>
			</div>
		</div>
	</footer>
</template>
