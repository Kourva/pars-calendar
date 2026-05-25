<template>
    <div class="demo-container">
        <!-- Header -->
        <header class="demo-header">
            <h1>📅 Pars Calendar Demo</h1>
            <p>A beautiful, theme-ready Jalali calendar for Vue 3</p>
            <div class="header-links">
                <a href="https://github.com/kourva/pars-calendar" target="_blank">GitHub</a>
                <a href="https://www.npmjs.com/package/@kourva/pars-calendar" target="_blank">npm</a>
                <a href="#" @click.prevent="scrollToInputs">DateTimeInput</a>
            </div>
        </header>

        <!-- Theme Switcher -->
        <div class="theme-section">
            <div class="section-header">
                <h2>🎨 Choose a Theme</h2>
                <span class="theme-count">{{ themes.length }} themes</span>
            </div>
            <div class="theme-grid">
                <button 
                    v-for="theme in themes" 
                    :key="theme"
                    class="theme-btn"
                    :class="{ active: currentTheme === theme }"
                    @click="currentTheme = theme"
                >
                    <span class="theme-dot" :style="{ backgroundColor: getThemeColor(theme) }"></span>
                    <span class="theme-name">{{ theme }}</span>
                </button>
            </div>
        </div>

        <!-- View Switcher -->
        <div class="view-section">
            <div class="section-header">
                <h2>📱 View Mode</h2>
            </div>
            <div class="view-buttons">
                <button 
                    v-for="view in views" 
                    :key="view.id"
                    class="view-btn"
                    :class="{ active: currentView === view.id }"
                    @click="currentView = view.id"
                >
                    {{ view.label }}
                </button>
            </div>
        </div>

        <!-- Calendar -->
        <div class="calendar-wrapper" :data-theme="currentTheme">
            <ParsCalendar 
                :theme="currentTheme"
                :view="currentView"
                :events="sampleEvents"
                @select-date="handleDateSelect"
                @select-event="handleEventSelect"
            />
        </div>

        <!-- DateTimeInput Demo -->
        <div id="inputs" class="inputs-section">
            <div class="section-header">
                <h2>⌨️ DateTimeInput Component</h2>
                <p>Smart date/time input with dynamic format</p>
            </div>
            
            <div class="inputs-grid">
                <div class="input-card">
                    <label>📅 Date (Jalali)</label>
                    <ParsDatePicker
                        format="yyyy/mm/dd"
                        v-model="formData.date1"
                        output-format="jalali"
                        placeholder="1403/07/15"
                    />
                    <span class="input-value">{{ formData.date1 || '—' }}</span>
                </div>
                
                <div class="input-card">
                    <label>📅 Date (Gregorian)</label>
                    <ParsDatePicker
                        format="yyyy-mm-dd"
                        v-model="formData.date2"
                        output-format="gregorian"
                        placeholder="2024-10-06"
                    />
                    <span class="input-value">{{ formData.date2 || '—' }}</span>
                </div>
                
                <div class="input-card">
                    <label>⏰ Time only</label>
                    <ParsDatePicker 
                        format="hh:mi:ss"
                        v-model="formData.date3"
                        placeholder="14:30:00"
                    />
                    <span class="input-value">{{ formData.date3 || '—' }}</span>
                </div>
                
                <div class="input-card">
                    <label>📅 Date & Time</label>
                    <ParsDatePicker 
                        format="yyyy/mm/dd hh:mi"
                        v-model="formData.date4"
                        placeholder="1403/07/15 14:30"
                    />
                    <span class="input-value">{{ formData.date4 || '—' }}</span>
                </div>
                
                <div class="input-card">
                    <label>🔒 Disabled</label>
                    <ParsDatePicker
                        format="yyyy/mm/dd"
                        v-model="formData.date5"
                        disabled
                        placeholder="Disabled"
                    />
                </div>
                
                <div class="input-card">
                    <label>📖 Readonly</label>
                    <ParsDatePicker
                        format="yyyy/mm/dd"
                        v-model="formData.date6"
                        readonly
                        placeholder="Readonly"
                    />
                </div>
            </div>
            
            <div class="json-preview">
                <h3>📋 Form Data (Live)</h3>
                <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
            </div>
        </div>

        <!-- Footer -->
        <footer class="demo-footer">
            <p>Made with ❤️ for the Persian community</p>
            <p class="footer-links">
                <a href="https://github.com/kourva/pars-calendar" target="_blank">GitHub</a>
                <a href="https://www.npmjs.com/package/@kourva/pars-calendar" target="_blank">npm</a>
                <a href="#" @click.prevent="scrollToTop">↑ Back to top</a>
            </p>
        </footer>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ParsCalendar from '../src/ParsCalendar.vue'
import ParsDatePicker from '../src/ParsDatePicker.vue'

// Themes (subset for demo)
const themes = [
    'light', 'dark', 'oled',
    'netflix', 'tiffany', 'iran-premium',
    'royal', 'executive', 'midnight',
    'forest', 'ocean', 'sunset',
    'glass', 'neon', 'pastel'
]

const views = [
    { id: 'month', label: '📅 ماه' },
    { id: 'week', label: '📆 هفته' },
    { id: 'day', label: '📌 روز' },
    { id: 'agenda', label: '📋 لیست' },
    { id: 'year', label: '🗓️ سال' }
]

const currentTheme = ref('light')
const currentView = ref('month')

const formData = ref({
    date1: '1403/07/15',
    date2: '2024-10-06',
    date3: null,
    date4: null,
    date5: null,
    date6: '1403/07/20'
})

// Sample events
const sampleEvents = ref([
    {
        id: 1,
        title: "عید نوروز",
        category: "holiday",
        color: "#ef4444",
        startDate: "*-01-01"
    },
    {
        id: 2,
        title: "جلسه تیم توسعه",
        category: "meeting",
        color: "#3b82f6",
        startDate: "1403-07-15",
        startTime: "14:00",
        endTime: "16:00"
    },
    {
        id: 3,
        title: "رزرو هتل",
        category: "booking",
        color: "#10b981",
        startDate: "1403-08-10",
        endDate: "1403-08-15"
    },
    {
        id: 4,
        title: "تولد سارا",
        category: "birthday",
        color: "#f59e0b",
        startDate: "*-02-15"
    },
    {
        id: 5,
        title: "پرداخت حقوق",
        category: "reminder",
        color: "#8b5cf6",
        startDate: "1403-07-25"
    }
])

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

const handleDateSelect = (date) => {
    console.log('Date selected:', date)
}

const handleEventSelect = (event) => {
    console.log('Event selected:', event)
}

const scrollToInputs = () => {
    document.getElementById('inputs')?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style>
/* Import calendar CSS */
@import '../src/calendar/assets/calendar.css';

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

.demo-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
}

/* Header */
.demo-header {
    text-align: center;
    padding: 40px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 24px;
    margin-bottom: 30px;
    color: white;
}

.demo-header h1 {
    font-size: 2.5rem;
    margin-bottom: 12px;
}

.demo-header p {
    opacity: 0.9;
    margin-bottom: 20px;
}

.header-links {
    display: flex;
    gap: 20px;
    justify-content: center;
}

.header-links a {
    color: white;
    text-decoration: none;
    padding: 8px 20px;
    background: rgba(255,255,255,0.2);
    border-radius: 30px;
    transition: all 0.2s;
}

.header-links a:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
}

/* Section Header */
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 10px;
}

.section-header h2 {
    font-size: 1.3rem;
    color: #1e293b;
}

.theme-count {
    font-size: 0.8rem;
    color: #64748b;
    background: #e2e8f0;
    padding: 4px 10px;
    border-radius: 20px;
}

/* Theme Grid */
.theme-section, .view-section, .inputs-section {
    background: white;
    border-radius: 20px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.theme-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
}

.theme-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.8rem;
}

.theme-btn:hover {
    background: #f1f5f9;
    transform: translateY(-2px);
}

.theme-btn.active {
    border-color: #3b82f6;
    background: #eff6ff;
}

.theme-dot {
    width: 16px;
    height: 16px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

/* View Buttons */
.view-buttons {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.view-btn {
    padding: 10px 20px;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
}

.view-btn:hover {
    background: #f1f5f9;
}

.view-btn.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
}

/* Calendar Wrapper */
.calendar-wrapper {
    background: var(--cal-bg);
    border-radius: 20px;
    padding: 16px;
    margin-bottom: 24px;
    transition: background 0.3s;
}

/* Inputs Grid */
.inputs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
    color: #94a3b8;
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

/* Footer */
.demo-footer {
    text-align: center;
    padding: 30px;
    color: #64748b;
    border-top: 1px solid #e2e8f0;
    margin-top: 20px;
}

.footer-links {
    margin-top: 10px;
    display: flex;
    gap: 20px;
    justify-content: center;
}

.footer-links a {
    color: #64748b;
    text-decoration: none;
    font-size: 0.85rem;
}

.footer-links a:hover {
    color: #3b82f6;
}

/* Responsive */
@media (max-width: 768px) {
    .demo-header h1 {
        font-size: 1.8rem;
    }
    
    .theme-grid {
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    }
    
    .theme-name {
        font-size: 0.7rem;
    }
    
    .inputs-grid {
        grid-template-columns: 1fr;
    }
}
</style>
