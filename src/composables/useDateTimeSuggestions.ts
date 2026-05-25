import { ref, computed } from 'vue'

export function useDateTimeSuggestions(
    validation: any,
    values: any,
    focusedIndex: any,
    parsedParts: any
) {
    const showHint = ref(false)
    let hintTimeout: any = null
    
    // Current field key
    const currentFieldKey = computed(() => {
        if (focusedIndex.value === -1) return null
        const part = parsedParts.value?.[focusedIndex.value]
        return part?.type === 'input' ? part.key : null
    })
    
    // Current hint text
    const currentHint = computed(() => {
        if (!showHint.value || !currentFieldKey.value) return ''
        return validation.getFieldHint(currentFieldKey.value, values.value)
    })
    
    // Month preview
    const monthPreview = computed(() => {
        const monthValue = values.value?.['mm']
        if (monthValue && monthValue.length === 2) {
            return validation.getMonthName(monthValue)
        }
        return ''
    })
    
    // Day range preview
    const dayRangePreview = computed(() => {
        if (values.value?.['yyyy'] && values.value?.['mm']) {
            const year = parseInt(values.value['yyyy'])
            const month = parseInt(values.value['mm'])
            if (!isNaN(year) && !isNaN(month) && year > 0 && month >= 1 && month <= 12) {
                const maxDay = validation.getMaxDayInMonth(year, month)
                return `۱ تا ${maxDay}`
            }
        }
        return ''
    })
    
    // Show hint temporarily
    const showHintForField = (key: string) => {
        const hint = validation.getFieldHint(key, values.value)
        if (!hint) return
        
        showHint.value = true
        
        if (hintTimeout) clearTimeout(hintTimeout)
        hintTimeout = setTimeout(() => {
            showHint.value = false
        }, 2000)
    }
    
    // Clear hint
    const clearHint = () => {
        showHint.value = false
        if (hintTimeout) {
            clearTimeout(hintTimeout)
            hintTimeout = null
        }
    }
    
    // Context info for display
    const contextInfo = computed(() => {
        const info: string[] = []
        
        const month = monthPreview.value
        if (month) {
            info.push(`${month}`)
        }
        
        const range = dayRangePreview.value
        if (range) {
            info.push(`${range}`)
        }
        
        return info.join(' • ')
    })
    
    return {
        showHint,
        currentHint,
        currentFieldKey,
        monthPreview,
        dayRangePreview,
        contextInfo,
        showHintForField,
        clearHint
    }
}
