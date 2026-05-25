<template>
    <div class="calendar-body-container">
        <!-- Weekdays -->
        <div class="calendar-weekdays-grid">
            <div class="calendar-weekdays-card" v-for="day in weekDays"> 
                {{ day }}
            </div>
        </div>
        
        <!-- Week Body -->
        <div class="calendar-week-grid" :key="`${year}-${month}-${day}`">
            <div 
                v-for="item in weekDaysData" 
                :key="item.dateKey"
                :class="['calendar-week-grid-cards', {
                    disabled: !item.isCurrentMonth,
                    'weekend': item.weekday === 6,
                    today: item.isToday
                }]"
            > 
                <!-- Day header -->
                <div class="calendar-week-card-header" @click="selectDate(item)">
                    <span class="calendar-week-card-day">
                        <span class="gregorian-date">
                            {{ getGregorianDay(item.year, item.month, item.day) }}
                        </span>
                        {{ item.day }}
                    </span>
                </div>

                <!-- Events list -->
                <template v-if="item.isCurrentMonth">
                    <div class="calendar-week-events-list">
                        <div 
                            v-for="event in getEventsForDay(item)"
                            :key="event.id"
                            class="calendar-week-event-row"
                            :style="{ 
                                backgroundColor: event.color,
                                opacity: 0.85
                            }"
                            @click.stop="selectEvent(event)"
                        >
                            <span class="calendar-week-event-title">{{ event.title }}</span>
                        </div>
                        
                        <!-- Empty state -->
                        <div v-if="getEventsForDay(item).length === 0" class="calendar-week-empty">
                            بدون رویداد
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- Week navigation -->
        <div class="week-navigation">
            <button class="week-nav-btn" @click="navigateWeek(-1)">
                <ChevronRight class="nav-icon" />
                هفته قبل
            </button>
            <span class="week-range">
                {{ weekRangeText }}
            </span>
            <button class="week-nav-btn" @click="navigateWeek(1)">
                هفته بعد
                <ChevronLeft class="nav-icon" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Internal imports
import { 
    getCurrentJalaliDate, 
    type JalaliDate, 
    toGregorian,
    toJalali
} from '../core/parsCalendarEngine';
import { type CalendarEvent } from '../types/event';

// Lucide icon
import {
    ChevronLeft, 
    ChevronRight 
} from 'lucide-vue-next';

// Props
const props = defineProps<{
    year: number;
    month: number;
    day: number;
    events?: CalendarEvent[];
}>();

// Emits
const emits = defineEmits<{
    "select-date": [date: Record<string, any>];
    "select-event": [date: CalendarEvent];
    "update:year": [number];
    "update:month": [number];
    "update:day": [number];
}>();

// Week days
const weekDays = ref([
    "شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه",
    "چهارشنبه", "پنج‌شنبه", "جمعه"
]);

// Week range text for display
const weekRangeText = computed(() => {
    if (weekDaysData.value.length === 0) return '';
    const firstDay = weekDaysData.value[0];
    const lastDay = weekDaysData.value[6];
    
    if (firstDay.month === lastDay.month) {
        return `${firstDay.day} - ${lastDay.day} ${getMonthName(firstDay.month)}`;
    } else {
        return `${firstDay.day} ${getMonthName(firstDay.month)} - ${lastDay.day} ${getMonthName(lastDay.month)}`;
    }
});

// Get month name
const getMonthName = (month: number): string => {
    const months = [
        "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", 
        "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
    ];
    return months[month - 1];
};

// Handle week navigation
const navigateWeek = (direction: number) => {
    const currentDate = toGregorian(props.year, props.month, props.day || 1);
    
    // Add/subtract 7 days
    currentDate.setDate(currentDate.getDate() + (direction * 7));
    
    // Convert back to Jalali
    const newJalali = toJalali(currentDate);
    
    // Update parent
    emits("update:year", newJalali.year);
    emits("update:month", newJalali.month);
    emits("update:day", newJalali.day);
    
    // Haptic feedback
    if ("vibrate" in navigator) {
        navigator.vibrate(20);
    }
};

// Get current date
const currentDate = ref<JalaliDate>(getCurrentJalaliDate());

// Generate week days data - Using same helpers as MonthView
const weekDaysData = computed(() => {
    // Get first day of current month to calculate week start
    const firstDayOfMonth = toGregorian(props.year, props.month, 1);
    
    // Get weekday of first day (0 = Sunday in JS)
    let gregorianWeekday = firstDayOfMonth.getDay();
    
    // Convert to Persian weekday: Saturday = 0, Sunday = 1, ..., Friday = 6
    let persianWeekday = gregorianWeekday === 6 ? 0 : gregorianWeekday + 1;
    
    // Days to subtract to get to Saturday (start of week)
    const daysToSaturday = persianWeekday;
    
    // Start from Saturday of the week containing the 1st of month
    const startGregorian = new Date(firstDayOfMonth);
    startGregorian.setDate(firstDayOfMonth.getDate() - daysToSaturday);
    
    // Get the current date to find which week to show
    const currentGregorian = toGregorian(props.year, props.month, props.day || 1);
    let currentWeekStart = new Date(currentGregorian);
    let currentWeekday = currentGregorian.getDay();
    let currentPersianWeekday = currentWeekday === 6 ? 0 : currentWeekday + 1;
    currentWeekStart.setDate(currentGregorian.getDate() - currentPersianWeekday);
    
    // Use the start of the week containing the selected date
    const finalStart = currentWeekStart;
    
    const days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(finalStart);
        date.setDate(finalStart.getDate() + i);
        
        // Convert back to Jalali
        const jalali = toJalali(date);
        
        days.push({
            day: jalali.day,
            month: jalali.month,
            year: jalali.year,
            dateKey: `${jalali.year}-${jalali.month}-${jalali.day}`,
            isToday: isToday(jalali.year, jalali.month, jalali.day),
            isCurrentMonth: jalali.month === props.month,
            weekday: i,
            fullDate: date
        });
    }
    
    return days;
});

// Check if given day is today
const isToday = (year: number, month: number, day: number): boolean => {
    return currentDate.value.year === year &&
           currentDate.value.month === month &&
           currentDate.value.day === day;
};

// Get given day's gregorian format
function getGregorianDay(year: number, month: number, day: number): string {
    const gregorianDate = toGregorian(year, month, day);
    return gregorianDate.toLocaleDateString('en-US', { day: 'numeric' });
}

// Get data key based on the day
const getDateKey = (item: any): string => {
    return `${item.year}/${item.month.toString().padStart(2, '0')}/${item.day.toString().padStart(2, '0')}`;
};

// Get wildcard formatted data key based on the day
const getWildcardKey = (item: any): string => {
    return `*/${item.month.toString().padStart(2, '0')}/${item.day.toString().padStart(2, '0')}`;
};

// Get events for given day
const getEventsForDay = (item: any): any[] => {
    const key = getDateKey(item);
    const wildcardKey = getWildcardKey(item);
    return props.events.filter(
        (e: CalendarEvent) => e.startDate === key || e.startDate === wildcardKey
    ) ?? [];
};

// Handle date selection
const selectDate = (item: any) => {
    if ("vibrate" in navigator) {
        navigator.vibrate(20);
    }
    
    emits("select-date", {
        year: item.year,
        month: item.month,
        day: item.day,
        events: getEventsForDay(item)
    });
};

// Handle event selection
const selectEvent = (event: CalendarEvent) => {
    if ("vibrate" in navigator) {
        navigator.vibrate(30);
    }
    
    emits("select-event", event);
};

// Lifecycle hooks
onMounted(() => {
    if (!props.year || !props.month || !props.day) {
        const today = getCurrentJalaliDate();
        emits("update:year", today.year);
        emits("update:month", today.month);
        emits("update:day", today.day);
    }
});
</script>

<style scoped>
.calendar-body-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 100%;
}

.calendar-weekdays-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    gap: 2rem;
    position: sticky;
    border-radius: var(--cal-radius);
    top: 0;
    background-color: var(--cal-surface);
    z-index: 5;
}

.calendar-weekdays-card {
    color: var(--cal-text-secondary);
    width: 100%;
    padding: 10px;
    white-space: nowrap;
}

.calendar-weekdays-card:last-child {
    color: var(--cal-secondary);
}

.calendar-week-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2rem;
    animation: fadeSlide 0.2s ease-out;
}

@keyframes fadeSlide {
    from {
        opacity: 0;
        transform: translateY(5px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.calendar-week-grid-cards {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
    min-height: 300px;
    border-radius: var(--cal-radius);
    background-color: var(--cal-surface);
    border: 1px solid var(--cal-border);
    transition: border-color 0.3s ease, background-color 0.3s ease;
    overflow: hidden;
    height: 120px;
}

.calendar-week-grid-cards:not(.disabled):hover {
    background-color: var(--cal-hover);
}

.calendar-week-grid-cards.disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.calendar-week-grid-cards.weekend {
    border-color: var(--cal-weekend);
    background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        var(--cal-weekend) 10px,
        var(--cal-weekend) 30px
    );
}

.calendar-week-grid-cards.today {
    border-color: var(--cal-today-border);
    background: var(--cal-today);
}

.calendar-week-card-header {
    padding: 0.7rem;
    text-align: center;
    border-bottom: 1px solid var(--cal-border);
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.calendar-week-card-header:hover {
    background-color: var(--cal-hover);
}

.calendar-week-card-day {
    font-size: clamp(1.1rem, 5vw, 2rem);
    font-weight: bold;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
    gap: 5px;
    color: var(--cal-text-primary);
}

.gregorian-date {
    font-size: 0.5em;
    color: var(--cal-text-secondary);
}

.calendar-week-events-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px;
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
    min-height: 0;
}

.calendar-week-event-row {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    height: 20px;
    flex-shrink: 0;
    border-radius: 6px;
    font-size: 0.7rem;
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    overflow: hidden;
}

.calendar-week-event-row:hover {
    transform: translateX(2px);
    filter: brightness(1.1);
}

.calendar-week-event-title {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.calendar-week-empty {
    text-align: center;
    color: var(--cal-text-muted);
    font-size: 0.7rem;
    padding: 16px 8px;
}

.bottom-category-legends {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.2rem 2rem;
}

.bottom-category-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: clamp(0.6rem, 2vw, 1rem);
    padding: 4px 10px;
    color: var(--cal-text-secondary);
    border-radius: 20px;
}

.calendar-event-legend {
    position: relative;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--calendar-primary);
    transition: transform 0.2s ease;
}

.calendar-events-grid:hover .calendar-event-legend{
    transform: scale(1.2);
    box-shadow: 0 0 0 2px var(--cal-surface);
}

.week-navigation {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 12px;
    margin-top: 8px;
    border-top: 1px solid var(--cal-border);
    border-radius: var(--cal-radius);
}

.week-nav-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 16px;
    background: var(--cal-surface);
    border: 1px solid var(--cal-border);
    border-radius: var(--cal-radius);
    color: var(--cal-text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.85rem;
    flex-shrink: 0;
}

.week-nav-btn:hover {
    background: var(--cal-hover);
    transform: scale(0.98);
}

.nav-icon {
    width: 16px;
    height: 16px;
}

.week-range {
    font-size: 0.9rem;
    color: var(--cal-text-primary);
    font-weight: 500;
    padding: 0 12px;
    text-align: center;
}

@media (max-width: 768px) {
    .calendar-weekdays-grid {
        gap: 1rem;
    }

    .calendar-week-card-day {
        flex-direction: column-reverse;
        align-items: center;
        gap: 0;
    }

    .gregorian-date {
        font-size: 0.7em;
    }
    
    .calendar-week-grid {
        gap: 1rem;
    }
    
    .calendar-weekdays-card {
        padding: 8px;
        font-size: 0.85rem;
    }
    
    .calendar-week-grid-cards {
        min-height: 250px;
    }

    .bottom-category-legends {
        gap: 0.2rem 0.5rem;
    }
}

@media (max-width: 640px) {
    .calendar-weekdays-grid {
        gap: 0.5rem;
    }
    
    .calendar-week-grid {
        gap: 0.5rem;
    }
    
    .calendar-weekdays-card {
        padding: 6px 2px;
        font-size: 0.7rem;
        white-space: nowrap;
    }
    
    .calendar-week-grid-cards {
        min-height: 200px;
    }
    
    .calendar-week-card-day {
        font-size: 0.9rem;
    }
    
    .calendar-week-event-row {
        padding: 4px 6px;
        font-size: 0.6rem;
    }

    .calendar-event-legend {
        width: 6px;
        height: 6px;
    }

    .calendar-week-empty {
        display: none;
    }

    .week-nav-btn {
        padding: 4px 12px;
        font-size: 0.7rem;
    }
    
    .week-range {
        font-size: 0.7rem;
    }
    
    .nav-icon {
        width: 14px;
        height: 14px;
    }
}

@media (max-width: 480px) {
    .calendar-weekdays-card {
        font-size: 0.6rem;
        padding: 4px 1px;
    }
    
    .calendar-week-grid-cards {
        min-height: 180px;
    }
    
    .calendar-week-card-day {
        font-size: 0.8rem;
    }

}
</style>
