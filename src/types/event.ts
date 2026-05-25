/**
 * Calendar Event Interface
 * Defines the structure for events displayed in the calendar
 */

export interface CalendarEvent {
    /**
     * Unique identifier for the event
     * @optional - Auto-generated if not provided
     */
    id?: string | number;

    /**
     * Display title of the event
     * @required
     */
    title: string;

    /**
     * Custom color for event dot and tooltip
     * @optional - Falls back to category default color
     */
    color?: string;

    /**
     * Event category identifier (used for grouping and styling)
     * @required
     */
    category: string;

    /**
     * Display title for the category (shown in legends)
     * @optional - Uses category if not provided
     */
    categoryTitle?: string;

    /**
     * Custom metadata for any additional data
     * @optional - Pass any custom data without affecting calendar logic
     */
    metadata?: Record<string, any>;

    /**
     * Start date of the event
     * @required
     * @format "1403-07-15" (exact) or "*-07-15" (yearly recurring)
     */
    startDate: string;

    /**
     * End date for multi-day events
     * @optional
     * @format "1403-07-20"
     */
    endDate?: string;

    /**
     * Start time for timed events
     * @optional
     * @format "HH:MM" (24-hour format)
     */
    startTime?: string;

    /**
     * End time for timed events
     * @optional
     * @format "HH:MM" (24-hour format)
     */
    endTime?: string;
}
