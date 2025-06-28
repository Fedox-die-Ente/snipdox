<script lang="ts" setup>

definePageMeta({auth: true});

useHead({title: 'My Pastes'});

const route = useRoute();
const router = useRouter();

const page = computed(() => Number(route.query.page || 1));
const pageSize = 5;

const {data: pasteData, pending, refresh} = await useLazyAsyncData(
	`user-pastes-${page.value}`,
	() => $fetch(`/api/paste/get?page=${page.value}&pageSize=${pageSize}`),
	{
		watch: [page],
		server: false,
	}
);

const pastes = computed(() => pasteData.value?.pastes || []);
const totalCount = computed(() => pasteData.value?.totalCount || 0);
const totalPages = computed(() => pasteData.value?.totalPages || 1);
const totalCountPublic = computed(() => pasteData.value?.publicCount || 0);
const totalCountPrivate = computed(() => pasteData.value?.privateCount || 0);

console.log('Pastes:', pastes.value);

watch(() => route.query.page, () => {
	refresh();
});

onMounted(() => {
	if (!pasteData.value) {
		refresh();
	}
});

</script>

<template>
	<main class="max-w-7xl mx-auto px-6 py-8 w-full">
		<section id="page-header" class="mb-8">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold text-white mb-2">My Pastes</h1>
					<p class="text-slate-400">Manage all your code snippets and pastes</p>
				</div>
				<div class="flex items-center space-x-3">
					<div class="relative">
						<input
							class="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-slate-400 focus:outline-none focus:border-primary transition-colors"
							placeholder="Search pastes..."
						/>
						<svgo-search class="absolute left-3 top-3 text-slate-400 text-lg"/>
					</div>
					<select
						class="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
						<option value="all">All Languages</option>
						<option value="javascript">JavaScript</option>
						<option value="typescript">TypeScript</option>
						<option value="python">Python</option>
						<option value="java">Java</option>
						<option value="csharp">C#</option>
						<option value="cpp">C++</option>
						<option value="c">C</option>
						<option value="go">Go</option>
						<option value="rust">Rust</option>
						<option value="php">PHP</option>
						<option value="ruby">Ruby</option>
						<option value="swift">Swift</option>
						<option value="kotlin">Kotlin</option>
						<option value="scala">Scala</option>
						<option value="dart">Dart</option>
						<option value="r">R</option>
						<option value="perl">Perl</option>
						<option value="lua">Lua</option>
						<option value="html">HTML</option>
						<option value="css">CSS</option>
						<option value="sql">SQL</option>
						<option value="json">JSON</option>
						<option value="xml">XML</option>
						<option value="yaml">YAML</option>
						<option value="markdown">Markdown</option>
						<option value="shell">Shell/Bash</option>
						<option value="powershell">PowerShell</option>
						<option value="dockerfile">Dockerfile</option>
						<option value="plaintext">Plain Text</option>
					</select>
				</div>
			</div>
		</section>

		<section id="stats-overview" class="mb-8">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<PastesStatsCard
					:amount="totalCount"
					icon="svgo-file"
					icon-bg-color="bg-primary/20"
					icon-color="text-primary"
					title="Total Pastes"
				/>
				<PastesStatsCard
					:amount="totalCountPublic"
					icon="svgo-file"
					icon-bg-color="bg-blue-500/20"
					icon-color="text-blue-400"
					title="Public"
				/>
				<PastesStatsCard
					:amount="totalCountPrivate"
					icon="svgo-file"
					icon-bg-color="bg-yellow-500/20"
					icon-color="text-yellow-400"
					title="Private"
				/>
			</div>
		</section>

		<section id="paste-list" class="space-y-4">
			<div v-if="pending" class="flex justify-center items-center py-12">
				<div class="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
			</div>

			<template v-else>
				<PastesCard
					v-for="paste in pastes"
					:id="paste.id"
					:key="paste.id"
					:content="paste.content"
					:createdAt="paste.created_at"
					:expiration="paste.expiration"
					:isPrivate="paste.private"
					:language="paste.language"
					:title="paste.paste_title"
					@refreshPastes="refresh"
				/>

				<div v-if="pastes.length === 0" class="text-center text-slate-400">
					<p>No pastes found.</p>
				</div>
			</template>
		</section>

		<section id="pagination" class="mt-8 flex items-center justify-between">
			<p class="text-sm text-slate-400">
				Showing {{ pastes.length }} of {{ totalCount }} pastes
			</p>
			<div class="flex items-center space-x-2">
				<button
					:disabled="page <= 1"
					class="px-3 py-2 border border-slate-600 text-slate-400 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
					@click="router.push({ query: { page: page - 1 } })"
				>
					<svgo-chevron-left class="text-lg my-0.5"/>
				</button>
				<button
					v-for="n in totalPages"
					:key="n"
					:class="{
            'bg-primary text-white': n === page,
            'border border-slate-600 text-slate-400 hover:bg-slate-700': n !== page
          }"
					class="px-3 py-2 rounded-lg"
					@click="router.push({ query: { page: n } })"
				>
					{{ n }}
				</button>
				<button
					:disabled="page >= totalPages"
					class="px-3 py-2 border border-slate-600 text-slate-400 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
					@click="router.push({ query: { page: page + 1 } })"
				>
					<svgo-chevron-right class="text-lg my-0.5"/>
				</button>
			</div>
		</section>
	</main>
</template>