import {defineNuxtPlugin} from '#app'
import {createApp} from 'vue'
import {useToast} from '~/composables/useToast'
import {ToastContainer} from "#components";

export default defineNuxtPlugin(nuxtApp => {
    const containerDiv = document.createElement('div')
    containerDiv.id = 'toast-container-root'
    document.body.appendChild(containerDiv)

    const containerApp = createApp(ToastContainer)

    const containerInstance = containerApp.mount(containerDiv)

    const toast = useToast()
    toast.setContainerInstance(containerInstance)

    nuxtApp.provide('toast', {
        show: toast.show,
        normal: toast.normal,
        success: toast.success,
        danger: toast.danger,
        close: toast.close,
        clearAll: toast.clearAll
    })
})