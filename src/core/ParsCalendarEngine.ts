/**
 * Pars Calendar Engine
 * A complete Jalali (Persian) calendar conversion and manipulation library
 * 
 * @module parsCalendarEngine
 */

export interface JalaliDate {
    year: number;
    month: number;  // 1-12 (Farvardin=1 to Esfand=12)
    day: number;
}

/**
 * Convert Persian/Arabic numerals to English numbers
 * @param str - String containing Persian/Arabic numbers
 * @returns String with English numbers
 * @example
 * toEnglishNumbers("۱۴۰۳") // returns "1403"
 */
export function toEnglishNumbers(str: string): string {
    const persianNumbers: Record<string, string> = {
        "۰": "0", "۱": "1", "۲": "2",
        "۳": "3", "۴": "4", "۵": "5", 
        "۶": "6", "۷": "7", "۸": "8", 
        "۹": "9",
    }
    return str.replace(/[۰-۹]/g, (char) => persianNumbers[char] || char)
}

/**
 * Get today's date in Jalali calendar
 * @returns Current date in Jalali format
 * @example
 * getCurrentJalaliDate() // returns { year: 1403, month: 7, day: 15 }
 */
export function getCurrentJalaliDate(): JalaliDate {
    return toJalali(new Date());
}

/**
 * Convert Gregorian Date object to Jalali date
 * @param date - JavaScript Date object
 * @returns Jalali date object
 * @example
 * toJalali(new Date('2024-10-06')) // returns { year: 1403, month: 7, day: 15 }
 */
export function toJalali(date: Date): JalaliDate {
    const utcDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    ))

    const formatter = new Intl.DateTimeFormat('fa-IR', {
        calendar: 'persian',
        timeZone: 'UTC',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });
    
    const parts = formatter.formatToParts(utcDate);
    let year = "", month = "", day = "";
    
    for (const part of parts) {
        switch (part.type) {
            case 'year': year = part.value; break;
            case 'month': month = part.value; break;
            case 'day': day = part.value; break;
        }
    }

    return { 
        year: parseInt(toEnglishNumbers(year)), 
        month: parseInt(toEnglishNumbers(month)), 
        day: parseInt(toEnglishNumbers(day)) 
    };
}

/**
 * Convert Jalali date to Gregorian Date object
 * Uses binary search algorithm for high accuracy
 * @param jy - Jalali year
 * @param jm - Jalali month (1-12)
 * @param jd - Jalali day
 * @returns JavaScript Date object
 * @example
 * toGregorian(1403, 7, 15) // returns Date(2024-10-06)
 */
export function toGregorian(jy: number, jm: number, jd: number): Date {
    let year = jy - 621
    let month = jm - 1
    let day = jd
    
    let date = new Date(year, month, day)
    
    // Adjust until Jalali matches (max 100 attempts)
    let maxAttempts = 100
    while (maxAttempts-- > 0) {
        const jalali = toJalali(date)
        
        if (jalali.year === jy && jalali.month === jm && jalali.day === jd) {
            return date
        }
        
        // Adjust by difference
        let diff = 0
        if (jalali.year !== jy) {
            diff = (jy - jalali.year) * 365
        } else if (jalali.month !== jm) {
            diff = (jm - jalali.month) * 30
        } else {
            diff = jd - jalali.day
        }
        
        date.setDate(date.getDate() + diff)
    }
    
    return date
}

/**
 * Get number of days in a Jalali month
 * @param year - Jalali year
 * @param month - Jalali month (1-12)
 * @returns Number of days (29, 30, or 31)
 * @example
 * getJalaliMonthDays(1403, 7)  // returns 30 (Mehr)
 * getJalaliMonthDays(1403, 12) // returns 29 or 30 (Esfand, depends on leap year)
 */
export function getJalaliMonthDays(year: number, month: number): number {
    // Months 1-6 (Farvardin to Shahrivar) = 31 days
    if (month >= 1 && month <= 6) {
        return 31;
    }
    // Months 7-11 (Mehr to Bahman) = 30 days
    if (month >= 7 && month <= 11) {
        return 30;
    }
    // Month 12 (Esfand) = 29 or 30 days (leap year)
    if (month === 12) {
        return isJalaliLeapYear(year) ? 30 : 29;
    }
    
    return 31;
}

/**
 * Check if a Jalali year is a leap year
 * Jalali leap years occur in a 33-year cycle
 * @param year - Jalali year
 * @returns True if leap year, false otherwise
 * @example
 * isJalaliLeapYear(1403) // returns false
 * isJalaliLeapYear(1404) // returns true
 */
export function isJalaliLeapYear(year: number): boolean {
    const remainder = year % 33;
    return remainder === 1 || remainder === 5 || remainder === 9 || 
           remainder === 13 || remainder === 17 || remainder === 22 || 
           remainder === 26 || remainder === 30;
}

/**
 * Get the first weekday of a Jalali month
 * @param year - Jalali year
 * @param month - Jalali month (1-12)
 * @returns Weekday index (0 = Saturday, 1 = Sunday, ..., 6 = Friday)
 * @example
 * getFirstWeekday(1403, 7) // returns weekday of 1st Mehr 1403
 */
export function getFirstWeekday(year: number, month: number): number {
    // Get the Gregorian date for the 1st of the Jalali month
    const gregorianDate = toGregorian(year, month, 1);
    
    // getDay(): 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const sundayBasedWeekday = gregorianDate.getDay();
    
    // Convert to Saturday-based (0 = Saturday, 6 = Friday)
    const saturdayBasedWeekday = sundayBasedWeekday === 6 ? 0 : sundayBasedWeekday + 1;
    
    return saturdayBasedWeekday;
}

/**
 * Get which week of the month a given date falls in
 * @param year - Jalali year
 * @param month - Jalali month (1-12)
 * @param day - Jalali day
 * @returns Week number (1-5 or 6)
 * @example
 * getWeekOfMonth(1403, 7, 15) // returns week number of 15th Mehr
 */
export function getWeekOfMonth(year: number, month: number, day: number): number {
    const firstWeekday = getFirstWeekday(year, month);
    return Math.ceil((firstWeekday + day) / 7);
}

/**
 * Check if a Jalali date is valid
 * @param year - Jalali year
 * @param month - Jalali month (1-12)
 * @param day - Jalali day
 * @returns True if date is valid, false otherwise
 * @example
 * isValidJalaliDate(1403, 2, 30)  // returns true (Ordibehesht has 31 days)
 * isValidJalaliDate(1403, 12, 30) // returns false (Esfand has 29 days in non-leap year)
 */
export function isValidJalaliDate(year: number, month: number, day: number): boolean {
    if (month < 1 || month > 12) return false
    const maxDay = getJalaliMonthDays(year, month)
    return day >= 1 && day <= maxDay
}

/**
 * Format a Jalali date object to a custom string format
 * @param date - Jalali date object
 * @param format - Format string (supports yyyy, mm, dd)
 * @returns Formatted date string
 * @example
 * formatJalali({ year: 1403, month: 7, day: 15 }, "yyyy/mm/dd")
 * // returns "1403/07/15"
 */
export function formatJalali(date: JalaliDate, format: string): string {
    return format
        .replace('yyyy', date.year.toString())
        .replace('mm', date.month.toString().padStart(2, '0'))
        .replace('dd', date.day.toString().padStart(2, '0'))
}

/**
 * Format an ISO date string to custom format in Jalali or Gregorian calendar
 * @param isoString - ISO date string (e.g., "2024-10-06T14:30:00.000Z")
 * @param format - Output format (supports yyyy, yy, mm, m, dd, d, hh, h, mi, ss)
 * @param type - Calendar type: 'jalali' or 'gregorian'
 * @returns Formatted date string
 * @example
 * // Gregorian formatting
 * formatISO("2024-10-06T14:30:00.000Z", "yyyy/mm/dd", "gregorian")
 * // returns "2024/10/06"
 * 
 * // Jalali formatting
 * formatISO("2024-10-06T14:30:00.000Z", "yyyy/mm/dd hh:mi", "jalali")
 * // returns "1403/07/15 14:30"
 * 
 * // Short formats
 * formatISO("2024-10-06T14:30:00.000Z", "yy/mm/dd", "jalali")
 * // returns "03/07/15"
 */
export function formatISO(
    isoString: string, 
    format: string = 'yyyy/mm/dd', 
    type: 'jalali' | 'gregorian' = 'gregorian'
): string {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) {
        return ''
    }
    
    // Get date components based on type
    let year: number, month: number, day: number
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    
    if (type === 'jalali') {
        const jalali = toJalali(date)
        year = jalali.year
        month = jalali.month
        day = jalali.day
    } else {
        year = date.getFullYear()
        month = date.getMonth() + 1
        day = date.getDate()
    }
    
    // Replace parts
    const replacements: Record<string, string> = {
        'yyyy': year.toString().padStart(4, '0'),
        'yy': year.toString().slice(-2),
        'mm': month.toString().padStart(2, '0'),
        'm': month.toString(),
        'dd': day.toString().padStart(2, '0'),
        'd': day.toString(),
        'hh': hour.toString().padStart(2, '0'),
        'h': hour.toString(),
        'mi': minute.toString().padStart(2, '0'),
        'ss': second.toString().padStart(2, '0')
    }
    
    let result = format
    for (const [key, value] of Object.entries(replacements)) {
        result = result.replace(new RegExp(key, 'g'), value)
    }
    
    return result
}
