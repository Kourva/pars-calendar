<template>
    <div class="time-container" :key="currentTime">
        {{ currentTime }}
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const currentTime = ref(null)

function updateTime(){
    const now = new Date()
    currentTime.value = new Intl.DateTimeFormat("fa-IR", {
        calendar: "persian",
        timeZone: "Asia/Tehran",
        timeStyle: "full",
        dateStyle: "full"
    }).format(now)
}

setInterval(updateTime, 1000)
</script>

<style scoped>
.time-container {
    position: relative;
}
</style>
