<template>
    <div class="calendar-root" :data-theme="theme || 'light'" :class="{ 'calendar-disabled': disabled }">
        <!-- Loading State -->
        <div v-if="loading" class="calendar-skeleton">
            <div class="skeleton-header"></div>
            <div class="skeleton-grid">
                <div v-for="i in 35" :key="i" class="skeleton-card"></div>
            </div>
        </div>
        
        <!-- Calendar Content -->
        <div v-else class="calendar-container">
            <!-- Header -->
            <ParsCalendarHeader 
                v-model:year="internalYear" 
                v-model:month="internalMonth"
                v-model:day="internalDay"
                :disabled="disabled"
            />

            <!-- View Switcher -->
            <ParsCalendarViewSwitcher
                v-model:selected="currentView"
                :disabled="disabled"
            />

            <!-- Dynamic View -->
            <component 
                :is="currentViewComponent"
                v-model:year="internalYear"
                v-model:month="internalMonth"
                v-model:day="internalDay"
                :events="filteredEvents"
                :disabled="disabled"
                @select-date="handleDateSelect"
                @select-event="handleEventSelect"
            />

            <!-- Category Legends -->
            <div v-if="showLegends !== false" class="bottom-category-legends">
                <div 
                    v-for="category in uniqueCategories"
                    :key="category.label"
                    class="bottom-category-item"
                >
                    <div 
                        class="calendar-event-legend"
                        :style="{ backgroundColor: category.color }"
                    ></div>
                    {{ category.label }}
                </div>
            </div>

            <!-- Keyboard Hints -->
            <div v-if="showKeyboardHint !== false" class="keyboard-hint">
                <div class="key-row">
                    <ChevronRight class="key-icon" />
                    <ChevronLeft class="key-icon" />
                    <span class="key-text">تغییر ماه</span>
                </div>
                <div class="key-row">
                    <ChevronUp class="key-icon" />
                    <ChevronDown class="key-icon" />
                    <span class="key-text">تغییر سال</span>
                </div>
                <div class="key-row">
                    <span class="key-custom">HOME / T / t</span>
                    <span class="key-text">امروز</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

// Lucide icon
import { 
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronDown 
} from 'lucide-vue-next';

// Internal imports
import { calendarEvents } from './data/events';
import { getCurrentJalaliDate, toGregorian } from './core/parsCalendarEngine';
import type { CalendarEvent } from './types/event';
import type { CalendarTheme } from './types/theme';
import type { CalendarView } from './types/views';

// Components
import ParsCalendarHeader from './components/ParsCalendarHeader.vue';
import ParsCalendarViewSwitcher from './components/ParsCalendarViewSwitcher.vue';
import ParsCalendarMonthView from './components/ParsCalendarMonthView.vue';
import ParsCalendarWeekView from './components/ParsCalendarWeekView.vue';
import ParsCalendarDayView from './components/ParsCalendarDayView.vue';
import ParsCalendarAgendaView from './components/ParsCalendarAgendaView.vue';
import ParsCalendarYearView from './components/ParsCalendarYearView.vue';

// Props
const props = withDefaults(
    defineProps<{
        // Core
        theme?: CalendarTheme
        view?: CalendarView
        events?: CalendarEvent[]
        
        // v-model bindings
        year?: number
        month?: number
        day?: number
        
        // State
        loading?: boolean
        disabled?: boolean
        
        // Filtering
        filterCategories?: string[]
        
        // UI options
        showKeyboardHint?: boolean
        showLegends?: boolean
    }>(),
    {
        showKeyboardHint: true,
        showLegends: true
    }
)

// Emits
const emits = defineEmits<{
    // v-model
    'update:year': [value: number]
    'update:month': [value: number]
    'update:day': [value: number]
    
    // User actions
    'select-date': [date: {
        year: number
        month: number
        day: number
        events: CalendarEvent[]
        jalali: string
        gregorian: string
    }]
    'select-event': [event: CalendarEvent]
    'view-change': [view: CalendarView]
    'month-change': [year: number, month: number]
}>()

// Internal states
const currentView = ref<CalendarView>(props.view || 'month')

const internalYear = ref(props.year || 1403)
const internalMonth = ref(props.month || 1)
const internalDay = ref(props.day || 1)

// Merge built-in events with user events
const allEvents = ref<CalendarEvent[]>([
    ...calendarEvents,
    ...(props.events || [])
])

// Filter events by categories
const filteredEvents = computed(() => {
    if (!props.filterCategories?.length) return allEvents.value    
    return allEvents.value.filter(e => props.filterCategories?.includes(e.category))
})

// Unique categories for legends
const uniqueCategories = computed(() => {
    const categories = new Map<string, { label: string; color: string }>()
    
    for (const event of filteredEvents.value) {
        if (event.color && event.category && !categories.has(event.category)) {
            categories.set(event.category, {
                label: event.categoryTitle,
                color: event.color
            })
        }
    }
    
    return Array.from(categories.values())
})

// View components
const viewComponents = {
    month: ParsCalendarMonthView,
    week: ParsCalendarWeekView,
    agenda: ParsCalendarAgendaView,
    day: ParsCalendarDayView,
    year: ParsCalendarYearView
}

const currentViewComponent = computed(() => viewComponents[currentView.value])

// Watchers
// Sync external props to internal
watch(() => props.year, (val) => { if (val) internalYear.value = val })
watch(() => props.month, (val) => { if (val) internalMonth.value = val })
watch(() => props.day, (val) => { if (val) internalDay.value = val })

// Emit internal changes
watch(internalYear, (val) => emits('update:year', val))
watch(internalMonth, (val) => emits('update:month', val))
watch(internalDay, (val) => emits('update:day', val))
watch(currentView, (val) => emits('view-change', val))

// Emit month change
watch([internalYear, internalMonth], ([year, month]) => {
    emits('month-change', year, month)
})

// Event handlers
function handleDateSelect(selected: any) {
    const gregorianDate = toGregorian(selected.year, selected.month, selected.day)
    
    emits('select-date', {
        year: selected.year,
        month: selected.month,
        day: selected.day,
        events: selected.events || [],
        jalali: `${selected.year}-${selected.month}-${selected.day}`,
        gregorian: gregorianDate.toISOString()
    })
}

function handleEventSelect(event: CalendarEvent) {
    emits('select-event', event)
}

// Lifecycle hooks
onMounted(() => {
    // Only set defaults if no props provided
    if (!props.year && !props.month && !props.day) {
        const today = getCurrentJalaliDate()
        internalYear.value = today.year
        internalMonth.value = today.month
        internalDay.value = today.day
    }
})
</script>

<style scoped>
.calendar-root {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    background: var(--cal-bg);
    box-shadow: 0px 4px 10px oklch(0 0 0 / 0.2);
    border-radius: var(--cal-radius);
    max-width: 1400px;
    margin: 0 auto;
    padding: clamp(0.5rem, 1vw, 1rem);
}

.calendar-disabled {
    opacity: 0.6;
    pointer-events: none;
}

.calendar-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* Skeleton Loading */
.calendar-skeleton {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.skeleton-header {
    height: 80px;
    background: linear-gradient(
        45deg, 
        rgba(100, 100, 100, 0.2) 25%, 
        rgba(200, 200, 200, 0.3) 50%, 
        rgba(100, 100, 100, 0.2) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 3s infinite;
    border-radius: var(--cal-radius);
}

.skeleton-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1rem;
}

.skeleton-card {
    height: 100px;
    background: linear-gradient(
        45deg, 
        rgba(100, 100, 100, 0.2) 25%, 
        rgba(200, 200, 200, 0.3) 50%, 
        rgba(100, 100, 100, 0.2) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 3s infinite;
    border-radius: var(--cal-radius);
}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* Keyboard Hints */
.keyboard-hint {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
    padding: 8px;
    height: 32px;
}

.key-row {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.8rem;
    color: var(--cal-text-secondary);
}

.key-icon {
    width: 20px;
    height: 20px;
    stroke: var(--cal-text-primary);
}

.key-custom {
    color: var(--cal-text-primary);
}

.key-text {
    margin-right: 4px;
}

/* Category Legends */
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
    flex-shrink: 0;
    background-color: var(--calendar-primary);
    transition: transform 0.2s ease;
}

/* Responsive */
@media (max-width: 900px) {
    .keyboard-hint {
        display: none;
    }
}

@media (max-width: 768px) {
    .bottom-category-legends {
        gap: 0.2rem 0.5rem;
    }
    
    .skeleton-card {
        height: 70px;
    }
}
</style>
