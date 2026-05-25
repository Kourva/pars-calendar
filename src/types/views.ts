/**
 * Calendar View Type
 * Available view modes for the calendar component
 * 
 * @example
 * // Usage in component
 * <ParsCalendar view="week" />
 * <ParsCalendar view="agenda" />
 * <ParsCalendar view="year" />
 */

export type CalendarView = 
    | 'month'    // Monthly grid view (default)
    | 'week'     // Weekly horizontal timeline
    | 'agenda'   // List view of events
    | 'day'      // Single day timeline with hours
    | 'year';    // 12-month mini grid overview
