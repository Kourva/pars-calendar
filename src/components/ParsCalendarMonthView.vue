<template>
    <div class="calendar-body-container">
        <!-- Weekdays -->
        <div class="calendar-weekdays-grid">
            <div class="calendar-weekdays-card" v-for="day in weekDays"> 
                {{ day }}
            </div>
        </div>
        
        <!-- Body -->
        <div class="calendar-body-grid" :key="`${year}-${month}`">
            <!-- Day -->
            <div 
                v-for="item in calendarDays"
                :key="item.dateKey"
                :class="['calendar-body-grid-cards', {
                    disabled: !item.isCurrentMonth,
                    today: item.isToday
                }]"
                @click="selectDate(item)"
            > 
                <!-- Day number -->
                <span class="calendar-body-grid-cards-day">
                    <span class="gregorian-date">
                        {{ getGregorianDay(year, item.month, item.day) }}
                    </span>
                    {{ item.day }}
                </span>


                <!-- Day events container with tooltip -->
                <div 
                    class="calendar-events-grid" 
                    @mouseenter="showTooltip(item.day, true)"
                    @mouseleave="showTooltip(item.day, false)"
                >
                    <template v-if="item.isCurrentMonth">
                        <div 
                            v-for="category in getDayCaregories(item.day)"
                            :key="category.label"
                            class="calendar-event-legend"
                            :style="{ backgroundColor: category.color }"
                        ></div>
                        
                        <Transition name="calendar-fade-slide">
                            <div 
                                v-if="tooltipsFlag[item.day] && getEventsForDay(item).length > 0" 
                                class="calendar-event-tooltip"
                            >
                                <div 
                                    v-for="event in getEventsForDay(item)"
                                    :key="event.id"
                                    class="calendar-event-item"
                                >
                                    {{ event.title }}
                                </div>
                            </div>
                        </Transition>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Internal imports
import { 
    getCurrentJalaliDate, 
    getJalaliMonthDays, 
    getFirstWeekday,
    type JalaliDate, 
    toGregorian
} from '../core/parsCalendarEngine';
import { type CalendarEvent } from '../types/event';

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
    "update:year": [number];
    "update:month": [number];
    "update:day": [number];
}>();

// Week days
const weekDays = ref([
    "شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه",
    "چهارشنبه", "پنج‌شنبه", "جمعه"
]);

// Tooltips
const tooltipsFlag = ref<Record<number, boolean>>({});

// Get current date
const currentDate = ref<JalaliDate>(getCurrentJalaliDate());

// Check if a date is today
const isToday = (year: number, month: number, day: number): boolean => {
    return currentDate.value.year === year &&
           currentDate.value.month === month &&
           currentDate.value.day === day;
};

// Generate calendar days
const calendarDays = computed(() => {
    const daysInMonth = getJalaliMonthDays(props.year, props.month);
    const firstWeekday = getFirstWeekday(props.year, props.month);    
    
    // Previous month
    let prevMonth = props.month - 1;
    let prevYear = props.year;
    if (prevMonth < 1) {
        prevMonth = 12;
        prevYear--;
    }
    const daysInPrevMonth = getJalaliMonthDays(prevYear, prevMonth);
    
    // Next month
    let nextMonth = props.month + 1;
    let nextYear = props.year;
    if (nextMonth > 12) {
        nextMonth = 1;
        nextYear++;
    }
    
    const grid: any[] = [];
    
    // Days from previous month
    for (let i = firstWeekday - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        grid.push({
            day,
            month: prevMonth,
            year: prevYear,
            isCurrentMonth: false,
            isToday: isToday(prevYear, prevMonth, day),
            weekday: (firstWeekday - i - 1 + 7) % 7,
            dateKey: `${prevYear}-${prevMonth}-${day}`
        });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const weekday = (firstWeekday + day - 1) % 7;
        grid.push({
            day,
            month: props.month,
            year: props.year,
            isCurrentMonth: true,
            isToday: isToday(props.year, props.month, day),
            weekday,
            dateKey: `${props.year}-${props.month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        });
    }
    
    // Next month days
    const remaining = 35 - grid.length;
    for (let day = 1; day <= remaining; day++) {
        const weekday = (firstWeekday + daysInMonth + day - 1) % 7;
        grid.push({
            day,
            month: nextMonth,
            year: nextYear,
            isCurrentMonth: false,
            isToday: isToday(nextYear, nextMonth, day),
            weekday,
            dateKey: `${nextYear}-${nextMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        });
    }
    

    // If we have more than 35 days (overflow from 6th row)
    if (grid.length > 35) {
        const overflowCount = grid.length - 35;
        
        // Remove the overflow items from the end
        const overflowItems = grid.splice(35, overflowCount);
        
        // Replace the first 'overflowCount' items with the overflow items
        for (let i = 0; i < overflowCount; i++) {
            grid[i] = {
                ...overflowItems[i],
            };
        }
    }
    
    return grid;
});

// Get gregorian day
function getGregorianDay(year: number, month: number, day: number): string {
    const gregorianDate = toGregorian(year, month, day)
    return gregorianDate.toLocaleDateString('en-US', { day: 'numeric' })
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

// Get categories for given day
function getDayCaregories(day: number){
    const categories = new Map<string, Record<string, string>>();

    for(const event of getEvents(day)){
        const cat = {
            label: event.category,
            color: event.color
        }
        if(cat.color && cat.label){
            categories.set(event.category, cat)
        }
    }
    return Array.from(categories.values())
}

// Get events for given day
const getEvents = (day: number): any[] => {
    const key = `${props.year}/${props.month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
    const wildcardKey = `*/${props.month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
    return props.events.filter(
        (e: CalendarEvent) => e.startDate === key || e.startDate === wildcardKey
    ) ?? [];
};

// Tooltip handlers
const showTooltip = (day: number, show: boolean) => {
    tooltipsFlag.value[day] = show;
};

// Day selection handler
const selectDate = (item: any) => {
    if (!item.isCurrentMonth) return;
    
    if ("vibrate" in navigator) {
        navigator.vibrate(20);
    }    
    
    emits("select-date", {
        ...item,
        events: getEvents(item.day)
    });
};

// Lfecycle hooks
onMounted(() => {
    if (!props.year || !props.month || !props.day) {
        emits("update:year", currentDate.value.year);
        emits("update:month", currentDate.value.month);
        emits("update:day", currentDate.value.day);
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

.calendar-body-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    gap: 2rem;
    animation: fadeSlide 0.2s ease-out
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

.calendar-body-grid-cards {
    display: flex;
    position: relative;
    padding: 0.7rem;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-width: 0;
    height: 100px;
    border-radius: var(--cal-radius);
    cursor: pointer;
    background-color: var(--cal-surface);
    border: 1px solid var(--cal-border);
    transition: border-color 0.3s ease, background-color 0.3s ease;
}

.calendar-body-grid-cards:not(.disabled):hover {
    background-color: var(--cal-hover);
}

.calendar-body-grid-cards.today {
    background-color: var(--cal-today);
    border: 1px solid var(--cal-today-border);
    background-clip: padding-box;
    position: relative;
}

.calendar-body-grid-cards.disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.calendar-body-grid-cards:nth-child(7n){
    border-color: var(--cal-weekend);
    background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        var(--cal-weekend) 10px,
        var(--cal-weekend) 30px
    );
}

.calendar-body-grid-cards:nth-child(7n):hover {
    border-color: var(--cal-weekend-hover);
    background-image: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        var(--cal-weekend-hover) 10px,
        var(--cal-weekend-hover) 30px
    );
}

.calendar-body-grid-cards-day {
    font-size: clamp(1.1rem, 5vw, 2rem);
    font-weight: bold;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    gap: 5px;
    color: var(--cal-text-primary);
}

.gregorian-date {
    font-size: 0.5em;
    color: var(--cal-text-secondary);
}

.calendar-events-grid {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 5px;
    padding: 0;
    width: 100%;
    position: relative;
    max-width: 100%;
}

.calendar-event-legend {
    position: relative;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    background-color: var(--calendar-primary);
    transition: transform 0.2s ease;
}

.calendar-events-grid:hover .calendar-event-legend{
    transform: scale(1.2);
    box-shadow: 0 0 0 2px var(--cal-surface);
}

.calendar-event-tooltip {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: max-content;
    max-width: 250px;
    bottom: 15px;
    left: calc(100% - 5px);
    padding: 0.5rem;
    background-color: var(--cal-surface);
    border: 1px solid var(--cal-border);
    color: var(--cal-text-primary);
    border-radius: var(--cal-radius) var(--cal-radius) var(--cal-radius) 0;
    list-style-position: inside;
    list-style-type: decimal;
    z-index: 5;
}

.calendar-body-grid-cards:nth-child(7n + 1) .calendar-event-tooltip,
.calendar-body-grid-cards:nth-child(7n + 2) .calendar-event-tooltip,
.calendar-body-grid-cards:nth-child(7n + 3) .calendar-event-tooltip,
.calendar-body-grid-cards:nth-child(7n + 4) .calendar-event-tooltip {
    right: 5px;
    left: auto;
    border-radius: var(--cal-radius) var(--cal-radius) 0 var(--cal-radius);
}

.calendar-event-item {
    font-size: clamp(0.7rem, 2vw, 0.8rem);
    text-align: right;
    line-height: 1.2;
}

@media (max-width: 768px) {
    .calendar-weekdays-grid {
        gap: 1rem;
    }

    .calendar-body-grid-cards-day {
        flex-direction: column-reverse;
        align-items: center;
        gap: 0;
    }

    .gregorian-date {
        font-size: 0.7em;
    }
    
    .calendar-body-grid {
        gap: 1rem;
    }
    
    .calendar-weekdays-card {
        padding: 8px;
        font-size: 0.85rem;
    }
    
    .calendar-body-grid-cards {
        height: 85px;
        padding: 0.4rem;
    }
}

@media (max-width: 640px) {
    .calendar-weekdays-grid {
        gap: 0.5rem;
    }
    
    .calendar-body-grid {
        gap: 0.5rem;
    }
    
    .calendar-weekdays-card {
        padding: 6px 2px;
        font-size: 0.7rem;
        white-space: nowrap;
    }
    
    .calendar-body-grid-cards {
        height: 70px;
        padding: 0.3rem;
    }
    
    .calendar-body-grid-cards-day {
        font-size: 0.9rem;
    }
    
    .calendar-event-legend {
        width: 6px;
        height: 6px;
    }
    
    .calendar-events-grid {
        gap: 1.5px;
    }

    .calendar-event-tooltip {
        max-width: 150px;
        bottom: 10px;
    }
}

@media (max-width: 480px) {
    .calendar-weekdays-card {
        font-size: 0.6rem;
        padding: 4px 1px;
    }
    
    .calendar-body-grid-cards {
        height: 60px;
    }
    
    .calendar-body-grid-cards-day {
        font-size: 0.8rem;
    }
}
</style>
