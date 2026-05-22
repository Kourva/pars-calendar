<div align="center">
    <h1>📅 Persian Calendar for Vue/Nuxt</h1>
    <p>A beautiful, theme-ready Jalali calendar component built with Vue 3.</p>
</div>

<br>

## 💝 A Message to You

I built this because every Persian calendar project I worked on needed the same fixes: RTL layout, Friday weekends, Jalali dates, event colors, and themes that don't break. Or simply, it's **NOT FREE!**

So here it is. **Free. Open. Yours.** 

> *"Not to be the best. Just to be useful."*

Use it, break it, fix it, share it.

<br>

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌙 **Jalali Calendar** | Accurate Persian date conversion |
| 🎨 **114+ Premium Themes** | Netflix, Tiffany, Spotify, Iran, and 100+ more |
| 📱 **Fully Responsive** | Works on mobile, tablet, desktop |
| ⌨️ **Keyboard Shortcuts** | Navigate like a pro |
| 📅 **Event System** | Add events with categories & colors |
| 🔁 **Yearly Recurring** | Use `*-1-1` for Nowruz every year |
| 🎯 **Today Highlight** | Never lose track |
| 📤 **Export Ready** | JSON, CSV, iCal support (coming soon) |
| ⚡ **Haptic Feedback** | Nothing Phone optimized |
| 🌍 **Dual Display** | See both Jalali & Gregorian at a glance |
| 🖱️ **Smart Input** | Dynamic date/time input with auto-validation |
| 📆 **5 Views** | Month, Week, Day, Agenda, Year |

<br>

## 🚀 Quick Start

Just copy and paste the calendar folder anywhere you want (e.g. `src/components`) and import calendar's style in your `main.js` or Nuxt config, or even inside the template per calendar use.

> [!WARNING]
> ### Use ClientOnly in Nuxt
> Since the calendar uses browser APIs (like `navigator` and `Intl`), you need to wrap it inside `ClientOnly`:
> ```vue
> <template>
>     <ClientOnly>
>         <Calendar ... />
>     </ClientOnly>
> </template>
> ```

### Basic Usage

```vue
<template>
    <Calendar 
        v-model:year="year"
        v-model:month="month"
        v-model:day="day"
        :events="events"
        theme="light"
        @select-date="handleDateSelect"
    />
</template>

<script setup lang="ts">
import Calendar from '@/components/calendar/Calendar.vue'
import '@/components/calendar/assets/calendar.css'

const year = ref(1403)
const month = ref(7)
const day = ref(20)

const events = ref([
    {
        id: 1,
        title: "جلسه کاری",
        category: "meeting",
        startDate: "1403-07-15",
        startTime: "14:00",
        endTime: "16:00"
    }
])

const handleDateSelect = (date) => {
    console.log('Selected:', date)
}
</script>
```

<br>

## 🎨 One Component, Infinite Looks

```vue
<!-- Just change the theme prop -->
<Calendar theme="netflix" />   <!-- Bold & dramatic -->
<Calendar theme="tiffany" />   <!-- Elegant & fresh -->
<Calendar theme="iran" />      <!-- Proud & premium -->
<Calendar theme="glass" />     <!-- Modern & sleek -->
<Calendar theme="oled" />      <!-- Pure black -->
```

**114+ themes ready to use.** Zero CSS conflicts. You can make your custom theme using the `data-theme` attribute!

<br>

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` / `→` | Previous / Next month |
| `↑` / `↓` | Previous / Next year |
| `Home` / `T` | Go to today |

<br>

## 📝 Event Structure

```typescript
interface CalendarEvent {
    id?: string | number;
    title: string;

    category: string;      // 'holiday', 'meeting', 'booking', etc.
    categoryTitle?: string // Category display

    color?: string;        // Custom color for the event dot

    startDate: string;     // '1403-07-15' or '*-07-15' (yearly)
    startTime?: string;    // '14:00' (for DayView)
    endTime?: string;      // '16:00' (for DayView)

    metadata?: Record<string, any>;  // Any custom data
}
```

<br>

## 🎯 CalendarInput Component

A smart, dynamic date/time input that works with any format and validates in real-time.

### Features

| Feature | Description |
|---------|-------------|
| **Dynamic Format** | Any format with any separators (`yyyy/mm/dd`, `yyyy-mm-dd hh:mi`, etc.) |
| **Smart Validation** | Prevents invalid numbers, auto-corrects on blur |
| **Jalali Engine** | Day validation based on actual month (29/30/31 days) |
| **Time Diff Display** | Shows "x days ago" or "x days later" under the hint |
| **Auto-Tab** | Automatically jumps to next field when filled |
| **Keyboard Navigation** | Arrow keys, backspace, delete, tab |
| **RTL Support** | Works perfectly with Persian text |

### Usage Examples

```vue
<!-- Date only (Jalali) -->
<CalendarInput 
    format="yyyy/mm/dd"
    v-model="date"
/>

<!-- Date with Gregorian output -->
<CalendarInput 
    format="yyyy-mm-dd"
    v-model="gregorianDate"
    output-format="gregorian"
/>

<!-- Time only -->
<CalendarInput 
    format="hh:mi:ss"
    v-model="time"
/>

<!-- Date and Time -->
<CalendarInput 
    format="yyyy/mm/dd hh:mi"
    v-model="datetime"
/>

<!-- Disabled / Readonly -->
<CalendarInput 
    format="yyyy/mm/dd"
    v-model="date"
    disabled
/>
```

### Format Parts

| Part | Description | Example |
|------|-------------|---------|
| `yyyy` | Year (4 digits) | 1403 |
| `mm` | Month (01-12) | 02 |
| `dd` | Day (01-31) | 15 |
| `hh` | Hour (00-23) | 14 |
| `mi` | Minute (00-59) | 30 |
| `ss` | Second (00-59) | 45 |

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `format` | string | `'yyyy/mm/dd'` | Date/time format |
| `modelValue` | string | `''` | Bound value (Jalali or ISO) |
| `outputFormat` | `'jalali' \| 'gregorian'` | `'jalali'` | Output format |
| `disabled` | boolean | `false` | Disable input |
| `readonly` | boolean | `false` | Readonly mode |

### Smart Validation Rules

| Field | First Digit Limit | Range | Dynamic |
|-------|------------------|-------|---------|
| Year | None | 1-1500 | - |
| Month | 0-1 | 01-12 | - |
| Day | 0-3 | 01-31 | Based on selected month/year |
| Hour | 0-2 | 00-23 | - |
| Minute | 0-5 | 00-59 | - |

<br>

## 🗺️ Roadmap

| Feature | Status |
|---------|--------|
| **NPM Package** | 🔜 Easy installation |
| **Range Selection** | 🔜 Select date ranges for booking |
| **Drag & Drop Events** | 🔜 Move events between dates |
| **Heatmap View** | 🔜 Visual event intensity |
| **Week Numbers** | 🔜 Show week of the year |
| **More Themes** | 🔜 Community contributions |

<br>

## 🙏 Thank You

I've been working on this for a while because of the current situation in IRAN, and I know if I share this repo many of you will be waiting. Sorry for the delay — I wanted to make sure it was actually useful before sharing.

> ![info]
> Since I can't use npm I can't created package, you need to use this locally from source code!

<br>

## 📄 License

**MIT** — Use it anywhere, no questions asked.

<br>

## 🤝 Contributing

Found a bug? Have an idea? Open an issue or PR. Let's make this better together.

<br>

---

<div align="center">
    <b>Made with ❤️ for the Persian community and open source friends everywhere.</b>
    <br>
    <i>Hope you find this helpful.</i>
</div>