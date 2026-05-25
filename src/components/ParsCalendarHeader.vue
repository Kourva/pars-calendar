<template>
    <div class="calendar-header">
        <!-- Titles section -->
        <div class="titles">
            <div class="month-year">
                <Transition name="calendar-fade-slide" mode="out-in">
                    <span :key="year">
                        {{ year }}
                    </span>
                </Transition>
                <Transition name="calendar-fade-slide" mode="out-in">
                    <span :key="month">
                        {{ monthMap[month] }}
                    </span>
                </Transition>
                <Transition name="calendar-fade-slide" mode="out-in">
                    <span class="gregorian-header" :key="`${year}-${month}`">
                        {{ gregorianMonthYear }}
                    </span>
                </Transition>
            </div>

            <!-- Real clock -->
            <div class="day">
                <ParsCalendarTime />
            </div>
        </div>
        
        <!-- Actions -->
        <div class="actions">
            <!-- Year back -->
            <div class="action-button" @click="changeYear('de')">
                <ChevronsRight class="action-icon"/>
                <span class="action-text action-text-desktop">
                    {{ year - 1 }}
                </span>
            </div>
            
            <!-- Month back -->
            <div class="action-button" @click="changeMonth('de')">
                <ChevronRight class="action-icon"/>
                <span class="action-text action-text-desktop">
                    {{ monthMap[prevMonth] }}
                </span>
            </div>
            
            <!-- Today button (now functional) -->
            <div class="action-button today-button" @click="goToToday">
                <span class="action-text">امروز</span>
            </div>
            
            <!-- Month forward -->
            <div class="action-button" @click="changeMonth('in')">
                <span class="action-text action-text-desktop">
                    {{ monthMap[nextMonth] }}
                </span>
                <ChevronLeft class="action-icon"/>
            </div>
            
            <!-- Year forward -->
            <div class="action-button" @click="changeYear('in')">
                <span class="action-text action-text-desktop">
                    {{ year + 1 }}
                </span>
                <ChevronsLeft class="action-icon"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';

// Lucide icons
import { 
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight 
} from 'lucide-vue-next';

// Internal imports
import ParsCalendarTime from './ParsCalendarTime.vue';
import { 
    getCurrentJalaliDate, 
    toGregorian 
} from '../core/parsCalendarEngine';

// Props
const props = defineProps<{
    year: number,
    month: number,
    day: number,
}>()

// Emits
const emits = defineEmits<{
    "update:year": [number],
    "update:month": [number],
    "update:day": [number],
}>()

// Month map
const monthMap: Record<number, string> = {
    1: "فروردین",
    2: "اردیبهشت",
    3: "خرداد",
    4: "تیر",
    5: "مرداد",
    6: "شهریور",
    7: "مهر",
    8: "آبان",
    9: "آذر",
    10: "دی",
    11: "بهمن",
    12: "اسفند",
}

// Current prev month
const prevMonth = computed(() => {
    if(props.month <= 1){
        return 12
    } else {
        return props.month - 1
    }
})

// Current next month
const nextMonth = computed(() => {
    if(props.month >= 12){
        return 1
    } else {
        return props.month + 1
    }
})

// Gregorian month format
const gregorianMonthYear = computed(() =>{
    return getGregorianMonthYear(props.year, props.month)
})

// Get full Gregorian month + year for header
function getGregorianMonthYear(year: number, month: number): string {
    const gregorianDate = toGregorian(year, month, 1)
    return gregorianDate.toLocaleDateString('en-US', { 
        month: 'long',
        year: 'numeric' 
    })
}

// Go to today handler
const goToToday = () => {
    const today = getCurrentJalaliDate()
    emits('update:year', today.year)
    emits('update:month', today.month)
    emits('update:day', today.day)
    if ("vibrate" in navigator) {
        navigator.vibrate([30, 20, 50])
    }
}

// Year change handler
const changeYear = (mode: "in" | "de" = "in"): void => {
    if(mode === "in") {
        emits("update:year", props.year + 1)
    } else {
        emits("update:year", props.year - 1)
    }
    if("vibrate" in navigator){
        navigator.vibrate([30, 20, 50])
    }
}

// Month change handler
const changeMonth = (mode: "in" | "de" = "in"): void => {
    if(mode === "in") {
        if(props.month >= 12) {
            emits("update:year", props.year + 1)
            emits("update:month", 1)
        } else {
            emits("update:month", props.month + 1)
        }
    } else {
        if(props.month <= 1) {
           emits("update:year", props.year - 1)
           emits("update:month", 12)
        } else {
            emits("update:month", props.month - 1)
        }
    }
    if("vibrate" in navigator){
        navigator.vibrate([30, 20, 50])
    }
}

// Keyboard navigation handler
const handleKeydown = (event: KeyboardEvent) => {
    // Ignore if user is typing in an input
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement) {
        return;
    }
    
    switch (event.key) {
        case 'ArrowRight':
            event.preventDefault();
            changeMonth('in');
            break;
        case 'ArrowLeft':
            event.preventDefault();
            changeMonth('de');
            break;
        case 'ArrowUp':
            event.preventDefault();
            changeYear('in');
            break;
        case 'ArrowDown':
            event.preventDefault();
            changeYear('de');
            break;
        case 'Home':
            event.preventDefault();
            goToToday();
            break;
        case 't':
        case 'T':
            event.preventDefault();
            goToToday();
            break;
    }
};

// Lifecycle hooks
onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.calendar-header {
    display: grid;
    align-items: flex-start;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}

.titles {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.month-year {
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: clamp(2rem, 5vw, 2.5rem);
    color: var(--cal-text-primary);
    font-weight: bold;
    flex-wrap: wrap;
}

.gregorian-header {
    font-size: 0.5em;
    font-weight: normal;
    direction: rtl;
    display: inline-block;
    color: var(--cal-text-secondary);
}

.day {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: clamp(0.7rem, 2vw, 1.2rem);
    color: var(--cal-text-secondary);
    flex-wrap: wrap;
    padding: 4px 10px;
    width: fit-content;
}

.actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    width: 100%;
}

.action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    border: 1px solid var(--cal-border);
    border-radius: var(--cal-radius);
    padding: 0 12px;
    height: 40px;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.3s ease;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    color: var(--cal-text-secondary);
    background-color: var(--cal-surface);
}

.action-button:hover {
    background-color: var(--cal-hover-primary);
}

.action-button.today-button {
    padding: 0 20px;
}

.action-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
}

.action-text {
    font-size: clamp(0.7rem, 1.8vw, 0.9rem);
    height: fit-content;
}

@media (max-width: 640px) {
    .action-text-desktop {
        display: none;
    }
    
    .action-button {
        padding: 8px;
    }
    
    .action-icon {
        width: 20px;
        height: 20px;
    }
    
    .today-button .action-text {
        display: inline-block;
        font-size: 0.75rem;
    }
    
    .actions {
        gap: 6px;
    }

    .month-year {
        gap: 0.5rem;
        font-size: clamp(1.5rem, 6vw, 2rem);
    }
}

@media (min-width: 641px) and (max-width: 900px) {
    .action-text-desktop {
        font-size: 0.7rem;
    }
    
    .action-button {
        padding: 5px 8px;
    }
}

@media (max-width: 1130px) {
    .calendar-header {
        grid-template-columns: 1fr;
        gap: 15px;
    }
    
    .actions {
        justify-content: space-around;
    }
    
    .titles {
        align-items: center;
        text-align: center;
    }
    
    .month-year {
        justify-content: center;
    }
    
    .day {
        justify-content: center;
    }
}

@media (min-width: 1130px) {
    .actions {
        justify-content: flex-end;
    }
}
</style>
