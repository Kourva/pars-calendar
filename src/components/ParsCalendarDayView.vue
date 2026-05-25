<template>
    <div class="day-view-container">
        <!-- Timeline Ruler -->
        <div class="timeline-ruler" ref="rulerScrollRef" @wheel="handleHorizontalScroll">
            <div class="ruler-track">
                <div 
                    v-for="hour in timeSlots" 
                    :key="hour"
                    class="ruler-hour"
                    :class="{ 'current-hour': isCurrentHour(hour) }"
                >
                    <span class="hour-label">{{ hour }}:00</span>
                </div>
            </div>
        </div>

        <!-- Events Timeline -->
        <div class="timeline-tracks" ref="tracksScrollRef" @scroll="syncScroll" @wheel="handleHorizontalScroll">
            <div 
                v-for="(event, index) in allEvents"
                :key="currentWeekday"
                class="timeline-track"
            >
                <div class="track-event"
                    :style="{
                        left: `${getEventLeft(event)}%`,
                        width: `${getEventWidth(event)}%`,
                        backgroundColor: event.color
                    }"
                    @click="selectEvent(event)"
                >
                    <div class="track-event-content">
                        <span class="event-title">{{ event.title }}</span>
                        <span
                            v-if="event.startTime" 
                            class="event-time"
                        >
                            {{ event.startTime }}
                            <template v-if="event.endTime">
                                - {{ event.endTime }}
                            </template>
                        </span>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="allEvents.length === 0" class="empty-tracks">
                <span>هیچ رویدادی برای این روز وجود ندارد</span>
            </div>
        </div>

        <!-- Day Navigation -->
        <div class="day-navigation">
            <button class="day-nav-btn" @click="navigateDay(-1)">
                <ChevronRight class="nav-icon" />
                روز قبل
            </button>
            <span class="day-range">
                {{ currentWeekday }} {{ jalaliDay.day }} {{ getMonthName(jalaliDay.month) }}
            </span>
            <button class="day-nav-btn" @click="navigateDay(1)">
                روز بعد
                <ChevronLeft class="nav-icon" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';

// Internal imports
import { 
    getCurrentJalaliDate, 
    toGregorian,
    toJalali,
    type JalaliDate 
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
    "select-event": [date: CalendarEvent];
    "update:year": [number];
    "update:month": [number];
    "update:day": [number];
}>();

// Refs
const rulerScrollRef = ref<HTMLElement | null>(null);
const tracksScrollRef = ref<HTMLElement | null>(null);
const timeSlots = ref(Array.from({ length: 24 }, (_, i) => i));
const TOTAL_HOURS = 24;
const currentDate = ref<JalaliDate>(getCurrentJalaliDate());

// Sync both section's scroll
const syncScroll = () => {
    if (rulerScrollRef.value && tracksScrollRef.value) {
        rulerScrollRef.value.scrollLeft = tracksScrollRef.value.scrollLeft;
    }
};

// Check if given hour is current hour
const isCurrentHour = (hour: number) => {
    const now = new Date();
    return now.getHours() === hour && isToday();
};

// Check if given day is today
const isToday = () => {
    return currentDate.value.year === props.year &&
           currentDate.value.month === props.month &&
           currentDate.value.day === props.day;
};

// Get current weekday for display
const currentWeekday = computed(() => {
    const gregorianDate = toGregorian(props.year, props.month, props.day);
    let weekday = gregorianDate.getDay();
    const persianWeekday = weekday === 6 ? 0 : weekday + 1;
    const names = ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];
    return names[persianWeekday];
});


// Jalali date for header
const jalaliDay = computed(() => ({
    year: props.year,
    month: props.month,
    day: props.day,
}));

// Handle day navigation
const navigateDay = (direction: number) => {
    // Get current Gregorian date
    const currentGregorian = toGregorian(props.year, props.month, props.day);
    
    // Add/subtract 1 day
    currentGregorian.setDate(currentGregorian.getDate() + direction);
    
    // Convert back to Jalali
    const newJalali = toJalali(currentGregorian);
    
    // Update parent
    emits("update:year", newJalali.year);
    emits("update:month", newJalali.month);
    emits("update:day", newJalali.day);
    
    // Haptic feedback
    if ("vibrate" in navigator) {
        navigator.vibrate(20);
    }
};

const handleHorizontalScroll = (event: WheelEvent) => {
    // Prevent page vertical scroll
    event.preventDefault();
    
    // Scroll horizontally instead
    if (tracksScrollRef.value) {
        tracksScrollRef.value.scrollLeft -= event.deltaY;
    }
    if (rulerScrollRef.value) {
        rulerScrollRef.value.scrollLeft -= event.deltaY;
    }
};

// Get month name
const getMonthName = (month: number): string => {
    const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", 
                    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
    return months[month - 1];
};

// initialize all events
const allEvents = computed(() => {
    if (!props.events) return [];
    
    const dateKey = `${props.year}/${props.month.toString().padStart(2, '0')}/${props.day.toString().padStart(2, '0')}`;
    const wildcardKey = `*/${props.month.toString().padStart(2, '0')}/${props.day.toString().padStart(2, '0')}`;
    
    return props.events
        .filter(event => event.startDate === dateKey || event.startDate === wildcardKey)
        .map(event => ({
            ...event,
            startHour: event.startTime ? parseInt(event.startTime.split(':')[0]) : 0,
            startMinute: event.startTime ? parseInt(event.startTime.split(':')[1]) : 0,
            endHour: event.endTime ? parseInt(event.endTime.split(':')[0]) : 24,
            endMinute: event.endTime ? parseInt(event.endTime.split(':')[1]) : 0,
        }))
        .sort((a, b) => a.startHour - b.startHour);
});

// Get event's start time
const getEventLeft = (event: any): number => {
    const startMinutes = event.startHour * 60 + event.startMinute;
    return (startMinutes / (TOTAL_HOURS * 60)) * 100;
};

// Get events width
const getEventWidth = (event: any): number => {
    const startMinutes = event.startHour * 60 + event.startMinute;
    const endMinutes = event.endHour * 60 + event.endMinute;
    const durationMinutes = endMinutes - startMinutes;
    return Math.max((durationMinutes / (TOTAL_HOURS * 60)) * 100, 3);
};

// Handle event select
const selectEvent = (event: CalendarEvent) => {
    if ("vibrate" in navigator) navigator.vibrate(30);
    
    emits("select-event", event);
};

// Lifecycle hook
onMounted(() => {
    if (!props.year || !props.month || !props.day) {
        const today = getCurrentJalaliDate();
        emits("update:year", today.year);
        emits("update:month", today.month);
        emits("update:day", today.day);
    }
    
    nextTick(() => {
        if (rulerScrollRef.value && tracksScrollRef.value) {
            rulerScrollRef.value.scrollLeft = tracksScrollRef.value.scrollLeft;
        }
    });
});
</script>

<style scoped>
.day-view-container {
    background: var(--cal-surface);
    border-radius: var(--cal-radius);
    overflow: hidden;
}

.timeline-ruler {
    overflow-x: auto;
    overflow-y: hidden;
    border-bottom: 1px solid var(--cal-border);
    background: var(--cal-surface);
    scrollbar-width: none;
}

.ruler-track {
    display: flex;
    min-width: 2000px;
    height: 40px;
}

.ruler-hour {
    flex: 1;
    position: relative;
    min-width: 80px;
    text-align: center;
    border-right: 1px solid var(--cal-border);
}

.hour-label {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.7rem;
    color: var(--cal-text-secondary);
    white-space: nowrap;
}

.ruler-hour.current-hour .hour-label {
    color: var(--cal-primary);
    font-weight: bold;
}

.timeline-tracks {
    overflow-x: auto;
    overflow-y: auto;
    max-height: 400px;
    scrollbar-width: none;
}

.timeline-track {
    position: relative;
    height: 56px;
    min-width: 2000px;
    border-bottom: 1px solid var(--cal-border);
    background: var(--cal-surface);
}

.timeline-track:hover {
    background: var(--cal-hover);
}

.track-event {
    position: absolute;
    top: 6px;
    bottom: 6px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    z-index: 5;
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

.track-event:hover {
    transform: scaleY(1.06);
    filter: brightness(1.05);
    z-index: 10;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.track-event-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 12px;
    color: white;
    font-size: 0.7rem;
    gap: 12px;
}

.event-title {
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
}

.event-time {
    font-size: 0.6rem;
    opacity: 0.85;
    white-space: nowrap;
}

.empty-tracks {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: var(--cal-text-muted);
    font-size: 0.9rem;
}

.day-navigation {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 12px;
    margin: 8px 0;
    border-top: 1px solid var(--cal-border);
    border-bottom: 1px solid var(--cal-border);
    border-radius: var(--cal-radius);
}

.day-nav-btn {
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

.day-nav-btn:hover {
    background: var(--cal-hover);
    transform: scale(0.98);
}

.nav-icon {
    width: 16px;
    height: 16px;
}

.day-range {
    font-size: 0.9rem;
    color: var(--cal-text-primary);
    font-weight: 500;
    padding: 0 12px;
    text-align: center;
}

@media (max-width: 640px) {
    .day-nav-btn {
        padding: 4px 12px;
        font-size: 0.7rem;
    }
    
    .day-range {
        font-size: 0.7rem;
    }
    
    .nav-icon {
        width: 14px;
        height: 14px;
    }
}

@media (max-width: 640px) {
    .day-date {
        font-size: 1.5rem;
    }
    
    .ruler-hour {
        min-width: 60px;
    }
    
    .hour-label {
        font-size: 0.6rem;
    }
    
    .timeline-track {
        height: 48px;
    }
    
    .track-event-content {
        padding: 0 8px;
    }
    
    .event-time {
        display: none;
    }
}
</style>
