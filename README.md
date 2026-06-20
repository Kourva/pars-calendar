<div align="center">
    <h1>📅 Pars Calendar</h1>
    <p><strong>A beautiful, theme-ready Jalali (Persian) calendar component for Vue 3+ & Nuxt 3+</strong></p>    
    <br>
    <p>
        <img src="https://img.shields.io/badge/Vue-3.x+-green" alt="Vue 3">
        <img src="https://img.shields.io/badge/Nuxt-3.x+-green" alt="Nuxt 3">
        <img src="https://img.shields.io/badge/TypeScript-blue" alt="TypeScript">
        <img src="https://img.shields.io/badge/License-MIT-magenta" alt="MIT License">
    </p>
</div>

<br>

## 💝 Why I Built This

Every Persian calendar project I worked on needed the same fixes:

- 🔄 RTL layout support
- 📅 Friday as weekend
- 🌙 Accurate Jalali date conversion
- 🎨 Event colors that don't break
- 💰 And most importantly — **it's never FREE!**

Premium WordPress calendars cost $20-50. Other solutions are either:

- ❌ Outdated (jQuery, no modern Vue support)
- ❌ Overly complex (full backend plugins)
- ❌ Basic widgets (just a date picker, not a full calendar)
- ❌ Poorly designed (no themes, no customization)

**So I built my own.**

After days of work, it's finally ready. **Free. Open. Yours.**

### *"Not to be the best. Just to be useful."*

Use it, break it, fix it, share it. Let's build better Persian tools together.

<br>

## ✨ Features at a Glance

| Feature | Description |
|---------|-------------|
| 🌙 **Jalali Calendar** | Accurate Persian date conversion |
| 🎨 **114+ Premium Themes** | Netflix, Tiffany, Spotify, Iran, and 100+ more |
| 📱 **Fully Responsive** | Works on mobile, tablet, desktop |
| ⌨️ **Keyboard Shortcuts** | Navigate like a pro |
| 📅 **Event System** | Add events with categories & colors |
| 🔁 **Yearly Recurring** | Use `*-1-1` for Nowruz every year |
| 🎯 **Today Highlight** | Never lose track |
| ⚡ **Haptic Feedback** | Nothing Phone optimized |
| 🌍 **Dual Display** | See both Jalali & Gregorian at a glance |
| 🖱️ **Smart Input** | Dynamic date/time input with auto-validation |
| 📆 **5 Views** | Month, Week, Day, Agenda, Year |
| 🧩 **DateTimeInput** | Format-aware date/time input component |

There are some issues and other features that need to be fixed or added, i will do it later...

<br>

## 🚀 Quick Start

### Installation

> [!CAUTION]
> Currently, I don't have access to npm so there is no package to install! just copy and paste the code and use it.

```bash
npm install @kourva/pars-calendar
```
Please change the way you import it if you copy and pasted it, correct the **PATH**

### Basic Usage

```vue
<template>
    <ParsCalendar 
        theme="light"
        :events="myEvents"
        @select-date="handleDateSelect"
    />
</template>

<script setup>
import { ParsCalendar } from '@kourva/pars-calendar'
import '@kourva/pars-calendar/assets/pars-calendar.css'

const myEvents = [
    {
        id: 1,
        title: "جلسه کاری",
        category: "meeting",
        categoryTitle: "جلسات کاری",
        color: "#3b82f6",
        startDate: "1405-07-15",
        startTime: "14:00"
    }
]

const handleDateSelect = (date) => {
    console.log('Selected:', date.jalali)
}
</script>
```

### With v-model Control

```vue
<template>
    <ParsCalendar 
        v-model:year="year"
        v-model:month="month"
        v-model:day="day"
        @select-date="handleDateSelect"
    />
</template>

<script setup>
const year = ref(1403)
const month = ref(7)
const day = ref(15)
</script>
```

### Using Different Views

```vue
<!-- Month view (default) -->
<ParsCalendar view="month" />

<!-- Week view -->
<ParsCalendar view="week" />

<!-- Day view -->
<ParsCalendar view="day" />

<!-- Agenda list view -->
<ParsCalendar view="agenda" />

<!-- Year overview -->
<ParsCalendar view="year" />
```

<br>

## 🎨 One Component, Infinite Looks

```vue
<!-- Just change the theme prop -->
<ParsCalendar theme="light" />      <!-- Clean white -->
<ParsCalendar theme="dark" />       <!-- Dark mode -->
<ParsCalendar theme="netflix" />    <!-- Bold & dramatic -->
<ParsCalendar theme="tiffany" />    <!-- Elegant & fresh -->
<ParsCalendar theme="iran" />       <!-- Proud & premium -->
<ParsCalendar theme="glass" />      <!-- Modern & sleek -->
<ParsCalendar theme="oled" />       <!-- Pure black -->
```

**114+ themes ready to use.** Zero CSS conflicts. 

You can also create custom themes by extending the CSS variables.

<br>

## 📝 Event Structure

```typescript
interface CalendarEvent {
    id?: string | number;           // Unique identifier
    title: string;                  // Event title
    category: string;               // 'holiday', 'meeting', 'booking', etc.
    color?: string;                 // Custom color (optional)
    startDate: string;              // '1403-07-15' or '*-07-15' (yearly)
    startTime?: string;             // '14:00' (for DayView)
    endTime?: string;               // '16:00' (for DayView)
    endDate?: string;               // For multi-day events
    metadata?: Record<string, any>; // Any custom data
}
```

<br>

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` / `→` | Previous / Next month |
| `↑` / `↓` | Previous / Next year |
| `Home` / `T` | Go to today |

<br>

## 🧩 ParsDatePicker Component

A smart, dynamic date/time input that works with any format.

```vue
<!-- Date only -->
<ParsDatePicker format="yyyy/mm/dd" v-model="date" />

<!-- With time -->
<ParsDatePicker format="yyyy/mm/dd hh:mi" v-model="datetime" />

<!-- Gregorian output -->
<ParsDatePicker 
    format="yyyy-mm-dd" 
    v-model="gregorianDate"
    output-format="gregorian" 
/>
```

**Features:**
- ✅ Any format with any separators
- ✅ Smart validation (first-digit, range, Jalali day check)
- ✅ Auto-format on blur
- ✅ Keyboard navigation (arrows, tab, backspace)
- ✅ Time difference display ("x days ago/later")
- ✅ Disabled/readonly states

> [!TIP]
> The design of the date picker is solid and transparent so you can wrap it inside your style just like your other UI components!

<br>

## 🧩 Nuxt 3 Usage

Since the calendar uses browser APIs, wrap it in `ClientOnly`:

```vue
<template>
    <ClientOnly>
        <ParsCalendar theme="light" />
    </ClientOnly>
</template>
```

<br>

## 📚 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `CalendarTheme` | `'light'` | Calendar theme |
| `view` | `CalendarView` | `'month'` | Initial view |
| `events` | `CalendarEvent[]` | `[]` | Array of events |
| `year` | `number` | `today` | Current year (v-model) |
| `month` | `number` | `today` | Current month 1-12 (v-model) |
| `day` | `number` | `today` | Current day (v-model) |
| `loading` | `boolean` | `false` | Show loading skeleton |
| `disabled` | `boolean` | `false` | Disable entire calendar |
| `filterCategories` | `string[]` | `[]` | Show only specific categories |
| `showKeyboardHint` | `boolean` | `true` | Show/hide keyboard shortcuts |
| `showLegends` | `boolean` | `true` | Show/hide category legends |

### Emits

| Emit | Payload | Description |
|------|---------|-------------|
| `update:year` | `(year: number)` | Year changed |
| `update:month` | `(month: number)` | Month changed |
| `update:day` | `(day: number)` | Day changed |
| `select-date` | `(date: object)` | User clicked a date |
| `select-event` | `(event: object)` | User clicked an event |
| `view-change` | `(view: CalendarView)` | View changed |

<br>

## 🙏 Thank You

I've been working on this for a while. I know many of you have been waiting.

Sorry for the delay — I wanted to make sure it was actually **useful** before sharing.

Now it's ready.

**Go build something beautiful with it.**

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

