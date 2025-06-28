<script lang="ts" setup>
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {basicSetup, EditorView} from 'codemirror'
import {EditorState} from '@codemirror/state'
import {javascript} from '@codemirror/lang-javascript'
import {python} from '@codemirror/lang-python'
import {java} from '@codemirror/lang-java'
import {cpp} from '@codemirror/lang-cpp'
import {go} from '@codemirror/lang-go'
import {rust} from '@codemirror/lang-rust'
import {php} from '@codemirror/lang-php'
import {sql} from '@codemirror/lang-sql'
import {html} from '@codemirror/lang-html'
import {css} from '@codemirror/lang-css'
import {json} from '@codemirror/lang-json'
import {xml} from '@codemirror/lang-xml'
import {markdown} from '@codemirror/lang-markdown'
import {yaml} from '@codemirror/lang-yaml'
import {StreamLanguage} from '@codemirror/language'
import {oneDark} from '@codemirror/theme-one-dark'
import {definePageMeta, useHead, useSeoMeta} from '#imports'
import {dart, kotlin, scala} from "@codemirror/legacy-modes/mode/clike";
import {swift} from "@codemirror/legacy-modes/mode/swift";
import {shell} from "@codemirror/legacy-modes/mode/shell";
import {r} from "@codemirror/legacy-modes/mode/r";
import {perl} from "@codemirror/legacy-modes/mode/perl";
import {lua} from "@codemirror/legacy-modes/mode/lua";

definePageMeta({
	auth: true
})

useHead({
	title: "Create Paste"
})


useSeoMeta({
	title: "Create Paste",
	description: "Create a new paste on Snipdox",
})

const expirationTypes = [
	{
		name: '1 Hour',
		id: '1h'
	},
	{
		name: '1 Day',
		id: '1d'
	},
	{
		name: '1 Week',
		id: '1w'
	},
	{
		name: 'Never',
		id: 'never'
	}
]

const form = ref({
	title: '',
	language: '',
	expirationType: '1h',
	codeContent: '',
	errorTitle: '',
	errorDetails: '',
	isPrivate: false,
})
const isLoading = ref(false)
const toast = useToast()
const onSubmit = () => {
	isLoading.value = true;
	if (!form.value.title) form.value.title = 'Untitled Paste'
	if (!form.value.language) form.value.language = 'plaintext'

	if (!form.value.codeContent) {
		toast.danger('Please enter some code content.', {
			duration: 5000
		})
		isLoading.value = false
		return
	}

	const data = {
		title: form.value.title,
		language: form.value.language,
		expirationType: form.value.expirationType,
		codeContent: form.value.codeContent,
		errorTitle: form.value.errorTitle,
		errorDetails: form.value.errorDetails,
		isPrivate: form.value.isPrivate,
	}

	window.fetch('/api/paste/create', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(async (response) => {
			const responseData = await response.json();
			if (response.ok && responseData.success) {
				toast.success('Paste created successfully!', {duration: 5000});
				navigateTo(`/paste/${responseData.pasteId}`);
			} else {
				toast.danger('Failed to create paste: ' + responseData.message, {duration: 5000});
			}
		})
		.catch((error) => {
			console.error('Error creating paste:', error);
			toast.danger('An error occurred while creating the paste.', {duration: 5000});
		})
		.finally(() => {
			isLoading.value = false;
		});

}

const lineCount = ref(1)
const charCount = ref(0)

const updateCounts = () => {
	const codeContent = form.value.codeContent || ''
	lineCount.value = codeContent.split('\n').length
	charCount.value = codeContent.length
}

watch(() => form.value.codeContent, updateCounts)

// CodeMirror setup
const editorContainer = ref<HTMLDivElement | null>(null)
let editorView: EditorView | null = null

const getLanguageExtension = (language: string) => {
	switch (language) {
		case 'javascript':
			return javascript()
		case 'typescript':
			return javascript({typescript: true})
		case 'python':
			return python()
		case 'java':
			return java()
		case 'csharp':
			return StreamLanguage.define(kotlin) // C# uses similar syntax to Kotlin mode
		case 'cpp':
		case 'c':
			return cpp()
		case 'go':
			return go()
		case 'rust':
			return rust()
		case 'php':
			return php()
		case 'ruby':
			return StreamLanguage.define(shell) // Ruby mode fallback
		case 'swift':
			return StreamLanguage.define(swift)
		case 'kotlin':
			return StreamLanguage.define(kotlin)
		case 'scala':
			return StreamLanguage.define(scala)
		case 'dart':
			return StreamLanguage.define(dart)
		case 'r':
			return StreamLanguage.define(r)
		case 'perl':
			return StreamLanguage.define(perl)
		case 'lua':
			return StreamLanguage.define(lua)
		case 'html':
			return html()
		case 'css':
			return css()
		case 'sql':
			return sql()
		case 'json':
			return json()
		case 'xml':
			return xml()
		case 'yaml':
			return yaml()
		case 'markdown':
			return markdown()
		case 'shell':
		case 'bash':
			return StreamLanguage.define(shell)
		case 'powershell':
			return StreamLanguage.define(shell)
		case 'dockerfile':
			return StreamLanguage.define(shell) // Dockerfile uses shell-like syntax
		case 'plaintext':
		default:
			return []
	}
}

const initializeEditor = () => {
	if (!editorContainer.value) return

	const extensions = [
		basicSetup,
		oneDark,
		getLanguageExtension(form.value.language),
		EditorView.updateListener.of((update) => {
			if (update.docChanged) {
				form.value.codeContent = update.state.doc.toString()
			}
		}),
		EditorView.theme({
			'&': {
				fontSize: '14px',
				fontFamily: 'JetBrains Mono, monospace',
			},
			'.cm-content': {
				padding: '24px',
				minHeight: '384px', // h-96 equivalent
				caretColor: 'white',
			},
			'.cm-focused': {
				outline: 'none',
			},
			'.cm-editor': {
				borderRadius: '0',
			},
			'.cm-scroller': {
				fontFamily: 'JetBrains Mono, monospace',
			}
		})
	]

	const state = EditorState.create({
		doc: form.value.codeContent,
		extensions
	})

	editorView = new EditorView({
		state,
		parent: editorContainer.value
	})
}

const updateEditorLanguage = () => {
	if (!editorView) return

	const currentContent = editorView.state.doc.toString()

	const extensions = [
		basicSetup,
		oneDark,
		getLanguageExtension(form.value.language),
		EditorView.updateListener.of((update) => {
			if (update.docChanged) {
				form.value.codeContent = update.state.doc.toString()
			}
		}),
		EditorView.theme({
			'&': {
				fontSize: '14px',
				fontFamily: 'JetBrains Mono, monospace',
			},
			'.cm-content': {
				padding: '24px',
				minHeight: '384px',
				caretColor: 'white',
			},
			'.cm-focused': {
				outline: 'none',
			},
			'.cm-editor': {
				borderRadius: '0',
			},
			'.cm-scroller': {
				fontFamily: 'JetBrains Mono, monospace',
			}
		})
	]

	const newState = EditorState.create({
		doc: currentContent,
		extensions
	})

	editorView.setState(newState)
}

watch(() => form.value.language, updateEditorLanguage)

onMounted(() => {
	window.addEventListener('beforeunload', handleBeforeUnload)
	nextTick(() => {
		initializeEditor()
	})
})

onBeforeUnmount(() => {
	window.removeEventListener('beforeunload', handleBeforeUnload)
	if (editorView) {
		editorView.destroy()
	}
})

function handleBeforeUnload(event: BeforeUnloadEvent) {
	if (form.value.title || form.value.codeContent || form.value.errorTitle || form.value.errorDetails) {
		event.preventDefault()
		event.returnValue = ''
		return ''
	}
}

const privateCheckbox = ref<HTMLInputElement | null>(null);
const isFullscreen = ref(false)

function toggleFullscreen() {
	if (!editorContainer.value) return

	const el = editorContainer.value as HTMLElement & {
		webkitRequestFullscreen?: () => void
		msRequestFullscreen?: () => void
		requestFullscreen?: () => void
	}

	if (!isFullscreen.value) {
		if (el.requestFullscreen) {
			el.requestFullscreen()
		} else if (el.webkitRequestFullscreen) {
			el.webkitRequestFullscreen()
		} else if (el.msRequestFullscreen) {
			el.msRequestFullscreen()
		}
		isFullscreen.value = true
	} else {
		const d = document as Document & {
			webkitExitFullscreen?: () => void
			msExitFullscreen?: () => void
		}

		if (document.exitFullscreen) {
			document.exitFullscreen()
		} else if (d.webkitExitFullscreen) {
			d.webkitExitFullscreen()
		} else if (d.msExitFullscreen) {
			d.msExitFullscreen()
		}
		isFullscreen.value = false
	}
}

window.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && isFullscreen.value) {
		toggleFullscreen()
	}
})

document.addEventListener('fullscreenchange', () => {
	if (!document.fullscreenElement) {
		isFullscreen.value = false
	}
})
</script>

<template>
	<div class="flex flex-col gap-8 text-center max-w-4xl w-full mb-12 mt-12">
		<!-- Title Header -->
		<div class="flex flex-col gap-2 items-center">
			<h1 class="text-3xl font-bold">
				Create New Paste
			</h1>
			<p class="text-xl text-slate-300">
				Share your code and errors with others by creating a new paste.
			</p>
		</div>

		<!-- Paste Details -->
		<div id="paste-form" class="flex flex-col space-y-6">
			<section class="w-full p-6 space-y-6 border border-slate-700 rounded-lg bg-slate-800 text-left">
				<h3 class="text-xl font-semibold text-white mb-4 flex items-center gap-2">
					<svgo-info class="text-primary text-xl my-1"/>
					Paste Details
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label class="block text-sm font-medium text-slate-300 mb-2">
							Title
						</label>
						<input id="paste-title" ref="privateCheckbox" v-model="form.title"
							   class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
							   placeholder="Enter paste title..."/>
					</div>
					<div>
						<label class="block text-sm font-medium text-slate-300 mb-2">
							Language
						</label>
						<select id="language-select" v-model="form.language"
								class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
							<option value="">Select Language</option>
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
				<div class="mt-6">
					<label class="block text-sm font-medium text-slate-300 mb-2">Expiration</label>
					<div class="grid grid-cols md:grid-cols-4 gap-3">
						<label
							v-for="time in expirationTypes"
							:key="time.id" class="flex items-center p-3 bg-slate-700 rounded-lg border border-slate-600 hover:border-primary cursor-pointer transition-colors"
							@click="form.expirationType = time.id">
							<input v-model="form.expirationType" :value="time.id" class="sr-only" name="expiration"
								   type="radio"/>
							<div :class="{
									'border-primary': form.expirationType === time.id,
									'border-slate-500': form.expirationType !== time.id
								}"
								 class="w-4 h-4 border-2  rounded-full mr-3 flex items-center justify-center">
								<div v-if="form.expirationType === time.id"
									 class="w-2 h-2 bg-primary rounded-full hidden"
									 style="display: block;"></div>
							</div>
							<span class="text-sm text-slate-300">
								{{ time.name }}
							</span>
						</label>
					</div>
				</div>
			</section>
			<section class="w-full bg-slate-800 border border-slate-700 rounded-lg">
				<div class="flex items-center justify-between px-6 py-3 border-b border-slate-700 bg-slate-750">
					<div class="text-lg font-semibold flex items-center gap-2">
						<svgo-code class="text-2xl text-primary my-0.5"/>
						<h3 class="font-semibold">Code Content</h3>
					</div>
					<div class="flex items-center space-x-2">
						<button
							class="px-3 py-1 text-xs flex items-center cursor-pointer bg-slate-600 text-slate-300 rounded hover:bg-slate-500 transition-colors"
							type="button"
							@click="toggleFullscreen"
						>
							<svgo-fullscreen class="mr-1"/>
							Fullscreen
						</button>
					</div>
				</div>
				<div class="relative">
					<div
						ref="editorContainer"
						class="w-full bg-slate-800 text-white font-jetbrains-mono text-sm text-left"
					></div>
					<div class="absolute top-4 right-3 text-xs text-slate-500 z-10 pointer-events-none">
						<span id="line-count">
							{{ lineCount }} line{{ lineCount === 1 ? '' : 's' }}
						</span>
						•
						<span id="char-count">
							{{ charCount }} character{{ charCount === 1 ? '' : 's' }}
						</span>
					</div>
				</div>
			</section>
			<section id="error-section" class="bg-slate-800 rounded-xl border border-slate-700 text-left">
				<div
					class="flex items-center justify-between px-6 py-3 border-b border-slate-700 bg-slate-750 text-left">
					<h3 class="text-lg font-semibold text-white flex items-center" contenteditable="false">
						<svgo-error class="text-red-400 mr-2 text-2xl"/>
						Error Log <span class="text-sm text-slate-400 font-normal ml-2" contenteditable="false">(Optional)</span>
					</h3>
				</div>
				<div class="p-6">
					<div class="mb-4">
						<div class="mb-4">
							<label class="block text-sm font-medium text-slate-300 mb-2" contenteditable="false">Error
								Title</label>
							<input id="error-title" v-model="form.errorTitle" class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
								   placeholder="e.g., FileNotFoundError, Syntax Error..."
								   type="text">
						</div>
					</div>
					<div>
						<label class="block text-sm font-medium text-slate-300 mb-2" contenteditable="false">Error
							Details</label>
						<textarea id="error-details" v-model="form.errorDetails"
								  class="w-full h-32 p-4 bg-slate-700 border border-slate-600 rounded-lg text-white font-jetbrains-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-slate-500 section-clickable"
								  placeholder="Paste error traceback, logs, or description..."></textarea>
					</div>
				</div>
			</section>
			<section id="form-actions" class="flex items-center justify-between">
				<div class="flex items-center space-x-4">
					<label class="flex items-center cursor-pointer" for="private-paste">
						<div
							:class="{
      'bg-primary': form.isPrivate,
      'border-slate-600': !form.isPrivate,
      'border-primary': form.isPrivate
    }"
							class="w-5 h-5 border-2 rounded mr-3 flex items-center justify-center"
						>
							<svgo-check v-if="form.isPrivate" class="text-white text-xs my-0.5"/>
						</div>
						<span class="text-sm text-slate-300">Private paste (WIP)</span>
					</label>

					<input
						id="private-paste"
						v-model="form.isPrivate"
						class="sr-only"
						type="checkbox"
					/>
				</div>
				<div class="flex items-center space-x-3">
					<Button variant="secondary" @click="navigateTo('/')">
						Cancel
					</Button>
					<Button :is-loading="isLoading" variant="primary" @click="onSubmit">
						<svgo-plus class="text-lg my-0.5"/>
						Create Paste
					</Button>
				</div>
			</section>
		</div>
	</div>
</template>

<style>
.ͼo {
	background-color: #1e293b; /* bg-slate-800 */
	font-family: "JetBrains Mono", monospace !important;
}

.ͼo .cm-gutters {
	background-color: #1e293b; /* bg-slate-800 */
	color: #9ca3af; /* text-slate-400 */
}

.ͼo .cm-activeLineGutter {
	background-color: #374151; /* bg-slate-700 */
}

.cm-content {
	font-family: "JetBrains Mono", monospace !important;
}
</style>