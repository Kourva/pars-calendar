import { getJalaliMonthDays } from '../core/parsCalendarEngine'

export function useDateTimeValidation(partConfigs: Record<string, any>) {
    
    // Get max days in month using Jalali engine
    const getMaxDayInMonth = (year: number, month: number): number => {
        if (!year || !month) return 31
        return getJalaliMonthDays(year, month)
    }
    
    // Get dynamic placeholder for a field
    const getDynamicPlaceholder = (key: string, values: Record<string, string>): string => {
        switch (key) {
            case 'dd':
                if (values['yyyy'] && values['mm']) {
                    const year = parseInt(values['yyyy'])
                    const month = parseInt(values['mm'])
                    if (!isNaN(year) && !isNaN(month) && year > 0 && month >= 1 && month <= 12) {
                        const maxDay = getMaxDayInMonth(year, month)
                        console.log(maxDay);
                        
                        return maxDay.toString().padStart(2, '0')
                    }
                }
                return '15'
            case 'mm':
                return '02'
            case 'yyyy':
                return '1403'
            case 'hh':
                return '14'
            case 'mi':
                return '30'
            case 'ss':
                return '00'
            default:
                return ''
        }
    }
    
    // Check if first digit is valid
    const isValidFirstDigit = (key: string, digit: string): boolean => {
        const num = parseInt(digit)
        if (isNaN(num)) return false
        
        switch (key) {
            case 'mm': return num <= 1
            case 'hh': return num <= 2
            case 'dd': return num <= 3
            default: return true
        }
    }
    
    // Check if value is in range
    const isInRange = (key: string, value: string): boolean => {
        const config = partConfigs[key]
        if (!config || !value) return true
        
        const num = parseInt(value)
        if (isNaN(num)) return false
        return num >= config.min && num <= config.max
    }
    
    // Full validation with context
    const isValidValue = (key: string, value: string, allValues: Record<string, string>): boolean => {
        const config = partConfigs[key]
        if (!config || !value) return true
        if (value.length !== config.length) return true
        
        const num = parseInt(value)
        if (isNaN(num)) return false
        
        // Range check
        if (num < config.min || num > config.max) return false
        
        // Day validation using Jalali engine
        if (key === 'dd' && allValues['yyyy'] && allValues['mm']) {
            const year = parseInt(allValues['yyyy'])
            const month = parseInt(allValues['mm'])
            if (!isNaN(year) && !isNaN(month) && year > 0 && month >= 1 && month <= 12) {
                const maxDay = getMaxDayInMonth(year, month)
                if (num > maxDay) return false
            }
        }
        
        return true
    }
    
    // Get hint text for a field
    const getFieldHint = (key: string, values: Record<string, string>): string => {
        const config = partConfigs[key]
        if (!config) return ''
        
        switch (key) {
            case 'mm':
                return `ماه: ${config.min} تا ${config.max}`
            case 'dd':
                if (values['yyyy'] && values['mm']) {
                    const year = parseInt(values['yyyy'])
                    const month = parseInt(values['mm'])
                    if (!isNaN(year) && !isNaN(month) && year > 0 && month >= 1 && month <= 12) {
                        const maxDay = getMaxDayInMonth(year, month)
                        return `روز: ۱ تا ${maxDay}`
                    }
                }
                return `روز: ${config.min} تا ${config.max}`
            default:
                return `${config.label}: ${config.min} تا ${config.max}`
        }
    }
    
    // Get month name
    const getMonthName = (monthValue: string): string => {
        if (!monthValue) return ''
        const month = parseInt(monthValue)
        if (isNaN(month) || month < 1 || month > 12) return ''
        
        const monthNames = [
            'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
            'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
        ]
        return monthNames[month - 1]
    }
    
    return {
        getMaxDayInMonth,
        getDynamicPlaceholder,
        isValidFirstDigit,
        isInRange,
        isValidValue,
        getFieldHint,
        getMonthName
    }
}
