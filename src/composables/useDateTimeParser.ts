import { computed } from 'vue'

export interface PartConfig {
    key: string;
    label: string;
    placeholder: string;
    min: number;
    max: number;
    length: number;
    regex: RegExp;
}

export const partConfigs: Record<string, PartConfig> = {
    'yyyy': { key: 'yyyy', label: 'year', placeholder: 'سال', min: 1, max: 1500, length: 4, regex: /^\d{4}$/ },
    'mm': { key: 'mm', label: 'month', placeholder: 'ماه', min: 1, max: 12, length: 2, regex: /^(0[1-9]|1[0-2])$/ },
    'dd': { key: 'dd', label: 'day', placeholder: 'روز', min: 1, max: 31, length: 2, regex: /^(0[1-9]|[12]\d|3[01])$/ },
    'hh': { key: 'hh', label: 'hour', placeholder: 'ساعت', min: 0, max: 23, length: 2, regex: /^([01]\d|2[0-3])$/ },
    'mi': { key: 'mi', label: 'minute', placeholder: 'دقیقه', min: 0, max: 59, length: 2, regex: /^[0-5]\d$/ },
    'ss': { key: 'ss', label: 'second', placeholder: 'ثانیه', min: 0, max: 59, length: 2, regex: /^[0-5]\d$/ },
}

export function useDateTimeParser(format: string) {
    // Parse format string into parts
    const parsedParts = computed(() => {
        const parts: any[] = []
        const regex = /(yyyy|mm|dd|hh|mi|ss)/g
        let lastIndex = 0
        let match
        
        while ((match = regex.exec(format)) !== null) {
            // Add separator before this part
            if (match.index > lastIndex) {
                const separator = format.slice(lastIndex, match.index)
                if (separator) {
                    parts.push({ type: 'separator', value: separator })
                }
            }
            
            // Add input part
            const config = partConfigs[match[0]]
            if (config) {
                parts.push({
                    type: 'input',
                    key: config.key,
                    placeholder: config.placeholder,
                    length: config.length,
                    config: config
                })
            }
            
            lastIndex = match.index + match[0].length
        }
        
        // Add remaining separator
        if (lastIndex < format.length) {
            const remaining = format.slice(lastIndex)
            if (remaining) {
                parts.push({ type: 'separator', value: remaining })
            }
        }
        
        return parts
    })
    
    // Get all input indices
    const getInputIndices = () => {
        const indices: number[] = []
        for (let i = 0; i < parsedParts.value.length; i++) {
            if (parsedParts.value[i].type === 'input') {
                indices.push(i)
            }
        }
        return indices
    }
    
    // Get previous input index
    const getPrevInputIndex = (currentIndex: number): number => {
        const indices = getInputIndices()
        const currentPos = indices.indexOf(currentIndex)
        if (currentPos > 0) {
            return indices[currentPos - 1]
        }
        return -1
    }
    
    // Get next input index
    const getNextInputIndex = (currentIndex: number): number => {
        const indices = getInputIndices()
        const currentPos = indices.indexOf(currentIndex)
        if (currentPos < indices.length - 1) {
            return indices[currentPos + 1]
        }
        return -1
    }
    
    // Build string from values
    const buildString = (values: Record<string, string>): string => {
        let result = ''
        for (const part of parsedParts.value) {
            if (part.type === 'separator') {
                result += part.value
            } else if (part.key && values[part.key]) {
                result += values[part.key]
            } else if (part.key) {
                result += ''
            }
        }
        return result
    }
    
    // Parse string into values
    const parseString = (str: string): Record<string, string> => {
        const values: Record<string, string> = {}
        const numbers = str.match(/\d+/g)
        let numIndex = 0
        
        for (const part of parsedParts.value) {
            if (part.type === 'input' && part.key) {
                if (numbers && numbers[numIndex]) {
                    values[part.key] = numbers[numIndex]
                    numIndex++
                } else {
                    values[part.key] = ''
                }
            }
        }
        
        return values
    }
    
    return {
        parsedParts,
        partConfigs,
        getPrevInputIndex,
        getNextInputIndex,
        buildString,
        parseString
    }
}
