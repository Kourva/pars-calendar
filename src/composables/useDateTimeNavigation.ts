import { ref, nextTick } from 'vue'

export function useDateTimeNavigation(
    parsedParts: any,
    inputRefs: any,
    getPrevInputIndex: (idx: number) => number,
    getNextInputIndex: (idx: number) => number
) {
    const focusedIndex = ref(-1)
    
    // Focus a specific input
    const focusInput = (index: number) => {
        nextTick(() => {
            const input = inputRefs.value?.[index]
            if (input && typeof input.focus === 'function') {
                input.focus()
                const len = input.value.length
                input.setSelectionRange(len, len)
            }
        })
    }
    
    // Focus previous input
    const focusPrev = (currentIndex: number) => {
        const prevIndex = getPrevInputIndex(currentIndex)
        if (prevIndex !== -1) {
            focusInput(prevIndex)
        }
    }
    
    // Focus next input
    const focusNext = (currentIndex: number) => {
        const nextIndex = getNextInputIndex(currentIndex)
        if (nextIndex !== -1) {
            focusInput(nextIndex)
        }
    }
    
    // Handle keyboard events
    const handleKeydown = (event: KeyboardEvent, currentIndex: number) => {
        const input = event.target as HTMLInputElement
        const part = parsedParts.value?.[currentIndex]
        if (!part || part.type !== 'input') return
        
        // Backspace on empty -> previous
        if (event.key === 'Backspace') {
            if (input.value.length === 0) {
                event.preventDefault()
                focusPrev(currentIndex)
            }
        }
        
        // Delete on empty -> next
        if (event.key === 'Delete' && input.value.length === 0) {
            event.preventDefault()
            focusNext(currentIndex)
        }
        
        // Arrow left at start
        if (event.key === 'ArrowLeft' && input.selectionStart === 0) {
            event.preventDefault()
            focusPrev(currentIndex)
        }
        
        // Arrow right at end
        if (event.key === 'ArrowRight' && input.selectionStart === input.value.length) {
            event.preventDefault()
            focusNext(currentIndex)
        }
        
        // Block non-numeric
        if (!/^\d$/.test(event.key) && 
            event.key !== 'Backspace' && 
            event.key !== 'Delete' && 
            event.key !== 'ArrowLeft' && 
            event.key !== 'ArrowRight' && 
            event.key !== 'Tab' &&
            event.key !== 'Home' &&
            event.key !== 'End') {
            event.preventDefault()
        }
    }
    
    // Focus handlers
    const onFocus = (index: number) => {
        focusedIndex.value = index
        const input = inputRefs.value?.[index]
        if (input && typeof input.select === 'function') {
            input.select()
        }
    }
    
    const onBlur = () => {
        focusedIndex.value = -1
    }
    
    return {
        focusedIndex,
        focusInput,
        focusPrev,
        focusNext,
        handleKeydown,
        onFocus,
        onBlur
    }
}
