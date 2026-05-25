<template>
    <div class="year-view-container">
        <!-- Months Grid-->
        <div class="months-grid">
            <div 
                v-for="month in months" 
                :key="year"
                class="month-card"
                :class="{ 'current-month': month.number === currentMonth && month.year === currentYear }"
                @click="goToMonth(month.number)"
            >
                <div class="month-name">{{ month.name }}</div>
                <div class="month-days">{{ month.days }} روز</div>
                <div class="month-event-dots">
                    <!-- Show unique categories as dots -->
                    <div 
                        v-for="(cat, idx) in month.uniqueCategories.slice(0, 4)"
                        :key="cat.name"
                        class="month-event-dot"
                        :style="{ backgroundColor: cat.color }"
                        :title="cat.name"
                    ></div>
                    <span v-if="month.uniqueCategories.length > 4" class="more-dots">
                        +{{ month.uniqueCategories.length - 4 }}
                    </span>
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
    "select-date": [date: Record<string, any>];
    "update:year": [number];
    "update:month": [number];
    "update:day": [number];
}>();

// Refs
const currentDate = ref<JalaliDate>(getCurrentJalaliDate());
const currentYear = computed(() => currentDate.value.year);
const currentMonth = computed(() => currentDate.value.month);

// Months grid
const months = computed(() => {
    const monthNames = [
        "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
        "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
    ];
    
    return monthNames.map((name, index) => {
        const monthNumber = index + 1;
        const daysInMonth = getJalaliMonthDays(props.year, monthNumber);
        
        // Find unique categories for this month
        const categoriesMap = new Map<string, { name: string; color: string }>();
        
        if (props.events) {
            for (let day = 1; day <= daysInMonth; day++) {
                const dateKey = `${props.year}/${monthNumber.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
                const wildcardKey = `*/${monthNumber.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
                
                const dayEvents = props.events.filter(event => 
                    event.startDate === dateKey || event.startDate === wildcardKey
                );
                
                for (const event of dayEvents) {
                    const categoryName = event.category;
                    const categoryColor = event.color;
                    
                    if (!categoriesMap.has(categoryName)) {
                        categoriesMap.set(categoryName, {
                            name: categoryName,
                            color: categoryColor
                        });
                    }
                }
            }
        }
        
        return {
            number: monthNumber,
            name: name,
            days: daysInMonth,
            uniqueCategories: Array.from(categoriesMap.values()),
            year: props.year
        };
    });
});

// Go to selected month
const goToMonth = (month: number) => {
    if ("vibrate" in navigator) {
        navigator.vibrate(20);
    }
    
    emits("update:year", props.year);
    emits("update:month", month);
    emits("update:day", 1);
    
    emits("select-date", {
        year: props.year,
        month: month,
        day: 1,
        title: `ماه ${months.value[month - 1].name}`
    });
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
.year-view-container {
    background: var(--cal-surface);
    border-radius: var(--cal-radius);
    padding: 16px;
}

.months-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}

.month-card {
    background: var(--cal-surface);
    border: 1px solid var(--cal-border);
    border-radius: var(--cal-radius);
    padding: 16px 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
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

.month-card:hover {
    transform: translateY(-4px);
    border-color: var(--cal-primary);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.month-card.current-month {
    border: 2px solid var(--cal-primary);
    background: var(--cal-today);
}

.month-name {
    font-size: 1rem;
    font-weight: 600;
    color: var(--cal-text-primary);
    margin-bottom: 8px;
}

.month-days {
    font-size: 0.7rem;
    color: var(--cal-text-muted);
    margin-bottom: 12px;
}

.month-event-dots {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 5px;
    min-height: 24px;
}

.month-event-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.more-dots {
    font-size: 0.65rem;
    color: var(--cal-text-muted);
}

@media (max-width: 768px) {
    .months-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
    }
    
    .month-name {
        font-size: 0.85rem;
    }
}

@media (max-width: 480px) {
    .months-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
    }
    
    .month-card {
        padding: 12px 8px;
    }
}
</style>
