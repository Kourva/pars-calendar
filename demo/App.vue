<template>
    <div class="demo-page">
        <!-- Right Content (Main) -->
        <main class="main-content">
            <!-- Calendar Section -->
            <div class="calendar-section">
                <div class="calendar-wrapper" :data-theme="calendarTheme">
                    <ParsCalendar 
                        :theme="calendarTheme"
                        view="month"
                        :events="events"
                        @select-date="handleDateSelect"
                        @select-event="handleEventSelect"
                        @view-change="handleViewChange"
                        @month-change="handleMonthChange"
                    />
                </div>
            </div>
            
            <!-- Inputs Section -->
            <div class="inputs-section">
                <div class="section-header">
                    <h2>⌨️ ParsDatePicker</h2>
                    <p>Smart date/time input with dynamic format</p>
                </div>
                
                <div class="inputs-grid">
                    <div class="input-card">
                        <label>📅 تاریخ (Jalali)</label>
                        <ParsDatePicker
                            format="yyyy/mm/dd"
                            v-model="formData.date1"
                            output-format="jalali"
                            disabled
                        />
                        <span class="input-value">{{ formData.date1 || '—' }}</span>
                    </div>
                    
                    <div class="input-card">
                        <label>📅 تاریخ (Gregorian)</label>
                        <ParsDatePicker
                            format="yyyy-mm-dd"
                            v-model="formData.date2"
                            output-format="gregorian"
                            readonly
                        />
                        <span class="input-value">{{ formData.date2 || '—' }}</span>
                    </div>
                    
                    <div class="input-card">
                        <label>📅 تاریخ آزاد (ISO)</label>
                        <ParsDatePicker
                            format="yyyy/mm/dd"
                            v-model="formData.date2b"
                            output-format="gregorian"
                        />
                        <span class="input-value">{{ formData.date2b || '—' }}</span>
                    </div>
                    
                    <div class="input-card">
                        <label>⏰ زمان</label>
                        <ParsDatePicker 
                            format="hh:mi:ss"
                            v-model="formData.date3"
                        />
                        <span class="input-value">{{ formData.date3 || '—' }}</span>
                    </div>
                    
                    <div class="input-card">
                        <label>📅 تاریخ و زمان</label>
                        <ParsDatePicker 
                            format="yyyy/mm/dd hh:mi"
                            v-model="formData.date4"
                        />
                        <span class="input-value">{{ formData.date4 || '—' }}</span>
                    </div>
                </div>
                
                <div class="json-preview">
                    <h3>📋 فرم دیتا (لایو)</h3>
                    <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
                </div>
            </div>
        </main>

        <!-- Left Sidebar - Theme Buttons (Sticky) -->
        <aside class="theme-sidebar">
            <div class="sidebar-header">
                <h3>🎨 تم‌های تقویم</h3>
                <span class="theme-count">{{ displayThemes.length }} تم</span>
            </div>
            <div class="theme-list">
                <button 
                    v-for="theme in displayThemes"
                    :key="theme"
                    class="theme-button" 
                    @click="calendarTheme = theme"
                    :class="{ active: calendarTheme === theme }"
                >
                    <span class="theme-dot" :style="{ backgroundColor: getThemeColor(theme) }"></span>
                    <span class="theme-name">{{ theme }}</span>
                </button>
            </div>
        </aside>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import ParsCalendar from '../src/ParsCalendar.vue'
import ParsDatePicker from '../src/ParsDatePicker.vue'
import { CALENDAR_THEMES } from '../src/types/theme'

const calendarTheme = ref("light")

// Display themes 
const displayThemes =CALENDAR_THEMES

const events = ref([
    {
        id: 1,
        title: "جلسه کاری",
        category: "meeting",
        categoryTitle: "جلسه",
        color: "#3b82f6",
        startDate: "1405/02/29",
        startTime: "14:00",
        endTime: "16:00"
    },
    {
        id: 2,
        title: "عید نوروز",
        category: "holiday",
        categoryTitle: "تعطیل",
        color: "#ef4444",
        startDate: "*/01/01"
    },
    {
        id: 3,
        title: "رزرو هتل",
        category: "booking",
        categoryTitle: "رزرو",
        color: "#10b981",
        startDate: "1405/03/10",
        endDate: "1405/03/15"
    },
    {
        id: 4,
        title: "تولد سارا",
        category: "birthday",
        categoryTitle: "تولد",
        color: "#f59e0b",
        startDate: "*/02/15"
    }
])

const formData = ref({
    date1: "1404/02/10",
    date2: "2026-02-10",
    date2b: null,
    date3: null,
    date4: null,
})

// Handlers
const handleDateSelect = (date) => {
    console.log('Date selected:', date)
}

const handleEventSelect = (event) => {
    console.log('Event selected:', event)
}

const handleViewChange = (view) => {
    console.log('View changed:', view)
}

const handleMonthChange = (year, month) => {
    console.log('Month changed:', year, month)
}

// Helper for theme dot colors
const getThemeColor = (theme) => {
    const colors = {
        light: '#ffffff', dark: '#1e293b', oled: '#000000',
        netflix: '#e50914', tiffany: '#0ab5b5', 'iran-premium': '#da0000',
        royal: '#9b59b6', executive: '#d4af37', midnight: '#1e3a8a',
        forest: '#22c55e', ocean: '#0ea5e9', sunset: '#f97316',
        glass: '#3b82f6', neon: '#00ff00', pastel: '#f5c6d0'
    }
    return colors[theme] || '#64748b'
}
</script>

<style>
@import '../src/assets/calendar.css';

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: #f5f5f5;
    direction: rtl;
}

.demo-page {
    display: flex;
    min-height: 100vh;
}

/* LEFT SIDEBAR */
.theme-sidebar {
    width: 260px;
    background: white;
    border-left: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    z-index: 10;
}

.sidebar-header {
    padding: 24px 20px;
    border-bottom: 1px solid #e2e8f0;
}

.sidebar-header h3 {
    margin: 0 0 4px 0;
    font-size: 1.1rem;
    color: #1e293b;
}

.theme-count {
    font-size: 0.7rem;
    color: #64748b;
    background: #e2e8f0;
    padding: 2px 8px;
    border-radius: 20px;
}

.theme-list {
    flex: 1;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.theme-button {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border: none;
    background: transparent;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: right;
    font-size: 0.85rem;
    color: #334155;
}

.theme-button:hover {
    background: #f1f5f9;
}

.theme-button.active {
    background: #e0f2fe;
    color: #0284c7;
}

.theme-dot {
    width: 20px;
    height: 20px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

.theme-name {
    flex: 1;
    text-align: right;
}

/* MAIN CONTENT */
.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
    overflow-y: auto;
    max-height: 100vh;
}

/* Calendar Section */
.calendar-section {
    background: transparent;
    border-radius: 24px;
    overflow: hidden;
}

.calendar-wrapper {
    background: var(--cal-bg);
    border-radius: 24px;
    padding: 4px;
    transition: background 0.3s;
}

/* Inputs Section */
.inputs-section {
    background: white;
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.section-header {
    margin-bottom: 20px;
}

.section-header h2 {
    font-size: 1.3rem;
    color: #1e293b;
    margin-bottom: 4px;
}

.section-header p {
    font-size: 0.8rem;
    color: #64748b;
}

.inputs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
}

.input-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.input-card label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.input-value {
    font-size: 0.7rem;
    color: #10b981;
    font-family: monospace;
    padding-top: 4px;
    border-top: 1px dashed #e2e8f0;
}

.json-preview {
    background: #f8fafc;
    border-radius: 12px;
    padding: 16px;
}

.json-preview h3 {
    font-size: 0.85rem;
    margin-bottom: 12px;
    color: #1e293b;
}

.json-preview pre {
    font-size: 0.7rem;
    font-family: monospace;
    color: #334155;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-all;
}

/* Scrollbar */
.theme-sidebar::-webkit-scrollbar,
.main-content::-webkit-scrollbar {
    width: 4px;
}

.theme-sidebar::-webkit-scrollbar-track,
.main-content::-webkit-scrollbar-track {
    background: #e2e8f0;
}

.theme-sidebar::-webkit-scrollbar-thumb,
.main-content::-webkit-scrollbar-thumb {
    background: #94a3b8;
    border-radius: 4px;
}

/* Responsive */
@media (max-width: 768px) {
    .demo-page {
        flex-direction: column-reverse;
    }
    
    .theme-sidebar {
        width: 100%;
        height: auto;
        position: static;
        flex-direction: row;
        overflow-x: auto;
        border-left: none;
        border-top: 1px solid #e2e8f0;
    }
    
    .sidebar-header {
        display: none;
    }
    
    .theme-list {
        flex-direction: row;
        padding: 12px;
        gap: 8px;
    }
    
    .theme-button {
        flex-direction: column;
        padding: 8px;
        min-width: 70px;
    }
    
    .theme-name {
        font-size: 0.7rem;
    }
    
    .main-content {
        padding: 16px;
    }
    
    .inputs-grid {
        grid-template-columns: 1fr;
    }
}
</style>
