<script lang="ts" setup>
import {nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {basicSetup, EditorView} from "codemirror";
import {javascript} from "@codemirror/lang-javascript";
import {python} from "@codemirror/lang-python";
import {java} from "@codemirror/lang-java";
import {StreamLanguage} from "@codemirror/language";
import {dart, kotlin, scala} from "@codemirror/legacy-modes/mode/clike";
import {cpp} from "@codemirror/lang-cpp";
import {go} from "@codemirror/lang-go";
import {rust} from "@codemirror/lang-rust";
import {php} from "@codemirror/lang-php";
import {shell} from "@codemirror/legacy-modes/mode/shell";
import {swift} from "@codemirror/legacy-modes/mode/swift";
import {r} from "@codemirror/legacy-modes/mode/r";
import {perl} from "@codemirror/legacy-modes/mode/perl";
import {lua} from "@codemirror/legacy-modes/mode/lua";
import {html} from "@codemirror/lang-html";
import {css} from "@codemirror/lang-css";
import {sql} from "@codemirror/lang-sql";
import {json} from "@codemirror/lang-json";
import {xml} from "@codemirror/lang-xml";
import {yaml} from "@codemirror/lang-yaml";
import {markdown} from "@codemirror/lang-markdown";
import {oneDark} from "@codemirror/theme-one-dark";
import {EditorState} from "@codemirror/state";
import {dockerFile} from "@codemirror/legacy-modes/mode/dockerfile";

const props = defineProps({
	fileName: {
		type: String,
		default: 'main.py'
	},
	language: {
		type: String,
		default: 'Python'
	},
	content: {
		type: String,
		default: ''
	},
	loading: {
		type: Boolean,
		default: false
	}
})

const toast = useToast()

const copyContent = () => {
	navigator.clipboard.writeText(props.content)
		.then(() => {
			toast.success('Content copied to clipboard!', {
				duration: 3000
			})
		})
		.catch(err => {
			toast.danger('Failed to copy content', {
				duration: 3000
			})
		})
}

const downloadContent = () => {
	const blob = new Blob([props.content], {type: 'text/plain'})
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = props.fileName
	document.body.appendChild(a)
	a.click()
	document.body.removeChild(a)
	URL.revokeObjectURL(url)
}

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
			return StreamLanguage.define(dockerFile) // Dockerfile uses shell-like syntax
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
		getLanguageExtension(props.language),
		EditorView.updateListener.of((update) => {
			if (update.docChanged) {
				props.content = update.state.doc.toString()
			}
		}),
		EditorView.theme({
			'&': {
				fontSize: '14px',
				fontFamily: 'JetBrains Mono, monospace',
				backgroundColor: '#1e293b', // slate-800
			},
			'.cm-content': {
				padding: '24px',
				minHeight: '384px', // h-96 equivalent
				caretColor: 'white',
				backgroundColor: '#1e293b', // slate-800
			},
			'.cm-gutters': {
				backgroundColor: '#1e293b', // slate-800
				color: '#9ca3af', // slate-400
				borderRight: '1px solid #374151', // slate-700
			},
			'.cm-activeLineGutter': {
				backgroundColor: '#374151', // slate-700
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
		doc: props.content,
		extensions
	})

	editorView = new EditorView({
		state,
		parent: editorContainer.value,
	})
}
const updateEditorLanguage = () => {
	if (!editorView) return

	const currentContent = editorView.state.doc.toString()

	const extensions = [
		basicSetup,
		oneDark,
		getLanguageExtension(props.language),
		EditorView.updateListener.of((update) => {
			if (update.docChanged) {
				props.content = update.state.doc.toString()
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

watch(() => props.language, updateEditorLanguage)

onMounted(() => {
	nextTick(() => {
		initializeEditor()
	})
})

onBeforeUnmount(() => {
	if (editorView) {
		editorView.destroy()
	}
})

</script>

<template>
	<main class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
		<div v-if="loading" class="skeleton w-full h-96"/>
		<div v-if="!loading" class="flex items-center justify-between px-6 py-3 border-b border-slate-700 bg-slate-750">
			<div class="flex items-center space-x-3">
			<span class="text-sm text-slate-400">
				{{ props.fileName }}
			</span>
				<span class="px-2 py-1 bg-primary/20 text-primary-light text-xs rounded-full border border-primary/30">
				{{ props.language.charAt(0).toUpperCase() + props.language.slice(1) }}
			</span>
			</div>
			<div class="flex items-center space-x-2">
				<button class="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
						@click="copyContent">
					<svgo-copy class="text-lg"/>
				</button>
				<button class="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
						@click="downloadContent">
					<svgo-download class="text-lg"/>
				</button>
			</div>
		</div>
		<div v-if="!loading" class="p-6">
			<div
				ref="editorContainer"
				class="w-full bg-slate-800 text-white font-jetbrains-mono text-sm text-left select-text"
			></div>
		</div>
	</main>
</template>

<style>
.cm-gutters {
	background-color: #1e293b !important; /* slate-800 */
	color: #9ca3af !important; /* slate-400 */
	border-right: 1px solid #374151 !important; /* slate-700 */
}

.cm-activeLineGutter {
	background-color: #374151 !important; /* slate-700 */
}

.ͼo {
	background-color: #1e293b !important; /* slate-800 */
}

.cm-focused {
	outline: none !important;
	background-color: #1e293b !important; /* slate-800 */
}

.cm-content ::selection {
	background-color: rgba(255, 255, 255, 0.3) !important; /* Light selection color */
	color: #5785da !important; /* slate-800 */
}

</style>