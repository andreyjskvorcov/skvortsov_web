<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';

const elapsed = ref(0);
const laps = ref<number[]>([]);
const running = ref(false);

let startedAt = 0;
let timer: number | undefined;

function start() {
  startedAt = performance.now() - elapsed.value;
  timer = window.setInterval(() => (elapsed.value = performance.now() - startedAt), 31);
  running.value = true;
}

function stop() {
  window.clearInterval(timer);
  running.value = false;
}

function reset() {
  stop();
  elapsed.value = 0;
  laps.value = [];
}

function lap() {
  laps.value.unshift(elapsed.value);
}

const format = (ms: number) => {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return [m, s, cs].map((n) => String(n).padStart(2, '0')).join(':');
};

const time = computed(() => format(elapsed.value));

onUnmounted(stop);

const button = 'h-9 rounded-md px-4 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50';
</script>

<template>
  <div class="mx-auto grid max-w-sm gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
    <p class="text-center font-mono text-5xl font-bold tabular-nums">{{ time }}</p>

    <div class="flex justify-center gap-2">
      <button
        v-if="!running"
        type="button"
        :class="[button, 'bg-primary text-primary-foreground hover:bg-primary/90']"
        @click="start"
      >
        Старт
      </button>
      <button v-else type="button" :class="[button, 'bg-primary text-primary-foreground hover:bg-primary/90']" @click="stop">
        Пауза
      </button>
      <button type="button" :class="[button, 'border bg-background hover:bg-accent']" :disabled="!running" @click="lap">
        Круг
      </button>
      <button type="button" :class="[button, 'hover:bg-accent']" :disabled="!elapsed" @click="reset">Сброс</button>
    </div>

    <ol v-if="laps.length" class="grid gap-1 border-t pt-4 font-mono text-sm tabular-nums">
      <li v-for="(t, i) in laps" :key="laps.length - i" class="flex justify-between text-muted-foreground">
        <span>Круг {{ laps.length - i }}</span>
        <span class="text-foreground">{{ format(t) }}</span>
      </li>
    </ol>
  </div>
</template>
