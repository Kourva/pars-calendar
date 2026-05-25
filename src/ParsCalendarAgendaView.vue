<template>
    <div class="agenda-view-container">
        <!-- Events List -->
        <div class="agenda-events-list">
            <template v-if="groupedEvents.length > 0">
                <div 
                    v-for="group in groupedEvents" 
                    :key="group.dateKey"
                    class="agenda-group"
                >
                    <!-- Date separator -->
                    <div :class="['agenda-date-separator', {today: group.isToday}]">
                        <div class="agenda-date-info">
                            <span class="agenda-jalali-date">
                                {{ group.jalaliDay }} {{ getMonthName(group.month) }}
                            </span>
                            <span class="agenda-gregorian-date">
                                ({{ group.gregorianDate }})
                            </span>
                        </div>
                        <div class="agenda-weekday">
                            {{ getWeekdayName(group.weekday) }}
                        </div>
                    </div>

                    <!-- Events for this day -->
                    <div class="agenda-events">
                        <div 
                            v-for="event in group.events"
                            :key="event.id"
                            class="agenda-event-item"
                            @click="selectEvent(event)"
                        >
                            <div 
                                class="agenda-event-color"
                                :style="{ backgroundColor: event.color }"
                            ></div>
                            <div class="agenda-event-content">
                                <div class="agenda-event-title">{{ event.title }}</div>
                                <div class="agenda-event-category">{{ event.category }}</div>
                            </div>
                            <div v-if="event.startTime" class="agenda-event-time">
                                <span>{{ event.startTime }}</span>
                                <template v-if="event.endTime">
                                    <span>-</span>
                                    <span>{{ event.endTime }}</span>
                                </template>
                            </div>
                        </div>
                        
                        <!-- Empty state for day -->
                        <div v-if="group.events.length === 0" class="agenda-empty-day">
                            بدون رویداد
                        </div>
                    </div>
                </div>
            </template>

            <!-- No events at all -->
            <div v-else class="agenda-no-events">
                <span class="no-events-icon">📭</span>
                <span>هیچ رویدادی یافت نشد</span>
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
    toGregorian,
    toJalali,
    type JalaliDate 
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
    "select-event": [date: CalendarEvent];
    "update:year": [number];
    "update:month": [number];
    "update:day": [number];
}>();

// Get current date for today highlight
const currentDate = ref<JalaliDate>(getCurrentJalaliDate());

// Generate all days in current month
const daysInMonth = computed(() => {
    return getJalaliMonthDays(props.year, props.month);
});

// Group events by day
const groupedEvents = computed(() => {
    const groups = [];
    
    for (let day = 1; day <= daysInMonth.value; day++) {
        const dateKey = `${props.year}/${String(props.month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
        const wildcardKey = `*/${String(props.month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
        
        // Get events for this day
        const dayEvents = props.events?.filter(event => 
            event.startDate === dateKey || event.startDate === wildcardKey
        ) ?? [];
        
        // Get Gregorian date
        const gregorianDate = toGregorian(props.year, props.month, day);
        
        // Calculate weekday (0-6, Saturday=0)
        let weekday = gregorianDate.getDay();
        let persianWeekday = weekday === 6 ? 0 : weekday + 1;
        
        groups.push({
            day: day,
            month: props.month,
            year: props.year,
            dateKey: dateKey,
            jalaliDay: day,
            gregorianDate: gregorianDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            }),
            weekday: persianWeekday,
            events: dayEvents,
            isToday: isToday(props.year, props.month, day)
        });
    }
    
    return groups;
});

// Get month name
const getMonthName = (month: number): string => {
    const months = [
        "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", 
        "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
    ];
    return months[month - 1];
};

// Get weekday name
const getWeekdayName = (weekday: number): string => {
    const names = [
        "شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"
    ];
    return names[weekday];
};

// Check if given day is today
const isToday = (year: number, month: number, day: number): boolean => {
    return currentDate.value.year === year &&
           currentDate.value.month === month &&
           currentDate.value.day === day;
};

// Event handlers
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
.agenda-view-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: var(--cal-surface);
    border-radius: var(--cal-radius);
    overflow: hidden;
}

.agenda-events-list {
    display: flex;
    flex-direction: column;
    max-height: 500px;
    overflow-y: auto;
}

.agenda-group {
    border-bottom: 1px solid var(--cal-border);
}

.agenda-date-separator {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background: var(--cal-hover);
    cursor: pointer;
    transition: background 0.2s;
}

.agenda-date-separator:hover {
    background: var(--cal-hover-primary);
}

.agenda-date-separator.today {
    background: var(--cal-today);
    border-right: 3px solid var(--cal-today-border);
}

.agenda-date-info {
    display: flex;
    align-items: baseline;
    gap: 8px;
}

.agenda-jalali-date {
    font-size: 1rem;
    font-weight: bold;
    color: var(--cal-text-primary);
}

.agenda-gregorian-date {
    font-size: 0.75rem;
    color: var(--cal-text-muted);
}

.agenda-weekday {
    font-size: 0.85rem;
    color: var(--cal-text-secondary);
}

.agenda-events {
    padding: 8px 20px;
}

.agenda-event-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    margin: 6px 0;
    border-radius: 8px;
    background: var(--cal-surface);
    border: 1px solid var(--cal-border);
    cursor: pointer;
    transition: all 0.2s ease;
}

.agenda-event-item:hover {
    transform: translateX(4px);
    border-color: var(--cal-primary);
    background: var(--cal-hover);
}

.agenda-event-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
}

.agenda-event-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.agenda-event-title {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--cal-text-primary);
}

.agenda-event-category {
    font-size: 0.7rem;
    color: var(--cal-text-muted);
}

.agenda-event-time {
    font-size: 0.75rem;
    color: var(--cal-text-secondary);
    background: var(--cal-hover);
    padding: 2px 8px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.agenda-empty-day {
    text-align: center;
    color: var(--cal-text-muted);
    font-size: 0.75rem;
    padding: 16px;
}

.agenda-no-events {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 40px;
    text-align: center;
    color: var(--cal-text-muted);
}

.no-events-icon {
    font-size: 3rem;
    opacity: 0.5;
}

@media (max-width: 640px) {
    .agenda-date-separator {
        padding: 10px 16px;
    }
    
    .agenda-events {
        padding: 8px 12px;
    }
    
    .agenda-event-item {
        padding: 8px 10px;
    }
    
    .agenda-event-title {
        font-size: 0.8rem;
    }
    
    .agenda-jalali-date {
        font-size: 0.9rem;
    }
}
</style>
