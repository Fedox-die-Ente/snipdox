interface ToastOptions {
    type?: 'normal' | 'success' | 'danger'
    duration?: number
    closable?: boolean
    icon?: string
}

interface ToastItem {
    id: string
    message: string
    type?: 'normal' | 'success' | 'danger'
    duration?: number
    closable?: boolean
    icon?: string
}

let containerInstance: ComponentPublicInstance | null = null
const pendingToasts: { message: string, options?: ToastOptions }[] = []

export function useToast() {
    const defaultOptions: ToastOptions = {
        type: 'normal',
        duration: 5000, // 5 seconds
        closable: true
    }

    /**
     * Generates a unique ID for each toast
     */
    function generateId(): string {
        return `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    }

    function showToast(message: string, options?: ToastOptions) {
        const mergedOptions = {...defaultOptions, ...options}

        if (!containerInstance) {
            if (process.client) {
                pendingToasts.push({message, options: mergedOptions})
            }
            return
        }

        const toast: ToastItem = {
            id: generateId(),
            message,
            ...mergedOptions
        }

        // @ts-ignore
        containerInstance.addToast(toast)
        return toast.id
    }

    function normal(message: string, options?: Omit<ToastOptions, 'type'>) {
        return showToast(message, {...options, type: 'normal'})
    }

    function success(message: string, options?: Omit<ToastOptions, 'type'>) {
        return showToast(message, {...options, type: 'success'})
    }

    function danger(message: string, options?: Omit<ToastOptions, 'type'>) {
        return showToast(message, {...options, type: 'danger'})
    }

    function closeToast(id: string) {
        if (containerInstance) {
            // @ts-ignore
            containerInstance.removeToast(id)
        }
    }

    function clearAll() {
        if (containerInstance && 'clearAll' in containerInstance) {
            (containerInstance as any).clearAll()
        }
    }

    function setContainerInstance(instance: ComponentPublicInstance) {
        containerInstance = instance

        if (pendingToasts.length > 0) {
            pendingToasts.forEach(({message, options}) => {
                showToast(message, options)
            })
            pendingToasts.length = 0
        }
    }

    return {
        show: showToast,
        normal,
        success,
        danger,
        close: closeToast,
        clearAll,
        setContainerInstance
    }
}