<template>
    <div class="calendar-view-switcher">
        <button 
            v-for="view in views" 
            :key="view.id"
            :class="['view-btn', { active: selected === view.id }]"
            @click="emits('update:selected', view.id)"
        >
            <component :is="view.icon" class="view-icon" />
            <div class="view-label">
                <span>{{ view.label.fa }}</span>
                <span class="view-sublabel">{{ view.label.en }}</span>
            </div>
        </button>
    </div>
</template>

<script setup lang="ts">
// Lucide icon
import { 
    Calendar1, 
    CalendarDays, 
    CalendarMinus2, 
    CalendarRange, 
    LayoutList 
} from 'lucide-vue-next';

// Internal imports
import { CalendarView } from '../types/views';

// Props
defineProps<{ 
    selected: CalendarView 
}>()

// Emits
const emits = defineEmits<{ 
    'update:selected': [view: CalendarView] 
}>()

// Calendar views
const views: Record<string, any> = [
    { 
        id: 'month', 
        label: { 
            fa: 'ماه', 
            en: 'month' 
        }, 
        icon: CalendarDays 
    },
    { 
        id: 'week', 
        label: { 
            fa: 'هفته', 
            en: 'week' 
        }, 
        icon: CalendarRange 
    },
    { 
        id: 'day', 
        label: { 
            fa: 'روز', 
            en: 'day' 
        }, 
        icon: Calendar1 
    },
    { 
        id: 'year', 
        label: { 
            fa: 'سال', 
            en: 'year' 
        }, 
        icon: CalendarMinus2 
    },
    { 
        id: 'agenda', 
        label: { 
            fa: 'لیست', 
            en: 'agenda' 
        }, 
        icon: LayoutList 
    }
]
</script>

<style scoped>
.calendar-view-switcher {
    display: flex;
    align-items: center;
    padding: 10px;
    gap: 4px;
    padding: 4px;
    background: var(--cal-surface);
    border-radius: var(--cal-radius);
    width: fit-content;
    margin-right: auto;
}

.view-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 10px;
    height: 36px;
    background: transparent;
    border: none;
    border-radius: calc(var(--cal-radius) - 2px);
    color: var(--cal-text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.85rem;
    white-space: nowrap;
}

.view-btn:hover {
    background-color: var(--cal-hover);
    color: var(--cal-text-primary);
}

.view-btn.active {
    background-color: var(--cal-primary);
    color: white;
}

.view-icon {
    width: 25px;
    height: 25px;
    stroke-width: 1.5;
}

.view-label {
    font-size: 0.9rem;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    line-height: 1;
}

.view-sublabel {
    font-size: 0.6rem;
    opacity: 0.9;
}

@media (max-width: 640px) {
    .view-label {
        display: none;
    }
    
    .view-btn {
        padding: 6px 12px;
    }
    
    .view-icon {
        width: 18px;
        height: 18px;
    }
}
</style>
