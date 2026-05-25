/**
 * Calendar Theme Type
 * All available theme names for the calendar component
 * 
 * @example
 * // Usage in component
 * <ParsCalendar theme="netflix" />
 * <ParsCalendar theme="dark" />
 * <ParsCalendar theme="iran-premium" />
 */

export type CalendarTheme = 
    // Basic themes (light/dark system)
    | 'light' | 'dark' | 'oled'
    
    // Premium luxury themes
    | 'royal' | 'executive' | 'midnight' | 'emerald' | 'rosegold'
    
    // Nature inspired
    | 'forest' | 'ocean' | 'sunset' | 'desert' | 'mountain' 
    | 'lavender' | 'rose' | 'mint' | 'peach' | 'sky'
    
    // Tech brands
    | 'apple' | 'google' | 'microsoft' | 'meta' | 'amazon' 
    | 'netflix' | 'spotify' | 'tesla' | 'openai' | 'github'
    
    // Luxury fashion brands
    | 'gucci' | 'chanel' | 'hermes' | 'rolex' | 'versace' 
    | 'louis' | 'prada' | 'dior' | 'cartier' | 'tiffany'
    
    // Food & beverage brands
    | 'starbucks' | 'coca' | 'pepsi' | 'mcd' | 'burger'
    
    // Sportswear brands
    | 'nike' | 'adidas'
    
    // Automotive brands
    | 'ferrari' | 'lamborghini' | 'porsche' | 'bmw' | 'mercedes'
    
    // Mood & vibe
    | 'aurora' | 'sunrise' | 'twilight' | 'cosmic' | 'candy' 
    | 'neon' | 'pastel' | 'monochrome' | 'vintage' | 'modern'
    
    // Seasonal & festivals
    | 'nowruz' | 'halloween' | 'christmas' | 'valentine' 
    | 'summer' | 'autumn' | 'winter' | 'spring'
    
    // Country inspired
    | 'iran' | 'japan' | 'france' | 'italy' | 'germany' 
    | 'uk' | 'canada' | 'brazil' | 'australia' | 'india'
    
    // Abstract patterns
    | 'zigzag' | 'dots' | 'stripes' | 'waves' | 'grid' 
    | 'marble' | 'leather' | 'wood' | 'glass' | 'metal'
    
    // Crypto & future tech
    | 'bitcoin' | 'ethereum' | 'solana' | 'ai' | 'cyber'
    
    // Social media
    | 'instagram' | 'telegram' | 'x' | 'whatsapp' | 'linkedin'
    
    // Persian heritage (premium)
    | 'iran-premium' | 'persian-royal' | 'garden' | 'persepolis';

/**
 * Array of all available theme names
 * Useful for theme selectors/dropdowns
 */
export const CALENDAR_THEMES: CalendarTheme[] = [
    // Basic
    'light', 'dark', 'oled',
    
    // Premium luxury
    'royal', 'executive', 'midnight', 'emerald', 'rosegold',
    
    // Nature
    'forest', 'ocean', 'sunset', 'desert', 'mountain', 
    'lavender', 'rose', 'mint', 'peach', 'sky',
    
    // Tech brands
    'apple', 'google', 'microsoft', 'meta', 'amazon', 
    'netflix', 'spotify', 'tesla', 'openai', 'github',
    
    // Luxury fashion
    'gucci', 'chanel', 'hermes', 'rolex', 'versace', 
    'louis', 'prada', 'dior', 'cartier', 'tiffany',
    
    // Food
    'starbucks', 'coca', 'pepsi', 'mcd', 'burger', 
    'nike', 'adidas',
    
    // Auto
    'ferrari', 'lamborghini', 'porsche', 'bmw', 'mercedes',
    
    // Moods
    'aurora', 'sunrise', 'twilight', 'cosmic', 'candy', 
    'neon', 'pastel', 'monochrome', 'vintage', 'modern',
    
    // Festivals
    'nowruz', 'halloween', 'christmas', 'valentine', 
    'summer', 'autumn', 'winter', 'spring',
    
    // Countries
    'iran', 'japan', 'france', 'italy', 'germany', 
    'uk', 'canada', 'brazil', 'australia', 'india',
    
    // Patterns
    'zigzag', 'dots', 'stripes', 'waves', 'grid', 
    'marble', 'leather', 'wood', 'glass', 'metal',
    
    // Crypto
    'bitcoin', 'ethereum', 'solana', 'ai', 'cyber',
    
    // Social
    'instagram', 'telegram', 'x', 'whatsapp', 'linkedin',
    
    // Persian
    'iran-premium', 'persian-royal', 'garden', 'persepolis'
];
